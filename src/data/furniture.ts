/**
 * Möbel, Tapeten und Böden für Linas Haus.
 *
 * Neue Möbel: hier eintragen und in `world3d/models/furniture.ts` ein Modell
 * (`model`) bauen. Möbel mit Farbvarianten werden automatisch zu mehreren
 * Gegenständen (`zabuton-rosa`, `zabuton-indigo` …).
 */

export type FurnitureStyle = 'japanisch' | 'basis' | 'handgemacht';

export interface FurnitureDef {
  /** Basis-ID (ohne Variante) */
  id: string;
  name: string;
  style: FurnitureStyle;
  price: number;
  /** Grundfläche in Feldern (ungedreht): Breite (x) × Tiefe (z) */
  w: number;
  d: number;
  /** Auf der Oberfläche kann Kleines stehen */
  surface?: boolean;
  /** Höhe der Oberfläche (für Deko darauf), in Feldern */
  surfaceHeight?: number;
  /** Klein genug für Tische & Kommoden */
  small?: boolean;
  /** Teppich: man kann darüber laufen, Möbel darauf stellen */
  rug?: boolean;
  /** Man kann sich hinsetzen (Kissen) bzw. hinlegen (Futon) */
  sit?: 'sitzen' | 'liegen';
  /** Leuchtet abends */
  light?: boolean;
  description: string;
  /** Nur an der Werkbank zu bauen (nicht im Katalog) */
  crafted?: boolean;
  /** Farbvarianten (Name → Farbe); ohne = eine Variante */
  variants?: Record<string, string>;
}

