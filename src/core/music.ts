/**
 * Musik als Noten: kleine, sanfte Stücke werden aus einer Stimmung (Tag, Abend,
 * Nacht, Regen, Party, Zuhause) reproduzierbar erzeugt. Reine Logik – gespielt
 * wird in `audio/Audio.ts` mit der Web Audio API.
 */
import { mulberry32 } from './rng';

export type Mood = 'morgen' | 'tag' | 'abend' | 'nacht' | 'regen' | 'party' | 'zuhause' | 'schnee';

export interface MoodDef {
  /** Schläge pro Minute */
  bpm: number;
  /** Grundton (MIDI) */
  root: number;
  /** Tonleiter (Halbtöne über dem Grundton) */
  scale: readonly number[];
  /** Akkordfolge (Stufen der Tonleiter, 0-basiert), ein Akkord pro Takt */
  chords: readonly number[];
  /** Wie dicht die Melodie ist (0..1) */
  density: number;
  /** Melodie-Instrument */
  lead: 'spieluhr' | 'marimba' | 'floete';
  /** Bass spielen? */
  bass: boolean;
  /** Schlagzeug (nur Party) */
  drums: boolean;
}

const MAJOR_PENTA = [0, 2, 4, 7, 9];
const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const MINOR = [0, 2, 3, 5, 7, 8, 10];

export const MOODS: Record<Mood, MoodDef> = {
  morgen: { bpm: 88, root: 62, scale: MAJOR, chords: [0, 3, 4, 0], density: 0.55, lead: 'floete', bass: true, drums: false },
  tag: { bpm: 96, root: 60, scale: MAJOR, chords: [0, 5, 3, 4], density: 0.65, lead: 'marimba', bass: true, drums: false },
  abend: { bpm: 78, root: 65, scale: MAJOR, chords: [0, 3, 5, 4], density: 0.45, lead: 'marimba', bass: true, drums: false },
  nacht: { bpm: 62, root: 57, scale: MAJOR_PENTA, chords: [0, 3, 4, 3], density: 0.28, lead: 'spieluhr', bass: false, drums: false },
  regen: { bpm: 70, root: 57, scale: MINOR, chords: [0, 5, 2, 6], density: 0.35, lead: 'spieluhr', bass: true, drums: false },
  schnee: { bpm: 68, root: 64, scale: MAJOR_PENTA, chords: [0, 3, 0, 4], density: 0.35, lead: 'spieluhr', bass: false, drums: false },
  zuhause: { bpm: 72, root: 63, scale: MAJOR, chords: [0, 3, 1, 4], density: 0.4, lead: 'spieluhr', bass: true, drums: false },
  party: { bpm: 118, root: 60, scale: MAJOR, chords: [0, 4, 5, 3], density: 0.8, lead: 'marimba', bass: true, drums: true },
};

export interface NoteEvent {
  /** Start in Achteln ab Beginn des Stücks */
  step: number;
  /** Länge in Achteln */
  len: number;
  midi: number;
  voice: 'lead' | 'pad' | 'bass' | 'kick' | 'hat';
  /** Lautstärke 0..1 */
  vel: number;
}

/** Ton der Tonleiter (Stufe kann über eine Oktave hinausgehen) */
export function degreeToMidi(def: MoodDef, degree: number): number {
  const n = def.scale.length;
  const oct = Math.floor(degree / n);
  const idx = ((degree % n) + n) % n;
  return def.root + oct * 12 + def.scale[idx];
}

/** Ein Durchgang der Akkordfolge (4 Takte à 8 Achtel), reproduzierbar über `seed` */
export function composePhrase(mood: Mood, seed: number): NoteEvent[] {
  const def = MOODS[mood];
  const rnd = mulberry32(seed);
  const out: NoteEvent[] = [];
  let deg = 7 + Math.floor(rnd() * 3);
  def.chords.forEach((chord, bar) => {
    const s0 = bar * 8;
    // Pad: Dreiklang auf der Akkordstufe, liegt den ganzen Takt
    for (const k of [0, 2, 4]) out.push({ step: s0, len: 8, midi: degreeToMidi(def, chord + k) - 12, voice: 'pad', vel: 0.35 });
    if (def.bass) {
      out.push({ step: s0, len: 3, midi: degreeToMidi(def, chord) - 24, voice: 'bass', vel: 0.6 });
      out.push({ step: s0 + 4, len: 3, midi: degreeToMidi(def, chord + (rnd() < 0.5 ? 4 : 0)) - 24, voice: 'bass', vel: 0.45 });
    }
    if (def.drums) {
      for (let i = 0; i < 8; i += 2) out.push({ step: s0 + i, len: 1, midi: 0, voice: 'kick', vel: i % 4 === 0 ? 0.9 : 0.5 });
      for (let i = 1; i < 8; i += 2) out.push({ step: s0 + i, len: 1, midi: 0, voice: 'hat', vel: 0.35 });
    }
    // Melodie: Zufallsschritte in der Tonleiter, Akkordtöne auf betonten Zählzeiten
    for (let i = 0; i < 8; i++) {
      if (rnd() > def.density * (i % 2 === 0 ? 1.15 : 0.75)) continue;
      const strong = i % 4 === 0;
      if (strong) {
        // nächster Akkordton
        const targets = [chord, chord + 2, chord + 4].map((t) => t + 7);
        deg = targets.reduce((best, t) => (Math.abs(t - deg) < Math.abs(best - deg) ? t : best), targets[0]);
      } else {
        deg += [-2, -1, -1, 1, 1, 2][Math.floor(rnd() * 6)];
        deg = Math.max(4, Math.min(13, deg));
      }
      const len = rnd() < 0.3 && i < 7 ? 2 : 1;
      out.push({ step: s0 + i, len, midi: degreeToMidi(def, deg), voice: 'lead', vel: strong ? 0.8 : 0.6 });
      if (len === 2) i++;
    }
  });
  return out;
}

/** Stimmung aus Uhrzeit, Wetter & Ort */
export function moodFor(hour: number, opts: { raining: boolean; snowing: boolean; inside: boolean; party: boolean }): Mood {
  if (opts.party) return 'party';
  if (opts.inside) return hour >= 22 || hour < 6 ? 'nacht' : 'zuhause';
  if (opts.raining) return 'regen';
  if (hour >= 22 || hour < 5) return 'nacht';
  if (opts.snowing) return 'schnee';
  if (hour < 9) return 'morgen';
  if (hour >= 18) return 'abend';
  return 'tag';
}

/** Frequenz einer MIDI-Note */
export function midiToHz(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}
