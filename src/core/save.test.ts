import { describe, expect, it } from 'vitest';
import { DEFAULT_LINA } from './appearance';
import {
  BACKUP_KEY,
  createNewSave,
  DEFAULT_VILLAGE_NAME,
  exportFileName,
  MemoryStorage,
  migrate,
  parseSave,
  SAVE_KEY,
  SAVE_VERSION,
  SaveManager,
  sanitizeVillageName,
  serializeSave,
} from './save';

const NOW = new Date(2026, 10, 2, 14, 0, 0);
const SPAWN = { x: 100, y: 200 };

function freshSave() {
  return createNewSave({ villageName: 'Wolkenwiese', appearance: DEFAULT_LINA, spawn: SPAWN, now: NOW });
}

describe('Neuer Spielstand', () => {
  it('enthält sinnvolle Startwerte', () => {
    const s = freshSave();
    expect(s.version).toBe(SAVE_VERSION);
    expect(s.player.name).toBe('Lina');
    expect(s.player.x).toBe(100);
    expect(s.player.birthday).toEqual({ day: 16, month: 6 });
    expect(s.villageName).toBe('Wolkenwiese');
    expect(s.flags).toEqual({});
  });

  it('säubert Dorfnamen', () => {
    expect(sanitizeVillageName('  Kirsch   tal ')).toBe('Kirsch tal');
    expect(sanitizeVillageName('')).toBe(DEFAULT_VILLAGE_NAME);
    expect(sanitizeVillageName(42)).toBe(DEFAULT_VILLAGE_NAME);
    expect(sanitizeVillageName('x'.repeat(50))).toHaveLength(24);
  });
});

describe('Serialisieren & Laden', () => {
  it('übersteht einen Hin- und Rückweg unverändert', () => {
    const s = freshSave();
    s.flags.introSeen = true;
    s.player.facing = 'left';
    const result = parseSave(serializeSave(s), SPAWN, NOW);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(s);
  });

  it('meldet kaputte Dateien freundlich', () => {
    const notJson = parseSave('{oops', SPAWN, NOW);
    expect(notJson.ok).toBe(false);
    const wrongShape = parseSave('[1,2,3]', SPAWN, NOW);
    expect(wrongShape.ok).toBe(false);
  });

  it('lehnt Spielstände aus der Zukunft ab', () => {
    const s = { ...freshSave(), version: SAVE_VERSION + 1 };
    const result = parseSave(JSON.stringify(s), SPAWN, NOW);
    expect(result.ok).toBe(false);
  });

  it('ergänzt fehlende und ersetzt ungültige Felder', () => {
    const partial = {
      version: 1,
      player: { x: 'kaputt', y: 5, facing: 'seitwärts', appearance: { hairColor: 'lila', hairStyle: 'bob' } },
      settings: { musicVolume: 7 },
      flags: { introSeen: true, quatsch: 'ja' },
    };
    const result = parseSave(JSON.stringify(partial), SPAWN, NOW);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.player.x).toBe(SPAWN.x);
    expect(result.data.player.y).toBe(5);
    expect(result.data.player.facing).toBe('down');
    expect(result.data.player.appearance.hairStyle).toBe('bob');
    expect(result.data.player.appearance.hairColor).toBe(DEFAULT_LINA.hairColor);
    expect(result.data.settings.musicVolume).toBe(1);
    expect(result.data.flags).toEqual({ introSeen: true });
    expect(result.data.villageName).toBe(DEFAULT_VILLAGE_NAME);
  });
});

describe('Migrationen', () => {
  it('führt Schritte nacheinander aus', () => {
    const migrations = {
      1: (old: Record<string, unknown>) => ({ ...old, a: 1 }),
      2: (old: Record<string, unknown>) => ({ ...old, b: (old.a as number) + 1 }),
    };
    const out = migrate({ version: 1 }, migrations, 3);
    expect(out).toEqual({ version: 3, a: 1, b: 2 });
  });

  it('bricht ab, wenn eine Migration fehlt', () => {
    expect(() => migrate({ version: 1 }, {}, 2)).toThrow();
  });
});

