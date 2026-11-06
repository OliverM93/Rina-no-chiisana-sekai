import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import { BLOOM, type Garden, type GrowthStage } from '../core/garden';
import { mulberry32 } from '../core/rng';
import type { StorageLike } from '../core/save';
import { giftPreferences } from './gameplay';
import { neighbourKeys, registerBlooms, seedDrop } from './flowers';
import { pickGardenFlower } from './nature';
import { progressState } from './progress';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

const plant = (flower: string, stage: GrowthStage = BLOOM) => ({ flower, stage, wateredDay: '', grewDay: '2026-05-01' });
const memoryStorage = (): StorageLike => {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
};
function session() {
  const s = new Session(memoryStorage(), () => new Date('2026-05-10T12:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return s;
}

describe('Kreuzungen', () => {
  it('hat 8 Nachbarfelder', () => {
    expect(neighbourKeys('5,5')).toHaveLength(8);
    expect(neighbourKeys('5,5')).toContain('4,4');
    expect(neighbourKeys('5,5')).not.toContain('5,5');
  });

  it('ohne Nachbarn fällt (manchmal) der eigene Same ab', () => {
    const g: Garden = { '5,5': plant('tulpe') };
    const seeds = new Set<string | null>();
    for (let i = 0; i < 60; i++) seeds.add(seedDrop(g, '5,5', 'tulpe', mulberry32(i)).seedId);
    expect([...seeds].sort()).toEqual([null, 'samen-tulpe'].sort());
  });

  it('rot neben gelb: manchmal orange, sonst eigener Same – nie ein fremder', () => {
    const g: Garden = { '5,5': plant('tulpe'), '6,5': plant('tulpe-gelb') };
    const seen = new Set<string | null>();
    let crossed = 0;
    for (let i = 0; i < 400; i++) {
      const d = seedDrop(g, '5,5', 'tulpe', mulberry32(i));
      seen.add(d.seedId);
      if (d.crossed) {
        crossed++;
        expect(d.seedId).toBe('samen-tulpe-orange');
      }
    }
    expect([...seen].sort()).toEqual([null, 'samen-tulpe', 'samen-tulpe-orange'].sort());
    expect(crossed).toBeGreaterThan(80);
  });

  it('nur blühende Nachbarn derselben Art zählen', () => {
    const noBloom: Garden = { '5,5': plant('tulpe'), '6,5': plant('tulpe-gelb', 2) };
    const otherSpecies: Garden = { '5,5': plant('tulpe'), '6,5': plant('rose-gelb') };
    const far: Garden = { '5,5': plant('tulpe'), '7,5': plant('tulpe-gelb') };
    for (const g of [noBloom, otherSpecies, far]) {
      for (let i = 0; i < 200; i++) expect(seedDrop(g, '5,5', 'tulpe', mulberry32(i)).crossed).toBe(false);
    }
  });

  it('Schwarz: nur aus Orange × Rosa und nur selten', () => {
    const g: Garden = { '5,5': plant('tulpe-orange'), '6,5': plant('tulpe-rosa') };
    let black = 0;
    let crossedOther = 0;
    for (let i = 0; i < 1000; i++) {
      const d = seedDrop(g, '5,5', 'tulpe-orange', mulberry32(i));
      if (d.seedId === 'samen-tulpe-schwarz') black++;
      else if (d.crossed) crossedOther++;
    }
    expect(black).toBeGreaterThan(20);
    expect(black).toBeLessThan(250);
    expect(crossedOther).toBe(0);
  });

  it('Kräuter kreuzen sich nicht', () => {
    const g: Garden = { '5,5': plant('kamille'), '6,5': plant('pfefferminze') };
    for (let i = 0; i < 100; i++) expect(seedDrop(g, '5,5', 'kamille', mulberry32(i)).crossed).toBe(false);
  });

  it('Pflücken gibt die Blume und reproduzierbar denselben Same-Wurf', () => {
    const results: Array<string | null> = [];
    for (let k = 0; k < 2; k++) {
      const s = session();
      s.data!.world.garden['5,5'] = plant('tulpe');
      s.data!.world.garden['6,5'] = plant('tulpe-gelb');
      const got = pickGardenFlower(s, 5, 5);
      expect(got?.flower).toBe('tulpe');
      expect(s.data!.world.garden['5,5'].stage).toBe(2);
      results.push(got?.seedId ?? null);
    }
    expect(results[0]).toBe(results[1]);
  });
});

describe('Sammelbuch & Geschenke', () => {
  it('neue Farben tragen sich beim Erblühen ein – einmal, und zählen nicht als Tier-Fund', () => {
    const s = session();
    s.data!.world.garden['5,5'] = plant('tulpe-orange');
    expect(registerBlooms(s)).toEqual(['tulpe-orange']);
    expect(registerBlooms(s)).toEqual([]);
    expect(s.data!.collection['tulpe-orange']).toBeTruthy();
    expect(progressState(s)?.collectionSize).toBe(0);
  });

  it('Blumen in anderen Farben: Wer die Art mag, mag jede Farbe; Mischfarben nie schlecht', () => {
    const prefs = { loves: ['lavendel'], likes: ['tulpe'], dislikes: ['rose'] };
    expect(giftPreferences(prefs, 'lavendel-weiss').loves).toEqual(['lavendel-weiss']);
    expect(giftPreferences(prefs, 'tulpe-gelb').likes).toEqual(['tulpe-gelb']);
    expect(giftPreferences(prefs, 'rose-gelb').dislikes).toEqual(['rose-gelb']);
    // Mischfarbe (rose-orange) kommt trotz Abneigung gut an
    const orange = giftPreferences(prefs, 'rose-orange');
    expect(orange.dislikes).toEqual([]);
    expect(orange.likes).toEqual(['rose-orange']);
    // normale Gegenstände bleiben unverändert
    expect(giftPreferences(prefs, 'apfel')).toBe(prefs);
  });
});
