# Spielmechaniken – Rina no Chiisana Sekai

Wie das Spiel funktioniert: Fortschritt, Bewohner, Natur, Zuhause, Feste und alles, was Lina tun kann –
jeweils mit dem Ort im Code. Technischer Aufbau: [`architecture.md`](architecture.md). Stand der Arbeit:
[`development-status.md`](development-status.md).

**Leitplanken (gelten für jede Mechanik):** Nichts ist Pflicht, es gibt kein Scheitern und keinen Zeitdruck.
Alles Tägliche ist optional. Fortschritt hängt an Meilensteinen und Spielzeit, Tag & Nacht, Jahreszeiten,
Wetter und Feste laufen nach echter Zeit.

- **Fortschritt statt Kalender:** Einzüge & Hausausbau hängen an **Meilensteinen und Spielzeit**, nicht an echten
  Tagen. `data/progress.ts` legt je Einzug fest, was Lina getan haben muss (Sammelbuch, verkauft, gekauft, gebaut,
  gekocht, Flags) – **keine Herzen** (die steigen nur 1×/Tag). Danach Brief, nach `WAIT_SECONDS` (10 Min Spielzeit,
  `session.playTime()`) Einzug; Zeitstempel in `SaveData.story`, Zähler in `SaveData.stats`. World3D prüft alle
  paar Sekunden (`progressTick`, nur draußen & ohne offene Fenster). Hinweise gibt der Bewohner `hintBy` im
  Gespräch. **Echtzeit bleibt** für Tag/Nacht, Jahreszeiten, Wetter, Feste, Geburtstage, Tägliches, Treffen,
  Party, Sonntagsessen und Jens' Reisen.
- **Post nur von Bewohnern, die da sind:** Nach der Ankündigung (Brief) kommt keine weitere Post, keine Herz-Briefe und keine Kontoauszüge, bis der Bewohner eingezogen **und** begrüßt ist (`hasMovedIn` in `game/gameplay.ts`).
- **Einzüge:** `NpcDef.movesIn` = Story-Flag; Kartenobjekte mit `requires`/`until` erscheinen/verschwinden
  per Flag (`applyMapFlags`, z. B. Bauplatz → Haus). Ablauf in `game/story.ts`.
- **Bewohner:** Daten in `src/data/npcs/<id>.ts` (Aussehen, Haus, Tagesablauf, Vorlieben, Dialog-Pools,
  Briefe). Ein neuer Bewohner braucht: Datei + Eintrag in `npcs/index.ts` + Haus/Bank in `VILLAGE_OBJECTS`.
  Dialogzeilen haben Bedingungen (`when`) und Gewichte; ausgewählt wird reproduzierbar pro Tag. Jeder Bewohner hat mind. 30 Plauderzeilen (Test `dialoguePools.test.ts`), die
  kleineren Pools zusätzlich Zeilen je Jahreszeit.
- **Erinnerungen im Gespräch:** Die Bewohner nehmen Bezug auf das, was Lina erlebt hat (`data/erinnerungen.ts`, 38 Zeilen, `game/erinnerungen.ts`):
  Hausausbau (Anbau, Dachzimmer, Wohnküche, Keller), Sammelbuch (10/20/30 Arten), Hühner, Gewächshaus, Tassensammlung, Sparbuch, schwarze
  Blumen, Jens' letzte Reise (`{stadt}`), 1 Monat / 1 Jahr im Dorf. Wird eine Erinnerung neu wahr, erwähnt der Bewohner sie **einmal von sich aus**
  beim ersten Gespräch des Tages (`takeMemory`, gemerkt in `world.dates['erinnerung:<id>']`); danach kommt die Zeile gelegentlich beim Plaudern
  wieder dran. Es werden nur Dinge aus dem Spiel erwähnt, keine erfundenen Familiengeschichten.
- **Fotomodus:** Taste **F** (oder 📷 unten rechts) macht einen Schnappschuss der Welt (ohne Oberfläche, `World3D.takePhoto`) und öffnet das Foto-Fenster
  (`ui/PhotoPanel.tsx`): vier Rahmen zur Wahl (Polaroid, Herzchen, Blümchen, Schlicht – gemalt in `gfx/photoFrame.ts`), Beschriftung „Linas kleine Welt ·
  Dorf · Jahreszeit“ mit Datum, **💾 Speichern** lädt ein PNG herunter, **🔄 Neues Foto** macht ein neues. Das Bild bleibt auf dem Gerät – nichts wird hochgeladen
  oder im Spielstand abgelegt. Zugehörig: Kameraklick (`sfx: 'foto'`).
- **Vollständige Sammlungen werden gewürdigt:** (`data/sammlungen.ts`, `game/sammlungen.ts`) Sind alle **Fische**, **Krabbeltiere**, **Funde**,
  **Blumenfarben** (22) oder **Tassen** (19) beisammen, kommt ein Brief von jemandem, der sich dafür interessiert (Jens, Lars, Thalia, Christin, Oli –
  erst, wenn er im Dorf wohnt) mit einer **Urkunde** für die Wand (`urkunde-<sammlung>`, Erinnerungsstück). Geprüft beim Fang/Fund/Erblühen und
  täglich; jede Sammlung nur einmal (`world.dates['sammlung:<id>']`). Tassen in der Vorratstruhe zählen mit. Kein Erfolge-Menü.
