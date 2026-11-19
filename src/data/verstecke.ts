/**
 * Verstecke auf der Dorfkarte (Feature Discovery, „Erkunden“): Kleine geheime Orte, die man nur findet, wenn man
 * genau hinschaut. Es gibt drei Wege dorthin: mit der Schaufel einfach an der Stelle graben; Winston wird aufgeregt,
 * wenn Lina in der Nähe ist (die Stelle funkelt dann); oder Thalia, die Geografin, erzählt von einer alten Karte
 * (dann steht ein ✕ auf der Dorfkarte, Taste M). Jedes Versteck hat einen kleinen, schönen Fund – nichts ist nötig,
 * nichts verfällt, kein Zähler im Notizbuch.
 */

export interface VersteckDef {
  id: string;
  /** Kachel auf der Dorfkarte */
  x: number;
  y: number;
  /** Für Album & Karte (kurz) */
  name: string;
  /** Thalias Hinweis auf der „alten Karte“ */
  hint: string;
  /** Linas Gedanken beim Fund */
  found: readonly string[];
  /** Fund: Gegenstände (Möbel oder Dinge) */
  items: ReadonlyArray<{ itemId: string; count: number }>;
}

export const VERSTECKE: readonly VersteckDef[] = [
  {
    id: 'feenlichtung',
    x: 3,
    y: 2,
    name: 'Die stille Lichtung',
    hint: 'Ganz oben links, zwischen zwei Bäumen, soll es eine kleine Lichtung geben. Vom Weg aus sieht man sie gar nicht.',
    found: ['Zwischen den Bäumen ist es plötzlich ganz still. Das Gras glitzert, als wären Lichter darin.', 'Unter dem Moos liegt eine kleine Lampe, die noch leuchtet. Wie ein Feenlicht! ✨'],
    items: [{ itemId: 'glitzerlampe', count: 1 }],
  },
  {
    id: 'waldwinkel',
    x: 50,
    y: 1,
    name: 'Der Waldwinkel',
    hint: 'Im Nordosten, in der allerletzten Ecke vom Wald, ist ein Kreuz eingezeichnet. Bestimmt trinken da Vögel.',
    found: ['In der hintersten Waldecke steht, halb unter Efeu, eine steinerne Schale mit Regenwasser.', 'Zwei Spatzen schauen mich empört an. „Ja, ja“, sage ich. „Die kommt in meinen Garten. Ihr seid herzlich eingeladen.“'],
    items: [{ itemId: 'vogeltraenke', count: 1 }],
  },
  {
    id: 'felsnische',
    x: 9,
    y: 30,
    name: 'Die Felsnische',
    hint: 'Im Südwesten, neben dem einzelnen großen Felsen, ist eine Stelle markiert. Nimm die Schaufel mit.',
    found: ['Neben dem großen Felsen liegen ein paar flache Steine, genau aufeinandergestapelt.', 'Wer auch immer das gebaut hat: Es ist hübsch. Ich bau es mir zu Hause nach – genau so. 🪨'],
    items: [{ itemId: 'steinmaennchen', count: 1 }],
  },
  {
    id: 'treibgut',
    x: 54,
    y: 31,
    name: 'Das Treibgut',
    hint: 'Am Strand ganz im Osten, da, wo der Sand schmal wird, ist ein Kreuz im Treibgut.',
    found: [
      'Zwischen Treibholz und Algen steckt eine Flaschenpost! Darin ein Zettel in runder Schrift:',
      '„Wer das hier liest, hat gut gesucht. Die Welt ist klein und trotzdem weit. Such weiter, wo der Sand aufhört – dort fängt der Himmel an.“',
      'Neben der Flasche liegen zwei Seesterne und eine Muschellampe. Das Meer hat Humor. 🌊',
    ],
    items: [{ itemId: 'seestern', count: 2 }, { itemId: 'muschellampe', count: 1 }],
  },
];

export const VERSTECK_BY_ID: Readonly<Record<string, VersteckDef>> = Object.fromEntries(VERSTECKE.map((v) => [v.id, v]));

/** Wie nah Lina sein muss, damit Winston aufgeregt wird (Kacheln) */
export const WINSTON_SNIFF_RANGE = 3.5;

/** Winston wird aufgeregt */
export const WINSTON_SNIFF_TOAST = 'Winston schnüffelt aufgeregt und scharrt am Boden. Hier ist etwas! 🐾';

/** Thalia erzählt von der alten Karte */
export const THALIA_MAP_LEAD: readonly string[] = ['Du, Lina, ich hab beim Aufräumen eine alte Karte gefunden. Mit einem Kreuz drauf!'];
export const THALIA_MAP_TAIL: readonly string[] = ['Ich hab es dir in deine Dorfkarte eingetragen (Taste M). Nimm die Schaufel mit, falls du Lust hast.'];
export const THALIA_MAP_EVERY_NTH_DAY = 4;

export const VERSTECK_ALBUM_PREFIX = 'versteck-';
export const versteckDateKey = (id: string) => `versteck:${id}`;
export const versteckHintFlag = (id: string) => `versteck-hinweis-${id}`;
