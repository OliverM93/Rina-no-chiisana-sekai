/**
 * Gemeinsame Momente mit Oli: Picknick am Tag, Sterne gucken am Abend.
 * Freiwillig, einmal am Tag je Moment, bringt Freundschaft (und Herzen).
 */
import { heartsFor } from '../core/friendship';
import { hashString } from '../core/rng';
import { KISS_LINES, PICNIC_LINES, STARS_LINES } from '../data/npcs/oli';
import { addFriendship, npcState } from './gameplay';
import { currentWeather, isRaining } from './nature';
import type { Session } from './session';

export type DateKind = 'picknick' | 'sterne';

const DATE_POINTS = 24;

function hearts(session: Session) {
  return heartsFor(npcState(session, 'oli').points);
}

/** Geht dieser Moment gerade? (Uhrzeit, Wetter, heute noch nicht) */
export function canDate(session: Session, kind: DateKind): boolean {
  const data = session.data;
  if (!data?.flags.oliEingezogen || data.world.dates[kind] === session.today()) return false;
  const h = session.clock().getHours();
  if (isRaining(session)) return false;
  if (kind === 'picknick') return h >= 9 && h < 18;
  return (h >= 21 || h < 3) && currentWeather(session).clouds < 0.6 && hearts(session) >= 1;
}

/** Den Moment erleben: merkt sich den Tag, gibt Freundschaft, liefert die Zeilen */
export function haveDate(session: Session, kind: DateKind): string[] {
  const data = session.data;
  if (!data) return [];
  data.world.dates[kind] = session.today();
  const pool = kind === 'picknick' ? PICNIC_LINES : STARS_LINES;
  const lines = [...pool[hashString(`${session.today()}:${kind}`) % pool.length]];
  lines.push(...addFriendship(session, 'oli', DATE_POINTS));
  session.save();
  return lines;
}

/** Küsschen geben: so oft man möchte – das erste am Tag zählt für die Freundschaft */
export const KISS_POINTS = 6;

export function canKiss(session: Session): boolean {
  return !!session.data?.flags.oliEingezogen;
}

export function giveKiss(session: Session, n = 0): string[] {
  const data = session.data;
  if (!data) return [];
  const lines = [...KISS_LINES[(hashString(`${session.today()}:kuss`) + n) % KISS_LINES.length]];
  if (data.world.dates.kuss !== session.today()) {
    data.world.dates.kuss = session.today();
    lines.push(...addFriendship(session, 'oli', KISS_POINTS));
    session.save();
  }
  return lines;
}
