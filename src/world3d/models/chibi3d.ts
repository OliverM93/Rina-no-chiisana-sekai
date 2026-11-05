/**
 * 3D-Chibi-Figuren: großer runder Kopf, kleiner Körper, weiche Formen.
 *
 * Jede Figur entsteht vollständig aus `Appearance` (Frisur, Farben, Größe,
 * Statur, Bart, Brille, Augenfarbe, Sommersprossen, Lächeln …). Das Gesicht
 * ist eine gezeichnete Textur (mit Blinzel-Variante).
 * Ursprung = zwischen den Füßen, Blickrichtung = +Z.
 */
import * as THREE from 'three';
import { outfitFor, shoesFor, type Appearance } from '../../core/appearance';
import type { Season } from '../../core/time';
import { mulberry32 } from '../../core/rng';
import { darken, lighten, mixHex } from '../../style/palette';
import { mesh, toon, toonUnique } from '../materials';
import { drawPrint } from '../../gfx/prints';
import { BAND_NAMES, PRINTED, type PrintKind } from '../../data/wardrobe';

const sphere = new THREE.SphereGeometry(1, 20, 16);
const sphereLow = new THREE.SphereGeometry(1, 12, 9);
const cylinder = new THREE.CylinderGeometry(1, 1, 1, 16);
const capsule = new THREE.CapsuleGeometry(1, 1, 4, 10);
const cone = new THREE.ConeGeometry(1, 1, 7);
const box = new THREE.BoxGeometry(1, 1, 1);
/** weites Hosenbein (unten breiter) */
const flare = new THREE.CylinderGeometry(0.72, 1, 1, 14);

const FRONT = Math.PI / 2;

// ---------------------------------------------------------------------------
// Gesicht (Textur auf einem Kugelausschnitt vor dem Kopf)
// ---------------------------------------------------------------------------

const FACE_PHI = 1.9;
const FACE_THETA_START = 0.95;
const FACE_THETA = 1.25;

