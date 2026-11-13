/**
 * Möbelkatalog: Möbel, Pflanzen, Tapeten, Böden, Lieblingsthemen und Garten für Sternchen kaufen.
 *
 * Drei Filterzeilen – Kategorie (Reiter), Typ und Einrichtungsstil – darunter das Raster und die Details.
 * Alles geht mit den Pfeiltasten (Zustandsmaschine in `catalogNav.ts`), mit der Maus genauso.
 * Gekauftes landet in der Tasche – oder beim Einrichten gleich in Linas Hand.
 */
import type { ComponentChildren } from 'preact';
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { CATEGORY_BY_ID, DESIGN_STYLE_BY_ID } from '../data/catalog';
import { CURRENCY } from '../data/items';
import { getSeason } from '../core/time';
import { availableCategories, availableStyles, availableTypes, type CatalogEntry, catalogContext, catalogEntries, effectiveFilter, filterEntries, isNewStyle, markStyleSeen, type StyleFilter, styleFilterLabel } from '../game/catalog';
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
  const catCtx = catalogContext(session, season);
  const entries = catalogEntries(catCtx);
  const categories = availableCategories(entries);
  const [rawNav, setNav] = useState<NavState>(() => {
    const r = remembered && categories.includes(remembered.category) ? remembered : initialNav(categories[0] ?? 'moebel');
    return { ...r, row: 'raster' };
  });
  const gridRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(6);
  /** Beschreibung zu lang für die Detailspalte? Dann gibt es „weiterlesen“ (Leertaste) mit dem ganzen Text */
  const descRef = useRef<HTMLDivElement>(null);
  const [descLong, setDescLong] = useState(false);
  const [descOpen, setDescOpen] = useState(false);
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
  const live = useRef({ nav, buy, ctxFor, descLong, descOpen });
  live.current = { nav, buy, ctxFor, descLong, descOpen };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        // erst den ganzen Text schließen, dann den Katalog
        if (live.current.descOpen) setDescOpen(false);
        else close();
        return;
      }
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        if (live.current.descOpen) setDescOpen(false);
        else if (live.current.descLong) setDescOpen(true);
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
      setDescOpen(false);
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
    for (const el of document.querySelectorAll<HTMLElement>('.catalog .filter-strip .chip.active')) el.scrollIntoView({ block: 'nearest', inline: 'center' });
    const d = descRef.current;
    const long = !!d && d.scrollHeight > d.clientHeight + 2;
    if (long !== descLong) setDescLong(long);
  });
  // Einen neuen Stil anzuschauen (angeklickt oder mit ←/→ erreicht) nimmt das „neu“ weg
  useEffect(() => {
    if (filter.style !== 'alle' && filter.style !== 'ohne') markStyleSeen(session, filter.style);
  }, [filter.style]);
  // neuer Eintrag → ganzer Text wieder zu
  const selKey = `${nav.category}|${nav.type}|${nav.style}|${nav.index}`;
  useEffect(() => setDescOpen(false), [selKey]);

  const pick = (patch: Partial<NavState>) => setNav({ ...nav, ...patch });
  const rowClass = (r: NavRow, empty = false) => `catalog-row ${nav.row === r ? 'nav-active' : ''} ${empty ? 'empty' : ''}`;
  const noStyleHere = styles.length === 0;
  const noTypeHere = types.length === 0;

  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card book catalog pop-in">
        <h2 class="card-title">📒 Möbelkatalog</h2>
        <span class="money catalog-money">{formatMoney(money)}</span>
        <div class={`${rowClass('kategorie')} row-kat`}>
          <span class="row-label" />
          <ChipStrip>
            {categories.map((c) => (
              <button key={c} tabIndex={-1} class={`chip ${filter.category === c ? 'active' : ''}`} onClick={() => pick({ row: 'kategorie', category: c, type: 'alle', index: 0, variant: 0 })}>
                {CATEGORY_BY_ID[c].icon} {CATEGORY_BY_ID[c].name}
              </button>
            ))}
          </ChipStrip>
        </div>
        {/* Typ- und Stil-Zeile stehen immer da – gibt es nichts zu wählen, sind sie ausgegraut (das Fenster springt nicht) */}
        <div class={`${rowClass('typ', noTypeHere)} row-typ`}>
          <span class="row-label">Typ</span>
          <ChipStrip>
            {noTypeHere ? (
              <span class="chip small disabled">{CATEGORY_BY_ID[filter.category].types.length === 0 ? 'Keine Typen' : 'Nur ein Typ'}</span>
            ) : (
              types.map((t) => (
                <button key={t} tabIndex={-1} class={`chip small ${filter.type === t ? 'active' : ''}`} onClick={() => pick({ row: 'typ', type: t, index: 0, variant: 0 })}>
                  {typeLabel(filter.category, t)}
                </button>
              ))
            )}
          </ChipStrip>
        </div>
        <div class={`${rowClass('stil', noStyleHere)} row-stil`}>
          <span class="row-label">Stil</span>
          <ChipStrip>
            {noStyleHere ? (
              <span class="chip small disabled">Hier ohne Stil</span>
            ) : (
              styles.map((st: StyleFilter) => (
                <button key={st} tabIndex={-1} class={`chip small ${filter.style === st ? 'active' : ''}`} title={st !== 'alle' && st !== 'ohne' ? DESIGN_STYLE_BY_ID[st].blurb : undefined} onClick={() => pick({ row: 'stil', style: st, index: 0, variant: 0 })}>
                  {styleFilterLabel(st)}
                  {st !== 'alle' && st !== 'ohne' && isNewStyle(catCtx, st) && <span class="chip-new">neu</span>}
                </button>
              ))
            )}
          </ChipStrip>
        </div>
        <div ref={gridRef} class={`book-grid catalog-grid ${nav.row === 'raster' ? 'nav-active' : ''}`}>
          {list.length === 0 && <p class="soft center catalog-empty">Hier gibt es gerade nichts – schau in einer anderen Ecke des Katalogs!</p>}
          {list.map((e, i) => (
            <button key={e.id} tabIndex={-1} class={`book-cell catalog-cell ${i === nav.index ? 'selected' : ''}`} onClick={() => pick({ row: 'raster', index: i, variant: 0 })} aria-label={e.name} title={e.name}>
              <img src={itemIconUrl(e.variants[0].itemId)} alt="" draggable={false} />
              <span class="catalog-price">{e.price}</span>
            </button>
          ))}
        </div>
        {/* Feste Anordnung: Bild, Name, Ort, Stil, Text (feste Höhe), Farben (Platz bleibt frei), Preis */}
        <div class="item-detail catalog-detail">
          <img src={v ? itemIconUrl(v.itemId, 96) : undefined} alt="" style={{ visibility: v ? 'visible' : 'hidden' }} />
          <div class="detail-name item-name">{sel ? sel.name : 'Such dir etwas Schönes aus!'}</div>
          <div class="detail-line item-cat">
            {sel ? `${CATEGORY_BY_ID[sel.meta.category].name}${sel.meta.type ? ` › ${typeLabel(sel.meta.category, sel.meta.type)}` : ''}${sel.size ? ` · ${sel.size}` : ''}` : ' '}
          </div>
          <div class="detail-line item-cat soft">{sel ? styleLine(sel) : ' '}</div>
          <div class="detail-desc-wrap">
            <div ref={descRef} class="detail-desc item-desc">
              {sel ? sel.description : 'Gekauftes kommt in deine Tasche – oder, wenn du gerade einrichtest, direkt in deine Hand.'}
            </div>
            {descLong && sel && (
              <button class="desc-more" tabIndex={-1} onClick={() => setDescOpen(true)}>
                … weiterlesen <span class="soft">(Leertaste)</span>
              </button>
            )}
          </div>
          <div class={`variant-row ${nav.row === 'farbe' ? 'nav-active' : ''}`} style={{ visibility: sel && sel.variants.length > 1 ? 'visible' : 'hidden' }}>
            {(sel && sel.variants.length > 1 ? sel.variants : [{ itemId: '-', label: '', color: null }]).map((x, i) => (
              <button key={x.itemId} tabIndex={-1} class={`swatch ${i === nav.variant ? 'active' : ''}`} style={{ background: x.color ?? undefined }} title={x.label} aria-label={x.label} onClick={() => pick({ row: 'farbe', variant: i })} />
            ))}
            <span class="soft">{v && sel && sel.variants.length > 1 ? v.label : ''}</span>
          </div>
          <div class="item-price">{sel ? `Preis: ${sel.price} ${CURRENCY.icon}` : ' '}</div>
          {descOpen && sel && (
            <div class="desc-full pop-in" onClick={() => setDescOpen(false)}>
              <div class="item-name">{sel.name}</div>
              <div class="desc-full-text">{sel.description}</div>
              <div class="soft small-text">Leertaste, Esc oder Klick schließt</div>
            </div>
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
        <div class="catalog-hint soft small-text">↑↓ Zeile · ←→ auswählen · Bild↑↓ Kategorie · Leertaste ganzer Text · Enter kaufen · Esc schließen</div>
      </div>
    </div>
  );
}

