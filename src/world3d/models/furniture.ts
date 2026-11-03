/**
 * Möbelmodelle aus Grundformen. Ursprung = Mitte der Grundfläche auf dem
 * Boden, Breite entlang X, Tiefe entlang Z, Vorderseite zeigt nach +Z.
 * 1 Feld = 1 Einheit.
 */
import * as THREE from 'three';
import { FURNITURE_BY_ITEM } from '../../data/furniture';
import { darken, lighten } from '../../style/palette';
import { mesh, toon } from '../materials';

const box = new THREE.BoxGeometry(1, 1, 1);
const cyl = new THREE.CylinderGeometry(1, 1, 1, 16);
const sphere = new THREE.SphereGeometry(1, 14, 10);
const cone = new THREE.ConeGeometry(1, 1, 12);

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

const WOOD = '#b98a5e';
const DARK_WOOD = '#6e4630';
const PAPER = '#fbf3e2';

export interface FurnitureModel {
  group: THREE.Group;
  /** leuchtende Teile (Lampen) */
  glow: THREE.MeshToonMaterial | null;
  /** Lichtpunkt für eine echte Lichtquelle (lokal) */
  lightAt: THREE.Vector3 | null;
  /** Sitz-/Liegehöhe */
  seatY: number;
}

/** Leuchtmaterial – wird abends hell */
function glowMat(color: string): THREE.MeshToonMaterial {
  return new THREE.MeshToonMaterial({ color, emissive: color, emissiveIntensity: 0.15 });
}

