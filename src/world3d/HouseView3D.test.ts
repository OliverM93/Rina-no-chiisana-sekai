import { describe, expect, it } from 'vitest';
import { groundFloor } from '../data/floorplan';
import { HouseView3D } from './HouseView3D';

describe('Seitendurchgänge im Haus', () => {
  it('der rechte Raum jedes Seitendurchgangs ragt nach links (kein Zwischenraum, ein Türrahmen)', () => {
    const plan = groundFloor(5);
    const grow = Object.fromEntries(plan.rooms.map((r) => [r.id, HouseView3D.shellFor(plan, r.id).growLeft]));
    // Wohnzimmer (rechts vom Wintergarten), Küche (rechts vom Wohnzimmer), Schlafzimmer (rechts vom Arbeitszimmer)
    expect(grow.haupt).toBe(true);
    expect(grow.kueche).toBe(true);
    expect(grow.schlafzimmer).toBe(true);
    // linke Räume wachsen nicht
    expect(grow.wintergarten).toBe(false);
    expect(grow.arbeitszimmer).toBe(false);
  });

  it('ohne Seitendurchgang wächst nichts', () => {
    const plan = groundFloor(2);
    for (const r of plan.rooms) expect(HouseView3D.shellFor(plan, r.id).growLeft).toBe(false);
  });
});
