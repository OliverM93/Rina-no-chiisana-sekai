/**
 * Poster (Wand-Deko) und Coffee-Table-Books (kleine Bildbände für Tische) zu Linas Lieblingsthemen: Kaffee, Dr. No, Kawaii.
 * (Horror- und Zauberschul-Poster gab es kurz, Lina mochte sie nicht – siehe Git-Verlauf.)
 *
 * Alles ist ausgedacht – Titel und Motive sind keine echten Werke oder Personen (siehe CLAUDE.md). Gemalt wird in
 * `gfx/posters.ts`, die 3D-Modelle in `models/furniture.ts`. Neue Poster: Eintrag in `POSTERS` + Motiv in `MOTIFS`.
 */

export type PosterMotif = 'kaffee' | 'dr-no' | 'kawaii';

export interface PosterDef {
  id: string;
  name: string;
  /** Poster hängen an der Wand, Bildbände liegen auf Tischen */
  kind: 'poster' | 'buch';
  /** Haupttitel (Zeilenumbruch mit \n) */
  title: string;
  /** Zusatzzeile (Untertitel, Autor, Regisseur …) */
  sub?: string;
  /** Hintergrundverlauf oben → unten */
  colors: readonly [string, string];
  /** Schriftfarbe */
  ink: string;
  motif: PosterMotif;
  price: number;
  description: string;
}

export const POSTERS: readonly PosterDef[] = [
  // ---------------------------------------------------------------- Poster (Wand)
  { id: 'poster-kaffee', name: 'Retro-Poster „Café Fabuleux“', kind: 'poster', title: 'CAFÉ\nFABULEUX', sub: 'Das Leben ist zu kurz für schlechten Kaffee.', colors: ['#f3dcb8', '#d9a86a'], ink: '#4a2a1c', motif: 'kaffee', price: 200, description: 'Ein Kaffee-Poster im Stil alter Café-Werbung. Mit Dampfherzchen. Jens will es auch haben.' },
  // ---------------------------------------------------------------- Bildbände (Tisch)
  { id: 'buch-kaffee', name: 'Bildband „Kaffee – eine Liebeserklärung“', kind: 'buch', title: 'KAFFEE', sub: 'Eine Liebeserklärung', colors: ['#f3dcb8', '#d9a86a'], ink: '#4a2a1c', motif: 'kaffee', price: 360, description: 'Ein Bildband über Bohnen, Röstungen und Siebträger. Er riecht seltsamerweise nach Kaffee. Beim Blättern hat man Durst.' },
  { id: 'buch-dr-no', name: 'Buch „Ein Schritt. Dann noch einer.“', kind: 'buch', title: 'EIN SCHRITT.\nDANN NOCH\nEINER.', sub: 'Dr. No', colors: ['#3f5a66', '#6a8a96'], ink: '#fdf6e8', motif: 'dr-no', price: 400, description: 'Die Erinnerungen von Dr. No aus „Schwerer Weg“. Streng im Ton, warm im Herzen. Das Lieblingsbuch auf Linas Couchtisch.' },
  { id: 'buch-kawaii', name: 'Bildband „Kawaii – die Kunst der Niedlichkeit“', kind: 'buch', title: 'KAWAII', sub: 'Die Kunst der Niedlichkeit', colors: ['#ffd6e6', '#f7a8c8'], ink: '#7a2a4a', motif: 'kawaii', price: 340, description: 'Ein Bildband voller runder, weicher, niedlicher Dinge. Auf dem Vorsatzblatt steht „Für meine Japanisch-Hausaufgaben“ – und ein Smiley.' },
];

export const POSTER_BY_ID: Readonly<Record<string, PosterDef>> = Object.fromEntries(POSTERS.map((p) => [p.id, p]));
