/**
 * Fossilien & Gesteine zum Ausgraben (mit Thalias Schaufel). Jeden Tag gibt es
 * ein paar Grabstellen (kleine Risse im Boden) – reproduzierbar pro Datum.
 * Alles landet in der Tasche und im Sammelbuch (Reiter „Steine & Fossilien“).
 */

export interface FindDef {
  id: string;
  name: string;
  plural: string;
  kind: 'fossil' | 'stein';
  price: number;
  /** Häufigkeit beim Graben */
  weight: number;
  /** Farben fürs Symbol */
  color: string;
  accent: string;
  description: string;
}

export const FINDS: readonly FindDef[] = [
  { id: 'ammonit', name: 'Ammonit', plural: 'Ammoniten', kind: 'fossil', price: 400, weight: 12, color: '#c9a77a', accent: '#8a6a46', description: 'Ein spiralförmiges Gehäuse aus der Jurazeit. Thalia: „Ungefähr 180 Millionen Jahre alt. Älter als Omas Kekse!“' },
  { id: 'trilobit', name: 'Trilobit', plural: 'Trilobiten', kind: 'fossil', price: 500, weight: 8, color: '#8f8f99', accent: '#5a5a66', description: 'Ein uralter Meeresbewohner mit drei Längsteilen. Sieht ein bisschen aus wie eine Kellerassel mit Stil.' },
  { id: 'haizahn', name: 'Haizahn', plural: 'Haizähne', kind: 'fossil', price: 350, weight: 12, color: '#5a5a66', accent: '#3a3a44', description: 'Ein versteinerter Zahn eines urzeitlichen Hais. Keine Sorge, der beißt nicht mehr.' },
  { id: 'versteinertes-holz', name: 'Versteinertes Holz', plural: 'Versteinerte Hölzer', kind: 'fossil', price: 300, weight: 12, color: '#b98a5e', accent: '#7a5038', description: 'Ein Stück Baum, das über Millionen Jahre zu Stein geworden ist. Die Jahresringe sieht man noch!' },
  { id: 'bernstein', name: 'Bernstein', plural: 'Bernsteine', kind: 'fossil', price: 600, weight: 6, color: '#f2a83a', accent: '#c97a1a', description: 'Uraltes Baumharz, goldgelb und warm. Drin steckt eine winzige Mücke von vor 40 Millionen Jahren!' },
  { id: 'seeigel-fossil', name: 'Versteinerter Seeigel', plural: 'Versteinerte Seeigel', kind: 'fossil', price: 280, weight: 12, color: '#d8cfc0', accent: '#a89a84', description: 'Ein runder Seeigel mit Sternmuster. Früher sagte man, sie bringen Glück. Thalia sagt: stimmt!' },
  { id: 'farn-abdruck', name: 'Farn-Abdruck', plural: 'Farn-Abdrücke', kind: 'fossil', price: 320, weight: 10, color: '#9a9aa4', accent: '#5f8a4a', description: 'Ein Farnblatt, perfekt im Stein abgedrückt. Wie ein Foto aus der Urzeit.' },
  { id: 'rosenquarz', name: 'Rosenquarz', plural: 'Rosenquarze', kind: 'stein', price: 220, weight: 14, color: '#f4b3c6', accent: '#d9849e', description: 'Zartrosa und ganz glatt. Der Stein der Liebe, sagt man. 💕' },
  { id: 'wolframit', name: 'Wolframit', plural: 'Wolframite', kind: 'stein', price: 700, weight: 3, color: '#3d3d49', accent: '#8f8fa0', description: 'Dunkel, glänzend und erstaunlich schwer – wie ein verschluckter Schatten. Lars: „Das ist Physik, kein Zauber.“' },
  { id: 'bergkristall', name: 'Bergkristall', plural: 'Bergkristalle', kind: 'stein', price: 260, weight: 12, color: '#e6f4ff', accent: '#9ac8e8', description: 'Klar wie Eis, mit spitzen Kristallen. Funkelt in der Sonne.' },
  { id: 'amethyst', name: 'Amethyst-Druse', plural: 'Amethyst-Drusen', kind: 'stein', price: 450, weight: 8, color: '#a98ad8', accent: '#7a5ab8', description: 'Außen ein unscheinbarer Stein – innen voller lila Kristalle. Wie manche Menschen!' },
  { id: 'achat', name: 'Achat', plural: 'Achate', kind: 'stein', price: 240, weight: 12, color: '#d98a5f', accent: '#f7e2c8', description: 'Ein Stein mit bunten Streifen, wie ein Sonnenuntergang zum Mitnehmen.' },
];

export const FIND_BY_ID: Readonly<Record<string, FindDef>> = Object.fromEntries(FINDS.map((f) => [f.id, f]));

/** Wie viele Grabstellen es pro Tag gibt */
export const DIG_SPOTS_PER_DAY = 4;
