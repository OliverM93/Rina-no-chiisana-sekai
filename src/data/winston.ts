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
  { itemId: 'samen-rose', weight: 6 },
  { itemId: 'schneckenhaus', weight: 8 },
  { itemId: 'glitzerstein', weight: 8 },
  // Spezialköder: ein besonderer Fang beim nächsten Angeln (Rekordfänge)
  { itemId: 'koeder-gluckswurm', weight: 12 },
] as const;

export const DIG_LINES: readonly string[] = [
  'Winston schnüffelt … buddelt … und hat etwas gefunden! 🐾',
  'Wuff! Winston hat ein Loch gebuddelt und präsentiert stolz seinen Fund.',
  'Winston buddelt wie ein Weltmeister. Da liegt etwas!',
];

// ---------------------------------------------------------------------------
// Winston wird gefunden (kurz nach Spielbeginn, statt von Anfang an dabei zu sein)
// ---------------------------------------------------------------------------

/** Spielzeit (Sekunden) nach Omas Werkzeugen, bis ein leises Fiepen zu hören ist */
export const WINSTON_DELAY_SECONDS = 150;
/** Wo er sich im Gestrüpp verfangen hat (Kachel, neben der Bank auf der Wiese) */
export const WINSTON_SPOT = { x: 10.5, y: 18.5 };
/** Story-Flags */
export const WINSTON_FLAGS = {
  /** Neues Spiel: Winston kommt erst noch (ältere Spielstände haben ihn schon) */
  pending: 'winstonNochNicht',
  appeared: 'winstonErschienen',
  found: 'winstonGefunden',
  omaTold: 'winstonOmaGesagt',
} as const;

export const WINSTON_APPEARS_TOAST = 'Von der Wiese hinter dem Haus kommt ein leises Fiepen … 🐾';

export const WINSTON_FIND_LINES: readonly string[] = [
  'Im Gestrüpp hat sich ein kleiner Dackel verheddert. Sein rosa Halsband hängt an einer Ranke fest.',
  'Er winselt leise und schaut dich mit riesigen Augen an. 🥺',
];

export const WINSTON_FREED_LINES: readonly string[] = [
  'Ritsch – das Halsband ist frei!',
  'Der Kleine schüttelt sich, schnuppert an deiner Hand und leckt dir einmal über die Finger. 💕',
  'An seinem Halsband hängt ein goldenes Schildchen: „Winston“.',
  'Er weicht dir nicht mehr von der Seite. Und jetzt hast du wohl einen Dackel. 🐾',
];

/** Oma beim ersten Gespräch danach */
export const GISELA_WINSTON_LINES: readonly string[] = [
  'Na, wer ist denn der Kleine da neben dir?',
  'Winston? Den kenn ich! Der hat schon die ganze Woche an meiner Bank geschnuppert. Ich hab ihm ein Stück Leberwurstbrot gegeben. Er hat es sehr ernst genommen.',
  'Gegen so einen Blick ist man machtlos, Kind. Er hat sich dich ausgesucht. Und ich hab immer das letzte Wort – also: Er bleibt.',
];
