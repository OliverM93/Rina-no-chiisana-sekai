import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { drinkAlcohol } from '../core/tipsy';
import { TIPSY_NPC_LINES } from '../data/tipsy';
import { NPCS } from '../data/npcs';
import { chatWithNpc, talkToNpc } from './gameplay';
import { Session } from './session';
import { COMMENT_PAUSE_MS, tipsyComment } from './tipsy';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function newSession() {
  const m = new Map<string, string>();
  const storage: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  const s = new Session(storage, () => new Date('2026-11-10T12:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return s;
}

describe('Bewohner reagieren auf Linas Schwips', () => {
  it('jeder Bewohner hat Kommentare für beschwipst und schummrig (mehrere Varianten)', () => {
    for (const npc of NPCS) {
      const r = TIPSY_NPC_LINES[npc.id];
      expect(r, npc.id).toBeTruthy();
      expect(r.leicht.length, npc.id).toBeGreaterThanOrEqual(2);
      expect(r.schummrig.length, npc.id).toBeGreaterThanOrEqual(2);
    }
  });

  it('nüchtern: kein Kommentar', () => {
    const s = newSession();
    for (const npc of NPCS) expect(tipsyComment(s, npc.id)).toEqual([]);
  });

  it('angetrunken: jeder kommentiert – und wiederholt es nicht sofort', () => {
    const s = newSession();
    drinkAlcohol(s.tipsy, s.playTime(), 'bier');
    for (const npc of NPCS) {
      const first = tipsyComment(s, npc.id);
      expect(first.length, npc.id).toBeGreaterThan(0);
      expect(tipsyComment(s, npc.id), `${npc.id} gleich nochmal`).toEqual([]);
    }
  });

  it('beim Ansprechen und Weiterplaudern steht der Kommentar vorn', () => {
    const s = newSession();
    drinkAlcohol(s.tipsy, s.playTime(), 'bier');
    const expected = new Set(TIPSY_NPC_LINES.gisela.leicht.flat());
    const out = talkToNpc(s, 'gisela');
    expect(expected.has(out.lines[0])).toBe(true);
    // kurz danach: Weiterplaudern ohne erneuten Kommentar
    const again = chatWithNpc(s, 'gisela');
    expect(expected.has(again.lines[0])).toBe(false);
  });

  it('die Pause ist begrenzt: später gibt es wieder einen Kommentar', () => {
    const s = newSession();
    drinkAlcohol(s.tipsy, s.playTime(), 'bier');
    expect(tipsyComment(s, 'lars').length).toBeGreaterThan(0);
    s.tipsySpoken.set('lars', s.playTime() - COMMENT_PAUSE_MS - 1);
    expect(tipsyComment(s, 'lars').length).toBeGreaterThan(0);
  });
});
