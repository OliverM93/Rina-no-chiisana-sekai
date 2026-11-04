/**
 * Ein Bewohner in der Welt: folgt seinem Tagesablauf (Bank, Spaziergang,
 * Zuhause), läuft per Wegfindung und bleibt stehen, wenn Lina mit ihm redet.
 */
import type * as THREE from 'three';
import { TILE } from '../config';
import { findPath, nearestWalkable, type Tile } from '../core/grid';
import { mulberry32 } from '../core/rng';
import { type Activity, activityAt, type ScheduleEntry } from '../core/schedule';
import { OBJECT_KINDS, objectById, tileOf, type WorldMap } from '../core/worldmap';
import type { NpcDef } from '../data/npcs/types';
import type { Session } from '../game/session';
import { Character, FEET_OFFSET } from './Character3D';

type Mode = 'hidden' | 'walking' | 'sitting' | 'idle' | 'talking' | 'scripted';

const NPC_SPEED = 0.72;

export class Npc {
  readonly char: Character;
  private mode: Mode = 'idle';
  private entry: ScheduleEntry | null = null;
  private wanderTimer = 0;
  private rnd = mulberry32(Date.now() & 0xffff);
  private afterTalk: Mode = 'idle';
  private seatFront: Tile | null = null;

  constructor(
    parent: THREE.Object3D,
    readonly def: NpcDef,
    private readonly session: Session,
    heightAt: (x: number, z: number) => number,
  ) {
    const door = this.doorTile();
    const start = door ? tileCenterFeet(door) : { x: 0, y: 0 };
    this.char = new Character(parent, def.appearance, start.x, start.y, 'down', heightAt, session.season);
    this.char.speedFactor = NPC_SPEED;
    // Gleich an die richtige Stelle setzen (ohne Laufen)
    this.applyEntry(activityAt(def.schedule, session.clock()), true);
  }

  private get map(): WorldMap {
    return this.session.map;
  }

  /** Ist sie gerade in der Welt zu sehen (nicht im Haus)? */
  get present(): boolean {
    return this.mode !== 'hidden';
  }

  /** Aktueller Eintrag im Tagesablauf (z. B. „programmiert“, zu Hause) */
  get currentEntry(): ScheduleEntry | null {
    return this.entry;
  }

  /** Ist zu Hause (und damit drinnen, nicht in der Welt) */
  get atHome(): boolean {
    const hidden = this.mode === 'hidden' || (this.mode === 'talking' && this.afterTalk === 'hidden');
    return hidden && this.entry?.activity.kind === 'zuhause';
  }

  get isSleeping(): boolean {
    return this.mode === 'hidden' && this.entry?.activity.kind === 'zuhause' && !!this.entry.activity.sleeping;
  }

  get x() {
    return this.char.x;
  }

  get y() {
    return this.char.y;
  }

  /** Höhe über dem Boden für die Sprechblase (in Kacheln) */
  get bubbleHeight() {
    return this.char.sitting ? 1.35 : 1.15;
  }

  // -------------------------------------------------------------------------

  /** Wohnt sie/er schon im Dorf? */
  get movedIn(): boolean {
    return !this.def.movesIn || !!this.session.data?.flags[this.def.movesIn];
  }

  update(dtMs: number) {
    const grid = this.map.grid;
    if (!this.movedIn) {
      if (this.mode !== 'hidden') this.hide();
      this.entry = null;
      return;
    }
    if (this.mode === 'talking' || this.mode === 'scripted') {
      this.char.update(dtMs, { dx: 0, dy: 0, run: false }, (x, y) => grid.isBlocked(x, y));
      return;
    }
    const entry = activityAt(this.def.schedule, this.session.clock());
    if (entry !== this.entry) this.applyEntry(entry, false);

    if (this.mode === 'idle' && this.entry?.activity.kind === 'spazieren') {
      this.wanderTimer -= dtMs / 1000;
      if (this.wanderTimer <= 0) this.wander(this.entry.activity.area);
    }
    if (this.mode !== 'hidden') {
      this.char.update(dtMs, { dx: 0, dy: 0, run: false }, (x, y) => grid.isBlocked(x, y));
    }
  }

  /** Lina spricht sie an: anhalten und hinschauen. */
  startTalk(lx: number, ly: number) {
    if (this.mode === 'talking') return;
    this.afterTalk = this.mode === 'walking' ? 'idle' : this.mode;
    if (this.mode === 'walking') this.char.cancelPath();
    this.mode = 'talking';
    if (!this.char.sitting) this.char.faceTowards(lx, ly);
  }

  endTalk() {
    if (this.mode !== 'talking') return;
    this.mode = this.afterTalk;
    this.wanderTimer = 1.5;
    // War sie unterwegs, plant sie ihren Weg neu.
    if (this.afterTalk === 'idle' && this.entry?.activity.kind !== 'spazieren') this.entry = null;
  }

