import { describe, expect, it } from 'vitest';
import { VILLAGE_LAYOUT, VILLAGE_OBJECTS, VILLAGE_SPAWN } from '../data/maps/village';
import { INTERACTIONS } from '../data/interactions';
import { findPath, nearestWalkable } from './grid';
import { buildWorldMap, findInteraction, KNOWN_CHARS, OBJECT_KINDS, objectById, terrainAt } from './worldmap';

const map = buildWorldMap(VILLAGE_LAYOUT, VILLAGE_OBJECTS, VILLAGE_SPAWN);

describe('Dorfkarte', () => {
  it('hat gleich lange Reihen und nur bekannte Zeichen', () => {
    const width = VILLAGE_LAYOUT[0].length;
    VILLAGE_LAYOUT.forEach((row) => {
      expect(row).toHaveLength(width);
      for (const ch of row) expect(KNOWN_CHARS).toContain(ch);
    });
  });

  it('lässt Lina auf einer freien Kachel starten', () => {
    expect(map.grid.isBlocked(VILLAGE_SPAWN.x, VILLAGE_SPAWN.y)).toBe(false);
  });

  it('hat eindeutige Objekt-IDs', () => {
    const ids = map.objects.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('stellt keine Objekte ins Wasser oder übereinander', () => {
    const occupied = new Map<string, string>();
    for (const obj of VILLAGE_OBJECTS) {
      if (obj.kind === 'bridge') continue;
      const info = OBJECT_KINDS[obj.kind];
      for (let y = obj.y; y < obj.y + info.h; y++) {
        for (let x = obj.x; x < obj.x + info.w; x++) {
          const t = terrainAt(map, x, y);
          expect(t, `${obj.id} bei (${x},${y})`).not.toBeNull();
          expect(['water', 'sea', 'deep'], `${obj.id} steht im Wasser`).not.toContain(t);
          const key = `${x},${y}`;
          expect(occupied.get(key), `${obj.id} überlappt ${occupied.get(key)}`).toBeUndefined();
          occupied.set(key, obj.id);
          const ch = VILLAGE_LAYOUT[y][x];
          expect('TPbr', `${obj.id} steht auf Natur-Objekt '${ch}'`).not.toContain(ch);
        }
      }
    }
  });

  it('macht die Brücke begehbar und den Fluss daneben nicht', () => {
    const bridge = objectById(map, 'bruecke')!;
    for (let x = bridge.x; x < bridge.x + bridge.w; x++) expect(map.grid.isBlocked(x, bridge.y)).toBe(false);
    expect(map.grid.isBlocked(bridge.x + 1, bridge.y - 1)).toBe(true);
  });

  it('erreicht jedes interaktive Objekt zu Fuß', () => {
    for (const id of Object.keys(INTERACTIONS)) {
      const obj = objectById(map, id);
      expect(obj, `Interaktion ohne Objekt: ${id}`).toBeDefined();
      const from = OBJECT_KINDS[obj!.kind].interactFrom ?? [];
      const reachable = from.some(([dx, dy]) => {
        const target = { x: obj!.x + dx, y: obj!.y + dy };
        if (map.grid.isBlocked(target.x, target.y)) return false;
        return findPath(map.grid, VILLAGE_SPAWN, target) !== null;
      });
      expect(reachable, `${id} ist nicht erreichbar`).toBe(true);
    }
  });

  it('erreicht Strand, Wald und die Ostseite', () => {
    for (const goal of [
      { x: 27, y: 33 }, // Strand
      { x: 27, y: 7 }, // Waldrand
      { x: 50, y: 19 }, // hinter der Brücke
    ]) {
      const target = nearestWalkable(map.grid, goal)!;
      expect(findPath(map.grid, VILLAGE_SPAWN, target), JSON.stringify(goal)).not.toBeNull();
    }
  });
});

describe('Interaktion', () => {
  const ids = new Set(Object.keys(INTERACTIONS));

  it('findet die Haustür, wenn Lina davor steht und nach oben schaut', () => {
    expect(findInteraction(map, VILLAGE_SPAWN, 'up', ids)).toBe('haus-lina');
  });

  it('findet nichts, wenn Lina wegschaut', () => {
    expect(findInteraction(map, VILLAGE_SPAWN, 'down', ids)).toBeNull();
  });

  it('findet den Briefkasten von der Seite', () => {
    const mb = objectById(map, 'briefkasten-lina')!;
    expect(findInteraction(map, { x: mb.x - 1, y: mb.y }, 'right', ids)).toBe('briefkasten-lina');
  });
});
