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

/**
 * Häuschen mit 5 × 3 Kacheln Grundfläche. `stage` = Ausbaustufe:
 * 1 = Erker an der Seite, 2 = Anbau hinten, 3 = Dachgaube mit Fenster.
 */
export function makeHouse(roofColor: string, stage = 0): HouseModel {
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

  // Ausbau
  if (stage >= 1) {
    // Erker rechts mit kleinem Dach und Fenster
    const ex = W / 2 + 0.2;
    g.add(b(0.4, 1.0, 1.3, wall, ex, 0.22 + 0.6, 0.1));
    g.add(b(0.06, 0.55, 0.8, windowGlass, ex + 0.2, 0.22 + 0.7, 0.1));
    const cap = b(0.6, 0.12, 1.5, roofColor, ex, 0.22 + 1.15, 0.1);
    cap.rotation.z = -0.35;
    g.add(cap);
  }
  if (stage >= 2) {
    // Anbau hinten (Schlafzimmer) mit eigenem Satteldach
    const aw = 2.8;
    const ad = 1.1;
    const az = -D / 2 - ad / 2 + 0.05;
    g.add(b(aw, wallH - 0.25, ad, darken(wall, 0.03), -0.6, 0.22 + (wallH - 0.25) / 2, az));
    const atri = new THREE.Shape();
    atri.moveTo(-(aw / 2 + 0.2), 0);
    atri.lineTo(aw / 2 + 0.2, 0);
    atri.lineTo(0, 0.8);
    atri.closePath();
    const ageo = new THREE.ExtrudeGeometry(atri, { depth: ad + 0.3, bevelEnabled: false });
    ageo.translate(0, 0.22 + wallH - 0.25, -(ad + 0.3) / 2);
    const aroof = mesh(ageo, toon(darken(roofColor, 0.04)));
    aroof.position.set(-0.6, 0, az);
    g.add(aroof);
    for (const x of [-1.3, 0.1]) g.add(b(0.5, 0.45, 0.05, windowGlass, x, 0.22 + 0.75, az - ad / 2 - 0.02));
  }
  if (stage >= 3) {
    // Dachgaube vorne links mit Fenster
    const dz = (D / 2 + over) * 0.35;
    const dy = 0.22 + wallH + roofH * 0.42;
    g.add(b(0.9, 0.6, 0.6, wall, -1.4, dy + 0.15, dz));
    g.add(b(0.55, 0.38, 0.05, windowGlass, -1.4, dy + 0.15, dz + 0.31));
    const dtri = new THREE.Shape();
    dtri.moveTo(-0.6, 0);
    dtri.lineTo(0.6, 0);
    dtri.lineTo(0, 0.45);
    dtri.closePath();
    const dgeo = new THREE.ExtrudeGeometry(dtri, { depth: 0.8, bevelEnabled: false });
    dgeo.translate(0, 0, -0.4);
    const droof = mesh(dgeo, toon(roofColor));
    droof.position.set(-1.4, dy + 0.45, dz);
    g.add(droof);
    windows.push(new THREE.Vector3(-1.4, dy + 0.15, dz + 0.35));
  }
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

/** Gartenbeet: Holzrahmen mit Erde, Ursprung = Mitte */
export function makeBeet(w: number, h: number): THREE.Group {
  const g = new THREE.Group();
  const wood = palette.wood.base;
  const soil = b(w - 0.16, 0.12, h - 0.16, palette.soil.dry, 0, 0.06, 0);
  soil.name = 'erde';
  soil.receiveShadow = true;
  g.add(soil);
  for (const z of [-h / 2 + 0.06, h / 2 - 0.06]) g.add(b(w, 0.18, 0.12, wood, 0, 0.09, z));
  for (const x of [-w / 2 + 0.06, w / 2 - 0.06]) g.add(b(0.12, 0.18, h - 0.1, wood, x, 0.09, 0));
  // kleine Erdhügel je Pflanzplatz
  for (let ix = 0; ix < w; ix++) {
    for (let iz = 0; iz < h; iz++) {
      const hill = mesh(new THREE.SphereGeometry(0.3, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), toon(darken(palette.soil.dry, 0.05)));
      hill.scale.set(1, 0.25, 1);
      hill.position.set(ix - w / 2 + 0.5, 0.11, iz - h / 2 + 0.5);
      g.add(hill);
    }
  }
  return g;
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

/** Opas alte Werkbank: Tisch mit Schraubstock, Werkzeugwand und ein paar Ästen */
export function makeWorkbench(): THREE.Group {
  const g = new THREE.Group();
  const wood = palette.wood.base;
  const light = palette.wood.light;
  // Beine & Platte
  for (const x of [-0.8, 0.8]) for (const z of [-0.25, 0.25]) g.add(b(0.09, 0.62, 0.09, darken(wood, 0.1), x, 0.31, z));
  g.add(b(1.9, 0.1, 0.68, light, 0, 0.66, 0));
  g.add(b(1.7, 0.05, 0.55, darken(wood, 0.05), 0, 0.18, 0));
  // Werkzeugwand hinten
  for (const x of [-0.85, 0.85]) g.add(b(0.07, 0.75, 0.07, darken(wood, 0.1), x, 1.05, -0.3));
  g.add(b(1.76, 0.5, 0.05, lighten(light, 0.06), 0, 1.15, -0.3));
  // Hammer
  g.add(b(0.05, 0.3, 0.03, wood, -0.55, 1.12, -0.26));
  g.add(b(0.16, 0.06, 0.05, '#8a8a96', -0.55, 1.28, -0.26));
  // Säge
  g.add(b(0.36, 0.13, 0.015, '#c9cbd3', 0, 1.13, -0.26));
  g.add(b(0.1, 0.09, 0.03, '#e85a8a', 0.22, 1.15, -0.26));
  // Schraubenschlüssel & Zange
  g.add(b(0.04, 0.26, 0.02, '#8a8a96', 0.5, 1.13, -0.26));
  g.add(b(0.04, 0.22, 0.02, '#e8a07a', 0.62, 1.12, -0.26).rotateZ(0.2));
  // Schraubstock
  g.add(b(0.18, 0.12, 0.14, '#7a9ac8', 0.72, 0.77, 0.18));
  g.add(c(0.015, 0.22, '#c9cbd3', 0.72, 0.77, 0.3).rotateX(Math.PI / 2));
  // Äste & Steine auf der Platte
  for (const [x, rz] of [[-0.45, 0.1], [-0.3, -0.06], [-0.38, 0.2]] as const) {
    const ast = c(0.03, 0.55, '#8a5a3a', x, 0.74, 0.08);
    ast.rotation.set(Math.PI / 2, 0, rz + Math.PI / 2);
    g.add(ast);
  }
  for (const [x, z, r] of [[0.15, 0.1, 0.07], [0.27, 0.15, 0.05], [0.22, -0.02, 0.06]] as const) {
    const st = mesh(sphere, toon('#a9a9b2'));
    st.scale.set(r, r * 0.7, r);
    st.position.set(x, 0.71 + r * 0.5, z);
    g.add(st);
  }
  // Rezeptzettel (rosa) an der Wand
  g.add(b(0.22, 0.26, 0.01, '#fbe0e8', -0.22, 1.2, -0.27));
  g.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = true;
  });
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

/** Picknickdecke mit Korb & Thermoskanne (für die Szene mit Oli), 2×1 Felder, Mitte = Ursprung */
export function makePicnic(): THREE.Group {
  const g = new THREE.Group();
  const c2 = document.createElement('canvas');
  c2.width = c2.height = 64;
  const ctx = c2.getContext('2d') as CanvasRenderingContext2D;
  for (let x = 0; x < 8; x++) for (let y = 0; y < 8; y++) {
    ctx.fillStyle = (x + y) % 2 ? '#f7f5ec' : '#e85a6a';
    ctx.fillRect(x * 8, y * 8, 8, 8);
  }
  const tex = new THREE.CanvasTexture(c2);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  const blanket = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.2).rotateX(-Math.PI / 2), new THREE.MeshToonMaterial({ map: tex }));
  blanket.position.y = 0.02;
  blanket.receiveShadow = true;
  g.add(blanket);
  // Korb
  g.add(b(0.36, 0.2, 0.24, '#c9955f', 0.15, 0.12, -0.38));
  const handle = mesh(new THREE.TorusGeometry(0.13, 0.015, 6, 14, Math.PI), toon('#a87448'));
  handle.position.set(0.15, 0.22, -0.38);
  g.add(handle);
  g.add(b(0.38, 0.03, 0.26, '#e85a6a', 0.15, 0.225, -0.38));
  // Thermoskanne & Becher
  g.add(c(0.05, 0.24, '#5b7fc2', -0.15, 0.14, -0.42));
  for (const x of [-0.02, 0.06]) g.add(c(0.035, 0.07, '#f7f5ec', x, 0.055, -0.15));
  // Teller mit Sandwiches
  g.add(c(0.12, 0.015, '#ffffff', 0.45, 0.03, -0.1));
  for (const x of [0.41, 0.49]) g.add(b(0.08, 0.03, 0.08, '#f2d39a', x, 0.05, -0.1));
  g.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = true;
  });
  return g;
}

