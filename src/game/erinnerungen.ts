/**
 * Erinnerungen: Welche Dinge hat Lina im Spiel erlebt (Haus, Sammelbuch, Garten …)? Daraus entstehen Tags für
 * die Dialoge (`data/erinnerungen.ts`). Der Bewohner erwähnt neue Erinnerungen einmal von sich aus.
 */
import { daysBetween } from '../core/daily';
import type { DialogueLine } from '../core/dialogue';
import { FURNITURE_BY_ITEM } from '../data/furniture';
import { GARDEN_FLOWER } from '../data/items';
import { FISH_BY_ID, INSECT_BY_ID } from '../data/species';
import { MEMORIES, type Memory } from '../data/erinnerungen';
import { TRAVELS } from '../data/npcs/jens';
import type { Session } from './session';

const MEMORY_KEY = (id: string) => `erinnerung:${id}`;

/** Wie viele Sammelbuch-Arten (Fische & Insekten) hat Lina? */
function speciesCount(session: Session): number {
  const c = session.data?.collection ?? {};
  return Object.keys(c).filter((id) => id in FISH_BY_ID || id in INSECT_BY_ID).length;
}

/** Wohin ging Jens' letzte Reise? (null, solange er noch nicht verreist war) */
export function lastTravelCity(session: Session): string | null {
  const n = Number(session.data?.world.dates['jens-reisen'] ?? '0') || 0;
  return n > 0 ? TRAVELS[(n - 1) % TRAVELS.length].city : null;
}

/** Alle Erinnerungs-Tags, die gerade zutreffen */
export function memoryTags(session: Session): string[] {
  const data = session.data;
  if (!data) return [];
  const tags: string[] = [];
  const stage = data.house.stage;
  if (stage >= 2) tags.push('haus-anbau');
  if (stage >= 3) tags.push('haus-dach');
  if (stage >= 4) tags.push('haus-kueche');
  if (stage >= 6) tags.push('haus-keller');
  const n = speciesCount(session);
  for (const k of [10, 20, 30]) if (n >= k) tags.push(`buch-${k}`);
  const items = [...data.house.rooms.flatMap((r) => r.items), ...data.yard.items];
  if (items.some((i) => FURNITURE_BY_ITEM[i.itemId]?.def.coop === 'huhn')) tags.push('huehner');
  if (items.some((i) => FURNITURE_BY_ITEM[i.itemId]?.def.greenhouse)) tags.push('gewaechshaus');
  if (data.house.rooms.flatMap((r) => r.items).filter((i) => i.itemId.startsWith('tasse-')).length >= 6) tags.push('tassen-viele');
  if (data.bank.savings > 0) tags.push('sparbuch');
  if (Object.keys(data.collection).some((id) => GARDEN_FLOWER[id]?.crossOnly && id.includes('schwarz'))) tags.push('schwarze-blume');
  if (lastTravelCity(session)) tags.push('jens-reise');
  if (data.flags['wunsch-thalia-matteo']) tags.push('matteo');
  if (data.flags['wunsch-oli-kino']) tags.push('kino');
  if (data.flags['wunsch-oli-bandshirt']) tags.push('tourshirt');
  const days = daysBetween(data.createdAt.slice(0, 10), session.today());
  if (days >= 30) tags.push('monat-1');
  if (days >= 365) tags.push('jahr-1');
  return tags;
}

/** Zeilen eines Bewohners als Dialogzeilen (kommen beim Plaudern gelegentlich wieder dran) */
export function memoryLinesFor(session: Session, npcId: string): DialogueLine[] {
  const city = lastTravelCity(session) ?? '';
  return MEMORIES.filter((m) => m.npc === npcId).map((m) => ({ text: fillCity(m.text, city), when: { tags: [m.tag] } }));
}

function fillCity(text: string | readonly string[], city: string): string | readonly string[] {
  const f = (s: string) => s.replaceAll('{stadt}', city);
  return typeof text === 'string' ? f(text) : text.map(f);
}

/**
 * Eine neue Erinnerung, die der Bewohner noch nie erwähnt hat, einmal erzählen (höchstens eine pro Gespräch).
 * Gibt die Zeilen zurück und merkt sich, dass es erzählt wurde.
 */
export function takeMemory(session: Session, npcId: string): string[] {
  const data = session.data;
  if (!data) return [];
  const tags = new Set(memoryTags(session));
  const city = lastTravelCity(session) ?? '';
  const m: Memory | undefined = MEMORIES.find((x) => x.npc === npcId && tags.has(x.tag) && !data.world.dates[MEMORY_KEY(x.id)]);
  if (!m) return [];
  data.world.dates[MEMORY_KEY(m.id)] = session.today();
  session.changed();
  const lines = fillCity(m.text, city);
  return typeof lines === 'string' ? [lines] : [...lines];
}
