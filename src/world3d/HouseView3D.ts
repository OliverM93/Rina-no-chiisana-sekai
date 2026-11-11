/**
 * Ein Stockwerk als Ganzes (Konzept: `docs/haus-grundriss.md`, Phasen B/C).
 *
 * Jeder Raum des Stockwerks hat eine eigene `Interior3D` an **fester Stelle** (Welt = ROOM_X/ROOM_Y + Lage im
 * Grundriss) – Möbel, Tapete und Boden je Raum – dazu die Wandstreifen zwischen den Räumen: Seitenwände voll,
 * Wände zwischen vorne und hinten halbhoch. Lina läuft einfach durch die Türen; welcher Raum „aktuell“ ist,
 * entscheidet `World3D` über ihre Position.
 */
import * as THREE from 'three';
import { type FloorPlan, hasRoomBehind, openingsFor, wallStrips } from '../core/floorplan';
import type { Room, RoomLayout } from '../core/room';
import { Interior3D, LOW_WALL_H, ROOM_X, ROOM_Y } from './Interior3D';
import { mesh, toon } from './materials';

const WALL_COLOR = '#ece3d3';
const WALL_H = 2.3;

/** Grundriss mit einem einzigen Raum (Dach, Keller, Besuche, Start) */
export function singleRoomPlan(id: string, roomId: string, w: number, h: number): FloorPlan {
  return { id, rooms: [{ id: roomId, x: 0, y: 0, w, h }], doors: [] };
}

export class HouseView3D {
  private views = new Map<string, Interior3D>();
  private strips = new THREE.Group();
  private key = '';
  plan: FloorPlan = singleRoomPlan('init', 'haupt', 8, 6);

  constructor(private scene: THREE.Scene) {
    scene.add(this.strips);
    this.setFloor(this.plan, 'init');
  }

  /** Optionen für die Wände eines Raums: Türöffnungen, halbhohe Rückwand, alte Tür-Modelle aus */
  static shellFor(plan: FloorPlan, roomId: string) {
    return { openings: openingsFor(plan, roomId), hideExits: false, lowBack: hasRoomBehind(plan, roomId) };
  }

  /** Stockwerk wechseln bzw. neu aufbauen, wenn sich der Grundriss geändert hat. true = neu gebaut */
  setFloor(plan: FloorPlan, key: string): boolean {
    const fullKey = key + JSON.stringify(plan);
    if (fullKey === this.key) return false;
    this.key = fullKey;
    this.plan = plan;
    for (const v of this.views.values()) v.group.removeFromParent();
    this.views.clear();
    this.strips.clear();
    for (const r of plan.rooms) this.views.set(r.id, new Interior3D(this.scene, { x: ROOM_X + r.x, z: ROOM_Y + r.y }));
    this.buildStrips(plan);
    return true;
  }

  view(roomId: string): Interior3D | undefined {
    return this.views.get(roomId);
  }

  /** Irgendein Raum des Stockwerks (Rückfall, solange noch nichts Bestimmtes gewählt ist) */
  first(): Interior3D {
    return this.views.values().next().value as Interior3D;
  }

  all(): Array<[string, Interior3D]> {
    return [...this.views.entries()];
  }

  /** Möbel, Tapete und Boden aller Räume aktualisieren */
  refreshAll(rooms: ReadonlyArray<{ room: Room; layout: RoomLayout }>, collected: ReadonlySet<string>, force = false) {
    for (const { room, layout } of rooms) {
      const view = this.views.get(room.id);
      if (!view) continue;
      view.shellOptions = HouseView3D.shellFor(this.plan, room.id);
      view.collected = collected;
      view.refresh(room, layout, force);
    }
  }

  private buildStrips(plan: FloorPlan) {
    const mat = toon(WALL_COLOR);
    for (const s of wallStrips(plan)) {
      const height = s.vertical ? WALL_H : LOW_WALL_H;
      // Zelle für Zelle, an Türfeldern bleibt unten frei (vertikale Wände bekommen einen Sturz)
      const cells = s.vertical ? s.h : s.w;
      for (let i = 0; i < cells; i++) {
        const gx = s.vertical ? s.x : s.x + i;
        const gy = s.vertical ? s.y + i : s.y;
        const door = s.openings.some((o) => o.x === gx && o.y === gy);
        if (door && !s.vertical) continue;
        const h = door ? height - 1.85 : height;
        const box = mesh(new THREE.BoxGeometry(1, h, 1), mat);
        box.position.set(ROOM_X + gx + 0.5, door ? 1.85 + h / 2 : h / 2, ROOM_Y + gy + 0.5);
        box.castShadow = true;
        box.receiveShadow = true;
        this.strips.add(box);
      }
    }
  }

  updateLight(night: number, clouds: number) {
    for (const v of this.views.values()) v.updateLight(night, clouds);
  }

  setVisible(on: boolean) {
    this.strips.visible = on;
    for (const v of this.views.values()) v.group.visible = on;
  }

  /** Zu welchem Raum gehört ein getroffenes Objekt? */
  roomOf(obj: THREE.Object3D): string | null {
    let o: THREE.Object3D | null = obj;
    while (o) {
      for (const [id, v] of this.views) if (v.group === o) return id;
      o = o.parent;
    }
    return null;
  }
}
