import { describe, expect, it } from 'vitest';
import { GUEST_HOUSES } from './gastHaeuser';
import { THALIA } from './npcs/thalia';

const SPORT = /Studio|Training|Hantel|Beintag|Joggen|laufen|Laufwetter|Kniebeugen|Crosstrainer|Dehn|Sport/i;
const PARTY = /Party|Club|Hausparty|Tanz|Bass|Playlist|Festival|Konfetti|Open-Air/i;
const GEO = /Stein|Fossil|Gestein|Geolog|Sediment|Erosion|Ammonit|Kristall/i;

const lines = (pool: ReadonlyArray<{ text: string | readonly string[] }>) => pool.map((e) => (typeof e.text === 'string' ? e.text : e.text.join(' ')));

describe('Thalia: Sport und Partys statt Gesteine', () => {
  const chat = lines(THALIA.dialogue.chat);
  const all = [...chat, ...lines(THALIA.dialogue.greetings)];

  it('sie redet oft über Fitnessstudio/Training und Partys (Clubs, Hauspartys)', () => {
    expect(chat.filter((t) => SPORT.test(t)).length).toBeGreaterThanOrEqual(8);
    expect(chat.filter((t) => PARTY.test(t)).length).toBeGreaterThanOrEqual(8);
  });

  it('Gesteine kommen nur beiläufig vor (die Schaufel bleibt, aber sie redet nicht ständig darüber)', () => {
    expect(all.filter((t) => GEO.test(t)).length).toBeLessThanOrEqual(2);
  });

  it('ihre Wohnung zeigt Sport- und Partyecke statt Fossilien', () => {
    const ids = GUEST_HOUSES['haus-thalia'].items.map((i) => i.id);
    expect(ids).toEqual(expect.arrayContaining(['hantelbank', 'discokugel']));
    for (const gone of ['ammonit-lina', 'vitrine', 'wandkarte-thalia']) expect(ids).not.toContain(gone);
  });
});
