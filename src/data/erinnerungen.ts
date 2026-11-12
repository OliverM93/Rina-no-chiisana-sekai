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

  { id: 'gisela-matteo', npc: 'gisela', tag: 'matteo', text: ['Ein Pfarrer als Brieffreund für Thalia? Na, das ist wenigstens ein anständiger Mensch.', 'Ich will den Brief sehen. Ich les ihn gegen. Mit meiner Brille. Die ich nicht habe. Egal.'] },
  { id: 'jens-matteo', npc: 'jens', tag: 'matteo', text: ['Ein Italiener! Ein Pater! Thalia schreibt Briefe in die Berge – quelle romance, ma chérie!', 'Ich schicke ihm eine Postkarte aus Paris. Nur zur Konkurrenz. Mit Herz, natürlich.'] },
  { id: 'lars-matteo', npc: 'lars', tag: 'matteo', text: ['Thalia und Pater Matteo. Ich hab ärztlich nichts einzuwenden – außer, dass sie ihm zu viele Kekse schickt. Zucker, Schwesterherz.'] },
  // ---- Thalia ----
  { id: 'thalia-buch-10', npc: 'thalia', tag: 'buch-10', text: ['Zehn Arten im Sammelbuch! Du bist offiziell Feldforscherin. Ich hab einen Stempel dafür. Fast.'] },
  { id: 'thalia-dach', npc: 'thalia', tag: 'haus-dach', text: ['Von deinem Dachfenster aus sieht man bestimmt bis zum Meer. Ich muss das mal kartieren.'] },
  { id: 'thalia-schwarz', npc: 'thalia', tag: 'schwarze-blume', text: ['Eine schwarze Blume im Beet? Das ist biologisch fast unmöglich. Ich liebe es!'] },
  { id: 'thalia-monat', npc: 'thalia', tag: 'monat-1', text: ['Ein Monat {dorf}! Ich hab schon einen Plan, wohin wir als Nächstes wandern. Ich hab immer einen Plan.'] },
  { id: 'oli-kino', npc: 'oli', tag: 'kino', text: ['Ich denke immer noch an die „Verlorene Autobahn“, Lini. Ich glaube, ich habe es jetzt zu 4 Prozent verstanden.', 'Der Rest ist Nacht und eine Tür.'] },
  { id: 'thalia-kino', npc: 'thalia', tag: 'kino', text: ['Ihr wart im Mitternachtskino? Mit dem Film, den keiner versteht? Ich bin stolz auf euch.', 'Ich hab ihn dreimal gesehen und bin heute noch Fan von der Autobahn bei Nacht. Frag nicht.'] },
  { id: 'lars-kino', npc: 'lars', tag: 'kino', text: ['Oli hat mir von der „Verlorenen Autobahn“ erzählt. Medizinisch klingt das nach Schlafmangel. Aber ein schöner.'] },
  { id: 'oli-tourshirt', npc: 'oli', tag: 'tourshirt', text: ['Das „Letzte Ruhestätte“-Shirt hängt über dem Stuhl. Ich trau mich gar nicht, es zu waschen.', 'Du bist die Beste, Lini. Und Thalia mit ihrem Sammler auch ein bisschen.'] },
  { id: 'thalia-tourshirt', npc: 'thalia', tag: 'tourshirt', text: ['Der Sammler hat mir noch eine Postkarte geschickt: „Der Bernstein ist in guten Händen.“ Schön, oder?', 'Wissenschaftlich ein guter Tausch. Emotional sowieso.'] },
  { id: 'thalia-matteo', npc: 'thalia', tag: 'matteo', text: ['Pater Matteo hat wieder geschrieben! Er nennt mich „liebe Thalia“. Er nennt auch dich „liebe Lina“. Wir sind beide gleich lieb. Ich analysiere das noch.'] },
  // ---- Linas Lieblinge: Pflanzen, Bett, Wärmflasche ----
  { id: 'oli-pflanzen', npc: 'oli', tag: 'pflanzen-viele', text: ['Wir haben wieder eine neue Pflanze, Lini. Ich hab zu den Sukkulenten gesagt, dass sie hier bleiben dürfen.', 'Sie haben nicht widersprochen. Das nehme ich als Ja.'] },
  { id: 'christin-pflanzen', npc: 'christin', tag: 'pflanzen-viele', text: ['Bei dir stehen viele Pflanzen. Gut. Sind die Töpfe alle gleich ausgerichtet?', '… Sie sind sehr lebendig. Das ist ein Kompromiss, den ich akzeptiere.'] },
  { id: 'gisela-pflanzen', npc: 'gisela', tag: 'pflanzen-viele', text: ['Wie viele Pflanzen hast du eigentlich, Kind? Hier sieht es aus wie im Gewächshaus.', 'Ich find es schön. Aber gieß nicht zu viel. Zu viel Wasser ist auch nicht gut.'] },
  { id: 'oli-bett', npc: 'oli', tag: 'bett', text: ['Das neue Bett mit der schweren Decke … ich hab seit Tagen nicht so gut geschlafen. Und du erst.', 'Du bist wie eine zufriedene Katze, Lini. Ich liebe das.'] },
  { id: 'lars-bett', npc: 'lars', tag: 'bett', text: ['Schweres Deckchen, viel Schlaf, ausgeruhte Schwester? Medizinisch ein Volltreffer.', 'Ich verschreibe dir hiermit: weiterschlafen. Dreimal täglich, wenn nötig.'] },
  { id: 'oli-waermflasche', npc: 'oli', tag: 'waermflasche', text: ['Deine Wärmflasche liegt schon wieder auf meiner Seite. Ich beschwere mich nicht. Sie ist eine sehr gute Bettgenossin.'] },
  { id: 'gisela-waermflasche', npc: 'gisela', tag: 'waermflasche', text: ['Die Wärmflasche hab ich selbst eingestrickt. Das ist die Farbe, die dir steht. Rosa. Bitte nicht neu streichen.'] },
  { id: 'thalia-tassen', npc: 'thalia', tag: 'tassen-viele', text: ['Deine Tassensammlung ist eine kleine Weltkarte. Fehlt nur noch Reykjavík. Ich hab eine, falls du magst.'] },

  // ---- Reaktionen auf die Einrichtung (nur freundlich, nie eine Wertung – auch Gisela meckert liebevoll) ----
  { id: 'oli-parkett', npc: 'oli', tag: 'parkett-edel', text: ['Dein Parkett ist ein Traum, Lini. Ich laufe extra langsam drüber, damit er lange hält.', 'Okay, ich laufe gar nicht. Ich gleite. In Socken.'] },
  { id: 'oli-uni', npc: 'oli', tag: 'tapete-uni', text: ['Die einfarbige Wand steht dir, Lini. So ruhig. Man sieht endlich, wie hübsch deine Sachen sind.'] },
  { id: 'oli-garten', npc: 'oli', tag: 'garten-deko', text: ['Dein Garten sieht aus wie aus einem Bilderbuch. Ich sitze abends gern mit dir draußen.', 'Auch wenn ich dir beim Gießen nur zusehe. Moralische Unterstützung.'] },
  { id: 'lars-modern', npc: 'lars', tag: 'stil-modern', text: ['Modern eingerichtet: klare Linien, viel Platz. Medizinisch gesehen: wenig Stolperfallen. Ich bin dafür.'] },
  { id: 'lars-parkett', npc: 'lars', tag: 'parkett-edel', text: ['Parkett! Gut fürs Raumklima, schlecht fürs Hinfallen. Aber falls doch: Ich bin Arzt.', 'Und nein, ich schaue mir nicht die Fugen an. Okay, ein bisschen.'] },
  { id: 'thalia-japanisch', npc: 'thalia', tag: 'stil-japanisch', text: ['Dein japanisches Eckchen ist so gemütlich! Kotatsu, Zabuton, Tee … ich zieh nie wieder aus.', 'Ich frag nur: Ist da noch Platz auf dem Futon? Für Notfälle. Und für mich.'] },
  { id: 'thalia-midcentury', npc: 'thalia', tag: 'stil-midcentury', text: ['Mid-Century bei dir? Das sieht aus wie im Magazin! Ich will ein Foto – nur fürs Archiv.'] },
  { id: 'thalia-uni', npc: 'thalia', tag: 'tapete-uni', text: ['Einfarbige Wände und dazu deine Karten und Bilder – wie eine Galerie! Ich bin Fan.'] },
  { id: 'jens-bistro', npc: 'jens', tag: 'stil-bistro', text: ['Du hast Bistro-Möbel bei dir stehen! Mon dieu, Lina, ich bin gerührt.', 'Mer sin’ ja ganz scheen eingerichtet, wa? Merci, Madame!'] },
  { id: 'jens-parkett', npc: 'jens', tag: 'parkett-edel', text: ['Fischgrät, Chevron … das ist Kunst, Lina. Du läufst jeden Tag auf einem Muster.', 'Ich würde es einrahmen. Aber man kann nicht gut darauf sitzen.'] },
  { id: 'jens-retro', npc: 'jens', tag: 'stil-retro', text: ['Retro-Chic, Lina! Das ist Mut zur Farbe. Ich liebe es. Genau so.'] },
  { id: 'gisela-retro', npc: 'gisela', tag: 'stil-retro', text: ['Dein Ohrensessel und die Fransenlampe … Ludwig hätte sich draufgesetzt und wäre nie wieder aufgestanden. Köstlich!'] },
  { id: 'gisela-cottage', npc: 'gisela', tag: 'stil-cottage', text: ['Blümchen überall, Häkeldeckchen, ein Körbchen mit Wolle … das gefällt mir. Das sage ich nicht oft.', 'Also behalt es für dich.'] },
  { id: 'gisela-modern', npc: 'gisela', tag: 'stil-modern', text: ['Alles so gerade und kahl, Kind. Pfui! Da fehlt ein Deckchen.', '… Der Sitzsack ist allerdings bequem. Das bleibt unter uns.'] },
  { id: 'gisela-uni', npc: 'gisela', tag: 'tapete-uni', text: ['Einfarbige Wände, ganz ohne Muster? Pfui, da fehlt doch was!', '… Aber hübsch, hübsch. Ich habe nichts gesagt.'] },
  { id: 'christin-uni', npc: 'christin', tag: 'tapete-uni', text: ['Einfarbige Wände: ruhig, klar, ordentlich. Das gefällt mir sehr.'] },
  { id: 'christin-parkett', npc: 'christin', tag: 'parkett-edel', text: ['Das Parkettmuster ist exakt verlegt. Ich habe die Fugen kontrolliert. Sie sind gerade.', 'Ich bin sehr zufrieden. Das war ein Kompliment.'] },
  { id: 'christin-garten', npc: 'christin', tag: 'garten-deko', text: ['Dein Garten ist schön gestaltet. Und die Wege sind frei! Danke.'] },
  { id: 'olaf-parkett', npc: 'olaf', tag: 'parkett-edel', text: ['Echtes Parkett, mein Schatz, ist eine Wertanlage im Haus. Fischgrät hält den Wert. Das habe ich gerade erfunden – klingt aber gut.'] },
  // ---- Reaktionen auf die neuen Einrichtungsstile (ab vier Stücken eines Stils im Haus) ----
  { id: 'christin-japandi', npc: 'christin', tag: 'stil-japandi', text: ['Japandi! Alles hat seinen Platz, nichts liegt herum, und das Holz ist so hell.', 'Ich setze mich kurz hin. Nur ganz kurz. Es ist so ruhig hier.'] },
  { id: 'oli-japandi', npc: 'oli', tag: 'stil-japandi', text: ['Bei dir ist es so ruhig geworden, Lini. Ich hab mich hingesetzt und vergessen, was ich wollte.', 'Ach ja: dich sehen. Hat geklappt.'] },
  { id: 'christin-minimalismus', npc: 'christin', tag: 'stil-minimalismus', text: ['Wenige Dinge, alle schön, alle gerade. Lina, das ist das Ordentlichste, was ich je gesehen habe.', 'Ich bin ein bisschen neidisch. Nicht weitersagen.'] },
  { id: 'gisela-minimalismus', npc: 'gisela', tag: 'stil-minimalismus', text: ['So leer, Kind! Wo sollen denn da die Deckchen hin?', '… Aber Staubwischen geht schnell. Das muss man sagen. Hab ich aber nicht.'] },
  { id: 'olaf-skandinavisch', npc: 'olaf', tag: 'stil-skandinavisch', text: ['Helles Holz, weiße Wände, ein Schaffell … Das erinnert mich an unsere Zeit an der Ostsee.', 'Fehlt nur der Wind. Und Christin, die die Muscheln nach Größe sortiert.'] },
  { id: 'christin-skandinavisch', npc: 'christin', tag: 'stil-skandinavisch', text: ['So hell und aufgeräumt wie in einem Ferienhaus am Meer. Da hat Olaf ganz recht.'] },
  { id: 'lars-industrial', npc: 'lars', tag: 'stil-industrial', text: ['Backstein, Leder, Fabriklampe – hier fehlt eigentlich nur ein kühles Bier.', 'In Maßen. Ärztlicher Rat. Ich nehm trotzdem eins.'] },
  { id: 'olaf-industrial', npc: 'olaf', tag: 'stil-industrial', text: ['Rohre, Stahl und alte Bretter. Steuerlich gesehen eine Werkstatt, gemütlich gesehen ein Wohnzimmer.'] },
  { id: 'thalia-darkacademia', npc: 'thalia', tag: 'stil-darkacademia', text: ['Eine Bücherwand, eine alte Karte und grünes Lampenlicht … Lina, das ist mein Traumzimmer!', 'Ich komme zum Lesen vorbei. Und zum Reden. Hauptsächlich zum Reden.'] },
  { id: 'jens-darkacademia', npc: 'jens', tag: 'stil-darkacademia', text: ['Dunkles Holz, Bücher bis zur Decke – très intellectuel! Man möchte sofort ein Gedicht schreiben.', 'Oder Kaffee trinken und so tun. Das geht auch.'] },
  { id: 'jens-artdeco', npc: 'jens', tag: 'stil-artdeco', text: ['Art déco! Gold, Samt, Fächer – Lina, du lebst in einem Ballsaal.', 'Ich komme nur noch im Anzug vorbei. Das ist ein Versprechen.'] },
  { id: 'gisela-artdeco', npc: 'gisela', tag: 'stil-artdeco', text: ['In Dessau hatten wir das Bauhaus. Alles eckig. Das hier ist goldener.', 'Gefällt mir besser. Aber das sag ich in Dessau keinem.'] },
  { id: 'oli-spaceage', npc: 'oli', tag: 'stil-spaceage', text: ['Ein Kugelsessel! Lini, ich bin jetzt offiziell Astronaut.', 'Heute Abend gucken wir Sterne von hier drinnen. Ich mach die Lavalampe an.'] },
  { id: 'thalia-spaceage', npc: 'thalia', tag: 'stil-spaceage', text: ['Planeten an der Wand, Kugelsessel, Lavalampe – fehlt nur noch ein Mondgestein. Ich hab zufällig eins. Ungefähr.'] },
  { id: 'oli-cyberpunk', npc: 'oli', tag: 'stil-cyberpunk', text: ['Neonlicht, zwei Bildschirme, Gaming-Stuhl … Lini, das ist die beste Zockerecke der Welt.', 'Lars und ich kommen am Samstag. Dark Souls. Ich verliere bestimmt. Wieder.'] },
  { id: 'lars-cyberpunk', npc: 'lars', tag: 'stil-cyberpunk', text: ['Sieht aus wie in Fallout 3, nur sauberer und mit weniger Strahlung.', 'Ich bring Chips mit. Und Oli bringt seine Ausreden.'] },
  { id: 'thalia-brutalismus', npc: 'thalia', tag: 'stil-brutalismus', text: ['Beton ist eigentlich künstliches Konglomerat. Du wohnst also in einem Gestein. Ich find das großartig.'] },
  { id: 'olaf-brutalismus', npc: 'olaf', tag: 'stil-brutalismus', text: ['Viel Beton bei dir, mein Schatz. Konkret gesagt: gefällt mir.', 'Das war ein Wortspiel. Christin hat nicht gelacht.'] },
  { id: 'jens-memphis', npc: 'jens', tag: 'stil-memphis', text: ['Memphis! Kringel, Kegel, Konfetti – Lina, das ist Kunst, auf der man sitzen kann!', 'Ich bin begeistert. Ich bin ergriffen. Ich setz mich mal.'] },
  { id: 'christin-memphis', npc: 'christin', tag: 'stil-memphis', text: ['Sehr … bunt. Ich sortiere es im Kopf gerade nach Farben.', 'Doch, es ist schön. Und die Kringel liegen sogar alle parallel.'] },
];
