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
| **Lina** | Spielerin | braune Locken, etwas länger als schulterlang, Mittelscheitel, kein Pony (im Editor anpassbar), Geburtstag **16.06.** |
| **Oliver („Oli“)** | Linas Freund – höchste Bindung, romantische Szenen, gemeinsames Haus/Zimmer | noch offen |
| **Lars** | großer Bruder, Arzt – Praxis/Apotheke | groß, Bart |
| **Olaf** | Papa, Finanzamt – Dorfkasse/Bank | eher klein, Bart, dunkle, etwas angegraute Haare (keine grauen) |
| **Jens** | Onkel, Coach, Dandy – Bistro/Kochstudio & Galerie, Französisch + Sächsisch | untersetzter, kein Bart, sieht Olaf ähnlich |
| **Thalia** | beste Freundin, Geografie – Partys, Karten, Gesteine/Fossilien | noch offen |
| **Oma Gisela** | Oma – Bank vorm Haus, Weisheiten, Kekse, Strickrezepte; hat **immer das letzte Wort**, misstrauisch („Die Ärzte wollen nur dein Geld …“), starke Meinung zu allem („köstlich!“ – „pfui!“); Likörchen/Zigarette dezent & humorvoll, nie glorifizierend | klein, zierlich, offene schulterlange Haare (kein Dutt), Brille |

Figuren sind **Chibi-Menschen** (keine Tiere) – erkennbar an Frisur, Bart, Brille, Größe, Statur, Kleidung.

## Tech-Stack (Entscheidung)

**TypeScript + Vite + Phaser 4 (WebGL) + Preact-Oberfläche**, Tests mit **Vitest**, Deployment über
**GitHub Pages**.

| Baustein | Wahl | Begründung |
|---|---|---|
| Sprache | TypeScript (strict) | Typsichere Daten (Items, NPCs, Dialoge), gut wartbar |
| Build | Vite | schneller Dev-Server, statischer Build für GitHub Pages (`base: './'`) |
| Engine | Phaser 4 | Szenen, Kamera, Input (Maus/Touch), Tweens, Tilemaps – stabiler Nachfolger von Phaser 3 |
| Oberfläche | HTML/CSS-Overlay mit Preact | scharfer Text, scrollbare Listen, responsive, gut auf dem Handy |
| Grafik | prozedural (Canvas 2D → Texturen) | keine externen Assets, Figuren aus Parametern → Editor & Animation |
| Sound | Web Audio API (ab M7) | selbst generiert |
| Speichern | localStorage, versioniert + Migrationen, Export/Import als JSON | kein Spielstand-Verlust |
| Tests | Vitest | Kernlogik ohne Browser testbar |

**Warum:** Lina startet das Spiel einfach per Link (später auch als installierbare PWA). Der Kawaii-Stil lässt
sich in 2D mit Vektorzeichnungen und Tweens sehr gut selbst erzeugen. Ein quadratisches Grid in leicht
schräger Draufsicht eignet sich gut für den Bau-/Einrichtungsmodus. Alles ist Text/Code → für Agenten gut
umsetzbar, testbar (auch per Headless-Browser) und langfristig erweiterbar. 2D-WebGL läuft flüssig.

**Verworfene Alternativen:** Godot 4 (großer Web-Export, ohne visuellen Editor schwer testbar),
PixiJS + Eigenbau (mehr Code ohne Mehrwert), Three.js (3D-Assets & Bau-Modus viel aufwendiger),
Electron/Tauri (unnötig, da Web-App/PWA; später als Hülle möglich).

## Befehle

```bash
npm install          # Abhängigkeiten (Node ≥ 22)
npm run dev          # Dev-Server → http://localhost:5173
npm test             # Unit-Tests (Vitest)
npm run typecheck    # TypeScript prüfen
npm run build        # Produktions-Build nach dist/ (inkl. Typecheck)
npm run preview      # Build lokal ansehen → http://localhost:4173
```

