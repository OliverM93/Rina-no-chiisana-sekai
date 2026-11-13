/**
 * Die 3D-Dorfwelt: Renderer, Kamera, Licht (Tag & Nacht), Lina, Bewohner,
 * Interaktionen und Maus-/Tastatursteuerung.
 *
 * Zwei Modi:
 *  - Titel: Die Kamera schwebt langsam über das Dorf.
 *  - Spiel: Lina ist da und lässt sich steuern.
 */
import { dressFor } from '../core/appearance';
import * as THREE from 'three';
import { DPR, TILE, UNIT } from '../config';
import { CollisionGrid, findPath, nearestWalkable, type Tile } from '../core/grid';
import { buildPlanGrid, type FloorPlan, planSize, roomAt, roomsBehind, roomsBeside, wallStrips } from '../core/floorplan';
import { floorsOf, groundFloor } from '../data/floorplan';
import { checkPlacement, type Exit, riderOffset, exitAt, footprint, type Room, type RoomLayout, type Rotation, wallRotationAt } from '../core/room';
import { FURNITURE_BY_ITEM, furnitureInfo, SURFACE_BY_ID } from '../data/furniture';
import { getDaylight, getSeason, isSameDayMonth } from '../core/time';
import { IDLE_GAP, IDLE_START, type IdleAct } from '../data/idle';
import { pickIdleAct } from '../game/idle';
import { isWatered, spotKey } from '../core/garden';
import { isPrecipitation, WEATHER_LABELS } from '../core/weather';
import { applyMapFlags, findInteraction, isActive, type MapObject, OBJECT_KINDS, objectById, terrainAt, tileOf } from '../core/worldmap';
import { CROP_BY_ID } from '../data/crops';
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
import { applySurface, bedTiles, buyFromCatalog, canPlace, catalogPrice, currentRoom, finishExpansion, fitsHere, moveFurniture, pickUpFurniture, placeFromBag, restoreFurniture, stockCount, variantsOf } from '../game/home';
import { checkStory } from '../game/story';
import { drinkCoffee, drinksFor, isCoffeeMachine, KICK_SPEED, kickActive } from '../game/coffee';
import { tassenStand } from '../game/tassen';
import type { Drink } from '../data/coffee';
import { christinTip, christinWaters } from '../game/christin';
import { buyDrink, checkAdvent, isAdventTime, punschOpen } from '../game/winter';
import { PUNSCH_DRINKS, PUNSCH_HOURS } from '../data/winter';
import { Footprints3D } from './Footprints3D';
import { HOUSE_STAGES, layoutOf } from '../data/house';
import { CHRISTIN_WELCOME } from '../data/npcs/christin';
import { OLAF_WELCOME } from '../data/npcs/olaf';
import { OLI_WELCOME } from '../data/npcs/oli';
import { DINNER_LINES, DINNER_OPENERS, JENS_WELCOME } from '../data/npcs/jens';
import { pairChatKey, PAIR_CHATS } from '../data/gespraeche';
import { GUEST_HOUSES } from '../data/gastHaeuser';
import { TRAINING_OLI, TRAINING_REPS, TRAINING_SOLO } from '../data/training';
import { dinnerGuests, isDinnerTime } from '../game/dinner';
import { activeMeetups, joinMeetup, meetupOf, meetupReply } from '../game/meetups';
import { CHECKUP_GIFTS, CHECKUP_LINES, LARS_WELCOME } from '../data/npcs/lars';
import { hashString } from '../core/rng';
import { canDate, canKiss, type DateKind, giveKiss, haveDate, nextStageScene, playStageScene } from '../game/romance';
import { SPONTANEOUS_KISS_LINES, WELCOME_KISS_LINES } from '../data/npcs/oli';
import { KISS } from './Character3D';

/** Abstand der Figurenmitten beim Küsschen (in Kacheln): Köpfe ~0,52 breit, beim Vorbeugen rücken sie je ~0,14 näher */
const KISS_DISTANCE = 0.84;
import { isPartyTime } from '../game/party';
import { makePartyLights, makePicnic } from './models/buildings';
import { addFriendship, catchUpHeartLetters } from '../game/gameplay';
import { activeWish, askWish, canFolkDance, checkWishLetter, folkDance, fulfillWish, wardrobeFor, wishTeaser } from '../game/wishes';
import { OLAF_CALENDAR_JOKES } from '../data/npcs/olaf';
import type { DecorCommand, FxKind } from '../game/session';
import { Particles3D } from './Particles3D';
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
  isFrozen,
  updateGarden,
  waterAt,
  missingKeepsakes,
} from '../game/nature';
import type { Session } from '../game/session';
import { mixHex, palette } from '../style/palette';
import { Character, FEET_OFFSET } from './Character3D';
import { Collectibles } from './Collectibles3D';
import { Fishing3D } from './Fishing3D';
import { Garden3D } from './Garden3D';
import { Insects3D } from './Insects3D';
import { HouseView3D, singleRoomPlan } from './HouseView3D';
import { Interior3D, ROOM_X, ROOM_Y } from './Interior3D';
import { Yard3D } from './Yard3D';
import { DigSpots3D } from './DigSpots3D';
import { Festivals3D } from './Festivals3D';
import { todaysFestivals } from '../game/festivals';
import { FESTIVAL_INFO } from '../data/festivals';
import { digSpot } from '../game/digging';
import { THALIA_WELCOME, PARTY_LINES } from '../data/npcs/thalia';
import { FIND_BY_ID } from '../data/fossils';
import { Animals3D } from './Animals3D';
import { coopHasEggs, coopKindOf, collectCoop } from '../game/animals';
import { COOPS } from '../data/animals';
import { YARD_AREA } from '../data/yard';
import { makeCan, makeNet, makeRod, makeShovel, type ToolModel } from './models/critters';
import { Weather3D } from './Weather3D';
import { Winston } from './Winston';
import { petWinston, winstonAppeared, winstonDig, winstonDue, winstonFound, winstonMayDig, winstonState } from '../game/pet';
import { DIG_LINES, WINSTON_APPEARS_TOAST, WINSTON_FIND_LINES, WINSTON_FREED_LINES, WINSTON_SPOT } from '../data/winston';
import { setModelSeason } from './models/furniture';
import { makeBush } from './models/nature';
import { lampGlass, makeHouse, windowGlass } from './models/buildings';
import { buildMapView3D, footprintCenter, type MapView3D } from './MapView3D';
import { Npc } from './Npc';
import { easeOutBack, Tweens } from './tweens';

type Target =
  | { kind: 'pickup'; id: string }
  | { kind: 'npc'; npc: Npc }
  | { kind: 'object'; id: string }
  | { kind: 'flowers'; tile: Tile }
  | { kind: 'beet'; tile: Tile }
  | { kind: 'moebel'; uid: string }
  | { kind: 'katalog' }
  | { kind: 'winston' }
  | { kind: 'tier'; index: number };

const SPECIAL_OBJECTS = ['verkaufskiste', 'haus-gisela', 'haus-olaf', 'briefkasten-lina', 'werkbank-lina', 'bistro-jens', 'praxis-lars', 'haus-thalia', 'punschstand', 'samenstand'];
const DIRS = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] } as const;

/** Kamera-Versatz zum Blickziel (schräg von oben, wie im Vorbild) */
const CAM_OFFSET = new THREE.Vector3(0, 5.4, 7.2);
const LANTERN_LIGHTS = 6;

