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

## ✅ M2 – Oma Gisela, Inventar, Sammeln & Verkaufen

- ✅ NPC-System: Persönlichkeit, Tagesablauf (Bank, Spaziergang, Zuhause, Schlafen), eigenes Haus, Vorlieben
- ✅ Oma Gisela zieht gleich ein (Begrüßungsszene mit Keks), sitzt auf ihrer Bank, läuft durchs Dorf
- ✅ Dialogsystem mit vielen Zeilen (Tageszeit, Jahreszeit, Wochentag, Herzen, Linas Geburtstag)
  und Auswahl (Plaudern / Etwas schenken / Tschüss)
- ✅ Freundschaft (5 Herzen), Geschenke mit Reaktionen („köstlich!“ / „pfui!“), Herz-Belohnungen per Brief
- ✅ Tasche (20 Plätze, Stapel, Sortieren), Gegenstands-Datenbank mit Symbolen
- ✅ Sammeln: Bäume schütteln (Äpfel, Birnen, Pfirsiche, Äste), Muscheln & Seesterne am Strand,
  Wildblumen pflücken, an Felsen klopfen (Kiesel, Glitzersteine)
- ✅ Sternchen ⭐ & Verkaufskiste vor Linas Haus
- ✅ Briefkasten: Willkommensbrief, gelegentliche Briefe mit Geschenken
- ✅ Spielstand Version 2 mit Migration (alte Spielstände bleiben erhalten)
- ✅ Tests: Inventar, Freundschaft, Tagesablauf, Dialogauswahl, tägliche Funde, Briefkasten, Migration
- ⬜ Erster kleiner Laden zum Ausgeben der Sternchen → kommt mit dem Möbelkatalog in M5

## ✅ M3 – Umstieg auf 3D

- ✅ Three.js statt Phaser: 3D-Welt im PS2-Stil mit weichem Toon-Licht und Schatten
- ✅ Gelände als Höhenraster (Flussbett, Meer) mit gemalter Textur und Wasseroberfläche
- ✅ 3D-Modelle aus Grundformen: Laubbäume & Tannen je Jahreszeit, Büsche, Felsen, Blumen, Häuser mit
  Satteldach & Herzfenster, Briefkasten (Fähnchen), Laternen, Bänke, Brunnen, Brücke, Bauplätze, Verkaufskiste
- ✅ 3D-Chibi-Figuren (Lina, Oma Gisela …) mit gezeichnetem Gesicht, Blinzeln, Lauf- und Sitzanimation
- ✅ Feste Schrägsicht-Kamera mit Mausrad-Zoom, Bäume/Häuser vor Lina werden durchsichtig
- ✅ Tag & Nacht: Himmel, Sonne, leuchtende Fenster, Laternen mit echtem Licht
- ✅ Fallende Blätter/Blüten/Schnee, Maus: Klick zum Laufen/Anschauen, Zeiger über Interaktivem
- ✅ Charakter-Editor mit drehbarer 3D-Vorschau
- ✅ Alle Funktionen aus M1/M2 übernommen, Spielstände bleiben gültig
- ✅ Charakter-Feinschliff nach Fotos: volle Locken (Lina), Gesichter mit Augenfarbe, Brauen, Sommersprossen,
  Lächeln/Grinsen/Zahnlücke; neue Frisuren (kurz geschoren, zerzaust) und Outfits (Mantel & Schal, Weste,
  Streifenhemd, Hoodie); Aussehen aller Liebsten in `data/npcs/looks.ts`
- ✅ Dächer mit Ziegelreihen, weichere Flussufer
- ✅ Thalia & Oli nach Fotos (glatte Haare mit Mittelscheitel, Schnurrbart, Troyer-Pulli, Halstuch, Creolen);
  Oma Gisela ohne Brille, Linas Locken länger; Halstuch & Ohrringe auch im Editor
- ✅ Linas Standard-Outfit ganz in Schwarz; Schuhe je nach Jahreszeit (Herbst/Winter Schnürstiefel,
  Frühling/Sommer weiße Sneaker) – im Editor wählbar

## ✅ M4 – Natur: Angeln, Insekten, Gärtnern, Wetter, Sammelbuch

- ✅ Angeln ganz entspannt (Fischschatten, Schwimmer, Biss – verpassen geht nicht schief) in Fluss & Meer
- ✅ Insekten mit dem Kescher fangen (fliehen nicht); Schmetterlinge, Käfer, Libellen, Glühwürmchen, Krabben …
- ✅ 17 Fische & 24 Insekten – echte heimische Arten, je nach Monat, Uhrzeit und Wetter
- ✅ Sammelbuch mit Schatten für Unentdecktes, Ort/Monaten/Uhrzeit, Anzahl und erstem Fang
- ✅ Gärtnern: Beet neben Linas Haus, 5 Blumen (Samen → Keimling → Knospe → Blüte), Gießen, Regen gießt mit,
  nichts vertrocknet; beim Pflücken fallen manchmal Samen ab
- ✅ Wetter pro Tag reproduzierbar: Sonne, Wolken, Regen, Gewitter (Sommer), Schnee (Winter), Regenbogen;
  Linas Geburtstag immer sonnig, Heiligabend Schnee; Licht & Himmel passen sich an
- ✅ Werkzeuge (Angel, Kescher, Gießkanne) von Oma Gisela, Werkzeugleiste mit Tasten 1–3
- ✅ Oma Gisela: Meinungen zu Fischen & Krabbeltieren („Pfui, eine Schnecke!“), Wetter-Sprüche
- ✅ Spielstand Version 4 (Sammelbuch & Beet), Tests für Wetter, Fangen, Garten, Migration
- ⬜ Museum → kommt mit Thalia (M7); Schaufel & Fossilien ebenfalls mit Thalia
- ⬜ Blumen-Kreuzungen (neue Farben) → später

