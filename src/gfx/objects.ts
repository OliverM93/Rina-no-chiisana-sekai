/**
 * Prozedural gezeichnete Objekte der Spielwelt.
 *
 * Jede Definition beschreibt Größe (in Welteinheiten), einen Ankerpunkt
 * (= Mitte der Unterkante der Grundfläche) und eine Zeichenfunktion.
 */
import type { Season } from '../core/time';
import { TILE } from '../core/worldmap';
import { darken, lighten, palette } from '../style/palette';
import { blob, type Circle, type Ctx, ellipse, fillWithOutline, groundShadow, roundRect, shine } from './canvas';

export interface SpriteDef {
  key: string;
  w: number;
  h: number;
  /** Ankerpunkt innerhalb der Textur (Welteinheiten) */
  ax: number;
  ay: number;
  draw: (ctx: Ctx) => void;
}

/** Kleiner deterministischer Zufall für Varianten */
function seeded(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function clipToCircles(ctx: Ctx, circles: Circle[]) {
  ctx.beginPath();
  for (const c of circles) {
    ctx.moveTo(c.x + c.r, c.y);
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
  }
  ctx.clip();
}

// ---------------------------------------------------------------------------
// Bäume & Natur
// ---------------------------------------------------------------------------

export const TREE_VARIANTS = 3;

export function treeDef(season: Season, variant: number): SpriteDef {
  const w = 150;
  const h = 196;
  const ax = 75;
  const ay = 178;
  return {
    key: `tree-${variant}`,
    w,
    h,
    ax,
    ay,
    draw: (ctx) => {
      const rnd = seeded(variant + 3);
      const [main, light, dark] = palette.leaves[season];
      groundShadow(ctx, ax, ay - 2, 42, 13, 0.2);

      // Stamm
      const bark = palette.wood.bark;
      ctx.beginPath();
      ctx.moveTo(ax - 13, ay);
      ctx.quadraticCurveTo(ax - 9, ay - 20, ax - 8, ay - 58);
      ctx.lineTo(ax + 8, ay - 58);
      ctx.quadraticCurveTo(ax + 9, ay - 20, ax + 13, ay);
      ctx.quadraticCurveTo(ax, ay + 4, ax - 13, ay);
      ctx.closePath();
      fillWithOutline(ctx, bark, darken(bark, 0.3), 2);
      ctx.strokeStyle = darken(bark, 0.15);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(ax + 3, ay - 8);
      ctx.quadraticCurveTo(ax + 1, ay - 22, ax + 4, ay - 34);
      ctx.stroke();

      // Krone
      const cy = ay - 98;
      const j = () => (rnd() - 0.5) * 8;
      const crown: Circle[] = [
        { x: ax + j(), y: cy - 14 + j(), r: 44 },
        { x: ax - 38 + j(), y: cy + 14 + j(), r: 30 },
        { x: ax + 38 + j(), y: cy + 14 + j(), r: 30 },
        { x: ax - 24 + j(), y: cy - 30 + j(), r: 30 },
        { x: ax + 26 + j(), y: cy - 28 + j(), r: 29 },
        { x: ax + j(), y: cy + 26, r: 34 },
      ];
      if (season === 'winter') {
        // Kahle Äste mit etwas Restlaub & Schnee
        ctx.strokeStyle = bark;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(ax, ay - 50);
        ctx.lineTo(ax, cy - 10);
        ctx.moveTo(ax, cy + 20);
        ctx.quadraticCurveTo(ax - 20, cy, ax - 38, cy - 16);
        ctx.moveTo(ax, cy + 6);
        ctx.quadraticCurveTo(ax + 22, cy - 8, ax + 36, cy - 26);
        ctx.stroke();
      }
      blob(ctx, crown, main, darken(main, 0.3), 2.4);
      ctx.save();
      clipToCircles(ctx, crown);
      // Schatten unten, Licht oben links
      ctx.fillStyle = dark;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.ellipse(ax + 6, cy + 46, 78, 34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = light;
      for (const c of [
        { x: ax - 18, y: cy - 34, r: 18 },
        { x: ax - 40, y: cy + 4, r: 12 },
        { x: ax + 16, y: cy - 40, r: 12 },
      ]) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Saison-Details
      if (season === 'fruehling') {
        for (let i = 0; i < 14; i++) {
          const x = ax - 50 + rnd() * 100;
          const y = cy - 50 + rnd() * 90;
          ellipse(ctx, x, y, 3.4, 3.4, rnd() > 0.4 ? '#ffc8dc' : '#ffffff', '#f19ab8', 0.6);
        }
      } else if (season === 'herbst') {
        for (let i = 0; i < 12; i++) {
          const x = ax - 50 + rnd() * 100;
          const y = cy - 46 + rnd() * 86;
          ellipse(ctx, x, y, 4, 3, rnd() > 0.5 ? '#e9775f' : '#f6d26c');
        }
      } else if (season === 'winter') {
        blob(
          ctx,
          [
            { x: ax - 10, y: cy - 52, r: 18 },
            { x: ax + 16, y: cy - 50, r: 16 },
            { x: ax - 34, y: cy - 36, r: 13 },
            { x: ax + 36, y: cy - 30, r: 12 },
          ],
          '#ffffff',
          '#cfe0ea',
          1.6,
        );
      } else {
        ctx.strokeStyle = lighten(main, 0.3);
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
          const x = ax - 40 + rnd() * 80;
          const y = cy - 30 + rnd() * 60;
          ctx.beginPath();
          ctx.arc(x, y, 6, Math.PI * 1.1, Math.PI * 1.6);
          ctx.stroke();
        }
      }
    },
  };
}

export function pineDef(season: Season, variant: number): SpriteDef {
  const w = 128;
  const h = 204;
  const ax = 64;
  const ay = 188;
  return {
    key: `pine-${variant}`,
    w,
    h,
    ax,
    ay,
    draw: (ctx) => {
      const main = season === 'winter' ? '#6aa58a' : '#6fb88f';
      const light = '#98d4aa';
      const dark = '#4e9473';
      groundShadow(ctx, ax, ay - 2, 36, 12, 0.2);
      roundRect(ctx, ax - 7, ay - 30, 14, 30, 4, palette.wood.bark, darken(palette.wood.bark, 0.3), 2);
      const tiers = [
        { y: ay - 22, half: 54, height: 66 },
        { y: ay - 66, half: 44, height: 60 },
        { y: ay - 106, half: 32, height: 56 },
      ];
      const scale = 1 + (variant % 2) * 0.06;
      for (const t of tiers) {
        const half = t.half * scale;
        const top = t.y - t.height;
        ctx.beginPath();
        ctx.moveTo(ax, top);
        ctx.quadraticCurveTo(ax + half * 0.35, top + t.height * 0.3, ax + half, t.y - 6);
        ctx.quadraticCurveTo(ax + half * 0.98, t.y + 4, ax + half * 0.6, t.y + 1);
        ctx.quadraticCurveTo(ax + half * 0.3, t.y + 6, ax, t.y + 2);
        ctx.quadraticCurveTo(ax - half * 0.3, t.y + 6, ax - half * 0.6, t.y + 1);
        ctx.quadraticCurveTo(ax - half * 0.98, t.y + 4, ax - half, t.y - 6);
        ctx.quadraticCurveTo(ax - half * 0.35, top + t.height * 0.3, ax, top);
        ctx.closePath();
        fillWithOutline(ctx, main, darken(main, 0.32), 2.2);
        ctx.save();
        ctx.clip();
        ctx.fillStyle = dark;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.ellipse(ax + half * 0.4, t.y + 2, half * 0.9, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = light;
        ctx.beginPath();
        ctx.ellipse(ax - half * 0.28, top + t.height * 0.55, 8, 16, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        if (season === 'winter') {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(ax, top + 2);
          ctx.quadraticCurveTo(ax + half * 0.3, top + t.height * 0.35, ax + half * 0.5, top + t.height * 0.45);
          ctx.quadraticCurveTo(ax, top + t.height * 0.55, ax - half * 0.5, top + t.height * 0.45);
          ctx.quadraticCurveTo(ax - half * 0.3, top + t.height * 0.35, ax, top + 2);
          ctx.fill();
        }
      }
    },
  };
}

export function bushDef(season: Season): SpriteDef {
  const w = 88;
  const h = 78;
  const ax = 44;
  const ay = 66;
  return {
    key: 'bush',
    w,
    h,
    ax,
    ay,
    draw: (ctx) => {
      const [main, light] = palette.leaves[season === 'herbst' ? 'sommer' : season];
      groundShadow(ctx, ax, ay - 2, 32, 10, 0.2);
      const circles: Circle[] = [
        { x: ax - 16, y: ay - 18, r: 17 },
        { x: ax + 16, y: ay - 18, r: 17 },
        { x: ax, y: ay - 30, r: 20 },
        { x: ax, y: ay - 14, r: 18 },
      ];
      blob(ctx, circles, main, darken(main, 0.3), 2.2);
      ctx.save();
      clipToCircles(ctx, circles);
      ctx.fillStyle = light;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.ellipse(ax - 10, ay - 38, 12, 7, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      const dot = season === 'winter' ? '#ffffff' : season === 'herbst' ? '#e8616f' : season === 'fruehling' ? '#fff3a8' : '#ffb3c9';
      const rnd = seeded(11);
      for (let i = 0; i < 7; i++) {
        ellipse(ctx, ax - 24 + rnd() * 48, ay - 38 + rnd() * 26, 3.2, 3.2, dot, darken(dot, 0.25), 0.7);
      }
    },
  };
}

export function rockDef(): SpriteDef {
  const w = 84;
  const h = 66;
  const ax = 42;
  const ay = 56;
  return {
    key: 'rock',
    w,
    h,
    ax,
    ay,
    draw: (ctx) => {
      groundShadow(ctx, ax, ay - 1, 32, 9, 0.2);
      const c = palette.stone.base;
      ctx.beginPath();
      ctx.moveTo(ax - 28, ay - 4);
      ctx.quadraticCurveTo(ax - 34, ay - 30, ax - 10, ay - 40);
      ctx.quadraticCurveTo(ax + 14, ay - 48, ax + 26, ay - 30);
      ctx.quadraticCurveTo(ax + 36, ay - 12, ax + 24, ay - 2);
      ctx.quadraticCurveTo(ax, ay + 4, ax - 28, ay - 4);
      ctx.closePath();
      fillWithOutline(ctx, c, darken(c, 0.3), 2.2);
      ctx.save();
      ctx.clip();
      ctx.fillStyle = palette.stone.dark;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.ellipse(ax + 8, ay + 2, 34, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      shine(ctx, ax - 10, ay - 30, 8, 0.7);
      ellipse(ctx, ax + 12, ay - 22, 5, 3, '#a9d39a');
    },
  };
}

// ---------------------------------------------------------------------------
// Gebäude
// ---------------------------------------------------------------------------

/** Fensterpositionen relativ zum Anker (für das nächtliche Fensterlicht). */
export const HOUSE_WINDOWS = [
  { x: -90, y: -64, w: 54, h: 46 },
  { x: 90, y: -64, w: 54, h: 46 },
];

export function houseDef(roofColor: string, key: string): SpriteDef {
  const w = 5 * TILE + 24;
  const h = 330;
  const ax = w / 2;
  const ay = 314;
  return {
    key,
    w,
    h,
    ax,
    ay,
    draw: (ctx) => {
      const C = ax;
      const B = ay;
      groundShadow(ctx, C, B - 4, 170, 20, 0.22);

      // Schornstein (hinter dem Dach)
      roundRect(ctx, C + 64, B - 300, 34, 70, [6, 6, 0, 0], '#e9a28f', darken('#e9a28f', 0.3), 2);
      roundRect(ctx, C + 58, B - 306, 46, 14, 6, '#f2b8a6', darken('#e9a28f', 0.3), 2);

      // Wand
      const wall = palette.wall.cream;
      roundRect(ctx, C - 144, B - 112, 288, 108, [4, 4, 10, 10], wall, darken(wall, 0.3), 2.2);
      // Holzsockel
      roundRect(ctx, C - 144, B - 24, 288, 20, [0, 0, 10, 10], palette.wood.light, darken(palette.wood.light, 0.3), 1.8);
      // Fachwerk-Andeutung
      ctx.strokeStyle = darken(wall, 0.12);
      ctx.lineWidth = 2;
      for (const x of [C - 122, C - 56, C + 56, C + 122]) {
        ctx.beginPath();
        ctx.moveTo(x, B - 104);
        ctx.lineTo(x, B - 28);
        ctx.stroke();
      }

      // Fenster mit Blumenkästen
      for (const win of HOUSE_WINDOWS) {
        const x = C + win.x - win.w / 2;
        const y = B + win.y - win.h / 2;
        roundRect(ctx, x - 4, y - 4, win.w + 8, win.h + 8, 12, palette.window.frame, darken(wall, 0.35), 2);
        roundRect(ctx, x, y, win.w, win.h, 9, palette.window.glass, null);
        ctx.strokeStyle = palette.window.frame;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x + win.w / 2, y);
        ctx.lineTo(x + win.w / 2, y + win.h);
        ctx.moveTo(x, y + win.h / 2);
        ctx.lineTo(x + win.w, y + win.h / 2);
        ctx.stroke();
        shine(ctx, x + 12, y + 10, 6, 0.8);
        // Blumenkasten
        roundRect(ctx, x - 6, y + win.h + 4, win.w + 12, 12, 5, palette.wood.base, darken(palette.wood.base, 0.3), 1.6);
        const colors = ['#ff9fbd', '#fff09a', '#ffffff', '#c8b6e8'];
        for (let i = 0; i < 6; i++) {
          const fx = x - 2 + i * ((win.w + 4) / 5);
          ellipse(ctx, fx, y + win.h + 3, 4.2, 4.2, colors[i % colors.length], '#d97a99', 0.7);
          ellipse(ctx, fx, y + win.h + 3, 1.5, 1.5, '#ffd36b');
        }
      }

      // Tür
      const dw = 48;
      ctx.beginPath();
      ctx.moveTo(C - dw / 2, B - 8);
      ctx.lineTo(C - dw / 2, B - 64);
      ctx.arc(C, B - 64, dw / 2, Math.PI, 0);
      ctx.lineTo(C + dw / 2, B - 8);
      ctx.closePath();
      fillWithOutline(ctx, palette.door.base, darken(palette.door.base, 0.35), 2.2);
      ctx.strokeStyle = palette.door.dark;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(C, B - 86);
      ctx.lineTo(C, B - 10);
      ctx.stroke();
      ellipse(ctx, C, B - 70, 8, 8, palette.window.glass, darken(palette.door.base, 0.35), 1.4);
      ellipse(ctx, C + 14, B - 38, 3, 3, '#ffd36b', '#c99a3a', 0.8);
      // Fußmatte / Stufe
      roundRect(ctx, C - 34, B - 10, 68, 12, 6, palette.stone.light, darken(palette.stone.light, 0.3), 1.6);

      // Dach
      const roof = roofColor;
      const eave = B - 104;
      const ridge = B - 268;
      ctx.beginPath();
      ctx.moveTo(C - 168, eave);
      ctx.quadraticCurveTo(C - 172, eave - 8, C - 160, eave - 22);
      ctx.lineTo(C - 112, ridge + 14);
      ctx.quadraticCurveTo(C - 106, ridge, C - 90, ridge);
      ctx.lineTo(C + 90, ridge);
      ctx.quadraticCurveTo(C + 106, ridge, C + 112, ridge + 14);
      ctx.lineTo(C + 160, eave - 22);
      ctx.quadraticCurveTo(C + 172, eave - 8, C + 168, eave);
      ctx.closePath();
      fillWithOutline(ctx, roof, darken(roof, 0.3), 2.4);
      ctx.save();
      ctx.clip();
      // Schindel-Reihen (Bögen)
      ctx.strokeStyle = darken(roof, 0.12);
      ctx.lineWidth = 2.2;
      for (let row = 0; row < 7; row++) {
        const y = ridge + 26 + row * 24;
        const offset = row % 2 === 0 ? 0 : 13;
        ctx.beginPath();
        for (let x = C - 180 + offset; x < C + 180; x += 26) {
          ctx.moveTo(x, y);
          ctx.arc(x + 13, y, 13, Math.PI, 0, true);
        }
        ctx.stroke();
      }
      // Licht oben, Schatten unten
      ctx.fillStyle = lighten(roof, 0.35);
      ctx.globalAlpha = 0.6;
      ctx.fillRect(C - 120, ridge, 240, 10);
      ctx.globalAlpha = 1;
      ctx.restore();
      // Traufe vorne
      roundRect(ctx, C - 170, eave - 10, 340, 14, 7, darken(roof, 0.1), darken(roof, 0.35), 2);
      // Herzfenster im Dach
      const hx = C;
      const hy = ridge + 74;
      ctx.beginPath();
      ctx.moveTo(hx, hy + 16);
      ctx.bezierCurveTo(hx - 26, hy - 2, hx - 14, hy - 22, hx, hy - 10);
      ctx.bezierCurveTo(hx + 14, hy - 22, hx + 26, hy - 2, hx, hy + 16);
      ctx.closePath();
      fillWithOutline(ctx, palette.window.glass, palette.window.frame, 3);
      shine(ctx, hx - 7, hy - 8, 3.5, 0.9);
    },
  };
}

/** Herzfenster-Position relativ zum Anker (für Nachtlicht) */
export const HOUSE_HEART_WINDOW = { x: 0, y: -268 + 74 };

export function plotAreaDef(): SpriteDef {
  const w = 5 * TILE + 16;
  const h = 3 * TILE + 16;
  return {
    key: 'plot-area',
    w,
    h,
    ax: w / 2,
    ay: h - 8,
    draw: (ctx) => {
      const x0 = 14;
      const y0 = 14;
      const x1 = w - 14;
      const y1 = h - 14;
      ctx.strokeStyle = 'rgba(160, 120, 90, 0.55)';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 9]);
      ctx.beginPath();
      ctx.roundRect(x0, y0, x1 - x0, y1 - y0, 18);
      ctx.stroke();
      ctx.setLineDash([]);
      for (const [x, y] of [
        [x0, y0],
        [x1, y0],
        [x0, y1],
        [x1, y1],
      ]) {
        roundRect(ctx, x - 4, y - 10, 8, 14, 3, palette.wood.base, darken(palette.wood.base, 0.3), 1.4);
      }
    },
  };
}

export function signDef(label: string, key: string): SpriteDef {
  const w = 96;
  const h = 92;
  const ax = 48;
  const ay = 80;
  return {
    key,
    w,
    h,
    ax,
    ay,
    draw: (ctx) => {
      groundShadow(ctx, ax, ay - 1, 20, 6, 0.2);
      roundRect(ctx, ax - 4, ay - 46, 8, 46, 3, palette.wood.base, darken(palette.wood.base, 0.3), 1.8);
      roundRect(ctx, ax - 40, ay - 74, 80, 36, 10, palette.wood.light, darken(palette.wood.light, 0.35), 2);
      ctx.fillStyle = darken(palette.wood.dark, 0.25);
      ctx.font = '700 15px "Nunito Variable", "Nunito", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, ax, ay - 55);
      ellipse(ctx, ax + 30, ay - 68, 4, 4, '#ffb3c9', '#e27896', 0.8);
    },
  };
}

/** Briefkasten; `full` = Fähnchen oben und ein Brief schaut heraus. */
export function mailboxDef(full = false): SpriteDef {
  const w = 60;
  const h = 96;
  const ax = 30;
  const ay = 84;
  return {
    key: full ? 'mailbox-full' : 'mailbox',
    w,
    h,
    ax,
    ay,
    draw: (ctx) => {
      groundShadow(ctx, ax, ay - 2, 18, 6, 0.2);
      roundRect(ctx, ax - 4, ay - 40, 8, 40, 3, palette.wood.base, darken(palette.wood.base, 0.3), 1.8);
      const c = palette.roof.mint;
      ctx.beginPath();
      ctx.moveTo(ax - 20, ay - 38);
      ctx.lineTo(ax - 20, ay - 62);
      ctx.arc(ax, ay - 62, 20, Math.PI, 0);
      ctx.lineTo(ax + 20, ay - 38);
      ctx.closePath();
      fillWithOutline(ctx, c, darken(c, 0.32), 2);
      roundRect(ctx, ax - 12, ay - 60, 24, 6, 3, darken(c, 0.25), null);
      shine(ctx, ax - 10, ay - 72, 4, 0.7);
      // Fähnchen: oben = neue Post, sonst eingeklappt
      if (full) {
        roundRect(ctx, ax + 18, ay - 76, 4, 26, 2, '#f08a9c', darken('#f08a9c', 0.3), 1.2);
        roundRect(ctx, ax + 20, ay - 78, 14, 10, [2, 5, 5, 2], '#f08a9c', darken('#f08a9c', 0.3), 1.2);
        // Brief schaut heraus
        ctx.save();
        ctx.translate(ax - 2, ay - 60);
        ctx.rotate(-0.12);
        roundRect(ctx, -9, -8, 18, 11, 2, '#ffffff', '#d9c4b0', 1);
        ctx.strokeStyle = '#e8a0b6';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-9, -8);
        ctx.lineTo(0, -1);
        ctx.lineTo(9, -8);
        ctx.stroke();
        ctx.restore();
      } else {
        roundRect(ctx, ax + 18, ay - 52, 22, 4, 2, '#f08a9c', darken('#f08a9c', 0.3), 1.2);
      }
      // Herz
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      const hx = ax;
      const hy = ay - 48;
      ctx.moveTo(hx, hy + 5);
      ctx.bezierCurveTo(hx - 8, hy, hx - 5, hy - 7, hx, hy - 3);
      ctx.bezierCurveTo(hx + 5, hy - 7, hx + 8, hy, hx, hy + 5);
      ctx.fill();
    },
  };
}

export function boardDef(): SpriteDef {
  const w = 2 * TILE + 16;
  const h = 132;
  const ax = w / 2;
  const ay = 118;
  return {
    key: 'board',
    w,
    h,
    ax,
    ay,
    draw: (ctx) => {
      groundShadow(ctx, ax, ay - 2, 58, 9, 0.2);
      const wood = palette.wood.base;
      roundRect(ctx, ax - 52, ay - 64, 10, 64, 3, wood, darken(wood, 0.3), 1.8);
      roundRect(ctx, ax + 42, ay - 64, 10, 64, 3, wood, darken(wood, 0.3), 1.8);
      roundRect(ctx, ax - 60, ay - 104, 120, 66, 10, palette.wood.light, darken(wood, 0.35), 2.2);
      roundRect(ctx, ax - 52, ay - 96, 104, 50, 6, '#f7ecd8', null);
      // Kleines Dach
      ctx.beginPath();
      ctx.moveTo(ax - 68, ay - 102);
      ctx.quadraticCurveTo(ax, ay - 128, ax + 68, ay - 102);
      ctx.quadraticCurveTo(ax, ay - 112, ax - 68, ay - 102);
      ctx.closePath();
      fillWithOutline(ctx, palette.roof.coral, darken(palette.roof.coral, 0.3), 2);
      // Zettel
      const notes = [
        { x: ax - 44, y: ay - 92, w: 30, h: 36, c: '#ffffff', pin: '#f497b0', r: -0.06 },
        { x: ax - 8, y: ay - 90, w: 26, h: 22, c: '#fff1a8', pin: '#8fd1c0', r: 0.08 },
        { x: ax + 22, y: ay - 92, w: 24, h: 30, c: '#dff1ff', pin: '#c8b6e8', r: -0.04 },
        { x: ax - 6, y: ay - 64, w: 22, h: 16, c: '#ffe0ea', pin: '#ffd36b', r: 0.05 },
      ];
      for (const n of notes) {
        ctx.save();
        ctx.translate(n.x + n.w / 2, n.y + n.h / 2);
        ctx.rotate(n.r);
        roundRect(ctx, -n.w / 2, -n.h / 2, n.w, n.h, 2, n.c, 'rgba(120,90,100,0.35)', 0.8);
        ctx.strokeStyle = 'rgba(120, 90, 100, 0.35)';
        ctx.lineWidth = 1.2;
        for (let i = 1; i < Math.floor(n.h / 7); i++) {
          ctx.beginPath();
          ctx.moveTo(-n.w / 2 + 4, -n.h / 2 + 4 + i * 6);
          ctx.lineTo(n.w / 2 - 4, -n.h / 2 + 4 + i * 6);
          ctx.stroke();
        }
        ellipse(ctx, 0, -n.h / 2 + 2, 2.6, 2.6, n.pin, darken(n.pin, 0.3), 0.6);
        ctx.restore();
      }
    },
  };
}

/** Lampenposition relativ zum Anker (für den Lichtschein). */
export const LANTERN_LIGHT = { x: 0, y: -104 };

export function lanternDef(): SpriteDef {
  const w = 52;
  const h = 140;
  const ax = 26;
  const ay = 130;
  return {
    key: 'lantern',
    w,
    h,
    ax,
    ay,
    draw: (ctx) => {
      groundShadow(ctx, ax, ay - 2, 14, 5, 0.2);
      const metal = '#8d8299';
      roundRect(ctx, ax - 9, ay - 10, 18, 10, 4, metal, darken(metal, 0.3), 1.6);
      roundRect(ctx, ax - 3.5, ay - 92, 7, 84, 3, metal, darken(metal, 0.3), 1.6);
      // Lampe
      roundRect(ctx, ax - 13, ay - 120, 26, 28, 8, palette.window.glow, darken(metal, 0.2), 2);
      ctx.strokeStyle = metal;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ax, ay - 120);
      ctx.lineTo(ax, ay - 92);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ax - 17, ay - 118);
      ctx.quadraticCurveTo(ax, ay - 136, ax + 17, ay - 118);
      ctx.closePath();
      fillWithOutline(ctx, metal, darken(metal, 0.3), 1.6);
      ellipse(ctx, ax, ay - 131, 3.5, 3.5, metal, darken(metal, 0.3), 1);
      shine(ctx, ax - 6, ay - 112, 3, 0.8);
    },
  };
}

