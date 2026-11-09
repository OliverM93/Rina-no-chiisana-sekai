/**
 * Aufdrucke für Kleidung (Brust-Motiv als Canvas, transparenter Hintergrund).
 * Das Motiv wird in chibi3d.ts als leicht gebogene Fläche vor das Oberteil gesetzt.
 */
import { BAND_NAMES, PRINT_COLORS, type PrintKind } from '../data/wardrobe';

const W = 256;
const H = 160;

function canvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  return [c, ctx];
}

/** Schrift so verkleinern, dass der Text in `maxW` passt */
function fit(ctx: CanvasRenderingContext2D, text: string, font: (px: number) => string, px: number, maxW: number) {
  let size = px;
  ctx.font = font(size);
  while (ctx.measureText(text).width > maxW && size > 10) {
    size -= 2;
    ctx.font = font(size);
  }
  return size;
}

function hawaii(ctx: CanvasRenderingContext2D) {
  const c = PRINT_COLORS.hawaii;
  // geschwungener Schriftzug, leicht schräg
  ctx.save();
  ctx.translate(W / 2, H / 2 - 4);
  ctx.rotate(-0.12);
  fit(ctx, 'Hawaii', (px) => `italic 900 ${px}px Nunito, "Brush Script MT", cursive`, 78, W * 0.86);
  ctx.fillStyle = c.text;
  ctx.fillText('Hawaii', 0, 0);
  // Unterstrich-Schwung
  ctx.strokeStyle = c.text;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-88, 38);
  ctx.quadraticCurveTo(0, 54, 92, 30);
  ctx.stroke();
  ctx.restore();
  // kleine Blüte & Palmblatt
  ctx.fillStyle = c.flower;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(214 + Math.cos(a) * 9, 34 + Math.sin(a) * 9, 9, 6, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = c.leaf;
  ctx.beginPath();
  ctx.arc(214, 34, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = c.leaf;
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(40, 132);
    ctx.quadraticCurveTo(30 + i * 8, 112 - i * 4, 18 + i * 14, 118 - i * 10);
    ctx.stroke();
  }
}

function sport(ctx: CanvasRenderingContext2D) {
  const c = PRINT_COLORS.sport;
  // College-Schrift in leichtem Bogen, mit heller Kontur
  const text = 'SPORT';
  const letters = [...text];
  let px = 80;
  ctx.font = `900 ${px}px Nunito, Impact, sans-serif`;
  while (letters.reduce((w, l) => w + ctx.measureText(l).width + 4, 0) > W * 0.88 && px > 20) {
    px -= 2;
    ctx.font = `900 ${px}px Nunito, Impact, sans-serif`;
  }
  const widths = letters.map((l) => ctx.measureText(l).width + 4);
  const total = widths.reduce((a, b) => a + b, 0);
  let x = W / 2 - total / 2;
  letters.forEach((l, i) => {
    const cx = x + widths[i] / 2;
    const t = (cx - W / 2) / (total / 2);
    ctx.save();
    ctx.translate(cx, H / 2 + t * t * 14 - 6);
    ctx.rotate(t * 0.16);
    ctx.lineWidth = 7;
    ctx.strokeStyle = c.outline;
    ctx.strokeText(l, 0, 0);
    ctx.fillStyle = c.text;
    ctx.fillText(l, 0, 0);
    ctx.restore();
    x += widths[i];
  });
  ctx.fillStyle = c.text;
  ctx.font = '800 16px Nunito, sans-serif';
  ctx.fillText('— DEPT. —', W / 2, H - 22);
}

function radierkopf(ctx: CanvasRenderingContext2D) {
  const c = PRINT_COLORS.radierkopf;
  // Porträt: riesige Turmfrisur über einem kleinen Gesicht, Hemdkragen
  const cx = W / 2;
  ctx.save();
  ctx.translate(cx, 4);
  ctx.scale(1.15, 1.0);
  ctx.translate(-cx, 0);
  ctx.fillStyle = c.hair;
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(cx + Math.cos(a) * 18, 40 + Math.sin(a) * 26, 16, 20, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.ellipse(cx, 44, 30, 38, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = c.face;
  ctx.beginPath();
  ctx.ellipse(cx, 84, 17, 21, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = c.shade;
  ctx.fillRect(cx - 9, 80, 6, 3);
  ctx.fillRect(cx + 3, 80, 6, 3);
  ctx.fillRect(cx - 5, 93, 10, 2);
  ctx.fillStyle = c.hair;
  ctx.beginPath();
  ctx.moveTo(cx - 34, 122);
  ctx.lineTo(cx - 10, 102);
  ctx.lineTo(cx, 112);
  ctx.lineTo(cx + 10, 102);
  ctx.lineTo(cx + 34, 122);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = c.text;
  fit(ctx, 'RADIERKOPF', (px) => `900 ${px}px Nunito, sans-serif`, 40, W * 0.96);
  ctx.fillText('RADIERKOPF', cx, 142);
}

function band(ctx: CanvasRenderingContext2D, name: string) {
  const c = PRINT_COLORS.band;
  // eckige, gezackte Hardcore-Schrift mit Blitz
  ctx.save();
  ctx.translate(W / 2, 58);
  ctx.scale(1, 1.35);
  fit(ctx, name, (px) => `900 ${px}px Impact, "Arial Black", Nunito, sans-serif`, 60, W * 0.98);
  ctx.lineWidth = 3;
  ctx.strokeStyle = c.accent;
  ctx.strokeText(name, 3, 3);
  ctx.fillStyle = c.text;
  ctx.fillText(name, 0, 0);
  ctx.restore();
  // Zacken-Linie & Blitz
  ctx.strokeStyle = c.text;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 16; i++) ctx.lineTo(28 + i * 12.5, 104 + (i % 2 ? -7 : 7));
  ctx.stroke();
  ctx.fillStyle = c.accent;
  ctx.beginPath();
  ctx.moveTo(136, 112);
  ctx.lineTo(116, 140);
  ctx.lineTo(128, 140);
  ctx.lineTo(120, 158);
  ctx.lineTo(142, 128);
  ctx.lineTo(130, 128);
  ctx.closePath();
  ctx.fill();
}

/** Zeichnet ein Brust-Motiv. `variant` wählt bei Bandshirts die Band. */
export function drawPrint(kind: PrintKind, variant = 0, bandName?: string): HTMLCanvasElement {
  const [c, ctx] = canvas();
  if (kind === 'hawaii') hawaii(ctx);
  else if (kind === 'sport') sport(ctx);
  else if (kind === 'radierkopf') radierkopf(ctx);
  else band(ctx, bandName ?? BAND_NAMES[variant % BAND_NAMES.length]);
  return c;
}
