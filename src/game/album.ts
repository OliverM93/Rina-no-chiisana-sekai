/**
 * Album der Momente (Feature Discovery B2): Linas Geschichte in kurzen, datierten Einträgen.
 * Abgeleitet aus dem Spielstand; gemerkt wird nur das Datum (`world.dates`), kein neues Spielstand-Format.
 * Wer schon spielt, bekommt seine bisherigen Momente unter „Früher“ – ein erfundenes Datum gibt es nicht.
 */
import { ALBUM_EARLIER, ALBUM_START_KEY, MOMENTS, type MomentDef, type MomentSource, momentKey, WISH_MOMENT_PREFIX } from '../data/album';
import { NPC_BY_ID } from '../data/npcs';
import { ALL_WISHES, wishFlag } from '../data/wishes';
import { MONTHS } from '../core/time';
import { npcHearts } from './gameplay';
import type { Session } from './session';

const wishMoments: readonly MomentDef[] = ALL_WISHES.map((w) => ({
  id: `${WISH_MOMENT_PREFIX}${w.id}`,
  source: { flag: wishFlag(w.id) },
  text: `${NPC_BY_ID[w.npc]?.name ?? w.npc} hatte einen Herzenswunsch: „${w.title}“. Erfüllt. Das Gesicht dabei vergesse ich nicht.`,
}));

export const ALL_MOMENTS: readonly MomentDef[] = [...MOMENTS, ...wishMoments];

/** false = (noch) nicht eingetreten · true = jetzt eingetreten · Text = Datum steht schon fest */
function reached(session: Session, src: MomentSource): boolean | string {
  const data = session.data;
  if (!data) return false;
  if ('created' in src) return data.createdAt.slice(0, 10);
  if ('flag' in src) return !!data.flags[src.flag];
  if ('hearts' in src) return npcHearts(session, src.hearts.npc) >= src.hearts.min;
  if ('houseStage' in src) return data.house.stage >= src.houseStage;
  return data.world.dates[src.dateKey] || false;
}

/**
 * Verbucht neu eingetretene Momente (jeden genau einmal). Wird bei jeder Zustandsänderung aufgerufen
 * und ist billig. Beim allerersten Aufruf zählt, was schon da ist, als „früher“.
 */
export function syncAlbum(session: Session): void {
  const data = session.data;
  if (!data) return;
  const dates = data.world.dates;
  const first = !dates[ALBUM_START_KEY];
  if (first) dates[ALBUM_START_KEY] = session.today();
  for (const m of ALL_MOMENTS) {
    const key = momentKey(m.id);
    if (dates[key]) continue;
    const r = reached(session, m.source);
    if (!r) continue;
    dates[key] = typeof r === 'string' ? r : first ? ALBUM_EARLIER : session.today();
  }
}

export interface AlbumEntry {
  id: string;
  /** „12. Mai 2026“ oder „Früher“ */
  when: string;
  text: string;
}

function niceDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d}. ${MONTHS[m - 1]} ${y}`;
}

/** Einträge, älteste zuerst; „Früher“ steht ganz oben, danach nach Datum (bei Gleichstand in Erzählreihenfolge) */
export function albumEntries(session: Session): AlbumEntry[] {
  const dates = session.data?.world.dates;
  if (!dates) return [];
  const rows = ALL_MOMENTS.map((m, i) => ({ m, i, at: dates[momentKey(m.id)] })).filter((r): r is { m: MomentDef; i: number; at: string } => !!r.at);
  rows.sort((a, b) => {
    const ea = a.at === ALBUM_EARLIER;
    const eb = b.at === ALBUM_EARLIER;
    if (ea !== eb) return ea ? -1 : 1;
    return ea ? a.i - b.i : a.at.localeCompare(b.at) || a.i - b.i;
  });
  return rows.map((r) => ({ id: r.m.id, when: r.at === ALBUM_EARLIER ? 'Früher' : niceDate(r.at), text: r.m.text }));
}
