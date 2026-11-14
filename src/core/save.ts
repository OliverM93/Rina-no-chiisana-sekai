/**
 * Spielstand: Format, Versionierung, Validierung, Speichern & Laden.
 *
 * Grundsätze:
 * - Jeder Spielstand trägt eine `version`. Ältere Stände werden über
 *   `MIGRATIONS` Schritt für Schritt auf die aktuelle Version gehoben.
 * - Nach der Migration wird alles „normalisiert“: fehlende Felder bekommen
 *   Standardwerte, kaputte Werte werden ersetzt. So geht nie ein Spielstand
 *   verloren, nur weil später neue Felder dazukommen.
 * - Vor jedem Überschreiben wird der vorherige Stand als Backup behalten.
 */
import { createStats, normalizeNumberRecord, normalizeStats, type Stats } from './progress';
import { type Appearance, DEFAULT_LINA, normalizeAppearance } from './appearance';
import { createNpcState, type NpcState, normalizeNpcState } from './friendship';
import { type Collection, normalizeCollection } from './catching';
import { type Garden, normalizeGarden } from './garden';
import { createBank, type Bank, normalizeBank, weekFromLegacyMonth } from './bank';
import { normalizeRecipeBook, type RecipeBook } from './crafting';
import { createPet, normalizePet, type PetState } from './pet';
import { type House, type HouseRules, type InfoFn, normalizeHouse, normalizeRoom, type Room, type RoomLayout } from './room';
import { createInventory, type Inventory, normalizeInventory, STORAGE_SIZE } from './inventory';
import { createMailbox, type Mailbox, normalizeMailbox } from './mail';
import { type DayMonth, DEFAULT_LINA_BIRTHDAY, formatIsoDay } from './time';

export const SAVE_VERSION = 16;
export const SAVE_KEY = 'rina-no-chiisana-sekai.save';
export const BACKUP_KEY = 'rina-no-chiisana-sekai.save.backup';

export type Facing = 'down' | 'up' | 'left' | 'right';

export interface PlayerSave {
  name: string;
  appearance: Appearance;
  /** Position in Weltkoordinaten (Pixel der Welt, nicht Kacheln). */
  x: number;
  y: number;
  facing: Facing;
  birthday: DayMonth;
}

export interface Settings {
  musicVolume: number; // 0..1
  sfxVolume: number; // 0..1
}

/** Ein Gegenstand, der auf dem Boden liegt (Weltkoordinaten). */
export interface GroundItem {
  id: string;
  itemId: string;
  x: number;
  y: number;
}

/** Zustand der Welt, der sich durch Lina ändert. */
export interface WorldState {
  /** Baum-ID → Tag der letzten Ernte */
  fruitHarvest: Record<string, string>;
  /** Baum-ID → Tag, an dem zuletzt ein Ast heruntergefallen ist */
  branchDay: Record<string, string>;
  /** Felsen-ID → Tag des letzten Klopfens */
  rockDay: Record<string, string>;
  /** Kachel-Index → Tag, an dem dort Blumen gepflückt wurden */
  flowerDay: Record<string, string>;
  /** Heute schon eingesammelte tägliche Funde */
  picked: { day: string; ids: string[] };
  /** Herumliegende Gegenstände (z. B. heruntergefallenes Obst) */
  ground: GroundItem[];
  /** Linas Beet: Platz „x,y“ → Pflanze */
  garden: Garden;
  /** Ställe: uid → Tag, an dem zuletzt Eier abgeholt wurden */
  coopDay: Record<string, string>;
  /** Gemeinsame Momente (z. B. 'picknick', 'sterne') → Tag, an dem sie zuletzt waren */
  dates: Record<string, string>;
}

export function createWorldState(): WorldState {
  return { fruitHarvest: {}, branchDay: {}, rockDay: {}, flowerDay: {}, picked: { day: '', ids: [] }, ground: [], garden: {}, coopDay: {}, dates: {} };
}

