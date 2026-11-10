/**
 * Linas Notizbuch (Taste N): Was steht gerade an? Notizen in der Stimme der Bewohner,
 * ohne Häkchen und ohne Prozente (Audit 3, M1).
 */
import { useEffect } from 'preact/hooks';
import { notebook } from '../game/notebook';
import type { Session } from '../game/session';
import { ui, useSessionVersion } from './store';

export function NotebookPanel({ session }: { session: Session }) {
  useSessionVersion(session);
  const close = () => ui.set({ panel: null });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'KeyN') {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const nb = notebook(session);
  const nothing = nb.story.length === 0 && nb.wishes.length === 0 && nb.untold.length === 0 && nb.home.length === 0;

  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card notebook pop-in">
        <h2 class="card-title">📓 Linas Notizbuch</h2>
        {nothing && <p class="soft center">Gerade steht nichts an. Einfach den Tag genießen. 🌸</p>}
        {nb.story.length > 0 && (
          <section>
            <h3 class="nb-head">Als Nächstes</h3>
            {nb.story.map((n, i) => (
              <p key={i} class="nb-note">
                {n.by ? (
                  <>
                    „{n.text}“ <span class="soft">– {n.by}</span>
                  </>
                ) : (
                  n.text
                )}
              </p>
            ))}
          </section>
        )}
        {(nb.wishes.length > 0 || nb.untold.length > 0) && (
          <section>
            <h3 class="nb-head">Herzenswünsche</h3>
            {nb.wishes.map((w) => (
              <div key={w.title} class="nb-note">
                <b>{w.npc}:</b> {w.title}
                <ul class="nb-list">
                  {w.needs.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            ))}
            {nb.untold.length > 0 && <p class="nb-note soft">💭 {nb.untold.join(', ')} {nb.untold.length === 1 ? 'hat' : 'haben'} noch etwas auf dem Herzen – frag doch mal nach.</p>}
          </section>
        )}
        {nb.home.length > 0 && (
          <section>
            <h3 class="nb-head">Zuhause</h3>
            {nb.home.map((t) => (
              <p key={t} class="nb-note">
                {t}
              </p>
            ))}
          </section>
        )}
        <div class="card-actions">
          <button class="btn primary" onClick={close}>
            Zuklappen
          </button>
        </div>
      </div>
    </div>
  );
}
