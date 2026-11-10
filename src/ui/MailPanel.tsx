/**
 * Briefkasten: Briefe lesen und Geschenke herausnehmen.
 */
import { useEffect, useRef, useState } from 'preact/hooks';
import { isOpen } from '../core/mail';
import { itemCountLabel } from '../data/items';
import { markLetterRead, takeLetterGift } from '../game/gameplay';
import type { Session } from '../game/session';
import { itemIconUrl } from '../gfx/items';
import { enterForPrimary } from './navigation';
import { showToast, ui, useSessionVersion } from './store';

function formatDay(day: string): string {
  const [y, m, d] = day.split('-');
  return d && m && y ? `${Number(d)}.${Number(m)}.${y}` : '';
}

export function MailPanel({ session }: { session: Session }) {
  useSessionVersion(session);
  const letters = session.data?.mail.letters ?? [];
  const [openId, setOpenId] = useState<string | null>(() => letters.find((l) => isOpen(l))?.id ?? letters[0]?.id ?? null);
  const letter = letters.find((l) => l.id === openId) ?? null;
  const close = () => ui.set({ panel: null });

  useEffect(() => {
    if (letter && !letter.read) markLetterRead(session, letter.id);
  }, [letter, session]);

  const enter = useRef<() => void>(() => undefined);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') close();
      // Enter (ohne fokussierten Knopf) = Geschenk aus dem offenen Brief einstecken
      else if (enterForPrimary(e)) enter.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const take = () => {
    if (!letter) return;
    if (!takeLetterGift(session, letter.id)) showToast('Deine Tasche ist voll! 🎒');
  };
  enter.current = () => {
    if (letter?.gift && !letter.giftTaken) take();
  };

  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card mail pop-in">
        <h2 class="card-title">Briefkasten ✉️</h2>
        <div class="mail-body">
          <ul class="letter-list">
            {letters.map((l) => (
              <li key={l.id}>
                <button class={`letter-item ${l.id === openId ? 'active' : ''}`} onClick={() => setOpenId(l.id)} onFocus={() => setOpenId(l.id)}>
                  {isOpen(l) && <span class="dot" aria-label="neu" />}
                  <span class="letter-subject">{l.subject}</span>
                  <span class="letter-from">
                    {l.from} · {formatDay(l.day)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {letter && (
            <article class="letter-paper" key={letter.id}>
              <h3>{letter.subject}</h3>
              <p class="letter-text">{letter.body}</p>
              {letter.gift && (
                <div class="letter-gift">
                  <img src={itemIconUrl(letter.gift.itemId)} alt="" />
                  <span>{itemCountLabel(letter.gift.itemId, letter.gift.count)}</span>
                  {letter.giftTaken ? (
                    <span class="soft">eingesteckt ✓</span>
                  ) : (
                    <button class="btn small primary" onClick={take}>
                      Einstecken
                    </button>
                  )}
                </div>
              )}
            </article>
          )}
        </div>
        <div class="card-actions">
          <button class="btn primary" onClick={close}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
