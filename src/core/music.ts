/**
 * Musik als Noten: kleine, gemütliche Lieder werden aus einem Thema (Tageszeit, Wetter oder Ort)
 * reproduzierbar erzeugt. Reine Logik – gespielt wird in `audio/Audio.ts` mit der Web Audio API.
 *
 * Aufbau wie ein echtes Lied: Ein Motiv (2 Takte) wird wiederholt und variiert,
 * Form A – A' – B – A' – Pause(C), danach beginnt ein neues Lied mit neuem Motiv.
 */
import { mulberry32 } from './rng';
import type { Season } from './time';

export type Mood =
  | 'morgen'
  | 'tag'
  | 'abend'
  | 'nacht'
  | 'regen'
  | 'schnee'
  | 'party'
  | 'zuhause'
  | 'lina-oli'
  | 'olaf-christin'
  | 'oma'
  | 'bistro'
  | 'praxis'
  | 'thalia'
  | 'strand'
  // --- weitere Themen draußen: je Tageszeit/Wetter mehrere Lieder, die sich abwechseln (siehe THEMES)
  | 'tag-bach'
  | 'tag-picknick'
  | 'tag-wolken'
  | 'tag-schmetterling'
  | 'tag-knospen'
  | 'tag-eis'
  | 'tag-laub'
  | 'tag-frost'
  | 'morgen-nebel'
  | 'morgen-vogel'
  | 'morgen-kaffee'
  | 'abend-lagerfeuer'
  | 'abend-grillen'
  | 'abend-laterne'
  | 'nacht-mond'
  | 'nacht-eule'
  | 'nacht-sternschnuppe'
  | 'regen-pfuetze'
  | 'regen-fenster'
  | 'regen-schirm'
  | 'schnee-schlitten'
  | 'schnee-kamin'
  | 'schnee-wald';

export type Lead = 'spieluhr' | 'marimba' | 'floete' | 'epiano' | 'akkordeon' | 'zupf' | 'glocke';

export interface MoodDef {
  /** Titel fürs Menü/Debug */
  name: string;
  /** Schläge pro Minute (Viertel) */
  bpm: number;
  /** Grundton (MIDI) */
  root: number;
  /** Tonleiter (Halbtöne über dem Grundton) */
  scale: readonly number[];
  /** Akkordfolgen (Stufen der Tonleiter, 0-basiert), je 4 Takte – A nimmt eine, B eine andere */
  progressions: readonly (readonly number[])[];
  /** Achtel pro Takt: 8 = 4/4, 6 = Walzer (3/4) */
  beats: 8 | 6;
  /** Wie dicht die Melodie ist (0..1) */
  density: number;
  /** Melodie-Instrument (A-Teil) und für den B-Teil */
  lead: Lead;
  lead2: Lead;
  /** Begleitung */
  accomp: 'pad' | 'arp' | 'walzer' | 'zupf';
  /** Septimen in den Akkorden (jazzig, Lo-fi) */
  sevenths: boolean;
  bass: boolean;
  drums: 'keine' | 'besen' | 'party';
  /** Swing: wie weit die zweite Achtel nach hinten rutscht (0..0.3) */
  swing: number;
}

const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const MINOR = [0, 2, 3, 5, 7, 8, 10];
const HARMONIC_MINOR = [0, 2, 3, 5, 7, 8, 11];
const MIXOLYDIAN = [0, 2, 4, 5, 7, 9, 10];
const MAJOR_PENTA = [0, 2, 4, 7, 9];
const MINOR_PENTA = [0, 3, 5, 7, 10];
const DORIAN = [0, 2, 3, 5, 7, 9, 10];
const LYDIAN = [0, 2, 4, 6, 7, 9, 11];

const base = { sevenths: false, bass: true, drums: 'keine', swing: 0, beats: 8 } as const;

