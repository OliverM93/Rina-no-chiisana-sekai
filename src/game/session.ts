/**
 * Die laufende Spielsitzung: Spielstand, Uhr, Karte und der Event-Bus
 * zwischen Spielwelt (Phaser) und Oberfläche (Preact).
 */
import type { Syllable } from '../core/babble';
import { buildYardLayout, yardBlockedTiles } from '../core/yard';
import { setExtraBlocked } from '../core/worldmap';
import type { RoomLayout } from '../core/room';
import { YARD_AREA } from '../data/yard';
import { RECIPE_BY_ID, START_RECIPES } from '../data/recipes';
import type { Appearance } from '../core/appearance';
import { Emitter } from '../core/events';
import { createNpcState } from '../core/friendship';
import { hashString } from '../core/rng';
import {
  createNewSave,
  exportFileName,
  type ParseResult,
  parseSave,
  type SaveData,
  SaveManager,
  serializeSave,
  type StorageLike,
} from '../core/save';
import { type Clock, formatIsoDay, getDayPhase, getSeason, type Season } from '../core/time';
import { parseWeatherOverride, type WeatherKind } from '../core/weather';
import { buildWorldMap, tileCenter, type WorldMap } from '../core/worldmap';
import { isKnownItem, type ToolId } from '../data/items';
import { furnitureInfo } from '../data/furniture';
import { annexOffsets, HOUSE_RULES, STARTER_HOUSE } from '../data/house';
import { VILLAGE_LAYOUT, VILLAGE_OBJECTS, VILLAGE_SPAWN } from '../data/maps/village';
import { NPCS } from '../data/npcs';
import type { InteractionContext } from '../data/interactions';

/** Arten von Partikel-Effekten */
export type FxKind = 'staub' | 'platsch' | 'funkeln' | 'herzen' | 'erde' | 'konfetti' | 'atem';

export interface DialogChoice {
  label: string;
  onSelect: () => void;
}

export interface DialogRequest {
  title?: string;
  /** Herzen neben dem Namen (Freundschaft) */
  hearts?: number;
  lines: string[];
  /** Auswahl nach der letzten Zeile (z. B. Plaudern / Geschenk / Tschüss) */
  choices?: DialogChoice[];
  onClose?: () => void;
}

export type UiPanel =
  | { kind: 'inventory' }
  | { kind: 'sell' }
  | { kind: 'mail' }
  | { kind: 'book' }
  | { kind: 'catalog' }
  | { kind: 'werkbank' }
  | { kind: 'kochstudio' }
  | { kind: 'apotheke' }
  | { kind: 'karte' }
  | { kind: 'galerie' }
  | { kind: 'tv'; withOli: boolean }
  | { kind: 'herd' }
  | { kind: 'bank'; onClose?: () => void }
  | { kind: 'gift'; npcId: string; onPick: (itemId: string) => void; onCancel: () => void }
  | { kind: 'seeds'; onPick: (itemId: string) => void; onCancel: () => void };

export interface DecorState {
  active: boolean;
  /** Gegenstand, der gerade platziert/verschoben wird */
  holding: string | null;
  /** passt er an die Stelle unter dem Mauszeiger? */
  valid: boolean;
}

export type DecorCommand =
  | { kind: 'start' }
  | { kind: 'stop' }
  /** Möbel aus der Tasche nehmen */
  | { kind: 'take'; itemId: string }
  | { kind: 'rotate' }
  /** gehaltenes Möbel zurück in die Tasche */
  | { kind: 'store' }
  | { kind: 'cancel' };

export interface Toast {
  text: string;
  icon?: string;
}

