/**
 * Sonntagsessen bei Jens zu Hause: jeden Sonntag 18–20 Uhr. Lina, Oli und Lars
 * sind immer eingeladen, Olaf, Christin und Oma kommen manchmal dazu
 * (reproduzierbar pro Sonntag). Freiwillig, gemütlich, mit viel Gesächsel.
 */
import { hashString } from '../core/rng';
import type { ScheduleEntry } from '../core/schedule';
import { NPC_BY_ID } from '../data/npcs';
import type { Session } from './session';

export const DINNER_DAY = 0; // Sonntag
export const DINNER_HOURS: readonly [number, number] = [18, 20];

const ALWAYS = ['jens', 'oli', 'lars'];
const SOMETIMES = ['olaf', 'christin', 'gisela'];

export function isDinnerTime(session: Session, now = session.clock()): boolean {
  const data = session.data;
  if (!data?.flags.jensBegruesst) return false;
  const jens = NPC_BY_ID.jens;
  if (jens?.away?.(session.today())) return false;
  const h = now.getHours();
  return now.getDay() === DINNER_DAY && h >= DINNER_HOURS[0] && h < DINNER_HOURS[1];
}

/** Wer heute zum Essen kommt (nur wer schon im Dorf wohnt) */
export function dinnerGuests(session: Session): string[] {
  const data = session.data;
  if (!data) return [];
  const day = session.today();
  const movedIn = (id: string) => {
    const n = NPC_BY_ID[id];
    return !!n && (!n.movesIn || !!data.flags[n.movesIn]);
  };
  return [...ALWAYS, ...SOMETIMES.filter((id) => hashString(`essen:${day}:${id}`) % 2 === 0)].filter(movedIn);
}

/** Tagesablauf-Ersatz während des Essens (oder null) */
export function dinnerEntry(session: Session, npcId: string): ScheduleEntry | null {
  if (!isDinnerTime(session) || !dinnerGuests(session).includes(npcId)) return null;
  return ENTRIES[npcId] ?? null;
}

/** Feste Einträge (gleiches Objekt → Bewohner planen nicht jedes Bild neu) */
const ENTRIES: Record<string, ScheduleEntry> = Object.fromEntries(
  [...ALWAYS, ...SOMETIMES].map((id) => [id, { from: '18:00', label: 'Sonntagsessen bei Jens', activity: { kind: 'zuhause', at: id === 'jens' ? undefined : 'bistro-jens' } } satisfies ScheduleEntry]),
);
