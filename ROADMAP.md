# Roadmap – Rina no Chiisana Sekai

Jeder Meilenstein ist für sich spielbar und kommt als eigener Pull Request.
Legende: ✅ erledigt · 🚧 in Arbeit · ⬜ geplant

## ✅ M1 – Grundgerüst & erstes Dorf

- ✅ Projekt-Setup: TypeScript, Vite, Phaser 4, Preact, Vitest, GitHub Actions (CI + Pages-Deployment)
- ✅ Zentrale Farbpalette, prozedurale Grafiken (keine externen Assets)
- ✅ Dorfkarte: Wiese, Wald, Fluss mit Brücke, Strand & Meer, Dorfplatz mit Brunnen, Linas Häuschen,
  Bauplätze für künftige Bewohner
- ✅ Gelände mit weichen, runden Übergängen (Dual-Grid-Autotiling)
- ✅ Lina als Chibi-Figur (braune Locken), Lauf-Animation, Blinzeln, Atmen
- ✅ Steuerung: WASD/Pfeile (+ Umschalt zum Rennen), Klicken/Tippen zum Laufen (A*-Wegfindung),
  Leertaste/E/Enter oder Antippen zum Anschauen
- ✅ Echtzeit-Uhr & Kalender, Tag-Nacht-Zyklus mit Laternen und leuchtenden Fenstern
- ✅ Jahreszeit-abhängige Optik (Laub, Wiese, fallende Blätter/Blüten/Schnee)
- ✅ Atmosphäre: Glitzern auf dem Wasser, Wolkenschatten, transparente Bäume/Häuser, wenn Lina dahinter steht
- ✅ Titelbildschirm, Charakter-Editor (Frisur, Haar-/Hautfarbe, Kleidung, Farben, Brille) und Dorfname
- ✅ Einführung (kleine Story-Szene), Interaktionen mit Haus, Briefkasten, Schildern, Brunnen, Bänken
- ✅ Automatisches Speichern (localStorage, versioniert, Backup), Export/Import als Datei
- ✅ Tests für Zeit, Speichern, Wegfindung, Bewegung, Karte

## ⬜ M2 – Oma Gisela, Inventar, Sammeln & Verkaufen

- ⬜ NPC-System: Persönlichkeit, Tagesablauf (Zeitplan nach Uhrzeit), eigenes Haus, Lieblingsgegenstände
- ⬜ Oma Gisela zieht ein (Einzugsszene), sitzt auf ihrer Bank, verteilt Weisheiten & Kekse
- ⬜ Dialogsystem mit vielen Zeilen (abhängig von Tageszeit, Wetter, Jahreszeit, Freundschaft)
- ⬜ Freundschaft (Herzen), Geschenke
- ⬜ Inventar (Taschen-Raster), Gegenstands-Datenbank
- ⬜ Sammeln: Obst von Bäumen schütteln, Muscheln, Äste, Steine, Blumen
- ⬜ Währung & Verkaufen (z. B. Verkaufskiste/Laden), erster kleiner Shop
- ⬜ Briefkasten: gelegentliche Briefe & Geschenke
- ⬜ Tests: Inventar, Freundschaft, Tagesablauf

## ⬜ M3 – Natur: Angeln, Insekten, Gärtnern, Wetter, Museum

- ⬜ Angeln (Minispiel), Insektenfangen (Netz) – saisonale, tageszeitabhängige Arten
- ⬜ Gärtnern: Pflanzen, Gießen, Wachsen, Blumen-Kreuzungen
- ⬜ Wetter: Sonne, Wolken, Regen, Schnee, Gewitter, Regenbogen (deterministisch pro Tag)
- ⬜ Jahreszeiten-Inhalte (Arten, Früchte, Deko)
- ⬜ Sammelkatalog & Museum
- ⬜ Werkzeuge (Angel, Netz, Gießkanne, Schaufel)

## ⬜ M4 – Hauseinrichtung (Sims-Elemente, Teil 1)

- ⬜ Innenraum von Linas Haus (eigene Szene), Ein- und Ausgang
- ⬜ Grid-basiertes Platzieren, Drehen, Verschieben; Stapeln (Deko auf Tischen)
- ⬜ Tapeten, Bodenbeläge, Farbvarianten für Möbel
- ⬜ Einrichtungsstile (Cottagecore, japanisch, französisches Bistro, modern, Retro-Oma-Chic)
- ⬜ Katalog aller freigeschalteten Gegenstände

## ⬜ M5 – Hausausbau, Außengestaltung, Crafting

- ⬜ Räume hinzufügen, Wände ziehen/entfernen, Raumaufteilung (Kredit bei Olafs Dorfkasse)
- ⬜ Außenbereich: Zäune, Wege, Beete, Gartenmöbel, Lichterketten
- ⬜ Crafting mit freischaltbaren Rezepten (Werkbank)

## ⬜ M6 – Alle Bewohner, Shops & Events

- ⬜ Story-Einzüge: Oli, Lars, Olaf, Jens, Thalia (jeweils mit eigener Szene)
- ⬜ Lars: Praxis/Apotheke (Heiltränke, Pflaster), Gesundheitstipps
- ⬜ Olaf: Dorfkasse/Bank (Sparen, Zinsen, Kredit)
- ⬜ Jens: Bistro/Kochstudio (Rezepte) & Galerie (Kunstwerke sammeln/ausstellen)
- ⬜ Thalia: Abendevents (Partys/Tanzabende), Karten, Gesteine/Fossilien, Wetterstation, neue Gebiete
- ⬜ Oli: romantische Szenen (Picknick, Sternschnuppen), gemeinsames Haus/Zimmer
- ⬜ NPCs interagieren untereinander (Kaffeeklatsch, gemeinsames Angeln)
- ⬜ Feste: Weihnachten, Silvester, Linas Geburtstag (16.06.), Geburtstage der Bewohner

## ⬜ M7 – Feinschliff

- ⬜ Musik & Soundeffekte (Web Audio, selbst generiert) mit Lautstärkeregler
- ⬜ Mehr Animationen & Partikel, Balancing
- ⬜ Mobile: virtueller Joystick/Bedienhilfen, PWA (installierbar, offline)
- ⬜ Barrierefreiheit (Textgröße, reduzierte Bewegung)

## 💡 Ideen-Parkplatz

- Fotomodus/Postkarten, Tagebuch mit schönen Momenten
- Sternbilder am Nachthimmel, Glühwürmchen im Sommer
- Haustier (z. B. Katze), die Lina folgt

## ❓ Offene Fragen (bei Gelegenheit klären)

- Aussehen von Oli und Thalia; Geburtstage der Bewohner
- Wer zieht als Erstes ein (nach Oma Gisela)? Welche Bauplätze für wen?
- Lieblingsessen/-farben/-hobbys der Bewohner für Geschenke & Dialoge
