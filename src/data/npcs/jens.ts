/**
 * Jens – Linas Onkel. Coach, Dandy, Lebenskünstler: führt das Bistro „Chez Jens“
 * mit Kochstudio, liebt Kunst, reist leidenschaftlich gern um die ganze Welt
 * (und schickt dann Postkarten) und ist – sagen wir – ein bisschen fabelhaft. 🌈
 * Spricht Französisch und Sächsisch, gern im selben Satz.
 */
import { hashString } from '../../core/rng';
import { LOOKS } from './looks';
import type { LetterTemplate, NpcDef } from './types';

const PLATZ = { x: 23, y: 16, w: 9, h: 7 };
const STRAND = { x: 30, y: 30, w: 12, h: 3 };

export const JENS: NpcDef = {
  id: 'jens',
  name: 'Jens',
  personality: 'Onkel, Coach & Dandy, Bistro & Kochstudio, liebt Kunst & Reisen, fabelhaft, Französisch + Sächsisch',
  appearance: LOOKS.jens,
  home: 'bistro-jens',
  movesIn: 'jensEingezogen',
  away: (day) => jensTravels(day),
  schedule: [
    { from: '00:00', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
    { from: '08:00', label: 'Croissants backen', activity: { kind: 'zuhause' } },
    { from: '10:00', label: 'Bistro geöffnet', activity: { kind: 'stehen', x: 50, y: 18, facing: 'down' } },
    { from: '13:30', label: 'Skizzieren am Strand', activity: { kind: 'spazieren', area: STRAND } },
    { from: '15:00', label: 'Bistro geöffnet', activity: { kind: 'stehen', x: 50, y: 18, facing: 'down' } },
    { from: '18:30', label: 'Flanieren über den Dorfplatz', activity: { kind: 'spazieren', area: PLATZ } },
    { from: '20:00', label: 'Feierabend im Bistro', activity: { kind: 'zuhause' } },
    { from: '23:30', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
  ],
  preferences: {
    loves: ['lavendel', 'rose', 'seestern', 'glitzerstein', 'apfelkuchen', 'crepes'],
    likes: ['pfirsich', 'apfel', 'birne', 'ei', 'wachtelei', 'hering', 'makrele', 'tulpe', 'sonnenblume', 'vergissmeinnicht', 'schneckenhaus', 'tagpfauenauge', 'ruehrei', 'obstsalat', 'fischbroetchen'],
    dislikes: ['ast', 'stein', 'weinbergschnecke', 'ohrenqualle'],
  },
  dialogue: {
    greetings: [
      { text: ['Enfin, eine Party! 🪩', 'Ich hab mir extra mein glitzerndstes Hemd angezogen. Fabelhaft, n\'est-ce pas?'], when: { tags: ['party'] }, weight: 8 },
      { text: ['Bonjour, ma chérie! ☕', 'Nu gugge ma, wer da kommt! Mei Liebsche Nichte!'], when: { phases: ['morgendaemmerung', 'morgen'] } },
      { text: ['Lina, Darling! 💋', 'Du siehst heute ganz fabelhaft aus. Fast so fabelhaft wie ich.'] },
      { text: ['Salut, Lina!', 'Ei verbibbsch, ich hab heut schon drei Gemälde angefangen und keins fertig. C\'est l\'art!'] },
      { text: ['Na, mei Gudste?', 'Hast du Hunger? Bei Onkel Jens gibt\'s immer was. Toujours!'], when: { phases: ['mittag', 'nachmittag'] } },
      { text: ['Bonsoir, chérie!', 'Der Abend ist das schönste Kunstwerk. Schau dir nur das Licht an … magnifique!'], when: { phases: ['abend', 'abenddaemmerung'] } },
      { text: ['Joyeux anniversaire, ma chérie! 🎂🎉', 'Ich hab dir eine Torte gebacken – mit essbarem Glitzer. Natürlich. Was denn sonst?'], when: { tags: ['geburtstag-lina'] }, weight: 10 },
      { text: ['Regen! Wie in Paris.', 'Nur ohne Eiffelturm. Und ohne den charmanten Kellner, der mir damals den Schirm gehalten hat … hach.'], when: { tags: ['wetter-regen'] }, weight: 3 },
      { text: ['Ein Regenbogen! 🌈', 'Na, wenn das mal kein Zeichen ist. Für uns Fabelhaften ist das ja quasi die Hausfahne.'], when: { tags: ['regenbogen'] }, weight: 5 },
    ],
    chat: [
      { text: ['Ma chérie, du und deine Gruselfilme!', 'Ich sach dir was: Das Gruseligste, was ich je gesehn hab, war ne Tapete in nem Hotel in Wien. Mon dieu, nee, nee, nee.'] },
      { text: ['Nu, mei Gudste, haste heute schon was Schönes erlebt?', 'Nee? Dann wird\'s aber Zeit! Gugge, die Sonne scheint – oder sie scheint bald. Irgendwann.'] },
      { text: ['Kaffee? Mir sagen dazu „Gaffee“. Mit weichem G.', 'Und wenn er gut is: „Scheener Gaffee!“ Na los, sag\'s mal nach! … Fast. Üben wir noch.'] },
      { text: ['Ei verbibbsch, Lina, wie siehst\'n du heute wieder aus!', '… Großartig natürlich. Was dachtest du denn?'] },
      { text: ['Weißte, was ein echter Sachse zum Abschied sagt?', '„Tschüssi!“ – mit drei S. Mindestens. Tschüssssi!'] },
      { text: ['Sonntag is Familienessen bei mir, gell?', 'Um sechse bei mir zu Hause. Lina, Oli, Lars – und wer sonst noch Hunger hat. Ich koch für zehn!'], weight: 2 },
      { text: ['Heute Abend is Sonntagsessen! 🍽️', 'Ab um sechse bei mir zu Hause. Vergess es nich, sonst ess ich alles allein. Und das wäre … eigentlich auch okay.'], when: { weekdays: [0] }, weight: 5 },
      { text: ['Mein Zwillingsbruder Olaf, chérie …', 'Gleicher Tag, gleiche Mama – und trotzdem trägt er Westen und ich Glitzer. Die Natur ist eine Künstlerin!'], weight: 2 },
      { text: ['Olaf sagt, er ist fünf Minuten älter.', 'Ich sag: Er hat fünf Minuten länger gebraucht, um sich zu trauen. Ich kam mit Stil.'] },
      { text: ['Enfin, eine Party! 🪩', 'Ich hab mir extra mein glitzerndstes Hemd angezogen. Fabelhaft, n\'est-ce pas?'], when: { tags: ['party'] }, weight: 8 },
      { text: ['Kunst, chérie, ist überall.', 'In einem Sonnenuntergang. In einer Muschel. In einem perfekt gefalteten Croissant.'] },
      { text: ['Ich war letztes Jahr in Lissabon.', 'Die Fliesen! Die Musik! Der Fischer, der mir sein Boot gezeigt hat! … Das Boot war auch schön.'] },
      { text: ['Weißt du, was ich als Coach immer sag?', '„Sei die Hauptfigur in deinem eigenen Film!“', '… Und trag dabei gute Schuhe.'] },
      { text: ['Nu, das Dorf hier ist ja schnuckelisch.', 'Aber es fehlt ein bisschen Glamour. Dafür bin ja jetzt ich da.'] },
      { text: ['In Kyoto hab ich gelernt, Tee zu trinken wie ein Kunstwerk.', 'Langsam. Mit Respekt. Und mit einem kleinen Keks. Der Keks war meine Idee.'] },
      { text: ['Ich hab Christin ein Gemälde gezeigt.', 'Sie hat gesagt, es hängt schief. Es ist abstrakt! Das MUSS schief!'], when: { tags: ['olaf-da'] } },
      { text: ['Dein Oli ist ja ein ganz Netter.', 'Und diese Arme! Vom Training, sagt er. Na, ich sag nix. Ich guck nur. Künstlerisches Interesse!'] },
      { text: ['Deine Oma hat mein Essen probiert und „pfui“ gesagt.', 'Dann hat sie den Teller leer gegessen. Und noch einen. Das nenn ich eine Kritik!'] },
      { text: ['Kochen ist wie Malen, chérie.', 'Ein bisschen hiervon, ein Klecks davon – und am Ende staunt jeder.', 'Komm doch mal ins Kochstudio! Ich zeig dir was.'] },
      { text: ['Weißt du, was das Beste am Reisen ist?', 'Nach Hause kommen. Zu euch. Mit vollem Koffer und noch volleren Geschichten.'], when: { minHearts: 2 } },
      { text: ['Ich bin so stolz auf dich, mei Liebsche.', 'Du machst dein Leben zu einem Kunstwerk. Und das ist die größte Kunst von allen.'], when: { minHearts: 3 } },
    ],
    gifts: {
      liebt: [['Oh là là! 😍', 'Das ist ja ein Meisterwerk! Das kommt sofort in meine Sammlung.']],
      mag: [['Merci, chérie!', 'Ei, das ist aber lieb von dir.']],
      neutral: [['Für mich? Wie aufmerksam!', 'Ich find bestimmt einen … künstlerischen Platz dafür.']],
      'mag-nicht': [['Hm. Interessant.', 'Sehr … rustikal. Das stell ich mal in die Ecke. Ganz hinten. Mit Tuch drüber.']],
    },
    giftsByItem: {
      lavendel: ['Lavendel! Wie in der Provence!', 'Ich war dort einen ganzen Sommer. Mit einem Maler namens Luc. Rein künstlerisch, natürlich. 😉'],
      apfelkuchen: ['Selbstgebacken? Mit meinem Rezept?', 'Ich bin gerührt. Wirklich. Gib mir ein Taschentuch. Ein seidenes, bitte.'],
    },
    giftRepeat: ['Noch ein Geschenk? Lina, du verwöhnst deinen alten Onkel!', '… Nicht alt. Gereift. Wie ein guter Käse.'],
    heartUp: [['Lina, chérie …', 'Du bist mein liebstes Kunstwerk im ganzen Dorf. Und ich hab viele gesehen.']],
    atHome: [['Aus dem Bistro duftet es nach Croissants.', '„Moment, chérie, ich hab Mehl im Gesicht! Gleich bin ich wieder präsentabel!“']],
    atHomeSleeping: [['Alles dunkel. An der Tür hängt ein Schild: „Bin am Träumen. Bitte nur bei Notfällen oder Champagner klopfen.“']],
    goodbye: ['Au revoir, chérie! 💋', 'Tschüssi, mei Gudste!', 'À bientôt – und bleib fabelhaft!'],
  },
  letters: [
    { id: 'kunst', subject: 'Ein kleiner Gedanke', body: 'Ma chérie,\n\nheute hab ich ein Bild gemalt: blauer Himmel, eine rosa Wolke, und mittendrin ein kleiner Dackel.\n\nRate mal, wer das ist.\n\nBisous,\nOnkel Jens 🎨' },
    { id: 'coach', subject: 'Coaching-Tipp der Woche', body: 'Liebe Lina,\n\nmorgens in den Spiegel schauen und sagen: „Ich bin fabelhaft.“\n\nFunktioniert bei mir jeden Tag. Probier\'s aus!\n\nDein Jens 💫' },
  ],
  heartLetters: {
    1: { id: 'herz-1', subject: 'Geheimrezept!', body: 'Chérie,\n\nhier ist mein Rezept für Fischbrötchen „à la Jens“. In Hamburg gelernt, in Paris verfeinert, in Sachsen perfektioniert.\n\nBisous,\nOnkel Jens', gift: { itemId: 'rezept-fischbroetchen', count: 1 } },
    2: { id: 'herz-2', subject: 'Süßes für dich', body: 'Ma chérie,\n\nmein Apfelkuchen-Rezept. Deine Oma behauptet, ihres sei besser.\n\nSie irrt sich. Aber sag ihr das nicht – sie hat das letzte Wort.\n\nOnkel Jens', gift: { itemId: 'rezept-apfelkuchen', count: 1 } },
    3: { id: 'herz-3', subject: 'Ein Stück Paris', body: 'Lina, Darling,\n\nCrêpes! Hauchdünn, mit Liebe gefaltet. So wie in meiner kleinen Lieblingscrêperie am Montmartre.\n\nOnkel Jens', gift: { itemId: 'rezept-crepes', count: 1 } },
    4: { id: 'herz-4', subject: 'Für deine Wand', body: 'Ma chérie,\n\nich hab dir ein Bild gemalt. Ein echter Jens! Eines Tages ist das ein Vermögen wert.\n\n… Oder zumindest hübsch.\n\nOnkel Jens 🎨', gift: { itemId: 'gemaelde-jens', count: 1 } },
  },
};

/** Brief vor dem Einzug */
export const JENS_ANNOUNCEMENT = {
  id: 'einzug',
  subject: 'Onkel Jens kommt! 🌈',
  body: 'Ma chérie!\n\nich hab genug von der großen weiten Welt – vorerst. Ich komme zu euch ins Dorf und mach ein Bistro auf!\n\nCroissants, Kunst und ganz viel Glamour.\n\nMorgen bin ich da. Halt dich fest!\n\nBisous,\nOnkel Jens',
};

export const JENS_WELCOME: readonly string[] = [
  'Lina, ma chérie! 🎉',
  'Nu gugge ma an, was für ein schnuckelisches Dorf!',
  'Ich hab mein Bistro gleich da drüben aufgemacht – „Chez Jens“. Klingt fabelhaft, oder?',
  'Komm mich besuchen, dann kochen wir zusammen! Rührei, Obstsalat … und wenn du brav bist, mein Geheimrezept.',
  'Und ab und zu bin ich auf Reisen. Dann schick ich dir Postkarten. Mit Andenken!',
  'Bisous! 💋',
];

/** Reisen: An manchen Tagen ist Jens unterwegs (reproduzierbar, ungefähr jeden 7. Tag) */
export function jensTravels(day: string): boolean {
  return hashString(`jens:reise:${day}`) % 7 === 3;
}

/** Reiseziele mit Postkarte & Andenken */
export const TRAVELS: ReadonlyArray<{ city: string; text: string; souvenir: string }> = [
  { city: 'Paris', text: 'Ich sitze in einem Café am Montmartre, trinke einen Café crème und male die Dächer. Der Kellner hat mir zugezwinkert. Paris, je t\'aime!', souvenir: 'eiffelturm' },
  { city: 'Venedig', text: 'Gondeln! Masken! Ein Gondoliere, der „O sole mio“ gesungen hat – nur für mich. Na ja, für mich und zwölf Touristen.', souvenir: 'venedig-maske' },
  { city: 'Amsterdam', text: 'Tulpen, so weit das Auge reicht. Und Museen! Ich stand eine Stunde vor einem Bild mit Sonnenblumen und hab geweint. Vor Glück.', souvenir: 'holzschuhe' },
  { city: 'Sevilla', text: 'Flamenco! Ich hab mitgetanzt. Die Tänzer sagen, ich hätte Talent. Mein Knie sagt was anderes.', souvenir: 'faecher' },
  { city: 'New York', text: 'Die Stadt schläft nie – und ich auch nicht. Broadway, Galerien, Pizza um drei Uhr nachts. Fabelhaft!', souvenir: 'schneekugel' },
  { city: 'Kyoto', text: 'Kirschblüten und Tempel. Alles so still und schön. Ich hab gelernt, Tee zu machen. Und mir einen Glücksbringer gekauft.', souvenir: 'daruma' },
];

/** Postkarte des Tages (wenn Jens reist) */
export function travelPostcard(day: string, index: number): LetterTemplate {
  const t = TRAVELS[index % TRAVELS.length];
  return {
    id: `reise-${day}`,
    subject: `Postkarte aus ${t.city} ✈️`,
    body: `Ma chérie!\n\nGrüße aus ${t.city}!\n\n${t.text}\n\nIch hab dir was mitgebracht. Bis bald!\n\nBisous,\nOnkel Jens 💋`,
    gift: { itemId: t.souvenir, count: 1 },
  };
}

/** Sonntagsessen: Jens begrüßt die Runde (mit viel Gesächsel) */
export const DINNER_OPENERS: readonly (readonly string[])[] = [
  ['Nu, da seid ihr ja alle! Hock eich hin, das Essen is glei fertsch!', 'Heute gibt\'s Coq au Vin. Oder wie mir in Leipzsch sagen: Gieggerle in Rotwein. 🍷'],
  ['Bonsoir, mes chéris! Sonntagsessen bei Onkel Jens!', 'Ich hab Klöße gemacht. Französische Klöße. … Okay, es sind sächsische Klöße mit Petersilie. Aber mit Stil!'],
  ['Kommt rein, kommt rein! Ei verbibbsch, is des gemütlich, wenn alle da sind!', 'Lina, du sitzt neben mir. Wie immer. Du bist mei Lieblingsnichte. … Du bist auch mei einzige. Trotzdem!'],
];

/** Wer was am Tisch sagt (wenn dabei) */
export const DINNER_LINES: Readonly<Record<string, readonly string[]>> = {
  oli: ['Oli: „Jens, das ist das beste Essen der Woche!“', 'Oli: „Ich hab schon dreimal nachgenommen. Proteine, Lini!“'],
  lars: ['Lars: „Ärztlich gesehen ist das hier sehr gesund.“ – Jens: „Nu sicher, da is Butter drin!“', 'Lars: „Wie nennt man einen Koch, der Witze erzählt? … Jens.“'],
  olaf: ['Olaf: „Ich hab ausgerechnet: Pro Person 1,2 Klöße. Das geht nicht auf.“ – Jens: „Dann nimmste halt zwee, Brüderchen!“'],
  christin: ['Christin hat die Servietten zu kleinen Schwänen gefaltet. Alle exakt gleich groß.'],
  gisela: ['Oma: „Zu wenig Salz.“ … *isst drei Portionen* … „Köstlich. Aber zu wenig Salz.“'],
};

/** Jens sächselt gern mit Lina – zusätzliche Plauder-Zeilen */
export const SAXON_LINES: readonly (readonly string[])[] = [
  ['Nu, mei Gudste, haste heute schon was Schönes erlebt?', 'Nee? Dann wird\'s aber Zeit! Gugge, die Sonne scheint – oder sie scheint bald. Irgendwann.'],
  ['Weeßte, Lina, was ich an dir mag?', 'Du lachst immer über meine Witze. Och über die schlechten. Besonders über die schlechten!'],
  ['Kaffee? Mir sagen dazu „Gaffee“. Mit weichem G.', 'Und wenn er gut is: „Scheener Gaffee!“ Na los, sag\'s mal nach! … Fast. Üben wir noch.'],
  ['Ei verbibbsch, Lina, wie siehst\'n du heute wieder aus!', '… Großartig natürlich. Was dachtest du denn?'],
  ['Weißte, was ein echter Sachse zum Abschied sagt?', '„Tschüssi!“ – mit drei S. Mindestens. Tschüssssi!'],
];
