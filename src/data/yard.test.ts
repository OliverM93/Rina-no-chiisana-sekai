import { describe, expect, it } from 'vitest';
import { buildWorldMap } from '../core/worldmap';
import { buildYardLayout, keepsAccess } from '../core/yard';
import { FURNITURE } from './furniture';
import { VILLAGE_LAYOUT, VILLAGE_OBJECTS, VILLAGE_SPAWN } from './maps/village';
import { YARD_AREA } from './yard';

describe('Linas Garten im Dorf', () => {
  const map = buildWorldMap(VILLAGE_LAYOUT, VILLAGE_OBJECTS, VILLAGE_SPAWN);
  const layout = buildYardLayout(map, YARD_AREA);
  const reserved = new Set(layout.reserved?.map(([x, y]) => `${x + YARD_AREA.x},${y + YARD_AREA.y}`));

  it('liegt auf der Karte und ist vom Dorfplatz aus erreichbar', () => {
    expect(YARD_AREA.x + YARD_AREA.w).toBeLessThanOrEqual(map.width);
    expect(YARD_AREA.y + YARD_AREA.h).toBeLessThanOrEqual(map.height);
    expect(map.grid.isBlocked(YARD_AREA.from.x, YARD_AREA.from.y)).toBe(false);
    expect(keepsAccess(map, YARD_AREA, [])).toBe(true);
  });

  it('hält Haustür, Briefkasten, Beet und Werkbank frei', () => {
    expect(reserved.has(`${VILLAGE_SPAWN.x},${VILLAGE_SPAWN.y}`)).toBe(true);
    for (const id of ['haus-lina', 'briefkasten-lina', 'beet-lina', 'werkbank-lina', 'verkaufskiste']) {
      const o = map.objects.find((x) => x.id === id);
      expect(o, id).toBeTruthy();
      expect(reserved.has(`${o!.x},${o!.y}`), id).toBe(true);
    }
  });

  it('bietet genug freien Platz', () => {
    expect(YARD_AREA.w * YARD_AREA.h - reserved.size).toBeGreaterThan(80);
  });

  it('Gartensachen haben eine Grundfläche, Zäune sind 1×1', () => {
    for (const f of FURNITURE.filter((x) => x.outdoor)) {
      expect(f.style, f.id).toBe('garten');
      if (f.fence) expect([f.w, f.d], f.id).toEqual([1, 1]);
    }
  });
});
