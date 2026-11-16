/**
 * Verstecke (Texte & Orte: `data/verstecke.ts`). Gemerkt ohne neues Spielstand-Format:
 * `world.dates['versteck:<id>']` = Tag des Fundes, Flag `versteck-hinweis-<id>` = Ort ist bekannt (✕ auf der Karte, Funkeln).
 */
import { hashString } from '../core/rng';
import { THALIA_MAP_EVERY_NTH_DAY, THALIA_MAP_LEAD, THALIA_MAP_TAIL, VERSTECKE, versteckDateKey, versteckHintFlag, type VersteckDef } from '../data/verstecke';
import { giveItem, hasMovedIn } from './gameplay';
import type { Session } from './session';

export function isFound(session: Session, id: string): boolean {
  return !!session.data?.world.dates[versteckDateKey(id)];
}

export function isHinted(session: Session, id: string): boolean {
  return !!session.data?.flags[versteckHintFlag(id)];
}

/** Verstecke, die noch nicht gefunden sind */
export function unfound(session: Session): VersteckDef[] {
  return VERSTECKE.filter((v) => !isFound(session, v.id));
}

/** Schon bekannt (✕, Funkeln), aber noch nicht gefunden */
export function hintedUnfound(session: Session): VersteckDef[] {
  return unfound(session).filter((v) => isHinted(session, v.id));
}

/** Verstecktes Ziel auf dieser Kachel (noch nicht gefunden)? */
export function versteckAt(session: Session, x: number, y: number): VersteckDef | null {
  return unfound(session).find((v) => v.x === x && v.y === y) ?? null;
}

export function hint(session: Session, id: string): void {
  if (!session.data || isHinted(session, id)) return;
  session.data.flags[versteckHintFlag(id)] = true;
  session.changed();
}

/** Das nächste noch unbekannte Versteck in nächster Nähe (Kacheln) – für Winstons Aufregung */
export function unhintedNear(session: Session, tx: number, ty: number, range: number): VersteckDef | null {
  return unfound(session).find((v) => !isHinted(session, v.id) && Math.hypot(v.x - tx, v.y - ty) <= range) ?? null;
}

/** Fund: Gegenstände in die Tasche, Tag merken. Gibt Linas Zeilen und die Gegenstände zurück (Rest legt die Welt vor ihre Füße). */
export function findVersteck(session: Session, id: string): { lines: string[]; leftover: Array<{ itemId: string; count: number }> } | null {
  const data = session.data;
  const v = VERSTECKE.find((x) => x.id === id);
  if (!data || !v || isFound(session, id)) return null;
  data.world.dates[versteckDateKey(id)] = session.today();
  data.flags[versteckHintFlag(id)] = true;
  const leftover: Array<{ itemId: string; count: number }> = [];
  for (const it of v.items) {
    const left = giveItem(session, it.itemId, it.count, false);
    if (left > 0) leftover.push({ itemId: it.itemId, count: left });
  }
  session.changed();
  session.save();
  return { lines: [...v.found], leftover };
}

/**
 * Thalia erzählt ab und zu von einer alten Karte (reproduzierbar je Tag, ohne Druck): Das nächste noch unbekannte
 * Versteck wird auf der Dorfkarte eingetragen. Nur wenn Thalia im Dorf wohnt.
 */
export function thaliaMapLines(session: Session): string[] {
  if (!session.data || !hasMovedIn(session, 'thalia')) return [];
  if (hashString(`thalia-karte:${session.today()}`) % THALIA_MAP_EVERY_NTH_DAY !== 0) return [];
  const next = unfound(session).find((v) => !isHinted(session, v.id));
  if (!next) return [];
  hint(session, next.id);
  return [...THALIA_MAP_LEAD, next.hint, ...THALIA_MAP_TAIL];
}
