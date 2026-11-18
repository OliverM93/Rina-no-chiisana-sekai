import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { placeItem } from '../core/room';
import { spotKey } from '../core/garden';
import { furnitureInfo } from '../data/furniture';
import { YARD_AREA } from '../data/yard';
import { bedTiles, canPlace, moveFurniture, pickUpFurniture } from './home';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function fresh() {
  const m = new Map<string, string>();
  const storage: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  const s = new Session(storage, () => new Date('2026-06-10T14:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return s;
}

describe('Hochbeet verschieben', () => {
  it('die gepflanzten Pflanzen ziehen mit um; Wegräumen bleibt gesperrt', () => {
    const s = fresh();
    const lay = s.yardLayoutOf();
    let from: [number, number] | null = null;
    let to: [number, number] | null = null;
    for (let y = 0; y < lay.h; y++) {
      for (let x = 0; x < lay.w; x++) {
        if (canPlace(s, 'hochbeet', x, y, 0)) {
          if (!from) from = [x, y];
          else if (!to && Math.abs(x - from[0]) + Math.abs(y - from[1]) > 4) to = [x, y];
        }
      }
    }
    expect(from && to).toBeTruthy();
    placeItem(s.yardRoom()!, lay, 'hochbeet', from![0], from![1], 0, furnitureInfo, 'beet-test');
    s.syncYardCollision();
    const tiles = bedTiles(s, 'beet-test');
    expect(tiles.length).toBeGreaterThan(1);
    const garden = s.data!.world.garden;
    garden[spotKey(tiles[0].x, tiles[0].y)] = { flower: 'rose', stage: 1, wateredDay: '', grewDay: '' };
    garden[spotKey(tiles[1].x, tiles[1].y)] = { flower: 'tulpe', stage: 2, wateredDay: '', grewDay: '' };
    expect(pickUpFurniture(s, 'beet-test')).toBe('pflanzen');

    expect(moveFurniture(s, 'beet-test', to![0], to![1], 0)).toBe(true);
    const after = bedTiles(s, 'beet-test');
    expect(after[0]).not.toEqual(tiles[0]);
    expect(garden[spotKey(after[0].x, after[0].y)]?.flower).toBe('rose');
    expect(garden[spotKey(after[1].x, after[1].y)]?.flower).toBe('tulpe');
    // am alten Platz bleibt nichts zurück
    expect(garden[spotKey(tiles[0].x, tiles[0].y)]).toBeUndefined();
    expect(garden[spotKey(tiles[1].x, tiles[1].y)]).toBeUndefined();
    expect(Object.keys(garden).length).toBe(2);
    expect(YARD_AREA.w).toBeGreaterThan(0);
  });
});
