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
  const w = big ? 10 : 8;
  const h = big ? 7 : 6;
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
    ],
  };
  const rooms: RoomLayout[] = [main];
  if (stage >= 2) rooms.push({ id: 'schlafzimmer', name: 'Schlafzimmer', w: 8, h: 6, exits: [frontDoor(8, 6, 'haupt', 'durchgang')] });
  if (stage >= 3) rooms.push({ id: 'dach', name: 'Dachzimmer', w: 8, h: 6, exits: [frontDoor(8, 6, 'haupt', 'treppe')] });
  return rooms;
}

export function layoutOf(stage: number, roomId: string): RoomLayout {
  return roomLayouts(stage).find((r) => r.id === roomId) ?? roomLayouts(stage)[0];
}

export function emptyRoom(id: string): Room {
  return { id, wallpaper: 'tapete-creme', floor: 'boden-dielen', items: [] };
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
