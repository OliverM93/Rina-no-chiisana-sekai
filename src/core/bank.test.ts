import { describe, expect, it } from 'vitest';
import { borrow, canBorrow, createBank, creditInterest, deposit, INTEREST_CAP, monthsBetween, normalizeBank, repay, withdraw } from './bank';

describe('Dorfkasse', () => {
  it('zinsloser Kredit, zurückzahlen wann man will', () => {
    const b = createBank();
    expect(borrow(b, 9800)).toBe(true);
    expect(canBorrow(b)).toBe(false);
    expect(borrow(b, 100)).toBe(false);
    expect(repay(b, 5000, 3000)).toBe(3000); // nur so viel, wie man hat
    expect(b.loan).toBe(6800);
    expect(repay(b, 99999, 99999)).toBe(6800); // nicht mehr als man schuldet
    expect(b.loan).toBe(0);
    expect(canBorrow(b)).toBe(true);
    expect(normalizeBank({ loan: -5 })).toEqual(createBank());
  });

  it('Sparbuch: einzahlen, abheben, jederzeit und ohne Gebühr', () => {
    const b = createBank();
    expect(deposit(b, 5000, 3000, '2026-03-14')).toBe(3000); // nur so viel, wie man dabeihat
    expect(b.savings).toBe(3000);
    expect(b.interestMonth).toBe('2026-03');
    expect(withdraw(b, 99999)).toBe(3000);
    expect(b.savings).toBe(0);
    expect(deposit(b, -5, 100, '2026-03-14')).toBe(0);
  });

  it('Zinsen: 1 % am Monatsanfang, Zinseszins, verpasste Monate werden nachgeholt', () => {
    const b = createBank();
    deposit(b, 10000, 10000, '2026-03-14');
    expect(creditInterest(b, '2026-03-31')).toBe(0); // gleicher Monat
    expect(creditInterest(b, '2026-04-01')).toBe(100);
    expect(b.savings).toBe(10100);
    expect(creditInterest(b, '2026-04-20')).toBe(0); // nur einmal pro Monat
    expect(creditInterest(b, '2026-06-02')).toBe(101 + 102); // Mai + Juni
    expect(b.savings).toBe(10303);
    expect(b.lastInterest).toBe(203);
  });

  it('Zinsen haben eine Obergrenze und starten erst mit dem Sparbuch', () => {
    const rich = createBank();
    deposit(rich, 1_000_000, 1_000_000, '2026-01-10');
    expect(creditInterest(rich, '2026-02-01')).toBe(INTEREST_CAP);
    const none = createBank();
    expect(creditInterest(none, '2026-02-01')).toBe(0);
    expect(none.interestMonth).toBe('');
    expect(monthsBetween('2025-11', '2026-02')).toBe(3);
  });

  it('alte Spielstände ohne Sparbuch werden ergänzt', () => {
    expect(normalizeBank({ loan: 500 })).toEqual({ loan: 500, savings: 0, interestMonth: '', lastInterest: 0 });
    expect(normalizeBank({ loan: 0, savings: 1234.7, interestMonth: 'kaputt' }).interestMonth).toBe('');
  });
});
