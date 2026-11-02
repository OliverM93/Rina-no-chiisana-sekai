/**
 * Aussehen von Figuren (Spielerin & Bewohner).
 *
 * Alle Figuren werden aus diesen Parametern prozedural gezeichnet
 * (siehe `src/gfx/chibi.ts`). Dadurch funktionieren Charakter-Editor,
 * Animationen und später die NPCs mit demselben Code.
 */
import { palette } from '../style/palette';

export type HairStyle = 'locken' | 'bob' | 'zopf' | 'dutt' | 'kurz' | 'wuschel';
export type Outfit = 'kleid' | 'pulli' | 'latzhose' | 'hemd' | 'strickjacke';
export type Beard = 'keiner' | 'kurz' | 'voll';

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
  glasses: boolean;
  blush: boolean;
}

export interface Option<T> {
  id: T;
  label: string;
}

export const HAIR_STYLES: Option<HairStyle>[] = [
  { id: 'locken', label: 'Locken' },
  { id: 'bob', label: 'Bob' },
  { id: 'zopf', label: 'Pferdeschwanz' },
  { id: 'dutt', label: 'Dutt' },
  { id: 'kurz', label: 'Kurz' },
  { id: 'wuschel', label: 'Wuschelkopf' },
];

export const OUTFITS: Option<Outfit>[] = [
  { id: 'kleid', label: 'Kleid' },
  { id: 'pulli', label: 'Pulli & Rock' },
  { id: 'latzhose', label: 'Latzhose' },
  { id: 'strickjacke', label: 'Strickjacke' },
  { id: 'hemd', label: 'Hemd' },
];

export const HAIR_COLORS: Option<string>[] = [
  { id: palette.hair.braun, label: 'Schokobraun' },
  { id: palette.hair.dunkelbraun, label: 'Espresso' },
  { id: palette.hair.haselnuss, label: 'Haselnuss' },
  { id: palette.hair.blond, label: 'Honigblond' },
  { id: palette.hair.rotblond, label: 'Kupfer' },
  { id: palette.hair.schwarz, label: 'Schwarz' },
  { id: palette.hair.rosa, label: 'Zuckerwatte' },
  { id: palette.hair.mint, label: 'Minze' },
];

export const SKIN_TONES: Option<string>[] = palette.skin.map((c, i) => ({
  id: c,
  label: `Hautton ${i + 1}`,
}));

export const OUTFIT_COLORS: Option<string>[] = palette.outfit.map((c) => ({ id: c, label: c }));

/** Lina: braune Locken, rosa Kleid – im Editor anpassbar. */
export const DEFAULT_LINA: Appearance = {
  hairStyle: 'locken',
  hairColor: palette.hair.braun,
  skinTone: palette.skin[0],
  outfit: 'kleid',
  outfitColor: palette.outfit[0],
  accentColor: palette.outfit[7],
  height: 1,
  build: 1,
  beard: 'keiner',
  glasses: false,
  blush: true,
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
    glasses: typeof r.glasses === 'boolean' ? r.glasses : fallback.glasses,
    blush: typeof r.blush === 'boolean' ? r.blush : fallback.blush,
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
    a.glasses ? 1 : 0,
    a.blush ? 1 : 0,
  ].join('|');
}
