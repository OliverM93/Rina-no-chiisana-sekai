import { describe, expect, it } from 'vitest';
import { composePhrase, degreeToMidi, midiToHz, MOODS, moodFor } from './music';

describe('Musik', () => {
  it('Stimmung nach Uhrzeit, Wetter, Ort', () => {
    const base = { raining: false, snowing: false, inside: false, party: false };
    expect(moodFor(7, base)).toBe('morgen');
    expect(moodFor(12, base)).toBe('tag');
    expect(moodFor(19, base)).toBe('abend');
    expect(moodFor(23, base)).toBe('nacht');
    expect(moodFor(12, { ...base, raining: true })).toBe('regen');
    expect(moodFor(12, { ...base, inside: true })).toBe('zuhause');
    expect(moodFor(20, { ...base, party: true })).toBe('party');
  });

  it('Phrasen sind reproduzierbar und bleiben in der Tonleiter', () => {
    const a = composePhrase('tag', 42);
    expect(composePhrase('tag', 42)).toEqual(a);
    expect(composePhrase('tag', 43)).not.toEqual(a);
    const def = MOODS.tag;
    for (const n of a.filter((x) => x.voice === 'lead')) {
      expect(def.scale).toContain((((n.midi - def.root) % 12) + 12) % 12);
      expect(n.step).toBeLessThan(32);
    }
    expect(a.some((n) => n.voice === 'lead')).toBe(true);
  });

  it('Party hat Schlagzeug, Nacht nicht', () => {
    expect(composePhrase('party', 1).some((n) => n.voice === 'kick')).toBe(true);
    expect(composePhrase('nacht', 1).some((n) => n.voice === 'kick')).toBe(false);
  });

  it('Hilfsfunktionen', () => {
    expect(midiToHz(69)).toBeCloseTo(440);
    expect(degreeToMidi(MOODS.tag, 7)).toBe(72);
  });
});
