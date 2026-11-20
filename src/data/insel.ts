/**
 * Die versteckte Insel – die große Belohnung, wenn Lina bei **allen** Bewohnern alle fünf Herzen hat. Ein Boot liegt
 * am Dorfstrand; auf der Insel ist es immer sonnig wie auf Hawaii (eigene Musik), und beim ersten Besuch wartet
 * eine Überraschungsparty mit allen, die Lina lieb haben. Texte & Belohnung hier, Logik in `game/insel.ts`.
 */

/** Flag: Alle Herzen sind voll, das Boot ist da */
export const INSEL_OFFEN_FLAG = 'inselOffen';
/** Flag: Lina war schon einmal auf der Insel (Überraschungsparty gab es) */
export const INSEL_FEST_FLAG = 'inselFest';

/** Toast, wenn das Boot auftaucht */
export const INSEL_BOOT_TOAST = '⛵ Am Dorfstrand liegt plötzlich ein kleines Boot … und alle sehen so geheimnisvoll aus.';

/** Das Boot am Dorfstrand */
export const BOOT_DORF_LINES: readonly string[] = [
  'Ein kleines Ruderboot mit einem bunten Wimpel liegt am Strand. Das Wasser glitzert, als würde es etwas wissen.',
  'Hinten im Boot steckt ein Zettel in runder Schrift: „Wer so viele Herzen sammelt, findet auch eine Insel. Du brauchst nur zu rudern.“',
];

/** Das Boot auf der Insel (zurück) */
export const BOOT_INSEL_LINES: readonly string[] = ['Das Boot wartet am Sandstrand. Zurück ins Dorf rudern?'];

/** Fahrt zur Insel / zurück */
export const FAHRT_HIN = '⛵ Lina rudert aufs offene Meer hinaus …';
export const FAHRT_ZURUECK = '⛵ Lina rudert zurück ins Dorf …';

/** Beim ersten Ankommen */
export const ANKUNFT_ERSTMALS: readonly string[] = [
  'Weißer Sand, warmes Wasser, Palmen, die im Wind rascheln … Es ist richtig sommerlich hier. Und still.',
  'Aber es ist gar nicht still. Hinter den Palmen klingt Gelächter.',
];

/** Überraschungsparty: jeder sagt etwas (Reihenfolge = Reihenfolge der Sprecher) */
export const FEST_LINES: ReadonlyArray<{ npc: string; lines: readonly string[] }> = [
  { npc: 'oli', lines: ['ÜBERRASCHUNG, Lini!', 'Wir wollten dir was zeigen. Weil du uns allen so ein Zuhause gebaut hast.', 'Du hast doch immer von einem kleinen Hüttchen auf Hawaii geträumt. Mit einer eigenen Wachtelfarm.', 'Dein Traum ist jetzt wahr. Die Hütte steht da hinten, und der Garten davor gehört dir. 🌺🐦'] },
  { npc: 'gisela', lines: ['Ich hab Kekse mitgebracht. Und meinen Sonnenhut. Das hier ist ja fast wie Urlaub, Kind.', 'Hawaii. Pfui, so wenig an! … Aber die Blumenketten: köstlich.'] },
  { npc: 'olaf', lines: ['Ich habe ausgerechnet: Fünf Herzen bei sieben Personen. Das ist eine hervorragende Quote. Dafür gibt es eine Insel.'] },
  { npc: 'christin', lines: ['Sand an den Schuhen. Normalerweise würde mich das stören. Heute nicht. Heute ist besonders.'] },
  { npc: 'jens', lines: ['Ma chérie! Aloha, bonjour, was auch immer! Ich habe mir sagen lassen, hier trinkt man aus Kokosnüssen. Ich bin begeistert.'] },
  { npc: 'lars', lines: ['Ärztlicher Rat: Sonne, Meer, Familie und mindestens zwei Nachtische. Ich verschreibe dir diese Insel für immer.'] },
  { npc: 'thalia', lines: ['Lina! Ich hab nach einem Ort auf der Karte gesucht, den es nicht gibt. Und jetzt stehen wir drauf!', 'Ich zeichne ihn sofort ein. Nein, warte. Er soll ein Geheimnis bleiben.'] },
];

