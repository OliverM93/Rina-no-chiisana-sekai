import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { MOMENTS } from '../data/album';
import { BIRTHDAY_CAKE, CAKE_THANKS, GUEST_LINES, LINA_GUEST_LINES } from '../data/geburtstag';
import { NPCS } from '../data/npcs';
import { RECIPES } from '../data/recipes';
import { giftToNpc, giveItem, talkToNpc } from './gameplay';
import { birthdayEntry, birthdayHost, gatheringArea, gatheringLines, isBirthdayEvening } from './geburtstag';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function sessionAt(iso: string) {
  let now = new Date(iso);
  const m = new Map<string, string>();
  const st: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  const s = new Session(st, () => now);
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  Object.assign(s.data!.flags, { oliEingezogen: true, thaliaEingezogen: true, thaliaBegruesst: true, olafEingezogen: true, jensEingezogen: true, larsEingezogen: true });
  return { s, set: (d: string) => (now = new Date(d)) };
}

describe('Geburtstagsrunde', () => {
  it('Thalia hat am 11.08. Geburtstag – abends feiern alle vor ihrem Haus', () => {
    const { s, set } = sessionAt('2026-08-11T12:00:00'); // Dienstag
    expect(birthdayHost(s)).toMatchObject({ id: 'thalia', home: 'haus-thalia' });
    expect(isBirthdayEvening(s)).toBe(false);
    set('2026-08-11T19:30:00');
    expect(isBirthdayEvening(s)).toBe(true);
    const e = birthdayEntry(s);
    expect(e?.activity).toEqual({ kind: 'spazieren', area: gatheringArea(s, 'haus-thalia') });
    expect(birthdayEntry(s)).toBe(e); // gleiches Objekt → kein Neuplanen
    set('2026-08-11T21:00:00');
    expect(isBirthdayEvening(s)).toBe(false);
  });

  it('wer noch nicht eingezogen ist, hat keine Runde', () => {
    const { s } = sessionAt('2026-08-11T19:00:00');
    s.data!.flags.thaliaEingezogen = false;
    expect(birthdayHost(s)).toBeNull();
    expect(isBirthdayEvening(s)).toBe(false);
  });

  it('die Samstagsparty geht vor', () => {
    const { s } = sessionAt('2029-08-11T19:30:00'); // Samstag
    expect(birthdayHost(s)?.id).toBe('thalia');
    expect(isBirthdayEvening(s)).toBe(false);
  });

  it('an Linas Geburtstag feiern alle vor Linas Haus', () => {
    const { s } = sessionAt('2026-06-16T19:00:00');
    expect(birthdayHost(s)).toMatchObject({ id: 'lina', home: 'haus-lina' });
    expect(gatheringLines(s, 'lars').join(' ')).toContain('Schwesterherz');
  });

  it('Gäste sagen einmal am Abend etwas zur Runde, das Geburtstagskind nicht', () => {
    const { s } = sessionAt('2026-08-11T19:00:00');
    const first = gatheringLines(s, 'oli');
    expect(first.length).toBeGreaterThan(0);
    expect(first.join(' ')).not.toContain('{host}');
    expect(gatheringLines(s, 'oli')).toEqual([]);
    expect(gatheringLines(s, 'thalia')).toEqual([]);
    // im Gespräch: Begrüßung + Runde
    expect(talkToNpc(s, 'lars').lines.join(' ')).toContain('Thalia');
  });

  it('jede Person hat Gast-Zeilen, Zeilen für Linas Geburtstag und einen Kuchen-Dank', () => {
    for (const id of ['gisela', 'olaf', 'christin', 'oli', 'jens', 'lars', 'thalia']) {
      expect(GUEST_LINES[id]?.length, id).toBeGreaterThan(0);
      expect(LINA_GUEST_LINES[id]?.length, id).toBeGreaterThan(0);
      expect(CAKE_THANKS[id]?.length, id).toBeGreaterThan(0);
    }
  });
});

describe('Linas Geburtstagskuchen', () => {
  it('lässt sich in der Küche backen (Eier, Pfirsich, Kekse)', () => {
    const r = RECIPES.find((x) => x.id === BIRTHDAY_CAKE);
    expect(r?.station).toBe('kueche');
    expect(r?.start).toBe(true);
  });

  it('am Geburtstag geliebt, mit eigenem Dank und Album-Moment', () => {
    const { s } = sessionAt('2026-08-11T15:00:00');
    giveItem(s, BIRTHDAY_CAKE, 1, false);
    const out = giftToNpc(s, 'thalia', BIRTHDAY_CAKE)!;
    expect(out.reaction).toBe('liebt');
    expect(out.lines.join(' ')).toContain(CAKE_THANKS.thalia[0]);
    expect(s.data!.world.dates['geburtstag:thalia']).toBe(s.today());
    expect(MOMENTS.some((m) => m.id === 'geburtstag-thalia')).toBe(true);
  });

  it('an anderen Tagen gemocht, ohne Album-Moment', () => {
    const { s } = sessionAt('2026-08-12T15:00:00');
    giveItem(s, BIRTHDAY_CAKE, 1, false);
    expect(giftToNpc(s, 'thalia', BIRTHDAY_CAKE)!.reaction).toBe('mag');
    expect(s.data!.world.dates['geburtstag:thalia']).toBeUndefined();
  });

  it('alle Häuser mit Geburtstagskind haben Platz für die Runde', () => {
    const { s } = sessionAt('2026-08-11T19:00:00');
    for (const n of NPCS.filter((x) => x.birthday)) expect(gatheringArea(s, n.home), n.id).not.toBeNull();
  });
});
