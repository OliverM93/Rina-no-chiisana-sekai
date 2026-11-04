/**
 * Eine Figur in der 3D-Welt (Lina oder ein Bewohner): Bewegung mit Kollision,
 * Wegfolgen, Sitzen, Laufanimation. Die Logik rechnet in Welteinheiten
 * (64 pro Kachel, wie Spielstand & Wegfindung), dargestellt wird in Kacheln.
 */
import * as THREE from 'three';
import { RUN_SPEED, TILE, UNIT, WALK_SPEED } from '../config';
import type { Appearance } from '../core/appearance';
import type { Tile } from '../core/grid';
import type { Season } from '../core/time';
import { facingFromVector, type FootBox, moveWithCollision, type SolidFn } from '../core/movement';
import type { Facing } from '../core/save';
import { Chibi3D } from './models/chibi3d';

const FOOT: FootBox = { hw: 13, hh: 7 };
const STEP_LENGTH = 24;
/** Füße stehen leicht unterhalb der Kachelmitte (wie in der 2D-Version) */
export const FEET_OFFSET = 8;

export interface MoveIntent {
  dx: number;
  dy: number;
  run: boolean;
}

const FACING_ANGLE: Record<Facing, number> = { down: 0, right: Math.PI / 2, up: Math.PI, left: -Math.PI / 2 };

const CHEER = 0.75;
const WAVE = 1.3;

export class Character {
  readonly chibi: Chibi3D;
  x: number;
  y: number;
  facing: Facing;
  moving = false;
  sitting = false;
  running = false;
  speedFactor = 1;
  /** Höhe über dem Boden (z. B. Sitzfläche einer Bank), in Kacheln */
  seatHeight = 0;
  /** Für Kompatibilität (Tiefe wird in 3D automatisch richtig) */
  depthBias = 0;

  private angle = 0;
  private targetAngle = 0;
  private stepPhase = 0;
  private blinkIn = 2.5;
  private blinkLeft = 0;
  private time = Math.random() * 10;
  private path: Tile[] | null = null;
  private onArrive: (() => void) | null = null;
  private stuckTime = 0;

  constructor(
    parent: THREE.Object3D,
    appearance: Appearance,
    x: number,
    y: number,
    facing: Facing,
    public heightAt: (x: number, z: number) => number,
    season: Season = 'sommer',
    day = '',
  ) {
    this.chibi = new Chibi3D(appearance, season, day);
    parent.add(this.chibi.root);
    this.x = x;
    this.y = y;
    this.facing = facing;
    this.angle = this.targetAngle = FACING_ANGLE[facing];
    this.sync(0);
  }

  get root(): THREE.Group {
    return this.chibi.root;
  }

  setAppearance(appearance: Appearance) {
    this.chibi.setAppearance(appearance);
  }

  get tile(): Tile {
    return { x: Math.floor(this.x / TILE), y: Math.floor(this.y / TILE) };
  }

  get hasPath(): boolean {
    return this.path !== null;
  }

  followPath(path: Tile[], onArrive: (() => void) | null = null) {
    this.path = path.length > 0 ? path : null;
    this.onArrive = onArrive;
    this.stuckTime = 0;
    if (!this.path && onArrive) onArrive();
  }

  cancelPath() {
    this.path = null;
    this.onArrive = null;
  }

  face(dir: Facing) {
    this.facing = dir;
    this.targetAngle = FACING_ANGLE[dir];
  }

  faceTowards(x: number, y: number) {
    const dx = x - this.x;
    const dy = y - this.y;
    this.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';
    this.targetAngle = Math.atan2(dx, dy);
  }

  teleport(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.cancelPath();
    this.sync(0);
  }

  setSitting(on: boolean) {
    this.sitting = on;
    if (on) {
      this.cancelPath();
      this.face('down');
      this.angle = this.targetAngle;
    } else {
      this.seatHeight = 0;
    }
    this.sync(0);
  }

  /** Rechter Arm nach vorn (z. B. Angel halten); undefined = normal */
  armForward: number | undefined = undefined;
  /** Freudensprung / Winken: verbleibende Zeit (s) */
  private cheerLeft = 0;
  private waveLeft = 0;
  /** wie lange die Figur schon still steht (für Umschauen) */
  private idleTime = 0;

  /** Kleiner Freudensprung mit Armen in die Luft */
  cheer() {
    if (!this.sitting) this.cheerLeft = CHEER;
  }

  /** Mit der Hand winken (z. B. zur Begrüßung) */
  wave() {
    this.waveLeft = WAVE;
  }

