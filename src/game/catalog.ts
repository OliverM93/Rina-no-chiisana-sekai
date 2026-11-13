/**
 * Möbelkatalog: welche Einträge gibt es gerade, und welche passen zu Kategorie × Typ × Stil?
 * Reine Logik (ohne DOM) – die Oberfläche steht in `ui/CatalogPanel.tsx`, die Ordnung in `data/catalog.ts`.
 */
import { CATEGORIES, type CatalogCategory, type CatalogMeta, catalogMeta, DESIGN_STYLE_BY_ID, DESIGN_STYLES, type DesignStyle } from '../data/catalog';
import { FLOORS, FURNITURE, type FurnitureDef, VARIANT_LABELS, WALLPAPERS, variantItemId } from '../data/furniture';
import type { Season } from '../core/time';
import type { Session } from './session';

/** Filterwert der Stil-Zeile: alle, nur Stilloses oder ein bestimmter Stil */
export type StyleFilter = 'alle' | 'ohne' | DesignStyle;

export interface CatalogEntry {
  /** Basis-ID (Möbel) bzw. Tapete/Boden */
  id: string;
  name: string;
  price: number;
  description: string;
  meta: CatalogMeta;
  /** Kauf-IDs (Farbvarianten) */
  variants: Array<{ itemId: string; label: string; color: string | null }>;
  /** Größe/Art als kurzer Text (nur Möbel) */
  size?: string;
}

/** Was die Freischaltung braucht – so bleibt die Logik ohne ganze Session testbar */
export interface CatalogContext {
  flags: Readonly<Record<string, boolean | undefined>>;
  season: Season;
}

export function catalogContext(session: Session, season: Season): CatalogContext {
  return { flags: session.data?.flags ?? {}, season };
}

/** Ist dieser Einrichtungsstil schon im Katalog? (manche kommen mit einem Einzug, siehe `data/catalog.ts`) */
export function designStyleUnlocked(ctx: CatalogContext, style: DesignStyle): boolean {
  const npc = DESIGN_STYLE_BY_ID[style].arrivesWith;
  return !npc || !!ctx.flags[`${npc}Begruesst`];
}

/**
 * Die „Linie“ eines Stücks (`FurnitureDef.style`) entscheidet, ob es im Katalog steht: Ist sie ein Einrichtungsstil, der
 * mit einem Einzug kommt (Bistro, später die neuen Sets), erst danach. Die Stil-Schilder (`meta.styles`) filtern nur –
 * so verschwindet nie etwas, das schon da war (z. B. das Wandregal, das jetzt auch „Skandinavisch“ heißt).
 */
export function lineUnlocked(ctx: CatalogContext, line: string): boolean {
  return !(line in DESIGN_STYLE_BY_ID) || designStyleUnlocked(ctx, line as DesignStyle);
}

/** Merk-Flag: Lina hat diesen Stil im Katalog schon einmal angeschaut (dann verschwindet das „neu“ am Chip) */
export const styleSeenFlag = (style: DesignStyle): string => `stil-gesehen-${style}`;

/** Gibt es zu diesem Stil ein „neu“? – nur Stile, die mit einem Einzug kommen, schon frei sind und noch nicht angeschaut wurden */
export function isNewStyle(ctx: CatalogContext, style: DesignStyle): boolean {
  return !!DESIGN_STYLE_BY_ID[style].arrivesWith && designStyleUnlocked(ctx, style) && !ctx.flags[styleSeenFlag(style)];
}

/** Lina schaut einen Stil an → das „neu“ geht weg (kein Spielstand-Formatwechsel: ein einfaches Flag) */
export function markStyleSeen(session: Session, style: DesignStyle): void {
  if (!session.data || session.data.flags[styleSeenFlag(style)]) return;
  session.setFlag(styleSeenFlag(style));
  session.changed();
  session.save();
}

/** Nur die Stile, die schon frei sind (für Filter-Chips und die Detailzeile) */
export function shownStyles(ctx: CatalogContext, styles: readonly DesignStyle[]): DesignStyle[] {
  return styles.filter((s) => designStyleUnlocked(ctx, s));
}

function furnitureSize(f: FurnitureDef): string {
  if (f.wall) return `🖼️ Wand-Deko, ${f.w} breit (Möbel passen darunter)`;
  if (f.small) return 'klein (passt auf Tische)';
  if (f.rug) return `Teppich ${f.w}×${f.d}`;
  return `${f.w}×${f.d} Felder`;
}

