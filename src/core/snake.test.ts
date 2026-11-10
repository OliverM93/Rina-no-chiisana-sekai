import { describe, expect, it } from 'vitest';
import { newSnake, stepSnake, freeCell, readRecord, saveRecord } from './snake';

const rnd = () => 0;

describe('Dackel-Snake', () => {
  it('läuft geradeaus und behält die Länge', () => {
    const s = stepSnake(newSnake(16, 11, rnd), 'right', rnd);
    expect(s.body).toHaveLength(3);
    expect(s.body[0].x).toBe(5);
  });
  it('kann nicht auf der Stelle umkehren', () => {
    const s = stepSnake(newSnake(16, 11, rnd), 'left', rnd);
    expect(s.dir).toBe('right');
    expect(s.over).toBe(false);
  });
  it('wächst und zählt, wenn es ein Leckerli frisst', () => {
    const s0 = newSnake(16, 11, rnd);
    const s = stepSnake({ ...s0, food: { x: 5, y: s0.body[0].y } }, 'right', rnd);
    expect(s.body).toHaveLength(4);
    expect(s.score).toBe(1);
  });
  it('Ränder sind weich (Wrap)', () => {
    const s0 = newSnake(16, 11, rnd);
    const s = stepSnake({ ...s0, body: [{ x: 15, y: 3 }, { x: 14, y: 3 }], dir: 'right' }, 'right', rnd);
    expect(s.body[0]).toEqual({ x: 0, y: 3 });
  });
  it('endet freundlich beim Biss in den eigenen Schwanz', () => {
    const s0 = newSnake(16, 11, rnd);
    const loop = { ...s0, dir: 'up' as const, body: [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 6, y: 4 }, { x: 5, y: 4 }, { x: 4, y: 4 }, { x: 4, y: 5 }] };
    const s = stepSnake(loop, 'up', rnd);
    expect(s.over).toBe(true);
  });
  it('Leckerli landet nie auf Winston', () => {
    const body = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
    for (let i = 0; i < 20; i++) {
      const f = freeCell(2, 2, body, () => i / 20);
      expect(body.some((c) => c.x === f?.x && c.y === f?.y)).toBe(false);
    }
  });
  it('Rekord bleibt im Spielstand und wird nur überboten', () => {
    const dates: Record<string, string> = {};
    expect(readRecord(dates)).toBe(0);
    expect(saveRecord(dates, 5)).toBe(true);
    expect(saveRecord(dates, 3)).toBe(false);
    expect(readRecord(dates)).toBe(5);
    expect(readRecord({ 'snake-rekord': 'quatsch' })).toBe(0);
  });
});
