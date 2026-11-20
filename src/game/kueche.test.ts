import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { countItem } from '../core/inventory';
import { catalogMeta } from '../data/catalog';
import { CROP_BY_ID } from '../data/crops';
import { FURNITURE_BY_ITEM } from '../data/furniture';
import { itemDef } from '../data/items';
import { RECIPE_BY_FIND, RECIPES } from '../data/recipes';
import { cropsAt } from '../data/seedstand';
import { recipeWhere } from './crafting';
import { DINNER_RIPPCHEN, dinnerTakeaway } from './dinner';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function newTestSession() {
  const m = new Map<string, string>();
  const st: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  const s = new Session(st, () => new Date('2026-11-22T19:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return s;
}

describe('Linas Küche: Kohl, AirFryer, Rippchen', () => {
  it('Kohl wächst im Beet und gibt es im Sommer und Herbst am Samenstand', () => {
    expect(CROP_BY_ID.kohl?.kind).toBe('gemuese');
    expect(itemDef('samen-kohl')?.category).toBe('samen');
    expect(cropsAt('herbst').here.map((c) => c.id)).toContain('kohl');
    expect(RECIPE_BY_FIND['kohl']).toBeTruthy();
  });

  it('der AirFryer ist ein kleines Küchengerät im Katalog und hat eigene Rezepte', () => {
    expect(FURNITURE_BY_ITEM.airfryer?.def.small).toBe(true);
    expect(catalogMeta('airfryer')?.type).toBe('technik');
    const air = RECIPES.filter((r) => r.station === 'airfryer');
    expect(air.map((r) => r.result)).toEqual(expect.arrayContaining(['airfryer-rippchen', 'airfryer-pommes', 'kohlchips']));
    for (const r of air) expect(r.start, r.id).toBe(true);
    expect(recipeWhere(air[0])).toContain('AirFryer');
  });

  it('Rippchen gibt Jens nach dem Sonntagsessen mit', () => {
    const s = newTestSession();
    const lines = dinnerTakeaway(s);
    expect(countItem(s.data!.inventory, 'rippchen')).toBe(DINNER_RIPPCHEN);
    expect(lines.join(' ')).toContain('Rippchen');
  });
});
