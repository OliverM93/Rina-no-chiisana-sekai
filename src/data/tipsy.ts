/**
 * Texte zum Schummrig-Werden (Bier & Wein im Café bei Jens, zu Hause). Warm und augenzwinkernd – nie verherrlichend:
 * Lina bremst sich selbst, und Wasser ist immer die freundliche Alternative. Logik: `core/tipsy.ts`.
 */

export type DrinkKind = 'bier' | 'wein' | 'wasser' | 'cola';
export type DrinkPlace = 'cafe' | 'zuhause';

/** Zeilen zum Getränk, je nach Ort */
export const DRINK_LINES: Readonly<Record<DrinkKind, Readonly<Record<DrinkPlace, readonly string[]>>>> = {
  bier: {
    cafe: ['Jens zapft selbst: „Ein Bier für meine Lieblingsnichte – aufs Haus!“ 🍺', '„Santé, ma chérie! Aber in Maßen, hm?“'],
    zuhause: ['Ein kühles Feierabendbier. 🍺', 'Ssssscht. Das ist das schönste Geräusch des Tages.'],
  },
  wein: {
    cafe: ['Jens schenkt einen Rotwein ein und schwenkt ihn sehr wichtig. 🍷', '„Santé! Der kommt aus einer ganz kleinen Gegend. Ich weiß nur nicht, aus welcher.“'],
    zuhause: ['Ein Glas Rotwein. 🍷', 'Lina schwenkt es ganz wichtig. Sie hat keine Ahnung, warum. Es sieht gut aus.'],
  },
  wasser: {
    cafe: ['Jens stellt ein Glas Wasser mit Zitronenscheibe hin. „Très chic, nicht wahr?“ 💧'],
    zuhause: ['Ein großes Glas Wasser. Kalt und klar. 💧'],
  },
  cola: {
    cafe: ['Cola Zero. Eiskalt.'],
    zuhause: ['Cola Zero! Es zischt, Lina seufzt glücklich. 🥤', 'Das erste Schlückchen ist immer das beste.'],
  },
};

/** Kurzer Kommentar nach dem Trinken, je nach Stufe (1 beschwipst, 2 schummrig, 3 ganz schön schummrig) */
export const STAGE_LINES: Readonly<Record<1 | 2 | 3, readonly string[]>> = {
  1: ['Mmh, das wärmt von innen. Die Welt ist ein kleines bisschen weicher. 😊', 'Ich fühl mich plötzlich sehr gut gelaunt. Und sehr witzig.'],
  2: ['Oh … der Boden wackelt. Oder bin das ich? 🥴', 'Die Lampen haben sich gerade bewegt. Ganz sicher.'],
  3: ['Ups. Jetzt wird alles ein bisschen schummrig … 🌀', 'Okay. Ich glaube, das war erst mal genug.'],
};

/** Lina lehnt selbst ab */
export const REFUSE_LINES: readonly (readonly string[])[] = [
  ['Lina schiebt das Glas weg. „Nee, jetzt lieber ein Wasser.“ 💧'],
  ['„Ich seh schon alles doppelt“, kichert Lina. „Und das waren nur die Gläser.“', 'Sie nimmt lieber ein Wasser.'],
];

/** Wasser, wenn Lina schummrig war – und wenn nicht */
export const WATER_CLEARS_LINES: readonly string[] = ['Das Wasser tut gut. Der Kopf wird wieder klar. 💧'];
export const WATER_PLAIN_LINES: readonly string[] = ['Wasser. Gesund, ein bisschen langweilig – und trotzdem gut.'];

/** Gelegentlich beim Schummrig-Sein (Hinweis oben) */
export const HICCUP_TOASTS: readonly string[] = ['*Hicks* 🫢', 'Lina kichert ohne Grund. 🥴', 'Huch! *hicks*', 'Alles dreht sich so schön. 🌀'];

/** Wenn es vorbei ist */
export const SOBER_TOAST = 'Die Welt steht wieder gerade. 🌤️';
