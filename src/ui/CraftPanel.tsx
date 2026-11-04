/**
 * Opas Werkbank: gelernte Rezepte ansehen und aus Materialien bauen.
 * Unbekannte Rezepte erscheinen als Schatten mit einem kleinen Hinweis.
 */
import { useEffect, useState } from 'preact/hooks';
import { countItem } from '../core/inventory';
import { FURNITURE_BY_ITEM, STYLE_LABELS } from '../data/furniture';
import { itemDef } from '../data/items';
import { RECIPES } from '../data/recipes';
import { craftRecipe, recipeName } from '../game/crafting';
import type { Session } from '../game/session';
import { itemIconUrl } from '../gfx/items';
import { showToast, ui, useSessionVersion } from './store';

export function CraftPanel({ session }: { session: Session }) {
  useSessionVersion(session);
  const data = session.data;
  const known = new Set(data?.recipes ?? []);
  const [selected, setSelected] = useState<string | null>(RECIPES.find((r) => known.has(r.id))?.id ?? null);
  const [built, setBuilt] = useState<string | null>(null);
  const close = () => ui.set({ panel: null });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!data) return null;
  const sel = RECIPES.find((r) => r.id === selected) ?? null;
  const isKnown = !!sel && known.has(sel.id);
  const have = (id: string) => countItem(data.inventory, id);
  const ready = !!sel && isKnown && sel.ingredients.every((i) => have(i.itemId) >= i.count);
  const furn = sel ? FURNITURE_BY_ITEM[sel.result]?.def : undefined;

  const build = () => {
    if (!sel) return;
    const r = craftRecipe(session, sel.id);
    if (r === 'ok') {
      showToast(`✨ ${recipeName(sel)} gebaut! Ab in die Tasche – aufstellen mit „Einrichten“.`);
      setBuilt(sel.id);
      window.setTimeout(() => setBuilt(null), 900);
    } else if (r === 'voll') showToast('Deine Tasche ist zu voll für das fertige Stück. 🎒');
    else if (r === 'fehlt') showToast('Da fehlt noch etwas Material.');
  };

  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card book craft pop-in">
        <h2 class="card-title">🔨 Opas Werkbank</h2>
        <div class="book-tabs">
          <span class="soft small-text">Aus Ästen, Steinen, Muscheln & Blumen wird etwas Schönes.</span>
          <span class="book-progress">
            {known.size}/{RECIPES.length} Rezepte
          </span>
        </div>
        <div class="book-grid catalog-grid">
          {RECIPES.map((r) => {
            const k = known.has(r.id);
            const can = k && r.ingredients.every((i) => have(i.itemId) >= i.count);
            return (
              <button
                key={r.id}
                class={`book-cell catalog-cell ${k ? '' : 'unknown'} ${selected === r.id ? 'selected' : ''} ${built === r.id ? 'craft-pop' : ''}`}
                onClick={() => setSelected(r.id)}
                aria-label={k ? recipeName(r) : 'Unbekanntes Rezept'}
              >
                <img src={itemIconUrl(r.result)} alt="" draggable={false} />
                {can && <span class="craft-ready">✓</span>}
              </button>
            );
          })}
        </div>
        <div class="item-detail">
          {sel && isKnown ? (
            <>
              <img src={itemIconUrl(sel.result, 96)} alt="" class={built === sel.id ? 'craft-pop' : ''} />
              <div>
                <div class="item-name">{recipeName(sel)}</div>
                <div class="item-cat">
                  {furn ? STYLE_LABELS[furn.style] : ''}
                  {furn ? ` · ${furn.small ? 'klein (passt auf Tische)' : furn.rug ? `Teppich ${furn.w}×${furn.d}` : `${furn.w}×${furn.d} Felder`}` : ''}
                </div>
                <div class="item-desc">{furn?.description}</div>
                <div class="craft-needs">
                  {sel.ingredients.map((i) => {
                    const n = have(i.itemId);
                    return (
                      <span key={i.itemId} class={`craft-need ${n >= i.count ? 'ok' : ''}`} title={itemDef(i.itemId)?.name}>
                        <img src={itemIconUrl(i.itemId)} alt="" />
                        {Math.min(n, i.count)}/{i.count}
                      </span>
                    );
                  })}
                </div>
              </div>
            </>
          ) : sel ? (
            <p class="soft center">
              Dieses Rezept kennst du noch nicht.
              <br />
              💡 {sel.hint}
            </p>
          ) : (
            <p class="soft center">Noch keine Rezepte – aber das ändert sich bestimmt bald!</p>
          )}
        </div>
        <div class="card-actions">
          <button class="btn ghost" onClick={close}>
            Schließen
          </button>
          <button class="btn primary" disabled={!ready} onClick={build}>
            🔨 Bauen
          </button>
        </div>
      </div>
    </div>
  );
}
