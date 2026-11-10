/**
 * Grundrisse von Linas Haus je Ausbaustufe (Konzept: `docs/haus-grundriss.md`, Phase A).
 *
 * Erdgeschoss, von oben gesehen (hinten = oben), Wandstreifen zwischen allen Räumen:
 *
 *       ┌───────────────┐
 *       │  Schlafzimmer │              (ab Stufe 2, Tür in der Rückwand des Wohnzimmers)
 *       └───────┬───────┘
 *  ┌──────┐ ┌───┴───────────┐ ┌──────────────┐
 *  │Küche ├─┤  Wohnzimmer   ├─┤ Wintergarten │   (Küche ab Stufe 4, Wintergarten ab Stufe 5; Türen in den Seitenwänden)
 *  └──────┘ └───────┬───────┘ └──────────────┘
 *                Haustür
 *
 * Dach und Keller sind eigene Etagen, die Treppe verbindet sie mit dem Erdgeschoss.
 * Die Möbel bleiben raumweise gespeichert (Raum-Koordinaten) – hier steht nur, wo jeder Raum liegt.
 */
import type { FloorPlan, PlacedRoom, PlanDoor } from '../core/floorplan';
import { layoutOf, MAX_STAGE } from './house';

/** Etagen-ID: Erdgeschoss, Dachzimmer oben, Keller unten */
export type FloorId = 'eg' | 'dach' | 'keller';

/** Treppe zwischen zwei Etagen (Feld im jeweiligen Raum) */
export interface StairLink {
  from: { floor: FloorId; room: string; cell: readonly [number, number] };
  to: { floor: FloorId; room: string; cell: readonly [number, number] };
}

/** Das Feld in Seitenwand-Türen, an dem Küche/Wintergarten mit dem Wohnzimmer verbunden sind (Zeile im Raum) */
const SIDE_DOOR_ROW = 3;

/** Erdgeschoss für diese Ausbaustufe */
export function groundFloor(stage: number): FloorPlan {
  const main = layoutOf(stage, 'haupt');
  const hasBedroom = stage >= 2;
  const hasKitchen = stage >= 4;
  const hasConservatory = stage >= 5;
  const size = (id: string) => layoutOf(stage, id);

  const bedroom = hasBedroom ? size('schlafzimmer') : null;
  const kitchen = hasKitchen ? size('kueche') : null;
  const conservatory = hasConservatory ? size('wintergarten') : null;

  // vordere Reihe: Küche | Wohnzimmer | Wintergarten; hinten darüber das Schlafzimmer
  const frontY = bedroom ? bedroom.h + 1 : 0;
  const mainX = kitchen ? kitchen.w + 1 : 0;
  const rooms: PlacedRoom[] = [{ id: 'haupt', x: mainX, y: frontY, w: main.w, h: main.h }];
  const doors: PlanDoor[] = [];

  if (bedroom) {
    // Rückwand-Tür des Wohnzimmers liegt über der Haustür des Schlafzimmers
    const mainDoorX = Math.floor(main.w / 2) - 1;
    const bedDoorX = Math.floor(bedroom.w / 2) - 1;
    rooms.push({ id: 'schlafzimmer', x: mainX + mainDoorX - bedDoorX, y: 0, w: bedroom.w, h: bedroom.h });
    doors.push({ room: 'haupt', cell: [mainDoorX, 0], side: 'up', to: 'schlafzimmer', toCell: [bedDoorX, bedroom.h - 1] });
  }
  if (kitchen) {
    rooms.push({ id: 'kueche', x: 0, y: frontY, w: kitchen.w, h: kitchen.h });
    doors.push({ room: 'kueche', cell: [kitchen.w - 1, SIDE_DOOR_ROW], side: 'right', to: 'haupt', toCell: [0, SIDE_DOOR_ROW] });
  }
  if (conservatory) {
    rooms.push({ id: 'wintergarten', x: mainX + main.w + 1, y: frontY, w: conservatory.w, h: conservatory.h });
    doors.push({ room: 'haupt', cell: [main.w - 1, SIDE_DOOR_ROW], side: 'right', to: 'wintergarten', toCell: [0, SIDE_DOOR_ROW] });
  }
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
