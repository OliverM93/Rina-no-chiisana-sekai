/**
 * Gebäude & Requisiten in 3D. Ursprung = Mitte der Grundfläche auf Bodenhöhe,
 * „vorne“ (Tür) zeigt nach +Z (zur Kamera).
 */
import * as THREE from 'three';
import { darken, lighten, palette } from '../../style/palette';
import { mesh, toon } from '../materials';

/** Glas, das nachts leuchtet (alle Fenster teilen sich dieses Material) */
export const windowGlass = new THREE.MeshToonMaterial({ color: new THREE.Color(palette.window.glass), emissive: new THREE.Color('#ffd27a'), emissiveIntensity: 0 });
/** Laternenglas */
export const lampGlass = new THREE.MeshToonMaterial({ color: new THREE.Color(palette.window.glow), emissive: new THREE.Color('#ffcf73'), emissiveIntensity: 0.2 });

const box = new THREE.BoxGeometry(1, 1, 1);
const cyl = new THREE.CylinderGeometry(1, 1, 1, 12);
const sphere = new THREE.SphereGeometry(1, 12, 10);

function b(w: number, h: number, d: number, color: string | THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = mesh(box, typeof color === 'string' ? toon(color) : color);
  m.scale.set(w, h, d);
  m.position.set(x, y, z);
  return m;
}

function c(r: number, h: number, color: string | THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = mesh(cyl, typeof color === 'string' ? toon(color) : color);
  m.scale.set(r, h, r);
  m.position.set(x, y, z);
  return m;
}

function heartShape(s: number): THREE.Shape {
  const sh = new THREE.Shape();
  sh.moveTo(0, -0.9 * s);
  sh.bezierCurveTo(-1.4 * s, 0, -0.6 * s, 1.1 * s, 0, 0.45 * s);
  sh.bezierCurveTo(0.6 * s, 1.1 * s, 1.4 * s, 0, 0, -0.9 * s);
  return sh;
}

export interface HouseModel {
  group: THREE.Group;
  /** Lokale Positionen der Fenster (für Lichtschein) */
  windows: THREE.Vector3[];
}

