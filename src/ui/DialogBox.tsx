/**
 * Dialogfenster mit Schreibmaschinen-Effekt, optional mit Herzen (Freundschaft)
 * und einer Auswahl am Ende (z. B. Plaudern / Etwas schenken / Tschüss).
 *
 * Weiter mit Klick/Tippen, Leertaste, Enter oder E. Auswahl mit Pfeiltasten/WS.
 */
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { MAX_HEARTS } from '../core/friendship';
import { ACTION_KEYS } from '../game/input';
import type { DialogRequest } from '../game/session';

const CHARS_PER_SECOND = 55;

interface Props {
  dialog: DialogRequest;
  onClose: () => void;
  onChoose: (index: number) => void;
}

export function DialogBox({ dialog, onClose, onChoose }: Props) {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(0);
  const [selected, setSelected] = useState(0);
  const line = dialog.lines[index] ?? '';
  const chars = [...line];
  const done = shown >= chars.length;
  const last = index + 1 >= dialog.lines.length;
  const choices = dialog.choices ?? [];
  const showChoices = done && last && choices.length > 0;

  const state = useRef({ done, showChoices, selected });
  state.current = { done, showChoices, selected };

  useEffect(() => {
    setIndex(0);
    setShown(0);
    setSelected(0);
  }, [dialog]);

  useEffect(() => {
    if (done) return;
    const id = window.setInterval(() => setShown((s) => s + 1), 1000 / CHARS_PER_SECOND);
    return () => window.clearInterval(id);
  }, [index, done, dialog]);

  const advance = useCallback(() => {
    if (!state.current.done) {
      setShown(Number.MAX_SAFE_INTEGER);
      return;
    }
    if (state.current.showChoices) return; // hier muss gewählt werden
    if (index + 1 < dialog.lines.length) {
      setIndex(index + 1);
      setShown(0);
    } else {
      onClose();
    }
  }, [index, dialog, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const { showChoices: sc, selected: sel } = state.current;
      if (sc) {
        if (e.code === 'ArrowUp' || e.code === 'KeyW') {
          e.preventDefault();
          setSelected((s) => (s + choices.length - 1) % choices.length);
        } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
          e.preventDefault();
          setSelected((s) => (s + 1) % choices.length);
        } else if (ACTION_KEYS.includes(e.code) && !e.repeat) {
          e.preventDefault();
          onChoose(sel);
        } else if (e.code === 'Escape') {
          e.preventDefault();
          onChoose(choices.length - 1);
        }
        return;
      }
      if (ACTION_KEYS.includes(e.code) || e.code === 'Escape') {
        e.preventDefault();
        if (e.repeat) return;
        advance();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance, choices.length, onChoose]);

  return (
    <div class="dialog-layer" onPointerUp={advance}>
      {showChoices && (
        <div class="dialog-choices pop-in" onPointerUp={(e) => e.stopPropagation()}>
          {choices.map((c, i) => (
            <button
              key={c.label}
              class={`choice ${i === selected ? 'selected' : ''}`}
              onPointerEnter={() => setSelected(i)}
              onClick={() => onChoose(i)}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
      <div class="dialog-box pop-in" role="dialog" aria-live="polite">
        {dialog.title && (
          <div class="dialog-title">
            {dialog.title}
            {dialog.hearts !== undefined && <Hearts value={dialog.hearts} />}
          </div>
        )}
        <p class="dialog-text">{chars.slice(0, shown).join('')}</p>
        <div class={`dialog-next ${done && !showChoices ? 'visible' : ''}`}>{last ? '✓' : '▼'}</div>
      </div>
    </div>
  );
}

export function Hearts({ value }: { value: number }) {
  return (
    <span class="hearts" aria-label={`${value} von ${MAX_HEARTS} Herzen`}>
      {Array.from({ length: MAX_HEARTS }, (_, i) => (
        <span key={i} class={i < value ? 'heart on' : 'heart'}>
          ♥
        </span>
      ))}
    </span>
  );
}
