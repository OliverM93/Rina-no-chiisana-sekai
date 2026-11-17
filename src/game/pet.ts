/**
 * Winston: Streicheln und tägliches Buddeln (Regeln ohne Darstellung).
 */
import { weightedPick } from '../core/daily';
import { canDig, markDug, petDog, practiceTrick } from '../core/pet';
import { DIG_FINDS, GISELA_WINSTON_LINES, TRICK_ALL_LEARNED, TRICK_BY_ID, TRICK_NO_TREAT, type TrickDef, type TrickId, TRICKS, PET_AGAIN, PET_FIRST, PET_SLEEPING, WINSTON_DELAY_SECONDS, WINSTON_FLAGS } from '../data/winston';

const WINSTON_START_KEY = 'winston-start';
import { dayRandom, takeItem } from './gameplay';
import { countItem } from '../core/inventory';
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

// ---------------------------------------------------------------------------
// Tricks (Leckerli: Omas Keks)
// ---------------------------------------------------------------------------

/** Welche Tricks kann Winston schon? (Reihenfolge des Lernens) */
export function learnedTricks(session: Session): TrickDef[] {
  const ids = session.data?.pet.tricks ?? [];
  return ids.map((id) => TRICK_BY_ID[id as TrickId]).filter(Boolean);
}

/** Der nächste Trick, den er lernen kann (null = alle gelernt) */
export function nextTrick(session: Session): TrickDef | null {
  const known = new Set(session.data?.pet.tricks ?? []);
  return TRICKS.find((t) => !known.has(t.id)) ?? null;
}

/** Wie weit ist er beim nächsten Trick? (Übungen, nötig) */
export function trickProgress(session: Session): { done: number; needed: number } | null {
  const t = nextTrick(session);
  return t ? { done: session.data?.pet.practice[t.id] ?? 0, needed: t.practice } : null;
}

export interface PracticeResult {
  ok: boolean;
  trick: TrickDef | null;
  learned: boolean;
  lines: string[];
}

/** Mit einem Keks den nächsten Trick üben. Ohne Keks passiert nichts (und es geht nichts verloren). */
export function practiceNextTrick(session: Session): PracticeResult {
  const data = session.data;
  const trick = nextTrick(session);
  if (!data || !trick) return { ok: false, trick: null, learned: false, lines: [TRICK_ALL_LEARNED] };
  if (countItem(data.inventory, 'keks') < 1 || !takeItem(session, 'keks', 1)) return { ok: false, trick, learned: false, lines: [TRICK_NO_TREAT] };
  const result = practiceTrick(data.pet, trick.id, trick.practice);
  if (result === 'gelernt') {
    data.world.dates[`winston:trick:${trick.id}`] = session.today();
    if (nextTrick(session) === null) data.world.dates['winston:tricks-alle'] = session.today();
    session.changed();
    return { ok: true, trick, learned: true, lines: [trick.learned] };
  }
  session.changed();
  const n = data.pet.practice[trick.id] ?? 0;
  return { ok: true, trick, learned: false, lines: [trick.learning[(n + data.pet.pets) % trick.learning.length], `(${n} von ${trick.practice} Übungen für „${trick.name}“)`] };
}

/** Einen gelernten Trick vorführen lassen: Zeile für die Meldung */
export function showTrickLine(session: Session, id: TrickId): string {
  const t = TRICK_BY_ID[id];
  const shows = t.show;
  const pets = session.data?.pet.pets ?? 0;
  if (session.data) session.data.pet.pets = pets + 1;
  return shows[pets % shows.length];
}