function s(rx: number, ry: number, rz: number, color: string, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = mesh(sphere, toon(color));
  m.scale.set(rx, ry, rz);
  m.position.set(x, y, z);
  return m;
}

/** Onkel Jens' Bistro „Chez Jens“: Häuschen mit gestreifter Markise, Schild, Café-Tischchen & Regenbogenfähnchen */
export function makeBistro(): HouseModel {
  const h = makeHouse(palette.roof.sky);
  const g = h.group;
  const zf = 1.2;
  // Markise (rosa-weiß gestreift) über der Front
  for (let i = 0; i < 9; i++) {
    const stripe = b(0.5, 0.04, 0.7, i % 2 ? '#ffffff' : '#f4a3b8', -2 + i * 0.5, 1.55, zf + 0.32);
    stripe.rotation.x = 0.35;
    g.add(stripe);
  }
  for (let i = 0; i < 9; i++) g.add(s(0.07, 0.05, 0.05, i % 2 ? '#ffffff' : '#f4a3b8', -2 + i * 0.5, 1.4, zf + 0.64));
  // Schild über der Tür
  const sign = document.createElement('canvas');
  sign.width = 200;
  sign.height = 230;
  const ctx = sign.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = '#2b2a31';
  ctx.fillRect(0, 0, 200, 230);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f7d26a';
  ctx.font = 'italic 800 40px "Nunito Variable", Nunito, serif';
  ctx.fillText('Chez', 100, 50);
  ctx.fillText('Jens', 100, 95);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 22px "Nunito Variable", Nunito, sans-serif';
  ctx.fillText('Bistro & Kochstudio', 100, 145);
  ctx.fillStyle = '#f4a3b8';
  ctx.fillText('♥ Croissants ♥', 100, 185);
  const tex = new THREE.CanvasTexture(sign);
  tex.colorSpace = THREE.SRGBColorSpace;
  // Kreide-Aufsteller vor der Tür (rechts)
  const stand = new THREE.Group();
  stand.position.set(0.85, 0, zf + 0.55);
  for (const side of [1, -1]) {
    const leaf = new THREE.Group();
    leaf.rotation.x = side * 0.22;
    leaf.add(b(0.5, 0.62, 0.03, '#8a5a3a', 0, 0.31, 0));
    if (side === 1) {
      const face = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.5), new THREE.MeshLambertMaterial({ map: tex }));
      face.position.set(0, 0.33, 0.017);
      leaf.add(face);
    }
    stand.add(leaf);
  }
  g.add(stand);
  // Café-Tischchen mit Stühlen links und rechts
  for (const x of [-1.6, 1.6]) {
    g.add(c(0.28, 0.03, '#f7f5ec', x, 0.62, zf + 0.9));
    g.add(c(0.03, 0.6, '#3a3a44', x, 0.31, zf + 0.9));
    g.add(c(0.04, 0.05, '#f4a3b8', x + 0.08, 0.66, zf + 0.85));
    for (const dx of [-0.38, 0.38]) {
      g.add(c(0.14, 0.03, '#3a3a44', x + dx, 0.4, zf + 0.9));
      for (const ddx of [-0.08, 0.08]) g.add(c(0.012, 0.4, '#3a3a44', x + dx + ddx, 0.2, zf + 0.9));
    }
  }
  // Regenbogen-Fähnchen am Fensterbrett 🌈
  g.add(c(0.012, 0.5, '#8a5a3a', 2.1, 1.25, zf + 0.15));
  const flag = ['#ff8a8a', '#ffc27a', '#fff08a', '#9ce59a', '#8ac8ff', '#b79af0'];
  flag.forEach((col, i) => g.add(b(0.34, 0.04, 0.01, col, 2.28, 1.47 - i * 0.04, zf + 0.15)));
  // Staffelei mit Bild neben der Tür (Jens ist Künstler)
  for (const dx of [-0.12, 0.12]) {
    const leg = b(0.03, 0.9, 0.03, '#8a5a3a', -0.75 + dx, 0.45, zf + 0.25);
    leg.rotation.z = dx;
    g.add(leg);
  }
  g.add(b(0.42, 0.34, 0.03, '#fbf6ec', -0.75, 0.72, zf + 0.28));
  g.add(s(0.09, 0.07, 0.01, '#f4a3b8', -0.82, 0.76, zf + 0.3));
  g.add(s(0.06, 0.05, 0.01, '#8ac8ff', -0.66, 0.68, zf + 0.3));
  g.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = true;
  });
  return h;
}