export interface SaveData {
  version: number;
  createdAt: string;
  lastPlayedAt: string;
  playTimeSec: number;
  villageName: string;
  player: PlayerSave;
  settings: Settings;
  /** Kleine Story-/Fortschritts-Flags, z. B. `introSeen`. */
  flags: Record<string, boolean>;
  inventory: Inventory;
  /** Sternchen ⭐ */
  money: number;
  /** Freundschaft je Bewohner-ID */
  npcs: Record<string, NpcState>;
  mail: Mailbox;
  world: WorldState;
  /** Sammelbuch: gefangene Fische & Insekten */
  collection: Collection;
  /** Vorratstruhe: Lagerplätze außerhalb der Tasche */
  storage: Inventory;
  /** Linas Haus: Ausbaustufe, Räume, Möbel */
  house: House;
  /** Olafs Dorfkasse */
  bank: Bank;
  /** Gelernte Werkbank-Rezepte */
  recipes: RecipeBook;
  /** Winston, Linas Dackel */
  pet: PetState;
  /** Linas Garten: Zäune, Wege, Gartenmöbel … */
  yard: Room;
  /** Kunstwerke, die Lina der Galerie von Jens gestiftet hat */
  gallery: string[];
  /** Zähler für den Fortschritt (Verkauft, Gekauft, Gebaut, Gekocht) */
  stats: Stats;
  /** Spielzeit (s), zu der ein Story-Brief kam – der Einzug folgt nach kurzer Spielzeit */
  story: Record<string, number>;
}

export interface SaveOptions {
  /** Prüft, ob es einen Gegenstand (noch) gibt – unbekannte werden beim Laden entfernt. */
  isKnownItem?: (id: string) => boolean;
  /** IDs aller Bewohner, für die ein Freundschaftszustand angelegt wird */
  npcIds?: readonly string[];
  /** Einrichtung für neue/alte Spielstände ohne Haus */
  defaultHouse?: House;
  /** Ausbaustufen & Räume */
  houseRules?: HouseRules;
  /** Größe & Art der Möbel (für die Raumlogik) */
  furnitureInfo?: InfoFn;
  /** Gibt es dieses Rezept (noch)? */
  isKnownRecipe?: (id: string) => boolean;
  /** Rezepte, die Lina immer kennt */
  startRecipes?: readonly string[];
  /** Form des Gartens (Größe, freizuhaltende Felder) */
  yardLayout?: RoomLayout;
}

const EMPTY_HOUSE: House = { stage: 0, rooms: [{ id: 'haupt', wallpaper: '', floor: '', items: [] }] };
const FALLBACK_RULES: HouseRules = {
  layouts: () => [{ id: 'haupt', name: 'Zimmer', w: 8, h: 6, exits: [] }],
  maxStage: 0,
  emptyRoom: (id) => ({ id, wallpaper: '', floor: '', items: [] }),
};

export const DEFAULT_SETTINGS: Settings = { musicVolume: 0.6, sfxVolume: 0.8 };
export const DEFAULT_VILLAGE_NAME = 'Wolkenwiese';

export interface NewGameOptions {
  villageName: string;
  appearance: Appearance;
  spawn: { x: number; y: number };
  now: Date;
  house?: House;
  recipes?: readonly string[];
}

export function createNewSave(opts: NewGameOptions): SaveData {
  const iso = opts.now.toISOString();
  return {
    version: SAVE_VERSION,
    createdAt: iso,
    lastPlayedAt: iso,
    playTimeSec: 0,
    villageName: sanitizeVillageName(opts.villageName),
    player: {
      name: 'Lina',
      appearance: normalizeAppearance(opts.appearance),
      x: opts.spawn.x,
      y: opts.spawn.y,
      facing: 'down',
      birthday: { ...DEFAULT_LINA_BIRTHDAY },
    },
    settings: { ...DEFAULT_SETTINGS },
    flags: {},
    inventory: createInventory(),
    storage: createInventory(STORAGE_SIZE),
    money: 0,
    npcs: {},
    mail: createMailbox(),
    world: createWorldState(),
    collection: {},
    house: structuredClone(opts.house ?? EMPTY_HOUSE),
    bank: createBank(),
    recipes: [...(opts.recipes ?? [])],
    pet: createPet(),
    yard: emptyYard(),
    gallery: [],
    stats: createStats(),
    story: {},
  };
}

