/**
 * Kaffee: Siebträgermaschinen in vier Preisklassen und die Getränke, die sie können.
 * Regeln in `game/coffee.ts`. Die Maschinen sind Möbel (`data/furniture.ts`), Modelle in `models/furniture.ts`.
 *
 * Kaffeetrinken ist reines Vergnügen: Der „Kaffee-Kick“ (Lina läuft ein paar Minuten flotter) und ein
 * Kaffee zu zweit mit Oli (einmal am Tag Freundschaft) sind nette Beigaben, nichts davon ist Pflicht.
 */

export interface Drink {
  id: string;
  name: string;
  icon: string;
  /** braucht Milchschaum (Dampflanze) */
  milk: boolean;
  /** Latte-Art – sieht man, gibt ein Extra-Funkeln */
  art?: boolean;
  /** Was Lina dazu sagt (wird nach dem Trinken angezeigt) */
  lines: readonly string[];
  /** Kaffee-Kick: so viele Sekunden Spielzeit läuft Lina schneller */
  kick: number;
}

export const DRINKS: readonly Drink[] = [
  { id: 'espresso', name: 'Espresso', icon: '☕', milk: false, kick: 150, lines: ['Ein kleiner, dunkler Espresso mit goldbrauner Crema. Ein Schluck, und die Welt wird eine Spur schärfer.'] },
  { id: 'lungo', name: 'Lungo', icon: '☕', milk: false, kick: 150, lines: ['Ein Lungo, lang gezogen und mild. Perfekt zum Nachdenken.'] },
  { id: 'americano', name: 'Americano', icon: '🫖', milk: false, kick: 180, lines: ['Espresso mit heißem Wasser: groß, ruhig und genau richtig für einen langen Nachmittag.'] },
  { id: 'cafe-creme', name: 'Café Crème', icon: '☕', milk: false, kick: 180, lines: ['Ein Café Crème mit dichter Schaumkrone. Wie in einem kleinen Bistro in Paris.'] },
  { id: 'cappuccino', name: 'Cappuccino', icon: '☕', milk: true, kick: 180, lines: ['Ein Cappuccino mit einer festen Haube aus Milchschaum. Dazu etwas Kakaopulver. Himmlisch.'] },
  { id: 'latte-macchiato', name: 'Latte Macchiato', icon: '🥛', milk: true, kick: 180, lines: ['Latte Macchiato in drei Schichten: Milch, Espresso, Schaum. Du schaust ihm eine Weile beim Schichten zu.'] },
  { id: 'flat-white', name: 'Flat White', icon: '☕', milk: true, kick: 200, lines: ['Ein Flat White mit samtiger Mikroschaum-Milch. Glatt wie ein See.'] },
  { id: 'herz-latte', name: 'Latte mit Herz', icon: '🤎', milk: true, art: true, kick: 240, lines: ['Auf dem Milchschaum schwimmt ein perfektes Herz. Du traust dich kaum, es kaputt zu trinken. Fast.'] },
];

export const DRINK_BY_ID: Readonly<Record<string, Drink>> = Object.fromEntries(DRINKS.map((d) => [d.id, d]));

export interface Machine {
  /** Möbel-ID */
  itemId: string;
  tier: 1 | 2 | 3 | 4;
  drinks: readonly string[];
  /** Besonderheiten für die Beschreibung im Katalog */
  features: readonly string[];
  /** Kaffee zu zweit mit Oli: so viele Freundschaftspunkte (einmal am Tag) */
  together: number;
}

export const MACHINES: readonly Machine[] = [
  { itemId: 'espresso-einsteiger', tier: 1, drinks: ['espresso', 'lungo'], features: ['Einkreiser', 'Espresso & Lungo'], together: 8 },
  { itemId: 'kaffeemaschine', tier: 2, drinks: ['espresso', 'lungo', 'americano', 'cappuccino'], features: ['Dampflanze für Milchschaum', 'Olis Liebling'], together: 12 },
  { itemId: 'espresso-profi', tier: 3, drinks: ['espresso', 'lungo', 'americano', 'cafe-creme', 'cappuccino', 'latte-macchiato', 'flat-white'], features: ['Zweikreiser', 'eingebaute Mühle', 'Mikroschaum'], together: 16 },
  { itemId: 'espresso-hebel', tier: 4, drinks: ['espresso', 'lungo', 'americano', 'cafe-creme', 'cappuccino', 'latte-macchiato', 'flat-white', 'herz-latte'], features: ['Handhebel aus Messing', 'Latte-Art', 'Kaffee für zwei ist ein Fest'], together: 24 },
];

export const MACHINE_BY_ITEM: Readonly<Record<string, Machine>> = Object.fromEntries(MACHINES.map((m) => [m.itemId, m]));

/** Olis Sprüche, wenn er mittrinkt (je nach Maschine & Getränk) */
export const OLI_COFFEE_LINES: readonly string[] = [
  'Oli hält die Tasse unter die Nase und schließt die Augen. „Okay. Das ist Liebe.“',
  'Oli: „Lini, ich schwör: Der schmeckt besser, wenn du ihn machst.“',
  'Oli: „Wusstest du, dass der Druck bei neun Bar liegen muss? … Ja, ich hab es gegoogelt. Ich bin so stolz auf uns.“',
  'Oli: „Kaffee und du. Mehr braucht ein Morgen nicht.“',
  'Oli stößt mit seiner Tasse gegen deine. „Auf uns. Und auf Crema.“',
];

/** Für die Latte-Art-Maschine: zusätzlicher Spruch von Oli */
export const OLI_ART_LINES: readonly string[] = [
  'Oli: „Das Herz … ist dir gelungen. Ich frier das ein. Das kommt in einen Rahmen.“',
  'Oli: „Ich hab noch nie ein so schönes Herz auf einem Kaffee gesehen. Und ich hab schon viele gesehen. Im Café. Von Fremden.“',
];

/** Kommentare, wenn Lina heute schon viele Tassen hatte */
export const MANY_CUPS_LINES: readonly string[] = [
  'Das ist heute schon deine fünfte Tasse. Dein Herz klopft in Morsezeichen.',
  'Fünf Tassen heute. Dein Zimmer riecht nach Kaffee, und du auch. Es ist okay.',
];
