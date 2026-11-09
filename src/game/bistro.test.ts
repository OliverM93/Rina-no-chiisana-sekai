import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { buyFromCatalog, styleUnlocked } from './home';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

describe('Französisches Bistro im Katalog', () => {
  it('kommt mit Jens: vorher nicht kaufbar, danach schon', () => {
    const s = new Session(memoryStorage(), () => new Date('2026-11-09T12:00:00'));
    s.startNewGame(DEFAULT_LINA, 'Testdorf');
    s.data!.money = 5000;
    expect(styleUnlocked(s, 'bistro')).toBe(false);
    expect(styleUnlocked(s, 'basis')).toBe(true);
    expect(buyFromCatalog(s, 'bistrotisch')).toBe('unbekannt');
    expect(buyFromCatalog(s, 'tapete-bistro')).toBe('unbekannt');
    expect(s.data!.money).toBe(5000);
    s.data!.flags.jensBegruesst = true;
    expect(styleUnlocked(s, 'bistro')).toBe(true);
    expect(buyFromCatalog(s, 'bistrotisch')).toBe('ok');
    expect(s.data!.money).toBe(4400);
  });
});
