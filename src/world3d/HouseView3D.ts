/**
 * Ein Stockwerk als Ganzes (Konzept: `docs/haus-grundriss.md`, Phasen B/C).
 *
 * Jeder Raum des Stockwerks hat eine eigene `Interior3D` an **fester Stelle** (Welt = ROOM_X/ROOM_Y + Lage im
 * Grundriss) – Möbel, Tapete und Boden je Raum – dazu die Wandstreifen zwischen den Räumen: Seitenwände voll,
 * Wände zwischen vorne und hinten halbhoch. Lina läuft einfach durch die Türen; welcher Raum „aktuell“ ist,
 * entscheidet `World3D` über ihre Position.
 */
import * as THREE from 'three';
import { type FloorPlan, openingsFor, wallStrips } from '../core/floorplan';
import type { Room, RoomLayout } from '../core/room';
import { Interior3D, ROOM_X, ROOM_Y } from './Interior3D';
import { mesh, toon } from './materials';


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
    return { openings: openingsFor(plan, roomId), hideExits: false };
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
    for (const r of plan.rooms) {
      const view = new Interior3D(this.scene, { x: ROOM_X + r.x, z: ROOM_Y + r.y });
      view.setLightsActive(false);
      this.views.set(r.id, view);
    }
    this.buildStrips(plan);
    return true;
  }

  /**
   * Rückwand des Raums `roomId` (samt Querstreifen dahinter) durchsichtig machen. 1 = voll, 0 = weg.
   * Die Querstreifen teilen sich ein Material (alle Räume mit Raum dahinter blenden zusammen).
   */
  setBackFade(roomId: string, opacity: number) {
    this.views.get(roomId)?.setBackFade(opacity);
  }

  setSideFade(roomId: string, side: 'left' | 'right', opacity: number) {
    this.views.get(roomId)?.setSideFade(side, opacity);
  }

  /** Welcher Raum bekommt die echten Lichter? (immer genau einer: gleiche Lichtanzahl, kein Shader-Neubau) */
  setActive(roomId: string) {
    for (const [id, v] of this.views) v.setLightsActive(id === roomId);
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

  /**
   * Zwischen zwei Räumen liegt im Grundriss ein Wandstreifen. Die Wände selbst gehören den Räumen (dünn, mit der
   * Tapete des jeweiligen Raums); im Streifen dazwischen liegt nur ein dunkler Boden („Mauerdicke“), an Türen
   * eine hölzerne Schwelle. So wirken die Wände dünn, und die Rückwand lässt sich allein durchsichtig machen.
   */
  private buildStrips(plan: FloorPlan) {
    const floorMat = toon('#9b846f');
    const sillMat = toon('#c9a77c');
    for (const s of wallStrips(plan)) {
      for (let dx = 0; dx < s.w; dx++) {
        for (let dy = 0; dy < s.h; dy++) {
          const gx = s.x + dx;
          const gy = s.y + dy;
          const door = s.openings.some((o) => o.x === gx && o.y === gy);
          const slab = mesh(new THREE.BoxGeometry(1, 0.06, 1), door ? sillMat : floorMat, false, true);
          slab.position.set(ROOM_X + gx + 0.5, door ? 0.01 : -0.02, ROOM_Y + gy + 0.5);
          this.strips.add(slab);
        }
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
