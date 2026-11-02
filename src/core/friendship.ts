/**
 * Freundschaft zu Bewohnern (Herzen), Plaudern und Geschenke.
 *
 * Gemütlich gedacht: Freundschaft sinkt nie. Ein ungeliebtes Geschenk gibt
 * nur wenig – dafür eine lustige Reaktion.
 */

export interface NpcState {
  points: number;
  /** Tag (JJJJ-MM-TT), an dem zuletzt geplaudert wurde */
  lastTalkDay: string;
  /** Tag, an dem zuletzt ein Geschenk zählte */
  lastGiftDay: string;
  /** Wie oft heute schon geplaudert wurde (für abwechselnde Texte) */
  talksToday: number;
  /** Bereits erhaltene Herz-Belohnungen */
  rewards: number[];
}

export type GiftReaction = 'liebt' | 'mag' | 'neutral' | 'mag-nicht';

export interface Preferences {
  loves: readonly string[];
  likes: readonly string[];
  dislikes: readonly string[];
}

/** Punkte, ab denen es das n-te Herz gibt (Index = Herzen). */
export const HEART_THRESHOLDS = [0, 40, 100, 180, 280, 400] as const;
export const MAX_HEARTS = HEART_THRESHOLDS.length - 1;

export const TALK_POINTS = 8;
export const GIFT_POINTS: Record<GiftReaction, number> = { liebt: 30, mag: 16, neutral: 8, 'mag-nicht': 2 };
/** Weitere Geschenke am selben Tag freuen trotzdem – zählen aber nur wenig. */
export const EXTRA_GIFT_POINTS = 1;

export function createNpcState(): NpcState {
  return { points: 0, lastTalkDay: '', lastGiftDay: '', talksToday: 0, rewards: [] };
}

export function heartsFor(points: number): number {
  let hearts = 0;
  for (let i = 1; i < HEART_THRESHOLDS.length; i++) if (points >= HEART_THRESHOLDS[i]) hearts = i;
  return hearts;
}

/** Fortschritt zum nächsten Herz (0..1). */
export function heartProgress(points: number): number {
  const h = heartsFor(points);
  if (h >= MAX_HEARTS) return 1;
  const from = HEART_THRESHOLDS[h];
  const to = HEART_THRESHOLDS[h + 1];
  return (points - from) / (to - from);
}

export function reactionTo(prefs: Preferences, itemId: string): GiftReaction {
  if (prefs.loves.includes(itemId)) return 'liebt';
  if (prefs.likes.includes(itemId)) return 'mag';
  if (prefs.dislikes.includes(itemId)) return 'mag-nicht';
  return 'neutral';
}

export interface TalkResult {
  firstToday: boolean;
  gained: number;
  heartUp: boolean;
}

/** Plaudern: das erste Gespräch des Tages bringt Freundschaftspunkte. */
export function talk(state: NpcState, today: string): TalkResult {
  const before = heartsFor(state.points);
  const firstToday = state.lastTalkDay !== today;
  if (firstToday) {
    state.lastTalkDay = today;
    state.talksToday = 0;
    state.points += TALK_POINTS;
  }
  state.talksToday += 1;
  return { firstToday, gained: firstToday ? TALK_POINTS : 0, heartUp: heartsFor(state.points) > before };
}

export interface GiftResult {
  reaction: GiftReaction;
  gained: number;
  heartUp: boolean;
  /** War das schon das zweite (oder weitere) Geschenk heute? */
  repeatToday: boolean;
}

export function giveGift(state: NpcState, prefs: Preferences, itemId: string, today: string): GiftResult {
  const before = heartsFor(state.points);
  const reaction = reactionTo(prefs, itemId);
  const repeatToday = state.lastGiftDay === today;
  const gained = repeatToday ? EXTRA_GIFT_POINTS : GIFT_POINTS[reaction];
  state.points += gained;
  state.lastGiftDay = today;
  return { reaction, gained, heartUp: heartsFor(state.points) > before, repeatToday };
}

/**
 * Herz-Belohnungen, die erreicht, aber noch nicht vergeben wurden.
 * Markiert sie als vergeben.
 */
export function claimHeartRewards(state: NpcState, rewardHearts: readonly number[]): number[] {
  const hearts = heartsFor(state.points);
  const due = rewardHearts.filter((h) => h <= hearts && !state.rewards.includes(h));
  state.rewards.push(...due);
  return due;
}

export function normalizeNpcState(raw: unknown): NpcState {
  const s = createNpcState();
  if (!raw || typeof raw !== 'object') return s;
  const r = raw as Record<string, unknown>;
  if (typeof r.points === 'number' && Number.isFinite(r.points)) s.points = Math.max(0, r.points);
  if (typeof r.lastTalkDay === 'string') s.lastTalkDay = r.lastTalkDay;
  if (typeof r.lastGiftDay === 'string') s.lastGiftDay = r.lastGiftDay;
  if (typeof r.talksToday === 'number') s.talksToday = Math.max(0, Math.floor(r.talksToday));
  if (Array.isArray(r.rewards)) s.rewards = r.rewards.filter((h): h is number => typeof h === 'number');
  return s;
}
