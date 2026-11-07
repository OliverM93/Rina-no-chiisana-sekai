/**
 * Poster (Wand-Deko) und Coffee-Table-Books (kleine Bildbände für Tische) zu Linas Lieblingsthemen:
 * Horrorfilme, Gruselromane, Synthesizer-Gruselkino, Zauberschul-Abenteuer, Kaffee und mehr.
 *
 * ALLES ist ausgedacht – Titel, Autoren, Regisseure und Motive sind Hommagen an Genres und Stimmungen, keine echten Werke
 * oder Personen (siehe CLAUDE.md). Gemalt wird in `gfx/posters.ts`, die 3D-Modelle in `models/furniture.ts`.
 */

export type PosterMotif = 'puppen' | 'nebelhaus' | 'masken' | 'nebelfront' | 'zauber' | 'kaffee' | 'ballon' | 'schreiber' | 'nowak' | 'kawaii';

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
  { id: 'poster-puppen', name: 'Poster „Die Nacht der lachenden Puppen“', kind: 'poster', title: 'DIE NACHT DER\nLACHENDEN PUPPEN', sub: 'Du schläfst nie wieder allein.', colors: ['#2a0e14', '#6a1a28'], ink: '#f2e6d0', motif: 'puppen', price: 260, description: 'Ein Gruselfilm-Poster mit einer Puppe, die ein bisschen zu breit grinst. Lina nennt es „Wohnzimmerschmuck“. Oli dreht es abends zur Wand.' },
  { id: 'poster-nebelhaus', name: 'Poster „Nebelhaus“', kind: 'poster', title: 'NEBELHAUS', sub: 'Nur ein Fenster brennt noch.', colors: ['#10232a', '#2a4a4a'], ink: '#dfeee8', motif: 'nebelhaus', price: 240, description: 'Ein altes Haus im Nebel, ein einziges Fenster leuchtet. Ein Klassiker unter den Spukhaus-Filmen – und perfekt für gemütliche Abende.' },
  { id: 'poster-masken', name: 'Poster „Die Nacht der leeren Gesichter“', kind: 'poster', title: 'DIE NACHT DER\nLEEREN GESICHTER', sub: 'Heute geht er wieder um.', colors: ['#1a1018', '#c2561e'], ink: '#fff2dc', motif: 'masken', price: 260, description: 'Eine weiße Maske, ein oranger Himmel, ein Kürbis-Vollmond. Für alle, die Halloween das ganze Jahr feiern.' },
  { id: 'poster-nebelfront', name: 'Poster „Die Nebelfront“', kind: 'poster', title: 'DIE\nNEBELFRONT', sub: 'Ein Film von Jon Schreiner', colors: ['#12353f', '#7aa0a8'], ink: '#f2fbff', motif: 'nebelfront', price: 280, description: 'Ein Leuchtturm, eine Nebelwand und ein Soundtrack, den man nur aus Synthesizern bauen kann. Lina summt ihn beim Kochen.' },
  { id: 'poster-gully', name: 'Poster „Das Ding im Gully“', kind: 'poster', title: 'DAS DING\nIM GULLY', sub: 'Er hat einen Luftballon für dich.', colors: ['#2a2a30', '#6a6030'], ink: '#fff6c8', motif: 'ballon', price: 240, description: 'Ein roter Luftballon, ein Gully-Gitter und zwei gelbe Augen im Dunkeln. Nach diesem Poster geht keiner mehr gern an Straßenabläufen vorbei.' },
  { id: 'poster-zauberlehrling', name: 'Poster „Der Zauberlehrling von Hohenkrähe“', kind: 'poster', title: 'DER ZAUBER-\nLEHRLING', sub: 'Von Hohenkrähe', colors: ['#1a1a4a', '#4a2a7a'], ink: '#ffe9a8', motif: 'zauber', price: 260, description: 'Eine Schloss-Schule auf einem Berg, eine Eule im Mondlicht und ein Zauberstab, der Funken sprüht. Für alle, die immer noch auf ihren Brief warten.' },
  { id: 'poster-kaffee', name: 'Retro-Poster „Café Fabuleux“', kind: 'poster', title: 'CAFÉ\nFABULEUX', sub: 'Das Leben ist zu kurz für schlechten Kaffee.', colors: ['#f3dcb8', '#d9a86a'], ink: '#4a2a1c', motif: 'kaffee', price: 200, description: 'Ein Kaffee-Poster im Stil alter Café-Werbung. Mit Dampfherzchen. Jens will es auch haben.' },
  // ---------------------------------------------------------------- Bildbände (Tisch)
  { id: 'buch-grusel', name: 'Bildband „Orte des Grauens“', kind: 'buch', title: 'ORTE DES\nGRAUENS', sub: 'Spukhäuser & Nebelstraßen', colors: ['#10232a', '#2a4a4a'], ink: '#dfeee8', motif: 'nebelhaus', price: 420, description: 'Ein schwerer Bildband über die gruseligsten Häuser und Straßen der Welt. Lina blättert abends darin und lässt das Licht an.' },
  { id: 'buch-albtraeume', name: 'Gruselroman „Gesammelte Albträume“', kind: 'buch', title: 'GESAMMELTE\nALBTRÄUME', sub: 'Stan Kingsbury', colors: ['#2a2a30', '#6a6030'], ink: '#fff6c8', motif: 'ballon', price: 380, description: 'Ein dicker Sammelband mit Gruselgeschichten von Stan Kingsbury – dem Meister der Kleinstadt-Albträume. Hat Eselsohren. Und einen Kaffeefleck.' },
  { id: 'buch-schreiner', name: 'Bildband „Nebel & Synthesizer“', kind: 'buch', title: 'NEBEL &\nSYNTHESIZER', sub: 'Die Filme von Jon Schreiner', colors: ['#12353f', '#7aa0a8'], ink: '#f2fbff', motif: 'schreiber', price: 440, description: 'Der große Bildband über den Regisseur, der Gruselfilme mit Synthesizer-Soundtracks gemacht hat. Mit Setfotos und Notenblättern.' },
  { id: 'buch-zauberlehrling', name: 'Roman „Der Zauberlehrling von Hohenkrähe“', kind: 'buch', title: 'DER ZAUBER-\nLEHRLING', sub: 'Band 1', colors: ['#1a1a4a', '#4a2a7a'], ink: '#ffe9a8', motif: 'zauber', price: 320, description: 'Der erste Band der Zauberschul-Reihe, schon ein bisschen zerlesen. Auf der ersten Seite steht in Linas Handschrift: „Mein Brief kommt bestimmt noch.“' },
  { id: 'buch-kaffee', name: 'Bildband „Kaffee – eine Liebeserklärung“', kind: 'buch', title: 'KAFFEE', sub: 'Eine Liebeserklärung', colors: ['#f3dcb8', '#d9a86a'], ink: '#4a2a1c', motif: 'kaffee', price: 360, description: 'Ein Bildband über Bohnen, Röstungen und Siebträger. Er riecht seltsamerweise nach Kaffee. Beim Blättern hat man Durst.' },
  { id: 'buch-nowak', name: 'Buch „Ein Schritt. Dann noch einer.“', kind: 'buch', title: 'EIN SCHRITT.\nDANN NOCH\nEINER.', sub: 'Dr. Nowak', colors: ['#3f5a66', '#6a8a96'], ink: '#fdf6e8', motif: 'nowak', price: 400, description: 'Die Erinnerungen von Dr. Nowak aus „Schwerer Weg“. Streng im Ton, warm im Herzen. Das Lieblingsbuch auf Linas Couchtisch.' },
  { id: 'buch-kawaii', name: 'Bildband „Kawaii – die Kunst der Niedlichkeit“', kind: 'buch', title: 'KAWAII', sub: 'Die Kunst der Niedlichkeit', colors: ['#ffd6e6', '#f7a8c8'], ink: '#7a2a4a', motif: 'kawaii', price: 340, description: 'Ein Bildband voller runder, weicher, niedlicher Dinge. Auf dem Vorsatzblatt steht „Für meine Japanisch-Hausaufgaben“ – und ein Smiley.' },
];

export const POSTER_BY_ID: Readonly<Record<string, PosterDef>> = Object.fromEntries(POSTERS.map((p) => [p.id, p]));
