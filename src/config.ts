/**
 * Globale Einstellungen.
 */
export { TILE } from './core/worldmap';

/** Spiellogik rechnet in „Welteinheiten“ (64 pro Kachel), Three.js in Kacheln (1 pro Kachel). */
export const UNIT = 1 / 64;

export const WALK_SPEED = 150; // Welteinheiten pro Sekunde
export const RUN_SPEED = 255;

/** Pixeldichte (auf 2 begrenzt, damit es flüssig bleibt) */
export const DPR = typeof window !== 'undefined' ? Math.min(2, Math.max(1, window.devicePixelRatio || 1)) : 1;
