/**
 * Besuch bei Lina auf Einladung (Feature Discovery C). Regeln ohne Darstellung:
 * einladen → sobald Lina zu Hause ist, kommt der Gast → ein paar warme Sätze zum Haus → beim Gehen ein Gruß.
 * Gemerkt wird alles in `world.dates` (kein neues Spielstand-Format): `einladung:<id>` (Tag der Einladung),
 * `besuch:<id>` (Tag des letzten Besuchs), `besuche:<id>` (Anzahl).
 */
import { npcHearts, hasMovedIn } from './gameplay';
import { memoryTags } from './erinnerungen';
import { HOUSE_MEMORY_TAGS, VISIT_HOURS, VISITORS, VISITS } from '../data/besuch';
import { MEMORIES } from '../data/erinnerungen';
import { NPC_BY_ID } from '../data/npcs';
import type { Session } from './session';

const inviteKey = (id: string) => `einladung:${id}`;
const lastKey = (id: string) => `besuch:${id}`;
const countKey = (id: string) => `besuche:${id}`;

export function isInvited(session: Session, npcId: string): boolean {
  return !!session.data?.world.dates[inviteKey(npcId)];
}

/** Anzahl bisheriger Besuche */
export function visitCount(session: Session, npcId: string): number {
  return Number(session.data?.world.dates[countKey(npcId)] ?? '0') || 0;
}

/** Darf Lina diese Person jetzt einladen? (Bewohner da, mindestens ein Herz, noch keine offene Einladung, heute noch kein Besuch) */
export function canInvite(session: Session, npcId: string): boolean {
  const data = session.data;
  if (!data || !VISITORS.includes(npcId) || !hasMovedIn(session, npcId)) return false;
  if (npcHearts(session, npcId) < 1) return false;
  if (isInvited(session, npcId)) return false;
  return data.world.dates[lastKey(npcId)] !== session.today();
}

/** Lina lädt ein. Gibt die Antwort zurück. */
export function inviteNpc(session: Session, npcId: string): string[] {
  const data = session.data;
  const v = VISITS[npcId];
  if (!data || !v) return [];
  if (isInvited(session, npcId)) return [...v.waiting];
  data.world.dates[inviteKey(npcId)] = session.today();
  session.changed();
  session.save();
  return [...v.invited];
}

/**
 * Wer steht jetzt vor der Tür? Nur, wenn Lina zu Hause ist (das prüft die Welt), tagsüber und der Gast nicht verreist ist.
 * Zuerst kommt, wer am längsten eingeladen ist.
 */
export function visitDue(session: Session): string | null {
  const data = session.data;
  if (!data) return null;
  const h = session.clock().getHours();
  if (h < VISIT_HOURS[0] || h >= VISIT_HOURS[1]) return null;
  const today = session.today();
  let best: { id: string; day: string } | null = null;
  for (const id of VISITORS) {
    const day = data.world.dates[inviteKey(id)];
    if (!day || !hasMovedIn(session, id)) continue;
    if (NPC_BY_ID[id]?.away?.(today)) continue;
    if (!best || day < best.day) best = { id, day };
  }
  return best?.id ?? null;
}

/** Sätze zu dem, was wirklich im Haus steht – abwechselnd, zuletzt allgemeine */
export function visitComments(session: Session, npcId: string): string[][] {
  const tags = new Set(memoryTags(session).filter((t) => HOUSE_MEMORY_TAGS.includes(t) || t.startsWith('stil-')));
  const city = '';
  const fromHouse = MEMORIES.filter((m) => m.npc === npcId && tags.has(m.tag)).map((m) => (typeof m.text === 'string' ? [m.text] : [...m.text]).map((l) => l.replaceAll('{stadt}', city)));
  const v = VISITS[npcId];
  return [...fromHouse, ...(v ? v.generic.map((g) => [...g]) : [])];
}

/** Der Satz, den der Gast beim n-ten Ansprechen sagt (der Reihe nach, am Ende von vorn) */
export function visitLine(session: Session, npcId: string, n: number): string[] {
  const all = visitComments(session, npcId);
  if (all.length === 0) return [];
  return all[n % all.length];
}

/** Begrüßung beim Eintreten: Begrüßung plus der erste passende Satz zum Haus */
export function arrivalLines(session: Session, npcId: string): string[] {
  const v = VISITS[npcId];
  if (!v) return [];
  const first = visitLine(session, npcId, visitCount(session, npcId));
  return [...v.arrive, ...first];
}

/** Besuch zu Ende (Lina hat das Haus verlassen): Einladung ist erfüllt. Gibt den Abschiedsgruß zurück. */
export function finishVisit(session: Session, npcId: string): string {
  const data = session.data;
  const v = VISITS[npcId];
  if (!data || !v) return '';
  delete data.world.dates[inviteKey(npcId)];
  data.world.dates[lastKey(npcId)] = session.today();
  data.world.dates[countKey(npcId)] = String(visitCount(session, npcId) + 1);
  session.changed();
  session.save();
  return v.bye;
}

