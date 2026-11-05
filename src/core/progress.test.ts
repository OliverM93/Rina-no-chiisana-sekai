import { describe, expect, it } from 'vitest';
import { createStats, missingNeeds, needMet, normalizeNumberRecord, normalizeStats, type ProgressState, WAIT_SECONDS, waitOver } from './progress';
import { MILESTONES } from '../data/progress';
import { NPC_BY_ID } from '../data/npcs';

const state = (p: Partial<ProgressState> = {}): ProgressState => ({ stats: createStats(), collectionSize: 0, flags: {}, ...p });

describe('Fortschritt statt Kalender', () => {
  it('Bedingungen zählen Dinge, die man im Spiel tut', () => {
    const needs = [{ kind: 'sammelbuch' as const, n: 3 }, { kind: 'verkauft' as const, n: 200 }];
    expect(missingNeeds(needs, state()).map((n) => n.kind)).toEqual(['sammelbuch', 'verkauft']);
    expect(missingNeeds(needs, state({ collectionSize: 3 })).map((n) => n.kind)).toEqual(['verkauft']);
    expect(missingNeeds(needs, state({ collectionSize: 5, stats: { ...createStats(), sold: 250 } }))).toEqual([]);
    expect(needMet({ kind: 'flag', n: 1, flag: 'checkupDone' }, state({ flags: { checkupDone: true } }))).toBe(true);
    expect(needMet({ kind: 'flag', n: 1, flag: 'checkupDone' }, state())).toBe(false);
  });

  it('kurze Wartezeit in Spielzeit, alte Stände ohne Zeitstempel sofort', () => {
    expect(waitOver(100, 100 + WAIT_SECONDS - 1)).toBe(false);
    expect(waitOver(100, 100 + WAIT_SECONDS)).toBe(true);
    expect(waitOver(undefined, 0)).toBe(true);
  });

  it('säubert Zähler & Zeitstempel', () => {
    expect(normalizeStats({ sold: 12.7, bought: -3, crafted: 'x' })).toEqual({ sold: 12, bought: 0, crafted: 0, cooked: 0 });
    expect(normalizeNumberRecord({ a: 5, b: -1, c: 'x', d: Infinity })).toEqual({ a: 5 });
  });

  it('Meilensteine bilden eine Kette, jede Bedingung hat einen Hinweis', () => {
    const order = ['olaf', 'oli', 'jens', 'lars', 'thalia'];
    expect(MILESTONES.map((m) => m.npc)).toEqual(order);
    expect(MILESTONES[0].after).toBe('toolsGiven');
    MILESTONES.slice(1).forEach((m, i) => expect(m.after).toBe(`${order[i]}Begruesst`));
    for (const m of MILESTONES) {
      expect(NPC_BY_ID[m.hintBy], `${m.npc}: Hinweisgeber`).toBeDefined();
      for (const need of m.needs) expect(m.hints[need.kind]?.length, `${m.npc}: Hinweis für ${need.kind}`).toBeGreaterThan(0);
    }
    // Hinweisgeber wohnt schon im Dorf, wenn der Meilenstein zählt
    const movedInBefore = new Set(['gisela']);
    for (const m of MILESTONES) {
      expect(movedInBefore.has(m.hintBy), `${m.hintBy} gibt Hinweise vor dem eigenen Einzug`).toBe(true);
      movedInBefore.add(m.npc);
    }
  });

  it('Sammelbuch-Ziele sind auch im Winter erreichbar (wenige Arten)', () => {
    for (const m of MILESTONES) for (const n of m.needs) if (n.kind === 'sammelbuch') expect(n.n).toBeLessThanOrEqual(9);
  });
});
