/**
 * Ordnung des Möbelkatalogs: Kategorie, Typ und Einrichtungsstile je Katalog-Eintrag.
 *
 * Das alte Feld `FurnitureDef.style` bleibt unverändert als interne „Linie“ (Herkunft, Freischaltung des Bistros,
 * Reaktionen der Bewohner, Kunst-/Geschenk-Erkennung). Für das Stöbern zählen nur diese drei Achsen:
 *
 * - **Kategorie** (Reiter oben): Möbel, Pflanzen, Tapeten, Böden, Lieblingsthemen, Garten, Winterzauber
 * - **Typ** (je Kategorie eigene Liste): Sofas & Sessel, Lampen, Dielen …
 * - **Stile** (0 bis n): Japandi, Industrial … – leer heißt „ohne Stil“ (Pflanzen, Garten, Lieblingsthemen …)
 *
 * Keine Gegenstands-ID ändert sich – das hier ist reine Anzeige-Ordnung, nichts davon steht im Spielstand.
 */
import { FLOORS, FURNITURE, type FurnitureDef, type SurfaceDef, WALLPAPERS } from './furniture';
import { POSTERS } from './posters';
import { TASSEN } from './tassen';

// ---------------------------------------------------------------- Einrichtungsstile

export type DesignStyle =
  | 'japanisch'
  | 'japandi'
  | 'minimalismus'
  | 'skandinavisch'
  | 'modern'
  | 'midcentury'
  | 'bauhaus'
  | 'cottage'
  | 'retro'
  | 'bistro'
  | 'industrial'
  | 'brutalismus'
  | 'artdeco'
  | 'darkacademia'
  | 'spaceage'
  | 'cyberpunk'
  | 'memphis';

export interface DesignStyleDef {
  id: DesignStyle;
  name: string;
  /** Ein Satz, wie der Stil sich anfühlt (Detailzeile im Katalog) */
  blurb: string;
  /**
   * Kommt mit dem Einzug dieser Person in den Katalog (Flag `<npc>Begruesst`) – wie das Bistro mit Jens.
   * Ohne: von Anfang an da. Wer schon alle kennt, hat alles sofort.
   */
  arrivesWith?: 'olaf' | 'oli' | 'jens' | 'lars' | 'thalia';
}

/** Reihenfolge = Reihenfolge der Chips im Katalog (Verwandtes nebeneinander) */
export const DESIGN_STYLES: readonly DesignStyleDef[] = [
  { id: 'japanisch', name: 'Japanisch', blurb: 'Papier, Holz und Ruhe – wie in einem alten Teehaus.' },
  { id: 'japandi', name: 'Japandi', blurb: 'Japanische Ruhe trifft nordische Gemütlichkeit: helles Holz, wenig Dinge, viel Luft.' },
  { id: 'minimalismus', name: 'Minimalismus', blurb: 'Weniger, aber schöner. Jedes Stück darf atmen.', arrivesWith: 'olaf' },
  { id: 'skandinavisch', name: 'Skandinavisch', blurb: 'Helles Holz, weiche Stoffe, viel Licht – hygge eben.', arrivesWith: 'olaf' },
  { id: 'modern', name: 'Contemporary', blurb: 'Klare Formen, Grau und Holz, ein bisschen Marmor.' },
  { id: 'midcentury', name: 'Mid-Century-Modern', blurb: 'Teak, Nussbaum, schräge Beinchen und warme Farben.' },
  { id: 'bauhaus', name: 'Bauhaus', blurb: 'Stahlrohr, Leder und Grundformen – Form folgt Funktion. In Dessau zu Hause, wie Oma.' },
  { id: 'cottage', name: 'Cottagecore', blurb: 'Landhaus, Blümchen, Gehäkeltes und Kräuter auf der Fensterbank.' },
  { id: 'retro', name: 'Retro-Oma-Chic', blurb: 'Ohrensessel, Fransen und Kristall – wie bei Oma, nur bunter.' },
  { id: 'bistro', name: 'Französisches Bistro', blurb: 'Marmor, Bugholz und Zink – très chic, sagt Jens.', arrivesWith: 'jens' },
  { id: 'artdeco', name: 'Art déco', blurb: 'Gold, Samt und Fächerformen – ein bisschen Glamour.', arrivesWith: 'jens' },
  { id: 'memphis', name: 'Memphis', blurb: 'Knallige Farben, wilde Formen, Spaß an der Sache.', arrivesWith: 'jens' },
  { id: 'darkacademia', name: 'Dark Academia', blurb: 'Bücherwände, dunkles Holz, grünes Lampenlicht und alte Karten.', arrivesWith: 'thalia' },
  { id: 'brutalismus', name: 'Brutalismus', blurb: 'Roher Beton und schwere Formen – erstaunlich gemütlich mit Kissen.', arrivesWith: 'thalia' },
  { id: 'industrial', name: 'Industrial', blurb: 'Backstein, Stahl und alte Fabriklampen – wie ein Loft.', arrivesWith: 'lars' },
  { id: 'spaceage', name: 'Space Age', blurb: 'Kugeln, Kurven und Weltraumträume aus den Sechzigern.', arrivesWith: 'oli' },
  { id: 'cyberpunk', name: 'Cyberpunk', blurb: 'Neonlicht, Kabel und Bildschirme – Zockerabende mit Stil.', arrivesWith: 'oli' },
];

