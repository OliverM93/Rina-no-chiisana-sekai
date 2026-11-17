/**
 * Gäste in Chez Jens: Bewohner sitzen ab und zu im Café (nicht jeden Tag, nicht jede Stunde), trinken etwas und
 * kommentieren das Café, wenn Lina sie anspricht. Alkohol bleibt dezent und humorvoll, nie glorifizierend.
 * Aussagen nur über das, was im Spiel zu sehen ist (Tische, Tresen, Weinregal, Mosaikboden, Kugellampen).
 */

export interface CafeGuestDef {
  /** Uhrzeiten (von–bis), in denen die Person kommen kann */
  hours: readonly [number, number];
  /** An wie vielen Tagen im Schnitt? (1 von n) */
  everyNthDay: number;
  /** Was sie trinkt (Toast beim Ansprechen) */
  drinks: readonly string[];
  /** Sätze zum Café, abwechselnd */
  comments: readonly (readonly string[])[];
}

export const CAFE_GUESTS: Readonly<Record<string, CafeGuestDef>> = {
  gisela: {
    hours: [14, 15.5],
    everyNthDay: 4,
    drinks: ['☕ Oma Gisela rührt ihren Kaffee. Dreimal links, dreimal rechts.', '🥃 Oma Gisela hat ein winzig kleines Likörchen vor sich stehen. „Medizin“, sagt sie.'],
    comments: [
      ['Der Kaffee ist zu stark. Ich trinke ihn trotzdem. Das muss man erst mal schaffen.', 'Jens kann das. Das sag ich nicht laut.'],
      ['Schöne Tische, Kind. Marmor. Da kann man seine Kuchenkrümel direkt sehen.'],
      ['Gemütlich hier. In Dessau hatten wir sowas nicht. Dafür hatten wir die Kneipe. Aber das ist eine andere Geschichte.'],
    ],
  },
  olaf: {
    hours: [12, 13.5],
    everyNthDay: 4,
    drinks: ['☕ Papa trinkt einen Espresso. Er hat die Tassen schon gezählt.', '☕ Papa löffelt Zucker in den Kaffee. Genau zwei. Natürlich.'],
    comments: [
      ['Mittagspause im Café. Das ist steuerlich nicht absetzbar, aber gut für die Seele.'],
      ['Mein Bruder hat die Tische wirklich ordentlich angeordnet. Das gefällt mir. Das gefällt mir sogar sehr.', 'Ich sag ihm das nicht.'],
      ['Der Mosaikboden hier: sechseckig, präzise gesetzt. Hat bestimmt jemand mit Zollstock gemacht.'],
    ],
  },
  christin: {
    hours: [10, 11.5],
    everyNthDay: 3,
    drinks: ['🍵 Christin trinkt einen Kräutertee und hält die Tasse mit beiden Händen.', '☕ Christin nippt am Milchkaffee. Der Löffel liegt exakt parallel zur Tasse.'],
    comments: [
      ['Hier stehen alle Stühle gerade. Das habe ich sofort bemerkt. Das habe ich sehr gern.'],
      ['Die Kugellampen an der Wand sind ein schöner Rhythmus. Links, rechts, links. Ich könnte stundenlang zuschauen.'],
      ['Ich komme gern hierher. Es ist ordentlich, ohne streng zu sein. Das ist eine seltene Kunst.'],
    ],
  },
  oli: {
    hours: [16, 17.5],
    everyNthDay: 4,
    drinks: ['☕ Oli trinkt einen doppelten Espresso. Er sagt, das sei „Treibstoff“.', '🥤 Oli rührt in einem Eiskaffee. „Dessert und Koffein“, sagt er.'],
    comments: [
      ['Lini, hier läuft so schöne Musik. Und es riecht nach Kaffee und Butter. Ich bleib noch ein bisschen.'],
      ['Die Wandbänke sind echt bequem. Perfekt, um sich in ein Buch zu vergraben. Oder in dich. Aber das ist ja nicht das Thema.'],
      ['Jens hat hier echt was gebaut. Ich komm öfter, wenn du nichts dagegen hast. 💕'],
    ],
  },
  lars: {
    hours: [12.5, 14],
    everyNthDay: 4,
    drinks: ['🍺 Lars hat ein kleines Bier vor sich. „Mittagspause, ärztlich genehmigt.“', '☕ Lars trinkt einen Milchkaffee. „Das ist die gesündere Variante“, sagt er und zwinkert.'],
    comments: [
      ['Wenig Stolperfallen, viele Sitzgelegenheiten. Das nenne ich ein gut geplantes Café.'],
      ['Der Tresen hier ist aus Zink, glaube ich. Hygienisch gesehen top. Gemütlich gesehen auch.'],
      ['Ich komme gern hierher, wenn ich zwischen zwei Patienten Luft brauche. Jens kocht gegen jede Diagnose an.'],
    ],
  },
  thalia: {
    hours: [17, 19],
    everyNthDay: 3,
    drinks: ['🍷 Thalia hat ein Glas Rotwein. „Zum Runterkommen nach dem Training“, sagt sie.', '🥂 Thalia nippt an einem Spritz. „Vor der Party kommt der Aperitif“, sagt sie.', '🍵 Thalia trinkt einen Chai. „Nach dem Studio brauche ich was Warmes.“'],
    comments: [
      ['Das Mosaik am Boden ist wunderschön! Sechseckig, in Blau und Creme. Ich könnte hier tagelang sitzen.'],
      ['Das Weinregal am Tresen sieht so einladend aus. Jens kennt jede Flasche mit Namen.'],
      ['Hier sollte man mal eine kleine Party machen. Nur so eine Idee. Ich frag Jens bei Gelegenheit.'],
    ],
  },
};

