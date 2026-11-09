import { describe, expect, it } from 'vitest';
import { FRAME_STYLES, photoFileName } from './photoFrame';

describe('Fotomodus', () => {
  it('Dateiname mit Datum und Uhrzeit', () => {
    expect(photoFileName(new Date('2026-05-16T07:05:00'))).toBe('linas-kleine-welt-2026-05-16-0705.png');
  });

  it('vier Rahmen mit eindeutiger ID', () => {
    expect(FRAME_STYLES.length).toBe(4);
    expect(new Set(FRAME_STYLES.map((f) => f.id)).size).toBe(4);
  });
});
