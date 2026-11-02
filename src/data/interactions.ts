/**
 * Texte für Dinge, mit denen Lina in der Welt interagieren kann.
 *
 * Jede Interaktion liefert – abhängig von Tageszeit, Jahreszeit usw. –
 * eine Liste von Textzeilen, die nacheinander im Dialogfenster erscheinen.
 * `{dorf}` wird automatisch durch den Dorfnamen ersetzt.
 */
import type { DayMonth, DayPhase, Season } from '../core/time';
import { isSameDayMonth, WEEKDAYS } from '../core/time';

export interface InteractionContext {
  now: Date;
  season: Season;
  phase: DayPhase;
  villageName: string;
  birthday: DayMonth;
  /** Reproduzierbarer Wert 0..1 pro Tag – für abwechslungsreiche Texte. */
  dayRandom: number;
}

export interface Interaction {
  /** Optionaler Titel (z. B. ein Schildname) */
  title?: string;
  lines: (ctx: InteractionContext) => string[];
}

const isNight = (ctx: InteractionContext) => ctx.phase === 'nacht' || ctx.phase === 'abenddaemmerung';

/** Wählt pro Tag eine Variante aus. */
const daily = <T>(ctx: InteractionContext, variants: T[]): T =>
  variants[Math.floor(ctx.dayRandom * variants.length) % variants.length];

export const INTERACTIONS: Record<string, Interaction> = {
  'haus-lina': {
    title: 'Linas Häuschen',
    lines: (ctx) => {
      if (isNight(ctx)) {
        return [
          'Dein kleines Häuschen. Hinter den Fenstern brennt ein warmes Licht. 🏡',
          'Drinnen stehen noch die Umzugskartons … aber bald wird es hier richtig gemütlich!',
        ];
      }
      return [
        'Dein kleines Häuschen in {dorf}. 🏡',
        daily(ctx, [
          'Drinnen stapeln sich noch die Umzugskartons. Bald kannst du alles liebevoll einrichten!',
          'Die Tür klemmt noch ein bisschen. Ein paar Kartons wollen erst noch ausgepackt werden …',
          'Du schnupperst: Es riecht nach frischer Farbe und Abenteuer.',
        ]),
      ];
    },
  },

  'briefkasten-lina': {
    title: 'Briefkasten',
    lines: (ctx) => [
      'Dein Briefkasten ist noch leer.',
      daily(ctx, [
        'Aber wer weiß – vielleicht schreibt dir bald jemand? ✉️',
        'Du klappst das Fähnchen hoch und wieder runter. Klick, klack! Macht Spaß.',
        'Auf dem Deckel sitzt ein Marienkäfer und schaut dich an. 🐞',
      ]),
    ],
  },

  'bauplatz-1': {
    title: 'Bauplatz',
    lines: () => [
      '„Bauplatz – hier ist noch Platz für ein neues Häuschen.“',
      'Ob hier wohl bald jemand einzieht, den du gut kennst? 💕',
    ],
  },

  'bauplatz-2': {
    title: 'Bauplatz',
    lines: () => [
      '„Bauplatz – reserviert.“',
      'Jemand hat ein kleines Wollknäuel und eine Keksdose an den Schildrand gemalt …',
    ],
  },

  'bauplatz-3': {
    title: 'Bauplatz',
    lines: () => [
      '„Bauplatz – reserviert.“',
      'Darunter klebt ein Zettel mit sauber gezogenen Linien: „Bitte ordnungsgemäß freihalten.“ 📎',
    ],
  },

  'schwarzes-brett': {
    title: 'Schwarzes Brett',
    lines: (ctx) => {
      const lines = [`📌 Schwarzes Brett von {dorf}`];
      if (isSameDayMonth(ctx.now, ctx.birthday)) {
        lines.push('Ganz groß in Glitzerschrift: „Alles Liebe zum Geburtstag, Lina! 🎂🎈“');
      }
      lines.push('„Herzlich willkommen, Lina! Schön, dass du da bist.“');
      lines.push(
        daily(ctx, [
          `Darunter steht: „Heute ist ${WEEKDAYS[ctx.now.getDay()]} – ein guter Tag für einen Spaziergang!“`,
          '„Gesucht: Menschen, die {dorf} noch gemütlicher machen. Bewerbung nicht nötig.“',
          '„Tipp: Am Strand soll es abends wunderschöne Sonnenuntergänge geben.“',
          '„Fundsache: ein einzelner Socke. Bitte beim Brunnen abholen.“',
        ]),
      );
      return lines;
    },
  },

  brunnen: {
    title: 'Dorfbrunnen',
    lines: (ctx) =>
      isNight(ctx)
        ? ['Im dunklen Wasser spiegeln sich die Sterne. ✨', 'Du wünschst dir ganz leise etwas.']
        : [
            'Das Wasser plätschert fröhlich vor sich hin.',
            daily(ctx, [
              'Du wirfst in Gedanken eine Münze hinein und wünschst dir etwas. ✨',
              'Ein kleiner Vogel nimmt am Brunnenrand ein Bad. Wie niedlich!',
              'Das Plätschern macht ganz ruhig im Kopf.',
            ]),
          ],
  },

  'bank-platz': {
    title: 'Bank',
    lines: (ctx) => [
      'Du setzt dich kurz hin und schaust dem Treiben auf dem Dorfplatz zu.',
      ctx.season === 'herbst' ? 'Ein buntes Blatt segelt dir auf den Schoß. 🍂' : 'Herrlich entspannt. 🍃',
    ],
  },

  'bank-strand': {
    title: 'Bank',
    lines: (ctx) =>
      ctx.phase === 'abend' || ctx.phase === 'abenddaemmerung'
        ? ['Du setzt dich und schaust aufs Meer. Der Himmel färbt sich rosa und orange. 🌅']
        : ['Du setzt dich und lauschst dem Rauschen der Wellen. 🌊'],
  },

  'bank-wiese': {
    title: 'Bank',
    lines: () => ['Du setzt dich zwischen die Blumen. Es summt und brummt überall. 🌼'],
  },
};

/** Ersetzt Platzhalter wie `{dorf}`. */
export function fillPlaceholders(text: string, ctx: InteractionContext): string {
  return text.replaceAll('{dorf}', ctx.villageName);
}
