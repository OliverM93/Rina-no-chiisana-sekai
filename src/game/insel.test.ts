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

describe('Insel-Nachspiel 2: Flaschenpost, Luau, Album', () => {
  const free = () => {
    const s = fresh('2026-06-10T19:00:00');
    s.data!.flags.inselFest = true;
    return s;
  };

  it('Flaschenbriefe gehören echten Bewohnern, haben Text und eindeutige IDs', async () => {
    const { FLASCHEN_BRIEFE } = await import('../data/insel');
    expect(new Set(FLASCHEN_BRIEFE.map((b) => b.id)).size).toBe(FLASCHEN_BRIEFE.length);
    for (const b of FLASCHEN_BRIEFE) {
      expect(NPCS.some((n) => n.id === b.npc), b.id).toBe(true);
      expect(b.subject.length, b.id).toBeGreaterThan(3);
      expect(b.body.length, b.id).toBeGreaterThan(60);
    }
    expect(FLASCHEN_BRIEFE.length).toBeGreaterThanOrEqual(NPCS.length * 2 - 2);
  });

  it('eine Flaschenpost liefert nacheinander verschiedene Briefe, am Ende nur Sand', async () => {
    const { flaschenpostOeffnen } = await import('./insel');
    const { FLASCHEN_BRIEFE, FLASCHENPOST_GEFUNDEN, FLASCHENPOST_LEER } = await import('../data/insel');
    const s = free();
    alleVoll(s);
    const before = s.data!.mail.letters.length;
    expect(flaschenpostOeffnen(s, 'insel-strand-1')).toBe(FLASCHENPOST_GEFUNDEN);
    expect(s.data!.mail.letters.length).toBe(before + 1);
    expect(s.data!.world.dates['insel:flaschenpost']).toBeTruthy();
    for (let i = 0; i < FLASCHEN_BRIEFE.length - 1; i++) flaschenpostOeffnen(s, `insel-strand-${i + 2}`);
    expect(s.data!.mail.letters.filter((l) => l.id.startsWith('flaschenpost-')).length).toBe(FLASCHEN_BRIEFE.length);
    expect(flaschenpostOeffnen(s, 'insel-strand-99')).toBe(FLASCHENPOST_LEER);
  });

  it('Luau gibt es nur nach der Party, abends und an etwa jedem fünften Tag', async () => {
    const { luauTonight, luauGuests } = await import('./insel');
    const s = free();
    alleVoll(s);
    let n = 0;
    // Zeit durchprobieren: ein Monat Abende
    const days: boolean[] = [];
    for (let d = 1; d <= 30; d++) {
      const t = new Date(`2026-06-${String(d).padStart(2, '0')}T19:30:00`);
      const sess = fresh(t.toISOString().slice(0, 19));
      sess.data!.flags.inselFest = true;
      days.push(luauTonight(sess));
      if (days[days.length - 1]) n += 1;
    }
    expect(n).toBeGreaterThan(2);
    expect(n).toBeLessThan(12);
    expect(luauGuests(s)).toHaveLength(3);
    expect(luauGuests(s)).toEqual(luauGuests(s));
    // vor der Party und tagsüber nie
    const early = fresh('2026-06-10T12:00:00');
    early.data!.flags.inselFest = true;
    expect(luauTonight(early)).toBe(false);
    expect(luauTonight(fresh('2026-06-10T19:00:00'))).toBe(false);
  });

  it('Luau-Zeilen gibt es für alle Bewohner; beim Luau spielt Hula-Musik', async () => {
    const { LUAU_LINES } = await import('../data/insel');
    for (const n of NPCS) expect(LUAU_LINES[n.id]?.length, n.id).toBeGreaterThanOrEqual(1);
    expect(moodFor(19, { raining: false, snowing: false, inside: false, party: false, island: true, luau: true })).toBe('insel-hula');
    expect(moodFor(19, { raining: false, snowing: false, inside: false, party: false, island: true })).toBe('insel');
  });

  it('Insel-Momente (Schildkröte, Delfine, Flaschenpost, Luau) kommen ins Album', async () => {
    const { inselMoment } = await import('./insel');
    const s = free();
    for (const k of ['schildkroete', 'delfine', 'flaschenpost', 'luau'] as const) expect(inselMoment(s, k)).toBe(true);
    expect(inselMoment(s, 'delfine')).toBe(false);
    syncAlbum(s);
    const ids = albumEntries(s).map((e) => e.id);
    expect(ids).toEqual(expect.arrayContaining(['insel-schildkroete', 'insel-delfine', 'insel-flaschenpost', 'insel-luau']));
  });

  it('Flaschenpost liegt unter den Insel-Funden, die Girlande ist am Strand-Rezept', async () => {
    const { INSEL_FINDS } = await import('../data/insel');
    const { RECIPES } = await import('../data/recipes');
    expect(INSEL_FINDS.some((f) => f.itemId === 'flaschenpost')).toBe(true);
    expect(RECIPES.some((r) => r.result === 'muschelgirlande')).toBe(true);
  });
});