export const MOODS: Record<Mood, MoodDef> = {
  // --- draußen: Natur nach Tageszeit & Wetter ---------------------------------
  morgen: { ...base, name: 'Morgentau', bpm: 88, root: 62, scale: MAJOR, progressions: [[0, 3, 4, 0], [0, 5, 3, 4], [3, 4, 2, 5]], density: 0.5, lead: 'floete', lead2: 'marimba', accomp: 'arp' },
  tag: { ...base, name: 'Sonnenwiese', bpm: 96, root: 60, scale: MAJOR, progressions: [[0, 5, 3, 4], [0, 3, 0, 4], [5, 3, 0, 4]], density: 0.62, lead: 'marimba', lead2: 'floete', accomp: 'zupf', drums: 'besen', swing: 0.12 },
  abend: { ...base, name: 'Abendrot', bpm: 78, root: 65, scale: MAJOR, progressions: [[0, 3, 5, 4], [5, 3, 0, 4], [0, 2, 3, 4]], density: 0.45, lead: 'marimba', lead2: 'floete', accomp: 'pad', sevenths: true },
  nacht: { ...base, name: 'Sternenlicht', bpm: 62, root: 57, scale: MAJOR_PENTA, progressions: [[0, 3, 4, 3], [0, 2, 3, 0]], density: 0.28, lead: 'spieluhr', lead2: 'glocke', accomp: 'pad', bass: false },
  regen: { ...base, name: 'Tropfenmelodie', bpm: 70, root: 57, scale: MINOR, progressions: [[0, 5, 2, 6], [3, 0, 5, 4]], density: 0.35, lead: 'epiano', lead2: 'spieluhr', accomp: 'arp', sevenths: true },
  schnee: { ...base, name: 'Flockentanz', bpm: 68, root: 64, scale: MAJOR_PENTA, progressions: [[0, 3, 0, 4], [3, 4, 0, 0]], density: 0.35, lead: 'glocke', lead2: 'spieluhr', accomp: 'pad', bass: false },
  strand: { ...base, name: 'Muschelbrise', bpm: 84, root: 64, scale: MAJOR, progressions: [[0, 3, 0, 4], [5, 3, 4, 0]], density: 0.5, lead: 'zupf', lead2: 'floete', accomp: 'zupf', swing: 0.18, drums: 'besen' },
  party: { ...base, name: 'Lichterkettenparty', bpm: 118, root: 60, scale: MAJOR, progressions: [[0, 4, 5, 3], [3, 4, 0, 0]], density: 0.8, lead: 'marimba', lead2: 'zupf', accomp: 'zupf', drums: 'party' },
  // --- Orte -----------------------------------------------------------------
  zuhause: { ...base, name: 'Mein kleines Zimmer', bpm: 72, root: 63, scale: MAJOR, progressions: [[0, 3, 1, 4], [5, 3, 0, 4]], density: 0.4, lead: 'spieluhr', lead2: 'epiano', accomp: 'pad', sevenths: true },
  'lina-oli': { ...base, name: 'Lini & Oli', bpm: 76, root: 65, scale: MAJOR, progressions: [[0, 5, 1, 4], [3, 2, 1, 4], [0, 3, 2, 5]], density: 0.45, lead: 'epiano', lead2: 'glocke', accomp: 'pad', sevenths: true, drums: 'besen', swing: 0.2 },
  'olaf-christin': { ...base, name: 'Alles an seinem Platz', bpm: 104, root: 67, scale: MAJOR, progressions: [[0, 4, 0, 4], [3, 0, 4, 0], [5, 1, 4, 0]], beats: 6, density: 0.55, lead: 'glocke', lead2: 'floete', accomp: 'walzer' },
  oma: { ...base, name: 'Omas Kaffeetafel', bpm: 88, root: 58, scale: MAJOR, progressions: [[0, 3, 4, 0], [0, 5, 1, 4]], beats: 6, density: 0.5, lead: 'floete', lead2: 'spieluhr', accomp: 'walzer' },
  bistro: { ...base, name: 'Chez Jens', bpm: 126, root: 62, scale: HARMONIC_MINOR, progressions: [[0, 3, 4, 0], [5, 3, 4, 4], [0, 0, 3, 4]], beats: 6, density: 0.7, lead: 'akkordeon', lead2: 'akkordeon', accomp: 'walzer' },
  praxis: { ...base, name: 'Tief durchatmen', bpm: 82, root: 67, scale: MAJOR, progressions: [[0, 2, 3, 4], [0, 5, 3, 4]], density: 0.42, lead: 'marimba', lead2: 'glocke', accomp: 'arp' },
  thalia: { ...base, name: 'Auf zu neuen Funden', bpm: 108, root: 62, scale: MIXOLYDIAN, progressions: [[0, 6, 3, 0], [0, 3, 6, 4]], density: 0.62, lead: 'zupf', lead2: 'floete', accomp: 'zupf', drums: 'besen', swing: 0.1 },
  // --- weitere Lieder draußen -------------------------------------------------
  // Tag
  'tag-bach': { ...base, name: 'Plätscherbach', bpm: 92, root: 62, scale: MAJOR_PENTA, progressions: [[0, 2, 3, 1], [0, 3, 2, 4], [1, 3, 0, 4]], beats: 6, density: 0.55, lead: 'floete', lead2: 'glocke', accomp: 'zupf' },
  'tag-picknick': { ...base, name: 'Picknickdecke', bpm: 104, root: 60, scale: MIXOLYDIAN, progressions: [[0, 6, 3, 0], [0, 3, 4, 0]], density: 0.6, lead: 'zupf', lead2: 'marimba', accomp: 'zupf', drums: 'besen', swing: 0.2 },
  'tag-wolken': { ...base, name: 'Wolkenschaukeln', bpm: 74, root: 65, scale: MAJOR, progressions: [[0, 4, 5, 3], [3, 0, 4, 5], [0, 2, 3, 4]], density: 0.38, lead: 'epiano', lead2: 'spieluhr', accomp: 'pad', sevenths: true },
  'tag-schmetterling': { ...base, name: 'Schmetterlingstanz', bpm: 112, root: 67, scale: MAJOR_PENTA, progressions: [[0, 3, 4, 2], [0, 2, 3, 4]], density: 0.7, lead: 'marimba', lead2: 'glocke', accomp: 'arp' },
  // Tag nach Jahreszeit
  'tag-knospen': { ...base, name: 'Knospenzeit', bpm: 100, root: 66, scale: MAJOR, progressions: [[0, 3, 0, 4], [5, 4, 0, 3]], density: 0.55, lead: 'floete', lead2: 'marimba', accomp: 'arp' },
  'tag-eis': { ...base, name: 'Eis am Stiel', bpm: 108, root: 60, scale: MIXOLYDIAN, progressions: [[0, 3, 6, 3], [0, 6, 3, 0]], density: 0.6, lead: 'marimba', lead2: 'zupf', accomp: 'zupf', drums: 'besen', swing: 0.18 },
  'tag-laub': { ...base, name: 'Raschelndes Laub', bpm: 86, root: 57, scale: DORIAN, progressions: [[0, 3, 0, 4], [0, 6, 3, 0]], density: 0.5, lead: 'floete', lead2: 'epiano', accomp: 'zupf' },
  'tag-frost': { ...base, name: 'Raureif', bpm: 76, root: 64, scale: MAJOR_PENTA, progressions: [[0, 3, 0, 4], [0, 2, 3, 0]], density: 0.35, lead: 'glocke', lead2: 'spieluhr', accomp: 'pad', bass: false },
  // Morgen
  'morgen-nebel': { ...base, name: 'Nebelwiese', bpm: 66, root: 60, scale: MAJOR_PENTA, progressions: [[0, 3, 2, 4], [0, 2, 4, 3]], density: 0.3, lead: 'spieluhr', lead2: 'floete', accomp: 'pad', bass: false },
  'morgen-vogel': { ...base, name: 'Frühes Vogelkonzert', bpm: 100, root: 64, scale: LYDIAN, progressions: [[0, 1, 0, 4], [0, 1, 4, 0]], density: 0.6, lead: 'floete', lead2: 'marimba', accomp: 'zupf', swing: 0.08 },
  'morgen-kaffee': { ...base, name: 'Erster Kaffee', bpm: 80, root: 63, scale: MAJOR, progressions: [[1, 4, 0, 5], [0, 5, 1, 4]], density: 0.45, lead: 'epiano', lead2: 'marimba', accomp: 'pad', sevenths: true, drums: 'besen', swing: 0.22 },
  // Abend
  'abend-lagerfeuer': { ...base, name: 'Lagerfeuer', bpm: 72, root: 57, scale: DORIAN, progressions: [[0, 3, 0, 4], [0, 6, 3, 0]], density: 0.42, lead: 'zupf', lead2: 'floete', accomp: 'zupf' },
  'abend-grillen': { ...base, name: 'Grillenkonzert', bpm: 84, root: 62, scale: MAJOR_PENTA, progressions: [[0, 3, 4, 3], [0, 4, 2, 3]], density: 0.45, lead: 'marimba', lead2: 'spieluhr', accomp: 'arp' },
  'abend-laterne': { ...base, name: 'Laternenweg', bpm: 96, root: 58, scale: MAJOR, progressions: [[0, 4, 0, 3], [5, 1, 4, 0]], beats: 6, density: 0.5, lead: 'floete', lead2: 'glocke', accomp: 'walzer' },
  // Nacht
  'nacht-mond': { ...base, name: 'Mondschein', bpm: 56, root: 62, scale: MINOR_PENTA, progressions: [[0, 3, 2, 4], [0, 2, 3, 0]], density: 0.25, lead: 'glocke', lead2: 'spieluhr', accomp: 'pad', bass: false },
  'nacht-eule': { ...base, name: 'Eulenwacht', bpm: 60, root: 55, scale: DORIAN, progressions: [[0, 3, 0, 6], [0, 4, 3, 0]], density: 0.3, lead: 'epiano', lead2: 'glocke', accomp: 'pad', sevenths: true, swing: 0.15 },
  'nacht-sternschnuppe': { ...base, name: 'Sternschnuppe', bpm: 66, root: 64, scale: MAJOR_PENTA, progressions: [[0, 4, 3, 2], [0, 2, 4, 0]], density: 0.35, lead: 'spieluhr', lead2: 'glocke', accomp: 'arp', bass: false },
  // Regen
  'regen-pfuetze': { ...base, name: 'Pfützenhüpfen', bpm: 98, root: 60, scale: MAJOR, progressions: [[0, 5, 3, 4], [0, 3, 4, 0]], density: 0.6, lead: 'marimba', lead2: 'zupf', accomp: 'zupf', drums: 'besen', swing: 0.15 },
  'regen-fenster': { ...base, name: 'Am Fenster', bpm: 62, root: 58, scale: DORIAN, progressions: [[0, 3, 6, 3], [0, 4, 3, 0]], density: 0.3, lead: 'epiano', lead2: 'spieluhr', accomp: 'pad', sevenths: true },
  'regen-schirm': { ...base, name: 'Regenschirmwalzer', bpm: 92, root: 57, scale: MINOR, progressions: [[0, 5, 3, 4], [0, 2, 5, 4]], beats: 6, density: 0.5, lead: 'glocke', lead2: 'floete', accomp: 'walzer' },
  // Schnee
  'schnee-schlitten': { ...base, name: 'Schlittenfahrt', bpm: 112, root: 62, scale: MAJOR, progressions: [[0, 3, 4, 0], [0, 5, 3, 4]], density: 0.65, lead: 'glocke', lead2: 'marimba', accomp: 'zupf', drums: 'besen' },
  'schnee-kamin': { ...base, name: 'Warme Stube', bpm: 64, root: 60, scale: MAJOR, progressions: [[0, 5, 3, 4], [3, 0, 1, 4]], density: 0.35, lead: 'epiano', lead2: 'spieluhr', accomp: 'pad', sevenths: true },
  'schnee-wald': { ...base, name: 'Verschneiter Wald', bpm: 58, root: 65, scale: MAJOR_PENTA, progressions: [[0, 2, 3, 0], [0, 3, 4, 3]], density: 0.28, lead: 'spieluhr', lead2: 'glocke', accomp: 'pad', bass: false },
};

