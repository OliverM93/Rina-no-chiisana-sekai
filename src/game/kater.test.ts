import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { KATER_FIRST, KATER_HELLO, KATER_PET_AGAIN, KATER_PET_FIRST } from '../data/kater';
import { MEMORIES } from '../data/erinnerungen';
import { katerDa, katerDraussen, katerHello, katerPet } from './kater';
import { memoryTags, takeMemory } from './erinnerungen';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function session(time = '2026-06-10T14:00:00') {
  const m = new Map<string, string>();
  const storage: StorageLike = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
  let now = new Date(time);
  const s = new Session(storage, () => now);
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return { s, setTime: (t: string) => (now = new Date(t)) };
}

const olafDa = (s: Session) => Object.assign(s.data!.flags, { olafEingezogen: true, olafBegruesst: true });

describe('Kater', () => {
  it('taucht erst auf, wenn Olaf und Christin im Dorf wohnen', () => {
    const { s } = session();
    expect(katerDa(s)).toBe(false);
    expect(katerDraussen(s)).toBe(false);
    olafDa(s);
    expect(katerDa(s)).toBe(true);
    expect(katerDraussen(s)).toBe(true);
  });

  it('ist nachts nicht draußen', () => {
    const { s, setTime } = session();
    olafDa(s);
    setTime('2026-06-10T23:00:00');
    expect(katerDraussen(s)).toBe(false);
    setTime('2026-06-10T05:30:00');
    expect(katerDraussen(s)).toBe(false);
    setTime('2026-06-11T08:00:00');
    expect(katerDraussen(s)).toBe(true);
  });

  it('erstes Treffen ist ein eigener Moment, danach wechselnde Zeilen', () => {
    const { s } = session();
    olafDa(s);
    expect(katerHello(s)).toEqual([...KATER_FIRST]);
    const again = katerHello(s);
    expect(KATER_HELLO.map((l) => l.join('|'))).toContain(again.join('|'));
  });

  it('Streicheln: erstes Mal am Tag mit Herzchen, danach kleine Zeilen, am nächsten Tag wieder besonders', () => {
    const { s, setTime } = session();
    olafDa(s);
    const a = katerPet(s);
    expect(a.first).toBe(true);
    expect(KATER_PET_FIRST.map((l) => l.join('|'))).toContain(a.lines.join('|'));
    const b = katerPet(s);
    expect(b.first).toBe(false);
    expect(KATER_PET_AGAIN).toContain(b.lines[0]);
    setTime('2026-06-11T14:00:00');
    expect(katerPet(s).first).toBe(true);
  });

  it('Olaf und Christin haben Kater-Zeilen, einige Bewohner erinnern sich an Igor – nur wenn Olaf da ist', () => {
    const { s } = session();
    expect(memoryTags(s)).not.toContain('kater');
    expect(memoryTags(s)).not.toContain('igor');
    olafDa(s);
    expect(memoryTags(s)).toEqual(expect.arrayContaining(['kater', 'igor']));
    expect(MEMORIES.filter((m) => m.npc === 'olaf' && m.tag === 'kater').length).toBeGreaterThanOrEqual(3);
    expect(MEMORIES.filter((m) => m.npc === 'christin' && m.tag === 'kater').length).toBeGreaterThanOrEqual(3);
    const igorBy = MEMORIES.filter((m) => m.tag === 'igor').map((m) => m.npc);
    expect(igorBy).toEqual(expect.arrayContaining(['olaf', 'christin', 'gisela']));
    // Olaf erzählt eine Kater-Erinnerung einmal von sich aus
    const lines = takeMemory(s, 'olaf');
    expect(lines.length).toBeGreaterThan(0);
  });

  it('Igor wird warm und ohne Drama erwähnt: er fehlt, aber niemand wird schwer', () => {
    for (const m of MEMORIES.filter((x) => x.tag === 'igor')) {
      const text = (typeof m.text === 'string' ? [m.text] : [...m.text]).join(' ');
      expect(text, m.id).toContain('Igor');
      expect(text, m.id).toMatch(/vermiss|fehlt|Herzen|Leine|Keks|warm/);
    }
  });
});
