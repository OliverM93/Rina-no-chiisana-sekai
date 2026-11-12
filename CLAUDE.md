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

Meilensteine und Fortschritt: siehe [`docs/development-status.md`](docs/development-status.md).

### Die Menschen im Spiel

| Figur | Rolle | Aussehen (für die Chibi-Figuren) |
|---|---|---|
| **Lina** | Spielerin | kastanienbraune Locken, etwas länger als schulterlang, Mittelscheitel, kein Pony, braune Augen, Sommersprossen, trägt am liebsten **Schwarz** und gern **Oversize-Streetwear-Sweatshirts** (keine echten Markenlogos im Spiel!) – im Sommer kurzes schwarzes Oberteil mit kurzer Hose & weißen Sneakern, im Winter dicke Fleece-Jacke & Doc-Martens-artige Schnürstiefel, im Frühling/Herbst täglich wechselnd ein Lieblings-Sweatshirt (very oversized: dunkelgrün mit gelbem „Hawaii“, grau mit „Sport“, schwarz mit Kultfilm-Porträt „Radierkopf“ – dazu weite schwarze Anzughose) (Standard: das **Hawaii-Sweatshirt** `outfit: 'hawaii'`; mit `'saison'` wechselt sie nach Jahreszeit – alles im Editor anpassbar), Geburtstag **16.06.**; **kocht leidenschaftlich gern**, trinkt gern ein Feierabendbier (am liebsten Budweiser; wird dann richtig lustig; nie glorifizierend), möchte **Thalia verkuppeln**, schaut gern Datingshows (à la First Dates), True Crime, **Horrorfilme & -serien** und Dokus über stark übergewichtige Menschen (im Spiel immer respektvoll & warmherzig, nie spöttisch) |
| **Oliver („Oli“)** | Linas Freund – höchste Bindung, romantische Szenen, gemeinsames Haus/Zimmer; nennt Lina „Lini“, Geburtstag **29.07.**, spielt gern Videospiele zusammen mit Lars (Dark Souls, GTA V) | schlank, dunkelblonder **Fade** (Seiten & Nacken kurz, oben längeres Deckhaar), Schnurrbart, blaugraue Augen, schwarzer Troyer-Pulli, strahlendes Lächeln; wechselt ab und zu die Klamotten (`OLI_WARDROBE`), oben **immer Schwarz**: Troyer, Bandshirts (ausgedachte Bands), Polo/Überjacke mit Ärmel-Abzeichen (eigenes Design statt echter Marke); unten nur schwarze Hose, beige Hose oder Jeans (auch Cargo); dazu weiße oder schwarze Chunky-Sneaker – **nie Grün** |
| **Lars** | großer Bruder, Arzt – Praxis/Apotheke; guter Humor, hat immer einen Spruch auf Lager, trinkt sehr gern Bier (dezent), zockt gern mit Oli „Fallout 3“ & „Halo“ (z. B. „So, und nicht mit e, sonst ist es ein See.“) | groß & kräftig, kurz geschorene rotblonde Haare, rotblonder Vollbart, blaue Augen, dunkles Streifenhemd |
| **Olaf** | Papa, Finanzamt – Dorfkasse/Bank mit Sparbuch (Kontoauszug-Brief zum Monatsanfang); **Zwillingsbruder von Jens** (die beiden nennen sich gern „Frère“); liest gern den Comic „Das kleine Arschloch“ (Christin findet ihn grauenhaft); wohnte mit Christin früher an der Ostsee | eher klein, dunkle angegraute Haare, grauer kurzer Bart, eckige Brille, weißes Hemd mit dunkler Weste |
| **Christin** | Olafs Freundin – sehr ordentlich, achtet auf Ordnung & Sauberkeit; mag „Das kleine Arschloch“ gar nicht; lebte mit Olaf früher an der Ostsee | schlank, dunkelbrauner Bob mit Seitenscheitel, braune Augen, korallrotes Oberteil |
| **Jens** | Onkel, Coach, Dandy – Bistro/Kochstudio & Galerie, Französisch + Sächsisch (zog nach der Schule nach Leipzig, ist dort nicht aufgewachsen); liebt Kunst, reist leidenschaftlich gern um die Welt, ein bisschen fabelhaft 🌈 (liebevoll & selbstverständlich, nie klischeehaft); **Zwillingsbruder von Olaf**; sächselt gern aus Spaß mit Lina; lädt sonntags zum Abendessen zu sich nach Hause ein (Lina, Oli, Lars – manchmal Olaf, Christin, Gisela) | untersetzt, rundes Gesicht, dunkle zerzauste Haare, kein Bart, blaue Augen, Zahnlücken-Grinsen, dunkler Hoodie |
| **Thalia** | beste Freundin, Geografie – Partys, Karten, Gesteine/Fossilien; war mit Lina eine Woche auf Studienreise in Tschechien; Lina will sie verkuppeln | schlank, glatte dunkelbraune, etwa kinn- bis nackenlange Haare mit Mittelscheitel, braune Augen, kleine Creolen, grünes Halstuch, schwarze Jacke, weite Jeans |
| **Oma Gisela** | Oma – Bank vorm Haus, Weisheiten, Kekse, Strickrezepte; kommt eigentlich aus **Dessau**, hat **immer das letzte Wort**, misstrauisch („Die Ärzte wollen nur dein Geld …“), starke Meinung zu allem („köstlich!“ – „pfui!“); Likörchen/Zigarette dezent & humorvoll, nie glorifizierend; Witwe von **Opa Ludwig** (verstorben; Sportlehrer & leidenschaftlicher Sportfan), an den sie liebevoll zurückdenkt – warm, nie traurig-schwer | klein, zierlich, offene silbergraue Haare (kein Dutt), **keine Brille**, königsblauer Mantel mit rotem Tuch |
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
- **Haus-Ausbau testen:** `?ausbau=5` (0–6) an die URL hängen: ein **neues** Spiel startet dann mit fertig ausgebautem Haus und 50 000 ⭐ (nur Dev-Server).
- **Zeit testen:** `?zeit=21:30` und/oder `?datum=2026-12-24` an die URL hängen. Die Uhr startet dort und
  läuft normal weiter. **Wetter testen:** `?wetter=regen|sonnig|wolkig|gewitter|schnee|regenbogen`.