export type GameEvents = {
  /** Texturen fertig, Welt sichtbar (Titelbildschirm) */
  'world:ready': undefined;
  /** Spielstand geladen/erstellt – Lina erscheint */
  'game:started': undefined;
  'dialog:open': DialogRequest;
  'dialog:closed': undefined;
  'appearance:changed': Appearance;
  toast: Toast;
  /** Tasche, Sternchen, Post oder Freundschaft haben sich geändert */
  'state:changed': undefined;
  /** Die Welt bittet die Oberfläche, ein Fenster zu öffnen */
  'ui:open': UiPanel;
  /** Werkzeug in der Hand (null = keins) */
  'tool:changed': ToolId | null;
  /** Lina ist zu Hause (true) bzw. draußen */
  'home:inside': boolean;
  /** Lina betritt/verlässt ihren Garten (draußen) */
  'home:yard': boolean;
  /** Sternenhimmel mit Sternschnuppen einblenden (Sterne gucken mit Oli) */
  'overlay:stars': boolean;
  /** Lautstärke geändert */
  'settings:changed': { musicVolume: number; sfxVolume: number };
  /** Ein Geräusch abspielen (siehe audio/Audio.ts) */
  sfx: 'kuss' | 'schritt' | 'schritt-holz' | 'aufheben' | 'tuer' | 'platsch' | 'biss' | 'fang' | 'kescher' | 'dialog' | 'klick' | 'muenzen' | 'bauen' | 'bellen' | 'gackern' | 'graben' | 'herz' | 'post';
  /**
   * Partikel-Effekt (siehe world3d/Particles3D.ts). Ort in Welteinheiten, `npc` = über diesem Bewohner,
   * ohne Ort = bei Lina.
   */
  fx: { kind: FxKind; x?: number; y?: number; npc?: string };
  /** Brabbelsprache: eine Silbe für diesen Buchstaben, gesprochen von `speaker` (Name im Dialogtitel) */
  voice: { speaker: string; syl: Syllable };
  /** Weiches Abblenden (Tür-Animation): true = dunkel */
  'overlay:fade': boolean;
  /** Einrichtungsmodus: an/aus, was gerade gehalten wird */
  'decor:state': DecorState;
  /** Oberfläche → Welt: Einrichten steuern */
  'decor:command': DecorCommand;
};

export class Session {
  readonly bus = new Emitter<GameEvents>();
  readonly map: WorldMap;
  /** Form von Linas Garten (aus der Karte berechnet) */
  readonly yardLayout: RoomLayout;
  /** Wo sind Lina & die Bewohner gerade (Welteinheiten)? Setzt die 3D-Welt – für Thalias Karte */
  livePositions: () => Record<string, { x: number; y: number }> = () => ({});
  /** Steht Lina gerade in ihrem Garten? */
  inYard = false;
  readonly saves: SaveManager;
  data: SaveData | null = null;
  private blocking = true;
  private unblockedAt = 0;
  /** Wird true, sobald die Welt gezeichnet ist (bleibt gesetzt – kein Wettlauf mit der UI). */
  worldReady = false;
  /** Jahreszeit beim Start (Texturen werden dafür erzeugt). */
  readonly season: Season;
  private playStart = 0;
  /** Ist Lina gerade zu Hause? (wird nicht gespeichert – geladen wird immer draußen) */
  inside = false;
  /** In welchem Raum (wenn drinnen) */
  roomId = 'haupt';
  /** Einrichtungsmodus aktiv */
  decorActive = false;
  /** Bis wann (Spielzeit in Sekunden, `playTime()`) Lina vom Kaffee-Kick flotter läuft – wird nicht gespeichert */
  coffeeUntil = 0;
  /** Werkzeug in Linas Hand (wird nicht gespeichert) */
  tool: ToolId | null = null;
  /** Erzwungenes Wetter (`?wetter=regen`, zum Testen) */
  readonly weatherOverride: WeatherKind | 'regenbogen' | null = typeof location !== 'undefined' ? parseWeatherOverride(location.search) : null;

  constructor(
    storage: StorageLike,
    readonly clock: Clock,
  ) {
    this.map = buildWorldMap(VILLAGE_LAYOUT, VILLAGE_OBJECTS, VILLAGE_SPAWN);
    this.yardLayout = buildYardLayout(this.map, YARD_AREA);
    this.saves = new SaveManager(storage, this.spawnPoint(), clock, { ...this.saveOptions, yardLayout: this.yardLayout });
    this.season = getSeason(clock());
  }

  readonly saveOptions = { isKnownItem, npcIds: NPCS.map((n) => n.id), defaultHouse: STARTER_HOUSE, houseRules: HOUSE_RULES, furnitureInfo, isKnownRecipe: (id: string) => id in RECIPE_BY_ID, startRecipes: START_RECIPES };

  /** Heutiger Tag als JJJJ-MM-TT */
  today(): string {
    return formatIsoDay(this.clock());
  }

  /** Meldet der Oberfläche, dass sich Spielzustand geändert hat. */
  changed() {
    this.bus.emit('state:changed', undefined);
  }

  /** Wenn true, ignoriert die Spielwelt Steuerungseingaben (Menü/Dialog offen). */
  get uiBlocking(): boolean {
    return this.blocking;
  }

  set uiBlocking(value: boolean) {
    if (this.blocking && !value) this.unblockedAt = performance.now();
    this.blocking = value;
  }