export function sanitizeVillageName(name: unknown): string {
  if (typeof name !== 'string') return DEFAULT_VILLAGE_NAME;
  const trimmed = name.replace(/\s+/g, ' ').trim().slice(0, 24);
  return trimmed.length > 0 ? trimmed : DEFAULT_VILLAGE_NAME;
}

// ---------------------------------------------------------------------------
// Migrationen: MIGRATIONS[n] hebt einen Stand von Version n auf n + 1.
// ---------------------------------------------------------------------------

type RawSave = Record<string, unknown>;

export const MIGRATIONS: Record<number, (old: RawSave) => RawSave> = {
  // v1 → v2 (M2): Inventar, Sternchen, Freundschaft, Briefkasten, Weltzustand.
  // Die neuen Felder füllt `normalizeSave` mit Startwerten; Oma Gisela begrüßt
  // Lina beim nächsten Laden (Flag `giselaWelcomed` fehlt noch).
  1: (old) => ({ ...old, money: 0 }),
  // v2 → v3 (Charakter-Feinschliff): neue Aussehen-Felder (Augenfarbe, Sommersprossen, Lächeln …)
  // ergänzt `normalizeAppearance` mit Standardwerten.
  2: (old) => ({ ...old }),
  // v3 → v4 (M4 Natur): Sammelbuch und Beet. Startwerte ergänzt `normalizeSave`;
  // die Werkzeuge bekommt Lina beim nächsten Gespräch von Oma Gisela.
  3: (old) => ({ ...old }),
  // v4 → v5 (M5 Einrichtung): Linas Zimmer. `normalizeSave` richtet es mit der Start-Einrichtung ein.
  4: (old) => ({ ...old }),
  // v5 → v6 (M6 Ausbau): aus dem einen Zimmer wird ein Haus mit Räumen; dazu Olafs Dorfkasse.
  5: (old) => {
    const { home, ...rest } = old as Record<string, unknown> & { home?: Record<string, unknown> };
    return home && typeof home === 'object' ? { ...rest, house: { stage: 0, rooms: [{ id: 'haupt', ...home }] } } : rest;
  },
  // v6 → v7 (M6b): Werkbank-Rezepte, Winston und Gesichtsform (Lina: schmal). Startwerte ergänzt `normalizeSave`.
  6: (old) => ({ ...old }),
  // v7 → v8 (M6c Garten): Linas Garten. `normalizeSave` legt ihn leer an.
  7: (old) => ({ ...old }),
  // v8 → v9 (M6d Tiere): Eier-Abholtage der Ställe. `normalizeWorld` ergänzt sie leer.
  8: (old) => ({ ...old }),
  // v9 → v10 (M7a Oli): gemeinsame Momente (Picknick, Sterne gucken). `normalizeWorld` ergänzt sie leer.
  9: (old) => ({ ...old }),
  // v10 → v11 (M7f Galerie): gestiftete Kunstwerke. `normalizeSave` legt die Liste leer an.
  10: (old) => ({ ...old }),
  // v11 → v12 (M8d Sparbuch): Guthaben & Zinsmonat in der Dorfkasse. `normalizeBank` ergänzt sie (Guthaben 0).
  11: (old) => ({ ...old }),
  // v12 → v13 (M8j Fortschritt statt Kalender): Zähler & Story-Wartezeiten. Die Zähler werden grob aus dem
  // Spielstand geschätzt (Möbel im Haus/Garten = gekauft, Sternchen = verkauft), damit niemand zurückfällt.
  12: (old) => {
    const house = old.house as { rooms?: Array<{ items?: unknown[] }> } | undefined;
    const yard = old.yard as { items?: unknown[] } | undefined;
    const furniture = (house?.rooms ?? []).reduce((n, r) => n + (Array.isArray(r.items) ? r.items.length : 0), 0) + (Array.isArray(yard?.items) ? yard.items.length : 0);
    const money = typeof old.money === 'number' ? old.money : 0;
    return { ...old, stats: { sold: Math.max(0, Math.floor(money)), bought: Math.max(0, furniture - 3), crafted: 0, cooked: 0 }, story: {} };
  },
  // v13 → v14 (Vorratstruhe): Lagerplätze außerhalb der Tasche. `normalizeSave` legt sie leer an.
  13: (old) => ({ ...old }),
  // v14 → v15 (Sternchen-Balancing): Sparbuch-Zinsen kommen jetzt wöchentlich. Der alte Zinsmonat
  // („JJJJ-MM“) wird zur Woche des Monatsersten – so gehen keine Zinsen verloren und keine doppelt.
  14: (old) => {
    const bank = old.bank as Record<string, unknown> | undefined;
    if (!bank || typeof bank !== 'object') return { ...old };
    const { interestMonth, ...rest } = bank;
    return { ...old, bank: { ...rest, interestWeek: typeof interestMonth === 'string' ? weekFromLegacyMonth(interestMonth) : '' } };
  },
  // v15 → v16 (Rekordfänge): Sammelbuch-Einträge von Fischen können einen größten Fang (`bestCm`) tragen.
  // Alte Einträge bleiben unverändert; die erste Länge wird beim nächsten Fang vermerkt.
  15: (old) => ({ ...old }),
};

