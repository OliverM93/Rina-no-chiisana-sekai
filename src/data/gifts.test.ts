import { describe, expect, it } from 'vitest';
import { FURNITURE_ITEMS } from './furniture';
import { NPCS } from './npcs';
import { TRAVELS } from './npcs/jens';

// Diese bringt Oli beim Einzug mit (siehe World3D.oliArrival)
const MOVE_IN_GIFTS = ['schreibtisch-pc', 'hantelbank'];

describe('Geschenk-Möbel', () => {
  it('jedes Möbel „nur als Geschenk“ kommt irgendwoher', () => {
    const fromLetters = new Set(NPCS.flatMap((n) => [...n.letters, ...Object.values(n.heartLetters)]).map((l) => l.gift?.itemId));
    for (const f of FURNITURE_ITEMS.filter((x) => x.def.gift)) expect(fromLetters.has(f.itemId) || MOVE_IN_GIFTS.includes(f.itemId) || TRAVELS.some((t) => t.souvenir === f.itemId), f.itemId).toBe(true);
  });

  it('Oli wohnt bei Lina und nennt sie Lini', () => {
    const oli = NPCS.find((n) => n.id === 'oli');
    expect(oli?.home).toBe('haus-lina');
    expect(oli?.dialogue.greetings.some((g) => [g.text].flat().join(' ').includes('Lini'))).toBe(true);
  });
});

describe('Onkel Jens', () => {
  it('reist ungefähr jeden 7. Tag – reproduzierbar', async () => {
    const { jensTravels } = await import('./npcs/jens');
    let n = 0;
    for (let d = 1; d <= 28; d++) for (const m of ['01', '04', '07']) if (jensTravels(`2026-${m}-${String(d).padStart(2, '0')}`)) n++;
    expect(n).toBeGreaterThan(5);
    expect(n).toBeLessThan(25);
    expect(jensTravels('2026-11-05')).toBe(jensTravels('2026-11-05'));
  });

  it('jede Postkarte bringt ein echtes Andenken mit', async () => {
    const { TRAVELS, travelPostcard } = await import('./npcs/jens');
    const { isKnownItem } = await import('./items');
    TRAVELS.forEach((t, i) => {
      expect(isKnownItem(t.souvenir), t.souvenir).toBe(true);
      expect(travelPostcard('2026-11-05', i).subject).toContain(t.city);
    });
  });
});
