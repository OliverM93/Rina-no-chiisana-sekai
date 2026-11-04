/**
 * Rezepte für Opas Werkbank.
 *
 * Woher kommen Rezepte?
 * - `start`: kennt Lina von Anfang an
 * - `fund`: beim ersten Mal, wenn Lina diesen Gegenstand bekommt
 * - als Brief-Geschenk (`rezept-<id>`, siehe `RECIPE_ITEM_PREFIX`) von Bewohnern
 */
import type { Recipe } from '../core/crafting';

export interface RecipeDef extends Recipe {
  /** Kurzer Hinweis, wie man es bekommt (für noch unbekannte Rezepte) */
  hint: string;
  start?: boolean;
  /** Gelernt beim ersten Fund dieses Gegenstands */
  fund?: string;
}

export const RECIPES: readonly RecipeDef[] = [
  { id: 'ast-hocker', result: 'ast-hocker', ingredients: [{ itemId: 'ast', count: 5 }], start: true, hint: '' },
  { id: 'blumenvase', result: 'blumenvase', ingredients: [{ itemId: 'wildblumen', count: 3 }, { itemId: 'stein', count: 1 }], start: true, hint: '' },
  { id: 'zaun-holz', result: 'zaun-holz', count: 2, ingredients: [{ itemId: 'ast', count: 3 }], start: true, hint: '' },
  { id: 'weg-stein', result: 'weg-stein', count: 2, ingredients: [{ itemId: 'stein', count: 3 }], start: true, hint: '' },
  { id: 'vogelhaus', result: 'vogelhaus', ingredients: [{ itemId: 'ast', count: 5 }, { itemId: 'stein', count: 1 }], hint: 'Oma Gisela beobachtet gern Vögel …' },
  { id: 'hundekoerbchen', result: 'hundekoerbchen', ingredients: [{ itemId: 'ast', count: 6 }, { itemId: 'wildblumen', count: 2 }], hint: 'Oma Gisela hat bestimmt eine Idee für Winston …' },
  { id: 'kieselmosaik', result: 'kieselmosaik', ingredients: [{ itemId: 'stein', count: 10 }], hint: 'Kommt vielleicht mit der Post von Olaf.' },
  { id: 'steinlaterne', result: 'steinlaterne', ingredients: [{ itemId: 'stein', count: 6 }, { itemId: 'ast', count: 1 }], hint: 'Freunde dich mit Olaf an.' },
  { id: 'treibholzregal', result: 'treibholzregal', ingredients: [{ itemId: 'ast', count: 8 }, { itemId: 'stein', count: 2 }], hint: 'Freunde dich mit Christin an.' },
  { id: 'muschellampe', result: 'muschellampe', ingredients: [{ itemId: 'herzmuschel', count: 2 }, { itemId: 'jakobsmuschel', count: 1 }, { itemId: 'ast', count: 1 }], fund: 'herzmuschel', hint: 'Finde eine Herzmuschel am Strand.' },
  { id: 'seestern-deko', result: 'seestern-deko', ingredients: [{ itemId: 'seestern', count: 1 }, { itemId: 'jakobsmuschel', count: 2 }], fund: 'seestern', hint: 'Finde einen Seestern am Strand.' },
  { id: 'glitzerlampe', result: 'glitzerlampe', ingredients: [{ itemId: 'glitzerstein', count: 1 }, { itemId: 'stein', count: 2 }, { itemId: 'ast', count: 1 }], fund: 'glitzerstein', hint: 'Klopf an Felsen – vielleicht glitzert es.' },
];

export const RECIPE_BY_ID: Readonly<Record<string, RecipeDef>> = Object.fromEntries(RECIPES.map((r) => [r.id, r]));
export const START_RECIPES: readonly string[] = RECIPES.filter((r) => r.start).map((r) => r.id);
/** Gegenstand → Rezept, das beim ersten Fund gelernt wird */
export const RECIPE_BY_FIND: Readonly<Record<string, string>> = Object.fromEntries(RECIPES.filter((r) => r.fund).map((r) => [r.fund as string, r.id]));

/** Rezeptkarten als Brief-Geschenk: `rezept-<id>` */
export const RECIPE_ITEM_PREFIX = 'rezept-';
export function recipeOfItem(itemId: string): RecipeDef | undefined {
  return itemId.startsWith(RECIPE_ITEM_PREFIX) ? RECIPE_BY_ID[itemId.slice(RECIPE_ITEM_PREFIX.length)] : undefined;
}
