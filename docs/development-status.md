# Entwicklungsstand & Roadmap – Rina no Chiisana Sekai

## Aktueller Stand

- **Spielbar:** Dorf mit allen Bewohnern (Oma Gisela, Olaf & Christin, Oli, Jens, Lars, Thalia, Winston), Rahmenhandlung
  über Meilensteine, Natur (Angeln, Insekten, Garten, Wetter, Sammelbuch), Haus & Einrichtung mit 7 Ausbaustufen,
  Werkbank/Küche/Apotheke, Feste inklusive Winterzauber, Klang (Musik, Stimmen, Geräusche), Spielstand mit Migrationen.
- **Qualitätssicherung:** 36 Testdateien (217 Tests) inkl. Durchlauf-Test der ganzen Geschichte; CI prüft jeden Pull
  Request (Typecheck, Tests, Build); jeder Merge nach `main` wird automatisch auf GitHub Pages veröffentlicht.
- **Als Nächstes denkbar:** Fotomodus & Tagebuch, Geburtstage der übrigen Bewohner (Daten fehlen), Blumen-Kreuzungen,
  Sternbilder, französisches Bistro-Möbelset – siehe „Ideen-Parkplatz“ und „Offene Fragen“ unten.
- **Pflege:** Wird ein Feature fertig, wird es hier abgehakt (✅) – siehe Regeln in [`../CLAUDE.md`](../CLAUDE.md).

Verwandte Doku: [`architecture.md`](architecture.md) (Technik) · [`game-mechanics.md`](game-mechanics.md) (Spielregeln).

## Roadmap

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
- ✅ Blumen-Kreuzungen (neue Farben) → M8k

## ✅ M5 – Hauseinrichtung (Sims-Elemente, Teil 1)

- ✅ Innenraum von Linas Haus (eigener Raum, 8×6 Felder), Tür rein & raus, Fenster mit Tageslicht
- ✅ Raster-Platzieren, Drehen, Verschieben, Wegräumen; Deko auf Tischen & Kommoden; Teppiche unter Möbeln
- ✅ Tapeten & Böden (5 + 4), Farbvarianten für Futon, Kotatsu, Zabuton
- ✅ Erster Stil: **japanisch** (Futon, Chabudai, Kotatsu, Zabuton, Andon, Tansu, Byōbu, Bambus,
  Zimmerbrunnen, Tatami-Matte, Bonsai, Teeservice, Ikebana, Winkekatze, Kokeshi) + Basis-Möbel
- ✅ Möbelkatalog am Pult – der erste Ort zum Sternchen-Ausgeben
- ✅ Sitzen auf Kissen & Futon, Lampen leuchten abends (an-/ausknipsbar)
- ✅ 3D-Vorschaubilder der Möbel in Katalog & Tasche; Spielstand Version 5
- ✅ Weitere Stile: Cottagecore, Retro-Oma-Chic, Modern (M8g), Mid-Century & Bauhaus (M8h) · ⬜ französisches Bistro → später
- ✅ Wand-Deko (Bilder, Rollbilder, Regale an der Wand) → M8f

## ✅ M6 – Hausausbau, Außengestaltung, Crafting

