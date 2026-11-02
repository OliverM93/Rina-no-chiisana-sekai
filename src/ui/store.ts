/**
 * Kleiner Zustandsspeicher für die Oberfläche (welcher Bildschirm, offene
 * Fenster, Dialog, Hinweise) plus Preact-Hook.
 */
import { useEffect, useState } from 'preact/hooks';
import type { DialogRequest, Session, UiPanel } from '../game/session';

export type Screen = 'loading' | 'title' | 'editor' | 'playing';

export interface ConfirmRequest {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
}

export interface UIState {
  screen: Screen;
  editorMode: 'new' | 'edit';
  menuOpen: boolean;
  dialog: DialogRequest | null;
  confirm: ConfirmRequest | null;
  /** Tasche, Verkaufskiste, Briefkasten, Geschenk-Auswahl */
  panel: UiPanel | null;
  toast: { id: number; text: string; icon?: string } | null;
}

type Listener = (s: UIState) => void;

class UIStore {
  private listeners = new Set<Listener>();
  state: UIState = {
    screen: 'loading',
    editorMode: 'new',
    menuOpen: false,
    dialog: null,
    confirm: null,
    panel: null,
    toast: null,
  };

  set(patch: Partial<UIState>) {
    this.state = { ...this.state, ...patch };
    for (const l of this.listeners) l(this.state);
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}

export const ui = new UIStore();

export function useUI(): UIState {
  const [state, setState] = useState(ui.state);
  useEffect(() => ui.subscribe(setState), []);
  return state;
}

let toastId = 0;
export function showToast(text: string, icon?: string) {
  ui.set({ toast: { id: ++toastId, text, icon } });
}

/** Zählt bei jeder Änderung am Spielzustand hoch – zum Neuzeichnen von Anzeigen. */
export function useSessionVersion(session: Session): number {
  const [v, setV] = useState(0);
  useEffect(() => session.bus.on('state:changed', () => setV((x) => x + 1)), [session]);
  return v;
}

/** Hält `session.uiBlocking` passend zum Oberflächenzustand. */
export function connectBlocking(session: Session) {
  const sync = (s: UIState) => {
    session.uiBlocking = s.screen !== 'playing' || s.menuOpen || s.dialog !== null || s.confirm !== null || s.panel !== null;
  };
  sync(ui.state);
  ui.subscribe(sync);
}
