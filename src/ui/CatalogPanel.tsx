/**
 * Möbelkatalog: Möbel, Tapeten und Böden für Sternchen kaufen.
 * Gekauftes landet sofort in der Tasche.
 */
import { useEffect, useRef, useState } from 'preact/hooks';
import { CURRENCY } from '../data/items';
import { FLOORS, FURNITURE, type FurnitureStyle, STYLE_LABELS, VARIANT_LABELS, WALLPAPERS } from '../data/furniture';
import { getSeason } from '../core/time';
import { formatMoney } from '../game/gameplay';
import { buyFromCatalog, isSurface, styleUnlocked } from '../game/home';
import type { Session } from '../game/session';
import { itemIconUrl } from '../gfx/items';
import { showToast, ui, useSessionVersion } from './store';

type Tab = 'moebel' | 'tapete' | 'boden';

interface Entry {
  /** Basis-ID (Möbel) bzw. Tapete/Boden */
  id: string;
  name: string;
  price: number;
  style: FurnitureStyle;
  description: string;
  /** Kauf-IDs (Varianten) */
  variants: Array<{ itemId: string; label: string; color: string | null }>;
  size?: string;
}

function entries(tab: Tab, winter: boolean, season: string): Entry[] {
  if (tab === 'moebel') {
    return FURNITURE.filter((f) => !f.crafted && !f.gift && !f.retired && (!f.seasonal || winter) && (!f.inSeason || f.inSeason === season)).map((f) => ({
      id: f.id,
      name: f.name,
      price: f.price,
      style: f.style,
      description: f.description,
      size: f.wall ? `🖼️ Wand-Deko, ${f.w} breit (Möbel passen darunter)` : f.small ? 'klein (passt auf Tische)' : f.rug ? `Teppich ${f.w}×${f.d}` : `${f.w}×${f.d} Felder`,
      variants: f.variants
        ? Object.entries(f.variants).map(([v, color]) => ({ itemId: `${f.id}-${v}`, label: VARIANT_LABELS[v] ?? v, color }))
        : [{ itemId: f.id, label: '', color: null }],
    }));
  }
  return (tab === 'tapete' ? WALLPAPERS : FLOORS).map((s) => ({ id: s.id, name: s.name, price: s.price, style: s.style, description: s.description, variants: [{ itemId: s.id, label: '', color: null }] }));
}

export function CatalogPanel({ session }: { session: Session }) {
  useSessionVersion(session);
  const [tab, setTab] = useState<Tab>('moebel');
  const [style, setStyle] = useState<FurnitureStyle | 'alle'>('alle');
  const [selected, setSelected] = useState<string | null>(null);
  const [variant, setVariant] = useState(0);
  const close = () => ui.set({ panel: null });

  const buyRef = useRef<() => void>(() => {});
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        close();
      }
      // Enter kauft den ausgewählten Gegenstand (Knöpfe, Reiter & Farbpunkte behalten ihr eigenes Enter)
      if (e.code === 'Enter' && !e.repeat) {
        const active = document.activeElement;
        const ownEnter = active instanceof HTMLElement && active.matches('.btn, .chip, .swatch');
        if (!ownEnter) {
          e.preventDefault();
          buyRef.current();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const money = session.data?.money ?? 0;
  const season = getSeason(session.clock());
  const winter = season === 'winter';
  const list = entries(tab, winter, season).filter((e) => styleUnlocked(session, e.style) && (style === 'alle' || e.style === style));
  const sel = list.find((e) => e.id === selected) ?? null;
  const v = sel ? sel.variants[Math.min(variant, sel.variants.length - 1)] : null;

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

  buyRef.current = buy;

  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card book catalog pop-in">
        <h2 class="card-title">📒 Möbelkatalog</h2>
        <div class="book-tabs">
          {(
            [
              ['moebel', '🪑 Möbel'],
              ['tapete', '🖼️ Tapeten'],
              ['boden', '🟫 Böden'],
            ] as const
          ).map(([t, label]) => (
            <button
              key={t}
              class={`chip ${tab === t ? 'active' : ''}`}
              onClick={() => {
                setTab(t);
                setSelected(null);
              }}
            >
              {label}
            </button>
          ))}
          <span class="money book-progress">{formatMoney(money)}</span>
        </div>
        <div class="book-tabs">
          {(['alle', 'japanisch', 'basis', 'cottage', 'retro', 'modern', 'midcentury', ...(styleUnlocked(session, 'bistro') ? (['bistro'] as const) : []), 'garten', 'lieblinge', ...(winter || tab !== 'moebel' ? (['winter'] as const) : [])] as const).map((s) => (
            <button key={s} class={`chip small ${style === s ? 'active' : ''}`} onClick={() => setStyle(s)}>
              {s === 'alle' ? 'Alle Stile' : STYLE_LABELS[s]}
            </button>
          ))}
        </div>
        <div class="book-grid catalog-grid">
          {list.map((e) => (
            <button
              key={e.id}
              class={`book-cell catalog-cell ${selected === e.id ? 'selected' : ''}`}
              onClick={() => {
                setSelected(e.id);
                setVariant(0);
              }}
              onFocus={() => {
                // Pfeiltasten springen nur den Fokus weiter – die Auswahl (und die Anzeige rechts) folgt
                if (selected !== e.id) {
                  setSelected(e.id);
                  setVariant(0);
                }
              }}
              aria-label={e.name}
            >
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
                  {STYLE_LABELS[sel.style]}
                  {sel.size ? ` · ${sel.size}` : ''}
                </div>
                <div class="item-desc">{sel.description}</div>
                {sel.variants.length > 1 && (
                  <div class="variant-row">
                    {sel.variants.map((x, i) => (
                      <button key={x.itemId} class={`swatch ${i === variant ? 'active' : ''}`} style={{ background: x.color ?? undefined }} title={x.label} aria-label={x.label} onClick={() => setVariant(i)} />
                    ))}
                    <span class="soft">{v.label}</span>
                  </div>
                )}
                <div class="item-price">
                  Preis: {sel.price} {CURRENCY.icon}
                </div>
                <div class="soft small-text">Enter kauft</div>
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
      </div>
    </div>
  );
}
