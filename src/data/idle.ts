/**
 * Kleine Leerlauf-Animationen für Lina: Steht sie etwa 10 Sekunden still, macht sie ab und zu
 * etwas Niedliches. Welche, hängt von Tageszeit, Wetter, Jahreszeit und Winston ab.
 * Die Posen stehen in `world3d/models/chibi3d.ts` (`IdleAct`), die Auswahl in `game/idle.ts`.
 */

export type IdleAct = 'strecken' | 'gaehnen' | 'summen' | 'wippen' | 'kraulen' | 'haende-reiben' | 'regen-fuehlen' | 'flocken-fangen';

export interface IdleContext {
  hour: number;
  raining: boolean;
  /** Es schneit gerade */
  snowing?: boolean;
  winter: boolean;
  inside: boolean;
  /** Winston steht wach direkt neben Lina */
  winstonNear: boolean;
}

export interface IdleActDef {
  id: IdleAct;
  /** Dauer in Sekunden */
  duration: number;
  /** Symbol, das dabei über Lina aufsteigt (optional) */
  emote?: string;
  /** Gewicht je Lage (0 = passt gerade nicht) */
  weight: (c: IdleContext) => number;
}

const sleepy = (h: number) => h >= 21 || h < 8;

export const IDLE_ACTS: readonly IdleActDef[] = [
  { id: 'strecken', duration: 2.6, weight: (c) => (sleepy(c.hour) ? 1.5 : 2) },
  { id: 'gaehnen', duration: 2.4, emote: '💤', weight: (c) => (sleepy(c.hour) ? 3 : 0.4) },
  { id: 'summen', duration: 4, emote: '🎵', weight: () => 2 },
  { id: 'wippen', duration: 3, weight: () => 1.3 },
  { id: 'kraulen', duration: 2.8, emote: '💕', weight: (c) => (c.winstonNear ? 3 : 0) },
  { id: 'haende-reiben', duration: 2.6, emote: '❄️', weight: (c) => (c.winter && !c.inside ? 2.5 : 0) },
  { id: 'flocken-fangen', duration: 3.2, emote: '❄️', weight: (c) => (c.snowing && !c.inside ? 3 : 0) },
  { id: 'regen-fuehlen', duration: 2.6, emote: '💧', weight: (c) => (c.raining && !c.inside ? 2.5 : 0) },
];

/** Erst nach so vielen Sekunden Stillstand, danach alle paar Sekunden wieder */
export const IDLE_START = 10;
export const IDLE_GAP: readonly [number, number] = [7, 13];
