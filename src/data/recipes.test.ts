import { describe, expect, it } from 'vitest';
import { FURNITURE_BY_ITEM } from './furniture';
import { isKnownItem } from './items';
import { NPCS } from './npcs';
import { RECIPE_ITEM_PREFIX, RECIPES } from './recipes';

describe('Rezepte', () => {
  it('ergeben Möbel und brauchen echte Zutaten', () => {
    for (const r of RECIPES) {
      expect(FURNITURE_BY_ITEM[r.result], r.id).toBeTruthy();
      for (const i of r.ingredients) expect(isKnownItem(i.itemId), `${r.id}: ${i.itemId}`).toBe(true);
      expect(isKnownItem(`${RECIPE_ITEM_PREFIX}${r.id}`)).toBe(true);
    }
  });

  it('jedes Rezept ist irgendwie erreichbar', () => {
    const fromLetters = new Set(
      NPCS.flatMap((n) => [...n.letters, ...Object.values(n.heartLetters)])
        .map((l) => l.gift?.itemId ?? '')
        .filter((id) => id.startsWith(RECIPE_ITEM_PREFIX))
        .map((id) => id.slice(RECIPE_ITEM_PREFIX.length)),
    );
    for (const r of RECIPES) expect(r.start || !!r.fund || fromLetters.has(r.id), r.id).toBe(true);
  });

  it('Handgemachtes gibt es nur an der Werkbank', () => {
    const crafted = new Set(RECIPES.map((r) => r.result));
    for (const f of Object.values(FURNITURE_BY_ITEM)) if (f.def.crafted) expect(crafted.has(f.itemId), f.itemId).toBe(true);
  });
});