  hold(obj: THREE.Object3D | null) {
    this.chibi.hold(obj);
  }

  setVisible(on: boolean) {
    this.chibi.root.visible = on;
  }

  get visible(): boolean {
    return this.chibi.root.visible;
  }

  update(dtMs: number, intent: MoveIntent, solid: SolidFn) {
    const dt = Math.min(0.05, dtMs / 1000);
    let { dx, dy } = intent;
    let run = intent.run;
    if (this.sitting) {
      dx = 0;
      dy = 0;
    }
    if ((dx !== 0 || dy !== 0) && this.path) this.cancelPath();

    if (this.path && dx === 0 && dy === 0) {
      const next = this.path[0];
      const tx = (next.x + 0.5) * TILE;
      const ty = (next.y + 0.5) * TILE + FEET_OFFSET;
      const vx = tx - this.x;
      const vy = ty - this.y;
      const dist = Math.hypot(vx, vy);
      if (dist < 3) {
        this.path.shift();
        if (this.path.length === 0) {
          const cb = this.onArrive;
          this.path = null;
          this.onArrive = null;
          cb?.();
        }
      } else {
        dx = vx / dist;
        dy = vy / dist;
        run = run || (this.path?.length ?? 0) > 6;
        const speed = (run ? RUN_SPEED : WALK_SPEED) * this.speedFactor;
        if (speed * dt > dist) {
          dx *= dist / (speed * dt);
          dy *= dist / (speed * dt);
        }
      }
    }

    const len = Math.hypot(dx, dy);
    this.moving = len > 0.01 && !this.sitting;
    this.running = this.moving && run;
    if (this.moving) {
      if (len > 1) {
        dx /= len;
        dy /= len;
      }
      const speed = (run ? RUN_SPEED : WALK_SPEED) * this.speedFactor;
      const total = speed * dt;
      const steps = Math.max(1, Math.ceil(total / 6));
      const sx = (dx * total) / steps;
      const sy = (dy * total) / steps;
      const before = { x: this.x, y: this.y };
      for (let i = 0; i < steps; i++) {
        const r = moveWithCollision({ x: this.x, y: this.y }, sx, sy, FOOT, TILE, solid);
        this.x = r.x;
        this.y = r.y;
      }
      const moved = Math.hypot(this.x - before.x, this.y - before.y);
      this.stepPhase += moved / STEP_LENGTH;
      this.facing = facingFromVector(dx, dy, this.facing);
      this.targetAngle = Math.atan2(dx, dy);
      if (this.path && moved < 0.3) {
        this.stuckTime += dt;
        if (this.stuckTime > 0.4) this.cancelPath();
      } else {
        this.stuckTime = 0;
      }
    } else {
      this.stepPhase = 0;
    }

    this.blinkIn -= dt;
    if (this.blinkIn <= 0) {
      this.blinkLeft = 0.13;
      this.blinkIn = 2.2 + Math.random() * 3.5;
    }
    if (this.blinkLeft > 0) this.blinkLeft -= dt;
    if (this.cheerLeft > 0) this.cheerLeft = Math.max(0, this.cheerLeft - dt);
    if (this.waveLeft > 0) this.waveLeft = Math.max(0, this.waveLeft - dt);
    this.idleTime = this.moving || this.sitting ? 0 : this.idleTime + dt;
    this.time += dt;
    this.sync(dt);
  }

  /** Überträgt Position, Drehung und Pose auf das 3D-Modell. */
  private sync(dt: number) {
    // weich zur Zielrichtung drehen (kürzester Weg)
    let diff = this.targetAngle - this.angle;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    this.angle += dt > 0 ? diff * Math.min(1, dt * 14) : diff;
    const px = this.x * UNIT;
    const pz = this.y * UNIT;
    const ground = this.sitting ? 0 : Math.max(0, this.heightAt(px, pz));
    this.chibi.root.position.set(px, ground + this.seatHeight, pz);
    this.chibi.root.rotation.y = this.angle;
    this.chibi.pose({ step: this.stepPhase, moving: this.moving, running: this.running, sitting: this.sitting, blink: this.blinkLeft > 0, t: this.time, armForward: this.armForward, cheer: this.cheerLeft > 0 ? 1 - this.cheerLeft / CHEER : undefined, wave: this.waveLeft > 0 ? 1 - this.waveLeft / WAVE : undefined, idle: this.idleTime });
  }

  destroy() {
    this.chibi.root.removeFromParent();
    this.chibi.dispose();
  }
}
