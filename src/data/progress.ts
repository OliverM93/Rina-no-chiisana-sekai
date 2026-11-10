/**
 * Meilensteine der Rahmenhandlung: Wer zieht als Nächstes ein, und was muss Lina dafür
 * im Spiel getan haben? Nach dem Meilenstein kommt der Ankündigungsbrief, nach kurzer
 * Spielzeit (`WAIT_SECONDS`) der Einzug. Echte Tage spielen dafür keine Rolle mehr.
 *
 * `hintBy` gibt im Gespräch sanfte Hinweise, was noch fehlt – kein Aufgabenzettel.
 */
import type { Need, NeedKind } from '../core/progress';

export interface Milestone {
  /** Bewohner, der einzieht (und den Brief schreibt) */
  npc: 'olaf' | 'oli' | 'jens' | 'lars' | 'thalia';
  /** Erst danach zählt dieser Meilenstein (Story-Flag) */
  after: string;
  needs: readonly Need[];
  /** Wer im Gespräch Hinweise gibt */
  hintBy: string;
  /** Hinweis je fehlender Bedingung ({dorf} wird ersetzt) */
  hints: Partial<Record<NeedKind, readonly string[]>>;
  /** Hinweise für einzelne Flag-Bedingungen (gehen vor `hints.flag`), z. B. wenn ein Meilenstein zwei Flags braucht */
  flagHints?: Readonly<Record<string, readonly string[]>>;
}

/** Abgeleitetes Flag: Lina hat den ersten Hausausbau bestellt (Dorfkasse) – siehe `game/progress.ts` */
export const FLAG_AUSBAU_BESTELLT = 'ausbauBestellt';

export const MILESTONES: readonly Milestone[] = [
  {
    npc: 'olaf',
    after: 'toolsGiven',
    needs: [
      { kind: 'sammelbuch', n: 3 },
      { kind: 'verkauft', n: 200 },
      { kind: 'flag', n: 1, flag: 'winstonGefunden' },
    ],
    hintBy: 'gisela',
    hints: {
      flag: ['Hörst du das auch, Kind? Dieses leise Fiepen von der Wiese hinter deinem Haus?', 'Geh doch mal nachsehen. Irgendwer braucht Hilfe. Ich hör sowas. Ich hab ein Gehör wie ein Luchs.'],
      sammelbuch: ['Dein Papa ruft mich jeden Abend an, Kind. „Lebt sie sich gut ein?“', 'Fang ihm doch ein paar Fische oder Käfer fürs Sammelbuch. Dann kann ich ihm was erzählen. Er glaubt mir sonst nie.'],
      verkauft: ['Olaf fragt, ob du schon dein eigenes Geld verdienst. Typisch Finanzamt.', 'Leg ein paar Funde in die Verkaufskiste. Dann hat er Ruhe. Und ich auch.'],
    },
  },
  {
    npc: 'oli',
    after: 'olafBegruesst',
    needs: [{ kind: 'gekauft', n: 1 }],
    hintBy: 'olaf',
    hints: {
      gekauft: ['Lina, Oli hat mich angerufen. Er wollte wissen, ob dein Häuschen schon gemütlich ist.', 'Schau doch mal in den Möbelkatalog in deinem Zimmer. Ein bisschen Einrichtung – und ich glaube, da kommt jemand ganz schnell.'],
    },
  },
  {
    npc: 'jens',
    after: 'oliBegruesst',
    needs: [
      { kind: 'gebaut', n: 3 },
      { kind: 'sammelbuch', n: 6 },
    ],
    hintBy: 'oli',
    hints: {
      gebaut: ['Lini, Jens hat geschrieben! Er will wissen, ob du schon was Schönes gebastelt hast.', 'Er sagt, „ein Mensch ohne Handarbeit ist wie ein Croissant ohne Butter“. Ich glaub, die Werkbank wär was.'],
      sammelbuch: ['Jens fragt nach Fotos von den Tieren hier. Er reist so viel und sammelt Naturgeschichten.', 'Noch ein paar Fische oder Insekten fürs Sammelbuch, und er packt bestimmt die Koffer.'],
    },
  },
  {
    npc: 'lars',
    after: 'jensBegruesst',
    needs: [
      { kind: 'gekocht', n: 3 },
      { kind: 'verkauft', n: 5000 },
    ],
    hintBy: 'jens',
    hints: {
      gekocht: ['Ma chérie, dein Bruder hat angerufen. Er macht sich Sorgen, ob du hier auch ordentlich isst.', 'Komm, wir kochen mal was zusammen im Bistro! Dann kann ich ihm sagen: Die Kleine kocht wie eine Göttin.'],
      verkauft: ['Lars meint, eine Praxis im Dorf lohnt sich nur, wenn hier was los ist.', 'Nu, dann zeigen wir ihm das! Verkauf fleißig deine Schätze, damit die Dorfkasse klingelt.'],
    },
  },
  {
    npc: 'thalia',
    after: 'larsBegruesst',
    needs: [
      { kind: 'flag', n: 1, flag: 'checkupDone' },
      // Winter-sicher: Von November bis Februar gibt es nur 10–11 Arten (Test `progress.test.ts`)
      { kind: 'sammelbuch', n: 8 },
      { kind: 'flag', n: 1, flag: FLAG_AUSBAU_BESTELLT },
    ],
    hintBy: 'lars',
    flagHints: {
      [FLAG_AUSBAU_BESTELLT]: [
        'Schwesterherz, Thalia fragt, ob sie bei dir mal übernachten kann, wenn sie zu Besuch ist. Dein Häuschen ist ja eher … kompakt.',
        'Papa macht dir an der Dorfkasse einen Ausbau – zinslos, ohne Frist. Finanzamt-Ehrenwort. Zahlen kannst du, wann du willst.',
      ],
    },
    hints: {
      flag: ['Schwesterherz, Thalia hat mich gefragt, ob du gesund und munter bist.', 'Komm doch mal zum Durchchecken in die Praxis. Dann kann ich ihr sagen: Alles bestens. Medizinisch bestätigt.'],
      sammelbuch: ['Thalia will wissen, was es hier alles zu entdecken gibt. Sie ist ja Geografin.', 'Ein paar Arten mehr im Sammelbuch, und sie steht mit Spaten und Landkarte vor der Tür. Wetten?'],
    },
  },
];