/** Nach der Party: die große Belohnung */
export const FEST_FINALE: readonly string[] = [
  'Zwischen den Palmen steht eine Kiste aus hellem Holz, mit einer Muschelschleife.',
  'Oli: „Mach sie auf, Lini. Das ist von uns allen.“',
  'Drin: ein Inselset für dein Zuhause – eine Palme im Topf, zwei Tiki-Fackeln, eine Hängematte, ein Surfbrett und eine kleine Ukulele für die Wand. 🌺',
  'Hinten steht deine Hütte, mit einem Garten davor – ganz für dich. Für Wachteln wäre da auch noch Platz.',
  'Und das Boot gehört dir. Du kannst jederzeit zur Insel rudern, wenn dir nach Sonne ist.',
];

/** Inselset: Gegenstände der Belohnung */
export const INSEL_BELOHNUNG: ReadonlyArray<{ itemId: string; count: number }> = [
  { itemId: 'inselpalme', count: 1 },
  { itemId: 'tiki-fackel', count: 2 },
  { itemId: 'haengematte', count: 1 },
  { itemId: 'surfbrett', count: 1 },
  { itemId: 'ukulele', count: 1 },
];

/** Kurze Sätze, wenn Lina danach wieder auf der Insel ist (Toast beim Ankommen, abwechselnd) */
export const ANKUNFT_WIEDER: readonly string[] = [
  'Aloha! ☀️ Die Insel ist genauso sonnig wie beim letzten Mal.',
  'Warmer Sand unter den Füßen, Palmen im Wind. Hier ist immer Sommer. 🌺',
  'Das Wasser glitzert. Irgendwo knackt eine Kokosnuss. 🥥',
];

/** Palmen schütteln: Kokosnüsse (jede Palme einmal am Tag, nicht jede hat etwas) */
export const KOKOS_CHANCE = 45;
export const KOKOS_GEFUNDEN: readonly string[] = ['🥥 Plong! Eine Kokosnuss fällt aus der Krone.', '🥥 Es raschelt, und eine Kokosnuss plumpst in den Sand.', '🥥 Ein dumpfes Geräusch: Da lag eine Kokosnuss im Blattschopf!'];
export const KOKOS_LEER: readonly string[] = ['Die Palme raschelt, aber heute fällt nichts herunter. 🌴', 'Nur ein paar Blätter wirbeln durch die Luft. Heute fällt nichts herunter. 🌴'];
export const KOKOS_SCHON: readonly string[] = ['Diese Palme hat heute schon alles hergegeben. Morgen wieder! 🌴'];

/** Tägliche Strandfunde auf der Insel (nach der Party): mehr Seesterne als im Dorf */
export const INSEL_FINDS_PER_DAY = 5;
export const INSEL_FINDS = [
  { itemId: 'herzmuschel', weight: 30 },
  { itemId: 'jakobsmuschel', weight: 26 },
  { itemId: 'schneckenhaus', weight: 24 },
  { itemId: 'seestern', weight: 20 },
  // selten: eine Flaschenpost (wird beim Aufheben sofort geöffnet, siehe unten)
  { itemId: 'flaschenpost', weight: 6 },
] as const;

/** Erstes Mal im Inselgarten (Toast): hier darf Lina ihren Traum bauen */
export const GARTEN_HINWEIS = 'Das ist dein Garten vor der Hütte. 🌺 Hier passt ein Wachtelstall hin – und Beete, Wege, was du willst. Über „Garten gestalten“ geht’s los.';

// ---------------------------------------------------------------------------
// Flaschenpost: gelegentlich spült eine Flasche an den Inselstrand (nur nach der Party)
// ---------------------------------------------------------------------------

export interface FlaschenBrief {
  id: string;
  npc: string;
  subject: string;
  body: string;
  gift?: { itemId: string; count: number };
}

