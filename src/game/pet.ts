/**
 * Winston: Streicheln und tägliches Buddeln (Regeln ohne Darstellung).
 */
import { weightedPick } from '../core/daily';
import { canDig, markDug, petDog } from '../core/pet';
import { DIG_FINDS, PET_AGAIN, PET_FIRST, PET_SLEEPING } from '../data/winston';
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
