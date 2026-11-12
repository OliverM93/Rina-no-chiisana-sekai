/**
 * Balancing-Spannen (Game Design: BALANCING_GUIDELINES.md, Audit 3 K5).
 * Schützt bei neuen Inhalten vor Ausreißern – die Grenzen sind bewusst großzügig: Sie sollen
 * Tippfehler und echte Kipp-Punkte finden, nicht jede Feinabstimmung verhindern.
 */
import { describe, expect, it } from 'vitest';
import { FURNITURE } from './furniture';
import { ITEMS } from './items';
import { RECIPES } from './recipes';
import { CATCH_PRICE_FACTOR, FISH, INSECTS } from './species';
import { ALL_WISHES } from './wishes';
import { HOUSE_STAGES } from './house';

const price = (id: string) => ITEMS[id]?.price ?? 0;

describe('Balancing-Spannen', () => {
  it('Küche & Apotheke: Veredeln lohnt sich (≥ 1,3×), aber nie absurd (≤ 6,5×)', () => {
    for (const r of RECIPES.filter((x) => x.station === 'kueche' || x.station === 'apotheke')) {
      const input = r.ingredients.reduce((a, i) => a + price(i.itemId) * i.count, 0);
      const output = price(r.result) * (r.count ?? 1);
      expect(input, r.id).toBeGreaterThan(0);
      const m = output / input;
      expect(m, `${r.id}: ${input} → ${output}`).toBeGreaterThanOrEqual(1.3);
      expect(m, `${r.id}: ${input} → ${output}`).toBeLessThanOrEqual(6.5);
    }
  });

  it('Katalog-Möbel liegen zwischen 50 und 9 000 ⭐; über 5 000 nur mit Funktion', () => {
    const withFunction = new Set(['espresso-hebel']);
    for (const f of FURNITURE.filter((x) => !x.crafted && !x.gift && !x.retired)) {
      expect(f.price, f.id).toBeGreaterThanOrEqual(50);
      expect(f.price, f.id).toBeLessThanOrEqual(9000);
      if (f.price > 5000) expect(withFunction.has(f.id), `${f.id} kostet ${f.price} – braucht eine Funktion`).toBe(true);
    }
  });

  it('Fische & Insekten: selten = teuer (sehr häufige Arten sind nie teuer)', () => {
    // Grenzen wachsen mit dem Fang-Faktor (Sternchen-Balancing Nov. 2026: × 1,5)
    const f = CATCH_PRICE_FACTOR;
    for (const s of [...FISH, ...INSECTS]) {
      expect(s.price, s.id).toBeGreaterThanOrEqual(15);
      expect(s.price, s.id).toBeLessThanOrEqual(1200 * f);
      if (s.weight >= 20) expect(s.price, `${s.id} ist häufig (${s.weight}) – Preis ${s.price}`).toBeLessThanOrEqual(120 * f);
      if (s.price >= 500 * f) expect(s.weight, `${s.id} ist teuer (${s.price}) – Häufigkeit ${s.weight}`).toBeLessThanOrEqual(5);
    }
  });

  it('Herzenswünsche: Sternchen-Anteil je Wunsch ≤ 5 000', () => {
    for (const w of ALL_WISHES) expect(w.stars ?? 0, w.id).toBeLessThanOrEqual(5000);
  });

  it('Hausausbau: jede Stufe teurer als die vorige, Zuwachs 5 000–25 000', () => {
    for (let i = 2; i < HOUSE_STAGES.length; i++) {
      const step = HOUSE_STAGES[i].price - HOUSE_STAGES[i - 1].price;
      expect(step, `Stufe ${i}`).toBeGreaterThanOrEqual(5000);
      expect(step, `Stufe ${i}`).toBeLessThanOrEqual(25000);
    }
  });
});
