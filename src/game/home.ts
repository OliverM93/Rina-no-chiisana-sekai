/**
 * Spielregeln für Linas Zimmer: im Katalog kaufen, Möbel aufstellen,
 * verschieben, wegräumen, Tapete & Boden wechseln.
 */
import { freeSlots, spaceFor } from '../core/inventory';
import { checkPlacement, type Home, moveItem, placeItem, type Rotation, removeItem } from '../core/room';
import { FURNITURE_BY_ITEM, furnitureInfo, SURFACE_BY_ID } from '../data/furniture';
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

export function home(session: Session): Home | null {
  return session.data?.home ?? null;
}

export function canPlace(session: Session, itemId: string, x: number, y: number, rot: Rotation, moving?: string): boolean {
  const h = home(session);
  return !!h && checkPlacement(h, itemId, x, y, rot, furnitureInfo, moving).ok;
}

/** Möbel aus der Tasche ins Zimmer stellen */
export function placeFromBag(session: Session, itemId: string, x: number, y: number, rot: Rotation): boolean {
  const h = home(session);
  if (!h || !canPlace(session, itemId, x, y, rot) || !takeItem(session, itemId, 1)) return false;
  placeItem(h, itemId, x, y, rot, furnitureInfo);
  session.changed();
  session.save();
  return true;
}

export function moveFurniture(session: Session, uid: string, x: number, y: number, rot: Rotation): boolean {
  const h = home(session);
  if (!h || !moveItem(h, uid, x, y, rot, furnitureInfo)) return false;
  session.changed();
  session.save();
  return true;
}

/** Möbel zurück in die Tasche (mit allem, was darauf steht). false = Tasche zu voll. */
export function pickUpFurniture(session: Session, uid: string): boolean {
  const h = home(session);
  const data = session.data;
  if (!h || !data) return false;
  const riders = h.items.filter((i) => i.uid === uid || i.on === uid);
  if (riders.length === 0 || freeSlots(data.inventory) < riders.length) return false;
  for (const r of removeItem(h, uid)) giveItem(session, r.itemId, 1, false);
  session.changed();
  session.save();
  return true;
}

/** Tapete oder Boden anbringen – die alte kommt in die Tasche. */
export function applySurface(session: Session, itemId: string): boolean {
  const h = home(session);
  const s = SURFACE_BY_ID[itemId];
  if (!h || !s || !takeItem(session, itemId, 1)) return false;
  const old = s.kind === 'tapete' ? h.wallpaper : h.floor;
  if (s.kind === 'tapete') h.wallpaper = itemId;
  else h.floor = itemId;
  if (old && old !== itemId) giveItem(session, old, 1, false);
  session.changed();
  session.save();
  return true;
}
