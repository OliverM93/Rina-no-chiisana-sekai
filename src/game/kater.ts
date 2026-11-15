/**
 * Kater, Linas schwarzer Kater: Regeln ohne Darstellung. Er taucht auf, sobald Olaf und Christin im Dorf wohnen
 * (er gehört auch zu den beiden), streunert tagsüber umher und lässt sich streicheln. Nachts und bei Regen ist er drin.
 */
import { pickByDay, hasMovedIn } from './gameplay';
import { KATER_FIRST, KATER_HELLO, KATER_HOURS, KATER_MET_FLAG, KATER_PET_AGAIN, KATER_PET_FIRST } from '../data/kater';
import { currentWeather, isRaining } from './nature';
import type { Session } from './session';

/** Gibt es Kater schon? (erst, wenn Olaf und Christin eingezogen und begrüßt sind) */
export function katerDa(session: Session): boolean {
  return hasMovedIn(session, 'olaf');
}

/** Ist er gerade draußen unterwegs? (tagsüber, nicht bei Regen/Gewitter/Schnee) */
export function katerDraussen(session: Session): boolean {
  if (!katerDa(session)) return false;
  const h = session.clock().getHours();
  if (h < KATER_HOURS[0] || h >= KATER_HOURS[1]) return false;
  if (isRaining(session)) return false;
  const kind = currentWeather(session).kind;
  return kind !== 'gewitter' && kind !== 'schnee';
}

/** Lina spricht Kater an: das erste Mal ein eigener Moment, danach täglich wechselnde Zeilen */
export function katerHello(session: Session): string[] {
  const data = session.data;
  if (!data) return [];
  if (!data.flags[KATER_MET_FLAG]) {
    data.flags[KATER_MET_FLAG] = true;
    session.changed();
    session.save();
    return [...KATER_FIRST];
  }
  return [...pickByDay(session, 'kater:hallo', KATER_HELLO)];
}

/** Streicheln: das erste Mal am Tag etwas Besonderes (Herzchen), sonst kleine Zeilen */
export function katerPet(session: Session): { lines: string[]; first: boolean } {
  const data = session.data;
  if (!data) return { lines: [], first: false };
  const key = 'kater-streicheln';
  const first = data.world.dates[key] !== session.today();
  data.world.dates[key] = session.today();
  session.changed();
  const n = Number(data.world.dates['kater-streicheln-n'] ?? '0') || 0;
  data.world.dates['kater-streicheln-n'] = String(n + 1);
  return { lines: first ? [...pickByDay(session, 'kater:streicheln', KATER_PET_FIRST)] : [KATER_PET_AGAIN[n % KATER_PET_AGAIN.length]], first };
}
