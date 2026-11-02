/**
 * Hilfsfunktionen für prozedurales Zeichnen mit Canvas 2D.
 * Alle Zeichenfunktionen arbeiten in Welteinheiten; die Auflösung (RES)
 * wird über `ctx.scale` hineingerechnet.
 */
import { darken } from '../style/palette';

export type Ctx = CanvasRenderingContext2D;

export function makeCanvas(wUnits: number, hUnits: number, res: number): { canvas: HTMLCanvasElement; ctx: Ctx } {
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(wUnits * res);
  canvas.height = Math.ceil(hUnits * res);
  const ctx = canvas.getContext('2d') as Ctx;
  ctx.scale(res, res);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  return { canvas, ctx };
}

export interface Circle {
  x: number;
  y: number;
  r: number;
}

/**
 * Zeichnet eine „Wolke“ aus Kreisen mit weicher Außenlinie
 * (erst alle Konturen, dann alle Füllungen → nur die Außenkante bleibt sichtbar).
 */
export function blob(ctx: Ctx, circles: Circle[], fill: string, outline: string | null = darken(fill, 0.28), lw = 2.2) {
  if (outline) {
    ctx.fillStyle = outline;
    for (const c of circles) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r + lw, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = fill;
  for (const c of circles) {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function ellipse(ctx: Ctx, x: number, y: number, rx: number, ry: number, fill: string, outline?: string, lw = 2) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), 0, 0, Math.PI * 2);
  if (outline) {
    ctx.lineWidth = lw * 2;
    ctx.strokeStyle = outline;
    ctx.stroke();
  }
  ctx.fillStyle = fill;
  ctx.fill();
}

export function roundRectPath(ctx: Ctx, x: number, y: number, w: number, h: number, r: number | number[]) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export function roundRect(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number | number[],
  fill: string,
  outline?: string | null,
  lw = 2,
) {
  roundRectPath(ctx, x, y, w, h, r);
  if (outline) {
    ctx.lineWidth = lw * 2;
    ctx.strokeStyle = outline;
    ctx.stroke();
  }
  ctx.fillStyle = fill;
  ctx.fill();
}

/** Füllt den aktuellen Pfad mit Kontur „außen“ (Kontur zuerst, dann Füllung). */
export function fillWithOutline(ctx: Ctx, fill: string, outline: string | null, lw = 2) {
  if (outline) {
    ctx.lineWidth = lw * 2;
    ctx.strokeStyle = outline;
    ctx.stroke();
  }
  ctx.fillStyle = fill;
  ctx.fill();
}

/** Weicher, runder Schatten am Boden. */
export function groundShadow(ctx: Ctx, x: number, y: number, rx: number, ry: number, alpha = 0.18) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, rx);
  g.addColorStop(0, `rgba(70, 50, 80, ${alpha})`);
  g.addColorStop(0.7, `rgba(70, 50, 80, ${alpha * 0.8})`);
  g.addColorStop(1, 'rgba(70, 50, 80, 0)');
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, ry / rx);
  ctx.translate(-x, -y);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, rx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Kleiner Glanzpunkt (macht Formen „knuffig“). */
export function shine(ctx: Ctx, x: number, y: number, r: number, alpha = 0.6) {
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.7, -0.5, 0, Math.PI * 2);
  ctx.fill();
}

export function hexA(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
