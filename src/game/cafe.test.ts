import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { CAFE_GUESTS } from '../data/cafeGaeste';
import { NPC_BY_ID } from '../data/npcs';
import { cafeDay, cafeEntry, cafeGuests, cafeTalk, inCafe } from './cafe';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

function session(time: string) {
  let now = new Date(time);
  const s = new Session(memoryStorage(), () => now);
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  Object.assign(s.data!.flags, {
    giselaWelcomed: true, jensBegruesst: true, jensEingezogen: true, larsBegruesst: true, larsEingezogen: true, thaliaBegruesst: true, thaliaEingezogen: true,
    olafBegruesst: true, olafEingezogen: true, oliBegruesst: true, oliEingezogen: true,
  });
  return { s, setTime: (t: string) => (now = new Date(t)) };
}

const day = (d: number) => `2026-09-${String(d).padStart(2, '0')}`;

describe('Café-Gäste', () => {
  it('jede Person hat Texte, Getränke und eine sinnvolle Zeit', () => {
    for (const [id, def] of Object.entries(CAFE_GUESTS)) {
      expect(NPC_BY_ID[id], id).toBeDefined();
      expect(def.hours[1]).toBeGreaterThan(def.hours[0]);
      expect(def.hours[0]).toBeGreaterThanOrEqual(9);
      expect(def.hours[1]).toBeLessThanOrEqual(20);
      expect(def.drinks.length, id).toBeGreaterThan(0);
      expect(def.comments.length, id).toBeGreaterThanOrEqual(3);
    }
  });

  it('ab und zu, nicht jeden Tag: jede Person an einem Teil der Tage', () => {
    const { s, setTime } = session('2026-09-01T12:00:00');
    for (const id of Object.keys(CAFE_GUESTS)) {
      let days = 0;
      for (let d = 1; d <= 28; d++) {
        setTime(`${day(d)}T12:00:00`);
        if (cafeDay(s, id)) days++;
      }
      expect(days, id).toBeGreaterThan(2);
      expect(days, id).toBeLessThan(20);
    }
  });

  it('sitzt nur in der eigenen Zeit, nur wenn eingezogen und Jens nicht verreist, und der Tagesablauf wird ersetzt', () => {
    const { s, setTime } = session('2026-09-01T12:00:00');
    // einen Tag finden, an dem Thalia kommt
    let d = 1;
    for (; d <= 28; d++) {
      setTime(`${day(d)}T12:00:00`);
      if (cafeDay(s, 'thalia')) break;
    }
    setTime(`${day(d)}T17:30:00`);
    expect(inCafe(s, 'thalia')).toBe(true);
    expect(cafeGuests(s)).toContain('thalia');
    expect(cafeEntry(s, 'thalia')?.activity).toEqual({ kind: 'zuhause', at: 'bistro-jens' });
    setTime(`${day(d)}T20:30:00`);
    expect(inCafe(s, 'thalia')).toBe(false);
    expect(cafeEntry(s, 'thalia')).toBeNull();
    setTime(`${day(d)}T17:30:00`);
    s.data!.flags.thaliaEingezogen = false;
    expect(inCafe(s, 'thalia')).toBe(false);
    s.data!.flags.thaliaEingezogen = true;
    s.data!.flags.jensBegruesst = false;
    expect(inCafe(s, 'thalia')).toBe(false);
  });

  it('Café-Gespräch: Getränk und Satz zum Café, abwechselnd und reproduzierbar', () => {
    const { s } = session('2026-09-10T12:00:00');
    const a = cafeTalk(s, 'christin', 0)!;
    const b = cafeTalk(s, 'christin', 0)!;
    expect(a).toEqual(b);
    expect(a.lines.length).toBeGreaterThan(0);
    expect(a.drink.length).toBeGreaterThan(5);
    const seen = new Set([0, 1, 2, 3, 4, 5].map((n) => cafeTalk(s, 'christin', n)!.lines.join('|')));
    expect(seen.size).toBeGreaterThan(1);
    expect(cafeTalk(s, 'jens', 0)).toBeNull();
  });
});
