import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { reactionTo } from '../core/friendship';
import { GESCHENK_SPRUECHE } from '../data/geschenkSprueche';
import { itemDef } from '../data/items';
import { NPC_BY_ID } from '../data/npcs';
import { giftExtraLines } from './gameplay';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function fresh(date = '2026-06-10T14:00:00') {
  const m = new Map<string, string>();
  const storage: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  const s = new Session(storage, () => new Date(date));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return s;
}

describe('Extra-Sätze beim Schenken', () => {
  it('gehören zu echten Bewohnern und echten Gegenständen, jeder mit mindestens einem Satz', () => {
    for (const [npcId, byItem] of Object.entries(GESCHENK_SPRUECHE)) {
      expect(NPC_BY_ID[npcId], npcId).toBeTruthy();
      for (const [itemId, lines] of Object.entries(byItem)) {
        if (itemId !== 'strauss') expect(itemDef(itemId), `${npcId}:${itemId}`).toBeTruthy();
        expect(lines.length).toBeGreaterThan(0);
        for (const l of lines) expect(l.length).toBeGreaterThan(5);
      }
    }
  });

  it('jeder Bewohner hat welche, und sie decken Mögen und Nicht-Mögen ab', () => {
    for (const npcId of ['olaf', 'christin', 'jens', 'lars', 'gisela', 'oli', 'thalia']) {
      const byItem = GESCHENK_SPRUECHE[npcId];
      expect(byItem, npcId).toBeTruthy();
      const reactions = new Set(Object.keys(byItem).map((id) => reactionTo(NPC_BY_ID[npcId].preferences, id)));
      expect(reactions.has('liebt') || reactions.has('mag'), npcId).toBe(true);
      expect(reactions.has('mag-nicht'), npcId).toBe(true);
    }
  });

  it('kommen nur manchmal vor (nicht immer, nicht nie) und sind je Tag reproduzierbar', () => {
    let some = 0;
    let none = 0;
    for (let d = 1; d <= 28; d++) {
      const s = fresh(`2026-06-${String(d).padStart(2, '0')}T14:00:00`);
      const a = giftExtraLines(s, 'jens', 'crepes');
      expect(giftExtraLines(s, 'jens', 'crepes')).toEqual(a);
      if (a.length > 0) some++;
      else none++;
    }
    expect(some).toBeGreaterThan(3);
    expect(none).toBeGreaterThan(3);
    // ohne eigenen Satz: nie
    expect(giftExtraLines(fresh(), 'jens', 'ast-gibts-nicht')).toEqual([]);
  });
});
