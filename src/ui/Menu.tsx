/**
 * Spielmenü: Aussehen, Speichern, Export/Import, Vollbild, Hilfe, Neues Spiel.
 */
import { useEffect, useState } from 'preact/hooks';
import type { Session } from '../game/session';
import { downloadText, pickTextFile } from './files';
import { showToast, ui } from './store';

function formatPlayTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h} Std. ${m} Min.`;
  return `${Math.max(1, m)} Min.`;
}

export function Menu({ session }: { session: Session }) {
  const [help, setHelp] = useState(false);
  const close = () => ui.set({ menuOpen: false });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const saveNow = () => {
    showToast(session.save() ? 'Gespeichert! 💾' : 'Speichern im Browser nicht möglich – bitte exportieren.');
  };

  const exportSave = () => {
    const file = session.exportSave();
    if (!file) return;
    downloadText(file.fileName, file.json);
    showToast('Spielstand exportiert 📤');
  };

  const importSave = async () => {
    const text = await pickTextFile();
    if (text === null) return;
    const result = session.checkImport(text);
    if (!result.ok) {
      showToast(result.error);
      return;
    }
    ui.set({
      confirm: {
        title: 'Spielstand laden?',
        message: `Der Spielstand aus „${result.data.villageName}“ ersetzt dein aktuelles Spiel.`,
        confirmLabel: 'Laden',
        onConfirm: () => {
          session.importSave(result.data);
          ui.set({ menuOpen: false });
          showToast('Spielstand geladen 📥');
        },
      },
    });
  };

  const newGame = () => {
    ui.set({
      confirm: {
        title: 'Ganz neu anfangen?',
        message: 'Dein jetziges Dorf wird dabei überschrieben. Tipp: Exportiere vorher deinen Spielstand, dann kannst du ihn jederzeit zurückholen.',
        confirmLabel: 'Neu anfangen',
        danger: true,
        onConfirm: () => ui.set({ menuOpen: false, screen: 'editor', editorMode: 'new' }),
      },
    });
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.().catch(() => showToast('Vollbild wird hier nicht unterstützt.'));
  };

  const data = session.data;
  const [music, setMusic] = useState(data?.settings.musicVolume ?? 0.6);
  const [sfx, setSfx] = useState(data?.settings.sfxVolume ?? 0.8);
  const setVol = (k: 'musicVolume' | 'sfxVolume', v: number) => {
    if (!session.data) return;
    session.data.settings[k] = v;
    if (k === 'musicVolume') setMusic(v);
    else setSfx(v);
    session.bus.emit('settings:changed', { ...session.data.settings });
    session.save();
  };
  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card menu pop-in">
        <h2 class="card-title">Menü</h2>
        {data && (
          <p class="menu-meta">
            🏡 {data.villageName} · ⏳ {formatPlayTime(data.playTimeSec)} gespielt
          </p>
        )}
        {data && (
          <div class="menu-volume">
            <label>
              🎵 Musik
              <input type="range" min="0" max="1" step="0.05" value={music} onInput={(e) => setVol('musicVolume', Number((e.target as HTMLInputElement).value))} />
            </label>
            <label>
              🔔 Geräusche
              <input type="range" min="0" max="1" step="0.05" value={sfx} onInput={(e) => setVol('sfxVolume', Number((e.target as HTMLInputElement).value))} />
            </label>
          </div>
        )}
        <div class="menu-grid">
          <button class="btn" onClick={() => ui.set({ menuOpen: false, panel: { kind: 'notizbuch' } })}>
            📓 Notizbuch (N)
          </button>
          <button class="btn" onClick={() => ui.set({ menuOpen: false, screen: 'editor', editorMode: 'edit' })}>
            🎨 Aussehen ändern
          </button>
          <button class="btn" onClick={saveNow}>
            💾 Speichern
          </button>
          <button class="btn" onClick={exportSave}>
            📤 Spielstand exportieren
          </button>
          <button class="btn" onClick={importSave}>
            📥 Spielstand laden
          </button>
          <button class="btn" onClick={toggleFullscreen}>
            ⛶ Vollbild
          </button>
          <button class="btn" onClick={() => setHelp(!help)} aria-expanded={help}>
            ❓ Steuerung
          </button>
        </div>
        {help && (
          <div class="help">
            <p>
              <b>Laufen:</b> WASD oder Pfeiltasten · <b>Rennen:</b> Umschalttaste gedrückt halten
            </p>
            <p>
              <b>Maus &amp; Touch:</b> Irgendwohin tippen, um dorthin zu laufen. Auf Dinge tippen, um sie anzusehen.
            </p>
            <p>
              <b>Anschauen/Reden/Aufheben:</b> Leertaste, E oder Enter · <b>Tasche:</b> I oder Tab · <b>Notizbuch:</b> N · <b>Menü:</b> Esc
            </p>
            <p>
              <b>In Fenstern &amp; Menüs:</b> Pfeiltasten springen von Knopf zu Knopf, Enter oder Leertaste drückt, Esc schließt.
            </p>
            <p>
              <b>Sammeln:</b> Bäume schütteln, Muscheln am Strand, Blumen pflücken, an Felsen klopfen. Was du nicht
              brauchst, kommt in die Verkaufskiste vor deinem Haus. ⭐
            </p>
            <p class="soft">Das Spiel speichert automatisch. Die Uhrzeit im Dorf ist die echte Uhrzeit.</p>
          </div>
        )}
        <div class="card-actions spread">
          <button class="btn ghost danger" onClick={newGame}>
            🌱 Neues Spiel
          </button>
          <button class="btn primary" onClick={close}>
            Weiterspielen
          </button>
        </div>
      </div>
    </div>
  );
}
