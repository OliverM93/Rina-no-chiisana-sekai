import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import { countItem } from '../core/inventory';
import type { StorageLike } from '../core/save';
import { VERSTECKE } from '../data/verstecke';
import { findVersteck, hint, hintedUnfound, isFound, thaliaMapLines, unfound, unhintedNear, versteckAt } from './verstecke';
import { ALL_MOMENTS, albumEntries, syncAlbum } from './album';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function fresh(time = '2026-06-10T12:00:00') {
  const m = new Map<string, string>();
  const storage: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  let now = new Date(time);
  const s = new Session(storage, () => now);
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return { s, setTime: (t: string) => (now = new Date(t)) };
}

describe('Verstecke finden', () => {
  it('ein Fund gibt die Gegenstände, wird gemerkt und ist nur einmal möglich', () => {
    const { s } = fresh();
    const v = VERSTECKE[0];
    expect(versteckAt(s, v.x, v.y)?.id).toBe(v.id);
    const r = findVersteck(s, v.id)!;
    expect(r.lines.length).toBeGreaterThan(0);
    expect(r.leftover).toEqual([]);
    for (const it of v.items) expect(countItem(s.data!.inventory, it.itemId)).toBe(it.count);
    expect(isFound(s, v.id)).toBe(true);
    expect(versteckAt(s, v.x, v.y)).toBeNull();
    expect(findVersteck(s, v.id)).toBeNull();
    expect(unfound(s).map((x) => x.id)).not.toContain(v.id);
  });

  it('volle Tasche: der Rest wird zurückgegeben, nichts geht verloren', () => {
    const { s } = fresh();
    for (let i = 0; i < s.data!.inventory.slots.length; i++) s.data!.inventory.slots[i] = { itemId: 'stein', count: 1 };
    const r = findVersteck(s, 'treibgut')!;
    expect(r.leftover.length).toBeGreaterThan(0);
  });

  it('Winston-Nähe verrät ein Versteck (Funkeln), weit weg nicht', () => {
    const { s } = fresh();
    const v = VERSTECKE[1];
    expect(unhintedNear(s, v.x + 30, v.y, 3.5)).toBeNull();
    expect(unhintedNear(s, v.x + 2, v.y + 1, 3.5)?.id).toBe(v.id);
    hint(s, v.id);
    expect(unhintedNear(s, v.x, v.y, 3.5)).toBeNull();
    expect(hintedUnfound(s).map((x) => x.id)).toEqual([v.id]);
    findVersteck(s, v.id);
    expect(hintedUnfound(s)).toEqual([]);
  });

  it('Thalia erzählt von der Karte: nur wenn sie da ist, nur an manchen Tagen, immer das nächste Versteck', () => {
    const { s, setTime } = fresh();
    expect(thaliaMapLines(s)).toEqual([]); // noch nicht eingezogen
    Object.assign(s.data!.flags, { thaliaEingezogen: true, thaliaBegruesst: true });
    let told = 0;
    const toldIds: string[] = [];
    for (let d = 1; d <= 60 && told < 4; d++) {
      const day = new Date(2026, 5, d, 12);
      setTime(`${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}T12:00:00`);
      const lines = thaliaMapLines(s);
      if (lines.length > 0) {
        told++;
        const id = VERSTECKE.find((v) => lines.join(' ').includes(v.hint))?.id;
        expect(id).toBeDefined();
        toldIds.push(id!);
      }
    }
    expect(told).toBeGreaterThan(0);
    expect(new Set(toldIds).size).toBe(toldIds.length); // nie dasselbe zweimal
    expect(toldIds[0]).toBe(VERSTECKE[0].id);
  });
});

describe('Album', () => {
  it('ein Fund erscheint mit Datum im Album', () => {
    const { s } = fresh();
    syncAlbum(s);
    findVersteck(s, 'felsnische');
    s.changed();
    const e = albumEntries(s).find((x) => x.id === 'versteck-felsnische');
    expect(e?.when).toBe('10. Juni 2026');
    expect(ALL_MOMENTS.some((m) => m.id === 'versteck-felsnische')).toBe(true);
  });
});
