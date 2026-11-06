import { FLOORS, FURNITURE_ITEMS, VARIANT_LABELS, WALLPAPERS } from './furniture';
import { FURNITURE_BY_ITEM } from './furniture';
import { RECIPE_ITEM_PREFIX, RECIPES } from './recipes';
import { FISH, INSECTS } from './species';
import { FINDS } from './fossils';
import { COLORS, colorWord, FLOWER_SPECIES, type FlowerColor, paletteOf, SPECIES_BY_ID, variantId } from './flowers';

/**
 * Alle Gegenstände im Spiel.
 *
 * Neue Gegenstände: hier eintragen und in `src/gfx/items.ts` ein Symbol
 * zeichnen (sonst erscheint ein Platzhalter). Preise in „Sternchen“ ⭐.
 */

export type ItemCategory = 'obst' | 'muschel' | 'blume' | 'material' | 'fund' | 'essen' | 'geschenk' | 'werkzeug' | 'samen' | 'fisch' | 'insekt' | 'moebel' | 'tapete' | 'boden' | 'rezept' | 'fossil';

export interface ItemDef {
  id: string;
  name: string;
  /** Mehrzahl für Meldungen wie „3 Äpfel“ */
  plural: string;
  category: ItemCategory;
  /** Verkaufspreis in Sternchen; null = nicht verkaufbar */
  price: number | null;
  description: string;
  maxStack?: number;
}

export const CURRENCY = { name: 'Sternchen', icon: '⭐' } as const;

