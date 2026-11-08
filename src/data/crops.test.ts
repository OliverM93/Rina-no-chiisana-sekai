import { describe, expect, it } from 'vitest';
import { CROP_BY_ID, CROPS, harvestCount } from './crops';
import { FLOWER_BY_SEED, GARDEN_FLOWER, itemDef } from './items';
import { RECIPE_BY_FIND, RECIPES } from './recipes';
import { cropsAt } from './seedstand';

describe('Gemüse & Kräuter', () => {
  it('jede Pflanze hat Erntegut, Same und lässt sich im Beet ziehen', () => {
    expect(CROPS.filter((c) => c.kind === 'gemuese').length).toBeGreaterThanOrEqual(5);
    expect(CROPS.filter((c) => c.kind === 'kraut').length).toBeGreaterThanOrEqual(4);
    for (const c of CROPS) {
      expect(itemDef(c.id)?.category, c.id).toBe(c.kind);
      expect(itemDef(`samen-${c.id}`)?.category, c.id).toBe('samen');
      expect(FLOWER_BY_SEED[`samen-${c.id}`]?.flower, c.id).toBe(c.id);
      expect(GARDEN_FLOWER[c.id]?.crossOnly).toBe(false);
      expect(c.yield[0]).toBeGreaterThanOrEqual(1);
      expect(c.yield[1]).toBeGreaterThanOrEqual(c.yield[0]);
    }
  });

  it('die Ernte liegt immer in ihrer Spanne', () => {
    for (const c of CROPS) {
      for (const r of [0, 0.3, 0.5, 0.99]) {
        const n = harvestCount(c, r);
        expect(n).toBeGreaterThanOrEqual(c.yield[0]);
        expect(n).toBeLessThanOrEqual(c.yield[1]);
      }
    }
  });

  it('Gerichte brauchen nur Gegenstände, die es gibt – und jedes Gemüse kommt in einem Gericht vor', () => {
    const used = new Set<string>();
    for (const r of RECIPES.filter((x) => x.ingredients.some((i) => i.itemId in CROP_BY_ID))) {
      expect(itemDef(r.result), r.id).toBeTruthy();
      expect(r.station, r.id).toBe('kueche');
      for (const i of r.ingredients) {
        expect(itemDef(i.itemId), `${r.id}: ${i.itemId}`).toBeTruthy();
        if (i.itemId in CROP_BY_ID) used.add(i.itemId);
      }
    }
    for (const c of CROPS) expect(used.has(c.id), `${c.id} kommt in keinem Gericht vor`).toBe(true);
  });

  it('die meisten Rezepte lernt Lina bei der ersten Ernte', () => {
    expect(RECIPE_BY_FIND['tomate']).toBe('tomatensalat');
    expect(RECIPE_BY_FIND['karotte']).toBe('karottensuppe');
    expect(RECIPE_BY_FIND['thymian']).toBe('ratatouille');
  });

  it('am Stand gibt es zu jeder Jahreszeit Gemüse, im Winter aber weniger', () => {
    for (const s of ['fruehling', 'sommer', 'herbst', 'winter'] as const) expect(cropsAt(s).here.length).toBeGreaterThanOrEqual(5);
    expect(cropsAt('winter').here.length).toBeLessThan(cropsAt('sommer').here.length);
    expect(cropsAt('winter').away.map((c) => c.id)).toContain('tomate');
    expect(cropsAt('herbst').here.map((c) => c.id)).toContain('kuerbis');
  });
});
