/**
 * Anzeige oben: Uhrzeit, Datum, Jahreszeit und Menü-Knopf.
 */
import { useEffect, useState } from 'preact/hooks';
import { formatDate, formatTime, getDayPhase, getSeason, SEASON_ICONS, SEASON_LABELS } from '../core/time';
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
  return (
    <>
      <div class="hud-clock pop-in">
        <div class="hud-time">
          <span class="hud-phase">{PHASE_ICON[getDayPhase(now)]}</span>
          {formatTime(now)}
        </div>
        <div class="hud-date">{formatDate(now)}</div>
        <div class="hud-season">
          {SEASON_ICONS[season]} {SEASON_LABELS[season]} · {session.data?.villageName}
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
        <button class="hud-bag" aria-label="Tasche öffnen (I)" onClick={() => ui.set({ panel: { kind: 'inventory' } })}>
          🎒
        </button>
        {hasUnreadMail(session) && (
          <div class="hud-mail" title="Neue Post im Briefkasten">
            ✉️
          </div>
        )}
      </div>
    </>
  );
}
