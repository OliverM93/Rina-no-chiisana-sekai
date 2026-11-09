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
    // Porträt: dunkles, zur Seite gekämmtes Haar mit grauen Schläfen, buschige Brauen, runde Drahtbrille,
    // leichtes Schmunzeln; weißer Kittel über dunkelblauem Polo, Stethoskop mit goldenem Kopf
    const cx = w / 2;
    const hy = h * 0.5;
    const rx = w * 0.2;
    const ry = h * 0.16;
    const ey = hy - ry * 0.02;
    const ell = (x: number, y: number, a: number, b: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(x, y, a, b, 0, 0, Math.PI * 2);
      ctx.fill();
    };
    // Kittel, Polo-Ausschnitt, Hals, Kragen
    ctx.fillStyle = '#f4f1ea';
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.36, h * 0.88);
    ctx.lineTo(cx - w * 0.36, h * 0.79);
    ctx.quadraticCurveTo(cx - w * 0.34, h * 0.7, cx - w * 0.16, h * 0.67);
    ctx.lineTo(cx + w * 0.16, h * 0.67);
    ctx.quadraticCurveTo(cx + w * 0.34, h * 0.7, cx + w * 0.36, h * 0.79);
    ctx.lineTo(cx + w * 0.36, h * 0.88);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#2c3150';
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.12, h * 0.665);
    ctx.lineTo(cx + w * 0.12, h * 0.665);
    ctx.lineTo(cx, h * 0.88);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#c08a5f';
    ctx.fillRect(cx - w * 0.07, h * 0.6, w * 0.14, h * 0.09);
    ctx.fillStyle = '#3a4068';
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx + s * w * 0.075, h * 0.665);
      ctx.lineTo(cx + s * w * 0.12, h * 0.665);
      ctx.lineTo(cx + s * w * 0.03, h * 0.73);
      ctx.closePath();
      ctx.fill();
    }
    // Stethoskop (goldener Kopf links) und Abzeichen
    ctx.strokeStyle = '#26262c';
    ctx.lineWidth = Math.max(1.5, w * 0.016);
    ctx.beginPath();
    ctx.arc(cx, h * 0.66, w * 0.125, 0.15, Math.PI - 0.15);
    ctx.lineTo(cx - w * 0.13, h * 0.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + w * 0.12, h * 0.68);
    ctx.lineTo(cx + w * 0.13, h * 0.8);
    ctx.stroke();
    ell(cx - w * 0.13, h * 0.82, w * 0.035, w * 0.035, '#d9b45a');
    ctx.fillStyle = '#d9b45a';
    ctx.fillRect(cx + w * 0.2, h * 0.78, w * 0.09, h * 0.04);
    // Ohren, Gesicht, Kiefer
    for (const s of [-1, 1]) ell(cx + s * rx, hy + ry * 0.08, w * 0.03, h * 0.04, '#cf9a70');
    ell(cx, hy, rx, ry, '#d9a47a');
    ell(cx, hy + ry * 0.3, rx * 0.86, ry * 0.72, '#d9a47a');
    // Haar: dunkelbraun, hohe Stirn, nach einer Seite gekämmt; graue Schläfen
    ctx.fillStyle = '#4a3326';
    ctx.beginPath();
    ctx.ellipse(cx, hy, rx + w * 0.008, ry + h * 0.008, 0, Math.PI * 1.04, Math.PI * 1.96);
    ctx.bezierCurveTo(cx + rx * 0.9, hy - ry * 0.55, cx + rx * 0.25, hy - ry * 0.72, cx - rx * 0.2, hy - ry * 0.55);
    ctx.bezierCurveTo(cx - rx * 0.6, hy - ry * 0.4, cx - rx * 0.85, hy - ry * 0.3, cx - rx * 0.97, hy - ry * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#6a4c3a';
    ctx.lineWidth = Math.max(1, w * 0.008);
    ctx.beginPath();
    ctx.moveTo(cx + rx * 0.6, hy - ry * 0.85);
    ctx.quadraticCurveTo(cx, hy - ry * 0.95, cx - rx * 0.6, hy - ry * 0.65);
    ctx.stroke();
    for (const s of [-1, 1]) ell(cx + s * rx * 0.94, hy - ry * 0.22, w * 0.018, h * 0.05, '#a9a3a0');
    // buschige Brauen (innen etwas höher)
    ctx.strokeStyle = '#2e2220';
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(2, h * 0.02);
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.14, hy - ry * 0.26);
    ctx.lineTo(cx - w * 0.03, hy - ry * 0.35);
    ctx.moveTo(cx + w * 0.03, hy - ry * 0.35);
    ctx.lineTo(cx + w * 0.14, hy - ry * 0.26);
    ctx.stroke();
    // Wangen, Nase, Augen, runde Drahtbrille
    for (const s of [-1, 1]) ell(cx + s * w * 0.12, hy + ry * 0.4, w * 0.04, h * 0.018, 'rgba(220, 120, 100, 0.28)');
    ell(cx, hy + ry * 0.28, w * 0.03, h * 0.02, '#c28a60');
    for (const s of [-1, 1]) {
      ell(cx + s * w * 0.085, ey, w * 0.012, w * 0.013, '#1c1412');
      ell(cx + s * w * 0.085 + w * 0.004, ey - h * 0.004, w * 0.004, w * 0.004, '#ffffff');
    }
    ctx.strokeStyle = '#8a7a58';
    ctx.lineWidth = Math.max(1.2, w * 0.01);
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(cx + s * w * 0.085, ey, w * 0.062, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + s * w * 0.147, ey - h * 0.005);
      ctx.lineTo(cx + s * (rx - w * 0.01), ey - h * 0.01);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(cx, ey - h * 0.012, w * 0.024, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    // leichtes, ein wenig schiefes Schmunzeln
    ctx.strokeStyle = '#8a4a40';
    ctx.lineWidth = Math.max(1.5, w * 0.012);
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.06, hy + ry * 0.58);
    ctx.quadraticCurveTo(cx, hy + ry * 0.7, cx + w * 0.07, hy + ry * 0.52);
    ctx.stroke();
    ctx.lineCap = 'butt';
  },
  sandsterne: (ctx, w, h) => {
    // Wüstenplanet: Dünen, zwei Monde, ein Stern
    ctx.fillStyle = '#f2c46a';
    ctx.beginPath();
    ctx.arc(w * 0.68, h * 0.34, w * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff0cf';
    ctx.beginPath();
    ctx.arc(w * 0.3, h * 0.28, w * 0.06, 0, Math.PI * 2);
    ctx.fill();
    for (const [dy, col] of [[0.62, '#a8602e'], [0.72, '#8a4a24'], [0.82, '#5e3018']] as const) {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, h * dy);
      ctx.quadraticCurveTo(w * 0.3, h * (dy - 0.12), w * 0.55, h * dy);
      ctx.quadraticCurveTo(w * 0.8, h * (dy + 0.08), w, h * (dy - 0.04));
      ctx.lineTo(w, h);
      ctx.fill();
    }
    ctx.fillStyle = '#fff0cf';
    for (const [x, y, s] of [[0.15, 0.4, 0.012], [0.45, 0.2, 0.01], [0.85, 0.2, 0.012], [0.55, 0.45, 0.008]] as const) {
      ctx.beginPath();
      ctx.arc(w * x, h * y, w * s, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  kultfilm: (ctx, w, h) => {
    // Schwarz-Weiß: Zimmer mit Zickzack-Boden, Vorhang und Lichtkegel im Nebel
    ctx.fillStyle = '#d8d6d1';
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.62);
    ctx.lineTo(w * 0.7, h * 0.62);
    ctx.lineTo(w * 0.95, h * 0.9);
    ctx.lineTo(w * 0.05, h * 0.9);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#1a1a1e';
    ctx.lineWidth = Math.max(2, w * 0.016);
    ctx.beginPath();
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      ctx.lineTo(w * (0.3 + 0.4 * t) + (i % 2 ? w * 0.02 : -w * 0.02), h * 0.62 + (i % 2 ? h * 0.02 : 0));
    }
    ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      ctx.lineTo(w * (0.18 + 0.64 * t), h * (0.76 + (i % 2 ? 0.04 : -0.04)));
    }
    ctx.stroke();
    // Vorhänge
    ctx.fillStyle = '#8f8c88';
    for (const s of [0, 1]) {
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(s * w * 0.8 + i * w * 0.05, h * 0.3);
        ctx.quadraticCurveTo(s * w * 0.8 + i * w * 0.05 + w * 0.025, h * 0.46, s * w * 0.8 + i * w * 0.05, h * 0.62);
        ctx.lineTo(s * w * 0.8 + (i + 1) * w * 0.05, h * 0.62);
        ctx.lineTo(s * w * 0.8 + (i + 1) * w * 0.05, h * 0.3);
        ctx.fill();
      }
    }
    // Lichtkegel
    const cone = ctx.createLinearGradient(0, h * 0.28, 0, h * 0.62);
    cone.addColorStop(0, 'rgba(255,255,245,0.85)');
    cone.addColorStop(1, 'rgba(255,255,245,0.05)');
    ctx.fillStyle = cone;
    ctx.beginPath();
    ctx.moveTo(w * 0.46, h * 0.28);
    ctx.lineTo(w * 0.54, h * 0.28);
    ctx.lineTo(w * 0.7, h * 0.62);
    ctx.lineTo(w * 0.3, h * 0.62);
    ctx.closePath();
    ctx.fill();
    // Nebel
    ctx.fillStyle = 'rgba(233,231,227,0.25)';
    for (const [x, y, rx] of [[0.25, 0.58, 0.2], [0.7, 0.66, 0.24], [0.5, 0.5, 0.16]] as const) {
      ctx.beginPath();
      ctx.ellipse(w * x, h * y, w * rx, h * 0.035, 0, 0, Math.PI * 2);
      ctx.fill();
    }
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
  const longest = Math.max(...p.title.split('\n').map((l) => l.length));
  const titleSize = Math.round(w * (p.title.length > 16 || longest > 9 ? 0.105 : 0.14));
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
