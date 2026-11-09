/**
 * Herzenswünsche der Bewohner – das Spätspiel nach dem letzten Einzug (Game Design W1, siehe
 * `docs/game-design/IMPROVEMENTS.md`).
 *
 * Sind alle eingezogen, hat jeder Bewohner einen kleinen Wunsch für das Dorf. Lina erfüllt ihn mit dem,
 * was sie ohnehin sammelt, fängt und anbaut – ohne Frist, ohne Reihenfolge, ohne Liste, die drängt. Ist
 * ein Wunsch erfüllt, verändert sich das Dorf sichtbar: Ein neuer Ort erscheint auf der Karte
 * (`VILLAGE_OBJECTS` mit `requires: wishFlag(id)`).
 *
 * Neue Wünsche: hier eintragen (mehrere je Bewohner gehen nacheinander, `order`), Ort in
 * `data/maps/village.ts` ergänzen, Modell in `world3d/models/landmarks.ts`, Text zum Ansehen in
 * `data/interactions.ts`.
 */

/** Was für einen Wunsch gebraucht wird. Genau eins von `item`, `species`, `category`. */
export interface WishNeed {
  /** genau dieser Gegenstand */
  item?: string;
  /** jede Farbe dieser Blumenart (z. B. 'rose' → auch rosa, gelbe, schwarze Rosen) */
  species?: string;
  /** jeder Gegenstand dieser Kategorie (z. B. 'fisch') */
  category?: string;
  count: number;
  /** Anzeige, z. B. „Rosen (jede Farbe)“ */
  label: string;
}

export interface WishDef {
  id: string;
  npc: 'gisela' | 'olaf' | 'christin' | 'oli' | 'jens' | 'lars' | 'thalia';
  /** Reihenfolge, falls ein Bewohner mehrere Wünsche hat */
  order: number;
  title: string;
  /** Der Bewohner erzählt vom Wunsch (beim ersten Nachfragen) */
  intro: readonly string[];
  /** Beim erneuten Nachfragen, solange noch etwas fehlt */
  reminder: readonly string[];
  needs: readonly WishNeed[];
  /** Sternchen, die Lina dazugibt (Dorf-Projekt) */
  stars?: number;
  /** Danke-Szene beim Erfüllen */
  done: readonly string[];
  /** Kartenobjekt, das danach erscheint */
  place: string;
}

/** Story-Flag eines erfüllten Wunsches (steuert auch das Kartenobjekt) */
export const wishFlag = (id: string) => `wunsch-${id}`;
/** Flag: Der Bewohner hat Lina von diesem Wunsch erzählt */
export const wishToldFlag = (id: string) => `wunsch-erzaehlt-${id}`;
/** Ab hier gibt es Herzenswünsche (alle sind eingezogen) */
export const WISHES_UNLOCK_FLAG = 'thaliaBegruesst';
/** Freundschaft für einen erfüllten Wunsch */
export const WISH_FRIENDSHIP = 30;

