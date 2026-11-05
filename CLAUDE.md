# CLAUDE.md – Rina no Chiisana Sekai

Leitfaden für alle, die an diesem Projekt arbeiten (Menschen wie KI-Agenten).

## Projektüberblick

**Rina no Chiisana Sekai** („Linas kleine Welt“) ist ein gemütliches Life-Sim-Spiel im Browser – ein
persönliches Geschenk für eine einzige Spielerin: **Lina**. Alles soll sich liebevoll, persönlich und warm
anfühlen. Die Welt dreht sich um Linas Familie und Freunde.

- **Spielgefühl:** freies Erkunden, Sammeln, Angeln, Insekten, Gärtnern, Crafting, Handel, Bewohner mit
  Persönlichkeit – kein Scheitern, kein Zeitdruck, keine Pflichtaufgaben.
- **Kreativität:** Haus- und Einrichtungsmodus (Grid, Wände, Räume, Tapeten, Böden, Stile) als Ergänzung.
- **Rahmenhandlung:** Lina zieht in ein verschlafenes Dorf. Nach und nach ziehen ihre Liebsten dazu; jeder
  Einzug schaltet Gebäude, Shops oder Features frei.
- **Stil:** cute/kawaii, weiche Formen, Pastell, Chibi-Figuren (großer Kopf, kleiner Körper). Nur
  *inspiriert* von Animal Crossing/Chiikawa/Die Sims – **keine** fremden Assets, Figuren, Namen, Musik.
- **Sprache im Spiel:** Deutsch.

Meilensteine und Fortschritt: siehe [`ROADMAP.md`](ROADMAP.md).

### Die Menschen im Spiel

| Figur | Rolle | Aussehen (für die Chibi-Figuren) |
|---|---|---|
| **Lina** | Spielerin | kastanienbraune Locken, etwas länger als schulterlang, Mittelscheitel, kein Pony, braune Augen, Sommersprossen, trägt am liebsten **Schwarz** und gern **Oversize-Streetwear-Sweatshirts** (keine echten Markenlogos im Spiel!) – im Sommer kurzes schwarzes Oberteil mit kurzer Hose & weißen Sneakern, im Winter dicke Fleece-Jacke & Doc-Martens-artige Schnürstiefel, im Frühling/Herbst täglich wechselnd ein Lieblings-Sweatshirt (very oversized: dunkelgrün mit gelbem „Hawaii“, grau mit „Sport“, schwarz mit Kultfilm-Porträt „Radierkopf“ – dazu weite schwarze Anzughose) (`outfit: 'saison'`, alles im Editor anpassbar), Geburtstag **16.06.**; **kocht leidenschaftlich gern**, schaut gern Datingshows (à la First Dates), True Crime, **Horrorfilme & -serien** und Dokus über stark übergewichtige Menschen (im Spiel immer respektvoll & warmherzig, nie spöttisch) |
| **Oliver („Oli“)** | Linas Freund – höchste Bindung, romantische Szenen, gemeinsames Haus/Zimmer; nennt Lina „Lini“, Geburtstag **29.07.** | schlank, kurze dunkelblonde Haare, Schnurrbart, blaugraue Augen, schwarzer Troyer-Pulli, strahlendes Lächeln; wechselt ab und zu die Klamotten (`OLI_WARDROBE`), oben **immer Schwarz**: Troyer, Bandshirts (ausgedachte Bands), Polo/Überjacke mit Ärmel-Abzeichen (eigenes Design statt echter Marke); unten nur schwarze Hose, beige Hose oder Jeans (auch Cargo); dazu weiße oder schwarze Chunky-Sneaker – **nie Grün** |
| **Lars** | großer Bruder, Arzt – Praxis/Apotheke; guter Humor, hat immer einen Spruch auf Lager (z. B. „So, und nicht mit e, sonst ist es ein See.“) | groß & kräftig, kurz geschorene rotblonde Haare, rotblonder Vollbart, blaue Augen, dunkles Streifenhemd |
| **Olaf** | Papa, Finanzamt – Dorfkasse/Bank mit Sparbuch (Kontoauszug-Brief zum Monatsanfang); **Zwillingsbruder von Jens** | eher klein, dunkle angegraute Haare, grauer kurzer Bart, eckige Brille, weißes Hemd mit dunkler Weste |
| **Christin** | Olafs Freundin – sehr ordentlich, achtet auf Ordnung & Sauberkeit | schlank, dunkelbrauner Bob mit Seitenscheitel, braune Augen, korallrotes Oberteil |
| **Jens** | Onkel, Coach, Dandy – Bistro/Kochstudio & Galerie, Französisch + Sächsisch; liebt Kunst, reist leidenschaftlich gern um die Welt, ein bisschen fabelhaft 🌈 (liebevoll & selbstverständlich, nie klischeehaft); **Zwillingsbruder von Olaf**; sächselt gern aus Spaß mit Lina; lädt sonntags zum Abendessen zu sich nach Hause ein (Lina, Oli, Lars – manchmal Olaf, Christin, Gisela) | untersetzt, rundes Gesicht, dunkle zerzauste Haare, kein Bart, blaue Augen, Zahnlücken-Grinsen, dunkler Hoodie |
| **Thalia** | beste Freundin, Geografie – Partys, Karten, Gesteine/Fossilien | schlank, glatte dunkelbraune schulterlange Haare mit Mittelscheitel, braune Augen, kleine Creolen, grünes Halstuch, schwarze Jacke, weite Jeans |
| **Oma Gisela** | Oma – Bank vorm Haus, Weisheiten, Kekse, Strickrezepte; hat **immer das letzte Wort**, misstrauisch („Die Ärzte wollen nur dein Geld …“), starke Meinung zu allem („köstlich!“ – „pfui!“); Likörchen/Zigarette dezent & humorvoll, nie glorifizierend; Witwe von **Opa Ludwig** (verstorben; Sportlehrer & leidenschaftlicher Sportfan), an den sie liebevoll zurückdenkt – warm, nie traurig-schwer | klein, zierlich, offene silbergraue Haare (kein Dutt), **keine Brille**, königsblauer Mantel mit rotem Tuch |
| **Winston** | Linas treuer kleiner Dackel – läuft ihr überallhin nach | rotbrauner Kurzhaardackel mit Schlappohren und rosa Halsband (`data/winston.ts`) |

