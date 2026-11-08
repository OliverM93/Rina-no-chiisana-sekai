/**
 * Gemüse & Kräuter fürs Beet (Beet/Samen Phase 3).
 *
 * Sie wachsen wie die Blumen (gießen → nächsten Tag eine Stufe weiter, nichts vertrocknet), aber man erntet sie
 * zum Kochen. Die ID der Pflanze ist zugleich die ID des geernteten Gegenstands (`tomate`), der Same heißt
 * `samen-tomate`. Gerichte stehen in `recipes.ts`, die Symbole in `gfx/nature-icons.ts`, die Pflanzen in
 * `world3d/models/critters.ts`.
 */
import type { Season } from '../core/time';

export type CropKind = 'gemuese' | 'kraut';

export interface CropDef {
  /** ID der Pflanze = ID des Erntegutes */
  id: string;
  name: string;
  plural: string;
  kind: CropKind;
  /** Verkaufswert des Erntegutes */
  price: number;
  /** Verkaufswert des Samens (am Stand: × Aufschlag) */
  seedPrice: number;
  seedName: string;
  seedPlural: string;
  /** Leitfarbe (Same-Schildchen, Symbol) */
  color: string;
  center: string;
  /** Wie viele gibt eine Ernte? (von, bis) */
  yield: readonly [number, number];
  /** Wurzelgemüse & Co.: nach der Ernte ist der Platz frei (sonst treibt die Pflanze wieder aus) */
  once: boolean;
  /** Der Same ist am Stand nur in diesen Jahreszeiten zu kaufen (ohne = immer) */
  seasons?: readonly Season[];
  description: string;
  seedDescription: string;
}

export const CROPS: readonly CropDef[] = [
  // Gemüse
  { id: 'tomate', name: 'Tomate', plural: 'Tomaten', kind: 'gemuese', price: 18, seedPrice: 6, seedName: 'Tomatensamen', seedPlural: 'Tomatensamen', color: '#e8484f', center: '#6fbf5f', yield: [2, 3], once: false, seasons: ['fruehling', 'sommer', 'herbst'], description: 'Sonnengereift und prall. Riecht nach Sommer und ein bisschen nach Tomatenblatt.', seedDescription: 'Aus kleinen Samen werden Tomaten, die man mehrmals ernten kann.' },
  { id: 'karotte', name: 'Karotte', plural: 'Karotten', kind: 'gemuese', price: 12, seedPrice: 4, seedName: 'Karottensamen', seedPlural: 'Karottensamen', color: '#f59a3a', center: '#6fbf5f', yield: [2, 3], once: true, description: 'Knackig, orange, mit einem Büschel Grün. Lars: „Gut für die Augen.“ Oli: „Und für Hasen.“', seedDescription: 'Winzige Körnchen. Unter der Erde wächst etwas Orangefarbenes.' },
  { id: 'kartoffel', name: 'Kartoffel', plural: 'Kartoffeln', kind: 'gemuese', price: 10, seedPrice: 4, seedName: 'Saatkartoffel', seedPlural: 'Saatkartoffeln', color: '#c9a36a', center: '#f1efe9', yield: [3, 4], once: true, description: 'Dick, erdig und gutmütig. In Sachsen sagt man „Gartoffl“ – und meint es nur gut.', seedDescription: 'Eine Kartoffel mit Augen. Ab in die Erde, dann gibt es bald viele.' },
  { id: 'salat', name: 'Kopfsalat', plural: 'Salatköpfe', kind: 'gemuese', price: 14, seedPrice: 4, seedName: 'Salatsamen', seedPlural: 'Salatsamen', color: '#8fd08a', center: '#b8e6a0', yield: [1, 1], once: true, description: 'Ein knackiger, hellgrüner Kopf. Christin wäscht ihn dreimal. Mindestens.', seedDescription: 'Aus dem Tütchen wird ein ganzer Salatkopf.' },
  { id: 'zucchini', name: 'Zucchini', plural: 'Zucchini', kind: 'gemuese', price: 20, seedPrice: 6, seedName: 'Zucchinisamen', seedPlural: 'Zucchinisamen', color: '#4f9a5a', center: '#f7d26a', yield: [1, 2], once: false, seasons: ['fruehling', 'sommer'], description: 'Wächst schneller, als man gucken kann. Jens: „Courgette, ma chérie.“', seedDescription: 'Eine Pflanze reicht für ein ganzes Dorf. Vorsicht!' },
  { id: 'kuerbis', name: 'Kürbis', plural: 'Kürbisse', kind: 'gemuese', price: 45, seedPrice: 8, seedName: 'Kürbiskerne', seedPlural: 'Kürbiskerne', color: '#f08a2a', center: '#6fbf5f', yield: [1, 1], once: true, seasons: ['sommer', 'herbst'], description: 'Groß, rund und orange wie ein Herbstabend. Schwer, aber schön.', seedDescription: 'Kerne für einen richtig dicken Kürbis.' },
  // Kräuter
  { id: 'basilikum', name: 'Basilikum', plural: 'Basilikumzweige', kind: 'kraut', price: 16, seedPrice: 5, seedName: 'Basilikumsamen', seedPlural: 'Basilikumsamen', color: '#4fa84f', center: '#6fbf5f', yield: [2, 3], once: false, description: 'Duftet nach Italien und nach Jens’ Küche. Passt zu allem mit Tomate.', seedDescription: 'Für ein Töpfchen voll Sommer im Beet.' },
  { id: 'petersilie', name: 'Petersilie', plural: 'Petersilienbüschel', kind: 'kraut', price: 14, seedPrice: 4, seedName: 'Petersiliensamen', seedPlural: 'Petersiliensamen', color: '#3f8f4a', center: '#6fbf5f', yield: [2, 3], once: false, description: 'Krause Blättchen, die jede Suppe schöner machen. Omas Geheimwaffe.', seedDescription: 'Keimt langsam, aber dann richtig buschig.' },
  { id: 'schnittlauch', name: 'Schnittlauch', plural: 'Schnittlauchbündel', kind: 'kraut', price: 14, seedPrice: 4, seedName: 'Schnittlauchsamen', seedPlural: 'Schnittlauchsamen', color: '#5fa85a', center: '#c9a0e0', yield: [2, 3], once: false, description: 'Dünne grüne Halme mit lila Pompons. Aufs Brot, in den Quark, auf die Suppe.', seedDescription: 'Wächst von allein wieder nach, wenn man ihn schneidet.' },
  { id: 'thymian', name: 'Thymian', plural: 'Thymianzweige', kind: 'kraut', price: 16, seedPrice: 5, seedName: 'Thymiansamen', seedPlural: 'Thymiansamen', color: '#6a9a6a', center: '#f4c6e0', yield: [2, 3], once: false, description: 'Winzige Blättchen, großer Geschmack. Duftet nach Provence – Jens ist begeistert.', seedDescription: 'Ein kleines Kissen aus Duft.' },
];

export const CROP_BY_ID: Readonly<Record<string, CropDef>> = Object.fromEntries(CROPS.map((c) => [c.id, c]));
export const CROP_BY_SEED: Readonly<Record<string, CropDef>> = Object.fromEntries(CROPS.map((c) => [`samen-${c.id}`, c]));
export const isCrop = (id: string): boolean => id in CROP_BY_ID;

/** Wie viele Stücke gibt diese Ernte? `rnd` ist ein Wert 0..1 */
export function harvestCount(crop: CropDef, rnd: number): number {
  const [lo, hi] = crop.yield;
  return lo + Math.floor(rnd * (hi - lo + 1));
}
