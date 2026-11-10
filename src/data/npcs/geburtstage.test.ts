import { describe, expect, it } from 'vitest';
import { NPCS } from '.';

describe('Geburtstage der Bewohner', () => {
  it('alle außer Oma haben einen Geburtstag mit Sprüchen; die Daten stimmen', () => {
    const want: Record<string, [number, number]> = { oli: [29, 7], lars: [3, 1], christin: [4, 6], olaf: [3, 4], jens: [3, 4], thalia: [11, 8] };
    for (const [id, [day, month]] of Object.entries(want)) {
      const n = NPCS.find((x) => x.id === id)!;
      expect(n.birthday, id).toEqual({ day, month });
      expect(n.birthdayLines?.greeting.length, id).toBeGreaterThanOrEqual(2);
      expect(n.birthdayLines?.thanks.length, id).toBeGreaterThanOrEqual(1);
    }
  });

  it('Oma erinnert an jeden Geburtstag vorher', () => {
    const oma = NPCS.find((x) => x.id === 'gisela')!;
    for (const id of ['oli', 'lars', 'christin', 'olaf', 'jens', 'thalia']) {
      expect([...oma.dialogue.greetings, ...oma.dialogue.chat].some((l) => l.when?.tags?.includes(`bald-geburtstag-${id}`)), id).toBe(true);
    }
  });
});
