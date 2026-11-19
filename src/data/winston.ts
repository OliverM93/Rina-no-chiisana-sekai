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
  'Gegen so einen Blick ist man machtlos, Kind. Er hat sich dich ausgesucht. Er bleibt. Und wer was dagegen hat, kann mit mir reden.',
];

// ---------------------------------------------------------------------------
// Tricks: Winston lernt sie mit Omas Keks als Leckerli (nach und nach, ohne Zeitdruck)
// ---------------------------------------------------------------------------

export type TrickId = 'sitz' | 'pfoetchen' | 'rolle' | 'maennchen' | 'singen';

export interface TrickDef {
  id: TrickId;
  name: string;
  icon: string;
  /** So viele Übungen mit Leckerli, bis er den Trick kann */
  practice: number;
  /** Beim Üben (nicht gelernt) */
  learning: readonly string[];
  /** Beim Gelernt-sein: erste Vorführung */
  learned: string;
  /** Beim Vorführen */
  show: readonly string[];
}

/** Reihenfolge, in der Winston Tricks lernt */
export const TRICKS: readonly TrickDef[] = [
  { id: 'sitz', name: 'Sitz', icon: '🐕', practice: 2, learning: ['Winston schaut dich an, hebt den Po ein kleines Stück – und springt gleich wieder hoch. Fast!', 'Winston setzt sich hin, steht gleich wieder auf. Das Leckerli ist trotzdem weg.'], learned: 'Winston setzt sich kerzengerade hin und sieht unglaublich stolz aus. „Sitz“ kann er jetzt!', show: ['Sitz! Winston plumpst auf den Po und wedelt vom Boden aus. 🐶', 'Winston sitzt wie eine Eins. Fast wie ein Wachhund. Ein sehr kleiner.'] },
  { id: 'pfoetchen', name: 'Pfötchen', icon: '🐾', practice: 3, learning: ['Winston legt dir die Pfote auf die Hand … und wieder weg. Er überlegt noch.', 'Winston hebt die Pfote, schaut aufs Leckerli und vergisst, was er tun wollte.'], learned: 'Winston legt dir die Pfote in die Hand. Ganz sanft. „Pfötchen“ gelernt!', show: ['Pfötchen! Winston legt dir die Pfote in die Hand und sieht dich ernst an. 🐾', 'Winston gibt Pfötchen – und gleich noch eins, zur Sicherheit.'] },
  { id: 'rolle', name: 'Rolle', icon: '🌀', practice: 3, learning: ['Winston legt sich auf die Seite … und bleibt liegen. Immerhin gemütlich.', 'Winston dreht sich halb, schaut dich an und fragt mit den Augen: „Reicht das?“'], learned: 'Winston rollt sich einmal komplett über den Rücken, springt auf und strahlt. „Rolle“ sitzt!', show: ['Rolle! Winston wirft sich auf den Rücken und kullert einmal herum. 🌀', 'Winston rollt wie ein Fass – und steht hinterher schwankend auf, aber glücklich.'] },
  { id: 'maennchen', name: 'Männchen', icon: '🧍', practice: 4, learning: ['Winston richtet sich auf den Hinterbeinen auf – und kippt nach hinten. Platsch!', 'Winston versucht’s auf zwei Beinen. Zwei Sekunden lang sah es fantastisch aus.'], learned: 'Winston steht aufrecht auf den Hinterbeinen und balanciert wie ein kleiner Zirkushund. „Männchen“ kann er!', show: ['Männchen! Winston stellt sich auf die Hinterbeine und wackelt stolz. 🎪', 'Winston macht Männchen und sieht dabei aus wie ein sehr langes Erdmännchen.'] },
  { id: 'singen', name: 'Singen', icon: '🎶', practice: 4, learning: ['Winston öffnet das Maul … und gähnt. Das gilt noch nicht.', 'Winston jault einen halben Ton. Dann schaut er verlegen weg.'], learned: 'Winston hebt die Schnauze und singt. Ein langgezogenes „Auuuuh“ – er kann singen!', show: ['Winston hebt die Schnauze und singt ein „Auuuuh“, das durch das ganze Dorf klingt. 🎶', 'Winston singt. Falsch, laut und mit ganzer Seele.'] },
];

export const TRICK_BY_ID: Readonly<Record<TrickId, TrickDef>> = Object.fromEntries(TRICKS.map((t) => [t.id, t])) as Record<TrickId, TrickDef>;

export const TRICK_NO_TREAT = 'Winston schaut dich hoffnungsvoll an. Ohne Leckerli macht er heute keine neuen Tricks. Omas Kekse mag er am liebsten. 🍪';
export const TRICK_ALL_LEARNED = 'Winston kann alle Tricks. Du kannst sie ihm jederzeit vorführen lassen.';
export const TRICKS_NONE_YET = 'Winston kennt noch keine Tricks. Mit einem Keks als Leckerli kannst du sie ihm beibringen.';
