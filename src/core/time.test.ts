import { describe, expect, it } from 'vitest';
import {
  createClock,
  formatDate,
  formatIsoDay,
  formatTime,
  getDayPhase,
  getDaylight,
  getSeason,
  isSameDayMonth,
  parseTimeOverride,
} from './time';

const at = (y: number, mo: number, d: number, h = 12, mi = 0) => new Date(y, mo - 1, d, h, mi, 0, 0);

describe('Jahreszeiten', () => {
  it.each([
    [at(2026, 3, 1), 'fruehling'],
    [at(2026, 5, 31), 'fruehling'],
    [at(2026, 6, 1), 'sommer'],
    [at(2026, 8, 31), 'sommer'],
    [at(2026, 9, 1), 'herbst'],
    [at(2026, 11, 2), 'herbst'],
    [at(2026, 12, 1), 'winter'],
    [at(2027, 2, 28), 'winter'],
  ] as const)('%s → %s', (date, season) => {
    expect(getSeason(date)).toBe(season);
  });
});

describe('Tagesphasen', () => {
  it('ordnet Uhrzeiten den Phasen zu', () => {
    expect(getDayPhase(at(2026, 1, 1, 2))).toBe('nacht');
    expect(getDayPhase(at(2026, 1, 1, 6))).toBe('morgendaemmerung');
    expect(getDayPhase(at(2026, 1, 1, 9))).toBe('morgen');
    expect(getDayPhase(at(2026, 1, 1, 12))).toBe('mittag');
    expect(getDayPhase(at(2026, 1, 1, 15))).toBe('nachmittag');
    expect(getDayPhase(at(2026, 1, 1, 19))).toBe('abend');
    expect(getDayPhase(at(2026, 1, 1, 21))).toBe('abenddaemmerung');
    expect(getDayPhase(at(2026, 1, 1, 23))).toBe('nacht');
  });
});

describe('Tageslicht', () => {
  it('ist mittags neutral und nachts dunkel', () => {
    expect(getDaylight(at(2026, 6, 1, 12))).toEqual({ tint: '#ffffff', night: 0 });
    const midnight = getDaylight(at(2026, 6, 1, 0, 30));
    expect(midnight.night).toBe(1);
    expect(midnight.tint).toBe('#6669ad');
  });

  it('wird abends allmählich dunkler', () => {
    const values = [17, 18, 19, 20, 21, 22].map((h) => getDaylight(at(2026, 6, 1, h)).night);
    for (let i = 1; i < values.length; i++) expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
    expect(values[0]).toBe(0);
    expect(values[values.length - 1]).toBe(1);
  });

  it('liefert immer gültige Farben', () => {
    for (let m = 0; m < 24 * 60; m += 7) {
      const d = at(2026, 6, 1, Math.floor(m / 60), m % 60);
      const light = getDaylight(d);
      expect(light.tint).toMatch(/^#[0-9a-f]{6}$/);
      expect(light.night).toBeGreaterThanOrEqual(0);
      expect(light.night).toBeLessThanOrEqual(1);
    }
  });
});

describe('Formatierung', () => {
  it('formatiert Uhrzeit und Datum auf Deutsch', () => {
    const d = at(2026, 11, 2, 9, 5);
    expect(formatTime(d)).toBe('09:05');
    expect(formatDate(d)).toBe('Montag, 2. November');
    expect(formatIsoDay(d)).toBe('2026-11-02');
  });
});

describe('Zeit-Überschreibung per URL', () => {
  it('liest Uhrzeit und Datum', () => {
    expect(parseTimeOverride('?zeit=21:30')).toEqual({ time: { hours: 21, minutes: 30 } });
    expect(parseTimeOverride('?datum=2026-12-24&zeit=8:00')).toEqual({
      date: { year: 2026, month: 12, day: 24 },
      time: { hours: 8, minutes: 0 },
    });
  });

  it('ignoriert Unsinn', () => {
    expect(parseTimeOverride('')).toBeNull();
    expect(parseTimeOverride('?zeit=25:00')).toBeNull();
    expect(parseTimeOverride('?datum=2026-02-30')).toBeNull();
    expect(parseTimeOverride('?zeit=abc')).toBeNull();
  });

  it('startet die Uhr beim gewünschten Zeitpunkt und lässt sie weiterlaufen', () => {
    let fake = at(2026, 11, 2, 10, 0).getTime();
    const clock = createClock({ date: { year: 2026, month: 12, day: 24 }, time: { hours: 18, minutes: 0 } }, () => fake);
    expect(formatIsoDay(clock())).toBe('2026-12-24');
    expect(formatTime(clock())).toBe('18:00');
    fake += 5 * 60 * 1000;
    expect(formatTime(clock())).toBe('18:05');
  });

  it('nutzt ohne Überschreibung die Systemzeit', () => {
    const fake = at(2026, 11, 2, 10, 0).getTime();
    expect(createClock(null, () => fake)().getTime()).toBe(fake);
  });
});

describe('Besondere Tage', () => {
  it('erkennt Linas Geburtstag', () => {
    expect(isSameDayMonth(at(2027, 6, 16), { day: 16, month: 6 })).toBe(true);
    expect(isSameDayMonth(at(2027, 6, 15), { day: 16, month: 6 })).toBe(false);
  });
});
