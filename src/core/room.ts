/**
 * Linas Zimmer als Raster: Möbel platzieren, drehen, verschieben, Deko auf
 * Tischen, Teppiche unter Möbeln. Reine Logik – Darstellung in `world3d/Interior3D.ts`.
 */

export const ROOM_W = 8;
export const ROOM_H = 6;

/** Feste Felder: Tür (unten Mitte) und das Katalog-Pult (oben links) */
export const DOOR_CELLS: ReadonlyArray<readonly [number, number]> = [
  [3, 5],
  [4, 5],
];
export const DESK_CELL: readonly [number, number] = [0, 0];

export type Rotation = 0 | 1 | 2 | 3;

export interface PlacedItem {
  uid: string;
  itemId: string;
  x: number;
  y: number;
  rot: Rotation;
  /** steht auf diesem Möbel (uid) */
  on?: string;
}

export interface Home {
  wallpaper: string;
  floor: string;
  items: PlacedItem[];
}

/** Was die Raumlogik über ein Möbel wissen muss */
export interface FootInfo {
  w: number;
  d: number;
  rug?: boolean;
  small?: boolean;
  surface?: boolean;
}

export type InfoFn = (itemId: string) => FootInfo | undefined;

export function footprint(info: FootInfo, rot: Rotation): { w: number; d: number } {
  return rot % 2 === 0 ? { w: info.w, d: info.d } : { w: info.d, d: info.w };
}

export function cellsOf(x: number, y: number, info: FootInfo, rot: Rotation): Array<[number, number]> {
  const { w, d } = footprint(info, rot);
  const out: Array<[number, number]> = [];
  for (let dx = 0; dx < w; dx++) for (let dy = 0; dy < d; dy++) out.push([x + dx, y + dy]);
  return out;
}

const key = (x: number, y: number) => `${x},${y}`;

function reserved(): Set<string> {
  return new Set([...DOOR_CELLS, DESK_CELL].map(([x, y]) => key(x, y)));
}

export interface Placement {
  ok: boolean;
  /** steht auf diesem Möbel */
  on?: string;
}

/**
 * Darf `itemId` an (x, y) mit Drehung `rot` stehen? `ignore` = uid, die gerade
 * bewegt wird (zählt nicht als Hindernis).
 */
export function checkPlacement(home: Home, itemId: string, x: number, y: number, rot: Rotation, infoOf: InfoFn, ignore?: string): Placement {
  const info = infoOf(itemId);
  if (!info) return { ok: false };
  const cells = cellsOf(x, y, info, rot);
  if (cells.some(([cx, cy]) => cx < 0 || cy < 0 || cx >= ROOM_W || cy >= ROOM_H)) return { ok: false };
  const res = reserved();
  if (cells.some(([cx, cy]) => res.has(key(cx, cy)))) return { ok: false };

  const others = ignore ? home.items.filter((i) => i.uid !== ignore && i.on !== ignore) : home.items;
  const occupied = (pred: (o: PlacedItem, oi: FootInfo) => boolean) => {
    const map = new Map<string, PlacedItem>();
    for (const o of others) {
      const oi = infoOf(o.itemId);
      if (!oi || !pred(o, oi)) continue;
      for (const [cx, cy] of cellsOf(o.x, o.y, oi, o.rot)) map.set(key(cx, cy), o);
    }
    return map;
  };

  if (info.rug) {
    const rugs = occupied((_o, oi) => !!oi.rug);
    return { ok: cells.every(([cx, cy]) => !rugs.has(key(cx, cy))) };
  }
  const solids = occupied((o, oi) => !oi.rug && !o.on);
  const tops = occupied((o) => !!o.on);
  const hits = cells.map(([cx, cy]) => solids.get(key(cx, cy)));
  if (hits.every((h) => !h)) return { ok: true };
  // Kleines darf auf eine freie Stelle einer Oberfläche
  if (info.small && cells.length === 1) {
    const base = hits[0];
    const baseInfo = base ? infoOf(base.itemId) : undefined;
    if (base && baseInfo?.surface && !tops.has(key(x, y))) return { ok: true, on: base.uid };
  }
  return { ok: false };
}

let uidCounter = 0;
export function newUid(): string {
  uidCounter += 1;
  return `m-${Date.now().toString(36)}-${uidCounter.toString(36)}`;
}