/**
 * Lieder-Familien draußen: Zu jeder Tageszeit/Wetterlage gehören mehrere Lieder. Zuerst das Hauptthema, dann die
 * weiteren. Bei jedem neuen Lied kommt reihum das nächste dran (`pickTheme`), damit es nicht langweilig wird.
 */
export const THEMES: Partial<Record<Mood, readonly Mood[]>> = {
  tag: ['tag', 'tag-bach', 'tag-picknick', 'tag-wolken', 'tag-schmetterling'],
  morgen: ['morgen', 'morgen-nebel', 'morgen-vogel', 'morgen-kaffee'],
  abend: ['abend', 'abend-lagerfeuer', 'abend-grillen', 'abend-laterne'],
  nacht: ['nacht', 'nacht-mond', 'nacht-eule', 'nacht-sternschnuppe'],
  regen: ['regen', 'regen-pfuetze', 'regen-fenster', 'regen-schirm'],
  schnee: ['schnee', 'schnee-schlitten', 'schnee-kamin', 'schnee-wald'],
};

/** Zusätzliche Tageslieder je Jahreszeit */
const SEASON_THEMES: Record<Season, Mood> = { fruehling: 'tag-knospen', sommer: 'tag-eis', herbst: 'tag-laub', winter: 'tag-frost' };

