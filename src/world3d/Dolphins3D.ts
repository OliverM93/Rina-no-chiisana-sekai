/**
 * Delfine vor der Insel: gelegentlich springt ein Paar in einem flachen Bogen aus dem Meer (nur sichtbar, wenn Lina auf
 * der Insel ist). Reine Dekoration; wenn Lina nah genug an der Küste ist, meldet `update` „gesehen“ (Album).
 */
import * as THREE from 'three';
import { makeDolphin } from './models/critters';

/** Sprungstellen im Meer (Kacheln): östlich und westlich der Insel */
const SPOTS: ReadonlyArray<{ x: number; z: number; dx: number; dz: number }> = [
  { x: 44, z: 52, dx: -1, dz: 0.2 },
  { x: 14, z: 51, dx: 1, dz: 0.1 },
  { x: 33, z: 62, dx: 0.3, dz: -1 },
];

const JUMP_TIME = 1.6;

export class Dolphins3D {
  private readonly group = new THREE.Group();
  private readonly pair: THREE.Group[] = [makeDolphin(), makeDolphin()];
  private t = 0;
  private wait = 6;
  private spot = SPOTS[0];
  private active = false;

  constructor(scene: THREE.Scene) {
    for (const d of this.pair) {
      d.scale.setScalar(1.15);
      this.group.add(d);
    }
    this.group.visible = false;
    scene.add(this.group);
  }

  /** Gibt true zurück, wenn Lina gerade einen Sprung von nahem sieht (jeweils einmal je Sprung) */
  update(dt: number, enabled: boolean, player: { x: number; z: number }): boolean {
    if (!enabled) {
      this.group.visible = false;
      this.active = false;
      this.wait = Math.max(this.wait, 4);
      return false;
    }
    if (!this.active) {
      this.wait -= dt;
      if (this.wait > 0) return false;
      this.active = true;
      this.t = 0;
      this.spot = SPOTS[Math.floor(Math.random() * SPOTS.length)];
      this.group.visible = true;
      return Math.hypot(player.x - this.spot.x, player.z - this.spot.z) < 16;
    }
    this.t += dt;
    const k = this.t / JUMP_TIME;
    if (k >= 1) {
      this.active = false;
      this.group.visible = false;
      this.wait = 25 + Math.random() * 40;
      return false;
    }
    this.pair.forEach((d, i) => {
      const kk = Math.min(1, Math.max(0, k * 1.15 - i * 0.12));
      const run = (kk - 0.5) * 3.2;
      const len = Math.hypot(this.spot.dx, this.spot.dz) || 1;
      const ux = this.spot.dx / len;
      const uz = this.spot.dz / len;
      const y = Math.sin(kk * Math.PI) * 1.1 - 0.35;
      d.position.set(this.spot.x + ux * run + -uz * i * 0.9, y, this.spot.z + uz * run + ux * i * 0.9);
      // Nase zuerst nach oben, dann nach unten (Bogen)
      d.rotation.set(-Math.cos(kk * Math.PI) * 0.9, Math.atan2(ux, uz), 0, 'YXZ');
      d.visible = kk > 0 && kk < 1;
    });
    return false;
  }
}
