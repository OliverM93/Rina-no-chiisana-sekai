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
  /** Kartenobjekt, das danach erscheint (Phase 1); die zweiten Wünsche haben stattdessen `rewardItems` oder `options` */
  place?: string;
  /** Geschenk des Bewohners zum Dank */
  rewardItems?: ReadonlyArray<{ itemId: string; count: number }>;
  /** Rezept, das Lina lernt, sobald der Bewohner von seinem Wunsch erzählt */
  recipe?: string;
  /** Wunsch mit Wahl (z. B. Hawaii oder Japan): Danke-Szene und Geschenk hängen von der Wahl ab */
  options?: ReadonlyArray<{ id: string; label: string; done: readonly string[]; rewardItems: ReadonlyArray<{ itemId: string; count: number }> }>;
}

/** Flag einer gewählten Option */
export const wishOptionFlag = (id: string, option: string) => `wunsch-${id}-${option}`;

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

/**
 * Zweite Runde (Phase 2): persönlichere Wünsche, die mehr als „sammeln“ verlangen – selbst Gemachtes, Gekochtes,
 * Gebasteltes, Gefundenes und Gefeiertes. Kommen nach dem ersten Wunsch des Bewohners (`order: 2`).
 * Belohnung: eine Szene und ein Geschenk (Möbel/Tasse/Buch) statt eines Ortes auf der Karte.
 */