/** Lars' Praxis mit kleiner Apotheke: weißes Haus mit grünem Kreuz, Schild, Kräuterkübeln & Bank */
export function makePraxis(): HouseModel {
  const h = makeHouse(palette.roof.mint);
  const g = h.group;
  const zf = 1.2;
  // grünes Apothekenkreuz an der Wand (mit Lichtschein abends über das Fensterglas-Material)
  const cross = new THREE.Group();
  cross.position.set(1.25, 1.35, zf + 0.06);
  const glow = new THREE.MeshToonMaterial({ color: '#4fbf6a', emissive: '#4fbf6a', emissiveIntensity: 0.35 });
  cross.add(b(0.36, 0.12, 0.05, glow), b(0.12, 0.36, 0.05, glow));
  g.add(cross);
  // Schild
  const sign = document.createElement('canvas');
  sign.width = 256;
  sign.height = 96;
  const ctx = sign.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 256, 96);
  ctx.strokeStyle = '#4fbf6a';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 248, 88);
  ctx.fillStyle = '#2f5a3a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '800 34px "Nunito Variable", Nunito, sans-serif';
  ctx.fillText('Praxis Dr. Lars', 128, 36);
  ctx.font = '700 22px "Nunito Variable", Nunito, sans-serif';
  ctx.fillStyle = '#e85a8a';
  ctx.fillText('♥ Apotheke & Kräuter ♥', 128, 70);
  const tex = new THREE.CanvasTexture(sign);
  tex.colorSpace = THREE.SRGBColorSpace;
  const board = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.42), new THREE.MeshLambertMaterial({ map: tex }));
  board.position.set(-1.3, 1.27, zf + 0.12);
  g.add(board);
  // Kräuterkübel neben der Tür
  for (const x of [-0.6, 0.6]) {
    g.add(c(0.18, 0.28, '#d98a5f', x, 0.14, zf + 0.35));
    for (let i = 0; i < 5; i++) g.add(s(0.06, 0.08, 0.06, i % 2 ? '#6fbf73' : '#5aa964', x + Math.cos(i * 1.3) * 0.08, 0.34 + (i % 2) * 0.04, zf + 0.35 + Math.sin(i * 1.3) * 0.08));
  }
  // kleines Skelett-Modell im Fenster (Lars' Witz-Partner)
  g.add(s(0.06, 0.07, 0.06, '#f7f5ec', -1.25, 0.95, zf + 0.02));
  g.add(b(0.08, 0.18, 0.03, '#f7f5ec', -1.25, 0.78, zf + 0.02));
  g.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = true;
  });
  return h;
}

