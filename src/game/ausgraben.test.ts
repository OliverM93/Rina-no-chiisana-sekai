import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import { BLOOM } from '../core/garden';
import { countItem } from '../core/inventory';
import type { StorageLike } from '../core/save';
import { giveItem } from './gameplay';
import { digUpPlant, plantAt } from './nature';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function newSession() {
  const m = new Map<string, string>();
  const storage: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  const s = new Session(storage, () => new Date('2026-07-10T12:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return s;
}

describe('Pflanze ausgraben', () => {
  it('Platz wird frei, der Samen kommt zurück – Umpflanzen kostet nichts', () => {
    const s = newSession();
    giveItem(s, 'samen-tulpe-gelb', 1, false);
    expect(plantAt(s, 2, 2, 'samen-tulpe-gelb')).toBe(true);
    expect(countItem(s.data!.inventory, 'samen-tulpe-gelb')).toBe(0);
    const got = digUpPlant(s, 2, 2);
    expect(got).toEqual({ flower: 'tulpe-gelb', seedId: 'samen-tulpe-gelb' });
    expect(s.data!.world.garden['2,2']).toBeUndefined();
    expect(countItem(s.data!.inventory, 'samen-tulpe-gelb')).toBe(1);
    // anderen Samen einsetzen
    giveItem(s, 'samen-rose', 1, false);
    expect(plantAt(s, 2, 2, 'samen-rose')).toBe(true);
  });

  it('auch blühende Pflanzen und Gemüse lassen sich ausgraben; leere Plätze tun nichts', () => {
    const s = newSession();
    giveItem(s, 'samen-tomate', 1, false);
    plantAt(s, 1, 1, 'samen-tomate');
    s.data!.world.garden['1,1'].stage = BLOOM;
    expect(digUpPlant(s, 1, 1)?.seedId).toBe('samen-tomate');
    expect(countItem(s.data!.inventory, 'samen-tomate')).toBe(1);
    expect(digUpPlant(s, 1, 1)).toBeNull();
    expect(digUpPlant(s, 7, 7)).toBeNull();
  });
});