- **Grafik-Galerie (nur Dev):** <http://localhost:5173/gallery.html> zeigt alle prozeduralen Grafiken
  (Figuren in allen Frames, Bäume je Jahreszeit, Gebäude, Gelände-Tilesets). Ideal zum Gestalten.
- **Zeit testen:** `?zeit=21:30` und/oder `?datum=2026-12-24` an die URL hängen. Die Uhr startet dort und
  läuft normal weiter.
- **Debug im Dev-Modus:** `window.__rina` enthält `{ session, game, ui }`.

## Architektur

```
src/
  core/        Reine Spiellogik – KEIN Phaser, KEIN DOM. Hier gehören Tests hin (*.test.ts).
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
    grid.ts        Kollisionsraster, A*-Wegfindung, nächste freie Kachel
    movement.ts    Bewegung mit Kollision (Fuß-Box), Um-Ecken-Gleiten
    events.ts      typisierter Event-Emitter
    rng.ts         reproduzierbarer Zufall
  data/        Inhalte (leicht erweiterbar): Karten, Interaktionstexte, Story-Texte,
               items.ts (alle Gegenstände + Preise), npcs/ (je Bewohner eine Datei)
  style/       palette.ts – EINZIGE Quelle für Farben (auch CSS-Variablen der UI)
  gfx/         Prozedurale Grafiken (Canvas 2D): chibi.ts, objects.ts, terrain.ts, effects.ts;
               textures.ts überträgt sie in Phaser
  game/        Phaser-Schicht
    session.ts     laufende Sitzung: Spielstand, Uhr, Karte, Event-Bus Welt ↔ UI
    gameplay.ts    Spielregeln: Sammeln, Verkaufen, Plaudern, Schenken, Post
    scenes/        BootScene (Texturen erzeugen), WorldScene (Welt, Kamera, Input, Interaktion)
    world/         MapView, Character (Lina & Bewohner), Npc (Tagesablauf-KI),
                   Collectibles (Boden, Obstbäume, Blumen), DayNight, Ambient
    input.ts       eigene Tastatursteuerung (blockiert keine Textfelder)
  ui/          Preact-Overlay: App, TitleScreen, CharacterEditor, Hud, DialogBox (mit Auswahl & Herzen),
               InventoryPanel (Tasche/Verkaufen/Schenken), MailPanel, Menu, store.ts
  dev/         Entwickler-Galerie (wird nicht ins Spiel gebaut)
```

### Wichtige Konzepte

- **Schichten:** `core` (Logik) ← `data` (Inhalte) ← `gfx` (Zeichnen) ← `game` (Phaser) / `ui` (Preact).
  `core` darf nie aus `game`/`ui`/`gfx` importieren.
- **Event-Bus:** Welt und UI sprechen nur über `session.bus` (`dialog:open`, `game:started`,
  `appearance:changed`, …). Die UI setzt `session.uiBlocking`, wenn Fenster offen sind.
- **Koordinaten:** 1 Kachel = `TILE` = 64 Welteinheiten. Texturen werden mit `RES` (2–3) Pixeln pro
  Welteinheit gezeichnet und mit `setScale(1/RES)` platziert → scharf auf Retina.
- **Leicht schräge Draufsicht:** Objekte werden nach ihrer Fuß-/Grundlinie sortiert (`depth = y`).
  Kollision nur über eine kleine Fuß-Box. Bäume/Häuser werden halbtransparent, wenn Lina dahinter steht.
- **Gelände:** „Dual-Grid“-Autotiling – pro Geländeebene 16 Eckmasken, prozedural mit runden Kanten gezeichnet
  (`gfx/terrain.ts`). Karte = ASCII in `data/maps/village.ts` (Legende dort).
- **Objekte** (Häuser, Schilder, Laternen …) stehen in `VILLAGE_OBJECTS`; Größe, Kollision und
  Interaktionspunkte pro Art in `OBJECT_KINDS` (`core/worldmap.ts`).
