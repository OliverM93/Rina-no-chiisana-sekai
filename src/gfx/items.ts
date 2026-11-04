/**
 * Symbole für Gegenstände – prozedural gezeichnet in einem 32×32-Kästchen.
 * Werden sowohl in der Welt (am Boden, an Bäumen) als auch in der Tasche genutzt.
 */
import { darken, lighten } from '../style/palette';
import { blob, type Ctx, ellipse, roundRect, shine } from './canvas';
import { natureIcons } from './nature-icons';
import { drawPattern } from './interior';
import { FURNITURE_ITEMS, FLOORS, WALLPAPERS } from '../data/furniture';
import { RECIPE_ITEM_PREFIX, RECIPES } from '../data/recipes';
import { FINDS } from '../data/fossils';

export const ICON = 32;

type Draw = (ctx: Ctx) => void;

function fruit(color: string, leaf = '#7cc576', shape: 'rund' | 'birne' | 'pfirsich' = 'rund'): Draw {
  return (ctx) => {
    const o = darken(color, 0.3);
    if (shape === 'birne') {
      blob(ctx, [
        { x: 16, y: 21, r: 9 },
        { x: 16, y: 13, r: 6 },
      ], color, o, 1.6);
    } else {
      blob(ctx, [
        { x: 12.5, y: 18, r: 8.5 },
        { x: 19.5, y: 18, r: 8.5 },
      ], color, o, 1.6);
      if (shape === 'pfirsich') {
        ctx.strokeStyle = darken(color, 0.15);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(16, 11);
        ctx.quadraticCurveTo(13, 18, 16, 25);
        ctx.stroke();
      }
    }
    ctx.strokeStyle = '#8a6448';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(16, 11);
    ctx.lineTo(17, 6);
    ctx.stroke();
    ctx.fillStyle = leaf;
    ctx.beginPath();
    ctx.ellipse(21, 7, 4.2, 2.2, -0.4, 0, Math.PI * 2);
    ctx.fill();
    shine(ctx, 11, 15, 2.6, 0.75);
  };
}

