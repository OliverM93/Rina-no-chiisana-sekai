/**
 * Album der Momente: Linas Geschichte in kurzen Einträgen (Feature Discovery B2).
 * Die Einträge werden aus dem Spielstand abgeleitet; nur das Datum wird gemerkt
 * (`world.dates['moment:<id>']`), es braucht kein eigenes Spielstand-Format.
 * Ton: Lina erzählt in der Ich-Form, warm und knapp – nie Pflicht, nie eine Liste zum Abhaken.
 */

/** Woran man erkennt, dass der Moment eingetreten ist */
export type MomentSource =
  | { created: true }
  | { flag: string }
  | { hearts: { npc: string; min: number } }
  | { houseStage: number }
  /** bereits mit Datum gespeichert (`world.dates[key]`), z. B. Sammlungs-Urkunden */
  | { dateKey: string };

export interface MomentDef {
  id: string;
  /** Lina erzählt */
  text: string;
  source: MomentSource;
}

/** Fünf Herzen: ein persönlicher Satz je Bewohner */
const HEARTS_FIVE: Readonly<Record<string, string>> = {
  gisela: 'Oma Gisela und ich: fünf Herzen. Sie hat das letzte Wort behalten, aber ich glaube, sie hat dabei gelächelt.',
  olaf: 'Papa und ich: fünf Herzen. Er hat es vermutlich schon ausgerechnet.',
  christin: 'Christin und ich: fünf Herzen. Mein Zimmer sieht trotzdem so aus, als hätte sie es kurz angeschaut.',
  oli: 'Oli und ich: fünf Herzen. Mehr als ein Wort braucht es nicht, Lini genügt.',
  jens: 'Onkel Jens und ich: fünf Herzen. „Ma chérie“, hat er gesagt, und ich hab „Fabelhaft“ geantwortet.',
  lars: 'Lars und ich: fünf Herzen. Er hat einen Spruch dazu gemacht. Natürlich.',
  thalia: 'Thalia und ich: fünf Herzen. Beste Freundin war ich schon, jetzt steht es auch im Album.',
};

const HEARTS_THREE: Readonly<Record<string, string>> = {
  gisela: 'Mit Oma Gisela verstehe ich mich jetzt richtig gut. Sie gibt mir sogar manchmal recht.',
  olaf: 'Papa und ich sind ein richtig gutes Team geworden.',
  christin: 'Christin und ich verstehen uns richtig gut. Ich räume jetzt freiwillig auf. Fast.',
  oli: 'Bei Oli fühlt sich alles nach Zuhause an.',
  jens: 'Onkel Jens und ich sind richtig dicke. Frère wäre stolz.',
  lars: 'Lars und ich haben inzwischen einen eigenen Insiderwitz. Ich verrate ihn nicht.',
  thalia: 'Thalia und ich sind wieder wie früher – nur im Dorf statt auf Reisen.',
};

const HOUSE_TEXTS: Readonly<Record<number, string>> = {
  1: 'Das Zimmer ist größer geworden. Plötzlich ist Platz für alles, was ich mir ausgedacht habe.',
  2: 'Der Anbau steht: ein zweites Zimmer, einfach durch die Tür. Ich bin dreimal hin- und hergelaufen.',
  3: 'Das Dachzimmer ist fertig. Die Treppe knarrt, und ich liebe sie.',
  4: 'Die Wohnküche ist da. Ich habe sofort etwas gekocht, ganz ohne Grund.',
  5: 'Der Wintergarten leuchtet. Morgens fällt das Licht auf die Pflanzen, als hätte es das geplant.',
  6: 'Der Keller ist ausgebaut. Backstein, Ruhe und Platz für Hobbys. Mein Haus ist komplett.',
};

export const MOMENTS: readonly MomentDef[] = [
  { id: 'ankunft', source: { created: true }, text: 'Ich bin im Dorf angekommen. Alles ist neu und ein bisschen still.' },
  { id: 'winston', source: { flag: 'winstonGefunden' }, text: 'Winston ist da, mein kleiner Dackel. Seitdem laufe ich nie mehr allein.' },
  { id: 'einzug-olaf', source: { flag: 'olafEingezogen' }, text: 'Papa und Christin sind ins Dorf gezogen. Die Dorfkasse hat jetzt einen Chef.' },
  { id: 'einzug-oli', source: { flag: 'oliEingezogen' }, text: 'Oli ist bei mir eingezogen. Zu Hause ist jetzt noch ein bisschen mehr zu Hause.' },
  { id: 'einzug-jens', source: { flag: 'jensEingezogen' }, text: 'Onkel Jens ist im Dorf. Das Bistro duftet nach Kaffee und Kunst.' },
  { id: 'einzug-lars', source: { flag: 'larsEingezogen' }, text: 'Lars ist eingezogen. Die Praxis hat geöffnet, und er hat schon den ersten Spruch parat.' },
  { id: 'einzug-thalia', source: { flag: 'thaliaEingezogen' }, text: 'Thalia ist eingezogen. Jetzt sind wir komplett – und es wird laut. Zum Glück.' },
  ...Object.entries(HOUSE_TEXTS).map(([n, text]): MomentDef => ({ id: `haus-${n}`, source: { houseStage: Number(n) }, text })),
  ...Object.keys(HEARTS_THREE).map((npc): MomentDef => ({ id: `herzen3-${npc}`, source: { hearts: { npc, min: 3 } }, text: HEARTS_THREE[npc] })),
  ...Object.keys(HEARTS_FIVE).map((npc): MomentDef => ({ id: `herzen5-${npc}`, source: { hearts: { npc, min: 5 } }, text: HEARTS_FIVE[npc] })),
  { id: 'sammlung-fische', source: { dateKey: 'sammlung:fische' }, text: 'Alle Fische im Sammelbuch. Sogar die scheuen. Jens hat eine Urkunde malen lassen.' },
  { id: 'sammlung-insekten', source: { dateKey: 'sammlung:insekten' }, text: 'Alle Insekten sind im Buch. Ich schaue Schmetterlinge jetzt anders an.' },
  { id: 'sammlung-funde', source: { dateKey: 'sammlung:funde' }, text: 'Alle Funde ausgegraben. Winston hat den größten Anteil, aber das gibt er nicht zu.' },
  { id: 'sammlung-blumen', source: { dateKey: 'sammlung:blumen' }, text: 'Alle Blumen in jeder Farbe. Das Beet ist ein kleines Wunder geworden.' },
  { id: 'sammlung-tassen', source: { dateKey: 'sammlung:tassen' }, text: 'Alle Sammeltassen stehen im Regal. Kaffee schmeckt daraus besser, ganz sicher.' },
];

/** Ein Herzenswunsch ist erfüllt: Text wird in `game/album.ts` je Wunsch erzeugt. */
export const WISH_MOMENT_PREFIX = 'wunsch-';

/** Marker: ab hier werden Momente mit dem echten Tag verbucht (früher erlebte tragen kein Datum) */
export const ALBUM_START_KEY = 'moment:_start';
/** Datum, das für Momente steht, die vor dem Album passiert sind */
export const ALBUM_EARLIER = 'früher';
export const momentKey = (id: string) => `moment:${id}`;
