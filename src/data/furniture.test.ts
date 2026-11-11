import { describe, expect, it } from 'vitest';
import { FLOORS, FURNITURE, FURNITURE_BY_ITEM, VARIANT_LABELS, WALLPAPERS, variantItemId } from './furniture';
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

describe('Französisches Bistro (Jens\' Stil)', () => {
  it('hat Möbel, Tapeten und einen Boden, alle im Stil „bistro“ und ohne doppelte IDs', () => {
    const bistro = FURNITURE.filter((f) => f.style === 'bistro');
    expect(bistro.length).toBeGreaterThanOrEqual(10);
    expect(bistro.some((f) => f.sit)).toBe(true);
    expect(bistro.some((f) => f.surface)).toBe(true);
    expect(bistro.some((f) => f.wall)).toBe(true);
    expect(bistro.some((f) => f.small && f.light)).toBe(true);
    expect(bistro.some((f) => f.rug)).toBe(true);
    expect(new Set(FURNITURE.map((f) => f.id)).size).toBe(FURNITURE.length);
    expect(WALLPAPERS.filter((w) => w.style === 'bistro').length).toBeGreaterThanOrEqual(2);
    expect(FLOORS.filter((w) => w.style === 'bistro').length).toBeGreaterThanOrEqual(1);
  });
});

describe('Farbvarianten', () => {
  it('nachträgliche Farben behalten die alte Gegenstands-ID (Spielstände, Rezepte, Wünsche)', () => {
    for (const id of ['stehlampe', 'regal', 'landhaustisch', 'haekelteppich', 'bistrostuhl', 'gartenbank']) {
      const f = FURNITURE_BY_ITEM[id];
      expect(f, id).toBeTruthy();
      expect(f.def.baseVariant, id).toBe(Object.keys(f.def.variants ?? {})[0]);
      expect(variantItemId(f.def, f.def.baseVariant!)).toBe(id);
    }
  });

  it('jede Variante hat eine Farbe, einen Namen und eine eindeutige ID', () => {
    const ids = new Set<string>();
    for (const f of FURNITURE.filter((x) => x.variants)) {
      for (const [v, color] of Object.entries(f.variants!)) {
        expect(color, `${f.id}-${v}`).toMatch(/^#[0-9a-f]{6}$/i);
        expect(VARIANT_LABELS[v], `Name für „${v}“ (${f.id})`).toBeTruthy();
        const id = variantItemId(f, v);
        expect(ids.has(id), id).toBe(false);
        ids.add(id);
        expect(FURNITURE_BY_ITEM[id]?.variant, id).toBe(v);
      }
    }
  });

  it('Sofas, Betten & Co. haben mindestens vier Farben', () => {
    for (const id of ['sofa', 'bett', 'loungesofa', 'sitzsack', 'stehlampe', 'haekelteppich']) {
      expect(Object.keys(FURNITURE.find((f) => f.id === id)!.variants ?? {}).length, id).toBeGreaterThanOrEqual(4);
    }
  });
});
