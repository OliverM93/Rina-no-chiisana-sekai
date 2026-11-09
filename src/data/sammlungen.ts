/**
 * Vollständige Sammlungen würdigen (Game Design F10): Wer eine Sammlung komplett hat, bekommt einen Brief von
 * jemandem, der sich besonders dafür interessiert, und eine **Urkunde** für die Wand – ein Erinnerungsstück,
 * kein Erfolge-Menü.
 *
 * Neue Sammlung: hier eintragen, Zählung in `game/sammlungen.ts`, Farbe/Titel für das Wandbild stehen hier.
 */
export interface SammlungDef {
  id: 'fische' | 'insekten' | 'funde' | 'blumen' | 'tassen';
  /** Titel auf der Urkunde */
  title: string;
  /** Wer schreibt? (Bewohner-ID) */
  npc: string;
  subject: string;
  body: string;
  /** Rahmenfarbe der Urkunde */
  color: string;
}

export const SAMMLUNGEN: readonly SammlungDef[] = [
  {
    id: 'fische',
    title: 'Alle Fische',
    npc: 'jens',
    color: '#5b9fd8',
    subject: 'Alle Fische! 🐟',
    body: 'Ma chérie,\n\nich hab gehört, du hast jeden einzelnen Fisch aus {dorf} im Sammelbuch. Jeden! Auch die scheuen!\n\nIch hab dir eine Urkunde malen lassen. Mit Siegel. Gérard wäre stolz, wenn er wüsste, dass er auch drin steht.\n\nBisous, Onkel Jens 🌈',
  },
  {
    id: 'insekten',
    title: 'Alle Krabbeltiere',
    npc: 'lars',
    color: '#6fb06a',
    subject: 'Offizielles Attest',
    body: 'Schwesterherz,\n\nalle Insekten und Krabbeltiere im Sammelbuch. Alle. Das ist ärztlich gesehen eine Leistung, medizinisch gesehen eine Marotte und als Bruder bin ich stolz.\n\nBeiliegend: eine Urkunde. Mit Stempel. Der Stempel ist echt. Ich hab ihn gefunden.\n\nDein großer Bruder',
  },
  {
    id: 'funde',
    title: 'Alle Funde',
    npc: 'thalia',
    color: '#c9a77a',
    subject: 'Feldforscherin des Jahres',
    body: 'Lina!!\n\nAlle Fossilien und Kristalle! Alle! Ich hab es nachgezählt, dreimal, und es stimmt.\n\nDafür gibt es eine Urkunde. Ich hab sie selbst entworfen. Mit Lineal. Hänge sie auf, damit ich nicht vergesse, wie viel du ausgegraben hast.\n\nDeine Thalia 🦴',
  },
  {
    id: 'blumen',
    title: 'Alle Blumenfarben',
    npc: 'christin',
    color: '#e8789a',
    subject: 'Ein vollständiges Beet',
    body: 'Liebe Lina,\n\njede Blumenart in jeder Farbe. Auch die seltenen. Das ist nicht nur schön, das ist vollständig.\n\nDas verdient eine Urkunde. Ich habe sie gerahmt und in einer Reihe aufgehängt. Bitte hänge sie auch gerade auf.\n\nChristin',
  },
  {
    id: 'tassen',
    title: 'Alle Tassen',
    npc: 'oli',
    color: '#2f7a5a',
    subject: 'Alle Tassen im Schrank ☕',
    body: 'Lini,\n\nalle Tassen. Alle! Klassik, Saison, Städte. Wenn jetzt noch jemand sagt, man brauche nicht so viele Tassen, zeig ich ihm das hier.\n\nIch hab dir eine Urkunde machen lassen. Sie hängt hoffentlich neben dem Kaffee.\n\nDein Oli',
  },
];

export const SAMMLUNG_BY_ID: Readonly<Record<string, SammlungDef>> = Object.fromEntries(SAMMLUNGEN.map((s) => [s.id, s]));
export const urkundeId = (id: string) => `urkunde-${id}`;
