/**
 * Kleine 3D-Modelle für Werkzeuge, Insekten, Pflanzen im Beet und die
 * Angel-Pose. Alles aus Grundformen, Ursprung = Bodenmitte.
 */
import * as THREE from 'three';
import type { InsectDef } from '../../data/species';
import { darken, lighten } from '../../style/palette';
import { mesh, toon } from '../materials';

const sphere = new THREE.SphereGeometry(1, 12, 9);
const cyl = new THREE.CylinderGeometry(1, 1, 1, 8);
const cone = new THREE.ConeGeometry(1, 1, 8);

function p(geo: THREE.BufferGeometry, color: string | THREE.Material, sx: number, sy: number, sz: number, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = mesh(geo, typeof color === 'string' ? toon(color) : color, true, false);
  m.scale.set(sx, sy, sz);
  m.position.set(x, y, z);
  return m;
}

// ---------------------------------------------------------------------------
// Werkzeuge (in der Hand: Griff am Ursprung, zeigt entlang +Z)
// ---------------------------------------------------------------------------

export interface ToolModel {
  group: THREE.Group;
  /** Spitze der Angel (für die Schnur), lokal */
  tip?: THREE.Vector3;
}

export function makeRod(): ToolModel {
  const g = new THREE.Group();
  const rod = p(cyl, '#a97c56', 0.012, 0.95, 0.012, 0, 0, 0.47);
  rod.rotation.x = Math.PI / 2;
  g.add(rod);
  g.add(p(cyl, '#5a4a52', 0.02, 0.14, 0.02, 0, 0, 0.04).rotateX(Math.PI / 2));
  g.add(p(cyl, '#d9dbe6', 0.035, 0.03, 0.035, 0.035, 0, 0.12).rotateZ(Math.PI / 2));
  return { group: g, tip: new THREE.Vector3(0, 0, 0.95) };
}

