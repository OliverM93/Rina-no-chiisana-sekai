/**
 * Orte aus den Herzenswünschen (`data/wishes.ts`): Omas Blumenbeet, Christins Kräuterspirale, Jens' Aquarium,
 * Lars' Insektenhotel, Thalias Aussichtspunkt, Olafs Angelsteg und Olis Herzbank.
 *
 * Der Ursprung liegt in der Mitte der Grundfläche (w × h Kacheln), Boden bei y = 0.
 */
import * as THREE from 'three';
import { palette } from '../../style/palette';
import { mesh, toon } from '../materials';
import { makeFlower } from './nature';

const box = new THREE.BoxGeometry(1, 1, 1);
const cyl = new THREE.CylinderGeometry(1, 1, 1, 12);
const sphere = new THREE.SphereGeometry(1, 12, 10);
const cone = new THREE.ConeGeometry(1, 1, 10);

function b(w: number, h: number, d: number, color: string | THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = mesh(box, typeof color === 'string' ? toon(color) : color);
  m.scale.set(w, h, d);
  m.position.set(x, y, z);
  return m;
}
function c(r: number, h: number, color: string | THREE.Material, x = 0, y = 0, z = 0, geo = cyl): THREE.Mesh {
  const m = mesh(geo, typeof color === 'string' ? toon(color) : color);
  m.scale.set(r, h, r);
  m.position.set(x, y, z);
  return m;
}
function s(rx: number, ry: number, rz: number, color: string | THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = mesh(sphere, typeof color === 'string' ? toon(color) : color);
  m.scale.set(rx, ry, rz);
  m.position.set(x, y, z);
  return m;
}

/** Kleines Herz aus zwei Kugeln und einem Kegel (zeigt nach +z) */
function heart(size: number, color: string, x: number, y: number, z: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.add(s(size * 0.55, size * 0.55, size * 0.3, color, -size * 0.4, size * 0.25, 0));
  g.add(s(size * 0.55, size * 0.55, size * 0.3, color, size * 0.4, size * 0.25, 0));
  const tip = c(size * 0.85, size * 1.1, color, 0, -size * 0.35, 0, cone);
  tip.rotation.z = Math.PI;
  tip.scale.z = size * 0.3;
  g.add(tip);
  return g;
}

/** Omas Blumenbeet: Holzeinfassung mit Rosen & Vergissmeinnicht (3 × 1) */
function blumenbeet(w: number): THREE.Group {
  const g = new THREE.Group();
  const wood = palette.wood.base;
  for (const z of [-0.42, 0.42]) g.add(b(w - 0.1, 0.16, 0.08, wood, 0, 0.08, z));
  for (const x of [-(w / 2 - 0.09), w / 2 - 0.09]) g.add(b(0.08, 0.16, 0.84, wood, x, 0.08, 0));
  g.add(b(w - 0.2, 0.1, 0.76, '#7a5236', 0, 0.06, 0));
  const colors = ['#e8484f', '#7ab8f0', '#f4a3c0', '#7ab8f0', '#e8484f', '#ffffff', '#7ab8f0', '#e8484f', '#f7d26a'];
  for (let i = 0; i < 9; i++) {
    const f = makeFlower(colors[i]);
    f.position.set(-w / 2 + 0.3 + (i % 5) * ((w - 0.6) / 4), 0.1, i < 5 ? -0.16 : 0.18);
    f.scale.setScalar(1.6);
    g.add(f);
  }
  // kleines Holzschild mit Herz
  g.add(b(0.04, 0.4, 0.04, wood, w / 2 - 0.25, 0.2, 0.36));
  g.add(b(0.26, 0.18, 0.04, palette.wood.light, w / 2 - 0.25, 0.42, 0.38));
  g.add(heart(0.05, '#e85a8a', w / 2 - 0.25, 0.42, 0.405));
  return g;
}

