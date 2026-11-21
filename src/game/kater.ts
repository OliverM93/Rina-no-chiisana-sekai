/**
 * Kater, Linas schwarzer Kater: Regeln ohne Darstellung. Er taucht auf, sobald Olaf und Christin im Dorf wohnen
 * (er gehört auch zu den beiden), streunert tagsüber umher und lässt sich streicheln. Nachts und bei Regen ist er drin.
 */
import { giveItem, pickByDay, hasMovedIn } from './gameplay';
import { hashString } from '../core/rng';
import { KATER_CUSHION, KATER_FIRST, KATER_HELLO, KATER_HOME_HELLO, KATER_HOURS, KATER_MET_FLAG, KATER_MITBRINGSEL, KATER_PET_AGAIN, KATER_PET_FIRST, KATER_VISIT_EVERY, KATER_VISIT_FROM } from '../data/kater';
import { currentWeather, isRaining } from './nature';
import type { Session } from './session';

/** Gibt es Kater schon? (erst, wenn Olaf und Christin eingezogen und begrüßt sind) */
export function katerDa(session: Session): boolean {
  return hasMovedIn(session, 'olaf');
}

/** Schlechtes Wetter (Regen, Gewitter, Schnee)? Dann ist Kater lieber drinnen */
function badWeather(session: Session): boolean {
  if (isRaining(session)) return true;
  const kind = currentWeather(session).kind;
  return kind === 'gewitter' || kind === 'schnee';
}

/** Steht in Linas Haus ein Katzenkissen? (Raum-ID des ersten, sonst null) */
export function katerCushionRoom(session: Session): string | null {
  const room = session.data?.house.rooms.find((r) => r.items.some((i) => i.itemId === KATER_CUSHION));
  return room?.id ?? null;
}

/** Ist heute ein Besuchstag? (ungefähr jeden dritten Tag, reproduzierbar) */
export function katerVisitDay(session: Session): boolean {
  return hashString(`kater-besuch:${session.today()}`) % KATER_VISIT_EVERY === 0;
}

/**
 * Ist Kater gerade bei Lina zu Hause? Nur mit Katzenkissen, nur tagsüber; bei schlechtem Wetter immer,
 * sonst an Besuchstagen ab nachmittags. Nachts schläft er bei Olaf und Christin.
 */
export function katerBeiLina(session: Session): boolean {
  if (!katerDa(session) || !katerCushionRoom(session)) return false;
  const h = session.clock().getHours();
  if (h < KATER_HOURS[0] || h >= KATER_HOURS[1]) return false;
  if (badWeather(session)) return true;
  return katerVisitDay(session) && h >= KATER_VISIT_FROM;
}

/** Ist er gerade draußen unterwegs? (tagsüber, nicht bei Regen/Gewitter/Schnee, nicht bei Lina zu Besuch) */
export function katerDraussen(session: Session): boolean {
  if (!katerDa(session)) return false;
  const h = session.clock().getHours();
  if (h < KATER_HOURS[0] || h >= KATER_HOURS[1]) return false;
  if (badWeather(session)) return false;
  return !katerBeiLina(session);
}

/** Lina spricht ihn zu Hause an: beim ersten Mal am Tag vielleicht ein Mitbringsel */
export function katerHomeHello(session: Session): string[] {
  const data = session.data;
  if (!data) return [];
  const lines: string[] = [...pickByDay(session, 'kater:zuhause', KATER_HOME_HELLO)];
  if (!data.flags[KATER_MET_FLAG]) {
    data.flags[KATER_MET_FLAG] = true;
    session.changed();
  }
  const key = 'kater-mitbringsel';
  if (data.world.dates[key] !== session.today()) {
    data.world.dates[key] = session.today();
    session.changed();
    // nicht jeden Tag: etwa jeder zweite Besuch
    if (hashString(`kater-mitbringsel:${session.today()}`) % 2 === 0) {
      const gift = KATER_MITBRINGSEL[hashString(session.today()) % KATER_MITBRINGSEL.length];
      giveItem(session, gift.itemId, 1);
      lines.push(gift.line);
    }
  }
  session.save();
  return lines;
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
