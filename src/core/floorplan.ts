/**
 * Grundriss eines Stockwerks (Konzept: `docs/haus-grundriss.md`, Phase A).
 *
 * Jeder Raum behält seine eigenen Koordinaten und Möbel; der Grundriss legt nur fest, **wo er im Gesamtbild
 * liegt**. Zwischen zwei Räumen liegt ein ein Feld breiter **Wandstreifen**; nur dort, wo eine Tür ist, ist der
 * Streifen begehbar. So reichen Kachel-Kollision und A*-Wegfindung für das ganze Stockwerk – ohne Kanten-Logik.
 * Reine Logik ohne Three.js und DOM.
 */
import { CollisionGrid } from './grid';

export type Side = 'up' | 'down' | 'left' | 'right';

export interface PlacedRoom {
  id: string;
  /** Lage der linken oberen Raumecke im Gesamtgitter (Felder) */
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Tür zwischen zwei Räumen: `cell` liegt im Raum `room` am Rand zur Seite `side`, `toCell` im Nachbarraum `to` */
export interface PlanDoor {
  room: string;
  cell: readonly [number, number];
  side: Side;
  to: string;
  toCell: readonly [number, number];
}

export interface FloorPlan {
  id: string;
  rooms: readonly PlacedRoom[];
  doors: readonly PlanDoor[];
  /** Haustür (nur Erdgeschoss): Feld im Raum, durch das man das Haus verlässt */
  entrance?: { room: string; cell: readonly [number, number]; side: Side };
}

const STEP: Record<Side, readonly [number, number]> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

export function oppositeSide(s: Side): Side {
  return s === 'up' ? 'down' : s === 'down' ? 'up' : s === 'left' ? 'right' : 'left';
}

export function roomById(plan: FloorPlan, id: string): PlacedRoom | undefined {
  return plan.rooms.find((r) => r.id === id);
}

/** Größe des ganzen Stockwerks in Feldern */
export function planSize(plan: FloorPlan): { w: number; h: number } {
  let w = 0;
  let h = 0;
  for (const r of plan.rooms) {
    w = Math.max(w, r.x + r.w);
    h = Math.max(h, r.y + r.h);
  }
  return { w, h };
}

/** Raum-Feld → Feld im Gesamtgitter */
export function toGlobal(plan: FloorPlan, roomId: string, x: number, y: number): { x: number; y: number } | null {
  const r = roomById(plan, roomId);
  return r ? { x: r.x + x, y: r.y + y } : null;
}

/** Welcher Raum liegt unter diesem Feld des Gesamtgitters? (Wandstreifen & Außenbereich: null) */
export function roomAt(plan: FloorPlan, gx: number, gy: number): { room: string; x: number; y: number } | null {
  for (const r of plan.rooms) {
    if (gx >= r.x && gy >= r.y && gx < r.x + r.w && gy < r.y + r.h) return { room: r.id, x: gx - r.x, y: gy - r.y };
  }
  return null;
}

/** Das Feld des Wandstreifens, das eine Tür öffnet (Gesamtgitter) */
export function doorStripCell(plan: FloorPlan, door: PlanDoor): { x: number; y: number } | null {
  const g = toGlobal(plan, door.room, door.cell[0], door.cell[1]);
  if (!g) return null;
  const [dx, dy] = STEP[door.side];
  return { x: g.x + dx, y: g.y + dy };
}

/**
 * Begehbares Gesamtgitter: Alles ist zunächst blockiert; frei sind Raumfelder, auf denen nichts steht
 * (`roomBlocked`), und die Streifenfelder der Türen.
 */
export function buildPlanGrid(plan: FloorPlan, roomBlocked: (roomId: string, x: number, y: number) => boolean = () => false): CollisionGrid {
  const { w, h } = planSize(plan);
  const grid = new CollisionGrid(w, h);
  grid.blocked.fill(1);
  for (const r of plan.rooms) {
    for (let y = 0; y < r.h; y++) for (let x = 0; x < r.w; x++) if (!roomBlocked(r.id, x, y)) grid.setBlocked(r.x + x, r.y + y, false);
  }
  for (const d of plan.doors) {
    const s = doorStripCell(plan, d);
    if (s) grid.setBlocked(s.x, s.y, false);
  }
  return grid;
}

/** Felder, die nie zugestellt werden dürfen, damit Türen frei bleiben (Raum-Koordinaten je Raum) */
export function doorCells(plan: FloorPlan, roomId: string): Array<readonly [number, number]> {
  const out: Array<readonly [number, number]> = [];
  for (const d of plan.doors) {
    if (d.room === roomId) out.push(d.cell);
    if (d.to === roomId) out.push(d.toCell);
  }
  if (plan.entrance?.room === roomId) out.push(plan.entrance.cell);
  return out;
}

/** Prüft einen Grundriss; leere Liste = in Ordnung (Fehlertexte für Tests und Entwickler) */
export function validatePlan(plan: FloorPlan): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  for (const r of plan.rooms) {
    if (ids.has(r.id)) problems.push(`Raum ${r.id} kommt doppelt vor`);
    ids.add(r.id);
    if (r.w < 1 || r.h < 1) problems.push(`Raum ${r.id} hat keine Größe`);
  }
  // Räume dürfen sich nicht berühren: dazwischen muss ein Wandstreifen (≥ 1 Feld) liegen
  for (let i = 0; i < plan.rooms.length; i++) {
    for (let j = i + 1; j < plan.rooms.length; j++) {
      const a = plan.rooms[i];
      const b = plan.rooms[j];
      const gapX = Math.max(a.x - (b.x + b.w), b.x - (a.x + a.w));
      const gapY = Math.max(a.y - (b.y + b.h), b.y - (a.y + a.h));
      if (Math.max(gapX, gapY) < 1) problems.push(`Räume ${a.id} und ${b.id} überlappen oder haben keinen Wandstreifen`);
    }
  }
  for (const d of plan.doors) {
    const a = roomById(plan, d.room);
    const b = roomById(plan, d.to);
    if (!a || !b) {
      problems.push(`Tür ${d.room}→${d.to}: Raum fehlt`);
      continue;
    }
    const [cx, cy] = d.cell;
    if (cx < 0 || cy < 0 || cx >= a.w || cy >= a.h) problems.push(`Tür ${d.room}→${d.to}: Feld liegt nicht im Raum`);
    const onEdge = d.side === 'up' ? cy === 0 : d.side === 'down' ? cy === a.h - 1 : d.side === 'left' ? cx === 0 : cx === a.w - 1;
    if (!onEdge) problems.push(`Tür ${d.room}→${d.to}: Feld liegt nicht an der Wand (${d.side})`);
    const strip = doorStripCell(plan, d);
    if (strip) {
      const [dx, dy] = STEP[d.side];
      const far = { x: strip.x + dx, y: strip.y + dy };
      const target = toGlobal(plan, d.to, d.toCell[0], d.toCell[1]);
      if (!target || target.x !== far.x || target.y !== far.y) problems.push(`Tür ${d.room}→${d.to}: Gegenstück liegt nicht genau gegenüber`);
      if (roomAt(plan, strip.x, strip.y)) problems.push(`Tür ${d.room}→${d.to}: Wandstreifen liegt in einem Raum`);
    }
  }
  if (plan.entrance) {
    const r = roomById(plan, plan.entrance.room);
    if (!r) problems.push('Haustür: Raum fehlt');
  }
  // alle Räume müssen von der Haustür (oder dem ersten Raum) erreichbar sein
  if (plan.rooms.length > 0) {
    const start = plan.entrance?.room ?? plan.rooms[0].id;
    const seen = new Set([start]);
    const queue = [start];
    while (queue.length) {
      const cur = queue.pop() as string;
      for (const d of plan.doors) {
        const next = d.room === cur ? d.to : d.to === cur ? d.room : null;
        if (next && !seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      }
    }
    for (const r of plan.rooms) if (!seen.has(r.id)) problems.push(`Raum ${r.id} ist nicht erreichbar`);
  }
  return problems;
}
