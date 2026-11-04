import { describe, expect, it } from 'vitest';
import { easterSunday, festivalsOn, isFireworkTime } from './festivals';

describe('Feste', () => {
  it('berechnet Ostersonntag', () => {
    expect(easterSunday(2026).toDateString()).toBe(new Date(2026, 3, 5).toDateString());
    expect(easterSunday(2027).toDateString()).toBe(new Date(2027, 2, 28).toDateString());
    expect(easterSunday(2025).toDateString()).toBe(new Date(2025, 3, 20).toDateString());
  });

  it('erkennt die Feste', () => {
    expect(festivalsOn(new Date(2026, 11, 24))).toEqual(['weihnachten']);
    expect(festivalsOn(new Date(2026, 11, 3))).toEqual(['advent']);
    expect(festivalsOn(new Date(2026, 11, 31))).toEqual(['silvester']);
    expect(festivalsOn(new Date(2027, 0, 1))).toEqual(['neujahr']);
    expect(festivalsOn(new Date(2026, 9, 31))).toEqual(['halloween']);
    expect(festivalsOn(new Date(2026, 3, 6))).toEqual(['ostern']);
    expect(festivalsOn(new Date(2026, 5, 16), { day: 16, month: 6 })).toEqual(['geburtstag']);
    expect(festivalsOn(new Date(2026, 6, 10), { day: 16, month: 6 })).toEqual([]);
  });

  it('Feuerwerk an Silvester ab 20 Uhr', () => {
    expect(isFireworkTime(new Date(2026, 11, 31, 19, 59))).toBe(false);
    expect(isFireworkTime(new Date(2026, 11, 31, 23, 0))).toBe(true);
    expect(isFireworkTime(new Date(2027, 0, 1, 0, 30))).toBe(true);
    expect(isFireworkTime(new Date(2027, 0, 1, 1, 0))).toBe(false);
  });
});
