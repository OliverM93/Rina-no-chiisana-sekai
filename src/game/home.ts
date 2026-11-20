/**
 * Spielregeln für Linas Haus: im Katalog kaufen, Möbel aufstellen,
 * verschieben, wegräumen, Tapete & Boden wechseln – und der Hausausbau
 * über Olafs Dorfkasse.
 */
import { bausparShare, borrow, canBorrow, deposit, repay, withdraw } from '../core/bank';
import { addItem as invAdd, countItem, freeSlots, removeItem as invRemove, spaceFor } from '../core/inventory';
import { keepsAccess, yardBlockedTiles } from '../core/yard';
import { objectAtTile, terrainAt, tileOf } from '../core/worldmap';
import { YARD_AREA } from '../data/yard';
import { spotKey } from '../core/garden';
import { cellsOf, checkPlacement, footprint, misfits, moveItem, placeItem, type PlacedItem, type Room, type RoomLayout, type Rotation, removeItem } from '../core/room';
import { waitOver } from '../core/progress';
import { FURNITURE_BY_ITEM, furnitureInfo, type FurnitureStyle, SURFACE_BY_ID, variantItemId } from '../data/furniture';
import { guestLayout, guestRoom } from '../data/gastHaeuser';
import { emptyRoom, HOUSE_STAGES, layoutOf, MAX_STAGE, roomLayouts } from '../data/house';
import { itemDef, maxStackOf } from '../data/items';
import { lineUnlocked } from './catalog';
import { giveItem, takeItem } from './gameplay';
import type { Session } from './session';

/** Katalogpreis (Kaufpreis) eines Möbels, einer Tapete oder eines Bodens */
export function catalogPrice(itemId: string): number | null {
  const f = FURNITURE_BY_ITEM[itemId];
  if (f) return f.def.price;
  return SURFACE_BY_ID[itemId]?.price ?? null;
}

/**
 * Ist diese Linie im Katalog freigeschaltet? Manche Einrichtungsstile kommen mit einem Einzug (Bistro mit Jens,
 * siehe `data/catalog.ts`) – alles andere gibt es von Anfang an (Game Design F13: nichts wegnehmen, nur Neues später bringen).
 */
export function styleUnlocked(session: Session, style: FurnitureStyle): boolean {
  return lineUnlocked({ flags: session.data?.flags ?? {}, season: 'sommer' }, style);
}

export type BuyResult = 'ok' | 'zu-teuer' | 'tasche-voll' | 'unbekannt';

export function buyFromCatalog(session: Session, itemId: string): BuyResult {
  const data = session.data;
  const price = catalogPrice(itemId);
  if (!data || price === null || !itemDef(itemId)) return 'unbekannt';
  const style = FURNITURE_BY_ITEM[itemId]?.def.style ?? SURFACE_BY_ID[itemId]?.style;
  if (style && !styleUnlocked(session, style)) return 'unbekannt';
  if (data.money < price) return 'zu-teuer';
  const bagOk = spaceFor(data.inventory, itemId, maxStackOf) >= 1;
  // Tasche voll? Dann wandert das Neue in die Vorratstruhe – Einkaufen soll nie am Platz scheitern
  if (!bagOk && spaceFor(data.storage, itemId, maxStackOf) < 1) return 'tasche-voll';
  data.money -= price;
  data.stats.bought += 1;
  session.bus.emit('sfx', 'muenzen');
  if (bagOk) giveItem(session, itemId, 1, false);
  else invAdd(data.storage, itemId, 1, maxStackOf);
  session.changed();
  session.save();
  return 'ok';
}

/** Zum Einrichten bereit: Tasche + Vorratstruhe (Tasche zuerst) */
export function stockCount(session: Session, itemId: string): number {
  const d = session.data;
  return d ? countItem(d.inventory, itemId) + countItem(d.storage, itemId) : 0;
}

/** Einen Gegenstand zum Aufstellen nehmen: erst aus der Tasche, sonst aus der Truhe */
export function takeStock(session: Session, itemId: string): boolean {
  const d = session.data;
  if (!d) return false;
  if (invRemove(d.inventory, itemId, 1) || invRemove(d.storage, itemId, 1)) {
    session.changed();
    return true;
  }
  return false;
}

/** Einen Gegenstand wegräumen: in die Tasche, ist sie voll in die Truhe. false = nirgends Platz */
function giveStock(session: Session, itemId: string): boolean {
  const d = session.data;
  if (!d) return false;
  if (spaceFor(d.inventory, itemId, maxStackOf) >= 1) return giveItem(session, itemId, 1, false) === 0;
  if (invAdd(d.storage, itemId, 1, maxStackOf) === 0) {
    session.changed();
    return true;
  }
  return false;
}

