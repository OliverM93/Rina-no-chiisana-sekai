import { describe, expect, it } from 'vitest';
import { canDig, createPet, markDug, normalizePet, petDog } from './pet';

describe('Winston', () => {
  it('erstes Streicheln am Tag zählt besonders', () => {
    const p = createPet();
    expect(petDog(p, '2026-11-04')).toBe(true);
    expect(petDog(p, '2026-11-04')).toBe(false);
    expect(petDog(p, '2026-11-05')).toBe(true);
    expect(p.pets).toBe(3);
  });

  it('buddelt einmal am Tag', () => {
    const p = createPet();
    expect(canDig(p, '2026-11-04')).toBe(true);
    markDug(p, '2026-11-04');
    expect(canDig(p, '2026-11-04')).toBe(false);
    expect(canDig(p, '2026-11-05')).toBe(true);
  });

  it('normalisiert kaputte Daten', () => {
    expect(normalizePet(null)).toEqual(createPet());
    expect(normalizePet({ pets: -3, digDay: 5, pettedDay: '2026-01-01' })).toEqual({ pets: 0, digDay: '', pettedDay: '2026-01-01' });
  });
});
