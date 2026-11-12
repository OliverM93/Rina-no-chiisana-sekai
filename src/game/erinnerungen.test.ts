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
    const known = ['haus-anbau', 'haus-dach', 'haus-kueche', 'haus-keller', 'buch-10', 'buch-20', 'buch-30', 'huehner', 'gewaechshaus', 'tassen-viele', 'sparbuch', 'schwarze-blume', 'jens-reise', 'matteo', 'kino', 'tourshirt', 'pflanzen-viele', 'bett', 'waermflasche', 'monat-1', 'jahr-1', 'stil-japanisch', 'stil-cottage', 'stil-retro', 'stil-modern', 'stil-midcentury', 'stil-bistro', 'stil-japandi', 'stil-minimalismus', 'stil-skandinavisch', 'stil-industrial', 'stil-darkacademia', 'stil-artdeco', 'stil-spaceage', 'stil-cyberpunk', 'stil-brutalismus', 'stil-memphis', 'parkett-edel', 'tapete-uni', 'garten-deko'];
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

describe('Erinnerungen – Einrichtung', () => {
  it('Boden, Wandfarbe und Stile werden bemerkt – aber erst ab ein paar Stücken', () => {
    const { s } = fresh();
    const room = s.data!.house.rooms[0];
    room.items = [];
    expect(memoryTags(s)).not.toContain('parkett-edel');
    room.floor = 'boden-fischgraet-nuss';
    room.wallpaper = 'tapete-uni-salbei';
    for (let i = 0; i < 3; i++) room.items.push({ uid: `j${i}`, itemId: 'zabuton-rosa', x: i, y: 0, rot: 0 });
    expect(memoryTags(s)).toEqual(expect.arrayContaining(['parkett-edel', 'tapete-uni']));
    expect(memoryTags(s)).not.toContain('stil-japanisch');
    room.items.push({ uid: 'j9', itemId: 'bonsai', x: 5, y: 0, rot: 0 });
    expect(memoryTags(s)).toContain('stil-japanisch');
  });

  it('die neuen Stile werden ab vier Stücken bemerkt – auch über Nachbarstile (Eichenstuhl zählt für Japandi)', () => {
    const { s } = fresh();
    const room = s.data!.house.rooms[0];
    room.items = [];
    for (const [i, id] of ['gamingstuhl', 'gamingstuhl-cyan', 'rgbleuchte'].entries()) room.items.push({ uid: `c${i}`, itemId: id, x: i, y: 0, rot: 0 });
    expect(memoryTags(s)).not.toContain('stil-cyberpunk');
    room.items.push({ uid: 'c9', itemId: 'serverregal', x: 5, y: 0, rot: 0 });
    expect(memoryTags(s)).toContain('stil-cyberpunk');
    room.items = ['skandi-stuhl', 'skandi-stuhl-weiss', 'futon-rosa', 'andon'].map((id, i) => ({ uid: `j${i}`, itemId: id, x: i, y: 2, rot: 0 }));
    expect(memoryTags(s)).toContain('stil-japandi');
  });

  it('Oli erwähnt die Zockerecke einmal von selbst', () => {
    const { s } = fresh();
    s.data!.house.rooms[0].items = ['gamingstuhl', 'zockertisch', 'serverregal', 'rgbleuchte'].map((id, i) => ({ uid: `z${i}`, itemId: id, x: i * 2, y: 3, rot: 0 }));
    expect(takeMemory(s, 'oli').join(' ')).toContain('Zockerecke');
    expect(takeMemory(s, 'oli')).toEqual([]);
  });

  it('jeder neue Stil hat mindestens zwei Reaktionen von verschiedenen Bewohnern', () => {
    for (const st of ['japandi', 'minimalismus', 'skandinavisch', 'industrial', 'darkacademia', 'artdeco', 'spaceage', 'cyberpunk', 'brutalismus', 'memphis']) {
      const npcs = new Set(MEMORIES.filter((m) => m.tag === `stil-${st}`).map((m) => m.npc));
      expect(npcs.size, st).toBeGreaterThanOrEqual(2);
    }
  });

  it('der Bewohner kommentiert die neue Einrichtung genau einmal', () => {
    const { s } = fresh();
    s.data!.house.rooms[0].floor = 'boden-chevron-eiche';
    expect(takeMemory(s, 'jens').join(' ')).toContain('Chevron');
    expect(takeMemory(s, 'jens')).toEqual([]);
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
