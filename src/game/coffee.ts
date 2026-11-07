/**
 * Kaffeetrinken an der Siebträgermaschine: Getränk wählen, genießen, ein kleiner „Kaffee-Kick“
 * (Lina läuft ein paar Minuten flotter) und ein Kaffee zu zweit mit Oli (einmal am Tag Freundschaft).
 * Alles freiwillig, nichts davon ist Pflicht.
 */
import { hashString } from '../core/rng';
import { type Drink, DRINK_BY_ID, MACHINE_BY_ITEM, MANY_CUPS_LINES, OLI_ART_LINES, OLI_COFFEE_LINES } from '../data/coffee';
import { addFriendship } from './gameplay';
import type { Session } from './session';

/** So viel schneller läuft Lina mit Kaffee-Kick */
export const KICK_SPEED = 1.22;
/** Der Kick hält höchstens so lange (Sekunden Spielzeit), auch bei vielen Tassen */
export const KICK_MAX = 300;
/** Ab so vielen Tassen am Tag gibt es einen kleinen Spruch */
export const MANY_CUPS = 5;

export function isCoffeeMachine(itemId: string): boolean {
  return itemId in MACHINE_BY_ITEM;
}

/** Was diese Maschine kann (in der Reihenfolge der Daten) */
export function drinksFor(itemId: string): Drink[] {
  return (MACHINE_BY_ITEM[itemId]?.drinks ?? []).map((id) => DRINK_BY_ID[id]).filter(Boolean);
}

export interface CoffeeResult {
  lines: string[];
  drink: Drink;
  /** Latte-Art → Herzchen & Funkeln */
  art: boolean;
  /** Kaffee mit Oli getrunken */
  together: boolean;
}

/** Tassen heute (Zähler steht im Spielstand unter `world.dates.kaffee` als „Datum:Anzahl“) */
export function cupsToday(session: Session): number {
  const raw = session.data?.world.dates.kaffee ?? '';
  const [day, n] = raw.split(':');
  return day === session.today() ? Number(n) || 0 : 0;
}

/** Ist der Kaffee-Kick gerade aktiv? */
export function kickActive(session: Session): boolean {
  return session.playTime() < session.coffeeUntil;
}

/**
 * Ein Getränk trinken. `withOli` = Oli ist zu Hause und trinkt mit.
 * Gibt null zurück, wenn die Maschine das Getränk nicht kann.
 */
export function drinkCoffee(session: Session, itemId: string, drinkId: string, withOli: boolean): CoffeeResult | null {
  const data = session.data;
  const machine = MACHINE_BY_ITEM[itemId];
  const drink = DRINK_BY_ID[drinkId];
  if (!data || !machine || !drink || !machine.drinks.includes(drinkId)) return null;
  const today = session.today();
  const cups = cupsToday(session) + 1;
  data.world.dates.kaffee = `${today}:${cups}`;
  const lines = [...drink.lines];
  if (cups === MANY_CUPS) lines.push(MANY_CUPS_LINES[hashString(`kaffee:${today}`) % MANY_CUPS_LINES.length]);
  const now = session.playTime();
  session.coffeeUntil = Math.min(now + KICK_MAX, Math.max(session.coffeeUntil, now) + drink.kick);
  const art = !!drink.art;
  let together = false;
  if (withOli) {
    together = true;
    lines.push(OLI_COFFEE_LINES[hashString(`kaffee-oli:${today}:${cups}`) % OLI_COFFEE_LINES.length]);
    if (art) lines.push(OLI_ART_LINES[hashString(`kaffee-art:${today}:${cups}`) % OLI_ART_LINES.length]);
    if (data.world.dates['kaffee-oli'] !== today) {
      data.world.dates['kaffee-oli'] = today;
      lines.push(...addFriendship(session, 'oli', machine.together + (art ? 4 : 0)));
    }
  }
  session.changed();
  session.save();
  return { lines, drink, art, together };
}
