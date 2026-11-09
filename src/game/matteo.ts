/**
 * Pater Matteo schreibt Briefe an Lina & Thalia, nachdem das Päckchen verschickt wurde (Thalias dritter Wunsch).
 * Die Briefe kommen in Abständen (2, 10, 25, 50 Tage danach), jeder nur einmal; er selbst erscheint nie im Dorf.
 */
import { daysBetween } from '../core/daily';
import { deliver } from '../core/mail';
import { MATTEO_LETTERS, MATTEO_NAME } from '../data/matteo';
import { wishFlag } from '../data/wishes';
import type { Session } from './session';

export const MATTEO_WISH = 'thalia-matteo';

/** Seit wie vielen Tagen schreibt Lina mit Pater Matteo? (null, solange der Wunsch nicht erfüllt ist) */
export function matteoDays(session: Session): number | null {
  const data = session.data;
  if (!data?.flags[wishFlag(MATTEO_WISH)]) return null;
  const start = data.world.dates[`wunsch-datum-${MATTEO_WISH}`] ?? session.today();
  return Math.max(0, daysBetween(start, session.today()));
}

/** Schickt fällige Briefe. Gibt die Anzahl neuer Briefe zurück. */
export function checkMatteoLetters(session: Session): number {
  const data = session.data;
  const days = matteoDays(session);
  if (!data || days === null) return 0;
  let sent = 0;
  for (const l of MATTEO_LETTERS) {
    if (days < l.afterDays) continue;
    const ok = deliver(data.mail, { id: l.id, from: MATTEO_NAME, subject: l.subject, body: l.body, gift: l.gift ? { ...l.gift } : undefined, day: session.today() });
    if (ok) sent++;
  }
  if (sent > 0) {
    session.changed();
    session.bus.emit('toast', { text: `📬 Post aus Italien von ${MATTEO_NAME}!` });
    session.bus.emit('sfx', 'post');
  }
  return sent;
}
