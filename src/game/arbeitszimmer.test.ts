import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { buildPlanGrid } from '../core/floorplan';
import { groundFloor } from '../data/floorplan';
import { layoutOf } from '../data/house';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function fresh() {
  const m = new Map<string, string>();
  const storage: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  const s = new Session(storage, () => new Date('2026-12-10T12:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return s;
}

describe('Arbeitszimmer statt Dachzimmer', () => {
  it('Stufe 3 hat ein Arbeitszimmer im Erdgeschoss, aber keine Dachetage', () => {
    const plan = groundFloor(3);
    expect(plan.rooms.map((r) => r.id)).toContain('arbeitszimmer');
    expect(layoutOf(3, 'arbeitszimmer')).toMatchObject({ w: 8, h: 6 });
    expect(plan.rooms.every((r) => r.x >= 0 && r.y >= 0)).toBe(true);
  });

  it('von der Haustür aus kommt man ins Arbeitszimmer (durchs Schlafzimmer)', () => {
    for (const stage of [3, 4, 5, 6]) {
      const plan = groundFloor(stage);
      const grid = buildPlanGrid(plan);
      const study = plan.rooms.find((r) => r.id === 'arbeitszimmer')!;
      const home = plan.rooms.find((r) => r.id === 'haupt')!;
      const start = { x: home.x + plan.entrance!.cell[0], y: home.y + plan.entrance!.cell[1] };
      const seen = new Set<string>([`${start.x},${start.y}`]);
      const queue = [start];
      while (queue.length) {
        const c = queue.pop()!;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const n = { x: c.x + dx, y: c.y + dy };
          if (seen.has(`${n.x},${n.y}`) || grid.isBlocked(n.x, n.y)) continue;
          seen.add(`${n.x},${n.y}`);
          queue.push(n);
        }
      }
      expect(seen.has(`${study.x + 3},${study.y + 3}`), `Stufe ${stage}`).toBe(true);
    }
  });

  it('ein alter Spielstand (Version 17) mit Dachzimmer behält die Möbel im Arbeitszimmer', () => {
    const s = fresh();
    s.data!.house.stage = 3;
    const old = JSON.parse(JSON.stringify(s.data)) as { version: number; house: { rooms: Array<{ id: string; items: unknown[]; wallpaper: string }> } };
    old.version = 17;
    old.house.rooms.push({ id: 'dach', wallpaper: 'tapete-ranken', items: [{ uid: 'alt-1', itemId: 'topfpflanze', x: 1, y: 1, rot: 0 }] });
    const r = s.checkImport(JSON.stringify(old));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const room = r.data.house.rooms.find((x) => x.id === 'arbeitszimmer');
    expect(room?.items.map((i) => i.itemId)).toEqual(['topfpflanze']);
    expect(room?.wallpaper).toBe('tapete-ranken');
    expect(r.data.house.rooms.some((x) => x.id === 'dach')).toBe(false);
  });
});
