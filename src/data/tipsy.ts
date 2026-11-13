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

/**
 * Wie die Bewohner reagieren, wenn Lina angetrunken mit ihnen redet: je Figur zwei Stufen –
 * `leicht` (beschwipst, noch kichrig) und `schummrig` (schwankt schon). Immer liebevoll, nie verurteilend.
 */
export interface TipsyReaction {
  leicht: readonly (readonly string[])[];
  schummrig: readonly (readonly string[])[];
}

export const TIPSY_NPC_LINES: Readonly<Record<string, TipsyReaction>> = {
  gisela: {
    leicht: [['Kindchen, du glühst ja so. Hast du etwa ein Likörchen gehabt?', '… Ich frag nur für mich. Rein fachlich.'], ['Du kicherst ja, ohne dass ich was gesagt hab. Das ist verdächtig. Bei mir kichert nur der Wasserkocher.']],
    schummrig: [['Lina! Du schwankst wie ein Schiff im Sturm. Setz dich hin, Kind – und sag nichts.', 'Ich hab sowieso das letzte Wort.'], ['Ach du liebe Güte. Gleich Wasser und ein Keks! Ich hab Erfahrung, glaub mir. Opa Ludwig hat nach dem Sportfest auch so geguckt.']],
  },
  olaf: {
    leicht: [['Du bist ein bisschen rot um die Nase, Lina. Ist das das Wetter? … Oder die Steuer?', 'Keine Sorge, ich buch das unter „Feierabend“.'], ['Ein Gläschen in Ehren? Völlig steuerfrei. Prost, Lina.']],
    schummrig: [['Mein Gott, Lina, das ist ja eine Schlagseite! Ich hol dir ein Wasser. Und einen Stuhl. Und ein Formular.', 'Das Formular ist für mich, zur Beruhigung.'], ['Dieses Schwanken ist nicht im Haushaltsplan vorgesehen. Setz dich einen Moment, ja?']],
  },
  christin: {
    leicht: [['Du hast ein Glas gehabt, oder? Ich seh es an deinem Lächeln. Und an deinem schiefen Haarknoten.', 'Komm, ich richte ihn kurz. Nur kurz.'], ['Du riechst nach Feierabend. Ist nicht schlimm. Aber bitte nicht auf das frisch gemachte Sofa fallen.']],
    schummrig: [['Lina, du läufst Schlangenlinien! Bitte nicht in die Blumenbeete, die habe ich gerade erst gerade gezogen.', 'Ich hol dir Wasser. Und einen Untersetzer.'], ['Oje. Setz dich, ich stell dir ein Glas Wasser hin – auf einen Untersetzer, versteht sich.']],
  },
  jens: {
    leicht: [['Ma chérie, du strahlst! Hat mein Wein dich geküsst?', 'Das nenn ich ein Kompliment an die Winzerin!'], ['Nu, du bist ja richtig aufgekratzt! Gefällt mir. Santé!']],
    schummrig: [['Oh là là! Du tanzt ja schon, ohne dass Musik läuft! Setz dich, ich hol dir ein Wasser mit Zitrone.', 'Doppelt hält besser, gell?'], ['Ma chérie, die Welt dreht sich, was? Das ist normal, die Erde dreht sich auch. Aber trink jetzt ein Wasser, Bisous.']],
  },
  lars: {
    leicht: [['Schwesterherz, du hast so einen Glanz in den Augen. Ärztliche Diagnose: ein Glas. Oder anderthalb.', 'Alles gut. Ich schreib nichts auf.'], ['Du bist ganz schön kichrig. Medizinisch gesehen ist Lachen gesund. Alkohol nicht, aber die Mischung ist okay.']],
    schummrig: [['Rezept vom Doktor: Wasser, Brot, Sofa. Und morgen ein langer Spaziergang.', 'Ich schreib es dir auf. Wenn ich meinen Stift treffe.'], ['Lina, du wankst. Ich bin Arzt und sag: Setz dich, trink Wasser und rede nicht mit Oma über Politik.']],
  },
  thalia: {
    leicht: [['Lina! Du bist ja schon in Partystimmung! Warte, ich hol die Playlist!', 'Das wird ein guter Abend.'], ['Hihi, du kicherst! Ich liebe das. Wer braucht schon einen Club, wenn man dich hat?']],
    schummrig: [['Du torkelst ja mehr als ich nach einem Clubabend! Komm, wir tanzen – nein, warte, setz dich erst hin.', 'Ich hol dir ein Wasser. Das ist mein Beitrag zur Freundschaft.'], ['Lina! Alles dreht sich, stimmt’s? Atme tief durch, trink was Klares. Und beim nächsten Mal teilen wir uns die Gläser.']],
  },
  oli: {
    leicht: [['Lini, du bist ja ganz kichrig. Das mag ich.', 'Erzähl mir noch mal den Witz von vorhin. Welchen? Egal, du erzählst ihn super.'], ['Du hast diesen Glanz in den Augen. Wenn du so lachst, vergess ich glatt, was ich sagen wollte.']],
    schummrig: [['Lini … du lehnst dich gerade an mich, oder? Alles gut, ich hab dich.', 'Wasser? Winston passt auf.'], ['Komm, setz dich. Ich bleib bei dir, bis alles wieder gerade steht. Das ist mein Job.']],
  },
};
