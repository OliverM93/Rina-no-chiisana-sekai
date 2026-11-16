/**
 * Ukulele (Strand-Jam): vier Akkorde zum Anklicken oder mit den Tasten A S D F (auch 1–4). Es gibt keine Punkte und
 * keine falschen Töne – es klingt immer nach Strand. Die Akkorde (C, Am, F, G) passen zusammen, egal in welcher Reihenfolge.
 */
import { useEffect, useRef, useState } from 'preact/hooks';
import type { Sfx } from '../audio/Audio';
import type { Session } from '../game/session';
import { ui } from './store';

interface Chord {
  sfx: Extract<Sfx, 'uke-c' | 'uke-am' | 'uke-f' | 'uke-g'>;
  name: string;
  keys: readonly string[];
  label: string;
}

export const CHORDS: readonly Chord[] = [
  { sfx: 'uke-c', name: 'C', keys: ['KeyA', 'Digit1'], label: 'A' },
  { sfx: 'uke-am', name: 'Am', keys: ['KeyS', 'Digit2'], label: 'S' },
  { sfx: 'uke-f', name: 'F', keys: ['KeyD', 'Digit3'], label: 'D' },
  { sfx: 'uke-g', name: 'G', keys: ['KeyF', 'Digit4'], label: 'F' },
];

/** So oft angeschlagen, dann gibt es einen kleinen Gruß (einmal je Besuch) */
export const JAM_AT = 16;
export const JAM_LINE = 'Das klingt nach Sonnenuntergang am Strand. 🌺';

export function UkulelePanel({ session }: { session: Session }) {
  const [active, setActive] = useState('');
  const count = useRef(0);
  const timer = useRef(0);
  const told = useRef(false);
  const close = () => ui.set({ panel: null });

  const play = (c: Chord) => {
    session.bus.emit('sfx', c.sfx);
    setActive(c.sfx);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setActive(''), 180);
    count.current += 1;
    if (count.current === JAM_AT && !told.current) {
      told.current = true;
      session.bus.emit('toast', { text: JAM_LINE });
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      const c = CHORDS.find((x) => x.keys.includes(e.code));
      if (c && !e.repeat) {
        e.preventDefault();
        play(c);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card ukulele pop-in">
        <h2 class="card-title">🎶 Ukulele</h2>
        <p class="soft center">Vier Akkorde, keine falschen Töne. Klick sie an oder nimm die Tasten A S D F.</p>
        <div class="uke-neck" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} class={active ? 'uke-string buzz' : 'uke-string'} style={{ animationDelay: `${i * 20}ms` }} />
          ))}
        </div>
        <div class="uke-chords">
          {CHORDS.map((c) => (
            <button key={c.sfx} class={active === c.sfx ? 'uke-chord on' : 'uke-chord'} onPointerDown={() => play(c)}>
              <span class="uke-name">{c.name}</span>
              <span class="uke-key">{c.label}</span>
            </button>
          ))}
        </div>
        <div class="card-actions">
          <button class="btn primary" onClick={close}>
            Weglegen
          </button>
        </div>
      </div>
    </div>
  );
}
