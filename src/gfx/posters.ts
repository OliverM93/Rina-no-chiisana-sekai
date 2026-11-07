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

function fog(ctx: C, w: number, y: number, h: number, alpha: number) {
  ctx.fillStyle = `rgba(235, 245, 245, ${alpha})`;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.ellipse((w / 3) * i, y + (i % 2) * h * 0.3, w * 0.42, h * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
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
  puppen: (ctx, w, h) => {
    const cx = w / 2;
    const cy = h * 0.54;
    const r = w * 0.25;
    // Locken
    ctx.fillStyle = '#3a2418';
    for (let i = 0; i < 9; i++) {
      const a = Math.PI + (i / 8) * Math.PI;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r * 1.05, cy + Math.sin(a) * r * 1.05, r * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#f2e0d0';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f0a0a0';
    for (const x of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(cx + x * r * 0.55, cy + r * 0.25, r * 0.2, r * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#16100e';
    for (const x of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(cx + x * r * 0.38, cy - r * 0.1, r * 0.16, 0, Math.PI * 2);
      ctx.fill();
    }
    // zu breites Grinsen mit Nähten
    ctx.strokeStyle = '#7a0f1a';
    ctx.lineWidth = Math.max(2, w * 0.018);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.75, cy + r * 0.35);
    ctx.quadraticCurveTo(cx, cy + r * 0.95, cx + r * 0.75, cy + r * 0.35);
    ctx.stroke();
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * r * 0.2, cy + r * (0.55 + 0.1 * (1 - Math.abs(i) / 3)));
      ctx.lineTo(cx + i * r * 0.2, cy + r * (0.72 + 0.1 * (1 - Math.abs(i) / 3)));
      ctx.stroke();
    }
  },
  nebelhaus: (ctx, w, h) => {
    ctx.fillStyle = '#0a1418';
    // Baum
    ctx.fillRect(w * 0.15, h * 0.4, w * 0.03, h * 0.28);
    ctx.strokeStyle = '#0a1418';
    ctx.lineWidth = w * 0.02;
    for (const [dx, dy] of [[-0.1, -0.1], [0.08, -0.14], [-0.05, -0.2]] as const) {
      ctx.beginPath();
      ctx.moveTo(w * 0.165, h * 0.5);
      ctx.lineTo(w * (0.165 + dx), h * (0.5 + dy));
      ctx.stroke();
    }
    // Haus mit Giebel
    ctx.fillRect(w * 0.32, h * 0.42, w * 0.46, h * 0.26);
    ctx.beginPath();
    ctx.moveTo(w * 0.28, h * 0.42);
    ctx.lineTo(w * 0.55, h * 0.26);
    ctx.lineTo(w * 0.82, h * 0.42);
    ctx.fill();
    ctx.fillRect(w * 0.68, h * 0.3, w * 0.05, h * 0.1);
    // ein Fenster brennt
    ctx.fillStyle = '#ffd36b';
    ctx.fillRect(w * 0.5, h * 0.48, w * 0.1, h * 0.1);
    ctx.fillStyle = '#0a1418';
    ctx.fillRect(w * 0.545, h * 0.48, w * 0.01, h * 0.1);
    ctx.fillRect(w * 0.5, h * 0.525, w * 0.1, h * 0.01);
    fog(ctx, w, h * 0.62, h * 0.12, 0.45);
    fog(ctx, w, h * 0.72, h * 0.1, 0.3);
  },
  masken: (ctx, w, h) => {
    // Kürbis-Mond
    ctx.fillStyle = '#ffb74a';
    ctx.beginPath();
    ctx.arc(w * 0.74, h * 0.37, w * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7a3a10';
    for (const x of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(w * 0.74 + x * w * 0.06, h * 0.35);
      ctx.lineTo(w * 0.74 + x * w * 0.025, h * 0.35);
      ctx.lineTo(w * 0.74 + x * w * 0.045, h * 0.315);
      ctx.fill();
    }
    // Maske
    const cx = w * 0.4;
    const cy = h * 0.58;
    ctx.fillStyle = '#f6f1e8';
    ctx.beginPath();
    ctx.ellipse(cx, cy, w * 0.2, h * 0.17, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#16100e';
    for (const x of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(cx + x * w * 0.075, cy - h * 0.025, w * 0.04, h * 0.032, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillRect(cx - w * 0.04, cy + h * 0.07, w * 0.08, h * 0.015);
  },
  nebelfront: (ctx, w, h) => {
    // Leuchtturm
    ctx.fillStyle = '#0c2028';
    ctx.beginPath();
    ctx.moveTo(w * 0.4, h * 0.7);
    ctx.lineTo(w * 0.46, h * 0.3);
    ctx.lineTo(w * 0.54, h * 0.3);
    ctx.lineTo(w * 0.6, h * 0.7);
    ctx.fill();
    ctx.fillRect(w * 0.44, h * 0.24, w * 0.12, h * 0.06);
    ctx.fillStyle = '#ffe9a0';
    ctx.fillRect(w * 0.47, h * 0.25, w * 0.06, h * 0.04);
    // Lichtstrahl
    ctx.fillStyle = 'rgba(255, 233, 160, 0.25)';
    ctx.beginPath();
    ctx.moveTo(w * 0.53, h * 0.27);
    ctx.lineTo(w, h * 0.18);
    ctx.lineTo(w, h * 0.34);
    ctx.fill();
    fog(ctx, w, h * 0.55, h * 0.2, 0.55);
    fog(ctx, w, h * 0.68, h * 0.16, 0.45);
  },
  zauber: (ctx, w, h) => {
    for (let i = 0; i < 16; i++) star(ctx, (i * 37.1) % w, ((i * 53.3) % (h * 0.4)) + h * 0.04, w * (0.012 + (i % 3) * 0.006), 'rgba(255, 233, 168, 0.85)');
    ctx.fillStyle = '#0e0e2a';
    // Schloss
    ctx.fillRect(w * 0.2, h * 0.46, w * 0.6, h * 0.2);
    for (const [x, hh] of [[0.2, 0.16], [0.45, 0.22], [0.68, 0.14]] as const) {
      ctx.fillRect(w * x, h * (0.46 - hh), w * 0.12, h * hh);
      ctx.beginPath();
      ctx.moveTo(w * (x - 0.015), h * (0.46 - hh));
      ctx.lineTo(w * (x + 0.06), h * (0.46 - hh - 0.1));
      ctx.lineTo(w * (x + 0.135), h * (0.46 - hh));
      ctx.fill();
    }
    ctx.fillStyle = '#ffd36b';
    for (const x of [0.28, 0.5, 0.72]) ctx.fillRect(w * x, h * 0.54, w * 0.03, h * 0.04);
    // Eule
    const ex = w * 0.5;
    const ey = h * 0.78;
    ctx.fillStyle = '#d9c8a0';
    ctx.beginPath();
    ctx.ellipse(ex, ey, w * 0.09, h * 0.07, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd36b';
    for (const x of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(ex + x * w * 0.04, ey - h * 0.01, w * 0.025, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#16100e';
    for (const x of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(ex + x * w * 0.04, ey - h * 0.01, w * 0.01, 0, Math.PI * 2);
      ctx.fill();
    }
    // Zauberstab mit Funken
    ctx.strokeStyle = '#d9b45a';
    ctx.lineWidth = w * 0.016;
    ctx.beginPath();
    ctx.moveTo(w * 0.12, h * 0.9);
    ctx.lineTo(w * 0.34, h * 0.74);
    ctx.stroke();
    star(ctx, w * 0.36, h * 0.72, w * 0.035, '#fff6c8');
  },
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
  ballon: (ctx, w, h) => {
    // Gully-Gitter
    ctx.fillStyle = '#16161a';
    ctx.fillRect(0, h * 0.74, w, h * 0.26);
    ctx.strokeStyle = '#4a4a54';
    ctx.lineWidth = w * 0.018;
    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(w * (i / 6), h * 0.74);
      ctx.lineTo(w * (i / 6), h);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(0, h * 0.74);
    ctx.lineTo(w, h * 0.74);
    ctx.stroke();
    // gelbe Augen im Dunkeln
    ctx.fillStyle = '#ffe14a';
    for (const x of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(w / 2 + x * w * 0.07, h * 0.86, w * 0.03, h * 0.012, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // roter Ballon mit Schnur
    ctx.fillStyle = '#d8343c';
    ctx.beginPath();
    ctx.ellipse(w * 0.62, h * 0.38, w * 0.14, h * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.ellipse(w * 0.58, h * 0.34, w * 0.035, h * 0.02, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = Math.max(1, w * 0.008);
    ctx.beginPath();
    ctx.moveTo(w * 0.62, h * 0.48);
    ctx.quadraticCurveTo(w * 0.55, h * 0.62, w * 0.5, h * 0.74);
    ctx.stroke();
  },
  schreiber: (ctx, w, h) => {
    // Synthesizer-Tasten vor Nebel und Mond
    ctx.fillStyle = 'rgba(255, 244, 214, 0.9)';
    ctx.beginPath();
    ctx.arc(w * 0.7, h * 0.28, w * 0.13, 0, Math.PI * 2);
    ctx.fill();
    fog(ctx, w, h * 0.5, h * 0.18, 0.5);
    ctx.fillStyle = '#10181c';
    ctx.fillRect(w * 0.08, h * 0.62, w * 0.84, h * 0.16);
    ctx.fillStyle = '#f2f0ea';
    for (let i = 0; i < 9; i++) ctx.fillRect(w * (0.1 + i * 0.09), h * 0.64, w * 0.075, h * 0.12);
    ctx.fillStyle = '#16100e';
    for (const i of [0, 1, 3, 4, 5, 7]) ctx.fillRect(w * (0.15 + i * 0.09), h * 0.64, w * 0.05, h * 0.07);
    for (const [x, c] of [[0.2, '#ff5a5a'], [0.3, '#5ae0ff'], [0.4, '#ffe14a']] as const) {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(w * x, h * 0.6, w * 0.012, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  nowak: (ctx, w, h) => {
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
