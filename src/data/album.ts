/**
 * Album der Momente: Linas Geschichte in kurzen Einträgen (Feature Discovery B2).
 * Die Einträge werden aus dem Spielstand abgeleitet; nur das Datum wird gemerkt
 * (`world.dates['moment:<id>']`), es braucht kein eigenes Spielstand-Format.
 * Ton: Lina erzählt in der Ich-Form, warm und knapp – nie Pflicht, nie eine Liste zum Abhaken.
 */
import { UNTERNEHMUNGEN, zusammenErstKey } from './unternehmungen';

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
  oli: 'Oli und ich: fünf Herzen. Er sagt „Lini“, und mehr muss er gar nicht sagen.',
  jens: 'Onkel Jens und ich: fünf Herzen. „Ma chérie“, hat er gesagt, und ich hab „Fabelhaft“ geantwortet.',
  lars: 'Lars und ich: fünf Herzen. Er hat einen Spruch dazu gemacht. Natürlich.',
  thalia: 'Thalia und ich: fünf Herzen. Beste Freundin war ich schon, jetzt steht es auch im Album.',
};

const HEARTS_THREE: Readonly<Record<string, string>> = {
  gisela: 'Mit Oma Gisela verstehe ich mich jetzt richtig gut. Sie gibt mir sogar manchmal recht.',
  olaf: 'Papa und ich sind ein richtig gutes Team geworden.',
  christin: 'Christin und ich verstehen uns richtig gut. Ich räume jetzt freiwillig auf. Fast.',
  oli: 'Bei Oli fühlt sich alles nach Zuhause an.',
  jens: 'Onkel Jens und ich sind richtig dicke. Papa sagt, er ist ein bisschen eifersüchtig. Jens findet das großartig.',
  lars: 'Lars und ich haben inzwischen einen eigenen Insiderwitz. Ich verrate ihn nicht.',
  thalia: 'Thalia und ich sind wie in Tschechien damals – nur mit weniger Nachtbus und mehr Kuchen.',
};

