/**
 * Winston in der Welt: läuft Lina auf ihrer eigenen Spur hinterher (so bleibt
 * er nie an Ecken hängen), setzt sich, wenn sie stehen bleibt, schläft nachts,
 * lässt sich streicheln und buddelt einmal am Tag etwas aus.
 */
import * as THREE from 'three';
import { TILE, UNIT } from '../config';
import { Dog3D } from './models/dog';
import type { Tweens } from './tweens';

/** Abstand hinter Lina (Welteinheiten) */
const FOLLOW = TILE * 0.95;
const TRAIL_STEP = 8;
const TRAIL_MAX = 160;

type Emote = 'herz' | 'zzz' | 'note';

function emoteTexture(kind: Emote): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;
  ctx.font = '700 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (kind === 'zzz') {
    ctx.fillStyle = '#7a8ac8';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.strokeText('z', 32, 36);
    ctx.fillText('z', 32, 36);
  } else {
    ctx.fillText(kind === 'herz' ? '💗' : '❗', 32, 36);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class Winston {
  readonly dog = new Dog3D();
  x = 0;
  y = 0;
  private angle = 0;
  private trail: Array<{ x: number; y: number }> = [];
  private last = { x: 0, y: 0 };
  private step = 0;
  private moving = false;
  /** Läuft gerade (für Pfotenabdrücke im Schnee) */
  get walking(): boolean {
    return this.moving;
  }
  private idle = 0;
  private time = 0;
  private wag = 0.3;
  private tilt = 0;
  private digLeft = 0;
  private onDug: (() => void) | null = null;
  private zzz: THREE.Sprite;
  private zzzTime = 0;
  private dirt: THREE.Mesh[] = [];
  private emotes = new Map<Emote, THREE.CanvasTexture>();
  /** Liegt im Körbchen (drinnen) */
  private basket: { x: number; y: number } | null = null;
  /** Platz neben Lina, wenn sie stehen bleibt (damit er nicht hinter ihr verschwindet) */
  private settle: { x: number; y: number } | null = null;
  sleeping = false;
  /** Hat sich verfangen und wartet hier auf Hilfe (Fund-Ereignis) – folgt Lina noch nicht */
  private lostAt: { x: number; y: number } | null = null;

  constructor(
    private readonly scene: THREE.Scene,
    private readonly tweens: Tweens,
    public heightAt: (x: number, z: number) => number,
  ) {
    scene.add(this.dog.root);
    this.dog.root.userData.winston = true;
    this.zzz = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.emote('zzz'), transparent: true, depthWrite: false }));
    this.zzz.scale.setScalar(0.22);
    this.zzz.visible = false;
    scene.add(this.zzz);
    const dirtGeo = new THREE.SphereGeometry(1, 6, 4);
    const dirtMat = new THREE.MeshToonMaterial({ color: '#8a6040' });
    for (let i = 0; i < 6; i++) {
      const m = new THREE.Mesh(dirtGeo, dirtMat);
      m.scale.setScalar(0.025);
      m.visible = false;
      scene.add(m);
      this.dirt.push(m);
    }
  }

  private emote(kind: Emote) {
    let t = this.emotes.get(kind);
    if (!t) {
      t = emoteTexture(kind);
      this.emotes.set(kind, t);
    }
    return t;
  }

  get tile() {
    return { x: Math.floor(this.x / TILE), y: Math.floor(this.y / TILE) };
  }

  get busy() {
    return this.digLeft > 0;
  }

  /** Steht/sitzt er gerade still? (für das Buddeln) */
  get resting() {
    return !this.moving && this.idle > 1.5 && !this.busy && !this.sleeping;
  }

  setVisible(on: boolean) {
    this.dog.root.visible = on;
    if (!on) this.zzz.visible = false;
  }

  get stranded(): boolean {
    return this.lostAt !== null;
  }

  /** Hier sitzt er zitternd fest und wartet auf Lina (Fund-Ereignis) */
  strand(x: number, y: number) {
    this.lostAt = { x, y };
    this.x = x;
    this.y = y;
    this.trail = [];
    this.angle = Math.PI * 0.8;
    this.idle = 3;
    this.cancelDig();
    this.sync(0);
  }

  /** Befreit: ab jetzt läuft er Lina hinterher */
  release(lina: { x: number; y: number }) {
    this.lostAt = null;
    this.last = { x: lina.x, y: lina.y };
    this.trail = [];
    this.wag = 1;
    this.idle = 0;
  }

  /** Neben Lina absetzen (Spielstart, Raumwechsel) */
  placeNear(x: number, y: number, facingDx: number, facingDy: number) {
    this.x = x - facingDx * FOLLOW * 0.8 + (facingDy !== 0 ? TILE * 0.35 : 0);
    this.y = y - facingDy * FOLLOW * 0.8 + (facingDx !== 0 ? TILE * 0.25 : 0);
    this.trail = [];
    this.last = { x, y };
    this.angle = Math.atan2(x - this.x, y - this.y);
    this.idle = 0;
    this.basket = null;
    this.cancelDig();
    this.sync(0);
  }

  /** Über `path` ins Körbchen bei `pos` laufen (drinnen) */
  setBasket(pos: { x: number; y: number }, path: Array<{ x: number; y: number }>) {
    this.basket = pos;
    this.trail = [...path, pos];
  }

  /** Ist auf dem Weg ins Körbchen oder liegt schon drin */
  get hasBasket() {
    return !!this.basket;
  }

  get inBasket() {
    return !!this.basket && Math.hypot(this.basket.x - this.x, this.basket.y - this.y) < 4;
  }

  /** Streicheln: wedeln, Kopf schief, Herzchen */
  pet(sleeping: boolean) {
    if (sleeping) {
      this.burst('zzz');
      return;
    }
    this.wag = 1;
    this.idle = 2;
    this.tilt = Math.random() < 0.5 ? -1 : 1;
    this.burst('herz');
  }

  /** Ein Symbol steigt über dem Kopf auf */
  burst(kind: Emote) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.emote(kind), transparent: true, depthWrite: false }));
    s.scale.setScalar(0.25);
    const from = this.dog.root.position.clone().add(new THREE.Vector3(0, this.dog.headHeight, 0));
    s.position.copy(from);
    this.scene.add(s);
    this.tweens.add(1100, (t) => {
      s.position.set(from.x + Math.sin(t * 6) * 0.05, from.y + t * 0.45, from.z);
      s.material.opacity = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
      s.scale.setScalar(0.18 + Math.min(1, t * 4) * 0.1);
    }, () => {
      s.removeFromParent();
      s.material.dispose();
    });
  }

  /** Buddeln (ca. 2 Sekunden), danach `done` */
  dig(towardsX: number, towardsY: number, done: () => void) {
    this.angle = Math.atan2(towardsX - this.x, towardsY - this.y);
    this.digLeft = 2.2;
    this.onDug = done;
    this.burst('note');
  }

  private cancelDig() {
    this.digLeft = 0;
    this.onDug = null;
    for (const d of this.dirt) d.visible = false;
  }

  /** Vor der Nase (Welteinheiten) – dort landet der Fund */
  get nosePoint() {
    return { x: this.x + Math.sin(this.angle) * TILE * 0.45, y: this.y + Math.cos(this.angle) * TILE * 0.45 };
  }

  update(dtMs: number, lina: { x: number; y: number; moving: boolean }, night: boolean, solid: (tx: number, ty: number) => boolean) {
    const dt = Math.min(0.05, dtMs / 1000);
    this.time += dt;

    // Verfangen: bleibt sitzen, zittert, schaut zu Lina
    if (this.lostAt) {
      this.moving = false;
      this.idle += dt;
      this.angle = turn(this.angle, Math.atan2(lina.x - this.x, lina.y - this.y), dt * 3);
      this.tilt = Math.sin(this.time * 11) * 0.12;
      this.wag = 0.1;
      this.sleeping = false;
      this.sync(dt);
      return;
    }

    // Großer Sprung (Teleport) → direkt hinterher
    if (Math.hypot(lina.x - this.last.x, lina.y - this.last.y) > TILE * 3) this.placeNear(lina.x, lina.y, 0, 1);

    // Spur von Lina aufzeichnen
    if (Math.hypot(lina.x - this.last.x, lina.y - this.last.y) >= TRAIL_STEP) {
      this.last = { x: lina.x, y: lina.y };
      if (!this.basket) this.trail.push({ ...this.last });
      if (this.trail.length > TRAIL_MAX) this.trail.splice(0, this.trail.length - TRAIL_MAX);
    }
    if (lina.moving && this.basket) {
      this.basket = null;
      this.trail = [];
    }
    if (lina.moving) this.settle = null;

    // Wie weit ist es noch (entlang der Spur)?
    const goal = this.basket ?? this.settle ?? lina;
    let remaining = 0;
    let px = this.x;
    let py = this.y;
    for (const p of this.trail) {
      remaining += Math.hypot(p.x - px, p.y - py);
      px = p.x;
      py = p.y;
    }
    remaining += Math.hypot(goal.x - px, goal.y - py);
    const keep = this.basket || this.settle ? 0 : FOLLOW;

    // Lina steht: von hinter ihr (aus Kamerasicht verdeckt) an ihre Seite trippeln
    if (!lina.moving && !this.basket && !this.settle && !this.busy && this.idle > 0.6 && remaining <= keep + 8 && this.y < lina.y - 6 && Math.abs(this.x - lina.x) < TILE * 0.75) {
      const first = this.x >= lina.x ? 1 : -1;
      for (const side of [first, -first]) {
        const c = { x: lina.x + side * TILE * 0.8, y: lina.y + 4 };
        if (!solid(Math.floor(c.x / TILE), Math.floor((c.y - 8) / TILE))) {
          this.settle = c;
          this.trail = [];
          break;
        }
      }
    }

    let moved = 0;
    if (this.digLeft > 0) {
      this.digLeft -= dt;
      this.animateDirt();
      if (this.digLeft <= 0) {
        const cb = this.onDug;
        this.cancelDig();
        cb?.();
      }
    } else if (remaining > keep + 6) {
      // Tempo: gemütlich, wenn nah – flitzt, wenn er zurückfällt
      const speed = Math.min(330, Math.max(110, (remaining - keep) * 2.4));
      let budget = Math.min(speed * dt, remaining - keep);
      while (budget > 0.01) {
        const target = this.trail[0] ?? goal;
        const vx = target.x - this.x;
        const vy = target.y - this.y;
        const d = Math.hypot(vx, vy);
        if (d < 0.5) {
          if (this.trail.length === 0) break;
          this.trail.shift();
          continue;
        }
        const s = Math.min(budget, d);
        this.x += (vx / d) * s;
        this.y += (vy / d) * s;
        this.angle = turn(this.angle, Math.atan2(vx, vy), dt * 12);
        budget -= s;
        moved += s;
        if (s >= d - 0.01 && this.trail.length > 0) this.trail.shift();
      }
    }
    this.moving = moved > 0.2;
    this.step += moved / 14;
    if (this.moving || this.busy) this.idle = 0;
    else this.idle += dt;

    // Im Stehen zu Lina schauen
    if (!this.moving && !this.busy && !this.inBasket && this.idle > 0.4) this.angle = turn(this.angle, Math.atan2(lina.x - this.x, lina.y - this.y), dt * 4);

    this.sleeping = !this.moving && !this.busy && ((night && this.idle > 5) || (this.inBasket && this.idle > 6));
    this.wag = Math.max(lina.moving || this.moving ? 0.45 : 0.25, this.wag - dt * 0.6);
    this.tilt *= Math.max(0, 1 - dt * 1.5);
    this.sync(dt);
  }

  private animateDirt() {
    const n = this.nosePoint;
    this.dirt.forEach((d, i) => {
      const ph = (this.time * 3 + i / this.dirt.length) % 1;
      const a = this.angle + Math.PI + (i - 2.5) * 0.35;
      d.visible = true;
      d.position.set((n.x + Math.sin(a) * ph * 30) * UNIT, Math.sin(ph * Math.PI) * 0.25 + 0.02, (n.y + Math.cos(a) * ph * 30) * UNIT);
    });
  }

  private sync(dt: number) {
    const px = this.x * UNIT;
    const pz = this.y * UNIT;
    this.dog.root.position.set(px, Math.max(0, this.heightAt(px, pz)) + (this.inBasket ? 0.07 : 0), pz);
    this.dog.root.rotation.y = this.angle;
    const rest: 0 | 1 | 2 = this.moving || this.busy ? 0 : this.sleeping || this.inBasket || this.idle > 14 ? 2 : this.idle > 1.2 ? 1 : 0;
    this.dog.pose({ step: this.step, moving: this.moving, rest, wag: this.sleeping ? 0 : this.wag, digging: this.busy, tilt: this.tilt, eyesClosed: this.sleeping, t: this.time });

    // Zzz über dem schlafenden Winston
    this.zzz.visible = this.sleeping && this.dog.root.visible;
    if (this.zzz.visible) {
      this.zzzTime = (this.zzzTime + dt * 0.5) % 1;
      this.zzz.position.set(px + 0.12 + this.zzzTime * 0.1, this.dog.root.position.y + 0.3 + this.zzzTime * 0.35, pz);
      this.zzz.material.opacity = Math.sin(this.zzzTime * Math.PI);
    }
  }

  dispose() {
    this.dog.dispose();
    this.zzz.removeFromParent();
    for (const d of this.dirt) d.removeFromParent();
  }
}

function turn(from: number, to: number, k: number) {
  const diff = Math.atan2(Math.sin(to - from), Math.cos(to - from));
  return from + diff * Math.min(1, k);
}
