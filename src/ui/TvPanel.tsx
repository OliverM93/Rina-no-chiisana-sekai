/**
 * Linas Fernseher: Sender wählen, heutige Folge anschauen (Zeile für Zeile).
 */
import { useEffect, useState } from 'preact/hooks';
import { TV_CHANNELS } from '../data/tv';
import type { Session } from '../game/session';
import { episodeToday, type WatchResult, watchTv } from '../game/tv';
import { ui } from './store';

export function TvPanel({ session, withOli }: { session: Session; withOli: boolean }) {
  const [watching, setWatching] = useState<WatchResult | null>(null);
  const [line, setLine] = useState(0);
  const close = () => ui.set({ panel: null });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        close();
      }
      if ((e.code === 'Space' || e.code === 'Enter') && watching) {
        e.preventDefault();
        setLine((l) => Math.min(l + 1, watching.lines.length - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [watching]);

  const tune = (id: string) => {
    setWatching(watchTv(session, id, withOli));
    setLine(0);
  };
  const ch = watching?.channel;

  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card tv pop-in">
        <h2 class="card-title">📺 Fernsehabend{withOli ? ' mit Oli' : ''}</h2>
        <div class="tv-screen" style={ch ? { background: `linear-gradient(135deg, ${ch.colors[0]}, ${ch.colors[1]})` } : undefined}>
          {ch && watching ? (
            <>
              <div class="tv-logo">
                {ch.icon} {ch.show}
              </div>
              <div class="tv-title">Heute: „{watching.episode.title}“</div>
              <div class="tv-line" key={line}>
                {watching.lines[line]}
              </div>
              <div class="tv-progress">
                {line + 1}/{watching.lines.length}
              </div>
            </>
          ) : (
            <div class="tv-off">Such dir einen Sender aus! {withOli ? 'Oli hat schon die Decke geholt. 🛋️' : 'Winston legt sich schon mal aufs Sofa. 🐶'}</div>
          )}
        </div>
        <div class="tv-channels">
          {TV_CHANNELS.map((c) => (
            <button key={c.id} class={`chip ${ch?.id === c.id ? 'active' : ''}`} onClick={() => tune(c.id)} title={`Heute: ${episodeToday(session, c).title}`}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
        <div class="card-actions">
          <button class="btn ghost" onClick={close}>
            Ausschalten
          </button>
          {watching && line < watching.lines.length - 1 && (
            <button class="btn primary" onClick={() => setLine(line + 1)}>
              Weiter ▸
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
