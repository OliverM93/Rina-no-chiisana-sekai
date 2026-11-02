/**
 * Lina in der Spielwelt: Bewegung, Lauf-Animation, Blinzeln, Wegfolgen.
 */
import type Phaser from 'phaser';
import { RES, RUN_SPEED, TILE, WALK_SPEED } from '../../config';
import type { Appearance } from '../../core/appearance';
import type { Tile } from '../../core/grid';
import { facingFromVector, type FootBox, moveWithCollision, type SolidFn } from '../../core/movement';
import type { Facing } from '../../core/save';
import { CHIBI_ORIGIN, registerCharacter } from '../../gfx/textures';

const FOOT: FootBox = { hw: 13, hh: 7 };
const STEP_LENGTH = 17; // Welteinheiten pro Animationsschritt
/** Füße stehen etwas unterhalb der Kachelmitte – so wirkt es in der Schrägsicht natürlich. */
export const FEET_OFFSET = 8;

export interface MoveIntent {
  dx: number;
  dy: number;
  run: boolean;
}

export class Player {
  readonly sprite: Phaser.GameObjects.Sprite;
  readonly shadow: Phaser.GameObjects.Image;
  x: number;
  y: number;
  facing: Facing;
  moving = false;

  private stepPhase = 0;
  private blinkIn = 2.5;
  private blinkLeft = 0;
  private idleTime = 0;
  private path: Tile[] | null = null;
  private onArrive: (() => void) | null = null;
  private stuckTime = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly textureKey: string,
    appearance: Appearance,
    x: number,
    y: number,
    facing: Facing,
  ) {
    registerCharacter(scene, textureKey, appearance);
    this.x = x;
    this.y = y;
    this.facing = facing;
    this.shadow = scene.add.image(x, y, 'char-shadow').setScale(1 / RES).setDepth(y - 1);
    this.sprite = scene.add
      .sprite(x, y, textureKey, 'down-idle')
      .setOrigin(CHIBI_ORIGIN[0], CHIBI_ORIGIN[1])
      .setScale(1 / RES)
      .setDepth(y);
    this.applyFrame();
  }

  setAppearance(appearance: Appearance) {
    registerCharacter(this.scene, this.textureKey, appearance);
    this.sprite.setTexture(this.textureKey);
    this.applyFrame();
  }

  get tile(): Tile {
    return { x: Math.floor(this.x / TILE), y: Math.floor((this.y) / TILE) };
  }

  get hasPath(): boolean {
    return this.path !== null;
  }

  /** Einem Weg aus Kacheln folgen; `onArrive` wird am Ziel aufgerufen. */
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
    this.applyFrame();
  }

  update(dtMs: number, intent: MoveIntent, solid: SolidFn) {
    const dt = Math.min(0.05, dtMs / 1000);
    let { dx, dy } = intent;
    let run = intent.run;

    // Tastatur hat Vorrang vor Klick-Wegen
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
        // Nicht über das Ziel hinausschießen
        const speed = run ? RUN_SPEED : WALK_SPEED;
        if (speed * dt > dist) {
          dx *= dist / (speed * dt);
          dy *= dist / (speed * dt);
        }
      }
    }

    const len = Math.hypot(dx, dy);
    this.moving = len > 0.01;
    if (this.moving) {
      if (len > 1) {
        dx /= len;
        dy /= len;
      }
      const speed = run ? RUN_SPEED : WALK_SPEED;
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

      // Festgefahren? (z. B. Weg durch Hindernis) → abbrechen
      if (this.path && moved < 0.3) {
        this.stuckTime += dt;
        if (this.stuckTime > 0.4) this.cancelPath();
      } else {
        this.stuckTime = 0;
      }
      this.idleTime = 0;
    } else {
      this.stepPhase = 0;
      this.idleTime += dt;
    }

    // Blinzeln
    this.blinkIn -= dt;
    if (this.blinkIn <= 0) {
      this.blinkLeft = 0.13;
      this.blinkIn = 2.2 + Math.random() * 3.5;
    }
    if (this.blinkLeft > 0) this.blinkLeft -= dt;

    this.applyFrame(run);
  }

  private applyFrame(run = false) {
    const dir = this.facing === 'left' || this.facing === 'right' ? 'side' : this.facing;
    let frame = `${dir}-idle`;
    let bob = 0;
    let squash = 1;
    if (this.moving) {
      const cycle = Math.floor(this.stepPhase) % 4;
      frame = cycle === 0 ? `${dir}-walk1` : cycle === 2 ? `${dir}-walk2` : `${dir}-idle`;
      const t = this.stepPhase % 1;
      bob = -Math.abs(Math.sin(t * Math.PI)) * (run ? 4 : 2.6);
      squash = 1 + Math.sin(t * Math.PI) * 0.025;
    } else {
      if (this.blinkLeft > 0 && dir !== 'up') frame = `${dir}-blink`;
      // sanftes „Atmen“
      squash = 1 + Math.sin(this.idleTime * 2.4) * 0.012;
    }
    this.sprite.setFrame(frame);
    this.sprite.setFlipX(this.facing === 'right');
    this.sprite.setPosition(this.x, this.y + bob);
    this.sprite.setScale((1 / RES) * (2 - squash), (1 / RES) * squash);
    this.sprite.setDepth(this.y);
    this.shadow.setPosition(this.x, this.y - 1);
    this.shadow.setDepth(this.y - 1);
    this.shadow.setScale((1 / RES) * (1 + bob * 0.03));
  }

  destroy() {
    this.sprite.destroy();
    this.shadow.destroy();
  }
}
