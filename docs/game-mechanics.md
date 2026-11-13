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
  Gespräch (`flagHints` für Flag-Bedingungen, z. B. Lars zum ersten Hausausbau). Seit Audit 3: Jens 3 gebaut + 6 Sammelbuch,
  Lars 3 gekocht + 5 000 ⭐, Thalia Check-up + 8 Sammelbuch + erster Ausbau bestellt (abgeleitetes Flag `ausbauBestellt`);
  Sammelbuch-Ziele winter-sicher (Test `data/progress.test.ts`). **Echtzeit bleibt** für Tag/Nacht, Jahreszeiten, Wetter, Feste, Geburtstage, Tägliches, Treffen,
  Party, Sonntagsessen und Jens' Reisen.
- **Post nur von Bewohnern, die da sind:** Nach der Ankündigung (Brief) kommt keine weitere Post, keine Herz-Briefe und keine Kontoauszüge, bis der Bewohner eingezogen **und** begrüßt ist (`hasMovedIn` in `game/gameplay.ts`).
- **Einzüge:** `NpcDef.movesIn` = Story-Flag; Kartenobjekte mit `requires`/`until` erscheinen/verschwinden
  per Flag (`applyMapFlags`, z. B. Bauplatz → Haus). Ablauf in `game/story.ts`.
- **Bewohner:** Daten in `src/data/npcs/<id>.ts` (Aussehen, Haus, Tagesablauf, Vorlieben, Dialog-Pools,
  Briefe). Ein neuer Bewohner braucht: Datei + Eintrag in `npcs/index.ts` + Haus/Bank in `VILLAGE_OBJECTS`.
  Dialogzeilen haben Bedingungen (`when`) und Gewichte; ausgewählt wird reproduzierbar pro Tag. Jeder Bewohner hat mind. 30 Plauderzeilen (Test `dialoguePools.test.ts`), die
  kleineren Pools zusätzlich Zeilen je Jahreszeit.
