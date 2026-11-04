/**
 * Werkbank: Rezepte, die aus Materialien in der Tasche etwas Neues machen.
 * Reine Logik – Rezepte stehen in `data/recipes.ts`.
 */
import { addItem, countItem, type Inventory, type MaxStackFn, removeItem } from './inventory';

export interface Ingredient {
  itemId: string;
  count: number;
}

export interface Recipe {
  id: string;
  /** Ergebnis-Gegenstand */
  result: string;
  count?: number;
  ingredients: readonly Ingredient[];
}

/** Gelernte Rezepte (IDs, in der Reihenfolge des Lernens) */
export type RecipeBook = string[];

export function knows(book: RecipeBook, id: string): boolean {
  return book.includes(id);
}

/** Lernt ein Rezept. Gibt `true` zurück, wenn es neu war. */
export function learn(book: RecipeBook, id: string): boolean {
  if (book.includes(id)) return false;
  book.push(id);
  return true;
}

/** Was fehlt noch? (leer = alles da) */
export function missing(inv: Inventory, recipe: Recipe): Ingredient[] {
  return recipe.ingredients
    .map((i) => ({ itemId: i.itemId, count: i.count - countItem(inv, i.itemId) }))
    .filter((i) => i.count > 0);
}

export function canCraft(inv: Inventory, recipe: Recipe): boolean {
  return missing(inv, recipe).length === 0;
}

export type CraftResult = 'ok' | 'fehlt' | 'voll';

/**
 * Baut ein Rezept: nimmt die Zutaten und legt das Ergebnis in die Tasche.
 * Alles oder nichts – passt das Ergebnis nicht mehr, bleibt die Tasche unverändert.
 */
export function craft(inv: Inventory, recipe: Recipe, maxStack?: MaxStackFn): CraftResult {
  if (!canCraft(inv, recipe)) return 'fehlt';
  const trial: Inventory = structuredClone(inv);
  for (const i of recipe.ingredients) removeItem(trial, i.itemId, i.count);
  if (addItem(trial, recipe.result, recipe.count ?? 1, maxStack) > 0) return 'voll';
  inv.slots = trial.slots;
  return 'ok';
}

export function normalizeRecipeBook(raw: unknown, isKnown: (id: string) => boolean): RecipeBook {
  if (!Array.isArray(raw)) return [];
  return [...new Set(raw.filter((r): r is string => typeof r === 'string' && isKnown(r)))];
}
