/**
 * Sammelbares in 3D: Gegenstände am Boden (als schwebende Symbole wie in
 * klassischen Spielen), Obst an den Bäumen, Blumen zum Pflücken.
 */
import * as THREE from 'three';
import { TILE, UNIT } from '../config';
import { fruitOfTree, treeHasFruit } from '../core/daily';
import type { Tile } from '../core/grid';
import type { GroundItem } from '../core/save';
import { type MapObject, tileOf } from '../core/worldmap';
import { TREE_FRUITS } from '../data/items';
import { dayRandom, giveItem, markPicked, todaysBeachFinds } from '../game/gameplay';
import { todaysEasterEggs } from '../game/festivals';
import type { Session } from '../game/session';
import { itemIconUrl } from '../gfx/items';
import type { Tweens } from './tweens';
import type { MapView3D } from './MapView3D';
import { mesh, toon } from './materials';

interface Pickup {
  id: string;
  itemId: string;
  x: number;
  y: number;
  daily: boolean;
  sprite: THREE.Sprite;
  shadow: THREE.Mesh;
}

const FRUIT_COLOR: Record<string, string> = { apfel: '#f2787f', birne: '#d8e07a', pfirsich: '#ffb38f' };
const fruitGeo = new THREE.SphereGeometry(1, 12, 10);
const shadowGeo = new THREE.CircleGeometry(1, 16).rotateX(-Math.PI / 2);
const shadowMat = new THREE.MeshBasicMaterial({ color: '#3c2a40', transparent: true, opacity: 0.18, depthWrite: false });

const textureCache = new Map<string, THREE.Texture>();
function iconTexture(itemId: string): THREE.Texture {
  let t = textureCache.get(itemId);
  if (!t) {
    t = new THREE.TextureLoader().load(itemIconUrl(itemId, 128));
    t.colorSpace = THREE.SRGBColorSpace;
    textureCache.set(itemId, t);
  }
  return t;
}

export class Collectibles {
  private pickups = new Map<string, Pickup>();
  private fruit = new Map<string, THREE.Mesh[]>();
  private trees: MapObject[];
  private day = '';
  private time = 0;

  constructor(
    private readonly scene: THREE.Scene,
    private readonly session: Session,
    private readonly view: MapView3D,
    private readonly tweens: Tweens,
  ) {
    this.trees = session.map.objects.filter((o) => o.kind === 'tree');
  }

  refresh() {
    const data = this.session.data;
    if (!data) return;
    this.day = this.session.today();
    for (const p of this.pickups.values()) this.destroyPickup(p);
    this.pickups.clear();
    for (const g of data.world.ground) this.addPickup(g.id, g.itemId, g.x, g.y, false);
    for (const s of [...todaysBeachFinds(this.session), ...todaysEasterEggs(this.session)]) this.addPickup(s.id, s.itemId, (s.x + 0.5) * TILE, (s.y + 0.55) * TILE, true);
    this.refreshFruit();
    this.refreshFlowers();
  }

  checkDay(): boolean {
    if (this.session.today() !== this.day) {
      this.refresh();
      return true;
    }
    return false;
  }

  /** Sanftes Schweben der Gegenstände */
  update(dt: number) {
    this.time += dt;
    for (const p of this.pickups.values()) {
      p.sprite.position.y = 0.28 + Math.sin(this.time * 2.2 + p.x * 0.05) * 0.04;
    }
  }

  // -------------------------------------------------------------------------
  // Boden
  // -------------------------------------------------------------------------

