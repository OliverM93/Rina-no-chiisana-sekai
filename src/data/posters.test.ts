import { describe, expect, it } from 'vitest';
import { FURNITURE_BY_ITEM } from './furniture';
import { isKnownItem } from './items';
import { POSTERS } from './posters';

describe('Poster & Bildbände', () => {
  it('sind Katalogmöbel: Poster hängen an der Wand, Bildbände liegen auf Tischen', () => {
    expect(POSTERS.filter((p) => p.kind === 'poster').length).toBeGreaterThanOrEqual(1);
    expect(POSTERS.filter((p) => p.kind === 'buch').length).toBeGreaterThanOrEqual(3);
    expect(new Set(POSTERS.map((p) => p.id)).size).toBe(POSTERS.length);
    for (const p of POSTERS) {
      const f = FURNITURE_BY_ITEM[p.id];
      expect(f, p.id).toBeTruthy();
      expect(isKnownItem(p.id), p.id).toBe(true);
      expect(f.def.style).toBe('lieblinge');
      expect(!!f.def.wall, p.id).toBe(p.kind === 'poster');
      expect(!!f.def.small, p.id).toBe(p.kind === 'buch');
      expect(f.def.gift).toBeFalsy();
      expect(f.def.crafted).toBeFalsy();
      expect(p.title.length).toBeGreaterThan(0);
    }
  });
});
