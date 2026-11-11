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
    case 'flach': {
      // wirklich einfarbig (nur ein ganz zarter Streifen unten als Fußleisten-Schatten)
      ctx.fillStyle = darken(color, 0.04);
      ctx.fillRect(0, s - s / 24, s, s / 24);
      break;
    }
    case 'chevron': {
      // Französisches Fischgrät: Stäbe laufen spitz in der Mitte zusammen (V-Form), links gespiegelt zu rechts
      const t = s / 6;
      const half = (mirror: boolean) => {
        ctx.save();
        if (mirror) {
          ctx.translate(s, 0);
          ctx.scale(-1, 1);
        }
        ctx.beginPath();
        ctx.rect(0, 0, s / 2, s);
        ctx.clip();
        const dx = s / 2;
        for (let k = -4; k < 12; k++) {
          const o = k * t;
          ctx.fillStyle = k % 3 === 0 ? accent : k % 3 === 1 ? color : lighten(color, 0.08);
          ctx.beginPath();
          ctx.moveTo(0, o);
          ctx.lineTo(dx, o - dx);
          ctx.lineTo(dx, o - dx + t);
          ctx.lineTo(0, o + t);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = darken(color, 0.22);
          ctx.lineWidth = Math.max(1, s / 200);
          ctx.stroke();
        }
        ctx.restore();
      };
      half(false);
      half(true);
      break;
    }
    case 'flecht': {
      // Würfelparkett (Flechtmuster): Quadrate aus je drei Stäben, abwechselnd quer und längs
      const n = 4;
      const c = s / n;
      ctx.lineWidth = Math.max(1, s / 220);
      ctx.strokeStyle = darken(color, 0.24);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const horizontal = (i + j) % 2 === 0;
          for (let k = 0; k < 3; k++) {
            ctx.fillStyle = (i + j + k) % 3 === 0 ? accent : (i + j + k) % 3 === 1 ? color : lighten(color, 0.09);
            const x = i * c + (horizontal ? 0 : (k * c) / 3);
            const y = j * c + (horizontal ? (k * c) / 3 : 0);
            const w = horizontal ? c : c / 3;
            const h = horizontal ? c / 3 : c;
            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);
          }
        }
      }
      break;
    }
    case 'schiff': {
      // Schiffsboden: lange Dielen mit versetzten Stößen in wechselnden Holztönen
      const rows = 6;
      const h = s / rows;
      ctx.lineWidth = Math.max(1, s / 220);
      ctx.strokeStyle = darken(color, 0.25);
      for (let r = 0; r < rows; r++) {
        const offset = ((r * 2 + (r % 3)) % 6) / 6; // Stoß je Reihe versetzt
        const cuts = [offset * s, ((offset + 0.5) % 1) * s].sort((a, b) => a - b);
        const bounds = [0, ...cuts, s];
        for (let i = 0; i < bounds.length - 1; i++) {
          ctx.fillStyle = (r + i * 2) % 3 === 0 ? color : (r + i * 2) % 3 === 1 ? lighten(color, 0.07) : accent;
          ctx.fillRect(bounds[i], r * h, bounds[i + 1] - bounds[i], h);
          ctx.strokeRect(bounds[i], r * h, bounds[i + 1] - bounds[i], h);
        }
      }
      break;
    }
    case 'tafel': {
      // Tafelparkett: große Felder mit dunklem Rahmen aus Stäben und parallelen Stäben in der Mitte
      const n = 2;
      const c = s / n;
      const b = c / 7;
      ctx.lineWidth = Math.max(1, s / 220);
      ctx.strokeStyle = darken(color, 0.25);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const x = i * c;
          const y = j * c;
          ctx.fillStyle = accent; // Rahmen
          ctx.fillRect(x, y, c, c);
          ctx.strokeRect(x, y, c, c);
          const vertical = (i + j) % 2 === 0;
          for (let k = 0; k < 4; k++) {
            ctx.fillStyle = k % 2 ? lighten(color, 0.07) : color;
            if (vertical) ctx.fillRect(x + b + (k * (c - 2 * b)) / 4, y + b, (c - 2 * b) / 4, c - 2 * b);
            else ctx.fillRect(x + b, y + b + (k * (c - 2 * b)) / 4, c - 2 * b, (c - 2 * b) / 4);
          }
          ctx.strokeRect(x + b, y + b, c - 2 * b, c - 2 * b);
        }
      }
      break;
    }
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
    case 'flocken': {
      // Schneeflocken in zwei Größen, versetzt (kachelbar)
      ctx.strokeStyle = accent;
      ctx.lineCap = 'round';
      const flake = (cx: number, cy: number, r: number) => {
        ctx.lineWidth = Math.max(1, r * 0.16);
        for (let i = 0; i < 3; i++) {
          const a = (i / 3) * Math.PI;
          ctx.beginPath();
          ctx.moveTo(cx - Math.cos(a) * r, cy - Math.sin(a) * r);
          ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
          ctx.stroke();
        }
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          const mx = cx + Math.cos(a) * r * 0.6;
          const my = cy + Math.sin(a) * r * 0.6;
          for (const d of [-0.6, 0.6]) {
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(mx + Math.cos(a + d) * r * 0.3, my + Math.sin(a + d) * r * 0.3);
            ctx.stroke();
          }
        }
      };
      for (const [x, y, r] of [[0.25, 0.25, 0.1], [0.75, 0.75, 0.1], [0.75, 0.2, 0.05], [0.25, 0.7, 0.05], [0.5, 0.48, 0.035], [0, 0.95, 0.035], [1, 0.95, 0.035]] as const) flake(x * s, y * s, r * s);
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
    case 'bluemchen': {
      // Streublümchen (Cottagecore): kleine Fünf-Punkt-Blüten mit Blättchen, kachelbar
      const pts: Array<[number, number, string]> = [[0.12, 0.18, accent], [0.55, 0.1, '#f2c14e'], [0.82, 0.45, accent], [0.35, 0.52, '#9ab8e0'], [0.68, 0.82, accent], [0.15, 0.78, '#f2c14e'], [0.92, 0.95, '#9ab8e0']];
      for (const [x, y, col] of pts) {
        for (const [ox, oy] of [[0, 0], [s, 0], [0, s], [-s, 0], [0, -s]]) {
          const cx = x * s + ox;
          const cy = y * s + oy;
          const r = s / 48;
          ctx.fillStyle = '#8fb08a';
          ctx.beginPath();
          ctx.ellipse(cx + r * 1.6, cy + r * 1.2, r * 1.1, r * 0.5, 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = col;
          for (let k = 0; k < 5; k++) {
            const ang = (k / 5) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r, r * 0.75, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#fff3c4';
          ctx.beginPath();
          ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
    case 'vertaefelung': {
      // senkrechte Holzleisten mit Fugen + Abschlussleiste oben
      ctx.fillStyle = accent;
      for (let x = 0; x < s; x += s / 6) ctx.fillRect(x, 0, Math.max(1, s / 90), s);
      ctx.fillStyle = lighten(color, 0.12);
      for (let x = s / 12; x < s; x += s / 6) ctx.fillRect(x - s / 40, 0, s / 20, s);
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = darken(color, 0.12);
      ctx.fillRect(0, s * 0.02, s, s / 30);
      ctx.globalAlpha = 1;
      break;
    }
    case 'kreise': {
      // Siebziger: ineinanderliegende Kreise in Orange/Braun
      const r = s / 6;
      const cols = [accent, darken(accent, 0.35), lighten(accent, 0.35)];
      for (let row = 0; row <= 3; row++) {
        for (let col = 0; col <= 3; col++) {
          const cx = col * r * 2 + (row % 2 ? r : 0);
          const cy = row * r * 2 * 0.75 + r * 0.5;
          for (const [ox, oy] of [[0, 0], [s, 0], [-s, 0], [0, s], [0, -s]]) {
            for (let k = 3; k >= 1; k--) {
              ctx.fillStyle = cols[(k + row + col) % 3];
              ctx.beginPath();
              ctx.arc(cx + ox, cy + oy, (r * 0.9 * k) / 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
      break;
    }
    case 'ranken': {
      // Ranken mit Blättchen in Gold/Braun
      ctx.strokeStyle = accent;
      ctx.lineWidth = s / 90;
      for (let col = 0; col < 2; col++) {
        const x0 = (col + 0.25) * (s / 2);
        ctx.beginPath();
        for (let y = -s * 0.05; y <= s * 1.05; y += s / 60) ctx.lineTo(x0 + Math.sin((y / s) * Math.PI * 4) * s * 0.08, y);
        ctx.stroke();
        for (let k = 0; k < 8; k++) {
          const y = (k / 8) * s;
          const x = x0 + Math.sin((y / s) * Math.PI * 4) * s * 0.08;
          const side = k % 2 ? 1 : -1;
          ctx.fillStyle = k % 3 === 0 ? '#c9a24a' : accent;
          ctx.beginPath();
          ctx.ellipse(x + side * s * 0.035, y, s * 0.03, s * 0.013, side * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
    case 'terrazzo': {
      // bunte Steinsplitter (reproduzierbar)
      const cols = [accent, '#9ab8a8', '#e8c06a', '#8a8a94', darken(accent, 0.2)];
      for (let i = 0; i < 70; i++) {
        const x = ((i * 73) % 97) / 97 * s;
        const y = ((i * 41) % 89) / 89 * s;
        const r = s / 90 + ((i * 7) % 5) * (s / 300);
        ctx.fillStyle = cols[i % cols.length];
        ctx.beginPath();
        const n = 5;
        for (let k = 0; k < n; k++) {
          const ang = (k / n) * Math.PI * 2 + i;
          const rr = r * (0.7 + ((i + k) % 3) * 0.2);
          ctx.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr);
        }
        ctx.fill();
      }
      break;
    }
    case 'fischgraet': {
      // Zickzack aus kleinen Holzstäben
      const bw = s / 8;
      const bl = s / 4;
      ctx.lineWidth = Math.max(1, s / 200);
      ctx.strokeStyle = darken(color, 0.2);
      for (let col = -1; col < 9; col++) {
        for (let row = -1; row < 6; row++) {
          const x = col * bw;
          const y = row * bl + (col % 2 ? bl / 2 : 0);
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(col % 2 ? -Math.PI / 4 : Math.PI / 4);
          ctx.fillStyle = (row + col) % 3 === 0 ? accent : (row + col) % 3 === 1 ? color : lighten(color, 0.08);
          ctx.fillRect(0, 0, bl * 0.72, bw * 0.72);
          ctx.strokeRect(0, 0, bl * 0.72, bw * 0.72);
          ctx.restore();
        }
      }
      break;
    }
    case 'beton': {
      // fleckige Fläche mit feinen Fugen alle halbe Kachel
      for (let i = 0; i < 120; i++) {
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = i % 2 ? accent : lighten(color, 0.1);
        ctx.beginPath();
        ctx.arc(((i * 53) % 101) / 101 * s, ((i * 29) % 97) / 97 * s, s / 30 + (i % 4) * (s / 80), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = darken(color, 0.15);
      ctx.fillRect(0, 0, s, Math.max(1, s / 256));
      ctx.fillRect(0, 0, Math.max(1, s / 256), s);
      ctx.fillRect(0, s / 2, s, Math.max(1, s / 256));
      ctx.fillRect(s / 2, 0, Math.max(1, s / 256), s);
      ctx.globalAlpha = 1;
      break;
    }
    case 'bauhaus': {
      // Grundformen in Grundfarben auf einem lockeren Raster
      const cols = [accent, '#f2c14e', '#3a5fa8', '#2a2a30'];
      const cell = s / 4;
      for (let gy = 0; gy < 4; gy++) {
        for (let gx = 0; gx < 4; gx++) {
          const k = (gx * 3 + gy * 5) % 7;
          if (k > 3) continue;
          const cx = gx * cell + cell / 2;
          const cy = gy * cell + cell / 2;
          const r = cell * 0.28;
          ctx.fillStyle = cols[(gx + gy * 2) % cols.length];
          ctx.beginPath();
          if (k === 0) ctx.arc(cx, cy, r, 0, Math.PI * 2);
          else if (k === 1) ctx.rect(cx - r, cy - r, r * 2, r * 2);
          else if (k === 2) {
            ctx.moveTo(cx, cy - r);
            ctx.lineTo(cx + r, cy + r);
            ctx.lineTo(cx - r, cy + r);
            ctx.closePath();
          } else ctx.arc(cx, cy, r, Math.PI, 0);
          ctx.fill();
        }
      }
      break;
    }
    case 'atomic': {
      // Fünfziger: kleine Sterne und Bumerangs
      ctx.lineCap = 'round';
      const star = (cx: number, cy: number, r: number) => {
        ctx.strokeStyle = accent;
        ctx.lineWidth = s / 160;
        for (let k = 0; k < 4; k++) {
          const ang = (k / 4) * Math.PI;
          ctx.beginPath();
          ctx.moveTo(cx - Math.cos(ang) * r, cy - Math.sin(ang) * r);
          ctx.lineTo(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r);
          ctx.stroke();
        }
        ctx.fillStyle = '#e0b04a';
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.22, 0, Math.PI * 2);
        ctx.fill();
      };
      const boomerang = (cx: number, cy: number, r: number, rot: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.fillStyle = '#d9822b';
        ctx.beginPath();
        ctx.moveTo(-r, 0);
        ctx.quadraticCurveTo(0, -r * 1.2, r, 0);
        ctx.quadraticCurveTo(0, -r * 0.5, -r, 0);
        ctx.fill();
        ctx.restore();
      };
      for (const [x, y] of [[0.2, 0.2], [0.7, 0.55], [0.35, 0.85]]) for (const [ox, oy] of [[0, 0], [s, 0], [0, s], [-s, 0], [0, -s]]) star(x * s + ox, y * s + oy, s / 14);
      for (const [x, y, r] of [[0.65, 0.15, 0.4], [0.15, 0.6, -0.8], [0.85, 0.9, 1.6]]) for (const [ox, oy] of [[0, 0], [s, 0], [0, s], [-s, 0], [0, -s]]) boomerang(x * s + ox, y * s + oy, s / 12, r);
      break;
    }
    case 'schach': {
      const n = 4;
      const t = s / n;
      for (let gy = 0; gy < n; gy++) {
        for (let gx = 0; gx < n; gx++) {
          ctx.fillStyle = (gx + gy) % 2 ? accent : color;
          ctx.fillRect(gx * t, gy * t, t, t);
        }
      }
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = '#ffffff';
      for (let gy = 0; gy < n; gy++) for (let gx = 0; gx < n; gx++) ctx.fillRect(gx * t + t * 0.1, gy * t + t * 0.1, t * 0.25, t * 0.04);
      ctx.globalAlpha = 1;
      break;
    }
    case 'kacheln': {
      // weiße Fliesen mit Fugen, unten eine farbige Bordüre
      const n = 6;
      const t = s / n;
      ctx.fillStyle = darken(color, 0.1);
      for (let i = 0; i <= n; i++) {
        ctx.fillRect(i * t - 1, 0, Math.max(1, s / 200), s);
        ctx.fillRect(0, i * t - 1, s, Math.max(1, s / 200));
      }
      ctx.fillStyle = accent;
      ctx.fillRect(0, t * 4, s, t * 0.5);
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#ffffff';
      for (let gy = 0; gy < n; gy++) for (let gx = 0; gx < n; gx++) ctx.fillRect(gx * t + t * 0.15, gy * t + t * 0.15, t * 0.18, t * 0.05);
      ctx.globalAlpha = 1;
      break;
    }
    case 'glas': {
      // große Scheiben mit Sprossen, dahinter Himmel und Garten
      const g = ctx.createLinearGradient(0, 0, 0, s);
      g.addColorStop(0, lighten(color, 0.3));
      g.addColorStop(0.62, color);
      g.addColorStop(0.62, lighten(accent, 0.2));
      g.addColorStop(1, accent);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
      // Büsche hinter dem Glas
      ctx.fillStyle = darken(accent, 0.1);
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc((i + 0.3) * (s / 5.5), s * 0.66, s * 0.09, Math.PI, 0);
        ctx.fill();
      }
      ctx.fillStyle = '#ffffff';
      const bar = s / 48;
      ctx.fillRect(0, 0, bar, s);
      ctx.fillRect(s / 2 - bar / 2, 0, bar, s);
      ctx.fillRect(0, s * 0.33, s, bar);
      ctx.fillRect(0, s - bar * 2, s, bar * 2);
      ctx.globalAlpha = 0.3;
      ctx.fillRect(s * 0.1, s * 0.05, s * 0.05, s * 0.22);
      ctx.fillRect(s * 0.6, s * 0.05, s * 0.05, s * 0.22);
      ctx.globalAlpha = 1;
      break;
    }
    case 'backstein': {
      const rows = 8;
      const h = s / rows;
      const w = s / 4;
      ctx.fillStyle = accent;
      ctx.fillRect(0, 0, s, s);
      for (let r = 0; r < rows; r++) {
        const off = r % 2 ? w / 2 : 0;
        for (let k = -1; k < 5; k++) {
          const shade = ((r * 7 + k * 3) % 5) / 30;
          ctx.fillStyle = shade > 0.08 ? darken(color, shade) : lighten(color, shade);
          ctx.fillRect(k * w + off + s / 160, r * h + s / 160, w - s / 80, h - s / 80);
        }
      }
      break;
    }
    case 'terrakotta': {
      const n = 4;
      const t = s / n;
      for (let gy = 0; gy < n; gy++) {
        for (let gx = 0; gx < n; gx++) {
          const k = (gx * 5 + gy * 3) % 4;
          ctx.fillStyle = k === 0 ? accent : k === 1 ? lighten(color, 0.06) : color;
          ctx.fillRect(gx * t + s / 128, gy * t + s / 128, t - s / 64, t - s / 64);
        }
      }
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
