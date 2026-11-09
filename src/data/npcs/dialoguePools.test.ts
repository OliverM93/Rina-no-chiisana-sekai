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
