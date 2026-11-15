/**
 * Sträuße als besonderes Geschenk und „Lust auf einen Strauß“ (Texte & Zahlen: `data/straussLust.ts`).
 * Gemerkt in `world.dates` (kein neues Spielstand-Format): `strauss-lust:<id>` = Woche, in der der Wunsch erfüllt wurde,
 * `strauss-gesagt:<id>` = Tag, an dem er erzählt wurde.
 */
import { hashString } from '../core/rng';
import type { GiftReaction } from '../core/friendship';
import { BOUQUET_LOVED_BONUS, BOUQUET_WISH_BONUS, LUST_EVERY_NTH_WEEK, STRAUSS_LINES } from '../data/straussLust';
import { BOUQUETS } from '../data/straeusse';
import { NPC_BY_ID } from '../data/npcs';
import { hasMovedIn } from './gameplay';
import type { Session } from './session';

/** Wochen-Kennung (Montag der aktuellen Woche, JJJJ-MM-TT) */
export function weekKey(date: Date): string {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const bouquetName = (id: string) => BOUQUETS.find((b) => b.id === id)?.name ?? id;

/** Welchen Strauß hätte die Person diese Woche gern? (null = keine Lust diese Woche) */
export function wantedBouquet(session: Session, npcId: string): string | null {
  const npc = NPC_BY_ID[npcId];
  if (!npc || !STRAUSS_LINES[npcId] || !hasMovedIn(session, npcId)) return null;
  const week = weekKey(session.clock());
  if (hashString(`strauss-lust:${week}:${npcId}`) % LUST_EVERY_NTH_WEEK !== 0) return null;
  // nur Sträuße ohne besonderes Rezept (die kennt Lina von Anfang an), die die Person liebt – sonst mag
  const plain = BOUQUETS.filter((b) => !b.fund).map((b) => b.id);
  const loved = npc.preferences.loves.filter((i) => plain.includes(i));
  const pool = loved.length > 0 ? loved : npc.preferences.likes.filter((i) => plain.includes(i));
  if (pool.length === 0) return null;
  const pick = pool[hashString(`strauss-wahl:${week}:${npcId}`) % pool.length];
  return session.data?.world.dates[`strauss-lust:${npcId}`] === week ? null : pick;
}

/** Zeilen, in denen die Person ihre Lust auf einen Strauß erwähnt (höchstens einmal am Tag) */
export function straussLustLines(session: Session, npcId: string): string[] {
  const data = session.data;
  const want = wantedBouquet(session, npcId);
  if (!data || !want) return [];
  const key = `strauss-gesagt:${npcId}`;
  if (data.world.dates[key] === session.today()) return [];
  data.world.dates[key] = session.today();
  return STRAUSS_LINES[npcId].lust.map((l) => l.replaceAll('{strauss}', bouquetName(want)));
}

export interface BouquetBonus {
  points: number;
  lines: string[];
}

/** Zusatz für ein Strauß-Geschenk (nur beim ersten Geschenk des Tages; sonst nichts) */
export function bouquetBonus(session: Session, npcId: string, itemId: string, reaction: GiftReaction, repeatToday: boolean): BouquetBonus {
  const none = { points: 0, lines: [] };
  const data = session.data;
  const t = STRAUSS_LINES[npcId];
  if (!data || !t || repeatToday || !BOUQUETS.some((b) => b.id === itemId)) return none;
  const wished = wantedBouquet(session, npcId) === itemId;
  if (reaction !== 'liebt' && !wished) return none;
  let points = reaction === 'liebt' ? BOUQUET_LOVED_BONUS : 0;
  let lines: string[];
  if (wished) {
    points += BOUQUET_WISH_BONUS;
    data.world.dates[`strauss-lust:${npcId}`] = weekKey(session.clock());
    lines = t.lustThanks.map((l) => l.replaceAll('{strauss}', bouquetName(itemId)));
  } else lines = [...t.thanks];
  return { points, lines };
}