/** Alle Möbel & Oberflächen, die gerade zum Aufstellen bereitliegen (mit Ort: Tasche oder Truhe) */
export function decorStock(session: Session): Array<{ itemId: string; count: number; inStorage: boolean }> {
  const d = session.data;
  if (!d) return [];
  const out = new Map<string, { itemId: string; count: number; inStorage: boolean }>();
  for (const [inv, inStorage] of [[d.inventory, false], [d.storage, true]] as const) {
    for (const s of inv.slots) {
      if (!s || !(FURNITURE_BY_ITEM[s.itemId] || SURFACE_BY_ID[s.itemId])) continue;
      const e = out.get(s.itemId);
      if (e) e.count += s.count;
      else out.set(s.itemId, { itemId: s.itemId, count: s.count, inStorage });
    }
  }
  return [...out.values()];
}

/** Gehören zwei Gegenstände zum selben Möbel (nur andere Farbe)? */
export function sameFamily(a: string, b: string): boolean {
  const fa = FURNITURE_BY_ITEM[a];
  const fb = FURNITURE_BY_ITEM[b];
  return !!fa && !!fb && fa.def.id === fb.def.id;
}

/** Farbvarianten dieses Möbels (leer, wenn es keine gibt) */
export function variantsOf(itemId: string): Array<{ itemId: string; label: string; color: string }> {
  const f = FURNITURE_BY_ITEM[itemId];
  if (!f?.def.variants) return [];
  return Object.entries(f.def.variants).map(([v, color]) => ({ itemId: variantItemId(f.def, v), label: v, color }));
}

export function isFurniture(itemId: string): boolean {
  return !!FURNITURE_BY_ITEM[itemId];
}

export function isSurface(itemId: string): boolean {
  return !!SURFACE_BY_ID[itemId];
}

/** Der Raum, in dem Lina gerade ist – draußen ist das ihr Garten */
export function currentRoom(session: Session): { room: Room; layout: RoomLayout } | null {
  const house = session.data?.house;
  if (!house) return null;
  if (session.inside && session.visiting) {
    const room = guestRoom(session.visiting);
    return room ? { room, layout: guestLayout(session.visiting) } : null;
  }
  if (!session.inside) {
    const yard = session.yardRoom();
    return yard ? { room: yard, layout: session.yardLayoutOf() } : null;
  }
  const room = house.rooms.find((r) => r.id === session.roomId) ?? house.rooms[0];
  return room ? { room, layout: layoutOf(house.stage, room.id) } : null;
}

/** Gehört dieses Möbel hierhin? (Gartensachen nach draußen, Möbel ins Haus) */
export function fitsHere(session: Session, itemId: string): boolean {
  const f = FURNITURE_BY_ITEM[itemId];
  return !!f && !!f.def.outdoor === !session.inside;
}

export function canPlace(session: Session, itemId: string, x: number, y: number, rot: Rotation, moving?: string): boolean {
  return placeProblem(session, itemId, x, y, rot, moving) === null;
}

/**
 * Warum passt das hier nicht? `null` = passt. Draußen gibt es einen konkreten Grund (für den Hinweis beim Aufstellen),
 * damit Lina versteht, warum ein scheinbar leeres Feld nicht geht.
 */
export function placeProblem(session: Session, itemId: string, x: number, y: number, rot: Rotation, moving?: string): string | null {
  const c = currentRoom(session);
  if (!c || !fitsHere(session, itemId)) return 'Das gehört nicht hierher.';
  if (!checkPlacement(c.room, c.layout, itemId, x, y, rot, furnitureInfo, moving).ok) return session.inside ? 'Hier passt es nicht.' : yardCellProblem(session, itemId, x, y, rot);
  if (session.inside) return null;
  // nicht auf die Anbauten von Linas Haus
  const info = furnitureInfo(itemId);
  const area = session.yardArea();
  const annex = new Set(session.houseAnnexTiles());
  if (info && cellsOf(x, y, info, rot).some(([cx, cy]) => annex.has((cy + area.y) * session.map.width + cx + area.x))) return 'Hier steht dein Haus.';
  // Garten: Probe-Aufstellung → niemand wird eingesperrt, Lina steht nicht im Weg
  const trial: Room = structuredClone(c.room);
  if (moving) {
    if (!moveItem(trial, c.layout, moving, x, y, rot, furnitureInfo)) return 'Hier passt es nicht.';
  } else if (!placeItem(trial, c.layout, itemId, x, y, rot, furnitureInfo, 'probe')) return 'Hier passt es nicht.';
  return yardProblem(session, trial);
}

