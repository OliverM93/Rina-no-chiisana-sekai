import { describe, expect, it } from 'vitest';
import { buildWorldMap, terrainAt } from '../core/worldmap';
import { findPath } from '../core/grid';
import { MOMENTS } from './album';
import { isKnownItem } from './items';
import { VILLAGE_LAYOUT, VILLAGE_OBJECTS, VILLAGE_SPAWN } from './maps/village';
import { VERSTECKE } from './verstecke';

describe('Verstecke', () => {
  const map = buildWorldMap(VILLAGE_LAYOUT, VILLAGE_OBJECTS, VILLAGE_SPAWN);

  it('jedes Versteck liegt auf begehbarem Land und ist vom Start aus erreichbar', () => {
    for (const v of VERSTECKE) {
      expect(['grass', 'sand'], v.id).toContain(terrainAt(map, v.x, v.y));
      expect(map.grid.isBlocked(v.x, v.y), `${v.id} blockiert`).toBe(false);
      expect(findPath(map.grid, VILLAGE_SPAWN, { x: v.x, y: v.y }), `${v.id} nicht erreichbar`).not.toBeNull();
    }
  });

  it('Orte sind verstreut (mindestens 15 Kacheln voneinander) und weit weg vom Dorfplatz', () => {
    for (const a of VERSTECKE) {
      expect(Math.hypot(a.x - 27, a.y - 19), a.id).toBeGreaterThan(14);
      for (const b of VERSTECKE) if (a !== b) expect(Math.hypot(a.x - b.x, a.y - b.y), `${a.id}/${b.id}`).toBeGreaterThan(15);
    }
  });

  it('Funde sind echte Gegenstände, Texte vollständig, Album-Eintrag vorhanden', () => {
    for (const v of VERSTECKE) {
      expect(v.items.length, v.id).toBeGreaterThan(0);
      for (const it of v.items) expect(isKnownItem(it.itemId), `${v.id}: ${it.itemId}`).toBe(true);
      expect(v.found.length, v.id).toBeGreaterThan(0);
      expect(v.hint.length, v.id).toBeGreaterThan(20);
      expect(MOMENTS.some((m) => m.id === `versteck-${v.id}`), `Album ${v.id}`).toBe(true);
    }
  });
});
