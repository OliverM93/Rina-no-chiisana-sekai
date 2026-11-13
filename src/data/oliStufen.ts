/**
 * Lina & Oli in Stufen (Game Design F6): Die Beziehung entwickelt sich mit den Herzen. Statt immer mehr
 * Freundschaftspunkten gibt es neue **Inhalte**: „Zeit zu zweit“-Szenen (eine pro Herz), die Herzbank am Strand
 * und Briefe zum Jubiläum.
 *
 * Nur Szenen aus dem gemeinsamen Spiel-Alltag (Haus, Küche, Dorf) – keine erfundene Vorgeschichte.
 * `{dorf}` wird durch den Dorfnamen ersetzt.
 */

export interface StageScene {
  /** ab diesem Herz (1–5) */
  hearts: number;
  id: string;
  title: string;
  lines: readonly string[];
}

/** Einleitung, wenn eine Szene am Anfang des nächsten Gesprächs zu Hause von selbst beginnt (kein Menüpunkt) */
export const STAGE_LEAD = 'Oli klopft aufs Sofa neben sich. „Komm, setz dich kurz zu mir, Lini.“';

export const STAGE_SCENES: readonly StageScene[] = [
  {
    hearts: 1,
    id: 'ankommen',
    title: 'Zu Hause ankommen',
    lines: [
      'Oli setzt sich neben dich und streckt die Beine aus.',
      '„Weißt du, was ich an {dorf} mag, Lini? Abends wird es so still, dass man seinen eigenen Kaffee hört.“',
      'Du lachst. Winston schnarcht dazu im Takt.',
      '„Ich glaube, ich bleibe hier. Falls das okay ist.“',
      'Du nickst. Mehr braucht es nicht. 💕',
    ],
  },
  {
    hearts: 2,
    id: 'plaene',
    title: 'Pläne fürs Zimmer',
    lines: [
      'Oli sitzt mit einem Blatt Papier da und zeichnet Kästchen.',
      '„Ich hab mal aufgemalt, wo was hinkommt. Hier dein Sessel, da der Schreibtisch, und hier – ganz wichtig – die Kaffeemaschine.“',
      '„Und hier hab ich eine Ecke für Platten gelassen. Nur falls.“',
      'Nach zehn Minuten ist das Blatt komplett vollgekritzelt. Es ist der schönste Einrichtungsplan, den du je gesehen hast.',
    ],
  },
  {
    hearts: 3,
    id: 'kochen',
    title: 'Kochen zu zweit',
    lines: [
      'Du stehst am Herd, Oli lehnt am Tisch und schaut dir zu.',
      '„Du summst beim Kochen. Immer dasselbe Lied. Ich glaube, du merkst es gar nicht.“',
      'Du merkst es erst jetzt. Du summst trotzdem weiter.',
      'Er schneidet die Zwiebeln, du rührst die Soße. Es ist das beste Abendessen der Woche. 🍳',
    ],
  },
  {
    hearts: 4,
    id: 'fenster',
    title: 'Am Fenster',
    lines: [
      'Ihr steht abends am Fenster und seht zu, wie die Laternen angehen.',
      '„Komisch. Ich hab keinen Kalender mehr im Kopf. Nur noch: Frühling, Sommer, Herbst, Winter – und überall ein Stück von dir.“',
      '„Das klingt kitschig. Ich lass es trotzdem stehen.“',
      'Du lehnst dich an seine Schulter. Draußen leuchten die Fenster der anderen. 🏡',
    ],
  },
  {
    hearts: 5,
    id: 'danke',
    title: 'Danke, Lini',
    lines: [
      'Oli kommt mit zwei Tassen Kaffee und setzt sich dir gegenüber.',
      '„Ich wollte dir was sagen und hab die ganze Woche überlegt, wie. Dann dachte ich: einfach sagen.“',
      '„Danke, dass du mich mitgenommen hast. Hierher. In dein kleines Dorf. In deine Welt.“',
      'Er lächelt dich an, mit diesem Lächeln, das du so gut kennst.',
      '„Linas kleine Welt. So hab ich sie immer genannt. Jetzt ist es unsere.“ 💞',
    ],
  },
];

