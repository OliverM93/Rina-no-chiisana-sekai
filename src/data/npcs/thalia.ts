/**
 * Thalia – Linas beste Freundin. Geografin mit Leib und Seele: zeichnet Karten,
 * sammelt Gesteine & Fossilien, und samstagabends schmeißt sie eine Party auf dem
 * Dorfplatz. Herzlich, abenteuerlustig, lacht gern laut.
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
  personality: 'beste Freundin, Geografin, Karten, Gesteine & Fossilien, Partys, herzlich & abenteuerlustig',
  appearance: LOOKS.thalia,
  home: 'haus-thalia',
  movesIn: 'thaliaEingezogen',
  birthday: { day: 11, month: 8 },
  birthdayLines: {
    greeting: ['Lina!!! Heute ist mein Geburtstag! 🎉', 'Ich bin offiziell 100 Millionen Jahre jung. Okay, nicht ganz. Aber gefühlt.', 'Heute Abend gibt es Kuchen in Gesteinsform. Mit Schichten!'],
    thanks: ['NEIN! Für mich?! 🥹', 'Das kommt sofort in meine Vitrine. Neben den Ammoniten. Die sind eifersüchtig.'],
  },
  schedule: [
    { from: '00:00', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
    { from: '08:30', label: 'zeichnet Karten', activity: { kind: 'zuhause' } },
    { from: '10:00', label: 'sucht Steine am Strand', activity: { kind: 'spazieren', area: STRAND } },
    { from: '12:30', label: 'Mittagspause zu Hause', activity: { kind: 'zuhause' } },
    { from: '13:30', label: 'vermisst die Wiese', activity: { kind: 'spazieren', area: WIESE } },
    { from: '15:00', label: 'erkundet den Osten', activity: { kind: 'spazieren', area: OSTEN } },
    { from: '18:00', label: 'sortiert ihre Sammlung', activity: { kind: 'zuhause' } },
    { from: '23:30', label: 'schläft', activity: { kind: 'zuhause', sleeping: true } },
  ],
  preferences: {
    loves: ['glitzerstein', 'ammonit', 'trilobit', 'bernstein', 'amethyst', 'crepes', 'kraeutermischung', 'strauss-sonne', 'strauss-mischfarben'],
    likes: ['stein', 'seestern', 'schneckenhaus', 'haizahn', 'rosenquarz', 'bergkristall', 'achat', 'versteinertes-holz', 'pfirsich', 'apfelkuchen', 'sonnenblume', 'prachtlibelle', 'pfefferminztee', 'tomatensalat', 'ratatouille', 'kuerbissuppe', 'strauss-bunt', 'strauss-schwarz', 'strauss-lavendel'],
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
      { text: ['Ich hab mir einen neuen Stein-Namen ausgedacht: „Linait“.', 'Er ist rund, ein bisschen funkelig und total liebenswert. Kein Zusammenhang mit irgendwem.'] },
      { text: ['Wusstest du, dass Flüsse immer den bequemsten Weg nehmen?', 'Wie ich am Sonntagmorgen. Vom Bett zur Kaffeemaschine. Und zurück.'] },
      { text: ['Hast du die Wolken heute gesehen?', 'Die eine sah aus wie Winston. Die andere wie Winston mit Hut.'] },
      { text: ['Ich hab beschlossen, heute mutig zu sein.', 'Ich hab Oma gefragt, wie alt sie ist. Sie hat gesagt: „Älter als deine Steine.“ Das war … geologisch unwahrscheinlich, aber ich hab nicht widersprochen.'] },
      { text: ['Kartenzeichnen ist wie Malen, nur mit mehr Linealen.', 'Und weniger Ärger, wenn man daneben malt. Dann ist es halt eine neue Insel.'] },
      { text: ['Weißt du, was ich an dir mag?', 'Du hörst zu, wenn ich zwanzig Minuten über Sedimentschichten rede. Das schaffen nicht viele.'], when: { minHearts: 1 } },
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
      { text: ['Im Frühling ist der Boden am spannendsten.', 'Alles Verborgene kommt hoch: Wurzeln, Steinchen, Schneeglöckchen. Und mein Gartenzwerg. Den hatte ich im Herbst verloren.'], when: { seasons: ['fruehling'] } },
      { text: ['Im Sommer sind die Steine morgens kühl und mittags heiß.', 'Ich teste das mit der Hand. Wissenschaft hat auch mal Brandblasen.'], when: { seasons: ['sommer'] } },
      { text: ['Der Herbst ist die Jahreszeit der Sedimente, finde ich.', 'Alles legt sich ab: Blätter, Gedanken, Pullis. Schichtweise. Ich liebe es.'], when: { seasons: ['herbst'] } },
      { text: ['Im Winter gibt es wenig Fossilien zu finden, aber viel Zeit für Karten.', 'Ich hab jetzt eine vom Dorf bei Schnee. Sieht aus wie ein Zuckerguss.'], when: { seasons: ['winter'] } },
      { text: ['Gewitter! ⚡', 'Ich zähle die Sekunden zwischen Blitz und Donner. Drei Sekunden: ein Kilometer. Und danach: Kakao.'], when: { tags: ['wetter-gewitter'] }, weight: 3 },
      { text: ['Sonne und Wolken im Wechsel – perfekte Wanderkulisse!', 'Ich nehm einen Rucksack, zwei Brote und eine Landkarte mit. Du auch? Ich warte.'], when: { tags: ['wetter-wolkig'] } },
      { text: ['Abends sortiere ich meine Funde nach Farbe.', 'Nicht nach Wert. Nach Farbe. Das ist dann eher Kunst als Wissenschaft. Ich lasse beides gelten.'], when: { phases: ['abend', 'abenddaemmerung'] } },
      { text: ['Hast du schon mal einen Stein angehört?', 'Nein, ernsthaft: Ein Ammonit klingt am Ohr wie das Meer. Auch wenn es nicht stimmt. Es ist trotzdem schön.'] },
      { text: ['Ich hab mir überlegt, ein Fossilien-Memory zu basteln.', 'Zwölf Paare. Die Regel: Wer verliert, muss den Gewinner zum Essen einladen. Ich habe noch nie verloren. Das ist Absicht.'] },
      { text: ['Eine Sache hab ich gelernt: Man darf nie „nur ein kurzer Spaziergang“ sagen.', 'Sonst steh ich vier Stunden später auf einem Berg und frage mich, wie die Brote hier hochgekommen sind.'] },
      { text: ['Hast du mal darüber nachgedacht, dass unser Dorf auch mal Meeresboden war?', 'Vor ganz, ganz langer Zeit. Wir wohnen also quasi im Aquarium. Ohne Wasser. Und mit Kaffee.'] },
      { text: ['Ich hab heute Morgen einen Stein umgedreht und fünf Asseln erschreckt.', 'Ich hab mich entschuldigt. Sie haben nicht geantwortet. Das ist okay.'] },
      { text: ['Ich muss dir was gestehen: Ich hab meine Lieblingssteine benannt.', 'Gustav, Ingrid und der kleine Dieter. Dieter ist ein Kiesel. Er ist sehr bescheiden.'], when: { minHearts: 1 } },
      { text: ['Wenn du mal traurig bist, ruf mich an.', 'Ich komme mit Keksen, Landkarte und einer Geschichte über Gesteinsfaltung. Das hilft garantiert. Oder macht dich müde. Beides gut.'], when: { minHearts: 2 } },
      { text: ['Weißt du, was das Schönste an Freundschaft ist?', 'Man kann stundenlang nichts sagen und es ist trotzdem das beste Gespräch. Wie bei Gesteinsschichten.'], when: { minHearts: 4 } },
      { text: ['Weißt du noch, unsere Studienreise nach Tschechien?','Eine Woche, Lina und ich, und mein Kartenkoffer. Ich kartiere die Erinnerung bis heute. Die schönsten Stellen sind rot markiert.'] },
      { text: ['Lina, ich weiß, dass du mich verkuppeln willst. Dein Gesicht verrät dich. Immer.','Ich bin gerührt und genervt gleichzeitig. Das ist die beste Mischung.'] },
      { text: ['Lina nach einem Bier ist die beste Lina.','Sie erzählt Witze, die sie nüchtern nie wagen würde. Und lacht am lautesten selbst darüber. Ich liebe das.'] },
      { text: ['Ich spiele ja nicht so viel. Aber wenn Oli und Lars zocken, hol ich Chips.','Und ich kartiere ihre Fehler. Das wird eine sehr dicke Karte.'] },
      { text: ['Olis Freund Mo war letztens dabei, als wir am Strand waren.', 'Der ist … ganz süß. Also, nett. Er ist nett. Und Lina: Ich sehe dein Gesicht. Bitte plane jetzt nichts.'] },
      { text: ['Weißt du noch, Tschechien? In deinem Rucksack war mehr Cola Zero als Wechselwäsche.', 'Ich hab’s kartiert. Gedanklich.'] },
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
    { id: 'tasse-berlin', subject: 'Ein Mitbringsel aus Berlin', body: 'Süße,\n\nich war auf einer Tagung in Berlin – drei Tage Gesteinskunde, ich bin verzückt. Und auf dem Rückweg hab ich dir diese Tasse gekauft. Ich weiß ja, dass du sammelst!\n\nSie hat noch ein bisschen Gesteinsstaub am Henkel. Das ist Absicht.\n\nThalia 💚', gift: { itemId: 'tasse-stadt-berlin', count: 1 } },
    { id: 'tasse-reykjavik', subject: 'Von der Insel aus Feuer und Eis', body: 'Lina!!!\n\nich bin gerade von meiner Island-Exkursion zurück. Vulkane! Geysire! Ein Papageitaucher hat mir ins Notizbuch geguckt!\n\nIch hab dir eine Tasse mitgebracht. Mit Papageitaucher. Ist wichtig.\n\nThalia 🌋', gift: { itemId: 'tasse-stadt-reykjavik', count: 1 } },
    { id: 'karte', subject: 'Eine Schatzkarte!', body: 'Lina!\n\nich hab eine Schatzkarte für dich gezeichnet. Das X ist … überall, wo du gräbst.\n\nOkay, das ist keine gute Schatzkarte. Aber die Steine sind echt!\n\nDeine Thalia 💚', gift: { itemId: 'stein', count: 3 } },
    { id: 'party', subject: 'Party-Erinnerung!', body: 'Süße,\n\nSamstag ist wieder Party auf dem Dorfplatz! Ab 19 Uhr. Bring gute Laune mit. Und Winston. Winston tanzt am besten.\n\nThalia 💃' },
  ],
  heartLetters: {
    1: { id: 'herz-1', subject: 'Wegweiser aus Stein', body: 'Lina!\n\nWeißt du, wie Wanderer in den Bergen den Weg markieren? Mit Steinmännchen! Flache Kiesel übereinander – und ganz oben etwas Funkelndes.\n\nIch hab dir aufgeschrieben, wie man eins baut. Für deinen Garten. Damit ich immer zu dir finde.\n\nDeine Thalia', gift: { itemId: 'rezept-steinmaennchen', count: 1 } },
    2: { id: 'herz-2', subject: 'Für deine Sammlung', body: 'Lina,\n\neine kleine Vitrine für deine Funde! Damit deine Fossilien auch so schön ausgestellt sind wie meine.\n\nNa gut, fast so schön.\n\nDeine Thalia', gift: { itemId: 'vitrine', count: 1 } },
    3: { id: 'herz-3', subject: 'Kartiert!', body: 'Lina,\n\nich hab unser Dorf vermessen. Ganz unwissenschaftlich, mit Schritten und Bauchgefühl. Fluss, Strand, Brücke, alle Häuser.\n\nUnd da, wo du wohnst, ist ein Herz. Das ist kein offizielles Kartensymbol.\n\nSollte es aber sein.\n\nDeine Thalia 🗺️', gift: { itemId: 'wandkarte-thalia', count: 1 } },
    4: { id: 'herz-4', subject: 'Unsere Welt', body: 'Lina,\n\nich hab dir einen Globus geschenkt. Auf dem hab ich alle Orte markiert, an die ich mit dir noch reisen will.\n\nEs sind ziemlich viele Markierungen. Fast alle.\n\nDeine Thalia 🌍', gift: { itemId: 'globus', count: 1 } },
    5: { id: 'herz-5', subject: 'Benannt nach dir', body: 'Lina,\n\nich hab am Strand einen Ammoniten gefunden. Den schönsten, den ich je gesehen hab – er schimmert in allen Farben.\n\nIch hab ihn „Lina“ getauft. Wissenschaftlich darf man das so nicht machen. Ist mir egal.\n\nEr ist 150 Millionen Jahre alt. Unsere Freundschaft fühlt sich manchmal genauso an. Im guten Sinn!\n\nDeine Thalia', gift: { itemId: 'ammonit-lina', count: 1 } },
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
  STYLE_ARRIVAL_LINES.thalia,
];

export const PARTY_LINES: readonly (readonly string[])[] = [
  ['Party-Zeit! 💃🎶', 'Komm, Lina, tanz mit mir! Keine Sorge, ich tanz noch schlechter als du.'],
  ['Schau mal, alle sind da!', 'Oma tanzt mit Jens. Lars macht den Robot. Und Winston … Winston hat den Takt im Blut!'],
  ['Das ist der beste Abend!', 'Weißt du was? Jeder Abend mit dir ist der beste Abend.'],
];
