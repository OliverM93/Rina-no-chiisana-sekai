import { describe, expect, it } from 'vitest';
import { createMailbox, deliver, mailDue, MAX_LETTERS, normalizeMailbox, unreadCount } from './mail';

const letter = (id: string) => ({ id, from: 'Oma', subject: 'Hallo', body: 'Text', day: '2026-11-02' });

describe('Briefkasten', () => {
  it('stellt Briefe zu und zählt ungelesene', () => {
    const box = createMailbox();
    expect(deliver(box, letter('a'))).toBe(true);
    expect(deliver(box, letter('a'))).toBe(false);
    expect(unreadCount(box)).toBe(1);
    box.letters[0].read = true;
    expect(unreadCount(box)).toBe(0);
  });

  it('zählt Briefe mit nicht abgeholtem Geschenk als neu', () => {
    const box = createMailbox();
    deliver(box, { ...letter('g'), gift: { itemId: 'keks', count: 1 } });
    box.letters[0].read = true;
    expect(unreadCount(box)).toBe(1);
  });

  it('räumt alte gelesene Briefe auf, behält aber ungelesene', () => {
    const box = createMailbox();
    for (let i = 0; i < MAX_LETTERS + 5; i++) {
      deliver(box, letter(`l${i}`));
      box.letters[0].read = i % 2 === 0;
    }
    expect(box.letters.length).toBeLessThanOrEqual(MAX_LETTERS);
    expect(box.letters.some((l) => !l.read)).toBe(true);
  });

  it('entscheidet reproduzierbar über neue Post', () => {
    expect(mailDue('2026-11-02', 'gisela')).toBe(mailDue('2026-11-02', 'gisela'));
    const days = Array.from({ length: 60 }, (_, i) => mailDue(`2026-01-${String(i).padStart(2, '0')}`, 'gisela'));
    expect(days.filter(Boolean).length).toBeGreaterThan(5);
  });

  it('säubert geladene Daten', () => {
    const box = normalizeMailbox({ letters: [{ id: 'x', body: 'b', gift: { itemId: 'keks' } }, { id: 3 }], lastCheckDay: '2026-11-01' });
    expect(box.letters).toHaveLength(1);
    expect(box.letters[0].gift).toEqual({ itemId: 'keks', count: 1 });
    expect(box.lastCheckDay).toBe('2026-11-01');
  });
});