const DRAW: Record<string, Draw> = {
  apfel: fruit('#f2787f'),
  birne: fruit('#d8e07a', '#7cc576', 'birne'),
  pfirsich: fruit('#ffb38f', '#7cc576', 'pfirsich'),

  herzmuschel: (ctx) => {
    const c = '#ffbfd0';
    ctx.beginPath();
    ctx.moveTo(16, 27);
    ctx.bezierCurveTo(1, 16, 7, 3, 16, 10);
    ctx.bezierCurveTo(25, 3, 31, 16, 16, 27);
    ctx.closePath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = darken(c, 0.3);
    ctx.stroke();
    ctx.fillStyle = c;
    ctx.fill();
    ctx.strokeStyle = lighten(c, 0.5);
    ctx.lineWidth = 1.3;
    for (const dx of [-5, 0, 5]) {
      ctx.beginPath();
      ctx.moveTo(16, 24);
      ctx.lineTo(16 + dx * 1.2, 12);
      ctx.stroke();
    }
  },
  jakobsmuschel: (ctx) => {
    const c = '#ffe1b8';
    ctx.beginPath();
    ctx.moveTo(16, 27);
    ctx.lineTo(5, 13);
    ctx.quadraticCurveTo(16, 1, 27, 13);
    ctx.closePath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = darken(c, 0.3);
    ctx.stroke();
    ctx.fillStyle = c;
    ctx.fill();
    roundRect(ctx, 12, 24, 8, 5, 2, c, darken(c, 0.3), 1);
    ctx.strokeStyle = darken(c, 0.18);
    ctx.lineWidth = 1.3;
    for (const x of [8, 12, 16, 20, 24]) {
      ctx.beginPath();
      ctx.moveTo(16, 25);
      ctx.lineTo(x, 10);
      ctx.stroke();
    }
  },
  schneckenhaus: (ctx) => {
    const c = '#f3d2e8';
    ellipse(ctx, 16, 17, 11, 10, c, darken(c, 0.3), 1.5);
    ctx.strokeStyle = darken(c, 0.25);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let t = 0; t < Math.PI * 5; t += 0.2) {
      const r = 9 - t * 0.55;
      const x = 16 + Math.cos(t) * r;
      const y = 17 + Math.sin(t) * r * 0.9;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    shine(ctx, 11, 12, 2.4, 0.8);
  },
  seestern: (ctx) => {
    const c = '#ffa07a';
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? 13 : 5.5;
      const x = 16 + Math.cos(a) * r;
      const y = 17 + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = darken(c, 0.3);
    ctx.stroke();
    ctx.fillStyle = c;
    ctx.fill();
    for (const [x, y] of [
      [16, 10],
      [11, 17],
      [21, 17],
      [16, 20],
    ]) {
      ellipse(ctx, x, y, 1.1, 1.1, lighten(c, 0.5));
    }
  },

  wildblumen: (ctx) => {
    ctx.strokeStyle = '#7fbb68';
    ctx.lineWidth = 1.8;
    for (const [x, y] of [
      [9, 10],
      [16, 7],
      [23, 10],
      [13, 14],
      [20, 14],
    ]) {
      ctx.beginPath();
      ctx.moveTo(16, 28);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    const colors = ['#ffb3c9', '#fff09a', '#c8b6e8', '#ffffff', '#ffcfa3'];
    [
      [9, 10],
      [16, 7],
      [23, 10],
      [13, 14],
      [20, 14],
    ].forEach(([x, y], i) => {
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2;
        ellipse(ctx, x + Math.cos(a) * 2.6, y + Math.sin(a) * 2.6, 2.2, 2.2, colors[i], darken(colors[i], 0.25), 0.4);
      }
      ellipse(ctx, x, y, 1.6, 1.6, '#ffd36b');
    });
    roundRect(ctx, 12, 21, 8, 5, 2, '#f497b0', darken('#f497b0', 0.3), 1);
  },

  ast: (ctx) => {
    const c = '#b5875f';
    ctx.lineCap = 'round';
    ctx.strokeStyle = darken(c, 0.3);
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(6, 25);
    ctx.lineTo(26, 8);
    ctx.moveTo(17, 16);
    ctx.lineTo(22, 22);
    ctx.stroke();
    ctx.strokeStyle = c;
    ctx.lineWidth = 4.2;
    ctx.stroke();
    ctx.fillStyle = '#8fd08a';
    ctx.beginPath();
    ctx.ellipse(25, 23, 3.5, 2, 0.6, 0, Math.PI * 2);
    ctx.fill();
  },
  stein: (ctx) => {
    const c = '#c9c4cf';
    ellipse(ctx, 16, 19, 11, 8, c, darken(c, 0.3), 1.5);
    shine(ctx, 12, 15, 3, 0.7);
  },
  glitzerstein: (ctx) => {
    const c = '#b9a6f2';
    ctx.beginPath();
    ctx.moveTo(16, 4);
    ctx.lineTo(26, 13);
    ctx.lineTo(21, 28);
    ctx.lineTo(11, 28);
    ctx.lineTo(6, 13);
    ctx.closePath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = darken(c, 0.3);
    ctx.stroke();
    ctx.fillStyle = c;
    ctx.fill();
    ctx.fillStyle = lighten(c, 0.45);
    ctx.beginPath();
    ctx.moveTo(16, 4);
    ctx.lineTo(19, 14);
    ctx.lineTo(13, 14);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#a8f0ff';
    ctx.beginPath();
    ctx.moveTo(19, 14);
    ctx.lineTo(21, 28);
    ctx.lineTo(16, 20);
    ctx.closePath();
    ctx.fill();
    ellipse(ctx, 25, 6, 1.5, 1.5, '#ffffff');
  },

  ruehrei: (ctx) => {
    ellipse(ctx, 16, 19, 13, 8, '#ffffff', '#c9c4cf', 1.4);
    blob(ctx, [{ x: 12, y: 18, r: 4.5 }, { x: 17, y: 16.5, r: 5 }, { x: 21, y: 19, r: 4 }, { x: 15, y: 21, r: 4 }], '#f7d26a', '#d9a83a', 1.2);
    for (const [x, y] of [[13, 16], [19, 20], [16, 19]] as const) ellipse(ctx, x, y, 1.1, 0.7, '#6fa86a');
  },
  'wachtel-spiegelei': (ctx) => {
    ellipse(ctx, 16, 19, 13, 8, '#ffffff', '#c9c4cf', 1.4);
    for (const [x, y] of [[11, 18], [17, 17], [21, 21], [14, 22]] as const) {
      ellipse(ctx, x, y, 3.4, 2.6, '#fbf6ec', '#e6ddd0', 0.8);
      ellipse(ctx, x, y - 0.3, 1.4, 1.2, '#f2b134');
    }
  },
  obstsalat: (ctx) => {
    ellipse(ctx, 16, 20, 12, 7, '#8ac8ff', darken('#8ac8ff', 0.3), 1.4);
    for (const [x, y, c] of [[11, 15, '#e8484f'], [16, 13, '#b8d86a'], [21, 15, '#f7b27a'], [14, 17, '#f7d26a'], [19, 17, '#e85a8a']] as const) ellipse(ctx, x, y, 3, 2.6, c, darken(c, 0.25), 0.8);
    roundRect(ctx, 4, 19, 24, 6, 3, '#8ac8ff', darken('#8ac8ff', 0.3), 1.2);
  },
  fischbroetchen: (ctx) => {
    ellipse(ctx, 16, 20, 12, 5, '#e6b06a', darken('#e6b06a', 0.3), 1.3);
    ellipse(ctx, 16, 16, 11, 3, '#b9c6cf', '#7a8a96', 1);
    roundRect(ctx, 6, 15, 20, 2.5, 1.2, '#8fd08a');
    ellipse(ctx, 16, 12.5, 11.5, 4.5, '#f2c27a', darken('#f2c27a', 0.3), 1.3);
    for (const x of [11, 16, 21]) ellipse(ctx, x, 11.5, 0.8, 0.5, '#fff6d8');
  },
  apfelkuchen: (ctx) => {
    ctx.fillStyle = '#e6b06a';
    ctx.beginPath();
    ctx.moveTo(6, 24);
    ctx.lineTo(26, 24);
    ctx.lineTo(20, 9);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = darken('#e6b06a', 0.35);
    ctx.lineWidth = 1.4;
    ctx.stroke();
    roundRect(ctx, 6, 21, 20, 4, 1.5, '#f7d9a8', darken('#e6b06a', 0.35), 1);
    for (const [x, y] of [[16, 17], [19, 14], [13, 20]] as const) ellipse(ctx, x, y, 1.6, 1.1, '#f7f2c8');
  },
  crepes: (ctx) => {
    ellipse(ctx, 16, 22, 12, 5, '#ffffff', '#c9c4cf', 1.2);
    ctx.fillStyle = '#f2d39a';
    ctx.beginPath();
    ctx.moveTo(6, 21);
    ctx.quadraticCurveTo(16, 6, 26, 21);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#c9955f';
    ctx.lineWidth = 1.3;
    ctx.stroke();
    ellipse(ctx, 16, 18, 3, 2, '#f7b27a', '#d9845a', 0.8);
    ellipse(ctx, 20, 12, 1.4, 1.4, '#e8484f');
  },
  lavendelkekse: (ctx) => {
    for (const [x, y] of [[12, 18], [20, 15]] as const) {
      ellipse(ctx, x, y, 7, 7, '#f2d39a', darken('#f2d39a', 0.3), 1.3);
      for (const [dx, dy] of [[-2, -1], [1, 1], [2, -2], [-1, 2]] as const) ellipse(ctx, x + dx, y + dy, 0.9, 0.9, '#a98ad8');
    }
  },
  ei: (ctx) => {
    ellipse(ctx, 16, 17, 8.5, 10.5, '#f7ead6', '#c9a77a', 1.4);
    shine(ctx, 13, 12, 2.4);
  },
  wachtelei: (ctx) => {
    for (const [x, y] of [[12, 18], [20, 16]] as const) {
      ellipse(ctx, x, y, 5.5, 7, '#efe2cc', '#a98a66', 1.2);
      for (const [dx, dy, r] of [[-1.5, -2, 1.3], [1.8, 0.5, 1.1], [-0.5, 2.5, 1.4], [1, -3.5, 0.8]] as const) ellipse(ctx, x + dx, y + dy, r, r * 0.8, '#6e5236');
      shine(ctx, x - 2, y - 3, 1.2);
    }
  },
  keks: (ctx) => {
    const c = '#e9c08a';
    ellipse(ctx, 16, 16, 11, 11, c, darken(c, 0.3), 1.5);
    ellipse(ctx, 16, 16, 7.5, 7.5, lighten(c, 0.15));
    for (const [x, y] of [
      [13, 13],
      [19, 14],
      [15, 19],
      [20, 19],
    ]) {
      ellipse(ctx, x, y, 1.6, 1.4, '#8a5a3c');
    }
    // Herz aus Zuckerguss
    ctx.fillStyle = '#ffc6d9';
    ctx.beginPath();
    ctx.moveTo(16, 18);
    ctx.bezierCurveTo(12, 15, 13.5, 11.5, 16, 13.5);
    ctx.bezierCurveTo(18.5, 11.5, 20, 15, 16, 18);
    ctx.fill();
  },
  strickschal: (ctx) => {
    const c = '#f7a8be';
    ctx.lineCap = 'round';
    ctx.strokeStyle = darken(c, 0.3);
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(6, 10);
    ctx.quadraticCurveTo(16, 18, 26, 10);
    ctx.moveTo(22, 13);
    ctx.lineTo(23, 27);
    ctx.stroke();
    ctx.strokeStyle = c;
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    for (const y of [18, 22]) {
      ctx.beginPath();
      ctx.moveTo(20.5, y);
      ctx.lineTo(25.5, y);
      ctx.stroke();
    }
  },
  'omas-foto': (ctx) => {
    roundRect(ctx, 5, 5, 22, 23, 2, '#ffffff', '#c9b6a8', 1.2);
    roundRect(ctx, 8, 8, 16, 14, 1, '#cfe9f7', null);
    ellipse(ctx, 16, 15, 4.2, 4.2, '#ffe3cf');
    blob(ctx, [{ x: 16, y: 13, r: 4.5 }], '#c8c2c8', null);
    ellipse(ctx, 16, 16, 3.4, 3, '#ffe3cf');
    roundRect(ctx, 11, 19, 10, 3, 1.5, '#c8b6e8', null);
  },
  keksrezept: (ctx) => {
    roundRect(ctx, 6, 4, 20, 25, 3, '#fff8e6', '#d9c4a0', 1.2);
    ctx.strokeStyle = '#c9b08f';
    ctx.lineWidth = 1.3;
    for (let y = 11; y < 26; y += 4) {
      ctx.beginPath();
      ctx.moveTo(9, y);
      ctx.lineTo(23, y);
      ctx.stroke();
    }
    ellipse(ctx, 21, 23, 4, 4, '#e9c08a', darken('#e9c08a', 0.3), 0.8);
  },
};

