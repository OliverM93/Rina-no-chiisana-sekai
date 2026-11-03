/**
 * Linas Zimmer in 3D. Es liegt weit abseits vom Dorf (gleiche Szene, der
 * Nebel versteckt das Dorf) – so bleiben Lina, Licht und Kamera dieselben.
 */
import * as THREE from 'three';
import { blockedCells, DESK_CELL, DOOR_CELLS, footprint, type Home, itemsAt, type PlacedItem, ROOM_H, ROOM_W, type Rotation } from '../core/room';
import { FURNITURE_BY_ITEM, furnitureInfo, SURFACE_BY_ID } from '../data/furniture';
import { drawPattern } from '../gfx/interior';
import { mesh, toon } from './materials';
import { type FurnitureModel, makeCatalogDesk, makeFurniture } from './models/furniture';

/** Lage des Zimmers in Weltkacheln */
export const ROOM_X = 200;
export const ROOM_Y = 200;
const WALL_H = 2.3;
const MAX_LAMPS = 3;

interface Placed {
  item: PlacedItem;
  model: FurnitureModel;
}

export class Interior3D {
  readonly group = new THREE.Group();
  private furniture = new THREE.Group();
  private placed = new Map<string, Placed>();
  private floorMat = new THREE.MeshToonMaterial();
  private wallMat = new THREE.MeshToonMaterial();
  private signature = '';
  private lamps: THREE.PointLight[] = [];
  private roomLight = new THREE.PointLight('#ffe2b8', 0, 12, 1.4);
  private ghost: THREE.Group | null = null;
  private ghostKey = '';
  private windowGlass: THREE.MeshToonMaterial;
  readonly floor: THREE.Mesh;
  private lit = new Set<string>();

