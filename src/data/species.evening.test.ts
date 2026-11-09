import { describe, expect, it } from 'vitest';
import { FISH, INSECTS } from './species';

const active = (h: readonly [number, number], x: number) => (h[0] <= h[1] ? x >= h[0] && x < h[1] : x >= h[0] || x < h[1]);

describe('Abend-Erreichbarkeit (Audit F1)', () => {
  it('jede Art ist zwischen 18 und 20 Uhr oder spät abends zu finden', () => {
    for (const s of [...FISH, ...INSECTS]) {
      const evening = [18, 19, 20, 21, 22].some((h) => active(s.hours, h));
      expect(evening, s.id).toBe(true);
    }
  });
});
