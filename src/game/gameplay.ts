/**
 * Spielregeln, die Spielstand, Daten und Kernlogik verbinden:
 * Sammeln, Verkaufen, Plaudern, Schenken, Post.
 *
 * Die Funktionen ändern `session.data` und melden Änderungen über den Bus.
 * Darstellung (Phaser/Preact) passiert woanders.
 */
import { progressHint } from './progress';
import { creditInterest } from '../core/bank';
import { INTEREST_LETTERS } from '../data/npcs/olaf';
import { dailySpawns, type DailySpawn, weightedPick } from '../core/daily';
import { type DialogueContext, pickLine } from '../core/dialogue';
import { claimHeartRewards, createNpcState, giveGift, type GiftReaction, heartsFor, type NpcState, type Preferences, talk } from '../core/friendship';
import { addItem as invAdd, removeItem as invRemove, takeSlot } from '../core/inventory';
import { deliver, mailDue, unreadCount } from '../core/mail';
import { hashString, mulberry32 } from '../core/rng';
import { formatIsoDay, getDayPhase, getSeason, isSameDayMonth } from '../core/time';
import { daysUntilBirthday, festivalsOn } from '../core/festivals';
import { weatherAt } from '../core/weather';
import { terrainAt } from '../core/worldmap';
import { BEACH_FINDS, BEACH_FINDS_PER_DAY, CURRENCY, GARDEN_FLOWER, isKeepsake, itemCountLabel, itemDef, maxStackOf, ROCK_FINDS, speciesOfFlower } from '../data/items';
import { fillPlaceholders } from '../data/interactions';
import { FURNITURE_BY_ITEM } from '../data/furniture';
import { NPC_BY_ID, NPCS } from '../data/npcs';
import type { LetterTemplate, NpcDef } from '../data/npcs/types';
import type { Session } from './session';
import { itemIconUrl } from '../gfx/items';
import { onItemObtained } from './crafting';
import { festTalk } from './festivals';
import { isPartyTime } from './party';
import { checkOliAnniversaries, playStageScene } from './romance';
import { STAGE_LEAD } from '../data/oliStufen';
import { checkMatteoLetters } from './matteo';
import { checkSammlungen } from './sammlungen';
import { memoryLinesFor, memoryTags, takeMemory } from './erinnerungen';
import { winstonOmaLines } from './pet';
import { tipsyComment } from './tipsy';

// ---------------------------------------------------------------------------
// Tasche & Sternchen
// ---------------------------------------------------------------------------

/** Legt Gegenstände in die Tasche. Gibt zurück, wie viele nicht mehr passten. */
export function giveItem(session: Session, itemId: string, count = 1, announce = true): number {
  const data = session.data;
  if (!data) return count;
  if (onItemObtained(session, itemId)) return 0;
  const left = invAdd(data.inventory, itemId, count, maxStackOf);
  const got = count - left;
  if (got > 0) {
    session.changed();
    if (announce) session.bus.emit('toast', { text: `${itemCountLabel(itemId, got)} eingesteckt`, icon: itemIconUrl(itemId) });
  }
  if (left > 0) session.bus.emit('toast', { text: 'Deine Tasche ist voll! 🎒' });
  return left;
}

export function takeItem(session: Session, itemId: string, count = 1): boolean {
  const data = session.data;
  if (!data) return false;
  const ok = invRemove(data.inventory, itemId, count);
  if (ok) session.changed();
  return ok;
}

/** Verkauft ganze Taschenplätze. Gibt die verdienten Sternchen zurück. */
export function sellSlots(session: Session, indices: readonly number[]): number {
  const data = session.data;
  if (!data) return 0;
  let earned = 0;
  for (const i of indices) {
    const stack = data.inventory.slots[i];
    if (!stack) continue;
    const price = itemDef(stack.itemId)?.price;
    if (price === null || price === undefined) continue;
    takeSlot(data.inventory, i);
    earned += price * stack.count;
  }
  if (earned > 0) {
    session.bus.emit('sfx', 'muenzen');
    data.money += earned;
    data.stats.sold += earned;
    session.changed();
    session.save();
  }
  return earned;
}

export function formatMoney(n: number): string {
  return `${n.toLocaleString('de-DE')} ${CURRENCY.icon}`;
}

// ---------------------------------------------------------------------------
// Tägliche Funde & Weltzustand
// ---------------------------------------------------------------------------

