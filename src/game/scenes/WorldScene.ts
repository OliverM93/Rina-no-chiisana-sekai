/**
 * Die Dorfwelt: Karte, Lina, Kamera, Interaktionen, Tag & Nacht.
 *
 * Zwei Modi:
 *  - „title“: Die Kamera schwebt langsam über das Dorf (Titelbildschirm).
 *  - „play“:  Lina ist da und lässt sich steuern.
 */
import Phaser from 'phaser';
import { cssTileSize, DEPTH, DPR, RES, TILE } from '../../config';
import { findPath, nearestWalkable, type Tile } from '../../core/grid';
import {
  findInteraction,
  OBJECT_KINDS,
  objectById,
  tileOf,
  type MapObject,
} from '../../core/worldmap';
import { fillPlaceholders, INTERACTIONS } from '../../data/interactions';
import { INTRO_LINES } from '../../data/story';
import { KeyboardInput } from '../input';
import type { Session } from '../session';
import { Ambient } from '../world/Ambient';
import { DayNight } from '../world/DayNight';
import { buildMapView, type MapView } from '../world/MapView';
import { FEET_OFFSET, Player } from '../world/Player';

const INTERACTIVE = new Set(Object.keys(INTERACTIONS));

export class WorldScene extends Phaser.Scene {
  private session!: Session;
  private view!: MapView;
  private player: Player | null = null;
  private dayNight!: DayNight;
  private ambient!: Ambient;
  private keys!: KeyboardInput;
  private marker!: Phaser.GameObjects.Image;
  private bubble!: Phaser.GameObjects.Image;
  private bubbleTarget: string | null = null;
  private titleTween: Phaser.Tweens.Tween | null = null;
  private camTarget!: Phaser.GameObjects.Zone;
  private unsubscribers: Array<() => void> = [];
  /**
   * Startpunkt je Finger/Maus – um Tippen von Wischen zu unterscheiden.
   * Schlüssel ist die native Touch-Kennung: Phaser vergibt für „runter“ und
   * „hoch“ desselben Fingers manchmal verschiedene Pointer-IDs.
   */
  private pointerDown = new Map<number, { x: number; y: number }>();

  constructor() {
    super('world');
  }

  create() {
    this.session = this.registry.get('session') as Session;
    const map = this.session.map;
    const worldW = map.width * TILE;
    const worldH = map.height * TILE;

    this.view = buildMapView(this, map, this.session.season);
    this.dayNight = new DayNight(this, this.session.clock, worldW, worldH, this.view.lights);

    const cam = this.cameras.main;
    cam.setBounds(0, 0, worldW, worldH);
    cam.setBackgroundColor('#86cfe6');
    this.updateZoom();
    this.scale.on('resize', this.onResize, this);

    this.ambient = new Ambient(this, this.session.season, this.view.waterTiles, worldW, worldH);

    this.marker = this.add.image(0, 0, 'marker').setScale(1 / RES).setDepth(DEPTH.marker).setVisible(false);
    this.bubble = this.add.image(0, 0, 'bubble').setScale(1 / RES).setDepth(DEPTH.marker).setVisible(false);
    this.tweens.add({ targets: this.bubble, y: '-=5', duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.camTarget = this.add.zone(0, 0, 1, 1);

    this.keys = new KeyboardInput();
    this.unsubscribers.push(this.keys.onAction(() => this.tryInteract()));
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.pointerDown.set(p.identifier, { x: p.x, y: p.y }));
    this.input.on('pointerup', this.onPointer, this);

    this.unsubscribers.push(
      this.session.bus.on('game:started', () => this.startPlay()),
      this.session.bus.on('appearance:changed', (a) => this.player?.setAppearance(a)),
    );
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.cleanup());

    this.startTitlePan();
    if (this.session.playing) this.startPlay();
    this.session.markWorldReady();
  }

  // -------------------------------------------------------------------------
  // Kamera
  // -------------------------------------------------------------------------

  private onResize(gameSize: Phaser.Structs.Size) {
    this.cameras.main.setSize(gameSize.width, gameSize.height);
    this.updateZoom();
  }

  private updateZoom() {
    const cssW = this.scale.width / DPR;
    const cssH = this.scale.height / DPR;
    const zoom = (cssTileSize(cssW, cssH) * DPR) / TILE;
    // Nie so weit herauszoomen, dass man über den Kartenrand hinaus sieht
    const map = this.session.map;
    const minZoom = Math.max(this.scale.width / (map.width * TILE), this.scale.height / (map.height * TILE));
    this.cameras.main.setZoom(Math.max(zoom, minZoom));
  }

