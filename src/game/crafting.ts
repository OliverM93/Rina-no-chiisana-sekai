/**
 * Opas Werkbank: Rezepte lernen und bauen.
 */
import { craft, type CraftResult, learn, missing } from '../core/crafting';
import { itemDef, maxStackOf } from '../data/items';
import { RECIPE_BY_FIND, RECIPE_BY_ID, recipeOfItem, RECIPES, type RecipeDef } from '../data/recipes';
import { itemIconUrl } from '../gfx/items';
import type { Session } from './session';

export function knownRecipes(session: Session): RecipeDef[] {
  const book = session.data?.recipes ?? [];
  return RECIPES.filter((r) => book.includes(r.id));
}

export function recipeName(r: RecipeDef): string {
  return itemDef(r.result)?.name ?? r.id;
}

/** Lernt ein Rezept (mit Meldung). Gibt `true` zurück, wenn es neu war. */
export function learnRecipe(session: Session, id: string, announce = true): boolean {
  const data = session.data;
  const r = RECIPE_BY_ID[id];
  if (!data || !r || !learn(data.recipes, id)) return false;
  session.changed();
  if (announce) session.bus.emit('toast', { text: `📜 Neues Rezept: ${recipeName(r)}! Ab an die Werkbank.`, icon: itemIconUrl(r.result) });
  return true;
}

/**
 * Wird beim Einstecken aufgerufen: Rezeptkarten werden sofort gelernt (statt in die Tasche),
 * bei manchen Funden fällt Lina eine Idee ein. Gibt `true` zurück, wenn der Gegenstand
 * eine Rezeptkarte war (also nicht in die Tasche gehört).
 */
export function onItemObtained(session: Session, itemId: string): boolean {
  const card = recipeOfItem(itemId);
  if (card) {
    if (!learnRecipe(session, card.id)) session.bus.emit('toast', { text: `Das Rezept „${recipeName(card)}“ kennst du schon.` });
    return true;
  }
  const idea = RECIPE_BY_FIND[itemId];
  if (idea) learnRecipe(session, idea);
  return false;
}

export function missingFor(session: Session, id: string) {
  const r = RECIPE_BY_ID[id];
  return r && session.data ? missing(session.data.inventory, r) : [];
}

export function craftRecipe(session: Session, id: string): CraftResult | 'unbekannt' {
  const data = session.data;
  const r = RECIPE_BY_ID[id];
  if (!data || !r || !data.recipes.includes(id)) return 'unbekannt';
  const res = craft(data.inventory, r, maxStackOf);
  if (res === 'ok') {
    if (r.station === 'kueche') data.stats.cooked += 1;
    else if (r.station !== 'apotheke') data.stats.crafted += 1;
    session.bus.emit('sfx', 'bauen');
    session.bus.emit('fx', { kind: 'konfetti' });
    session.changed();
    session.save();
  }
  return res;
}
