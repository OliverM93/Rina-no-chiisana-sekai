/**
 * Sammelbares in der Welt: Gegenstände am Boden (heruntergefallenes Obst,
 * Muscheln am Strand), Obst an den Bäumen und Blumen zum Pflücken.
 */
import type Phaser from 'phaser';
import { DEPTH, RES, TILE } from '../../config';
import { fruitOfTree, treeHasFruit } from '../../core/daily';
import type { Tile } from '../../core/grid';
import type { GroundItem } from '../../core/save';
import { type MapObject, tileOf } from '../../core/worldmap';
import { TREE_FRUITS } from '../../data/items';
import { dayRandom, giveItem, markPicked, todaysBeachFinds } from '../gameplay';
import type { Session } from '../session';
import type { MapView } from './MapView';

interface Pickup {
  id: string;
  itemId: string;
  x: number;
  y: number;
  /** tägliche Funde (Strand) vs. dauerhaft liegende Dinge */
  daily: boolean;
  sprite: Phaser.GameObjects.Image;
  shadow: Phaser.GameObjects.Image;
}

/** Stellen in der Baumkrone, an denen Früchte hängen (relativ zum Stamm-Fuß) */
const FRUIT_SPOTS = [
  { x: -26, y: -118 },
  { x: 22, y: -104 },
  { x: -4, y: -140 },
];

