import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import { isPracht, prachtFrom, recordLength, registerCatch, rollLength } from '../core/catching';
import { mulberry32 } from '../core/rng';
import { countItem } from '../core/inventory';
import type { StorageLike } from '../core/save';
import { DIG_FINDS } from '../data/winston';
import { FISH, FISH_CM } from '../data/species';
import { RECIPE_BY_ID } from '../data/recipes';
import { isKnownItem } from '../data/items';
import { hasIcon } from '../gfx/items';
import { activeBait, biteFish, catchFish, catchMessage } from './nature';
import { giveItem } from './gameplay';
import { Session } from './session';

vi.mock('../gfx/items', async (orig) => ({ ...(await orig<typeof import('../gfx/items')>()), itemIconUrl: () => '' }));

function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}
function fresh() {
  const s = new Session(memoryStorage(), () => new Date('2026-06-10T12:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return s;
}

describe('Fanggröße', () => {
  it('jede Fischart hat eine sinnvolle Längenspanne', () => {
    for (const f of FISH) {
      const r = FISH_CM[f.id];
      expect(r, f.id).toBeDefined();
      expect(r[0]).toBeGreaterThan(0);
      expect(r[1]).toBeGreaterThan(r[0]);
    }
    expect(Object.keys(FISH_CM).sort()).toEqual(FISH.map((f) => f.id).sort());
  });

  it('Längen bleiben in der Spanne; Prachtexemplare sind selten (3–10 %), Köder macht sie sicher', () => {
    const rnd = mulberry32(42);
    for (const f of FISH) {
      const r = FISH_CM[f.id];
      let pracht = 0;
      const N = 4000;
      for (let i = 0; i < N; i++) {
        const cm = rollLength(r, rnd());
        expect(cm).toBeGreaterThanOrEqual(r[0]);
        expect(cm).toBeLessThanOrEqual(r[1]);
        if (isPracht(cm, r)) pracht++;
      }
      // kleine Spannen (z. B. Stichling 4–8 cm) runden gröber
      const share = pracht / N;
      expect(share, f.id).toBeGreaterThan(0.02);
      expect(share, f.id).toBeLessThan(0.14);
      for (let i = 0; i < 200; i++) {
        const cm = rollLength(r, rnd(), true);
        expect(isPracht(cm, r), f.id).toBe(true);
        expect(cm).toBeLessThanOrEqual(r[1]);
      }
      expect(prachtFrom(r)).toBeGreaterThan(r[0]);
    }
  });

  it('Rekord: nur wenn eine frühere Bestmarke bekannt war und überboten wird', () => {
    const c = {};
    registerCatch(c, 'hecht', '2026-06-01');
    expect(recordLength(c, 'hecht', 60)).toBeUndefined(); // erster Messwert, kein „Rekord“
    expect(recordLength(c, 'hecht', 55)).toBe(60);
    expect((c as Record<string, { bestCm?: number }>).hecht.bestCm).toBe(60);
    expect(recordLength(c, 'hecht', 80)).toBe(60);
    expect((c as Record<string, { bestCm?: number }>).hecht.bestCm).toBe(80);
  });
});

describe('Fang & Köder', () => {
  it('ein Fang trägt Länge ins Sammelbuch ein und meldet Rekorde', () => {
    const s = fresh();
    const barsch = FISH.find((f) => f.id === 'barsch')!;
    const first = catchFish(s, barsch, 0.2);
    expect(first.isNew).toBe(true);
    expect(first.record).toBe(false);
    expect(s.data!.collection.barsch.bestCm).toBe(first.cm);
    const bigger = catchFish(s, barsch, 0.8);
    expect(bigger.record).toBe(true);
    expect(s.data!.collection.barsch.bestCm).toBe(bigger.cm);
    const smaller = catchFish(s, barsch, 0.1);
    expect(smaller.record).toBe(false);
    expect(s.data!.collection.barsch.bestCm).toBe(bigger.cm);
    const msg = catchMessage('Flussbarsch', 'fisch', bigger).join(' ');
    expect(msg).toContain(`${bigger.cm} cm`);
    expect(msg).toContain('Neuer Rekord');
    expect(catchMessage('Flussbarsch', 'fisch', smaller).join(' ')).not.toContain('Rekord');
  });

  it('Duftköder: wird beim Fang verbraucht und bringt ein Prachtexemplar', () => {
    const s = fresh();
    giveItem(s, 'koeder-teig', 2, false);
    expect(activeBait(s)).toBe('koeder-teig');
    const hecht = FISH.find((f) => f.id === 'hecht')!;
    const r = catchFish(s, hecht, 0.0);
    expect(r.pracht).toBe(true);
    expect(r.bait).toBe('koeder-teig');
    expect(countItem(s.data!.inventory, 'koeder-teig')).toBe(1);
    expect(catchMessage('Hecht', 'fisch', r).join(' ')).toContain('Prachtexemplar');
    catchFish(s, hecht, 0.5);
    expect(activeBait(s)).toBeNull();
    // ohne Köder: kleiner Wurf bleibt klein
    expect(catchFish(s, hecht, 0.1).pracht).toBe(false);
  });

  it('Glückswurm hat Vorrang und macht Seltenes häufiger', () => {
    const s = fresh();
    const count = (bait: boolean) => {
      const sx = fresh();
      if (bait) giveItem(sx, 'koeder-gluckswurm', 1, false);
      let rare = 0;
      for (let i = 0; i < 2000; i++) {
        const f = biteFish(sx, 'fluss', (i + 0.5) / 2000);
        if (f && f.weight <= 7) rare++;
      }
      return rare;
    };
    expect(count(true)).toBeGreaterThan(count(false));
    giveItem(s, 'koeder-teig', 1, false);
    giveItem(s, 'koeder-gluckswurm', 1, false);
    expect(activeBait(s)).toBe('koeder-gluckswurm');
  });
});

describe('Köder in der Welt', () => {
  it('beide Köder sind echte Gegenstände mit Symbol; Duftköder ist bastelbar, Glückswurm gräbt Winston aus', () => {
    for (const id of ['koeder-teig', 'koeder-gluckswurm']) {
      expect(isKnownItem(id)).toBe(true);
      expect(hasIcon(id)).toBe(true);
    }
    expect(RECIPE_BY_ID['koeder-teig'].result).toBe('koeder-teig');
    expect(DIG_FINDS.some((d) => d.itemId === 'koeder-gluckswurm')).toBe(true);
  });
});
