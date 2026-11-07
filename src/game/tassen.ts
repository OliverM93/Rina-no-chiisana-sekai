/**
 * Linas Sammeltassen: wie viele hat sie schon, was fehlt noch, und woher kommen die fehlenden?
 */
import { TASSEN, type TasseKind } from '../data/tassen';
import { ownsAnywhere } from './nature';
import type { Session } from './session';

const KIND_LABEL: Record<TasseKind, string> = { klassik: 'Klassik-Tassen', saison: 'Saison-Tassen', stadt: 'Städte-Tassen' };

export interface TassenZaehler {
  total: number;
  have: number;
  /** je Art: (besitzt, gesamt) */
  byKind: Record<TasseKind, [number, number]>;
}

export function tassenZaehler(session: Session): TassenZaehler {
  const byKind: Record<TasseKind, [number, number]> = { klassik: [0, 0], saison: [0, 0], stadt: [0, 0] };
  let have = 0;
  for (const t of TASSEN) {
    byKind[t.kind][1] += 1;
    if (ownsAnywhere(session, t.id)) {
      byKind[t.kind][0] += 1;
      have += 1;
    }
  }
  return { total: TASSEN.length, have, byKind };
}

/** Text am Tassenregal: Stand der Sammlung und ein sanfter Hinweis, woher die fehlenden kommen */
export function tassenStand(session: Session): string[] {
  const z = tassenZaehler(session);
  const lines = [`Linas Tassensammlung: ${z.have} von ${z.total}.`];
  lines.push((Object.keys(z.byKind) as TasseKind[]).map((k) => `${KIND_LABEL[k]} ${z.byKind[k][0]}/${z.byKind[k][1]}`).join(' · '));
  if (z.have >= z.total) lines.push('Alle da! Das Regal biegt sich fast. Lina hat vorsichtshalber ein Foto gemacht.');
  else if (z.byKind.stadt[0] < z.byKind.stadt[1]) lines.push('Städte-Tassen kommen von Onkel Jens’ Reisen – und von Thalias Exkursionen. Klassik- und Saison-Tassen gibt es im Möbelkatalog.');
  else lines.push('Es fehlen nur noch Klassik- oder Saison-Tassen. Die gibt es im Möbelkatalog – die Saison-Tassen nur in ihrer Jahreszeit.');
  return lines;
}