/** Alle Lieder, die für ein Thema infrage kommen (Orts-Themen & Co. haben nur ihr eigenes) */
export function themesFor(base: Mood, season?: Season): Mood[] {
  const list = THEMES[base];
  if (!list) return [base];
  return base === 'tag' && season ? [...list, SEASON_THEMES[season]] : [...list];
}

/** Welches Lied beginnt als nächstes? Reihum durch die Familie, der Start hängt vom Zufallswert der Sitzung ab. */
export function pickTheme(base: Mood, song: number, seed: number, season?: Season): Mood {
  const list = themesFor(base, season);
  return list[(((song + seed) % list.length) + list.length) % list.length];
}

export interface NoteEvent {
  /** Start in Achteln ab Beginn des Abschnitts */
  step: number;
  /** Länge in Achteln */
  len: number;
  midi: number;
  voice: 'lead' | 'pad' | 'chord' | 'arp' | 'bass' | 'kick' | 'hat' | 'besen';
  /** Instrument (nur Melodie) */
  inst?: Lead;
  /** Lautstärke 0..1 */
  vel: number;
}

/** Teile eines Liedes: A, variiertes A, B (neue Akkorde & Motiv), C = ruhiges Durchatmen */
export type Part = 'A' | 'A2' | 'B' | 'C';
export const FORM: readonly Part[] = ['A', 'A2', 'B', 'A2', 'C'];
/** So oft wird die Form eines Liedes gespielt (jedes Mal leicht variiert), bevor das nächste Lied beginnt – ca. 2–3 Minuten */
export const SONG_ROUNDS = 3;

