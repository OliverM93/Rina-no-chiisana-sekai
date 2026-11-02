/**
 * Briefkasten: Briefe (manchmal mit Geschenk) von den Bewohnern.
 */
import { hashString } from './rng';

export interface Letter {
  id: string;
  from: string;
  subject: string;
  body: string;
  gift?: { itemId: string; count: number };
  /** Tag, an dem der Brief ankam */
  day: string;
  read: boolean;
  giftTaken: boolean;
}

export interface Mailbox {
  letters: Letter[];
  /** Tag, an dem zuletzt nach neuer Post geschaut wurde */
  lastCheckDay: string;
}

export const MAX_LETTERS = 40;

export function createMailbox(): Mailbox {
  return { letters: [], lastCheckDay: '' };
}

/** Ungelesen oder mit noch nicht abgeholtem Geschenk */
export function isOpen(l: Letter): boolean {
  return !l.read || (!!l.gift && !l.giftTaken);
}

export function unreadCount(box: Mailbox): number {
  return box.letters.filter(isOpen).length;
}

export function deliver(box: Mailbox, letter: Omit<Letter, 'read' | 'giftTaken'>): boolean {
  if (box.letters.some((l) => l.id === letter.id)) return false;
  box.letters.unshift({ ...letter, read: false, giftTaken: false });
  // Alte, gelesene Briefe ohne offenes Geschenk dürfen gehen, wenn es zu viele werden.
  while (box.letters.length > MAX_LETTERS) {
    const idx = box.letters.map(isOpen).lastIndexOf(false);
    if (idx === -1) break;
    box.letters.splice(idx, 1);
  }
  return true;
}

/** Reproduzierbarer „Zufall“: kommt heute ein Brief von jemandem? (ca. jeder `every`-te Tag) */
export function mailDue(day: string, sender: string, every = 3): boolean {
  return hashString(`${sender}:post:${day}`) % every === 0;
}

export function normalizeMailbox(raw: unknown): Mailbox {
  const box = createMailbox();
  if (!raw || typeof raw !== 'object') return box;
  const r = raw as Record<string, unknown>;
  if (typeof r.lastCheckDay === 'string') box.lastCheckDay = r.lastCheckDay;
  if (Array.isArray(r.letters)) {
    for (const l of r.letters) {
      if (!l || typeof l !== 'object') continue;
      const x = l as Record<string, unknown>;
      if (typeof x.id !== 'string' || typeof x.body !== 'string') continue;
      const gift =
        x.gift && typeof x.gift === 'object' && typeof (x.gift as Record<string, unknown>).itemId === 'string'
          ? {
              itemId: (x.gift as Record<string, unknown>).itemId as string,
              count: Math.max(1, Number((x.gift as Record<string, unknown>).count) || 1),
            }
          : undefined;
      box.letters.push({
        id: x.id,
        from: typeof x.from === 'string' ? x.from : '',
        subject: typeof x.subject === 'string' ? x.subject : '',
        body: x.body,
        gift,
        day: typeof x.day === 'string' ? x.day : '',
        read: x.read === true,
        giftTaken: x.giftTaken === true,
      });
    }
  }
  return box;
}
