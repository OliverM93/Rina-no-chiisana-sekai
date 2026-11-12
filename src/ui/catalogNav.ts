/**
 * Tastatur-Steuerung des Möbelkatalogs als kleine Zustandsmaschine (ohne DOM, testbar).
 *
 * Das Fenster hat Zeilen: Kategorie → Typ → Stil → Raster → Farbe. ↑/↓ wechselt die Zeile (im Raster: eine
 * Rasterzeile weiter), ←/→ ändert den Wert der aktiven Zeile. Bild↑/Bild↓ blättert von überall durch die Kategorien.
 * Zeilen ohne Auswahl (keine Typen, keine Stile, nur eine Farbe) werden übersprungen.
 */
import type { CatalogCategory } from '../data/catalog';
import type { StyleFilter } from '../game/catalog';

export type NavRow = 'kategorie' | 'typ' | 'stil' | 'raster' | 'farbe';
export type NavKey = 'up' | 'down' | 'left' | 'right' | 'pageUp' | 'pageDown';

export interface NavState {
  row: NavRow;
  category: CatalogCategory;
  /** gemerkter Typ (kann in einem anderen Stil „alle“ bedeuten, siehe `effectiveFilter`) */
  type: string;
  /** gemerkter Stil – bleibt beim Wechsel der Kategorie erhalten (Japandi-Möbel → Japandi-Böden) */
  style: StyleFilter;
  /** gewählter Eintrag im Raster */
  index: number;
  variant: number;
}

/** Was gerade angezeigt wird (wirksame Listen) */
export interface NavContext {
  categories: readonly CatalogCategory[];
  /** wirksamer Typ & Stil (nach `effectiveFilter`) */
  type: string;
  style: StyleFilter;
  types: readonly string[];
  styles: readonly StyleFilter[];
  /** Treffer im Raster */
  count: number;
  /** Spalten des Rasters */
  cols: number;
  /** Farben des gewählten Eintrags */
  variants: number;
}

const ORDER: readonly NavRow[] = ['kategorie', 'typ', 'stil', 'raster', 'farbe'];

export function initialNav(category: CatalogCategory): NavState {
  return { row: 'raster', category, type: 'alle', style: 'alle', index: 0, variant: 0 };
}

/** Zeilen, die es gerade gibt */
export function presentRows(ctx: NavContext): NavRow[] {
  return ORDER.filter(
    (r) => r === 'kategorie' || (r === 'typ' && ctx.types.length > 0) || (r === 'stil' && ctx.styles.length > 0) || (r === 'raster' && ctx.count > 0) || (r === 'farbe' && ctx.count > 0 && ctx.variants > 1),
  );
}

/** Hält Zeile, Index und Farbe gültig (nach jedem Filterwechsel) */
export function normalize(s: NavState, ctx: NavContext): NavState {
  const rows = presentRows(ctx);
  let row = s.row;
  if (!rows.includes(row)) {
    // nächste vorhandene Zeile darüber, sonst darunter
    const at = ORDER.indexOf(row);
    row = [...rows].reverse().find((r) => ORDER.indexOf(r) < at) ?? rows[0];
  }
  const index = ctx.count === 0 ? 0 : Math.min(Math.max(0, s.index), ctx.count - 1);
  const variant = Math.min(Math.max(0, s.variant), Math.max(0, ctx.variants - 1));
  return row === s.row && index === s.index && variant === s.variant ? s : { ...s, row, index, variant };
}

function cycle<T>(list: readonly T[], current: T, dir: number): T {
  if (list.length === 0) return current;
  const at = list.indexOf(current);
  return list[(((at === -1 ? 0 : at + dir) % list.length) + list.length) % list.length];
}

function changeCategory(s: NavState, ctx: NavContext, dir: number): NavState {
  const category = cycle(ctx.categories, s.category, dir);
  return category === s.category ? s : { ...s, category, type: 'alle', index: 0, variant: 0 };
}

/** Eine Taste verarbeiten → neuer Zustand (die Oberfläche berechnet danach `NavContext` neu und ruft `normalize`) */
export function navigate(s: NavState, key: NavKey, ctx: NavContext): NavState {
  s = normalize(s, ctx);
  if (key === 'pageUp' || key === 'pageDown') return changeCategory(s, ctx, key === 'pageDown' ? 1 : -1);
  const rows = presentRows(ctx);
  const at = rows.indexOf(s.row);
  const cols = Math.max(1, ctx.cols);

  if (key === 'up' || key === 'down') {
    const down = key === 'down';
    if (s.row === 'raster') {
      const next = s.index + (down ? cols : -cols);
      if (down && next < ctx.count) return { ...s, index: next, variant: 0 };
      // letzte, nicht ganz volle Zeile: auf den letzten Eintrag springen statt sie zu überspringen
      if (down && Math.floor(s.index / cols) < Math.floor((ctx.count - 1) / cols)) return { ...s, index: ctx.count - 1, variant: 0 };
      if (!down && next >= 0) return { ...s, index: next, variant: 0 };
    }
    const row = rows[Math.min(rows.length - 1, Math.max(0, at + (down ? 1 : -1)))];
    return row === s.row ? s : { ...s, row };
  }

  const dir = key === 'right' ? 1 : -1;
  switch (s.row) {
    case 'kategorie':
      return changeCategory(s, ctx, dir);
    case 'typ':
      return { ...s, type: cycle(ctx.types, ctx.type, dir), index: 0, variant: 0 };
    case 'stil':
      return { ...s, style: cycle(ctx.styles, ctx.style, dir), index: 0, variant: 0 };
    case 'raster': {
      const index = Math.min(ctx.count - 1, Math.max(0, s.index + dir));
      return index === s.index ? s : { ...s, index, variant: 0 };
    }
    case 'farbe':
      return { ...s, variant: (((s.variant + dir) % ctx.variants) + ctx.variants) % ctx.variants };
  }
}

/** Taste → Navigations-Befehl (nur Pfeile & Bild-Tasten; WASD bleibt frei, falls eine Suche dazukommt) */
export function navKeyOf(code: string): NavKey | null {
  switch (code) {
    case 'ArrowUp':
      return 'up';
    case 'ArrowDown':
      return 'down';
    case 'ArrowLeft':
      return 'left';
    case 'ArrowRight':
      return 'right';
    case 'PageUp':
      return 'pageUp';
    case 'PageDown':
      return 'pageDown';
    default:
      return null;
  }
}
