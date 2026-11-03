/**
 * Gärtnern: Samen pflanzen, gießen, wachsen lassen, pflücken.
 *
 * Ganz ohne Druck: Pflanzen vertrocknen nie. Jedes Mal, wenn eine Pflanze
 * gegossen wurde (oder es geregnet hat), wächst sie am nächsten Tag eine
 * Stufe weiter. Eine blühende Pflanze kann man pflücken – danach treibt sie
 * neu aus und blüht nach dem nächsten Gießen wieder.
 */
import { daysBetween } from './daily';

/** 0 = Samen, 1 = Keimling, 2 = Knospe, 3 = Blüte */
export type GrowthStage = 0 | 1 | 2 | 3;
export const BLOOM: GrowthStage = 3;

export interface Plant {
  /** Blumen-ID (z. B. 'tulpe') */
  flower: string;
  stage: GrowthStage;
  /** Tag, an dem zuletzt gegossen wurde ('' = noch nie) */
  wateredDay: string;
  /** Tag, an dem die Pflanze zuletzt gewachsen ist */
  grewDay: string;
}

/** Beet-Platz (Schlüssel „x,y“) → Pflanze */
export type Garden = Record<string, Plant>;

export const spotKey = (x: number, y: number) => `${x},${y}`;

export function plantSeed(garden: Garden, key: string, flower: string, day: string): boolean {
  if (garden[key]) return false;
  garden[key] = { flower, stage: 0, wateredDay: '', grewDay: day };
  return true;
}

/** Gießen. Gibt false zurück, wenn heute schon gegossen wurde. */
export function water(garden: Garden, key: string, day: string): boolean {
  const p = garden[key];
  if (!p || p.wateredDay === day || p.stage === BLOOM) return false;
  p.wateredDay = day;
  return true;
}

/** Gilt eine Pflanze heute als gegossen (selbst gegossen oder Regen)? */
export function isWatered(p: Plant, day: string): boolean {
  return p.wateredDay === day;
}

/**
 * Lässt Pflanzen wachsen, die an einem früheren Tag gegossen wurden.
 * `rainedToday`: Regen gießt alle Beete. Gibt zurück, ob sich etwas geändert hat.
 */
export function growGarden(garden: Garden, today: string, rainedToday = false): boolean {
  let changed = false;
  for (const p of Object.values(garden)) {
    if (p.stage < BLOOM && p.wateredDay && daysBetween(p.grewDay, p.wateredDay) >= 0 && daysBetween(p.wateredDay, today) >= 1) {
      p.stage = (p.stage + 1) as GrowthStage;
      p.grewDay = today;
      changed = true;
    }
    if (rainedToday && p.stage < BLOOM && p.wateredDay !== today) {
      p.wateredDay = today;
      changed = true;
    }
  }
  return changed;
}

/** Blüte pflücken: Pflanze geht zurück zur Knospe. Gibt die Blumen-ID zurück. */
export function pickBloom(garden: Garden, key: string, day: string): string | null {
  const p = garden[key];
  if (!p || p.stage !== BLOOM) return null;
  p.stage = 2;
  p.grewDay = day;
  return p.flower;
}

/** Pflanze ausgraben (Platz wird frei) */
export function removePlant(garden: Garden, key: string): Plant | null {
  const p = garden[key];
  if (!p) return null;
  delete garden[key];
  return p;
}

export function normalizeGarden(raw: unknown, isFlower: (id: string) => boolean): Garden {
  const out: Garden = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  for (const [key, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!/^\d+,\d+$/.test(key) || !v || typeof v !== 'object') continue;
    const p = v as Record<string, unknown>;
    if (typeof p.flower !== 'string' || !isFlower(p.flower)) continue;
    const stage = typeof p.stage === 'number' ? Math.max(0, Math.min(3, Math.floor(p.stage))) : 0;
    out[key] = {
      flower: p.flower,
      stage: stage as GrowthStage,
      wateredDay: typeof p.wateredDay === 'string' ? p.wateredDay : '',
      grewDay: typeof p.grewDay === 'string' && p.grewDay ? p.grewDay : '2000-01-01',
    };
  }
  return out;
}
