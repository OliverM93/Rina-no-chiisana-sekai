/**
 * Kater, der schwarze Kater – aus Grundformen, im Chibi-Stil (runder Kopf, kurze Beinchen, langer Schwanz).
 * Ursprung = zwischen den Pfoten auf dem Boden, Blick nach +Z. Maße in Kacheln.
 */
import * as THREE from 'three';
import { KATER_LOOK } from '../../data/kater';
import { darken, lighten } from '../../style/palette';
import { mesh, toon } from '../materials';

const sphere = new THREE.SphereGeometry(1, 16, 12);
const capsule = new THREE.CapsuleGeometry(1, 1, 6, 14);
const cyl = new THREE.CylinderGeometry(1, 1, 1, 10);
const cone = new THREE.ConeGeometry(1, 1, 4);
const SCALE = 0.85;

function part(geo: THREE.BufferGeometry, color: string, sx: number, sy: number, sz: number, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = mesh(geo, toon(color));
  m.scale.set(sx, sy, sz);
  m.position.set(x, y, z);
  return m;
}

export interface CatPose {
  step: number;
  moving: boolean;
  /** 0 = steht, 1 = sitzt, 2 = liegt (zusammengerollt, Brotlaib) */
  rest: 0 | 1 | 2;
  /** Schwanz: 0 = hängt locker, 1 = steil hoch (neugierig/freut sich) */
  tailUp: number;
  eyesClosed: boolean;
  t: number;
}

export class Cat3D {
  readonly root = new THREE.Group();
  private body = new THREE.Group();
  private head = new THREE.Group();
  private tail = new THREE.Group();
  private legs: THREE.Group[] = [];
  private eyes: THREE.Mesh[] = [];
  private lids: THREE.Mesh[] = [];

  constructor() {
    const { fur, belly, ears, eyes, nose } = KATER_LOOK;
    const LEG_Y = 0.1;

    this.body.position.y = LEG_Y + 0.05;
    this.root.add(this.body);
    const torso = part(capsule, fur, 0.075, 0.17, 0.075);
    torso.rotation.x = Math.PI / 2;
    this.body.add(torso);
    this.body.add(part(sphere, belly, 0.06, 0.05, 0.07, 0, -0.03, 0.08));

    for (const [x, z] of [[-0.04, 0.12], [0.04, 0.12], [-0.04, -0.12], [0.04, -0.12]] as const) {
      const leg = new THREE.Group();
      leg.position.set(x, -0.02, z);
      leg.add(part(cyl, fur, 0.022, 0.095, 0.022, 0, -0.05, 0));
      leg.add(part(sphere, belly, 0.027, 0.018, 0.034, 0, -0.1, 0.01));
      this.body.add(leg);
      this.legs.push(leg);
    }

    // Kopf: rund, vor dem Rumpf
    this.head.position.set(0, 0.08, 0.26);
    this.body.add(this.head);
    this.head.add(part(sphere, fur, 0.09, 0.08, 0.08));
    // Ohren (Dreiecke mit rosa Innenseite)
    for (const s of [-1, 1]) {
      const ear = part(cone, fur, 0.032, 0.06, 0.02, s * 0.055, 0.072, -0.005);
      ear.rotation.z = -s * 0.28;
      this.head.add(ear);
      const inner = part(cone, ears, 0.018, 0.038, 0.012, s * 0.055, 0.068, 0.012);
      inner.rotation.z = -s * 0.28;
      this.head.add(inner);
    }
    // Schnauze, Nase
    this.head.add(part(sphere, lighten(fur, 0.05), 0.04, 0.03, 0.04, 0, -0.025, 0.065));
    this.head.add(part(sphere, nose, 0.012, 0.009, 0.01, 0, -0.012, 0.1));
    // Augen: gelb mit schmaler Pupille (+ Lider)
    for (const s of [-1, 1]) {
      const eye = part(sphere, eyes, 0.02, 0.026, 0.012, s * 0.04, 0.018, 0.072);
      eye.add(part(sphere, '#1c1b20', 0.28, 0.85, 0.5, 0, 0, 0.55));
      this.head.add(eye);
      this.eyes.push(eye);
      const lid = part(sphere, fur, 0.024, 0.011, 0.014, s * 0.04, 0.016, 0.075);
      lid.visible = false;
      this.head.add(lid);
      this.lids.push(lid);
    }
    // Schnurrhaare: je zwei kleine helle Striche
    for (const s of [-1, 1]) for (const k of [-1, 1]) {
      const w = part(cyl, '#e8e4ec', 0.003, 0.04, 0.003, s * 0.07, -0.02 + k * 0.008, 0.07);
      w.rotation.z = Math.PI / 2 - s * k * 0.15;
      this.head.add(w);
    }

    // Schwanz (Drehpunkt an der Wurzel): zwei Segmente, die Spitze biegt sich
    this.tail.position.set(0, 0.03, -0.22);
    this.tail.add(part(capsule, fur, 0.02, 0.06, 0.02, 0, 0.07, 0));
    const tip = new THREE.Group();
    tip.position.set(0, 0.14, 0);
    tip.add(part(capsule, darken(fur, 0.05), 0.019, 0.05, 0.019, 0, 0.05, 0));
    this.tail.add(tip);
    this.body.add(this.tail);

    this.root.scale.setScalar(SCALE);
    this.root.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = true;
    });
  }

  pose(p: CatPose) {
    const swing = p.moving ? Math.sin(p.step * Math.PI * 2) : 0;
    const bob = p.moving ? Math.abs(Math.sin(p.step * Math.PI * 2)) * 0.008 : 0;

    let y = 0.15;
    let pitch = 0;
    if (p.rest === 1) {
      pitch = -0.5;
      y = 0.13;
    } else if (p.rest === 2) {
      y = 0.07;
    }
    this.body.rotation.x = pitch;
    this.body.position.y = y + bob;
    this.body.position.z = p.rest === 1 ? -0.05 : 0;

    const [fl, fr, bl, br] = this.legs;
    if (p.rest === 1) {
      fl.rotation.x = fr.rotation.x = 0.5;
      bl.rotation.x = br.rotation.x = -1.2;
    } else if (p.rest === 2) {
      fl.rotation.x = fr.rotation.x = -1.4;
      bl.rotation.x = br.rotation.x = 1.4;
    } else {
      fl.rotation.x = br.rotation.x = swing * 0.8;
      fr.rotation.x = bl.rotation.x = -swing * 0.8;
    }

    this.head.rotation.x = (p.rest === 1 ? 0.5 : 0) + Math.sin(p.t * 1.1) * 0.025;
    this.head.position.y = p.rest === 2 ? 0.04 : 0.08;
    this.head.position.z = p.rest === 2 ? 0.2 : 0.26;

    // Schwanz: hoch beim Laufen/Neugier, sonst locker und mit leichtem Schwingen
    const up = p.moving ? Math.max(p.tailUp, 0.7) : p.tailUp;
    this.tail.rotation.x = p.rest === 2 ? -1.55 : -1.1 + up * 1.0;
    this.tail.rotation.z = Math.sin(p.t * (2 + up * 3)) * (0.12 + up * 0.25);
    const tip = this.tail.children[1];
    if (tip) tip.rotation.x = 0.35 - up * 0.45 + Math.sin(p.t * 3) * 0.1;

    for (const e of this.eyes) e.visible = !p.eyesClosed;
    for (const l of this.lids) l.visible = p.eyesClosed;
  }

  get headHeight() {
    return 0.36 * SCALE;
  }

  dispose() {
    this.root.removeFromParent();
  }
}
