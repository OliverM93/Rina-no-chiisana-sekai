/**
 * Besuch bei Lina (Feature Discovery C): Lina kann Bewohner zu sich einladen. Wer eingeladen ist, kommt, sobald
 * Lina zu Hause ist, schaut sich um und sagt ein paar warme Sätze – zu dem, was wirklich im Haus steht (die Zeilen
 * dafür stammen aus `data/erinnerungen.ts`). Keine Punkte, keine Bewertung, nie Kritik am Haus.
 * Oli wohnt im Haus und braucht keine Einladung.
 */

export interface VisitDef {
  /** Antwort, wenn Lina einlädt */
  invited: readonly string[];
  /** Antwort, wenn Lina noch einmal einlädt (die Einladung gilt ja schon) */
  waiting: readonly string[];
  /** Begrüßung, wenn der Gast ins Haus kommt */
  arrive: readonly string[];
  /** Allgemeine Sätze, wenn nichts Bestimmtes im Haus dazu passt (mehrere, nacheinander) */
  generic: readonly (readonly string[])[];
  /** Beim Gehen (Toast, wenn Lina das Haus verlässt) */
  bye: string;
}

export const VISITS: Readonly<Record<string, VisitDef>> = {
  gisela: {
    invited: ['Zu dir kommen? Na gut, Kind. Ich bring Kekse mit. Und meine Meinung.', 'Sobald du zu Hause bist, klingel ich. Dreimal.'],
    waiting: ['Ich hab es nicht vergessen, Kind. Ich komme. Hab ich gesagt.'],
    arrive: ['Da bin ich, Kind. Ich hab geklingelt. Dreimal. Du hast nicht gehört.', 'Na, dann schau ich mal, was du aus dem Häuschen gemacht hast.'],
    generic: [['Gemütlich hast du es. Das sage ich nicht oft.', 'Also behalt es für dich.'], ['Ich setz mich gleich mal. Wo steht der bequemste Sessel? Egal, ich finde ihn.']],
    bye: 'Oma Gisela: Köstlich war’s, Kind. Das letzte Wort hab ich trotzdem.',
  },
  olaf: {
    invited: ['Ein Besuch bei dir? Ich trage es sofort in den Kalender ein. Mit Uhrzeit.', 'Sobald du zu Hause bist, bin ich da. Pünktlich.'],
    waiting: ['Steht im Kalender, mein Schatz. Rot unterstrichen.'],
    arrive: ['Pünktlich auf die Minute, mein Schatz. Ich hab sogar die Schuhe abgetreten.', 'Dann schauen wir mal. Rein aus Interesse. Ich bringe keine Checkliste mit. Fast keine.'],
    generic: [['Solide Bausubstanz. Das sage ich als Mann vom Finanzamt.'], ['Hier fühlt man sich sofort zu Hause. Das ist steuerlich leider nicht absetzbar.']],
    bye: 'Papa: Das war ein schöner Besuch. Ich hab ihn mir gemerkt. Und notiert.',
  },
  christin: {
    invited: ['Gern! Ich bring die kleine Kehrschaufel mit. Nur aus Gewohnheit!', 'Wenn du zu Hause bist, komme ich vorbei.'],
    waiting: ['Ich komme noch vorbei, Lina. Ich freu mich schon.'],
    arrive: ['Hallo Lina! Schön hast du es.', 'Ich zupf nur kurz ein Kissen gerade. Eins. Versprochen.'],
    generic: [['Alles so gemütlich bei dir. Und gar nicht unordentlich – ich bin ehrlich überrascht. Im guten Sinne!'], ['Ein Kissen hätte ich gerade gerückt. Aber ich halte mich zurück. Ganz fest.']],
    bye: 'Christin: Danke für die Einladung! Ich gehe mit einem guten Gefühl. Und ohne einen einzigen Handgriff mehr.',
  },
  jens: {
    invited: ['Ma chérie, du lädst mich ein? Ich komme im Anzug! Mer sin’ ja sonst nich’ so.', 'Sobald du zu Hause bist, bin ich da. Mit einem Lächeln. Und mit Appetit.'],
    waiting: ['Aber natürlich, Lina, ich komme. Ich übe schon das Bewundern.'],
    arrive: ['Bonjour, bonjour! Ah, die Hausherrin! Zeig mal, zeig mal – oh, c’est magnifique!'],
    generic: [['Jedes Zimmer erzählt etwas, Lina. Deins erzählt: „Hier wohnt jemand, die genau weiß, was sie mag.“'], ['Mer sin’ ja ganz scheen eingerichtet, wa? Merci, Madame!']],
    bye: 'Jens: Au revoir, ma chérie! Das war ein Fest. Ganz ohne Torte, aber ein Fest.',
  },
  lars: {
    invited: ['Ich komme vorbei. Mit Pflaster, Humor und leeren Händen. Eins davon brauchst du bestimmt.', 'Wenn du zu Hause bist, klingel ich. Das gilt dann als Anamnese.'],
    waiting: ['Ich hab’s nicht vergessen. Der Termin steht. Kein Wartezimmer, versprochen.'],
    arrive: ['Na, Frau Hausbesitzerin! Ich hab geklingelt – das gilt als Anamnese.'],
    generic: [['Medizinisch gesehen: wenig Stolperfallen, viele Sitzgelegenheiten. Ich bin überzeugt.'], ['Das Sofa hat Charakter. Ich setz mich mal kurz – für die Diagnose.']],
    bye: 'Lars: Danke für die Einladung! Wirkung: Stimmung sehr gut. Nebenwirkung: Ich bleibe immer zu lange.',
  },
  thalia: {
    invited: ['Ja! Ich komme vorbei, und danach gehen wir noch irgendwohin. Studio? Party? Beides!', 'Sobald du zu Hause bist, stehe ich vor der Tür.'],
    waiting: ['Ich hab’s nicht vergessen, Lina! Ich komme!'],
    arrive: ['Lina! Dein Haus ist so schön! Ich hab Snacks mit. Und Energie. Und Musik im Ohr.'],
    generic: [['Hier fühlt man sich sofort wohl. Hier könnte man eine Hausparty machen. Nur so als Idee.'], ['Das Sofa sieht aus, als könnte man darauf stundenlang quatschen. Machen wir!']],
    bye: 'Thalia: Danke für heute! Beim nächsten Mal bring ich die Hanteln mit. Nein, Spaß! … Vielleicht.',
  },
};

/** Wer kommen kann: alle außer Oli (der wohnt ja bei Lina) */
export const VISITORS: readonly string[] = Object.keys(VISITS);

/** Erinnerungs-Tags, die etwas Sichtbares im Haus beschreiben (nur dazu sagt ein Gast etwas) */
export const HOUSE_MEMORY_TAGS: readonly string[] = ['haus-anbau', 'haus-dach', 'haus-kueche', 'haus-keller', 'huehner', 'gewaechshaus', 'tassen-viele', 'pflanzen-viele', 'bett', 'waermflasche', 'parkett-edel', 'tapete-uni', 'garten-deko'];

/** Uhrzeiten, zu denen Besuch kommt (von–bis, Stunden) */
export const VISIT_HOURS = [9, 21] as const;
