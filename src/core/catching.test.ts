import { describe, expect, it } from 'vitest';
import { FISH, INSECTS } from '../data/species';
import { inHours, isAvailable, normalizeCollection, pickSpecies, registerCatch, type Collection } from './catching';

describe('Fangen', () => {
  it('Uhrzeiten auch über Mitternacht', () => {
    expect(inHours([0, 24], 3)).toBe(true);
    expect(inHours([19, 5], 23)).toBe(true);
    expect(inHours([19, 5], 2)).toBe(true);
    expect(inHours([19, 5], 12)).toBe(false);
    expect(inHours([8, 17], 17)).toBe(false);
  });

  it('beachtet Monat, Uhrzeit und Regen', () => {
    const snail = INSECTS.find((i) => i.id === 'weinbergschnecke')!;
    const may = new Date('2026-05-10T12:00:00');
    expect(isAvailable(snail, may, true)).toBe(true);
    expect(isAvailable(snail, may, false)).toBe(false);
    const eel = FISH.find((f) => f.id === 'aal')!;
    expect(isAvailable(eel, new Date('2026-07-01T23:00:00'), false)).toBe(true);
    expect(isAvailable(eel, new Date('2026-07-01T12:00:00'), false)).toBe(false);
    expect(isAvailable(eel, new Date('2026-01-01T23:00:00'), false)).toBe(false);
  });

  it('zu jeder Zeit gibt es Fische im Fluss und im Meer', () => {
    for (let m = 0; m < 12; m++) {
      for (let h = 0; h < 24; h++) {
        const d = new Date(2026, m, 15, h, 0);
        for (const hab of ['fluss', 'meer']) expect(FISH.some((f) => f.habitat === hab && isAvailable(f, d, false)), `${hab} ${m + 1}/${h}`).toBe(true);
      }
    }
  });

  it('gewichtete Auswahl', () => {
    const list = [{ id: 'a', weight: 1 }, { id: 'b', weight: 3 }];
    expect(pickSpecies(list, 0.1)?.id).toBe('a');
    expect(pickSpecies(list, 0.9)?.id).toBe('b');
    expect(pickSpecies([], 0.5)).toBe(null);
  });

  it('Sammelbuch zählt Fänge und merkt sich den ersten Tag', () => {
    const c: Collection = {};
    expect(registerCatch(c, 'barsch', '2026-05-01')).toBe(true);
    expect(registerCatch(c, 'barsch', '2026-05-02')).toBe(false);
    expect(c.barsch).toEqual({ count: 2, firstDay: '2026-05-01' });
    expect(normalizeCollection({ barsch: { count: 2, firstDay: 'x' }, quatsch: { count: 1 }, hecht: { count: 0 } }, (id) => id !== 'quatsch')).toEqual({ barsch: { count: 2, firstDay: 'x' } });
  });

  it('Arten-IDs sind eindeutig', () => {
    const ids = [...FISH, ...INSECTS].map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
