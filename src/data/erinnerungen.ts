/**
 * Erinnerungen: Bewohner nehmen Bezug auf das, was Lina im Spiel erlebt hat (Hausausbau, Sammelbuch, Garten,
 * Tassen, Reisen …) – damit sich Gespräche nach Wochen nicht wiederholen (Game Design F8).
 *
 * Jede Zeile gehört zu einem **Tag** (siehe `game/erinnerungen.ts → memoryTags`). Wird der Tag zum ersten Mal
 * wahr, erwähnt der Bewohner es **einmal von sich aus** beim ersten Gespräch des Tages; danach kommt die Zeile
 * gelegentlich beim Plaudern wieder dran. Es werden nur Dinge aus dem Spiel erwähnt – keine erfundenen
 * Kindheits- oder Familiengeschichten der echten Personen.
 *
 * Platzhalter: `{stadt}` = Ziel von Jens' letzter Reise, `{dorf}` = Dorfname.
 */
export interface Memory {
  /** eindeutige ID (für „schon erzählt“) */
  id: string;
  npc: string;
  /** Bedingung (Tag aus `memoryTags`) */
  tag: string;
  text: string | readonly string[];
}

export const MEMORIES: readonly Memory[] = [
  // ---- Oma Gisela ----
  { id: 'gisela-haus-dach', npc: 'gisela', tag: 'haus-dach', text: ['Ich war oben in deinem Dachzimmer, Kind. Die Treppe ist steil.', 'Ich hab nicht gemeckert. Na gut. Ein bisschen. Aber leise.'] },
  { id: 'gisela-haus-keller', npc: 'gisela', tag: 'haus-keller', text: ['Ein Keller! Jetzt hast du Platz für Eingemachtes.', 'Ich hab Pflaumenmus. Sehr viel Pflaumenmus. Das kommt zu dir, keine Widerrede.'] },
  { id: 'gisela-buch-20', npc: 'gisela', tag: 'buch-20', text: ['Zwanzig Tierchen in deinem Sammelbuch! Und ich dachte, du fängst nur Schnecken.', '… Die Schnecke ist übrigens auch drin. Ich hab nachgeschaut.'] },
  { id: 'gisela-huehner', npc: 'gisela', tag: 'huehner', text: ['Deine Hühner sind anständige Tiere. Das sag ich nicht über jeden.', 'Wenn die Eier zu viel werden, ich nehme sie. Für den Kuchen. Aus reiner Nächstenliebe.'] },
  { id: 'gisela-schwarz', npc: 'gisela', tag: 'schwarze-blume', text: ['Eine schwarze Blume? In deinem Beet? Das ist doch nicht natürlich!', 'Ich will sie sehen. Sofort. Und dann sag ich dir, dass sie hübsch ist. Aber erst dann.'] },
  { id: 'gisela-monat', npc: 'gisela', tag: 'monat-1', text: ['Schon einen Monat bist du hier. Die Zeit vergeht, wenn man Spaß hat. Oder Kekse.', 'Ich hab jeden Tag das letzte Wort gehabt. Das war ein schöner Monat.'] },
  { id: 'gisela-jahr', npc: 'gisela', tag: 'jahr-1', text: ['Ein ganzes Jahr, Kind. Und ich hatte an jedem einzelnen Tag das letzte Wort.', 'Bleib so. Und besuch mich. Das ist keine Bitte.'] },

  // ---- Olaf ----
  { id: 'olaf-sparbuch', npc: 'olaf', tag: 'sparbuch', text: ['Du hast ein Sparbuch bei mir! Das macht mich als Vater und als Beamten stolz.', 'Zinsen, mein Schatz. Der Zinseszins ist das achte Weltwunder. Sagt man. Ich sage es ständig.'] },
  { id: 'olaf-ausbau', npc: 'olaf', tag: 'haus-anbau', text: ['Dein Ausbau war eine solide Investition. Ich hab die Rechnung nochmal geprüft.', 'Alles stimmt. Ich war fast enttäuscht.'] },
  { id: 'olaf-keller', npc: 'olaf', tag: 'haus-keller', text: ['Ein Keller! Da kann man Wertanlagen lagern. Oder Marmelade. Ich hab da keine Vorlieben.'] },
  { id: 'olaf-buch-10', npc: 'olaf', tag: 'buch-10', text: ['Zehn Einträge im Sammelbuch. Dokumentation ist die halbe Miete, mein Schatz.', 'Die andere Hälfte ist Ablage.'] },
  { id: 'olaf-tassen', npc: 'olaf', tag: 'tassen-viele', text: ['Du hast ganz schön viele Tassen. Ich hab nachgezählt.', 'Das hat einen Sammlerwert. Wahrscheinlich. Ich lasse es prüfen. Von mir.'] },

  // ---- Christin ----
  { id: 'christin-huehner', npc: 'christin', tag: 'huehner', text: ['Du hast Hühner. Ich hoffe, die Eier sind ordentlich einsortiert.', 'Nach Größe. Von links nach rechts. Ich mein ja nur.'] },
  { id: 'christin-kueche', npc: 'christin', tag: 'haus-kueche', text: ['Eine Wohnküche! Wie ordentlich ist dein Gewürzregal?', 'Du musst nichts sagen. Ich komme einfach mal vorbei. Mit Etiketten.'] },
  { id: 'christin-gewaechshaus', npc: 'christin', tag: 'gewaechshaus', text: ['Ein Gewächshaus. Mit Reihen. Beschriftet. Ich bin ehrlich ergriffen.'] },
  { id: 'christin-schwarz', npc: 'christin', tag: 'schwarze-blume', text: ['Schwarze Blüten im Beet. Das hat Stil. Und sie sind in einer Reihe. Das hat noch mehr Stil.'] },

  // ---- Oli ----
  { id: 'oli-dach', npc: 'oli', tag: 'haus-dach', text: ['Das Dachzimmer ist mein Lieblingsplatz geworden. Da oben hört man den Regen so schön, Lini.'] },
  { id: 'oli-keller', npc: 'oli', tag: 'haus-keller', text: ['Im Keller wäre Platz für einen Verstärker. Nur so als Idee. Ganz leise. Fast.'] },
  { id: 'oli-monat', npc: 'oli', tag: 'monat-1', text: ['Schon einen Monat im Dorf mit dir, Lini. Ich würde es genau so nochmal machen.'] },
  { id: 'oli-jahr', npc: 'oli', tag: 'jahr-1', text: ['Ein Jahr, Lini. Ein ganzes Jahr {dorf}. Ich hab mich noch nie so zu Hause gefühlt.', 'Das sag ich dir jetzt, bevor ich es wieder vergesse zu sagen. 💕'] },
  { id: 'oli-tassen', npc: 'oli', tag: 'tassen-viele', text: ['Du hast mehr Tassen als ich Platten. Das will was heißen.', 'Ich sag das mit Respekt.'] },
  { id: 'oli-huehner', npc: 'oli', tag: 'huehner', text: ['Ich hab heute Morgen deine Hühner gehört und dachte kurz, ich wär auf einem Bauernhof. Ich mag es.'] },

  // ---- Jens ----
  { id: 'jens-reise', npc: 'jens', tag: 'jens-reise', text: ['Meine Reise nach {stadt}! Ich hab dir eine Karte geschickt – hast du sie bekommen?', 'Magnifique, gell? Und das Andenken steht hoffentlich an einem guten Platz.'] },
  { id: 'jens-tassen', npc: 'jens', tag: 'tassen-viele', text: ['Du bist meine beste Kundin für Tassen aus aller Welt! Ich reise nur noch für dein Regal.', 'Gut. Ein bisschen auch für mich.'] },
  { id: 'jens-dach', npc: 'jens', tag: 'haus-dach', text: ['Dein Dachzimmer: lichtdurchflutet, schräge Wände, ein Hauch Bohème – parfait!'] },
  { id: 'jens-schwarz', npc: 'jens', tag: 'schwarze-blume', text: ['Schwarze Rosen, ma chérie! Das ist Kunst. Das ist ein Gedicht. Das ist – hast du eine abzugeben?'] },
  { id: 'jens-buch-30', npc: 'jens', tag: 'buch-30', text: ['Dreißig Arten im Sammelbuch! Du solltest ausstellen. In meiner Galerie. „Lina und die Natur“.'] },

  // ---- Lars ----
  { id: 'lars-buch-20', npc: 'lars', tag: 'buch-20', text: ['Zwanzig Arten im Sammelbuch! Ich stelle dir ein Attest aus: Hobbybiologin. Gültig auf Lebenszeit.'] },
  { id: 'lars-keller', npc: 'lars', tag: 'haus-keller', text: ['Ein Keller. Feuchtigkeit, Schimmel, Spinnweben – nur so als Arzt. Ich schau gern mal drauf.'] },
  { id: 'lars-huehner', npc: 'lars', tag: 'huehner', text: ['Frische Eier von eigenen Hühnern: Eiweiß, Vitamine, null Gewissensbisse. Ärztlich empfohlen!'] },
  { id: 'lars-schwarz', npc: 'lars', tag: 'schwarze-blume', text: ['Eine schwarze Blume? Als Arzt sage ich: Das ist gesundheitlich unbedenklich. Als Bruder: Zeig her!'] },
  { id: 'lars-gewaechshaus', npc: 'lars', tag: 'gewaechshaus', text: ['Ein Gewächshaus: Kräuter im Winter. Gegen Husten, Schnupfen und schlechte Laune. Gute Investition!'] },

  // ---- Thalia ----
  { id: 'thalia-buch-10', npc: 'thalia', tag: 'buch-10', text: ['Zehn Arten im Sammelbuch! Du bist offiziell Feldforscherin. Ich hab einen Stempel dafür. Fast.'] },
  { id: 'thalia-dach', npc: 'thalia', tag: 'haus-dach', text: ['Von deinem Dachfenster aus sieht man bestimmt bis zum Meer. Ich muss das mal kartieren.'] },
  { id: 'thalia-schwarz', npc: 'thalia', tag: 'schwarze-blume', text: ['Eine schwarze Blume im Beet? Das ist biologisch fast unmöglich. Ich liebe es!'] },
  { id: 'thalia-monat', npc: 'thalia', tag: 'monat-1', text: ['Ein Monat {dorf}! Ich hab schon einen Plan, wohin wir als Nächstes wandern. Ich hab immer einen Plan.'] },
  { id: 'thalia-tassen', npc: 'thalia', tag: 'tassen-viele', text: ['Deine Tassensammlung ist eine kleine Weltkarte. Fehlt nur noch Reykjavík. Ich hab eine, falls du magst.'] },
];