**M6a ✅ Olaf & Christin, Dorfkasse, Hausausbau**
- ✅ Olaf & Christin ziehen ein (Ankündigungsbrief, Einzug kurz danach, Begrüßungsszene, eigenes Haus
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

**M6c ✅ Linas Garten**
- ✅ „Garten gestalten“ auf Linas Grundstück (Raster, Vorschau, Drehen, Verschieben, Wegräumen; laufen mit WASD)
- ✅ Zäune (verbinden sich), Gartentor, Wege (Trittsteine, Holz, Kies, Pflaster), Gartenbank/-tisch/-stühle,
  Sonnenschirm, Lichterkette, Gartenlaterne, Windlicht, Kübel, Vogeltränke, Vogelhäuschen, Gartenwichtel
- ✅ Hochbeete = zusätzliche Pflanzplätze; Sitzen auf Gartenbank & -stühlen; Lichter abends
- ✅ Niemand wird eingesperrt: Haustür, Briefkasten, Beet, Werkbank & Wege bleiben immer erreichbar
- ✅ Spielstand Version 8 (Garten)

**M6d ✅ Hühner & Wachteln**
- ✅ Hühnerstall (3 Hühner) und Wachtelstall (4 Wachteln) im Garten-Katalog – die Tiere ziehen gleich mit ein
- ✅ Tiere trippeln um ihren Stall, picken, hüpfen beim Streicheln, schlafen nachts im Stall
- ✅ Jeden Tag frische Eier im Nest (Hühner 2–3, Wachteln 3–4) – kein Füttern, keine Pflicht
- ✅ Oma, Olaf & Christin freuen sich über Eier und haben etwas zu den Tieren zu sagen
- ✅ Spielstand Version 9 (Abholtage der Ställe)

## 🚧 M7 – Alle Bewohner, Shops & Events

**M7a ✅ Oli zieht bei Lina ein**
- ✅ Ankündigungsbrief, Einzug kurz danach direkt in Linas Haus (Begrüßungsszene, nennt sie „Lini“)
- ✅ Tagesablauf: Kaffee, Training, Programmieren, Kochen, Punk am Strand – zu Hause sieht man ihn drinnen
  (am Schreibtisch, an der Kaffeemaschine, an der Hantelbank, nachts auf dem Futon)
- ✅ Bringt Schreibtisch & Hantelbank mit; Herz-Briefe: Kaffeemaschine, Plattenspieler, Mixtape, Sternenlampe, Foto
- ✅ Gemeinsame Momente: 🧺 Picknick (tagsüber) und 🌠 Sterne gucken mit Sternschnuppen (abends)
- ✅ Spielstand Version 10

**M7b ✅ Onkel Jens & sein Bistro**
- ✅ Ankündigungsbrief, Bistro „Chez Jens“ auf dem Bauplatz neben Oma (Markise, Café-Tischchen, Staffelei,
  Kreide-Aufsteller, Regenbogenfähnchen), Begrüßungsszene
- ✅ Kochstudio: 7 Gerichte aus Eiern, Obst, Fisch, Lavendel & Keksen (Rührei, Obstsalat, Fischbrötchen,
  Apfelkuchen, Crêpes …) – Rezepte von Anfang an, beim ersten Lavendel und als Herz-Briefe
- ✅ Jens reist (ungefähr jeden 7. Tag): Postkarte aus Paris, Venedig, Amsterdam, Sevilla, New York, Kyoto –
  jeweils mit Andenken für Linas Regal; sein eigenes Gemälde als Herz-Geschenk
- ✅ Französisch + Sächsisch, Kunst, Coaching, ein bisschen fabelhaft 🌈

**M7c ✅ Lars & seine Praxis**
- ✅ Ankündigungsbrief, Praxis mit Apotheke am Dorfplatz (grünes Kreuz, Kräuterkübel), Begrüßungsszene
- ✅ Wortwitze („… und nicht mit e, sonst ist es ein See“), liebevolle Wortgefechte mit Oma
- ✅ Neue Beet-Kräuter Kamille & Pfefferminze; Apotheke: Kamillen-, Pfefferminz-, Lavendeltee, Omas Kräutermischung
- ✅ Täglicher Gesundheits-Check („🩺 Durchchecken lassen“) mit kleiner Belohnung
- ✅ Bewohner gehen beim Ansprechen vor Winston

**M7d ✅ Thalia**
- ✅ Ankündigungsbrief, gelbes Häuschen hinter der Brücke, Begrüßungsszene
- ✅ Schaufel (Taste 4): jeden Tag ein paar funkelnde Grabstellen – 7 Fossilien & 4 Kristalle,
  neuer Sammelbuch-Reiter „🦴 Funde“
- ✅ Thalias Dorfkarte (Taste M / 🗺️) mit Häusern, Bewohnern und Lina
- ✅ Samstags 19–22 Uhr Party auf dem Dorfplatz: Lichterketten & Wimpel, alle Bewohner kommen,
  „💃 Tanzen!“ mit Thalia (Freundschaft für alle)
- ✅ Herz-Geschenke: Fossilien-Vitrine, Globus

**M7e ✅ Feste**
- ✅ Advent & Weihnachten (geschmückter Baum auf dem Dorfplatz, Geschenke von allen), Silvester (Feuerwerk
  ab 20 Uhr, Glücksklee von Oma), Neujahr, Ostern (bunte Eier im Gras suchen), Halloween (Kürbisse vor allen
  Häusern), Linas Geburtstag (Luftballons am Haus, Geschenke von allen)
- ✅ Jeder Bewohner hat eigene Fest-Sprüche; Geschenke einmal pro Fest und Jahr

**M7f ✅ Jens' Galerie & Sonntagsessen**
- ✅ 12 Kunstwerke (von Jens, Oma, Thalia, Oli), jeden Tag eins zum Kaufen; der Galerie stiften oder zu Hause
  auf einer Staffelei aufstellen
- ✅ Sonntagsessen bei Jens zu Hause (18–20 Uhr): Oli & Lars immer, Olaf, Christin & Oma manchmal – an Jens'
  Tür klopfen und mitessen
- ✅ Jens sächselt gern mit Lina
- ✅ Olis Geburtstag (29.07.): eigene Sprüche, Geschenke freuen doppelt, Oma erinnert vorher daran
- ⬜ Weitere Geburtstage der Bewohner (Daten noch offen) – Olaf & Jens sind Zwillinge
- ✅ Lars: Praxis/Apotheke (Tees, Gesundheits-Check) → M7c
- ✅ Olaf: Sparbuch mit kleinen Zinsen (M8d)
- ✅ Jens: Bistro/Kochstudio (Rezepte) & Galerie (Kunstwerke sammeln/ausstellen) → M7b, M7f
- ✅ Thalia: Partys, Dorfkarte, Gesteine/Fossilien → M7d · ⬜ Wetterstation, neue Gebiete
- ✅ Oli: romantische Szenen (Picknick, Sterne gucken, Küsschen), gemeinsames Haus/Zimmer → M7a, M8e
**M7h ✅ Fernsehabend & Linas Küche**
- ✅ Fernseher (Katalog): Datingshow „Blind Date am Leuchtturm“, Doku „Großer Weg – Mein neues Leben“
  (respektvoll), True Crime „Wahre Fälle vom Land“, Kochshow „Kochen mit Herz“ – jeden Tag neue Folgen
- ✅ Oli schaut mit, wenn er zu Hause ist (Kommentare, Freundschaft); Kochshow bringt 3 neue Rezepte bei
- ✅ Küchenzeile mit Herd & Sofa im Katalog – Lina kocht zu Hause
- ✅ Tür-Animation beim Betreten & Verlassen von Gebäuden (Lina geht hinein, weiches Abblenden, tritt heraus)
- ✅ Lina im Sommer: kurzes schwarzes Oberteil mit kurzer Hose

**M7g ✅ Treffen der Bewohner & Linas Streetwear**
- ✅ Kaffeeklatsch an Omas Bank (Mo/Mi/Fr 15–17), Angeln am Fluss (Olaf & Christin, Di/Do/Sa 16–18),
  Training auf der Wiese (Oli & Lars, Mi/Sa 8–10), Steine & Skizzen am Strand (Thalia & Jens, Di/Fr 13–15)
- ✅ Lina gesellt sich dazu und hört mit (Freundschaft für alle), Emojis über den Köpfen, Angeln in der Hand
- ✅ Lina: Oversize-Sweatshirt, kurze Hose im Sommer, Fleece-Jacke im Winter („Streetwear je nach Jahreszeit“)
- ✅ Feste: Weihnachten, Silvester, Linas Geburtstag (16.06.) → M7e · ⬜ Geburtstage der übrigen Bewohner (siehe oben)

## 🚧 M8 – Feinschliff

- ✅ **M8a Klang:** Musik & Geräusche komplett selbst erzeugt (Web Audio, keine Audiodateien)
  - Musik komponiert sich laufend aus kleinen Phrasen (`core/music.ts`), Stimmung nach Tageszeit, Wetter,
    drinnen und Party (Spieluhr morgens, Marimba tags, Flöte abends, leise Nacht, Party mit Beat)
  - Umgebung: Vögel tagsüber, Grillen nachts (nicht im Winter), Regen, Meeresrauschen am Strand
  - Geräusche: Schritte (Holz drinnen), Aufheben, Tür, Angeln (Platsch, Biss, Fang), Kescher, Münzen, Bauen,
    Bellen, Gackern, Graben, Herz, Post, Dialog-Blubb
  - Lautstärkeregler für Musik & Geräusche im Menü (wird gespeichert)
- ✅ **M8b Kleidung & Gruselkanal:** Linas Lieblings-Sweatshirts (Hawaii, Sport, Radierkopf) mit weiter Anzughose,
  im Herbst/Frühling täglich wechselnd · Oli zieht sich um (alles in Schwarz: Bandshirts, Polo, Überjacke; Hosen schwarz/beige/Jeans; Chunky-Sneaker) ·
  Gruselkanal im Fernseher („Gänsehaut um Mitternacht“), Sprüche der Bewohner zu Linas Horror-Liebe
- ✅ **M8d Sparbuch:** In Olafs Dorfkasse einzahlen & abheben, wann man will. Am Monatsanfang gibt es 1 % Zinsen
  (mit Zinseszins, höchstens 2000 ⭐ im Monat, verpasste Monate werden nachgeholt) und einen Kontoauszug-Brief von
  Papa. Spielstand v12
- ✅ **M8e Küsschen:** Lina & Oli smoochen gern und oft – „😘 Küsschen geben“ im Gespräch (so oft man mag), Oli holt
  Lina zu Hause mit einem Begrüßungsküsschen ab und gibt ihr zwischendurch spontan eins. Vorbeugen, Augen zu, Lina
  auf Zehenspitzen, „Mwah“ und Herzchen
- ✅ **M8f Wand-Deko:** Winston-Porträt, Gruselfilm-Poster, Wandregal, Wanduhr, Rollbild, Wimpelkette, Fotowand
  (leuchtet), runder Spiegel, Trockenblumenkranz – an Rück- & Seitenwänden, Möbel passen darunter
- ✅ **M8g Neue Stile:** Cottagecore (Landhaustisch, Blümchensessel, Häkelteppich, Kräuter, Kerzenleuchter, Wollkorb),
  Retro-Oma-Chic (Ohrensessel, Nierentisch, Fransenlampe, Bonbonschale, Orientteppich, Gummibaum), Modern
  (Loungesofa, Marmortisch, Bogenlampe, Würfelregal, Sitzsack, Keramikvase) – dazu 6 Tapeten & 3 Böden
- ✅ **M8h Mid-Century & Bauhaus:** Leder-Loungesessel, Freischwinger (auch mit Wiener Geflecht), Teak-Sideboard,
  Satztische, Dreibein-Stehlampe, Opalglas-Leuchte, Formen-Teppich, Formen-Bild & Sonnenspiegel (Wand), dazu
  Bauhaus-Formen- & Atomic-Tapete, Nussbaum-Parkett & Schachbrett-Fliesen
- ✅ **M8i Hausausbau 2:** drei neue Stufen – **Wohnküche** (Wohnzimmer wächst auf 12 × 8, eigene Küche mit Herd),
  **Wintergarten** (Glaswände, Terrakotta, Pflanzen), **Keller** (Backstein, kleine Fenster oben, Treppe nach unten);
  außen: Küchenanbau mit Ofenrohr, Glas-Wintergarten, Kellerfenster & Luke. Anbauten blockieren jetzt ihre Kacheln
  (vorher konnte man durch den Schlafzimmer-Anbau laufen)
- ✅ **M8j Fortschritt statt Kalender:** Einzüge per Meilenstein (Olaf: Sammelbuch & Verkaufen · Oli: erstes Möbel
  aus dem Katalog · Jens: Werkbank & Sammelbuch · Lars: Kochen & Verkaufen · Thalia: Durchchecken & Sammelbuch),
  Einzug & Hausausbau nach ~10 Min Spielzeit, sanfte Hinweise der Bewohner; Echtzeit bleibt für Tag/Nacht,
  Jahreszeiten, Feste & Tägliches. Spielstand v13
- ✅ **Brabbelsprache & Musik:** Jede Figur brabbelt beim Sprechen in eigener Stimme (Oma zittrig hoch, Lars tief,
  Jens lebhaft …); die Musik ist deutlich hörbarer und gemütlicher (warmes Pad, E-Piano-Akkorde)
- 🔶 **M8c Animationen & Partikel** (erster Schwung ✅): Staubwölkchen beim Rennen, Spritzer beim Angeln,
  Funkeln beim Aufheben & Fangen, Herzchen (Herz-Aufstieg, Lieblingsgeschenk, Winston streicheln), Erdklumpen
  beim Graben, Konfetti beim Bauen & Kochen, Glühwürmchen in Sommernächten · Lina macht Freudensprünge,
  Bewohner winken zur Begrüßung, Figuren schauen sich beim Stillstehen um
- ✅ **Christins Rolle:** gießt abends Linas Garten mit (nicht bei Regen), Ordnungstipp des Tages im Gespräch
  (14 echte kleine Spieltipps), neue Garten-Sprüche
- ✅ **Winterzauber:** Olis Adventskalender (24 Türchen per Post, am 24. eine Schneekugel mit Lina, Oli & Winston),
  Schneebälle sammeln & Schneemann bauen (taut außerhalb des Winters), Wintermöbel im Katalog (Weihnachtsbaum,
  Adventskranz, Kaminofen, Lebkuchenhaus, Nussknacker, Schneeflocken-Teppich & -Tapete, Lichtervorhang, Strumpf,
  Schlitten), Bratapfel & Zimtsterne, Punschstand am Weihnachtsbaum, Fußspuren im Schnee, Atemwölkchen,
  Schneeflocken fangen · Modelle für Sparschwein, Weihnachtsstern & Kuscheldecke (waren rosa Würfel)
- ✅ **Dr.-No-Porträt neu gestaltet:** Wandbild und Buchcover zeigen Dr. No jetzt mit Drahtbrille, grauen Schläfen, Polo & goldenem Stethoskop
- ✅ **M8m Poster & Bildbände:** Retro-Kaffee-Poster und drei Coffee-Table-Books (Kaffee, Dr. No, Kawaii), Stil „Lieblingsthemen“
- ✅ **M8l Kaffee:** vier Siebträgermaschinen in Preisklassen (3 neue 3D-Modelle), 8 Getränke, Kaffee-Kick, Kaffee zu zweit mit Oli
- 🚧 **M8k Beet & Samen** (Schritt für Schritt, jeder Schritt einzeln spielbar – Ideen werden verworfen, wenn sie sich im Spiel nicht lohnen)
  - ✅ **Phase 1 – Kreuzungen:** Farbvarianten für Tulpe, Rose, Sonnenblume, Lavendel & Vergissmeinnicht (22 Blüten),
    Misch-Samen beim Pflücken, wenn zwei Farben nebeneinander blühen, Sammelbuch-Reiter „Blumen“, Samen-Farben per Post,
    gelbe Tulpen im Starterset
  - ⬜ Phase 2 – Samen kaufen (Samenstand)
  - ⬜ Phase 3 – Gemüse & Kräuter zum Kochen
  - ⬜ Phase 4 – Sträuße & Blumendeko (Vase, Kranz, Geschenke)
  - ⬜ Phase 5 – Gewächshaus für den Winter
- ✅ **M8o Wand-Deko & Regale:** Wand-Deko darf über niedrigen Möbeln hängen (Höhenprüfung), Tassenbord statt langem Standregal (4 Tassen je Feld), Hellerau-Leiterregale (3 Stück, 4 Farben)
- ✅ **M8n Sammeltassen:** 19 Tassen (Klassik, Saison, Städte) der ausgedachten Kette „Sternenbohne“, Tassenregal, Städte-Tassen von Jens' Reisen, Thalia & Oli
- ⬜ Weitere Animationen & Partikel, Balancing

## 💡 Ideen-Parkplatz

- Ganz am Ende (wenn das Spiel fertig ist): als App installierbar & offline spielbar (PWA), größere Schrift /
  weniger Bewegung als Einstellung

- Fotomodus/Postkarten, Tagebuch mit schönen Momenten
- Sternbilder am Nachthimmel, Glühwürmchen im Sommer

## ❓ Offene Fragen (bei Gelegenheit klären)

- Geburtstage der Bewohner
- Wer zieht als Erstes ein (nach Oma Gisela)? Welche Bauplätze für wen?
- Lieblingsessen/-farben/-hobbys der Bewohner für Geschenke & Dialoge
