/**
 * Linas Tasche – zum Ansehen, Verkaufen (Verkaufskiste) und Verschenken.
 */
import { useEffect, useMemo, useState } from 'preact/hooks';
import { sortInventory } from '../core/inventory';
import { CURRENCY, ITEM_ORDER, itemDef, maxStackOf } from '../data/items';
import { NPC_BY_ID } from '../data/npcs';
import { formatMoney, sellSlots } from '../game/gameplay';
import type { Session, UiPanel } from '../game/session';
import { itemIconUrl } from '../gfx/items';
import { showToast, ui, useSessionVersion } from './store';

const CATEGORY_LABEL: Record<string, string> = {
  obst: 'Obst',
  muschel: 'Strandfund',
  blume: 'Blumen',
  material: 'Material',
  fund: 'Schatz',
  essen: 'Leckerei',
  geschenk: 'Erinnerungsstück',
};

export function InventoryPanel({ session, panel }: { session: Session; panel: UiPanel }) {
  useSessionVersion(session);
  const data = session.data;
  const [selected, setSelected] = useState<number | null>(null);
  const [sellSet, setSellSet] = useState<Set<number>>(new Set());
  const mode = panel.kind;

  const close = () => {
    ui.set({ panel: null });
    if (panel.kind === 'gift') panel.onCancel();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || (mode === 'inventory' && (e.code === 'KeyI' || e.code === 'Tab'))) {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const slots = data?.inventory.slots ?? [];
  const sellTotal = useMemo(
    () =>
      [...sellSet].reduce((sum, i) => {
        const s = slots[i];
        const price = s ? itemDef(s.itemId)?.price : null;
        return sum + (s && price ? price * s.count : 0);
      }, 0),
    [sellSet, slots],
  );

  if (!data) return null;

  const onSlot = (i: number) => {
    const s = slots[i];
    if (!s) {
      setSelected(null);
      return;
    }
    if (mode === 'sell') {
      if (itemDef(s.itemId)?.price == null) {
        showToast('Das ist unverkäuflich – viel zu wertvoll! 💕');
        return;
      }
      const next = new Set(sellSet);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      setSellSet(next);
    }
    setSelected(i);
  };

  const sell = () => {
    const earned = sellSlots(session, [...sellSet]);
    setSellSet(new Set());
    setSelected(null);
    if (earned > 0) showToast(`Verkauft! +${formatMoney(earned)}`);
  };

  const gift = () => {
    if (panel.kind !== 'gift' || selected === null) return;
    const s = slots[selected];
    if (!s) return;
    ui.set({ panel: null });
    panel.onPick(s.itemId);
  };

  const sel = selected !== null ? slots[selected] : null;
  const selDef = sel ? itemDef(sel.itemId) : null;
  const empty = slots.every((s) => s === null);

  const title =
    mode === 'sell' ? 'Verkaufskiste' : mode === 'gift' && panel.kind === 'gift' ? `Was schenkst du ${NPC_BY_ID[panel.npcId]?.name ?? ''}?` : 'Deine Tasche';

  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card inventory pop-in">
        <h2 class="card-title">{title}</h2>
        <div class="inventory-meta">
          <span class="money">{formatMoney(data.money)}</span>
          {mode === 'inventory' && (
            <button
              class="btn small"
              onClick={() => {
                sortInventory(data.inventory, (id) => ITEM_ORDER[id] ?? 999, maxStackOf);
                setSelected(null);
                session.changed();
              }}
            >
              ↕ Sortieren
            </button>
          )}
          {mode === 'sell' && <span class="soft">Tippe an, was du verkaufen möchtest.</span>}
        </div>

        <div class="slot-grid">
          {slots.map((s, i) => (
            <button
              key={i}
              class={`slot ${s ? '' : 'empty'} ${selected === i ? 'selected' : ''} ${sellSet.has(i) ? 'marked' : ''}`}
              onClick={() => onSlot(i)}
              aria-label={s ? `${itemDef(s.itemId)?.name ?? s.itemId}, ${s.count} Stück` : 'leerer Platz'}
            >
              {s && <img src={itemIconUrl(s.itemId)} alt="" draggable={false} />}
              {s && s.count > 1 && <span class="count">{s.count}</span>}
            </button>
          ))}
        </div>

        <div class="item-detail">
          {selDef && sel ? (
            <>
              <img src={itemIconUrl(sel.itemId, 96)} alt="" />
              <div>
                <div class="item-name">
                  {selDef.name} {sel.count > 1 && <span class="soft">× {sel.count}</span>}
                </div>
                <div class="item-cat">{CATEGORY_LABEL[selDef.category]}</div>
                <div class="item-desc">{selDef.description}</div>
                <div class="item-price">
                  {selDef.price === null ? 'unverkäuflich 💕' : `Wert: ${selDef.price} ${CURRENCY.icon} pro Stück`}
                </div>
              </div>
            </>
          ) : (
            <p class="soft center">
              {empty
                ? 'Deine Tasche ist noch leer. Schüttel Bäume, sammle Muscheln am Strand oder pflück ein paar Blumen!'
                : 'Tippe einen Gegenstand an, um ihn dir anzusehen.'}
            </p>
          )}
        </div>

        <div class="card-actions">
          <button class="btn ghost" onClick={close}>
            {mode === 'inventory' ? 'Schließen' : 'Abbrechen'}
          </button>
          {mode === 'sell' && (
            <button class="btn primary" disabled={sellTotal === 0} onClick={sell}>
              Verkaufen {sellTotal > 0 ? `+${formatMoney(sellTotal)}` : ''}
            </button>
          )}
          {mode === 'gift' && (
            <button class="btn primary" disabled={!sel} onClick={gift}>
              🎁 Schenken
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
