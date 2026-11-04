/**
 * Die 3D-Dorfwelt: Renderer, Kamera, Licht (Tag & Nacht), Lina, Bewohner,
 * Interaktionen und Maus-/Tastatursteuerung.
 *
 * Zwei Modi:
 *  - Titel: Die Kamera schwebt langsam über das Dorf.
 *  - Spiel: Lina ist da und lässt sich steuern.
 */
import * as THREE from 'three';
import { DPR, TILE, UNIT } from '../config';
import { CollisionGrid, findPath, nearestWalkable, type Tile } from '../core/grid';
import { checkPlacement, type Exit, exitAt, footprint, type Room, type RoomLayout, type Rotation } from '../core/room';
import { FURNITURE_BY_ITEM, furnitureInfo } from '../data/furniture';
import { getDaylight } from '../core/time';
import { isWatered, spotKey } from '../core/garden';
import { WEATHER_LABELS } from '../core/weather';
import { applyMapFlags, findInteraction, isActive, type MapObject, OBJECT_KINDS, objectById, terrainAt, tileOf } from '../core/worldmap';
import { itemCountLabel, itemDef, type ToolId, TOOLS } from '../data/items';
import { FISH_BY_ID, type FishHabitat } from '../data/species';
import { fillPlaceholders, INTERACTIONS } from '../data/interactions';
import { NPCS } from '../data/npcs';
import { GISELA_TOOLS, GISELA_WELCOME, GISELA_WELCOME_2 } from '../data/npcs/gisela';
import { INTRO_LINES } from '../data/story';
import { itemIconUrl } from '../gfx/items';
import {
  chatWithNpc,
  checkDailyMail,
  giftToNpc,
  giveItem,
  goodbyeLine,
  hasUnreadMail,
  knockRock,
  npcHearts,
  sendLetter,
  talkToNpc,
  welcomeLetter,
} from '../game/gameplay';
import { KeyboardInput } from '../game/input';
import { currentRoom, finishExpansion, moveFurniture, pickUpFurniture, placeFromBag } from '../game/home';
import { checkStory } from '../game/story';
import { HOUSE_STAGES } from '../data/house';
import { CHRISTIN_WELCOME } from '../data/npcs/christin';
import { OLAF_WELCOME } from '../data/npcs/olaf';
import type { DecorCommand } from '../game/session';
import {
  biteFish,
  catchFish,
  catchInsect,
  catchMessage,
  currentWeather,
  flowerName,
  giveStarterTools,
  pickGardenFlower,
  plantAt,
  seedsInBag,
  toggleTool,
  updateGarden,
  waterAt,
} from '../game/nature';
import type { Session } from '../game/session';
import { mixHex, palette } from '../style/palette';
import { Character, FEET_OFFSET } from './Character3D';
import { Collectibles } from './Collectibles3D';
import { Fishing3D } from './Fishing3D';
import { Garden3D } from './Garden3D';
import { Insects3D } from './Insects3D';
import { Interior3D, ROOM_X, ROOM_Y } from './Interior3D';
import { makeCan, makeNet, makeRod, type ToolModel } from './models/critters';
import { Weather3D } from './Weather3D';
import { Winston } from './Winston';
import { petWinston, winstonDig, winstonMayDig } from '../game/pet';
import { DIG_LINES } from '../data/winston';
import { lampGlass, makeHouse, windowGlass } from './models/buildings';
import { buildMapView3D, footprintCenter, type MapView3D } from './MapView3D';
import { Npc } from './Npc';
import { Tweens } from './tweens';

type Target =
  | { kind: 'pickup'; id: string }
  | { kind: 'npc'; npc: Npc }
  | { kind: 'object'; id: string }
  | { kind: 'flowers'; tile: Tile }
  | { kind: 'beet'; tile: Tile }
  | { kind: 'moebel'; uid: string }
  | { kind: 'katalog' }
  | { kind: 'winston' };

const SPECIAL_OBJECTS = ['verkaufskiste', 'haus-gisela', 'haus-olaf', 'briefkasten-lina', 'werkbank-lina'];
const DIRS = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] } as const;

/** Kamera-Versatz zum Blickziel (schräg von oben, wie im Vorbild) */
const CAM_OFFSET = new THREE.Vector3(0, 5.4, 7.2);
const LANTERN_LIGHTS = 6;

export class World3D {
  readonly renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(32, 1, 0.1, 120);
  private sun = new THREE.DirectionalLight('#fff4e0', 2.2);
  private hemi = new THREE.HemisphereLight('#ffffff', '#a9d48e', 1.3);
  private lampLights: THREE.PointLight[] = [];
  private view: MapView3D;
  private collectibles: Collectibles;
  private tweens = new Tweens();
  private keys = new KeyboardInput();
  private player: Character | null = null;
  private npcs = new Map<string, Npc>();
  private interactive = new Set<string>();
  private cutscene = false;
  private camTarget = new THREE.Vector3(27.5, 0, 19);
  private camPos = new THREE.Vector3();
  private zoom = 1;
  private titleTime = 0;
  private dayCheck = 0;
  private lightCheck = 1;
  private night = 0;
  private bubble: THREE.Sprite;
  private bubbleKey: string | null = null;
  private marker: THREE.Mesh;
  private leaves: THREE.InstancedMesh;
  private leafState: Array<{ p: THREE.Vector3; v: THREE.Vector3; spin: number; phase: number }> = [];
  private faded = new Map<string, number>();
  private raycaster = new THREE.Raycaster();
  private pointerDown: { x: number; y: number } | null = null;
  private lastTime = performance.now();
  private unsubscribers: Array<() => void> = [];
  private weather: Weather3D;
  private fishing: Fishing3D;
  private insects: Insects3D;
  private garden: Garden3D;
  private held: { tool: ToolId; model: ToolModel } | null = null;
  private baseHemi = 1.3;
  private patienceToast = 0;
  private interior: Interior3D;
  /** Einrichten: was gerade gehalten wird (uid = schon im Zimmer, sonst aus der Tasche) */
  private decor: { itemId: string; uid: string | null; rot: Rotation } | null = null;
  private hoverCell: { x: number; y: number } | null = null;
  /** erst nach dem Verlassen eines Ausgangs-Feldes darf er wieder auslösen */
  private exitArmed = true;
  private winston: Winston | null = null;
  /** Wie lange Lina schon stillsteht (für Winstons Buddeln & Körbchen) */
  private linaIdle = 0;
  private basketCheck = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly session: Session,
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(DPR);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    const map = session.map;
    this.view = buildMapView3D(this.scene, map, session.season, this.renderer.capabilities.getMaxAnisotropy());
    this.collectibles = new Collectibles(this.scene, session, this.view, this.tweens);

