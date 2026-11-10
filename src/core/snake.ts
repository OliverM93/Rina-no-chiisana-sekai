/**
 * „Dackel-Snake“: Winston flitzt über den Bildschirm, sammelt Leckerli und wird dabei immer länger.
 * Reine Logik (kein DOM). Die Ränder sind weich: wer links rausläuft, kommt rechts wieder rein.
 */

export type Dir = 'up' | 'down' | 'left' | 'right';

export interface Cell {
  x: number;
  y: number;
}

export interface SnakeState {
  w: number;
  h: number;
  /** Kopf zuerst */
  body: Cell[];
  dir: Dir;
  food: Cell;
  score: number;
  over: boolean;
}

const DELTA: Record<Dir, Cell> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
const OPPOSITE: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };

export function oppositeDir(d: Dir): Dir {
  return OPPOSITE[d];
}

/** Zufälliges freies Feld (rnd liefert 0 ≤ r < 1); null, wenn alles voll ist */
export function freeCell(w: number, h: number, body: readonly Cell[], rnd: () => number): Cell | null {
  const free: Cell[] = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (!body.some((c) => c.x === x && c.y === y)) free.push({ x, y });
  if (free.length === 0) return null;
  return free[Math.floor(rnd() * free.length) % free.length];
}

export function newSnake(w = 16, h = 11, rnd: () => number = Math.random): SnakeState {
  const y = Math.floor(h / 2);
  const body = [{ x: 4, y }, { x: 3, y }, { x: 2, y }];
  return { w, h, body, dir: 'right', food: freeCell(w, h, body, rnd) ?? { x: 0, y: 0 }, score: 0, over: false };
}

/** Ein Schritt in Richtung `want` (Umkehr auf der Stelle wird ignoriert) */
export function stepSnake(s: SnakeState, want: Dir, rnd: () => number = Math.random): SnakeState {
  if (s.over) return s;
  const dir = want === OPPOSITE[s.dir] ? s.dir : want;
  const d = DELTA[dir];
  const head = s.body[0];
  const next = { x: (head.x + d.x + s.w) % s.w, y: (head.y + d.y + s.h) % s.h };
  const eats = next.x === s.food.x && next.y === s.food.y;
  // der Schwanz rückt nach, außer es wurde gefressen
  const stays = eats ? s.body : s.body.slice(0, -1);
  if (stays.some((c) => c.x === next.x && c.y === next.y)) return { ...s, dir, over: true };
  const body = [next, ...stays];
  if (!eats) return { ...s, body, dir };
  const food = freeCell(s.w, s.h, body, rnd);
  // Bildschirm voll = Meisterleistung
  return { ...s, body, dir, score: s.score + 1, food: food ?? s.food, over: food === null };
}

/** Schlüssel des Rekords im Spielstand (`world.dates`, als Zahl-Text – kein neues Spielstand-Format) */
export const SNAKE_RECORD_KEY = 'snake-rekord';

/** Gespeicherter Rekord (ungültig/fehlend = 0) */
export function readRecord(dates: Readonly<Record<string, string>>): number {
  const n = Number.parseInt(dates[SNAKE_RECORD_KEY] ?? '', 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Neuen Rekord eintragen, falls höher; gibt zurück, ob es ein neuer Rekord ist */
export function saveRecord(dates: Record<string, string>, score: number): boolean {
  if (score <= readRecord(dates)) return false;
  dates[SNAKE_RECORD_KEY] = String(score);
  return true;
}
