/**
 * Fortschritt statt Kalender: Zähler für das, was Lina im Spiel tut, und Meilensteine,
 * die Einzüge freischalten. Reine Logik – die Meilensteine selbst stehen in `data/progress.ts`.
 *
 * Bewusst KEINE Freundschafts-Herzen als Bedingung: Plaudern & Schenken zählen nur einmal
 * am Tag – sonst hinge der Fortschritt doch wieder am Kalender.
 */

/** Zähler (steigen nur) */
export interface Stats {
  /** Sternchen, die Lina durch Verkaufen verdient hat */
  sold: number;
  /** Gekaufte Dinge aus dem Möbelkatalog */
  bought: number;
  /** An der Werkbank gebaut */
  crafted: number;
  /** Gekocht (bei Jens oder am eigenen Herd) */
  cooked: number;
}

export function createStats(): Stats {
  return { sold: 0, bought: 0, crafted: 0, cooked: 0 };
}

export function normalizeStats(raw: unknown): Stats {
  const s = createStats();
  if (!raw || typeof raw !== 'object') return s;
  const r = raw as Record<string, unknown>;
  for (const k of Object.keys(s) as (keyof Stats)[]) {
    const v = r[k];
    if (typeof v === 'number' && Number.isFinite(v)) s[k] = Math.max(0, Math.floor(v));
  }
  return s;
}

/** Woran ein Meilenstein gemessen wird */
export type NeedKind = 'sammelbuch' | 'verkauft' | 'gekauft' | 'gebaut' | 'gekocht' | 'flag';

export interface Need {
  kind: NeedKind;
  /** Zielwert (bei `flag`: unbenutzt) */
  n: number;
  /** Bei `flag`: dieses Story-Flag muss gesetzt sein */
  flag?: string;
}

/** Was zum Prüfen gebraucht wird */
export interface ProgressState {
  stats: Stats;
  collectionSize: number;
  flags: Readonly<Record<string, boolean>>;
}

export function needValue(need: Need, st: ProgressState): number {
  switch (need.kind) {
    case 'sammelbuch':
      return st.collectionSize;
    case 'verkauft':
      return st.stats.sold;
    case 'gekauft':
      return st.stats.bought;
    case 'gebaut':
      return st.stats.crafted;
    case 'gekocht':
      return st.stats.cooked;
    case 'flag':
      return need.flag && st.flags[need.flag] ? 1 : 0;
  }
}

export function needMet(need: Need, st: ProgressState): boolean {
  return needValue(need, st) >= (need.kind === 'flag' ? 1 : need.n);
}

/** Welche Bedingungen fehlen noch? (leer = erfüllt) */
export function missingNeeds(needs: readonly Need[], st: ProgressState): Need[] {
  return needs.filter((n) => !needMet(n, st));
}

/** Kurze Wartezeit in Spielzeit (Sekunden): Ankündigungsbrief → Einzug, Bestellung → fertiger Ausbau */
export const WAIT_SECONDS = 10 * 60;

/** Ist die Wartezeit seit `since` (Spielzeit in s) vorbei? Fehlt `since`, gilt sie als vorbei. */
export function waitOver(since: number | undefined, now: number, wait = WAIT_SECONDS): boolean {
  return since === undefined || now - since >= wait;
}

/** Zahlen-Tabelle (z. B. Spielzeit beim Absenden eines Briefs) säubern */
export function normalizeNumberRecord(raw: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) if (typeof v === 'number' && Number.isFinite(v) && v >= 0) out[k] = v;
  return out;
}
