import { describe, expect, it } from 'vitest';
import { hasIcon } from '../gfx/items';
import { FISH } from './species';
import { ITEMS, itemDef } from './items';
import { RECIPE_BY_FIND, RECIPES } from './recipes';

describe('Fischgerichte (Audit F2/W6: Fänge mit Verwendung)', () => {
  const fishRecipes = RECIPES.filter((r) => r.station === 'kueche' && r.ingredients.some((i) => FISH.some((f) => f.id === i.itemId)));

  it('mindestens sieben Gerichte nutzen Fische, das Rezept fällt beim ersten Fang ein', () => {
    expect(fishRecipes.length).toBeGreaterThanOrEqual(9);
    for (const r of fishRecipes.filter((x) => x.fund)) {
      const fish = r.ingredients.find((i) => FISH.some((f) => f.id === i.itemId))!;
      expect(r.fund, r.id).toBe(fish.itemId);
      expect(RECIPE_BY_FIND[fish.itemId], r.id).toBe(r.id);
    }
  });

  it('Veredeln lohnt sich (1,3–3,3×), ohne zur Geldmaschine zu werden', () => {
    for (const r of fishRecipes) {
      const value = (itemDef(r.result)?.price ?? 0) * (r.count ?? 1);
      const cost = r.ingredients.reduce((sum, i) => sum + (itemDef(i.itemId)?.price ?? 0) * i.count, 0);
      expect(value / cost, r.id).toBeGreaterThanOrEqual(1.3);
      expect(value / cost, r.id).toBeLessThanOrEqual(3.3);
    }
  });
});

describe('Gerichte haben ein Symbol', () => {
  it('jedes Essen hat ein eigenes Symbol (kein Fragezeichen)', () => {
    for (const [id, def] of Object.entries(ITEMS)) if (def.category === 'essen') expect(hasIcon(id), id).toBe(true);
  });
});
