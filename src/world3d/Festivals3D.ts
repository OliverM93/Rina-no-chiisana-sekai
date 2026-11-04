/**
 * Festschmuck im Dorf: Weihnachtsbaum auf dem Dorfplatz (Advent & Weihnachten),
 * Kürbisse vor den Häusern (Halloween), Luftballons an Linas Haus (Geburtstag).
 * Feuerwerk und Sternenhimmel laufen als Oberfläche (die Kamera zeigt keinen Himmel).
 */
import * as THREE from 'three';
import type { FestivalId } from '../core/festivals';
import { isActive, type WorldMap } from '../core/worldmap';
import { makeBalloons, makeChristmasTree, makePumpkin } from './models/buildings';

export class Festivals3D {
  private group = new THREE.Group();
  private key = '';
  private glows: THREE.MeshToonMaterial[] = [];
  private lights: THREE.PointLight[] = [];
  private time = 0;
  private balloons: THREE.Group[] = [];

  constructor(
    scene: THREE.Scene,
    private readonly map: WorldMap,
    private readonly heightAt: (x: number, z: number) => number,
  ) {
    scene.add(this.group);
  }

  private ground(x: number, z: number) {
    return Math.max(0, this.heightAt(x, z));
  }

  /** Schmuck passend zu den heutigen Festen aufbauen */
  refresh(fests: readonly FestivalId[]) {
    const houses = this.map.objects.filter((o) => (o.kind === 'house' || o.kind === 'bistro' || o.kind === 'praxis') && isActive(this.map, o.id));
    const key = fests.join(',') + '|' + houses.map((h) => h.id).join(',');
    if (key === this.key) return;
    this.key = key;
    this.group.clear();
    this.glows = [];
    this.lights = [];
    this.balloons = [];
    if (fests.includes('advent') || fests.includes('weihnachten')) {
      const tree = makeChristmasTree();
      tree.group.position.set(24.6, this.ground(24.6, 20.8), 20.8);
      this.group.add(tree.group);
      this.glows.push(tree.glow);
      const l = new THREE.PointLight('#ffd38a', 0, 6, 1.5);
      l.position.set(24.6, 1.8, 21.4);
      this.group.add(l);
      this.lights.push(l);
    }
    if (fests.includes('halloween')) {
      const glow = new THREE.MeshToonMaterial({ color: '#ffc04a', emissive: '#ff9a2a', emissiveIntensity: 0.6 });
      this.glows.push(glow);
      for (const h of houses) {
        for (const dx of [0.7, h.w - 0.7]) {
          const p = makePumpkin(glow);
          const x = h.x + dx;
          const z = h.y + h.h + 0.25;
          p.position.set(x, this.ground(x, z), z);
          p.rotation.y = (dx - 2) * 0.2;
          this.group.add(p);
        }
      }
    }
    if (fests.includes('geburtstag')) {
      const lina = this.map.objects.find((o) => o.id === 'haus-lina');
      if (lina) {
        for (const dx of [0.3, lina.w - 0.3]) {
          const b = makeBalloons();
          const x = lina.x + dx;
          const z = lina.y + lina.h + 0.2;
          b.position.set(x, this.ground(x, z), z);
          this.group.add(b);
          this.balloons.push(b);
        }
      }
    }
  }

  update(dt: number, night: number, visible: boolean) {
    this.time += dt;
    this.group.visible = visible;
    const lit = 0.35 + night * 1.2;
    for (const g of this.glows) g.emissiveIntensity = lit * (0.85 + Math.sin(this.time * 3) * 0.15);
    for (const l of this.lights) l.intensity = night * 2.2;
    this.balloons.forEach((b, i) => (b.rotation.z = Math.sin(this.time * 1.2 + i) * 0.06));
  }
}
