/**
 * Pfeiltasten-Navigation für alle Fenster und Menüs: Die Pfeile springen zum nächsten Knopf in dieser Richtung,
 * Enter/Leertaste drücken ihn (das macht der Browser bei fokussierten Knöpfen von selbst).
 */

export type Dir = 'left' | 'right' | 'up' | 'down';

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

const centerOf = (b: Box) => ({ x: b.left + b.width / 2, y: b.top + b.height / 2 });

/**
 * Welches Element liegt von `from` aus in dieser Richtung am nächsten? Geradeaus zählt mehr als schräg.
 * Links/rechts springen am Zeilenende zum vorigen/nächsten Element in Leserichtung weiter; hoch/runter am
 * Rand bleiben stehen (null).
 */
export function pickNext(boxes: readonly Box[], from: number, dir: Dir): number | null {
  const c = centerOf(boxes[from]);
  let best: number | null = null;
  let bestScore = Infinity;
  boxes.forEach((b, i) => {
    if (i === from) return;
    const p = centerOf(b);
    const dx = p.x - c.x;
    const dy = p.y - c.y;
    const along = dir === 'right' ? dx : dir === 'left' ? -dx : dir === 'down' ? dy : -dy;
    const across = dir === 'left' || dir === 'right' ? Math.abs(dy) : Math.abs(dx);
    if (along < 2) return;
    const score = along + 3 * across;
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  });
  if (best !== null || dir === 'up' || dir === 'down') return best;
  // Zeilenende: in Leserichtung weiter
  const order = boxes.map((b, i) => ({ i, y: Math.round(centerOf(b).y / 8), x: b.left })).sort((a, b) => a.y - b.y || a.x - b.x).map((o) => o.i);
  const at = order.indexOf(from);
  const next = order[at + (dir === 'right' ? 1 : -1)];
  return next === undefined ? null : next;
}

const KEY_DIR: Record<string, Dir> = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };

const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function visible(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
}

/**
 * Pfeiltaste in einem Fenster verarbeiten. Gibt true zurück, wenn die Taste verbraucht wurde.
 * Textfelder behalten links/rechts, Schieberegler behalten links/rechts (Wert ändern).
 */
export function handleArrowKey(e: KeyboardEvent, container: HTMLElement): boolean {
  const dir = KEY_DIR[e.code];
  if (!dir || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return false;
  const active = document.activeElement as HTMLElement | null;
  if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement || active instanceof HTMLSelectElement) {
    const horizontal = dir === 'left' || dir === 'right';
    if (horizontal || active instanceof HTMLSelectElement) return false;
  }
  const items = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(visible);
  if (items.length === 0) return false;
  const from = active ? items.indexOf(active) : -1;
  let target: HTMLElement | undefined;
  if (from < 0) target = items[0];
  else {
    const next = pickNext(items.map((el) => el.getBoundingClientRect()), from, dir);
    target = next === null ? undefined : items[next];
  }
  e.preventDefault();
  e.stopPropagation();
  if (target) {
    target.focus();
    target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
  return true;
}

/**
 * Enter als Abkürzung für den Hauptknopf eines Fensters – aber nur, wenn gerade kein Aktionsknopf (`.btn`), Reiter oder
 * Feld den Fokus hat (dann drückt Enter wie gewohnt diesen Knopf). Listeneinträge (Rezept, Brief, Bild) zählen nicht:
 * Sie wählen beim Fokussieren schon aus, Enter löst dann die Hauptaktion dafür aus – wie im Katalog.
 */
export function enterForPrimary(e: KeyboardEvent): boolean {
  if ((e.code !== 'Enter' && e.code !== 'NumpadEnter') || e.repeat) return false;
  const active = document.activeElement;
  if (active instanceof HTMLElement && active.matches('input, select, textarea, .btn, .chip, .swatch')) return false;
  e.preventDefault();
  return true;
}