export function migrate(raw: RawSave, migrations = MIGRATIONS, target = SAVE_VERSION): RawSave {
  let current = raw;
  let version = typeof current.version === 'number' ? current.version : 1;
  while (version < target) {
    const step = migrations[version];
    if (!step) throw new Error(`Keine Migration von Version ${version} vorhanden.`);
    current = step(current);
    version += 1;
    current.version = version;
  }
  return current;
}

// ---------------------------------------------------------------------------
// Normalisieren
// ---------------------------------------------------------------------------

const isObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

const finite = (v: unknown, fallback: number) =>
  typeof v === 'number' && Number.isFinite(v) ? v : fallback;

const clamp01 = (v: unknown, fallback: number) => Math.min(1, Math.max(0, finite(v, fallback)));

const isoOr = (v: unknown, fallback: string) =>
  typeof v === 'string' && !Number.isNaN(Date.parse(v)) ? v : fallback;

const FACINGS: Facing[] = ['down', 'up', 'left', 'right'];

function normalizeDayMonth(v: unknown, fallback: DayMonth): DayMonth {
  if (!isObj(v)) return { ...fallback };
  const day = Math.round(finite(v.day, fallback.day));
  const month = Math.round(finite(v.month, fallback.month));
  if (month < 1 || month > 12 || day < 1 || day > 31) return { ...fallback };
  return { day, month };
}

/**
 * Füllt fehlende/ungültige Felder auf. `spawn` wird genutzt, falls die
 * gespeicherte Position unbrauchbar ist.
 */
function stringRecord(v: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (isObj(v)) for (const [k, val] of Object.entries(v)) if (typeof val === 'string') out[k] = val;
  return out;
}

