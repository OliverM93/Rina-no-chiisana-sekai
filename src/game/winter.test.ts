import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { FURNITURE } from '../data/furniture';
import { isKnownItem } from '../data/items';
import { ADVENT_DOORS, PUNSCH_DRINKS } from '../data/winter';
import { Session } from './session';
import { adventLetterId, buyDrink, checkAdvent, isAdventTime, punschOpen, todaysSnowballs } from './winter';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

function sessionAt(iso: string) {
  let now = new Date(iso);
  const s = new Session(memoryStorage(), () => now);
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  s.data!.flags.toolsGiven = true;
  return { s, set: (d: string) => (now = new Date(d)) };
}

describe('Olis Adventskalender', () => {
  it('hat 24 Türchen mit echten Geschenken – das letzte ist die Schneekugel', () => {
    expect(ADVENT_DOORS).toHaveLength(24);
    for (const d of ADVENT_DOORS) if (d.gift) expect(isKnownItem(d.gift.itemId), d.gift.itemId).toBe(true);
    expect(ADVENT_DOORS[23].gift?.itemId).toBe('schneekugel-wir');
  });

  it('bringt jeden Dezembertag ein Türchen, aber jedes nur einmal', () => {
    const { s, set } = sessionAt('2026-12-03T10:00:00');
    expect(checkAdvent(s)).toBe(true);
    expect(checkAdvent(s)).toBe(false);
    expect(s.data!.mail.letters.some((l) => l.id === adventLetterId(2026, 3) && l.gift?.itemId === 'rezept-bratapfel')).toBe(true);
    set('2026-12-04T10:00:00');
    expect(checkAdvent(s)).toBe(true);
  });

  it('das 24. Türchen kommt auch noch nach Weihnachten, im November nichts', () => {
    const { s, set } = sessionAt('2026-11-30T10:00:00');
    expect(checkAdvent(s)).toBe(false);
    set('2026-12-27T10:00:00');
    expect(checkAdvent(s)).toBe(true);
    expect(s.data!.mail.letters.some((l) => l.id === adventLetterId(2026, 24))).toBe(true);
    set('2026-12-28T10:00:00');
    expect(checkAdvent(s)).toBe(false);
  });
});

describe('Schnee & Punsch', () => {
  it('Schneebälle liegen nur im Winter', () => {
    expect(todaysSnowballs(sessionAt('2026-01-15T12:00:00').s).length).toBeGreaterThan(0);
    expect(todaysSnowballs(sessionAt('2026-07-15T12:00:00').s)).toHaveLength(0);
  });

  it('Punschstand: nur im Dezember bis Weihnachten nachmittags/abends, kostet Sternchen', () => {
    expect(isAdventTime(new Date('2026-12-10T12:00:00'))).toBe(true);
    expect(isAdventTime(new Date('2026-12-28T12:00:00'))).toBe(false);
    expect(punschOpen(new Date('2026-12-10T10:00:00'))).toBe(false);
    const { s } = sessionAt('2026-12-10T18:00:00');
    s.data!.money = 100;
    expect(buyDrink(s, 'kinderpunsch').ok).toBe(true);
    expect(s.data!.money).toBe(100 - PUNSCH_DRINKS[0].price);
    s.data!.money = 0;
    expect(buyDrink(s, 'gluehwein')).toEqual({ ok: false, reason: 'geld' });
  });

  it('Wintermöbel sind saisonal, der Schneemann kommt von der Werkbank', () => {
    const winter = FURNITURE.filter((f) => f.style === 'winter');
    expect(winter.length).toBeGreaterThanOrEqual(10);
    expect(winter.find((f) => f.id === 'schneemann')?.crafted).toBe(true);
    for (const f of winter) if (!f.crafted && !f.gift) expect(f.seasonal, f.id).toBe(true);
  });
});
