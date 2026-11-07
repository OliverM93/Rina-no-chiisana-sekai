/**
 * Oliver („Oli“) – Linas Freund. Zieht direkt zu Lina ins Haus.
 * Strahlendes Lächeln, schwarzer Troyer; liebt Kraftsport im Gym,
 * Hardcore-Punk-Konzerte, Informatik, Kochen & guten Kaffee.
 * Nennt Lina „Lini“.
 */
import { LOOKS, OLI_WARDROBE } from './looks';
import type { NpcDef } from './types';

const WIESE = { x: 4, y: 19, w: 12, h: 8 };
const PLATZ = { x: 23, y: 16, w: 9, h: 7 };
const STRAND = { x: 22, y: 30, w: 14, h: 3 };

export const OLI: NpcDef = {
  id: 'oli',
  name: 'Oli',
  personality: 'Linas Freund, strahlendes Lächeln, herzlich & verspielt; Kraftsport, Hardcore-Punk, Informatik, Kochen & Kaffee; nennt Lina „Lini“',
  appearance: LOOKS.oli,
  wardrobe: OLI_WARDROBE,
  home: 'haus-lina',
  movesIn: 'oliEingezogen',
  birthday: { day: 29, month: 7 },
  birthdayLines: {
    greeting: ['Lini! Heute ist mein Geburtstag! 🎂', 'Ich wollte eigentlich keine große Sache draus machen …', '… aber wenn du mir einen Kuss gibst, ist es der beste Geburtstag aller Zeiten. 💕'],
    thanks: ['Ein Geschenk für mich?! An meinem Geburtstag? 🥹', 'Lini, du bist das allerbeste Geschenk. Aber das hier nehm ich trotzdem. Danke!'],
  },
  schedule: [
    { from: '00:00', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
    { from: '07:00', label: 'macht Kaffee', activity: { kind: 'zuhause' } },
    { from: '08:30', label: 'Training auf der Wiese', activity: { kind: 'spazieren', area: WIESE } },
    { from: '10:30', label: 'programmiert', activity: { kind: 'zuhause' } },
    { from: '12:30', label: 'kocht Mittagessen', activity: { kind: 'zuhause' } },
    { from: '14:00', label: 'Bummel über den Dorfplatz', activity: { kind: 'spazieren', area: PLATZ } },
    { from: '16:00', label: 'hört Punk am Strand', activity: { kind: 'spazieren', area: STRAND } },
    { from: '18:00', label: 'kocht Abendessen', activity: { kind: 'zuhause' } },
    { from: '20:00', label: 'trainiert', activity: { kind: 'zuhause' } },
    { from: '21:00', label: 'programmiert', activity: { kind: 'zuhause' } },
    { from: '23:30', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
  ],
  preferences: {
    loves: ['ruehrei', 'fischbroetchen', 'ei', 'hering', 'dorsch', 'keks', 'glitzerstein'],
    likes: ['wachtelei', 'apfel', 'birne', 'pfirsich', 'barsch', 'scholle', 'bachforelle', 'makrele', 'sonnenblume', 'rose', 'hirschkaefer', 'stein'],
    dislikes: ['weinbergschnecke', 'ohrenqualle'],
  },
  dialogue: {
    greetings: [
      { text: ['Lini! Tanzen wir? 💃', 'Ich hab Thalia gefragt, ob sie Hardcore spielt. Sie hat Nein gesagt. Dann eben Disco.'], when: { tags: ['party'] }, weight: 8 },
      { text: ['Guten Morgen, Lini! ☕', 'Kaffee ist schon fertig. Frisch gemahlen, natürlich. Alles andere wäre ein Verbrechen.'], when: { phases: ['morgendaemmerung', 'morgen'] } },
      { text: ['Hey Lini! 😊', 'Na, wie geht\'s meiner Lieblingsperson?'] },
      { text: ['Lini! Da bist du ja.', 'Ich hab dich vermisst. Ja, ich weiß, es waren nur zwei Stunden. Trotzdem.'] },
      { text: ['Hey du! Hast du schon was gegessen?', 'Ich hab heute was Leckeres vor. Lass dich überraschen.'], when: { phases: ['mittag'] } },
      { text: ['Na, Lini? Langer Tag?', 'Komm, setz dich. Ich mach uns was Warmes.'], when: { phases: ['abend', 'abenddaemmerung'] } },
      { text: ['Du bist ja noch wach, Lini.', 'Ich auch. Mein Code kompiliert gerade … also eigentlich warte ich nur.'], when: { phases: ['nacht'] } },
      { text: ['Alles, alles Liebe zum Geburtstag, Lini! 🎂💕', 'Ich hab dir einen Kuchen gebacken. Drei Stockwerke. Okay, zwei. Einer ist umgefallen.', 'Aber der Rest ist mit ganz viel Liebe gemacht!'], when: { tags: ['geburtstag-lina'] }, weight: 10 },
      { text: ['Regen? Perfekt!', 'Dann bleiben wir drin, ich koch was und wir machen es uns gemütlich.'], when: { tags: ['wetter-regen'] }, weight: 3 },
      { text: ['Schnee, Lini! ❄️', 'Wer zuerst einen Schneemann baut, kriegt einen Kakao. Ich verlier auch absichtlich.'], when: { tags: ['wetter-schnee'] }, weight: 3 },
    ],
    chat: [
      { text: ['Lini, dein Doktor Nowak läuft heute wieder.', 'Ich hab schon die Taschentücher hingelegt. Und deinen Platz auf dem Sofa freigehalten. Ich bin ein guter Freund.'] },
      { text: ['Wenn Dr. Nowak „Ein Schritt. Dann noch einer.“ sagt, dann krieg ich auch Lust, was zu machen.', 'Aufräumen zum Beispiel. Oder Hanteln. Oder … nee, ich glaub, Hanteln.'] },
      { text: ['Lini, heute Abend Horrorfilm?', 'Ich such einen aus. Einen nicht ganz so gruseligen. … Okay, du suchst aus. Aber ich halte das Kissen.'], weight: 2 },
      { text: ['Ich hab die ganze Nacht an die Puppe aus der Serie gedacht.', 'Wie kannst du sowas gucken und danach seelenruhig einschlafen? Du bist unglaublich.'], when: { phases: ['morgen', 'morgendaemmerung'] } },
      { text: ['Lini, heute Abend True Crime?', 'Aber diesmal nicht wieder bis drei Uhr nachts. … Okay, bis zwei.'] },
      { text: ['Du kochst einfach am besten, Lini.', 'Ich koch ja auch gern – aber bei dir schmeckt’s irgendwie nach Zuhause.'] },
      { text: ['Ich hab gestern heimlich die Datingshow weitergeschaut.', 'Ohne dich! Ich weiß, das war Verrat. Bernd und Bärbel sind übrigens zusammen. Sorry.'] },
      { text: ['Lini! Tanzen wir? 💃', 'Ich hab Thalia gefragt, ob sie Hardcore spielt. Sie hat Nein gesagt. Dann eben Disco.'], when: { tags: ['party'] }, weight: 8 },
      { text: ['Heute war Beintag im Training.', 'Morgen komm ich die Treppe nicht mehr hoch. Hat sich aber gelohnt! 💪'] },
      { text: ['Weißt du, was das Beste nach dem Training ist?', 'Eier. Ganz viele Eier. Und danach: du.'] },
      { text: ['Gestern hab ich auf einem Hardcore-Konzert einen Song gehört, der 47 Sekunden lang war.', 'Das war der längste des Abends. 🤘'] },
      { text: ['Im Moshpit sind alle total nett, weißt du?', 'Wenn jemand hinfällt, helfen ihm sofort fünf Leute hoch. Wie hier im Dorf. Nur lauter.'] },
      { text: ['Ich hab das Dorf als Graph modelliert.', 'Kürzester Weg von überall: zu dir. Immer. Mathematisch bewiesen.'] },
      { text: ['Mein Programm hat einen Bug.', 'Ich such ihn jetzt seit drei Stunden. … Ah. Ein fehlendes Semikolon. Natürlich.'] },
      { text: ['Kaffee-Tipp vom Profi:', 'Nie kochendes Wasser! Kurz warten, dann aufgießen. Der Kaffee wird es dir danken.'] },
      { text: ['Heute Abend koch ich uns was.', 'Pasta? Curry? Oder mein berühmtes Rührei? … Okay, das ist nur in diesem Haus berühmt.'] },
      { text: ['Winston hat mir heute beim Training zugeschaut.', 'Er war nicht beeindruckt. Er hat sich hingelegt und geschnarcht.'] },
      { text: ['Deine Oma hat mich heute gemustert.', 'Von oben bis unten. Dann hat sie gesagt: „Na gut.“ Ich glaube, das war ein Kompliment.'] },
      { text: ['Dein Papa hat mir einen Haushaltsplan für uns erstellt.', 'Mit Diagrammen. Er hat sich so gefreut, ich konnte nicht Nein sagen.'], when: { tags: ['olaf-da'] } },
      { text: ['Du hast Hühner! Das heißt: frische Eier für mein Training!', 'Ich hab sie schon alle mit Namen begrüßt. Sie haben mich ignoriert.'], when: { tags: ['huehner'] }, weight: 2 },
      { text: ['Weißt du, was ich an diesem Dorf mag?', 'Dass du hier bist. Der Rest ist Bonus.'], when: { minHearts: 3 } },
      { text: ['Manchmal schau ich dich einfach an und denk mir:', 'Wie hab ich so ein Glück gehabt?', '… Okay, jetzt guck nicht so. Ich werd rot.'], when: { minHearts: 4 } },
    ],
    gifts: {
      liebt: [['Lini! Das ist ja genau mein Ding! 😍', 'Du kennst mich einfach am besten.']],
      mag: [['Oh, danke dir! 😊', 'Das ist richtig lieb von dir.']],
      neutral: [['Für mich? Danke, Lini!', 'Ich find bestimmt was, wofür ich das gebrauchen kann.']],
      'mag-nicht': [['Ähm … danke? 😅', 'Ich stell das mal ganz vorsichtig … da hin. Weit weg.']],
    },
    giftsByItem: {
      ei: ['Eier! Proteine! 💪', 'Morgen gibt\'s Rührei für uns beide. Mit ganz viel Liebe und ein bisschen Pfeffer.'],
      keks: ['Omas Kekse? Die sind legendär.', 'Ich teil mit dir. Also … den halben. Okay, ein Drittel.'],
    },
    giftRepeat: ['Noch was? Lini, du verwöhnst mich! 💕'],
    heartUp: [['Lini …', 'Ich bin so froh, dass ich hier bei dir bin.', 'Mit dir ist jeder Tag ein guter Tag.']],
    atHome: [['Aus dem Haus duftet es nach Kaffee.', '„Bin drinnen, Lini! Komm rein!“']],
    atHomeSleeping: [['Leises Schnarchen aus dem Haus.', 'Oli schläft schon.']],
    goodbye: ['Bis später, Lini! 💕', 'Hab dich lieb!', 'Pass auf dich auf, ja?', 'Ich freu mich schon, wenn du wiederkommst!'],
  },
  dailyTreat: { itemId: 'keks', chance: 0.25, lines: ['Ach, warte – ich hab dir was gebacken!', 'Selbstgemacht. Nach Omas Rezept. Psst, das darf sie nicht wissen.'] },
  letters: [
    { id: 'zettel', subject: 'Zettel am Kühlschrank', body: 'Lini,\n\nbin beim Training. Kaffee steht in der Kanne, noch warm.\n\nHab einen schönen Tag! 💕\n\nOli', gift: { itemId: 'keks', count: 1 } },
    { id: 'konzert', subject: 'Konzert-Bericht', body: 'Lini,\n\ngestern war es soooo laut. Mein linkes Ohr piept noch.\n\nAber das Beste am Abend war, nach Hause zu kommen. Zu dir. 🤘💕\n\nOli' },
    { id: 'code', subject: 'Programmiert für dich', body: 'Lini,\n\nwhile (true) {\n  hab_dich_lieb();\n}\n\nDas Programm läuft für immer. Absichtlich.\n\nOli' },
  ],
  heartLetters: {
    1: { id: 'herz-1', subject: 'Für unsere Morgen', body: 'Lini,\n\nich hab dir eine richtig gute Kaffeemaschine besorgt. Stell sie auf, und ich mach uns jeden Morgen den besten Kaffee im ganzen Dorf.\n\nDein Oli', gift: { itemId: 'kaffeemaschine', count: 1 } },
    2: { id: 'herz-2', subject: 'Musik für uns', body: 'Lini,\n\nein Plattenspieler! Keine Sorge, ich spiel nicht nur Hardcore. Ich hab auch was Ruhiges dabei. Für gemütliche Abende.\n\nDein Oli', gift: { itemId: 'plattenspieler', count: 1 } },
    3: { id: 'herz-3', subject: 'Ein Mixtape', body: 'Lini,\n\nich hab dir ein Mixtape gemacht. Lauter Lieder, die mich an dich erinnern.\n\nDie Hälfte ist Punk. Die andere Hälfte auch. Aber mit Herz.\n\nDein Oli', gift: { itemId: 'mixtape', count: 1 } },
    4: { id: 'herz-4', subject: 'Damit du nie im Dunkeln bist', body: 'Lini,\n\neine Sternenlampe für unser Zimmer. Dann haben wir jeden Abend unseren eigenen Sternenhimmel – auch wenn es draußen regnet.\n\nDein Oli', gift: { itemId: 'sternenlampe', count: 1 } },
    5: { id: 'herz-5', subject: 'Wir zwei', body: 'Lini,\n\nich hab ein Foto von uns beiden einrahmen lassen.\n\nWenn ich es anschaue, muss ich jedes Mal lächeln. So wie jetzt gerade.\n\nIch hab dich lieb. Für immer.\n\nDein Oli', gift: { itemId: 'foto-lina-oli', count: 1 } },
  },
};

/** Brief vor dem Einzug */
export const OLI_ANNOUNCEMENT = {
  id: 'einzug',
  subject: 'Ich komme zu dir!',
  body: 'Lini,\n\nich hab meine Sachen gepackt: Laptop, Hanteln, Kaffeebohnen – und ganz viel Vorfreude.\n\nIch sitz schon im Zug. Gleich bin ich bei dir. Endlich wohnen wir zusammen!\n\nDein Oli 💕',
};

/** Einzugsszene */
export const OLI_WELCOME: readonly string[] = [
  'Lini! 😊',
  'Da bin ich! Mit Sack und Pack.',
  'Okay, eigentlich mit einem Koffer, zwei Hanteln und meinem Computer. Das Wichtigste eben.',
  'Ich hab dich so vermisst.',
  'Und jetzt wohnen wir zusammen. In deinem kleinen Häuschen. Ich freu mich so!',
  'Meinen Schreibtisch und die Hantelbank hab ich dir in die Tasche gepackt – stell sie hin, wo du magst. Du hast das bessere Auge dafür.',
];

/** Picknick (Oli, tagsüber) */
export const PICNIC_LINES: readonly (readonly string[])[] = [
  ['Ich hab Sandwiches gemacht. Und Kaffee in der Thermoskanne, natürlich.', 'Schau mal, wie schön die Wiese ist.', '… Aber du bist schöner. Sorry, das musste raus. 😊'],
  ['Picknick mit dir ist das Beste.', 'Kein Laptop, kein Training, keine Bugs. Nur wir zwei und die Sonne.', 'Und Winston, der versucht, mein Sandwich zu klauen.'],
  ['Weißt du noch, unser erstes Date?', 'Ich war so aufgeregt, dass ich meinen Kaffee umgekippt hab.', 'Und du hast gelacht. Da wusste ich: Die ist es.'],
];

/** Sterne gucken (Oli, abends) */
export const STARS_LINES: readonly (readonly string[])[] = [
  ['Schau mal, Lini – eine Sternschnuppe! 🌠', 'Schnell, wünsch dir was!', '… Ich hab mir nichts gewünscht. Ich hab ja schon alles, was ich will.'],
  ['So viele Sterne …', 'Wusstest du, dass manche davon schon gar nicht mehr da sind? Ihr Licht ist nur noch unterwegs.', 'Mein Licht ist jedenfalls genau hier. Bei dir.'],
  ['Da! Noch eine! 🌠', 'Ich glaube, das Universum mag dich auch.', 'Kann ich gut verstehen.'],
];

/** Nach einem Küsschen (Lina gibt Oli eins) */
export const KISS_LINES: readonly (readonly string[])[] = [
  ['*Küsschen* 😘', 'Mmh. Noch eins? … Nur eins. Okay, zwei.'],
  ['*wird ein bisschen rot*', 'Lini … du kannst doch nicht einfach so süß sein. Das ist unfair.'],
  ['*Nasenstupser* Boop. 👃', 'Ich hab dich lieb, Lini.'],
  ['Mmmh, du schmeckst nach Kaffee.', 'Mein Lieblingsgeschmack. Direkt nach dir.'],
  ['*Küsschen auf die Stirn*', 'So. Jetzt bist du offiziell geküsst. Mit Stempel.'],
  ['*grinst ganz breit*', 'Ich glaub, ich bin der glücklichste Mensch im ganzen Dorf. Ach was – auf der ganzen Welt.'],
  ['Noch eins für unterwegs? 😘', '*Küsschen* … und eins für Winston. Der guckt schon so eifersüchtig.'],
];

/** Wenn Lina nach Hause kommt und Oli wach ist */
export const WELCOME_KISS_LINES: readonly string[] = [
  'Oli kommt dir entgegen: „Da bist du ja!“ – *Küsschen* 😘',
  'Oli strahlt: „Lini! Ich hab dich vermisst.“ – *Küsschen* 💕',
  '„Willkommen zu Hause, Süße.“ – *Küsschen* 😘',
  'Oli: „Na, du Hübsche?“ – *Küsschen auf die Wange* 💋',
];

/** Spontan zwischendurch, wenn beide zu Hause sind */
export const SPONTANEOUS_KISS_LINES: readonly string[] = [
  'Oli gibt dir einfach so ein Küsschen. 😘',
  'Oli: „Ich musste gerade an dich denken.“ – *Küsschen* 💕',
  'Oli schleicht sich an: *Küsschen auf die Wange* – „Hab dich!“',
  'Oli: „Kurze Küsschen-Pause.“ 😘',
];
