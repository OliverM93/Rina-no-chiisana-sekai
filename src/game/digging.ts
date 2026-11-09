/**
 * Graben mit Thalias Schaufel: jeden Tag ein paar Grabstellen auf der Wiese
 * (reproduzierbar pro Datum). Funde kommen in die Tasche und ins Sammelbuch.
 */
import { registerCatch } from '../core/catching';
import { checkSammlungen } from './sammlungen';
import { dailySpawns, type DailySpawn } from '../core/daily';
import { terrainAt } from '../core/worldmap';
import { DIG_SPOTS_PER_DAY, FINDS } from '../data/fossils';
import { YARD_AREA } from '../data/yard';
import { giveItem, markPicked } from './gameplay';
import type { Session } from './session';

let grassCache: Array<{ x: number; y: number }> | null = null;

/** Freie Wiesenkacheln außerhalb von Linas Garten */
export function grassTiles(session: Session) {
  if (grassCache) return grassCache;
  const map = session.map;
  const out: Array<{ x: number; y: number }> = [];
  const inYard = (x: number, y: number) => x >= YARD_AREA.x && x < YARD_AREA.x + YARD_AREA.w && y >= YARD_AREA.y && y < YARD_AREA.y + YARD_AREA.h;
  for (let y = 1; y < map.height - 1; y++) for (let x = 1; x < map.width - 1; x++) if (terrainAt(map, x, y) === 'grass' && !map.staticBlocked[y * map.width + x] && !inYard(x, y)) out.push({ x, y });
  grassCache = out;
  return out;
}

/** Kann Lina schon graben? (Schaufel von Thalia) */
export function canDig(session: Session): boolean {
  return !!session.data?.flags.thaliaBegruesst;
}

/** Heutige, noch nicht ausgegrabene Grabstellen */
export function todaysDigSpots(session: Session): DailySpawn[] {
  const data = session.data;
  if (!data || !canDig(session)) return [];
  const day = session.today();
  const picked = data.world.picked.day === day ? new Set(data.world.picked.ids) : new Set<string>();
  return dailySpawns(day, grassTiles(session), DIG_SPOTS_PER_DAY, FINDS.map((f) => ({ itemId: f.id, weight: f.weight })), 'graben')
    .map((s) => ({ ...s, id: `grab:${s.id}` }))
    .filter((s) => !picked.has(s.id) && !session.map.grid.isBlocked(s.x, s.y));
}

export interface DigResult {
  itemId: string;
  isNew: boolean;
  full: boolean;
}

/** Grabstelle ausgraben */
export function digSpot(session: Session, spot: DailySpawn): DigResult | null {
  const data = session.data;
  if (!data) return null;
  if (giveItem(session, spot.itemId, 1, false) > 0) return { itemId: spot.itemId, isNew: false, full: true };
  markPicked(session, spot.id);
  const isNew = registerCatch(data.collection, spot.itemId, session.today());
  if (isNew) checkSammlungen(session);
  session.changed();
  session.save();
  return { itemId: spot.itemId, isNew, full: false };
}
