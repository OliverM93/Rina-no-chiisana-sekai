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
- **Einzüge:** `NpcDef.movesIn` = Story-Flag; Kartenobjekte mit `requires`/`until` erscheinen/verschwinden
  per Flag (`applyMapFlags`, z. B. Bauplatz → Haus). Ablauf in `game/story.ts`.
- **Bewohner:** Daten in `src/data/npcs/<id>.ts` (Aussehen, Haus, Tagesablauf, Vorlieben, Dialog-Pools,
  Briefe). Ein neuer Bewohner braucht: Datei + Eintrag in `npcs/index.ts` + Haus/Bank in `VILLAGE_OBJECTS`.
  Dialogzeilen haben Bedingungen (`when`) und Gewichte; ausgewählt wird reproduzierbar pro Tag.
- **Freundschaft:** sinkt nie. Erstes Gespräch am Tag und erstes Geschenk am Tag zählen; Herz-Belohnungen
  kommen per Brief.
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
  schlecht an (`giftPreferences`). Geplant (jeweils eigener Schritt, nur wenn sinnvoll): Samenstand, Gemüse & Kräuter,
  Sträuße & Blumendeko, Gewächshaus – siehe `development-status.md`.
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
  Fenstern (`backWindows`), blockiert den Boden nicht – Möbel dürfen darunter stehen. Beim Einrichten zielt man
  auf die Wand (`Interior3D.walls`), die Drehung rastet von selbst ein (`wallRotationAt`). Modelle hängen bei
  `HANG`/`WALL_Z` in `models/furniture.ts`.
- **Nichts geht für immer verloren:** Werkzeuge und einmalige Geschenke (Möbel mit `gift: true`, außer Kunst) sind
  Erinnerungsstücke (`isKeepsake`): unverkäuflich (`price: null`) und nicht verschenkbar. Fehlt beim Laden etwas, das
  Lina haben sollte (`missingKeepsakes`: Omas Werkzeuge, Thalias Schaufel, Olis Einzugsmöbel), kommt es zurück.
  Wichtige Übergaben laufen über `World3D.giveOrDrop` – bei voller Tasche landet es vor Linas Füßen. Jede Samensorte
  braucht eine Quelle außer der eigenen Blüte (Test in `data/keepsakes.test.ts`).
- **Winston:** läuft auf Linas eigener Spur hinterher (bleibt nie an Ecken hängen), setzt sich neben sie,
  wenn sie stehen bleibt. Texte & Funde in `data/winston.ts`.
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
- **Geburtstage der Bewohner:** `NpcDef.birthday` + `birthdayLines`; Geschenke am Geburtstag zählen doppelt,
  Tags `geburtstag-<id>` / `bald-geburtstag-<id>` (7 Tage vorher).
- **Treffen der Bewohner:** `data/meetups.ts` (Wochentage, Uhrzeit, Plätze, Gespräche), Regeln in
  `game/meetups.ts`; `Npc` ersetzt den Tagesablauf (Reihenfolge: Party → Sonntagsessen → Treffen → Plan).
  `Npc.snap()` setzt alle beim Laden sofort an den richtigen Platz.
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
- **Dr. No (Hommage):** Linas Lieblingsarzt aus der Doku „Schwerer Weg“ ist eine **ausgedachte** Figur (keine echte Person, keine
  echte Sendung): strenger, ruhiger Chirurg mit buschigen Brauen und gütigen Augen, der Patienten ernst nimmt („Ein Schritt. Dann
  noch einer.“). Drei Folgen (`data/tv.ts`, `lina`-Reaktion + eigene `oli`-Sprüche pro Folge), das **Dr.-No-Porträt** (`bild-dr-no`,
  Wand-Deko im Möbelkatalog) und Kommentare von Oli, Lars, Jens und Oma.
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
  Abholtage in `world.coopDay`; Logik in `core/coop.ts` & `game/animals.ts`.
