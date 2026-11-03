/**
 * Aussehen von Figuren (Spielerin & Bewohner).
 *
 * Alle Figuren werden aus diesen Parametern prozedural gezeichnet
 * (siehe `src/world3d/models/chibi3d.ts`). Dadurch funktionieren Charakter-Editor,
 * Animationen und später die NPCs mit demselben Code.
 */
import { palette } from '../style/palette';

export type HairStyle = 'locken' | 'schulterlang' | 'bob' | 'zopf' | 'dutt' | 'kurz' | 'wuschel' | 'zerzaust' | 'kurzgeschoren' | 'glatt';
export type Outfit = 'kleid' | 'pulli' | 'latzhose' | 'hemd' | 'strickjacke' | 'mantel' | 'weste' | 'streifenhemd' | 'hoodie' | 'troyer';
export type Beard = 'keiner' | 'kurz' | 'voll' | 'schnurrbart';
export type Smile = 'laecheln' | 'grinsen' | 'zahnluecke';
export type GlassesShape = 'rund' | 'eckig';

export interface Appearance {
  hairStyle: HairStyle;
  hairColor: string;
  skinTone: string;
  outfit: Outfit;
  outfitColor: string;
  accentColor: string;
  /** Körpergröße relativ (0.85 = klein, 1.15 = groß). */
  height: number;
  /** Statur relativ (0.9 = zierlich, 1.2 = kräftig). */
  build: number;
  beard: Beard;
  /** Bartfarbe; leer = wie die Haare */
  beardColor: string;
  glasses: boolean;
  glassesShape: GlassesShape;
  blush: boolean;
  eyeColor: string;
  freckles: boolean;
  smile: Smile;
  /** Halstuch/Schal-Farbe; leer = keins */
  scarf: string;
  /** kleine Creolen */
  earrings: boolean;
}

export interface Option<T> {
  id: T;
  label: string;
}

export const HAIR_STYLES: Option<HairStyle>[] = [
  { id: 'locken', label: 'Locken' },
  { id: 'schulterlang', label: 'Schulterlang' },
  { id: 'bob', label: 'Bob' },
  { id: 'zopf', label: 'Pferdeschwanz' },
  { id: 'dutt', label: 'Dutt' },
  { id: 'kurz', label: 'Kurz' },
  { id: 'wuschel', label: 'Wuschelkopf' },
  { id: 'zerzaust', label: 'Zerzaust' },
  { id: 'kurzgeschoren', label: 'Kurz geschoren' },
  { id: 'glatt', label: 'Glatt mit Mittelscheitel' },
];

export const OUTFITS: Option<Outfit>[] = [
  { id: 'kleid', label: 'Kleid' },
  { id: 'pulli', label: 'Pulli & Rock' },
  { id: 'latzhose', label: 'Latzhose' },
  { id: 'strickjacke', label: 'Strickjacke' },
  { id: 'hemd', label: 'Hemd' },
  { id: 'streifenhemd', label: 'Streifenhemd' },
  { id: 'weste', label: 'Hemd & Weste' },
  { id: 'hoodie', label: 'Hoodie' },
  { id: 'troyer', label: 'Troyer-Pulli' },
  { id: 'mantel', label: 'Mantel & Schal' },
];

export const SMILES: Option<Smile>[] = [
  { id: 'laecheln', label: 'Lächeln' },
  { id: 'grinsen', label: 'Grinsen' },
  { id: 'zahnluecke', label: 'Zahnlücken-Grinsen' },
];

export const EYE_COLORS: Option<string>[] = [
  { id: palette.eyeColors.braun, label: 'Braun' },
  { id: palette.eyeColors.haselnuss, label: 'Haselnuss' },
  { id: palette.eyeColors.blau, label: 'Blau' },
  { id: palette.eyeColors.graublau, label: 'Graublau' },
  { id: palette.eyeColors.gruen, label: 'Grün' },
];

export const HAIR_COLORS: Option<string>[] = [
  { id: palette.hair.kastanie, label: 'Kastanie' },
  { id: palette.hair.braun, label: 'Schokobraun' },
  { id: palette.hair.dunkelbraun, label: 'Espresso' },
  { id: palette.hair.haselnuss, label: 'Haselnuss' },
  { id: palette.hair.blond, label: 'Honigblond' },
  { id: palette.hair.kupfer, label: 'Kupfer' },
  { id: palette.hair.rotblond, label: 'Rotblond' },
  { id: palette.hair.silber, label: 'Silber' },
  { id: palette.hair.angegraut, label: 'Angegraut' },
  { id: palette.hair.schwarz, label: 'Schwarz' },
  { id: palette.hair.rosa, label: 'Zuckerwatte' },
  { id: palette.hair.mint, label: 'Minze' },
];