  private startTitlePan() {
    const cam = this.cameras.main;
    const plaza = { x: 27.5 * TILE, y: 19 * TILE };
    cam.centerOn(plaza.x - 6 * TILE, plaza.y);
    this.titleTween = this.tweens.add({
      targets: cam,
      scrollX: cam.scrollX + 12 * TILE,
      scrollY: cam.scrollY + 3 * TILE,
      duration: 40000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private startPlay() {
    const data = this.session.data;
    if (!data) return;
    this.player?.destroy();
    const p = data.player;
    this.player = new Player(this, 'lina', p.appearance, p.x, p.y, p.facing);

    this.titleTween?.stop();
    this.titleTween = null;
    const cam = this.cameras.main;
    this.camTarget.setPosition(p.x, p.y - 28);
    cam.pan(p.x, p.y - 28, 900, 'Sine.easeInOut', false, (_c: Phaser.Cameras.Scene2D.Camera, progress: number) => {
      if (progress >= 1) cam.startFollow(this.camTarget, true, 0.12, 0.12);
    });

    if (!data.flags.introSeen) {
      // Echte Zeit statt Spielzeit: erscheint zuverlässig auch auf langsamen Geräten
      window.setTimeout(() => {
        if (this.session.data !== data) return;
        const ctx = this.session.interactionContext();
        this.session.bus.emit('dialog:open', {
          lines: INTRO_LINES.map((l) => fillPlaceholders(l, ctx)),
          onClose: () => {
            this.session.setFlag('introSeen');
            this.session.save();
          },
        });
      }, 1100);
    }
  }

  // -------------------------------------------------------------------------
  // Spielschleife
  // -------------------------------------------------------------------------

  override update(_time: number, delta: number) {
    this.dayNight.update(delta);
    this.ambient.update(delta, this.dayNight.night);

    const player = this.player;
    const data = this.session.data;
    if (!player || !data) return;

    const blocked = this.session.uiBlocking;
    const intent = blocked ? { dx: 0, dy: 0, run: false } : this.keys.direction();
    if (blocked && player.hasPath) player.cancelPath();
    const grid = this.session.map.grid;
    player.update(delta, intent, (tx, ty) => grid.isBlocked(tx, ty));

    data.player.x = Math.round(player.x * 10) / 10;
    data.player.y = Math.round(player.y * 10) / 10;
    data.player.facing = player.facing;

    this.camTarget.setPosition(player.x, player.y - 28);
    if (!player.hasPath && this.marker.visible) this.marker.setVisible(false);

    this.updateOccluders(player);
    this.updateBubble(player, blocked);
  }

  /** Bäume & Häuser werden durchsichtig, wenn Lina dahinter steht. */
  private updateOccluders(player: Player) {
    const px = player.x;
    const py = player.y - 20;
    for (const o of this.view.occluders) {
      const behind = player.y < o.baseY && o.area.contains(px, py);
      const target = behind ? 0.5 : 1;
      const a = o.sprite.alpha;
      if (Math.abs(a - target) > 0.01) o.sprite.setAlpha(a + (target - a) * 0.15);
    }
  }

  private updateBubble(player: Player, blocked: boolean) {
    const id = blocked ? null : findInteraction(this.session.map, player.tile, player.facing, INTERACTIVE);
    if (id === this.bubbleTarget) return;
    this.bubbleTarget = id;
    if (!id) {
      this.bubble.setVisible(false);
      return;
    }
    const pos = this.bubblePosition(id);
    this.tweens.killTweensOf(this.bubble);
    this.bubble.setPosition(pos.x, pos.y).setVisible(true).setAlpha(0);
    this.tweens.add({ targets: this.bubble, alpha: 1, duration: 150 });
    this.tweens.add({ targets: this.bubble, y: pos.y - 5, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private bubblePosition(id: string): { x: number; y: number } {
    const obj = objectById(this.session.map, id) as MapObject;
    const cx = (obj.x + obj.w / 2) * TILE;
    if (obj.kind === 'house') return { x: cx, y: (obj.y + obj.h) * TILE - 112 };
    if (obj.kind === 'plot') return { x: (obj.x + 2.5) * TILE, y: (obj.y + 3) * TILE - 96 };
    const sprite = this.view.objectSprites.get(id);
    if (sprite) {
      const b = sprite.getBounds();
      return { x: cx, y: b.y - 6 };
    }
    return { x: cx, y: obj.y * TILE - 10 };
  }

  // -------------------------------------------------------------------------
  // Interaktion
  // -------------------------------------------------------------------------

  private tryInteract() {
    const player = this.player;
    if (!player || this.session.uiBlocking) return;
    const id = findInteraction(this.session.map, player.tile, player.facing, INTERACTIVE);
    if (id) this.openInteraction(id);
  }

  private openInteraction(id: string) {
    const interaction = INTERACTIONS[id];
    if (!interaction) return;
    const ctx = this.session.interactionContext();
    this.session.bus.emit('dialog:open', {
      title: interaction.title,
      lines: interaction.lines(ctx).map((l) => fillPlaceholders(l, ctx)),
    });
  }

  private onPointer(pointer: Phaser.Input.Pointer) {
    const down = this.pointerDown.get(pointer.identifier);
    this.pointerDown.delete(pointer.identifier);
    const player = this.player;
    if (!player || !down || !this.session.acceptsPointer()) return;
    // Nur echte Klicks/Taps, kein Ziehen
    if (Math.hypot(pointer.x - down.x, pointer.y - down.y) > 14 * DPR) return;

    const wx = pointer.worldX;
    const wy = pointer.worldY;
    const map = this.session.map;

    // 1) Auf ein interaktives Objekt getippt?
    const hit = this.hitInteractive(wx, wy);
    if (hit) {
      this.walkToObject(hit);
      return;
    }

    // 2) Sonst einfach dorthin laufen
    const target = nearestWalkable(map.grid, tileOf(wx, wy), player.tile);
    if (!target) return;
    const path = findPath(map.grid, player.tile, target);
    if (!path) return;
    this.marker.setPosition((target.x + 0.5) * TILE, (target.y + 0.5) * TILE + FEET_OFFSET).setVisible(true).setAlpha(1);
    this.tweens.killTweensOf(this.marker);
    this.marker.setScale(1.4 / RES);
    this.tweens.add({ targets: this.marker, scale: 1 / RES, duration: 220, ease: 'Back.easeOut' });
    player.followPath(path);
  }

  private hitInteractive(wx: number, wy: number): MapObject | null {
    const map = this.session.map;
    let best: MapObject | null = null;
    let bestDepth = -Infinity;
    for (const id of INTERACTIVE) {
      const obj = objectById(map, id);
      if (!obj) continue;
      const sprite = this.view.objectSprites.get(id);
      const footprint = new Phaser.Geom.Rectangle(obj.x * TILE, obj.y * TILE, obj.w * TILE, obj.h * TILE);
      const inside = footprint.contains(wx, wy) || (sprite?.getBounds().contains(wx, wy) ?? false);
      if (inside && (sprite?.depth ?? 0) > bestDepth) {
        best = obj;
        bestDepth = sprite?.depth ?? 0;
      }
    }
    return best;
  }

  private walkToObject(obj: MapObject) {
    const player = this.player;
    if (!player) return;
    const map = this.session.map;
    const spots = (OBJECT_KINDS[obj.kind].interactFrom ?? []).map(([dx, dy]) => ({ x: obj.x + dx, y: obj.y + dy }));
    let bestPath: Tile[] | null = null;
    for (const s of spots) {
      if (map.grid.isBlocked(s.x, s.y)) continue;
      const path = findPath(map.grid, player.tile, s);
      if (path && (!bestPath || path.length < bestPath.length)) bestPath = path;
    }
    if (!bestPath) return;
    this.marker.setVisible(false);
    player.followPath(bestPath, () => {
      // Zum Objekt drehen und ansehen
      const cx = obj.x + obj.w / 2 - 0.5;
      const cy = obj.y + obj.h / 2 - 0.5;
      const t = player.tile;
      const dx = cx - t.x;
      const dy = cy - t.y;
      player.face(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
      const id = findInteraction(map, t, player.facing, INTERACTIVE);
      this.openInteraction(id ?? obj.id);
    });
  }

  private cleanup() {
    this.keys.destroy();
    for (const u of this.unsubscribers) u();
    this.unsubscribers = [];
    this.scale.off('resize', this.onResize, this);
  }
}