/**
 * Ein Satz am Ende der Einzugsszene: Wer einzieht, bringt neue Einrichtungsstile mit (siehe `arrivesWith`) und sagt es –
 * in seiner eigenen Stimme, ohne Aufgabenliste. Ein Test sorgt dafür, dass jeder Stil darin vorkommt.
 */
export const STYLE_ARRIVAL_LINES: Readonly<Record<'olaf' | 'oli' | 'jens' | 'lars' | 'thalia', string>> = {
  olaf: 'Und weil Christin Ordnung liebt: Im Möbelkatalog gibt es jetzt Minimalismus und Skandinavisch – nur das Nötige, schön sortiert.',
  oli: 'Ach ja, im Möbelkatalog gibt es jetzt Space Age und Cyberpunk. Rein zufällig meine Lieblingsstile. 😇',
  jens: 'Und im Möbelkatalog gibt es jetzt Französisches Bistro, Art déco und Memphis – très chic, ma chérie!',
  lars: 'Und für jedes Loft: Im Möbelkatalog gibt es jetzt Industrial – Backstein, Stahl, olle Fabriklampen. Sehr ich.',
  thalia: 'Ich hab dem Möbelkatalog übrigens Dark Academia und Brutalismus mitgebracht. Beton ist gemütlich, wenn man genug Kissen hat!',
};

export const DESIGN_STYLE_BY_ID: Readonly<Record<DesignStyle, DesignStyleDef>> = Object.fromEntries(DESIGN_STYLES.map((s) => [s.id, s])) as Record<DesignStyle, DesignStyleDef>;

// ---------------------------------------------------------------- Kategorien & Typen

export type CatalogCategory = 'moebel' | 'pflanzen' | 'tapete' | 'boden' | 'lieblinge' | 'garten' | 'winter';

export interface CategoryDef {
  id: CatalogCategory;
  name: string;
  icon: string;
  /** Typen dieser Kategorie (Reihenfolge = Anzeige); leer = keine Typ-Zeile */
  types: ReadonlyArray<{ id: string; name: string }>;
}

