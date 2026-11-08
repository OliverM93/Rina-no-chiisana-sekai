/**
 * Linas Tasche – zum Ansehen, Verkaufen (Verkaufskiste) und Verschenken.
 */
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { sortInventory } from '../core/inventory';
import { CURRENCY, FLOWER_BY_SEED, isKeepsake, ITEM_ORDER, itemDef, maxStackOf, type ToolId, TOOLS } from '../data/items';
import { NPC_BY_ID } from '../data/npcs';
import { formatMoney, sellSlots } from '../game/gameplay';
import { toggleTool } from '../game/nature';
import { applySurface, isSurface } from '../game/home';
import type { Session, UiPanel } from '../game/session';
import { itemIconUrl } from '../gfx/items';
import { showToast, ui, useSessionVersion } from './store';

const CATEGORY_LABEL: Record<string, string> = {
  obst: 'Obst',
  muschel: 'Strandfund',
  blume: 'Blumen',
  gemuese: 'Gemüse',
  kraut: 'Kraut',
  material: 'Material',
  fund: 'Schatz',
  essen: 'Leckerei',
  geschenk: 'Erinnerungsstück',
  werkzeug: 'Werkzeug',
  moebel: 'Möbel',
  tapete: 'Tapete',
  boden: 'Boden',
  samen: 'Samen',
  fisch: 'Fisch',
  insekt: 'Insekt',
};

