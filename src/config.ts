/**
 * Globale Einstellungen der Darstellung.
 */
export { TILE } from './core/worldmap';

/** Pixeldichte des Bildschirms (auf 2 begrenzt, damit es flüssig bleibt). */
export const DPR = typeof window !== 'undefined' ? Math.min(2, Math.max(1, window.devicePixelRatio || 1)) : 1;

/**
 * Auflösung der prozedural gezeichneten Texturen (Texturpixel pro Welteinheit).
 * Höher = schärfer, aber mehr Speicher.
 */
export const RES = DPR >= 1.75 ? 3 : 2;

/** Gewünschte Kachelgröße auf dem Bildschirm in CSS-Pixeln (wird an die Fenstergröße angepasst). */
export function cssTileSize(cssWidth: number, cssHeight: number): number {
  const short = Math.min(cssWidth, cssHeight);
  // Handy: ~7–8 Kacheln über die kurze Seite; Desktop: größere, gemütliche Kacheln.
  return Math.max(46, Math.min(84, short / 8.5));
}

export const WALK_SPEED = 150; // Welteinheiten pro Sekunde
export const RUN_SPEED = 255;

/** Tiefen-Ebenen (Zeichenreihenfolge) */
export const DEPTH = {
  ground: -1000,
  decor: -500,
  plotMarks: -400,
  // Objekte & Figuren nutzen ihre y-Position als Tiefe (0 … Kartenhöhe)
  clouds: 90_000,
  ambient: 95_000,
  night: 100_000,
  lights: 100_100,
  marker: 100_200,
} as const;
