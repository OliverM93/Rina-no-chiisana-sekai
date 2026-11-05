/**
 * Linas Haus: Ausbaustufen, Räume und Preise. Der Ausbau läuft über Olafs
 * Dorfkasse – als zinsloser Kredit, abbezahlen wann man möchte.
 */
import type { House, HouseRules, Room, RoomLayout } from '../core/room';
import { furnitureInfo } from './furniture';

export interface HouseStage {
  stage: number;
  name: string;
  /** Kosten (Kredit) für diesen Ausbau */
  price: number;
  description: string;
}

export const HOUSE_STAGES: readonly HouseStage[] = [
  { stage: 0, name: 'Gemütliches Zimmer', price: 0, description: 'Ein Zimmer mit 8 × 6 Feldern.' },
  { stage: 1, name: 'Großes Zimmer', price: 9800, description: 'Das Zimmer wird größer: 10 × 7 Felder.' },
  { stage: 2, name: 'Schlafzimmer-Anbau', price: 19800, description: 'Ein zweites Zimmer hinten am Haus – durch eine Tür in der Rückwand.' },
  { stage: 3, name: 'Dachzimmer', price: 34800, description: 'Eine Treppe führt in ein gemütliches Zimmer unterm Dach.' },
  { stage: 4, name: 'Wohnküche', price: 49800, description: 'Das Wohnzimmer wächst auf 12 × 8 Felder – und hinten links kommt eine eigene Küche mit Herd dazu.' },
  { stage: 5, name: 'Wintergarten', price: 69800, description: 'Ein heller Glasanbau an der Seite, voller Licht und Pflanzen. Durch eine Tür hinten rechts im Wohnzimmer.' },
  { stage: 6, name: 'Keller', price: 89800, description: 'Eine Treppe vorne rechts führt hinunter in einen großen Hobbykeller mit Backsteinwänden.' },
];
export const MAX_STAGE = HOUSE_STAGES.length - 1;

/** Haustür unten in der Mitte eines Raums der Breite w und Höhe h */
const frontDoor = (w: number, h: number, to: string, kind: 'haustuer' | 'durchgang' | 'treppe' = 'haustuer') => ({
  cells: [[w / 2 - 1, h - 1], [w / 2, h - 1]] as const,
  to,
  dir: 'down' as const,
  kind,
});

export function roomLayouts(stage: number): readonly RoomLayout[] {
  const big = stage >= 1;
  const huge = stage >= 4;
  const w = huge ? 12 : big ? 10 : 8;
  const h = huge ? 8 : big ? 7 : 6;
  const main: RoomLayout = {
    id: 'haupt',
    name: 'Wohnzimmer',
    w,
    h,
    desk: [0, 0],
    exits: [
      frontDoor(w, h, 'draussen'),
      ...(stage >= 2 ? [{ cells: [[w / 2 - 1, 0], [w / 2, 0]] as const, to: 'schlafzimmer', dir: 'up' as const, kind: 'durchgang' as const }] : []),
      ...(stage >= 3 ? [{ cells: [[w - 1, 0]] as const, to: 'dach', dir: 'up' as const, kind: 'treppe' as const }] : []),
      ...(stage >= 4 ? [{ cells: [[2, 0], [3, 0]] as const, to: 'kueche', dir: 'up' as const, kind: 'durchgang' as const }] : []),
      ...(stage >= 5 ? [{ cells: [[w - 4, 0], [w - 3, 0]] as const, to: 'wintergarten', dir: 'up' as const, kind: 'durchgang' as const }] : []),
      ...(stage >= 6 ? [{ cells: [[w - 2, h - 1], [w - 1, h - 1]] as const, to: 'keller', dir: 'down' as const, kind: 'treppe' as const }] : []),
    ],
  };
  const rooms: RoomLayout[] = [main];
  if (stage >= 2) rooms.push({ id: 'schlafzimmer', name: 'Schlafzimmer', w: 8, h: 6, exits: [frontDoor(8, 6, 'haupt', 'durchgang')] });
  if (stage >= 3) rooms.push({ id: 'dach', name: 'Dachzimmer', w: 8, h: 6, exits: [frontDoor(8, 6, 'haupt', 'treppe')] });
  if (stage >= 4) rooms.push({ id: 'kueche', name: 'Küche', w: 8, h: 6, exits: [frontDoor(8, 6, 'haupt', 'durchgang')] });
  if (stage >= 5) rooms.push({ id: 'wintergarten', name: 'Wintergarten', w: 10, h: 7, exits: [frontDoor(10, 7, 'haupt', 'durchgang')] });
  // Keller: die Treppe nach oben steht an der Rückwand
  if (stage >= 6) rooms.push({ id: 'keller', name: 'Keller', w: 12, h: 7, exits: [{ cells: [[0, 0]] as const, to: 'haupt', dir: 'up' as const, kind: 'treppe' as const }] });
  return rooms;
}

