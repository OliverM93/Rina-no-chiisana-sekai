/**
 * Anzeige oben: Uhrzeit, Datum, Jahreszeit und Menü-Knopf.
 */
import { useEffect, useState } from 'preact/hooks';
import { formatDate, formatTime, getDayPhase, getSeason, SEASON_ICONS, SEASON_LABELS } from '../core/time';
import type { Session } from '../game/session';
import { ui } from './store';

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
    </>
  );
}
