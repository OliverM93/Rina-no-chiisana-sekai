/**
 * Olafs Dorfkasse:
 * - zinsloser Kredit für den Hausausbau – zurückzahlen, wann und wie viel man möchte
 * - Sparbuch mit kleinen Zinsen: am Monatsanfang gibt es 1 % (höchstens 2000 Sternchen pro Monat),
 *   Ein- und Auszahlen geht jederzeit und kostet nichts
 */

export interface Bank {
  /** offener Kredit in Sternchen */
  loan: number;
  /** Guthaben auf dem Sparbuch */
  savings: number;
  /** Monat der letzten Zinsgutschrift („JJJJ-MM“), leer = Sparbuch noch nie benutzt */
  interestMonth: string;
  /** zuletzt gutgeschriebene Zinsen (zum Anzeigen) */
  lastInterest: number;
}

/** Zinssatz pro Monat */
export const INTEREST_RATE = 0.01;
/** höchstens so viele Zinsen pro Monat */
export const INTEREST_CAP = 2000;
/** so viele verpasste Monate werden höchstens nachgeholt */
const MAX_MONTHS = 12;

export function createBank(): Bank {
  return { loan: 0, savings: 0, interestMonth: '', lastInterest: 0 };
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

/** „JJJJ-MM“ aus einem Tag „JJJJ-MM-TT“ */
export function monthOf(day: string): string {
  return day.slice(0, 7);
}

/** Wie viele Monatswechsel liegen zwischen zwei Monaten („JJJJ-MM“)? */
export function monthsBetween(from: string, to: string): number {
  const [fy, fm] = from.split('-').map(Number);
  const [ty, tm] = to.split('-').map(Number);
  if (![fy, fm, ty, tm].every(Number.isFinite)) return 0;
  return (ty - fy) * 12 + (tm - fm);
}

/** Einzahlen (höchstens so viel, wie man dabeihat). Gibt den eingezahlten Betrag zurück. */
export function deposit(bank: Bank, amount: number, money: number, day: string): number {
  const put = Math.max(0, Math.min(Math.floor(amount), Math.floor(money)));
  if (put > 0 && !bank.interestMonth) bank.interestMonth = monthOf(day);
  bank.savings += put;
  return put;
}

/** Abheben (höchstens das Guthaben). Gibt den abgehobenen Betrag zurück. */
export function withdraw(bank: Bank, amount: number): number {
  const take = Math.max(0, Math.min(Math.floor(amount), bank.savings));
  bank.savings -= take;
  return take;
}

/** Zinsen eines Monats für ein Guthaben */
export function interestFor(savings: number): number {
  return Math.min(INTEREST_CAP, Math.floor(savings * INTEREST_RATE));
}

/**
 * Schreibt die Zinsen für alle seit der letzten Gutschrift begonnenen Monate gut (mit Zinseszins,
 * höchstens 12 Monate). Gibt die Summe zurück (0 = nichts passiert).
 */
export function creditInterest(bank: Bank, day: string): number {
  const month = monthOf(day);
  if (!bank.interestMonth) return 0;
  const months = Math.min(MAX_MONTHS, monthsBetween(bank.interestMonth, month));
  if (months <= 0) return 0;
  bank.interestMonth = month;
  let total = 0;
  for (let i = 0; i < months; i++) {
    const z = interestFor(bank.savings);
    bank.savings += z;
    total += z;
  }
  bank.lastInterest = total;
  return total;
}

export function normalizeBank(raw: unknown): Bank {
  const b = createBank();
  if (!raw || typeof raw !== 'object') return b;
  const r = raw as Record<string, unknown>;
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.floor(v)) : 0);
  b.loan = num(r.loan);
  b.savings = num(r.savings);
  b.lastInterest = num(r.lastInterest);
  b.interestMonth = typeof r.interestMonth === 'string' && /^\d{4}-\d{2}$/.test(r.interestMonth) ? r.interestMonth : '';
  return b;
}
