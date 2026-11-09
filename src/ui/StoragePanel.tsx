/**
 * Vorratstruhe: links die Tasche, rechts die Truhe (60 Plätze). Ein Klick (oder Enter/Leertaste auf dem
 * Platz) legt den ganzen Stapel auf die andere Seite. Pfeiltasten springen von Platz zu Platz.
 */
import { useEffect, useState } from 'preact/hooks';
import { CATEGORY_LABEL } from './categories';
import { CURRENCY, itemDef } from '../data/items';
import { itemIconUrl } from '../gfx/items';
import { sortStorage, storeStack, storageName, storageUsed, takeStored, type StorageResult } from '../game/storage';
import type { Session } from '../game/session';
import { showToast, ui, useSessionVersion } from './store';

interface Focus {
  from: 'bag' | 'chest';
  index: number;
}

export function StoragePanel({ session }: { session: Session }) {
  useSessionVersion(session);
  const [focus, setFocus] = useState<Focus | null>(null);
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
  });
  const data = session.data;
  if (!data) return null;

  const say = (r: StorageResult, name: string, to: string) => {
    if (r === 'ok') showToast(`${name} → ${to}`);
    else if (r === 'voll') showToast(to === 'Truhe' ? 'Die Truhe ist voll! 📦' : 'Deine Tasche ist voll! 🎒');
    else if (r === 'werkzeug') showToast('Werkzeuge behältst du lieber griffbereit. 🔧');
  };
  const store = (i: number) => {
    const s = data.inventory.slots[i];
    if (s) say(storeStack(session, i), storageName(s.itemId), 'Truhe');
  };
  const take = (i: number) => {
    const s = data.storage.slots[i];
    if (s) say(takeStored(session, i), storageName(s.itemId), 'Tasche');
  };

  const slots = (list: typeof data.inventory.slots, from: 'bag' | 'chest') =>
    list.map((s, i) => (
      <button
        key={i}
        class={`slot ${s ? '' : 'empty'}`}
        onClick={() => (from === 'bag' ? store(i) : take(i))}
        onFocus={() => setFocus({ from, index: i })}
        onMouseEnter={() => setFocus({ from, index: i })}
        aria-label={s ? `${itemDef(s.itemId)?.name ?? s.itemId}, ${s.count} Stück – ${from === 'bag' ? 'in die Truhe legen' : 'in die Tasche nehmen'}` : 'leerer Platz'}
      >
        {s && <img src={itemIconUrl(s.itemId)} alt="" draggable={false} />}
        {s && s.count > 1 && <span class="count">{s.count}</span>}
      </button>
    ));

  const shown = focus ? (focus.from === 'bag' ? data.inventory : data.storage).slots[focus.index] : null;
  const def = shown ? itemDef(shown.itemId) : null;
  const used = storageUsed(session);

  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card storage-card pop-in">
        <h2 class="card-title">📦 Vorratstruhe</h2>
        <div class="storage-cols">
          <div>
            <h3 class="bank-sub">🎒 Tasche</h3>
            <div class="slot-grid storage-bag">{slots(data.inventory.slots, 'bag')}</div>
          </div>
          <div>
            <h3 class="bank-sub">
              📦 Truhe <span class="soft small-text">{used}/{data.storage.slots.length}</span>
              <button class="btn small" style={{ marginLeft: '10px' }} onClick={() => sortStorage(session)}>
                ↕ Sortieren
              </button>
            </h3>
            <div class="slot-grid storage-chest">{slots(data.storage.slots, 'chest')}</div>
          </div>
        </div>
        <div class="item-detail storage-detail">
          {def && shown ? (
            <>
              <img src={itemIconUrl(shown.itemId, 96)} alt="" />
              <div>
                <div class="item-name">
                  {def.name} {shown.count > 1 && <span class="soft">× {shown.count}</span>}
                </div>
                <div class="item-cat">{CATEGORY_LABEL[def.category]}</div>
                <div class="item-price">
                  {def.price === null ? 'unverkäuflich 💕' : `Wert: ${def.price} ${CURRENCY.icon} pro Stück`} · {focus?.from === 'bag' ? 'Klick: in die Truhe' : 'Klick: in die Tasche'}
                </div>
              </div>
            </>
          ) : (
            <p class="soft center">Klick (oder Enter) legt einen ganzen Stapel auf die andere Seite. Werkzeuge bleiben in der Tasche.</p>
          )}
        </div>
        <div class="card-actions">
          <button class="btn primary" onClick={close}>
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
}
