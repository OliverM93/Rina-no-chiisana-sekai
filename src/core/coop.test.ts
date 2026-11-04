import { describe, expect, it } from 'vitest';
import { collectEggs, type CoopDays, eggsFor, hasEggs } from './coop';

const HUHN = { animals: 3, eggs: [2, 3] as const, egg: 'ei' };

describe('Hühnerstall', () => {
  it('legt jeden Tag 2–3 Eier, reproduzierbar', () => {
    for (const day of ['2026-11-04', '2026-11-05', '2026-11-06', '2026-12-24']) {
      const n = eggsFor(HUHN, 'stall-1', day);
      expect(n).toBeGreaterThanOrEqual(2);
      expect(n).toBeLessThanOrEqual(3);
      expect(eggsFor(HUHN, 'stall-1', day)).toBe(n);
    }
  });

  it('einmal am Tag abholen', () => {
    const days: CoopDays = {};
    expect(hasEggs(days, 's', '2026-11-04')).toBe(true);
    expect(collectEggs(days, HUHN, 's', '2026-11-04')).toBeGreaterThan(0);
    expect(hasEggs(days, 's', '2026-11-04')).toBe(false);
    expect(collectEggs(days, HUHN, 's', '2026-11-04')).toBe(0);
    expect(collectEggs(days, HUHN, 's', '2026-11-05')).toBeGreaterThan(0);
  });
});
