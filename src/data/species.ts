/**
 * Fische und Insekten – echte, heimische Arten (Flüsse, Nord- & Ostsee,
 * Wiesen & Wälder). Jede Art hat Monate, Uhrzeiten und einen Ort.
 *
 * Neue Art: hier eintragen – sie erscheint automatisch als Gegenstand,
 * im Sammelbuch und in der Welt. Das Symbol wird aus `shape` und den Farben
 * gezeichnet.
 */

export type FishHabitat = 'fluss' | 'meer';
export type InsectHabitat = 'blumen' | 'baum' | 'wiese' | 'wasser' | 'strand' | 'felsen';
export type InsectShape = 'falter' | 'nachtfalter' | 'kaefer' | 'libelle' | 'biene' | 'heuschrecke' | 'schnecke' | 'gluehwurm' | 'krabbe' | 'ameise' | 'wasserlaeufer';

/** Stunden [von, bis) – „bis“ darf kleiner sein (über Mitternacht). [0, 24] = ganztags */
export type Hours = readonly [number, number];

interface SpeciesBase {
  id: string;
  name: string;
  plural: string;
  /** Monate 1–12 */
  months: readonly number[];
  hours: Hours;
  price: number;
  /** Häufigkeit (höher = häufiger) */
  weight: number;
  description: string;
  color: string;
  accent: string;
  /** nur bei Regen */
  rainOnly?: boolean;
  /** nicht bei Regen */
  noRain?: boolean;
}

export interface FishDef extends SpeciesBase {
  habitat: FishHabitat;
  /** Größe 1 (winzig) – 6 (riesig) */
  size: number;
  shape?: 'fisch' | 'qualle' | 'seepferdchen' | 'platt' | 'aal';
}

export interface InsectDef extends SpeciesBase {
  habitat: InsectHabitat;
  shape: InsectShape;
}

const ALL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const range = (a: number, b: number) => (a <= b ? ALL.filter((m) => m >= a && m <= b) : ALL.filter((m) => m >= a || m <= b));
const DAY: Hours = [0, 24];

