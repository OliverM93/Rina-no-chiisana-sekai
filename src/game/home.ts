/**
 * Spielregeln für Linas Haus: im Katalog kaufen, Möbel aufstellen,
 * verschieben, wegräumen, Tapete & Boden wechseln – und der Hausausbau
 * über Olafs Dorfkasse.
 */
import { borrow, canBorrow, repay } from '../core/bank';
import { freeSlots, spaceFor } from '../core/inventory';
import { checkPlacement, misfits, moveItem, placeItem, type Room, type RoomLayout, type Rotation, removeItem } from '../core/room';
import { daysBetween } from '../core/daily';
import { FURNITURE_BY_ITEM, furnitureInfo, SURFACE_BY_ID } from '../data/furniture';
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

export type BuyResult = 'ok' | 'zu-teuer' | 'tasche-voll' | 'unbekannt';

export function buyFromCatalog(session: Session, itemId: string): BuyResult {
  const data = session.data;
  const price = catalogPrice(itemId);
  if (!data || price === null || !itemDef(itemId)) return 'unbekannt';
  if (data.money < price) return 'zu-teuer';
  if (spaceFor(data.inventory, itemId, maxStackOf) < 1) return 'tasche-voll';
  data.money -= price;
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

/** Der Raum, in dem Lina gerade ist */
export function currentRoom(session: Session): { room: Room; layout: RoomLayout } | null {
  const house = session.data?.house;
  if (!house) return null;
  const room = house.rooms.find((r) => r.id === session.roomId) ?? house.rooms[0];
  return room ? { room, layout: layoutOf(house.stage, room.id) } : null;
}

export function canPlace(session: Session, itemId: string, x: number, y: number, rot: Rotation, moving?: string): boolean {
  const c = currentRoom(session);
  return !!c && checkPlacement(c.room, c.layout, itemId, x, y, rot, furnitureInfo, moving).ok;
}

/** Möbel aus der Tasche in den Raum stellen */
export function placeFromBag(session: Session, itemId: string, x: number, y: number, rot: Rotation): boolean {
  const c = currentRoom(session);
  if (!c || !canPlace(session, itemId, x, y, rot) || !takeItem(session, itemId, 1)) return false;
  placeItem(c.room, c.layout, itemId, x, y, rot, furnitureInfo);
  session.changed();
  session.save();
  return true;
}

export function moveFurniture(session: Session, uid: string, x: number, y: number, rot: Rotation): boolean {
  const c = currentRoom(session);
  if (!c || !moveItem(c.room, c.layout, uid, x, y, rot, furnitureInfo)) return false;
  session.changed();
  session.save();
  return true;
}

/** Möbel zurück in die Tasche (mit allem, was darauf steht). false = Tasche zu voll. */
export function pickUpFurniture(session: Session, uid: string): boolean {
  const c = currentRoom(session);
  const data = session.data;
  if (!c || !data) return false;
  const riders = c.room.items.filter((i) => i.uid === uid || i.on === uid);
  if (riders.length === 0 || freeSlots(data.inventory) < riders.length) return false;
  for (const r of removeItem(c.room, uid)) giveItem(session, r.itemId, 1, false);
  session.changed();
  session.save();
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

export type OrderResult = 'ok' | 'kredit-offen' | 'fertig' | 'laeuft';

/** Ausbau bestellen: wird als zinsloser Kredit verbucht, fertig am nächsten Tag. */
export function orderExpansion(session: Session): OrderResult {
  const data = session.data;
  if (!data) return 'fertig';
  if (data.house.pending) return 'laeuft';
  const next = nextStage(session);
  if (!next) return 'fertig';
  if (!canBorrow(data.bank)) return 'kredit-offen';
  borrow(data.bank, next.price);
  data.house.pending = { stage: next.stage, day: session.today() };
  session.changed();
  session.save();
  return 'ok';
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
  if (!data || !pend || daysBetween(pend.day, session.today()) < 1) return null;
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
  session.changed();
  session.save();
  return house.stage;
}
