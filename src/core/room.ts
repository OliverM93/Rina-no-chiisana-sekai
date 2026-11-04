/**
 * Linas Haus als Raster: Räume mit Größe und Ausgängen, Möbel platzieren,
 * drehen, verschieben, Deko auf Tischen, Teppiche unter Möbeln.
 * Reine Logik – Darstellung in `world3d/Interior3D.ts`, Ausbaustufen in `data/house.ts`.
 */

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

/** Ein Raum: Tapete, Boden, Möbel */
export interface Room {
  id: string;
  wallpaper: string;
  floor: string;
  items: PlacedItem[];
}

/** Das ganze Haus: Ausbaustufe und Räume */
export interface House {
  stage: number;
  rooms: Room[];
  /** bestellter Ausbau, fertig am Tag nach `day` */
  pending?: { stage: number; day: string };
}

/** Ausgang eines Raums: Haustür, Durchgang, Treppe */
export interface Exit {
  /** Felder im Raum, auf denen man hinausgeht */
  cells: ReadonlyArray<readonly [number, number]>;
  /** Ziel: Raum-ID oder 'draussen' */
  to: string;
  /** Richtung, in die man laufen muss ('down' = Vorderseite, 'up' = Rückwand) */
  dir: 'down' | 'up';
  kind: 'haustuer' | 'durchgang' | 'treppe';
}

