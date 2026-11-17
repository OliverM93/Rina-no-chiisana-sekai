/**
 * Die versteckte Insel (Belohnung für alle Herzen): sonnig wie Hawaii, mit Palmen, Blumenwiese und weißem Sand.
 * Sie liegt im selben Kartenraster unterhalb des Dorfes (ab Reihe `INSEL_Y0`), weit hinter dem tiefen Meer – zu Fuß
 * kommt man nicht hin, nur mit dem Boot (`game/insel.ts`). Legende wie in `village.ts`, dazu `Y` = Palme.
 */
import type { MapObjectDef } from '../../core/worldmap';

/** Erste Kartenreihe der Insel (alles darüber ist das Dorf) */
export const INSEL_Y0 = 40;

/** Ist diese Kachel Teil der Insel? (Dorf-Zufallsfunde, Karte & Co. lassen sie aus) */
export const isInselRow = (y: number) => y >= INSEL_Y0;

// prettier-ignore
export const INSEL_ROWS: readonly string[] = [
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWwwwwwwwwwwWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWwwwwwwwwwwwwwwwwwWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWwwwwwwwwwwwswwwwwwwwwwWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWwwwwwwssssssssssssswwwwwwWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWwwwwwwsssss...sYssssssswwwwWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWwwwwwwssss,.,.Y....,YsssYwwwwwWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWwwwwsYss..,.,,,........sssswwwwWWWWWWWWWWWW',
  'WWWWWWWWWWWWWwwwwsssb.Y.....,..,,...sssYwwwwwWWWWWWWWWWW',
  'WWWWWWWWWWWWwwwwwss..,,,..,...,,,.,..ssswwwwwWWWWWWWWWWW',
  'WWWWWWWWWWWWwwwwwss.......,.......,..,sswwwwwWWWWWWWWWWW',
  'WWWWWWWWWWWWwwwwwsssY....,...........,sswwwwwWWWWWWWWWWW',
  'WWWWWWWWWWWWwwwwwssss...,....,..,,..sYsswwwwWWWWWWWWWWWW',
  'WWWWWWWWWWWWWwwwwssss..............sssswwwwwWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWwwwwsYss.Y...,......YssswwwwwWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWwwwwwssssss..Yss.ssssswwwwwWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWwwwwwwsssssssssYsssswwwwwWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWwwwwwwwssswsswwwwwwwwwWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWwwwwwwwwwwwwwwwwwWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWwwwwwwwwwwwWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
];

/** Hier steht Lina nach der Überfahrt (Sandstrand im Westen, schaut nach Osten) */
export const INSEL_ARRIVAL = { x: 18, y: 52 };

/** Dorfstrand: hier liegt das Boot; Lina kommt auf die Kachel davor zurück */
export const DORF_BOOT_RETURN = { x: 28, y: 35 };

/** Mitte der Insel: Festplatz für den ersten Besuch */
export const INSEL_FEST = { x: 28, y: 52 };

/** Boote: am Dorfstrand und auf der Insel (erscheinen, sobald alle Herzen voll sind) */
export const INSEL_OBJECTS: readonly MapObjectDef[] = [
  { id: 'boot-dorf', kind: 'landmark', variant: 'boot', x: 27, y: 36, w: 2, h: 1, requires: 'inselOffen' },
  { id: 'inselhuette', kind: 'house', variant: 'shack', x: 33, y: 49, requires: 'inselFest' },
  { id: 'schildkroete', kind: 'landmark', variant: 'schildkroete', x: 22, y: 57, w: 1, h: 1, requires: 'inselFest' },
  { id: 'boot-insel', kind: 'landmark', variant: 'boot', x: 15, y: 52, w: 2, h: 1, requires: 'inselOffen' },
];
