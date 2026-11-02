import { describe, expect, it } from 'vitest';
import { claimHeartRewards, createNpcState, EXTRA_GIFT_POINTS, giveGift, GIFT_POINTS, HEART_THRESHOLDS, heartProgress, heartsFor, normalizeNpcState, reactionTo, talk, TALK_POINTS } from './friendship';

const prefs = { loves: ['pfirsich'], likes: ['apfel'], dislikes: ['ast'] };

describe('Herzen', () => {
  it('berechnet Herzen aus Punkten', () => {
    expect(heartsFor(0)).toBe(0);
    expect(heartsFor(HEART_THRESHOLDS[1] - 1)).toBe(0);
    expect(heartsFor(HEART_THRESHOLDS[1])).toBe(1);
    expect(heartsFor(99999)).toBe(HEART_THRESHOLDS.length - 1);
    expect(heartProgress(0)).toBe(0);
    expect(heartProgress(99999)).toBe(1);
  });
});

describe('Plaudern', () => {
  it('gibt nur beim ersten Gespräch des Tages Punkte', () => {
    const s = createNpcState();
    expect(talk(s, '2026-11-02')).toMatchObject({ firstToday: true, gained: TALK_POINTS });
    expect(talk(s, '2026-11-02')).toMatchObject({ firstToday: false, gained: 0 });
    expect(s.talksToday).toBe(2);
    expect(talk(s, '2026-11-03').firstToday).toBe(true);
    expect(s.talksToday).toBe(1);
    expect(s.points).toBe(TALK_POINTS * 2);
  });
});

describe('Geschenke', () => {
  it('erkennt Vorlieben', () => {
    expect(reactionTo(prefs, 'pfirsich')).toBe('liebt');
    expect(reactionTo(prefs, 'apfel')).toBe('mag');
    expect(reactionTo(prefs, 'ast')).toBe('mag-nicht');
    expect(reactionTo(prefs, 'stein')).toBe('neutral');
  });

  it('zählt das erste Geschenk des Tages voll, weitere nur wenig – nie negativ', () => {
    const s = createNpcState();
    const a = giveGift(s, prefs, 'ast', 'd1');
    expect(a.gained).toBe(GIFT_POINTS['mag-nicht']);
    expect(a.gained).toBeGreaterThan(0);
    const b = giveGift(s, prefs, 'pfirsich', 'd1');
    expect(b).toMatchObject({ repeatToday: true, gained: EXTRA_GIFT_POINTS });
    const c = giveGift(s, prefs, 'pfirsich', 'd2');
    expect(c.gained).toBe(GIFT_POINTS.liebt);
  });

  it('meldet, wenn ein neues Herz erreicht wird', () => {
    const s = createNpcState();
    s.points = HEART_THRESHOLDS[1] - 1;
    expect(giveGift(s, prefs, 'apfel', 'd1').heartUp).toBe(true);
  });
});

describe('Herz-Belohnungen', () => {
  it('vergibt jede Belohnung genau einmal', () => {
    const s = createNpcState();
    s.points = HEART_THRESHOLDS[3];
    expect(claimHeartRewards(s, [1, 3, 5])).toEqual([1, 3]);
    expect(claimHeartRewards(s, [1, 3, 5])).toEqual([]);
  });
});

describe('Laden', () => {
  it('ersetzt kaputte Werte', () => {
    expect(normalizeNpcState({ points: -5, rewards: [1, 'x'] })).toMatchObject({ points: 0, rewards: [1] });
    expect(normalizeNpcState('quatsch')).toEqual(createNpcState());
  });
});
