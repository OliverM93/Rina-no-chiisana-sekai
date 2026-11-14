/**
 * Linas Notizbuch (Taste N): Was steht gerade an? Notizen in der Stimme der Bewohner,
 * ohne Häkchen und ohne Prozente (Audit 3, M1). Zwei weitere Reiter: Freundschaften (Herzen und
 * Entdecktes) und das Album der Momente.
 */
import { useEffect, useState } from 'preact/hooks';
import { albumEntries } from '../game/album';
import { friendPages } from '../game/friends';
import { notebook } from '../game/notebook';
import type { Session } from '../game/session';
import { ui, useSessionVersion } from './store';

type Tab = 'anstehend' | 'freunde' | 'album';

const TABS: ReadonlyArray<{ id: Tab; label: string }> = [
  { id: 'anstehend', label: 'Anstehendes' },
  { id: 'freunde', label: 'Freundschaften' },
  { id: 'album', label: 'Album' },
];

function Hearts({ on, max }: { on: number; max: number }) {
  return (
    <span class="nb-hearts" aria-label={`${on} von ${max} Herzen`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} class={i < on ? 'nb-heart on' : 'nb-heart'}>
          ♥
        </span>
      ))}
    </span>
  );
}

function Friends({ session }: { session: Session }) {
  const pages = friendPages(session);
  if (pages.length === 0) return <p class="soft center">Noch ist niemand eingezogen, den du hier eintragen könntest. 🌸</p>;
  return (
    <>
      <p class="soft nb-intro">Plaudern, Geschenke und gemeinsame Zeit lassen die Herzen wachsen. Was du über jemanden herausfindest, steht hier.</p>
      {pages.map((f) => (
        <section key={f.id} class="nb-friend">
          <h3 class="nb-head">
            {f.name} <Hearts on={f.hearts} max={f.maxHearts} />
          </h3>
          {f.hearts < f.maxHearts && (
            <div class="nb-fill" aria-hidden="true">
              <div style={{ width: `${Math.round(f.fill * 100)}%` }} />
            </div>
          )}
          {f.loves.length > 0 && <p class="nb-note">💖 Liebt: {f.loves.join(', ')}</p>}
          {f.likes.length > 0 && <p class="nb-note">🙂 Mag: {f.likes.join(', ')}</p>}
          {f.dislikes.length > 0 && <p class="nb-note">😬 Eher nicht: {f.dislikes.join(', ')}</p>}
          {f.loves.length + f.likes.length + f.dislikes.length === 0 && <p class="nb-note soft">Was {f.name} gefällt, findest du beim Schenken heraus.</p>}
          {f.next && <p class="nb-note soft">💌 {f.next}</p>}
        </section>
      ))}
    </>
  );
}

function Album({ session }: { session: Session }) {
  const entries = albumEntries(session);
  if (entries.length === 0) return <p class="soft center">Das Album ist noch leer. Es füllt sich ganz von allein. 🌸</p>;
  let last = '';
  return (
    <>
      {entries.map((e) => {
        const head = e.when !== last;
        last = e.when;
        return (
          <div key={e.id} class="nb-moment">
            {head && <h3 class="nb-head">{e.when}</h3>}
            <p class="nb-note">{e.text}</p>
          </div>
        );
      })}
    </>
  );
}

export function NotebookPanel({ session }: { session: Session }) {
  useSessionVersion(session);
  const [tab, setTab] = useState<Tab>('anstehend');
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
        <div class="nb-tabs" role="tablist">
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} class={tab === t.id ? 'nb-tab on' : 'nb-tab'} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'freunde' && <Friends session={session} />}
        {tab === 'album' && <Album session={session} />}
        {tab === 'anstehend' && nothing && <p class="soft center">Gerade steht nichts an. Einfach den Tag genießen. 🌸</p>}
        {tab === 'anstehend' && nb.story.length > 0 && (
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
        {tab === 'anstehend' && (nb.wishes.length > 0 || nb.untold.length > 0) && (
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
        {tab === 'anstehend' && nb.home.length > 0 && (
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
