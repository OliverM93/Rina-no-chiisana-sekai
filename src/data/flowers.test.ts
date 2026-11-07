import { describe, expect, it } from 'vitest';
import { colorWord, COLORS, crossResult, FLOWER_SPECIES, MIXES, paletteOf, variantId } from './flowers';
import { GARDEN_FLOWER, GARDEN_FLOWERS, isKnownItem, itemDef } from './items';

describe('Blumenfarben', () => {
  it('Standardfarbe behält die alten IDs, Varianten heißen <art>-<farbe>', () => {
    const tulpe = FLOWER_SPECIES.find((s) => s.id === 'tulpe')!;
    expect(variantId(tulpe, 'rot')).toBe('tulpe');
    expect(variantId(tulpe, 'rot', true)).toBe('samen-tulpe');
    expect(variantId(tulpe, 'gelb')).toBe('tulpe-gelb');
    expect(variantId(tulpe, 'schwarz', true)).toBe('samen-tulpe-schwarz');
  });

  it('jede Blume und jeder Same ist ein bekannter Gegenstand mit Namen und Preis', () => {
    for (const g of GARDEN_FLOWERS) {
      expect(isKnownItem(g.flower), g.flower).toBe(true);
      expect(isKnownItem(g.seed), g.seed).toBe(true);
      expect(itemDef(g.flower)?.price, g.flower).toBeGreaterThan(0);
      expect(itemDef(g.seed)?.category).toBe('samen');
    }
  });

  it('Farbwörter passen zum Geschlecht', () => {
    expect(colorWord('gelb', 'f')).toBe('gelbe');
    expect(colorWord('weiss', 'm')).toBe('weißer');
    expect(colorWord('blau', 'n')).toBe('blaues');
    expect(colorWord('orange', 'f')).toBe('orange');
    expect(colorWord('rosa', 'm', true)).toBe('rosa');
    expect(itemDef('tulpe-gelb')?.name).toBe('Gelbe Tulpe');
    expect(itemDef('lavendel-weiss')?.name).toBe('Weißer Lavendel');
    expect(itemDef('vergissmeinnicht-rosa')?.name).toBe('Rosa Vergissmeinnicht');
    expect(itemDef('tulpe-orange')?.plural).toBe('orange Tulpen');
  });

  it('jede Farbe ist erreichbar: Samen-Farbe oder durch Kreuzen aus erreichbaren Farben', () => {
    for (const sp of FLOWER_SPECIES) {
      const have = new Set([sp.base, ...sp.seedColors]);
      let grew = true;
      while (grew) {
        grew = false;
        for (const a of [...have]) for (const b of [...have]) {
          const r = crossResult(sp, a, b);
          if (r && !have.has(r.color)) {
            have.add(r.color);
            grew = true;
          }
        }
      }
      for (const c of paletteOf(sp)) expect(have.has(c), `${sp.id}: ${c} nicht erreichbar`).toBe(true);
    }
  });

  it('Mischfarben haben Farben, Regeln sind symmetrisch und ändern nichts bei gleichen Farben', () => {
    for (const m of MIXES) for (const c of [m.a, m.b, m.result]) expect(COLORS[c]).toBeTruthy();
    const tulpe = FLOWER_SPECIES.find((s) => s.id === 'tulpe')!;
    expect(crossResult(tulpe, 'rot', 'gelb')?.color).toBe('orange');
    expect(crossResult(tulpe, 'gelb', 'rot')?.color).toBe('orange');
    expect(crossResult(tulpe, 'rot', 'rot')).toBeNull();
    expect(crossResult(tulpe, 'orange', 'rosa')).toEqual({ color: 'schwarz', rare: true });
    // Sonnenblumen kennen kein Rosa: dort ergibt rot × weiß nichts
    const sun = FLOWER_SPECIES.find((s) => s.id === 'sonnenblume')!;
    expect(crossResult(sun, 'rot', 'weiss')).toBeNull();
  });

  it('Kräuter haben keine Farbvarianten', () => {
    expect(GARDEN_FLOWER['kamille'].colorKey).toBeNull();
    expect(GARDEN_FLOWER['pfefferminze'].colorKey).toBeNull();
  });
});
