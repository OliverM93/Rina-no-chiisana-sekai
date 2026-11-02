/**
 * Die Dorfwelt: Karte, Lina, Bewohner, Kamera, Interaktionen, Tag & Nacht.
 *
 * Zwei Modi:
 *  - „title“: Die Kamera schwebt langsam über das Dorf (Titelbildschirm).
 *  - „play“:  Lina ist da und lässt sich steuern.
 */
import Phaser from 'phaser';
import { cssTileSize, DEPTH, DPR, RES, TILE } from '../../config';
import { findPath, nearestWalkable, type Tile } from '../../core/grid';
import { findInteraction, type MapObject, OBJECT_KINDS, objectById, tileOf } from '../../core/worldmap';
import { itemCountLabel } from '../../data/items';
import { fillPlaceholders, INTERACTIONS } from '../../data/interactions';
import { NPCS } from '../../data/npcs';
import { GISELA_WELCOME, GISELA_WELCOME_2 } from '../../data/npcs/gisela';
import { INTRO_LINES } from '../../data/story';
import { itemIconUrl } from '../../gfx/items';
import {
  chatWithNpc,
  checkDailyMail,
  giftToNpc,
  giveItem,
  goodbyeLine,
  hasUnreadMail,
  knockRock,
  npcHearts,
  talkToNpc,
  welcomeLetter,
} from '../gameplay';
import { KeyboardInput } from '../input';
import type { Session } from '../session';
import { Ambient } from '../world/Ambient';
import { Character, FEET_OFFSET } from '../world/Character';
import { Collectibles } from '../world/Collectibles';
import { DayNight } from '../world/DayNight';
import { buildMapView, type MapView } from '../world/MapView';
import { Npc } from '../world/Npc';

type Target =
  | { kind: 'pickup'; id: string }
  | { kind: 'npc'; npc: Npc }
  | { kind: 'object'; id: string }
  | { kind: 'flowers'; tile: Tile };

/** Objekte mit eigener Logik (zusätzlich zu den Texten in INTERACTIONS) */
const SPECIAL_OBJECTS = ['verkaufskiste', 'haus-gisela', 'briefkasten-lina'];

const DIRS = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] } as const;

export class WorldScene extends Phaser.Scene {
  private session!: Session;
  private view!: MapView;
  private player: Character | null = null;
  private npcs = new Map<string, Npc>();
  private collectibles!: Collectibles;
  private dayNight!: DayNight;
  private ambient!: Ambient;
  private keys!: KeyboardInput;
  private marker!: Phaser.GameObjects.Image;
  private bubble!: Phaser.GameObjects.Image;
  private bubbleKey: string | null = null;
  private titleTween: Phaser.Tweens.Tween | null = null;
  private camTarget!: Phaser.GameObjects.Zone;
  private unsubscribers: Array<() => void> = [];
  private interactive = new Set<string>();
  /** läuft gerade eine kleine Story-Szene? Dann ist Lina nicht steuerbar. */
  private cutscene = false;
  private dayCheck = 0;
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
    this.collectibles = new Collectibles(this, this.session, this.view);

    for (const id of Object.keys(INTERACTIONS)) this.interactive.add(id);
    for (const id of SPECIAL_OBJECTS) this.interactive.add(id);
    for (const o of map.objects) if (o.kind === 'tree' || o.kind === 'rock') this.interactive.add(o.id);

    const cam = this.cameras.main;
    cam.setBounds(0, 0, worldW, worldH);
    cam.setBackgroundColor('#86cfe6');
    this.updateZoom();
    this.scale.on('resize', this.onResize, this);

    this.ambient = new Ambient(this, this.session.season, this.view.waterTiles, worldW, worldH);

    // Bewohner sind schon auf dem Titelbildschirm unterwegs
    for (const def of NPCS) this.npcs.set(def.id, new Npc(this, def, this.session));

    this.marker = this.add.image(0, 0, 'marker').setScale(1 / RES).setDepth(DEPTH.marker).setVisible(false);
    this.bubble = this.add.image(0, 0, 'bubble').setScale(1 / RES).setDepth(DEPTH.marker).setVisible(false);
    this.camTarget = this.add.zone(0, 0, 1, 1);