export function normalizeWorld(raw: unknown, isKnownItem: (id: string) => boolean): WorldState {
  const w = createWorldState();
  if (!isObj(raw)) return w;
  w.fruitHarvest = stringRecord(raw.fruitHarvest);
  w.branchDay = stringRecord(raw.branchDay);
  w.rockDay = stringRecord(raw.rockDay);
  w.flowerDay = stringRecord(raw.flowerDay);
  if (isObj(raw.picked) && typeof raw.picked.day === 'string' && Array.isArray(raw.picked.ids)) {
    w.picked = { day: raw.picked.day, ids: raw.picked.ids.filter((i): i is string => typeof i === 'string') };
  }
  if (Array.isArray(raw.ground)) {
    for (const g of raw.ground) {
      if (!isObj(g)) continue;
      const { id, itemId, x, y } = g;
      if (typeof id === 'string' && typeof itemId === 'string' && isKnownItem(itemId) && typeof x === 'number' && typeof y === 'number') {
        w.ground.push({ id, itemId, x, y });
      }
    }
  }
  w.garden = normalizeGarden(raw.garden, isKnownItem);
  w.coopDay = stringRecord(raw.coopDay);
  w.dates = stringRecord(raw.dates);
  return w;
}

export function emptyYard(): Room {
  return { id: 'garten', wallpaper: '', floor: '', items: [] };
}

function withStart(book: RecipeBook, start: readonly string[]): RecipeBook {
  for (const id of start) if (!book.includes(id)) book.push(id);
  return book;
}

export function normalizeSave(raw: RawSave, spawn: { x: number; y: number }, now: Date, opts: SaveOptions = {}): SaveData {
  const isKnownItem = opts.isKnownItem ?? (() => true);
  const npcs: Record<string, NpcState> = {};
  if (isObj(raw.npcs)) for (const [id, st] of Object.entries(raw.npcs)) npcs[id] = normalizeNpcState(st);
  for (const id of opts.npcIds ?? []) if (!npcs[id]) npcs[id] = createNpcState();
  const nowIso = now.toISOString();
  const p = isObj(raw.player) ? raw.player : {};
  const s = isObj(raw.settings) ? raw.settings : {};
  const flags: Record<string, boolean> = {};
  if (isObj(raw.flags)) {
    for (const [k, v] of Object.entries(raw.flags)) if (typeof v === 'boolean') flags[k] = v;
  }
  return {
    version: SAVE_VERSION,
    createdAt: isoOr(raw.createdAt, nowIso),
    lastPlayedAt: isoOr(raw.lastPlayedAt, nowIso),
    playTimeSec: Math.max(0, finite(raw.playTimeSec, 0)),
    villageName: sanitizeVillageName(raw.villageName),
    player: {
      name: typeof p.name === 'string' && p.name.trim() ? p.name.trim().slice(0, 20) : 'Lina',
      appearance: normalizeAppearance(p.appearance, DEFAULT_LINA),
      x: finite(p.x, spawn.x),
      y: finite(p.y, spawn.y),
      facing: FACINGS.includes(p.facing as Facing) ? (p.facing as Facing) : 'down',
      birthday: normalizeDayMonth(p.birthday, DEFAULT_LINA_BIRTHDAY),
    },
    settings: {
      musicVolume: clamp01(s.musicVolume, DEFAULT_SETTINGS.musicVolume),
      sfxVolume: clamp01(s.sfxVolume, DEFAULT_SETTINGS.sfxVolume),
    },
    flags,
    inventory: normalizeInventory(raw.inventory, isKnownItem),
    storage: normalizeInventory(raw.storage, isKnownItem, STORAGE_SIZE),
    money: Math.max(0, Math.floor(finite(raw.money, 0))),
    npcs,
    mail: normalizeMailbox(raw.mail),
    world: normalizeWorld(raw.world, isKnownItem),
    collection: normalizeCollection(raw.collection, isKnownItem),
    house: normalizeHouse(raw.house, opts.defaultHouse ?? EMPTY_HOUSE, opts.houseRules ?? FALLBACK_RULES, isKnownItem, opts.furnitureInfo ?? (() => undefined)),
    bank: normalizeBank(raw.bank),
    recipes: withStart(normalizeRecipeBook(raw.recipes, opts.isKnownRecipe ?? (() => true)), opts.startRecipes ?? []),
    pet: normalizePet(raw.pet),
    gallery: Array.isArray(raw.gallery) ? [...new Set(raw.gallery.filter((g): g is string => typeof g === 'string' && isKnownItem(g)))] : [],
    stats: normalizeStats(raw.stats),
    story: normalizeNumberRecord(raw.story),
    yard: normalizeRoom(raw.yard, emptyYard(), opts.yardLayout ?? { id: 'garten', name: 'Garten', w: 0, h: 0, exits: [] }, isKnownItem, opts.furnitureInfo ?? (() => undefined)),
  };
}

