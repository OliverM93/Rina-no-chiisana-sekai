/**
 * Die versteckte Insel (Texte & Belohnung: `data/insel.ts`): Sind bei **allen** Bewohnern alle fünf Herzen voll,
 * liegt ein Boot am Dorfstrand. Auf der Insel ist immer Sonne; der erste Besuch ist eine Überraschungsparty.
 */
import { heartsFor, MAX_HEARTS } from '../core/friendship';
import { INSEL_Y0 } from '../data/maps/insel';
import { hashString } from '../core/rng';
import { terrainAt } from '../core/worldmap';
import { INSEL_OFFEN_FLAG, KOKOS_CHANCE, KOKOS_GEFUNDEN, KOKOS_LEER, KOKOS_SCHON } from '../data/insel';
import { NPCS } from '../data/npcs';
import { giveItem, hasMovedIn, npcState } from './gameplay';
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