/** Lichterketten & Wimpel über dem Dorfplatz (für Thalias Party). Liefert Gruppe + Glühbirnen-Material */
export function makePartyLights(x0: number, z0: number, x1: number, z1: number): { group: THREE.Group; bulbs: THREE.MeshToonMaterial[] } {
  const g = new THREE.Group();
  const cols = ['#ffd36b', '#f4a3b8', '#9ad8ff', '#b8f0a0', '#c3a8e8'];
  const bulbs = cols.map((c) => new THREE.MeshToonMaterial({ color: c, emissive: c, emissiveIntensity: 1.2 }));
  const poles: Array<[number, number]> = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
  for (const [x, z] of poles) g.add(c(0.05, 2.2, '#8a5a3a', x, 1.1, z));
  const lines: Array<[[number, number], [number, number]]> = [[poles[0], poles[2]], [poles[1], poles[3]], [poles[0], poles[1]], [poles[3], poles[2]]];
  lines.forEach(([[ax, az], [bx, bz]], li) => {
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(ax, 2.15, az), new THREE.Vector3((ax + bx) / 2, 1.6, (az + bz) / 2), new THREE.Vector3(bx, 2.15, bz));
    g.add(mesh(new THREE.TubeGeometry(curve, 20, 0.012, 4), toon('#3a3a44')));
    const n = 14;
    for (let i = 1; i < n; i++) {
      const pt = curve.getPoint(i / n);
      if (li < 2) {
        const b2 = new THREE.Mesh(sphere, bulbs[i % bulbs.length]);
        b2.scale.setScalar(0.06);
        b2.position.set(pt.x, pt.y - 0.06, pt.z);
        g.add(b2);
      } else {
        const flag = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.22, 3), toon(cols[i % cols.length]));
        flag.rotation.x = Math.PI;
        flag.position.set(pt.x, pt.y - 0.12, pt.z);
        g.add(flag);
      }
    }
  });
  return { group: g, bulbs };
}

