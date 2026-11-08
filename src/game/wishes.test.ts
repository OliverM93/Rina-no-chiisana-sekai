import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { addItem } from '../core/inventory';
import { applyMapFlags, isActive, objectById } from '../core/worldmap';
import { isKnownItem, itemDef, maxStackOf } from '../data/items';
import { VILLAGE_OBJECTS } from '../data/maps/village';
import { WISHES, wishFlag } from '../data/wishes';
import { activeWish, askWish, checkWishLetter, fulfillWish, matchesNeed, wishProgress, wishTeaser } from './wishes';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

function newSession(unlocked = true) {
  const s = new Session(memoryStorage(), () => new Date('2026-11-08T12:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  if (unlocked) s.data!.flags.thaliaBegruesst = true;
  return s;
}

describe('Herzenswünsche – Daten', () => {
  it('jeder Bewohner hat einen Wunsch, jeder Wunsch einen Ort auf der Karte', () => {
    for (const npc of ['gisela', 'olaf', 'christin', 'oli', 'jens', 'lars', 'thalia']) expect(WISHES.some((w) => w.npc === npc), npc).toBe(true);
    for (const w of WISHES) {
      const obj = VILLAGE_OBJECTS.find((o) => o.id === w.place);
      expect(obj, w.place).toBeTruthy();
      expect(obj!.requires).toBe(wishFlag(w.id));
    }
  });

  it('alles Gebrauchte gibt es im Spiel (Gegenstände, Blumenarten, Kategorien)', () => {
    for (const w of WISHES) {
      for (const n of w.needs) {
        expect([n.item, n.species, n.category].filter(Boolean).length, `${w.id}: ${n.label}`).toBe(1);
        if (n.item) expect(isKnownItem(n.item), n.item).toBe(true);
        if (n.species) expect(matchesNeed(n, n.species), n.species).toBe(true);
        if (n.category) expect(['fisch', 'insekt', 'fossil']).toContain(n.category);
      }
    }
  });

  it('Sternchen-Beiträge bleiben bescheiden (Spätspiel-Senke, kein Grind)', () => {
    for (const w of WISHES) expect(w.stars ?? 0).toBeLessThanOrEqual(5000);
  });
});

describe('Herzenswünsche – Ablauf', () => {
  it('erst wenn alle eingezogen sind', () => {
    const s = newSession(false);
    expect(activeWish(s, 'gisela')).toBeNull();
    expect(checkWishLetter(s)).toBe(false);
  });

  it('Omas Brief kommt genau einmal', () => {
    const s = newSession();
    expect(checkWishLetter(s)).toBe(true);
    expect(checkWishLetter(s)).toBe(false);
    expect(JSON.stringify(s.data!.mail)).toContain('herzenswuensche');
  });

  it('Bewohner deutet den Wunsch an, erzählt davon, zeigt den Stand', () => {
    const s = newSession();
    expect(wishTeaser(s, 'gisela')).toBeTruthy();
    const a = askWish(s, 'gisela')!;
    expect(a.canFulfill).toBe(false);
    expect(a.lines.join(' ')).toContain('Ludwig');
    expect(a.lines.at(-1)).toContain('0/5');
    expect(wishTeaser(s, 'gisela')).toBeNull();
    expect(askWish(s, 'gisela')!.lines.join(' ')).not.toContain('Hochzeitstag');
  });

  it('jede Farbe zählt: gemischte Rosen und Vergissmeinnicht erfüllen Omas Wunsch', () => {
    const s = newSession();
    const inv = s.data!.inventory;
    addItem(inv, 'rose', 2, maxStackOf);
    addItem(inv, 'rose-schwarz', 3, maxStackOf);
    addItem(inv, 'vergissmeinnicht', 5, maxStackOf);
    addItem(inv, 'wildblumen', 4, maxStackOf);
    addItem(inv, 'samen-rose', 3, maxStackOf); // Samen zählen nicht als Blume
    expect(wishProgress(s, activeWish(s, 'gisela')!).complete).toBe(true);
    const lines = fulfillWish(s, 'gisela')!;
    expect(lines.join(' ')).toContain('Ludwig');
    expect(s.data!.flags[wishFlag('oma-beet')]).toBe(true);
    expect(activeWish(s, 'gisela')).toBeNull();
    // genommen wurde nur, was gebraucht wurde
    const left = Object.fromEntries(inv.slots.filter(Boolean).map((x) => [x!.itemId, x!.count]));
    expect(left).toEqual({ wildblumen: 1, 'samen-rose': 3 });
    expect(s.data!.npcs.gisela.points).toBeGreaterThanOrEqual(30);
  });

  it('Sternchen werden erst beim Erfüllen abgezogen', () => {
    const s = newSession();
    s.data!.money = 3500;
    addItem(s.data!.inventory, 'ast', 20, maxStackOf);
    addItem(s.data!.inventory, 'stein', 10, maxStackOf);
    expect(wishProgress(s, activeWish(s, 'olaf')!).complete).toBe(true);
    s.data!.money = 2999;
    expect(fulfillWish(s, 'olaf')).toBeNull();
    s.data!.money = 3500;
    expect(fulfillWish(s, 'olaf')).not.toBeNull();
    expect(s.data!.money).toBe(500);
  });

  it('Kategorien: drei verschiedene Fische für Jens', () => {
    const s = newSession();
    for (const f of ['barsch', 'hering', 'hecht']) addItem(s.data!.inventory, f, 1, maxStackOf);
    addItem(s.data!.inventory, 'seestern', 1, maxStackOf);
    expect(itemDef('hecht')?.category).toBe('fisch');
    expect(fulfillWish(s, 'jens')).not.toBeNull();
  });

  it('ein erfüllter Wunsch lässt seinen Ort auf der Karte erscheinen', () => {
    const s = newSession();
    expect(isActive(s.map, 'herzbank')).toBe(false);
    for (const [id, n] of [['ast', 10], ['herzmuschel', 3], ['rose-rosa', 1]] as const) addItem(s.data!.inventory, id, n, maxStackOf);
    expect(fulfillWish(s, 'oli')).not.toBeNull();
    applyMapFlags(s.map, s.data!.flags);
    expect(objectById(s.map, 'herzbank')).toBeTruthy();
    expect(isActive(s.map, 'herzbank')).toBe(true);
  });
});
