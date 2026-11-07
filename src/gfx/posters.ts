/**
 * Malt Poster & Buchcover aus `data/posters.ts` (alles ausgedacht: eigene Motive, eigene Titel).
 * Wird für das Symbol und die Textur der 3D-Modelle benutzt.
 */
import type { PosterDef, PosterMotif } from '../data/posters';

type C = CanvasRenderingContext2D;

function heart(ctx: C, x: number, y: number, s: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.9);
  ctx.bezierCurveTo(x - s * 1.2, y + s * 0.1, x - s * 0.6, y - s * 0.8, x, y - s * 0.2);
  ctx.bezierCurveTo(x + s * 0.6, y - s * 0.8, x + s * 1.2, y + s * 0.1, x, y + s * 0.9);
  ctx.fill();
}

function star(ctx: C, x: number, y: number, r: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.42;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

const MOTIFS: Record<PosterMotif, (ctx: C, w: number, h: number) => void> = {
  kaffee: (ctx, w, h) => {
    const cx = w / 2;
    ctx.fillStyle = '#fdf6ea';
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.2, h * 0.42);
    ctx.lineTo(cx + w * 0.2, h * 0.42);
    ctx.quadraticCurveTo(cx + w * 0.2, h * 0.62, cx, h * 0.62);
    ctx.quadraticCurveTo(cx - w * 0.2, h * 0.62, cx - w * 0.2, h * 0.42);
    ctx.fill();
    ctx.strokeStyle = '#fdf6ea';
    ctx.lineWidth = w * 0.035;
    ctx.beginPath();
    ctx.arc(cx + w * 0.22, h * 0.49, w * 0.07, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.fillStyle = '#6e4630';
    ctx.beginPath();
    ctx.ellipse(cx, h * 0.42, w * 0.2, h * 0.02, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e8c8a0';
    ctx.beginPath();
    ctx.ellipse(cx, h * 0.675, w * 0.28, h * 0.03, 0, 0, Math.PI * 2);
    ctx.fill();
    for (const [dx, dy, s] of [[-0.08, 0.32, 0.05], [0.03, 0.26, 0.06], [0.1, 0.33, 0.045]] as const) heart(ctx, cx + w * dx, h * dy, w * s, 'rgba(110, 70, 48, 0.55)');
  },
  'dr-no': (ctx, w, h) => {
    // Schlichtes Porträt: Kittel, Kopf, Brille, buschige Brauen
    const cx = w / 2;
    ctx.fillStyle = '#f4f1ea';
    ctx.beginPath();
    ctx.ellipse(cx, h * 0.72, w * 0.32, h * 0.14, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(cx - w * 0.32, h * 0.72, w * 0.64, h * 0.14);
    ctx.fillStyle = '#e8c4a0';
    ctx.beginPath();
    ctx.ellipse(cx, h * 0.46, w * 0.17, h * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#bdbdc4';
    for (const x of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(cx + x * w * 0.17, h * 0.46, w * 0.035, h * 0.07, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#4a4a52';
    for (const x of [-1, 1]) ctx.fillRect(cx + x * w * 0.075 - w * 0.06, h * 0.385, w * 0.12, h * 0.018);
    ctx.strokeStyle = '#2a2a30';
    ctx.lineWidth = Math.max(1.5, w * 0.012);
    for (const x of [-1, 1]) ctx.strokeRect(cx + x * w * 0.075 - w * 0.055, h * 0.42, w * 0.11, h * 0.07);
    ctx.fillStyle = '#16100e';
    for (const x of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(cx + x * w * 0.075, h * 0.455, w * 0.012, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#8a4a40';
    ctx.fillRect(cx - w * 0.04, h * 0.54, w * 0.08, h * 0.01);
    // Stethoskop
    ctx.strokeStyle = '#2a2a30';
    ctx.lineWidth = w * 0.015;
    ctx.beginPath();
    ctx.arc(cx, h * 0.68, w * 0.12, 0.1, Math.PI - 0.1);
    ctx.stroke();
  },
  kawaii: (ctx, w, h) => {
    // Runde Kuschelwesen mit Herzbäckchen
    const face = (x: number, y: number, r: number, c: string) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#4a2a3a';
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(x + s * r * 0.35, y - r * 0.05, r * 0.09, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = 'rgba(255, 120, 150, 0.6)';
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(x + s * r * 0.6, y + r * 0.2, r * 0.17, r * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = '#4a2a3a';
      ctx.lineWidth = Math.max(1, r * 0.06);
      ctx.beginPath();
      ctx.arc(x, y + r * 0.1, r * 0.15, 0.1, Math.PI - 0.1);
      ctx.stroke();
    };
    face(w * 0.38, h * 0.5, w * 0.22, '#fff6d8');
    face(w * 0.68, h * 0.6, w * 0.15, '#d6f0ff');
    heart(ctx, w * 0.72, h * 0.34, w * 0.05, '#ff7aa8');
    star(ctx, w * 0.2, h * 0.28, w * 0.04, '#ffe14a');
  },
};

function wrap(ctx: C, text: string, maxWidth: number): string[] {
  const out: string[] = [];
  for (const part of text.split('\n')) {
    let line = '';
    for (const word of part.split(' ')) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        out.push(line);
        line = word;
      } else line = test;
    }
    out.push(line);
  }
  return out;
}

/** Malt Poster/Cover in ein Rechteck w × h (ab 0,0) */
export function drawPoster(ctx: C, p: PosterDef, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, p.colors[0]);
  g.addColorStop(1, p.colors[1]);
  ctx.save();
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  MOTIFS[p.motif](ctx, w, h);
  // Titel oben, Untertitel unten
  ctx.fillStyle = p.ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const titleSize = Math.round(w * (p.title.length > 16 ? 0.105 : 0.14));
  ctx.font = `900 ${titleSize}px Nunito, system-ui, sans-serif`;
  const lines = wrap(ctx, p.title, w * 0.9);
  lines.forEach((l, i) => ctx.fillText(l, w / 2, h * 0.04 + i * titleSize * 1.05));
  if (p.sub) {
    const subSize = Math.round(w * 0.065);
    ctx.font = `700 ${subSize}px Nunito, system-ui, sans-serif`;
    ctx.textBaseline = 'bottom';
    const sl = wrap(ctx, p.sub, w * 0.86);
    sl.forEach((l, i) => ctx.fillText(l, w / 2, h * 0.97 - (sl.length - 1 - i) * subSize * 1.1));
  }
  ctx.restore();
}

/** Fertiges Canvas (z. B. für Symbole und 3D-Texturen) */
export function posterCanvas(p: PosterDef, w = 160, h = 224): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  drawPoster(c.getContext('2d') as C, p, w, h);
  return c;
}
