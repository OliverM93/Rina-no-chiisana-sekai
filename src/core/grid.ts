/**
 * Kachel-Raster für Kollision und Wegfindung (Klicken/Tippen zum Laufen).
 */

export interface Tile {
  x: number;
  y: number;
}

export class CollisionGrid {
  readonly blocked: Uint8Array;

  constructor(
    readonly width: number,
    readonly height: number,
  ) {
    this.blocked = new Uint8Array(width * height);
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  /** Außerhalb der Karte gilt alles als blockiert. */
  isBlocked(x: number, y: number): boolean {
    if (!this.inBounds(x, y)) return true;
    return this.blocked[y * this.width + x] === 1;
  }

  setBlocked(x: number, y: number, value = true): void {
    if (this.inBounds(x, y)) this.blocked[y * this.width + x] = value ? 1 : 0;
  }

  /** Blockiert ein Rechteck aus Kacheln. */
  blockRect(x: number, y: number, w: number, h: number, value = true): void {
    for (let ty = y; ty < y + h; ty++) for (let tx = x; tx < x + w; tx++) this.setBlocked(tx, ty, value);
  }
}

const DIRS: Array<[number, number, number]> = [
  [1, 0, 1],
  [-1, 0, 1],
  [0, 1, 1],
  [0, -1, 1],
  [1, 1, Math.SQRT2],
  [1, -1, Math.SQRT2],
  [-1, 1, Math.SQRT2],
  [-1, -1, Math.SQRT2],
];

/** Oktil-Distanz als Heuristik für 8-Richtungs-Bewegung. */
function heuristic(ax: number, ay: number, bx: number, by: number): number {
  const dx = Math.abs(ax - bx);
  const dy = Math.abs(ay - by);
  return Math.max(dx, dy) + (Math.SQRT2 - 1) * Math.min(dx, dy);
}

/** Kleiner binärer Min-Heap für A*. */
class MinHeap {
  private items: number[] = [];
  private prio: number[] = [];
  get size() {
    return this.items.length;
  }
  push(item: number, priority: number) {
    this.items.push(item);
    this.prio.push(priority);
    let i = this.items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.prio[parent] <= this.prio[i]) break;
      this.swap(i, parent);
      i = parent;
    }
  }
  pop(): number {
    const top = this.items[0];
    const lastItem = this.items.pop() as number;
    const lastPrio = this.prio.pop() as number;
    if (this.items.length > 0) {
      this.items[0] = lastItem;
      this.prio[0] = lastPrio;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < this.items.length && this.prio[l] < this.prio[m]) m = l;
        if (r < this.items.length && this.prio[r] < this.prio[m]) m = r;
        if (m === i) break;
        this.swap(i, m);
        i = m;
      }
    }
    return top;
  }
  private swap(a: number, b: number) {
    [this.items[a], this.items[b]] = [this.items[b], this.items[a]];
    [this.prio[a], this.prio[b]] = [this.prio[b], this.prio[a]];
  }
}

/**
 * A*-Wegfindung mit 8 Richtungen. Diagonal geht es nur, wenn beide
 * angrenzenden Kacheln frei sind (kein „Ecken-Schneiden“).
 * Liefert die Kacheln vom Start (exklusive) bis zum Ziel (inklusive),
 * oder `null`, falls kein Weg existiert.
 */
export function findPath(grid: CollisionGrid, start: Tile, goal: Tile, maxNodes = 20000): Tile[] | null {
  if (grid.isBlocked(goal.x, goal.y)) return null;
  if (start.x === goal.x && start.y === goal.y) return [];

  const w = grid.width;
  const startIdx = start.y * w + start.x;
  const goalIdx = goal.y * w + goal.x;
  const gScore = new Float64Array(w * grid.height).fill(Infinity);
  const cameFrom = new Int32Array(w * grid.height).fill(-1);
  const closed = new Uint8Array(w * grid.height);
  const open = new MinHeap();

  gScore[startIdx] = 0;
  open.push(startIdx, heuristic(start.x, start.y, goal.x, goal.y));
  let expanded = 0;

  while (open.size > 0) {
    const current = open.pop();
    if (current === goalIdx) break;
    if (closed[current]) continue;
    closed[current] = 1;
    if (++expanded > maxNodes) return null;

    const cx = current % w;
    const cy = (current - cx) / w;
    for (const [dx, dy, cost] of DIRS) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (grid.isBlocked(nx, ny)) continue;
      if (dx !== 0 && dy !== 0 && (grid.isBlocked(cx + dx, cy) || grid.isBlocked(cx, cy + dy))) continue;
      const ni = ny * w + nx;
      if (closed[ni]) continue;
      const tentative = gScore[current] + cost;
      if (tentative < gScore[ni]) {
        gScore[ni] = tentative;
        cameFrom[ni] = current;
        open.push(ni, tentative + heuristic(nx, ny, goal.x, goal.y));
      }
    }
  }

  if (cameFrom[goalIdx] === -1) return null;
  const path: Tile[] = [];
  let idx = goalIdx;
  while (idx !== startIdx) {
    const x = idx % w;
    path.push({ x, y: (idx - x) / w });
    idx = cameFrom[idx];
  }
  return path.reverse();
}

/**
 * Sucht die nächstgelegene freie Kachel (Breitensuche in Ringen).
 * Praktisch, wenn man auf einen Baum oder ein Haus tippt.
 */
export function nearestWalkable(grid: CollisionGrid, target: Tile, from?: Tile, maxRadius = 6): Tile | null {
  if (!grid.isBlocked(target.x, target.y)) return { ...target };
  let best: Tile | null = null;
  let bestScore = Infinity;
  for (let r = 1; r <= maxRadius; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const x = target.x + dx;
        const y = target.y + dy;
        if (grid.isBlocked(x, y)) continue;
        // Ring zuerst, dann Nähe zur Spielerin als Entscheidungshilfe.
        const toTarget = Math.hypot(dx, dy);
        const toFrom = from ? Math.hypot(x - from.x, y - from.y) * 0.01 : 0;
        const score = toTarget + toFrom;
        if (score < bestScore) {
          bestScore = score;
          best = { x, y };
        }
      }
    }
    if (best) return best;
  }
  return null;
}
