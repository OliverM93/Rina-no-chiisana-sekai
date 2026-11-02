/**
 * Bewegung mit Kollision gegen ein Kachel-Raster.
 *
 * Kollidiert wird nur mit einer kleinen „Fuß-Box“ der Figur, so dass sie
 * hübsch vor Bäumen und Häusern stehen kann (leicht schräge Draufsicht).
 * Zusätzlich gleitet die Figur sanft um Ecken herum, statt hängen zu bleiben.
 */

export interface Vec2 {
  x: number;
  y: number;
}

export interface FootBox {
  /** halbe Breite */
  hw: number;
  /** halbe Höhe */
  hh: number;
}

export type SolidFn = (tx: number, ty: number) => boolean;

export interface MoveResult extends Vec2 {
  blockedX: boolean;
  blockedY: boolean;
}

function overlapsSolid(x: number, y: number, box: FootBox, tile: number, solid: SolidFn): boolean {
  const eps = 0.001;
  const x0 = Math.floor((x - box.hw) / tile);
  const x1 = Math.floor((x + box.hw - eps) / tile);
  const y0 = Math.floor((y - box.hh) / tile);
  const y1 = Math.floor((y + box.hh - eps) / tile);
  for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) if (solid(tx, ty)) return true;
  return false;
}

/** Bewegt entlang einer Achse; bei Kollision bis an die Kachelkante. */
function moveAxis(pos: Vec2, delta: number, axis: 'x' | 'y', box: FootBox, tile: number, solid: SolidFn) {
  if (delta === 0) return { value: pos[axis], blocked: false };
  const next = { ...pos, [axis]: pos[axis] + delta };
  if (!overlapsSolid(next.x, next.y, box, tile, solid)) return { value: next[axis], blocked: false };

  const half = axis === 'x' ? box.hw : box.hh;
  let value: number;
  if (delta > 0) {
    const edge = Math.floor((pos[axis] + half + delta) / tile) * tile;
    value = Math.max(pos[axis], edge - half);
  } else {
    const edge = Math.floor((pos[axis] - half + delta) / tile + 1) * tile;
    value = Math.min(pos[axis], edge + half);
  }
  // Sicherheitsnetz: niemals in einen Block hineinschieben.
  const probe = { ...pos, [axis]: value };
  if (overlapsSolid(probe.x, probe.y, box, tile, solid)) value = pos[axis];
  return { value, blocked: true };
}

/**
 * Bewegt `pos` um (dx, dy) und löst Kollisionen achsenweise auf.
 * `cornerAssist` (0..1) bestimmt, wie weit die Figur seitlich um eine Ecke
 * „geschubst“ werden darf (Anteil einer Kachel).
 */
export function moveWithCollision(
  pos: Vec2,
  dx: number,
  dy: number,
  box: FootBox,
  tile: number,
  solid: SolidFn,
  cornerAssist = 0.45,
): MoveResult {
  // Steckt die Figur (z. B. nach einer Kartenänderung) schon in einem Hindernis,
  // darf sie sich frei herausbewegen, statt festzuhängen.
  if (overlapsSolid(pos.x, pos.y, box, tile, solid)) {
    return { x: pos.x + dx, y: pos.y + dy, blockedX: false, blockedY: false };
  }
  const rx = moveAxis(pos, dx, 'x', box, tile, solid);
  let x = rx.value;
  const ry = moveAxis({ x, y: pos.y }, dy, 'y', box, tile, solid);
  let y = ry.value;

  // Um Ecken gleiten: nur bei reiner Bewegung entlang einer Achse.
  if (rx.blocked && dy === 0 && cornerAssist > 0) {
    const nudge = tryNudge({ x, y }, dx, 'x', box, tile, solid, cornerAssist);
    if (nudge !== null) y = nudge;
  } else if (ry.blocked && dx === 0 && cornerAssist > 0) {
    const nudge = tryNudge({ x, y }, dy, 'y', box, tile, solid, cornerAssist);
    if (nudge !== null) x = nudge;
  }

  return { x, y, blockedX: rx.blocked, blockedY: ry.blocked };
}

/**
 * Prüft, ob die Bewegung frei wäre, wenn die Figur auf der Querachse leicht
 * versetzt stünde. Gibt die neue Querkoordinate zurück (einen kleinen Schritt
 * in Richtung des freien Durchgangs) oder `null`.
 */
function tryNudge(
  pos: Vec2,
  delta: number,
  axis: 'x' | 'y',
  box: FootBox,
  tile: number,
  solid: SolidFn,
  assist: number,
): number | null {
  const cross = axis === 'x' ? 'y' : 'x';
  const step = Math.sign(delta) * Math.max(1, Math.abs(delta));
  const maxShift = tile * assist;
  const sample = 2;
  for (let shift = sample; shift <= maxShift; shift += sample) {
    for (const dir of [-1, 1]) {
      const probe = { ...pos, [cross]: pos[cross] + dir * shift };
      if (overlapsSolid(probe.x, probe.y, box, tile, solid)) continue;
      const moved = { ...probe, [axis]: probe[axis] + step };
      if (!overlapsSolid(moved.x, moved.y, box, tile, solid)) {
        const nudgeSpeed = Math.min(shift, Math.abs(delta));
        return pos[cross] + dir * nudgeSpeed;
      }
    }
  }
  return null;
}

/** Richtung aus einem Bewegungsvektor (für Blickrichtung/Animation). */
export function facingFromVector(dx: number, dy: number, current: 'down' | 'up' | 'left' | 'right') {
  if (dx === 0 && dy === 0) return current;
  if (Math.abs(dx) > Math.abs(dy) * 1.05) return dx > 0 ? 'right' : 'left';
  return dy > 0 ? 'down' : 'up';
}
