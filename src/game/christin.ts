/**
 * Christins Rolle im Dorf: Sie gießt abends Linas Garten mit (was noch durstig ist)
 * und hat jeden Tag einen Ordnungstipp. Beides ist ein Angebot, nichts davon ist Pflicht.
 */
import { BLOOM, isWatered, water } from '../core/garden';
import { hashString } from '../core/rng';
import { CHRISTIN_TIPS } from '../data/npcs/christin';
import { DINNER_DAY, DINNER_HOURS, dinnerGuests } from './dinner';
import { currentWeather } from './nature';
import type { Session } from './session';

/** Ab dieser Stunde gießt Christin (ihre Gießrunde beginnt um 18 Uhr – nach dem Angeln mit Olaf) */
export const CHRISTIN_WATER_HOUR = 18.5;
/** Sonntags beim Essen bei Jens: danach */
const AFTER_DINNER_HOUR = DINNER_HOURS[1] + 0.25;

/** Wohnt Christin schon im Dorf? */
export function christinIsHere(session: Session): boolean {
  return !!session.data?.flags.olafBegruesst;
}

/**
 * Christins Gießrunde: Ab halb sieben gießt sie einmal am Tag alles in Linas Beeten, was noch
 * nicht gegossen ist (nicht bei Regen – da gießt der Himmel). Gibt die gegossenen Beet-Plätze zurück.
 */
export function christinWaters(session: Session, now = session.clock()): string[] {
  const data = session.data;
  if (!data || !christinIsHere(session)) return [];
  const today = session.today();
  if (data.world.dates.christinGiesst === today) return [];
  const from = now.getDay() === DINNER_DAY && dinnerGuests(session).includes('christin') && data.flags.jensBegruesst ? AFTER_DINNER_HOUR : CHRISTIN_WATER_HOUR;
  if (now.getHours() + now.getMinutes() / 60 < from || now.getHours() >= 22) return [];
  if (currentWeather(session).rainedToday) return [];
  const done: string[] = [];
  for (const [key, p] of Object.entries(data.world.garden)) {
    if (p.stage < BLOOM && !isWatered(p, today) && water(data.world.garden, key, today)) done.push(key);
  }
  if (done.length === 0) return [];
  data.world.dates.christinGiesst = today;
  session.changed();
  session.save();
  return done;
}

/** Hat Christin heute schon Linas Garten gegossen? (für ihre Dialoge) */
export function christinWateredToday(session: Session): boolean {
  return session.data?.world.dates.christinGiesst === session.today();
}

/** Der Ordnungstipp des Tages (jeden Tag ein anderer, reproduzierbar) */
export function christinTip(session: Session): readonly string[] {
  const i = hashString(`christin-tipp:${session.today()}`) % CHRISTIN_TIPS.length;
  return CHRISTIN_TIPS[i];
}
