/**
 * Anzeige oben: Uhrzeit, Datum, Jahreszeit und Menü-Knopf.
 */
import { useEffect, useState } from 'preact/hooks';
import { formatDate, formatTime, getDayPhase, getSeason, SEASON_ICONS, SEASON_LABELS } from '../core/time';
import { WEATHER_ICONS, WEATHER_LABELS } from '../core/weather';
import { isFireworkTime } from '../core/festivals';
import { itemDef } from '../data/items';
import { currentWeather, ownedTools, toggleTool } from '../game/nature';
import { itemIconUrl } from '../gfx/items';
import type { Session } from '../game/session';
import { formatMoney, hasUnreadMail } from '../game/gameplay';
import { ui, useSessionVersion, useUI } from './store';
import { DecorBar, useHomeState } from './DecorBar';

const PHASE_ICON: Record<string, string> = {
  nacht: '🌙',
  morgendaemmerung: '🌅',
  morgen: '🌤️',
  mittag: '☀️',
  nachmittag: '🌤️',
  abend: '🌇',
  abenddaemmerung: '🌆',
};

export function Hud({ session }: { session: Session }) {
  useSessionVersion(session);
  const [now, setNow] = useState(session.clock());
  useEffect(() => {
    const id = window.setInterval(() => setNow(session.clock()), 1000);
    return () => window.clearInterval(id);
  }, [session]);

  const season = getSeason(now);
  const weather = currentWeather(session);
  const tools = ownedTools(session);
  const { inside, inYard, decor } = useHomeState(session);
  // Solange ein Dialog, Fenster oder eine Rückfrage offen ist, sind Menü & Knöpfe gesperrt
  const ustate = useUI();
  const busy = !!(ustate.dialog || ustate.panel || ustate.confirm);
  const openPanel = (panel: NonNullable<typeof ustate.panel>) => !busy && ui.set({ panel });
  const [stars, setStars] = useState(false);
  useEffect(() => session.bus.on('overlay:stars', setStars), [session]);
  const [fade, setFade] = useState(false);
  useEffect(() => session.bus.on('overlay:fade', setFade), [session]);
  return (
    <>
      {weather.rainbow && <div class="rainbow-overlay" aria-hidden="true" />}
      {stars && <StarsOverlay />}
      <div class={`door-fade ${fade ? 'on' : ''}`} aria-hidden="true" />
      {isFireworkTime(now) && !inside && <FireworksOverlay />}
      <div class="hud-clock pop-in">
        <div class="hud-time">
          <span class="hud-phase">{PHASE_ICON[getDayPhase(now)]}</span>
          {formatTime(now)}
        </div>
        <div class="hud-date">{formatDate(now)}</div>
        <div class="hud-season">
          {SEASON_ICONS[season]} {SEASON_LABELS[season]} · {inside ? 'Zu Hause' : session.data?.villageName}
        </div>
        <div class="hud-weather">
          {weather.rainbow ? '🌈 Regenbogen!' : `${WEATHER_ICONS[weather.kind]} ${WEATHER_LABELS[weather.kind]}`}
        </div>
      </div>
      <button class="hud-menu-button pop-in" aria-label="Menü öffnen" disabled={busy} onClick={() => !busy && ui.set({ menuOpen: true })}>
        <span />
        <span />
        <span />
      </button>
      <div class="hud-zoom pop-in">
        <button aria-label="Hineinzoomen" title="Hineinzoomen" disabled={busy} onClick={() => session.bus.emit('camera:zoom', 'in')}>
          ＋
        </button>
        <button aria-label="Herauszoomen" title="Herauszoomen" disabled={busy} onClick={() => session.bus.emit('camera:zoom', 'out')}>
          －
        </button>
      </div>
      <div class="hud-bottom pop-in">
        <div class="hud-money" aria-label="Sternchen">
          {formatMoney(session.data?.money ?? 0)}
        </div>
        {session.data?.flags.thaliaBegruesst && (
          <button class="hud-bag hud-book" aria-label="Dorfkarte öffnen (M)" title="Dorfkarte (M)" disabled={busy} onClick={() => openPanel({ kind: 'karte' })}>
            🗺️
            <span class="hud-tool-key">M</span>
          </button>
        )}
        <button class="hud-bag hud-book" aria-label="Foto machen (F)" title="Foto machen (F)" disabled={busy} onClick={() => session.bus.emit('foto:aufnehmen', undefined)}>
          📷
          <span class="hud-tool-key">F</span>
        </button>
        <button class="hud-bag hud-book" aria-label="Sammelbuch öffnen (B)" title="Sammelbuch (B)" disabled={busy} onClick={() => openPanel({ kind: 'book' })}>
          📖
          <span class="hud-tool-key">B</span>
        </button>
        <button class="hud-bag" aria-label="Tasche öffnen (I)" title="Tasche (I)" disabled={busy} onClick={() => openPanel({ kind: 'inventory' })}>
          🎒
          <span class="hud-tool-key">I</span>
        </button>
      </div>
      {/* außerhalb der Knopfleiste: sonst landet sie durch deren Einblend-Animation unter dem Rucksack */}
      {hasUnreadMail(session) && (
        <div class="hud-mail" title="Neue Post im Briefkasten">
          ✉️ Neue Post!
        </div>
      )}
      {(inside || inYard) && <DecorBar session={session} decor={decor} />}
      {tools.length > 0 && !decor.active && (
        <div class="hud-tools pop-in">
          {tools.map((t, i) => (
            <button key={t} class={`hud-tool ${session.tool === t ? 'active' : ''}`} title={`${itemDef(t)?.name} (${i + 1})`} onClick={() => toggleTool(session, t)}>
              <img src={itemIconUrl(t)} alt={itemDef(t)?.name} draggable={false} />
              <span class="hud-tool-key">{i + 1}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

/** Sternenhimmel oben im Bild mit ein paar Sternschnuppen (die Kamera zeigt keinen echten Himmel) */
function StarsOverlay() {
  const stars = Array.from({ length: 46 }, (_, i) => ({ x: (i * 37.7) % 100, y: ((i * 53.3) % 40) + (i % 3) * 2, s: 1 + (i % 3), d: (i % 7) * 0.4 }));
  return (
    <div class="stars-overlay" aria-hidden="true">
      {stars.map((st, i) => (
        <span key={i} class="star" style={{ left: `${st.x}%`, top: `${st.y}%`, width: `${st.s}px`, height: `${st.s}px`, animationDelay: `${st.d}s` }} />
      ))}
      {[0, 1, 2].map((i) => (
        <span key={`s${i}`} class="shooting-star" style={{ top: `${8 + i * 9}%`, left: `${20 + i * 25}%`, animationDelay: `${1 + i * 2.3}s` }} />
      ))}
    </div>
  );
}

/** Silvester-Feuerwerk oben im Bild */
function FireworksOverlay() {
  const bursts = Array.from({ length: 7 }, (_, i) => ({ x: 8 + ((i * 41) % 84), y: 6 + ((i * 23) % 26), d: i * 0.9, c: i % 4 }));
  return (
    <div class="stars-overlay fireworks" aria-hidden="true">
      {bursts.map((b, i) => (
        <span key={i} class={`firework fw-${b.c}`} style={{ left: `${b.x}%`, top: `${b.y}%`, animationDelay: `${b.d}s` }}>
          {Array.from({ length: 12 }, (_, k) => (
            <i key={k} style={{ transform: `rotate(${k * 30}deg)` }} />
          ))}
        </span>
      ))}
    </div>
  );
}
