/**
 * Zeit & Kalender.
 *
 * Das Spiel läuft – wie im Vorbild – in Echtzeit nach der Systemuhr.
 * Für Tests und zum Ausprobieren lässt sich die Zeit per URL überschreiben,
 * z. B. `?zeit=21:30` oder `?datum=2026-12-24&zeit=18:00`.
 *
 * Dieses Modul ist bewusst frei von Phaser/DOM, damit es testbar bleibt.
 */

export type Season = 'fruehling' | 'sommer' | 'herbst' | 'winter';

export type DayPhase =
  | 'nacht'
  | 'morgendaemmerung'
  | 'morgen'
  | 'mittag'
  | 'nachmittag'
  | 'abend'
  | 'abenddaemmerung';

/** Liefert die aktuelle (Spiel-)Zeit. */
export type Clock = () => Date;

export const WEEKDAYS = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
] as const;

export const MONTHS = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
] as const;

export const SEASON_LABELS: Record<Season, string> = {
  fruehling: 'Frühling',
  sommer: 'Sommer',
  herbst: 'Herbst',
  winter: 'Winter',
};

export const SEASON_ICONS: Record<Season, string> = {
  fruehling: '🌸',
  sommer: '☀️',
  herbst: '🍂',
  winter: '❄️',
};

export const DAY_PHASE_LABELS: Record<DayPhase, string> = {
  nacht: 'Nacht',
  morgendaemmerung: 'Morgendämmerung',
  morgen: 'Morgen',
  mittag: 'Mittag',
  nachmittag: 'Nachmittag',
  abend: 'Abend',
  abenddaemmerung: 'Abenddämmerung',
};

/** Meteorologische Jahreszeiten (Nordhalbkugel). */
export function getSeason(date: Date): Season {
  const m = date.getMonth(); // 0 = Januar
  if (m >= 2 && m <= 4) return 'fruehling';
  if (m >= 5 && m <= 7) return 'sommer';
  if (m >= 8 && m <= 10) return 'herbst';
  return 'winter';
}

/** Minuten seit Mitternacht (0–1439, mit Sekundenbruchteil). */
export function minutesOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
}

export function getDayPhase(date: Date): DayPhase {
  const m = minutesOfDay(date);
  if (m < 5 * 60) return 'nacht';
  if (m < 7 * 60) return 'morgendaemmerung';
  if (m < 11 * 60) return 'morgen';
  if (m < 14 * 60) return 'mittag';
  if (m < 18 * 60) return 'nachmittag';
  if (m < 20 * 60) return 'abend';
  if (m < 22 * 60) return 'abenddaemmerung';
  return 'nacht';
}

const pad2 = (n: number) => String(n).padStart(2, '0');

