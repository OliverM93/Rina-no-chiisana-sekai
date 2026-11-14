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
import { ARTWORKS } from '../data/art';
import { artCanvas } from './art';
import { POSTERS } from '../data/posters';
import { TASSEN } from '../data/tassen';
import { BOUQUETS } from '../data/straeusse';
import { posterCanvas } from './posters';

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
  'koeder-gluckswurm': (ctx) => {
    const c = '#e58fb0';
    ctx.strokeStyle = darken(c, 0.3);
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(6, 22);
    ctx.bezierCurveTo(10, 10, 18, 26, 22, 12);
    ctx.stroke();
    ctx.strokeStyle = c;
    ctx.lineWidth = 5.4;
    ctx.beginPath();
    ctx.moveTo(6, 22);
    ctx.bezierCurveTo(10, 10, 18, 26, 22, 12);
    ctx.stroke();
    ellipse(ctx, 24, 10, 3.6, 3.4, lighten(c, 0.1), darken(c, 0.3), 1);
    ellipse(ctx, 25, 9, 0.9, 0.9, '#4a2a35');
    for (const [x, y] of [[8, 6], [27, 22], [14, 6]]) {
      ctx.fillStyle = '#ffe58a';
      ctx.beginPath();
      ctx.arc(x, y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  'koeder-teig': (ctx) => {
    const c = '#e9c08a';
    ellipse(ctx, 16, 19, 11, 8, c, darken(c, 0.3), 1.5);
    ellipse(ctx, 13, 17, 5, 3.4, lighten(c, 0.15));
    ellipse(ctx, 20, 21, 3, 2, darken(c, 0.12));
    shine(ctx, 11, 15, 2.4, 0.7);
    ctx.strokeStyle = '#8aa86b';
    ctx.lineWidth = 1.6;
    for (const dx of [-5, 0, 5]) {
      ctx.beginPath();
      ctx.moveTo(16 + dx, 10);
      ctx.bezierCurveTo(14 + dx, 7, 18 + dx, 5, 16 + dx, 2);
      ctx.stroke();
    }
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
  // Gerichte aus eigenem Gemüse & Kräutern
  tomatensalat: (ctx) => {
    ellipse(ctx, 16, 21, 12, 6.5, '#fdf6e8', '#c9c4cf', 1.4);
    for (const [x, y] of [[10, 17], [15, 15], [21, 17], [13, 20], [19, 20]] as const) ellipse(ctx, x, y, 3.2, 2.6, '#e8484f', darken('#e8484f', 0.3), 0.8);
    for (const [x, y] of [[12, 16], [18, 17], [16, 19]] as const) ellipse(ctx, x, y, 2.2, 1.4, '#4fa84f', '#3f7a3a', 0.6);
    roundRect(ctx, 4, 20, 24, 6, 3, '#fdf6e8', '#c9c4cf', 1.2);
  },
  kartoffelsuppe: (ctx) => {
    ellipse(ctx, 16, 17, 12, 6.5, '#f7e9c0', '#c9a36a', 1.2);
    for (const [x, y] of [[11, 16], [17, 15], [21, 18], [14, 19]] as const) ellipse(ctx, x, y, 2, 1.4, '#e6c98a');
    for (const [x, y] of [[13, 15], [19, 17], [16, 18]] as const) ellipse(ctx, x, y, 1.1, 0.5, '#5fa85a');
    roundRect(ctx, 4, 17, 24, 9, [1, 1, 9, 9], '#c9a36a', darken('#c9a36a', 0.35), 1.3);
  },
  kraeuterquark: (ctx) => {
    ellipse(ctx, 16, 21, 12.5, 6.5, '#ffffff', '#c9c4cf', 1.4);
    ellipse(ctx, 21, 19, 5.5, 3.4, '#fbf6ec', '#e6ddd0', 0.8);
    for (const [x, y] of [[19, 18.5], [22, 19.5], [21, 17.8]] as const) ellipse(ctx, x, y, 1, 0.6, '#4fa84f');
    for (const [x, y] of [[9, 18], [13, 20]] as const) ellipse(ctx, x, y, 3.6, 2.8, '#e6c98a', darken('#c9a36a', 0.2), 1);
    ellipse(ctx, 8, 17, 1.3, 0.8, '#c9a36a');
  },
  karottensuppe: (ctx) => {
    ellipse(ctx, 16, 17, 12, 6.5, '#f59a3a', darken('#f59a3a', 0.3), 1.2);
    ellipse(ctx, 14, 16, 4, 1.4, '#f7b27a');
    for (const [x, y] of [[17, 17], [21, 18], [12, 19]] as const) ellipse(ctx, x, y, 1.3, 0.7, '#3f8f4a');
    roundRect(ctx, 4, 17, 24, 9, [1, 1, 9, 9], '#fdf6e8', '#c9c4cf', 1.3);
    roundRect(ctx, 4, 17, 24, 2.5, 1, '#e8484f', null);
  },
  ratatouille: (ctx) => {
    ellipse(ctx, 16, 20, 13, 7, '#d98a5f', darken('#d98a5f', 0.3), 1.4);
    ellipse(ctx, 16, 18.5, 11, 5.5, '#fdf6e8', '#c9c4cf', 0.8);
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      const c = ['#e8484f', '#4f9a5a', '#7a3a8a'][k % 3];
      ellipse(ctx, 16 + Math.cos(a) * 5, 18.5 + Math.sin(a) * 2.4, 2.6, 1.9, c, darken(c, 0.3), 0.6);
    }
    ellipse(ctx, 16, 18.5, 2.4, 1.7, '#f7d26a', '#d9a83a', 0.6);
    ellipse(ctx, 16, 17.6, 1.2, 0.8, '#4fa84f');
  },
  'gruener-salat': (ctx) => {
    ellipse(ctx, 16, 20, 12.5, 7, '#8ac8ff', darken('#8ac8ff', 0.3), 1.4);
    for (const [x, y, c] of [[10, 15, '#8fd08a'], [16, 12.5, '#b8e6a0'], [22, 15, '#8fd08a'], [13, 17, '#6fbf5f'], [19, 17, '#6fbf5f']] as const) ellipse(ctx, x, y, 4, 3, c, darken(c, 0.25), 0.8);
    for (const [x, y] of [[14, 14], [20, 15]] as const) ellipse(ctx, x, y, 2, 1.7, '#e8484f', '#a83038', 0.6);
    roundRect(ctx, 4, 19, 24, 6, 3, '#8ac8ff', darken('#8ac8ff', 0.3), 1.2);
  },
  kuerbissuppe: (ctx) => {
    ellipse(ctx, 16, 17, 12, 6.5, '#f59a3a', darken('#f08a2a', 0.3), 1.2);
    ellipse(ctx, 13, 16, 5, 1.5, '#f7b27a');
    for (const [x, y] of [[18, 17], [21, 18.5]] as const) ellipse(ctx, x, y, 1.3, 0.6, '#5fa85a');
    roundRect(ctx, 4, 17, 24, 9, [1, 1, 9, 9], '#f08a2a', darken('#f08a2a', 0.35), 1.3);
    for (const x of [10, 16, 22]) ctx.fillRect(x, 19, 0.8, 5);
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
  osterei: (ctx) => {
    ellipse(ctx, 16, 17, 9, 11.5, '#8ac8ff', darken('#8ac8ff', 0.3), 1.4);
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(16, 17, 9, 11.5, 0, 0, Math.PI * 2);
    ctx.clip();
    roundRect(ctx, 5, 13, 22, 3.5, 1, '#f7d26a');
    roundRect(ctx, 5, 20, 22, 3.5, 1, '#e85a8a');
    for (const x of [10, 16, 22]) ellipse(ctx, x, 9, 1.3, 1.3, '#ffffff');
    ctx.restore();
    shine(ctx, 12.5, 10, 2);
  },
  schneeball: (ctx) => {
    ellipse(ctx, 16, 18, 10, 9.5, '#ffffff', '#b8cfe0', 1.5);
    ellipse(ctx, 13, 21, 3, 2, '#e4eef6');
    ellipse(ctx, 20, 15, 2, 1.5, '#e4eef6');
    shine(ctx, 12, 13, 2.5, 0.9);
  },
  bratapfel: (ctx) => {
    ellipse(ctx, 16, 23, 12, 4, '#ffffff', '#c9c4cf', 1.2);
    ellipse(ctx, 16, 17, 9, 8, '#c9302c', darken('#c9302c', 0.3), 1.4);
    ellipse(ctx, 16, 11, 4.5, 2, '#f2d39a', '#c9955f', 1);
    ellipse(ctx, 16, 10.5, 2, 1, '#8a5a3a');
    roundRect(ctx, 15.4, 5, 1.2, 4, 0.6, '#6e4630');
    shine(ctx, 12, 15, 2);
    for (const [x, y] of [[10, 6], [21, 5]] as const) ellipse(ctx, x, y, 1.5, 2.2, '#ffffff');
  },
  zimtsterne: (ctx) => {
    const star = (x: number, y: number, r: number) => {
      ctx.fillStyle = '#b8763f';
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const rr = i % 2 === 0 ? r : r * 0.5;
        if (i === 0) ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
        else ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = darken('#b8763f', 0.3);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const rr = (i % 2 === 0 ? r : r * 0.5) * 0.72;
        if (i === 0) ctx.moveTo(x + Math.cos(a) * rr, y - 0.6 + Math.sin(a) * rr);
        else ctx.lineTo(x + Math.cos(a) * rr, y - 0.6 + Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.fill();
    };
    star(11, 19, 8);
    star(21, 13, 7);
  },
  plaetzchen: (ctx) => {
    const star = (x: number, y: number, r: number, c: string) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const rr = i % 2 === 0 ? r : r * 0.5;
        if (i === 0) ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
        else ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = darken(c, 0.3);
      ctx.lineWidth = 1;
      ctx.stroke();
    };
    star(12, 18, 8, '#d9a86a');
    ellipse(ctx, 21, 12, 6, 6, '#f2d39a', darken('#f2d39a', 0.3), 1.2);
    ellipse(ctx, 21, 12, 2, 2, '#e8484f');
    star(12, 18, 4, '#fbf6ec');
  },
  lebkuchenherz: (ctx) => {
    ctx.fillStyle = '#b06a3a';
    ctx.beginPath();
    ctx.moveTo(16, 27);
    ctx.bezierCurveTo(4, 19, 4, 7, 11, 7);
    ctx.bezierCurveTo(14, 7, 16, 10, 16, 11);
    ctx.bezierCurveTo(16, 10, 18, 7, 21, 7);
    ctx.bezierCurveTo(28, 7, 28, 19, 16, 27);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.font = '700 5px sans-serif';
    ctx.fillStyle = '#f4a3b8';
    ctx.textAlign = 'center';
    ctx.fillText('chérie', 16, 17);
  },
  geburtstagstorte: (ctx) => {
    roundRect(ctx, 5, 17, 22, 9, 3, '#f7c6d4', '#d98aa0', 1.3);
    roundRect(ctx, 9, 10, 14, 8, 3, '#fbe8ef', '#d98aa0', 1.2);
    ellipse(ctx, 16, 17.5, 11, 1.5, '#ffffff');
    roundRect(ctx, 15, 4, 2, 6, 1, '#8ac8ff');
    ellipse(ctx, 16, 3.2, 1.5, 2, '#f7d26a');
    for (const x of [8, 13, 19, 24]) ellipse(ctx, x, 21, 1.3, 1.3, '#e8484f');
  },
  gluecksklee: (ctx) => {
    ctx.strokeStyle = '#4f9a5a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(16, 16);
    ctx.quadraticCurveTo(18, 24, 14, 29);
    ctx.stroke();
    for (const [dx, dy] of [[-5, -5], [5, -5], [-5, 3], [5, 3]] as const) {
      blob(ctx, [{ x: 16 + dx - 2, y: 14 + dy, r: 3.6 }, { x: 16 + dx + 2, y: 14 + dy, r: 3.6 }], '#6fbf73', '#3f7a42', 1);
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
for (const [id, tea, leaf] of [['kamillentee', '#f2d36a', '#ffffff'], ['thymiantee', '#c9a65a', '#6f8f4a'], ['pfefferminztee', '#8fcf7a', '#4f9a5a'], ['lavendeltee', '#c3a8e8', '#8a6ad8'], ['kraeutermischung', '#d9b86a', '#6fbf73']] as const) {
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

// Linas Lieblingsessen: Käse, Käse-Gerichte und die Bento-Box
DRAW.kaese = (ctx) => {
  ctx.fillStyle = '#f7d35a';
  ctx.strokeStyle = darken('#f7d35a', 0.35);
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(4, 22);
  ctx.lineTo(28, 22);
  ctx.lineTo(28, 13);
  ctx.lineTo(4, 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  roundRect(ctx, 4, 22, 24, 5, 1.5, '#f2c23a', darken('#f2c23a', 0.35), 1.2);
  for (const [x, y, r] of [[18, 20, 1.8], [24, 18.5, 1.2], [12, 24.4, 1.2], [21, 24.6, 1.4]] as const) ellipse(ctx, x, y, r, r, '#c99a1a');
};
DRAW.kaeseomelett = (ctx) => {
  ellipse(ctx, 16, 20, 13, 7, '#ffffff', '#c9c4cf', 1.3);
  ellipse(ctx, 16, 18.5, 11, 5.5, '#f7d35a', darken('#f2c23a', 0.3), 1.2);
  ellipse(ctx, 16, 17.5, 8, 2.8, '#fbe58a');
  for (const [x, y] of [[12, 18.5], [18, 17], [21, 19.2]] as const) ellipse(ctx, x, y, 1.4, 0.9, '#f2a83a');
  for (const [x, y] of [[10, 15], [22, 15.5]] as const) ellipse(ctx, x, y, 1.6, 0.9, '#6fbf5f');
};
DRAW['ueberbackene-kartoffeln'] = (ctx) => {
  roundRect(ctx, 3, 15, 26, 11, [2, 2, 5, 5], '#d9d4dd', '#a8a2b0', 1.3);
  ellipse(ctx, 16, 15.5, 11.5, 4, '#f2cf72', darken('#f2cf72', 0.3), 1);
  for (const [x, y, r] of [[10, 15, 2], [16, 14, 2.4], [21.5, 15.5, 1.8]] as const) ellipse(ctx, x, y, r, r * 0.7, '#fbe58a', '#e0a83a', 0.7);
  for (const [x, y] of [[13, 15.8], [19, 15]] as const) ellipse(ctx, x, y, 1.2, 0.6, '#c97a2a');
};
DRAW.kaesebrett = (ctx) => {
  roundRect(ctx, 3, 7, 26, 19, 3, '#b98a5e', darken('#b98a5e', 0.3), 1.3);
  ctx.fillStyle = '#f7d35a';
  ctx.beginPath();
  ctx.moveTo(7, 20);
  ctx.lineTo(18, 20);
  ctx.lineTo(18, 14);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = darken('#f7d35a', 0.35);
  ctx.lineWidth = 1;
  ctx.stroke();
  roundRect(ctx, 20, 10, 6, 6, 1.5, '#f2c23a', darken('#f2c23a', 0.35), 1);
  for (const [x, y] of [[10, 12], [14, 10]] as const) ellipse(ctx, x, y, 2.2, 1.6, '#e8484f', '#a83038', 0.7);
  for (const [x, y] of [[21, 20], [25, 22]] as const) ellipse(ctx, x, y, 1.7, 1.7, '#e6b06a', '#b98a5e', 0.6);
};
DRAW.bento = (ctx) => {
  roundRect(ctx, 3, 8, 26, 18, 3, '#3a3036', '#1f1a1d', 1.3);
  roundRect(ctx, 5, 10, 11, 7, 1.5, '#f7d35a');
  roundRect(ctx, 17, 10, 10, 7, 1.5, '#f39a4a');
  roundRect(ctx, 5, 18, 11, 6, 1.5, '#f7f5ec');
  roundRect(ctx, 17, 18, 10, 6, 1.5, '#fbe0e8');
  ellipse(ctx, 22, 21, 2.6, 2, '#e8484f');
  ellipse(ctx, 22, 20.2, 1, 0.8, '#fff6d8');
  ellipse(ctx, 10.5, 13.5, 3, 1.5, '#fbe58a');
  for (const x of [20, 22, 24]) ellipse(ctx, x, 13.5, 0.9, 2, '#fbb06a');
};

// Gerichte aus der Kochshow: Fischsuppe, Apfelpfannkuchen, Blumensalat
DRAW.fischsuppe = (ctx) => {
  ellipse(ctx, 16, 17, 12, 6.5, '#e9a24a', darken('#e9a24a', 0.3), 1.2);
  ellipse(ctx, 13, 16.5, 4.5, 2, '#f2c27a');
  ellipse(ctx, 19, 17.5, 3, 1.5, '#b9c6cf', '#7a8a96', 0.8);
  for (const [x, y] of [[10, 18], [22, 16.2]] as const) ellipse(ctx, x, y, 1.6, 0.8, '#5fa85a');
  roundRect(ctx, 4, 17, 24, 9, [1, 1, 9, 9], '#8ac8ff', darken('#8ac8ff', 0.35), 1.3);
  ctx.strokeStyle = 'rgba(180,180,190,0.75)';
  ctx.lineWidth = 1.2;
  for (const x of [12, 19]) {
    ctx.beginPath();
    ctx.moveTo(x, 11);
    ctx.quadraticCurveTo(x + 2, 8, x, 5);
    ctx.stroke();
  }
};
DRAW.apfelpfannkuchen = (ctx) => {
  ellipse(ctx, 16, 22, 12.5, 5, '#ffffff', '#c9c4cf', 1.2);
  ellipse(ctx, 16, 20, 11, 4.5, '#e6b06a', darken('#e6b06a', 0.3), 1.2);
  ellipse(ctx, 16, 15.5, 10, 4, '#f2c27a', darken('#f2c27a', 0.3), 1.2);
  for (const [x, y] of [[12, 14.5], [17, 15.5], [21, 14.5]] as const) ellipse(ctx, x, y, 2.2, 1.2, '#f7f2c8', '#c9b87a', 0.5);
  for (const [x, y] of [[14, 15.8], [19, 14.2]] as const) ellipse(ctx, x, y, 0.9, 0.5, '#a8603a');
};
DRAW.blumensalat = (ctx) => {
  roundRect(ctx, 5, 15, 22, 11, [1, 1, 9, 9], '#ffffff', '#c9c4cf', 1.3);
  ellipse(ctx, 16, 15.5, 11, 3.2, '#9fd884', darken('#9fd884', 0.3), 1);
  for (const [x, y, c] of [[11, 13.5, '#f39ab0'], [16, 12.5, '#f5cf3f'], [21, 13.5, '#a8c8ff'], [13.5, 16, '#f5cf3f'], [19, 16, '#f39ab0']] as const) {
    for (let i = 0; i < 5; i++) {
      const t = (i / 5) * Math.PI * 2;
      ellipse(ctx, x + Math.cos(t) * 1.8, y + Math.sin(t) * 1.8, 1.4, 1, c);
    }
    ellipse(ctx, x, y, 1, 1, '#fff6d8');
  }
};

// Fischgerichte: Teller, Fisch in der Art-Farbe, Beilage (Kartoffeln / Grün / Gemüse)
type Side = 'kartoffel' | 'gruen' | 'gemuese' | 'rauch' | 'kraeuter';
for (const [id, fish, spot, side, len] of [
  ['forelle-kraeuter', '#b59a6a', '#d9534f', 'kraeuter', 1],
  ['karpfen-kartoffeln', '#c9a25a', '#8a6a3a', 'kartoffel', 1.1],
  ['scholle-kartoffel', '#c2a878', '#d9843a', 'kartoffel', 1.15],
  ['raeuchermakrele', '#a86a3a', '#6f8fae', 'rauch', 1],
  ['dorsch-gemuese', '#e3d3ac', '#a89a74', 'gemuese', 1],
  ['aal-gruen', '#7a9a5a', '#c9d98a', 'gruen', 1.25],
  ['steinbutt-ofen', '#cdb98f', '#8a7a58', 'kraeuter', 1.2],
] as const satisfies ReadonlyArray<readonly [string, string, string, Side, number]>) {
  DRAW[id] = (ctx) => {
    ellipse(ctx, 16, 19, 13, 8, '#ffffff', '#c9c4cf', 1.3);
    ellipse(ctx, 16, 19, 9.5, 5.5, '#f7f5ec', '#e3dfe8', 0.8);
    const w = 6.5 * len;
    // Fisch: Körper, Schwanz, Auge, Tupfen
    ctx.fillStyle = fish;
    ctx.strokeStyle = darken(fish, 0.3);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(23, 19);
    ctx.lineTo(27, 15.5);
    ctx.lineTo(27, 22.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ellipse(ctx, 16.5 - (len - 1) * 3, 19, w, 3.6, fish, darken(fish, 0.3), 1);
    ellipse(ctx, 11 - (len - 1) * 3, 18.2, 0.9, 0.9, '#2f2f38');
    for (const x of [15, 18, 21]) ellipse(ctx, x - (len - 1) * 3, 19.5, 0.7, 0.7, spot);
    if (side === 'kartoffel') for (const [x, y] of [[8, 22.5], [11.5, 23.6], [22, 23.5]] as const) ellipse(ctx, x, y, 2.2, 1.6, '#f2cf72', darken('#f2cf72', 0.3), 0.7);
    if (side === 'gruen' || side === 'kraeuter') for (const [x, y] of [[9, 14.5], [13, 14], [20, 14.2], [23, 23]] as const) ellipse(ctx, x, y, 1.9, 1.1, '#6fbf5f', darken('#6fbf5f', 0.3), 0.6);
    if (side === 'gemuese') {
      for (const [x, y, c] of [[9, 22.5, '#e8484f'], [13.5, 23.6, '#7fbf5a'], [21, 23.4, '#e8484f'], [24, 22, '#7fbf5a']] as const) ellipse(ctx, x, y, 2, 1.5, c, darken(c, 0.3), 0.6);
    }
    if (side === 'rauch') {
      ctx.strokeStyle = 'rgba(180,180,190,0.75)';
      ctx.lineWidth = 1.2;
      for (const x of [11, 17, 22]) {
        ctx.beginPath();
        ctx.moveTo(x, 12.5);
        ctx.quadraticCurveTo(x + 2, 9, x, 5.5);
        ctx.stroke();
      }
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
// Omas Premium-Eierlikör: Flasche mit cremig-gelbem Inhalt, Etikett und Herz
DRAW['eierlikoer-premium'] = (ctx) => {
  roundRect(ctx, 11, 11, 10, 17, 3.5, '#f2d36a', '#b8942a', 1.3);
  roundRect(ctx, 14, 5, 4, 7, 1.2, '#f2d36a', '#b8942a', 1);
  roundRect(ctx, 13.2, 3, 5.6, 3.4, 1.2, '#8a5a3a', '#5a3a22', 0.8);
  roundRect(ctx, 12.5, 16.5, 7, 6, 1, '#fbf6ec', '#c9c4cf', 0.7);
  ctx.fillStyle = '#e85a8a';
  ctx.beginPath();
  ctx.arc(15, 19, 1.1, 0, Math.PI * 2);
  ctx.arc(17, 19, 1.1, 0, Math.PI * 2);
  ctx.moveTo(14, 19.6);
  ctx.lineTo(16, 22);
  ctx.lineTo(18, 19.6);
  ctx.fill();
  shine(ctx, 13.5, 14, 1.6);
};
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

// Kunstwerke: das Bild im Goldrahmen
for (const art of ARTWORKS) {
  DRAW[art.id] = (ctx) => {
    roundRect(ctx, 3, 5, 26, 22, 2, '#d9b45a', '#a8842a', 1.4);
    ctx.save();
    ctx.translate(6, 8);
    ctx.drawImage(artCanvas(art, 80, 64), 0, 0, 20, 16);
    ctx.restore();
  };
}

// Poster & Bildbände: das Cover im schmalen Rahmen (bis die 3D-Vorschau fertig ist)
for (const p of POSTERS) {
  DRAW[p.id] = (ctx) => {
    roundRect(ctx, 7, 3, 18, 26, 1.5, p.kind === 'poster' ? '#2b2a31' : '#f4efe4', '#1a1a1e', 1.2);
    ctx.save();
    ctx.translate(8.5, 4.5);
    ctx.drawImage(posterCanvas(p, 60, 84), 0, 0, 15, 21);
    ctx.restore();
  };
}

// Sträuße: Papiertüte mit Schleife, oben Blüten in den Farben des Straußes (`data/straeusse.ts`)
for (const b of BOUQUETS) {
  DRAW[b.id] = (ctx) => {
    const green = b.id === 'strauss-kraeuter';
    ctx.strokeStyle = '#5fa85a';
    ctx.lineWidth = 1.2;
    for (const x of [11, 16, 21]) {
      ctx.beginPath();
      ctx.moveTo(16, 21);
      ctx.lineTo(x, 12);
      ctx.stroke();
    }
    ctx.fillStyle = '#fdf6e8';
    ctx.beginPath();
    ctx.moveTo(6, 15);
    ctx.lineTo(26, 15);
    ctx.lineTo(18, 30);
    ctx.lineTo(14, 30);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d9c9a8';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    roundRect(ctx, 12.5, 20, 7, 3, 1.2, '#f4a3b8', darken('#f4a3b8', 0.25), 0.8);
    const spots: Array<[number, number]> = [[10, 11], [16, 8], [22, 11], [13, 14], [19, 14]];
    spots.forEach(([x, y], i) => {
      const c = b.colors[i % b.colors.length];
      if (green) {
        ellipse(ctx, x, y, 3.4, 2.4, c, darken(c, 0.3), 0.8);
        return;
      }
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2;
        ellipse(ctx, x + Math.cos(a) * 2.4, y + Math.sin(a) * 2.4, 1.9, 1.9, c, darken(c, 0.25), 0.5);
      }
      ellipse(ctx, x, y, 1.6, 1.6, i % 2 ? '#f7d26a' : lighten(c, 0.3));
    });
  };
}

// Sammeltassen: Becher mit Band und Emblem (bis die 3D-Vorschau fertig ist)
for (const t of TASSEN) {
  DRAW[t.id] = (ctx) => {
    ctx.strokeStyle = darken(t.color, 0.3);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(24.5, 17, 4, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    roundRect(ctx, 6, 7, 17, 20, 4, t.color, darken(t.color, 0.3), 1.3);
    roundRect(ctx, 6, 13, 17, 4, 0, t.accent, null);
    ellipse(ctx, 14.5, 21, 3, 3, t.accent);
    ellipse(ctx, 14.5, 21, 1.1, 1.1, t.color);
    ellipse(ctx, 14.5, 7.5, 7.5, 1.8, '#6e4630', darken(t.color, 0.3), 1);
  };
}

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