export const CATEGORIES: readonly CategoryDef[] = [
  {
    id: 'moebel',
    name: 'Möbel',
    icon: '🛋️',
    types: [
      { id: 'sofas', name: 'Sofas & Sessel' },
      { id: 'stuehle', name: 'Stühle & Hocker' },
      { id: 'tische', name: 'Tische' },
      { id: 'betten', name: 'Betten' },
      { id: 'regale', name: 'Schränke & Regale' },
      { id: 'lampen', name: 'Lampen' },
      { id: 'teppiche', name: 'Teppiche' },
      { id: 'wanddeko', name: 'Wanddeko' },
      { id: 'deko', name: 'Kleine Deko' },
      { id: 'technik', name: 'Küche & Technik' },
      { id: 'besonderes', name: 'Besonderes' },
    ],
  },
  {
    id: 'pflanzen',
    name: 'Pflanzen',
    icon: '🪴',
    types: [
      { id: 'gross', name: 'Große Pflanzen' },
      { id: 'tisch', name: 'Tischpflanzen' },
      { id: 'haengend', name: 'Hängepflanzen' },
    ],
  },
  {
    id: 'tapete',
    name: 'Tapeten',
    icon: '🖼️',
    types: [
      { id: 'uni', name: 'Einfarbig' },
      { id: 'muster', name: 'Gemustert' },
      { id: 'material', name: 'Holz, Stein & Fliesen' },
    ],
  },
  {
    id: 'boden',
    name: 'Böden',
    icon: '🟫',
    types: [
      { id: 'dielen', name: 'Dielen' },
      { id: 'parkett', name: 'Parkett' },
      { id: 'fliesen', name: 'Fliesen & Stein' },
      { id: 'weich', name: 'Matten & Teppichboden' },
    ],
  },
  {
    id: 'lieblinge',
    name: 'Lieblingsthemen',
    icon: '💛',
    types: [
      { id: 'kaffee', name: 'Kaffee' },
      { id: 'filme', name: 'Filme, Bücher & Poster' },
      { id: 'tassen', name: 'Sammeltassen' },
      { id: 'sammlungen', name: 'Sammlungen zeigen' },
      { id: 'winston', name: 'Winston' },
    ],
  },
  {
    id: 'garten',
    name: 'Garten',
    icon: '🌷',
    types: [
      { id: 'zaun', name: 'Zäune & Wege' },
      { id: 'sitzen', name: 'Sitzen & Tische' },
      { id: 'licht', name: 'Licht' },
      { id: 'beete', name: 'Beete & Ställe' },
      { id: 'deko', name: 'Deko' },
    ],
  },
  { id: 'winter', name: 'Winterzauber', icon: '❄️', types: [] },
];

export const CATEGORY_BY_ID: Readonly<Record<CatalogCategory, CategoryDef>> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<CatalogCategory, CategoryDef>;

export interface CatalogMeta {
  category: CatalogCategory;
  type: string | null;
  styles: readonly DesignStyle[];
}

// ---------------------------------------------------------------- Zuordnung: Möbel

type Row = [category: CatalogCategory, type: string | null, styles?: DesignStyle[]];

