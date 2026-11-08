import { describe, expect, it } from 'vitest';
import { GARDEN_FLOWER, FLOWER_BY_SEED, itemDef } from './items';
import { BASE_SEEDS, COLOR_SEEDS, DAILY_COLOR_SEEDS, dailyColorSeeds, seedPrice, standStock } from './seedstand';

describe('Samenstand', () => {
  it('alle Samen am Stand sind echte Samen, die sich pflanzen lassen', () => {
    for (const id of [...BASE_SEEDS, ...COLOR_SEEDS]) {
      expect(itemDef(id), id).toBeTruthy();
      expect(itemDef(id)!.category).toBe('samen');
      expect(FLOWER_BY_SEED[id], id).toBeTruthy();
    }
  });

  it('Misch-Farben gibt es nie zu kaufen – nur Standard- und Samen-Farben', () => {
    for (const id of standStock('2026-07-10')) expect(FLOWER_BY_SEED[id].crossOnly, id).toBe(false);
    for (const id of COLOR_SEEDS) expect(GARDEN_FLOWER[FLOWER_BY_SEED[id].flower].crossOnly).toBe(false);
  });

  it('täglich drei andere Farb-Samen, am selben Tag immer dieselben', () => {
    expect(dailyColorSeeds('2026-07-10')).toEqual(dailyColorSeeds('2026-07-10'));
    expect(dailyColorSeeds('2026-07-10')).toHaveLength(DAILY_COLOR_SEEDS);
    expect(new Set(dailyColorSeeds('2026-07-10')).size).toBe(DAILY_COLOR_SEEDS);
    const days = new Set<string>();
    for (let d = 1; d <= 28; d++) days.add(dailyColorSeeds(`2026-07-${String(d).padStart(2, '0')}`).join());
    expect(days.size).toBeGreaterThan(10);
    // über einen Monat taucht jede Farbe mal auf
    const seen = new Set<string>();
    for (let d = 1; d <= 28; d++) for (const id of dailyColorSeeds(`2026-07-${String(d).padStart(2, '0')}`)) seen.add(id);
    expect(seen.size).toBe(COLOR_SEEDS.length);
  });

  it('am Stand zu kaufen lohnt sich nie mehr als Weiterverkaufen (Aufschlag)', () => {
    for (const id of standStock('2026-07-10')) expect(seedPrice(id)).toBeGreaterThan(itemDef(id)!.price!);
  });
});
