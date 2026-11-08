import { describe, expect, it, vi } from 'vitest';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));
import { DEFAULT_LINA } from '../core/appearance';
import { countItem } from '../core/inventory';
import type { StorageLike } from '../core/save';
import { seedPrice, standStock } from '../data/seedstand';
import { buySeeds, seedOffers } from './seedstand';
import { Session } from './session';

function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

function newSession() {
  const s = new Session(memoryStorage(), () => new Date('2026-07-10T12:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return s;
}

describe('Samen kaufen', () => {
  it('zeigt das Tagesangebot mit Preisen', () => {
    const s = newSession();
    const offers = seedOffers(s);
    expect(offers.map((o) => o.itemId)).toEqual(standStock(s.today()));
    for (const o of offers) expect(o.price).toBe(seedPrice(o.itemId));
  });

  it('kaufen bucht Sternchen ab und legt die Samen in die Tasche', () => {
    const s = newSession();
    const d = s.data!;
    d.money = 500;
    const before = countItem(d.inventory, 'samen-rose');
    expect(buySeeds(s, 'samen-rose', 3)).toBe('ok');
    expect(d.money).toBe(500 - seedPrice('samen-rose') * 3);
    expect(countItem(d.inventory, 'samen-rose')).toBe(before + 3);
  });

  it('zu wenig Geld, nicht im Angebot oder Tasche voll: nichts wird abgebucht', () => {
    const s = newSession();
    const d = s.data!;
    d.money = 5;
    expect(buySeeds(s, 'samen-rose')).toBe('teuer');
    expect(d.money).toBe(5);
    d.money = 9999;
    expect(buySeeds(s, 'tulpe')).toBe('nicht-da'); // eine Blume, kein Same
    expect(buySeeds(s, 'samen-tulpe-orange')).toBe('nicht-da'); // Misch-Farben nie
    expect(d.money).toBe(9999);
    // Tasche vollstopfen
    d.inventory.slots = d.inventory.slots.map((_, i) => ({ itemId: i % 2 ? 'stein' : 'ast', count: 99 }));
    expect(buySeeds(s, 'samen-rose')).toBe('voll');
    expect(d.money).toBe(9999);
  });
});
