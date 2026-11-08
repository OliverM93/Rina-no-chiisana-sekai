/**
 * Die Dorfkarte (Startgebiet).
 *
 * Jede Zeichenkette ist eine Kachelreihe. Legende:
 *
 *   .  Wiese            ,  Wiese mit Blümchen
 *   #  Sandweg          :  Pflaster (Dorfplatz)
 *   ~  Fluss            =  Brücke (über dem Fluss)
 *   s  Strand           w  Meer (flach)        W  Meer (tief)
 *   T  Laubbaum         P  Tanne
 *   b  Busch            r  Felsen
 *
 * Gebäude, Schilder, Laternen usw. stehen in `VILLAGE_OBJECTS`, weil sie
 * mehrere Kacheln groß sind oder besondere Eigenschaften haben.
 *
 * Tipp zum Bearbeiten: Alle Reihen müssen gleich lang sein – ein Test
 * (`src/core/worldmap.test.ts`) prüft das automatisch.
 */
import type { MapObjectDef } from '../../core/worldmap';

// prettier-ignore
export const VILLAGE_LAYOUT: readonly string[] = [
  '..T.P.T.....P.T.T...T.P.T.T.T.T...T.T.~~T.T.T.T...T.T.T.',
  '.P...T.T.P.P.T.....T.P.P...P.T.T.P.P.P.~~T.T.T...T...P.T',
  '..T.T.P.T...P...P.T...T...P.T.....P.P.T~~...P...T.....P.',
  '.P.............P.....T.T.T.T...P.....T.T~~.....P...T.P.T',
  '........T.T...........T...........P.T...~~T.........T...',
  '...............P.....T.T.P...........P..~~.P...T........',
  '...........................#............~~......P.......',
  '.P................T........#...........T~~~T.........T.P',
  '...........................#............~~~...........T.',
  '...T.................,.....#.....r......~~~........P....',
  'P.........b................#...........~~~............T.',
  '......................T....#...........~~~.....#.......P',
  'T..........................#..........~~~......#........',
  '.P................,.,.,....#...b......~~~......#.......P',
  'T.............#............#..........~~~......#........',
  '..............#............#.........~~~.......#.......P',
  'P.............#........:::::::::.....~~~.......#......T.',
  '.....P........#........:::::::::.....~~~....#..#..#.....',
  '..T...........#....#...:::::::::.....~~~....#..#..#.....',
  '......#################:::::::::#####===#############..T',
  'T...,...,.,............:::::::::.....~~~................',
  '.P..,..,...,,..........:::::::::....~~~..............P.T',
  'T.P...,................:::::::::....~~~.................',
  '....,..,,,.................#........~~~................T',
  '..........,........T.......#........~~~.............b...',
  '........,..,...............#.......~~~.....T...........T',
  'T.T..,...,.................#..T....~~~................P.',
  '.T..,,....,,....T...bb.....#.......~~~...........T.....P',
  'P.....,...,.,..............#.....T~~~.......r...........',
  '...........................#......~~~..................T',
  'P.......r..................#......~~~...................',
  '....................sssssss#......~~~............sssssss',
  '.......sssss.....ssssssssss#ssss.s~~~sss.......sssssssss',
  'ssssssssssssssssssssssssssssssssss~~~sssssssssssssssssss',
  'sssssssssssssssssssssssssssssssssss~~~ssssssssssssssssss',
  'ssssssswwwwwsssssssssssssssssssssssswwwwwwssssssssssssss',
  'sssswwwwwwwwwwwwwwwwwsssssswwwwwwwwwwwwwwwwwsssssswwwwww',
  'wwwwwwwWWWWWwwwwwwwwwwwwwwwwwwwwwwwwWWWWWWwwwwwwwwwwwwww',
  'wwwwWWWWWWWWWWWWWWWWWwwwwwwWWWWWWWWWWWWWWWWWwwwwwwWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
];

