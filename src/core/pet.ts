/**
 * Winston, Linas Dackel: Streicheln und tägliches Buddeln.
 * Reine Logik – Darstellung in `world3d/Dog3D.ts`, Texte in `data/winston.ts`.
 */
import { daysBetween } from './daily';

export interface PetState {
  /** Tag, an dem zuletzt gestreichelt wurde */
  pettedDay: string;
  /** Wie oft insgesamt gestreichelt (für kleine Überraschungen) */
  pets: number;
  /** Tag, an dem Winston zuletzt etwas ausgebuddelt hat */
  digDay: string;
  /** Wie viele Fundstellen Winston gerade „übrig“ hat (jeder Tag bringt eine, bis zu `DIG_DAYS_MAX`) */
  digTokens: number;
  /** Tag, bis zu dem die Fundstellen gezählt sind */
  digSeen: string;
}

/** So viele Tage Buddelfunde sammeln sich an (wer einen Tag auslässt, verpasst nichts) */
export const DIG_DAYS_MAX = 3;

export function createPet(): PetState {
  return { pettedDay: '', pets: 0, digDay: '', digTokens: 0, digSeen: '' };
}

/** Streicheln: gibt zurück, ob es das erste Mal heute war */
export function petDog(p: PetState, day: string): boolean {
  const first = p.pettedDay !== day;
  p.pettedDay = day;
  p.pets += 1;
  return first;
}

/** Neue Tage zählen: Jeder Tag bringt eine Fundstelle, höchstens `DIG_DAYS_MAX` liegen bereit */
function refreshDig(p: PetState, day: string) {
  if (p.digSeen === day) return;
  // Alte Spielstände (ohne `digSeen`): ab dem letzten Buddeltag zählen, heute schon Gebuddeltes nicht doppelt
  if (!p.digSeen && p.digDay) p.digSeen = p.digDay;
  const passed = p.digSeen ? Math.max(0, daysBetween(p.digSeen, day)) : 1;
  p.digTokens = Math.min(DIG_DAYS_MAX, p.digTokens + passed);
  p.digSeen = day;
}

/** Darf Winston buddeln? (eine Stelle pro Tag; verpasste Tage sammeln sich bis zu drei Stellen an) */
export function canDig(p: PetState, day: string): boolean {
  refreshDig(p, day);
  return p.digTokens > 0;
}

export function markDug(p: PetState, day: string) {
  refreshDig(p, day);
  p.digTokens = Math.max(0, p.digTokens - 1);
  p.digDay = day;
}

export function normalizePet(raw: unknown): PetState {
  const p = createPet();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return p;
  const r = raw as Record<string, unknown>;
  if (typeof r.pettedDay === 'string') p.pettedDay = r.pettedDay;
  if (typeof r.digDay === 'string') p.digDay = r.digDay;
  if (typeof r.digTokens === 'number' && Number.isFinite(r.digTokens)) p.digTokens = Math.max(0, Math.min(DIG_DAYS_MAX, Math.floor(r.digTokens)));
  if (typeof r.digSeen === 'string') p.digSeen = r.digSeen;
  if (typeof r.pets === 'number' && Number.isFinite(r.pets)) p.pets = Math.max(0, Math.floor(r.pets));
  return p;
}
