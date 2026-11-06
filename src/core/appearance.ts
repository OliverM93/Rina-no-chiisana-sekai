/**
 * Aussehen von Figuren (Spielerin & Bewohner).
 *
 * Alle Figuren werden aus diesen Parametern prozedural gezeichnet
 * (siehe `src/world3d/models/chibi3d.ts`). Dadurch funktionieren Charakter-Editor,
 * Animationen und später die NPCs mit demselben Code.
 */
import { palette } from '../style/palette';
import type { Season } from './time';

export type HairStyle = 'locken' | 'schulterlang' | 'bob' | 'zopf' | 'dutt' | 'kurz' | 'wuschel' | 'zerzaust' | 'kurzgeschoren' | 'glatt';
export type Outfit = 'kleid' | 'pulli' | 'latzhose' | 'hemd' | 'strickjacke' | 'mantel' | 'weste' | 'streifenhemd' | 'hoodie' | 'troyer' | 'sweatshirt' | 'shorts' | 'sommer' | 'fleece' | 'hawaii' | 'sport' | 'radierkopf' | 'bandshirt' | 'polo' | 'jacke' | 'saison';
export type Beard = 'keiner' | 'kurz' | 'voll' | 'schnurrbart';
export type Smile = 'laecheln' | 'grinsen' | 'zahnluecke';
export type GlassesShape = 'rund' | 'eckig';
/** „saison“ = Schnürstiefel im Herbst/Winter, weiße Sneaker im Frühling/Sommer */
export type Shoes = 'standard' | 'stiefel' | 'sneaker' | 'chunky' | 'chunky-schwarz' | 'saison';
/** „oval“ = schmaleres Kinn, „rund“ = klassisch kugelrund */
export type FaceShape = 'rund' | 'oval';

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
  shoes: Shoes;
  faceShape: FaceShape;
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
  { id: 'sweatshirt', label: 'Oversize-Sweatshirt' },
  { id: 'shorts', label: 'Sweatshirt & kurze Hose' },
  { id: 'sommer', label: 'Kurzes Oberteil & kurze Hose' },
  { id: 'fleece', label: 'Dicke Fleece-Jacke' },
  { id: 'hawaii', label: 'Oversize „Hawaii“-Sweatshirt & weite Anzughose' },
  { id: 'sport', label: 'Oversize „Sport“-Sweatshirt & weite Anzughose' },
  { id: 'radierkopf', label: 'Schwarzer Oversize-Sweater mit Filmdruck & weite Anzughose' },
  { id: 'bandshirt', label: 'Bandshirt & Cargohose' },
  { id: 'polo', label: 'Polo mit Ärmel-Abzeichen & Cargohose' },
  { id: 'jacke', label: 'Überjacke mit Ärmel-Abzeichen & Cargohose' },
  { id: 'saison', label: 'Streetwear je nach Jahreszeit (wechselt täglich)' },
];

/** Streetwear für Frühling & Herbst – bei „saison“ jeden Tag ein anderes Teil */
export const STREETWEAR_ROTATION: readonly Exclude<Outfit, 'saison'>[] = ['sweatshirt', 'hawaii', 'sport', 'radierkopf'];

/** kleiner, stabiler Hash für Tageswechsel (ohne Abhängigkeit von rng.ts' Seeds) */
export function dayPick(day: string, salt: string, n: number): number {
  let h = 2166136261;
  for (const ch of salt + day) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h >>> 0) % n;
}

/**
 * Was eine Figur in der Jahreszeit tatsächlich trägt („saison“ = Streetwear: Sommer kurz, Winter Fleece,
 * Frühling & Herbst jeden Tag ein anderes Oversize-Sweatshirt).
 */
export function outfitFor(a: Appearance, season: Season, day = ''): Exclude<Outfit, 'saison'> {
  if (a.outfit !== 'saison') return a.outfit;
  if (season === 'sommer') return 'sommer';
  if (season === 'winter') return 'fleece';
  return day ? STREETWEAR_ROTATION[dayPick(day, 'lina', STREETWEAR_ROTATION.length)] : 'sweatshirt';
}

/** Ein Kleiderschrank-Eintrag: Outfit + Farben (der Rest des Aussehens bleibt) */
export type WardrobeItem = Pick<Appearance, 'outfit' | 'outfitColor' | 'accentColor'> & Partial<Pick<Appearance, 'shoes'>>;

/** Aussehen für einen Tag: wählt reproduzierbar ein Teil aus dem Kleiderschrank (falls vorhanden) */
export function dressFor(a: Appearance, wardrobe: readonly WardrobeItem[] | undefined, day: string, salt: string): Appearance {
  if (!wardrobe?.length || !day) return a;
  return { ...a, ...wardrobe[dayPick(day, salt, wardrobe.length)] };
}

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

export const FACE_SHAPES: Option<FaceShape>[] = [
  { id: 'oval', label: 'Schmal' },
  { id: 'rund', label: 'Rund' },
];

export const SHOES: Option<Shoes>[] = [
  { id: 'saison', label: 'Je nach Jahreszeit' },
  { id: 'stiefel', label: 'Schnürstiefel' },
  { id: 'sneaker', label: 'Weiße Sneaker' },
  { id: 'chunky', label: 'Weiße Chunky-Sneaker' },
  { id: 'chunky-schwarz', label: 'Schwarze Chunky-Sneaker' },
  { id: 'standard', label: 'Halbschuhe' },
];

/** Welche Schuhe eine Figur in der Jahreszeit tatsächlich trägt. */
export function shoesFor(a: Appearance, season: Season): Exclude<Shoes, 'saison'> {
  if (a.shoes !== 'saison') return a.shoes;
  return season === 'herbst' || season === 'winter' ? 'stiefel' : 'sneaker';
}

export const SKIN_TONES: Option<string>[] = palette.skin.map((c, i) => ({
  id: c,
  label: `Hautton ${i + 1}`,
}));

export const OUTFIT_COLORS: Option<string>[] = palette.outfit.map((c) => ({ id: c, label: c }));

/**
 * Lina: kastanienbraune Locken, braune Augen, Sommersprossen, trägt am liebsten Schwarz –
 * im Winter mit Schnürstiefeln, im Sommer mit weißen Sneakern. Im Editor anpassbar.
 */
export const DEFAULT_LINA: Appearance = {
  hairStyle: 'locken',
  hairColor: palette.hair.kastanie,
  skinTone: palette.skin[0],
  outfit: 'hawaii',
  outfitColor: palette.outfit[10],
  accentColor: palette.outfit[10],
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
  shoes: 'saison',
  faceShape: 'oval',
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
    shoes: pick(r.shoes, SHOES, fallback.shoes),
    faceShape: pick(r.faceShape, FACE_SHAPES, fallback.faceShape),
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
    a.shoes,
    a.faceShape,
  ].join('|');
}
