import { describe, expect, it } from 'vitest';
import { type Garden, growGarden, normalizeGarden, pickBloom, plantSeed, water } from './garden';

describe('Garten', () => {
  it('wächst eine Stufe pro Gießen bis zur Blüte', () => {
    const g: Garden = {};
    expect(plantSeed(g, '7,11', 'tulpe', '2026-05-01')).toBe(true);
    expect(plantSeed(g, '7,11', 'rose', '2026-05-01')).toBe(false);
    expect(water(g, '7,11', '2026-05-01')).toBe(true);
    expect(water(g, '7,11', '2026-05-01')).toBe(false); // heute schon gegossen
    growGarden(g, '2026-05-01');
    expect(g['7,11'].stage).toBe(0); // erst morgen
    growGarden(g, '2026-05-02');
    expect(g['7,11'].stage).toBe(1);
    growGarden(g, '2026-05-03');
    expect(g['7,11'].stage).toBe(1); // nicht gegossen → wartet (vertrocknet aber nie)
    for (const [w, next] of [['2026-05-03', '2026-05-04'], ['2026-05-04', '2026-05-09']]) {
      water(g, '7,11', w);
      growGarden(g, next);
    }
    expect(g['7,11'].stage).toBe(3);
    expect(pickBloom(g, '7,11', '2026-05-09')).toBe('tulpe');
    expect(g['7,11'].stage).toBe(2);
  });

  it('Regen gießt alle Beete', () => {
    const g: Garden = {};
    plantSeed(g, '1,1', 'rose', '2026-05-01');
    growGarden(g, '2026-05-01', true);
    growGarden(g, '2026-05-02');
    expect(g['1,1'].stage).toBe(1);
  });

  it('räumt kaputte Daten auf', () => {
    expect(normalizeGarden({ '1,1': { flower: 'tulpe', stage: 9 }, quatsch: {}, '2,2': { flower: 'kaktus' } }, (f) => f === 'tulpe')).toEqual({
      '1,1': { flower: 'tulpe', stage: 3, wateredDay: '', grewDay: '2000-01-01' },
    });
  });
});
