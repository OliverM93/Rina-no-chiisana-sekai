/**
 * Datenformat für Bewohner. Neue Bewohner = neue Datei in diesem Ordner
 * + Eintrag in `index.ts`.
 */
import type { Appearance } from '../../core/appearance';
import type { DialogueLine } from '../../core/dialogue';
import type { GiftReaction, Preferences } from '../../core/friendship';
import type { ScheduleEntry } from '../../core/schedule';

export interface LetterTemplate {
  id: string;
  subject: string;
  body: string;
  gift?: { itemId: string; count: number };
}

export interface NpcDef {
  id: string;
  name: string;
  /** Kurzbeschreibung (Doku/Fehlersuche) */
  personality: string;
  appearance: Appearance;
  /** Objekt-ID des eigenen Hauses */
  home: string;
  /** zieht erst ein, wenn dieses Story-Flag gesetzt ist */
  movesIn?: string;
  /** An diesen Tagen ist sie/er verreist (nicht im Dorf) */
  away?: (day: string) => boolean;
  schedule: readonly ScheduleEntry[];
  preferences: Preferences;

  dialogue: {
    /** Erstes Gespräch des Tages */
    greetings: readonly DialogueLine[];
    /** Plaudern (beliebig oft) */
    chat: readonly DialogueLine[];
    /** Reaktion auf Geschenke nach Kategorie */
    gifts: Record<GiftReaction, readonly (readonly string[])[]>;
    /** Besondere Reaktionen auf bestimmte Gegenstände */
    giftsByItem: Readonly<Record<string, readonly string[]>>;
    /** Zweites Geschenk am selben Tag */
    giftRepeat: readonly string[];
    /** Neues Herz erreicht */
    heartUp: readonly (readonly string[])[];
    /** Klopfen am Haus, wenn sie drinnen ist */
    atHome: readonly (readonly string[])[];
    atHomeSleeping: readonly (readonly string[])[];
    /** Verabschiedung im Auswahlmenü */
    goodbye: readonly string[];
  };

  /** Kleines Geschenk beim ersten Gespräch mancher Tage */
  dailyTreat?: { itemId: string; chance: number; lines: readonly string[] };

  /** Briefe: zufällig alle paar Tage */
  letters: readonly LetterTemplate[];
  /** Briefe mit Geschenk bei Erreichen eines Herzens */
  heartLetters: Readonly<Record<number, LetterTemplate>>;
}
