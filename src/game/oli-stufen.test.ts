import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { BENCH_LINES, OLI_ANNIVERSARIES, STAGE_SCENES } from '../data/oliStufen';
import { isKnownItem } from '../data/items';
import { wishFlag } from '../data/wishes';
import { canDate, checkOliAnniversaries, daysWithOli, haveDate, nextStageScene, playStageScene } from './romance';
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
  (s as { weatherOverride: string | null }).weatherOverride = 'sonnig';
  s.data!.flags.oliEingezogen = true;
  s.data!.flags.oliBegruesst = true;
  return { s, set: (d: string) => (now = new Date(d)) };
}

const withPoints = (s: Session, points: number) => (s.data!.npcs.oli = { ...s.data!.npcs.oli, points });

describe('Daten', () => {
  it('eine Szene je Herz (1–5), Herzbank für alle vier Jahreszeiten & Tageszeiten, Jubiläumsgeschenke gibt es', () => {
    expect(STAGE_SCENES.map((x) => x.hearts)).toEqual([1, 2, 3, 4, 5]);
    for (const season of ['fruehling', 'sommer', 'herbst', 'winter']) {
      expect(BENCH_LINES[season].tag.length).toBeGreaterThan(2);
      expect(BENCH_LINES[season].abend.length).toBeGreaterThan(2);
    }
    for (const a of OLI_ANNIVERSARIES) expect(isKnownItem(a.gift.itemId), a.id).toBe(true);
  });
});

describe('Zeit zu zweit – die Beziehung in Stufen', () => {
  it('ohne Herzen gibt es noch keine Szene, dann eine je Herz – jede nur einmal, der Reihe nach', () => {
    const { s } = fresh();
    expect(nextStageScene(s)).toBeNull();
    withPoints(s, 40); // 1 Herz
    expect(nextStageScene(s)?.id).toBe('ankommen');
    expect(playStageScene(s)?.lines.join(' ')).toContain('Testdorf');
    expect(nextStageScene(s)).toBeNull(); // Herz 2 fehlt noch
    withPoints(s, 400); // 5 Herzen: alle übrigen der Reihe nach
    const ids: string[] = [];
    while (nextStageScene(s)) ids.push(nextStageScene(s)!.id), playStageScene(s);
    expect(ids).toEqual(['plaene', 'kochen', 'fenster', 'danke']);
    expect(playStageScene(s)).toBeNull();
  });

  it('die Szenen bringen keine Punkte (Inhalt statt Zahlen)', () => {
    const { s } = fresh();
    withPoints(s, 100);
    const before = s.data!.npcs.oli.points;
    playStageScene(s);
    expect(s.data!.npcs.oli.points).toBe(before);
  });

  it('erst wenn Oli eingezogen ist', () => {
    const { s } = fresh();
    withPoints(s, 400);
    delete s.data!.flags.oliEingezogen;
    expect(nextStageScene(s)).toBeNull();
  });
});

describe('Herzbank', () => {
  it('gibt es erst, wenn Olis Wunsch erfüllt ist – dann einmal am Tag, mit Zeilen zur Jahreszeit', () => {
    const { s } = fresh();
    expect(canDate(s, 'herzbank')).toBe(false);
    s.data!.flags[wishFlag('oli-bank')] = true;
    expect(canDate(s, 'herzbank')).toBe(true);
    const before = s.data!.npcs.oli.points;
    const lines = haveDate(s, 'herzbank');
    expect(lines.join(' ')).toMatch(/Bank|Sonne|Meer|Frühling/);
    expect(s.data!.npcs.oli.points).toBeGreaterThan(before);
    expect(canDate(s, 'herzbank')).toBe(false); // heute schon
  });

  it('nachts schläft das Dorf', () => {
    const { s, set } = fresh();
    s.data!.flags[wishFlag('oli-bank')] = true;
    set('2026-05-12T03:00:00');
    expect(canDate(s, 'herzbank')).toBe(false);
  });
});

describe('Jubiläen', () => {
  it('Brief nach 100 Tagen und nach einem Jahr – jeder nur einmal', () => {
    const { s, set } = fresh('2026-01-01T12:00:00');
    expect(daysWithOli(s)).toBe(0);
    expect(checkOliAnniversaries(s)).toBe(0);
    set('2026-04-11T12:00:00'); // Tag 100
    expect(daysWithOli(s)).toBe(100);
    expect(checkOliAnniversaries(s)).toBe(1);
    expect(checkOliAnniversaries(s)).toBe(0);
    expect(JSON.stringify(s.data!.mail)).toContain('oli-100-tage');
    set('2027-01-01T12:00:00');
    expect(checkOliAnniversaries(s)).toBe(1);
    expect(JSON.stringify(s.data!.mail)).toContain('oli-1-jahr');
    expect(checkOliAnniversaries(s)).toBe(0);
  });

  it('ohne Einzug kein Brief', () => {
    const { s, set } = fresh('2026-01-01T12:00:00');
    delete s.data!.flags.oliBegruesst;
    set('2028-01-01T12:00:00');
    expect(checkOliAnniversaries(s)).toBe(0);
  });
});