export const FISH: readonly FishDef[] = [
  // Fluss
  { id: 'rotauge', name: 'Rotauge', plural: 'Rotaugen', habitat: 'fluss', months: ALL, hours: DAY, size: 2, price: 40, weight: 40, color: '#b9c6cf', accent: '#d9534f', description: 'Ein silbriger Schwarmfisch mit leuchtend roten Augen. Sehr häufig – und trotzdem hübsch.' },
  { id: 'stichling', name: 'Dreistachliger Stichling', plural: 'Dreistachlige Stichlinge', habitat: 'fluss', months: range(3, 9), hours: DAY, size: 1, price: 25, weight: 30, color: '#9fae8f', accent: '#e0614a', description: 'Winzig, aber mutig! Im Frühling bekommen die Männchen einen roten Bauch.' },
  { id: 'barsch', name: 'Flussbarsch', plural: 'Flussbarsche', habitat: 'fluss', months: ALL, hours: [6, 21], size: 3, price: 80, weight: 28, color: '#8fae6a', accent: '#e8833a', description: 'Grün gestreift mit orangen Flossen und einer stacheligen Rückenflosse.' },
  { id: 'bachforelle', name: 'Bachforelle', plural: 'Bachforellen', habitat: 'fluss', months: range(3, 9), hours: [5, 20], size: 3, price: 150, weight: 16, color: '#b59a6a', accent: '#d9534f', description: 'Liebt klares, kühles Wasser. Hat hübsche rote Tupfen mit hellem Rand.' },
  { id: 'karpfen', name: 'Karpfen', plural: 'Karpfen', habitat: 'fluss', months: range(4, 10), hours: DAY, size: 4, price: 120, weight: 18, color: '#c9a25a', accent: '#8a6a3a', description: 'Ein gemütlicher, goldbrauner Brocken, der gern im Schlamm gründelt.' },
  { id: 'schleie', name: 'Schleie', plural: 'Schleien', habitat: 'fluss', months: range(5, 9), hours: [16, 8], size: 3, price: 140, weight: 12, color: '#7f9a4f', accent: '#d9a441', description: 'Olivgrün mit kleinen roten Augen. Wird abends und nachts munter.' },
  { id: 'hecht', name: 'Hecht', plural: 'Hechte', habitat: 'fluss', months: ALL, hours: [6, 20], size: 5, price: 300, weight: 7, color: '#7d9a5c', accent: '#d9d47a', description: 'Der lange Räuber im Schilf mit dem Entenschnabel-Maul. Ein toller Fang!' },
  { id: 'aal', name: 'Europäischer Aal', plural: 'Europäische Aale', habitat: 'fluss', months: range(5, 10), hours: [19, 5], size: 4, shape: 'aal', price: 400, weight: 5, color: '#5d5a3f', accent: '#c9c08a', description: 'Schlängelt sich nachts durchs Wasser und reist zum Laichen bis in die Sargassosee.' },
  { id: 'wels', name: 'Wels', plural: 'Welse', habitat: 'fluss', months: range(6, 9), hours: [19, 4], size: 6, price: 900, weight: 2, color: '#5b5552', accent: '#d8cfc4', description: 'Der größte Süßwasserfisch Europas – mit langen Barteln wie ein Schnurrbart!' },

  // Meer
  { id: 'hering', name: 'Hering', plural: 'Heringe', habitat: 'meer', months: ALL, hours: DAY, size: 2, price: 50, weight: 40, color: '#a9bfd3', accent: '#3f6c9a', description: 'Schwimmt in riesigen Schwärmen durch Nord- und Ostsee. Ganz schön silbrig!' },
  { id: 'scholle', name: 'Scholle', plural: 'Schollen', habitat: 'meer', months: ALL, hours: DAY, size: 3, shape: 'platt', price: 90, weight: 26, color: '#a68d6a', accent: '#e8833a', description: 'Flach wie ein Pfannkuchen, mit orangen Punkten. Beide Augen liegen auf einer Seite.' },
  { id: 'makrele', name: 'Makrele', plural: 'Makrelen', habitat: 'meer', months: range(5, 10), hours: [5, 20], size: 3, price: 110, weight: 22, color: '#5f8fb0', accent: '#2c4a63', description: 'Schnell und blaugrün schillernd mit Tigerstreifen auf dem Rücken.' },
  { id: 'dorsch', name: 'Dorsch', plural: 'Dorsche', habitat: 'meer', months: range(10, 4), hours: DAY, size: 4, price: 160, weight: 18, color: '#a8986f', accent: '#6f6044', description: 'Auch Kabeljau genannt. Hat einen kleinen Bartfaden am Kinn.' },
  { id: 'hornhecht', name: 'Hornhecht', plural: 'Hornhechte', habitat: 'meer', months: range(4, 6), hours: [6, 19], size: 4, shape: 'aal', price: 220, weight: 10, color: '#6fa0a8', accent: '#4fbf7f', description: 'Kommt im Frühling an die Küste. Kurios: Seine Gräten sind grün!' },
  { id: 'ohrenqualle', name: 'Ohrenqualle', plural: 'Ohrenquallen', habitat: 'meer', months: range(6, 9), hours: DAY, size: 2, shape: 'qualle', price: 20, weight: 20, color: '#dfe6f7', accent: '#c8a6e8', description: 'Ganz harmlos und durchsichtig, mit vier lila Ringen. Huch – das ist ja gar kein Fisch!' },
  { id: 'steinbutt', name: 'Steinbutt', plural: 'Steinbutte', habitat: 'meer', months: range(5, 8), hours: DAY, size: 5, shape: 'platt', price: 500, weight: 4, color: '#8d7c60', accent: '#5d503c', description: 'Ein runder Plattfisch, der sich perfekt am Meeresgrund tarnt.' },
  { id: 'seepferdchen', name: 'Seepferdchen', plural: 'Seepferdchen', habitat: 'meer', months: range(6, 9), hours: [8, 20], size: 1, shape: 'seepferdchen', price: 1200, weight: 2, color: '#e8b04f', accent: '#c7792f', description: 'Selten! Bei Seepferdchen bekommen die Papas die Babys. 🐴' },
];

