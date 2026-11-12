/**
 * Möbelmodelle aus Grundformen. Ursprung = Mitte der Grundfläche auf dem
 * Boden, Breite entlang X, Tiefe entlang Z, Vorderseite zeigt nach +Z.
 * 1 Feld = 1 Einheit.
 */
import * as THREE from 'three';
import { FURNITURE_BY_ITEM } from '../../data/furniture';
import { ART_BY_ID } from '../../data/art';
import { artCanvas } from '../../gfx/art';
import { POSTER_BY_ID } from '../../data/posters';
import { bouquetOfVase, WREATH_BY_ID } from '../../data/straeusse';
import { SAMMLUNG_BY_ID } from '../../data/sammlungen';
import { FINDS } from '../../data/fossils';
import { FISH, INSECTS } from '../../data/species';
import { TASSE_BY_ID } from '../../data/tassen';
import { posterCanvas } from '../../gfx/posters';
import { darken, lighten } from '../../style/palette';
import { mesh, toon } from '../materials';
import type { Season } from '../../core/time';

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
/** Wand-Deko: Höhe der Bildmitte und Lage der Wand (Rückseite des Feldes) */
const HANG = 1.3;
const WALL_Z = -0.48;
const DARK_WOOD = '#6e4630';
const PAPER = '#fbf3e2';

/** Jahreszeit für Modelle, die sich ändern (Schneemann taut außerhalb des Winters) */
let modelSeason: Season = 'sommer';
export function setModelSeason(season: Season) {
  modelSeason = season;
}

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

/** Zaun-Verbindungen zu den Nachbarfeldern (Garten) */
export interface FenceLinks {
  n: boolean;
  e: boolean;
  s: boolean;
  w: boolean;
}

/** Zaunfeld: Pfosten + Latten/Äste zu den verbundenen Nachbarn (je halbe Länge) */
function addFence(g: THREE.Group, kind: string, links: FenceLinks) {
  const white = kind === 'zaun-weiss' || kind === 'gartentor';
  const col = white ? '#f7f5ec' : '#8a5a3a';
  const dirs: Array<[boolean, number]> = [[links.e, 0], [links.s, Math.PI / 2], [links.w, Math.PI], [links.n, -Math.PI / 2]];
  if (kind !== 'gartentor') {
    if (white) {
      g.add(b(0.1, 0.62, 0.1, col, 0, 0.31, 0));
      const tip = c(0.072, 0.08, col, 0, 0.66, 0, cone);
      tip.rotation.y = Math.PI / 4;
      g.add(tip);
    } else {
      g.add(c(0.05, 0.62, col, 0, 0.31, 0));
      g.add(c(0.055, 0.03, '#d9b77a', 0, 0.5, 0));
    }
  }
  for (const [on, ang] of dirs) {
    if (!on) continue;
    const arm = new THREE.Group();
    arm.rotation.y = -ang;
    for (const y of [0.22, 0.46]) {
      if (white) arm.add(b(0.5, 0.06, 0.035, col, 0.25, y, 0));
      else {
        const rail = c(0.025, 0.5, col, 0.25, y, 0);
        rail.rotation.z = Math.PI / 2;
        arm.add(rail);
      }
    }
    // Zwischenlatte (weißer Zaun)
    if (white) arm.add(b(0.07, 0.52, 0.03, col, 0.28, 0.28, 0.02));
    g.add(arm);
  }
}

/** Bücher, Pflanze & Vase auf einem Brett des Hellerau-Regals (gleiche Anordnung für gleiche Bretter) */
function shelfDecor(g: THREE.Group, x0: number, x1: number, y: number, z: number, seed: number) {
  const palette = ['#f4a3b8', '#5b6fa8', '#f7d26a', '#9ad8c0', '#e85a8a', '#c9955f', '#f1efe9'];
  const width = x1 - x0;
  let x = x0 + 0.05;
  const kind = seed % 3;
  if (kind === 0) {
    // Bücherreihe
    for (let i = 0; x < x0 + width * 0.6; i++) {
      const bw = 0.035 + ((seed + i) % 3) * 0.01;
      const bh = 0.15 + ((seed + i * 2) % 3) * 0.03;
      g.add(b(bw, bh, 0.14, palette[(seed + i) % palette.length], x + bw / 2, y + bh / 2, z));
      x += bw + 0.004;
    }
    g.add(c(0.04, 0.07, '#d98a5f', x1 - 0.1, y + 0.035, z));
    g.add(s(0.06, 0.06, 0.06, '#6fb06a', x1 - 0.1, y + 0.11, z));
  } else if (kind === 1) {
    // liegender Stapel und eine Vase
    for (let i = 0; i < 3; i++) g.add(b(0.2 - i * 0.015, 0.03, 0.15, palette[(seed + i * 2) % palette.length], x0 + 0.18, y + 0.015 + i * 0.03, z));
    g.add(c(0.035, 0.12, '#f1efe9', x1 - 0.12, y + 0.06, z));
    g.add(s(0.03, 0.04, 0.03, '#f7a8b8', x1 - 0.12, y + 0.15, z));
  } else {
    // Körbchen und Kerze
    g.add(c(0.07, 0.08, '#c9955f', x0 + 0.15, y + 0.04, z));
    g.add(c(0.025, 0.09, '#fbf3e2', x1 - 0.12, y + 0.045, z));
    g.add(s(0.01, 0.018, 0.01, '#ffd76a', x1 - 0.12, y + 0.105, z));
  }
}

/**
 * Hellerau-Regal: Leitern (zwei Holme mit Sprossen) mit Brettern dazwischen. `n` Regalfelder nebeneinander;
 * `floor` = steht auf dem Boden (Seiten statt Wandleitern).
 */
function hellerauShelf(g: THREE.Group, col: string, n: number, opts: { floor?: boolean; cabinet?: boolean; seed: number }) {
  const dark = darken(col, 0.14);
  const pitch = 0.9;
  if (opts.floor) {
    const top = 1.46;
    for (const sx of [-1, 1]) {
      const x = sx * 0.43;
      for (const sz of [-1, 1]) g.add(b(0.025, top, 0.025, dark, x, top / 2, sz * 0.12));
      for (let y = 0.1; y < top; y += 0.18) g.add(b(0.02, 0.014, 0.25, dark, x, y, 0));
    }
    const ys = [0.06, 0.5, 0.95, top - 0.011];
    for (const y of ys) g.add(b(0.86, 0.022, 0.28, col, 0, y, 0));
    ys.slice(0, 3).forEach((y, i) => shelfDecor(g, -0.4, 0.4, y + 0.011, 0, opts.seed + i));
    return;
  }
  const y0 = 0.95;
  const y1 = 1.75;
  const z = WALL_Z;
  for (let i = 0; i <= n; i++) {
    const cx = (i - n / 2) * pitch;
    for (const dx of [-0.022, 0.022]) g.add(b(0.016, y1 - y0, 0.02, dark, cx + dx, (y0 + y1) / 2, z + 0.012));
    for (let y = y0 + 0.06; y < y1; y += 0.11) g.add(b(0.06, 0.012, 0.012, dark, cx, y, z + 0.012));
  }
  const ys = [1.02, 1.36, 1.7];
  for (let m = 0; m < n; m++) {
    const cx = (m + 0.5 - n / 2) * pitch;
    for (const y of ys) g.add(b(pitch - 0.07, 0.022, 0.2, col, cx, y, z + 0.11));
    ys.slice(0, 2).forEach((y, i) => {
      if (opts.cabinet && m === 0 && i === 0) {
        // Schränkchen mit Tür und Knauf
        g.add(b(pitch - 0.1, 0.3, 0.2, col, cx, y + 0.17, z + 0.11));
        g.add(b(pitch - 0.16, 0.24, 0.012, lighten(col, 0.08), cx, y + 0.17, z + 0.22));
        g.add(s(0.012, 0.012, 0.012, '#d9b45a', cx + 0.28, y + 0.17, z + 0.232));
      } else shelfDecor(g, cx - pitch / 2 + 0.05, cx + pitch / 2 - 0.05, y + 0.011, z + 0.11, opts.seed + m * 2 + i);
    });
  }
}

const NOTHING: ReadonlySet<string> = new Set();

/**
 * Schaukasten für Linas Sammlung: jede Art hat ihren festen Platz. Gefangenes/Gefundenes (`collected`) steckt
 * als kleines Präparat darin, der Rest ist ein leerer Platz mit Punkt. Raster `cols` × `rows`, Mitte bei (0, HANG).
 */
function specimenGrid(g: THREE.Group, ids: readonly string[], collected: ReadonlySet<string>, cols: number, rows: number, cell: [number, number], draw: (id: string, x: number, y: number, z: number) => THREE.Object3D, y0 = HANG, z = WALL_Z + 0.075) {
  ids.forEach((id, i) => {
    const x = ((i % cols) - (cols - 1) / 2) * cell[0];
    const y = y0 + ((rows - 1) / 2 - Math.floor(i / cols)) * cell[1];
    if (collected.has(id)) g.add(draw(id, x, y, z));
    else g.add(b(0.03, 0.03, 0.006, '#d6c5a4', x, y, z + 0.004));
  });
}

function insectSpecimen(id: string, x: number, y: number, z: number): THREE.Object3D {
  const def = INSECTS.find((i) => i.id === id);
  const grp = new THREE.Group();
  grp.position.set(x, y, z);
  if (!def) return grp;
  const wings = def.shape === 'falter' || def.shape === 'nachtfalter';
  if (wings) {
    for (const sx of [-1, 1]) grp.add(s(0.055, 0.045, 0.006, def.accent, sx * 0.055, 0.01, 0.0).rotateZ(sx * -0.3));
    for (const sx of [-1, 1]) grp.add(s(0.04, 0.035, 0.006, def.color, sx * 0.045, -0.025, 0.004));
    grp.add(s(0.012, 0.04, 0.012, '#3a3034', 0, -0.005, 0.01));
  } else if (def.shape === 'libelle' || def.shape === 'biene') {
    for (const sx of [-1, 1]) grp.add(s(0.05, 0.016, 0.004, '#dff0ff', sx * 0.04, 0.02, 0.004));
    grp.add(s(0.014, 0.055, 0.014, def.color, 0, -0.005, 0.01));
    grp.add(s(0.014, 0.012, 0.014, def.accent, 0, 0.055, 0.01));
  } else {
    const long = def.shape === 'heuschrecke' || def.shape === 'ameise' || def.shape === 'wasserlaeufer';
    grp.add(s(long ? 0.03 : 0.05, long ? 0.05 : 0.05, 0.022, def.color, 0, 0, 0.01));
    grp.add(s(long ? 0.012 : 0.02, 0.014, 0.014, def.accent, 0, long ? 0.05 : 0.05, 0.012));
    if (def.shape === 'kaefer') grp.add(b(0.004, 0.09, 0.004, darken(def.color, 0.4), 0, 0, 0.034));
  }
  grp.add(c(0.004, 0.02, '#8a8a96', 0, -0.055, 0.0));
  return grp;
}

function fishSpecimen(id: string, x: number, y: number, z: number): THREE.Object3D {
  const def = FISH.find((i) => i.id === id);
  const grp = new THREE.Group();
  grp.position.set(x, y, z);
  if (!def) return grp;
  const len = 0.04 + def.size * 0.008;
  grp.add(s(len, 0.026, 0.012, def.color, 0, 0, 0.01));
  const tail = c(0.026, 0.05, def.accent, len + 0.015, 0, 0.01, cone);
  tail.rotation.z = Math.PI / 2;
  grp.add(tail);
  grp.add(s(0.006, 0.006, 0.006, '#2f2f38', -len * 0.6, 0.006, 0.022));
  return grp;
}

function findSpecimen(id: string, x: number, y: number, z: number): THREE.Object3D {
  const def = FINDS.find((i) => i.id === id);
  const grp = new THREE.Group();
  grp.position.set(x, y, z);
  if (!def) return grp;
  if (def.kind === 'fossil') {
    const d = c(0.045, 0.02, def.color, 0, 0, 0);
    d.rotation.x = Math.PI / 2;
    grp.add(d);
    const ring = mesh(new THREE.TorusGeometry(0.022, 0.006, 6, 14), toon(def.accent));
    ring.position.z = 0.012;
    grp.add(ring);
  } else {
    grp.add(c(0.03, 0.08, def.color, 0, 0.03, 0, cone));
    grp.add(s(0.032, 0.026, 0.03, def.accent, 0, 0.0, 0));
  }
  return grp;
}

