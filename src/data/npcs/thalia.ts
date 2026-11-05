/**
 * Thalia – Linas beste Freundin. Geografin mit Leib und Seele: zeichnet Karten,
 * sammelt Gesteine & Fossilien, und samstagabends schmeißt sie eine Party auf dem
 * Dorfplatz. Herzlich, abenteuerlustig, lacht gern laut.
 */
import { LOOKS } from './looks';
import type { NpcDef } from './types';

const WIESE = { x: 4, y: 20, w: 14, h: 8 };
const STRAND = { x: 30, y: 30, w: 16, h: 3 };
const OSTEN = { x: 40, y: 24, w: 14, h: 6 };

export const THALIA: NpcDef = {
  id: 'thalia',
  name: 'Thalia',
  personality: 'beste Freundin, Geografin, Karten, Gesteine & Fossilien, Partys, herzlich & abenteuerlustig',
  appearance: LOOKS.thalia,
  home: 'haus-thalia',
  movesIn: 'thaliaEingezogen',
  schedule: [
    { from: '00:00', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
    { from: '08:30', label: 'zeichnet Karten', activity: { kind: 'zuhause' } },
    { from: '10:00', label: 'sucht Steine am Strand', activity: { kind: 'spazieren', area: STRAND } },
    { from: '12:30', label: 'vermisst die Wiese', activity: { kind: 'spazieren', area: WIESE } },
    { from: '15:00', label: 'erkundet den Osten', activity: { kind: 'spazieren', area: OSTEN } },
    { from: '18:00', label: 'sortiert ihre Sammlung', activity: { kind: 'zuhause' } },
    { from: '23:30', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
  ],
  preferences: {
    loves: ['glitzerstein', 'ammonit', 'trilobit', 'bernstein', 'amethyst', 'crepes', 'kraeutermischung'],
    likes: ['stein', 'seestern', 'schneckenhaus', 'haizahn', 'rosenquarz', 'bergkristall', 'achat', 'versteinertes-holz', 'pfirsich', 'apfelkuchen', 'sonnenblume', 'prachtlibelle', 'pfefferminztee'],
    dislikes: ['ohrenqualle', 'weinbergschnecke'],
  },
  dialogue: {
    greetings: [
      { text: ['Na endlich bist du da! 🎶', 'Komm, Lina, die Tanzfläche wartet!'], when: { tags: ['party'] }, weight: 8 },
      { text: ['Lina! 🤗', 'Guten Morgen, Süße! Ich hab heute schon einen Stein gefunden, der aussieht wie Winston. Ich schwör!'], when: { phases: ['morgendaemmerung', 'morgen'] } },
      { text: ['Heyyy, Lina!', 'Na, Lust auf ein kleines Abenteuer? Ich hab da eine Stelle gesehen, da MUSS was im Boden sein.'] },
      { text: ['Da ist ja meine Lieblingsperson!', 'Komm her, Umarmung. Sofort. Das ist ein Befehl.'] },
      { text: ['Lina! Rate mal, wie alt der Boden unter deinen Füßen ist.', '… Richtig! Uralt. Mindestens. Geologie ist so aufregend!'] },
      { text: ['Na, du?', 'Ich hab den Sonnenuntergang vermessen. Wunderschön, mit einer Abweichung von null.'], when: { phases: ['abend', 'abenddaemmerung'] } },
      { text: ['Happy Birthday, meine Liebste! 🎂🎉', 'Heute Abend wird gefeiert – Musik, Tanzen, Konfetti. Keine Widerrede!'], when: { tags: ['geburtstag-lina'] }, weight: 10 },
      { text: ['Regen! Perfektes Wetter für Erosion.', '… Okay, und für Kuscheldecke und Tee. Aber auch für Erosion!'], when: { tags: ['wetter-regen'] }, weight: 3 },
      { text: ['Heute ist Party-Abend! 💃', 'Ab sieben auf dem Dorfplatz. Komm unbedingt – ich hab eine Playlist gemacht. Drei Stunden. Nur Bangers.'], when: { weekdays: [6] }, weight: 4 },
    ],
    chat: [
      { text: ['Horrorfilmabend bei dir? Ich bring Chips mit!', 'Und diesmal schreie ich nicht. … Okay, vielleicht ein bisschen. Aber nur bei den guten Stellen.'] },
      { text: ['Hast du die neue True-Crime-Folge gesehen?!', 'Ich hätte sofort gewusst, dass es der Hund war. Ich hab da so ein Gespür. Geografisch.'] },
      { text: ['Na endlich bist du da! 🎶', 'Komm, Lina, die Tanzfläche wartet!'], when: { tags: ['party'] }, weight: 8 },
      { text: ['Wusstest du, dass Ammoniten so ähnlich sind wie Tintenfische?', 'Nur mit Schneckenhaus. Und sie sind seit Millionen Jahren ausgestorben. Aber trotzdem süß!'] },
      { text: ['Ich hab eine Karte von {dorf} gezeichnet.', 'Mit allen Bäumen, allen Felsen und einem kleinen Herz da, wo du wohnst.'] },
      { text: ['Weißt du, was ich am Reisen liebe?', 'Jede Landschaft erzählt eine Geschichte. Man muss nur genau hinschauen. Und manchmal ein bisschen graben.'] },
      { text: ['Wenn du irgendwo Risse im Boden siehst – grab mal mit der Schaufel!', 'Da steckt oft was drin. Fossilien, Kristalle … oder ein sehr alter Kronkorken.'] },
      { text: ['Der Strand hier ist geologisch super spannend.', 'Und man kann barfuß laufen. Doppelt gut.'] },
      { text: ['Jens hat mir aus Kyoto einen Stein mitgebracht.', 'Es ist ein ganz normaler Kiesel. Aber er hat gesagt, er hat „Zen-Energie“. Ich hab ihn trotzdem lieb.'], when: { tags: ['jens-da'] } },
      { text: ['Lars hat gesagt, mein Rücken ist krumm vom vielen Graben.', 'Ich hab gesagt: Das ist kein krummer Rücken, das ist Hingabe.'], when: { tags: ['lars-da'] } },
      { text: ['Oli und ich haben gestern über Algorithmen diskutiert.', 'Ich hab ihm erklärt, wie man Höhenlinien berechnet. Er hat mir erklärt, wie man Kaffee macht. Fairer Tausch.'], when: { tags: ['oli-da'] } },
      { text: ['Weißt du noch, als wir uns kennengelernt haben?', 'Wir haben sofort zusammen gelacht. Über was, weiß ich gar nicht mehr. Aber es war das beste Lachen.'], when: { minHearts: 2 } },
      { text: ['Du bist die beste Freundin, die man sich wünschen kann.', 'Wenn du ein Stein wärst, wärst du ein Diamant. Und ich weiß, wovon ich rede!'], when: { minHearts: 3 } },
    ],
    gifts: {
      liebt: [['NEIN! Für mich?! 😍', 'Das kommt sofort in meine Vitrine. Ganz vorne. Mit Etikett: „Von Lina, der Besten“.']],
      mag: [['Oh, wie schön! Danke, Süße!', 'Du kennst mich einfach.']],
      neutral: [['Danke dir!', 'Ich find bestimmt einen Platz dafür. Neben meinen Steinen ist immer Platz.']],
      'mag-nicht': [['Ähm … danke? 😅', 'Das ist … geologisch gesehen nicht so spannend. Aber lieb gemeint!']],
    },
    giftsByItem: {
      stein: ['Ein Kieselstein!', 'Weißt du, wie viele Jahre der im Fluss gerollt ist, bis er so rund war? Tausende! Ich liebe ihn.'],
      ammonit: ['Ein Ammonit!!! 🐚', 'Lina, der ist Millionen Jahre alt! Ich glaub, ich muss mich kurz setzen.'],
    },
    giftRepeat: ['Noch ein Geschenk? Lina! Du bist zu lieb.', 'Dafür gibt\'s auf der nächsten Party eine Extra-Runde Tanzen mit mir.'],
    heartUp: [['Lina …', 'Egal, wohin ich reise – mein Lieblingsort ist da, wo du bist.']],
    atHome: [['Aus dem Haus raschelt Papier.', '„Moment! Ich zeichne gerade einen Fluss! Der darf nicht verwackeln!“']],
    atHomeSleeping: [['Alles still.', 'Auf der Fußmatte liegt ein Stein mit Zettel: „Bitte nicht wegräumen. Der gehört so.“']],
    goodbye: ['Bis später, Süße! 💚', 'Hab dich lieb!', 'Tschüssi! Und immer schön auf den Boden schauen – da liegen Schätze!'],
  },
  letters: [
    { id: 'karte', subject: 'Eine Schatzkarte!', body: 'Lina!\n\nich hab eine Schatzkarte für dich gezeichnet. Das X ist … überall, wo du gräbst.\n\nOkay, das ist keine gute Schatzkarte. Aber die Steine sind echt!\n\nDeine Thalia 💚', gift: { itemId: 'stein', count: 3 } },
    { id: 'party', subject: 'Party-Erinnerung!', body: 'Süße,\n\nSamstag ist wieder Party auf dem Dorfplatz! Ab 19 Uhr. Bring gute Laune mit. Und Winston. Winston tanzt am besten.\n\nThalia 💃' },
  ],
  heartLetters: {
    2: { id: 'herz-2', subject: 'Für deine Sammlung', body: 'Lina,\n\neine kleine Vitrine für deine Funde! Damit deine Fossilien auch so schön ausgestellt sind wie meine.\n\nNa gut, fast so schön.\n\nDeine Thalia', gift: { itemId: 'vitrine', count: 1 } },
    4: { id: 'herz-4', subject: 'Unsere Welt', body: 'Lina,\n\nich hab dir einen Globus geschenkt. Auf dem hab ich alle Orte markiert, an die ich mit dir noch reisen will.\n\nEs sind ziemlich viele Markierungen. Fast alle.\n\nDeine Thalia 🌍', gift: { itemId: 'globus', count: 1 } },
  },
};

export const THALIA_ANNOUNCEMENT = {
  id: 'einzug',
  subject: 'Ich zieh zu dir ins Dorf! 🌍',
  body: 'Lina!!!\n\nich hab ein Häuschen in {dorf} gefunden! Ganz in der Nähe vom Strand – perfekt zum Steinesammeln.\n\nIch bin schon auf dem Weg! Mit meinen Karten, meinen Steinen und ganz viel Party-Laune.\n\nDeine Thalia 💚',
};

export const THALIA_WELCOME: readonly string[] = [
  'LINAAA! 🤗',
  'Ich wohn jetzt hier! Das gelbe Häuschen hinter der Brücke.',
  'Und schau mal – ich hab dir was mitgebracht.',
  'Eine Schaufel! Wenn du im Boden kleine Risse siehst, grab dort. Da stecken Fossilien und Kristalle drin!',
  'Und eine Karte von {dorf}, frisch gezeichnet. Mit der Taste M kannst du sie dir jederzeit anschauen.',
  'Ach ja: Samstags ab 19 Uhr ist Party auf dem Dorfplatz. Pflichttermin! … Na gut, kein Pflichttermin. Aber komm!',
];

export const PARTY_LINES: readonly (readonly string[])[] = [
  ['Party-Zeit! 💃🎶', 'Komm, Lina, tanz mit mir! Keine Sorge, ich tanz noch schlechter als du.'],
  ['Schau mal, alle sind da!', 'Oma tanzt mit Jens. Lars macht den Robot. Und Winston … Winston hat den Takt im Blut!'],
  ['Das ist der beste Abend!', 'Weißt du was? Jeder Abend mit dir ist der beste Abend.'],
];
