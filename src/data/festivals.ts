/**
 * Feste: Begrüßung (Meldung beim Spielstart), Sprüche & Geschenke der Bewohner.
 * Geschenke gibt es einmal pro Fest und Jahr beim ersten Gespräch.
 */
import type { FestivalId } from '../core/festivals';

export const FESTIVAL_INFO: Record<FestivalId, { name: string; toast: string }> = {
  advent: { name: 'Adventszeit', toast: '🕯️ Adventszeit! Auf dem Dorfplatz steht ein Weihnachtsbaum.' },
  weihnachten: { name: 'Weihnachten', toast: '🎄 Frohe Weihnachten! Die Bewohner haben Geschenke für dich.' },
  silvester: { name: 'Silvester', toast: '🎆 Silvester! Ab 20 Uhr gibt\'s Feuerwerk über dem Dorf.' },
  neujahr: { name: 'Neujahr', toast: '🍀 Frohes neues Jahr!' },
  ostern: { name: 'Ostern', toast: '🐣 Frohe Ostern! Irgendwo im Dorf sind bunte Eier versteckt …' },
  halloween: { name: 'Halloween', toast: '🎃 Halloween! Vor den Häusern leuchten Kürbisse.' },
  geburtstag: { name: 'Linas Geburtstag', toast: '🎂 Alles Liebe zum Geburtstag, Lina! Schau mal, wer dir gratulieren will …' },
};

export interface FestGift {
  itemId: string;
  count: number;
  lines: readonly string[];
}

/** Geschenke: Fest → Bewohner → Geschenk (fehlt = kein Geschenk, nur Sprüche) */
export const FEST_GIFTS: Partial<Record<FestivalId, Record<string, FestGift>>> = {
  weihnachten: {
    gisela: { itemId: 'plaetzchen', count: 5, lines: ['Frohe Weihnachten, Kindchen! 🎄', 'Hier, Plätzchen. Selbst gebacken. Die gekauften sind ja nur Pappe.', 'Und iss nicht alle auf einmal! … Na gut, iss sie auf einmal. Es ist Weihnachten.'] },
    olaf: { itemId: 'sparschwein', count: 1, lines: ['Frohe Weihnachten, mein Schatz!', 'Ein Sparschwein. Ich weiß, ich weiß. Aber schau: Es hat eine Weihnachtsmütze!'] },
    christin: { itemId: 'weihnachtsstern', count: 1, lines: ['Frohe Weihnachten, Lina!', 'Ein Weihnachtsstern für dein Zimmer. Bitte nicht zu viel gießen. Und gerade hinstellen!'] },
    oli: { itemId: 'kuscheldecke', count: 1, lines: ['Frohe Weihnachten, Lini! 🎄💕', 'Eine Kuscheldecke – für uns beide. Für Filmabende. Und für Winston, der sie eh klaut.'] },
    jens: { itemId: 'lebkuchenherz', count: 1, lines: ['Joyeux Noël, ma chérie! 🎄', 'Ein Lebkuchenherz – mit Zuckerguss und einem Hauch Glitzer. Natürlich.'] },
    lars: { itemId: 'kamillentee', count: 3, lines: ['Frohe Weihnachten, Schwesterherz!', 'Kamillentee. Gegen zu viel Plätzchen. Ärztlich empfohlen.', '… Und von Oma abgesegnet. Ausnahmsweise sind wir uns einig.'] },
    thalia: { itemId: 'bergkristall', count: 1, lines: ['Frohe Weihnachten, Süße! 🎁', 'Ein Bergkristall. Ich hab ihn selbst gefunden. Er funkelt fast so wie du.'] },
  },
  geburtstag: {
    gisela: { itemId: 'keks', count: 5, lines: ['Mein Mäuschen hat Geburtstag! 🎂', 'Kekse. Fünf Stück. Eins für jedes Jahr, das ich dich schon besonders lieb hab.', '… Na gut, es sind mehr Jahre. Aber mehr Kekse passten nicht in die Dose.'] },
    olaf: { itemId: 'apfelkuchen', count: 1, lines: ['Alles Gute zum Geburtstag, mein Schatz! 🎂', 'Christin hat gebacken, ich hab den Kuchen getragen. Arbeitsteilung!'] },
    christin: { itemId: 'rose', count: 3, lines: ['Alles Liebe zum Geburtstag, Lina! 🌹', 'Drei Rosen. Ganz gerade geschnitten. Ich hab nachgemessen.'] },
    oli: { itemId: 'geburtstagstorte', count: 1, lines: ['Happy Birthday, Lini! 🎂💕', 'Die Torte hab ich selbst gemacht. Mit drei Stockwerken. Zwei stehen noch.', 'Ich hab dich so lieb. Heute ganz besonders. Und morgen auch.'] },
    jens: { itemId: 'crepes', count: 2, lines: ['Bon anniversaire, ma chérie! 🎉', 'Crêpes – mit extra viel Liebe. Und Puderzucker. Und noch mehr Liebe.'] },
    lars: { itemId: 'pfefferminztee', count: 2, lines: ['Alles Gute, Schwesterherz! 🎂', 'Ich hab dich untersucht: Du bist ein Jahr älter.', 'Diagnose: immer noch die beste kleine Schwester der Welt. Unheilbar.'] },
    thalia: { itemId: 'amethyst', count: 1, lines: ['HAPPY BIRTHDAAAY! 🎉🎂', 'Eine Amethyst-Druse – außen unscheinbar, innen voller Glitzer. Wie unser Geheimnis: Du bist die Beste!'] },
  },
  silvester: {
    gisela: { itemId: 'gluecksklee', count: 1, lines: ['Guten Rutsch, Kindchen!', 'Hier, ein Glücksklee. Und rutsch nicht wirklich aus – das hab ich letztes Jahr gemacht.'] },
  },
  ostern: {
    gisela: { itemId: 'osterei', count: 3, lines: ['Frohe Ostern, Kindchen! 🐣', 'Ich hab Eier gefärbt. Die blauen sind die schönsten. Die anderen auch, aber die blauen mehr.'] },
  },
};

