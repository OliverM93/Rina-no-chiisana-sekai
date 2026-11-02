/**
 * Gelände mit weichen, runden Übergängen („Dual-Grid“-Technik).
 *
 * Statt jede Kachel einzeln zu zeichnen, liegt ein zweites Raster um eine
 * halbe Kachel versetzt darüber. Jede dieser Anzeige-Kacheln schaut auf die
 * vier Welt-Kacheln an ihren Ecken. Daraus ergeben sich 16 Kombinationen pro
 * Geländeart, die hier prozedural (pro Pixel) mit runden Kanten gezeichnet
 * werden. Ergebnis: organische Ufer, Wege und Strände ohne Handarbeit.
 */
import type { Season } from '../core/time';
import { isWaterTerrain, type Terrain, TILE } from '../core/worldmap';
import { hexToRgb, palette } from '../style/palette';

/** Eine Geländeebene (von unten nach oben gezeichnet). */
export interface TerrainLayer {
  key: string;
  members: ReadonlySet<Terrain>;
  fill: string;
  /** Farbband an der Innenkante (z. B. Schaum am Wasser) */
  inner?: { color: string; width: number };
  /** Weicher Schatten außerhalb der Kante (z. B. nasser Rand am Ufer) */
  outer?: { color: string; alpha: number; width: number };
  /** Optionales Muster (Pflastersteine) */
  pattern?: 'cobble' | 'speckle' | 'waves';
  /** Breite der weichen Kante (größer = verschwommener) */
  softness?: number;
}

export function terrainLayers(season: Season): TerrainLayer[] {
  const winter = season === 'winter';
  return [
    {
      key: 'sand',
      members: new Set<Terrain>(['sand', 'sea', 'deep']),
      fill: palette.sand.base,
      inner: { color: palette.sand.edge, width: 0.07 },
      pattern: 'speckle',
    },
    {
      key: 'path',
      members: new Set<Terrain>(['path']),
      fill: winter ? '#f2e9dc' : palette.path.base,
      inner: { color: winter ? '#e3d6c4' : palette.path.edge, width: 0.06 },
      pattern: 'speckle',
    },
    {
      key: 'plaza',
      members: new Set<Terrain>(['plaza']),
      fill: palette.plaza.base,
      inner: { color: palette.plaza.edge, width: 0.06 },
      pattern: 'cobble',
    },
    {
      key: 'water',
      members: new Set<Terrain>(['water', 'sea', 'deep']),
      fill: palette.water.base,
      inner: { color: palette.water.foam, width: 0.08 },
      outer: { color: '#6e5846', alpha: 0.16, width: 0.08 },
      pattern: 'waves',
    },
    {
      key: 'deep',
      members: new Set<Terrain>(['deep']),
      fill: palette.water.deep,
      softness: 0.18,
    },
  ];
}

/** Bits der vier Ecken einer Anzeige-Kachel. */
export const CORNER = { TL: 1, TR: 2, BR: 4, BL: 8 } as const;

/**
 * Berechnet für jede Anzeige-Kachel (Breite+1 × Höhe+1) die Ecken-Maske
 * einer Geländeebene. Ränder der Karte werden nach außen fortgesetzt.
 */