Die Bewohner sind **Chibi-Menschen** (keine Tiere; Winston ist Linas Hund) – erkennbar an Frisur, Bart, Brille, Größe, Statur, Kleidung.
Das Aussehen aller Bewohner steht in `src/data/npcs/looks.ts` (nach Fotos nachempfunden).
**Fotos der echten Personen gehören NIE ins Repository** – sie dienen nur als Vorlage.

## Tech-Stack (Entscheidung)

**TypeScript + Vite + Three.js (WebGL-3D) + Preact-Oberfläche**, Tests mit **Vitest**, Deployment über
**GitHub Pages**. Zielplattform: **Laptop/PC im Browser** (kein Handy nötig).

| Baustein | Wahl | Begründung |
|---|---|---|
| Sprache | TypeScript (strict) | Typsichere Daten (Items, NPCs, Dialoge), gut wartbar |
| Build | Vite | schneller Dev-Server, statischer Build für GitHub Pages (`base: './'`) |
| 3D | Three.js | verbreitet, schlank, flüssig; Toon-Shading, Schatten, Licht |
| Oberfläche | HTML/CSS-Overlay mit Preact | scharfer Text, Listen, Fenster |
| Grafik | prozedural: 3D-Modelle aus Grundformen, Gesichter/Gelände als Canvas-Texturen | keine externen Modelle/Assets, Figuren aus Parametern → Editor & Animation |
| Sound | Web Audio API | selbst generiert (Musik & Geräusche, keine Audiodateien) |
| Speichern | localStorage, versioniert + Migrationen, Export/Import als JSON | kein Spielstand-Verlust |
| Tests | Vitest | Kernlogik ohne Browser testbar |

**Stil-Ziel:** 3D im Geist von Animal Crossing, Grafik ungefähr „PS2-Level“: runde Low-Poly-Formen,
weiches Toon-Licht, Schatten, Tag & Nacht. Kamera fest schräg von oben (Mausrad = Zoom).

**Historie:** M1/M2 entstanden in 2D mit Phaser 4. In M3 auf Wunsch auf 3D (Three.js) umgestiegen –
Spiellogik, Daten, Spielstand und Oberfläche blieben erhalten.

