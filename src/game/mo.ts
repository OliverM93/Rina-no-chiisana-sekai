/**
 * Mo zu Besuch (siehe `data/mo.ts`): Lina lädt ihn über Oli zur Samstagsparty ein, um Thalia zu verkuppeln.
 * Es klappt nicht (Mo hat Jule kennengelernt) – Thalia nimmt es mit Humor. Danach kommt Mo ab und zu samstags vorbei.
 * Alles freiwillig: Wer Mo nicht einlädt, verpasst nichts Wichtiges.
 */
import { hashString } from '../core/rng';
import { MO_INVITE_LINES, MO_LINES, MO_MEETING } from '../data/mo';
import { addFriendship, npcHearts } from './gameplay';
import { isPartyTime } from './party';
import type { Session } from './session';

/** Ab so vielen Herzen mit Thalia kommt Lina auf die Idee */
export const MO_THALIA_HEARTS = 2;

/** Kann Lina Mo über Oli zur Party einladen? */
export function canInviteMo(session: Session): boolean {
  const f = session.data?.flags;
  if (!f || f.moEingeladen) return false;
  return !!f.oliEingezogen && !!f.thaliaEingezogen && npcHearts(session, 'thalia') >= MO_THALIA_HEARTS;
}

/** Oli schreibt Mo – ab dann kommt er zur nächsten Samstagsparty */
export function inviteMo(session: Session): string[] {
  const data = session.data;
  if (!data) return [];
  data.flags.moEingeladen = true;
  session.changed();
  return [...MO_INVITE_LINES];
}

/** Ist Mo gerade auf der Party? Beim ersten Mal immer, danach ungefähr jeden zweiten Samstag. */
export function moAtParty(session: Session): boolean {
  const f = session.data?.flags;
  if (!f?.moEingeladen || !isPartyTime(session)) return false;
  if (!f.moKennengelernt) return true;
  return hashString(`mo:${session.today()}`) % 2 === 0;
}

/** Mit Mo reden: beim ersten Mal die ganze Szene, danach ein kurzer Plausch */
export function talkToMo(session: Session): string[] {
  const data = session.data;
  if (!data) return [];
  if (!data.flags.moKennengelernt) {
    data.flags.moKennengelernt = true;
    addFriendship(session, 'thalia', 20);
    addFriendship(session, 'oli', 10);
    session.changed();
    return [...MO_MEETING];
  }
  const n = (Number(data.world.dates['mo-plausch'] ?? '0') || 0) + 1;
  data.world.dates['mo-plausch'] = String(n);
  session.changed();
  return [...MO_LINES[(hashString(session.today()) + n) % MO_LINES.length]];
}
