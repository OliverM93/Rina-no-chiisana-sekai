/**
 * Geburtstagsrunde: Am Geburtstag eines Bewohners (oder an Linas eigenem) treffen sich abends alle,
 * die im Dorf wohnen, vor dem Haus des Geburtstagskinds. Lina kann vorbeikommen – muss aber nicht.
 * Texte: `data/geburtstag.ts`.
 */
import type { ScheduleEntry } from '../core/schedule';
import { isSameDayMonth } from '../core/time';
import { objectById } from '../core/worldmap';
import { BIRTHDAY_EVENING, BIRTHDAY_MOMENTS, GUEST_LINES, LINA_GUEST_LINES } from '../data/geburtstag';
import { NPCS } from '../data/npcs';
import { isPartyTime } from './party';
import type { Session } from './session';

export interface BirthdayHost {
  /** Bewohner-ID oder `lina` */
  id: string;
  name: string;
  /** Objekt-ID des Hauses, vor dem gefeiert wird */
  home: string;
}

/** Wer hat heute Geburtstag (und wohnt schon im Dorf)? Lina geht vor. */
export function birthdayHost(session: Session, now = session.clock()): BirthdayHost | null {
  const data = session.data;
  if (!data) return null;
  if (isSameDayMonth(now, data.player.birthday)) return { id: 'lina', name: data.player.name || 'Lina', home: 'haus-lina' };
  const npc = NPCS.find((n) => n.birthday && (!n.movesIn || data.flags[n.movesIn]) && isSameDayMonth(now, n.birthday));
  return npc ? { id: npc.id, name: npc.name, home: npc.home } : null;
}

/** Läuft gerade die Geburtstagsrunde? (abends; die Samstagsparty geht vor) */
export function isBirthdayEvening(session: Session, now = session.clock()): boolean {
  const h = now.getHours();
  if (h < BIRTHDAY_EVENING[0] || h >= BIRTHDAY_EVENING[1]) return false;
  if (isPartyTime(session, now)) return false;
  return birthdayHost(session, now) !== null;
}

/** Bereich vor dem Haus, in dem die Gäste stehen (Kacheln) */
export function gatheringArea(session: Session, home: string): { x: number; y: number; w: number; h: number } | null {
  const o = objectById(session.map, home);
  if (!o) return null;
  return { x: o.x - 1, y: o.y + o.h, w: o.w + 2, h: 3 };
}

/** Feste Einträge je Haus (gleiches Objekt → die Bewohner planen nicht jedes Bild neu) */
const entries = new Map<string, ScheduleEntry>();

/** Tagesablauf-Eintrag für die Runde – `null`, wenn gerade keine ist */
export function birthdayEntry(session: Session): ScheduleEntry | null {
  if (!isBirthdayEvening(session)) return null;
  const host = birthdayHost(session);
  const area = host && gatheringArea(session, host.home);
  if (!host || !area) return null;
  const key = `${host.home}:${area.x},${area.y},${area.w}`;
  let e = entries.get(key);
  if (!e) {
    e = { from: `${BIRTHDAY_EVENING[0]}:00`, label: `feiert Geburtstag vor ${host.home}`, activity: { kind: 'spazieren', area } };
    entries.set(key, e);
  }
  return e;
}

/**
 * Was ein Gast in der Runde sagt – einmal am Abend je Gast, danach plaudert er normal.
 * Das Geburtstagskind selbst sagt seine eigenen Geburtstags-Zeilen (`birthdayLines`).
 */
export function gatheringLines(session: Session, npcId: string): string[] {
  const data = session.data;
  const host = birthdayHost(session);
  if (!data || !host || host.id === npcId || !isBirthdayEvening(session)) return [];
  const key = `runde-${npcId}`;
  if (data.world.dates[key] === session.today()) return [];
  let lines: readonly string[] | undefined;
  if (host.id === 'lina') lines = LINA_GUEST_LINES[npcId];
  else {
    const pool = GUEST_LINES[npcId];
    if (pool?.length) lines = pool[(session.clock().getFullYear() + host.id.length) % pool.length];
  }
  if (!lines) return [];
  data.world.dates[key] = session.today();
  session.changed();
  return lines.map((l) => l.replaceAll('{host}', host.name));
}

/** Datums-Schlüssel für das Album: „Geburtstag von … mitgefeiert“ */
export const birthdayMomentKey = (npcId: string) => `geburtstag:${npcId}`;

/** Lina hat am Geburtstag etwas geschenkt → beim ersten Mal ein Album-Moment */
export function noteBirthdayGift(session: Session, npcId: string) {
  const data = session.data;
  if (!data || !BIRTHDAY_MOMENTS[npcId]) return;
  const key = birthdayMomentKey(npcId);
  if (data.world.dates[key]) return;
  data.world.dates[key] = session.today();
  session.changed();
}
