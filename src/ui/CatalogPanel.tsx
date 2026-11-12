/**
 * Möbelkatalog: Möbel, Pflanzen, Tapeten, Böden, Lieblingsthemen und Garten für Sternchen kaufen.
 *
 * Drei Filterzeilen – Kategorie (Reiter), Typ und Einrichtungsstil – darunter das Raster und die Details.
 * Alles geht mit den Pfeiltasten (Zustandsmaschine in `catalogNav.ts`), mit der Maus genauso.
 * Gekauftes landet in der Tasche – oder beim Einrichten gleich in Linas Hand.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { CATEGORY_BY_ID, DESIGN_STYLE_BY_ID } from '../data/catalog';
import { CURRENCY } from '../data/items';
import { getSeason } from '../core/time';
import { availableCategories, availableStyles, availableTypes, type CatalogEntry, catalogContext, catalogEntries, effectiveFilter, filterEntries, type StyleFilter, styleFilterLabel } from '../game/catalog';
import { formatMoney } from '../game/gameplay';
import { buyFromCatalog, isSurface } from '../game/home';
import type { Session } from '../game/session';
import { itemIconUrl } from '../gfx/items';
import { initialNav, type NavContext, navigate, navKeyOf, type NavRow, type NavState, normalize } from './catalogNav';
import { showToast, ui, useSessionVersion } from './store';

/** Mausrad über einer Chip-Zeile scrollt sie seitlich */
function wheelSideways(e: WheelEvent) {
  const el = e.currentTarget as HTMLElement;
  if (el.scrollWidth <= el.clientWidth || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
  el.scrollLeft += e.deltaY;
  e.preventDefault();
}

/** Der Katalog merkt sich, wo Lina zuletzt geblättert hat (bis die Seite neu lädt) */
let remembered: NavState | null = null;

function typeLabel(category: string, type: string): string {
  if (type === 'alle') return 'Alle';
  return CATEGORY_BY_ID[category as keyof typeof CATEGORY_BY_ID]?.types.find((t) => t.id === type)?.name ?? type;
}

function styleLine(e: CatalogEntry): string {
  return e.meta.styles.length > 0 ? e.meta.styles.map((s) => DESIGN_STYLE_BY_ID[s].name).join(' · ') : 'Ohne Stil';
}

export function CatalogPanel({ session }: { session: Session }) {
  useSessionVersion(session);
  const season = getSeason(session.clock());
  const entries = catalogEntries(catalogContext(session, season));
  const categories = availableCategories(entries);
  const [rawNav, setNav] = useState<NavState>(() => {
    const r = remembered && categories.includes(remembered.category) ? remembered : initialNav(categories[0] ?? 'moebel');
    return { ...r, row: 'raster' };
  });
  const gridRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(6);
  const close = () => ui.set({ panel: null });

  // wirksame Filter & Listen für den aktuellen Zustand
  const filter = effectiveFilter(entries, { category: rawNav.category, type: rawNav.type, style: rawNav.style });
  const styles = availableStyles(entries, filter.category);
  const types = availableTypes(entries, filter.category, filter.style);
  const list = filterEntries(entries, filter);
  const ctxFor = (n: NavState): NavContext => {
    const f = effectiveFilter(entries, { category: n.category, type: n.type, style: n.style });
    const l = filterEntries(entries, f);
    const sel = l[Math.min(n.index, l.length - 1)];
    return { categories, type: f.type, style: f.style, types: availableTypes(entries, f.category, f.style), styles: availableStyles(entries, f.category), count: l.length, cols, variants: sel?.variants.length ?? 1 };
  };
  const nav = normalize(rawNav, ctxFor(rawNav));
  remembered = nav;
  const sel = list[nav.index] ?? null;
  const v = sel ? sel.variants[Math.min(nav.variant, sel.variants.length - 1)] : null;
  const money = session.data?.money ?? 0;

  const buy = () => {
    if (!sel || !v) return;
    if (money < sel.price) return showToast('Dafür reichen deine Sternchen noch nicht. ⭐');
    const r = buyFromCatalog(session, v.itemId);
    if (r === 'ok' && session.decorActive) {
      // Beim Einrichten: Katalog zu, das Gekaufte hängt gleich an der Maus (Tapete/Boden wird sofort angebracht)
      ui.set({ panel: null });
      session.bus.emit('decor:command', isSurface(v.itemId) ? { kind: 'surface', itemId: v.itemId } : { kind: 'take', itemId: v.itemId });
      showToast(`${sel.name} gekauft! ${isSurface(v.itemId) ? '' : 'Klick zum Abstellen.'}`, itemIconUrl(v.itemId));
    } else if (r === 'ok') showToast(`${sel.name} gekauft! Liegt jetzt in deiner Tasche. 🎁`, itemIconUrl(v.itemId));
    else if (r === 'zu-teuer') showToast('Dafür reichen deine Sternchen noch nicht. ⭐');
    else if (r === 'tasche-voll') showToast('Tasche und Truhe sind voll! 🎒');
  };

  // Tasten: immer den aktuellsten Zustand verwenden
  const live = useRef({ nav, buy, ctxFor });
  live.current = { nav, buy, ctxFor };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.code === 'Enter' && !e.repeat) {
        // Knöpfe (Schließen/Kaufen), die per Tab gewählt sind, behalten ihr eigenes Enter
        const active = document.activeElement;
        if (active instanceof HTMLElement && active.matches('.btn')) return;
        e.preventDefault();
        live.current.buy();
        return;
      }
      const key = navKeyOf(e.code);
      if (!key) return;
      e.preventDefault();
      const { nav: n, ctxFor: c } = live.current;
      setNav(navigate(n, key, c(n)));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Spaltenzahl des Rasters (für ↑/↓) und gewählten Eintrag/Chip sichtbar halten
  useLayoutEffect(() => {
    const g = gridRef.current;
    if (g) {
      const n = getComputedStyle(g).gridTemplateColumns.split(' ').filter(Boolean).length;
      if (n > 0 && n !== cols) setCols(n);
      g.querySelector<HTMLElement>('.catalog-cell.selected')?.scrollIntoView({ block: 'nearest' });
    }
    for (const el of document.querySelectorAll<HTMLElement>('.catalog .filter-strip .chip.active')) el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  });

  const pick = (patch: Partial<NavState>) => setNav({ ...nav, ...patch });
  const rowClass = (r: NavRow) => `catalog-row ${nav.row === r ? 'nav-active' : ''}`;

  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card book catalog pop-in">
        <h2 class="card-title">📒 Möbelkatalog</h2>
        <span class="money catalog-money">{formatMoney(money)}</span>
        <div class={`${rowClass('kategorie')} row-kat`}>
          <div class="filter-strip" onWheel={wheelSideways}>
            {categories.map((c) => (
              <button key={c} tabIndex={-1} class={`chip ${filter.category === c ? 'active' : ''}`} onClick={() => pick({ row: 'kategorie', category: c, type: 'alle', index: 0, variant: 0 })}>
                {CATEGORY_BY_ID[c].icon} {CATEGORY_BY_ID[c].name}
              </button>
            ))}
          </div>
        </div>
        {types.length > 0 && (
          <div class={`${rowClass('typ')} row-typ`}>
            <span class="row-label">Typ</span>
            <div class="filter-strip" onWheel={wheelSideways}>
              {types.map((t) => (
                <button key={t} tabIndex={-1} class={`chip small ${filter.type === t ? 'active' : ''}`} onClick={() => pick({ row: 'typ', type: t, index: 0, variant: 0 })}>
                  {typeLabel(filter.category, t)}
                </button>
              ))}
            </div>
          </div>
        )}
        {styles.length > 0 && (
          <div class={`${rowClass('stil')} row-stil`}>
            <span class="row-label">Stil</span>
            <div class="filter-strip" onWheel={wheelSideways}>
              {styles.map((s: StyleFilter) => (
                <button key={s} tabIndex={-1} class={`chip small ${filter.style === s ? 'active' : ''}`} onClick={() => pick({ row: 'stil', style: s, index: 0, variant: 0 })}>
                  {styleFilterLabel(s)}
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={gridRef} class={`book-grid catalog-grid ${nav.row === 'raster' ? 'nav-active' : ''}`}>
          {list.length === 0 && <p class="soft center catalog-empty">Hier gibt es gerade nichts – schau in einer anderen Ecke des Katalogs!</p>}
          {list.map((e, i) => (
            <button key={e.id} tabIndex={-1} class={`book-cell catalog-cell ${i === nav.index ? 'selected' : ''}`} onClick={() => pick({ row: 'raster', index: i, variant: 0 })} aria-label={e.name} title={e.name}>
              <img src={itemIconUrl(e.variants[0].itemId)} alt="" draggable={false} />
              <span class="catalog-price">{e.price}</span>
            </button>
          ))}
        </div>
        <div class="item-detail">
          {sel && v ? (
            <>
              <img src={itemIconUrl(v.itemId, 96)} alt="" />
              <div>
                <div class="item-name">{sel.name}</div>
                <div class="item-cat">
                  {CATEGORY_BY_ID[sel.meta.category].name}
                  {sel.meta.type ? ` › ${typeLabel(sel.meta.category, sel.meta.type)}` : ''}
                  {sel.size ? ` · ${sel.size}` : ''}
                </div>
                <div class="item-cat soft">{styleLine(sel)}</div>
                <div class="item-desc">{sel.description}</div>
                {sel.variants.length > 1 && (
                  <div class={`variant-row ${nav.row === 'farbe' ? 'nav-active' : ''}`}>
                    {sel.variants.map((x, i) => (
                      <button key={x.itemId} tabIndex={-1} class={`swatch ${i === nav.variant ? 'active' : ''}`} style={{ background: x.color ?? undefined }} title={x.label} aria-label={x.label} onClick={() => pick({ row: 'farbe', variant: i })} />
                    ))}
                    <span class="soft">{v.label}</span>
                  </div>
                )}
                <div class="item-price">
                  Preis: {sel.price} {CURRENCY.icon}
                </div>
              </div>
            </>
          ) : (
            <p class="soft center">Such dir etwas Schönes aus! Gekauftes kommt in deine Tasche – oder, wenn du gerade einrichtest, direkt in deine Hand.</p>
          )}
        </div>
        <div class="card-actions">
          <button class="btn ghost" onClick={close}>
            Schließen
          </button>
          <button class="btn primary" disabled={!sel || money < (sel?.price ?? 0)} onClick={buy}>
            {sel ? `Kaufen · ${sel.price} ${CURRENCY.icon}` : 'Kaufen'}
          </button>
        </div>
        <div class="catalog-hint soft small-text">↑↓ Zeile · ←→ auswählen · Bild↑↓ Kategorie · Enter kaufen · Esc schließen</div>
      </div>
    </div>
  );
}
