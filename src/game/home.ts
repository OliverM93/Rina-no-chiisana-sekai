/**
 * Spielregeln für Linas Haus: im Katalog kaufen, Möbel aufstellen,
 * verschieben, wegräumen, Tapete & Boden wechseln – und der Hausausbau
 * über Olafs Dorfkasse.
 */
import { borrow, canBorrow, deposit, repay, withdraw } from '../core/bank';
import { freeSlots, spaceFor } from '../core/inventory';
import { keepsAccess, yardBlockedTiles } from '../core/yard';
import { tileOf } from '../core/worldmap';
import { YARD_AREA } from '../data/yard';
import { spotKey } from '../core/garden';
import { cellsOf, checkPlacement, footprint, misfits, moveItem, placeItem, type Room, type RoomLayout, type Rotation, removeItem } from '../core/room';
import { waitOver } from '../core/progress';
import { FURNITURE_BY_ITEM, furnitureInfo, type FurnitureStyle, SURFACE_BY_ID } from '../data/furniture';
import { emptyRoom, HOUSE_STAGES, layoutOf, MAX_STAGE, roomLayouts } from '../data/house';
import { itemDef, maxStackOf } from '../data/items';
import { giveItem, takeItem } from './gameplay';
import type { Session } from './session';

/** Katalogpreis (Kaufpreis) eines Möbels, einer Tapete oder eines Bodens */
export function catalogPrice(itemId: string): number | null {
  const f = FURNITURE_BY_ITEM[itemId];
  if (f) return f.def.price;
  return SURFACE_BY_ID[itemId]?.price ?? null;
}

/**
 * Ist dieser Stil im Katalog freigeschaltet? Das Französische Bistro bringt Jens mit (ab seinem Einzug) – alle
 * anderen Stile gibt es von Anfang an (Game Design F13: nichts wegnehmen, nur Neues später bringen).
 */
export function styleUnlocked(session: Session, style: FurnitureStyle): boolean {
  if (style === 'bistro') return !!session.data?.flags.jensBegruesst;
  return true;
}

export type BuyResult = 'ok' | 'zu-teuer' | 'tasche-voll' | 'unbekannt';

export function buyFromCatalog(session: Session, itemId: string): BuyResult {
  const data = session.data;
  const price = catalogPrice(itemId);
  if (!data || price === null || !itemDef(itemId)) return 'unbekannt';
  const style = FURNITURE_BY_ITEM[itemId]?.def.style ?? SURFACE_BY_ID[itemId]?.style;
  if (style && !styleUnlocked(session, style)) return 'unbekannt';
  if (data.money < price) return 'zu-teuer';
  if (spaceFor(data.inventory, itemId, maxStackOf) < 1) return 'tasche-voll';
  data.money -= price;
  data.stats.bought += 1;
  session.bus.emit('sfx', 'muenzen');
  giveItem(session, itemId, 1, false);
  session.changed();
  session.save();
  return 'ok';
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
  if (!session.inside) return session.data ? { room: session.data.yard, layout: session.yardLayout } : null;
  const room = house.rooms.find((r) => r.id === session.roomId) ?? house.rooms[0];
  return room ? { room, layout: layoutOf(house.stage, room.id) } : null;
}

/** Gehört dieses Möbel hierhin? (Gartensachen nach draußen, Möbel ins Haus) */
export function fitsHere(session: Session, itemId: string): boolean {
  const f = FURNITURE_BY_ITEM[itemId];
  return !!f && !!f.def.outdoor === !session.inside;
}