let beachTilesCache: Array<{ x: number; y: number }> | null = null;

/** Sandkacheln, auf denen Muscheln liegen können */
export function beachTiles(session: Session) {
  if (beachTilesCache) return beachTilesCache;
  const map = session.map;
  const tiles: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      if (terrainAt(map, x, y) === 'sand' && !map.grid.isBlocked(x, y)) tiles.push({ x, y });
    }
  }
  beachTilesCache = tiles;
  return tiles;
}

/** Heutige Strandfunde, die noch nicht eingesammelt wurden */
export function todaysBeachFinds(session: Session): DailySpawn[] {
  const data = session.data;
  if (!data) return [];
  const day = session.today();
  if (data.world.picked.day !== day) data.world.picked = { day, ids: [] };
  const picked = new Set(data.world.picked.ids);
  return dailySpawns(day, beachTiles(session), BEACH_FINDS_PER_DAY, BEACH_FINDS, 'strand').filter((s) => !picked.has(s.id));
}

export function markPicked(session: Session, id: string) {
  const data = session.data;
  if (!data) return;
  const day = session.today();
  if (data.world.picked.day !== day) data.world.picked = { day, ids: [] };
  data.world.picked.ids.push(id);
}

/** Reproduzierbarer Zufall pro Tag und Objekt */
export function dayRandom(session: Session, key: string): () => number {
  return mulberry32(hashString(`${session.today()}:${key}`));
}

/** Felsen klopfen: einmal am Tag etwas finden. */
export function knockRock(session: Session, rockId: string): string | null {
  const data = session.data;
  if (!data) return null;
  const day = session.today();
  if (data.world.rockDay[rockId] === day) return null;
  data.world.rockDay[rockId] = day;
  return weightedPick(ROCK_FINDS, dayRandom(session, rockId)());
}

// ---------------------------------------------------------------------------
// Bewohner: Plaudern & Schenken
// ---------------------------------------------------------------------------

export function npcState(session: Session, npcId: string): NpcState {
  const data = session.data;
  if (!data) return createNpcState();
  if (!data.npcs[npcId]) data.npcs[npcId] = createNpcState();
  return data.npcs[npcId];
}

export function npcHearts(session: Session, npcId: string): number {
  return heartsFor(npcState(session, npcId).points);
}

function dialogueContext(session: Session, npcId: string, firstToday: boolean): DialogueContext {
  const now = session.clock();
  const st = npcState(session, npcId);
  const tags: string[] = [];
  if (session.data && isSameDayMonth(now, session.data.player.birthday)) tags.push('geburtstag-lina');
  const w = weatherAt(now, session.weatherOverride);
  tags.push(`wetter-${w.kind}`);
  if (session.data?.flags.olafEingezogen) tags.push('olaf-da');
  if (session.data?.flags.winstonGefunden) tags.push('winston-da');
  if (session.data?.world.dates.christinGiesst === session.today()) tags.push('beet-gegossen');
  if (session.data?.flags.oliEingezogen) tags.push('oli-da');
  if (session.data?.flags.jensEingezogen) tags.push('jens-da');
  if (session.data?.flags.larsEingezogen) tags.push('lars-da');
  if (session.data?.flags.thaliaEingezogen) tags.push('thalia-da');
  if (isPartyTime(session)) tags.push('party');
  for (const f of festivalsOn(now, session.data?.player.birthday)) tags.push(`fest-${f}`);
  for (const n of NPCS) {
    if (!n.birthday) continue;
    const d = daysUntilBirthday(now, n.birthday);
    if (d === 0) tags.push(`geburtstag-${n.id}`);
    else if (d <= 7) tags.push(`bald-geburtstag-${n.id}`);
  }
  if (session.data?.yard.items.some((i) => FURNITURE_BY_ITEM[i.itemId]?.def.coop === 'huhn')) tags.push('huehner');
  if (session.data?.yard.items.some((i) => FURNITURE_BY_ITEM[i.itemId]?.def.coop === 'wachtel')) tags.push('wachteln');
  if (w.rainbow) tags.push('regenbogen');
  tags.push(...memoryTags(session));
  return {
    phase: getDayPhase(now),
    season: getSeason(now),
    hearts: heartsFor(st.points),
    weekday: now.getDay(),
    firstToday,
    tags,
    day: formatIsoDay(now),
    turn: st.talksToday,
  };
}

