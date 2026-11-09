/**
 * Kleidung mit Aufdruck: Linas Lieblings-Sweatshirts und Olis Bandshirts.
 *
 * Alles eigene Designs – keine echten Markenlogos. Die Bands sind ausgedacht.
 * „Radierkopf“ ist eine kleine Verbeugung vor Linas liebstem Kultfilm-Regisseur
 * (Porträt mit riesiger Turmfrisur), ohne echten Filmtitel.
 */

export type PrintKind = 'hawaii' | 'sport' | 'radierkopf' | 'band';

export interface PrintedGarment {
  /** Farbe des Stoffs (fest, damit das Lieblingsteil immer gleich aussieht) */
  cloth: string;
  /** Farbe der weiten Anzughose dazu */
  pants: string;
  print: PrintKind;
}

/** Linas Oversize-Sweatshirts mit Aufdruck (immer mit weiter schwarzer Anzughose) */
export const PRINTED: Readonly<Record<'hawaii' | 'sport' | 'radierkopf', PrintedGarment>> = {
  hawaii: { cloth: '#2f4a3a', pants: '#1c1c22', print: 'hawaii' },
  sport: { cloth: '#a9a7ad', pants: '#1c1c22', print: 'sport' },
  radierkopf: { cloth: '#1b1b20', pants: '#1c1c22', print: 'radierkopf' },
};

/** Farben der Aufdrucke */
export const PRINT_COLORS = {
  hawaii: { text: '#f5cf3f', leaf: '#f5cf3f', flower: '#f39ab0' },
  sport: { text: '#2b3148', outline: '#f4f2ee' },
  radierkopf: { text: '#e9e7e3', hair: '#cfcdc9', face: '#8f8c88', shade: '#5c5a57' },
  band: { text: '#f1efe9', accent: '#c94a3a' },
} as const;

/** Das seltene Tourshirt aus Olis Wunsch (Band „Letzte Ruhestätte“, letzte Tour) – er trägt es nur ab und zu */
export const RARE_BAND = 'LETZTE RUHESTÄTTE';

/** Olis Bands (ohne „Letzte Ruhestätte“, das gibt es nur als seltenes Tourshirt – `RARE_BAND`). Welches Shirt er trägt, wechselt mit dem Tag. */
export const BAND_NAMES: readonly string[] = ['KALTBRAND', 'SIEBEN SCHWERTER'];