  constructor(scene: THREE.Scene) {
    this.group.position.set(ROOM_X, 0, ROOM_Y);
    // Boden
    this.floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_H).rotateX(-Math.PI / 2), this.floorMat);
    this.floor.position.set(ROOM_W / 2, 0, ROOM_H / 2);
    this.floor.receiveShadow = true;
    this.group.add(this.floor);
    // Wände: hinten, links, rechts (vorne offen, wie ein Puppenhaus)
    const back = new THREE.Mesh(new THREE.BoxGeometry(ROOM_W + 0.3, WALL_H, 0.15), this.wallMat);
    back.position.set(ROOM_W / 2, WALL_H / 2, -0.075);
    const left = new THREE.Mesh(new THREE.BoxGeometry(0.15, WALL_H, ROOM_H), this.wallMat);
    left.position.set(-0.075, WALL_H / 2, ROOM_H / 2);
    const right = left.clone();
    right.position.x = ROOM_W + 0.075;
    for (const w of [back, left, right]) {
      w.receiveShadow = true;
      this.group.add(w);
    }
    // Fußleisten & Sockel
    const trim = toon('#cfa175');
    for (const [w, d, x, z] of [[ROOM_W, 0.06, ROOM_W / 2, 0.03], [0.06, ROOM_H, 0.03, ROOM_H / 2], [0.06, ROOM_H, ROOM_W - 0.03, ROOM_H / 2]] as const) {
      const t = mesh(new THREE.BoxGeometry(w, 0.12, d), trim);
      t.position.set(x, 0.06, z);
      this.group.add(t);
    }
    // Sockel rundherum (Hausboden)
    const base = mesh(new THREE.BoxGeometry(ROOM_W + 0.6, 0.3, ROOM_H + 0.4), toon('#e6d2b8'), false, true);
    base.position.set(ROOM_W / 2, -0.151, ROOM_H / 2 - 0.1);
    this.group.add(base);
    // Fenster in der Rückwand
    this.windowGlass = new THREE.MeshToonMaterial({ color: '#9fd2ee', emissive: '#9fd2ee', emissiveIntensity: 0.2 });
    for (const x of [2, 6]) {
      const frame = mesh(new THREE.BoxGeometry(1.1, 0.9, 0.06), toon('#ffffff'));
      frame.position.set(x, 1.35, 0.02);
      const glass = mesh(new THREE.BoxGeometry(0.95, 0.75, 0.07), this.windowGlass, false, false);
      glass.position.set(x, 1.35, 0.025);
      const bar = mesh(new THREE.BoxGeometry(0.04, 0.75, 0.08), toon('#ffffff'));
      bar.position.set(x, 1.35, 0.03);
      const sill = mesh(new THREE.BoxGeometry(1.2, 0.05, 0.16), toon('#cfa175'));
      sill.position.set(x, 0.88, 0.08);
      this.group.add(frame, glass, bar, sill);
    }
    // Türmatte
    const mat = mesh(new THREE.BoxGeometry(1.6, 0.02, 0.7), toon('#d98a7a'), false, true);
    mat.position.set(DOOR_CELLS[0][0] + 1, 0.01, ROOM_H - 0.35);
    this.group.add(mat);
    // Katalog-Pult
    const desk = makeCatalogDesk();
    desk.position.set(DESK_CELL[0] + 0.5, 0, DESK_CELL[1] + 0.5);
    this.group.add(desk);

    this.group.add(this.furniture);
    this.roomLight.position.set(ROOM_W / 2, 2.2, ROOM_H / 2 + 0.5);
    this.group.add(this.roomLight);
    for (let i = 0; i < MAX_LAMPS; i++) {
      const l = new THREE.PointLight('#ffcf90', 0, 5, 1.6);
      this.lamps.push(l);
      this.group.add(l);
    }
    scene.add(this.group);
  }

  /** Zellen-Mitte (Zimmerkoordinaten) → 3D-Weltposition */
  cellCenter(x: number, y: number): THREE.Vector3 {
    return new THREE.Vector3(ROOM_X + x + 0.5, 0, ROOM_Y + y + 0.5);
  }

  refresh(home: Home, force = false) {
    const sig = JSON.stringify(home) + [...this.lit].join();
    if (!force && sig === this.signature) return;
    this.signature = sig;
    this.applySurface(this.floorMat, home.floor, ROOM_W / 2, ROOM_H / 2);
    this.applySurface(this.wallMat, home.wallpaper, ROOM_W / 2, 1);
    this.furniture.clear();
    this.placed.clear();
    const byUid = new Map(home.items.map((i) => [i.uid, i]));
    for (const item of home.items) {
      const f = FURNITURE_BY_ITEM[item.itemId];
      if (!f) continue;
      const model = makeFurniture(item.itemId);
      const { w, d } = footprint(f.def, item.rot);
      model.group.position.set(item.x + w / 2, 0, item.y + d / 2);
      model.group.rotation.y = -item.rot * (Math.PI / 2);
      const base = item.on ? byUid.get(item.on) : undefined;
      if (base) model.group.position.y = FURNITURE_BY_ITEM[base.itemId]?.def.surfaceHeight ?? 0;
      if (f.def.rug) model.group.position.y = 0.002;
      this.furniture.add(model.group);
      this.placed.set(item.uid, { item, model });
    }
  }

  private applySurface(mat: THREE.MeshToonMaterial, id: string, rx: number, ry: number) {
    const def = SURFACE_BY_ID[id];
    if (!def) return;
    if (mat.userData.surface === id) return;
    mat.userData.surface = id;
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    drawPattern(c.getContext('2d') as CanvasRenderingContext2D, def, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(rx, ry);
    mat.map?.dispose();
    mat.map = tex;
    mat.needsUpdate = true;
  }

  /** Licht nach Tageszeit: tagsüber Fensterlicht, abends Lampen */
  updateLight(night: number, clouds: number) {
    this.windowGlass.color.set(night > 0.5 ? '#3a4370' : '#9fd2ee');
    this.windowGlass.emissive.set(night > 0.5 ? '#2a3060' : '#9fd2ee');
    this.windowGlass.emissiveIntensity = 0.25 - clouds * 0.1;
    this.roomLight.intensity = 1.4 + night * 1.6;
    const lamps = [...this.placed.values()].filter((p) => p.model.lightAt);
    for (const p of lamps) if (p.model.glow) p.model.glow.emissiveIntensity = this.isLit(p.item.uid, night) ? 1.1 : 0.12;
    this.lamps.forEach((l, i) => {
      const p = lamps[i];
      if (!p || !p.model.lightAt || !this.isLit(p.item.uid, night)) {
        l.intensity = 0;
        return;
      }
      const at = p.model.lightAt.clone();
      p.model.group.localToWorld(at);
      this.group.worldToLocal(at);
      l.position.copy(at);
      l.intensity = 1.2 + night * 2;
    });
  }

  /** Lampen leuchten abends von selbst; man kann sie an- und ausknipsen */
  private isLit(uid: string, night: number): boolean {
    const auto = night > 0.25;
    return this.lit.has(uid) ? !auto : auto;
  }

  toggleLamp(uid: string) {
    if (this.lit.has(uid)) this.lit.delete(uid);
    else this.lit.add(uid);
  }

  /** Begehbarkeit in Zimmerkoordinaten */
  isBlocked(home: Home, x: number, y: number): boolean {
    // vor der Tür geht's hinaus
    if (y === ROOM_H && DOOR_CELLS.some(([dx]) => dx === x)) return false;
    if (x < 0 || y < 0 || x >= ROOM_W || y >= ROOM_H) return true;
    return blockedCells(home, furnitureInfo).has(`${x},${y}`);
  }

  topAt(home: Home, x: number, y: number): PlacedItem | null {
    return itemsAt(home, x, y, furnitureInfo)[0] ?? null;
  }

  model(uid: string): FurnitureModel | null {
    return this.placed.get(uid)?.model ?? null;
  }

  /** Mauszeiger über dem Boden → Zelle */
  cellFromPoint(p: THREE.Vector3): { x: number; y: number } {
    return { x: Math.floor(p.x - ROOM_X), y: Math.floor(p.z - ROOM_Y) };
  }

  // -------------------------------------------------------------------------
  // Vorschau beim Einrichten
  // -------------------------------------------------------------------------

  showGhost(itemId: string, x: number, y: number, rot: Rotation, valid: boolean, onHeight = 0) {
    const f = FURNITURE_BY_ITEM[itemId];
    if (!f) return this.hideGhost();
    const k = `${itemId}:${valid}`;
    if (!this.ghost || this.ghostKey !== k) {
      this.hideGhost();
      const m = makeFurniture(itemId);
      m.group.traverse((o) => {
        const mm = o as THREE.Mesh;
        if (!mm.isMesh) return;
        const mat = (mm.material as THREE.MeshToonMaterial).clone();
        mat.transparent = true;
        mat.opacity = 0.6;
        mat.emissive = new THREE.Color(valid ? '#7fe08a' : '#ff7a7a');
        mat.emissiveIntensity = 0.45;
        mm.material = mat;
        mm.castShadow = false;
      });
      const marker = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: valid ? '#7fe08a' : '#ff7a7a', transparent: true, opacity: 0.35, depthWrite: false }));
      marker.name = 'marker';
      m.group.add(marker);
      this.ghost = m.group;
      this.ghostKey = k;
      this.group.add(this.ghost);
    }
    const { w, d } = footprint(f.def, rot);
    this.ghost.position.set(x + w / 2, onHeight, y + d / 2);
    this.ghost.rotation.y = -rot * (Math.PI / 2);
    const marker = this.ghost.getObjectByName('marker');
    if (marker) {
      marker.scale.set(f.def.w, 1, f.def.d);
      marker.position.y = 0.01 - onHeight + 0.003;
    }
  }

  hideGhost() {
    this.ghost?.removeFromParent();
    this.ghost = null;
    this.ghostKey = '';
  }

  /** Möbel beim Hochheben ausblenden */
  setHidden(uid: string | null) {
    for (const [id, p] of this.placed) p.model.group.visible = id !== uid && p.item.on !== uid;
  }
}
