/**
 * Gemeinsame Unternehmungen: je Bewohner ein kleines, beliebig wiederholbares Minispiel.
 * Gedacht für den Moment, in dem die Tagessachen gesammelt sind und man trotzdem noch Lust hat.
 * Kein Scheitern (das Ergebnis wählt nur den Abschluss-Satz), Herzen höchstens einmal am Tag je Person,
 * beim ersten Mal ein Eintrag im Album. Logik `core/unternehmungen.ts` + `game/unternehmungen.ts`.
 */
import type { Rank, SumoLevel } from '../core/unternehmungen';

export type GameKind = 'memory' | 'puzzle' | 'takt' | 'duell' | 'sumo' | 'quiz' | 'malen';

/** Ein Level im Pfeil-Duell: wird mit jedem Level schwieriger */
export interface DuelLevel {
  boss: string;
  /** Anzahl Pfeile */
  length: number;
  /** Sekunden je Pfeil */
  window: number;
  /** Anteil roter Umkehr-Pfeile (Gegenrichtung drücken) */
  reverse: number;
}

export interface QuizQuestion {
  q: string;
  answers: readonly [string, string, string];
  /** Index der richtigen Antwort */
  right: 0 | 1 | 2;
}

export interface UnternehmungDef {
  id: string;
  npc: string;
  /** Menüpunkt im Gespräch */
  label: string;
  /** Fenstertitel */
  title: string;
  game: GameKind;
  /** Was die Person vorher sagt (eine Variante je Tag) */
  intro: readonly (readonly string[])[];
  /** Was die Person danach sagt, je nach Ergebnis */
  done: Readonly<Record<Rank, readonly (readonly string[])[]>>;
  /** Wenn Lina ihren eigenen Rekord bricht */
  record: readonly string[];
  /** Erstes Mal: Eintrag im Album (Lina erzählt) */
  album: string;
  /** Kleine Zwischenrufe während des Spiels */
  cheers: readonly string[];
  memory?: { symbols: readonly string[] };
  puzzle?: { picture: readonly string[] };
  takt?: { reps: number; period: number };
  /** Pfeil-Duell in Leveln; das nächste wird mit mindestens 60 % Treffern freigeschaltet */
  duell?: { levels: readonly DuelLevel[]; unlocked: readonly string[] };
  /** Kissen-Sumo in Leveln (Sumo-Ränge); das nächste wird mit einem gewonnenen Match freigeschaltet */
  sumo?: { opponent: string; levels: ReadonlyArray<SumoLevel & { name: string }>; unlocked: readonly string[]; win: readonly string[]; lose: readonly string[] };
  quiz?: { questions: readonly QuizQuestion[]; count: number; right: readonly string[]; wrong: readonly string[] };
  malen?: {
    motifs: ReadonlyArray<{ id: string; label: string; verdict: string }>;
    palettes: ReadonlyArray<{ id: string; label: string; verdict: string }>;
  };
}