const list: ItemDef[] = [
  // Obst
  { id: 'apfel', name: 'Apfel', plural: 'Äpfel', category: 'obst', price: 10, description: 'Knackig und rotbackig. Ein Apfel am Tag …' },
  { id: 'birne', name: 'Birne', plural: 'Birnen', category: 'obst', price: 10, description: 'Saftig und süß, mit einem kleinen Blättchen am Stiel.' },
  { id: 'pfirsich', name: 'Pfirsich', plural: 'Pfirsiche', category: 'obst', price: 12, description: 'Flauschig wie ein Pfirsich eben. Duftet nach Sommer.' },

  // Muscheln & Strandfunde
  { id: 'herzmuschel', name: 'Herzmuschel', plural: 'Herzmuscheln', category: 'muschel', price: 15, description: 'Eine zartrosa Muschel in Herzform. 💕' },
  { id: 'jakobsmuschel', name: 'Jakobsmuschel', plural: 'Jakobsmuscheln', category: 'muschel', price: 12, description: 'Ein hübscher kleiner Fächer aus dem Meer.' },
  { id: 'schneckenhaus', name: 'Schneckenhaus', plural: 'Schneckenhäuser', category: 'muschel', price: 18, description: 'Hält man es ans Ohr, hört man das Meer rauschen.' },
  { id: 'seestern', name: 'Seestern', plural: 'Seesterne', category: 'muschel', price: 60, description: 'Selten! Ein kleiner Stern, der vom Himmel ins Meer gefallen ist.' },

  // Blumen
  { id: 'wildblumen', name: 'Wildblumenstrauß', plural: 'Wildblumensträuße', category: 'blume', price: 8, description: 'Frisch gepflückt von der Wiese. Riecht nach Frühling.' },

  // Materialien & Funde
  { id: 'ast', name: 'Ast', plural: 'Äste', category: 'material', price: 3, description: 'Ein ordentlicher Ast. Bestimmt nützlich für später.' },
  { id: 'stein', name: 'Kieselstein', plural: 'Kieselsteine', category: 'material', price: 4, description: 'Glatt und rund, liegt schön in der Hand.' },
  { id: 'glitzerstein', name: 'Glitzerstein', plural: 'Glitzersteine', category: 'fund', price: 120, description: 'Funkelt in allen Farben! Ein echter Schatz.' },

  // Gartenblumen
  { id: 'tulpe', name: 'Tulpe', plural: 'Tulpen', category: 'blume', price: 25, description: 'Eine knallrote Tulpe aus Linas eigenem Beet. 🌷' },
  { id: 'rose', name: 'Rose', plural: 'Rosen', category: 'blume', price: 40, description: 'Eine rote Rose. Duftet wunderbar. Fast zu schön zum Verkaufen … 🌹' },
  { id: 'sonnenblume', name: 'Sonnenblume', plural: 'Sonnenblumen', category: 'blume', price: 30, description: 'Groß und fröhlich – dreht sich immer zur Sonne. 🌻' },
  { id: 'lavendel', name: 'Lavendel', plural: 'Lavendelzweige', category: 'blume', price: 30, description: 'Riecht nach Sommer in der Provence. Jens würde sagen: „Magnifique!“' },
  { id: 'vergissmeinnicht', name: 'Vergissmeinnicht', plural: 'Vergissmeinnicht', category: 'blume', price: 35, description: 'Winzige himmelblaue Blüten. Damit man sich immer erinnert. 💙' },

  { id: 'kamille', name: 'Kamille', plural: 'Kamillenblüten', category: 'blume', price: 22, description: 'Kleine weiße Blüten mit gelbem Herz. Oma schwört drauf. Gegen alles.' },
  { id: 'pfefferminze', name: 'Pfefferminze', plural: 'Pfefferminzzweige', category: 'blume', price: 22, description: 'Frisch, grün und duftet herrlich. Lars\' Lieblingskraut.' },

  // Samen
  { id: 'samen-tulpe', name: 'Tulpenzwiebel', plural: 'Tulpenzwiebeln', category: 'samen', price: 5, description: 'Ab ins Beet damit! Gießen nicht vergessen.' },
  { id: 'samen-rose', name: 'Rosensamen', plural: 'Rosensamen', category: 'samen', price: 8, description: 'Ein Tütchen Rosensamen. Braucht ein bisschen Geduld.' },
  { id: 'samen-sonnenblume', name: 'Sonnenblumenkerne', plural: 'Sonnenblumenkerne', category: 'samen', price: 5, description: 'Zum Pflanzen – nicht zum Knabbern! (Na gut, einer.)' },
  { id: 'samen-lavendel', name: 'Lavendelsamen', plural: 'Lavendelsamen', category: 'samen', price: 6, description: 'Winzige Samen für duftenden Lavendel.' },
  { id: 'samen-kamille', name: 'Kamillensamen', plural: 'Kamillensamen', category: 'samen', price: 5, description: 'Von Lars. „Ärztlich empfohlen – und von Oma.“' },
  { id: 'samen-pfefferminze', name: 'Pfefferminzsamen', plural: 'Pfefferminzsamen', category: 'samen', price: 5, description: 'Daraus wächst Pfefferminze für Tee.' },
  { id: 'samen-vergissmeinnicht', name: 'Vergissmeinnicht-Samen', plural: 'Vergissmeinnicht-Samen', category: 'samen', price: 6, description: 'Für ein kleines Meer aus Blau.' },

  // Werkzeuge
  { id: 'angel', name: 'Angel', plural: 'Angeln', category: 'werkzeug', price: null, maxStack: 1, description: 'Opa Ludwigs alte Angel. Am Wasser die Leertaste drücken – und dann ganz entspannt abwarten.' },
  { id: 'netz', name: 'Kescher', plural: 'Kescher', category: 'werkzeug', price: null, maxStack: 1, description: 'Ein Netz für Schmetterlinge, Käfer und andere Krabbler.' },
  { id: 'schaufel', name: 'Schaufel', plural: 'Schaufeln', category: 'werkzeug', price: null, maxStack: 1, description: 'Von Thalia. An kleinen Rissen im Boden graben – da stecken Fossilien und Kristalle!' },
  { id: 'giesskanne', name: 'Gießkanne', plural: 'Gießkannen', category: 'werkzeug', price: null, maxStack: 1, description: 'Eine rosa Gießkanne für Linas Beet. Gießen = Wachsen!' },

  // Essen & Geschenke
  { id: 'ei', name: 'Ei', plural: 'Eier', category: 'essen', price: 20, description: 'Noch ganz warm. Von Linas eigenen Hühnern! 🥚' },
  { id: 'wachtelei', name: 'Wachtelei', plural: 'Wachteleier', category: 'essen', price: 14, description: 'Winzig, gesprenkelt und sehr niedlich.' },
  // Gerichte aus Jens' Kochstudio
  { id: 'ruehrei', name: 'Rührei', plural: 'Portionen Rührei', category: 'essen', price: 70, description: 'Fluffig, goldgelb, mit einer Prise Schnittlauch. Olis Lieblingsfrühstück.' },
  { id: 'wachtel-spiegelei', name: 'Wachtel-Spiegeleier', plural: 'Portionen Wachtel-Spiegeleier', category: 'essen', price: 75, description: 'Winzige Spiegeleier – so niedlich, dass man sie fast nicht essen mag. Fast.' },
  { id: 'obstsalat', name: 'Obstsalat', plural: 'Schüsseln Obstsalat', category: 'essen', price: 60, description: 'Apfel, Birne und Pfirsich – frisch geschnippelt und bunt wie ein Gemälde.' },
  { id: 'fischbroetchen', name: 'Fischbrötchen', plural: 'Fischbrötchen', category: 'essen', price: 130, description: 'Nach Jens\' Geheimrezept: „In Hamburg gelernt, in Paris verfeinert, in Sachsen perfektioniert.“' },
  { id: 'apfelkuchen', name: 'Apfelkuchen', plural: 'Apfelkuchen', category: 'essen', price: 180, description: 'Mit Zimt und Liebe. Oma sagt, ihrer ist besser. Oma sagt das immer.' },
  { id: 'crepes', name: 'Crêpes', plural: 'Crêpes', category: 'essen', price: 150, description: 'Hauchdünn und mit Pfirsich gefüllt – wie am Montmartre. Oh là là!' },
  { id: 'lavendelkekse', name: 'Lavendelkekse', plural: 'Lavendelkekse', category: 'essen', price: 90, description: 'Kekse mit einem Hauch Provence. Duften himmlisch.' },
  // Tees aus Lars' Apotheke
  { id: 'kamillentee', name: 'Kamillentee', plural: 'Tassen Kamillentee', category: 'essen', price: 80, description: 'Beruhigend und warm. Laut Oma hilft er gegen alles. Laut Lars gegen fast alles.' },
  { id: 'pfefferminztee', name: 'Pfefferminztee', plural: 'Tassen Pfefferminztee', category: 'essen', price: 80, description: 'Frisch und belebend. Lars trinkt ihn literweise.' },
  { id: 'lavendeltee', name: 'Lavendeltee', plural: 'Tassen Lavendeltee', category: 'essen', price: 90, description: 'Duftet nach Sommer in der Provence. Jens nennt ihn „Urlaub in der Tasse“.' },
  { id: 'kraeutermischung', name: 'Omas Kräutermischung', plural: 'Tassen Kräutermischung', category: 'essen', price: 160, description: 'Kamille, Minze und Lavendel. Omas Rezept. Lars gibt es zu.' },
  // Aus der Kochshow
  { id: 'apfelpfannkuchen', name: 'Apfelpfannkuchen', plural: 'Apfelpfannkuchen', category: 'essen', price: 110, description: 'Fluffig, mit Apfelscheiben und einer Prise Zimt. Fast so gut wie bei Oma. Psst!' },
  { id: 'fischsuppe', name: 'Fischsuppe mit Minze', plural: 'Teller Fischsuppe', category: 'essen', price: 160, description: 'Klingt komisch, schmeckt himmlisch. Lars sagt: „Sehr gesund.“ Oli sagt: „Nochmal!“' },
  { id: 'blumensalat', name: 'Blumensalat', plural: 'Schüsseln Blumensalat', category: 'essen', price: 140, description: 'Ein bunter Salat mit essbaren Blüten. Zu schön zum Essen. Fast.' },
  // Feste
  { id: 'plaetzchen', name: 'Omas Plätzchen', plural: 'Omas Plätzchen', category: 'essen', price: 15, description: 'Zimtsterne, Vanillekipferl, Butterplätzchen. Weihnachten in Keksform.' },
  // Winter
  { id: 'schneeball', name: 'Schneeball', plural: 'Schneebälle', category: 'material', price: 2, maxStack: 30, description: 'Fest gerollt und eiskalt. Drei davon und zwei Äste – fertig ist ein Schneemann!' },
  { id: 'bratapfel', name: 'Bratapfel', plural: 'Bratäpfel', category: 'essen', price: 95, description: 'Ein warmer Apfel mit Keks-Zimt-Füllung. Riecht das ganze Haus nach Weihnachten.' },
  { id: 'zimtsterne', name: 'Zimtsterne', plural: 'Zimtsterne', category: 'essen', price: 40, description: 'Kleine Sterne mit weißem Zuckerguss. Selbst gebacken! Oma sagt: „Gar nicht schlecht.“ Das ist ein großes Lob.' },
  { id: 'lebkuchenherz', name: 'Lebkuchenherz', plural: 'Lebkuchenherzen', category: 'geschenk', price: null, maxStack: 1, description: 'Von Jens, mit Zuckerguss: „Ma chérie“. Und ein Hauch Glitzer. Natürlich.' },
  { id: 'geburtstagstorte', name: 'Olis Geburtstagstorte', plural: 'Olis Geburtstagstorten', category: 'essen', price: 300, description: 'Drei Stockwerke geplant, zwei geschafft. Mit ganz viel Liebe und schiefer Kerze.' },
  { id: 'gluecksklee', name: 'Glücksklee', plural: 'Glücksklee', category: 'fund', price: 50, description: 'Ein vierblättriges Kleeblatt für das neue Jahr. Von Oma – „bringt Glück, keine Widerrede“.' },
  { id: 'osterei', name: 'Osterei', plural: 'Ostereier', category: 'fund', price: 30, description: 'Ein bunt bemaltes Ei. Irgendwer hat es im Gras versteckt …' },
  { id: 'mixtape', name: 'Olis Mixtape', plural: 'Olis Mixtapes', category: 'geschenk', price: null, maxStack: 1, description: 'Eine Kassette mit Herzchen drauf. Seite A: Punk. Seite B: auch Punk. Aber mit Liebe.' },
  { id: 'foto-lina-oli', name: 'Foto von Lina & Oli', plural: 'Fotos von Lina & Oli', category: 'geschenk', price: null, maxStack: 1, description: 'Ihr zwei, lachend, mit Winston dazwischen. Auf der Rückseite: „Für immer. Dein Oli.“' },
  { id: 'keks', name: 'Omas Keks', plural: 'Omas Kekse', category: 'essen', price: 5, description: 'Butterkeks nach Oma Giselas Geheimrezept. Keine Widerrede!' },
  { id: 'strickschal', name: 'Gestrickter Schal', plural: 'Gestrickte Schals', category: 'geschenk', price: null, maxStack: 1, description: 'Von Oma Gisela gestrickt. Natürlich in Rosa – „Rosa steht dir.“' },
  { id: 'omas-foto', name: 'Foto von Oma Gisela', plural: 'Fotos von Oma Gisela', category: 'geschenk', price: null, maxStack: 1, description: 'Oma Gisela auf ihrer Bank, mit Kaffeetasse und sehr ernstem Blick. Auf der Rückseite: „Für Lina. Gut aufheben!“' },
  { id: 'keksrezept', name: 'Omas Keksrezept', plural: 'Omas Keksrezepte', category: 'geschenk', price: null, maxStack: 1, description: 'Streng geheim! „Mehl, Butter, Zucker – und ganz viel Liebe. Den Rest verrat ich nicht.“' },
];