- **Freundschaft:** sinkt nie. Erstes Gespräch am Tag und erstes Geschenk am Tag zählen; Herz-Belohnungen
  kommen per Brief – **jedes Herz (1–5) bringt bei jedem Bewohner einen Brief mit Geschenk** (`heartLetters`, Test in
  `data/gifts.test.ts`). Meist persönliche Erinnerungsstücke mit Platz im Zimmer (Christins Setzkasten, Lars' Lern-Skelett
  „Knochen-Kalle“ und Spruchtafel, Thalias Dorfkarte & Ammonit „Lina“, Papas Witze-Kalender – Anschauen zeigt den
  Witz des Tages, `OLAF_CALENDAR_JOKES` – und das Familienbild, Jens' Reisekoffer), dazu Rezepte (Thymiantee,
  Steinmännchen), Farb-Samen mit Kreuzungs-Tipp und ein Frühbeet von Christin. Fehlen Briefe für schon erreichte Herzen
  (ältere Spielstände), liefert `catchUpHeartLetters` sie beim Laden nach.
- **Tägliches:** Muscheln (reproduzierbar pro Datum), Obst wächst nach 3 Tagen nach, Felsen & Blumen 1×/Tag.
  Heruntergefallenes bleibt liegen (gespeichert in `world.ground`).
- **Natur:** Fische/Insekten in `data/species.ts` werden automatisch zu Gegenständen, Symbolen
  (`gfx/nature-icons.ts`) und Sammelbuch-Einträgen. Insekten wechseln stündlich (reproduzierbar), fliehen nie.
  Angeln: Verpassen ist kein Scheitern – der Fisch knabbert einfach nochmal. Regen gießt das Beet.
  Der Regenbogen ist ein Bogen in der Oberfläche (die Schrägsicht zeigt keinen Himmel).
- **Blumen & Kreuzungen (Beet/Samen, Phase 1):** `data/flowers.ts` legt je Blumenart (Tulpe, Rose, Sonnenblume, Lavendel,
  Vergissmeinnicht) die Standardfarbe, die Samen-Farben (gibt es als Samen aus Briefen, Omas Starterset …) und die
  Mischfarben fest, dazu die Mischregeln (`MIXES`: Rot × Gelb = Orange, Rot × Weiß = Rosa, Blau × Rosa = Lila,
  Orange × Rosa = Schwarz – selten). Blumen & Samen der Farbvarianten werden automatisch zu Gegenständen
  (`tulpe-gelb`, `samen-tulpe-gelb`; die Standardfarbe behält die alte ID). **Kreuzen:** Blühen zwei Farben derselben Art
  in den 8 Nachbarfeldern, kann beim Pflücken ein Misch-Same abfallen (`game/flowers.ts`, `seedDrop`; reproduzierbar
  pro Tag und Platz). Neu erblühte Farben tragen sich ins Sammelbuch ein (Reiter „Blumen“, `registerBlooms`), zählen aber
  nicht als Tier-Fund für Einzugs-Meilensteine. Geschenke: Wer die Art mag, mag jede Farbe, Mischfarben kommen nie
  schlecht an (`giftPreferences`). **Samenstand (Phase 2):** Christin betreibt auf der Ostseite des Dorfplatzes (nicht auf dem Weg und nicht vor einem Gebäude – ein Test in `worldmap.test.ts` hält Stände & Schilder von Fassaden fern) einen Stand (`samenstand`, Karten-Objekt
  `seedstall`, steht ab Olafs Einzug; `data/seedstand.ts`, `game/seedstand.ts`, Fenster `ui/SeedStandPanel.tsx`). Reiter „Blumen“, immer da:
  Standard-Samen jeder Blumenart (plus Kamille & Pfefferminze); dazu täglich drei wechselnde **Farb-Samen** (`dailyColorSeeds`, reproduzierbar pro Tag),
  damit Lina Kreuzungs-Partner bekommt. Misch-Farben gibt es nie zu kaufen. Preis = Verkaufswert × 2,5 (mind. 12 ⭐), Menge 1× oder 5×,
  ganz oder gar nicht. Christin erzählt im Plausch davon.
  **Gemüse & Kräuter (Phase 3):** `data/crops.ts` – 6 Gemüse (Tomate, Karotte, Kartoffel, Kopfsalat, Zucchini, Kürbis) und 4 Kräuter
  (Basilikum, Petersilie, Schnittlauch, Thymian). Sie sind ganz normale Beet-Pflanzen (Gießen → nächste Stufe, nichts vertrocknet,
  Stufe 3 = erntereif; `GARDEN_FLOWERS` enthält sie, Pflanzen/Gießen/Hochbeet laufen unverändert), liefern aber mehrere Stück je
  Ernte (`yield`, `harvestCount`, `pickGardenFlower`). **Wurzelgemüse & Co.** (`once`: Karotte, Kartoffel, Salat, Kürbis) räumen den
  Platz nach der Ernte, **Tomate, Zucchini & Kräuter** treiben wieder aus. Am Samenstand (Reiter „Gemüse & Kräuter“) liegen sie ganzjährig,
  nur Tomaten & Zucchini nicht im Winter und Kürbis nicht im Frühling/Winter (`CropDef.seasons`, `cropsAt`) – ein Anknüpfpunkt fürs
  Gewächshaus. 7 neue **Gerichte** kocht Lina im Kochstudio oder am eigenen Herd (`recipes.ts`): Tomatensalat, Kartoffelsuppe, Pellkartoffeln
  mit Kräuterquark, Karottensuppe, Ratatouille, Gemischter Salat, Kürbissuppe. Die meisten Rezepte lernt sie bei der **ersten Ernte**
  (`fund`). Bewohner mögen sie (Vorlieben von Jens, Lars, Oma, Olaf, Oli, Christin, Thalia) und erzählen davon im Plausch.
  3D-Pflanzen je Stufe: `makeCrop` in `world3d/models/critters.ts`; Symbole: `CROP_ICONS` in `gfx/nature-icons.ts`, Gerichte in `gfx/items.ts`.
  **Sträuße & Blumendeko (Phase 4):** `data/straeusse.ts` – an Opas Werkbank gibt es den Reiter „💐 Blumen binden“ (`RecipeDef.group:
  'blumen'`). **7 Sträuße** (Rosen, Sonnenblumen, Bunter Frühling, Lavendel, Kräuterbund, Mischfarben, Schwarz) aus Blumen/Kräutern vom
  eigenen Beet; die seltenen (Mischfarben `tulpe-orange`, Schwarz `rose-schwarz`) lernt Lina beim ersten Erhalt der Mischfarbe. Sträuße sind
  verkäuflich und **Geschenke** (Vorlieben bei allen Bewohnern, Oli liebt Rosen & Schwarz, Jens Mischfarben & Lavendel …). Mit der leeren
  **Glasvase** (Möbelkatalog, 180 ⭐) wird aus jedem Strauß eine **Vase fürs Zimmer** (`vase-strauss-…`, kleines Möbel für Tische) und aus
  Blumen + Ästen ein **Wandkranz** (`kranz-lavendel/-rosen/-wiese/-kraeuter`, Wand-Deko). Modelle: Vasen & Kränze in `models/furniture.ts`,
  Strauß-Symbole in `gfx/items.ts`.
  **Winterruhe & Gewächshaus (Phase 5):** Von Dezember bis Februar ruht jedes Beet draußen – Pflanzen wachsen nicht weiter, Gießen geht nicht
  (`isWinter`, `isFrozen`, `growGarden(…, frozen)`; Raureif-Ring unter der Pflanze, `makeFrostPatch`), Ernten und Pflanzen schon. Ausgenommen
  sind **Frühbeet** (3 Plätze, 1800 ⭐) und **Gewächshaus** (6 Plätze, 4200 ⭐) aus dem Möbelkatalog (Stil Garten, `FurnitureDef.greenhouse`,
  `soilHeight`): Dort wächst es ganzjährig (`greenhouseKeys`). Das Samenstand-Fenster weist im Winter darauf hin. Kein Zeitdruck: nichts
  vertrocknet, im Frühling geht es draußen von selbst weiter. Damit ist das Thema Beet & Samen (Phasen 1–5) komplett.
