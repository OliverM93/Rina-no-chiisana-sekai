/**
 * Thalias Party: jeden Samstag von 19 bis 22 Uhr auf dem Dorfplatz.
 * Alle Bewohner, die im Dorf sind, kommen vorbei. Freiwillig, kein Muss.
 */
import type { ScheduleEntry } from '../core/schedule';
import type { Session } from './session';

export const PARTY_DAY = 6; // Samstag
export const PARTY_HOURS: readonly [number, number] = [19, 22];

/** Ist gerade Party? (Thalia muss eingezogen sein) */
export function isPartyTime(session: Session, now = session.clock()): boolean {
  if (!session.data?.flags.thaliaBegruesst) return false;
  const h = now.getHours();
  return now.getDay() === PARTY_DAY && h >= PARTY_HOURS[0] && h < PARTY_HOURS[1];
}

/** Tagesablauf-Eintrag für die Party (ersetzt den normalen Eintrag) */
export const PARTY_ENTRY: ScheduleEntry = {
  from: '19:00',
  label: 'feiert auf dem Dorfplatz',
  activity: { kind: 'spazieren', area: { x: 24, y: 19, w: 7, h: 4 } },
};
