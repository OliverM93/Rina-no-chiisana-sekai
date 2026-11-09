/**
 * Fotomodus: Rahmen um einen Schnappschuss der Spielwelt (Canvas, keine Bilddateien).
 * Das Foto selbst bleibt auf dem Gerät – es wird nur als PNG heruntergeladen, nirgends gespeichert oder hochgeladen.
 */
import { palette } from '../style/palette';

export type FrameStyle = 'polaroid' | 'herzchen' | 'bluemchen' | 'schlicht';

export const FRAME_STYLES: ReadonlyArray<{ id: FrameStyle; label: string }> = [
  { id: 'polaroid', label: '📷 Polaroid' },
  { id: 'herzchen', label: '💗 Herzchen' },
  { id: 'bluemchen', label: '🌸 Blümchen' },
  { id: 'schlicht', label: '▫️ Schlicht' },
];

export interface PhotoCaption {
  /** z. B. „Sa, 16. Mai 2026“ */
  date: string;
  /** z. B. „Testdorf · Frühling“ */
  place: string;
}

/** Ränder (px) je Stil für ein Bild der Größe w × h */
function margins(style: FrameStyle, w: number) {
  const m = Math.round(w * (style === 'schlicht' ? 0.025 : 0.04));
  return { side: m, top: m, bottom: style === 'polaroid' ? Math.round(w * 0.16) : style === 'schlicht' ? m : Math.round(w * 0.09) };
}

function heart(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.35);
  ctx.bezierCurveTo(x - s, y - s * 0.4, x - s * 0.2, y - s, x, y - s * 0.3);
  ctx.bezierCurveTo(x + s * 0.2, y - s, x + s, y - s * 0.4, x, y + s * 0.35);
  ctx.fill();
}

function flower(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, petal: string) {
  ctx.fillStyle = petal;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.75, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#f7d26a';
  ctx.beginPath();
  ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
  ctx.fill();
}

/** Das Bild mit Rahmen und Beschriftung auf ein neues Canvas malen */
export function drawFramedPhoto(img: CanvasImageSource, iw: number, ih: number, style: FrameStyle, caption: PhotoCaption): HTMLCanvasElement {
  const m = margins(style, iw);
  const canvas = document.createElement('canvas');
  canvas.width = iw + m.side * 2;
  canvas.height = ih + m.top + m.bottom;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const bg = style === 'herzchen' ? '#ffe3ec' : style === 'bluemchen' ? '#fff6d9' : style === 'schlicht' ? '#ffffff' : '#fffdf9';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, m.side, m.top, iw, ih);
  ctx.strokeStyle = 'rgba(106,77,90,0.18)';
  ctx.lineWidth = Math.max(2, iw * 0.003);
  ctx.strokeRect(m.side, m.top, iw, ih);

  if (style === 'herzchen') {
    ctx.fillStyle = palette.ui.accent;
    const s = m.side * 0.55;
    const n = 14;
    for (let i = 0; i < n; i++) {
      const x = (canvas.width / (n - 1)) * i;
      heart(ctx, x, m.top / 2, s);
      heart(ctx, x, canvas.height - m.bottom + (m.bottom * 0.12), s * 0.8);
    }
  } else if (style === 'bluemchen') {
    const petals = ['#f4a3b8', '#ffffff', '#c3a8e8', '#ffcf6a'];
    const r = m.side * 0.3;
    for (let i = 0; i < 16; i++) {
      const x = (canvas.width / 15) * i;
      flower(ctx, x, m.top / 2, r, petals[i % petals.length]);
      flower(ctx, x, canvas.height - m.bottom + m.bottom * 0.1, r * 0.9, petals[(i + 2) % petals.length]);
    }
  }

  // Beschriftung unten
  const fs = Math.round(iw * (style === 'polaroid' ? 0.04 : 0.028));
  ctx.textAlign = 'center';
  ctx.fillStyle = palette.ui.text;
  ctx.font = `800 ${fs}px "Nunito Variable", Nunito, sans-serif`;
  const baseY = canvas.height - m.bottom + (style === 'polaroid' ? m.bottom * 0.45 : m.bottom * 0.62);
  if (style !== 'schlicht') {
    ctx.fillText(`Linas kleine Welt · ${caption.place}`, canvas.width / 2, baseY);
    ctx.fillStyle = palette.ui.textSoft;
    ctx.font = `700 ${Math.round(fs * 0.8)}px "Nunito Variable", Nunito, sans-serif`;
    ctx.fillText(caption.date, canvas.width / 2, baseY + fs * 1.1);
  }
  return canvas;
}

export function photoFileName(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `linas-kleine-welt-${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}-${p(date.getHours())}${p(date.getMinutes())}.png`;
}
