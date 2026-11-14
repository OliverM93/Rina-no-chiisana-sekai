/**
 * Café-Gäste: Bewohner sitzen ab und zu in Chez Jens (Tagesablauf-Ersatz wie beim Sonntagsessen).
 * Wer heute zu Besuch ist, ist reproduzierbar pro Tag (Hash), mal vormittags, mal nachmittags.
 */
import { hashString } from '../core/rng';
import type { ScheduleEntry } from '../core/schedule';
import { CAFE_GUESTS, CAFE_PLACE } from '../data/cafeGaeste';
import { NPC_BY_ID } from '../data/npcs';
import { dinnerEntry } from './dinner';
import { meetupEntry } from './meetups';
import { hasMovedIn } from './gameplay';
import type { Session } from './session';

const ENTRIES: Record<string, ScheduleEntry> = Object.fromEntries(
  Object.keys(CAFE_GUESTS).map((id) => [id, { from: '10:00', label: 'Im Café bei Jens', activity: { kind: 'zuhause', at: CAFE_PLACE } } satisfies ScheduleEntry]),
);

/** Ist Chez Jens heute überhaupt offen für Gäste? (Jens da und nicht verreist) */
function cafeOpen(session: Session): boolean {
  const data = session.data;
  return !!data?.flags.jensBegruesst && !NPC_BY_ID.jens?.away?.(session.today());
}

/** Kommt diese Person heute grundsätzlich ins Café? */
export function cafeDay(session: Session, npcId: string): boolean {
  const def = CAFE_GUESTS[npcId];
  if (!def) return false;
  return hashString(`cafe:${session.today()}:${npcId}`) % def.everyNthDay === 0;
}

/** Sitzt die Person gerade im Café? */
export function inCafe(session: Session, npcId: string, now = session.clock()): boolean {
  const def = CAFE_GUESTS[npcId];
  if (!def || !cafeOpen(session) || !hasMovedIn(session, npcId) || !cafeDay(session, npcId)) return false;
  if (NPC_BY_ID[npcId]?.away?.(session.today())) return false;
  const h = now.getHours() + now.getMinutes() / 60;
  if (h < def.hours[0] || h >= def.hours[1]) return false;
  // Sonntagsessen und Treffen gehen vor
  return !dinnerEntry(session, npcId) && !meetupEntry(session, npcId);
}

/** Alle, die gerade im Café sitzen */
export function cafeGuests(session: Session): string[] {
  return Object.keys(CAFE_GUESTS).filter((id) => inCafe(session, id));
}

export function cafeEntry(session: Session, npcId: string): ScheduleEntry | null {
  return inCafe(session, npcId) ? (ENTRIES[npcId] ?? null) : null;
}

/** Was der Gast sagt, wenn Lina ihn im Café anspricht: Getränk (Toast) und ein Satz zum Café, abwechselnd */
export function cafeTalk(session: Session, npcId: string, n: number): { lines: string[]; drink: string } | null {
  const def = CAFE_GUESTS[npcId];
  if (!def) return null;
  const seed = hashString(`cafe:${session.today()}:${npcId}`) + n;
  return { lines: [...def.comments[seed % def.comments.length]], drink: def.drinks[seed % def.drinks.length] };
}
