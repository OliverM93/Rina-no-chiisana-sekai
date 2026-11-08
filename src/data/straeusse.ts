/**
 * Sträuße & Blumendeko (Beet/Samen Phase 4).
 *
 * Aus Blumen und Kräutern aus Linas Beet bindet Lina Sträuße. Die kann sie verschenken (Bewohner mögen
 * sie je nach Geschmack), verkaufen oder mit einer Glasvase zu einer Vase fürs Zimmer machen. Dazu gibt es
 * Kränze für die Wand. Gebunden wird an Opas Werkbank (Reiter „Blumen“, Rezepte in `recipes.ts`).
 *
 * Gegenstands-IDs: Strauß `strauss-<name>`, Vase `vase-strauss-<name>`, Kranz `kranz-<name>`.
 */
import type { Ingredient } from '../core/crafting';

export interface BouquetDef {
  /** `strauss-<name>` */
  id: string;
  name: string;
  plural: string;
  /** Verkaufswert */
  price: number;
  /** Farben der Blüten (für Symbol & Modell) */
  colors: readonly string[];
  ingredients: readonly Ingredient[];
  description: string;
  /** Rezept lernt Lina beim ersten Erhalt dieses Gegenstands (sonst kennt sie es von Anfang an) */
  fund?: string;
  hint: string;
}

export const BOUQUETS: readonly BouquetDef[] = [
  { id: 'strauss-rosen', name: 'Rosenstrauß', plural: 'Rosensträuße', price: 150, colors: ['#e8484f', '#c9303c'], ingredients: [{ itemId: 'rose', count: 3 }], description: 'Drei rote Rosen, mit einer Schleife gebunden. Klassisch. Geht immer. 🌹', hint: '' },
  { id: 'strauss-sonne', name: 'Sonnenblumenstrauß', plural: 'Sonnenblumensträuße', price: 130, colors: ['#f7c832', '#ffffff'], ingredients: [{ itemId: 'sonnenblume', count: 2 }, { itemId: 'kamille', count: 1 }], description: 'Zwei Sonnenblumen und ein bisschen Kamille. Macht sofort gute Laune. 🌻', hint: '' },
  { id: 'strauss-bunt', name: 'Bunter Frühlingsstrauß', plural: 'Bunte Frühlingssträuße', price: 140, colors: ['#e8484f', '#f7c832', '#7ab8f0'], ingredients: [{ itemId: 'tulpe', count: 2 }, { itemId: 'tulpe-gelb', count: 1 }, { itemId: 'vergissmeinnicht', count: 1 }], description: 'Rote und gelbe Tulpen mit einem Hauch Himmelblau. Der Frühling zum Mitnehmen. 💐', hint: '' },
  { id: 'strauss-lavendel', name: 'Lavendelstrauß', plural: 'Lavendelsträuße', price: 140, colors: ['#a98ad8', '#ffffff'], ingredients: [{ itemId: 'lavendel', count: 3 }, { itemId: 'kamille', count: 1 }], description: 'Duftet nach Provence, wirkt beruhigend und sieht aus wie gemalt.', hint: '' },
  { id: 'strauss-kraeuter', name: 'Kräuterbund', plural: 'Kräuterbunde', price: 90, colors: ['#4fa84f', '#c9a0e0', '#f4c6e0'], ingredients: [{ itemId: 'basilikum', count: 1 }, { itemId: 'thymian', count: 1 }, { itemId: 'petersilie', count: 1 }, { itemId: 'schnittlauch', count: 1 }], description: 'Basilikum, Thymian, Petersilie und Schnittlauch, mit einem Band zusammengebunden. Sieht hübsch aus und riecht nach Küche.', hint: '' },
  { id: 'strauss-mischfarben', name: 'Mischfarben-Strauß', plural: 'Mischfarben-Sträuße', price: 260, colors: ['#f59a3a', '#f4a3c0', '#f4a3c0'], ingredients: [{ itemId: 'tulpe-orange', count: 1 }, { itemId: 'tulpe-rosa', count: 1 }, { itemId: 'rose-rosa', count: 1 }], description: 'Orange, Rosa und Rosa-Rosa – lauter Farben, die es nur durch Kreuzen gibt. Ein Strauß mit Geschichte. ✨', fund: 'tulpe-orange', hint: 'Kreuze Tulpen im Beet, bis du eine orange Tulpe hast …' },
  { id: 'strauss-schwarz', name: 'Schwarzer Strauß', plural: 'Schwarze Sträuße', price: 700, colors: ['#3b3441', '#6a5a78'], ingredients: [{ itemId: 'rose-schwarz', count: 1 }, { itemId: 'tulpe-schwarz', count: 1 }], description: 'Eine schwarze Rose und eine schwarze Tulpe. Gruselig-schön. Oli würde ihn sofort an die Wand hängen. 🖤', fund: 'rose-schwarz', hint: 'Zwei Mischfarben nebeneinander … mit viel Glück wird es schwarz.' },
];

export const BOUQUET_BY_ID: Readonly<Record<string, BouquetDef>> = Object.fromEntries(BOUQUETS.map((b) => [b.id, b]));

/** Die leere Vase (im Möbelkatalog), in die ein Strauß kommt */
export const EMPTY_VASE = 'glasvase';
export const vaseId = (bouquetId: string) => `vase-${bouquetId}`;
export const bouquetOfVase = (furnitureId: string): BouquetDef | undefined => (furnitureId.startsWith('vase-') ? BOUQUET_BY_ID[furnitureId.slice(5)] : undefined);

export interface WreathDef {
  /** `kranz-<name>` */
  id: string;
  name: string;
  /** Farben der Blüten im Kranz */
  colors: readonly string[];
  ingredients: readonly Ingredient[];
  /** Katalogwert (Verkaufswert = ein Viertel) */
  price: number;
  description: string;
}

export const WREATHS: readonly WreathDef[] = [
  { id: 'kranz-lavendel', name: 'Lavendelkranz', colors: ['#a98ad8', '#ffffff'], ingredients: [{ itemId: 'lavendel', count: 4 }, { itemId: 'ast', count: 2 }], price: 700, description: 'Ein Kranz aus Lavendel und Ästen für die Wand. Der Raum riecht gleich nach Urlaub.' },
  { id: 'kranz-rosen', name: 'Rosenkranz', colors: ['#e8484f', '#f4a3c0'], ingredients: [{ itemId: 'rose', count: 3 }, { itemId: 'ast', count: 2 }], price: 800, description: 'Rote und rosa Rosen in einem Kranz aus Zweigen. Romantisch, aber nicht kitschig. Fast.' },
  { id: 'kranz-wiese', name: 'Wiesenkranz', colors: ['#f7c832', '#ffffff', '#f4a3c0', '#7ab8f0'], ingredients: [{ itemId: 'wildblumen', count: 3 }, { itemId: 'ast', count: 2 }], price: 500, description: 'Ein Kranz aus Wildblumen. Sieht aus, als hätte ihn jemand beim Spazierengehen gebunden.' },
  { id: 'kranz-kraeuter', name: 'Kräuterkranz', colors: ['#4fa84f', '#f4c6e0'], ingredients: [{ itemId: 'basilikum', count: 1 }, { itemId: 'thymian', count: 1 }, { itemId: 'petersilie', count: 1 }, { itemId: 'ast', count: 2 }], price: 600, description: 'Ein grüner Kranz aus Küchenkräutern. Passt an jede Küchenwand – und riecht noch besser.' },
];

export const WREATH_BY_ID: Readonly<Record<string, WreathDef>> = Object.fromEntries(WREATHS.map((w) => [w.id, w]));
