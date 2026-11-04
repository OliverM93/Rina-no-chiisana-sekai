/**
 * Winston, der Dackel – aus Grundformen, im Chibi-Stil (großer Kopf, kurze Beinchen).
 * Ursprung = zwischen den Pfoten auf dem Boden, Blick nach +Z. Maße in Kacheln.
 */
import * as THREE from 'three';
import { WINSTON_LOOK } from '../../data/winston';
import { darken, lighten } from '../../style/palette';
import { mesh, toon } from '../materials';

const sphere = new THREE.SphereGeometry(1, 18, 12);
const capsule = new THREE.CapsuleGeometry(1, 1, 6, 14);
const cyl = new THREE.CylinderGeometry(1, 1, 1, 12);
/** Gesamtgröße (Lina ist etwa 1 Kachel groß) */
const SCALE = 0.85;
const torus = new THREE.TorusGeometry(1, 0.22, 8, 20);

function part(geo: THREE.BufferGeometry, color: string, sx: number, sy: number, sz: number, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = mesh(geo, toon(color));
  m.scale.set(sx, sy, sz);
  m.position.set(x, y, z);
  return m;
}

export interface DogPose {
  /** Laufphase (Schritte) */
  step: number;
  moving: boolean;
  /** 0 = steht, 1 = sitzt, 2 = liegt */
  rest: 0 | 1 | 2;
  /** Schwanzwedeln 0..1 (1 = ganz doll) */
  wag: number;
  /** Buddeln (Vorderpfoten wild) */
  digging: boolean;
  /** Kopf schief legen (-1..1) */
  tilt: number;
  /** Augen zu (Schlafen) */
  eyesClosed: boolean;
  t: number;
}

export class Dog3D {
  readonly root = new THREE.Group();
  private body = new THREE.Group();
  private head = new THREE.Group();
  private tail = new THREE.Group();
  private legs: THREE.Group[] = [];
  private ears: THREE.Mesh[] = [];
  private eyes: THREE.Mesh[] = [];
  private lids: THREE.Mesh[] = [];

