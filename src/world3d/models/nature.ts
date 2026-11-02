/**
 * Natur in 3D: Laubbäume, Tannen, Büsche, Felsen, Blumen – alles aus
 * einfachen Grundformen, weich beleuchtet (PS2-Charme statt Fotorealismus).
 * Ursprung jedes Modells = Mitte der Grundfläche auf Bodenhöhe.
 */
import * as THREE from 'three';
import { mulberry32 } from '../../core/rng';
import type { Season } from '../../core/time';
import { palette } from '../../style/palette';
import { mesh, toon } from '../materials';

const geo = {
  blob: new THREE.IcosahedronGeometry(1, 2),
  blobLow: new THREE.IcosahedronGeometry(1, 1),
  trunk: new THREE.CylinderGeometry(0.11, 0.17, 1, 8),
  cone: new THREE.ConeGeometry(1, 1, 9),
  rock: new THREE.DodecahedronGeometry(1, 0),
  sphere: new THREE.SphereGeometry(1, 10, 8),
  stem: new THREE.CylinderGeometry(0.012, 0.012, 1, 4),
};

export interface TreeModel {
  group: THREE.Group;
  /** Stellen in der Krone für Früchte (lokal) */
  fruitSpots: THREE.Vector3[];
  /** Kronen-Meshes (zum Wackeln/Ausblenden) */
  crown: THREE.Object3D;
}

export function makeTree(season: Season, seed: number): TreeModel {
  const rnd = mulberry32(seed);
  const [main, light, dark] = palette.leaves[season];
  const group = new THREE.Group();

  const trunkH = 0.95 + rnd() * 0.15;
  const trunk = mesh(geo.trunk, toon(palette.wood.bark));
  trunk.scale.set(1, trunkH, 1);
  trunk.position.y = trunkH / 2;
  group.add(trunk);

  const crown = new THREE.Group();
  crown.position.y = trunkH + 0.55;
  const blobs: Array<[number, number, number, number, string]> = [
    [0, 0.15, 0, 0.72, main],
    [-0.42, -0.05, 0.12, 0.5, main],
    [0.42, -0.02, -0.1, 0.52, main],
    [0.05, 0.05, 0.42, 0.5, light],
    [-0.1, 0.55, -0.05, 0.48, light],
    [0.1, -0.12, -0.42, 0.48, dark],
  ];
  for (const [x, y, z, r, c] of blobs) {
    const j = () => (rnd() - 0.5) * 0.12;
    const m = mesh(geo.blob, toon(c));
    m.position.set(x + j(), y + j(), z + j());
    m.scale.setScalar(r * (0.92 + rnd() * 0.16));
    crown.add(m);
  }
  if (season === 'winter') {
    for (const [x, z] of [
      [0, 0],
      [-0.3, 0.1],
      [0.25, -0.1],
    ]) {
      const s = mesh(geo.blob, toon('#ffffff'));
      s.position.set(x, 0.72, z);
      s.scale.set(0.38, 0.16, 0.38);
      crown.add(s);
    }
  }
  if (season === 'fruehling' || season === 'herbst') {
    const dotColors = season === 'fruehling' ? ['#ffc8dc', '#ffffff'] : ['#e9775f', '#f6d26c'];
    for (let i = 0; i < 14; i++) {
      const a = rnd() * Math.PI * 2;
      const h = rnd() * 0.9 - 0.2;
      const r = 0.68 + rnd() * 0.08;
      const d = mesh(geo.sphere, toon(dotColors[i % 2]), false, false);
      d.position.set(Math.cos(a) * r * Math.cos(h), 0.15 + Math.sin(h) * 0.6, Math.sin(a) * r * Math.cos(h));
      d.scale.setScalar(0.055);
      crown.add(d);
    }
  }
  group.add(crown);
  group.rotation.y = rnd() * Math.PI * 2;

  const fruitSpots = [new THREE.Vector3(-0.35, trunkH + 0.45, 0.5), new THREE.Vector3(0.45, trunkH + 0.6, 0.35), new THREE.Vector3(0.05, trunkH + 0.3, 0.62)];
  return { group, fruitSpots, crown };
}

