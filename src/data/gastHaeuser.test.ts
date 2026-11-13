import { describe, expect, it } from 'vitest';
import { exitAt } from '../core/room';
import { FURNITURE_BY_ITEM, SURFACE_BY_ID } from './furniture';
import { GUEST_HOUSES, guestItemId, guestLayout, guestRoom } from './gastHaeuser';
import { NPC_BY_ID } from './npcs';

describe('Häuser der Bewohner von innen', () => {
  it('jedes Haus nutzt vorhandene Möbel, Tapete und Boden und liegt im Raum', () => {
    for (const [id, h] of Object.entries(GUEST_HOUSES)) {
      expect(NPC_BY_ID[h.npc], id).toBeTruthy();
      expect(SURFACE_BY_ID[h.wallpaper], `${id}: ${h.wallpaper}`).toBeTruthy();
      expect(SURFACE_BY_ID[h.floor], `${id}: ${h.floor}`).toBeTruthy();
      expect(h.intro.length, id).toBeGreaterThanOrEqual(1);
      for (const it of h.items) {
        const f = FURNITURE_BY_ITEM[guestItemId(it.id, it.variant)];
        expect(f, `${id}: ${it.id}`).toBeTruthy();
        expect(it.x >= 0 && it.y >= 0 && it.x < guestLayout(id).w && it.y < guestLayout(id).h, `${id}: ${it.id} im Raum`).toBe(true);
        // nichts auf dem Ausgang
        if (!f.def.wall && !f.def.rug && !it.on) expect(exitAt(guestLayout(id), it.x, it.y), `${id}: ${it.id} auf dem Ausgang`).toBeNull();
      }
    }
  });

  it('der Raum hat stabile Möbel-IDs, Stapel verweisen auf ein Möbel im Raum', () => {
    for (const id of Object.keys(GUEST_HOUSES)) {
      const room = guestRoom(id)!;
      const uids = new Set(room.items.map((i) => i.uid));
      expect(uids.size).toBe(room.items.length);
      for (const i of room.items) if (i.on) expect(uids.has(i.on), `${id}: ${i.itemId}`).toBe(true);
      expect(guestRoom(id)).toBe(room);
    }
  });

  it('Linas Kommentare gibt es nur für Möbel, die im Haus stehen; die meisten Möbel sind kommentiert', () => {
    for (const [id, h] of Object.entries(GUEST_HOUSES)) {
      const present = new Set(h.items.map((i) => i.id));
      for (const key of Object.keys(h.comments)) expect(present.has(key), `${id}: ${key}`).toBe(true);
      const unique = [...present];
      expect(unique.filter((k) => h.comments[k]).length / unique.length, id).toBeGreaterThanOrEqual(0.7);
    }
  });

  it('Schränke und Regale stehen an der Wand (nicht mitten im Raum), nur Tresen & Schreibtisch dürfen trennen', () => {
    const wallFurniture = new Set(['regal', 'teaksideboard', 'weinregal', 'vitrine', 'tansu', 'wuerfelregal', 'hellerau-standregal', 'fernseher']);
    for (const [id, h] of Object.entries(GUEST_HOUSES)) {
      for (const it of h.items) {
        if (!wallFurniture.has(it.id) || it.on) continue;
        const f = FURNITURE_BY_ITEM[guestItemId(it.id, it.variant)].def;
        const rot = it.rot ?? 0;
        const w = rot % 2 ? f.d : f.w;
        const d = rot % 2 ? f.w : f.d;
        const atWall = it.x === 0 || it.y === 0 || it.x + w === guestLayout(id).w || it.y + d === guestLayout(id).h;
        expect(atWall, `${id}: ${it.id} steht mitten im Raum`).toBe(true);
      }
    }
  });

  it('Stühle und Sessel stehen an einem Tisch und schauen ihn an (kein Sessel allein im Raum)', () => {
    const chairs = new Set(['bistrostuhl', 'bluemchensessel', 'ohrensessel', 'lederloungesessel', 'freischwinger']);
    const front: Record<number, [number, number]> = { 0: [0, 1], 1: [-1, 0], 2: [0, -1], 3: [1, 0] };
    for (const [id, h] of Object.entries(GUEST_HOUSES)) {
      const tables = new Set<string>();
      for (const it of h.items) {
        const f = FURNITURE_BY_ITEM[guestItemId(it.id, it.variant)].def;
        if (!(f.surface || it.id === 'schreibtisch-pc') || f.wall || f.rug || it.on || f.id.includes('regal') || f.id === 'teaksideboard') continue;
        const rot = it.rot ?? 0;
        const w = rot % 2 ? f.d : f.w;
        const d = rot % 2 ? f.w : f.d;
        for (let dx = 0; dx < w; dx++) for (let dy = 0; dy < d; dy++) tables.add(`${it.x + dx},${it.y + dy}`);
      }
      for (const it of h.items) {
        if (!chairs.has(it.id)) continue;
        const [fx, fy] = front[it.rot ?? 0];
        const seesTable = [1, 2].some((k) => tables.has(`${it.x + fx * k},${it.y + fy * k}`));
        expect(seesTable, `${id}: ${it.id} (${it.x},${it.y}) schaut keinen Tisch an`).toBe(true);
      }
    }
  });
});
