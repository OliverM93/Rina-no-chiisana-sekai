import { describe, expect, it } from 'vitest';
import { type Box, pickNext } from './navigation';

const box = (left: number, top: number, w = 80, h = 40): Box => ({ left, top, width: w, height: h });

describe('Pfeiltasten-Navigation', () => {
  // Raster 3 × 2:  0 1 2 / 3 4 5
  const grid = [box(0, 0), box(100, 0), box(200, 0), box(0, 60), box(100, 60), box(200, 60)];

  it('springt im Raster zum Nachbarn in der Richtung', () => {
    expect(pickNext(grid, 0, 'right')).toBe(1);
    expect(pickNext(grid, 1, 'right')).toBe(2);
    expect(pickNext(grid, 4, 'left')).toBe(3);
    expect(pickNext(grid, 1, 'down')).toBe(4);
    expect(pickNext(grid, 5, 'up')).toBe(2);
  });

  it('bleibt am oberen und unteren Rand stehen', () => {
    expect(pickNext(grid, 1, 'up')).toBeNull();
    expect(pickNext(grid, 4, 'down')).toBeNull();
  });

  it('links/rechts am Zeilenende geht in Leserichtung weiter', () => {
    expect(pickNext(grid, 2, 'right')).toBe(3);
    expect(pickNext(grid, 3, 'left')).toBe(2);
    expect(pickNext(grid, 5, 'right')).toBeNull();
    expect(pickNext(grid, 0, 'left')).toBeNull();
  });

  it('in einer Liste untereinander geht es hoch und runter, Links/Rechts wandert mit', () => {
    const list = [box(0, 0, 300), box(0, 50, 300), box(0, 100, 300)];
    expect(pickNext(list, 0, 'down')).toBe(1);
    expect(pickNext(list, 2, 'up')).toBe(1);
    expect(pickNext(list, 1, 'right')).toBe(2);
    expect(pickNext(list, 1, 'left')).toBe(0);
  });

  it('geradeaus schlägt schräg: Knopf rechts in derselben Zeile vor dem etwas näheren weiter unten', () => {
    const b = [box(0, 0), box(120, 0), box(90, 70)];
    expect(pickNext(b, 0, 'right')).toBe(1);
  });
});
