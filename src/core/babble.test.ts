import { describe, expect, it } from 'vitest';
import { syllableAt } from './babble';

describe('Brabbelsprache', () => {
  it('Mitlaut + nächster Selbstlaut', () => {
    const s = syllableAt('Hallo Lina', 0);
    expect(s.consonant).toBe('h');
    expect(s.vowel).toBe('a');
    expect(syllableAt('Oma', 0)).toMatchObject({ consonant: null, vowel: 'o' });
  });

  it('Satzmelodie: Fragen, Ausrufe, letzte Silbe', () => {
    const line = 'Wie geht es dir? Gut!';
    const q = syllableAt(line, 12);
    expect(q.question).toBe(true);
    expect(q.final).toBe(true);
    expect(syllableAt(line, 0)).toMatchObject({ question: true, final: false, pos: 0 });
    expect(syllableAt(line, 18).excited).toBe(true);
  });

  it('ohne Selbstlaut in der Nähe → „e“', () => {
    expect(syllableAt('Pst', 0).vowel).toBe('e');
  });
});
