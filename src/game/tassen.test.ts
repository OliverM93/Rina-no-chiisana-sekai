import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { TASSEN } from '../data/tassen';
import { giveItem } from './gameplay';
import { Session } from './session';
import { tassenStand, tassenZaehler } from './tassen';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function session() {
  const m = new Map<string, string>();
  const storage: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  const s = new Session(storage, () => new Date('2026-07-10T09:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return s;
}

describe('Tassensammlung', () => {
  it('zählt Tassen in der Tasche und im Regal, gibt Hinweise und kennt das Ende', () => {
    const s = session();
    expect(tassenZaehler(s).have).toBe(0);
    giveItem(s, 'tasse-stadt-paris', 1, false);
    giveItem(s, 'tasse-klassik-gruen', 1, false);
    s.data!.house.rooms[0].items.push({ uid: 'x', itemId: 'tasse-saison-winter', x: 1, y: 1, rot: 0 });
    const z = tassenZaehler(s);
    expect(z.have).toBe(3);
    expect(z.byKind.stadt[0]).toBe(1);
    expect(tassenStand(s).join(' ')).toContain('3 von');
    expect(tassenStand(s).join(' ')).toContain('Jens');
    // alles besitzen
    for (const t of TASSEN) if (!s.data!.inventory.slots.some((sl) => sl?.itemId === t.id)) s.data!.house.rooms[0].items.push({ uid: `u-${t.id}`, itemId: t.id, x: 1, y: 1, rot: 0 });
    expect(tassenZaehler(s).have).toBe(TASSEN.length);
    expect(tassenStand(s).join(' ')).toContain('Alle da');
  });
});