/** Länge eines Abschnitts (4 Takte) in Achteln */
export function sectionSteps(mood: Mood): number {
  return MOODS[mood].beats * 4;
}

/** Ton der Tonleiter (Stufe kann über eine Oktave hinausgehen) */
export function degreeToMidi(def: MoodDef, degree: number): number {
  const n = def.scale.length;
  const oct = Math.floor(degree / n);
  const idx = ((degree % n) + n) % n;
  return def.root + oct * 12 + def.scale[idx];
}

interface MotifNote {
  step: number;
  len: number;
  move: number;
}

/** Ein Motiv über 2 Takte: Rhythmus + Bewegung (Stufen hoch/runter) */
function makeMotif(def: MoodDef, seed: number): MotifNote[] {
  const rnd = mulberry32(seed);
  const out: MotifNote[] = [];
  const total = def.beats * 2;
  for (let i = 0; i < total; ) {
    const onBeat = i % 2 === 0;
    if (i > 0 && rnd() > def.density * (onBeat ? 1.2 : 0.65)) {
      i++;
      continue;
    }
    const r = rnd();
    const len = Math.min(total - i, r < 0.12 ? 3 : r < 0.42 ? 2 : 1);
    out.push({ step: i, len, move: [-2, -1, -1, 0, 1, 1, 2, 3, -3][Math.floor(rnd() * 9)] });
    i += len;
  }
  // das Motiv endet nie direkt am Taktende, damit es atmen kann
  return out;
}

/** Nächster Akkordton (in Stufen) zu `deg` */
function nearestChordTone(chord: number, deg: number): number {
  let best = deg;
  let dist = Infinity;
  for (let oct = -1; oct <= 2; oct++) {
    for (const k of [0, 2, 4]) {
      const t = chord + k + oct * 7;
      if (Math.abs(t - deg) < dist) {
        dist = Math.abs(t - deg);
        best = t;
      }
    }
  }
  return best;
}

/**
 * Ein Abschnitt (4 Takte) eines Liedes. Reproduzierbar über `songSeed` – A und A2 teilen das Motiv,
 * deshalb erkennt man die Melodie wieder.
 */
