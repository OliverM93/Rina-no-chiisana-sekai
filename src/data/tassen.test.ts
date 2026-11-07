import { describe, expect, it } from 'vitest';
import { FURNITURE_BY_ITEM } from './furniture';
import { NPCS } from './npcs';
import { TRAVELS, travelMugLetter, travelPostcard } from './npcs/jens';
import { TASSEN } from './tassen';

describe('Sammeltassen', () => {
  it('sind kleine Möbel: Klassik & Saison kaufbar, Städte-Tassen nur als Geschenk', () => {
    expect(TASSEN.filter((t) => t.kind === 'klassik').length).toBeGreaterThanOrEqual(3);
    expect(TASSEN.filter((t) => t.kind === 'stadt').length).toBeGreaterThanOrEqual(10);
    for (const t of TASSEN) {
      const f = FURNITURE_BY_ITEM[t.id];
      expect(f, t.id).toBeTruthy();
      expect(f.def.small, t.id).toBe(true);
      expect(!!f.def.gift, t.id).toBe(t.kind === 'stadt');
      expect(f.def.inSeason, t.id).toBe(t.season);
    }
    // jede Jahreszeit hat ihre Saison-Tasse
    expect(new Set(TASSEN.filter((t) => t.kind === 'saison').map((t) => t.season)).size).toBe(4);
  });

  it('jede Städte-Tasse hat eine Quelle: Jens’ Reisen, Thalias oder Olis Briefe', () => {
    const fromTravels = new Set(TRAVELS.flatMap((t) => [t.souvenir, t.mug ?? '']));
    const fromLetters = new Set(NPCS.flatMap((n) => [...n.letters, ...Object.values(n.heartLetters)]).map((l) => l.gift?.itemId ?? ''));
    for (const t of TASSEN.filter((x) => x.kind === 'stadt')) expect(fromTravels.has(t.id) || fromLetters.has(t.id), t.id).toBe(true);
  });

  it('Jens schickt zu den ersten Reisen eine zweite Karte mit Tasse, bei den neuen ist die Tasse das Andenken', () => {
    TRAVELS.forEach((t, i) => {
      const mug = travelMugLetter('2026-07-10', i);
      if (t.mug) expect(mug?.gift?.itemId).toBe(t.mug);
      else {
        expect(mug).toBeNull();
        expect(travelPostcard('2026-07-10', i).gift?.itemId).toBe(t.souvenir);
        expect(t.souvenir.startsWith('tasse-')).toBe(true);
      }
    });
  });

  it('das Tassenregal hat Platz für mehrere Tassen', () => {
    const regal = FURNITURE_BY_ITEM['tassenregal'];
    expect(regal.def.surface).toBe(true);
    expect(regal.def.w).toBeGreaterThanOrEqual(3);
  });
});