/** Basis-ID → Kategorie, Typ, Stile (nur Dinge, die im Katalog stehen können) */
const FURNITURE_META: Record<string, Row> = {
  // Japanisch
  futon: ['moebel', 'betten', ['japanisch', 'japandi']],
  chabudai: ['moebel', 'tische', ['japanisch', 'japandi']],
  kotatsu: ['moebel', 'tische', ['japanisch']],
  zabuton: ['moebel', 'stuehle', ['japanisch']],
  andon: ['moebel', 'lampen', ['japanisch', 'japandi']],
  tansu: ['moebel', 'regale', ['japanisch']],
  byobu: ['moebel', 'regale', ['japanisch']],
  tsukubai: ['moebel', 'deko', ['japanisch']],
  'tatami-matte': ['moebel', 'teppiche', ['japanisch', 'japandi']],
  teeservice: ['moebel', 'deko', ['japanisch']],
  ikebana: ['moebel', 'deko', ['japanisch', 'japandi']],
  winkekatze: ['moebel', 'deko', ['japanisch']],
  kokeshi: ['moebel', 'deko', ['japanisch']],
  rollbild: ['moebel', 'wanddeko', ['japanisch']],
  bambus: ['pflanzen', 'gross', ['japanisch']],
  bonsai: ['pflanzen', 'tisch', ['japanisch', 'japandi']],
  // Ohne festen Stil: Grundausstattung
  regal: ['moebel', 'regale', ['skandinavisch', 'minimalismus']],
  vorratstruhe: ['moebel', 'regale'],
  stehlampe: ['moebel', 'lampen'],
  fernseher: ['moebel', 'technik'],
  herd: ['moebel', 'technik'],
  sofa: ['moebel', 'sofas'],
  bett: ['moebel', 'betten'],
  wandregal: ['moebel', 'regale', ['skandinavisch']],
  wanduhr: ['moebel', 'wanddeko'],
  wimpelkette: ['moebel', 'wanddeko'],
  fotowand: ['moebel', 'wanddeko'],
  trockenkranz: ['moebel', 'wanddeko', ['cottage']],
  'spiegel-rund': ['moebel', 'wanddeko', ['artdeco']],
  glasvase: ['moebel', 'deko', ['minimalismus']],
  // Pflanzen
  kaktus: ['pflanzen', 'tisch'],
  sukkulenten: ['pflanzen', 'tisch'],
  topfpflanze: ['pflanzen', 'gross'],
  yucca: ['pflanzen', 'gross'],
  gummibaum: ['pflanzen', 'gross', ['retro']],
  haengepflanze: ['pflanzen', 'haengend'],
  kraeutertoepfe: ['pflanzen', 'tisch', ['cottage']],
  // Lieblingsthemen
  'espresso-einsteiger': ['lieblinge', 'kaffee'],
  'espresso-profi': ['lieblinge', 'kaffee'],
  'espresso-hebel': ['lieblinge', 'kaffee'],
  priesterkalender: ['lieblinge', 'filme'],
  'bild-dr-no': ['lieblinge', 'filme'],
  'poster-grusel': ['lieblinge', 'filme'],
  'bild-winston': ['lieblinge', 'winston'],
  insektenkasten: ['lieblinge', 'sammlungen'],
  fischtafel: ['lieblinge', 'sammlungen'],
  tassenbord: ['lieblinge', 'tassen'],
  // Cottagecore
  landhaustisch: ['moebel', 'tische', ['cottage']],
  bluemchensessel: ['moebel', 'sofas', ['cottage']],
  haekelteppich: ['moebel', 'teppiche', ['cottage']],
  kerzenleuchter: ['moebel', 'lampen', ['cottage']],
  wollkorb: ['moebel', 'deko', ['cottage']],
  // Retro-Oma-Chic
  ohrensessel: ['moebel', 'sofas', ['retro', 'darkacademia']],
  nierentisch: ['moebel', 'tische', ['retro', 'midcentury']],
  fransenlampe: ['moebel', 'lampen', ['retro']],
  bonbonschale: ['moebel', 'deko', ['retro']],
  perserteppich: ['moebel', 'teppiche', ['retro', 'darkacademia']],
  // Contemporary
  loungesofa: ['moebel', 'sofas', ['modern']],
  marmortisch: ['moebel', 'tische', ['modern', 'artdeco']],
  bogenlampe: ['moebel', 'lampen', ['modern', 'midcentury']],
  wuerfelregal: ['moebel', 'regale', ['modern', 'skandinavisch']],
  sitzsack: ['moebel', 'sofas', ['modern']],
  keramikvase: ['moebel', 'deko', ['modern', 'japandi', 'minimalismus']],
  // Mid-Century-Modern (inkl. Bauhaus)
  lederloungesessel: ['moebel', 'sofas', ['midcentury']],
  freischwinger: ['moebel', 'stuehle', ['midcentury', 'bauhaus', 'industrial']],
  teaksideboard: ['moebel', 'regale', ['midcentury']],
  satztische: ['moebel', 'tische', ['midcentury']],
  tripodlampe: ['moebel', 'lampen', ['midcentury']],
  'opal-leuchte': ['moebel', 'lampen', ['midcentury', 'bauhaus', 'spaceage']],
  formenteppich: ['moebel', 'teppiche', ['midcentury', 'bauhaus']],
  'hellerau-regal': ['moebel', 'regale', ['midcentury', 'skandinavisch']],
  'hellerau-regalwand': ['moebel', 'regale', ['midcentury', 'skandinavisch']],
  'hellerau-standregal': ['moebel', 'regale', ['midcentury', 'skandinavisch']],
  formenbild: ['moebel', 'wanddeko', ['midcentury', 'bauhaus']],
  sonnenspiegel: ['moebel', 'wanddeko', ['midcentury', 'artdeco']],
  // Französisches Bistro
  bistrotisch: ['moebel', 'tische', ['bistro']],
  bistrostuhl: ['moebel', 'stuehle', ['bistro']],
  bistrobank: ['moebel', 'sofas', ['bistro']],
  kugelleuchte: ['moebel', 'lampen', ['bistro', 'artdeco']],
  messingleuchte: ['moebel', 'lampen', ['bistro', 'artdeco']],
  'schild-toilette': ['moebel', 'wanddeko', ['bistro']],
  barhocker: ['moebel', 'stuehle', ['bistro']],
  zinktheke: ['moebel', 'tische', ['bistro', 'industrial']],
  kreidetafel: ['moebel', 'wanddeko', ['bistro']],
  weinregal: ['moebel', 'regale', ['bistro']],
  bistrolampe: ['moebel', 'lampen', ['bistro', 'darkacademia']],
  goldspiegel: ['moebel', 'wanddeko', ['bistro', 'artdeco']],
  etagere: ['moebel', 'deko', ['bistro']],
  eiffelmodell: ['moebel', 'deko', ['bistro']],
  bistrolaeufer: ['moebel', 'teppiche', ['bistro']],
  // Japandi
  'japandi-daybed': ['moebel', 'sofas', ['japandi']],
  lattenregal: ['moebel', 'regale', ['japandi', 'minimalismus']],
  papierleuchte: ['moebel', 'lampen', ['japandi', 'skandinavisch']],
  linienbild: ['moebel', 'wanddeko', ['japandi', 'minimalismus']],
  // Skandinavisch
  'skandi-sofa': ['moebel', 'sofas', ['skandinavisch']],
  schaukelstuhl: ['moebel', 'sofas', ['skandinavisch']],
  'skandi-esstisch': ['moebel', 'tische', ['skandinavisch', 'japandi']],
  'skandi-stuhl': ['moebel', 'stuehle', ['skandinavisch', 'japandi']],
  rautenteppich: ['moebel', 'teppiche', ['skandinavisch']],
  schaffell: ['moebel', 'teppiche', ['skandinavisch']],
  // Minimalismus
  'kubus-sofa': ['moebel', 'sofas', ['minimalismus']],
  plattformbett: ['moebel', 'betten', ['minimalismus', 'japandi']],
  linienleuchte: ['moebel', 'lampen', ['minimalismus']],
  plattentisch: ['moebel', 'tische', ['minimalismus']],
  wollteppich: ['moebel', 'teppiche', ['minimalismus', 'japandi', 'skandinavisch']],
  // Dark Academia
  buecherwand: ['moebel', 'regale', ['darkacademia']],
  sekretaer: ['moebel', 'tische', ['darkacademia', 'retro']],
  chesterfield: ['moebel', 'sofas', ['darkacademia', 'industrial']],
  weltkarte: ['moebel', 'wanddeko', ['darkacademia']],
  // Art déco
  muschelsessel: ['moebel', 'sofas', ['artdeco']],
  etagenlampe: ['moebel', 'lampen', ['artdeco']],
  barschrank: ['moebel', 'regale', ['artdeco']],
  faecherteppich: ['moebel', 'teppiche', ['artdeco']],
  // Industrial
  ledersofa: ['moebel', 'sofas', ['industrial']],
  stahlregal: ['moebel', 'regale', ['industrial']],
  fabrikleuchte: ['moebel', 'lampen', ['industrial']],
  vintageteppich: ['moebel', 'teppiche', ['industrial']],
  bahnhofsuhr: ['moebel', 'wanddeko', ['industrial']],
  // Space Age
  kugelsessel: ['moebel', 'sofas', ['spaceage']],
  tulpentisch: ['moebel', 'tische', ['spaceage', 'midcentury']],
  kapselregal: ['moebel', 'regale', ['spaceage']],
  lavalampe: ['moebel', 'lampen', ['spaceage']],
  planetenteppich: ['moebel', 'teppiche', ['spaceage']],
  // Cyberpunk
  gamingstuhl: ['moebel', 'stuehle', ['cyberpunk']],
  neonsofa: ['moebel', 'sofas', ['cyberpunk']],
  zockertisch: ['moebel', 'tische', ['cyberpunk']],
  serverregal: ['moebel', 'regale', ['cyberpunk']],
  neonroehre: ['moebel', 'wanddeko', ['cyberpunk']],
  rgbleuchte: ['moebel', 'lampen', ['cyberpunk']],
  gitterteppich: ['moebel', 'teppiche', ['cyberpunk']],
  // Brutalismus
  betonsofa: ['moebel', 'sofas', ['brutalismus']],
  betontisch: ['moebel', 'tische', ['brutalismus', 'industrial']],
  blockregal: ['moebel', 'regale', ['brutalismus', 'industrial']],
  betonleuchte: ['moebel', 'lampen', ['brutalismus']],
  filzteppich: ['moebel', 'teppiche', ['brutalismus', 'minimalismus']],
  betonrelief: ['moebel', 'wanddeko', ['brutalismus']],
  // Memphis
  memphissessel: ['moebel', 'sofas', ['memphis']],
  memphistisch: ['moebel', 'tische', ['memphis']],
  totemregal: ['moebel', 'regale', ['memphis']],
  memphislampe: ['moebel', 'lampen', ['memphis']],
  kringelteppich: ['moebel', 'teppiche', ['memphis']],
  // Besondere Stücke
  haengesessel: ['moebel', 'sofas', ['skandinavisch', 'cottage']],
  kuehlschrank: ['moebel', 'technik', ['retro', 'midcentury']],
  wandkamin: ['moebel', 'besonderes', ['darkacademia', 'cottage', 'retro']],
  aquarium: ['moebel', 'besonderes'],
  spielautomat: ['moebel', 'besonderes', ['cyberpunk']],
  jukebox: ['moebel', 'besonderes', ['retro', 'midcentury']],
  popcornmaschine: ['lieblinge', 'filme'],
  teleskop: ['moebel', 'besonderes', ['spaceage', 'darkacademia']],
  pflanzenleiter: ['pflanzen', 'gross', ['skandinavisch', 'japandi']],
  // Bauhaus
  'wassily-sessel': ['moebel', 'sofas', ['bauhaus']],
  'cesca-stuhl': ['moebel', 'stuehle', ['bauhaus', 'midcentury']],
  'barcelona-sessel': ['moebel', 'sofas', ['bauhaus', 'modern']],
  'laccio-stuhl': ['moebel', 'stuehle', ['bauhaus', 'minimalismus']],
  'laccio-tisch': ['moebel', 'tische', ['bauhaus', 'minimalismus']],
  'mies-sofa': ['moebel', 'sofas', ['bauhaus', 'modern']],
  'barcelona-liege': ['moebel', 'sofas', ['bauhaus']],
  'lc4-liege': ['moebel', 'sofas', ['bauhaus', 'modern']],
  'wagenfeld-leuchte': ['moebel', 'lampen', ['bauhaus']],
  'kandem-leuchte': ['moebel', 'lampen', ['bauhaus', 'industrial']],
  'breuer-regal': ['moebel', 'regale', ['bauhaus']],
  'bauhaus-wandschrank': ['moebel', 'regale', ['bauhaus']],
  stahlrohrregal: ['moebel', 'regale', ['bauhaus', 'industrial']],
  // Garten
  'zaun-weiss': ['garten', 'zaun'],
  gartentor: ['garten', 'zaun'],
  'weg-holz': ['garten', 'zaun'],
  'weg-kies': ['garten', 'zaun'],
  'weg-pflaster': ['garten', 'zaun'],
  gartenbank: ['garten', 'sitzen'],
  gartentisch: ['garten', 'sitzen'],
  gartenstuhl: ['garten', 'sitzen'],
  sonnenschirm: ['garten', 'sitzen'],
  lichterkette: ['garten', 'licht'],
  gartenlaterne: ['garten', 'licht'],
  windlicht: ['garten', 'licht'],
  blumenkuebel: ['garten', 'deko'],
  vogeltraenke: ['garten', 'deko'],
  gartenwichtel: ['garten', 'deko'],
  fruehbeet: ['garten', 'beete'],
  gewaechshaus: ['garten', 'beete'],
  hochbeet: ['garten', 'beete'],
  huehnerstall: ['garten', 'beete'],
  wachtelstall: ['garten', 'beete'],
};

