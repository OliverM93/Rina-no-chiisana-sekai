import { describe, expect, it } from 'vitest';
import { composeSection, degreeToMidi, FORM, midiToHz, type Mood, MOODS, moodFor, placeMood, sectionSteps } from './music';

const ALL = Object.keys(MOODS) as Mood[];

describe('Musik', () => {
  it('Stimmung nach Uhrzeit, Wetter, Ort', () => {
    const base = { raining: false, snowing: false, inside: false, party: false };
    expect(moodFor(7, base)).toBe('morgen');
    expect(moodFor(12, base)).toBe('tag');
    expect(moodFor(19, base)).toBe('abend');
    expect(moodFor(23, base)).toBe('nacht');
    expect(moodFor(12, { ...base, raining: true })).toBe('regen');
    expect(moodFor(12, { ...base, inside: true })).toBe('zuhause');
    expect(moodFor(12, { ...base, inside: true, home: 'lina-oli' })).toBe('lina-oli');
    expect(moodFor(20, { ...base, party: true })).toBe('party');
    expect(moodFor(12, { ...base, place: 'bistro' })).toBe('bistro');
    expect(moodFor(12, { ...base, raining: true, place: 'oma' })).toBe('oma');
    expect(moodFor(23, { ...base, place: 'oma' })).toBe('nacht');
    // am Strand läuft dieselbe Musik wie sonst draußen (nur das Meeresrauschen kommt dazu)
    expect(moodFor(12, { ...base })).toBe('tag');
  });

  it('Abschnitte sind reproduzierbar, bleiben in der Tonleiter und im Takt', () => {
    for (const mood of ALL) {
      const def = MOODS[mood];
      for (const part of FORM) {
        const a = composeSection(mood, 42, part);
        expect(composeSection(mood, 42, part)).toEqual(a);
        expect(a.some((n) => n.voice === 'lead')).toBe(true);
        for (const n of a) {
          expect(n.step).toBeGreaterThanOrEqual(0);
          expect(n.step).toBeLessThan(sectionSteps(mood));
          if (n.voice === 'lead') expect(def.scale).toContain((((n.midi - def.root) % 12) + 12) % 12);
        }
      }
    }
    expect(composeSection('tag', 43)).not.toEqual(composeSection('tag', 42));
  });

  it('A und A2 teilen das Motiv (man erkennt die Melodie wieder), B ist anders', () => {
    const rhythm = (part: 'A' | 'A2' | 'B') => composeSection('lina-oli', 5, part).filter((n) => n.voice === 'lead').map((n) => n.step);
    expect(rhythm('A2')).toEqual(rhythm('A'));
    expect(rhythm('B')).not.toEqual(rhythm('A'));
  });

  it('Walzer-Themen haben 3/4, Party Schlagzeug, Nacht nicht', () => {
    expect(sectionSteps('bistro')).toBe(24);
    expect(sectionSteps('tag')).toBe(32);
    expect(composeSection('party', 1).some((n) => n.voice === 'kick')).toBe(true);
    expect(composeSection('nacht', 1).some((n) => n.voice === 'kick')).toBe(false);
  });

  it('Orts-Thema: nächstes aktives Gebäude im Umkreis', () => {
    const places = [
      { object: 'a', mood: 'oma' as Mood, radius: 4 },
      { object: 'b', mood: 'bistro' as Mood, radius: 4 },
      { object: 'c', mood: 'praxis' as Mood, radius: 4 },
    ];
    const centers: Record<string, { x: number; y: number } | null> = { a: { x: 0, y: 0 }, b: { x: 5, y: 0 }, c: null };
    expect(placeMood(1, 0, places, (id) => centers[id])).toBe('oma');
    expect(placeMood(4, 0, places, (id) => centers[id])).toBe('bistro');
    expect(placeMood(20, 20, places, (id) => centers[id])).toBe(null);
  });

  it('Hilfsfunktionen', () => {
    expect(midiToHz(69)).toBeCloseTo(440);
    expect(degreeToMidi(MOODS.tag, 7)).toBe(72);
  });
});