export function makeFurniture(itemId: string, links: FenceLinks = { n: false, e: true, s: false, w: true }, collected: ReadonlySet<string> = NOTHING): FurnitureModel {
  const f = FURNITURE_BY_ITEM[itemId];
  const g = new THREE.Group();
  let glow: THREE.MeshToonMaterial | null = null;
  let lightAt: THREE.Vector3 | null = null;
  let seatY = 0;
  const col = f?.color ?? '#f7c6d4';
  const art = f ? ART_BY_ID[f.def.id] : undefined;
  if (art) {
    // Bild auf Staffelei
    for (const dx of [-0.18, 0.18]) {
      const leg = b(0.04, 1.15, 0.04, '#8a5a3a', dx, 0.56, -0.04);
      leg.rotation.z = -dx * 0.35;
      g.add(leg);
    }
    const back = b(0.04, 1.05, 0.04, '#8a5a3a', 0, 0.5, -0.2);
    back.rotation.x = -0.35;
    g.add(back);
    g.add(b(0.6, 0.04, 0.12, '#8a5a3a', 0, 0.52, 0.08));
    const frame = new THREE.Group();
    frame.position.set(0, 0.8, 0.08);
    frame.rotation.x = -0.12;
    frame.add(b(0.64, 0.52, 0.04, '#d9b45a'));
    const tex = new THREE.CanvasTexture(artCanvas(art, 160, 128));
    tex.colorSpace = THREE.SRGBColorSpace;
    const canvasMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.44), new THREE.MeshToonMaterial({ map: tex }));
    canvasMesh.position.z = 0.022;
    frame.add(canvasMesh);
    g.add(frame);
    g.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = true;
    });
    return { group: g, glow, lightAt, seatY };
  }
  const tasse = f ? TASSE_BY_ID[f.def.id] : undefined;
  if (tasse) {
    // Becher mit Henkel, Bandfarbe, Lippenrand und dem Bohne-Stern-Emblem (ausgedacht) auf der Vorderseite
    const body = c(0.045, 0.085, tasse.color, 0, 0.0425, 0);
    g.add(body);
    g.add(c(0.0465, 0.014, tasse.accent, 0, 0.065, 0));
    g.add(c(0.0455, 0.006, lighten(tasse.color, 0.25), 0, 0.087, 0));
    g.add(c(0.039, 0.004, '#4a2a1c', 0, 0.0895, 0));
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.007, 6, 12, Math.PI), toon(tasse.color));
    handle.position.set(0.045, 0.045, 0);
    handle.rotation.z = -Math.PI / 2;
    g.add(handle);
    const emblem = c(0.016, 0.004, tasse.accent, 0, 0.04, 0.0445);
    emblem.rotation.x = Math.PI / 2;
    g.add(emblem);
    g.add(s(0.006, 0.006, 0.003, tasse.color, 0, 0.04, 0.0475));
    g.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return { group: g, glow, lightAt, seatY };
  }
  // Urkunde (`urkunde-…`): Rahmen in der Farbe der Sammlung, Pergament, Schleife & Siegel
  if (f && f.def.id.startsWith('urkunde-')) {
    const z = WALL_Z;
    const frameCol = SAMMLUNG_BY_ID[f.def.id.slice(8)]?.color ?? '#c9955f';
    g.add(b(0.62, 0.48, 0.04, frameCol, 0, HANG, z + 0.02));
    g.add(b(0.54, 0.4, 0.01, '#fbf3dc', 0, HANG, z + 0.045));
    g.add(b(0.34, 0.03, 0.004, '#4a3a30', 0, HANG + 0.1, z + 0.052));
    for (const [w, y] of [[0.42, 0.03], [0.38, -0.02], [0.3, -0.07]] as const) g.add(b(w, 0.014, 0.004, '#8a7a6a', 0, HANG + y, z + 0.052));
    g.add(c(0.045, 0.01, '#d9534f', 0.17, HANG - 0.13, z + 0.056).rotateX(Math.PI / 2));
    for (const x of [0.15, 0.19]) g.add(b(0.025, 0.07, 0.004, '#d9534f', x, HANG - 0.18, z + 0.054));
    return { group: g, glow, lightAt, seatY };
  }
  // Vase mit Strauß (`vase-strauss-…`): Glasvase, Stiele, Blüten in den Farben des Straußes
  const bouquet = f ? bouquetOfVase(f.def.id) : undefined;
  if (bouquet) {
    const green = '#5fa85a';
    const glass = new THREE.MeshToonMaterial({ color: '#cfe8f4', transparent: true, opacity: 0.55 });
    g.add(c(0.075, 0.2, glass, 0, 0.1, 0));
    g.add(c(0.062, 0.14, '#9fd0ea', 0, 0.075, 0));
    g.add(c(0.085, 0.015, glass, 0, 0.2, 0));
    const n = bouquet.colors.length >= 3 ? 9 : 7;
    for (let i = 0; i < n; i++) {
      const a = i * 2.4;
      const r = i === 0 ? 0 : 0.045 + (i % 3) * 0.015;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const top = 0.3 + (i % 3) * 0.04 + (i === 0 ? 0.05 : 0);
      const stem = c(0.006, top - 0.1, green, x * 0.5, 0.1 + (top - 0.1) / 2, z * 0.5);
      stem.rotation.z = -x * 2.5;
      stem.rotation.x = z * 2.5;
      g.add(stem);
      const col = bouquet.colors[i % bouquet.colors.length];
      const herb = bouquet.id === 'strauss-kraeuter';
      g.add(s(herb ? 0.04 : 0.032, herb ? 0.025 : 0.032, herb ? 0.04 : 0.032, col, x, top, z));
      if (!herb) g.add(s(0.012, 0.012, 0.012, i % 2 ? '#f7d26a' : lighten(col, 0.3), x, top + 0.022, z));
    }
    g.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = true;
    });
    return { group: g, glow, lightAt, seatY };
  }
  // Wandkranz (`kranz-…`): Ring aus Zweigen mit Blüten und Schleife
  const wreath = f ? WREATH_BY_ID[f.def.id] : undefined;
  if (wreath) {
    const z = WALL_Z + 0.03;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.04, 8, 24), toon('#6a8a4a'));
    ring.position.set(0, HANG, z);
    g.add(ring);
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2 + 0.2;
      g.add(s(0.05, 0.05, 0.03, i % 2 ? '#4f9a5a' : '#6fbf5f', Math.cos(a) * 0.22, HANG + Math.sin(a) * 0.22, z + 0.02));
    }
    for (let i = 0; i < 11; i++) {
      const a = (i / 11) * Math.PI * 2 + 0.5;
      const col = wreath.colors[i % wreath.colors.length];
      g.add(s(0.034, 0.034, 0.02, col, Math.cos(a) * 0.22, HANG + Math.sin(a) * 0.22, z + 0.055));
      g.add(s(0.012, 0.012, 0.012, '#f7d26a', Math.cos(a) * 0.22, HANG + Math.sin(a) * 0.22, z + 0.07));
    }
    for (const sx of [-1, 1]) {
      const bow = b(0.08, 0.04, 0.012, '#f4a3b8', sx * 0.045, HANG - 0.23, z + 0.075);
      bow.rotation.z = sx * -0.5;
      g.add(bow);
    }
    g.add(s(0.025, 0.025, 0.015, '#e87a98', 0, HANG - 0.23, z + 0.08));
    g.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = true;
    });
    return { group: g, glow, lightAt, seatY };
  }
  const poster = f ? POSTER_BY_ID[f.def.id] : undefined;
  if (poster) {
    const tex = new THREE.CanvasTexture(posterCanvas(poster, 200, 280));
    tex.colorSpace = THREE.SRGBColorSpace;
    const pmat = new THREE.MeshToonMaterial({ map: tex });
    if (poster.kind === 'poster') {
      // an der Wand: dünner schwarzer Rahmen, Bild, zwei Klebestreifen
      const z = WALL_Z;
      g.add(b(0.5, 0.7, 0.02, '#26242a', 0, HANG, z));
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.66), pmat);
      plane.position.set(0, HANG, z + 0.012);
      g.add(plane);
      for (const x of [-0.17, 0.17]) g.add(b(0.07, 0.025, 0.004, '#f2e8c8', x, HANG + 0.34, z + 0.014));
    } else {
      // Bildband auf dem Tisch: ein bis drei Bände übereinander, das oberste mit dem Cover nach oben
      const n = 1 + (poster.id.length % 3);
      const colors = [poster.colors[0], poster.colors[1], '#2a2a30'];
      let y = 0;
      for (let i = 0; i < n; i++) {
        const last = i === n - 1;
        const h = 0.04 + (i % 2) * 0.015;
        const book = b(0.22 - i * 0.012, h, 0.3 - i * 0.016, last ? '#f4efe4' : colors[i % 3], 0.01 * (i % 2 ? 1 : -1), y + h / 2, 0);
        book.rotation.y = (i % 2 ? 0.08 : -0.05) * (i + 1);
        g.add(book);
        if (last) {
          // Seiten (hell) und Cover oben
          g.add(b(0.2 - i * 0.012, h * 0.55, 0.28 - i * 0.016, '#fbf6ec', 0.01 * (i % 2 ? 1 : -1), y + h / 2, 0.012).rotateY(book.rotation.y));
          const cover = new THREE.Mesh(new THREE.PlaneGeometry(0.2 - i * 0.012, 0.28 - i * 0.016), pmat);
          cover.rotation.x = -Math.PI / 2;
          cover.rotation.z = book.rotation.y;
          cover.position.set(0.01 * (i % 2 ? 1 : -1), y + h + 0.001, 0);
          g.add(cover);
        }
        y += h;
      }
    }
    g.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return { group: g, glow, lightAt, seatY };
  }
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
      for (const x of [-0.85, 0.85]) g.add(b(0.06, 0.95, 0.4, col, x, 0.475, 0));
      for (const y of [0.05, 0.45, 0.9]) g.add(b(1.76, 0.04, 0.4, col, 0, y, 0));
      g.add(b(1.76, 0.95, 0.02, darken(col, 0.06), 0, 0.475, -0.19));
      for (const [x, h, cc] of [[-0.6, 0.28, '#f4a3b8'], [-0.5, 0.25, '#8ac8ff'], [-0.42, 0.3, '#f3dc6a']] as const) g.add(b(0.07, h, 0.24, cc, x, 0.47 + h / 2, 0));
      break;
    }
    case 'stehlampe': {
      g.add(c(0.16, 0.03, col, 0, 0.015, 0));
      g.add(c(0.02, 1.1, col, 0, 0.56, 0));
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
    // ---- Olis Sachen ----
    case 'schreibtisch-pc': {
      g.add(b(1.8, 0.05, 0.62, '#3a3a44', 0, 0.72, -0.05));
      for (const x of [-0.85, 0.85]) g.add(b(0.06, 0.72, 0.56, '#2b2a31', x, 0.36, -0.05));
      // zwei Bildschirme
      for (const [x, ry] of [[-0.35, 0.18], [0.35, -0.18]] as const) {
        const scr = new THREE.Group();
        scr.position.set(x, 0.75, -0.25);
        scr.rotation.y = ry;
        scr.add(b(0.06, 0.2, 0.06, '#2b2a31', 0, 0.1, 0));
        scr.add(b(0.6, 0.36, 0.04, '#2b2a31', 0, 0.38, 0));
        const screen = new THREE.MeshToonMaterial({ color: '#2a3a5a', emissive: '#4a8ad8', emissiveIntensity: 0.6 });
        scr.add(b(0.54, 0.3, 0.01, screen, 0, 0.38, 0.022));
        // Code-Zeilen
        for (let i = 0; i < 5; i++) scr.add(b(0.12 + ((i * 7) % 5) * 0.06, 0.018, 0.005, i % 2 ? '#7ad8a0' : '#f4a3b8', -0.18 + ((i * 7) % 5) * 0.03, 0.48 - i * 0.05, 0.03));
        g.add(scr);
      }
      // leuchtende Tastatur & Maus
      g.add(b(0.5, 0.025, 0.16, new THREE.MeshToonMaterial({ color: '#3a3a44', emissive: '#c87af0', emissiveIntensity: 0.5 }), 0, 0.76, 0.1));
      g.add(s(0.04, 0.02, 0.055, '#3a3a44', 0.38, 0.76, 0.1));
      // Kaffeetasse
      g.add(c(0.04, 0.08, '#f7f5ec', -0.65, 0.79, 0.08));
      // Bürostuhl davor (Oli sitzt hier beim Programmieren)
      g.add(c(0.2, 0.06, '#2b2a31', 0, 0.42, 0.66));
      g.add(b(0.34, 0.34, 0.05, '#2b2a31', 0, 0.66, 0.84));
      g.add(c(0.03, 0.4, '#8a8a96', 0, 0.2, 0.66));
      g.add(c(0.2, 0.03, '#2b2a31', 0, 0.02, 0.66));
      // Tower unterm Tisch
      g.add(b(0.22, 0.48, 0.48, '#2b2a31', 0.62, 0.24, -0.05));
      g.add(b(0.01, 0.4, 0.02, new THREE.MeshToonMaterial({ color: '#c87af0', emissive: '#c87af0', emissiveIntensity: 0.8 }), 0.51, 0.26, 0.18));
      break;
    }
    case 'hantelbank': {
      g.add(b(1.1, 0.08, 0.3, '#2b2a31', 0.1, 0.42, 0));
      for (const x of [-0.35, 0.5]) g.add(b(0.06, 0.4, 0.06, '#8a8a96', x, 0.2, 0));
      g.add(b(0.3, 0.04, 0.5, '#8a8a96', -0.35, 0.02, 0));
      g.add(b(0.3, 0.04, 0.5, '#8a8a96', 0.5, 0.02, 0));
      // Ablage + Langhantel (über der Brust, bewegt sich mit Olis Armen: Gruppe „langhantel“)
      for (const z of [-0.22, 0.22]) g.add(b(0.05, 0.85, 0.05, '#8a8a96', 0, 0.43, z));
      const bell = new THREE.Group();
      bell.name = 'langhantel';
      bell.position.set(0, 0.86, 0);
      const bar = c(0.018, 0.92, '#c9cbd3', 0, 0, 0);
      bar.rotation.x = Math.PI / 2;
      bell.add(bar);
      for (const z of [-0.4, 0.4]) {
        const plate = c(0.2, 0.05, '#2b2a31', 0, 0, z);
        plate.rotation.x = Math.PI / 2;
        bell.add(plate);
        const plate2 = c(0.15, 0.04, '#d9534f', 0, 0, z * 1.1);
        plate2.rotation.x = Math.PI / 2;
        bell.add(plate2);
      }
      // Zusatzscheiben für Linas Satz (sonst unsichtbar): richtig viel Gewicht
      const extra = new THREE.Group();
      extra.name = 'extraplatten';
      extra.visible = false;
      // sechs Scheiben je Seite, von außen nach innen – `userData.stufe` = ab welchem Gewichtsschritt sichtbar
      for (const side of [-1, 1]) {
        for (let i = 0; i < 6; i++) {
          const pl = c(0.23 - i * 0.008, 0.04, i % 2 ? '#d9534f' : '#2b2a31', 0, 0, side * (0.36 - i * 0.045));
          pl.rotation.x = Math.PI / 2;
          pl.userData.stufe = i + 1;
          extra.add(pl);
        }
      }
      bell.add(extra);
      g.add(bell);
      // Kurzhanteln am Boden
      for (const z of [-0.15, 0.1]) {
        g.add(c(0.012, 0.18, '#8a8a96', 0.75, 0.05, z).rotateZ(Math.PI / 2));
        for (const x of [0.67, 0.83]) g.add(c(0.045, 0.04, '#2b2a31', x, 0.05, z).rotateZ(Math.PI / 2));
      }
      seatY = 0.46;
      break;
    }
    case 'kaffeemaschine': {
      g.add(b(0.26, 0.04, 0.22, '#3a3a44', 0, 0.02, 0));
      g.add(b(0.26, 0.3, 0.12, '#c9cbd3', 0, 0.17, -0.05));
      g.add(b(0.24, 0.06, 0.2, '#c9cbd3', 0, 0.32, 0));
      g.add(c(0.035, 0.03, '#2b2a31', 0, 0.26, 0.06));
      g.add(b(0.12, 0.02, 0.02, '#2b2a31', 0, 0.26, 0.1));
      g.add(c(0.035, 0.05, '#f7f5ec', 0, 0.065, 0.04));
      g.add(s(0.012, 0.012, 0.012, '#e8484f', 0.09, 0.22, 0.015));
      break;
    }
    case 'espresso-einsteiger': {
      // klein, rot, einfach: Wassertank hinten, Brühgruppe, Siebträger, eine Tasse
      g.add(b(0.24, 0.03, 0.2, '#3a3a44', 0, 0.015, 0));
      g.add(b(0.22, 0.26, 0.11, '#d8343c', 0, 0.16, -0.045));
      g.add(b(0.22, 0.05, 0.19, '#d8343c', 0, 0.3, -0.01));
      g.add(b(0.1, 0.12, 0.05, new THREE.MeshToonMaterial({ color: '#cfe8f4', transparent: true, opacity: 0.7 }), 0.06, 0.17, -0.12));
      g.add(c(0.035, 0.03, '#c9cbd3', 0, 0.255, 0.05));
      g.add(c(0.03, 0.02, '#2b2a31', 0, 0.235, 0.05));
      g.add(b(0.016, 0.016, 0.1, '#2b2a31', 0, 0.235, 0.12));
      g.add(c(0.035, 0.05, '#f7f5ec', 0, 0.055, 0.06));
      g.add(s(0.012, 0.012, 0.012, '#7ad98a', 0.08, 0.22, 0.015));
      break;
    }
    case 'espresso-profi': {
      // Edelstahl, zwei Manometer, Dampflanze, daneben eine Mühle mit Bohnenbehälter
      const steel = '#c9cbd3';
      g.add(b(0.4, 0.03, 0.26, '#2b2a31', 0, 0.015, 0));
      g.add(b(0.24, 0.3, 0.2, steel, -0.06, 0.18, -0.02));
      g.add(b(0.25, 0.04, 0.21, darken(steel, 0.1), -0.06, 0.35, -0.02));
      // Tassenwärmer-Reling
      for (const x of [-0.14, 0.02]) g.add(c(0.006, 0.05, '#8a8a92', x, 0.39, -0.02));
      g.add(b(0.18, 0.008, 0.01, '#8a8a92', -0.06, 0.415, -0.02));
      // Manometer
      for (const x of [-0.12, -0.02]) {
        g.add(c(0.03, 0.01, '#f7f5ec', x, 0.28, 0.085).rotateX(Math.PI / 2));
        g.add(b(0.003, 0.025, 0.004, '#d8343c', x, 0.285, 0.092));
      }
      // Brühgruppe, Siebträger, Tasse
      g.add(c(0.04, 0.035, '#8a8a92', -0.06, 0.205, 0.085));
      g.add(c(0.035, 0.025, '#2b2a31', -0.06, 0.185, 0.085));
      g.add(b(0.016, 0.016, 0.11, '#2b2a31', -0.06, 0.185, 0.15));
      g.add(c(0.035, 0.05, '#f7f5ec', -0.06, 0.065, 0.09));
      // Dampflanze
      g.add(c(0.007, 0.14, '#8a8a92', 0.07, 0.17, 0.05));
      g.add(c(0.01, 0.03, '#2b2a31', 0.07, 0.25, 0.05));
      // Mühle
      g.add(b(0.1, 0.22, 0.12, '#2b2a31', 0.14, 0.14, -0.02));
      g.add(c(0.05, 0.1, new THREE.MeshToonMaterial({ color: '#6e4630', transparent: true, opacity: 0.85 }), 0.14, 0.31, -0.02, cone));
      g.add(c(0.012, 0.03, steel, 0.14, 0.085, 0.045));
      g.add(s(0.012, 0.012, 0.012, '#7ad98a', 0.17, 0.2, 0.045));
      break;
    }
    case 'espresso-hebel': {
      // Messing & Kupfer: liegender Kessel, Handhebel mit Holzkugel, Adler obendrauf
      const brass = '#c79a3d';
      const copper = '#b87a4a';
      g.add(b(0.34, 0.03, 0.24, '#5a3a22', 0, 0.015, 0));
      g.add(b(0.28, 0.14, 0.2, brass, 0, 0.1, -0.01));
      const boiler = c(0.085, 0.3, copper, 0, 0.27, -0.01);
      boiler.rotation.z = Math.PI / 2;
      g.add(boiler);
      for (const x of [-0.15, 0.15]) g.add(s(0.09, 0.09, 0.09, copper, x, 0.27, -0.01));
      g.add(b(0.28, 0.025, 0.2, brass, 0, 0.19, -0.01));
      // Manometer vorn
      g.add(c(0.035, 0.012, '#f7f5ec', -0.07, 0.27, 0.085).rotateX(Math.PI / 2));
      g.add(c(0.04, 0.008, brass, -0.07, 0.27, 0.08).rotateX(Math.PI / 2));
      // Brühgruppe & Siebträger mit Holzgriff
      g.add(c(0.045, 0.05, brass, 0.06, 0.2, 0.09));
      g.add(c(0.035, 0.025, '#2b2a31', 0.06, 0.165, 0.09));
      g.add(b(0.016, 0.016, 0.11, '#6e4630', 0.06, 0.165, 0.155));
      g.add(c(0.035, 0.05, '#f7f5ec', 0.06, 0.065, 0.1));
      // Handhebel
      const lever = b(0.014, 0.17, 0.014, brass, 0.06, 0.32, 0.095);
      lever.rotation.z = -0.35;
      g.add(lever);
      g.add(s(0.025, 0.025, 0.025, '#6e4630', 0.1, 0.4, 0.095));
      // Adler
      g.add(s(0.025, 0.03, 0.02, brass, -0.02, 0.385, -0.01));
      for (const sx of [-1, 1]) {
        const wing = s(0.04, 0.012, 0.015, brass, -0.02 + sx * 0.04, 0.395, -0.01);
        wing.rotation.z = sx * 0.4;
        g.add(wing);
      }
      g.add(s(0.012, 0.012, 0.012, brass, -0.02, 0.425, -0.005));
      // Tropfgitter
      g.add(b(0.18, 0.008, 0.07, '#8a8a92', 0.02, 0.045, 0.1));
      break;
    }
    case 'glasvase': {
      // schlichte Glasvase mit etwas Wasser
      const glass = new THREE.MeshToonMaterial({ color: '#cfe8f4', transparent: true, opacity: 0.55 });
      g.add(c(0.075, 0.2, glass, 0, 0.1, 0));
      g.add(c(0.062, 0.1, '#9fd0ea', 0, 0.055, 0));
      g.add(c(0.085, 0.015, glass, 0, 0.2, 0));
      break;
    }
    case 'tassenbord': {
      // schmales Wandbord mit zwei Winkeln und einer kleinen Leiste vorn – oben darauf stehen die Tassen dicht an dicht
      const wood = '#e6c59c';
      const z = WALL_Z;
      g.add(b(1.96, 0.03, 0.2, wood, 0, 1.135, z + 0.1));
      g.add(b(1.96, 0.025, 0.014, darken(wood, 0.1), 0, 1.1, z + 0.193));
      for (const x of [-0.72, 0.72]) {
        g.add(b(0.03, 0.12, 0.012, darken(wood, 0.25), x, 1.07, z + 0.006));
        g.add(b(0.03, 0.012, 0.17, darken(wood, 0.25), x, 1.113, z + 0.1));
      }
      break;
    }
    case 'hellerau-regal':
      hellerauShelf(g, col, 1, { seed: 1 });
      break;
    case 'hellerau-regalwand':
      hellerauShelf(g, col, 2, { cabinet: true, seed: 4 });
      break;
    case 'hellerau-standregal':
      hellerauShelf(g, col, 1, { floor: true, seed: 2 });
      break;
    case 'tassenregal': {
      // vier Bretter nebeneinander in einem hellen Gestell mit Haken für Henkel – oben darauf stehen die Tassen
      const wood = '#e6c59c';
      for (const x of [-1.9, 1.9]) g.add(b(0.06, 0.9, 0.3, darken(wood, 0.08), x, 0.45, 0));
      g.add(b(3.84, 0.05, 0.32, wood, 0, 0.9, 0));
      g.add(b(3.84, 0.04, 0.3, wood, 0, 0.55, 0));
      g.add(b(3.84, 0.04, 0.3, wood, 0, 0.2, 0));
      g.add(b(3.8, 0.9, 0.02, darken(wood, 0.12), 0, 0.45, -0.15));
      // Haken fürs untere Brett
      for (let i = 0; i < 8; i++) g.add(s(0.012, 0.012, 0.012, '#8a6a3a', -1.7 + i * 0.49, 0.5, 0.0));
      break;
    }
    case 'plattenspieler': {
      g.add(b(0.36, 0.08, 0.3, '#8a5a3a', 0, 0.04, 0));
      g.add(c(0.12, 0.012, '#2b2a31', -0.04, 0.09, 0));
      g.add(c(0.035, 0.014, '#e8484f', -0.04, 0.095, 0));
      const arm = b(0.015, 0.012, 0.16, '#c9cbd3', 0.12, 0.1, 0.02);
      arm.rotation.y = 0.4;
      g.add(arm);
      // Plattenstapel daneben
      for (let i = 0; i < 3; i++) g.add(b(0.18, 0.01, 0.18, ['#2b2a31', '#f4a3b8', '#f7d26a'][i], 0, 0.006 + i * 0.012, 0.25).rotateY(i * 0.2));
      break;
    }
    case 'sternenlampe': {
      g.add(c(0.07, 0.05, '#5b6fa8', 0, 0.025, 0));
      glow = glowMat('#fff3b0');
      const ball = mesh(new THREE.IcosahedronGeometry(0.1, 0), glow);
      ball.position.y = 0.15;
      g.add(ball);
      for (let i = 0; i < 6; i++) {
        const a2 = (i / 6) * Math.PI * 2;
        g.add(s(0.012, 0.012, 0.012, '#ffffff', Math.cos(a2) * 0.105, 0.15 + Math.sin(i * 1.7) * 0.05, Math.sin(a2) * 0.105));
      }
      lightAt = new THREE.Vector3(0, 0.15, 0);
      break;
    }
    // ---- Wohnzimmer & Küche ----
    case 'fernseher': {
      g.add(b(1.7, 0.36, 0.45, '#e6c59c', 0, 0.18, 0));
      for (const x of [-0.42, 0.42]) g.add(b(0.78, 0.26, 0.02, darken('#e6c59c', 0.1), x, 0.18, 0.23));
      g.add(b(0.3, 0.04, 0.16, '#2b2a31', 0, 0.38, -0.05));
      g.add(b(0.06, 0.12, 0.04, '#2b2a31', 0, 0.45, -0.05));
      g.add(b(1.35, 0.78, 0.05, '#2b2a31', 0, 0.9, -0.05));
      glow = new THREE.MeshToonMaterial({ color: '#5a6a9a', emissive: '#8ab8ff', emissiveIntensity: 0.35 });
      g.add(b(1.25, 0.68, 0.01, glow, 0, 0.9, -0.022));
      // Bild auf dem Schirm: Herzchen (Datingshow läuft!)
      g.add(s(0.08, 0.07, 0.01, '#f4a3b8', -0.06, 0.92, -0.012));
      g.add(s(0.08, 0.07, 0.01, '#f4a3b8', 0.06, 0.92, -0.012));
      g.add(c(0.1, 0.08, '#f4a3b8', 0, 0.84, -0.012, cone).rotateX(Math.PI).rotateY(Math.PI / 4));
      // Fernbedienung & Schüssel Popcorn
      g.add(b(0.06, 0.02, 0.16, '#3a3a44', 0.55, 0.37, 0.08));
      g.add(c(0.1, 0.06, '#e85a6a', -0.55, 0.39, 0.06));
      for (let i = 0; i < 6; i++) g.add(s(0.025, 0.02, 0.025, '#fff6d8', -0.55 + Math.cos(i) * 0.05, 0.43, 0.06 + Math.sin(i) * 0.05));
      lightAt = new THREE.Vector3(0, 0.9, 0.2);
      break;
    }
    case 'sofa': {
      g.add(b(1.8, 0.3, 0.75, col, 0, 0.22, 0));
      g.add(b(1.8, 0.45, 0.2, darken(col, 0.08), 0, 0.55, -0.28));
      for (const x of [-0.84, 0.84]) g.add(b(0.16, 0.38, 0.75, darken(col, 0.05), x, 0.35, 0));
      for (const x of [-0.4, 0.4]) g.add(b(0.78, 0.1, 0.6, lighten(col, 0.1), x, 0.42, 0.04));
      g.add(b(0.3, 0.26, 0.1, '#fbf6ec', -0.55, 0.6, -0.12).rotateZ(0.2));
      for (const [x, z] of [[-0.8, -0.3], [0.8, -0.3], [-0.8, 0.3], [0.8, 0.3]]) g.add(c(0.03, 0.08, '#8a5a3a', x, 0.04, z));
      seatY = 0.46;
      break;
    }
    case 'herd': {
      g.add(b(1.8, 0.58, 0.6, '#f7f5ec', 0, 0.29, 0));
      g.add(b(1.84, 0.05, 0.64, '#b98a5e', 0, 0.6, 0));
      // Herdplatten (rechts) & Ofen
      for (const [x, z] of [[0.35, -0.12], [0.62, -0.12], [0.35, 0.14], [0.62, 0.14]]) g.add(c(0.09, 0.012, '#2b2a31', x, 0.63, z));
      g.add(b(0.7, 0.32, 0.02, '#3a3a44', 0.48, 0.3, 0.31));
      g.add(b(0.5, 0.04, 0.03, '#c9cbd3', 0.48, 0.5, 0.33));
      // Schubladen (links)
      for (const y of [0.15, 0.43]) g.add(b(0.75, 0.22, 0.02, '#fbe0e8', -0.45, y, 0.31));
      // Topf & Pfanne, Schneidebrett mit Gemüse
      g.add(c(0.11, 0.12, '#e85a6a', 0.35, 0.7, -0.12));
      g.add(c(0.12, 0.02, '#3a3a44', 0.62, 0.65, 0.14));
      g.add(b(0.14, 0.02, 0.03, '#3a3a44', 0.82, 0.65, 0.14));
      g.add(b(0.4, 0.02, 0.26, '#d9b77a', -0.4, 0.64, 0.02));
      g.add(s(0.04, 0.03, 0.06, '#e8873a', -0.45, 0.67, 0.02));
      g.add(s(0.035, 0.035, 0.035, '#e8484f', -0.3, 0.67, 0.04));
      break;
    }
    // ---- Andenken von Jens ----
    case 'eiffelturm': {
      const iron = '#7a6a5a';
      for (const [x, z] of [[-0.08, -0.08], [0.08, -0.08], [-0.08, 0.08], [0.08, 0.08]] as const) {
        const leg = b(0.03, 0.2, 0.03, iron, x, 0.1, z);
        leg.rotation.set(z * 2.4, 0, -x * 2.4);
        g.add(leg);
      }
      g.add(b(0.16, 0.02, 0.16, iron, 0, 0.19, 0));
      g.add(c(0.04, 0.22, iron, 0, 0.31, 0, cone));
      g.add(b(0.08, 0.015, 0.08, iron, 0, 0.3, 0));
      g.add(c(0.006, 0.07, iron, 0, 0.45, 0));
      break;
    }
    case 'venedig-maske': {
      g.add(b(0.08, 0.02, 0.08, '#3a3a44', 0, 0.01, 0));
      g.add(c(0.008, 0.12, '#3a3a44', 0, 0.07, 0));
      const mask = s(0.12, 0.07, 0.04, '#f2c94c', 0, 0.17, 0);
      g.add(mask);
      for (const x of [-0.05, 0.05]) g.add(s(0.025, 0.018, 0.01, '#2b2a31', x, 0.18, 0.035));
      for (let i = 0; i < 3; i++) g.add(s(0.012, 0.08, 0.008, ['#e85a8a', '#5b7fc2', '#ffffff'][i], 0.08 + i * 0.02, 0.27, -0.01).rotateZ(-0.3 - i * 0.2));
      break;
    }
    case 'holzschuhe': {
      for (const x of [-0.06, 0.06]) {
        g.add(s(0.05, 0.04, 0.12, '#f7d26a', x, 0.04, 0));
        g.add(s(0.03, 0.01, 0.03, '#e8484f', x, 0.075, 0.04));
      }
      break;
    }
    case 'faecher': {
      g.add(b(0.1, 0.02, 0.06, '#8a5a3a', 0, 0.01, 0));
      const fan = mesh(new THREE.CircleGeometry(0.15, 16, 0, Math.PI), toon('#d9534f', { side: THREE.DoubleSide }));
      fan.position.set(0, 0.04, 0);
      g.add(fan);
      for (let i = 0; i < 7; i++) {
        const rib = b(0.006, 0.15, 0.004, '#2b2a31', Math.cos((i / 6) * Math.PI) * 0.07, 0.04 + Math.sin((i / 6) * Math.PI) * 0.07, 0.003);
        rib.rotation.z = (i / 6) * Math.PI - Math.PI / 2;
        g.add(rib);
      }
      break;
    }
    case 'schneekugel': {
      g.add(c(0.09, 0.05, '#8a5a3a', 0, 0.025, 0));
      g.add(s(0.09, 0.09, 0.09, new THREE.MeshToonMaterial({ color: '#dff0ff', transparent: true, opacity: 0.45 }), 0, 0.13, 0));
      for (const [x, h] of [[-0.03, 0.08], [0.01, 0.12], [0.04, 0.06]] as const) g.add(b(0.025, h, 0.025, '#7a8a96', x, 0.06 + h / 2, 0));
      break;
    }
    case 'daruma': {
      g.add(s(0.1, 0.11, 0.09, '#d9534f', 0, 0.11, 0));
      g.add(s(0.06, 0.055, 0.03, '#fbf6ec', 0, 0.14, 0.065));
      g.add(s(0.012, 0.012, 0.006, '#2b2a31', -0.02, 0.15, 0.09));
      g.add(s(0.012, 0.012, 0.006, '#fbf6ec', 0.02, 0.15, 0.09));
      g.add(s(0.035, 0.012, 0.01, '#e8c547', 0, 0.06, 0.085));
      break;
    }
    case 'gemaelde-jens': {
      for (const dx of [-0.18, 0.18]) {
        const leg = b(0.04, 1.3, 0.04, '#8a5a3a', dx, 0.62, -0.05);
        leg.rotation.z = dx * 0.5;
        g.add(leg);
      }
      g.add(b(0.04, 1.1, 0.04, '#8a5a3a', 0, 0.55, -0.25).rotateX(-0.3));
      g.add(b(0.62, 0.04, 0.08, '#8a5a3a', 0, 0.62, 0));
      g.add(b(0.62, 0.52, 0.04, '#c9955f', 0, 0.92, 0));
      g.add(b(0.56, 0.46, 0.02, '#f7c6d4', 0, 0.92, 0.025));
      // Dackel unter rosa Himmel
      g.add(b(0.56, 0.12, 0.01, '#8fd08a', 0, 0.75, 0.037));
      g.add(s(0.11, 0.035, 0.01, '#b8642e', 0, 0.83, 0.04));
      g.add(s(0.04, 0.035, 0.01, '#b8642e', 0.11, 0.86, 0.04));
      g.add(s(0.05, 0.05, 0.01, '#fff3b0', -0.17, 1.06, 0.035));
      g.add(s(0.03, 0.03, 0.01, '#e85a8a', 0.15, 1.05, 0.04));
      break;
    }
    case 'erste-hilfe': {
      g.add(b(0.26, 0.24, 0.12, '#f7f5ec', 0, 0.12, 0));
      g.add(b(0.12, 0.035, 0.01, '#4fbf6a', 0, 0.14, 0.062));
      g.add(b(0.035, 0.12, 0.01, '#4fbf6a', 0, 0.14, 0.062));
      g.add(b(0.07, 0.02, 0.02, '#c9cbd3', 0.08, 0.06, 0.065));
      g.add(s(0.02, 0.012, 0.005, '#f4a3b8', -0.08, 0.04, 0.062));
      break;
    }
    case 'vitrine': {
      g.add(b(0.7, 0.12, 0.5, DARK_WOOD, 0, 0.06, 0));
      g.add(b(0.7, 0.05, 0.5, DARK_WOOD, 0, 1.12, 0));
      const glass = new THREE.MeshToonMaterial({ color: '#dff0ff', transparent: true, opacity: 0.28 });
      g.add(b(0.66, 1.0, 0.46, glass, 0, 0.62, 0));
      for (const y of [0.42, 0.78]) g.add(b(0.62, 0.02, 0.42, '#e6c59c', 0, y, 0));
      // Funde: jede Art hat ihren Platz (zwölf, zwei Regalbretter); gezeigt wird, was Lina schon gefunden hat
      const finds = FINDS.map((f) => f.id);
      finds.forEach((id, i) => {
        const row = Math.floor(i / 6);
        const x = ((i % 6) - 2.5) * 0.105;
        const y = row === 0 ? 0.47 : 0.83;
        if (collected.has(id)) g.add(findSpecimen(id, x, y, 0.02));
        else g.add(b(0.03, 0.012, 0.03, '#d6c5a4', x, y - 0.03, 0.02));
      });
      break;
    }
    case 'insektenkasten': {
      const z = WALL_Z;
      g.add(b(1.3, 1.04, 0.1, '#8a5a3a', 0, HANG, z + 0.03));
      g.add(b(1.22, 0.96, 0.02, '#f6efdc', 0, HANG, z + 0.07));
      specimenGrid(g, INSECTS.map((i) => i.id), collected, 6, 5, [0.195, 0.185], insectSpecimen);
      break;
    }
    case 'fischtafel': {
      const z = WALL_Z;
      g.add(b(1.3, 0.7, 0.08, '#6e4630', 0, HANG, z + 0.03));
      g.add(b(1.22, 0.62, 0.02, '#cfe6ef', 0, HANG, z + 0.065));
      specimenGrid(g, FISH.map((i) => i.id), collected, 6, 3, [0.2, 0.19], fishSpecimen);
      break;
    }
    case 'globus': {
      g.add(c(0.2, 0.04, DARK_WOOD, 0, 0.02, 0));
      g.add(c(0.025, 0.55, DARK_WOOD, 0, 0.3, 0));
      const globe = new THREE.Group();
      globe.position.y = 0.78;
      globe.rotation.z = 0.4;
      globe.add(s(0.22, 0.22, 0.22, '#7ab8f0'));
      for (const [x, y, z, r] of [[0.12, 0.08, 0.14, 0.09], [-0.1, -0.05, 0.17, 0.07], [0.05, 0.15, -0.15, 0.08], [-0.16, 0.1, -0.08, 0.06]] as const) globe.add(s(r, r * 0.8, r * 0.6, '#8fd08a', x, y, z));
      for (const [x, y, z] of [[0.15, 0.12, 0.14], [-0.12, -0.02, 0.18], [0.04, 0.2, -0.12]] as const) globe.add(s(0.018, 0.018, 0.018, '#e85a8a', x, y, z));
      const ring = mesh(new THREE.TorusGeometry(0.25, 0.012, 6, 24, Math.PI * 1.4), toon('#c9a24a'));
      ring.rotation.y = Math.PI / 2;
      globe.add(ring);
      g.add(globe);
      break;
    }
    case 'vorratstruhe': {
      const wood = '#a0693f';
      const dark = '#6e4630';
      const iron = '#4a4a56';
      g.add(b(1.5, 0.36, 0.62, wood, 0, 0.18, 0));
      const lid = mesh(new THREE.CylinderGeometry(0.31, 0.31, 1.5, 16, 1, false, 0, Math.PI), toon(wood));
      lid.rotation.z = Math.PI / 2;
      lid.position.set(0, 0.36, 0);
      g.add(lid);
      for (const x of [-0.5, 0.5]) {
        g.add(b(0.1, 0.38, 0.66, iron, x, 0.19, 0));
        const band = mesh(new THREE.CylinderGeometry(0.325, 0.325, 0.1, 16, 1, false, 0, Math.PI), toon(iron));
        band.rotation.z = Math.PI / 2;
        band.position.set(x, 0.36, 0);
        g.add(band);
      }
      g.add(b(0.14, 0.14, 0.04, '#e0b04a', 0, 0.3, 0.33));
      g.add(b(0.04, 0.05, 0.02, dark, 0, 0.29, 0.355));
      for (const [x, z] of [[-0.68, -0.26], [0.68, -0.26], [-0.68, 0.26], [0.68, 0.26]] as const) g.add(b(0.08, 0.04, 0.08, dark, x, 0.02, z));
      break;
    }
    // ---- Herz-Geschenke ----
    case 'setzkasten': {
      const z = WALL_Z;
      g.add(b(0.62, 0.62, 0.1, '#c9955f', 0, HANG, z + 0.03));
      const cols = ['#f4a3b8', '#9ad8c0', '#ffe17a', '#a9c8ff', '#e8873a', '#d6b3ff', '#8fd08a', '#f7f5ec', '#e85a6a'];
      for (let i = 0; i < 9; i++) {
        const x = (i % 3 - 1) * 0.19;
        const y = HANG + (1 - Math.floor(i / 3)) * 0.19;
        g.add(b(0.16, 0.16, 0.02, '#e6c59c', x, y, z + 0.075));
        // Inhalt: Samentütchen, Kiesel oder Fläschchen
        if (i % 3 === 0) g.add(b(0.08, 0.1, 0.02, cols[i], x, y - 0.01, z + 0.095));
        else if (i % 3 === 1) g.add(s(0.045, 0.03, 0.03, i === 4 ? '#a9a9b2' : cols[i], x, y - 0.04, z + 0.1));
        else g.add(c(0.025, 0.09, cols[i], x, y - 0.02, z + 0.1));
      }
      break;
    }
    case 'skelett-kalle': {
      const bone = '#f3ead8';
      g.add(c(0.18, 0.03, '#3a3a44', 0, 0.015, 0));
      g.add(c(0.015, 0.95, '#7a7a84', 0, 0.48, -0.08));
      g.add(s(0.11, 0.12, 0.1, bone, 0, 1.2, 0));
      for (const x of [-0.04, 0.04]) g.add(s(0.025, 0.028, 0.01, '#3a3440', x, 1.21, 0.085));
      g.add(b(0.07, 0.02, 0.01, '#3a3440', 0, 1.13, 0.09));
      g.add(c(0.02, 0.1, bone, 0, 1.04, 0));
      for (let i = 0; i < 4; i++) g.add(s(0.12 - i * 0.012, 0.018, 0.07, bone, 0, 0.96 - i * 0.055, 0));
      g.add(c(0.018, 0.3, bone, 0, 0.84, -0.02));
      g.add(s(0.11, 0.05, 0.07, bone, 0, 0.66, 0));
      for (const x of [-1, 1]) {
        g.add(c(0.016, 0.28, bone, x * 0.15, 0.85, 0).rotateZ(x * 0.15));
        g.add(c(0.014, 0.24, bone, x * 0.17, 0.6, 0.02).rotateZ(-x * 0.05));
        g.add(c(0.02, 0.3, bone, x * 0.06, 0.48, 0));
        g.add(c(0.018, 0.28, bone, x * 0.06, 0.2, 0));
        g.add(s(0.03, 0.015, 0.05, bone, x * 0.06, 0.05, 0.02));
      }
      // Fliege in Rosa
      for (const x of [-0.03, 0.03]) g.add(s(0.03, 0.02, 0.012, '#e85a8a', x, 1.07, 0.04));
      g.add(s(0.012, 0.012, 0.012, '#c94a78', 0, 1.07, 0.045));
      break;
    }
    case 'teddy-brummbaer': {
      const fur = '#b8844e';
      g.add(s(0.09, 0.1, 0.08, fur, 0, 0.1, 0));
      g.add(s(0.06, 0.06, 0.04, '#e6c59c', 0, 0.09, 0.05));
      g.add(s(0.075, 0.07, 0.07, fur, 0, 0.24, 0));
      for (const x of [-0.055, 0.055]) {
        g.add(s(0.028, 0.028, 0.018, fur, x, 0.31, 0));
        g.add(s(0.03, 0.05, 0.03, fur, x * 1.6, 0.13, 0.01));
        g.add(s(0.035, 0.03, 0.045, fur, x * 0.9, 0.03, 0.04));
        g.add(s(0.008, 0.008, 0.006, '#2b2a31', x * 0.45, 0.255, 0.065));
      }
      g.add(s(0.03, 0.022, 0.02, '#e6c59c', 0, 0.225, 0.06));
      g.add(s(0.01, 0.008, 0.006, '#2b2a31', 0, 0.232, 0.078));
      // Pflaster am Bauch
      const plaster = b(0.06, 0.02, 0.006, '#f7c6d4', 0.01, 0.1, 0.11);
      plaster.rotation.z = 0.5;
      g.add(plaster);
      break;
    }
    case 'wandkarte-thalia': {
      const z = WALL_Z;
      g.add(b(1.3, 0.8, 0.03, '#8a5a3a', 0, HANG, z + 0.015));
      g.add(b(1.22, 0.72, 0.01, '#f3ead8', 0, HANG, z + 0.035));
      // Wiese, Wald, Strand, Meer, Fluss
      g.add(b(0.86, 0.62, 0.005, '#bfe3a8', -0.13, HANG + 0.02, z + 0.042));
      for (const [x, y] of [[-0.48, 0.2], [-0.4, 0.26], [-0.5, 0.06], [-0.34, 0.18]] as const) g.add(c(0.045, 0.01, '#6fa86a', x, HANG + y, z + 0.046, cone).rotateX(Math.PI / 2));
      g.add(b(0.16, 0.62, 0.005, '#f3dfa6', 0.38, HANG + 0.02, z + 0.043));
      g.add(b(0.12, 0.62, 0.005, '#8ac8f0', 0.52, HANG + 0.02, z + 0.043));
      const river = b(0.06, 0.66, 0.005, '#7ab8f0', -0.02, HANG + 0.02, z + 0.047);
      river.rotation.z = 0.25;
      g.add(river);
      // Häuser & ein Herz bei Lina
      for (const [x, y, col] of [[-0.25, -0.12, '#f4a3b8'], [0.1, 0.12, '#a9c8ff'], [0.18, -0.16, '#ffe17a'], [-0.2, 0.15, '#d6b3ff']] as const) g.add(b(0.05, 0.04, 0.006, col, x, HANG + y, z + 0.05));
      g.add(s(0.025, 0.022, 0.006, '#e8484f', -0.25, HANG - 0.06, z + 0.053));
      // Windrose
      g.add(c(0.04, 0.005, '#c9a24a', 0.5, HANG - 0.24, z + 0.05).rotateX(Math.PI / 2));
      break;
    }
    case 'ammonit-lina': {
      g.add(b(0.18, 0.04, 0.12, DARK_WOOD, 0, 0.02, 0));
      const shell = mesh(new THREE.TorusGeometry(0.06, 0.03, 8, 18), toon('#c9a77a'));
      shell.position.set(0, 0.13, 0);
      g.add(shell);
      const inner = mesh(new THREE.TorusGeometry(0.03, 0.018, 8, 14), toon('#e6c59c'));
      inner.position.set(0.005, 0.13, 0.005);
      g.add(inner);
      g.add(s(0.015, 0.015, 0.015, '#a98ad8', 0.005, 0.13, 0.01));
      g.add(b(0.08, 0.02, 0.005, '#e6c59c', 0, 0.025, 0.062));
      break;
    }
    case 'priesterkalender': {
      // Wandkalender: roter Kopfbalken, Monatsfeld, darunter ein Padre im Halbporträt (schwarze Soutane, weißer Kragen)
      const z = WALL_Z;
      g.add(b(0.44, 0.62, 0.02, '#fffaf2', 0, HANG, z + 0.012));
      g.add(b(0.44, 0.06, 0.03, '#8a1f2c', 0, HANG + 0.28, z + 0.02));
      g.add(c(0.012, 0.01, '#c9cbd3', 0, HANG + 0.33, z + 0.02).rotateX(Math.PI / 2));
      g.add(b(0.4, 0.4, 0.005, '#d9c9a8', 0, HANG + 0.04, z + 0.026)); // Foto: warmes Gemäuer
      g.add(b(0.34, 0.2, 0.006, '#c9b48a', 0, HANG + 0.14, z + 0.03)); // Bogenfenster
      g.add(c(0.06, 0.008, '#c9b48a', 0, HANG + 0.24, z + 0.03).rotateX(Math.PI / 2));
      // Soutane (Schultern + Brust)
      g.add(s(0.16, 0.12, 0.012, '#1f1d22', 0, HANG - 0.1, z + 0.036));
      g.add(b(0.08, 0.1, 0.01, '#1f1d22', 0, HANG - 0.07, z + 0.04));
      g.add(b(0.07, 0.025, 0.012, '#fbf7ee', 0, HANG - 0.025, z + 0.046)); // Kollar
      // Kopf: Haut, dunkles gewelltes Haar, Lächeln
      g.add(s(0.062, 0.072, 0.014, '#e8b88e', 0, HANG + 0.03, z + 0.042));
      g.add(s(0.068, 0.04, 0.014, '#2a1d18', 0, HANG + 0.085, z + 0.046));
      for (const dx of [-0.026, 0.026]) g.add(s(0.01, 0.012, 0.004, '#2a1d18', dx, HANG + 0.045, z + 0.058));
      g.add(b(0.03, 0.006, 0.004, '#a8553e', 0, HANG + 0.0, z + 0.058));
      // Datumsraster
      g.add(b(0.36, 0.1, 0.005, '#f1ece0', 0, HANG - 0.22, z + 0.026));
      for (let i = 0; i < 7; i++) for (let j = 0; j < 2; j++) g.add(b(0.03, 0.02, 0.004, i === 6 ? '#8a1f2c' : '#9a9aa4', -0.15 + i * 0.05, HANG - 0.2 - j * 0.04, z + 0.031));
      break;
    }
    case 'witzkalender': {
      const z = WALL_Z;
      g.add(b(0.34, 0.06, 0.03, '#e8484f', 0, HANG + 0.2, z + 0.02));
      g.add(b(0.32, 0.36, 0.02, '#fffaf2', 0, HANG, z + 0.02));
      g.add(b(0.28, 0.07, 0.005, '#e8484f', 0, HANG + 0.1, z + 0.032));
      g.add(b(0.12, 0.1, 0.005, '#3a3440', 0, HANG + 0.0, z + 0.032));
      for (let i = 0; i < 3; i++) g.add(b(0.22 - i * 0.04, 0.012, 0.004, '#9a9aa4', 0, HANG - 0.09 - i * 0.03, z + 0.032));
      g.add(c(0.012, 0.01, '#c9cbd3', 0, HANG + 0.25, z + 0.03).rotateX(Math.PI / 2));
      break;
    }
    case 'bilderrahmen-papa': {
      const frame = new THREE.Group();
      frame.position.set(0, 0.11, 0);
      frame.rotation.x = -0.15;
      frame.add(b(0.2, 0.24, 0.02, '#8a5a3a'));
      frame.add(b(0.16, 0.2, 0.005, '#bfe6f7', 0, 0, 0.012));
      frame.add(b(0.16, 0.05, 0.005, '#f3dfa6', 0, -0.075, 0.014));
      // Papa (weißes Hemd, dunkle Weste) mit der kleinen Lina auf den Schultern
      frame.add(b(0.05, 0.06, 0.004, '#3a3a44', 0, -0.04, 0.017));
      frame.add(s(0.02, 0.022, 0.003, '#f2c9a8', 0, 0.0, 0.018));
      frame.add(s(0.016, 0.016, 0.003, '#f2c9a8', 0, 0.055, 0.019));
      frame.add(s(0.024, 0.02, 0.003, '#7a4a2a', 0, 0.07, 0.018));
      frame.add(b(0.03, 0.025, 0.003, '#e85a8a', 0, 0.03, 0.019));
      g.add(frame);
      g.add(b(0.02, 0.14, 0.02, '#8a5a3a', 0, 0.07, -0.06).rotateX(0.4));
      break;
    }
    case 'spruchtafel-lars': {
      const z = WALL_Z;
      g.add(b(0.8, 0.34, 0.04, '#8a5a3a', 0, HANG, z + 0.02));
      g.add(b(0.74, 0.28, 0.01, '#e6c59c', 0, HANG, z + 0.045));
      for (const [w, y] of [[0.5, 0.07], [0.6, 0.0], [0.36, -0.07]] as const) g.add(b(w, 0.025, 0.004, '#4a3a30', 0, HANG + y, z + 0.052));
      g.add(s(0.02, 0.018, 0.004, '#e85a8a', 0.3, HANG - 0.1, z + 0.054));
      break;
    }
    case 'familienbild': {
      const frame = new THREE.Group();
      frame.position.set(0, 0.11, 0);
      frame.rotation.x = -0.15;
      frame.add(b(0.34, 0.24, 0.02, '#8a5a3a'));
      frame.add(b(0.3, 0.2, 0.005, '#bfe6f7', 0, 0, 0.012));
      frame.add(b(0.3, 0.06, 0.005, '#8fd08a', 0, -0.07, 0.014));
      // Bank und sechs kleine Figuren (Jens in der Mitte)
      frame.add(b(0.2, 0.025, 0.004, '#c9955f', 0, -0.03, 0.018));
      const cols = ['#3a5fc8', '#f48a7a', '#4a4a56', '#d9534f', '#2f6a4a', '#6a5a8a'];
      cols.forEach((c2, i) => {
        const x = -0.11 + i * 0.044;
        frame.add(b(0.03, 0.04, 0.004, c2, x, -0.005, 0.02));
        frame.add(s(0.014, 0.014, 0.003, '#f2c9a8', x, 0.03, 0.021));
      });
      g.add(frame);
      g.add(b(0.02, 0.14, 0.02, '#8a5a3a', 0, 0.07, -0.06).rotateX(0.4));
      break;
    }
    case 'likoer-set': {
      g.add(c(0.2, 0.015, '#c9cbd3', 0, 0.008, 0));
      g.add(c(0.2, 0.012, '#fbf6ec', 0, 0.02, 0));
      // Flasche (cremig-gelber Likör) mit Etikett & Korken
      g.add(c(0.055, 0.17, '#f2d36a', -0.06, 0.1, 0));
      g.add(c(0.025, 0.07, '#f2d36a', -0.06, 0.215, 0));
      g.add(c(0.03, 0.025, '#8a5a3a', -0.06, 0.26, 0));
      g.add(b(0.07, 0.06, 0.005, '#fbf6ec', -0.06, 0.1, 0.057));
      g.add(s(0.012, 0.012, 0.004, '#e85a8a', -0.06, 0.1, 0.061));
      // zwei winzige Gläser
      for (const x of [0.06, 0.12]) {
        g.add(c(0.018, 0.012, '#e6f4ff', x, 0.025, 0.04));
        g.add(c(0.008, 0.05, '#e6f4ff', x, 0.05, 0.04));
        g.add(c(0.022, 0.035, new THREE.MeshToonMaterial({ color: '#f2d36a', transparent: true, opacity: 0.85 }), x, 0.09, 0.04));
      }
      break;
    }
    case 'modellflugzeug': {
      // Holzsockel mit Stange, darauf die zweimotorige Propellermaschine (Doppeldecker-Flügel, Rundmotoren)
      g.add(b(0.34, 0.03, 0.22, DARK_WOOD, 0, 0.015, 0));
      g.add(c(0.012, 0.12, '#8a8a96', 0, 0.09, 0));
      const plane = new THREE.Group();
      plane.position.set(0, 0.22, 0);
      plane.rotation.set(0.1, -0.5, 0);
      plane.add(c(0.03, 0.34, '#e8e4d8', 0, 0, 0).rotateX(Math.PI / 2));
      plane.add(s(0.032, 0.028, 0.05, '#e8e4d8', 0, 0, 0.15));
      for (const y of [0.025, -0.022]) plane.add(b(0.4, 0.008, 0.075, '#d9534f', 0, y, 0.02));
      for (const x of [-0.07, 0.07]) {
        plane.add(b(0.006, 0.05, 0.006, '#8a8a96', x, 0, 0.02));
        plane.add(c(0.02, 0.035, '#5a5a66', x, 0.0, 0.07).rotateX(Math.PI / 2));
        plane.add(b(0.07, 0.006, 0.006, '#3a3a44', x, 0, 0.09));
      }
      plane.add(b(0.14, 0.006, 0.05, '#d9534f', 0, 0.01, -0.17));
      plane.add(b(0.006, 0.07, 0.05, '#d9534f', 0, 0.035, -0.17));
      plane.add(b(0.025, 0.01, 0.02, '#2a5a8a', 0.13, 0.025, 0.02));
      g.add(plane);
      break;
    }
    case 'discokugel': {
      g.add(c(0.14, 0.03, '#4a4a56', 0, 0.015, 0));
      g.add(c(0.018, 0.45, '#8a8a96', 0, 0.25, 0));
      glow = glowMat('#dfe8ff');
      const ball = new THREE.Group();
      ball.position.y = 0.62;
      ball.add(s(0.17, 0.17, 0.17, glow));
      const cols = ['#ffffff', '#ffd6e6', '#cfe8ff', '#fff3b0', '#d6c3ff'];
      for (let i = 0; i < 56; i++) {
        const t = Math.acos(1 - (2 * (i + 0.5)) / 56);
        const p = Math.PI * (1 + Math.sqrt(5)) * i;
        const m = b(0.05, 0.05, 0.012, cols[i % cols.length]);
        m.position.set(Math.sin(t) * Math.cos(p) * 0.172, Math.cos(t) * 0.172, Math.sin(t) * Math.sin(p) * 0.172);
        m.lookAt(m.position.clone().multiplyScalar(2));
        ball.add(m);
      }
      g.add(ball);
      lightAt = new THREE.Vector3(0, 0.65, 0);
      break;
    }
    case 'reisekoffer': {
      g.add(b(0.62, 0.28, 0.4, '#8a5a3a', 0, 0.14, 0));
      g.add(b(0.64, 0.02, 0.42, '#6a4228', 0, 0.2, 0));
      for (const x of [-0.2, 0.2]) g.add(b(0.03, 0.29, 0.41, '#5a3a22', x, 0.145, 0));
      g.add(b(0.14, 0.03, 0.04, '#3a2a22', 0, 0.3, 0));
      for (const x of [-0.08, 0.08]) g.add(b(0.04, 0.04, 0.02, '#c9a24a', x, 0.24, 0.205));
      // Aufkleber aus aller Welt
      const stickers: Array<[number, number, string]> = [[-0.1, 0.1, '#f4a3b8'], [0.08, 0.08, '#a9c8ff'], [0.25, 0.12, '#ffe17a'], [-0.27, 0.07, '#9ad8c0'], [0.0, 0.15, '#e85a6a']];
      for (const [x, y, col] of stickers) g.add(c(0.04, 0.005, col, x, y, 0.203).rotateX(Math.PI / 2));
      g.add(b(0.07, 0.05, 0.005, '#fbf6ec', 0.12, 0.16, 0.203));
      break;
    }
    case 'steinmaennchen': {
      const stones: Array<[number, number, number, string]> = [[0.16, 0.06, 0, '#9a9aa4'], [0.13, 0.05, 0.02, '#b0b0b8'], [0.1, 0.045, -0.01, '#8f8f99'], [0.075, 0.04, 0.01, '#a9a9b2'], [0.055, 0.035, 0, '#9a9aa4']];
      let y = 0;
      for (const [r, h, dx, col] of stones) {
        y += h;
        g.add(s(r, h, r * 0.9, col, dx, y, 0));
        y += h * 0.8;
      }
      g.add(c(0.03, 0.08, '#c3a8ff', 0, y + 0.04, 0, cone));
      break;
    }
    // ---- Garten (draußen) ----
    case 'zaun-holz':
    case 'zaun-weiss':
      addFence(g, f.def.id, links);
      break;
    case 'gartentor': {
      addFence(g, 'gartentor', links);
      const horiz = links.e || links.w || !(links.n || links.s);
      const gate = new THREE.Group();
      if (!horiz) gate.rotation.y = Math.PI / 2;
      for (const x of [-0.45, 0.45]) gate.add(b(0.1, 0.78, 0.1, '#f7f5ec', x, 0.39, 0));
      for (const x of [-0.45, 0.45]) gate.add(s(0.06, 0.06, 0.06, '#f4a3b8', x, 0.82, 0));
      const arch = mesh(new THREE.TorusGeometry(0.45, 0.035, 6, 16, Math.PI), toon('#f7f5ec'));
      arch.position.y = 0.78;
      gate.add(arch);
      for (const sx of [-1, 1]) {
        const door = new THREE.Group();
        door.position.x = sx * 0.4;
        door.rotation.y = sx * 0.12;
        for (let i = 0; i < 3; i++) door.add(b(0.06, 0.42, 0.03, '#f7f5ec', -sx * (0.08 + i * 0.13), 0.3, 0));
        door.add(b(0.4, 0.05, 0.03, '#f7f5ec', -sx * 0.2, 0.22, 0));
        door.add(b(0.4, 0.05, 0.03, '#f7f5ec', -sx * 0.2, 0.42, 0));
        gate.add(door);
      }
      g.add(gate);
      break;
    }
    case 'weg-stein': {
      for (const [x, z, r2] of [[-0.2, -0.18, 0.2], [0.2, 0.15, 0.22], [-0.18, 0.28, 0.13], [0.25, -0.28, 0.12]] as const) {
        g.add(c(r2, 0.04, '#b8b8c0', x, 0.02, z));
        g.add(c(r2 * 0.8, 0.045, '#c9c9d0', x, 0.022, z));
      }
      break;
    }
    case 'weg-holz': {
      for (let i = 0; i < 4; i++) g.add(b(0.96, 0.04, 0.22, i % 2 ? '#c9955f' : '#b98a5e', 0, 0.02, -0.36 + i * 0.24));
      break;
    }
    case 'weg-kies': {
      g.add(b(0.98, 0.02, 0.98, '#d8cfc0', 0, 0.01, 0));
      for (let i = 0; i < 26; i++) {
        const a2 = i * 2.39996;
        const r2 = Math.sqrt((i + 0.5) / 26) * 0.44;
        g.add(s(0.035, 0.015, 0.03, i % 3 ? '#bdb3a4' : '#e6ddd0', Math.cos(a2) * r2, 0.025, Math.sin(a2) * r2));
      }
      break;
    }
    case 'weg-pflaster': {
      g.add(b(0.98, 0.025, 0.98, '#9a9aa4', 0, 0.012, 0));
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) g.add(b(0.29, 0.03, 0.29, (i + j) % 2 ? '#c9c3d4' : '#b8b2c4', -0.32 + i * 0.32, 0.018, -0.32 + j * 0.32));
      break;
    }
    case 'gartenbank': {
      for (const x of [-0.8, 0.8]) {
        g.add(b(0.08, 0.4, 0.38, '#5a5a66', x, 0.2, 0));
        g.add(b(0.08, 0.06, 0.4, '#5a5a66', x, 0.6, -0.02));
      }
      for (const z of [-0.12, 0.02, 0.16]) g.add(b(1.72, 0.05, 0.12, col, 0, 0.42, z));
      for (const y of [0.6, 0.75]) {
        const back = b(1.72, 0.1, 0.04, col, 0, y, -0.2);
        back.rotation.x = -0.15;
        g.add(back);
      }
      seatY = 0.42;
      break;
    }
    case 'gartentisch': {
      g.add(c(0.38, 0.04, '#f7f5ec', 0, 0.6, 0));
      g.add(c(0.035, 0.58, '#5a5a66', 0, 0.3, 0));
      for (let i = 0; i < 3; i++) {
        const a2 = (i / 3) * Math.PI * 2;
        const foot = b(0.3, 0.03, 0.05, '#5a5a66', Math.cos(a2) * 0.13, 0.02, Math.sin(a2) * 0.13);
        foot.rotation.y = -a2;
        g.add(foot);
      }
      break;
    }
    case 'gartenstuhl': {
      g.add(c(0.2, 0.04, col, 0, 0.4, 0.02));
      for (const [x, z] of [[-0.14, -0.12], [0.14, -0.12], [-0.14, 0.16], [0.14, 0.16]]) g.add(c(0.018, 0.4, darken(col, 0.15), x, 0.2, z));
      const back = mesh(new THREE.TorusGeometry(0.17, 0.025, 6, 16, Math.PI), toon(col));
      back.position.set(0, 0.55, -0.15);
      back.rotation.x = -0.1;
      g.add(back);
      for (const x of [-0.08, 0, 0.08]) g.add(b(0.02, 0.2, 0.02, col, x, 0.55, -0.15));
      seatY = 0.42;
      break;
    }
    case 'sonnenschirm': {
      g.add(c(0.16, 0.06, '#5a5a66', 0, 0.03, 0));
      g.add(c(0.02, 1.5, '#f7f5ec', 0, 0.75, 0));
      const top = mesh(new THREE.ConeGeometry(0.75, 0.32, 8, 1, true), toon(col, { side: THREE.DoubleSide }));
      top.position.y = 1.45;
      g.add(top);
      for (let i = 0; i < 8; i += 2) {
        const seg = mesh(new THREE.ConeGeometry(0.751, 0.321, 8, 1, true, (i / 8) * Math.PI * 2, Math.PI / 4), toon('#ffffff', { side: THREE.DoubleSide }));
        seg.position.y = 1.45;
        g.add(seg);
      }
      g.add(s(0.04, 0.04, 0.04, col, 0, 1.63, 0));
      break;
    }
    case 'lichterkette': {
      for (const x of [-0.9, 0.9]) {
        g.add(c(0.04, 1.3, '#8a5a3a', x, 0.65, 0));
        g.add(s(0.05, 0.05, 0.05, '#6e4630', x, 1.31, 0));
      }
      const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-0.9, 1.25, 0), new THREE.Vector3(0, 0.95, 0), new THREE.Vector3(0.9, 1.25, 0));
      g.add(mesh(new THREE.TubeGeometry(curve, 16, 0.008, 4), toon('#3a3a44')));
      glow = glowMat('#fff1b8');
      const bulbCols = ['#ffd36b', '#f4a3b8', '#9ad8ff', '#b8f0a0'];
      for (let i = 1; i < 10; i++) {
        const p = curve.getPoint(i / 10);
        const bulb = new THREE.Mesh(sphere, new THREE.MeshToonMaterial({ color: bulbCols[i % 4], emissive: bulbCols[i % 4], emissiveIntensity: 0.15 }));
        bulb.scale.setScalar(0.035);
        bulb.position.set(p.x, p.y - 0.04, p.z);
        bulb.userData.bulb = true;
        g.add(bulb);
      }
      lightAt = new THREE.Vector3(0, 1.05, 0);
      break;
    }
    case 'gartenlaterne': {
      g.add(c(0.03, 0.9, '#3a3a44', 0, 0.45, 0));
      g.add(b(0.2, 0.03, 0.2, '#3a3a44', 0, 0.9, 0));
      glow = glowMat('#ffe0a0');
      g.add(b(0.15, 0.2, 0.15, glow, 0, 1.01, 0));
      const roof = c(0.15, 0.1, '#3a3a44', 0, 1.16, 0, cone);
      roof.rotation.y = Math.PI / 4;
      g.add(roof);
      lightAt = new THREE.Vector3(0, 1.0, 0);
      break;
    }
    case 'windlicht': {
      g.add(c(0.06, 0.12, new THREE.MeshToonMaterial({ color: '#e6f4ff', transparent: true, opacity: 0.55 }), 0, 0.06, 0));
      glow = glowMat('#ffd58a');
      g.add(c(0.025, 0.05, '#fbf6ec', 0, 0.035, 0));
      g.add(s(0.012, 0.025, 0.012, glow, 0, 0.08, 0));
      lightAt = new THREE.Vector3(0, 0.1, 0);
      break;
    }
    case 'blumenkuebel': {
      const pot = mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.32, 14), toon('#d98a5f'));
      pot.position.y = 0.16;
      g.add(pot);
      g.add(c(0.23, 0.04, '#c97a4f', 0, 0.32, 0));
      g.add(s(0.2, 0.08, 0.2, '#5f9a4a', 0, 0.36, 0));
      for (let i = 0; i < 9; i++) {
        const a2 = i * 2.4;
        const r2 = 0.05 + (i % 3) * 0.05;
        const fx = Math.cos(a2) * r2;
        const fz = Math.sin(a2) * r2;
        g.add(s(0.045, 0.015, 0.045, '#ffffff', fx, 0.43 + (i % 2) * 0.03, fz));
        g.add(s(0.018, 0.012, 0.018, '#f7d26a', fx, 0.445 + (i % 2) * 0.03, fz));
      }
      break;
    }
    case 'vogeltraenke': {
      g.add(c(0.1, 0.45, '#a9a9b2', 0, 0.225, 0));
      g.add(c(0.18, 0.04, '#9a9aa4', 0, 0.02, 0));
      const bowl = mesh(new THREE.SphereGeometry(0.28, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), toon('#b8b8c0', { side: THREE.DoubleSide }));
      bowl.position.y = 0.6;
      bowl.scale.y = 0.45;
      g.add(bowl);
      g.add(c(0.25, 0.01, '#8ac8ff', 0, 0.58, 0));
      // ein Spatz auf dem Rand
      g.add(s(0.045, 0.04, 0.06, '#a87448', 0.22, 0.65, 0));
      g.add(s(0.03, 0.03, 0.03, '#a87448', 0.22, 0.7, 0.04));
      g.add(c(0.008, 0.02, '#e8a040', 0.22, 0.7, 0.075, cone).rotateX(Math.PI / 2));
      break;
    }
    case 'vogelhaus': {
      g.add(c(0.035, 1.0, '#8a5a3a', 0, 0.5, 0));
      g.add(b(0.3, 0.26, 0.26, '#c9955f', 0, 1.13, 0));
      for (const sx of [-1, 1]) {
        const roof = b(0.22, 0.03, 0.34, '#d9534f', sx * 0.09, 1.31, 0);
        roof.rotation.z = -sx * 0.6;
        g.add(roof);
      }
      g.add(c(0.045, 0.01, '#3a2a22', 0, 1.15, 0.131).rotateX(Math.PI / 2));
      g.add(c(0.01, 0.08, '#8a5a3a', 0, 1.06, 0.17).rotateX(Math.PI / 2));
      break;
    }
    case 'gartenwichtel': {
      g.add(s(0.12, 0.1, 0.1, '#5b7fc2', 0, 0.1, 0));
      g.add(c(0.1, 0.16, '#5b7fc2', 0, 0.2, 0));
      g.add(s(0.09, 0.09, 0.09, '#fbe0cc', 0, 0.36, 0));
      g.add(s(0.08, 0.1, 0.06, '#ffffff', 0, 0.3, 0.05));
      const hat = c(0.1, 0.24, '#d9534f', 0, 0.52, 0, cone);
      hat.rotation.z = 0.15;
      g.add(hat);
      g.add(s(0.025, 0.02, 0.02, '#f0a0a0', 0, 0.36, 0.09));
      for (const x of [-0.03, 0.03]) g.add(s(0.01, 0.014, 0.008, '#2b2a31', x, 0.39, 0.08));
      for (const x of [-0.05, 0.05]) g.add(s(0.04, 0.025, 0.06, '#6e4630', x, 0.015, 0.03));
      break;
    }
    case 'hochbeet': {
      g.add(b(1.86, 0.36, 0.86, '#b98a5e', 0, 0.18, 0));
      for (const y of [0.1, 0.22]) {
        g.add(b(1.88, 0.02, 0.88, darken('#b98a5e', 0.12), 0, y, 0));
      }
      g.add(b(1.9, 0.05, 0.9, '#c9955f', 0, 0.37, 0));
      g.add(b(1.72, 0.02, 0.72, '#6e4a32', 0, 0.38, 0));
      for (const x of [-0.45, 0.45]) g.add(b(0.7, 0.025, 0.66, '#5e3e2a', x, 0.385, 0));
      break;
    }
    case 'fruehbeet': {
      // Holzbeet (3 × 1) mit schräg aufgelegtem Glasdeckel: hinten hoch, vorn niedrig
      const wood = '#b98a5e';
      const glass = new THREE.MeshToonMaterial({ color: '#cfe8f4', transparent: true, opacity: 0.32, depthWrite: false });
      g.add(b(2.86, 0.36, 0.86, wood, 0, 0.18, 0));
      g.add(b(2.9, 0.04, 0.9, '#c9955f', 0, 0.37, 0));
      g.add(b(2.74, 0.02, 0.74, '#6e4a32', 0, 0.38, 0));
      // Rahmen & Glas
      for (const x of [-1.42, 1.42]) {
        g.add(b(0.04, 0.6, 0.04, '#f7f5ec', x, 0.7, -0.4));
        g.add(b(0.04, 0.22, 0.04, '#f7f5ec', x, 0.5, 0.4));
      }
      const lid = b(2.86, 0.02, 0.92, glass, 0, 0.88, 0);
      lid.rotation.x = 0.4;
      lid.position.set(0, 0.84, 0);
      g.add(lid);
      for (const x of [-1.42, 0, 1.42]) {
        const rib = b(0.035, 0.03, 0.93, '#f7f5ec', x, 0.84, 0);
        rib.rotation.x = 0.4;
        g.add(rib);
      }
      g.add(b(2.86, 0.4, 0.02, glass, 0, 0.58, -0.43));
      break;
    }
    case 'gewaechshaus': {
      // kleines Glashaus (3 × 2): Holzsockel, Glaswände, Satteldach, Tür vorn – Pflanzen innen bleiben sichtbar
      const wood = '#b98a5e';
      const glass = new THREE.MeshToonMaterial({ color: '#cfe8f4', transparent: true, opacity: 0.28, depthWrite: false });
      const white = '#f7f5ec';
      const W = 2.9;
      const D = 1.9;
      const wallH = 1.1;
      g.add(b(W, 0.16, D, wood, 0, 0.08, 0));
      g.add(b(W - 0.2, 0.02, D - 0.2, '#6e4a32', 0, 0.17, 0));
      // Glaswände
      g.add(b(W, wallH, 0.02, glass, 0, 0.16 + wallH / 2, -D / 2));
      for (const sx of [-1, 1]) g.add(b(0.02, wallH, D, glass, sx * (W / 2), 0.16 + wallH / 2, 0));
      g.add(b(W, wallH, 0.02, glass, 0, 0.16 + wallH / 2, D / 2));
      // Pfosten & Querstreben
      for (const x of [-W / 2, -W / 6, W / 6, W / 2]) for (const z of [-D / 2, D / 2]) g.add(b(0.05, wallH, 0.05, white, x, 0.16 + wallH / 2, z));
      for (const sx of [-1, 1]) g.add(b(0.05, wallH, 0.05, white, sx * (W / 2), 0.16 + wallH / 2, 0));
      for (const y of [0.16 + wallH * 0.5, 0.16 + wallH]) {
        g.add(b(W, 0.04, 0.04, white, 0, y, D / 2));
        g.add(b(W, 0.04, 0.04, white, 0, y, -D / 2));
        for (const sx of [-1, 1]) g.add(b(0.04, 0.04, D, white, sx * (W / 2), y, 0));
      }
      // Satteldach aus zwei Glasflächen, First oben
      const ridge = 0.16 + wallH + 0.55;
      for (const sz of [-1, 1]) {
        const pane = b(W, 0.02, D / 2 / Math.cos(0.5), glass, 0, 0.16 + wallH + 0.27, sz * D / 4);
        pane.rotation.x = sz * -0.5;
        g.add(pane);
        for (const x of [-W / 2, -W / 6, W / 6, W / 2]) {
          const rafter = b(0.04, 0.04, D / 2 / Math.cos(0.5), white, x, 0.16 + wallH + 0.27, sz * D / 4);
          rafter.rotation.x = sz * -0.5;
          g.add(rafter);
        }
      }
      g.add(b(W + 0.04, 0.05, 0.05, white, 0, ridge, 0));
      // Giebel (Dreiecke aus Glas) vorn & hinten
      for (const sx of [-1, 1]) {
        const tri = new THREE.Shape();
        tri.moveTo(-D / 2, 0);
        tri.lineTo(D / 2, 0);
        tri.lineTo(0, 0.55);
        const mesh1 = new THREE.Mesh(new THREE.ShapeGeometry(tri), glass);
        mesh1.rotation.y = Math.PI / 2;
        mesh1.position.set(sx * (W / 2), 0.16 + wallH, 0);
        g.add(mesh1);
      }
      // Tür vorn mit Griff
      g.add(b(0.62, 0.9, 0.03, white, -0.05, 0.16 + 0.45, D / 2 + 0.02));
      g.add(b(0.52, 0.8, 0.032, glass, -0.05, 0.16 + 0.45, D / 2 + 0.02));
      g.add(s(0.025, 0.025, 0.025, '#d9b45a', 0.18, 0.62, D / 2 + 0.05));
      break;
    }
    case 'huehnerstall': {
      // Haus auf Stelzen (hinten), Auslauf-Rampe vorne
      for (const x of [-0.55, 0.55]) for (const z of [-0.75, -0.05]) g.add(b(0.07, 0.42, 0.07, '#8a5a3a', x, 0.21, z));
      g.add(b(1.3, 0.62, 0.86, '#d9534f', 0, 0.73, -0.4));
      for (const x of [-0.66, 0.66]) g.add(b(0.06, 0.64, 0.88, '#f7f5ec', x, 0.73, -0.4));
      g.add(b(1.34, 0.06, 0.9, '#f7f5ec', 0, 0.42, -0.4));
      for (const sx of [-1, 1]) {
        const roof = b(0.78, 0.06, 1.0, '#7a5038', sx * 0.33, 1.2, -0.4);
        roof.rotation.z = -sx * 0.55;
        g.add(roof);
      }
      // Giebel vorne (Dreieck)
      const gable = new THREE.Shape();
      gable.moveTo(-0.65, 0);
      gable.lineTo(0.65, 0);
      gable.lineTo(0, 0.42);
      gable.closePath();
      const gm = mesh(new THREE.ShapeGeometry(gable), toon('#d9534f', { side: THREE.DoubleSide }));
      gm.position.set(0, 1.04, 0.035);
      g.add(gm);
      // Tür & Fensterchen
      g.add(b(0.3, 0.38, 0.03, '#8a3a34', -0.2, 0.62, 0.04));
      g.add(c(0.09, 0.03, '#ffe9b8', 0.3, 0.85, 0.04).rotateX(Math.PI / 2));
      g.add(c(0.1, 0.02, '#f7f5ec', 0.3, 0.85, 0.035).rotateX(Math.PI / 2));
      // Rampe mit Querleisten
      const ramp = b(0.3, 0.03, 0.85, '#b98a5e', -0.2, 0.22, 0.38);
      ramp.rotation.x = 0.55;
      g.add(ramp);
      // Nest mit Eiern (sichtbar, wenn es heute Eier gibt)
      g.add(c(0.2, 0.08, '#d9b77a', 0.45, 0.06, 0.55));
      const eggs = new THREE.Group();
      eggs.name = 'eggs';
      for (const [x, z] of [[0.4, 0.52], [0.5, 0.58], [0.45, 0.62]] as const) eggs.add(s(0.045, 0.06, 0.045, '#f7ead6', x, 0.13, z));
      g.add(eggs);
      // Futternapf
      g.add(c(0.12, 0.05, '#7a9ac8', 0.45, 0.025, 0.1));
      g.add(c(0.1, 0.01, '#e8c547', 0.45, 0.05, 0.1));
      break;
    }
    case 'wachtelstall': {
      for (const x of [-0.8, 0.8]) for (const z of [-0.3, 0.3]) g.add(b(0.06, 0.18, 0.06, '#8a5a3a', x, 0.09, z));
      g.add(b(1.7, 0.04, 0.7, '#b98a5e', 0, 0.18, 0));
      g.add(b(1.7, 0.42, 0.04, '#c9955f', 0, 0.4, -0.33));
      for (const x of [-0.84, 0.84]) g.add(b(0.04, 0.42, 0.7, '#c9955f', x, 0.4, 0));
      // Häuschen links
      g.add(b(0.6, 0.42, 0.66, '#9ad8c0', -0.54, 0.4, 0));
      g.add(c(0.08, 0.02, '#3a3a44', -0.54, 0.36, 0.33).rotateX(Math.PI / 2));
      // Drahtgitter vorne rechts
      const wire = toon('#c9cbd3');
      for (let i = 0; i <= 8; i++) g.add(b(0.012, 0.42, 0.012, wire, -0.22 + i * 0.13, 0.4, 0.34));
      for (const y of [0.25, 0.4, 0.55]) g.add(b(1.06, 0.012, 0.012, wire, 0.3, y, 0.34));
      const roof = b(1.8, 0.05, 0.82, '#7a5038', 0, 0.64, 0);
      roof.rotation.x = 0.12;
      g.add(roof);
      // Eier in der Schale vorne
      g.add(c(0.14, 0.04, '#d9b77a', 0.6, 0.02, 0.48));
      const eggs = new THREE.Group();
      eggs.name = 'eggs';
      for (const [x, z] of [[0.56, 0.46], [0.64, 0.5], [0.6, 0.53], [0.66, 0.44]] as const) eggs.add(s(0.03, 0.038, 0.03, '#e6d6bc', x, 0.06, z));
      g.add(eggs);
      break;
    }
    // ---- Handgemacht (Werkbank) ----
    case 'ast-hocker': {
      g.add(c(0.2, 0.05, '#c9955f', 0, 0.36, 0));
      g.add(c(0.21, 0.012, '#a87448', 0, 0.385, 0));
      for (let i = 0; i < 3; i++) {
        const a2 = (i / 3) * Math.PI * 2;
        const leg = c(0.025, 0.38, '#8a5a3a', Math.cos(a2) * 0.12, 0.18, Math.sin(a2) * 0.12);
        leg.rotation.set(Math.sin(a2) * 0.18, 0, -Math.cos(a2) * 0.18);
        g.add(leg);
      }
      const brace = c(0.015, 0.26, '#8a5a3a', 0, 0.14, 0);
      brace.rotation.z = Math.PI / 2;
      g.add(brace);
      seatY = 0.38;
      break;
    }
    case 'blumenvase': {
      g.add(s(0.09, 0.09, 0.09, '#a9a9b2', 0, 0.08, 0));
      g.add(c(0.06, 0.04, '#8f8f99', 0, 0.16, 0));
      for (const [x, z, h, cc] of [[0, 0, 0.32, '#f4a3b8'], [0.05, 0.03, 0.27, '#f7e26a'], [-0.05, 0.02, 0.29, '#a98ad8'], [0.02, -0.05, 0.25, '#ffffff'], [-0.03, -0.04, 0.3, '#7ab8f0']] as const) {
        const st = c(0.006, h - 0.15, '#5f9a4a', x * 0.6, 0.16 + (h - 0.15) / 2, z * 0.6);
        st.rotation.set(z * 2, 0, -x * 2);
        g.add(st);
        g.add(s(0.03, 0.022, 0.03, cc, x, h, z));
      }
      break;
    }
    case 'hundekoerbchen': {
      const basket = mesh(new THREE.CylinderGeometry(0.4, 0.34, 0.16, 20, 1, true), toon('#c9955f', { side: THREE.DoubleSide }));
      basket.scale.set(1, 1, 0.82);
      basket.position.y = 0.08;
      g.add(basket);
      const floor = c(0.36, 0.02, '#b07a4a', 0, 0.01, 0);
      floor.scale.z = 0.3;
      g.add(floor);
      const rim = mesh(new THREE.TorusGeometry(0.4, 0.035, 8, 24), toon('#a87448'));
      rim.rotation.x = Math.PI / 2;
      rim.scale.set(1, 0.82, 1);
      rim.position.y = 0.16;
      g.add(rim);
      for (let i = 0; i < 3; i++) {
        const band = mesh(new THREE.TorusGeometry(0.38, 0.012, 6, 24), toon('#8a5a3a'));
        band.rotation.x = Math.PI / 2;
        band.scale.set(1 - i * 0.04, 0.82 - i * 0.03, 1);
        band.position.y = 0.04 + i * 0.045;
        g.add(band);
      }
      g.add(s(0.3, 0.05, 0.24, '#f7c6d4', 0, 0.06, 0));
      // ein Knochen-Spielzeug
      g.add(c(0.012, 0.12, '#fbf6ec', 0.18, 0.1, 0.12).rotateZ(Math.PI / 2));
      for (const x of [0.12, 0.24]) g.add(s(0.022, 0.022, 0.022, '#fbf6ec', x, 0.1, 0.12));
      seatY = 0.07;
      break;
    }
    case 'steinlaterne': {
      g.add(b(0.36, 0.1, 0.36, '#9a9aa4', 0, 0.05, 0));
      g.add(c(0.09, 0.32, '#a9a9b2', 0, 0.26, 0));
      g.add(b(0.3, 0.06, 0.3, '#9a9aa4', 0, 0.45, 0));
      glow = glowMat('#ffd58a');
      g.add(b(0.18, 0.16, 0.18, glow, 0, 0.56, 0));
      for (const [x, z] of [[-0.1, -0.1], [0.1, -0.1], [-0.1, 0.1], [0.1, 0.1]]) g.add(b(0.04, 0.17, 0.04, '#a9a9b2', x, 0.56, z));
      const roof = c(0.26, 0.14, '#8f8f99', 0, 0.71, 0, cone);
      roof.rotation.y = Math.PI / 4;
      g.add(roof);
      g.add(s(0.04, 0.04, 0.04, '#8f8f99', 0, 0.8, 0));
      lightAt = new THREE.Vector3(0, 0.56, 0);
      break;
    }
    case 'muschellampe': {
      g.add(c(0.07, 0.03, '#e6c59c', 0, 0.015, 0));
      g.add(c(0.012, 0.2, '#b98a5e', 0, 0.12, 0));
      glow = glowMat('#ffe0e8');
      const shell = mesh(new THREE.SphereGeometry(0.13, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), glow);
      shell.position.y = 0.2;
      shell.scale.set(1, 0.75, 1);
      g.add(shell);
      for (let i = 0; i < 8; i++) {
        const rib = b(0.008, 0.005, 0.12, '#f4a3b8', 0, 0.255, 0);
        rib.rotation.set(0.5, (i / 8) * Math.PI * 2, 0);
        g.add(rib);
      }
      g.add(s(0.03, 0.02, 0.025, '#f7d3dc', 0.05, 0.02, 0.05));
      lightAt = new THREE.Vector3(0, 0.25, 0);
      break;
    }
    case 'treibholzregal': {
      for (const x of [-0.82, 0.82]) {
        const post = c(0.04, 0.95, '#9a6a44', x, 0.475, 0);
        post.rotation.z = x > 0 ? 0.03 : -0.03;
        g.add(post);
      }
      for (const [y, w] of [[0.06, 1.7], [0.42, 1.72], [0.8, 1.68]] as const) {
        g.add(b(w, 0.05, 0.36, '#b98a5e', 0, y, 0));
        for (const z of [-0.12, 0, 0.12]) {
          const ast = c(0.02, w, '#8a5a3a', 0, y + 0.03, z);
          ast.rotation.z = Math.PI / 2;
          g.add(ast);
        }
      }
      g.add(s(0.06, 0.05, 0.06, '#a9a9b2', -0.5, 0.49, 0));
      g.add(s(0.05, 0.035, 0.04, '#f7d3dc', -0.35, 0.47, 0.05));
      break;
    }
    case 'seestern-deko': {
      g.add(c(0.14, 0.03, '#f3ead8', 0, 0.015, 0));
      for (const [x, z, cc] of [[-0.07, 0.06, '#f7d3dc'], [0.08, 0.05, '#fbf6ec'], [0.03, -0.08, '#f2e2c8']] as const) g.add(s(0.035, 0.018, 0.03, cc, x, 0.04, z));
      const star = new THREE.Shape();
      for (let i = 0; i < 10; i++) {
        const a2 = (i / 10) * Math.PI * 2 + Math.PI / 2;
        const r = i % 2 === 0 ? 0.11 : 0.045;
        if (i === 0) star.moveTo(Math.cos(a2) * r, Math.sin(a2) * r);
        else star.lineTo(Math.cos(a2) * r, Math.sin(a2) * r);
      }
      const st = mesh(new THREE.ExtrudeGeometry(star, { depth: 0.025, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2 }), toon('#f29a6a'));
      st.rotation.x = -Math.PI / 2 + 0.5;
      st.position.set(0, 0.1, -0.02);
      g.add(st);
      break;
    }
    case 'glitzerlampe': {
      g.add(c(0.09, 0.06, '#9a9aa4', 0, 0.03, 0));
      g.add(c(0.07, 0.05, '#a9a9b2', 0, 0.085, 0));
      glow = new THREE.MeshToonMaterial({ color: '#bde8ff', emissive: '#c8a8ff', emissiveIntensity: 0.2 });
      const gem = mesh(new THREE.OctahedronGeometry(0.09, 0), glow);
      gem.scale.set(1, 1.35, 1);
      gem.position.y = 0.21;
      gem.rotation.y = 0.4;
      g.add(gem);
      lightAt = new THREE.Vector3(0, 0.22, 0);
      break;
    }
    case 'kieselmosaik': {
      g.add(c(0.95, 0.015, '#d8d2c6', 0, 0.008, 0));
      const stones = ['#a9a9b2', '#c9c3b8', '#8f8f99', '#e0d8cc', '#b8a898'];
      let k = 0;
      for (const [r, n] of [[0, 1], [0.2, 7], [0.42, 12], [0.66, 18], [0.86, 22]] as const) {
        for (let i = 0; i < n; i++) {
          const a2 = (i / n) * Math.PI * 2 + r;
          const col2 = r === 0.42 ? '#f4a3b8' : stones[k++ % stones.length];
          g.add(s(0.07, 0.025, 0.06, col2, Math.cos(a2) * r, 0.02, Math.sin(a2) * r));
        }
      }
      break;
    }
    // ---------------------------------------------------------------- Wand-Deko (hängt an der Rückseite des Feldes)
    case 'bild-winston': {
      const z = WALL_Z;
      g.add(b(0.58, 0.68, 0.04, '#c9955f', 0, HANG, z));
      g.add(b(0.5, 0.6, 0.01, '#fdeff2', 0, HANG, z + 0.022));
      // Winston im Profil: Körper, Kopf, Schlappohr, Nase, rosa Halsband
      g.add(s(0.15, 0.08, 0.01, '#b8642e', 0.02, HANG - 0.1, z + 0.03));
      g.add(s(0.08, 0.075, 0.01, '#b8642e', -0.13, HANG + 0.0, z + 0.032));
      g.add(s(0.03, 0.06, 0.01, '#7a3e1c', -0.1, HANG - 0.03, z + 0.036));
      g.add(s(0.018, 0.018, 0.01, '#2a1d18', -0.21, HANG + 0.0, z + 0.036));
      g.add(b(0.03, 0.05, 0.01, '#f4a3b8', -0.06, HANG - 0.06, z + 0.037));
      g.add(b(0.2, 0.012, 0.01, '#d9b45a', 0, HANG + 0.22, z + 0.03));
      break;
    }
    case 'bild-dr-no': {
      // Dr. No: dunkles, zur Seite gekämmtes Haar mit grauen Schläfen, hohe Stirn, buschige Brauen,
      // runde Drahtbrille, warmer Teint, leichtes Schmunzeln; weißer Kittel über dunkelblauem Polo,
      // Stethoskop mit goldenem Kopf und Abzeichen
      const z = WALL_Z;
      const skin = '#d9a47a';
      const ring = (r: number, tube: number, arc: number, color: string, x: number, y: number, zz: number, rot = 0) => {
        const t = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 6, 20, arc), toon(color));
        t.position.set(x, y, z + zz);
        t.rotation.z = rot;
        g.add(t);
      };
      g.add(b(0.62, 0.74, 0.04, '#8a6a3a', 0, HANG, z));
      g.add(b(0.54, 0.66, 0.01, '#6a8a96', 0, HANG, z + 0.022));
      // Kittel & Schultern, darin das dunkelblaue Polo (V-Ausschnitt mit Kragen)
      g.add(s(0.2, 0.088, 0.01, '#f4f1ea', 0, HANG - 0.237, z + 0.03));
      g.add(b(0.1, 0.12, 0.01, '#2c3150', 0, HANG - 0.2, z + 0.034));
      for (const sx of [-1, 1]) {
        const lapel = b(0.05, 0.13, 0.01, '#f4f1ea', sx * 0.075, HANG - 0.205, z + 0.036);
        lapel.rotation.z = sx * 0.32;
        g.add(lapel);
        const collar = b(0.045, 0.02, 0.01, '#3a4068', sx * 0.04, HANG - 0.125, z + 0.038);
        collar.rotation.z = -sx * 0.5;
        g.add(collar);
      }
      // Hals
      g.add(b(0.07, 0.06, 0.01, '#c08a5f', 0, HANG - 0.1, z + 0.032));
      // Stethoskop: Schlaufe um den Hals, Schläuche, goldener Kopf links, Abzeichen rechts
      ring(0.075, 0.006, Math.PI, '#26262c', 0, HANG - 0.14, 0.04, Math.PI);
      for (const sx of [-1, 1]) g.add(b(0.011, 0.12, 0.006, '#26262c', sx * 0.075, HANG - 0.2, z + 0.042));
      g.add(s(0.024, 0.024, 0.008, '#d9b45a', -0.075, HANG - 0.275, z + 0.044));
      g.add(s(0.01, 0.01, 0.006, '#26262c', 0.075, HANG - 0.265, z + 0.044));
      g.add(b(0.045, 0.032, 0.004, '#d9b45a', 0.14, HANG - 0.255, z + 0.036));
      // Kopf: Ohren, Gesicht, etwas kräftigerer Kiefer
      for (const sx of [-1, 1]) g.add(s(0.018, 0.032, 0.008, '#cf9a70', sx * 0.105, HANG + 0.045, z + 0.036));
      g.add(s(0.1, 0.125, 0.01, skin, 0, HANG + 0.05, z + 0.04));
      g.add(s(0.085, 0.07, 0.01, skin, 0, HANG - 0.005, z + 0.041));
      // dunkelbraunes Haar, zur Seite gekämmt, graue Schläfen
      g.add(s(0.105, 0.05, 0.011, '#4a3326', 0.004, HANG + 0.155, z + 0.043));
      g.add(s(0.065, 0.03, 0.011, '#5a4132', -0.03, HANG + 0.132, z + 0.045));
      for (const sx of [-1, 1]) g.add(s(0.016, 0.05, 0.011, '#a9a3a0', sx * 0.092, HANG + 0.1, z + 0.044));
      // buschige dunkle Brauen (innen etwas höher – gütig)
      for (const sx of [-1, 1]) {
        const br = b(0.062, 0.02, 0.01, '#2e2220', sx * 0.045, HANG + 0.09, z + 0.05);
        br.rotation.z = sx * -0.1;
        g.add(br);
      }
      // Augen mit Glanzpunkt, runde Drahtbrille mit Steg und Bügeln
      for (const sx of [-1, 1]) {
        g.add(s(0.011, 0.012, 0.005, '#1c1412', sx * 0.04, HANG + 0.05, z + 0.053));
        g.add(s(0.0035, 0.0035, 0.003, '#ffffff', sx * 0.04 + 0.004, HANG + 0.055, z + 0.057));
        ring(0.032, 0.0035, Math.PI * 2, '#8a7a58', sx * 0.045, HANG + 0.05, 0.052);
        g.add(b(0.02, 0.004, 0.004, '#8a7a58', sx * 0.087, HANG + 0.056, z + 0.05));
        g.add(s(0.02, 0.012, 0.004, '#e0a088', sx * 0.06, HANG - 0.012, z + 0.05));
      }
      g.add(b(0.016, 0.004, 0.004, '#8a7a58', 0, HANG + 0.058, z + 0.052));
      // Nase und leichtes, ein wenig schiefes Schmunzeln
      g.add(s(0.015, 0.024, 0.008, '#c28a60', 0, HANG + 0.005, z + 0.052));
      ring(0.034, 0.003, Math.PI * 0.6, '#8a4a40', 0, HANG - 0.034, 0.052, Math.PI * 1.2 + 0.08);
      break;
    }
    case 'poster-grusel': {
      const z = WALL_Z;
      g.add(b(0.52, 0.74, 0.01, '#2a2238', 0, HANG, z));
      // Mond, Kürbis mit leuchtenden Augen, Titelbalken – ausgedachter Film
      g.add(c(0.1, 0.01, '#f7efc0', 0.12, HANG + 0.2, z + 0.008).rotateX(Math.PI / 2));
      g.add(s(0.14, 0.11, 0.01, '#e8873a', 0, HANG - 0.08, z + 0.01));
      g.add(b(0.03, 0.05, 0.01, '#5a7a3a', 0, HANG + 0.04, z + 0.012));
      for (const dx of [-0.05, 0.05]) g.add(b(0.03, 0.025, 0.01, '#ffe17a', dx, HANG - 0.06, z + 0.016));
      g.add(b(0.08, 0.015, 0.01, '#ffe17a', 0, HANG - 0.12, z + 0.016));
      g.add(b(0.44, 0.07, 0.01, '#9a3a4a', 0, HANG - 0.28, z + 0.008));
      g.add(b(0.34, 0.02, 0.01, '#f1efe9', 0, HANG - 0.28, z + 0.014));
      break;
    }
    case 'wandregal': {
      const z = WALL_Z + 0.1;
      g.add(b(1.6, 0.05, 0.22, col, 0, HANG - 0.1, z));
      for (const dx of [-0.6, 0.6]) g.add(b(0.04, 0.12, 0.04, DARK_WOOD, dx, HANG - 0.17, WALL_Z + 0.02));
      // Bücher
      const books = ['#f4a3b8', '#5b6fa8', '#f7d26a', '#9ad8c0', '#e85a8a'];
      books.forEach((bc, i) => g.add(b(0.06, 0.2 + (i % 2) * 0.04, 0.16, bc, -0.6 + i * 0.075, HANG + 0.03 + (i % 2) * 0.02, z)));
      // Pflänzchen im Topf & Kerze
      g.add(c(0.07, 0.1, '#d98a5f', 0.15, HANG - 0.02, z));
      g.add(s(0.1, 0.09, 0.09, '#6fb06a', 0.15, HANG + 0.1, z));
      g.add(c(0.04, 0.09, '#fbf3e2', 0.5, HANG - 0.03, z));
      g.add(s(0.015, 0.025, 0.015, '#ffd76a', 0.5, HANG + 0.03, z));
      break;
    }
    case 'wanduhr': {
      const z = WALL_Z;
      const face = c(0.25, 0.05, col, 0, HANG + 0.05, z + 0.02);
      face.rotation.x = Math.PI / 2;
      g.add(face);
      const inner = c(0.21, 0.01, '#fffaf2', 0, HANG + 0.05, z + 0.05);
      inner.rotation.x = Math.PI / 2;
      g.add(inner);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        g.add(b(0.012, i % 3 === 0 ? 0.04 : 0.02, 0.01, '#4a4048', Math.sin(a) * 0.17, HANG + 0.05 + Math.cos(a) * 0.17, z + 0.058));
      }
      g.add(b(0.016, 0.13, 0.01, '#4a4048', 0.03, HANG + 0.09, z + 0.062).rotateZ(-0.5));
      g.add(b(0.012, 0.17, 0.01, '#4a4048', -0.02, HANG + 0.12, z + 0.064).rotateZ(0.25));
      break;
    }
    case 'rollbild': {
      const z = WALL_Z;
      g.add(c(0.02, 0.5, DARK_WOOD, 0, HANG + 0.42, z + 0.03).rotateZ(Math.PI / 2));
      g.add(b(0.4, 0.86, 0.01, '#e8dcc0', 0, HANG, z + 0.01));
      g.add(b(0.32, 0.6, 0.01, '#fbf6ea', 0, HANG + 0.02, z + 0.015));
      // Berge & Kranich
      g.add(c(0.14, 0.01, '#9aa8b8', -0.04, HANG - 0.14, z + 0.02, cone).rotateX(Math.PI / 2));
      g.add(c(0.1, 0.01, '#b8c4d0', 0.08, HANG - 0.16, z + 0.022, cone).rotateX(Math.PI / 2));
      g.add(s(0.05, 0.015, 0.01, '#3a3440', 0.02, HANG + 0.12, z + 0.022));
      g.add(s(0.012, 0.012, 0.01, '#d9534f', -0.03, HANG + 0.13, z + 0.024));
      g.add(c(0.025, 0.46, DARK_WOOD, 0, HANG - 0.44, z + 0.03).rotateZ(Math.PI / 2));
      break;
    }
    case 'wimpelkette': {
      const z = WALL_Z + 0.02;
      const cols = ['#f4a3b8', '#ffe17a', '#9ad8c0', '#a9c8ff', '#d6b3ff', '#f7c6d4'];
      for (let i = 0; i < 9; i++) {
        const x = -0.8 + i * 0.2;
        const sag = Math.sin((i / 8) * Math.PI) * 0.12;
        const flag = c(0.07, 0.01, cols[i % cols.length], x, HANG + 0.18 - sag, z, new THREE.ConeGeometry(1, 1, 3));
        flag.rotation.x = Math.PI / 2;
        flag.rotation.z = Math.PI;
        flag.scale.set(0.07, 0.01, 0.12);
        g.add(flag);
      }
      for (let i = 0; i < 8; i++) {
        const x0 = -0.8 + i * 0.2;
        const y0 = HANG + 0.24 - Math.sin((i / 8) * Math.PI) * 0.12;
        const y1 = HANG + 0.24 - Math.sin(((i + 1) / 8) * Math.PI) * 0.12;
        const seg = b(0.2, 0.008, 0.008, '#8a7a70', x0 + 0.1, (y0 + y1) / 2, z);
        seg.rotation.z = Math.atan2(y1 - y0, 0.2);
        g.add(seg);
      }
      break;
    }
    case 'fotowand': {
      const z = WALL_Z + 0.02;
      glow = glowMat('#ffe9a8');
      const photos = ['#f4a3b8', '#a9c8ff', '#9ad8c0', '#ffe17a', '#d6b3ff', '#f7c6d4'];
      for (let i = 0; i < 6; i++) {
        const x = -0.65 + i * 0.26;
        const sag = Math.sin((i / 5) * Math.PI) * 0.1;
        const tilt = (i % 2 ? 1 : -1) * 0.08;
        const ph = new THREE.Group();
        ph.position.set(x, HANG - sag, z);
        ph.rotation.z = tilt;
        ph.add(b(0.2, 0.24, 0.01, '#ffffff', 0, -0.1, 0));
        ph.add(b(0.16, 0.16, 0.01, photos[i], 0, -0.08, 0.004));
        // kleine Figur auf dem Foto (Kopf & Körper)
        ph.add(s(0.03, 0.03, 0.005, '#f2c9a8', 0, -0.06, 0.01));
        ph.add(b(0.05, 0.04, 0.005, darken(photos[i], 0.3), 0, -0.11, 0.01));
        ph.add(b(0.02, 0.04, 0.012, '#c9955f', 0, 0.02, 0.006));
        g.add(ph);
      }
      for (let i = 0; i < 11; i++) {
        const x = -0.78 + i * 0.156;
        const sag = Math.sin((i / 10) * Math.PI) * 0.1;
        g.add(mesh(new THREE.SphereGeometry(0.022, 8, 6), glow).translateX(x).translateY(HANG + 0.03 - sag).translateZ(z + 0.01));
      }
      lightAt = new THREE.Vector3(0, HANG - 0.2, z + 0.9);
      break;
    }
    case 'spiegel-rund': {
      const z = WALL_Z;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.03, 8, 28), toon('#d9b45a'));
      ring.position.set(0, HANG + 0.05, z + 0.03);
      g.add(ring);
      const glass = c(0.23, 0.01, new THREE.MeshToonMaterial({ color: '#cfe4ee', emissive: '#bfe0f0', emissiveIntensity: 0.25 }), 0, HANG + 0.05, z + 0.02);
      glass.rotation.x = Math.PI / 2;
      g.add(glass);
      // Lichtreflex
      g.add(b(0.04, 0.16, 0.005, '#ffffff', -0.08, HANG + 0.1, z + 0.028).rotateZ(-0.6));
      break;
    }
    case 'trockenkranz': {
      const z = WALL_Z + 0.03;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.035, 8, 24), toon('#c9a77a'));
      ring.position.set(0, HANG + 0.05, z);
      g.add(ring);
      const bits = ['#a58bd6', '#8fae8a', '#f4a3b8', '#a58bd6', '#8fae8a', '#e8c06a', '#f4a3b8', '#8fae8a'];
      bits.forEach((bc, i) => {
        const a = (i / bits.length) * Math.PI * 2;
        g.add(s(0.045, 0.03, 0.03, bc, Math.cos(a) * 0.2, HANG + 0.05 + Math.sin(a) * 0.2, z + 0.02));
      });
      g.add(b(0.08, 0.06, 0.01, '#f7efe2', 0, HANG - 0.17, z + 0.04));
      break;
    }
    // ---------------------------------------------------------------- Cottagecore
    case 'landhaustisch': {
      g.add(b(1.84, 0.07, 0.86, col, 0, 0.6, 0));
      g.add(b(1.7, 0.08, 0.74, darken(col, 0.12), 0, 0.53, 0));
      for (const [x, z] of [[-0.8, -0.34], [0.8, -0.34], [-0.8, 0.34], [0.8, 0.34]]) {
        g.add(c(0.05, 0.52, darken(col, 0.1), x, 0.26, z));
        for (const y of [0.12, 0.3, 0.44]) g.add(s(0.065, 0.03, 0.065, darken(col, 0.18), x, y, z));
      }
      // Kerben & ein Laib Brot auf dem Brett
      g.add(b(0.4, 0.03, 0.26, darken(col, 0.1), -0.45, 0.65, 0.05));
      g.add(s(0.14, 0.07, 0.09, '#d9a066', -0.45, 0.7, 0.05));
      break;
    }
    case 'bluemchensessel': {
      g.add(b(0.72, 0.22, 0.66, col, 0, 0.26, 0.02));
      g.add(b(0.72, 0.56, 0.16, col, 0, 0.6, -0.27));
      for (const x of [-0.34, 0.34]) g.add(b(0.12, 0.3, 0.62, darken(col, 0.06), x, 0.42, 0.02));
      g.add(b(0.6, 0.08, 0.5, lighten(col, 0.12), 0, 0.41, 0.06));
      // Streublümchen auf dem Polster
      for (const [x, y, z] of [[-0.2, 0.7, -0.18], [0.15, 0.55, -0.18], [0.05, 0.8, -0.18], [-0.1, 0.46, 0.25], [0.2, 0.46, 0.15]]) g.add(s(0.025, 0.025, 0.012, '#fbf3e6', x, y, z));
      for (const [x, z] of [[-0.3, -0.26], [0.3, -0.26], [-0.3, 0.3], [0.3, 0.3]]) g.add(c(0.03, 0.15, '#8a5a3a', x, 0.075, z));
      seatY = 0.46;
      break;
    }
    case 'haekelteppich': {
      const rings = ['#f7efe2', col, '#f7efe2', '#a9c4a0', '#f7efe2', '#f2c14e'];
      rings.forEach((rc, i) => {
        const r = 0.95 - i * 0.15;
        const m = c(r, 0.012 + i * 0.002, rc, 0, 0.006 + i * 0.002, 0);
        g.add(m);
      });
      // Bogenkante (gehäkelt)
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        g.add(s(0.07, 0.01, 0.07, col, Math.cos(a) * 0.95, 0.006, Math.sin(a) * 0.95));
      }
      break;
    }
    case 'kraeutertoepfe': {
      for (const [x, leaf] of [[-0.18, '#6fb06a'], [0, '#8fae8a'], [0.18, '#5a8a52']] as const) {
        g.add(c(0.075, 0.12, '#d98a5f', x, 0.06, 0));
        g.add(c(0.082, 0.025, darken('#d98a5f', 0.1), x, 0.12, 0));
        for (let k = 0; k < 4; k++) g.add(s(0.04, 0.06, 0.04, leaf, x + Math.cos(k * 1.6) * 0.03, 0.17 + k * 0.012, Math.sin(k * 1.6) * 0.03));
      }
      break;
    }
    case 'kerzenleuchter': {
      g.add(c(0.1, 0.02, '#c9a24a', 0, 0.01, 0));
      g.add(c(0.02, 0.18, '#c9a24a', 0, 0.1, 0));
      g.add(b(0.34, 0.025, 0.03, '#c9a24a', 0, 0.2, 0));
      glow = glowMat('#ffd76a');
      for (const x of [-0.15, 0, 0.15]) {
        const top = x === 0 ? 0.3 : 0.22;
        g.add(c(0.03, 0.02, '#c9a24a', x, top - 0.01, 0));
        g.add(c(0.022, 0.12, '#fbf3e2', x, top + 0.06, 0));
        g.add(mesh(new THREE.SphereGeometry(0.02, 8, 6), glow).translateX(x).translateY(top + 0.14));
      }
      lightAt = new THREE.Vector3(0, 0.45, 0);
      break;
    }
    case 'wollkorb': {
      g.add(c(0.28, 0.3, '#b98a5e', 0, 0.15, 0));
      for (let i = 0; i < 6; i++) g.add(c(0.285, 0.015, '#a97c56', 0, 0.04 + i * 0.05, 0));
      for (const [x, z, wc] of [[-0.1, 0.05, '#f4a3b8'], [0.1, -0.05, '#9ad8c0'], [0, 0.1, '#f7d26a'], [0.05, -0.12, '#a9c8ff']] as const) g.add(s(0.11, 0.11, 0.11, wc, x, 0.33, z));
      const needle = c(0.008, 0.36, '#d9c8ad', 0.05, 0.42, 0.02);
      needle.rotation.z = 0.7;
      g.add(needle);
      break;
    }
    // ---------------------------------------------------------------- Retro-Oma-Chic
    case 'ohrensessel': {
      g.add(b(0.74, 0.24, 0.66, col, 0, 0.27, 0.02));
      g.add(b(0.74, 0.78, 0.18, col, 0, 0.66, -0.26));
      // „Ohren“
      for (const x of [-0.34, 0.34]) g.add(b(0.1, 0.28, 0.24, darken(col, 0.05), x, 0.92, -0.18));
      for (const x of [-0.35, 0.35]) g.add(s(0.08, 0.1, 0.33, darken(col, 0.08), x, 0.46, 0.02));
      g.add(b(0.58, 0.08, 0.52, lighten(col, 0.1), 0, 0.43, 0.06));
      // Häkeldeckchen auf der Lehne
      g.add(b(0.26, 0.16, 0.02, '#fbf6ec', 0, 0.94, -0.16));
      for (const [x, z] of [[-0.3, -0.26], [0.3, -0.26], [-0.3, 0.3], [0.3, 0.3]]) {
        const leg = c(0.025, 0.16, '#6e4630', x, 0.08, z);
        leg.rotation.x = z > 0 ? 0.2 : -0.2;
        g.add(leg);
      }
      seatY = 0.47;
      break;
    }
    case 'nierentisch': {
      const top = s(0.42, 0.025, 0.3, '#2a2a30', 0, 0.42, 0);
      g.add(top);
      g.add(s(0.36, 0.028, 0.24, col, -0.03, 0.43, 0));
      for (const [x, z] of [[-0.25, -0.15], [0.28, -0.1], [0, 0.2]]) {
        const leg = c(0.015, 0.44, '#c9a24a', x, 0.21, z);
        leg.rotation.z = -x * 0.5;
        leg.rotation.x = z * 0.6;
        g.add(leg);
        g.add(s(0.025, 0.02, 0.025, '#2a2a30', x * 1.2, 0.01, z * 1.2));
      }
      break;
    }
    case 'fransenlampe': {
      g.add(c(0.16, 0.04, '#6e4630', 0, 0.02, 0));
      g.add(c(0.02, 1.05, '#c9a24a', 0, 0.55, 0));
      glow = glowMat('#ffcf8a');
      const shade = mesh(new THREE.CylinderGeometry(0.16, 0.28, 0.3, 16, 1, true), glow);
      shade.position.y = 1.18;
      g.add(shade);
      for (let i = 0; i < 20; i++) {
        const a = (i / 20) * Math.PI * 2;
        g.add(b(0.012, 0.1, 0.012, col, Math.cos(a) * 0.28, 0.98, Math.sin(a) * 0.28));
      }
      lightAt = new THREE.Vector3(0, 1.1, 0);
      break;
    }
    case 'bonbonschale': {
      g.add(c(0.04, 0.06, '#dfeff5', 0, 0.03, 0));
      const bowl = mesh(new THREE.SphereGeometry(0.16, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), new THREE.MeshToonMaterial({ color: '#dfeff5', transparent: true, opacity: 0.75, side: THREE.DoubleSide }));
      bowl.position.y = 0.2;
      g.add(bowl);
      const sweets = ['#e85a8a', '#f7d26a', '#9ad8c0', '#a9c8ff', '#f4a3b8', '#d9534f'];
      sweets.forEach((sc, i) => {
        const a = (i / sweets.length) * Math.PI * 2;
        g.add(s(0.04, 0.03, 0.03, sc, Math.cos(a) * 0.07, 0.13 + (i % 2) * 0.02, Math.sin(a) * 0.07));
      });
      break;
    }
    case 'perserteppich': {
      g.add(b(1.9, 0.02, 1.9, darken(col, 0.22), 0, 0.01, 0));
      g.add(b(1.6, 0.022, 1.6, '#1f3a5a', 0, 0.011, 0));
      g.add(b(1.4, 0.024, 1.4, col, 0, 0.012, 0));
      const med = c(0.45, 0.026, '#e0b04a', 0, 0.013, 0);
      g.add(med);
      g.add(c(0.3, 0.028, '#1f3a5a', 0, 0.014, 0));
      for (const [x, z] of [[-0.55, -0.55], [0.55, -0.55], [-0.55, 0.55], [0.55, 0.55]]) g.add(c(0.14, 0.027, '#e0b04a', x, 0.013, z));
      // Fransen
      for (let i = 0; i < 18; i++) for (const z of [-0.99, 0.99]) g.add(b(0.02, 0.008, 0.08, '#f3ead8', -0.85 + i * 0.1, 0.006, z));
      break;
    }
    case 'gummibaum': {
      g.add(c(0.17, 0.3, '#f3ead8', 0, 0.15, 0));
      g.add(c(0.18, 0.03, '#c9a24a', 0, 0.28, 0));
      g.add(c(0.02, 0.8, '#6e4630', 0, 0.68, 0));
      for (let i = 0; i < 9; i++) {
        const a = i * 2.3;
        const y = 0.5 + i * 0.07;
        const leaf = s(0.14, 0.03, 0.07, '#2f5a3a', Math.cos(a) * 0.12, y, Math.sin(a) * 0.12);
        leaf.rotation.y = -a;
        leaf.rotation.z = 0.3;
        g.add(leaf);
      }
      break;
    }
    // ---------------------------------------------------------------- Modern
    case 'loungesofa': {
      g.add(b(1.9, 0.22, 0.86, col, 0, 0.17, 0));
      g.add(b(1.9, 0.3, 0.2, darken(col, 0.06), 0, 0.42, -0.33));
      for (const x of [-0.85, 0.85]) g.add(b(0.2, 0.22, 0.86, darken(col, 0.04), x, 0.36, 0));
      for (const x of [-0.37, 0.37]) g.add(b(0.72, 0.09, 0.66, lighten(col, 0.08), x, 0.32, 0.06));
      for (const [x, rc] of [[-0.5, '#f4a3b8'], [-0.1, '#f2efea'], [0.45, darken(col, 0.25)]] as const) g.add(b(0.32, 0.28, 0.1, rc, x, 0.5, -0.18).rotateZ(x * 0.2));
      for (const [x, z] of [[-0.85, -0.35], [0.85, -0.35], [-0.85, 0.35], [0.85, 0.35]]) g.add(b(0.05, 0.06, 0.05, '#2a2a30', x, 0.03, z));
      seatY = 0.38;
      break;
    }
    case 'marmortisch': {
      g.add(c(0.42, 0.05, '#f4f2ee', 0, 0.35, 0));
      // graue Adern
      for (const [x, z, r] of [[-0.1, 0.05, 0.4], [0.12, -0.12, -0.6], [0.05, 0.2, 1.1]] as const) g.add(b(0.4, 0.004, 0.012, '#b9b6c0', x, 0.377, z).rotateY(r));
      g.add(c(0.03, 0.32, '#2a2a30', 0, 0.16, 0));
      g.add(c(0.22, 0.02, '#2a2a30', 0, 0.01, 0));
      break;
    }
    case 'bogenlampe': {
      g.add(b(0.3, 0.06, 0.3, '#f4f2ee', -0.25, 0.03, -0.25));
      // Bogen aus Segmenten
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        pts.push(new THREE.Vector3(-0.25 + t * 0.6, 0.06 + Math.sin(t * Math.PI * 0.62) * 1.5, -0.25 + t * 0.5));
      }
      const arc = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, 0.018, 6, false), toon('#2a2a30'));
      g.add(arc);
      glow = glowMat('#fff1c8');
      const end = pts[pts.length - 1];
      const shade = mesh(new THREE.SphereGeometry(0.17, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), toon('#2a2a30', { side: THREE.DoubleSide }));
      shade.position.set(end.x, end.y - 0.02, end.z);
      g.add(shade);
      const bulb = mesh(new THREE.SphereGeometry(0.06, 10, 8), glow);
      bulb.position.set(end.x, end.y - 0.04, end.z);
      g.add(bulb);
      lightAt = new THREE.Vector3(end.x, end.y - 0.2, end.z);
      break;
    }
    case 'wuerfelregal': {
      const wood = '#e3c9a0';
      g.add(b(1.84, 0.04, 0.42, wood, 0, 0.9, 0));
      g.add(b(1.84, 0.04, 0.42, wood, 0, 0.46, 0));
      g.add(b(1.84, 0.04, 0.42, wood, 0, 0.02, 0));
      for (const x of [-0.9, -0.3, 0.3, 0.9]) g.add(b(0.04, 0.9, 0.42, wood, x, 0.46, 0));
      g.add(b(1.84, 0.88, 0.02, darken(wood, 0.1), 0, 0.46, -0.2));
      // Inhalt: Körbe & Bücher
      g.add(b(0.5, 0.3, 0.32, '#d9c8ad', -0.6, 0.2, 0.02));
      g.add(b(0.5, 0.3, 0.32, '#2a2a30', 0.6, 0.62, 0.02));
      for (let i = 0; i < 5; i++) g.add(b(0.06, 0.3 - (i % 2) * 0.04, 0.26, ['#f4a3b8', '#4a4a52', '#f2efea', '#9ab8a8', '#e8c06a'][i], -0.15 + i * 0.075, 0.62, 0));
      g.add(c(0.08, 0.16, '#f2efea', 0.1, 0.12, 0));
      g.add(s(0.1, 0.1, 0.1, '#6fb06a', 0.1, 0.26, 0));
      break;
    }
    case 'sitzsack': {
      g.add(s(0.42, 0.24, 0.4, col, 0, 0.22, 0));
      g.add(s(0.36, 0.26, 0.2, darken(col, 0.06), 0, 0.4, -0.2));
      g.add(s(0.2, 0.05, 0.2, lighten(col, 0.1), 0, 0.42, 0.06));
      seatY = 0.36;
      break;
    }
    case 'keramikvase': {
      g.add(s(0.09, 0.11, 0.09, '#e9e4dc', 0, 0.11, 0));
      g.add(c(0.035, 0.08, '#e9e4dc', 0, 0.24, 0));
      g.add(c(0.008, 0.3, '#7a8a74', 0.02, 0.4, 0).rotateZ(-0.15));
      for (let i = 0; i < 6; i++) g.add(s(0.03, 0.02, 0.01, '#9ab8a8', 0.02 + (i % 2 ? 0.03 : -0.03) + i * 0.008, 0.3 + i * 0.045, 0));
      break;
    }
    // ---------------------------------------------------------------- Mid-Century & Bauhaus
    case 'lederloungesessel': {
      const walnut = '#5e3e28';
      // Sitzschale & Rückenschale aus Nussbaum, Lederpolster
      const seat = b(0.7, 0.08, 0.62, walnut, 0, 0.34, 0.04);
      seat.rotation.x = -0.12;
      g.add(seat);
      g.add(b(0.62, 0.1, 0.54, col, 0, 0.41, 0.05).rotateX(-0.12));
      const back = b(0.7, 0.62, 0.08, walnut, 0, 0.72, -0.28);
      back.rotation.x = -0.32;
      g.add(back);
      const cushion = b(0.6, 0.54, 0.1, col, 0, 0.73, -0.22);
      cushion.rotation.x = -0.32;
      g.add(cushion);
      for (const x of [-0.36, 0.36]) g.add(b(0.08, 0.06, 0.5, walnut, x, 0.52, 0.04));
      for (const x of [-0.36, 0.36]) g.add(b(0.07, 0.04, 0.42, col, x, 0.56, 0.06));
      // Sternfuß aus Metall
      g.add(c(0.04, 0.26, '#2a2a30', 0, 0.16, 0));
      for (let i = 0; i < 5; i++) {
        const a2 = (i / 5) * Math.PI * 2;
        const arm = b(0.34, 0.03, 0.04, '#2a2a30', Math.cos(a2) * 0.16, 0.03, Math.sin(a2) * 0.16);
        arm.rotation.y = -a2;
        g.add(arm);
      }
      seatY = 0.46;
      break;
    }
    case 'freischwinger': {
      const chrome = '#d9dde3';
      // gebogenes Rohr: Kufen, Front, Sitz
      for (const x of [-0.24, 0.24]) {
        g.add(c(0.018, 0.56, chrome, x, 0.02, 0.02).rotateX(Math.PI / 2));
        g.add(c(0.018, 0.44, chrome, x, 0.22, 0.3));
        g.add(c(0.018, 0.5, chrome, x, 0.66, -0.24));
      }
      g.add(b(0.52, 0.05, 0.46, col, 0, 0.45, 0.06));
      g.add(b(0.48, 0.36, 0.04, col, 0, 0.72, -0.22).rotateX(-0.08));
      // Rahmen aus Holz um Sitz & Lehne
      g.add(b(0.54, 0.03, 0.48, '#2a2a30', 0, 0.42, 0.06));
      seatY = 0.47;
      break;
    }
    case 'teaksideboard': {
      const teak = '#b0703f';
      g.add(b(1.84, 0.4, 0.46, teak, 0, 0.42, 0));
      g.add(b(1.86, 0.03, 0.48, lighten(teak, 0.08), 0, 0.635, 0));
      // Schiebetüren & Griffmulden
      for (const x of [-0.6, 0, 0.6]) {
        g.add(b(0.56, 0.34, 0.01, darken(teak, 0.06), x, 0.42, 0.235));
        g.add(b(0.03, 0.12, 0.012, darken(teak, 0.3), x + 0.2, 0.44, 0.242));
      }
      for (const [x, z] of [[-0.82, -0.17], [0.82, -0.17], [-0.82, 0.17], [0.82, 0.17]]) {
        const leg = c(0.022, 0.26, '#3a2a20', x, 0.11, z);
        leg.rotation.z = x > 0 ? -0.18 : 0.18;
        leg.rotation.x = z > 0 ? -0.12 : 0.12;
        g.add(leg);
      }
      break;
    }
    case 'satztische': {
      const teak = '#b0703f';
      for (const [w, h, x, z, top] of [[0.62, 0.46, 0, -0.05, '#b0703f'], [0.5, 0.36, 0.06, 0.02, '#f2c14e'], [0.38, 0.26, 0.12, 0.09, '#d9483b']] as const) {
        g.add(b(w, 0.03, w * 0.8, top, x, h, z));
        for (const sx of [-1, 1]) g.add(b(0.03, h, 0.03, teak, x + sx * (w / 2 - 0.03), h / 2, z + w * 0.35));
        for (const sx of [-1, 1]) g.add(b(0.03, h, 0.03, teak, x + sx * (w / 2 - 0.03), h / 2, z - w * 0.35));
      }
      break;
    }
    case 'tripodlampe': {
      for (let i = 0; i < 3; i++) {
        const a2 = (i / 3) * Math.PI * 2;
        const leg = c(0.018, 1.2, '#8a5a3a', Math.cos(a2) * 0.14, 0.58, Math.sin(a2) * 0.14);
        leg.rotation.z = -Math.cos(a2) * 0.22;
        leg.rotation.x = Math.sin(a2) * 0.22;
        g.add(leg);
      }
      glow = glowMat('#fff1c8');
      const shade = mesh(new THREE.CylinderGeometry(0.1, 0.26, 0.3, 18, 1, true), toon('#2a2a30', { side: THREE.DoubleSide }));
      shade.position.y = 1.25;
      g.add(shade);
      const bulb = mesh(new THREE.SphereGeometry(0.06, 10, 8), glow);
      bulb.position.y = 1.18;
      g.add(bulb);
      lightAt = new THREE.Vector3(0, 1.0, 0);
      break;
    }
    case 'opal-leuchte': {
      g.add(c(0.08, 0.02, '#d9dde3', 0, 0.01, 0));
      g.add(c(0.012, 0.18, '#d9dde3', 0, 0.1, 0));
      glow = glowMat('#fffaf0');
      const ball = mesh(new THREE.SphereGeometry(0.12, 18, 12), glow);
      ball.position.y = 0.3;
      g.add(ball);
      lightAt = new THREE.Vector3(0, 0.35, 0);
      break;
    }
    case 'formenteppich': {
      g.add(b(1.9, 0.02, 1.9, '#f4efe4', 0, 0.01, 0));
      g.add(b(1.92, 0.021, 0.06, '#2a2a30', 0, 0.0105, -0.93));
      g.add(b(1.92, 0.021, 0.06, '#2a2a30', 0, 0.0105, 0.93));
      g.add(c(0.38, 0.024, '#d9483b', -0.42, 0.012, -0.38));
      g.add(b(0.62, 0.024, 0.62, '#3a5fa8', 0.42, 0.012, 0.36));
      const tri = mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.024, 3), toon('#f2c14e'));
      tri.position.set(0.45, 0.013, -0.42);
      g.add(tri);
      g.add(b(1.2, 0.025, 0.05, '#2a2a30', -0.2, 0.0125, 0.52));
      break;
    }
    case 'formenbild': {
      const z = WALL_Z;
      g.add(b(0.6, 0.6, 0.03, '#2a2a30', 0, HANG, z));
      g.add(b(0.54, 0.54, 0.01, '#f4efe4', 0, HANG, z + 0.02));
      const circ = c(0.12, 0.01, '#d9483b', -0.1, HANG + 0.1, z + 0.028);
      circ.rotation.x = Math.PI / 2;
      g.add(circ);
      g.add(b(0.18, 0.18, 0.01, '#3a5fa8', 0.1, HANG - 0.1, z + 0.026));
      const tri = mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.01, 3), toon('#f2c14e'));
      tri.rotation.x = Math.PI / 2;
      tri.position.set(-0.11, HANG - 0.12, z + 0.03);
      g.add(tri);
      g.add(b(0.4, 0.02, 0.01, '#2a2a30', 0.02, HANG + 0.0, z + 0.03).rotateZ(0.5));
      break;
    }
    // ---------------------------------------------------------------- Linas Lieblinge
    case 'bett': {
      // 2 × 2: Rahmen, Matratze, Kissen und eine dicke, gesteppte Gewichtsdecke
      g.add(b(1.9, 0.2, 1.9, '#a98b6a', 0, 0.1, 0));
      g.add(b(1.9, 0.6, 0.1, '#8a6a4a', 0, 0.45, -0.9));
      g.add(b(1.8, 0.16, 1.8, '#f7f5ec', 0, 0.28, 0.02));
      for (const x of [-0.45, 0.45]) g.add(s(0.34, 0.09, 0.2, '#ffffff', x, 0.4, -0.68));
      g.add(b(1.76, 0.17, 1.2, col, 0, 0.42, 0.28));
      // Steppnähte und Wulst am Fußende
      for (let i = 0; i < 4; i++) g.add(b(1.74, 0.006, 0.02, lighten(col, 0.3), 0, 0.515, -0.24 + i * 0.3));
      for (let i = 0; i < 5; i++) g.add(b(0.02, 0.006, 1.18, lighten(col, 0.3), -0.7 + i * 0.35, 0.516, 0.28));
      g.add(c(0.09, 1.76, darken(col, 0.1), 0, 0.46, 0.86).rotateZ(Math.PI / 2));
      seatY = 0.5;
      break;
    }
    case 'kaktus': {
      g.add(c(0.1, 0.12, '#e8a07a', 0, 0.06, 0));
      g.add(s(0.08, 0.14, 0.08, '#4f9a5a', 0, 0.2, 0));
      g.add(s(0.03, 0.06, 0.03, '#4f9a5a', 0.09, 0.2, 0));
      g.add(s(0.022, 0.014, 0.022, '#f4a3b8', 0, 0.33, 0));
      break;
    }
    case 'sukkulenten': {
      g.add(b(0.4, 0.09, 0.26, '#e6e1d8', 0, 0.045, 0));
      for (const [x, z, col2] of [[-0.12, 0, '#7fc08a'], [0.04, -0.04, '#9ad0a8'], [0.14, 0.04, '#6fb07a'], [-0.04, 0.06, '#b0d8a0'], [0.1, -0.07, '#8fc0b0']] as const) {
        for (let i = 0; i < 6; i++) {
          const a2 = (i / 6) * Math.PI * 2;
          g.add(s(0.02, 0.015, 0.03, col2, x + Math.cos(a2) * 0.03, 0.12, z + Math.sin(a2) * 0.03).rotateY(-a2));
        }
        g.add(s(0.02, 0.02, 0.02, col2, x, 0.125, z));
      }
      break;
    }
    case 'yucca': {
      g.add(c(0.2, 0.36, '#c9a24a', 0, 0.18, 0));
      g.add(c(0.05, 0.62, '#8a6a4a', 0, 0.62, 0));
      for (let i = 0; i < 14; i++) {
        const a2 = (i / 14) * Math.PI * 2;
        const lean = 0.5 + (i % 3) * 0.2;
        const leaf = c(0.015, 0.5, '#4f9a5a', Math.cos(a2) * 0.1, 1.15, Math.sin(a2) * 0.1, cone);
        leaf.rotation.set(Math.sin(a2) * lean, 0, -Math.cos(a2) * lean);
        g.add(leaf);
      }
      break;
    }
    case 'haengepflanze': {
      const z = WALL_Z + 0.12;
      g.add(b(0.04, 0.1, 0.18, DARK_WOOD, 0, HANG + 0.1, WALL_Z + 0.06));
      g.add(c(0.1, 0.14, '#f3ead8', 0, HANG + 0.12, z));
      for (let i = 0; i < 7; i++) {
        const x = (i - 3) * 0.04;
        const len = 0.35 + (i % 3) * 0.2;
        g.add(b(0.012, len, 0.012, '#4f9a5a', x, HANG + 0.05 - len / 2, z + 0.05));
        for (let k = 0; k < 3; k++) g.add(s(0.035, 0.012, 0.025, '#5fb06a', x, HANG + 0.0 - k * len / 3.2, z + 0.06));
      }
      break;
    }
    case 'waermflasche': {
      const knit = '#e8a0b8';
      g.add(b(0.26, 0.04, 0.34, knit, 0, 0.03, 0));
      g.add(b(0.26, 0.04, 0.34, lighten(knit, 0.15), 0, 0.075, 0));
      g.add(s(0.14, 0.05, 0.19, knit, 0, 0.055, 0));
      g.add(c(0.035, 0.05, '#c9cbd3', 0, 0.09, -0.19));
      for (let i = 0; i < 5; i++) g.add(b(0.24, 0.006, 0.012, lighten(knit, 0.4), 0, 0.08, -0.12 + i * 0.06));
      break;
    }
    case 'bento-box': {
      g.add(b(0.34, 0.1, 0.24, '#3a3036', 0, 0.05, 0));
      g.add(b(0.34, 0.012, 0.012, '#c9a24a', 0, 0.105, -0.12));
      g.add(b(0.34, 0.012, 0.012, '#c9a24a', 0, 0.105, 0.12));
      for (const [x, z, col2] of [[-0.09, -0.05, '#f7d35a'], [0.09, -0.05, '#f39a4a'], [-0.09, 0.06, '#f7f5ec'], [0.09, 0.06, '#fbe0e8']] as const) g.add(b(0.14, 0.02, 0.09, col2, x, 0.105, z));
      g.add(s(0.025, 0.015, 0.025, '#e8484f', 0.09, 0.125, 0.06));
      break;
    }
    // ---------------------------------------------------------------- Französisches Bistro
    case 'bistrotisch': {
      g.add(c(0.34, 0.04, '#f4f2ee', 0, 0.7, 0));
      for (const [x, z, r] of [[-0.1, 0.05, 0.4], [0.1, -0.1, -0.6]] as const) g.add(b(0.3, 0.004, 0.01, '#b9b6c0', x, 0.722, z).rotateY(r));
      g.add(c(0.37, 0.016, '#2a2a30', 0, 0.676, 0));
      g.add(c(0.035, 0.64, '#2a2a30', 0, 0.34, 0));
      g.add(c(0.2, 0.025, '#2a2a30', 0, 0.0125, 0));
      for (const a2 of [0, 2.1, 4.2]) g.add(b(0.24, 0.025, 0.03, '#2a2a30', Math.cos(a2) * 0.1, 0.03, Math.sin(a2) * 0.1).rotateY(-a2));
      break;
    }
    case 'bistrostuhl': {
      const wood = col;
      g.add(c(0.24, 0.04, '#c99a68', 0, 0.45, 0.02));
      for (const [x, z] of [[-0.18, -0.12], [0.18, -0.12], [-0.17, 0.2], [0.17, 0.2]] as const) {
        const leg = c(0.018, 0.46, wood, x, 0.22, z);
        leg.rotation.z = -x * 0.25;
        g.add(leg);
      }
      g.add(c(0.22, 0.012, wood, 0, 0.25, 0.04));
      // geschwungene Lehne: Bogen und Stäbe
      const arc = mesh(new THREE.TorusGeometry(0.2, 0.017, 6, 16, Math.PI), toon(wood));
      arc.position.set(0, 0.72, -0.2);
      arc.rotation.x = -0.1;
      g.add(arc);
      for (const x of [-0.12, 0, 0.12]) g.add(c(0.012, 0.28, wood, x, 0.6, -0.2));
      seatY = 0.47;
      break;
    }
    case 'barhocker': {
      g.add(c(0.2, 0.05, col, 0, 0.64, 0));
      g.add(c(0.2, 0.012, '#c9a24a', 0, 0.61, 0));
      g.add(c(0.025, 0.58, '#2a2a30', 0, 0.3, 0));
      g.add(c(0.17, 0.02, '#2a2a30', 0, 0.01, 0));
      const ring = mesh(new THREE.TorusGeometry(0.12, 0.012, 6, 18), toon('#c9a24a'));
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.22;
      g.add(ring);
      seatY = 0.66;
      break;
    }
    case 'zinktheke': {
      g.add(b(1.85, 0.9, 0.5, '#7a4a2e', 0, 0.45, 0));
      for (const x of [-0.6, 0, 0.6]) g.add(b(0.52, 0.7, 0.01, '#8d5a38', x, 0.45, 0.255));
      g.add(b(1.92, 0.04, 0.56, '#c3c8d0', 0, 0.92, 0));
      g.add(b(1.92, 0.018, 0.04, '#9aa0a8', 0, 0.955, 0.27));
      g.add(c(0.025, 0.04, '#c9a24a', -0.3, 0.97, -0.12));
      // Messing-Fußleiste
      g.add(c(0.012, 1.85, '#c9a24a', 0, 0.12, 0.27).rotateZ(Math.PI / 2));
      break;
    }
    case 'kreidetafel': {
      const z = WALL_Z;
      g.add(b(0.8, 0.62, 0.04, '#7a4a2e', 0, HANG, z + 0.02));
      g.add(b(0.72, 0.54, 0.01, '#2f3a36', 0, HANG, z + 0.047));
      for (const [y, w] of [[0.15, 0.4], [0.05, 0.5], [-0.05, 0.34], [-0.15, 0.44]] as const) g.add(b(w, 0.014, 0.004, '#f4f2ee', -0.05, HANG + y, z + 0.054));
      g.add(s(0.03, 0.026, 0.004, '#f4a3b8', 0.28, HANG - 0.17, z + 0.054));
      g.add(b(0.3, 0.02, 0.004, '#f4f2ee', 0, HANG + 0.22, z + 0.054));
      break;
    }
    case 'weinregal': {
      const wood = '#8a5a3a';
      g.add(b(0.8, 1.0, 0.05, wood, 0, 0.5, -0.2));
      for (const x of [-0.38, 0.38]) g.add(b(0.04, 1.0, 0.42, wood, x, 0.5, 0));
      for (const y of [0.02, 0.36, 0.7, 1.0]) g.add(b(0.8, 0.03, 0.42, wood, 0, y, 0));
      const cols = ['#3f5a3a', '#5a2a34', '#3f5a3a', '#2f4a30'];
      for (let row = 0; row < 3; row++) for (let i = 0; i < 4; i++) {
        const bottle = c(0.045, 0.3, cols[(i + row) % 4], -0.27 + i * 0.18, 0.15 + row * 0.34 + 0.06, 0.0).rotateX(Math.PI / 2);
        bottle.position.z = 0;
        g.add(bottle);
        g.add(c(0.018, 0.04, '#c9a24a', -0.27 + i * 0.18, 0.19 + row * 0.34, 0.17).rotateX(Math.PI / 2));
      }
      break;
    }
    case 'bistrolampe': {
      g.add(c(0.08, 0.02, '#c9a24a', 0, 0.01, 0));
      g.add(c(0.012, 0.2, '#c9a24a', 0, 0.12, 0));
      glow = glowMat('#fff0b8');
      const shade = mesh(new THREE.CylinderGeometry(0.05, 0.12, 0.1, 14, 1, true), toon(col, { side: THREE.DoubleSide }));
      shade.position.set(0, 0.26, 0);
      g.add(shade);
      g.add(s(0.045, 0.035, 0.045, glow, 0, 0.23, 0));
      lightAt = new THREE.Vector3(0, 0.3, 0);
      break;
    }
    case 'goldspiegel': {
      const z = WALL_Z + 0.02;
      const frame = mesh(new THREE.TorusGeometry(0.26, 0.03, 8, 28), toon('#d9b45a'));
      frame.scale.set(0.7, 1, 1);
      frame.position.set(0, HANG, z + 0.02);
      g.add(frame);
      const glass = c(0.26, 0.012, new THREE.MeshToonMaterial({ color: '#cfe4ee', emissive: '#bfe0f0', emissiveIntensity: 0.25 }), 0, HANG, z + 0.012);
      glass.rotation.x = Math.PI / 2;
      glass.scale.x = 0.18;
      glass.scale.z = 0.26;
      g.add(glass);
      g.add(s(0.04, 0.04, 0.02, '#d9b45a', 0, HANG + 0.3, z + 0.03));
      break;
    }
    case 'etagere': {
      g.add(c(0.17, 0.012, '#f4f2ee', 0, 0.02, 0));
      g.add(c(0.012, 0.3, '#c9a24a', 0, 0.17, 0));
      g.add(c(0.12, 0.012, '#f4f2ee', 0, 0.3, 0));
      g.add(c(0.045, 0.012, '#c9a24a', 0, 0.34, 0));
      for (const [x, z] of [[-0.08, 0.03], [0.08, -0.02], [0, 0.08]] as const) {
        const croissant = mesh(new THREE.TorusGeometry(0.035, 0.022, 7, 12, Math.PI * 1.35), toon('#e6a557'));
        croissant.position.set(x, 0.054, z);
        croissant.rotation.x = Math.PI / 2;
        croissant.rotation.z = x * 6;
        g.add(croissant);
      }
      for (const x of [-0.04, 0.04]) {
        const t = mesh(new THREE.TorusGeometry(0.03, 0.018, 7, 12, Math.PI * 1.35), toon('#e6a557'));
        t.position.set(x, 0.325, 0);
        t.rotation.x = Math.PI / 2;
        g.add(t);
      }
      break;
    }
    case 'eiffelmodell': {
      const iron = '#4a4f58';
      g.add(b(0.2, 0.02, 0.2, DARK_WOOD, 0, 0.01, 0));
      g.add(c(0.08, 0.14, iron, 0, 0.09, 0, cone));
      g.add(b(0.14, 0.012, 0.14, iron, 0, 0.1, 0));
      g.add(c(0.045, 0.14, iron, 0, 0.2, 0, cone));
      g.add(b(0.08, 0.01, 0.08, iron, 0, 0.21, 0));
      g.add(c(0.02, 0.17, iron, 0, 0.3, 0, cone));
      break;
    }
    case 'bistrolaeufer': {
      g.add(b(1.9, 0.02, 0.9, '#a83a44', 0, 0.01, 0));
      g.add(b(1.92, 0.021, 0.06, '#f3e6cf', 0, 0.0105, -0.42));
      g.add(b(1.92, 0.021, 0.06, '#f3e6cf', 0, 0.0105, 0.42));
      for (let i = 0; i < 6; i++) g.add(b(0.22, 0.022, 0.05, '#c9565e', -0.78 + i * 0.31, 0.011, 0));
      break;
    }
    case 'sonnenspiegel': {
      const z = WALL_Z + 0.02;
      for (let i = 0; i < 20; i++) {
        const a2 = (i / 20) * Math.PI * 2;
        const len = i % 2 ? 0.16 : 0.22;
        const ray = b(0.018, len, 0.012, '#d9b45a', Math.cos(a2) * (0.16 + len / 2), HANG + 0.05 + Math.sin(a2) * (0.16 + len / 2), z);
        ray.rotation.z = a2 - Math.PI / 2;
        g.add(ray);
        if (i % 2 === 0) g.add(s(0.02, 0.02, 0.01, '#e8c06a', Math.cos(a2) * (0.16 + len), HANG + 0.05 + Math.sin(a2) * (0.16 + len), z + 0.004));
      }
      const glass = c(0.15, 0.012, new THREE.MeshToonMaterial({ color: '#cfe4ee', emissive: '#bfe0f0', emissiveIntensity: 0.25 }), 0, HANG + 0.05, z + 0.01);
      glass.rotation.x = Math.PI / 2;
      g.add(glass);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.155, 0.015, 8, 24), toon('#d9b45a'));
      ring.position.set(0, HANG + 0.05, z + 0.012);
      g.add(ring);
      break;
    }
    // ---------------------------------------------------------------- Fest-Geschenke
    case 'sparschwein': {
      const pink = '#f6a8be';
      g.add(s(0.15, 0.12, 0.11, pink, 0, 0.13, 0));
      g.add(c(0.045, 0.04, darken(pink, 0.08), 0, 0.13, 0.13).rotateX(Math.PI / 2));
      for (const x of [-0.016, 0.016]) g.add(s(0.008, 0.012, 0.005, darken(pink, 0.35), x, 0.13, 0.152));
      for (const [x, z] of [[-0.08, -0.05], [0.08, -0.05], [-0.08, 0.05], [0.08, 0.05]]) g.add(c(0.025, 0.06, darken(pink, 0.06), x, 0.03, z));
      for (const x of [-0.06, 0.06]) g.add(s(0.012, 0.012, 0.008, '#2a2a30', x, 0.18, 0.09));
      g.add(b(0.07, 0.008, 0.01, '#6e4630', 0, 0.255, 0));
      // Weihnachtsmütze
      g.add(c(0.075, 0.03, '#ffffff', -0.02, 0.24, -0.02));
      const hat = c(0.065, 0.13, '#e8484f', -0.02, 0.31, -0.02, cone);
      hat.rotation.z = 0.35;
      g.add(hat);
      g.add(s(0.022, 0.022, 0.022, '#ffffff', -0.07, 0.37, -0.02));
      break;
    }
    case 'weihnachtsstern': {
      g.add(c(0.17, 0.26, '#d9b45a', 0, 0.13, 0));
      g.add(c(0.18, 0.03, darken('#d9b45a', 0.15), 0, 0.26, 0));
      g.add(c(0.15, 0.02, '#6e4a36', 0, 0.265, 0));
      for (let ring = 0; ring < 2; ring++) {
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2 + ring * 0.5;
          const r = ring === 0 ? 0.2 : 0.12;
          const leaf = s(0.11 - ring * 0.03, 0.015, 0.05, ring === 0 ? '#2f7a4a' : '#d8343c', Math.cos(a) * r, 0.36 + ring * 0.05, Math.sin(a) * r);
          leaf.rotation.y = -a;
          leaf.rotation.z = 0.25;
          g.add(leaf);
        }
      }
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const leaf = s(0.08, 0.015, 0.04, '#e8484f', Math.cos(a) * 0.07, 0.45, Math.sin(a) * 0.07);
        leaf.rotation.y = -a;
        g.add(leaf);
      }
      g.add(s(0.03, 0.02, 0.03, '#f2c94c', 0, 0.47, 0));
      break;
    }
    case 'kuscheldecke': {
      g.add(b(1.86, 0.04, 0.9, '#c94a5a', 0, 0.02, 0));
      for (let i = 0; i < 7; i++) g.add(b(0.07, 0.042, 0.9, '#f0d7a8', -0.78 + i * 0.26, 0.022, 0));
      for (let i = 0; i < 4; i++) g.add(b(1.86, 0.043, 0.06, '#7a2f3a', 0, 0.023, -0.33 + i * 0.22));
      // eine umgeschlagene Ecke
      const fold = b(0.4, 0.05, 0.3, '#d65a6a', 0.66, 0.05, 0.25);
      fold.rotation.y = 0.5;
      g.add(fold);
      break;
    }
    // ---------------------------------------------------------------- Winterzauber
    case 'weihnachtsbaum': {
      g.add(c(0.2, 0.2, '#c9302c', 0, 0.1, 0));
      g.add(c(0.21, 0.03, '#f2c94c', 0, 0.19, 0));
      g.add(c(0.04, 0.12, '#7a5236', 0, 0.26, 0));
      const greens = ['#2f7a4a', '#3a8a56', '#4a9a62'];
      [[0.42, 0.5, 0.5], [0.33, 0.45, 0.82], [0.22, 0.38, 1.1], [0.12, 0.28, 1.33]].forEach(([r, h, y], i) => g.add(c(r, h, greens[i % 3], 0, y, 0, cone)));
      const balls = ['#e8484f', '#f2c94c', '#5b7fc2', '#e85a8a', '#ffffff'];
      for (let i = 0; i < 14; i++) {
        const t = i / 14;
        const r = (1 - t) * 0.38 + 0.06;
        const a = i * 2.4;
        g.add(s(0.03, 0.03, 0.03, balls[i % balls.length], Math.cos(a) * r, 0.4 + t * 0.95, Math.sin(a) * r));
      }
      glow = glowMat('#ffe08a');
      for (let i = 0; i < 18; i++) {
        const t = i / 18;
        const r = (1 - t) * 0.4 + 0.05;
        const a = i * 1.15;
        g.add(s(0.016, 0.016, 0.016, glow, Math.cos(a) * r, 0.36 + t * 1.0, Math.sin(a) * r));
      }
      const star = c(0.07, 0.03, glow, 0, 1.52, 0, new THREE.CylinderGeometry(1, 1, 1, 5));
      star.rotation.x = Math.PI / 2;
      g.add(star);
      lightAt = new THREE.Vector3(0, 0.9, 0.2);
      break;
    }
    case 'adventskranz': {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.05, 8, 20), toon('#2f7a4a'));
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.05;
      g.add(ring);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        g.add(s(0.03, 0.025, 0.03, i % 2 ? '#3a8a56' : '#4a9a62', Math.cos(a) * 0.15, 0.08, Math.sin(a) * 0.15));
      }
      glow = glowMat('#ffd36b');
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const x = Math.cos(a) * 0.15;
        const z = Math.sin(a) * 0.15;
        g.add(c(0.025, 0.12, '#d8343c', x, 0.14, z));
        g.add(s(0.012, 0.022, 0.012, glow, x, 0.22, z));
      }
      for (const a of [0.3, 2.2, 4.0]) g.add(s(0.018, 0.018, 0.018, '#e8484f', Math.cos(a) * 0.19, 0.09, Math.sin(a) * 0.19));
      g.add(b(0.06, 0.012, 0.012, '#a0613a', 0.02, 0.1, 0.17).rotateY(0.4));
      lightAt = new THREE.Vector3(0, 0.3, 0);
      break;
    }
    case 'kaminofen': {
      const iron = '#3a3a44';
      g.add(b(0.5, 0.05, 0.5, '#8a8a92', 0, 0.025, 0.02));
      for (const [x, z] of [[-0.17, -0.15], [0.17, -0.15], [-0.17, 0.15], [0.17, 0.15]]) g.add(c(0.03, 0.12, iron, x, 0.11, z));
      g.add(b(0.42, 0.52, 0.38, iron, 0, 0.42, 0));
      g.add(b(0.46, 0.04, 0.42, darken(iron, 0.2), 0, 0.7, 0));
      glow = glowMat('#ff9a3a');
      g.add(b(0.26, 0.2, 0.01, glow, 0, 0.42, 0.195));
      g.add(b(0.3, 0.03, 0.02, '#8a8a92', 0, 0.535, 0.2));
      g.add(b(0.3, 0.03, 0.02, '#8a8a92', 0, 0.305, 0.2));
      for (const x of [-0.06, 0.04]) g.add(s(0.06, 0.03, 0.03, '#8a5a3a', x, 0.35, 0.1));
      g.add(c(0.07, 1.2, iron, 0, 1.3, -0.08));
      g.add(c(0.075, 0.03, darken(iron, 0.2), 0, 0.9, -0.08));
      lightAt = new THREE.Vector3(0, 0.45, 0.4);
      break;
    }
    case 'lebkuchenhaus': {
      const ginger = '#b8763f';
      g.add(b(0.24, 0.015, 0.24, '#ffffff', 0, 0.008, 0));
      g.add(b(0.18, 0.12, 0.15, ginger, 0, 0.075, 0));
      for (const side of [-1, 1]) {
        const roof = b(0.11, 0.015, 0.18, '#ffffff', side * 0.05, 0.17, 0);
        roof.rotation.z = -side * 0.75;
        g.add(roof);
      }
      g.add(b(0.04, 0.06, 0.01, '#7a4a2a', 0, 0.045, 0.078));
      for (const [x, col] of [[-0.055, '#e8484f'], [0.055, '#8fd08a']] as const) g.add(b(0.03, 0.03, 0.01, col, x, 0.095, 0.078));
      for (const x of [-0.08, -0.03, 0.03, 0.08]) g.add(s(0.008, 0.008, 0.008, ['#e8484f', '#f2c94c', '#5b7fc2', '#e85a8a'][Math.abs(Math.round(x * 50)) % 4], x, 0.14, 0.078));
      break;
    }
    case 'nussknacker': {
      g.add(c(0.06, 0.02, '#2f7a4a', 0, 0.01, 0));
      for (const x of [-0.025, 0.025]) g.add(c(0.018, 0.09, '#2a2a30', x, 0.065, 0));
      g.add(c(0.045, 0.1, '#d8343c', 0, 0.16, 0));
      g.add(b(0.1, 0.012, 0.03, '#f2c94c', 0, 0.16, 0.03));
      for (const x of [-0.06, 0.06]) g.add(c(0.014, 0.08, '#d8343c', x, 0.17, 0));
      g.add(c(0.035, 0.06, '#f7d9c4', 0, 0.24, 0));
      g.add(b(0.05, 0.02, 0.012, '#ffffff', 0, 0.225, 0.034));
      for (const x of [-0.012, 0.012]) g.add(s(0.005, 0.005, 0.004, '#2a2a30', x, 0.25, 0.035));
      g.add(c(0.04, 0.07, '#2a2a30', 0, 0.305, 0));
      g.add(c(0.042, 0.012, '#f2c94c', 0, 0.272, 0));
      break;
    }
    case 'flockenteppich': {
      g.add(b(1.9, 0.03, 1.9, '#bfe0f0', 0, 0.015, 0));
      g.add(b(1.94, 0.028, 1.94, '#ffffff', 0, 0.012, 0));
      for (const [x, z, r] of [[-0.45, -0.4, 0.28], [0.5, 0.35, 0.32], [0.45, -0.5, 0.18], [-0.5, 0.5, 0.2], [0, 0, 0.14]] as const) {
        for (let i = 0; i < 3; i++) {
          const arm = b(r * 2, 0.034, 0.04, '#ffffff', x, 0.017, z);
          arm.rotation.y = (i / 3) * Math.PI;
          g.add(arm);
        }
      }
      break;
    }
    case 'lichtervorhang': {
      const z = WALL_Z + 0.02;
      g.add(b(1.8, 0.012, 0.012, '#6e6a70', 0, HANG + 0.42, z));
      glow = glowMat('#ffe6a3');
      for (let i = 0; i < 12; i++) {
        const x = -0.82 + i * 0.15;
        const len = 0.35 + ((i * 37) % 5) * 0.08;
        g.add(b(0.006, len, 0.006, '#6e6a70', x, HANG + 0.42 - len / 2, z));
        for (let k = 1; k <= 3; k++) g.add(s(0.02, 0.026, 0.02, glow, x, HANG + 0.42 - (len * k) / 3, z + 0.01));
      }
      lightAt = new THREE.Vector3(0, HANG, z + 0.3);
      break;
    }
    case 'weihnachtsstrumpf': {
      const z = WALL_Z + 0.04;
      g.add(b(0.01, 0.06, 0.01, '#6e6a70', 0, HANG + 0.27, z));
      g.add(b(0.16, 0.07, 0.05, '#ffffff', 0, HANG + 0.2, z));
      g.add(b(0.13, 0.26, 0.04, '#d8343c', 0, HANG + 0.03, z));
      g.add(s(0.1, 0.06, 0.04, '#d8343c', 0.04, HANG - 0.1, z));
      g.add(s(0.05, 0.04, 0.042, '#ffffff', 0.1, HANG - 0.11, z));
      g.add(b(0.13, 0.025, 0.042, '#2f7a4a', 0, HANG + 0.07, z));
      g.add(s(0.022, 0.022, 0.022, '#f2c94c', 0.02, HANG + 0.26, z + 0.02));
      break;
    }
    case 'schlitten': {
      const red = '#d8343c';
      for (const z of [-0.2, 0.2]) {
        g.add(b(1.5, 0.04, 0.04, red, 0, 0.04, z));
        const tip = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 6, 12, Math.PI), toon(red));
        tip.position.set(0.75, 0.16, z);
        tip.rotation.z = -Math.PI / 2;
        g.add(tip);
        for (const x of [-0.5, 0, 0.45]) g.add(b(0.04, 0.16, 0.04, '#8a5a3a', x, 0.14, z));
      }
      for (let i = 0; i < 5; i++) g.add(b(1.3, 0.035, 0.1, i % 2 ? '#c9955f' : '#b98a5e', -0.05, 0.24, -0.2 + i * 0.1));
      g.add(c(0.012, 0.6, '#8a7a70', 0.9, 0.24, 0).rotateX(Math.PI / 2));
      break;
    }
    case 'schneemann': {
      if (modelSeason === 'winter') {
        g.add(s(0.32, 0.28, 0.32, '#ffffff', 0, 0.27, 0));
        g.add(s(0.23, 0.21, 0.23, '#ffffff', 0, 0.7, 0));
        g.add(s(0.17, 0.16, 0.17, '#ffffff', 0, 1.03, 0));
        for (const x of [-0.06, 0.06]) g.add(s(0.022, 0.022, 0.015, '#2a2a30', x, 1.07, 0.155));
        const nose = c(0.03, 0.14, '#f08a3a', 0, 1.02, 0.22, cone);
        nose.rotation.x = Math.PI / 2;
        g.add(nose);
        for (let i = 0; i < 5; i++) g.add(s(0.012, 0.012, 0.01, '#2a2a30', -0.08 + i * 0.04, 0.97 - Math.sin((i / 4) * Math.PI) * 0.03, 0.15));
        for (const y of [0.62, 0.72, 0.82]) g.add(s(0.022, 0.022, 0.015, '#2a2a30', 0, y, 0.22));
        // Schal & Mütze
        const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.04, 8, 18), toon('#e8484f'));
        scarf.rotation.x = Math.PI / 2;
        scarf.position.y = 0.89;
        g.add(scarf);
        g.add(b(0.08, 0.18, 0.03, '#e8484f', 0.1, 0.8, 0.13).rotateZ(0.2));
        g.add(c(0.15, 0.06, '#2a2a30', 0, 1.17, 0));
        g.add(c(0.11, 0.16, '#2a2a30', 0, 1.27, 0));
        g.add(c(0.112, 0.03, '#e8484f', 0, 1.22, 0));
        // Ast-Arme
        for (const side of [-1, 1]) {
          const arm = b(0.4, 0.025, 0.025, '#7a5236', side * 0.38, 0.8, 0);
          arm.rotation.z = side * 0.45;
          g.add(arm);
          const twig = b(0.1, 0.02, 0.02, '#7a5236', side * 0.55, 0.92, 0);
          twig.rotation.z = side * 1.2;
          g.add(twig);
        }
      } else {
        // getaut: Pfütze mit Mütze, Nase und Ästen
        g.add(c(0.38, 0.012, '#cfe4ee', 0, 0.006, 0));
        g.add(c(0.15, 0.06, '#2a2a30', -0.05, 0.04, 0));
        g.add(c(0.11, 0.1, '#2a2a30', -0.05, 0.11, 0));
        const nose = c(0.03, 0.14, '#f08a3a', 0.2, 0.025, 0.1, cone);
        nose.rotation.z = Math.PI / 2;
        g.add(nose);
        for (const [x, z, r] of [[0.1, -0.18, 0.3], [-0.2, 0.15, -0.5]] as const) g.add(b(0.36, 0.02, 0.02, '#7a5236', x, 0.015, z).rotateY(r));
        for (const [x, z] of [[0.05, 0.2], [-0.12, -0.1], [0.18, -0.05]] as const) g.add(s(0.02, 0.012, 0.02, '#2a2a30', x, 0.012, z));
      }
      break;
    }
    case 'schneekugel-wir': {
      g.add(c(0.1, 0.06, '#c9955f', 0, 0.03, 0));
      g.add(c(0.105, 0.012, '#d9b45a', 0, 0.06, 0));
      g.add(b(0.08, 0.04, 0.05, '#f7c6d4', 0, 0.09, -0.02));
      const roof = c(0.06, 0.04, '#e8484f', 0, 0.13, -0.02, new THREE.ConeGeometry(1, 1, 4));
      roof.rotation.y = Math.PI / 4;
      g.add(roof);
      for (const [x, col, h] of [[-0.05, '#7a4a2a', 0.05], [-0.025, '#2a2a30', 0.055]] as const) {
        g.add(c(0.01, h, col, x, 0.065 + h / 2, 0.04));
        g.add(s(0.012, 0.012, 0.012, '#f7d9c4', x, 0.07 + h, 0.04));
      }
      g.add(s(0.016, 0.008, 0.008, '#b5653a', 0.04, 0.072, 0.05));
      g.add(s(0.105, 0.105, 0.105, new THREE.MeshToonMaterial({ color: '#e8f4ff', transparent: true, opacity: 0.4 }), 0, 0.15, 0));
      for (const [x, y, z] of [[-0.04, 0.2, 0.03], [0.05, 0.18, -0.03], [0.01, 0.23, 0.05], [-0.06, 0.15, -0.05]] as const) g.add(s(0.008, 0.008, 0.008, '#ff8fb1', x, y, z));
      break;
    }
    // ---------------------------------------------------------------- Japandi
    case 'japandi-daybed': {
      const oak = '#d9b98c';
      g.add(b(1.86, 0.12, 0.84, oak, 0, 0.14, 0));
      for (const [x, z] of [[-0.85, -0.35], [0.85, -0.35], [-0.85, 0.35], [0.85, 0.35]]) g.add(b(0.08, 0.1, 0.08, darken(oak, 0.1), x, 0.04, z));
      g.add(b(1.78, 0.14, 0.76, col, 0, 0.27, 0.02));
      g.add(b(1.86, 0.3, 0.08, oak, 0, 0.35, -0.39));
      for (const [x, rc] of [[-0.55, lighten(col, 0.12)], [0.35, darken(col, 0.12)]] as const) g.add(b(0.4, 0.26, 0.12, rc, x, 0.46, -0.28).rotateZ(x * 0.12));
      g.add(b(0.5, 0.03, 0.7, darken(col, 0.18), 0.6, 0.355, 0.04));
      seatY = 0.36;
      break;
    }
    case 'lattenregal': {
      g.add(b(1.84, 0.04, 0.44, col, 0, 0.48, 0));
      g.add(b(1.8, 0.34, 0.4, darken(col, 0.05), 0, 0.29, 0));
      for (let i = 0; i < 17; i++) g.add(b(0.06, 0.32, 0.012, lighten(col, 0.06), -0.84 + i * 0.105, 0.29, 0.205));
      for (const x of [-0.82, 0.82]) for (const z of [-0.16, 0.16]) g.add(b(0.05, 0.12, 0.05, darken(col, 0.2), x, 0.06, z));
      g.add(s(0.07, 0.1, 0.07, '#e9e4dc', 0.45, 0.6, 0));
      g.add(c(0.006, 0.28, '#7a6a52', 0.45, 0.78, 0).rotateZ(0.2));
      break;
    }
    case 'papierleuchte': {
      g.add(c(0.14, 0.03, '#b98a5e', 0, 0.015, 0));
      g.add(c(0.015, 1.05, '#b98a5e', 0, 0.54, 0));
      glow = glowMat('#fff3d8');
      const ball = mesh(new THREE.SphereGeometry(0.26, 16, 12), glow);
      ball.position.y = 1.28;
      g.add(ball);
      for (const y of [-0.12, 0, 0.12]) g.add(c(Math.sqrt(0.26 * 0.26 - y * y) + 0.003, 0.006, '#efe2c8', 0, 1.28 + y, 0));
      lightAt = new THREE.Vector3(0, 1.2, 0);
      break;
    }
    case 'linienbild': {
      const z = WALL_Z;
      g.add(b(0.5, 0.66, 0.03, '#d9b98c', 0, HANG, z));
      g.add(b(0.44, 0.6, 0.01, '#f7f2e8', 0, HANG, z + 0.02));
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 12; i++) {
        const t = i / 12;
        pts.push(new THREE.Vector3(-0.14 + t * 0.26, HANG - 0.2 + t * 0.38 + Math.sin(t * Math.PI * 2) * 0.05, z + 0.03));
      }
      g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.012, 5, false), toon('#2a2a30')));
      g.add(s(0.025, 0.025, 0.006, '#c94a3a', 0.13, HANG - 0.22, z + 0.028));
      break;
    }
    // ---------------------------------------------------------------- Skandinavisch
    case 'skandi-sofa': {
      const oak = '#d9b98c';
      for (const [x, z] of [[-0.8, -0.28], [0.8, -0.28], [-0.8, 0.28], [0.8, 0.28]]) {
        const leg = c(0.025, 0.2, oak, x, 0.1, z);
        leg.rotation.z = x > 0 ? -0.2 : 0.2;
        g.add(leg);
      }
      g.add(b(1.84, 0.16, 0.72, col, 0, 0.28, 0));
      for (const x of [-0.42, 0.42]) g.add(b(0.82, 0.1, 0.62, lighten(col, 0.08), x, 0.41, 0.04));
      g.add(b(1.84, 0.4, 0.16, darken(col, 0.06), 0, 0.55, -0.28));
      for (const x of [-0.86, 0.86]) g.add(b(0.12, 0.26, 0.72, darken(col, 0.04), x, 0.44, 0));
      g.add(b(0.34, 0.3, 0.1, '#f2ede3', -0.5, 0.6, -0.15).rotateZ(0.15));
      for (let i = 0; i < 4; i++) g.add(b(0.34, 0.02, 0.102, '#e3dccd', -0.5, 0.5 + i * 0.07, -0.15).rotateZ(0.15));
      seatY = 0.44;
      break;
    }
    case 'schaukelstuhl': {
      for (const x of [-0.24, 0.24]) {
        // Kufe: flacher Bogen, berührt den Boden in der Mitte
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 10; i++) {
          const z = -0.4 + i * 0.08;
          pts.push(new THREE.Vector3(x, 0.025 + z * z * 0.5, z));
        }
        g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.022, 6, false), toon(col)));
        for (const z of [-0.18, 0.2]) g.add(c(0.02, 0.32, col, x, 0.2, z));
        g.add(b(0.04, 0.04, 0.42, col, x, 0.56, 0.02));
      }
      g.add(b(0.52, 0.05, 0.46, col, 0, 0.38, 0));
      const back = b(0.5, 0.56, 0.04, col, 0, 0.68, -0.24);
      back.rotation.x = -0.18;
      g.add(back);
      g.add(b(0.44, 0.04, 0.4, '#f7f5ef', 0, 0.42, 0.02));
      const fell = b(0.4, 0.42, 0.04, '#f7f5ef', 0, 0.66, -0.2);
      fell.rotation.x = -0.18;
      g.add(fell);
      seatY = 0.42;
      break;
    }
    case 'skandi-esstisch': {
      const oak = '#d9b98c';
      g.add(c(0.44, 0.05, oak, 0, 0.7, 0));
      for (const a of [0.785, 2.356, 3.927, 5.498]) {
        const leg = c(0.025, 0.68, darken(oak, 0.06), Math.cos(a) * 0.25, 0.34, Math.sin(a) * 0.25);
        leg.rotation.set(Math.sin(a) * 0.12, 0, -Math.cos(a) * 0.12);
        g.add(leg);
      }
      break;
    }
    case 'skandi-stuhl': {
      for (const [x, z] of [[-0.18, -0.16], [0.18, -0.16], [-0.18, 0.16], [0.18, 0.16]]) {
        const leg = c(0.02, 0.44, col, x, 0.22, z);
        leg.rotation.set(z > 0 ? 0.08 : -0.08, 0, x > 0 ? -0.08 : 0.08);
        g.add(leg);
      }
      g.add(b(0.42, 0.04, 0.4, col, 0, 0.45, 0));
      g.add(b(0.42, 0.13, 0.03, col, 0, 0.78, -0.2));
      for (const x of [-0.18, 0.18]) g.add(c(0.016, 0.34, col, x, 0.62, -0.19));
      seatY = 0.47;
      break;
    }
    case 'rautenteppich': {
      g.add(b(1.86, 0.02, 1.86, '#f2ede3', 0, 0.01, 0));
      for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
          if ((i + j) % 2 !== 0) continue;
          // Raute aus vier Strichen um den Mittelpunkt
          for (const [dx, dz, r] of [[0.06, 0.06, Math.PI / 4], [-0.06, -0.06, Math.PI / 4], [0.06, -0.06, -Math.PI / 4], [-0.06, 0.06, -Math.PI / 4]] as const) {
            const d = b(0.17, 0.022, 0.022, '#2a2a30', i * 0.34 + dx, 0.011, j * 0.34 + dz);
            d.rotation.y = r;
            g.add(d);
          }
        }
      }
      for (let i = 0; i < 18; i++) for (const z of [-0.95, 0.95]) g.add(b(0.02, 0.008, 0.06, '#e3dccd', -0.85 + i * 0.1, 0.006, z));
      break;
    }
    case 'schaffell': {
      const fell = s(0.42, 0.03, 0.34, '#f7f5ef', 0, 0.02, 0);
      g.add(fell);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        g.add(s(0.08, 0.03, 0.06, '#f2efe6', Math.cos(a) * 0.38, 0.02, Math.sin(a) * 0.3));
      }
      break;
    }
    // ---------------------------------------------------------------- Minimalismus
    case 'kubus-sofa': {
      g.add(b(1.86, 0.34, 0.8, col, 0, 0.17, 0));
      g.add(b(1.86, 0.36, 0.18, darken(col, 0.05), 0, 0.52, -0.31));
      for (const x of [-0.84, 0.84]) g.add(b(0.18, 0.2, 0.8, darken(col, 0.03), x, 0.44, 0));
      g.add(b(1.5, 0.004, 0.6, darken(col, 0.08), 0, 0.342, 0.08));
      seatY = 0.36;
      break;
    }
    case 'plattformbett': {
      g.add(b(1.7, 0.08, 1.7, '#2f2f35', 0, 0.06, 0));
      g.add(b(1.86, 0.08, 1.86, '#d9b98c', 0, 0.14, 0));
      g.add(b(1.7, 0.16, 1.7, '#fbfaf6', 0, 0.26, 0.04));
      g.add(b(1.72, 0.06, 1.2, col, 0, 0.37, 0.28));
      for (const x of [-0.42, 0.42]) g.add(b(0.66, 0.1, 0.26, lighten(col, 0.12), x, 0.4, -0.62));
      g.add(b(1.86, 0.5, 0.06, '#d9b98c', 0, 0.42, -0.9));
      seatY = 0.36;
      break;
    }
    case 'linienleuchte': {
      g.add(b(0.3, 0.03, 0.18, '#2a2a30', 0, 0.015, 0));
      g.add(b(0.03, 1.4, 0.03, '#2a2a30', -0.06, 0.73, 0));
      glow = glowMat('#fff6e0');
      const bar = mesh(new THREE.BoxGeometry(0.035, 1.25, 0.035), glow);
      bar.position.set(0.0, 0.72, 0);
      g.add(bar);
      lightAt = new THREE.Vector3(0, 1.0, 0.2);
      break;
    }
    case 'plattentisch': {
      g.add(b(0.8, 0.26, 0.6, col, 0, 0.15, 0));
      g.add(b(0.86, 0.04, 0.66, lighten(col, 0.05), 0, 0.3, 0));
      g.add(b(0.72, 0.02, 0.52, darken(col, 0.25), 0, 0.01, 0));
      break;
    }
    case 'wollteppich': {
      g.add(b(1.86, 0.02, 1.86, darken(col, 0.08), 0, 0.01, 0));
      g.add(b(1.72, 0.022, 1.72, col, 0, 0.011, 0));
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

/** Halbdurchsichtige Vorschau beim Einrichten (grün = passt, rot = passt nicht) */
export function makeGhost(itemId: string, valid: boolean): THREE.Group {
  const m = makeFurniture(itemId);
  m.group.traverse((o) => {
    const mm = o as THREE.Mesh;
    if (!mm.isMesh) return;
    const mat = (mm.material as THREE.MeshToonMaterial).clone();
    mat.transparent = true;
    mat.opacity = 0.6;
    mat.emissive = new THREE.Color(valid ? '#7fe08a' : '#ff7a7a');
    mat.emissiveIntensity = 0.45;
    mm.material = mat;
    mm.castShadow = false;
  });
  const marker = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: valid ? '#7fe08a' : '#ff7a7a', transparent: true, opacity: 0.35, depthWrite: false }));
  marker.name = 'marker';
  m.group.add(marker);
  return m.group;
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
  // Symbole zeigen den Schneemann immer in voller Pracht
  const season = modelSeason;
  modelSeason = 'winter';
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
  modelSeason = season;
  return out;
}