/** Grund, warum ein Gartenfeld belegt oder frei zu halten ist */
function yardCellProblem(session: Session, itemId: string, x: number, y: number, rot: Rotation): string {
  const info = furnitureInfo(itemId);
  const area = session.yardArea();
  if (!info) return 'Hier passt es nicht.';
  for (const [cx, cy] of cellsOf(x, y, info, rot)) {
    if (cx < 0 || cy < 0 || cx >= area.w || cy >= area.h) return 'Das ragt aus dem Garten heraus.';
    const tx = cx + area.x;
    const ty = cy + area.y;
    if (objectAtTile(session.map, tx, ty)) return 'Da steht schon etwas.';
    if (terrainAt(session.map, tx, ty) === 'path') return 'Der Weg bleibt frei.';
    if (session.map.baseBlocked[ty * session.map.width + tx]) return 'Da steht schon etwas.';
    const reserved = session.yardLayoutOf().reserved?.some(([rx, ry]) => rx === cx && ry === cy);
    if (reserved) return 'Hier muss man stehen können – vor Briefkasten, Beet, Werkbank oder Verkaufskiste.';
  }
  return 'Da steht schon etwas.';
}

/** Bleibt im Garten alles erreichbar und steht nichts auf Lina? (`null` = alles gut) */
function yardProblem(session: Session, yard: Room): string | null {
  const data = session.data;
  if (!data) return 'Hier passt es nicht.';
  const area = session.yardArea();
  const tiles = [...yardBlockedTiles(session.map, area, yard, session.yardLayoutOf(), furnitureInfo), ...session.houseAnnexTiles()];
  const lina = tileOf(data.player.x, data.player.y);
  if (tiles.includes(lina.y * session.map.width + lina.x)) return 'Hier stehst du gerade – geh einen Schritt zur Seite.';
  return keepsAccess(session.map, area, tiles) ? null : 'Dann käme man nicht mehr überall hin (Weg, Baum oder Briefkasten wären versperrt).';
}

/** Nach Änderungen im Garten: Kollision & Speichern */
function roomChanged(session: Session) {
  if (!session.inside) session.syncYardCollision();
  session.changed();
  session.save();
}

/**
 * Möbel aus Tasche/Truhe in den Raum stellen. `source` = was wirklich im Vorrat liegt; wählt Lina beim Halten
 * eine andere Farbe (`itemId`), kostet das nichts – es wird genau ein Stück der Ausgangsfarbe verbraucht.
 */
export function placeFromBag(session: Session, itemId: string, x: number, y: number, rot: Rotation, source = itemId): PlacedItem | null {
  const c = currentRoom(session);
  if (!c || (source !== itemId && !sameFamily(source, itemId)) || !canPlace(session, itemId, x, y, rot) || stockCount(session, source) < 1) return null;
  const placed = placeItem(c.room, c.layout, itemId, x, y, rot, furnitureInfo);
  if (!placed) return null;
  takeStock(session, source);
  roomChanged(session);
  return placed;
}

/** Verschiebt ein Möbel; mit `recolor` (anderes Farbmuster derselben Sorte) wechselt es dabei die Farbe – kostenlos. */
export function moveFurniture(session: Session, uid: string, x: number, y: number, rot: Rotation, recolor?: string): boolean {
  const c = currentRoom(session);
  const item = c?.room.items.find((i) => i.uid === uid);
  const data = session.data;
  if (!c || !item || !canPlace(session, item.itemId, x, y, rot, uid)) return false;
  // Hochbeet: die gepflanzten Pflanzen ziehen mit um (auch beim Drehen)
  const carry = !session.inside && data ? bedPlants(session, uid, item.rot) : [];
  if (!moveItem(c.room, c.layout, uid, x, y, rot, furnitureInfo)) return false;
  if (carry.length > 0 && data) {
    for (const p of carry) delete data.world.garden[spotKey(p.from.x, p.from.y)];
    const tiles = bedTiles(session, uid);
    const f = FURNITURE_BY_ITEM[item.itemId];
    const { w, d } = footprint(f.def, rot);
    for (const p of carry) {
      const [nx, ny] = turnCell(p.lx, p.ly, p.w, p.d, (rot - p.rot + 4) % 4);
      // bedTiles läuft über dx (Breite), dann dy (Tiefe)
      const t = tiles[nx * d + ny];
      if (t && nx < w && ny < d) data.world.garden[spotKey(t.x, t.y)] = p.plant;
    }
  }
  if (recolor && recolor !== item.itemId && sameFamily(recolor, item.itemId)) item.itemId = recolor;
  roomChanged(session);
  return true;
}

