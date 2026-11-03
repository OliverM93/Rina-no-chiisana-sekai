/**
 * Wetter in 3D: Regen, Schnee und sanfte Blitze. Die Partikel folgen dem
 * Kamera-Ziel, damit es überall im Bild regnet. (Der Regenbogen ist ein Bogen
 * in der Oberfläche – die Schrägsicht zeigt keinen Himmel.)
 */
import * as THREE from 'three';
import type { WeatherNow } from '../core/weather';

const RAIN = 1100;
const SNOW = 420;
const AREA_X = 24;
const AREA_Z = 18;
const TOP = 9;

export class Weather3D {
  private rain: THREE.InstancedMesh;
  private snow: THREE.InstancedMesh;
  private rainPos: THREE.Vector3[] = [];
  private snowPos: Array<{ p: THREE.Vector3; phase: number }> = [];
  private state: WeatherNow = { kind: 'sonnig', rainbow: false, clouds: 0, rainedToday: false };
  private flash = 0;
  private nextFlash = 6;
  private m = new THREE.Matrix4();
  private enabled = true;

  constructor(scene: THREE.Scene) {
    const drop = new THREE.CylinderGeometry(0.012, 0.012, 0.42, 3);
    this.rain = new THREE.InstancedMesh(drop, new THREE.MeshBasicMaterial({ color: '#dceafa', transparent: true, opacity: 0.7, depthWrite: false }), RAIN);
    this.rain.frustumCulled = false;
    for (let i = 0; i < RAIN; i++) this.rainPos.push(new THREE.Vector3((Math.random() - 0.5) * AREA_X, Math.random() * TOP, (Math.random() - 0.5) * AREA_Z));
    const flake = new THREE.SphereGeometry(0.035, 5, 4);
    this.snow = new THREE.InstancedMesh(flake, new THREE.MeshBasicMaterial({ color: '#ffffff' }), SNOW);
    this.snow.frustumCulled = false;
    for (let i = 0; i < SNOW; i++) this.snowPos.push({ p: new THREE.Vector3((Math.random() - 0.5) * AREA_X, Math.random() * TOP, (Math.random() - 0.5) * AREA_Z), phase: Math.random() * 10 });
    this.rain.visible = this.snow.visible = false;
    scene.add(this.rain, this.snow);
  }

  set(state: WeatherNow) {
    this.state = state;
    this.rain.visible = this.enabled && (state.kind === 'regen' || state.kind === 'gewitter');
    this.snow.visible = this.enabled && state.kind === 'schnee';
  }

  /** Zu Hause regnet es nicht */
  setEnabled(on: boolean) {
    this.enabled = on;
    this.set(this.state);
  }

  get current(): WeatherNow {
    return this.state;
  }

  /** Helligkeit eines Blitzes (0..1) – für das Licht */
  get lightning(): number {
    return this.flash;
  }

  update(dt: number, center: THREE.Vector3) {
    if (this.rain.visible) {
      const speed = this.state.kind === 'gewitter' ? 11 : 8;
      this.rainPos.forEach((p, i) => {
        p.y -= speed * dt;
        p.x -= speed * 0.12 * dt;
        if (p.y < 0) p.set((Math.random() - 0.5) * AREA_X, TOP, (Math.random() - 0.5) * AREA_Z);
        this.m.makeRotationZ(-0.12);
        this.m.setPosition(center.x + p.x, p.y, center.z + p.z);
        this.rain.setMatrixAt(i, this.m);
      });
      this.rain.instanceMatrix.needsUpdate = true;
    }
    if (this.snow.visible) {
      const t = performance.now() / 1000;
      this.snowPos.forEach((s, i) => {
        s.p.y -= 0.7 * dt;
        s.p.x += Math.sin(t + s.phase) * 0.3 * dt;
        if (s.p.y < 0) s.p.set((Math.random() - 0.5) * AREA_X, TOP, (Math.random() - 0.5) * AREA_Z);
        this.m.makeTranslation(center.x + s.p.x, s.p.y, center.z + s.p.z);
        this.snow.setMatrixAt(i, this.m);
      });
      this.snow.instanceMatrix.needsUpdate = true;
    }
    // Gewitter: ab und zu ein sanftes Aufleuchten (kein Schreck – eher ein Flackern)
    this.flash = Math.max(0, this.flash - dt * 3);
    if (this.state.kind === 'gewitter' && this.enabled) {
      this.nextFlash -= dt;
      if (this.nextFlash <= 0) {
        this.flash = 1;
        this.nextFlash = 9 + Math.random() * 14;
      }
    }
  }

  dispose() {
    this.rain.removeFromParent();
    this.snow.removeFromParent();
  }
}