export const UNTERNEHMUNGEN: readonly UnternehmungDef[] = [
  {
    id: 'memory-oma',
    npc: 'gisela',
    label: '🃏 Memory mit Oma',
    title: 'Memory mit Oma Gisela',
    game: 'memory',
    memory: { symbols: ['🍪', '☕', '🧶', '🌹', '🐚', '🕊️'] },
    intro: [
      ['Memory? Kindchen, ich hab ein Gedächtnis wie ein Elefant.', 'Ich weiß sogar noch, was der Bäcker 1987 für ein Brötchen wollte. Unverschämt.'],
      ['Setz dich. Ich misch. Und guck nicht so, ich schummle nicht.', '… Fast nie.'],
      ['Ludwig hat immer verloren. Absichtlich, sagt er. Ich sag: Ausrede.'],
    ],
    cheers: ['„Na, na, na! Die lag doch woanders!“', '„Das hab ich mir gemerkt. Du nicht? Tja.“', '„Köstlich! Ein Paar!“', '„Ich denke da jetzt sehr lange drüber nach.“', '„Pfui, daneben.“'],
    done: {
      super: [
        ['Na sowas! Das hast du von mir.', 'Von deinem Vater jedenfalls nicht. Der vergisst sogar, wo er die Brille hat. Auf der Nase.'],
        ['Kein einziger Fehler zu viel. Ich bin beeindruckt. Und ein bisschen beleidigt.'],
      ],
      gut: [
        ['Gut gespielt, Kindchen. Ich hab natürlich mehr gefunden.', '… Hab ich nicht? Dann hab ich dich gewinnen lassen. Genau.'],
        ['Ordentlich! Noch eine Runde, und ich zieh dir die Hammelbeine lang. Liebevoll.'],
      ],
      gemuetlich: [
        ['Na, das war gemütlich. Hauptsache, wir haben gequatscht.', 'Das Gedächtnis trainiert man am besten mit Keksen. Ich hab noch welche.'],
        ['Das macht nichts. Ich hab auch mal klein angefangen. 1952 war das.'],
      ],
    },
    record: ['So schnell warst du noch nie! Das schreib ich mir auf. Auf einen Zettel. Den verleg ich dann.'],
    album: 'Memory mit Oma: Sie hat behauptet, sie schummelt nicht. Ich habe sie trotzdem dreimal ertappt.',
  },
  {
    id: 'gym-thalia',
    npc: 'thalia',
    label: '💪 Zusammen trainieren',
    title: 'Training mit Thalia',
    game: 'takt',
    takt: { reps: 10, period: 0.9 },
    intro: [
      ['Gym-Date! Endlich! 💪', 'Drück genau dann, wenn der Punkt in der Mitte ist. Wie beim Bankdrücken. Nur ohne Schweiß.'],
      ['Okay, Lina, heute Beine. … Nein, Spaß, heute Rhythmus.', 'Ich zähl mit. Eins, zwei, … ach, du machst das schon.'],
      ['Wer zusammen trainiert, bleibt zusammen. Hab ich mir gerade ausgedacht. Gut, oder?'],
    ],
    cheers: ['„Jaaa, sauber!“', '„Komm, noch eine!“', '„Atmen nicht vergessen!“', '„Genau so!“', '„Locker bleiben, Lina!“'],
    done: {
      super: [
        ['LINA! Das war perfekt! Ich bin richtig stolz auf dich!', 'Heute Abend Party? Wer so trainiert, darf auch tanzen.'],
        ['Wow. Ich hab ehrlich gesagt nicht mitgezählt, weil ich so beeindruckt war.'],
      ],
      gut: [
        ['Richtig gut! Noch ein paar Wochen, und du überholst mich.', 'Na ja. Ein paar Monate.'],
        ['Starke Runde! Wir belohnen uns mit einem Smoothie. Oder Crêpes. Eher Crêpes.'],
      ],
      gemuetlich: [
        ['Hey, Hauptsache bewegt! Und wir haben gelacht. Das zählt doppelt.'],
        ['Das war eine Wohlfühl-Runde. Die gibt es auch im Profisport. Glaube ich.'],
      ],
    },
    record: ['Neuer Bestwert! Ich schreib es an den Spiegel. Mit Lippenstift. Oder Kreide. Lippenstift.'],
    album: 'Training mit Thalia: Sie hat „noch eine!“ gerufen. Zehnmal. Ich habe trotzdem gelacht.',
  },
  {
    id: 'puzzle-christin',
    npc: 'christin',
    label: '🧩 Puzzle legen',
    title: 'Puzzle mit Christin',
    game: 'puzzle',
    puzzle: { picture: ['🌸', '🌼', '🌷', '🌳', '🏡', '🌲', '🌻', '🦋'] },
    intro: [
      ['Ein Puzzle! Da kommt alles an seinen Platz. Das mag ich.', 'Schieb die Teile, bis das Bild stimmt. Ganz in Ruhe.'],
      ['Ich hab das Puzzle extra abgestaubt. Also, zweimal.', 'Oben die Blüten, in der Mitte das Haus zwischen den Bäumen, unten Sonnenblume und Schmetterling.'],
    ],
    cheers: ['„Ordentlich!“', '„Das passt schon viel besser.“', '„Ganz ruhig, Schritt für Schritt.“', '„Sehr schön, das Teil sitzt.“'],
    done: {
      super: [
        ['Perfekt! Jedes Teil am richtigen Platz. So sieht ein schöner Nachmittag aus.'],
        ['Das ging ja ruckzuck! Du hast Ordnung im Blut. Sag das aber nicht deinem Zimmer.'],
      ],
      gut: [
        ['Fertig! Und ganz ohne Krümel. Danke dir.', 'Ich rahm das gleich ein. Natürlich nur im Kopf.'],
        ['Sehr schön. Jetzt noch die Schachtel zurück ins Regal, mit dem Deckel nach oben.'],
      ],
      gemuetlich: [
        ['Geschafft! Hat ein bisschen gedauert, aber dafür war es gemütlich.', 'Und Ordnung braucht eben ihre Zeit.'],
        ['Na also. Am Ende kommt alles an seinen Platz. Wie bei uns im Dorf.'],
      ],
    },
    record: ['So wenige Züge! Das muss ich Olaf erzählen. Er wird ausrechnen wollen, wie viel Prozent das sind.'],
    album: 'Puzzle mit Christin: Am Ende saß jedes Teil, und die Schachtel stand mit dem Deckel nach oben im Regal.',
  },
  {
    id: 'zocken-oli',
    npc: 'oli',
    label: '🎮 Zusammen zocken',
    title: 'Zocken mit Oli',
    game: 'duell',
    duell: {
      levels: [
        { boss: 'Der Schleimkönig', length: 10, window: 1.9, reverse: 0 },
        { boss: 'Der Hohle König', length: 13, window: 1.55, reverse: 0 },
        { boss: 'Die Glockenhexe', length: 15, window: 1.35, reverse: 0.2 },
        { boss: 'Der Drache im Nebel', length: 18, window: 1.15, reverse: 0.3 },
        { boss: 'Der Uralte Ritter', length: 22, window: 0.95, reverse: 0.4 },
      ],
      unlocked: [
        'Nächstes Level freigeschaltet! Lini, wir sind unaufhaltsam.',
        'Wir kommen weiter! Ich hab ehrlich gesagt nicht geglaubt, dass wir hier mal ankommen.',
        'Neues Level! Ich hol schon mal Snacks. Das wird hart.',
      ],
    },
    intro: [
      ['Lini! Couch, Controller, Snacks. Welcher Boss ist heute dran?', 'Drück die Pfeile, die erscheinen. Bei roten Pfeilen die Gegenrichtung! Ich halt dir den Rücken frei.'],
      ['Ich hab gestern geübt. Also … ich bin gestern zwölfmal gestorben.', 'Mit dir schaffen wir das.'],
      ['Zocken mit dir ist das Beste. Du schreist immer so süß, wenn der Boss angreift.'],
    ],
    cheers: ['„Ausweichen, Lini!“', '„Jaaa! Treffer!“', '„Ich hab dich, ich hab dich!“', '„Heilen, heilen!“', '„Das war knapp!“'],
    done: {
      super: [
        ['WIR HABEN IHN! Beim ersten Versuch! Lini, du bist eine Legende!', 'Das muss ich Mo erzählen. Und Lars. Und allen.'],
        ['Perfektes Teamwork. Ich glaub, wir sind das beste Koop-Duo im ganzen Dorf.'],
      ],
      gut: [
        ['Geschafft! Mit nur ein bisschen Panik.', 'Zur Feier hol ich dir eine Cola Zero. Kalt, so wie du sie magst.'],
        ['Boss besiegt! Mein Herz rast. Liegt am Spiel. Oder an dir.'],
      ],
      gemuetlich: [
        ['Okay, der Boss hat gewonnen. Aber nur diese Runde.', 'Ehrlich gesagt war Kuscheln auf der Couch eh der beste Teil.'],
        ['Wir sind gestorben. Gemeinsam. Das ist irgendwie auch romantisch.'],
      ],
    },
    record: ['Neuer Rekord! Lini, du bist besser als ich. Ich bin gleichzeitig stolz und beleidigt.'],
    album: 'Zocken mit Oli: Der erste Boss hatte keine Chance. Oli hat lauter geschrien als ich.',
  },
  {
    id: 'sumo-lars',
    npc: 'lars',
    label: '🤼 Kissen-Sumo',
    title: 'Kissen-Sumo mit Lars',
    game: 'sumo',
    sumo: {
      opponent: 'Lars',
      // Ein Druck im Wechsel schiebt `push`; Lars drückt mit `strength` je Sekunde dagegen (Ring = 2 breit).
      // Level 1 schafft man gemütlich (~4 Drücke/s), Level 5 braucht flinke Finger (~8/s) und hält Stöße aus.
      levels: [
        { name: 'Jonokuchi – Lars im Schlafanzug', strength: 0.2, push: 0.1, growth: 0.03, shove: 0 },
        { name: 'Jonidan – Lars nach dem Mittagessen', strength: 0.28, push: 0.09, growth: 0.03, shove: 0.12 },
        { name: 'Makushita – Lars mit Stirnband', strength: 0.34, push: 0.085, growth: 0.04, shove: 0.16 },
        { name: 'Ōzeki – Lars in Bestform', strength: 0.4, push: 0.08, growth: 0.04, shove: 0.2 },
        { name: 'Yokozuna – Lars, der Unbezwingbare', strength: 0.46, push: 0.078, growth: 0.05, shove: 0.24 },
      ],
      unlocked: [
        'Respekt, Schwesterherz. Nächster Rang! Ich muss mich jetzt ernsthaft aufwärmen.',
        'Du steigst auf! Ich hol mein Stirnband. Und eine Wärmflasche für danach.',
        'Neuer Rang! Langsam glaube ich, du trainierst heimlich mit Thalia.',
      ],
      win: ['Lars fliegt aus dem Ring und landet auf dem Sofakissen. „Das war Absicht. Für die Bandscheibe.“', '„Oshidashi! Herausgeschoben! Schwesterherz, das war Lehrbuch.“', 'Lars rollt rückwärts aus dem Ring. „Ich bin Arzt. Ich weiß, wie man richtig fällt.“'],
      lose: ['Lars schiebt dich sanft aus dem Ring. „Tut mir leid. Nein, tut es nicht. Doch, ein bisschen.“', '„Yorikiri! Rausgedrückt! Aber du hast gekämpft wie eine echte Ozeki.“', 'Du landest auf dem Kissen. Lars: „Diagnose: Lachkrampf. Bei uns beiden.“'],
    },
    intro: [
      ['Kissen-Sumo! Wie im Fernsehen, nur weicher. Der Teppich ist der Ring.', 'Drück abwechselnd ← und →, dann schiebst du mich raus. Gleiche Taste zweimal heißt Ausrutscher.'],
      ['Ich hab heute Sumo geschaut. Die wiegen zweihundert Kilo. Ich nur … weniger. Deutlich.', 'Zwei gewonnene Runden gewinnen. Abwechselnd ← und → drücken!'],
      ['Ärztlicher Hinweis: Nach dem Sumo kein Bier. Vor dem Sumo auch keins. Also … alkoholfrei.', 'Los geht’s: abwechselnd ← und →!'],
    ],
    cheers: ['„Hakkeyoi!“', '„Noch nicht vorbei!“', '„Uff, du drückst ja richtig!“', '„Die Bandscheibe hält. Noch.“', '„Nokotta, nokotta!“'],
    done: {
      super: [
        ['Zwei zu null! Ich ernenne dich hiermit zur Yokozuna des Dorfes.', 'So, und nicht mit e, sonst ist es ein See. … Das passt nicht. Aber ich bin zu erschöpft für einen neuen Spruch.'],
        ['Glatt gewonnen. Ich muss mich jetzt hinlegen. Medizinisch angeordnet. Von mir.'],
      ],
      gut: [
        ['Knapp, aber gewonnen! Ich hab dich die erste Runde gewinnen lassen. … Oder die zweite. Eine davon.'],
        ['Gewonnen! Ich gratuliere. Und ich hol uns jetzt ein Eis. Für die Muskeln.'],
      ],
      gemuetlich: [
        ['Heute war ich der Stärkere. Aber du hast mich zum Lachen gebracht, das zählt doppelt.', 'Revanche jederzeit. Ich bin ein fairer Mensch.'],
        ['Gewonnen hab ich, aber mir tut alles weh. Wer hat jetzt eigentlich gewonnen?'],
      ],
    },
    record: [],
    album: 'Kissen-Sumo mit Lars: Er hat „Hakkeyoi!“ gerufen, ich habe so gelacht, dass ich fast aus dem Ring gefallen bin.',
  },
  {
    id: 'raetsel-olaf',
    npc: 'olaf',
    label: '🧠 Rätselecke',
    title: 'Rätselecke mit Papa',
    game: 'quiz',
    quiz: {
      count: 5,
      right: ['Richtig! Das gibt Zinsen.', 'Korrekt. Ordnungsgemäß beantwortet.', 'Stimmt! Das hast du von mir.', 'Genau! Ich mach einen Haken dran.'],
      wrong: ['Knapp daneben. Aber ehrlich gemeint, das zählt.', 'Nicht ganz. Ich hätte es aber auch nachschlagen müssen.', 'Hm, nein. Aber schön geraten!'],
      questions: [
        { q: 'Wie viele Herzen hat ein Krake?', answers: ['Eins', 'Drei', 'Fünf'], right: 1 },
        { q: 'Welcher Planet ist der Sonne am nächsten?', answers: ['Venus', 'Mars', 'Merkur'], right: 2 },
        { q: 'Wie viele Beine hat eine Spinne?', answers: ['Sechs', 'Acht', 'Zehn'], right: 1 },
        { q: 'Was ist die Hauptstadt von Australien?', answers: ['Canberra', 'Sydney', 'Melbourne'], right: 0 },
        { q: 'Welche ist die größte deutsche Insel?', answers: ['Usedom', 'Sylt', 'Rügen'], right: 2 },
        { q: 'Wie viele Minuten hat ein Tag?', answers: ['1 440', '1 200', '2 400'], right: 0 },
        { q: 'Welches dieser Tiere ist ein Säugetier?', answers: ['Hai', 'Delfin', 'Thunfisch'], right: 1 },
        { q: 'Was misst ein Barometer?', answers: ['Luftdruck', 'Temperatur', 'Windstärke'], right: 0 },
        { q: 'Wie viele Seiten hat ein Sechseck?', answers: ['Fünf', 'Sechs', 'Acht'], right: 1 },
        { q: 'Wie viel sind 15 % von 200?', answers: ['15', '30', '45'], right: 1 },
        { q: 'Aus welchem Land kommt der Camembert?', answers: ['Frankreich', 'Italien', 'Schweiz'], right: 0 },
        { q: 'An welchem Fluss liegt Omas Heimatstadt Dessau?', answers: ['Rhein', 'Donau', 'Mulde'], right: 2 },
        { q: 'Wie viele Zähne hat ein Erwachsener normalerweise?', answers: ['28', '32', '36'], right: 1 },
        { q: 'Welche Farbe entsteht aus Blau und Gelb?', answers: ['Grün', 'Lila', 'Orange'], right: 0 },
        { q: 'Wie lange braucht das Sonnenlicht ungefähr bis zur Erde?', answers: ['8 Sekunden', '8 Minuten', '8 Stunden'], right: 1 },
        { q: 'Wie viele Tage hat ein Schaltjahr?', answers: ['365', '366', '364'], right: 1 },
        { q: 'An welchem Meer haben Christin und ich früher gewohnt?', answers: ['Ostsee', 'Nordsee', 'Mittelmeer'], right: 0 },
        { q: 'Wie viel sind 7 mal 8?', answers: ['54', '56', '64'], right: 1 },
      ],
    },
    intro: [
      ['Die Rätselecke! Ich hab extra die Zeitung aufgehoben.', 'Fünf Fragen. Keine Sorge, die Lösungen stehen ganz hinten. Ich verrate sie aber nicht.'],
      ['Frère sagt, Rätsel sind was für alte Leute. Ich sag: für kluge Leute. Frère ist beides.'],
      ['Kopf frei? Bleistift gespitzt? Dann los. Ich hab auch einen Kaffee für dich.'],
    ],
    cheers: [],
    done: {
      super: [
        ['Alles richtig! Fünf von fünf. Das ist eine Quote, von der das Finanzamt nur träumt.'],
        ['Volle Punktzahl! Das kleine Arschloch im Comic würde jetzt was Freches sagen. Ich sag: Toll.'],
      ],
      gut: [
        ['Mehr als die Hälfte! Solide. Mit Zinsen wird das nächste Mal noch mehr.'],
        ['Gut gemacht, mein Schatz. Ich hab bei einer Frage auch kurz gezweifelt. Bei der mit dem Krake.'],
      ],
      gemuetlich: [
        ['Na, das waren auch knifflige Fragen. Ich hab sie mir ja ausgesucht.', 'Hauptsache, wir haben zusammen gerätselt. Das ist der eigentliche Gewinn.'],
        ['Rätseln ist wie Sparen: Man fängt klein an. Nächstes Mal wird es mehr.'],
      ],
    },
    record: ['Neuer Höchststand! Den trag ich ins Sparbuch ein. Also gedanklich.'],
    album: 'Rätselecke mit Papa: Er hat beim Krake geflunkert. Drei Herzen hat er. Der Krake, nicht Papa.',
  },
  {
    id: 'malen-jens',
    npc: 'jens',
    label: '🎨 Zusammen malen',
    title: 'Malen mit Onkel Jens',
    game: 'malen',
    malen: {
      motifs: [
        { id: 'meer', label: '🌊 Das Meer am Dorfstrand', verdict: 'Das Meer! Ich höre die Wellen. Und die Möwen, die über Omas Hering reden.' },
        { id: 'winston', label: '🐶 Winston beim Schlafen', verdict: 'Winston! Das Ohr da, wie es so umklappt … das ist Kunst. Das ist Liebe.' },
        { id: 'oma', label: '🪑 Oma auf ihrer Bank', verdict: 'Oma auf der Bank! Ihr Blick sagt: „Das Bild ist zu klein.“ Perfekt getroffen.' },
        { id: 'sterne', label: '✨ Der Sternenhimmel', verdict: 'Ein Sternenhimmel! Van Gogh würde neidisch. Oder zumindest höflich nicken.' },
        { id: 'oli', label: '💕 Oli mit seinem Lächeln', verdict: 'Oli! Das Lächeln, ma chérie. Das strahlt ja aus dem Bild heraus.' },
      ],
      palettes: [
        { id: 'pastell', label: '🌸 Pastell', verdict: 'Pastell, wie ein Frühlingsmorgen in Paris. Très doux.' },
        { id: 'kraeftig', label: '🔥 Kräftig & bunt', verdict: 'Kräftige Farben! Mutig! So muss Kunst sein: laut und voller Leben.' },
        { id: 'schwarz', label: '🖤 Ganz in Schwarz', verdict: 'Schwarz, natürlich. Es ist deine Farbe. Elegant, geheimnisvoll, ein bisschen Horrorfilm.' },
      ],
    },
    intro: [
      ['Ma chérie! Leinwand, Pinsel, Wein für mich, Saft für dich.', 'Such dir ein Motiv und die Farben aus. Der Rest ist Gefühl.'],
      ['Kunst ist, wenn man Mut hat. Und Farbe. Und einen Onkel, der begeistert ist.', 'Allez, wir malen!'],
      ['Weißt du, in Leipzig hab ich in einer Woche zwölf Bilder gemalt. Elf davon waren Kaffeeflecken.'],
    ],
    cheers: [],
    done: {
      super: [
        ['Fabelhaft! Das hängen wir in die Galerie. Gleich neben meine Kaffeeflecken.', 'Ei verbibbsch, ist das schön geworden!'],
        ['Ich bin gerührt. Gib mir ein Taschentuch. Und dann noch eins.'],
        ['Bravo! Das signierst du unten rechts. Ganz klein. Große Künstler signieren klein.'],
      ],
      gut: [['Sehr schön!']],
      gemuetlich: [['Sehr schön!']],
    },
    record: [],
    album: 'Malen mit Onkel Jens: Er hat „fabelhaft“ gesagt und so getan, als hätte er nicht geweint.',
  },
];

export const UNTERNEHMUNG_BY_ID: Readonly<Record<string, UnternehmungDef>> = Object.fromEntries(UNTERNEHMUNGEN.map((u) => [u.id, u]));

/** Freundschaftspunkte für Zeit miteinander: einmal am Tag je Person (danach nur noch zum Spaß) */
export const ZUSAMMEN_PUNKTE = 10;

/** Schlüssel in `world.dates`: Tag des ersten Mals (fürs Album) */
export const zusammenErstKey = (id: string) => `zusammen:${id}`;
/** Schlüssel in `world.dates`: Tag, an dem es zuletzt Herzen mit dieser Person gab */
export const zusammenTagKey = (npc: string) => `zusammen-tag:${npc}`;
/** Schlüssel in `world.dates`: bisher bestes Ergebnis (bei Leveln je Level) */
export const zusammenBestKey = (id: string, level?: number) => (level === undefined ? `zusammen-best:${id}` : `zusammen-best:${id}:${level}`);
/** Schlüssel in `world.dates`: wie viele Level schon erreicht sind */
export const zusammenLevelKey = (id: string) => `zusammen-level:${id}`;
