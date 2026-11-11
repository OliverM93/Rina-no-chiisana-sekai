/**
 * Linas Zimmer in 3D. Es liegt weit abseits vom Dorf (gleiche Szene, der
 * Nebel versteckt das Dorf) – so bleiben Lina, Licht und Kamera dieselben.
 */
import * as THREE from 'three';
import { backWindows, blockedCells, footprint, itemsAt, type PlacedItem, type Room, type RoomLayout, type Rotation, riderOffset } from '../core/room';
import { FURNITURE_BY_ITEM, furnitureInfo, SURFACE_BY_ID } from '../data/furniture';
import { drawPattern } from '../gfx/interior';
import { mesh, toon } from './materials';
import { type FurnitureModel, makeCatalogDesk, makeFurniture, makeGhost } from './models/furniture';

/** Lage des Zimmers in Weltkacheln */
export const ROOM_X = 200;
export const ROOM_Y = 200;
const WALL_H = 2.3;
const MAX_LAMPS = 3;

interface Placed {
  item: PlacedItem;
  model: FurnitureModel;
}

/** Türöffnung in einer Wand (Raum-Koordinaten): `at` = Feld entlang der Wand */
export interface WallOpening {
  side: 'back' | 'left' | 'right';
  at: number;
}

/** Zusatz beim Bauen des Raums: Türöffnungen in den Wänden; `hideExits` blendet die alten Tür-Modelle aus */
export interface ShellOptions {
  openings?: readonly WallOpening[];
  hideExits?: boolean;
}

export class Interior3D {
  /** Lage der linken oberen Raumecke in der Szene (Weltkacheln) */
  readonly origin: { x: number; z: number };
  shellOptions: ShellOptions = {};
  readonly group = new THREE.Group();
  private furniture = new THREE.Group();
  private placed = new Map<string, Placed>();
  private floorMat = new THREE.MeshToonMaterial();
  private wallMat = new THREE.MeshToonMaterial();
  /** Rückwand mit eigenem Material: sie wird durchsichtig, wenn dahinter ein Raum liegt und man hindurchsehen will */
  private backMat = new THREE.MeshToonMaterial({ transparent: true });
  /** Fenster & Rahmen der Rückwand (verschwinden mit der Wand) */
  private backDeco: THREE.Object3D[] = [];
  private signature = '';
  /** Was Lina gefangen/gefunden hat (Sammelbuch-Einträge) – Vitrine, Insektenkasten & Fischtafel zeigen es */
  collected: ReadonlySet<string> = new Set();
  private lamps: THREE.PointLight[] = [];
  private roomLight = new THREE.PointLight('#ffe2b8', 0, 12, 1.4);
  private ghost: THREE.Group | null = null;
  private ghostKey = '';
  private windowGlass: THREE.MeshToonMaterial;
  readonly floor: THREE.Mesh;
  /** Rück- und Seitenwände (zum Zielen beim Aufhängen von Wand-Deko) */
  walls: THREE.Mesh[] = [];
  private lit = new Set<string>();

  private shell = new THREE.Group();
  private layoutKey = '';
  /** aktueller Raum */
  layout: RoomLayout = { id: 'haupt', name: '', w: 8, h: 6, exits: [] };

