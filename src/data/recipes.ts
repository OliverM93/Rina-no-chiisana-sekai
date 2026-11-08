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
  /** Wo gebaut/gekocht wird (Standard: Werkbank) */
  station?: 'werkbank' | 'kueche' | 'apotheke';
  /** Kurzer Hinweis, wie man es bekommt (für noch unbekannte Rezepte) */
  hint: string;
  start?: boolean;
  /** Gelernt beim ersten Fund dieses Gegenstands */
  fund?: string;
  /** Gelernt in der Kochshow im Fernsehen */
  tv?: boolean;
}

export const RECIPES: readonly RecipeDef[] = [
  { id: 'ast-hocker', result: 'ast-hocker', ingredients: [{ itemId: 'ast', count: 5 }], start: true, hint: '' },
  { id: 'blumenvase', result: 'blumenvase', ingredients: [{ itemId: 'wildblumen', count: 3 }, { itemId: 'stein', count: 1 }], start: true, hint: '' },
  // Lars' Apotheke
  { id: 'kamillentee', station: 'apotheke', result: 'kamillentee', ingredients: [{ itemId: 'kamille', count: 2 }], start: true, hint: '' },
  { id: 'pfefferminztee', station: 'apotheke', result: 'pfefferminztee', ingredients: [{ itemId: 'pfefferminze', count: 2 }], start: true, hint: '' },
  { id: 'lavendeltee', station: 'apotheke', result: 'lavendeltee', ingredients: [{ itemId: 'lavendel', count: 2 }], start: true, hint: '' },
  { id: 'kraeutermischung', station: 'apotheke', result: 'kraeutermischung', count: 2, ingredients: [{ itemId: 'kamille', count: 1 }, { itemId: 'pfefferminze', count: 1 }, { itemId: 'lavendel', count: 1 }], hint: 'Freunde dich mit Lars an – oder frag Oma.' },
  // Aus der Kochshow im Fernsehen („Kochen mit Herz“)
  { id: 'apfelpfannkuchen', station: 'kueche', result: 'apfelpfannkuchen', count: 2, ingredients: [{ itemId: 'ei', count: 2 }, { itemId: 'apfel', count: 1 }], tv: true, hint: 'Läuft bestimmt mal in der Kochshow im Fernsehen …' },
  { id: 'fischsuppe', station: 'kueche', result: 'fischsuppe', ingredients: [{ itemId: 'barsch', count: 1 }, { itemId: 'pfefferminze', count: 1 }], tv: true, hint: 'Läuft bestimmt mal in der Kochshow im Fernsehen …' },
  { id: 'blumensalat', station: 'kueche', result: 'blumensalat', ingredients: [{ itemId: 'sonnenblume', count: 1 }, { itemId: 'vergissmeinnicht', count: 1 }, { itemId: 'apfel', count: 1 }], tv: true, hint: 'Läuft bestimmt mal in der Kochshow im Fernsehen …' },
  // Jens' Kochstudio
  { id: 'ruehrei', station: 'kueche', result: 'ruehrei', ingredients: [{ itemId: 'ei', count: 2 }], start: true, hint: '' },
  { id: 'wachtel-spiegelei', station: 'kueche', result: 'wachtel-spiegelei', ingredients: [{ itemId: 'wachtelei', count: 3 }], start: true, hint: '' },
  { id: 'obstsalat', station: 'kueche', result: 'obstsalat', ingredients: [{ itemId: 'apfel', count: 1 }, { itemId: 'birne', count: 1 }, { itemId: 'pfirsich', count: 1 }], start: true, hint: '' },
  { id: 'lavendelkekse', station: 'kueche', result: 'lavendelkekse', count: 2, ingredients: [{ itemId: 'lavendel', count: 1 }, { itemId: 'keks', count: 2 }], fund: 'lavendel', hint: 'Pflanz doch mal Lavendel im Beet …' },
  { id: 'fischbroetchen', station: 'kueche', result: 'fischbroetchen', ingredients: [{ itemId: 'hering', count: 1 }, { itemId: 'ei', count: 1 }], hint: 'Freunde dich mit Jens an.' },
  { id: 'apfelkuchen', station: 'kueche', result: 'apfelkuchen', ingredients: [{ itemId: 'apfel', count: 3 }, { itemId: 'ei', count: 2 }], hint: 'Jens verrät es bestimmt, wenn ihr euch näherkommt.' },
  { id: 'crepes', station: 'kueche', result: 'crepes', count: 2, ingredients: [{ itemId: 'ei', count: 2 }, { itemId: 'pfirsich', count: 1 }], hint: 'Ein Rezept aus Paris – von Jens.' },
  // Aus dem eigenen Beet: Gemüse & Kräuter (die meisten Rezepte lernt Lina bei der ersten Ernte)
  { id: 'tomatensalat', station: 'kueche', result: 'tomatensalat', ingredients: [{ itemId: 'tomate', count: 2 }, { itemId: 'basilikum', count: 1 }], fund: 'tomate', hint: 'Pflanz Tomaten im Beet …' },
  { id: 'kartoffelsuppe', station: 'kueche', result: 'kartoffelsuppe', ingredients: [{ itemId: 'kartoffel', count: 3 }, { itemId: 'schnittlauch', count: 1 }], fund: 'kartoffel', hint: 'Pflanz Kartoffeln im Beet …' },
  { id: 'kraeuterquark', station: 'kueche', result: 'kraeuterquark', ingredients: [{ itemId: 'kartoffel', count: 2 }, { itemId: 'schnittlauch', count: 1 }, { itemId: 'petersilie', count: 1 }], fund: 'petersilie', hint: 'Pflanz Petersilie im Beet …' },
  { id: 'karottensuppe', station: 'kueche', result: 'karottensuppe', ingredients: [{ itemId: 'karotte', count: 3 }, { itemId: 'petersilie', count: 1 }], fund: 'karotte', hint: 'Pflanz Karotten im Beet …' },
  { id: 'ratatouille', station: 'kueche', result: 'ratatouille', ingredients: [{ itemId: 'tomate', count: 1 }, { itemId: 'zucchini', count: 1 }, { itemId: 'basilikum', count: 1 }, { itemId: 'thymian', count: 1 }], fund: 'thymian', hint: 'Pflanz Thymian im Beet – Jens liebt ihn …' },
  { id: 'gruener-salat', station: 'kueche', result: 'gruener-salat', ingredients: [{ itemId: 'salat', count: 2 }, { itemId: 'tomate', count: 1 }, { itemId: 'schnittlauch', count: 1 }], fund: 'salat', hint: 'Pflanz Salat im Beet …' },
  { id: 'kuerbissuppe', station: 'kueche', result: 'kuerbissuppe', ingredients: [{ itemId: 'kuerbis', count: 1 }, { itemId: 'thymian', count: 1 }], fund: 'kuerbis', hint: 'Pflanz Kürbis im Beet …' },
  // Winter: Rezeptkarten aus Olis Adventskalender
  { id: 'bratapfel', station: 'kueche', result: 'bratapfel', ingredients: [{ itemId: 'apfel', count: 1 }, { itemId: 'keks', count: 1 }], hint: 'Steckt vielleicht in einem Türchen von Olis Adventskalender …' },
  { id: 'zimtsterne', station: 'kueche', result: 'zimtsterne', count: 3, ingredients: [{ itemId: 'ei', count: 1 }, { itemId: 'keks', count: 2 }], hint: 'Steckt vielleicht in einem Türchen von Olis Adventskalender …' },
  { id: 'schneemann', result: 'schneemann', ingredients: [{ itemId: 'schneeball', count: 3 }, { itemId: 'ast', count: 2 }], fund: 'schneeball', hint: 'Im Winter liegen Schneebälle auf der Wiese …' },
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
