import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { MEMORIES } from '../data/erinnerungen';
import { NPC_BY_ID } from '../data/npcs';
import { FISH, INSECTS } from '../data/species';
import { talkToNpc } from './gameplay';
import { lastTravelCity, memoryLinesFor, memoryTags, takeMemory } from './erinnerungen';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

function fresh(iso = '2026-05-12T12:00:00') {
  let now = new Date(iso);
  const s = new Session(memoryStorage(), () => now);
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return { s, set: (d: string) => (now = new Date(d)) };
}

describe('Erinnerungen – Daten', () => {
  it('jede Zeile gehört zu einem Bewohner, hat eine eindeutige ID und einen bekannten Tag', () => {
    const known = ['haus-anbau', 'haus-dach', 'haus-kueche', 'haus-keller', 'buch-10', 'buch-20', 'buch-30', 'huehner', 'gewaechshaus', 'tassen-viele', 'sparbuch', 'schwarze-blume', 'jens-reise', 'matteo', 'monat-1', 'jahr-1'];
    const ids = new Set<string>();
    for (const m of MEMORIES) {
      expect(NPC_BY_ID[m.npc], m.id).toBeTruthy();
      expect(known, `${m.id}: ${m.tag}`).toContain(m.tag);
      expect(ids.has(m.id), `doppelte ID ${m.id}`).toBe(false);
      ids.add(m.id);
    }
    // jeder Bewohner hat mindestens drei Erinnerungen
    for (const id of ['gisela', 'olaf', 'christin', 'oli', 'jens', 'lars', 'thalia']) expect(MEMORIES.filter((m) => m.npc === id).length, id).toBeGreaterThanOrEqual(3);
  });
});

describe('Erinnerungen – Ablauf', () => {
  it('am Anfang gibt es noch nichts zu erinnern', () => {
    const { s } = fresh();
    expect(memoryTags(s)).toEqual([]);
    expect(takeMemory(s, 'gisela')).toEqual([]);
  });

  it('Hausausbau, Sammelbuch und Zeit werden zu Erinnerungen', () => {
    const { s, set } = fresh();
    s.data!.house.stage = 4;
    for (const sp of [...FISH, ...INSECTS].slice(0, 12)) s.data!.collection[sp.id] = { count: 1, firstDay: '2026-05-12' };
    set('2026-07-01T12:00:00');
    const tags = memoryTags(s);
    expect(tags).toEqual(expect.arrayContaining(['haus-anbau', 'haus-dach', 'haus-kueche', 'monat-1', 'buch-10']));
    expect(tags).not.toContain('haus-keller');
  });

  it('der Bewohner erzählt eine neue Erinnerung genau einmal von sich aus', () => {
    const { s } = fresh();
    s.data!.house.stage = 3;
    const first = takeMemory(s, 'gisela');
    expect(first.join(' ')).toContain('Dachzimmer');
    expect(takeMemory(s, 'gisela')).toEqual([]);
    // andere Bewohner erzählen ihre eigene
    expect(takeMemory(s, 'oli').join(' ')).toContain('Dachzimmer');
  });

  it('beim ersten Gespräch des Tages kommt die Erinnerung nach der Begrüßung', () => {
    const { s } = fresh();
    s.data!.house.stage = 6;
    const out = talkToNpc(s, 'gisela');
    expect(out.lines.join(' ')).toMatch(/Keller|Dachzimmer/);
  });

  it('Jens erwähnt seine letzte Reise mit der echten Stadt', () => {
    const { s } = fresh();
    expect(lastTravelCity(s)).toBeNull();
    s.data!.world.dates['jens-reisen'] = '2';
    const city = lastTravelCity(s)!;
    expect(city.length).toBeGreaterThan(2);
    const out = takeMemory(s, 'jens').join(' ');
    expect(out).toContain(city);
    expect(out).not.toContain('{stadt}');
  });

  it('erzählte Zeilen kommen später beim Plaudern gelegentlich wieder (als Dialogzeilen)', () => {
    const { s } = fresh();
    s.data!.house.stage = 3;
    const lines = memoryLinesFor(s, 'gisela');
    expect(lines.some((l) => l.when?.tags?.includes('haus-dach'))).toBe(true);
  });
});
