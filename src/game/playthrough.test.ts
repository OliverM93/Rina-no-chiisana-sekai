/**
 * Durchlauf: Spielt die ganze Rahmenhandlung im Schnelldurchlauf nur mit Sachen, die Lina im Spiel
 * wirklich bekommen kann – vom ersten Fisch bis zu Thalias Einzug und dem Keller. Die Einzugsszenen
 * (World3D) werden hier nur durch ihr Flag „begrüßt“ ersetzt.
 */
import { describe, expect, it, vi } from 'vitest';

// Symbole brauchen ein Canvas – im Test egal
vi.mock('../gfx/items', () => ({ itemIconUrl: () => '' }));
import { DEFAULT_LINA } from '../core/appearance';
import type { StorageLike } from '../core/save';
import { WAIT_SECONDS } from '../core/progress';
import { FISH, INSECTS } from '../data/species';
import { HOUSE_STAGES } from '../data/house';
import { MILESTONES } from '../data/progress';
import { craftRecipe } from './crafting';
import { giveItem, sellSlots } from './gameplay';
import { buyFromCatalog, finishExpansion, orderExpansion, repayLoan } from './home';
import { catchFish, catchInsect, giveStarterTools } from './nature';
import { currentMilestone, progressHint } from './progress';
import { Session } from './session';
import { checkStory } from './story';

function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

function newSession() {
  const s = new Session(memoryStorage(), () => new Date('2026-07-10T12:00:00'));
  s.startNewGame(DEFAULT_LINA, 'Testdorf');
  const f = s.data!.flags;
  f.introSeen = true;
  f.giselaWelcomed = true;
  giveStarterTools(s);
  return s;
}

/** Spielzeit vorspulen (statt 10 Minuten zu warten) */
function wait(s: Session) {
  s.data!.playTimeSec += WAIT_SECONDS + 1;
}

/** Alles in der Tasche verkaufen, was einen Preis hat */
function sellAll(s: Session) {
  const idx = s.data!.inventory.slots.map((_, i) => i);
  return sellSlots(s, idx);
}

let fishN = 0;
function catchSome(s: Session, n: number) {
  for (let i = 0; i < n; i++) {
    const all = [...FISH.map((f) => ['f', f] as const), ...INSECTS.map((x) => ['i', x] as const)];
    const [kind, def] = all[fishN++ % all.length];
    if (kind === 'f') catchFish(s, def as (typeof FISH)[number]);
    else catchInsect(s, def as (typeof INSECTS)[number]);
  }
}

/** Ankündigen → warten → einziehen → Einzugsszene (Flag) */
function moveIn(s: Session, npc: string) {
  const ev = checkStory(s);
  expect(ev, `${npc} wird angekündigt`).toContain(`${npc}-angekuendigt`);
  expect(s.data!.mail.letters.some((l) => l.from === npc || l.id.includes(npc)), `Brief von ${npc}`).toBe(true);
  expect(checkStory(s), `${npc} zieht nicht sofort ein`).not.toContain(`${npc}-eingezogen`);
  wait(s);
  expect(checkStory(s), `${npc} zieht ein`).toContain(`${npc}-eingezogen`);
  s.setFlag(`${npc}Begruesst`);
}

describe('Durchlauf der Rahmenhandlung', () => {
  it('alle Einzüge nacheinander mit erreichbaren Mitteln', () => {
    const s = newSession();
    const d = s.data!;
    expect(currentMilestone(s)?.npc).toBe('olaf');
    // Oma gibt Hinweise, solange noch etwas fehlt
    expect(progressHint(s, 'gisela')).not.toBeNull();

    // Olaf: Sammelbuch 3 + 200 Sternchen verkauft
    catchSome(s, 4);
    giveItem(s, 'apfel', 10, false);
    giveItem(s, 'stein', 10, false);
    sellAll(s);
    moveIn(s, 'olaf');
    s.setFlag('christinBegruesst');

    // Oli: ein Möbel aus dem Katalog
    expect(currentMilestone(s)?.npc).toBe('oli');
    // vom Verkaufen ist genug für ein Sitzkissen da
    expect(d.money).toBeGreaterThanOrEqual(180);
    expect(buyFromCatalog(s, 'zabuton-rosa')).toBe('ok');
    moveIn(s, 'oli');

    // Jens: 2× gebaut + Sammelbuch 6
    expect(currentMilestone(s)?.npc).toBe('jens');
    giveItem(s, 'ast', 10, false);
    expect(craftRecipe(s, 'ast-hocker')).toBe('ok');
    expect(craftRecipe(s, 'zaun-holz')).toBe('ok');
    catchSome(s, 4);
    moveIn(s, 'jens');

    // Lars: 1× gekocht (Obstsalat von den Obstbäumen) + 2500 verkauft
    expect(currentMilestone(s)?.npc).toBe('lars');
    giveItem(s, 'apfel', 1, false);
    giveItem(s, 'birne', 1, false);
    giveItem(s, 'pfirsich', 1, false);
    expect(craftRecipe(s, 'obstsalat')).toBe('ok');
    for (let i = 0; i < 40 && d.stats.sold < 2500; i++) {
      catchSome(s, 5);
      sellAll(s);
    }
    expect(d.stats.sold).toBeGreaterThanOrEqual(2500);
    moveIn(s, 'lars');

    // Thalia: Durchchecken + Sammelbuch 9
    expect(currentMilestone(s)?.npc).toBe('thalia');
    d.world.dates.checkup = s.today();
    catchSome(s, 4);
    moveIn(s, 'thalia');

    expect(currentMilestone(s)).toBeNull();
    for (const m of MILESTONES) expect(d.flags[`${m.npc}Eingezogen`], m.npc).toBe(true);
  });

  it('jede Ausbaustufe lässt sich bestellen, wird fertig und abbezahlt', () => {
    const s = newSession();
    const d = s.data!;
    for (let st = 1; st < HOUSE_STAGES.length; st++) {
      expect(orderExpansion(s), `Stufe ${st}`).toBe('ok');
      expect(orderExpansion(s)).toBe('laeuft');
      expect(finishExpansion(s)).toBeNull();
      wait(s);
      expect(finishExpansion(s)).toBe(st);
      expect(d.house.stage).toBe(st);
      // ohne Abzahlen geht kein neuer Kredit
      if (st < HOUSE_STAGES.length - 1) expect(orderExpansion(s)).toBe('kredit-offen');
      d.money += HOUSE_STAGES[st].price;
      expect(repayLoan(s, HOUSE_STAGES[st].price)).toBe(HOUSE_STAGES[st].price);
    }
    expect(orderExpansion(s)).toBe('fertig');
  });

  it('der Spielstand übersteht Speichern & Laden mitten in der Geschichte', () => {
    const storage = memoryStorage();
    const s = new Session(storage, () => new Date('2026-07-10T12:00:00'));
    s.startNewGame(DEFAULT_LINA, 'Testdorf');
    s.data!.flags.toolsGiven = true;
    s.data!.flags.olafAngekuendigt = true;
    s.data!.story['olaf-einzug'] = s.playTime();
    s.save();
    const s2 = new Session(storage, () => new Date('2026-07-10T12:00:00'));
    expect(s2.continueGame()).toBe(true);
    expect(s2.data!.flags.olafAngekuendigt).toBe(true);
    expect(checkStory(s2)).not.toContain('olaf-eingezogen');
    wait(s2);
    expect(checkStory(s2)).toContain('olaf-eingezogen');
  });
});

