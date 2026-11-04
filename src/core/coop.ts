/**
 * Hühner- und Wachtelställe: jeden Tag liegen frische Eier im Nest.
 * Kein Füttern, keine Pflicht – wer nicht abholt, verpasst nichts Schlimmes
 * (die Eier von heute liegen einfach bis morgen früh im Nest).
 */
import { hashString, mulberry32 } from './rng';

export type CoopKind = 'huhn' | 'wachtel';

export interface CoopInfo {
  /** Wie viele Tiere im Stall wohnen */
  animals: number;
  /** Eier pro Tag (min–max) */
  eggs: readonly [number, number];
  /** Ei-Gegenstand */
  egg: string;
}

/** Stall-ID (uid im Garten) → Tag der letzten Abholung */
export type CoopDays = Record<string, string>;

/** Wie viele Eier liegen heute im Nest? (reproduzierbar pro Tag & Stall) */
export function eggsFor(info: CoopInfo, uid: string, day: string): number {
  const [min, max] = info.eggs;
  return min + Math.floor(mulberry32(hashString(`${uid}:eier:${day}`))() * (max - min + 1));
}

export function hasEggs(days: CoopDays, uid: string, day: string): boolean {
  return days[uid] !== day;
}

/** Eier abholen: gibt die Anzahl zurück (0 = heute schon abgeholt) */
export function collectEggs(days: CoopDays, info: CoopInfo, uid: string, day: string): number {
  if (!hasEggs(days, uid, day)) return 0;
  days[uid] = day;
  return eggsFor(info, uid, day);
}
