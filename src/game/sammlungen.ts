/**
 * Vollständige Sammlungen: Wer alle Fische, Krabbeltiere, Funde, Blumenfarben oder Tassen hat, bekommt einen
 * Brief mit einer Urkunde (`data/sammlungen.ts`). Kein Erfolge-Menü – nur eine kleine Freude von jemandem,
 * der sich dafür interessiert. Der Brief kommt erst, wenn der Absender im Dorf wohnt.
 */
import { FINDS } from '../data/fossils';
import { GARDEN_FLOWERS } from '../data/items';
import { NPC_BY_ID } from '../data/npcs';
import { SAMMLUNGEN, type SammlungDef, urkundeId } from '../data/sammlungen';
import { FISH, INSECTS } from '../data/species';
import { TASSEN } from '../data/tassen';
import { hasMovedIn, sendLetter } from './gameplay';
import { ownsAnywhere } from './nature';
import type { Session } from './session';

export interface Fortschritt {
  have: number;
  total: number;
}

/** Wie weit ist eine Sammlung? */
export function sammlungFortschritt(session: Session, id: SammlungDef['id']): Fortschritt {
  const c = session.data?.collection ?? {};
  const count = (ids: readonly string[]) => ({ have: ids.filter((x) => !!c[x]).length, total: ids.length });
  switch (id) {
    case 'fische':
      return count(FISH.map((f) => f.id));
    case 'insekten':
      return count(INSECTS.map((i) => i.id));
    case 'funde':
      return count(FINDS.map((f) => f.id));
    case 'blumen':
      return count(GARDEN_FLOWERS.filter((g) => g.colorKey).map((g) => g.flower));
    case 'tassen':
      return { have: TASSEN.filter((t) => ownsAnywhere(session, t.id)).length, total: TASSEN.length };
  }
}

const doneKey = (id: string) => `sammlung:${id}`;

/**
 * Schickt für jede neu vollständige Sammlung einen Brief mit Urkunde (jeden nur einmal).
 * Gibt die Titel der Sammlungen zurück, die gerade fertig wurden.
 */
export function checkSammlungen(session: Session): string[] {
  const data = session.data;
  if (!data) return [];
  const done: string[] = [];
  for (const s of SAMMLUNGEN) {
    if (data.world.dates[doneKey(s.id)]) continue;
    const p = sammlungFortschritt(session, s.id);
    if (p.total === 0 || p.have < p.total) continue;
    const npc = NPC_BY_ID[s.npc];
    if (!npc || !hasMovedIn(session, s.npc)) continue; // wartet, bis der Absender da ist
    data.world.dates[doneKey(s.id)] = session.today();
    sendLetter(session, npc, { id: `sammlung-${s.id}`, subject: s.subject, body: s.body, gift: { itemId: urkundeId(s.id), count: 1 } }, `sammlung-${s.id}`);
    done.push(s.title);
  }
  if (done.length > 0) {
    session.changed();
    session.bus.emit('toast', { text: `🏆 Sammlung komplett: ${done.join(', ')}!` });
  }
  return done;
}
