/**
 * Die Rahmenhandlung: Wer zieht wann ins Dorf? Jeder Einzug hat einen Meilenstein
 * (`data/progress.ts`), kündigt sich dann per Brief an und passiert nach kurzer Spielzeit.
 * Tages- und jahreszeitabhängiges (Feste, Jens' Reisen, Partys …) läuft weiter nach echter Zeit.
 */
import { missingNeeds, waitOver } from '../core/progress';
import { MILESTONES } from '../data/progress';
import { progressState } from './progress';
import { NPC_BY_ID } from '../data/npcs';
import { OLAF_ANNOUNCEMENT } from '../data/npcs/olaf';
import { OLI_ANNOUNCEMENT } from '../data/npcs/oli';
import { JENS_ANNOUNCEMENT, jensTravels, travelMugLetter, travelPostcard } from '../data/npcs/jens';
import { LARS_ANNOUNCEMENT } from '../data/npcs/lars';
import { THALIA_ANNOUNCEMENT } from '../data/npcs/thalia';
import { sendLetter } from './gameplay';
import type { Session } from './session';

export type StoryEvent = 'olaf-angekuendigt' | 'olaf-eingezogen' | 'oli-angekuendigt' | 'oli-eingezogen' | 'jens-angekuendigt' | 'jens-eingezogen' | 'jens-reist' | 'lars-angekuendigt' | 'lars-eingezogen' | 'thalia-angekuendigt' | 'thalia-eingezogen';

/** Brief-IDs der Ankündigungen */
const ANNOUNCEMENTS = {
  olaf: { letter: OLAF_ANNOUNCEMENT, id: 'olaf-einzug' },
  oli: { letter: OLI_ANNOUNCEMENT, id: 'oli-einzug' },
  jens: { letter: JENS_ANNOUNCEMENT, id: 'jens-einzug' },
  lars: { letter: LARS_ANNOUNCEMENT, id: 'lars-einzug' },
  thalia: { letter: THALIA_ANNOUNCEMENT, id: 'thalia-einzug' },
} as const;

/**
 * Regelmäßig aufrufen (beim Laden, alle paar Sekunden, bei neuem Tag). Einzüge hängen an
 * Meilensteinen (was Lina getan hat) und kurzer Spielzeit – nicht am Kalender.
 * Gibt neue Ereignisse zurück.
 */
export function checkStory(session: Session): StoryEvent[] {
  const data = session.data;
  if (!data) return [];
  const out: StoryEvent[] = [];
  const today = session.today();
  const f = data.flags;
  const st = progressState(session);
  const now = session.playTime();
  for (const m of MILESTONES) {
    const a = ANNOUNCEMENTS[m.npc];
    // Meilenstein erreicht → Ankündigungsbrief
    if (st && f[m.after] && !f[`${m.npc}Angekuendigt`] && missingNeeds(m.needs, st).length === 0) {
      const npc = NPC_BY_ID[m.npc];
      if (npc) sendLetter(session, npc, a.letter, a.id);
      f[`${m.npc}Angekuendigt`] = true;
      data.story[a.id] = now;
      out.push(`${m.npc}-angekuendigt` as StoryEvent);
    }
    // nach kurzer Spielzeit → Einzug (alte Spielstände ohne Zeitstempel: sofort)
    if (f[`${m.npc}Angekuendigt`] && !f[`${m.npc}Eingezogen`] && waitOver(data.story[a.id], now)) {
      f[`${m.npc}Eingezogen`] = true;
      out.push(`${m.npc}-eingezogen` as StoryEvent);
    }
  }
  // Jens auf Reisen: Postkarte mit Andenken (einmal pro Reisetag)
  if (f.jensBegruesst && jensTravels(today) && data.world.dates['jens-reise'] !== today) {
    const jens = NPC_BY_ID.jens;
    const n = Number(data.world.dates['jens-reisen'] ?? '0') || 0;
    if (jens) {
      sendLetter(session, jens, travelPostcard(today, n), `jens-reise-${today}`);
      const mug = travelMugLetter(today, n);
      if (mug) sendLetter(session, jens, mug, `jens-tasse-${today}`);
    }
    data.world.dates['jens-reise'] = today;
    data.world.dates['jens-reisen'] = String(n + 1);
    out.push('jens-reist');
  }
  if (out.length > 0) {
    session.changed();
    session.save();
  }
  return out;
}
