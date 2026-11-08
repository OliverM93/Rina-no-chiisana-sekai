import { describe, expect, it, vi } from 'vitest';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));
import { DEFAULT_LINA } from '../core/appearance';
import { BLOOM } from '../core/garden';
import { countItem } from '../core/inventory';
import type { StorageLike } from '../core/save';
import { CROP_BY_ID } from '../data/crops';
import { craftRecipe } from './crafting';
import { giveItem } from './gameplay';
import { pickGardenFlower, plantAt } from './nature';
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

/** Eine Sorte pflanzen und sofort reif machen */
function ripe(s: Session, crop: string, x = 1, y = 1) {
  giveItem(s, `samen-${crop}`, 1, false);
  expect(plantAt(s, x, y, `samen-${crop}`)).toBe(true);
  s.data!.world.garden[`${x},${y}`].stage = BLOOM;
}

describe('Gemüse ernten', () => {
  it('Tomaten: mehrere Stück, die Pflanze treibt wieder aus', () => {
    const s = newSession();
    ripe(s, 'tomate');
    const got = pickGardenFlower(s, 1, 1)!;
    expect(got.crop).toBe(true);
    expect(got.count).toBeGreaterThanOrEqual(CROP_BY_ID.tomate.yield[0]);
    expect(countItem(s.data!.inventory, 'tomate')).toBe(got.count);
    expect(s.data!.world.garden['1,1']?.stage).toBe(2); // wächst nach
  });

  it('Karotten: nach der Ernte ist der Platz im Beet frei', () => {
    const s = newSession();
    ripe(s, 'karotte');
    const got = pickGardenFlower(s, 1, 1)!;
    expect(got.count).toBeGreaterThanOrEqual(2);
    expect(s.data!.world.garden['1,1']).toBeUndefined();
  });

  it('bei voller Tasche bleibt alles stehen', () => {
    const s = newSession();
    ripe(s, 'kartoffel');
    const d = s.data!;
    d.inventory.slots = d.inventory.slots.map((_, i) => ({ itemId: i % 2 ? 'stein' : 'ast', count: 99 }));
    expect(pickGardenFlower(s, 1, 1)).toBeNull();
    expect(d.world.garden['1,1']?.stage).toBe(BLOOM);
  });

  it('die erste Ernte verrät ein Rezept – und das Gericht lässt sich kochen', () => {
    const s = newSession();
    const d = s.data!;
    expect(d.recipes ?? []).not.toContain('tomatensalat');
    giveItem(s, 'tomate', 2, false);
    giveItem(s, 'basilikum', 1, false);
    expect(craftRecipe(s, 'tomatensalat')).toBe('ok');
    expect(countItem(d.inventory, 'tomatensalat')).toBe(1);
    expect(countItem(d.inventory, 'tomate')).toBe(0);
  });
});
