import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { checkDailyMail, hasMovedIn } from './gameplay';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

/** Spielt ein paar Wochen Tage durch und gibt zurück, von wem Post kam */
function sendersOverWeeks(s: Session, setNow: (d: Date) => void): Set<string> {
  const senders = new Set<string>();
  for (let d = 1; d <= 28; d++) {
    setNow(new Date(`2026-03-${String(d).padStart(2, '0')}T12:00:00`));
    checkDailyMail(s);
  }
  for (const l of s.data!.mail.letters) senders.add(l.from);
  return senders;
}

describe('Post kommt erst, wenn der Bewohner wirklich eingezogen ist', () => {
  it('nach der Ankündigung (noch nicht eingezogen) kommt keine weitere Post', () => {
    let now = new Date('2026-03-01T12:00:00');
    const s = new Session(memoryStorage(), () => now);
    s.startNewGame(DEFAULT_LINA, 'Testdorf');
    s.data!.flags.olafAngekuendigt = true;
    s.data!.flags.oliAngekuendigt = true;
    const senders = sendersOverWeeks(s, (d) => (now = d));
    expect(senders.has('Olaf')).toBe(false);
    expect(senders.has('Oli')).toBe(false);
    expect(senders.has('Oma Gisela')).toBe(true); // Oma wohnt schon im Dorf
  });

  it('erst nach Einzug und Begrüßung', () => {
    let now = new Date('2026-03-01T12:00:00');
    const s = new Session(memoryStorage(), () => now);
    s.startNewGame(DEFAULT_LINA, 'Testdorf');
    s.data!.flags.olafEingezogen = true;
    expect(hasMovedIn(s, 'olaf')).toBe(false); // eingezogen, aber die Begrüßungsszene war noch nicht
    expect(hasMovedIn(s, 'gisela')).toBe(true);
    s.data!.flags.olafBegruesst = true;
    expect(hasMovedIn(s, 'olaf')).toBe(true);
    expect(hasMovedIn(s, 'christin')).toBe(true); // Christin zieht mit Olaf ein
    expect(sendersOverWeeks(s, (d) => (now = d)).has('Olaf')).toBe(true);
  });
});
