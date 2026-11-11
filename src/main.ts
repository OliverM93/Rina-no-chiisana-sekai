/**
 * Einstiegspunkt: Schrift laden, Sitzung anlegen, Oberfläche & Spielwelt starten.
 */
import { VOICES } from './data/voices';
import { GameAudio } from './audio/Audio';
import { moodFor, MOODS, placeMood, type Mood } from './core/music';
import { homeMood, MUSIC_PLACES } from './data/music';
import { objectById } from './core/worldmap';
import { isPrecipitation } from './core/weather';
import { getSeason } from './core/time';
import { currentWeather } from './game/nature';
import { isPartyTime } from './game/party';
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
  '--night-sky': palette.night.sky,
  '--night-star': palette.night.star,
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
    // Kunstwerke behalten ihr gemaltes Symbol (Bild im Rahmen)
    const thumbs = renderFurnitureThumbnails(FURNITURE_ITEMS.filter((f) => f.def.style !== 'kunst').map((f) => f.itemId));
    for (const [id, url] of Object.entries(thumbs)) setIconImage(id, url);
    session.changed();
  }, 300);
  // Klang: startet nach der ersten Taste/dem ersten Klick (Browser-Regel)
  const audio = new GameAudio();
  const wake = () => {
    audio.start();
    const s = session.data?.settings;
    if (s) audio.setVolumes(s.musicVolume, s.sfxVolume);
  };
  window.addEventListener('pointerdown', wake);
  window.addEventListener('keydown', wake);
  session.bus.on('sfx', (s) => audio.play(s));
  session.bus.on('dialog:open', (d) => {
    // Bewohner brabbeln selbst – das „Blubb“ nur bei Schildern & Texten ohne Sprecher
    if (!d.title || !VOICES[d.title]) audio.play('dialog');
  });
  session.bus.on('voice', (v) => {
    const voice = VOICES[v.speaker];
    if (voice) audio.babble(voice, v.syl);
  });
  session.bus.on('settings:changed', (s) => audio.setVolumes(s.musicVolume, s.sfxVolume));
  // Stimmung & Umgebung alle 2 Sekunden (echte Zeit); `?musik=bistro` erzwingt ein Thema zum Anhören
  const forcedMood = new URLSearchParams(location.search).get('musik');
  const forced = forcedMood && forcedMood in MOODS ? (forcedMood as Mood) : null;
  window.setInterval(() => {
    const now = session.clock();
    const h = now.getHours();
    const w = currentWeather(session);
    const raining = isPrecipitation(w.kind) && w.kind !== 'schnee';
    const inside = session.inside;
    const title = !session.playing || ui.state.screen !== 'playing';
    const pos = session.data?.player;
    const nearSea = !!pos && pos.y / 64 > 27;
    // Orts-Themen: nahe an einem Haus spielt das Lied seiner Bewohner
    const map = session.map;
    const place =
      pos && !inside
        ? placeMood(pos.x / 64, pos.y / 64, MUSIC_PLACES, (id) => {
            const o = objectById(map, id);
            return o && !map.inactive.has(id) ? { x: o.x + o.w / 2, y: o.y + o.h / 2 } : null;
          })
        : null;
    const home = homeMood(session.data?.flags ?? {});
    const season = getSeason(now);
    audio.setMood(forced ?? (title ? 'morgen' : moodFor(h, { raining, snowing: w.kind === 'schnee', inside, party: isPartyTime(session), place, home })), season);
    audio.setAmbience({
      birds: inside || raining || h < 5 || h >= 20 ? 0 : season === 'winter' ? 0.3 : 1,
      crickets: inside || raining || (h >= 6 && h < 20) || season === 'winter' ? 0 : 1,
      rain: raining ? (inside ? 0.35 : 1) : 0,
      waves: !inside && nearSea ? 1 : 0,
    });
  }, 2000);

  // Für Tests & Fehlersuche im Entwicklungsmodus
  if (import.meta.env.DEV) {
    Object.assign(window, { __rina: { session, game, ui } });
    // `?ausbau=5` in der Adresse: neue Spiele starten mit fertig ausgebautem Haus (nur zum Testen)
    const stage = Number(new URLSearchParams(window.location.search).get('ausbau'));
    if (Number.isFinite(stage) && stage > 0) session.devHouseStage = Math.floor(stage);
  }

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
