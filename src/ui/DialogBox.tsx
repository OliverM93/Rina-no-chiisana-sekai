/**
 * Dialogfenster mit Schreibmaschinen-Effekt.
 * Weiter mit Klick/Tippen, Leertaste, Enter oder E.
 */
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import type { DialogRequest } from '../game/session';
import { ACTION_KEYS } from '../game/input';

const CHARS_PER_SECOND = 55;

export function DialogBox({ dialog, onClose }: { dialog: DialogRequest; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(0);
  const line = dialog.lines[index] ?? '';
  const chars = [...line];
  const done = shown >= chars.length;
  const doneRef = useRef(done);
  doneRef.current = done;

  useEffect(() => {
    setIndex(0);
    setShown(0);
  }, [dialog]);

  useEffect(() => {
    if (done) return;
    const id = window.setInterval(() => setShown((s) => s + 1), 1000 / CHARS_PER_SECOND);
    return () => window.clearInterval(id);
  }, [index, done, dialog]);

  const advance = useCallback(() => {
    if (!doneRef.current) {
      setShown(Number.MAX_SAFE_INTEGER);
      return;
    }
    if (index + 1 < dialog.lines.length) {
      setIndex(index + 1);
      setShown(0);
    } else {
      onClose();
    }
  }, [index, dialog, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (ACTION_KEYS.includes(e.code) || e.code === 'Escape') {
        e.preventDefault();
        if (e.repeat) return;
        advance();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance]);

  return (
    <div class="dialog-layer" onPointerUp={advance}>
      <div class="dialog-box pop-in" role="dialog" aria-live="polite">
        {dialog.title && <div class="dialog-title">{dialog.title}</div>}
        <p class="dialog-text">{chars.slice(0, shown).join('')}</p>
        <div class={`dialog-next ${done ? 'visible' : ''}`}>{index + 1 < dialog.lines.length ? '▼' : '✓'}</div>
      </div>
    </div>
  );
}