export const FURNITURE: readonly FurnitureDef[] = [
  { id: 'futon', name: 'Futon', style: 'japanisch', price: 800, w: 1, d: 2, sit: 'liegen', description: 'Weich gepolstert zum Schlafen auf dem Boden. Morgens zusammenrollen? Ach was.', variants: { rosa: '#f7c6d4', indigo: '#5b6fa8', creme: '#f3ead8' } },
  { id: 'chabudai', name: 'Chabudai', style: 'japanisch', price: 600, w: 1, d: 1, surface: true, surfaceHeight: 0.32, description: 'Ein niedriger, runder Tisch. Perfekt für Tee und Gespräche.' },
  { id: 'kotatsu', name: 'Kotatsu', style: 'japanisch', price: 1400, w: 2, d: 2, surface: true, surfaceHeight: 0.42, description: 'Ein Tisch mit Heizdecke darunter. Wer einmal drunter sitzt, steht nie wieder auf.', variants: { rot: '#d9534f', blau: '#5b7fc2', gruen: '#6fa86a' } },
  { id: 'zabuton', name: 'Zabuton', style: 'japanisch', price: 180, w: 1, d: 1, sit: 'sitzen', description: 'Ein dickes Sitzkissen für den Boden.', variants: { rosa: '#f4a3b8', indigo: '#4f5f98', senf: '#e0b04a' } },
  { id: 'andon', name: 'Andon-Laterne', style: 'japanisch', price: 450, w: 1, d: 1, light: true, description: 'Eine Laterne aus Papier und Holz. Leuchtet abends ganz warm.' },
  { id: 'tansu', name: 'Tansu-Kommode', style: 'japanisch', price: 1200, w: 2, d: 1, surface: true, surfaceHeight: 0.8, description: 'Eine Kommode aus dunklem Holz mit Metallbeschlägen und vielen Schubladen.' },
  { id: 'byobu', name: 'Byōbu-Wandschirm', style: 'japanisch', price: 900, w: 2, d: 1, description: 'Ein Faltschirm mit gemalten Kirschblüten.' },
  { id: 'bambus', name: 'Bambus im Topf', style: 'japanisch', price: 350, w: 1, d: 1, description: 'Grün, schlank und pflegeleicht. Glück für das Zuhause.' },
  { id: 'tsukubai', name: 'Zimmerbrunnen', style: 'japanisch', price: 1000, w: 1, d: 1, description: 'Ein kleiner Steinbrunnen mit Bambusrohr. Plätschert beruhigend.' },
  { id: 'tatami-matte', name: 'Tatami-Matte', style: 'japanisch', price: 400, w: 2, d: 2, rug: true, description: 'Eine Matte aus Reisstroh. Riecht ein bisschen nach Sommerwiese.' },
  { id: 'bonsai', name: 'Bonsai', style: 'japanisch', price: 700, w: 1, d: 1, small: true, description: 'Ein winziger, uralter Baum. Er braucht viel Liebe und eine kleine Schere.' },
  { id: 'teeservice', name: 'Teeservice', style: 'japanisch', price: 300, w: 1, d: 1, small: true, description: 'Eine Kanne und zwei Schälchen für grünen Tee.' },
  { id: 'ikebana', name: 'Ikebana-Vase', style: 'japanisch', price: 380, w: 1, d: 1, small: true, description: 'Ein schlichtes Blumengesteck. Weniger ist mehr.' },
  { id: 'winkekatze', name: 'Winkekatze', style: 'japanisch', price: 500, w: 1, d: 1, small: true, description: 'Winkt fröhlich und soll Glück bringen. Oma findet sie „ein bisschen unheimlich“.' },
  { id: 'kokeshi', name: 'Kokeshi-Puppe', style: 'japanisch', price: 260, w: 1, d: 1, small: true, description: 'Eine kleine bemalte Holzpuppe mit rundem Kopf.' },
  { id: 'regal', name: 'Holzregal', style: 'basis', price: 500, w: 2, d: 1, surface: true, surfaceHeight: 0.9, description: 'Ein schlichtes Regal aus hellem Holz.' },
  { id: 'stehlampe', name: 'Stehlampe', style: 'basis', price: 400, w: 1, d: 1, light: true, description: 'Eine Lampe mit rundem Schirm für gemütliches Licht.' },
  // Handgemacht an Opas Werkbank (siehe `recipes.ts`) – Preis = Verkaufswert × 4
  { id: 'ast-hocker', name: 'Ast-Hocker', style: 'handgemacht', crafted: true, price: 120, w: 1, d: 1, sit: 'sitzen', description: 'Ein kleiner Hocker aus Ästen. Wackelt ein bisschen – das gehört so.' },
  { id: 'blumenvase', name: 'Wildblumenvase', style: 'handgemacht', crafted: true, price: 100, w: 1, d: 1, small: true, description: 'Ein Kieselstein-Töpfchen voller Wildblumen. Bringt die Wiese ins Haus.' },
  { id: 'hundekoerbchen', name: 'Hundekörbchen', style: 'handgemacht', crafted: true, price: 200, w: 1, d: 1, description: 'Ein geflochtenes Körbchen mit Kissen. Genau dackelgroß.' },
  { id: 'steinlaterne', name: 'Steinlaterne', style: 'handgemacht', crafted: true, price: 240, w: 1, d: 1, light: true, description: 'Eine kleine Laterne aus aufgeschichteten Steinen. Leuchtet abends warm.' },
  { id: 'muschellampe', name: 'Muschellampe', style: 'handgemacht', crafted: true, price: 260, w: 1, d: 1, small: true, light: true, description: 'Ein Lämpchen mit Muschelschirm. Klingt fast nach Meer, wenn man es anknipst.' },
  { id: 'treibholzregal', name: 'Astregal', style: 'handgemacht', crafted: true, price: 320, w: 2, d: 1, surface: true, surfaceHeight: 0.8, description: 'Ein Regal aus vielen Ästen. Christin findet es „erstaunlich gerade“.' },
  { id: 'seestern-deko', name: 'Seestern-Deko', style: 'handgemacht', crafted: true, price: 360, w: 1, d: 1, small: true, description: 'Ein Seestern auf einem Muschelbett. Ein kleines Stück Strand.' },
  { id: 'glitzerlampe', name: 'Glitzerlicht', style: 'handgemacht', crafted: true, price: 600, w: 1, d: 1, small: true, light: true, description: 'Ein Glitzerstein auf einem Steinsockel. Funkelt abends in allen Farben.' },
  { id: 'kieselmosaik', name: 'Kieselmosaik', style: 'handgemacht', crafted: true, price: 200, w: 2, d: 2, rug: true, description: 'Viele glatte Kiesel, zu einem runden Muster gelegt. Kühl unter den Füßen.' },
  { id: 'topfpflanze', name: 'Monstera', style: 'basis', price: 300, w: 1, d: 1, description: 'Große, grüne Blätter mit Löchern. Sehr fotogen.' },
];

export interface SurfaceDef {
  id: string;
  name: string;
  style: FurnitureStyle;
  price: number;
  kind: 'tapete' | 'boden';
  /** Zeichenmuster (siehe `gfx/interior.ts`) */
  pattern: string;
  color: string;
  accent: string;
  description: string;
}