export const WISHES_2: readonly WishDef[] = [
  {
    id: 'oma-likoer',
    npc: 'gisela',
    order: 2,
    title: 'Omas Premium-Eierlikör',
    recipe: 'eierlikoer-premium',
    intro: [
      'Kind, ich hab eine Bitte. Eine kleine. Für den Kaffeeklatsch hätte ich gern ein Likörchen – aber diesmal keinen gekauften.',
      'Ein richtiger Eierlikör, selbst gemacht, mit den Eiern deiner Hühner. Premium, sag ich dir! Ich hab dir das Rezept aufgeschrieben.',
      '(Es ist nur fürs Gespräch. Ich trinke höchstens ein winziges Gläschen. Eins. Vielleicht zwei.)',
    ],
    reminder: ['Mein Likörchen? Lass dir Zeit, Kind. Der Kaffeeklatsch läuft nicht weg. Er ist nur etwas durstig.'],
    needs: [{ item: 'eierlikoer-premium', count: 1, label: 'Premium-Eierlikör (Rezept im Kochstudio / am Herd)' }],
    done: [
      'Na, dann wollen wir mal probieren … Mmh. Hmm. MMH!',
      'Köstlich! Das ist Likör mit Charakter. Dezent – aber mit Haltung. So wie ich.',
      'Ein Gläschen für mich, eins für dich. … Na gut, für dich nur ein Schlückchen. Du bist ja noch ein Kind. Mit zig Jahren.',
      'Das hast du fein gemacht, Kindchen. Und sag keinem, dass ich nachgeschenkt hab.',
    ],
    rewardItems: [{ itemId: 'likoer-set', count: 1 }],
  },
  {
    id: 'olaf-flugzeug',
    npc: 'olaf',
    order: 2,
    title: 'Ein Flugzeugmodell zum Nachbauen',
    intro: [
      'Lina, ich muss dir was gestehen: Ich baue seit Jahren Flugzeugmodelle. Maßstab eins zu zweiundsiebzig. Mit Pinzette. Und viel Geduld.',
      'Ich hab eins im Auge: eine zweimotorige Propellermaschine mit Doppeldecker-Flügeln und Rundmotoren. Ein Prachtstück! Das möchte ich mit dir zusammen bauen.',
      'Wir brauchen zwölf Äste für die Tragflächen, sechs Kiesel als Ballast, zwei Jakobsmuscheln für die Propeller und 600 Sternchen für den Premium-Bausatz. Das ist eine Investition, mein Schatz.',
    ],
    reminder: ['Das Flugzeug? Es steht im Hangar, bildlich gesprochen. Es hat keine Eile. Ich habe die Anleitung schon dreimal gelesen.'],
    needs: [
      { item: 'ast', count: 12, label: 'Äste' },
      { item: 'stein', count: 6, label: 'Kieselsteine' },
      { item: 'jakobsmuschel', count: 2, label: 'Jakobsmuscheln' },
    ],
    stars: 600,
    done: [
      'Und – Fahrwerk eingerastet! Siehst du das? Die Spannweite, die Verstrebungen, die Seilzüge!',
      'Ich habe die Nieten einzeln gesetzt. Okay, aufgemalt. Aber einzeln!',
      'Das Schönste an Flugzeugen: Man muss sie nicht fliegen, um sie zu lieben.',
      'Das hier gehört dir, mein Schatz. Stell es irgendwohin, wo es Aufwind hat. Zum Beispiel auf die Kommode.',
    ],
    rewardItems: [{ itemId: 'modellflugzeug', count: 1 }],
  },
  {
    id: 'christin-volkstanz',
    npc: 'christin',
    order: 2,
    title: 'Ein Volkstanz auf dem Dorfplatz',
    intro: [
      'Lina, Olaf und ich tanzen ja regelmäßig im Tanzverein. Volkstänze. Mit Figuren, Kreuzungen und Takt. Alles hat seine Ordnung.',
      'Ich möchte einmal bei uns im Dorf einen aufführen – auf dem Dorfplatz, mit Blumen und Kuchen. Du darfst mittanzen. Du musst nur den Takt halten.',
      'Dafür bräuchte ich einen bunten Strauß für die Tanzfläche und einen Apfelkuchen für hinterher. Ein Tanz ohne Kuchen ist nur Gymnastik.',
    ],
    reminder: ['Der Volkstanz hat keine Eile, Lina. Wir üben ohnehin noch die Aufstellung. Olaf kennt links und rechts nicht immer genau.'],
    needs: [
      { item: 'strauss-bunt', count: 1, label: 'Bunter Strauß' },
      { item: 'apfelkuchen', count: 1, label: 'Apfelkuchen' },
    ],
    done: [
      'Und – Schritt, Schritt, Drehung, Klatschen! Olaf, du bist links! Links!',
      'Es war nicht perfekt. Olaf hat einmal die Seite gewechselt. Aber es war ordentlich genug.',
      'Der Dorfplatz sieht schön aus, wenn getanzt wird. Danke, Lina. Du darfst ab jetzt immer bei uns mittanzen.',
    ],
  },
  {
    id: 'jens-urlaub',
    npc: 'jens',
    order: 2,
    title: 'Urlaub mit Onkel Jens',
    intro: [
      'Ma chérie, ich hab Fernweh. Und weil Fernweh ansteckend ist, hab ich beschlossen: Du kommst mit!',
      'Zwei Wochen Urlaub. Ich übernehme den Charme, du Flug und Hotel: 1.500 Sternchen. Dazu etwas Reiseproviant, zwei Gerichte, damit wir nicht verhungern.',
      'Und jetzt die große Frage, die ich seit Tagen nicht beantworten kann: Hawaii oder Japan? Du darfst wählen!',
    ],
    reminder: ['Unser Urlaub! Der Koffer steht schon bereit – der Koffer steht immer bereit. Wähl in Ruhe, ma chérie.'],
    needs: [{ category: 'essen', count: 2, label: 'Reiseproviant (zwei Gerichte)' }],
    stars: 1500,
    done: [],
    options: [
      {
        id: 'hawaii',
        label: '🌺 Hawaii',
        done: [
          'Aloha! Blumenketten, Brandung, ein Sonnenuntergang wie von mir gemalt – und ich hab mich sofort verbrannt. Stilvoll natürlich!',
          'Du hast im Meer geplanscht, ich hab Skizzen gemacht. Und ein Kellner hat „Lina“ auf deinen Becher geschrieben. Mit Herz.',
          'Ich hab dir eine Tasse mitgebracht. Und mir ein Hemd gekauft, das nie wieder jemand sehen darf. Merci, ma chérie!',
        ],
        rewardItems: [{ itemId: 'tasse-stadt-honolulu', count: 1 }],
      },
      {
        id: 'japan',
        label: '🗾 Japan',
        done: [
          'Konnichiwa! Du hast tatsächlich ein bisschen Japanisch gesprochen. Ich hab nur genickt und gelächelt. Das reicht meistens.',
          'Tempel, Tee und Rehe, die sich verbeugen. Wir haben stundenlang Matcha getrunken und kein Wort gesagt. Ein Wunder!',
          'Ich hab dir eine Tasse mitgebracht. Arigatō, ma chérie – das war der schönste Urlaub seit Langem.',
        ],
        rewardItems: [{ itemId: 'tasse-stadt-nara', count: 1 }],
      },
    ],
  },
  {
    id: 'lars-wolfram',
    npc: 'lars',
    order: 2,
    title: 'Ein Wolfram-Stein',
    intro: [
      'Schwesterherz, ich hab ein Hobby, über das ich nie rede: Steine. Genauer: Wolframit. Dunkel, schwer, fast schwarz. Sieht aus wie ein verschluckter Schatten.',
      'Thalia sagt, so einen findet man mit der Schaufel – aber sehr, sehr selten. Wenn du einen ausgräbst, bring ihn mir. Ich revanchiere mich, versprochen.',
    ],
    reminder: ['Der Wolframit? Geduld. Das ist Geologie, keine Ungeduld. Er liegt seit Millionen Jahren dort und wartet.'],
    needs: [{ item: 'wolframit', count: 1, label: 'Wolframit (mit der Schaufel ausgraben, selten)' }],
    done: [
      'Wolframit! Wirklich! Wiegt ein Kilo auf zehn Zentimetern. Das ist Physik, kein Zauber.',
      'Weißt du, wofür man Wolfram nimmt? Für Glühfäden, Bohrer, Dartpfeile. Ich nehme ihn für meinen Schreibtisch.',
      'Als Dank bekommst du mein Lieblingsbuch: ein sehr dicker Science-Fiction-Roman über einen Planeten aus Sand und Politik. Lies es im Sessel mit Tee. Und nicht auf den Fuß fallen lassen – ärztlich nicht empfohlen.',
    ],
    rewardItems: [{ itemId: 'buch-sandsterne', count: 1 }],
  },
  {
    id: 'thalia-party',
    npc: 'thalia',
    order: 2,
    title: 'Eine richtig große Party',
    intro: [
      'Lina! Unsere Samstagspartys sind schön, aber ich will eine, über die das Dorf noch in einem Jahr redet. Mit allem: Essen, Blumen, Musik, Lichterketten und einer Discokugel!',
      'Du bringst vier Leckereien mit, einen bunten Strauß für die Tanzfläche und 400 Sternchen für Getränke und Musik. Die Discokugel besorge ich. Ich weiß schon, wo. Frag nicht.',
    ],
    reminder: ['Die Party! Ich hab schon eine Playlist. Und einen Plan B für die Playlist. Und einen Plan C: Oma singt.'],
    needs: [
      { category: 'essen', count: 4, label: 'Leckereien (vier Gerichte)' },
      { item: 'strauss-bunt', count: 1, label: 'Bunter Strauß' },
    ],
    stars: 400,
    done: [
      'Die Lichterketten leuchten! Die Musik läuft! Und da – schau, die Discokugel!',
      'Alle sind gekommen. Sogar Oma. Sogar Olaf. Er hat getanzt. Ich hab es für die Nachwelt festgehalten.',
      'Das war die beste Party aller Zeiten. Und ich hab Erfahrung. Danke, Lina! Die Discokugel gehört dir.',
    ],
    rewardItems: [{ itemId: 'discokugel', count: 1 }],
  },
];

