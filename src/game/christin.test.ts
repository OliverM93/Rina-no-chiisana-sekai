import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { CHRISTIN, CHRISTIN_TIPS } from '../data/npcs/christin';
import { christinTip, christinWaters } from './christin';
import { currentWeather } from './nature';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

function sessionAt(iso: string) {
  let now = new Date(iso);
  const s = new Session(memoryStorage(), () => now);
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  s.data!.flags.olafBegruesst = true;
  s.data!.world.garden['7,11'] = { flower: 'tulpe', stage: 1, wateredDay: '', grewDay: '2026-07-01' };
  s.data!.world.garden['8,11'] = { flower: 'rose', stage: 3, wateredDay: '', grewDay: '2026-07-01' };
  return { s, set: (d: string) => (now = new Date(d)) };
}

describe('Christin', () => {
  it('gießt abends einmal, was noch durstig ist (Blüten nicht)', () => {
    // einen trockenen Tag suchen (bei Regen gießt der Himmel)
    let found = false;
    for (let d = 1; d <= 28 && !found; d++) {
      const day = `2026-07-${String(d).padStart(2, '0')}`;
      const { s, set } = sessionAt(`${day}T18:40:00`);
      if (currentWeather(s).rainedToday) continue;
      found = true;
      set(`${day}T17:00:00`);
      expect(christinWaters(s)).toEqual([]); // noch zu früh
      set(`${day}T18:40:00`);
      expect(christinWaters(s)).toEqual(['7,11']);
      expect(s.data!.world.garden['7,11'].wateredDay).toBe(day);
      expect(christinWaters(s)).toEqual([]); // nur einmal am Tag
    }
    expect(found).toBe(true);
  });

  it('gießt nicht, bevor sie eingezogen ist', () => {
    const { s } = sessionAt('2026-07-10T17:00:00');
    s.data!.flags.olafBegruesst = false;
    expect(christinWaters(s)).toEqual([]);
  });

  it('hat jeden Tag einen Ordnungstipp und dreht abends eine Gießrunde', () => {
    const { s } = sessionAt('2026-07-10T10:00:00');
    expect(CHRISTIN_TIPS).toContainEqual(christinTip(s));
    expect(CHRISTIN.schedule.some((e) => e.label === 'Gießt Linas Garten')).toBe(true);
  });
});
