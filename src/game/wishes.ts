/**
 * Herzenswünsche: Welcher Wunsch ist gerade dran, was fehlt noch, Wunsch erfüllen.
 * Daten in `data/wishes.ts`. Der Zustand steckt ganz in Story-Flags (kein neues Spielstand-Feld):
 * `wunsch-erzaehlt-<id>` (davon erzählt) und `wunsch-<id>` (erfüllt → Kartenobjekt erscheint).
 *
 * Keine Frist, keine Reihenfolge zwischen den Bewohnern. Gegenstände werden erst beim Erfüllen
 * genommen – Lina kann vorher alles weiter benutzen, verkaufen oder verschenken.
 */
import { removeItem } from '../core/inventory';
import { itemDef, speciesOfFlower } from '../data/items';
import { NPC_BY_ID } from '../data/npcs';
import { OLI_RARE_WARDROBE } from '../data/npcs/looks';
import type { NpcDef } from '../data/npcs/types';
import type { WardrobeItem } from '../core/appearance';
import { ALL_WISHES, FOLKDANCE_LINES, FOLKDANCE_POINTS, WISH_FRIENDSHIP, WISH_LETTER, WISHES_UNLOCK_FLAG, wishFlag, wishOptionFlag, wishToldFlag, type WishDef, type WishNeed } from '../data/wishes';
import { hashString } from '../core/rng';
import { learnRecipe } from './crafting';
import { addFriendship, formatMoney, sendLetter } from './gameplay';
import type { Session } from './session';

export function wishesUnlocked(session: Session): boolean {
  return !!session.data?.flags[WISHES_UNLOCK_FLAG];
}

export function isWishDone(session: Session, id: string): boolean {
  return !!session.data?.flags[wishFlag(id)];
}

/** Der nächste offene Wunsch eines Bewohners (oder null) */
export function activeWish(session: Session, npcId: string): WishDef | null {
  if (!wishesUnlocked(session)) return null;
  const list = ALL_WISHES.filter((w) => w.npc === npcId).sort((a, b) => a.order - b.order);
  return list.find((w) => !isWishDone(session, w.id)) ?? null;
}

/** Passt ein Gegenstand zu einem Bedarf? */
export function matchesNeed(need: WishNeed, itemId: string): boolean {
  if (need.item) return itemId === need.item;
  if (need.species) return speciesOfFlower(itemId) === need.species && itemDef(itemId)?.category === 'blume';
  if (need.category) return itemDef(itemId)?.category === need.category;
  return false;
}

export interface NeedProgress {
  label: string;
  have: number;
  need: number;
}

/** Wie viel Lina von jedem Bedarf in der Tasche hat (jeder Gegenstand zählt nur für einen Bedarf) */
export function wishProgress(session: Session, wish: WishDef): { needs: NeedProgress[]; stars: NeedProgress | null; complete: boolean } {
  const data = session.data;
  const left = new Map<string, number>();
  for (const s of data?.inventory.slots ?? []) if (s) left.set(s.itemId, (left.get(s.itemId) ?? 0) + s.count);
  const needs = wish.needs.map((n) => {
    let have = 0;
    for (const [id, count] of left) {
      if (have >= n.count || !matchesNeed(n, id)) continue;
      const take = Math.min(count, n.count - have);
      have += take;
      left.set(id, count - take);
    }
    return { label: n.label, have, need: n.count };
  });
  const stars = wish.stars ? { label: 'Sternchen', have: Math.min(data?.money ?? 0, wish.stars), need: wish.stars } : null;
  const complete = needs.every((n) => n.have >= n.need) && (!stars || stars.have >= stars.need);
  return { needs, stars, complete };
}

/** Eine Zeile mit allem, was fehlt bzw. schon da ist */
export function progressLine(session: Session, wish: WishDef): string {
  const p = wishProgress(session, wish);
  const parts = p.needs.map((n) => `${n.have >= n.need ? '✅' : '▫️'} ${n.label} ${n.have}/${n.need}`);
  if (p.stars) parts.push(`${p.stars.have >= p.stars.need ? '✅' : '▫️'} ${formatMoney(p.stars.need)}`);
  return `Für „${wish.title}“: ${parts.join(' · ')}`;
}

/** Kleiner Hinweis zur Begrüßung, solange der Bewohner noch nicht von seinem Wunsch erzählt hat */
export function wishTeaser(session: Session, npcId: string): string | null {
  const w = activeWish(session, npcId);
  if (!w || session.data?.flags[wishToldFlag(w.id)]) return null;
  return npcId === 'oli' ? 'Du, Lini … ich hätte da so einen kleinen Herzenswunsch. 💭' : 'Ach, Lina – ich hätte da einen kleinen Herzenswunsch. Frag ruhig mal. 💭';
}

