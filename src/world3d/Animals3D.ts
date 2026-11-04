/**
 * Hühner & Wachteln in Linas Garten: trippeln um ihren Stall herum, picken,
 * hüpfen beim Streicheln und gehen nachts schlafen (in den Stall).
 * Positionen in Kacheln (3D), Logik bleibt einfach und reproduzierbar genug.
 */
import * as THREE from 'three';
import type { CoopKind } from '../core/coop';
import type { CollisionGrid } from '../core/grid';
import { footprint, type Room } from '../core/room';
import { COOPS } from '../data/animals';
import { FURNITURE_BY_ITEM } from '../data/furniture';
import { YARD_AREA } from '../data/yard';
import { type BirdModel, makeHen, makeQuail } from './models/critters';

interface Bird {
  coop: string;
  kind: CoopKind;
  model: BirdModel;
  x: number;
  z: number;
  angle: number;
  target: { x: number; z: number } | null;
  /** Zeit bis zur nächsten Entscheidung */
  wait: number;
  peck: number;
  hop: number;
  step: number;
}

/** Wie weit sich die Tiere vom Stall entfernen (Kacheln) */
const RANGE = 2.6;

export class Animals3D {
  private group = new THREE.Group();
  private birds: Bird[] = [];
  private signature = '';
  private time = 0;

  constructor(
    scene: THREE.Scene,
    private readonly grid: CollisionGrid,
    private readonly heightAt: (x: number, z: number) => number,
  ) {
    scene.add(this.group);
  }

  /** Ställe im Garten → Tiere (neu aufbauen, wenn sich Ställe ändern) */
  refresh(yard: Room) {
    const coops = yard.items.filter((i) => FURNITURE_BY_ITEM[i.itemId]?.def.coop);
    const sig = JSON.stringify(coops.map((c) => [c.uid, c.x, c.y, c.rot]));
    if (sig === this.signature) return;
    this.signature = sig;
    this.group.clear();
    this.birds = [];
    for (const c of coops) {
      const f = FURNITURE_BY_ITEM[c.itemId];
      const kind = f.def.coop as CoopKind;
      const def = COOPS[kind];
      const home = this.home(c.uid, yard);
      if (!home) continue;
      for (let i = 0; i < def.animals; i++) {
        const color = def.colors[i % def.colors.length];
        const model = kind === 'huhn' ? makeHen(color) : makeQuail(color);
        this.group.add(model.group);
        const a = (i / def.animals) * Math.PI * 2;
        this.birds.push({ coop: c.uid, kind, model, x: home.x + Math.cos(a) * 0.5, z: home.z + Math.sin(a) * 0.4, angle: a, target: null, wait: Math.random() * 2, peck: 0, hop: 0, step: 0 });
      }
    }
  }

  private yard: Room | null = null;

  /** Vor dem Stall (Mitte der Vorderkante), in Kacheln */
  private home(uid: string, yard: Room | null = this.yard): { x: number; z: number } | null {
    const c = yard?.items.find((i) => i.uid === uid);
    const f = c ? FURNITURE_BY_ITEM[c.itemId] : undefined;
    if (!c || !f) return null;
    const { w, d } = footprint(f.def, c.rot);
    const front = [[0, 1], [-1, 0], [0, -1], [1, 0]][c.rot];
    const cx = YARD_AREA.x + c.x + w / 2;
    const cz = YARD_AREA.y + c.y + d / 2;
    return { x: cx + front[0] * (d / 2 + 0.6), z: cz + front[1] * (d / 2 + 0.6) };
  }

  private free(x: number, z: number) {
    return !this.grid.isBlocked(Math.floor(x), Math.floor(z));
  }

  /** Neues Ziel in der Nähe des Stalls, auf freiem Boden und ohne Hindernis dazwischen */
  private pickTarget(b: Bird) {
    const home = this.home(b.coop);
    if (!home) return;
    for (let tries = 0; tries < 8; tries++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * RANGE;
      const tx = home.x + Math.cos(a) * r;
      const tz = home.z + Math.sin(a) * r;
      let ok = this.free(tx, tz);
      for (let k = 1; ok && k < 6; k++) ok = this.free(b.x + ((tx - b.x) * k) / 6, b.z + ((tz - b.z) * k) / 6);
      if (ok) {
        b.target = { x: tx, z: tz };
        return;
      }
    }
  }

  update(dt: number, yard: Room | undefined, night: boolean, visible: boolean) {
    this.yard = yard ?? null;
    this.time += dt;
    this.group.visible = visible && !night;
    if (!this.group.visible) return;
    for (const b of this.birds) {
      b.hop = Math.max(0, b.hop - dt * 2.2);
      if (b.target) {
        const dx = b.target.x - b.x;
        const dz = b.target.z - b.z;
        const d = Math.hypot(dx, dz);
        const speed = b.kind === 'huhn' ? 0.9 : 1.2;
        if (d < 0.05) {
          b.target = null;
          b.wait = 0.8 + Math.random() * 2.5;
          if (Math.random() < 0.6) b.peck = 1.2;
        } else {
          const s = Math.min(d, speed * dt);
          const nx = b.x + (dx / d) * s;
          const nz = b.z + (dz / d) * s;
          if (this.free(nx, nz)) {
            b.x = nx;
            b.z = nz;
          } else b.target = null;
          b.angle = Math.atan2(dx, dz);
          b.step += s * 12;
        }
      } else {
        b.wait -= dt;
        if (b.wait <= 0) this.pickTarget(b);
      }
      b.peck = Math.max(0, b.peck - dt);
      this.pose(b);
    }
  }

  private pose(b: Bird) {
    const g = b.model.group;
    const ground = Math.max(0, this.heightAt(b.x, b.z));
    g.position.set(b.x, ground + Math.sin(b.hop * Math.PI) * 0.15, b.z);
    g.rotation.y = b.angle;
    const pecking = b.peck > 0;
    b.model.head.rotation.x = pecking ? 0.4 + Math.abs(Math.sin(this.time * 14)) * 0.6 : Math.sin(this.time * 2 + b.x) * 0.05;
    const moving = !!b.target;
    b.model.legs.forEach((l, i) => (l.rotation.x = moving ? Math.sin(b.step + i * Math.PI) * 0.6 : 0));
  }

  /** Tier vor Lina (Weltkacheln, Blickrichtung) – Index oder -1 */
  nearest(x: number, z: number, fx: number, fz: number): number {
    let best = -1;
    let bestD = 1.2;
    this.birds.forEach((b, i) => {
      const dx = b.x - x;
      const dz = b.z - z;
      const d = Math.hypot(dx, dz);
      if (d < bestD && dx * fx + dz * fz > d * 0.2) {
        best = i;
        bestD = d;
      }
    });
    return this.group.visible ? best : -1;
  }

  /** Streicheln: kleiner Hüpfer, schaut zu Lina */
  pet(i: number, fromX: number, fromZ: number): CoopKind | null {
    const b = this.birds[i];
    if (!b) return null;
    b.hop = 1;
    b.target = null;
    b.wait = 1.5;
    b.angle = Math.atan2(fromX - b.x, fromZ - b.z);
    return b.kind;
  }

  birdPosition(i: number): THREE.Vector3 | null {
    return this.birds[i]?.model.group.position ?? null;
  }

  get count() {
    return this.birds.length;
  }
}