/** Weihnachtsbaum mit Kugeln, Lichtern und Stern. Gibt Leucht-Material für Tag/Nacht mit */
export function makeChristmasTree(): { group: THREE.Group; glow: THREE.MeshToonMaterial } {
  const g = new THREE.Group();
  g.add(c(0.12, 0.4, palette.wood.bark, 0, 0.2, 0));
  g.add(c(0.3, 0.25, '#c9302c', 0, 0.12, 0));
  const green = ['#2f7a4a', '#3a8a56', '#4a9a62'];
  const cone = new THREE.ConeGeometry(1, 1, 10);
  [[1.0, 0.9, 0.85], [0.8, 0.85, 1.45], [0.58, 0.75, 1.98], [0.36, 0.6, 2.45]].forEach(([r, h, y], i) => {
    const m = mesh(cone, toon(green[i % 3]));
    m.scale.set(r, h, r);
    m.position.y = y;
    g.add(m);
  });
  const balls = ['#e8484f', '#f2c94c', '#5b7fc2', '#e85a8a', '#ffffff'];
  for (let i = 0; i < 22; i++) {
    const t = i / 22;
    const y = 0.6 + t * 2.0;
    const r = (1 - t) * 0.9 + 0.12;
    const a = i * 2.4;
    g.add(s(0.07, 0.07, 0.07, balls[i % balls.length], Math.cos(a) * r, y, Math.sin(a) * r));
  }
  const glow = new THREE.MeshToonMaterial({ color: '#fff3b0', emissive: '#ffd36b', emissiveIntensity: 0.4 });
  for (let i = 0; i < 30; i++) {
    const t = i / 30;
    const y = 0.55 + t * 2.1;
    const r = (1 - t) * 0.92 + 0.1;
    const a = i * 1.1;
    const bulb = new THREE.Mesh(sphere, glow);
    bulb.scale.setScalar(0.035);
    bulb.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
    g.add(bulb);
  }
  // Stern
  const star = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
    const r = i % 2 === 0 ? 0.24 : 0.1;
    if (i === 0) star.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else star.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const st = mesh(new THREE.ExtrudeGeometry(star, { depth: 0.05, bevelEnabled: false }), glow);
  st.position.set(0, 2.85, -0.025);
  g.add(st);
  // Geschenke unterm Baum
  for (const [x, z, col] of [[0.55, 0.35, '#e85a8a'], [-0.5, 0.4, '#5b7fc2'], [0.1, 0.6, '#f2c94c']] as const) {
    g.add(b(0.28, 0.22, 0.28, col, x, 0.11, z));
    g.add(b(0.3, 0.05, 0.06, '#ffffff', x, 0.2, z));
    g.add(b(0.06, 0.05, 0.3, '#ffffff', x, 0.2, z));
  }
  g.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = true;
  });
  return { group: g, glow };
}

/** Geschnitzter Kürbis mit Licht (Halloween) */
export function makePumpkin(glow: THREE.Material): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    g.add(s(0.12, 0.17, 0.12, '#e8873a', Math.cos(a) * 0.08, 0.16, Math.sin(a) * 0.08));
  }
  g.add(c(0.025, 0.08, '#5f8a4a', 0, 0.34, 0));
  // Gesicht (leuchtet)
  for (const x of [-0.07, 0.07]) {
    const eye = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.05, 3), glow);
    eye.position.set(x, 0.2, 0.19);
    eye.rotation.x = Math.PI / 2;
    g.add(eye);
  }
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.035, 0.02), glow);
  mouth.position.set(0, 0.11, 0.2);
  g.add(mouth);
  return g;
}

/** Bunte Luftballons an einer Schnur (Linas Geburtstag) */
export function makeBalloons(): THREE.Group {
  const g = new THREE.Group();
  const cols = ['#e85a8a', '#f7d26a', '#8ac8ff', '#b8f0a0', '#c3a8e8'];
  cols.forEach((col, i) => {
    const a = (i / cols.length) * Math.PI * 2;
    const x = Math.cos(a) * 0.22;
    const z = Math.sin(a) * 0.12;
    const y = 1.5 + (i % 2) * 0.22;
    g.add(s(0.15, 0.19, 0.15, col, x, y, z));
    const string = new THREE.Mesh(cyl, toon('#ffffff'));
    string.scale.set(0.006, y - 0.2, 0.006);
    string.position.set(x / 2, (y - 0.2) / 2 + 0.1, z / 2);
    g.add(string);
  });
  g.add(c(0.06, 0.1, '#8a5a3a', 0, 0.05, 0));
  return g;
}
