/**
 * Sträuße als besonderes Geschenk (Nov. 2026): Ein Strauß, den jemand „liebt“, bringt 10 Freundschaftspunkte mehr
 * und eine eigene Dankes-Zeile. Dazu bekommt ab und zu jemand **Lust auf einen bestimmten Strauß** (eine Woche
 * lang, ohne Druck und ohne Ablauf-Strafe) und erzählt es beim Ansprechen; wer ihn schenkt, bekommt noch einmal 10 dazu.
 */

export const BOUQUET_LOVED_BONUS = 10;
export const BOUQUET_WISH_BONUS = 10;
/** An so vielen Wochen hat jemand Lust auf einen Strauß (1 von n) */
export const LUST_EVERY_NTH_WEEK = 4;

export interface StraussLines {
  /** Dank für einen geliebten Strauß */
  thanks: readonly string[];
  /** Ich hätte Lust auf {strauss} … */
  lust: readonly string[];
  /** Dank, wenn es genau der gewünschte Strauß war */
  lustThanks: readonly string[];
}

export const STRAUSS_LINES: Readonly<Record<string, StraussLines>> = {
  gisela: {
    thanks: ['Ein Strauß! Für mich? Das gehört sich so, Kind. Der kommt auf den Tisch, mitten in die Stube.'],
    lust: ['Weißt du, was mir fehlt, Kind? Ein {strauss}. Nur so als Gedanke. Ich sag nichts weiter.'],
    lustThanks: ['Ein {strauss}! Du hast zugehört, Kind. Das ist selten. Das sage ich nicht oft: Danke. 💕'],
  },
  olaf: {
    thanks: ['Blumen! Für mich? Ich weiß gar nicht, wohin damit. Christin weiß es bestimmt.'],
    lust: ['Mir geht ein {strauss} nicht aus dem Kopf. Eine Anschaffung ohne Nutzen und trotzdem sehr verlockend.'],
    lustThanks: ['Der {strauss}! Das ist exakt der, den ich meinte. Wie machst du das? Ich trage ihn unter „Freude“ ein.'],
  },
  christin: {
    thanks: ['So schöne Blumen! Und genau gerade gebunden. Ich stelle sie sofort in die Vase.'],
    lust: ['Ich hätte so Lust auf einen {strauss}. Auf dem Fensterbrett, in der Mitte. Nur so.'],
    lustThanks: ['Ein {strauss}! Genau der. Und er sitzt perfekt. Danke, Lina, das hat mich wirklich gefreut.'],
  },
  oli: {
    thanks: ['Blumen für mich, Lini? Das macht mich ganz verlegen. Ich stell sie ins Fenster.'],
    lust: ['Ich hab Lust auf einen {strauss}. Kein Grund. Nur so, damit es schön aussieht, wenn du heimkommst.'],
    lustThanks: ['Ein {strauss}! Lini, das ist perfekt. Ich stelle ihn dahin, wo wir ihn immer sehen. 💕'],
  },
  jens: {
    thanks: ['Fleurs! Pour moi? Ma chérie, du verwöhnst mich. Ich stelle sie in die schönste Vase des Hauses.'],
    lust: ['Ich träume von einem {strauss}, ma chérie. Fürs Bistro, auf dem Tresen. Nur so eine Idee, nur so!'],
    lustThanks: ['Ein {strauss}! Magnifique! Genau den habe ich gemeint. Du kannst Gedanken lesen!'],
  },
  lars: {
    thanks: ['Blumen! Ärztlich verordnet: gute Laune. Danke, Schwesterherz, die kommen in die Praxis.'],
    lust: ['Wenn mir jemand einen {strauss} schenken würde, ginge es dem Wartezimmer besser. Nur so als Gedanke.'],
    lustThanks: ['Ein {strauss}! Genau der. Ärztlich geprüft und für sehr gut befunden. Danke!'],
  },
  thalia: {
    thanks: ['Blumen! Für mich? Lina, du bist die Beste. Die kommen aufs Sideboard, neben die Platten.'],
    lust: ['Ich hätte so Lust auf einen {strauss}! Das wäre perfekt neben dem Plattenspieler. Nur so.'],
    lustThanks: ['Der {strauss}! Genau der, wie hast du das gewusst? Beste Freundin, ganz klar!'],
  },
};