- **Zuhause:** Möbel in `data/furniture.ts` (Größe in Feldern, `surface`/`small`/`rug`/`sit`/`light`) werden
  automatisch Gegenstände (Varianten → `futon-rosa` …). Raumlogik in `core/room.ts`, Modelle in
  `world3d/models/furniture.ts`. Gespeichert wird immer draußen weitergespielt (Laden im Haus → vor der Tür).
  Einrichten läuft über `decor:command`/`decor:state` auf dem Bus. **Tasten:** G = Einrichten/Garten gestalten (nochmal G =
  fertig), I = Tasche, B = Sammelbuch, M = Karte, 1–4 = Werkzeuge – die Knöpfe tragen ihr Kürzel als Schild
  (`.hud-tool-key`). Die Einrichten-Leiste steht links unten und lässt `--hud-right-width` für die Knöpfe rechts frei.
  **Hausausbau:** 0 Zimmer → 1 großes Zimmer → 2 Schlafzimmer → 3 Dachzimmer → 4 Wohnküche (Wohnzimmer 12 × 8 +
  Küche) → 5 Wintergarten → 6 Keller. Außen zeigt `makeHouse(…, stage)` jede Stufe; Anbauten außerhalb der 5 × 3
  Kacheln stehen in `HOUSE_ANNEX` und blockieren Karte & Garten (`session.houseAnnexTiles`, `syncYardCollision`).
  **Wand-Deko** (`wall: true`): hängt an Rückwand (rot 0) oder Seitenwand (rot 3 links / 1 rechts), nicht vor
  Fenstern (`backWindows`), blockiert den Boden nicht – **Möbel dürfen darunter stehen, wenn sie niedrig genug sind**: Die
  Oberkante des Möbels muss mindestens `WALL_CLEARANCE` unter der Unterkante der Wand-Deko liegen (Kommode, Tisch, Sofa ja;
  Regal, Sessel, Stehlampe nein – dann hätte das Poster keinen Platz). Gilt in beide Richtungen (Poster über Regal / Regal unter
  Poster). Die Höhen stehen in `data/furnitureHeights.ts` (gemessen mit `scripts/measure-heights.cjs`, ein Test prüft, dass keins
  fehlt); ältere Spielstände laden ohne diese Prüfung (`PlaceHint.lenient`), es geht nichts verloren. Beim Einrichten zielt man
  auf die Wand (`Interior3D.walls`), die Drehung rastet von selbst ein (`wallRotationAt`). Modelle hängen bei
  `HANG`/`WALL_Z` in `models/furniture.ts`.
