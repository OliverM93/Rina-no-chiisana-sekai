import { describe, expect, it } from 'vitest';
import { FURNITURE_ITEMS } from './furniture';
import { NPCS } from './npcs';
import { TRAVELS } from './npcs/jens';
import { FEST_GIFTS } from './festivals';
import { ART_BY_ID } from './art';
import { ADVENT_DOORS } from './winter';
import { WISHES_2 } from './wishes';
import { SAMMLUNGEN, urkundeId } from './sammlungen';

// Diese bringt Oli beim Einzug mit (siehe World3D.oliArrival)
const MOVE_IN_GIFTS = ['schreibtisch-pc', 'hantelbank'];

describe('Geschenk-Möbel', () => {
  it('jedes Möbel „nur als Geschenk“ kommt irgendwoher', () => {
    const fromLetters = new Set([...NPCS.flatMap((n) => [...n.letters, ...Object.values(n.heartLetters)]), ...ADVENT_DOORS].map((l) => l.gift?.itemId));
    for (const f of FURNITURE_ITEMS.filter((x) => x.def.gift && !x.def.retired)) expect(fromLetters.has(f.itemId) || MOVE_IN_GIFTS.includes(f.itemId) || TRAVELS.some((t) => t.souvenir === f.itemId || t.mug === f.itemId) || WISHES_2.some((w) => [...(w.rewardItems ?? []), ...(w.options?.flatMap((o) => o.rewardItems) ?? [])].some((r) => r.itemId === f.itemId)) || !!ART_BY_ID[f.itemId] || Object.values(FEST_GIFTS).some((g) => Object.values(g ?? {}).some((x) => x.itemId === f.itemId)), f.itemId).toBe(true);
    for (const f of FURNITURE_ITEMS.filter((x) => x.def.gift && !x.def.retired)) expect(fromLetters.has(f.itemId) || MOVE_IN_GIFTS.includes(f.itemId) || TRAVELS.some((t) => t.souvenir === f.itemId || t.mug === f.itemId) || SAMMLUNGEN.some((c) => urkundeId(c.id) === f.itemId) || !!ART_BY_ID[f.itemId] || Object.values(FEST_GIFTS).some((g) => Object.values(g ?? {}).some((x) => x.itemId === f.itemId)), f.itemId).toBe(true);
  });

  it('jedes Herz bringt bei jedem Bewohner einen Brief mit Geschenk', async () => {
    const { MAX_HEARTS } = await import('../core/friendship');
    const { isKnownItem } = await import('./items');
    for (const n of NPCS) {
      for (let h = 1; h <= MAX_HEARTS; h++) {
        const l = n.heartLetters[h];
        expect(l, `${n.id} Herz ${h}`).toBeTruthy();
        expect(l.gift && isKnownItem(l.gift.itemId), `${n.id} Herz ${h}: ${l.gift?.itemId}`).toBe(true);
      }
    }
  });

  it('Oli wohnt bei Lina und nennt sie Lini', () => {
    const oli = NPCS.find((n) => n.id === 'oli');
    expect(oli?.home).toBe('haus-lina');
    expect(oli?.dialogue.greetings.some((g) => [g.text].flat().join(' ').includes('Lini'))).toBe(true);
  });
});

describe('Onkel Jens', () => {
  it('reist ungefähr jeden 7. Tag – reproduzierbar', async () => {
    const { jensTravels } = await import('./npcs/jens');
    let n = 0;
    for (let d = 1; d <= 28; d++) for (const m of ['01', '04', '07']) if (jensTravels(`2026-${m}-${String(d).padStart(2, '0')}`)) n++;
    expect(n).toBeGreaterThan(5);
    expect(n).toBeLessThan(25);
    expect(jensTravels('2026-11-05')).toBe(jensTravels('2026-11-05'));
  });

  it('jede Postkarte bringt ein echtes Andenken mit', async () => {
    const { TRAVELS, travelPostcard } = await import('./npcs/jens');
    const { isKnownItem } = await import('./items');
    TRAVELS.forEach((t, i) => {
      expect(isKnownItem(t.souvenir), t.souvenir).toBe(true);
      expect(travelPostcard('2026-11-05', i).subject).toContain(t.city);
    });
  });
});

