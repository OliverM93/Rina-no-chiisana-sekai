import { describe, expect, it } from 'vitest';
import { canCraft, craft, learn, missing, normalizeRecipeBook, type Recipe } from './crafting';
import { addItem, countItem, createInventory } from './inventory';

const HOCKER: Recipe = { id: 'hocker', result: 'hocker', ingredients: [{ itemId: 'ast', count: 4 }, { itemId: 'stein', count: 1 }] };

describe('Werkbank', () => {
  it('meldet fehlende Zutaten', () => {
    const inv = createInventory(4);
    addItem(inv, 'ast', 2);
    expect(missing(inv, HOCKER)).toEqual([{ itemId: 'ast', count: 2 }, { itemId: 'stein', count: 1 }]);
    expect(canCraft(inv, HOCKER)).toBe(false);
    expect(craft(inv, HOCKER)).toBe('fehlt');
    expect(countItem(inv, 'ast')).toBe(2);
  });

  it('nimmt Zutaten und gibt das Ergebnis', () => {
    const inv = createInventory(4);
    addItem(inv, 'ast', 5);
    addItem(inv, 'stein', 1);
    expect(craft(inv, HOCKER)).toBe('ok');
    expect(countItem(inv, 'ast')).toBe(1);
    expect(countItem(inv, 'stein')).toBe(0);
    expect(countItem(inv, 'hocker')).toBe(1);
  });

  it('frei werdende Plätze zählen mit', () => {
    const inv = createInventory(2);
    addItem(inv, 'ast', 4);
    addItem(inv, 'stein', 1);
    expect(craft(inv, HOCKER)).toBe('ok');
    expect(countItem(inv, 'hocker')).toBe(1);
  });

  it('volle Tasche: nichts geht verloren', () => {
    const inv = createInventory(3);
    addItem(inv, 'ast', 30);
    addItem(inv, 'stein', 30);
    addItem(inv, 'apfel', 30);
    expect(craft(inv, HOCKER)).toBe('voll');
    expect(countItem(inv, 'ast')).toBe(30);
    expect(countItem(inv, 'stein')).toBe(30);
  });

  it('lernt Rezepte nur einmal', () => {
    const book: string[] = [];
    expect(learn(book, 'hocker')).toBe(true);
    expect(learn(book, 'hocker')).toBe(false);
    expect(book).toEqual(['hocker']);
  });

  it('normalisiert das Rezeptbuch', () => {
    expect(normalizeRecipeBook(['a', 'a', 3, 'weg', 'b'], (id) => id !== 'weg')).toEqual(['a', 'b']);
    expect(normalizeRecipeBook('kaputt', () => true)).toEqual([]);
  });
});
