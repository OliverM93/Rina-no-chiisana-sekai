import { describe, expect, it } from 'vitest';
import { buildPlanGrid, doorCells, roomAt, roomById, toGlobal, validatePlan } from '../core/floorplan';
import { findPath } from '../core/grid';
import { floorOfRoom, floorsOf, groundFloor, stairsOf } from './floorplan';
import { MAX_STAGE, roomLayouts } from './house';

describe('Grundrisse des Hauses', () => {
  it('jede Ausbaustufe hat gültige Grundrisse', () => {
    for (let stage = 0; stage <= MAX_STAGE; stage++) for (const f of floorsOf(stage)) expect(validatePlan(f), `Stufe ${stage}, ${f.id}`).toEqual([]);
  });

  it('jeder Raum der Stufe liegt in genau einer Etage – und Größe passt zum Raum-Layout', () => {
    for (let stage = 0; stage <= MAX_STAGE; stage++) {
      const placed = floorsOf(stage).flatMap((f) => f.rooms);
      expect(placed.map((r) => r.id).sort(), `Stufe ${stage}`).toEqual(roomLayouts(stage).map((l) => l.id).sort());
      for (const l of roomLayouts(stage)) {
        const r = placed.find((p) => p.id === l.id)!;
        expect([r.w, r.h], `${l.id} Stufe ${stage}`).toEqual([l.w, l.h]);
      }
    }
  });

  it('Stufe 0–1: ein Raum; ab Stufe 2 Schlafzimmer dahinter; Küche links ab 4, Wintergarten rechts ab 5', () => {
    expect(groundFloor(0).rooms).toHaveLength(1);
    const s2 = groundFloor(2);
    expect(roomById(s2, 'schlafzimmer')!.y).toBeLessThan(roomById(s2, 'haupt')!.y);
    const s5 = groundFloor(5);
    expect(roomById(s5, 'kueche')!.x).toBeLessThan(roomById(s5, 'haupt')!.x);
    expect(roomById(s5, 'wintergarten')!.x).toBeGreaterThan(roomById(s5, 'haupt')!.x);
  });

  it('Erdgeschoss: von der Haustür aus kommt man in jeden Raum (leere Räume)', () => {
    for (const stage of [2, 4, 5, 6]) {
      const plan = groundFloor(stage);
      const grid = buildPlanGrid(plan);
      const from = toGlobal(plan, plan.entrance!.room, plan.entrance!.cell[0], plan.entrance!.cell[1])!;
      for (const r of plan.rooms) {
        const to = { x: r.x + Math.floor(r.w / 2), y: r.y + Math.floor(r.h / 2) };
        expect(findPath(grid, from, to), `Stufe ${stage}: ${r.id}`).not.toBeNull();
      }
    }
  });

  it('Treppen führen in vorhandene Räume der anderen Etage', () => {
    for (let stage = 0; stage <= MAX_STAGE; stage++) {
      for (const s of stairsOf(stage)) {
        for (const end of [s.from, s.to]) {
          const floor = floorsOf(stage).find((f) => f.id === end.floor);
          const room = floor && roomById(floor, end.room);
          expect(room, `Stufe ${stage}: ${end.floor}/${end.room}`).toBeTruthy();
          expect(end.cell[0] < room!.w && end.cell[1] < room!.h).toBe(true);
        }
      }
    }
    expect(stairsOf(2)).toHaveLength(0);
    expect(stairsOf(3)).toHaveLength(1);
    expect(stairsOf(6)).toHaveLength(2);
    expect(floorOfRoom(6, 'keller')).toBe('keller');
    expect(floorOfRoom(1, 'keller')).toBeNull();
  });

  it('Türfelder liegen im Raum und kollidieren nicht mit dem Katalog-Pult', () => {
    for (const stage of [4, 5]) {
      const plan = groundFloor(stage);
      for (const r of plan.rooms) {
        const layout = roomLayouts(stage).find((l) => l.id === r.id)!;
        for (const [x, y] of doorCells(plan, r.id)) {
          expect(x < r.w && y < r.h).toBe(true);
          if (layout.desk) expect([x, y], `Stufe ${stage} ${r.id}`).not.toEqual([...layout.desk]);
        }
      }
      // Gesamtgitter-Gegenprobe
      const m = roomById(plan, 'haupt')!;
      expect(roomAt(plan, m.x, m.y)).toEqual({ room: 'haupt', x: 0, y: 0 });
    }
  });
});