  /**
   * Darf die Welt gerade Klicks/Taps annehmen? Kurz nach dem Schließen eines
   * Fensters nicht – sonst würde derselbe Tipp Lina gleich loslaufen lassen.
   */
  acceptsPointer(): boolean {
    return !this.blocking && performance.now() - this.unblockedAt > 350;
  }

  spawnPoint(): { x: number; y: number } {
    const c = tileCenter(this.map.spawn);
    return { x: c.x, y: c.y + 8 };
  }

  get playing(): boolean {
    return this.data !== null;
  }

  hasSave(): boolean {
    return this.saves.hasSave();
  }

  /** Lädt den vorhandenen Spielstand. */
  continueGame(): boolean {
    const data = this.saves.load();
    if (!data) return false;
    this.begin(data);
    return true;
  }

  startNewGame(appearance: Appearance, villageName: string) {
    const data = createNewSave({ appearance, villageName, spawn: this.spawnPoint(), now: this.clock(), house: STARTER_HOUSE, recipes: START_RECIPES });
    for (const npc of NPCS) data.npcs[npc.id] = createNpcState();
    this.begin(data);
    this.save();
  }

  markWorldReady() {
    this.worldReady = true;
    this.bus.emit('world:ready', undefined);
  }

  private begin(data: SaveData) {
    this.data = data;
    this.tool = null;
    this.playStart = performance.now();
    this.syncYardCollision();
    this.bus.emit('game:started', undefined);
  }

  /** Kacheln (Index in der Karte), die die Anbauten an Linas Haus belegen */
  houseAnnexTiles(stage = this.data?.house.stage ?? 0): number[] {
    const house = this.map.objects.find((o) => o.id === 'haus-lina');
    if (!house) return [];
    return annexOffsets(stage).map(([dx, dy]) => (house.y + dy) * this.map.width + house.x + dx);
  }

  /** Gartenmöbel und Hausanbauten als Hindernisse in die Karte übernehmen */
  syncYardCollision() {
    const yard = this.data?.yard;
    const garden = yard ? yardBlockedTiles(this.map, YARD_AREA, yard, this.yardLayout, furnitureInfo) : [];
    setExtraBlocked(this.map, [...garden, ...this.houseAnnexTiles()]);
  }

  /** Bisherige Spielzeit in Sekunden (inkl. der laufenden Sitzung) */
  playTime(): number {
    if (!this.data) return 0;
    return this.data.playTimeSec + Math.max(0, (performance.now() - this.playStart) / 1000);
  }

  /** Speichert (inkl. Spielzeit). Gibt false zurück, wenn der Browser-Speicher nicht verfügbar ist. */
  save(): boolean {
    if (!this.data) return false;
    const now = performance.now();
    this.data.playTimeSec += Math.max(0, (now - this.playStart) / 1000);
    this.playStart = now;
    return this.saves.save(this.data);
  }

  exportSave(): { fileName: string; json: string } | null {
    if (!this.data) return null;
    this.save();
    return { fileName: exportFileName(this.clock()), json: serializeSave(this.data) };
  }

  /** Prüft eine Datei, ohne sie schon zu übernehmen. */
  checkImport(json: string): ParseResult {
    return parseSave(json, this.spawnPoint(), this.clock(), this.saveOptions);
  }

  importSave(data: SaveData) {
    this.saves.save(data);
    this.begin(data);
  }

  deleteSave() {
    this.saves.clear();
  }

  setAppearance(appearance: Appearance) {
    if (!this.data) return;
    this.data.player.appearance = appearance;
    this.save();
    this.bus.emit('appearance:changed', appearance);
  }

  setFlag(flag: string, value = true) {
    if (!this.data) return;
    this.data.flags[flag] = value;
  }

  interactionContext(): InteractionContext {
    const now = this.clock();
    const day = formatIsoDay(now);
    return {
      now,
      season: getSeason(now),
      phase: getDayPhase(now),
      villageName: this.data?.villageName ?? '',
      birthday: this.data?.player.birthday ?? { day: 16, month: 6 },
      dayRandom: (hashString(day) % 1000) / 1000,
    };
  }
}

/** localStorage, falls verfügbar – sonst ein flüchtiger Speicher. */
export function browserStorage(): StorageLike {
  try {
    const probe = '__rina_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    const mem = new Map<string, string>();
    return {
      getItem: (k) => mem.get(k) ?? null,
      setItem: (k, v) => void mem.set(k, v),
      removeItem: (k) => void mem.delete(k),
    };
  }
}
