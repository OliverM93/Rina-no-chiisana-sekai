import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { UNTERNEHMUNGEN, zusammenErstKey } from '../data/unternehmungen';
import { NPCS, NPC_BY_ID } from '../data/npcs';
import { albumEntries, syncAlbum } from './album';
import { npcState } from './gameplay';
import { activitiesFor, bestOf, finishActivity, unlockedLevels } from './unternehmungen';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function fresh(date = '2026-06-10T14:00:00') {
  const m = new Map<string, string>();
  const storage: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  let now = new Date(date);
  const s = new Session(storage, () => now);
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  for (const n of NPCS) if (n.movesIn) {
    s.data!.flags[n.movesIn] = true;
    s.data!.flags[n.movesIn.replace('Eingezogen', 'Begruesst')] = true;
  }
  return { s, setDate: (d: string) => (now = new Date(d)) };
}

describe('Gemeinsame Unternehmungen', () => {
  it('jeder Bewohner hat eine Unternehmung mit Texten für jedes Ergebnis', () => {
    for (const id of ['gisela', 'olaf', 'christin', 'oli', 'jens', 'lars', 'thalia']) {
      const list = UNTERNEHMUNGEN.filter((u) => u.npc === id);
      expect(list.length, id).toBeGreaterThan(0);
      for (const u of list) {
        expect(NPC_BY_ID[u.npc]).toBeTruthy();
        expect(u.intro.length).toBeGreaterThan(0);
        for (const r of ['super', 'gut', 'gemuetlich'] as const) expect(u.done[r].length, `${u.id}:${r}`).toBeGreaterThan(0);
        expect(u.album.length).toBeGreaterThan(10);
        if (u.game === 'quiz') expect(u.quiz!.questions.length).toBeGreaterThanOrEqual(u.quiz!.count * 2);
        if (u.game === 'memory') expect(u.memory!.symbols.length).toBeGreaterThanOrEqual(4);
        if (u.game === 'puzzle') expect(u.puzzle!.picture.length).toBe(8);
      }
    }
  });

  it('erst nach dem Einzug verfügbar', () => {
    const m = new Map<string, string>();
    const s = new Session({ getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) }, () => new Date('2026-06-10T14:00:00'));
    s.startNewGame(DEFAULT_LINA, 'Testdorf');
    expect(activitiesFor(s, 'gisela').length).toBe(1);
    expect(activitiesFor(s, 'thalia').length).toBe(0);
  });

  it('Herzen nur einmal am Tag je Person; danach weiter spielbar', () => {
    const { s, setDate } = fresh();
    const before = npcState(s, 'gisela').points;
    const lines = finishActivity(s, 'memory-oma', { rank: 'gut', score: 10 });
    expect(lines.length).toBeGreaterThan(0);
    const after1 = npcState(s, 'gisela').points;
    expect(after1).toBeGreaterThan(before);
    finishActivity(s, 'memory-oma', { rank: 'super', score: 7 });
    expect(npcState(s, 'gisela').points).toBe(after1);
    setDate('2026-06-11T14:00:00');
    finishActivity(s, 'memory-oma', { rank: 'gemuetlich', score: 20 });
    expect(npcState(s, 'gisela').points).toBeGreaterThan(after1);
  });

  it('Bestwert: weniger Züge sind besser bei Memory, mehr Treffer beim Duell; Rekord-Satz ab der zweiten Runde', () => {
    const { s } = fresh();
    finishActivity(s, 'memory-oma', { rank: 'gut', score: 12 });
    expect(bestOf(s, 'memory-oma')).toBe(12);
    const rec = finishActivity(s, 'memory-oma', { rank: 'super', score: 8 });
    expect(bestOf(s, 'memory-oma')).toBe(8);
    expect(rec.some((l) => UNTERNEHMUNGEN[0].record.includes(l))).toBe(true);
    finishActivity(s, 'memory-oma', { rank: 'gut', score: 15 });
    expect(bestOf(s, 'memory-oma')).toBe(8);
    finishActivity(s, 'sumo-lars', { rank: 'gut', score: 1 });
    finishActivity(s, 'sumo-lars', { rank: 'super', score: 2 });
    expect(bestOf(s, 'sumo-lars')).toBe(2);
  });

  it('Malen: Jens kommentiert Motiv und Farben', () => {
    const { s } = fresh();
    const lines = finishActivity(s, 'malen-jens', { rank: 'super', motif: 'winston', palette: 'schwarz' });
    expect(lines[0]).toContain('Winston');
    expect(lines[1]).toContain('Schwarz');
  });

  it('das erste Mal kommt ins Album', () => {
    const { s } = fresh();
    syncAlbum(s);
    finishActivity(s, 'gym-thalia', { rank: 'super', score: 18 });
    expect(s.data!.world.dates[zusammenErstKey('gym-thalia')]).toBe('2026-06-10');
    syncAlbum(s);
    expect(albumEntries(s).some((e) => e.id === 'zusammen-gym-thalia')).toBe(true);
  });

  it('Zocken mit Oli: Level werden nacheinander freigeschaltet, Bestwert je Level', () => {
    const { s } = fresh();
    expect(unlockedLevels(s, 'zocken-oli')).toBe(1);
    // zu wenig Treffer: bleibt bei Level 1
    finishActivity(s, 'zocken-oli', { rank: 'gemuetlich', score: 3, level: 0 });
    expect(unlockedLevels(s, 'zocken-oli')).toBe(1);
    const lines = finishActivity(s, 'zocken-oli', { rank: 'gut', score: 8, level: 0 });
    expect(unlockedLevels(s, 'zocken-oli')).toBe(2);
    expect(lines.some((l) => l.includes('Level 2'))).toBe(true);
    expect(bestOf(s, 'zocken-oli', 0)).toBe(8);
    // ein altes Level nochmal spielen schaltet nichts weiter frei
    finishActivity(s, 'zocken-oli', { rank: 'super', score: 10, level: 0 });
    expect(unlockedLevels(s, 'zocken-oli')).toBe(2);
    // bis zum letzten Level, nie darüber hinaus
    const levels = UNTERNEHMUNGEN.find((u) => u.id === 'zocken-oli')!.duell!.levels;
    for (let l = 1; l < levels.length + 1; l++) finishActivity(s, 'zocken-oli', { rank: 'super', score: 99, level: Math.min(l, levels.length - 1) });
    expect(unlockedLevels(s, 'zocken-oli')).toBe(levels.length);
  });

  it('Lars spielt Kissen-Sumo statt dasselbe Spiel wie Oli', () => {
    const { s } = fresh();
    const lars = activitiesFor(s, 'lars');
    const oli = activitiesFor(s, 'oli');
    expect(lars[0].game).toBe('sumo');
    expect(lars[0].game).not.toBe(oli[0].game);
  });
});
