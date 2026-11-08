import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { createNpcState } from '../core/friendship';
import { catchUpHeartLetters } from './gameplay';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

describe('Herz-Briefe nachliefern', () => {
  it('ältere Spielstände bekommen fehlende Briefe für schon erreichte Herzen – genau einmal', () => {
    const s = new Session(memoryStorage(), () => new Date('2026-11-08T12:00:00'));
    s.startNewGame(DEFAULT_LINA, 'Testdorf');
    // Christin hatte schon 5 Herzen, aber nur die alten Briefe (1 & 2) bekommen
    s.data!.npcs.christin = { ...createNpcState(), points: 400, rewards: [1, 2] };
    const before = JSON.stringify(s.data!.mail).length;
    expect(catchUpHeartLetters(s)).toBe(3);
    expect(s.data!.npcs.christin.rewards.sort()).toEqual([1, 2, 3, 4, 5]);
    const mail = JSON.stringify(s.data!.mail);
    expect(mail.length).toBeGreaterThan(before);
    for (const id of ['christin-herz-3', 'christin-herz-4', 'christin-herz-5']) expect(mail).toContain(id);
    expect(catchUpHeartLetters(s)).toBe(0);
  });

  it('Bewohner ohne Herzen bekommen nichts', () => {
    const s = new Session(memoryStorage(), () => new Date('2026-11-08T12:00:00'));
    s.startNewGame(DEFAULT_LINA, 'Testdorf');
    s.data!.npcs.lars = createNpcState();
    expect(catchUpHeartLetters(s)).toBe(0);
  });
});