    // Licht
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    Object.assign(this.sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 60 });
    this.sun.shadow.bias = -0.0008;
    this.sun.shadow.normalBias = 0.02;
    this.scene.add(this.sun, this.sun.target, this.hemi);
    for (let i = 0; i < LANTERN_LIGHTS; i++) {
      const l = new THREE.PointLight('#ffcf80', 0, 7, 1.6);
      this.lampLights.push(l);
      this.scene.add(l);
    }
    this.scene.fog = new THREE.Fog('#cfe9f7', 26, 55);

    for (const id of Object.keys(INTERACTIONS)) this.interactive.add(id);
    for (const id of SPECIAL_OBJECTS) this.interactive.add(id);
    for (const o of map.objects) if (o.kind === 'tree' || o.kind === 'rock') this.interactive.add(o.id);
    for (const [id, node] of this.view.nodes) node.userData.objectId = id;
    this.syncMapObjects();

    for (const def of NPCS) {
      const npc = new Npc(this.scene, def, session, this.view.terrain.heightAt);
      npc.char.root.userData.npcId = def.id;
      this.npcs.set(def.id, npc);
    }

    this.bubble = new THREE.Sprite(new THREE.SpriteMaterial({ map: bubbleTexture(), transparent: true, depthTest: false }));
    this.bubble.scale.set(0.5, 0.42, 1);
    this.bubble.renderOrder = 10;
    this.bubble.visible = false;
    this.scene.add(this.bubble);

    this.marker = new THREE.Mesh(
      new THREE.RingGeometry(0.22, 0.3, 28).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: palette.ui.accent, transparent: true, opacity: 0.9, depthWrite: false }),
    );
    this.marker.visible = false;
    this.scene.add(this.marker);

    this.leaves = this.makeLeaves();
    this.weather = new Weather3D(this.scene);
    this.fishing = new Fishing3D(this.scene);
    this.insects = new Insects3D(this.scene, session, this.view, this.tweens);
    this.garden = new Garden3D(this.scene, session, this.tweens);
    this.interactive.add('beet-lina');
    this.interior = new Interior3D(this.scene);

    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('pointermove', this.onPointerMove);
    canvas.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('resize', this.resize);
    this.unsubscribers.push(
      this.keys.onAction(() => this.tryInteract()),
      session.bus.on('game:started', () => this.startPlay()),
      session.bus.on('appearance:changed', (a) => this.player?.setAppearance(a)),
      session.bus.on('state:changed', () => {
        this.updateMailbox();
        this.garden.refresh();
        this.refreshRoom();
      }),
      session.bus.on('tool:changed', (t) => this.equip(t)),
      session.bus.on('decor:command', (c) => this.decorCommand(c)),
      this.keys.onKey((code) => this.onKey(code)),
    );

    this.resize();
    this.applyLight();
    this.renderer.setAnimationLoop(() => this.frame());
    if (session.playing) this.startPlay();
    session.markWorldReady();
  }

  // -------------------------------------------------------------------------
  // Grundgerüst
  // -------------------------------------------------------------------------

  private resize = () => {
    const parent = this.canvas.parentElement as HTMLElement;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / Math.max(1, h);
    this.camera.updateProjectionMatrix();
  };

  private frame() {
    const now = performance.now();
    const dtMs = Math.min(100, now - this.lastTime);
    this.lastTime = now;
    const dt = dtMs / 1000;

    this.tweens.update();
    this.lightCheck += dt;
    if (this.lightCheck > 1) {
      this.lightCheck = 0;
      this.applyLight();
    }
    for (const npc of this.npcs.values()) npc.update(dtMs);
    this.collectibles.update(dt);
    this.view.terrain.update(now / 1000);
    this.updateLeaves(dt);
    this.weather.update(dt, this.camTarget);
    this.hemi.intensity = this.baseHemi + this.weather.lightning * 1.4;
    this.insects.update(dt, this.night);

    const player = this.player;
    const data = this.session.data;
    if (player && data) {
      this.dayCheck += dtMs;
      if (this.dayCheck > 3000) {
        this.dayCheck = 0;
        if (this.collectibles.checkDay()) {
          checkDailyMail(this.session);
          this.onNewDay();
        }
      }
      const blocked = this.session.uiBlocking || this.cutscene;
      const intent = blocked ? { dx: 0, dy: 0, run: false } : this.keys.direction();
      if (blocked && player.hasPath && !this.cutscene) player.cancelPath();
      const grid = this.session.map.grid;
      if (this.fishing.active && (intent.dx !== 0 || intent.dy !== 0 || player.hasPath)) this.stopFishing();
      if (player.sitting && (intent.dx !== 0 || intent.dy !== 0)) this.standUp();
      const home = this.room;
      const solid = this.session.inside && home
        ? (tx: number, ty: number) => this.interior.isBlocked(home, tx - ROOM_X, ty - ROOM_Y)
        : (tx: number, ty: number) => grid.isBlocked(tx, ty);
      if (this.session.decorActive) intent.dx = intent.dy = 0;
      player.update(dtMs, intent, solid);
      this.updateWinston(dtMs, player, blocked, solid);
      if (this.session.inside && !this.session.decorActive) {
        const t = player.tile;
        const lay = this.lay;
        const cx = t.x - ROOM_X;
        const cy = t.y - ROOM_Y;
        // Hinter einem Ausgang (oder auf dem Ausgang in seine Richtung gelaufen) → hindurchgehen
        const beyond = lay.exits.find((e) => e.cells.some(([ex]) => ex === cx) && ((e.dir === 'down' && cy >= lay.h) || (e.dir === 'up' && cy < 0)));
        const on = exitAt(lay, cx, cy);
        const pushing = on && player.facing === on.dir && (on.dir === 'down' ? intent.dy > 0 : intent.dy < 0);
        const arrived = on && !player.hasPath && this.exitArmed && player.facing === on.dir;
        const ex = beyond ?? (pushing || arrived ? on : null);
        if (ex) this.useExit(ex);
        if (!on) this.exitArmed = true;
      }
      this.fishing.update(dt, this.rodTip());
      data.player.x = Math.round(player.x * 10) / 10;
      data.player.y = Math.round(player.y * 10) / 10;
      data.player.facing = player.facing;
      if (!player.hasPath) this.marker.visible = false;

      // Kamera folgt Lina weich (zu Hause: fester Blick ins Zimmer)
      const target = this.session.inside ? this.roomCenter() : new THREE.Vector3(player.x * UNIT, 0, player.y * UNIT);
      this.camTarget.lerp(target, 1 - Math.pow(0.002, dt));
      if (!this.session.inside) this.updateOccluders(player);
      this.updateBubble(player, blocked || this.session.decorActive);
    } else {
      // Titelbildschirm: langsamer Schwenk über das Dorf
      this.titleTime += dt;
      this.camTarget.set(24 + Math.sin(this.titleTime * 0.05) * 9, 0, 21 + Math.sin(this.titleTime * 0.035) * 3);
    }
    this.updateCamera();
    this.renderer.render(this.scene, this.camera);
  }

  private updateCamera() {
    const desired = this.camTarget.clone().add(CAM_OFFSET.clone().multiplyScalar(this.session.inside ? 1.22 : this.zoom));
    this.camPos.copy(desired);
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.camTarget.x, 0.75, this.camTarget.z);
    // Schatten folgen dem sichtbaren Bereich
    this.sun.target.position.set(this.camTarget.x, 0, this.camTarget.z);
    this.sun.position.set(this.camTarget.x + 7, 16, this.camTarget.z + 9);
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (this.session.decorActive) {
      if (Math.abs(e.deltaY) > 2) this.rotateHeld();
      return;
    }
    this.zoom = Math.min(1.45, Math.max(0.55, this.zoom * (e.deltaY > 0 ? 1.08 : 0.93)));
  };

  // -------------------------------------------------------------------------
  // Tag & Nacht
  // -------------------------------------------------------------------------

  private applyLight() {
    const now = this.session.clock();
    const light = getDaylight(now);
    this.night = light.night;
    const n = light.night;
    const tint = light.tint;
    const w = currentWeather(this.session);
    this.weather.set(w);
    const clouds = w.clouds;
    const outside = mixHex(mixHex(mixHex('#bfe6f7', tint, 0.55), '#9aa6b4', clouds * 0.7), '#2a2e5c', n * 0.75);
    const sky = this.session.inside ? mixHex('#f3e3cf', '#3a3450', n * 0.7) : outside;
    this.interior.updateLight(n, clouds);
    this.weather.setEnabled(!this.session.inside);
    this.leaves.visible = !this.session.inside;
    (this.scene.background as THREE.Color | null) ?? (this.scene.background = new THREE.Color());
    (this.scene.background as THREE.Color).set(sky);
    (this.scene.fog as THREE.Fog).color.set(sky);
    this.sun.color.set(mixHex('#fff4e0', tint, 0.6));
    this.sun.intensity = (2.3 * (1 - n) + 0.45 * n) * (1 - clouds * 0.75);
    this.hemi.color.set(mixHex(mixHex('#ffffff', tint, 0.7), '#c4ccd8', clouds * 0.6));
    this.hemi.groundColor.set(mixHex('#a9d48e', '#2d3560', n));
    this.baseHemi = 1.35 * (1 - n * 0.55) * (1 - clouds * 0.25);
    this.hemi.intensity = this.baseHemi;
    (this.scene.fog as THREE.Fog).near = 26 - clouds * 8;
    if (this.session.data) {
      this.insects.refresh();
      if (updateGarden(this.session)) this.garden.refresh();
    }
    windowGlass.emissiveIntensity = Math.max(0, n - 0.15) * 1.6;
    lampGlass.emissiveIntensity = 0.2 + Math.max(0, n - 0.1) * 2.2;
    this.placeLampLights();
  }

  /** Die nächsten Laternen zur Kamera bekommen echte Lichtquellen */
  private placeLampLights() {
    const glow = Math.max(0, this.night - 0.1);
    const sorted = [...this.view.lanterns].sort((a, b) => a.distanceToSquared(this.camTarget) - b.distanceToSquared(this.camTarget));
    this.lampLights.forEach((l, i) => {
      const pos = sorted[i];
      if (!pos || glow <= 0) {
        l.intensity = 0;
        return;
      }
      l.position.copy(pos);
      l.intensity = glow * 3.2;
    });
  }

  // -------------------------------------------------------------------------
  // Atmosphäre: fallende Blätter / Blüten / Schnee
  // -------------------------------------------------------------------------

  private makeLeaves(): THREE.InstancedMesh {
    const season = this.session.season;
    const count = { fruehling: 40, sommer: 14, herbst: 50, winter: 120 }[season];
    const color = { fruehling: '#ffc6d9', sommer: palette.leaves.sommer[1], herbst: '#f2a35e', winter: '#ffffff' }[season];
    const geo = season === 'winter' ? new THREE.SphereGeometry(0.03, 6, 4) : new THREE.PlaneGeometry(0.09, 0.06);
    const mat = new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide });
    const inst = new THREE.InstancedMesh(geo, mat, count);
    inst.frustumCulled = false;
    for (let i = 0; i < count; i++) {
      this.leafState.push({
        p: new THREE.Vector3((Math.random() - 0.5) * 22, Math.random() * 6, (Math.random() - 0.5) * 16),
        v: new THREE.Vector3(season === 'winter' ? 0 : 0.25 + Math.random() * 0.3, -(0.35 + Math.random() * 0.35), 0.05),
        spin: (Math.random() - 0.5) * 4,
        phase: Math.random() * 10,
      });
    }
    this.scene.add(inst);
    return inst;
  }

  private updateLeaves(dt: number) {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const s = new THREE.Vector3(1, 1, 1);
    const t = performance.now() / 1000;
    this.leafState.forEach((l, i) => {
      l.p.x += (l.v.x + Math.sin(t * 1.3 + l.phase) * 0.25) * dt;
      l.p.y += l.v.y * dt;
      l.p.z += l.v.z * dt;
      if (l.p.y < 0) {
        l.p.set((Math.random() - 0.5) * 22, 6 + Math.random() * 2, (Math.random() - 0.5) * 16);
      }
      e.set(t * l.spin, t * l.spin * 0.7, 0);
      q.setFromEuler(e);
      m.compose(new THREE.Vector3(this.camTarget.x + l.p.x, l.p.y, this.camTarget.z + l.p.z), q, s);
      this.leaves.setMatrixAt(i, m);
    });
    this.leaves.instanceMatrix.needsUpdate = true;
  }

  // -------------------------------------------------------------------------
  // Spielstart & Story
  // -------------------------------------------------------------------------

  private startPlay() {
    const data = this.session.data;
    if (!data) return;
    this.player?.destroy();
    if (data.player.x / TILE > ROOM_X - 5) {
      // Gespeichert im Haus → draußen vor der Tür weitermachen
      const sp = this.session.spawnPoint();
      data.player.x = sp.x;
      data.player.y = sp.y;
    }
    this.session.inside = false;
    this.session.decorActive = false;
    const p = data.player;
    this.player = new Character(this.scene, p.appearance, p.x, p.y, p.facing, this.view.terrain.heightAt, this.session.season);
    if (!this.winston) this.winston = new Winston(this.scene, this.tweens, this.view.terrain.heightAt);
    this.winston.heightAt = this.view.terrain.heightAt;
    this.dogFollow();
    this.camTarget.set(p.x * UNIT, 0, p.y * UNIT);

    this.collectibles.refresh();
    checkDailyMail(this.session);
    this.updateMailbox();
    this.fishing.stop();
    this.equip(this.session.tool);
    updateGarden(this.session);
    this.garden.refresh(true);
    this.insects.refresh(true);
    if (data.flags.giselaWelcomed && !data.flags.toolsGiven) {
      window.setTimeout(() => this.session.bus.emit('toast', { text: 'Oma Gisela hat etwas für dich – sprich sie doch mal an! 🎁' }), 2500);
    }

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
    this.onNewDay();
    this.rebuildLinaHouse();
  }

  /** Neuer Tag (oder Spielstart): Story, Ausbau, Karte */
  private onNewDay() {
    const data = this.session.data;
    if (!data) return;
    const events = checkStory(this.session);
    const stage = finishExpansion(this.session);
    if (stage !== null) {
      this.rebuildLinaHouse();
      const olaf = NPCS.find((n) => n.id === 'olaf');
      if (olaf) sendLetter(this.session, olaf, { id: `ausbau-${stage}`, subject: 'Dein Ausbau ist fertig!', body: `Liebe Lina,\n\ndein Haus ist fertig umgebaut: ${HOUSE_STAGES[stage].name}! Geh doch gleich mal rein und schau es dir an.\n\nDie Abrechnung liegt bei mir in der Dorfkasse. Ganz ohne Eile.\n\nDein Papa` }, `olaf-ausbau-${stage}`);
    }
    this.syncMapObjects();
    if ((events.includes('olaf-eingezogen') || (data.flags.olafEingezogen && !data.flags.olafBegruesst)) && data.flags.giselaWelcomed) {
      window.setTimeout(() => this.arrivalScene(), 2500);
    }
  }

  /** Story-Flags auf die Karte anwenden (Bauplatz → Haus) */
  private syncMapObjects() {
    const data = this.session.data;
    if (data) applyMapFlags(this.session.map, data.flags);
    for (const [id, node] of this.view.nodes) node.visible = isActive(this.session.map, id);
  }

  /** Linas Haus von außen passend zur Ausbaustufe */
  private rebuildLinaHouse() {
    const stage = this.session.data?.house.stage ?? 0;
    const old = this.view.nodes.get('haus-lina');
    if (!old || old.userData.stage === stage) return;
    const h = makeHouse(palette.roof.rose, stage);
    h.group.position.copy(old.position);
    h.group.userData = { ...old.userData, stage };
    old.parent?.add(h.group);
    old.removeFromParent();
    this.view.nodes.set('haus-lina', h.group);
    const occ = this.view.occluders.find((o) => o.id === 'haus-lina');
    if (occ) occ.node = h.group;
    this.faded.delete('haus-lina');
  }

  /** Olaf & Christin sind eingezogen: Sie kommen zu Lina und stellen sich vor */
  private arrivalScene() {
    const player = this.player;
    const olaf = this.npcs.get('olaf');
    const christin = this.npcs.get('christin');
    const data = this.session.data;
    if (!player || !olaf || !christin || !data || data.flags.olafBegruesst || this.cutscene || this.session.inside || this.session.uiBlocking) {
      if (data && !data.flags.olafBegruesst) window.setTimeout(() => this.arrivalScene(), 4000);
      return;
    }
    this.cutscene = true;
    player.cancelPath();
    const grid = this.session.map.grid;
    const lt = player.tile;
    const meetO = nearestWalkable(grid, { x: lt.x + 1, y: lt.y }, lt) ?? lt;
    const meetC = nearestWalkable(grid, { x: lt.x + 1, y: lt.y + 1 }, lt) ?? lt;
    olaf.scriptPlace(nearestWalkable(grid, { x: lt.x + 4, y: lt.y + 2 }, lt) ?? lt);
    christin.scriptPlace(nearestWalkable(grid, { x: lt.x + 5, y: lt.y + 3 }, lt) ?? lt);
    let arrived = false;
    const done = () => {
      if (arrived) return;
      arrived = true;
      olaf.char.faceTowards(player.x, player.y);
      christin.char.faceTowards(player.x, player.y);
      player.faceTowards(olaf.x, olaf.y);
      const ctx = this.session.interactionContext();
      this.session.bus.emit('dialog:open', {
        title: olaf.def.name,
        lines: OLAF_WELCOME.map((l) => fillPlaceholders(l, ctx)),
        onClose: () =>
          this.session.bus.emit('dialog:open', {
            title: christin.def.name,
            lines: CHRISTIN_WELCOME.map((l) => fillPlaceholders(l, ctx)),
            onClose: () => {
              this.session.setFlag('olafBegruesst');
              this.session.save();
              olaf.scriptDone();
              christin.scriptDone();
              this.cutscene = false;
            },
          }),
      });
    };
    olaf.scriptWalkTo(meetO, done);
    christin.scriptWalkTo(meetC, () => undefined);
    window.setTimeout(() => {
      if (arrived) return;
      olaf.scriptPlace(meetO);
      christin.scriptPlace(meetC);
      done();
    }, 12000);
  }

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
            lines: [...GISELA_WELCOME_2, ...GISELA_TOOLS].map((l) => fillPlaceholders(l, this.session.interactionContext())),
            onClose: () => {
              giveStarterTools(this.session);
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
    window.setTimeout(() => {
      if (arrived) return;
      gisela.scriptPlace(meet);
      onArrive();
    }, 12000);
  }

  // -------------------------------------------------------------------------
  // Anzeige-Helfer
  // -------------------------------------------------------------------------

  /** Bäume & Häuser zwischen Kamera und Lina werden durchsichtig. */
  private updateOccluders(player: Character) {
    const px = player.x * UNIT;
    const pz = player.y * UNIT;
    for (const o of this.view.occluders) {
      const dz = o.z - pz;
      const inFront = dz > 0.2 && dz < (o.id.startsWith('haus') ? 3.2 : 1.9);
      const near = Math.abs(o.x - px) < o.w / 2 + 0.3;
      const target = inFront && near ? 0.35 : 1;
      const current = this.faded.get(o.id) ?? 1;
      if (Math.abs(current - target) < 0.01) continue;
      const next = current + (target - current) * 0.2;
      this.faded.set(o.id, next);
      setOpacity(o.node, next);
    }
  }

  private updateBubble(player: Character, blocked: boolean) {
    const target = blocked ? null : this.resolveTarget(player);
    let key: string | null = null;
    let pos: THREE.Vector3 | null = null;
    if (target?.kind === 'winston' && this.winston) {
      key = 'winston';
      pos = this.winston.dog.root.position.clone().add(new THREE.Vector3(0, 0.62, 0));
    } else if (target?.kind === 'npc') {
      key = `npc:${target.npc.def.id}`;
      pos = target.npc.char.root.position.clone().add(new THREE.Vector3(0, target.npc.bubbleHeight, 0));
    } else if (target?.kind === 'object') {
      const obj = objectById(this.session.map, target.id);
      if (obj && obj.kind !== 'tree' && obj.kind !== 'rock') {
        key = `obj:${target.id}`;
        const c = footprintCenter(obj);
        const h = obj.kind === 'house' ? 1.9 : obj.kind === 'board' ? 1.9 : obj.kind === 'workbench' ? 1.7 : obj.kind === 'fountain' ? 1.7 : obj.kind === 'plot' ? 1.3 : 1.25;
        pos = new THREE.Vector3(c.x, h, obj.kind === 'house' || obj.kind === 'plot' ? c.z + obj.h / 2 - 0.3 : c.z);
      }
    }
    this.bubble.visible = !!pos;
    if (pos) {
      this.bubble.position.set(pos.x, pos.y + Math.sin(performance.now() / 300) * 0.05, pos.z);
      if (key !== this.bubbleKey) this.bubble.scale.set(0.5, 0.42, 1);
    }
    this.bubbleKey = key;
  }

  private updateMailbox() {
    const mb = this.view.mailbox;
    if (!mb) return;
    const full = hasUnreadMail(this.session);
    mb.flag.rotation.z = full ? 0 : -Math.PI / 2;
    mb.letter.visible = full;
  }

  // -------------------------------------------------------------------------
  // Interaktion
  // -------------------------------------------------------------------------

  private resolveTarget(player: Character): Target | null {
    const tile = player.tile;
    if (this.winstonInFront(player)) return { kind: 'winston' };
    if (this.session.inside) return this.homeTarget(player);
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
    const front = { x: tile.x + fx, y: tile.y + fy };
    if (this.garden.isSpot(front)) return { kind: 'beet', tile: front };
    const id = findInteraction(this.session.map, tile, player.facing, this.interactive);
    if (id) return { kind: 'object', id };
    if (this.collectibles.canPickFlowers(tile)) return { kind: 'flowers', tile };
    return null;
  }

  private tryInteract() {
    const player = this.player;
    if (!player || this.session.uiBlocking || this.cutscene) return;
    if (this.fishing.active) {
      this.reelIn();
      return;
    }
    if (this.session.decorActive) {
      this.decorClick();
      return;
    }
    if (player.sitting) {
      this.standUp();
      return;
    }
    const target = this.resolveTarget(player);
    if (this.session.inside) {
      if (target) this.act(target);
      return;
    }
    const tool = this.session.tool;
    if (tool === 'netz' && target?.kind !== 'npc' && this.swingNet()) return;
    if (tool === 'angel' && (!target || target.kind === 'flowers') && this.castRod()) return;
    if (target) this.act(target);
    else if (tool === 'netz') this.swingNet(true);
    else if (tool === 'angel') this.session.bus.emit('toast', { text: 'Stell dich ans Wasser und schau aufs Wasser, dann kannst du auswerfen. 🎣' });
    else if (tool === 'giesskanne') this.session.bus.emit('toast', { text: 'Gießen kannst du die Pflanzen in deinem Beet. 🌱' });
  }

  // -------------------------------------------------------------------------
  // Werkzeuge
  // -------------------------------------------------------------------------

  private onKey(code: string) {
    if (!this.player || this.session.uiBlocking || this.cutscene) return;
    const idx = ['Digit1', 'Digit2', 'Digit3'].indexOf(code);
    if (idx >= 0) toggleTool(this.session, TOOLS[idx]);
    if (code === 'KeyQ') toggleTool(this.session, null);
  }

  private equip(tool: ToolId | null) {
    const player = this.player;
    if (!player) return;
    if (this.fishing.active) this.stopFishing();
    this.held = null;
    player.hold(null);
    player.armForward = undefined;
    if (!tool) return;
    const model = tool === 'angel' ? makeRod() : tool === 'netz' ? makeNet() : makeCan();
    model.group.rotation.x = tool === 'angel' ? 0.2 : tool === 'netz' ? 0.6 : 1.2;
    player.hold(model.group);
    player.armForward = -0.35;
    this.held = { tool, model };
  }

  private rodTip(): THREE.Vector3 | null {
    const h = this.held;
    if (!h?.model.tip) return null;
    return h.model.group.localToWorld(h.model.tip.clone());
  }

  /** Erstes Wasser vor Lina (bis 3 Kacheln) */
  private waterAhead(): { point: THREE.Vector3; habitat: FishHabitat } | null {
    const player = this.player;
    if (!player) return null;
    const [fx, fy] = DIRS[player.facing];
    const t = player.tile;
    for (let d = 1; d <= 3; d++) {
      const x = t.x + fx * d;
      const y = t.y + fy * d;
      const terr = terrainAt(this.session.map, x, y);
      if (terr === 'water' || terr === 'sea' || terr === 'deep') {
        const px = player.x * UNIT + fx * (d + 0.6);
        const pz = player.y * UNIT + fy * (d + 0.6);
        return { point: new THREE.Vector3(px, 0, pz), habitat: terr === 'water' ? 'fluss' : 'meer' };
      }
      if (terr !== 'sand' && terr !== 'grass' && terr !== 'path' && d > 1) break;
    }
    return null;
  }

  private castRod(): boolean {
    const player = this.player;
    const water = this.waterAhead();
    if (!player || !water) return false;
    const fish = biteFish(this.session, water.habitat);
    if (!fish) {
      this.session.bus.emit('toast', { text: 'Hier beißt gerade nichts. Vielleicht später?' });
      return true;
    }
    player.armForward = -1.0;
    const tip = this.rodTip() ?? new THREE.Vector3(player.x * UNIT, 1, player.y * UNIT);
    this.fishing.cast(tip, water.point, fish);
    return true;
  }

  private reelIn() {
    const fish = this.fishing.reel();
    const player = this.player;
    if (!fish) {
      const now = performance.now();
      if (now - this.patienceToast > 2500) {
        this.patienceToast = now;
        this.session.bus.emit('toast', { text: 'Geduld … warte, bis der Schwimmer richtig abtaucht. 🎣' });
      }
      return;
    }
    if (player) {
      player.armForward = -1.6;
      window.setTimeout(() => this.player && this.held && (this.player.armForward = -0.35), 400);
    }
    const result = catchFish(this.session, fish);
    this.session.bus.emit('dialog:open', { title: fish.name, lines: [...catchMessage(fish.name, 'fisch', result), FISH_BY_ID[fish.id].description] });
  }

  private stopFishing() {
    this.fishing.stop();
    if (this.player && this.held) this.player.armForward = -0.35;
  }

  /** Kescher schwingen – fängt ein Insekt in Reichweite. */
  private swingNet(force = false): boolean {
    const player = this.player;
    if (!player) return false;
    const [fx, fy] = DIRS[player.facing];
    const key = this.insects.near(player.x, player.y, fx, fy);
    if (!key && !force) return false;
    this.tweens.add(320, (k) => (player.armForward = -2.4 + k * 2.0), () => (player.armForward = this.held ? -0.35 : undefined));
    if (!key) return true;
    const to = new THREE.Vector3(player.x * UNIT + fx * 0.5, 0.6, player.y * UNIT + fy * 0.5);
    const def = this.insects.take(key, to);
    if (!def) return true;
    window.setTimeout(() => {
      const result = catchInsect(this.session, def);
      this.session.bus.emit('dialog:open', { title: def.name, lines: [...catchMessage(def.name, 'insekt', result), def.description] });
    }, 330);
    return true;
  }

  // -------------------------------------------------------------------------
  // Beet
  // -------------------------------------------------------------------------

  private useBeet(t: Tile) {
    const data = this.session.data;
    if (!data) return;
    const plant = data.world.garden[spotKey(t.x, t.y)];
    const day = this.session.today();
    if (!plant) {
      const seeds = seedsInBag(this.session);
      if (seeds.length === 0) {
        this.session.bus.emit('toast', { text: 'Hier könntest du etwas pflanzen – aber du hast keine Samen dabei. 🌱' });
        return;
      }
      this.session.bus.emit('ui:open', {
        kind: 'seeds',
        onPick: (seedId) => {
          if (plantAt(this.session, t.x, t.y, seedId)) {
            this.garden.bounce(t);
            this.session.bus.emit('toast', { text: 'Eingepflanzt! Jetzt noch gießen. 💧' });
          }
        },
        onCancel: () => undefined,
      });
      return;
    }
    const name = flowerName(plant.flower);
    if (plant.stage === 3) {
      const got = pickGardenFlower(this.session, t.x, t.y);
      if (got) {
        this.garden.bounce(t);
        this.session.bus.emit('toast', { text: got.seed ? `${name} gepflückt – und ein paar Samen gefunden! 🌱` : `${name} gepflückt! 💐`, icon: itemIconUrl(got.flower) });
      }
      return;
    }
    if (this.session.tool === 'giesskanne') {
      this.tweens.add(600, (k) => this.player && (this.player.armForward = -0.6 - Math.sin(k * Math.PI) * 0.5), () => this.player && (this.player.armForward = -0.35));
      if (waterAt(this.session, t.x, t.y)) {
        this.garden.bounce(t);
        this.session.bus.emit('toast', { text: `Gegossen! Morgen wächst die ${name} ein Stück. 💧` });
      } else {
        this.session.bus.emit('toast', { text: 'Die Erde ist noch schön feucht. Morgen wieder!' });
      }
      return;
    }
    const stage = ['ist frisch eingepflanzt', 'keimt', 'hat eine Knospe'][plant.stage];
    const watered = isWatered(plant, day) ? 'Heute schon gegossen. 💧' : 'Mit der Gießkanne (Taste 3) gießen, dann wächst sie bis morgen. 💧';
    this.session.bus.emit('dialog:open', { title: name, lines: [`Die ${name} ${stage}.`, watered] });
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
      case 'beet':
        this.useBeet(target.tile);
        return;
      case 'katalog':
        this.session.bus.emit('ui:open', { kind: 'catalog' });
        return;
      case 'winston':
        this.petDog();
        return;
      case 'moebel':
        this.useFurniture(target.uid);
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
      const node = this.view.nodes.get(obj.id);
      if (node) this.tweens.add(200, (t) => node.scale.set(1 + Math.sin(t * Math.PI) * 0.06, 1 - Math.sin(t * Math.PI) * 0.06, 1));
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
    if (id === 'haus-lina') {
      this.enterHome();
      return;
    }
    if (id === 'werkbank-lina') {
      this.session.bus.emit('ui:open', { kind: 'werkbank' });
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
    if (obj.kind === 'beet') {
      const [fx, fy] = DIRS[player.facing];
      const t = { x: player.tile.x + fx, y: player.tile.y + fy };
      if (this.garden.isSpot(t)) this.useBeet(t);
      return;
    }
    if (id === 'haus-gisela') {
      this.knockAtHome('gisela');
      return;
    }
    if (id === 'haus-olaf') {
      const olaf = this.npcs.get('olaf');
      const christin = this.npcs.get('christin');
      this.knockAtHome(olaf?.present === false || !christin?.present ? 'olaf' : 'christin');
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
    this.session.bus.emit('dialog:open', { title: interaction.title, lines: interaction.lines(ctx).map((l) => fillPlaceholders(l, ctx)) });
  }

  // -------------------------------------------------------------------------
  // Gespräche
  // -------------------------------------------------------------------------

  private talkTo(npc: Npc) {
    const player = this.player;
    if (!player) return;
    npc.startTalk(player.x, player.y);
    player.faceTowards(npc.x, npc.y);
    const data = this.session.data;
    if (npc.def.id === 'gisela' && data?.flags.giselaWelcomed && !data.flags.toolsGiven) {
      this.session.bus.emit('dialog:open', {
        title: npc.def.name,
        lines: ['Lina! Gut, dass du kommst.', ...GISELA_TOOLS.slice(1)].map((l) => fillPlaceholders(l, this.session.interactionContext())),
        onClose: () => {
          giveStarterTools(this.session);
          this.session.save();
          npc.endTalk();
        },
      });
      return;
    }
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
              onCancel: () => this.npcDialog(npc, [id === 'gisela' ? 'Na? Doch nichts? Macht nix, Kindchen.' : 'Doch nichts? Kein Problem!'], npcHearts(this.session, id)),
            }),
        },
        ...(id === 'olaf'
          ? [
              {
                label: '🏦 Dorfkasse',
                onSelect: () => this.session.bus.emit('ui:open', { kind: 'bank', onClose: () => this.npcDialog(npc, ['Gern geschehen, mein Schatz. Sonst noch was?'], npcHearts(this.session, id)) }),
              },
            ]
          : []),
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
  // Maus
  // -------------------------------------------------------------------------

  private ndc(e: PointerEvent): THREE.Vector2 {
    const r = this.canvas.getBoundingClientRect();
    return new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  }

  /** Was liegt unter dem Mauszeiger? */
  private pick(e: PointerEvent): { npc?: Npc; objectId?: string; ground?: THREE.Vector3; winston?: boolean } {
    this.raycaster.setFromCamera(this.ndc(e), this.camera);
    const candidates: THREE.Object3D[] = [];
    for (const npc of this.npcs.values()) if (npc.present) candidates.push(npc.char.root);
    if (this.winston) candidates.push(this.winston.dog.root);
    for (const id of this.interactive) {
      if (!isActive(this.session.map, id)) continue;
      const node = this.view.nodes.get(id);
      if (node) candidates.push(node);
    }
    const hits = this.raycaster.intersectObjects(candidates, true);
    for (const h of hits) {
      let o: THREE.Object3D | null = h.object;
      while (o) {
        if (o.userData.npcId) return { npc: this.npcs.get(o.userData.npcId as string) };
        if (o.userData.winston) return { winston: true };
        if (o.userData.objectId) {
          // Bei Bäumen nur den Stamm-Bereich (unten) als Ziel – sonst schüttelt man beim Laufen ständig
          const obj = objectById(this.session.map, o.userData.objectId as string);
          if (obj?.kind === 'tree' && h.point.y > 1.2) break;
          return { objectId: o.userData.objectId as string };
        }
        o = o.parent;
      }
    }
    const g = this.raycaster.intersectObject(this.view.terrain.ground, false)[0];
    return { ground: g?.point };
  }

  private onPointerDown = (e: PointerEvent) => {
    if (e.button === 0) this.pointerDown = { x: e.clientX, y: e.clientY };
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.player || this.session.uiBlocking) {
      this.canvas.style.cursor = '';
      return;
    }
    if (this.session.inside) {
      this.hoverCell = this.roomCellAt(e);
      if (this.session.decorActive) this.updateGhost();
      const room = this.room;
      const t = this.hoverCell && room ? this.interior.topAt(room, this.hoverCell.x, this.hoverCell.y) : null;
      const desk = this.hoverCell && this.isDesk(this.hoverCell.x, this.hoverCell.y);
      this.canvas.style.cursor = this.session.decorActive ? (this.decor ? 'grabbing' : t ? 'grab' : '') : t || desk ? 'pointer' : '';
      return;
    }
    const hit = this.pick(e);
    this.canvas.style.cursor = hit.npc || hit.objectId || hit.winston ? 'pointer' : '';
  };

  private onPointerUp = (e: PointerEvent) => {
    const down = this.pointerDown;
    this.pointerDown = null;
    const player = this.player;
    if (!player || !down || this.cutscene || !this.session.acceptsPointer()) return;
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) return;
    if (this.session.inside) {
      this.hoverCell = this.roomCellAt(e);
      if (this.session.decorActive) this.decorClick();
      else this.roomClick();
      return;
    }
    const hit = this.pick(e);
    const grid = this.session.map.grid;

    if (hit.ground) {
      const wx = hit.ground.x / UNIT;
      const wy = hit.ground.z / UNIT;
      const pickup = this.collectibles.pickupAt(wx, wy);
      if (pickup) {
        const t = tileOf(pickup.x, pickup.y);
        this.walkTo([t, ...neighbours(t)], () => {
          const pos = this.collectibles.pickupPosition(pickup.id);
          if (pos) player.faceTowards(pos.x, pos.y);
          this.collectibles.pickUp(pickup.id, { x: player.x, y: player.y });
        });
        return;
      }
    }
    if (hit.winston && this.winston) {
      const w = this.winston;
      if (Math.hypot(w.x - player.x, w.y - player.y) < TILE * 2.2) {
        player.cancelPath();
        player.faceTowards(w.x, w.y);
        this.petDog();
      } else {
        this.walkTo([w.tile, ...neighbours(w.tile)], () => {
          player.faceTowards(w.x, w.y);
          this.petDog();
        });
      }
      return;
    }
    if (hit.npc) {
      const npc = hit.npc;
      const t = tileOf(npc.x, npc.y + (npc.char.sitting ? TILE : 0));
      const spots = npc.char.sitting ? [t, { x: t.x + 1, y: t.y }] : neighbours(t);
      this.walkTo(spots, () => {
        player.faceTowards(npc.x, npc.y);
        this.talkTo(npc);
      });
      return;
    }
    if (hit.objectId) {
      const obj = objectById(this.session.map, hit.objectId);
      if (obj) this.walkToObject(obj);
      return;
    }
    if (hit.ground) {
      const t = tileOf(hit.ground.x / UNIT, hit.ground.z / UNIT);
      const target = nearestWalkable(grid, t, player.tile);
      if (!target) return;
      const path = findPath(grid, player.tile, target);
      if (!path) return;
      this.marker.position.set(target.x + 0.5, Math.max(0, this.view.terrain.heightAt(target.x + 0.5, target.y + 0.5)) + 0.03, target.y + 0.5 + FEET_OFFSET * UNIT);
      this.marker.visible = true;
      this.tweens.add(220, (k) => this.marker.scale.setScalar(1.5 - 0.5 * k));
      player.followPath(path);
    }
  };

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
    this.marker.visible = false;
    player.followPath(best, onArrive);
    return true;
  }

  private walkToObject(obj: MapObject) {
    const player = this.player;
    if (!player) return;
    const map = this.session.map;
    const spots = (OBJECT_KINDS[obj.kind].interactFrom ?? []).map(([dx, dy]) => ({ x: obj.x + dx, y: obj.y + dy }));
    this.walkTo(spots, () => {
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

  // -------------------------------------------------------------------------
  // Winston
  // -------------------------------------------------------------------------

  /** Winston direkt hinter Lina absetzen (nach Start/Raumwechsel) */
  private dogFollow() {
    const player = this.player;
    if (!player || !this.winston) return;
    const [fx, fy] = DIRS[player.facing];
    this.winston.placeNear(player.x, player.y, fx, fy);
    this.linaIdle = 0;
  }

  private winstonInFront(player: Character): boolean {
    const w = this.winston;
    if (!w || !w.dog.root.visible) return false;
    const [fx, fy] = DIRS[player.facing];
    const dx = w.x - player.x;
    const dy = w.y - player.y;
    const d = Math.hypot(dx, dy);
    return d < TILE * 1.25 && dx * fx + dy * fy > d * 0.3;
  }

  private petDog() {
    const w = this.winston;
    const player = this.player;
    if (!w || !player) return;
    player.faceTowards(w.x, w.y);
    const sleeping = w.sleeping;
    const lines = petWinston(this.session, sleeping);
    w.pet(sleeping);
    this.session.bus.emit('toast', { text: lines.join(' ') });
  }

  private updateWinston(dtMs: number, player: Character, blocked: boolean, solid: (tx: number, ty: number) => boolean) {
    const w = this.winston;
    if (!w) return;
    const dt = dtMs / 1000;
    this.linaIdle = player.moving ? 0 : this.linaIdle + dt;
    const hour = this.session.clock().getHours();
    const night = hour >= 22 || hour < 6;

    // Drinnen: ins Körbchen, wenn Lina sich hinsetzt oder eine Weile stillsteht
    this.basketCheck -= dt;
    if (this.session.inside && !w.hasBasket && !player.moving && this.basketCheck <= 0 && (player.sitting || this.linaIdle > 8 || night)) {
      this.basketCheck = 1;
      this.sendToBasket();
    }

    w.update(dtMs, { x: player.x, y: player.y, moving: player.moving }, night, solid);

    // Draußen buddelt er einmal am Tag, wenn Lina kurz stehen bleibt
    if (!this.session.inside && !blocked && !night && this.linaIdle > 3 && w.resting && winstonMayDig(this.session)) {
      const t = w.tile;
      if (terrainAt(this.session.map, t.x, t.y) === 'grass' && !this.session.map.grid.isBlocked(t.x, t.y)) {
        w.dig(player.x, player.y, () => {
          const found = winstonDig(this.session);
          if (!found) return;
          const n = w.nosePoint;
          const nt = tileOf(n.x, n.y);
          const spot = this.session.map.grid.isBlocked(nt.x, nt.y) ? { x: w.x, y: w.y } : n;
          this.collectibles.drop(found, new THREE.Vector3(spot.x * UNIT, 0.35, spot.y * UNIT), spot);
          const line = DIG_LINES[this.session.today().length % DIG_LINES.length];
          this.session.bus.emit('toast', { text: `${line} (${itemDef(found)?.name ?? found})`, icon: itemIconUrl(found) });
          this.session.save();
        });
      }
    }
  }

  /** Läuft zum Hundekörbchen im aktuellen Raum (falls eins steht) */
  private sendToBasket() {
    const w = this.winston;
    const home = this.room;
    if (!w || !home) return;
    const basket = home.items.find((i) => FURNITURE_BY_ITEM[i.itemId]?.def.id === 'hundekoerbchen');
    if (!basket) return;
    const grid = this.roomGrid();
    const from = { x: w.tile.x - ROOM_X, y: w.tile.y - ROOM_Y };
    let best: Tile[] | null = null;
    for (const n of neighbours({ x: basket.x, y: basket.y })) {
      if (n.x < 0 || n.y < 0 || n.x >= this.lay.w || n.y >= this.lay.h || grid.isBlocked(n.x, n.y)) continue;
      const path = findPath(grid, from, n);
      if (path && (!best || path.length < best.length)) best = path;
    }
    if (!best) return;
    const toWorld = (t: Tile) => ({ x: (ROOM_X + t.x + 0.5) * TILE, y: (ROOM_Y + t.y + 0.5) * TILE });
    w.setBasket(toWorld(basket), best.map(toWorld));
  }

  // -------------------------------------------------------------------------
  // Zu Hause
  // -------------------------------------------------------------------------

  private get data() {
    return this.session.data;
  }

  private get room(): Room | undefined {
    return currentRoom(this.session)?.room;
  }

  private get lay(): RoomLayout {
    return currentRoom(this.session)?.layout ?? this.interior.layout;
  }

  private isDesk(x: number, y: number): boolean {
    const d = this.lay.desk;
    return !!d && d[0] === x && d[1] === y;
  }

  private roomCenter(): THREE.Vector3 {
    const L = this.lay;
    return new THREE.Vector3(ROOM_X + L.w / 2, 0, ROOM_Y + L.h / 2 - 0.2);
  }

  private refreshRoom(force = false) {
    const c = currentRoom(this.session);
    if (this.session.inside && c) this.interior.refresh(c.room, c.layout, force);
  }

  /** Lina betritt Raum `roomId` durch den Ausgang, der zu `from` führt */
  private placeInRoom(roomId: string, from: string) {
    const player = this.player;
    if (!player) return;
    this.session.roomId = roomId;
    this.refreshRoom(true);
    const L = this.lay;
    const back = L.exits.find((e) => e.to === from) ?? L.exits[0];
    const [cx, cy] = back ? back.cells[0] : [Math.floor(L.w / 2), L.h - 1];
    const inward = back?.dir === 'up' ? 1 : -1;
    player.teleport((ROOM_X + cx) * TILE + (back && back.cells.length > 1 ? 64 : 32), (ROOM_Y + cy + inward) * TILE + 40);
    player.face(back?.dir === 'up' ? 'down' : 'up');
    this.camTarget.copy(this.roomCenter());
    this.dogFollow();
    this.exitArmed = false;
    this.marker.visible = false;
  }

  private useExit(e: Exit) {
    if (e.to === 'draussen') this.exitHome();
    else this.placeInRoom(e.to, this.session.roomId);
  }

  private enterHome() {
    const player = this.player;
    const data = this.data;
    if (!player || !data) return;
    this.stopFishing();
    this.session.inside = true;
    player.heightAt = () => 0;
    if (this.winston) this.winston.heightAt = () => 0;
    this.placeInRoom('haupt', 'draussen');
    this.applyLight();
    this.session.bus.emit('home:inside', true);
  }

  private exitHome() {
    const player = this.player;
    if (!player) return;
    this.stopDecor();
    this.session.inside = false;
    this.session.roomId = 'haupt';
    player.heightAt = this.view.terrain.heightAt;
    if (this.winston) this.winston.heightAt = this.view.terrain.heightAt;
    const sp = this.session.spawnPoint();
    player.teleport(sp.x, sp.y);
    player.face('down');
    this.dogFollow();
    this.camTarget.set(sp.x * UNIT, 0, sp.y * UNIT);
    this.applyLight();
    this.session.save();
    this.session.bus.emit('home:inside', false);
  }

  /** Zimmerzelle vor Lina */
  private homeTarget(player: Character): Target | null {
    const home = this.room;
    if (!home) return null;
    const [fx, fy] = DIRS[player.facing];
    const t = player.tile;
    const cx = t.x - ROOM_X + fx;
    const cy = t.y - ROOM_Y + fy;
    if (this.isDesk(cx, cy)) return { kind: 'katalog' };
    // auch das Feld, auf dem Lina steht (Teppich), zählt nicht – nur davor
    const top = this.interior.topAt(home, cx, cy);
    return top ? { kind: 'moebel', uid: top.uid } : null;
  }

  private useFurniture(uid: string) {
    const home = this.room;
    const player = this.player;
    const item = home?.items.find((i) => i.uid === uid);
    const f = item ? FURNITURE_BY_ITEM[item.itemId] : undefined;
    if (!item || !f || !player || !home) return;
    if (f.def.light) {
      this.interior.toggleLamp(uid);
      this.interior.updateLight(this.night, currentWeather(this.session).clouds);
      return;
    }
    if (f.def.sit) {
      const { w, d } = footprint(f.def, item.rot);
      const cx = ROOM_X + item.x + w / 2;
      const cy = ROOM_Y + item.y + d / 2;
      player.teleport(cx * TILE, cy * TILE - (f.def.sit === 'liegen' ? 10 : 0));
      player.setSitting(true);
      player.seatHeight = this.interior.model(uid)?.seatY ?? 0.1;
      this.session.bus.emit('toast', { text: f.def.sit === 'liegen' ? 'Ach, ist das gemütlich … 💤' : 'Lina macht es sich gemütlich. ☕' });
      return;
    }
    const name = itemDef(item.itemId)?.name ?? f.def.name;
    this.session.bus.emit('dialog:open', { title: name, lines: [f.def.description] });
  }

  private standUp() {
    const player = this.player;
    if (!player?.sitting) return;
    player.setSitting(false);
    const home = this.room;
    if (!home || !this.session.inside) return;
    // aufs nächste freie Feld treten
    const grid = this.roomGrid();
    const t = player.tile;
    const free = nearestWalkable(grid, { x: t.x - ROOM_X, y: t.y - ROOM_Y + 1 });
    if (free) player.teleport((ROOM_X + free.x) * TILE + 32, (ROOM_Y + free.y) * TILE + 40);
  }

  private roomGrid(): CollisionGrid {
    const L = this.lay;
    const g = new CollisionGrid(L.w, L.h);
    const home = this.room;
    if (home) for (let x = 0; x < L.w; x++) for (let y = 0; y < L.h; y++) if (this.interior.isBlocked(home, x, y)) g.setBlocked(x, y);
    return g;
  }

  private roomCellAt(e: PointerEvent): { x: number; y: number } | null {
    this.raycaster.setFromCamera(this.ndc(e), this.camera);
    const hits = this.decor ? this.raycaster.intersectObject(this.interior.floor, false) : this.raycaster.intersectObject(this.interior.group, true);
    if (hits.length === 0) return null;
    // Bei Möbeln zählt das Feld unter dem Treffer; sonst Bodenpunkt
    const p = hits[0].point;
    const cell = this.interior.cellFromPoint(p);
    return cell.x >= 0 && cell.y >= 0 && cell.x < this.lay.w && cell.y < this.lay.h ? cell : null;
  }

  /** Klick im Zimmer (ohne Einrichten): hinlaufen bzw. benutzen */
  private roomClick() {
    const player = this.player;
    const cell = this.hoverCell;
    const home = this.room;
    if (!player || !cell || !home) return;
    if (player.sitting) this.standUp();
    const grid = this.roomGrid();
    const from = { x: player.tile.x - ROOM_X, y: player.tile.y - ROOM_Y };
    const isDesk = this.isDesk(cell.x, cell.y);
    const top = this.interior.topAt(home, cell.x, cell.y);
    const toWorld = (path: Tile[]) => path.map((t) => ({ x: t.x + ROOM_X, y: t.y + ROOM_Y }));
    if (isDesk || (top && grid.isBlocked(cell.x, cell.y))) {
      const spots = neighbours(cell).filter((n) => !grid.isBlocked(n.x, n.y));
      let best: Tile[] | null = null;
      let goal: Tile | null = null;
      for (const sp of spots) {
        const path = findPath(grid, from, sp);
        if (path && (!best || path.length < best.length)) {
          best = path;
          goal = sp;
        }
      }
      if (!best || !goal) return;
      const g = goal;
      player.followPath(toWorld(best), () => {
        player.face(cell.x > g.x ? 'right' : cell.x < g.x ? 'left' : cell.y > g.y ? 'down' : 'up');
        if (isDesk) this.session.bus.emit('ui:open', { kind: 'catalog' });
        else if (top) this.useFurniture(top.uid);
      });
      return;
    }
    const target = nearestWalkable(grid, cell, from);
    const path = target ? findPath(grid, from, target) : null;
    if (path) player.followPath(toWorld(path), top && FURNITURE_BY_ITEM[top.itemId]?.def.sit ? () => this.useFurniture(top.uid) : null);
  }

  // --- Einrichten ----------------------------------------------------------

  private decorCommand(c: DecorCommand) {
    if (!this.session.inside) return;
    switch (c.kind) {
      case 'start':
        this.session.decorActive = true;
        this.standUp();
        this.player?.cancelPath();
        this.player?.setVisible(false);
        break;
      case 'stop':
        this.stopDecor();
        return;
      case 'take':
        this.session.decorActive = true;
        this.cancelHold();
        this.decor = { itemId: c.itemId, uid: null, rot: 0 };
        break;
      case 'rotate':
        this.rotateHeld();
        return;
      case 'store':
        this.storeHeld();
        return;
      case 'cancel':
        this.cancelHold();
        break;
    }
    this.updateGhost();
    this.emitDecor();
  }

  private stopDecor() {
    if (!this.session.decorActive) return;
    this.cancelHold();
    this.session.decorActive = false;
    this.interior.hideGhost();
    const player = this.player;
    if (player) {
      player.setVisible(true);
      // Falls jetzt ein Möbel auf Linas Platz steht: zur Tür
      const t = player.tile;
      const room = this.room;
      if (room && this.interior.isBlocked(room, t.x - ROOM_X, t.y - ROOM_Y)) {
        const free = nearestWalkable(this.roomGrid(), { x: t.x - ROOM_X, y: t.y - ROOM_Y }) ?? { x: Math.floor(this.lay.w / 2), y: this.lay.h - 1 };
        player.teleport((ROOM_X + free.x) * TILE + 32, (ROOM_Y + free.y) * TILE + 40);
      }
    }
    this.emitDecor();
  }

  private cancelHold() {
    this.decor = null;
    this.interior.setHidden(null);
    this.interior.hideGhost();
  }

  private emitDecor(valid = true) {
    this.session.bus.emit('decor:state', { active: this.session.decorActive, holding: this.decor?.itemId ?? null, valid });
  }

  private rotateHeld() {
    if (!this.decor) return;
    this.decor.rot = ((this.decor.rot + 1) % 4) as Rotation;
    this.updateGhost();
  }

  private storeHeld() {
    const d = this.decor;
    if (!d) return;
    if (d.uid) {
      if (!pickUpFurniture(this.session, d.uid)) {
        this.session.bus.emit('toast', { text: 'Deine Tasche ist voll! 🎒' });
        return;
      }
    }
    this.cancelHold();
    this.refreshRoom();
    this.emitDecor();
  }

  /** Vorschau an der Mausposition */
  private updateGhost() {
    const d = this.decor;
    const cell = this.hoverCell;
    const home = this.room;
    if (!d || !cell || !home) {
      this.interior.hideGhost();
      return;
    }
    const info = furnitureInfo(d.itemId);
    if (!info) return;
    // Zelle unter dem Mauszeiger = Mitte des Möbels
    const fp = footprint(info, d.rot);
    const x = cell.x - Math.floor((fp.w - 1) / 2);
    const y = cell.y - Math.floor((fp.d - 1) / 2);
    const p = checkPlacement(home, this.lay, d.itemId, x, y, d.rot, furnitureInfo, d.uid ?? undefined);
    const base = p.on ? home.items.find((i) => i.uid === p.on) : undefined;
    const h = base ? (FURNITURE_BY_ITEM[base.itemId]?.def.surfaceHeight ?? 0) : 0;
    this.interior.showGhost(d.itemId, x, y, d.rot, p.ok, h);
    this.emitDecor(p.ok);
  }

  /** Klick beim Einrichten: hochheben oder abstellen */
  private decorClick() {
    const home = this.room;
    const cell = this.hoverCell;
    if (!home || !cell) return;
    const d = this.decor;
    if (!d) {
      const top = this.interior.topAt(home, cell.x, cell.y);
      if (!top) return;
      this.decor = { itemId: top.itemId, uid: top.uid, rot: top.rot };
      this.interior.setHidden(top.uid);
      this.updateGhost();
      return;
    }
    const info = furnitureInfo(d.itemId);
    if (!info) return;
    const fp = footprint(info, d.rot);
    const x = cell.x - Math.floor((fp.w - 1) / 2);
    const y = cell.y - Math.floor((fp.d - 1) / 2);
    const ok = d.uid ? moveFurniture(this.session, d.uid, x, y, d.rot) : placeFromBag(this.session, d.itemId, x, y, d.rot);
    if (!ok) {
      this.session.bus.emit('toast', { text: 'Hier ist kein Platz dafür.' });
      return;
    }
    this.cancelHold();
    this.refreshRoom();
    this.emitDecor();
  }

  /** Für Tests & Fehlersuche */
  get debug() {
    return {
      enterHome: () => this.enterHome(),
      goRoom: (id: string, from = 'haupt') => this.placeInRoom(id, from),
      decorAt: (x: number, y: number) => {
        this.hoverCell = { x, y };
        this.updateGhost();
        this.decorClick();
      },
      hoverAt: (x: number, y: number) => {
        this.hoverCell = { x, y };
        this.updateGhost();
      },
      interior: this.interior, player: this.player, winston: this.winston, npcs: this.npcs, collectibles: this.collectibles, insects: this.insects, fishing: this.fishing, weather: () => WEATHER_LABELS[currentWeather(this.session).kind], resolveTarget: () => (this.player ? this.resolveTarget(this.player) : null), tryInteract: () => this.tryInteract() };
  }

  dispose() {
    this.renderer.setAnimationLoop(null);
    this.keys.destroy();
    for (const u of this.unsubscribers) u();
    window.removeEventListener('resize', this.resize);
  }
}

function neighbours(t: Tile): Tile[] {
  return [
    { x: t.x, y: t.y + 1 },
    { x: t.x - 1, y: t.y },
    { x: t.x + 1, y: t.y },
    { x: t.x, y: t.y - 1 },
  ];
}

/** Macht ein Objekt (mit allen Teilen) halbdurchsichtig. Materialien werden dafür einmalig kopiert. */
function setOpacity(node: THREE.Object3D, opacity: number) {
  node.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    if (!m.userData.ownMaterial) {
      m.material = (m.material as THREE.Material).clone();
      m.userData.ownMaterial = true;
    }
    const mat = m.material as THREE.Material;
    mat.transparent = opacity < 0.99;
    mat.opacity = opacity;
    mat.depthWrite = opacity >= 0.99;
  });
}

function bubbleTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 108;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = palette.ui.accent;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.roundRect(8, 8, 112, 72, 36);
  ctx.moveTo(50, 78);
  ctx.lineTo(62, 100);
  ctx.lineTo(76, 78);
  ctx.stroke();
  ctx.fill();
  ctx.fillStyle = palette.ui.accentDark;
  for (const x of [38, 64, 90]) {
    ctx.beginPath();
    ctx.arc(x, 44, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