- **Interaktionen:** Texte in `data/interactions.ts`, abhängig von Tageszeit/Jahreszeit/Tag. `{dorf}` wird
  ersetzt. Ein Test prüft, dass jedes interaktive Objekt zu Fuß erreichbar ist.
- **Figuren:** `gfx/chibi.ts` zeichnet jede Figur aus `Appearance` (Frisur, Farben, Größe, Statur, Bart,
  Brille …) – 12 Frames (3 Richtungen × Stand/Blinzeln/2 Schritte); rechts = gespiegelt.
- **Tag & Nacht:** Multiplikations-Overlay über der Welt + additive Lichtscheine (Laternen, Fenster).
- **Bewohner:** Daten in `src/data/npcs/<id>.ts` (Aussehen, Haus, Tagesablauf, Vorlieben, Dialog-Pools,
  Briefe). Ein neuer Bewohner braucht: Datei + Eintrag in `npcs/index.ts` + Haus/Bank in `VILLAGE_OBJECTS`.
  Dialogzeilen haben Bedingungen (`when`) und Gewichte; ausgewählt wird reproduzierbar pro Tag.
- **Freundschaft:** sinkt nie. Erstes Gespräch am Tag und erstes Geschenk am Tag zählen; Herz-Belohnungen
  kommen per Brief.
- **Tägliches:** Muscheln (reproduzierbar pro Datum), Obst wächst nach 3 Tagen nach, Felsen & Blumen 1×/Tag.
  Heruntergefallenes bleibt liegen (gespeichert in `world.ground`).
- **Spielstand:** `SAVE_VERSION` + `MIGRATIONS` in `core/save.ts`. Nach jeder Migration wird normalisiert
  (fehlende Felder → Standardwerte). Vor jedem Speichern bleibt der alte Stand als Backup erhalten.

## Konventionen

- **Texte im Spiel, Kommentare, Doku: Deutsch.** Bezeichner im Code englisch; Daten-IDs deutsch in
  kebab-case (`haus-lina`, `briefkasten-lina`).
- **Farben nur aus `src/style/palette.ts`.** Keine fest verdrahteten Farben in Komponenten (Ausnahme:
  kleine Details innerhalb von Zeichenfunktionen).
- **Keine externen Assets/Abhängigkeiten zur Laufzeit** (Schrift Nunito kommt als npm-Paket mit, OFL).
- **Inhalte gehören in `src/data/`**, nicht in Szenen/Komponenten.
- **Kernlogik bekommt Tests** (Zeit, Inventar, Speichern, Freundschaft, Bau-Grid, Wegfindung …).
- **Spielstand-Format geändert?** → `SAVE_VERSION` erhöhen, Migration in `MIGRATIONS` ergänzen, Test schreiben.
- **Nichts Verpflichtendes, kein Scheitern, kein Zeitdruck.** Alles Tägliche ist optional.
- **Oma Giselas Likör/Zigarette:** dezent und humorvoll, niemals glorifizierend.
- Story-Timer in echter Zeit (`window.setTimeout`), nicht in Phaser-Spielzeit (die wird bei fehlendem Fokus
  gedrosselt).
- Vor jedem PR: `npm run typecheck && npm test && npm run build`, dazu im Browser anspielen
  (Desktop + Handy-Viewport).

### Testen im Headless-Browser (für Agenten)

- Playwright + Chromium sind vorinstalliert. WebGL über SwiftShader:
  `chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })`.
- Phaser drosselt die Bildzeit ohne Fensterfokus → im Headless-Test laufen Bewegungen langsamer. Das ist
  normal.
- Handy-Viewport (`devices['iPhone 13']`) ist nur 390 × 664 px hoch – Taps innerhalb halten.
- Phaser 4 vergibt bei Touch für „down“/„up“ manchmal unterschiedliche Pointer-IDs → Tipp-Erkennung nutzt
  `pointer.identifier`.

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
