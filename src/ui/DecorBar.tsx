/**
 * Zu Hause: Knopf „Einrichten“ und – im Einrichtungsmodus – die Leiste mit Vorrat (Tasche + Truhe), Katalog,
 * Farben, Drehen/Wegräumen/Rückgängig/Fertig. Tastatur: R drehen · T wegräumen · C „noch eins“ ·
 * V oder 1–9 Farbe · Strg+Z rückgängig · G fertig.
 */
import { useEffect, useState } from 'preact/hooks';
import { FURNITURE_BY_ITEM, SURFACE_BY_ID } from '../data/furniture';
import { itemDef } from '../data/items';
import { decorStock, fitsHere } from '../game/home';
import type { DecorCommand, DecorState, Session } from '../game/session';
import { itemIconUrl } from '../gfx/items';
import { ui, useSessionVersion } from './store';

export function useHomeState(session: Session) {
  const [inside, setInside] = useState(session.inside);
  const [inYard, setInYard] = useState(session.inYard);
  const [decor, setDecor] = useState<DecorState>({ active: session.decorActive, holding: null, valid: true, variants: [], canUndo: false });
  useEffect(() => {
    const offs = [session.bus.on('home:inside', setInside), session.bus.on('home:yard', setInYard), session.bus.on('decor:state', setDecor)];
    // falls sich etwas geändert hat, bevor wir zugehört haben
    setInside(session.inside);
    setInYard(session.inYard);
    return () => offs.forEach((o) => o());
  }, [session]);
  return { inside, inYard: inYard && !inside, decor };
}

export function DecorBar({ session, decor }: { session: Session; decor: DecorState }) {
  useSessionVersion(session);
  const send = (c: DecorCommand) => session.bus.emit('decor:command', c);

  useEffect(() => {
    if (!decor.active) return;
    const onKey = (e: KeyboardEvent) => {
      if (ui.state.panel || ui.state.dialog || ui.state.menuOpen) return; // Katalog & Co. haben ihre eigene Tastatur
      if (e.ctrlKey || e.metaKey) {
        if (e.code === 'KeyZ') {
          e.preventDefault();
          send({ kind: 'undo' });
        }
        return;
      }
      if (e.code === 'KeyR') send({ kind: 'rotate' });
      if (e.code === 'Delete' || e.code === 'Backspace' || e.code === 'KeyT') send({ kind: 'store' });
      if (e.code === 'KeyC' && !e.repeat) send({ kind: 'pipette' });
      if (e.code === 'KeyV' && !e.repeat) send({ kind: 'variant' });
      const digit = /^Digit([1-9])$/.exec(e.code);
      if (digit) send({ kind: 'variant', index: Number(digit[1]) - 1 });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [decor.active]);

  const outside = !session.inside;
  if (!decor.active && session.visiting) return null;
  if (!decor.active) {
    return (
      <button class="btn primary decor-start pop-in" title="Taste G" onClick={() => send({ kind: 'start' })}>
        {outside ? '🌷 Garten gestalten' : '🛋️ Einrichten'}
        <span class="hud-tool-key">G</span>
      </button>
    );
  }

  // Vorrat: Tasche + Truhe (Möbel, Tapeten, Böden)
  const stock = decorStock(session).filter((s) => (FURNITURE_BY_ITEM[s.itemId] ? fitsHere(session, s.itemId) : !outside && !!SURFACE_BY_ID[s.itemId]));
  const holding = decor.holding ? itemDef(decor.holding)?.name : null;

  return (
    <>
      <div class="card decor-panel pop-in">
        <div class="decor-title">
          Vorrat <span class="soft small-text">(Tasche &amp; Truhe)</span>
        </div>
        {stock.length === 0 ? (
          <p class="soft small-text">{outside ? 'Keine Gartensachen da. Hol dir welche im 🛒 Katalog oder an der Werkbank!' : 'Nichts zum Aufstellen da. Hol dir etwas im 🛒 Katalog!'}</p>
        ) : (
          <div class="decor-grid">
            {stock.map((s) => (
              <button
                key={s.itemId}
                class={`book-cell decor-cell ${decor.holding === s.itemId ? 'selected' : ''}`}
                title={`${itemDef(s.itemId)?.name}${s.inStorage ? ' (aus der Truhe)' : ''}`}
                onClick={() => send(SURFACE_BY_ID[s.itemId] ? { kind: 'surface', itemId: s.itemId } : { kind: 'take', itemId: s.itemId })}
              >
                <img src={itemIconUrl(s.itemId)} alt="" draggable={false} />
                {s.count > 1 && <span class="decor-count">{s.count}</span>}
                {s.inStorage && <span class="decor-box" aria-label="in der Truhe">🧺</span>}
              </button>
            ))}
          </div>
        )}
        <button class="btn small decor-shop" onClick={() => session.bus.emit('ui:open', { kind: 'catalog' })}>
          🛒 Katalog
        </button>
      </div>
      <div class="decor-bar pop-in">
        <span class="decor-hint">
          {holding
            ? `${holding}: Klicken zum Abstellen${decor.valid ? '' : ' (hier passt es nicht)'}`
            : outside
              ? 'Klick auf Gartensachen zum Verschieben – laufen geht mit WASD.'
              : 'Klick auf ein Möbel zum Verschieben – C = noch eins. Kamera: ziehen oder WASD, Mausrad zoomt.'}
        </span>
        {decor.variants.length > 1 && (
          <span class="decor-colors" title="Farbe wechseln (V oder 1–9) – kostenlos">
            {decor.variants.map((v, i) => (
              <button key={v.itemId} class={`swatch ${v.itemId === decor.holding ? 'active' : ''}`} style={{ background: v.color }} aria-label={v.label} onClick={() => send({ kind: 'variant', index: i })}>
                <span class="swatch-key">{i + 1}</span>
              </button>
            ))}
          </span>
        )}
        <button class="btn small" disabled={!decor.holding} onClick={() => send({ kind: 'rotate' })}>
          ↻ Drehen (R)
        </button>
        <button class="btn small" disabled={!decor.holding} onClick={() => send({ kind: 'store' })}>
          🎒 Wegräumen (T)
        </button>
        <button class="btn small" disabled={!decor.canUndo} onClick={() => send({ kind: 'undo' })} title="Strg+Z">
          ↶ Rückgängig
        </button>
        <button class="btn primary small" onClick={() => send({ kind: 'stop' })}>
          ✓ Fertig (G)
        </button>
      </div>
    </>
  );
}
