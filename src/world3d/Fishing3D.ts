/**
 * Angeln – ganz entspannt: Auswerfen, warten, bis der Schwimmer abtaucht,
 * dann die Leertaste drücken. Zu früh oder zu spät? Macht nichts – der
 * Fisch knabbert einfach nochmal. Es kann nichts schiefgehen.
 */
import * as THREE from 'three';
import type { FishDef } from '../data/species';
import { makeBobber } from './models/critters';
import { WATER_LEVEL } from './terrain3d';

type State = 'idle' | 'cast' | 'wait' | 'bite';

export class Fishing3D {
  private state: State = 'idle';
  private timer = 0;
  private bobber = makeBobber();
  private shadow: THREE.Mesh;
  private ring: THREE.Mesh;
  private line: THREE.Line;
  private target = new THREE.Vector3();
  private start = new THREE.Vector3();
  private fish: FishDef | null = null;
  private time = 0;
  private alert: THREE.Sprite;
  /** Wird beim Biss gemeldet (z. B. für Ton/Hinweis) */
  onBite: (() => void) | null = null;

  /** Wo der Schwimmer zuletzt im Wasser lag (für Spritzer beim Fang) */
  bobberPosition(): THREE.Vector3 | null {
    return this.target.lengthSq() > 0 ? this.target.clone() : null;
  }

  constructor(scene: THREE.Scene) {
    this.shadow = new THREE.Mesh(new THREE.CircleGeometry(1, 16).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#203040', transparent: true, opacity: 0.35, depthWrite: false }));
    this.ring = new THREE.Mesh(new THREE.RingGeometry(0.8, 1, 24).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false }));
    this.line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ color: '#f7f5f1', transparent: true, opacity: 0.8 }));
    this.alert = new THREE.Sprite(new THREE.SpriteMaterial({ map: alertTexture(), transparent: true, depthTest: false }));
    this.alert.scale.set(0.3, 0.3, 1);
    this.alert.renderOrder = 11;
    for (const o of [this.bobber, this.shadow, this.ring, this.line, this.alert]) o.visible = false;
    this.line.frustumCulled = false;
    scene.add(this.bobber, this.shadow, this.ring, this.line, this.alert);
  }

  get active(): boolean {
    return this.state !== 'idle';
  }

  get biting(): boolean {
    return this.state === 'bite';
  }

  /** Auswerfen von `from` (Rutenspitze) nach `to` (Wasser) */
  cast(from: THREE.Vector3, to: THREE.Vector3, fish: FishDef) {
    this.fish = fish;
    this.start.copy(from);
    this.target.set(to.x, WATER_LEVEL + 0.02, to.z);
    this.state = 'cast';
    this.timer = 0.45;
    this.bobber.visible = this.line.visible = true;
    this.shadow.visible = false;
    const s = 0.08 + fish.size * 0.05;
    this.shadow.scale.set(s * 0.6, 1, s);
  }

  /** Wartezeit bis zum (nächsten) Biss */
  private wait(min: number, max: number) {
    this.state = 'wait';
    this.timer = min + Math.random() * (max - min);
    this.shadow.visible = true;
    this.alert.visible = false;
  }

  /** Leertaste: gibt den Fisch zurück, wenn er gerade beißt. Sonst null (nichts passiert). */
  reel(): FishDef | null {
    if (this.state !== 'bite') return null;
    const f = this.fish;
    this.stop();
    return f;
  }

  stop() {
    this.state = 'idle';
    this.fish = null;
    for (const o of [this.bobber, this.shadow, this.ring, this.line, this.alert]) o.visible = false;
  }

  update(dt: number, rodTip: THREE.Vector3 | null) {
    if (this.state === 'idle') return;
    this.time += dt;
    this.timer -= dt;
    if (rodTip) {
      const pos = (this.line.geometry as THREE.BufferGeometry).attributes.position as THREE.BufferAttribute;
      pos.setXYZ(0, rodTip.x, rodTip.y, rodTip.z);
      pos.setXYZ(1, this.bobber.position.x, this.bobber.position.y + 0.05, this.bobber.position.z);
      pos.needsUpdate = true;
    }
    switch (this.state) {
      case 'cast': {
        const k = 1 - Math.max(0, this.timer) / 0.45;
        this.bobber.position.lerpVectors(this.start, this.target, k);
        this.bobber.position.y += Math.sin(k * Math.PI) * 0.6;
        if (this.timer <= 0) {
          this.bobber.position.copy(this.target);
          this.splash(0.5);
          this.wait(2, 5.5);
        }
        break;
      }
      case 'wait': {
        // Fischschatten schwimmt langsam heran
        const k = Math.max(0, Math.min(1, 1 - this.timer / 2.5));
        const a = this.time * 0.6;
        const dist = 0.9 * (1 - k) + 0.12;
        this.shadow.position.set(this.target.x + Math.cos(a) * dist, WATER_LEVEL - 0.01, this.target.z + Math.sin(a) * dist);
        this.shadow.rotation.y = -a;
        this.bobber.position.y = this.target.y + Math.sin(this.time * 2.4) * 0.012 - (k > 0.85 ? Math.abs(Math.sin(this.time * 18)) * 0.02 : 0);
        if (this.timer <= 0) {
          this.state = 'bite';
          this.timer = 1.8;
          this.splash(1);
          this.alert.visible = true;
          this.onBite?.();
        }
        break;
      }
      case 'bite': {
        this.bobber.position.y = this.target.y - 0.06 + Math.sin(this.time * 30) * 0.015;
        this.alert.position.set(this.target.x, 0.65 + Math.sin(this.time * 8) * 0.04, this.target.z);
        if (this.timer <= 0) this.wait(1.5, 3.5); // verpasst? Macht nichts – er knabbert gleich wieder
        break;
      }
    }
    const ringMat = this.ring.material as THREE.MeshBasicMaterial;
    if (ringMat.opacity > 0) {
      ringMat.opacity = Math.max(0, ringMat.opacity - dt * 1.2);
      this.ring.scale.addScalar(dt * 0.5);
    } else this.ring.visible = false;
  }

  private splash(strength: number) {
    this.ring.visible = true;
    this.ring.position.set(this.target.x, WATER_LEVEL + 0.015, this.target.z);
    this.ring.scale.setScalar(0.08 + strength * 0.06);
    (this.ring.material as THREE.MeshBasicMaterial).opacity = 0.7 * strength;
  }

  dispose() {
    for (const o of [this.bobber, this.shadow, this.ring, this.line, this.alert]) o.removeFromParent();
  }
}

function alertTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(32, 32, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e8484f';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('!', 32, 34);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
