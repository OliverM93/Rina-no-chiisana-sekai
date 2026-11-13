import { describe, expect, it } from 'vitest';
import { catalogEntries } from './catalog';

/**
 * Katalog-Budget (Audit 4, K3): Der Katalog darf nicht unbemerkt wachsen, während das Einkommen gleich bleibt.
 * Schlägt dieser Test fehl, wurde eine große Inhaltswelle gebaut – dann bewusst entscheiden:
 * Einkommen/Ausbaupreise mitziehen (siehe `docs/game-design/BALANCING_GUIDELINES.md`, „Katalog-Budget“) und erst dann die Grenze anheben.
 */
const ALL_FLAGS = { olafBegruesst: true, oliBegruesst: true, jensBegruesst: true, larsBegruesst: true, thaliaBegruesst: true };

/** Höchstens so viele ⭐ für den ganzen Katalog (Möbel, Tapeten, Böden, Garten, Winter …), Stand Nov. 2026: ≈ 255 000 */
const MAX_CATALOG_SUM = 300_000;
/** Höchstens so viel im Median je Möbel, Stand Nov. 2026: 850 */
const MAX_FURNITURE_MEDIAN = 1000;

describe('Katalog-Budget', () => {
  const entries = catalogEntries({ flags: ALL_FLAGS, season: 'winter' });

  it(`die Summe aller Katalogpreise bleibt unter ${MAX_CATALOG_SUM} ⭐`, () => {
    const sum = entries.reduce((a, e) => a + e.price, 0);
    expect(sum).toBeLessThanOrEqual(MAX_CATALOG_SUM);
    expect(sum).toBeGreaterThan(100_000); // Sicherung: der Test misst wirklich den Katalog
  });

  it(`der Möbel-Median bleibt unter ${MAX_FURNITURE_MEDIAN} ⭐`, () => {
    const prices = entries.filter((e) => e.meta.category === 'moebel').map((e) => e.price).sort((a, b) => a - b);
    expect(prices.length).toBeGreaterThan(50);
    expect(prices[Math.floor(prices.length / 2)]).toBeLessThanOrEqual(MAX_FURNITURE_MEDIAN);
  });
});