export const WISHES_3: readonly WishDef[] = [
  {
    id: 'thalia-matteo',
    npc: 'thalia',
    order: 3,
    title: 'Ein Brieffreund aus Italien',
    intro: [
      'Lina, ich muss dir was gestehen. Ich hätte gern einen Brieffreund. Genauer: Pater Matteo, Pfarrer in einem Bergdorf in Italien. Er hat in einem Magazin einen Artikel über die Steine seiner Gegend geschrieben – und ich bewundere seine Ausdrucksweise.',
      'Und auf dem Foto zum Artikel sieht er außerdem sehr nett aus. Wissenschaftlich gesehen irrelevant. Aber nicht uninteressant.',
      'Ich möchte ihm ein Päckchen schicken: einen Bergkristall aus unseren Funden, Lavendelkekse und 100 Sternchen für Porto. Aber allein trau ich mich nicht. Hilfst du mir? Du hast die schönere Handschrift.',
    ],
    reminder: ['Der Brief an Pater Matteo? Ich hab schon dreimal angefangen. Und dreimal „Sehr geehrter“ durchgestrichen.'],
    needs: [
      { item: 'bergkristall', count: 1, label: 'Bergkristall' },
      { item: 'lavendelkekse', count: 1, label: 'Lavendelkekse' },
    ],
    stars: 100,
    done: [
      'Wir schreiben gemeinsam. „Sehr geehrter Pater Matteo“ – zu steif. „Lieber Pater Matteo“ – zu vertraut. Wir nehmen „Buongiorno“.',
      'Das Päckchen ist unterwegs! Ich war so nervös, dass ich die Adresse zweimal geschrieben habe. Aber einmal richtig.',
      'Wenn er antwortet, lese ich dir den Brief vor. Mit Betonung. Und mit Wörterbuch.',
    ],
  },
  {
    id: 'oli-kino',
    npc: 'oli',
    order: 2,
    title: 'Mitternachtskino mit Lini',
    intro: [
      'Lini, in der Stadt läuft eine Mitternachtsvorstellung. Ein alter Schwarz-Weiß-Kultfilm, „Das Nebelzimmer“. Von deinem Lieblingsregisseur – du weißt schon, der mit dem Radierkopf auf deinem Pulli.',
      'Ich hab ehrlich gesagt keine Ahnung, worum es geht. Soll ja keiner verstehen. Aber ich würde es so gern mit dir sehen. Du erklärst mir hinterher alles. Oder auch nichts. Das ist ja der Witz.',
      'Zwei Karten und ein bisschen Kinogeld: 120 Sternchen. Und zwei Snacks, die man im Dunkeln leise essen kann. Nicht zu knusprig, bitte. Die Leute zischen sonst.',
    ],
    reminder: ['Das Mitternachtskino? Ich hab schon geguckt – wir kriegen Plätze ganz hinten. Zum Kuscheln. Und zum Nicht-Verstehen.'],
    needs: [{ category: 'essen', count: 2, label: 'Snacks (zwei Gerichte)' }],
    stars: 120,
    done: [
      'Das war … ich habe wirklich kein Wort verstanden. Es gab ein Zimmer, Nebel, einen Mann mit sehr langsamer Stimme und einen Vorhang. Viel Vorhang.',
      'Aber du hast die ganze Zeit gestrahlt. Und ich hab die ganze Zeit dich angeguckt. Das war der beste Film meines Lebens, Lini. 💕',
      'Ich hab uns zur Erinnerung das Plakat mitgenommen. Hängt es irgendwo auf, wo ich es nachts im Vorbeigehen sehe. Dann rätsle ich weiter.',
    ],
    rewardItems: [{ itemId: 'poster-nebelzimmer', count: 1 }],
  },
  {
    id: 'oli-bandshirt',
    npc: 'oli',
    order: 3,
    title: 'Das seltene Tourshirt',
    intro: [
      'Lini, darf ich dir was Nerdiges beichten? Es gibt ein Shirt von NACHTSCHICHT, von der allerletzten Tour. Nur hundert Stück gedruckt. Die Band gibt es nicht mehr. Ich hab es mal in einer Sammlerkiste gesehen und es nicht gekauft. Ich ärgere mich bis heute.',
      'Thalia kennt einen Sammler, der tauscht. Er will einen Bernstein und, na ja, Sammlerpreis: 300 Sternchen. Ich weiß, ich weiß. Ein Shirt. Aber es ist EIN Shirt.',
      'Ich würde es nur zu besonderen Anlässen tragen. Also ungefähr alle paar Tage. Besondere Anlässe gibt es ja ständig.',
    ],
    reminder: ['Das NACHTSCHICHT-Shirt? Ich hab die Größe schon dreimal nachgeprüft. Es ist M. Es war immer M.'],
    needs: [{ item: 'bernstein', count: 1, label: 'Bernstein (zum Tauschen)' }],
    stars: 300,
    done: [
      'Es ist da. Das Shirt. Das echte, von der letzten Tour, mit dem verblichenen Blitz. Es riecht nach Keller und Konzert.',
      'Lini … ich hab ein bisschen geweint. Wegen eines Shirts. Sag es keinem. Und danke. Wirklich. Ich trag es mit Stolz. Und ich wasche es nie wieder heiß.',
    ],
  },
];

