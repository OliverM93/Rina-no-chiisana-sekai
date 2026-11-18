/**
 * Gemeinsame Unternehmungen mit den Bewohnern: was es gibt, was die Person sagt, was danach passiert.
 * Herzen nur einmal am Tag je Person, das erste Mal kommt ins Album, ein neuer Bestwert wird kommentiert.
 * Es wird nichts Neues im Spielstand-Format gebraucht: alles liegt in `world.dates` (Text-Schlüssel).
 */
import { duelUnlocksNext, type Rank } from '../core/unternehmungen';
import { NPC_BY_ID } from '../data/npcs';
import { UNTERNEHMUNG_BY_ID, UNTERNEHMUNGEN, type UnternehmungDef, ZUSAMMEN_PUNKTE, zusammenBestKey, zusammenErstKey, zusammenLevelKey, zusammenTagKey } from '../data/unternehmungen';
import { addFriendship, hasMovedIn, pickByDay } from './gameplay';
import type { Session } from './session';

/** Was Lina mit dieser Person gerade unternehmen kann */
export function activitiesFor(session: Session, npcId: string): UnternehmungDef[] {
  if (!NPC_BY_ID[npcId] || !hasMovedIn(session, npcId)) return [];
  return UNTERNEHMUNGEN.filter((u) => u.npc === npcId);
}

export function introLines(session: Session, def: UnternehmungDef): readonly string[] {
  return pickByDay(session, `zusammen-intro:${def.id}`, def.intro);
}

/** Ergebnis einer Runde. `score` = Versuche/Züge (weniger ist besser) bzw. Treffer/Punkte (mehr ist besser). */
export interface RoundResult {
  rank: Rank;
  score?: number;
  /** Pfeil-Duell: gespieltes Level (0 = erstes) */
  level?: number;
  /** Malen: gewähltes Motiv & Farben */
  motif?: string;
  palette?: string;
}

/** Bei Memory und Puzzle zählen Züge – da ist weniger besser */
export const lowerIsBetter = (def: UnternehmungDef) => def.game === 'memory' || def.game === 'puzzle';

export function bestOf(session: Session, id: string, level?: number): number | null {
  const raw = session.data?.world.dates[zusammenBestKey(id, level)];
  const n = raw === undefined ? Number.NaN : Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

/** Runde abschließen: Abschluss-Sätze der Person, ggf. Bestwert, Album, Herzen (einmal am Tag je Person) */
export function finishActivity(session: Session, id: string, result: RoundResult): string[] {
  const def = UNTERNEHMUNG_BY_ID[id];
  const data = session.data;
  if (!def || !data) return [];
  const dates = data.world.dates;
  const today = session.today();
  const count = Number.parseInt(dates[`zusammen-n:${id}`] ?? '0', 10) || 0;
  dates[`zusammen-n:${id}`] = String(count + 1);
  const lines: string[] = [];

  if (def.malen) {
    const motif = def.malen.motifs.find((m) => m.id === result.motif);
    const pal = def.malen.palettes.find((p) => p.id === result.palette);
    if (motif) lines.push(motif.verdict);
    if (pal) lines.push(pal.verdict);
  }
  // reproduzierbar, aber je Runde anders
  lines.push(...pickByDay(session, `zusammen-done:${id}:${count}`, def.done[result.rank]));

  // Bestwert (erst ab der zweiten Runde ein „Rekord“ – beim ersten Mal ist alles neu)
  if (result.score !== undefined && !def.malen) {
    const best = bestOf(session, id, result.level);
    const better = best === null || (lowerIsBetter(def) ? result.score < best : result.score > best);
    if (better) {
      dates[zusammenBestKey(id, result.level)] = String(result.score);
      if (best !== null && def.record.length > 0) lines.push(pickByDay(session, `zusammen-rekord:${id}:${count}`, def.record));
    }
  }

  // Level-Spiele (Pfeil-Duell, Kissen-Sumo): nächstes Level freischalten
  const levels = levelNames(def);
  if (levels.length > 1 && result.level !== undefined && result.score !== undefined) {
    const reached = unlockedLevels(session, id);
    const earned = def.duell ? duelUnlocksNext(result.score, def.duell.levels[result.level]?.length ?? 99) : result.rank !== 'gemuetlich';
    if (result.level === reached - 1 && reached < levels.length && earned) {
      dates[zusammenLevelKey(id)] = String(reached + 1);
      const unlockedLines = def.duell?.unlocked ?? def.sumo?.unlocked ?? ['Neues Level!'];
      lines.push(pickByDay(session, `zusammen-level:${id}:${reached}`, unlockedLines), `🔓 Level ${reached + 1}: ${levels[reached]}`);
    }
  }

  if (!dates[zusammenErstKey(id)]) dates[zusammenErstKey(id)] = today;
  if (dates[zusammenTagKey(def.npc)] !== today) {
    dates[zusammenTagKey(def.npc)] = today;
    lines.push(...addFriendship(session, def.npc, ZUSAMMEN_PUNKTE));
  }
  session.changed();
  session.save();
  return lines;
}

/** Wie viele Level schon erreicht sind (mindestens das erste) */
export function unlockedLevels(session: Session, id: string): number {
  const def = UNTERNEHMUNG_BY_ID[id];
  const max = def ? Math.max(1, levelNames(def).length) : 1;
  const n = Number.parseInt(session.data?.world.dates[zusammenLevelKey(id)] ?? '1', 10);
  return Math.max(1, Math.min(max, Number.isFinite(n) ? n : 1));
}

/** Namen der Level (Pfeil-Duell: Boss, Sumo: Rang); leer bei Spielen ohne Level */
export function levelNames(def: UnternehmungDef): string[] {
  if (def.duell) return def.duell.levels.map((l) => l.boss);
  if (def.sumo) return def.sumo.levels.map((l) => l.name);
  return [];
}
