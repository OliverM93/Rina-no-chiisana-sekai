/**
 * Bewohner kommentieren, wenn Lina angetrunken mit ihnen redet (Texte: `data/tipsy.ts`, Logik: `core/tipsy.ts`).
 * Der Kommentar kommt höchstens alle 25 Sekunden je Bewohner, damit er sich beim Weiterplaudern nicht wiederholt.
 */
import { buzzAt, stage } from '../core/tipsy';
import { hashString } from '../core/rng';
import { TIPSY_NPC_LINES } from '../data/tipsy';
import type { Session } from './session';

/** So lange wartet derselbe Bewohner, bevor er Lina noch einmal darauf anspricht (Spielzeit in ms) */
export const COMMENT_PAUSE_MS = 25_000;

/** Kommentar des Bewohners zu Linas Zustand (leer, wenn sie nüchtern ist oder er es gerade erst gesagt hat) */
export function tipsyComment(session: Session, npcId: string): string[] {
  const reaction = TIPSY_NPC_LINES[npcId];
  if (!reaction) return [];
  const now = session.playTime();
  const st = stage(buzzAt(session.tipsy, now));
  if (st === 0) return [];
  const last = session.tipsySpoken.get(npcId);
  if (last !== undefined && now - last < COMMENT_PAUSE_MS) return [];
  session.tipsySpoken.set(npcId, now);
  const pool = st === 1 ? reaction.leicht : reaction.schummrig;
  return [...pool[hashString(`${npcId}:${session.today()}:${Math.floor(now / COMMENT_PAUSE_MS)}`) % pool.length]];
}
