/**
 * Grabstellen in der Welt: kleine Risse im Boden mit einem Funkeln.
 */
import * as THREE from 'three';
import type { DailySpawn } from '../core/daily';
import type { Session } from '../game/session';
import { todaysDigSpots } from '../game/digging';
import type { MapView3D } from './MapView3D';

function crackTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;
  ctx.strokeStyle = 'rgba(90,64,40,0.9)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (const [a, l] of [[0.3, 22], [1.9, 18], [3.4, 20], [4.6, 15], [5.6, 12]] as const) {
    ctx.beginPath();
    ctx.moveTo(32, 32);
    const mx = 32 + Math.cos(a) * l * 0.55;
    const my = 32 + Math.sin(a) * l * 0.55;
    ctx.lineTo(mx, my);
    ctx.lineTo(32 + Math.cos(a + 0.3) * l, 32 + Math.sin(a + 0.3) * l);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(110,80,50,0.55)';
  ctx.beginPath();
  ctx.ellipse(32, 32, 7, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class DigSpots3D {
  private group = new THREE.Group();
  private spots: DailySpawn[] = [];
  private sig = '';
  private time = 0;
  private crackMat = new THREE.MeshBasicMaterial({ map: crackTexture(), transparent: true, depthWrite: false });
  private sparkMat = new THREE.SpriteMaterial({ color: '#fff6c8', transparent: true, depthWrite: false });

  constructor(
    scene: THREE.Scene,
    private readonly session: Session,
    private readonly view: MapView3D,
  ) {
    scene.add(this.group);
  }

  refresh() {
    this.spots = todaysDigSpots(this.session);
    const sig = this.spots.map((s) => s.id).join('|');
    if (sig === this.sig) return;
    this.sig = sig;
    this.group.clear();
    for (const s of this.spots) {
      const y = Math.max(0, this.view.terrain.heightAt(s.x + 0.5, s.y + 0.5)) + 0.015;
      const crack = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8).rotateX(-Math.PI / 2), this.crackMat);
      crack.position.set(s.x + 0.5, y, s.y + 0.55);
      crack.rotation.y = (s.x * 7 + s.y * 3) % 6;
      const spark = new THREE.Sprite(this.sparkMat);
      spark.scale.setScalar(0.12);
      spark.position.set(s.x + 0.55, y + 0.2, s.y + 0.5);
      spark.userData.phase = s.x + s.y;
      this.group.add(crack, spark);
    }
  }

  update(dt: number, visible: boolean) {
    this.time += dt;
    this.group.visible = visible;
    for (const o of this.group.children) {
      if (!(o as THREE.Sprite).isSprite) continue;
      const k = (Math.sin(this.time * 3 + (o.userData.phase as number)) + 1) / 2;
      o.scale.setScalar(0.06 + k * 0.12);
    }
  }

  /** Grabstelle auf dieser Kachel? */
  spotAt(x: number, y: number): DailySpawn | null {
    return this.spots.find((s) => s.x === x && s.y === y) ?? null;
  }
}