export function placeItem(home: Home, itemId: string, x: number, y: number, rot: Rotation, infoOf: InfoFn, uid = newUid()): PlacedItem | null {
  const p = checkPlacement(home, itemId, x, y, rot, infoOf);
  if (!p.ok) return null;
  const item: PlacedItem = { uid, itemId, x, y, rot, ...(p.on ? { on: p.on } : {}) };
  home.items.push(item);
  return item;
}

/** Verschieben/Drehen eines vorhandenen Möbels; Deko darauf wandert mit. */
export function moveItem(home: Home, uid: string, x: number, y: number, rot: Rotation, infoOf: InfoFn): boolean {
  const item = home.items.find((i) => i.uid === uid);
  if (!item) return false;
  const p = checkPlacement(home, item.itemId, x, y, rot, infoOf, uid);
  if (!p.ok) return false;
  const dx = x - item.x;
  const dy = y - item.y;
  const riders = home.items.filter((i) => i.on === uid);
  if (rot !== item.rot && riders.length > 0) return false; // Drehen nur ohne Deko darauf
  for (const r of riders) {
    r.x += dx;
    r.y += dy;
  }
  item.x = x;
  item.y = y;
  item.rot = rot;
  if (p.on) item.on = p.on;
  else delete item.on;
  return true;
}

/** Entfernt ein Möbel (und was darauf steht). Gibt alles Entfernte zurück. */
export function removeItem(home: Home, uid: string): PlacedItem[] {
  const removed = home.items.filter((i) => i.uid === uid || i.on === uid);
  home.items = home.items.filter((i) => i.uid !== uid && i.on !== uid);
  return removed;
}

/** Was steht auf diesem Feld (oberstes zuerst: Deko, Möbel, Teppich)? */
export function itemsAt(home: Home, x: number, y: number, infoOf: InfoFn): PlacedItem[] {
  const hits: Array<{ item: PlacedItem; layer: number }> = [];
  for (const i of home.items) {
    const info = infoOf(i.itemId);
    if (!info) continue;
    if (cellsOf(i.x, i.y, info, i.rot).some(([cx, cy]) => cx === x && cy === y)) hits.push({ item: i, layer: i.on ? 2 : info.rug ? 0 : 1 });
  }
  return hits.sort((a, b) => b.layer - a.layer).map((h) => h.item);
}

/** Felder, auf denen man nicht laufen kann */
export function blockedCells(home: Home, infoOf: InfoFn): Set<string> {
  const out = new Set<string>([key(...DESK_CELL)]);
  for (const i of home.items) {
    const info = infoOf(i.itemId);
    if (!info || info.rug || i.on) continue;
    for (const [cx, cy] of cellsOf(i.x, i.y, info, i.rot)) out.add(key(cx, cy));
  }
  return out;
}

export function normalizeHome(raw: unknown, fallback: Home, isKnown: (id: string) => boolean, infoOf: InfoFn): Home {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return structuredClone(fallback);
  const r = raw as Record<string, unknown>;
  const home: Home = {
    wallpaper: typeof r.wallpaper === 'string' && isKnown(r.wallpaper) ? r.wallpaper : fallback.wallpaper,
    floor: typeof r.floor === 'string' && isKnown(r.floor) ? r.floor : fallback.floor,
    items: [],
  };
  const list = Array.isArray(r.items) ? r.items : [];
  // erst Möbel, dann Deko (damit die Unterlage schon steht)
  const sorted = [...list].sort((a, b) => Number(!!(a as PlacedItem)?.on) - Number(!!(b as PlacedItem)?.on));
  for (const it of sorted) {
    if (!it || typeof it !== 'object') continue;
    const p = it as Record<string, unknown>;
    if (typeof p.itemId !== 'string' || !isKnown(p.itemId) || typeof p.x !== 'number' || typeof p.y !== 'number') continue;
    const rot = (typeof p.rot === 'number' ? ((Math.floor(p.rot) % 4) + 4) % 4 : 0) as Rotation;
    const uid = typeof p.uid === 'string' && p.uid ? p.uid : newUid();
    placeItem(home, p.itemId, Math.floor(p.x), Math.floor(p.y), rot, infoOf, uid);
  }
  return home;
}