export const WALLPAPERS: readonly SurfaceDef[] = [
  { id: 'tapete-creme', name: 'Cremeweiße Tapete', style: 'basis', price: 300, kind: 'tapete', pattern: 'uni', color: '#f7efe2', accent: '#eadfcd', description: 'Schlicht und hell. Passt zu allem.' },
  { id: 'tapete-shoji', name: 'Shoji-Wand', style: 'japanisch', price: 900, kind: 'tapete', pattern: 'shoji', color: '#fbf6ea', accent: '#a97c56', description: 'Papierwände mit Holzgitter – das Licht scheint sanft hindurch.' },
  { id: 'tapete-kirschblueten', name: 'Washi mit Kirschblüten', style: 'japanisch', price: 800, kind: 'tapete', pattern: 'sakura', color: '#fdeff2', accent: '#f4a3b8', description: 'Zartrosa Papiertapete mit Kirschblüten.' },
  { id: 'tapete-wellen', name: 'Seigaiha-Wellen', style: 'japanisch', price: 800, kind: 'tapete', pattern: 'wellen', color: '#e6eef7', accent: '#5b7fc2', description: 'Ein altes Wellenmuster, das Glück und Ruhe bringen soll.' },
  { id: 'tapete-rosa', name: 'Pastellrosa Tapete', style: 'basis', price: 400, kind: 'tapete', pattern: 'streifen', color: '#fbe0e8', accent: '#f6cfdb', description: 'Ganz zarte Streifen in Rosa.' },
];

export const FLOORS: readonly SurfaceDef[] = [
  { id: 'boden-dielen', name: 'Helle Holzdielen', style: 'basis', price: 300, kind: 'boden', pattern: 'dielen', color: '#e6c59c', accent: '#cfa175', description: 'Warmer, heller Holzboden.' },
  { id: 'boden-tatami', name: 'Tatami-Boden', style: 'japanisch', price: 1000, kind: 'boden', pattern: 'tatami', color: '#d9d49a', accent: '#5a5a3a', description: 'Der ganze Raum mit Tatami-Matten ausgelegt.' },
  { id: 'boden-dunkel', name: 'Dunkles Holz', style: 'japanisch', price: 700, kind: 'boden', pattern: 'dielen', color: '#8a5a3a', accent: '#6e4630', description: 'Dunkles, poliertes Holz wie in einem alten Teehaus.' },
  { id: 'boden-teppich', name: 'Rosa Teppichboden', style: 'basis', price: 500, kind: 'boden', pattern: 'teppich', color: '#f7c6d4', accent: '#f4b3c6', description: 'Flauschig und weich unter den Füßen.' },
];

export const STYLE_LABELS: Record<FurnitureStyle, string> = { japanisch: 'Japanisch', basis: 'Basis', handgemacht: 'Handgemacht' };

/** Möbel-Gegenstand (mit Variante) → Basis + Farbe */
export interface FurnitureItem {
  itemId: string;
  def: FurnitureDef;
  variant: string | null;
  color: string | null;
}

export const FURNITURE_ITEMS: readonly FurnitureItem[] = FURNITURE.flatMap((def): FurnitureItem[] =>
  def.variants
    ? Object.entries(def.variants).map(([v, color]) => ({ itemId: `${def.id}-${v}`, def, variant: v, color }))
    : [{ itemId: def.id, def, variant: null, color: null }],
);

export const FURNITURE_BY_ITEM: Readonly<Record<string, FurnitureItem>> = Object.fromEntries(FURNITURE_ITEMS.map((f) => [f.itemId, f]));
export const SURFACE_BY_ID: Readonly<Record<string, SurfaceDef>> = Object.fromEntries([...WALLPAPERS, ...FLOORS].map((s) => [s.id, s]));

export const VARIANT_LABELS: Record<string, string> = { rosa: 'Rosa', indigo: 'Indigo', creme: 'Creme', rot: 'Rot', blau: 'Blau', gruen: 'Grün', senf: 'Senfgelb' };


/** Raum-Infos für die Raumlogik (`core/room.ts`) */
export function furnitureInfo(itemId: string) {
  const f = FURNITURE_BY_ITEM[itemId];
  return f ? { w: f.def.w, d: f.def.d, rug: f.def.rug, small: f.def.small, surface: f.def.surface } : undefined;
}
