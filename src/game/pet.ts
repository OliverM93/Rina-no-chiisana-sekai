/**
 * Winston: Streicheln und tägliches Buddeln (Regeln ohne Darstellung).
 */
import { weightedPick } from '../core/daily';
import { canDig, markDug, petDog } from '../core/pet';
import { DIG_FINDS, GISELA_WINSTON_LINES, PET_AGAIN, PET_FIRST, PET_SLEEPING, WINSTON_DELAY_SECONDS, WINSTON_FLAGS } from '../data/winston';

const WINSTON_START_KEY = 'winston-start';
import { dayRandom } from './gameplay';
import type { Session } from './session';

/** Streicheln: gibt die Zeilen für die Meldung zurück */
export function petWinston(session: Session, sleeping: boolean): string[] {
  const data = session.data;
  if (!data) return [];
  if (sleeping) return [PET_SLEEPING[data.pet.pets++ % PET_SLEEPING.length]];
  const first = petDog(data.pet, session.today());
  session.changed();
  if (first) return [...PET_FIRST[Math.floor(dayRandom(session, 'winston:streicheln')() * PET_FIRST.length)]];
  return [PET_AGAIN[data.pet.pets % PET_AGAIN.length]];
}

export function winstonMayDig(session: Session): boolean {
  return !!session.data && canDig(session.data.pet, session.today());
}

/** Heutiger Fund (einmal am Tag), oder null */
export function winstonDig(session: Session): string | null {
  const data = session.data;
  if (!data || !canDig(data.pet, session.today())) return null;
  markDug(data.pet, session.today());
  session.changed();
  return weightedPick(DIG_FINDS, dayRandom(session, 'winston:buddeln')());
}

// ---------------------------------------------------------------------------
// Winston wird gefunden
// ---------------------------------------------------------------------------

/**
 * Ältere Spielstände hatten Winston von Anfang an → er gilt dort als gefunden. Nur neue Spiele
 * (`winstonNochNicht`) erleben das Fund-Ereignis. Gibt zurück, ob Winston jetzt in der Welt sein soll.
 */
export function winstonState(session: Session): 'fehlt' | 'verfangen' | 'da' {
  const f = session.data?.flags;
  if (!f) return 'fehlt';
  if (!f[WINSTON_FLAGS.pending] && !f[WINSTON_FLAGS.found]) f[WINSTON_FLAGS.found] = true;
  if (f[WINSTON_FLAGS.found]) return 'da';
  return f[WINSTON_FLAGS.appeared] ? 'verfangen' : 'fehlt';
}

/** Ist es Zeit für das leise Fiepen? Beginnt zu zählen, sobald Oma Lina die Werkzeuge gegeben hat. */
export function winstonDue(session: Session): boolean {
  const data = session.data;
  if (!data || winstonState(session) !== 'fehlt' || !data.flags.toolsGiven) return false;
  const start = data.story[WINSTON_START_KEY];
  const now = session.playTime();
  if (start === undefined) {
    data.story[WINSTON_START_KEY] = now;
    session.changed();
    return false;
  }
  return now - start >= WINSTON_DELAY_SECONDS;
}

export function winstonAppeared(session: Session) {
  session.setFlag(WINSTON_FLAGS.appeared);
}

export function winstonFound(session: Session) {
  session.setFlag(WINSTON_FLAGS.found);
  session.save();
}

/** Omas Kommentar zu Winston – einmal, beim ersten Gespräch nach dem Fund */
export function winstonOmaLines(session: Session, npcId: string): readonly string[] {
  const f = session.data?.flags;
  if (npcId !== 'gisela' || !f || !f[WINSTON_FLAGS.found] || f[WINSTON_FLAGS.omaTold] || !f[WINSTON_FLAGS.pending]) return [];
  f[WINSTON_FLAGS.omaTold] = true;
  return GISELA_WINSTON_LINES;
}
