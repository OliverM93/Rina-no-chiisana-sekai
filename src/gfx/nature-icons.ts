/**
 * Symbole für Fische, Insekten, Gartenblumen, Samen und Werkzeuge
 * (32×32 Einheiten). Fische & Insekten werden aus Form + Farben der Art gezeichnet.
 */
import { GARDEN_FLOWERS } from '../data/items';
import { FISH, type FishDef, INSECTS, type InsectDef } from '../data/species';
import { darken, lighten } from '../style/palette';
import { blob, type Ctx, ellipse, roundRect, shine } from './canvas';

type Draw = (ctx: Ctx) => void;

function fishIcon(f: FishDef): Draw {
  return (ctx) => {
    const c = f.color;
    const o = darken(c, 0.35);
    if (f.shape === 'qualle') {
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(5, 17);
      ctx.bezierCurveTo(5, 4, 27, 4, 27, 17);
      ctx.closePath();
      ctx.fillStyle = c;
      ctx.fill();
      ctx.strokeStyle = o;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
      for (const x of [11, 16, 21]) ellipse(ctx, x, 12, 2.2, 2.2, 'rgba(0,0,0,0)', f.accent, 1.4);
      ctx.strokeStyle = f.accent;
      for (const x of [9, 13, 17, 21, 24]) {
        ctx.beginPath();
        ctx.moveTo(x, 17);
        ctx.quadraticCurveTo(x - 2, 22, x, 28);
        ctx.stroke();
      }
      return;
    }
    if (f.shape === 'seepferdchen') {
      blob(ctx, [{ x: 17, y: 9, r: 4 }, { x: 15, y: 15, r: 4.5 }, { x: 16, y: 21, r: 3.5 }], c, o, 1.4);
      ctx.strokeStyle = c;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(16, 23);
      ctx.quadraticCurveTo(20, 29, 22, 24);
      ctx.stroke();
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(19, 8);
      ctx.lineTo(25, 9);
      ctx.stroke();
      ellipse(ctx, 18, 8, 1, 1, '#2b2a31');
      return;
    }
    const long = f.shape === 'aal';
    const flat = f.shape === 'platt';
    const ry = long ? 3.2 : flat ? 8 : 4 + f.size * 0.6;
    const rx = long ? 12 : flat ? 9 : 9.5;
    // Schwanz
    ctx.fillStyle = darken(c, 0.1);
    ctx.beginPath();
    ctx.moveTo(26 - (long ? 0 : 2), 16);
    ctx.lineTo(30, 16 - ry * 0.8 - 1);
    ctx.lineTo(30, 16 + ry * 0.8 + 1);
    ctx.closePath();
    ctx.fill();
    ellipse(ctx, 15, 16, rx, ry, c, o, 1.4);
    // Muster
    ctx.fillStyle = f.accent;
    if (flat) for (const [x, y] of [[12, 13], [17, 18], [19, 12], [11, 19]]) ellipse(ctx, x, y, 1.3, 1.3, f.accent);
    else {
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(10, 16 - ry + 1);
      ctx.quadraticCurveTo(15, 16 - ry - 3, 20, 16 - ry + 1);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ellipse(ctx, 9, 15, 1.6, 1.6, '#ffffff');
    ellipse(ctx, 8.6, 15, 0.9, 0.9, '#2b2a31');
    shine(ctx, 14, 13, 2, 0.5);
  };
}

function insectIcon(i: InsectDef): Draw {
  return (ctx) => {
    const c = i.color;
    const a = i.accent;
    const o = darken(c, 0.4);
    switch (i.shape) {
      case 'falter':
      case 'nachtfalter': {
        for (const s of [-1, 1]) {
          ellipse(ctx, 16 + s * 7, 12, 7, 6, c, o, 1.2);
          ellipse(ctx, 16 + s * 5.5, 21, 5, 4.5, lighten(c, 0.05), o, 1.2);
          ellipse(ctx, 16 + s * 7, 12, 2.2, 2.2, a);
        }
        roundRect(ctx, 14.8, 8, 2.4, 17, 1.2, darken(c, 0.6), null);
        ctx.strokeStyle = darken(c, 0.6);
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(15.5, 8);
        ctx.lineTo(13, 4);
        ctx.moveTo(16.5, 8);
        ctx.lineTo(19, 4);
        ctx.stroke();
        return;
      }
      case 'biene': {
        for (const s of [-1, 1]) ellipse(ctx, 16 + s * 6, 10, 5, 3.5, 'rgba(230,240,255,0.9)', '#a8b8d0', 1);
        ellipse(ctx, 16, 18, 7, 8, c, o, 1.4);
        ctx.fillStyle = a;
        for (const y of [15, 20]) ctx.fillRect(9.5, y, 13, 2.4);
        ellipse(ctx, 16, 9.5, 3.5, 3, a);
        return;
      }
      case 'libelle': {
        for (const [y, s] of [[12, 1], [16, 0.85]] as const) for (const d of [-1, 1]) ellipse(ctx, 16 + d * 8, y, 7.5 * s, 2.4, 'rgba(225,242,255,0.9)', '#9fc0d8', 0.9);
        roundRect(ctx, 14.8, 8, 2.4, 20, 1.2, c, o, 0.8);
        ellipse(ctx, 16, 8, 3, 2.6, darken(c, 0.2));
        return;
      }
      case 'gluehwurm': {
        ctx.fillStyle = 'rgba(240,250,140,0.35)';
        ctx.beginPath();
        ctx.arc(16, 19, 11, 0, Math.PI * 2);
        ctx.fill();
        ellipse(ctx, 16, 13, 4, 5, a, darken(a, 0.3), 1);
        ellipse(ctx, 16, 21, 4.5, 4.5, c, darken(c, 0.2), 1);
        return;
      }
      case 'kaefer':
      case 'ameise': {
        ctx.strokeStyle = '#2b2a31';
        ctx.lineWidth = 1.3;
        for (const y of [13, 17, 21]) {
          ctx.beginPath();
          ctx.moveTo(8, y + 2);
          ctx.lineTo(24, y - 1);
          ctx.moveTo(24, y + 2);
          ctx.lineTo(8, y - 1);
          ctx.stroke();
        }
        if (i.shape === 'ameise') {
          for (const [y, r] of [[9, 3.2], [15, 2.4], [22, 4.4]] as const) ellipse(ctx, 16, y, r, r * 1.1, c, o, 1.2);
          return;
        }
        if (i.id === 'hirschkaefer') {
          ctx.strokeStyle = a;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(14, 8);
          ctx.quadraticCurveTo(9, 3, 12, 1.5);
          ctx.moveTo(18, 8);
          ctx.quadraticCurveTo(23, 3, 20, 1.5);
          ctx.stroke();
        }
        ellipse(ctx, 16, 9.5, 4, 3, darken(c, 0.5));
        ellipse(ctx, 16, 18, 8, 9, c, o, 1.4);
        ctx.strokeStyle = o;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(16, 10);
        ctx.lineTo(16, 27);
        ctx.stroke();
        if (i.id === 'marienkaefer') for (const [x, y] of [[12, 15], [20, 15], [12, 22], [20, 22], [16, 19]]) ellipse(ctx, x, y, 1.8, 1.8, a);
        if (i.id === 'maikaefer') for (const y of [14, 18, 22]) for (const s of [-1, 1]) ellipse(ctx, 16 + s * 6.5, y, 1.2, 1, a);
        shine(ctx, 12.5, 14, 2.2, 0.55);
        return;
      }
      case 'heuschrecke': {
        ctx.strokeStyle = a;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(18, 18);
        ctx.lineTo(26, 10);
        ctx.lineTo(29, 24);
        ctx.moveTo(8, 12);
        ctx.lineTo(3, 4);
        ctx.stroke();
        ellipse(ctx, 16, 18, 10, 4.2, c, o, 1.3);
        ellipse(ctx, 7.5, 15, 3.6, 3.6, c, o, 1.2);
        ellipse(ctx, 6.6, 14.5, 0.9, 0.9, '#2b2a31');
        return;
      }
      case 'wasserlaeufer': {
        ctx.strokeStyle = a;
        ctx.lineWidth = 1.2;
        for (const [x1, y1, x2, y2] of [[16, 14, 5, 5], [16, 14, 27, 5], [16, 18, 3, 18], [16, 18, 29, 18], [16, 22, 6, 30], [16, 22, 26, 30]]) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        ellipse(ctx, 16, 18, 2.4, 8, c, o, 1);
        return;
      }
      case 'schnecke': {
        roundRect(ctx, 4, 20, 24, 6, 3, '#c8b49a', darken('#c8b49a', 0.3), 1.2);
        ellipse(ctx, 17, 15, 8, 8, c, o, 1.4);
        ctx.strokeStyle = o;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(17, 15, 4.5, 0, Math.PI * 1.6);
        ctx.stroke();
        ctx.strokeStyle = '#a8957a';
        ctx.beginPath();
        ctx.moveTo(6, 21);
        ctx.lineTo(4, 15);
        ctx.moveTo(8, 21);
        ctx.lineTo(8, 15);
        ctx.stroke();
        return;
      }
      case 'krabbe': {
        ctx.strokeStyle = darken(c, 0.2);
        ctx.lineWidth = 1.6;
        for (const y of [18, 21, 24]) {
          ctx.beginPath();
          ctx.moveTo(6, y);
          ctx.lineTo(26, y);
          ctx.stroke();
        }
        for (const s of [-1, 1]) ellipse(ctx, 16 + s * 10, 10, 3.5, 3, c, o, 1.2);
        ellipse(ctx, 16, 19, 10, 6.5, c, o, 1.4);
        for (const s of [-1, 1]) ellipse(ctx, 16 + s * 3, 13.5, 1.3, 1.3, '#2b2a31');
        return;
      }
    }
  };
}

function flowerIcon(color: string, center: string, kind: string): Draw {
  return (ctx) => {
    ctx.strokeStyle = '#5fa85a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(16, 29);
    ctx.lineTo(16, 14);
    ctx.stroke();
    ellipse(ctx, 11, 22, 4, 2, '#7cc576');
    ellipse(ctx, 21, 24, 4, 2, '#7cc576');
    if (kind === 'tulpe') {
      blob(ctx, [{ x: 13, y: 11, r: 5 }, { x: 19, y: 11, r: 5 }, { x: 16, y: 9, r: 5 }], color, darken(color, 0.3), 1.3);
      shine(ctx, 13, 9, 1.6, 0.6);
    } else if (kind === 'lavendel') {
      for (let k = 0; k < 6; k++) ellipse(ctx, 16 + (k % 2 ? 1.5 : -1.5), 4 + k * 2.4, 2.6, 2, color, darken(color, 0.25), 0.8);
    } else {
      const big = kind === 'sonnenblume' ? 1.2 : kind === 'vergissmeinnicht' ? 0.8 : 1;
      for (let k = 0; k < 7; k++) {
        const a = (k / 7) * Math.PI * 2;
        ellipse(ctx, 16 + Math.cos(a) * 5 * big, 11 + Math.sin(a) * 5 * big, 3.6 * big, 3.6 * big, color, darken(color, 0.25), 0.9);
      }
      ellipse(ctx, 16, 11, 3.4 * big, 3.4 * big, center, darken(center, 0.25), 0.9);
    }
  };
}

function seedIcon(color: string): Draw {
  return (ctx) => {
    roundRect(ctx, 7, 6, 18, 22, 2.5, '#f3e2c4', '#b89a72', 1.3);
    roundRect(ctx, 7, 6, 18, 5, [2.5, 2.5, 0, 0], '#e0c79f', null);
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2;
      ellipse(ctx, 16 + Math.cos(a) * 3.5, 19 + Math.sin(a) * 3.5, 2.6, 2.6, color);
    }
    ellipse(ctx, 16, 19, 2, 2, '#f7d26a');
  };
}

