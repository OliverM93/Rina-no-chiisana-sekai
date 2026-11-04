/**
 * Linas Fernseher: vier Sender mit ausgedachten Sendungen im Stil ihrer
 * Lieblingsformate (keine echten Sendungsnamen). Jeden Tag läuft pro Sender
 * eine andere Folge (reproduzierbar). Ist Oli zu Hause, schaut er mit.
 *
 * Die Doku begleitet Menschen respektvoll und warmherzig – nie spöttisch.
 */

export interface TvEpisode {
  title: string;
  lines: readonly string[];
  /** Kochshow: diese Folge bringt ein Rezept bei */
  recipe?: string;
}

export interface TvChannel {
  id: string;
  name: string;
  show: string;
  /** Bildschirm: Farben + Symbol */
  colors: readonly [string, string];
  icon: string;
  episodes: readonly TvEpisode[];
  /** Was Oli dazu sagt (wenn er mitschaut) */
  oli: readonly string[];
}

export const TV_CHANNELS: readonly TvChannel[] = [
  {
    id: 'herzklopfen',
    name: 'Kanal Herzklopfen',
    show: 'Blind Date am Leuchtturm',
    colors: ['#f4a3b8', '#e85a8a'],
    icon: '💘',
    episodes: [
      { title: 'Bernd & Bärbel', lines: ['Bernd (54, Schrebergärtner) wartet nervös am Tisch. Er hat Rosen mitgebracht. Aus seinem Garten. Mit Erde dran.', 'Bärbel (52) kommt rein: „Oh! Sind das … Rosen mit Wurzeln?“ – „Damit sie länger halten!“', 'Am Ende: Sie wollen sich wiedersehen. Im Schrebergarten. 💕'] },
      { title: 'Kevin & Jacqueline', lines: ['Kevin (27) erzählt beim Vorspeisenteller 20 Minuten über sein Auto.', 'Jacqueline (26) gähnt. Dann stellt sich raus: Sie schraubt auch an Autos!', 'Die beiden reden bis Mitternacht über Zündkerzen. Die Kellnerin wischt schon die Tische. 💘'] },
      { title: 'Helga & Heinz', lines: ['Helga (78) und Heinz (81) sind beide verwitwet und ein bisschen aufgeregt.', '„Ich tanze gern“, sagt Helga. „Ich auch!“, sagt Heinz. „Aber nur langsam. Wegen der Hüfte.“', 'Zum Schluss tanzen sie am Leuchtturm. Ganz langsam. Die Kamera wackelt, weil der Kameramann weint. 🥹'] },
      { title: 'Marvin & Lea', lines: ['Marvin (31) bestellt für beide – ohne zu fragen. Lea (29) zieht eine Augenbraue hoch.', '„Ich hätte gern selbst bestellt.“ – Marvin: „Oh. Ja. Entschuldige!“ Er lernt schnell.', 'Am Ende: Freunde. „Er war nett, aber kein Kribbeln.“ Ehrlich und fair. 👍'] },
    ],
    oli: ['Oli: „Lini, wir waren beim ersten Date viel nervöser als die. Weißt du noch? Ich hab meinen Kaffee umgekippt.“', 'Oli: „Ich wette, die zwei sehen sich wieder. Wetteinsatz: ein Rührei.“', 'Oli: „Wenn der jetzt nicht fragt, ob sie sich wiedersehen, schrei ich den Fernseher an.“'],
  },
  {
    id: 'doku',
    name: 'Doku-Kanal',
    show: 'Großer Weg – Mein neues Leben',
    colors: ['#9ad8c0', '#4f9a7a'],
    icon: '🌱',
    episodes: [
      { title: 'Ronny, 280 Kilo', lines: ['Ronny (38) wiegt 280 Kilo. Treppen sind für ihn ein großes Hindernis, und er wünscht sich, mit seiner Tochter in den Zoo zu gehen.', 'Schritt für Schritt: Ernährungsberatung, Physiotherapie, viel Unterstützung von der Familie. Es gibt gute und schwere Tage.', 'Nach einem Jahr steht er vor dem Elefantengehege – mit seiner Tochter an der Hand. Lina hat Tränen in den Augen. 🥲'] },
      { title: 'Sabine, 230 Kilo', lines: ['Sabine (45) traut sich seit Jahren kaum aus dem Haus. Sie erzählt offen, wie sehr sie sich geschämt hat.', 'Eine Ärztin begleitet sie, eine Therapeutin hilft ihr mit dem Kopf – „denn das Gewicht ist nur ein Teil der Geschichte“.', 'Am Ende geht sie zum ersten Mal seit zehn Jahren schwimmen. Sie lacht im Wasser wie ein Kind. 💚'] },
      { title: 'Die Brüder Krüger', lines: ['Die Brüder Dennis und Marco (zusammen über 500 Kilo) wollen es gemeinsam schaffen.', 'Sie kochen jetzt zusammen – Gemüse statt Fertigpizza. „Schmeckt sogar!“, sagt Marco überrascht.', 'Nach acht Monaten fahren sie zusammen Fahrrad. Langsam. Aber sie fahren. 🚲'] },
      { title: 'Wiedersehen mit Ronny', lines: ['Zwei Jahre später: Ronny hat viel geschafft, aber es gab auch Rückschläge.', '„Das Wichtigste ist, nicht aufzugeben – und sich nicht dafür zu hassen, wenn’s mal nicht klappt.“', 'Er arbeitet jetzt selbst als Mutmacher in einer Selbsthilfegruppe. Lina klatscht vor dem Fernseher. 👏'] },
    ],
    oli: ['Oli: „Respekt. Das ist so viel härter als jedes Training im Gym.“', 'Oli: „Ich find’s toll, dass die Familie so hinter ihm steht.“', 'Oli: „Lini … du weinst ja. Komm her.“ *reicht Taschentuch*'],
  },
  {
    id: 'krimi',
    name: 'Krimikanal',
    show: 'Wahre Fälle vom Land',
    colors: ['#3a3a54', '#8a8ab8'],
    icon: '🔍',
    episodes: [
      { title: 'Der verschwundene Gartenzwerg', lines: ['Ein Dorf in Niedersachsen, 1998. Über Nacht verschwinden 14 Gartenzwerge. Spurlos.', 'Monate später kommen Postkarten – aus Paris, Rom, New York. Auf jeder: ein Zwerg vor einer Sehenswürdigkeit.', 'Der Täter wurde nie gefasst. Lina hat einen Verdacht. Er reist gern und ist ein bisschen fabelhaft … 🤔'] },
      { title: 'Das Rätsel der Kuchenplatte', lines: ['Kaffeekränzchen, 15:02 Uhr: Der Käsekuchen ist da. 15:09 Uhr: Er ist weg.', 'Sechs Verdächtige, alle mit Krümeln am Mund. Die Ermittlerin: „Das macht es nicht leichter.“', 'Auflösung: Es war der Hund. Natürlich war es der Hund. Winston guckt verdächtig weg. 🐶'] },
      { title: 'Der Mann, der nicht da war', lines: ['Ein echter Klassiker: Ein Mann meldet sich als vermisst – bei der Polizei. Persönlich.', 'Die Beamten sind verwirrt. Er auch. Stunden vergehen.', 'Am Ende stellt sich raus: Er wollte nur nicht zum Geburtstag seiner Schwiegermutter. Lina lacht laut. 😂'] },
      { title: 'Die Spur im Schnee', lines: ['Winter, ein abgelegener Hof. Fußspuren führen zum Hühnerstall – aber nicht wieder hinaus.', 'Die Kommissarin folgt der Spur. Spannende Musik. Lina hält sich ein Kissen vors Gesicht.', 'Im Stall: der Nachbar, der heimlich die Hühner füttert, weil sie ihm leidtun. Happy End. 🐔'] },
    ],
    oli: ['Oli: „Ich hab ja gleich gesagt, dass es der Nachbar war.“ – Hat er nicht.', 'Oli: „Lini, du ermittelst schon wieder mit, oder? Ich seh’s an deinem Blick.“', 'Oli: „Wenn wir mal verschwinden, weiß ich genau, dass du uns findest. Mit deinem True-Crime-Wissen.“'],
  },
  {
    id: 'kochen',
    name: 'Kochkanal',
    show: 'Kochen mit Herz',
    colors: ['#f7d26a', '#e8873a'],
    icon: '🍳',
    episodes: [
      { title: 'Apfelpfannkuchen wie bei Oma', recipe: 'apfelpfannkuchen', lines: ['Heute: fluffige Apfelpfannkuchen! Zwei Eier, ein Apfel, eine Prise Liebe.', 'Der Koch wendet den Pfannkuchen in der Luft. Er landet … fast in der Pfanne.', 'Lina schreibt mit. Das muss sie unbedingt nachkochen! 📝'] },
      { title: 'Fischsuppe mit Minze', recipe: 'fischsuppe', lines: ['Eine leichte Fischsuppe mit frischer Pfefferminze. Klingt komisch, schmeckt himmlisch.', '„Ein Barsch aus dem Fluss, ein Zweig Minze aus dem Garten – mehr braucht’s nicht!“', 'Lina: „Die mach ich morgen für Oli.“ 📝'] },
      { title: 'Blumige Salatschüssel', recipe: 'blumensalat', lines: ['Essbare Blüten! Sonnenblumenblätter und Vergissmeinnicht machen den Salat bunt.', 'Die Moderatorin: „Wir essen mit den Augen zuerst!“', 'Lina guckt auf ihr Beet. Da wächst ja schon alles … 📝'] },
    ],
    oli: ['Oli: „Lini, das kochen wir am Wochenende. Ich schneide, du würzt. Teamwork!“', 'Oli: „Ich hab jetzt Hunger. Kannst du bitte das Kochen ausschalten und uns was kochen?“', 'Oli: „Deins schmeckt bestimmt besser als das im Fernsehen.“'],
  },
];

export const TV_BY_ID: Readonly<Record<string, TvChannel>> = Object.fromEntries(TV_CHANNELS.map((c) => [c.id, c]));
