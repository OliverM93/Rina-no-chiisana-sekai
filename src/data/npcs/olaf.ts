/**
 * Olaf – Linas Papa. Arbeitet beim Finanzamt und führt im Dorf die
 * Dorfkasse. Ruhig, hilfsbereit, ein bisschen pedantisch mit Zahlen,
 * erzählt gern trockene Papa-Witze über Steuern und Quittungen.
 */
import { LOOKS } from './looks';
import type { LetterTemplate, NpcDef } from './types';

const STRAND = { x: 30, y: 30, w: 14, h: 3 };

export const OLAF: NpcDef = {
  id: 'olaf',
  name: 'Olaf',
  personality: 'ruhiger, hilfsbereiter Papa, Finanzamt, liebt Ordnung in den Zahlen, trockener Humor',
  appearance: LOOKS.olaf,
  home: 'haus-olaf',
  movesIn: 'olafEingezogen',
  birthday: { day: 3, month: 4 },
  birthdayLines: {
    greeting: ['Heute hab ich Geburtstag, mein Schatz. Mein Zwillingsbruder Jens auch. Er sagt, er ist der Schönere.', 'Ich sage: Ich bin der Pünktlichere. Wir haben das beide schon im Kalender.', 'Die Torte ist budgetiert. Die zweite Torte auch. Hehe.'],
    thanks: ['Ein Geschenk! Das buche ich unter „Freude“.', 'Danke, mein Schatz. Der Betrag ist beträchtlich. Der ideelle erst recht.'],
  },
  schedule: [
    { from: '00:00', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
    { from: '07:30', label: 'Zeitung vor dem Haus', activity: { kind: 'stehen', x: 18, y: 18, facing: 'down' } },
    { from: '09:00', label: 'Dorfkasse geöffnet', activity: { kind: 'stehen', x: 20, y: 18, facing: 'down' } },
    { from: '12:30', label: 'Mittagessen zu Hause', activity: { kind: 'zuhause' } },
    { from: '13:30', label: 'Dorfkasse geöffnet', activity: { kind: 'stehen', x: 20, y: 18, facing: 'down' } },
    { from: '17:30', label: 'Abendspaziergang am Strand', activity: { kind: 'spazieren', area: STRAND } },
    { from: '19:30', label: 'Feierabend zu Hause', activity: { kind: 'zuhause' } },
    { from: '22:30', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
  ],
  preferences: {
    loves: ['hering', 'dorsch', 'glitzerstein', 'teeservice', 'fischbroetchen', 'kartoffelsuppe'],
    likes: ['ei', 'wachtelei', 'apfel', 'birne', 'scholle', 'barsch', 'stein', 'tulpe', 'keks', 'kartoffel', 'kraeuterquark', 'tomatensalat', 'strauss-bunt', 'strauss-rosen', 'strauss-kraeuter', 'karpfen-kartoffeln', 'scholle-kartoffel'],
    dislikes: ['waldameise', 'ohrenqualle', 'weinbergschnecke'],
  },
  dialogue: {
    greetings: [
      { text: ['Eine Party! Ich hab ein Budget für Konfetti aufgestellt.', 'Wir liegen voll im Plan. Christin tanzt schon.'], when: { tags: ['party'] }, weight: 8 },
      { text: ['Guten Morgen, mein Schatz!', 'Ich hab schon die Zeitung gelesen. Die Zinsen sind stabil. Herrlich.'], when: { phases: ['morgendaemmerung', 'morgen'] } },
      { text: ['Lina! Schön, dass du vorbeikommst.', 'Brauchst du was? Ein Ohr, einen Rat, eine Quittung?'] },
      { text: ['Na, mein Mädchen?', 'Alles im grünen Bereich? Bei mir schon. Ich hab heute die Kasse dreimal gezählt. Stimmt alles.'] },
      { text: ['Hallo Lina!', 'Christin hat heute schon zweimal gewischt. Ich trau mich gar nicht mehr rein.'], when: { phases: ['mittag', 'nachmittag'] } },
      { text: ['Abends wird es ruhig im Dorf.', 'Genau richtig, um über die Wochenbilanz nachzudenken. … Oder einfach den Sonnenuntergang zu genießen.'], when: { phases: ['abend', 'abenddaemmerung'] } },
      { text: ['Alles Gute zum Geburtstag, mein Schatz! 🎂', 'Ich hab dir ein kleines Geschenk mitgebracht. Es ist … kein Steuerratgeber. Versprochen.'], when: { tags: ['geburtstag-lina'] }, weight: 10 },
      { text: ['Bei dem Regen arbeiten selbst die Enten im Homeoffice.', '… War ein Witz. Ein guter, finde ich.'], when: { tags: ['wetter-regen'] }, weight: 3 },
    ],
    chat: [
      { text: ['Kartoffeln sind eine solide Anlage.', 'Man steckt eine in die Erde und bekommt vier zurück. Das ist eine Rendite von vierhundert Prozent. Ohne Risiko. Außer Kartoffelkäfer.'], weight: 3 },
      { text: ['Weißt du, was ein Pirat am Computer drückt?', '… Die Enter-Taste. Hehehe. Christin sagt, ich soll aufhören. Ich sage: Ich bin gerade erst warm geworden.'] },
      { text: ['Was ist grün und schaut durchs Schlüsselloch?', '… Ein Spionat. Hehe. Das ist von mir. Also nicht von mir. Aber ich hab es bei der Arbeit erzählt. Es gab zwei Lacher. Einen davon war Herr Meier.'] },
      { text: ['Was sagt der große Stift zum kleinen Stift?', '„Wachs-mal-stift!“ … Verstehst du? Wachs mal! Stift! Ich hab einmal wegen eines Witzes den Bus verpasst.'] },
      { text: ['Warum können Geister so schlecht lügen?', 'Weil man sie so leicht durchschauen kann. Ich hab mich bei der Steuerprüfung heute kurz wie ein Geist gefühlt. Hehe.'] },
      { text: ['Was ist braun, klebrig und läuft durch die Wüste?', 'Ein Karamell. … Lina? … Lina, das war ein Witz. Du darfst lachen. Ist nicht verpflichtend. Wie das meiste im Dorf.'] },
      { text: ['Ich habe einen Witz über Papier.', '… Ist aber zerreißend. Hehehe. Den hab ich mir selbst ausgedacht. Gut, ich hab ihn im Büro auf einem Zettel gefunden.'] },
      { text: ['Was ist rot und schlecht für die Zähne?', 'Ein Backstein. … Das war ein Witz für Fortgeschrittene.'] },
      { text: ['Ich arbeite beim Finanzamt. Da gibt es nur eine einzige Regel:', '… Es gibt keine einzige Regel. Es gibt viertausend. Hehe. Ich freu mich auf deinen Gesichtsausdruck.'] },
      { text: ['Was ist ein Keks unter einem Baum?', 'Ein schattiges Plätzchen! … Christin lacht nie bei dem. Dabei ist es einer meiner besten.'] },
      { text: ['Was sagt die Null zur Acht?', '„Schicker Gürtel!“ … Ich liebe den. Zahlen sind eben mein Fachgebiet. Und mein Humor.'] },
      { text: ['Christin sagt, ich hab ein Haushaltsdefizit an Ernsthaftigkeit.', 'Ich sage: Das ist die einzige Schuld, die ich gern mache. Hehe.'] },
      { text: ['Lina: „Papa, bitte nicht noch ein Wortspiel.“', 'Olaf: „Zu spät! Ich hab schon eins im Anflug. Es heißt: „Hallo, ich bin Olaf – und das ist meine Steuernummer.““'], weight: 2 },
      { text: ['Schon ans Sparbuch gedacht, Lina?', 'Jeden Monatsanfang gibt es ein Prozent Zinsen. Das ist nicht viel – aber es ist von ganz allein mehr geworden. Herrlich!'], weight: 2 },
      { text: ['Weißt du, was das Schönste an meinem Beruf ist?', 'Zahlen lügen nicht. Christin übrigens auch nicht. Gerade hat sie mir gesagt, dass meine Weste schief sitzt.'] },
      { text: ['Wusstest du, dass Jens und ich Zwillinge sind?', 'Er sagt immer, er ist der Hübschere. Ich sage: Ich bin der Pünktlichere. Fünf Minuten älter, nämlich.'], when: { tags: ['jens-da'] }, weight: 2 },
      { text: ['Als Kinder haben Jens und ich uns manchmal ausgetauscht.', 'Ich bin für ihn in den Kunstunterricht, er für mich in Mathe.', 'Er hatte eine Eins. Ich eine Vier. Wir haben nie wieder getauscht.'], when: { tags: ['jens-da'] } },
      { text: ['Eine Party! Ich hab ein Budget für Konfetti aufgestellt.', 'Wir liegen voll im Plan. Christin tanzt schon.'], when: { tags: ['party'] }, weight: 8 },
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
      { text: ['Im Frühling kommen bei mir die Steuererklärungen herein wie Frühblüher.', 'Nur ohne Duft. Dafür mit Anlagen A bis Z. Hehe.'], when: { seasons: ['fruehling'] } },
      { text: ['Sommerzeit ist Beleg-Zeit im Urlaub: Man sammelt Quittungen wie Muscheln.', 'Am Strand hab ich neulich eine Eisrechnung gefunden. Seitdem esse ich bargeldlos.'], when: { seasons: ['sommer'] } },
      { text: ['Der Herbst ist wunderbar. Die Blätter fallen – und die Zahlen stimmen trotzdem.', 'Nur mein Bart wird in der Zeit etwas grauer. Aber das ist eine Wertsteigerung. Hehe.'], when: { seasons: ['herbst'] } },
      { text: ['Im Winter plane ich gern. Kalender, Tabellen, Heizkosten …', 'Christin plant Kekse. Ich glaube, ihr Plan ist besser.'], when: { seasons: ['winter'] } },
      { text: ['Regen? Sehr gut für den Haushalt. Wir müssen nicht gießen.', 'Ich spar Wasser und Zeit. Und die Zeit leg ich fürs Flugzeugmodell an.'], when: { tags: ['wetter-regen'] }, weight: 2 },
      { text: ['Wenn ein Flugzeug über den Himmel zieht, bleibe ich immer kurz stehen.', 'Bauart, Triebwerke, Spannweite. Ich muss das mal nachschlagen. Hehe, ich weiß natürlich alles. Aber nachschlagen macht Spaß.'] },
      { text: ['Frère! … So nennen Jens und ich uns manchmal.','Er sagt es französisch. Ich sage es, weil es so schön feierlich klingt. Hehe.'] },
      { text: ['Christin und ich haben früher an der Ostsee gewohnt.','Wind, Wasser, Fischbrötchen … Unser Strand hier ist nicht schlecht. Aber ein kleines bisschen Heimweh nach der Ostsee hab ich schon. Verbucht unter „Wehmut“.'] },
      { text: ['Ich lese gern „Das kleine Arschloch“. Ein Klassiker unter den Comics!','Christin findet ihn grauenhaft. Ich verstecke ihn im Ordner „Steuern 2019“. Da schaut keiner nach.'] },
      { text: ['Oli und Lars sitzen wieder vor dem Bildschirm? Hauptsache, sie machen Pausen.','Das sagt der Papa. Der Beamte rechnet gerade den Stromverbrauch aus.'] },
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
    { id: 'sonnenblumen-rot', subject: 'Rote Sonnenblumen', body: 'Liebe Lina,\n\nein Kollege vom Amt hat mir rote Sonnenblumen-Samen mitgebracht. Ich hab sie nicht gebraucht. Ich hab ihn gefragt, ob sie rot sind. Er hat „ja“ gesagt.\n\nGelb und Rot zusammen, soll man gehört haben, ergibt Orange. Ich glaube das nicht. Beweis es mir.\n\nPapa', gift: { itemId: 'samen-sonnenblume-rot', count: 2 } },
    { id: 'tipp', subject: 'Ein kleiner Spartipp', body: 'Liebe Lina,\n\nwer jeden Tag ein paar Muscheln verkauft, hat am Ende des Monats eine ordentliche Summe. Kleinvieh macht auch Mist!\n\nDein Papa' },
    { id: 'gruss', subject: 'Grüße von nebenan', body: 'Liebe Lina,\n\nChristin lässt fragen, ob du deine Fenster schon geputzt hast. Ich habe gesagt, das geht sie nichts an.\n\nSie hat trotzdem einen Lappen beigelegt. Dann eben Äpfel – den Lappen hab ich versteckt.\n\nDein Papa', gift: { itemId: 'apfel', count: 2 } },
  ],
  heartLetters: {
    1: { id: 'herz-1', subject: 'Eine solide Investition', body: 'Liebe Lina,\n\nich hab dir eine Bauanleitung für eine Steinlaterne aufgeschrieben. Material: Steine. Kosten: null Sternchen. Rendite: Gemütlichkeit!\n\nDein Papa', gift: { itemId: 'rezept-steinlaterne', count: 1 } },
    2: { id: 'herz-2', subject: 'Für deine Teestunde', body: 'Liebe Lina,\n\nfür gemütliche Teestunden in deinem Häuschen. Christin hat es ausgesucht, ich hab bezahlt. Arbeitsteilung!\n\nDein Papa', gift: { itemId: 'teeservice', count: 1 } },
    3: { id: 'herz-3', subject: 'Kieselsteine sortiert', body: 'Liebe Lina,\n\nich hab am Wochenende Kieselsteine nach Größe sortiert. Christin sagt, das sei „ein Hobby“. Ich sage: Ordnung!\n\nDabei ist mir ein Muster eingefallen. Die Anleitung liegt bei.\n\nDein Papa', gift: { itemId: 'rezept-kieselmosaik', count: 1 } },
    4: { id: 'herz-4', subject: 'Ein Witz am Tag', body: 'Liebe Lina,\n\nich hab dir einen Kalender gebastelt. Für jeden Tag ein Witz. Selbst geschrieben!\n\nChristin hat sie vorher gelesen und gesagt: „Olaf, nein.“ Ich habe das als Zustimmung gewertet.\n\nHäng ihn dir auf und schau jeden Tag mal drauf. Oder nicht. Steuerlich ist beides absetzbar.\n\nDein Papa', gift: { itemId: 'witzkalender', count: 1 } },
    5: { id: 'herz-5', subject: 'Die ganze Familie', body: 'Liebe Lina,\n\nich hab ein Bild von uns allen rahmen lassen: die ganze Familie vor Omas Bank. Jens hat es gemalt und darauf bestanden, dass er in der Mitte steht.\n\nDer Rahmen war steuerlich absetzbar. Das Bild ist unbezahlbar.\n\nDein Papa', gift: { itemId: 'familienbild', count: 1 } },
  },
};

/** Brief vor dem Einzug */
export const OLAF_ANNOUNCEMENT = {
  id: 'einzug',
  subject: 'Wir kommen!',
  body: 'Liebe Lina,\n\nChristin und ich haben eine Entscheidung getroffen: Wir ziehen zu dir ins Dorf! Der Umzugswagen ist schon unterwegs – gleich sind wir da, auf dem Bauplatz neben deinem Haus.\n\nIch eröffne dort auch eine kleine Dorfkasse. Falls du mal dein Haus ausbauen möchtest – ohne Zinsen, versprochen.\n\nBis gleich!\nDein Papa (und Christin)',
};

export const OLAF_WELCOME: readonly string[] = [
  'Lina! Da bist du ja!',
  'So, wir sind da. Das Haus steht, die Kisten sind ausgepackt …',
  '… und Christin hat schon zweimal den Boden gewischt.',
  'Und hier ist jetzt die Dorfkasse. Wenn du dein Haus ausbauen möchtest, komm einfach zu mir.',
  'Ich leih dir die Sternchen – ganz ohne Zinsen. Zurückzahlen kannst du, wann es dir passt.',
];

/** Kontoauszug zum Monatsanfang (`{zinsen}`, `{guthaben}` werden ersetzt) */
export const INTEREST_LETTERS: readonly LetterTemplate[] = [
  { id: 'zinsen', subject: 'Dein Kontoauszug 📒', body: 'Liebe Lina,\n\nneuer Monat, neue Zinsen! Auf dein Sparbuch sind {zinsen} gekommen. Guthaben jetzt: {guthaben}.\n\nDas nennt man Zinseszins. Christin sagt, ich soll beim Abendessen nicht mehr davon anfangen. Aber es ist doch so schön!\n\nDein Papa' },
  { id: 'zinsen', subject: 'Zinsen sind da! 📈', body: 'Liebe Lina,\n\nich habe nachgerechnet – zweimal, sicher ist sicher: Diesen Monat gab es {zinsen} Zinsen. Neues Guthaben: {guthaben}.\n\nIch bin sehr stolz auf dich. Und ein bisschen auf mich, weil ich so gut rechnen kann.\n\nDein Papa' },
  { id: 'zinsen', subject: 'Post von der Dorfkasse', body: 'Liebe Lina,\n\ndein Geld hat fleißig für dich gearbeitet, während du geschlafen hast: {zinsen} Zinsen! Auf dem Sparbuch liegen jetzt {guthaben}.\n\nKleinvieh macht auch Mist. Großvieh übrigens auch.\n\nDein Papa' },
];

/** Papas Witze-Kalender (Herz-Geschenk): ein Witz pro Tag, reproduzierbar ausgewählt */
export const OLAF_CALENDAR_JOKES: readonly string[] = [
  'Was macht ein Steuerberater im Garten? Er pflanzt Abschreibungen.',
  'Warum können Geister so schlecht lügen? Weil man durch sie hindurchsieht.',
  'Treffen sich zwei Kiesel. Sagt der eine: „Na, alles glatt?“',
  'Wie nennt man einen Bumerang, der nicht zurückkommt? Stock.',
  'Was ist orange und läuft durch den Wald? Eine Wanderine.',
  'Warum hat der Fisch so gute Noten? Weil er immer in der Schule ist.',
  'Was sagt der große Stift zum kleinen Stift? „Wachs mal, Stift!“',
  'Ich wollte einen Witz über Zinsen machen. Aber der hat sich noch nicht ausgezahlt.',
  'Was ist grün und klopft an die Tür? Ein Klopfsalat.',
  'Was ist rot und schlecht für die Zähne? Ein Ziegelstein.',
  'Was macht ein Clown im Büro? Faxen. … Christin hat gelacht. Glaube ich.',
  'Was macht ein Pirat am Computer? Er drückt die Enter-Taste.',
  'Was ist braun, klebrig und läuft durch die Wüste? Ein Karamel.',
  'Warum trägt der Mathematiker so selten Socken? Er hat immer schon genug Ungerades.',
  'Was liegt am Strand und spricht undeutlich? Eine Nuschel.',
  'Treffen sich zwei Magnete. Sagt der eine: „Was soll ich heute bloß anziehen?“',
  'Was macht eine Wolke, wenn es juckt? Sie sucht sich einen Wolkenkratzer.',
  'Wie heißt der Bruder von Elvis? Zwölfis.',
  'Wo wohnen Katzen? Im Miezhaus.',
  'Was ist ein Keks unter einem Baum? Ein schattiges Plätzchen.',
  'Ich hab meiner Uhr gesagt, sie soll leiser ticken. Jetzt ist sie eingeschnappt. Sekündlich.',
  'Warum ist das Finanzamt so ruhig? Weil dort jeder seine Ruhe abgibt. Freiwillig. Mehr oder weniger.',
];
