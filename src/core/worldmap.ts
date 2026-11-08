/**
 * Weltkarte als reines Datenmodell: Untergrund, Objekte, Kollision und
 * Interaktionspunkte. Wird aus ASCII-Layout + Objektliste aufgebaut
 * (siehe `src/data/maps/village.ts`). Keine Abhängigkeit zu Phaser.
 */
import { CollisionGrid, type Tile } from './grid';

export const TILE = 64;

export type Terrain = 'grass' | 'path' | 'plaza' | 'sand' | 'water' | 'sea' | 'deep';

export type NatureKind = 'tree' | 'pine' | 'bush' | 'rock';

export type ObjectKind =
  | 'house'
  | 'plot'
  | 'mailbox'
  | 'workbench'
  | 'bistro'
  | 'praxis'
  | 'board'
  | 'lantern'
  | 'bench'
  | 'fountain'
  | 'bridge'
  | 'sellbox'
  | 'beet'
  | 'stall'
  | 'seedstall'
  | NatureKind;

export interface MapObjectDef {
  id: string;
  kind: ObjectKind;
  /** linke obere Kachel der Grundfläche */
  x: number;
  y: number;
  variant?: string;
  /** erscheint erst, wenn dieses Story-Flag gesetzt ist (z. B. Einzug) */
  requires?: string;
  /** verschwindet, sobald dieses Flag gesetzt ist (z. B. Bauplatz) */
  until?: string;
}

interface KindInfo {
  w: number;
  h: number;
  /** Welche Kacheln der Grundfläche blockieren. */
  blocks: 'all' | 'none' | Array<[number, number]>;
  /** Wo man stehen kann, um zu interagieren (relativ zur Grundfläche). */
  interactFrom?: Array<[number, number]>;
}

const AROUND: Array<[number, number]> = [
  [0, 1],
  [-1, 0],
  [1, 0],
  [0, -1],
];

export const OBJECT_KINDS: Record<ObjectKind, KindInfo> = {
  house: { w: 5, h: 3, blocks: 'all', interactFrom: [[2, 3]] },
  bistro: { w: 5, h: 3, blocks: 'all', interactFrom: [[2, 3], [1, 3], [3, 3]] },
  praxis: { w: 5, h: 3, blocks: 'all', interactFrom: [[2, 3], [1, 3], [3, 3]] },
  // Bauplatz: Grundfläche frei, nur das Schild vorne mittig blockiert.
  plot: { w: 5, h: 3, blocks: [[2, 2]], interactFrom: [[2, 3], [1, 2], [3, 2]] },
  mailbox: { w: 1, h: 1, blocks: 'all', interactFrom: [[0, 1], [-1, 0], [1, 0]] },
  board: { w: 2, h: 1, blocks: 'all', interactFrom: [[0, 1], [1, 1]] },
  lantern: { w: 1, h: 1, blocks: 'all' },
  bench: { w: 2, h: 1, blocks: 'all', interactFrom: [[0, 1], [1, 1]] },
  fountain: { w: 3, h: 2, blocks: 'all', interactFrom: [[1, 2], [-1, 0], [3, 0], [1, -1], [-1, 1], [3, 1]] },
  bridge: { w: 3, h: 1, blocks: 'none' },
  sellbox: { w: 1, h: 1, blocks: 'all', interactFrom: [[0, 1], [1, 0]] },
  workbench: { w: 2, h: 1, blocks: 'all', interactFrom: [[0, 1], [1, 1], [-1, 0], [2, 0]] },
  // Punschstand (nur in der Adventszeit, siehe `requires: 'adventszeit'`)
  stall: { w: 2, h: 1, blocks: 'all', interactFrom: [[0, 1], [1, 1]] },
  // Christins Samenstand auf dem Dorfplatz (`data/seedstand.ts`)
  seedstall: { w: 2, h: 1, blocks: 'all', interactFrom: [[0, 1], [1, 1], [-1, 0], [2, 0]] },
  // Beet 4×2: jede Kachel ist ein Pflanzplatz, erreichbar von allen Seiten
  beet: {
    w: 4,
    h: 2,
    blocks: 'all',
    interactFrom: [[0, 2], [1, 2], [2, 2], [3, 2], [0, -1], [1, -1], [2, -1], [3, -1], [-1, 0], [-1, 1], [4, 0], [4, 1]],
  },
  tree: { w: 1, h: 1, blocks: 'all', interactFrom: AROUND },
  pine: { w: 1, h: 1, blocks: 'all' },
  bush: { w: 1, h: 1, blocks: 'all' },
  rock: { w: 1, h: 1, blocks: 'all', interactFrom: AROUND },
};

