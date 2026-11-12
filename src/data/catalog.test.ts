import { describe, expect, it } from 'vitest';
import { CATEGORIES, CATEGORY_BY_ID, catalogMeta, DESIGN_STYLE_BY_ID, DESIGN_STYLES, FURNITURE_META_IDS } from './catalog';
import { FLOORS, FURNITURE, WALLPAPERS } from './furniture';

const inCatalog = FURNITURE.filter((f) => !f.crafted && !f.gift && !f.retired);

describe('Katalog-Ordnung: Vollständigkeit', () => {
  it('jedes Möbel aus dem Katalog hat Kategorie und (falls die Kategorie Typen hat) einen gültigen Typ', () => {
    const fehlt: string[] = [];
    for (const f of inCatalog) {
      const m = catalogMeta(f.id);
      if (!m) {
        fehlt.push(f.id);
        continue;
      }
      const cat = CATEGORY_BY_ID[m.category];
      if (cat.types.length > 0) expect(cat.types.map((t) => t.id), f.id).toContain(m.type);
      else expect(m.type, f.id).toBeNull();
    }
    expect(fehlt, `ohne Kategorie: ${fehlt.join(', ')}`).toEqual([]);
  });

  it('jede Tapete und jeder Boden ist eingeordnet', () => {
    for (const s of [...WALLPAPERS, ...FLOORS]) {
      const m = catalogMeta(s.id);
      expect(m, s.id).toBeTruthy();
      expect(m!.category).toBe(s.kind);
      expect(CATEGORY_BY_ID[s.kind].types.map((t) => t.id), s.id).toContain(m!.type);
    }
  });

  it('die Zuordnungstabelle kennt nur echte Katalog-Möbel (keine Geschenke, nichts von der Werkbank)', () => {
    const ok = new Set(inCatalog.map((f) => f.id));
    expect(FURNITURE_META_IDS.filter((id) => !ok.has(id))).toEqual([]);
  });

  it('Stile sind gültig und nicht doppelt', () => {
    const known = new Set(DESIGN_STYLES.map((s) => s.id));
    for (const id of [...inCatalog.map((f) => f.id), ...WALLPAPERS.map((w) => w.id), ...FLOORS.map((w) => w.id)]) {
      const styles = catalogMeta(id)?.styles ?? [];
      expect(new Set(styles).size, id).toBe(styles.length);
      for (const s of styles) expect(known.has(s), `${id}: ${s}`).toBe(true);
    }
  });

  it('Kategorien, Typen und Stile haben eindeutige IDs', () => {
    expect(new Set(CATEGORIES.map((c) => c.id)).size).toBe(CATEGORIES.length);
    for (const c of CATEGORIES) expect(new Set(c.types.map((t) => t.id)).size, c.id).toBe(c.types.length);
    expect(new Set(DESIGN_STYLES.map((s) => s.id)).size).toBe(DESIGN_STYLES.length);
  });
});

describe('Katalog-Ordnung: Inhalt', () => {
  it('die gewünschten Stile sind angelegt, Organic Modern und Mediterranean Modern bewusst nicht', () => {
    const names = DESIGN_STYLES.map((s) => s.name);
    for (const n of ['Minimalismus', 'Contemporary', 'Japandi', 'Skandinavisch', 'Industrial', 'Mid-Century-Modern', 'Brutalismus', 'Art déco', 'Dark Academia', 'Space Age', 'Cyberpunk', 'Memphis']) {
      expect(names, n).toContain(n);
    }
    expect(names.join(' ').toLowerCase()).not.toMatch(/organic|mediterran/);
  });

  it('Pflanzen, Garten und Lieblingsthemen sind eigene Kategorien – meist ohne Stil', () => {
    for (const id of ['topfpflanze', 'kaktus', 'yucca', 'haengepflanze']) expect(catalogMeta(id)).toEqual({ category: 'pflanzen', type: expect.any(String), styles: [] });
    expect(catalogMeta('gartenbank')?.category).toBe('garten');
    expect(catalogMeta('espresso-hebel')).toEqual({ category: 'lieblinge', type: 'kaffee', styles: [] });
    expect(catalogMeta('tasse-klassik-gruen')?.type).toBe('tassen');
    expect(catalogMeta('weihnachtsbaum')?.category).toBe('winter');
  });

  it('Stücke dürfen mehrere Stile haben (z. B. Holzregal: Skandinavisch und Minimalismus)', () => {
    expect(catalogMeta('regal')?.styles).toEqual(['skandinavisch', 'minimalismus']);
    expect(catalogMeta('ohrensessel')?.styles).toContain('darkacademia');
  });

  it('die bisherigen Stile behalten ihr ganzes Sortiment', () => {
    const count = (s: string) => inCatalog.filter((f) => catalogMeta(f.id)?.styles.includes(s as never)).length;
    for (const [old, min] of [['japanisch', 15], ['cottage', 6], ['retro', 6], ['modern', 6], ['midcentury', 12], ['bistro', 11]] as const) {
      expect(count(old), old).toBeGreaterThanOrEqual(min);
      // jedes Stück der alten Linie trägt seinen Stil weiter
      for (const f of inCatalog.filter((x) => x.style === old)) expect(catalogMeta(f.id)?.styles, f.id).toContain(old);
    }
  });

  it('Freischaltungen: Bistro, Art déco & Memphis mit Jens, Dark Academia mit Thalia, Space Age & Cyberpunk mit Oli', () => {
    expect(DESIGN_STYLE_BY_ID.bistro.arrivesWith).toBe('jens');
    expect(DESIGN_STYLE_BY_ID.darkacademia.arrivesWith).toBe('thalia');
    expect(DESIGN_STYLE_BY_ID.cyberpunk.arrivesWith).toBe('oli');
    expect(DESIGN_STYLE_BY_ID.japanisch.arrivesWith).toBeUndefined();
    expect(DESIGN_STYLE_BY_ID.japandi.arrivesWith).toBeUndefined();
  });

  it('die neuen Stile (außer Brutalismus & Memphis) haben ein Kernsortiment', () => {
    const all = [...inCatalog.map((f) => f.id), ...WALLPAPERS.map((w) => w.id), ...FLOORS.map((w) => w.id)];
    for (const style of ['japandi', 'skandinavisch', 'minimalismus', 'darkacademia', 'artdeco', 'industrial', 'spaceage', 'cyberpunk'] as const) {
      const ids = all.filter((id) => catalogMeta(id)?.styles.includes(style));
      const types = new Set(ids.map((id) => catalogMeta(id)!.type));
      const cats = new Set(ids.map((id) => catalogMeta(id)!.category));
      for (const t of ['sofas', 'tische', 'regale', 'lampen', 'teppiche']) expect(types.has(t), `${style}: ${t}`).toBe(true);
      expect(cats.has('tapete'), `${style}: Tapete`).toBe(true);
      expect(cats.has('boden'), `${style}: Boden`).toBe(true);
    }
  });
});
