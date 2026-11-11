import { describe, expect, it } from 'vitest';
import { FURNITURE, variantItemId } from './furniture';
import { GARDEN_FLOWERS, isKeepsake, itemDef, TOOLS } from './items';
import { NPCS } from './npcs';
import { ALL_STAND_SEEDS } from './seedstand';
import { CHECKUP_GIFTS } from './npcs/lars';
import { DIG_FINDS } from './winston';
import { ADVENT_DOORS } from './winter';

describe('Nichts geht für immer verloren', () => {
  it('Werkzeuge sind unverkäuflich und Erinnerungsstücke', () => {
    for (const t of TOOLS) {
      expect(itemDef(t)?.price, t).toBeNull();
      expect(isKeepsake(t), t).toBe(true);
    }
  });

  it('einmalige Geschenke sind unverkäuflich, Kunstwerke & Katalogmöbel nicht', () => {
    for (const f of FURNITURE) {
      const id = f.variants ? variantItemId(f, Object.keys(f.variants)[0]) : f.id;
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
      ...[...NPCS.flatMap((n) => [...n.letters, ...Object.values(n.heartLetters)]), ...ADVENT_DOORS].map((l) => l.gift?.itemId ?? ''),
      'samen-tulpe-gelb', // von Oma zum Start
      ...NPCS.map((n) => n.dailyTreat?.itemId ?? ''),
      ...ALL_STAND_SEEDS, // Christins Samenstand
    ]);
    // Mischfarben entstehen nur durch Kreuzen (siehe flowers.test.ts)
    for (const g of GARDEN_FLOWERS.filter((x) => !x.crossOnly)) expect(sources.has(g.seed), `${g.seed} gibt es nirgends`).toBe(true);
  });
});
