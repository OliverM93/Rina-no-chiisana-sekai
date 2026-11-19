import { describe, expect, it } from 'vitest';
import {
  arrowSequence,
  duelRank,
  flipMemory,
  memoryDone,
  memoryRank,
  newMemory,
  duelAnswer,
  duelSequence,
  duelUnlocksNext,
  newPuzzle,
  newSumo,
  puzzleDone,
  puzzleDoneWith,
  puzzleRightAt,
  sumoNextRound,
  sumoOver,
  sumoPush,
  sumoRank,
  sumoTick,
  quizRank,
  rhythmHit,
  rhythmPos,
  rhythmRank,
  slidePuzzle,
  slidePuzzleDir,
  sumoWon,
  type SumoLevel,
} from './unternehmungen';
import { UNTERNEHMUNG_BY_ID } from '../data/unternehmungen';

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

describe('Puzzle mit gleichen Symbolen', () => {
  it('vertauschte gleiche Bilder zählen als richtig', () => {
    const pic = ['a', 'b', 'c', 'x', 'h', 'x', 'd', 'e'];
    // Teile 4 und 6 haben dasselbe Symbol „x“ – vertauscht ist das Bild trotzdem richtig
    const p = { tiles: [1, 2, 3, 6, 5, 4, 7, 8, 0], size: 3, moves: 0 };
    expect(puzzleDone(p)).toBe(false);
    expect(puzzleDoneWith(p, pic)).toBe(true);
    expect(puzzleRightAt(p, pic, 3)).toBe(true);
    const q = { tiles: [2, 1, 3, 4, 5, 6, 7, 8, 0], size: 3, moves: 0 };
    expect(puzzleDoneWith(q, pic)).toBe(false);
    expect(puzzleRightAt(q, pic, 0)).toBe(false);
  });
});

describe('Pfeil-Duell in Leveln', () => {
  it('Umkehr-Pfeile verlangen die Gegenrichtung; ohne Anteil gibt es keine', () => {
    expect(duelSequence(3, 20, 0).some((a) => a.reverse)).toBe(false);
    const seq = duelSequence(3, 40, 0.4);
    expect(seq.some((a) => a.reverse)).toBe(true);
    expect(seq[0].reverse).toBe(false);
    expect(duelAnswer({ dir: 'up', reverse: true })).toBe('down');
    expect(duelAnswer({ dir: 'left', reverse: false })).toBe('left');
  });

  it('nächstes Level ab 60 % Treffern', () => {
    expect(duelUnlocksNext(6, 10)).toBe(true);
    expect(duelUnlocksNext(5, 10)).toBe(false);
  });
});

describe('Kissen-Sumo', () => {
  it('nur abwechselnde Tasten schieben', () => {
    const s = newSumo();
    expect(sumoPush(s, 'left')).toBe('ok');
    expect(sumoPush(s, 'left')).toBe('rutsch');
    expect(sumoPush(s, 'right')).toBe('ok');
    expect(s.pos).toBeCloseTo(s.level.push * 2);
  });

  it('der Stoß über den Rand gewinnt die Runde sofort (früher fraß der Gegendruck den Sieg auf)', () => {
    const s = newSumo();
    s.pos = 0.99;
    expect(sumoPush(s, 'left')).toBe('gewonnen');
    expect(s.won).toBe(1);
    // danach zählt nichts mehr bis zur nächsten Runde
    expect(sumoTick(s, 0.5, 1)).toBe('weiter');
    expect(sumoPush(s, 'right')).toBe('aus');
    sumoNextRound(s);
    expect(s.pos).toBe(0);
    expect(s.roundOver).toBe(false);
  });

  /**
   * Ein Match in echter Zeit: Bilder alle 1/60 s, die Tastendrücke kommen zu ihrem **exakten** Zeitpunkt dazwischen
   * (sonst könnte die Simulation nur Tempi wie 60/7 oder 60/6 Drücke je Sekunde abbilden). `rate` = Drücke je Sekunde im Wechsel.
   */
  function play(level: SumoLevel, rate: number) {
    const s = newSumo(level);
    let t = 0;
    let nextTap = 0;
    let side: 'left' | 'right' = 'left';
    while (!sumoOver(s) && t < 300) {
      if (s.roundOver) {
        sumoNextRound(s);
        nextTap = t;
        continue;
      }
      const step = Math.min(1 / 60, Math.max(0, nextTap - t));
      if (step > 0) {
        sumoTick(s, step, t + step);
        t += step;
      }
      if (t >= nextTap - 1e-9 && !s.roundOver) {
        sumoPush(s, side);
        side = side === 'left' ? 'right' : 'left';
        nextTap += 1 / rate;
      }
    }
    return s;
  }

  it('jedes Lars-Level ist mit flinken Fingern gewinnbar; zu langsam verliert man (ohne Strafe)', () => {
    // die Level werden der Reihe nach schwerer: das nötige Tempo steigt (nie fällt es)
    const need = (lv: SumoLevel) => {
      let r = 2;
      while (r < 15 && !sumoWon(play(lv, r))) r += 0.25;
      return r;
    };
    const tempos = UNTERNEHMUNG_BY_ID['sumo-lars'].sumo!.levels.map(need);
    for (let i = 1; i < tempos.length; i++) expect(tempos[i], `Level ${i + 1}`).toBeGreaterThanOrEqual(tempos[i - 1]);
    // gewünschte Stufen am Ende: Level 7 ab ~8,25, Level 8 ab ~9 Drücken je Sekunde
    expect(tempos[6]).toBe(8.25);
    expect(tempos[7]).toBe(9);
    const levels = UNTERNEHMUNG_BY_ID['sumo-lars'].sumo!.levels;
    expect(levels.length).toBe(8);
    // Level 1 gemütlich mit 4 Drücken/s, alle mit 10/s
    expect(sumoWon(play(levels[0], 4))).toBe(true);
    for (const lv of levels) expect(sumoWon(play(lv, 10)), lv.name).toBe(true);
    // das schwerste Level ist mit 4/s nicht zu schaffen – es wird also wirklich schwieriger
    expect(sumoWon(play(levels[levels.length - 1], 6))).toBe(false);
    // wer gar nicht drückt, verliert – das Spiel endet trotzdem
    const idle = play(levels[0], 0.01);
    expect(sumoOver(idle)).toBe(true);
    expect(sumoRank(idle)).toBe('gemuetlich');
  });
});