export function layoutOf(stage: number, roomId: string): RoomLayout {
  return roomLayouts(stage).find((r) => r.id === roomId) ?? roomLayouts(stage)[0];
}

/** Wie ein neuer Raum aussieht (die Küche kommt mit Küchenzeile, der Wintergarten mit Pflanzen) */
export function emptyRoom(id: string): Room {
  switch (id) {
    case 'kueche':
      return { id, wallpaper: 'tapete-kacheln', floor: 'boden-terrakotta', items: [{ uid: 'start-kueche-herd', itemId: 'herd', x: 5, y: 0, rot: 0 }] };
    case 'wintergarten':
      return {
        id,
        wallpaper: 'tapete-glas',
        floor: 'boden-terrakotta',
        items: [
          { uid: 'start-wg-monstera', itemId: 'topfpflanze', x: 0, y: 0, rot: 0 },
          { uid: 'start-wg-bambus', itemId: 'bambus', x: 9, y: 0, rot: 0 },
        ],
      };
    case 'keller':
      return { id, wallpaper: 'tapete-backstein', floor: 'boden-beton', items: [] };
    default:
      return { id, wallpaper: 'tapete-creme', floor: 'boden-dielen', items: [] };
  }
}

/**
 * Kacheln, die die Anbauten außen am Haus belegen – relativ zur linken oberen Ecke des Hauses
 * (`haus-lina`, 5 × 3). Dort kann man nicht durchlaufen und im Garten nichts hinstellen.
 */
export const HOUSE_ANNEX: Readonly<Record<number, ReadonlyArray<readonly [number, number]>>> = {
  2: [[0, -1], [1, -1], [2, -1], [3, -1]], // Schlafzimmer-Anbau hinten
  4: [[4, -1]], // Küche hinten rechts
  5: [[-1, 0], [-1, 1], [-1, 2]], // Wintergarten links
};

/** Alle belegten Anbau-Kacheln bis einschließlich `stage` (relativ zum Haus) */
export function annexOffsets(stage: number): Array<readonly [number, number]> {
  return Object.entries(HOUSE_ANNEX).filter(([s]) => Number(s) <= stage).flatMap(([, cells]) => cells);
}

export const HOUSE_RULES: HouseRules = { layouts: roomLayouts, maxStage: MAX_STAGE, emptyRoom };

/** Start: ein Zimmer mit Futon, Tischchen und Laterne */
export const STARTER_HOUSE: House = {
  stage: 0,
  rooms: [
    {
      id: 'haupt',
      wallpaper: 'tapete-creme',
      floor: 'boden-dielen',
      items: [
        { uid: 'start-futon', itemId: 'futon-rosa', x: 6, y: 1, rot: 0 },
        { uid: 'start-tisch', itemId: 'chabudai', x: 3, y: 2, rot: 0 },
        { uid: 'start-laterne', itemId: 'andon', x: 7, y: 0, rot: 0 },
      ],
    },
  ],
};

export { furnitureInfo };
