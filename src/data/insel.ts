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
  { npc: 'gisela', lines: ['Ich hab Kekse mitgebracht. Und meinen Sonnenhut. Das hier ist ja fast wie Urlaub, Kind.', 'Hawaii. Pfui, kein Strickmuster dafür. Aber köstlich!'] },
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
export const KOKOS_LEER: readonly string[] = ['Die Palme raschelt, aber heute fällt nichts herunter. 🌴', 'Nur ein paar Blätter wirbeln durch die Luft. Heute nicht. 🌴'];
export const KOKOS_SCHON: readonly string[] = ['Diese Palme hat heute schon alles hergegeben. Morgen wieder! 🌴'];

/** Tägliche Strandfunde auf der Insel (nach der Party): mehr Seesterne als im Dorf */
export const INSEL_FINDS_PER_DAY = 5;
export const INSEL_FINDS = [
  { itemId: 'herzmuschel', weight: 30 },
  { itemId: 'jakobsmuschel', weight: 26 },
  { itemId: 'schneckenhaus', weight: 24 },
  { itemId: 'seestern', weight: 20 },
] as const;

/** Erstes Mal im Inselgarten (Toast): hier darf Lina ihren Traum bauen */
export const GARTEN_HINWEIS = 'Das ist dein Garten vor der Hütte. 🌺 Hier passt ein Wachtelstall hin – und Beete, Wege, was du willst. Über „Garten gestalten“ geht’s los.';
