/**
 * Chibi-Figuren: großer runder Kopf, kleiner Körper, weiche Konturen.
 *
 * Eine Figur wird komplett aus `Appearance`-Parametern gezeichnet – so
 * funktionieren Charakter-Editor, Lauf-Animation und später alle
 * Bewohner (Oma Gisela, Lars, Olaf, …) mit demselben Code.
 *
 * Koordinaten: Ursprung = Mitte zwischen den Füßen, y wächst nach unten.
 */
import type { Appearance } from '../core/appearance';
import { darken, lighten, palette } from '../style/palette';
import { blob, type Circle, type Ctx, ellipse, fillWithOutline } from './canvas';

export type ChibiDir = 'down' | 'up' | 'side';

export interface ChibiPose {
  /** 0 = Stand, 1 = linkes Bein vorne, 3 = rechtes Bein vorne */
  leg: 0 | 1 | 3;
  blink: boolean;
  /** sitzt (nur Vorderansicht): Füße baumeln vor der Sitzfläche */
  sit?: boolean;
}

/** Rahmengröße einer Figur in Welteinheiten. */
export const CHIBI_W = 104;
export const CHIBI_H = 136;
/** y-Position der Füße innerhalb des Rahmens. */
export const CHIBI_FEET = 126;

interface Dims {
  hx: number;
  hy: number;
  rx: number;
  ry: number;
  neckY: number;
  hipY: number;
  footY: number;
  shoulder: number;
  hem: number;
  legX: number;
}

function dims(a: Appearance): Dims {
  const h = a.height;
  const b = a.build;
  const footY = -3;
  const legLen = 12.5 * h;
  const torso = 24 * h;
  const hipY = footY - legLen;
  const neckY = hipY - torso;
  const headScale = 0.94 + 0.06 * h;
  const rx = 24.5 * headScale;
  const ry = 21.5 * headScale;
  return {
    hx: 0,
    hy: neckY - ry + 5,
    rx,
    ry,
    neckY,
    hipY,
    footY,
    shoulder: 12.5 * b,
    hem: 15.5 * b,
    legX: 5.2 * b,
  };
}

const OUTLINE = 0.3;
const out = (c: string) => darken(c, OUTLINE);

// ---------------------------------------------------------------------------
// Haare
// ---------------------------------------------------------------------------

/** Kreise entlang eines Ellipsenbogens (Winkel in Grad, 0° = rechts, 90° = unten). */
function arcCircles(cx: number, cy: number, ax: number, ay: number, from: number, to: number, n: number, r: number | ((i: number) => number)): Circle[] {
  const list: Circle[] = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const ang = ((from + (to - from) * t) * Math.PI) / 180;
    list.push({ x: cx + Math.cos(ang) * ax, y: cy + Math.sin(ang) * ay, r: typeof r === 'number' ? r : r(i) });
  }
  return list;
}

function hairCap(d: Dims, extra = 4): Circle[] {
  // Gleichmäßige „Kappe“ über dem Oberkopf
  return [
    { x: d.hx, y: d.hy - 3, r: d.rx + extra - 2 },
    { x: d.hx - d.rx * 0.45, y: d.hy - 2, r: d.rx * 0.72 + extra * 0.5 },
    { x: d.hx + d.rx * 0.45, y: d.hy - 2, r: d.rx * 0.72 + extra * 0.5 },
  ];
}