export function makeFurniture(itemId: string): FurnitureModel {
  const f = FURNITURE_BY_ITEM[itemId];
  const g = new THREE.Group();
  let glow: THREE.MeshToonMaterial | null = null;
  let lightAt: THREE.Vector3 | null = null;
  let seatY = 0;
  const col = f?.color ?? '#f7c6d4';
  switch (f?.def.id) {
    case 'futon': {
      // 1 breit × 2 tief
      g.add(b(0.86, 0.12, 1.8, '#f3ead8', 0, 0.06, 0));
      g.add(b(0.84, 0.08, 1.2, col, 0, 0.16, 0.28));
      g.add(s(0.32, 0.07, 0.16, '#ffffff', 0, 0.17, -0.65));
      for (let i = 0; i < 3; i++) g.add(b(0.85, 0.005, 0.04, lighten(col, 0.25), 0, 0.205, -0.1 + i * 0.4));
      seatY = 0.2;
      break;
    }
    case 'chabudai': {
      g.add(c(0.42, 0.05, WOOD, 0, 0.3, 0));
      g.add(c(0.4, 0.01, lighten(WOOD, 0.1), 0, 0.33, 0));
      for (const [x, z] of [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]]) g.add(b(0.05, 0.28, 0.05, DARK_WOOD, x, 0.14, z));
      break;
    }
    case 'kotatsu': {
      // Decke: etwas größer als die Tischplatte, fällt bis zum Boden
      g.add(b(1.78, 0.34, 1.78, col, 0, 0.17, 0));
      g.add(b(1.84, 0.06, 1.84, lighten(col, 0.15), 0, 0.03, 0));
      g.add(b(1.9, 0.05, 1.9, WOOD, 0, 0.4, 0));
      g.add(b(1.8, 0.012, 1.8, lighten(WOOD, 0.12), 0, 0.43, 0));
      break;
    }
    case 'zabuton': {
      const cushion = mesh(new THREE.BoxGeometry(1, 1, 1, 2, 1, 2), toon(col));
      cushion.scale.set(0.62, 0.09, 0.62);
      cushion.position.y = 0.045;
      g.add(cushion);
      g.add(s(0.05, 0.03, 0.05, darken(col, 0.2), 0, 0.095, 0));
      seatY = 0.1;
      break;
    }
    case 'andon': {
      for (const [x, z] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) g.add(b(0.04, 0.95, 0.04, DARK_WOOD, x, 0.47, z));
      glow = glowMat('#ffe9b8');
      g.add(b(0.34, 0.5, 0.34, glow, 0, 0.55, 0));
      for (const y of [0.3, 0.8]) g.add(b(0.4, 0.03, 0.4, DARK_WOOD, 0, y, 0));
      g.add(b(0.4, 0.04, 0.4, DARK_WOOD, 0, 0.94, 0));
      lightAt = new THREE.Vector3(0, 0.6, 0);
      break;
    }
    case 'tansu': {
      g.add(b(1.8, 0.78, 0.6, DARK_WOOD, 0, 0.39, 0));
      for (let row = 0; row < 3; row++) {
        for (let col2 = 0; col2 < 3; col2++) {
          const x = -0.58 + col2 * 0.58;
          const y = 0.15 + row * 0.24;
          g.add(b(0.52, 0.2, 0.02, lighten(DARK_WOOD, 0.08), x, y, 0.305));
          g.add(c(0.035, 0.02, '#c9a24a', x, y, 0.32).rotateX(Math.PI / 2));
        }
      }
      g.add(b(1.84, 0.03, 0.64, darken(DARK_WOOD, 0.15), 0, 0.795, 0));
      break;
    }
    case 'byobu': {
      const panels = 4;
      for (let i = 0; i < panels; i++) {
        const x = -0.75 + i * 0.5;
        const p = new THREE.Group();
        p.position.set(x, 0, 0);
        p.rotation.y = i % 2 ? 0.25 : -0.25;
        p.add(b(0.48, 1.3, 0.04, DARK_WOOD, 0, 0.7, 0));
        p.add(b(0.42, 1.18, 0.05, PAPER, 0, 0.7, 0));
        for (let k = 0; k < 3; k++) p.add(s(0.05, 0.05, 0.01, '#f4a3b8', -0.1 + ((k * 7 + i * 3) % 5) * 0.05, 0.5 + ((k * 3 + i) % 4) * 0.2, 0.03));
        p.add(b(0.3, 0.015, 0.01, '#8a6448', 0, 0.9 - i * 0.05, 0.03).rotateZ(0.5));
        g.add(p);
      }
      break;
    }
    case 'bambus': {
      g.add(c(0.2, 0.28, '#e0d5c0', 0, 0.14, 0));
      g.add(c(0.18, 0.02, '#6e4a36', 0, 0.28, 0));
      for (const [x, z, h] of [[-0.06, 0, 1.1], [0.06, 0.04, 0.9], [0, -0.06, 1.3]] as const) {
        g.add(c(0.025, h, '#8fbf5a', x, 0.28 + h / 2, z));
        for (let k = 1; k < 4; k++) g.add(c(0.03, 0.02, '#6fa04a', x, 0.28 + (h * k) / 4, z));
        const leaf = s(0.14, 0.02, 0.05, '#7cc06a', x + 0.1, 0.28 + h, z);
        leaf.rotation.z = -0.5;
        g.add(leaf);
      }
      break;
    }
    case 'tsukubai': {
      g.add(s(0.36, 0.22, 0.36, '#a9a6a0', 0, 0.16, 0));
      g.add(c(0.24, 0.02, '#7ab8d8', 0, 0.36, 0));
      const pipe = c(0.035, 0.5, '#9ec06a', 0.12, 0.6, -0.2);
      pipe.rotation.x = 0.9;
      g.add(pipe, c(0.04, 0.5, '#8fb05a', 0.12, 0.45, -0.32));
      for (let i = 0; i < 4; i++) g.add(s(0.07, 0.05, 0.07, '#8a8a84', Math.cos(i * 1.7) * 0.34, 0.03, Math.sin(i * 1.7) * 0.34));
      break;
    }
    case 'tatami-matte': {
      g.add(b(1.92, 0.03, 1.92, '#d9d49a', 0, 0.015, 0));
      g.add(b(1.94, 0.032, 0.06, '#5a5a3a', 0, 0.016, -0.94));
      g.add(b(1.94, 0.032, 0.06, '#5a5a3a', 0, 0.016, 0.94));
      g.add(b(0.04, 0.031, 1.9, '#c8c38a', 0, 0.016, 0));
      break;
    }
    case 'bonsai': {
      g.add(b(0.36, 0.1, 0.24, '#5b6fa8', 0, 0.05, 0));
      const trunk = c(0.03, 0.22, '#7a5038', 0, 0.2, 0);
      trunk.rotation.z = 0.3;
      g.add(trunk);
      for (const [x, y, r] of [[0.08, 0.34, 0.12], [-0.08, 0.3, 0.1], [0.02, 0.4, 0.09]] as const) g.add(s(r, r * 0.6, r, '#6fa86a', x, y, 0));
      break;
    }
    case 'teeservice': {
      g.add(b(0.4, 0.015, 0.28, DARK_WOOD, 0, 0.008, 0));
      g.add(s(0.09, 0.08, 0.09, '#7a9a8a', -0.07, 0.08, 0));
      g.add(c(0.025, 0.06, '#7a9a8a', 0.04, 0.1, 0).rotateZ(-1));
      g.add(b(0.08, 0.015, 0.015, '#6e4630', -0.07, 0.17, 0));
      for (const x of [0.1, 0.16]) g.add(c(0.035, 0.04, '#f3ead8', x, 0.035, 0.07));
      break;
    }
    case 'ikebana': {
      g.add(c(0.09, 0.18, '#3a3a44', 0, 0.09, 0));
      g.add(c(0.008, 0.4, '#5f9a4a', 0.02, 0.35, 0).rotateZ(0.2));
      g.add(c(0.008, 0.3, '#5f9a4a', -0.03, 0.3, 0).rotateZ(-0.3));
      g.add(s(0.05, 0.04, 0.05, '#f4a3b8', 0.06, 0.54, 0));
      g.add(s(0.04, 0.03, 0.04, '#f7f5ec', -0.08, 0.44, 0));
      break;
    }
    case 'winkekatze': {
      g.add(s(0.12, 0.13, 0.11, '#fbf6ec', 0, 0.13, 0));
      g.add(s(0.11, 0.1, 0.1, '#fbf6ec', 0, 0.3, 0));
      for (const x of [-0.07, 0.07]) g.add(c(0.035, 0.06, '#fbf6ec', x, 0.39, 0, cone));
      g.add(s(0.025, 0.05, 0.025, '#fbf6ec', 0.11, 0.36, 0.02));
      g.add(c(0.06, 0.012, '#d9534f', 0, 0.22, 0.02));
      g.add(c(0.025, 0.012, '#e8c547', 0, 0.2, 0.09).rotateX(Math.PI / 2));
      for (const x of [-0.04, 0.04]) g.add(s(0.012, 0.016, 0.01, '#2b2a31', x, 0.31, 0.095));
      break;
    }
    case 'kokeshi': {
      g.add(c(0.07, 0.22, '#d9534f', 0, 0.11, 0));
      for (const y of [0.06, 0.15]) g.add(c(0.072, 0.02, '#e8c547', 0, y, 0));
      g.add(s(0.09, 0.09, 0.09, '#fbe8d8', 0, 0.3, 0));
      g.add(s(0.092, 0.06, 0.092, '#2b2a31', 0, 0.34, -0.01));
      for (const x of [-0.03, 0.03]) g.add(s(0.008, 0.012, 0.005, '#2b2a31', x, 0.3, 0.085));
      break;
    }
    case 'regal': {
      for (const x of [-0.85, 0.85]) g.add(b(0.06, 0.95, 0.4, '#e6c59c', x, 0.475, 0));
      for (const y of [0.05, 0.45, 0.9]) g.add(b(1.76, 0.04, 0.4, '#e6c59c', 0, y, 0));
      g.add(b(1.76, 0.95, 0.02, '#d8b68c', 0, 0.475, -0.19));
      for (const [x, h, cc] of [[-0.6, 0.28, '#f4a3b8'], [-0.5, 0.25, '#8ac8ff'], [-0.42, 0.3, '#f3dc6a']] as const) g.add(b(0.07, h, 0.24, cc, x, 0.47 + h / 2, 0));
      break;
    }
    case 'stehlampe': {
      g.add(c(0.16, 0.03, '#5a4a52', 0, 0.015, 0));
      g.add(c(0.02, 1.1, '#5a4a52', 0, 0.56, 0));
      glow = glowMat('#fff1c8');
      const shade = mesh(new THREE.CylinderGeometry(0.14, 0.24, 0.26, 16, 1, true), glow);
      shade.position.y = 1.18;
      g.add(shade);
      lightAt = new THREE.Vector3(0, 1.1, 0);
      break;
    }
    case 'topfpflanze': {
      g.add(c(0.18, 0.3, '#e8a07a', 0, 0.15, 0));
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        const stem = c(0.012, 0.45, '#5f9a4a', Math.cos(a) * 0.08, 0.5, Math.sin(a) * 0.08);
        stem.rotation.set(Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4);
        g.add(stem);
        g.add(s(0.15, 0.02, 0.12, '#4f9a5a', Math.cos(a) * 0.25, 0.7 + (i % 3) * 0.1, Math.sin(a) * 0.25).rotateY(-a));
      }
      break;
    }
    default:
      g.add(b(0.6, 0.6, 0.6, col, 0, 0.3, 0));
  }
  g.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return { group: g, glow, lightAt, seatY };
}

