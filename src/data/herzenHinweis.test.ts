import { describe, expect, it } from 'vitest';
import { GISELA_WELCOME_2 } from './npcs/gisela';

describe('Herzen-Hinweis', () => {
  it('Oma Gisela erklärt bei der ersten Begegnung, wie Herzen wachsen (plaudern, schenken, dazusetzen)', () => {
    const text = GISELA_WELCOME_2.join(' ');
    expect(text).toMatch(/Herzen/);
    expect(text).toMatch(/unterhält/);
    expect(text).toMatch(/schenkt/);
  });
});
