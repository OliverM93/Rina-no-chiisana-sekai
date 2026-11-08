# Architektur – Rina no Chiisana Sekai

Wie das Projekt technisch aufgebaut ist: Ordnerstruktur, Schichten und die wichtigsten technischen Konzepte.
Spielregeln und Inhalte stehen in [`game-mechanics.md`](game-mechanics.md), der Stand der Arbeit in
[`development-status.md`](development-status.md), Arbeitsregeln in [`../CLAUDE.md`](../CLAUDE.md).

**Stack:** TypeScript (strict) · Vite · Three.js · Preact · Vitest · Web Audio. Alles wird im Code erzeugt
(Modelle, Texturen, Musik) – keine externen Assets zur Laufzeit.

## Ordnerstruktur

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
    festivals.ts   welches Fest an welchem Datum (Ostern berechnet)
    progress.ts    Zähler (verkauft, gekauft, gebaut, gekocht), Meilenstein-Bedingungen, Wartezeit in Spielzeit
    music.ts       Musik-Themen (Tempo, Tonart, Akkordfolgen, Instrumente, 4/4 oder Walzer) + Lieder komponieren
                   (Motiv, Form A–A'–B–A'–C), Thema nach Zeit/Wetter/Ort (`placeMood`)
    babble.ts      Brabbelsprache: Silbe (Mitlaut, Selbstlaut) + Satzmelodie aus einer Textzeile
  audio/       Audio.ts – Web-Audio-Klang: Sequenzer, Instrumente, Umgebung (Vögel, Grillen, Regen, Wellen), Geräusche
  data/        Inhalte (leicht erweiterbar): Karten, Interaktionstexte, Story-Texte,
               items.ts (alle Gegenstände + Preise, Gartenblumen, Werkzeuge), species.ts (Fische & Insekten –
               echte heimische Arten), furniture.ts (Möbel, Tapeten, Böden, Varianten; Stile: japanisch, basis,
               cottage, retro, modern, midcentury, handgemacht, garten, kunst, winter, lieblinge – Muster in `gfx/interior.ts`),
               house.ts (Ausbaustufen 0–6, Räume, Preise, Start-Haus, Start-Einrichtung neuer Räume,
               `HOUSE_ANNEX` = Kacheln, die Anbauten außen belegen),
               npcs/ (je Bewohner eine Datei)
               wardrobe.ts (Aufdruck-Kleidung, Bandnamen), recipes.ts (Rezepte), coffee.ts (Siebträgermaschinen & Getränke), flowers.ts (Blumenfarben & Mischregeln), posters.ts (Poster & Bildbände), tassen.ts (Sammeltassen), furnitureHeights.ts (Möbelhöhen für die Wand-Deko-Prüfung, gemessen mit scripts/measure-heights.cjs), festivals.ts, meetups.ts,
               tv.ts, animals.ts, fossils.ts, winston.ts, winter.ts, art.ts, progress.ts (Meilensteine), seedstand.ts (Samenstand-Angebot)
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
    story.ts       Rahmenhandlung: Einzüge per Meilenstein (`data/progress.ts`) → Brief → nach kurzer Spielzeit Einzug
    progress.ts    aktueller Meilenstein, Fortschritt, sanfte Hinweise der Bewohner
    tassen.ts      Tassensammlung (Zähler, Hinweise am Tassenbord)
    coffee.ts      Kaffeetrinken (Getränke, Kaffee-Kick, Kaffee mit Oli)
    flowers.ts     Blumen-Kreuzungen (Same-Wurf beim Pflücken), Sammelbuch-Einträge
    christin.ts    Christins Gießrunde & Ordnungstipp · winter.ts Adventskalender, Schneebälle, Punschstand
    digging.ts     Grabstellen (Thalia) · festivals.ts Fest-Sprüche & -Geschenke · gallery.ts Jens' Galerie
    dinner.ts      Sonntagsessen · meetups.ts Treffen der Bewohner · party.ts Thalias Party · tv.ts Fernsehabend
    animals.ts     Hühner & Wachteln (Eier abholen)
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
    DigSpots3D.ts  Grabstellen · Festivals3D.ts Festschmuck · Footprints3D.ts Fußspuren im Schnee · tweens.ts kleine Animationen
    models/        chibi3d.ts (Figuren), nature.ts, buildings.ts, critters.ts (Werkzeuge, Insekten, Pflanzen),
                   furniture.ts (Möbel + 3D-Vorschaubilder);
                   materials.ts (Toon-Materialien)
  ui/          Preact-Overlay: App, TitleScreen, CharacterEditor, Hud, DialogBox (mit Auswahl & Herzen),
               InventoryPanel (Tasche/Verkaufen/Schenken), MailPanel, Menu, store.ts,
               CatalogPanel (Möbelkatalog), CraftPanel (Werkbank/Küche/Apotheke), CollectionBook (Sammelbuch),
               DecorBar (Einrichten), BankPanel, SeedStandPanel (Samenstand), MapPanel (Dorfkarte), GalleryPanel, TvPanel, Preview3D
  dev/         Entwickler-Galerie (wird nicht ins Spiel gebaut)