    this.keys = new KeyboardInput();
    this.unsubscribers.push(this.keys.onAction(() => this.tryInteract()));
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.pointerDown.set(p.identifier, { x: p.x, y: p.y }));
    this.input.on('pointerup', this.onPointer, this);

    this.unsubscribers.push(
      this.session.bus.on('game:started', () => this.startPlay()),
      this.session.bus.on('appearance:changed', (a) => this.player?.setAppearance(a)),
      this.session.bus.on('state:changed', () => this.updateMailbox()),
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
    this.player = new Character(this, 'lina', p.appearance, p.x, p.y, p.facing);

    this.titleTween?.stop();
    this.titleTween = null;
    const cam = this.cameras.main;
    this.camTarget.setPosition(p.x, p.y - 28);
    cam.pan(p.x, p.y - 28, 900, 'Sine.easeInOut', false, (_c: Phaser.Cameras.Scene2D.Camera, progress: number) => {
      if (progress >= 1) cam.startFollow(this.camTarget, true, 0.12, 0.12);
    });

    this.collectibles.refresh();
    checkDailyMail(this.session);
    this.updateMailbox();

    // Story: Ankunft, dann begrüßt Oma Gisela Lina
    // (Echte Zeit statt Spielzeit: erscheint zuverlässig auch auf langsamen Geräten)
    if (!data.flags.introSeen) {
      window.setTimeout(() => {
        if (this.session.data !== data) return;
        const ctx = this.session.interactionContext();
        this.session.bus.emit('dialog:open', {
          lines: INTRO_LINES.map((l) => fillPlaceholders(l, ctx)),
          onClose: () => {
            this.session.setFlag('introSeen');
            this.session.save();
            window.setTimeout(() => this.welcomeScene(), 500);
          },
        });
      }, 1100);
    } else if (!data.flags.giselaWelcomed) {
      window.setTimeout(() => this.welcomeScene(), 1300);
    }
  }

  /** Oma Gisela kommt angelaufen, begrüßt Lina und schenkt ihr einen Keks. */
  private welcomeScene() {
    const player = this.player;
    const gisela = this.npcs.get('gisela');
    const data = this.session.data;
    if (!player || !gisela || !data || data.flags.giselaWelcomed) return;
    this.cutscene = true;
    player.cancelPath();
    const grid = this.session.map.grid;
    const lt = player.tile;
    const start = nearestWalkable(grid, { x: lt.x + 5, y: lt.y + 3 }, lt) ?? lt;
    const meet = nearestWalkable(grid, { x: lt.x + 1, y: lt.y }, lt) ?? lt;
    gisela.scriptPlace(start);
    let arrived = false;
    const onArrive = () => {
      if (arrived) return;
      arrived = true;
      gisela.char.faceTowards(player.x, player.y);
      player.faceTowards(gisela.x, gisela.y);
      const title = gisela.def.name;
      this.session.bus.emit('dialog:open', {
        title,
        lines: [...GISELA_WELCOME],
        onClose: () => {
          giveItem(this.session, 'keks', 1);
          this.session.bus.emit('dialog:open', {
            title,
            lines: GISELA_WELCOME_2.map((l) => fillPlaceholders(l, this.session.interactionContext())),
            onClose: () => {
              this.session.setFlag('giselaWelcomed');
              welcomeLetter(this.session);
              this.session.save();
              gisela.scriptDone();
              this.cutscene = false;
            },
          });
        },
      });
    };
    gisela.scriptWalkTo(meet, onArrive);
    // Sicherheitsnetz: Falls der Weg zu lange dauert, steht sie einfach da.
    window.setTimeout(() => {
      if (arrived) return;
      gisela.scriptPlace(meet);
      onArrive();
    }, 12000);
  }

  // -------------------------------------------------------------------------
  // Spielschleife
  // -------------------------------------------------------------------------

  override update(_time: number, delta: number) {
    this.dayNight.update(delta);
    this.ambient.update(delta, this.dayNight.night);
    for (const npc of this.npcs.values()) npc.update(delta);

    const player = this.player;
    const data = this.session.data;
    if (!player || !data) return;

    this.dayCheck += delta;
    if (this.dayCheck > 3000) {
      this.dayCheck = 0;
      if (this.collectibles.checkDay()) checkDailyMail(this.session);
    }

    const blocked = this.session.uiBlocking || this.cutscene;
    const intent = blocked ? { dx: 0, dy: 0, run: false } : this.keys.direction();
    if (blocked && player.hasPath && !this.cutscene) player.cancelPath();
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
  private updateOccluders(player: Character) {
    const px = player.x;
    const py = player.y - 20;
    for (const o of this.view.occluders) {
      const behind = player.y < o.baseY && o.area.contains(px, py);
      const target = behind ? 0.5 : 1;
      const a = o.sprite.alpha;
      if (Math.abs(a - target) > 0.01) o.sprite.setAlpha(a + (target - a) * 0.15);
    }
  }

  private updateBubble(player: Character, blocked: boolean) {
    const target = blocked ? null : this.resolveTarget(player);
    let key: string | null = null;
    let pos: { x: number; y: number } | null = null;
    if (target?.kind === 'npc') {
      key = `npc:${target.npc.def.id}`;
      pos = { x: target.npc.x, y: target.npc.headY };
    } else if (target?.kind === 'object') {
      const obj = objectById(this.session.map, target.id);
      // Bäume & Felsen bekommen keine Sprechblase – das wäre zu unruhig
      if (obj && obj.kind !== 'tree' && obj.kind !== 'rock') {
        key = `obj:${target.id}`;
        pos = this.bubblePosition(obj);
      }
    }
    // Sitzende/laufende Bewohner bewegen sich → Blase mitführen
    if (key && key === this.bubbleKey && pos && target?.kind === 'npc') {
      this.bubble.setX(pos.x);
      return;
    }
    if (key === this.bubbleKey) return;
    this.bubbleKey = key;
    this.tweens.killTweensOf(this.bubble);
    if (!key || !pos) {
      this.bubble.setVisible(false);
      return;
    }
    this.bubble.setPosition(pos.x, pos.y).setVisible(true).setAlpha(0);
    this.tweens.add({ targets: this.bubble, alpha: 1, duration: 150 });
    this.tweens.add({ targets: this.bubble, y: pos.y - 5, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private bubblePosition(obj: MapObject): { x: number; y: number } {
    const cx = (obj.x + obj.w / 2) * TILE;
    if (obj.kind === 'house') return { x: cx, y: (obj.y + obj.h) * TILE - 112 };
    if (obj.kind === 'plot') return { x: (obj.x + 2.5) * TILE, y: (obj.y + 3) * TILE - 96 };
    const sprite = this.view.objectSprites.get(obj.id);
    if (sprite) return { x: cx, y: sprite.getBounds().y - 6 };
    return { x: cx, y: obj.y * TILE - 10 };
  }

  private updateMailbox() {
    const sprite = this.view.objectSprites.get('briefkasten-lina');
    if (!sprite) return;
    const key = hasUnreadMail(this.session) ? 'mailbox-full' : 'mailbox';
    if (sprite.texture.key !== key) sprite.setTexture(key);
  }

  // -------------------------------------------------------------------------
  // Interaktion
  // -------------------------------------------------------------------------

  /** Was würde Lina jetzt anfassen? (Reihenfolge = Priorität) */
  private resolveTarget(player: Character): Target | null {
    const tile = player.tile;
    const pickup = this.collectibles.pickupNear(tile, player.facing, player.x, player.y);
    if (pickup) return { kind: 'pickup', id: pickup };

    const [fx, fy] = DIRS[player.facing];
    for (const npc of this.npcs.values()) {
      if (!npc.present) continue;
      const dx = npc.x - player.x;
      const dy = npc.y - player.y;
      const d = Math.hypot(dx, dy);
      if (d < TILE * 1.35 && dx * fx + dy * fy > d * 0.35) return { kind: 'npc', npc };
    }

    const id = findInteraction(this.session.map, tile, player.facing, this.interactive);
    if (id) return { kind: 'object', id };
    if (this.collectibles.canPickFlowers(tile)) return { kind: 'flowers', tile };
    return null;
  }

  private tryInteract() {
    const player = this.player;
    if (!player || this.session.uiBlocking || this.cutscene) return;
    const target = this.resolveTarget(player);
    if (target) this.act(target);
  }

  private act(target: Target) {
    const player = this.player;
    if (!player) return;
    switch (target.kind) {
      case 'pickup':
        this.collectibles.pickUp(target.id, { x: player.x, y: player.y });
        return;
      case 'npc':
        this.talkTo(target.npc);
        return;
      case 'flowers':
        this.collectibles.pickFlowers(target.tile);
        return;
      case 'object':
        this.useObject(target.id);
    }
  }

  private useObject(id: string) {
    const player = this.player;
    const obj = objectById(this.session.map, id);
    if (!obj || !player) return;
    if (obj.kind === 'tree') {
      const msg = this.collectibles.shakeTree(obj, player.tile);
      if (msg) this.session.bus.emit('toast', { text: msg });
      return;
    }
    if (obj.kind === 'rock') {
      const found = knockRock(this.session, obj.id);
      const sprite = this.view.objectSprites.get(obj.id);
      if (sprite) this.tweens.add({ targets: sprite, scaleX: sprite.scaleX * 1.06, scaleY: sprite.scaleY * 0.94, duration: 90, yoyo: true });
      if (found) {
        giveItem(this.session, found, 1, false);
        this.session.bus.emit('toast', {
          text: found === 'glitzerstein' ? 'Tock tock … ein Glitzerstein! ✨' : `Tock tock … ${itemCountLabel(found, 1)} kullert heraus!`,
          icon: itemIconUrl(found),
        });
      } else {
        this.session.bus.emit('toast', { text: 'Tock tock. Heute ist hier nichts mehr zu finden.' });
      }
      return;
    }
    if (id === 'verkaufskiste') {
      this.session.bus.emit('ui:open', { kind: 'sell' });
      return;
    }
    if (id === 'briefkasten-lina' && (this.session.data?.mail.letters.length ?? 0) > 0) {
      this.session.bus.emit('ui:open', { kind: 'mail' });
      return;
    }
    if (id === 'haus-gisela') {
      this.knockAtHome('gisela');
      return;
    }
    this.openInteraction(id);
  }

  private knockAtHome(npcId: string) {
    const npc = this.npcs.get(npcId);
    if (!npc) return;
    const ctx = this.session.interactionContext();
    const pick = <T>(list: readonly T[]) => list[(ctx.now.getDate() + ctx.now.getHours()) % list.length];
    let lines: readonly string[];
    if (npc.present) lines = [`${npc.def.name}s Häuschen.`, 'Die Tür ist abgeschlossen. Auf einem Zettel steht: „Bin unterwegs. Nicht einbrechen!“'];
    else lines = pick(npc.isSleeping ? npc.def.dialogue.atHomeSleeping : npc.def.dialogue.atHome);
    this.session.bus.emit('dialog:open', { title: `${npc.def.name}s Häuschen`, lines: lines.map((l) => fillPlaceholders(l, ctx)) });
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

  // -------------------------------------------------------------------------
  // Gespräche
  // -------------------------------------------------------------------------

  private talkTo(npc: Npc) {
    const player = this.player;
    if (!player) return;
    npc.startTalk(player.x, player.y);
    // Steht Lina direkt vor einer sitzenden Figur, würde sie sie verdecken → kleiner Schritt zur Seite
    if (npc.char.sitting && Math.abs(player.x - npc.x) < 52 && player.y > npc.y) {
      const grid = this.session.map.grid;
      for (const side of [1, -1]) {
        const nx = npc.x + side * 60;
        if (!grid.isBlocked(Math.floor(nx / TILE), Math.floor(player.y / TILE))) {
          this.tweens.add({ targets: player, x: nx, duration: 180, ease: 'Sine.easeOut' });
          break;
        }
      }
    }
    player.faceTowards(npc.x, npc.y);
    const out = talkToNpc(this.session, npc.def.id);
    this.npcDialog(npc, out.lines, out.hearts);
  }

  private npcDialog(npc: Npc, lines: string[], hearts: number) {
    const id = npc.def.id;
    const title = npc.def.name;
    this.session.bus.emit('dialog:open', {
      title,
      hearts,
      lines,
      choices: [
        {
          label: '💬 Plaudern',
          onSelect: () => {
            const o = chatWithNpc(this.session, id);
            this.npcDialog(npc, o.lines, o.hearts);
          },
        },
        {
          label: '🎁 Etwas schenken',
          onSelect: () =>
            this.session.bus.emit('ui:open', {
              kind: 'gift',
              npcId: id,
              onPick: (itemId) => {
                const o = giftToNpc(this.session, id, itemId);
                if (o) this.npcDialog(npc, o.lines, o.hearts);
                else npc.endTalk();
              },
              onCancel: () => this.npcDialog(npc, ['Na? Doch nichts? Macht nix, Kindchen.'], npcHearts(this.session, id)),
            }),
        },
        {
          label: '👋 Tschüss',
          onSelect: () =>
            this.session.bus.emit('dialog:open', {
              title,
              hearts: npcHearts(this.session, id),
              lines: [goodbyeLine(this.session, id)],
              onClose: () => npc.endTalk(),
            }),
        },
      ],
    });
  }

  // -------------------------------------------------------------------------
  // Klicken & Tippen
  // -------------------------------------------------------------------------

  private onPointer(pointer: Phaser.Input.Pointer) {
    const down = this.pointerDown.get(pointer.identifier);
    this.pointerDown.delete(pointer.identifier);
    const player = this.player;
    if (!player || !down || this.cutscene || !this.session.acceptsPointer()) return;
    // Nur echte Klicks/Taps, kein Ziehen
    if (Math.hypot(pointer.x - down.x, pointer.y - down.y) > 14 * DPR) return;

    const wx = pointer.worldX;
    const wy = pointer.worldY;
    const map = this.session.map;

    // 1) Gegenstand am Boden?
    const pickup = this.collectibles.pickupAt(wx, wy);
    if (pickup) {
      const t = tileOf(pickup.x, pickup.y);
      this.walkTo([t, ...this.neighbours(t)], () => {
        const pos = this.collectibles.pickupPosition(pickup.id);
        if (pos) player.faceTowards(pos.x, pos.y);
        this.collectibles.pickUp(pickup.id, { x: player.x, y: player.y });
      });
      return;
    }

    // 2) Bewohner?
    for (const npc of this.npcs.values()) {
      if (!npc.present) continue;
      if (Math.abs(wx - npc.x) < 26 && wy < npc.y + 6 && wy > npc.y - 96) {
        const t = tileOf(npc.x, npc.y + (npc.char.sitting ? TILE : 0));
        const spots = npc.char.sitting ? [t] : this.neighbours(t);
        this.walkTo(spots, () => {
          const target = this.resolveTarget(player);
          if (target?.kind === 'npc') this.act(target);
          else {
            player.faceTowards(npc.x, npc.y);
            this.talkTo(npc);
          }
        });
        return;
      }
    }

    // 3) Interaktives Objekt?
    const hit = this.hitInteractive(wx, wy);
    if (hit) {
      this.walkToObject(hit);
      return;
    }

    // 4) Sonst einfach dorthin laufen
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

  private neighbours(t: Tile): Tile[] {
    return [
      { x: t.x, y: t.y + 1 },
      { x: t.x - 1, y: t.y },
      { x: t.x + 1, y: t.y },
      { x: t.x, y: t.y - 1 },
    ];
  }

  /** Zur nächstgelegenen erreichbaren Kachel aus `spots` laufen. */
  private walkTo(spots: Tile[], onArrive: () => void): boolean {
    const player = this.player;
    if (!player) return false;
    const grid = this.session.map.grid;
    let best: Tile[] | null = null;
    for (const s of spots) {
      if (grid.isBlocked(s.x, s.y)) continue;
      const path = findPath(grid, player.tile, s);
      if (path && (!best || path.length < best.length)) best = path;
    }
    if (!best) return false;
    this.marker.setVisible(false);
    player.followPath(best, onArrive);
    return true;
  }

  private hitInteractive(wx: number, wy: number): MapObject | null {
    const map = this.session.map;
    let best: MapObject | null = null;
    let bestDepth = -Infinity;
    for (const id of this.interactive) {
      const obj = objectById(map, id);
      if (!obj) continue;
      const sprite = this.view.objectSprites.get(id);
      const footprint = new Phaser.Geom.Rectangle(obj.x * TILE, obj.y * TILE, obj.w * TILE, obj.h * TILE);
      // Bei Bäumen zählt nur der Stamm – sonst würde man beim Laufen ständig schütteln
      const useSprite = obj.kind !== 'tree';
      const inside = footprint.contains(wx, wy) || (useSprite && (sprite?.getBounds().contains(wx, wy) ?? false));
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
    this.walkTo(spots, () => {
      // Zum Objekt drehen und benutzen
      const cx = obj.x + obj.w / 2 - 0.5;
      const cy = obj.y + obj.h / 2 - 0.5;
      const t = player.tile;
      const dx = cx - t.x;
      const dy = cy - t.y;
      player.face(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
      const id = findInteraction(map, t, player.facing, this.interactive);
      this.useObject(id ?? obj.id);
    });
  }

  private cleanup() {
    this.keys.destroy();
    for (const u of this.unsubscribers) u();
    this.unsubscribers = [];
    this.scale.off('resize', this.onResize, this);
  }
}
