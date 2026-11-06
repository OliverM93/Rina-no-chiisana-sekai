/**
 * Zu Hause: Knopf „Einrichten“ und – im Einrichtungsmodus – die Leiste mit
 * Möbeln, Tapeten & Böden aus der Tasche sowie Drehen/Wegräumen/Fertig.
 */
import { useEffect, useState } from 'preact/hooks';
import { FURNITURE_BY_ITEM, SURFACE_BY_ID } from '../data/furniture';
import { itemDef } from '../data/items';
import { applySurface, fitsHere } from '../game/home';
import type { DecorCommand, DecorState, Session } from '../game/session';
import { itemIconUrl } from '../gfx/items';
import { showToast, useSessionVersion } from './store';

export function useHomeState(session: Session) {
  const [inside, setInside] = useState(session.inside);
  const [inYard, setInYard] = useState(session.inYard);
  const [decor, setDecor] = useState<DecorState>({ active: session.decorActive, holding: null, valid: true });
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
      if (e.code === 'KeyR') send({ kind: 'rotate' });
      if (e.code === 'Delete' || e.code === 'Backspace') send({ kind: 'store' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [decor.active]);

  const outside = !session.inside;
  if (!decor.active) {
    return (
      <button class="btn primary decor-start pop-in" title="Taste G" onClick={() => send({ kind: 'start' })}>
        {outside ? '🌷 Garten gestalten' : '🛋️ Einrichten'}
        <span class="hud-tool-key">G</span>
      </button>
    );
  }

  const slots = session.data?.inventory.slots ?? [];
  const items = [...new Set(slots.filter((s) => s && ((FURNITURE_BY_ITEM[s.itemId] && fitsHere(session, s.itemId)) || (!outside && SURFACE_BY_ID[s.itemId]))).map((s) => s!.itemId))];
  const holding = decor.holding ? itemDef(decor.holding)?.name : null;

  return (
    <>
      <div class="card decor-panel pop-in">
        <div class="decor-title">Aus der Tasche</div>
        {items.length === 0 ? (
          <p class="soft small-text">
            {outside ? 'Keine Gartensachen in der Tasche. Im Katalog (zu Hause) oder an der Werkbank gibt\'s Zäune, Wege & mehr!' : 'Keine Möbel in der Tasche. Im Katalog (Pult links oben) gibt\'s mehr!'}
          </p>
        ) : (
          <div class="decor-grid">
            {items.map((id) => (
              <button
                key={id}
                class={`book-cell ${decor.holding === id ? 'selected' : ''}`}
                title={itemDef(id)?.name}
                onClick={() => {
                  if (SURFACE_BY_ID[id]) {
                    if (applySurface(session, id)) showToast(`${itemDef(id)?.name} angebracht! ✨`);
                  } else send({ kind: 'take', itemId: id });
                }}
              >
                <img src={itemIconUrl(id)} alt="" draggable={false} />
              </button>
            ))}
          </div>
        )}
      </div>
      <div class="decor-bar pop-in">
        <span class="decor-hint">
          {holding
            ? `${holding}: Klicken zum Abstellen${decor.valid ? '' : ' (hier passt es nicht)'}`
            : outside
              ? 'Klick auf Gartensachen zum Verschieben – laufen geht mit WASD.'
              : 'Klick auf ein Möbel zum Verschieben – oder nimm etwas aus der Tasche.'}
        </span>
        <button class="btn small" disabled={!decor.holding} onClick={() => send({ kind: 'rotate' })}>
          ↻ Drehen (R)
        </button>
        <button class="btn small" disabled={!decor.holding} onClick={() => send({ kind: 'store' })}>
          🎒 In die Tasche
        </button>
        <button class="btn primary small" onClick={() => send({ kind: 'stop' })}>
          ✓ Fertig (G)
        </button>
      </div>
    </>
  );
}
