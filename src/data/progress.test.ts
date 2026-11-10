import { describe, expect, it } from 'vitest';
import { MILESTONES } from './progress';
import { FISH, INSECTS } from './species';

/** Puffer: So viele Arten dürfen im schlechtesten Monat „fehlen“ (selten, nur abends, falsches Wetter …) */
const SLACK = 2;

describe('Einzugs-Bedingungen (Audit 3)', () => {
  it('Sammelbuch-Ziele sind in jedem Monat mit Puffer erreichbar – auch im Winter', () => {
    // Vor Thalias Einzug (Schaufel) zählen nur Fische und Insekten; Regen-Arten zählen nicht mit
    const maxNeed = Math.max(...MILESTONES.flatMap((m) => m.needs.filter((n) => n.kind === 'sammelbuch').map((n) => n.n)));
    for (let month = 1; month <= 12; month++) {
      const available = [...FISH, ...INSECTS].filter((s) => s.months.includes(month) && !s.rainOnly).length;
      expect(available, `Monat ${month}: ${available} Arten, Ziel ${maxNeed}`).toBeGreaterThanOrEqual(maxNeed + SLACK);
    }
  });

  it('Bedingungen ohne Tageslimit bleiben moderat (kein Grind, D2)', () => {
    for (const m of MILESTONES) {
      for (const n of m.needs) {
        if (n.kind === 'verkauft') expect(n.n, m.npc).toBeLessThanOrEqual(6000);
        if (n.kind === 'gebaut' || n.kind === 'gekocht' || n.kind === 'gekauft') expect(n.n, m.npc).toBeLessThanOrEqual(3);
      }
    }
  });

  it('jede Flag-Bedingung hat einen eigenen Hinweis', () => {
    for (const m of MILESTONES) {
      // Flags ohne eigenen Hinweis teilen sich `hints.flag` – davon darf es höchstens eins geben
      const plain = m.needs.filter((n) => n.kind === 'flag' && !(n.flag && m.flagHints?.[n.flag]));
      expect(plain.length, m.npc).toBeLessThanOrEqual(1);
      if (plain.length) expect(m.hints.flag, `${m.npc}: ${plain[0].flag}`).toBeTruthy();
    }
  });
});
