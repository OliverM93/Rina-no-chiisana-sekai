import { describe, expect, it } from 'vitest';
import { GISELA } from '../data/npcs/gisela';
import { type DialogueContext, matches, pickLine } from './dialogue';

const ctx = (over: Partial<DialogueContext> = {}): DialogueContext => ({
  phase: 'mittag',
  season: 'herbst',
  hearts: 0,
  weekday: 3,
  firstToday: true,
  tags: [],
  day: '2026-11-04',
  turn: 0,
  ...over,
});

describe('Dialogauswahl', () => {
  it('prüft Bedingungen', () => {
    expect(matches({ phases: ['abend'] }, ctx())).toBe(false);
    expect(matches({ seasons: ['herbst'], minHearts: 0 }, ctx())).toBe(true);
    expect(matches({ minHearts: 2 }, ctx({ hearts: 1 }))).toBe(false);
    expect(matches({ tags: ['geburtstag-lina'] }, ctx({ tags: ['geburtstag-lina'] }))).toBe(true);
  });

  it('bevorzugt Zeilen mit höherem Gewicht', () => {
    const pool = [{ text: 'normal' }, { text: 'besonders', weight: 5, when: { tags: ['x'] } }];
    expect(pickLine(pool, ctx({ tags: ['x'] }))).toEqual(['besonders']);
    expect(pickLine(pool, ctx())).toEqual(['normal']);
  });

  it('Plaudern: jedes Mal etwas anderes, auch wenn einzelne Zeilen mehr Gewicht haben', () => {
    const pool = [{ text: 'a' }, { text: 'b', weight: 2 }, { text: 'c' }, { text: 'd' }, { text: 'party', weight: 8, when: { tags: ['party'] } }];
    const seq = [0, 1, 2, 3].map((turn) => pickLine(pool, ctx({ turn }))[0]);
    expect(new Set(seq).size).toBe(4); // keine Wiederholung, bevor alle dran waren
    expect(seq[0]).toBe('b'); // höheres Gewicht zuerst
    const party = [0, 1, 2, 3, 4].map((turn) => pickLine(pool, ctx({ turn, tags: ['party'] }))[0]);
    expect(party[0]).toBe('party');
    expect(new Set(party).size).toBe(5);
  });

  it('wechselt bei weiteren Gesprächen ab', () => {
    const pool = [{ text: 'a' }, { text: 'b' }, { text: 'c' }];
    const seen = new Set([0, 1, 2].map((turn) => pickLine(pool, ctx({ turn }))[0]));
    expect(seen.size).toBe(3);
  });

  it('ist am selben Tag reproduzierbar', () => {
    expect(pickLine(GISELA.dialogue.chat, ctx())).toEqual(pickLine(GISELA.dialogue.chat, ctx()));
  });

  it('Oma Gisela hat zu jeder Tageszeit etwas zu sagen', () => {
    for (const phase of ['morgen', 'mittag', 'nachmittag', 'abend', 'abenddaemmerung'] as const) {
      expect(pickLine(GISELA.dialogue.greetings, ctx({ phase })).length).toBeGreaterThan(0);
      expect(pickLine(GISELA.dialogue.chat, ctx({ phase })).length).toBeGreaterThan(0);
    }
  });

  it('gratuliert an Linas Geburtstag', () => {
    const lines = pickLine(GISELA.dialogue.greetings, ctx({ tags: ['geburtstag-lina'] }));
    expect(lines.join(' ')).toContain('Geburtstag');
  });
});
