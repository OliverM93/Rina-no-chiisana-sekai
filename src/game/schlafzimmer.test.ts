import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { buildPlanGrid } from '../core/floorplan';
import { groundFloor } from '../data/floorplan';
import { bedroomWidth, layoutOf, roomLayouts } from '../data/house';
import { finishExpansion } from './home';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function fresh() {
  const m = new Map<string, string>();
  const storage: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  const s = new Session(storage, () => new Date('2026-12-10T12:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return s;
}

describe('Langes Schlafzimmer (Stufe 3)', () => {
  it('ab Stufe 3 ist das Schlafzimmer 16 breit, ohne weiteren Raum, Dachetage oder zweite Tür', () => {
    expect(bedroomWidth(2)).toBe(8);
    expect(bedroomWidth(3)).toBe(16);
    expect(roomLayouts(3).map((l) => l.id)).toEqual(['haupt', 'schlafzimmer']);
    const plan = groundFloor(3);
    // genau eine Tür am Schlafzimmer
    expect(plan.doors.filter((d) => d.room === 'schlafzimmer' || d.to === 'schlafzimmer')).toHaveLength(1);
    expect(plan.rooms.every((r) => r.x >= 0 && r.y >= 0)).toBe(true);
  });

  it('die Tür zum Wohnzimmer liegt an derselben Stelle wie vorher (Gegenüber im Plan)', () => {
    for (const stage of [2, 3, 4, 5, 6]) {
      const plan = groundFloor(stage);
      const bed = plan.rooms.find((r) => r.id === 'schlafzimmer')!;
      const main = plan.rooms.find((r) => r.id === 'haupt')!;
      const door = plan.doors.find((d) => d.to === 'schlafzimmer')!;
      expect(bed.x + door.toCell[0], `Stufe ${stage}`).toBe(main.x + door.cell[0]);
    }
  });

  it('von der Haustür aus erreicht man das linke Ende des Schlafzimmers', () => {
    for (const stage of [3, 4, 5, 6]) {
      const plan = groundFloor(stage);
      const grid = buildPlanGrid(plan);
      const bed = plan.rooms.find((r) => r.id === 'schlafzimmer')!;
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
      expect(seen.has(`${bed.x},${bed.y + 2}`), `Stufe ${stage}: linkes Ende`).toBe(true);
    }
    expect(layoutOf(3, 'schlafzimmer').w).toBe(16);
  });

  it('beim Ausbau auf Stufe 3 rücken die Möbel des Schlafzimmers nach rechts', () => {
    const s = fresh();
    const d = s.data!;
    d.house.stage = 2;
    d.house.rooms.push({ id: 'schlafzimmer', wallpaper: 'tapete-creme', floor: 'boden-dielen', items: [{ uid: 'bett', itemId: 'topfpflanze', x: 2, y: 1, rot: 0 }] });
    d.house.pending = { stage: 3, day: '2026-12-09', at: 0 };
    s.data!.playTimeSec = 1e9;
    expect(finishExpansion(s)).toBe(3);
    const bed = d.house.rooms.find((r) => r.id === 'schlafzimmer')!;
    expect(bed.items[0].x).toBe(10);
  });

  it('ein Spielstand (Version 17) mit Dachzimmer wird zum linken Teil des langen Schlafzimmers', () => {
    const s = fresh();
    s.data!.house.stage = 3;
    const old = JSON.parse(JSON.stringify(s.data)) as { version: number; house: { rooms: Array<{ id: string; items: unknown[]; wallpaper: string }> } };
    old.version = 17;
    old.house.rooms = old.house.rooms.filter((r) => r.id !== 'schlafzimmer');
    old.house.rooms.push({ id: 'schlafzimmer', wallpaper: 'tapete-creme', items: [{ uid: 'bett', itemId: 'topfpflanze', x: 3, y: 1, rot: 0 }] });
    old.house.rooms.push({ id: 'dach', wallpaper: 'tapete-ranken', items: [{ uid: 'alt-1', itemId: 'topfpflanze', x: 1, y: 1, rot: 0 }] });
    const r = s.checkImport(JSON.stringify(old));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const rooms = r.data.house.rooms.map((x) => x.id);
    expect(rooms).not.toContain('dach');
    expect(rooms).not.toContain('arbeitszimmer');
    const bed = r.data.house.rooms.find((x) => x.id === 'schlafzimmer')!;
    const xs = Object.fromEntries(bed.items.map((i) => [i.uid, i.x]));
    expect(xs['alt-1']).toBe(1); // ehemaliges Dachzimmer: links
    expect(xs['bett']).toBe(11); // Schlafzimmer: um 8 nach rechts
    expect(bed.wallpaper).toBe('tapete-creme');
  });
});