export const INSECTS: readonly InsectDef[] = [
  // Blumen
  { id: 'kohlweissling', name: 'Kohlweißling', plural: 'Kohlweißlinge', habitat: 'blumen', shape: 'falter', months: range(4, 10), hours: [7, 20], noRain: true, price: 30, weight: 34, color: '#f7f5ec', accent: '#4a4a4a', description: 'Weiß mit schwarzen Tupfen – der häufigste Schmetterling im Garten.' },
  { id: 'zitronenfalter', name: 'Zitronenfalter', plural: 'Zitronenfalter', habitat: 'blumen', shape: 'falter', months: range(2, 10), hours: [8, 20], noRain: true, price: 70, weight: 22, color: '#f3e45a', accent: '#e08a3a', description: 'Zitronengelb und schon im Februar unterwegs. Er überwintert einfach draußen!' },
  { id: 'tagpfauenauge', name: 'Tagpfauenauge', plural: 'Tagpfauenaugen', habitat: 'blumen', shape: 'falter', months: range(3, 10), hours: [8, 20], noRain: true, price: 80, weight: 20, color: '#c0453a', accent: '#5b7fc2', description: 'Rot mit großen bunten „Augen“ auf den Flügeln, die Vögel erschrecken.' },
  { id: 'kleiner-fuchs', name: 'Kleiner Fuchs', plural: 'Kleine Füchse', habitat: 'blumen', shape: 'falter', months: range(3, 10), hours: [8, 20], noRain: true, price: 60, weight: 22, color: '#e8833a', accent: '#3a3a44', description: 'Orange mit schwarzen und gelben Flecken und einem blauen Saum.' },
  { id: 'schwalbenschwanz', name: 'Schwalbenschwanz', plural: 'Schwalbenschwänze', habitat: 'blumen', shape: 'falter', months: range(5, 8), hours: [9, 20], noRain: true, price: 600, weight: 3, color: '#f3dc6a', accent: '#2f2f38', description: 'Selten und wunderschön, mit kleinen „Schwänzchen“ an den Hinterflügeln.' },
  { id: 'honigbiene', name: 'Honigbiene', plural: 'Honigbienen', habitat: 'blumen', shape: 'biene', months: range(3, 10), hours: [8, 20], noRain: true, price: 50, weight: 26, color: '#e8b04f', accent: '#3a3034', description: 'Fleißig! Für ein Glas Honig fliegen Bienen dreimal um die Erde.' },
  { id: 'hummel', name: 'Hummel', plural: 'Hummeln', habitat: 'blumen', shape: 'biene', months: range(3, 9), hours: [6, 20], price: 60, weight: 22, color: '#f0c35a', accent: '#2b2a31', description: 'Kuschelig und brummig – Hummeln fliegen sogar, wenn es kühl ist.' },
  { id: 'taubenschwaenzchen', name: 'Taubenschwänzchen', plural: 'Taubenschwänzchen', habitat: 'blumen', shape: 'nachtfalter', months: range(6, 9), hours: [9, 19], noRain: true, price: 250, weight: 5, color: '#8a7f6f', accent: '#e8833a', description: 'Ein Schwärmer, der wie ein winziger Kolibri vor den Blüten schwebt.' },

  // Bäume
  { id: 'marienkaefer', name: 'Marienkäfer', plural: 'Marienkäfer', habitat: 'baum', shape: 'kaefer', months: range(3, 10), hours: [7, 19], price: 40, weight: 30, color: '#d9382f', accent: '#1f1d22', description: 'Rot mit schwarzen Punkten – soll Glück bringen! 🍀' },
  { id: 'maikaefer', name: 'Maikäfer', plural: 'Maikäfer', habitat: 'baum', shape: 'kaefer', months: range(4, 6), hours: [18, 23], price: 150, weight: 14, color: '#8a5a32', accent: '#f0ece4', description: 'Summt in der Abenddämmerung um die Baumkronen. „Maikäfer, flieg!“' },
  { id: 'rosenkaefer', name: 'Rosenkäfer', plural: 'Rosenkäfer', habitat: 'baum', shape: 'kaefer', months: range(5, 8), hours: [9, 20], noRain: true, price: 120, weight: 12, color: '#3fae6a', accent: '#b9e07a', description: 'Schimmert metallisch grün wie ein kleiner Edelstein.' },
  { id: 'hirschkaefer', name: 'Hirschkäfer', plural: 'Hirschkäfer', habitat: 'baum', shape: 'kaefer', months: range(6, 7), hours: [19, 24], price: 1200, weight: 2, color: '#5a3a2a', accent: '#8a4a32', description: 'Der größte Käfer Deutschlands mit einem stolzen Geweih. Sehr selten!' },
  { id: 'nachtpfauenauge', name: 'Kleines Nachtpfauenauge', plural: 'Kleine Nachtpfauenaugen', habitat: 'baum', shape: 'nachtfalter', months: range(4, 5), hours: [19, 2], price: 450, weight: 4, color: '#b8a48c', accent: '#5b4f6f', description: 'Ein flauschiger Nachtfalter mit vier großen Augenflecken.' },

  // Wiese
  { id: 'grashuepfer', name: 'Grashüpfer', plural: 'Grashüpfer', habitat: 'wiese', shape: 'heuschrecke', months: range(6, 10), hours: [8, 20], noRain: true, price: 30, weight: 30, color: '#9ab85a', accent: '#6f8a3a', description: 'Zirpt in der Sonne, indem er die Beine an den Flügeln reibt.' },
  { id: 'heupferd', name: 'Grünes Heupferd', plural: 'Grüne Heupferde', habitat: 'wiese', shape: 'heuschrecke', months: range(7, 10), hours: [15, 23], price: 120, weight: 12, color: '#5fb04f', accent: '#3f7a3a', description: 'Eine große, grasgrüne Heuschrecke mit superlangen Fühlern.' },
  { id: 'feldgrille', name: 'Feldgrille', plural: 'Feldgrillen', habitat: 'wiese', shape: 'kaefer', months: range(5, 8), hours: [10, 22], price: 90, weight: 14, color: '#2b2a31', accent: '#c99a4a', description: 'Sitzt vor ihrer kleinen Höhle und zirpt den ganzen Sommerabend.' },
  { id: 'waldameise', name: 'Rote Waldameise', plural: 'Rote Waldameisen', habitat: 'wiese', shape: 'ameise', months: range(3, 10), hours: [7, 20], price: 15, weight: 24, color: '#9a4a32', accent: '#2b2a31', description: 'Kann das Vielfache ihres Gewichts tragen. Wahnsinn!' },
  { id: 'gluehwuermchen', name: 'Glühwürmchen', plural: 'Glühwürmchen', habitat: 'wiese', shape: 'gluehwurm', months: range(6, 7), hours: [21, 1], noRain: true, price: 300, weight: 18, color: '#e8f07a', accent: '#5a5040', description: 'Ein Käfer, der im Sommer nachts leuchtet. Wie kleine Sterne über der Wiese. ✨' },

  // Wasser
  { id: 'mosaikjungfer', name: 'Blaugrüne Mosaikjungfer', plural: 'Blaugrüne Mosaikjungfern', habitat: 'wasser', shape: 'libelle', months: range(6, 10), hours: [8, 19], noRain: true, price: 200, weight: 12, color: '#4fb0a0', accent: '#3a5fb0', description: 'Eine große Libelle, die neugierig zu dir herüberfliegt.' },
  { id: 'prachtlibelle', name: 'Gebänderte Prachtlibelle', plural: 'Gebänderte Prachtlibellen', habitat: 'wasser', shape: 'libelle', months: range(5, 8), hours: [9, 20], noRain: true, price: 180, weight: 14, color: '#3a5fc8', accent: '#2a2f5a', description: 'Metallisch blau mit dunklen Flügelbändern, flattert am Flussufer.' },
  { id: 'wasserlaeufer', name: 'Wasserläufer', plural: 'Wasserläufer', habitat: 'wasser', shape: 'wasserlaeufer', months: range(4, 10), hours: [6, 20], price: 50, weight: 22, color: '#5a4a3a', accent: '#8a7a6a', description: 'Läuft übers Wasser, ohne nass zu werden!' },

  // Strand & Felsen
  { id: 'strandkrabbe', name: 'Strandkrabbe', plural: 'Strandkrabben', habitat: 'strand', shape: 'krabbe', months: ALL, hours: DAY, price: 70, weight: 26, color: '#d97a4a', accent: '#8a4a2a', description: 'Läuft seitwärts über den Sand. Eigentlich kein Insekt – aber ein toller Krabbler!' },
  { id: 'weinbergschnecke', name: 'Weinbergschnecke', plural: 'Weinbergschnecken', habitat: 'felsen', shape: 'schnecke', months: range(4, 10), hours: DAY, rainOnly: true, price: 60, weight: 26, color: '#c9a36a', accent: '#a6886a', description: 'Kommt bei Regen heraus. Ihr Häuschen trägt sie immer mit sich.' },
  { id: 'winterhaft', name: 'Winterhaft', plural: 'Winterhafte', habitat: 'felsen', shape: 'heuschrecke', months: range(11, 3), hours: [9, 20], price: 250, weight: 10, color: '#4a3f3a', accent: '#8a7a70', description: 'Auch „Schneefloh“ genannt: hüpft mitten im Winter über Moos und Schnee.' },
  // Winter: auch bei Frost ist etwas los
  { id: 'wintermotte', name: 'Wintermotte', plural: 'Wintermotten', habitat: 'baum', shape: 'nachtfalter', months: range(11, 1), hours: [17, 24], price: 160, weight: 14, color: '#b9a98a', accent: '#6a5f50', description: 'Fliegt als einer der wenigen Falter im November und Dezember – nur die Männchen. Die Weibchen können gar nicht fliegen.' },
  { id: 'wintermuecke', name: 'Wintermücke', plural: 'Wintermücken', habitat: 'wiese', shape: 'biene', months: range(11, 3), hours: [10, 20], noRain: true, price: 60, weight: 20, color: '#8a8f94', accent: '#d9dde3', description: 'Tanzt an milden Wintertagen in kleinen Schwärmen im Sonnenlicht. Sticht nicht und stört niemanden.' },
  { id: 'schneeschnake', name: 'Schneeschnake', plural: 'Schneeschnaken', habitat: 'wiese', shape: 'ameise', months: range(12, 2), hours: [10, 20], price: 320, weight: 6, color: '#6f6a66', accent: '#c9c4bf', description: 'Eine flügellose Schnake, die mitten im Schnee herumspaziert. Wirkt wie eine zu groß geratene Spinne – ist aber ganz harmlos.' },
];

export const FISH_BY_ID: Readonly<Record<string, FishDef>> = Object.fromEntries(FISH.map((f) => [f.id, f]));
export const INSECT_BY_ID: Readonly<Record<string, InsectDef>> = Object.fromEntries(INSECTS.map((i) => [i.id, i]));

export const FISH_HABITAT_LABELS: Record<FishHabitat, string> = { fluss: 'Fluss', meer: 'Meer' };
export const INSECT_HABITAT_LABELS: Record<InsectHabitat, string> = {
  blumen: 'an Blumen',
  baum: 'an Bäumen',
  wiese: 'auf der Wiese',
  wasser: 'am Wasser',
  strand: 'am Strand',
  felsen: 'an Felsen',
};
