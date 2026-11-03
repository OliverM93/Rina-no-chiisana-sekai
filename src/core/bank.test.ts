import { describe, expect, it } from 'vitest';
import { borrow, canBorrow, createBank, normalizeBank, repay } from './bank';

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
    expect(normalizeBank({ loan: -5 })).toEqual({ loan: 0 });
  });
});