/** Kategorie/Typ/Stile eines Möbels (Basis-ID). Poster, Bildbände, Tassen und Winterzauber kommen aus ihren Quellen. */
function furnitureMeta(def: FurnitureDef): CatalogMeta | null {
  const row = FURNITURE_META[def.id];
  if (row) return { category: row[0], type: row[1], styles: row[2] ?? [] };
  if (def.style === 'winter') return { category: 'winter', type: null, styles: [] };
  if (POSTER_IDS.has(def.id)) return { category: 'lieblinge', type: 'filme', styles: [] };
  if (TASSEN_IDS.has(def.id)) return { category: 'lieblinge', type: 'tassen', styles: [] };
  return null;
}

const POSTER_IDS = new Set(POSTERS.map((p) => p.id));
const TASSEN_IDS = new Set(TASSEN.map((t) => t.id));

// ---------------------------------------------------------------- Zuordnung: Tapeten & Böden

/** Stile der Wände und Böden (alle anderen: ohne Stil) */
const SURFACE_STYLES: Record<string, DesignStyle[]> = {
  'tapete-shoji': ['japanisch', 'japandi'],
  'tapete-kalkputz': ['japandi', 'minimalismus'],
  'tapete-sichtbeton': ['brutalismus', 'industrial'],
  'tapete-memphis': ['memphis'],
  'boden-terrazzo-bunt': ['memphis'],
  'tapete-neongitter': ['cyberpunk'],
  'tapete-orbit': ['spaceage'],
  'boden-glanzweiss': ['spaceage', 'minimalismus'],
  'boden-metall': ['cyberpunk', 'industrial'],
  'tapete-bibliothek': ['darkacademia'],
  'tapete-faecher': ['artdeco'],
  'tapete-holzlatten': ['japandi', 'skandinavisch'],
  'boden-mikrozement': ['minimalismus', 'modern'],
  'tapete-kirschblueten': ['japanisch'],
  'tapete-wellen': ['japanisch'],
  'tapete-bluemchen': ['cottage'],
  'tapete-salbei': ['cottage'],
  'tapete-tannen': ['cottage'],
  'tapete-uni-salbei': ['cottage', 'japandi'],
  'tapete-kreise': ['retro'],
  'tapete-ranken': ['retro'],
  'tapete-vorhang-rot': ['retro', 'artdeco'],
  'tapete-anthrazit': ['modern', 'minimalismus'],
  'tapete-terrazzo': ['modern', 'memphis'],
  'tapete-uni-grau': ['modern', 'minimalismus'],
  'tapete-uni-weiss': ['minimalismus', 'skandinavisch'],
  'tapete-uni-taupe': ['modern', 'japandi'],
  'tapete-uni-graublau': ['modern', 'skandinavisch'],
  'tapete-uni-petrol': ['modern'],
  'tapete-uni-nachtblau': ['modern', 'artdeco'],
  'tapete-uni-schwarz': ['modern'],
  'tapete-uni-waldgruen': ['cottage', 'darkacademia'],
  'tapete-uni-bordeaux': ['retro', 'darkacademia'],
  'tapete-formen': ['midcentury', 'bauhaus'],
  'tapete-atomic': ['midcentury', 'spaceage'],
  'tapete-bistro': ['bistro'],
  'tapete-bistro-putz': ['bistro'],
  'tapete-metro': ['bistro'],
  'tapete-backstein': ['industrial'],
  'boden-tatami': ['japanisch'],
  'boden-dunkel': ['japanisch'],
  'boden-landhaus': ['cottage'],
  'boden-dielen-weiss': ['cottage', 'skandinavisch'],
  'boden-schiff-weiss': ['cottage'],
  'boden-fischgraet-weiss': ['cottage'],
  'boden-flecht-ahorn': ['cottage'],
  'boden-fischgraet': ['retro'],
  'boden-fischgraet-nuss': ['retro', 'darkacademia'],
  'boden-flecht-eiche': ['retro'],
  'boden-zickzack': ['retro', 'artdeco'],
  'boden-beton': ['modern', 'industrial', 'brutalismus', 'minimalismus'],
  'boden-dielen-birke': ['modern', 'skandinavisch', 'japandi'],
  'boden-dielen-esche': ['modern', 'skandinavisch', 'japandi'],
  'boden-dielen-hellgrau': ['modern', 'skandinavisch'],
  'boden-chevron-birke': ['modern', 'skandinavisch'],
  'boden-chevron-weiss': ['modern', 'minimalismus'],
  'boden-chevron-eiche': ['modern'],
  'boden-chevron-grau': ['modern', 'industrial'],
  'boden-fischgraet-ebenholz': ['modern', 'artdeco'],
  'boden-schiff-treibholz': ['modern'],
  'boden-schiff-schwarz': ['modern', 'industrial'],
  'boden-nussbaum': ['midcentury'],
  'boden-chevron-nuss': ['midcentury', 'darkacademia'],
  'boden-schach': ['midcentury', 'artdeco', 'bauhaus'],
  'boden-tafel-eiche': ['midcentury'],
  'boden-tafel-nuss': ['midcentury', 'darkacademia'],
  'boden-bistro': ['bistro'],
  'boden-hexmosaik': ['bistro'],
};

