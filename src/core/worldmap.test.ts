import { describe, expect, it } from 'vitest';
import { VILLAGE_LAYOUT, VILLAGE_OBJECTS, VILLAGE_SPAWN } from '../data/maps/village';
import { INTERACTIONS } from '../data/interactions';
import { NPCS } from '../data/npcs';
import { findPath, nearestWalkable } from './grid';
import { applyMapFlags, buildWorldMap, findInteraction, interactOffsets, isActive, KNOWN_CHARS, OBJECT_KINDS, objectById, terrainAt } from './worldmap';

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
    // Objekte, die nur bis zu einem Einzug da sind (Bauplatz), überlappen das spätere Haus – das ist gewollt
    for (const obj of VILLAGE_OBJECTS) {
      if (obj.kind === 'bridge' || obj.kind === 'steg') continue; // Brücke & Steg dürfen übers Wasser
      if (obj.until) continue;
      const info = OBJECT_KINDS[obj.kind];
      const sized = obj.kind === 'landmark';
      const w = sized ? (obj.w ?? info.w) : info.w;
      const h = sized ? (obj.h ?? info.h) : info.h;
      for (let y = obj.y; y < obj.y + h; y++) {
        for (let x = obj.x; x < obj.x + w; x++) {
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

  it('Vor Gebäuden und Bauplätzen stehen keine hohen Stände oder Schilder, die die Fassade verdecken', () => {
    // Die Kamera schaut schräg von Süden: hohe Stände verdecken, was bis ~7 Reihen nördlich hinter ihnen steht
    const tall = ['stall', 'seedstall', 'board', 'workbench'];
    const fronts = VILLAGE_OBJECTS.filter((o) => ['house', 'bistro', 'praxis', 'plot'].includes(o.kind));
    for (const o of VILLAGE_OBJECTS.filter((x) => tall.includes(x.kind))) {
      const info = OBJECT_KINDS[o.kind];
      for (const f of fronts) {
        const finfo = OBJECT_KINDS[f.kind];
        // bis zu 7 Reihen südlich des Gebäudes, ein Feld breiter als das Gebäude
        const inFront = o.x + info.w - 1 >= f.x - 1 && o.x <= f.x + finfo.w && o.y >= f.y + finfo.h && o.y <= f.y + finfo.h + 7;
        expect(inFront, `${o.id} steht vor ${f.id}`).toBe(false);
      }
    }
  });

  it('nichts steht mitten im Weg: Sandwege bleiben frei, alles ist erreichbar (auch mit allen Gebäuden & Ständen)', () => {
    const all = buildWorldMap(VILLAGE_LAYOUT, VILLAGE_OBJECTS, VILLAGE_SPAWN);
    const flags: Record<string, boolean> = { adventszeit: true };
    for (const o of VILLAGE_OBJECTS) if (o.requires) flags[o.requires] = true;
    for (const o of VILLAGE_OBJECTS) if (o.until) flags[o.until] = true;
    applyMapFlags(all, flags);
    // 1. kein Objekt auf einem Sandweg
    for (const o of all.objects) {
      if (o.kind === 'bridge' || all.inactive.has(o.id)) continue;
      for (let y = o.y; y < o.y + o.h; y++) for (let x = o.x; x < o.x + o.w; x++) expect(VILLAGE_LAYOUT[y][x], `${o.id} steht auf dem Weg bei (${x},${y})`).not.toBe('#');
    }
    // 2. von Linas Haustür kommt man zu allen Weg- und Platz-Kacheln und an jedes Objekt
    const W = all.width;
    const seen = new Set<number>([VILLAGE_SPAWN.y * W + VILLAGE_SPAWN.x]);
    const queue = [VILLAGE_SPAWN.y * W + VILLAGE_SPAWN.x];
    while (queue.length) {
      const i = queue.pop() as number;
      const x = i % W;
      const y = Math.floor(i / W);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= all.height || all.grid.isBlocked(nx, ny)) continue;
        const ni = ny * W + nx;
        if (!seen.has(ni)) {
          seen.add(ni);
          queue.push(ni);
        }
      }
    }
    for (let y = 0; y < all.height; y++) {
      for (let x = 0; x < W; x++) {
        const ch = VILLAGE_LAYOUT[y][x];
        if ((ch === '#' || ch === ':' || ch === '=') && !all.grid.isBlocked(x, y)) expect(seen.has(y * W + x), `Weg-Kachel (${x},${y}) ist abgeschnitten`).toBe(true);
      }
    }
    for (const o of all.objects) {
      const from = interactOffsets(o);
      if (all.inactive.has(o.id) || !from || ['tree', 'pine', 'bush', 'rock'].includes(o.kind)) continue;
      const spots = from.map(([dx, dy]) => [o.x + dx, o.y + dy] as const).filter(([x, y]) => x >= 0 && y >= 0 && x < W && y < all.height && !all.grid.isBlocked(x, y));
      expect(spots.some(([x, y]) => seen.has(y * W + x)), `${o.id} ist nicht erreichbar`).toBe(true);
    }
    // 3. auf dem Dorfplatz bleibt genug Platz zum Laufen (mindestens 70 % der Pflaster-Kacheln frei, auch mit Punschstand)
    let plaza = 0;
    let free = 0;
    for (let y = 0; y < all.height; y++) for (let x = 0; x < W; x++) if (VILLAGE_LAYOUT[y][x] === ':') {
      plaza++;
      if (!all.grid.isBlocked(x, y)) free++;
    }
    expect(free / plaza).toBeGreaterThan(0.7);
  });

  it('Story-Flags tauschen Bauplatz gegen Haus (mit Kollision)', () => {
    const m = buildWorldMap(VILLAGE_LAYOUT, VILLAGE_OBJECTS, VILLAGE_SPAWN);
    expect(isActive(m, 'bauplatz-1')).toBe(true);
    expect(isActive(m, 'haus-olaf')).toBe(false);
    expect(m.grid.isBlocked(18, 15)).toBe(false);
    expect(applyMapFlags(m, { olafEingezogen: true }).sort()).toEqual(['bauplatz-1', 'haus-olaf', 'samenstand']);
    expect(isActive(m, 'haus-olaf')).toBe(true);
    expect(m.grid.isBlocked(18, 15)).toBe(true);
    expect(applyMapFlags(m, { olafEingezogen: true })).toEqual([]);
  });

  it('zwischen Linas und Olafs Haus bleibt ein Durchgang nach Osten frei (nicht nur diagonal)', () => {
    const m = buildWorldMap(VILLAGE_LAYOUT, VILLAGE_OBJECTS, VILLAGE_SPAWN);
    applyMapFlags(m, { olafEingezogen: true });
    expect(findPath(m.grid, { x: 15, y: 14 }, { x: 17, y: 14 })).not.toBeNull();
    expect(findPath(m.grid, VILLAGE_SPAWN, { x: 25, y: 14 })).not.toBeNull();
  });

  it('zwischen Brunnen und Samenstand kommt man durch (Nord–Süd)', () => {
    const m = buildWorldMap(VILLAGE_LAYOUT, VILLAGE_OBJECTS, VILLAGE_SPAWN);
    applyMapFlags(m, { olafEingezogen: true });
    for (const y of [16, 17, 18, 19, 20]) expect(m.grid.isBlocked(29, y), `29,${y}`).toBe(false);
    expect(findPath(m.grid, { x: 29, y: 16 }, { x: 29, y: 20 })).not.toBeNull();
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
      const from = interactOffsets(obj!) ?? [];
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

describe('Bewohner auf der Karte', () => {
  it('haben ein Haus mit erreichbarer Tür und gültige Orte im Tagesablauf', () => {
    for (const npc of NPCS) {
      const house = objectById(map, npc.home);
      expect(house, `${npc.id}: Haus fehlt`).toBeDefined();
      const door = { x: house!.x + 2, y: house!.y + 3 };
      expect(findPath(map.grid, VILLAGE_SPAWN, door), `${npc.id}: Tür unerreichbar`).not.toBeNull();
      for (const entry of npc.schedule) {
        const a = entry.activity;
        if (a.kind === 'sitzen') {
          const bench = objectById(map, a.bench);
          expect(bench?.kind, `${npc.id}: ${a.bench}`).toBe('bench');
          expect(findPath(map.grid, door, { x: bench!.x + 1, y: bench!.y + 1 })).not.toBeNull();
        }
        if (a.kind === 'spazieren') {
          let free = 0;
          for (let y = a.area.y; y < a.area.y + a.area.h; y++)
            for (let x = a.area.x; x < a.area.x + a.area.w; x++) if (!map.grid.isBlocked(x, y)) free++;
          expect(free, `${npc.id}: ${entry.label}`).toBeGreaterThan(5);
        }
      }
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