  constructor(scene: THREE.Scene, origin: { x: number; z: number } = { x: ROOM_X, z: ROOM_Y }) {
    this.origin = origin;
    this.group.position.set(origin.x, 0, origin.z);
    this.floor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), this.floorMat);
    this.floor.receiveShadow = true;
    this.windowGlass = new THREE.MeshToonMaterial({ color: '#9fd2ee', emissive: '#9fd2ee', emissiveIntensity: 0.2 });
    this.group.add(this.floor, this.shell, this.furniture, this.roomLight);
    for (let i = 0; i < MAX_LAMPS; i++) {
      const l = new THREE.PointLight('#ffcf90', 0, 5, 1.6);
      this.lamps.push(l);
      this.group.add(l);
    }
    scene.add(this.group);
  }

  /** Wände, Fenster, Türen & Treppe für einen Raum bauen */
  private buildShell(layout: RoomLayout) {
    const { w: W, h: H } = layout;
    this.shell.clear();
    this.backDeco = [];
    this.floor.scale.set(W, 1, H);
    this.floor.position.set(W / 2, 0, H / 2);
    const attic = layout.id === 'dach';
    // Wände: hinten, links, rechts (vorne offen, wie ein Puppenhaus)
    const fullH = attic ? 1.6 : WALL_H;
    const wallH = fullH;
    const openings = this.shellOptions.openings ?? [];
    this.walls = [];
    const DOOR_H = 1.85;
    // eine Wand aus Stücken bauen; an Türöffnungen bleibt unten frei, oben sitzt ein Sturz
    const buildWall = (side: 'back' | 'left' | 'right', length: number, extra: number) => {
      const wallH = fullH;
      const gaps = openings.filter((o) => o.side === side).map((o) => o.at).sort((a, b) => a - b);
      const cuts: Array<[number, number, boolean]> = []; // [von, bis, Öffnung?]
      let at = 0;
      for (const g of gaps) {
        if (g > at) cuts.push([at, g, false]);
        cuts.push([g, g + 1, true]);
        at = g + 1;
      }
      if (at < length) cuts.push([at, length, false]);
      if (cuts.length === 0) cuts.push([0, length, false]);
      cuts.forEach(([from, to, open], i) => {
        if (open && wallH <= DOOR_H) return; // niedrige Wand: Öffnung bleibt einfach frei
        const len = to - from + (i === 0 ? extra : 0) + (i === cuts.length - 1 ? extra : 0);
        const mid = (from + to) / 2 + (i === 0 ? -extra / 2 : 0) + (i === cuts.length - 1 ? extra / 2 : 0);
        const h = open ? wallH - DOOR_H : wallH;
        const y = open ? DOOR_H + h / 2 : wallH / 2;
        const geo = side === 'back' ? new THREE.BoxGeometry(len, h, 0.15) : new THREE.BoxGeometry(0.15, h, len);
        const m = new THREE.Mesh(geo, side === 'back' ? this.backMat : this.wallMat);
        if (side === 'back') m.position.set(mid, y, -0.075);
        else m.position.set(side === 'left' ? -0.075 : W + 0.075, y, mid);
        m.userData.wall = side;
        m.receiveShadow = true;
        this.walls.push(m);
        this.shell.add(m);
        if (open && h > 0 && wallH > DOOR_H) {
          // Türrahmen: zwei Pfosten
          for (const edge of [from, to]) {
            const post = mesh(new THREE.BoxGeometry(side === 'back' ? 0.08 : 0.2, DOOR_H, side === 'back' ? 0.2 : 0.08), toon('#a97c56'));
            if (side === 'back') post.position.set(edge, DOOR_H / 2, -0.05);
            else post.position.set(side === 'left' ? -0.05 : W + 0.05, DOOR_H / 2, edge);
            this.shell.add(post);
          }
        }
      });
    };
    buildWall('back', W, 0.15);
    buildWall('left', H, 0);
    buildWall('right', H, 0);
    if (attic) {
      const beam = mesh(new THREE.BoxGeometry(W, 0.14, 0.14), toon('#a97c56'));
      beam.position.set(W / 2, wallH + 0.2, 0.2);
      this.shell.add(beam);
    }
    // Fußleisten
    const trim = toon('#cfa175');
    for (const [tw, td, x, z] of [[W, 0.06, W / 2, 0.03], [0.06, H, 0.03, H / 2], [0.06, H, W - 0.03, H / 2]] as const) {
      const t = mesh(new THREE.BoxGeometry(tw, 0.12, td), trim);
      t.position.set(x, 0.06, z);
      this.shell.add(t);
    }
    const base = mesh(new THREE.BoxGeometry(W + 0.6, 0.3, H + 0.4), toon('#e6d2b8'), false, true);
    base.position.set(W / 2, -0.151, H / 2 - 0.1);
    this.shell.add(base);
    // Fenster in der Rückwand (nicht dort, wo ein Durchgang ist)
    // (dieselbe Regel kennt die Raumlogik – dort hängt keine Wand-Deko)
    // Keller: kleine Fenster ganz oben (draußen ist dort der Boden)
    const cellar = layout.id === 'keller';
    const [fw, fh] = cellar ? [0.8, 0.36] : [1.1, 0.9];
    for (const x of backWindows(layout)) {
      const y = attic ? 0.95 : cellar ? 1.95 : 1.35;
      const frame = mesh(new THREE.BoxGeometry(fw, fh, 0.06), toon('#ffffff'));
      frame.position.set(x, y, 0.02);
      const glass = mesh(new THREE.BoxGeometry(fw - 0.15, fh - 0.15, 0.07), this.windowGlass, false, false);
      glass.position.set(x, y, 0.025);
      const bar = mesh(new THREE.BoxGeometry(0.04, fh - 0.15, 0.08), toon('#ffffff'));
      bar.position.set(x, y, 0.03);
      const sill = mesh(new THREE.BoxGeometry(fw + 0.1, 0.05, 0.16), toon('#cfa175'));
      sill.position.set(x, y - fh / 2 - 0.02, 0.08);
      this.shell.add(frame, glass, bar, sill);
      this.backDeco.push(frame, glass, bar, sill);
    }
    // Ausgänge
    for (const e of this.shellOptions.hideExits ? [] : layout.exits) {
      const xs = e.cells.map(([x]) => x);
      const x0 = Math.min(...xs);
      const width = Math.max(...xs) - x0 + 1;
      if (e.dir === 'down') {
        const mat = mesh(new THREE.BoxGeometry(width - 0.4, 0.02, 0.7), toon(e.kind === 'haustuer' ? '#d98a7a' : '#c8b6e8'), false, true);
        mat.position.set(x0 + width / 2, 0.01, H - 0.35);
        this.shell.add(mat);
        if (e.kind === 'treppe') {
          // Treppengeländer: hier geht es nach unten
          for (const sx of [x0 - 0.05, x0 + width + 0.05]) {
            const post = mesh(new THREE.BoxGeometry(0.06, 0.7, 0.06), toon('#a97c56'));
            post.position.set(sx, 0.35, H - 0.7);
            this.shell.add(post);
          }
        }
      } else if (e.kind === 'durchgang') {
        // Tür in der Rückwand
        const frame = mesh(new THREE.BoxGeometry(width + 0.2, 1.7, 0.1), toon('#a97c56'));
        frame.position.set(x0 + width / 2, 0.85, 0.01);
        const door = mesh(new THREE.BoxGeometry(width - 0.1, 1.55, 0.11), toon('#e6c59c'));
        door.position.set(x0 + width / 2, 0.78, 0.02);
        const knob = mesh(new THREE.SphereGeometry(0.05, 8, 6), toon('#c9a24a'));
        knob.position.set(x0 + width - 0.3, 0.8, 0.09);
        this.shell.add(frame, door, knob);
      } else {
        // Treppe nach oben an der Rückwand
        const stairs = new THREE.Group();
        for (let k = 0; k < 6; k++) {
          const step = mesh(new THREE.BoxGeometry(0.9, 0.12, 0.16), toon(k % 2 ? '#cfa175' : '#b98a5e'));
          step.position.set(0, 0.08 + k * 0.32, 0.85 - k * 0.15);
          stairs.add(step);
        }
        const rail = mesh(new THREE.BoxGeometry(0.05, 0.05, 1.4), toon('#8a6448'));
        rail.position.set(-0.45, 1.3, 0.45);
        rail.rotation.x = 1.0;
        stairs.add(rail);
        stairs.position.set(x0 + 0.5, 0, 0);
        this.shell.add(stairs);
      }
    }
    if (layout.desk) {
      const desk = makeCatalogDesk();
      desk.position.set(layout.desk[0] + 0.5, 0, layout.desk[1] + 0.5);
      this.shell.add(desk);
    }
    this.roomLight.position.set(W / 2, 2.2, H / 2 + 0.5);
  }

  /** Zellen-Mitte (Zimmerkoordinaten) → 3D-Weltposition */
  cellCenter(x: number, y: number): THREE.Vector3 {
    return new THREE.Vector3(this.origin.x + x + 0.5, 0, this.origin.z + y + 0.5);
  }

  refresh(home: Room, layout: RoomLayout, force = false) {
    const lk = JSON.stringify(layout) + JSON.stringify(this.shellOptions);
    if (lk !== this.layoutKey) {
      this.layoutKey = lk;
      this.layout = layout;
      this.buildShell(layout);
      force = true;
      this.floorMat.userData.surface = this.wallMat.userData.surface = '';
    }
    const sig = JSON.stringify(home) + [...this.lit].join() + '|' + this.collected.size;
    if (!force && sig === this.signature) return;
    this.signature = sig;
    this.applySurface(this.floorMat, home.floor, layout.w / 2, layout.h / 2);
    this.applySurface(this.wallMat, home.wallpaper, layout.w / 2, 1);
    // die Rückwand trägt dieselbe Tapete (eigenes Material, damit sie allein durchsichtig werden kann)
    this.backMat.map = this.wallMat.map;
    this.backMat.needsUpdate = true;
    this.furniture.clear();
    this.placed.clear();
    const byUid = new Map(home.items.map((i) => [i.uid, i]));
    for (const item of home.items) {
      const f = FURNITURE_BY_ITEM[item.itemId];
      if (!f) continue;
      const model = makeFurniture(item.itemId, undefined, this.collected);
      const { w, d } = footprint(f.def, item.rot);
      model.group.position.set(item.x + w / 2, 0, item.y + d / 2);
      model.group.rotation.y = -item.rot * (Math.PI / 2);
      const base = item.on ? byUid.get(item.on) : undefined;
      if (base) {
        model.group.position.y = FURNITURE_BY_ITEM[base.itemId]?.def.surfaceHeight ?? 0;
        const bi = furnitureInfo(base.itemId);
        if (bi) {
          // Tassen stehen dicht an dicht auf ihrem Platz, an Wandregalen nah an der Wand
          const off = riderOffset(bi, base.rot, item.slot ?? 0);
          model.group.position.x += off.dx;
          model.group.position.z += off.dz;
        }
      }
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

  /**
   * Nur der Raum, in dem Lina steht, bekommt echte Lichter (Raumlicht + Lampen). Die Zahl der sichtbaren Lichter
   * bleibt dadurch beim Raumwechsel gleich – kein Neu-Kompilieren der Shader, und es sind nie zu viele.
   */
  setLightsActive(on: boolean) {
    this.roomLight.visible = on;
    for (const l of this.lamps) l.visible = on;
  }

  /**
   * Rückwand durchsichtig machen (1 = voll sichtbar, 0 = weg): damit man in den Raum dahinter sieht – wie Häuser im
   * Dorf durchsichtig werden, wenn Lina dahinter steht. Fenster verschwinden ab etwa halb durchsichtig mit.
   */
  setBackFade(opacity: number) {
    this.backMat.opacity = opacity;
    this.backMat.depthWrite = opacity > 0.95;
    const show = opacity > 0.55;
    for (const o of this.backDeco) o.visible = show;
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
  isBlocked(home: Room, x: number, y: number): boolean {
    const L = this.layout;
    // hinter Türen/Treppen geht's hinaus
    for (const e of L.exits) if (e.cells.some(([cx]) => cx === x) && ((e.dir === 'down' && y === L.h) || (e.dir === 'up' && y === -1))) return false;
    if (x < 0 || y < 0 || x >= L.w || y >= L.h) return true;
    return blockedCells(home, L, furnitureInfo).has(`${x},${y}`);
  }

  /** Oberstes Möbel an einem Feld; zielt man auf eine Wand, zuerst die Wand-Deko dort */
  topAt(home: Room, x: number, y: number, wallRot: Rotation | null = null): PlacedItem | null {
    const all = itemsAt(home, x, y, furnitureInfo);
    if (wallRot !== null) {
      const onWall = all.find((i) => furnitureInfo(i.itemId)?.wall && i.rot === wallRot);
      if (onWall) return onWall;
    }
    return all.find((i) => !furnitureInfo(i.itemId)?.wall) ?? all[0] ?? null;
  }

  /** Treffer auf einer Wand → Feld davor + passende Drehung für Wand-Deko */
  wallCell(p: THREE.Vector3, side: string, layout: RoomLayout): { x: number; y: number; rot: Rotation } {
    const lx = p.x - this.origin.x;
    const lz = p.z - this.origin.z;
    const clampX = (v: number) => Math.max(0, Math.min(layout.w - 1, Math.floor(v)));
    const clampY = (v: number) => Math.max(0, Math.min(layout.h - 1, Math.floor(v)));
    if (side === 'left') return { x: 0, y: clampY(lz), rot: 3 };
    if (side === 'right') return { x: layout.w - 1, y: clampY(lz), rot: 1 };
    return { x: clampX(lx), y: 0, rot: 0 };
  }

  model(uid: string): FurnitureModel | null {
    return this.placed.get(uid)?.model ?? null;
  }

  /** Mauszeiger über dem Boden → Zelle */
  cellFromPoint(p: THREE.Vector3): { x: number; y: number } {
    return { x: Math.floor(p.x - this.origin.x), y: Math.floor(p.z - this.origin.z) };
  }

  // -------------------------------------------------------------------------
  // Vorschau beim Einrichten
  // -------------------------------------------------------------------------

  showGhost(itemId: string, x: number, y: number, rot: Rotation, valid: boolean, onHeight = 0, onOffset = { dx: 0, dz: 0 }) {
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
    this.ghost.position.set(x + w / 2 + onOffset.dx, onHeight, y + d / 2 + onOffset.dz);
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