  private addPickup(id: string, itemId: string, x: number, y: number, daily: boolean): Pickup {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: iconTexture(itemId), transparent: true }));
    sprite.scale.setScalar(0.42);
    sprite.position.set(x * UNIT, 0.28, y * UNIT);
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.scale.setScalar(0.16);
    shadow.position.set(x * UNIT, 0.01, y * UNIT);
    this.scene.add(sprite, shadow);
    const p = { id, itemId, x, y, daily, sprite, shadow };
    this.pickups.set(id, p);
    return p;
  }

  private destroyPickup(p: Pickup) {
    p.sprite.removeFromParent();
    p.sprite.material.dispose();
    p.shadow.removeFromParent();
  }

  pickupNear(standing: Tile, facing: 'down' | 'up' | 'left' | 'right', px: number, py: number): string | null {
    let best: Pickup | null = null;
    let bestD = Infinity;
    const dir = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] }[facing];
    for (const p of this.pickups.values()) {
      const t = tileOf(p.x, p.y);
      const onTile = t.x === standing.x && t.y === standing.y;
      const inFront = t.x === standing.x + dir[0] && t.y === standing.y + dir[1];
      if (!onTile && !inFront) continue;
      const d = Math.hypot(p.x - px, p.y - py);
      if (d < bestD) {
        best = p;
        bestD = d;
      }
    }
    return best?.id ?? null;
  }

  /** Gegenstand an einer Weltposition (Welteinheiten) – für Mausklicks */
  pickupAt(wx: number, wy: number): Pickup | null {
    for (const p of this.pickups.values()) if (Math.hypot(p.x - wx, p.y - wy) < 30) return p;
    return null;
  }

  pickupPosition(id: string): { x: number; y: number } | null {
    const p = this.pickups.get(id);
    return p ? { x: p.x, y: p.y } : null;
  }

  pickUp(id: string, towards: { x: number; y: number }): boolean {
    const p = this.pickups.get(id);
    const data = this.session.data;
    if (!p || !data) return false;
    if (giveItem(this.session, p.itemId, 1) > 0) return false;
    this.pickups.delete(id);
    if (p.daily) markPicked(this.session, id);
    else data.world.ground = data.world.ground.filter((g) => g.id !== id);
    p.shadow.removeFromParent();
    const from = p.sprite.position.clone();
    const to = new THREE.Vector3(towards.x * UNIT, 1.1, towards.y * UNIT);
    this.tweens.add(260, (t) => {
      p.sprite.position.lerpVectors(from, to, t * t);
      p.sprite.scale.setScalar(0.42 * (1 - t * 0.6));
      p.sprite.material.opacity = 1 - t;
    }, () => this.destroyPickup(p));
    return true;
  }

  /** Etwas fällt auf den Boden (bleibt gespeichert). `from` in Kacheln (3D), `to` in Welteinheiten. */
  drop(itemId: string, from: THREE.Vector3, to: { x: number; y: number }) {
    const data = this.session.data;
    if (!data) return;
    const id = `boden-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
    const g: GroundItem = { id, itemId, x: Math.round(to.x), y: Math.round(to.y) };
    data.world.ground.push(g);
    const p = this.addPickup(id, itemId, g.x, g.y, false);
    const end = p.sprite.position.clone();
    p.sprite.position.copy(from);
    this.tweens.add(480, (t) => {
      // Fall mit kleinem Hüpfer
      const bounce = t < 0.75 ? 0 : Math.sin(((t - 0.75) / 0.25) * Math.PI) * 0.12;
      p.sprite.position.set(from.x + (end.x - from.x) * t, from.y + (end.y - from.y) * Math.min(1, (t / 0.75) ** 2) + bounce, from.z + (end.z - from.z) * t);
    });
  }

  // -------------------------------------------------------------------------
  // Obstbäume
  // -------------------------------------------------------------------------

  fruitOf(tree: MapObject): string | null {
    return fruitOfTree(tree.x, tree.y, TREE_FRUITS);
  }

  private refreshFruit() {
    for (const list of this.fruit.values()) list.forEach((m) => m.removeFromParent());
    this.fruit.clear();
    const data = this.session.data;
    if (!data) return;
    for (const tree of this.trees) {
      const kind = this.fruitOf(tree);
      const model = this.view.trees.get(tree.id);
      if (!kind || !model || !treeHasFruit(data.world.fruitHarvest[tree.id], this.day)) continue;
      const list = model.fruitSpots.map((spot) => {
        const m = mesh(fruitGeo, toon(FRUIT_COLOR[kind] ?? '#f2787f'), true, false);
        m.scale.set(0.11, kind === 'birne' ? 0.14 : 0.11, 0.11);
        m.position.copy(spot);
        model.group.add(m);
        return m;
      });
      this.fruit.set(tree.id, list);
    }
  }

  /** Baum schütteln: Obst (und manchmal ein Ast) fällt herunter. */
  shakeTree(tree: MapObject, lina: Tile): string | null {
    const data = this.session.data;
    const model = this.view.trees.get(tree.id);
    if (!data || !model) return null;
    const crown = model.crown;
    const base = crown.rotation.z;
    this.tweens.add(420, (t) => {
      crown.rotation.z = base + Math.sin(t * Math.PI * 6) * 0.06 * (1 - t);
    });

    const spots = this.dropSpots(tree, lina);
    let dropped = 0;
    const fruits = this.fruit.get(tree.id) ?? [];
    if (fruits.length > 0) {
      data.world.fruitHarvest[tree.id] = this.day;
      const kind = this.fruitOf(tree) as string;
      this.fruit.delete(tree.id);
      fruits.forEach((f, i) => {
        window.setTimeout(() => {
          const from = new THREE.Vector3();
          f.getWorldPosition(from);
          f.removeFromParent();
          this.drop(kind, from, spots[i % spots.length]);
        }, 250 + i * 110);
      });
      dropped += fruits.length;
    }
    if (data.world.branchDay[tree.id] !== this.day && dayRandom(this.session, `ast:${tree.id}`)() < 0.35) {
      data.world.branchDay[tree.id] = this.day;
      const to = spots[(fruits.length + 1) % spots.length];
      window.setTimeout(() => this.drop('ast', new THREE.Vector3(to.x * UNIT, 1.8, to.y * UNIT), to), 380);
      dropped += 1;
    }
    this.session.changed();
    return dropped > 0 ? null : 'Die Blätter rascheln. Heute fällt nichts herunter.';
  }

  private dropSpots(tree: MapObject, lina: Tile) {
    const grid = this.session.map.grid;
    const candidates = [
      [0, 1],
      [-1, 1],
      [1, 1],
      [-1, 0],
      [1, 0],
    ]
      .map(([dx, dy]) => ({ x: tree.x + dx, y: tree.y + dy }))
      .filter((t) => !grid.isBlocked(t.x, t.y) && !(t.x === lina.x && t.y === lina.y));
    if (candidates.length === 0) candidates.push({ x: lina.x, y: lina.y });
    return candidates.map((t, i) => ({ x: (t.x + 0.5) * TILE + (i % 2 ? 10 : -10), y: (t.y + 0.5) * TILE + 6 }));
  }

  // -------------------------------------------------------------------------
  // Blumen
  // -------------------------------------------------------------------------

  private refreshFlowers() {
    const data = this.session.data;
    if (!data) return;
    for (const [idx, list] of this.view.flowers) {
      const picked = data.world.flowerDay[String(idx)] === this.day;
      list.forEach((f) => {
        f.visible = !picked;
        f.scale.setScalar(1.4);
      });
    }
  }

  canPickFlowers(tile: Tile): boolean {
    const data = this.session.data;
    if (!data) return false;
    const idx = tile.y * this.session.map.width + tile.x;
    return this.view.flowers.has(idx) && data.world.flowerDay[String(idx)] !== this.day;
  }

  pickFlowers(tile: Tile): boolean {
    const data = this.session.data;
    if (!data || !this.canPickFlowers(tile)) return false;
    if (giveItem(this.session, 'wildblumen', 1) > 0) return false;
    const idx = tile.y * this.session.map.width + tile.x;
    data.world.flowerDay[String(idx)] = this.day;
    for (const f of this.view.flowers.get(idx) ?? []) {
      this.tweens.add(220, (t) => f.scale.setScalar(1.4 * (1 - t)), () => (f.visible = false));
    }
    return true;
  }
}
