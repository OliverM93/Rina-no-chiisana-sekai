import { describe, expect, it, vi } from 'vitest';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { bedTiles } from './home';
import { greenhouseKeys, isFrozen, isWinter, updateGarden, waterAt } from './nature';
import { Session } from './session';

function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

function newSession(date: string) {
  const s = new Session(memoryStorage(), () => new Date(`${date}T12:00:00`));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return s;
}

describe('Winter im Beet & Gewächshaus', () => {
  it('im Winter ruht das Beet draußen, im Sommer nicht', () => {
    expect(isWinter(newSession('2026-01-10'))).toBe(true);
    expect(isWinter(newSession('2026-07-10'))).toBe(false);
    expect(isFrozen(newSession('2026-07-10'), 6, 11)).toBe(false);
    expect(isFrozen(newSession('2026-01-10'), 6, 11)).toBe(true);
  });

  it('im Gewächshaus wächst es auch im Winter weiter, im normalen Beet nicht', () => {
    const s = newSession('2026-01-10');
    const d = s.data!;
    d.yard.items.push({ uid: 'gh', itemId: 'gewaechshaus', x: 2, y: 2, rot: 0 });
    const keys = greenhouseKeys(s);
    expect(keys.size).toBe(6);
    const [inside] = [...keys];
    const outside = '6,11';
    const day = s.today();
    for (const k of [inside, outside]) d.world.garden[k] = { flower: 'tomate', stage: 0, wateredDay: '2026-01-09', grewDay: '2026-01-08' };
    updateGarden(s);
    expect(d.world.garden[inside].stage).toBe(1);
    expect(d.world.garden[outside].stage).toBe(0);
    // gießen: im Gewächshaus ja, draußen nein
    const [ix, iy] = inside.split(',').map(Number);
    expect(isFrozen(s, ix, iy)).toBe(false);
    expect(waterAt(s, ix, iy)).toBe(true);
    expect(waterAt(s, 6, 11)).toBe(false);
    expect(d.world.garden[outside].wateredDay).not.toBe(day);
  });

  it('das Frühbeet hat drei, das Gewächshaus sechs Plätze', () => {
    const s = newSession('2026-01-10');
    s.data!.yard.items.push({ uid: 'fb', itemId: 'fruehbeet', x: 2, y: 2, rot: 0 }, { uid: 'gh', itemId: 'gewaechshaus', x: 2, y: 5, rot: 0 });
    expect(bedTiles(s, 'fb')).toHaveLength(3);
    expect(bedTiles(s, 'gh')).toHaveLength(6);
  });
});