export function benchDef(): SpriteDef {
  const w = 2 * TILE + 12;
  const h = 92;
  const ax = w / 2;
  const ay = 78;
  return {
    key: 'bench',
    w,
    h,
    ax,
    ay,
    draw: (ctx) => {
      groundShadow(ctx, ax, ay - 2, 58, 9, 0.2);
      const wood = palette.wood.light;
      const dark = darken(wood, 0.32);
      // Beine
      for (const x of [ax - 46, ax + 40]) roundRect(ctx, x, ay - 24, 7, 24, 3, palette.wood.base, dark, 1.6);
      // Lehne
      for (const x of [ax - 50, ax + 44]) roundRect(ctx, x, ay - 62, 7, 34, 3, palette.wood.base, dark, 1.6);
      roundRect(ctx, ax - 58, ay - 64, 116, 12, 6, wood, dark, 2);
      roundRect(ctx, ax - 58, ay - 48, 116, 10, 5, wood, dark, 2);
      // Sitzfläche
      roundRect(ctx, ax - 60, ay - 32, 120, 14, 6, lighten(wood, 0.1), dark, 2);
      shine(ctx, ax - 40, ay - 60, 4, 0.6);
    },
  };
}

export function fountainDef(): SpriteDef {
  const w = 3 * TILE + 24;
  const h = 196;
  const ax = w / 2;
  const ay = 168;
  return {
    key: 'fountain',
    w,
    h,
    ax,
    ay,
    draw: (ctx) => {
      const stone = palette.stone.light;
      const dark = darken(stone, 0.3);
      groundShadow(ctx, ax, ay - 8, 100, 18, 0.2);
      const cy = ay - 64;
      // Beckenrand (Seitenfläche)
      ctx.beginPath();
      ctx.ellipse(ax, cy + 20, 94, 46, 0, 0, Math.PI);
      ctx.lineTo(ax - 94, cy);
      ctx.ellipse(ax, cy, 94, 46, 0, Math.PI, 0, true);
      ctx.closePath();
      fillWithOutline(ctx, palette.stone.base, dark, 2.2);
      // Oberkante
      ellipse(ctx, ax, cy, 94, 46, stone, dark, 2.2);
      // Wasser
      ellipse(ctx, ax, cy + 2, 80, 36, palette.water.base, darken(palette.water.base, 0.25), 1.5);
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 2;
      for (const r of [24, 46]) {
        ctx.beginPath();
        ctx.ellipse(ax, cy + 4, r, r * 0.45, 0, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
      }
      // Säule & obere Schale
      roundRect(ctx, ax - 10, cy - 52, 20, 56, 6, stone, dark, 2);
      ellipse(ctx, ax, cy - 52, 32, 12, stone, dark, 2);
      ellipse(ctx, ax, cy - 53, 25, 8, palette.water.base);
      // Wasserstrahl
      ctx.strokeStyle = 'rgba(200, 240, 255, 0.95)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ax, cy - 54);
      ctx.quadraticCurveTo(ax, cy - 82, ax, cy - 76);
      ctx.moveTo(ax - 2, cy - 74);
      ctx.quadraticCurveTo(ax - 20, cy - 74, ax - 26, cy - 52);
      ctx.moveTo(ax + 2, cy - 74);
      ctx.quadraticCurveTo(ax + 20, cy - 74, ax + 26, cy - 52);
      ctx.stroke();
      ellipse(ctx, ax, cy - 80, 5, 5, '#ffffff');
      shine(ctx, ax - 60, cy - 14, 6, 0.6);
    },
  };
}

/** Brücke: Belag + hinteres Geländer (hinter der Figur) */
export function bridgeDeckDef(): SpriteDef {
  const w = 3 * TILE + 32;
  const h = TILE + 44;
  const ax = w / 2;
  const ay = 34 + TILE;
  return {
    key: 'bridge-deck',
    w,
    h,
    ax,
    ay,
    draw: (ctx) => {
      const top = 34;
      const bottom = top + TILE;
      const wood = palette.wood.light;
      const dark = darken(wood, 0.32);
      // Schatten aufs Wasser
      ctx.fillStyle = 'rgba(40, 80, 110, 0.18)';
      ctx.fillRect(10, bottom - 2, w - 20, 10);
      // Bohlen
      roundRect(ctx, 6, top + 4, w - 12, TILE - 2, 8, wood, dark, 2);
      ctx.strokeStyle = darken(wood, 0.14);
      ctx.lineWidth = 2;
      for (let x = 22; x < w - 12; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, top + 8);
        ctx.lineTo(x, bottom - 2);
        ctx.stroke();
      }
      // hinteres Geländer
      for (let x = 12; x <= w - 18; x += (w - 30) / 4) roundRect(ctx, x, top - 22, 8, 30, 3, palette.wood.base, dark, 1.6);
      roundRect(ctx, 6, top - 26, w - 12, 10, 5, palette.wood.base, dark, 1.8);
    },
  };
}

