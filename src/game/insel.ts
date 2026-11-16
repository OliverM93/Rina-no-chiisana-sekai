/**
 * Die versteckte Insel (Texte & Belohnung: `data/insel.ts`): Sind bei **allen** Bewohnern alle fünf Herzen voll,
 * liegt ein Boot am Dorfstrand. Auf der Insel ist immer Sonne; der erste Besuch ist eine Überraschungsparty.
 */
import { heartsFor, MAX_HEARTS } from '../core/friendship';
import { INSEL_Y0 } from '../data/maps/insel';
import { INSEL_OFFEN_FLAG } from '../data/insel';
import { NPCS } from '../data/npcs';
import { hasMovedIn, npcState } from './gameplay';
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