export function InventoryPanel({ session, panel }: { session: Session; panel: UiPanel }) {
  useSessionVersion(session);
  const data = session.data;
  const [selected, setSelected] = useState<number | null>(() => {
    if (panel.kind !== 'seeds') return null;
    const i = (data?.inventory.slots ?? []).findIndex((s) => !!s && !!FLOWER_BY_SEED[s.itemId]);
    return i >= 0 ? i : null;
  });
  const [sellSet, setSellSet] = useState<Set<number>>(new Set());
  /** Tastatur-Cursor (Pfeiltasten) */
  const [cursor, setCursor] = useState<number>(() => selected ?? 0);
  const gridRef = useRef<HTMLDivElement>(null);
  // Schnelle Tastendrücke kommen vor dem nächsten Neuzeichnen an – der Cursor wird deshalb sofort in einer Ref mitgeführt
  const sellRef = useRef<Set<number>>(sellSet);
  sellRef.current = sellSet;
  const cursorRef = useRef(cursor);
  cursorRef.current = cursor;
  const mode = panel.kind;

  const close = () => {
    ui.set({ panel: null });
    if (panel.kind === 'gift' || panel.kind === 'seeds') panel.onCancel();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || (mode === 'inventory' && (e.code === 'KeyI' || e.code === 'Tab'))) {
        e.preventDefault();
        close();
        return;
      }
      // Pfeiltasten: Cursor durch die Plätze bewegen
      const cols = Math.max(1, gridRef.current ? getComputedStyle(gridRef.current).gridTemplateColumns.split(' ').length : 5);
      const step = e.code === 'ArrowLeft' ? -1 : e.code === 'ArrowRight' ? 1 : e.code === 'ArrowUp' ? -cols : e.code === 'ArrowDown' ? cols : 0;
      if (step !== 0) {
        e.preventDefault();
        let next = Math.min(slots.length - 1, Math.max(0, cursorRef.current + step));
        if (mode === 'seeds') {
          // beim Pflanzen springt der Cursor von Samen zu Samen (leere Plätze & anderes sind nicht wählbar)
          const seeds = slots.map((sl, idx) => (sl && FLOWER_BY_SEED[sl.itemId] ? idx : -1)).filter((idx) => idx >= 0);
          if (seeds.length === 0) return;
          const at = seeds.indexOf(cursorRef.current);
          const dir = step > 0 ? 1 : -1;
          next = seeds[(((at === -1 ? (dir > 0 ? -1 : 0) : at) + dir) % seeds.length + seeds.length) % seeds.length];
        }
        cursorRef.current = next;
        setCursor(next);
        const sl = slots[next];
        // nur anzeigen, was in diesem Fenster auch wählbar ist (keine Hinweise beim bloßen Durchlaufen)
        setSelected(sl && (mode !== 'seeds' || FLOWER_BY_SEED[sl.itemId]) ? next : null);
        return;
      }
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (mode === 'seeds') plant(cursorRef.current);
        else if (mode === 'gift') {
          if (selected === cursorRef.current) gift();
          else onSlot(cursorRef.current);
        } else if (mode === 'sell') {
          // Leertaste markiert, Enter verkauft die Markierten
          if (e.code === 'Enter' && sellRef.current.size > 0) sell();
          else onSlot(cursorRef.current);
        } else onSlot(cursorRef.current);
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
    cursorRef.current = i;
    setCursor(i);
    (document.activeElement as HTMLElement | null)?.blur?.(); // Leertaste soll nicht den fokussierten Knopf noch einmal auslösen
    const s = slots[i];
    if (!s) {
      setSelected(null);
      return;
    }
    if (mode === 'gift' && isKeepsake(s.itemId)) {
      showToast((TOOLS as readonly string[]).includes(s.itemId) ? 'Dein Werkzeug brauchst du noch! 🔧' : 'Das ist ein Erinnerungsstück – das behältst du lieber. 💕');
      return;
    }
    if (mode === 'seeds' && !FLOWER_BY_SEED[s.itemId]) {
      showToast('Das kann man nicht einpflanzen. 🌱');
      return;
    }
    if (mode === 'sell') {
      if (itemDef(s.itemId)?.price == null) {
        showToast((TOOLS as readonly string[]).includes(s.itemId) ? 'Dein Werkzeug brauchst du noch! 🔧' : 'Das ist unverkäuflich – viel zu wertvoll! 💕');
        return;
      }
      const next = new Set(sellRef.current);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      sellRef.current = next;
      setSellSet(next);
    }
    setSelected(i);
  };

  const sell = () => {
    const earned = sellSlots(session, [...sellRef.current]);
    sellRef.current = new Set();
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

  const plant = (index: number | null = selected) => {
    if (panel.kind !== 'seeds' || index === null) return;
    const s = slots[index];
    if (!s || !FLOWER_BY_SEED[s.itemId]) return;
    ui.set({ panel: null });
    panel.onPick(s.itemId);
  };

  const sel = selected !== null ? slots[selected] : null;
  const selDef = sel ? itemDef(sel.itemId) : null;
  const empty = slots.every((s) => s === null);

  const title =
    mode === 'sell'
      ? 'Verkaufskiste'
      : mode === 'gift' && panel.kind === 'gift'
        ? `Was schenkst du ${NPC_BY_ID[panel.npcId]?.name ?? ''}?`
        : mode === 'seeds'
          ? 'Was möchtest du pflanzen?'
          : 'Deine Tasche';
  const selTool = sel && (TOOLS as readonly string[]).includes(sel.itemId) ? (sel.itemId as ToolId) : null;

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
          {mode === 'sell' && <span class="soft">Tippe an (oder Pfeiltasten + Leertaste), was du verkaufen möchtest. Enter verkauft.</span>}
        </div>

        <div class="slot-grid" ref={gridRef}>
          {slots.map((s, i) => (
            <button
              key={i}
              class={`slot ${s ? '' : 'empty'} ${selected === i ? 'selected' : ''} ${cursor === i ? 'cursor' : ''} ${sellSet.has(i) ? 'marked' : ''}`}
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
                  {(TOOLS as readonly string[]).includes(sel.itemId)
                    ? 'Werkzeug – behältst du immer 🔧'
                    : isKeepsake(sel.itemId)
                      ? 'Erinnerungsstück – unverkäuflich, nicht zum Verschenken 💕'
                      : selDef.price === null
                        ? 'unverkäuflich 💕'
                        : `Wert: ${selDef.price} ${CURRENCY.icon} pro Stück`}
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
            <button class="btn primary" disabled={!sel || isKeepsake(sel.itemId)} onClick={gift}>
              🎁 Schenken
            </button>
          )}
          {mode === 'seeds' && (
            <button class="btn primary" disabled={!sel} onClick={() => plant()}>
              🌱 Pflanzen
            </button>
          )}
          {mode === 'inventory' && sel && isSurface(sel.itemId) && session.inside && (
            <button
              class="btn primary"
              onClick={() => {
                if (applySurface(session, sel.itemId)) showToast(`${selDef?.name} angebracht! ✨`);
                setSelected(null);
              }}
            >
              ✨ Anbringen
            </button>
          )}
          {mode === 'inventory' && selTool && (
            <button
              class="btn primary"
              onClick={() => {
                toggleTool(session, session.tool === selTool ? null : selTool);
                ui.set({ panel: null });
              }}
            >
              {session.tool === selTool ? 'Wegstecken' : 'In die Hand nehmen'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