- **Herzenswünsche (Spätspiel):** Sind alle eingezogen (`thaliaBegruesst`), schreibt Oma einen Brief, und jeder Bewohner hat
  einen kleinen Wunsch fürs Dorf (`data/wishes.ts`, Regeln in `game/wishes.ts`). Zur Begrüßung deutet er ihn an, im Gespräch
  „💭 Herzenswunsch“ erzählt er davon und zeigt, was Lina schon dabeihat (z. B. „Rosen (jede Farbe) 3/5“ – Farben, Arten
  und Kategorien wie „jeder Fisch“ zählen). Hat sie alles, erfüllt „💝 Wunsch erfüllen“ ihn: Die Sachen (und ggf. ein kleiner
  Sternchen-Beitrag) werden genommen, es gibt +30 Freundschaft, Konfetti – und ein **neuer Ort erscheint im Dorf**: Omas
  Blumenbeet (für Opa Ludwig), Olafs Angelsteg (begehbar, von der Spitze aus angeln), Christins Kräuterspirale, Olis Herzbank am
  Strand („L + O“), Jens' Aquarium vor dem Bistro, Lars' Insektenhotel, Thalias Aussichtspunkt mit Fernrohr (tags Meer,
  nachts Sterne). Alles über Story-Flags (`wunsch-<id>`, `wunsch-erzaehlt-<id>`), kein neues Spielstand-Feld. Keine Frist,
  keine Reihenfolge; Thalias Dorfkarte zeigt 💭 bei Bewohnern mit offenem Wunsch. Mehrere Wünsche je Bewohner sind
  vorbereitet (`order`).
- **Vorratstruhe:** Möbel `vorratstruhe` (Katalog, 650 ⭐, 2×1, Dinge dürfen oben drauf stehen) öffnet ein Lager mit **60 Plätzen**
  (`SaveData.storage`, `game/storage.ts`, Fenster `ui/StoragePanel.tsx`). Klick (oder Enter/Leertaste, Pfeiltasten) legt einen ganzen
  Stapel von der Tasche in die Truhe und zurück; Werkzeuge bleiben in der Tasche; „↕ Sortieren“ ordnet die Truhe. **Alle Truhen teilen sich
  denselben Vorrat** – nichts geht verloren, wenn Lina eine verschiebt oder wegräumt. Was nicht mehr passt, bleibt, wo es war.
- **Herzenswünsche, Phase 2** (`WISHES_2` in `data/wishes.ts`): Hat ein Bewohner seinen ersten Wunsch erfüllt gesehen, kommt ein zweiter (`order: 2`),
  persönlicher und ohne neuen Ort – stattdessen eine Szene und ein Geschenk: **Oma** wünscht sich einen **Premium-Eierlikör** (Rezept lernt Lina, sobald
  Oma davon erzählt; 6 Eier + 3 Kekse am Herd/im Kochstudio; Dank: Likörchen-Set), **Olaf** baut mit Lina ein **Flugzeugmodell** (Äste, Kiesel, Muscheln,
  600 ⭐; Dank: sein Modell), **Christin** führt einen **Volkstanz** auf dem Dorfplatz auf (bunter Strauß + Apfelkuchen; danach „🪗 Volkstanz tanzen“ mit Christin
  & Olaf, einmal am Tag), **Jens** lädt zum **Urlaub** ein – **Hawaii oder Japan zur Wahl** (1.500 ⭐ + zwei Gerichte; Dank: die Tasse „Honolulu“ bzw. „Nara“),
  **Lars** wünscht sich einen **Wolframit** (neuer seltener Fund mit der Schaufel; Dank: sein Lieblingsbuch „Die Sandsterne“) und **Thalia** eine **große Party**
  (vier Gerichte, bunter Strauß, 400 ⭐; Dank: die Discokugel). Geschenke kommen über `WishResult.rewards` (`giveOrDrop`), Wünsche mit Wahl über `options`.
- **Pater Matteo – Thalias Brieffreund** (`WISHES_3`, `data/matteo.ts`, `game/matteo.ts`): Nach der Party wünscht sich Thalia einen Brieffreund: **Pater Matteo**, eine
  **ausgedachte** Figur (Pfarrer in einem Bergdorf, schreibt über Steine und Wanderwege, bescheiden und humorvoll). Lina hilft beim Päckchen (Bergkristall, Lavendelkekse, 100 ⭐
  Porto). Danach schreibt er an Lina & Thalia, **2, 10, 25 und 50 Tage später** (je einmal), mit Basilikum- und Tomatensamen, einem Rosenquarz und zuletzt der Tasse „Montecielo“.
  Er erscheint nie im Dorf. Thalia, Oma, Jens und Lars kommentieren das im Gespräch (Erinnerungen, Tag `matteo`).
- **Olis Wünsche** (`WISHES_3`, `order` 2 und 3): **„Mitternachtskino mit Lini“** (zwei Snacks + 120 ⭐; Szene: ein ausgedachter Schwarz-Weiß-Kultfilm „Verlorene Autobahn“,
  den keiner versteht; Dank: das **Kinoplakat** als Wanddeko) und danach **„Das seltene Tourshirt“** (Bernstein + 300 ⭐; Dank: das Shirt der ausgedachten Band
  **„Letzte Ruhestätte“**). Ab dann kommt das Tourshirt in Olis **Kleiderschrank** (`OLI_RARE_WARDROBE`, `wardrobeFor` in `game/wishes.ts`) und er trägt es ab und zu – `Appearance.band`
  legt den Bandnamen fest statt der Tages-Band. Gespräche: Erinnerungen mit den Tags `kino` und `tourshirt` (Oli, Thalia, Lars).