function drawFace(a: Appearance, blink: boolean): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 384;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;
  ctx.scale(2, 2);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const eyeY = 80;
  const eyes = [94, 162];
  const browColor = darken(a.hairStyle === 'kurzgeschoren' ? a.beardColor || a.hairColor : a.hairColor, 0.15);

  // Wangen
  if (a.blush) {
    ctx.fillStyle = 'rgba(255, 130, 150, 0.42)';
    for (const x of [64, 192]) {
      ctx.beginPath();
      ctx.ellipse(x, eyeY + 32, 19, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Sommersprossen
  if (a.freckles) {
    const rnd = mulberry32(7);
    ctx.fillStyle = 'rgba(170, 100, 70, 0.55)';
    for (const cx of [72, 184]) {
      for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.arc(cx + (rnd() - 0.5) * 34, eyeY + 20 + (rnd() - 0.5) * 18, 1.6 + rnd() * 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(128 + (rnd() - 0.5) * 20, eyeY + 14 + rnd() * 8, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Augenbrauen (weich geschwungen)
  ctx.strokeStyle = browColor;
  ctx.lineWidth = a.beard !== 'keiner' || a.height > 1.1 ? 5.5 : 4.2;
  for (const x of eyes) {
    ctx.beginPath();
    ctx.moveTo(x - 15, eyeY - 26);
    ctx.quadraticCurveTo(x, eyeY - 35, x + 15, eyeY - 27);
    ctx.stroke();
  }

  // Augen
  for (const x of eyes) {
    if (blink) {
      ctx.strokeStyle = '#3d2d33';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x - 14, eyeY);
      ctx.quadraticCurveTo(x, eyeY + 10, x + 14, eyeY);
      ctx.stroke();
      continue;
    }
    // Augenweiß angedeutet, Iris in Augenfarbe, Pupille, Glanzlichter
    ctx.fillStyle = '#3d2d33';
    ctx.beginPath();
    ctx.ellipse(x, eyeY, 13.5, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = a.eyeColor;
    ctx.beginPath();
    ctx.ellipse(x, eyeY + 3, 10, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = darken(a.eyeColor, 0.55);
    ctx.beginPath();
    ctx.ellipse(x, eyeY + 4, 5.5, 7.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x - 5, eyeY - 6, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 5, eyeY + 8, 2.2, 0, Math.PI * 2);
    ctx.fill();
    // obere Lidlinie (mit kleinem Wimpernschwung)
    ctx.strokeStyle = '#3d2d33';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, eyeY + 2, 16, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }

  // Nase (nur ein kleiner Schatten)
  ctx.fillStyle = darken(a.skinTone, 0.18);
  ctx.beginPath();
  ctx.ellipse(128, eyeY + 22, 4, 2.6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mund
  const my = a.beard === 'voll' ? eyeY + 46 : eyeY + 40;
  const lip = darken(a.skinTone, 0.55);
  if (a.smile === 'laecheln') {
    ctx.strokeStyle = lip;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(115, my);
    ctx.quadraticCurveTo(128, my + 10, 141, my);
    ctx.stroke();
  } else {
    // offenes Grinsen (mit Zähnen, ggf. mit Zahnlücke)
    const w = a.smile === 'zahnluecke' ? 21 : 18;
    ctx.fillStyle = '#7a3b45';
    ctx.beginPath();
    ctx.moveTo(128 - w, my - 2);
    ctx.quadraticCurveTo(128, my - 5, 128 + w, my - 2);
    ctx.quadraticCurveTo(128, my + 22, 128 - w, my - 2);
    ctx.fill();
    ctx.save();
    ctx.clip();
    ctx.fillStyle = '#fffaf2';
    ctx.fillRect(128 - w, my - 6, w * 2, 9);
    if (a.smile === 'zahnluecke') {
      ctx.fillStyle = '#7a3b45';
      ctx.fillRect(124.5, my - 6, 7, 9);
    }
    ctx.fillStyle = '#f28aa0';
    ctx.beginPath();
    ctx.ellipse(128, my + 13, 9, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  return c;
}

/** Gesicht mit derselben Toon-Beleuchtung wie der Kopf (kein heller „Fleck“) */
function faceMaterial(map: THREE.Texture): THREE.MeshToonMaterial {
  const base = toon('#ffffff');
  return new THREE.MeshToonMaterial({ map, transparent: true, depthWrite: false, gradientMap: base.gradientMap, polygonOffset: true, polygonOffsetFactor: -1 });
}

function faceTexture(a: Appearance, blink: boolean): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(drawFace(a, blink));
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Streifenstoff für Hemden */
function stripeTexture(base: string, stripe: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = stripe;
  for (let x = 0; x < 64; x += 8) ctx.fillRect(x, 0, 2, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(4, 1);
  return t;
}

// ---------------------------------------------------------------------------
// Bausteine
// ---------------------------------------------------------------------------

function part(geo: THREE.BufferGeometry, color: string | THREE.Material, sx: number, sy: number, sz: number, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = mesh(geo, typeof color === 'string' ? toon(color) : color);
  m.scale.set(sx, sy, sz);
  m.position.set(x, y, z);
  return m;
}

/** Kugelausschnitt (für Haarkappen, Bart …) */
function shell(r: number, color: string, phiStart: number, phiLength: number, thetaStart: number, thetaLength: number): THREE.Mesh {
  const g = new THREE.SphereGeometry(r, 28, 18, phiStart, phiLength, thetaStart, thetaLength);
  return mesh(g, toon(color, { side: THREE.DoubleSide }));
}

/** Wie stark das Kinn bei der Gesichtsform „oval“ schmaler wird */
const CHIN_TAPER = 0.36;

/**
 * Macht die untere Kopfhälfte schmaler (sanft zum Kinn hin), damit das Gesicht
 * nicht so pausbäckig wirkt. `r` = Radius der Geometrie. Verändert `geo` direkt.
 */
function taperChin<G extends THREE.BufferGeometry>(geo: G, r: number, amount = CHIN_TAPER): G {
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / r;
    if (y >= 0.1) continue;
    const t = Math.min(1, (0.1 - y) / 1.1);
    const k = t * t * (3 - 2 * t);
    pos.setX(i, pos.getX(i) * (1 - amount * k));
    pos.setZ(i, pos.getZ(i) * (1 - amount * 0.35 * k));
    pos.setY(i, pos.getY(i) * (1 - amount * 0.5 * k));
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/** stabiler Tages-Hash (für wechselnde Bandshirts) */
function hashDay(day: string): number {
  let h = 2166136261;
  for (const ch of day) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

/**
 * Brust-Aufdruck: ein Streifen eines Kegelmantels knapp über dem Oberteil.
 * `band` = Höhenbereich als Anteil der Oberteil-Höhe (-0.5 … 0.5), `arc` = Breite im Bogenmaß.
 */
function printDecal(tex: THREE.Texture, taper: number, sx: number, sy: number, sz: number, y: number, band: [number, number], arc: number): THREE.Mesh {
  const r = (f: number) => ((1 + taper) / 2 - (1 - taper) * f) * 1.018;
  const [f0, f1] = band;
  const geo = new THREE.CylinderGeometry(r(f1), r(f0), f1 - f0, 18, 1, true, -arc / 2, arc);
  const mat = toonUnique('#ffffff');
  mat.map = tex;
  mat.transparent = true;
  mat.alphaTest = 0.35;
  const m = new THREE.Mesh(geo, mat);
  m.scale.set(sx, sy, sz);
  m.position.y = y + ((f0 + f1) / 2) * sy;
  m.receiveShadow = true;
  return m;
}

const sphereOval = taperChin(new THREE.SphereGeometry(1, 24, 18), 1);

/** Punkt auf einer Kugel: theta von oben (0) nach unten (π), phi = π/2 ist vorne (+Z) */
function onSphere(r: number, theta: number, phi: number): THREE.Vector3 {
  return new THREE.Vector3(-r * Math.cos(phi) * Math.sin(theta), r * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta));
}

/** Winkelabstand zur Vorderseite */
function fromFront(phi: number): number {
  return Math.abs(Math.atan2(Math.sin(phi - FRONT), Math.cos(phi - FRONT)));
}

// ---------------------------------------------------------------------------
// Haare
// ---------------------------------------------------------------------------

function addHair(head: THREE.Group, a: Appearance, R: number) {
  const col = a.hairColor;
  const shades = [col, lighten(col, 0.1), darken(col, 0.1)];
  const rnd = mulberry32(42);
  const openFace = 0.85;

  const backCap = (thetaLen: number, rr = 1.06, color = col, open = openFace) =>
    head.add(shell(R * rr, color, FRONT + open, Math.PI * 2 - open * 2, 0, thetaLen));
  const topCap = (thetaLen: number, rr = 1.07, color = col) => head.add(shell(R * rr, color, 0, Math.PI * 2, 0, thetaLen));
  const blob = (p: THREE.Vector3, r: number, color: string) => {
    const m = part(sphereLow, color, r, r, r, p.x, p.y, p.z);
    head.add(m);
  };

  switch (a.hairStyle) {
    case 'locken': {
      // Volle Lockenmähne mit Mittelscheitel, Stirn frei, Locken bis über die Schultern.
      const under = darken(col, 0.12);
      topCap(1.0, 1.04, under);
      backCap(2.25, 1.03, under, 0.95);
      // Haarvolumen hinten bis unter die Schultern (Grundform unter den Locken)
      const vol = mesh(new THREE.CylinderGeometry(R * 1.05, R * 1.2, R * 1.15, 22, 1, true, 1.05, Math.PI * 2 - 2.1), toon(under, { side: THREE.DoubleSide }));
      vol.position.y = -R * 0.95;
      head.add(vol);
      // viele kleine, sich überlappende Locken – wirkt weich statt „traubig“
      for (let theta = 0.18; theta < 2.2; theta += 0.17) {
        const ring = Math.max(6, Math.round(Math.sin(theta) * 34));
        for (let i = 0; i < ring; i++) {
          const phi = (i / ring) * Math.PI * 2 + (theta * 3.1) + rnd() * 0.08;
          const df = fromFront(phi);
          if (theta > 0.85 && df < openFace) continue; // Gesicht frei
          if (theta < 0.62 && df < 0.12) continue; // Mittelscheitel
          const p = onSphere(R * (1.04 + rnd() * 0.04), theta, phi);
          blob(p, R * (0.17 + rnd() * 0.06), shades[Math.floor(rnd() * 3)]);
        }
      }
      // fallende Locken (Ringellocken) hinten und seitlich
      for (let k = 0; k < 22; k++) {
        const phi = FRONT + 1.05 + (k / 21) * (Math.PI * 2 - 2.1);
        const side = fromFront(phi) < 1.4;
        const len = side ? 5 : 6;
        for (let j = 0; j < len; j++) {
          const r = R * (1.1 + j * 0.03);
          const p = new THREE.Vector3(-Math.cos(phi) * r * 0.98, -R * (0.35 + j * 0.27), Math.sin(phi) * r * 0.98);
          p.x += Math.sin(j * 2.3 + k) * R * 0.05;
          blob(p, R * (0.2 - j * 0.018), shades[(k + j) % 3]);
        }
      }
      // Gesicht umrahmende Locken an den Schläfen
      for (const s of [-1, 1]) {
        for (let j = 0; j < 4; j++) {
          const phi = FRONT + s * (openFace + 0.08);
          const p = onSphere(R * 1.06, 1.25 + j * 0.22, phi);
          p.y -= j * R * 0.08;
          blob(p, R * (0.19 - j * 0.015), shades[j % 3]);
        }
      }
      break;
    }
    case 'schulterlang': {
      topCap(1.0, 1.08);
      backCap(2.25, 1.07);
      // seitlich gescheitelter Pony, weich nach hinten fallend
      head.add(shell(R * 1.09, col, FRONT - 1.0, 1.55, 0.5, 0.45));
      // Haare fallen bis in den Nacken/auf die Schultern, Spitzen nach außen
      const fall = mesh(new THREE.CylinderGeometry(R * 1.02, R * 1.12, R * 0.6, 22, 1, true, openFace + 0.2, Math.PI * 2 - (openFace + 0.2) * 2), toon(col, { side: THREE.DoubleSide }));
      fall.position.y = -R * 0.68;
      head.add(fall);
      break;
    }
    case 'glatt': {
      // glatte Haare mit Mittelscheitel, hinter die Ohren gestrichen, fallen bis auf die Schultern
      topCap(1.0, 1.07);
      backCap(2.3, 1.065);
      // zwei Haarhälften vom Mittelscheitel aus, rahmen die Stirn ein
      for (const s of [-1, 1]) {
        const half = shell(R * 1.085, col, s > 0 ? FRONT + 0.06 : FRONT - 1.36, 1.3, 0.12, 0.85);
        head.add(half);
      }
      // glatter Fall hinten (Ohren bleiben frei)
      const open = 1.75;
      const fall = mesh(new THREE.CylinderGeometry(R * 1.03, R * 1.1, R * 0.95, 24, 1, true, open, Math.PI * 2 - open * 2), toon(col, { side: THREE.DoubleSide }));
      fall.position.y = -R * 0.82;
      head.add(fall);
      // Strähnen hinter den Ohren, fallen auf die Schultern
      for (const s of [-1, 1]) {
        const strand = part(capsule, col, R * 0.2, R * 0.42, R * 0.24, s * R * 0.88, -R * 0.78, -R * 0.42);
        strand.rotation.z = s * 0.12;
        head.add(strand);
      }
      break;
    }
    case 'bob': {
      topCap(1.0, 1.07);
      backCap(2.05, 1.07);
      // Seitenscheitel: schräger Pony, der die Stirn leicht freigibt
      head.add(shell(R * 1.085, col, FRONT - 1.05, 1.45, 0.45, 0.55));
      const fall = mesh(new THREE.CylinderGeometry(R * 1.04, R * 1.1, R * 0.38, 22, 1, true, openFace + 0.15, Math.PI * 2 - (openFace + 0.15) * 2), toon(col, { side: THREE.DoubleSide }));
      fall.position.y = -R * 0.55;
      head.add(fall);
      break;
    }
    case 'kurzgeschoren': {
      // sehr kurz – die Haarfarbe schimmert nur leicht durch
      const buzz = mixHex(a.skinTone, col, 0.6);
      topCap(0.95, 1.012, buzz);
      backCap(1.7, 1.01, buzz, 1.05);
      break;
    }
    case 'zerzaust': {
      topCap(1.1, 1.06);
      backCap(1.85, 1.05);
      head.add(shell(R * 1.07, col, FRONT - 1.0, 2.0, 0.42, 0.4));
      // abstehende, wuschelige Strähnen
      for (let i = 0; i < 40; i++) {
        const theta = 0.15 + rnd() * 1.0;
        const phi = rnd() * Math.PI * 2;
        if (theta > 0.8 && fromFront(phi) < openFace) continue;
        const p = onSphere(R * 1.02, theta, phi);
        const tuft = part(cone, shades[i % 3], R * 0.16, R * (0.2 + rnd() * 0.12), R * 0.16, p.x, p.y, p.z);
        const n = p.clone().normalize();
        tuft.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n.add(new THREE.Vector3((rnd() - 0.5) * 1.4, -0.1, (rnd() - 0.5) * 1.4)).normalize());
        head.add(tuft);
      }
      break;
    }
    case 'zopf':
    case 'dutt':
    case 'kurz':
    case 'wuschel': {
      topCap(a.hairStyle === 'kurz' ? 1.05 : 1.15, 1.05);
      backCap(a.hairStyle === 'kurz' ? 1.75 : 1.95, 1.04);
      head.add(shell(R * 1.065, col, FRONT - 1.0, 1.7, 0.48, 0.42));
      if (a.hairStyle === 'zopf') {
        for (let j = 0; j < 4; j++) blob(new THREE.Vector3(0, R * (0.35 - j * 0.32), -R * (1.1 + j * 0.06)), R * (0.3 - j * 0.04), col);
      }
      if (a.hairStyle === 'dutt') blob(new THREE.Vector3(0, R * 0.95, -R * 0.35), R * 0.42, col);
      if (a.hairStyle === 'wuschel') {
        for (let i = 0; i < 14; i++) blob(onSphere(R * 1.05, 0.35 + (i % 3) * 0.3, (i / 14) * Math.PI * 2 + 0.3), R * 0.26, shades[i % 2]);
      }
      break;
    }
  }
}

// ---------------------------------------------------------------------------
// Figur
// ---------------------------------------------------------------------------

export interface ChibiPose {
  step: number;
  moving: boolean;
  running: boolean;
  sitting: boolean;
  blink: boolean;
  t: number;
  /** Rechten Arm nach vorn halten (Winkel), z. B. beim Angeln */
  armForward?: number;
  /** Freudensprung: Fortschritt 0..1 */
  cheer?: number;
  /** Winken: Fortschritt 0..1 */
  wave?: number;
  /** Sekunden, die die Figur schon still steht (schaut sich dann ab und zu um) */
  idle?: number;
  /** Küsschen: Fortschritt 0..1 (vorbeugen, Kopf neigen) */
  kiss?: number;
  /** beim Küsschen auf die Zehenspitzen */
  tiptoe?: boolean;
}

export class Chibi3D {
  readonly root = new THREE.Group();
  private body = new THREE.Group();
  private head = new THREE.Group();
  private face!: THREE.Mesh;
  private faceOpen!: THREE.Texture;
  private faceBlink!: THREE.Texture;
  private extraTextures: THREE.Texture[] = [];
  private legs: THREE.Group[] = [];
  private arms: THREE.Group[] = [];
  private hipY = 0;
  private handY = 0;
  private held: THREE.Object3D | null = null;

  /** Jahreszeit bestimmt bei `shoes: 'saison'` die Schuhe; `day` (JJJJ-MM-TT) wählt wechselnde Kleidung. */
  constructor(
    appearance: Appearance,
    private readonly season: Season = 'sommer',
    private readonly day = '',
  ) {
    this.root.add(this.body);
    this.build(appearance);
  }

  setAppearance(a: Appearance) {
    const held = this.held;
    this.hold(null);
    this.body.clear();
    this.head = new THREE.Group();
    this.legs = [];
    this.arms = [];
    this.disposeTextures();
    this.build(a);
    this.hold(held);
  }

  /** Etwas in die (rechte) Hand nehmen – null = Hand leer */
  hold(obj: THREE.Object3D | null) {
    this.held?.removeFromParent();
    this.held = obj;
    if (obj) {
      obj.position.set(0, this.handY, 0.01);
      this.arms[0].add(obj);
    }
  }

  private disposeTextures() {
    this.faceOpen?.dispose();
    this.faceBlink?.dispose();
    for (const t of this.extraTextures) t.dispose();
    this.extraTextures = [];
  }

  private build(a: Appearance) {
    const h = a.height;
    const bw = a.build;
    const legLen = 0.17 * h;
    const torso = 0.29 * h;
    const R = 0.27 * (0.95 + 0.05 * h);
    this.hipY = legLen + 0.04;
    const skin = a.skinTone;
    const o = outfitFor(a, this.season, this.day);
    const printed = o === 'hawaii' || o === 'sport' || o === 'radierkopf' ? PRINTED[o] : null;
    const cargo = o === 'bandshirt' || o === 'polo' || o === 'jacke';

    // Farben je Outfit
    const jeans = '#5b6f99';
    const darkPants = '#2f3340';
    let top = a.outfitColor;
    let pants = darkPants;
    let skirtColor: string | null = null;
    let skirtLen = 0;
    switch (o) {
      case 'kleid':
        skirtColor = a.outfitColor;
        skirtLen = torso * 0.95;
        break;
      case 'pulli':
      case 'strickjacke':
        skirtColor = a.accentColor === '#ffffff' ? jeans : a.accentColor;
        skirtLen = torso * 0.45;
        break;
      case 'mantel':
        skirtColor = a.outfitColor;
        skirtLen = torso * 1.05;
        break;
      case 'latzhose':
        top = a.accentColor;
        pants = a.outfitColor;
        break;
      case 'hemd':
        pants = a.accentColor === '#ffffff' ? '#7d6a73' : a.accentColor;
        break;
      case 'weste':
        top = a.accentColor;
        pants = jeans;
        break;
      case 'streifenhemd':
        pants = darkPants;
        break;
      case 'hoodie':
      case 'troyer':
        pants = a.accentColor;
        break;
      case 'sweatshirt':
      case 'shorts':
      case 'sommer':
      case 'fleece':
        pants = a.accentColor === a.outfitColor ? (o === 'fleece' ? jeans : '#3a3a44') : a.accentColor;
        break;
      case 'hawaii':
      case 'sport':
      case 'radierkopf':
        top = PRINTED[o].cloth;
        pants = PRINTED[o].pants;
        break;
      case 'bandshirt':
      case 'polo':
      case 'jacke':
        pants = a.accentColor;
        break;
    }
    const shoes = shoesFor(a, this.season);
    let legColor = skirtColor && o !== 'mantel' ? (o === 'kleid' ? '#3a3440' : skin) : pants;
    // zu Stiefeln im Winter: blickdichte Strumpfhose statt nackter Beine
    if (shoes === 'stiefel' && legColor === skin) legColor = '#2a2730';

    // Beine (Drehpunkt an der Hüfte)
    for (const side of [-1, 1]) {
      const leg = new THREE.Group();
      leg.position.set(side * 0.066 * bw, this.hipY, 0);
      if (o === 'shorts' || o === 'sommer') {
        // kurze Hose: oben Stoff, darunter Beine
        leg.add(part(cylinder, skin, 0.04 * Math.min(1.15, bw), legLen, 0.04, 0, -legLen / 2, 0));
        leg.add(part(cylinder, pants, 0.054 * Math.min(1.15, bw), legLen * 0.42, 0.054, 0, -legLen * 0.21, 0));
      } else if (printed) {
        // weite Anzughose: unten ausgestellt, mit Bügelfalte
        leg.add(part(flare, legColor, 0.066 * Math.min(1.15, bw), legLen, 0.064, 0, -legLen / 2, 0));
        leg.add(part(box, lighten(legColor, 0.12), 0.004, legLen * 0.9, 0.004, 0, -legLen / 2, 0.056));
      } else {
        leg.add(part(cylinder, legColor, 0.044 * Math.min(1.15, bw), legLen, 0.044, 0, -legLen / 2, 0));
        if (cargo) {
          // Cargohose: aufgesetzte Seitentasche mit Klappe
          leg.add(part(box, darken(legColor, 0.12), 0.014, legLen * 0.3, 0.05, side * 0.044, -legLen * 0.45, 0));
          leg.add(part(box, darken(legColor, 0.2), 0.016, legLen * 0.06, 0.052, side * 0.045, -legLen * 0.31, 0));
        }
      }
      const footY = -legLen - 0.005;
      if (shoes === 'stiefel') {
        // Schnürstiefel: schwarzer Schaft, klobige Sohle mit gelber Naht
        const leather = '#1f1d22';
        leg.add(part(cylinder, leather, 0.05, legLen * 0.5, 0.05, 0, -legLen * 0.75, 0));
        leg.add(part(sphere, leather, 0.064, 0.046, 0.084, 0, footY + 0.004, 0.022));
        leg.add(part(cylinder, '#e3c04f', 0.067, 0.006, 0.088, 0, footY - 0.02, 0.022));
        leg.add(part(cylinder, '#3a3439', 0.066, 0.02, 0.087, 0, footY - 0.032, 0.022));
        for (let i = 0; i < 3; i++) leg.add(part(box, '#4a454c', 0.03, 0.005, 0.006, 0, -legLen * (0.62 + i * 0.12), 0.05));
      } else if (shoes === 'chunky' || shoes === 'chunky-schwarz') {
        // Chunky-Sneaker: klobig, dicke gestufte Sohle
        const black = shoes === 'chunky-schwarz';
        const upper = black ? '#1e1e22' : '#f7f5f1';
        leg.add(part(sphere, upper, 0.066, 0.048, 0.09, 0, footY + 0.006, 0.024));
        leg.add(part(cylinder, black ? '#2c2c31' : '#e9e5df', 0.07, 0.024, 0.094, 0, footY - 0.024, 0.024));
        leg.add(part(cylinder, black ? '#3a3a40' : '#d9d4cc', 0.071, 0.01, 0.095, 0, footY - 0.04, 0.024));
        leg.add(part(box, black ? '#4a4a52' : '#c9c4bc', 0.03, 0.012, 0.006, side * 0.025, footY + 0.012, 0.1));
      } else if (shoes === 'sneaker') {
        // weiße Sneaker mit heller Sohle
        leg.add(part(sphere, '#f7f5f1', 0.058, 0.04, 0.08, 0, footY, 0.022));
        leg.add(part(cylinder, '#e4e0da', 0.06, 0.016, 0.083, 0, footY - 0.026, 0.022));
      } else {
        leg.add(part(sphere, o === 'mantel' || o === 'kleid' ? '#3b2f36' : '#5a4038', 0.06, 0.042, 0.078, 0, footY, 0.02));
      }
      this.body.add(leg);
      this.legs.push(leg);
    }

    // Rumpf
    const torsoY = this.hipY + torso / 2;
    const topR = 0.108 * bw;
    if (skirtColor) {
      const flare = o === 'mantel' ? 1.15 : 1.28;
      const skirt = part(new THREE.CylinderGeometry(1, flare, 1, 20), skirtColor, topR * 1.25, skirtLen, topR * 1.18, 0, this.hipY - 0.03 + skirtLen / 2 - (o === 'mantel' ? 0.06 : 0), 0);
      this.body.add(skirt);
    } else {
      this.body.add(part(cylinder, pants, 0.12 * bw, torso * 0.42, 0.11 * bw, 0, this.hipY + torso * 0.15, 0));
    }

    let shirtMat: THREE.Material = toon(top);
    if (o === 'streifenhemd') {
      const tex = stripeTexture(a.outfitColor, a.accentColor);
      this.extraTextures.push(tex);
      shirtMat = new THREE.MeshToonMaterial({ map: tex });
    }
    const street = o === 'sweatshirt' || o === 'shorts' || o === 'fleece' || !!printed;
    const summer = o === 'sommer';
    /** kurze Ärmel */
    const shortSleeves = summer || o === 'bandshirt' || o === 'polo';
    // Oversize: weiter & länger (reicht über die Hüfte); „very oversized“ bei den Druck-Sweatshirts
    const big = printed ? 1.4 : o === 'fleece' ? 1.38 : 1.3;
    const shirtShape: [number, number, number, number, number] = street
      ? [0.9, topR * big, torso * (printed ? 1.04 : 0.98), topR * (big - 0.1), torsoY + torso * (printed ? -0.01 : 0.02)]
      : summer
        ? [0.86, topR * 1.18, torso * 0.7, topR * 1.08, torsoY + torso * 0.15]
        : o === 'jacke'
          ? [0.84, topR * 1.24, torso * 0.92, topR * 1.14, torsoY + torso * 0.04]
          : o === 'bandshirt' || o === 'polo'
            ? [0.84, topR * 1.2, torso * 0.84, topR * 1.12, torsoY + torso * 0.08]
            : [0.82, topR * 1.15, torso * 0.78, topR * 1.05, torsoY + torso * 0.11];
    const [taper, ssx, ssy, ssz, sy] = shirtShape;
    this.body.add(part(new THREE.CylinderGeometry(taper, 1, 1, 20), shirtMat, ssx, ssy, ssz, 0, sy, 0));
    const printKind: PrintKind | null = printed ? printed.print : o === 'bandshirt' ? 'band' : null;
    if (printKind) {
      const variant = this.day ? hashDay(this.day) % BAND_NAMES.length : 0;
      const tex = new THREE.CanvasTexture(drawPrint(printKind, variant));
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      this.extraTextures.push(tex);
      this.body.add(printDecal(tex, taper, ssx, ssy, ssz, sy, printed ? [-0.3, 0.32] : [-0.24, 0.38], printed ? 1.6 : 1.55));
    }
    const neckY = this.hipY + torso * 0.98;

    // Outfit-Details
    if (o === 'kleid') {
      for (const s of [-1, 1]) this.body.add(part(sphereLow, a.accentColor, 0.05, 0.022, 0.035, s * 0.04, neckY, 0.075));
    }
    if (o === 'latzhose') {
      this.body.add(part(cylinder, a.outfitColor, 0.085 * bw, torso * 0.42, 0.012, 0, torsoY + 0.02, 0.1 * bw));
      for (const s of [-1, 1]) this.body.add(part(sphereLow, '#fff6d8', 0.014, 0.014, 0.014, s * 0.055, torsoY + 0.13, 0.11 * bw));
    }
    if (o === 'strickjacke') {
      this.body.add(part(cylinder, a.accentColor, 0.04, torso * 0.7, 0.012, 0, torsoY + 0.03, topR * 1.02 + 0.005));
      for (let i = 0; i < 3; i++) this.body.add(part(sphereLow, lighten(a.outfitColor, 0.6), 0.012, 0.012, 0.012, 0.035, torsoY + 0.1 - i * 0.06, topR * 1.05 + 0.01));
    }
    if (o === 'hemd' || o === 'weste' || o === 'streifenhemd') {
      // Kragen
      const collar = o === 'streifenhemd' ? a.outfitColor : lighten(top, 0.3);
      for (const s of [-1, 1]) {
        const col = part(box, collar, 0.062, 0.035, 0.014, s * 0.034, neckY - 0.008, topR * 0.93);
        col.rotation.z = s * (o === 'streifenhemd' ? 0.1 : 0.5);
        this.body.add(col);
      }
    }
    if (o === 'weste') {
      // Weste: vorne offen, mit Knöpfen
      const vest = mesh(new THREE.CylinderGeometry(topR * 1.02, topR * 1.2, torso * 0.74, 20, 1, true, 0.32, Math.PI * 2 - 0.64), toon(a.outfitColor, { side: THREE.DoubleSide }));
      vest.position.y = torsoY + torso * 0.1;
      this.body.add(vest);
      for (let i = 0; i < 3; i++) this.body.add(part(sphereLow, '#c9c3b8', 0.011, 0.011, 0.011, 0.032, torsoY + 0.08 - i * 0.055, topR * 1.12));
    }
    if (o === 'hoodie') {
      // Kapuze im Nacken, Kordeln, Reißverschluss
      const hood = part(sphereLow, darken(a.outfitColor, 0.08), topR * 1.15, 0.07, topR * 0.8, 0, neckY - 0.01, -topR * 0.55);
      this.body.add(hood);
      for (const s of [-1, 1]) this.body.add(part(cylinder, '#1e1e24', 0.006, 0.09, 0.006, s * 0.03, neckY - 0.06, topR * 1.02));
      this.body.add(part(box, '#1e1e24', 0.008, torso * 0.65, 0.006, 0, torsoY + 0.02, topR * 1.05));
    }
    if (summer) {
      // kurzes Shirt: runder Halsausschnitt, kleines eigenes Emblem
      const neck = mesh(new THREE.TorusGeometry(topR * 0.5, 0.01, 6, 18), toon(darken(a.outfitColor, 0.1)));
      neck.rotation.x = Math.PI / 2;
      neck.position.y = neckY - 0.01;
      this.body.add(neck);
      this.body.add(part(sphereLow, lighten(a.outfitColor, 0.75), 0.018, 0.018, 0.006, 0.04, torsoY + 0.08, topR * 1.1));
    }
    if (o === 'sweatshirt' || o === 'shorts' || printed) {
      // Rippbündchen unten & am Hals (Druck-Sweatshirts: großes Motiv statt kleinem Emblem)
      this.body.add(part(cylinder, darken(top, 0.12), ssx, 0.03, ssz, 0, sy - ssy / 2 + 0.012, 0));
      const neck = mesh(new THREE.TorusGeometry(topR * 0.58, 0.014, 6, 18), toon(darken(top, 0.12)));
      neck.rotation.x = Math.PI / 2;
      neck.position.y = neckY - 0.005;
      this.body.add(neck);
      if (!printed) {
        // kleines Emblem auf der Brust (eigenes Design, keine Marke)
        const emblem = lighten(a.outfitColor, 0.75);
        this.body.add(part(box, emblem, 0.07, 0.022, 0.006, 0.0, torsoY + 0.07, topR * 1.2));
        this.body.add(part(sphereLow, emblem, 0.016, 0.016, 0.006, 0.0, torsoY + 0.035, topR * 1.2));
      }
    }
    if (o === 'bandshirt') {
      const neck = mesh(new THREE.TorusGeometry(topR * 0.5, 0.01, 6, 18), toon(lighten(top, 0.12)));
      neck.rotation.x = Math.PI / 2;
      neck.position.y = neckY - 0.012;
      this.body.add(neck);
    }
    if (o === 'polo' || o === 'jacke') {
      // Polokragen bzw. Jackenkragen + Knopfleiste
      const collarColor = o === 'polo' ? darken(top, 0.06) : darken(top, 0.12);
      for (const s2 of [-1, 1]) {
        const col = part(box, collarColor, 0.07, 0.04, 0.016, s2 * 0.036, neckY - 0.01, topR * (o === 'jacke' ? 0.98 : 0.92));
        col.rotation.z = s2 * 0.45;
        this.body.add(col);
      }
      const n = o === 'polo' ? 2 : 4;
      for (let i = 0; i < n; i++) this.body.add(part(sphereLow, o === 'polo' ? lighten(top, 0.5) : '#2a2a2e', 0.009, 0.009, 0.008, 0, neckY - 0.04 - i * (o === 'polo' ? 0.03 : 0.055), topR * (o === 'jacke' ? 1.25 : 1.09)));
      if (o === 'jacke') {
        // Brusttaschen mit Klappe
        for (const s2 of [-1, 1]) {
          this.body.add(part(box, darken(top, 0.06), 0.05, 0.05, 0.008, s2 * 0.055, torsoY + 0.05, topR * 1.22));
          this.body.add(part(box, darken(top, 0.16), 0.054, 0.016, 0.01, s2 * 0.055, torsoY + 0.077, topR * 1.23));
        }
      }
    }
    if (o === 'fleece') {
      // Fleece-Jacke: Stehkragen, Reißverschluss, flauschige Flecken, Bündchen
      const fluffy = lighten(a.outfitColor, 0.05);
      const collar = mesh(new THREE.CylinderGeometry(topR * 0.68, topR * 0.8, 0.07, 18, 1, true), toon(fluffy, { side: THREE.DoubleSide }));
      collar.position.y = neckY + 0.02;
      this.body.add(collar);
      this.body.add(part(box, '#8d8a93', 0.008, torso * 0.9, 0.006, 0, torsoY + 0.0, topR * 1.29));
      this.body.add(part(cylinder, darken(a.outfitColor, 0.1), topR * 1.38, 0.035, topR * 1.28, 0, torsoY - torso * 0.47, 0));
      for (const [x, y] of [[-0.06, 0.04], [0.07, -0.03], [-0.04, -0.08], [0.05, 0.09]] as const) this.body.add(part(sphereLow, fluffy, 0.022, 0.018, 0.008, x, torsoY + y, topR * 1.27));
      for (const sx of [-1, 1]) this.body.add(part(box, darken(a.outfitColor, 0.15), 0.05, 0.004, 0.006, sx * 0.07, torsoY - 0.05, topR * 1.29));
    }
    if (o === 'troyer') {
      // Troyer: Stehkragen mit kurzem Reißverschluss
      const collar = mesh(new THREE.CylinderGeometry(topR * 0.62, topR * 0.72, 0.05, 18, 1, true), toon(darken(a.outfitColor, 0.05), { side: THREE.DoubleSide }));
      collar.position.y = neckY + 0.012;
      this.body.add(collar);
      this.body.add(part(box, '#8d8a93', 0.007, 0.09, 0.006, 0, neckY - 0.03, topR * 0.98));
      this.body.add(part(sphereLow, '#b9b6c0', 0.01, 0.014, 0.008, 0, neckY - 0.07, topR * 1.0));
    }
    if (o === 'mantel') {
      // Knöpfe
      for (let i = 0; i < 4; i++) this.body.add(part(sphereLow, darken(a.outfitColor, 0.35), 0.014, 0.014, 0.014, 0.028, torsoY + 0.09 - i * 0.07, topR * 1.08 - i * 0.003));
    }
    const scarfColor = a.scarf || (o === 'mantel' ? a.accentColor : '');
    if (scarfColor) {
      // Schal (Mantel) bzw. Halstuch mit Knoten
      const thick = o === 'mantel' ? 0.032 : 0.022;
      const scarf = mesh(new THREE.TorusGeometry(topR * 0.74, thick, 8, 18), toon(scarfColor));
      scarf.rotation.x = Math.PI / 2;
      scarf.position.y = neckY + 0.005;
      this.body.add(scarf);
      if (o === 'mantel') {
        const end = part(box, scarfColor, 0.045, 0.12, 0.02, -0.035, neckY - 0.07, topR * 1.02);
        end.rotation.z = 0.15;
        this.body.add(end);
      } else {
        this.body.add(part(sphereLow, scarfColor, 0.034, 0.028, 0.026, 0.014, neckY - 0.004, topR * 0.9));
        const tip = part(cone, scarfColor, 0.065, 0.075, 0.014, 0.014, neckY - 0.05, topR * 0.98);
        tip.rotation.z = Math.PI;
        this.body.add(tip);
      }
    }

    // Arme (Drehpunkt an der Schulter)
    const shoulderY = this.hipY + torso * 0.92;
    const sleeve = o === 'weste' ? a.accentColor : top;
    const sleeveMat: THREE.Material = o === 'streifenhemd' ? shirtMat : toon(sleeve);
    for (const side of [-1, 1]) {
      const arm = new THREE.Group();
      arm.position.set(side * (topR + 0.035), shoulderY, 0);
      arm.rotation.z = side * 0.25;
      const thick = street ? (printed ? 1.42 : o === 'fleece' ? 1.4 : 1.28) : o === 'jacke' ? 1.12 : 1;
      if (shortSleeves) {
        // kurze Ärmel, darunter nackter Arm
        arm.add(part(capsule, skin, 0.03 * Math.min(1.15, bw), 0.07 * Math.min(1.1, h), 0.03, 0, -0.105, 0));
        arm.add(part(sphere, sleeveMat, 0.045 * Math.min(1.15, bw), 0.05, 0.045, 0, -0.025, 0));
      } else arm.add(part(capsule, sleeveMat, 0.035 * Math.min(1.15, bw) * thick, (street ? 0.075 : 0.1) * Math.min(1.1, h), 0.035 * thick, 0, street ? -0.065 : -0.08, 0));
      if ((o === 'polo' || o === 'jacke') && side === 1) {
        // Abzeichen am linken Oberarm (eigenes Design: Knopf-Patch, keine echte Marke)
        const r = (shortSleeves ? 0.047 : 0.035 * thick) * Math.min(1.15, bw);
        const patch = part(box, '#d9d2b6', 0.028, 0.03, 0.006, r * 0.55, -0.045, r * 0.82);
        patch.rotation.y = 0.6;
        arm.add(patch);
        arm.add(part(box, '#3e4a3c', 0.02, 0.006, 0.007, r * 0.55, -0.034, r * 0.84));
        for (const dx of [-0.008, 0.008]) arm.add(part(sphereLow, '#2a2a2e', 0.003, 0.003, 0.003, r * 0.55 + dx * 0.8, -0.054, r * 0.86));
      }
      arm.add(part(sphere, skin, 0.038, 0.038, 0.038, 0, -0.17 * Math.min(1.1, h), 0));
      this.handY = -0.17 * Math.min(1.1, h);
      this.body.add(arm);
      this.arms.push(arm);
    }

    // Kopf (kräftige Figuren haben etwas rundere Gesichter)
    const headY = this.hipY + torso + R * 0.82;
    this.head = new THREE.Group();
    this.head.position.y = headY;
    this.body.add(this.head);
    const wide = 1 + (bw - 1) * 0.35;
    const oval = a.faceShape === 'oval';
    this.head.add(part(oval ? sphereOval : sphere, skin, R * wide, R * 0.93, R * 0.95));
    if (oval) {
      // schmales Kinn: Kopf etwas tiefer setzen und ein kleiner Hals, damit keine Lücke entsteht
      this.head.position.y -= R * 0.08;
      this.head.add(part(cylinder, skin, R * 0.2, R * 0.3, R * 0.18, 0, -R * 0.72, -R * 0.05));
    }
    for (const s of [-1, 1]) this.head.add(part(sphere, skin, R * 0.17, R * 0.21, R * 0.12, s * R * 0.97 * wide, -R * 0.05, 0));

    this.faceOpen = faceTexture(a, false);
    this.faceBlink = faceTexture(a, true);
    const faceGeo = new THREE.SphereGeometry(R * 1.005, 28, 18, FRONT - FACE_PHI / 2, FACE_PHI, FACE_THETA_START, FACE_THETA);
    if (oval) taperChin(faceGeo, R * 1.005);
    this.face = new THREE.Mesh(faceGeo, faceMaterial(this.faceOpen));
    this.face.scale.set(wide, 0.93, 0.95);
    this.head.add(this.face);

    // Bart
    if (a.beard === 'schnurrbart') {
      const bc = a.beardColor || lighten(a.hairColor, 0.05);
      for (const s of [-1, 1]) {
        // zwischen Nase und Mund (der Mund liegt bei etwa -0.15 R)
        const m = part(sphereLow, bc, R * 0.16, R * 0.055, R * 0.06, s * R * 0.13, -R * 0.085, R * 0.92);
        m.rotation.z = s * -0.18;
        this.head.add(m);
      }
    } else if (a.beard !== 'keiner') {
      const bc = a.beardColor || lighten(a.hairColor, 0.05);
      const full = a.beard === 'voll';
      const beard = shell(R * 1.03, bc, FRONT - 1.1, 2.2, full ? 1.9 : 2.05, full ? 0.85 : 0.65);
      if (oval) taperChin(beard.geometry, R * 1.03);
      beard.scale.set(wide, 0.93, 0.95);
      this.head.add(beard);
      // Koteletten
      for (const s of [-1, 1]) {
        const sb = shell(R * 1.025, bc, FRONT + s * 1.05 - 0.18, 0.36, 1.35, 0.7);
        if (oval) taperChin(sb.geometry, R * 1.025);
        sb.scale.set(wide, 0.93, 0.95);
        this.head.add(sb);
      }
      // Schnurrbart
      for (const s of [-1, 1]) this.head.add(part(sphereLow, bc, R * 0.14, R * 0.065, R * 0.06, s * R * 0.12, -R * 0.32, R * 0.9));
    }

    addHair(this.head, a, R);

    // Creolen
    if (a.earrings) {
      const gold = toon('#e3c15c');
      for (const s of [-1, 1]) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(R * 0.085, R * 0.02, 6, 14), gold);
        ring.position.set(s * R * 1.0 * wide, -R * 0.3, R * 0.05);
        ring.rotation.y = Math.PI / 2;
        this.head.add(ring);
      }
    }

    // Brille
    if (a.glasses) {
      const frame = toon(a.glassesShape === 'eckig' ? '#4a3c44' : '#7a5e6a');
      for (const s of [-1, 1]) {
        let ring: THREE.Mesh;
        if (a.glassesShape === 'eckig') {
          const shape = new THREE.Shape();
          shape.moveTo(-R * 0.22, -R * 0.13);
          shape.lineTo(R * 0.22, -R * 0.13);
          shape.lineTo(R * 0.22, R * 0.13);
          shape.lineTo(-R * 0.22, R * 0.13);
          shape.closePath();
          const hole = new THREE.Path();
          hole.moveTo(-R * 0.19, -R * 0.1);
          hole.lineTo(-R * 0.19, R * 0.1);
          hole.lineTo(R * 0.19, R * 0.1);
          hole.lineTo(R * 0.19, -R * 0.1);
          hole.closePath();
          shape.holes.push(hole);
          ring = new THREE.Mesh(new THREE.ShapeGeometry(shape), frame);
        } else {
          ring = new THREE.Mesh(new THREE.TorusGeometry(R * 0.2, R * 0.025, 6, 18), frame);
        }
        ring.position.set(s * R * 0.3 * wide, -R * 0.06, R * 0.95);
        ring.rotation.y = s * 0.25;
        this.head.add(ring);
      }
      const bridge = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.02, R * 0.02, R * 0.2, 5), frame);
      bridge.rotation.z = Math.PI / 2;
      bridge.position.set(0, -R * 0.03, R * 0.99);
      this.head.add(bridge);
    }

    this.root.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh && obj !== this.face) {
        obj.castShadow = true;
        obj.receiveShadow = false;
      }
    });
  }

  /** Pose anwenden (Laufen, Sitzen, Atmen, Blinzeln) */
  pose(p: ChibiPose) {
    const fm = this.face.material as THREE.MeshToonMaterial;
    const want = p.blink ? this.faceBlink : this.faceOpen;
    if (fm.map !== want) fm.map = want;

    if (p.sitting) {
      this.body.rotation.x = 0;
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
    this.head.rotation.y = 0;
    if (p.moving) {
      const swing = Math.sin(p.step * Math.PI) * (p.running ? 0.75 : 0.55);
      this.legs[0].rotation.x = swing;
      this.legs[1].rotation.x = -swing;
      this.arms[0].rotation.x = -swing * 0.9;
      this.arms[1].rotation.x = swing * 0.9;
      this.body.position.y = Math.abs(Math.sin(p.step * Math.PI)) * (p.running ? 0.05 : 0.03);
      this.body.scale.y = 1;
      this.head.rotation.x = 0.04;
    } else {
      for (const leg of this.legs) leg.rotation.x = 0;
      for (const arm of this.arms) arm.rotation.x = 0;
      this.body.position.y = 0;
      this.body.scale.y = 1 + Math.sin(p.t * 2.4) * 0.012;
      this.head.rotation.x = Math.sin(p.t * 0.9) * 0.02;
      // nach einer Weile Stillstehen: sich gemütlich umschauen
      const idle = p.idle ?? 0;
      if (idle > 4) {
        const look = Math.min(1, (idle - 4) / 1.5);
        this.head.rotation.y = Math.sin(p.t * 0.45) * Math.max(0, Math.sin(p.t * 0.17)) * 0.45 * look;
      }
    }
    this.arms[0].rotation.z = -0.25;
    this.arms[1].rotation.z = 0.25;
    if (p.armForward !== undefined) {
      this.arms[0].rotation.x = p.armForward;
      this.arms[0].rotation.z = -0.12;
    }
    if (p.cheer !== undefined && !p.moving) {
      // Sprung: kurz in die Knie, hoch, landen – Arme nach oben
      const k = p.cheer;
      const hop = Math.sin(Math.min(1, k / 0.8) * Math.PI);
      this.body.position.y = hop * 0.24;
      this.body.scale.y = k < 0.12 ? 1 - k * 0.6 : 1 + hop * 0.05;
      const up = Math.sin(Math.min(1, k * 1.25) * Math.PI);
      for (const [i, arm] of this.arms.entries()) {
        // nach vorn-oben (vor den Haaren sichtbar), leicht gespreizt
        arm.rotation.x = -up * 2.5;
        arm.rotation.z = (i === 0 ? -1 : 1) * (0.25 + up * 0.5);
      }
      for (const leg of this.legs) leg.rotation.x = 0;
      this.head.rotation.x = -hop * 0.12;
    }
    this.body.rotation.x = 0;
    if (p.kiss !== undefined && !p.moving && !p.sitting) {
      // weich vorbeugen, kurz halten, zurück – Kopf leicht schräg, Hände hinter den Rücken
      const k = p.kiss;
      const lean = k < 0.25 ? Math.sin((k / 0.25) * Math.PI / 2) : k > 0.75 ? Math.sin(((1 - k) / 0.25) * Math.PI / 2) : 1;
      this.body.rotation.x = lean * 0.2;
      this.head.rotation.z = lean * 0.18;
      this.head.rotation.x = lean * 0.08;
      if (p.tiptoe) this.body.position.y = lean * 0.035;
      for (const [i, arm] of this.arms.entries()) {
        arm.rotation.x = lean * 0.5;
        arm.rotation.z = (i === 0 ? -1 : 1) * 0.15;
      }
    }
    if (p.wave !== undefined && p.armForward === undefined) {
      // rechte Hand hoch und hin und her
      const k = p.wave;
      const up = Math.min(1, k * 5, (1 - k) * 5);
      this.arms[0].rotation.x = 0;
      this.arms[0].rotation.z = -(0.25 + up * 2.3) + Math.sin(k * Math.PI * 7) * 0.3 * up;
    }
  }

  dispose() {
    this.disposeTextures();
  }
}
