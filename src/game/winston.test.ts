import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { INTRO_LINES } from '../data/story';
import { GISELA } from '../data/npcs/gisela';
import { WINSTON_DELAY_SECONDS } from '../data/winston';
import { talkToNpc } from './gameplay';
import { winstonAppeared, winstonDue, winstonFound, winstonOmaLines, winstonState } from './pet';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

function fresh() {
  const s = new Session(memoryStorage(), () => new Date('2026-05-12T12:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  return s;
}

describe('Winston wird gefunden', () => {
  it('neue Spiele starten ohne Winston, die Einführung erwähnt ihn nicht', () => {
    const s = fresh();
    expect(winstonState(s)).toBe('fehlt');
    expect(INTRO_LINES.join(' ')).not.toContain('Winston');
  });

  it('erst nach Omas Werkzeugen und etwas Spielzeit fiept es', () => {
    const s = fresh();
    s.data!.playTimeSec = 5000;
    expect(winstonDue(s)).toBe(false); // Werkzeuge noch nicht übergeben
    s.data!.flags.toolsGiven = true;
    expect(winstonDue(s)).toBe(false); // Uhr startet erst jetzt
    s.data!.playTimeSec += WINSTON_DELAY_SECONDS - 1;
    expect(winstonDue(s)).toBe(false);
    s.data!.playTimeSec += 2;
    expect(winstonDue(s)).toBe(true);
    winstonAppeared(s);
    expect(winstonState(s)).toBe('verfangen');
    expect(winstonDue(s)).toBe(false);
    winstonFound(s);
    expect(winstonState(s)).toBe('da');
  });

  it('ältere Spielstände haben Winston schon', () => {
    const s = fresh();
    delete s.data!.flags.winstonNochNicht;
    expect(winstonState(s)).toBe('da');
    expect(winstonOmaLines(s, 'gisela')).toEqual([]);
  });

  it('Zeilen, die Winston nennen, kommen erst, wenn er da ist', () => {
    const s = fresh();
    const winstonLines = GISELA.dialogue.chat.filter((l) => [l.text].flat().join(' ').includes('Winston'));
    expect(winstonLines.length).toBeGreaterThan(0);
    for (let i = 0; i < 40; i++) {
      const out = talkToNpc(s, 'gisela');
      expect(out.lines.join(' ')).not.toContain('Winston');
      s.data!.npcs.gisela.lastTalkDay = '';
      s.data!.npcs.gisela.talksToday = i;
    }
  });

  it('Oma kommentiert Winston genau einmal', () => {
    const s = fresh();
    winstonAppeared(s);
    winstonFound(s);
    expect(winstonOmaLines(s, 'olaf')).toEqual([]);
    expect(winstonOmaLines(s, 'gisela').join(' ')).toContain('Leberwurstbrot');
    expect(winstonOmaLines(s, 'gisela')).toEqual([]);
  });
});