Object.assign(DRAW, natureIcons());

// Tapeten & Böden: das Muster als Kachel
for (const def of [...WALLPAPERS, ...FLOORS]) {
  DRAW[def.id] = (ctx) => {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(4, 4, 24, 24, 4);
    ctx.clip();
    ctx.translate(4, 4);
    drawPattern(ctx as CanvasRenderingContext2D, def, 24);
    ctx.restore();
    ctx.strokeStyle = darken(def.color, 0.3);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(4, 4, 24, 24, 4);
    ctx.stroke();
  };
}
// Möbel: Platzhalter, bis die 3D-Vorschaubilder fertig sind (setIconImage)
for (const f of FURNITURE_ITEMS) DRAW[f.itemId] = (ctx) => roundRect(ctx, 7, 9, 18, 16, 4, f.color ?? '#e6c59c', darken(f.color ?? '#e6c59c', 0.3), 1.4);

// Rezeptkarten: Papierrolle mit Hammer-Zeichen
for (const r of RECIPES) {
  DRAW[`${RECIPE_ITEM_PREFIX}${r.id}`] = (ctx) => {
    roundRect(ctx, 6, 5, 20, 23, 3, '#fff3d6', '#d9b77a', 1.3);
    roundRect(ctx, 4, 4, 24, 4, 2, '#e6c59c', '#b98a5e', 1);
    roundRect(ctx, 4, 26, 24, 4, 2, '#e6c59c', '#b98a5e', 1);
    ctx.strokeStyle = '#c9a77a';
    ctx.lineWidth = 1.2;
    for (const y of [12, 16]) {
      ctx.beginPath();
      ctx.moveTo(9, y);
      ctx.lineTo(16, y);
      ctx.stroke();
    }
    roundRect(ctx, 17, 11, 7, 4, 1, '#8a8a96', '#5a5a66', 0.8);
    roundRect(ctx, 19.6, 15, 1.8, 8, 0.8, '#b98a5e', '#7a5038', 0.6);
  };
}

