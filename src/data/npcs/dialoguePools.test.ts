import { describe, expect, it } from 'vitest';
import { NPCS } from '.';

describe('Dialog-Pools (Game Design F8: Frische bei täglichem Spielen)', () => {
  it('jeder Bewohner hat mindestens 30 Plauderzeilen, die kleinen Pools haben Zeilen für jede Jahreszeit', () => {
    for (const n of NPCS) expect(n.dialogue.chat.length, n.id).toBeGreaterThanOrEqual(30);
    for (const id of ['thalia', 'oli', 'olaf', 'lars', 'christin']) {
      const n = NPCS.find((x) => x.id === id)!;
      for (const season of ['fruehling', 'sommer', 'herbst', 'winter'] as const) {
        expect(n.dialogue.chat.some((l) => l.when?.seasons?.includes(season)), `${id}: ${season}`).toBe(true);
      }
    }
  });
});

describe('Türen bleiben frei', () => {
  it('kein Bewohner steht auf dem Feld, von dem aus Lina eine Tür oder ein Objekt benutzt', async () => {
    const { VILLAGE_OBJECTS } = await import('../maps/village');
    const { OBJECT_KINDS } = await import('../../core/worldmap');
    const taken = new Set<string>();
    for (const o of VILLAGE_OBJECTS) for (const [dx, dy] of OBJECT_KINDS[o.kind].interactFrom ?? []) taken.add(`${o.x + dx},${o.y + dy}`);
    for (const n of NPCS) {
      for (const e of n.schedule) {
        if (e.activity.kind === 'stehen') expect(taken.has(`${e.activity.x},${e.activity.y}`), `${n.id}: ${e.label}`).toBe(false);
      }
    }
  });
});
