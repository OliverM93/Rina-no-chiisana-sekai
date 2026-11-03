/**
 * Einstiegspunkt: Schrift laden, Sitzung anlegen, Oberfläche & Spielwelt starten.
 */
import '@fontsource-variable/nunito';
import './ui/ui.css';
import { h, render } from 'preact';
import { createClock, parseTimeOverride } from './core/time';
import { World3D } from './world3d/World3D';
import { browserStorage, Session } from './game/session';
import { palette } from './style/palette';
import { App } from './ui/App';
import { FURNITURE_ITEMS } from './data/furniture';
import { setIconImage } from './gfx/items';
import { renderFurnitureThumbnails } from './world3d/models/furniture';
import { connectBlocking, showToast, ui } from './ui/store';

// Palette als CSS-Variablen bereitstellen (eine Quelle für alle Farben)
const root = document.documentElement;
const cssVars: Record<string, string> = {
  '--ui-bg': palette.ui.bg,
  '--ui-panel': palette.ui.panel,
  '--ui-border': palette.ui.border,
  '--ui-text': palette.ui.text,
  '--ui-text-soft': palette.ui.textSoft,
  '--ui-accent': palette.ui.accent,
  '--ui-accent-dark': palette.ui.accentDark,
  '--ui-mint': palette.ui.mint,
  '--ui-butter': palette.ui.butter,
  '--ui-sky': palette.ui.sky,
  '--rb-red': palette.rainbow.red,
  '--rb-orange': palette.rainbow.orange,
  '--rb-yellow': palette.rainbow.yellow,
  '--rb-green': palette.rainbow.green,
  '--rb-blue': palette.rainbow.blue,
  '--rb-violet': palette.rainbow.violet,
};
for (const [k, v] of Object.entries(cssVars)) root.style.setProperty(k, v);

async function start() {
  // Schrift vor dem Zeichnen der Texturen laden (z. B. für Schilder)
  try {
    await Promise.race([document.fonts.load('700 16px "Nunito Variable"'), new Promise((r) => setTimeout(r, 1500))]);
  } catch {
    /* Schrift ist optional */
  }

  const clock = createClock(parseTimeOverride(window.location.search));
  const session = new Session(browserStorage(), clock);
  connectBlocking(session);

  render(h(App, { session }), document.getElementById('ui') as HTMLElement);
  const host = document.getElementById('game') as HTMLElement;
  const canvas = document.createElement('canvas');
  host.appendChild(canvas);
  const game = new World3D(canvas, session);
  // 3D-Vorschaubilder der Möbel für Katalog & Tasche (kurz nach dem Start)
  window.setTimeout(() => {
    const thumbs = renderFurnitureThumbnails(FURNITURE_ITEMS.map((f) => f.itemId));
    for (const [id, url] of Object.entries(thumbs)) setIconImage(id, url);
    session.changed();
  }, 300);
  // Für Tests & Fehlersuche im Entwicklungsmodus
  if (import.meta.env.DEV) Object.assign(window, { __rina: { session, game, ui } });

  // Automatisch speichern
  let warned = false;
  const autosave = () => {
    if (!session.playing || ui.state.screen !== 'playing') return;
    if (!session.save() && !warned) {
      warned = true;
      showToast('Hinweis: Dieser Browser erlaubt kein Speichern. Bitte exportiere deinen Spielstand im Menü.');
    }
  };
  window.setInterval(autosave, 20_000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') autosave();
  });
  window.addEventListener('pagehide', autosave);
}

void start();
