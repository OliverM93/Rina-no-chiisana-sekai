/**
 * Fortschritt: Woran arbeitet Lina gerade (nächster Einzug), und welcher Bewohner
 * gibt dazu einen sanften Hinweis? (Ohne Abhängigkeit von gameplay/story.)
 */
import { missingNeeds, type NeedKind, type ProgressState } from '../core/progress';
import { GARDEN_FLOWER } from '../data/items';
import { FLAG_AUSBAU_BESTELLT, type Milestone, MILESTONES } from '../data/progress';
import type { Session } from './session';

/** Fortschritt für die Meilensteine (zusätzlich: „schon mal durchgecheckt“) */
export function progressState(session: Session): ProgressState | null {
  const data = session.data;
  if (!data) return null;
  return {
    stats: data.stats,
    // Blumenfarben zählen nicht mit (sonst wäre „Sammelbuch“ als Einzugs-Bedingung zu schnell erfüllt)
    collectionSize: Object.keys(data.collection).filter((id) => !(id in GARDEN_FLOWER)).length,
    flags: {
      ...data.flags,
      checkupDone: !!data.flags.checkupDone || !!data.world.dates.checkup,
      // Erster Hausausbau bestellt (oder schon fertig) – auch für alte Spielstände ohne eigenes Flag
      [FLAG_AUSBAU_BESTELLT]: data.house.stage >= 1 || !!data.house.pending,
    },
  };
}

/** Der Meilenstein, an dem Lina gerade arbeitet (Voraussetzung erfüllt, noch nicht angekündigt) */
export function currentMilestone(session: Session): Milestone | null {
  const f = session.data?.flags;
  if (!f) return null;
  return MILESTONES.find((m) => f[m.after] && !f[`${m.npc}Angekuendigt`]) ?? null;
}

/** Fehlt für den nächsten Einzug noch etwas dieser Art (z. B. „gebaut“ → die Werkbank)? */
export function milestoneMissing(session: Session, kind: NeedKind): { npc: string } | null {
  const m = currentMilestone(session);
  const st = progressState(session);
  if (!m || !st) return null;
  return missingNeeds(m.needs, st).some((n) => n.kind === kind) ? { npc: m.npc } : null;
}

/** Hinweis dieses Bewohners auf das, was für den nächsten Einzug noch fehlt (oder null) */
export function progressHint(session: Session, npcId: string): readonly string[] | null {
  const m = currentMilestone(session);
  const st = progressState(session);
  if (!m || !st || m.hintBy !== npcId) return null;
  const missing = missingNeeds(m.needs, st);
  if (missing.length === 0) return null;
  // reproduzierbar abwechseln, wenn mehreres fehlt
  const day = session.today();
  let h = 0;
  for (const ch of day + npcId) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const need = missing[h % missing.length];
  if (need.kind === 'flag' && need.flag && m.flagHints?.[need.flag]) return m.flagHints[need.flag];
  return m.hints[need.kind] ?? null;
}
