import { describe, expect, it } from 'vitest';
import { LOOKS } from '../data/npcs/looks';
import { DEFAULT_LINA, normalizeAppearance, outfitFor, shoesFor } from './appearance';

describe('Aussehen', () => {
  it('ergänzt neue Felder für alte Spielstände', () => {
    const old = { hairStyle: 'locken', hairColor: '#7b4a33', glasses: false };
    const a = normalizeAppearance(old);
    expect(a.eyeColor).toBe(DEFAULT_LINA.eyeColor);
    expect(a.freckles).toBe(DEFAULT_LINA.freckles);
    expect(a.smile).toBe('laecheln');
    expect(a.beardColor).toBe('');
    expect(a.glassesShape).toBe('rund');
    expect(a.scarf).toBe('');
    expect(a.earrings).toBe(false);
  });

  it('übernimmt Halstuch, Ohrringe, Schnurrbart und neue Frisur', () => {
    const a = normalizeAppearance({ scarf: '#3f7a62', earrings: true, beard: 'schnurrbart', hairStyle: 'glatt', outfit: 'troyer' });
    expect(a).toMatchObject({ scarf: '#3f7a62', earrings: true, beard: 'schnurrbart', hairStyle: 'glatt', outfit: 'troyer' });
    expect(normalizeAppearance({ scarf: 'grün' }).scarf).toBe('');
  });

  it('verwirft ungültige Werte', () => {
    const a = normalizeAppearance({ smile: 'böse', eyeColor: 'lila', glassesShape: 'dreieckig', hairStyle: 'irokese' });
    expect(a.smile).toBe(DEFAULT_LINA.smile);
    expect(a.eyeColor).toBe(DEFAULT_LINA.eyeColor);
    expect(a.glassesShape).toBe('rund');
    expect(a.hairStyle).toBe(DEFAULT_LINA.hairStyle);
  });

  it('alle Bewohner-Looks sind gültig', () => {
    for (const [id, look] of Object.entries(LOOKS)) expect(normalizeAppearance(look, look), id).toEqual(look);
  });

  it('Lina trägt Schwarz – Stiefel im Winter, weiße Sneaker im Sommer', () => {
    expect(DEFAULT_LINA.outfitColor).toBe(DEFAULT_LINA.accentColor);
    expect(shoesFor(DEFAULT_LINA, 'winter')).toBe('stiefel');
    expect(shoesFor(DEFAULT_LINA, 'herbst')).toBe('stiefel');
    expect(shoesFor(DEFAULT_LINA, 'sommer')).toBe('sneaker');
    expect(shoesFor(DEFAULT_LINA, 'fruehling')).toBe('sneaker');
    expect(shoesFor({ ...DEFAULT_LINA, shoes: 'stiefel' }, 'sommer')).toBe('stiefel');
    expect(normalizeAppearance({}).shoes).toBe('saison');
    expect(normalizeAppearance({ shoes: 'flipflops' }).shoes).toBe('saison');
  });

  it('Gesichtsform: Lina schmal, alte Spielstände bekommen sie automatisch', () => {
    expect(DEFAULT_LINA.faceShape).toBe('oval');
    const { faceShape: _drop, ...old } = DEFAULT_LINA;
    expect(normalizeAppearance(old, DEFAULT_LINA).faceShape).toBe('oval');
    expect(normalizeAppearance({ ...DEFAULT_LINA, faceShape: 'eckig' }, DEFAULT_LINA).faceShape).toBe('oval');
    expect(normalizeAppearance({ ...DEFAULT_LINA, faceShape: 'rund' }, DEFAULT_LINA).faceShape).toBe('rund');
  });

  it('Streetwear je nach Jahreszeit: Sommer kurz, Winter Fleece', () => {
    const a = { ...DEFAULT_LINA, outfit: 'saison' as const };
    expect(outfitFor(a, 'sommer')).toBe('shorts');
    expect(outfitFor(a, 'winter')).toBe('fleece');
    expect(outfitFor(a, 'herbst')).toBe('sweatshirt');
    expect(outfitFor({ ...a, outfit: 'kleid' }, 'winter')).toBe('kleid');
    expect(DEFAULT_LINA.outfit).toBe('saison');
  });
});
