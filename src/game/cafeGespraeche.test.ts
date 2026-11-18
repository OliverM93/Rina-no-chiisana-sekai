import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { CAFE_GUESTS, CAFE_PAIR_CHATS, JENS_CAFE_CHATS } from '../data/cafeGaeste';
import { NPC_BY_ID } from '../data/npcs';
import { cafeExchange, cafeSeating } from './cafe';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function fresh() {
  const m = new Map<string, string>();
  const storage: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  const s = new Session(storage, () => new Date('2026-06-10T14:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return s;
}

describe('Gespräche im Café', () => {
  it('Jens hat für jeden Café-Gast mindestens zwei Austausche', () => {
    for (const id of Object.keys(CAFE_GUESTS)) expect(JENS_CAFE_CHATS[id]?.length, id).toBeGreaterThanOrEqual(2);
    for (const [id, list] of Object.entries(JENS_CAFE_CHATS)) {
      expect(NPC_BY_ID[id], id).toBeTruthy();
      for (const ex of list) expect(ex.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('Café-Gespräche zwischen Gästen nur zwischen Café-Gästen', () => {
    for (const key of Object.keys(CAFE_PAIR_CHATS)) {
      const [a, b] = key.split('+');
      expect(CAFE_GUESTS[a], key).toBeTruthy();
      expect(CAFE_GUESTS[b], key).toBeTruthy();
    }
  });

  it('jedes Paar von Café-Gästen hat ein Gespräch', () => {
    const s = fresh();
    const ids = Object.keys(CAFE_GUESTS);
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) expect(cafeExchange(s, [ids[i], ids[j]], 0), `${ids[i]}+${ids[j]}`).not.toBeNull();
  });

  it('allein oder ohne passendes Paar: kein Gespräch', () => {
    const s = fresh();
    expect(cafeExchange(s, [], 0)).toBeNull();
    expect(cafeExchange(s, ['jens'], 0)).toBeNull();
    expect(cafeExchange(s, ['gisela'], 0)).toBeNull();
  });

  it('Jens und ein Gast: Jens beginnt, reproduzierbar je Tag und Zähler', () => {
    const s = fresh();
    const ex = cafeExchange(s, ['jens', 'gisela'], 0)!;
    expect(ex.first).toBe('jens');
    expect(ex.second).toBe('gisela');
    expect(ex.lines.length).toBeGreaterThanOrEqual(2);
    expect(cafeExchange(s, ['jens', 'gisela'], 0)).toEqual(ex);
  });

  it('zwei Gäste und Jens: es entstehen verschiedene Gespräche, alle mit Anwesenden', () => {
    const s = fresh();
    const pairs = new Set<string>();
    for (let n = 0; n < 30; n++) {
      const ex = cafeExchange(s, ['jens', 'olaf', 'christin'], n)!;
      expect(['jens', 'olaf', 'christin']).toContain(ex.first);
      expect(['jens', 'olaf', 'christin']).toContain(ex.second);
      expect(ex.first).not.toBe(ex.second);
      pairs.add(`${ex.first}+${ex.second}`);
    }
    expect(pairs.size).toBeGreaterThanOrEqual(2);
  });

  it('Gäste sitzen beisammen: zwei teilen sich einen Tisch, jeder Stuhl nur einmal', () => {
    const s = fresh();
    const zwei = cafeSeating(s, ['thalia', 'lars']);
    const [a, b] = Object.values(zwei);
    expect(a[1]).toBe(1 + (a[1] === 1 ? 0 : 2)); // Mitteltisch: gleiche Reihe
    expect(b[1]).toBe(a[1]);
    expect(Math.abs(a[0] - b[0])).toBe(2);
    const alle = cafeSeating(s, ['gisela', 'olaf', 'christin', 'oli', 'lars', 'thalia']);
    const keys = Object.values(alle).map((v) => v.join(','));
    expect(new Set(keys).size).toBe(6);
  });
});
