/**
 * Schummrig werden: Lina trinkt ein Glas Bier oder Wein (Café bei Jens, zu Hause) und wird kurz beschwipst –
 * das Bild wird unscharf und wackelig, sie torkelt ein bisschen und lässt sich schwerer steuern.
 * Alles ist **kurz und freundlich**: Ein Glas lässt nach etwa einer Minute nach, nach drei Gläsern sagt Lina selbst
 * „jetzt lieber ein Wasser“, und Wasser macht sofort wieder klarer. Nichts wird gespeichert, nichts hat Folgen.
 *
 * Reine Logik (ohne DOM): Zeitangaben sind Spielzeit in **Sekunden** (`session.playTime()`).
 */

/** Zustand: „Schwips“ zum Zeitpunkt `at` (0 = nüchtern, `MAX_BUZZ` = ganz schön schummrig) */
export interface Tipsy {
  buzz: number;
  at: number;
}

/** So viel Schwips gibt ein einzelnes Glas */
export const GLASS: Readonly<Record<'bier' | 'wein', number>> = { bier: 1, wein: 1.1 };
/** Mehr als das wird Lina nie */
export const MAX_BUZZ = 3;
/** Ab diesem Schwips lehnt Lina weitere Gläser selbst ab */
export const REFUSE_AT = 2.1;
/** Ein Glas lässt in so vielen Sekunden nach (1 Minute) */
export const DECAY_SEC = 60;
/** Ein Glas Wasser macht so viel klarer */
export const WATER_CLEARS = 1.5;

export function createTipsy(): Tipsy {
  return { buzz: 0, at: 0 };
}

/** Aktueller Schwips (sinkt von selbst) */
export function buzzAt(t: Tipsy, now: number): number {
  return Math.max(0, t.buzz - Math.max(0, now - t.at) / DECAY_SEC);
}

export type DrinkOutcome = 'ok' | 'genug';

/** Ein Glas Alkohol – oder Lina lehnt freundlich ab, wenn sie schon genug hat */
export function drinkAlcohol(t: Tipsy, now: number, glass: keyof typeof GLASS): DrinkOutcome {
  const cur = buzzAt(t, now);
  if (cur >= REFUSE_AT) return 'genug';
  t.buzz = Math.min(MAX_BUZZ, cur + GLASS[glass]);
  t.at = now;
  return 'ok';
}

/** Ein Glas Wasser: sofort deutlich klarer */
export function drinkWater(t: Tipsy, now: number): void {
  t.buzz = Math.max(0, buzzAt(t, now) - WATER_CLEARS);
  t.at = now;
}

/** Grobe Stufe für Texte: 0 nüchtern, 1 beschwipst, 2 schummrig, 3 ganz schön schummrig */
export function stage(buzz: number): 0 | 1 | 2 | 3 {
  return buzz < 0.05 ? 0 : buzz < 1.2 ? 1 : buzz < 2.1 ? 2 : 3;
}

export interface TipsyEffect {
  /** Unschärfe des Bildes in Pixeln */
  blur: number;
  /** Wackeln des Bildes: Neigung (Grad) und Tempo (Hz) */
  rollDeg: number;
  rollHz: number;
  /** leichtes Heranzoomen, damit die Ränder beim Wackeln nicht sichtbar werden */
  zoom: number;
  /** Ablenkung der Laufrichtung (Bogenmaß): pendelt bis etwa ±1,4 × drift hin und her */
  drift: number;
  /** Tempo-Faktor (< 1 = langsamer) */
  speed: number;
  /** Schwanken des Körpers 0..1 */
  lean: number;
}

export const NO_EFFECT: TipsyEffect = { blur: 0, rollDeg: 0, rollHz: 0, zoom: 1, drift: 0, speed: 1, lean: 0 };

/** Wirkung eines Schwips-Wertes – wächst und schwindet weich, ohne Sprünge */
export function effectOf(buzz: number): TipsyEffect {
  if (buzz < 0.03) return NO_EFFECT;
  const e = Math.pow(Math.min(1, buzz / MAX_BUZZ), 0.8);
  return {
    blur: 0.6 + 2.2 * e,
    rollDeg: 0.5 + 1.6 * e,
    rollHz: 0.35 + 0.2 * e,
    zoom: 1 + 0.035 * e,
    drift: 0.4 * e,
    speed: 1 - 0.2 * e,
    lean: e,
  };
}