/** Felder eines Hochbeets im Garten als Weltkacheln */
export function bedTiles(session: Session, uid: string): Array<{ x: number; y: number }> {
  const found = session.findYardItem(uid);
  const item = found?.item;
  const f = item ? FURNITURE_BY_ITEM[item.itemId] : undefined;
  if (!item || !f?.def.bed) return [];
  const area = session.yardArea(found?.id);
  const { w, d } = footprint(f.def, item.rot);
  const out: Array<{ x: number; y: number }> = [];
  for (let dx = 0; dx < w; dx++) for (let dy = 0; dy < d; dy++) out.push({ x: area.x + item.x + dx, y: area.y + item.y + dy });
  return out;
}

/** Eine Zelle (lx, ly) eines w×d-Feldes k-mal um 90° drehen → neue Zelle im gedrehten Feld */
function turnCell(lx: number, ly: number, w: number, d: number, k: number): [number, number] {
  let x = lx;
  let y = ly;
  let cw = w;
  let cd = d;
  for (let i = 0; i < k; i++) {
    [x, y] = [cd - 1 - y, x];
    [cw, cd] = [cd, cw];
  }
  return [x, y];
}

/** Die im Hochbeet gepflanzten Pflanzen samt ihrer Zelle im Beet (vor dem Verschieben) */
function bedPlants(session: Session, uid: string, rot: Rotation) {
  const data = session.data;
  const out: Array<{ from: { x: number; y: number }; lx: number; ly: number; w: number; d: number; rot: Rotation; plant: NonNullable<typeof data>['world']['garden'][string] }> = [];
  const found = session.findYardItem(uid);
  const f = found ? FURNITURE_BY_ITEM[found.item.itemId] : undefined;
  if (!data || !found || !f?.def.bed) return out;
  const { w, d } = footprint(f.def, rot);
  bedTiles(session, uid).forEach((t, i) => {
    const plant = data.world.garden[spotKey(t.x, t.y)];
    if (plant) out.push({ from: t, lx: Math.floor(i / d), ly: i % d, w, d, rot, plant });
  });
  return out;
}

export type PickUpResult = 'ok' | 'voll' | 'pflanzen' | 'fehler';

/** Möbel zurück in die Tasche (mit allem, was darauf steht). */
export function pickUpFurniture(session: Session, uid: string): PickUpResult {
  const c = currentRoom(session);
  const data = session.data;
  if (!c || !data) return 'fehler';
  if (!session.inside && bedTiles(session, uid).some((t) => data.world.garden[spotKey(t.x, t.y)])) return 'pflanzen';
  const riders = c.room.items.filter((i) => i.uid === uid || i.on === uid);
  if (riders.length === 0) return 'fehler';
  // Tasche voll? Dann nimmt die Vorratstruhe den Rest – Wegräumen scheitert nur, wenn beides voll ist
  if (freeSlots(data.inventory) + freeSlots(data.storage) < riders.length) return 'voll';
  for (const r of removeItem(c.room, uid)) giveStock(session, r.itemId);
  roomChanged(session);
  return 'ok';
}

/** Wegräumen rückgängig machen: Möbel (mit allem, was darauf stand) wieder an ihren alten Platz stellen */
export function restoreFurniture(session: Session, items: readonly PlacedItem[]): boolean {
  const c = currentRoom(session);
  if (!c || items.length === 0) return false;
  if (items.some((i) => stockCount(session, i.itemId) < 1)) return false;
  if (c.room.items.some((o) => items.some((i) => i.uid === o.uid))) return false;
  const base = items[0];
  if (!canPlace(session, base.itemId, base.x, base.y, base.rot)) return false;
  for (const i of items) takeStock(session, i.itemId);
  c.room.items.push(...items.map((i) => ({ ...i })));
  roomChanged(session);
  return true;
}

/** Tapete oder Boden im aktuellen Raum anbringen – die alte kommt in die Tasche. */
export function applySurface(session: Session, itemId: string): boolean {
  const c = currentRoom(session);
  const s = SURFACE_BY_ID[itemId];
  if (!c || !s || !takeItem(session, itemId, 1)) return false;
  const old = s.kind === 'tapete' ? c.room.wallpaper : c.room.floor;
  if (s.kind === 'tapete') c.room.wallpaper = itemId;
  else c.room.floor = itemId;
  if (old && old !== itemId) giveItem(session, old, 1, false);
  session.changed();
  session.save();
  return true;
}

