/**
 * Christins Samenstand auf dem Dorfplatz (steht, sobald Olaf & Christin eingezogen sind).
 *
 * Es gibt immer die Standard-Samen jeder Blumenart. Dazu kommen jeden Tag drei andere
 * Farb-Samen („Tagesangebot“) – so kommt Lina an Kreuzungs-Partner, ohne auf Post oder Zufall zu warten.
 * Misch-Samen (Orange, Rosa, Lila, Schwarz) gibt es nie zu kaufen, die entstehen nur im Beet.
 */
import { hashString, mulberry32 } from '../core/rng';
import type { Season } from '../core/time';
import { CROPS, type CropDef } from './crops';
import { FLOWER_SPECIES, variantId } from './flowers';
import { itemDef } from './items';

export const SEED_STAND_ID = 'samenstand';
/** Ab wann steht der Stand? (Christin zieht mit Olaf ein) */
export const SEED_STAND_REQUIRES = 'olafEingezogen';
/** Wie viele Farb-Samen kommen pro Tag dazu? */
export const DAILY_COLOR_SEEDS = 3;
/** Stand-Preis = Verkaufswert × Aufschlag, damit Kaufen & Verkaufen sich nicht lohnt */
export const SEED_MARKUP = 2.5;
export const SEED_MIN_PRICE = 12;

/** Standard-Samen, immer da */
export const BASE_SEEDS: readonly string[] = [...FLOWER_SPECIES.map((s) => `samen-${s.id}`), 'samen-kamille', 'samen-pfefferminze'];

/** Alle Farb-Samen, die es als Tagesangebot geben kann (nie Misch-Farben) */
export const COLOR_SEEDS: readonly string[] = FLOWER_SPECIES.flatMap((s) => s.seedColors.map((c) => variantId(s, c, true)));

/** Gemüse- und Kräutersamen: Alle Sorten, die es am Stand je gibt (manche nur in ihrer Jahreszeit) */
export const CROP_SEEDS: readonly string[] = CROPS.map((c) => `samen-${c.id}`);

/** Gibt es diese Sorte in dieser Jahreszeit am Stand? */
export function cropInSeason(crop: CropDef, season: Season): boolean {
  return !crop.seasons || crop.seasons.includes(season);
}

/** Gemüse & Kräuter, die jetzt am Stand liegen, und die, die gerade nicht da sind */
export function cropsAt(season: Season): { here: CropDef[]; away: CropDef[] } {
  return { here: CROPS.filter((c) => cropInSeason(c, season)), away: CROPS.filter((c) => !cropInSeason(c, season)) };
}

/** Alles, was es am Stand je zu kaufen gibt */
export const ALL_STAND_SEEDS: readonly string[] = [...BASE_SEEDS, ...COLOR_SEEDS, ...CROP_SEEDS];

/** Was kostet ein Same am Stand? */
export function seedPrice(itemId: string): number {
  const base = itemDef(itemId)?.price ?? 5;
  return Math.max(SEED_MIN_PRICE, Math.ceil(base * SEED_MARKUP));
}

/** Das Tagesangebot an Farb-Samen – für jeden Tag gleich, am nächsten Tag anders */
export function dailyColorSeeds(today: string): string[] {
  const rnd = mulberry32(hashString(`${today}:samenstand`));
  const pool = [...COLOR_SEEDS];
  const out: string[] = [];
  while (out.length < DAILY_COLOR_SEEDS && pool.length > 0) out.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
  // in der Reihenfolge der Tasche, nicht in Zufallsreihenfolge
  return out.sort((a, b) => COLOR_SEEDS.indexOf(a) - COLOR_SEEDS.indexOf(b));
}

/** Alles, was heute am Stand liegt: Blumen (immer + Tagesangebot) und Gemüse & Kräuter der Jahreszeit */
export function standStock(today: string, season: Season): string[] {
  return [...BASE_SEEDS, ...dailyColorSeeds(today), ...cropsAt(season).here.map((c) => `samen-${c.id}`)];
}
