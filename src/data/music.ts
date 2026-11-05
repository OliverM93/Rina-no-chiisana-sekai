/**
 * Welche Musik wo spielt: In der Nähe eines Hauses erklingt das Thema seiner Bewohner,
 * sonst die Natur-Musik nach Tageszeit & Wetter (`core/music.ts`).
 */
import type { Mood } from '../core/music';

export interface MusicPlace {
  /** Kartenobjekt (nur aktiv, wenn es auf der Karte steht) */
  object: string;
  mood: Mood;
  /** Abstand zur Mitte des Gebäudes in Kacheln */
  radius: number;
}

export const MUSIC_PLACES: readonly MusicPlace[] = [
  { object: 'haus-olaf', mood: 'olaf-christin', radius: 4 },
  { object: 'haus-gisela', mood: 'oma', radius: 4.5 },
  { object: 'bistro-jens', mood: 'bistro', radius: 4.5 },
  { object: 'praxis-lars', mood: 'praxis', radius: 4 },
  { object: 'haus-thalia', mood: 'thalia', radius: 4.5 },
];

/** Thema zu Hause: sobald Oli eingezogen ist, das gemeinsame Lied */
export function homeMood(flags: Readonly<Record<string, boolean>>): Mood {
  return flags.oliEingezogen ? 'lina-oli' : 'zuhause';
}
