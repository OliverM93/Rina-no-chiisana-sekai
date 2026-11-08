import { describe, expect, it, vi } from 'vitest';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));
import { DEFAULT_LINA } from '../core/appearance';
import { countItem } from '../core/inventory';
import type { StorageLike } from '../core/save';
import { craftRecipe } from './crafting';
import { giftToNpc, giveItem } from './gameplay';
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

describe('Sträuße binden', () => {
  it('Blumen werden zum Strauß, der Strauß mit Glasvase zur Vase fürs Zimmer', () => {
    const s = newSession();
    const inv = s.data!.inventory;
    giveItem(s, 'rose', 3, false);
    expect(craftRecipe(s, 'strauss-rosen')).toBe('ok');
    expect(countItem(inv, 'rose')).toBe(0);
    expect(countItem(inv, 'strauss-rosen')).toBe(1);
    expect(craftRecipe(s, 'vase-strauss-rosen')).toBe('fehlt'); // Glasvase fehlt
    giveItem(s, 'glasvase', 1, false);
    expect(craftRecipe(s, 'vase-strauss-rosen')).toBe('ok');
    expect(countItem(inv, 'vase-strauss-rosen')).toBe(1);
    expect(countItem(inv, 'strauss-rosen')).toBe(0);
  });

  it('der Mischfarben-Strauß wird erst bekannt, wenn die erste Mischfarbe da ist', () => {
    const s = newSession();
    expect(s.data!.recipes).not.toContain('strauss-mischfarben');
    giveItem(s, 'tulpe-orange', 1, false);
    expect(s.data!.recipes).toContain('strauss-mischfarben');
  });

  it('ein Strauß ist ein Geschenk, das ankommt (Oli liebt Rosen)', () => {
    const s = newSession();
    giveItem(s, 'strauss-rosen', 1, false);
    const r = giftToNpc(s, 'oli', 'strauss-rosen');
    expect(r?.reaction).toBe('liebt');
  });
});