  /** Für Story-Szenen: zu einer Kachel laufen, dann Callback. */
  scriptWalkTo(tile: Tile, onArrive: () => void) {
    this.mode = 'scripted';
    this.char.setSitting(false);
    this.char.setVisible(true);
    const target = nearestWalkable(this.map.grid, tile, this.char.tile) ?? tile;
    const path = findPath(this.map.grid, this.char.tile, target);
    if (!path) {
      this.char.teleport(tileCenterFeet(target).x, tileCenterFeet(target).y);
      onArrive();
      return;
    }
    this.char.followPath(path, onArrive);
  }

  /** Story-Szene setzt sie direkt irgendwohin */
  scriptPlace(tile: Tile) {
    this.mode = 'scripted';
    this.char.setSitting(false);
    this.char.setVisible(true);
    const p = tileCenterFeet(tile);
    this.char.teleport(p.x, p.y);
  }

  /** Story-Szene beendet → zurück zum Tagesablauf */
  scriptDone() {
    this.mode = 'idle';
    this.entry = null;
  }

  // -------------------------------------------------------------------------

  private applyEntry(entry: ScheduleEntry, instant: boolean) {
    this.entry = entry;
    const a: Activity = entry.activity;
    if (this.char.sitting && this.seatFront) {
      // von der Bank aufstehen
      const p = tileCenterFeet(this.seatFront);
      this.char.setSitting(false);
      this.char.teleport(p.x, p.y);
    }
    this.char.setSitting(false);
    this.char.depthBias = 0;
    switch (a.kind) {
      case 'zuhause': {
        const door = this.doorTile();
        if (instant || !door || !this.char.visible) {
          this.hide();
        } else {
          this.goTo(door, () => this.hide());
        }
        break;
      }
      case 'sitzen': {
        const bench = objectById(this.map, a.bench);
        if (!bench) break;
        const front = { x: bench.x + 1, y: bench.y + 1 };
        this.seatFront = front;
        const sit = () => {
          this.mode = 'sitting';
          // linke Bankhälfte – rechts ist Platz für Lina
          this.char.teleport((bench.x + 0.62) * TILE, (bench.y + 0.5) * TILE + 2);
          this.char.setSitting(true);
          this.char.seatHeight = 0.37;
        };
        if (instant) {
          this.show();
          sit();
        } else {
          this.goTo(front, sit);
        }
        break;
      }
      case 'stehen': {
        const t = { x: a.x, y: a.y };
        const stand = () => {
          this.mode = 'idle';
          this.char.face(a.facing);
        };
        if (instant) {
          this.show();
          const p = tileCenterFeet(t);
          this.char.teleport(p.x, p.y);
          stand();
        } else {
          this.goTo(t, stand);
        }
        break;
      }
      case 'spazieren': {
        if (instant) {
          this.show();
          const t = this.randomTileIn(a.area);
          const p = tileCenterFeet(t);
          this.char.teleport(p.x, p.y);
          this.mode = 'idle';
          this.wanderTimer = 2;
        } else {
          this.goTo(this.randomTileIn(a.area), () => {
            this.mode = 'idle';
            this.wanderTimer = 3 + this.rnd() * 4;
          });
        }
        break;
      }
    }
  }

  private wander(area: { x: number; y: number; w: number; h: number }) {
    const target = this.randomTileIn(area);
    this.goTo(target, () => {
      this.mode = 'idle';
      this.wanderTimer = 4 + this.rnd() * 7;
      // sich ein bisschen umschauen
      const dirs = ['down', 'left', 'right', 'down'] as const;
      this.char.face(dirs[Math.floor(this.rnd() * dirs.length)]);
    });
  }

  private goTo(tile: Tile, onArrive: () => void) {
    if (!this.char.visible) {
      // aus dem Haus kommen
      const door = this.doorTile();
      if (door) {
        const p = tileCenterFeet(door);
        this.char.teleport(p.x, p.y);
      }
      this.show();
    }
    const target = nearestWalkable(this.map.grid, tile, this.char.tile) ?? tile;
    const path = findPath(this.map.grid, this.char.tile, target);
    if (!path) {
      const p = tileCenterFeet(target);
      this.char.teleport(p.x, p.y);
      onArrive();
      return;
    }
    this.mode = 'walking';
    this.char.followPath(path, onArrive);
  }

  private hide() {
    this.mode = 'hidden';
    this.char.setVisible(false);
    const door = this.doorTile();
    if (door) {
      const p = tileCenterFeet(door);
      this.char.teleport(p.x, p.y);
    }
  }

  private show() {
    this.char.setVisible(true);
  }

  private doorTile(): Tile | null {
    const house = objectById(this.map, this.def.home);
    if (!house) return null;
    const [dx, dy] = OBJECT_KINDS.house.interactFrom?.[0] ?? [2, 3];
    return { x: house.x + dx, y: house.y + dy };
  }

  private randomTileIn(area: { x: number; y: number; w: number; h: number }): Tile {
    for (let i = 0; i < 20; i++) {
      const t = { x: area.x + Math.floor(this.rnd() * area.w), y: area.y + Math.floor(this.rnd() * area.h) };
      if (!this.map.grid.isBlocked(t.x, t.y)) return t;
    }
    return tileOf(this.char.x, this.char.y);
  }
}

export function tileCenterFeet(t: Tile) {
  return { x: (t.x + 0.5) * TILE, y: (t.y + 0.5) * TILE + FEET_OFFSET };
}