// Fische & Insekten (aus `species.ts`)
for (const f of FISH) list.push({ id: f.id, name: f.name, plural: f.plural, category: 'fisch', price: f.price, maxStack: 10, description: f.description });
for (const i of INSECTS) list.push({ id: i.id, name: i.name, plural: i.plural, category: 'insekt', price: i.price, maxStack: 10, description: i.description });

for (const f of FINDS) list.push({ id: f.id, name: f.name, plural: f.plural, category: 'fossil', price: f.price, maxStack: 10, description: f.description });

// Möbel, Tapeten & Böden (aus `furniture.ts`). Verkaufswert = ein Viertel des Katalogpreises.
// Einmalige Geschenke (nicht im Katalog, keine Kunstwerke) sind Erinnerungsstücke: unverkäuflich.
for (const f of FURNITURE_ITEMS) {
  const name = f.variant ? `${f.def.name} (${VARIANT_LABELS[f.variant] ?? f.variant})` : f.def.name;
  const keepsake = !!f.def.gift && f.def.style !== 'kunst';
  list.push({ id: f.itemId, name, plural: name, category: 'moebel', price: keepsake ? null : Math.round(f.def.price / 4), maxStack: 1, description: f.def.description });
}
for (const w of [...WALLPAPERS, ...FLOORS]) list.push({ id: w.id, name: w.name, plural: w.name, category: w.kind, price: Math.round(w.price / 4), maxStack: 1, description: w.description });

