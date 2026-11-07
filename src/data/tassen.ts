/**
 * Linas Sammeltassen: Becher einer (ausgedachten) Kaffeehaus-Kette „Sternenbohne“ – Klassik-Tassen, Saison-Tassen
 * und Städte-Tassen. Lina stellt sie gern auf Regalen aus (Tassenregal, Holzregal, Würfelregal …).
 * Alles ausgedacht: Name, Emblem (Bohne mit Stern) und Designs sind keine echte Marke (siehe CLAUDE.md).
 *
 * Woher? Klassik & Saison gibt es im Möbelkatalog (Saison-Tassen nur in ihrer Jahreszeit), Städte-Tassen schickt
 * Onkel Jens von seinen Reisen (siehe `TRAVELS`), Thalia bringt sie von ihren Forschungsreisen mit, und Oli hat auch eine.
 */
import type { Season } from '../core/time';

export type TasseKind = 'klassik' | 'saison' | 'stadt';

export interface TasseDef {
  id: string;
  name: string;
  kind: TasseKind;
  /** Becherfarbe & Bandfarbe (für 3D und Symbol) */
  color: string;
  accent: string;
  /** Jahreszeit (nur Saison-Tassen: im Katalog nur dann) */
  season?: Season;
  /** Katalogpreis (nur Klassik & Saison; Städte-Tassen gibt es nicht zu kaufen) */
  price: number;
  description: string;
}

const tasse = (id: string, name: string, kind: TasseKind, color: string, accent: string, price: number, description: string, season?: Season): TasseDef => ({ id: `tasse-${id}`, name: `Sternenbohne-Tasse „${name}“`, kind, color, accent, price, description, season });

export const TASSEN: readonly TasseDef[] = [
  // Klassik – immer im Katalog
  tasse('klassik-gruen', 'Klassik Grün', 'klassik', '#2f7a5a', '#f7f5ec', 150, 'Der Klassiker in Tannengrün, mit dem Bohnen-Stern-Emblem. Die erste Tasse in jeder Sammlung.'),
  tasse('klassik-schwarz', 'Klassik Schwarz', 'klassik', '#2a2a30', '#d9b45a', 150, 'Matt-schwarz mit goldenem Emblem. Passt zu Linas Lieblingsfarbe – und zu ihrem Kleiderschrank.'),
  tasse('klassik-weiss', 'Klassik Weiß', 'klassik', '#f7f5ec', '#2f7a5a', 150, 'Schlicht weiß mit grünem Band. Man sieht jeden Kaffeefleck. Lina findet das ehrlich.'),
  // Saison – nur in ihrer Jahreszeit im Katalog
  tasse('saison-fruehling', 'Kirschblüte', 'saison', '#f7c6d4', '#d96a8a', 180, 'Die Frühlingstasse mit Kirschblüten. Sie ist nur im Frühling zu haben – danach ist sie weg.', 'fruehling'),
  tasse('saison-sommer', 'Sommerbrise', 'saison', '#8ac8ff', '#f7d26a', 180, 'Himmelblau mit gelben Sonnenstrahlen. Nur im Sommer zu haben. Perfekt für Eiskaffee.', 'sommer'),
  tasse('saison-herbst', 'Kürbislatte', 'saison', '#e0883a', '#6e4630', 180, 'Orange mit kleinen Kürbissen und Blättern. Nur im Herbst zu haben. Duftet fast nach Zimt.', 'herbst'),
  tasse('saison-winter', 'Winterstern', 'saison', '#c9302c', '#ffffff', 180, 'Rot mit weißen Schneeflocken. Nur im Winter zu haben. Lina trinkt nur noch Kakao daraus.', 'winter'),
  // Städte – von Jens' Reisen, von Thalia und von Oli
  tasse('stadt-paris', 'Paris', 'stadt', '#a8c8e8', '#f7f5ec', 0, 'Mit Eiffelturm-Skizze und Croissant. Von Onkel Jens, natürlich mit einem Kussmund-Stempel.'),
  tasse('stadt-venedig', 'Venedig', 'stadt', '#b8445a', '#d9b45a', 0, 'Mit Gondel und goldener Karnevalsmaske. Von Onkel Jens – „sehr dramatisch, wie ich“.'),
  tasse('stadt-amsterdam', 'Amsterdam', 'stadt', '#e0883a', '#2a2a30', 0, 'Orange mit Grachtenhäusern und einer Tulpe. Von Onkel Jens.'),
  tasse('stadt-sevilla', 'Sevilla', 'stadt', '#d8343c', '#f2c94c', 0, 'Mit Fächer und Flamenco-Tänzerin. Von Onkel Jens. „Olé!“'),
  tasse('stadt-new-york', 'New York', 'stadt', '#3a4a6a', '#f7f5ec', 0, 'Mit Skyline, Brücke und Pizza-Stück. Von Onkel Jens.'),
  tasse('stadt-kyoto', 'Kyoto', 'stadt', '#f7efe2', '#d96a8a', 0, 'Mit Tempel und Kirschblüten. Von Onkel Jens. Auf der Unterseite steht ein Wort, das Lina übersetzen kann. Fast.'),
  tasse('stadt-tokio', 'Tokio', 'stadt', '#ff8fb1', '#2a2a30', 0, 'Mit Tokio-Turm und Katzenwinker. Von Onkel Jens. Lina liest die Aufschrift laut vor und strahlt.'),
  tasse('stadt-wien', 'Wien', 'stadt', '#f2d9a8', '#8a4a30', 0, 'Mit Riesenrad und einem Stück Torte. Von Onkel Jens.'),
  tasse('stadt-lissabon', 'Lissabon', 'stadt', '#f7f5ec', '#3a7ab8', 0, 'Mit blauen Azulejo-Fliesen und einer gelben Straßenbahn. Von Onkel Jens.'),
  tasse('stadt-leipzig', 'Leipzig', 'stadt', '#7a9a5a', '#f7f5ec', 0, 'Mit Thomaskirche und einem „Nu!“ in goldenen Buchstaben. Von Onkel Jens – seiner Heimat, mit Heimweh geschenkt.'),
  tasse('stadt-berlin', 'Berlin', 'stadt', '#5a5a64', '#f2c94c', 0, 'Mit Fernsehturm und Bär. Von Thalia, mit Gesteinsstaub am Henkel.'),
  tasse('stadt-reykjavik', 'Reykjavík', 'stadt', '#6ab8c8', '#f7f5ec', 0, 'Mit Vulkan, Nordlicht und einem Papageitaucher. Von Thalia, von ihrer Island-Exkursion.'),
];

export const TASSE_BY_ID: Readonly<Record<string, TasseDef>> = Object.fromEntries(TASSEN.map((t) => [t.id, t]));
