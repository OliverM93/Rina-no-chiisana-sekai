/**
 * Glühwürmchen: An Frühlings- und Sommerabenden tanzen sie über den Wiesen. Reine Stimmung – man kann sie nicht fangen,
 * es gibt nichts zu tun. Hier steht nur die Regel, wann und wie stark sie leuchten (die Darstellung: `world3d/Fireflies3D.ts`).
 */
import type { Season } from './time';

export interface FireflyConditions {
  season: Season;
  /** Dunkelheit 0 (Tag) … 1 (Nacht) */
  night: number;
  /** Regen, Gewitter oder Schnee */
  wet: boolean;
  inside: boolean;
  /** Auf der Insel gibt es sie nicht (dort ist immer Sonne, abends Luau) */
  onIsland: boolean;
}

/** Ab dieser Dunkelheit erscheinen sie zaghaft … */
export const FIREFLY_FROM = 0.22;
/** … und sind ab hier voll da */
export const FIREFLY_FULL = 0.6;

/** Wie stark leuchten die Glühwürmchen gerade? 0 = gar nicht, 1 = voll */
export function fireflyStrength(c: FireflyConditions): number {
  if (c.inside || c.onIsland || c.wet) return 0;
  if (c.season !== 'fruehling' && c.season !== 'sommer') return 0;
  return Math.min(1, Math.max(0, (c.night - FIREFLY_FROM) / (FIREFLY_FULL - FIREFLY_FROM)));
}