/** Die Herzbank (Wunsch erfüllt): Szene je Jahreszeit und Tageszeit */
export type BenchMood = 'tag' | 'abend';

export const BENCH_LINES: Readonly<Record<string, Readonly<Record<BenchMood, readonly string[]>>>> = {
  fruehling: {
    tag: ['Ihr sitzt auf eurer Bank. Der Wind riecht nach Frühling und Meer.', '„Siehst du das Herz in der Lehne? Ich hab die Muscheln dreimal umgelegt, bis es stimmte.“', 'Du lehnst dich an seine Schulter. Die Möwen schimpfen. Ihr auch, ein bisschen, aus Spaß.'],
    abend: ['Die Sonne sinkt, das Wasser wird rosa.', '„Das ist der beste Platz im ganzen Dorf. Ich hab es nachgemessen.“', 'Du glaubst ihm sofort. 🌅'],
  },
  sommer: {
    tag: ['Die Bank ist warm von der Sonne. Ihr streckt die Füße aus.', '„Wenn mir mal die Worte fehlen, setz ich mich einfach hierher. Dann fehlen sie mir nicht mehr.“', 'Ihr schaut aufs Meer, bis die Wellen euch müde machen.'],
    abend: ['Der Himmel wird orange, die Wellen glitzern.', '„Weißt du, was ich nie vergesse? Dass wir genau hier saßen, als die Laternen angingen.“', 'Ihr bleibt sitzen, bis es dunkel ist. 🌇'],
  },
  herbst: {
    tag: ['Der Wind pustet Blätter über den Strand. Ihr rückt näher zusammen.', '„Ich hab eine Thermoskanne mitgebracht. Kaffee. Natürlich.“', 'Ihr trinkt abwechselnd aus dem Deckel. Er behauptet, es sei der erste Schluck.'],
    abend: ['Es wird früh dunkel, die Wellen klingen tiefer.', '„Im Herbst sieht man das Meer am besten. Es zieht sich mehr Mühe.“', 'Du ziehst seine Jacke über deine Schultern. Sie riecht nach Kaffee. ☕'],
  },
  winter: {
    tag: ['Die Bank ist kalt, aber ihr habt Mützen und eine Decke.', '„Eisige Luft, Meeresrauschen, du. Mehr brauch ich nicht.“', 'Euer Atem malt Wölkchen in die Luft. Ihr malt sie mit.'],
    abend: ['Der Himmel ist klar, die ersten Sterne kommen raus.', '„Wenn man lang genug guckt, bewegen sie sich. Sagt Thalia. Ich glaub ihr nicht. Aber ich guck.“', 'Ihr guckt zusammen, bis die Finger kalt sind. ✨'],
  },
};

/** Jubiläums-Briefe: nach 100 Tagen und nach einem Jahr (gezählt ab Olis Einzug) */
export const OLI_ANNIVERSARIES: ReadonlyArray<{ days: number; id: string; subject: string; body: string; gift: { itemId: string; count: number } }> = [
  {
    days: 100,
    id: 'oli-100-tage',
    subject: 'Hundert Tage 💕',
    body: 'Lini,\n\nich hab nachgezählt: Heute sind es hundert Tage, seit ich bei dir im {dorf} wohne. Hundert Mal Kaffee, hundert Mal „Gute Nacht“.\n\nIch würde jeden einzelnen nochmal nehmen.\n\nDein Oli\n\nPS: Die Rosen sind vom Beet. Also von deinem. Ich hab nur gepflückt. Und das Beet gegossen. Einmal.',
    gift: { itemId: 'strauss-rosen', count: 1 },
  },
  {
    days: 365,
    id: 'oli-1-jahr',
    subject: 'Ein ganzes Jahr 💞',
    body: 'Lini,\n\nein Jahr. Ein Jahr {dorf}, ein Jahr Winston, ein Jahr du.\n\nIch hab mir überlegt, was man dazu sagt. Dann hab ich es wieder gelassen, weil du es ohnehin weißt.\n\nAlso nur: Danke. Und: Auf das nächste.\n\nDein Oli',
    gift: { itemId: 'strauss-schwarz', count: 1 },
  },
];
