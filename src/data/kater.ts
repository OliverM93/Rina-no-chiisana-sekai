/**
 * Kater – Linas schwarzer Kater, der auch zu Olaf und Christin gehört. Er streunert durchs Dorf, sobald Olaf und
 * Christin eingezogen sind, und lässt sich streicheln. Er heißt einfach „Kater“.
 * Igor, Linas verstorbener Hund (gehörte auch zu Olaf), kommt nur in Erinnerungen vor (`data/erinnerungen.ts`).
 */

export const KATER_NAME = 'Kater';

/** Aussehen (Farben fürs 3D-Modell): schwarz mit gelben Augen */
export const KATER_LOOK = {
  fur: '#2b2931',
  belly: '#3b3842',
  ears: '#f0a3b6',
  eyes: '#e8c93a',
  nose: '#e88aa0',
};

/** Ab wann ist er unterwegs? (Stunden) – nachts schläft er bei Olaf und Christin */
export const KATER_HOURS: readonly [number, number] = [6, 22];

/** Flag: Lina hat ihn zum ersten Mal getroffen */
export const KATER_MET_FLAG = 'katerGetroffen';

/** Erstes Treffen */
export const KATER_FIRST: readonly string[] = [
  'Zwischen den Büschen blitzen gelbe Augen auf. Ein schwarzer Kater!',
  'Lina: „Kater! Da bist du ja. Du streunerst wieder durchs Dorf, hm?“',
  'Er blinzelt langsam. Das heißt bei Katzen: „Ich mag dich.“',
];

/** Beim Ansprechen (je Tag abwechselnd) */
export const KATER_HELLO: readonly (readonly string[])[] = [
  ['Der Kater sitzt da wie eine kleine schwarze Statue und schaut dich an.', 'Dann blinzelt er. Langsam. Zufrieden.'],
  ['Kater streckt sich, gähnt und zeigt alle Zähnchen.', 'Lina: „Na du Räuber. Alles gut?“'],
  ['Der Kater trabt heran und reibt den Kopf an deinem Bein.', 'Mrrrp?'],
  ['Kater legt sich mitten auf den Weg. Hier ist jetzt sein Platz.', 'Du darfst gern drumherum laufen.'],
];

/** Streicheln: erste Runde am Tag und danach */
export const KATER_PET_FIRST: readonly (readonly string[])[] = [
  ['Kater schließt die Augen und schnurrt wie ein kleiner Motor. 💗'],
  ['Er drückt den Kopf in deine Hand. Mehr! Mehr! Mehr!'],
  ['Kater rollt sich zur Seite. Das ist eine Falle. Der Bauch ist verboten. Aber der Rücken nicht. 😼'],
];
export const KATER_PET_AGAIN: readonly string[] = ['Brrr, brrr, brrr. Er schnurrt weiter.', 'Kater blinzelt dich an.', 'Der Schwanz geht langsam hin und her. Zufrieden.', 'Ein kleines Miau. Das heißt: „Du bist okay.“'];

/** Wenn er schläft oder bei Regen nicht zu sehen ist, steht nichts da – dies sind Texte für den Notfall (Klick auf den leeren Platz) */
export const KATER_RAIN_LINE = 'Bei Regen ist Kater lieber drinnen. Wer will es ihm verdenken?';
