/**
 * Linas Garten: ein Raster auf ihrem Grundstück rund ums Haus, auf dem sie
 * Zäune, Wege, Gartenmöbel, Deko und Hochbeete aufstellt.
 *
 * Es gilt dieselbe Raumlogik wie drinnen (`room.ts`). Zusätzlich:
 * - Hauswände, Bäume, Briefkasten … und alle Stellen, von denen aus man mit
 *   etwas spricht/etwas benutzt, bleiben frei (`reserved`).
 * - Nichts darf Lina (oder Wege im Dorf) einsperren: Was vorher erreichbar war,
 *   bleibt erreichbar (`keepsAccess`).
 */
import type { Tile } from './grid';
import { blockedCells, type InfoFn, type Room, type RoomLayout } from './room';
import { OBJECT_KINDS, terrainAt, type WorldMap } from './worldmap';

export interface YardArea {
  /** linke obere Kachel */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Von hier aus muss alles erreichbar bleiben (z. B. der Dorfplatz) */
  from: Tile;
}

export const YARD_ID = 'garten';

/** Interaktionsfelder aller Objekte (Kachel-Indizes) */
function interactionTiles(map: WorldMap): Set<number> {
  const out = new Set<number>();
  for (const o of map.objects) {
    for (const [dx, dy] of OBJECT_KINDS[o.kind].interactFrom ?? []) {
      const x = o.x + dx;
      const y = o.y + dy;
      if (x >= 0 && y >= 0 && x < map.width && y < map.height) out.add(y * map.width + x);
    }
  }
  return out;
}

/** Form des Gartens: Größe + Felder, die frei bleiben müssen */
export function buildYardLayout(map: WorldMap, area: YardArea): RoomLayout {
  const inter = interactionTiles(map);
  const reserved: Array<[number, number]> = [];
  for (let y = 0; y < area.h; y++) {
    for (let x = 0; x < area.w; x++) {
      const tx = area.x + x;
      const ty = area.y + y;
      const i = ty * map.width + tx;
      // alle Objekte zählen (auch noch nicht gebaute), dazu Wasser und der Hauptweg
      const objectHere = map.objects.some((o) => tx >= o.x && tx < o.x + o.w && ty >= o.y && ty < o.y + o.h);
      if (map.baseBlocked[i] || objectHere || inter.has(i) || terrainAt(map, tx, ty) === 'path') reserved.push([x, y]);
    }
  }
  return { id: YARD_ID, name: 'Garten', w: area.w, h: area.h, exits: [], reserved };
}

/** Kachel-Indizes, die die Gartenmöbel blockieren */
export function yardBlockedTiles(map: WorldMap, area: YardArea, yard: Room, layout: RoomLayout, infoOf: InfoFn): number[] {
  return [...blockedCells(yard, { ...layout, desk: undefined }, infoOf)].map((k) => {
    const [x, y] = k.split(',').map(Number);
    return (area.y + y) * map.width + area.x + x;
  });
}

/** Erreichbare Kacheln von `from` (4er-Nachbarschaft) */
function reachable(map: WorldMap, from: Tile, blocked: (i: number) => boolean): Uint8Array {
  const seen = new Uint8Array(map.width * map.height);
  const start = from.y * map.width + from.x;
  if (blocked(start)) return seen;
  const queue = [start];
  seen[start] = 1;
  while (queue.length) {
    const i = queue.pop() as number;
    const x = i % map.width;
    const y = (i - x) / map.width;
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (nx < 0 || ny < 0 || nx >= map.width || ny >= map.height) continue;
      const n = ny * map.width + nx;
      if (seen[n] || blocked(n)) continue;
      seen[n] = 1;
      queue.push(n);
    }
  }
  return seen;
}

/**
 * Bleibt alles Wichtige erreichbar, wenn diese Gartenkacheln blockiert sind?
 * Wichtig = alle Interaktionsfelder und alle Kacheln außerhalb des Gartens,
 * die ohne Gartenmöbel erreichbar wären.
 */
export function keepsAccess(map: WorldMap, area: YardArea, blockedTiles: Iterable<number>): boolean {
  const extra = new Set(blockedTiles);
  const before = reachable(map, area.from, (i) => map.staticBlocked[i] === 1);
  const after = reachable(map, area.from, (i) => map.staticBlocked[i] === 1 || extra.has(i));
  const inter = interactionTiles(map);
  const inYard = (i: number) => {
    const x = i % map.width;
    const y = (i - x) / map.width;
    return x >= area.x && x < area.x + area.w && y >= area.y && y < area.y + area.h;
  };
  for (let i = 0; i < before.length; i++) {
    if (!before[i] || after[i] || extra.has(i)) continue;
    // abgeschlossene Ecken im eigenen Garten sind erlaubt – außer vor Briefkasten & Co.
    if (!inYard(i) || inter.has(i)) return false;
  }
  return true;
}
