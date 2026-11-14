/**
 * Freundschaften-Seite im Notizbuch (Feature Discovery A): Herzen, Füllstand und das, was Lina über
 * Geschmack und Belohnungen schon herausgefunden hat. Nur Entdecktes, keine Zahlen, keine Prozente.
 */
import { heartProgress, heartsFor, MAX_HEARTS, type GiftReaction } from '../core/friendship';
import { itemDef } from '../data/items';
import { NPC_BY_ID, NPCS } from '../data/npcs';
import { npcState, hasMovedIn } from './gameplay';
import type { Session } from './session';

const SEEN = ['liebt', 'mag', 'mag-nicht'] as const satisfies readonly GiftReaction[];
export type SeenReaction = (typeof SEEN)[number];

/** Merk-Eintrag für „Lina weiß jetzt, wie X auf Y reagiert“ – ein Flag je Bewohner, Reaktion und Gegenstand */
export const tasteFlag = (npcId: string, reaction: SeenReaction, itemId: string) => `geschmack:${npcId}:${reaction}:${itemId}`;

/** Wird beim Schenken aufgerufen; neutrale Reaktionen sind keine Entdeckung wert. */
export function noteTaste(session: Session, npcId: string, reaction: GiftReaction, itemId: string): void {
  if (reaction === 'neutral' || !session.data) return;
  session.data.flags[tasteFlag(npcId, reaction, itemId)] = true;
}

export interface FriendPage {
  id: string;
  name: string;
  hearts: number;
  maxHearts: number;
  /** 0–1: wie weit bis zum nächsten Herz (bei voller Freundschaft 1) */
  fill: number;
  loves: string[];
  likes: string[];
  dislikes: string[];
  /** „Beim nächsten Herz schreibt dir Lars wieder.“ */
  next: string;
}

export function friendPages(session: Session): FriendPage[] {
  const data = session.data;
  if (!data) return [];
  const pages: FriendPage[] = [];
  for (const npc of NPCS) {
    if (!hasMovedIn(session, npc.id)) continue;
    const st = npcState(session, npc.id);
    const hearts = heartsFor(st.points);
    const prefix = `geschmack:${npc.id}:`;
    const found: Record<SeenReaction, string[]> = { liebt: [], mag: [], 'mag-nicht': [] };
    for (const key of Object.keys(data.flags)) {
      if (!key.startsWith(prefix) || !data.flags[key]) continue;
      const [reaction, ...rest] = key.slice(prefix.length).split(':');
      const name = itemDef(rest.join(':'))?.name;
      if ((SEEN as readonly string[]).includes(reaction) && name) found[reaction as SeenReaction].push(name);
    }
    const nextLetter = npc.heartLetters[hearts + 1];
    pages.push({
      id: npc.id,
      name: NPC_BY_ID[npc.id].name,
      hearts,
      maxHearts: MAX_HEARTS,
      fill: heartProgress(st.points),
      loves: found.liebt.sort((a, b) => a.localeCompare(b, 'de')),
      likes: found.mag.sort((a, b) => a.localeCompare(b, 'de')),
      dislikes: found['mag-nicht'].sort((a, b) => a.localeCompare(b, 'de')),
      next: hearts < MAX_HEARTS && nextLetter ? `Beim nächsten Herz schreibt dir ${npc.name} wieder.` : '',
    });
  }
  return pages;
}
