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
  { npc: 'oli', lines: ['ÜBERRASCHUNG, Lini!', 'Wir wollten dir was zeigen. Weil du uns allen so ein Zuhause gebaut hast.'] },
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