**Verworfene Alternativen:** Babylon.js (schwerer als nötig), Godot (großer Web-Export, schwer testbar),
Phaser (nur 2D).

## Befehle

```bash
npm install          # Abhängigkeiten (Node ≥ 22)
npm run dev          # Dev-Server → http://localhost:5173
npm test             # Unit-Tests (Vitest)
npm run typecheck    # TypeScript prüfen
npm run build        # Produktions-Build nach dist/ (inkl. Typecheck)
npm run preview      # Build lokal ansehen → http://localhost:4173
```

- **3D-Galerie (nur Dev):** <http://localhost:5173/gallery.html> zeigt Figuren, Natur und Gebäude in 3D
  (`?ansicht=figuren|natur|gebaeude`, `&winkel=0..360`, Tasten 1–3, Maus ziehen = drehen).
- **Zeit testen:** `?zeit=21:30` und/oder `?datum=2026-12-24` an die URL hängen. Die Uhr startet dort und
  läuft normal weiter. **Wetter testen:** `?wetter=regen|sonnig|wolkig|gewitter|schnee|regenbogen`.
- **Debug im Dev-Modus:** `window.__rina` enthält `{ session, game, ui }` (`game.debug` → Lina, Bewohner …).

## Architektur

```
src/
  core/        Reine Spiellogik – KEIN Three.js, KEIN DOM. Hier gehören Tests hin (*.test.ts).
    time.ts        Echtzeit-Uhr, Jahreszeiten, Tagesphasen, Tageslicht, URL-Zeit-Override
    save.ts        Spielstand-Format, Versionierung, Migrationen, Normalisierung, SaveManager
    appearance.ts  Aussehen von Figuren (Parameter für die Chibi-Zeichnung)
    worldmap.ts    Kartenmodell aus ASCII + Objekten, Kollision, Interaktionspunkte
    inventory.ts   Tasche (Plätze, Stapel, Sortieren)
    friendship.ts  Herzen, Plaudern, Geschenke, Herz-Belohnungen
    schedule.ts    Tagesabläufe der Bewohner
    dialogue.ts    Auswahl von Dialogzeilen nach Tageszeit/Jahreszeit/Herzen/Tagen
    daily.ts       tägliche Funde, Obst-Nachwachsen
    mail.ts        Briefkasten
    weather.ts     Wetter pro Tag (reproduzierbar), Regen-Stunden, Regenbogen, `?wetter=` zum Testen
    catching.ts    Wann welche Art unterwegs ist (Monat/Uhrzeit/Regen), Sammelbuch
    garden.ts      Beet: pflanzen, gießen, wachsen (1 Stufe pro gegossenem Tag), pflücken – nie vertrocknen
    room.ts        Haus mit Räumen (Größe, Ausgänge) als Raster: platzieren, drehen, verschieben, Deko, Teppiche
    bank.ts        Olafs Dorfkasse: zinsloser Kredit, zurückzahlen wann man will; Sparbuch (1 % am Monatsanfang, max. 2000)
    crafting.ts    Werkbank: Rezepte lernen, Zutaten prüfen, bauen (alles oder nichts)
    pet.ts         Winston: Streicheln, einmal am Tag buddeln
    coop.ts        Ställe: Eier pro Tag (reproduzierbar), einmal am Tag abholen
    yard.ts        Linas Garten: Raster aufs Grundstück, freizuhaltende Felder, niemand wird eingesperrt
    grid.ts        Kollisionsraster, A*-Wegfindung, nächste freie Kachel
    movement.ts    Bewegung mit Kollision (Fuß-Box), Um-Ecken-Gleiten
    events.ts      typisierter Event-Emitter
    rng.ts         reproduzierbarer Zufall
    music.ts       Musik-Stimmungen (Tempo, Tonart, Akkorde) + Phrasen komponieren, Stimmung nach Zeit/Wetter
  audio/       Audio.ts – Web-Audio-Klang: Sequenzer, Instrumente, Umgebung (Vögel, Grillen, Regen, Wellen), Geräusche
  data/        Inhalte (leicht erweiterbar): Karten, Interaktionstexte, Story-Texte,
               items.ts (alle Gegenstände + Preise, Gartenblumen, Werkzeuge), species.ts (Fische & Insekten –
               echte heimische Arten), furniture.ts (Möbel, Tapeten, Böden, Varianten; Stile: japanisch, basis,
               cottage, retro, modern, midcentury, handgemacht, garten, kunst – Muster in `gfx/interior.ts`),
               house.ts (Ausbaustufen, Räume, Preise, Start-Haus),
               npcs/ (je Bewohner eine Datei)
               wardrobe.ts (Aufdruck-Kleidung, Bandnamen)
  style/       palette.ts – EINZIGE Quelle für Farben (auch CSS-Variablen der UI)
  gfx/         2D-Zeichnungen für Texturen & Symbole: terrain.ts (Gelände-Textur), items.ts (Symbole), prints.ts (Kleidungs-Aufdrucke),
               canvas.ts (Hilfen)
  game/        Sitzung & Spielregeln (ohne Darstellung)
    session.ts     laufende Sitzung: Spielstand, Uhr, Karte, Event-Bus Welt ↔ UI
    gameplay.ts    Spielregeln: Sammeln, Verkaufen, Plaudern, Schenken, Post
    nature.ts      Werkzeuge, Angeln, Insekten, Beet, aktuelles Wetter
    crafting.ts    Rezepte lernen (Rezeptkarten aus Briefen, Ideen beim ersten Fund), an der Werkbank bauen
    pet.ts         Winston streicheln & buddeln lassen
    romance.ts     Gemeinsame Momente mit Oli (Picknick, Sterne gucken): wann möglich, Freundschaft
    home.ts        Katalog kaufen, Möbel aufstellen/verschieben/wegräumen, Tapete & Boden, Ausbau & Kredit
    story.ts       Rahmenhandlung: Einzüge (Ankündigungsbrief → Einzug am nächsten Tag)
    input.ts       eigene Tastatursteuerung (blockiert keine Textfelder)
  world3d/     Three.js-Schicht
    World3D.ts     Renderer, Kamera, Licht/Tag-Nacht, Interaktion, Maus (Raycasting), Story-Szenen
    MapView3D.ts   baut die Welt aus dem Kartenmodell; terrain3d.ts (Höhenraster + gemalte Textur)
    Character3D.ts Figur (Bewegung, Wegfolgen, Sitzen, Werkzeug in der Hand); Npc.ts (Tagesablauf-KI); Collectibles3D.ts
    Particles3D.ts Partikel (Staub, Spritzer, Funkeln, Herzchen, Erde, Konfetti) + Glühwürmchen
    Weather3D.ts   Regen, Schnee, Blitze · Fishing3D.ts Angeln · Insects3D.ts Insekten · Garden3D.ts Beet
    Animals3D.ts   Hühner & Wachteln (trippeln um den Stall, picken, schlafen nachts)
    Yard3D.ts      Linas Garten (Zäune verbinden sich, Lichter abends, Vorschau beim Gestalten)
    Winston.ts     Winston (folgt Linas Spur, sitzt, schläft, buddelt, Körbchen); Modell in models/dog.ts
    Interior3D.ts  Linas Zimmer (liegt bei Kachel 200/200 in derselben Szene, der Nebel versteckt das Dorf)
    models/        chibi3d.ts (Figuren), nature.ts, buildings.ts, critters.ts (Werkzeuge, Insekten, Pflanzen),
                   furniture.ts (Möbel + 3D-Vorschaubilder);
                   materials.ts (Toon-Materialien)
  ui/          Preact-Overlay: App, TitleScreen, CharacterEditor, Hud, DialogBox (mit Auswahl & Herzen),
               InventoryPanel (Tasche/Verkaufen/Schenken), MailPanel, Menu, store.ts
  dev/         Entwickler-Galerie (wird nicht ins Spiel gebaut)
```

