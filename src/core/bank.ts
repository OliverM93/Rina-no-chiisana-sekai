/**
 * Olafs Dorfkasse:
 * - zinsloser Kredit für den Hausausbau – zurückzahlen, wann und wie viel man möchte
 * - Sparbuch: jede Woche (ab Montag) 5 % Zinsen, höchstens 2 500 Sternchen pro Woche; verpasste Wochen
 *   werden nachgeholt (bis zu 26). Ein- und Auszahlen geht jederzeit und kostet nichts.
 * - „Olafs Bausparen“: Wer einen Ausbau direkt vom Sparbuch bezahlt, bekommt 25 % von Papa dazu
 *   (siehe `game/home.ts → orderExpansion`).
 */

export interface Bank {
  /** offener Kredit in Sternchen */
  loan: number;
  /** Guthaben auf dem Sparbuch */
  savings: number;
  /** Woche der letzten Zinsgutschrift (Montag „JJJJ-MM-TT“), leer = Sparbuch noch nie benutzt */
  interestWeek: string;
  /** zuletzt gutgeschriebene Zinsen (zum Anzeigen) */
  lastInterest: number;
}

/** Zinssatz pro Woche */
export const INTEREST_RATE = 0.05;
/** höchstens so viele Zinsen pro Woche */
export const INTEREST_CAP = 2500;
/** so viele verpasste Wochen werden höchstens nachgeholt (ein halbes Jahr) */
const MAX_WEEKS = 26;
/** Olafs Bauspar-Zuschuss: Anteil am Ausbaupreis, den Papa übernimmt, wenn vom Sparbuch bezahlt wird */
export const BAUSPAR_BONUS = 0.25;

/** Was Lina vom Sparbuch zahlen muss, damit Olaf den Rest dazulegt */
export function bausparShare(price: number): number {
  return Math.ceil(price * (1 - BAUSPAR_BONUS));
}

export function createBank(): Bank {
  return { loan: 0, savings: 0, interestWeek: '', lastInterest: 0 };
}

/** Darf ein neuer Ausbau bestellt werden? (erst, wenn der alte Kredit bezahlt ist) */
export function canBorrow(bank: Bank): boolean {
  return bank.loan <= 0;
}

export function borrow(bank: Bank, amount: number): boolean {
  if (!canBorrow(bank) || amount <= 0) return false;
  bank.loan = Math.floor(amount);
  return true;
}

/** Zahlt bis zu `amount` zurück (höchstens so viel, wie man hat und schuldet). Gibt den gezahlten Betrag zurück. */
export function repay(bank: Bank, amount: number, money: number): number {
  const pay = Math.max(0, Math.min(Math.floor(amount), Math.floor(money), bank.loan));
  bank.loan -= pay;
  return pay;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Montag der Woche eines Tages „JJJJ-MM-TT“ (ebenfalls „JJJJ-MM-TT“) */
export function weekOf(day: string): string {
  const t = Date.UTC(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8, 10)));
  const weekday = (new Date(t).getUTCDay() + 6) % 7; // Montag = 0
  return new Date(t - weekday * DAY_MS).toISOString().slice(0, 10);
}

/** Wie viele Wochenwechsel liegen zwischen zwei Wochen-Montagen? */
export function weeksBetween(from: string, to: string): number {
  const a = Date.parse(`${from}T00:00:00Z`);
  const b = Date.parse(`${to}T00:00:00Z`);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
  return Math.round((b - a) / (7 * DAY_MS));
}

/** Einzahlen (höchstens so viel, wie man dabeihat). Gibt den eingezahlten Betrag zurück. */
export function deposit(bank: Bank, amount: number, money: number, day: string): number {
  const put = Math.max(0, Math.min(Math.floor(amount), Math.floor(money)));
  if (put > 0 && !bank.interestWeek) bank.interestWeek = weekOf(day);
  bank.savings += put;
  return put;
}

/** Abheben (höchstens das Guthaben). Gibt den abgehobenen Betrag zurück. */
export function withdraw(bank: Bank, amount: number): number {
  const take = Math.max(0, Math.min(Math.floor(amount), bank.savings));
  bank.savings -= take;
  return take;
}

/** Zinsen einer Woche für ein Guthaben */
export function interestFor(savings: number): number {
  return Math.min(INTEREST_CAP, Math.floor(savings * INTEREST_RATE));
}

/**
 * Schreibt die Zinsen für alle seit der letzten Gutschrift begonnenen Wochen gut (mit Zinseszins,
 * höchstens 26 Wochen). Gibt die Summe zurück (0 = nichts passiert).
 */
export function creditInterest(bank: Bank, day: string): number {
  const week = weekOf(day);
  if (!bank.interestWeek) return 0;
  const weeks = Math.min(MAX_WEEKS, weeksBetween(bank.interestWeek, week));
  if (weeks <= 0) return 0;
  bank.interestWeek = week;
  let total = 0;
  for (let i = 0; i < weeks; i++) {
    const z = interestFor(bank.savings);
    bank.savings += z;
    total += z;
  }
  bank.lastInterest = total;
  return total;
}

/** Alter Zinsmonat „JJJJ-MM“ (bis Spielstand v14) → Montag der Woche des Monatsersten */
export function weekFromLegacyMonth(month: string): string {
  return /^\d{4}-\d{2}$/.test(month) ? weekOf(`${month}-01`) : '';
}

export function normalizeBank(raw: unknown): Bank {
  const b = createBank();
  if (!raw || typeof raw !== 'object') return b;
  const r = raw as Record<string, unknown>;
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.floor(v)) : 0);
  b.loan = num(r.loan);
  b.savings = num(r.savings);
  b.lastInterest = num(r.lastInterest);
  if (typeof r.interestWeek === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.interestWeek)) b.interestWeek = weekOf(r.interestWeek);
  else if (typeof r.interestMonth === 'string') b.interestWeek = weekFromLegacyMonth(r.interestMonth);
  return b;
}