/**
 * Eine Chip-Zeile ohne sichtbaren Scrollbalken: Geht sie über den Rand, erscheinen ◀ ▶ (Klick blättert),
 * die Kante blendet sanft aus. Mausrad und Pfeiltasten (aktiver Chip wird eingeblendet) funktionieren weiter.
 */
function ChipStrip({ children }: { children: ComponentChildren }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ left: false, right: false });
  const update = () => {
    const el = ref.current;
    if (!el) return;
    const left = el.scrollLeft > 2;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
    if (left !== edge.left || right !== edge.right) setEdge({ left, right });
  };
  useLayoutEffect(update);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  });
  const page = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.7, behavior: 'smooth' });
  return (
    <div class={`chip-strip ${edge.left ? 'more-left' : ''} ${edge.right ? 'more-right' : ''}`}>
      <button class="strip-arrow left" tabIndex={-1} aria-label="zurückblättern" style={{ visibility: edge.left ? 'visible' : 'hidden' }} onClick={() => page(-1)}>
        ◀
      </button>
      <div ref={ref} class="filter-strip" onWheel={wheelSideways} onScroll={update}>
        {children}
      </div>
      <button class="strip-arrow right" tabIndex={-1} aria-label="weiterblättern" style={{ visibility: edge.right ? 'visible' : 'hidden' }} onClick={() => page(1)}>
        ▶
      </button>
    </div>
  );
}
