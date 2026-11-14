/**
 * Spielregeln für die Natur: Werkzeuge, Angeln & Insekten (mit Sammelbuch),
 * Linas Beet und das Wetter.
 */
import { isAvailable, isPracht, pickSpecies, recordLength, registerCatch, rollLength } from '../core/catching';
import { getSeason } from '../core/time';
import { FURNITURE_BY_ITEM } from '../data/furniture';
import { bedTiles } from './home';
import { growGarden, pickBloom, plantSeed, removePlant, spotKey, water } from '../core/garden';
import { hashString, mulberry32 } from '../core/rng';
import { isPrecipitation, weatherAt, type WeatherNow } from '../core/weather';
import { CROP_BY_ID, harvestCount } from '../data/crops';
import { FLOWER_BY_SEED, itemDef, maxStackOf, STARTER_TOOLS, type ToolId, TOOLS } from '../data/items';
import { spaceFor } from '../core/inventory';
import { type FishDef, type FishHabitat, FISH, FISH_CM, type InsectDef, INSECTS } from '../data/species';
import { countItem } from '../core/inventory';
import { itemIconUrl } from '../gfx/items';
import { giveItem, takeItem } from './gameplay';
import { registerBlooms, seedDrop, seedRandom } from './flowers';
import { checkSammlungen } from './sammlungen';
import type { Session } from './session';

// ---------------------------------------------------------------------------
// Wetter
// ---------------------------------------------------------------------------

export function currentWeather(session: Session): WeatherNow {
  return weatherAt(session.clock(), session.weatherOverride);
}

export function isRaining(session: Session): boolean {
  return isPrecipitation(currentWeather(session).kind);
}

// ---------------------------------------------------------------------------
// Werkzeuge
// ---------------------------------------------------------------------------

export function hasTool(session: Session, tool: ToolId): boolean {
  return !!session.data && countItem(session.data.inventory, tool) > 0;
}

export function ownedTools(session: Session): ToolId[] {
  return TOOLS.filter((t) => hasTool(session, t));
}

/** Werkzeug in die Hand nehmen bzw. (gleiches nochmal) wegstecken */
export function toggleTool(session: Session, tool: ToolId | null) {
  const next = tool && session.tool !== tool && hasTool(session, tool) ? tool : null;
  if (next === session.tool) return;
  session.tool = next;
  session.bus.emit('tool:changed', next);
}

/** Besitzt Lina das irgendwo (Tasche, Haus, Garten, noch nicht abgeholt im Briefkasten)? */
export function ownsAnywhere(session: Session, itemId: string): boolean {
  const data = session.data;
  if (!data) return false;
  if (data.inventory.slots.some((s) => s?.itemId === itemId)) return true;
  if (data.storage.slots.some((s) => s?.itemId === itemId)) return true; // Vorratstruhe
  if (data.house.rooms.some((r) => r.items.some((i) => i.itemId === itemId))) return true;
  if (data.yard.items.some((i) => i.itemId === itemId)) return true;
  if (data.world.ground.some((g) => g.itemId === itemId)) return true;
  return data.mail.letters.some((l) => l.gift?.itemId === itemId && !l.giftTaken);
}

/**
 * Was Lina haben sollte, aber nicht mehr hat (z. B. aus älteren Spielständen verschenkt):
 * Omas Werkzeuge, Thalias Schaufel, Olis Möbel vom Einzug. Wird beim Laden zurückgegeben.
 */
export function missingKeepsakes(session: Session): string[] {
  const f = session.data?.flags;
  if (!f) return [];
  const want: string[] = [];
  if (f.toolsGiven) want.push(...STARTER_TOOLS);
  if (f.thaliaBegruesst) want.push('schaufel');
  if (f.oliBegruesst) want.push('schreibtisch-pc', 'hantelbank');
  return want.filter((id) => !ownsAnywhere(session, id));
}

/** Oma Gisela gibt Lina Angel, Kescher, Gießkanne und ein paar Samen. */
export function giveStarterTools(session: Session) {
  const data = session.data;
  if (!data || data.flags.toolsGiven) return;
  for (const t of STARTER_TOOLS) if (!hasTool(session, t)) giveItem(session, t, 1, false);
  giveItem(session, 'samen-tulpe', 3, false);
  giveItem(session, 'samen-tulpe-gelb', 2, false); // rot × gelb = orange – gleich ausprobieren
  giveItem(session, 'samen-vergissmeinnicht', 2, false);
  data.flags.toolsGiven = true;
  session.changed();
  session.bus.emit('toast', { text: 'Angel, Kescher, Gießkanne & Samen eingesteckt! (Tasten 1–3)', icon: itemIconUrl('angel') });
}

// ---------------------------------------------------------------------------
// Fangen & Sammelbuch
// ---------------------------------------------------------------------------

