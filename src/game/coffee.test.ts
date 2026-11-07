import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { DRINK_BY_ID, DRINKS, MACHINES } from '../data/coffee';
import { FURNITURE_BY_ITEM } from '../data/furniture';
import { cupsToday, drinkCoffee, drinksFor, KICK_MAX, kickActive, MANY_CUPS } from './coffee';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function session() {
  const m = new Map<string, string>();
  const storage: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  const s = new Session(storage, () => new Date('2026-07-10T09:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return s;
}

describe('Siebträgermaschinen', () => {
  it('vier Preisklassen: teurer = mehr Getränke, alle sind Möbel, Olis Maschine ist die zweite', () => {
    expect(MACHINES).toHaveLength(4);
    for (const m of MACHINES) {
      expect(FURNITURE_BY_ITEM[m.itemId], m.itemId).toBeTruthy();
      for (const d of m.drinks) expect(DRINK_BY_ID[d], d).toBeTruthy();
    }
    const prices = MACHINES.map((m) => FURNITURE_BY_ITEM[m.itemId].def.price);
    expect([...prices].sort((a, b) => a - b)).toEqual(prices);
    const counts = MACHINES.map((m) => m.drinks.length);
    expect([...counts].sort((a, b) => a - b)).toEqual(counts);
    expect(new Set(counts).size).toBe(4);
    expect(MACHINES[1].itemId).toBe('kaffeemaschine');
    // jede Maschine kann Milch-Getränke nur mit Milchschaum-Ausstattung (ab Stufe 2)
    expect(drinksFor('espresso-einsteiger').some((d) => d.milk)).toBe(false);
    expect(drinksFor('kaffeemaschine').some((d) => d.milk)).toBe(true);
    // Latte-Art nur auf der besten
    expect(drinksFor('espresso-hebel').some((d) => d.art)).toBe(true);
    expect(MACHINES.slice(0, 3).some((m) => m.drinks.some((d) => DRINK_BY_ID[d].art))).toBe(false);
    expect(DRINKS.every((d) => d.lines.length > 0)).toBe(true);
  });

  it('trinken zählt Tassen, gibt einen Kaffee-Kick (begrenzt) und kennt nur die Getränke der Maschine', () => {
    const s = session();
    expect(drinkCoffee(s, 'espresso-einsteiger', 'cappuccino', false)).toBeNull();
    expect(kickActive(s)).toBe(false);
    const r = drinkCoffee(s, 'espresso-einsteiger', 'espresso', false)!;
    expect(r.lines.length).toBeGreaterThan(0);
    expect(cupsToday(s)).toBe(1);
    expect(kickActive(s)).toBe(true);
    for (let i = 0; i < 12; i++) drinkCoffee(s, 'espresso-profi', 'americano', false);
    expect(s.coffeeUntil - s.playTime()).toBeLessThanOrEqual(KICK_MAX + 1);
    expect(cupsToday(s)).toBe(13);
  });

  it('bei der fünften Tasse gibt es einen Spruch', () => {
    const s = session();
    let last: string[] = [];
    for (let i = 1; i <= MANY_CUPS; i++) last = drinkCoffee(s, 'espresso-profi', 'espresso', false)!.lines;
    expect(last.length).toBeGreaterThan(1);
  });

  it('Kaffee mit Oli: Freundschaft nur einmal am Tag, Latte-Art gibt mehr', () => {
    const s = session();
    s.data!.npcs.oli = { ...(s.data!.npcs.oli ?? { points: 0, lastTalkDay: '', lastGiftDay: '', talksToday: 0, rewards: [] }) };
    const before = s.data!.npcs.oli.points;
    const a = drinkCoffee(s, 'espresso-hebel', 'herz-latte', true)!;
    expect(a.together && a.art).toBe(true);
    const after1 = s.data!.npcs.oli.points;
    expect(after1).toBeGreaterThan(before);
    drinkCoffee(s, 'espresso-hebel', 'espresso', true);
    expect(s.data!.npcs.oli.points).toBe(after1);
  });
});
