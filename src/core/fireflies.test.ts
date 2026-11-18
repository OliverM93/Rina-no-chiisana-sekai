import { describe, expect, it } from 'vitest';
import { fireflyStrength } from './fireflies';

const base = { season: 'sommer' as const, night: 1, wet: false, inside: false, onIsland: false };

describe('Glühwürmchen', () => {
  it('abends im Frühling und Sommer', () => {
    expect(fireflyStrength(base)).toBe(1);
    expect(fireflyStrength({ ...base, season: 'fruehling' })).toBe(1);
  });
  it('im Herbst und Winter nicht', () => {
    expect(fireflyStrength({ ...base, season: 'herbst' })).toBe(0);
    expect(fireflyStrength({ ...base, season: 'winter' })).toBe(0);
  });
  it('nicht am Tag, im Regen, im Haus oder auf der Insel', () => {
    expect(fireflyStrength({ ...base, night: 0 })).toBe(0);
    expect(fireflyStrength({ ...base, wet: true })).toBe(0);
    expect(fireflyStrength({ ...base, inside: true })).toBe(0);
    expect(fireflyStrength({ ...base, onIsland: true })).toBe(0);
  });
  it('kommen in der Dämmerung langsam', () => {
    const dusk = fireflyStrength({ ...base, night: 0.4 });
    expect(dusk).toBeGreaterThan(0);
    expect(dusk).toBeLessThan(1);
  });
});
