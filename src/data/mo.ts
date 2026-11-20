/**
 * Mo – Olis bester Freund. Kein Bewohner: Er kommt nur zu Besuch auf Thalias Samstagsparty.
 *
 * Kleine Geschichte: Lina will Thalia verkuppeln und lädt Mo (über Oli) zur Party ein. Die beiden verstehen sich,
 * aber Mo hat kürzlich jemanden kennengelernt (Jule) – aus der Verkupplung wird nichts. Thalia nimmt es mit Humor,
 * und der Abend wird trotzdem schön. Danach schaut Mo ab und zu samstags vorbei.
 *
 * Aussehen nach einem Foto nachempfunden (das Foto ist NICHT Teil des Projekts).
 */
import type { Appearance } from '../core/appearance';
import { LOOKS } from './npcs/looks';

export const MO_NAME = 'Mo';

/** Mo: Aussehen steht bei allen anderen in `npcs/looks.ts` */
export const MO_LOOK: Appearance = LOOKS.mo;

/** Oli lädt Mo zur Party ein (Gesprächsoption bei Oli) */
export const MO_INVITE_LINES: readonly string[] = [
  'Mo zur Party einladen? Wegen Thalia? … Lini. Ich weiß genau, was du vorhast.',
  'Okay, ich schreib ihm. Samstag, 19 Uhr, Dorfplatz. Ich sag ihm, er soll was Schickes anziehen. Also seine Weste.',
  'Aber ich spiel nicht Amor. Ich bin nur der Fahrer.',
];

/** Erinnerung, solange Mo noch nicht da war (Oli, wenn man ihn nochmal anspricht) */
export const MO_WAITING_LINE = 'Mo kommt Samstag zur Party. Ab 19 Uhr auf dem Dorfplatz. Ich hab ihm nichts verraten. Fast nichts.';

/** Das erste Treffen auf der Party */
export const MO_MEETING: readonly string[] = [
  'Neben der Musik steht Mo: kurze braune Haare, Dreitagebart, schwarze Steppweste überm weißen T-Shirt, breites Grinsen. „Lina! Endlich mal wieder!“',
  'Oli, leise zu dir: „Ich hab ihm nichts verraten. Ehrenwort. … Fast nichts.“',
  'Du winkst Thalia rüber. Sie kommt tanzend an – und richtet ganz unauffällig ihr Halstuch.',
  'Thalia: „Hi! Ich bin Thalia. Ich hab die Playlist gemacht. Wenn sie dir nicht gefällt, war es Oli.“',
  'Mo lacht. Die beiden reden über Clubs, über Tschechien, über den besten Döner der Stadt. Es läuft. Du stupst Oli an.',
  'Dann hält Mo stolz sein Handy hoch: „Darf ich euch was zeigen? Das ist Jule. Wir haben uns vor drei Wochen kennengelernt. Ich glaub, das wird was.“',
  'Kurze Stille. Oli schaut sehr interessiert in sein Glas. Du schaust Thalia an.',
  'Thalia grinst: „Jule hat Geschmack. Grüß sie von mir – und bring sie nächsten Samstag mit!“',
  'Später, am Rand der Tanzfläche, stupst sie dich an: „Ich hab genau gesehen, was du da geplant hast. Du bist unmöglich. Und die Beste.“',
  '„Mo ist süß. Aber vergeben ist vergeben. Komm, wir tanzen – nur wir zwei.“ 💃',
];

/** Wenn Mo später ab und zu samstags vorbeischaut */
export const MO_LINES: readonly (readonly string[])[] = [
  ['Lina! Jule lässt grüßen.', 'Sie sagt, euer Dorf sieht aus wie aus einem Videospiel. Ich hab gesagt: Ja. Genau deshalb komm ich gern.'],
  ['Oli hat mir zwanzig Minuten lang deine Rippchen beschrieben.', 'Mit Handbewegungen. Ich will die unbedingt mal probieren.'],
  ['Thalia hat mir einen Trainingsplan geschrieben. Drei Seiten.', 'Ich glaub, das war eine kleine Rache. Eine sehr nette Rache.'],
  ['Ich bin nur kurz da.', 'Oli und ich müssen nachher noch ein Level schaffen. Seit Jahren dasselbe. Wir geben nicht auf.'],
  ['Schön habt ihr’s hier.', 'Ich versteh langsam, warum Oli nicht mehr in die Stadt will.'],
  ['Jule kommt nächstes Mal mit.', 'Thalia hat versprochen, ihr den Tanz vom letzten Samstag beizubringen. Ich hab Angst. Positiv.'],
];
