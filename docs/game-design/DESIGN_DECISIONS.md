# Designentscheidungen

Getroffene Entscheidungen (aus Code, Doku und bisherigen Wünschen von Lina/Oli rekonstruiert) und offene Fragen.
Neue Entscheidungen werden unten angehängt.

Format: **Entscheidung** – Begründung – verworfene Alternative(n) – Auswirkungen.

## Getroffene Entscheidungen ✅

### D1 · Kein Scheitern, kein Zeitdruck, nichts Verpflichtendes
- **Warum:** Das Spiel ist ein entspannendes Geschenk; Stress widerspricht dem Zweck.
- **Verworfen:** Vertrocknen, Energie, Freundschaftsverlust, Kredit mit Zinsen/Frist.
- **Auswirkung:** Herausforderung ist kein Motor → Motivation muss aus Verbundenheit, Gestaltung und Entdecken kommen.

### D2 · Fortschritt über Meilensteine & Spielzeit statt Kalendertage (M8j)
- **Warum:** Früher hingen Einzüge an echten Tagen → Warten ohne Handlungsmöglichkeit.
- **Verworfen:** Herzen als Voraussetzung (steigen nur 1×/Tag → wieder Kalender-Warten).
- **Auswirkung:** Story in wenigen Stunden erlebbar; Echtzeit bleibt für Atmosphäre und Abwechslung.

### D3 · Echte Menschen als Bewohner, keine Tiere
- **Warum:** Persönliches Geschenk; Wiedererkennen ist der emotionale Kern.
- **Auswirkung:** Begrenzte Bewohnerzahl (7 + Winston), keine Bewohner-Rotation; Inhalte brauchen Wissen über
  die echten Personen (offene Fragen unten).

### D4 · Zinsloser Kredit für den Hausausbau
- **Warum:** Sofortige Belohnung (Raum ist da), Rückzahlung als selbstgewähltes Ziel ohne Druck.
- **Verworfen:** Erst sparen, dann bauen (verzögert Belohnung); Schulden mit Druck (Animal Crossing).
- **Auswirkung:** Sternchen-Ziel über lange Zeit; ein Ausbau zur Zeit.

### D5 · Möbel verkaufen sich für ¼
- **Warum:** Keine Arbitrage, Einrichten bleibt Ausgabe, nicht Investition.
- **Auswirkung:** Deko-Crafting ist bewusst keine Geldquelle.

### D6 · Freundschaft sinkt nie; nur das erste Gespräch/Geschenk am Tag zählt
- **Warum:** Keine Strafe fürs Pausieren; trotzdem kein Spam-Exploit (weitere Geschenke +1).
- **Auswirkung:** Herzen wachsen gleichmäßig über Tage; Plateau bei 5 Herzen.

### D7 · Fernsehen bewusst nicht „kuschelig“
- **Warum:** Lina mag True Crime, Horror, Dokus – ironischer Bruch, Liebe zum Echten vor Genre-Konvention.
- **Grenzen:** nichts Explizites, niemand wird verspottet.

### D8 · Winterruhe statt Absterben (Beet Phase 5)
- **Warum:** Jahreszeiten sollen spürbar sein, ohne Verlust.
- **Auswirkung:** Gewächshaus/Frühbeet als sinnvolles, optionales Ziel; Winter fühlt sich anders, nicht schlechter an.

### D9 · Misch-Farben nie käuflich
- **Warum:** Kreuzen ist eine Entdeckung, die man nicht abkürzen soll (Kompetenz & Stolz).

### D10 · Schritt-für-Schritt-Features mit Verwerfen-Option (Beet & Samen)
- **Warum:** „Ideen werden verworfen, wenn sie sich im Spiel nicht lohnen.“ Jede Phase einzeln spielbar.
- **Auswirkung:** Gute Basis für die hier eingeführte Designprüfung.

### D11 · Erinnerungsstücke gehen nie verloren
- **Warum:** Geschenke der Liebsten sind emotional wertvoll; Verkaufen/Verschenken aus Versehen wäre ein Verlust.

### D12 · Inhalte, die Lina nicht mag, werden entfernt
- **Beispiel:** Horror- und Zauberschul-Poster wieder entfernt.
- **Warum:** Zielgruppe = eine Person; ihr Geschmack ist der Maßstab.

### D13 · Keine Telemetrie
- **Warum:** Privates Geschenk; Playtesting erfolgt durch Beobachtung (siehe `PLAYTESTING.md`).
  *(Ableitung aus Architektur: keine externen Dienste zur Laufzeit.)*

