/**
 * Winston – Linas treuer kleiner Dackel. Läuft ihr überallhin nach, lässt sich
 * streicheln und buddelt einmal am Tag etwas aus.
 */

export const WINSTON_NAME = 'Winston';

/** Aussehen (Farben fürs 3D-Modell) */
export const WINSTON_LOOK = {
  /** rotbraunes Kurzhaar */
  fur: '#b8642e',
  belly: '#cf8550',
  ears: '#8e4a22',
  collar: '#e85a8a',
  tag: '#f2c94c',
};

/** Streicheln – erstes Mal am Tag */
export const PET_FIRST: readonly (readonly string[])[] = [
  ['Winston rollt sich sofort auf den Rücken. Bauch kraulen, bitte!', '💕'],
  ['Winston wedelt so doll, dass sein ganzer Po mitwackelt.'],
  ['Winston stupst dich mit der Nase an. Guten Morgen, Winston!'],
  ['Winston schließt genießerisch die Augen und brummelt zufrieden.'],
  ['Winston legt dir eine Pfote aufs Knie. Das heißt: „Weitermachen!“'],
];

/** Streicheln – noch einmal */
export const PET_AGAIN: readonly string[] = [
  'Winston wedelt fröhlich.',
  'Winston schleckt dir über die Hand.',
  'Winston legt den Kopf schief. Was gibt\'s?',
  'Winston schnauft zufrieden.',
  'Winston hüpft einmal im Kreis.',
  'Winston kann nie genug gestreichelt werden.',
];

/** Streicheln, während er schläft */
export const PET_SLEEPING: readonly string[] = [
  'Winston schläft tief und fest. Seine Pfötchen zucken – er träumt bestimmt vom Buddeln.',
  'Winston schnarcht ganz leise. Psst!',
];

/** Was Winston ausbuddeln kann (Gewichte) */
export const DIG_FINDS = [
  { itemId: 'ast', weight: 30 },
  { itemId: 'stein', weight: 26 },
  { itemId: 'samen-sonnenblume', weight: 10 },
  { itemId: 'samen-tulpe', weight: 10 },
  { itemId: 'samen-vergissmeinnicht', weight: 8 },
  { itemId: 'schneckenhaus', weight: 8 },
  { itemId: 'glitzerstein', weight: 8 },
] as const;

export const DIG_LINES: readonly string[] = [
  'Winston schnüffelt … buddelt … und hat etwas gefunden! 🐾',
  'Wuff! Winston hat ein Loch gebuddelt und präsentiert stolz seinen Fund.',
  'Winston buddelt wie ein Weltmeister. Da liegt etwas!',
];
