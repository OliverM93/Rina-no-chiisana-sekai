import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { TRICKS } from '../data/winston';
import { albumEntries, syncAlbum } from './album';
import { giveItem } from './gameplay';
import { learnedTricks, nextTrick, practiceNextTrick, showTrickLine, trickProgress } from './pet';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function fresh() {
  const m = new Map<string, string>();
  const storage: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  const s = new Session(storage, () => new Date('2026-06-10T12:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return s;
}

describe('Winston-Tricks', () => {
  it('ohne Keks passiert nichts und nichts geht verloren', () => {
    const s = fresh();
    const r = practiceNextTrick(s);
    expect(r.ok).toBe(false);
    expect(s.data!.pet.practice).toEqual({});
    expect(learnedTricks(s)).toEqual([]);
  });

  it('mit Keksen lernt er der Reihe nach alle Tricks und jeder Keks wird verbraucht', () => {
    const s = fresh();
    let kekse = 0;
    for (const t of TRICKS) {
      expect(nextTrick(s)?.id).toBe(t.id);
      for (let i = 0; i < t.practice; i++) {
        giveItem(s, 'keks', 1);
        kekse += 1;
        const r = practiceNextTrick(s);
        expect(r.ok).toBe(true);
        expect(r.learned).toBe(i === t.practice - 1);
      }
    }
    expect(learnedTricks(s).map((t) => t.id)).toEqual(TRICKS.map((t) => t.id));
    expect(nextTrick(s)).toBeNull();
    expect(trickProgress(s)).toBeNull();
    expect(kekse).toBe(TRICKS.reduce((a, t) => a + t.practice, 0));
    expect(practiceNextTrick(s).ok).toBe(false);
    expect(showTrickLine(s, 'rolle').length).toBeGreaterThan(5);
  });

  it('gelernte Tricks stehen im Album', () => {
    const s = fresh();
    for (let i = 0; i < 2; i++) {
      giveItem(s, 'keks', 1);
      practiceNextTrick(s);
    }
    syncAlbum(s);
    expect(albumEntries(s).some((e) => e.id === 'winston-trick-1')).toBe(true);
    expect(albumEntries(s).some((e) => e.id === 'winston-tricks-alle')).toBe(false);
  });
});