/** Häuschen mit 5 × 3 Kacheln Grundfläche */
export function makeHouse(roofColor: string): HouseModel {
  const g = new THREE.Group();
  const W = 4.5;
  const D = 2.4;
  const wallH = 1.45;
  const wall = palette.wall.cream;

  // Sockel & Wände
  g.add(b(W + 0.1, 0.22, D + 0.1, palette.wood.light, 0, 0.11, 0));
  g.add(b(W, wallH, D, wall, 0, 0.22 + wallH / 2, 0));
  // Fachwerk-Andeutung vorne
  for (const x of [-1.9, -0.9, 0.9, 1.9]) g.add(b(0.07, wallH - 0.1, 0.04, darken(wall, 0.12), x, 0.22 + wallH / 2, D / 2 + 0.01));

  // Satteldach (Dreieck, entlang X extrudiert)
  const roofH = 1.35;
  const over = 0.35;
  const tri = new THREE.Shape();
  tri.moveTo(-(D / 2 + over), 0);
  tri.lineTo(D / 2 + over, 0);
  tri.lineTo(0, roofH);
  tri.closePath();
  const roofGeo = new THREE.ExtrudeGeometry(tri, { depth: W + over * 2, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 2 });
  roofGeo.rotateY(Math.PI / 2);
  roofGeo.translate(-(W / 2 + over), 0.22 + wallH, 0);
  const roof = mesh(roofGeo, toon(roofColor));
  g.add(roof);
  // Firstbalken
  const ridge = mesh(cyl, toon(darken(roofColor, 0.12)));
  ridge.scale.set(0.09, W + over * 2 + 0.1, 0.09);
  ridge.rotation.z = Math.PI / 2;
  ridge.position.set(0, 0.22 + wallH + roofH + 0.02, 0);
  g.add(ridge);
  // Ziegelreihen auf beiden Dachseiten (Rundziegel-Optik)
  const slope = Math.atan2(roofH, D / 2 + over);
  const tileMat = toon(darken(roofColor, 0.06));
  for (const side of [1, -1]) {
    for (let i = 0; i < 6; i++) {
      const t = (i + 0.5) / 6.3;
      const row = mesh(cyl, tileMat);
      row.scale.set(0.075, W + over * 2 - 0.05, 0.075);
      row.rotation.z = Math.PI / 2;
      row.position.set(0, 0.22 + wallH + roofH * t + 0.035, side * ((D / 2 + over) * (1 - t) + 0.01));
      g.add(row);
    }
  }
  // Schornstein
  g.add(b(0.36, 0.8, 0.36, '#e9a28f', 1.3, 0.22 + wallH + roofH * 0.7, -0.35));
  g.add(b(0.46, 0.12, 0.46, '#f2b8a6', 1.3, 0.22 + wallH + roofH * 0.7 + 0.45, -0.35));

  // Herzfenster im Dach (vorne)
  const heart = mesh(new THREE.ExtrudeGeometry(heartShape(0.22), { depth: 0.08, bevelEnabled: false }), windowGlass, false);
  heart.position.set(0, 0.22 + wallH + roofH * 0.48, (D / 2 + over) * 0.52 + 0.06);
  heart.rotation.x = -slope;
  g.add(heart);

  // Tür
  const zf = D / 2;
  g.add(b(0.62, 1.05, 0.08, palette.door.base, 0, 0.22 + 0.52, zf + 0.03));
  const doorTop = mesh(cyl, toon(palette.door.base));
  doorTop.scale.set(0.31, 0.08, 0.31);
  doorTop.rotation.x = Math.PI / 2;
  doorTop.position.set(0, 0.22 + 1.05, zf + 0.03);
  g.add(doorTop);
  const knob = mesh(sphere, toon('#ffd36b'));
  knob.scale.setScalar(0.04);
  knob.position.set(0.2, 0.75, zf + 0.09);
  g.add(knob);
  g.add(b(0.9, 0.08, 0.35, palette.stone.light, 0, 0.04, zf + 0.25));

  // Fenster mit Blumenkästen
  const windows: THREE.Vector3[] = [];
  for (const x of [-1.35, 1.35]) {
    const y = 0.22 + 0.85;
    g.add(b(0.82, 0.7, 0.06, '#ffffff', x, y, zf + 0.02));
    g.add(b(0.68, 0.56, 0.05, windowGlass, x, y, zf + 0.05));
    g.add(b(0.06, 0.56, 0.06, '#ffffff', x, y, zf + 0.07));
    g.add(b(0.68, 0.06, 0.06, '#ffffff', x, y, zf + 0.07));
    g.add(b(0.86, 0.14, 0.18, palette.wood.base, x, y - 0.42, zf + 0.1));
    const flowers = ['#ff9fbd', '#fff09a', '#ffffff', '#c8b6e8'];
    for (let i = 0; i < 6; i++) {
      const f = mesh(sphere, toon(flowers[i % 4]), false);
      f.scale.setScalar(0.065);
      f.position.set(x - 0.34 + i * 0.136, y - 0.31, zf + 0.12);
      g.add(f);
    }
    windows.push(new THREE.Vector3(x, y, zf + 0.1));
  }
  windows.push(new THREE.Vector3(0, 0.22 + wallH + roofH * 0.48, zf + over));
  return { group: g, windows };
}

export function makeMailbox(): { group: THREE.Group; flag: THREE.Object3D; letter: THREE.Object3D } {
  const g = new THREE.Group();
  g.add(c(0.05, 0.6, palette.wood.base, 0, 0.3, 0));
  const body = palette.roof.mint;
  g.add(b(0.36, 0.26, 0.46, body, 0, 0.72, 0));
  const top = mesh(cyl, toon(body));
  top.scale.set(0.18, 0.46, 0.18);
  top.rotation.x = Math.PI / 2;
  top.position.set(0, 0.85, 0);
  g.add(top);
  g.add(b(0.2, 0.04, 0.02, darken(body, 0.25), 0, 0.78, 0.235));
  const flag = new THREE.Group();
  flag.add(b(0.03, 0.34, 0.03, '#f08a9c', 0, 0.17, 0));
  flag.add(b(0.03, 0.12, 0.16, '#f08a9c', 0, 0.3, 0.08));
  flag.position.set(0.2, 0.64, 0.05);
  g.add(flag);
  const letter = b(0.2, 0.13, 0.02, '#ffffff', 0, 0.95, 0.12);
  letter.rotation.z = -0.15;
  g.add(letter);
  return { group: g, flag, letter };
}