// Tees aus Lars' Apotheke: Tasse in der Farbe des Tees
for (const [id, tea, leaf] of [['kamillentee', '#f2d36a', '#ffffff'], ['pfefferminztee', '#8fcf7a', '#4f9a5a'], ['lavendeltee', '#c3a8e8', '#8a6ad8'], ['kraeutermischung', '#d9b86a', '#6fbf73']] as const) {
  DRAW[id] = (ctx) => {
    ellipse(ctx, 16, 26, 11, 3, '#f7f5ec', '#c9c4cf', 1);
    roundRect(ctx, 7, 12, 16, 13, [2, 2, 6, 6], '#ffffff', '#c9c4cf', 1.3);
    ellipse(ctx, 15, 13, 7.4, 2.2, tea, darken(tea, 0.25), 0.8);
    ctx.strokeStyle = '#c9c4cf';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(24, 18, 3.2, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ellipse(ctx, 13, 19, 2, 2.6, leaf, darken(leaf, 0.3), 0.7);
    ctx.strokeStyle = 'rgba(180,180,190,0.7)';
    ctx.lineWidth = 1.2;
    for (const x of [12, 17]) {
      ctx.beginPath();
      ctx.moveTo(x, 9);
      ctx.quadraticCurveTo(x + 2, 6, x, 3);
      ctx.stroke();
    }
  };
}

// Fossilien & Kristalle
const FIND_DRAW: Record<string, (ctx: Ctx, c: string, a: string) => void> = {
  ammonit: (ctx, c, a) => {
    ellipse(ctx, 16, 17, 11, 11, c, darken(c, 0.35), 1.4);
    ctx.strokeStyle = a;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let t = 0; t < 14; t += 0.2) {
      const r = 10 - t * 0.68;
      const x = 16 + Math.cos(t) * r;
      const y = 17 + Math.sin(t) * r;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  },
  trilobit: (ctx, c, a) => {
    ellipse(ctx, 16, 17, 9, 12, c, darken(c, 0.35), 1.4);
    ellipse(ctx, 16, 8, 7, 4, lighten(c, 0.1), darken(c, 0.35), 1.2);
    ctx.strokeStyle = a;
    ctx.lineWidth = 1.2;
    for (let y = 12; y < 28; y += 2.6) {
      ctx.beginPath();
      ctx.moveTo(8, y);
      ctx.lineTo(24, y);
      ctx.stroke();
    }
    roundRect(ctx, 13.5, 10, 5, 17, 2.5, a, null);
  },
  haizahn: (ctx, c, a) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(8, 24);
    ctx.quadraticCurveTo(16, 2, 24, 24);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = a;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    roundRect(ctx, 7, 23, 18, 5, 2, '#b8a48a', '#8a7658', 1);
    shine(ctx, 13, 15, 1.6);
  },
  'versteinertes-holz': (ctx, c, a) => {
    ellipse(ctx, 16, 17, 12, 9, c, darken(c, 0.35), 1.4);
    for (const r of [7, 4.5, 2]) {
      ctx.strokeStyle = a;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(16, 17, r * 1.3, r, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  },
  bernstein: (ctx, c, a) => {
    blob(ctx, [{ x: 13, y: 16, r: 8 }, { x: 19, y: 18, r: 7 }, { x: 16, y: 12, r: 6 }], c, a, 1.4);
    ellipse(ctx, 16, 16, 2, 1.2, '#5a3a1a');
    ctx.strokeStyle = '#5a3a1a';
    ctx.lineWidth = 0.6;
    for (const dx of [-2, 2]) {
      ctx.beginPath();
      ctx.moveTo(16, 16);
      ctx.lineTo(16 + dx, 13.5);
      ctx.stroke();
    }
    shine(ctx, 12, 12, 2.2);
  },
  'seeigel-fossil': (ctx, c, a) => {
    ellipse(ctx, 16, 17, 11, 9, c, darken(c, 0.35), 1.4);
    for (let k = 0; k < 5; k++) {
      const ang = (k / 5) * Math.PI * 2 - Math.PI / 2;
      ctx.strokeStyle = a;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(16, 16);
      ctx.lineTo(16 + Math.cos(ang) * 8, 16 + Math.sin(ang) * 6.5);
      ctx.stroke();
    }
  },
  'farn-abdruck': (ctx, c, a) => {
    roundRect(ctx, 5, 6, 22, 21, 6, c, darken(c, 0.35), 1.4);
    ctx.strokeStyle = a;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(10, 24);
    ctx.lineTo(22, 9);
    ctx.stroke();
    for (let k = 1; k < 7; k++) {
      const x = 10 + k * 1.8;
      const y = 24 - k * 2.2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 3.5, y - 2.5);
      ctx.moveTo(x, y);
      ctx.lineTo(x + 2.5, y + 2.5);
      ctx.stroke();
    }
  },
};
function crystal(ctx: Ctx, c: string, a: string) {
  ellipse(ctx, 16, 25, 11, 4, '#9a9aa4', '#6a6a74', 1);
  for (const [x, h, w] of [[11, 14, 4], [16, 19, 5], [21, 12, 4]] as const) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(x - w, 25);
    ctx.lineTo(x - w, 25 - h * 0.7);
    ctx.lineTo(x, 25 - h);
    ctx.lineTo(x + w, 25 - h * 0.7);
    ctx.lineTo(x + w, 25);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = a;
    ctx.lineWidth = 1.1;
    ctx.stroke();
  }
  shine(ctx, 15, 11, 1.4);
}
for (const f of FINDS) {
  DRAW[f.id] = (ctx) => {
    if (f.id === 'achat') {
      ellipse(ctx, 16, 17, 12, 10, f.color, darken(f.color, 0.35), 1.4);
      for (const [r, c] of [[8, f.accent], [5, '#c97a4a'], [2.5, f.accent]] as const) ellipse(ctx, 16, 17, r * 1.2, r, c);
      return;
    }
    if (f.id === 'rosenquarz') {
      blob(ctx, [{ x: 13, y: 18, r: 8 }, { x: 20, y: 17, r: 7 }], f.color, f.accent, 1.4);
      shine(ctx, 12, 14, 2.4);
      return;
    }
    (FIND_DRAW[f.id] ?? crystal)(ctx, f.color, f.accent);
  };
}
// Schaufel
DRAW.schaufel = (ctx) => {
  ctx.save();
  ctx.translate(16, 16);
  ctx.rotate(-0.7);
  roundRect(ctx, -1.6, -14, 3.2, 16, 1.4, '#b98a5e', '#7a5038', 1);
  roundRect(ctx, -4, -15, 8, 3, 1.4, '#3f7a62', '#2a5a44', 0.8);
  ctx.fillStyle = '#a9acb8';
  ctx.beginPath();
  ctx.moveTo(-6, 2);
  ctx.lineTo(6, 2);
  ctx.quadraticCurveTo(6, 13, 0, 15);
  ctx.quadraticCurveTo(-6, 13, -6, 2);
  ctx.fill();
  ctx.strokeStyle = '#6a6c78';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();
};