describe('Lars', () => {
  it('hat seinen Lieblingsspruch und Kräuter fürs Beet', async () => {
    const { LARS } = await import('./npcs/lars');
    const { GARDEN_FLOWER } = await import('./items');
    expect(LARS.dialogue.chat.some((c) => [c.text].flat().join(' ').includes('nicht mit e, sonst ist es ein See'))).toBe(true);
    expect(GARDEN_FLOWER.kamille?.seed).toBe('samen-kamille');
    expect(GARDEN_FLOWER.pfefferminze?.seed).toBe('samen-pfefferminze');
  });
});

describe('Thalia', () => {
  it('Funde sind Gegenstände, Schaufel ist kein Start-Werkzeug', async () => {
    const { FINDS } = await import('./fossils');
    const { isKnownItem, STARTER_TOOLS, TOOLS } = await import('./items');
    for (const f of FINDS) expect(isKnownItem(f.id), f.id).toBe(true);
    expect(TOOLS).toContain('schaufel');
    expect(STARTER_TOOLS).not.toContain('schaufel');
  });

  it('Party ist samstags 19–22 Uhr, erst wenn Thalia da ist', async () => {
    const { isPartyTime } = await import('../game/party');
    const fake = (flag: boolean) => ({ data: { flags: { thaliaBegruesst: flag } }, clock: () => new Date() }) as never;
    expect(isPartyTime(fake(true), new Date('2026-11-07T20:00:00'))).toBe(true);
    expect(isPartyTime(fake(true), new Date('2026-11-07T18:59:00'))).toBe(false);
    expect(isPartyTime(fake(true), new Date('2026-11-06T20:00:00'))).toBe(false);
    expect(isPartyTime(fake(false), new Date('2026-11-07T20:00:00'))).toBe(false);
  });
});

describe('Feste', () => {
  it('alle Fest-Geschenke sind echte Gegenstände von echten Bewohnern', async () => {
    const { isKnownItem } = await import('./items');
    const ids = new Set(NPCS.map((n) => n.id));
    for (const [f, byNpc] of Object.entries(FEST_GIFTS)) {
      for (const [npc, g] of Object.entries(byNpc ?? {})) {
        expect(ids.has(npc), `${f}:${npc}`).toBe(true);
        expect(isKnownItem(g.itemId), `${f}:${g.itemId}`).toBe(true);
      }
    }
  });
});

describe('Galerie & Sonntagsessen', () => {
  it('jedes Kunstwerk ist ein Möbel-Gegenstand mit Kunst-Stil', async () => {
    const { ARTWORKS } = await import('./art');
    const { FURNITURE_BY_ITEM } = await import('./furniture');
    for (const a of ARTWORKS) {
      expect(FURNITURE_BY_ITEM[a.id]?.def.style, a.id).toBe('kunst');
      expect(a.id).toMatch(/^[a-z-]+$/);
    }
  });

  it('Sonntagsessen: Lina, Oli, Lars immer – andere manchmal', async () => {
    const { dinnerGuests, isDinnerTime } = await import('../game/dinner');
    const flags = { jensBegruesst: true, jensEingezogen: true, oliEingezogen: true, larsEingezogen: true, olafEingezogen: true };
    const fake = (day: string) => ({ data: { flags }, today: () => day, clock: () => new Date(`${day}T18:30:00`) }) as never;
    let olaf = 0;
    for (const d of ['2026-11-01', '2026-11-08', '2026-11-15', '2026-11-22', '2026-11-29', '2026-12-06', '2026-12-13', '2026-12-20']) {
      const g = dinnerGuests(fake(d));
      expect(g).toEqual(expect.arrayContaining(['jens', 'oli', 'lars']));
      if (g.includes('olaf')) olaf++;
    }
    expect(olaf).toBeGreaterThan(0);
    expect(olaf).toBeLessThan(8);
    expect(isDinnerTime(fake('2026-11-01'), new Date('2026-11-01T18:30:00'))).toBe(true);
    expect(isDinnerTime(fake('2026-11-02'), new Date('2026-11-02T18:30:00'))).toBe(false);
  });
});
