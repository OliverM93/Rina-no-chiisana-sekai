/**
 * Hühner- und Wachtelställe: jeden Tag liegen frische Eier im Nest.
 * Kein Füttern, keine Pflicht – wer nicht abholt, verpasst nichts: Die Eier sammeln sich bis zu
 * `EGG_DAYS_MAX` Tage im Nest an.
 */
import { daysBetween } from './daily';
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

/** So viele Tage lang sammeln sich die Eier im Nest an (wer mal einen Tag auslässt, verpasst nichts) */
export const EGG_DAYS_MAX = 3;

function addDays(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/**
 * Wie viele Tage Eier liegen im Nest? 0 = schon abgeholt, sonst 1 bis `EGG_DAYS_MAX`. Ein neuer Stall
 * (noch nie abgeholt) hat nur die Eier von heute.
 */
export function eggDaysWaiting(days: CoopDays, uid: string, day: string): number {
  const last = days[uid];
  if (last === day) return 0;
  if (!last) return 1;
  const gap = daysBetween(last, day);
  return Math.max(1, Math.min(EGG_DAYS_MAX, gap));
}

/** Wie viele Eier liegen gerade im Nest (alle angesammelten Tage zusammen)? */
export function eggsWaiting(days: CoopDays, info: CoopInfo, uid: string, day: string): number {
  const n = eggDaysWaiting(days, uid, day);
  let total = 0;
  for (let k = 0; k < n; k++) total += eggsFor(info, uid, addDays(day, -k));
  return total;
}

/** Eier abholen: gibt die Anzahl zurück (0 = heute schon abgeholt) */
export function collectEggs(days: CoopDays, info: CoopInfo, uid: string, day: string): number {
  if (!hasEggs(days, uid, day)) return 0;
  const n = eggsWaiting(days, info, uid, day);
  days[uid] = day;
  return n;
}
