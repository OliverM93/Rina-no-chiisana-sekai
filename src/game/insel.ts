/**
 * Die versteckte Insel (Texte & Belohnung: `data/insel.ts`): Sind bei **allen** Bewohnern alle fünf Herzen voll,
 * liegt ein Boot am Dorfstrand. Auf der Insel ist immer Sonne; der erste Besuch ist eine Überraschungsparty.
 */
import { heartsFor, MAX_HEARTS } from '../core/friendship';
import { INSEL_Y0 } from '../data/maps/insel';
import { hashString } from '../core/rng';
import { terrainAt } from '../core/worldmap';
import { FLASCHEN_BRIEFE, FLASCHENPOST_GEFUNDEN, FLASCHENPOST_LEER, INSEL_FEST_FLAG, INSEL_OFFEN_FLAG, KOKOS_CHANCE, KOKOS_GEFUNDEN, KOKOS_LEER, KOKOS_SCHON, LUAU_LINES } from '../data/insel';
import { NPC_BY_ID, NPCS } from '../data/npcs';
import { giveItem, hasMovedIn, npcState, sendLetter } from './gameplay';
import type { Session } from './session';

/** Sind bei allen Bewohnern alle Herzen voll? (alle müssen im Dorf wohnen) */
export function alleHerzen(session: Session): boolean {
  if (!session.data) return false;
  return NPCS.every((n) => hasMovedIn(session, n.id) && heartsFor(npcState(session, n.id).points) >= MAX_HEARTS);
}

/** Ist die Kachel auf der Insel? */
export function istInsel(y: number): boolean {
  return y >= INSEL_Y0;
}

/** Setzt das Flag (nie wieder zurück), sobald alle Herzen voll sind. Gibt true zurück, wenn das Boot jetzt neu aufgetaucht ist. */
export function syncInsel(session: Session): boolean {
  const data = session.data;
  if (!data || data.flags[INSEL_OFFEN_FLAG] || !alleHerzen(session)) return false;
  data.flags[INSEL_OFFEN_FLAG] = true;
  data.world.dates['insel:boot'] = session.today();
  return true;
}

/**
 * Eine Palme schütteln: jede Palme einmal am Tag, und nicht jede hat etwas (reproduzierbar je Tag und Palme).
 * Gibt den Text und – falls etwas gefallen ist – den Gegenstand zurück (er liegt schon in der Tasche, oder `left > 0`).
 */
export function palmeSchuetteln(session: Session, palmeId: string): { text: string; itemId?: string; left?: number } {
  const data = session.data;
  if (!data) return { text: '' };
  const key = `palme:${palmeId}`;
  const day = session.today();
  const pick = (list: readonly string[], salt: string) => list[hashString(`${day}:${palmeId}:${salt}`) % list.length];
  if (data.world.dates[key] === day) return { text: pick(KOKOS_SCHON, 'schon') };
  data.world.dates[key] = day;
  if (hashString(`kokos:${day}:${palmeId}`) % 100 >= KOKOS_CHANCE) {
    session.changed();
    return { text: pick(KOKOS_LEER, 'leer') };
  }
  const left = giveItem(session, 'kokosnuss', 1, false);
  session.changed();
  session.save();
  return { text: pick(KOKOS_GEFUNDEN, 'fund'), itemId: 'kokosnuss', left };
}

let inselStrandCache: Array<{ x: number; y: number }> | null = null;

/** Sandkacheln der Insel, auf denen täglich Muscheln liegen */
export function inselStrandTiles(session: Session): Array<{ x: number; y: number }> {
  if (inselStrandCache) return inselStrandCache;
  const map = session.map;
  const out: Array<{ x: number; y: number }> = [];
  for (let y = INSEL_Y0; y < map.height; y++) for (let x = 0; x < map.width; x++) if (terrainAt(map, x, y) === 'sand' && !map.staticBlocked[y * map.width + x]) out.push({ x, y });
  inselStrandCache = out;
  return out;
}

/** Hält das Datum eines Insel-Moments fest (Album); nur beim ersten Mal. Gibt true zurück, wenn es neu war. */
export function inselMoment(session: Session, key: 'schildkroete' | 'delfine' | 'flaschenpost' | 'luau'): boolean {
  const dates = session.data?.world.dates;
  if (!dates || dates[`insel:${key}`]) return false;
  dates[`insel:${key}`] = session.today();
  return true;
}

/**
 * Eine Flaschenpost öffnen: der nächste noch nicht erhaltene Brief (Reihenfolge je Flasche gemischt) kommt in den
 * Briefkasten. Sind alle Briefe da, steckt nur Sand (und ein Seestern) darin. Gibt den Hinweistext zurück.
 */
export function flaschenpostOeffnen(session: Session, bottleId: string): string {
  const data = session.data;
  if (!data) return '';
  const sent = (id: string) => data.mail.letters.some((l) => l.id === `flaschenpost-${id}`);
  const start = hashString(bottleId) % FLASCHEN_BRIEFE.length;
  let pick: (typeof FLASCHEN_BRIEFE)[number] | null = null;
  for (let i = 0; i < FLASCHEN_BRIEFE.length && !pick; i++) {
    const b = FLASCHEN_BRIEFE[(start + i) % FLASCHEN_BRIEFE.length];
    // nur von Bewohnern, die schon im Dorf wohnen (nach dem Fest sind es alle)
    if (!sent(b.id) && hasMovedIn(session, b.npc)) pick = b;
  }
  inselMoment(session, 'flaschenpost');
  if (!pick) {
    giveItem(session, 'seestern', 1);
    return FLASCHENPOST_LEER;
  }
  const npc = NPC_BY_ID[pick.npc];
  sendLetter(session, npc, { id: pick.id, subject: pick.subject, body: pick.body, gift: pick.gift }, `flaschenpost-${pick.id}`);
  return FLASCHENPOST_GEFUNDEN;
}

/** Abends nach der Party gibt es ab und zu (etwa jeden fünften Tag) ein kleines Luau am Inselstrand – nie Pflicht */
export function luauTonight(session: Session): boolean {
  const data = session.data;
  if (!data || !data.flags[INSEL_FEST_FLAG]) return false;
  const h = session.clock().getHours();
  if (h < 18 || h >= 23) return false;
  return hashString(`${session.today()}:luau`) % 5 === 0;
}

/** Drei Bewohner, die heute beim Luau sitzen (reproduzierbar je Tag) */
export function luauGuests(session: Session): string[] {
  const day = session.today();
  return NPCS.filter((n) => hasMovedIn(session, n.id))
    .map((n) => ({ id: n.id, k: hashString(`${day}:luau:${n.id}`) }))
    .sort((a, b) => a.k - b.k)
    .slice(0, 3)
    .map((x) => x.id);
}

/** Was ein Luau-Gast sagt (wechselt je Tag) */
export function luauLine(session: Session, npcId: string): string[] {
  const lines = LUAU_LINES[npcId];
  if (!lines?.length) return ['Schön, dass du da bist. Setz dich zu uns.'];
  return [...lines[hashString(`${session.today()}:${npcId}:luau-line`) % lines.length]];
}
