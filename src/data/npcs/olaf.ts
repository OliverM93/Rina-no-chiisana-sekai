/**
 * Olaf – Linas Papa. Arbeitet beim Finanzamt und führt im Dorf die
 * Dorfkasse. Ruhig, hilfsbereit, ein bisschen pedantisch mit Zahlen,
 * erzählt gern trockene Papa-Witze über Steuern und Quittungen.
 */
import { LOOKS } from './looks';
import type { NpcDef } from './types';

const PLATZ = { x: 23, y: 16, w: 9, h: 7 };
const STRAND = { x: 30, y: 30, w: 14, h: 3 };

export const OLAF: NpcDef = {
  id: 'olaf',
  name: 'Olaf',
  personality: 'ruhiger, hilfsbereiter Papa, Finanzamt, liebt Ordnung in den Zahlen, trockener Humor',
  appearance: LOOKS.olaf,
  home: 'haus-olaf',
  movesIn: 'olafEingezogen',
  schedule: [
    { from: '00:00', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
    { from: '07:30', label: 'Zeitung vor dem Haus', activity: { kind: 'stehen', x: 18, y: 18, facing: 'down' } },
    { from: '09:00', label: 'Dorfkasse geöffnet', activity: { kind: 'stehen', x: 20, y: 18, facing: 'down' } },
    { from: '12:30', label: 'Mittagspause auf dem Dorfplatz', activity: { kind: 'spazieren', area: PLATZ } },
    { from: '13:30', label: 'Dorfkasse geöffnet', activity: { kind: 'stehen', x: 20, y: 18, facing: 'down' } },
    { from: '17:30', label: 'Abendspaziergang am Strand', activity: { kind: 'spazieren', area: STRAND } },
    { from: '19:30', label: 'Feierabend zu Hause', activity: { kind: 'zuhause' } },
    { from: '22:30', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
  ],
  preferences: {
    loves: ['hering', 'dorsch', 'glitzerstein', 'teeservice'],
    likes: ['ei', 'wachtelei', 'apfel', 'birne', 'scholle', 'barsch', 'stein', 'tulpe', 'keks'],
    dislikes: ['waldameise', 'ohrenqualle', 'weinbergschnecke'],
  },
  dialogue: {
    greetings: [
      { text: ['Guten Morgen, mein Schatz!', 'Ich hab schon die Zeitung gelesen. Die Zinsen sind stabil. Herrlich.'], when: { phases: ['morgendaemmerung', 'morgen'] } },
      { text: ['Lina! Schön, dass du vorbeikommst.', 'Brauchst du was? Ein Ohr, einen Rat, eine Quittung?'] },
      { text: ['Na, mein Mädchen?', 'Alles im grünen Bereich? Bei mir schon. Ich hab heute die Kasse dreimal gezählt. Stimmt alles.'] },
      { text: ['Hallo Lina!', 'Christin hat heute schon zweimal gewischt. Ich trau mich gar nicht mehr rein.'], when: { phases: ['mittag', 'nachmittag'] } },
      { text: ['Abends wird es ruhig im Dorf.', 'Genau richtig, um über die Wochenbilanz nachzudenken. … Oder einfach den Sonnenuntergang zu genießen.'], when: { phases: ['abend', 'abenddaemmerung'] } },
      { text: ['Alles Gute zum Geburtstag, mein Schatz! 🎂', 'Ich hab dir ein kleines Geschenk mitgebracht. Es ist … kein Steuerratgeber. Versprochen.'], when: { tags: ['geburtstag-lina'] }, weight: 10 },
      { text: ['Bei dem Regen arbeiten selbst die Enten im Homeoffice.', '… War ein Witz. Ein guter, finde ich.'], when: { tags: ['wetter-regen'] }, weight: 3 },
    ],
    chat: [
      { text: ['Eigene Hühner – sehr vernünftig!', 'Ein Ei am Tag spart im Jahr … warte … ziemlich viele Sternchen. Ich rechne das nachher aus.'], when: { tags: ['huehner'] }, weight: 3 },
      { text: ['Winston ist der Einzige im Dorf, der nie nach Belegen fragt.', 'Ein sehr angenehmer Zeitgenosse.'] },
      { text: ['Hast du schon was an Opas Werkbank gebaut?', 'Selbermachen spart Geld. Und Geld sparen macht glücklich. Mich jedenfalls.'] },
      { text: ['Weißt du, was ein Steuerberater zum Frühstück isst?', 'Belege!', '… Christin lacht nie über den.'] },
      { text: ['Ordnung in den Zahlen ist wie Ordnung im Herzen.', 'Wenn alles aufgeht, schläft man besser.'] },
      { text: ['Dein Haus wird langsam zu klein, oder?', 'Wenn du ausbauen möchtest: Die Dorfkasse hilft. Ohne Zinsen, ohne Eile. Für dich doch immer.'] },
      { text: ['Kredit kommt von „credere“ – vertrauen.', 'Und dir vertrau ich. Zahl einfach zurück, wann es passt.'] },
      { text: ['Oma Gisela hat mir erzählt, dass Ärzte nur unser Geld wollen.', 'Ich hab nachgerechnet. Lars verdient gar nicht so viel, wie sie denkt.'] },
      { text: ['Am Strand hab ich eine Muschel gefunden, die genau 3,7 Zentimeter breit ist.', 'Ich hab sie natürlich vermessen. Wieso fragst du?'] },
      { text: ['Christin und ich wollen bald mal angeln gehen.', 'Ich zähle die Fische, sie räumt die Angelsachen auf. Arbeitsteilung.'] },
      { text: ['Ich bin so stolz auf dich, Lina.', 'Dein eigenes Haus, dein eigenes Beet … Das hast du toll gemacht.'], when: { minHearts: 2 } },
      { text: ['Weißt du noch, wie du als Kind dein Taschengeld in Muscheln umgerechnet hast?', 'Du warst schon immer gut mit Zahlen. Das hast du von mir.', '… Sag das bloß nicht deiner Oma.'], when: { minHearts: 3 } },
    ],
    gifts: {
      liebt: [['Oh, Lina! Das ist ja wunderbar!', 'Das trag ich gleich in mein Haushaltsbuch ein. Unter „Glück“.']],
      mag: [['Danke, mein Schatz!', 'Das kann ich gut gebrauchen.']],
      neutral: [['Oh, danke.', 'Ich finde bestimmt einen ordentlichen Platz dafür.']],
      'mag-nicht': [['Hmm … danke.', 'Ich weiß nicht ganz, wo ich das verbuchen soll. Unter „Sonstiges“ vielleicht.']],
    },
    giftsByItem: {
      glitzerstein: ['Ein Glitzerstein! Der ist bestimmt einiges wert.', 'Ich leg ihn in den Tresor. Nur zum Angucken.'],
      hering: ['Ein Hering! Wie früher, wenn wir an der Ostsee waren.', 'Den mach ich heute Abend für Christin und mich.'],
    },
    giftRepeat: ['Noch ein Geschenk? Lina, du sollst doch sparen!', '… Aber danke. Wirklich.'],
    heartUp: [['Weißt du was, Lina?', 'Mit dir in einem Dorf zu wohnen, ist das Beste, was mir passieren konnte.']],
    atHome: [['Drinnen raschelt Papier.', '„Moment, ich sortier gerade die Belege nach Farben!“']],
    atHomeSleeping: [['Alles still. Auf der Tür klebt ein Zettel: „Dorfkasse ab 9 Uhr geöffnet. Bitte nicht klopfen. Danke! – Olaf“']],
    goodbye: ['Bis später, mein Schatz!', 'Pass auf dich auf!', 'Und immer schön die Quittungen aufheben!'],
  },
  letters: [
    { id: 'tipp', subject: 'Ein kleiner Spartipp', body: 'Liebe Lina,\n\nwer jeden Tag ein paar Muscheln verkauft, hat am Ende des Monats eine ordentliche Summe. Kleinvieh macht auch Mist!\n\nDein Papa' },
    { id: 'gruss', subject: 'Grüße von nebenan', body: 'Liebe Lina,\n\nChristin lässt fragen, ob du deine Fenster schon geputzt hast. Ich habe gesagt, das geht sie nichts an.\n\nSie hat trotzdem einen Lappen beigelegt. Dann eben Äpfel – den Lappen hab ich versteckt.\n\nDein Papa', gift: { itemId: 'apfel', count: 2 } },
  ],
  heartLetters: {
    1: { id: 'herz-1', subject: 'Eine solide Investition', body: 'Liebe Lina,\n\nich hab dir eine Bauanleitung für eine Steinlaterne aufgeschrieben. Material: Steine. Kosten: null Sternchen. Rendite: Gemütlichkeit!\n\nDein Papa', gift: { itemId: 'rezept-steinlaterne', count: 1 } },
    2: { id: 'herz-2', subject: 'Für deine Teestunde', body: 'Liebe Lina,\n\nfür gemütliche Teestunden in deinem Häuschen. Christin hat es ausgesucht, ich hab bezahlt. Arbeitsteilung!\n\nDein Papa', gift: { itemId: 'teeservice', count: 1 } },
    3: { id: 'herz-3', subject: 'Kieselsteine sortiert', body: 'Liebe Lina,\n\nich hab am Wochenende Kieselsteine nach Größe sortiert. Christin sagt, das sei „ein Hobby“. Ich sage: Ordnung!\n\nDabei ist mir ein Muster eingefallen. Die Anleitung liegt bei.\n\nDein Papa', gift: { itemId: 'rezept-kieselmosaik', count: 1 } },
  },
};

/** Brief vor dem Einzug */
export const OLAF_ANNOUNCEMENT = {
  id: 'einzug',
  subject: 'Wir kommen!',
  body: 'Liebe Lina,\n\nChristin und ich haben eine Entscheidung getroffen: Wir ziehen zu dir ins Dorf! Morgen sind wir da – auf dem Bauplatz neben deinem Haus.\n\nIch eröffne dort auch eine kleine Dorfkasse. Falls du mal dein Haus ausbauen möchtest – ohne Zinsen, versprochen.\n\nBis morgen!\nDein Papa (und Christin)',
};

export const OLAF_WELCOME: readonly string[] = [
  'Lina! Da bist du ja!',
  'So, wir sind da. Das Haus steht, die Kisten sind ausgepackt …',
  '… und Christin hat schon zweimal den Boden gewischt.',
  'Und hier ist jetzt die Dorfkasse. Wenn du dein Haus ausbauen möchtest, komm einfach zu mir.',
  'Ich leih dir die Sternchen – ganz ohne Zinsen. Zurückzahlen kannst du, wann es dir passt.',
];
