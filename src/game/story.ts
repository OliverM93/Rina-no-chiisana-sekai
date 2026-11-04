/**
 * Die Rahmenhandlung: Wer zieht wann ins Dorf? Jeder Einzug kündigt sich
 * per Brief an und passiert am nächsten Tag.
 */
import { daysBetween } from '../core/daily';
import { NPC_BY_ID } from '../data/npcs';
import { OLAF_ANNOUNCEMENT } from '../data/npcs/olaf';
import { sendLetter } from './gameplay';
import type { Session } from './session';

export type StoryEvent = 'olaf-angekuendigt' | 'olaf-eingezogen';

/** Einmal beim Laden und bei jedem neuen Tag aufrufen. Gibt neue Ereignisse zurück. */
export function checkStory(session: Session): StoryEvent[] {
  const data = session.data;
  if (!data) return [];
  const out: StoryEvent[] = [];
  const today = session.today();
  const f = data.flags;
  // Olaf & Christin: Brief am ersten Tag nach Linas Einzug, Einzug am Tag darauf
  if (f.giselaWelcomed && !f.olafAngekuendigt && daysBetween(data.createdAt.slice(0, 10), today) >= 1) {
    const olaf = NPC_BY_ID.olaf;
    if (olaf) sendLetter(session, olaf, OLAF_ANNOUNCEMENT, 'olaf-einzug');
    f.olafAngekuendigt = true;
    out.push('olaf-angekuendigt');
  }
  if (f.olafAngekuendigt && !f.olafEingezogen) {
    const letter = data.mail.letters.find((l) => l.id === 'olaf-einzug');
    if (!letter || daysBetween(letter.day, today) >= 1) {
      f.olafEingezogen = true;
      out.push('olaf-eingezogen');
    }
  }
  if (out.length > 0) {
    session.changed();
    session.save();
  }
  return out;
}