const HOUSE_TEXTS: Readonly<Record<number, string>> = {
  1: 'Das Zimmer ist größer geworden. Plötzlich ist Platz für alles, was ich mir ausgedacht habe.',
  2: 'Der Anbau steht: ein zweites Zimmer, einfach durch die Tür. Ich bin dreimal hin- und hergelaufen.',
  3: 'Das Arbeitszimmer ist fertig. Ein ganzer Raum für Ruhe, Bücher und gute Ideen.',
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
  { id: 'mo-party', source: { flag: 'moKennengelernt' }, text: 'Ich wollte Thalia mit Mo verkuppeln. Mo hat Jule kennengelernt – und Thalia und ich haben den Rest der Nacht zusammen getanzt. Plan gescheitert, Abend gerettet.' },
  { id: 'einzug-thalia', source: { flag: 'thaliaEingezogen' }, text: 'Thalia ist eingezogen. Jetzt sind wir komplett – und es wird laut. Zum Glück.' },
  ...Object.entries(HOUSE_TEXTS).map(([n, text]): MomentDef => ({ id: `haus-${n}`, source: { houseStage: Number(n) }, text })),
  ...Object.keys(HEARTS_THREE).map((npc): MomentDef => ({ id: `herzen3-${npc}`, source: { hearts: { npc, min: 3 } }, text: HEARTS_THREE[npc] })),
  ...Object.keys(HEARTS_FIVE).map((npc): MomentDef => ({ id: `herzen5-${npc}`, source: { hearts: { npc, min: 5 } }, text: HEARTS_FIVE[npc] })),
  { id: 'sammlung-fische', source: { dateKey: 'sammlung:fische' }, text: 'Alle Fische im Sammelbuch. Sogar die scheuen. Jens hat eine Urkunde malen lassen.' },
  { id: 'sammlung-insekten', source: { dateKey: 'sammlung:insekten' }, text: 'Alle Insekten sind im Buch. Ich schaue Schmetterlinge jetzt anders an.' },
  { id: 'sammlung-funde', source: { dateKey: 'sammlung:funde' }, text: 'Alle Funde ausgegraben. Winston hat den größten Anteil, aber das gibt er nicht zu.' },
  { id: 'sammlung-blumen', source: { dateKey: 'sammlung:blumen' }, text: 'Alle Blumen in jeder Farbe. Das Beet ist ein kleines Wunder geworden.' },
  { id: 'insel-boot', source: { dateKey: 'insel:boot' }, text: 'Bei allen Fünf-Herzen-Freunden ist alles voll. Am Strand liegt ein kleines Boot, und alle sehen sehr geheimnisvoll aus.' },
  { id: 'insel-fest', source: { dateKey: 'insel:fest' }, text: 'Die versteckte Insel! Alle waren da, mit Kokosnüssen, Kuchen und einer Überraschung. Ich glaube, ich habe noch nie so viel gelacht.' },
  { id: 'insel-schildkroete', source: { dateKey: 'insel:schildkroete' }, text: 'Am Inselstrand liegt eine Meeresschildkröte. Sie hat Zeit. Ich auch, wenn ich bei ihr bin.' },
  { id: 'insel-delfine', source: { dateKey: 'insel:delfine' }, text: 'Delfine vor der Insel! Zwei Sprünge, ein Platsch, und ich habe eine Minute lang vergessen zu atmen.' },
  { id: 'insel-flaschenpost', source: { dateKey: 'insel:flaschenpost' }, text: 'Eine Flaschenpost ist angespült worden. Es war ein Brief von einem meiner Liebsten, und ich habe ihn dreimal gelesen.' },
  { id: 'insel-luau', source: { dateKey: 'insel:luau' }, text: 'Abends am Strand: Feuer, Fackeln und alle sitzen im Kreis. Ein kleines Luau, ganz ohne Grund.' },
  { id: 'winston-trick-1', source: { dateKey: 'winston:trick:sitz' }, text: 'Winston kann „Sitz“! Er hat dabei geschaut, als hätte er es schon immer gekonnt.' },
  { id: 'winston-tricks-alle', source: { dateKey: 'winston:tricks-alle' }, text: 'Winston kann alle seine Tricks: Sitz, Pfötchen, Rolle, Männchen und Singen. Ich bin so stolz, dass es fast komisch ist.' },
  { id: 'sammlung-tassen', source: { dateKey: 'sammlung:tassen' }, text: 'Alle Sammeltassen stehen im Regal. Kaffee schmeckt daraus besser, ganz sicher.' },
  { id: 'versteck-feenlichtung', source: { dateKey: 'versteck:feenlichtung' }, text: 'Ich habe die stille Lichtung gefunden. Zwischen den Bäumen glitzert es, als würden Lichter im Gras wohnen.' },
  { id: 'versteck-waldwinkel', source: { dateKey: 'versteck:waldwinkel' }, text: 'Im Waldwinkel stand eine Vogeltränke. Zwei Spatzen waren erst empört. Inzwischen baden sie in meinem Garten.' },
  { id: 'versteck-felsnische', source: { dateKey: 'versteck:felsnische' }, text: 'Neben dem großen Felsen lag ein kleines Steinmännchen. Jemand hat sich Mühe gegeben. Ich hab zu Hause eins nachgebaut, genau so.' },
  { id: 'versteck-treibgut', source: { dateKey: 'versteck:treibgut' }, text: 'Im Treibgut steckte eine Flaschenpost: „Such weiter, wo der Sand aufhört.“ Ich bin gespannt, was das heißt.' },
  // gemeinsame Unternehmungen: das erste Mal mit jeder Person
  ...UNTERNEHMUNGEN.map((u) => ({ id: `zusammen-${u.id}`, source: { dateKey: zusammenErstKey(u.id) }, text: u.album })),
  // früheres Spiel mit Lars (vor dem Kissen-Sumo) – wer es schon gespielt hat, behält die Erinnerung
  { id: 'zusammen-zocken-lars', source: { dateKey: zusammenErstKey('zocken-lars') }, text: 'Zockabend mit Lars: Er hat „Keine Panik, ich bin Arzt!“ gerufen und dabei die Chips verschüttet.' },
];

/** Ein Herzenswunsch ist erfüllt: Text wird in `game/album.ts` je Wunsch erzeugt. */
export const WISH_MOMENT_PREFIX = 'wunsch-';

/** Marker: ab hier werden Momente mit dem echten Tag verbucht (früher erlebte tragen kein Datum) */
export const ALBUM_START_KEY = 'moment:_start';
/** Datum, das für Momente steht, die vor dem Album passiert sind */
export const ALBUM_EARLIER = 'früher';
export const momentKey = (id: string) => `moment:${id}`;