/** Sprüche ohne Geschenk: Fest → Bewohner → Zeilen */
export const FEST_LINES: Partial<Record<FestivalId, Record<string, readonly string[]>>> = {
  advent: {
    gisela: ['Adventszeit! Da wird gebacken.', 'Zimtsterne, Vanillekipferl, Butterplätzchen. Wer mithilft, darf naschen. Wer nicht mithilft, auch.'],
    jens: ['Die Adventszeit, chérie!', 'Ich hab das Bistro geschmückt. Mit 400 Lichtern. Zu viel? Pas du tout!'],
    oli: ['Lini, ich hab einen Adventskalender für dich gebastelt!', '24 Türchen. In jedem ist ein Zettel: „Ich hab dich lieb“. Ich weiß, sehr kreativ.'],
  },
  silvester: {
    olaf: ['Silvester! Zeit für die Jahresbilanz.', 'Fazit: Das Jahr war gut. Sehr gut. Mit dir im Dorf sogar ausgezeichnet.'],
    oli: ['Um Mitternacht will ich bei dir sein, Lini.', 'Für den ersten Kuss im neuen Jahr. Ist Tradition. Seit … jetzt.'],
    lars: ['Gute Vorsätze? Mehr Sport, weniger Schokolade.', 'Hab ich letztes Jahr auch gesagt. Hat drei Tage gehalten. Rekord!'],
    thalia: ['Gleich gibt\'s Feuerwerk! 🎆', 'Wusstest du, dass die Farben von Metallsalzen kommen? Strontium ist rot, Kupfer blau … ach, guck einfach!'],
  },
  neujahr: {
    gisela: ['Frohes neues Jahr, Kindchen!', 'Ich hab mir vorgenommen, weniger zu meckern.', '… Das gilt aber erst ab morgen.'],
    jens: ['Bonne année, chérie!', 'Mein Vorsatz: mehr reisen, mehr malen, mehr Glitzer. Also wie immer!'],
  },
  ostern: {
    thalia: ['Frohe Ostern!', 'Wusstest du, dass der Ostertermin vom Mond abhängt? Erster Sonntag nach dem ersten Frühlingsvollmond. Astronomie ist so cool!'],
    christin: ['Frohe Ostern!', 'Ich hab die Ostereier nach Farben sortiert versteckt. Damit es ordentlich bleibt.'],
  },
  halloween: {
    jens: ['Buh! 👻', 'Ich bin ein sehr eleganter Vampir. Mit Umhang aus Samt. Die Zähne sind aus dem Bastelladen.'],
    gisela: ['Halloween? Pfui. Amerikanischer Quatsch.', '… Aber die Kürbissuppe ess ich trotzdem. Die ist köstlich.'],
    lars: ['Ich geh als Skelett!', 'Ich kenn mich ja aus. Alle 206 Knochen. Willst du sie hören? … Nein? Schade.'],
    oli: ['Lini, ich hab Kürbisse geschnitzt!', 'Einer sieht aus wie Winston. Er ist beleidigt.'],
    thalia: ['Halloween am Strand – mit Gruselgeschichten!', 'Kennst du die Geschichte vom versteinerten Hai, der nachts wieder aufwacht? … Nein? Gut so.'],
  },
};

/** Ostereier zum Suchen (am Ostersonntag und -montag) */
export const EASTER_EGGS_PER_DAY = 6;
