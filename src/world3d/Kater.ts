/**
 * Kater, der schwarze Kater, in der Welt: streunert in der Nähe von Olafs und Christins Haus (und manchmal weiter)
 * umher, setzt sich, putzt sich, döst in der Sonne und lässt sich streicheln. Nachts und bei Regen ist er drinnen.
 */
import * as THREE from 'three';
import { TILE, UNIT } from '../config';
import { findPath, nearestWalkable, type Tile } from '../core/grid';
import { mulberry32 } from '../core/rng';
import { terrainAt, type WorldMap } from '../core/worldmap';
import { Cat3D } from './models/cat';

/** Wie weit er vom Heimatplatz wegstreunt (Kacheln) */
const ROAM = 13;
/** Tempo (Welteinheiten pro Sekunde) */
const SPEED = TILE * 1.5;

type Mode = 'rest' | 'walk';

export class Kater {
  readonly cat = new Cat3D();
  x = 0;
  y = 0;
  private angle = 0;
  private targetAngle = 0;
  private mode: Mode = 'rest';
  private path: Tile[] = [];
  private pose: 0 | 1 | 2 = 1;
  private restLeft = 3;
  private step = 0;
  private time = 0;
  private tailUp = 0;
  private rnd: () => number;
  private placed = false;
  /** Wie er sich am Ziel hinsetzt (0 = steht, 1 = sitzt, 2 = liegt) */
  private arrivePose: 0 | 1 | 2 = 1;
  /** Lina streichelt ihn gerade: bleibt stehen */
  private petted = 0;

  constructor(
    scene: THREE.Scene,
    private readonly map: WorldMap,
    private home: Tile,
    public heightAt: (x: number, z: number) => number,
    seed: number,
  ) {
    this.rnd = mulberry32(seed);
    scene.add(this.cat.root);
    this.cat.root.userData.kater = true;
  }

  get tile(): Tile {
    return { x: Math.floor(this.x / TILE), y: Math.floor(this.y / TILE) };
  }

  get visible(): boolean {
    return this.cat.root.visible;
  }

  setVisible(on: boolean) {
    this.cat.root.visible = on;
  }

  /** Erstes Auftauchen: irgendwo in Hausnähe */
  place() {
    const t = this.randomTile(4) ?? this.home;
    this.x = (t.x + 0.5) * TILE;
    this.y = (t.y + 0.5) * TILE;
    this.placed = true;
    this.pose = 1;
    this.sync();
  }

  get isPlaced() {
    return this.placed;
  }

  /** Ist er gerade in der Nähe von (x, y) und schaut Lina an? */
  distanceTo(x: number, y: number) {
    return Math.hypot(this.x - x, this.y - y);
  }

  /** Lina spricht ihn an: er bleibt kurz stehen und schaut sie an */
  attend(x: number, y: number, seconds = 6) {
    this.path = [];
    this.mode = 'rest';
    this.pose = 1;
    this.restLeft = Math.max(this.restLeft, seconds);
    this.petted = seconds;
    this.targetAngle = Math.atan2(x - this.x, y - this.y);
  }

  /** Beim Streicheln: Schwanz hoch, Augen zu */
  purr() {
    this.petted = 5;
    this.tailUp = 1;
  }

  update(dtMs: number, lina: { x: number; y: number }) {
    if (!this.placed || !this.cat.root.visible) return;
    const dt = Math.min(0.1, dtMs / 1000);
    this.time += dt;
    this.petted = Math.max(0, this.petted - dt);

    if (this.mode === 'walk') {
      const next = this.path[0];
      if (!next) {
        this.mode = 'rest';
        this.pose = this.arrivePose;
        this.restLeft = 6 + this.rnd() * 14;
      } else {
        const tx = (next.x + 0.5) * TILE;
        const ty = (next.y + 0.5) * TILE;
        const d = Math.hypot(tx - this.x, ty - this.y);
        const stepLen = SPEED * dt;
        this.targetAngle = Math.atan2(tx - this.x, ty - this.y);
        if (d <= stepLen) {
          this.x = tx;
          this.y = ty;
          this.path.shift();
        } else {
          this.x += ((tx - this.x) / d) * stepLen;
          this.y += ((ty - this.y) / d) * stepLen;
        }
        this.step += dt * 2.4;
      }
    } else {
      // Ruhen: schaut Lina an, wenn sie nah ist; sonst eine Weile sitzen/liegen, dann weiterstreunern
      const near = Math.hypot(lina.x - this.x, lina.y - this.y) < TILE * 3;
      if (near) {
        this.targetAngle = Math.atan2(lina.x - this.x, lina.y - this.y);
        this.tailUp = Math.min(1, this.tailUp + dt);
      } else this.tailUp = Math.max(0, this.tailUp - dt * 0.5);
      this.restLeft -= this.petted > 0 ? 0 : dt;
      if (this.restLeft <= 0) this.wander();
    }

    // Drehen (weich)
    let da = this.targetAngle - this.angle;
    while (da > Math.PI) da -= Math.PI * 2;
    while (da < -Math.PI) da += Math.PI * 2;
    this.angle += da * Math.min(1, dt * 8);

    this.sync();
  }

  private wander() {
    const dest = this.randomTile(ROAM);
    if (!dest) {
      this.restLeft = 4;
      return;
    }
    const goal = nearestWalkable(this.map.grid, dest, this.tile) ?? dest;
    const path = findPath(this.map.grid, this.tile, goal, 4000);
    if (!path || path.length === 0) {
      this.restLeft = 3;
      return;
    }
    this.path = path;
    this.mode = 'walk';
    // am Ziel: meist sitzen oder liegen
    const r = this.rnd();
    this.arrivePose = r < 0.45 ? 1 : r < 0.85 ? 2 : 0;
  }

  private randomTile(radius: number): Tile | null {
    for (let i = 0; i < 25; i++) {
      const t = { x: this.home.x + Math.round((this.rnd() - 0.5) * 2 * radius), y: this.home.y + Math.round((this.rnd() - 0.5) * 2 * radius) };
      if (t.x < 0 || t.y < 0 || this.map.grid.isBlocked(t.x, t.y)) continue;
      const terr = terrainAt(this.map, t.x, t.y);
      if (terr === 'grass' || terr === 'path' || terr === 'sand') return t;
    }
    return null;
  }

  private sync() {
    const px = this.x * UNIT;
    const pz = this.y * UNIT;
    this.cat.root.position.set(px, Math.max(0, this.heightAt(px, pz)), pz);
    this.cat.root.rotation.y = this.angle;
    this.cat.pose({
      step: this.step,
      moving: this.mode === 'walk',
      rest: this.mode === 'walk' ? 0 : this.pose,
      tailUp: this.tailUp,
      eyesClosed: this.petted > 0 || (this.mode === 'rest' && this.pose === 2 && this.restLeft > 5 && Math.sin(this.time * 0.4) > 0.2),
      t: this.time,
    });
  }

  dispose() {
    this.cat.dispose();
  }
}
