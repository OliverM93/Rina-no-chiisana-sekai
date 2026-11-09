/**
 * Treffen der Bewohner untereinander: zu festen Wochentagen & Uhrzeiten kommen
 * sie zusammen. Lina kann sich dazugesellen (einmal pro Treffen und Tag).
 * Reihenfolge der Plätze = Reihenfolge der Mitglieder.
 */

export interface MeetupSpot {
  x: number;
  y: number;
  facing: 'up' | 'down' | 'left' | 'right';
  /** sitzt auf dieser Bank (statt zu stehen) */
  bench?: string;
}

export interface MeetupDef {
  id: string;
  name: string;
  /** 0 = Sonntag … 6 = Samstag */
  weekdays: readonly number[];
  /** von–bis (Stunden) */
  hours: readonly [number, number];
  members: readonly string[];
  spots: Readonly<Record<string, MeetupSpot>>;
  /** Etwas in der Hand (z. B. Angel) */
  hold?: 'angel';
  /** Symbole, die über den Köpfen aufpoppen */
  emotes: readonly string[];
  /** Gespräche zum Mithören – eins pro Tag (reproduzierbar) */
  talks: readonly (readonly string[])[];
}

export const MEETUPS: readonly MeetupDef[] = [
  {
    id: 'kaffeeklatsch',
    name: 'Kaffeeklatsch an Omas Bank',
    weekdays: [1, 3, 5],
    hours: [15, 17],
    members: ['gisela', 'christin', 'olaf'],
    spots: {
      gisela: { x: 45, y: 18, facing: 'down', bench: 'bank-gisela' },
      christin: { x: 44, y: 19, facing: 'right' },
      olaf: { x: 47, y: 19, facing: 'left' },
    },
    emotes: ['☕', '🍪', '💬', '😂'],
    talks: [
      ['Oma: „Der Kuchen ist zu trocken.“', 'Christin: „Gisela, den hast du gebacken.“', 'Oma: „Eben. Ich darf das sagen.“'],
      ['Olaf: „Ich hab ausgerechnet, dass wir dieses Jahr 214 Kekse gegessen haben.“', 'Oma: „Zu wenig.“', 'Christin: „Viel zu viel!“ – Olaf: „Ich notier beides.“'],
      ['Christin: „Gisela, deine Bank ist ganz staubig.“', 'Oma: „Das ist Patina. Das muss so.“', 'Christin putzt trotzdem. Oma lässt sie. Ein bisschen.'],
      ['Oma: „Mein Ludwig hätte jetzt Fußball geschaut.“', 'Olaf: „Und laut mitgeschimpft.“', 'Oma lächelt: „Am lautesten von allen.“'],
      ['Oma: „Lina, Kindchen, setz dich! Kaffee?“', 'Christin: „Mit Untersetzer, bitte.“', 'Olaf: „Und ein Keks. Der ist steuerlich absetzbar.“ – Oma: „Unsinn.“'],
    ],
  },
  {
    id: 'angeln',
    name: 'Angeln am Fluss',
    weekdays: [2, 4, 6],
    hours: [16, 18],
    members: ['olaf', 'christin'],
    spots: {
      olaf: { x: 35, y: 21, facing: 'right' },
      christin: { x: 35, y: 23, facing: 'right' },
    },
    hold: 'angel',
    emotes: ['🎣', '🐟', '💬', '😴'],
    talks: [
      ['Olaf: „Pssst. Die Fische hören uns.“', 'Christin: „Fische haben keine Ohren, Olaf.“', 'Olaf: „Eben drum. Dann brauchen wir nicht zu flüstern.“ … Er flüstert weiter.'],
      ['Christin hat ihre Angelsachen nach Farben sortiert.', 'Olaf hat bisher einen Stiefel gefangen. Er hat ihn vermessen: Größe 43.'],
      ['Olaf: „Ich zähle die Fische, Christin räumt auf. Arbeitsteilung!“', 'Christin: „Bisher gibt es nichts zu zählen.“ – Olaf: „Null ist auch eine Zahl.“'],
      ['Christin: „Oh! Da zuckt was!“', 'Olaf: „Ruhig, ganz ruhig …“ … Es war ein Blatt. Beide sind trotzdem sehr zufrieden.'],
    ],
  },
  {
    id: 'training',
    name: 'Training auf der Wiese',
    weekdays: [3, 6],
    hours: [8, 10],
    members: ['oli', 'lars'],
    spots: {
      oli: { x: 8, y: 23, facing: 'right' },
      lars: { x: 10, y: 23, facing: 'left' },
    },
    emotes: ['💪', '🏃', '💦', '😤'],
    talks: [
      ['Oli: „Noch zehn Liegestütze!“', 'Lars: „Als Arzt sag ich: Fünf reichen.“', 'Oli: „Und als Bruder?“ – Lars: „… Zehn. Na gut.“'],
      ['Lars: „Weißt du, warum Skelette nie Sport machen?“', 'Oli: „Warum?“', 'Lars: „Sie haben keinen Body dafür.“ – Oli muss so lachen, dass er sich setzen muss.'],
      ['Oli macht Kniebeugen. Lars macht Kniebeugen. Winston macht … ein Nickerchen.', 'Oli: „Lini! Machst du mit? Wir sind bei Satz drei von … sehr vielen.“'],
    ],
  },
  {
    id: 'strand',
    name: 'Steine & Skizzen am Strand',
    weekdays: [2, 5],
    hours: [13, 15],
    members: ['thalia', 'jens'],
    spots: {
      thalia: { x: 32, y: 31, facing: 'right' },
      jens: { x: 33, y: 30, facing: 'left' },
    },
    emotes: ['🪨', '🎨', '💬', '✨'],
    talks: [
      ['Thalia: „Jens, halt still! Du stehst auf einem Ammoniten!“', 'Jens: „Ma chérie, ich stehe auf meinen neuen Schuhen. Das ist wichtiger.“'],
      ['Jens malt Thalia, wie sie Steine sammelt. Thalia sammelt Steine, die aussehen wie Jens.', 'Beide finden ihre Arbeit sehr wichtig.'],
      ['Thalia: „Dieser Stein ist 300 Millionen Jahre alt!“', 'Jens: „Und trotzdem sieht er besser aus als Olaf morgens.“ – Thalia prustet los.'],
    ],
  },
  {
    id: 'sonnenuntergang',
    name: 'Sonnenuntergang am Strand',
    weekdays: [1, 4],
    hours: [18, 20],
    members: ['thalia', 'lars'],
    spots: {
      thalia: { x: 28, y: 31, facing: 'down' },
      lars: { x: 29, y: 31, facing: 'down' },
    },
    emotes: ['🌅', '🪨', '💬', '✨'],
    talks: [
      ['Thalia: „Der Sonnenuntergang ist heute 0,3 Prozent schöner als gestern. Ich hab nachgemessen.“', 'Lars: „Als Arzt sage ich: Genieß ihn einfach.“ – Thalia: „Ich genieße ihn ja. Mit Messwerten.“'],
      ['Lars: „Feierabend. Sieben Patienten, davon fünf mit Schnupfen.“', 'Thalia: „Und die zwei anderen?“ – Lars: „Wollten nur reden. Das ist auch Medizin.“'],
      ['Thalia hat einen Stein gefunden, der aussieht wie ein kleines Herz.', 'Lars: „Das ist Quarz mit Einschlüssen.“ – Thalia: „Das ist ein Herz.“ – Lars: „… Das ist ein Herz.“'],
      ['Die beiden sitzen einfach da und gucken aufs Meer.', 'Lars: „Weißt du, warum ich das so gern mag?“ – Thalia: „Weil es nichts kostet?“ – Lars: „Weil es mich nichts fragt.“'],
    ],
  },
];

export const MEETUP_BY_ID: Readonly<Record<string, MeetupDef>> = Object.fromEntries(MEETUPS.map((m) => [m.id, m]));
