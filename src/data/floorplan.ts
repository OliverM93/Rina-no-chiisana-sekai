/**
 * Grundrisse von Linas Haus je Ausbaustufe (Konzept: `docs/haus-grundriss.md`, Phase A).
 *
 * Erdgeschoss, von oben gesehen (hinten = oben), Wandstreifen zwischen allen Räumen:
 *
 *       ┌───────────────┐
 *       │  Schlafzimmer │              (ab Stufe 2, Tür in der Rückwand des Wohnzimmers)
 *       └───────┬───────┘
 *  ┌──────────────┐ ┌───┴───────────┐ ┌──────┐
 *  │ Wintergarten ├─┤  Wohnzimmer   ├─┤Küche │   (Küche ab Stufe 4, Wintergarten ab Stufe 5; Türen in den Seitenwänden)
 *  └──────────────┘ └───────┬───────┘ └──────┘
 *                Haustür
 *
 * Dach und Keller sind eigene Etagen, die Treppe verbindet sie mit dem Erdgeschoss.
 * Die Möbel bleiben raumweise gespeichert (Raum-Koordinaten) – hier steht nur, wo jeder Raum liegt.
 */
import type { FloorPlan, PlacedRoom, PlanDoor } from '../core/floorplan';
import { innerDoors, layoutOf, MAX_STAGE, roomLayouts } from './house';

/** Etagen-ID: Erdgeschoss, Dachzimmer oben, Keller unten */
export type FloorId = 'eg' | 'dach' | 'keller';

/** Treppe zwischen zwei Etagen (Feld im jeweiligen Raum) */
export interface StairLink {
  from: { floor: FloorId; room: string; cell: readonly [number, number] };
  to: { floor: FloorId; room: string; cell: readonly [number, number] };
}

/** Erdgeschoss für diese Ausbaustufe */
export function groundFloor(stage: number): FloorPlan {
  const main = layoutOf(stage, 'haupt');
  const size = (id: string) => (stage >= (id === 'schlafzimmer' ? 2 : id === 'kueche' ? 4 : 5) ? layoutOf(stage, id) : null);
  const bedroom = size('schlafzimmer');
  const kitchen = size('kueche');
  const conservatory = size('wintergarten');

  // vordere Reihe: Wintergarten | Wohnzimmer | Küche; hinten darüber das Schlafzimmer
  const frontY = bedroom ? bedroom.h + 1 : 0;
  const mainX = conservatory ? conservatory.w + 1 : 0;
  const placed: Record<string, { x: number; y: number }> = { haupt: { x: mainX, y: frontY } };
  if (bedroom) placed.schlafzimmer = { x: mainX + Math.floor(main.w / 2) - 1 - 3, y: 0 };
  if (conservatory) placed.wintergarten = { x: 0, y: frontY };
  if (kitchen) placed.kueche = { x: mainX + main.w + 1, y: frontY };
  const rooms: PlacedRoom[] = roomLayouts(stage)
    .filter((l) => placed[l.id])
    .map((l) => ({ id: l.id, x: placed[l.id].x, y: placed[l.id].y, w: l.w, h: l.h }));
  const doors: PlanDoor[] = innerDoors(stage).map((d) => ({ ...d }));
  return { id: 'eg', rooms, doors, entrance: { room: 'haupt', cell: [Math.floor(main.w / 2) - 1, main.h - 1], side: 'down' } };
}

/** Alle Etagen der Stufe (Erdgeschoss zuerst) */
export function floorsOf(stage: number): FloorPlan[] {
  const out = [groundFloor(stage)];
  if (stage >= 3) out.push({ id: 'dach', rooms: [{ id: 'dach', x: 0, y: 0, ...roomSize(stage, 'dach') }], doors: [] });
  if (stage >= 6) out.push({ id: 'keller', rooms: [{ id: 'keller', x: 0, y: 0, ...roomSize(stage, 'keller') }], doors: [] });
  return out;
}

function roomSize(stage: number, id: string) {
  const l = layoutOf(stage, id);
  return { w: l.w, h: l.h };
}

/** Treppen zwischen den Etagen der Stufe */
export function stairsOf(stage: number): StairLink[] {
  const main = layoutOf(stage, 'haupt');
  const out: StairLink[] = [];
  if (stage >= 3) out.push({ from: { floor: 'eg', room: 'haupt', cell: [main.w - 1, 0] }, to: { floor: 'dach', room: 'dach', cell: [3, 5] } });
  if (stage >= 6) out.push({ from: { floor: 'eg', room: 'haupt', cell: [main.w - 2, main.h - 1] }, to: { floor: 'keller', room: 'keller', cell: [0, 0] } });
  return out;
}

/** In welcher Etage liegt dieser Raum auf dieser Stufe? */
export function floorOfRoom(stage: number, roomId: string): FloorId | null {
  return floorsOf(Math.min(stage, MAX_STAGE)).find((f) => f.rooms.some((r) => r.id === roomId))?.id as FloorId | null ?? null;
}
