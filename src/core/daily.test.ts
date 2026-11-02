import { describe, expect, it } from 'vitest';
import { dailySpawns, daysBetween, doneToday, fruitOfTree, treeHasFruit, weightedPick } from './daily';

describe('Tägliche Funde', () => {
  it('rechnet Tage', () => {
    expect(daysBetween('2026-11-02', '2026-11-05')).toBe(3);
    expect(daysBetween('2026-12-31', '2027-01-01')).toBe(1);
    expect(daysBetween('2026-03-28', '2026-03-30')).toBe(2);
  });

  it('lässt Obst nach ein paar Tagen nachwachsen', () => {
    expect(treeHasFruit(undefined, '2026-11-02')).toBe(true);
    expect(treeHasFruit('2026-11-02', '2026-11-03')).toBe(false);
    expect(treeHasFruit('2026-11-02', '2026-11-05')).toBe(true);
    expect(doneToday('2026-11-02', '2026-11-02')).toBe(true);
  });

  it('wählt gewichtet', () => {
    const t = [{ itemId: 'a', weight: 1 }, { itemId: 'b', weight: 3 }];
    expect(weightedPick(t, 0.1)).toBe('a');
    expect(weightedPick(t, 0.5)).toBe('b');
    expect(weightedPick(t, 0.9999)).toBe('b');
  });

  it('verteilt Funde reproduzierbar und ohne Doppelungen', () => {
    const tiles = Array.from({ length: 20 }, (_, i) => ({ x: i, y: 0 }));
    const table = [{ itemId: 'muschel', weight: 1 }];
    const a = dailySpawns('2026-11-02', tiles, 7, table, 'strand');
    const b = dailySpawns('2026-11-02', tiles, 7, table, 'strand');
    const c = dailySpawns('2026-11-03', tiles, 7, table, 'strand');
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
    expect(new Set(a.map((s) => s.x)).size).toBe(7);
    expect(dailySpawns('d', tiles.slice(0, 3), 10, table, 'p')).toHaveLength(3);
    expect(dailySpawns('d', [], 3, table, 'p')).toEqual([]);
  });

  it('legt Obstbäume fest', () => {
    expect(fruitOfTree(3, 4, ['apfel'])).toBe(fruitOfTree(3, 4, ['apfel']));
    const fruits = Array.from({ length: 200 }, (_, i) => fruitOfTree(i, 7, ['apfel', 'birne']));
    expect(fruits.filter(Boolean).length).toBeGreaterThan(50);
    expect(fruits.filter((f) => f === null).length).toBeGreaterThan(50);
  });
});
