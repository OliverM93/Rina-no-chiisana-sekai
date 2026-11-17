/**
 * Luau am Inselstrand: Lagerfeuer in einem Steinkreis und vier Tiki-Fackeln, die flackern und abends warmes Licht geben.
 * Sichtbar nur an Luau-Abenden (`game/insel.ts → luauTonight`), wenn Lina auf der Insel ist.
 */
import * as THREE from 'three';
import { mesh, toon } from './materials';

const box = new THREE.BoxGeometry(1, 1, 1);
const cyl = new THREE.CylinderGeometry(1, 1, 1, 8);
const cone = new THREE.ConeGeometry(1, 1, 8);
const sphere = new THREE.SphereGeometry(1, 10, 8);

export class Luau3D {
  readonly group = new THREE.Group();
  private readonly flames: THREE.Mesh[] = [];
  private readonly light = new THREE.PointLight('#ffb25c', 0, 9, 1.6);
  private time = 0;
  private on = false;

  /** Mitte des Feuers in Kacheln */
  constructor(scene: THREE.Scene, readonly center: { x: number; z: number }, heightAt: (x: number, z: number) => number) {
    this.group.position.set(center.x, Math.max(0, heightAt(center.x, center.z)), center.z);
    // Steinkreis
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      const st = mesh(sphere, toon(i % 2 ? '#a6a1a8' : '#8f8a93'));
      st.scale.set(0.13, 0.09, 0.12);
      st.position.set(Math.cos(a) * 0.38, 0.06, Math.sin(a) * 0.38);
      this.group.add(st);
    }
    // Holzscheite
    for (const rot of [0.3, 1.5, 2.6]) {
      const log = mesh(cyl, toon('#7a4b2a'));
      log.scale.set(0.045, 0.34, 0.045);
      log.rotation.set(Math.PI / 2 - 0.35, rot, 0);
      log.position.set(0, 0.07, 0);
      this.group.add(log);
    }
    // Flammen (drei ineinander)
    for (const [r, h, col] of [[0.17, 0.5, '#ff9a3c'], [0.12, 0.38, '#ffd166'], [0.07, 0.26, '#fff3b0']] as const) {
      const f = new THREE.Mesh(cone, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.9 }));
      f.scale.set(r, h, r);
      f.position.set(0, 0.1 + h / 2, 0);
      this.group.add(f);
      this.flames.push(f);
    }
    this.light.position.set(0, 0.6, 0);
    this.group.add(this.light);
    // Tiki-Fackeln im Kreis
    for (const [x, z] of [[-1.6, -1.2], [1.6, -1.2], [-1.6, 1.4], [1.6, 1.4]] as const) {
      const torch = new THREE.Group();
      const pole = mesh(cyl, toon('#7a4b2a'));
      pole.scale.set(0.035, 0.7, 0.035);
      pole.position.y = 0.35;
      torch.add(pole);
      const head = mesh(box, toon('#5a3a22'));
      head.scale.set(0.09, 0.1, 0.09);
      head.position.y = 0.76;
      torch.add(head);
      const flame = new THREE.Mesh(cone, new THREE.MeshBasicMaterial({ color: '#ffb347', transparent: true, opacity: 0.95 }));
      flame.scale.set(0.07, 0.2, 0.07);
      flame.position.y = 0.92;
      torch.add(flame);
      this.flames.push(flame);
      torch.position.set(x, 0, z);
      this.group.add(torch);
    }
    this.group.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = true;
    });
    this.group.visible = false;
    scene.add(this.group);
  }

  setActive(on: boolean) {
    this.on = on;
    this.group.visible = on;
    if (!on) this.light.intensity = 0;
  }

  update(dt: number, night: number) {
    if (!this.on) return;
    this.time += dt;
    this.flames.forEach((f, i) => {
      const k = 1 + Math.sin(this.time * (9 + i * 1.7) + i) * 0.14 + Math.sin(this.time * 23 + i * 2) * 0.05;
      f.scale.y = (i < 3 ? [0.5, 0.38, 0.26][i] : 0.2) * k;
      f.position.y = (i < 3 ? 0.1 : 0.92 - 0.1) + f.scale.y / 2 + (i < 3 ? 0 : 0.1);
    });
    this.light.intensity = (1.2 + night * 2.2) * (1 + Math.sin(this.time * 14) * 0.08);
  }
}
