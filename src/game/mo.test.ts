import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { MO_MEETING } from '../data/mo';
import { LOOKS } from '../data/npcs/looks';
import { MOMENTS } from '../data/album';
import { memoryTags } from './erinnerungen';
import { addFriendship, npcHearts } from './gameplay';
import { canInviteMo, inviteMo, MO_THALIA_HEARTS, moAtParty, talkToMo } from './mo';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function sessionAt(iso: string) {
  let now = new Date(iso);
  const m = new Map<string, string>();
  const st: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  const s = new Session(st, () => now);
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  Object.assign(s.data!.flags, { oliEingezogen: true, thaliaEingezogen: true, thaliaBegruesst: true });
  return { s, set: (d: string) => (now = new Date(d)) };
}

describe('Mo zu Besuch', () => {
  it('hat ein eigenes Aussehen (kurze Haare, Steppweste, Dreitagebart)', () => {
    expect(LOOKS.mo.outfit).toBe('steppweste');
    expect(LOOKS.mo.hairStyle).toBe('kurzhaar');
    expect(LOOKS.mo.beard).toBe('stoppel');
  });

  it('Lina kann Mo erst einladen, wenn Oli und Thalia da sind und Thalia sie mag', () => {
    const { s } = sessionAt('2026-11-20T12:00:00');
    expect(canInviteMo(s)).toBe(false);
    while (npcHearts(s, 'thalia') < MO_THALIA_HEARTS) addFriendship(s, 'thalia', 20);
    expect(canInviteMo(s)).toBe(true);
    expect(inviteMo(s).join(' ')).toContain('Mo');
    expect(canInviteMo(s)).toBe(false);
  });

  it('Mo kommt zur Samstagsparty – aus Thalia und Mo wird nichts, aber der Abend ist schön', () => {
    const { s, set } = sessionAt('2026-11-20T20:00:00'); // Freitag
    s.data!.flags.moEingeladen = true;
    expect(moAtParty(s)).toBe(false);
    set('2026-11-21T20:00:00'); // Samstag, Party
    expect(moAtParty(s)).toBe(true);
    const lines = talkToMo(s).join(' ');
    expect(lines).toContain('Jule');
    expect(lines).toContain('vergeben');
    expect(s.data!.flags.moKennengelernt).toBe(true);
    expect(memoryTags(s)).toContain('mo-kennengelernt');
    expect(MOMENTS.some((m) => m.id === 'mo-party')).toBe(true);
    // danach: kurzer Plausch statt der ganzen Szene
    expect(talkToMo(s)).not.toEqual([...MO_MEETING]);
  });
});