/** Eingezogen-/Begrüßt-Flags je Einzug (für ausstehende Einzugsszenen) */
const MILESTONE_FLAGS: ReadonlyArray<readonly [string, string]> = [
  ['olafEingezogen', 'olafBegruesst'],
  ['oliEingezogen', 'oliBegruesst'],
  ['jensEingezogen', 'jensBegruesst'],
  ['larsEingezogen', 'larsBegruesst'],
  ['thaliaEingezogen', 'thaliaBegruesst'],
];

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
  private bubbleAlpha = 0;
  private bubbleTime = performance.now();
  private readonly bubblePos = new THREE.Vector3();
  private readonly talkTexture = bubbleTexture(false);
  private readonly useTexture = bubbleTexture(true);
  private marker: THREE.Mesh;
  private leaves: THREE.InstancedMesh;
  private leafState: Array<{ p: THREE.Vector3; v: THREE.Vector3; spin: number; phase: number }> = [];
  private faded = new Map<string, number>();
  private raycaster = new THREE.Raycaster();
  private pointerDown: { x: number; y: number } | null = null;
  private lastTime = performance.now();
  private unsubscribers: Array<() => void> = [];
  private weather: Weather3D;
  private particles: Particles3D;
  private fishing: Fishing3D;
  private insects: Insects3D;
  private garden: Garden3D;
  private held: { tool: ToolId; model: ToolModel } | null = null;
  private baseHemi = 1.3;
  private patienceToast = 0;
  /** Das Haus als zusammenhängendes Stockwerk (Räume an festen Stellen, Wandstreifen dazwischen) */
  private houseView: HouseView3D;
  /** Begehbares Gesamtgitter des Stockwerks (Gesamtkoordinaten = Welt − ROOM_X/ROOM_Y); null = neu bauen */
  private floorGrid: CollisionGrid | null = null;
  /** Felder hinter Ausgängen (Haustür, Treppe): dort geht Lina hinaus */
  private exitBeyond = new Set<string>();
  /** Raum unter dem Mauszeiger (Einrichten über mehrere Räume) */
  private hoverRoom = '';
  /** Wie sichtbar ist die Rückwand je Raum (1 = voll, kleiner = durchsichtig, weil dahinter ein Raum liegt)? */
  private wallFade = new Map<string, number>();
  /** Zoom beim Einrichten im Haus (1 = das ganze Stockwerk im Bild) */
  private decorZoom = 1;
  /** Kamera-Verschiebung beim Einrichten (WASD/Pfeile) */
  private decorPan = { x: 0, z: 0 };
  /** Kamera-Abstand: ruhig an das Stockwerk angepasst */
  private camScale = 1.22;
  /** Einrichten: was gerade gehalten wird (uid = schon im Zimmer, sonst aus der Tasche) */
  /**
   * Was Lina beim Einrichten in der Hand hat. `source` = was im Vorrat liegt (bei neuen Stücken, die Farbe darf
   * sich ändern); `origin` = Zustand vor dem Aufnehmen (für „Rückgängig“).
   */
  private decor: { itemId: string; uid: string | null; rot: Rotation; source?: string; origin?: { x: number; y: number; rot: Rotation; itemId: string; roomId: string } } | null = null;
  /** Schritte, die sich im Einrichtungsmodus rückgängig machen lassen (jüngster zuletzt) */
  private undoStack: Array<{ label: string; undo: () => boolean }> = [];
  private hoverCell: { x: number; y: number } | null = null;
  /** Beim Einrichten auf eine Wand gezielt: deren Drehung für Wand-Deko (0 hinten, 3 links, 1 rechts) */
  private hoverWall: Rotation | null = null;
  /** erst nach dem Verlassen eines Ausgangs-Feldes darf er wieder auslösen */
  private exitArmed = true;
  private winston: Winston | null = null;
  /** Das Gestrüpp, in dem sich Winston verfangen hat (bis Lina ihn befreit) */
  private winstonBush: THREE.Object3D | null = null;
  private stepAcc = 0;
  /** Fußspuren im Schnee */
  private footprints: Footprints3D;
  private printAcc = 0;
  private printSide = 1;
  private winstonPrintAcc = 0;
  /** Atemwölkchen bei Kälte: nächster Zeitpunkt je Figur */
  private breathAt = new Map<string, number>();
  /** Küsschen läuft (Oli kommt her / beide küssen sich) – Lina bleibt so lange stehen */
  private kissBusy = false;
  /** Einzugsszenen, die schon angestoßen wurden */
  private arrivalsScheduled = new Set<string>();
  /** Oli darf im Zimmer laufen (zu Lina hin) */
  private homeOliWalk = false;
  private lastHomeKiss = -Infinity;
  private nextSpontaneousKiss = 0;
  private kissCount = 0;
  /** Automatisches Gehen (Tür-Animation) */
  private autoWalk: { dx: number; dy: number; until: number } | null = null;
  private yard: Yard3D;
  private animals: Animals3D;
  private digSpots: DigSpots3D;
  private festivals: Festivals3D;
  private festToastDay = '';
  private emoteTimer = 2;
  private emoteTextures = new Map<string, THREE.CanvasTexture>();
  private npcRods = new Map<string, boolean>();
  private digging = false;
  private partyLights: { group: THREE.Group; bulbs: THREE.MeshToonMaterial[] };
  private partyLight = new THREE.PointLight('#ffb8d8', 0, 9, 1.4);
  /** Oli drinnen (wenn er zu Hause ist und Lina auch) */
  private homeOli: Character | null = null;
  private homeOliKey = '';
  /** Bewohner, die zu Hause angetroffen werden, wenn Lina zu Besuch ist (Schlüssel: Bewohner-ID) */
  private guestChars = new Map<string, Character>();
  /** uid der Hantelbank, auf der Oli gerade trainiert (für die Langhantel) */
  private homeOliBench = '';
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
    setModelSeason(session.season);
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

    this.bubble = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.talkTexture, transparent: true, depthTest: false }));
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
    this.particles = new Particles3D(this.scene);
    this.footprints = new Footprints3D(this.scene);
    this.fishing = new Fishing3D(this.scene);
    this.fishing.onBite = () => this.session.bus.emit('sfx', 'biss');
    this.insects = new Insects3D(this.scene, session, this.view, this.tweens);
    this.garden = new Garden3D(this.scene, session, this.tweens);
    this.interactive.add('beet-lina');
    this.houseView = new HouseView3D(this.scene);
    this.yard = new Yard3D(this.scene, this.view.terrain.heightAt);
    this.digSpots = new DigSpots3D(this.scene, session, this.view);
    this.festivals = new Festivals3D(this.scene, session.map, this.view.terrain.heightAt);
    session.livePositions = () => {
      const out: Record<string, { x: number; y: number }> = {};
      const p = this.player;
      if (p && !session.inside) out.lina = { x: p.x, y: p.y };
      else if (p) out.lina = session.spawnPoint();
      for (const [id, n] of this.npcs) if (n.present) out[id] = { x: n.x, y: n.y };
      return out;
    };
    this.partyLights = makePartyLights(24.2, 18.6, 31, 23.4);
    this.partyLights.group.visible = false;
    this.partyLight.position.set(27.6, 2.4, 21);
    this.scene.add(this.partyLights.group, this.partyLight);
    this.animals = new Animals3D(this.scene, session.map.grid, this.view.terrain.heightAt);
    this.garden.extraSpots = () => this.yardBedSpots();

    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('contextmenu', (e) => this.session.decorActive && e.preventDefault());
    canvas.addEventListener('pointermove', this.onPointerMove);
    canvas.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('resize', this.resize);
    this.unsubscribers.push(this.session.bus.on('foto:aufnehmen', () => this.takePhoto()));
    this.unsubscribers.push(this.session.bus.on('camera:zoom', (dir) => this.zoomBy(dir === 'in' ? 0.85 : 1 / 0.85)));
    this.unsubscribers.push(
      this.keys.onAction(() => this.tryInteract()),
      session.bus.on('game:started', () => this.startPlay()),
      session.bus.on('appearance:changed', (a) => this.player?.setAppearance(a)),
      session.bus.on('fx', (f) => this.playFx(f.kind, f.npc, f.x, f.y)),
      session.bus.on('state:changed', () => {
        this.updateMailbox();
        this.garden.refresh();
        this.refreshRoom();
        this.refreshYard();
        this.digSpots.refresh();
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
    this.updateMeetups(dt);
    this.updateChats(dt);
    this.collectibles.update(dt);
    this.view.terrain.update(now / 1000);
    this.updateLeaves(dt);
    this.weather.update(dt, this.camTarget);
    this.particles.update(dt, this.camera, this.camTarget, this.fireflyLevel());
    this.footprints.update(dt, !this.session.inside);
    this.updateBreath();
    this.hemi.intensity = this.baseHemi + this.weather.lightning * 1.4;
    this.insects.update(dt, this.night);
    this.digSpots.update(dt, !this.session.inside);
    this.festivals.update(dt, this.night, !this.session.inside);
    {
      const h = this.session.clock().getHours();
      this.animals.update(dt, this.session.data?.yard, h >= 21 || h < 6, !this.session.inside);
    }

    const player = this.player;
    const data = this.session.data;
    if (player && data) {
      this.dayCheck += dtMs;
      if (this.dayCheck > 3000) {
        this.dayCheck = 0;
        if (this.collectibles.checkDay()) {
          checkDailyMail(this.session);
          checkAdvent(this.session);
          this.onNewDay();
        } else this.progressTick();
        this.christinRound();
      }
      const blocked = this.session.uiBlocking || this.cutscene || this.kissBusy;
      const auto = this.autoWalk && performance.now() < this.autoWalk.until ? this.autoWalk : null;
      if (!auto) this.autoWalk = null;
      const intent = auto ? { dx: auto.dx, dy: auto.dy, run: false } : blocked ? { dx: 0, dy: 0, run: false } : this.keys.direction();
      if (blocked && player.hasPath && !this.cutscene) player.cancelPath();
      const grid = this.session.map.grid;
      if (this.fishing.active && (intent.dx !== 0 || intent.dy !== 0 || player.hasPath)) this.stopFishing();
      if (player.sitting && (intent.dx !== 0 || intent.dy !== 0)) this.standUp();
      const home = this.room;
      const solid = this.session.inside && home
        ? this.floorSolid
        : (tx: number, ty: number) => grid.isBlocked(tx, ty) || this.npcStands(tx, ty, player);
      // drinnen bleibt Lina beim Einrichten stehen, im Garten darf sie herumlaufen
      if (this.session.decorActive && this.session.inside) {
        // …stattdessen schwenkt WASD/Pfeile die Kamera über das Stockwerk (Sims-Prinzip)
        if (this.houseWide()) {
          const size = planSize(this.houseView.plan);
          const speed = 12 * this.camScale * this.decorZoom * (dtMs / 1000);
          this.decorPan.x = Math.max(-size.w / 2, Math.min(size.w / 2, this.decorPan.x + intent.dx * speed));
          this.decorPan.z = Math.max(-size.h / 2, Math.min(size.h / 2, this.decorPan.z + intent.dy * speed));
        }
        intent.dx = intent.dy = 0;
      } else if (this.session.decorActive) {
        // Garten gestalten: genauso – Lina bleibt stehen, WASD/Pfeile und Ziehen schwenken die Kamera
        const speed = 12 * this.zoom * (dtMs / 1000);
        this.setDecorPan(this.decorPan.x + intent.dx * speed, this.decorPan.z + intent.dy * speed);
        intent.dx = intent.dy = 0;
      }
      // beim Durch-die-Tür-Gehen: keine Kollision (sonst stünde Lina vor der Hauswand)
      // Kaffee-Kick: ein paar Minuten flotter unterwegs
      player.speedFactor = kickActive(this.session) ? KICK_SPEED : 1;
      player.update(dtMs, intent, auto ? () => false : solid);
      // Schritte: bei jedem zweiten halben Schritt ein leises Geräusch
      if (player.moving) {
        this.stepAcc += dtMs / 1000;
        if (this.stepAcc > (player.running ? 0.22 : 0.3)) {
          this.stepAcc = 0;
          this.session.bus.emit('sfx', this.session.inside ? 'schritt-holz' : 'schritt');
          // beim Rennen draußen kleine Staubwölkchen an den Füßen
          if (player.running && !this.session.inside && this.weather.current.kind !== 'schnee') this.fxAt('staub', player.x, player.y);
        }
      } else this.stepAcc = 0.2;
      this.updatePrints(dtMs, player);
      this.updateWinston(dtMs, player, blocked, solid);
      this.updateIdle(player, blocked);
      this.updateHomeOli(dtMs);
      this.updateGuestResidents(dtMs);
      this.updateWallFade(player, dtMs / 1000);
      if (this.session.inside && !this.session.decorActive) {
        const t = player.tile;
        const lay = this.lay;
        this.trackRoom(player);
        const cx = t.x - this.ox;
        const cy = t.y - this.oy;
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
      const target = this.session.inside
        ? this.insideCamTarget()
        : new THREE.Vector3(player.x * UNIT, 0, player.y * UNIT).add(this.session.decorActive ? new THREE.Vector3(this.decorPan.x, 0, this.decorPan.z) : new THREE.Vector3());
      this.camTarget.lerp(target, 1 - Math.pow(0.002, dt));
      if (!this.session.inside) this.updateOccluders(player);
      if (!this.session.inside) {
        const t = player.tile;
        this.setInYard(t.x >= YARD_AREA.x && t.x < YARD_AREA.x + YARD_AREA.w && t.y >= YARD_AREA.y && t.y < YARD_AREA.y + YARD_AREA.h);
      }
      this.updateBubble(player, blocked || this.session.decorActive);
    } else {
      // Titelbildschirm: langsamer Schwenk über das Dorf
      this.titleTime += dt;
      this.camTarget.set(24 + Math.sin(this.titleTime * 0.05) * 9, 0, 21 + Math.sin(this.titleTime * 0.035) * 3);
    }
    this.updateCamera();
    this.renderer.render(this.scene, this.camera);
  }

  /** Fotomodus: die Welt einmal zeichnen und das Bild ans Foto-Fenster geben (ohne Oberfläche) */
  private takePhoto() {
    if (!this.session.playing || this.cutscene) return;
    this.updateCamera();
    this.renderer.render(this.scene, this.camera); // direkt davor zeichnen, sonst ist der Puffer leer
    const image = this.canvas.toDataURL('image/png');
    this.session.bus.emit('sfx', 'foto');
    this.session.bus.emit('ui:open', { kind: 'foto', image });
  }

  private updateCamera() {
    const desired = this.camTarget.clone().add(CAM_OFFSET.clone().multiplyScalar(this.session.inside ? this.camScale * (this.session.decorActive && this.houseWide() ? this.decorZoom : this.zoom) : this.zoom));
    this.camPos.copy(desired);
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.camTarget.x, 0.75, this.camTarget.z);
    // Schatten folgen dem sichtbaren Bereich
    this.sun.target.position.set(this.camTarget.x, 0, this.camTarget.z);
    this.sun.position.set(this.camTarget.x + 7, 16, this.camTarget.z + 9);
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    // Mausrad und Touchpad (Zwei-Finger-Scrollen, Pinch) zoomen – auch beim Einrichten (Drehen: R oder Knopf).
    // Proportional zur Scrollstärke: Touchpads schicken viele kleine Schritte, Mausräder wenige große.
    const k = Math.max(-80, Math.min(80, e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY));
    this.zoomBy(Math.exp(k * 0.0013));
  };

  /** Steht hier gerade ein Bewohner? (Lina läuft nicht durch sie hindurch – ihre eigene Kachel zählt nie) */
  private npcStands(tx: number, ty: number, player: Character): boolean {
    const pt = player.tile;
    if (pt.x === tx && pt.y === ty) return false;
    for (const npc of this.npcs.values()) {
      if (!npc.blocksPlayer || !npc.char.visible) continue;
      const t = npc.char.tile;
      if (t.x === tx && t.y === ty) return true;
    }
    return false;
  }

  /** Hinein-/Herauszoomen (Mausrad & Knöpfe) */
  private zoomBy(factor: number) {
    // Beim Einrichten im Haus gibt es einen eigenen Zoom: von „ganzes Stockwerk“ bis dicht an einen Raum heran
    if (this.session.inside && this.session.decorActive && this.houseWide()) {
      const minRel = 0.95 / Math.max(this.camScale, 0.01); // so nah wie die normale Raumansicht
      this.decorZoom = Math.min(1.5, Math.max(Math.min(minRel, 1), this.decorZoom * factor));
      return;
    }
    this.zoom = Math.min(1.45, Math.max(0.55, this.zoom * factor));
  }

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
    this.houseView.updateLight(n, clouds);
    this.yard.updateLight(n);
    const party = isPartyTime(this.session) && !this.session.inside;
    if (party && !this.partyLights.group.visible) this.session.bus.emit('toast', { text: '🎉 Party auf dem Dorfplatz! Thalia hat Musik mitgebracht.' });
    this.partyLights.group.visible = party;
    this.partyLight.intensity = party ? 2.5 : 0;
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
    // Draußen versteckt der Nebel das ferne Land; im Haus gibt es nichts zu verstecken (sonst verschwindet beim
    // Herauszoomen/Einrichten das ganze Stockwerk im Nebel)
    const fog = this.scene.fog as THREE.Fog;
    fog.near = this.session.inside ? 1000 : 26 - clouds * 8;
    fog.far = this.session.inside ? 2000 : 55;
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
    this.player = new Character(this.scene, p.appearance, p.x, p.y, p.facing, this.view.terrain.heightAt, this.session.season, this.session.today());
    this.syncWinston();
    this.camTarget.set(p.x * UNIT, 0, p.y * UNIT);

    this.collectibles.refresh();
    checkDailyMail(this.session);
    checkAdvent(this.session);
    catchUpHeartLetters(this.session);
    checkWishLetter(this.session);
    this.updateMailbox();
    this.fishing.stop();
    this.equip(this.session.tool);
    updateGarden(this.session);
    this.garden.refresh(true);
    this.insects.refresh(true);
    // Verlorene Werkzeuge & Erinnerungsstücke (ältere Spielstände) kommen zurück
    const lost = missingKeepsakes(this.session);
    if (lost.length > 0) {
      window.setTimeout(() => {
        for (const id of lost) this.giveOrDrop(id);
        const tools = lost.filter((id) => (TOOLS as readonly string[]).includes(id));
        const text = tools.length > 0 ? `Oma hat dir ${tools.map((t) => itemDef(t)?.name).join(', ')} wiedergebracht. „Pass diesmal besser drauf auf, Kind!“ 🔧` : 'Olis Möbel stehen wieder bereit – sie lagen noch im Keller. 📦';
        this.session.bus.emit('toast', { text });
      }, 2200);
    }
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
    for (const npc of this.npcs.values()) npc.snap();
    this.rebuildLinaHouse();
    this.refreshYard(true);
    this.setInYard(false);
    this.digSpots.refresh();
  }

  /** Neuer Tag (oder Spielstart): Story, Ausbau, Karte */
  /**
   * Fortschritt zwischendurch (alle paar Sekunden): Meilenstein erreicht → Brief, kurze Spielzeit
   * später → Einzug; Hausausbau fertig. Nur draußen und wenn gerade nichts anderes läuft.
   */
  private progressTick() {
    const data = this.session.data;
    if (!data || this.session.inside || this.session.uiBlocking || this.cutscene || this.kissBusy || this.session.decorActive) return;
    if (winstonDue(this.session)) this.winstonAppears();
    const pending = MILESTONE_FLAGS.some(([moved, greeted]) => data.flags[moved] && !data.flags[greeted]);
    checkWishLetter(this.session);
    const events = checkStory(this.session);
    const stage = finishExpansion(this.session);
    if (events.length === 0 && stage === null && !pending) return;
    this.applyProgress(events, stage);
  }

  private onNewDay() {
    const data = this.session.data;
    if (!data) return;
    const events = checkStory(this.session);
    const stage = finishExpansion(this.session);
    this.applyProgress(events, stage);
  }

  /** Ereignisse der Rahmenhandlung umsetzen (Haus, Karte, Einzugsszenen – jede nur einmal) */
  private applyProgress(events: readonly string[], stage: number | null) {
    const data = this.session.data;
    if (!data) return;
    if (stage !== null) {
      this.rebuildLinaHouse();
      const olaf = NPCS.find((n) => n.id === 'olaf');
      if (olaf) sendLetter(this.session, olaf, { id: `ausbau-${stage}`, subject: 'Dein Ausbau ist fertig!', body: `Liebe Lina,\n\ndein Haus ist fertig umgebaut: ${HOUSE_STAGES[stage].name}! Geh doch gleich mal rein und schau es dir an.\n\nDie Abrechnung liegt bei mir in der Dorfkasse. Ganz ohne Eile.\n\nDein Papa` }, `olaf-ausbau-${stage}`);
    }
    this.syncMapObjects();
    this.refreshYard();
    this.refreshFestivals();
    if ((events.includes('thalia-eingezogen') || (data.flags.thaliaEingezogen && !data.flags.thaliaBegruesst)) && data.flags.larsBegruesst && this.scheduleArrival('thalia')) {
      window.setTimeout(() => this.npcArrival('thalia', THALIA_WELCOME, -1, () => {
        this.giveOrDrop('schaufel');
        this.session.bus.emit('toast', { text: 'Schaufel eingesteckt! (Taste 4) – und die Dorfkarte gibt\'s mit M. 🗺️' });
        window.setTimeout(() => this.digSpots.refresh(), 50);
      }), 5000);
    }
    if ((events.includes('lars-eingezogen') || (data.flags.larsEingezogen && !data.flags.larsBegruesst)) && data.flags.jensBegruesst && this.scheduleArrival('lars')) {
      window.setTimeout(() => this.larsArrival(), 4500);
    }
    if ((events.includes('jens-eingezogen') || (data.flags.jensEingezogen && !data.flags.jensBegruesst)) && data.flags.oliBegruesst && this.scheduleArrival('jens')) {
      window.setTimeout(() => this.jensArrival(), 3500);
    }
    if ((events.includes('oli-eingezogen') || (data.flags.oliEingezogen && !data.flags.oliBegruesst)) && data.flags.olafBegruesst && this.scheduleArrival('oli')) {
      window.setTimeout(() => this.oliArrival(), 2500);
    }
    if ((events.includes('olaf-eingezogen') || (data.flags.olafEingezogen && !data.flags.olafBegruesst)) && data.flags.giselaWelcomed && this.scheduleArrival('olaf')) {
      window.setTimeout(() => this.arrivalScene(), 2500);
    }
  }

  /** Wichtiges in die Tasche – passt es nicht mehr hinein, fällt es vor Lina auf den Boden (geht nie verloren) */
  private giveOrDrop(itemId: string, count = 1) {
    const left = giveItem(this.session, itemId, count);
    const p = this.player;
    for (let i = 0; i < left && p; i++) {
      const [fx, fy] = DIRS[p.facing];
      this.collectibles.drop(itemId, new THREE.Vector3(p.x * UNIT, 1.1, p.y * UNIT), { x: p.x + fx * 40 + i * 14, y: p.y + fy * 40 + 8 });
    }
    if (left > 0) this.session.bus.emit('toast', { text: 'Deine Tasche ist voll – es liegt vor deinen Füßen. 🎒' });
  }

  /** Jede Einzugsszene nur einmal anstoßen (bis sie gelaufen ist, steht das Flag „begrüßt“ noch aus) */
  private scheduleArrival(id: string): boolean {
    if (this.arrivalsScheduled.has(id)) return false;
    this.arrivalsScheduled.add(id);
    return true;
  }

  /** Festschmuck & Begrüßung zum Fest */
  private refreshFestivals() {
    const fests = todaysFestivals(this.session);
    this.festivals.refresh(fests);
    const day = this.session.today();
    const bday = NPCS.find((n) => n.birthday && (!n.movesIn || this.session.data?.flags[n.movesIn]) && isSameDayMonth(this.session.clock(), n.birthday));
    if ((fests.length > 0 || bday) && this.festToastDay !== day) {
      this.festToastDay = day;
      const text = fests.length > 0 ? FESTIVAL_INFO[fests[0]].toast : `🎂 Heute hat ${bday?.name} Geburtstag! Vielleicht ein kleines Geschenk? 🎁`;
      window.setTimeout(() => this.session.bus.emit('toast', { text }), 3500);
    }
  }

  /** Story-Flags auf die Karte anwenden (Bauplatz → Haus) */
  private syncMapObjects() {
    const data = this.session.data;
    if (data) applyMapFlags(this.session.map, { ...data.flags, adventszeit: isAdventTime(this.session.clock()) });
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
          this.giveOrDrop('keks');
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

  /** Wohin das Symbol über dem Ziel gehört – Sprechblase bei Figuren, Funkeln bei Dingen */
  private bubbleFor(target: Target | null): { key: string; pos: THREE.Vector3; talk: boolean } | null {
    if (!target) return null;
    if (target.kind === 'winston' && this.winston) {
      return { key: 'winston', talk: true, pos: this.winston.dog.root.position.clone().add(new THREE.Vector3(0, 0.62, 0)) };
    }
    if (target.kind === 'npc' && this.session.inside && this.homeOli?.visible && target.npc.def.id === 'oli') {
      return { key: 'npc:oli-home', talk: true, pos: this.homeOli.root.position.clone().add(new THREE.Vector3(0, this.homeOli.sitting ? 0.9 : 1.15, 0)) };
    }
    if (target.kind === 'npc' && this.session.inside && this.guestChars.get(target.npc.def.id)?.visible) {
      const c = this.guestChars.get(target.npc.def.id)!;
      return { key: `npc:${target.npc.def.id}-gast`, talk: true, pos: c.root.position.clone().add(new THREE.Vector3(0, 1.15, 0)) };
    }
    if (target.kind === 'npc') {
      return { key: `npc:${target.npc.def.id}`, talk: true, pos: target.npc.char.root.position.clone().add(new THREE.Vector3(0, target.npc.bubbleHeight, 0)) };
    }
    if (target.kind === 'object') {
      const obj = objectById(this.session.map, target.id);
      if (!obj || obj.kind === 'tree' || obj.kind === 'rock') return null;
      const c = footprintCenter(obj);
      const big = obj.kind === 'house' || obj.kind === 'bistro' || obj.kind === 'praxis';
      const h = big || obj.kind === 'board' ? 1.9 : obj.kind === 'workbench' || obj.kind === 'fountain' ? 1.7 : obj.kind === 'plot' ? 1.3 : 1.25;
      return { key: `obj:${target.id}`, talk: false, pos: new THREE.Vector3(c.x, h, big || obj.kind === 'plot' ? c.z + obj.h / 2 - 0.3 : c.z) };
    }
    if (target.kind === 'katalog') {
      const d = this.lay.desk;
      if (!d) return null;
      return { key: 'katalog', talk: false, pos: this.interior.cellCenter(d[0], d[1]).add(new THREE.Vector3(0, 1.3, 0)) };
    }
    if (target.kind === 'moebel') {
      const model = this.session.inside ? this.modelOf(target.uid) : this.yard.model(target.uid);
      if (!model) return null;
      const box = new THREE.Box3().setFromObject(model.group);
      if (box.isEmpty()) return null;
      const c = box.getCenter(new THREE.Vector3());
      return { key: `moebel:${target.uid}`, talk: false, pos: new THREE.Vector3(c.x, Math.min(box.max.y, 2.2) + 0.35, c.z) };
    }
    if (target.kind === 'beet') {
      return { key: `beet:${target.tile.x},${target.tile.y}`, talk: false, pos: new THREE.Vector3(target.tile.x + 0.5, 0.95, target.tile.y + 0.5) };
    }
    return null;
  }

  /** Symbol blendet weich ein und aus statt aufzuploppen */
  private updateBubble(player: Character, blocked: boolean) {
    const now = performance.now();
    const dt = Math.min(0.1, (now - this.bubbleTime) / 1000);
    this.bubbleTime = now;
    const want = this.bubbleFor(blocked ? null : this.resolveTarget(player));
    if (want && want.key === this.bubbleKey) {
      this.bubbleAlpha = Math.min(1, this.bubbleAlpha + dt * 6);
      this.bubblePos.copy(want.pos);
    } else {
      this.bubbleAlpha = Math.max(0, this.bubbleAlpha - dt * 8);
      if (this.bubbleAlpha === 0) {
        this.bubbleKey = want?.key ?? null;
        if (want) {
          this.bubblePos.copy(want.pos);
          const mat = this.bubble.material as THREE.SpriteMaterial;
          const tex = want.talk ? this.talkTexture : this.useTexture;
          if (mat.map !== tex) {
            mat.map = tex;
            mat.needsUpdate = true;
          }
        }
      }
    }
    const a = this.bubbleAlpha;
    this.bubble.visible = a > 0.01;
    if (!this.bubble.visible) return;
    // weich: ease-out, kleines Überschwingen beim Erscheinen
    const e = 1 - Math.pow(1 - a, 3);
    const s = 0.55 + 0.45 * e + Math.sin(a * Math.PI) * 0.08;
    (this.bubble.material as THREE.SpriteMaterial).opacity = e;
    this.bubble.scale.set(0.5 * s, 0.42 * s, 1);
    this.bubble.position.set(this.bubblePos.x, this.bubblePos.y - (1 - e) * 0.15 + Math.sin(now / 300) * 0.05, this.bubblePos.z);
  }

  private idleNext = IDLE_START;
  private lastIdleAct: IdleAct | null = null;

  /** Steht Lina länger still, macht sie ab und zu etwas Niedliches (Strecken, Summen, Winston kraulen …) */
  private updateIdle(player: Character, blocked: boolean) {
    const idle = player.idleSeconds;
    if (idle < 1) {
      this.idleNext = IDLE_START;
      return;
    }
    if (idle < this.idleNext || player.acting || blocked || this.session.decorActive || this.fishing.active || player.armForward !== undefined) return;
    const w = this.winston;
    const winstonNear = !!w && w.dog.root.visible && !w.sleeping && !w.busy && Math.hypot(w.x - player.x, w.y - player.y) < TILE * 1.6;
    const kind = this.weather.current.kind;
    const act = pickIdleAct(
      {
        hour: this.session.clock().getHours(),
        raining: isPrecipitation(kind) && kind !== 'schnee',
        snowing: kind === 'schnee',
        winter: getSeason(this.session.clock()) === 'winter' || kind === 'schnee',
        inside: this.session.inside,
        winstonNear,
      },
      this.lastIdleAct,
    );
    if (!act) return;
    this.lastIdleAct = act.id;
    this.idleNext = idle + act.duration + IDLE_GAP[0] + Math.random() * (IDLE_GAP[1] - IDLE_GAP[0]);
    if (act.id === 'kraulen' && w) {
      player.faceTowards(w.x, w.y);
      window.setTimeout(() => {
        if (player.acting) w.pet(false);
      }, 700);
    } else if (act.id !== 'wippen' && act.id !== 'regen-fuehlen' && act.id !== 'flocken-fangen') {
      player.face('down');
    }
    player.playAct(act.id, act.duration);
    const emote = act.emote;
    if (emote && act.id !== 'kraulen') {
      const times = act.id === 'summen' ? [400, 2000] : [act.duration * 450];
      for (const ms of times) {
        window.setTimeout(() => {
          if (player.acting) this.popEmote(player.root.position.clone().add(new THREE.Vector3(0.15, 1.45, 0)), emote);
        }, ms);
      }
    }
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
    if (this.session.inside && this.homeOli?.visible) {
      const [hx, hy] = DIRS[player.facing];
      const dx = this.homeOli.x - player.x;
      const dy = this.homeOli.y - player.y;
      const d = Math.hypot(dx, dy);
      const oli = this.npcs.get('oli');
      if (oli && d < TILE * 1.4 && dx * hx + dy * hy > d * 0.3) return { kind: 'npc', npc: oli };
    }
    if (this.session.inside && this.session.visiting) {
      const [hx, hy] = DIRS[player.facing];
      for (const [id, c] of this.guestChars) {
        if (!c.visible) continue;
        const dx = c.x - player.x;
        const dy = c.y - player.y;
        const d = Math.hypot(dx, dy);
        const npc = this.npcs.get(id);
        if (npc && d < TILE * 1.4 && dx * hx + dy * hy > d * 0.3) return { kind: 'npc', npc };
      }
    }
    // Bewohner gehen vor – Winston wird gestreichelt, wenn sonst niemand vor Lina steht
    if (this.session.inside) return this.winstonInFront(player) ? { kind: 'winston' } : this.homeTarget(player);
    const pickup = this.collectibles.pickupNear(tile, player.facing, player.x, player.y);
    if (pickup) return { kind: 'pickup', id: pickup };
    const [fx, fy] = DIRS[player.facing];
    const front = { x: tile.x + fx, y: tile.y + fy };
    // Steht jemand neben/vor der Tür, aber nicht direkt vor Lina, geht die Tür vor (Haus lässt sich weiter betreten)
    const doorId = findInteraction(this.session.map, tile, player.facing, this.interactive);
    const doorObj = doorId ? objectById(this.session.map, doorId) : undefined;
    const isDoor = !!doorId && !!doorObj && doorObj.kind !== 'tree' && doorObj.kind !== 'rock';
    for (const npc of this.npcs.values()) {
      if (!npc.present) continue;
      const dx = npc.x - player.x;
      const dy = npc.y - player.y;
      const d = Math.hypot(dx, dy);
      if (d < TILE * 1.35 && dx * fx + dy * fy > d * 0.35) {
        const directlyInFront = Math.floor(npc.x / TILE) === front.x && Math.floor(npc.y / TILE) === front.y;
        if (isDoor && !directlyInFront) break;
        return { kind: 'npc', npc };
      }
    }
    // Stall direkt davor geht vor (Eier abholen), sonst Tiere streicheln
    const coop = this.yardItemAt(front.x, front.y);
    const coopItem = coop ? this.session.data?.yard.items.find((i) => i.uid === coop) : undefined;
    if (coop && coopItem && coopKindOf(coopItem.itemId)) return { kind: 'moebel', uid: coop };
    const bird = this.animals.nearest(player.x * UNIT, player.y * UNIT, fx, fy);
    if (bird >= 0) return { kind: 'tier', index: bird };
    if (this.garden.isSpot(front)) return { kind: 'beet', tile: front };
    const yardItem = this.yardItemAt(front.x, front.y);
    if (yardItem) return { kind: 'moebel', uid: yardItem };
    const id = findInteraction(this.session.map, tile, player.facing, this.interactive);
    // Türen, Briefkasten & Co. gehen vor – Winston wird gestreichelt, wenn sonst nichts davor ist
    const obj = id ? objectById(this.session.map, id) : undefined;
    if (id && obj && obj.kind !== 'tree' && obj.kind !== 'rock') return { kind: 'object', id };
    if (this.winstonInFront(player)) return { kind: 'winston' };
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
    if (tool === 'schaufel' && target?.kind !== 'npc' && target?.kind !== 'winston' && this.dig()) return;
    if (tool === 'netz' && target?.kind !== 'npc' && this.swingNet()) return;
    if (tool === 'angel' && (!target || target.kind === 'flowers') && this.castRod()) return;
    if (target) this.act(target);
    else if (tool === 'netz') this.swingNet(true);
    else if (tool === 'angel') this.session.bus.emit('toast', { text: 'Stell dich ans Wasser und schau aufs Wasser, dann kannst du auswerfen. 🎣' });
    else if (tool === 'giesskanne') this.session.bus.emit('toast', { text: 'Gießen kannst du die Pflanzen in deinem Beet. 🌱' });
    else if (tool === 'schaufel') this.session.bus.emit('toast', { text: 'Hier ist nichts. Such nach kleinen Rissen im Boden, die funkeln! ✨' });
  }

  /** Mit der Schaufel an einer Grabstelle graben (vor Lina oder unter ihr) */
  private dig(): boolean {
    const player = this.player;
    if (!player || this.digging) return this.digging;
    const t = player.tile;
    const [fx, fy] = DIRS[player.facing];
    const spot = this.digSpots.spotAt(t.x + fx, t.y + fy) ?? this.digSpots.spotAt(t.x, t.y);
    if (!spot) return false;
    this.digging = true;
    this.session.bus.emit('sfx', 'graben');
    this.fxAt('erde', (spot.x + 0.5) * TILE, (spot.y + 0.5) * TILE);
    player.faceTowards((spot.x + 0.5) * TILE, (spot.y + 0.5) * TILE);
    const tool = this.held?.model.group;
    this.tweens.add(700, (k) => {
      if (tool) tool.rotation.x = 0.9 + Math.sin(k * Math.PI * 3) * 0.6;
      player.armForward = -0.35 - Math.abs(Math.sin(k * Math.PI * 3)) * 0.5;
    }, () => {
      if (tool) tool.rotation.x = 0.9;
      player.armForward = -0.35;
      this.digging = false;
      const res = digSpot(this.session, spot);
      if (!res) return;
      if (res.full) {
        this.session.bus.emit('toast', { text: 'Deine Tasche ist voll! 🎒' });
        return;
      }
      const f = FIND_BY_ID[res.itemId];
      this.fxAt('erde', (spot.x + 0.5) * TILE, (spot.y + 0.5) * TILE);
      window.setTimeout(() => {
        this.fxAt('funkeln', (spot.x + 0.5) * TILE, (spot.y + 0.5) * TILE);
        player.cheer();
      }, 200);
      this.digSpots.refresh();
      this.winston?.burst('note');
      this.session.bus.emit('toast', {
        text: `${f?.kind === 'fossil' ? '🦴 Ein Fossil!' : '💎 Ein Kristall!'} ${f?.name ?? res.itemId} ausgegraben${res.isNew ? ' – neu im Sammelbuch!' : '!'}`,
        icon: itemIconUrl(res.itemId),
      });
    });
    return true;
  }

  // -------------------------------------------------------------------------
  // Werkzeuge
  // -------------------------------------------------------------------------

  private onKey(code: string) {
    if (!this.player || this.session.uiBlocking || this.cutscene) return;
    if (this.session.decorActive) return; // beim Einrichten gehören die Zifferntasten den Farben
    const idx = ['Digit1', 'Digit2', 'Digit3', 'Digit4'].indexOf(code);
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
    const model = tool === 'angel' ? makeRod() : tool === 'netz' ? makeNet() : tool === 'schaufel' ? makeShovel() : makeCan();
    model.group.rotation.x = tool === 'angel' ? 0.2 : tool === 'netz' ? 0.6 : tool === 'schaufel' ? 0.9 : 1.2;
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
    const splashAt = water.point.clone();
    window.setTimeout(() => {
      this.session.bus.emit('sfx', 'platsch');
      this.particles.burst('platsch', splashAt);
    }, 450);
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
    this.session.bus.emit('sfx', 'fang');
    if (player) {
      const bob = this.fishing.bobberPosition();
      if (bob) this.particles.burst('platsch', bob);
      window.setTimeout(() => {
        player.cheer();
        this.fxAt('funkeln', player.x, player.y);
      }, 250);
    }
    const result = catchFish(this.session, fish);
    // Beschreibung nur beim ersten Fang (neu im Sammelbuch) – sonst nur kurz oben melden, ohne Unterbrechung
    if (result.isNew) this.session.bus.emit('dialog:open', { title: fish.name, lines: [...catchMessage(fish.name, 'fisch', result), FISH_BY_ID[fish.id].description] });
    else this.session.bus.emit('toast', { text: catchMessage(fish.name, 'fisch', result).join(' '), icon: itemIconUrl(fish.id) });
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
    this.session.bus.emit('sfx', 'kescher');
    this.tweens.add(320, (k) => (player.armForward = -2.4 + k * 2.0), () => (player.armForward = this.held ? -0.35 : undefined));
    if (!key) return true;
    const to = new THREE.Vector3(player.x * UNIT + fx * 0.5, 0.6, player.y * UNIT + fy * 0.5);
    const def = this.insects.take(key, to);
    if (!def) return true;
    window.setTimeout(() => {
      this.session.bus.emit('sfx', 'fang');
      this.particles.burst('funkeln', to);
      player.cheer();
      const result = catchInsect(this.session, def);
      // Kescher: immer nur kurz oben melden (wie beim Blumenpflücken) – Lina läuft einfach weiter.
      // Die Beschreibung steht im Sammelbuch.
      this.session.bus.emit('toast', { text: catchMessage(def.name, 'insekt', result).join(' '), icon: itemIconUrl(def.id) });
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
            this.session.bus.emit('toast', { text: isFrozen(this.session, t.x, t.y) ? 'Eingepflanzt! Im Winter ruht das Beet – im Frühling oder im Gewächshaus geht es los. ❄️' : 'Eingepflanzt! Jetzt noch gießen. 💧' });
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
        const text = got.crop
          ? `${itemCountLabel(got.flower, got.count)} geerntet${got.seed ? ' – und ein paar Samen gefunden! 🌱' : '! 🧺'}`
          : got.crossed
            ? `${name} gepflückt – und ein Misch-Same ist abgefallen! ✨`
            : got.seed
              ? `${name} gepflückt – und ein paar Samen gefunden! 🌱`
              : `${name} gepflückt! 💐`;
        this.session.bus.emit('toast', { text, icon: itemIconUrl(got.crossed && got.seedId ? got.seedId : got.flower) });
        if (got.crossed) this.fxAt('funkeln', (t.x + 0.5) * TILE, (t.y + 0.5) * TILE, 0.3);
      }
      return;
    }
    if (this.session.tool === 'giesskanne' && isFrozen(this.session, t.x, t.y)) {
      this.session.bus.emit('toast', { text: 'Die Erde ist gefroren – im Winter ruht das Beet. Im Gewächshaus wächst es weiter. ❄️' });
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
    const stage = (CROP_BY_ID[plant.flower] ? ['ist frisch eingesät', 'keimt', 'wächst kräftig heran'] : ['ist frisch eingepflanzt', 'keimt', 'hat eine Knospe'])[plant.stage];
    const watered = isFrozen(this.session, t.x, t.y)
      ? 'Im Winter ruht das Beet. Erst im Frühling wächst sie weiter – oder in einem Frühbeet oder Gewächshaus. ❄️'
      : isWatered(plant, day)
        ? 'Heute schon gegossen. 💧'
        : 'Mit der Gießkanne (Taste 3) gießen, dann wächst sie bis morgen. 💧';
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
        if (this.winston?.stranded) this.rescueWinston();
        else this.petDog();
        return;
      case 'tier': {
        const kind = this.animals.pet(target.index, player.x * UNIT, player.y * UNIT);
        const pos = this.animals.birdPosition(target.index);
        if (pos) player.faceTowards(pos.x / UNIT, pos.z / UNIT);
        if (kind) {
          const sounds = COOPS[kind].sounds;
          this.session.bus.emit('toast', { text: sounds[Math.floor(Math.random() * sounds.length)] });
        }
        return;
      }
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
      this.doorTransition('up', () => this.enterHome(), 'up');
      return;
    }
    if (id === 'haus-thalia') {
      this.knockAtHome('thalia');
      return;
    }
    if (id === 'praxis-lars') {
      this.visitPraxis();
      return;
    }
    if (id === 'bistro-jens') {
      this.visitBistro();
      return;
    }
    if (id === 'punschstand') {
      this.visitPunsch();
      return;
    }
    if (id === 'samenstand') {
      this.session.bus.emit('ui:open', { kind: 'samenstand' });
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
    if (npc.present) lines = [`${npc.def.name}s Häuschen.`, 'Niemand zu Hause. Auf einem Zettel steht: „Bin unterwegs. Die Tür ist offen – aber nichts anfassen!“'];
    else lines = pick(npc.isSleeping ? npc.def.dialogue.atHomeSleeping : npc.def.dialogue.atHome);
    // Besuch: nur, wenn gerade niemand schläft
    const houseId = Object.keys(GUEST_HOUSES).find((k) => GUEST_HOUSES[k].npc === npcId || (k === 'haus-olaf' && (npcId === 'olaf' || npcId === 'christin')));
    const canVisit = !!houseId && !npc.isSleeping;
    this.session.bus.emit('dialog:open', {
      title: `${npc.def.name}s Häuschen`,
      lines: lines.map((l) => fillPlaceholders(l, ctx)),
      ...(canVisit && houseId
        ? { choices: [{ label: '🚪 Hineingehen', onSelect: () => this.doorTransition('up', () => this.enterGuest(houseId), 'up') }, { label: 'Lieber nicht', onSelect: () => undefined }] }
        : {}),
    });
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
    const guest = this.session.visiting ? this.guestChars.get(npc.def.id) : undefined;
    if (guest?.visible) {
      player.faceTowards(guest.x, guest.y);
      guest.faceTowards(player.x, player.y);
      guest.wave();
    } else if (this.homeOli?.visible && npc.def.id === 'oli') {
      player.faceTowards(this.homeOli.x, this.homeOli.y);
      if (!this.homeOli.sitting) {
        this.homeOli.faceTowards(player.x, player.y);
        this.homeOli.wave();
      }
    } else {
      player.faceTowards(npc.x, npc.y);
      if (!npc.char.sitting) npc.char.wave();
    }
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
    // Bei einem Treffen: erst mal zuhören, was die anderen erzählen
    const meet = meetupOf(this.session, npc.def.id);
    if (meet && data?.world.dates[`treffen:${meet.id}`] !== this.session.today()) {
      talkToNpc(this.session, npc.def.id);
      this.session.bus.emit('dialog:open', {
        title: meet.name,
        hearts: npcHearts(this.session, npc.def.id),
        lines: joinMeetup(this.session, meet),
        choices: [
          { label: `💬 Mit ${npc.def.name} reden`, onSelect: () => this.npcDialog(npc, [meetupReply(this.session, meet, npc.def.id)], npcHearts(this.session, npc.def.id)) },
          { label: '👋 Weiter', onSelect: () => npc.endTalk() },
        ],
      });
      return;
    }
    const chatLead = this.chatLead(npc);
    const out = talkToNpc(this.session, npc.def.id);
    const teaser = wishTeaser(this.session, npc.def.id);
    // Läuft gerade ein Treffen, geht der Bewohner zuerst auf das Gespräch mit den anderen ein
    const lead = meet ? [meetupReply(this.session, meet, npc.def.id)] : [];
    this.npcDialog(npc, [...chatLead, ...lead, ...(teaser ? [...out.lines, teaser] : out.lines)], out.hearts);
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
        ...(id === 'oli' && canKiss(this.session)
          ? [
              {
                label: '😘 Küsschen geben',
                onSelect: () => {
                  const c = this.homeOli?.visible ? this.homeOli : npc.char;
                  this.kissScene(c, () => this.npcDialog(npc, giveKiss(this.session, this.kissCount++), npcHearts(this.session, id)));
                },
              },
            ]
          : []),
        ...(id === 'oli'
          ? (['picknick', 'sterne', 'herzbank'] as const)
              .filter((k) => canDate(this.session, k))
              .map((k) => ({
                label: k === 'picknick' ? '🧺 Picknick machen' : k === 'herzbank' ? '🌅 Zur Herzbank' : '🌠 Sterne gucken',
                onSelect: () => {
                  npc.endTalk();
                  this.dateScene(k);
                },
              }))
          : []),
        ...(activeWish(this.session, id) ? [{ label: '💭 Herzenswunsch', onSelect: () => this.wishDialog(npc) }] : []),
        ...(id === 'oli' && nextStageScene(this.session)
          ? [
              {
                label: '💬 Zeit zu zweit',
                onSelect: () => {
                  const scene = playStageScene(this.session);
                  if (!scene) return this.npcDialog(npc, ['Ich bin gleich bei dir, Lini.'], npcHearts(this.session, id));
                  this.session.bus.emit('dialog:open', {
                    title: scene.title,
                    hearts: npcHearts(this.session, id),
                    lines: scene.lines,
                    onClose: () => this.npcDialog(npc, ['Das war schön, Lini. 💕'], npcHearts(this.session, id)),
                  });
                },
              },
            ]
          : []),
        ...(id === 'thalia' && isPartyTime(this.session) && this.session.data?.world.dates.party !== this.session.today()
          ? [{ label: '💃 Tanzen!', onSelect: () => this.dance(npc) }]
          : []),
        ...(id === 'lars'
          ? [
              ...(this.session.data?.world.dates.checkup !== this.session.today() ? [{ label: '🩺 Durchchecken lassen', onSelect: () => this.checkup(npc) }] : []),
              {
                label: '🌿 Apotheke',
                onSelect: () => {
                  npc.endTalk();
                  this.session.bus.emit('ui:open', { kind: 'apotheke' });
                },
              },
            ]
          : []),
        ...(id === 'christin' && canFolkDance(this.session) ? [{ label: '🪗 Volkstanz tanzen', onSelect: () => this.folkDanceScene(npc) }] : []),
        ...(id === 'christin'
          ? [{ label: '💡 Ordnungstipp?', onSelect: () => this.npcDialog(npc, [...christinTip(this.session)], npcHearts(this.session, id)) }]
          : []),
        ...(id === 'jens'
          ? [
              {
                label: '🍳 Zusammen kochen',
                onSelect: () => {
                  npc.endTalk();
                  this.session.bus.emit('ui:open', { kind: 'kochstudio' });
                },
              },
              {
                label: '🖼️ Galerie',
                onSelect: () => {
                  npc.endTalk();
                  this.session.bus.emit('ui:open', { kind: 'galerie' });
                },
              },
            ]
          : []),
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

  /** Herzenswunsch: erzählen lassen, Stand zeigen, erfüllen (`game/wishes.ts`) */
  private wishDialog(npc: Npc) {
    const id = npc.def.id;
    const asked = askWish(this.session, id);
    if (!asked) return this.npcDialog(npc, ['Ach, mir fehlt gerade gar nichts. Du bist ja da!'], npcHearts(this.session, id));
    this.session.bus.emit('dialog:open', {
      title: npc.def.name,
      hearts: npcHearts(this.session, id),
      lines: asked.lines.map((l) => fillPlaceholders(l, this.session.interactionContext())),
      choices: [
        ...(asked.canFulfill
          ? asked.options.length > 0
            ? asked.options.map((o) => ({ label: `💝 ${o.label}`, onSelect: () => this.fulfillWishScene(npc, o.id) }))
            : [{ label: '💝 Wunsch erfüllen', onSelect: () => this.fulfillWishScene(npc) }]
          : []),
        { label: asked.canFulfill ? '⏳ Später' : '👍 Mach ich!', onSelect: () => this.npcDialog(npc, [asked.canFulfill ? 'Kein Problem – wann immer du magst.' : 'Danke, Lina! Ganz ohne Eile.'], npcHearts(this.session, id)) },
      ],
    });
  }

  private fulfillWishScene(npc: Npc, optionId?: string) {
    const id = npc.def.id;
    const wish = activeWish(this.session, id);
    const result = fulfillWish(this.session, id, optionId);
    const lines = result?.lines;
    if (!wish || !result || !lines) return this.npcDialog(npc, ['Hm, da fehlt wohl doch noch was. Macht nichts!'], npcHearts(this.session, id));
    this.syncMapObjects();
    this.session.bus.emit('sfx', 'bauen');
    this.session.bus.emit('fx', { kind: 'konfetti' });
    this.session.bus.emit('fx', { kind: 'herzen', npc: id });
    this.winston?.burst('herz');
    this.session.bus.emit('dialog:open', {
      title: npc.def.name,
      hearts: npcHearts(this.session, id),
      lines: lines.map((l) => fillPlaceholders(l, this.session.interactionContext())),
      onClose: () => {
        npc.endTalk();
        for (const r of result.rewards) for (let i = 0; i < r.count; i++) this.giveOrDrop(r.itemId);
        const gift = result.rewards.map((r) => itemDef(r.itemId)?.name ?? r.itemId).join(', ');
        this.session.bus.emit('toast', {
          text: wish.place ? `✨ Neu im Dorf: ${wish.title}! Schau doch gleich mal vorbei.` : gift ? `🎁 ${gift} – als Dank für „${wish.title}“!` : `✨ Wunsch erfüllt: ${wish.title}!`,
        });
      },
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

  /** Kamera ziehen beim Einrichten: Position beim letzten Ereignis; `moved` = wirklich gezogen (dann kein Klick) */
  private panDrag: { x: number; y: number; moved: boolean; sx: number; sy: number } | null = null;

  private onPointerDown = (e: PointerEvent) => {
    if (e.button === 0) this.pointerDown = { x: e.clientX, y: e.clientY };
    // Einrichten im Haus: Maus ziehen schwenkt die Kamera (links ohne Möbel in der Hand, sonst rechts/Mitte)
    if (this.session.decorActive && (!this.session.inside || this.houseWide()) && (e.button === 1 || e.button === 2 || (e.button === 0 && !this.decor))) {
      this.panDrag = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, moved: false };
    }
  };

  /** Bodenpunkt unter einer Bildschirmposition (für „den Boden greifen und ziehen“) */
  private groundPoint(clientX: number, clientY: number): THREE.Vector3 | null {
    const r = this.canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    return this.raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), new THREE.Vector3());
  }

  /** Kameraschwenk beim Einrichten setzen – im Haus um die Stockwerksmitte, im Garten um Lina, immer innerhalb der Grenzen */
  private setDecorPan(x: number, z: number) {
    if (this.session.inside) {
      const size = planSize(this.houseView.plan);
      this.decorPan.x = Math.max(-size.w / 2, Math.min(size.w / 2, x));
      this.decorPan.z = Math.max(-size.h / 2, Math.min(size.h / 2, z));
      return;
    }
    const p = this.player;
    const bx = p ? p.x * UNIT : YARD_AREA.x;
    const bz = p ? p.y * UNIT : YARD_AREA.y;
    // Die Kamera bleibt über dem Gartenbereich
    this.decorPan.x = Math.max(YARD_AREA.x - bx, Math.min(YARD_AREA.x + YARD_AREA.w - bx, x));
    this.decorPan.z = Math.max(YARD_AREA.y - bz, Math.min(YARD_AREA.y + YARD_AREA.h - bz, z));
  }

  private dragCamera(e: PointerEvent) {
    const d = this.panDrag;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 6) return;
    d.moved = true;
    const a = this.groundPoint(d.x, d.y);
    const b = this.groundPoint(e.clientX, e.clientY);
    d.x = e.clientX;
    d.y = e.clientY;
    if (!a || !b) return;
    const ox = this.decorPan.x;
    const oz = this.decorPan.z;
    this.setDecorPan(ox + (a.x - b.x), oz + (a.z - b.z));
    // Kamera sofort mitnehmen (nicht erst über die weiche Annäherung), sonst „rutscht“ der gegriffene Punkt weg
    this.camTarget.x += this.decorPan.x - ox;
    this.camTarget.z += this.decorPan.z - oz;
    this.canvas.style.cursor = 'grabbing';
  }

  private onPointerMove = (e: PointerEvent) => {
    if (this.panDrag) {
      if (e.buttons === 0) this.panDrag = null;
      else {
        this.dragCamera(e);
        if (this.panDrag?.moved) return;
      }
    }
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
    if (this.session.decorActive) {
      this.hoverCell = this.yardCellAt(e);
      this.updateGhost();
      const yard = this.session.data?.yard;
      const t = this.hoverCell && yard ? this.yard.topAt(yard, this.hoverCell.x, this.hoverCell.y) : null;
      this.canvas.style.cursor = this.decor ? 'grabbing' : t ? 'grab' : '';
      return;
    }
    const hit = this.pick(e);
    this.canvas.style.cursor = hit.npc || hit.objectId || hit.winston ? 'pointer' : '';
  };

  private onPointerUp = (e: PointerEvent) => {
    const down = this.pointerDown;
    this.pointerDown = null;
    // Nach dem Ziehen der Kamera kein Klick (nichts aufheben/abstellen)
    if (this.panDrag?.moved) {
      this.panDrag = null;
      return;
    }
    this.panDrag = null;
    const player = this.player;
    if (!player || !down || this.cutscene || !this.session.acceptsPointer()) return;
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) return;
    if (this.session.inside) {
      this.hoverCell = this.roomCellAt(e);
      if (this.session.decorActive) this.decorClick();
      else this.roomClick();
      return;
    }
    if (this.session.decorActive) {
      this.hoverCell = this.yardCellAt(e);
      this.decorClick();
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
  // Oli
  // -------------------------------------------------------------------------

  /** Oli drinnen zeigen, wenn er zu Hause ist: am Schreibtisch, an der Kaffeemaschine, auf dem Futon … */
  private updateHomeOli(dtMs: number) {
    const oli = this.npcs.get('oli');
    const room = this.room;
    const show = !!oli && oli.movedIn && this.session.inside && !this.session.visiting && oli.atHome && !!room && !this.cutscene;
    if (!show || !oli || !room) {
      if (this.homeOli) this.homeOli.setVisible(false);
      this.homeOliKey = '';
      return;
    }
    if (!this.homeOli) {
      const day = this.session.today();
      this.homeOli = new Character(this.scene, dressFor(oli.def.appearance, wardrobeFor(this.session, oli.def), day, oli.def.id), 0, 0, 'down', () => 0, this.session.season, day);
      this.homeOli.speedFactor = 0.7;
    }
    const c = this.homeOli;
    const label = oli.currentEntry?.label ?? '';
    const floorItems = this.houseView.plan.rooms.map((r) => JSON.stringify(this.roomData(r.id)?.items ?? []));
    const key = `${this.houseView.plan.id}|${label}|${oli.isSleeping}|${floorItems.join('#')}`;
    if (key !== this.homeOliKey) {
      this.homeOliKey = key;
      const spot = this.homeOliSpot(label, oli.isSleeping);
      if (!spot) {
        c.setVisible(false);
        return;
      }
      c.setVisible(true);
      c.setSitting(false);
      c.teleport((ROOM_X + spot.x) * TILE, (ROOM_Y + spot.y) * TILE); // spot ist im Gesamtgitter
      if (spot.lie !== undefined) {
        c.setSitting(true);
        c.seatHeight = spot.lie;
        this.homeOliBench = spot.work === 'stemmen' ? spot.uid ?? '' : '';
        if (spot.work) {
          c.work = spot.work;
          c.face(spot.facing);
          c.sync(0);
        }
      } else c.face(spot.facing);
    }
    const walkSolid = this.floorSolid;
    if (c.visible) c.update(dtMs, { dx: 0, dy: 0, run: false }, this.homeOliWalk ? walkSolid : () => true);
    // Bankdrücken: die Langhantel geht mit Olis Armen auf und ab (gleicher Takt wie die Pose)
    if (this.homeOliBench && c.work === 'stemmen') {
      const bell = this.modelOf(this.homeOliBench)?.group.getObjectByName('langhantel');
      if (bell) bell.position.y = 0.86 - (1 - (Math.sin(c.clock * 2.2) + 1) / 2) * 0.13;
    }
    // ab und zu einfach so ein Küsschen, wenn Lina in der Nähe herumsteht
    const player = this.player;
    const now = performance.now();
    if (!this.nextSpontaneousKiss) this.nextSpontaneousKiss = now + 60_000 + Math.random() * 120_000;
    if (player && c.visible && !c.sitting && !oli.isSleeping && !player.moving && !this.kissBusy && !this.session.uiBlocking && !this.session.decorActive && now > this.nextSpontaneousKiss) {
      this.nextSpontaneousKiss = now + 150_000 + Math.random() * 180_000;
      if (Math.hypot(player.x - c.x, player.y - c.y) < TILE * 3.5) this.homeOliComes(SPONTANEOUS_KISS_LINES);
    }
  }

  /**
   * Zu Besuch: Ist die Bewohnerin / der Bewohner gerade zu Hause (und wach), steht sie/er im Zimmer und lässt sich
   * ansprechen. Beim Besuch bei Olaf & Christin sind beide da, wenn sie beide zu Hause sind.
   */
  private updateGuestResidents(dtMs: number) {
    const house = this.session.inside && this.session.visiting ? GUEST_HOUSES[this.session.visiting] : undefined;
    const owners = house ? (this.session.visiting === 'haus-olaf' ? ['olaf', 'christin'] : [house.npc]) : [];
    const day = this.session.today();
    owners.forEach((id, i) => {
      const npc = this.npcs.get(id);
      const want = !!npc && npc.movedIn && npc.atHome && !npc.isSleeping && !this.cutscene;
      let c = this.guestChars.get(id);
      if (!want || !npc) {
        if (c?.visible) c.setVisible(false);
        return;
      }
      if (!c) {
        c = new Character(this.scene, dressFor(npc.def.appearance, wardrobeFor(this.session, npc.def), day, id), 0, 0, 'down', () => 0, this.session.season, day);
        c.speedFactor = 0.7;
        c.setVisible(false); // wird gleich unten an ihren Platz gestellt
        this.guestChars.set(id, c);
      }
      if (!c.visible) {
        const free = nearestWalkable(this.roomGrid(), { x: i === 0 ? 5 : 2, y: 2 });
        c.setVisible(true);
        c.setSitting(false);
        c.teleport((ROOM_X + (free?.x ?? 4)) * TILE + 32, (ROOM_Y + (free?.y ?? 2)) * TILE + 40);
        c.face('down');
      }
      c.update(dtMs, { dx: 0, dy: 0, run: false }, () => true);
    });
    // nicht (mehr) zu Besuch: alle ausblenden
    for (const [id, c] of this.guestChars) if (c.visible && !owners.includes(id)) c.setVisible(false);
  }

  /** Oli kommt im Zimmer zu Lina und gibt ihr ein Küsschen */
  private homeOliComes(lines: readonly string[]): boolean {
    const c = this.homeOli;
    const oli = this.npcs.get('oli');
    const player = this.player;
    const room = this.room;
    if (!c?.visible || !oli || !player || !room || c.sitting || oli.isSleeping || this.kissBusy || this.cutscene || this.session.uiBlocking) return false;
    this.kissBusy = true;
    const done = () => {
      this.homeOliWalk = false;
      const line = lines[Math.floor(Math.random() * lines.length)];
      this.kissScene(c, () => {
        this.session.bus.emit('toast', { text: line });
        this.kissBusy = false;
      });
    };
    const grid = this.roomGrid();
    const from = { x: c.tile.x - ROOM_X, y: c.tile.y - ROOM_Y };
    const to = { x: player.tile.x - ROOM_X, y: player.tile.y - ROOM_Y };
    const path = Math.hypot(from.x - to.x, from.y - to.y) < 1.5 ? [] : findPath(grid, from, to);
    if (!path) {
      this.kissBusy = false;
      return false;
    }
    path.pop(); // nicht auf Lina drauf
    if (path.length === 0) {
      done();
      return true;
    }
    this.homeOliWalk = true;
    c.followPath(path.map((t) => ({ x: t.x + ROOM_X, y: t.y + ROOM_Y })), done);
    // Sicherheitsnetz, falls er irgendwo hängen bleibt
    window.setTimeout(() => {
      if (this.homeOliWalk) {
        c.cancelPath();
        done();
      }
    }, 7000);
    return true;
  }

  /**
   * Küsschen: Lina tritt nah heran, beide beugen sich vor (Augen zu), Lina auf den Zehenspitzen,
   * „Mwah“, Herzchen. `then` läuft danach.
   */
  private kissScene(oli: Character, then: () => void) {
    const player = this.player;
    if (!player) return then();
    this.kissBusy = true;
    player.cancelPath();
    oli.cancelPath();
    const dx = player.x - oli.x;
    const dy = player.y - oli.y;
    const d = Math.hypot(dx, dy) || 1;
    // Abstand so, dass sich nur die Gesichter fast berühren (beide beugen sich vor, die Köpfe dürfen nicht ineinander stecken)
    const want = TILE * KISS_DISTANCE;
    const sx = player.x;
    const sy = player.y;
    const tx = oli.x + (dx / d) * want;
    const ty = oli.y + (dy / d) * want;
    this.tweens.add(260, (k) => player.teleport(sx + (tx - sx) * k, sy + (ty - sy) * k), () => {
      player.faceTowards(oli.x, oli.y);
      oli.faceTowards(player.x, player.y);
      window.setTimeout(() => {
        player.kiss(true);
        if (!oli.sitting) oli.kiss();
        window.setTimeout(() => {
          this.session.bus.emit('sfx', 'kuss');
          const mx = (player.x + oli.x) / 2;
          const my = (player.y + oli.y) / 2;
          this.fxAt('herzen', mx, my, -0.25, 0.1);
        }, KISS * 350);
        window.setTimeout(() => {
          this.kissBusy = false;
          then();
        }, KISS * 1000 + 100);
      }, 180);
    });
  }

  /** Modell eines Möbels in irgendeinem Raum des Stockwerks */
  private modelOf(uid: string) {
    for (const [, v] of this.houseView.all()) {
      const m = v.model(uid);
      if (m) return m;
    }
    return null;
  }

  /** Wo steht Oli gerade im Haus? (Gesamtgitter, Feldmitte = +0.5) – er geht an den passenden Platz in irgendeinem Raum */
  private homeOliSpot(label: string, sleeping: boolean): { x: number; y: number; facing: 'up' | 'down' | 'left' | 'right'; lie?: number; work?: 'tippen' | 'stemmen'; uid?: string } | null {
    // alle Räume des Stockwerks mit ihrer Lage; das Schlafzimmer zuerst (Betten stehen dort), dann das Wohnzimmer
    const rooms = this.houseView.plan.rooms
      .map((r) => ({ id: r.id, data: this.roomData(r.id), ox: (this.houseView.view(r.id)?.origin.x ?? ROOM_X) - ROOM_X, oy: (this.houseView.view(r.id)?.origin.z ?? ROOM_Y) - ROOM_Y, layout: this.layoutFor(r.id) }))
      .filter((r): r is typeof r & { data: Room } => !!r.data)
      .sort((a, b) => (a.id === 'schlafzimmer' ? -1 : b.id === 'schlafzimmer' ? 1 : a.id === 'haupt' ? -1 : b.id === 'haupt' ? 1 : 0));
    const grid = this.roomGrid();
    const findIn = (pred: (id: string) => boolean) => {
      for (const r of rooms) {
        const item = r.data.items.find((i) => pred(FURNITURE_BY_ITEM[i.itemId]?.def.id ?? ''));
        if (item) return { r, item };
      }
      return undefined;
    };
    if (sleeping) {
      const hit = findIn((id) => id === 'futon' || id === 'bett');
      if (!hit) return null;
      const { r, item: futon } = hit;
      const fp = footprint(FURNITURE_BY_ITEM[futon.itemId].def, futon.rot);
      return { x: r.ox + futon.x + fp.w / 2, y: r.oy + futon.y + fp.d / 2 + 0.15, facing: 'down', lie: (this.modelOf(futon.uid)?.seatY ?? 0.1) + 0.02 };
    }
    const anchorIds = /Kaffee|kocht/.test(label) ? ['herd', 'kaffeemaschine', 'kotatsu', 'chabudai'] : /programmiert/.test(label) ? ['schreibtisch-pc'] : /trainiert/.test(label) ? ['hantelbank'] : [];
    // Felder im Gesamtgitter: begehbar, nicht vor einer Tür/Treppe
    const freeIn = (r: (typeof rooms)[number]) => (x: number, y: number) =>
      x >= 0 && y >= 0 && x < r.layout.w && y < r.layout.h && !grid.isBlocked(r.ox + x, r.oy + y) && !exitAt(r.layout, x, y) && !(r.layout.reserved ?? []).some(([rx, ry]) => rx === x && ry === y);
    // Programmieren: Oli sitzt auf dem Bürostuhl vor dem Rechner; Trainieren: er liegt auf der Hantelbank und stemmt
    const job = /programmiert/.test(label) ? 'schreibtisch-pc' : /trainiert/.test(label) ? 'hantelbank' : null;
    const jobHit = job ? findIn((x) => x === job) : undefined;
    if (jobHit) {
      const { r, item: jobItem } = jobHit;
      const free = freeIn(r);
      const fp0 = footprint(FURNITURE_BY_ITEM[jobItem.itemId].def, jobItem.rot);
      const cx0 = jobItem.x + fp0.w / 2;
      const cy0 = jobItem.y + fp0.d / 2;
      const front: Array<[number, number]> = [[0, 1], [-1, 0], [0, -1], [1, 0]];
      const faces = ['up', 'right', 'down', 'left'] as const;
      const [fx, fy] = front[jobItem.rot];
      if (job === 'schreibtisch-pc') {
        const sx = cx0 + fx * 0.66;
        const sy = cy0 + fy * 0.66;
        if (free(Math.floor(sx), Math.floor(sy))) return { x: r.ox + sx, y: r.oy + sy, facing: faces[jobItem.rot], lie: 0.45, work: 'tippen' };
      } else {
        // Bank liegt entlang der Möbel-X-Achse, der Kopf zeigt zur Hantel (links, −x)
        const ax: Array<[number, number]> = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        const [ux, uy] = ax[jobItem.rot];
        const facesAlong = ['right', 'down', 'left', 'up'] as const;
        return { x: r.ox + cx0 + ux * 0.28, y: r.oy + cy0 + uy * 0.28, facing: facesAlong[jobItem.rot], lie: 0.58, work: 'stemmen', uid: jobItem.uid };
      }
    }
    for (const id of anchorIds) {
      const hit = findIn((x) => x === id);
      if (!hit) continue;
      const { r, item: a } = hit;
      const free = freeIn(r);
      // Kleines steht auf einem Tisch – dann zählt der Tisch
      const base = a.on ? r.data.items.find((i) => i.uid === a.on) ?? a : a;
      const fp = footprint(FURNITURE_BY_ITEM[base.itemId].def, base.rot);
      const around: Array<[number, number, 'up' | 'down' | 'left' | 'right']> = [];
      for (let dx = 0; dx < fp.w; dx++) around.push([base.x + dx, base.y + fp.d, 'up'], [base.x + dx, base.y - 1, 'down']);
      for (let dy = 0; dy < fp.d; dy++) around.push([base.x - 1, base.y + dy, 'right'], [base.x + fp.w, base.y + dy, 'left']);
      const spot = around.find(([x, y]) => free(x, y));
      if (spot) return { x: r.ox + spot[0] + 0.5, y: r.oy + spot[1] + 0.62, facing: spot[2] };
    }
    // sonst: ein freier Platz im Wohnzimmer (immer derselbe)
    const r = rooms.find((x) => x.id === 'haupt') ?? rooms[0];
    if (!r) return null;
    const free = freeIn(r);
    const cx = Math.floor(r.layout.w / 2) + 1;
    const cy = Math.floor(r.layout.h / 2);
    for (let d = 0; d < 6; d++) for (let dx = -d; dx <= d; dx++) for (let dy = -d; dy <= d; dy++) if (free(cx + dx, cy + dy)) return { x: r.ox + cx + dx + 0.5, y: r.oy + cy + dy + 0.62, facing: 'down' };
    return null;
  }

  /** Oli zieht ein: kommt mit Koffer zu Lina */
  private oliArrival() {
    const player = this.player;
    const oli = this.npcs.get('oli');
    const data = this.session.data;
    if (!player || !oli || !data || data.flags.oliBegruesst) return;
    if (this.cutscene || this.session.inside || this.session.uiBlocking) {
      window.setTimeout(() => this.oliArrival(), 4000);
      return;
    }
    this.cutscene = true;
    player.cancelPath();
    const grid = this.session.map.grid;
    const lt = player.tile;
    const meet = nearestWalkable(grid, { x: lt.x + 1, y: lt.y }, lt) ?? lt;
    oli.scriptPlace(nearestWalkable(grid, { x: lt.x + 3, y: lt.y + 4 }, lt) ?? lt);
    let arrived = false;
    const done = () => {
      if (arrived) return;
      arrived = true;
      oli.char.faceTowards(player.x, player.y);
      player.faceTowards(oli.x, oli.y);
      const ctx = this.session.interactionContext();
      this.session.bus.emit('dialog:open', {
        title: oli.def.name,
        lines: OLI_WELCOME.map((l) => fillPlaceholders(l, ctx)),
        onClose: () => {
          this.giveOrDrop('schreibtisch-pc');
          this.giveOrDrop('hantelbank');
          // Oli startet mit einem Herz (und schickt gleich seinen ersten Herz-Brief)
          addFriendship(this.session, 'oli', 40);
          this.session.setFlag('oliBegruesst');
          this.session.save();
          oli.scriptDone();
          this.cutscene = false;
          this.winston?.pet(false);
        },
      });
    };
    oli.scriptWalkTo(meet, done);
    window.setTimeout(() => {
      if (arrived) return;
      oli.scriptPlace(meet);
      done();
    }, 12000);
  }

  /** Am Bistro: drinnen kochen, wenn Jens da ist – sonst ein Schild */
  private visitBistro() {
    const jens = this.npcs.get('jens');
    if (!jens) return;
    const title = 'Chez Jens';
    if (jens.away) {
      // Jens ist verreist – aber kochen darf Lina trotzdem: Der Schlüssel liegt unter der Fußmatte.
      this.session.bus.emit('dialog:open', {
        title,
        lines: [
          'An der Tür hängt ein Schild:',
          '„Bin auf Reisen! ✈️ Postkarte kommt. Der Schlüssel fürs Kochstudio liegt unter der Fußmatte – koch was Schönes, chérie! Bisous, Jens“',
          'Gekocht wird natürlich auch zu Hause an deiner Küchenzeile.',
        ],
        choices: [
          { label: '🍳 Ins Kochstudio', onSelect: () => this.session.bus.emit('ui:open', { kind: 'kochstudio' }) },
          { label: '👋 Später', onSelect: () => undefined },
        ],
      });
      return;
    }
    if (jens.isSleeping) {
      this.session.bus.emit('dialog:open', { title, lines: [...jens.def.dialogue.atHomeSleeping[0]] });
      return;
    }
    // Sonntagsessen bei Jens zu Hause
    if (isDinnerTime(this.session)) {
      if (this.session.data?.world.dates.essen === this.session.today()) {
        this.session.bus.emit('dialog:open', { title, lines: ['Drinnen wird gelacht und mit Gläsern geklirrt.', '„Lina, chérie, du warst doch grad schon da! Nächsten Sonntag wieder, gell?“'] });
        return;
      }
      this.session.bus.emit('dialog:open', {
        title,
        lines: ['Aus dem Haus duftet es herrlich, drinnen wird gelacht.', '„Lina! Komm rein, komm rein – mir sitzen schon alle am Tisch!“'],
        choices: [
          { label: '🍽️ Reingehen & mitessen', onSelect: () => this.doorTransition('up', () => this.sundayDinner(jens), 'down') },
          { label: '👋 Später', onSelect: () => undefined },
        ],
      });
      return;
    }
    this.session.bus.emit('dialog:open', {
      title,
      lines: jens.atHome ? ['„Komm rein, chérie! Kochen oder Kunst gucken?“'] : ['„Bonjour! Das Kochstudio ist offen – und die Galerie auch!“'],
      choices: [
        { label: '🍳 Kochstudio', onSelect: () => this.session.bus.emit('ui:open', { kind: 'kochstudio' }) },
        { label: '🖼️ Galerie', onSelect: () => this.session.bus.emit('ui:open', { kind: 'galerie' }) },
        { label: '🚪 Hineingehen', onSelect: () => this.doorTransition('up', () => this.enterGuest('bistro-jens'), 'up') },
        { label: '👋 Tschüss', onSelect: () => undefined },
      ],
    });
  }

  /** Jens eröffnet sein Bistro und begrüßt Lina */
  private jensArrival() {
    this.npcArrival('jens', JENS_WELCOME, -1);
  }

  /** Lars eröffnet seine Praxis und begrüßt Lina (und schenkt ihr Kräutersamen) */
  private larsArrival() {
    this.npcArrival('lars', LARS_WELCOME, 1, () => {
      this.giveOrDrop('samen-kamille', 2);
      this.giveOrDrop('samen-pfefferminze', 2);
    });
  }

  /** Einzugsszene: Bewohner kommt zu Lina, sagt Hallo; `side` = von links (-1) oder rechts (1) */
  private npcArrival(id: string, welcome: readonly string[], side: number, after?: () => void) {
    const player = this.player;
    const npc = this.npcs.get(id);
    const data = this.session.data;
    const flag = `${id}Begruesst`;
    if (!player || !npc || !data || data.flags[flag]) return;
    if (this.cutscene || this.session.inside || this.session.uiBlocking) {
      window.setTimeout(() => this.npcArrival(id, welcome, side, after), 4000);
      return;
    }
    this.cutscene = true;
    player.cancelPath();
    const grid = this.session.map.grid;
    const lt = player.tile;
    const meet = nearestWalkable(grid, { x: lt.x + side, y: lt.y }, lt) ?? lt;
    npc.scriptPlace(nearestWalkable(grid, { x: lt.x + side * 3, y: lt.y + 4 }, lt) ?? lt);
    let arrived = false;
    const done = () => {
      if (arrived) return;
      arrived = true;
      npc.char.faceTowards(player.x, player.y);
      player.faceTowards(npc.x, npc.y);
      const ctx = this.session.interactionContext();
      this.session.bus.emit('dialog:open', {
        title: npc.def.name,
        lines: welcome.map((l) => fillPlaceholders(l, ctx)),
        onClose: () => {
          after?.();
          this.session.setFlag(flag);
          this.session.save();
          npc.scriptDone();
          this.cutscene = false;
        },
      });
    };
    npc.scriptWalkTo(meet, done);
    window.setTimeout(() => {
      if (arrived) return;
      npc.scriptPlace(meet);
      done();
    }, 12000);
  }

  /** An der Praxis: Apotheke, wenn Lars da ist – sonst ein Schild */
  private visitPraxis() {
    const lars = this.npcs.get('lars');
    if (!lars) return;
    const title = 'Praxis Dr. Lars';
    if (lars.isSleeping) {
      this.session.bus.emit('dialog:open', { title, lines: [...lars.def.dialogue.atHomeSleeping[0]] });
      return;
    }
    const open = lars.atHome || lars.currentEntry?.label === 'Praxis geöffnet';
    this.session.bus.emit('dialog:open', {
      title,
      lines: open ? ['„Hallo Lina! Apotheke oder einmal durchs Wartezimmer?“'] : ['An der Tür: „Bin gleich zurück! Selbstbedienung in der Apotheke – Kräuter bitte selbst mitbringen. 🌿“'],
      choices: [
        { label: '🌿 Apotheke', onSelect: () => this.session.bus.emit('ui:open', { kind: 'apotheke' }) },
        { label: '🚪 Hineingehen', onSelect: () => this.doorTransition('up', () => this.enterGuest('praxis-lars'), 'up') },
        { label: '👋 Tschüss', onSelect: () => undefined },
      ],
    });
  }

  /** Party: Lina tanzt mit Thalia (einmal pro Partyabend), alle Gäste freuen sich */
  private dance(npc: Npc) {
    const player = this.player;
    const data = this.session.data;
    if (!player || !data) return;
    data.world.dates.party = this.session.today();
    const lines = [...PARTY_LINES[hashString(this.session.today()) % PARTY_LINES.length]];
    for (const other of this.npcs.values()) if (other.present && other.def.id !== 'thalia') addFriendship(this.session, other.def.id, 6);
    lines.push(...addFriendship(this.session, 'thalia', 20));
    // kleine Tanzeinlage: Lina dreht sich & hüpft
    const start = player.facing;
    this.tweens.add(1600, (k) => {
      player.seatHeight = Math.abs(Math.sin(k * Math.PI * 4)) * 0.12;
      player.face((['down', 'right', 'up', 'left'] as const)[Math.floor(k * 8) % 4]);
    }, () => {
      player.seatHeight = 0;
      player.face(start);
      this.winston?.burst('herz');
      this.session.bus.emit('dialog:open', { title: npc.def.name, hearts: npcHearts(this.session, 'thalia'), lines, onClose: () => npc.endTalk() });
    });
    this.session.save();
  }

  /** Volkstanz mit Christin & Olaf: Lina dreht sich im Kreis, danach gibt es Kuchen */
  private folkDanceScene(npc: Npc) {
    const player = this.player;
    if (!player) return;
    const lines = folkDance(this.session);
    const start = player.facing;
    this.tweens.add(2400, (k) => {
      player.seatHeight = Math.abs(Math.sin(k * Math.PI * 6)) * 0.1;
      player.face((['down', 'right', 'up', 'left'] as const)[Math.floor(k * 12) % 4]);
    }, () => {
      player.seatHeight = 0;
      player.face(start);
      this.winston?.burst('herz');
      this.session.bus.emit('fx', { kind: 'konfetti' });
      this.session.bus.emit('dialog:open', { title: npc.def.name, hearts: npcHearts(this.session, 'christin'), lines, onClose: () => npc.endTalk() });
    });
  }

  // ---- Spontane Gespräche zwischen Bewohnern ----
  private npcChat: { a: Npc; b: Npc; lines: string[]; t: number; step: number } | null = null;
  private chatTimer = 20;
  private chatPairCooldown = new Map<string, number>();

  private endNpcChat(pause = true) {
    const c = this.npcChat;
    if (!c) return;
    c.a.endChat();
    c.b.endChat();
    this.npcChat = null;
    if (pause) this.chatTimer = 25 + Math.random() * 40;
  }

  private updateChats(dt: number) {
    const c = this.npcChat;
    if (this.session.inside || this.cutscene) {
      this.endNpcChat(false);
      return;
    }
    if (c) {
      if (!c.a.chatting || !c.b.chatting || !c.a.present || !c.b.present) {
        this.endNpcChat();
        return;
      }
      c.t += dt;
      const STEP = 4.2;
      if (c.step < c.lines.length && c.t >= c.step * STEP) {
        const who = c.step % 2 === 0 ? c.a : c.b;
        const near = this.player ? Math.hypot(this.player.x - who.char.x, this.player.y - who.char.y) < TILE * 9 : false;
        const head = who.char.root.position.clone().add(new THREE.Vector3(0, who.bubbleHeight + 0.2, 0));
        if (near) this.popSpeech(head, c.lines[c.step]);
        else this.popEmote(head, '💬');
        c.step += 1;
      }
      if (c.t >= c.lines.length * STEP + 1.2) this.endNpcChat();
      return;
    }
    this.chatTimer -= dt;
    if (this.chatTimer > 0) return;
    this.chatTimer = 2;
    if (this.session.uiBlocking || this.session.decorActive || isPartyTime(this.session) || isDinnerTime(this.session) || activeMeetups(this.session).length > 0) return;
    const list = [...this.npcs.values()].filter((n) => n.canChat);
    const now = performance.now();
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const A = list[i];
        const B = list[j];
        if (Math.hypot(A.char.x - B.char.x, A.char.y - B.char.y) > TILE * 3.2) continue;
        const pk = pairChatKey(A.def.id, B.def.id);
        if (!pk || (this.chatPairCooldown.get(pk.key) ?? 0) > now) continue;
        const exchanges = PAIR_CHATS[pk.key];
        const ex = exchanges[Math.floor(Math.random() * exchanges.length)];
        const first = pk.swapped ? B : A;
        const second = pk.swapped ? A : B;
        if (!first.startChat(second.char.x, second.char.y)) continue;
        if (!second.startChat(first.char.x, first.char.y)) {
          first.endChat();
          continue;
        }
        this.chatPairCooldown.set(pk.key, now + 4 * 60_000);
        this.npcChat = { a: first, b: second, lines: [...ex], t: 0, step: 0 };
        return;
      }
    }
    this.chatTimer = 6 + Math.random() * 6;
  }

  /** Spricht Lina einen der beiden während des Gesprächs an, geht er zuerst darauf ein */
  private chatLead(npc: Npc): string[] {
    const c = this.npcChat;
    if (!c || (c.a !== npc && c.b !== npc)) return [];
    const spoken = Math.min(c.step, c.lines.length);
    if (spoken === 0) return [];
    if (npc === c.a) return [`Moment, Lina – ich hab ${c.b.def.name} gerade gesagt: „${c.lines[0]}“`];
    const reply = c.lines[1] && spoken >= 2 ? ` – ich hab geantwortet: „${c.lines[1]}“` : '';
    return [`${c.a.def.name} hat mir gerade gesagt: „${c.lines[0]}“${reply}`];
  }

  /** Sprechblase mit Text über einem Kopf */
  private popSpeech(at: THREE.Vector3, text: string) {
    const c = document.createElement('canvas');
    c.width = 320;
    c.height = 128;
    const ctx = c.getContext('2d') as CanvasRenderingContext2D;
    ctx.font = '700 20px Nunito, sans-serif';
    const words = text.split(' ');
    const lines: string[] = [];
    let cur = '';
    for (const w of words) {
      const t = cur ? `${cur} ${w}` : w;
      if (ctx.measureText(t).width > 280 && cur) {
        lines.push(cur);
        cur = w;
      } else cur = t;
    }
    lines.push(cur);
    const h = 28 + lines.length * 24;
    ctx.fillStyle = 'rgba(255,255,255,0.96)';
    ctx.strokeStyle = '#f2b8cc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(4, 4, 312, h, 16);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#5a3a4a';
    ctx.textAlign = 'center';
    lines.forEach((l, i) => ctx.fillText(l, 160, 34 + i * 24));
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const sp = new THREE.Sprite(mat);
    sp.center.set(0.5, 0);
    sp.scale.set(1.7, 0.68, 1);
    sp.position.copy(at);
    sp.renderOrder = 10;
    this.scene.add(sp);
    this.tweens.add(3800, (k) => {
      mat.opacity = k < 0.1 ? k * 10 : k > 0.85 ? 1 - (k - 0.85) / 0.15 : 1;
    }, () => {
      sp.removeFromParent();
      mat.dispose();
      tex.dispose();
    });
  }

  /** Treffen: Symbole über den Köpfen, Angeln in der Hand */
  private updateMeetups(dt: number) {
    const meets = activeMeetups(this.session);
    for (const npc of this.npcs.values()) {
      const m = meets.find((x) => x.members.includes(npc.def.id));
      const want = !!m && m.hold === 'angel' && npc.present && !npc.char.hasPath;
      if (want !== (this.npcRods.get(npc.def.id) ?? false)) {
        this.npcRods.set(npc.def.id, want);
        const rod = want ? makeRod() : null;
        if (rod) rod.group.rotation.x = 0.2;
        npc.char.hold(rod?.group ?? null);
        npc.char.armForward = want ? -0.35 : undefined;
      }
    }
    if (this.session.inside || meets.length === 0) return;
    this.emoteTimer -= dt;
    if (this.emoteTimer > 0) return;
    this.emoteTimer = 1.6 + Math.random() * 1.6;
    const m = meets[Math.floor(Math.random() * meets.length)];
    const here = m.members.map((id) => this.npcs.get(id)).filter((n): n is Npc => !!n && n.present && !n.char.hasPath);
    if (here.length === 0) return;
    const who = here[Math.floor(Math.random() * here.length)];
    this.popEmote(who.char.root.position.clone().add(new THREE.Vector3(0, who.bubbleHeight + 0.15, 0)), m.emotes[Math.floor(Math.random() * m.emotes.length)]);
  }

  /** Ein Emoji steigt kurz über einem Kopf auf */
  private popEmote(at: THREE.Vector3, text: string) {
    let tex = this.emoteTextures.get(text);
    if (!tex) {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const ctx = c.getContext('2d') as CanvasRenderingContext2D;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(32, 30, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '34px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 32, 32);
      tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      this.emoteTextures.set(text, tex);
    }
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    sp.position.copy(at);
    sp.renderOrder = 9;
    this.scene.add(sp);
    this.tweens.add(1500, (k) => {
      sp.position.y = at.y + k * 0.35;
      sp.scale.setScalar(0.32 * Math.min(1, k * 5));
      sp.material.opacity = k < 0.75 ? 1 : 1 - (k - 0.75) / 0.25;
    }, () => {
      sp.removeFromParent();
      sp.material.dispose();
    });
  }

  /** Sonntagsessen bei Jens: Lina setzt sich dazu, alle Gäste reden mit – Freundschaft für alle */
  private sundayDinner(npc: Npc) {
    const data = this.session.data;
    if (!data) return;
    data.world.dates.essen = this.session.today();
    const day = this.session.today();
    const guests = dinnerGuests(this.session);
    const lines = [...DINNER_OPENERS[hashString(day) % DINNER_OPENERS.length]];
    for (const id of guests) {
      const pool = DINNER_LINES[id];
      if (pool) lines.push(pool[hashString(`${day}:${id}`) % pool.length]);
      addFriendship(this.session, id, id === 'jens' ? 16 : 10);
    }
    lines.push('Nu, war\'s lecker? Nächsten Sonntag wieder, gell? Bisous! 💋');
    this.winston?.burst('herz');
    const who = guests.filter((g) => g !== 'jens').map((g) => this.npcs.get(g)?.def.name).filter(Boolean);
    lines.unshift(`Am großen Tisch bei Jens sitzen schon: ${who.join(', ')}. 🍽️`);
    this.session.bus.emit('dialog:open', { title: 'Sonntagsessen bei Jens', hearts: npcHearts(this.session, 'jens'), lines, onClose: () => npc.endTalk() });
    this.session.save();
  }

  /** Einmal am Tag: Gesundheits-Check bei Lars */
  private checkup(npc: Npc) {
    const data = this.session.data;
    if (!data) return;
    data.world.dates.checkup = this.session.today();
    const lines = [...CHECKUP_LINES[hashString(this.session.today()) % CHECKUP_LINES.length]];
    const gift = CHECKUP_GIFTS[hashString(`${this.session.today()}:check`) % CHECKUP_GIFTS.length];
    lines.push(...addFriendship(this.session, 'lars', 12));
    this.session.bus.emit('dialog:open', {
      title: npc.def.name,
      hearts: npcHearts(this.session, 'lars'),
      lines: [...lines, `Hier, zur Belohnung fürs Tapfersein: ${itemDef(gift)?.name ?? gift}! 🍭`],
      onClose: () => {
        this.giveOrDrop(gift);
        this.session.save();
        npc.endTalk();
      },
    });
  }

  /** Picknick, Sterne gucken oder Herzbank mit Oli – mit Abblenden, Decke zum Ausbreiten und sanftem Ende */
  private dateScene(kind: DateKind) {
    const player = this.player;
    const oli = this.npcs.get('oli');
    if (!player || !oli) return;
    if (this.session.inside) this.exitHome();
    this.stopFishing();
    this.cutscene = true;
    player.cancelPath();
    this.marker.visible = false;
    let blanket: THREE.Object3D | null = null;

    // 1) Abblenden, hinter dem Schwarz alles an Ort und Stelle bringen, 2) Einblenden, Decke breitet sich aus
    this.session.bus.emit('overlay:fade', true);
    window.setTimeout(() => {
      blanket = this.placeDate(kind, oli);
      if (blanket) blanket.scale.setScalar(0.01);
      this.camTarget.set(player.x * UNIT, 0, player.y * UNIT);
      this.dogFollow();
      if (kind === 'sterne') this.session.bus.emit('overlay:stars', true);
      window.setTimeout(() => {
        this.session.bus.emit('overlay:fade', false);
        const rug = blanket;
        if (rug) this.tweens.add(600, (k) => rug.scale.setScalar(Math.max(0.01, easeOutBack(k))));
        window.setTimeout(() => {
          const lines = haveDate(this.session, kind);
          this.winston?.burst('herz');
          this.session.bus.emit('dialog:open', {
            title: oli.def.name,
            lines,
            onClose: () => this.endDate(kind, oli, blanket),
          });
        }, 900);
      }, 250);
    }, 480);
  }

  /** Lina und Oli an den Platz setzen (hinter dem Abblenden); gibt die Picknickdecke zurück, falls es eine gibt */
  private placeDate(kind: DateKind, oli: Npc): THREE.Object3D | null {
    const player = this.player;
    if (!player) return null;
    const grid = this.session.map.grid;
    if (kind === 'herzbank') {
      // Eure Bank am Strand: nebeneinander auf der Sitzfläche, Blick aufs Meer
      const bench = objectById(this.session.map, 'herzbank');
      const bx = bench ? bench.x : 30;
      const by = bench ? bench.y : 32;
      const seatY = Math.max(0, this.view.terrain.heightAt(bx + 1, by + 0.5)) + 0.35;
      const seatWorld = (dx: number) => ({ x: (bx + dx) * TILE, y: (by + 0.55) * TILE });
      const l = seatWorld(0.55);
      const o = seatWorld(1.45);
      player.teleport(l.x, l.y);
      player.face('down');
      player.setSitting(true);
      player.seatHeight = seatY;
      oli.scriptPlace({ x: bx + 1, y: by + 1 });
      oli.char.teleport(o.x, o.y);
      oli.char.face('down');
      oli.char.setSitting(true);
      oli.char.seatHeight = seatY;
      return null;
    }
    const want = kind === 'picknick' ? { x: 9, y: 22 } : { x: 33, y: 31 };
    let a = nearestWalkable(grid, want) ?? player.tile;
    let b = { x: a.x + 1, y: a.y };
    if (grid.isBlocked(b.x, b.y)) {
      b = a;
      a = { x: a.x - 1, y: a.y };
    }
    const blanket = makePicnic();
    const gy = Math.max(0, this.view.terrain.heightAt(a.x + 1, a.y + 0.5));
    blanket.position.set(a.x + 1, gy, a.y + 0.55);
    this.scene.add(blanket);
    const seat = gy + 0.04;
    player.teleport((a.x + 0.5) * TILE, (a.y + 0.5) * TILE + 10);
    player.setSitting(true);
    player.seatHeight = seat;
    oli.scriptPlace(b);
    oli.char.teleport((b.x + 0.5) * TILE, (b.y + 0.5) * TILE + 10);
    oli.char.setSitting(true);
    oli.char.seatHeight = seat;
    return blanket;
  }

  /** Ende: aufstehen, die Decke wird eingerollt, dann geht es weiter – nichts verschwindet einfach */
  private endDate(kind: DateKind, oli: Npc, blanket: THREE.Object3D | null) {
    const player = this.player;
    if (!player) return;
    this.session.bus.emit('overlay:stars', false);
    player.setSitting(false);
    oli.char.setSitting(false);
    oli.char.faceTowards(player.x, player.y);
    player.faceTowards(oli.char.x, oli.char.y);
    window.setTimeout(() => {
      const finish = () => {
        blanket?.removeFromParent();
        oli.scriptDone();
        this.session.bus.emit('toast', { text: kind === 'picknick' ? 'Was für ein schönes Picknick! 💕' : kind === 'herzbank' ? 'Euer Platz am Meer. 🌅' : 'Was für ein Sternenhimmel … 💫' });
        this.cutscene = false;
      };
      if (blanket) this.tweens.add(520, (k) => blanket.scale.setScalar(Math.max(0.01, 1 - k * k)), finish);
      else window.setTimeout(finish, 300);
    }, 700);
  }

  // -------------------------------------------------------------------------
  // Winston
  // -------------------------------------------------------------------------

  /** Winston je nach Stand: noch nicht da · sitzt verfangen im Gestrüpp · folgt Lina */
  private syncWinston() {
    const state = winstonState(this.session);
    if (state !== 'verfangen' && this.winstonBush) {
      this.winstonBush.removeFromParent();
      this.winstonBush = null;
    }
    if (state === 'fehlt') {
      this.winston?.dispose();
      this.winston = null;
      return;
    }
    if (!this.winston) this.winston = new Winston(this.scene, this.tweens, this.view.terrain.heightAt);
    this.winston.heightAt = this.view.terrain.heightAt;
    if (state === 'verfangen') {
      this.winston.strand(WINSTON_SPOT.x * TILE, WINSTON_SPOT.y * TILE);
      if (!this.winstonBush) {
        this.winstonBush = makeBush(this.session.season, 7);
        this.winstonBush.position.set(WINSTON_SPOT.x + 0.15, 0, WINSTON_SPOT.y - 0.3);
        this.winstonBush.scale.setScalar(1.25);
        this.scene.add(this.winstonBush);
      }
    }
    else this.dogFollow();
  }

  /** Ein paar Minuten nach Omas Werkzeugen: leises Fiepen, Winston sitzt im Gestrüpp (Lina geht hin, wann sie mag) */
  private winstonAppears() {
    winstonAppeared(this.session);
    this.syncWinston();
    this.session.bus.emit('toast', { text: WINSTON_APPEARS_TOAST });
    this.session.bus.emit('sfx', 'bellen');
    this.session.save();
  }

  /** Lina befreit den verfangenen Dackel – er folgt ihr ab jetzt */
  private rescueWinston() {
    const w = this.winston;
    const player = this.player;
    if (!w || !player || !w.stranded) return;
    player.faceTowards(w.x, w.y);
    this.cutscene = true;
    this.session.bus.emit('dialog:open', {
      title: 'Ein kleiner Dackel',
      lines: [...WINSTON_FIND_LINES],
      choices: [
        {
          label: '🤲 Vorsichtig befreien',
          onSelect: () => {
            winstonFound(this.session);
            this.winstonBush?.removeFromParent();
            this.winstonBush = null;
            w.release({ x: player.x, y: player.y });
            this.fxAt('herzen', w.x, w.y, -0.45);
            this.session.bus.emit('sfx', 'bellen');
            this.session.bus.emit('dialog:open', {
              title: 'Winston',
              lines: [...WINSTON_FREED_LINES],
              onClose: () => {
                this.cutscene = false;
                w.burst('herz');
                this.dogFollow();
              },
            });
          },
        },
        {
          label: '👋 Gleich wieder',
          onSelect: () => {
            this.cutscene = false;
            this.session.bus.emit('toast', { text: 'Das Fiepen wird leiser … er wartet auf dich. 🥺' });
          },
        },
      ],
    });
  }

  /** Winston direkt hinter Lina absetzen (nach Start/Raumwechsel) */
  private dogFollow() {
    const player = this.player;
    if (!player || !this.winston) return;
    // Noch verfangen: bleibt draußen im Gestrüpp (drinnen unsichtbar), kommt nicht mit
    if (this.winston.stranded) {
      this.winston.setVisible(!this.session.inside);
      return;
    }
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
    if (!sleeping) {
      this.session.bus.emit('sfx', 'bellen');
      this.fxAt('herzen', w.x, w.y, -0.45);
    }
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
    if (!this.session.inside && !blocked && !night && this.linaIdle > 3 && w.resting && !w.stranded && winstonMayDig(this.session)) {
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
    // Korb in Gesamtkoordinaten (der Raum hat eine feste Lage im Grundriss)
    const gb = { x: basket.x + this.ox - ROOM_X, y: basket.y + this.oy - ROOM_Y };
    let best: Tile[] | null = null;
    for (const n of neighbours(gb)) {
      if (grid.isBlocked(n.x, n.y)) continue;
      const path = findPath(grid, from, n);
      if (path && (!best || path.length < best.length)) best = path;
    }
    if (!best) return;
    const toWorld = (t: Tile) => ({ x: (ROOM_X + t.x + 0.5) * TILE, y: (ROOM_Y + t.y + 0.5) * TILE });
    w.setBasket(toWorld(gb), best.map(toWorld));
  }

  // -------------------------------------------------------------------------
  // Zu Hause
  // -------------------------------------------------------------------------

  private get data() {
    return this.session.data;
  }

  /** Raum, in dem Lina gerade steht (bzw. den sie beim Einrichten anvisiert) */
  private get interior(): Interior3D {
    return this.houseView.view(this.session.roomId) ?? this.houseView.first();
  }

  /** Weltkachel der linken oberen Ecke des aktuellen Raums */
  private get ox(): number {
    return this.interior.origin.x;
  }
  private get oy(): number {
    return this.interior.origin.z;
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

  /** Mehrere Räume im Stockwerk? */
  private houseWide(): boolean {
    return this.houseView.plan.rooms.length > 1;
  }

  /** Kamera im Haus: beim Einrichten das ganze Stockwerk, sonst der Raum, in dem Lina steht (Nachbarräume schauen herein) */
  private insideCamTarget(): THREE.Vector3 {
    if (this.session.decorActive && this.houseWide()) {
      const size = planSize(this.houseView.plan);
      this.camScale = Math.max(1.22, size.w / 7.2, size.h / 5.5);
      return new THREE.Vector3(ROOM_X + size.w / 2 + this.decorPan.x, 0, ROOM_Y + size.h / 2 + this.decorPan.z);
    }
    this.camScale = this.houseWide() ? 1.6 : 1.22;
    // Im Haus mit mehreren Räumen folgt die Kamera Lina (sonst läuft sie beim Hineinzoomen aus dem Bild)
    const p = this.player;
    if (this.houseWide() && p) {
      const size = planSize(this.houseView.plan);
      const x = Math.min(ROOM_X + size.w - 3, Math.max(ROOM_X + 3, p.x * UNIT));
      const z = Math.min(ROOM_Y + size.h - 2, Math.max(ROOM_Y + 2, p.y * UNIT));
      return new THREE.Vector3(x, 0, z - 0.2);
    }
    return this.roomCenter();
  }

  private roomCenter(): THREE.Vector3 {
    const L = this.lay;
    return new THREE.Vector3(this.ox + L.w / 2, 0, this.oy + L.h / 2 - 0.2);
  }

  /** Darstellung des Ortes, an dem gerade eingerichtet wird (Zimmer oder Garten) */
  private get dv(): Interior3D | Yard3D {
    return this.session.inside ? this.interior : this.yard;
  }

  /** Kachel-Ursprung des aktuellen Raums/Gartens */
  private get origin(): { x: number; y: number } {
    return this.session.inside ? { x: this.ox, y: this.oy } : { x: YARD_AREA.x, y: YARD_AREA.y };
  }

  private refreshYard(force = false) {
    const yard = this.session.data?.yard;
    if (!yard) return;
    this.yard.refresh(yard, force);
    this.animals.refresh(yard);
    // Eier im Nest zeigen, wenn es heute welche gibt
    for (const i of yard.items) if (coopKindOf(i.itemId)) this.yard.setEggs(i.uid, coopHasEggs(this.session, i.uid));
  }

  /** Mauszeiger → Gartenzelle (über den Boden) */
  private yardCellAt(e: PointerEvent): { x: number; y: number } | null {
    this.raycaster.setFromCamera(this.ndc(e), this.camera);
    const g = this.raycaster.intersectObject(this.view.terrain.ground, false)[0];
    return g ? this.yard.cellFromPoint(g.point) : null;
  }

  /** Pflanzplätze in Hochbeeten (Weltkacheln + Höhe) */
  private yardBedSpots(): Array<{ x: number; y: number; h: number }> {
    const yard = this.session.data?.yard;
    if (!yard) return [];
    return yard.items.filter((i) => FURNITURE_BY_ITEM[i.itemId]?.def.bed).flatMap((i) => bedTiles(this.session, i.uid).map((t) => ({ ...t, h: FURNITURE_BY_ITEM[i.itemId].def.soilHeight ?? 0.39 })));
  }

  private setInYard(on: boolean) {
    if (this.session.inYard === on) return;
    this.session.inYard = on;
    if (!on && this.session.decorActive && !this.session.inside) this.stopDecor();
    this.session.bus.emit('home:yard', on);
  }

  private refreshRoom(force = false) {
    const c = currentRoom(this.session);
    const house = this.session.data?.house;
    if (!this.session.inside || !c || !house) return;
    const collected = new Set(Object.keys(this.session.data?.collection ?? {}));
    let rooms: Array<{ room: Room; layout: RoomLayout }>;
    let plan: FloorPlan;
    let key: string;
    if (this.session.visiting) {
      // Besuch: ein einzelner Raum
      plan = singleRoomPlan('gast', c.room.id, c.layout.w, c.layout.h);
      rooms = [c];
      key = `gast:${this.session.visiting}`;
    } else {
      plan = floorsOf(house.stage).find((f) => f.rooms.some((r) => r.id === c.room.id)) ?? groundFloor(house.stage);
      rooms = plan.rooms.flatMap((r) => {
        const room = house.rooms.find((x) => x.id === r.id);
        return room ? [{ room, layout: layoutOf(house.stage, r.id) }] : [];
      });
      key = `${plan.id}:${house.stage}`;
    }
    const rebuilt = this.houseView.setFloor(plan, key);
    this.houseView.refreshAll(rooms, collected, force || rebuilt);
    this.houseView.setActive(this.session.roomId);
    this.houseView.updateLight(this.night, currentWeather(this.session).clouds);
    this.floorGrid = null; // Möbel haben sich evtl. geändert
    this.exitBeyond = new Set(
      rooms.flatMap(({ room, layout }) => {
        const view = this.houseView.view(room.id);
        const ox = (view?.origin.x ?? ROOM_X) - ROOM_X;
        const oz = (view?.origin.z ?? ROOM_Y) - ROOM_Y;
        return layout.exits.flatMap((e) => e.cells.map(([x, y]) => `${ox + x},${oz + y + (e.dir === 'down' ? 1 : -1)}`));
      }),
    );
  }

  /** Begehbares Gesamtgitter des Stockwerks (Gesamtkoordinaten) */
  private getFloorGrid(): CollisionGrid {
    if (this.floorGrid) return this.floorGrid;
    const house = this.session.data?.house;
    const plan = this.houseView.plan;
    this.floorGrid = buildPlanGrid(plan, (roomId, x, y) => {
      const view = this.houseView.view(roomId);
      const room = this.session.visiting ? currentRoom(this.session)?.room : house?.rooms.find((r) => r.id === roomId);
      return !view || !room || view.isBlocked(room, x, y);
    });
    return this.floorGrid;
  }

  /** Kollision für alle, die im Haus laufen (Gesamtkoordinaten + Welt-Offset) */
  private floorSolid = (tx: number, ty: number): boolean => {
    const gx = tx - ROOM_X;
    const gy = ty - ROOM_Y;
    if (this.exitBeyond.has(`${gx},${gy}`)) return false;
    return this.getFloorGrid().isBlocked(gx, gy);
  };

  /** Raum unter einem Feld des Gesamtgitters (Wandstreifen und Außenbereich: null) */
  private roomAtTile(tx: number, ty: number): string | null {
    return roomAt(this.houseView.plan, tx - ROOM_X, ty - ROOM_Y)?.room ?? null;
  }

  /**
   * Rückwände zu Räumen dahinter werden durchsichtig, wenn man hindurchsehen muss: Lina steht im Raum dahinter (oder
   * im Türstreifen) – wie die Häuser im Dorf, wenn Lina dahinter steht – und beim Einrichten (dann auch, um dort
   * Wand-Deko aufzuhängen). Sonst bleiben die Wände ganz: Fenster, Tapete und Wand-Deko wie gewohnt.
   */
  private updateWallFade(player: Character, dt: number) {
    const plan = this.houseView.plan;
    if (!this.session.inside || plan.rooms.length < 2) return;
    const g = { x: player.tile.x - ROOM_X, y: player.tile.y - ROOM_Y };
    const here = roomAt(plan, g.x, g.y)?.room ?? null;
    const strips = wallStrips(plan).filter((s) => !s.vertical);
    for (const r of plan.rooms) {
      const behind = roomsBehind(plan, r.id);
      if (behind.length === 0) continue;
      const inStrip = strips.some((s) => s.frontRoom === r.id && g.x >= s.x && g.x < s.x + s.w && g.y >= s.y && g.y < s.y + s.h);
      const want = this.session.decorActive || inStrip || (here !== null && behind.includes(here)) ? 0.18 : 1;
      const cur = this.wallFade.get(r.id) ?? 1;
      const next = cur + (want - cur) * Math.min(1, dt * 6);
      this.wallFade.set(r.id, next);
      this.houseView.setBackFade(r.id, next);
    }
    // Seitenwände zu Nachbarräumen (Küche, Wintergarten): durchsichtig, solange Lina in einem der beiden Räume steht,
    // in der Tür oder beim Einrichten – sonst voll (Tapete, Wand-Deko)
    const vstrips = wallStrips(plan).filter((s) => s.vertical);
    for (const r of plan.rooms) {
      const beside = roomsBeside(plan, r.id);
      for (const side of ['left', 'right'] as const) {
        const other = beside[side];
        if (!other) continue;
        const inDoor = vstrips.some((s) => g.x >= s.x && g.x < s.x + s.w && g.y >= s.y && g.y < s.y + s.h && roomAt(plan, s.x - 1, g.y)?.room !== undefined && (roomAt(plan, s.x - 1, g.y)?.room === r.id || roomAt(plan, s.x + 1, g.y)?.room === r.id));
        const want = this.session.decorActive || inDoor || here === r.id || here === other ? 0.3 : 1;
        const key = `${r.id}:${side}`;
        const cur = this.wallFade.get(key) ?? 1;
        const next = cur + (want - cur) * Math.min(1, dt * 6);
        this.wallFade.set(key, next);
        this.houseView.setSideFade(r.id, side, next);
      }
    }
  }

  /** Lina steht in einem anderen Raum als zuletzt? Dann wird der „aktuelle Raum“ umgestellt (kein Umblenden). */
  private trackRoom(player: Character) {
    if (!this.session.inside || this.session.decorActive || this.session.visiting) return;
    const t = player.tile;
    const id = this.roomAtTile(t.x, t.y);
    if (id && id !== this.session.roomId && this.houseView.view(id)) {
      this.session.roomId = id;
      this.houseView.setActive(id);
      this.homeOliKey = '';
    }
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
    player.teleport((this.ox + cx) * TILE + (back && back.cells.length > 1 ? 64 : 32), (this.oy + cy + inward) * TILE + 40);
    player.face(back?.dir === 'up' ? 'down' : 'up');
    this.camTarget.copy(this.roomCenter());
    this.dogFollow();
    this.exitArmed = false;
    this.marker.visible = false;
  }

  private useExit(e: Exit) {
    if (this.cutscene) return;
    if (e.to === 'draussen') this.doorTransition('down', () => this.exitHome(), 'down');
    else this.doorTransition(e.dir, () => this.placeInRoom(e.to, this.session.roomId), e.dir === 'up' ? 'down' : 'up');
  }

  /**
   * Tür-Animation: Lina geht ein paar Schritte (`dirIn`), das Bild blendet weich ab, `action` wechselt
   * den Ort, dann blendet es wieder auf und Lina geht ein Stück weiter (`dirOut`). Winston kommt mit.
   */
  private doorTransition(dirIn: 'up' | 'down', action: () => void, dirOut: 'up' | 'down') {
    const player = this.player;
    if (!player || this.cutscene) return;
    this.cutscene = true;
    player.cancelPath();
    if (player.sitting) this.standUp();
    this.marker.visible = false;
    const dy = (d: 'up' | 'down') => (d === 'up' ? -1 : 1);
    player.face(dirIn);
    this.autoWalk = { dx: 0, dy: dy(dirIn), until: performance.now() + 380 };
    this.session.bus.emit('overlay:fade', true);
    this.session.bus.emit('sfx', 'tuer');
    window.setTimeout(() => {
      this.autoWalk = null;
      action();
      const p = this.player;
      if (p) {
        // ein Stück zurück „in die Tür“ setzen, damit Lina heraustreten kann
        p.teleport(p.x, p.y - dy(dirOut) * 22);
        p.face(dirOut);
        this.dogFollow();
      }
      window.setTimeout(() => {
        this.session.bus.emit('overlay:fade', false);
        this.autoWalk = { dx: 0, dy: dy(dirOut), until: performance.now() + 260 };
        window.setTimeout(() => {
          this.autoWalk = null;
          this.cutscene = false;
          this.exitArmed = false;
        }, 300);
      }, 120);
    }, 420);
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
    // Ist Oli wach zu Hause, kommt er zur Begrüßung mit einem Küsschen (nicht bei jedem Rein-und-Raus)
    window.setTimeout(() => {
      if (performance.now() - this.lastHomeKiss < 10 * 60_000) return;
      if (this.session.inside && this.homeOliComes(WELCOME_KISS_LINES)) this.lastHomeKiss = performance.now();
    }, 1400);
  }

  /** Zu Besuch im Haus eines Bewohners: hineingehen (nur ansehen, nicht umräumen) */
  private enterGuest(houseId: string) {
    const player = this.player;
    if (!player || !this.data) return;
    this.stopFishing();
    this.session.visiting = houseId;
    this.session.inside = true;
    player.heightAt = () => 0;
    if (this.winston) this.winston.heightAt = () => 0;
    this.placeInRoom('haupt', 'draussen');
    this.applyLight();
    this.session.bus.emit('home:inside', true);
    const h = GUEST_HOUSES[houseId];
    const key = `besuch-${houseId}`;
    if (h && !this.data.flags[key]) {
      this.data.flags[key] = true;
      window.setTimeout(() => this.session.bus.emit('dialog:open', { title: h.name, lines: [...h.intro] }), 700);
    } else if (h) {
      window.setTimeout(() => this.session.bus.emit('toast', { text: h.name }), 500);
    }
  }

  private exitHome() {
    const player = this.player;
    if (!player) return;
    this.stopDecor();
    const visited = this.session.visiting;
    this.session.inside = false;
    this.session.visiting = '';

    this.session.roomId = 'haupt';
    player.heightAt = this.view.terrain.heightAt;
    if (this.winston) this.winston.heightAt = this.view.terrain.heightAt;
    const door = visited ? objectById(this.session.map, visited) : null;
    const sp = door ? { x: (door.x + 2.5) * TILE, y: (door.y + 3.55) * TILE } : this.session.spawnPoint();
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
    const cx = t.x - this.ox + fx;
    const cy = t.y - this.oy + fy;
    if (this.isDesk(cx, cy)) return { kind: 'katalog' };
    // auch das Feld, auf dem Lina steht (Teppich), zählt nicht – nur davor
    const top = this.interior.topAt(home, cx, cy);
    return top ? { kind: 'moebel', uid: top.uid } : null;
  }

  /** Gartenmöbel auf einer Weltkachel (Wege & Zäune zählen nicht) */
  private yardItemAt(tx: number, ty: number): string | null {
    const yard = this.session.data?.yard;
    if (!yard) return null;
    const top = this.yard.topAt(yard, tx - YARD_AREA.x, ty - YARD_AREA.y);
    const def = top ? FURNITURE_BY_ITEM[top.itemId]?.def : undefined;
    return top && def && !def.rug && !def.fence && !def.bed ? top.uid : null;
  }

  private useFurniture(uid: string) {
    const home = this.room;
    const player = this.player;
    const item = home?.items.find((i) => i.uid === uid);
    const f = item ? FURNITURE_BY_ITEM[item.itemId] : undefined;
    if (!item || !f || !player || !home) return;
    if (f.def.id === 'fernseher') {
      this.session.bus.emit('ui:open', { kind: 'tv', withOli: !!this.homeOli?.visible });
      return;
    }
    if (f.def.storage) {
      this.session.bus.emit('ui:open', { kind: 'truhe' });
      return;
    }
    if (f.def.id === 'herd') {
      this.session.bus.emit('ui:open', { kind: 'herd' });
      return;
    }
    if (item.itemId === 'witzkalender') {
      const jokes = OLAF_CALENDAR_JOKES;
      const joke = jokes[hashString(`${this.session.today()}:witz`) % jokes.length];
      this.session.bus.emit('dialog:open', { title: 'Papas Witze-Kalender', lines: [`Das Blatt von heute: „${joke}“`, 'Darunter, in Papas Schrift: „Morgen wird\'s noch besser!“ 😄'] });
      return;
    }
    if (item.itemId === 'tassenregal' || item.itemId === 'tassenbord') {
      this.session.bus.emit('dialog:open', { title: 'Tassenregal', lines: tassenStand(this.session) });
      return;
    }
    if (isCoffeeMachine(item.itemId)) {
      this.coffeeMenu(item.itemId, itemDef(item.itemId)?.name ?? f.def.name);
      return;
    }
    if (f.def.coop) {
      this.session.bus.emit('sfx', 'gackern');
      if (this.player) this.fxAt('funkeln', this.player.x, this.player.y);
      collectCoop(this.session, uid);
      this.refreshYard();
      return;
    }
    if (f.def.light) {
      this.dv.toggleLamp(uid);
      this.houseView.updateLight(this.night, currentWeather(this.session).clouds);
      this.yard.updateLight(this.night);
      return;
    }
    if (item.itemId === 'hantelbank' && !this.session.visiting) {
      this.trainDialog(uid);
      return;
    }
    if (item.itemId === 'schreibtisch-pc' && !this.session.visiting) {
      this.session.bus.emit('dialog:open', {
        title: 'Olis Schreibtisch',
        lines: ['Zwei Bildschirme, eine Tastatur in allen Farben. Auf dem einen läuft ein kleines Spiel.'],
        choices: [
          { label: '🎮 Eine Runde spielen', onSelect: () => this.session.bus.emit('ui:open', { kind: 'minispiel' }) },
          { label: '👋 Lieber nicht', onSelect: () => undefined },
        ],
      });
      return;
    }
    if (f.def.sit) {
      const { w, d } = footprint(f.def, item.rot);
      const o = this.origin;
      const cx = o.x + item.x + w / 2;
      const cy = o.y + item.y + d / 2;
      player.teleport(cx * TILE, cy * TILE - (f.def.sit === 'liegen' ? 10 : 0));
      player.setSitting(true);
      // Blickrichtung: Sitzfläche zeigt nach +Z (gedreht mit dem Möbel)
      player.face((['down', 'left', 'up', 'right'] as const)[item.rot]);
      const ground = this.session.inside ? 0 : Math.max(0, this.view.terrain.heightAt(cx, cy));
      player.seatHeight = (this.dv.model(uid)?.seatY ?? 0.1) + ground;
      const guestSit = this.session.visiting ? GUEST_HOUSES[this.session.visiting]?.comments[f.def.id]?.[0] : undefined;
      if (guestSit) this.session.bus.emit('toast', { text: guestSit });
      else this.session.bus.emit('toast', { text: f.def.sit === 'liegen' ? ['Ach, ist das gemütlich … 💤', 'Schwere Decke, warme Füße, nichts zu tun. Perfekt. 💤', 'Lina rollt sich ein. Nur noch fünf Minuten … 🌙', 'Mmmh. Die Decke drückt genau richtig. 💤'][Math.floor(Math.random() * 4)] : 'Lina macht es sich gemütlich. ☕' });
      return;
    }
    const name = itemDef(item.itemId)?.name ?? f.def.name;
    const baseId = f.def.id;
    const guest = this.session.visiting ? GUEST_HOUSES[this.session.visiting]?.comments[baseId] : undefined;
    this.session.bus.emit('dialog:open', { title: guest ? 'Lina' : name, lines: guest ? [...guest] : [f.def.description] });
  }

  /** Siebträgermaschine: erst Klassiker oder Milchschaum, dann das Getränk */
  private coffeeMenu(itemId: string, title: string) {
    const drinks = drinksFor(itemId);
    const pure = drinks.filter((d) => !d.milk);
    const milk = drinks.filter((d) => d.milk);
    const pick = (list: Drink[]) =>
      this.session.bus.emit('dialog:open', {
        title,
        lines: ['Was darf es sein?'],
        choices: [...list.map((d) => ({ label: `${d.icon} ${d.name}`, onSelect: () => this.serveCoffee(itemId, d) })), { label: '👋 Doch nichts', onSelect: () => undefined }],
      });
    if (milk.length === 0) {
      pick(pure);
      return;
    }
    this.session.bus.emit('dialog:open', {
      title,
      lines: [`Die Maschine summt leise und ist startklar. Sie kann ${drinks.length} Getränke.`],
      choices: [
        { label: '☕ Klassiker (ohne Milch)', onSelect: () => pick(pure) },
        { label: '🥛 Mit Milchschaum', onSelect: () => pick(milk) },
        { label: '👋 Doch nichts', onSelect: () => undefined },
      ],
    });
  }

  private serveCoffee(itemId: string, drink: Drink) {
    const together = !!this.homeOli?.visible && this.session.inside;
    const r = drinkCoffee(this.session, itemId, drink.id, together);
    if (!r) return;
    this.session.bus.emit('dialog:open', {
      title: `${drink.icon} ${drink.name}`,
      lines: r.lines,
      onClose: () => {
        this.player?.cheer();
        if (r.art || r.together) this.playFx('herzen');
        else this.playFx('funkeln');
        this.session.bus.emit('toast', { text: '☕ Kaffee-Kick! Lina läuft ein paar Minuten flotter.' });
      },
    });
  }

  /** Hantelbank: Lina darf stemmen (Gag: viel Gewicht, süßes Lächeln) */
  private trainDialog(uid: string) {
    const oliHere = !!this.homeOli?.visible;
    if (oliHere && this.homeOliBench === uid) {
      this.session.bus.emit('dialog:open', { title: 'Hantelbank', lines: ['Oli ist gerade dran. „Nur ein Satz noch, Lini!“'] });
      return;
    }
    this.session.bus.emit('dialog:open', {
      title: 'Hantelbank',
      lines: ['Die Hantel liegt bereit. Eine Menge Scheiben dran … Lina grinst.'],
      choices: [
        { label: '💪 Stemmen', onSelect: () => this.trainLina(uid) },
        { label: '👋 Lieber nicht', onSelect: () => undefined },
      ],
    });
  }

  private trainLina(uid: string) {
    const player = this.player;
    const home = this.room;
    const item = home?.items.find((i) => i.uid === uid);
    const data = this.session.data;
    if (!player || !item || !data || this.cutscene) return;
    this.cutscene = true;
    const fp = footprint(FURNITURE_BY_ITEM[item.itemId].def, item.rot);
    const ax: Array<[number, number]> = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    const [ux, uy] = ax[item.rot];
    const o = this.origin;
    const cx = o.x + item.x + fp.w / 2 + ux * 0.28;
    const cy = o.y + item.y + fp.d / 2 + uy * 0.28;
    player.teleport(cx * TILE, cy * TILE);
    player.setSitting(true);
    player.face((['right', 'down', 'left', 'up'] as const)[item.rot]);
    player.seatHeight = 0.58;
    player.work = 'stemmen';
    const group = this.modelOf(uid)?.group;
    const bell = group?.getObjectByName('langhantel');
    const extra = bell?.getObjectByName('extraplatten');
    if (extra) {
      extra.visible = true;
      extra.children.forEach((pl) => (pl.visible = false));
    }
    this.session.bus.emit('sfx', 'klick');
    const oli = this.homeOli?.visible ? this.homeOli : null;
    if (oli) oli.faceTowards(player.x, player.y);
    const total = 9000;
    let shown = -1;
    this.tweens.add(total, (k) => {
      if (bell) bell.position.y = 0.86 - (1 - (Math.sin(player.clock * 2.2) + 1) / 2) * 0.13;
      const idx = Math.min(TRAINING_REPS.length - 1, Math.floor(k * TRAINING_REPS.length));
      if (idx !== shown) {
        shown = idx;
        this.session.bus.emit('toast', { text: TRAINING_REPS[idx] });
        // mit dem Gewicht kommen Scheiben dazu (20 kg = nur die Grundscheiben, 220 kg = alle)
        extra?.children.forEach((pl) => (pl.visible = (pl.userData.stufe as number) <= idx));
        if (idx >= 2) oli?.cheer();
      }
    }, () => {
      if (extra) extra.visible = false;
      if (bell) bell.position.y = 0.86;
      player.work = undefined;
      this.standUp();
      this.cutscene = false;
      // Bewusst ohne Freundschaftspunkte (Audit 3, K2): ein Gag-Moment, kein weiteres „heute schon?“
      const day = this.session.today();
      const lines = oli ? [...TRAINING_OLI[hashString(day) % TRAINING_OLI.length]] : [...TRAINING_SOLO[hashString(day) % TRAINING_SOLO.length]];
      this.session.bus.emit('dialog:open', { title: oli ? 'Oli' : 'Lina', lines });
    });
  }

  private standUp() {
    const player = this.player;
    if (!player?.sitting) return;
    player.setSitting(false);
    const home = this.room;
    if (!home) return;
    if (!this.session.inside) {
      const t = player.tile;
      const [fx, fy] = DIRS[player.facing];
      const free = nearestWalkable(this.session.map.grid, { x: t.x + fx, y: t.y + fy }, t);
      if (free) player.teleport(free.x * TILE + 32, free.y * TILE + 40);
      return;
    }
    // aufs nächste freie Feld treten
    const grid = this.roomGrid();
    const t = player.tile;
    const free = nearestWalkable(grid, { x: t.x - ROOM_X, y: t.y - ROOM_Y + 1 });
    if (free) player.teleport((ROOM_X + free.x) * TILE + 32, (ROOM_Y + free.y) * TILE + 40);
  }

  /** Begehbares Gitter des ganzen Stockwerks (Gesamtkoordinaten: Welt − ROOM_X/ROOM_Y) */
  private roomGrid(): CollisionGrid {
    return this.getFloorGrid();
  }

  /** Layout eines Raums des aktuellen Stockwerks (bei Besuchen: das Gastzimmer) */
  private layoutFor(roomId: string): RoomLayout {
    const c = currentRoom(this.session);
    if (this.session.visiting && c) return c.layout;
    return layoutOf(this.session.data?.house.stage ?? 0, roomId);
  }

  /** Möbel & Tapete eines Raums des aktuellen Stockwerks */
  private roomData(roomId: string): Room | undefined {
    if (this.session.visiting) return currentRoom(this.session)?.room;
    return this.session.data?.house.rooms.find((r) => r.id === roomId);
  }

  private roomCellAt(e: PointerEvent): { x: number; y: number } | null {
    this.raycaster.setFromCamera(this.ndc(e), this.camera);
    const views = this.houseView.all();
    if (this.session.decorActive) {
      // Einrichten: Boden oder Wand (zum Aufhängen von Bildern & Regalen) in jedem Raum
      // ohne etwas in der Hand: auf Möbel zielen (auch Wand-Deko), sonst Boden/Wand
      const targets = this.decor ? views.flatMap(([, v]) => [v.floor, ...v.walls]) : views.map(([, v]) => v.group);
      const hit = this.raycaster.intersectObjects(targets, !this.decor)[0];
      this.hoverWall = null;
      if (!hit) return null;
      const rid = this.houseView.roomOf(hit.object);
      if (!rid) return null;
      // Beim Einrichten wird der Raum unter dem Mauszeiger zum aktuellen Raum
      this.hoverRoom = rid;
      if (rid !== this.session.roomId) {
        this.session.roomId = rid;
        this.houseView.setActive(rid);
        for (const [id, v] of views) if (id !== rid) v.hideGhost();
      }
      const view = this.interior;
      const L = this.lay;
      const side = hit.object.userData.wall as string | undefined;
      if (side) {
        const wc = view.wallCell(hit.point, side, L);
        this.hoverWall = wc.rot;
        return { x: wc.x, y: wc.y };
      }
      const cell = view.cellFromPoint(hit.point);
      // Treffer hoch oben direkt an einer Wand = Wand-Deko
      const lx = hit.point.x - view.origin.x;
      const lz = hit.point.z - view.origin.z;
      if (!this.decor && hit.point.y > 0.7) this.hoverWall = lz < 0.12 ? 0 : lx < 0.12 ? 3 : lx > L.w - 0.12 ? 1 : null;
      return cell.x >= 0 && cell.y >= 0 && cell.x < L.w && cell.y < L.h ? cell : null;
    }
    const hits = this.raycaster.intersectObjects(views.map(([, v]) => v.group), true);
    if (hits.length === 0) return null;
    // Bei Möbeln zählt das Feld unter dem Treffer; sonst Bodenpunkt
    const rid = this.houseView.roomOf(hits[0].object);
    const view = rid ? this.houseView.view(rid) : undefined;
    if (!rid || !view) return null;
    this.hoverRoom = rid;
    const L = this.layoutFor(rid);
    const cell = view.cellFromPoint(hits[0].point);
    return cell.x >= 0 && cell.y >= 0 && cell.x < L.w && cell.y < L.h ? cell : null;
  }

  /** Klick im Haus (ohne Einrichten): hinlaufen bzw. benutzen – auch in andere Räume */
  private roomClick() {
    const player = this.player;
    const localCell = this.hoverCell;
    const rid = this.hoverRoom || this.session.roomId;
    const home = this.roomData(rid);
    const view = this.houseView.view(rid);
    if (!player || !localCell || !home || !view) return;
    if (player.sitting) this.standUp();
    const grid = this.roomGrid();
    // Feld im Gesamtgitter
    const cell = { x: view.origin.x - ROOM_X + localCell.x, y: view.origin.z - ROOM_Y + localCell.y };
    const from = { x: player.tile.x - ROOM_X, y: player.tile.y - ROOM_Y };
    const desk = this.layoutFor(rid).desk;
    const isDesk = !!desk && desk[0] === localCell.x && desk[1] === localCell.y;
    const top = view.topAt(home, localCell.x, localCell.y);
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
        else if (top) {
          // Möbel in einem anderen Raum: Lina steht jetzt dort (der Raum-Wechsel folgt der Position)
          this.trackRoom(player);
          this.useFurniture(top.uid);
        }
      });
      return;
    }
    const target = nearestWalkable(grid, cell, from);
    const path = target ? findPath(grid, from, target) : null;
    if (path) player.followPath(toWorld(path), top && FURNITURE_BY_ITEM[top.itemId]?.def.sit ? () => this.useFurniture(top.uid) : null);
  }

  // --- Einrichten ----------------------------------------------------------

  private decorCommand(c: DecorCommand) {
    if (!this.session.inside && !this.session.inYard) return;
    switch (c.kind) {
      case 'start':
        this.undoStack = [];
        this.decorPan = { x: 0, z: 0 };
        this.decorZoom = 1;
        this.session.decorActive = true;
        this.standUp();
        this.player?.cancelPath();
        this.stopFishing();
        if (this.session.inside) this.player?.setVisible(false);
        else this.yard.showGrid(true);
        break;
      case 'stop':
        this.stopDecor();
        return;
      case 'take':
        this.session.decorActive = true;
        this.cancelHold();
        this.decor = { itemId: c.itemId, uid: null, rot: 0, source: c.itemId };
        break;
      case 'surface':
        this.applySurfaceWithUndo(c.itemId);
        return;
      case 'pipette':
        this.pipette();
        return;
      case 'variant':
        this.cycleVariant(c.index);
        return;
      case 'undo':
        this.undoLast();
        return;
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
    this.undoStack = [];
    this.session.decorActive = false;
    if (this.player) this.trackRoom(this.player);
    this.interior.hideGhost();
    this.yard.hideGhost();
    this.yard.showGrid(false);
    const player = this.player;
    if (player && this.session.inside) {
      player.setVisible(true);
      // Falls jetzt ein Möbel auf Linas Platz steht: zur Tür
      const t = player.tile;
      const room = this.room;
      if (room && this.roomGrid().isBlocked(t.x - ROOM_X, t.y - ROOM_Y)) {
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
    this.yard.setHidden(null);
    this.yard.hideGhost();
  }

  private emitDecor(valid = true) {
    this.session.bus.emit('decor:state', {
      active: this.session.decorActive,
      holding: this.decor?.itemId ?? null,
      valid,
      variants: this.decor ? variantsOf(this.decor.itemId) : [],
      canUndo: this.undoStack.length > 0,
    });
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
      // für „Rückgängig“ merken: das Möbel samt allem, was darauf stand
      const before = this.room?.items.filter((i) => i.uid === d.uid || i.on === d.uid).map((i) => ({ ...i }));
      const r = pickUpFurniture(this.session, d.uid);
      if (r !== 'ok') {
        if (r === 'voll') this.session.bus.emit('toast', { text: 'Deine Tasche ist voll! 🎒' });
        if (r === 'pflanzen') this.session.bus.emit('toast', { text: 'Im Hochbeet wächst noch etwas – erst pflücken, dann wegräumen. 🌱' });
        return;
      }
      if (before && before.length > 0) this.pushUndo('Wegräumen', () => restoreFurniture(this.session, before));
    }
    this.cancelHold();
    this.refreshRoom();
    this.refreshYard();
    this.emitDecor();
  }

  private pushUndo(label: string, undo: () => boolean) {
    // Rückgängig gilt im Raum, in dem es passiert ist (beim Einrichten wechselt der aktuelle Raum mit dem Mauszeiger)
    const rid = this.session.roomId;
    const inRoom = () => {
      const cur = this.session.roomId;
      this.session.roomId = rid;
      try {
        return undo();
      } finally {
        this.session.roomId = cur;
      }
    };
    this.undoStack.push({ label, undo: inRoom });
    if (this.undoStack.length > 40) this.undoStack.shift();
  }

  /** Strg+Z: den letzten Schritt zurücknehmen (Geld bleibt, wo es ist – gekaufte Möbel bleiben im Vorrat) */
  private undoLast() {
    const step = this.undoStack.pop();
    if (!step) {
      this.session.bus.emit('toast', { text: 'Nichts zum Rückgängigmachen.' });
      return;
    }
    this.cancelHold();
    const ok = step.undo();
    this.session.bus.emit('toast', { text: ok ? `↶ ${step.label} rückgängig gemacht.` : `${step.label} lässt sich nicht mehr rückgängig machen (der Platz ist belegt).` });
    this.refreshRoom();
    this.refreshYard();
    this.updateGhost();
    this.emitDecor();
  }

  /** Tapete/Boden anbringen; die alte kommt in den Vorrat und lässt sich so zurückholen */
  private applySurfaceWithUndo(itemId: string) {
    const c = currentRoom(this.session);
    if (!c) return;
    const wallpaper = SURFACE_BY_ID[itemId]?.kind === 'tapete';
    const old = wallpaper ? c.room.wallpaper : c.room.floor;
    if (!applySurface(this.session, itemId)) return;
    this.session.bus.emit('toast', { text: `${itemDef(itemId)?.name} angebracht! ✨` });
    if (old && old !== itemId) this.pushUndo(wallpaper ? 'Tapete' : 'Boden', () => applySurface(this.session, old));
    this.refreshRoom();
    this.emitDecor();
  }

  /** Farbe des gehaltenen Möbels wechseln (Nummer oder weiter) */
  private cycleVariant(index?: number) {
    const d = this.decor;
    if (!d) return;
    const list = variantsOf(d.itemId);
    if (list.length < 2) return;
    const at = list.findIndex((v) => v.itemId === d.itemId);
    const next = index !== undefined ? list[index] : list[(at + 1) % list.length];
    if (!next || next.itemId === d.itemId) return;
    d.itemId = next.itemId;
    this.updateGhost();
    this.emitDecor();
  }

  /**
   * „Noch eins“ (Taste C): Das Möbel unter dem Mauszeiger bzw. in der Hand nochmal nehmen – aus Tasche/Truhe,
   * sonst direkt im Katalog kaufen (wie die Pipette bei den Sims).
   */
  private pipette() {
    const home = this.room;
    const cell = this.hoverCell;
    if (!home) return;
    const itemId = this.decor?.itemId ?? (cell ? this.dv.topAt(home, cell.x, cell.y, this.hoverWall)?.itemId : undefined);
    if (!itemId || !FURNITURE_BY_ITEM[itemId]) return;
    if (!fitsHere(this.session, itemId)) return;
    const name = itemDef(itemId)?.name ?? itemId;
    if (stockCount(this.session, itemId) < 1) {
      if (catalogPrice(itemId) === null) {
        this.session.bus.emit('toast', { text: `${name}: gibt es nicht im Katalog – ein Einzelstück. 💝` });
        return;
      }
      const r = buyFromCatalog(this.session, itemId);
      if (r === 'zu-teuer') return void this.session.bus.emit('toast', { text: `Noch eins ${name}? Dafür reichen die Sternchen nicht. ⭐` });
      if (r !== 'ok') return void this.session.bus.emit('toast', { text: r === 'tasche-voll' ? 'Tasche und Truhe sind voll! 🎒' : `${name} gibt es noch nicht im Katalog.` });
      this.session.bus.emit('toast', { text: `${name} nachgekauft. 🛒` });
    }
    this.cancelHold();
    this.decor = { itemId, uid: null, rot: this.decor?.rot ?? 0, source: itemId };
    this.updateGhost();
    this.emitDecor();
  }

  /** Vorschau an der Mausposition */
  private updateGhost() {
    const d = this.decor;
    const cell = this.hoverCell;
    const home = this.room;
    if (!d || !cell || !home) {
      this.dv.hideGhost();
      return;
    }
    const info = furnitureInfo(d.itemId);
    if (!info) return;
    this.snapWallRotation(info);
    // Zelle unter dem Mauszeiger = Mitte des Möbels
    const fp = footprint(info, d.rot);
    const x = cell.x - Math.floor((fp.w - 1) / 2);
    const y = cell.y - Math.floor((fp.d - 1) / 2);
    const p = checkPlacement(home, this.lay, d.itemId, x, y, d.rot, furnitureInfo, d.uid ?? undefined);
    if (p.ok) p.ok = canPlace(this.session, d.itemId, x, y, d.rot, d.uid ?? undefined);
    const base = p.on ? home.items.find((i) => i.uid === p.on) : undefined;
    const h = base ? (FURNITURE_BY_ITEM[base.itemId]?.def.surfaceHeight ?? 0) : 0;
    const baseInfo = base ? furnitureInfo(base.itemId) : undefined;
    const off = base && baseInfo ? riderOffset(baseInfo, base.rot, p.slot ?? 0) : undefined;
    this.dv.showGhost(d.itemId, x, y, p.rot ?? d.rot, p.ok, h, off);
    this.emitDecor(p.ok);
  }

  /** Wand-Deko dreht sich von selbst zur Wand, auf die man zielt (oder an der das Feld liegt) */
  private snapWallRotation(info: { wall?: boolean }) {
    const d = this.decor;
    const cell = this.hoverCell;
    if (!d || !cell || !info.wall || !this.session.inside) return;
    const rot = this.hoverWall ?? wallRotationAt(this.lay, cell.x, cell.y);
    if (rot !== null) d.rot = rot;
  }

  /** Klick beim Einrichten: hochheben oder abstellen */
  private decorClick() {
    const home = this.room;
    const cell = this.hoverCell;
    if (!home || !cell) return;
    const d = this.decor;
    if (!d) {
      const top = this.dv.topAt(home, cell.x, cell.y, this.hoverWall);
      if (!top) {
        if (!this.session.inside) this.askFellNature(YARD_AREA.x + cell.x, YARD_AREA.y + cell.y);
        return;
      }
      this.decor = { itemId: top.itemId, uid: top.uid, rot: top.rot, origin: { x: top.x, y: top.y, rot: top.rot, itemId: top.itemId, roomId: this.session.roomId } };
      this.dv.setHidden(top.uid);
      this.updateGhost();
      return;
    }
    const info = furnitureInfo(d.itemId);
    if (!info) return;
    this.snapWallRotation(info);
    const fp = footprint(info, d.rot);
    const x = cell.x - Math.floor((fp.w - 1) / 2);
    const y = cell.y - Math.floor((fp.d - 1) / 2);
    let ok = false;
    if (d.uid && d.origin && d.origin.roomId !== this.session.roomId) {
      // In einen anderen Raum stellen: im alten Raum einpacken, im neuen aufstellen (ohne Rückgängig)
      const target = this.session.roomId;
      this.session.roomId = d.origin.roomId;
      const packed = pickUpFurniture(this.session, d.uid);
      this.session.roomId = target;
      if (packed !== 'ok') {
        this.session.bus.emit('toast', { text: packed === 'voll' ? 'Tasche und Truhe sind voll! 🎒' : 'Das lässt sich nicht in einen anderen Raum bringen.' });
        return;
      }
      ok = !!placeFromBag(this.session, d.itemId, x, y, d.rot, d.itemId);
      if (!ok) {
        // Platz im neuen Raum belegt: zurück in den alten Raum stellen, nichts geht verloren
        this.session.roomId = d.origin.roomId;
        placeFromBag(this.session, d.itemId, d.origin.x, d.origin.y, d.origin.rot, d.itemId);
        this.session.roomId = target;
      }
    } else if (d.uid) {
      const uid = d.uid;
      const origin = d.origin;
      ok = moveFurniture(this.session, uid, x, y, d.rot, d.itemId);
      if (ok && origin) this.pushUndo('Verschieben', () => moveFurniture(this.session, uid, origin.x, origin.y, origin.rot, origin.itemId));
    } else {
      const placed = placeFromBag(this.session, d.itemId, x, y, d.rot, d.source ?? d.itemId);
      ok = !!placed;
      if (placed) {
        const uid = placed.uid;
        this.pushUndo('Aufstellen', () => pickUpFurniture(this.session, uid) === 'ok');
      }
    }
    if (!ok) {
      this.session.bus.emit('toast', { text: this.session.inside ? 'Hier ist kein Platz dafür.' : 'Hier geht das nicht – vielleicht im Weg oder auf Linas Platz?' });
      return;
    }
    this.cancelHold();
    this.refreshRoom();
    this.refreshYard();
    this.emitDecor();
  }

  /** Im Garten gestalten auf einen Baum, eine Kiefer oder einen Busch klicken: Fällen? (gibt Äste, bleibt weg) */
  private askFellNature(x: number, y: number) {
    const obj = this.session.map.objects.find((o) => (o.kind === 'tree' || o.kind === 'pine' || o.kind === 'bush') && o.x === x && o.y === y && isActive(this.session.map, o.id));
    if (!obj) return;
    const name = obj.kind === 'bush' ? 'Busch' : obj.kind === 'pine' ? 'Kiefer' : 'Baum';
    this.session.bus.emit('dialog:open', {
      title: 'Garten',
      lines: [`${name} wegmachen? Dann ist hier mehr Platz zum Gestalten.`, 'Es gibt ein paar Äste dafür. Weg ist weg – aber neue Bäume gibt es im Dorf genug. 🌳'],
      choices: [
        { label: `🪓 ${name} fällen`, onSelect: () => this.fellNature(obj.id, obj.kind) },
        { label: 'Lieber stehen lassen', onSelect: () => {} },
      ],
    });
  }

  private fellNature(id: string, kind: string) {
    const data = this.session.data;
    if (!data) return;
    data.flags[`gefaellt-${id}`] = true;
    giveItem(this.session, 'ast', kind === 'bush' ? 1 : 3, true);
    this.syncMapObjects();
    this.session.changed();
    this.session.save();
    this.session.bus.emit('sfx', 'bauen');
    this.session.bus.emit('toast', { text: kind === 'bush' ? 'Der Busch ist weg. 🌿' : 'Der Baum ist weg – mehr Platz! 🪵' });
  }

  /** Für Tests & Fehlersuche */
  // -------------------------------------------------------------------------
  // Partikel
  // -------------------------------------------------------------------------

  /** Christins Gießrunde am Abend (gießt, was in Linas Beeten noch durstig ist) */
  private christinRound() {
    const spots = christinWaters(this.session);
    if (spots.length === 0) return;
    updateGarden(this.session);
    this.garden.refresh(true);
    if (this.session.inside) return;
    for (const key of spots) {
      const [x, y] = key.split(',').map(Number);
      this.fxAt('platsch', (x + 0.5) * TILE, (y + 0.5) * TILE);
    }
    this.session.bus.emit('sfx', 'platsch');
    this.session.bus.emit('toast', { text: `💧 Christin hat deine Blumen gegossen (${spots.length}). Ordentlich, von links nach rechts.` });
  }

  // -------------------------------------------------------------------------
  // Winter: Fußspuren, Atemwölkchen, Punschstand
  // -------------------------------------------------------------------------

  /** Liegt hier Schnee? (Winter, draußen) */
  private get snowy(): boolean {
    return this.session.season === 'winter' && !this.session.inside;
  }

  /** Fußspuren im Schnee hinter Lina und Winston */
  private updatePrints(dtMs: number, player: Character) {
    if (!this.snowy) return;
    const ground = (x: number, z: number) => Math.max(0, this.view.terrain.heightAt(x, z));
    if (player.moving && !player.sitting) {
      this.printAcc += dtMs / 1000;
      if (this.printAcc > (player.running ? 0.17 : 0.24)) {
        this.printAcc = 0;
        this.printSide = -this.printSide;
        const [fx, fy] = DIRS[player.facing];
        const px = player.x * UNIT;
        const pz = player.y * UNIT;
        this.footprints.add(px, ground(px, pz), pz, Math.atan2(fx, fy), this.printSide);
      }
    }
    const w = this.winston;
    if (w && w.dog.root.visible && w.walking) {
      this.winstonPrintAcc += dtMs / 1000;
      if (this.winstonPrintAcc > 0.16) {
        this.winstonPrintAcc = 0;
        const px = w.x * UNIT;
        const pz = w.y * UNIT;
        const a = w.dog.root.rotation.y;
        this.footprints.add(px, ground(px, pz), pz, a, Math.random() < 0.5 ? -1 : 1, 0.45);
      }
    }
  }

  /** Bei Kälte sieht man den Atem: kleine Wölkchen vor dem Mund (Lina & Bewohner in der Nähe) */
  private updateBreath() {
    const player = this.player;
    if (!player || this.session.inside || getSeason(this.session.clock()) !== 'winter') return;
    const now = performance.now() / 1000;
    const puff = (key: string, x: number, y: number, facing: keyof typeof DIRS, height: number) => {
      const at = this.breathAt.get(key) ?? now + Math.random() * 2;
      if (!this.breathAt.has(key)) this.breathAt.set(key, at);
      if (now < at) return;
      this.breathAt.set(key, now + 2.6 + Math.random() * 1.8);
      const [fx, fy] = DIRS[facing];
      const px = x * UNIT + fx * 0.22;
      const pz = y * UNIT + fy * 0.22 + 0.06;
      const ground = Math.max(0, this.view.terrain.heightAt(px, pz));
      this.particles.burst('atem', new THREE.Vector3(px, ground + height, pz), new THREE.Vector3(fx * 0.3, 0, fy * 0.3));
    };
    if (player.visible) puff('lina', player.x, player.y, player.facing, player.sitting ? 0.62 : 0.82);
    for (const npc of this.npcs.values()) {
      if (!npc.char.visible || Math.hypot(npc.x - player.x, npc.y - player.y) > TILE * 9) continue;
      puff(npc.def.id, npc.x, npc.y, npc.char.facing, npc.char.sitting ? 0.62 : 0.82 * npc.def.appearance.height);
    }
  }

  /** Punschstand am Weihnachtsbaum (Advent & Weihnachten, nachmittags & abends) */
  private visitPunsch() {
    const title = 'Punschstand';
    const now = this.session.clock();
    if (!punschOpen(now)) {
      this.session.bus.emit('dialog:open', { title, lines: [`Ein Holzstand mit Lichterkette. Auf dem Schild steht: „Geöffnet ab ${PUNSCH_HOURS[0]} Uhr – heißer Punsch & Kakao!“`] });
      return;
    }
    const money = this.session.data?.money ?? 0;
    this.session.bus.emit('dialog:open', {
      title,
      lines: ['Es duftet nach Orangen, Zimt und Nelken. Aus den Töpfen steigt Dampf auf.', 'Was darf es sein?'],
      choices: [
        ...PUNSCH_DRINKS.map((d) => ({
          label: `${d.label} (${d.price} ⭐)`,
          onSelect: () => {
            const r = buyDrink(this.session, d.id);
            if (!r.ok) {
              this.session.bus.emit('dialog:open', { title, lines: [money < d.price ? 'Dafür reichen deine Sternchen gerade nicht. ⭐' : 'Der Stand hat gerade zu.'] });
              return;
            }
            this.session.bus.emit('dialog:open', {
              title,
              lines: [...r.lines],
              onClose: () => {
                this.player?.cheer();
                this.playFx('herzen');
              },
            });
          },
        })),
        { label: '👋 Nein danke', onSelect: () => undefined },
      ],
    });
  }

  /** Partikel an einer Stelle in Welteinheiten (Höhe = Gelände, drinnen Boden) */
  private fxAt(kind: FxKind, x: number, y: number, lift = 0, towardsCamera = 0) {
    const px = x * UNIT;
    const pz = y * UNIT + towardsCamera;
    const ground = this.session.inside ? 0 : Math.max(0, this.view.terrain.heightAt(px, pz));
    this.particles.burst(kind, new THREE.Vector3(px, ground + lift, pz));
  }

  /** Bus-Event `fx`: über einem Bewohner, an einer Stelle oder bei Lina */
  private playFx(kind: FxKind, npcId?: string, x?: number, y?: number) {
    const player = this.player;
    if (npcId) {
      const home = this.guestChars.get(npcId)?.visible ? this.guestChars.get(npcId)! : npcId === 'oli' && this.homeOli?.visible ? this.homeOli : null;
      const npc = home ?? this.npcs.get(npcId)?.char ?? null;
      if (npc && npc.visible) {
        this.fxAt(kind, npc.x, npc.y, 0, 0.15);
        if (kind === 'herzen') player?.cheer();
        return;
      }
    }
    if (x !== undefined && y !== undefined) this.fxAt(kind, x, y);
    else if (player) {
      this.fxAt(kind, player.x, player.y, 0, 0.2);
      if (kind === 'konfetti' || kind === 'herzen') player.cheer();
    }
  }

  /** Glühwürmchen: Sommernächte draußen, nicht bei Regen */
  private fireflyLevel(): number {
    if (this.session.inside || this.session.season !== 'sommer') return 0;
    const kind = this.weather.current.kind;
    if (kind === 'regen' || kind === 'gewitter') return 0;
    const h = this.session.clock().getHours();
    return h >= 21 || h < 2 ? 1 : 0;
  }

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
      interior: this.interior, particles: this.particles, fx: (k: FxKind) => this.playFx(k), player: this.player, winston: this.winston, npcs: this.npcs, collectibles: this.collectibles, insects: this.insects, fishing: this.fishing, weather: () => WEATHER_LABELS[currentWeather(this.session).kind], resolveTarget: () => (this.player ? this.resolveTarget(this.player) : null), tryInteract: () => this.tryInteract() };
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

/** Sprechblase (drei Punkte) für Figuren, Funkel-Blase für Dinge, mit denen man etwas machen kann */
function bubbleTexture(use: boolean): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 108;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = use ? palette.ui.gold : palette.ui.accent;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.roundRect(8, 8, 112, 72, 36);
  ctx.moveTo(50, 78);
  ctx.lineTo(62, 100);
  ctx.lineTo(76, 78);
  ctx.stroke();
  ctx.fill();
  if (use) {
    // vierzackiger Funkelstern + kleiner Begleiter
    const star = (x: number, y: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const rr = i % 2 === 0 ? r : r * 0.32;
        ctx.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr);
      }
      ctx.closePath();
      ctx.fill();
    };
    ctx.fillStyle = palette.ui.gold;
    star(60, 44, 26);
    ctx.fillStyle = palette.ui.accent;
    star(92, 30, 11);
  } else {
    ctx.fillStyle = palette.ui.accentDark;
    for (const x of [38, 64, 90]) {
      ctx.beginPath();
      ctx.arc(x, 44, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
