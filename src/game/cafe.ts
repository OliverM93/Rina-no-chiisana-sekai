/**
 * Café-Gäste: Bewohner sitzen ab und zu in Chez Jens (Tagesablauf-Ersatz wie beim Sonntagsessen).
 * Wer heute zu Besuch ist, ist reproduzierbar pro Tag (Hash), mal vormittags, mal nachmittags.
 */
import { hashString } from '../core/rng';
import type { ScheduleEntry } from '../core/schedule';
import { CAFE_GUESTS, CAFE_PAIR_CHATS, CAFE_PLACE, JENS_CAFE_CHATS } from '../data/cafeGaeste';
import { pairChatKey, PAIR_CHATS } from '../data/gespraeche';
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

/** Ein Gespräch im Café: erster und zweiter Sprecher und die Zeilen (abwechselnd, erster beginnt) */
export interface CafeExchange {
  first: string;
  second: string;
  lines: string[];
}

/**
 * Wer redet mit wem? Aus den Anwesenden (Gäste und Jens) wird reproduzierbar ein Paar gewählt: Jens mit einem Gast
 * (`JENS_CAFE_CHATS`) oder zwei Gäste (Café-Gespräche, sonst die allgemeinen aus `gespraeche.ts`).
 * `n` zählt die Gespräche, damit nicht immer dasselbe kommt. Weniger als zwei Anwesende: null.
 */
export function cafeExchange(session: Session, present: readonly string[], n: number): CafeExchange | null {
  const ids = [...new Set(present)].sort();
  const seed = hashString(`cafechat:${session.today()}:${n}`);
  const pairs: Array<{ first: string; second: string; list: ReadonlyArray<readonly string[]> }> = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = ids[i];
      const b = ids[j];
      if (a === 'jens' || b === 'jens') {
        const guest = a === 'jens' ? b : a;
        const list = JENS_CAFE_CHATS[guest];
        if (list) pairs.push({ first: 'jens', second: guest, list });
        continue;
      }
      const own = pairChatKey(a, b);
      const cafe = CAFE_PAIR_CHATS[`${a}+${b}`] ? { key: `${a}+${b}`, swapped: false } : CAFE_PAIR_CHATS[`${b}+${a}`] ? { key: `${b}+${a}`, swapped: true } : null;
      const key = cafe ?? own;
      if (!key) continue;
      const list = [...(CAFE_PAIR_CHATS[key.key] ?? []), ...(PAIR_CHATS[key.key] ?? [])];
      const [x, y] = key.key.split('+');
      pairs.push({ first: x, second: y, list });
    }
  }
  if (pairs.length === 0) return null;
  const p = pairs[seed % pairs.length];
  const lines = p.list[Math.floor(seed / 7) % p.list.length];
  return { first: p.first, second: p.second, lines: [...lines] };
}