export function makeSellbox(): THREE.Group {
  const g = new THREE.Group();
  const wood = palette.wood.light;
  g.add(b(0.7, 0.45, 0.5, wood, 0, 0.24, 0));
  for (const y of [0.16, 0.32]) g.add(b(0.72, 0.03, 0.52, darken(wood, 0.15), 0, y, 0));
  g.add(b(0.78, 0.1, 0.56, palette.wood.base, 0, 0.5, 0));
  const star = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
    const r = i % 2 === 0 ? 0.13 : 0.06;
    if (i === 0) star.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else star.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const s = mesh(new THREE.ExtrudeGeometry(star, { depth: 0.03, bevelEnabled: false }), toon('#ffe39b', { emissive: '#ffd36b', emissiveIntensity: 0.15 }));
  s.position.set(0, 0.25, 0.25);
  g.add(s);
  return g;
}

export function makeBoard(): THREE.Group {
  const g = new THREE.Group();
  const wood = palette.wood.base;
  for (const x of [-0.75, 0.75]) g.add(b(0.1, 1.2, 0.1, wood, x, 0.6, 0));
  g.add(b(1.7, 0.85, 0.1, palette.wood.light, 0, 1.05, 0));
  g.add(b(1.55, 0.7, 0.04, '#f7ecd8', 0, 1.05, 0.06));
  const notes: Array<[number, number, number, number, string]> = [
    [-0.45, 1.12, 0.38, 0.45, '#ffffff'],
    [0.02, 1.15, 0.34, 0.3, '#fff1a8'],
    [0.45, 1.1, 0.32, 0.4, '#dff1ff'],
    [0.02, 0.86, 0.3, 0.2, '#ffe0ea'],
  ];
  for (const [x, y, w, h, col] of notes) {
    const n = b(w, h, 0.01, col, x, y, 0.09);
    n.rotation.z = (x * 7) % 0.1;
    g.add(n);
  }
  const roof = mesh(cyl, toon(palette.roof.coral));
  roof.scale.set(0.2, 1.9, 0.2);
  roof.rotation.z = Math.PI / 2;
  roof.position.set(0, 1.52, 0);
  g.add(roof);
  return g;
}

export function makeLantern(): THREE.Group {
  const g = new THREE.Group();
  const metal = '#8d8299';
  g.add(c(0.12, 0.12, metal, 0, 0.06, 0));
  g.add(c(0.045, 1.5, metal, 0, 0.8, 0));
  g.add(b(0.24, 0.3, 0.24, lampGlass, 0, 1.68, 0));
  const cap = mesh(new THREE.ConeGeometry(0.22, 0.18, 4), toon(metal));
  cap.position.set(0, 1.92, 0);
  cap.rotation.y = Math.PI / 4;
  g.add(cap);
  const ball = mesh(sphere, toon(metal));
  ball.scale.setScalar(0.04);
  ball.position.set(0, 2.03, 0);
  g.add(ball);
  return g;
}

/** Bank für 2 Kacheln, Sitzfläche zeigt nach +Z */
export function makeBench(): THREE.Group {
  const g = new THREE.Group();
  const wood = palette.wood.light;
  const dark = palette.wood.base;
  for (const x of [-0.75, 0.75]) {
    g.add(b(0.08, 0.32, 0.36, dark, x, 0.16, 0));
    g.add(b(0.08, 0.5, 0.08, dark, x, 0.55, -0.16));
  }
  for (const z of [-0.12, 0, 0.12]) g.add(b(1.75, 0.06, 0.11, lighten(wood, 0.05), 0, 0.35, z));
  for (const y of [0.55, 0.72]) g.add(b(1.75, 0.11, 0.05, wood, 0, y, -0.18));
  return g;
}

