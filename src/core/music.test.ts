import { describe, expect, it } from 'vitest';
import { composeSection, createMoodGate, degreeToMidi, FORM, gateMood, midiToHz, MIN_DWELL_MS, SOFT_DELAY_MS, SONG_ROUNDS, type Mood, MOODS, moodFor, pickTheme, placeMood, sectionSteps, THEMES, themesFor } from './music';

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

  it('draußen wechseln sich mehrere Lieder ab, jedes Lied hat sein eigenes Gesicht', () => {
    for (const [base, list] of Object.entries(THEMES) as [Mood, readonly Mood[]][]) {
      expect(list[0], base).toBe(base);
      expect(list.length, base).toBeGreaterThanOrEqual(4);
      expect(new Set(list).size).toBe(list.length);
      for (const m of list) expect(MOODS[m], m).toBeTruthy();
      // aufeinanderfolgende Lieder sind verschieden, nach einer Runde ist jedes einmal drangewesen
      const songs = Array.from({ length: list.length }, (_, i) => pickTheme(base, i, 12345));
      expect(new Set(songs).size).toBe(list.length);
      for (let i = 1; i < 12; i++) expect(pickTheme(base, i, 99)).not.toBe(pickTheme(base, i - 1, 99));
    }
    // Namen und Klang unterscheiden sich
    const names = Object.values(MOODS).map((m) => m.name);
    expect(new Set(names).size).toBe(names.length);
    // Tageslieder je Jahreszeit
    expect(themesFor('tag', 'sommer')).toContain('tag-eis');
    expect(themesFor('tag', 'winter')).toContain('tag-frost');
    expect(themesFor('tag', 'winter')).not.toContain('tag-eis');
    // Orts-Themen bleiben bei ihrem Lied
    expect(themesFor('oma', 'sommer')).toEqual(['oma']);
    expect(pickTheme('bistro', 7, 3)).toBe('bistro');
  });

  it('Hilfsfunktionen', () => {
    expect(midiToHz(69)).toBeCloseTo(440);
    expect(degreeToMidi(MOODS.tag, 7)).toBe(72);
  });
});

describe('Musik draußen wechselt nicht ständig', () => {
  it('ein Lied dauert mehrere Runden (statt nach einer Minute zu wechseln)', () => {
    expect(SONG_ROUNDS).toBeGreaterThanOrEqual(3);
  });

  it('weiche Wechsel (Ort, Wetter) brauchen Geduld: erst nach Verzögerung und Mindestdauer', () => {
    const g = createMoodGate('tag', 0);
    // Lina läuft an einem Haus vorbei: kurz Ortsthema, dann wieder weg → bleibt beim Tagesthema
    expect(gateMood(g, 'zuhause', 1000, false)).toBe('tag');
    expect(gateMood(g, 'zuhause', 1000 + SOFT_DELAY_MS - 1, false)).toBe('tag');
    expect(gateMood(g, 'tag', 1000 + SOFT_DELAY_MS, false)).toBe('tag');
    // bleibt der Wunsch lange genug, wechselt es – aber nicht vor der Mindestdauer des aktuellen Liedes
    expect(gateMood(g, 'regen', 5000, false)).toBe('tag');
    expect(gateMood(g, 'regen', 5000 + SOFT_DELAY_MS, false)).toBe('tag');
    expect(gateMood(g, 'regen', MIN_DWELL_MS, false)).toBe('regen');
  });

  it('hin und her flackernde Wünsche lösen keinen Wechsel aus', () => {
    const g = createMoodGate('tag', 0);
    let t = 0;
    for (let i = 0; i < 20; i++) {
      t += 4000;
      expect(gateMood(g, i % 2 ? 'regen' : 'abend', t, false)).toBe('tag');
    }
  });

  it('harte Wechsel (ins Haus, Party) gelten sofort', () => {
    const g = createMoodGate('tag', 0);
    expect(gateMood(g, 'zuhause', 500, true)).toBe('zuhause');
    expect(gateMood(g, 'party', 600, true)).toBe('party');
  });
});
