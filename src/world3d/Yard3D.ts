/**
 * Linas Garten in der 3D-Welt: Zäune (verbinden sich mit Nachbarn), Wege,
 * Gartenmöbel, Deko, Hochbeete – plus Vorschau beim Gestalten.
 * Zellen sind Gartenkoordinaten (0,0 = linke obere Ecke von `YARD_AREA`).
 */
import * as THREE from 'three';
import { footprint, itemsAt, type PlacedItem, type Room, type Rotation } from '../core/room';
import { FURNITURE_BY_ITEM, furnitureInfo } from '../data/furniture';
import { YARD_AREA } from '../data/yard';
import { type FenceLinks, makeFurniture, type FurnitureModel, makeGhost } from './models/furniture';

export class Yard3D {
  readonly group = new THREE.Group();
  private items = new THREE.Group();
  private placed = new Map<string, { item: PlacedItem; model: FurnitureModel }>();
  private ghost: THREE.Group | null = null;
  private ghostKey = '';
  private signature = '';
  private lit = new Set<string>();
  /** Zellenrahmen beim Gestalten */
  private grid: THREE.LineSegments;

  constructor(
    scene: THREE.Scene,
    private readonly heightAt: (x: number, z: number) => number,
  ) {
    this.group.position.set(YARD_AREA.x, 0, YARD_AREA.y);
    this.group.add(this.items);
    scene.add(this.group);

    const pts: number[] = [];
    for (let x = 0; x <= YARD_AREA.w; x++) pts.push(x, 0, 0, x, 0, YARD_AREA.h);
    for (let y = 0; y <= YARD_AREA.h; y++) pts.push(0, 0, y, YARD_AREA.w, 0, y);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    this.grid = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.35, depthWrite: false }));
    this.grid.position.y = 0.03;
    this.grid.visible = false;
    this.group.add(this.grid);
  }

  /** Raster beim Gestalten zeigen */
  showGrid(on: boolean) {
    this.grid.visible = on;
  }

  private ground(x: number, y: number) {
    return Math.max(0, this.heightAt(YARD_AREA.x + x, YARD_AREA.y + y));
  }

  refresh(yard: Room, force = false) {
    const sig = JSON.stringify(yard.items);
    if (!force && sig === this.signature) return;
    this.signature = sig;
    this.items.clear();
    this.placed.clear();
    const fenceAt = new Set<string>();
    for (const i of yard.items) if (FURNITURE_BY_ITEM[i.itemId]?.def.fence) fenceAt.add(`${i.x},${i.y}`);
    const byUid = new Map(yard.items.map((i) => [i.uid, i]));
    for (const item of yard.items) {
      const f = FURNITURE_BY_ITEM[item.itemId];
      if (!f) continue;
      const links: FenceLinks = { n: fenceAt.has(`${item.x},${item.y - 1}`), e: fenceAt.has(`${item.x + 1},${item.y}`), s: fenceAt.has(`${item.x},${item.y + 1}`), w: fenceAt.has(`${item.x - 1},${item.y}`) };
      const model = makeFurniture(item.itemId, links);
      const { w, d } = footprint(f.def, item.rot);
      const cx = item.x + w / 2;
      const cz = item.y + d / 2;
      model.group.position.set(cx, this.ground(cx, cz), cz);
      if (!f.def.fence) model.group.rotation.y = -item.rot * (Math.PI / 2);
      const base = item.on ? byUid.get(item.on) : undefined;
      if (base) model.group.position.y += FURNITURE_BY_ITEM[base.itemId]?.def.surfaceHeight ?? 0;
      if (f.def.rug) model.group.position.y += 0.004;
      this.items.add(model.group);
      this.placed.set(item.uid, { item, model });
    }
  }

  topAt(yard: Room, x: number, y: number): PlacedItem | null {
    return itemsAt(yard, x, y, furnitureInfo)[0] ?? null;
  }

  model(uid: string): FurnitureModel | null {
    return this.placed.get(uid)?.model ?? null;
  }

  /** Lampen & Lichterketten leuchten abends (anklicken = an/aus) */
  updateLight(night: number) {
    const auto = night > 0.25;
    for (const [uid, p] of this.placed) {
      const on = this.lit.has(uid) ? !auto : auto;
      if (p.model.glow) p.model.glow.emissiveIntensity = on ? 1.1 : 0.12;
      p.model.group.traverse((o) => {
        if (!o.userData.bulb) return;
        ((o as THREE.Mesh).material as THREE.MeshToonMaterial).emissiveIntensity = on ? 1.2 : 0.15;
      });
    }
  }

  toggleLamp(uid: string) {
    if (this.lit.has(uid)) this.lit.delete(uid);
    else this.lit.add(uid);
  }

  /** Punkt auf dem Boden → Gartenzelle (oder null außerhalb) */
  cellFromPoint(p: THREE.Vector3): { x: number; y: number } | null {
    const x = Math.floor(p.x - YARD_AREA.x);
    const y = Math.floor(p.z - YARD_AREA.y);
    return x < 0 || y < 0 || x >= YARD_AREA.w || y >= YARD_AREA.h ? null : { x, y };
  }

  showGhost(itemId: string, x: number, y: number, rot: Rotation, valid: boolean, onHeight = 0) {
    const f = FURNITURE_BY_ITEM[itemId];
    if (!f) return this.hideGhost();
    const k = `${itemId}:${valid}`;
    if (!this.ghost || this.ghostKey !== k) {
      this.hideGhost();
      this.ghost = makeGhost(itemId, valid);
      this.ghostKey = k;
      this.group.add(this.ghost);
    }
    const { w, d } = footprint(f.def, rot);
    const cx = x + w / 2;
    const cz = y + d / 2;
    this.ghost.position.set(cx, this.ground(cx, cz) + onHeight, cz);
    this.ghost.rotation.y = f.def.fence ? 0 : -rot * (Math.PI / 2);
    const marker = this.ghost.getObjectByName('marker');
    if (marker) {
      marker.scale.set(f.def.w, 1, f.def.d);
      marker.position.y = 0.02 - onHeight;
    }
  }

  hideGhost() {
    this.ghost?.removeFromParent();
    this.ghost = null;
    this.ghostKey = '';
  }

  setHidden(uid: string | null) {
    for (const [id, p] of this.placed) p.model.group.visible = id !== uid && p.item.on !== uid;
  }
}