const fill = (session: Session, lines: readonly string[]) => {
  const ctx = session.interactionContext();
  return lines.map((l) => fillPlaceholders(l, ctx));
};

function pickByDay<T>(session: Session, key: string, list: readonly T[]): T {
  return list[hashString(`${session.today()}:${key}`) % list.length];
}

/** Heart-Up: Zeilen + Brief mit Geschenk */
function handleHeartUp(session: Session, npc: NpcDef, st: NpcState, out: string[]) {
  session.bus.emit('sfx', 'herz');
  session.bus.emit('fx', { kind: 'herzen', npc: npc.id });
  out.push(...pickByDay(session, `${npc.id}:herz:${st.points}`, npc.dialogue.heartUp));
  const due = claimHeartRewards(st, Object.keys(npc.heartLetters).map(Number));
  for (const h of due) sendLetter(session, npc, npc.heartLetters[h], `${npc.id}-${npc.heartLetters[h].id}`);
}

/**
 * Herz-Briefe nachliefern: Kamen Briefe für schon erreichte Herzen neu dazu (oder fehlen aus älteren Spielständen),
 * schickt der Bewohner sie jetzt. Gibt die Anzahl der neuen Briefe zurück.
 */
export function catchUpHeartLetters(session: Session): number {
  const data = session.data;
  if (!data) return 0;
  let sent = 0;
  for (const npc of NPCS) {
    const st = data.npcs[npc.id];
    if (!st || !hasMovedIn(session, npc.id)) continue;
    for (const h of claimHeartRewards(st, Object.keys(npc.heartLetters).map(Number))) {
      sendLetter(session, npc, npc.heartLetters[h], `${npc.id}-${npc.heartLetters[h].id}`);
      sent++;
    }
  }
  if (sent > 0) session.changed();
  return sent;
}

/** Zusätzliche Freundschaft (z. B. nach einem gemeinsamen Moment). Gibt Herz-Zeilen zurück, falls ein Herz dazukam. */
export function addFriendship(session: Session, npcId: string, points: number): string[] {
  const npc = NPC_BY_ID[npcId];
  if (!npc) return [];
  const st = npcState(session, npcId);
  const before = heartsFor(st.points);
  st.points += points;
  const lines: string[] = [];
  if (heartsFor(st.points) > before) handleHeartUp(session, npc, st, lines);
  session.changed();
  return fill(session, lines);
}

export interface TalkOutcome {
  lines: string[];
  hearts: number;
}

/** Ansprechen: Begrüßung (erstes Mal am Tag) bzw. Plaudern */
export function talkToNpc(session: Session, npcId: string): TalkOutcome {
  const npc = NPC_BY_ID[npcId];
  const st = npcState(session, npcId);
  const result = talk(st, session.today());
  const ctx = dialogueContext(session, npcId, result.firstToday);
  const lines: string[] = [...tipsyComment(session, npcId)];
  // Oli zu Hause: Hat Lina ein neues Herz erreicht, beginnt die nächste „Zeit zu zweit“-Szene von selbst (eine je Gespräch, ohne Menüpunkt)
  if (npcId === 'oli' && session.inside && !session.visiting) {
    const scene = playStageScene(session);
    if (scene) lines.push(STAGE_LEAD, ...scene.lines);
  }
  if (result.firstToday) {
    const fest = festTalk(session, npcId);
    if (npc.birthday && npc.birthdayLines && isSameDayMonth(session.clock(), npc.birthday)) lines.push(...npc.birthdayLines.greeting);
    else if (fest.length > 0) lines.push(...fest);
    else lines.push(...pickLine(npc.dialogue.greetings, ctx));
    lines.push(...takeMemory(session, npcId));
    lines.push(...winstonOmaLines(session, npcId));
    // sanfter Hinweis, was für den nächsten Einzug noch fehlt (einmal am Tag zur Begrüßung)
    const hint = progressHint(session, npcId);
    if (hint && session.data) {
      lines.push(...hint);
      session.data.world.dates[`hinweis-${npcId}`] = session.today();
    }
    const treat = npc.dailyTreat;
    if (treat && dayRandom(session, `${npcId}:treat`)() < treat.chance) {
      lines.push(...treat.lines);
      giveItem(session, treat.itemId, 1);
    }
  } else {
    lines.push(...pickLine([...npc.dialogue.chat, ...memoryLinesFor(session, npcId)], ctx));
  }
  if (result.heartUp) handleHeartUp(session, npc, st, lines);
  session.changed();
  return { lines: fill(session, lines), hearts: heartsFor(st.points) };
}