const imageOverrides = new Map<string, string>();

/** Fertiges Bild (z. B. 3D-Vorschau eines Möbels) als Symbol verwenden */
export function setIconImage(itemId: string, url: string) {
  imageOverrides.set(itemId, url);
}

/** Zeichnet das Symbol eines Gegenstands (32×32 Einheiten). */
export function drawItemIcon(ctx: Ctx, itemId: string) {
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const draw = DRAW[itemId];
  if (draw) {
    draw(ctx);
    return;
  }
  // Platzhalter
  roundRect(ctx, 6, 6, 20, 20, 6, '#f3cad6', '#e27896', 1.2);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('?', 16, 17);
}

const urlCache = new Map<string, string>();

/** Symbol als Bild-URL für die Oberfläche. */
export function itemIconUrl(itemId: string, size = 64): string {
  const override = imageOverrides.get(itemId);
  if (override) return override;
  const key = `${itemId}@${size}`;
  const cached = urlCache.get(key);
  if (cached) return cached;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d') as Ctx;
  ctx.scale(size / ICON, size / ICON);
  drawItemIcon(ctx, itemId);
  const url = canvas.toDataURL('image/png');
  urlCache.set(key, url);
  return url;
}

export function hasIcon(itemId: string): boolean {
  return itemId in DRAW;
}
