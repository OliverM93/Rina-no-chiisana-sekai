import { describe, expect, it } from 'vitest';
import { pickIdleAct } from './idle';
import { mulberry32 } from '../core/rng';

const day = { hour: 12, raining: false, winter: false, inside: false, winstonNear: false };

describe('Leerlauf-Animationen', () => {
  it('nie zweimal dieselbe hintereinander', () => {
    const rnd = mulberry32(3);
    let last = null;
    for (let i = 0; i < 50; i++) {
      const a = pickIdleAct(day, last, rnd);
      expect(a).not.toBeNull();
      expect(a?.id).not.toBe(last);
      last = a?.id ?? null;
    }
  });

  it('passt zur Lage: Kraulen nur mit Winston, Regen nur draußen bei Regen', () => {
    const seen = (ctx: typeof day) => {
      const rnd = mulberry32(7);
      const s = new Set<string>();
      for (let i = 0; i < 300; i++) s.add(pickIdleAct(ctx, null, rnd)?.id ?? '');
      return s;
    };
    expect(seen(day).has('kraulen')).toBe(false);
    expect(seen(day).has('regen-fuehlen')).toBe(false);
    expect(seen({ ...day, winstonNear: true }).has('kraulen')).toBe(true);
    expect(seen({ ...day, raining: true }).has('regen-fuehlen')).toBe(true);
    expect(seen({ ...day, raining: true, inside: true }).has('regen-fuehlen')).toBe(false);
    expect(seen({ ...day, winter: true }).has('haende-reiben')).toBe(true);
  });
});
