import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import { countItem } from '../core/inventory';
import type { StorageLike } from '../core/save';
import { INSEL_FEST_FLAG } from '../data/insel';
import { isKnownItem } from '../data/items';
import { RECIPE_BY_ID } from '../data/recipes';
import { FISH, VILLAGE_FISH } from '../data/species';
import { todaysBeachFinds } from './gameplay';
import { inselStrandTiles, palmeSchuetteln } from './insel';
import { biteFish } from './nature';
import { sammlungFortschritt } from './sammlungen';
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

describe('Kokosnüsse', () => {
  it('jede Palme gibt einmal am Tag etwas oder nichts – reproduzierbar, nie doppelt', () => {
    const { s, setTime } = fresh();
    let found = 0;
    let empty = 0;
    for (let d = 1; d <= 28; d++) {
      setTime(`2026-06-${String(d).padStart(2, '0')}T12:00:00`);
      const first = palmeSchuetteln(s, 'palme-20-48');
      if (first.itemId === 'kokosnuss') found++;
      else empty++;
      const again = palmeSchuetteln(s, 'palme-20-48');
      expect(again.itemId).toBeUndefined();
      expect(again.text.length).toBeGreaterThan(5);
    }
    expect(found).toBeGreaterThan(5);
    expect(empty).toBeGreaterThan(5);
    expect(countItem(s.data!.inventory, 'kokosnuss')).toBe(found);
  });

  it('Kokosnuss und Kokoskekse sind echte Gegenstände, das Rezept ist erreichbar', () => {
    expect(isKnownItem('kokosnuss')).toBe(true);
    expect(isKnownItem('kokoskekse')).toBe(true);
    expect(RECIPE_BY_ID.kokoskekse.fund).toBe('kokosnuss');
  });
});

describe('Inselfische', () => {
  it('beißen nur vor der Insel, zählen aber nicht für „Alle Fische“', () => {
    const { s } = fresh();
    const insel = FISH.filter((f) => f.insel).map((f) => f.id);
    expect(insel.length).toBeGreaterThanOrEqual(3);
    s.onIsland = false;
    for (let i = 0; i < 400; i++) expect(insel).not.toContain(biteFish(s, 'meer', (i + 0.5) / 400)?.id);
    s.onIsland = true;
    const seen = new Set<string>();
    for (let i = 0; i < 400; i++) {
      const f = biteFish(s, 'meer', (i + 0.5) / 400);
      if (f) seen.add(f.id);
    }
    for (const id of insel) expect(seen.has(id), id).toBe(true);
    expect(sammlungFortschritt(s, 'fische').total).toBe(VILLAGE_FISH.length);
  });
});

describe('Strandfunde auf der Insel', () => {
  it('erst nach der Party; dann liegen täglich Funde auf Inselsand', () => {
    const { s } = fresh();
    const dorf = todaysBeachFinds(s);
    expect(dorf.every((f) => f.y < 40)).toBe(true);
    s.data!.flags[INSEL_FEST_FLAG] = true;
    const mit = todaysBeachFinds(s);
    const insel = mit.filter((f) => f.y >= 40);
    expect(insel.length).toBe(5);
    for (const f of insel) expect(inselStrandTiles(s).some((t) => t.x === f.x && t.y === f.y)).toBe(true);
  });
});
