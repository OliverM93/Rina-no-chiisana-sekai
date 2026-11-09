import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { FURNITURE_BY_ITEM } from '../data/furniture';
import { SAMMLUNGEN, urkundeId } from '../data/sammlungen';
import { FINDS } from '../data/fossils';
import { FISH, INSECTS } from '../data/species';
import { NPC_BY_ID } from '../data/npcs';
import { catchFish } from './nature';
import { checkSammlungen, sammlungFortschritt } from './sammlungen';
import { Session } from './session';

vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));

function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

function fresh() {
  const s = new Session(memoryStorage(), () => new Date('2026-05-12T12:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  Object.assign(s.data!.flags, { olafEingezogen: true, olafBegruesst: true, jensEingezogen: true, jensBegruesst: true, larsEingezogen: true, larsBegruesst: true, thaliaEingezogen: true, thaliaBegruesst: true, oliEingezogen: true, oliBegruesst: true });
  return s;
}

describe('Sammlungen würdigen', () => {
  it('jede Sammlung hat einen Absender, eine Urkunde als Möbel und einen Brief', () => {
    for (const c of SAMMLUNGEN) {
      expect(NPC_BY_ID[c.npc], c.id).toBeTruthy();
      const f = FURNITURE_BY_ITEM[urkundeId(c.id)];
      expect(f?.def.wall, c.id).toBe(true);
      expect(f?.def.gift, c.id).toBe(true);
      expect(c.body.length).toBeGreaterThan(60);
    }
  });

  it('nichts passiert, solange die Sammlung nicht komplett ist', () => {
    const s = fresh();
    expect(checkSammlungen(s)).toEqual([]);
    expect(sammlungFortschritt(s, 'fische')).toEqual({ have: 0, total: FISH.length });
  });

  it('alle Fische → Brief von Jens mit Urkunde, genau einmal', () => {
    const s = fresh();
    for (const f of FISH.slice(0, -1)) s.data!.collection[f.id] = { count: 1, firstDay: '2026-05-12' };
    expect(checkSammlungen(s)).toEqual([]);
    catchFish(s, FISH[FISH.length - 1]); // der letzte Fang löst es aus
    const mail = s.data!.mail.letters.find((l) => l.id === 'jens-sammlung-fische' || l.id.includes('sammlung-fische'));
    expect(mail?.gift?.itemId).toBe('urkunde-fische');
    expect(mail?.from).toBe('Jens');
    expect(checkSammlungen(s)).toEqual([]);
    expect(s.data!.mail.letters.filter((l) => l.id.includes('sammlung-fische')).length).toBe(1);
  });

  it('der Absender muss im Dorf wohnen – sonst kommt der Brief später', () => {
    const s = fresh();
    delete s.data!.flags.thaliaBegruesst;
    for (const f of FINDS) s.data!.collection[f.id] = { count: 1, firstDay: '2026-05-12' };
    expect(checkSammlungen(s)).toEqual([]);
    s.data!.flags.thaliaBegruesst = true;
    expect(checkSammlungen(s)).toEqual(['Alle Funde']);
  });

  it('Insekten & Tassen in der Vorratstruhe zählen mit', () => {
    const s = fresh();
    for (const i of INSECTS) s.data!.collection[i.id] = { count: 1, firstDay: '2026-05-12' };
    expect(checkSammlungen(s)).toEqual(['Alle Krabbeltiere']);
    expect(sammlungFortschritt(s, 'tassen').have).toBe(0);
    s.data!.storage.slots[0] = { itemId: 'tasse-klassik-gruen', count: 1 };
    expect(sammlungFortschritt(s, 'tassen').have).toBe(1);
  });
});