- **Debug im Dev-Modus:** `window.__rina` enthält `{ session, game, ui }` (`game.debug` → Lina, Bewohner …).

## Dokumentation

Die Doku liegt in `docs/` – **bei Änderungen die passende Datei mitpflegen**:

| Datei | Inhalt | Anpassen, wenn … |
|---|---|---|
| [`docs/architecture.md`](docs/architecture.md) | Ordnerstruktur, Schichten, Event-Bus, Koordinaten, Modelle, Gelände, Klang, Spielstand, CI/Deployment | neue Dateien/Module, neue technische Konzepte |
| [`docs/game-mechanics.md`](docs/game-mechanics.md) | Fortschritt, Bewohner, Natur, Zuhause, Garten, Feste, Winterzauber … mit Ort im Code | neue oder geänderte Spielregeln, Inhalte, Bewohner-Features |
| [`docs/development-status.md`](docs/development-status.md) | Meilensteine (✅/🚧/⬜), aktueller Stand, Ideen-Parkplatz, offene Fragen | ein Feature fertig wird oder Pläne sich ändern |
| [`README.md`](README.md) | Spielen, Steuerung, Entwickeln, Veröffentlichung | Steuerung/Befehle ändern sich |
| [`docs/game-design/`](docs/game-design/README.md) | Game-Design-Wissensbasis: Vision, Designsäulen, Loops, Progression, Ökonomie, Balancing, Pacing, Psychologie, Playtesting, Entscheidungen, priorisierte Verbesserungen | neue Mechaniken, Balancing-Änderungen, Designentscheidungen |

### Game Design (Rolle: Game Designer & Game Director)