export class Collectibles {
  private pickups = new Map<string, Pickup>();
  private fruitSprites = new Map<string, Phaser.GameObjects.Image[]>();
  private trees: MapObject[];
  private day = '';

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly session: Session,
    private readonly view: MapView,
  ) {
    this.trees = session.map.objects.filter((o) => o.kind === 'tree');
  }

  /** Alles für den aktuellen Tag neu aufbauen (Start & Tageswechsel). */
  refresh() {
    const data = this.session.data;
    if (!data) return;
    this.day = this.session.today();
    for (const p of this.pickups.values()) this.destroyPickup(p);
    this.pickups.clear();
    for (const g of data.world.ground) this.addPickup(g.id, g.itemId, g.x, g.y, false);
    for (const s of todaysBeachFinds(this.session)) {
      this.addPickup(s.id, s.itemId, (s.x + 0.5) * TILE, (s.y + 0.55) * TILE, true);
    }
    this.refreshFruit();
    this.refreshFlowers();
  }

  /** Prüft auf Tageswechsel (z. B. um Mitternacht). */
  checkDay(): boolean {
    if (this.session.today() !== this.day) {
      this.refresh();
      return true;
    }
    return false;
  }

  // -------------------------------------------------------------------------
  // Boden
  // -------------------------------------------------------------------------

  private addPickup(id: string, itemId: string, x: number, y: number, daily: boolean) {
    const shadow = this.scene.add.image(x, y + 7, 'char-shadow').setScale(0.55 / RES).setDepth(DEPTH.decor + 70).setAlpha(0.8);
    const sprite = this.scene.add.image(x, y, `item-${itemId}`).setScale(0.85 / RES).setDepth(y - 6);
    this.pickups.set(id, { id, itemId, x, y, daily, sprite, shadow });
    return sprite;
  }

  private destroyPickup(p: Pickup) {
    p.sprite.destroy();
    p.shadow.destroy();
  }

  /** Gegenstand zum Aufheben auf/vor einer Kachel */
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

  /** Gegenstand an einer Weltposition (für Antippen) */
  pickupAt(wx: number, wy: number): Pickup | null {
    for (const p of this.pickups.values()) {
      if (Math.hypot(p.x - wx, p.y - wy) < 26) return p;
    }
    return null;
  }

  pickupTile(id: string): Tile | null {
    const p = this.pickups.get(id);
    return p ? tileOf(p.x, p.y) : null;
  }

  pickupPosition(id: string): { x: number; y: number } | null {
    const p = this.pickups.get(id);
    return p ? { x: p.x, y: p.y } : null;
  }

  /** Aufheben → Tasche. Gibt false zurück, wenn die Tasche voll ist. */
  pickUp(id: string, towards: { x: number; y: number }): boolean {
    const p = this.pickups.get(id);
    const data = this.session.data;
    if (!p || !data) return false;
    if (giveItem(this.session, p.itemId, 1) > 0) return false;
    this.pickups.delete(id);
    if (p.daily) markPicked(this.session, id);
    else data.world.ground = data.world.ground.filter((g) => g.id !== id);
    // kleiner Hüpfer zu Lina
    p.shadow.destroy();
    this.scene.tweens.add({
      targets: p.sprite,
      x: towards.x,
      y: towards.y - 60,
      scale: 0.4 / RES,
      alpha: 0,
      duration: 260,
      ease: 'Sine.easeIn',
      onComplete: () => p.sprite.destroy(),
    });
    return true;
  }

  /** Legt etwas auf den Boden (z. B. heruntergefallenes Obst) – bleibt gespeichert. */
  drop(itemId: string, from: { x: number; y: number }, to: { x: number; y: number }) {
    const data = this.session.data;
    if (!data) return;
    const id = `boden-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
    const g: GroundItem = { id, itemId, x: Math.round(to.x), y: Math.round(to.y) };
    data.world.ground.push(g);
    const sprite = this.addPickup(id, itemId, g.x, g.y, false);
    sprite.setPosition(from.x, from.y);
    this.scene.tweens.add({ targets: sprite, x: g.x, y: g.y, duration: 420, ease: 'Bounce.easeOut' });
  }

  // -------------------------------------------------------------------------
  // Obstbäume
  // -------------------------------------------------------------------------

  fruitOf(tree: MapObject): string | null {
    return fruitOfTree(tree.x, tree.y, TREE_FRUITS);
  }

  private refreshFruit() {
    for (const list of this.fruitSprites.values()) list.forEach((s) => s.destroy());
    this.fruitSprites.clear();
    const data = this.session.data;
    if (!data) return;
    for (const tree of this.trees) {
      const fruit = this.fruitOf(tree);
      if (!fruit || !treeHasFruit(data.world.fruitHarvest[tree.id], this.day)) continue;
      const sprite = this.view.objectSprites.get(tree.id);
      if (!sprite) continue;
      const flip = sprite.flipX ? -1 : 1;
      const list = FRUIT_SPOTS.map((s) =>
        this.scene.add
          .image(sprite.x + s.x * flip, sprite.y + s.y, `item-${fruit}`)
          .setScale(0.82 / RES)
          .setDepth(sprite.depth + 0.5),
      );
      this.fruitSprites.set(tree.id, list);
    }
  }

  /** Baum schütteln: Obst (und manchmal ein Ast) fällt herunter. Gibt eine Meldung zurück. */
  shakeTree(tree: MapObject, lina: Tile): string | null {
    const data = this.session.data;
    const sprite = this.view.objectSprites.get(tree.id);
    if (!data || !sprite) return null;
    const baseX = sprite.x;
    this.scene.tweens.add({
      targets: sprite,
      x: { from: baseX - 3, to: baseX + 3 },
      duration: 70,
      yoyo: true,
      repeat: 3,
      onComplete: () => sprite.setX(baseX),
    });
    const fruits = this.fruitSprites.get(tree.id) ?? [];
    for (const f of fruits) {
      const fx = f.x;
      this.scene.tweens.add({ targets: f, x: { from: fx - 3, to: fx + 3 }, duration: 70, yoyo: true, repeat: 3 });
    }

    const spots = this.dropSpots(tree, lina);
    let dropped = 0;
    if (fruits.length > 0) {
      data.world.fruitHarvest[tree.id] = this.day;
      const fruit = this.fruitOf(tree) as string;
      this.fruitSprites.delete(tree.id);
      fruits.forEach((f, i) => {
        const to = spots[i % spots.length];
        this.scene.time.delayedCall(260 + i * 90, () => {
          f.destroy();
          this.drop(fruit, { x: f.x, y: f.y }, to);
        });
      });
      dropped += fruits.length;
    }
    if (data.world.branchDay[tree.id] !== this.day && dayRandom(this.session, `ast:${tree.id}`)() < 0.35) {
      data.world.branchDay[tree.id] = this.day;
      const to = spots[(fruits.length + 1) % spots.length];
      this.scene.time.delayedCall(380, () => this.drop('ast', { x: to.x, y: to.y - 90 }, to));
      dropped += 1;
    }
    this.session.changed();
    return dropped > 0 ? null : 'Die Blätter rascheln. Heute fällt nichts herunter.';
  }

  /** Freie Stellen rund um den Baum, bevorzugt in Linas Nähe */
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
    for (const [idx, list] of this.view.flowerSprites) {
      const picked = data.world.flowerDay[String(idx)] === this.day;
      list.forEach((s) => s.setVisible(!picked));
    }
  }

  /** Steht Lina auf Blumen, die man heute noch pflücken kann? */
  canPickFlowers(tile: Tile): boolean {
    const data = this.session.data;
    if (!data) return false;
    const idx = tile.y * this.session.map.width + tile.x;
    return this.view.flowerSprites.has(idx) && data.world.flowerDay[String(idx)] !== this.day;
  }

  pickFlowers(tile: Tile): boolean {
    const data = this.session.data;
    if (!data || !this.canPickFlowers(tile)) return false;
    if (giveItem(this.session, 'wildblumen', 1) > 0) return false;
    const idx = tile.y * this.session.map.width + tile.x;
    data.world.flowerDay[String(idx)] = this.day;
    for (const s of this.view.flowerSprites.get(idx) ?? []) {
      const y = s.y;
      this.scene.tweens.add({ targets: s, alpha: 0, y: y - 8, duration: 220, onComplete: () => s.setVisible(false).setAlpha(1).setY(y) });
    }
    return true;
  }
}
