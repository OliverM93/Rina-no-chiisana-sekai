import { describe, expect, it } from 'vitest';
import type { Season } from '../core/time';
import { FLOORS, FURNITURE, WALLPAPERS } from '../data/furniture';
import { availableCategories, availableStyles, availableTypes, type CatalogContext, catalogEntries, designStyleUnlocked, effectiveFilter, filterEntries } from './catalog';

const SEASONS: Season[] = ['fruehling', 'sommer', 'herbst', 'winter'];
const ALL_FLAGS = { olafBegruesst: true, oliBegruesst: true, jensBegruesst: true, larsBegruesst: true, thaliaBegruesst: true };
const ctx = (season: Season, flags: Record<string, boolean> = {}): CatalogContext => ({ season, flags });

/** So hat der alte Katalog entschieden, was zu sehen ist – Vergleich für „nichts wegnehmen“ */
function oldCatalogIds(season: Season, jens: boolean): string[] {
  const furn = FURNITURE.filter((f) => !f.crafted && !f.gift && !f.retired && (!f.seasonal || season === 'winter') && (!f.inSeason || f.inSeason === season) && (f.style !== 'bistro' || jens));
  const surf = [...WALLPAPERS, ...FLOORS].filter((s) => s.style !== 'bistro' || jens);
  return [...furn, ...surf].map((x) => x.id).sort();
}

describe('Katalog: nichts verschwindet', () => {
  for (const season of SEASONS) {
    it(`${season}, ganz am Anfang: genau das bisherige Sortiment`, () => {
      expect(catalogEntries(ctx(season)).map((e) => e.id).sort()).toEqual(oldCatalogIds(season, false));
    });
    it(`${season}, alle eingezogen: alles Bisherige ist da`, () => {
      const ids = new Set(catalogEntries(ctx(season, ALL_FLAGS)).map((e) => e.id));
      for (const id of oldCatalogIds(season, true)) expect(ids.has(id), id).toBe(true);
    });
  }
});

describe('Katalog: Freischaltung neuer Stile', () => {
  it('Stile ohne Einzug sind sofort da, die anderen erst mit „<npc>Begruesst“', () => {
    expect(designStyleUnlocked(ctx('sommer'), 'japandi')).toBe(true);
    expect(designStyleUnlocked(ctx('sommer'), 'darkacademia')).toBe(false);
    expect(designStyleUnlocked(ctx('sommer', { thaliaBegruesst: true }), 'darkacademia')).toBe(true);
    expect(designStyleUnlocked(ctx('sommer'), 'cyberpunk')).toBe(false);
    expect(designStyleUnlocked(ctx('sommer', { oliBegruesst: true }), 'cyberpunk')).toBe(true);
  });

  it('der Stil-Filter zeigt einen Stil erst, wenn er frei ist', () => {
    expect(availableStyles(catalogEntries(ctx('sommer')), 'moebel')).not.toContain('darkacademia');
    expect(availableStyles(catalogEntries(ctx('sommer', ALL_FLAGS)), 'moebel')).toContain('darkacademia');
  });
});

describe('Katalog: Filter Stil × Kategorie × Typ', () => {
  const entries = catalogEntries(ctx('sommer', ALL_FLAGS));

  it('Kategorien: Winterzauber nur im Winter', () => {
    expect(availableCategories(entries)).toEqual(['moebel', 'pflanzen', 'tapete', 'boden', 'lieblinge', 'garten']);
    expect(availableCategories(catalogEntries(ctx('winter')))).toContain('winter');
  });

  it('„alle Lampen im Stil Japandi“', () => {
    const f = effectiveFilter(entries, { category: 'moebel', type: 'lampen', style: 'japandi' });
    expect(filterEntries(entries, f).map((e) => e.id)).toEqual(['andon']);
  });

  it('„alle Mid-Century-Möbel“ – nur Treffer mit diesem Stil', () => {
    const hits = filterEntries(entries, { category: 'moebel', type: 'alle', style: 'midcentury' });
    expect(hits.length).toBeGreaterThanOrEqual(12);
    for (const e of hits) expect(e.meta.styles).toContain('midcentury');
  });

  it('„Ohne Stil“ findet die Grundausstattung', () => {
    const ids = filterEntries(entries, { category: 'moebel', type: 'alle', style: 'ohne' }).map((e) => e.id);
    expect(ids).toEqual(expect.arrayContaining(['sofa', 'bett', 'fernseher']));
    expect(ids).not.toContain('futon');
  });

  it('die Typ-Zeile zeigt nur Typen, die es im gewählten Stil gibt', () => {
    const types = availableTypes(entries, 'moebel', 'bistro');
    expect(types[0]).toBe('alle');
    expect(types).toContain('stuehle');
    expect(types).not.toContain('betten');
  });

  it('ein Typ, den es im Stil nicht gibt, zählt als „alle“ (statt einer leeren Liste)', () => {
    const f = effectiveFilter(entries, { category: 'moebel', type: 'betten', style: 'bistro' });
    expect(f.type).toBe('alle');
    expect(filterEntries(entries, f).length).toBeGreaterThan(5);
  });

  it('Pflanzen-Reiter: alle Pflanzen, Typ-Zeile ja, Stil-Zeile nur mit „Ohne Stil“', () => {
    const plants = filterEntries(entries, { category: 'pflanzen', type: 'alle', style: 'alle' }).map((e) => e.id);
    expect(plants).toEqual(expect.arrayContaining(['topfpflanze', 'kaktus', 'sukkulenten', 'yucca', 'haengepflanze', 'gummibaum', 'bonsai']));
    expect(availableTypes(entries, 'pflanzen', 'alle')).toEqual(['alle', 'gross', 'tisch', 'haengend']);
    expect(availableStyles(entries, 'pflanzen').slice(0, 2)).toEqual(['alle', 'ohne']);
  });

  it('Garten hat keine Stil-Zeile', () => {
    expect(availableStyles(entries, 'garten')).toEqual([]);
  });
});
