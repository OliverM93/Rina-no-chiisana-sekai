/**
 * Welche Tiere gerade unterwegs sind (Monat, Uhrzeit, Wetter) und das
 * Sammelbuch (was Lina schon gefangen hat).
 */

export interface Availability {
  months: readonly number[];
  /** [von, bis) – über Mitternacht erlaubt; [0, 24] = ganztags */
  hours: readonly [number, number];
  weight: number;
  rainOnly?: boolean;
  noRain?: boolean;
}

export function inHours(hours: readonly [number, number], hour: number): boolean {
  const [from, to] = hours;
  if (from === to || (from === 0 && to === 24)) return true;
  return from < to ? hour >= from && hour < to : hour >= from || hour < to;
}

/** Ist eine Art jetzt unterwegs? */
export function isAvailable(a: Availability, date: Date, raining: boolean): boolean {
  if (!a.months.includes(date.getMonth() + 1)) return false;
  if (!inHours(a.hours, date.getHours())) return false;
  if (a.rainOnly && !raining) return false;
  if (a.noRain && raining) return false;
  return true;
}

/** Wählt gewichtet eine Art aus (r = 0..1). Leere Liste → null. */
export function pickSpecies<T extends { weight: number }>(list: readonly T[], r: number): T | null {
  const total = list.reduce((s, x) => s + x.weight, 0);
  if (total <= 0) return null;
  let acc = r * total;
  for (const x of list) {
    acc -= x.weight;
    if (acc < 0) return x;
  }
  return list[list.length - 1];
}

// ---------------------------------------------------------------------------
// Sammelbuch
// ---------------------------------------------------------------------------

export interface CollectionEntry {
  /** wie oft gefangen */
  count: number;
  /** Tag des ersten Fangs (JJJJ-MM-TT) */
  firstDay: string;
}

export type Collection = Record<string, CollectionEntry>;

/** Trägt einen Fang ein. Gibt true zurück, wenn die Art neu ist. */
export function registerCatch(c: Collection, id: string, day: string): boolean {
  const e = c[id];
  if (e) {
    e.count += 1;
    return false;
  }
  c[id] = { count: 1, firstDay: day };
  return true;
}

export function normalizeCollection(raw: unknown, isKnown: (id: string) => boolean): Collection {
  const out: Collection = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  for (const [id, e] of Object.entries(raw as Record<string, unknown>)) {
    if (!isKnown(id) || !e || typeof e !== 'object') continue;
    const { count, firstDay } = e as Record<string, unknown>;
    if (typeof count !== 'number' || !Number.isFinite(count) || count < 1) continue;
    out[id] = { count: Math.floor(count), firstDay: typeof firstDay === 'string' ? firstDay : '' };
  }
  return out;
}
