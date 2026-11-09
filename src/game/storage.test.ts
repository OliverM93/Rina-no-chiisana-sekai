import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import { addItem, countItem } from '../core/inventory';
import type { StorageLike } from '../core/save';
import { maxStackOf } from '../data/items';
import { FURNITURE_BY_ITEM } from '../data/furniture';
import { sortStorage, storeStack, takeStored } from './storage';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

function fresh() {
  const s = new Session(memoryStorage(), () => new Date('2026-05-12T12:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return s;
}

describe('Vorratstruhe', () => {
  it('gibt es im Katalog und öffnet das Lager', () => {
    const def = FURNITURE_BY_ITEM['vorratstruhe'].def;
    expect(def.storage).toBe(true);
    expect(def.gift).toBeFalsy();
  });

  it('Stapel wandern von der Tasche in die Truhe und zurück', () => {
    const s = fresh();
    const d = s.data!;
    addItem(d.inventory, 'apfel', 8, maxStackOf);
    const i = d.inventory.slots.findIndex((x) => x?.itemId === 'apfel');
    expect(storeStack(s, i)).toBe('ok');
    expect(countItem(d.inventory, 'apfel')).toBe(0);
    expect(countItem(d.storage, 'apfel')).toBe(8);
    const j = d.storage.slots.findIndex((x) => x?.itemId === 'apfel');
    expect(takeStored(s, j)).toBe('ok');
    expect(countItem(d.inventory, 'apfel')).toBe(8);
    expect(countItem(d.storage, 'apfel')).toBe(0);
  });

  it('Werkzeuge bleiben in der Tasche', () => {
    const s = fresh();
    const d = s.data!;
    addItem(d.inventory, 'angel', 1, maxStackOf);
    const i = d.inventory.slots.findIndex((x) => x?.itemId === 'angel');
    expect(storeStack(s, i)).toBe('werkzeug');
    expect(countItem(d.inventory, 'angel')).toBe(1);
  });

  it('nichts geht verloren, wenn eine Seite voll ist', () => {
    const s = fresh();
    const d = s.data!;
    // Tasche voll mit verschiedenen Dingen, in der Truhe liegen 8 Äpfel
    const ids = ['apfel', 'birne', 'pfirsich', 'ast', 'stein', 'herzmuschel', 'jakobsmuschel', 'schneckenhaus', 'seestern', 'wildblumen', 'tulpe', 'rose', 'sonnenblume', 'lavendel', 'vergissmeinnicht', 'kamille', 'pfefferminze', 'ei', 'wachtelei', 'keks'];
    ids.forEach((id, k) => (d.inventory.slots[k] = { itemId: id, count: 1 }));
    d.storage.slots[0] = { itemId: 'zimtsterne', count: 3 };
    expect(takeStored(s, 0)).toBe('voll');
    expect(countItem(d.storage, 'zimtsterne')).toBe(3);
    // Truhe voll
    d.storage.slots.forEach((_, k) => (d.storage.slots[k] = { itemId: `x${k}`, count: 1 }));
    expect(storeStack(s, 0)).toBe('voll');
    expect(d.inventory.slots[0]?.itemId).toBe('apfel');
  });

  it('sortieren ordnet die Truhe, ohne etwas zu verlieren', () => {
    const s = fresh();
    const d = s.data!;
    d.storage.slots[5] = { itemId: 'stein', count: 4 };
    d.storage.slots[40] = { itemId: 'apfel', count: 2 };
    sortStorage(s);
    expect(d.storage.slots.filter(Boolean).length).toBe(2);
    expect(countItem(d.storage, 'stein')).toBe(4);
    expect(d.storage.slots[0]?.itemId).toBe('apfel');
  });
});
