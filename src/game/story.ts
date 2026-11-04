/**
 * Die Rahmenhandlung: Wer zieht wann ins Dorf? Jeder Einzug kündigt sich
 * per Brief an und passiert am nächsten Tag.
 */
import { daysBetween } from '../core/daily';
import { NPC_BY_ID } from '../data/npcs';
import { OLAF_ANNOUNCEMENT } from '../data/npcs/olaf';
import { OLI_ANNOUNCEMENT } from '../data/npcs/oli';
import { JENS_ANNOUNCEMENT, jensTravels, travelPostcard } from '../data/npcs/jens';
import { LARS_ANNOUNCEMENT } from '../data/npcs/lars';
import { THALIA_ANNOUNCEMENT } from '../data/npcs/thalia';
import { sendLetter } from './gameplay';
import type { Session } from './session';

export type StoryEvent = 'olaf-angekuendigt' | 'olaf-eingezogen' | 'oli-angekuendigt' | 'oli-eingezogen' | 'jens-angekuendigt' | 'jens-eingezogen' | 'jens-reist' | 'lars-angekuendigt' | 'lars-eingezogen' | 'thalia-angekuendigt' | 'thalia-eingezogen';

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
  // Oli: zwei Tage nach Olafs Einzug kommt sein Brief, am Tag darauf zieht er bei Lina ein
  if (f.olafBegruesst && !f.oliAngekuendigt) {
    const olafLetter = data.mail.letters.find((l) => l.id === 'olaf-einzug');
    if (!olafLetter || daysBetween(olafLetter.day, today) >= 3) {
      const oli = NPC_BY_ID.oli;
      if (oli) sendLetter(session, oli, OLI_ANNOUNCEMENT, 'oli-einzug');
      f.oliAngekuendigt = true;
      out.push('oli-angekuendigt');
    }
  }
  if (f.oliAngekuendigt && !f.oliEingezogen) {
    const letter = data.mail.letters.find((l) => l.id === 'oli-einzug');
    if (!letter || daysBetween(letter.day, today) >= 1) {
      f.oliEingezogen = true;
      out.push('oli-eingezogen');
    }
  }
  // Jens: drei Tage nach Olis Einzug kommt sein Brief, am Tag darauf eröffnet er sein Bistro
  if (f.oliBegruesst && !f.jensAngekuendigt) {
    const oliLetter = data.mail.letters.find((l) => l.id === 'oli-einzug');
    if (!oliLetter || daysBetween(oliLetter.day, today) >= 4) {
      const jens = NPC_BY_ID.jens;
      if (jens) sendLetter(session, jens, JENS_ANNOUNCEMENT, 'jens-einzug');
      f.jensAngekuendigt = true;
      out.push('jens-angekuendigt');
    }
  }
  if (f.jensAngekuendigt && !f.jensEingezogen) {
    const letter = data.mail.letters.find((l) => l.id === 'jens-einzug');
    if (!letter || daysBetween(letter.day, today) >= 1) {
      f.jensEingezogen = true;
      out.push('jens-eingezogen');
    }
  }
  // Lars: vier Tage nach Jens kommt sein Brief, am Tag darauf eröffnet er seine Praxis
  if (f.jensBegruesst && !f.larsAngekuendigt) {
    const jensLetter = data.mail.letters.find((l) => l.id === 'jens-einzug');
    if (!jensLetter || daysBetween(jensLetter.day, today) >= 4) {
      const lars = NPC_BY_ID.lars;
      if (lars) sendLetter(session, lars, LARS_ANNOUNCEMENT, 'lars-einzug');
      f.larsAngekuendigt = true;
      out.push('lars-angekuendigt');
    }
  }
  if (f.larsAngekuendigt && !f.larsEingezogen) {
    const letter = data.mail.letters.find((l) => l.id === 'lars-einzug');
    if (!letter || daysBetween(letter.day, today) >= 1) {
      f.larsEingezogen = true;
      out.push('lars-eingezogen');
    }
  }
  // Thalia: vier Tage nach Lars kommt ihr Brief, am Tag darauf zieht sie ein
  if (f.larsBegruesst && !f.thaliaAngekuendigt) {
    const larsLetter = data.mail.letters.find((l) => l.id === 'lars-einzug');
    if (!larsLetter || daysBetween(larsLetter.day, today) >= 4) {
      const thalia = NPC_BY_ID.thalia;
      if (thalia) sendLetter(session, thalia, THALIA_ANNOUNCEMENT, 'thalia-einzug');
      f.thaliaAngekuendigt = true;
      out.push('thalia-angekuendigt');
    }
  }
  if (f.thaliaAngekuendigt && !f.thaliaEingezogen) {
    const letter = data.mail.letters.find((l) => l.id === 'thalia-einzug');
    if (!letter || daysBetween(letter.day, today) >= 1) {
      f.thaliaEingezogen = true;
      out.push('thalia-eingezogen');
    }
  }
  // Jens auf Reisen: Postkarte mit Andenken (einmal pro Reisetag)
  if (f.jensBegruesst && jensTravels(today) && data.world.dates['jens-reise'] !== today) {
    const jens = NPC_BY_ID.jens;
    const n = Number(data.world.dates['jens-reisen'] ?? '0') || 0;
    if (jens) sendLetter(session, jens, travelPostcard(today, n), `jens-reise-${today}`);
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