export const SKIN_TONES: Option<string>[] = palette.skin.map((c, i) => ({
  id: c,
  label: `Hautton ${i + 1}`,
}));

export const OUTFIT_COLORS: Option<string>[] = palette.outfit.map((c) => ({ id: c, label: c }));

/** Lina: kastanienbraune Locken, braune Augen, Sommersprossen – im Editor anpassbar. */
export const DEFAULT_LINA: Appearance = {
  hairStyle: 'locken',
  hairColor: palette.hair.kastanie,
  skinTone: palette.skin[0],
  outfit: 'kleid',
  outfitColor: palette.outfit[0],
  accentColor: palette.outfit[7],
  height: 1,
  build: 1,
  beard: 'keiner',
  beardColor: '',
  glasses: false,
  glassesShape: 'rund',
  blush: true,
  eyeColor: palette.eyeColors.braun,
  freckles: true,
  smile: 'laecheln',
  scarf: '',
  earrings: false,
};

const HEX = /^#[0-9a-fA-F]{6}$/;

function pick<T extends string>(value: unknown, allowed: readonly Option<T>[], fallback: T): T {
  return allowed.some((o) => o.id === value) ? (value as T) : fallback;
}

function color(value: unknown, fallback: string): string {
  return typeof value === 'string' && HEX.test(value) ? value : fallback;
}

function num(value: unknown, min: number, max: number, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : fallback;
}

/** Macht aus beliebigen (z. B. importierten) Daten ein gültiges Aussehen. */
export function normalizeAppearance(raw: unknown, fallback: Appearance = DEFAULT_LINA): Appearance {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const beards: Option<Beard>[] = [
    { id: 'keiner', label: '' },
    { id: 'kurz', label: '' },
    { id: 'voll', label: '' },
    { id: 'schnurrbart', label: '' },
  ];
  return {
    hairStyle: pick(r.hairStyle, HAIR_STYLES, fallback.hairStyle),
    hairColor: color(r.hairColor, fallback.hairColor),
    skinTone: color(r.skinTone, fallback.skinTone),
    outfit: pick(r.outfit, OUTFITS, fallback.outfit),
    outfitColor: color(r.outfitColor, fallback.outfitColor),
    accentColor: color(r.accentColor, fallback.accentColor),
    height: num(r.height, 0.8, 1.25, fallback.height),
    build: num(r.build, 0.85, 1.3, fallback.build),
    beard: pick(r.beard, beards, fallback.beard),
    beardColor: r.beardColor === '' ? '' : color(r.beardColor, fallback.beardColor),
    glasses: typeof r.glasses === 'boolean' ? r.glasses : fallback.glasses,
    glassesShape: r.glassesShape === 'eckig' || r.glassesShape === 'rund' ? r.glassesShape : fallback.glassesShape,
    blush: typeof r.blush === 'boolean' ? r.blush : fallback.blush,
    eyeColor: color(r.eyeColor, fallback.eyeColor),
    freckles: typeof r.freckles === 'boolean' ? r.freckles : fallback.freckles,
    smile: pick(r.smile, SMILES, fallback.smile),
    scarf: r.scarf === '' ? '' : color(r.scarf, fallback.scarf),
    earrings: typeof r.earrings === 'boolean' ? r.earrings : fallback.earrings,
  };
}

/** Stabiler Schlüssel, z. B. um generierte Texturen zu cachen. */
export function appearanceKey(a: Appearance): string {
  return [
    a.hairStyle,
    a.hairColor,
    a.skinTone,
    a.outfit,
    a.outfitColor,
    a.accentColor,
    a.height.toFixed(2),
    a.build.toFixed(2),
    a.beard,
    a.beardColor,
    a.glasses ? a.glassesShape : 0,
    a.blush ? 1 : 0,
    a.eyeColor,
    a.freckles ? 1 : 0,
    a.smile,
    a.scarf,
    a.earrings ? 1 : 0,
  ].join('|');
}
