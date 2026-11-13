import { describe, expect, it } from 'vitest';
import { buzzAt, createTipsy, DECAY_MS, drinkAlcohol, drinkWater, effectOf, GLASS, MAX_BUZZ, NO_EFFECT, REFUSE_AT, stage } from './tipsy';

describe('Schummrig werden', () => {
  it('nüchtern: keine Wirkung', () => {
    expect(buzzAt(createTipsy(), 5000)).toBe(0);
    expect(effectOf(0)).toEqual(NO_EFFECT);
  });

  it('ein Bier: schummrig, nach etwa einer Minute wieder klar', () => {
    const t = createTipsy();
    expect(drinkAlcohol(t, 1000, 'bier')).toBe('ok');
    expect(buzzAt(t, 1000)).toBeCloseTo(GLASS.bier);
    expect(buzzAt(t, 1000 + DECAY_MS / 2)).toBeCloseTo(0.5);
    expect(buzzAt(t, 1000 + DECAY_MS)).toBe(0);
    expect(effectOf(buzzAt(t, 1000 + DECAY_MS))).toEqual(NO_EFFECT);
  });

  it('nach drei Gläsern in kurzer Zeit lehnt Lina ab – und es wird nie mehr als MAX', () => {
    const t = createTipsy();
    expect(drinkAlcohol(t, 0, 'bier')).toBe('ok');
    expect(drinkAlcohol(t, 1000, 'wein')).toBe('ok');
    expect(buzzAt(t, 2000)).toBeLessThan(REFUSE_AT);
    expect(drinkAlcohol(t, 2000, 'bier')).toBe('ok');
    expect(drinkAlcohol(t, 3000, 'bier')).toBe('genug');
    expect(buzzAt(t, 3000)).toBeLessThanOrEqual(MAX_BUZZ);
  });

  it('später (nach dem Nachlassen) geht wieder ein Glas', () => {
    const t = createTipsy();
    for (const at of [0, 500, 1000]) drinkAlcohol(t, at, 'bier');
    expect(drinkAlcohol(t, 1500, 'bier')).toBe('genug');
    expect(drinkAlcohol(t, 1500 + DECAY_MS, 'bier')).toBe('ok');
  });

  it('Wasser macht sofort klarer', () => {
    const t = createTipsy();
    drinkAlcohol(t, 0, 'bier');
    drinkAlcohol(t, 0, 'wein');
    const before = buzzAt(t, 0);
    drinkWater(t, 0);
    expect(buzzAt(t, 0)).toBeLessThan(before - 1);
    drinkWater(t, 0);
    expect(buzzAt(t, 0)).toBe(0);
  });

  it('Wirkung wächst und schwindet weich, bleibt aber immer spielbar', () => {
    let prev = effectOf(0.05);
    for (let b = 0.2; b <= MAX_BUZZ; b += 0.2) {
      const e = effectOf(b);
      expect(e.blur).toBeGreaterThanOrEqual(prev.blur);
      expect(e.drift).toBeGreaterThanOrEqual(prev.drift);
      expect(e.speed).toBeLessThanOrEqual(prev.speed);
      prev = e;
    }
    const max = effectOf(MAX_BUZZ);
    expect(max.blur).toBeLessThanOrEqual(3);
    expect(max.drift * 1.4).toBeLessThanOrEqual(0.6); // pendelt höchstens um etwa ±32°
    expect(max.speed).toBeGreaterThanOrEqual(0.78);
  });

  it('Stufen für die Texte', () => {
    expect([0, 0.5, 1.5, 2.5].map(stage)).toEqual([0, 1, 2, 3]);
  });
});