- **Einrichtung der Bewohner-Häuser (Nov. 2026):** Schränke und Regale stehen an den Wänden (Test in `gastHaeuser.test.ts`), nur Tresen/Schreibtisch dürfen bewusst trennen. Thalia: schlicht & Mid-Century (Teak-Sideboard, Loungesofa, Ledersessel, Bogenlampe) mit dem Kalender **„Padre del Mese“** (`priesterkalender`, auch im Möbelkatalog); Praxis Dr. Lars: Wartebereich, Schreibtisch mit PC, Lars' Stuhl dahinter und zwei Patientenstühle gegenüber; Olaf & Christin: Sofa gegenüber vom Fernseher, Teppich, Stehlampe; Oma: Wohnzimmer mit Sessel, Wollkorb, Teppich; Jens: Tresen & Regale an der Wand. `GuestItem.variant` wählt die Farbe.
- **Türen bleiben frei:** Kein Bewohner steht beim „Stehen“ auf dem Feld, von dem aus Lina eine Tür benutzt (Test in `dialoguePools.test.ts`). Olaf steht an der Dorfkasse jetzt ein Feld rechts von der Haustür.
- **Bewohner zu Hause antreffen (Nov. 2026):** Klopft Lina an ein Haus, in dem die Bewohnerin/der Bewohner gerade zu Hause (und wach) ist, steht sie/er beim Hineingehen im Zimmer und lässt sich ansprechen (`updateGuestResidents` in `World3D`; bei Olaf & Christin beide). Dafür sind Olaf (Mittagessen 12:30), Lars und Thalia (Mittagspause 12:30) mittags jetzt auch mal zu Hause – Gisela, Jens, Christin und Oli waren es schon.
- **Hantelbank:** Beim Stemmen kommen mit dem Gewicht Scheiben dazu (20 kg = Grundscheiben, 220 kg = alle sechs Paare, Stufe je Toast); Oli stemmt mit der Grundausstattung.
- **Kubistisches Gemälde:** Statt des Kreuzstichbilds „Trautes Heim“ gibt es von Jens das futuristisch-kubistische Gemälde „Zukunft in Würfeln“ (ID `kunst-stickbild` bleibt für alte Spielstände).
- **Insider (Nov. 2026):** Je 3–6 neue Plauderzeilen (`dialogue.chat`) zu Insider-Infos aus dem Freundeskreis: Jens & Olaf nennen sich „Frère“, Videospiele (Oli & Lars: Dark Souls, GTA V, Fallout 3, Halo), Thalias und Linas Tschechien-Reise, Feierabendbier (Lars, Lina – dezent & humorvoll), der Comic „Das kleine Arschloch“ (Olaf mag ihn, Christin nicht), Giselas Herkunft Dessau, Olafs & Christins Ostsee-Zeit, Linas Plan, Thalia zu verkuppeln. Titel und Biername sind auf Wunsch echt; nur Logos/Marken-Grafiken gibt es weiterhin nicht. **Freundeskreis (Nov. 2026):** Plauderzeilen zu Jens’ Freunden Stefan (IT), Steffen (San Francisco) und Andreas „Brocki“ (Ethnologe), Olis Freund Mo (Thalia findet ihn süß – passt zu Linas Verkupplungsplan; von Mo selbst kommt dazu nichts), Lars’ Freund Ronny (Polizist) und Lars’ Sumo-Leidenschaft, Lina & Oli mit „Berserk“ und „The Sopranos“, Oli mit „Blade Runner“ und „Dune“. Die Freunde tauchen nur in Gesprächen auf, nicht als Figuren.
- **Reaktionen auf die Einrichtung:** Dieselben Erinnerungen kennen jetzt auch Linas Einrichtung (Tags in `memoryTags`): Stile ab vier Stücken im Haus (`stil-japanisch/cottage/retro/modern/midcentury`, Bistro ab drei), edles Parkett (`parkett-edel`: Chevron, Fischgrät, Würfel-, Schiffs-, Tafelparkett), einfarbige Tapete (`tapete-uni`) und ein gut gefüllter Garten (`garten-deko`, ab 8 Dingen). Jeder Bewohner hat dazu 1–3 Sätze, immer freundlich (auch Gisela meckert liebevoll) – **keine Bewertung, keine Punkte, nichts Verpflichtendes**; die Zeile kommt einmal von selbst, danach selten beim Plaudern.
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
- **Sammlung ausstellen (Audit F2/W6):** Drei Schaukästen zeigen, was Lina schon gefangen oder gefunden hat – **Insektenkasten** (Wand, 30 Plätze, 1 200 ⭐),
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
- **Häuser der Bewohner von innen (Nov. 2026):** Omas Haus, das Haus von Olaf & Christin und Thalias Häuschen sind betretbar (Tür → „Hineingehen“, nicht beim Schlafen). Ebenso **Lars' Praxis** (Wartezimmer, Skelett, Spruchtafel) und **Chez Jens** (Zinktresen, Bistrotische, Gemälde): dort steht „🚪 Hineingehen“ neben Apotheke bzw. Kochstudio/Galerie; Sonntagsessen & „Bin auf Reisen“ bleiben unverändert. Jedes ist ein Zimmer aus vorhandenen Möbeln (`data/gastHaeuser.ts`); Lina kommentiert Einrichtung und Möbel (Interaktion mit dem Möbel), kann sich setzen, aber nicht einrichten (kein „G“, kein Oli). `session.visiting` (wird nicht gespeichert), `currentRoom` liefert den Gastraum, `World3D.enterGuest`.
- **Hantelbank & Olis Computer (Nov. 2026):** Lina kann auf der Hantelbank **stemmen** (Möbel ansehen → „💪 Stemmen“): ~9 s Bankdrücken mit zusätzlichen Scheiben und steigendem Gewicht (bis 220 kg – süßes Lächeln, brutales Gewicht; Text in `data/training.ts`, `World3D.trainLina`). Ist Oli im Zimmer, ist er begeistert (bewusst **ohne** Freundschaftspunkte – Gag statt Tages-Abholung, Audit 3). Am Schreibtisch mit Computer startet „🎮 Eine Runde spielen“ das Minispiel **Dackel-Snake** (Winston sammelt Leckerli; Ränder weich, ohne Scheitern; Logik `core/snake.ts`, Fenster `ui/MiniGamePanel.tsx`; Rekord bleibt im Spielstand: `world.dates['snake-rekord']`).
- **Tastatur in Fenstern (Audit 3):** Pfeiltasten springen in jedem Fenster von Knopf zu Knopf, Enter drückt den fokussierten Knopf (`ui/navigation.ts`). Zusätzlich löst Enter den **Hauptknopf** aus, solange kein Aktionsknopf fokussiert ist (`enterForPrimary`): Katalog (kaufen), Werkbank/Küche/Apotheke (bauen/kochen), Galerie (Bild des Tages kaufen), Briefkasten (Geschenk einstecken). Dorfkasse und Truhe bewusst ohne diese Abkürzung (kein einzelner Hauptknopf; Kredit aufnehmen bleibt eine bewusste Entscheidung).
- **Einfarbige Tapeten & Parkett (Nov. 2026):** 17 **einfarbige Wände** (Weiß, Sand, Grau, Rosa, Pfirsich, Butter, Mint, Salbei, Himmel, Flieder, Taupe, Graublau, Petrol, Waldgrün, Bordeaux, Nachtblau, Schwarz; Muster `flach`) und 13 **Parkettvarianten** (Chevron, Fischgrät in Weiß/Nussbaum/Ebenholz, Würfelparkett, Schiffsboden, Tafelparkett; Muster `chevron`, `flecht`, `schiff`, `tafel` in `gfx/interior.ts`, Daten in `data/furniture.ts`). Preise 250–450 ⭐ (Wände) bzw. 850–1 400 ⭐ (Parkett).
- **Helle Böden & grafische Muster:** 11 weitere, **hellere und schlichtere Böden** (weiß gekalkte, Birken-, Ahorn-, Eschen- und hellgraue Dielen; Chevron Birke/Weiß, Fischgrät Birke, Schiffsboden Weiß, Tafelparkett Ahorn) sowie ein **Schwarz-Weiß-Zickzack-Boden** (`zickzack`), dazu die Tapeten **Roter Samtvorhang** (`vorhang`) und **Tannenwald** (`tannen`). Muster in `gfx/interior.ts`, Einträge in `data/furniture.ts`.
- **Zusammenhängendes Haus (Haus-Grundriss Phase C):** Das Erdgeschoss ist **ein Grundriss**: Wohnzimmer vorne, Schlafzimmer dahinter, Wintergarten links, Küche rechts; Lina läuft ohne Umblenden durch die Türen (Details & Technik: [`haus-grundriss.md`](haus-grundriss.md)). Beim Einrichten (G) sieht man das ganze Stockwerk und kann in jedem Raum aufstellen. Die Kamera lässt sich dabei mit **WASD/Pfeilen oder per Maus ziehen** (Linksklick auf freie Fläche, ohne Möbel in der Hand; rechte/mittlere Taste immer) schwenken, das Mausrad zoomt. Dach und Keller sind Etagen mit Treppe.
- **Möbelkatalog neu geordnet (Nov. 2026):** Drei Filterzeilen statt einer langen Stil-Leiste: **Kategorie** (Möbel, Pflanzen, Tapeten, Böden, Lieblingsthemen, Garten, im Winter Winterzauber), **Typ** (z. B. Sofas & Sessel, Lampen, Teppiche; je Kategorie eigene Liste) und **Einrichtungsstil**. Ein Stück darf **mehrere Stile** haben (Holzregal: Skandinavisch + Minimalismus) oder **keinen** („Ohne Stil“: Pflanzen, Grundausstattung, Garten, Lieblingsthemen). Der Stil bleibt beim Kategoriewechsel stehen (Japandi-Möbel → Japandi-Böden); Typen/Stile ohne Treffer werden gar nicht erst angeboten. **16 Stile:** Japanisch, Japandi, Minimalismus, Skandinavisch, Contemporary (früher „Modern“), Mid-Century-Modern (inkl. Bauhaus), Cottagecore, Retro-Oma-Chic, Französisches Bistro, Art déco, Memphis, Dark Academia, Brutalismus, Industrial, Space Age, Cyberpunk (Organic Modern und Mediterranean Modern bewusst nicht). Einige kommen mit Einzügen: **Olaf & Christin** → Minimalismus, Skandinavisch; **Jens** → Bistro, Art déco, Memphis; **Thalia** → Dark Academia, Brutalismus; **Lars** → Industrial; **Oli** → Space Age, Cyberpunk. Ein Stil-Chip erscheint erst, wenn der Stil frei ist **und** es Stücke dafür gibt; was schon im Katalog war, bleibt immer da (die Freischaltung hängt an der „Linie“ `FurnitureDef.style`, die Stil-Schilder filtern nur). **Tastatur:** ↑/↓ Zeile (im Raster zeilenweise), ←/→ Wert, Bild↑/↓ Kategorie, Enter kauft, Esc schließt – Lina und Kamera bleiben dabei stehen. Ordnung in `data/catalog.ts`, Filter in `game/catalog.ts`, Tastatur-Zustandsmaschine `ui/catalogNav.ts`, Bestandsaufnahme & Lücken je Stil in [`katalog-ueberarbeitung.md`](katalog-ueberarbeitung.md). Kein neues Speicherformat. **Feinschliff:** Typ- und Stilzeile stehen immer da (ausgegraut, wenn es nichts zu wählen gibt), die Detailspalte hat feste Zeilen (Name, Ort, Stil, Text, Farben, Preis), damit sich das Auge nicht neu orientieren muss; die aktive Zeile ist nur zart hinterlegt; statt Scrollbalken gibt es ◀ ▶ am Rand mit sanftem Ausblenden (Mausrad geht weiter), der aktive Chip rückt in die Mitte.
- **Neue Stile – Teil 1: Japandi, Skandinavisch, Minimalismus (Nov. 2026):** 15 neue Möbel, 2 Tapeten, 1 Boden. **Japandi** (sofort): Daybed, Lattenregal, Papierkugel-Leuchte, Bild „Eine Linie“, Lehmputz- und Holzlatten-Wand (neue Muster `putz`, `latten` in `gfx/interior.ts`). **Skandinavisch** (mit Olaf & Christin): Skandi-Sofa, Schaukelstuhl, runder Eichentisch, Eichenstuhl, Rautenteppich, Schaffell. **Minimalismus** (mit Olaf & Christin): Kubus-Sofa, Plattformbett, Linienleuchte, Plattentisch, Wollteppich, Mikrozement-Boden. Die neuen Stücke haben ihren Stil als Linie (`FurnitureDef.style`), dadurch erscheinen sie mit dem passenden Einzug; viele tragen zusätzlich Nachbarstile (z. B. Eichenstuhl: Skandinavisch + Japandi). Preise im Rahmen der bestehenden Stile (300–2000 ⭐).
- **Neue Stile – Teil 2: Dark Academia, Art déco, Industrial (Nov. 2026):** 13 neue Möbel, 2 Tapeten. **Dark Academia** (mit Thalia): Bücherwand, Sekretär, Chesterfield-Sofa, Alte Weltkarte (ausgedachte Karte als Canvas-Textur), Dunkle Holzvertäfelung. **Art déco** (mit Jens): Muschelsessel, Etagen-Stehlampe, Barschrank, Fächerteppich, Fächer-Tapete (Muster `faecher`). **Industrial** (mit Lars): Vintage-Ledersofa, Rohrregal, Fabrik-Stehleuchte, Verwaschener Teppich, Bahnhofsuhr. Preise 650–2300 ⭐.
- **Neue Stile – Teil 3: Space Age & Cyberpunk (Nov. 2026, kommen mit Oli):** 12 neue Möbel, 2 Tapeten, 2 Böden. **Space Age:** Kugelsessel (4 Farben), Tulpentisch, Kapselregal, Lavalampe (4 Farben, klein), Planetenteppich, Orbit-Tapete, weißer Glanzboden. **Cyberpunk:** Gaming-Stuhl, Neon-Sofa (Lichtstreifen), Zocker-Schreibtisch mit zwei Bildschirmen, Blinkregal, Neon-Schriftzug „GG“, Leuchtstab, Gitterteppich, Neon-Gitter-Tapete, Riffelblech-Boden (neue Muster `gitter`, `orbit`, `riffel`). Preise 380–2200 ⭐.
- **Neue Stile – Teil 4: Brutalismus & Memphis (Nov. 2026):** 11 neue Möbel, 2 Tapeten, 1 Boden. **Brutalismus** (mit Thalia): Betonsofa (4 Polsterfarben), Betonblock-Tisch, Blockregal, Betonleuchte, Filzteppich, Betonrelief, Sichtbeton-Tapete (Muster `sichtbeton`). **Memphis** (mit Jens): Memphis-Sessel (4 Farben), Terrazzo-Tisch, Totem-Regal, Kegel-Lampe, Kringel-Teppich, Memphis-Tapete (Muster `memphis`), Bunter Terrazzo-Boden. Damit haben alle 16 Einrichtungsstile ein Kernsortiment (Test).
- **Reaktionen auf die neuen Stile (Nov. 2026):** Ab vier Stücken eines neuen Stils im Haus sagen je zwei passende Bewohner etwas dazu (Tags `stil-japandi`, `stil-minimalismus`, `stil-skandinavisch`, `stil-industrial`, `stil-darkacademia`, `stil-artdeco`, `stil-spaceage`, `stil-cyberpunk`, `stil-brutalismus`, `stil-memphis`): Christin & Oli zu Japandi, Christin & Gisela zum Minimalismus, Olaf (Ostsee!) & Christin zu Skandinavisch, Lars (Bier, in Maßen) & Olaf zu Industrial, Thalia & Jens zu Dark Academia, Jens & Gisela (Dessau/Bauhaus) zu Art déco, Oli & Thalia zu Space Age, Oli (Dark Souls) & Lars (Fallout 3) zu Cyberpunk, Thalia (Gestein) & Olaf (Wortwitz) zum Brutalismus, Jens & Christin zu Memphis. Ein Stück zählt jetzt für seine Linie **und** alle seine Stile (Eichenstuhl → Skandinavisch und Japandi) – das gilt auch für die alten Stil-Reaktionen. Wie immer: einmal von selbst, danach selten beim Plaudern, nie eine Wertung.
- **Fenster ohne Extra-Scrollen (Nov. 2026):** Die Knopfleiste eines Fensters (`.card-actions`) bleibt immer sichtbar – scrollt ein Fenster doch einmal, klebt sie unten am Rand. Vorratstruhe: Tasche und Truhe scrollen innen, „Fertig“ steht fest. Samenstand: nur die Samenliste scrollt. Dorfkarte und Dackel-Snake schrumpfen mit dem Bildschirm, die Dorfkasse ist auf breiten Bildschirmen zweispaltig (Ausbau | Sparbuch). Geprüft bei 1280×720, 1366×768 und 1280×640. Dackel-Snake hat jetzt (wie Tasche und Katalog) eine eigene Pfeiltasten-Steuerung, die die allgemeine Fenster-Navigation nicht mehr abfängt.
- **Lange Beschreibungen im Katalog (Nov. 2026):** Passt die Beschreibung nicht in die feste Detailspalte, steht unten „… weiterlesen (Leertaste)“. Leertaste oder Klick öffnet den ganzen Text als Ebene über der Detailspalte; Leertaste, Esc oder Klick schließt sie (Esc schließt erst die Ebene, dann den Katalog). Beim Weiterblättern geht sie von selbst zu.
- **Besondere Stücke (Nov. 2026):** neuer Möbel-Typ „Besonderes“ im Katalog; alles sofort erhältlich: **Kamin** (knistert das ganze Jahr, leuchtet), **Aquarium** (Fische, blaues Licht), **Spielautomat** (für Oli & Lars), **Jukebox**, **Teleskop**, dazu **Hängesessel** (4 Farben, man kann sich hineinsetzen), **Retro-Kühlschrank** (5 Farben, Küche & Technik), **Pflanzenleiter** (Pflanzen) und **Popcorn-Maschine** (Lieblingsthemen › Filme, für Horrorfilmabende). Preise 450–2600 ⭐; sie tragen passende Stil-Schilder (z. B. Kamin: Dark Academia, Cottagecore, Retro).
- **Bauhaus als eigener Stil (Nov. 2026):** 17. Einrichtungsstil, von Anfang an da (vorher Teil von Mid-Century-Modern). 13 Stücke: Wassily Chair, Cesca Chair, Barcelona Chair, Laccio Chair & Table, Mies-Sofa (Knoll), Barcelona Couch, LC4 Chaise Longue, Wagenfeld- und Kandem-Leuchte, Breuer-Regal, Bauhaus-Wandschrank, modulares Stahlrohrregal (Stahlrohr-Modelle über `steelTube`, gesteppte Polster über `tufted` in `world3d/models/furniture.ts`). Freischwinger, Formen-Teppich/-Bild, Bauhaus-Tapete, Schachbrett-Boden und Opalglas-Leuchte tragen zusätzlich das Bauhaus-Schild. Reaktionen: Oma Gisela (aus Dessau!) und Jens (`stil-bauhaus`). Die Designnamen sind auf Wunsch die echten Klassiker-Namen.
- **Schräge Beine richtig herum (Nov. 2026):** Dreibeine und gespreizte Möbelbeine stehen unten breiter als oben (Teleskop, Dreibein-Stehlampe, Fabrikleuchte, Eichentisch & -stuhl, Skandi-Sofa, Teak-Sideboard, Ast-Hocker).
- **Kochen, wenn Jens verreist ist (Nov. 2026):** Das Bistro-Schild sagt jetzt, dass der Schlüssel fürs Kochstudio unter der Fußmatte liegt – „🍳 Ins Kochstudio“ öffnet es trotzdem. Zu Hause geht Kochen ohnehin an der eigenen **Küchenzeile** (Katalog bzw. Wohnküche), mit denselben Rezepten (`CraftPanel station="herd"`).
- **Fenster mit fester Größe:** Postfach (Briefliste & Brief scrollen innen) und Tasche/Verkaufen (Beschreibung scrollt innen) wachsen nicht mehr mit dem Inhalt. Nachgemessen: Postfach, Tasche, Verkaufen, Sammelbuch, Galerie, Truhe, Werkbank/Küche/Apotheke, Samenstand, Notizbuch, TV bleiben beim Durchklicken gleich groß.
- **Linas Lieblingsgetränke:** Coca-Cola Zero und Monster Energy White kommen in Plaudereien von Oli, Lars, Thalia und Oma vor und stehen im Retro-Kühlschrank (Namen auf Wunsch echt, keine Logos).
- **Sternchen-Balancing (Nov. 2026):** Fische und Insekten bringen das 1,5-Fache (`CATCH_PRICE_FACTOR`), Fischgerichte sind entsprechend mehr wert. Hausausbau günstiger: 9 800 · 17 800 · 27 800 · 37 800 · 47 800 · 59 800 (zusammen 200 800). In der Dorfkasse gibt es zwei Wege: **„Vom Sparbuch“** (Olafs Bausparen – Lina zahlt 75 %, Papa legt 25 % dazu, kein Kredit; bis Nov. 2026 15 %) oder **„Als Kredit“** wie bisher (`orderExpansion(session, 'sparbuch' | 'kredit')`). Sparbuch-Zinsen kommen jeden Montag (5 %, höchstens 2 500 ⭐, bis zu 26 verpasste Wochen werden nachgeholt, `core/bank.ts`); der Kontoauszug-Brief kommt höchstens einmal im Monat. Spielstand v15: der alte Zinsmonat wird zur Woche des Monatsersten.
- **Neue Stile werden angekündigt (Audit 4, K1):** Wer einzieht, bringt Einrichtungsstile mit (`arrivesWith` in `data/catalog.ts`) und sagt es am Ende der Einzugsszene in der eigenen Stimme (`STYLE_ARRIVAL_LINES`, Teil der `…_WELCOME`-Texte, z. B. Thalia: Dark Academia & Brutalismus). Im Katalog trägt der Stil-Chip ein kleines **„neu“**, bis Lina den Stil einmal angeschaut hat (Flag `stil-gesehen-<stil>`, `game/catalog.ts → isNewStyle/markStyleSeen`). Kein Pflichttext, keine Liste. **Katalog-Budget** (K3): `game/catalogBudget.test.ts` begrenzt Summe (≤ 300 000 ⭐) und Möbel-Median (≤ 1 000 ⭐).
- **Herzen-Hinweis (Nov. 2026):** Oma Gisela sagt bei der ersten Begegnung (`GISELA_WELCOME_2`), dass Herzen wachsen, wenn man plaudert, etwas schenkt oder dazusitzt – ohne Pflicht, ohne Zahlen. Die Übersicht aller Quellen (Gespräch 8, Geschenk 30/16/8/2, Wünsche 30, Treffen 8, Sonntagsessen, Check-up, Galerie, Party …) steht in `core/friendship.ts` und den jeweiligen `game/*.ts`-Dateien.
- **Thalias Charakter (Nov. 2026):** Thalia ist Geografin von Beruf, aber ihr Herz gehört dem **Sport (Fitnessstudio, gern mit Lina)** und dem **Feiern (Clubs, Hauspartys, Samstagsparty)**. Gesteine/Fossilien bleiben als Feature (Schaufel, Ausgraben, Vitrine), kommen aber in ihren Gesprächen (`data/npcs/thalia.ts`), im Tagesablauf (joggt, dehnt sich, sucht ein Party-Outfit), in Briefen, Treffen (`data/meetups.ts`) und in ihrer Wohnung (`data/gastHaeuser.ts`: Hantelbank, Discokugel, Barhocker, Plattenspieler statt Ammonit & Karte) nur noch beiläufig vor. `data/thaliaCharakter.test.ts` hält das Verhältnis fest.
- **Schummrig werden (Nov. 2026):** Lina kann am **Tresen** (Café bei Jens, auch ein eigener Zinktresen), am **Retro-Kühlschrank** (Bier, Cola Zero, Wasser) und am **Weinregal** ein Glas Bier oder Wein trinken (aufs Haus, keine Kosten). Dann wird sie **schummrig**: Das Bild wird unscharf und wackelt leicht, sie torkelt (Laufrichtung pendelt, Körper schwankt) und ist etwas langsamer (`core/tipsy.ts`, `World3D.updateTipsy`, `Character3D.drift/lean`). Ein Glas lässt **nach etwa einer Minute** von selbst nach (weich, ohne Sprung); nach drei Gläsern in kurzer Zeit lehnt Lina selbst ab („lieber ein Wasser“), und **Wasser macht sofort wieder klar**. Gelegentlich ein „*Hicks*“, am Ende „Die Welt steht wieder gerade“. Nichts wird gespeichert, es gibt keine Statistik, keinen Bonus, keine Folgen. Texte: `data/tipsy.ts`.
- **Musik draußen wechselt seltener (Nov. 2026):** Jedes Lied wird dreimal gespielt (leicht variiert, `SONG_ROUNDS`), bevor das nächste kommt (~2–3 Minuten statt ~50 s). Orts-Themen (an Häusern vorbei), Wetter und Tageszeit wechseln nur noch gedämpft (`gateMood`): erst wenn der Wunsch 20 s anhält und das aktuelle Lied mindestens 75 s lief. Rein/raus aus dem Haus und Party bleiben sofort.
- **Hundebett:** Winstons Körbchen (`hundekoerbchen`) wird an der Werkbank gebaut (6 Äste + 2 Wildblumen); das Rezept bekommt Lina von Oma Gisela (2. Herz, Brief „Für den kleinen Herrn“). Drinnen legt sich Winston hinein, wenn Lina sich hinsetzt, eine Weile steht oder nachts.
- **Chez Jens neu gestaltet (Nov. 2026):** Das Café von innen ist jetzt ein **10 × 7**-Raum (`guestLayout` in `data/gastHaeuser.ts`, eigener Grundriss je Haus) nach dem Vorbild eines Pariser Cafés: **Café-Mosaik** (Sechseck-Steinchen, Bodenmuster `hexmosaik`), cremefarbener **Café-Putz**, **zwei Wandbänke** (`bistrobank`) links und rechts, **10 runde Tische** mit Messingrand (`bistrotisch`, jetzt auch in Bordeaux/Schwarz/Salbei) mit Bugholzstühlen, Zinktresen mit Hockern, Kugel- und Messing-Wandleuchten, Kreidetafel, Café-Poster, Spiegel und dem „TOILETTE“-Schild. Neu im Bistro-Katalog (auch zum Kaufen): **Bordeaux-Bank** (1 200 ⭐), **Kugel-Wandleuchte** (520), **Messing-Wandleuchte** (380), **Emailleschild „TOILETTE“** (150), **Café-Mosaik** (950) und **Café-Putz** (700). Der Tisch behält seine alte ID (`baseVariant: 'marmor'`), alte Spielstände bleiben gültig.
- **Mehr Farbvarianten:** Auch Sofa, Bett, Loungesofa, Sitzsack, Zabuton & Co. haben jetzt 4–7 Farben, dazu neu: Stehlampe, Holzregal, Wandregal, Landhaustisch, Häkel- und Orientteppich, Nierentisch, Fransenlampe, Bugholzstuhl, Barhocker, Bistro-Tischlampe, Gartenbank. Die Farbe wechselt man beim Einrichten kostenlos mit **V oder 1–9** (Pipette `C` übernimmt sie). Technik: `FurnitureDef.baseVariant` – die ursprüngliche Farbe behält die alte Gegenstands-ID (`stehlampe`), die übrigen heißen `stehlampe-weiss` …; dadurch bleiben Spielstände, Rezepte und Wünsche gültig. Nur Katalogmöbel bekommen Farben (Geschenke/Handgemachtes nicht, sonst wären Farben unerreichbar).
- **Garten gestalten – dieselbe Kamera-Steuerung:** Auch draußen bleibt Lina beim Gestalten stehen; WASD/Pfeile oder Maus ziehen schwenken die Kamera (innerhalb des Gartenbereichs), das Mausrad zoomt (`decorPan`/`setDecorPan` in `World3D`).
- **Türen:** Haustür und Durchgänge sind **ein Feld breit** (`data/house.ts`, `frontDoor`); Möbel dürfen links und rechts davon stehen. Treppen bleiben zwei Felder breit.
- **Einrichten im Fluss (Einrichtungs-Audit, Nov. 2026):** Im Einrichtungsmodus (G) gibt es **🛒 Katalog** direkt in der Leiste: Gekauftes hängt sofort an der Maus (Tapete/Boden wird gleich angebracht), kein Umweg über die Tasche. Der **Vorrat** zeigt Tasche **und** Vorratstruhe (🧺 = liegt in der Truhe); ist die Tasche voll, wandert Gekauftes/Weggeräumtes in die Truhe. **C** = „noch eins“ (Möbel unter dem Mauszeiger bzw. in der Hand nochmal nehmen – aus dem Vorrat, sonst im Katalog nachkaufen). **V oder 1–9** wechselt die Farbe des gehaltenen Möbels – kostenlos (es wird ein Stück der Ausgangsfarbe verbraucht; auch beim Verschieben umfärbbar). **Strg+Z** macht Aufstellen, Verschieben, Wegräumen und Tapete/Boden rückgängig (bis zu 40 Schritte pro Einrichten-Sitzung; Geld bleibt, gekaufte Möbel bleiben im Vorrat). Logik `game/home.ts` (`decorStock`, `takeStock`, `restoreFurniture`, `variantsOf`), Befehle `DecorCommand` in `game/session.ts`, Ablauf `World3D.decorCommand`/`undoLast`/`pipette`.
- **Linas Notizbuch (Audit 3, Taste N / Menü):** Was steht gerade an? (1) nächster Einzug: alle fehlenden Hinweise in der Stimme des Hinweisgebers bzw. „bald ist es so weit“ nach dem Brief, (2) erzählte Herzenswünsche mit Bedarf und wie viel schon in der Tasche ist, dazu wer noch etwas auf dem Herzen hat, (3) Zuhause: laufender Ausbau, offener Kredit, nächste Stufe (erst mit Papas Dorfkasse). Bewusst ohne Häkchen und Prozente. Logik `game/notebook.ts`, Fenster `ui/NotebookPanel.tsx`.
- **Türen mit Bewohner davor:** Steht jemand neben der Tür (aber nicht direkt vor Lina), geht die Tür vor – Häuser bleiben betretbar.
- **Spontane Gespräche (Nov. 2026):** Begegnen sich zwei Bewohner draußen (nicht bei Treffen, Party, Sonntagsessen), bleiben sie stehen und unterhalten sich – Sprechblasen mit Text über den Köpfen (Lina in der Nähe liest mit), 13 Paare mit je 2 Austauschen (`data/gespraeche.ts`), pro Paar höchstens alle 4 Minuten. Spricht Lina einen der beiden an, geht er zuerst darauf ein („Ich hab Olaf gerade gesagt: …“). Technik: `Npc.startChat/endChat`, `World3D.updateChats`.
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