/** „14:05“ */
export function formatTime(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

/** „Montag, 2. November“ */
export function formatDate(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()}. ${MONTHS[date.getMonth()]}`;
}

/** „2026-11-02“ (lokale Zeit) – praktisch für Dateinamen und Tages-Schlüssel. */
export function formatIsoDay(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

// ---------------------------------------------------------------------------
// Tageslicht
// ---------------------------------------------------------------------------

export interface Daylight {
  /** Farbe, mit der die Welt multipliziert wird (Weiß = keine Veränderung). */
  tint: string;
  /** 0 = heller Tag, 1 = tiefe Nacht. Steuert z. B. Laternen und Fensterlicht. */
  night: number;
}

interface LightKey {
  minute: number;
  tint: string;
  night: number;
}

/** Stützpunkte über den Tag; dazwischen wird weich interpoliert. */
const LIGHT_KEYS: LightKey[] = [
  { minute: 0, tint: '#6669ad', night: 1 },
  { minute: 4 * 60 + 30, tint: '#6669ad', night: 1 },
  { minute: 5 * 60 + 30, tint: '#ae97cc', night: 0.7 },
  { minute: 6 * 60 + 30, tint: '#ffdcd0', night: 0.25 },
  { minute: 8 * 60, tint: '#ffffff', night: 0 },
  { minute: 17 * 60, tint: '#ffffff', night: 0 },
  { minute: 18 * 60 + 30, tint: '#ffe7cc', night: 0.1 },
  { minute: 19 * 60 + 30, tint: '#f7c3cc', night: 0.35 },
  { minute: 20 * 60 + 30, tint: '#a497d0', night: 0.7 },
  { minute: 21 * 60 + 30, tint: '#6669ad', night: 1 },
  { minute: 24 * 60, tint: '#6669ad', night: 1 },
];

function lerpHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (shift: number) => {
    const ca = (pa >> shift) & 255;
    const cb = (pb >> shift) & 255;
    return Math.round(ca + (cb - ca) * t);
  };
  return '#' + ((1 << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).slice(1);
}

/** Weiche Kurve, damit Übergänge nicht linear-ruckelig wirken. */
const smooth = (t: number) => t * t * (3 - 2 * t);

export function getDaylight(date: Date): Daylight {
  const m = minutesOfDay(date);
  for (let i = 0; i < LIGHT_KEYS.length - 1; i++) {
    const a = LIGHT_KEYS[i];
    const b = LIGHT_KEYS[i + 1];
    if (m >= a.minute && m <= b.minute) {
      const span = b.minute - a.minute;
      const t = span === 0 ? 0 : smooth((m - a.minute) / span);
      return { tint: lerpHex(a.tint, b.tint, t), night: a.night + (b.night - a.night) * t };
    }
  }
  return { tint: LIGHT_KEYS[0].tint, night: 1 };
}

// ---------------------------------------------------------------------------
// Uhr mit optionaler Überschreibung (zum Testen)
// ---------------------------------------------------------------------------

export interface TimeOverride {
  /** Datum JJJJ-MM-TT */
  date?: { year: number; month: number; day: number };
  /** Uhrzeit HH:MM */
  time?: { hours: number; minutes: number };
}

/**
 * Liest `?zeit=HH:MM` und `?datum=JJJJ-MM-TT` aus einem Query-String.
 * Ungültige Werte werden ignoriert.
 */
export function parseTimeOverride(search: string): TimeOverride | null {
  const params = new URLSearchParams(search);
  const result: TimeOverride = {};

  const zeit = params.get('zeit');
  if (zeit) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(zeit.trim());
    if (m) {
      const hours = Number(m[1]);
      const minutes = Number(m[2]);
      if (hours <= 23 && minutes <= 59) result.time = { hours, minutes };
    }
  }

  const datum = params.get('datum');
  if (datum) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datum.trim());
    if (m) {
      const year = Number(m[1]);
      const month = Number(m[2]);
      const day = Number(m[3]);
      const probe = new Date(year, month - 1, day);
      if (probe.getFullYear() === year && probe.getMonth() === month - 1 && probe.getDate() === day) {
        result.date = { year, month, day };
      }
    }
  }

  return result.date || result.time ? result : null;
}

/**
 * Erzeugt eine Uhr. Ohne Überschreibung ist das einfach die Systemzeit.
 * Mit Überschreibung startet die Uhr beim gewünschten Zeitpunkt und läuft
 * dann normal weiter (damit Animationen & Tageslicht lebendig bleiben).
 */
export function createClock(override: TimeOverride | null, now: () => number = Date.now): Clock {
  if (!override) return () => new Date(now());

  const start = new Date(now());
  const target = new Date(start);
  if (override.date) {
    target.setFullYear(override.date.year, override.date.month - 1, override.date.day);
  }
  if (override.time) {
    target.setHours(override.time.hours, override.time.minutes, 0, 0);
  }
  const offset = target.getTime() - start.getTime();
  return () => new Date(now() + offset);
}

// ---------------------------------------------------------------------------
// Besondere Tage
// ---------------------------------------------------------------------------

export interface DayMonth {
  day: number;
  month: number; // 1–12
}

export function isSameDayMonth(date: Date, dm: DayMonth): boolean {
  return date.getDate() === dm.day && date.getMonth() + 1 === dm.month;
}

/** Linas Geburtstag (16. Juni) – im Spielstand änderbar. */
export const DEFAULT_LINA_BIRTHDAY: DayMonth = { day: 16, month: 6 };
