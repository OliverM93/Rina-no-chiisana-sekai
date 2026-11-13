/**
 * Thalia – Linas beste Freundin. Geografin von Beruf (Karten, Reisen), aber ihr Herz gehört dem Sport und dem
 * Feiern: Sie geht leidenschaftlich gern ins Fitnessstudio (am liebsten mit Lina), tanzt in Clubs und auf
 * Hauspartys, und samstagabends schmeißt sie eine Party auf dem Dorfplatz. Herzlich, energiegeladen, lacht gern laut.
 * Steine & Fossilien sind nur ein Nebenbei (die Schaufel schenkt sie Lina, mehr nicht) – bitte nicht überbetonen.
 */
import { LOOKS } from './looks';
import { STYLE_ARRIVAL_LINES } from '../catalog';
import type { NpcDef } from './types';

const WIESE = { x: 4, y: 20, w: 14, h: 8 };
const STRAND = { x: 30, y: 30, w: 16, h: 3 };
const OSTEN = { x: 40, y: 24, w: 14, h: 6 };

export const THALIA: NpcDef = {
  id: 'thalia',
  name: 'Thalia',
  personality: 'beste Freundin, Geografin, Fitnessstudio (gern mit Lina), Partys in Clubs & Hauspartys, herzlich & energiegeladen',
  appearance: LOOKS.thalia,
  home: 'haus-thalia',
  movesIn: 'thaliaEingezogen',
  birthday: { day: 11, month: 8 },
  birthdayLines: {
    greeting: ['Lina!!! Heute ist mein Geburtstag! 🎉', 'Ich bin offiziell ein Jahr älter und trotzdem fit wie nie. Frag nicht nach dem Muskelkater.', 'Heute Abend gibt es Kuchen, Musik und eine Tanzfläche. Mit Konfetti!'],
    thanks: ['NEIN! Für mich?! 🥹', 'Das kommt sofort an meine Wand. Ganz vorne. Mit Lichterkette drum.'],
  },
  schedule: [
    { from: '00:00', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
    { from: '08:30', label: 'macht sich einen Smoothie', activity: { kind: 'zuhause' } },
    { from: '10:00', label: 'joggt am Strand', activity: { kind: 'spazieren', area: STRAND } },
    { from: '12:30', label: 'Mittagspause zu Hause', activity: { kind: 'zuhause' } },
    { from: '13:30', label: 'dehnt sich auf der Wiese', activity: { kind: 'spazieren', area: WIESE } },
    { from: '15:00', label: 'läuft eine Runde im Osten', activity: { kind: 'spazieren', area: OSTEN } },
    { from: '18:00', label: 'sucht ein Outfit für Samstag', activity: { kind: 'zuhause' } },
    { from: '23:30', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
  ],
  preferences: {
    loves: ['crepes', 'obstsalat', 'kraeutermischung', 'glitzerstein', 'strauss-sonne', 'strauss-mischfarben', 'strauss-bunt', 'sonnenblume'],
    likes: ['stein', 'ammonit', 'seestern', 'schneckenhaus', 'trilobit', 'bernstein', 'amethyst', 'bergkristall', 'pfirsich', 'apfelkuchen', 'prachtlibelle', 'pfefferminztee', 'tomatensalat', 'ratatouille', 'kuerbissuppe', 'strauss-schwarz', 'strauss-lavendel'],
    dislikes: ['ohrenqualle', 'weinbergschnecke'],
  },
  dialogue: {
    greetings: [
      { text: ['Na endlich bist du da! 🎶', 'Komm, Lina, die Tanzfläche wartet!'], when: { tags: ['party'] }, weight: 8 },
      { text: ['Lina! 🤗', 'Guten Morgen, Süße! Ich war schon laufen. Unterwegs lag ein Schuh, der aussah wie Winston. Ich hab ihn begrüßt.'], when: { phases: ['morgendaemmerung', 'morgen'] } },
      { text: ['Heyyy, Lina!', 'Na, Lust auf ein kleines Abenteuer? Ich hab da eine Stelle gesehen, da MUSS was im Boden sein.'] },
      { text: ['Da ist ja meine Lieblingsperson!', 'Komm her, Umarmung. Sofort. Das ist ein Befehl.'] },
      { text: ['Lina! Rate mal, wie viele Kniebeugen ich heute schon gemacht hab.', '… Falsch, mehr! Aber frag lieber nicht, wie ich die Treppe runterkomme.'] },
      { text: ['Na, du?', 'Ich hab den Sonnenuntergang vermessen. Wunderschön, mit einer Abweichung von null.'], when: { phases: ['abend', 'abenddaemmerung'] } },
      { text: ['Happy Birthday, meine Liebste! 🎂🎉', 'Heute Abend wird gefeiert – Musik, Tanzen, Konfetti. Keine Widerrede!'], when: { tags: ['geburtstag-lina'] }, weight: 10 },
      { text: ['Regen! Perfektes Wetter fürs Studio.', '… Und für Kuscheldecke und Tee. In der Reihenfolge: erst Studio, dann Kuscheldecke.'], when: { tags: ['wetter-regen'] }, weight: 3 },
      { text: ['Heute ist Party-Abend! 💃', 'Ab sieben auf dem Dorfplatz. Komm unbedingt – ich hab eine Playlist gemacht. Drei Stunden. Nur Bangers.'], when: { weekdays: [6] }, weight: 4 },
    ],
    chat: [
      { text: ['Ich war heute früh im Studio. Beintag.', 'Ich kann offiziell keine Treppen mehr. Rückwärts geht. Frag nicht.'] },
      { text: ['Wusstest du, dass Flüsse immer den bequemsten Weg nehmen?', 'Wie ich am Sonntagmorgen. Vom Bett zur Kaffeemaschine. Und zurück.'] },
      { text: ['Hast du die Wolken heute gesehen?', 'Die eine sah aus wie Winston. Die andere wie Winston mit Hut.'] },
      { text: ['Ich hab beschlossen, heute mutig zu sein.', 'Ich hab Oma gefragt, wie alt sie ist. Sie hat gesagt: „Älter als dein Fitnessarmband.“ Das war … ein guter Konter. Ich hab nicht widersprochen.'] },
      { text: ['Kartenzeichnen ist wie Malen, nur mit mehr Linealen.', 'Und weniger Ärger, wenn man daneben malt. Dann ist es halt eine neue Insel.'] },
      { text: ['Weißt du, was ich an dir mag?', 'Du kommst mit ins Studio, auch wenn du lieber auf dem Sofa liegen würdest. Und danach lachst du trotzdem. Das schaffen nicht viele.'], when: { minHearts: 1 } },
      { text: ['Horrorfilmabend bei dir? Ich bring Chips mit!', 'Und diesmal schreie ich nicht. … Okay, vielleicht ein bisschen. Aber nur bei den guten Stellen.'] },
      { text: ['Hast du die neue True-Crime-Folge gesehen?!', 'Ich hätte sofort gewusst, dass es der Hund war. Ich hab da so ein Gespür. Geografisch.'] },
      { text: ['Na endlich bist du da! 🎶', 'Komm, Lina, die Tanzfläche wartet!'], when: { tags: ['party'] }, weight: 8 },
      { text: ['Letztes Wochenende im Club: Bass bis morgens, Füße kaputt, Seele repariert.', 'Ich hab zwei Paar Schuhe durchgetanzt. Fast. Eins hat nur ein Loch.'] },
      { text: ['Ich hab eine Karte von {dorf} gezeichnet.', 'Mit allen Bäumen, allen Felsen und einem kleinen Herz da, wo du wohnst.'] },
      { text: ['Weißt du, was ich am Reisen liebe?', 'Jede Stadt hat ihren Club und ihr Studio. Ich teste beides. Und die Bäckerei dazwischen.'] },
      { text: ['Wenn du irgendwo Risse im Boden siehst – grab mal mit der Schaufel!', 'Da steckt oft was drin. Mal was Hübsches, mal ein sehr alter Kronkorken. Ist wie Überraschungsei.'] },
      { text: ['Der Strand hier ist perfekt zum Laufen.', 'Barfuß im Sand: Wadentraining für Fortgeschrittene. Und die Aussicht gibt es gratis dazu.'] },
      { text: ['Jens hat mir aus Kyoto Räucherstäbchen mitgebracht.', 'Er hat gesagt, sie haben „Zen-Energie“. Ich zünde sie nach dem Training an. Wirkt tatsächlich!'], when: { tags: ['jens-da'] } },
      { text: ['Lars hat mich gefragt, ob ich auch mal Pause mache.', 'Ich hab gesagt: Samstag, 19 Uhr. Party. Er hat „ärztlich genehmigt“ gesagt. Ich glaub, er war nett.'], when: { tags: ['lars-da'] } },
      { text: ['Oli und ich haben gestern über Trainingspläne diskutiert.', 'Er sagt: Beine nicht auslassen. Ich sage: Ich lasse nie Beine aus. Das war der Moment, in dem wir Freunde wurden.'], when: { tags: ['oli-da'] } },
      { text: ['Weißt du noch, als wir uns kennengelernt haben?', 'Wir haben sofort zusammen gelacht. Über was, weiß ich gar nicht mehr. Aber es war das beste Lachen.'], when: { minHearts: 2 } },
      { text: ['Du bist die beste Freundin, die man sich wünschen kann.', 'Wenn du ein Lied wärst, wärst du der Song, bei dem alle die Arme hochreißen.'], when: { minHearts: 3 } },
      { text: ['Im Frühling wollen plötzlich alle laufen gehen.', 'Ich war schon im Januar dabei. Ich hab Anspruch auf den ersten Waldweg.'], when: { seasons: ['fruehling'] } },
      { text: ['Im Sommer ist Open-Air-Saison! Festival, Sonnenbrand, matschige Schuhe.', 'Und trotzdem das beste Wochenende des Jahres. Wie jedes Jahr.'], when: { seasons: ['sommer'] } },
      { text: ['Im Herbst ziehen die Partys nach drinnen: Hauspartys!', 'Decken, Teelichter, laute Musik und Nachbarn, die klopfen. Perfekt.'], when: { seasons: ['herbst'] } },
      { text: ['Im Winter ist mein Programm: Studio, Sauna, Kakao. In der Reihenfolge.', 'Und dann eine Hausparty mit Lichterketten. Bei Kälte tanzt man schneller.'], when: { seasons: ['winter'] } },
      { text: ['Gewitter! ⚡', 'Ich zähle die Sekunden zwischen Blitz und Donner. Drei Sekunden: ein Kilometer. Und danach: Kakao.'], when: { tags: ['wetter-gewitter'] }, weight: 3 },
      { text: ['Sonne und Wolken im Wechsel – perfektes Laufwetter!', 'Nicht zu heiß, nicht zu nass. Kommst du mit? Ich warte. Ich dehne mich schon.'], when: { tags: ['wetter-wolkig'] } },
      { text: ['Abends such ich mir schon mal das Outfit für Samstag raus.', 'Ja, auch wenn Samstag erst in vier Tagen ist. Man kann nicht früh genug anfangen.'], when: { phases: ['abend', 'abenddaemmerung'] } },
      { text: ['Weißt du, was mein Lieblingsgeräusch ist?', 'Der erste Basston, wenn man in den Club kommt. Das Herz macht sofort mit.'] },
      { text: ['Ich hab mir ein Bingo ausgedacht: Wer nach der Party noch Sport macht, gewinnt.', 'Ich hab noch nie verloren. Das ist Absicht. Und ein bisschen geschummelt.'] },
      { text: ['Eine Sache hab ich gelernt: Man darf nie „nur ein kurzer Spaziergang“ sagen.', 'Sonst steh ich vier Stunden später auf einem Berg und frage mich, wie die Brote hier hochgekommen sind.'] },
      { text: ['Proteinshake oder Smoothie? Ich sag: beides.', 'Und danach Pizza. Das nennt man Ausgleich. Das hab ich im Studio gelernt.'] },
      { text: ['Ich hab heute Morgen beim Joggen einen Igel überholt.', 'Er war schneller als gedacht. Ich bin demütig.'] },
      { text: ['Ich muss dir was gestehen: Ich hab meinen Hanteln Namen gegeben.', 'Gustav, Ingrid und der kleine Dieter. Dieter ist zwei Kilo. Er ist sehr bescheiden.'], when: { minHearts: 1 } },
      { text: ['Wenn du mal traurig bist, ruf mich an.', 'Ich komme mit Keksen, einer Playlist und ein paar Dehnübungen. Das hilft garantiert. Oder macht dich müde. Beides gut.'], when: { minHearts: 2 } },
      { text: ['Weißt du, was das Schönste an Freundschaft ist?', 'Man kann stundenlang nichts sagen und es ist trotzdem das beste Gespräch. Wie die Pause zwischen zwei Songs.'], when: { minHearts: 4 } },
      { text: ['Lina, wann kommst du mal wieder mit ins Fitnessstudio?', 'Wir machen Ganzkörper, danach Smoothie. Und ich hab auch ein neues Lied für die Aufwärmphase. Es hat Bass.'] },
      { text: ['Ich hab gehört, du stemmst bei dir zu Hause auf der Hantelbank?', 'Respekt! Ich schau mal vorbei und spotte dich. Das ist Freundschaft. Und ein kleines bisschen Neid.'], when: { minHearts: 1 } },
      { text: ['Hausparty bei mir? Nur wenn du vorher Chips kaufst.', 'Und Christin darf nicht die Gläser sortieren. Sonst ist die Stimmung weg.'] },
      { text: ['Mein Trainingsplan hängt am Kühlschrank.', 'Direkt neben dem Plan für die nächste Party. Beide sind sehr ehrgeizig.'] },
      { text: ['Wenn wir zusammen trainieren, schaff ich immer einen Satz mehr.', 'Ich weiß nicht, woran es liegt. Ich vermute: Du.'], when: { minHearts: 2 } },
      { text: ['Weißt du noch, unsere Studienreise nach Tschechien?','Eine Woche, Lina und ich, und mein Kartenkoffer. Ich kartiere die Erinnerung bis heute. Die schönsten Stellen sind rot markiert.'] },
      { text: ['Lina, ich weiß, dass du mich verkuppeln willst. Dein Gesicht verrät dich. Immer.','Ich bin gerührt und genervt gleichzeitig. Das ist die beste Mischung.'] },
      { text: ['Lina nach einem Bier ist die beste Lina.','Sie erzählt Witze, die sie nüchtern nie wagen würde. Und lacht am lautesten selbst darüber. Ich liebe das.'] },
      { text: ['Ich spiele ja nicht so viel. Aber wenn Oli und Lars zocken, hol ich Chips.','Und ich kartiere ihre Fehler. Das wird eine sehr dicke Karte.'] },
      { text: ['Olis Freund Mo war letztens dabei, als wir am Strand waren.', 'Der ist … ganz süß. Also, nett. Er ist nett. Und Lina: Ich sehe dein Gesicht. Bitte plane jetzt nichts.'] },
      { text: ['Weißt du noch, Tschechien? In deinem Rucksack war mehr Cola Zero als Wechselwäsche.', 'Ich hab’s kartiert. Gedanklich.'] },
    ],
    gifts: {
      liebt: [['NEIN! Für mich?! 😍', 'Das kommt sofort an meine Wand. Ganz vorne. Mit Etikett: „Von Lina, der Besten“.']],
      mag: [['Oh, wie schön! Danke, Süße!', 'Du kennst mich einfach.']],
      neutral: [['Danke dir!', 'Ich find bestimmt einen Platz dafür. Bei mir ist immer Platz, wenn es von dir kommt.']],
      'mag-nicht': [['Ähm … danke? 😅', 'Das ist … nicht so mein Ding. Aber lieb gemeint!']],
    },
    giftsByItem: {
      stein: ['Ein Kieselstein!', 'Perfekt zum Flitschen. Mein Rekord liegt bei vier Hüpfern. Dein Kiesel schafft fünf, ich spür das.'],
      ammonit: ['Ein Ammonit! 🐚', 'Der ist ja wunderschön. Der kommt sofort ins Regal, gleich neben die Playlist-CDs.'],
    },
    giftRepeat: ['Noch ein Geschenk? Lina! Du bist zu lieb.', 'Dafür gibt\'s auf der nächsten Party eine Extra-Runde Tanzen mit mir.'],
    heartUp: [['Lina …', 'Egal, wohin ich reise – mein Lieblingsort ist da, wo du bist.']],
    atHome: [['Aus dem Haus wummert Musik.', '„Moment! Ich übe den Tanzschritt für Samstag! Der muss sitzen!“']],
    atHomeSleeping: [['Alles still.', 'An der Tür hängt ein Zettel: „Nach der Party! Bitte kein Klingeln vor zwölf. Danke! – T.“']],
    goodbye: ['Bis später, Süße! 💚', 'Hab dich lieb!', 'Tschüssi! Und denk dran: Samstag, 19 Uhr!'],
  },
  letters: [
    { id: 'tasse-berlin', subject: 'Ein Mitbringsel aus Berlin', body: 'Süße,\n\nich war übers Wochenende in Berlin – Club, Bass bis morgens, danach zwölf Stunden Schlaf. Auf dem Weg zum Bahnhof hab ich dir diese Tasse gekauft. Ich weiß ja, dass du sammelst!\n\nSie hat noch ein bisschen Konfetti am Henkel. Das ist Absicht.\n\nThalia 💚', gift: { itemId: 'tasse-stadt-berlin', count: 1 } },
    { id: 'tasse-reykjavik', subject: 'Von der Insel aus Feuer und Eis', body: 'Lina!!!\n\nich bin gerade von meiner Island-Reise zurück. Vulkane! Geysire! Heiße Quellen nach dem Wandern – und abends eine Party in einer winzigen Bar, die lauter war als jeder Vulkan!\n\nIch hab dir eine Tasse mitgebracht. Mit Papageitaucher. Ist wichtig.\n\nThalia 🌋', gift: { itemId: 'tasse-stadt-reykjavik', count: 1 } },
    { id: 'karte', subject: 'Eine Schatzkarte!', body: 'Lina!\n\nich hab eine Schatzkarte für dich gezeichnet. Das X ist … überall, wo du gräbst.\n\nOkay, das ist keine gute Schatzkarte. Aber die Steine hab ich auf dem Rückweg vom Joggen eingesammelt. Echte Qualität!\n\nDeine Thalia 💚', gift: { itemId: 'stein', count: 3 } },
    { id: 'party', subject: 'Party-Erinnerung!', body: 'Süße,\n\nSamstag ist wieder Party auf dem Dorfplatz! Ab 19 Uhr. Bring gute Laune mit. Und Winston. Winston tanzt am besten.\n\nThalia 💃' },
    { id: 'studio', subject: 'Studio? Studio!', body: 'Süße,\n\nich hab gestern im Studio eine neue Beinpresse entdeckt. Sie ist größer als mein Auto. Ich bin verliebt.\n\nKomm doch mal mit! Danach gibt es einen Smoothie. Und ich lade dich zu einer Runde auf dem Crosstrainer ein. Ein Angebot, das du nicht ablehnen kannst.\n\nThalia 💪' },
  ],
  heartLetters: {
    1: { id: 'herz-1', subject: 'Wegweiser für den Garten', body: 'Lina!\n\nBei meinen Trail-Läufen markieren Wanderer den Weg mit Steinmännchen: flache Kiesel übereinander – und ganz oben etwas Funkelndes.\n\nIch hab dir aufgeschrieben, wie man eins baut. Für deinen Garten. Damit ich nach der Party immer zu dir finde.\n\nDeine Thalia', gift: { itemId: 'rezept-steinmaennchen', count: 1 } },
    2: { id: 'herz-2', subject: 'Für deine Schätze', body: 'Lina,\n\neine kleine Vitrine! Für Funde aus dem Garten, Eintrittsbändchen, Fotos von unseren Abenden und alles, was du nicht wegwerfen willst.\n\nPlatz ist für alles da. Auch für das Konfetti.\n\nDeine Thalia', gift: { itemId: 'vitrine', count: 1 } },
    3: { id: 'herz-3', subject: 'Kartiert!', body: 'Lina,\n\nich hab unser Dorf aufgezeichnet. Ganz unwissenschaftlich, mit Schritten und Bauchgefühl. Fluss, Strand, Brücke, alle Häuser – und die Laufstrecke.\n\nUnd da, wo du wohnst, ist ein Herz. Das ist kein offizielles Kartensymbol.\n\nSollte es aber sein.\n\nDeine Thalia 🗺️', gift: { itemId: 'wandkarte-thalia', count: 1 } },
    4: { id: 'herz-4', subject: 'Unsere Welt', body: 'Lina,\n\nich hab dir einen Globus geschenkt. Auf dem hab ich alle Orte markiert, an die ich mit dir noch reisen will: Städte mit guten Clubs, Festivals, Strände zum Laufen.\n\nEs sind ziemlich viele Markierungen. Fast alle.\n\nDeine Thalia 🌍', gift: { itemId: 'globus', count: 1 } },
    5: { id: 'herz-5', subject: 'Benannt nach dir', body: 'Lina,\n\nich hab beim Joggen am Strand einen Ammoniten gefunden. Den schönsten, den ich je gesehen hab – er schimmert in allen Farben.\n\nIch hab ihn „Lina“ getauft. Offiziell darf man das nicht. Ist mir egal.\n\nEr ist 150 Millionen Jahre alt. Unsere Freundschaft fühlt sich manchmal genauso an: als gäbe es sie schon immer. Im guten Sinn!\n\nDeine Thalia', gift: { itemId: 'ammonit-lina', count: 1 } },
  },
};

export const THALIA_ANNOUNCEMENT = {
  id: 'einzug',
  subject: 'Ich zieh zu dir ins Dorf! 🌍',
  body: 'Lina!!!\n\nich hab ein Häuschen in {dorf} gefunden! Ganz in der Nähe vom Strand – perfekt zum Joggen.\n\nIch bin schon auf dem Weg! Mit meinen Hanteln, meiner Playlist und ganz viel Party-Laune.\n\nDeine Thalia 💚',
};

export const THALIA_WELCOME: readonly string[] = [
  'LINAAA! 🤗',
  'Ich wohn jetzt hier! Das gelbe Häuschen hinter der Brücke.',
  'Und schau mal – ich hab dir was mitgebracht.',
  'Eine Schaufel! Wenn du im Boden kleine Risse siehst, grab mal dort. Da steckt manchmal was Hübsches drin.',
  'Und eine Karte von {dorf}, frisch gezeichnet. Mit der Taste M kannst du sie dir jederzeit anschauen.',
  'Ach ja: Samstags ab 19 Uhr ist Party auf dem Dorfplatz. Pflichttermin! … Na gut, kein Pflichttermin. Aber komm!',
  'Und wenn du Lust auf Sport hast: Ich geh oft ins Studio. Komm einfach mit, ich spotte dich!',
  STYLE_ARRIVAL_LINES.thalia,
];

export const PARTY_LINES: readonly (readonly string[])[] = [
  ['Party-Zeit! 💃🎶', 'Komm, Lina, tanz mit mir! Keine Sorge, ich tanz noch schlechter als du.'],
  ['Schau mal, alle sind da!', 'Oma tanzt mit Jens. Lars macht den Robot. Und Winston … Winston hat den Takt im Blut!'],
  ['Das ist der beste Abend!', 'Weißt du was? Jeder Abend mit dir ist der beste Abend.'],
];
