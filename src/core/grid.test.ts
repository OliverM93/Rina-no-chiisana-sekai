import { describe, expect, it } from 'vitest';
import { CollisionGrid, findPath, nearestWalkable } from './grid';

function gridFrom(rows: string[]): CollisionGrid {
  const g = new CollisionGrid(rows[0].length, rows.length);
  rows.forEach((row, y) => [...row].forEach((c, x) => g.setBlocked(x, y, c === '#')));
  return g;
}

describe('CollisionGrid', () => {
  it('behandelt den Kartenrand als Wand', () => {
    const g = new CollisionGrid(3, 3);
    expect(g.isBlocked(-1, 0)).toBe(true);
    expect(g.isBlocked(3, 0)).toBe(true);
    expect(g.isBlocked(1, 1)).toBe(false);
  });
});

describe('findPath', () => {
  it('findet einen Weg um ein Hindernis', () => {
    const g = gridFrom([
      '.....', //
      '.###.',
      '.....',
    ]);
    const path = findPath(g, { x: 0, y: 1 }, { x: 4, y: 1 });
    expect(path).not.toBeNull();
    expect(path?.at(-1)).toEqual({ x: 4, y: 1 });
    for (const t of path ?? []) expect(g.isBlocked(t.x, t.y)).toBe(false);
  });

  it('schneidet keine Ecken', () => {
    const g = gridFrom([
      '.#', //
      '..',
    ]);
    const path = findPath(g, { x: 0, y: 0 }, { x: 1, y: 1 });
    expect(path).toEqual([
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ]);
  });

  it('liefert null, wenn das Ziel unerreichbar ist', () => {
    const g = gridFrom([
      '..#..', //
      '..#..',
      '..#..',
    ]);
    expect(findPath(g, { x: 0, y: 0 }, { x: 4, y: 0 })).toBeNull();
    expect(findPath(g, { x: 0, y: 0 }, { x: 2, y: 0 })).toBeNull();
  });

  it('liefert einen leeren Weg, wenn man schon da ist', () => {
    const g = new CollisionGrid(2, 2);
    expect(findPath(g, { x: 1, y: 1 }, { x: 1, y: 1 })).toEqual([]);
  });

  it('nimmt den kürzesten Weg', () => {
    const g = new CollisionGrid(10, 10);
    const path = findPath(g, { x: 0, y: 0 }, { x: 9, y: 0 });
    expect(path).toHaveLength(9);
  });
});

describe('nearestWalkable', () => {
  it('findet die nächste freie Kachel neben einem Hindernis', () => {
    const g = gridFrom([
      '...', //
      '.#.',
      '...',
    ]);
    const t = nearestWalkable(g, { x: 1, y: 1 }, { x: 1, y: 2 });
    expect(t).not.toBeNull();
    expect(g.isBlocked(t!.x, t!.y)).toBe(false);
    expect(Math.max(Math.abs(t!.x - 1), Math.abs(t!.y - 1))).toBe(1);
  });

  it('gibt freie Kacheln unverändert zurück', () => {
    const g = new CollisionGrid(3, 3);
    expect(nearestWalkable(g, { x: 2, y: 2 })).toEqual({ x: 2, y: 2 });
  });
});
