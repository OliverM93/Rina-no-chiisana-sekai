import { describe, expect, it } from 'vitest';
import { buildWorldMap, objectById } from '../core/worldmap';
import { VILLAGE_LAYOUT, VILLAGE_OBJECTS, VILLAGE_SPAWN } from './maps/village';
import { MEETUPS } from './meetups';
import { NPC_BY_ID } from './npcs';

describe('Treffen der Bewohner', () => {
  const map = buildWorldMap(VILLAGE_LAYOUT, VILLAGE_OBJECTS, VILLAGE_SPAWN);
  it('Plätze sind frei, Bänke gibt es, Mitglieder existieren', () => {
    for (const m of MEETUPS) {
      expect(m.talks.length, m.id).toBeGreaterThan(0);
      for (const id of m.members) {
        expect(NPC_BY_ID[id], `${m.id}:${id}`).toBeTruthy();
        const s = m.spots[id];
        expect(s, `${m.id}:${id}`).toBeTruthy();
        if (s.bench) expect(objectById(map, s.bench), s.bench).toBeTruthy();
        else expect(map.grid.isBlocked(s.x, s.y), `${m.id}:${id} @${s.x},${s.y}`).toBe(false);
      }
    }
  });

  it('jedes Mitglied hat Antworten, wenn man es beim Treffen anspricht', () => {
    for (const m of MEETUPS) for (const id of m.members) expect(m.replies[id]?.length, `${m.id}:${id}`).toBeGreaterThanOrEqual(2);
  });

  it('Treffen überschneiden sich nicht für dieselbe Person', () => {
    for (const a of MEETUPS) for (const b of MEETUPS) {
      if (a === b || !a.members.some((x) => b.members.includes(x))) continue;
      const sameDay = a.weekdays.some((d) => b.weekdays.includes(d));
      const overlap = a.hours[0] < b.hours[1] && b.hours[0] < a.hours[1];
      expect(sameDay && overlap, `${a.id} / ${b.id}`).toBe(false);
    }
  });
});
