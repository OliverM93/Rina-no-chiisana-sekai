/**
 * Blumenfarben & Kreuzungen für Linas Beet.
 *
 * Jede Blumenart hat eine Standardfarbe (die „normale“ Blume, z. B. rote Tulpe = `tulpe`), weitere
 * Grundfarben, die es als Samen gibt, und Farben, die nur durch Kreuzen entstehen: Blühen zwei Blumen
 * derselben Art in verschiedenen Farben nebeneinander im Beet, kann beim Pflücken ein Misch-Same
 * abfallen. Die Mischregeln (`MIXES`) gelten für alle Arten – ein Ergebnis zählt nur, wenn die Art diese
 * Farbe in ihrer Palette hat.
 *
 * Gegenstands-IDs: Standardfarbe = Artname (`tulpe`, `samen-tulpe`), sonst `<art>-<farbe>`
 * (`tulpe-gelb`, `samen-tulpe-gelb`).
 */

export type FlowerColor = 'rot' | 'gelb' | 'weiss' | 'orange' | 'rosa' | 'lila' | 'blau' | 'schwarz';

export interface ColorInfo {
  /** Anzeigename (Hauptwort, kleingeschrieben für Sätze) */
  label: string;
  hex: string;
  /** Wird nicht gebeugt („orange Tulpe“, „rosa Rose“) */
  fixed?: boolean;
}

export const COLORS: Readonly<Record<FlowerColor, ColorInfo>> = {
  rot: { label: 'rot', hex: '#e8484f' },
  gelb: { label: 'gelb', hex: '#f7c832' },
  weiss: { label: 'weiß', hex: '#ffffff' },
  orange: { label: 'orange', hex: '#f59a3a', fixed: true },
  rosa: { label: 'rosa', hex: '#f4a3c0', fixed: true },
  lila: { label: 'lila', hex: '#a98ad8', fixed: true },
  blau: { label: 'blau', hex: '#7ab8f0' },
  schwarz: { label: 'schwarz', hex: '#3b3441' },
};

export type Gender = 'f' | 'm' | 'n';

export interface FlowerSpecies {
  /** Artname = ID der Standardfarbe */
  id: string;
  gender: Gender;
  /** Farbe der „normalen“ Blume und ihres Samens */
  base: FlowerColor;
  /** Weitere Farben, die es als Samen gibt (Briefe, Funde, später im Samenstand) */
  seedColors: readonly FlowerColor[];
  /** Farben, die nur durch Kreuzen entstehen */
  crossColors: readonly FlowerColor[];
  /** Mitte der Blüte */
  center: string;
}

export const FLOWER_SPECIES: readonly FlowerSpecies[] = [
  { id: 'tulpe', gender: 'f', base: 'rot', seedColors: ['gelb', 'weiss'], crossColors: ['orange', 'rosa', 'schwarz'], center: '#f7d26a' },
  { id: 'rose', gender: 'f', base: 'rot', seedColors: ['gelb', 'weiss'], crossColors: ['orange', 'rosa', 'schwarz'], center: '#b8324a' },
  { id: 'sonnenblume', gender: 'f', base: 'gelb', seedColors: ['rot'], crossColors: ['orange'], center: '#6a4a2a' },
  { id: 'lavendel', gender: 'm', base: 'lila', seedColors: ['weiss'], crossColors: ['rosa'], center: '#7a5ab8' },
  { id: 'vergissmeinnicht', gender: 'n', base: 'blau', seedColors: ['rosa', 'weiss'], crossColors: ['lila'], center: '#f7e26a' },
];

export const SPECIES_BY_ID: Readonly<Record<string, FlowerSpecies>> = Object.fromEntries(FLOWER_SPECIES.map((s) => [s.id, s]));

/** Alle Farben einer Art (Standard, Samen-Farben, Kreuzungs-Farben) */
export function paletteOf(s: FlowerSpecies): FlowerColor[] {
  return [s.base, ...s.seedColors, ...s.crossColors];
}

/** Mischregeln (ungeordnete Paare). `rare`: gelingt nur manchmal. */
export interface Mix {
  a: FlowerColor;
  b: FlowerColor;
  result: FlowerColor;
  rare?: boolean;
}

export const MIXES: readonly Mix[] = [
  { a: 'rot', b: 'gelb', result: 'orange' },
  { a: 'rot', b: 'weiss', result: 'rosa' },
  { a: 'blau', b: 'rosa', result: 'lila' },
  { a: 'lila', b: 'weiss', result: 'rosa' },
  // Das Geheimnis: Zwei Mischfarben ergeben ganz selten Schwarz
  { a: 'orange', b: 'rosa', result: 'schwarz', rare: true },
];

/** Was ergibt `a × b` bei dieser Art? (null = nichts Neues) */
export function crossResult(species: FlowerSpecies, a: FlowerColor, b: FlowerColor): { color: FlowerColor; rare: boolean } | null {
  if (a === b) return null;
  const m = MIXES.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
  if (!m || !paletteOf(species).includes(m.result)) return null;
  return { color: m.result, rare: !!m.rare };
}

/** ID der Blume (bzw. mit `seed` des Samens) einer Art in einer Farbe */
export function variantId(species: FlowerSpecies, color: FlowerColor, seed = false): string {
  const base = color === species.base ? species.id : `${species.id}-${color}`;
  return seed ? `samen-${base}` : base;
}

/** Farbwort passend zum Geschlecht: „gelbe“ Tulpe, „weißer“ Lavendel, „blaues“ Vergissmeinnicht */
export function colorWord(color: FlowerColor, gender: Gender, plural = false): string {
  const info = COLORS[color];
  if (info.fixed) return info.label;
  if (plural) return `${info.label}e`;
  return info.label + (gender === 'f' ? 'e' : gender === 'm' ? 'er' : 'es');
}
