import { describe, expect, it } from 'vitest';
import { COOPS } from './animals';
import { FURNITURE } from './furniture';
import { isKnownItem } from './items';

describe('Hühner & Wachteln', () => {
  it('jede Stallart hat ein Ei und einen Stall im Garten-Katalog', () => {
    for (const [kind, def] of Object.entries(COOPS)) {
      expect(isKnownItem(def.egg), def.egg).toBe(true);
      const stall = FURNITURE.find((f) => f.coop === kind);
      expect(stall, kind).toBeTruthy();
      expect(stall?.outdoor).toBe(true);
      expect(stall?.crafted).toBeFalsy();
      expect(def.eggs[0]).toBeLessThanOrEqual(def.eggs[1]);
    }
  });
});
