/**
 * Malen mit Onkel Jens: gemalte Bilder für jedes Motiv und jede Farbstimmung.
 * Ablauf: Hintergrund malen → Pinselstriche darüber (impressionistisch) → Hauptmotiv (scharf genug für Gesichter)
 * → leichte Pinselstriche auch dort → Leinwand-Struktur und Farbstimmung. Reproduzierbar (fester Zufall je Bild).
 * Farben der Stimmung kommen aus `palette.malen`; Figurenfarben (Fell, Mantel, Haare) sind kleine Details der Zeichnung.
 */
import { hashString, mulberry32 } from '../core/rng';
import { palette } from '../style/palette';

type Ctx = CanvasRenderingContext2D;
type Mood = (typeof palette.malen)[keyof typeof palette.malen];

const moodOf = (id: string): Mood => palette.malen[id as keyof typeof palette.malen] ?? palette.malen.pastell;

function ellipse(ctx: Ctx, x: number, y: number, rx: number, ry: number, fill: string, rot = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function vGradient(ctx: Ctx, y0: number, y1: number, top: string, bottom: string) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  return g;
}

/**
 * Pinselstriche: Farbe an zufälligen Stellen aufnehmen und als kurzen, schrägen Strich wieder auftragen.
 * `flow` = bevorzugte Strichrichtung (Bogenmaß), `jitter` = Streuung der Richtung.
 */
function brush(ctx: Ctx, w: number, h: number, rnd: () => number, count: number, size: number, flow: (x: number, y: number) => number, jitter = 0.5, area?: { x: number; y: number; w: number; h: number }) {
  const img = ctx.getImageData(0, 0, w, h).data;
  ctx.save();
  ctx.lineCap = 'round';
  for (let i = 0; i < count; i++) {
    const x = area ? area.x + rnd() * area.w : rnd() * w;
    const y = area ? area.y + rnd() * area.h : rnd() * h;
    const px = (Math.min(h - 1, Math.max(0, Math.floor(y))) * w + Math.min(w - 1, Math.max(0, Math.floor(x)))) * 4;
    const a = flow(x, y) + (rnd() - 0.5) * jitter;
    const len = size * (1.2 + rnd() * 1.6);
    // leicht aufgehellte oder abgedunkelte Variante der Farbe – so entsteht Tiefe wie bei echtem Farbauftrag
    const shade = 0.88 + rnd() * 0.24;
    const r = Math.min(255, img[px] * shade);
    const g = Math.min(255, img[px + 1] * shade);
    const b = Math.min(255, img[px + 2] * shade);
    ctx.strokeStyle = `rgba(${r | 0},${g | 0},${b | 0},${0.45 + rnd() * 0.35})`;
    ctx.lineWidth = size * (0.55 + rnd() * 0.5);
    ctx.beginPath();
    ctx.moveTo(x - Math.cos(a) * len * 0.5, y - Math.sin(a) * len * 0.5);
    ctx.lineTo(x + Math.cos(a) * len * 0.5, y + Math.sin(a) * len * 0.5);
    ctx.stroke();
  }
  ctx.restore();
}

/** Leinwand-Struktur (feines Gewebe) und ein weicher, dunklerer Rand */
function canvasTexture(ctx: Ctx, w: number, h: number) {
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = '#ffffff';
  for (let x = 0; x < w; x += 3) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  ctx.strokeStyle = '#000000';
  ctx.globalAlpha = 0.035;
  for (let y = 0; y < h; y += 3) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();
  const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.72);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(40,20,30,0.28)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);
}

