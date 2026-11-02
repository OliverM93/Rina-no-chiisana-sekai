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
import { type Appearance, DEFAULT_LINA, normalizeAppearance } from './appearance';
import { type DayMonth, DEFAULT_LINA_BIRTHDAY, formatIsoDay } from './time';

export const SAVE_VERSION = 1;
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
}

export const DEFAULT_SETTINGS: Settings = { musicVolume: 0.6, sfxVolume: 0.8 };
export const DEFAULT_VILLAGE_NAME = 'Wolkenwiese';

export interface NewGameOptions {
  villageName: string;
  appearance: Appearance;
  spawn: { x: number; y: number };
  now: Date;
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
  // Beispiel für später:
  // 1: (old) => ({ ...old, version: 2, inventory: [] }),
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
export function normalizeSave(raw: RawSave, spawn: { x: number; y: number }, now: Date): SaveData {
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
  };
}

// ---------------------------------------------------------------------------
// (De-)Serialisieren
// ---------------------------------------------------------------------------

export type ParseResult = { ok: true; data: SaveData } | { ok: false; error: string };

export function serializeSave(data: SaveData): string {
  return JSON.stringify(data, null, 2);
}

export function parseSave(json: string, spawn: { x: number; y: number }, now: Date): ParseResult {
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
    return { ok: true, data: normalizeSave(migrated, spawn, now) };
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
  ) {}

  hasSave(): boolean {
    return this.safeGet(SAVE_KEY) !== null || this.safeGet(BACKUP_KEY) !== null;
  }

  /** Lädt den Spielstand; fällt bei Beschädigung auf das Backup zurück. */
  load(): SaveData | null {
    for (const key of [SAVE_KEY, BACKUP_KEY]) {
      const json = this.safeGet(key);
      if (json === null) continue;
      const result = parseSave(json, this.spawn, this.now());
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
