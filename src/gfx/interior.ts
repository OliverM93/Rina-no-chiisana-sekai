/**
 * Muster für Tapeten und Böden (Canvas). Dieselbe Zeichnung dient als
 * Textur im Zimmer und als Symbol im Katalog.
 */
import type { SurfaceDef } from '../data/furniture';
import { darken, lighten } from '../style/palette';

/** Zeichnet ein Muster auf ein Quadrat der Größe `s` (kachelbar). */
export function drawPattern(ctx: CanvasRenderingContext2D, def: SurfaceDef, s: number) {
  const { color, accent } = def;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, s, s);
  switch (def.pattern) {
    case 'uni': {
      ctx.fillStyle = accent;
      for (let i = 0; i < 40; i++) {
        const x = (i * 53) % s;
        const y = (i * 97) % s;
        ctx.globalAlpha = 0.25;
        ctx.fillRect(x, y, 2, 2);
      }
      ctx.globalAlpha = 1;
      break;
    }
    case 'streifen': {
      ctx.fillStyle = accent;
      for (let x = 0; x < s; x += s / 8) ctx.fillRect(x, 0, s / 16, s);
      break;
    }
    case 'shoji': {
      // Holzgitter über Papier
      ctx.fillStyle = lighten(color, 0.3);
      ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = accent;
      const bar = s / 40;
      for (let i = 0; i <= 4; i++) ctx.fillRect((i * s) / 4 - bar / 2, 0, bar, s);
      for (let j = 0; j <= 6; j++) ctx.fillRect(0, (j * s) / 6 - bar / 2, s, bar);
      ctx.fillStyle = darken(accent, 0.2);
      ctx.fillRect(0, s - s / 10, s, s / 10); // Fußleiste
      break;
    }
    case 'sakura': {
      const blossom = (cx: number, cy: number, r: number) => {
        ctx.fillStyle = accent;
        for (let k = 0; k < 5; k++) {
          const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
          ctx.beginPath();
          ctx.ellipse(cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.55, r * 0.45, r * 0.32, a, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = darken(accent, 0.25);
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.18, 0, Math.PI * 2);
        ctx.fill();
      };
      const pts: Array<[number, number, number]> = [[0.2, 0.2, 0.09], [0.7, 0.35, 0.07], [0.4, 0.7, 0.08], [0.9, 0.85, 0.06], [0.05, 0.6, 0.05]];
      for (const [x, y, r] of pts) for (const [ox, oy] of [[0, 0], [s, 0], [0, s], [-s, 0], [0, -s]]) blossom(x * s + ox, y * s + oy, r * s);
      break;
    }
    case 'wellen': {
      ctx.strokeStyle = accent;
      ctx.lineWidth = s / 64;
      const r = s / 8;
      for (let row = -1; row <= 8; row++) {
        for (let col = -1; col <= 4; col++) {
          const cx = col * r * 2 + (row % 2 ? r : 0);
          const cy = row * r * 0.5;
          for (let k = 3; k >= 1; k--) {
            ctx.fillStyle = k % 2 ? color : lighten(accent, 0.6);
            ctx.beginPath();
            ctx.arc(cx, cy + r, (r * k) / 3, Math.PI, 0);
            ctx.fill();
            ctx.stroke();
          }
        }
      }
      break;
    }
    case 'dielen': {
      const planks = 6;
      const h = s / planks;
      for (let i = 0; i < planks; i++) {
        ctx.fillStyle = i % 2 ? color : lighten(color, 0.05);
        ctx.fillRect(0, i * h, s, h);
        ctx.fillStyle = darken(color, 0.18);
        ctx.fillRect(0, i * h, s, Math.max(1, s / 200));
        const cut = ((i * 37) % 10) / 10;
        ctx.fillRect(cut * s, i * h, Math.max(1, s / 200), h);
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = accent;
        for (let k = 0; k < 4; k++) ctx.fillRect(((k * 71 + i * 23) % 100) / 100 * s, i * h + h * 0.4, s * 0.12, Math.max(1, s / 256));
        ctx.globalAlpha = 1;
      }
      break;
    }
    case 'tatami': {
      // zwei Matten pro Kachel mit dunklem Rand
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, s, s);
      ctx.strokeStyle = darken(color, 0.12);
      ctx.lineWidth = Math.max(1, s / 256);
      for (let y = 0; y < s; y += s / 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(s, y);
        ctx.stroke();
      }
      ctx.fillStyle = accent;
      const b = s / 28;
      ctx.fillRect(0, 0, b, s);
      ctx.fillRect(s / 2 - b / 2, 0, b, s);
      ctx.fillRect(0, 0, s, b / 2);
      ctx.fillRect(0, s / 2 - b / 4, s / 2, b / 2);
      break;
    }
    case 'teppich': {
      ctx.fillStyle = accent;
      for (let i = 0; i < 300; i++) {
        ctx.globalAlpha = 0.25;
        ctx.fillRect((i * 37) % s, (i * 61) % s, 3, 3);
      }
      ctx.globalAlpha = 1;
      break;
    }
  }
}

const cache = new Map<string, string>();

/** Vorschaubild (für Katalog & Tasche) */
export function surfaceIconUrl(def: SurfaceDef, size = 64): string {
  const k = `${def.id}@${size}`;
  const hit = cache.get(k);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(size * 0.1, size * 0.1, size * 0.8, size * 0.8, size * 0.14);
  ctx.clip();
  ctx.translate(size * 0.1, size * 0.1);
  drawPattern(ctx, def, size * 0.8);
  ctx.restore();
  ctx.strokeStyle = darken(def.color, 0.3);
  ctx.lineWidth = size / 28;
  ctx.beginPath();
  ctx.roundRect(size * 0.1, size * 0.1, size * 0.8, size * 0.8, size * 0.14);
  ctx.stroke();
  const url = c.toDataURL('image/png');
  cache.set(k, url);
  return url;
}