```


## Technische Konzepte

- **Schichten:** `core` (Logik) ← `data` (Inhalte) ← `gfx` (Zeichnen) ← `game` (Regeln) ← `world3d` (Three.js) / `ui` (Preact).
  `core` darf nie aus `game`/`ui`/`gfx` importieren.
- **Event-Bus:** Welt und UI sprechen nur über `session.bus` (`dialog:open`, `game:started`,
  `appearance:changed`, …). Die UI setzt `session.uiBlocking`, wenn Fenster offen sind.
- **Menü & Fenster:** Dialoge, Fenster und Rückfragen sperren das Menü (`Hud`: `busy`), ein offenes Menü schließt sich,
  wenn ein Dialog oder Fenster aufgeht (`App`). Zoom-Knöpfe senden `camera:zoom` auf dem Bus (`World3D.zoomBy`).
  Tasche, Verkaufskiste, Geschenk- und Samenauswahl lassen sich mit Pfeiltasten durchlaufen (Leertaste wählt/markiert, Enter
  verkauft bzw. schenkt/pflanzt).
- **Bewohner sind fest:** Stehende, sitzende und sprechende Bewohner blockieren Lina (`Npc.blocksPlayer`,
  `World3D.npcStands`); wer läuft oder in einer Szene mitspielt, nicht.
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
- **Klang:** `GameAudio` (`audio/Audio.ts`) startet nach der ersten Taste/Klick (Browser-Regel). **Musik:** draußen
  Natur-Themen nach Tageszeit/Wetter (am Strand dieselbe Musik, nur mit Meeresrauschen). Jedes Natur-Thema ist eine
  **Familie mit 3–5 Liedern** (`THEMES` in `core/music.ts`, z. B. Tag: Sonnenwiese, Plätscherbach, Picknickdecke …; am Tag kommt
  ein Lied der Jahreszeit dazu, `themesFor`); bei jedem neuen Lied nimmt `pickTheme` reihum das nächste, `GameAudio` merkt sich
  Familie (`family`) und laufendes Lied (`mood`). Nahe an Häusern das Thema der Bewohner (`data/music.ts`:
  Olaf & Christin, Oma, Bistro, Praxis, Thalia), zu Hause „Lini & Oli“ (ab Olis Einzug). Ortswechsel greift am
  nächsten Taktende. Zum Anhören `?musik=bistro` (oder ein einzelnes Lied wie `?musik=tag-bach`) an die URL hängen. **Stimmen:** `data/voices.ts` (Tonhöhe,
  Kopfgröße/Formanten, Lebhaftigkeit, Hauch; Männer tiefer), Silben aus `core/babble.ts`. Geräusche
  laufen über das Bus-Event `sfx` (`session.bus.emit('sfx', 'muenzen')`), Lautstärke über `settings:changed`.
  `main.ts` setzt alle 2 s Stimmung (`moodFor`) und Umgebung. Hörprobe ohne Lautsprecher:
  `GameAudio.preview(mood)` rendert offline in einen AudioBuffer. Musik: Pad (zwei verstimmte Oszillatoren) +
  E-Piano-Akkord pro Takt + Melodie/Bass/Beat, `MUSIC_GAIN` hebt sie über Umgebung & Geräusche.
  **Brabbelsprache:** Stimmen je Bewohner in `data/voices.ts` (Tonhöhe, Spannweite, Tempo, Klangfarbe). Die
  Dialogbox meldet jeden Buchstaben (`onChar`), App schickt jede `BABBLE_EVERY`-te als Bus-Event `voice`, `GameAudio.babble`
  spricht eine Silbe (Formant-Filter nach Vokal). Nicht in *Handlungen*; Dialoge ohne Bewohner-Titel nur „Blubb“.
  Hörprobe: `GameAudio.previewVoice(voice, text)`.
- **Partikel & kleine Animationen:** Bus-Event `fx` (`{ kind, npc? , x?, y? }` – ohne Ort bei Lina) oder direkt
  `particles.burst()` in World3D. Alles über wenige InstancedMeshes mit festem Vorrat. `Character.cheer()` =
  Freudensprung, `wave()` = Winken; nach 4 s Stillstand schauen Figuren sich um. **Leerlauf:** steht Lina ~10 s
  still, macht sie ab und zu etwas Niedliches (`data/idle.ts`: Strecken, Gähnen, Summen, Wippen, Winston kraulen,
  im Winter Hände reiben, im Regen Tropfen fühlen – je nach Lage gewichtet, `game/idle.ts`), Posen in
  `Chibi3D.poseAct`, abgespielt über `Character.playAct`, ausgelöst in `World3D.updateIdle`.
- **Spielstand:** `SAVE_VERSION` + `MIGRATIONS` in `core/save.ts`. Nach jeder Migration wird normalisiert
  (fehlende Felder → Standardwerte). Vor jedem Speichern bleibt der alte Stand als Backup erhalten.

## Build, Tests & Veröffentlichung

- **Tests:** `*.test.ts` liegen direkt neben dem Code (Kernlogik in `src/core/`, Spielregeln in `src/game/`,
  Daten-Konsistenz in `src/data/`). Es gibt bewusst keinen separaten `tests/`-Ordner.
  `game/playthrough.test.ts` spielt die ganze Rahmenhandlung durch.
- **CI** (`.github/workflows/ci.yml`): bei jedem Pull Request Typecheck, Tests und Build.
- **Deployment** (`.github/workflows/deploy.yml`): jeder Merge nach `main` wird gebaut und auf GitHub Pages
  veröffentlicht (Vite `base: './'`).
