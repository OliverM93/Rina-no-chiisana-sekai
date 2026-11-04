/**
 * Tagesabläufe der Bewohner: Was macht wer um welche Uhrzeit?
 */

export type Activity =
  /** sitzt auf einer Bank (Objekt-ID) */
  | { kind: 'sitzen'; bench: string }
  /** steht an einer Stelle und schaut in eine Richtung */
  | { kind: 'stehen'; x: number; y: number; facing: 'down' | 'up' | 'left' | 'right' }
  /** spaziert zufällig in einem Bereich (Kacheln) */
  | { kind: 'spazieren'; area: { x: number; y: number; w: number; h: number } }
  /** ist im Haus (unsichtbar) */
  /** ist im Haus (unsichtbar) – `at` = bei jemand anderem zu Besuch (Objekt-ID des Hauses) */
  | { kind: 'zuhause'; sleeping?: boolean; at?: string };

export interface ScheduleEntry {
  /** „HH:MM“ – gilt ab dieser Uhrzeit bis zum nächsten Eintrag */
  from: string;
  activity: Activity;
  /** kurze Beschreibung (für Dialoge/Fehlersuche) */
  label: string;
}

export function parseHHMM(s: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s);
  if (!m) throw new Error(`Ungültige Uhrzeit: ${s}`);
  return Number(m[1]) * 60 + Number(m[2]);
}

/**
 * Findet den gültigen Eintrag zur Uhrzeit. Einträge müssen nach Uhrzeit
 * sortiert sein; vor dem ersten Eintrag gilt der letzte (über Mitternacht).
 */
export function activityAt(schedule: readonly ScheduleEntry[], date: Date): ScheduleEntry {
  if (schedule.length === 0) throw new Error('Leerer Tagesablauf');
  const minute = date.getHours() * 60 + date.getMinutes();
  let current = schedule[schedule.length - 1];
  for (const entry of schedule) {
    if (parseHHMM(entry.from) <= minute) current = entry;
    else break;
  }
  return current;
}

/** Prüft, ob ein Tagesablauf sortiert und gültig ist. */
export function validateSchedule(schedule: readonly ScheduleEntry[]): string[] {
  const errors: string[] = [];
  let last = -1;
  for (const e of schedule) {
    let m: number;
    try {
      m = parseHHMM(e.from);
    } catch (err) {
      errors.push((err as Error).message);
      continue;
    }
    if (m <= last) errors.push(`${e.from} ist nicht aufsteigend sortiert`);
    if (m >= 24 * 60) errors.push(`${e.from} liegt nach Mitternacht`);
    last = m;
  }
  return errors;
}
