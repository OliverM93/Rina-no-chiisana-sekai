import { describe, expect, it } from 'vitest';
import { FURNITURE } from './furniture';
import { GARDEN_FLOWERS, isKeepsake, itemDef, TOOLS } from './items';
import { NPCS } from './npcs';
import { CHECKUP_GIFTS } from './npcs/lars';
import { DIG_FINDS } from './winston';

describe('Nichts geht für immer verloren', () => {
  it('Werkzeuge sind unverkäuflich und Erinnerungsstücke', () => {
    for (const t of TOOLS) {
      expect(itemDef(t)?.price, t).toBeNull();
      expect(isKeepsake(t), t).toBe(true);
    }
  });

  it('einmalige Geschenke sind unverkäuflich, Kunstwerke & Katalogmöbel nicht', () => {
    for (const f of FURNITURE) {
      const id = f.variants ? `${f.id}-${Object.keys(f.variants)[0]}` : f.id;
      const once = !!f.gift && f.style !== 'kunst';
      expect(isKeepsake(id), f.id).toBe(once);
      expect(itemDef(id)?.price === null, f.id).toBe(once);
    }
  });

  it('jede Samensorte lässt sich irgendwo bekommen (nicht nur aus der eigenen Blüte)', () => {
    const sources = new Set<string>([
      'samen-tulpe', // von Oma zum Start
      'samen-vergissmeinnicht',
      ...DIG_FINDS.map((d) => d.itemId),
      ...CHECKUP_GIFTS,
      ...NPCS.flatMap((n) => [...n.letters, ...Object.values(n.heartLetters)].map((l) => l.gift?.itemId ?? '')),
      ...NPCS.map((n) => n.dailyTreat?.itemId ?? ''),
    ]);
    for (const g of GARDEN_FLOWERS) expect(sources.has(g.seed), `${g.seed} gibt es nirgends`).toBe(true);
  });
});