describe('SaveManager', () => {
  it('speichert, lädt und legt Backups an', () => {
    const storage = new MemoryStorage();
    const manager = new SaveManager(storage, SPAWN, () => NOW);
    expect(manager.hasSave()).toBe(false);
    expect(manager.load()).toBeNull();

    const s = freshSave();
    expect(manager.save(s)).toBe(true);
    expect(manager.hasSave()).toBe(true);
    expect(storage.getItem(BACKUP_KEY)).toBeNull();

    s.player.x = 999;
    manager.save(s);
    expect(storage.getItem(BACKUP_KEY)).not.toBeNull();
    expect(manager.load()?.player.x).toBe(999);
  });

  it('fällt bei beschädigtem Spielstand auf das Backup zurück', () => {
    const storage = new MemoryStorage();
    const manager = new SaveManager(storage, SPAWN, () => NOW);
    const s = freshSave();
    manager.save(s);
    s.player.x = 123;
    manager.save(s);
    storage.setItem(SAVE_KEY, '{kaputt');
    expect(manager.load()?.player.x).toBe(SPAWN.x);
  });

  it('übersteht einen gesperrten Speicher ohne Absturz', () => {
    const broken = {
      getItem: () => {
        throw new Error('blockiert');
      },
      setItem: () => {
        throw new Error('voll');
      },
      removeItem: () => {
        throw new Error('blockiert');
      },
    };
    const manager = new SaveManager(broken, SPAWN, () => NOW);
    expect(manager.hasSave()).toBe(false);
    expect(manager.load()).toBeNull();
    expect(manager.save(freshSave())).toBe(false);
    expect(() => manager.clear()).not.toThrow();
  });

  it('löscht auf Wunsch alles', () => {
    const storage = new MemoryStorage();
    const manager = new SaveManager(storage, SPAWN, () => NOW);
    manager.save(freshSave());
    manager.save(freshSave());
    manager.clear();
    expect(manager.hasSave()).toBe(false);
  });
});

describe('Version 2 (M2)', () => {
  it('hebt alte Spielstände an und ergänzt Tasche, Sternchen & Co.', () => {
    const v1 = {
      version: 1,
      createdAt: NOW.toISOString(),
      villageName: 'Altdorf',
      player: { name: 'Lina', x: 50, y: 60, facing: 'up', appearance: DEFAULT_LINA },
      flags: { introSeen: true },
    };
    const result = parseSave(JSON.stringify(v1), SPAWN, NOW, { npcIds: ['gisela'] });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.version).toBe(SAVE_VERSION);
    expect(result.data.villageName).toBe('Altdorf');
    expect(result.data.money).toBe(0);
    expect(result.data.inventory.slots.every((s) => s === null)).toBe(true);
    expect(result.data.npcs.gisela.points).toBe(0);
    expect(result.data.flags.giselaWelcomed).toBeUndefined();
  });

  it('entfernt unbekannte Gegenstände beim Laden', () => {
    const s = freshSave();
    s.inventory.slots[0] = { itemId: 'apfel', count: 2 };
    s.inventory.slots[1] = { itemId: 'gibtsnicht', count: 1 };
    s.world.ground.push({ id: 'g', itemId: 'gibtsnicht', x: 1, y: 1 });
    const result = parseSave(serializeSave(s), SPAWN, NOW, { isKnownItem: (id) => id === 'apfel' });
    expect(result.ok && result.data.inventory.slots[1]).toBeNull();
    expect(result.ok && result.data.world.ground).toEqual([]);
  });
});

describe('Version 4 (M4 Natur)', () => {
  it('ergänzt Sammelbuch und Beet, behält alles andere', () => {
    const v3 = { ...freshSave(), version: 3, money: 123 } as Record<string, unknown>;
    delete v3.collection;
    delete (v3.world as Record<string, unknown>).garden;
    const result = parseSave(JSON.stringify(v3), SPAWN, NOW);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.version).toBe(4);
    expect(result.data.money).toBe(123);
    expect(result.data.collection).toEqual({});
    expect(result.data.world.garden).toEqual({});
  });

  it('speichert Fänge und Pflanzen', () => {
    const s = freshSave();
    s.collection.barsch = { count: 3, firstDay: '2026-05-01' };
    s.world.garden['7,11'] = { flower: 'tulpe', stage: 2, wateredDay: '2026-05-01', grewDay: '2026-05-01' };
    const result = parseSave(serializeSave(s), SPAWN, NOW);
    expect(result.ok && result.data.collection.barsch.count).toBe(3);
    expect(result.ok && result.data.world.garden['7,11'].stage).toBe(2);
  });
});

describe('Export', () => {
  it('erzeugt einen Dateinamen mit Datum', () => {
    expect(exportFileName(NOW)).toBe('rina-spielstand-2026-11-02.json');
  });
});
