/**
 * Alle Bewohner. Neue Bewohner hier eintragen.
 */
import { CHRISTIN } from './christin';
import { GISELA } from './gisela';
import { OLAF } from './olaf';
import { OLI } from './oli';
import { JENS } from './jens';
import { LARS } from './lars';
import { THALIA } from './thalia';
import type { NpcDef } from './types';

export const NPCS: readonly NpcDef[] = [GISELA, OLAF, CHRISTIN, OLI, JENS, LARS, THALIA];

export const NPC_BY_ID: Readonly<Record<string, NpcDef>> = Object.fromEntries(NPCS.map((n) => [n.id, n]));
