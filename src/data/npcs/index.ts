/**
 * Alle Bewohner. Neue Bewohner hier eintragen.
 */
import { CHRISTIN } from './christin';
import { GISELA } from './gisela';
import { OLAF } from './olaf';
import { OLI } from './oli';
import { JENS } from './jens';
import type { NpcDef } from './types';

export const NPCS: readonly NpcDef[] = [GISELA, OLAF, CHRISTIN, OLI, JENS];

export const NPC_BY_ID: Readonly<Record<string, NpcDef>> = Object.fromEntries(NPCS.map((n) => [n.id, n]));
