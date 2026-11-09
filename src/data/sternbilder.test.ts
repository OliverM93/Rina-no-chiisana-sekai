import { describe, expect, it } from 'vitest';
import { CONSTELLATIONS, CONSTELLATION_BY_SEASON } from './sternbilder';

describe('Sternbilder', () => {
  it('jede Jahreszeit hat genau eins, mit gültigen Sternen und Linien', () => {
    expect(Object.keys(CONSTELLATION_BY_SEASON).sort()).toEqual(['fruehling', 'herbst', 'sommer', 'winter']);
    for (const c of CONSTELLATIONS) {
      expect(c.stars.length, c.id).toBeGreaterThanOrEqual(4);
      for (const [x, y, m] of c.stars) {
        expect(x >= 0 && x <= 100 && y >= 0 && y <= 60, c.id).toBe(true);
        expect([1, 2, 3]).toContain(m);
      }
      for (const [a, b] of c.lines) {
        expect(a, c.id).toBeLessThan(c.stars.length);
        expect(b, c.id).toBeLessThan(c.stars.length);
        expect(a, c.id).not.toBe(b);
      }
      expect(c.lines_.length, c.id).toBeGreaterThanOrEqual(2);
    }
  });
});
