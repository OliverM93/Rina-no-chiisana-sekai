/**
 * Winterzauber: Olis Adventskalender (ein Brief pro Tag, 1.–24. Dezember), Schneebälle
 * auf der Wiese (Dezember–Februar) und der Punschstand am Weihnachtsbaum.
 * Nichts davon ist Pflicht – ein verpasstes Türchen ist einfach ein Tag ohne Brief,
 * nur das 24. kommt sicher (bis Silvester).
 */
import { dailySpawns, type DailySpawn } from '../core/daily';
import { getSeason } from '../core/time';
import { NPC_BY_ID } from '../data/npcs';
import { ADVENT_DOORS, PUNSCH_DRINKS, PUNSCH_HOURS, SNOWBALLS_PER_DAY } from '../data/winter';
import { grassTiles } from './digging';
import { sendLetter } from './gameplay';
import type { Session } from './session';

export function isWinter(session: Session, now = session.clock()): boolean {
  return getSeason(now) === 'winter';
}

/** Advent & Weihnachten (1.–26. Dezember) – so lange steht der Punschstand am Weihnachtsbaum */
export function isAdventTime(now: Date): boolean {
  return now.getMonth() === 11 && now.getDate() <= 26;
}

/** Brief-ID eines Türchens (eindeutig pro Jahr) */
export function adventLetterId(year: number, door: number): string {
  return `advent-${year}-${door}`;
}

/** Welches Türchen kommt heute? (1–24, oder null) – das 24. noch bis Silvester */
export function adventDoorToday(session: Session, now = session.clock()): number | null {
  if (now.getMonth() !== 11) return null;
  const d = now.getDate();
  if (d <= 24) return d;
  const data = session.data;
  const got = data?.mail.letters.some((l) => l.id === adventLetterId(now.getFullYear(), 24));
  return got ? null : 24;
}

/** Olis Türchen von heute in den Briefkasten (einmal). Gibt `true` zurück, wenn ein Brief kam. */
export function checkAdvent(session: Session): boolean {
  const data = session.data;
  const oli = NPC_BY_ID.oli;
  if (!data || !oli || !data.flags.toolsGiven) return false;
  const now = session.clock();
  const door = adventDoorToday(session, now);
  if (door === null) return false;
  const id = adventLetterId(now.getFullYear(), door);
  if (data.world.dates[id] || data.mail.letters.some((l) => l.id === id)) return false;
  const d = ADVENT_DOORS[door - 1];
  sendLetter(session, oli, { id: `advent-${door}`, subject: door === 24 ? 'Das 24. Türchen 🎄' : `Türchen ${door} 🎁`, body: d.body, gift: d.gift }, id);
  data.world.dates[id] = session.today();
  session.changed();
  return true;
}

/** Heutige Schneebälle auf der Wiese (nur im Winter), reproduzierbar pro Tag */
export function todaysSnowballs(session: Session): DailySpawn[] {
  const data = session.data;
  if (!data || !isWinter(session)) return [];
  const day = session.today();
  const picked = data.world.picked.day === day ? new Set(data.world.picked.ids) : new Set<string>();
  return dailySpawns(day, grassTiles(session), SNOWBALLS_PER_DAY, [{ itemId: 'schneeball', weight: 1 }], 'schnee')
    .map((s) => ({ ...s, id: `schneeball:${s.id}` }))
    .filter((s) => !picked.has(s.id));
}

/** Hat der Punschstand gerade offen? */
export function punschOpen(now: Date): boolean {
  const h = now.getHours();
  return isAdventTime(now) && h >= PUNSCH_HOURS[0] && h < PUNSCH_HOURS[1];
}

export type PunschResult = { ok: true; lines: readonly string[] } | { ok: false; reason: 'zu' | 'geld' };

/** Ein warmes Getränk am Punschstand (wird gleich getrunken) */
export function buyDrink(session: Session, drinkId: string): PunschResult {
  const data = session.data;
  const drink = PUNSCH_DRINKS.find((d) => d.id === drinkId);
  if (!data || !drink) return { ok: false, reason: 'zu' };
  if (!punschOpen(session.clock())) return { ok: false, reason: 'zu' };
  if (data.money < drink.price) return { ok: false, reason: 'geld' };
  data.money -= drink.price;
  data.world.dates.punsch = session.today();
  session.bus.emit('sfx', 'muenzen');
  session.changed();
  session.save();
  return { ok: true, lines: drink.lines };
}