  constructor() {
    const { fur, belly, ears: earColor, collar, tag } = WINSTON_LOOK;
    const nose = '#2b2a31';
    const LEG_Y = 0.1;

    // Körper: lang und tief (ein Dackel eben)
    this.body.position.y = LEG_Y + 0.07;
    this.root.add(this.body);
    const torso = part(capsule, fur, 0.1, 0.27, 0.1, 0, 0, 0);
    torso.rotation.x = Math.PI / 2;
    this.body.add(torso);
    const chest = part(sphere, belly, 0.075, 0.07, 0.08, 0, -0.04, 0.15);
    this.body.add(chest);

    // Beinchen (Drehpunkt oben)
    for (const [x, z] of [[-0.06, 0.15], [0.06, 0.15], [-0.06, -0.15], [0.06, -0.15]] as const) {
      const leg = new THREE.Group();
      leg.position.set(x, -0.03, z);
      leg.add(part(cyl, fur, 0.032, 0.11, 0.032, 0, -0.055, 0));
      leg.add(part(sphere, darken(fur, 0.1), 0.036, 0.022, 0.044, 0, -0.112, 0.012));
      this.body.add(leg);
      this.legs.push(leg);
    }

    // Kopf
    this.head.position.set(0, 0.11, 0.26);
    this.body.add(this.head);
    this.head.add(part(sphere, fur, 0.115, 0.105, 0.11));
    // Schnauze
    this.head.add(part(sphere, lighten(fur, 0.06), 0.06, 0.05, 0.09, 0, -0.035, 0.1));
    this.head.add(part(sphere, nose, 0.025, 0.02, 0.02, 0, -0.022, 0.185));
    // Augen mit Glanzpunkt (+ Lider zum Schlafen)
    for (const s of [-1, 1]) {
      const eye = part(sphere, '#2b2a31', 0.02, 0.024, 0.014, s * 0.05, 0.022, 0.095);
      eye.add(part(sphere, '#ffffff', 0.35, 0.3, 0.4, 0.3, 0.35, 0.7));
      this.head.add(eye);
      this.eyes.push(eye);
      const lid = part(sphere, fur, 0.023, 0.012, 0.016, s * 0.05, 0.02, 0.097);
      lid.visible = false;
      this.head.add(lid);
      this.lids.push(lid);
    }
    // Bäckchen
    for (const s of [-1, 1]) this.head.add(part(sphere, '#f4a3b8', 0.018, 0.01, 0.008, s * 0.075, -0.015, 0.085));
    // Schlappohren (Drehpunkt oben am Kopf)
    for (const s of [-1, 1]) {
      const ear = part(sphere, earColor, 0.035, 0.085, 0.06, s * 0.105, -0.03, -0.005);
      ear.rotation.z = s * 0.18;
      this.head.add(ear);
      this.ears.push(ear);
    }

    // Halsband mit Marke
    const band = mesh(torus, toon(collar));
    band.scale.setScalar(0.078);
    band.position.set(0, 0.05, 0.2);
    band.rotation.x = Math.PI / 2 - 0.5;
    this.body.add(band);
    this.body.add(part(sphere, tag, 0.018, 0.018, 0.008, 0, -0.01, 0.255));

    // Schwanz (Drehpunkt an der Wurzel)
    this.tail.position.set(0, 0.04, -0.3);
    this.tail.rotation.x = -1.25;
    this.tail.add(part(capsule, fur, 0.024, 0.09, 0.024, 0, 0.07, 0));
    this.tail.add(part(sphere, darken(fur, 0.08), 0.022, 0.03, 0.022, 0, 0.15, 0));
    this.body.add(this.tail);

    this.root.scale.setScalar(SCALE);
    this.root.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = true;
    });
  }

  pose(p: DogPose) {
    const swing = p.moving ? Math.sin(p.step * Math.PI * 2) : 0;
    const bob = p.moving ? Math.abs(Math.sin(p.step * Math.PI * 2)) * 0.012 : 0;

    // Grundhaltung
    let pitch = 0;
    let y = 0.17;
    if (p.rest === 1) {
      pitch = -0.42; // Po runter, Brust hoch
      y = 0.15;
    } else if (p.rest === 2) {
      y = 0.1;
    }
    this.body.rotation.x = pitch;
    this.body.position.y = y + bob;
    this.body.position.z = p.rest === 1 ? -0.04 : 0;

    // Beine
    const [fl, fr, bl, br] = this.legs;
    if (p.digging) {
      const d = Math.sin(p.t * 26);
      fl.rotation.x = -0.6 + d * 0.7;
      fr.rotation.x = -0.6 - d * 0.7;
      bl.rotation.x = br.rotation.x = 0.1;
      this.body.rotation.x = 0.28;
      this.body.position.y = 0.15;
    } else if (p.rest === 1) {
      fl.rotation.x = fr.rotation.x = 0.42;
      bl.rotation.x = br.rotation.x = -1.1;
    } else if (p.rest === 2) {
      fl.rotation.x = fr.rotation.x = -1.35;
      bl.rotation.x = br.rotation.x = 1.35;
    } else {
      fl.rotation.x = swing * 0.7;
      br.rotation.x = swing * 0.7;
      fr.rotation.x = -swing * 0.7;
      bl.rotation.x = -swing * 0.7;
    }

    // Kopf: beim Liegen auf die Pfoten, beim Buddeln runter, sonst leicht wippend
    const lookDown = p.digging ? 0.55 : p.rest === 2 ? 0.25 : 0;
    this.head.rotation.x = lookDown + (p.rest === 1 ? 0.42 : 0) + Math.sin(p.t * 1.3) * 0.03;
    this.head.rotation.z = p.tilt * 0.35;
    this.head.position.y = p.rest === 2 ? 0.06 : 0.11;

    // Ohren flattern beim Laufen
    const flap = p.moving ? Math.sin(p.step * Math.PI * 2 + 1) * 0.25 : 0;
    this.ears.forEach((e, i) => (e.rotation.x = flap * (i ? 1 : -1) * 0.6 + (p.moving ? -0.2 : 0)));

    // Schwanz wedelt
    const wagSpeed = 6 + p.wag * 12;
    this.tail.rotation.z = Math.sin(p.t * wagSpeed) * (0.15 + p.wag * 0.6);
    this.tail.rotation.x = p.rest === 2 ? -1.5 : -1.25 + p.wag * 0.25;

    // Augen
    for (const e of this.eyes) e.visible = !p.eyesClosed;
    for (const l of this.lids) l.visible = p.eyesClosed;
  }

  /** Höhe des Kopfes über dem Boden (für Herzchen/Zzz) */
  get headHeight() {
    return 0.42 * SCALE;
  }

  dispose() {
    this.root.removeFromParent();
  }
}