export interface MapObject extends MapObjectDef {
  w: number;
  h: number;
}

export interface WorldMap {
  width: number;
  height: number;
  terrain: Terrain[];
  /** Kacheln mit Blümchen-Deko */
  flowers: Uint8Array;
  objects: MapObject[];
  grid: CollisionGrid;
  spawn: Tile;
  /** Kachel-Index → Objekt-ID, von wo aus interagiert werden kann */
  interactAt: Map<number, string[]>;
  /** Objekte, die gerade (noch) nicht da sind */
  inactive: Set<string>;
  /** Blockiertes aus dem Gelände (Wasser) – Grundlage zum Neuberechnen */
  baseBlocked: Uint8Array;
  /** Gelände + Objekte, ohne Linas Gartenmöbel */
  staticBlocked: Uint8Array;
  /** Zusätzlich blockierte Kacheln (Linas Gartenmöbel), als Kachel-Index */
  extra: Set<number>;
}

const CHAR_TERRAIN: Record<string, Terrain> = {
  '.': 'grass',
  ',': 'grass',
  '#': 'path',
  ':': 'plaza',
  '~': 'water',
  '=': 'water',
  s: 'sand',
  w: 'sea',
  W: 'deep',
  T: 'grass',
  P: 'grass',
  b: 'grass',
  r: 'grass',
};

const CHAR_NATURE: Record<string, NatureKind> = { T: 'tree', P: 'pine', b: 'bush', r: 'rock' };

export const KNOWN_CHARS = Object.keys(CHAR_TERRAIN);

export function isWaterTerrain(t: Terrain): boolean {
  return t === 'water' || t === 'sea' || t === 'deep';
}

export function buildWorldMap(layout: readonly string[], defs: readonly MapObjectDef[], spawn: Tile): WorldMap {
  const height = layout.length;
  const width = layout[0]?.length ?? 0;
  const terrain: Terrain[] = new Array(width * height);
  const flowers = new Uint8Array(width * height);
  const grid = new CollisionGrid(width, height);
  const objects: MapObject[] = [];

  layout.forEach((row, y) => {
    if (row.length !== width) throw new Error(`Kartenreihe ${y} hat ${row.length} statt ${width} Zeichen.`);
    for (let x = 0; x < width; x++) {
      const ch = row[x];
      const t = CHAR_TERRAIN[ch];
      if (!t) throw new Error(`Unbekanntes Kartenzeichen '${ch}' bei (${x}, ${y}).`);
      terrain[y * width + x] = t;
      if (ch === ',') flowers[y * width + x] = 1;
      if (isWaterTerrain(t) && ch !== '=') grid.setBlocked(x, y);
      const nature = CHAR_NATURE[ch];
      if (nature) objects.push({ id: `${nature}-${x}-${y}`, kind: nature, x, y, w: 1, h: 1 });
    }
  });

  for (const def of defs) {
    const info = OBJECT_KINDS[def.kind];
    objects.push({ ...def, w: info.w, h: info.h });
  }

  const baseBlocked = grid.blocked.slice();
  const inactive = new Set(objects.filter((o) => o.requires).map((o) => o.id));
  applyObjectCollision(grid, objects, inactive);

  // Interaktionspunkte
  const interactAt = new Map<number, string[]>();
  for (const obj of objects) {
    const from = OBJECT_KINDS[obj.kind].interactFrom;
    if (!from) continue;
    for (const [dx, dy] of from) {
      const tx = obj.x + dx;
      const ty = obj.y + dy;
      if (!grid.inBounds(tx, ty)) continue;
      const key = ty * width + tx;
      const list = interactAt.get(key) ?? [];
      list.push(obj.id);
      interactAt.set(key, list);
    }
  }

  return { width, height, terrain, flowers, objects, grid, spawn, interactAt, inactive, baseBlocked, staticBlocked: grid.blocked.slice(), extra: new Set() };
}

