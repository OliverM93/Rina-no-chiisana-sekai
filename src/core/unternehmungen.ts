/**
 * Kernlogik der gemeinsamen Unternehmungen (kleine Minispiele mit den Bewohnern).
 * Reine Funktionen ohne DOM/Three.js – testbar. Kein Scheitern: jede Runde endet mit einem Ergebnis,
 * das nur bestimmt, *welcher* freundliche Satz danach kommt.
 */
import { mulberry32 } from './rng';

/** Wie gut lief es? Nur für die Wahl der Abschluss-Sätze – es gibt kein „verloren“. */
export type Rank = 'super' | 'gut' | 'gemuetlich';

/** Fisher-Yates mit reproduzierbarem Zufall */
export function shuffled<T>(items: readonly T[], seed: number): T[] {
  const rnd = mulberry32(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ---------------------------------------------------------------------------
// Memory
// ---------------------------------------------------------------------------

export interface MemoryState {
  /** Symbol je Karte */
  cards: string[];
  /** schon gefundene Karten */
  found: boolean[];
  /** gerade aufgedeckt (höchstens zwei) */
  open: number[];
  /** Anzahl Versuche (je zwei aufgedeckte Karten) */
  moves: number;
}

export function newMemory(symbols: readonly string[], seed: number): MemoryState {
  const cards = shuffled([...symbols, ...symbols], seed);
  return { cards, found: cards.map(() => false), open: [], moves: 0 };
}

/**
 * Karte aufdecken. Liegen schon zwei offene (kein Paar) auf dem Tisch, werden sie zuerst wieder umgedreht.
 * Gibt zurück, ob gerade ein Paar gefunden wurde.
 */
export function flipMemory(s: MemoryState, i: number): { pair: boolean } {
  if (i < 0 || i >= s.cards.length || s.found[i]) return { pair: false };
  if (s.open.length >= 2) s.open = [];
  if (s.open.includes(i)) return { pair: false };
  s.open.push(i);
  if (s.open.length < 2) return { pair: false };
  s.moves += 1;
  const [a, b] = s.open;
  if (s.cards[a] === s.cards[b]) {
    s.found[a] = true;
    s.found[b] = true;
    s.open = [];
    return { pair: true };
  }
  return { pair: false };
}

export const memoryDone = (s: MemoryState) => s.found.every(Boolean);

/** Bewertung nach Versuchen: perfekt wären so viele Versuche wie Paare */
export function memoryRank(s: MemoryState): Rank {
  const pairs = s.cards.length / 2;
  if (s.moves <= pairs + 3) return 'super';
  if (s.moves <= pairs * 2 + 1) return 'gut';
  return 'gemuetlich';
}

// ---------------------------------------------------------------------------
// Schiebepuzzle (3 × 3, Feld 0 = Lücke)
// ---------------------------------------------------------------------------

export interface PuzzleState {
  /** tiles[pos] = Teil-Nummer 1..8, 0 = Lücke; gelöst = [1,2,…,8,0] */
  tiles: number[];
  size: number;
  moves: number;
}

const solved = (size: number) => [...Array.from({ length: size * size - 1 }, (_, i) => i + 1), 0];

function neighboursOf(pos: number, size: number): number[] {
  const x = pos % size;
  const y = Math.floor(pos / size);
  const out: number[] = [];
  if (x > 0) out.push(pos - 1);
  if (x < size - 1) out.push(pos + 1);
  if (y > 0) out.push(pos - size);
  if (y < size - 1) out.push(pos + size);
  return out;
}

/** Aus dem gelösten Zustand heraus mischen (dadurch immer lösbar) */
export function newPuzzle(seed: number, size = 3, steps = 40): PuzzleState {
  const rnd = mulberry32(seed);
  const tiles = solved(size);
  let gap = tiles.indexOf(0);
  let last = -1;
  for (let i = 0; i < steps; i++) {
    const options = neighboursOf(gap, size).filter((p) => p !== last);
    const pick = options[Math.floor(rnd() * options.length)];
    [tiles[gap], tiles[pick]] = [tiles[pick], tiles[gap]];
    last = gap;
    gap = pick;
  }
  // nie schon gelöst anfangen
  if (puzzleSolvedTiles(tiles)) {
    const n = neighboursOf(gap, size)[0];
    [tiles[gap], tiles[n]] = [tiles[n], tiles[gap]];
  }
  return { tiles, size, moves: 0 };
}

function puzzleSolvedTiles(tiles: readonly number[]): boolean {
  return tiles.every((t, i) => (i === tiles.length - 1 ? t === 0 : t === i + 1));
}

/** Ein Teil neben der Lücke anklicken → es rutscht hinein */
export function slidePuzzle(s: PuzzleState, pos: number): boolean {
  const gap = s.tiles.indexOf(0);
  if (!neighboursOf(gap, s.size).includes(pos)) return false;
  [s.tiles[gap], s.tiles[pos]] = [s.tiles[pos], s.tiles[gap]];
  s.moves += 1;
  return true;
}

/** Teil in eine Richtung schieben (Pfeiltasten: das Teil auf der anderen Seite der Lücke rutscht) */
export function slidePuzzleDir(s: PuzzleState, dir: 'up' | 'down' | 'left' | 'right'): boolean {
  const gap = s.tiles.indexOf(0);
  const x = gap % s.size;
  const y = Math.floor(gap / s.size);
  const from = { up: [x, y + 1], down: [x, y - 1], left: [x + 1, y], right: [x - 1, y] }[dir];
  if (from[0] < 0 || from[1] < 0 || from[0] >= s.size || from[1] >= s.size) return false;
  return slidePuzzle(s, from[1] * s.size + from[0]);
}

export const puzzleDone = (s: PuzzleState) => puzzleSolvedTiles(s.tiles);

export function puzzleRank(s: PuzzleState): Rank {
  if (s.moves <= 40) return 'super';
  if (s.moves <= 90) return 'gut';
  return 'gemuetlich';
}

// ---------------------------------------------------------------------------
// Takt (Training): ein Punkt pendelt über eine Leiste, im richtigen Moment drücken
// ---------------------------------------------------------------------------

/** Position des Pendels 0..1 nach `t` Sekunden (hin und her) */
export function rhythmPos(t: number, period: number): number {
  const p = (t / period) % 2;
  return p < 1 ? p : 2 - p;
}

/** Wie gut war der Druck? Ziel liegt in der Mitte (0.5). */
export function rhythmHit(pos: number): 'perfekt' | 'gut' | 'daneben' {
  const d = Math.abs(pos - 0.5);
  if (d <= 0.07) return 'perfekt';
  if (d <= 0.17) return 'gut';
  return 'daneben';
}

/** Punkte: perfekt 2, gut 1 */
export function rhythmRank(points: number, reps: number): Rank {
  if (points >= reps * 1.5) return 'super';
  if (points >= reps * 0.8) return 'gut';
  return 'gemuetlich';
}

// ---------------------------------------------------------------------------
// Pfeil-Duell (Zocken): Pfeile erscheinen, schnell die passende Taste drücken
// ---------------------------------------------------------------------------

export type Arrow = 'up' | 'down' | 'left' | 'right';
const ARROWS: readonly Arrow[] = ['up', 'down', 'left', 'right'];

export function arrowSequence(seed: number, length: number): Arrow[] {
  const rnd = mulberry32(seed);
  return Array.from({ length }, () => ARROWS[Math.floor(rnd() * ARROWS.length)]);
}

export function duelRank(hits: number, total: number): Rank {
  if (hits >= total * 0.85) return 'super';
  if (hits >= total * 0.55) return 'gut';
  return 'gemuetlich';
}

// ---------------------------------------------------------------------------
// Quiz
// ---------------------------------------------------------------------------

export function quizRank(correct: number, total: number): Rank {
  if (correct >= total) return 'super';
  if (correct >= Math.ceil(total / 2)) return 'gut';
  return 'gemuetlich';
}
