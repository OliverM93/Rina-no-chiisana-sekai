/**
 * Alle Bewohner. Neue Bewohner hier eintragen.
 */
import { GISELA } from './gisela';
import type { NpcDef } from './types';

export const NPCS: readonly NpcDef[] = [GISELA];

export const NPC_BY_ID: Readonly<Record<string, NpcDef>> = Object.fromEntries(NPCS.map((n) => [n.id, n]));
