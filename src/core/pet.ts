/**
 * Winston, Linas Dackel: Streicheln und tägliches Buddeln.
 * Reine Logik – Darstellung in `world3d/Dog3D.ts`, Texte in `data/winston.ts`.
 */
export interface PetState {
  /** Tag, an dem zuletzt gestreichelt wurde */
  pettedDay: string;
  /** Wie oft insgesamt gestreichelt (für kleine Überraschungen) */
  pets: number;
  /** Tag, an dem Winston zuletzt etwas ausgebuddelt hat */
  digDay: string;
}

export function createPet(): PetState {
  return { pettedDay: '', pets: 0, digDay: '' };
}

/** Streicheln: gibt zurück, ob es das erste Mal heute war */
export function petDog(p: PetState, day: string): boolean {
  const first = p.pettedDay !== day;
  p.pettedDay = day;
  p.pets += 1;
  return first;
}

/** Darf Winston heute buddeln? (einmal am Tag) */
export function canDig(p: PetState, day: string): boolean {
  return p.digDay !== day;
}

export function markDug(p: PetState, day: string) {
  p.digDay = day;
}

export function normalizePet(raw: unknown): PetState {
  const p = createPet();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return p;
  const r = raw as Record<string, unknown>;
  if (typeof r.pettedDay === 'string') p.pettedDay = r.pettedDay;
  if (typeof r.digDay === 'string') p.digDay = r.digDay;
  if (typeof r.pets === 'number' && Number.isFinite(r.pets)) p.pets = Math.max(0, Math.floor(r.pets));
  return p;
}
