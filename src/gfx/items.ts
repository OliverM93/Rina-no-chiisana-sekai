/**
 * Symbole für Gegenstände – prozedural gezeichnet in einem 32×32-Kästchen.
 * Werden sowohl in der Welt (am Boden, an Bäumen) als auch in der Tasche genutzt.
 */
import { darken, lighten } from '../style/palette';
import { blob, type Ctx, ellipse, roundRect, shine } from './canvas';

export const ICON = 32;

type Draw = (ctx: Ctx) => void;

function fruit(color: string, leaf = '#7cc576', shape: 'rund' | 'birne' | 'pfirsich' = 'rund'): Draw {
  return (ctx) => {
    const o = darken(color, 0.3);
    if (shape === 'birne') {
      blob(ctx, [
        { x: 16, y: 21, r: 9 },
        { x: 16, y: 13, r: 6 },
      ], color, o, 1.6);
    } else {
      blob(ctx, [
        { x: 12.5, y: 18, r: 8.5 },
        { x: 19.5, y: 18, r: 8.5 },
      ], color, o, 1.6);
      if (shape === 'pfirsich') {
        ctx.strokeStyle = darken(color, 0.15);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(16, 11);
        ctx.quadraticCurveTo(13, 18, 16, 25);
        ctx.stroke();
      }
    }
    ctx.strokeStyle = '#8a6448';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(16, 11);
    ctx.lineTo(17, 6);
    ctx.stroke();
    ctx.fillStyle = leaf;
    ctx.beginPath();
    ctx.ellipse(21, 7, 4.2, 2.2, -0.4, 0, Math.PI * 2);
    ctx.fill();
    shine(ctx, 11, 15, 2.6, 0.75);
  };
}

