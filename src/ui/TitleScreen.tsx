/**
 * Titelbildschirm über der schwebenden Dorfansicht.
 */
import type { Session } from '../game/session';
import { pickTextFile } from './files';
import { showToast, ui } from './store';

export function TitleScreen({ session }: { session: Session }) {
  const hasSave = session.hasSave();

  const continueGame = () => {
    if (session.continueGame()) ui.set({ screen: 'playing' });
    else showToast('Der Spielstand konnte leider nicht geladen werden.');
  };

  const newGame = () => {
    if (!hasSave) {
      ui.set({ screen: 'editor', editorMode: 'new' });
      return;
    }
    ui.set({
      confirm: {
        title: 'Ganz neu anfangen?',
        message: 'Es gibt schon ein Dorf. Ein neues Spiel überschreibt es (am besten vorher im Menü exportieren).',
        confirmLabel: 'Neu anfangen',
        danger: true,
        onConfirm: () => ui.set({ screen: 'editor', editorMode: 'new' }),
      },
    });
  };

  const load = async () => {
    const text = await pickTextFile();
    if (text === null) return;
    const result = session.checkImport(text);
    if (!result.ok) {
      showToast(result.error);
      return;
    }
    session.importSave(result.data);
    ui.set({ screen: 'playing' });
    showToast(`Willkommen zurück in ${result.data.villageName}! 💕`);
  };

  return (
    <div class="title-layer">
      <div class="title-logo pop-in">
        <div class="title-kana">りなの ちいさな せかい</div>
        <h1>
          Rina no
          <br />
          Chiisana Sekai
        </h1>
        <div class="title-sub">Linas kleine Welt</div>
      </div>
      <div class="title-buttons pop-in delay">
        {hasSave && (
          <button class="btn primary big" onClick={continueGame}>
            Weiterspielen
          </button>
        )}
        <button class={`btn big ${hasSave ? '' : 'primary'}`} onClick={newGame}>
          {hasSave ? 'Neues Spiel' : 'Los geht’s! 🌸'}
        </button>
        <button class="btn ghost" onClick={load}>
          Spielstand aus Datei laden
        </button>
      </div>
      <div class="title-footer">Mit Liebe gemacht für Lina 💕</div>
    </div>
  );
}