export function makeNet(): ToolModel {
  const g = new THREE.Group();
  const stick = p(cyl, '#cfa175', 0.012, 0.55, 0.012, 0, 0, 0.27);
  stick.rotation.x = Math.PI / 2;
  g.add(stick);
  const rim = mesh(new THREE.TorusGeometry(0.13, 0.01, 6, 20), toon('#7a8a9a'));
  rim.position.set(0, 0, 0.66);
  rim.rotation.y = Math.PI / 2;
  g.add(rim);
  const bag = mesh(new THREE.ConeGeometry(0.13, 0.22, 14, 1, true), new THREE.MeshToonMaterial({ color: '#ffffff', transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
  bag.rotation.z = Math.PI / 2;
  bag.position.set(-0.1, 0, 0.66);
  g.add(bag);
  return { group: g };
}

export function makeCan(): ToolModel {
  const g = new THREE.Group();
  const pink = '#f7a8be';
  const body = p(cyl, pink, 0.08, 0.13, 0.08, 0, -0.04, 0.1);
  g.add(body);
  const spout = p(cyl, darken(pink, 0.1), 0.012, 0.16, 0.012, 0, 0.0, 0.22);
  spout.rotation.x = 1.0;
  g.add(spout);
  g.add(p(sphere, darken(pink, 0.1), 0.025, 0.012, 0.025, 0, 0.055, 0.29));
  const handle = mesh(new THREE.TorusGeometry(0.05, 0.01, 6, 12, Math.PI), toon(darken(pink, 0.2)));
  handle.position.set(0, 0.03, 0.06);
  handle.rotation.y = Math.PI / 2;
  g.add(handle);
  return { group: g };
}

export function makeBobber(): THREE.Group {
  const g = new THREE.Group();
  g.add(p(sphere, '#ffffff', 0.05, 0.05, 0.05, 0, 0, 0));
  g.add(p(new THREE.SphereGeometry(1, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), '#e8484f', 0.052, 0.052, 0.052, 0, 0.002, 0));
  g.add(p(cyl, '#2b2a31', 0.006, 0.05, 0.006, 0, 0.07, 0));
  return g;
}

// ---------------------------------------------------------------------------
// Insekten
// ---------------------------------------------------------------------------

export interface CritterModel {
  group: THREE.Group;
  /** Flügel (flattern) */
  wings: THREE.Object3D[];
  /** fliegt (schwebt in der Luft) */
  flying: boolean;
  glow?: THREE.Mesh;
}

function wingPair(color: string, accent: string, w: number, h: number, flat = false): THREE.Object3D[] {
  const out: THREE.Object3D[] = [];
  for (const s of [-1, 1]) {
    const pivot = new THREE.Group();
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(w * 0.4, h * 0.9, w * 1.1, h * 0.7, w, 0);
    shape.bezierCurveTo(w * 1.05, -h * 0.6, w * 0.4, -h * 0.8, 0, 0);
    const wing = mesh(new THREE.ShapeGeometry(shape), new THREE.MeshToonMaterial({ color, side: THREE.DoubleSide }), true, false);
    wing.rotation.x = -Math.PI / 2;
    wing.scale.x = s;
    pivot.add(wing);
    // Flügelzeichnung
    const dot = mesh(new THREE.CircleGeometry(h * 0.22, 10), new THREE.MeshToonMaterial({ color: accent, side: THREE.DoubleSide }), false, false);
    dot.rotation.x = -Math.PI / 2;
    dot.position.set(s * w * 0.62, 0.002, -h * 0.1);
    pivot.add(dot);
    if (flat) pivot.rotation.z = s * 0.2;
    out.push(pivot);
  }
  return out;
}

export function makeCritter(def: InsectDef): CritterModel {
  const g = new THREE.Group();
  const c = def.color;
  const a = def.accent;
  let wings: THREE.Object3D[] = [];
  let flying = false;
  let glow: THREE.Mesh | undefined;
  switch (def.shape) {
    case 'falter':
    case 'nachtfalter': {
      flying = true;
      g.add(p(sphere, darken(c, 0.5), 0.012, 0.012, 0.05));
      const s = def.shape === 'nachtfalter' ? 0.07 : 0.085;
      wings = wingPair(c, a, s, s * 0.9);
      for (const w of wings) g.add(w);
      break;
    }
    case 'biene': {
      flying = true;
      const body = p(sphere, c, 0.035, 0.03, 0.045);
      g.add(body);
      for (const z of [-0.012, 0.014]) g.add(p(cyl, a, 0.036, 0.008, 0.036, 0, 0, z).rotateX(Math.PI / 2));
      wings = wingPair('#eef4ff', '#d8e4f4', 0.04, 0.03);
      for (const w of wings) {
        w.position.y = 0.025;
        g.add(w);
      }
      break;
    }
    case 'libelle': {
      flying = true;
      const tail = p(cyl, c, 0.008, 0.13, 0.008, 0, 0, -0.05);
      tail.rotation.x = Math.PI / 2;
      g.add(tail, p(sphere, darken(c, 0.2), 0.02, 0.018, 0.022, 0, 0, 0.03));
      for (const z of [0.02, -0.005]) {
        const pair = wingPair('#eaf6ff', '#cfe6f7', 0.09, 0.022);
        for (const w of pair) {
          w.position.z = z;
          g.add(w);
        }
        wings.push(...pair);
      }
      break;
    }
    case 'gluehwurm': {
      flying = true;
      g.add(p(sphere, a, 0.015, 0.012, 0.022));
      glow = mesh(sphere, new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.9 }), false, false);
      glow.scale.setScalar(0.022);
      glow.position.z = -0.018;
      g.add(glow);
      break;
    }
    case 'kaefer': {
      g.add(p(new THREE.SphereGeometry(1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), c, 0.04, 0.035, 0.05, 0, 0.01, 0));
      g.add(p(sphere, darken(c, 0.6), 0.022, 0.018, 0.02, 0, 0.012, 0.045));
      if (def.id === 'marienkaefer') for (const [x, z] of [[-0.018, 0.01], [0.018, 0.01], [-0.015, -0.02], [0.015, -0.02]]) g.add(p(sphere, a, 0.009, 0.006, 0.009, x, 0.042, z));
      if (def.id === 'hirschkaefer') for (const s of [-1, 1]) g.add(p(cone, a, 0.008, 0.05, 0.008, s * 0.012, 0.02, 0.07).rotateX(Math.PI / 2.4));
      for (const s of [-1, 1]) for (const z of [-0.02, 0, 0.02]) g.add(p(cyl, '#2b2a31', 0.003, 0.03, 0.003, s * 0.04, 0.008, z).rotateZ(s * 1.2));
      break;
    }
    case 'ameise': {
      for (const [z, r] of [[-0.025, 0.018], [0, 0.011], [0.02, 0.013]] as const) g.add(p(sphere, c, r, r * 0.9, r * 1.2, 0, 0.015, z));
      break;
    }
    case 'heuschrecke': {
      const body = p(sphere, c, 0.02, 0.022, 0.06, 0, 0.025, 0);
      g.add(body, p(sphere, a, 0.018, 0.02, 0.02, 0, 0.032, 0.05));
      for (const s of [-1, 1]) {
        const leg = p(cyl, a, 0.005, 0.07, 0.005, s * 0.022, 0.035, -0.02);
        leg.rotation.x = 1.1;
        g.add(leg);
      }
      break;
    }
    case 'wasserlaeufer': {
      g.add(p(sphere, c, 0.01, 0.008, 0.035, 0, 0.01, 0));
      for (const s of [-1, 1]) for (const z of [-0.02, 0.0, 0.02]) g.add(p(cyl, a, 0.002, 0.07, 0.002, s * 0.03, 0.01, z).rotateZ(s * 1.35));
      break;
    }
    case 'schnecke': {
      g.add(p(sphere, '#c8b49a', 0.02, 0.012, 0.05, 0, 0.01, 0.01));
      const shell = mesh(new THREE.TorusGeometry(0.025, 0.017, 8, 14), toon(c), true, false);
      shell.position.set(0, 0.04, -0.01);
      shell.rotation.y = Math.PI / 2;
      g.add(shell, p(sphere, darken(c, 0.2), 0.014, 0.014, 0.014, 0, 0.04, -0.01));
      for (const s of [-1, 1]) g.add(p(cyl, '#a8957a', 0.003, 0.025, 0.003, s * 0.008, 0.03, 0.055).rotateX(-0.4));
      break;
    }
    case 'krabbe': {
      g.add(p(sphere, c, 0.05, 0.02, 0.038, 0, 0.022, 0));
      for (const s of [-1, 1]) {
        g.add(p(sphere, darken(c, 0.1), 0.018, 0.012, 0.014, s * 0.06, 0.03, 0.03));
        for (const z of [-0.02, 0, 0.02]) g.add(p(cyl, darken(c, 0.2), 0.004, 0.04, 0.004, s * 0.05, 0.012, z).rotateZ(s * 1.1));
        g.add(p(sphere, '#2b2a31', 0.006, 0.006, 0.006, s * 0.015, 0.045, 0.03));
      }
      break;
    }
  }
  return { group: g, wings, flying, glow };
}

// ---------------------------------------------------------------------------
// Pflanzen im Beet
// ---------------------------------------------------------------------------

export function makePlant(stage: number, color: string, center: string, flower: string): THREE.Group {
  const g = new THREE.Group();
  const leaf = '#6fbf5f';
  if (stage === 0) {
    // frisch gesät: kleiner Erdhügel mit Schildchen
    g.add(p(sphere, '#7a5038', 0.12, 0.05, 0.12, 0, 0.02, 0));
    g.add(p(cyl, '#cfa175', 0.008, 0.16, 0.008, 0.1, 0.08, -0.05));
    const tag = p(new THREE.BoxGeometry(1, 1, 1), color, 0.07, 0.05, 0.008, 0.1, 0.17, -0.05);
    g.add(tag);
    return g;
  }
  const h = stage === 1 ? 0.08 : flower === 'sonnenblume' ? 0.5 : 0.3;
  g.add(p(cyl, darken(leaf, 0.1), 0.012, h, 0.012, 0, h / 2, 0));
  for (const s of [-1, 1]) {
    const l = p(sphere, leaf, 0.05, 0.012, 0.025, s * 0.04, Math.min(h, 0.1) * 0.6, 0);
    l.rotation.z = s * 0.5;
    g.add(l);
  }
  if (stage === 2) {
    g.add(p(sphere, lighten(leaf, 0.1), 0.035, 0.05, 0.035, 0, h + 0.02, 0));
    g.add(p(cone, color, 0.025, 0.04, 0.025, 0, h + 0.05, 0));
  } else if (stage === 3) {
    const top = new THREE.Group();
    top.position.y = h + 0.02;
    if (flower === 'tulpe') {
      top.add(p(sphere, color, 0.06, 0.08, 0.06, 0, 0.03, 0));
      top.add(p(cone, lighten(color, 0.1), 0.03, 0.04, 0.03, 0, 0.11, 0));
    } else if (flower === 'pfefferminze') {
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        top.add(p(sphere, i % 2 ? color : darken(color, 0.12), 0.05, 0.025, 0.035, Math.cos(a) * 0.04, (i % 3) * 0.03, Math.sin(a) * 0.04).rotateY(-a));
      }
    } else if (flower === 'lavendel') {
      for (let i = 0; i < 5; i++) top.add(p(sphere, color, 0.03 - i * 0.003, 0.025, 0.03 - i * 0.003, 0, i * 0.035, 0));
    } else {
      const big = flower === 'sonnenblume' ? 1.6 : flower === 'vergissmeinnicht' ? 0.7 : 1;
      const n = flower === 'rose' ? 7 : 8;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        top.add(p(sphere, color, 0.045 * big, 0.02 * big, 0.03 * big, Math.cos(a) * 0.045 * big, 0, Math.sin(a) * 0.045 * big).rotateY(-a));
      }
      top.add(p(sphere, center, 0.035 * big, 0.025 * big, 0.035 * big, 0, 0.01, 0));
      if (flower === 'rose') top.add(p(sphere, darken(color, 0.1), 0.04, 0.035, 0.04, 0, 0.02, 0));
      top.rotation.x = flower === 'sonnenblume' ? 0.5 : 0.2;
    }
    g.add(top);
  }
  return g;
}