### D14 · Game-Design-Wissensbasis & Designprüfung (Nov. 2026)
- **Warum:** Wunsch der Auftraggeber, dass neue Features vorher auf Spielerlebnis geprüft werden.
- **Auswirkung:** 8-Fragen-Prüfung vor neuen Mechaniken; Pflege der Dokumente in `docs/game-design/`.

### D15 · Jedes Herz bringt ein Geschenk (W2, Nov. 2026)
- **Erlebnis:** Ein neues Herz fühlt sich bei jedem Bewohner wie ein kleiner Höhepunkt an, nicht nur bei Oma und Oli.
- **Loop:** Freundschaft (Tage/Wochen) → Brief → Gestaltung (Säule 3) bzw. Beet/Kochen (Säule 4).
- **Wahl der Geschenke:** überwiegend **persönliche Erinnerungsstücke** mit Platz in der Welt (Säulen 1 & 3), die eine kleine
  Geschichte erzählen (Lars' erster „Patient“, Papas Foto). Dazu zwei Rezepte, die bestehende Systeme vertiefen
  (Thymiantee nutzt Phase-3-Kräuter, Steinmännchen nutzt Glitzersteine), Farb-Samen mit Kreuzungs-Tipp (Kompetenz) und
  ein Frühbeet (Funktion statt Zahl).
- **Ökonomie:** neutral. Erinnerungsstücke sind unverkäuflich; Thymiantee liegt mit 85 ⭐ aus 2 × 16 ⭐ (≈ 2,7×) in der
  Spanne; Steinmännchen ist Deko (¼-Regel). Das Frühbeet (sonst 1 800 ⭐) ist das einzige „wertvolle“ Geschenk – bewusst
  als spätes 5-Herz-Geschenk.
- **Neue Interaktion:** Papas Witze-Kalender zeigt beim Anschauen einen Witz pro Tag – kein Zähler, keine Pflicht,
  verpasste Tage sind egal (Witz ist reproduzierbar pro Datum, nicht gesammelt).
- **Verworfen:** zusätzliche Freundschaftspunkte oder Sternchen als Herz-Belohnung (Zahl statt Erlebnis); Herzen > 5 (offen, O3).

### D16 · Herzenswünsche als Spätspiel (W1, Nov. 2026)
1. **Erlebnis:** „Ich mache meinen Liebsten eine Freude – und das Dorf wird dadurch schöner.“ Ein selbstgewähltes Projekt
   für lange Sitzungen, mit einem sichtbaren, bleibenden Ergebnis.
2. **Loop:** Neuer Meta-Loop nach den Einzügen: Wunsch hören → Sammeln/Fangen/Anbauen → Erfüllen → neuer Ort im Dorf.
   Verbindet Freundschaft (Säule 1), Gestaltung der Welt (Säule 3/5) und alle Sammel-Systeme (Säule 4).
3. **Dynamik:** Lina plant („Für Oma brauche ich noch zwei Vergissmeinnicht, für Jens Fische“) – Ziele ergeben sich aus den
   Menschen, nicht aus einer Liste. Jede Farbe zählt → Kreuzungen werden nicht entwertet, aber nicht verlangt.
4. **Langzeit:** Phase 1 = 1 Wunsch je Bewohner (7). Das System trägt mehrere Wünsche je Bewohner (`order`) für spätere Phasen.
5. **Ökonomie:** Wünsche verbrauchen Materialien (Äste, Steine, Blumen, Fische, Insekten, Funde) und zusammen **5 000 ⭐**
   (Olaf 3 000, Thalia 2 000) – eine kleine, *bedeutsame* Spätspiel-Senke. Fische/Insekten/Funde bekommen eine Verwendung
   jenseits der Verkaufskiste (W6 teilweise). Belohnung: +30 Freundschaft + Ort, **keine** Sternchen.
6. **Exploits/Risiken:** keine Geldquelle; Gegenstände werden erst beim Erfüllen genommen (nichts geht „verloren“, wenn
   Lina es sich anders überlegt). Risiko „To-do-Liste“: bewusst *kein* Wunsch-Menü und kein Zähler – nur Gespräch und eine
   dezente 💭 auf Thalias Karte.
7. **Säulen:** 1, 3, 4, 5. **Leitplanken:** keine Frist, keine Reihenfolge, nichts verfällt.
8. **Einfacher?** Reine Sternchen-Projekte (Dorfkasse) wären einfacher, aber nur eine Zahl. Neue Gebiete wären größer und
   bräuchten mehr Inhalt. Wünsche nutzen Bestehendes und erzählen kleine Geschichten – bester Aufwand-Nutzen.
- **Technik:** Zustand komplett in Story-Flags (kein `SAVE_VERSION`-Wechsel), Orte als `landmark`/`steg` mit `requires`.

### D21 · Oli-Beziehung in Stufen (W3/F6, Nov. 2026)
- **Erlebnis:** Die wichtigste Beziehung hat einen Bogen: Mit jedem Herz kommt etwas Neues dazu, statt nach wenigen Tagen „fertig“ zu sein.
- **Entscheidung (Antwort auf O2):** Nichts Bestehendes wird eingeschränkt (kein Nerf für laufende Spielstände). Neu kommen
  **Inhalte** dazu: eine „Zeit zu zweit“-Szene je Herz (ohne Punkte), die Herzbank-Szene mit Jahreszeiten-Zeilen und Jubiläums-Briefe.
- **Ökonomie/Progression:** Szenen ohne Punkte, Herzbank +8 (Picknick/Sterne 24), Jubiläumsgeschenke je ein Strauß (150/700 ⭐, einmalig).
- **Grenze:** Szenen spielen nur im gemeinsamen Spiel-Alltag (Haus, Küche, Dorf) – keine erfundene Vorgeschichte der echten Personen.
  **Bitte gegenlesen**, ob Olis Sätze zu ihm passen.
- **Offen:** Weitere Stufen jenseits von 5 Herzen (O3), Jahrestag jedes Jahr statt nur das erste Mal.
### D20 · Erinnerungen im Gespräch (W5/F8, Nov. 2026)
- **Erlebnis:** „Sie haben das bemerkt!“ – Bewohner reagieren auf Linas Spielstand; Gespräche wiederholen sich nach Wochen weniger.
- **Entscheidung:** Neue Erinnerungen werden **einmal von sich aus** erzählt (damit sie auffallen), danach nur noch gelegentlich im Plaudern
  (kein tägliches Wiederholen derselben Zeile).
- **Grenze (Säule 1 / Feedback):** Nur Ereignisse aus dem Spiel, **keine erfundenen Kindheits- oder Familiengeschichten** der echten Personen.
  Echte Insider können später von Lina/Oli kommen (siehe offene Frage Q7 im Audit).
- **Technik:** Tags aus dem Spielstand (`memoryTags`), keine neuen Spielstandfelder außer `world.dates['erinnerung:<id>']`.
- **Offen:** Pools für Thalia/Oli/Olaf weiter aufstocken; weitere Tags (Wünsche, Kreuzungen, Kaffee).
### D19 · Tagesfunde sammeln sich an (F4/E5, Nov. 2026)
- **Erlebnis:** Pausen fühlen sich nicht nach Verlust an; keine „ich muss heute noch zu den Hühnern“-Pflichtrunde.
- **Entscheidung:** Eier (Hühner 2–3, Wachteln 3–4 pro Tag) und Winstons Buddelfunde sammeln sich bis zu **3 Tage** an. Keine weiteren
  Quellen geändert (Felsen, Muscheln, Grabstellen bleiben Tagesritual).
- **Ökonomie:** Obergrenze 3 Tage → kein Belohnen von Fernbleiben (nach 3 Tagen Pause gleich viel wie nach 3 Tagen Spielen), Eier ≈ 20 ⭐ ×
  Stall → höchstens ~9 Eier pro Besuch, unkritisch.
- **Alternative verworfen:** unbegrenzt ansammeln (würde Pausen „lukrativer“ machen) oder alle Tagesquellen ansammeln (verwässert den Tagesrhythmus).
- **Playtest:** „Muss-noch“-Aussagen zählen (siehe PLAYTESTING).
### D18 · Vorratstruhe (W4/F5, Nov. 2026)
- **Erlebnis:** Sammeln und Beetpflege ohne Inventar-Tetris; längere Sitzungen werden nicht durch Heimwege unterbrochen.
- **Entscheidung:** Ein gemeinsamer Vorrat (60 Plätze) für alle Truhen statt Inhalt pro Truhe → nichts geht verloren, kein Aufräumen vor dem Verschieben.
- **Ökonomie:** Möbel für 650 ⭐ (Katalog-Mitte) – keine neue Einnahmequelle, nur Komfort. Werkzeuge sind ausgeschlossen (griffbereit).
- **Risiko:** Horten (unkritisch, nichts verfällt). Verkauf bleibt vor Linas Haus (zweite Verkaufsstelle weiter offen).
- **Playtest:** Heimwege pro 30 Minuten zählen (Ziel ≤ 3, siehe PLAYTESTING).
### D17 · Winston wird gefunden statt von Anfang an dabei zu sein (Nov. 2026)
- **Erlebnis:** Ein erstes kleines Abenteuer in den ersten Minuten; die Bindung zu Winston entsteht durch Hilfe statt durch Vorgabe
  (Verbundenheit, Kompetenz: „Ich habe ihn gerettet“).
- **Loop:** Onboarding: Oma → Werkzeuge → Fiepen → Winston → weiter mit den Einzügen. Das Ereignis ist ein Meilenstein vor Olafs
  Ankündigung, damit niemand ohne Winston in die Szenen mit seinem Namen stolpert.
- **Autonomie:** Das Fiepen ist ein Anreiz, keine Pflicht-Quest: kein Zeitlimit, Lina geht hin, wann sie mag; „Gleich wieder“ ist
  möglich. Oma gibt in-character einen Hinweis („Hörst du das auch?“).
- **Nebenwirkungen:** Ältere Spielstände behalten Winston (kein Verlust). Dialoge mit seinem Namen sind bis zum Fund gesperrt (Tag).
- **Playtest:** Findet Lina das Fiepen ohne Hinweis? Wie lange dauert es bis zum Fund?

### D23 · Herzenswünsche Phase 2 – Wünsche von Lina/Oli (Nov. 2026)
- **Erlebnis:** Wünsche, die zu den echten Menschen passen (Oma: Eierlikör; Olaf: Flugzeugmodelle; Christin: Volkstanz im Verein; Jens: Fernweh;
  Lars: Steine & Science-Fiction; Thalia: Partys) statt erfundener Wünsche – Antwort auf Audit-Frage Q7 und Feedback („keine erfundenen Details“).
- **Auswahl aus Linas Liste:** je Bewohner der Wunsch, der mit den bestehenden Systemen am besten verknüpft ist (Hühner → Küche → Oma; Werkbank-Material → Olaf;
  Beet-Strauß & Kuchen → Christin; Schaufel-Funde → Lars; Gerichte & Strauß → Thalia). **Nicht umgesetzt** (bewusst): Whiskey, Shoppen, Sommerkleid, Käse, Hummer,
  Konzert und Thalias Priester-Wunsch – Letzterer ließe sich nur mit einer neuen Figur respektvoll umsetzen; bei Bedarf als Brieffreund („Pater Matteo“) später.
- **F7 (Entscheidungen):** Jens' Urlaub ist der erste Wunsch mit echter **Wahl** (Hawaii/Japan); beide Tassen sind später auch über seine Reisen erreichbar.
- **Ökonomie:** Sternchen-Beiträge 600 / 1.500 / 400 (Spätspiel-Senke); Geschenke sind unverkäufliche Erinnerungsstücke. **Dezent:** Omas Likör bleibt eine
  humorvolle Randbemerkung (CLAUDE.md).
- **Bitte gegenlesen:** Texte der sechs Wünsche in `data/wishes.ts`.
### D22 · Vollständige Sammlungen werden gewürdigt (W7/F10, Nov. 2026)
- **Erlebnis:** Ein langfristiges Sammelziel bekommt einen emotionalen Abschluss – von einem Menschen, nicht von einem Pop-up.
- **Entscheidung:** Brief (im Ton des Bewohners) + **Urkunde** als Wand-Erinnerungsstück statt Erfolge-Menü oder Zahl-Belohnung
  (Säulen 1 & 3). Keine Sternchen, keine Statistik-Seite.
- **Ökonomie:** neutral (unverkäufliche Urkunde). **Pacing:** Ganzjahresziele (Fische/Insekten/Saison-Tassen) bekommen ein Ende, das man sich aufhängt.
- **Technik:** Absender muss eingezogen sein (sonst kommt der Brief später). Nebenbei behoben: `ownsAnywhere` kannte die Vorratstruhe nicht.
- **Offen:** Kunstwerke/Rezepte/Sträuße als weitere Sammlungen; Urkunden-Anzeige im Sammelbuch.

### D24 · Pater Matteo als Brieffreund (Nov. 2026)
- **Anlass:** Thalias Wunsch „einen italienischen, katholischen, gutaussehenden Priester als Freund“ (Antwort auf Rückfrage: Ja).
- **Umsetzung respektvoll und ohne neue Figur im Dorf:** Pater Matteo existiert nur als **Briefschreiber** (ausgedachte Figur, keine echte Person).
  Die Pointe „gutaussehend“ ist ein leiser Insider von Thalia („wissenschaftlich irrelevant, aber nicht uninteressant“); er selbst bleibt bescheiden, humorvoll, fromm
  ohne Predigt. Kein Flirt, kein Spott über Glauben.
- **Loop:** Päckchen schicken (Fund + Gebäck + Sternchen) → vier Briefe über 50 Tage mit kleinen Geschenken (Samen, Stein, Tasse) – ein ruhiger, optionaler Nachklang.
- **Ökonomie:** Wunsch kostet 100 ⭐, Geschenke klein; die Tasse „Montecielo“ erweitert die Sammlung „Alle Tassen“ auf 22.
- **Bitte gegenlesen:** `data/matteo.ts` und Thalias Wunsch in `data/wishes.ts`.

### D25 · Olis Wünsche: Kino und seltenes Bandshirt (Nov. 2026)
- **Anlass:** Olis Wunschliste von Lina: gemeinsam ins Kino zu einem Kultfilm ihres Lieblingsregisseurs, ein seltenes Bandshirt.
- **Namen (auf Linas Wunsch):** Der Film heißt „Verlorene Autobahn“ (Titel eines echten Kultfilms, bewusst von Lina gewählt; der Regisseur wird nicht genannt, nur der Bezug zu Linas „Radierkopf“-Pulli). Die Bands auf Olis Shirts sind ausgedacht: „Kaltbrand“ und „Sieben Schwerter“ im Wechsel, „Letzte Ruhestätte“ als seltenes Tourshirt (Wunsch).
- **Designprüfung:** Beide Wünsche sind optional, ohne Frist und ohne Streak. Kino ist eine **gemeinsame Szene** (Verbundenheit), das Shirt eine **sichtbare Veränderung**
  an Oli (Besitz/Persönlichkeit). Kosten bescheiden: 120 ⭐ + 2 Snacks bzw. 300 ⭐ + 1 Bernstein (Thalias Sammler tauscht) – Sternchen-Senke ohne Grind.
- **Technik:** `Appearance.band` (optional) und `wardrobeFor(session, def)`; kein neues Spielstand-Feld (Flags), kein `SAVE_VERSION`-Wechsel.
- **Bitte gegenlesen:** Wunschtexte und Erinnerungszeilen (`data/wishes.ts` `oli-kino`/`oli-bandshirt`, `data/erinnerungen.ts` Tags `kino`/`tourshirt`).

---

## Offene Designentscheidungen ❓

| # | Frage | Warum wichtig | Optionen |
|---|---|---|---|
| O1 | ✅ *entschieden (D16): Herzenswünsche – (a) + (b) kombiniert.* **Wie soll das Spätspiel aussehen?** (nach Thalias Einzug) | größter Hebel für Langzeitmotivation | (a) Bewohner-Wünsche/kleine Geschichten, (b) Dorf-Projekte mit Sternchen, (c) neue Gebiete (Thalia), (d) bewusst „nur“ Sandbox |
| O2 | Soll die Beziehung zu Oli **Stufen** haben, oder ist „alles ab Einzug“ gewollt? | Romantik ist zentral, Herzen sind schnell voll | Momente nach Herzen freischalten · neue Momente nach Jahrestagen · so lassen |
| O3 | Bleibt es bei **max. 5 Herzen**? | Plateau | so lassen + Herzen füllen · „Erinnerungen“ statt Herzen danach |
| O4 | Darf es eine **Vorratskiste** geben? | Inventar-Reibung | Truhe im Haus · Tasche erweitern (z. B. als Herz-Geschenk) · so lassen |
| O5 | Sollen tägliche Ressourcen **ansammeln** (z. B. Eier bis 3 Tage)? | Pflichtrunde vs. Tagesritual | ansammeln · so lassen |
| O6 | Geburtstage der übrigen Bewohner | Feierliche Höhepunkte | Daten fehlen (seit Langem offen) |
| O7 | Fotomodus/Tagebuch – welche Form? | Besitz & Erinnerung | Screenshot-Modus · automatisches Tagebuch schöner Momente · beides |
| O8 | Lieblingsessen/-farben/-hobbys der Bewohner | Glaubwürdige Geschenk-Vorlieben | Infos von Lina/Oli |
| O9 | Soll Angeln mehr **Geschick** bekommen? | Kompetenz vs. Entspannung | (Empfehlung: nein – Entspannung ist hier Absicht) |
