import { describe, expect, it } from 'vitest';
import { FURNITURE } from './furniture';
import { TV_CHANNELS } from './tv';

describe('Fernsehen', () => {
  it('Jede Folge hat Zeilen, die Doku hat Folgen mit Dr. No samt Reaktionen von Lina und Oli', () => {
    for (const ch of TV_CHANNELS) for (const ep of ch.episodes) expect(ep.lines.length, `${ch.id}/${ep.title}`).toBeGreaterThan(0);
    const doku = TV_CHANNELS.find((c) => c.id === 'doku')!;
    const drNo = doku.episodes.filter((e) => e.lines.join(' ').includes('Dr. No'));
    expect(drNo.length).toBeGreaterThanOrEqual(3);
    for (const e of drNo) {
      expect(e.lina?.length, e.title).toBeGreaterThan(0);
      expect(e.oli?.length, e.title).toBeGreaterThan(0);
    }
  });

  it('Das Dr.-No-Porträt gibt es im Katalog als Wand-Deko', () => {
    const f = FURNITURE.find((x) => x.id === 'bild-dr-no');
    expect(f?.wall).toBe(true);
    expect(f?.gift).toBeFalsy();
    expect(f?.crafted).toBeFalsy();
  });
});