/** Weiter plaudern (nach der Begrüßung) */
export function chatWithNpc(session: Session, npcId: string): TalkOutcome {
  const npc = NPC_BY_ID[npcId];
  const st = npcState(session, npcId);
  st.talksToday += 1;
  // beim Weiterplaudern ab und zu (jedes dritte Mal) wieder ein Hinweis
  const hint = st.talksToday % 3 === 0 ? progressHint(session, npcId) : null;
  const lines = hint ? [...hint] : pickLine([...npc.dialogue.chat, ...memoryLinesFor(session, npcId)], dialogueContext(session, npcId, false));
  return { lines: fill(session, [...tipsyComment(session, npcId), ...lines]), hearts: heartsFor(st.points) };
}

export interface GiftOutcome extends TalkOutcome {
  reaction: GiftReaction;
}

/**
 * Vorlieben für Blumen in anderen Farben: Wer die Art mag, mag auch jede Farbe. Neue Mischfarben sind etwas
 * Besonderes – sie kommen bei niemandem schlecht an.
 */
export function giftPreferences(prefs: Preferences, itemId: string): Preferences {
  const gf = GARDEN_FLOWER[itemId];
  if (!gf || gf.species === itemId) return prefs;
  const listed = (l: readonly string[]) => l.includes(itemId) || l.includes(gf.species);
  return {
    loves: listed(prefs.loves) ? [itemId] : [],
    likes: listed(prefs.likes) || (gf.crossOnly && !listed(prefs.loves)) ? [itemId] : [],
    dislikes: listed(prefs.dislikes) && !gf.crossOnly ? [itemId] : [],
  };
}

export function giftToNpc(session: Session, npcId: string, itemId: string): GiftOutcome | null {
  const npc = NPC_BY_ID[npcId];
  // Werkzeuge & Erinnerungsstücke behält Lina (sonst wären sie für immer weg)
  if (!npc || isKeepsake(itemId) || !takeItem(session, itemId, 1)) return null;
  const st = npcState(session, npcId);
  const r = giveGift(st, giftPreferences(npc.preferences, itemId), itemId, session.today());
  const lines: string[] = [];
  if (r.repeatToday) {
    lines.push(...npc.dialogue.giftRepeat);
  } else {
    const special = npc.dialogue.giftsByItem[itemId] ?? npc.dialogue.giftsByItem[speciesOfFlower(itemId)];
    lines.push(...(special ?? pickByDay(session, `${npcId}:gift:${itemId}`, npc.dialogue.gifts[r.reaction])));
  }
  // Geburtstagsgeschenk: doppelte Freude
  if (!r.repeatToday && npc.birthday && isSameDayMonth(session.clock(), npc.birthday)) {
    const before = heartsFor(st.points);
    st.points += r.gained;
    if (npc.birthdayLines) lines.push(...npc.birthdayLines.thanks);
    if (!r.heartUp && heartsFor(st.points) > before) handleHeartUp(session, npc, st, lines);
  }
  if (r.heartUp) handleHeartUp(session, npc, st, lines);
  else if (!r.repeatToday && r.reaction === 'liebt') session.bus.emit('fx', { kind: 'herzen', npc: npcId });
  session.changed();
  session.save();
  return { lines: fill(session, lines), hearts: heartsFor(st.points), reaction: r.reaction };
}

export function goodbyeLine(session: Session, npcId: string): string {
  const npc = NPC_BY_ID[npcId];
  return pickByDay(session, `${npcId}:bye:${npcState(session, npcId).talksToday}`, npc.dialogue.goodbye);
}

// ---------------------------------------------------------------------------
// Post
// ---------------------------------------------------------------------------

export function sendLetter(session: Session, npc: NpcDef, tmpl: LetterTemplate, id: string) {
  const data = session.data;
  if (!data) return;
  const ctx = session.interactionContext();
  const delivered = deliver(data.mail, {
    id,
    from: npc.name,
    subject: fillPlaceholders(tmpl.subject, ctx),
    body: fillPlaceholders(tmpl.body, ctx),
    gift: tmpl.gift ? { ...tmpl.gift } : undefined,
    day: session.today(),
  });
  if (delivered) {
    session.changed();
    session.bus.emit('toast', { text: `📬 Neue Post von ${npc.name}!` });
    session.bus.emit('sfx', 'post');
  }
}

