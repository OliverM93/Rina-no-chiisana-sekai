/**
 * Samenstand: Samen für Linas Beet kaufen (`data/seedstand.ts`).
 */
import { spaceFor } from '../core/inventory';
import { itemDef, maxStackOf } from '../data/items';
import { seedPrice, standStock } from '../data/seedstand';
import { giveItem } from './gameplay';
import type { Session } from './session';

export type SeedBuyResult = 'ok' | 'teuer' | 'voll' | 'nicht-da';

/** Samen von heute mit Preis */
export function seedOffers(session: Session): Array<{ itemId: string; price: number }> {
  return standStock(session.today()).map((itemId) => ({ itemId, price: seedPrice(itemId) }));
}

/**
 * `count` Samen kaufen – ganz oder gar nicht (passt nicht alles in die Tasche oder reicht das Geld nicht,
 * wird nichts abgebucht).
 */
export function buySeeds(session: Session, itemId: string, count = 1): SeedBuyResult {
  const data = session.data;
  if (!data || count < 1 || !itemDef(itemId) || !standStock(session.today()).includes(itemId)) return 'nicht-da';
  const price = seedPrice(itemId) * count;
  if (data.money < price) return 'teuer';
  if (spaceFor(data.inventory, itemId, maxStackOf) < count) return 'voll';
  data.money -= price;
  session.bus.emit('sfx', 'muenzen');
  giveItem(session, itemId, count, false);
  session.changed();
  session.save();
  return 'ok';
}