### Wichtige Konzepte

- **Schichten:** `core` (Logik) ← `data` (Inhalte) ← `gfx` (Zeichnen) ← `game` (Regeln) ← `world3d` (Three.js) / `ui` (Preact).
  `core` darf nie aus `game`/`ui`/`gfx` importieren.
- **Event-Bus:** Welt und UI sprechen nur über `session.bus` (`dialog:open`, `game:started`,
  `appearance:changed`, …). Die UI setzt `session.uiBlocking`, wenn Fenster offen sind.
- **Koordinaten:** Spiellogik & Spielstand rechnen in Welteinheiten (1 Kachel = `TILE` = 64). Three.js
  rechnet in Kacheln (`UNIT = 1/64`): Logik-x → 3D-X, Logik-y → 3D-Z, Höhe = Y. Vorne/Kamera = +Z.
- **Modelle:** Ursprung = Mitte der Grundfläche auf Bodenhöhe, Tür/Blick zeigt nach +Z.
  Kollision nur über eine kleine Fuß-Box. Bäume/Häuser zwischen Kamera und Lina werden halbtransparent.
- **Gelände:** Höhenraster (Fluss/Meer abgesenkt) + Textur, die per „Dual-Grid“-Autotiling mit runden Kanten
  gemalt wird (`gfx/terrain.ts`, `world3d/terrain3d.ts`). Karte = ASCII in `data/maps/village.ts`.
