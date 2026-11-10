import { describe, expect, it } from 'vitest';
import { exitAt } from '../core/room';
import { FURNITURE_BY_ITEM, SURFACE_BY_ID } from './furniture';
import { GUEST_HOUSES, GUEST_LAYOUT, guestItemId, guestRoom } from './gastHaeuser';
import { NPC_BY_ID } from './npcs';

describe('Häuser der Bewohner von innen', () => {
  it('jedes Haus nutzt vorhandene Möbel, Tapete und Boden und liegt im Raum', () => {
    for (const [id, h] of Object.entries(GUEST_HOUSES)) {
      expect(NPC_BY_ID[h.npc], id).toBeTruthy();
      expect(SURFACE_BY_ID[h.wallpaper], `${id}: ${h.wallpaper}`).toBeTruthy();
      expect(SURFACE_BY_ID[h.floor], `${id}: ${h.floor}`).toBeTruthy();
      expect(h.intro.length, id).toBeGreaterThanOrEqual(1);
      for (const it of h.items) {
        const f = FURNITURE_BY_ITEM[guestItemId(it.id)];
        expect(f, `${id}: ${it.id}`).toBeTruthy();
        expect(it.x >= 0 && it.y >= 0 && it.x < GUEST_LAYOUT.w && it.y < GUEST_LAYOUT.h, `${id}: ${it.id} im Raum`).toBe(true);
        // nichts auf dem Ausgang
        if (!f.def.wall && !f.def.rug && !it.on) expect(exitAt(GUEST_LAYOUT, it.x, it.y), `${id}: ${it.id} auf dem Ausgang`).toBeNull();
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
});
