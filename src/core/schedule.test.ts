import { describe, expect, it } from 'vitest';
import { GISELA } from '../data/npcs/gisela';
import { NPCS } from '../data/npcs';
import { activityAt, parseHHMM, validateSchedule } from './schedule';

const at = (h: number, m = 0) => new Date(2026, 10, 2, h, m);

describe('Tagesablauf', () => {
  it('liest Uhrzeiten', () => {
    expect(parseHHMM('07:30')).toBe(450);
    expect(() => parseHHMM('7.30')).toThrow();
  });

  it('findet die richtige Aktivität', () => {
    expect(activityAt(GISELA.schedule, at(3)).label).toBe('schläft');
    expect(activityAt(GISELA.schedule, at(7)).activity.kind).toBe('sitzen');
    expect(activityAt(GISELA.schedule, at(10, 29)).label).toContain('Morgenkaffee');
    expect(activityAt(GISELA.schedule, at(10, 30)).activity.kind).toBe('spazieren');
    expect(activityAt(GISELA.schedule, at(23, 59)).label).toBe('schläft');
  });

  it('nimmt vor dem ersten Eintrag den letzten (über Mitternacht)', () => {
    const s = [
      { from: '08:00', label: 'wach', activity: { kind: 'zuhause' as const } },
      { from: '22:00', label: 'schläft', activity: { kind: 'zuhause' as const, sleeping: true } },
    ];
    expect(activityAt(s, at(2)).label).toBe('schläft');
  });

  it('alle Bewohner haben gültige Tagesabläufe', () => {
    for (const npc of NPCS) expect(validateSchedule(npc.schedule), npc.id).toEqual([]);
    expect(validateSchedule([{ from: '10:00', label: '', activity: { kind: 'zuhause' } }, { from: '09:00', label: '', activity: { kind: 'zuhause' } }])).toHaveLength(1);
  });
});