/** Wassertropfen-Glitzer auf gegossener Erde */
export function makeWetPatch(): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.CircleGeometry(0.36, 16).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#3e2a20', transparent: true, opacity: 0.35, depthWrite: false }));
  m.position.y = 0.125;
  return m;
}

// ---------------------------------------------------------------------------
// Hühner & Wachteln (Blick nach +Z). `body` nickt beim Picken.
// ---------------------------------------------------------------------------

export interface BirdModel {
  group: THREE.Group;
  /** Oberkörper/Kopf – dreht sich beim Picken nach vorn */
  head: THREE.Group;
  legs: THREE.Object3D[];
}

export function makeHen(color: string): BirdModel {
  const g = new THREE.Group();
  const head = new THREE.Group();
  const legs: THREE.Object3D[] = [];
  const dark = darken(color, 0.15);
  g.add(p(sphere, color, 0.13, 0.12, 0.15, 0, 0.2, 0));
  // Schwanzfedern
  const tail = p(sphere, dark, 0.06, 0.1, 0.05, 0, 0.29, -0.13);
  tail.rotation.x = -0.5;
  g.add(tail);
  // Flügel
  for (const s of [-1, 1]) g.add(p(sphere, dark, 0.035, 0.08, 0.1, s * 0.12, 0.21, -0.01));
  // Kopf (Drehpunkt am Hals)
  head.position.set(0, 0.27, 0.1);
  head.add(p(sphere, color, 0.075, 0.08, 0.075, 0, 0.07, 0.02));
  head.add(p(cone, '#f2b134', 0.025, 0.05, 0.025, 0, 0.065, 0.1).rotateX(Math.PI / 2));
  for (const z of [-0.02, 0.01, 0.04]) head.add(p(sphere, '#e8484f', 0.018, 0.03, 0.018, 0, 0.15, z));
  head.add(p(sphere, '#e8484f', 0.015, 0.025, 0.012, 0, 0.03, 0.08));
  for (const s of [-1, 1]) head.add(p(sphere, '#2b2a31', 0.012, 0.014, 0.008, s * 0.05, 0.09, 0.06));
  g.add(head);
  for (const s of [-1, 1]) {
    const leg = new THREE.Group();
    leg.position.set(s * 0.045, 0.1, 0);
    leg.add(p(cyl, '#f2b134', 0.012, 0.1, 0.012, 0, -0.05, 0));
    leg.add(p(sphere, '#f2b134', 0.03, 0.008, 0.04, 0, -0.1, 0.015));
    g.add(leg);
    legs.push(leg);
  }
  return { group: g, head, legs };
}