export function composeSection(mood: Mood, songSeed: number, part: Part = 'A'): NoteEvent[] {
  const def = MOODS[mood];
  const B = def.beats;
  const rnd = mulberry32(songSeed * 31 + (part === 'A' ? 1 : part === 'A2' ? 2 : part === 'B' ? 3 : 4));
  const progs = def.progressions;
  const progA = progs[songSeed % progs.length];
  const progB = progs[(songSeed + 1) % progs.length];
  const prog = part === 'B' ? progB : progA;
  const out: NoteEvent[] = [];
  const third = def.sevenths ? [0, 2, 4, 6] : [0, 2, 4];

  prog.forEach((chord, bar) => {
    const s0 = bar * B;
    // --- Begleitung ---
    if (def.accomp === 'pad' || part === 'C') {
      for (const k of third) out.push({ step: s0, len: B, midi: degreeToMidi(def, chord + k) - 12, voice: 'pad', vel: part === 'C' ? 0.3 : 0.35 });
    }
    if (def.accomp === 'arp' && part !== 'C') {
      const tones = [0, 2, 4, 7, 4, 2, 0, 2];
      for (let i = 0; i < B; i++) out.push({ step: s0 + i, len: 1, midi: degreeToMidi(def, chord + tones[i % tones.length]) - 12, voice: 'arp', vel: i === 0 ? 0.55 : 0.4 });
      out.push({ step: s0, len: B, midi: degreeToMidi(def, chord) - 12, voice: 'pad', vel: 0.18 });
    }
    if (def.accomp === 'walzer' && part !== 'C') {
      // um-pa-pa
      for (const i of [2, 4]) for (const k of [0, 2, 4]) out.push({ step: s0 + i, len: 1, midi: degreeToMidi(def, chord + k) - 12, voice: 'chord', vel: 0.4 });
    }
    if (def.accomp === 'zupf' && part !== 'C') {
      const pat = B === 8 ? [2, 3, 5, 6, 7] : [2, 3, 4, 5];
      pat.forEach((i, j) => out.push({ step: s0 + i, len: 1, midi: degreeToMidi(def, chord + [2, 4, 7, 4, 2][j % 5]) - 12, voice: 'chord', vel: 0.32 }));
    }
    if (def.bass) {
      out.push({ step: s0, len: B === 6 ? 2 : 3, midi: degreeToMidi(def, chord) - 24, voice: 'bass', vel: 0.6 });
      if (B === 8 && part !== 'C') out.push({ step: s0 + 4, len: 3, midi: degreeToMidi(def, chord + (rnd() < 0.5 ? 4 : 0)) - 24, voice: 'bass', vel: 0.45 });
    }
    // --- Schlagzeug ---
    if (def.drums === 'party') {
      for (let i = 0; i < B; i += 2) out.push({ step: s0 + i, len: 1, midi: 0, voice: 'kick', vel: i % 4 === 0 ? 0.9 : 0.5 });
      for (let i = 1; i < B; i += 2) out.push({ step: s0 + i, len: 1, midi: 0, voice: 'hat', vel: 0.35 });
    } else if (def.drums === 'besen' && part !== 'C') {
      out.push({ step: s0, len: 1, midi: 0, voice: 'kick', vel: 0.35 });
      for (let i = 0; i < B; i++) out.push({ step: s0 + i, len: 1, midi: 0, voice: 'besen', vel: i % 4 === 2 ? 0.7 : 0.3 });
    }
  });

  // --- Melodie ---
  const motif = makeMotif(def, songSeed * 7 + (part === 'B' ? 101 : 0));
  const inst = part === 'B' ? def.lead2 : def.lead;
  const lift = part === 'B' ? 2 : 0;
  for (let half = 0; half < 2; half++) {
    // im C-Teil nur ein leises Echo des Motivs im ersten Takt
    if (part === 'C' && half === 1) break;
    let deg = nearestChordTone(prog[half * 2], 9 + lift);
    const notes = motif.filter((m) => part !== 'C' || m.step < B);
    notes.forEach((m, idx) => {
      const bar = half * 2 + Math.floor(m.step / B);
      const chord = prog[bar];
      const inBar = m.step % B;
      const strong = inBar === 0 || (B === 8 && inBar === 4) || (B === 6 && inBar === 3);
      let move = m.move;
      // A2: zweite Hälfte endet als Kadenz (Schluss), sonst kleine Abwandlungen
      if (part === 'A2' && half === 1 && idx >= notes.length - 2) move = -1;
      else if (part === 'A2' && rnd() < 0.2) move += rnd() < 0.5 ? 1 : -1;
      deg += move;
      if (strong) deg = nearestChordTone(chord, deg);
      deg = Math.max(4 + lift, Math.min(13 + lift, deg));
      if (part === 'A2' && half === 1 && idx === notes.length - 1) deg = nearestChordTone(chord, 7) === 7 ? 7 : nearestChordTone(chord, deg);
      out.push({ step: half * 2 * B + m.step, len: m.len, midi: degreeToMidi(def, deg), voice: 'lead', inst, vel: (strong ? 0.8 : 0.6) * (part === 'C' ? 0.6 : 1) });
    });
  }
  return out.sort((a, b) => a.step - b.step);
}