- **Nichts geht für immer verloren:** Werkzeuge und einmalige Geschenke (Möbel mit `gift: true`, außer Kunst) sind
  Erinnerungsstücke (`isKeepsake`): unverkäuflich (`price: null`) und nicht verschenkbar. Fehlt beim Laden etwas, das
  Lina haben sollte (`missingKeepsakes`: Omas Werkzeuge, Thalias Schaufel, Olis Einzugsmöbel), kommt es zurück.
  Wichtige Übergaben laufen über `World3D.giveOrDrop` – bei voller Tasche landet es vor Linas Füßen. Jede Samensorte
  braucht eine Quelle außer der eigenen Blüte (Test in `data/keepsakes.test.ts`).
- **Winston wird gefunden:** Neue Spiele starten ohne Winston (`winstonNochNicht`). Etwa 2½ Minuten Spielzeit nach Omas Werkzeugen
  (`WINSTON_DELAY_SECONDS`, `game/pet.ts → winstonDue`) fiept es von der Wiese hinter Linas Haus; dort sitzt ein kleiner Dackel im
  Gestrüpp verfangen (`WINSTON_SPOT`, `Winston.strand`). Lina geht hin, wann sie mag, und befreit ihn („🤲 Vorsichtig befreien“);
  das Schildchen am Halsband verrät den Namen, und er folgt ihr ab jetzt (`winstonGefunden`). Oma kommentiert es beim nächsten
  Gespräch einmal. **Olafs Ankündigung braucht diesen Fund** (Meilenstein, Omas Hinweis: „Hörst du das Fiepen?“). Zeilen, die
  „Winston“ nennen, kommen erst dran, wenn er da ist (Tag `winston-da`, `core/dialogue.ts`). Ältere Spielstände haben Winston
  weiter von Anfang an (`winstonState` setzt das Flag nach).
- **Winston:** läuft auf Linas eigener Spur hinterher (bleibt nie an Ecken hängen), setzt sich neben sie,
  wenn sie stehen bleibt. Texte & Funde in `data/winston.ts`. Er buddelt, wenn Lina kurz stehen bleibt – **verpasste Tage sammeln sich bis zu
  3 Fundstellen an** (`DIG_DAYS_MAX`, `core/pet.ts`).