/** Form eines Raums in einer Ausbaustufe */
export interface RoomLayout {
  id: string;
  name: string;
  w: number;
  h: number;
  exits: readonly Exit[];
  /** Katalog-Pult */
  desk?: readonly [number, number];
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

/** Felder, auf denen keine Möbel stehen dürfen (Ausgänge, Pult) */
export function reservedCells(layout: RoomLayout): Set<string> {
  const out = new Set<string>();
  for (const e of layout.exits) for (const [x, y] of e.cells) out.add(key(x, y));
  if (layout.desk) out.add(key(...layout.desk));
  return out;
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
export function checkPlacement(room: Room, layout: RoomLayout, itemId: string, x: number, y: number, rot: Rotation, infoOf: InfoFn, ignore?: string): Placement {
  const info = infoOf(itemId);
  if (!info) return { ok: false };
  const cells = cellsOf(x, y, info, rot);
  if (cells.some(([cx, cy]) => cx < 0 || cy < 0 || cx >= layout.w || cy >= layout.h)) return { ok: false };
  const res = reservedCells(layout);
  if (cells.some(([cx, cy]) => res.has(key(cx, cy)))) return { ok: false };

  const others = ignore ? room.items.filter((i) => i.uid !== ignore && i.on !== ignore) : room.items;
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

export function placeItem(room: Room, layout: RoomLayout, itemId: string, x: number, y: number, rot: Rotation, infoOf: InfoFn, uid = newUid()): PlacedItem | null {
  const p = checkPlacement(room, layout, itemId, x, y, rot, infoOf);
  if (!p.ok) return null;
  const item: PlacedItem = { uid, itemId, x, y, rot, ...(p.on ? { on: p.on } : {}) };
  room.items.push(item);
  return item;
}

/** Verschieben/Drehen eines vorhandenen Möbels; Deko darauf wandert mit. */
export function moveItem(room: Room, layout: RoomLayout, uid: string, x: number, y: number, rot: Rotation, infoOf: InfoFn): boolean {
  const item = room.items.find((i) => i.uid === uid);
  if (!item) return false;
  const p = checkPlacement(room, layout, item.itemId, x, y, rot, infoOf, uid);
  if (!p.ok) return false;
  const dx = x - item.x;
  const dy = y - item.y;
  const riders = room.items.filter((i) => i.on === uid);
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
export function removeItem(room: Room, uid: string): PlacedItem[] {
  const removed = room.items.filter((i) => i.uid === uid || i.on === uid);
  room.items = room.items.filter((i) => i.uid !== uid && i.on !== uid);
  return removed;
}

/** Was steht auf diesem Feld (oberstes zuerst: Deko, Möbel, Teppich)? */
export function itemsAt(room: Room, x: number, y: number, infoOf: InfoFn): PlacedItem[] {
  const hits: Array<{ item: PlacedItem; layer: number }> = [];
  for (const i of room.items) {
    const info = infoOf(i.itemId);
    if (!info) continue;
    if (cellsOf(i.x, i.y, info, i.rot).some(([cx, cy]) => cx === x && cy === y)) hits.push({ item: i, layer: i.on ? 2 : info.rug ? 0 : 1 });
  }
  return hits.sort((a, b) => b.layer - a.layer).map((h) => h.item);
}

/** Felder, auf denen man nicht laufen kann */
export function blockedCells(room: Room, layout: RoomLayout, infoOf: InfoFn): Set<string> {
  const out = new Set<string>(layout.desk ? [key(...layout.desk)] : []);
  for (const i of room.items) {
    const info = infoOf(i.itemId);
    if (!info || info.rug || i.on) continue;
    for (const [cx, cy] of cellsOf(i.x, i.y, info, i.rot)) out.add(key(cx, cy));
  }
  return out;
}

/** Ausgang an diesem Feld? */
export function exitAt(layout: RoomLayout, x: number, y: number): Exit | null {
  return layout.exits.find((e) => e.cells.some(([cx, cy]) => cx === x && cy === y)) ?? null;
}

/** Möbel, die nach einem Umbau nicht mehr passen (aus dem Raum oder auf einem Ausgang) */
export function misfits(room: Room, layout: RoomLayout, infoOf: InfoFn): PlacedItem[] {
  const keep: Room = { ...room, items: [] };
  const out: PlacedItem[] = [];
  const sorted = [...room.items].sort((a, b) => Number(!!a.on) - Number(!!b.on));
  for (const it of sorted) {
    if (it.on && !keep.items.some((k) => k.uid === it.on)) {
      out.push(it);
      continue;
    }
    const p = checkPlacement(keep, layout, it.itemId, it.x, it.y, it.rot, infoOf);
    if (p.ok) keep.items.push({ ...it, ...(p.on ? { on: p.on } : {}) });
    else out.push(it);
  }
  return out;
}

export function normalizeRoom(raw: unknown, fallback: Room, layout: RoomLayout, isKnown: (id: string) => boolean, infoOf: InfoFn): Room {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return structuredClone(fallback);
  const r = raw as Record<string, unknown>;
  const room: Room = {
    id: layout.id,
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
    placeItem(room, layout, p.itemId, Math.floor(p.x), Math.floor(p.y), rot, infoOf, uid);
  }
  return room;
}

export interface HouseRules {
  /** Räume einer Ausbaustufe */
  layouts: (stage: number) => readonly RoomLayout[];
  maxStage: number;
  /** Start-Einrichtung eines Raums */
  emptyRoom: (id: string) => Room;
}

export function normalizeHouse(raw: unknown, fallback: House, rules: HouseRules, isKnown: (id: string) => boolean, infoOf: InfoFn): House {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return structuredClone(fallback);
  const r = raw as Record<string, unknown>;
  const stage = typeof r.stage === 'number' ? Math.max(0, Math.min(rules.maxStage, Math.floor(r.stage))) : 0;
  const rawRooms = Array.isArray(r.rooms) ? (r.rooms as Array<Record<string, unknown>>) : [];
  const rooms = rules.layouts(stage).map((layout) => {
    const rr = rawRooms.find((x) => x && x.id === layout.id);
    const fb = fallback.rooms.find((x) => x.id === layout.id) ?? rules.emptyRoom(layout.id);
    return rr ? normalizeRoom(rr, fb, layout, isKnown, infoOf) : structuredClone(fb);
  });
  const house: House = { stage, rooms };
  const pend = r.pending as Record<string, unknown> | undefined;
  if (pend && typeof pend.stage === 'number' && typeof pend.day === 'string' && pend.stage > stage && pend.stage <= rules.maxStage) {
    house.pending = { stage: Math.floor(pend.stage), day: pend.day };
  }
  return house;
}