export function makePine(season: Season, seed: number): TreeModel {
  const rnd = mulberry32(seed);
  const group = new THREE.Group();
  const trunk = mesh(geo.trunk, toon(palette.wood.bark));
  trunk.scale.set(0.8, 0.5, 0.8);
  trunk.position.y = 0.25;
  group.add(trunk);
  const crown = new THREE.Group();
  const main = season === 'winter' ? '#6aa58a' : '#6fb88f';
  const tiers = [
    [0.4, 0.78, 0.95],
    [0.95, 0.62, 0.8],
    [1.45, 0.44, 0.7],
  ];
  const scale = 0.95 + rnd() * 0.15;
  for (const [y, r, h] of tiers) {
    const c = mesh(geo.cone, toon(main));
    c.position.y = y * scale + h / 2;
    c.scale.set(r * scale, h, r * scale);
    crown.add(c);
    if (season === 'winter') {
      const s = mesh(geo.cone, toon('#ffffff'));
      s.position.y = y * scale + h * 0.78;
      s.scale.set(r * scale * 0.5, h * 0.35, r * scale * 0.5);
      crown.add(s);
    }
  }
  group.add(crown);
  group.rotation.y = rnd() * Math.PI;
  return { group, fruitSpots: [], crown };
}

export function makeBush(season: Season, seed: number): THREE.Group {
  const rnd = mulberry32(seed);
  const [main, light] = palette.leaves[season === 'herbst' ? 'sommer' : season];
  const g = new THREE.Group();
  for (const [x, y, z, r] of [
    [-0.18, 0.22, 0, 0.28],
    [0.18, 0.22, 0.02, 0.28],
    [0, 0.34, -0.05, 0.3],
    [0, 0.22, 0.16, 0.26],
  ]) {
    const m = mesh(geo.blob, toon(r > 0.29 ? light : main));
    m.position.set(x, y, z);
    m.scale.setScalar(r);
    g.add(m);
  }
  const dot = season === 'winter' ? '#ffffff' : season === 'herbst' ? '#e8616f' : season === 'fruehling' ? '#fff3a8' : '#ffb3c9';
  for (let i = 0; i < 8; i++) {
    const a = rnd() * Math.PI * 2;
    const d = mesh(geo.sphere, toon(dot), false, false);
    d.position.set(Math.cos(a) * 0.3, 0.2 + rnd() * 0.25, Math.sin(a) * 0.3);
    d.scale.setScalar(0.05);
    g.add(d);
  }
  return g;
}

export function makeRock(seed: number): THREE.Group {
  const rnd = mulberry32(seed);
  const g = new THREE.Group();
  const r = mesh(geo.rock, toon(palette.stone.base));
  r.scale.set(0.38, 0.27, 0.32);
  r.position.y = 0.2;
  r.rotation.set(rnd(), rnd() * 3, rnd() * 0.3);
  g.add(r);
  const s = mesh(geo.rock, toon(palette.stone.light));
  s.scale.set(0.16, 0.12, 0.14);
  s.position.set(0.28, 0.1, 0.12);
  g.add(s);
  const moss = mesh(geo.blobLow, toon('#a9d39a'), false, false);
  moss.scale.set(0.1, 0.04, 0.08);
  moss.position.set(-0.05, 0.43, 0.02);
  g.add(moss);
  return g;
}

export const FLOWER_COLORS = ['#ffb3c9', '#fff09a', '#ffffff', '#c8b6e8', '#ffcfa3', '#a9d8ff'];

/** Kleines Blümchen (Stängel + Blüte) */
export function makeFlower(color: string): THREE.Group {
  const g = new THREE.Group();
  const stem = mesh(geo.stem, toon('#7fbb68'), false, false);
  stem.scale.y = 0.16;
  stem.position.y = 0.08;
  g.add(stem);
  const head = mesh(geo.blobLow, toon(color), false, false);
  head.scale.set(0.06, 0.03, 0.06);
  head.position.y = 0.17;
  g.add(head);
  const center = mesh(geo.sphere, toon('#ffd36b'), false, false);
  center.scale.setScalar(0.022);
  center.position.y = 0.19;
  g.add(center);
  return g;
}

