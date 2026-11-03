/**
 * Anzeige oben: Uhrzeit, Datum, Jahreszeit und Menü-Knopf.
 */
import { useEffect, useState } from 'preact/hooks';
import { formatDate, formatTime, getDayPhase, getSeason, SEASON_ICONS, SEASON_LABELS } from '../core/time';
import { WEATHER_ICONS, WEATHER_LABELS } from '../core/weather';
import { itemDef } from '../data/items';
import { currentWeather, ownedTools, toggleTool } from '../game/nature';
import { itemIconUrl } from '../gfx/items';
import type { Session } from '../game/session';
import { formatMoney, hasUnreadMail } from '../game/gameplay';
import { ui, useSessionVersion } from './store';

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
  return (
    <>
      {weather.rainbow && <div class="rainbow-overlay" aria-hidden="true" />}
      <div class="hud-clock pop-in">
        <div class="hud-time">
          <span class="hud-phase">{PHASE_ICON[getDayPhase(now)]}</span>
          {formatTime(now)}
        </div>
        <div class="hud-date">{formatDate(now)}</div>
        <div class="hud-season">
          {SEASON_ICONS[season]} {SEASON_LABELS[season]} · {session.data?.villageName}
        </div>
        <div class="hud-weather">
          {weather.rainbow ? '🌈 Regenbogen!' : `${WEATHER_ICONS[weather.kind]} ${WEATHER_LABELS[weather.kind]}`}
        </div>
      </div>
      <button class="hud-menu-button pop-in" aria-label="Menü öffnen" onClick={() => ui.set({ menuOpen: true })}>
        <span />
        <span />
        <span />
      </button>
      <div class="hud-bottom pop-in">
        <div class="hud-money" aria-label="Sternchen">
          {formatMoney(session.data?.money ?? 0)}
        </div>
        <button class="hud-bag hud-book" aria-label="Sammelbuch öffnen (B)" title="Sammelbuch (B)" onClick={() => ui.set({ panel: { kind: 'book' } })}>
          📖
        </button>
        <button class="hud-bag" aria-label="Tasche öffnen (I)" title="Tasche (I)" onClick={() => ui.set({ panel: { kind: 'inventory' } })}>
          🎒
        </button>
        {hasUnreadMail(session) && (
          <div class="hud-mail" title="Neue Post im Briefkasten">
            ✉️
          </div>
        )}
      </div>
      {tools.length > 0 && (
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
