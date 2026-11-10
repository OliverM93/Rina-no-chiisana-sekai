/**
 * Das ganze Erdgeschoss auf einen Blick (Konzept: `docs/haus-grundriss.md`, Phase B).
 *
 * Linas aktueller Raum wird weiter von `Interior3D` in `World3D` gezeichnet. Diese Klasse zeichnet die
 * **übrigen Räume** des Stockwerks daneben (je eine eigene `Interior3D` mit Möbeln, Tapete und Boden) und
 * die **Wandstreifen** dazwischen – Seitenwände voll, Wände zwischen vorne und hinten halbhoch.
 */
import * as THREE from 'three';
import { type FloorPlan, hasRoomBehind, openingsFor, roomById, wallStrips } from '../core/floorplan';
import type { Room } from '../core/room';
import { layoutOf } from '../data/house';
import { Interior3D, LOW_WALL_H, ROOM_X, ROOM_Y } from './Interior3D';
import { mesh, toon } from './materials';

const WALL_COLOR = '#ece3d3';
const WALL_H = 2.3;

export class HouseView3D {
  private views = new Map<string, Interior3D>();
  private strips = new THREE.Group();
  private key = '';

  constructor(private scene: THREE.Scene) {
    scene.add(this.strips);
  }

  /** Optionen für den Raum, den `World3D` selbst zeichnet (Öffnungen, halbhohe Rückwand) */
  static shellFor(plan: FloorPlan, roomId: string) {
    return { openings: openingsFor(plan, roomId), hideExits: true, lowBack: hasRoomBehind(plan, roomId) };
  }

  /**
   * Zeichnet alle Räume außer `currentId` (sie liegen so, dass `currentId` bei (ROOM_X, ROOM_Y) bleibt).
   * `rooms` = Möbel/Tapete je Raum aus dem Spielstand.
   */
  refresh(plan: FloorPlan, stage: number, rooms: readonly Room[], currentId: string, collected: ReadonlySet<string>) {
    const cur = roomById(plan, currentId);
    if (!cur) return this.clear();
    const key = `${plan.id}:${stage}:${currentId}`;
    const rebuild = key !== this.key;
    this.key = key;
    if (rebuild) {
      this.clear();
      this.buildStrips(plan, cur.x, cur.y);
    }
    for (const r of plan.rooms) {
      if (r.id === currentId) continue;
      const room = rooms.find((x) => x.id === r.id);
      if (!room) continue;
      let view = this.views.get(r.id);
      if (!view) {
        view = new Interior3D(this.scene, { x: ROOM_X + r.x - cur.x, z: ROOM_Y + r.y - cur.y });
        this.views.set(r.id, view);
      }
      view.shellOptions = HouseView3D.shellFor(plan, r.id);
      view.collected = collected;
      view.refresh(room, layoutOf(stage, r.id), rebuild);
    }
  }

  private buildStrips(plan: FloorPlan, curX: number, curY: number) {
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
        box.position.set(ROOM_X + gx - curX + 0.5, door ? 1.85 + h / 2 : h / 2, ROOM_Y + gy - curY + 0.5);
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

  clear() {
    this.key = '';
    this.strips.clear();
    for (const v of this.views.values()) v.group.removeFromParent();
    this.views.clear();
  }
}
