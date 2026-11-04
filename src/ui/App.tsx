/**
 * Wurzel der Oberfläche: entscheidet, welcher Bildschirm/welches Fenster
 * gerade sichtbar ist, und verbindet sich mit dem Event-Bus der Sitzung.
 */
import { useEffect } from 'preact/hooks';
import { DEFAULT_LINA } from '../core/appearance';
import type { Session } from '../game/session';
import { CharacterEditor } from './CharacterEditor';
import { DialogBox } from './DialogBox';
import { Hud } from './Hud';
import { Menu } from './Menu';
import { TitleScreen } from './TitleScreen';
import { InventoryPanel } from './InventoryPanel';
import { MailPanel } from './MailPanel';
import { CollectionBook } from './CollectionBook';
import { CatalogPanel } from './CatalogPanel';
import { BankPanel } from './BankPanel';
import { CraftPanel } from './CraftPanel';
import { type ConfirmRequest, showToast, ui, useUI } from './store';

export function App({ session }: { session: Session }) {
  const state = useUI();

  useEffect(() => {
    const onReady = () => {
      if (ui.state.screen === 'loading') ui.set({ screen: session.playing ? 'playing' : 'title' });
    };
    const offs = [
      session.bus.on('world:ready', onReady),
      session.bus.on('dialog:open', (dialog) => ui.set({ dialog })),
      session.bus.on('toast', (t) => showToast(t.text, t.icon)),
      session.bus.on('ui:open', (panel) => ui.set({ panel })),
    ];
    if (session.worldReady) onReady();
    return () => offs.forEach((off) => off());
  }, [session]);

  // Esc öffnet das Menü
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = ui.state;
      const free = s.screen === 'playing' && !s.menuOpen && !s.dialog && !s.confirm && !s.panel;
      const typing = document.activeElement instanceof HTMLInputElement;
      if (e.code === 'Escape' && free && session.decorActive) session.bus.emit('decor:command', { kind: 'stop' });
      else if (e.code === 'Escape' && free) ui.set({ menuOpen: true });
      if ((e.code === 'KeyI' || e.code === 'Tab') && free && !typing) {
        e.preventDefault();
        ui.set({ panel: { kind: 'inventory' } });
      }
      if (e.code === 'KeyB' && free && !typing) ui.set({ panel: { kind: 'book' } });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const closeDialog = () => {
    const d = ui.state.dialog;
    ui.set({ dialog: null });
    d?.onClose?.();
    session.bus.emit('dialog:closed', undefined);
  };

  const chooseInDialog = (index: number) => {
    const choice = ui.state.dialog?.choices?.[index];
    ui.set({ dialog: null });
    choice?.onSelect();
  };

  return (
    <>
      {state.screen === 'loading' && <Loading />}
      {state.screen === 'title' && <TitleScreen session={session} />}
      {state.screen === 'editor' && (
        <CharacterEditor
          mode={state.editorMode}
          initial={state.editorMode === 'edit' && session.data ? session.data.player.appearance : DEFAULT_LINA}
          initialVillage={state.editorMode === 'edit' ? session.data?.villageName : undefined}
          season={session.season}
          onCancel={() => ui.set({ screen: state.editorMode === 'edit' ? 'playing' : session.playing ? 'playing' : 'title' })}
          onDone={(appearance, village) => {
            if (state.editorMode === 'new') session.startNewGame(appearance, village);
            else session.setAppearance(appearance);
            ui.set({ screen: 'playing' });
          }}
        />
      )}
      {state.screen === 'playing' && <Hud session={session} />}
      {state.menuOpen && <Menu session={session} />}
      {state.panel?.kind === 'mail' && <MailPanel session={session} />}
      {state.panel?.kind === 'book' && <CollectionBook session={session} />}
      {state.panel?.kind === 'catalog' && <CatalogPanel session={session} />}
      {state.panel?.kind === 'bank' && <BankPanel session={session} panel={state.panel} />}
      {state.panel?.kind === 'werkbank' && <CraftPanel session={session} />}
      {state.panel && !['mail', 'book', 'catalog', 'bank', 'werkbank'].includes(state.panel.kind) && <InventoryPanel session={session} panel={state.panel} />}
      {state.dialog && <DialogBox dialog={state.dialog} onClose={closeDialog} onChoose={chooseInDialog} />}
      {state.confirm && <Confirm request={state.confirm} />}
      {state.toast && <Toast key={state.toast.id} text={state.toast.text} icon={state.toast.icon} />}
    </>
  );
}

function Loading() {
  return (
    <div class="loading-layer">
      <div class="loading-dots">
        <span />
        <span />
        <span />
      </div>
      <p>Das Dorf wird gemalt …</p>
    </div>
  );
}

function Confirm({ request }: { request: ConfirmRequest }) {
  const close = () => ui.set({ confirm: null });
  return (
    <div class="modal-layer top">
      <div class="card confirm pop-in" role="alertdialog">
        <h2 class="card-title">{request.title}</h2>
        <p>{request.message}</p>
        <div class="card-actions">
          <button class="btn ghost" onClick={close}>
            {request.cancelLabel ?? 'Lieber nicht'}
          </button>
          <button
            class={`btn ${request.danger ? 'danger-fill' : 'primary'}`}
            onClick={() => {
              close();
              request.onConfirm();
            }}
          >
            {request.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ text, icon }: { text: string; icon?: string }) {
  useEffect(() => {
    const id = window.setTimeout(() => ui.set({ toast: null }), 2600);
    return () => window.clearTimeout(id);
  }, [text]);
  return (
    <div class="toast pop-in">
      {icon && <img class="toast-icon" src={icon} alt="" />}
      {text}
    </div>
  );
}
