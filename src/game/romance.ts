/**
 * Gemeinsame Momente mit Oli: Picknick am Tag, Sterne gucken am Abend.
 * Freiwillig, einmal am Tag je Moment, bringt Freundschaft (und Herzen).
 */
import { heartsFor } from '../core/friendship';
import { hashString } from '../core/rng';
import { KISS_LINES, PICNIC_LINES, STARS_LINES } from '../data/npcs/oli';
import { daysBetween } from '../core/daily';
import { getDayPhase, getSeason } from '../core/time';
import { BENCH_LINES, OLI_ANNIVERSARIES, STAGE_SCENES, type StageScene } from '../data/oliStufen';
import { wishFlag } from '../data/wishes';
import { addFriendship, npcState, sendLetter } from './gameplay';
import { NPC_BY_ID } from '../data/npcs';
import { currentWeather, isRaining } from './nature';
import type { Session } from './session';

export type DateKind = 'picknick' | 'sterne' | 'herzbank';

const DATE_POINTS = 24;
/** Die Herzbank bringt Inhalt statt vieler Punkte */
const BENCH_POINTS = 8;

function hearts(session: Session) {
  return heartsFor(npcState(session, 'oli').points);
}

/** Geht dieser Moment gerade? (Uhrzeit, Wetter, heute noch nicht) */
export function canDate(session: Session, kind: DateKind): boolean {
  const data = session.data;
  if (!data?.flags.oliEingezogen || data.world.dates[kind] === session.today()) return false;
  const h = session.clock().getHours();
  if (isRaining(session)) return false;
  if (kind === 'herzbank') return !!data.flags[wishFlag('oli-bank')] && h >= 8 && h < 23;
  if (kind === 'picknick') return h >= 9 && h < 18;
  return (h >= 21 || h < 3) && currentWeather(session).clouds < 0.6 && hearts(session) >= 1;
}

/** Den Moment erleben: merkt sich den Tag, gibt Freundschaft, liefert die Zeilen */
export function haveDate(session: Session, kind: DateKind): string[] {
  const data = session.data;
  if (!data) return [];
  data.world.dates[kind] = session.today();
  if (kind === 'herzbank') {
    const set = BENCH_LINES[getSeason(session.clock())] ?? BENCH_LINES.fruehling;
    const phase = getDayPhase(session.clock());
    const mood = phase === 'abend' || phase === 'abenddaemmerung' || phase === 'nacht' ? 'abend' : 'tag';
    const lines = [...set[mood]];
    lines.push(...addFriendship(session, 'oli', BENCH_POINTS));
    session.save();
    return lines;
  }
  const pool = kind === 'picknick' ? PICNIC_LINES : STARS_LINES;
  const lines = [...pool[hashString(`${session.today()}:${kind}`) % pool.length]];
  lines.push(...addFriendship(session, 'oli', DATE_POINTS));
  session.save();
  return lines;
}

/** Küsschen geben: so oft man möchte – das erste am Tag zählt für die Freundschaft */
export const KISS_POINTS = 6;

export function canKiss(session: Session): boolean {
  return !!session.data?.flags.oliEingezogen;
}

export function giveKiss(session: Session, n = 0): string[] {
  const data = session.data;
  if (!data) return [];
  const lines = [...KISS_LINES[(hashString(`${session.today()}:kuss`) + n) % KISS_LINES.length]];
  if (data.world.dates.kuss !== session.today()) {
    data.world.dates.kuss = session.today();
    lines.push(...addFriendship(session, 'oli', KISS_POINTS));
    session.save();
  }
  return lines;
}

// ---------------------------------------------------------------------------
// „Zeit zu zweit“: eine Szene je Herz (Beziehung in Stufen)
// ---------------------------------------------------------------------------

const stageKey = (id: string) => `oli-stufe-${id}`;

/** Die nächste Szene, die Lina noch nicht erlebt hat und für die sie schon genug Herzen hat */
export function nextStageScene(session: Session): StageScene | null {
  const data = session.data;
  if (!data?.flags.oliEingezogen) return null;
  const h = hearts(session);
  return STAGE_SCENES.find((s) => s.hearts <= h && !data.world.dates[stageKey(s.id)]) ?? null;
}

/** Szene erleben: merkt sich, dass sie erlebt wurde, und gibt die Zeilen zurück (ohne Punkte – nur Inhalt) */
export function playStageScene(session: Session): { title: string; lines: string[] } | null {
  const scene = nextStageScene(session);
  const data = session.data;
  if (!scene || !data) return null;
  data.world.dates[stageKey(scene.id)] = session.today();
  session.changed();
  session.save();
  return { title: scene.title, lines: scene.lines.map((l) => l.replaceAll('{dorf}', data.villageName)) };
}

// ---------------------------------------------------------------------------
// Jubiläen: Briefe nach 100 Tagen und nach einem Jahr
// ---------------------------------------------------------------------------

const MOVE_IN_KEY = 'oli-einzug';

/** Wie viele Tage wohnt Oli schon bei Lina? (Ältere Spielstände zählen ab dem ersten Aufruf.) */
export function daysWithOli(session: Session): number | null {
  const data = session.data;
  if (!data?.flags.oliBegruesst) return null;
  if (!data.world.dates[MOVE_IN_KEY]) {
    data.world.dates[MOVE_IN_KEY] = session.today();
    session.changed();
  }
  return daysBetween(data.world.dates[MOVE_IN_KEY], session.today());
}

/** Schickt fällige Jubiläums-Briefe (jeden nur einmal). Gibt die Anzahl neuer Briefe zurück. */
export function checkOliAnniversaries(session: Session): number {
  const days = daysWithOli(session);
  const oli = NPC_BY_ID.oli;
  const data = session.data;
  if (days === null || !oli || !data) return 0;
  let sent = 0;
  for (const a of OLI_ANNIVERSARIES) {
    if (days < a.days || data.world.dates[`oli-brief-${a.id}`]) continue;
    data.world.dates[`oli-brief-${a.id}`] = session.today();
    sendLetter(session, oli, { id: a.id, subject: a.subject, body: a.body, gift: a.gift }, `oli-${a.id}`);
    sent++;
  }
  return sent;
}
