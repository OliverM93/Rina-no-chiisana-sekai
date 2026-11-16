import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { INSEL_YARD_AREA } from '../data/yard';
import { canPlace } from './home';
import { Session } from './session';
import { bedTiles } from './home';
import { placeItem } from '../core/room';
import { furnitureInfo } from '../data/furniture';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function fresh(m = new Map<string, string>()) {
  const storage: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  const s = new Session(storage, () => new Date('2026-12-10T12:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return { s, storage };
}
const freshSession = () => fresh().s;

describe('Garten vor der Strandhütte (Insel)', () => {
  it('der Inselgarten liegt auf der Insel und hat freie Zellen', () => {
    const s = freshSession();
    const lay = s.yardLayoutInsel;
    expect(lay.w).toBe(INSEL_YARD_AREA.w);
    expect(lay.h).toBe(INSEL_YARD_AREA.h);
    expect(lay.w * lay.h - (lay.reserved?.length ?? 0)).toBeGreaterThan(20);
  });

  it('auf der Insel wählt Lina den Inselgarten, sonst den Dorfgarten', () => {
    const s = freshSession();
    expect(s.yardId()).toBe('dorf');
    s.onIsland = true;
    expect(s.yardId()).toBe('insel');
    expect(s.yardRoom()).toBe(s.data!.yardInsel);
    expect(s.yardArea()).toBe(INSEL_YARD_AREA);
  });

  it('Wachtelstall und Hochbeet lassen sich im Inselgarten aufstellen und blockieren dort', () => {
    const s = freshSession();
    s.onIsland = true;
    s.data!.player.x = 20 * 64;
    s.data!.player.y = 52 * 64;
    // freie Zelle suchen
    const lay = s.yardLayoutInsel;
    const reserved = new Set((lay.reserved ?? []).map(([x, y]) => `${x},${y}`));
    let spot: [number, number] | null = null;
    for (let y = 0; y < lay.h - 1 && !spot; y++) for (let x = 0; x < lay.w - 2 && !spot; x++) if (canPlace(s, 'wachtelstall', x, y, 0)) spot = [x, y];
    expect(spot).not.toBeNull();
    const yard = s.data!.yardInsel;
    placeItem(yard, lay, 'wachtelstall', spot![0], spot![1], 0, furnitureInfo, 'stall-insel');
    s.syncYardCollision();
    const blockedIdx = (INSEL_YARD_AREA.y + spot![1]) * s.map.width + INSEL_YARD_AREA.x + spot![0];
    expect(s.map.grid.isBlocked(INSEL_YARD_AREA.x + spot![0], INSEL_YARD_AREA.y + spot![1])).toBe(true);
    expect(blockedIdx).toBeGreaterThan(0);
    expect(s.findYardItem('stall-insel')?.id).toBe('insel');
    expect(reserved.has(`${spot![0]},${spot![1]}`)).toBe(false);
    // Hochbeet-Felder werden in Weltkacheln der Insel umgerechnet
    placeItem(yard, lay, 'hochbeet', 0, lay.h - 1, 0, furnitureInfo, 'beet-insel');
    const tiles = bedTiles(s, 'beet-insel');
    if (tiles.length > 0) expect(tiles[0].y).toBeGreaterThanOrEqual(INSEL_YARD_AREA.y);
  });

  it('wird gespeichert und geladen', () => {
    const store = new Map<string, string>();
    const { s, storage } = fresh(store);
    const lay = s.yardLayoutInsel;
    let placed = false;
    s.onIsland = true;
    for (let y = 0; y < lay.h && !placed; y++) for (let x = 0; x < lay.w && !placed; x++) if (canPlace(s, 'wachtelstall', x, y, 0)) placed = !!placeItem(s.data!.yardInsel, lay, 'wachtelstall', x, y, 0, furnitureInfo);
    expect(placed).toBe(true);
    s.save();
    const again = new Session(storage, () => new Date('2026-12-10T12:00:00'));
    expect(again.continueGame()).toBe(true);
    expect(again.data!.yardInsel.items.length).toBe(1);
    expect(again.data!.yardInsel.items[0].itemId).toBe('wachtelstall');
  });

  it('ein alter Spielstand (Version 16) ohne Inselgarten lädt mit leerem Garten', () => {
    const s = freshSession();
    const old = JSON.parse(JSON.stringify(s.data)) as Record<string, unknown>;
    delete old.yardInsel;
    old.version = 16;
    const r = s.checkImport(JSON.stringify(old));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.yardInsel.items).toEqual([]);
  });
});
