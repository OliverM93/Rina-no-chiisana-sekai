import { describe, expect, it } from 'vitest';
import { initialNav, type NavContext, type NavKey, navigate, type NavState, normalize, presentRows } from './catalogNav';

const base: NavContext = {
  categories: ['moebel', 'pflanzen', 'tapete', 'boden'],
  type: 'alle',
  style: 'alle',
  types: ['alle', 'sofas', 'lampen'],
  styles: ['alle', 'ohne', 'japanisch', 'japandi'],
  count: 10,
  cols: 4,
  variants: 3,
};

function press(s: NavState, keys: NavKey[], ctx: NavContext = base): NavState {
  for (const k of keys) s = navigate(s, k, { ...ctx, type: s.type === 'alle' || ctx.types.includes(s.type) ? s.type : 'alle', style: ctx.styles.includes(s.style) ? s.style : 'alle' });
  return s;
}

describe('Katalog-Tastatur', () => {
  it('startet im Raster beim ersten Eintrag', () => {
    expect(initialNav('moebel')).toMatchObject({ row: 'raster', index: 0 });
  });

  it('↑ aus der obersten Rasterzeile führt über Stil und Typ bis zu den Kategorien', () => {
    let s = initialNav('moebel');
    s = press(s, ['up']);
    expect(s.row).toBe('stil');
    s = press(s, ['up', 'up']);
    expect(s.row).toBe('kategorie');
    s = press(s, ['up']);
    expect(s.row).toBe('kategorie');
  });

  it('←/→ in den Zeilen ändert Kategorie, Typ und Stil – mit Umlauf', () => {
    let s: NavState = { ...initialNav('moebel'), row: 'kategorie' };
    s = press(s, ['right']);
    expect(s.category).toBe('pflanzen');
    s = press(s, ['left', 'left']);
    expect(s.category).toBe('boden');
    s = press({ ...s, row: 'stil' }, ['right', 'right']);
    expect(s.style).toBe('japanisch');
    s = press({ ...s, row: 'typ' }, ['left']);
    expect(s.type).toBe('lampen');
  });

  it('der Stil bleibt beim Kategoriewechsel erhalten, der Typ nicht', () => {
    const s = press({ ...initialNav('moebel'), row: 'kategorie', style: 'japandi', type: 'lampen', index: 5 }, ['right']);
    expect(s).toMatchObject({ category: 'pflanzen', style: 'japandi', type: 'alle', index: 0 });
  });

  it('im Raster: ←/→ einzeln, ↑/↓ zeilenweise, letzte halbe Zeile wird erreicht', () => {
    let s = initialNav('moebel');
    s = press(s, ['right', 'right']);
    expect(s.index).toBe(2);
    s = press(s, ['down']);
    expect(s.index).toBe(6);
    s = press(s, ['down']); // 10 Einträge, 4 Spalten: Zeile 3 hat nur 8 und 9
    expect(s.index).toBe(9);
    s = press(s, ['down']);
    expect(s.row).toBe('farbe');
    s = press(s, ['right', 'right', 'right']);
    expect(s.variant).toBe(0); // drei Farben, Umlauf
    s = press(s, ['up']);
    expect(s.row).toBe('raster');
  });

  it('Bild↓/Bild↑ blättert die Kategorien von überall', () => {
    const s = press({ ...initialNav('moebel'), index: 7 }, ['pageDown']);
    expect(s).toMatchObject({ category: 'pflanzen', index: 0, row: 'raster' });
  });

  it('fehlende Zeilen werden übersprungen (keine Typen, keine Stile, nur eine Farbe)', () => {
    const ctx: NavContext = { ...base, types: [], styles: [], variants: 1 };
    expect(presentRows(ctx)).toEqual(['kategorie', 'raster']);
    expect(press(initialNav('garten'), ['up'], ctx).row).toBe('kategorie');
    expect(press(initialNav('garten'), ['down', 'down', 'down'], ctx).row).toBe('raster');
  });

  it('normalize: leere Trefferliste und verschwundene Zeilen', () => {
    const s = normalize({ ...initialNav('moebel'), row: 'farbe', index: 30, variant: 5 }, { ...base, count: 0 });
    expect(s).toMatchObject({ row: 'stil', index: 0, variant: 2 });
  });
});
