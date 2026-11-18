/**
 * Glühwürmchen auf den Dorfwiesen: kleine, weich leuchtende Punkte, die langsam schweben und sanft blinken.
 * Feste „Wiesen-Plätze“ (reproduzierbar aus der Karte), sichtbar nur in Linas Nähe – so wirkt es wie ein echter Schwarm
 * an der Stelle, an der sie gerade steht. Nur Stimmung (Regel: `core/fireflies.ts`).
 */
import * as THREE from 'three';
import { mulberry32 } from '../core/rng';
import { terrainAt, type WorldMap } from '../core/worldmap';
import { INSEL_Y0 } from '../data/maps/insel';

const COUNT = 140;
/** Nur Glühwürmchen in diesem Umkreis um Lina (Kacheln) werden gezeigt */
const RADIUS = 13;

function glowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,200,1)');
  g.addColorStop(0.25, 'rgba(230,255,120,0.55)');
  g.addColorStop(1, 'rgba(200,255,100,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

interface Fly {
  x: number;
  z: number;
  y: number;
  phase: number;
  speed: number;
  blink: number;
}

export class Fireflies3D {
  private readonly points: THREE.Points;
  private readonly flies: Fly[] = [];
  private readonly colors: Float32Array;
  private readonly positions: Float32Array;
  private time = 0;

  constructor(scene: THREE.Scene, map: WorldMap, private readonly heightAt: (x: number, z: number) => number) {
    const rnd = mulberry32(0x9e37);
    // Wiesenplätze im Dorf (nicht Insel, nicht gesperrt)
    const spots: Array<{ x: number; y: number }> = [];
    for (let y = 1; y < Math.min(map.height - 1, INSEL_Y0); y++) {
      for (let x = 1; x < map.width - 1; x++) if (terrainAt(map, x, y) === 'grass' && !map.staticBlocked[y * map.width + x]) spots.push({ x, y });
    }
    for (let i = 0; i < COUNT && spots.length > 0; i++) {
      const s = spots[Math.floor(rnd() * spots.length)];
      this.flies.push({ x: s.x + rnd(), z: s.y + rnd(), y: 0.35 + rnd() * 0.9, phase: rnd() * Math.PI * 2, speed: 0.4 + rnd() * 0.6, blink: 0.5 + rnd() * 1.5 });
    }
    this.positions = new Float32Array(this.flies.length * 3);
    this.colors = new Float32Array(this.flies.length * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.points = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ size: 0.44, map: glowTexture(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }),
    );
    this.points.frustumCulled = false;
    this.points.visible = false;
    scene.add(this.points);
  }

  /** `strength` 0..1 (siehe `fireflyStrength`), Lina steht bei (px, pz) in Kacheln */
  update(dt: number, strength: number, px: number, pz: number) {
    if (strength <= 0.01) {
      this.points.visible = false;
      return;
    }
    this.points.visible = true;
    this.time += dt;
    this.flies.forEach((f, i) => {
      const t = this.time * f.speed + f.phase;
      const x = f.x + Math.sin(t * 0.8) * 0.9;
      const z = f.z + Math.cos(t * 0.6) * 0.9;
      const y = Math.max(0, this.heightAt(x, z)) + f.y + Math.sin(t * 1.3) * 0.18;
      this.positions[i * 3] = x;
      this.positions[i * 3 + 1] = y;
      this.positions[i * 3 + 2] = z;
      // Blinken (sanft an/aus) × Nähe zu Lina × Dunkelheit
      const blink = Math.max(0, Math.sin(this.time * f.blink + f.phase * 3)) ** 1.5;
      const near = Math.max(0, 1 - Math.hypot(x - px, z - pz) / RADIUS);
      const v = blink * near * strength;
      this.colors[i * 3] = v;
      this.colors[i * 3 + 1] = v;
      this.colors[i * 3 + 2] = v * 0.7;
    });
    (this.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.points.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
  }
}