Technisch korrekt ist nicht automatisch gutes Design. Vor jeder **neuen Gameplay-Mechanik** oder grundlegenden
Änderung eines Systems: kurze **Designprüfung** mit den 8 Fragen aus
[`docs/game-design/README.md`](docs/game-design/README.md) (im PR beantworten), Abgleich mit den
[Designsäulen](docs/game-design/DESIGN_PILLARS.md) und [Balancing-Leitlinien](docs/game-design/BALANCING_GUIDELINES.md).
Problematische Ideen offen ansprechen und Alternativen vorschlagen – nicht jede Idee muss umgesetzt werden.
Keine Mechanik nur für mehr Spielzeit oder Rückkehr (keine Streaks, kein FOMO, keine Strafe fürs Pausieren).
In den Dokumenten klar trennen: ✅ implementiert · 🗓️ geplant · 💡 Empfehlung · ❓ offen.
Regelmäßig (nach größeren Meilensteinen) zusätzlich ein **unabhängiger Game-Design-Audit** des ganzen Spiels nach den Regeln in
[`docs/game-design/README.md`](docs/game-design/README.md) → [`GAME_DESIGN_AUDIT.md`](docs/game-design/GAME_DESIGN_AUDIT.md):
kritisch auch gegenüber eigenen Entscheidungen, Belastbarkeit kennzeichnen ([N]/[V]/[P]), **während des Audits nichts am Spiel ändern**.

`docs/screenshots/` enthält die Bilder für README und Pull Requests (nie Fotos echter Personen).

### Harte Architektur-Regeln (Details: [`docs/architecture.md`](docs/architecture.md))

- **Schichten:** `core` (Logik) ← `data` (Inhalte) ← `gfx` (Zeichnen) ← `game` (Regeln) ← `world3d` (Three.js) / `ui` (Preact).
  `core` darf nie aus `game`/`ui`/`gfx` importieren und kennt weder Three.js noch das DOM.
- **Event-Bus:** Welt und UI sprechen nur über `session.bus`.
- **Koordinaten:** Spiellogik in Welteinheiten (1 Kachel = `TILE` = 64), Three.js in Kacheln (`UNIT = 1/64`).
- **Inhalte** gehören in `src/data/`, **Farben** nur in `src/style/palette.ts`.

## Konventionen

- **Texte im Spiel, Kommentare, Doku: Deutsch.** Bezeichner im Code englisch; Daten-IDs deutsch in
  kebab-case (`haus-lina`, `briefkasten-lina`).
- **Bildschirm-Zonen, damit nichts überlappt:** oben links Uhr, oben rechts Menü/Post, **oben Mitte
  Benachrichtigungen** (`.toast`, über allem), Mitte Fenster (`.modal-layer` lässt oben `--toast-strip` frei),
  unten Dialog / Werkzeuge / Einrichten-Leiste / Knöpfe. Ist ein Dialog offen, blenden die Knöpfe unten aus.
  Neue Overlays in diese Zonen einordnen.
  **Reine Deko-Ebenen über dem ganzen Bildschirm** (Abblenden, Regenbogen, Sterne …) bekommen `aria-hidden="true"` –
  dann lassen sie Klicks durch (`#ui > [aria-hidden='true']`). Sonst schlucken sie jeden Mausklick.
- **Farben nur aus `src/style/palette.ts`.** Keine fest verdrahteten Farben in Komponenten (Ausnahme:
  kleine Details innerhalb von Zeichenfunktionen).
- **Keine externen Assets/Abhängigkeiten zur Laufzeit** (Schrift Nunito kommt als npm-Paket mit, OFL).
- **Inhalte gehören in `src/data/`**, nicht in Szenen/Komponenten.
- **Durchlauf-Test:** `game/playthrough.test.ts` spielt die ganze Rahmenhandlung (alle Einzüge, alle Ausbaustufen,
  Speichern & Laden) mit erreichbaren Mitteln durch – bei neuen Meilensteinen dort ergänzen.
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
