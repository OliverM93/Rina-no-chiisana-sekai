/**
 * Inventar (Linas Tasche): feste Anzahl Plätze, gleiche Gegenstände stapeln.
 * Reine Funktionen auf einem einfachen Datenobjekt – leicht zu speichern & testen.
 */

export interface Stack {
  itemId: string;
  count: number;
}

export interface Inventory {
  slots: Array<Stack | null>;
}

export const INVENTORY_SIZE = 20;
export const DEFAULT_MAX_STACK = 30;

/** Liefert die maximale Stapelgröße eines Gegenstands. */
export type MaxStackFn = (itemId: string) => number;
const defaultMax: MaxStackFn = () => DEFAULT_MAX_STACK;

export function createInventory(size = INVENTORY_SIZE): Inventory {
  return { slots: Array.from({ length: size }, () => null) };
}

export function countItem(inv: Inventory, itemId: string): number {
  return inv.slots.reduce((sum, s) => sum + (s && s.itemId === itemId ? s.count : 0), 0);
}

export function hasItem(inv: Inventory, itemId: string, count = 1): boolean {
  return countItem(inv, itemId) >= count;
}

export function freeSlots(inv: Inventory): number {
  return inv.slots.filter((s) => s === null).length;
}

/** Wie viele Stück passen noch hinein? */
export function spaceFor(inv: Inventory, itemId: string, maxStack: MaxStackFn = defaultMax): number {
  const max = maxStack(itemId);
  let space = 0;
  for (const s of inv.slots) {
    if (s === null) space += max;
    else if (s.itemId === itemId) space += Math.max(0, max - s.count);
  }
  return space;
}

/**
 * Legt Gegenstände in die Tasche: erst auf passende Stapel, dann in freie
 * Plätze. Gibt die Anzahl zurück, die NICHT mehr hineinpasste.
 */
export function addItem(inv: Inventory, itemId: string, count = 1, maxStack: MaxStackFn = defaultMax): number {
  if (count <= 0) return 0;
  const max = maxStack(itemId);
  let left = count;
  for (const s of inv.slots) {
    if (left === 0) break;
    if (s && s.itemId === itemId && s.count < max) {
      const take = Math.min(left, max - s.count);
      s.count += take;
      left -= take;
    }
  }
  for (let i = 0; i < inv.slots.length && left > 0; i++) {
    if (inv.slots[i] === null) {
      const take = Math.min(left, max);
      inv.slots[i] = { itemId, count: take };
      left -= take;
    }
  }
  return left;
}

/** Entfernt Gegenstände (von hinten). Gibt false zurück, wenn nicht genug da sind – dann ändert sich nichts. */
export function removeItem(inv: Inventory, itemId: string, count = 1): boolean {
  if (count <= 0) return true;
  if (countItem(inv, itemId) < count) return false;
  let left = count;
  for (let i = inv.slots.length - 1; i >= 0 && left > 0; i--) {
    const s = inv.slots[i];
    if (s && s.itemId === itemId) {
      const take = Math.min(left, s.count);
      s.count -= take;
      left -= take;
      if (s.count === 0) inv.slots[i] = null;
    }
  }
  return true;
}

/** Entfernt einen ganzen Platz und gibt den Stapel zurück. */
export function takeSlot(inv: Inventory, index: number): Stack | null {
  const s = inv.slots[index] ?? null;
  if (index >= 0 && index < inv.slots.length) inv.slots[index] = null;
  return s;
}

/** Fasst gleiche Gegenstände zusammen und sortiert nach einer Reihenfolge. */
export function sortInventory(inv: Inventory, order: (itemId: string) => number, maxStack: MaxStackFn = defaultMax) {
  const totals = new Map<string, number>();
  for (const s of inv.slots) if (s) totals.set(s.itemId, (totals.get(s.itemId) ?? 0) + s.count);
  const ids = [...totals.keys()].sort((a, b) => order(a) - order(b) || a.localeCompare(b));
  inv.slots = inv.slots.map(() => null);
  for (const id of ids) addItem(inv, id, totals.get(id) as number, maxStack);
}

/** Macht aus beliebigen (z. B. geladenen) Daten ein gültiges Inventar. */
export function normalizeInventory(raw: unknown, isKnown: (id: string) => boolean, size = INVENTORY_SIZE): Inventory {
  const inv = createInventory(size);
  const slots = raw && typeof raw === 'object' && Array.isArray((raw as Inventory).slots) ? (raw as Inventory).slots : [];
  for (let i = 0; i < size; i++) {
    const s = slots[i] as unknown;
    if (!s || typeof s !== 'object') continue;
    const { itemId, count } = s as Record<string, unknown>;
    if (typeof itemId === 'string' && isKnown(itemId) && typeof count === 'number' && count >= 1) {
      inv.slots[i] = { itemId, count: Math.floor(count) };
    }
  }
  return inv;
}
