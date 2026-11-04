/**
 * Kunstwerke für Jens' Galerie – alles Originale von Künstlerinnen und Künstlern
 * aus dem Dorf (und von Jens' Reisen). Gemalt wird prozedural (`gfx/art.ts`).
 *
 * Jedes Kunstwerk ist auch ein Möbel (Bild auf Staffelei), das man zu Hause
 * aufstellen kann – oder man stiftet es der Galerie.
 */

export type ArtStyle = 'landschaft' | 'meer' | 'blumen' | 'nacht' | 'abstrakt' | 'dackel' | 'berge' | 'portrait' | 'stickbild' | 'karte' | 'herzen' | 'stadt';

export interface ArtDef {
  id: string;
  name: string;
  artist: string;
  style: ArtStyle;
  /** Kaufpreis bei Jens */
  price: number;
  /** Farbpalette (Hintergrund, Hauptfarbe, Akzent) */
  colors: readonly [string, string, string];
  description: string;
}

export const ARTWORKS: readonly ArtDef[] = [
  { id: 'kunst-sommerwiese', name: 'Sommerwiese', artist: 'Jens', style: 'landschaft', price: 1200, colors: ['#bfe6f7', '#8fd08a', '#f7d26a'], description: 'Grüne Hügel, ein Himmel wie Zuckerwatte. „Gemalt an einem Nachmittag, an dem ich eigentlich Croissants backen sollte.“' },
  { id: 'kunst-meeresrauschen', name: 'Meeresrauschen', artist: 'Jens', style: 'meer', price: 1400, colors: ['#e6f4ff', '#5b7fc2', '#ffffff'], description: 'Wellen am Dorfstrand. Wer genau hinschaut, sieht eine winzige Krabbe.' },
  { id: 'kunst-tulpenfeld', name: 'Tulpenfeld bei Amsterdam', artist: 'Jens', style: 'blumen', price: 1600, colors: ['#bfe6f7', '#e8484f', '#8fd08a'], description: 'Von Jens\' Reise nach Amsterdam. Reihe um Reihe Tulpen – „und mittendrin ein charmanter Radfahrer“.' },
  { id: 'kunst-sternennacht', name: 'Sternennacht über dem Dorf', artist: 'Jens', style: 'nacht', price: 2000, colors: ['#1e2350', '#f7d26a', '#8ac8ff'], description: 'Wirbelnde Sterne über dem Dorf, gemalt in einer Nacht, in der Jens nicht schlafen konnte.' },
  { id: 'kunst-gefuehl', name: 'Gefühl in Rosa', artist: 'Jens', style: 'abstrakt', price: 1800, colors: ['#fbe0e8', '#e85a8a', '#c3a8e8'], description: 'Abstrakt! Christin findet, es hängt schief. Jens findet, das ist der Punkt.' },
  { id: 'kunst-winston', name: 'Bildnis eines Dackels', artist: 'Jens', style: 'dackel', price: 1500, colors: ['#f7c6d4', '#b8642e', '#8fd08a'], description: 'Winston, in königlicher Pose. Er hat drei Minuten stillgehalten – ein Rekord.' },
  { id: 'kunst-alpengluehen', name: 'Alpenglühen', artist: 'Jens', style: 'berge', price: 1700, colors: ['#f7b27a', '#8a6a9a', '#ffffff'], description: 'Berge im Abendrot. „Ich war in den Alpen, hab gemalt und dabei sehr viel Käsefondue gegessen.“' },
  { id: 'kunst-oma', name: 'Oma auf der Bank', artist: 'Jens', style: 'portrait', price: 2200, colors: ['#e6f4ff', '#3a5fc8', '#d9534f'], description: 'Oma Gisela im blauen Mantel, mit sehr ernstem Blick. Sie sagt, sie sieht „zu alt“ aus. Sie sieht wunderbar aus.' },
  { id: 'kunst-stickbild', name: 'Gestickt: Trautes Heim', artist: 'Oma Gisela', style: 'stickbild', price: 900, colors: ['#fbf6ec', '#e85a8a', '#6fa86a'], description: 'Ein Kreuzstichbild von Oma: „Trautes Heim, Glück allein“. Mit einem Herzchen, das ein bisschen schief ist.' },
  { id: 'kunst-schatzkarte', name: 'Thalias erste Dorfkarte', artist: 'Thalia', style: 'karte', price: 1100, colors: ['#f3e2c4', '#5b7fc2', '#6fa86a'], description: 'Thalias erste Karte vom Dorf, mit Kompassrose und einem X da, wo der beste Kuchen ist.' },
  { id: 'kunst-herzen', name: 'Hundert kleine Herzen', artist: 'Oli', style: 'herzen', price: 1000, colors: ['#ffffff', '#e85a8a', '#f4a3b8'], description: 'Oli hat hundert Herzen gemalt. „Eins für jeden Grund, warum ich Lini lieb hab.“ (Es sind eigentlich mehr.)' },
  { id: 'kunst-paris', name: 'Dächer von Paris', artist: 'Jens', style: 'stadt', price: 2400, colors: ['#bfd8f0', '#7a8a96', '#f4a3b8'], description: 'Graue Dächer, rosa Abendhimmel, ein winziger Eiffelturm. Jens\' Lieblingsbild.' },
];

export const ART_BY_ID: Readonly<Record<string, ArtDef>> = Object.fromEntries(ARTWORKS.map((a) => [a.id, a]));
