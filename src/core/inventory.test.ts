import { describe, expect, it } from 'vitest';
import { addItem, countItem, createInventory, freeSlots, hasItem, normalizeInventory, removeItem, sortInventory, spaceFor, takeSlot } from './inventory';

const max5 = () => 5;

describe('Inventar', () => {
  it('stapelt gleiche Gegenstände', () => {
    const inv = createInventory(4);
    expect(addItem(inv, 'apfel', 3)).toBe(0);
    expect(addItem(inv, 'apfel', 2)).toBe(0);
    expect(inv.slots[0]).toEqual({ itemId: 'apfel', count: 5 });
    expect(freeSlots(inv)).toBe(3);
  });

  it('verteilt über mehrere Plätze und meldet, was nicht passt', () => {
    const inv = createInventory(2);
    expect(addItem(inv, 'apfel', 12, max5)).toBe(2);
    expect(countItem(inv, 'apfel')).toBe(10);
    expect(spaceFor(inv, 'apfel', max5)).toBe(0);
    expect(addItem(inv, 'birne', 1, max5)).toBe(1);
  });

  it('füllt angebrochene Stapel zuerst auf', () => {
    const inv = createInventory(3);
    addItem(inv, 'birne', 1, max5);
    addItem(inv, 'apfel', 4, max5);
    addItem(inv, 'apfel', 3, max5);
    expect(inv.slots).toEqual([
      { itemId: 'birne', count: 1 },
      { itemId: 'apfel', count: 5 },
      { itemId: 'apfel', count: 2 },
    ]);
  });

  it('entfernt Gegenstände nur, wenn genug da sind', () => {
    const inv = createInventory(3);
    addItem(inv, 'stein', 3);
    expect(removeItem(inv, 'stein', 5)).toBe(false);
    expect(countItem(inv, 'stein')).toBe(3);
    expect(removeItem(inv, 'stein', 3)).toBe(true);
    expect(inv.slots[0]).toBeNull();
    expect(hasItem(inv, 'stein')).toBe(false);
  });

  it('nimmt ganze Plätze heraus', () => {
    const inv = createInventory(2);
    addItem(inv, 'keks', 2);
    expect(takeSlot(inv, 0)).toEqual({ itemId: 'keks', count: 2 });
    expect(inv.slots[0]).toBeNull();
    expect(takeSlot(inv, 1)).toBeNull();
  });

  it('sortiert und fasst zusammen', () => {
    const inv = createInventory(4);
    inv.slots = [{ itemId: 'b', count: 1 }, { itemId: 'a', count: 2 }, null, { itemId: 'b', count: 2 }];
    sortInventory(inv, (id) => (id === 'a' ? 0 : 1));
    expect(inv.slots).toEqual([{ itemId: 'a', count: 2 }, { itemId: 'b', count: 3 }, null, null]);
  });

  it('säubert geladene Daten', () => {
    const inv = normalizeInventory({ slots: [{ itemId: 'apfel', count: 2 }, { itemId: 'gibtsnicht', count: 1 }, { itemId: 'apfel', count: -1 }, 'quatsch'] }, (id) => id === 'apfel', 4);
    expect(inv.slots).toEqual([{ itemId: 'apfel', count: 2 }, null, null, null]);
    expect(normalizeInventory(null, () => true, 2).slots).toEqual([null, null]);
  });
});