/**
 * Ist der Bewohner wirklich da? Erst nach dem Einzug **und** der Begrüßungsszene (`…Begruesst`) – nach der
 * Ankündigung ist er noch nicht im Dorf, und es kommt auch keine weitere Post von ihm.
 */
export function hasMovedIn(session: Session, npcId: string): boolean {
  const npc = NPC_BY_ID[npcId];
  const flags = session.data?.flags;
  if (!npc || !flags) return false;
  if (!npc.movesIn) return true;
  return !!flags[npc.movesIn] && !!flags[npc.movesIn.replace('Eingezogen', 'Begruesst')];
}

/** Einmal pro Tag: kommt neue Post? */
export function checkDailyMail(session: Session) {
  const data = session.data;
  if (!data) return;
  const day = session.today();
  if (data.mail.lastCheckDay === day) return;
  const firstCheck = data.mail.lastCheckDay === '';
  data.mail.lastCheckDay = day;
  creditWeeklyInterest(session);
  checkOliAnniversaries(session);
  checkSammlungen(session);
  checkMatteoLetters(session);
  if (firstCheck) return; // Am Einzugstag gibt es den Willkommensbrief (siehe welcomeLetter)
  for (const npc of NPCS) {
    if (npc.letters.length === 0 || !hasMovedIn(session, npc.id) || !mailDue(day, npc.id)) continue;
    const tmpl = pickByDay(session, `${npc.id}:brief`, npc.letters);
    sendLetter(session, npc, tmpl, `${npc.id}-${tmpl.id}-${day}`);
  }
}

/** Wochenanfang: Zinsen aufs Sparbuch; höchstens einmal im Monat ein Kontoauszug-Brief von Papa (Olaf) */
export function creditWeeklyInterest(session: Session): number {
  const data = session.data;
  if (!data) return 0;
  const olaf = NPC_BY_ID.olaf;
  if (!hasMovedIn(session, 'olaf')) return 0;
  const z = creditInterest(data.bank, session.today());
  if (z > 0 && olaf) {
    const tmpl = pickByDay(session, 'olaf:zinsen', INTEREST_LETTERS);
    sendLetter(
      session,
      olaf,
      { ...tmpl, body: tmpl.body.replace('{zinsen}', formatMoney(z)).replace('{guthaben}', formatMoney(data.bank.savings)) },
      `olaf-zinsen-${data.bank.interestWeek.slice(0, 7)}`,
    );
  }
  return z;
}

export const WELCOME_LETTER: LetterTemplate = {
  id: 'willkommen',
  subject: 'Willkommen in {dorf}!',
  body: 'Liebe Lina,\n\nwillkommen in {dorf}! Schön, dass wir jetzt Nachbarn sind.\n\nIch hab ein Auge auf dich. Immer.\n\nDeine Oma\n\nPS: Die Kekse sind für dich. Nicht teilen. Na gut, ein bisschen teilen.',
  gift: { itemId: 'keks', count: 2 },
};

export function welcomeLetter(session: Session) {
  const npc = NPC_BY_ID.gisela;
  if (npc) sendLetter(session, npc, WELCOME_LETTER, 'gisela-willkommen');
}

export function markLetterRead(session: Session, letterId: string) {
  const letter = session.data?.mail.letters.find((l) => l.id === letterId);
  if (letter && !letter.read) {
    letter.read = true;
    session.changed();
  }
}

/** Geschenk aus einem Brief nehmen. Gibt false zurück, wenn die Tasche voll ist. */
export function takeLetterGift(session: Session, letterId: string): boolean {
  const letter = session.data?.mail.letters.find((l) => l.id === letterId);
  if (!letter?.gift || letter.giftTaken) return false;
  const left = giveItem(session, letter.gift.itemId, letter.gift.count);
  if (left > 0) {
    // Was nicht passte, bleibt im Brief
    if (left === letter.gift.count) return false;
    letter.gift = { ...letter.gift, count: left };
    session.changed();
    return false;
  }
  letter.giftTaken = true;
  session.changed();
  session.save();
  return true;
}

export function hasUnreadMail(session: Session): boolean {
  return session.data ? unreadCount(session.data.mail) > 0 : false;
}
