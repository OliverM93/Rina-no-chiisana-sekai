import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import { addItem } from '../core/inventory';
import type { StorageLike } from '../core/save';
import { isKnownItem, maxStackOf } from '../data/items';
import { MATTEO_LETTERS, MATTEO_NAME } from '../data/matteo';
import { wishFlag } from '../data/wishes';
import { checkMatteoLetters, matteoDays } from './matteo';
import { activeWish, fulfillWish } from './wishes';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

function fresh() {
  let now = new Date('2026-05-01T12:00:00');
  const s = new Session(memoryStorage(), () => now);
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  s.data!.flags.thaliaBegruesst = true;
  return { s, set: (d: string) => (now = new Date(d)) };
}

describe('Pater Matteo – Thalias Brieffreund', () => {
  it('Briefe haben Geschenke, die es gibt, und kommen in aufsteigenden Abständen', () => {
    for (const l of MATTEO_LETTERS) {
      if (l.gift) expect(isKnownItem(l.gift.itemId), l.id).toBe(true);
      expect(l.body.length).toBeGreaterThan(200);
    }
    const days = MATTEO_LETTERS.map((l) => l.afterDays);
    expect([...days].sort((a, b) => a - b)).toEqual(days);
  });

  it('der Wunsch kommt nach der Party, braucht Bergkristall, Kekse und Porto', () => {
    const { s } = fresh();
    s.data!.flags[wishFlag('thalia-aussicht')] = true;
    s.data!.flags[wishFlag('thalia-party')] = true;
    const w = activeWish(s, 'thalia')!;
    expect(w.id).toBe('thalia-matteo');
    s.data!.money = 100;
    addItem(s.data!.inventory, 'bergkristall', 1, maxStackOf);
    addItem(s.data!.inventory, 'lavendelkekse', 1, maxStackOf);
    expect(fulfillWish(s, 'thalia')).not.toBeNull();
    expect(s.data!.money).toBe(0);
    expect(matteoDays(s)).toBe(0);
  });

  it('Briefe kommen erst nach dem Päckchen, jeder genau einmal, die Tasse zuletzt', () => {
    const { s, set } = fresh();
    expect(checkMatteoLetters(s)).toBe(0);
    s.data!.flags[wishFlag('thalia-matteo')] = true;
    s.data!.world.dates['wunsch-datum-thalia-matteo'] = '2026-05-01';
    expect(checkMatteoLetters(s)).toBe(0); // noch am selben Tag
    set('2026-05-03T12:00:00');
    expect(checkMatteoLetters(s)).toBe(1);
    expect(checkMatteoLetters(s)).toBe(0);
    set('2026-07-30T12:00:00');
    expect(checkMatteoLetters(s)).toBe(3);
    const letters = s.data!.mail.letters.filter((l) => l.from === MATTEO_NAME);
    expect(letters.length).toBe(4);
    expect(letters.some((l) => l.gift?.itemId === 'tasse-stadt-montecielo')).toBe(true);
    expect(checkMatteoLetters(s)).toBe(0);
  });
});
