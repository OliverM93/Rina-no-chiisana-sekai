import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { STRAUSS_LINES } from '../data/straussLust';
import { NPC_BY_ID } from '../data/npcs';
import { giftToNpc, giveItem, npcState } from './gameplay';
import { memoryTags } from './erinnerungen';
import { visitComments } from './besuch';
import { straussLustLines, wantedBouquet, weekKey } from './straussLust';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function session(time = '2026-06-10T12:00:00') {
  const m = new Map<string, string>();
  const storage: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  let now = new Date(time);
  const s = new Session(storage, () => now);
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  s.data!.flags.giselaWelcomed = true;
  return { s, setTime: (t: string) => (now = new Date(t)) };
}

/** Erste Woche, in der Oma Lust auf einen Strauß hat */
function lustWeek(s: Session, setTime: (t: string) => void, npc = 'gisela') {
  for (let d = 1; d <= 200; d += 7) {
    const date = new Date(2026, 0, d + 4, 12);
    setTime(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T12:00:00`);
    if (wantedBouquet(s, npc)) return;
  }
  throw new Error('keine Woche gefunden');
}

describe('Sträuße als Geschenk', () => {
  it('jeder Bewohner hat Dank-, Lust- und Wunsch-Dank-Zeilen', () => {
    for (const id of Object.keys(STRAUSS_LINES)) {
      expect(NPC_BY_ID[id]).toBeDefined();
      expect(STRAUSS_LINES[id].thanks.length).toBeGreaterThan(0);
      expect(STRAUSS_LINES[id].lust.join(' ')).toContain('{strauss}');
      expect(STRAUSS_LINES[id].lustThanks.join(' ')).toContain('{strauss}');
    }
  });

  it('geliebter Strauß: 10 Punkte mehr und eine eigene Dankes-Zeile; ein gemochter bleibt wie bisher', () => {
    const { s } = session();
    const base = npcState(s, 'gisela').points;
    giveItem(s, 'strauss-bunt', 1, false); // Oma liebt ihn
    const out = giftToNpc(s, 'gisela', 'strauss-bunt')!;
    expect(out.reaction).toBe('liebt');
    expect(npcState(s, 'gisela').points - base).toBe(30 + 10);
    expect(out.lines.join(' ')).toContain('Strauß');
    // gemochter Strauß (Oma mag den Rosenstrauß): kein Bonus
    const { s: t } = session();
    const base2 = npcState(t, 'gisela').points;
    giveItem(t, 'strauss-rosen', 1, false);
    expect(giftToNpc(t, 'gisela', 'strauss-rosen')!.reaction).toBe('mag');
    expect(npcState(t, 'gisela').points - base2).toBe(16);
  });

  it('zweites Geschenk am selben Tag: kein Bonus', () => {
    const { s } = session();
    giveItem(s, 'strauss-bunt', 2, false);
    giftToNpc(s, 'gisela', 'strauss-bunt');
    const before = npcState(s, 'gisela').points;
    giftToNpc(s, 'gisela', 'strauss-bunt');
    expect(npcState(s, 'gisela').points - before).toBe(1);
  });
});

describe('Lust auf einen Strauß', () => {
  it('nur in manchen Wochen, ohne Zwang: wird einmal am Tag erzählt', () => {
    const { s, setTime } = session();
    let weeks = 0;
    for (let i = 0; i < 40; i++) {
      const d = new Date(2026, 0, 5 + i * 7, 12);
      setTime(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T12:00:00`);
      if (wantedBouquet(s, 'gisela')) weeks++;
    }
    expect(weeks).toBeGreaterThan(3);
    expect(weeks).toBeLessThan(20);
    lustWeek(s, setTime);
    const first = straussLustLines(s, 'gisela');
    expect(first.length).toBeGreaterThan(0);
    expect(first.join(' ')).not.toContain('{strauss}');
    expect(straussLustLines(s, 'gisela')).toEqual([]); // heute schon erzählt
  });

  it('der gewünschte Strauß bringt noch einmal 10 dazu, dann ist die Lust gestillt', () => {
    const { s, setTime } = session();
    lustWeek(s, setTime);
    const want = wantedBouquet(s, 'gisela')!;
    giveItem(s, want, 1, false);
    const base = npcState(s, 'gisela').points;
    const out = giftToNpc(s, 'gisela', want)!;
    expect(npcState(s, 'gisela').points - base).toBe(30 + 10 + 10);
    expect(out.lines.join(' ')).not.toContain('{strauss}');
    expect(wantedBouquet(s, 'gisela')).toBeNull();
    expect(weekKey(s.clock())).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('Vase im Haus', () => {
  it('Gäste und Gespräche erwähnen Blumendeko, sobald eine Vase oder ein Kranz im Haus steht', () => {
    const { s } = session();
    expect(memoryTags(s)).not.toContain('blumendeko');
    s.data!.house.rooms[0].items.push({ uid: 'v1', itemId: 'vase-strauss-bunt', x: 1, y: 1, rot: 0 });
    expect(memoryTags(s)).toContain('blumendeko');
    expect(visitComments(s, 'gisela').flat().join(' ')).toContain('Blümchen');
    expect(visitComments(s, 'jens').flat().join(' ')).toContain('fleurs');
  });
});