/** Christins Kräuterspirale: Steinschnecke mit vier Kräutern, ordentlich von unten nach oben (2 × 1) */
function kraeuterspirale(): THREE.Group {
  const g = new THREE.Group();
  const stones = ['#9a9aa4', '#b0b0b8', '#8f8f99', '#a9a9b2'];
  const n = 26;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const a = t * Math.PI * 3.2;
    const r = 0.46 - t * 0.36;
    const y = 0.05 + t * 0.32;
    g.add(s(0.07, 0.05 + t * 0.03, 0.06, stones[i % 4], Math.cos(a) * r * 1.6, y, Math.sin(a) * r * 0.85));
  }
  g.add(s(0.62, 0.18, 0.36, '#7a5236', 0, 0.08, 0));
  g.add(s(0.32, 0.26, 0.2, '#7a5236', 0.05, 0.2, 0));
  // Kräuter: Basilikum, Schnittlauch, Petersilie, Thymian (oben)
  const herbs: Array<[number, number, number, string]> = [[-0.5, 0.18, 0.12, '#5ea84e'], [0.45, 0.2, -0.05, '#3f8a3a'], [-0.15, 0.3, -0.15, '#6fb06a'], [0.08, 0.44, 0.02, '#8a9a5a']];
  for (const [x, y, z, col] of herbs) {
    for (let k = 0; k < 4; k++) g.add(s(0.06, 0.08, 0.06, col, x + (k % 2) * 0.07 - 0.035, y + 0.05 + (k >> 1) * 0.05, z + (k % 2 ? 0.03 : -0.03)));
  }
  for (let k = 0; k < 5; k++) g.add(c(0.008, 0.18, '#4f9a3a', 0.45 + k * 0.02 - 0.04, 0.29, -0.05 + (k % 2) * 0.03));
  return g;
}

/** Jens' Aquarium auf einem Tischchen vor dem Bistro (2 × 1) */
function aquarium(): THREE.Group {
  const g = new THREE.Group();
  const iron = '#3a3a44';
  for (const x of [-0.7, 0.7]) for (const z of [-0.28, 0.28]) g.add(b(0.05, 0.62, 0.05, iron, x, 0.31, z));
  g.add(b(1.55, 0.06, 0.66, '#c9955f', 0, 0.64, 0));
  const water = new THREE.MeshToonMaterial({ color: '#8ac8f0', transparent: true, opacity: 0.55 });
  g.add(b(1.4, 0.56, 0.5, water, 0, 0.95, 0));
  const glass = new THREE.MeshToonMaterial({ color: '#e6f4ff', transparent: true, opacity: 0.2 });
  g.add(b(1.46, 0.62, 0.56, glass, 0, 0.98, 0));
  g.add(b(1.46, 0.04, 0.56, iron, 0, 1.3, 0));
  g.add(b(1.38, 0.06, 0.48, '#f3dfa6', 0, 0.7, 0));
  // Pflanzen, Seestern, Fische
  for (const x of [-0.5, -0.38, 0.45]) g.add(c(0.02, 0.32, '#4f9a5a', x, 0.88, -0.1));
  const star = c(0.07, 0.02, '#f2845a', 0.2, 0.74, 0.1, new THREE.CylinderGeometry(1, 1, 1, 5));
  g.add(star);
  const fish: Array<[number, number, number, string]> = [[-0.25, 1.0, 0.05, '#f2a83a'], [0.25, 0.9, -0.1, '#c9cbd3'], [0.05, 1.1, 0.12, '#e85a6a']];
  for (const [x, y, z, col] of fish) {
    const f = new THREE.Group();
    f.position.set(x, y, z);
    f.add(s(0.09, 0.05, 0.035, col));
    const tail = c(0.04, 0.06, col, -0.11, 0, 0, cone);
    tail.rotation.z = Math.PI / 2;
    f.add(tail);
    f.add(s(0.012, 0.012, 0.01, '#2b2a31', 0.05, 0.015, 0.03));
    f.userData.swim = true;
    g.add(f);
  }
  return g;
}

