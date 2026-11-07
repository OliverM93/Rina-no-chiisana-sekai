import { describe, expect, it } from 'vitest';
import { FURNITURE } from './furniture';
import { FURNITURE_HEIGHTS } from './furnitureHeights';

describe('Möbel-Höhen (für die Wand-Deko-Prüfung)', () => {
  it('jedes Möbel außer Kleinkram und Teppichen hat eine gemessene Höhe', () => {
    const fehlt = FURNITURE.filter((f) => !f.small && !f.rug && FURNITURE_HEIGHTS[f.id] === undefined).map((f) => f.id);
    expect(fehlt, `Höhe fehlt (scripts/measure-heights.cjs): ${fehlt.join(', ')}`).toEqual([]);
  });

  it('die Tabelle enthält nur bekannte Möbel', () => {
    const ids = new Set(FURNITURE.map((f) => f.id));
    expect(Object.keys(FURNITURE_HEIGHTS).filter((k) => !ids.has(k))).toEqual([]);
  });

  it('Hellerau-Regale: drei Stück in vier Farben, im Stil Mid-Century', () => {
    for (const id of ['hellerau-regal', 'hellerau-regalwand', 'hellerau-standregal']) {
      const f = FURNITURE.find((x) => x.id === id);
      expect(f, id).toBeTruthy();
      expect(f!.style).toBe('midcentury');
      expect(Object.keys(f!.variants ?? {}).length).toBe(4);
    }
  });
});
