/**
 * Blumen-Kreuzungen im Beet: Blühen zwei Blumen derselben Art in verschiedenen Farben nebeneinander,
 * kann beim Pflücken ein Misch-Same abfallen (Mischregeln in `data/flowers.ts`). Außerdem trägt sich jede
 * neu erblühte Farbe ins Sammelbuch (Reiter „Blumen“) ein.
 */
import { registerCatch } from '../core/catching';
import { BLOOM, type Plant } from '../core/garden';
import { hashString, mulberry32 } from '../core/rng';
import { COLORS, crossResult, SPECIES_BY_ID, variantId } from '../data/flowers';
import { GARDEN_FLOWER, itemDef } from '../data/items';
import { itemIconUrl } from '../gfx/items';
import type { Session } from './session';

/** Wie wahrscheinlich fällt beim Pflücken ein Same ab – ohne und mit passendem Nachbarn */
export const SEED_CHANCE = 0.4;
export const SEED_CHANCE_WITH_PARTNER = 0.55;
/** Mit passendem Nachbarn: Wie oft ist der Same dann eine Mischung (sonst die eigene Farbe)? */
export const CROSS_SHARE = 0.75;
/** Seltene Mischungen (Schwarz) gelingen nur so oft */
export const RARE_SHARE = 0.5;

export interface SeedDrop {
  /** Same-ID oder null (diesmal kein Same) */
  seedId: string | null;
  /** Ist es eine Mischung aus zwei Farben? */
  crossed: boolean;
}

/** Schlüssel der 8 Nachbarfelder */
export function neighbourKeys(key: string): string[] {
  const [x, y] = key.split(',').map(Number);
  const out: string[] = [];
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) if (dx !== 0 || dy !== 0) out.push(`${x + dx},${y + dy}`);
  return out;
}

/**
 * Welcher Same fällt beim Pflücken der Blume auf `key` ab? Reproduzierbar pro Tag & Beet-Platz.
 * `garden` ist der Zustand vor dem Pflücken.
 */
export function seedDrop(garden: Readonly<Record<string, Plant>>, key: string, flower: string, rnd: () => number): SeedDrop {
  const gf = GARDEN_FLOWER[flower];
  if (!gf) return { seedId: null, crossed: false };
  const sp = SPECIES_BY_ID[gf.species];
  const results = [];
  if (sp && gf.colorKey) {
    for (const nk of neighbourKeys(key)) {
      const n = garden[nk];
      const ng = n && n.stage === BLOOM ? GARDEN_FLOWER[n.flower] : undefined;
      if (!ng || ng.species !== gf.species || !ng.colorKey) continue;
      const res = crossResult(sp, gf.colorKey, ng.colorKey);
      if (res) results.push(res);
    }
  }
  if (rnd() >= (results.length > 0 ? SEED_CHANCE_WITH_PARTNER : SEED_CHANCE)) return { seedId: null, crossed: false };
  if (sp && results.length > 0 && rnd() < CROSS_SHARE) {
    const res = results[Math.floor(rnd() * results.length) % results.length];
    if (!res.rare || rnd() < RARE_SHARE) return { seedId: variantId(sp, res.color, true), crossed: true };
  }
  return { seedId: gf.seed, crossed: false };
}

/** Würfel für den Same-Wurf am Beet-Platz (heute) */
export function seedRandom(session: Session, key: string): () => number {
  return mulberry32(hashString(`${session.today()}:${key}:samen`));
}

/** Anzeigename einer Blume („Gelbe Tulpe“) */
export function flowerLabel(id: string): string {
  return itemDef(id)?.name ?? id;
}

/**
 * Neu erblühte Farben ins Sammelbuch eintragen (einmal je Farbe). Gibt die neuen Blumen-IDs zurück
 * und meldet sie oben als kleine Nachricht.
 */
export function registerBlooms(session: Session): string[] {
  const data = session.data;
  if (!data) return [];
  const fresh: string[] = [];
  for (const p of Object.values(data.world.garden)) {
    const gf = GARDEN_FLOWER[p.flower];
    if (p.stage !== BLOOM || !gf?.colorKey || data.collection[p.flower]) continue;
    registerCatch(data.collection, p.flower, session.today());
    fresh.push(p.flower);
  }
  if (fresh.length > 0) {
    session.changed();
    for (const id of fresh.slice(0, 3)) {
      const gf = GARDEN_FLOWER[id];
      const isBase = gf.colorKey === SPECIES_BY_ID[gf.species]?.base;
      session.bus.emit('toast', { text: isBase ? `🌷 Neu im Sammelbuch: ${flowerLabel(id)}!` : `🌷 Neue Farbe im Sammelbuch: ${flowerLabel(id)}! ✨`, icon: itemIconUrl(id) });
    }
  }
  return fresh;
}

/** Wie heißt die Farbe? (für das Sammelbuch) */
export function colorLabel(id: string): string {
  const k = GARDEN_FLOWER[id]?.colorKey;
  return k ? COLORS[k].label : '';
}
