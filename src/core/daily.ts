/**
 * Tägliche Kleinigkeiten in der Welt: Muscheln am Strand, Obst an Bäumen,
 * Fundstücke an Felsen, Blumen zum Pflücken. Alles optional, nichts verfällt.
 */
import { hashString, mulberry32, tileNoise } from './rng';

/** Tage zwischen zwei Daten im Format JJJJ-MM-TT (lokal). */
export function daysBetween(a: string, b: string): number {
  const pa = a.split('-').map(Number);
  const pb = b.split('-').map(Number);
  const da = Date.UTC(pa[0], pa[1] - 1, pa[2]);
  const db = Date.UTC(pb[0], pb[1] - 1, pb[2]);
  return Math.round((db - da) / 86_400_000);
}

export const FRUIT_REGROW_DAYS = 3;

/** Trägt ein Baum (wieder) Früchte? */
export function treeHasFruit(lastHarvest: string | undefined, today: string): boolean {
  if (!lastHarvest) return true;
  return daysBetween(lastHarvest, today) >= FRUIT_REGROW_DAYS;
}

/** Wurde etwas heute schon erledigt (z. B. Felsen geklopft)? */
export function doneToday(lastDay: string | undefined, today: string): boolean {
  return lastDay === today;
}

export interface SpawnTable {
  itemId: string;
  weight: number;
}

export interface DailySpawn {
  id: string;
  itemId: string;
  x: number;
  y: number;
}

/** Wählt gewichtet einen Eintrag (r = 0..1). */
export function weightedPick(table: readonly SpawnTable[], r: number): string {
  const total = table.reduce((s, t) => s + t.weight, 0);
  let acc = 0;
  for (const t of table) {
    acc += t.weight / total;
    if (r < acc) return t.itemId;
  }
  return table[table.length - 1].itemId;
}

/**
 * Verteilt die Fundstücke eines Tages reproduzierbar auf mögliche Kacheln.
 * Gleicher Tag → gleiche Muscheln an gleichen Stellen.
 */
export function dailySpawns(
  day: string,
  tiles: ReadonlyArray<{ x: number; y: number }>,
  count: number,
  table: readonly SpawnTable[],
  prefix: string,
): DailySpawn[] {
  if (tiles.length === 0 || count <= 0) return [];
  const rnd = mulberry32(hashString(`${prefix}:${day}`));
  const used = new Set<number>();
  const result: DailySpawn[] = [];
  for (let i = 0; i < count && used.size < tiles.length; i++) {
    let idx = Math.floor(rnd() * tiles.length);
    while (used.has(idx)) idx = (idx + 1) % tiles.length;
    used.add(idx);
    const t = tiles[idx];
    result.push({ id: `${prefix}-${day}-${i}`, itemId: weightedPick(table, rnd()), x: t.x, y: t.y });
  }
  return result;
}

/** Welche Obstsorte (oder keine) trägt ein Baum? Fest pro Baumposition. */
export function fruitOfTree(x: number, y: number, fruits: readonly string[], share = 0.55): string | null {
  if (tileNoise(x, y, 77) > share) return null;
  return fruits[Math.floor(tileNoise(x, y, 78) * fruits.length) % fruits.length];
}
