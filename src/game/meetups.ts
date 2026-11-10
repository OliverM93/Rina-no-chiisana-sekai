/**
 * Treffen der Bewohner: wer gerade wo zusammensteht, und Lina darf sich dazugesellen.
 */
import { hashString } from '../core/rng';
import type { ScheduleEntry } from '../core/schedule';
import { type MeetupDef, MEETUPS } from '../data/meetups';
import { NPC_BY_ID } from '../data/npcs';
import { addFriendship } from './gameplay';
import type { Session } from './session';

function movedIn(session: Session, id: string): boolean {
  const n = NPC_BY_ID[id];
  const data = session.data;
  if (!n || !data) return false;
  if (n.movesIn && !data.flags[n.movesIn]) return false;
  return !n.away?.(session.today());
}

/** Läuft dieses Treffen gerade? (mindestens zwei Mitglieder im Dorf) */
export function isMeetupNow(session: Session, m: MeetupDef, now = session.clock()): boolean {
  const h = now.getHours();
  if (!m.weekdays.includes(now.getDay()) || h < m.hours[0] || h >= m.hours[1]) return false;
  return m.members.filter((id) => movedIn(session, id)).length >= 2;
}

export function activeMeetups(session: Session): MeetupDef[] {
  return MEETUPS.filter((m) => isMeetupNow(session, m));
}

/** Welches Treffen hat dieser Bewohner gerade? */
export function meetupOf(session: Session, npcId: string): MeetupDef | null {
  return activeMeetups(session).find((m) => m.members.includes(npcId) && movedIn(session, npcId)) ?? null;
}

const ENTRIES = new Map<string, ScheduleEntry>();

/** Tagesablauf-Ersatz während eines Treffens (gleiches Objekt pro Treffen & Bewohner) */
export function meetupEntry(session: Session, npcId: string): ScheduleEntry | null {
  const m = meetupOf(session, npcId);
  if (!m) return null;
  const key = `${m.id}:${npcId}`;
  let e = ENTRIES.get(key);
  if (!e) {
    const s = m.spots[npcId];
    e = { from: `${m.hours[0]}:00`, label: m.name, activity: s.bench ? { kind: 'sitzen', bench: s.bench } : { kind: 'stehen', x: s.x, y: s.y, facing: s.facing } };
    ENTRIES.set(key, e);
  }
  return e;
}

/** Was dieses Mitglied sagt, wenn Lina es beim Treffen anspricht – es geht auf das Gespräch mit den anderen ein (täglich wechselnd) */
export function meetupReply(session: Session, m: MeetupDef, npcId: string): string {
  const pool = m.replies[npcId] ?? [];
  if (pool.length === 0) return 'Schön, dass du da bist, Lina!';
  return pool[hashString(`${m.id}:${npcId}:${session.today()}`) % pool.length];
}

/** Dazugesellen: Gespräch zum Mithören, einmal pro Tag mit Freundschaft */
export function joinMeetup(session: Session, m: MeetupDef): string[] {
  const data = session.data;
  if (!data) return [];
  const day = session.today();
  const lines = [...m.talks[hashString(`${m.id}:${day}`) % m.talks.length]];
  const key = `treffen:${m.id}`;
  if (data.world.dates[key] !== day) {
    data.world.dates[key] = day;
    for (const id of m.members) if (movedIn(session, id)) lines.push(...addFriendship(session, id, 8));
    session.save();
  }
  return lines;
}