export function canPlace(session: Session, itemId: string, x: number, y: number, rot: Rotation, moving?: string): boolean {
  const c = currentRoom(session);
  if (!c || !fitsHere(session, itemId) || !checkPlacement(c.room, c.layout, itemId, x, y, rot, furnitureInfo, moving).ok) return false;
  if (session.inside) return true;
  // nicht auf die Anbauten von Linas Haus
  const info = furnitureInfo(itemId);
  const annex = new Set(session.houseAnnexTiles());
  if (info && cellsOf(x, y, info, rot).some(([cx, cy]) => annex.has((cy + YARD_AREA.y) * session.map.width + cx + YARD_AREA.x))) return false;
  // Garten: Probe-Aufstellung → niemand wird eingesperrt, Lina steht nicht im Weg
  const trial: Room = structuredClone(c.room);
  if (moving) {
    if (!moveItem(trial, c.layout, moving, x, y, rot, furnitureInfo)) return false;
  } else if (!placeItem(trial, c.layout, itemId, x, y, rot, furnitureInfo, 'probe')) return false;
  return yardOk(session, trial);
}

/** Bleibt im Garten alles erreichbar und steht nichts auf Lina? */
function yardOk(session: Session, yard: Room): boolean {
  const data = session.data;
  if (!data) return false;
  const tiles = [...yardBlockedTiles(session.map, YARD_AREA, yard, session.yardLayout, furnitureInfo), ...session.houseAnnexTiles()];
  const lina = tileOf(data.player.x, data.player.y);
  if (tiles.includes(lina.y * session.map.width + lina.x)) return false;
  return keepsAccess(session.map, YARD_AREA, tiles);
}

/** Nach Änderungen im Garten: Kollision & Speichern */
function roomChanged(session: Session) {
  if (!session.inside) session.syncYardCollision();
  session.changed();
  session.save();
}

/** Möbel aus der Tasche in den Raum stellen */
export function placeFromBag(session: Session, itemId: string, x: number, y: number, rot: Rotation): boolean {
  const c = currentRoom(session);
  if (!c || !canPlace(session, itemId, x, y, rot) || !takeItem(session, itemId, 1)) return false;
  placeItem(c.room, c.layout, itemId, x, y, rot, furnitureInfo);
  roomChanged(session);
  return true;
}

export function moveFurniture(session: Session, uid: string, x: number, y: number, rot: Rotation): boolean {
  const c = currentRoom(session);
  const item = c?.room.items.find((i) => i.uid === uid);
  const data = session.data;
  if (!session.inside && data && bedTiles(session, uid).some((t) => data.world.garden[spotKey(t.x, t.y)])) return false;
  if (!c || !item || !canPlace(session, item.itemId, x, y, rot, uid) || !moveItem(c.room, c.layout, uid, x, y, rot, furnitureInfo)) return false;
  roomChanged(session);
  return true;
}

/** Felder eines Hochbeets im Garten als Weltkacheln */
export function bedTiles(session: Session, uid: string): Array<{ x: number; y: number }> {
  const item = session.data?.yard.items.find((i) => i.uid === uid);
  const f = item ? FURNITURE_BY_ITEM[item.itemId] : undefined;
  if (!item || !f?.def.bed) return [];
  const { w, d } = footprint(f.def, item.rot);
  const out: Array<{ x: number; y: number }> = [];
  for (let dx = 0; dx < w; dx++) for (let dy = 0; dy < d; dy++) out.push({ x: YARD_AREA.x + item.x + dx, y: YARD_AREA.y + item.y + dy });
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
  if (freeSlots(data.inventory) < riders.length) return 'voll';
  for (const r of removeItem(c.room, uid)) giveItem(session, r.itemId, 1, false);
  roomChanged(session);
  return 'ok';
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

export type OrderResult = 'ok' | 'kredit-offen' | 'fertig' | 'laeuft';

/** Ausbau bestellen: wird als zinsloser Kredit verbucht, fertig nach kurzer Spielzeit (`WAIT_SECONDS`). */
export function orderExpansion(session: Session): OrderResult {
  const data = session.data;
  if (!data) return 'fertig';
  if (data.house.pending) return 'laeuft';
  const next = nextStage(session);
  if (!next) return 'fertig';
  if (!canBorrow(data.bank)) return 'kredit-offen';
  borrow(data.bank, next.price);
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