/** Hinterer Teil der Haare (hinter Kopf & Körper). */
function drawHairBack(ctx: Ctx, a: Appearance, d: Dims, dir: ChibiDir) {
  const c = a.hairColor;
  const { hx, hy, rx, ry } = d;
  switch (a.hairStyle) {
    case 'locken': {
      // Lange Locken (etwas länger als schulterlang), Mittelscheitel
      const curls: Circle[] = [
        ...arcCircles(hx, hy - 1, rx + 3, ry + 3, 150, 390, 11, 9),
        { x: hx - rx + 1, y: hy + 12, r: 8.5 },
        { x: hx + rx - 1, y: hy + 12, r: 8.5 },
        { x: hx - rx + 2, y: hy + 23, r: 8.5 },
        { x: hx + rx - 2, y: hy + 23, r: 8.5 },
        { x: hx - rx + 4, y: hy + 33, r: 8 },
        { x: hx + rx - 4, y: hy + 33, r: 8 },
        { x: hx - rx + 10, y: hy + 40, r: 6.5 },
        { x: hx + rx - 10, y: hy + 40, r: 6.5 },
      ];
      if (dir === 'up') {
        curls.push(
          ...arcCircles(hx, hy + 24, rx - 8, 5, 180, 360, 5, 8.5),
          ...arcCircles(hx, hy + 34, rx - 10, 4, 180, 360, 4, 8),
          { x: hx, y: hy + 40, r: 7.5 },
          { x: hx - 10, y: hy + 41, r: 6.5 },
          { x: hx + 10, y: hy + 41, r: 6.5 },
        );
      }
      if (dir === 'side') {
        curls.push(
          { x: hx + rx * 0.5, y: hy + 6, r: 13 },
          { x: hx + rx * 0.4, y: hy + 22, r: 10 },
          { x: hx + rx * 0.55, y: hy + 33, r: 8.5 },
          { x: hx + rx * 0.3, y: hy + 40, r: 7 },
        );
      }
      blob(ctx, curls, c, out(c));
      curlShine(ctx, lighten(c, 0.22), curls.slice(11));
      break;
    }
    case 'schulterlang': {
      // Offen, schulterlang, weich gewellte Spitzen
      ctx.beginPath();
      ctx.moveTo(hx - rx - 6, hy + 22);
      ctx.lineTo(hx - rx - 5, hy - 2);
      ctx.ellipse(hx, hy - 2, rx + 5, ry + 5, 0, Math.PI, Math.PI * 2);
      ctx.lineTo(hx + rx + 6, hy + 22);
      ctx.quadraticCurveTo(hx + rx + 6, hy + 29, hx + rx - 2, hy + 27);
      ctx.quadraticCurveTo(hx + rx - 7, hy + 25, hx + rx - 10, hy + 27);
      ctx.lineTo(hx - rx + 10, hy + 27);
      ctx.quadraticCurveTo(hx - rx + 7, hy + 25, hx - rx + 2, hy + 27);
      ctx.quadraticCurveTo(hx - rx - 6, hy + 29, hx - rx - 6, hy + 22);
      ctx.closePath();
      fillWithOutline(ctx, c, out(c), 2.2);
      break;
    }
    case 'bob': {
      ctx.beginPath();
      ctx.moveTo(hx - rx - 5, hy + 15);
      ctx.lineTo(hx - rx - 5, hy - 2);
      ctx.ellipse(hx, hy - 2, rx + 5, ry + 5, 0, Math.PI, Math.PI * 2);
      ctx.lineTo(hx + rx + 5, hy + 15);
      ctx.quadraticCurveTo(hx + rx + 2, hy + 19, hx + rx - 4, hy + 17);
      ctx.lineTo(hx - rx + 4, hy + 17);
      ctx.quadraticCurveTo(hx - rx - 2, hy + 19, hx - rx - 5, hy + 15);
      ctx.closePath();
      fillWithOutline(ctx, c, out(c), 2.2);
      break;
    }
    case 'zopf': {
      blob(ctx, hairCap(d, 3), c, out(c));
      if (dir === 'side') {
        blob(ctx, [
          { x: hx + rx + 2, y: hy - 6, r: 7 },
          { x: hx + rx + 7, y: hy + 2, r: 7.5 },
          { x: hx + rx + 9, y: hy + 12, r: 7 },
          { x: hx + rx + 8, y: hy + 21, r: 5.5 },
        ], c, out(c));
      } else if (dir === 'up') {
        blob(ctx, [
          { x: hx, y: hy + 4, r: 7 },
          { x: hx, y: hy + 14, r: 7.5 },
          { x: hx, y: hy + 24, r: 6 },
        ], c, out(c));
      } else {
        blob(ctx, [
          { x: hx + rx + 2, y: hy - 4, r: 6.5 },
          { x: hx + rx + 5, y: hy + 6, r: 6 },
        ], c, out(c));
      }
      break;
    }
    case 'dutt': {
      blob(ctx, hairCap(d, 3), c, out(c));
      const bunY = dir === 'side' ? hy - ry - 1 : hy - ry - 4;
      const bunX = dir === 'side' ? hx + rx * 0.45 : hx;
      blob(ctx, [{ x: bunX, y: bunY, r: 10.5 }], c, out(c));
      break;
    }
    case 'kurz': {
      blob(ctx, hairCap(d, 2.5), c, out(c));
      break;
    }
    case 'wuschel': {
      blob(ctx, [...hairCap(d, 3), ...arcCircles(hx, hy - 4, rx + 1, ry + 3, 170, 370, 9, 8)], c, out(c));
      break;
    }
  }
}