- **Objekte** (Häuser, Schilder, Laternen …) stehen in `VILLAGE_OBJECTS`; Größe, Kollision und
  Interaktionspunkte pro Art in `OBJECT_KINDS` (`core/worldmap.ts`).
- **Interaktionen:** Texte in `data/interactions.ts`, abhängig von Tageszeit/Jahreszeit/Tag. `{dorf}` wird
  ersetzt. Ein Test prüft, dass jedes interaktive Objekt zu Fuß erreichbar ist.
- **Figuren:** `world3d/models/chibi3d.ts` baut jede Figur aus `Appearance` (Frisur, Farben, Größe, Statur,
  Bart, Brille …): Kopf mit gezeichneter Gesichtstextur (Blinzeln = Texturwechsel), Arme/Beine mit Gelenken.
- **Tag & Nacht:** Sonne/Himmel/Nebel nach Uhrzeit, Fenster & Laternen leuchten (Emissive + Punktlichter
  an den nächstgelegenen Laternen).
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
- **Zuhause:** Möbel in `data/furniture.ts` (Größe in Feldern, `surface`/`small`/`rug`/`sit`/`light`) werden
  automatisch Gegenstände (Varianten → `futon-rosa` …). Raumlogik in `core/room.ts`, Modelle in
  `world3d/models/furniture.ts`. Gespeichert wird immer draußen weitergespielt (Laden im Haus → vor der Tür).
  Einrichten läuft über `decor:command`/`decor:state` auf dem Bus.
  **Wand-Deko** (`wall: true`): hängt an Rückwand (rot 0) oder Seitenwand (rot 3 links / 1 rechts), nicht vor
  Fenstern (`backWindows`), blockiert den Boden nicht – Möbel dürfen darunter stehen. Beim Einrichten zielt man
  auf die Wand (`Interior3D.walls`), die Drehung rastet von selbst ein (`wallRotationAt`). Modelle hängen bei
  `HANG`/`WALL_Z` in `models/furniture.ts`.
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
- **Galerie:** Kunstwerke in `data/art.ts` (werden Möbel im Stil „kunst“, Bild auf Staffelei, gemalt in
  `gfx/art.ts`), Regeln in `game/gallery.ts`, gestiftete Bilder in `SaveData.gallery`.
- **Sonntagsessen:** `game/dinner.ts` – Gäste gehen per `{ kind: 'zuhause', at: 'bistro-jens' }` zu Jens
  ins Haus; Lina klopft an seine Tür (`visitBistro`).
- **Feste:** `core/festivals.ts` (welches Fest an welchem Datum, Ostern berechnet), Inhalte in
  `data/festivals.ts` (Geschenke & Sprüche je Bewohner), Regeln in `game/festivals.ts` (`festTalk` beim ersten
  Gespräch, Geschenk 1× pro Fest & Jahr über `world.dates`), Schmuck in `world3d/Festivals3D.ts`.
- **Tiere:** Ställe sind Gartenmöbel mit `coop: 'huhn' | 'wachtel'`, die Tiere kommen mit (`data/animals.ts`).
  Abholtage in `world.coopDay`; Logik in `core/coop.ts` & `game/animals.ts`.
- **Klang:** `GameAudio` (`audio/Audio.ts`) startet nach der ersten Taste/Klick (Browser-Regel). Geräusche
  laufen über das Bus-Event `sfx` (`session.bus.emit('sfx', 'muenzen')`), Lautstärke über `settings:changed`.
  `main.ts` setzt alle 2 s Stimmung (`moodFor`) und Umgebung. Hörprobe ohne Lautsprecher:
  `GameAudio.preview(mood)` rendert offline in einen AudioBuffer.
