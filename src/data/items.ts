/**
 * Alle Gegenstände im Spiel.
 *
 * Neue Gegenstände: hier eintragen und in `src/gfx/items.ts` ein Symbol
 * zeichnen (sonst erscheint ein Platzhalter). Preise in „Sternchen“ ⭐.
 */

export type ItemCategory = 'obst' | 'muschel' | 'blume' | 'material' | 'fund' | 'essen' | 'geschenk';

export interface ItemDef {
  id: string;
  name: string;
  /** Mehrzahl für Meldungen wie „3 Äpfel“ */
  plural: string;
  category: ItemCategory;
  /** Verkaufspreis in Sternchen; null = nicht verkaufbar */
  price: number | null;
  description: string;
  maxStack?: number;
}

export const CURRENCY = { name: 'Sternchen', icon: '⭐' } as const;

const list: ItemDef[] = [
  // Obst
  { id: 'apfel', name: 'Apfel', plural: 'Äpfel', category: 'obst', price: 10, description: 'Knackig und rotbackig. Ein Apfel am Tag …' },
  { id: 'birne', name: 'Birne', plural: 'Birnen', category: 'obst', price: 10, description: 'Saftig und süß, mit einem kleinen Blättchen am Stiel.' },
  { id: 'pfirsich', name: 'Pfirsich', plural: 'Pfirsiche', category: 'obst', price: 12, description: 'Flauschig wie ein Pfirsich eben. Duftet nach Sommer.' },

  // Muscheln & Strandfunde
  { id: 'herzmuschel', name: 'Herzmuschel', plural: 'Herzmuscheln', category: 'muschel', price: 15, description: 'Eine zartrosa Muschel in Herzform. 💕' },
  { id: 'jakobsmuschel', name: 'Jakobsmuschel', plural: 'Jakobsmuscheln', category: 'muschel', price: 12, description: 'Ein hübscher kleiner Fächer aus dem Meer.' },
  { id: 'schneckenhaus', name: 'Schneckenhaus', plural: 'Schneckenhäuser', category: 'muschel', price: 18, description: 'Hält man es ans Ohr, hört man das Meer rauschen.' },
  { id: 'seestern', name: 'Seestern', plural: 'Seesterne', category: 'muschel', price: 60, description: 'Selten! Ein kleiner Stern, der vom Himmel ins Meer gefallen ist.' },

  // Blumen
  { id: 'wildblumen', name: 'Wildblumenstrauß', plural: 'Wildblumensträuße', category: 'blume', price: 8, description: 'Frisch gepflückt von der Wiese. Riecht nach Frühling.' },

  // Materialien & Funde
  { id: 'ast', name: 'Ast', plural: 'Äste', category: 'material', price: 3, description: 'Ein ordentlicher Ast. Bestimmt nützlich für später.' },
  { id: 'stein', name: 'Kieselstein', plural: 'Kieselsteine', category: 'material', price: 4, description: 'Glatt und rund, liegt schön in der Hand.' },
  { id: 'glitzerstein', name: 'Glitzerstein', plural: 'Glitzersteine', category: 'fund', price: 120, description: 'Funkelt in allen Farben! Ein echter Schatz.' },

  // Essen & Geschenke
  { id: 'keks', name: 'Omas Keks', plural: 'Omas Kekse', category: 'essen', price: 5, description: 'Butterkeks nach Oma Giselas Geheimrezept. Keine Widerrede!' },
  { id: 'strickschal', name: 'Gestrickter Schal', plural: 'Gestrickte Schals', category: 'geschenk', price: null, maxStack: 1, description: 'Von Oma Gisela gestrickt. Natürlich in Rosa – „Rosa steht dir.“' },
  { id: 'omas-foto', name: 'Foto von Oma Gisela', plural: 'Fotos von Oma Gisela', category: 'geschenk', price: null, maxStack: 1, description: 'Oma Gisela auf ihrer Bank, mit Kaffeetasse und sehr ernstem Blick. Auf der Rückseite: „Für Lina. Gut aufheben!“' },
  { id: 'keksrezept', name: 'Omas Keksrezept', plural: 'Omas Keksrezepte', category: 'geschenk', price: null, maxStack: 1, description: 'Streng geheim! „Mehl, Butter, Zucker – und ganz viel Liebe. Den Rest verrat ich nicht.“' },
];

export const ITEMS: Readonly<Record<string, ItemDef>> = Object.fromEntries(list.map((i) => [i.id, i]));

/** Reihenfolge beim Sortieren der Tasche */
export const ITEM_ORDER: Readonly<Record<string, number>> = Object.fromEntries(list.map((i, idx) => [i.id, idx]));

export function itemDef(id: string): ItemDef | undefined {
  return ITEMS[id];
}

export function isKnownItem(id: string): boolean {
  return id in ITEMS;
}

export function maxStackOf(id: string): number {
  return ITEMS[id]?.maxStack ?? 30;
}

/** „1 Apfel“, „3 Äpfel“ */
export function itemCountLabel(id: string, count: number): string {
  const def = ITEMS[id];
  if (!def) return `${count}× ${id}`;
  return `${count} ${count === 1 ? def.name : def.plural}`;
}

/** Was an Bäumen wächst */
export const TREE_FRUITS = ['apfel', 'birne', 'pfirsich'] as const;

/** Tägliche Strandfunde */
export const BEACH_FINDS = [
  { itemId: 'jakobsmuschel', weight: 34 },
  { itemId: 'herzmuschel', weight: 30 },
  { itemId: 'schneckenhaus', weight: 26 },
  { itemId: 'seestern', weight: 10 },
] as const;
export const BEACH_FINDS_PER_DAY = 7;

/** Was man beim Klopfen an Felsen findet */
export const ROCK_FINDS = [
  { itemId: 'stein', weight: 88 },
  { itemId: 'glitzerstein', weight: 12 },
] as const;