const DRAW: Record<string, Draw> = {
  apfel: fruit('#f2787f'),
  birne: fruit('#d8e07a', '#7cc576', 'birne'),
  pfirsich: fruit('#ffb38f', '#7cc576', 'pfirsich'),

  herzmuschel: (ctx) => {
    const c = '#ffbfd0';
    ctx.beginPath();
    ctx.moveTo(16, 27);
    ctx.bezierCurveTo(1, 16, 7, 3, 16, 10);
    ctx.bezierCurveTo(25, 3, 31, 16, 16, 27);
    ctx.closePath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = darken(c, 0.3);
    ctx.stroke();
    ctx.fillStyle = c;
    ctx.fill();
    ctx.strokeStyle = lighten(c, 0.5);
    ctx.lineWidth = 1.3;
    for (const dx of [-5, 0, 5]) {
      ctx.beginPath();
      ctx.moveTo(16, 24);
      ctx.lineTo(16 + dx * 1.2, 12);
      ctx.stroke();
    }
  },
  jakobsmuschel: (ctx) => {
    const c = '#ffe1b8';
    ctx.beginPath();
    ctx.moveTo(16, 27);
    ctx.lineTo(5, 13);
    ctx.quadraticCurveTo(16, 1, 27, 13);
    ctx.closePath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = darken(c, 0.3);
    ctx.stroke();
    ctx.fillStyle = c;
    ctx.fill();
    roundRect(ctx, 12, 24, 8, 5, 2, c, darken(c, 0.3), 1);
    ctx.strokeStyle = darken(c, 0.18);
    ctx.lineWidth = 1.3;
    for (const x of [8, 12, 16, 20, 24]) {
      ctx.beginPath();
      ctx.moveTo(16, 25);
      ctx.lineTo(x, 10);
      ctx.stroke();
    }
  },
  schneckenhaus: (ctx) => {
    const c = '#f3d2e8';
    ellipse(ctx, 16, 17, 11, 10, c, darken(c, 0.3), 1.5);
    ctx.strokeStyle = darken(c, 0.25);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let t = 0; t < Math.PI * 5; t += 0.2) {
      const r = 9 - t * 0.55;
      const x = 16 + Math.cos(t) * r;
      const y = 17 + Math.sin(t) * r * 0.9;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    shine(ctx, 11, 12, 2.4, 0.8);
  },
  seestern: (ctx) => {
    const c = '#ffa07a';
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? 13 : 5.5;
      const x = 16 + Math.cos(a) * r;
      const y = 17 + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = darken(c, 0.3);
    ctx.stroke();
    ctx.fillStyle = c;
    ctx.fill();
    for (const [x, y] of [
      [16, 10],
      [11, 17],
      [21, 17],
      [16, 20],
    ]) {
      ellipse(ctx, x, y, 1.1, 1.1, lighten(c, 0.5));
    }
  },

  wildblumen: (ctx) => {
    ctx.strokeStyle = '#7fbb68';
    ctx.lineWidth = 1.8;
    for (const [x, y] of [
      [9, 10],
      [16, 7],
      [23, 10],
      [13, 14],
      [20, 14],
    ]) {
      ctx.beginPath();
      ctx.moveTo(16, 28);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    const colors = ['#ffb3c9', '#fff09a', '#c8b6e8', '#ffffff', '#ffcfa3'];
    [
      [9, 10],
      [16, 7],
      [23, 10],
      [13, 14],
      [20, 14],
    ].forEach(([x, y], i) => {
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2;
        ellipse(ctx, x + Math.cos(a) * 2.6, y + Math.sin(a) * 2.6, 2.2, 2.2, colors[i], darken(colors[i], 0.25), 0.4);
      }
      ellipse(ctx, x, y, 1.6, 1.6, '#ffd36b');
    });
    roundRect(ctx, 12, 21, 8, 5, 2, '#f497b0', darken('#f497b0', 0.3), 1);
  },

  ast: (ctx) => {
    const c = '#b5875f';
    ctx.lineCap = 'round';
    ctx.strokeStyle = darken(c, 0.3);
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(6, 25);
    ctx.lineTo(26, 8);
    ctx.moveTo(17, 16);
    ctx.lineTo(22, 22);
    ctx.stroke();
    ctx.strokeStyle = c;
    ctx.lineWidth = 4.2;
    ctx.stroke();
    ctx.fillStyle = '#8fd08a';
    ctx.beginPath();
    ctx.ellipse(25, 23, 3.5, 2, 0.6, 0, Math.PI * 2);
    ctx.fill();
  },
  stein: (ctx) => {
    const c = '#c9c4cf';
    ellipse(ctx, 16, 19, 11, 8, c, darken(c, 0.3), 1.5);
    shine(ctx, 12, 15, 3, 0.7);
  },
  glitzerstein: (ctx) => {
    const c = '#b9a6f2';
    ctx.beginPath();
    ctx.moveTo(16, 4);
    ctx.lineTo(26, 13);
    ctx.lineTo(21, 28);
    ctx.lineTo(11, 28);
    ctx.lineTo(6, 13);
    ctx.closePath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = darken(c, 0.3);
    ctx.stroke();
    ctx.fillStyle = c;
    ctx.fill();
    ctx.fillStyle = lighten(c, 0.45);
    ctx.beginPath();
    ctx.moveTo(16, 4);
    ctx.lineTo(19, 14);
    ctx.lineTo(13, 14);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#a8f0ff';
    ctx.beginPath();
    ctx.moveTo(19, 14);
    ctx.lineTo(21, 28);
    ctx.lineTo(16, 20);
    ctx.closePath();
    ctx.fill();
    ellipse(ctx, 25, 6, 1.5, 1.5, '#ffffff');
  },

  keks: (ctx) => {
    const c = '#e9c08a';
    ellipse(ctx, 16, 16, 11, 11, c, darken(c, 0.3), 1.5);
    ellipse(ctx, 16, 16, 7.5, 7.5, lighten(c, 0.15));
    for (const [x, y] of [
      [13, 13],
      [19, 14],
      [15, 19],
      [20, 19],
    ]) {
      ellipse(ctx, x, y, 1.6, 1.4, '#8a5a3c');
    }
    // Herz aus Zuckerguss
    ctx.fillStyle = '#ffc6d9';
    ctx.beginPath();
    ctx.moveTo(16, 18);
    ctx.bezierCurveTo(12, 15, 13.5, 11.5, 16, 13.5);
    ctx.bezierCurveTo(18.5, 11.5, 20, 15, 16, 18);
    ctx.fill();
  },
  strickschal: (ctx) => {
    const c = '#f7a8be';
    ctx.lineCap = 'round';
    ctx.strokeStyle = darken(c, 0.3);
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(6, 10);
    ctx.quadraticCurveTo(16, 18, 26, 10);
    ctx.moveTo(22, 13);
    ctx.lineTo(23, 27);
    ctx.stroke();
    ctx.strokeStyle = c;
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    for (const y of [18, 22]) {
      ctx.beginPath();
      ctx.moveTo(20.5, y);
      ctx.lineTo(25.5, y);
      ctx.stroke();
    }
  },
  'omas-foto': (ctx) => {
    roundRect(ctx, 5, 5, 22, 23, 2, '#ffffff', '#c9b6a8', 1.2);
    roundRect(ctx, 8, 8, 16, 14, 1, '#cfe9f7', null);
    ellipse(ctx, 16, 15, 4.2, 4.2, '#ffe3cf');
    blob(ctx, [{ x: 16, y: 13, r: 4.5 }], '#c8c2c8', null);
    ellipse(ctx, 16, 16, 3.4, 3, '#ffe3cf');
    roundRect(ctx, 11, 19, 10, 3, 1.5, '#c8b6e8', null);
  },
  keksrezept: (ctx) => {
    roundRect(ctx, 6, 4, 20, 25, 3, '#fff8e6', '#d9c4a0', 1.2);
    ctx.strokeStyle = '#c9b08f';
    ctx.lineWidth = 1.3;
    for (let y = 11; y < 26; y += 4) {
      ctx.beginPath();
      ctx.moveTo(9, y);
      ctx.lineTo(23, y);
      ctx.stroke();
    }
    ellipse(ctx, 21, 23, 4, 4, '#e9c08a', darken('#e9c08a', 0.3), 0.8);
  },
};

/** Zeichnet das Symbol eines Gegenstands (32×32 Einheiten). */
export function drawItemIcon(ctx: Ctx, itemId: string) {
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const draw = DRAW[itemId];
  if (draw) {
    draw(ctx);
    return;
  }
  // Platzhalter
  roundRect(ctx, 6, 6, 20, 20, 6, '#f3cad6', '#e27896', 1.2);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('?', 16, 17);
}

const urlCache = new Map<string, string>();

/** Symbol als Bild-URL für die Oberfläche. */
export function itemIconUrl(itemId: string, size = 64): string {
  const key = `${itemId}@${size}`;
  const cached = urlCache.get(key);
  if (cached) return cached;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d') as Ctx;
  ctx.scale(size / ICON, size / ICON);
  drawItemIcon(ctx, itemId);
  const url = canvas.toDataURL('image/png');
  urlCache.set(key, url);
  return url;
}

export function hasIcon(itemId: string): boolean {
  return itemId in DRAW;
}
