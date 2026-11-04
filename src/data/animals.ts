/**
 * Hühner & Wachteln in Linas Garten. Ein Stall bringt seine Tiere gleich mit;
 * jeden Tag liegen frische Eier im Nest.
 */
import type { CoopInfo, CoopKind } from '../core/coop';

export interface CoopDef extends CoopInfo {
  /** Name eines Tieres (für Meldungen) */
  animal: string;
  plural: string;
  /** Laute beim Streicheln */
  sounds: readonly string[];
  /** Fellfarben (Federfarben) der Tiere – reihum */
  colors: readonly string[];
}

export const COOPS: Record<CoopKind, CoopDef> = {
  huhn: {
    animals: 3,
    eggs: [2, 3],
    egg: 'ei',
    animal: 'Huhn',
    plural: 'Hühner',
    sounds: ['Gack gack! 🐔', 'Das Huhn gackert zufrieden und plustert sich auf.', 'Bok bok bok … Das Huhn legt den Kopf schief.', 'Das Huhn pickt dir neugierig an den Schuh.'],
    colors: ['#c8743a', '#f7f2e8', '#8a5a3a'],
  },
  wachtel: {
    animals: 4,
    eggs: [3, 4],
    egg: 'wachtelei',
    animal: 'Wachtel',
    plural: 'Wachteln',
    sounds: ['Pick-per-wick! 🐦', 'Die Wachtel trippelt aufgeregt im Kreis.', 'Die Wachtel kuschelt sich ganz rund zusammen.', 'Piep! Die Wachtel versteckt sich kurz hinter ihren Freundinnen.'],
    colors: ['#a07a52', '#8f6a46', '#b8926a', '#7a5a3e'],
  },
};

export const EGG_LINES: Record<CoopKind, readonly string[]> = {
  huhn: ['Im Nest liegen frische Eier! 🥚', 'Die Hühner gackern stolz – frische Eier!'],
  wachtel: ['Winzige gesprenkelte Wachteleier! 🥚', 'Die Wachteln haben fleißig gelegt.'],
};

export const NO_EGGS: Record<CoopKind, string> = {
  huhn: 'Die Hühner dösen. Morgen gibt es wieder frische Eier.',
  wachtel: 'Die Wachteln kuscheln sich zusammen. Morgen gibt es wieder Eier.',
};
