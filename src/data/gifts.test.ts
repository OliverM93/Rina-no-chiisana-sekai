import { describe, expect, it } from 'vitest';
import { FURNITURE_ITEMS } from './furniture';
import { NPCS } from './npcs';

// Diese bringt Oli beim Einzug mit (siehe World3D.oliArrival)
const MOVE_IN_GIFTS = ['schreibtisch-pc', 'hantelbank'];

describe('Geschenk-Möbel', () => {
  it('jedes Möbel „nur als Geschenk“ kommt irgendwoher', () => {
    const fromLetters = new Set(NPCS.flatMap((n) => [...n.letters, ...Object.values(n.heartLetters)]).map((l) => l.gift?.itemId));
    for (const f of FURNITURE_ITEMS.filter((x) => x.def.gift)) expect(fromLetters.has(f.itemId) || MOVE_IN_GIFTS.includes(f.itemId), f.itemId).toBe(true);
  });

  it('Oli wohnt bei Lina und nennt sie Lini', () => {
    const oli = NPCS.find((n) => n.id === 'oli');
    expect(oli?.home).toBe('haus-lina');
    expect(oli?.dialogue.greetings.some((g) => g.text.join(' ').includes('Lini'))).toBe(true);
  });
});