/** Das feste Katalog-Pult in der Zimmerecke */
export function makeCatalogDesk(): THREE.Group {
  const g = new THREE.Group();
  g.add(b(0.7, 0.7, 0.5, WOOD, 0, 0.35, 0));
  const top = b(0.75, 0.04, 0.55, lighten(WOOD, 0.1), 0, 0.72, 0);
  top.rotation.x = 0.2;
  g.add(top);
  const book = b(0.4, 0.04, 0.3, '#f4a3b8', 0, 0.76, 0.02);
  book.rotation.x = 0.2;
  g.add(book, b(0.02, 0.045, 0.3, '#ffffff', 0, 0.765, 0.02).rotateX(0.2));
  g.traverse((o) => (o.castShadow = true));
  return g;
}

/** Vorschaubilder der Möbel als Daten-URLs (einmalig mit eigenem kleinen Renderer) */
export function renderFurnitureThumbnails(ids: readonly string[], size = 128): Record<string, string> {
  const out: Record<string, string> = {};
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  } catch {
    return out;
  }
  renderer.setSize(size, size, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight('#ffffff', '#d9c8b8', 1.8));
  const sun = new THREE.DirectionalLight('#fff4e0', 1.6);
  sun.position.set(2, 4, 3);
  scene.add(sun);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 50);
  for (const id of ids) {
    const m = makeFurniture(id);
    if (m.glow) m.glow.emissiveIntensity = 0.5;
    scene.add(m.group);
    const bbox = new THREE.Box3().setFromObject(m.group);
    const center = bbox.getCenter(new THREE.Vector3());
    const radius = bbox.getSize(new THREE.Vector3()).length() / 2;
    const dist = radius / Math.sin((30 * Math.PI) / 360) * 1.05;
    camera.position.set(center.x + dist * 0.5, center.y + dist * 0.62, center.z + dist * 0.6);
    camera.lookAt(center);
    renderer.render(scene, camera);
    out[id] = renderer.domElement.toDataURL('image/png');
    scene.remove(m.group);
  }
  renderer.dispose();
  return out;
}
