import { describe, expect, it } from 'vitest';
import { facingFromVector, moveWithCollision } from './movement';

const T = 64;
const box = { hw: 14, hh: 8 };
/** Eine einzelne blockierte Kachel bei (2, 1). */
const solid = (tx: number, ty: number) => tx === 2 && ty === 1;

describe('moveWithCollision', () => {
  it('bewegt frei, wenn nichts im Weg ist', () => {
    const r = moveWithCollision({ x: 32, y: 32 }, 10, 5, box, T, solid);
    expect(r).toEqual({ x: 42, y: 37, blockedX: false, blockedY: false });
  });

  it('stoppt bündig vor einer Wand', () => {
    // Lina steht links von der blockierten Kachel, mittig in Reihe 1.
    const r = moveWithCollision({ x: 100, y: 96 }, 30, 0, box, T, solid, 0);
    expect(r.blockedX).toBe(true);
    expect(r.x).toBe(2 * T - box.hw);
  });

  it('stoppt bündig, wenn sie von rechts kommt', () => {
    const r = moveWithCollision({ x: 3 * T + 20, y: 96 }, -30, 0, box, T, solid, 0);
    expect(r.blockedX).toBe(true);
    expect(r.x).toBe(3 * T + box.hw);
  });

  it('gleitet entlang der Wand, wenn sie diagonal läuft', () => {
    const r = moveWithCollision({ x: 2 * T - box.hw, y: 96 }, 5, 6, box, T, solid);
    expect(r.blockedX).toBe(true);
    expect(r.y).toBe(102);
  });

  it('schubst sanft um eine Ecke herum', () => {
    // Knapp oberhalb der Kachel-Unterkante: nur ein kleiner Teil der Fußbox überlappt.
    const start = { x: 2 * T - box.hw, y: 2 * T + box.hh - 4 };
    const r = moveWithCollision(start, 4, 0, box, T, solid);
    expect(r.y).toBeGreaterThan(start.y);
  });

  it('befreit eine Figur, die in einem Hindernis steckt', () => {
    const r = moveWithCollision({ x: 2.5 * T, y: 1.5 * T }, 4, 0, box, T, solid);
    expect(r.x).toBe(2.5 * T + 4);
  });
});

describe('facingFromVector', () => {
  it('wählt die dominante Richtung', () => {
    expect(facingFromVector(1, 0, 'down')).toBe('right');
    expect(facingFromVector(-1, 0.2, 'down')).toBe('left');
    expect(facingFromVector(0, -1, 'down')).toBe('up');
    expect(facingFromVector(0.5, 1, 'up')).toBe('down');
    expect(facingFromVector(0, 0, 'left')).toBe('left');
  });
});
