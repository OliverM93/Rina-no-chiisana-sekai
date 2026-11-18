import { describe, expect, it } from 'vitest';
import {
  arrowSequence,
  duelRank,
  flipMemory,
  memoryDone,
  memoryRank,
  newMemory,
  newPuzzle,
  puzzleDone,
  quizRank,
  rhythmHit,
  rhythmPos,
  rhythmRank,
  slidePuzzle,
  slidePuzzleDir,
} from './unternehmungen';

describe('Memory', () => {
  it('jedes Symbol liegt genau zweimal, reproduzierbar gemischt', () => {
    const a = newMemory(['a', 'b', 'c'], 7);
    expect(a.cards.length).toBe(6);
    for (const s of ['a', 'b', 'c']) expect(a.cards.filter((c) => c === s).length).toBe(2);
    expect(newMemory(['a', 'b', 'c'], 7).cards).toEqual(a.cards);
  });

  it('Paare finden bis zum Ende; perfektes Spiel ist „super“', () => {
    const m = newMemory(['a', 'b', 'c', 'd'], 3);
    for (const sym of ['a', 'b', 'c', 'd']) {
      const [i, j] = m.cards.flatMap((c, k) => (c === sym ? [k] : []));
      flipMemory(m, i);
      expect(flipMemory(m, j).pair).toBe(true);
    }
    expect(memoryDone(m)).toBe(true);
    expect(m.moves).toBe(4);
    expect(memoryRank(m)).toBe('super');
  });

  it('ein Fehlversuch wird beim nächsten Aufdecken wieder umgedreht', () => {
    const m = newMemory(['a', 'b'], 1);
    const a = m.cards.indexOf('a');
    const b = m.cards.indexOf('b');
    flipMemory(m, a);
    expect(flipMemory(m, b).pair).toBe(false);
    expect(m.open.length).toBe(2);
    flipMemory(m, a);
    expect(m.open).toEqual([a]);
  });
});

describe('Schiebepuzzle', () => {
  it('startet gemischt, aber immer lösbar (aus dem gelösten Zustand gemischt)', () => {
    for (let seed = 1; seed < 30; seed++) {
      const p = newPuzzle(seed);
      expect(puzzleDone(p)).toBe(false);
      expect([...p.tiles].sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      // Lösbarkeit (3×3): Anzahl der Fehlstellungen gerade
      const t = p.tiles.filter((x) => x !== 0);
      let inv = 0;
      for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) if (t[i] > t[j]) inv++;
      expect(inv % 2).toBe(0);
    }
  });

  it('nur Teile neben der Lücke rutschen; Pfeiltasten schieben', () => {
    const p = { tiles: [1, 2, 3, 4, 5, 6, 7, 0, 8], size: 3, moves: 0 };
    expect(slidePuzzle(p, 0)).toBe(false);
    expect(slidePuzzleDir(p, 'left')).toBe(true);
    expect(puzzleDone(p)).toBe(true);
    expect(p.moves).toBe(1);
  });
});

describe('Takt, Pfeil-Duell, Quiz', () => {
  it('Pendel läuft hin und her; Mitte ist perfekt', () => {
    expect(rhythmPos(0, 1)).toBe(0);
    expect(rhythmPos(0.5, 1)).toBeCloseTo(0.5);
    expect(rhythmPos(1.5, 1)).toBeCloseTo(0.5);
    expect(rhythmHit(0.5)).toBe('perfekt');
    expect(rhythmHit(0.62)).toBe('gut');
    expect(rhythmHit(0.95)).toBe('daneben');
    expect(rhythmRank(20, 10)).toBe('super');
    expect(rhythmRank(0, 10)).toBe('gemuetlich');
  });

  it('Pfeilfolge reproduzierbar; Ergebnis nie „verloren“', () => {
    expect(arrowSequence(5, 10)).toEqual(arrowSequence(5, 10));
    expect(arrowSequence(5, 10).length).toBe(10);
    expect(duelRank(14, 14)).toBe('super');
    expect(duelRank(0, 14)).toBe('gemuetlich');
    expect(quizRank(5, 5)).toBe('super');
    expect(quizRank(3, 5)).toBe('gut');
    expect(quizRank(0, 5)).toBe('gemuetlich');
  });
});
