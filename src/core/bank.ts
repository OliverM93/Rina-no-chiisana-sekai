/**
 * Olafs Dorfkasse: zinsloser Kredit für den Hausausbau. Kein Druck – man
 * zahlt zurück, wann und wie viel man möchte.
 */

export interface Bank {
  /** offener Kredit in Sternchen */
  loan: number;
}

export function createBank(): Bank {
  return { loan: 0 };
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

export function normalizeBank(raw: unknown): Bank {
  const b = createBank();
  if (raw && typeof raw === 'object' && typeof (raw as Bank).loan === 'number' && Number.isFinite((raw as Bank).loan)) b.loan = Math.max(0, Math.floor((raw as Bank).loan));
  return b;
}
