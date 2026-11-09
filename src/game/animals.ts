/**
 * Hühner & Wachteln: Eier abholen, Tiere streicheln (Regeln ohne Darstellung).
 */
import { collectEggs, eggDaysWaiting, eggsWaiting, hasEggs } from '../core/coop';
import { spaceFor } from '../core/inventory';
import { COOPS, EGG_LINES, MORE_EGGS, NO_EGGS } from '../data/animals';
import { FURNITURE_BY_ITEM } from '../data/furniture';
import { itemCountLabel, maxStackOf } from '../data/items';
import { giveItem } from './gameplay';
import type { Session } from './session';
import { itemIconUrl } from '../gfx/items';

/** Stallart eines Gartenmöbels (oder null) */
export function coopKindOf(itemId: string) {
  return FURNITURE_BY_ITEM[itemId]?.def.coop ?? null;
}

export function coopHasEggs(session: Session, uid: string): boolean {
  return !!session.data && hasEggs(session.data.world.coopDay, uid, session.today());
}

/** Eier am Stall abholen – mit Meldung. Gibt die Anzahl zurück. */
export function collectCoop(session: Session, uid: string): number {
  const data = session.data;
  const item = data?.yard.items.find((i) => i.uid === uid);
  const kind = item ? coopKindOf(item.itemId) : null;
  if (!data || !item || !kind) return 0;
  const def = COOPS[kind];
  const day = session.today();
  if (!hasEggs(data.world.coopDay, uid, day)) {
    session.bus.emit('toast', { text: NO_EGGS[kind] });
    return 0;
  }
  const waitingDays = eggDaysWaiting(data.world.coopDay, uid, day);
  if (spaceFor(data.inventory, def.egg, maxStackOf) < eggsWaiting(data.world.coopDay, def, uid, day)) {
    session.bus.emit('toast', { text: 'Deine Tasche ist zu voll für die Eier! 🎒' });
    return 0;
  }
  const got = collectEggs(data.world.coopDay, def, uid, day);
  giveItem(session, def.egg, got, false);
  const line = waitingDays > 1 ? MORE_EGGS[kind] : EGG_LINES[kind][day.length % EGG_LINES[kind].length];
  session.bus.emit('toast', { text: `${line} ${itemCountLabel(def.egg, got)} eingesteckt.`, icon: itemIconUrl(def.egg) });
  session.changed();
  session.save();
  return got;
}
