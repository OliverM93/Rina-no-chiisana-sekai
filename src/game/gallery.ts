/**
 * Jens' Galerie: jeden Tag ein „Kunstwerk des Tages“ zum Kaufen, und Lina kann
 * Bilder der Galerie stiften (dann hängen sie dort für alle zu sehen).
 */
import { hashString } from '../core/rng';
import { ART_BY_ID, ARTWORKS, type ArtDef } from '../data/art';
import { addFriendship, giveItem, takeItem } from './gameplay';
import type { Session } from './session';

/** Kunstwerk des Tages (noch nicht in der Galerie), reproduzierbar pro Datum */
export function artOfTheDay(session: Session): ArtDef | null {
  const data = session.data;
  if (!data) return null;
  const open = ARTWORKS.filter((a) => !data.gallery.includes(a.id));
  if (open.length === 0) return null;
  return open[hashString(`kunst:${session.today()}`) % open.length];
}

export type ArtBuyResult = 'ok' | 'zu-teuer' | 'tasche-voll' | 'verkauft' | 'fehler';

export function buyArtOfTheDay(session: Session): ArtBuyResult {
  const data = session.data;
  const art = artOfTheDay(session);
  if (!data || !art) return 'fehler';
  if (data.world.dates['kunst-gekauft'] === session.today()) return 'verkauft';
  if (data.money < art.price) return 'zu-teuer';
  if (giveItem(session, art.id, 1, false) > 0) return 'tasche-voll';
  data.money -= art.price;
  data.world.dates['kunst-gekauft'] = session.today();
  session.changed();
  session.save();
  return 'ok';
}

/** Kunstwerke in der Tasche, die noch nicht in der Galerie hängen */
export function donatableArt(session: Session): ArtDef[] {
  const data = session.data;
  if (!data) return [];
  const inBag = new Set(data.inventory.slots.filter((s) => s && ART_BY_ID[s.itemId]).map((s) => s!.itemId));
  return ARTWORKS.filter((a) => inBag.has(a.id) && !data.gallery.includes(a.id));
}

/** Stiften: Bild kommt in die Galerie. Gibt Zeilen von Jens zurück. */
export function donateArt(session: Session, id: string): string[] {
  const data = session.data;
  const art = ART_BY_ID[id];
  if (!data || !art || data.gallery.includes(id) || !takeItem(session, id, 1)) return [];
  data.gallery.push(id);
  const lines = [`„${art.name}“ – magnifique! 🖼️`, 'Ich häng es gleich an den besten Platz. Mit Schild: „Gestiftet von Lina“.'];
  if (data.gallery.length === ARTWORKS.length) lines.push('Chérie … die Galerie ist KOMPLETT! Alle Bilder! Ich muss mich setzen. Nu, das gibt\'s doch nicht!');
  lines.push(...addFriendship(session, 'jens', 16));
  session.changed();
  session.save();
  return lines;
}
