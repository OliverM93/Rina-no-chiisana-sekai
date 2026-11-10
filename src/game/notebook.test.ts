import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { wishToldFlag } from '../data/wishes';
import { orderExpansion } from './home';
import { notebook } from './notebook';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

function newSession() {
  const s = new Session(memoryStorage(), () => new Date('2026-11-10T12:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return s;
}

describe('Linas Notizbuch', () => {
  it('zeigt die Hinweise des Bewohners, solange für den nächsten Einzug etwas fehlt', () => {
    const s = newSession();
    s.data!.flags.toolsGiven = true;
    const nb = notebook(s);
    expect(nb.story.length).toBeGreaterThan(0);
    expect(nb.story[0].by).toBeTruthy();
    // keine Zahlen/Prozente in den Notizen zur Geschichte
    expect(nb.story.map((n) => n.text).join(' ')).not.toMatch(/\d+\s*%|\d+\/\d+/);
  });

  it('nach der Ankündigung: „bald ist es so weit“ statt Hinweise', () => {
    const s = newSession();
    Object.assign(s.data!.flags, { toolsGiven: true, olafAngekuendigt: true });
    const nb = notebook(s);
    expect(nb.story).toHaveLength(1);
    expect(nb.story[0].text).toContain('bald');
  });

  it('Herzenswünsche: erzählte mit Bedarf, nicht erzählte nur als Neugier-Hinweis', () => {
    const s = newSession();
    Object.assign(s.data!.flags, { thaliaBegruesst: true, [wishToldFlag('oma-beet')]: true });
    const nb = notebook(s);
    expect(nb.wishes.find((w) => w.needs.some((n) => n.includes('Rosen')))).toBeTruthy();
    expect(nb.untold.length).toBeGreaterThan(0);
  });

  it('Zuhause erst mit Papas Dorfkasse; laufender Ausbau und Kredit werden erwähnt', () => {
    const s = newSession();
    expect(notebook(s).home).toHaveLength(0);
    s.data!.flags.olafEingezogen = true;
    expect(notebook(s).home.join(' ')).toContain('Nächster Ausbau');
    expect(orderExpansion(s)).toBe('ok');
    const home = notebook(s).home.join(' ');
    expect(home).toContain('gebaut');
    expect(home).toContain('ohne Eile');
  });
});