/** Briefe aus der Flasche – je Bewohner zwei, jeder kommt nur einmal */
export const FLASCHEN_BRIEFE: readonly FlaschenBrief[] = [
  { id: 'oli-1', npc: 'oli', subject: 'Aus dem Meer gefischt', body: 'Lini,\n\nich habe diese Flasche gestern Abend ins Wasser geworfen und gehofft, dass sie bei dir ankommt. Wenn du das liest: Es hat geklappt.\n\nIch denke gerade an dich, ganz genau jetzt. Komm bald nach Hause, ich koch uns dein Lieblingsessen (und tu so, als wär das ganz spontan gewesen).\n\nDein Oli' },
  { id: 'oli-2', npc: 'oli', subject: 'Noch eine Flasche', body: 'Lini,\n\nich hab dir ja versprochen, dass die nächste Flasche kommt. Hier ist sie.\n\nWeißt du, wann ich zuletzt so ruhig war wie auf deiner Insel? Nie. Danke, dass du mich mitgenommen hast.\n\nDein Oli', gift: { itemId: 'seestern', count: 1 } },
  { id: 'gisela-1', npc: 'gisela', subject: 'Flaschenpost von Oma', body: 'Liebes Kind,\n\nein Brief in einer Flasche. Der Postbote hat gesagt, das macht man nicht. Ich habe gesagt, das macht man doch.\n\nIss was Ordentliches und sitz nicht zu lange in der Sonne. Es sei denn, es ist ein Sonnenhut dabei. Köstlich!\n\nOma' },
  { id: 'gisela-2', npc: 'gisela', subject: 'Schon wieder Oma', body: 'Liebes Kind,\n\nIch habe noch eine Flasche gefunden. Ludwig hätte jetzt gesagt: „Gisela, du hast zu viele Flaschen.“\n\nIch hab gesagt: „Ludwig, du hast zu viele Meinungen.“\n\nPass auf dich auf.\nOma', gift: { itemId: 'keks', count: 3 } },
  { id: 'olaf-1', npc: 'olaf', subject: 'Offizielle Meldung per Flasche', body: 'Liebe Lina,\n\nich habe berechnet, dass die Chance, dass diese Flasche dich erreicht, bei etwa 0,3 % liegt. Ich habe sie trotzdem losgeschickt.\n\nDie Dorfkasse ist stolz auf dich. Ich übrigens auch, aber das steht nicht im Kontoauszug.\n\nPapa' },
  { id: 'olaf-2', npc: 'olaf', subject: 'Zweite Meldung (ebenfalls per Flasche)', body: 'Liebe Lina,\n\nChristin sagt, ich soll dir ein Witzchen mitschicken: Was macht ein Fisch am Computer? Er geht ins Netz.\n\nSie sagt, der war schlecht. Ich finde ihn gut.\n\nPapa' },
  { id: 'christin-1', npc: 'christin', subject: 'Eine ordentliche Flasche', body: 'Liebe Lina,\n\ndiese Flasche ist gespült, gut verschlossen und ordentlich beschriftet. Ich hoffe, du schaffst es, sie ebenso ordentlich zu öffnen.\n\nDie Insel sieht von weitem sehr aufgeräumt aus. Das gefällt mir.\n\nChristin' },
  { id: 'christin-2', npc: 'christin', subject: 'Kleiner Gruß', body: 'Liebe Lina,\n\nich habe das Kräuterbeet gegossen und die Flaschenpost vorbereitet. Beides geht schneller, wenn man vorher alles an seinen Platz räumt.\n\nGrüß die Palmen von mir.\n\nChristin' },
  { id: 'jens-1', npc: 'jens', subject: 'Message in a bottle!', body: 'Ma chérie,\n\nich habe mir sagen lassen, dass man auf Inseln Flaschenpost bekommt. Also schicke ich dir eine. Aus Kunstgründen.\n\nSteffen aus San Francisco lässt grüßen, er meint, deine Insel sei das hübscheste Hawaii, das er nie gesehen hat.\n\nDein Jens' },
  { id: 'jens-2', npc: 'jens', subject: 'Zweite Flasche, zweite Weltreise', body: 'Lina,\n\njede Flasche ist ein kleines Kunstwerk, findest du nicht? Diese hier ist von meiner letzten Reise: ein Hauch Meer, ein Hauch Wein, ein Hauch Übertreibung.\n\nBis Sonntag!\nJens' },
  { id: 'lars-1', npc: 'lars', subject: 'Ärztlicher Rat in der Flasche', body: 'Liebe Lina,\n\nRezept: Sonne, Meer und mindestens zwei Nachtische. Dosierung: täglich. Nebenwirkungen: gute Laune.\n\nDie Flasche ist übrigens mit Pflaster verschlossen. Man muss improvisieren.\n\nLars' },
  { id: 'lars-2', npc: 'lars', subject: 'Zweites Rezept', body: 'Liebe Lina,\n\nso, und nicht mit e, sonst ist es ein See: Das hier ist ein Meer. Und du bist die Einzige, die darin so gut angeln kann.\n\nBitte Sonnencreme nicht vergessen. Das ist ein ärztlicher Rat, kein Spruch.\n\nLars' },
  { id: 'thalia-1', npc: 'thalia', subject: 'Karte aus der Flasche', body: 'Lina!\n\nich habe die Insel auf eine Karte gezeichnet und die Karte in die Flasche gesteckt. Nein, warte, doch nicht. Die Insel soll ein Geheimnis bleiben. Also steht hier nur eine Wolke.\n\nSamstag tanzen?\nThalia' },
  { id: 'thalia-2', npc: 'thalia', subject: 'Noch ein Plan', body: 'Lina!\n\nPlan für den Strand: erst Beintag am Wasser, dann Hula. Ich hab das schon im Kalender eingetragen. Du kommst mit. Keine Widerrede!\n\nUnd Mo findet das auch gut. Glaube ich. Frag ihn bitte nicht.\n\nThalia' },
];