/** Vorderer Teil der Haare (Pony) – über dem Gesicht. */
function drawHairFront(ctx: Ctx, a: Appearance, d: Dims, dir: ChibiDir) {
  const c = a.hairColor;
  const hl = lighten(c, 0.28);
  const { hx, hy, rx, ry } = d;

  if (dir === 'up') {
    // Hinterkopf komplett bedeckt
    const cover: Circle[] = [{ x: hx, y: hy, r: rx + 1 }, { x: hx - 9, y: hy + 6, r: rx * 0.75 }, { x: hx + 9, y: hy + 6, r: rx * 0.75 }];
    if (a.hairStyle === 'locken' || a.hairStyle === 'wuschel') {
      cover.push(...arcCircles(hx, hy + 2, rx - 4, ry - 4, 0, 360, 10, 7.5));
    }
    blob(ctx, cover, c, out(c));
    ctx.fillStyle = hl;
    ctx.beginPath();
    ctx.ellipse(hx - 7, hy - ry * 0.45, 7, 3.2, -0.4, 0, Math.PI * 2);
    ctx.fill();
    if (a.hairStyle === 'dutt') blob(ctx, [{ x: hx, y: hy - ry - 4, r: 10.5 }], c, out(c));
    return;
  }

  const side = dir === 'side';
  switch (a.hairStyle) {
    case 'locken': {
      if (side) {
        // Seitenansicht: Haar oben und hinten, Stirn frei
        const back: Circle[] = [
          ...arcCircles(hx, hy - 3, rx - 2, ry - 2, 222, 300, 4, 8.5),
          { x: hx + rx * 0.2, y: hy - ry * 0.55, r: 12 },
          { x: hx + rx * 0.62, y: hy - 6, r: 11 },
          { x: hx + rx * 0.5, y: hy + 7, r: 11 },
          { x: hx + rx * 0.62, y: hy + 17, r: 9 },
        ];
        blob(ctx, back, c, out(c));
        curlShine(ctx, hl, back.slice(0, 4));
        break;
      }
      // Vorne: Mittelscheitel, zwei lockige „Vorhänge“ rahmen das Gesicht
      ctx.beginPath();
      ctx.moveTo(hx - rx - 1, hy + 6);
      ctx.quadraticCurveTo(hx - rx - 2, hy - ry - 4, hx - 2, hy - ry - 3);
      ctx.lineTo(hx + 2, hy - ry - 3);
      ctx.quadraticCurveTo(hx + rx + 2, hy - ry - 4, hx + rx + 1, hy + 6);
      ctx.quadraticCurveTo(hx + rx - 7, hy - 6, hx + 2, hy - ry * 0.5);
      ctx.lineTo(hx - 2, hy - ry * 0.5);
      ctx.quadraticCurveTo(hx - rx + 7, hy - 6, hx - rx - 1, hy + 6);
      ctx.closePath();
      fillWithOutline(ctx, c, out(c), 2.2);
      // lockige Außenkanten
      const sides: Circle[] = [
        ...arcCircles(hx, hy - 2, rx + 0.5, ry + 1, 200, 340, 7, 6.5),
        { x: hx - rx + 1, y: hy + 3, r: 6.5 },
        { x: hx + rx - 1, y: hy + 3, r: 6.5 },
        { x: hx - rx + 2, y: hy + 12, r: 6 },
        { x: hx + rx - 2, y: hy + 12, r: 6 },
      ];
      blob(ctx, sides, c, out(c), 1.8);
      // Scheitel
      ctx.strokeStyle = out(c);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(hx, hy - ry - 2);
      ctx.lineTo(hx, hy - ry * 0.55);
      ctx.stroke();
      curlShine(ctx, hl, sides);
      break;
    }
    case 'schulterlang': {
      ctx.beginPath();
      if (side) {
        sideHairPath(ctx, d, 25);
      } else {
        // Seitenscheitel, Haare locker zur Seite gekämmt
        ctx.moveTo(hx - rx - 2, hy + 8);
        ctx.quadraticCurveTo(hx - rx - 2, hy - ry - 5, hx - 6, hy - ry - 4);
        ctx.quadraticCurveTo(hx + rx + 2, hy - ry - 4, hx + rx + 2, hy + 8);
        ctx.quadraticCurveTo(hx + rx - 5, hy - 4, hx + 4, hy - ry * 0.45);
        ctx.quadraticCurveTo(hx - 6, hy - 9, hx - rx + 4, hy - 2);
        ctx.quadraticCurveTo(hx - rx + 1, hy + 2, hx - rx - 2, hy + 8);
      }
      ctx.closePath();
      fillWithOutline(ctx, c, out(c), 2.2);
      shineHair(ctx, hl, hx + 6, hy - ry + 2);
      break;
    }
    case 'bob': {
      ctx.beginPath();
      if (side) {
        sideHairPath(ctx, d, 17);
      } else {
        ctx.moveTo(hx - rx - 1, hy + 2);
        ctx.quadraticCurveTo(hx - rx, hy - ry - 5, hx, hy - ry - 5);
        ctx.quadraticCurveTo(hx + rx, hy - ry - 5, hx + rx + 1, hy + 2);
        ctx.quadraticCurveTo(hx + rx - 4, hy - 7, hx + 8, hy - 7);
        ctx.quadraticCurveTo(hx, hy - 4, hx - 8, hy - 7);
        ctx.quadraticCurveTo(hx - rx + 4, hy - 7, hx - rx - 1, hy + 2);
      }
      ctx.closePath();
      fillWithOutline(ctx, c, out(c), 2.2);
      shineHair(ctx, hl, hx - 6, hy - ry + 2);
      break;
    }
    case 'zopf':
    case 'kurz':
    case 'dutt':
    case 'wuschel': {
      // Seitlich gekämmter Pony
      ctx.beginPath();
      if (side) {
        sideHairPath(ctx, d, ry * 0.7);
      } else {
        const short = a.hairStyle === 'kurz';
        ctx.moveTo(hx - rx - 1, hy + (short ? -2 : 4));
        ctx.quadraticCurveTo(hx - rx - 1, hy - ry - 4, hx, hy - ry - 4);
        ctx.quadraticCurveTo(hx + rx + 1, hy - ry - 4, hx + rx + 1, hy + (short ? -2 : 4));
        ctx.quadraticCurveTo(hx + rx - 3, hy - 6, hx + 10, hy - 9);
        ctx.quadraticCurveTo(hx - 2, hy - 12, hx - 14, hy - 6);
        ctx.quadraticCurveTo(hx - rx + 2, hy - 4, hx - rx - 1, hy + (short ? -2 : 4));
      }
      ctx.closePath();
      fillWithOutline(ctx, c, out(c), 2.2);
      if (a.hairStyle === 'wuschel' && !side) {
        blob(ctx, arcCircles(hx, hy - 6, rx - 6, ry - 6, 200, 340, 5, 6), c, out(c), 1.6);
      }
      shineHair(ctx, hl, hx - 7, hy - ry + 3);
      break;
    }
  }
}

