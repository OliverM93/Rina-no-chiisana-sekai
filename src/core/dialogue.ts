/**
 * Auswahl von Dialogzeilen passend zur Situation.
 *
 * Jede Zeile (bzw. kleine Zeilenfolge) kann Bedingungen haben: Tageszeit,
 * Jahreszeit, Mindest-Herzen, Wochentag, besonderer Tag … Aus allen
 * passenden wird abwechslungsreich, aber reproduzierbar ausgewählt.
 */
import { hashString } from './rng';
import type { DayPhase, Season } from './time';

export interface LineCondition {
  phases?: readonly DayPhase[];
  seasons?: readonly Season[];
  minHearts?: number;
  maxHearts?: number;
  /** 0 = Sonntag … 6 = Samstag */
  weekdays?: readonly number[];
  /** nur beim ersten Gespräch des Tages */
  firstToday?: boolean;
  /** freie Markierungen, z. B. 'geburtstag-lina' */
  tags?: readonly string[];
}

export interface DialogueLine {
  /** Eine oder mehrere Zeilen, die nacheinander gesagt werden */
  text: string | readonly string[];
  when?: LineCondition;
  /** höher = wird bevorzugt (z. B. besondere Tage) */
  weight?: number;
}

export interface DialogueContext {
  phase: DayPhase;
  season: Season;
  hearts: number;
  weekday: number;
  firstToday: boolean;
  tags: readonly string[];
  /** Tag (JJJJ-MM-TT) – für reproduzierbare Abwechslung */
  day: string;
  /** zählt hoch, damit aufeinanderfolgende Gespräche verschieden sind */
  turn: number;
}

export function matches(cond: LineCondition | undefined, ctx: DialogueContext): boolean {
  if (!cond) return true;
  if (cond.phases && !cond.phases.includes(ctx.phase)) return false;
  if (cond.seasons && !cond.seasons.includes(ctx.season)) return false;
  if (cond.minHearts !== undefined && ctx.hearts < cond.minHearts) return false;
  if (cond.maxHearts !== undefined && ctx.hearts > cond.maxHearts) return false;
  if (cond.weekdays && !cond.weekdays.includes(ctx.weekday)) return false;
  if (cond.firstToday !== undefined && cond.firstToday !== ctx.firstToday) return false;
  if (cond.tags && !cond.tags.every((t) => ctx.tags.includes(t))) return false;
  return true;
}

/**
 * Wählt eine passende Zeile(nfolge). Innerhalb des höchsten Gewichts wird
 * reihum (Tag + Gesprächsnummer) ausgewählt.
 */
export function pickLine(pool: readonly DialogueLine[], ctx: DialogueContext): string[] {
  const candidates = pool.filter((l) => matches(l.when, ctx));
  if (candidates.length === 0) return [];
  // Höchstes Gewicht gewinnt (z. B. besondere Tage), sonst reihum.
  const topWeight = Math.max(...candidates.map((l) => l.weight ?? 1));
  const top = candidates.filter((l) => (l.weight ?? 1) === topWeight);
  const start = hashString(ctx.day) % top.length;
  const chosen = top[(start + ctx.turn) % top.length];
  return typeof chosen.text === 'string' ? [chosen.text] : [...chosen.text];
}