/** Lars' Insektenhotel: Holzhaus mit Fächern aus Ästen, Zapfen und Lochsteinen (1 × 1) */
function insektenhotel(): THREE.Group {
  const g = new THREE.Group();
  const wood = palette.wood.base;
  for (const x of [-0.3, 0.3]) g.add(b(0.06, 1.0, 0.06, wood, x, 0.5, -0.1));
  g.add(b(0.62, 0.62, 0.3, '#c9955f', 0, 0.85, 0));
  for (const sx of [-1, 1]) {
    const roof = b(0.42, 0.04, 0.4, '#d9534f', sx * 0.18, 1.24, 0);
    roof.rotation.z = -sx * 0.55;
    g.add(roof);
  }
  // Fächer
  const fills = ['#8a5a3a', '#b98a5e', '#a9a9b2', '#e6c59c'];
  for (let i = 0; i < 4; i++) {
    const x = (i % 2) * 0.28 - 0.14;
    const y = 0.7 + Math.floor(i / 2) * 0.28;
    g.add(b(0.24, 0.24, 0.02, '#6e4630', x, y, 0.15));
    for (let k = 0; k < 6; k++) {
      const holes = c(0.025, 0.02, fills[i], x - 0.07 + (k % 3) * 0.07, y - 0.05 + Math.floor(k / 3) * 0.1, 0.16);
      holes.rotation.x = Math.PI / 2;
      g.add(holes);
    }
  }
  // Wildblumen davor & eine Biene
  for (const [x, col] of [[-0.3, '#f7d26a'], [0.0, '#f4a3c0'], [0.3, '#ffffff']] as const) {
    const f = makeFlower(col);
    f.position.set(x, 0, 0.32);
    f.scale.setScalar(1.4);
    g.add(f);
  }
  g.add(s(0.04, 0.03, 0.03, '#f2c94c', 0.2, 1.05, 0.28));
  g.add(b(0.02, 0.028, 0.032, '#2b2a31', 0.2, 1.05, 0.28));
  return g;
}

/** Thalias Aussichtspunkt: Holzplattform, Fernrohr auf Dreibein, Infotafel mit Funden (2 × 1) */
function aussichtspunkt(): THREE.Group {
  const g = new THREE.Group();
  const wood = palette.wood.light;
  g.add(b(1.8, 0.1, 0.86, wood, 0, 0.05, 0));
  for (const x of [-0.85, 0.85]) for (const z of [-0.38, 0.38]) g.add(b(0.06, 0.5, 0.06, palette.wood.base, x, 0.3, z));
  g.add(b(1.76, 0.05, 0.05, palette.wood.base, 0, 0.55, -0.38));
  // Fernrohr (zeigt Richtung Meer/Süden)
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const leg = b(0.03, 0.7, 0.03, '#3a3a44', -0.35 + Math.cos(a) * 0.1, 0.42, Math.sin(a) * 0.1);
    leg.rotation.set(Math.sin(a) * 0.25, 0, -Math.cos(a) * 0.25);
    g.add(leg);
  }
  const tube = new THREE.Group();
  tube.position.set(-0.35, 0.82, 0);
  tube.rotation.x = Math.PI / 2 - 0.25;
  tube.add(c(0.06, 0.5, '#c9a24a'));
  tube.add(c(0.075, 0.06, '#3a3a44', 0, 0.26, 0));
  tube.add(c(0.035, 0.1, '#3a3a44', 0, -0.28, 0));
  g.add(tube);
  // Infotafel mit Fundstücken, Glitzerstein oben
  g.add(b(0.05, 0.8, 0.05, palette.wood.base, 0.5, 0.45, -0.2));
  const board = new THREE.Group();
  board.position.set(0.5, 0.85, -0.17);
  board.rotation.x = -0.35;
  board.add(b(0.6, 0.4, 0.04, palette.wood.base));
  board.add(b(0.54, 0.34, 0.01, '#f3ead8', 0, 0, 0.025));
  const amm = mesh(new THREE.TorusGeometry(0.05, 0.022, 6, 14), toon('#c9a77a'));
  amm.position.set(-0.14, 0.03, 0.04);
  board.add(amm);
  board.add(c(0.03, 0.1, '#a98ad8', 0.06, 0.02, 0.04, cone));
  board.add(b(0.18, 0.015, 0.005, '#9a9aa4', 0.0, -0.11, 0.035));
  g.add(board);
  g.add(c(0.04, 0.12, '#c3a8ff', 0.5, 1.15, -0.23, cone));
  return g;
}