export const VILLAGE_OBJECTS: readonly MapObjectDef[] = [
  // Linas Häuschen (Tür unten in der Mitte)
  { id: 'haus-lina', kind: 'house', x: 12, y: 11, variant: 'rose' },
  { id: 'briefkasten-lina', kind: 'mailbox', x: 16, y: 14 },
  { id: 'verkaufskiste', kind: 'sellbox', x: 12, y: 14 },
  { id: 'laterne-lina', kind: 'lantern', x: 11, y: 14 },
  { id: 'beet-lina', kind: 'beet', x: 6, y: 11 },
  { id: 'werkbank-lina', kind: 'workbench', x: 3, y: 11 }, // links neben dem Beet, damit sie die Sicht nicht verstellt

  // Oma Giselas Häuschen mit ihrer Bank
  { id: 'haus-gisela', kind: 'house', x: 42, y: 14, variant: 'lilac' },
  { id: 'bank-gisela', kind: 'bench', x: 45, y: 17 },

  // Bauplätze für zukünftige Bewohner
  { id: 'bauplatz-1', kind: 'plot', x: 17, y: 15, until: 'olafEingezogen' },
  // Olaf & Christin (ziehen in M6 ein) – mit der Dorfkasse
  { id: 'haus-olaf', kind: 'house', x: 17, y: 15, variant: 'mint', requires: 'olafEingezogen' },
  { id: 'bauplatz-3', kind: 'plot', x: 48, y: 14, until: 'jensEingezogen' },
  // Lars' Praxis mit Apotheke am Dorfplatz (M7c)
  { id: 'bauplatz-2', kind: 'plot', x: 22, y: 12, until: 'larsEingezogen' },
  { id: 'praxis-lars', kind: 'praxis', x: 22, y: 12, requires: 'larsEingezogen' },
  // Thalias gelbes Häuschen hinter der Brücke (M7d)
  { id: 'bauplatz-4', kind: 'plot', x: 42, y: 21, until: 'thaliaEingezogen' },
  { id: 'haus-thalia', kind: 'house', x: 42, y: 21, variant: 'butter', requires: 'thaliaEingezogen' },
  // Onkel Jens' Bistro „Chez Jens“ mit Kochstudio (M7b)
  { id: 'bistro-jens', kind: 'bistro', x: 48, y: 14, requires: 'jensEingezogen' },

  // Dorfplatz
  { id: 'brunnen', kind: 'fountain', x: 26, y: 18 },
  { id: 'schwarzes-brett', kind: 'board', x: 25, y: 16 },
  { id: 'laterne-platz-1', kind: 'lantern', x: 22, y: 16 },
  { id: 'laterne-platz-2', kind: 'lantern', x: 31, y: 16 },
  { id: 'laterne-platz-3', kind: 'lantern', x: 23, y: 22 },
  { id: 'laterne-platz-4', kind: 'lantern', x: 31, y: 22 },
  { id: 'bank-platz', kind: 'bench', x: 29, y: 22 },
  // Punschstand neben dem Weihnachtsbaum – steht nur im Dezember bis Weihnachten (virtuelles Flag)
  { id: 'punschstand', kind: 'stall', x: 29, y: 19, requires: 'adventszeit' },

  // Christins Samenstand (Samen für Linas Beet) – steht, sobald Olaf & Christin eingezogen sind
  { id: 'samenstand', kind: 'seedstall', x: 23, y: 16, requires: 'olafEingezogen' },

  // Orte aus den Herzenswünschen (`data/wishes.ts`) – erscheinen, wenn der Wunsch erfüllt ist
  { id: 'beet-gisela', kind: 'landmark', variant: 'blumenbeet', x: 41, y: 17, w: 3, h: 1, requires: 'wunsch-oma-beet' },
  { id: 'angelsteg', kind: 'steg', x: 39, y: 9, w: 2, h: 1, requires: 'wunsch-olaf-steg' },
  { id: 'kraeuterspirale', kind: 'landmark', variant: 'kraeuterspirale', x: 20, y: 18, w: 2, h: 1, requires: 'wunsch-christin-kraeuter' },
  { id: 'herzbank', kind: 'bench', variant: 'herz', x: 30, y: 32, requires: 'wunsch-oli-bank' },
  { id: 'aquarium-jens', kind: 'landmark', variant: 'aquarium', x: 53, y: 17, w: 2, h: 1, requires: 'wunsch-jens-aquarium' },
  { id: 'insektenhotel', kind: 'landmark', variant: 'insektenhotel', x: 28, y: 13, w: 1, h: 1, requires: 'wunsch-lars-insekten' },
  { id: 'aussichtspunkt', kind: 'landmark', variant: 'aussichtspunkt', x: 50, y: 30, w: 2, h: 1, requires: 'wunsch-thalia-aussicht' },

  // Brücke über den Fluss
  { id: 'bruecke', kind: 'bridge', x: 37, y: 19 },

  // Weitere Laternen & Bänke
  { id: 'laterne-bruecke', kind: 'lantern', x: 36, y: 18 },
  { id: 'laterne-strand', kind: 'lantern', x: 28, y: 30 },
  { id: 'bank-strand', kind: 'bench', x: 24, y: 31 },
  { id: 'bank-wiese', kind: 'bench', x: 7, y: 18 },
];

/** Hier steht Lina nach dem Einzug – direkt vor ihrer Haustür. */
export const VILLAGE_SPAWN = { x: 14, y: 14 };
