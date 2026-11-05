/**
 * Brabbelsprache: Jede Figur „spricht“ beim Text mit kleinen, selbst erzeugten Silben –
 * niedlich und unverständlich. Tonhöhe, Spannweite, Tempo und Klangfarbe je Person.
 * (Die Silben entstehen in `audio/Audio.ts`; die Vokale kommen aus dem Text selbst.)
 */

export interface Voice {
  /** Grundton in Hz */
  pitch: number;
  /** Spannweite in Halbtönen (wie lebhaft die Stimme auf und ab geht) */
  range: number;
  /** Länge einer Silbe in Sekunden */
  syllable: number;
  /** Klangfarbe: rund (Dreieck) oder etwas schnarrender (Säge) */
  tone: 'rund' | 'hell';
  /** leichtes Zittern (z. B. bei Oma) */
  vibrato?: number;
}

/** Stimmen je Name im Dialogtitel (Name → Stimme) */
export const VOICES: Readonly<Record<string, Voice>> = {
  'Oma Gisela': { pitch: 360, range: 5, syllable: 0.075, tone: 'rund', vibrato: 7 },
  Olaf: { pitch: 175, range: 3, syllable: 0.065, tone: 'rund' },
  Christin: { pitch: 310, range: 4, syllable: 0.055, tone: 'hell' },
  Oli: { pitch: 205, range: 5, syllable: 0.055, tone: 'rund' },
  Jens: { pitch: 235, range: 9, syllable: 0.06, tone: 'hell' },
  Lars: { pitch: 140, range: 4, syllable: 0.07, tone: 'rund' },
  Thalia: { pitch: 340, range: 7, syllable: 0.05, tone: 'hell' },
  Lina: { pitch: 300, range: 5, syllable: 0.055, tone: 'rund' },
};

/** Für alle anderen (Schilder haben keinen Titel und brabbeln nicht) */
export const DEFAULT_VOICE: Voice = { pitch: 260, range: 5, syllable: 0.06, tone: 'rund' };

/** Jede wievielte Buchstabe eine Silbe bekommt */
export const BABBLE_EVERY = 3;