export function layerMasks(terrain: readonly Terrain[], width: number, height: number, members: ReadonlySet<Terrain>): number[][] {
  const at = (x: number, y: number) => {
    const cx = Math.min(width - 1, Math.max(0, x));
    const cy = Math.min(height - 1, Math.max(0, y));
    return members.has(terrain[cy * width + cx]) ? 1 : 0;
  };
  const rows: number[][] = [];
  for (let j = 0; j <= height; j++) {
    const row: number[] = [];
    for (let i = 0; i <= width; i++) {
      const mask =
        at(i - 1, j - 1) * CORNER.TL + at(i, j - 1) * CORNER.TR + at(i, j) * CORNER.BR + at(i - 1, j) * CORNER.BL;
      row.push(mask === 0 ? -1 : mask);
    }
    rows.push(row);
  }
  return rows;
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Abstand zwischen den Tileset-Frames (gegen Kanten-Flimmern). */
export const TILESET_PAD = 2;

/**
 * Zeichnet die 16 Masken-Varianten einer Ebene in ein Tileset-Canvas
 * (4 × 4 Frames, jeweils TILE*res Pixel mit Rand).
 */
export function renderTerrainTileset(layer: TerrainLayer, res: number): HTMLCanvasElement {
  const size = Math.round(TILE * res);
  const cell = size + TILESET_PAD * 2;
  const canvas = document.createElement('canvas');
  canvas.width = cell * 4;
  canvas.height = cell * 4;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const img = ctx.createImageData(canvas.width, canvas.height);
  const data = img.data;

  const fill = hexToRgb(layer.fill);
  const inner = layer.inner ? hexToRgb(layer.inner.color) : null;
  const outer = layer.outer ? hexToRgb(layer.outer.color) : null;
  const soft = layer.softness ?? 0.035;

  for (let mask = 1; mask < 16; mask++) {
    const ox = (mask % 4) * cell;
    const oy = Math.floor(mask / 4) * cell;
    const tl = mask & CORNER.TL ? 1 : 0;
    const tr = mask & CORNER.TR ? 1 : 0;
    const br = mask & CORNER.BR ? 1 : 0;
    const bl = mask & CORNER.BL ? 1 : 0;

    for (let py = 0; py < cell; py++) {
      for (let px = 0; px < cell; px++) {
        // Lokale Koordinate 0..1 (Rand wird auf die Kante geklemmt)
        const u = Math.min(1, Math.max(0, (px - TILESET_PAD + 0.5) / size));
        const v = Math.min(1, Math.max(0, (py - TILESET_PAD + 0.5) / size));
        // Bilineare Interpolation der Ecken → runde Konturen
        let f = tl * (1 - u) * (1 - v) + tr * u * (1 - v) + br * u * v + bl * (1 - u) * v;
        // Kleine, an den Kachelkanten verschwindende Welle für organische Ränder
        f += 0.045 * Math.sin(u * Math.PI * 4) * Math.sin(v * Math.PI * 4);

        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;

        // Weicher Außenschatten
        if (outer && layer.outer) {
          const s = smoothstep(0.5 - layer.outer.width, 0.5, f) * layer.outer.alpha;
          r = outer[0];
          g = outer[1];
          b = outer[2];
          a = s;
        }

        const cover = smoothstep(0.5 - soft / 2, 0.5 + soft / 2, f);
        if (cover > 0) {
          let cr = fill[0];
          let cg = fill[1];
          let cb = fill[2];
          if (inner && layer.inner) {
            const band = 1 - smoothstep(0.5 + layer.inner.width * 0.6, 0.5 + layer.inner.width, f);
            cr += (inner[0] - cr) * band;
            cg += (inner[1] - cg) * band;
            cb += (inner[2] - cb) * band;
          }
          const shade = patternShade(layer.pattern, u, v, px, py, mask);
          cr = Math.min(255, cr * shade);
          cg = Math.min(255, cg * shade);
          cb = Math.min(255, cb * shade);
          // „über“ den Außenschatten legen
          const na = cover + a * (1 - cover);
          r = (cr * cover + r * a * (1 - cover)) / na;
          g = (cg * cover + g * a * (1 - cover)) / na;
          b = (cb * cover + b * a * (1 - cover)) / na;
          a = na;
        }

        const idx = ((oy + py) * canvas.width + (ox + px)) * 4;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = Math.round(a * 255);
      }
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

/** Helligkeitsfaktor für Oberflächenmuster (kachelbar, weil periodisch in u/v). */
function patternShade(pattern: TerrainLayer['pattern'], u: number, v: number, px: number, py: number, mask: number): number {
  switch (pattern) {
    case 'cobble': {
      // 3 × 3 runde Pflastersteine pro Kachel, versetzt in jeder 2. Reihe
      const rows = 3;
      const ry = v * rows;
      const rowIdx = Math.floor(ry);
      const off = rowIdx % 2 === 0 ? 0 : 0.5;
      const rx = (u * rows + off) % rows;
      const fx = rx - Math.floor(rx) - 0.5;
      const fy = ry - rowIdx - 0.5;
      const d = Math.sqrt(fx * fx * 1.1 + fy * fy * 1.6);
      if (d > 0.46) return 0.9; // Fuge
      return 1.02 - d * 0.08;
    }
    case 'speckle': {
      const h = Math.sin(px * 12.9898 + py * 78.233 + mask * 3.1) * 43758.5453;
      const n = h - Math.floor(h);
      return n > 0.985 ? 0.9 : n < 0.01 ? 1.05 : 1;
    }
    case 'waves': {
      const w = Math.sin((u * 2 + v * 0.5) * Math.PI * 2) * Math.sin(v * Math.PI * 4);
      return w > 0.82 ? 1.06 : 1;
    }
    default:
      return 1;
  }
}

/** Saisonale Wiesenfarben */
export function grassColors(season: Season) {
  switch (season) {
    case 'fruehling':
      return { base: '#addf8f', light: '#c6eba8', dark: '#93cc79', tuft: '#80bf6a' };
    case 'sommer':
      return { base: palette.grass.base, light: palette.grass.light, dark: palette.grass.dark, tuft: palette.grass.tuft };
    case 'herbst':
      return { base: '#bcd88c', light: '#d4e6a6', dark: '#a6c47a', tuft: '#c9b46c' };
    case 'winter':
      return { base: '#eef5f8', light: '#ffffff', dark: '#dce9f0', tuft: '#c7dde6' };
  }
}

/**
 * Kachelbare Wiesentextur (4 × 4 Kacheln) mit sanften Farbflecken
 * und kleinen Grashalmen.
 */
export function renderGrassTexture(season: Season, res: number): HTMLCanvasElement {
  const units = TILE * 4;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(units * res);
  canvas.height = Math.round(units * res);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.scale(res, res);
  const c = grassColors(season);
  ctx.fillStyle = c.base;
  ctx.fillRect(0, 0, units, units);

  // Pseudozufall, damit die Textur stabil ist
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  // Wrap-around: alles neunfach zeichnen, damit die Textur nahtlos kachelt
  const wrapped = (draw: (x: number, y: number) => void, x: number, y: number) => {
    for (const dx of [-units, 0, units]) for (const dy of [-units, 0, units]) draw(x + dx, y + dy);
  };

  for (let i = 0; i < 14; i++) {
    const x = rnd() * units;
    const y = rnd() * units;
    const r = 20 + rnd() * 34;
    const col = rnd() > 0.5 ? c.light : c.dark;
    wrapped((px, py) => {
      const g = ctx.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(0, col + '88');
      g.addColorStop(1, col + '00');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }, x, y);
  }

  ctx.strokeStyle = c.tuft;
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  for (let i = 0; i < 46; i++) {
    const x = rnd() * units;
    const y = rnd() * units;
    wrapped((px, py) => {
      ctx.beginPath();
      ctx.moveTo(px - 3, py);
      ctx.quadraticCurveTo(px - 3.5, py - 4, px - 5, py - 6);
      ctx.moveTo(px, py);
      ctx.lineTo(px, py - 7);
      ctx.moveTo(px + 3, py);
      ctx.quadraticCurveTo(px + 3.5, py - 4, px + 5, py - 6);
      ctx.stroke();
    }, x, y);
  }
  return canvas;
}

/** Gibt es Wasser an einer Kachel? (für Glitzer-Effekte) */
export function isWater(t: Terrain): boolean {
  return isWaterTerrain(t);
}
