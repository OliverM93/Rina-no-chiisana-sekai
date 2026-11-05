import { describe, expect, it } from 'vitest';
import { checkPlacement, exitAt, reservedCells, type Room } from '../core/room';
import { findPath } from '../core/grid';
import { buildWorldMap, objectById, OBJECT_KINDS, setExtraBlocked } from '../core/worldmap';
import { furnitureInfo } from './furniture';
import { annexOffsets, emptyRoom, HOUSE_STAGES, MAX_STAGE, roomLayouts } from './house';
import { INTERACTIONS } from './interactions';
import { VILLAGE_LAYOUT, VILLAGE_OBJECTS, VILLAGE_SPAWN } from './maps/village';

describe('Hausausbau', () => {
  it('hat sieben Stufen mit steigenden Preisen', () => {
    expect(MAX_STAGE).toBe(6);
    for (let i = 1; i < HOUSE_STAGES.length; i++) expect(HOUSE_STAGES[i].price).toBeGreaterThan(HOUSE_STAGES[i - 1].price);
  });

  it('jeder Raum jeder Stufe ist über Ausgänge erreichbar und führt zurück', () => {
    for (let stage = 0; stage <= MAX_STAGE; stage++) {
      const rooms = roomLayouts(stage);
      const ids = rooms.map((r) => r.id);
      expect(new Set(ids).size, `Stufe ${stage}: doppelte Räume`).toBe(ids.length);
      for (const r of rooms) {
        const seen = new Set<string>();
        for (const e of r.exits) {
          expect(e.to === 'draussen' || ids.includes(e.to), `${r.id} → ${e.to}`).toBe(true);
          if (e.to !== 'draussen') expect(rooms.find((o) => o.id === e.to)!.exits.some((b) => b.to === r.id), `${e.to} führt nicht zurück zu ${r.id}`).toBe(true);
          for (const [x, y] of e.cells) {
            expect(x >= 0 && y >= 0 && x < r.w && y < r.h, `${r.id}: Ausgang außerhalb`).toBe(true);
            // Ausgänge liegen an der Wand, in die sie führen
            expect(e.dir === 'up' ? y === 0 : y === r.h - 1).toBe(true);
            expect(seen.has(`${x},${y}`), `${r.id}: Ausgänge überlappen`).toBe(false);
            seen.add(`${x},${y}`);
            if (r.desk) expect(`${x},${y}`).not.toBe(`${r.desk[0]},${r.desk[1]}`);
          }
        }
      }
      // vom Wohnzimmer aus kommt man überall hin
      const reach = new Set(['haupt']);
      for (let k = 0; k < rooms.length; k++) for (const r of rooms) if (reach.has(r.id)) for (const e of r.exits) if (e.to !== 'draussen') reach.add(e.to);
      expect([...reach].sort()).toEqual([...ids].sort());
    }
  });

  it('neue Räume starten mit passender Einrichtung, die auch hineinpasst', () => {
    for (const r of roomLayouts(MAX_STAGE)) {
      const start = emptyRoom(r.id);
      const placed: Room = { ...start, items: [] };
      const res = reservedCells(r);
      for (const it of start.items) {
        expect(checkPlacement(placed, r, it.itemId, it.x, it.y, it.rot, furnitureInfo).ok, `${r.id}: ${it.itemId}`).toBe(true);
        expect(res.has(`${it.x},${it.y}`)).toBe(false);
        expect(exitAt(r, it.x, it.y)).toBeNull();
        placed.items.push(it);
      }
    }
    expect(emptyRoom('kueche').items.map((i) => i.itemId)).toContain('herd');
  });

  it('Anbauten liegen auf freier Wiese und versperren im Dorf nichts', () => {
    const map = buildWorldMap(VILLAGE_LAYOUT, VILLAGE_OBJECTS, VILLAGE_SPAWN);
    const house = objectById(map, 'haus-lina')!;
    const tiles = annexOffsets(MAX_STAGE).map(([dx, dy]) => (house.y + dy) * map.width + house.x + dx);
    for (const t of tiles) expect(map.grid.isBlocked(t % map.width, Math.floor(t / map.width)), `Kachel ${t % map.width},${Math.floor(t / map.width)}`).toBe(false);
    setExtraBlocked(map, tiles);
    for (const t of tiles) expect(map.grid.isBlocked(t % map.width, Math.floor(t / map.width))).toBe(true);
    for (const id of Object.keys(INTERACTIONS)) {
      const obj = objectById(map, id);
      if (!obj) continue;
      const from = OBJECT_KINDS[obj.kind].interactFrom ?? [];
      const ok = from.some(([dx, dy]) => !map.grid.isBlocked(obj.x + dx, obj.y + dy) && findPath(map.grid, VILLAGE_SPAWN, { x: obj.x + dx, y: obj.y + dy }) !== null);
      expect(ok, `${id} nicht mehr erreichbar`).toBe(true);
    }
  });
});