/** Alle Einträge, die jetzt im Katalog stehen (Saisonware nur in ihrer Saison, Gesperrtes nicht) */
export function catalogEntries(ctx: CatalogContext): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const f of FURNITURE) {
    if (f.crafted || f.gift || f.retired) continue;
    if (f.seasonal && ctx.season !== 'winter') continue;
    if (f.inSeason && f.inSeason !== ctx.season) continue;
    const meta = catalogMeta(f.id);
    if (!meta || !lineUnlocked(ctx, f.style)) continue;
    out.push({
      id: f.id,
      name: f.name,
      price: f.price,
      description: f.description,
      meta: { ...meta, styles: shownStyles(ctx, meta.styles) },
      size: furnitureSize(f),
      variants: f.variants
        ? Object.entries(f.variants).map(([v, color]) => ({ itemId: variantItemId(f, v), label: VARIANT_LABELS[v] ?? v, color }))
        : [{ itemId: f.id, label: '', color: null }],
    });
  }
  for (const s of [...WALLPAPERS, ...FLOORS]) {
    const meta = catalogMeta(s.id);
    if (!meta || !lineUnlocked(ctx, s.style)) continue;
    out.push({ id: s.id, name: s.name, price: s.price, description: s.description, meta: { ...meta, styles: shownStyles(ctx, meta.styles) }, variants: [{ itemId: s.id, label: '', color: null }] });
  }
  return out;
}

/** Kategorien mit mindestens einem Eintrag (Winterzauber also nur im Winter) */
export function availableCategories(entries: readonly CatalogEntry[]): CatalogCategory[] {
  return CATEGORIES.filter((c) => entries.some((e) => e.meta.category === c.id)).map((c) => c.id);
}

function matchesStyle(e: CatalogEntry, style: StyleFilter): boolean {
  if (style === 'alle') return true;
  if (style === 'ohne') return e.meta.styles.length === 0;
  return e.meta.styles.includes(style);
}

/** Stile, die es in dieser Kategorie gibt (Reihenfolge wie `DESIGN_STYLES`); „ohne“ nur, wenn es Stilloses und Gestyltes gibt */
export function availableStyles(entries: readonly CatalogEntry[], category: CatalogCategory): StyleFilter[] {
  const inCat = entries.filter((e) => e.meta.category === category);
  const styles = DESIGN_STYLES.map((s) => s.id).filter((s) => inCat.some((e) => e.meta.styles.includes(s)));
  if (styles.length === 0) return [];
  const hasPlain = inCat.some((e) => e.meta.styles.length === 0);
  return ['alle', ...(hasPlain ? (['ohne'] as const) : []), ...styles];
}

/** Typen dieser Kategorie, die es im gewählten Stil gibt (sonst bleibt die Zeile leer) */
export function availableTypes(entries: readonly CatalogEntry[], category: CatalogCategory, style: StyleFilter): string[] {
  const cat = CATEGORIES.find((c) => c.id === category);
  if (!cat || cat.types.length === 0) return [];
  const pool = entries.filter((e) => e.meta.category === category && matchesStyle(e, style));
  const types = cat.types.map((t) => t.id).filter((t) => pool.some((e) => e.meta.type === t));
  return types.length > 1 ? ['alle', ...types] : [];
}

export interface CatalogFilter {
  category: CatalogCategory;
  type: string;
  style: StyleFilter;
}

/**
 * Wirksamer Filter: Ein Stil, den es in der Kategorie nicht gibt, oder ein Typ, den es im Stil nicht gibt,
 * zählt als „alle“ – die Wahl bleibt aber gemerkt, falls man zurückwechselt.
 */
export function effectiveFilter(entries: readonly CatalogEntry[], f: CatalogFilter): CatalogFilter {
  const styles = availableStyles(entries, f.category);
  const style = styles.includes(f.style) ? f.style : 'alle';
  const types = availableTypes(entries, f.category, style);
  const type = types.includes(f.type) ? f.type : 'alle';
  return { category: f.category, type, style };
}

/** Treffer für Kategorie × Typ × Stil (vorher `effectiveFilter` anwenden) */
export function filterEntries(entries: readonly CatalogEntry[], f: CatalogFilter): CatalogEntry[] {
  return entries.filter((e) => e.meta.category === f.category && (f.type === 'alle' || e.meta.type === f.type) && matchesStyle(e, f.style));
}

/** Anzeigename eines Stilfilters */
export function styleFilterLabel(s: StyleFilter): string {
  return s === 'alle' ? 'Alle Stile' : s === 'ohne' ? 'Ohne Stil' : DESIGN_STYLE_BY_ID[s].name;
}