// Rezeptkarten (Brief-Geschenke) – werden beim Annehmen sofort gelernt
for (const r of RECIPES) {
  const name = FURNITURE_BY_ITEM[r.result]?.def.name ?? list.find((i) => i.id === r.result)?.name ?? r.result;
  list.push({ id: `${RECIPE_ITEM_PREFIX}${r.id}`, name: `Rezept: ${name}`, plural: `Rezepte: ${name}`, category: 'rezept', price: null, maxStack: 1, description: `Eine Bauanleitung für die Werkbank: ${name}.` });
}

// Blumen in anderen Farben (aus `flowers.ts`): Blüten & Samen entstehen automatisch
for (const sp of FLOWER_SPECIES) {
  const flower = list.find((i) => i.id === sp.id) as ItemDef;
  const seed = list.find((i) => i.id === `samen-${sp.id}`) as ItemDef;
  for (const color of [...sp.seedColors, ...sp.crossColors]) {
    const cross = sp.crossColors.includes(color);
    const rare = color === 'schwarz';
    const mult = rare ? 6 : cross ? 2 : 1.3;
    const word = colorWord(color, sp.gender);
    const adj = word.charAt(0).toUpperCase() + word.slice(1);
    const label = COLORS[color].label;
    list.push({
      id: variantId(sp, color),
      name: `${adj} ${flower.name}`,
      plural: `${colorWord(color, sp.gender, true)} ${flower.plural}`,
      category: 'blume',
      price: Math.round(flower.price! * mult),
      description: rare
        ? `${adj} ${flower.name}: Gibt es sonst nirgends – nur, wenn zwei Mischfarben nebeneinander blühen und das Glück mitspielt. 🖤`
        : cross
          ? `${adj} ${flower.name} – eine neue Farbe! Entstanden, als zwei Blumen nebeneinander geblüht haben. ✨`
          : `${adj} ${flower.name}. Ein bisschen anders als die normale – und ein guter Kreuzungs-Partner im Beet.`,
    });
    list.push({
      id: variantId(sp, color, true),
      name: `${seed.name} (${label})`,
      plural: `${seed.plural} (${label})`,
      category: 'samen',
      price: Math.round(seed.price! * mult),
      description: rare ? 'Ein ganz besonderer Same. Daraus wird etwas Schwarzes … 🖤' : cross ? 'Ein Misch-Same. Was wohl daraus wird? ✨' : `${seed.description} (Farbe: ${label})`,
    });
  }
}

