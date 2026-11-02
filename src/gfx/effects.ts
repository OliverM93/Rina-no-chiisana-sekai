/**
 * Kleine Effekt- und Deko-Grafiken: Lichtschein, Glitzer, Blätter,
 * Wolkenschatten, Blümchen, Muscheln usw.
 */
import type { Season } from '../core/time';
import { darken, palette } from '../style/palette';
import { type Ctx, ellipse, roundRect } from './canvas';
import type { SpriteDef } from './objects';

const simple = (key: string, w: number, h: number, draw: (ctx: Ctx) => void): SpriteDef => ({
  key,
  w,
  h,
  ax: w / 2,
  ay: h / 2,
  draw,
});

export function glowDef(): SpriteDef {
  return simple('glow', 160, 160, (ctx) => {
    const g = ctx.createRadialGradient(80, 80, 0, 80, 80, 80);
    g.addColorStop(0, 'rgba(255, 222, 150, 0.75)');
    g.addColorStop(0.22, 'rgba(255, 204, 130, 0.45)');
    g.addColorStop(0.6, 'rgba(255, 185, 115, 0.15)');
    g.addColorStop(1, 'rgba(255, 180, 120, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 160, 160);
  });
}

/** Lichthof um ein erleuchtetes Fenster (additiv gezeichnet). */
export function windowGlowDef(): SpriteDef {
  return simple('window-glow', 110, 100, (ctx) => {
    const g = ctx.createRadialGradient(55, 50, 10, 55, 50, 54);
    g.addColorStop(0, 'rgba(255, 210, 130, 0.55)');
    g.addColorStop(0.55, 'rgba(255, 190, 110, 0.2)');
    g.addColorStop(1, 'rgba(255, 180, 100, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 110, 100);
  });
}

/** Warm erleuchtete Fensterscheibe (liegt nachts über dem Fenster). */
export function windowLitDef(): SpriteDef {
  return simple('window-lit', 58, 50, (ctx) => {
    const g = ctx.createLinearGradient(0, 2, 0, 48);
    g.addColorStop(0, '#fff3c8');
    g.addColorStop(1, '#ffd58a');
    roundRect(ctx, 2, 2, 54, 46, 9, '#ffffff', null);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(2, 2, 54, 46, 9);
    ctx.fill();
    ctx.strokeStyle = '#efcf98';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(29, 2);
    ctx.lineTo(29, 48);
    ctx.moveTo(2, 25);
    ctx.lineTo(56, 25);
    ctx.stroke();
  });
}

export function sparkleDef(): SpriteDef {
  return simple('sparkle', 20, 20, (ctx) => {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.quadraticCurveTo(11.5, 8.5, 20, 10);
    ctx.quadraticCurveTo(11.5, 11.5, 10, 20);
    ctx.quadraticCurveTo(8.5, 11.5, 0, 10);
    ctx.quadraticCurveTo(8.5, 8.5, 10, 0);
    ctx.fill();
  });
}

/** Fallende Teilchen passend zur Jahreszeit */
export function particleDef(season: Season): SpriteDef {
  return simple('particle', 16, 16, (ctx) => {
    if (season === 'winter') {
      ellipse(ctx, 8, 8, 4.5, 4.5, '#ffffff', '#dbe8f0', 0.8);
      return;
    }
    if (season === 'fruehling') {
      ctx.fillStyle = '#ffc6d9';
      ctx.beginPath();
      ctx.ellipse(8, 8, 5.5, 3.6, 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffe3ec';
      ctx.beginPath();
      ctx.ellipse(6.5, 7, 2, 1.2, 0.6, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    const c = season === 'herbst' ? '#f2a35e' : palette.leaves.sommer[1];
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(2, 12);
    ctx.quadraticCurveTo(2, 2, 14, 3);
    ctx.quadraticCurveTo(13, 14, 2, 12);
    ctx.fill();
    ctx.strokeStyle = darken(c, 0.25);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(3, 11.5);
    ctx.lineTo(12, 4);
    ctx.stroke();
  });
}

export function cloudShadowDef(): SpriteDef {
  return simple('cloud-shadow', 420, 220, (ctx) => {
    ctx.fillStyle = 'rgba(60, 50, 90, 1)';
    ctx.filter = 'blur(18px)';
    for (const [x, y, r] of [
      [150, 120, 70],
      [230, 100, 85],
      [300, 125, 60],
      [200, 140, 70],
    ]) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.filter = 'none';
  });
}

export function charShadowDef(): SpriteDef {
  return simple('char-shadow', 48, 18, (ctx) => {
    ctx.filter = 'blur(1.5px)';
    ctx.fillStyle = 'rgba(70, 50, 80, 0.24)';
    ctx.beginPath();
    ctx.ellipse(24, 9, 19, 6.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.filter = 'none';
  });
}

export const FLOWER_COLORS = ['#ffb3c9', '#fff09a', '#ffffff', '#c8b6e8', '#ffcfa3', '#a9d8ff'];

export function flowerDef(i: number): SpriteDef {
  const c = FLOWER_COLORS[i % FLOWER_COLORS.length];
  return simple(`flower-${i}`, 18, 22, (ctx) => {
    ctx.strokeStyle = '#7fbb68';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(9, 21);
    ctx.lineTo(9, 11);
    ctx.stroke();
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
      ellipse(ctx, 9 + Math.cos(a) * 3.8, 8 + Math.sin(a) * 3.8, 3, 3, c, darken(c, 0.25), 0.5);
    }
    ellipse(ctx, 9, 8, 2.2, 2.2, '#ffd36b');
  });
}

export function tuftDef(season: Season): SpriteDef {
  return simple('tuft', 22, 16, (ctx) => {
    const c = season === 'winter' ? '#c7dde6' : season === 'herbst' ? '#b9b36c' : '#86c26c';
    ctx.strokeStyle = c;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(6, 15);
    ctx.quadraticCurveTo(5, 8, 2, 4);
    ctx.moveTo(11, 15);
    ctx.lineTo(11, 2);
    ctx.moveTo(16, 15);
    ctx.quadraticCurveTo(17, 8, 20, 4);
    ctx.stroke();
  });
}

export function pebbleDef(): SpriteDef {
  return simple('pebble', 16, 12, (ctx) => {
    ellipse(ctx, 6, 7, 4.5, 3.2, palette.path.pebble, darken(palette.path.pebble, 0.2), 0.6);
    ellipse(ctx, 12, 8, 2.6, 2, palette.path.pebble);
  });
}

export function shellDef(): SpriteDef {
  return simple('shell', 18, 16, (ctx) => {
    const c = palette.sand.shell;
    ctx.beginPath();
    ctx.moveTo(9, 14);
    ctx.lineTo(2, 7);
    ctx.quadraticCurveTo(9, -2, 16, 7);
    ctx.closePath();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = darken(c, 0.25);
    ctx.stroke();
    ctx.fillStyle = c;
    ctx.fill();
    ctx.beginPath();
    for (const x of [5, 9, 13]) {
      ctx.moveTo(9, 13);
      ctx.lineTo(x, 4);
    }
    ctx.stroke();
  });
}

export function markerDef(): SpriteDef {
  return simple('marker', 48, 28, (ctx) => {
    ctx.strokeStyle = palette.ui.accent;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.ellipse(24, 14, 18, 9, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(24, 14, 18, 9, 0, Math.PI * 1.1, Math.PI * 1.6);
    ctx.stroke();
  });
}

export function bubbleDef(): SpriteDef {
  return simple('bubble', 44, 38, (ctx) => {
    ctx.beginPath();
    ctx.roundRect(3, 3, 38, 26, 13);
    ctx.moveTo(16, 28);
    ctx.lineTo(20, 35);
    ctx.lineTo(25, 28);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = palette.ui.accent;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    for (const x of [13, 22, 31]) ellipse(ctx, x, 16, 2.6, 2.6, palette.ui.accentDark);
  });
}

/** Kleines Herz (Freundschaft) */
export function heartDef(): SpriteDef {
  return simple('heart', 24, 22, (ctx) => {
    ctx.beginPath();
    ctx.moveTo(12, 20);
    ctx.bezierCurveTo(-1, 11, 4, 0, 12, 6);
    ctx.bezierCurveTo(20, 0, 25, 11, 12, 20);
    ctx.closePath();
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = '#e27896';
    ctx.stroke();
    ctx.fillStyle = '#ff9fbb';
    ctx.fill();
    ellipse(ctx, 8, 8, 2, 1.4, 'rgba(255,255,255,0.8)');
  });
}