/** Olis Herzbank am Strand: wie die Dorfbank, aber mit Muschelherz in der Lehne (2 × 1) */
export function makeHeartBench(): THREE.Group {
  const g = new THREE.Group();
  const wood = palette.wood.light;
  const dark = palette.wood.base;
  for (const x of [-0.75, 0.75]) {
    g.add(b(0.08, 0.32, 0.36, dark, x, 0.16, 0));
    g.add(b(0.08, 0.6, 0.08, dark, x, 0.6, -0.16));
  }
  for (const z of [-0.12, 0, 0.12]) g.add(b(1.75, 0.06, 0.11, wood, 0, 0.35, z));
  g.add(b(1.75, 0.1, 0.05, wood, 0, 0.86, -0.18));
  g.add(b(1.75, 0.08, 0.05, wood, 0, 0.5, -0.18));
  for (const x of [-0.5, 0.5]) g.add(b(0.08, 0.36, 0.04, wood, x, 0.68, -0.18));
  g.add(heart(0.16, '#f4a3b8', 0, 0.7, -0.15));
  for (const [x, y] of [[-0.12, 0.76], [0.12, 0.76], [0, 0.62]] as const) g.add(s(0.04, 0.035, 0.02, '#fbe0e8', x, y, -0.11));
  return g;
}

/** Olafs Angelsteg: Bohlen auf Pfählen, ragt ins Wasser (w × 1, in x-Richtung) */
export function makeSteg(w: number): THREE.Group {
  const g = new THREE.Group();
  const wood = palette.wood.light;
  const n = Math.round(w * 4);
  for (let i = 0; i < n; i++) g.add(b(0.22, 0.07, 0.86, i % 2 ? wood : palette.wood.base, -w / 2 + 0.13 + i * (w / n), 0.12, 0));
  for (let i = 0; i <= w; i++) for (const z of [-0.4, 0.4]) g.add(c(0.06, 0.8, palette.wood.dark, -w / 2 + 0.1 + i * ((w - 0.2) / w), -0.15, z));
  // Geländer nur an der Spitze, Eimer & Angelrute
  for (const z of [-0.42, 0.42]) {
    g.add(b(0.06, 0.45, 0.06, palette.wood.base, w / 2 - 0.08, 0.35, z));
  }
  g.add(b(0.06, 0.06, 0.9, palette.wood.base, w / 2 - 0.08, 0.56, 0));
  g.add(c(0.09, 0.14, '#5b7fc2', -w / 2 + 0.4, 0.23, 0.25));
  return g;
}

/** Ort zu einer `variant` (siehe `VILLAGE_OBJECTS`) */
export function makeLandmark(variant: string, w: number, h: number): THREE.Group {
  void h;
  switch (variant) {
    case 'blumenbeet':
      return blumenbeet(w);
    case 'kraeuterspirale':
      return kraeuterspirale();
    case 'aquarium':
      return aquarium();
    case 'insektenhotel':
      return insektenhotel();
    case 'aussichtspunkt':
      return aussichtspunkt();
    default:
      return new THREE.Group();
  }
}
