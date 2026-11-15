import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { buzzAt, DECAY_SEC, drinkAlcohol } from '../core/tipsy';
import { OLI_HIGHBALL_LINES, TIPSY_NPC_LINES } from '../data/tipsy';
import { NPCS } from '../data/npcs';
import { chatWithNpc, talkToNpc } from './gameplay';
import { Session } from './session';
import { COMMENT_PAUSE_SEC, tipsyComment } from './tipsy';

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

  it('Lieblingsgetränk Highball: Oli sagt, dass Lina davon immer so lustig wird – andere Bewohner reagieren wie sonst', () => {
    const s = newSession();
    drinkAlcohol(s.tipsy, s.playTime(), 'highball');
    s.lastAlcohol = 'highball';
    const oli = tipsyComment(s, 'oli').join(' ');
    expect(OLI_HIGHBALL_LINES.leicht.flat().join(' ')).toContain(oli.slice(0, 30));
    expect(oli).toContain('lustig');
    const lars = tipsyComment(s, 'lars');
    expect(TIPSY_NPC_LINES.lars.leicht.flat()).toEqual(expect.arrayContaining([lars[0]]));
    // nach Bier wieder die normalen Zeilen
    const t = newSession();
    drinkAlcohol(t.tipsy, t.playTime(), 'bier');
    t.lastAlcohol = 'bier';
    expect(tipsyComment(t, 'oli').join(' ')).not.toContain('Zitronen');
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
    s.tipsySpoken.set('lars', s.playTime() - COMMENT_PAUSE_SEC - 1);
    expect(tipsyComment(s, 'lars').length).toBeGreaterThan(0);
  });

  it('Einheit: Spielzeit läuft in Sekunden – nach einer Minute Spielzeit ist ein Glas wirklich weg', () => {
    const s = newSession();
    drinkAlcohol(s.tipsy, s.playTime(), 'bier');
    expect(buzzAt(s.tipsy, s.playTime())).toBeGreaterThan(0.9);
    s.data!.playTimeSec += DECAY_SEC + 1; // eine Minute später
    expect(buzzAt(s.tipsy, s.playTime())).toBe(0);
  });
});
