import { describe, expect, it } from 'vitest';
import { possessive } from './grammar';

describe('possessive', () => {
  it('hängt ein s an', () => {
    expect(possessive('Olaf')).toBe('Olafs');
    expect(possessive('Oma Gisela')).toBe('Oma Giselas');
  });
  it('setzt nach s-Laut einen Apostroph', () => {
    expect(possessive('Lars')).toBe('Lars’');
    expect(possessive('Jens')).toBe('Jens’');
    expect(possessive('Max')).toBe('Max’');
  });
});