/** Vorderes Geländer (vor der Figur gezeichnet) */
export function bridgeRailDef(): SpriteDef {
  const w = 3 * TILE + 32;
  const h = 48;
  const ax = w / 2;
  const ay = 32;
  return {
    key: 'bridge-rail',
    w,
    h,
    ax,
    ay,
    draw: (ctx) => {
      const dark = darken(palette.wood.light, 0.32);
      for (let x = 12; x <= w - 18; x += (w - 30) / 4) roundRect(ctx, x, 10, 8, 30, 3, palette.wood.base, dark, 1.6);
      roundRect(ctx, 6, 6, w - 12, 10, 5, palette.wood.light, dark, 1.8);
    },
  };
}

/** Verkaufskiste vor Linas Haus */
export function sellboxDef(): SpriteDef {
  const w = 72;
  const h = 80;
  const ax = 36;
  const ay = 70;
  return {
    key: 'sellbox',
    w,
    h,
    ax,
    ay,
    draw: (ctx) => {
      groundShadow(ctx, ax, ay - 2, 30, 8, 0.2);
      const wood = palette.wood.light;
      const dark = darken(wood, 0.32);
      // Kiste
      roundRect(ctx, ax - 28, ay - 40, 56, 38, 7, wood, dark, 2);
      ctx.strokeStyle = darken(wood, 0.15);
      ctx.lineWidth = 2;
      for (const y of [ay - 28, ay - 15]) {
        ctx.beginPath();
        ctx.moveTo(ax - 26, y);
        ctx.lineTo(ax + 26, y);
        ctx.stroke();
      }
      // Deckel
      roundRect(ctx, ax - 31, ay - 50, 62, 13, 6, palette.wood.base, darken(palette.wood.base, 0.3), 2);
      // Sternchen-Schild
      const sx = ax;
      const sy = ay - 22;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const r = i % 2 === 0 ? 10 : 4.5;
        const x = sx + Math.cos(a) * r;
        const y = sy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      fillWithOutline(ctx, '#ffe39b', '#d9a94a', 1.4);
      shine(ctx, ax - 18, ay - 45, 4, 0.6);
    },
  };
}