export const ALL_WISHES: readonly WishDef[] = [...WISHES, ...WISHES_2, ...WISHES_3];
export const WISH_BY_ID: Readonly<Record<string, WishDef>> = Object.fromEntries(ALL_WISHES.map((w) => [w.id, w]));

/** Omas Brief, sobald alle eingezogen sind: Es gibt Herzenswünsche */
export const WISH_LETTER = {
  id: 'herzenswuensche',
  subject: 'Herzenswünsche',
  body:
    'Liebe Lina,\n\njetzt sind wir alle hier. Wer hätte das gedacht! Das Dorf ist voll – und mein Herz auch.\n\n' +
    'Ich hab mir sagen lassen, dass jeder hier noch so einen kleinen Herzenswunsch hat. Ich auch, ehrlich gesagt.\n\n' +
    'Frag doch mal nach, wenn du jemanden triffst. Ganz ohne Eile. Wünsche haben Zeit.\n\nDeine Oma',
} as const;

/** Volkstanz mit Christin & Olaf (nach Christins zweitem Wunsch): einmal am Tag */
export const FOLKDANCE_POINTS = 10;
export const FOLKDANCE_LINES: readonly (readonly string[])[] = [
  ['Christin zählt an: „Eins, zwei, drei – und Drehung!“ Olaf dreht sich in die richtige Richtung. Meistens.', 'Ihr tanzt im Kreis, klatscht in die Hände und tauscht die Plätze. Es ist erstaunlich ordentlich.'],
  ['„Und Seitenwechsel!“ ruft Christin. Olaf und Lina wechseln. Winston wechselt auch. Aus Prinzip.', 'Am Ende verbeugen sich alle voreinander. Christin nickt anerkennend. Das ist ihr höchstes Lob.'],
  ['Ein neuer Tanz! „Der Schrittwechsel ist leicht“, sagt Christin. Er ist nicht leicht. Aber er macht Spaß.', 'Olaf zählt laut mit. Christin zählt leise mit. Du zählst gar nicht, du tanzt einfach.'],
  ['Christin hakt sich bei dir unter: „Und eine Runde im Kreis!“ Alle drehen sich, die Röcke fliegen, Olaf verliert fast die Brille.', 'Danach gibt es für alle ein Stück Kuchen. Ein Tanz ohne Kuchen ist schließlich nur Gymnastik.'],
];