export function makeQuail(color: string): BirdModel {
  const g = new THREE.Group();
  const head = new THREE.Group();
  const legs: THREE.Object3D[] = [];
  g.add(p(sphere, color, 0.08, 0.07, 0.09, 0, 0.1, 0));
  g.add(p(sphere, lighten(color, 0.2), 0.06, 0.05, 0.05, 0, 0.08, 0.05));
  // Tupfen
  for (const [x, y, z] of [[0.05, 0.13, -0.03], [-0.05, 0.12, -0.04], [0.02, 0.15, -0.05], [-0.03, 0.15, 0.01]] as const) g.add(p(sphere, '#f7f2e8', 0.012, 0.01, 0.012, x, y, z));
  head.position.set(0, 0.14, 0.06);
  head.add(p(sphere, color, 0.045, 0.045, 0.045, 0, 0.03, 0.02));
  head.add(p(cone, '#3a3a44', 0.012, 0.025, 0.012, 0, 0.025, 0.065).rotateX(Math.PI / 2));
  for (const s of [-1, 1]) head.add(p(sphere, '#2b2a31', 0.008, 0.009, 0.006, s * 0.03, 0.04, 0.045));
  // Federschopf
  const plume = p(sphere, '#3a2a22', 0.008, 0.035, 0.015, 0, 0.08, 0.04);
  plume.rotation.x = 0.6;
  head.add(plume);
  g.add(head);
  for (const s of [-1, 1]) {
    const leg = new THREE.Group();
    leg.position.set(s * 0.03, 0.04, 0);
    leg.add(p(cyl, '#d9a48a', 0.008, 0.04, 0.008, 0, -0.02, 0));
    g.add(leg);
    legs.push(leg);
  }
  return { group: g, head, legs };
}

/** Thalias Schaufel (in der Hand) */
export function makeShovel(): ToolModel {
  const g = new THREE.Group();
  g.add(p(cyl, '#b98a5e', 0.012, 0.32, 0.012, 0, 0, 0.12).rotateX(Math.PI / 2));
  g.add(p(cyl, '#3f7a62', 0.02, 0.05, 0.02, 0, 0, -0.04).rotateX(Math.PI / 2));
  const blade = p(sphere, '#a9acb8', 0.06, 0.012, 0.08, 0, 0, 0.32);
  g.add(blade);
  return { group: g };
}