/** Haar-Silhouette in der Seitenansicht (Blick nach links); `nape` = Länge am Hinterkopf. */
function sideHairPath(ctx: Ctx, d: Dims, nape: number) {
  const { hx, hy, rx, ry } = d;
  ctx.moveTo(hx - rx + 2, hy - 4);
  ctx.quadraticCurveTo(hx - rx + 2, hy - ry - 3, hx + 3, hy - ry - 3);
  ctx.quadraticCurveTo(hx + rx + 4, hy - ry + 1, hx + rx + 3, hy + 6);
  ctx.quadraticCurveTo(hx + rx + 2, hy + nape + 2, hx + rx * 0.55, hy + nape);
  ctx.quadraticCurveTo(hx + rx * 0.22, hy + 8, hx + rx * 0.12, hy - 3);
  ctx.quadraticCurveTo(hx - 4, hy - 9, hx - rx + 2, hy - 4);
}

/** Glanzpunkte auf einzelnen Locken */
function curlShine(ctx: Ctx, color: string, curls: Circle[]) {
  ctx.fillStyle = color;
  for (const b of curls) {
    ctx.beginPath();
    ctx.ellipse(b.x - b.r * 0.25, b.y - b.r * 0.35, b.r * 0.32, b.r * 0.19, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function shineHair(ctx: Ctx, color: string, x: number, y: number) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 7, 2.8, -0.35, 0, Math.PI * 2);
  ctx.fill();
}

// ---------------------------------------------------------------------------
// Körper
// ---------------------------------------------------------------------------

function torsoPath(ctx: Ctx, topY: number, bottomY: number, top: number, bottom: number, r = 6) {
  ctx.beginPath();
  ctx.moveTo(-top + r * 0.6, topY);
  ctx.lineTo(top - r * 0.6, topY);
  ctx.quadraticCurveTo(top + 1, topY, top + 1.5, topY + r);
  ctx.lineTo(bottom, bottomY - r * 0.5);
  ctx.quadraticCurveTo(bottom + 0.5, bottomY, bottom - r, bottomY);
  ctx.lineTo(-bottom + r, bottomY);
  ctx.quadraticCurveTo(-bottom - 0.5, bottomY, -bottom, bottomY - r * 0.5);
  ctx.lineTo(-top - 1.5, topY + r);
  ctx.quadraticCurveTo(-top - 1, topY, -top + r * 0.6, topY);
  ctx.closePath();
}

interface OutfitColors {
  top: string;
  bottom: string;
  legs: string;
  shoes: string;
  dressLength: number; // wie weit Kleid/Rock über die Hüfte reicht
}

function outfitColors(a: Appearance): OutfitColors {
  const shoes = '#a07a66';
  switch (a.outfit) {
    case 'kleid':
      return { top: a.outfitColor, bottom: a.outfitColor, legs: a.skinTone, shoes, dressLength: 6 };
    case 'pulli':
      return { top: a.outfitColor, bottom: darken(a.accentColor === '#ffffff' ? '#8a9bc4' : a.accentColor, 0.05), legs: a.skinTone, shoes, dressLength: 5 };
    case 'latzhose':
      return { top: a.accentColor, bottom: a.outfitColor, legs: a.outfitColor, shoes, dressLength: 0 };
    case 'strickjacke':
      return { top: a.outfitColor, bottom: darken('#8a9bc4', 0.1), legs: a.skinTone, shoes, dressLength: 5 };
    case 'hemd':
      return { top: a.outfitColor, bottom: a.accentColor === '#ffffff' ? '#7d6a73' : a.accentColor, legs: a.accentColor === '#ffffff' ? '#7d6a73' : a.accentColor, shoes: '#6d5550', dressLength: 0 };
  }
}

function drawLegs(ctx: Ctx, a: Appearance, d: Dims, dir: ChibiDir, pose: ChibiPose, oc: OutfitColors) {
  const legW = 7.2 * Math.min(1.15, a.build);
  const top = d.hipY - 2;
  if (pose.sit) {
    // Sitzend: kurze, baumelnde Beinchen vor der Sitzfläche
    for (const x of [-d.legX, d.legX]) {
      ctx.beginPath();
      ctx.roundRect(x - legW / 2, top, legW, 10, legW / 2.2);
      fillWithOutline(ctx, oc.legs, out(oc.legs), 1.8);
      ellipse(ctx, x, top + 10, legW * 0.62, 3.6, oc.shoes, out(oc.shoes), 1.6);
    }
    return;
  }
  const draw = (x: number, lift: number, shoeDx: number) => {
    const bottom = d.footY - lift;
    ctx.beginPath();
    ctx.roundRect(x - legW / 2, top, legW, bottom - top, legW / 2.2);
    fillWithOutline(ctx, oc.legs, out(oc.legs), 1.8);
    ellipse(ctx, x + shoeDx, bottom - 0.5, legW * 0.62, 3.6, oc.shoes, out(oc.shoes), 1.6);
  };
  if (dir === 'side') {
    const swing = pose.leg === 0 ? 0 : pose.leg === 1 ? 4.5 : -4.5;
    draw(1.5 - swing, pose.leg === 0 ? 0 : 1.2, -1.5);
    draw(-1.5 + swing, 0, -1.5);
    return;
  }
  const liftL = pose.leg === 3 ? 2.2 : 0;
  const liftR = pose.leg === 1 ? 2.2 : 0;
  draw(-d.legX, liftL, 0);
  draw(d.legX, liftR, 0);
}

function drawArm(ctx: Ctx, a: Appearance, x: number, y: number, angle: number, sleeve: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const len = 13 * Math.min(1.1, a.height);
  ctx.beginPath();
  ctx.roundRect(-3.6, -1, 7.2, len, 3.6);
  fillWithOutline(ctx, sleeve, out(sleeve), 1.8);
  ellipse(ctx, 0, len + 0.5, 3.8, 3.8, a.skinTone, out(a.skinTone), 1.6);
  ctx.restore();
}

function drawBody(ctx: Ctx, a: Appearance, d: Dims, dir: ChibiDir, pose: ChibiPose, oc: OutfitColors) {
  const side = dir === 'side';
  const sh = side ? d.shoulder * 0.78 : d.shoulder;
  const hem = side ? d.hem * 0.8 : d.hem;
  const top = d.neckY;
  const swing = pose.leg === 0 ? 0 : pose.leg === 1 ? 0.35 : -0.35;

  // Hinterer Arm (Seitenansicht)
  if (side) drawArm(ctx, a, 2, top + 5, -swing, darken(oc.top, 0.08));

  // Unterteil (Rock/Hose) zuerst, Oberteil darüber
  if (a.outfit === 'kleid') {
    torsoPath(ctx, top, d.hipY + oc.dressLength, sh, hem + 3, 6);
    fillWithOutline(ctx, oc.top, out(oc.top), 2);
    // kleiner Kragen
    if (!side && dir === 'down') {
      ctx.fillStyle = a.accentColor;
      ctx.strokeStyle = out(a.accentColor);
      ctx.lineWidth = 1.4;
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(s * 4.2, top + 2.5, 5, 3.4, s * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
    // Saum-Verzierung
    ctx.strokeStyle = lighten(oc.top, 0.45);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-hem - 1, d.hipY + oc.dressLength - 3);
    ctx.lineTo(hem + 1, d.hipY + oc.dressLength - 3);
    ctx.stroke();
  } else if (a.outfit === 'latzhose') {
    // Shirt
    torsoPath(ctx, top, d.hipY - 2, sh, hem - 1, 6);
    fillWithOutline(ctx, oc.top, out(oc.top), 2);
    // Latz + Hose
    ctx.beginPath();
    ctx.roundRect(-sh + 3, top + 7, (sh - 3) * 2, d.hipY - top - 5, [4, 4, 2, 2]);
    torsoPath(ctx, top + 9, d.hipY + 1, sh - 2, hem, 4);
    fillWithOutline(ctx, oc.bottom, out(oc.bottom), 1.8);
    if (dir !== 'up') {
      ellipse(ctx, -sh + 6, top + 10, 1.6, 1.6, '#fff6d8');
      if (!side) ellipse(ctx, sh - 6, top + 10, 1.6, 1.6, '#fff6d8');
    }
  } else {
    // Rock bzw. Hose
    const skirt = oc.dressLength > 0;
    torsoPath(ctx, d.hipY - 9, d.hipY + (skirt ? oc.dressLength : 1), hem - 2, skirt ? hem + 2.5 : hem, 4);
    fillWithOutline(ctx, oc.bottom, out(oc.bottom), 1.8);
    // Oberteil
    torsoPath(ctx, top, d.hipY - 3, sh, hem - 0.5, 6);
    fillWithOutline(ctx, oc.top, out(oc.top), 2);
    if (a.outfit === 'strickjacke' && dir === 'down') {
      // Bluse in der Mitte, Knöpfe
      ctx.fillStyle = a.accentColor;
      ctx.beginPath();
      ctx.moveTo(-4.5, top + 0.5);
      ctx.lineTo(4.5, top + 0.5);
      ctx.lineTo(2.5, d.hipY - 3);
      ctx.lineTo(-2.5, d.hipY - 3);
      ctx.closePath();
      ctx.fill();
      for (let i = 0; i < 3; i++) ellipse(ctx, 4.2, top + 6 + i * 6, 1.3, 1.3, lighten(a.outfitColor, 0.6));
    }
    if (a.outfit === 'pulli' && dir !== 'up') {
      // Strickmuster
      ctx.strokeStyle = lighten(oc.top, 0.35);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-sh + 2, d.hipY - 6);
      ctx.lineTo(sh - 2, d.hipY - 6);
      ctx.stroke();
    }
    if (a.outfit === 'hemd' && dir === 'down') {
      // Kragen & Knopfleiste
      ctx.fillStyle = lighten(oc.top, 0.55);
      ctx.strokeStyle = out(oc.top);
      ctx.lineWidth = 1.3;
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(0, top + 5);
        ctx.lineTo(s * 7, top - 0.5);
        ctx.lineTo(s * 2, top - 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.strokeStyle = darken(oc.top, 0.12);
      ctx.beginPath();
      ctx.moveTo(0, top + 5);
      ctx.lineTo(0, d.hipY - 4);
      ctx.stroke();
    }
  }

  // Arme
  if (side) {
    drawArm(ctx, a, -1, top + 5, swing, oc.top);
  } else {
    const armSwing = dir === 'down' || dir === 'up' ? swing * 0.5 : 0;
    drawArm(ctx, a, -sh - 1.5, top + 4, 0.22 + armSwing, oc.top);
    drawArm(ctx, a, sh + 1.5, top + 4, -0.22 + armSwing, oc.top);
  }
}

// ---------------------------------------------------------------------------
// Kopf & Gesicht
// ---------------------------------------------------------------------------

function drawHead(ctx: Ctx, a: Appearance, d: Dims, dir: ChibiDir) {
  const skin = a.skinTone;
  // Ohren
  if (dir === 'down' || dir === 'up') {
    ellipse(ctx, d.hx - d.rx + 0.5, d.hy + 3, 4.6, 5.4, skin, out(skin), 1.6);
    ellipse(ctx, d.hx + d.rx - 0.5, d.hy + 3, 4.6, 5.4, skin, out(skin), 1.6);
  }
  ellipse(ctx, d.hx, d.hy, d.rx, d.ry, skin, out(skin), 2.1);
  if (dir === 'side') {
    ellipse(ctx, d.hx + 3, d.hy + 3, 4.2, 5, skin, out(skin), 1.4);
    ellipse(ctx, d.hx + 3, d.hy + 3, 1.8, 2.6, darken(skin, 0.12));
  }
}

function drawFace(ctx: Ctx, a: Appearance, d: Dims, dir: ChibiDir, pose: ChibiPose) {
  if (dir === 'up') return;
  const side = dir === 'side';
  const eyeY = d.hy + 3;
  const eyes = side ? [d.hx - 11] : [d.hx - 9.5, d.hx + 9.5];

  // Wangen
  if (a.blush) {
    ctx.fillStyle = palette.blush;
    const cheeks = side ? [d.hx - 10] : [d.hx - 14.5, d.hx + 14.5];
    for (const x of cheeks) {
      ctx.beginPath();
      ctx.ellipse(x, eyeY + 7, 4.6, 2.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Augen
  for (const x of eyes) {
    if (pose.blink) {
      ctx.strokeStyle = palette.eyes;
      ctx.lineWidth = 1.9;
      ctx.beginPath();
      ctx.moveTo(x - 3.6, eyeY);
      ctx.quadraticCurveTo(x, eyeY + 2.6, x + 3.6, eyeY);
      ctx.stroke();
    } else {
      ellipse(ctx, x, eyeY, 3.7, 4.7, palette.eyes);
      ellipse(ctx, x - 1.2, eyeY - 1.7, 1.45, 1.45, '#ffffff');
      ellipse(ctx, x + 1.3, eyeY + 1.6, 0.7, 0.7, 'rgba(255,255,255,0.8)');
    }
  }

  // Bart
  const bearded = a.beard !== 'keiner';
  if (bearded) {
    const bc = lighten(a.hairColor, 0.06);
    const full = a.beard === 'voll';
    const r = full ? 5.6 : 3.6;
    const circles = side
      ? arcCircles(d.hx - 4, d.hy + 3, d.rx - 6, d.ry - 3, 60, 150, 5, r)
      : arcCircles(d.hx, d.hy + 3, d.rx - 5, d.ry - 3, 25, 155, 8, r);
    if (full) circles.push({ x: side ? d.hx - 10 : d.hx, y: d.hy + d.ry - 1, r: 6 });
    blob(ctx, circles, bc, out(bc), 1.5);
    // Schnurrbart
    const mx = side ? d.hx - 15 : d.hx;
    ellipse(ctx, mx - 3.2, eyeY + 8.4, 3.7, 2.2, bc, out(bc), 1.1);
    ellipse(ctx, mx + 3.2, eyeY + 8.4, 3.7, 2.2, bc, out(bc), 1.1);
  }

  // Mund
  const mx = side ? d.hx - 16 : d.hx;
  const my = bearded ? eyeY + 11.8 : eyeY + 9.5;
  ctx.strokeStyle = darken(a.skinTone, 0.55);
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(mx - 2.6, my);
  ctx.quadraticCurveTo(mx, my + 2.5, mx + 2.6, my);
  ctx.stroke();

  // Brille
  if (a.glasses) {
    ctx.strokeStyle = '#7a5e6a';
    ctx.lineWidth = 1.5;
    for (const x of eyes) {
      ctx.beginPath();
      ctx.arc(x, eyeY, 6.2, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    if (side) {
      ctx.moveTo(eyes[0] + 6.2, eyeY - 1);
      ctx.lineTo(d.hx + 4, eyeY - 2);
    } else {
      ctx.moveTo(eyes[0] + 6.2, eyeY - 1);
      ctx.quadraticCurveTo(d.hx, eyeY - 3.5, eyes[1] - 6.2, eyeY - 1);
    }
    ctx.stroke();
  }
}

// ---------------------------------------------------------------------------
// Öffentliche API
// ---------------------------------------------------------------------------

/**
 * Zeichnet eine Figur. `ctx` muss so verschoben sein, dass (0, 0) zwischen
 * den Füßen liegt. Seitenansicht schaut nach links (für rechts spiegeln).
 */
export function drawChibi(ctx: Ctx, a: Appearance, dir: ChibiDir, pose: ChibiPose) {
  const d = dims(a);
  const oc = outfitColors(a);
  ctx.save();
  // Sitzend: ganze Figur absenken – die Hüfte liegt auf der Sitzfläche (Ursprung)
  if (pose.sit) ctx.translate(0, -7 - d.hipY);
  if (dir !== 'up') drawHairBack(ctx, a, d, dir);
  drawLegs(ctx, a, d, dir, pose, oc);
  drawBody(ctx, a, d, dir, pose, oc);
  if (dir === 'up') drawHairBack(ctx, a, d, dir);
  drawHead(ctx, a, d, dir);
  drawFace(ctx, a, d, dir, pose);
  drawHairFront(ctx, a, d, dir);
  ctx.restore();
}

/** Alle Einzelbilder, die das Spiel pro Figur braucht. */
type FrameDef = { name: string; dir: ChibiDir; pose: ChibiPose };

export const CHIBI_FRAMES: FrameDef[] = (['down', 'up', 'side'] as const).flatMap(
  (dir): FrameDef[] => [
    { name: `${dir}-idle`, dir, pose: { leg: 0, blink: false } },
    { name: `${dir}-blink`, dir, pose: { leg: 0, blink: true } },
    { name: `${dir}-walk1`, dir, pose: { leg: 1, blink: false } },
    { name: `${dir}-walk2`, dir, pose: { leg: 3, blink: false } },
  ],
).concat(<FrameDef[]>[
  { name: 'down-sit', dir: 'down', pose: { leg: 0, blink: false, sit: true } },
  { name: 'down-sit-blink', dir: 'down', pose: { leg: 0, blink: true, sit: true } },
]);

/**
 * Zeichnet alle Frames nebeneinander in ein Canvas (Spritesheet).
 * Rückgabe enthält die Frame-Rechtecke in Pixeln.
 */
export function renderChibiSheet(a: Appearance, res: number) {
  const fw = Math.ceil(CHIBI_W * res);
  const fh = Math.ceil(CHIBI_H * res);
  const canvas = document.createElement('canvas');
  canvas.width = fw * CHIBI_FRAMES.length;
  canvas.height = fh;
  const ctx = canvas.getContext('2d') as Ctx;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const frames: Array<{ name: string; x: number; y: number; w: number; h: number }> = [];
  CHIBI_FRAMES.forEach((f, i) => {
    ctx.save();
    ctx.translate(i * fw, 0);
    ctx.scale(res, res);
    ctx.translate(CHIBI_W / 2, CHIBI_FEET);
    drawChibi(ctx, a, f.dir, f.pose);
    ctx.restore();
    frames.push({ name: f.name, x: i * fw, y: 0, w: fw, h: fh });
  });
  return { canvas, frames };
}

/** Zeichnet eine Vorschau (z. B. im Charakter-Editor) in ein vorhandenes Canvas. */
export function drawChibiPreview(canvas: HTMLCanvasElement, a: Appearance, dir: ChibiDir = 'down', pose: ChibiPose = { leg: 0, blink: false }) {
  const ctx = canvas.getContext('2d') as Ctx;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const scale = Math.min(canvas.width / CHIBI_W, canvas.height / CHIBI_H);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.translate(canvas.width / 2, canvas.height - (CHIBI_H - CHIBI_FEET) * scale);
  ctx.scale(scale, scale);
  // Bodenschatten
  ctx.fillStyle = 'rgba(80, 60, 90, 0.15)';
  ctx.beginPath();
  ctx.ellipse(0, -1, 20, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  drawChibi(ctx, a, dir, pose);
}
