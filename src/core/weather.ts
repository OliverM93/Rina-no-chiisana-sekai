/**
 * Wetter: jeden Tag zufällig, aber reproduzierbar – an einem Tag ist das
 * Wetter immer gleich, egal wie oft man das Spiel öffnet.
 *
 * Regen, Gewitter und Schnee dauern nur ein paar Stunden; davor und danach
 * ist es bewölkt. Nach manchem Regen am Tag gibt es eine Stunde lang einen
 * Regenbogen. An Linas Geburtstag scheint immer die Sonne, an Heiligabend
 * schneit es.
 */
import { hashString, mulberry32 } from './rng';
import { DEFAULT_LINA_BIRTHDAY, formatIsoDay, getSeason, type Season } from './time';

export type WeatherKind = 'sonnig' | 'wolkig' | 'regen' | 'gewitter' | 'schnee';

export const WEATHER_KINDS: readonly WeatherKind[] = ['sonnig', 'wolkig', 'regen', 'gewitter', 'schnee'];

export const WEATHER_LABELS: Record<WeatherKind, string> = {
  sonnig: 'Sonnig',
  wolkig: 'Bewölkt',
  regen: 'Regen',
  gewitter: 'Gewitter',
  schnee: 'Schnee',
};

export const WEATHER_ICONS: Record<WeatherKind, string> = {
  sonnig: '☀️',
  wolkig: '⛅',
  regen: '🌧️',
  gewitter: '⛈️',
  schnee: '❄️',
};

/** Wetter eines ganzen Tages */
export interface DayWeather {
  /** Grundwetter des Tages */
  kind: WeatherKind;
  /** Bei Regen/Gewitter/Schnee: von–bis (Stunden, bis = exklusiv) */
  from: number;
  to: number;
  /** Regenbogen in der Stunde nach dem Regen */
  rainbow: boolean;
}

/** Wetter in diesem Moment */
export interface WeatherNow {
  kind: WeatherKind;
  rainbow: boolean;
  /** 0 = klar … 1 = dicht bewölkt (für Licht & Himmel) */
  clouds: number;
  /** Hat es heute schon geregnet/geschneit (z. B. Beete gegossen)? */
  rainedToday: boolean;
}

const CHANCES: Record<Season, Array<[WeatherKind, number]>> = {
  fruehling: [['sonnig', 40], ['wolkig', 30], ['regen', 30]],
  sommer: [['sonnig', 55], ['wolkig', 20], ['regen', 15], ['gewitter', 10]],
  herbst: [['sonnig', 30], ['wolkig', 35], ['regen', 35]],
  winter: [['sonnig', 25], ['wolkig', 35], ['schnee', 40]],
};

const isWet = (k: WeatherKind) => k === 'regen' || k === 'gewitter' || k === 'schnee';

/** Wetter für einen Tag (JJJJ-MM-TT) */
export function weatherForDay(day: string, season: Season): DayWeather {
  const [, m, d] = day.split('-').map(Number);
  if (m === DEFAULT_LINA_BIRTHDAY.month && d === DEFAULT_LINA_BIRTHDAY.day) return { kind: 'sonnig', from: 0, to: 0, rainbow: false };
  if (m === 12 && d === 24) return { kind: 'schnee', from: 14, to: 24, rainbow: false };
  const rnd = mulberry32(hashString(`wetter:${day}`));
  const table = CHANCES[season];
  const total = table.reduce((s, [, w]) => s + w, 0);
  let r = rnd() * total;
  let kind: WeatherKind = table[0][0];
  for (const [k, w] of table) {
    r -= w;
    if (r < 0) {
      kind = k;
      break;
    }
  }
  if (!isWet(kind)) return { kind, from: 0, to: 0, rainbow: false };
  const from = Math.floor(rnd() * 14); // beginnt zwischen 0 und 13 Uhr
  const to = Math.min(24, from + 4 + Math.floor(rnd() * 7)); // dauert 4–10 Stunden
  const rainbow = kind !== 'schnee' && to >= 8 && to <= 18 && rnd() < 0.6;
  return { kind, from, to, rainbow };
}

/** Wetter zu einem Zeitpunkt. `override` (z. B. aus der URL) erzwingt ein Wetter. */
export function weatherAt(date: Date, override?: WeatherKind | 'regenbogen' | null): WeatherNow {
  if (override === 'regenbogen') return { kind: 'sonnig', rainbow: true, clouds: 0.2, rainedToday: true };
  if (override) return { kind: override, rainbow: false, clouds: cloudsOf(override), rainedToday: isWet(override) };
  const day = weatherForDay(formatIsoDay(date), getSeason(date));
  const hour = date.getHours();
  if (!isWet(day.kind)) return { kind: day.kind, rainbow: false, clouds: cloudsOf(day.kind), rainedToday: false };
  if (hour >= day.from && hour < day.to) return { kind: day.kind, rainbow: false, clouds: cloudsOf(day.kind), rainedToday: true };
  const after = hour >= day.to;
  if (after && day.rainbow && hour === day.to) return { kind: 'sonnig', rainbow: true, clouds: 0.25, rainedToday: true };
  return { kind: 'wolkig', rainbow: false, clouds: cloudsOf('wolkig'), rainedToday: after };
}

function cloudsOf(kind: WeatherKind): number {
  return { sonnig: 0, wolkig: 0.45, regen: 0.8, gewitter: 1, schnee: 0.65 }[kind];
}

/** Liest `?wetter=regen` (zum Testen). */
export function parseWeatherOverride(search: string): WeatherKind | 'regenbogen' | null {
  const v = new URLSearchParams(search).get('wetter');
  if (v === 'regenbogen') return v;
  return WEATHER_KINDS.includes(v as WeatherKind) ? (v as WeatherKind) : null;
}

/** Regnet oder schneit es gerade? */
export function isPrecipitation(kind: WeatherKind): boolean {
  return isWet(kind);
}
