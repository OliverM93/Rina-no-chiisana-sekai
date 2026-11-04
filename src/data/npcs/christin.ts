/**
 * Christin – Olafs Freundin. Sehr ordentlich, achtet auf Ordnung und
 * Sauberkeit, freundlich, aber mit klaren Vorstellungen davon, wo die
 * Dinge hingehören.
 */
import { LOOKS } from './looks';
import type { NpcDef } from './types';

const PLATZ = { x: 23, y: 16, w: 9, h: 7 };
const WIESE = { x: 4, y: 19, w: 12, h: 8 };

export const CHRISTIN: NpcDef = {
  id: 'christin',
  name: 'Christin',
  personality: 'sehr ordentlich, achtet auf Ordnung & Sauberkeit, freundlich, klare Meinung',
  appearance: LOOKS.christin,
  home: 'haus-olaf',
  movesIn: 'olafEingezogen',
  schedule: [
    { from: '00:00', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
    { from: '07:00', label: 'Fegt den Dorfplatz', activity: { kind: 'spazieren', area: PLATZ } },
    { from: '09:30', label: 'Putzt zu Hause', activity: { kind: 'zuhause' } },
    { from: '11:00', label: 'Spaziergang über die Wiese', activity: { kind: 'spazieren', area: WIESE } },
    { from: '13:00', label: 'Sitzt auf der Bank am Platz', activity: { kind: 'sitzen', bench: 'bank-platz' } },
    { from: '15:00', label: 'Kontrollgang über den Dorfplatz', activity: { kind: 'spazieren', area: PLATZ } },
    { from: '18:00', label: 'Zu Hause', activity: { kind: 'zuhause' } },
    { from: '22:00', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
  ],
  preferences: {
    loves: ['lavendel', 'vergissmeinnicht', 'rose', 'ikebana'],
    likes: ['ei', 'wachtelei', 'tulpe', 'sonnenblume', 'wildblumen', 'jakobsmuschel', 'herzmuschel', 'pfirsich', 'apfel'],
    dislikes: ['ast', 'stein', 'weinbergschnecke', 'waldameise', 'strandkrabbe', 'aal'],
  },
  dialogue: {
    greetings: [
      { text: ['Guten Morgen, Lina!', 'Ich hab schon den Dorfplatz gefegt. Da lagen drei Blätter. DREI!'], when: { phases: ['morgendaemmerung', 'morgen'] } },
      { text: ['Hallo Lina!', 'Hast du dir die Schuhe abgeputzt? … Ach, wir sind ja draußen. Trotzdem.'] },
      { text: ['Oh, Lina! Schön dich zu sehen.', 'Du hast da einen kleinen Fleck. Moment … So. Viel besser.'] },
      { text: ['Ein ruhiger Abend.', 'Ich hab Olafs Socken nach Farben sortiert. Er hat es noch nicht bemerkt.'], when: { phases: ['abend', 'abenddaemmerung'] } },
      { text: ['Alles Gute zum Geburtstag, Lina! 🎂', 'Ich hab dir einen Kuchen gebacken. Und die Küche danach natürlich sofort aufgeräumt.'], when: { tags: ['geburtstag-lina'] }, weight: 10 },
      { text: ['Dieser Regen!', 'Jetzt tragen alle Matsch auf den Dorfplatz. Ich seh schon, was ich morgen mache.'], when: { tags: ['wetter-regen'] }, weight: 3 },
    ],
    chat: [
      { text: ['Deine Hühner scharren das ganze Gras auf.', 'Aber sie machen das in so schönen ordentlichen Kreisen. Das muss ich zugeben.'], when: { tags: ['huehner'] }, weight: 3 },
      { text: ['Die Wachteln sind so niedlich!', 'Und so sauber. Die putzen sich ständig. Sehr sympathisch.'], when: { tags: ['wachteln'] }, weight: 3 },
      { text: ['Winston ist über meinen frisch gefegten Platz gelaufen.', 'Die Pfotenabdrücke waren aber sehr ordentlich in einer Reihe. Das rechne ich ihm hoch an.'] },
      { text: ['Ordnung ist das halbe Leben.', 'Die andere Hälfte ist … noch mehr Ordnung.'] },
      { text: ['Weißt du, was ich an deinem Dorf mag?', 'Die Wege sind schön gerade. Na ja – fast.'] },
      { text: ['Wenn du Äste herumliegen siehst: aufheben!', 'Das sieht sonst so unordentlich aus. Und man stolpert.'] },
      { text: ['Lavendel riecht so sauber.', 'Ich leg mir immer ein Säckchen in den Kleiderschrank.'] },
      { text: ['Olaf hat seine Quittungen nach Datum sortiert.', 'Ich hab sie nach Farbe umsortiert. Viel schöner. Er war … erschüttert.'] },
      { text: ['Hast du in deinem Haus schon alles an seinem Platz?', 'Ein Kissen hier, ein Tischchen da – Hauptsache gerade ausgerichtet!'] },
      { text: ['Deine Oma hat mich gefragt, ob ich ihr beim Putzen helfe.', 'Ich hab Ja gesagt. Sie hat gesagt, sie hat schon geputzt. Und dann hatte sie das letzte Wort.'] },
      { text: ['Ich bin froh, dass Olaf und ich hier sind.', 'Und du hast so ein schönes, ordentliches Beet.'], when: { minHearts: 2 } },
    ],
    gifts: {
      liebt: [['Oh, wie schön! 💜', 'Das bekommt einen ganz besonderen Platz. Ganz gerade ausgerichtet.']],
      mag: [['Danke, Lina! Wie aufmerksam.', 'Das passt gut in mein Regal.']],
      neutral: [['Danke.', 'Ich such dafür noch den richtigen Platz. Das kann dauern.']],
      'mag-nicht': [['Oh. Ähm. Danke.', 'Das … kommt erst mal in eine Kiste. Mit Deckel.']],
    },
    giftsByItem: {
      ast: ['Ein Ast?', 'Den hast du hoffentlich vom Weg aufgehoben. Dann danke fürs Aufräumen!'],
      lavendel: ['Lavendel! Mein Lieblingsduft.', 'Daraus mach ich gleich kleine Duftsäckchen. Für jeden Schrank im Haus.'],
    },
    giftRepeat: ['Noch ein Geschenk? Wie lieb!', 'Aber jetzt muss ich erst mal Platz schaffen.'],
    heartUp: [['Lina, du bist wirklich eine Freundin geworden.', 'Und eine sehr ordentliche noch dazu.']],
    atHome: [['Drinnen surrt ein Staubsauger.', '„Einen Moment, Lina! Ich bin gleich fertig! … Na ja, gleich-ish.“']],
    atHomeSleeping: [['Alles dunkel und still. Auf der Fußmatte steht: „Bitte Schuhe abputzen.“']],
    goodbye: ['Tschüss, Lina!', 'Bis bald – und Schuhe abputzen!', 'Mach\'s gut! Und räum schön auf.'],
  },
  letters: [
    { id: 'ordnung', subject: 'Kleiner Ordnungstipp', body: 'Liebe Lina,\n\nein Tipp von mir: Jeden Tag eine Sache aufräumen. Dann wird es nie unordentlich!\n\nLiebe Grüße\nChristin', gift: { itemId: 'samen-lavendel', count: 2 } },
  ],
  heartLetters: {
    1: { id: 'herz-1', subject: 'Alles an seinen Platz!', body: 'Liebe Lina,\n\nwer viele Sachen hat, braucht ein Regal. So einfach ist das.\n\nIch hab dir aufgeschrieben, wie man eins aus Ästen baut. Und dann sammelst du gleich die Äste vom Weg auf – zwei Fliegen mit einer Klappe!\n\nChristin', gift: { itemId: 'rezept-treibholzregal', count: 1 } },
    2: { id: 'herz-2', subject: 'Für dein Zimmer', body: 'Liebe Lina,\n\ndamit es bei dir noch ein bisschen schöner aussieht: eine Ikebana-Vase. Schlicht und ordentlich – so mag ich das.\n\nChristin', gift: { itemId: 'ikebana', count: 1 } },
  },
};

export const CHRISTIN_WELCOME: readonly string[] = [
  'Hallo Lina! Ich freu mich so, dass wir jetzt Nachbarn sind.',
  'Wenn du mal Hilfe beim Aufräumen brauchst – ich bin direkt nebenan.',
  '… Und wenn du keine brauchst, komme ich trotzdem mal gucken.',
];
