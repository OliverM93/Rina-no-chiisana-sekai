import { describe, expect, it } from 'vitest';
import { findPath } from './grid';
import { buildPlanGrid, doorCells, doorStripCell, type FloorPlan, hasRoomBehind, openingsFor, roomsBehind, roomsBeside, planSize, roomAt, toGlobal, validatePlan, wallStrips } from './floorplan';

/** Zwei 4×3-Räume nebeneinander mit einem Wandstreifen (x = 4) und einer Tür auf Zeile 1 */
const plan: FloorPlan = {
  id: 'test',
  rooms: [
    { id: 'a', x: 0, y: 0, w: 4, h: 3 },
    { id: 'b', x: 5, y: 0, w: 4, h: 3 },
  ],
  doors: [{ room: 'a', cell: [3, 1], side: 'right', to: 'b', toCell: [0, 1] }],
  entrance: { room: 'a', cell: [1, 2], side: 'down' },
};

describe('Grundriss', () => {
  it('Größe, Umrechnung und Raum unter einem Feld', () => {
    expect(planSize(plan)).toEqual({ w: 9, h: 3 });
    expect(toGlobal(plan, 'b', 2, 1)).toEqual({ x: 7, y: 1 });
    expect(roomAt(plan, 7, 1)).toEqual({ room: 'b', x: 2, y: 1 });
    expect(roomAt(plan, 4, 1)).toBeNull(); // Wandstreifen
    expect(doorStripCell(plan, plan.doors[0])).toEqual({ x: 4, y: 1 });
  });

  it('ist gültig', () => {
    expect(validatePlan(plan)).toEqual([]);
  });

  it('man kommt nur durch die Tür von Raum zu Raum', () => {
    const grid = buildPlanGrid(plan);
    const path = findPath(grid, { x: 1, y: 1 }, { x: 7, y: 1 });
    expect(path).not.toBeNull();
    // der Weg führt über das Streifenfeld der Tür
    expect(path!.some((t) => t.x === 4 && t.y === 1)).toBe(true);
    // über die Wand geht es nicht
    expect(grid.isBlocked(4, 0)).toBe(true);
    expect(grid.isBlocked(4, 2)).toBe(true);
  });

  it('Möbel im Weg blockieren Felder; die Tür kann zugestellt werden, wenn man sie nicht schützt', () => {
    const grid = buildPlanGrid(plan, (room, x, y) => room === 'b' && x === 0 && y === 1);
    expect(findPath(grid, { x: 1, y: 1 }, { x: 7, y: 1 })).toBeNull();
    expect(doorCells(plan, 'b')).toContainEqual([0, 1]);
    expect(doorCells(plan, 'a')).toContainEqual([3, 1]);
    expect(doorCells(plan, 'a')).toContainEqual([1, 2]); // Haustür
  });

  it('erkennt kaputte Grundrisse', () => {
    const touching: FloorPlan = { ...plan, rooms: [plan.rooms[0], { id: 'b', x: 4, y: 0, w: 4, h: 3 }] };
    expect(validatePlan(touching).join(' ')).toContain('Wandstreifen');
    const crooked: FloorPlan = { ...plan, doors: [{ room: 'a', cell: [3, 1], side: 'right', to: 'b', toCell: [0, 2] }] };
    expect(validatePlan(crooked).join(' ')).toContain('gegenüber');
    const notOnWall: FloorPlan = { ...plan, doors: [{ room: 'a', cell: [2, 1], side: 'right', to: 'b', toCell: [0, 1] }] };
    expect(validatePlan(notOnWall).join(' ')).toContain('nicht an der Wand');
    const lonely: FloorPlan = { ...plan, doors: [] };
    expect(validatePlan(lonely).join(' ')).toContain('nicht erreichbar');
  });
});

describe('Türöffnungen & Wandstreifen', () => {
  it('Öffnungen in den Raumwänden', () => {
    expect(openingsFor(plan, 'a')).toEqual([{ side: 'right', at: 1 }]);
    expect(openingsFor(plan, 'b')).toEqual([{ side: 'left', at: 1 }]);
    const stacked: FloorPlan = {
      id: 's',
      rooms: [{ id: 'hinten', x: 1, y: 0, w: 4, h: 3 }, { id: 'vorne', x: 0, y: 4, w: 6, h: 3 }],
      doors: [{ room: 'vorne', cell: [2, 0], side: 'up', to: 'hinten', toCell: [1, 2] }],
    };
    expect(openingsFor(stacked, 'vorne')).toEqual([{ side: 'back', at: 2 }]);
    expect(openingsFor(stacked, 'hinten')).toEqual([]); // Vorderseite hat keine Wand
    expect(hasRoomBehind(stacked, 'vorne')).toBe(true);
    expect(hasRoomBehind(stacked, 'hinten')).toBe(false);
    expect(roomsBehind(stacked, 'vorne')).toEqual(['hinten']);
    expect(roomsBehind(stacked, 'hinten')).toEqual([]);
  });

  it('Wandstreifen liegen zwischen den Räumen und enthalten die Türfelder', () => {
    const [s] = wallStrips(plan);
    expect(s).toMatchObject({ x: 4, y: 0, w: 1, h: 3, vertical: true });
    expect(s.openings).toEqual([{ x: 4, y: 1 }]);
  });

  it('Nachbarräume links und rechts', () => {
    expect(roomsBeside(plan, 'a')).toEqual({ left: null, right: 'b' });
    expect(roomsBeside(plan, 'b')).toEqual({ left: 'a', right: null });
  });
});
