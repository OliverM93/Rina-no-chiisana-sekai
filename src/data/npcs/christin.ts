/**
 * Christin – Olafs Freundin. Sehr ordentlich, achtet auf Ordnung und
 * Sauberkeit, freundlich, aber mit klaren Vorstellungen davon, wo die
 * Dinge hingehören.
 *
 * Ihre Rolle im Dorf: Sie gießt abends Linas Garten mit (`game/christin.ts`) und hat
 * jeden Tag einen Ordnungstipp – kleine, echte Spieltipps in ihrer Art (`CHRISTIN_TIPS`).
 */
import { LOOKS } from './looks';
import type { NpcDef } from './types';

const PLATZ = { x: 23, y: 16, w: 9, h: 7 };
const WIESE = { x: 4, y: 19, w: 12, h: 8 };
/** Vor Linas Beet – hier gießt sie abends */
const BEET_LINA = { x: 5, y: 13, w: 6, h: 2 };

export const CHRISTIN: NpcDef = {
  id: 'christin',
  name: 'Christin',
  personality: 'sehr ordentlich, achtet auf Ordnung & Sauberkeit, freundlich, klare Meinung',
  appearance: LOOKS.christin,
  home: 'haus-olaf',
  movesIn: 'olafEingezogen',
  birthday: { day: 4, month: 6 },
  birthdayLines: {
    greeting: ['Heute ist mein Geburtstag, Lina. Ich hab den Tisch schon gedeckt.', 'Alles gerade ausgerichtet. … Keine Sorge, ich bin nicht streng. Heute nicht.', 'Kuchen steht links. Komm ruhig.'],
    thanks: ['Oh. Für mich? Das ist … aufmerksam.', 'Ich stell es gleich an einen guten Platz. Danke, Lina.'],
  },
  schedule: [
    { from: '00:00', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
    { from: '07:00', label: 'Fegt den Dorfplatz', activity: { kind: 'spazieren', area: PLATZ } },
    { from: '09:30', label: 'Putzt zu Hause', activity: { kind: 'zuhause' } },
    { from: '11:00', label: 'Spaziergang über die Wiese', activity: { kind: 'spazieren', area: WIESE } },
    { from: '13:00', label: 'Sitzt auf der Bank am Platz', activity: { kind: 'sitzen', bench: 'bank-platz' } },
    { from: '15:00', label: 'Kontrollgang über den Dorfplatz', activity: { kind: 'spazieren', area: PLATZ } },
    { from: '18:00', label: 'Gießt Linas Garten', activity: { kind: 'spazieren', area: BEET_LINA } },
    { from: '18:45', label: 'Zu Hause', activity: { kind: 'zuhause' } },
    { from: '22:00', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
  ],
  preferences: {
    loves: ['lavendel', 'vergissmeinnicht', 'rose', 'ikebana', 'obstsalat', 'lavendelkekse', 'gruener-salat', 'strauss-lavendel', 'strauss-kraeuter'],
    likes: ['ei', 'wachtelei', 'tulpe', 'sonnenblume', 'wildblumen', 'jakobsmuschel', 'herzmuschel', 'pfirsich', 'apfel', 'salat', 'schnittlauch', 'basilikum', 'petersilie', 'karottensuppe', 'strauss-sonne', 'strauss-bunt', 'strauss-rosen'],
    dislikes: ['ast', 'stein', 'weinbergschnecke', 'waldameise', 'strandkrabbe', 'aal'],
  },
  dialogue: {
    greetings: [
      { text: ['Ich tanze!', 'Aber nach der Party wird aufgeräumt. Jedes Konfetti einzeln.'], when: { tags: ['party'] }, weight: 8 },
      { text: ['Guten Morgen, Lina!', 'Ich hab schon den Dorfplatz gefegt. Da lagen drei Blätter. DREI!'], when: { phases: ['morgendaemmerung', 'morgen'] } },
      { text: ['Hallo Lina!', 'Hast du dir die Schuhe abgeputzt? … Ach, wir sind ja draußen. Trotzdem.'] },
      { text: ['Oh, Lina! Schön dich zu sehen.', 'Du hast da einen kleinen Fleck. Moment … So. Viel besser.'] },
      { text: ['Ein ruhiger Abend.', 'Ich hab Olafs Socken nach Farben sortiert. Er hat es noch nicht bemerkt.'], when: { phases: ['abend', 'abenddaemmerung'] } },
      { text: ['Alles Gute zum Geburtstag, Lina! 🎂', 'Ich hab dir einen Kuchen gebacken. Und die Küche danach natürlich sofort aufgeräumt.'], when: { tags: ['geburtstag-lina'] }, weight: 10 },
      { text: ['Hallo Lina!', 'Ich hab vorhin deine Blumen gegossen. Nicht zu viel, nicht zu wenig. Ich hab mitgezählt.'], when: { tags: ['beet-gegossen'] }, weight: 4 },
      { text: ['Dieser Regen!', 'Jetzt tragen alle Matsch auf den Dorfplatz. Ich seh schon, was ich morgen mache.'], when: { tags: ['wetter-regen'] }, weight: 3 },
    ],
    chat: [
      { text: ['Im Winter ruht die Erde. Sie hat sich das verdient.', 'Wer trotzdem etwas ernten will, braucht ein Frühbeet oder ein Gewächshaus. Ordentlich, geschützt, mit Tür. Ich träume schon davon.'], when: { seasons: ['winter'] }, weight: 4 },
      { text: ['Dein Gemüse steht übrigens in Reihen. Sehr schön.', 'Karotten links, Salat rechts, Kräuter vorn. Wer so sät, kann so ernten.'], weight: 3 },
      { text: ['Ich hab heute die Gewürze nach Alphabet sortiert.', 'Olaf hat gefragt, wo der Zimt ist. Ich hab gesagt: Zwischen Kurkuma und Zitronenpfeffer. Er hat mich angeschaut, als wär ich eine Zauberin.'] },
      { text: ['Weißt du, was beruhigend ist?', 'Ein frisch gefegter Weg. Ganz ohne Blätter. … Für ungefähr drei Minuten.'] },
      { text: ['Dein Winston hat heute vor unserer Tür gesessen und mich angeguckt.', 'Ich hab ihm die Pfoten abgewischt. Er hat es mit Würde getragen.'] },
      { text: ['Ich mag das Dorf.', 'Hier steht alles da, wo es hingehört. Die Bäume, die Bank, Oma. Vor allem Oma. Die bewegt sich nicht von ihrer Bank.'] },
      { text: ['Ordnungstipp des Tages:', 'Was du in zwei Minuten erledigen kannst, mach sofort. … Ich mach jetzt sofort einen Kaffee.'] },
      { text: ['Dein Papa hat mir gestern Blumen mitgebracht.', 'Er hat sie selbst gepflückt. Die Stiele waren unterschiedlich lang. Ich hab sie nachgeschnitten. Aus Liebe.'], when: { minHearts: 1 } },
      { text: ['Ich tanze!', 'Aber nach der Party wird aufgeräumt. Jedes Konfetti einzeln.'], when: { tags: ['party'] }, weight: 8 },
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
      { text: ['Beim Gießen fang ich immer links an und arbeite mich nach rechts vor.', 'Wie beim Lesen. Dann weiß das Beet, woran es ist.'] },
      { text: ['Ich hab in deinem Beet nach Unkraut gesucht.', 'Keins gefunden. Ich hab aber auch sehr genau geguckt. Mit Lupe.'], when: { tags: ['beet-gegossen'] }, weight: 2 },
      { text: ['Weißt du, was ich an Blumen mag?', 'Die wachsen ganz von allein in die richtige Richtung. Nach oben. Sehr vernünftig.'] },
      { text: ['Gießkanne leer machen, umgedreht hinstellen, fertig.', 'Dann kann sie trocknen. Kleiner Tipp. Ganz umsonst.'] },
      { text: ['Ich hab auf dem Dorfplatz einen Samenstand aufgemacht!', 'Alles in Tütchen, alles beschriftet. Jeden Tag liegen drei andere Farben aus – frag nicht, wie lange ich die Reihenfolge überlegt habe.'], weight: 4 },
      { text: ['Wenn du zwei Farben nebeneinander ins Beet setzt, kann was Neues entstehen.', 'Bei mir am Stand gibt es immer ein paar Farb-Samen. Zum Kreuzen. Ganz ordentlich, versteht sich.'], when: { minHearts: 1 }, weight: 3 },
      { text: ['Ich bin froh, dass Olaf und ich hier sind.', 'Und du hast so ein schönes, ordentliches Beet.'], when: { minHearts: 2 } },
      { text: ['Frühjahrsputz ist mein Lieblingsfest.', 'Fenster, Schränke, Gewürzregal. Und danach ein Kaffee auf der frisch gewischten Terrasse. Ohne Blätter. Noch.'], when: { seasons: ['fruehling'] } },
      { text: ['Im Sommer geht die Sonne früh auf – da gieße ich zuerst.', 'Morgens verdunstet weniger. Und es sieht ordentlich aus, wenn alles gleichzeitig nass ist.'], when: { seasons: ['sommer'] } },
      { text: ['Herbst heißt: Laub fegen, jeden Tag.', 'Man darf sich dabei nicht ärgern. Man sagt sich: Es ist ein Kreislauf. Und fegt trotzdem.'], when: { seasons: ['herbst'] } },
      { text: ['Wenn es so kalt ist, mach ich uns einen Tee und räum nebenbei die Küche auf.', 'Warm und ordentlich: Das ist mein Winter.'], when: { seasons: ['winter'] } },
      { text: ['Regen ist ungefähr wie ein Gießplan, den ich nicht selbst gemacht habe.', 'Ich vertraue ihm. Aber ich kontrolliere sicherheitshalber die Beete.'], when: { tags: ['wetter-regen'] }, weight: 2 },
      { text: ['Ich mag es, wenn Ordnung nicht streng, sondern gemütlich ist.', 'Eine Decke gefaltet, eine Tasse auf dem Tisch. So reicht es völlig.'] },
      { text: ['Wir haben früher an der Ostsee gewohnt, Olaf und ich.','Salzluft, weite Dünen, und alles sauber geharkt. Manchmal fehlt mir das. Das Meer hier ist ja auch schön – nur anders sortiert.'] },
      { text: ['Olaf liest wieder diesen Comic. „Der kleine Stinkstiefel“.','Ich verstehe nicht, was daran lustig sein soll. Ich habe ihn nach Größe einsortiert. Ganz unten.'] },
      { text: ['Du willst Thalia verkuppeln? Ich plane gern mit.','Tisch, Kerzen, passende Servietten. Der Rest ist Zufall. Und der kann bei mir nur mitkommen, wenn er pünktlich ist.'] },
      { text: ['Wie lange sitzt du eigentlich schon vor dem Bildschirm, Lina?','Ich leg dir einen Pausenplan hin. Mit Smileys. Und einem Teller Obst.'] },
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
    { id: 'tulpen-weiss', subject: 'Weiße Tulpen', body: 'Liebe Lina,\n\nweiße Tulpen! Ich würde sie immer abwechselnd mit den roten pflanzen: rot, weiß, rot, weiß. Sieht ordentlich aus.\n\nDie Natur ist da eigensinnig: Wenn man beim Pflücken Glück hat, fällt ein Same ab, aus dem rosa Tulpen werden. Das war so nicht geplant. Ich hab es trotzdem gern.\n\nChristin', gift: { itemId: 'samen-tulpe-weiss', count: 3 } },
    { id: 'rosen-weiss', subject: 'Weiße Rosen', body: 'Liebe Lina,\n\nweiße Rosen gehören in einen Garten, der Ruhe ausstrahlt. Ich hab dir Samen mitgeschickt.\n\nBitte nicht zu dicht neben die roten pflanzen. … Es sei denn, du willst Rosa. Dann doch.\n\nChristin', gift: { itemId: 'samen-rose-weiss', count: 2 } },
    { id: 'rosen', subject: 'Für ein ordentliches Rosenbeet', body: 'Liebe Lina,\n\nich hab dir Rosensamen besorgt. Rosen in einer geraden Reihe sind das Schönste, was es gibt.\n\nNicht zu dicht pflanzen! Und regelmäßig gießen.\n\nLiebe Grüße\nChristin 🌹', gift: { itemId: 'samen-rose', count: 3 } },
    { id: 'ordnung', subject: 'Kleiner Ordnungstipp', body: 'Liebe Lina,\n\nein Tipp von mir: Jeden Tag eine Sache aufräumen. Dann wird es nie unordentlich!\n\nLiebe Grüße\nChristin', gift: { itemId: 'samen-lavendel', count: 2 } },
  ],
  heartLetters: {
    1: { id: 'herz-1', subject: 'Alles an seinen Platz!', body: 'Liebe Lina,\n\nwer viele Sachen hat, braucht ein Regal. So einfach ist das.\n\nIch hab dir aufgeschrieben, wie man eins aus Ästen baut. Und dann sammelst du gleich die Äste vom Weg auf – zwei Fliegen mit einer Klappe!\n\nChristin', gift: { itemId: 'rezept-treibholzregal', count: 1 } },
    2: { id: 'herz-2', subject: 'Für dein Zimmer', body: 'Liebe Lina,\n\ndamit es bei dir noch ein bisschen schöner aussieht: eine Ikebana-Vase. Schlicht und ordentlich – so mag ich das.\n\nChristin', gift: { itemId: 'ikebana', count: 1 } },
    3: { id: 'herz-3', subject: 'Ein kleiner Tipp fürs Beet', body: 'Liebe Lina,\n\nich hab gesehen, dein Beet ist gut in Schuss. Sehr ordentlich!\n\nHier drei weiße Tulpenzwiebeln. Setz sie direkt neben deine roten Tulpen – Rot und Weiß nebeneinander, und mit etwas Glück blüht bald etwas in Rosa.\n\nIn Reihen pflanzen, bitte. Nicht durcheinander.\n\nChristin', gift: { itemId: 'samen-tulpe-weiss', count: 3 } },
    4: { id: 'herz-4', subject: 'Alles hat seinen Platz', body: 'Liebe Lina,\n\nich hab einen alten Setzkasten aufgearbeitet. Neun Fächer, und in jedem liegt etwas Kleines: Samen, ein Kiesel vom Fluss, ein Fläschchen Lavendelöl.\n\nDu musst nichts einsortieren. Ist schon alles an seinem Platz. Ich konnte nicht anders.\n\nChristin', gift: { itemId: 'setzkasten', count: 1 } },
    5: { id: 'herz-5', subject: 'Damit es auch im Winter wächst', body: 'Liebe Lina,\n\nOlaf und ich haben dir am Wochenende ein Frühbeet gebaut. Er hat gemessen, ich hab gesägt. Frag nicht, warum es so herum war.\n\nDarin wächst es auch im Winter weiter. Stell es dir in den Garten, wohin du magst.\n\nIch hab dich sehr gern, weißt du das?\n\nChristin', gift: { itemId: 'fruehbeet', count: 1 } },
  },
};

export const CHRISTIN_WELCOME: readonly string[] = [
  'Hallo Lina! Ich freu mich so, dass wir jetzt Nachbarn sind.',
  'Wenn du mal Hilfe beim Aufräumen brauchst – ich bin direkt nebenan.',
  '… Und wenn du keine brauchst, komme ich trotzdem mal gucken.',
];

/**
 * Christins Ordnungstipp des Tages: echte kleine Spieltipps – sachlich, hilfreich und ganz Christin.
 * (Kein Lob fürs Aufräumen – nur Tipps.)
 */
export const CHRISTIN_TIPS: readonly (readonly string[])[] = [
  ['Ordnungstipp: In deiner Tasche gibt es einen Knopf „Sortieren“.', 'Ein Klick – und alles liegt ordentlich nebeneinander. Herrlich.'],
  ['Ordnungstipp: Was du nicht brauchst, kommt in die Verkaufskiste vor deinem Haus.', 'Platz schaffen UND Sternchen verdienen. Zwei Fliegen, eine Klappe.'],
  ['Ordnungstipp: Äste und Steine nicht herumliegen lassen!', 'An Opas Werkbank wird daraus ein Hocker, ein Zaun oder ein Gartenweg.'],
  ['Ordnungstipp: Beim Einrichten – Taste G – drehst du Möbel mit R.', 'Gerade ausgerichtet sieht alles gleich doppelt so schön aus.'],
  ['Ordnungstipp: Das Sammelbuch – Taste B – ist wie ein Aktenordner.', 'Jeder Fisch und jeder Käfer bekommt seinen eigenen Platz. Sehr befriedigend.'],
  ['Ordnungstipp: Ein Hochbeet im Garten bringt zwei Pflanzplätze mehr.', 'Und man muss sich nicht so bücken. Mein Rücken sagt Danke.'],
  ['Ordnungstipp: Regen gießt dein Beet gleich mit.', 'Und an trockenen Tagen schau ich abends vorbei und gieße, was noch durstig ist. Abends verdunstet weniger. Logisch.'],
  ['Ordnungstipp: Sternchen, die du gerade nicht brauchst, gehören aufs Sparbuch bei Olaf.', 'Am Monatsanfang gibt es sogar ein bisschen Zinsen. Er erklärt dir das gern. Sehr ausführlich.'],
  ['Ordnungstipp: Wand-Deko hängt an der Wand – darunter darf trotzdem ein Möbel stehen.', 'Platz doppelt genutzt. So mag ich das.'],
  ['Ordnungstipp: Teppiche zuerst legen, dann die Möbel draufstellen.', 'Das ist die richtige Reihenfolge. Immer.'],
  ['Ordnungstipp: Beim Blumenpflücken fällt manchmal ein Samenkorn ab.', 'Gleich wieder einpflanzen – dann bleibt das Beet nie leer.'],
  ['Ordnungstipp: Pflanz zwei Farben derselben Blume nebeneinander – zum Beispiel rote und gelbe Tulpen.','Wenn beide blühen und du eine pflückst, fällt manchmal ein Misch-Same ab. Das Sammelbuch hat einen Reiter für jede Farbe.'],
  ['Ordnungstipp: Obstbäume tragen nach drei Tagen wieder.', 'Ich schreib mir das immer in den Kalender. Mit Farbe für jede Obstsorte.'],
  ['Ordnungstipp: Muscheln am Strand liegen jeden Tag an anderen Stellen.', 'Einmal am Morgen ablaufen, und du hast sie alle. Systematisch, von links nach rechts.'],
  ['Ordnungstipp: Felsen kann man einmal am Tag abklopfen.', 'Ich mach mir dafür eine Runde. Immer dieselbe. Dann vergess ich keinen.'],
];
