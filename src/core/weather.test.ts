import { describe, expect, it } from 'vitest';
import { parseWeatherOverride, weatherAt, weatherForDay } from './weather';

describe('Wetter', () => {
  it('ist pro Tag immer gleich', () => {
    expect(weatherForDay('2026-04-10', 'fruehling')).toEqual(weatherForDay('2026-04-10', 'fruehling'));
  });

  it('schneit nur im Winter, Gewitter nur im Sommer', () => {
    const kinds = new Set<string>();
    for (let d = 1; d <= 28; d++) {
      for (const [m, season] of [['04', 'fruehling'], ['07', 'sommer'], ['10', 'herbst'], ['01', 'winter']] as const) {
        const w = weatherForDay(`2026-${m}-${String(d).padStart(2, '0')}`, season);
        kinds.add(`${season}:${w.kind}`);
        if (w.kind === 'schnee') expect(season).toBe('winter');
        if (w.kind === 'gewitter') expect(season).toBe('sommer');
      }
    }
    expect(kinds.has('winter:schnee')).toBe(true);
    expect(kinds.has('fruehling:regen')).toBe(true);
  });

  it('Regen dauert ein paar Stunden, sonst bewölkt; danach ist der Tag „nass“', () => {
    let day = '';
    for (let d = 1; d <= 28 && !day; d++) {
      const id = `2026-10-${String(d).padStart(2, '0')}`;
      if (weatherForDay(id, 'herbst').kind === 'regen') day = id;
    }
    const w = weatherForDay(day, 'herbst');
    expect(w.to - w.from).toBeGreaterThanOrEqual(4);
    const during = weatherAt(new Date(`${day}T${String(w.from).padStart(2, '0')}:30:00`));
    expect(during.kind).toBe('regen');
    expect(during.rainedToday).toBe(true);
    if (w.from > 0) expect(weatherAt(new Date(`${day}T00:10:00`)).kind).toBe('wolkig');
  });

  it('Linas Geburtstag ist sonnig, Heiligabend schneit es', () => {
    for (const y of [2026, 2027, 2028]) expect(weatherForDay(`${y}-06-16`, 'sommer').kind).toBe('sonnig');
    expect(weatherAt(new Date('2026-12-24T18:00:00')).kind).toBe('schnee');
  });

  it('lässt sich per URL erzwingen', () => {
    expect(parseWeatherOverride('?wetter=regen')).toBe('regen');
    expect(parseWeatherOverride('?wetter=regenbogen')).toBe('regenbogen');
    expect(parseWeatherOverride('?wetter=hagel')).toBe(null);
    expect(weatherAt(new Date(), 'regenbogen').rainbow).toBe(true);
  });
});
