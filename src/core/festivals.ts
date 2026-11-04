/**
 * Feste im Jahreslauf: Advent, Weihnachten, Silvester, Neujahr, Ostern,
 * Halloween – und Linas Geburtstag. Reine Logik (nur Datum rein, Fest raus).
 */
import { type DayMonth, isSameDayMonth } from './time';

export type FestivalId = 'advent' | 'weihnachten' | 'silvester' | 'neujahr' | 'ostern' | 'halloween' | 'geburtstag';

/** Ostersonntag (Gaußsche Osterformel, gregorianisch) */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Welche Feste sind an diesem Tag? (Geburtstag zuerst, dann das größte Fest) */
export function festivalsOn(date: Date, birthday?: DayMonth): FestivalId[] {
  const out: FestivalId[] = [];
  if (birthday && isSameDayMonth(date, birthday)) out.push('geburtstag');
  const m = date.getMonth() + 1;
  const d = date.getDate();
  if (m === 12 && d >= 24 && d <= 26) out.push('weihnachten');
  else if (m === 12 && d < 24) out.push('advent');
  if (m === 12 && d === 31) out.push('silvester');
  if (m === 1 && d === 1) out.push('neujahr');
  if (m === 10 && d === 31) out.push('halloween');
  const easter = easterSunday(date.getFullYear());
  const monday = new Date(easter.getFullYear(), easter.getMonth(), easter.getDate() + 1);
  if (sameDay(date, easter) || sameDay(date, monday)) out.push('ostern');
  return out;
}

/** Tage bis zum nächsten Geburtstag (0 = heute) */
export function daysUntilBirthday(date: Date, b: DayMonth): number {
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  let next = new Date(date.getFullYear(), b.month - 1, b.day);
  if (next < today) next = new Date(date.getFullYear() + 1, b.month - 1, b.day);
  return Math.round((next.getTime() - today.getTime()) / 86400000);
}

/** Feuerwerk? (Silvester ab 20 Uhr bis Neujahr 1 Uhr) */
export function isFireworkTime(date: Date): boolean {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const h = date.getHours();
  return (m === 12 && d === 31 && h >= 20) || (m === 1 && d === 1 && h < 1);
}

/** Schlüssel für „schon bekommen“: Fest + Jahr (+ Bewohner) */
export function festKey(f: FestivalId, date: Date, who = ''): string {
  return `fest:${f}:${date.getFullYear()}${who ? `:${who}` : ''}`;
}