export const ITEMS: Readonly<Record<string, ItemDef>> = Object.fromEntries(list.map((i) => [i.id, i]));

/** Reihenfolge beim Sortieren der Tasche */
export const ITEM_ORDER: Readonly<Record<string, number>> = Object.fromEntries(list.map((i, idx) => [i.id, idx]));

export function itemDef(id: string): ItemDef | undefined {
  return ITEMS[id];
}

export function isKnownItem(id: string): boolean {
  return id in ITEMS;
}

export function maxStackOf(id: string): number {
  return ITEMS[id]?.maxStack ?? 30;
}

/** „1 Apfel“, „3 Äpfel“ */
export function itemCountLabel(id: string, count: number): string {
  const def = ITEMS[id];
  if (!def) return `${count}× ${id}`;
  return `${count} ${count === 1 ? def.name : def.plural}`;
}

/** Was an Bäumen wächst */
export const TREE_FRUITS = ['apfel', 'birne', 'pfirsich'] as const;

/** Tägliche Strandfunde */
export const BEACH_FINDS = [
  { itemId: 'jakobsmuschel', weight: 34 },
  { itemId: 'herzmuschel', weight: 30 },
  { itemId: 'schneckenhaus', weight: 26 },
  { itemId: 'seestern', weight: 10 },
] as const;
export const BEACH_FINDS_PER_DAY = 7;

