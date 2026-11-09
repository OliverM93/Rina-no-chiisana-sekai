/**
 * Vorratstruhe: Lagerplätze außerhalb der Tasche (60 Plätze). Alle Truhen im Haus öffnen denselben Vorrat –
 * so geht nichts verloren, wenn Lina eine Truhe verschiebt oder wegräumt.
 * Ganze Stapel wandern per Klick zwischen Tasche und Truhe. Werkzeuge bleiben in der Tasche.
 */
import { addItem, sortInventory, takeSlot } from '../core/inventory';
import { ITEM_ORDER, itemDef, maxStackOf, TOOLS } from '../data/items';
import type { Session } from './session';

export type StorageResult = 'ok' | 'voll' | 'werkzeug' | 'leer';

/** Darf dieser Gegenstand in die Truhe? (Werkzeuge braucht Lina immer griffbereit) */
export function canStore(itemId: string): boolean {
  return !(TOOLS as readonly string[]).includes(itemId);
}

function move(session: Session, from: 'inventory' | 'storage', index: number): StorageResult {
  const data = session.data;
  if (!data) return 'leer';
  const source = data[from];
  const target = data[from === 'inventory' ? 'storage' : 'inventory'];
  const stack = source.slots[index];
  if (!stack) return 'leer';
  if (from === 'inventory' && !canStore(stack.itemId)) return 'werkzeug';
  const taken = takeSlot(source, index);
  if (!taken) return 'leer';
  const left = addItem(target, taken.itemId, taken.count, maxStackOf);
  if (left > 0) {
    // Was nicht mehr passt, bleibt, wo es war
    addItem(source, taken.itemId, left, maxStackOf);
    session.changed();
    return left === taken.count ? 'voll' : 'ok';
  }
  session.changed();
  return 'ok';
}

/** Tasche → Truhe */
export function storeStack(session: Session, bagIndex: number): StorageResult {
  return move(session, 'inventory', bagIndex);
}

/** Truhe → Tasche */
export function takeStored(session: Session, storageIndex: number): StorageResult {
  return move(session, 'storage', storageIndex);
}

/** Truhe ordnen (nach Gegenstandsart) */
export function sortStorage(session: Session) {
  const data = session.data;
  if (!data) return;
  sortInventory(data.storage, (id) => ITEM_ORDER[id] ?? 999, maxStackOf);
  session.changed();
}

/** Wie viele Plätze sind belegt? */
export function storageUsed(session: Session): number {
  return session.data?.storage.slots.filter(Boolean).length ?? 0;
}

export function storageName(itemId: string): string {
  return itemDef(itemId)?.name ?? itemId;
}