export interface CatchResult {
  isNew: boolean;
  /** Tasche voll – das Tier wurde wieder freigelassen */
  released: boolean;
  /** Fische: Länge in cm */
  cm?: number;
  /** Prachtexemplar (oberste 10 % der Größenspanne) */
  pracht?: boolean;
  /** größter Fang dieser Art bisher (nur wenn eine frühere Bestmarke bekannt war) */
  record?: boolean;
  /** Spezialköder, der dabei verbraucht wurde */
  bait?: string;
}

function registerAndGive(session: Session, id: string, cm?: number): CatchResult {
  const data = session.data;
  if (!data) return { isNew: false, released: true };
  const isNew = registerCatch(data.collection, id, session.today());
  let record = false;
  if (cm !== undefined) {
    const before = recordLength(data.collection, id, cm);
    record = before !== undefined && cm > before;
  }
  const left = giveItem(session, id, 1, false);
  if (isNew) checkSammlungen(session);
  session.changed();
  session.save();
  return { isNew, released: left > 0, record };
}

/** Spezialköder, die beim Angeln automatisch benutzt werden (Glückswurm vor Duftköder) */
export const BAITS = ['koeder-gluckswurm', 'koeder-teig'] as const;

export function activeBait(session: Session): (typeof BAITS)[number] | null {
  const inv = session.data?.inventory;
  if (!inv) return null;
  return BAITS.find((b) => countItem(inv, b) > 0) ?? null;
}

/** Welcher Fisch beißt hier gerade? (zufällig je Wurf) */
export function biteFish(session: Session, habitat: FishHabitat, r = Math.random()): FishDef | null {
  const now = session.clock();
  const raining = isRaining(session);
  const here = FISH.filter((f) => f.habitat === habitat && isAvailable(f, now, raining));
  // Der Glückswurm lockt auch Seltenes: Gewichte werden „flacher“ (Wurzel), Seltenes beißt häufiger
  if (activeBait(session) === 'koeder-gluckswurm') return pickSpecies(here.map((f) => ({ f, weight: Math.sqrt(f.weight) })), r)?.f ?? null;
  return pickSpecies(here, r);
}

/** Fang mit Länge; ein Spezialköder in der Tasche wird dabei verbraucht und gibt ein Prachtexemplar. */
export function catchFish(session: Session, fish: FishDef, r = Math.random()): CatchResult {
  const bait = activeBait(session);
  if (bait) takeItem(session, bait, 1);
  const range = FISH_CM[fish.id] ?? [10, 30];
  const cm = rollLength(range, r, !!bait);
  const result = registerAndGive(session, fish.id, cm);
  return { ...result, cm, pracht: isPracht(cm, range), bait: bait ?? undefined };
}

export function catchInsect(session: Session, insect: InsectDef): CatchResult {
  return registerAndGive(session, insect.id);
}

/** Insekten, die jetzt an einem Ort unterwegs sein können */
export function insectsNow(session: Session): InsectDef[] {
  const now = session.clock();
  const raining = isRaining(session);
  return INSECTS.filter((i) => isAvailable(i, now, raining));
}

/** Reproduzierbarer Zufall pro Tag und Stunde */
export function hourRandom(session: Session, key: string): () => number {
  const now = session.clock();
  return mulberry32(hashString(`${session.today()}:${now.getHours()}:${key}`));
}

export function catchMessage(name: string, kind: 'fisch' | 'insekt', result: CatchResult): string[] {
  const lines = [kind === 'fisch' ? `Du hast ${artikel(name)} gefangen! 🎣` : `Du hast ${artikel(name)} gefangen! 🦋`];
  if (result.cm !== undefined) lines.push(`📏 ${result.cm} cm${result.pracht ? ' – ein Prachtexemplar! ✨' : ''}`);
  if (result.record) lines.push('🏅 Neuer Rekord!');
  if (result.isNew) lines.push('📖 Neu im Sammelbuch!');
  if (result.released) lines.push('Deine Tasche ist voll – du lässt es wieder frei. Tschüss!');
  return lines;
}

/** „einen Barsch“ / „eine Scholle“ – ganz einfache Regel über die Endung */
function artikel(name: string): string {
  const feminin = /(e|in|ung|jungfer|grille|ameise|biene|hummel|libelle|qualle|scholle|makrele|schleie|forelle|krabbe|schnecke)$/i;
  const neutral = /(chen|pferd|auge|würmchen)$/i;
  const last = name.split(' ').pop() ?? name;
  if (neutral.test(last)) return `ein ${name}`;
  if (feminin.test(last)) return `eine ${adj(name, 'e')}`;
  return `einen ${adj(name, 'en')}`;
}

