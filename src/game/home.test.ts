import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import { addItem } from '../core/inventory';
import type { StorageLike } from '../core/save';
import { INVENTORY_SIZE } from '../core/inventory';
import { buyFromCatalog, decorStock, moveFurniture, pickUpFurniture, placeFromBag, restoreFurniture, stockCount, variantsOf } from './home';
import { giveItem } from './gameplay';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function newSession() {
  const m = new Map<string, string>();
  const storage: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  const s = new Session(storage, () => new Date('2026-11-10T12:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  s.inside = true;
  s.roomId = 'haupt';
  s.data!.money = 100000;
  return s;
}

describe('Einrichten: Vorrat (Tasche + Truhe)', () => {
  it('stellt aus der Truhe auf, wenn die Tasche keins hat', () => {
    const s = newSession();
    addItem(s.data!.storage, 'zabuton-rosa', 1);
    expect(stockCount(s, 'zabuton-rosa')).toBe(1);
    expect(decorStock(s).find((x) => x.itemId === 'zabuton-rosa')?.inStorage).toBe(true);
    expect(placeFromBag(s, 'zabuton-rosa', 3, 3, 0)).toBeTruthy();
    expect(stockCount(s, 'zabuton-rosa')).toBe(0);
  });

  it('Wegräumen mit voller Tasche landet in der Truhe – nichts geht verloren', () => {
    const s = newSession();
    giveItem(s, 'zabuton-rosa', 1, false);
    const placed = placeFromBag(s, 'zabuton-rosa', 3, 3, 0)!;
    // Tasche komplett füllen
    for (let i = 0; i < INVENTORY_SIZE; i++) addItem(s.data!.inventory, `fuell-${i}`, 1, () => 1);
    expect(pickUpFurniture(s, placed.uid)).toBe('ok');
    expect(s.data!.storage.slots.some((x) => x?.itemId === 'zabuton-rosa')).toBe(true);
  });

  it('Kaufen mit voller Tasche geht in die Truhe', () => {
    const s = newSession();
    for (let i = 0; i < INVENTORY_SIZE; i++) addItem(s.data!.inventory, `fuell-${i}`, 1, () => 1);
    expect(buyFromCatalog(s, 'zabuton-rosa')).toBe('ok');
    expect(stockCount(s, 'zabuton-rosa')).toBe(1);
  });
});

describe('Einrichten: Farbe wechseln & Rückgängig', () => {
  it('andere Farbe beim Aufstellen kostet nichts und verbraucht genau ein Stück', () => {
    const s = newSession();
    giveItem(s, 'zabuton-rosa', 1, false);
    const placed = placeFromBag(s, 'zabuton-indigo', 3, 3, 0, 'zabuton-rosa');
    expect(placed?.itemId).toBe('zabuton-indigo');
    expect(stockCount(s, 'zabuton-rosa')).toBe(0);
    // fremdes Möbel als „Farbe“ geht nicht
    giveItem(s, 'zabuton-rosa', 1, false);
    expect(placeFromBag(s, 'sofa-rosa', 5, 3, 0, 'zabuton-rosa')).toBeNull();
  });

  it('Umfärben beim Verschieben', () => {
    const s = newSession();
    giveItem(s, 'zabuton-rosa', 1, false);
    const placed = placeFromBag(s, 'zabuton-rosa', 3, 3, 0)!;
    expect(moveFurniture(s, placed.uid, 4, 3, 0, 'zabuton-senf')).toBe(true);
    expect(s.data!.house.rooms[0].items.find((i) => i.uid === placed.uid)?.itemId).toBe('zabuton-senf');
    expect(moveFurniture(s, placed.uid, 5, 3, 0, 'sofa-rosa')).toBe(true); // Verschieben ok, Farbe ignoriert
    expect(s.data!.house.rooms[0].items.find((i) => i.uid === placed.uid)?.itemId).toBe('zabuton-senf');
  });

  it('Wegräumen lässt sich rückgängig machen – samt allem, was darauf stand', () => {
    const s = newSession();
    giveItem(s, 'kotatsu-rot', 1, false);
    giveItem(s, 'blumenvase', 1, false);
    const room = s.data!.house.rooms[0];
    const table = placeFromBag(s, 'kotatsu-rot', 3, 3, 0)!;
    expect(table).toBeTruthy();
    expect(placeFromBag(s, 'blumenvase', 3, 3, 0)?.on).toBe(table.uid);
    const mine = room.items.filter((i) => i.uid === table.uid || i.on === table.uid).map((i) => ({ ...i }));
    expect(mine).toHaveLength(2);
    const total = room.items.length;
    expect(pickUpFurniture(s, table.uid)).toBe('ok');
    expect(room.items).toHaveLength(total - 2);
    expect(restoreFurniture(s, mine)).toBe(true);
    expect(room.items).toHaveLength(total);
    expect(room.items.filter((i) => i.uid === table.uid || i.on === table.uid)).toHaveLength(2);
    expect(stockCount(s, 'kotatsu-rot') + stockCount(s, 'blumenvase')).toBe(0);
  });

  it('Farbvarianten', () => {
    expect(variantsOf('zabuton-rosa').map((v) => v.itemId)).toEqual(['zabuton-rosa', 'zabuton-indigo', 'zabuton-senf']);
    expect(variantsOf('herd')).toEqual([]);
  });
});
