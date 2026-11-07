/**
 * Fernsehen zu Hause: welche Folge heute läuft, Rezepte aus der Kochshow,
 * und gemeinsames Fernsehen mit Oli (einmal am Tag Freundschaft).
 */
import { hashString } from '../core/rng';
import { type TvChannel, type TvEpisode, TV_BY_ID } from '../data/tv';
import { learnRecipe } from './crafting';
import { addFriendship } from './gameplay';
import type { Session } from './session';

export function episodeToday(session: Session, ch: TvChannel): TvEpisode {
  return ch.episodes[hashString(`tv:${ch.id}:${session.today()}`) % ch.episodes.length];
}

export interface WatchResult {
  channel: TvChannel;
  episode: TvEpisode;
  lines: string[];
}

/** Eine Folge schauen. `withOli` = Oli ist zu Hause und schaut mit. */
export function watchTv(session: Session, channelId: string, withOli: boolean): WatchResult | null {
  const data = session.data;
  const ch = TV_BY_ID[channelId];
  if (!data || !ch) return null;
  const ep = episodeToday(session, ch);
  const lines = [...ep.lines, ...(ep.lina ?? [])];
  if (withOli) {
    const pool = ep.oli ?? ch.oli;
    lines.push(pool[hashString(`tv-oli:${ch.id}:${session.today()}`) % pool.length]);
    if (data.world.dates['tv-oli'] !== session.today()) {
      data.world.dates['tv-oli'] = session.today();
      lines.push(...addFriendship(session, 'oli', 10));
    }
  }
  if (ep.recipe) learnRecipe(session, ep.recipe);
  session.changed();
  session.save();
  return { channel: ch, episode: ep, lines };
}
