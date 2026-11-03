/**
 * 3D-Chibi-Figuren: großer runder Kopf, kleiner Körper, weiche Formen.
 *
 * Jede Figur entsteht vollständig aus `Appearance` (Frisur, Farben, Größe,
 * Statur, Bart, Brille …). Das Gesicht wird als Textur gezeichnet (mit
 * Blinzel-Variante). Ursprung = zwischen den Füßen, Blickrichtung = +Z.
 */
import * as THREE from 'three';
import type { Appearance } from '../../core/appearance';
import { darken, lighten, palette } from '../../style/palette';
import { mesh, toon } from '../materials';

const sphere = new THREE.SphereGeometry(1, 20, 16);
const sphereLow = new THREE.SphereGeometry(1, 10, 8);
const cylinder = new THREE.CylinderGeometry(1, 1, 1, 14);
const capsule = new THREE.CapsuleGeometry(1, 1, 4, 10);

// ---------------------------------------------------------------------------
// Gesicht
// ---------------------------------------------------------------------------

const FACE_PHI = 1.9;
const FACE_THETA_START = 0.95;
const FACE_THETA = 1.25;

function drawFace(a: Appearance, blink: boolean): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 192;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;
  ctx.lineCap = 'round';
  const eyeY = 78;
  const eyes = [92, 164];
  if (a.blush) {
    ctx.fillStyle = 'rgba(255, 140, 160, 0.5)';
    for (const x of [62, 194]) {
      ctx.beginPath();
      ctx.ellipse(x, eyeY + 34, 20, 11, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  for (const x of eyes) {
    if (blink) {
      ctx.strokeStyle = palette.eyes;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(x - 15, eyeY);
      ctx.quadraticCurveTo(x, eyeY + 11, x + 15, eyeY);
      ctx.stroke();
    } else {
      ctx.fillStyle = palette.eyes;
      ctx.beginPath();
      ctx.ellipse(x, eyeY, 14, 19, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x - 5, eyeY - 7, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 5, eyeY + 7, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Mund (bei Bart etwas tiefer)
  const my = a.beard !== 'keiner' ? eyeY + 52 : eyeY + 40;
  ctx.strokeStyle = darken(a.skinTone, 0.55);
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(116, my);
  ctx.quadraticCurveTo(128, my + 10, 140, my);
  ctx.stroke();
  return c;
}

function faceTexture(a: Appearance, blink: boolean): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(drawFace(a, blink));
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

// ---------------------------------------------------------------------------
// Bausteine
// ---------------------------------------------------------------------------

function part(geo: THREE.BufferGeometry, color: string, sx: number, sy: number, sz: number, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = mesh(geo, toon(color));
  m.scale.set(sx, sy, sz);
  m.position.set(x, y, z);
  return m;
}

/** Kugelausschnitt (für Haarkappen, Bart …) */
function shell(r: number, color: string, phiStart: number, phiLength: number, thetaStart: number, thetaLength: number): THREE.Mesh {
  const g = new THREE.SphereGeometry(r, 24, 16, phiStart, phiLength, thetaStart, thetaLength);
  const m = mesh(g, toon(color, { side: THREE.DoubleSide }));
  return m;
}

/** Punkt auf einer Kugel: theta von oben (0) nach unten (π), phi = π/2 ist vorne (+Z) */
function onSphere(r: number, theta: number, phi: number): THREE.Vector3 {
  return new THREE.Vector3(-r * Math.cos(phi) * Math.sin(theta), r * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta));
}

// ---------------------------------------------------------------------------
// Haare
// ---------------------------------------------------------------------------

function addHair(head: THREE.Group, a: Appearance, R: number) {
  const col = a.hairColor;
  const hl = lighten(col, 0.2);
  const front = Math.PI / 2;
  const openFace = 0.85; // halbe Breite der Gesichtsöffnung (phi)

  // Kappe hinten/seitlich (lässt das Gesicht frei)
  const backCap = (thetaLen: number, rr = 1.06) =>
    head.add(shell(R * rr, col, front + openFace, Math.PI * 2 - openFace * 2, 0, thetaLen));
  // Oberkopf (ganz rundum)
  const topCap = (thetaLen: number, rr = 1.07) => head.add(shell(R * rr, col, 0, Math.PI * 2, 0, thetaLen));

  const curl = (pos: THREE.Vector3, r: number, color = col) => {
    const m = part(sphereLow, color, r, r, r, pos.x, pos.y, pos.z);
    head.add(m);
    return m;
  };

  switch (a.hairStyle) {
    case 'locken': {
      // Mittelscheitel: zwei lockige Hälften, Stirn frei, Locken bis über die Schultern
      topCap(0.95);
      backCap(2.15, 1.05);
      for (let row = 0; row < 4; row++) {
        const theta = 0.35 + row * 0.42;
        const n = 10 + row * 2;
        for (let i = 0; i < n; i++) {
          const phi = (i / n) * Math.PI * 2;
          const dFront = Math.abs(Math.atan2(Math.sin(phi - front), Math.cos(phi - front)));
          if (row >= 1 && dFront < openFace * (row === 1 ? 0.75 : 0.95)) continue; // Gesicht frei
          if (row === 0 && dFront < 0.18) continue; // Scheitel
          const r = 0.27 * R * (0.85 + ((i * 7) % 5) * 0.06);
          curl(onSphere(R * 1.04, theta, phi), r, i % 3 === 0 ? hl : col);
        }
      }
      // lange Locken hinten und an den Seiten (bis unter die Schultern)
      for (let k = 0; k < 9; k++) {
        const phi = front + Math.PI * (0.38 + (k / 8) * 1.24);
        for (let j = 0; j < 3; j++) {
          const p = onSphere(R * 0.98, 2.1, phi);
          p.y -= R * (0.25 + j * 0.42);
          p.multiplyScalar(1);
          curl(p, R * (0.29 - j * 0.03), (k + j) % 3 === 0 ? hl : col);
        }
      }
      break;
    }
    case 'schulterlang': {
      topCap(1.0);
      backCap(2.3, 1.06);
      // Seitenscheitel-Pony, zur Seite gestrichen
      const fringe = shell(R * 1.075, col, front - 0.95, 1.4, 0.55, 0.42);
      head.add(fringe);
      // Haare fallen bis auf die Schultern (hinten und seitlich, Gesicht bleibt frei)
      const fall = mesh(
        new THREE.CylinderGeometry(R * 1.0, R * 0.98, R * 0.55, 20, 1, true, front + openFace + 0.25, Math.PI * 2 - (openFace + 0.25) * 2),
        toon(col, { side: THREE.DoubleSide }),
      );
      fall.position.y = -R * 0.62;
      head.add(fall);
      break;
    }
    case 'bob': {
      topCap(1.0);
      backCap(2.1, 1.06);
      head.add(shell(R * 1.075, col, front - 1.0, 2.0, 0.45, 0.5));
      break;
    }
    case 'zopf':
    case 'dutt':
    case 'kurz':
    case 'wuschel': {
      topCap(a.hairStyle === 'kurz' ? 1.05 : 1.15, 1.05);
      backCap(a.hairStyle === 'kurz' ? 1.75 : 1.95, 1.04);
      head.add(shell(R * 1.07, col, front - 1.0, 1.6, 0.5, 0.42));
      if (a.hairStyle === 'zopf') {
        for (let j = 0; j < 4; j++) curl(new THREE.Vector3(0, R * (0.35 - j * 0.32), -R * (1.1 + j * 0.06)), R * (0.3 - j * 0.04));
      }
      if (a.hairStyle === 'dutt') curl(new THREE.Vector3(0, R * 0.95, -R * 0.35), R * 0.42);
      if (a.hairStyle === 'wuschel') {
        for (let i = 0; i < 12; i++) curl(onSphere(R * 1.05, 0.35 + (i % 3) * 0.3, (i / 12) * Math.PI * 2 + 0.3), R * 0.28, i % 2 ? hl : col);
      }
      break;
    }
  }
}

// ---------------------------------------------------------------------------
// Figur
// ---------------------------------------------------------------------------

export interface ChibiPose {
  /** Laufphase in Schritten (fortlaufend) */
  step: number;
  moving: boolean;
  running: boolean;
  sitting: boolean;
  blink: boolean;
  /** Zeit für Atmen etc. */
  t: number;
}

export class Chibi3D {
  readonly root = new THREE.Group();
  private body = new THREE.Group();
  private head = new THREE.Group();
  private face!: THREE.Mesh;
  private faceOpen!: THREE.Texture;
  private faceBlink!: THREE.Texture;
  private legs: THREE.Group[] = [];
  private arms: THREE.Group[] = [];
  private hipY = 0;

  constructor(appearance: Appearance) {
    this.root.add(this.body);
    this.build(appearance);
  }

  setAppearance(a: Appearance) {
    this.body.clear();
    this.head = new THREE.Group();
    this.legs = [];
    this.arms = [];
    this.faceOpen?.dispose();
    this.faceBlink?.dispose();
    this.build(a);
  }

  private build(a: Appearance) {
    const h = a.height;
    const bw = a.build;
    const legLen = 0.16 * h;
    const torso = 0.28 * h;
    const R = 0.27 * (0.95 + 0.05 * h);
    this.hipY = legLen + 0.04;
    const skin = a.skinTone;

    // Kleidung bestimmen
    const ac = a.accentColor === '#ffffff' ? '#8a9bc4' : a.accentColor;
    const top = a.outfit === 'latzhose' ? a.accentColor : a.outfitColor;
    const bottom = a.outfit === 'kleid' ? a.outfitColor : a.outfit === 'latzhose' ? a.outfitColor : a.outfit === 'hemd' ? (a.accentColor === '#ffffff' ? '#7d6a73' : a.accentColor) : ac;
    const legColor = a.outfit === 'hemd' || a.outfit === 'latzhose' ? bottom : skin;
    const skirt = a.outfit === 'kleid' || a.outfit === 'pulli' || a.outfit === 'strickjacke';

    // Beine (Drehpunkt an der Hüfte)
    for (const side of [-1, 1]) {
      const leg = new THREE.Group();
      leg.position.set(side * 0.065 * bw, this.hipY, 0);
      leg.add(part(cylinder, legColor, 0.042 * Math.min(1.15, bw), legLen, 0.042, 0, -legLen / 2, 0));
      leg.add(part(sphere, '#a07a66', 0.058, 0.04, 0.075, 0, -legLen - 0.005, 0.02));
      this.body.add(leg);
      this.legs.push(leg);
    }

    // Rumpf
    const torsoY = this.hipY + torso / 2;
    const topR = 0.105 * bw;
    const hemR = (skirt ? 0.17 : 0.13) * bw;
    if (skirt) {
      const skirtH = a.outfit === 'kleid' ? torso * 0.95 : torso * 0.42;
      this.body.add(part(new THREE.CylinderGeometry(1, 1.25, 1, 18), bottom, hemR * 0.8, skirtH, hemR * 0.8, 0, this.hipY - 0.03 + skirtH / 2 - (a.outfit === 'kleid' ? 0 : 0.0), 0));
    } else {
      this.body.add(part(cylinder, bottom, 0.12 * bw, torso * 0.4, 0.11 * bw, 0, this.hipY + torso * 0.15, 0));
    }
    const shirt = part(new THREE.CylinderGeometry(0.8, 1, 1, 18), top, topR * 1.15, torso * 0.75, topR * 1.05, 0, torsoY + torso * 0.12, 0);
    this.body.add(shirt);
    // Details
    if (a.outfit === 'kleid') {
      for (const s of [-1, 1]) this.body.add(part(sphereLow, a.accentColor, 0.05, 0.022, 0.035, s * 0.04, this.hipY + torso * 0.98, 0.075));
    }
    if (a.outfit === 'latzhose') {
      this.body.add(part(cylinder, a.outfitColor, 0.085 * bw, torso * 0.42, 0.012, 0, torsoY + 0.02, 0.1 * bw));
      for (const s of [-1, 1]) this.body.add(part(sphereLow, '#fff6d8', 0.014, 0.014, 0.014, s * 0.055, torsoY + 0.13, 0.11 * bw));
    }
    if (a.outfit === 'strickjacke') {
      this.body.add(part(cylinder, a.accentColor, 0.04, torso * 0.7, 0.012, 0, torsoY + 0.03, topR * 1.02 + 0.005));
      for (let i = 0; i < 3; i++) this.body.add(part(sphereLow, lighten(a.outfitColor, 0.6), 0.012, 0.012, 0.012, 0.035, torsoY + 0.1 - i * 0.06, topR * 1.05 + 0.01));
    }
    if (a.outfit === 'hemd') {
      for (const s of [-1, 1]) {
        const col = part(box(), lighten(top, 0.5), 0.06, 0.035, 0.012, s * 0.035, this.hipY + torso * 0.95, topR * 0.95);
        col.rotation.z = s * 0.5;
        this.body.add(col);
      }
    }

    // Arme (Drehpunkt an der Schulter)
    const shoulderY = this.hipY + torso * 0.92;
    for (const side of [-1, 1]) {
      const arm = new THREE.Group();
      arm.position.set(side * (topR + 0.035), shoulderY, 0);
      arm.rotation.z = side * 0.25;
      arm.add(part(capsule, top, 0.034, 0.1 * Math.min(1.1, h), 0.034, 0, -0.08, 0));
      arm.add(part(sphere, skin, 0.038, 0.038, 0.038, 0, -0.17 * Math.min(1.1, h), 0));
      this.body.add(arm);
      this.arms.push(arm);
    }

    // Kopf
    const headY = this.hipY + torso + R * 0.82;
    this.head = new THREE.Group();
    this.head.position.y = headY;
    this.body.add(this.head);
    const skull = part(sphere, skin, R, R * 0.93, R * 0.95);
    this.head.add(skull);
    for (const s of [-1, 1]) this.head.add(part(sphere, skin, R * 0.17, R * 0.21, R * 0.12, s * R * 0.97, -R * 0.05, 0));

    this.faceOpen = faceTexture(a, false);
    this.faceBlink = faceTexture(a, true);
    const faceGeo = new THREE.SphereGeometry(R * 1.005, 24, 16, Math.PI / 2 - FACE_PHI / 2, FACE_PHI, FACE_THETA_START, FACE_THETA);
    this.face = new THREE.Mesh(faceGeo, new THREE.MeshBasicMaterial({ map: this.faceOpen, transparent: true, depthWrite: false }));
    this.face.scale.set(1, 0.93, 0.95);
    this.head.add(this.face);

    // Bart
    if (a.beard !== 'keiner') {
      const full = a.beard === 'voll';
      const beard = shell(R * 1.03, lighten(a.hairColor, 0.05), Math.PI / 2 - 1.05, 2.1, full ? 1.95 : 2.1, full ? 0.75 : 0.55);
      beard.scale.set(1, 0.93, 0.95);
      this.head.add(beard);
      for (const s of [-1, 1]) {
        const m = part(sphereLow, lighten(a.hairColor, 0.05), R * 0.13, R * 0.07, R * 0.06, s * R * 0.12, -R * 0.33, R * 0.9);
        this.head.add(m);
      }
    }

    // Haare
    addHair(this.head, a, R);

    // Brille
    if (a.glasses) {
      const frame = toon('#7a5e6a');
      for (const s of [-1, 1]) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(R * 0.2, R * 0.025, 6, 18), frame);
        ring.position.set(s * R * 0.3, -R * 0.06, R * 0.93);
        ring.rotation.y = s * 0.25;
        this.head.add(ring);
      }
      const bridge = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.02, R * 0.02, R * 0.22, 5), frame);
      bridge.rotation.z = Math.PI / 2;
      bridge.position.set(0, -R * 0.02, R * 0.98);
      this.head.add(bridge);
    }

    this.root.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && o !== this.face) {
        o.castShadow = true;
        o.receiveShadow = false;
      }
    });
  }

  /** Pose anwenden (Laufen, Sitzen, Atmen, Blinzeln) */
  pose(p: ChibiPose) {
    (this.face.material as THREE.MeshBasicMaterial).map = p.blink ? this.faceBlink : this.faceOpen;

    if (p.sitting) {
      this.body.position.y = -this.hipY + 0.02;
      for (const leg of this.legs) leg.rotation.x = -Math.PI / 2.2;
      for (const [i, arm] of this.arms.entries()) {
        arm.rotation.x = -0.5;
        arm.rotation.z = (i === 0 ? -1 : 1) * 0.15;
      }
      this.head.rotation.z = Math.sin(p.t * 0.7) * 0.04;
      this.body.scale.y = 1 + Math.sin(p.t * 2) * 0.01;
      return;
    }
    this.head.rotation.z = 0;
    if (p.moving) {
      const swing = Math.sin(p.step * Math.PI) * (p.running ? 0.75 : 0.55);
      this.legs[0].rotation.x = swing;
      this.legs[1].rotation.x = -swing;
      this.arms[0].rotation.x = -swing * 0.9;
      this.arms[1].rotation.x = swing * 0.9;
      this.body.position.y = Math.abs(Math.sin(p.step * Math.PI)) * (p.running ? 0.05 : 0.03);
      this.body.scale.y = 1;
    } else {
      for (const leg of this.legs) leg.rotation.x = 0;
      for (const arm of this.arms) arm.rotation.x = 0;
      this.body.position.y = 0;
      this.body.scale.y = 1 + Math.sin(p.t * 2.4) * 0.012;
    }
    this.arms[0].rotation.z = -0.25;
    this.arms[1].rotation.z = 0.25;
  }

  dispose() {
    this.faceOpen.dispose();
    this.faceBlink.dispose();
  }
}

let boxGeo: THREE.BoxGeometry | null = null;
function box() {
  boxGeo ??= new THREE.BoxGeometry(1, 1, 1);
  return boxGeo;
}