/** Brunnen (3 × 2 Kacheln) */
export function makeFountain(): THREE.Group {
  const g = new THREE.Group();
  const stone = palette.stone.light;
  const ring = mesh(new THREE.CylinderGeometry(1.25, 1.32, 0.42, 28, 1, true), toon(palette.stone.base, { side: THREE.DoubleSide }));
  ring.position.y = 0.21;
  ring.scale.z = 0.72;
  g.add(ring);
  const rim = mesh(new THREE.TorusGeometry(1.26, 0.09, 8, 32), toon(stone));
  rim.rotation.x = Math.PI / 2;
  rim.scale.y = 0.72;
  rim.position.y = 0.42;
  g.add(rim);
  const water = mesh(new THREE.CircleGeometry(1.22, 28), new THREE.MeshPhongMaterial({ color: palette.water.base, shininess: 80, transparent: true, opacity: 0.85 }), false);
  water.rotation.x = -Math.PI / 2;
  water.scale.y = 0.72;
  water.position.y = 0.32;
  g.add(water);
  g.add(c(0.15, 0.9, stone, 0, 0.6, 0));
  const bowl = mesh(new THREE.CylinderGeometry(0.42, 0.2, 0.18, 18), toon(stone));
  bowl.position.y = 1.1;
  g.add(bowl);
  const top = mesh(new THREE.CircleGeometry(0.38, 18), toon(palette.water.base));
  top.rotation.x = -Math.PI / 2;
  top.position.y = 1.2;
  g.add(top);
  const spout = mesh(sphere, new THREE.MeshPhongMaterial({ color: '#dff6ff', transparent: true, opacity: 0.8, shininess: 100 }));
  spout.scale.set(0.08, 0.2, 0.08);
  spout.position.y = 1.35;
  g.add(spout);
  return g;
}

/** Holzbrücke (3 Kacheln lang in X-Richtung) */
export function makeBridge(): THREE.Group {
  const g = new THREE.Group();
  const wood = palette.wood.light;
  for (let i = 0; i < 13; i++) g.add(b(0.22, 0.08, 1.0, i % 2 ? wood : lighten(wood, 0.06), -1.45 + i * 0.242, 0.06, 0));
  for (const z of [-0.5, 0.5]) {
    for (let i = 0; i < 5; i++) g.add(b(0.08, 0.42, 0.08, palette.wood.base, -1.5 + i * 0.75, 0.25, z));
    g.add(b(3.15, 0.08, 0.1, palette.wood.base, 0, 0.47, z));
  }
  // Stützen ins Wasser
  for (const x of [-1.2, 0, 1.2]) for (const z of [-0.45, 0.45]) g.add(c(0.07, 0.6, palette.wood.dark, x, -0.25, z));
  return g;
}

/** Schild mit Aufschrift */
export function makeSign(text: string): THREE.Group {
  const g = new THREE.Group();
  g.add(b(0.08, 0.7, 0.08, palette.wood.base, 0, 0.35, 0));
  g.add(b(0.82, 0.38, 0.07, palette.wood.light, 0, 0.72, 0));
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 112;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = palette.wood.light;
  ctx.fillRect(0, 0, 256, 112);
  ctx.fillStyle = darken(palette.wood.dark, 0.3);
  ctx.font = '800 46px "Nunito Variable", Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 58);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const label = new THREE.Mesh(new THREE.PlaneGeometry(0.76, 0.33), new THREE.MeshLambertMaterial({ map: tex }));
  label.position.set(0, 0.72, 0.04);
  g.add(label);
  return g;
}

/** Bauplatz-Markierung: Pflöcke mit Seil (Grundfläche w × d) */
export function makePlotMarks(w: number, d: number): THREE.Group {
  const g = new THREE.Group();
  const hw = w / 2 - 0.15;
  const hd = d / 2 - 0.15;
  for (const [x, z] of [
    [-hw, -hd],
    [hw, -hd],
    [-hw, hd],
    [hw, hd],
  ]) {
    g.add(b(0.08, 0.3, 0.08, palette.wood.base, x, 0.15, z));
  }
  const rope = '#d9bf98';
  g.add(b(hw * 2, 0.025, 0.025, rope, 0, 0.24, -hd));
  g.add(b(hw * 2, 0.025, 0.025, rope, 0, 0.24, hd));
  g.add(b(0.025, 0.025, hd * 2, rope, -hw, 0.24, 0));
  g.add(b(0.025, 0.025, hd * 2, rope, hw, 0.24, 0));
  return g;
}