function applyObjectCollision(grid: CollisionGrid, objects: readonly MapObject[], inactive: ReadonlySet<string>) {
  for (const obj of objects) {
    if (inactive.has(obj.id)) continue;
    const info = OBJECT_KINDS[obj.kind];
    if (obj.kind === 'bridge') {
      grid.blockRect(obj.x, obj.y, obj.w, obj.h, false);
      continue;
    }
    if (info.blocks === 'all') grid.blockRect(obj.x, obj.y, obj.w, obj.h);
    else if (Array.isArray(info.blocks)) for (const [dx, dy] of info.blocks) grid.setBlocked(obj.x + dx, obj.y + dy);
  }
}

/**
 * Story-Flags anwenden (z. B. „Olaf ist eingezogen“ → Haus statt Bauplatz).
 * Gibt die IDs der Objekte zurück, die sich geändert haben.
 */
export function applyMapFlags(map: WorldMap, flags: Readonly<Record<string, boolean>>): string[] {
  const changed: string[] = [];
  for (const o of map.objects) {
    if (!o.requires && !o.until) continue;
    const active = (!o.requires || !!flags[o.requires]) && (!o.until || !flags[o.until]);
    if (active === !map.inactive.has(o.id)) continue;
    if (active) map.inactive.delete(o.id);
    else map.inactive.add(o.id);
    changed.push(o.id);
  }
  if (changed.length > 0) rebuildCollision(map);
  return changed;
}

/** Kollision neu berechnen: Gelände, aktive Objekte, Gartenmöbel */
function rebuildCollision(map: WorldMap) {
  map.grid.blocked.set(map.baseBlocked);
  applyObjectCollision(map.grid, map.objects, map.inactive);
  map.staticBlocked = map.grid.blocked.slice();
  for (const i of map.extra) map.grid.blocked[i] = 1;
}

/** Linas Gartenmöbel als zusätzliche Hindernisse setzen (Kachel-Indizes) */
export function setExtraBlocked(map: WorldMap, tiles: Iterable<number>) {
  map.extra = new Set(tiles);
  rebuildCollision(map);
}

export function isActive(map: WorldMap, id: string): boolean {
  return !map.inactive.has(id);
}

export function terrainAt(map: WorldMap, x: number, y: number): Terrain | null {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return null;
  return map.terrain[y * map.width + x];
}

export function tileOf(px: number, py: number): Tile {
  return { x: Math.floor(px / TILE), y: Math.floor(py / TILE) };
}

export function tileCenter(t: Tile): { x: number; y: number } {
  return { x: (t.x + 0.5) * TILE, y: (t.y + 0.5) * TILE };
}

export function objectById(map: WorldMap, id: string): MapObject | undefined {
  return map.objects.find((o) => o.id === id);
}

/** Objekt, das eine bestimmte Kachel belegt (z. B. für Klicks). */
export function objectAtTile(map: WorldMap, tx: number, ty: number): MapObject | undefined {
  // Spätere Einträge (Gebäude) haben Vorrang vor Natur.
  for (let i = map.objects.length - 1; i >= 0; i--) {
    const o = map.objects[i];
    if (map.inactive.has(o.id)) continue;
    if (tx >= o.x && ty >= o.y && tx < o.x + o.w && ty < o.y + o.h) return o;
  }
  return undefined;
}

/**
 * Welches Objekt kann Lina gerade „anfassen“? Zuerst die Kachel in
 * Blickrichtung, dann die eigene Kachel (über Interaktionspunkte).
 */
export function findInteraction(
  map: WorldMap,
  standing: Tile,
  facing: 'down' | 'up' | 'left' | 'right',
  interactiveIds: ReadonlySet<string>,
): string | null {
  const dir = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] }[facing];
  const here = (map.interactAt.get(standing.y * map.width + standing.x) ?? []).filter((id) => interactiveIds.has(id) && !map.inactive.has(id));
  if (here.length === 0) return null;

  // 1. Objekt direkt in Blickrichtung
  const front = objectAtTile(map, standing.x + dir[0], standing.y + dir[1]);
  if (front && here.includes(front.id)) return front.id;

  // 2. Sonst ein Objekt, zu dem Lina ungefähr hinschaut
  for (const id of here) {
    const obj = objectById(map, id);
    if (!obj) continue;
    // Man muss in etwa zum Objekt schauen.
    const cx = obj.x + obj.w / 2 - 0.5;
    const cy = obj.y + obj.h / 2 - 0.5;
    const vx = cx - standing.x;
    const vy = cy - standing.y;
    const dot = vx * dir[0] + vy * dir[1];
    if (dot > 0) return id;
  }
  return null;
}
