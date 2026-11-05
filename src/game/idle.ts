/**
 * Auswahl der Leerlauf-Animation (reine Logik, testbar): gewichtet nach Lage,
 * nie zweimal dieselbe hintereinander.
 */
import { IDLE_ACTS, type IdleAct, type IdleActDef, type IdleContext } from '../data/idle';

export function pickIdleAct(ctx: IdleContext, last: IdleAct | null, rnd: () => number = Math.random): IdleActDef | null {
  const options = IDLE_ACTS.map((a) => ({ a, w: a.id === last ? 0 : a.weight(ctx) })).filter((o) => o.w > 0);
  const total = options.reduce((s, o) => s + o.w, 0);
  if (total <= 0) return null;
  let r = rnd() * total;
  for (const o of options) {
    r -= o.w;
    if (r <= 0) return o.a;
  }
  return options[options.length - 1].a;
}
