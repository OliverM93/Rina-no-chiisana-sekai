/**
 * Feste im Spiel: was heute gefeiert wird, Geschenke & Sprüche der Bewohner.
 */
import { festKey, festivalsOn, type FestivalId } from '../core/festivals';
import { dailySpawns, type DailySpawn } from '../core/daily';
import { EASTER_EGGS_PER_DAY, FEST_GIFTS, FEST_LINES } from '../data/festivals';
import { grassTiles } from './digging';
import { giveItem } from './gameplay';
import type { Session } from './session';

export function todaysFestivals(session: Session): FestivalId[] {
  return festivalsOn(session.clock(), session.data?.player.birthday);
}

export function isFestival(session: Session, id: FestivalId): boolean {
  return todaysFestivals(session).includes(id);
}

/**
 * Beim ersten Gespräch des Tages: Fest-Sprüche und (einmal pro Jahr) ein Geschenk.
 * Gibt zusätzliche Zeilen zurück.
 */
export function festTalk(session: Session, npcId: string): string[] {
  const data = session.data;
  if (!data) return [];
  const now = session.clock();
  const out: string[] = [];
  for (const f of todaysFestivals(session)) {
    const gift = FEST_GIFTS[f]?.[npcId];
    const key = festKey(f, now, npcId);
    if (gift && !data.world.dates[key]) {
      if (giveItem(session, gift.itemId, gift.count) === 0) {
        data.world.dates[key] = session.today();
        out.push(...gift.lines);
      } else out.push(...gift.lines.slice(0, 1), 'Oh, deine Tasche ist voll! Komm nachher nochmal, dann geb ich dir dein Geschenk.');
      continue;
    }
    const lines = FEST_LINES[f]?.[npcId];
    if (lines && !gift) out.push(...lines);
  }
  if (out.length > 0) session.changed();
  return out;
}

/** Ostereier im Gras (Ostersonntag & -montag), reproduzierbar pro Tag */
export function todaysEasterEggs(session: Session): DailySpawn[] {
  const data = session.data;
  if (!data || !isFestival(session, 'ostern')) return [];
  const day = session.today();
  const picked = data.world.picked.day === day ? new Set(data.world.picked.ids) : new Set<string>();
  return dailySpawns(day, grassTiles(session), EASTER_EGGS_PER_DAY, [{ itemId: 'osterei', weight: 1 }], 'ostern')
    .map((s) => ({ ...s, id: `osterei:${s.id}` }))
    .filter((s) => !picked.has(s.id));
}
