import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { createNpcState } from '../core/friendship';
import { ALL_MOMENTS, albumEntries, syncAlbum } from './album';
import { giftToNpc } from './gameplay';
import { friendPages, noteTaste } from './friends';
import { NPC_BY_ID } from '../data/npcs';
import { itemDef } from '../data/items';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

function fresh(day = '2026-05-12') {
  let now = new Date(`${day}T12:00:00`);
  const s = new Session(memoryStorage(), () => now);
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return { s, setDay: (d: string) => (now = new Date(`${d}T12:00:00`)) };
}

describe('Album der Momente', () => {
  it('alle Einträge haben eindeutige IDs und Text', () => {
    const ids = ALL_MOMENTS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const m of ALL_MOMENTS) expect(m.text.length).toBeGreaterThan(10);
  });

  it('neues Spiel: nur die Ankunft, mit echtem Datum', () => {
    const { s } = fresh();
    syncAlbum(s);
    const e = albumEntries(s);
    expect(e.map((x) => x.id)).toEqual(['ankunft']);
    expect(e[0].when).toBe('12. Mai 2026');
  });

  it('neue Momente bekommen den Tag, an dem sie passieren – und bleiben dabei', () => {
    const { s, setDay } = fresh();
    syncAlbum(s);
    setDay('2026-06-01');
    s.data!.flags.oliEingezogen = true;
    s.changed();
    setDay('2026-07-01');
    s.changed();
    const e = albumEntries(s);
    expect(e.map((x) => x.id)).toEqual(['ankunft', 'einzug-oli']);
    expect(e[1].when).toBe('1. Juni 2026');
  });

  it('Herzen und Hausausbau werden erkannt', () => {
    const { s } = fresh();
    syncAlbum(s);
    s.data!.npcs.lars = { ...createNpcState(), points: 400 };
    s.data!.house.stage = 2;
    s.changed();
    const ids = albumEntries(s).map((x) => x.id);
    expect(ids).toEqual(expect.arrayContaining(['herzen3-lars', 'herzen5-lars', 'haus-1', 'haus-2']));
    expect(ids).not.toContain('haus-3');
  });

  it('ältere Spielstände: Bisheriges steht unter „Früher“ ganz oben, nichts bekommt ein falsches Datum', () => {
    const { s } = fresh();
    // Spielstand ohne Album-Marker, aber mit Geschichte
    delete s.data!.world.dates['moment:_start'];
    delete s.data!.world.dates['moment:ankunft'];
    Object.assign(s.data!.flags, { oliEingezogen: true, winstonGefunden: true });
    s.data!.world.dates['sammlung:fische'] = '2026-03-03';
    s.changed();
    const e = albumEntries(s);
    expect(e.filter((x) => x.when === 'Früher').map((x) => x.id)).toEqual(['winston', 'einzug-oli']);
    expect(e[0].when).toBe('Früher');
    // Urkunden tragen ihr bekanntes Datum
    expect(e.find((x) => x.id === 'sammlung-fische')?.when).toBe('3. März 2026');
    expect(e.find((x) => x.id === 'ankunft')?.when).not.toBe('Früher');
  });

  it('Herzenswunsch erfüllt → Eintrag', () => {
    const { s } = fresh();
    syncAlbum(s);
    const wish = ALL_MOMENTS.find((m) => m.id.startsWith('wunsch-'))!;
    if ('flag' in wish.source) s.data!.flags[wish.source.flag] = true;
    s.changed();
    expect(albumEntries(s).some((x) => x.id === wish.id)).toBe(true);
  });
});

describe('Freundschaften-Seite', () => {
  it('zeigt nur Bewohner, die da sind, und nur Entdecktes', () => {
    const { s } = fresh();
    Object.assign(s.data!.flags, { olafEingezogen: true, olafBegruesst: true });
    s.data!.npcs.olaf = createNpcState();
    let pages = friendPages(s);
    expect(pages.map((p) => p.id)).toContain('gisela');
    expect(pages.map((p) => p.id)).not.toContain('lars');
    const gisela = pages.find((p) => p.id === 'gisela')!;
    expect(gisela.loves).toEqual([]);

    // Schenken verrät den Geschmack
    s.data!.inventory.slots[0] = { itemId: 'keks', count: 1 };
    const out = giftToNpc(s, 'gisela', 'keks');
    expect(out).not.toBeNull();
    pages = friendPages(s);
    const g = pages.find((p) => p.id === 'gisela')!;
    expect([...g.loves, ...g.likes, ...g.dislikes].length).toBe(out!.reaction === 'neutral' ? 0 : 1);
  });

  it('Lieblingsdinge erscheinen mit Namen, Neutrales nicht', () => {
    const { s } = fresh();
    const loved = NPC_BY_ID.gisela.preferences.loves.find((id) => itemDef(id))!;
    noteTaste(s, 'gisela', 'liebt', loved);
    noteTaste(s, 'gisela', 'neutral', 'keks');
    const g = friendPages(s).find((p) => p.id === 'gisela')!;
    expect(g.loves).toEqual([itemDef(loved)!.name]);
    expect(g.likes).toEqual([]);
  });

  it('Füllstand liegt zwischen 0 und 1, volle Freundschaft zeigt keinen Hinweis auf das nächste Herz', () => {
    const { s } = fresh();
    s.data!.npcs.gisela = { ...createNpcState(), points: 400 };
    const g = friendPages(s).find((p) => p.id === 'gisela')!;
    expect(g.hearts).toBe(g.maxHearts);
    expect(g.next).toBe('');
    s.data!.npcs.gisela = { ...createNpcState(), points: 60 };
    const g2 = friendPages(s).find((p) => p.id === 'gisela')!;
    expect(g2.fill).toBeGreaterThan(0);
    expect(g2.fill).toBeLessThan(1);
  });
});