/** Lina fragt nach dem Wunsch: beim ersten Mal erzählt der Bewohner davon, danach Stand der Dinge */
export function askWish(session: Session, npcId: string): { lines: string[]; canFulfill: boolean; options: ReadonlyArray<{ id: string; label: string }> } | null {
  const data = session.data;
  const w = activeWish(session, npcId);
  if (!data || !w) return null;
  const first = !data.flags[wishToldFlag(w.id)];
  if (first) {
    data.flags[wishToldFlag(w.id)] = true;
    if (w.recipe) learnRecipe(session, w.recipe); // z. B. Omas Likörrezept
    session.changed();
  }
  const p = wishProgress(session, w);
  const lines = [...(first ? w.intro : w.reminder), progressLine(session, w)];
  if (p.complete) lines.push('Du hast ja schon alles dabei! 💝');
  return { lines, canFulfill: p.complete, options: w.options?.map((o) => ({ id: o.id, label: o.label })) ?? [] };
}

export interface WishResult {
  lines: string[];
  /** Geschenke des Bewohners (World3D legt sie in die Tasche oder vor Linas Füße) */
  rewards: Array<{ itemId: string; count: number }>;
}

/**
 * Wunsch erfüllen: nimmt die Sachen, setzt das Flag (der Ort erscheint) und gibt die Danke-Zeilen und Geschenke zurück.
 * Bei Wünschen mit Wahl (`options`) gehört die gewählte Option dazu.
 */
export function fulfillWish(session: Session, npcId: string, optionId?: string): WishResult | null {
  const data = session.data;
  const w = activeWish(session, npcId);
  if (!data || !w || !wishProgress(session, w).complete) return null;
  const option = w.options ? w.options.find((o) => o.id === optionId) : undefined;
  if (w.options && !option) return null;
  for (const n of w.needs) {
    let rest = n.count;
    for (const s of [...data.inventory.slots]) {
      if (rest <= 0) break;
      if (!s || !matchesNeed(n, s.itemId)) continue;
      const take = Math.min(s.count, rest);
      removeItem(data.inventory, s.itemId, take);
      rest -= take;
    }
  }
  if (w.stars) data.money -= w.stars;
  data.flags[wishFlag(w.id)] = true;
  data.flags[wishToldFlag(w.id)] = true;
  data.world.dates[`wunsch-datum-${w.id}`] = session.today(); // z. B. für Pater Matteos Briefe
  if (option) data.flags[wishOptionFlag(w.id, option.id)] = true;
  const lines = [...(option ? option.done : w.done), ...addFriendship(session, npcId, WISH_FRIENDSHIP)];
  const rewards = [...(option ? option.rewardItems : (w.rewardItems ?? []))].map((r) => ({ ...r }));
  session.changed();
  session.save();
  return { lines, rewards };
}

/** Kleiderschrank eines Bewohners – Olis seltenes Tourshirt kommt dazu, sobald sein Wunsch erfüllt ist */
export function wardrobeFor(session: Session, def: NpcDef): readonly WardrobeItem[] | undefined {
  if (def.id === 'oli' && def.wardrobe && isWishDone(session, 'oli-bandshirt')) return [...def.wardrobe, ...OLI_RARE_WARDROBE];
  return def.wardrobe;
}

/** Sobald alle eingezogen sind: einmal Omas Brief über die Herzenswünsche */
export function checkWishLetter(session: Session): boolean {
  const data = session.data;
  if (!data || !wishesUnlocked(session) || data.flags.herzenswunschBrief) return false;
  data.flags.herzenswunschBrief = true;
  sendLetter(session, NPC_BY_ID.gisela, WISH_LETTER, WISH_LETTER.id);
  return true;
}

/** Alle Wünsche (für Karte & Doku): offen, erzählt, erfüllt */
export function wishOverview(session: Session) {
  return ALL_WISHES.map((w) => ({ wish: w, told: !!session.data?.flags[wishToldFlag(w.id)], done: isWishDone(session, w.id) }));
}

// ---------------------------------------------------------------------------
// Volkstanz (Christins zweiter Wunsch erfüllt)
// ---------------------------------------------------------------------------

export function canFolkDance(session: Session): boolean {
  const data = session.data;
  return !!data && isWishDone(session, 'christin-volkstanz') && data.world.dates.volkstanz !== session.today();
}

/** Mit Christin & Olaf tanzen: einmal am Tag, Freundschaft für beide (Olaf, wenn er da ist) */
export function folkDance(session: Session): string[] {
  const data = session.data;
  if (!data) return [];
  data.world.dates.volkstanz = session.today();
  const lines = [...FOLKDANCE_LINES[hashString(session.today()) % FOLKDANCE_LINES.length]];
  lines.push(...addFriendship(session, 'christin', FOLKDANCE_POINTS));
  addFriendship(session, 'olaf', FOLKDANCE_POINTS);
  session.save();
  return lines;
}
