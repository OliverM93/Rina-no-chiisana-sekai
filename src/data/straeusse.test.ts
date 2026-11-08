import { describe, expect, it } from 'vitest';
import { FURNITURE_BY_ITEM } from './furniture';
import { itemDef, isKnownItem } from './items';
import { NPCS } from './npcs';
import { RECIPE_BY_FIND, RECIPE_BY_ID } from './recipes';
import { BOUQUETS, EMPTY_VASE, vaseId, WREATHS } from './straeusse';

describe('Sträuße & Blumendeko', () => {
  it('jeder Strauß hat Gegenstand, Rezept und eine Vase dazu – aus Zutaten, die es gibt', () => {
    expect(BOUQUETS.length).toBeGreaterThanOrEqual(6);
    for (const b of BOUQUETS) {
      expect(itemDef(b.id)?.category, b.id).toBe('blume');
      expect(itemDef(b.id)!.price).toBe(b.price);
      for (const i of b.ingredients) expect(isKnownItem(i.itemId), `${b.id}: ${i.itemId}`).toBe(true);
      expect(RECIPE_BY_ID[b.id]?.group, b.id).toBe('blumen');
      // Vase: Strauß + leere Glasvase
      const vase = RECIPE_BY_ID[vaseId(b.id)];
      expect(vase.ingredients.map((i) => i.itemId).sort()).toEqual([b.id, EMPTY_VASE].sort());
      const f = FURNITURE_BY_ITEM[vaseId(b.id)];
      expect(f.def.small, b.id).toBe(true);
      expect(f.def.crafted, b.id).toBe(true);
      // der Strauß ist mehr wert als seine Blumen einzeln
      const parts = b.ingredients.reduce((sum, i) => sum + (itemDef(i.itemId)?.price ?? 0) * i.count, 0);
      expect(b.price, `${b.id}: Strauß ${b.price} ≤ Zutaten ${parts}`).toBeGreaterThan(Math.round(parts * 0.6));
    }
  });

  it('die leere Glasvase gibt es im Katalog, Vasen mit Strauß und Kränze nur selbst gebunden', () => {
    const empty = FURNITURE_BY_ITEM[EMPTY_VASE].def;
    expect(empty.small).toBe(true);
    expect(empty.crafted).toBeFalsy();
    expect(empty.gift).toBeFalsy();
    for (const w of WREATHS) {
      const f = FURNITURE_BY_ITEM[w.id].def;
      expect(f.wall, w.id).toBe(true);
      expect(f.crafted, w.id).toBe(true);
      expect(RECIPE_BY_ID[w.id]?.group).toBe('blumen');
    }
  });

  it('seltene Sträuße lernt Lina beim ersten Mal, wenn sie die Mischfarbe hat', () => {
    expect(RECIPE_BY_FIND['tulpe-orange']).toBe('strauss-mischfarben');
    expect(RECIPE_BY_FIND['rose-schwarz']).toBe('strauss-schwarz');
    expect(RECIPE_BY_ID['strauss-rosen'].start).toBe(true);
  });

  it('jeder Strauß kommt bei jemandem gut an', () => {
    for (const b of BOUQUETS) {
      const fans = NPCS.filter((n) => n.preferences.loves.includes(b.id) || n.preferences.likes.includes(b.id));
      expect(fans.length, b.id).toBeGreaterThanOrEqual(2);
      expect(NPCS.some((n) => n.preferences.loves.includes(b.id)), `${b.id} wird von niemandem geliebt`).toBe(true);
    }
  });
});