/** Adjektiv vor dem Namen beugen („Grünes Heupferd“ → „Grünen …“) */
function adj(name: string, ending: 'e' | 'en'): string {
  const parts = name.split(' ');
  if (parts.length < 2) return name;
  return [...parts.slice(0, -1).map((p) => p.replace(/(e|er|es)$/, ending === 'e' ? 'e' : 'en')), parts[parts.length - 1]].join(' ');
}

// ---------------------------------------------------------------------------
// Beet
// ---------------------------------------------------------------------------

/** Wächst etwas? Einmal beim Laden und bei jedem neuen Tag/jeder Stunde aufrufen. */
export function updateGarden(session: Session): boolean {
  const data = session.data;
  if (!data) return false;
  const changed = growGarden(data.world.garden, session.today(), currentWeather(session).rainedToday, (key) => isFrozenKey(session, key));
  if (changed) session.changed();
  registerBlooms(session);
  return changed;
}

/** Ist gerade Winter? (Dezember bis Februar) – draußen ruht das Beet */
export function isWinter(session: Session): boolean {
  return getSeason(session.clock()) === 'winter';
}

/** Pflanzplätze (Schlüssel) in Gewächshäusern & Frühbeeten – dort wächst auch im Winter etwas */
export function greenhouseKeys(session: Session): Set<string> {
  const out = new Set<string>();
  const yard = session.data?.yard;
  if (!yard) return out;
  for (const i of yard.items) if (FURNITURE_BY_ITEM[i.itemId]?.def.greenhouse) for (const t of bedTiles(session, i.uid)) out.add(spotKey(t.x, t.y));
  return out;
}

function isFrozenKey(session: Session, key: string): boolean {
  return isWinter(session) && !greenhouseKeys(session).has(key);
}

/** Ruht dieser Pflanzplatz gerade (Winter, nicht im Gewächshaus)? */
export function isFrozen(session: Session, x: number, y: number): boolean {
  return isFrozenKey(session, spotKey(x, y));
}

export function plantAt(session: Session, x: number, y: number, seedId: string): boolean {
  const data = session.data;
  const gf = FLOWER_BY_SEED[seedId];
  if (!data || !gf || !takeItem(session, seedId, 1)) return false;
  const key = spotKey(x, y);
  if (!plantSeed(data.world.garden, key, gf.flower, session.today())) {
    giveItem(session, seedId, 1, false);
    return false;
  }
  // Wenn es gerade regnet, ist das Beet gleich gegossen
  if (currentWeather(session).rainedToday) water(data.world.garden, key, session.today());
  session.changed();
  session.save();
  return true;
}

export function waterAt(session: Session, x: number, y: number): boolean {
  const data = session.data;
  if (!data || isFrozen(session, x, y)) return false;
  const ok = water(data.world.garden, spotKey(x, y), session.today());
  if (ok) {
    session.changed();
    session.save();
  }
  return ok;
}

/**
 * Blüte pflücken – manchmal fällt dabei ein Samenkorn ab. Blühen daneben Blumen derselben Art in anderer
 * Farbe, kann es ein Misch-Same sein (siehe `game/flowers.ts`).
 */
export function pickGardenFlower(session: Session, x: number, y: number): { flower: string; seed: boolean; seedId: string | null; crossed: boolean; count: number; crop: boolean } | null {
  const data = session.data;
  if (!data) return null;
  const key = spotKey(x, y);
  const plant = data.world.garden[key];
  if (!plant) return null;
  // Same-Wurf mit dem Zustand vor dem Pflücken (die Nachbarn blühen noch)
  const drop = seedDrop(data.world.garden, key, plant.flower, seedRandom(session, key));
  // Gemüse & Kräuter: mehrere Stück je Ernte, Wurzelgemüse räumt den Platz
  const crop = CROP_BY_ID[plant.flower];
  const count = crop ? harvestCount(crop, seedRandom(session, `${key}:ernte`)()) : 1;
  if (spaceFor(data.inventory, plant.flower, maxStackOf) < count) {
    session.bus.emit('toast', { text: 'Deine Tasche ist voll! 🎒' });
    return null; // passt nicht in die Tasche – bleibt stehen
  }
  const flower = pickBloom(data.world.garden, key, session.today());
  if (!flower) return null;
  giveItem(session, flower, count, false);
  if (crop?.once) removePlant(data.world.garden, key);
  if (drop.seedId) giveItem(session, drop.seedId, 1, false);
  session.changed();
  session.save();
  return { flower, seed: !!drop.seedId, seedId: drop.seedId, crossed: drop.crossed, count, crop: !!crop };
}

export function seedsInBag(session: Session): string[] {
  const data = session.data;
  if (!data) return [];
  const ids = new Set<string>();
  for (const s of data.inventory.slots) if (s && FLOWER_BY_SEED[s.itemId]) ids.add(s.itemId);
  return [...ids];
}

export function flowerName(id: string): string {
  return itemDef(id)?.name ?? id;
}