- **Linas Lieblinge (Persönlichkeit, Nov. 2026):** Lina mag Bento-Boxen, Wärmflaschen, schwere Decken, Pflanzen, Käse und viel Schlaf – eingebaut als Inhalt ohne neues System:
  **Bett mit Gewichtsdecke** (Katalog, 3 Farben, auch Olis Schlafplatz), **Kaktus**, **Sukkulenten-Schale**, **Yucca-Palme**, **Efeutute** (Pflanzen, Katalog), **Wärmflasche** (Omas Brief),
  **Bento-Box-Deko** (Jens' Brief); Essen: **Käse** (Jens schenkt gelegentlich ein Stück, `dailyTreat`), Käse-Omelett (Rezept beim ersten Käse), überbackene Kartoffeln, Käsebrett und
  **Bento-Box** (Rezepte von Anfang an). Dazu Plauderzeilen (Oli, Lars, Oma, Jens) und Erinnerungen mit den Tags `pflanzen-viele`, `bett`, `waermflasche`; das Liegen im Bett hat mehrere Sprüche.
- **Französisches Bistro:** zwölfter Katalog-Stil (`style: 'bistro'`, 11 Möbel, 2 Tapeten, Bistro-Fliesen). Er taucht im Katalog erst **ab Jens' Einzug** auf (`styleUnlocked` in `game/home.ts`);
  Spielstände, in denen Jens schon da ist, haben ihn sofort. Alle anderen Stile bleiben von Anfang an frei.
- **Sammlung ausstellen (Audit F2/W6):** Drei Schaukästen zeigen, was Lina schon gefangen oder gefunden hat – **Insektenkasten** (Wand, 24 Plätze, 1 200 ⭐),
  **Fischtafel** (Wand, 17 Plätze, 1 000 ⭐) und die **Fossilien-Vitrine** (Thalias Geschenk, 12 Plätze). Jede Art hat einen festen Platz: gesammelt = kleines Präparat,
  noch offen = leerer Punkt. Es gibt nichts zu bedienen; `Interior3D.collected` (Sammelbuch-Einträge) fließt in `makeFurniture(…, collected)` ein, das Zimmer baut sich
  beim Betreten bzw. bei geänderter Sammlung neu auf.
- **Fischgerichte (Audit F2/W6):** Sieben Gerichte nutzen Fänge – Forelle mit Kräutern, Karpfen mit Kartoffeln, Scholle mit Bratkartoffeln, Geräucherte Makrele (mit Ästen),
  Dorsch auf Gemüsebett, Aal grün und Steinbutt aus dem Ofen. Das Rezept fällt Lina **beim ersten Fang** der Art ein (`fund`); Margen 1,6–1,8×. Bewohner mögen sie
  (Olaf, Lars, Jens, Oma, Oli). Jedes Essen hat ein eigenes Symbol (Test `fischgerichte.test.ts`).
- **Werkbank:** Rezepte in `data/recipes.ts` (`start`, `fund` = beim ersten Fund, sonst als Brief-Geschenk
  `rezept-<id>` – Rezeptkarten werden beim Annehmen sofort gelernt). Ergebnisse sind Möbel mit
  `crafted: true` (nicht im Katalog). Ein Test prüft, dass jedes Rezept erreichbar ist.
- **Garten:** `data/yard.ts` (`YARD_AREA`) legt Linas Grundstück fest. Gartensachen sind Möbel mit
  `outdoor: true` (Stil „garten“) und nutzen dieselbe Raumlogik wie drinnen (`currentRoom` = Garten, wenn
  Lina draußen ist). Sie blockieren die Karte über `WorldMap.extra` (`session.syncYardCollision()`); Wege und
  Tore nicht. `keepsAccess` verhindert, dass etwas Wichtiges unerreichbar wird. Hochbeete sind Pflanzplätze.
- **Oli:** wohnt in Linas Haus (`home: 'haus-lina'`). Ist er „zu Hause“ und Lina drinnen, zeigt World3D ihn im
  Zimmer (`updateHomeOli`: Platz je nach Tagesablauf-Label an Schreibtisch/Kaffeemaschine/Hantelbank, nachts
  auf dem Futon). Gemeinsame Momente in `game/romance.ts`, Tage in `world.dates`. **Küsschen** so oft man mag
  (Gesprächswahl „😘 Küsschen geben“, erstes am Tag zählt): `World3D.kissScene` – beide beugen sich vor, Augen zu,
  Lina auf Zehenspitzen, „Mwah“ (`sfx: 'kuss'`), Herzchen. Kommt Lina heim, holt Oli sie mit einem Begrüßungsküsschen
  ab (`homeOliComes`, läuft im Zimmer zu ihr); zu Hause gibt's ab und zu auch spontan eins.
- **Oli in Stufen:** (`data/oliStufen.ts`, `game/romance.ts`) Die Beziehung entwickelt sich mit den Herzen – mit **Inhalt statt Punkten**:
  „💬 Zeit zu zweit“ im Gespräch spielt **eine Szene je Herz** (1–5: Ankommen, Pläne fürs Zimmer, Kochen zu zweit, Am Fenster, Danke Lini),
  nacheinander und je einmal, ohne Freundschaftspunkte (`nextStageScene`/`playStageScene`). Ist Olis Herzenswunsch erfüllt, gibt es **„🌅 Zur Herzbank“**
  (einmal am Tag, 8–23 Uhr, kein Regen): Lina und Oli sitzen nebeneinander auf der Bank am Strand, Zeilen je **Jahreszeit und Tageszeit** (`BENCH_LINES`), +8 Punkte.
  **Jubiläen:** Briefe mit Strauß 100 Tage und 1 Jahr nach Olis Einzug (`checkOliAnniversaries`, gezählt ab `world.dates['oli-einzug']`; ältere Spielstände ab dem ersten Aufruf).
  Picknick, Sterne gucken, Küsschen & Co. bleiben wie sie waren.
- **Sternbilder (E3):** Beim Sterne gucken (Date mit Oli) leuchtet im Himmels-Overlay das **Sternbild der Jahreszeit** auf – Frühling Großer Wagen, Sommer Schwan,
  Herbst Kassiopeia, Winter Orion (`data/sternbilder.ts`, Sterne erscheinen, dann ziehen sich die Linien, zuletzt der Name). Oli erklärt es mit zwei Zeilen vor dem
  bisherigen Gespräch (`game/romance.ts`).
- **Jens:** Bistro = Kartenobjekt `bistro` (`bistro-jens`, ersetzt `bauplatz-3`). Kochen nutzt dieselben Rezepte
  wie die Werkbank (`station: 'kueche'` in `data/recipes.ts`, Fenster `CraftPanel` mit `station="kueche"`).
  `NpcDef.away(day)` = verreist (dann Postkarte mit Andenken, `travelPostcard`, in `game/story.ts`).
- **Lars:** Praxis = Kartenobjekt `praxis` (`praxis-lars`, ersetzt `bauplatz-2` am Dorfplatz). Tees sind
  Rezepte mit `station: 'apotheke'`. Gesundheits-Check 1×/Tag (`world.dates.checkup`). Einzugsszenen laufen
  über `World3D.npcArrival(id, welcome, side)`.
- **Thalia:** Grabstellen = `todaysDigSpots` (`game/digging.ts`, reproduzierbar pro Datum, Funde in
  `data/fossils.ts`, Sammelbuch-Reiter „Funde“). Party samstags 19–22 Uhr (`game/party.ts`): `Npc` ersetzt dann
  den Tagesablauf durch `PARTY_ENTRY`, Lichterketten in World3D. Dorfkarte = `ui/MapPanel.tsx` (Taste M),
  Positionen über `session.livePositions()`.
- **Geburtstage der Bewohner:** Lars 03.01., Christin 04.06., Olaf & Jens (Zwillinge) 03.04., Oli 29.07., Thalia 11.08. (Oma: noch offen) – `NpcDef.birthday` + `birthdayLines`; Geschenke am Geburtstag zählen doppelt,
  Tags `geburtstag-<id>` / `bald-geburtstag-<id>` (7 Tage vorher).
- **Bäume fällen:** Im Garten gestalten (draußen) auf einen Baum, eine Kiefer oder einen Busch in Linas Garten klicken → „fällen?“ → Äste, dauerhaft weg (Flag `gefaellt-<id>`, `until` der Naturobjekte in `core/worldmap.ts`).
- **Treffen der Bewohner:** Spricht Lina ein Mitglied während eines Treffens an, geht es zuerst auf das Gespräch mit den anderen ein (`MeetupDef.replies`, `meetupReply`).
- **Treffen der Bewohner (Technik):** `data/meetups.ts` (Wochentage, Uhrzeit, Plätze, Gespräche), Regeln in
  `game/meetups.ts`; `Npc` ersetzt den Tagesablauf (Reihenfolge: Party → Sonntagsessen → Treffen → Plan).
  `Npc.snap()` setzt alle beim Laden sofort an den richtigen Platz. Fünf Treffen, darunter ein **Abendtreffen** (Thalia & Lars: *Sonnenuntergang am Strand*, Mo/Do 18–20 Uhr).
- **Abend-Erreichbarkeit (Audit F1):** Jede Fisch-/Insektenart ist zwischen 18 und 22 Uhr irgendwann zu finden (Test `species.evening.test.ts`). Die elf reinen Tagarten
  (Tagfalter, Honigbiene, Grashüpfer, Prachtlibelle, Seepferdchen, Rosenkäfer, Winterhaft) sind bis **20 Uhr** da („Abendsonne“).
- **Kleidung:** `outfitFor(a, season, day)` – bei `'saison'` im Frühling/Herbst täglich ein anderes Teil aus
  `STREETWEAR_ROTATION`. Bewohner mit `NpcDef.wardrobe` ziehen sich per `dressFor` jeden Tag reproduzierbar um.
  `Chibi3D(appearance, season, day)`; Aufdrucke als gebogene Fläche vor dem Oberteil (`printDecal`), Galerie
  `?ansicht=kleidung`. Keine echten Marken-/Filmnamen auf Kleidung – eigene Designs.
- **Fernseher & Küche:** Sendungen in `data/tv.ts` (ausgedachte Formate, keine echten Sendungsnamen/Fälle/Personen).
  **Bewusst kein Kuschelfernsehen:** Nachrichten, Datingshow, Doku, True Crime, Horror und Kochshow zeigen ernste
  Themen nüchtern und ehrlich – als ironischer Bruch mit der Pastell-Welt. Grenzen: nichts Explizites, keine
  Gewaltdetails, niemand wird verspottet (die Doku nimmt ihre Protagonisten ernst). Regeln
  in `game/tv.ts` (Folge pro Tag, Oli schaut mit, Kochshow lehrt Rezepte mit `tv: true`). Linas Herd =
  `CraftPanel` mit `station="herd"` (Küchen-Rezepte zu Hause).
- **Poster & Bildbände (Lieblingsthemen):** `data/posters.ts` – ein Retro-Kaffee-Poster (Wand-Deko) und drei Coffee-Table-Books (kleine
  Bildbände für Tische): „Kaffee – eine Liebeserklärung“, Dr. Nos Memoiren „Ein Schritt. Dann noch einer.“ und „Kawaii“. Titel
  und Motive sind ausgedacht (keine echten Werke/Personen). Stil „Lieblingsthemen“ im Möbelkatalog. Gemalt wird in
  `gfx/posters.ts`, die 3D-Modelle (Poster mit Rahmen, Stapel Bildbände mit Cover oben) in `models/furniture.ts`. Neue Poster:
  Eintrag in `POSTERS` + Motiv in `MOTIFS`. (Horror- und Zauberschul-Poster wurden wieder entfernt – Lina mochte sie nicht.)
- **Kaffee:** Siebträgermaschinen in vier Preisklassen (`data/coffee.ts`, Möbel in `data/furniture.ts`): Einsteiger (650 ⭐, Espresso &
  Lungo), Olis `kaffeemaschine` (Geschenk, mit Dampflanze: + Americano & Cappuccino), Zweikreiser (3200 ⭐, eingebaute Mühle:
  + Café Crème, Latte Macchiato, Flat White) und Messing-Handhebelmaschine (8800 ⭐: + Latte-Art „Latte mit Herz“). Maschine
  anschauen → Klassiker oder Milchschaum → Getränk (`World3D.coffeeMenu`, Regeln in `game/coffee.ts`). Beigaben, alle freiwillig:
  **Kaffee-Kick** (Lina läuft bis zu 5 Spielminuten 22 % flotter, `Session.coffeeUntil`, nicht gespeichert), **Kaffee zu zweit**
  mit Oli (einmal am Tag Freundschaft, bessere Maschine = mehr Punkte, Latte-Art +4) und ein Spruch bei der fünften Tasse am
  Tag (Zähler `world.dates.kaffee` = „Datum:Anzahl“).
- **Dr. No (Hommage):** Linas Lieblingsarzt aus der Doku „Schwerer Weg“ ist eine **ausgedachte** Figur (keine echte Person, keine
  echte Sendung): strenger, ruhiger Chirurg mit buschigen Brauen und gütigen Augen, der Patienten ernst nimmt („Ein Schritt. Dann
  noch einer.“). Aussehen als Chibi (Wandporträt `bild-dr-no` in `world3d/models/furniture.ts`, Buchcover-Motiv `dr-no` in
  `gfx/posters.ts`): dunkles, zur Seite gekämmtes Haar mit grauen Schläfen, runde Drahtbrille, warmer Teint, leichtes Schmunzeln,
  weißer Kittel über dunkelblauem Polo, Stethoskop mit goldenem Kopf (Vorlage war ein Foto, das nicht im Repo liegt). Drei Folgen (`data/tv.ts`, `lina`-Reaktion + eigene `oli`-Sprüche pro Folge), das **Dr.-No-Porträt** (`bild-dr-no`,
  Wand-Deko im Möbelkatalog) und Kommentare von Oli, Lars, Jens und Oma.
- **Sammeltassen:** Lina sammelt Becher der (ausgedachten) Kaffeehaus-Kette „Sternenbohne“ (`data/tassen.ts`, 19 Stück): 3 **Klassik-Tassen**
  und 4 **Saison-Tassen** (Frühling/Sommer/Herbst/Winter, im Katalog nur in ihrer Jahreszeit, `FurnitureDef.inSeason`) kauft sie im
  Möbelkatalog (Stil „Lieblingsthemen“); 12 **Städte-Tassen** sind Geschenke: Onkel Jens schickt auf Reisen eine zweite Karte mit Tasse
  (`TRAVELS[].mug`, `travelMugLetter`; bei den neuen Städten Tokio, Wien, Lissabon, Leipzig ist die Tasse das Andenken), Thalia
  bringt Berlin und Reykjavík mit, Oli eine schwarze Klassik-Tasse. Tassen sind kleine Möbel (`tiny`) und stehen auf jedem Regal; das
  **Tassenbord** (`tassenbord`, Wand-Deko, 2 breit) hängt an der Wand und fasst **vier Tassen je Feld** (`FurnitureDef.slots`, Platz
  `PlacedItem.slot`, Lage `riderOffset`) – bis zu acht dicht an dicht, darunter darf ein niedriges Möbel stehen. Es zeigt per Anschauen
  den Stand der Sammlung (`game/tassen.ts`) und woher die fehlenden kommen. Das alte lange Standregal (`tassenregal`, `retired`) ist
  nicht mehr im Katalog, bleibt aber für alle, die es schon haben.
- **Hellerau-Regale:** drei Leiterregale im Stil „Mid-Century“ (nach der Dresdner Gartenstadt Hellerau benannt): `hellerau-regal`
  (Wand, 1 breit, drei Bretter), `hellerau-regalwand` (Wand, 2 breit, mit Schränkchen) und `hellerau-standregal` (Boden, vier Bretter,
  oben Platz für Kleinigkeiten), je in Sand, Weiß, Schwarz und Mint. Bücher & Pflänzchen sind schon drauf (`hellerauShelf` in
  `models/furniture.ts`).
- **Galerie:** Kunstwerke in `data/art.ts` (werden Möbel im Stil „kunst“, Bild auf Staffelei, gemalt in
  `gfx/art.ts`), Regeln in `game/gallery.ts`, gestiftete Bilder in `SaveData.gallery`.
- **Sonntagsessen:** `game/dinner.ts` – Gäste gehen per `{ kind: 'zuhause', at: 'bistro-jens' }` zu Jens
  ins Haus; Lina klopft an seine Tür (`visitBistro`).
- **Feste:** `core/festivals.ts` (welches Fest an welchem Datum, Ostern berechnet), Inhalte in
  `data/festivals.ts` (Geschenke & Sprüche je Bewohner), Regeln in `game/festivals.ts` (`festTalk` beim ersten
  Gespräch, Geschenk 1× pro Fest & Jahr über `world.dates`), Schmuck in `world3d/Festivals3D.ts`.
- **Christin:** gießt abends (ab 18:30, nach dem Angeln mit Olaf; sonntags nach dem Essen bei Jens – Tagesablauf „Gießt Linas Garten“) einmal alles in Linas Beeten, was
  noch durstig ist – nicht bei Regen (`game/christin.ts`, `world.dates.christinGiesst`, Dialog-Tag `beet-gegossen`).
  Im Gespräch „💡 Ordnungstipp?“: jeden Tag ein echter kleiner Spieltipp in ihrer Art (`CHRISTIN_TIPS`) – bewusst
  kein Lob fürs Aufräumen.
- **Winterzauber:** `data/winter.ts` + `game/winter.ts`. **Olis Adventskalender:** 1.–24. Dezember je ein Brief
  (`checkAdvent`, ID `advent-<jahr>-<tür>`), das 24. Türchen (Schneekugel `schneekugel-wir`) kommt notfalls bis
  Silvester; Rezeptkarten für Bratapfel & Zimtsterne (Herd/Kochstudio). **Schneebälle** liegen Dezember–Februar auf
  der Wiese (`todaysSnowballs`), 3 Schneebälle + 2 Äste = **Schneemann** an der Werkbank (Gartenmöbel; außerhalb des
  Winters zeigt das Modell ihn getaut – `setModelSeason` in `models/furniture.ts`). **Wintermöbel** (Stil
  „winter“, `seasonal: true`) stehen nur im Winter im Katalog. **Punschstand** = Kartenobjekt `punschstand`
  (`kind: 'stall'`, `requires: 'adventszeit'` – virtuelles Flag aus `syncMapObjects`, 1.–26. Dezember, 15–22 Uhr).
  **Kleine Freuden:** Fußspuren im Schnee (`Footprints3D`, auch Winstons Pfoten), Atemwölkchen bei Kälte
  (Fx `atem`), Leerlauf „Flocken fangen“, wenn es schneit.
- **Tiere:** Ställe sind Gartenmöbel mit `coop: 'huhn' | 'wachtel'`, die Tiere kommen mit (`data/animals.ts`).
  Abholtage in `world.coopDay`; Logik in `core/coop.ts` & `game/animals.ts`. **Eier sammeln sich bis zu 3 Tage im Nest an**
  (`EGG_DAYS_MAX`, `eggsWaiting`): Wer einen Tag auslässt, verpasst nichts; ein neuer Stall hat nur die Eier von heute.
