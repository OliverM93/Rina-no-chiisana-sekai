/**
 * Tastatur-Eingabe für die Spielwelt.
 *
 * Bewusst eigene Implementierung statt Phaser-Keyboard: So blockieren wir
 * keine Tasten in Textfeldern (z. B. beim Eingeben des Dorfnamens) und
 * behalten volle Kontrolle darüber, wann die Welt reagieren darf.
 */

const MOVE = {
  up: ['ArrowUp', 'KeyW'],
  down: ['ArrowDown', 'KeyS'],
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
};
const RUN = ['ShiftLeft', 'ShiftRight'];
export const ACTION_KEYS = ['Space', 'KeyE', 'Enter', 'NumpadEnter'];

function isTyping(): boolean {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

export class KeyboardInput {
  private down = new Set<string>();
  private actionListeners = new Set<() => void>();
  private keyListeners = new Set<(code: string) => void>();

  constructor() {
    window.addEventListener('keydown', this.onDown);
    window.addEventListener('keyup', this.onUp);
    window.addEventListener('blur', this.reset);
  }

  destroy() {
    window.removeEventListener('keydown', this.onDown);
    window.removeEventListener('keyup', this.onUp);
    window.removeEventListener('blur', this.reset);
  }

  onAction(fn: () => void): () => void {
    this.actionListeners.add(fn);
    return () => this.actionListeners.delete(fn);
  }

  /** Jede neu gedrückte Taste (z. B. 1–3 für Werkzeuge) */
  onKey(fn: (code: string) => void): () => void {
    this.keyListeners.add(fn);
    return () => this.keyListeners.delete(fn);
  }

  /** Bewegungsrichtung aus gedrückten Tasten (nicht normalisiert). */
  direction(): { dx: number; dy: number; run: boolean } {
    const any = (codes: string[]) => codes.some((c) => this.down.has(c));
    const dx = (any(MOVE.right) ? 1 : 0) - (any(MOVE.left) ? 1 : 0);
    const dy = (any(MOVE.down) ? 1 : 0) - (any(MOVE.up) ? 1 : 0);
    return { dx, dy, run: any(RUN) };
  }

  reset = () => {
    this.down.clear();
  };

  private onDown = (e: KeyboardEvent) => {
    if (isTyping()) return;
    // Seite soll beim Spielen nicht scrollen
    if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault();
    const fresh = !this.down.has(e.code);
    this.down.add(e.code);
    if (fresh && !e.repeat && ACTION_KEYS.includes(e.code)) {
      for (const fn of this.actionListeners) fn();
    }
    if (fresh && !e.repeat) for (const fn of this.keyListeners) fn(e.code);
  };

  private onUp = (e: KeyboardEvent) => {
    this.down.delete(e.code);
  };
}
