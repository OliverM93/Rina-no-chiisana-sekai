import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import { createNpcState } from '../core/friendship';
import type { StorageLike } from '../core/save';
import { MOODS, moodFor, THEMES } from '../core/music';
import { INSEL_BELOHNUNG, INSEL_OFFEN_FLAG, FEST_LINES } from '../data/insel';
import { FURNITURE_BY_ITEM } from '../data/furniture';
import { NPCS } from '../data/npcs';
import { alleHerzen, istInsel, syncInsel } from './insel';
import { albumEntries, syncAlbum } from './album';
import { currentWeather } from './nature';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function fresh(time = '2026-12-10T12:00:00') {
  const m = new Map<string, string>();
  const storage: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  const s = new Session(storage, () => new Date(time));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  s.data!.flags.giselaWelcomed = true;
  return s;
}

/** Alle Bewohner da und alle Herzen voll */
function alleVoll(s: Session) {
  for (const n of NPCS) {
    if (n.movesIn) {
      s.data!.flags[n.movesIn] = true;
      s.data!.flags[n.movesIn.replace('Eingezogen', 'Begruesst')] = true;
    }
    s.data!.npcs[n.id] = { ...createNpcState(), points: 400 };
  }
}

describe('Versteckte Insel', () => {
  it('das Boot erscheint erst, wenn bei allen Bewohnern alle Herzen voll sind', () => {
    const s = fresh();
    expect(alleHerzen(s)).toBe(false);
    expect(syncInsel(s)).toBe(false);
    alleVoll(s);
    s.data!.npcs.lars.points = 399; // ein Herz fehlt
    expect(alleHerzen(s)).toBe(false);
    s.data!.npcs.lars.points = 400;
    expect(alleHerzen(s)).toBe(true);
    s.changed();
    expect(s.data!.flags[INSEL_OFFEN_FLAG]).toBe(true);
  });

  it('wer noch nicht eingezogen ist, zählt: ohne alle Bewohner kein Boot', () => {
    const s = fresh();
    alleVoll(s);
    s.data!.flags.thaliaEingezogen = false;
    expect(alleHerzen(s)).toBe(false);
  });

  it('das Boot taucht genau einmal auf (Toast) und bleibt', () => {
    const s = fresh();
    const toasts: string[] = [];
    s.bus.on('toast', (t) => toasts.push(t.text));
    alleVoll(s);
    s.changed();
    s.changed();
    expect(toasts.filter((t) => t.includes('Boot')).length).toBe(1);
    s.data!.npcs.lars.points = 0; // Herzen sinken nie, aber selbst dann bleibt das Boot
    expect(syncInsel(s)).toBe(false);
    expect(s.data!.flags[INSEL_OFFEN_FLAG]).toBe(true);
  });

  it('auf der Insel scheint immer die Sonne – auch bei Schnee im Dorf', () => {
    const s = fresh('2026-12-10T12:00:00');
    s.onIsland = false;
    const dorf = currentWeather(s);
    s.onIsland = true;
    expect(currentWeather(s).kind).toBe('sonnig');
    expect(currentWeather(s).rainedToday).toBe(false);
    void dorf;
  });

  it('Hawaii-Musik läuft auf der Insel zu jeder Tageszeit, nicht im Haus', () => {
    for (const h of [3, 8, 14, 19, 23]) expect(moodFor(h, { raining: false, snowing: false, inside: false, party: false, island: true })).toBe('insel');
    expect(moodFor(14, { raining: true, snowing: false, inside: false, party: false, island: true })).toBe('insel');
    expect(moodFor(14, { raining: false, snowing: false, inside: true, party: false, island: true })).not.toBe('insel');
    expect(THEMES.insel?.length).toBeGreaterThanOrEqual(4);
    for (const m of THEMES.insel ?? []) expect(MOODS[m].name.length).toBeGreaterThan(3);
  });

  it('die Belohnung besteht aus echten Möbeln, jeder Bewohner hat Text bei der Party', () => {
    for (const r of INSEL_BELOHNUNG) expect(FURNITURE_BY_ITEM[r.itemId], r.itemId).toBeDefined();
    expect(FEST_LINES.map((f) => f.npc).sort()).toEqual(NPCS.map((n) => n.id).sort());
    expect(istInsel(39)).toBe(false);
    expect(istInsel(40)).toBe(true);
  });

  it('Boot und Party erscheinen im Album', () => {
    const s = fresh();
    syncAlbum(s);
    alleVoll(s);
    s.changed();
    s.data!.flags.inselFest = true;
    s.data!.world.dates['insel:fest'] = s.today();
    s.changed();
    const ids = albumEntries(s).map((e) => e.id);
    expect(ids).toContain('insel-boot');
    expect(ids).toContain('insel-fest');
  });
});

describe('Inselhütte & Ukulele', () => {
  it('die Hütte erscheint erst nach dem Fest und hat ein Haus mit Bar und Ukulele', async () => {
    const { INSEL_OBJECTS } = await import('../data/maps/insel');
    const { GUEST_HOUSES } = await import('../data/gastHaeuser');
    const hut = INSEL_OBJECTS.find((o) => o.id === 'inselhuette');
    expect(hut?.requires).toBe('inselFest');
    const ids = GUEST_HOUSES['inselhuette'].items.map((i) => i.id);
    expect(ids).toContain('ukulele');
    expect(ids).toContain('zinktheke');
  });
});

describe('Entwicklungs-Abkürzung ?insel=1', () => {
  it('neues Spiel startet mit allen Herzen und offenem Boot', () => {
    const m = new Map<string, string>();
    const storage: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
    const s = new Session(storage, () => new Date('2026-06-10T12:00:00'));
    s.devInsel = true;
    s.startNewGame(DEFAULT_LINA, 'Testdorf');
    expect(alleHerzen(s)).toBe(true);
    expect(s.data!.flags[INSEL_OFFEN_FLAG]).toBe(true);
  });
});