/** Kompatibilität: ein A-Teil */
export function composePhrase(mood: Mood, seed: number): NoteEvent[] {
  return composeSection(mood, seed, 'A');
}

/** Stimmung aus Uhrzeit, Wetter & Ort (`place` = Thema des nahen Gebäudes, `home` = Thema zu Hause) */
export function moodFor(
  hour: number,
  opts: { raining: boolean; snowing: boolean; inside: boolean; party: boolean; place?: Mood | null; home?: Mood },
): Mood {
  const night = hour >= 22 || hour < 5;
  if (opts.party) return 'party';
  if (opts.inside) return hour >= 23 || hour < 6 ? 'nacht' : (opts.home ?? 'zuhause');
  if (night) return 'nacht';
  if (opts.place) return opts.place;
  if (opts.raining) return 'regen';
  if (opts.snowing) return 'schnee';
  if (hour < 9) return 'morgen';
  if (hour >= 18) return 'abend';
  return 'tag';
}

/**
 * Stimmungs-Dämpfer: Draußen soll die Musik nicht ständig wechseln (früher bei jedem Haus, an dem Lina vorbeikam).
 * Ein „weicher“ Wechsel (anderer Ort, Wetter, Tageszeit) gilt erst, wenn er `SOFT_DELAY_MS` lang anhält **und** die
 * letzte Stimmung mindestens `MIN_DWELL_MS` lief. „Harte“ Wechsel (rein/raus aus dem Haus, Party, Titelbild) sofort.
 */
export const SOFT_DELAY_MS = 20_000;
export const MIN_DWELL_MS = 75_000;

export interface MoodGate {
  mood: Mood;
  since: number;
  pending: Mood | null;
  pendingSince: number;
}

export function createMoodGate(initial: Mood, now: number): MoodGate {
  return { mood: initial, since: now, pending: null, pendingSince: 0 };
}

/** Welche Stimmung wird wirklich gespielt? (`wanted` = was `moodFor` gerade will) */
export function gateMood(g: MoodGate, wanted: Mood, now: number, hard: boolean): Mood {
  if (wanted === g.mood) {
    g.pending = null;
    return g.mood;
  }
  if (hard) {
    g.mood = wanted;
    g.since = now;
    g.pending = null;
    return g.mood;
  }
  if (g.pending !== wanted) {
    g.pending = wanted;
    g.pendingSince = now;
    return g.mood;
  }
  if (now - g.pendingSince >= SOFT_DELAY_MS && now - g.since >= MIN_DWELL_MS) {
    g.mood = wanted;
    g.since = now;
    g.pending = null;
  }
  return g.mood;
}

/** Frequenz einer MIDI-Note */
export function midiToHz(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** Nächstes Orts-Thema für eine Position (Kacheln); `centers` liefert aktive Gebäude-Mitten */
export function placeMood(
  x: number,
  y: number,
  places: readonly { object: string; mood: Mood; radius: number }[],
  centerOf: (object: string) => { x: number; y: number } | null,
): Mood | null {
  let best: Mood | null = null;
  let bestD = Infinity;
  for (const p of places) {
    const c = centerOf(p.object);
    if (!c) continue;
    const d = Math.hypot(c.x - x, c.y - y);
    if (d <= p.radius && d < bestD) {
      bestD = d;
      best = p.mood;
    }
  }
  return best;
}
