/**
 * Malt die Kunstwerke aus `data/art.ts` – je Stil ein kleines Motiv.
 * Wird für Symbole, die Galerie und die Leinwand der 3D-Staffelei benutzt.
 */
import type { ArtDef } from '../data/art';
import { hashString, mulberry32 } from '../core/rng';

type C = CanvasRenderingContext2D;

function heart(ctx: C, x: number, y: number, s: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.9);
  ctx.bezierCurveTo(x - s * 1.2, y + s * 0.1, x - s * 0.6, y - s * 0.8, x, y - s * 0.2);
  ctx.bezierCurveTo(x + s * 0.6, y - s * 0.8, x + s * 1.2, y + s * 0.1, x, y + s * 0.9);
  ctx.fill();
}

/** Malt das Kunstwerk in ein Rechteck w × h (ab 0,0) */
export function drawArtwork(ctx: C, a: ArtDef, w: number, h: number) {
  const [bg, main, accent] = a.colors;
  const rnd = mulberry32(hashString(a.id));
  ctx.save();
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  switch (a.style) {
    case 'landschaft': {
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(w * (0.2 + i * 0.3), h * (0.2 + rnd() * 0.1), w * 0.12, h * 0.05, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(w * 0.8, h * 0.18, w * 0.07, 0, Math.PI * 2);
      ctx.fill();
      for (const [y, c] of [[0.6, main], [0.72, '#6fbf73']] as const) {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(0, h * y);
        for (let x = 0; x <= w; x += w / 8) ctx.quadraticCurveTo(x + w / 16, h * (y - 0.08), x + w / 8, h * y);
        ctx.lineTo(w, h);
        ctx.fill();
      }
      break;
    }
    case 'meer': {
      ctx.fillStyle = '#f7e8c4';
      ctx.fillRect(0, h * 0.78, w, h * 0.22);
      for (let row = 0; row < 5; row++) {
        ctx.strokeStyle = row % 2 ? accent : main;
        ctx.lineWidth = h * 0.05;
        ctx.beginPath();
        for (let x = 0; x <= w; x += w / 20) ctx.lineTo(x, h * (0.35 + row * 0.09) + Math.sin(x / (w / 6) + row) * h * 0.025);
        ctx.stroke();
      }
      ctx.fillStyle = '#e8484f';
      ctx.fillRect(w * 0.7, h * 0.86, w * 0.05, h * 0.03);
      break;
    }
    case 'blumen': {
      for (let row = 0; row < 6; row++) {
        const y = h * (0.45 + row * 0.1);
        ctx.fillStyle = accent;
        ctx.fillRect(0, y, w, h * 0.06);
        for (let i = 0; i < 9; i++) {
          ctx.fillStyle = [main, '#f7d26a', '#ffffff', '#e85a8a'][(row + i) % 4];
          ctx.beginPath();
          ctx.arc(w * (i / 8) + (row % 2) * w * 0.05, y, w * 0.02 * (1 + row * 0.2), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
    case 'nacht': {
      ctx.strokeStyle = accent;
      ctx.lineWidth = h * 0.02;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc(w * (0.2 + rnd() * 0.6), h * (0.15 + rnd() * 0.35), w * (0.05 + rnd() * 0.08), rnd() * 6, rnd() * 6 + 4);
        ctx.stroke();
      }
      ctx.fillStyle = main;
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.arc(w * rnd(), h * rnd() * 0.6, w * 0.018, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(w * 0.82, h * 0.15, w * 0.07, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2b2a31';
      for (let i = 0; i < 5; i++) ctx.fillRect(w * (0.1 + i * 0.18), h * 0.72, w * 0.12, h * 0.28);
      ctx.fillStyle = '#f7d26a';
      for (let i = 0; i < 5; i++) ctx.fillRect(w * (0.14 + i * 0.18), h * 0.8, w * 0.03, h * 0.04);
      break;
    }
    case 'abstrakt': {
      for (let i = 0; i < 9; i++) {
        ctx.fillStyle = [main, accent, '#f7d26a', '#ffffff'][i % 4];
        ctx.globalAlpha = 0.85;
        ctx.save();
        ctx.translate(w * rnd(), h * rnd());
        ctx.rotate(rnd() * 3);
        if (i % 2) ctx.fillRect(-w * 0.15, -h * 0.05, w * 0.3, h * 0.1);
        else {
          ctx.beginPath();
          ctx.arc(0, 0, w * (0.06 + rnd() * 0.12), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      break;
    }
    case 'dackel': {
      ctx.fillStyle = accent;
      ctx.fillRect(0, h * 0.75, w, h * 0.25);
      ctx.fillStyle = main;
      ctx.beginPath();
      ctx.ellipse(w * 0.48, h * 0.64, w * 0.28, h * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(w * 0.76, h * 0.52, w * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(w * 0.3, h * 0.68, w * 0.04, h * 0.1);
      ctx.fillRect(w * 0.62, h * 0.68, w * 0.04, h * 0.1);
      ctx.fillStyle = '#8e4a22';
      ctx.beginPath();
      ctx.ellipse(w * 0.72, h * 0.57, w * 0.03, h * 0.07, 0.3, 0, Math.PI * 2);
      ctx.fill();
      // Krönchen
      ctx.fillStyle = '#f2c94c';
      ctx.beginPath();
      ctx.moveTo(w * 0.7, h * 0.43);
      for (let i = 0; i <= 4; i++) ctx.lineTo(w * (0.7 + i * 0.03), h * (i % 2 ? 0.36 : 0.43));
      ctx.fill();
      ctx.fillStyle = '#e85a8a';
      ctx.fillRect(w * 0.62, h * 0.56, w * 0.05, h * 0.03);
      break;
    }
    case 'berge': {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, bg);
      g.addColorStop(1, '#f4a3b8');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      for (const [x, y, c] of [[0.3, 0.3, main], [0.65, 0.22, '#6a5a7a'], [0.95, 0.38, main]] as const) {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.moveTo(w * (x - 0.38), h);
        ctx.lineTo(w * x, h * y);
        ctx.lineTo(w * (x + 0.38), h);
        ctx.fill();
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.moveTo(w * (x - 0.08), h * (y + 0.12));
        ctx.lineTo(w * x, h * y);
        ctx.lineTo(w * (x + 0.08), h * (y + 0.12));
        ctx.fill();
      }
      break;
    }
    case 'portrait': {
      ctx.fillStyle = '#c9955f';
      ctx.fillRect(w * 0.15, h * 0.68, w * 0.7, h * 0.08);
      ctx.fillStyle = main;
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.75, w * 0.24, h * 0.25, 0, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.fillRect(w * 0.4, h * 0.5, w * 0.2, h * 0.06);
      ctx.fillStyle = '#d8d8e0';
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.36, w * 0.17, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbe0cc';
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.39, w * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2b2a31';
      ctx.fillRect(w * 0.44, h * 0.38, w * 0.03, h * 0.015);
      ctx.fillRect(w * 0.53, h * 0.38, w * 0.03, h * 0.015);
      ctx.fillRect(w * 0.47, h * 0.45, w * 0.06, h * 0.01);
      break;
    }
    case 'stickbild': {
      ctx.fillStyle = main;
      const cell = w / 24;
      for (let x = 0; x < 24; x++) for (let y = 0; y < 24; y++) if (x === 1 || y === 1 || x === 22 || y === 22) ctx.fillRect(x * cell, y * cell, cell * 0.8, cell * 0.8);
      ctx.font = `700 ${h * 0.1}px serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = accent;
      ctx.fillText('Trautes Heim', w / 2, h * 0.38);
      ctx.fillText('Glück allein', w / 2, h * 0.52);
      heart(ctx, w * 0.5, h * 0.7, w * 0.1, main);
      break;
    }
    case 'karte': {
      ctx.strokeStyle = '#c9a77a';
      ctx.lineWidth = 2;
      ctx.strokeRect(w * 0.06, h * 0.06, w * 0.88, h * 0.88);
      ctx.fillStyle = main;
      ctx.beginPath();
      ctx.moveTo(w * 0.6, 0);
      ctx.bezierCurveTo(w * 0.5, h * 0.3, w * 0.75, h * 0.6, w * 0.6, h);
      ctx.lineTo(w * 0.7, h);
      ctx.bezierCurveTo(w * 0.85, h * 0.6, w * 0.6, h * 0.3, w * 0.7, 0);
      ctx.fill();
      ctx.fillStyle = accent;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(w * (0.1 + rnd() * 0.4), h * (0.15 + rnd() * 0.7), w * 0.025, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = '#e8484f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(w * 0.28, h * 0.62);
      ctx.lineTo(w * 0.36, h * 0.7);
      ctx.moveTo(w * 0.36, h * 0.62);
      ctx.lineTo(w * 0.28, h * 0.7);
      ctx.stroke();
      ctx.fillStyle = '#2b2a31';
      ctx.font = `700 ${h * 0.09}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('N', w * 0.85, h * 0.2);
      break;
    }
    case 'herzen': {
      for (let i = 0; i < 40; i++) heart(ctx, w * rnd(), h * rnd(), w * (0.025 + rnd() * 0.04), i % 2 ? main : accent);
      heart(ctx, w * 0.5, h * 0.5, w * 0.15, main);
      break;
    }
    case 'stadt': {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, bg);
      g.addColorStop(0.7, accent);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 8; i++) {
        const x = (i / 8) * w;
        const hh = h * (0.25 + rnd() * 0.15);
        ctx.fillStyle = i % 2 ? main : '#8f9aa4';
        ctx.fillRect(x, h - hh, w / 8 + 1, hh);
        ctx.fillStyle = '#5a6670';
        ctx.beginPath();
        ctx.moveTo(x, h - hh);
        ctx.lineTo(x + w / 16, h - hh - h * 0.06);
        ctx.lineTo(x + w / 8, h - hh);
        ctx.fill();
        ctx.fillStyle = '#f7d26a';
        ctx.fillRect(x + w / 40, h - hh + h * 0.06, w / 40, h / 30);
      }
      ctx.strokeStyle = '#5a5a66';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.74, h * 0.6);
      ctx.lineTo(w * 0.8, h * 0.2);
      ctx.lineTo(w * 0.86, h * 0.6);
      ctx.moveTo(w * 0.76, h * 0.45);
      ctx.lineTo(w * 0.84, h * 0.45);
      ctx.stroke();
      break;
    }
  }
  ctx.restore();
}

/** Bild als Daten-URL (für Galerie & Leinwand) */
const cache = new Map<string, HTMLCanvasElement>();
export function artCanvas(a: ArtDef, w = 160, h = 128): HTMLCanvasElement {
  const key = `${a.id}@${w}x${h}`;
  let c = cache.get(key);
  if (!c) {
    c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    drawArtwork(c.getContext('2d') as C, a, w, h);
    cache.set(key, c);
  }
  return c;
}