// ---------------------------------------------------------------------------
// (De-)Serialisieren
// ---------------------------------------------------------------------------

export type ParseResult = { ok: true; data: SaveData } | { ok: false; error: string };

export function serializeSave(data: SaveData): string {
  return JSON.stringify(data, null, 2);
}

export function parseSave(json: string, spawn: { x: number; y: number }, now: Date, opts: SaveOptions = {}): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return { ok: false, error: 'Die Datei ist kein gültiger Spielstand (kein JSON).' };
  }
  if (!isObj(raw) || !isObj(raw.player)) {
    return { ok: false, error: 'Die Datei sieht nicht wie ein Spielstand aus.' };
  }
  const version = typeof raw.version === 'number' ? raw.version : 1;
  if (version > SAVE_VERSION) {
    return {
      ok: false,
      error: 'Dieser Spielstand stammt aus einer neueren Spielversion. Bitte das Spiel aktualisieren.',
    };
  }
  try {
    const migrated = migrate(raw);
    return { ok: true, data: normalizeSave(migrated, spawn, now, opts) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/** z. B. „rina-spielstand-2026-11-02.json“ */
export function exportFileName(date: Date): string {
  return `rina-spielstand-${formatIsoDay(date)}.json`;
}

// ---------------------------------------------------------------------------
// Persistenz (localStorage oder austauschbar für Tests)
// ---------------------------------------------------------------------------

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export class SaveManager {
  constructor(
    private readonly storage: StorageLike,
    private readonly spawn: { x: number; y: number },
    private readonly now: () => Date = () => new Date(),
    private readonly opts: SaveOptions = {},
  ) {}

  hasSave(): boolean {
    return this.safeGet(SAVE_KEY) !== null || this.safeGet(BACKUP_KEY) !== null;
  }

  /** Lädt den Spielstand; fällt bei Beschädigung auf das Backup zurück. */
  load(): SaveData | null {
    for (const key of [SAVE_KEY, BACKUP_KEY]) {
      const json = this.safeGet(key);
      if (json === null) continue;
      const result = parseSave(json, this.spawn, this.now(), this.opts);
      if (result.ok) return result.data;
    }
    return null;
  }

  /** Speichert und behält den bisherigen Stand als Backup. Gibt `false` bei Fehlern zurück. */
  save(data: SaveData): boolean {
    try {
      const previous = this.storage.getItem(SAVE_KEY);
      const stamped: SaveData = { ...data, lastPlayedAt: this.now().toISOString() };
      const json = serializeSave(stamped);
      if (previous !== null && previous !== json) this.storage.setItem(BACKUP_KEY, previous);
      this.storage.setItem(SAVE_KEY, json);
      return true;
    } catch {
      return false;
    }
  }

  clear(): void {
    try {
      this.storage.removeItem(SAVE_KEY);
      this.storage.removeItem(BACKUP_KEY);
    } catch {
      /* Speicher nicht verfügbar – nichts zu tun */
    }
  }

  private safeGet(key: string): string | null {
    try {
      return this.storage.getItem(key);
    } catch {
      return null;
    }
  }
}

/** Einfacher In-Memory-Speicher – für Tests oder wenn localStorage blockiert ist. */
export class MemoryStorage implements StorageLike {
  private map = new Map<string, string>();
  getItem(key: string) {
    return this.map.has(key) ? (this.map.get(key) as string) : null;
  }
  setItem(key: string, value: string) {
    this.map.set(key, value);
  }
  removeItem(key: string) {
    this.map.delete(key);
  }
}
