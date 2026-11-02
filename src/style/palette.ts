/**
 * Zentrale Farbpalette von „Rina no Chiisana Sekai“.
 *
 * Alle Grafiken (prozedurale Texturen, UI, Effekte) beziehen ihre Farben von
 * hier, damit das Spiel einheitlich weich, pastellig und gemütlich aussieht.
 * Eigene Farbwerte – nur vom Kawaii-/Cozy-Stil inspiriert.
 */

export const palette = {
  // --- Natur ---------------------------------------------------------------
  grass: { base: '#a9da8c', light: '#c0e8a3', dark: '#8fc775', tuft: '#7fbb68' },
  path: { base: '#ecd7ae', edge: '#d9bd8e', pebble: '#cdb08a' },
  plaza: { base: '#efe4d6', stone: '#e2d3c1', edge: '#cdbba6' },
  sand: { base: '#f7e8c4', edge: '#ecd5a4', shell: '#f9c9c9' },
  water: { base: '#8fd4ea', deep: '#72c2df', foam: '#eafaff', bank: 'rgba(110, 88, 70, 0.18)' },
  sea: { base: '#86cfe6', deep: '#69b9da' },
  wood: { light: '#e6c59c', base: '#cfa175', dark: '#a97c56', bark: '#b5875f' },
  stone: { light: '#e3e0e6', base: '#c9c4cf', dark: '#a9a3b2' },

  // Laub nach Jahreszeit (Hauptfarbe, Licht, Schatten)
  leaves: {
    fruehling: ['#8fd08a', '#b2e4a0', '#6fb873'],
    sommer: ['#79c278', '#9ed98f', '#5aa964'],
    herbst: ['#f0a86a', '#f7c98a', '#d9845a'],
    winter: ['#9fc6a6', '#e9f3f6', '#7ba88b'],
  },
  blossom: ['#ffc4d6', '#fff0b3', '#d9c8ff', '#ffd9b8', '#c8ecff', '#ffffff'],

  // --- Gebäude -------------------------------------------------------------
  roof: {
    rose: '#f4a7b9',
    coral: '#f6b39e',
    mint: '#9fdcc5',
    lilac: '#c8b6e8',
    butter: '#f6e092',
    sky: '#a9cdf2',
  },
  wall: { cream: '#fff5e3', shade: '#f1e2c8', trim: '#ffffff' },
  window: { glass: '#cfeefc', frame: '#ffffff', glow: '#ffe6a3' },
  door: { base: '#d99c78', dark: '#b97f5f' },

  // --- Figuren ---------------------------------------------------------------
  skin: ['#ffe3cf', '#f9d2b6', '#ecbd99', '#cf9776', '#966a52'],
  hair: {
    braun: '#7b4a33',
    dunkelbraun: '#4f3227',
    haselnuss: '#a8714b',
    blond: '#e9c47c',
    rotblond: '#d9875a',
    schwarz: '#352a2d',
    grau: '#c8c2c8',
    angegraut: '#5f5654',
    weiss: '#f3efec',
    rosa: '#f5a9c4',
    mint: '#9fd8c8',
  },
  eyes: '#3d2d33',
  blush: 'rgba(255, 140, 160, 0.45)',
  outfit: [
    '#f7a8be', // Rosa
    '#ffd38f', // Aprikose
    '#a8dcc8', // Mint
    '#a9cdf2', // Himmelblau
    '#c8b6e8', // Flieder
    '#fff0a8', // Vanille
    '#f6b39e', // Koralle
    '#ffffff', // Weiß
    '#8a9bc4', // Jeansblau
    '#7d6a73', // Mokka
  ],

  // --- Licht & Effekte -------------------------------------------------------
  shadow: 'rgba(80, 60, 90, 0.18)',
  glow: '#ffdf9e',
  sparkle: '#ffffff',

  // --- Benutzeroberfläche ----------------------------------------------------
  ui: {
    bg: '#fff8ef',
    panel: '#fffdf9',
    border: '#f3cad6',
    text: '#6a4d5a',
    textSoft: '#9a8090',
    accent: '#f497b0',
    accentDark: '#e27896',
    mint: '#8fd1c0',
    butter: '#ffe39b',
    sky: '#b4d8f5',
  },
} as const;

export type SeasonLeafKey = keyof typeof palette.leaves;

/** Wandelt '#rrggbb' in eine Zahl 0xrrggbb um (für Phaser). */
export function hexToInt(hex: string): number {
  return parseInt(hex.replace('#', ''), 16);
}

/** Wandelt '#rrggbb' in [r, g, b] (0–255) um. */
export function hexToRgb(hex: string): [number, number, number] {
  const n = hexToInt(hex);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Mischt zwei Hex-Farben linear (t = 0 → a, t = 1 → b). */
export function mixHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1);
}

/** Hellt eine Farbe auf (amount 0..1 Richtung Weiß). */
export function lighten(hex: string, amount: number): string {
  return mixHex(hex, '#ffffff', amount);
}

/** Dunkelt eine Farbe ab (amount 0..1 Richtung eines warmen Dunkeltons). */
export function darken(hex: string, amount: number): string {
  return mixHex(hex, '#3a2a35', amount);
}
