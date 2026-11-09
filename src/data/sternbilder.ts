/**
 * Sternbilder zum Sterne gucken (Date mit Oli): pro Jahreszeit eins, am Himmel mit Linien gezeichnet,
 * dazu zwei Zeilen von Oli. Koordinaten in einem Feld 100 × 60 (nur grob nachempfunden, kein Sternatlas).
 */
import type { Season } from '../core/time';

export interface Constellation {
  id: string;
  name: string;
  season: Season;
  /** Sterne: x, y (0–100 × 0–60) und Größe 1–3 */
  stars: ReadonlyArray<readonly [number, number, number]>;
  /** Linien als Paare von Stern-Indizes */
  lines: ReadonlyArray<readonly [number, number]>;
  /** Oli erklärt es */
  lines_: readonly string[];
}

export const CONSTELLATIONS: readonly Constellation[] = [
  {
    id: 'grosser-wagen',
    name: 'Großer Wagen',
    season: 'fruehling',
    stars: [[8, 22, 2], [24, 28, 2], [38, 29, 2], [50, 31, 2], [52, 47, 2], [73, 49, 2], [75, 33, 3]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]],
    lines_: ['Siehst du das da oben, Lini? Der Große Wagen. Vier Sterne als Kasten, drei als Deichsel.', 'Ich such ihn jeden Frühling zuerst. Er ist wie ein Bekannter, der immer am gleichen Platz wartet.'],
  },
  {
    id: 'schwan',
    name: 'Schwan',
    season: 'sommer',
    stars: [[50, 6, 3], [50, 26, 2], [50, 52, 2], [26, 30, 2], [74, 24, 2]],
    lines: [[0, 1], [1, 2], [3, 1], [1, 4]],
    lines_: ['Das da ist der Schwan, Lini. Er fliegt den ganzen Sommer die Milchstraße entlang.', 'Manche nennen ihn auch das Kreuz des Nordens. Ich nenn ihn: den, der uns beim Picknick zuschaut.'],
  },
  {
    id: 'kassiopeia',
    name: 'Kassiopeia',
    season: 'herbst',
    stars: [[10, 42, 2], [30, 18, 2], [50, 36, 3], [70, 14, 2], [90, 34, 2]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
    lines_: ['Schau, ein großes W am Himmel. Das ist Kassiopeia.', 'Im Herbst steht sie ganz hoch. Wenn du sie suchst, dreh dich einfach nach oben und denk an mich. Ich guck schon.'],
  },
  {
    id: 'orion',
    name: 'Orion',
    season: 'winter',
    stars: [[30, 8, 3], [68, 12, 2], [40, 32, 2], [50, 30, 2], [60, 28, 2], [34, 52, 2], [70, 50, 3]],
    lines: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6]],
    lines_: ['Da ist Orion, Lini, der Jäger mit dem Gürtel aus drei Sternen. Der steht im Winter am schönsten.', 'Ich hab mir als Kind den Gürtel gemerkt. Das ist der einzige Teil, den ich sicher finde. Der Rest ist Gefühl.'],
  },
];

export const CONSTELLATION_BY_SEASON: Readonly<Record<Season, Constellation>> = Object.fromEntries(CONSTELLATIONS.map((c) => [c.season, c])) as Record<Season, Constellation>;