const TOOL_ICONS: Record<string, Draw> = {
  angel: (ctx) => {
    ctx.strokeStyle = '#a97c56';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(6, 27);
    ctx.lineTo(25, 5);
    ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(25, 5);
    ctx.quadraticCurveTo(29, 14, 26, 22);
    ctx.stroke();
    ellipse(ctx, 10, 22, 3, 3, '#d9dbe6', '#7a8a9a', 1);
    ellipse(ctx, 26, 23, 2.4, 2.4, '#e8484f', '#a83038', 1);
  },
  netz: (ctx) => {
    ctx.strokeStyle = '#cfa175';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(5, 28);
    ctx.lineTo(15, 17);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.beginPath();
    ctx.arc(21, 11, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#7a8a9a';
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.strokeStyle = '#c8d2de';
    ctx.lineWidth = 0.7;
    for (const d of [-4, 0, 4]) {
      ctx.beginPath();
      ctx.moveTo(21 + d, 4);
      ctx.lineTo(21 + d, 18);
      ctx.moveTo(14, 11 + d);
      ctx.lineTo(28, 11 + d);
      ctx.stroke();
    }
  },
  giesskanne: (ctx) => {
    const c = '#f7a8be';
    ctx.strokeStyle = darken(c, 0.25);
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(19, 16);
    ctx.lineTo(28, 9);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(13, 12, 5, Math.PI, 0);
    ctx.stroke();
    roundRect(ctx, 5, 13, 15, 14, 3, c, darken(c, 0.3), 1.4);
    ellipse(ctx, 28.5, 8.5, 2.2, 1.4, darken(c, 0.15));
    shine(ctx, 9, 17, 1.8, 0.6);
  },
};

export function natureIcons(): Record<string, Draw> {
  const out: Record<string, Draw> = { ...TOOL_ICONS };
  for (const f of FISH) out[f.id] = fishIcon(f);
  for (const i of INSECTS) out[i.id] = insectIcon(i);
  for (const g of GARDEN_FLOWERS) {
    out[g.flower] = flowerIcon(g.color, g.center, g.flower);
    out[g.seed] = seedIcon(g.color);
  }
  return out;
}