export const FLASCHENPOST_GEFUNDEN = 'Eine Flaschenpost! 🍾 Sie ist schon geöffnet – der Brief liegt im Briefkasten.';
export const FLASCHENPOST_LEER = 'Eine Flaschenpost! Diesmal steckt nur Sand darin – und ein kleiner Seestern, der mitgereist ist. 🍾';

// ---------------------------------------------------------------------------
// Meeresschildkröte & Delfine
// ---------------------------------------------------------------------------

export const SCHILDKROETE_ERSTMALS: readonly string[] = [
  'Am Strand liegt eine Meeresschildkröte. Sie blinzelt langsam und sieht Lina an, als hätte sie schon auf sie gewartet.',
  'Lina setzt sich daneben. Es ist ganz still, nur das Meer macht leise „schsch“.',
];
export const SCHILDKROETE_LINES: readonly (readonly string[])[] = [
  ['Die Schildkröte blinzelt. Sie hat es nicht eilig. Hier hat niemand es eilig.'],
  ['Lina streichelt vorsichtig den Panzer. Er ist warm von der Sonne.', 'Die Schildkröte seufzt. Oder ist das das Meer?'],
  ['„Du hast Zeit“, scheint die Schildkröte zu sagen. „Mehr als du denkst.“'],
  ['Die Schildkröte gräbt gemächlich im Sand und legt sich wieder hin. Sehr beschäftigt. Sehr gemütlich.'],
];

export const DELFINE_GESEHEN = '🐬 Delfine! Zwei springen draußen im Meer – einmal hoch, einmal Platsch. Winston bellt begeistert.';

// ---------------------------------------------------------------------------
// Sonnenuntergangs-Luau: ab und zu abends ein kleines Strandfest (nie Pflicht)
// ---------------------------------------------------------------------------

export const LUAU_HINWEIS = '🔥 Am Strand brennt ein Feuer, und die Tiki-Fackeln leuchten. Heute Abend ist Luau – wer mag, schaut vorbei.';

/** Was die Gäste beim Luau sagen (je Bewohner) */
export const LUAU_LINES: Readonly<Record<string, readonly (readonly string[])[]>> = {
  oli: [['Lini! Setz dich zu mir, das Feuer ist gut für Sonnenuntergänge.', 'Ich hab die Ukulele mitgebracht. Ich kann nur zwei Akkorde. Aber mit viel Gefühl.'], ['Weißt du, was ich an der Insel mag? Man hört dich lachen, auch wenn ich dich nicht sehe.']],
  gisela: [['Ein Feuer am Strand! Ludwig hätte Würstchen mitgebracht.', 'Ich habe Kekse. Und einen Hut. Hawaii steht mir, merkst du.'], ['Das Meer rauscht schön. Fast so schön wie meine Kaffeetafel.']],
  olaf: [['Ich habe den Sonnenuntergang auf die Minute berechnet. Er ist pünktlich. Beeindruckend.'], ['Das Feuer kostet kein Geld. Das mag ich an ihm.']],
  christin: [['Ich habe Sand im Schuh. Ich gebe zu: Es stört mich heute nicht.'], ['Alle sitzen in einem schönen Kreis. Das ist sehr ordentlich. Bravo.']],
  jens: [['Ma chérie! Ein Strandfeuer, ein Sonnenuntergang und mein Lieblingsmensch. Was will man mehr?', 'Ich tanze gleich Hula. Ich hab es mir von einem Video beigebracht.'], ['Oh la la, wie schön das Licht ist! Ich muss es malen. Oder wenigstens fotografieren. Oder beides.']],
  lars: [['Ärztlicher Rat: Feuer, Familie, Fladenbrot. Alles drei ist gut für die Seele.'], ['Ich hab gelesen, dass Strandabende die Stimmung um 37 % heben. Das habe ich gerade erfunden. Aber es stimmt.']],
  thalia: [['Lina! Ich hab heute schon trainiert, und jetzt wird getanzt. Das ist Balance!', 'Der Sternenhimmel hier ist ein Traum. Ich zeichne ihn nachher. Oder ich schau einfach.'], ['Mo hätte hier auch gepasst. Ich sag nur: Er hätte hier gepasst.']],
};
