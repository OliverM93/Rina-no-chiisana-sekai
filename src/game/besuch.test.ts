import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import { createNpcState } from '../core/friendship';
import type { StorageLike } from '../core/save';
import { VISITORS, VISITS } from '../data/besuch';
import { NPC_BY_ID } from '../data/npcs';
import { arrivalLines, canInvite, finishVisit, inviteNpc, isInvited, visitComments, visitCount, visitDue, visitLine } from './besuch';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

function fresh(time = '2026-06-10T14:00:00') {
  let now = new Date(time);
  const s = new Session(memoryStorage(), () => now);
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  s.data!.flags.giselaWelcomed = true;
  return { s, setTime: (t: string) => (now = new Date(t)) };
}

describe('Besuch bei Lina', () => {
  it('jede Person, die kommen kann, hat vollständige Texte; Oli ist nicht dabei', () => {
    expect(VISITORS).not.toContain('oli');
    for (const id of VISITORS) {
      const v = VISITS[id];
      expect(NPC_BY_ID[id], id).toBeDefined();
      expect(v.invited.length, id).toBeGreaterThan(0);
      expect(v.waiting.length, id).toBeGreaterThan(0);
      expect(v.arrive.length, id).toBeGreaterThan(0);
      expect(v.generic.length, id).toBeGreaterThan(0);
      expect(v.bye.length, id).toBeGreaterThan(5);
    }
  });

  it('einladen geht erst mit einem Herz und nur einmal', () => {
    const { s } = fresh();
    expect(canInvite(s, 'gisela')).toBe(false); // 0 Herzen
    s.data!.npcs.gisela = { ...createNpcState(), points: 50 };
    expect(canInvite(s, 'gisela')).toBe(true);
    expect(canInvite(s, 'oli')).toBe(false);
    expect(canInvite(s, 'lars')).toBe(false); // noch nicht eingezogen
    expect(inviteNpc(s, 'gisela')).toEqual([...VISITS.gisela.invited]);
    expect(isInvited(s, 'gisela')).toBe(true);
    expect(canInvite(s, 'gisela')).toBe(false);
    expect(inviteNpc(s, 'gisela')).toEqual([...VISITS.gisela.waiting]);
  });

  it('der Gast kommt nur tagsüber und der Reihe nach', () => {
    const { s, setTime } = fresh();
    s.data!.npcs.gisela = { ...createNpcState(), points: 50 };
    expect(visitDue(s)).toBeNull();
    inviteNpc(s, 'gisela');
    expect(visitDue(s)).toBe('gisela');
    setTime('2026-06-10T22:30:00');
    expect(visitDue(s)).toBeNull();
    setTime('2026-06-10T07:30:00');
    expect(visitDue(s)).toBeNull();
    setTime('2026-06-11T10:00:00');
    expect(visitDue(s)).toBe('gisela');
  });

  it('der Gast spricht über das, was wirklich im Haus ist – sonst allgemein', () => {
    const { s } = fresh();
    s.data!.npcs.gisela = { ...createNpcState(), points: 50 };
    const generic = VISITS.gisela.generic.map((g) => g.join(' '));
    expect(generic).toContain(visitLine(s, 'gisela', 0).join(' '));
    s.data!.house.stage = 4; // Dachzimmer und Küche vorhanden
    const lines = [0, 1, 2, 3].map((n) => visitLine(s, 'gisela', n).join(' '));
    expect(lines.some((l) => l.includes('Dachzimmer'))).toBe(true);
    // Rotation: nach dem letzten Satz geht es von vorn los
    const len = visitComments(s, 'gisela').length;
    expect(len).toBeGreaterThan(2);
    expect(visitLine(s, 'gisela', len + 1)).toEqual(visitLine(s, 'gisela', 1));
  });

  it('Begrüßung beginnt mit der Begrüßung der Person', () => {
    const { s } = fresh();
    const lines = arrivalLines(s, 'christin');
    expect(lines.slice(0, VISITS.christin.arrive.length)).toEqual([...VISITS.christin.arrive]);
    expect(lines.length).toBeGreaterThan(VISITS.christin.arrive.length);
  });

  it('nach dem Besuch ist die Einladung erfüllt, gezählt und heute nicht gleich wieder möglich', () => {
    const { s } = fresh();
    s.data!.npcs.gisela = { ...createNpcState(), points: 50 };
    inviteNpc(s, 'gisela');
    expect(finishVisit(s, 'gisela')).toBe(VISITS.gisela.bye);
    expect(isInvited(s, 'gisela')).toBe(false);
    expect(visitCount(s, 'gisela')).toBe(1);
    expect(visitDue(s)).toBeNull();
    expect(canInvite(s, 'gisela')).toBe(false); // heute schon da gewesen
  });
});