/** Farbstimmung über das ganze Bild: Pastell wird zarter, Schwarz wird zum stimmungsvollen Schwarz-Weiß */
function moodFilter(ctx: Ctx, w: number, h: number, mood: string) {
  ctx.save();
  if (mood === 'pastell') {
    ctx.fillStyle = 'rgba(255,250,252,0.2)';
    ctx.fillRect(0, 0, w, h);
  } else if (mood === 'schwarz') {
    ctx.globalCompositeOperation = 'saturation';
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, w, h);
    // leicht violett getönt, das Motiv in der Mitte bleibt hell (wie ein Spot im dunklen Raum)
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(190,175,210,0.5)';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'screen';
    const g = ctx.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.45, w * 0.55);
    g.addColorStop(0, 'rgba(255,255,255,0.32)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  } else if (mood === 'kraeftig') {
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = 'rgba(255,200,120,0.12)';
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Motive: jeweils Hintergrund (bekommt kräftige Pinselstriche) und Vordergrund (Details)
// ---------------------------------------------------------------------------

interface Motif {
  background(ctx: Ctx, m: Mood, w: number, h: number, rnd: () => number): void;
  /** Richtung der Pinselstriche im Hintergrund */
  flow(x: number, y: number, w: number, h: number): number;
  foreground(ctx: Ctx, m: Mood, w: number, h: number, rnd: () => number): void;
  /** Bereich des Hauptmotivs (dort nur feine Striche) */
  subject?: (w: number, h: number) => { x: number; y: number; w: number; h: number };
}

const MEER: Motif = {
  background(ctx, m, w, h, rnd) {
    ctx.fillStyle = vGradient(ctx, 0, h * 0.6, m.skyTop, m.skyBottom);
    ctx.fillRect(0, 0, w, h);
    // Sonne mit Schein
    const sx = w * 0.74;
    const sy = h * 0.3;
    const glow = ctx.createRadialGradient(sx, sy, 8, sx, sy, 80);
    glow.addColorStop(0, m.sun);
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
    ellipse(ctx, sx, sy, 24, 24, m.sun);
    // Wolken
    for (const [cx, cy, s] of [
      [w * 0.2, h * 0.18, 1],
      [w * 0.45, h * 0.12, 0.7],
      [w * 0.9, h * 0.14, 0.6],
    ]) {
      for (let k = 0; k < 5; k++) ellipse(ctx, cx + (k - 2) * 14 * s, cy + Math.sin(k * 1.7) * 4 * s, 18 * s, 10 * s, m.light);
    }
    // Meer
    const seaTop = h * 0.58;
    ctx.fillStyle = vGradient(ctx, seaTop, h * 0.8, m.sea, m.seaDeep);
    ctx.fillRect(0, seaTop, w, h * 0.25);
    // Sonnenglitzern auf dem Wasser
    for (let i = 0; i < 26; i++) {
      const y = seaTop + 4 + rnd() * h * 0.18;
      const spread = 6 + (y - seaTop) * 0.5;
      ctx.fillStyle = m.sun;
      ctx.fillRect(sx - spread + rnd() * spread * 2, y, 6 + rnd() * 10, 2);
    }
    // Strand mit geschwungener Kante
    ctx.beginPath();
    ctx.moveTo(0, h * 0.8);
    ctx.bezierCurveTo(w * 0.3, h * 0.74, w * 0.6, h * 0.86, w, h * 0.78);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = m.sand;
    ctx.fill();
  },
  flow(_x, y, _w, h) {
    return y < h * 0.8 ? 0 : -0.25;
  },
  foreground(ctx, m, w, h, rnd) {
    // Wellenkämme
    ctx.strokeStyle = m.seaLight;
    ctx.lineWidth = 2;
    for (let row = 0; row < 5; row++) {
      const y0 = h * 0.62 + row * 9;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 6) {
        const y = y0 + Math.sin(x * 0.07 + row * 1.3) * 2.2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.globalAlpha = 0.55 - row * 0.07;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // Segelboot am Horizont
    const bx = w * 0.3;
    const by = h * 0.6;
    ctx.fillStyle = m.dark;
    ctx.beginPath();
    ctx.moveTo(bx - 22, by);
    ctx.lineTo(bx + 22, by);
    ctx.lineTo(bx + 15, by + 8);
    ctx.lineTo(bx - 15, by + 8);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(bx - 1, by - 38, 2, 38);
    ctx.fillStyle = m.light;
    ctx.beginPath();
    ctx.moveTo(bx + 2, by - 36);
    ctx.lineTo(bx + 24, by - 4);
    ctx.lineTo(bx + 2, by - 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = m.accent;
    ctx.beginPath();
    ctx.moveTo(bx - 2, by - 30);
    ctx.lineTo(bx - 18, by - 4);
    ctx.lineTo(bx - 2, by - 4);
    ctx.closePath();
    ctx.fill();
    // Möwen
    ctx.strokeStyle = m.dark;
    ctx.lineWidth = 2;
    for (const [mx, my, s] of [
      [w * 0.52, h * 0.3, 1],
      [w * 0.58, h * 0.36, 0.75],
      [w * 0.15, h * 0.4, 0.6],
    ]) {
      ctx.beginPath();
      ctx.moveTo(mx - 9 * s, my);
      ctx.quadraticCurveTo(mx - 4 * s, my - 6 * s, mx, my);
      ctx.quadraticCurveTo(mx + 4 * s, my - 6 * s, mx + 9 * s, my);
      ctx.stroke();
    }
    // Muscheln und ein Seestern im Sand
    for (let i = 0; i < 7; i++) {
      const x = 20 + rnd() * (w - 40);
      const y = h * 0.86 + rnd() * h * 0.1;
      ellipse(ctx, x, y, 4, 3, i % 2 ? m.light : m.accent);
    }
    const stx = w * 0.78;
    const sty = h * 0.9;
    ctx.fillStyle = m.accent;
    ctx.beginPath();
    for (let k = 0; k < 10; k++) {
      const r = k % 2 === 0 ? 13 : 5;
      const a = -Math.PI / 2 + (k * Math.PI) / 5;
      ctx.lineTo(stx + Math.cos(a) * r, sty + Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
  },
};

const WINSTON: Motif = {
  background(ctx, m, w, h) {
    ctx.fillStyle = vGradient(ctx, 0, h * 0.7, m.wall, m.wallDark);
    ctx.fillRect(0, 0, w, h);
    // Fenster mit Abendlicht
    ctx.fillStyle = m.skyBottom;
    ctx.fillRect(w * 0.08, h * 0.1, w * 0.22, h * 0.36);
    ctx.fillStyle = m.wood;
    ctx.fillRect(w * 0.08, h * 0.27, w * 0.22, 4);
    ctx.fillRect(w * 0.19 - 2, h * 0.1, 4, h * 0.36);
    // Boden
    ctx.fillStyle = vGradient(ctx, h * 0.7, h, m.wood, m.wallDark);
    ctx.fillRect(0, h * 0.7, w, h * 0.3);
  },
  flow(x, y, w, h) {
    return y > h * 0.7 ? 0 : Math.sin(x / w * 6) * 0.3 + Math.PI / 2;
  },
  subject: (w, h) => ({ x: w * 0.15, y: h * 0.38, w: w * 0.75, h: h * 0.55 }),
  foreground(ctx, m, w, h) {
    // Kissen
    ellipse(ctx, w * 0.52, h * 0.8, w * 0.38, h * 0.14, m.accent);
    ellipse(ctx, w * 0.52, h * 0.77, w * 0.34, h * 0.1, m.light);
    ellipse(ctx, w * 0.52, h * 0.77, w * 0.33, h * 0.09, m.accent);
    // Winston, eingerollt und schlafend: langer Dackelkörper
    const fur = '#b0612f';
    const furDark = '#83431f';
    const belly = '#cf8752';
    const cx = w * 0.5;
    const cy = h * 0.68;
    // Schwanz
    ctx.strokeStyle = fur;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 92, cy + 4);
    ctx.quadraticCurveTo(cx - 120, cy - 8, cx - 108, cy - 26);
    ctx.stroke();
    // Beinchen
    for (const dx of [-70, -50, 40, 60]) ellipse(ctx, cx + dx, cy + 26, 9, 7, furDark);
    // Körper
    ellipse(ctx, cx - 10, cy, 96, 30, fur);
    ellipse(ctx, cx - 10, cy + 12, 80, 14, belly);
    ellipse(ctx, cx - 30, cy - 14, 50, 9, '#c4733d'); // Glanz auf dem Rücken
    // Kopf
    const hx = cx + 88;
    const hy = cy - 12;
    ellipse(ctx, hx, hy, 30, 27, fur);
    ellipse(ctx, hx + 28, hy + 8, 22, 14, fur); // Schnauze
    ellipse(ctx, hx + 26, hy + 14, 16, 7, belly);
    ellipse(ctx, hx + 48, hy + 5, 6, 5, '#2b1d18'); // Nase
    ellipse(ctx, hx + 46, hy + 3, 2, 1.5, '#ffffff');
    // Schlappohr
    ellipse(ctx, hx - 10, hy + 10, 13, 26, furDark, 0.35);
    // geschlossenes Auge
    ctx.strokeStyle = '#2b1d18';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(hx + 10, hy - 4, 6, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
    // rosa Halsband
    ctx.strokeStyle = '#f08fae';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(hx - 2, hy + 6, 28, 0.55 * Math.PI, 1.05 * Math.PI);
    ctx.stroke();
    ellipse(ctx, hx - 26, hy + 24, 4, 4, '#f7d26a');
    // Zzz
    ctx.fillStyle = m.dark;
    ctx.globalAlpha = 0.8;
    for (const [i, s] of [
      [0, 14],
      [1, 18],
      [2, 23],
    ]) {
      ctx.font = `800 ${s}px Nunito Variable, sans-serif`;
      ctx.fillText('z', hx + 30 + i * 16, hy - 34 - i * 16);
    }
    ctx.globalAlpha = 1;
  },
};

const OMA: Motif = {
  background(ctx, m, w, h) {
    ctx.fillStyle = vGradient(ctx, 0, h * 0.65, m.skyTop, m.skyBottom);
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = vGradient(ctx, h * 0.6, h, m.grass, m.grassDark);
    ctx.beginPath();
    ctx.moveTo(0, h * 0.62);
    ctx.bezierCurveTo(w * 0.3, h * 0.56, w * 0.7, h * 0.66, w, h * 0.6);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();
    // Baum links
    ctx.fillStyle = m.wood;
    ctx.fillRect(w * 0.1, h * 0.3, 14, h * 0.36);
    for (const [dx, dy, r] of [
      [0, 0, 40],
      [-28, 16, 30],
      [28, 14, 32],
      [0, 30, 34],
    ]) ellipse(ctx, w * 0.1 + 7 + dx, h * 0.24 + dy, r, r * 0.85, m.grassDark);
  },
  flow(x, y, w, h) {
    return y < h * 0.6 ? 0.1 : -0.15 + (x / w) * 0.3;
  },
  subject: (w, h) => ({ x: w * 0.3, y: h * 0.2, w: w * 0.45, h: h * 0.72 }),
  foreground(ctx, m, w, h) {
    const bx = w * 0.53;
    const by = h * 0.74;
    // Bank
    ctx.fillStyle = m.wood;
    ctx.fillRect(bx - 80, by - 52, 160, 10);
    ctx.fillRect(bx - 80, by - 36, 160, 10);
    ctx.fillRect(bx - 84, by - 4, 168, 12);
    ctx.fillStyle = m.dark;
    ctx.fillRect(bx - 76, by + 8, 7, 30);
    ctx.fillRect(bx + 69, by + 8, 7, 30);
    // Oma Gisela: königsblauer Mantel, rotes Tuch, offene silbergraue Haare, keine Brille
    const coat = '#2f56c9';
    const coatDark = '#22409a';
    const skin = '#f3d3bd';
    const ox = bx;
    // Beine & Schuhe
    ctx.fillStyle = '#4a4a5a';
    ctx.fillRect(ox - 16, by + 4, 10, 30);
    ctx.fillRect(ox + 6, by + 4, 10, 30);
    ellipse(ctx, ox - 12, by + 36, 10, 5, '#3a2a2a');
    ellipse(ctx, ox + 12, by + 36, 10, 5, '#3a2a2a');
    // Mantel (Körper)
    ctx.fillStyle = coat;
    ctx.beginPath();
    ctx.moveTo(ox - 26, by - 70);
    ctx.quadraticCurveTo(ox, by - 82, ox + 26, by - 70);
    ctx.lineTo(ox + 36, by + 8);
    ctx.quadraticCurveTo(ox, by + 16, ox - 36, by + 8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = coatDark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ox, by - 66);
    ctx.lineTo(ox, by + 10);
    ctx.stroke();
    for (const y of [by - 50, by - 32, by - 14]) ellipse(ctx, ox + 5, y, 2.5, 2.5, '#f7d26a');
    // Hände im Schoß mit einer Keksdose
    ellipse(ctx, ox - 10, by - 6, 6, 5, skin);
    ellipse(ctx, ox + 10, by - 6, 6, 5, skin);
    ellipse(ctx, ox, by - 8, 12, 6, m.accent);
    ellipse(ctx, ox, by - 10, 12, 3, m.light);
    // rotes Tuch
    ctx.fillStyle = '#d93a3a';
    ctx.beginPath();
    ctx.ellipse(ox, by - 72, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(ox + 4, by - 70);
    ctx.lineTo(ox + 14, by - 44);
    ctx.lineTo(ox + 4, by - 46);
    ctx.closePath();
    ctx.fill();
    // Kopf
    const hy = by - 96;
    // offene silbergraue Haare (hinter dem Gesicht bis zu den Schultern)
    ellipse(ctx, ox, hy + 10, 30, 34, '#c4c4cf');
    ellipse(ctx, ox - 22, hy + 26, 10, 16, '#c4c4cf');
    ellipse(ctx, ox + 22, hy + 26, 10, 16, '#c4c4cf');
    ellipse(ctx, ox, hy, 22, 23, skin);
    ctx.fillStyle = '#d9d9e2';
    ctx.beginPath();
    ctx.ellipse(ox, hy - 12, 24, 14, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#eeeef3';
    ctx.lineWidth = 1.5;
    for (const dx of [-14, -6, 4, 12]) {
      ctx.beginPath();
      ctx.moveTo(ox + dx, hy - 22);
      ctx.quadraticCurveTo(ox + dx * 1.3, hy - 10, ox + dx * 1.6, hy + 2);
      ctx.stroke();
    }
    // Gesicht: Augen, Bäckchen, Lächeln
    ellipse(ctx, ox - 8, hy + 2, 2.4, 2.4, '#3a2a2a');
    ellipse(ctx, ox + 8, hy + 2, 2.4, 2.4, '#3a2a2a');
    ellipse(ctx, ox - 13, hy + 9, 4, 2.5, 'rgba(240,120,140,0.45)');
    ellipse(ctx, ox + 13, hy + 9, 4, 2.5, 'rgba(240,120,140,0.45)');
    ctx.strokeStyle = '#8a4a4a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ox, hy + 8, 6, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
    // Tauben auf dem Weg
    for (const [px, py] of [
      [w * 0.2, h * 0.88],
      [w * 0.27, h * 0.92],
    ]) {
      ellipse(ctx, px, py, 9, 6, '#9a98a6');
      ellipse(ctx, px + 8, py - 5, 4.5, 4.5, '#8a8896');
      ellipse(ctx, px + 12, py - 5, 2, 1.2, '#e09a3c');
    }
  },
};

const STERNE: Motif = {
  background(ctx, m, w, h) {
    ctx.fillStyle = vGradient(ctx, 0, h, m.nightDeep, m.night);
    ctx.fillRect(0, 0, w, h);
  },
  flow(x, y, w, h) {
    // Wirbel um zwei Mittelpunkte – wie bei einer berühmten Sternennacht
    const c1 = { x: w * 0.4, y: h * 0.3 };
    const c2 = { x: w * 0.7, y: h * 0.45 };
    const d1 = Math.hypot(x - c1.x, y - c1.y);
    const d2 = Math.hypot(x - c2.x, y - c2.y);
    const c = d1 < d2 ? c1 : c2;
    return Math.atan2(y - c.y, x - c.x) + Math.PI / 2;
  },
  foreground(ctx, m, w, h, rnd) {
    // Wirbelbänder
    ctx.lineCap = 'round';
    for (const [cx, cy, rr] of [
      [w * 0.4, h * 0.3, 46],
      [w * 0.7, h * 0.45, 30],
    ]) {
      for (let k = 0; k < 4; k++) {
        ctx.strokeStyle = k % 2 ? m.seaLight : m.sun;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, rr - k * 9, rnd() * Math.PI, rnd() * Math.PI + Math.PI * 1.3);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    // Mondsichel
    const mx = w * 0.86;
    const my = h * 0.18;
    const glow = ctx.createRadialGradient(mx, my, 6, mx, my, 50);
    glow.addColorStop(0, m.sun);
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(mx - 60, my - 60, 120, 120);
    // Sichel auf einer eigenen kleinen Leinwand ausschneiden – so bleibt der Himmel dahinter sichtbar
    const moon = document.createElement('canvas');
    moon.width = moon.height = 48;
    const mc = moon.getContext('2d');
    if (mc) {
      ellipse(mc, 24, 24, 18, 18, m.sun);
      mc.globalCompositeOperation = 'destination-out';
      ellipse(mc, 32, 19, 16, 16, '#000000');
      ctx.drawImage(moon, mx - 24, my - 24);
    }
    // Sterne mit Schein
    for (let i = 0; i < 16; i++) {
      const sx = 12 + rnd() * (w - 24);
      const sy = 8 + rnd() * h * 0.5;
      const r = 2 + rnd() * 3;
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 4);
      g.addColorStop(0, m.sun);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(sx - r * 4, sy - r * 4, r * 8, r * 8);
      ellipse(ctx, sx, sy, r, r, m.light);
    }
    // Hügel und Dorf mit erleuchteten Fenstern
    ctx.fillStyle = m.dark;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.78);
    ctx.bezierCurveTo(w * 0.25, h * 0.68, w * 0.55, h * 0.84, w, h * 0.72);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();
    for (const [hx, hw, hh] of [
      [w * 0.42, 26, 20],
      [w * 0.52, 22, 26],
      [w * 0.62, 30, 18],
      [w * 0.74, 20, 22],
    ]) {
      const base = h * 0.8;
      ctx.fillStyle = m.nightDeep;
      ctx.fillRect(hx, base - hh, hw, hh);
      ctx.beginPath();
      ctx.moveTo(hx - 3, base - hh);
      ctx.lineTo(hx + hw / 2, base - hh - 12);
      ctx.lineTo(hx + hw + 3, base - hh);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = m.sun;
      ctx.fillRect(hx + hw * 0.3, base - hh * 0.6, 5, 5);
    }
    // eine flammenförmige Zypresse links
    ctx.fillStyle = m.nightDeep;
    ctx.beginPath();
    ctx.moveTo(w * 0.12, h);
    ctx.bezierCurveTo(w * 0.03, h * 0.6, w * 0.12, h * 0.3, w * 0.14, h * 0.12);
    ctx.bezierCurveTo(w * 0.17, h * 0.35, w * 0.25, h * 0.6, w * 0.2, h);
    ctx.closePath();
    ctx.fill();
  },
};

const OLI: Motif = {
  background(ctx, m, w, h, rnd) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, m.skyBottom);
    g.addColorStop(1, m.accent);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // weiches Bokeh
    for (let i = 0; i < 14; i++) {
      ctx.globalAlpha = 0.25;
      ellipse(ctx, rnd() * w, rnd() * h, 10 + rnd() * 18, 10 + rnd() * 18, m.light);
    }
    ctx.globalAlpha = 1;
  },
  flow(x, y, w, h) {
    return Math.atan2(y - h / 2, x - w / 2) + Math.PI / 2;
  },
  subject: (w, h) => ({ x: w * 0.25, y: h * 0.1, w: w * 0.5, h: h * 0.9 }),
  foreground(ctx, m, w, h) {
    const cx = w / 2;
    const skin = '#f2cfb3';
    const hair = '#b8955c';
    const hairDark = '#9a7a46';
    // schwarzer Troyer mit Stehkragen und Reißverschluss
    ctx.fillStyle = '#1c1b20';
    ctx.beginPath();
    ctx.moveTo(cx - 100, h);
    ctx.quadraticCurveTo(cx - 92, h * 0.72, cx - 34, h * 0.68);
    ctx.lineTo(cx + 34, h * 0.68);
    ctx.quadraticCurveTo(cx + 92, h * 0.72, cx + 100, h);
    ctx.closePath();
    ctx.fill();
    // Hals
    ctx.fillStyle = skin;
    ctx.fillRect(cx - 14, h * 0.56, 28, h * 0.14);
    ctx.fillStyle = '#2a2930';
    ctx.fillRect(cx - 26, h * 0.64, 52, 16);
    ctx.strokeStyle = '#8a8894';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.64);
    ctx.lineTo(cx, h * 0.88);
    ctx.stroke();
    // Kopf
    const hy = h * 0.4;
    ellipse(ctx, cx - 44, hy + 6, 8, 12, skin);
    ellipse(ctx, cx + 44, hy + 6, 8, 12, skin);
    ellipse(ctx, cx, hy, 44, 50, skin);
    // Fade: Seiten kurz (dünn), oben längeres Deckhaar
    ctx.globalAlpha = 0.55;
    ellipse(ctx, cx - 38, hy - 10, 8, 20, hairDark);
    ellipse(ctx, cx + 38, hy - 10, 8, 20, hairDark);
    ctx.globalAlpha = 1;
    ctx.fillStyle = hair;
    ctx.beginPath();
    ctx.moveTo(cx - 40, hy - 18);
    ctx.quadraticCurveTo(cx - 42, hy - 62, cx - 4, hy - 64);
    ctx.quadraticCurveTo(cx + 40, hy - 66, cx + 42, hy - 22);
    ctx.quadraticCurveTo(cx + 20, hy - 38, cx - 6, hy - 34);
    ctx.quadraticCurveTo(cx - 26, hy - 32, cx - 40, hy - 18);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = hairDark;
    ctx.lineWidth = 2;
    for (const dx of [-22, -8, 6, 20]) {
      ctx.beginPath();
      ctx.moveTo(cx + dx - 6, hy - 58);
      ctx.quadraticCurveTo(cx + dx, hy - 48, cx + dx + 8, hy - 40);
      ctx.stroke();
    }
    // Augenbrauen
    ctx.strokeStyle = hairDark;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx + s * 9, hy - 14);
      ctx.lineTo(cx + s * 26, hy - 16);
      ctx.stroke();
    }
    // blaugraue Augen (lachend leicht zusammengekniffen)
    for (const s of [-1, 1]) {
      ellipse(ctx, cx + s * 17, hy - 2, 7, 5.5, '#ffffff');
      ellipse(ctx, cx + s * 17, hy - 1.5, 4.2, 4.2, '#6f8aa3');
      ellipse(ctx, cx + s * 17, hy - 1.5, 2, 2, '#1e2430');
      ellipse(ctx, cx + s * 16, hy - 3, 1.2, 1.2, '#ffffff');
    }
    // Nase
    ctx.strokeStyle = '#d9a98c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx + 2, hy);
    ctx.quadraticCurveTo(cx + 6, hy + 12, cx, hy + 14);
    ctx.stroke();
    // strahlendes Lächeln mit Zähnen
    ctx.fillStyle = '#7a2e2e';
    ctx.beginPath();
    ctx.moveTo(cx - 20, hy + 24);
    ctx.quadraticCurveTo(cx, hy + 46, cx + 20, hy + 24);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(cx - 18, hy + 25);
    ctx.quadraticCurveTo(cx, hy + 32, cx + 18, hy + 25);
    ctx.lineTo(cx + 15, hy + 29);
    ctx.quadraticCurveTo(cx, hy + 33, cx - 15, hy + 29);
    ctx.closePath();
    ctx.fill();
    // Schnurrbart
    ctx.fillStyle = hairDark;
    ctx.beginPath();
    ctx.moveTo(cx - 20, hy + 22);
    ctx.quadraticCurveTo(cx - 10, hy + 13, cx, hy + 18);
    ctx.quadraticCurveTo(cx + 10, hy + 13, cx + 20, hy + 22);
    ctx.quadraticCurveTo(cx + 10, hy + 19, cx, hy + 21);
    ctx.quadraticCurveTo(cx - 10, hy + 19, cx - 20, hy + 22);
    ctx.closePath();
    ctx.fill();
    // Bäckchen
    ellipse(ctx, cx - 28, hy + 14, 7, 4, 'rgba(240,120,130,0.35)');
    ellipse(ctx, cx + 28, hy + 14, 7, 4, 'rgba(240,120,130,0.35)');
    // kleine Herzen
    ctx.fillStyle = m.accent;
    for (const [x, y, s] of [
      [w * 0.2, h * 0.22, 1],
      [w * 0.82, h * 0.3, 0.8],
      [w * 0.76, h * 0.12, 0.6],
    ]) {
      ctx.beginPath();
      ctx.moveTo(x, y + 6 * s);
      ctx.bezierCurveTo(x - 12 * s, y - 4 * s, x - 6 * s, y - 12 * s, x, y - 5 * s);
      ctx.bezierCurveTo(x + 6 * s, y - 12 * s, x + 12 * s, y - 4 * s, x, y + 6 * s);
      ctx.fill();
    }
  },
};

const MOTIFS: Readonly<Record<string, Motif>> = { meer: MEER, winston: WINSTON, oma: OMA, sterne: STERNE, oli: OLI };

/** Ein Bild malen: Motiv (`meer`, `winston`, `oma`, `sterne`, `oli`) in einer Farbstimmung (`pastell`, `kraeftig`, `schwarz`) */
export function drawPainting(ctx: Ctx, motifId: string, moodId: string, w: number, h: number): void {
  const motif = MOTIFS[motifId] ?? MEER;
  const m = moodOf(moodId);
  const rnd = mulberry32(hashString(`malen:${motifId}:${moodId}`));
  ctx.save();
  ctx.clearRect(0, 0, w, h);
  motif.background(ctx, m, w, h, rnd);
  brush(ctx, w, h, rnd, 1600, 4.5, (x, y) => motif.flow(x, y, w, h), 0.5);
  motif.foreground(ctx, m, w, h, rnd);
  // feine Striche auch übers Motiv (außer im Gesicht/Hauptmotiv, dort ganz zart), damit alles gemalt wirkt
  const subj = motif.subject?.(w, h);
  if (subj) {
    brush(ctx, w, h, rnd, 380, 3, (x, y) => motif.flow(x, y, w, h), 0.8, { x: 0, y: 0, w, h: subj.y });
    brush(ctx, w, h, rnd, 160, 1.6, () => rnd() * Math.PI, 3, subj);
  } else brush(ctx, w, h, rnd, 520, 2.6, (x, y) => motif.flow(x, y, w, h), 0.6);
  canvasTexture(ctx, w, h);
  moodFilter(ctx, w, h, moodId);
  ctx.restore();
}
