/**
 * Brabbelsprache: Jede Figur „spricht“ beim Text mit kleinen, selbst erzeugten Silben –
 * hoch, niedlich und unverständlich. Tonhöhe, Kopfgröße (Formanten), Tempo, Lebhaftigkeit
 * und Klangfarbe je Person; Männer etwas tiefer. Synthese in `audio/Audio.ts`,
 * Silben & Satzmelodie in `core/babble.ts`.
 */

export interface Voice {
  /** Grundton in Hz */
  pitch: number;
  /** Spannweite in Halbtönen (wie lebhaft die Stimme auf und ab geht) */
  range: number;
  /** Länge einer Silbe in Sekunden */
  syllable: number;
  /** „Kopfgröße“: > 1 = kleiner, niedlicher (Formanten höher) */
  formant: number;
  /** Klangfarbe 0 (weich, rund) … 1 (hell, klar) */
  bright: number;
  /** Wie stark jede Silbe singt (Tonhöhenbogen in Halbtönen) */
  lilt: number;
  /** leichtes Zittern in Hz (z. B. bei Oma) */
  vibrato?: number;
  /** etwas Hauch in der Stimme 0..1 */
  breath?: number;
}

/** Stimmen je Name im Dialogtitel (Name → Stimme) */
export const VOICES: Readonly<Record<string, Voice>> = {
  // Frauen: hoch & hell
  Lina: { pitch: 520, range: 4, syllable: 0.07, formant: 1.25, bright: 0.5, lilt: 2.5, breath: 0.15 },
  Thalia: { pitch: 590, range: 6, syllable: 0.06, formant: 1.3, bright: 0.65, lilt: 3 },
  Christin: { pitch: 545, range: 2.5, syllable: 0.06, formant: 1.22, bright: 0.6, lilt: 1.2 },
  'Oma Gisela': { pitch: 470, range: 5, syllable: 0.09, formant: 1.12, bright: 0.3, lilt: 2, vibrato: 6.5, breath: 0.3 },
  // Männer: etwas tiefer, aber immer noch knuffig
  Oli: { pitch: 330, range: 4, syllable: 0.075, formant: 1.1, bright: 0.35, lilt: 2.2, breath: 0.1 },
  Jens: { pitch: 365, range: 8, syllable: 0.068, formant: 1.16, bright: 0.6, lilt: 4 },
  Olaf: { pitch: 290, range: 2.2, syllable: 0.08, formant: 1.02, bright: 0.3, lilt: 0.8 },
  Lars: { pitch: 255, range: 3.5, syllable: 0.085, formant: 1.0, bright: 0.35, lilt: 1.6 },
};

/** Für alle anderen (Schilder haben keinen Titel und brabbeln nicht) */
export const DEFAULT_VOICE: Voice = { pitch: 430, range: 4, syllable: 0.07, formant: 1.15, bright: 0.45, lilt: 2 };

/** Jede wievielte Buchstabe eine Silbe bekommt */
export const BABBLE_EVERY = 3;
