import { describe, expect, it } from 'vitest';
import { FINDS } from '../../data/fossils';
import { FISH, INSECTS } from '../../data/species';
import { FURNITURE_BY_ITEM } from '../../data/furniture';
import { makeFurniture } from './furniture';

function count(itemId: string, collected: ReadonlySet<string>): number {
  let n = 0;
  makeFurniture(itemId, undefined, collected).group.traverse(() => n++);
  return n;
}

describe('Schaukästen zeigen Linas Sammlung', () => {
  it('Insektenkasten, Fischtafel und Vitrine füllen sich mit dem, was gefangen/gefunden wurde', () => {
    for (const [id, all] of [['insektenkasten', INSECTS.map((i) => i.id)], ['fischtafel', FISH.map((i) => i.id)], ['vitrine', FINDS.map((i) => i.id)]] as const) {
      expect(FURNITURE_BY_ITEM[id], id).toBeTruthy();
      const empty = count(id, new Set());
      const some = count(id, new Set(all.slice(0, 3)));
      const full = count(id, new Set(all));
      expect(some, id).toBeGreaterThan(empty);
      expect(full, id).toBeGreaterThan(some);
    }
  });

  it('die Kästen haben für jede Art einen Platz', () => {
    expect(INSECTS.length).toBeLessThanOrEqual(24);
    expect(FISH.length).toBeLessThanOrEqual(18);
    expect(FINDS.length).toBeLessThanOrEqual(12);
  });
});