## ✅ M5 – Hauseinrichtung (Sims-Elemente, Teil 1)

- ✅ Innenraum von Linas Haus (eigener Raum, 8×6 Felder), Tür rein & raus, Fenster mit Tageslicht
- ✅ Raster-Platzieren, Drehen, Verschieben, Wegräumen; Deko auf Tischen & Kommoden; Teppiche unter Möbeln
- ✅ Tapeten & Böden (5 + 4), Farbvarianten für Futon, Kotatsu, Zabuton
- ✅ Erster Stil: **japanisch** (Futon, Chabudai, Kotatsu, Zabuton, Andon, Tansu, Byōbu, Bambus,
  Zimmerbrunnen, Tatami-Matte, Bonsai, Teeservice, Ikebana, Winkekatze, Kokeshi) + Basis-Möbel
- ✅ Möbelkatalog am Pult – der erste Ort zum Sternchen-Ausgeben
- ✅ Sitzen auf Kissen & Futon, Lampen leuchten abends (an-/ausknipsbar)
- ✅ 3D-Vorschaubilder der Möbel in Katalog & Tasche; Spielstand Version 5
- ⬜ Weitere Stile (Cottagecore, französisches Bistro, modern, Retro-Oma-Chic) → nach und nach
- ⬜ Wand-Deko (Bilder, Rollbilder, Regale an der Wand)

## 🚧 M6 – Hausausbau, Außengestaltung, Crafting

**M6a ✅ Olaf & Christin, Dorfkasse, Hausausbau**
- ✅ Olaf & Christin ziehen ein (Ankündigungsbrief, Einzug am nächsten Tag, Begrüßungsszene, eigenes Haus
  auf dem Bauplatz), Tagesabläufe, Dialoge, Vorlieben, Briefe
- ✅ Olafs Dorfkasse: Ausbau als zinsloser Kredit, zurückzahlen wann man will
- ✅ Feste Ausbaustufen: großes Zimmer (10×7) → Schlafzimmer-Anbau → Dachzimmer; Durchgang & Treppe,
  jeder Raum mit eigener Tapete/Boden/Möbeln; Haus wächst auch von außen
- ✅ Spielstand Version 6 (Haus mit Räumen, Dorfkasse)

**M6b ✅ Winston & Opas Werkbank**
- ✅ Winston, Linas Dackel: läuft überall mit (auch ins Haus), setzt sich neben Lina, schläft nachts,
  lässt sich streicheln, buddelt einmal am Tag etwas aus, schläft im Hundekörbchen
- ✅ Opas Werkbank neben dem Haus: 9 Rezepte für handgemachte Möbel aus Ästen, Steinen, Muscheln, Blumen
- ✅ Rezepte von Anfang an, beim ersten Fund (Herzmuschel, Seestern, Glitzerstein) und als
  Herz-Briefe von Oma, Olaf und Christin
- ✅ Spielstand Version 7 (Rezepte, Winston)

**M6c ⬜ Außengestaltung & Tiere**
- ⬜ Außenbereich: Zäune, Wege, Gartenmöbel, Deko, Lichterketten, mehr Beete
- ⬜ Wachteln & Hühner halten (Stall, tägliche Eier)

## ⬜ M7 – Alle Bewohner, Shops & Events

- ⬜ Story-Einzüge: Oli, Lars, Jens, Thalia (jeweils mit eigener Szene) – Olaf & Christin sind schon da (M6a)
- ⬜ Lars: Praxis/Apotheke (Heiltränke, Pflaster), Gesundheitstipps
- ⬜ Olaf: Sparbuch mit kleinen Zinsen (Kredit gibt's schon seit M6a)
- ⬜ Jens: Bistro/Kochstudio (Rezepte) & Galerie (Kunstwerke sammeln/ausstellen)
- ⬜ Thalia: Abendevents (Partys/Tanzabende), Karten, Gesteine/Fossilien, Wetterstation, neue Gebiete
- ⬜ Oli: romantische Szenen (Picknick, Sternschnuppen), gemeinsames Haus/Zimmer
- ⬜ NPCs interagieren untereinander (Kaffeeklatsch, gemeinsames Angeln)
- ⬜ Feste: Weihnachten, Silvester, Linas Geburtstag (16.06.), Geburtstage der Bewohner

## ⬜ M8 – Feinschliff

- ⬜ Musik & Soundeffekte (Web Audio, selbst generiert) mit Lautstärkeregler
- ⬜ Mehr Animationen & Partikel, Balancing
- ⬜ PWA (installierbar, offline)
- ⬜ Barrierefreiheit (Textgröße, reduzierte Bewegung)

## 💡 Ideen-Parkplatz

- Fotomodus/Postkarten, Tagebuch mit schönen Momenten
- Sternbilder am Nachthimmel, Glühwürmchen im Sommer

## ❓ Offene Fragen (bei Gelegenheit klären)

- Geburtstage der Bewohner
- Christins Rolle im Dorf ausbauen (z. B. kleine Aufräum-Aufgaben, Gartenpflege, Ordnungs-Tipps)?
- Wer zieht als Erstes ein (nach Oma Gisela)? Welche Bauplätze für wen?
- Lieblingsessen/-farben/-hobbys der Bewohner für Geschenke & Dialoge
