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
import { milestoneMissing } from '../game/progress';
import type { Session } from '../game/session';
import { itemIconUrl } from '../gfx/items';
import { showToast, ui, useSessionVersion } from './store';

const TEXT = {
  werkbank: { title: '🔨 Opas Werkbank', intro: 'Aus Ästen, Steinen, Muscheln & Blumen wird etwas Schönes.', button: '🔨 Bauen', done: 'gebaut! Ab in die Tasche – aufstellen mit „Einrichten“.' },
  apotheke: { title: '🌿 Apotheke von Dr. Lars', intro: '„Tee hilft immer. Sagt Oma. Und ausnahmsweise geb ich ihr recht.“', button: '🫖 Aufbrühen', done: 'aufgebrüht! Wohl bekomm\'s!' },
  herd: { title: '🍳 Linas Küche', intro: 'Lina kocht für ihr Leben gern. Heute wird es bestimmt lecker!', button: '🍳 Kochen', done: 'gekocht! Riecht das gut! Ab in die Tasche.' },
  kueche: { title: '👨‍🍳 Kochstudio „Chez Jens“', intro: '„Kochen ist wie Malen, chérie – ein Klecks hiervon, ein Klecks davon!“', button: '🍳 Kochen', done: 'gekocht! Magnifique! Ab in die Tasche.' },
};

export function CraftPanel({ session, station = 'werkbank' }: { session: Session; station?: 'werkbank' | 'kueche' | 'apotheke' | 'herd' }) {
  const [group, setGroup] = useState<'alle' | 'bauen' | 'blumen'>('alle');
  const ALL = RECIPES.filter((r) => (r.station ?? 'werkbank') === (station === 'herd' ? 'kueche' : station));
  // An der Werkbank gibt es zwei Reiter: Bauen & Blumen binden
  const WORKBENCH = station === 'werkbank' && group !== 'alle' ? ALL.filter((r) => (r.group === 'blumen') === (group === 'blumen')) : ALL;
  const T = TEXT[station];
  useSessionVersion(session);
  const data = session.data;
  const known = new Set(data?.recipes ?? []);
  const [selected, setSelected] = useState<string | null>(WORKBENCH.find((r) => known.has(r.id))?.id ?? null);
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
  const sel = WORKBENCH.find((r) => r.id === selected) ?? null;
  const isKnown = !!sel && known.has(sel.id);
  const have = (id: string) => countItem(data.inventory, id);
  const ready = !!sel && isKnown && sel.ingredients.every((i) => have(i.itemId) >= i.count);
  const furn = sel ? FURNITURE_BY_ITEM[sel.result]?.def : undefined;

  const build = () => {
    if (!sel) return;
    const r = craftRecipe(session, sel.id);
    if (r === 'ok') {
      showToast(`✨ ${recipeName(sel)} ${sel.group === 'blumen' ? 'gebunden! Ab in die Tasche.' : T.done}`);
      setBuilt(sel.id);
      window.setTimeout(() => setBuilt(null), 900);
    } else if (r === 'voll') showToast('Deine Tasche ist zu voll für das fertige Stück. 🎒');
    else if (r === 'fehlt') showToast('Da fehlt noch etwas Material.');
  };

  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card book craft pop-in">
        <h2 class="card-title">{T.title}</h2>
        {station !== 'werkbank' && <div class="craft-spacer" />}
        {station === 'werkbank' && (
          <div class="seed-tabs">
            {([['alle', 'Alles'], ['bauen', '🔨 Bauen'], ['blumen', '💐 Blumen binden']] as const).map(([k, label]) => (
              <button key={k} class={`btn ${group === k ? 'primary' : ''}`} onClick={() => setGroup(k)}>
                {label}
              </button>
            ))}
          </div>
        )}
        <div class="book-tabs">
          <span class="soft small-text">{T.intro}</span>
          {station === 'werkbank' && milestoneMissing(session, 'gebaut')?.npc === 'jens' && <span class="soft small-text">💡 Jens freut sich über Selbstgebautes – bau ein paar Sachen, dann kommt er vielleicht bald ins Dorf.</span>}
          <span class="book-progress">
            {WORKBENCH.filter((r) => known.has(r.id)).length}/{WORKBENCH.length} Rezepte
          </span>
        </div>
        <div class="book-grid catalog-grid">
          {WORKBENCH.map((r) => {
            const k = known.has(r.id);
            const can = k && r.ingredients.every((i) => have(i.itemId) >= i.count);
            return (
              <button
                key={r.id}
                class={`book-cell catalog-cell ${k ? '' : 'unknown'} ${selected === r.id ? 'selected' : ''} ${built === r.id ? 'craft-pop' : ''}`}
                onClick={() => setSelected(r.id)}
                onFocus={() => setSelected(r.id)}
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
                <div class="item-desc">{furn?.description ?? itemDef(sel.result)?.description}</div>
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
            {sel?.group === 'blumen' ? '💐 Binden' : T.button}
          </button>
        </div>
      </div>
    </div>
  );
}