// ---------------------------------------------------------------------------
// Ausbau & Dorfkasse
// ---------------------------------------------------------------------------

export function nextStage(session: Session) {
  const house = session.data?.house;
  if (!house || house.stage >= MAX_STAGE || house.pending) return null;
  return HOUSE_STAGES[house.stage + 1];
}

export type OrderResult = 'ok' | 'kredit-offen' | 'fertig' | 'laeuft' | 'zu-wenig-gespart';

/**
 * Ausbau bestellen, fertig nach kurzer Spielzeit (`WAIT_SECONDS`):
 * - `kredit`: als zinsloser Kredit (wie bisher)
 * - `sparbuch`: „Olafs Bausparen“ – Lina zahlt 75 % vom Sparbuch, Papa legt 25 % dazu, kein Kredit
 */
export function orderExpansion(session: Session, pay: 'kredit' | 'sparbuch' = 'kredit'): OrderResult {
  const data = session.data;
  if (!data) return 'fertig';
  if (data.house.pending) return 'laeuft';
  const next = nextStage(session);
  if (!next) return 'fertig';
  if (!canBorrow(data.bank)) return 'kredit-offen';
  if (pay === 'sparbuch') {
    const share = bausparShare(next.price);
    if (data.bank.savings < share) return 'zu-wenig-gespart';
    data.bank.savings -= share;
    session.bus.emit('sfx', 'muenzen');
  } else borrow(data.bank, next.price);
  data.house.pending = { stage: next.stage, day: session.today(), at: session.playTime() };
  session.changed();
  session.save();
  return 'ok';
}

/** Aufs Sparbuch einzahlen (höchstens, was Lina dabeihat) */
export function depositSavings(session: Session, amount: number): number {
  const data = session.data;
  if (!data) return 0;
  const put = deposit(data.bank, amount, data.money, session.today());
  data.money -= put;
  if (put > 0) {
    session.bus.emit('sfx', 'muenzen');
    session.changed();
    session.save();
  }
  return put;
}

/** Vom Sparbuch abheben */
export function withdrawSavings(session: Session, amount: number): number {
  const data = session.data;
  if (!data) return 0;
  const take = withdraw(data.bank, amount);
  data.money += take;
  if (take > 0) {
    session.bus.emit('sfx', 'muenzen');
    session.changed();
    session.save();
  }
  return take;
}

export function repayLoan(session: Session, amount: number): number {
  const data = session.data;
  if (!data) return 0;
  const paid = repay(data.bank, amount, data.money);
  data.money -= paid;
  if (paid > 0) {
    session.changed();
    session.save();
  }
  return paid;
}

/**
 * Ist ein bestellter Ausbau fertig? (am Tag nach der Bestellung)
 * Möbel, die nicht mehr passen, kommen in die Tasche (oder bleiben, wenn sie voll ist, im Lager).
 */
export function finishExpansion(session: Session): number | null {
  const data = session.data;
  const pend = data?.house.pending;
  if (!data || !pend || !waitOver(pend.at, session.playTime())) return null;
  const house = data.house;
  house.stage = pend.stage;
  delete house.pending;
  for (const layout of roomLayouts(house.stage)) {
    let room = house.rooms.find((r) => r.id === layout.id);
    if (!room) {
      room = emptyRoom(layout.id);
      house.rooms.push(room);
    }
    for (const m of misfits(room, layout, furnitureInfo)) {
      room.items = room.items.filter((i) => i.uid !== m.uid);
      if (giveItem(session, m.itemId, 1, false) > 0) data.world.ground.push({ id: `lager-${m.uid}`, itemId: m.itemId, x: session.spawnPoint().x + 40, y: session.spawnPoint().y + 30 });
    }
  }
  // Gartensachen, wo jetzt ein Anbau steht, kommen in die Tasche (oder liegen vor der Tür)
  const yard = data.yard;
  if (yard) {
    const annex = new Set(session.houseAnnexTiles(house.stage));
    for (const it of [...yard.items]) {
      const info = furnitureInfo(it.itemId);
      if (!info || it.on) continue;
      if (!cellsOf(it.x, it.y, info, it.rot).some(([cx, cy]) => annex.has((cy + YARD_AREA.y) * session.map.width + cx + YARD_AREA.x))) continue;
      for (const m of removeItem(yard, it.uid)) {
        if (giveItem(session, m.itemId, 1, false) > 0) data.world.ground.push({ id: `lager-${m.uid}`, itemId: m.itemId, x: session.spawnPoint().x + 40, y: session.spawnPoint().y + 30 });
      }
    }
  }
  session.syncYardCollision();
  session.changed();
  session.save();
  return house.stage;
}