const WALL_MATERIAL = new Set(['kacheln', 'backstein', 'glas', 'vertaefelung', 'shoji', 'putz', 'latten', 'sichtbeton']);
const FLOOR_TYPE: Record<string, string> = {
  dielen: 'dielen',
  schiff: 'dielen',
  chevron: 'parkett',
  fischgraet: 'parkett',
  flecht: 'parkett',
  tafel: 'parkett',
  schach: 'fliesen',
  hexmosaik: 'fliesen',
  terrakotta: 'fliesen',
  beton: 'fliesen',
  putz: 'fliesen',
  flach: 'fliesen',
  riffel: 'fliesen',
  terrazzo: 'fliesen',
  zickzack: 'fliesen',
  tatami: 'weich',
  teppich: 'weich',
};

function surfaceMeta(s: SurfaceDef): CatalogMeta {
  const styles = SURFACE_STYLES[s.id] ?? [];
  if (s.kind === 'tapete') {
    const type = s.pattern === 'flach' || s.pattern === 'uni' ? 'uni' : WALL_MATERIAL.has(s.pattern) ? 'material' : 'muster';
    return { category: 'tapete', type, styles };
  }
  return { category: 'boden', type: FLOOR_TYPE[s.pattern] ?? 'fliesen', styles };
}

// ---------------------------------------------------------------- Abfrage

const META: Map<string, CatalogMeta> = new Map();
for (const f of FURNITURE) {
  const m = furnitureMeta(f);
  if (m) META.set(f.id, m);
}
for (const s of [...WALLPAPERS, ...FLOORS]) META.set(s.id, surfaceMeta(s));

/** Katalog-Ordnung eines Möbels (Basis-ID) oder einer Tapete/eines Bodens; `null` = nicht eingeordnet */
export function catalogMeta(id: string): CatalogMeta | null {
  return META.get(id) ?? null;
}

/** Nur für Tests: alle eingetragenen Möbel-IDs der Zuordnungstabelle */
export const FURNITURE_META_IDS: readonly string[] = Object.keys(FURNITURE_META);
