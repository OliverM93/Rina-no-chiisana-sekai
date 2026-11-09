import { describe, expect, it } from 'vitest';
import { collectEggs, type CoopDays, EGG_DAYS_MAX, eggDaysWaiting, eggsFor, eggsWaiting, hasEggs } from './coop';

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

describe('Eier sammeln sich an', () => {
  it('ein neuer Stall hat nur die Eier von heute', () => {
    const days: CoopDays = {};
    expect(eggDaysWaiting(days, 'neu', '2026-11-04')).toBe(1);
    expect(eggsWaiting(days, HUHN, 'neu', '2026-11-04')).toBe(eggsFor(HUHN, 'neu', '2026-11-04'));
  });

  it('wer einen Tag auslässt, bekommt beide Tage', () => {
    const days: CoopDays = {};
    collectEggs(days, HUHN, 's', '2026-11-04');
    const expected = eggsFor(HUHN, 's', '2026-11-05') + eggsFor(HUHN, 's', '2026-11-06');
    expect(eggDaysWaiting(days, 's', '2026-11-06')).toBe(2);
    expect(collectEggs(days, HUHN, 's', '2026-11-06')).toBe(expected);
    expect(hasEggs(days, 's', '2026-11-06')).toBe(false);
  });

  it('nach langer Pause höchstens drei Tage – keine Belohnung fürs Fernbleiben, aber auch keine Strafe', () => {
    const days: CoopDays = {};
    collectEggs(days, HUHN, 's', '2026-11-01');
    expect(eggDaysWaiting(days, 's', '2026-12-24')).toBe(EGG_DAYS_MAX);
    const n = collectEggs(days, HUHN, 's', '2026-12-24');
    expect(n).toBeGreaterThanOrEqual(2 * EGG_DAYS_MAX);
    expect(n).toBeLessThanOrEqual(3 * EGG_DAYS_MAX);
  });

  it('über Monatsgrenzen hinweg richtig gezählt', () => {
    const days: CoopDays = { s: '2026-10-30' };
    expect(eggDaysWaiting(days, 's', '2026-11-01')).toBe(2);
    expect(eggDaysWaiting(days, 's', '2026-11-02')).toBe(3);
  });
});