export const CAFE_PLACE = 'bistro-jens';

// ---------------------------------------------------------------------------
// Gespräche im Café: Die Gäste reden miteinander und mit Jens (Sprechblasen, solange Lina im Café ist)
// ---------------------------------------------------------------------------

/** Jens spricht mit einem Gast: [Jens, Gast, optional wieder Jens] */
export const JENS_CAFE_CHATS: Readonly<Record<string, ReadonlyArray<readonly [string, string] | readonly [string, string, string]>>> = {
  gisela: [
    ['Madame Gisela, noch einen Kaffee? Diesmal mit weniger Bohne und mehr Liebe.', 'Mehr Bohne, Jens. Und rühr nicht so viel.'],
    ['Gisela, probier das Croissant, es ist ganz frisch!', 'Zu buttrig. Gib mir noch eins.', 'Bien sûr, Madame!'],
  ],
  olaf: [
    ['Frère, Mittagsmenü? Heute mit Quittung!', 'Mit Beleg bitte. Und mit Mehrwertsteuer ausgewiesen.'],
    ['Olaf, die Rechnung geht aufs Haus.', 'Das geht nicht, Jens. Das ist … Steuerhinterziehung. … Danke.'],
  ],
  christin: [
    ['Christin, deine Tasse steht schon wieder parallel. Das ist mir ein Fest!', 'Danke, Jens. Dein Löffel liegt übrigens schief.', 'Ich … rücke ihn gleich gerade.'],
    ['Kräutertee, ma chérie? Vom Haus?', 'Gern. Aber bitte ohne Zucker, ohne Zimt und ohne Überraschungen.'],
  ],
  oli: [
    ['Oli, mein Lieber, wieder zu viel Espresso?', 'Nur der dritte, Jens.', 'Der dritte. Aha. Ich schreib’s mir auf.'],
    ['Oli, gefällt dir die Musik?', 'Jens, das ist Akkordeon.', 'Das ist Kunst, Oli!'],
  ],
  lars: [
    ['Lars, mon cher, noch ein Stück Kuchen?', 'Medizinisch betrachtet ist das ein Notfall. Gib her.'],
    ['Lars, ein Gläschen für die Seele?', 'Das habe ich schon auf Rezept verschrieben. Heute ein kleines.'],
  ],
  thalia: [
    ['Thalia, ma chérie, noch einen Spritz vor der Party?', 'Nur einen, Jens. Danach wird getanzt.'],
    ['Thalia, ich habe dir einen Platz am Fenster reserviert.', 'Für die Landkarte? Die hab ich dabei!'],
  ],
};

/** Gespräche zwischen Gästen im Café (zusätzlich zu den allgemeinen in `gespraeche.ts`); Schlüssel „erster+zweiter“ */
export const CAFE_PAIR_CHATS: Readonly<Record<string, ReadonlyArray<readonly [string, string] | readonly [string, string, string]>>> = {
  'gisela+olaf': [['Olaf, der Kaffee kostet hier drei Euro. Drei! Dafür gab es früher einen Sack Kartoffeln.', 'Gisela, das ist die Inflation. Ich habe eine Tabelle.', 'Ich will keine Tabelle. Ich will meinen Kaffee.']],
  'gisela+christin': [['Christin, hast du Jens’ Tische gezählt?', 'Es sind acht, Gisela. Und alle stehen im Quadrat.', 'Köstlich. Wie bei mir.']],
  'olaf+christin': [['Christin, wir sollten öfter hierher.', 'Das habe ich auch gedacht. Aber nur, wenn wir die Stühle gerade rücken dürfen.']],
  'oli+lars': [['Lars, was gibt’s Neues in der Praxis?', 'Oli, ärztliche Schweigepflicht. Aber der Kaffee hier ist besser als meiner.']],
  'thalia+lars': [['Lars, ich war heute früh im Studio.', 'Das war vor dem Frühstück, Thalia. Ich bewundere dich und sorge mich zugleich.']],
  'oli+thalia': [['Thalia, kommt Mo am Samstag zur Party?', 'Ich hab ihn nicht gefragt!', 'Du hast ihn fünfmal gefragt.']],
  'gisela+lars': [['Lars, du isst zu wenig.', 'Oma, ich bin Arzt. Ich esse ausgewogen.', 'Dann iss noch ein Stück Kuchen. Ausgewogen!']],
  'olaf+lars': [['Lars, wie viel Zucker nimmst du?', 'Keinen, Papa. Medizinisch reicht der im Kuchen.']],
  'christin+lars': [['Lars, deine Tasse steht auf dem Rand des Tellers.', 'Christin, das ist eine ärztlich begründete Schieflage.']],
  'christin+oli': [['Oli, deine Jacke liegt über dem Stuhl.', 'Die ruht sich nur aus, Christin.', 'Dann soll sie sich bitte am Haken ausruhen.']],
  'gisela+oli': [['Oli, du siehst dünn aus.', 'Oma Gisela, ich bin normal.', 'Du bist dünn. Iss ein Stück Torte.']],
  'gisela+thalia': [['Thalia, trinkst du Wein am Nachmittag?', 'Spritz, Oma Gisela. Das ist praktisch Obst.', 'Köstlich. Pfui. Köstlich.']],
  'olaf+thalia': [['Thalia, hast du die Kosten fürs Studio bedacht?', 'Olaf, das ist eine Investition in mich.', 'Das lasse ich gelten.']],
  'christin+thalia': [['Thalia, du siehst müde aus.', 'Ich war trainieren, Christin. Das ist müde mit Stolz.']],
};
