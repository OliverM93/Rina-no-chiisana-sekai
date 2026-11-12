import { describe, expect, it } from 'vitest';
import { bausparShare, borrow, canBorrow, createBank, creditInterest, deposit, INTEREST_CAP, normalizeBank, repay, weekFromLegacyMonth, weekOf, weeksBetween, withdraw } from './bank';

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
    expect(b.interestWeek).toBe('2026-03-09'); // Montag der Woche
    expect(withdraw(b, 99999)).toBe(3000);
    expect(b.savings).toBe(0);
    expect(deposit(b, -5, 100, '2026-03-14')).toBe(0);
  });

  it('Wochen beginnen am Montag', () => {
    expect(weekOf('2026-03-09')).toBe('2026-03-09');
    expect(weekOf('2026-03-15')).toBe('2026-03-09'); // Sonntag
    expect(weekOf('2026-03-16')).toBe('2026-03-16');
    expect(weeksBetween('2026-03-09', '2026-03-30')).toBe(3);
  });

  it('Zinsen: 2 % jede Woche, Zinseszins, verpasste Wochen werden nachgeholt', () => {
    const b = createBank();
    deposit(b, 10000, 10000, '2026-03-14');
    expect(creditInterest(b, '2026-03-15')).toBe(0); // gleiche Woche
    expect(creditInterest(b, '2026-03-16')).toBe(200);
    expect(b.savings).toBe(10200);
    expect(creditInterest(b, '2026-03-20')).toBe(0); // nur einmal pro Woche
    expect(creditInterest(b, '2026-04-01')).toBe(204 + 208); // zwei Wochen nachgeholt
    expect(b.savings).toBe(10612);
    expect(b.lastInterest).toBe(412);
  });

  it('Zinsen haben eine Obergrenze und starten erst mit dem Sparbuch', () => {
    const rich = createBank();
    deposit(rich, 1_000_000, 1_000_000, '2026-01-10');
    expect(creditInterest(rich, '2026-01-12')).toBe(INTEREST_CAP);
    const none = createBank();
    expect(creditInterest(none, '2026-02-01')).toBe(0);
    expect(none.interestWeek).toBe('');
  });

  it('Bausparen: Olaf übernimmt 15 % des Ausbaus', () => {
    expect(bausparShare(10000)).toBe(8500);
    expect(bausparShare(59800)).toBe(50830);
  });

  it('alte Spielstände: Sparbuch ergänzt, alter Zinsmonat wird zur Woche des Monatsersten', () => {
    expect(normalizeBank({ loan: 500 })).toEqual({ loan: 500, savings: 0, interestWeek: '', lastInterest: 0 });
    expect(normalizeBank({ loan: 0, savings: 1234.7, interestMonth: 'kaputt' }).interestWeek).toBe('');
    expect(normalizeBank({ savings: 100, interestMonth: '2026-04' }).interestWeek).toBe('2026-03-30');
    expect(weekFromLegacyMonth('2026-04')).toBe('2026-03-30');
  });
});