export const WISHES: readonly WishDef[] = [
  {
    id: 'oma-beet',
    npc: 'gisela',
    order: 1,
    title: 'Ein Blumenbeet vor Omas Haus',
    intro: [
      'Weißt du, Kind … Ludwig hat mir früher jeden Sonntag Vergissmeinnicht mitgebracht. Und zum Hochzeitstag Rosen.',
      'Ich hätte so gern ein kleines Blumenbeet vor meinem Haus. Mit Rosen und Vergissmeinnicht. Dann sitz ich auf meiner Bank und denk an ihn.',
      'Fünf Rosen, fünf Vergissmeinnicht und ein paar Wildblumen für die Lücken. Aber nur, wenn du Zeit hast! Ich lauf ja nicht weg.',
    ],
    reminder: ['Mein Blumenbeet? Ach, lass dir Zeit, Kindchen. Gut Ding will Weile haben.'],
    needs: [
      { species: 'rose', count: 5, label: 'Rosen (jede Farbe)' },
      { species: 'vergissmeinnicht', count: 5, label: 'Vergissmeinnicht (jede Farbe)' },
      { item: 'wildblumen', count: 3, label: 'Wildblumensträuße' },
    ],
    done: [
      'Oh … Lina. Das ist ja wunderschön.',
      'Rosen und Vergissmeinnicht. Ludwig hätte gesagt: „Gisela, das hast du schön gemacht.“ Und ich hätte gesagt: „Das war die Kleine.“',
      'Danke, mein Schatz. Jetzt hab ich auf meiner Bank die beste Aussicht im ganzen Dorf. Keine Widerrede!',
    ],
    place: 'beet-gisela',
  },
  {
    id: 'olaf-steg',
    npc: 'olaf',
    order: 1,
    title: 'Ein Angelsteg am Fluss',
    intro: [
      'Lina, ich hab ein Projekt durchgerechnet. Ein Angelsteg am Fluss! Christin und ich könnten von da aus angeln – und du natürlich auch.',
      'Material: 20 Äste, 10 Kieselsteine für das Fundament. Und 3.000 Sternchen für Nägel, Bretter und Lack.',
      'Die andere Hälfte übernimmt die Dorfkasse. Steuerlich ist das quasi eine Investition in die Infrastruktur!',
    ],
    reminder: ['Der Steg läuft nicht weg, mein Schatz. Der Fluss auch nicht. Ich hab nachgeschaut.'],
    needs: [
      { item: 'ast', count: 20, label: 'Äste' },
      { item: 'stein', count: 10, label: 'Kieselsteine' },
    ],
    stars: 3000,
    done: [
      'Fertig! Ein echter Angelsteg. Ich hab ihn persönlich abgenommen. Mit Wasserwaage.',
      'Von der Spitze aus kannst du jetzt mitten im Fluss angeln. Christin sagt, ich soll nicht reinfallen. Ich sage: Das ist eingeplant.',
      'Danke, Lina. Du bist die beste Investition, die ich je gemacht hab. Und ich hab viele gemacht. Bausparvertrag, zum Beispiel.',
    ],
    place: 'angelsteg',
  },
  {
    id: 'christin-kraeuter',
    npc: 'christin',
    order: 1,
    title: 'Eine Kräuterspirale vor Olafs Haus',
    intro: [
      'Lina, ich hab eine Idee. Eine Kräuterspirale vor unserem Haus! Aus Steinen gelegt, und jede Kräutersorte bekommt ihren eigenen Platz.',
      'Ordentlich, schön anzusehen – und man hat immer frische Kräuter beim Kochen.',
      'Ich bräuchte je drei Basilikum, Thymian, Schnittlauch und Petersilie aus deinem Beet. Und zehn Kieselsteine. Die Samen gibt es an meinem Stand.',
    ],
    reminder: ['Die Kräuterspirale? Kein Stress, Lina. Hauptsache, nachher steht alles schön in Reih und Glied.'],
    needs: [
      { item: 'basilikum', count: 3, label: 'Basilikum' },
      { item: 'thymian', count: 3, label: 'Thymian' },
      { item: 'schnittlauch', count: 3, label: 'Schnittlauch' },
      { item: 'petersilie', count: 3, label: 'Petersilie' },
      { item: 'stein', count: 10, label: 'Kieselsteine' },
    ],
    done: [
      'Da ist sie. Jede Sorte an ihrem Platz. Basilikum unten, Thymian oben, wo’s trocken ist.',
      'Ich weiß, ich weiß – ich hab sie dreimal nachgemessen. Aber schau doch, wie schön gleichmäßig!',
      'Danke, Lina. Und du darfst dir jederzeit etwas pflücken. Nur bitte ordentlich.',
    ],
    place: 'kraeuterspirale',
  },
  {
    id: 'oli-bank',
    npc: 'oli',
    order: 1,
    title: 'Eine Bank am Strand – nur für uns',
    intro: [
      'Lini … ich hab mir was überlegt. Eine Bank am Strand. Nur für uns zwei. Mit einem Herz in der Lehne.',
      'Da könnten wir sitzen und aufs Meer gucken. Oder Sonnenuntergang. Oder einfach gar nichts machen, zusammen.',
      'Ich bräuchte zehn Äste, drei Herzmuscheln für die Lehne – und eine Rose. Die ist nicht für die Bank. Die ist für dich. Also, eigentlich von dir. Ach, du weißt schon.',
    ],
    reminder: ['Unsere Bank? Ich hab schon den perfekten Platz ausgesucht. Wir haben alle Zeit der Welt, Lini.'],
    needs: [
      { item: 'ast', count: 10, label: 'Äste' },
      { item: 'herzmuschel', count: 3, label: 'Herzmuscheln' },
      { species: 'rose', count: 1, label: 'Rose (jede Farbe)' },
    ],
    done: [
      'Fertig! Unsere Bank. Schau, das Herz aus Muscheln in der Lehne.',
      'Ich hab unten was eingeritzt. „L + O“. Ganz klein. Damit es nur wir wissen.',
      'Komm, wir setzen uns gleich mal drauf. Ich liebe dich, Lini. 💕',
    ],
    place: 'herzbank',
  },
  {
    id: 'jens-aquarium',
    npc: 'jens',
    order: 1,
    title: 'Ein Aquarium vor dem Bistro',
    intro: [
      'Ma chérie, ich hab in Lissabon ein Café gesehen – mit einem Aquarium vor der Tür! Die Gäste schauen den Fischen zu und vergessen die Zeit.',
      'So was will ich auch! Mit Fischen aus unserem Dorf. Du bist doch die beste Anglerin weit und breit.',
      'Drei Fische, egal welche – und ein Seestern als Deko. Nu, das wird schick! Gell?',
    ],
    reminder: ['Mein Aquarium! Ich hab schon den Platz freigeräumt. Kein Stress, chérie – die Fische schwimmen ja noch.'],
    needs: [
      { category: 'fisch', count: 3, label: 'Fische (jede Art)' },
      { item: 'seestern', count: 1, label: 'Seestern' },
    ],
    done: [
      'Magnifique! Schau sie dir an, wie sie schwimmen!',
      'Ich hab ihnen schon Namen gegeben. Der große heißt Gérard. Die anderen auch. Ich konnte mich nicht entscheiden.',
      'Merci, ma chérie. Jetzt ist das Bistro komplett. Na ja – fast. Kunst geht ja immer noch.',
    ],
    place: 'aquarium-jens',
  },
  {
    id: 'lars-insekten',
    npc: 'lars',
    order: 1,
    title: 'Ein Insektenhotel an der Praxis',
    intro: [
      'Schwesterherz, ich hab einen neuen Patientenkreis entdeckt: Wildbienen. Die brauchen dringend eine Unterkunft.',
      'Ein Insektenhotel neben der Praxis! Aus Ästen, Steinen und ein paar Blumen davor.',
      'Zehn Äste, fünf Kieselsteine, drei Wildblumensträuße – und zwei Krabbeltiere als Erstbewohner. Damit die anderen sehen: Hier ist was los.',
    ],
    reminder: ['Das Insektenhotel? Die Bienen haben schon angefragt. Aber Bienen sind geduldig. Na ja, meistens.'],
    needs: [
      { item: 'ast', count: 10, label: 'Äste' },
      { item: 'stein', count: 5, label: 'Kieselsteine' },
      { item: 'wildblumen', count: 3, label: 'Wildblumensträuße' },
      { category: 'insekt', count: 2, label: 'Krabbeltiere (jede Art)' },
    ],
    done: [
      'Perfekt! Ein Fünf-Sterne-Hotel für Insekten. Mit Blumen-Frühstück.',
      'Die Erstbewohner haben sofort eingecheckt. Keine Beschwerden bisher.',
      'Danke, Lina. Ab sofort bin ich nicht nur Hausarzt, sondern auch Hotelier. So, und nicht mit „Hotel-Tier“ – das wäre was anderes.',
    ],
    place: 'insektenhotel',
  },
  {
    id: 'thalia-aussicht',
    npc: 'thalia',
    order: 1,
    title: 'Ein Aussichtspunkt mit Fernrohr',
    intro: [
      'Lina! Von der Wiese hinter meinem Haus sieht man fast bis zum Meer. Da gehört ein Aussichtspunkt hin! Mit Fernrohr!',
      'Nachts kann man damit Sterne gucken, tagsüber Schiffe. Und eine kleine Tafel mit Fundstücken aus der Gegend.',
      'Ich bräuchte 15 Kieselsteine, 10 Äste, einen Glitzerstein für die Spitze, zwei Funde für die Tafel – und 2.000 Sternchen fürs Fernrohr. Gute Optik ist teuer!',
    ],
    reminder: ['Der Aussichtspunkt! Ich hab den Platz schon kartiert. Er wartet auf uns. Plätze sind sehr geduldig.'],
    needs: [
      { item: 'stein', count: 15, label: 'Kieselsteine' },
      { item: 'ast', count: 10, label: 'Äste' },
      { item: 'glitzerstein', count: 1, label: 'Glitzerstein' },
      { category: 'fossil', count: 2, label: 'Funde (Fossilien oder Kristalle)' },
    ],
    stars: 2000,
    done: [
      'Er steht! Unser Aussichtspunkt!',
      'Schau mal durchs Fernrohr. Tagsüber siehst du die Wellen, nachts die Sterne. Und ganz links, wenn du dich anstrengst: Omas Bank.',
      'Danke, Lina. Das ist jetzt offiziell der schönste Ort auf meiner Karte. Gleich nach deinem Haus.',
    ],
    place: 'aussichtspunkt',
  },
];

export const WISH_BY_ID: Readonly<Record<string, WishDef>> = Object.fromEntries(WISHES.map((w) => [w.id, w]));

/** Omas Brief, sobald alle eingezogen sind: Es gibt Herzenswünsche */
export const WISH_LETTER = {
  id: 'herzenswuensche',
  subject: 'Herzenswünsche',
  body:
    'Liebe Lina,\n\njetzt sind wir alle hier. Wer hätte das gedacht! Das Dorf ist voll – und mein Herz auch.\n\n' +
    'Ich hab mir sagen lassen, dass jeder hier noch so einen kleinen Herzenswunsch hat. Ich auch, ehrlich gesagt.\n\n' +
    'Frag doch mal nach, wenn du jemanden triffst. Ganz ohne Eile. Wünsche haben Zeit.\n\nDeine Oma',
} as const;