/** Was man beim Klopfen an Felsen findet */
export const ROCK_FINDS = [
  { itemId: 'stein', weight: 88 },
  { itemId: 'glitzerstein', weight: 12 },
] as const;

/** Blumen fürs eigene Beet: Samen → Blume (alle Farben) */
export interface GardenFlower {
  /** ID der Blume (auch Pflanzen-ID im Beet) */
  flower: string;
  seed: string;
  color: string;
  center: string;
  /** Art (`tulpe` für `tulpe-gelb`) */
  species: string;
  /** Farbe (nur bei Arten mit Farbvarianten) */
  colorKey: FlowerColor | null;
  /** Gibt es nur durch Kreuzen? (kein Samen aus Briefen & Funden) */
  crossOnly: boolean;
}

/** Kräuter ohne Farbvarianten */
const PLAIN_HERBS: ReadonlyArray<Pick<GardenFlower, 'flower' | 'seed' | 'color' | 'center'>> = [
  { flower: 'kamille', seed: 'samen-kamille', color: '#ffffff', center: '#f7d26a' },
  { flower: 'pfefferminze', seed: 'samen-pfefferminze', color: '#6fbf73', center: '#4f9a5a' },
];

export const GARDEN_FLOWERS: readonly GardenFlower[] = [
  ...FLOWER_SPECIES.flatMap((sp) =>
    paletteOf(sp).map((c): GardenFlower => ({
      flower: variantId(sp, c),
      seed: variantId(sp, c, true),
      color: COLORS[c].hex,
      center: sp.center,
      species: sp.id,
      colorKey: c,
      crossOnly: sp.crossColors.includes(c),
    })),
  ),
  ...PLAIN_HERBS.map((h): GardenFlower => ({ ...h, species: h.flower, colorKey: null, crossOnly: false })),
];

/** Blumenart einer Blume/eines Samens (`tulpe-gelb` → `tulpe`), sonst die ID selbst */
export function speciesOfFlower(id: string): string {
  return GARDEN_FLOWER[id]?.species ?? FLOWER_BY_SEED[id]?.species ?? id;
}

export function hasColorVariants(species: string): boolean {
  return species in SPECIES_BY_ID;
}

export const FLOWER_BY_SEED: Readonly<Record<string, GardenFlower>> = Object.fromEntries(GARDEN_FLOWERS.map((g) => [g.seed, g]));
export const GARDEN_FLOWER: Readonly<Record<string, GardenFlower>> = Object.fromEntries(GARDEN_FLOWERS.map((g) => [g.flower, g]));

/** Werkzeuge in der Reihenfolge der Werkzeugleiste (Tasten 1–3) */
export const TOOLS = ['angel', 'netz', 'giesskanne', 'schaufel'] as const;
/** Die ersten drei gibt es von Oma, die Schaufel von Thalia */
export const STARTER_TOOLS = ['angel', 'netz', 'giesskanne'] as const;
export type ToolId = (typeof TOOLS)[number];

/**
 * Erinnerungsstücke: Werkzeuge und einmalige Geschenke der Liebsten (Olis Schreibtisch, Jens' Andenken,
 * Fest-Geschenke …). Man kann sie weder verkaufen noch verschenken – sonst wären sie für immer weg.
 */
export function isKeepsake(itemId: string): boolean {
  if ((TOOLS as readonly string[]).includes(itemId)) return true;
  const f = FURNITURE_BY_ITEM[itemId];
  return !!f && !!f.def.gift && f.def.style !== 'kunst';
}
