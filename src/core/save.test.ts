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
    expect(result.data.version).toBe(SAVE_VERSION);
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

describe('Version 6 (M6 Ausbau)', () => {
  it('macht aus dem Zimmer ein Haus und legt die Dorfkasse an', () => {
    const v5 = { ...freshSave(), version: 5 } as Record<string, unknown>;
    delete v5.house;
    delete v5.bank;
    v5.home = { wallpaper: 'tapete-shoji', floor: 'boden-tatami', items: [{ uid: 'a', itemId: 'andon', x: 7, y: 0, rot: 0 }] };
    const rules = { layouts: () => [{ id: 'haupt', name: 'Zimmer', w: 8, h: 6, exits: [] }], maxStage: 0, emptyRoom: (id: string) => ({ id, wallpaper: '', floor: '', items: [] }) };
    const result = parseSave(JSON.stringify(v5), SPAWN, NOW, { houseRules: rules, furnitureInfo: () => ({ w: 1, d: 1 }) });
    expect(result.ok && result.data.version).toBe(SAVE_VERSION);
    if (!result.ok) return;
    expect(result.data.house.rooms[0]).toMatchObject({ id: 'haupt', wallpaper: 'tapete-shoji', floor: 'boden-tatami' });
    expect(result.data.house.rooms[0].items.map((i) => i.itemId)).toEqual(['andon']);
    expect(result.data.bank).toEqual({ loan: 0 });
  });
});

describe('Version 7 (M6b Werkbank & Winston)', () => {
  it('ergänzt Start-Rezepte und Winston', () => {
    const v6 = { ...freshSave(), version: 6 } as Record<string, unknown>;
    delete v6.recipes;
    delete v6.pet;
    const result = parseSave(JSON.stringify(v6), SPAWN, NOW, { startRecipes: ['ast-hocker'] });
    expect(result.ok && result.data.version).toBe(SAVE_VERSION);
    if (!result.ok) return;
    expect(result.data.recipes).toEqual(['ast-hocker']);
    expect(result.data.pet).toEqual({ pettedDay: '', pets: 0, digDay: '' });
  });

  it('behält gelernte Rezepte und entfernt unbekannte', () => {
    const s = { ...freshSave(), recipes: ['steinlaterne', 'gibtsnicht'] };
    const result = parseSave(JSON.stringify(s), SPAWN, NOW, { startRecipes: ['ast-hocker'], isKnownRecipe: (id) => id !== 'gibtsnicht' });
    expect(result.ok && result.data.recipes).toEqual(['steinlaterne', 'ast-hocker']);
  });
});

describe('Version 8 (M6c Garten)', () => {
  it('legt einen leeren Garten an und behält Gartenmöbel', () => {
    const v7 = { ...freshSave(), version: 7 } as Record<string, unknown>;
    delete v7.yard;
    const layout = { id: 'garten', name: 'Garten', w: 6, h: 4, exits: [], reserved: [[0, 0]] as Array<[number, number]> };
    const opts = { yardLayout: layout, furnitureInfo: () => ({ w: 1, d: 1 }) };
    const r1 = parseSave(JSON.stringify(v7), SPAWN, NOW, opts);
    expect(r1.ok && r1.data.yard).toEqual({ id: 'garten', wallpaper: '', floor: '', items: [] });
    const s = { ...freshSave(), yard: { id: 'garten', items: [{ uid: 'a', itemId: 'zaun', x: 2, y: 1, rot: 0 }, { uid: 'b', itemId: 'zaun', x: 0, y: 0, rot: 0 }] } };
    const r2 = parseSave(JSON.stringify(s), SPAWN, NOW, opts);
    expect(r2.ok && r2.data.yard.items.map((i) => i.uid)).toEqual(['a']);
  });
});

describe('Version 9 (M6d Tiere)', () => {
  it('ergänzt die Abholtage der Ställe und behält sie', () => {
    const v8 = { ...freshSave(), version: 8 } as Record<string, unknown>;
    delete (v8.world as Record<string, unknown>).coopDay;
    const r1 = parseSave(JSON.stringify(v8), SPAWN, NOW);
    expect(r1.ok && r1.data.world.coopDay).toEqual({});
    const s = freshSave();
    s.world.coopDay = { 'stall-1': '2026-11-04' };
    const r2 = parseSave(JSON.stringify(s), SPAWN, NOW);
    expect(r2.ok && r2.data.world.coopDay).toEqual({ 'stall-1': '2026-11-04' });
  });
});

describe('Version 10 (M7a Oli)', () => {
  it('ergänzt gemeinsame Momente', () => {
    const v9 = { ...freshSave(), version: 9 } as Record<string, unknown>;
    delete (v9.world as Record<string, unknown>).dates;
    const r = parseSave(JSON.stringify(v9), SPAWN, NOW);
    expect(r.ok && r.data.version).toBe(SAVE_VERSION);
    expect(r.ok && r.data.world.dates).toEqual({});
  });
});

describe('Version 11 (M7f Galerie)', () => {
  it('ergänzt die Galerie und entfernt Doppelte & Unbekannte', () => {
    const v10 = { ...freshSave(), version: 10 } as Record<string, unknown>;
    delete v10.gallery;
    const r1 = parseSave(JSON.stringify(v10), SPAWN, NOW);
    expect(r1.ok && r1.data.gallery).toEqual([]);
    const s = { ...freshSave(), gallery: ['a', 'a', 'weg', 3] };
    const r2 = parseSave(JSON.stringify(s), SPAWN, NOW, { isKnownItem: (id) => id !== 'weg' });
    expect(r2.ok && r2.data.gallery).toEqual(['a']);
  });
});

describe('Export', () => {
  it('erzeugt einen Dateinamen mit Datum', () => {
    expect(exportFileName(NOW)).toBe('rina-spielstand-2026-11-02.json');
  });
});