- **Partikel & kleine Animationen:** Bus-Event `fx` (`{ kind, npc? , x?, y? }` – ohne Ort bei Lina) oder direkt
  `particles.burst()` in World3D. Alles über wenige InstancedMeshes mit festem Vorrat. `Character.cheer()` =
  Freudensprung, `wave()` = Winken; nach 4 s Stillstand schauen Figuren sich um.
- **Spielstand:** `SAVE_VERSION` + `MIGRATIONS` in `core/save.ts`. Nach jeder Migration wird normalisiert
  (fehlende Felder → Standardwerte). Vor jedem Speichern bleibt der alte Stand als Backup erhalten.

## Konventionen

- **Texte im Spiel, Kommentare, Doku: Deutsch.** Bezeichner im Code englisch; Daten-IDs deutsch in
  kebab-case (`haus-lina`, `briefkasten-lina`).
- **Bildschirm-Zonen, damit nichts überlappt:** oben links Uhr, oben rechts Menü/Post, **oben Mitte
  Benachrichtigungen** (`.toast`, über allem), Mitte Fenster (`.modal-layer` lässt oben `--toast-strip` frei),
  unten Dialog / Werkzeuge / Einrichten-Leiste / Knöpfe. Ist ein Dialog offen, blenden die Knöpfe unten aus.
  Neue Overlays in diese Zonen einordnen.
- **Farben nur aus `src/style/palette.ts`.** Keine fest verdrahteten Farben in Komponenten (Ausnahme:
  kleine Details innerhalb von Zeichenfunktionen).
- **Keine externen Assets/Abhängigkeiten zur Laufzeit** (Schrift Nunito kommt als npm-Paket mit, OFL).
- **Inhalte gehören in `src/data/`**, nicht in Szenen/Komponenten.
- **Kernlogik bekommt Tests** (Zeit, Inventar, Speichern, Freundschaft, Bau-Grid, Wegfindung …).
- **Spielstand-Format geändert?** → `SAVE_VERSION` erhöhen, Migration in `MIGRATIONS` ergänzen, Test schreiben.
- **Nichts Verpflichtendes, kein Scheitern, kein Zeitdruck.** Alles Tägliche ist optional.
- **Oma Giselas Likör/Zigarette:** dezent und humorvoll, niemals glorifizierend.
- Story-Timer in echter Zeit (`window.setTimeout`), nicht über Animationsframes (die werden in
  Hintergrund-Tabs gedrosselt).
- Vor jedem PR: `npm run typecheck && npm test && npm run build`, dazu im Browser anspielen (Desktop).

### Testen im Headless-Browser (für Agenten)

- Playwright + Chromium sind vorinstalliert. WebGL über SwiftShader:
  `chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })`.
- SwiftShader rendert langsam (wenige Bilder/s) – Bewegungen dauern im Test länger, Timeouts großzügig wählen.
- Positionen über den Spielstand setzen: erst Seite laden (Titelbildschirm speichert nicht automatisch),
  dann `localStorage` ändern, dann „Weiterspielen“.

## Git-Workflow

- **Niemals direkt auf `main` committen oder pushen.**
- Zu Projektbeginn einen Entwicklungs-Branch anlegen (z. B. `dev/setup`) und dort das Grundgerüst aufsetzen.
- Für jeden Meilenstein bzw. jedes Feature einen eigenen Branch erstellen (z. B. `feature/m2-oma-gisela`).
- Kleine, sinnvolle Commits mit klaren Commit-Messages.
- Nach Abschluss eines Features: Pull Request gegen `main` öffnen mit
  - Zusammenfassung der Änderungen
  - Hinweis, wie man es testet/spielt
  - ggf. Screenshots oder offenen Punkten
- **Pull Requests werden niemals selbst gemergt.** Jeder PR wird manuell geprüft und bestätigt, erst danach
  wird gemergt.
- Nach dem Erstellen eines PRs auf die Freigabe warten und nicht auf dem PR-Branch weiterbauen, bevor er
  gemergt ist (außer es werden Änderungen erbeten).
- Neue Branches immer vom aktuellen `main` abzweigen.
- Bei wichtigen Designentscheidungen nachfragen, statt große Annahmen zu treffen.
