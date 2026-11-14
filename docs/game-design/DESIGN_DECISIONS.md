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

### D26 · Abend-Erreichbarkeit statt Zeit verschieben (Nov. 2026)
- **Anlass:** Audit F1/F18 – Lina spielt tagsüber **und** abends; Inhalte, die nur tagsüber da sind, sollen für sie nicht dauerhaft unerreichbar sein.
- **Entscheidung:** Kleinste Lösung (Audit-Empfehlung b): elf reine Tagarten bis **20 Uhr** („Abendsonne“), plus ein **Abendtreffen** (Thalia & Lars am Strand, Mo/Do 18–20).
  Die größere Alternative (c) „Spieluhr verschieben“ bleibt 💡 offen.
- **Kosten/Nutzen:** Verwässert die Tageszeit-Unterschiede nur um zwei Abendstunden; kein neues System, kein Zwang. Test sichert: jede Art ist abends erreichbar.

---

### D27 · Katalog nach Kategorie, Typ und Stil (N3, Nov. 2026)

**Entscheidung:** Der Möbelkatalog filtert über drei unabhängige Achsen (Kategorie, Typ, Einrichtungsstil); Stücke haben
0–n Stile, Stilloses (Pflanzen, Garten, Lieblingsthemen) wird über die Kategorie gefunden. 16 Stile, einige kommen mit
Einzügen (F13); das neue Kernsortiment folgt schrittweise. Alles per Pfeiltasten bedienbar.
**Begründung:** Die Audits 2/3 nannten den Katalog unübersichtlich (N3) und rieten von neuen Stilen „ohne Not“ ab. Erst die
Navigation lösen, dann Stile ergänzen – so wächst das Sortiment, ohne dass Lina sich verliert. Mehrfachstile statt
Duplikaten; nichts verschwindet (die Freischaltung hängt an der bisherigen Linie, nicht an den neuen Stil-Schildern).
**Verworfen:** eine Stil-Startseite („Showroom“, langsamer beim Suchen nach Typ), Seitenleiste (schmaleres Raster),
genau ein Stil je Stück.

### D28 · Sternchen-Balancing: mehr verdienen, günstiger ausbauen, Bausparen (Nov. 2026)

**Anlass:** Lina-Feedback: Sternchen sammeln dauert zu lange; das Sparbuch ist kein Anreiz. Nachgerechnet: Haus 273,8 k +
Katalog 185 k + Flächen 62 k ≈ 520 k ⭐ bei gemütlich ~3–5 k ⭐/h – allein der Ausbau 55–90 Stunden. Der Katalog ist seit dem
letzten Audit um ~80 % gewachsen, die Einnahmen nicht.
**Entscheidung:** (1) Fische & Insekten × 1,5 (zentraler Faktor, Fischgerichte mitgezogen); (2) Ausbau-Stufen 2–6 günstiger
(zusammen 200,8 k, Zuwachs weiter 8–12 k je Stufe); (3) Sparbuch-Zinsen wöchentlich (5 %, max. 2 500, 26 Wochen nachholbar);
(4) „Olafs Bausparen“: Ausbau vom Sparbuch → Papa übernimmt 15 %.
**Begründung:** Einnahmen heben wirkt überall gleichzeitig und braucht keine 200 Einzelpreise. Bausparen gibt dem Sparbuch
einen *sofort spürbaren* Zweck (Sparziel mit Belohnung) statt eines kaum merklichen Zinses; es ist einmalig je Stufe und nicht
ausnutzbar. Keine Strafe fürs Pausieren (verpasste Wochen werden nachgeholt), kein Zwang (Kredit bleibt).
**Verworfen:** alle Möbelpreise senken (viel Aufwand, Preise sind auch Wertsignal); Tagesbonus fürs Einloggen (FOMO);
Zuschuss auf jede Einzahlung (Ein-/Auszahlen wäre ausnutzbar).

## Offene Designentscheidungen ❓

| # | Frage | Warum wichtig | Optionen |
|---|---|---|---|
| O1 | ✅ *entschieden (D16): Herzenswünsche – (a) + (b) kombiniert.* **Wie soll das Spätspiel aussehen?** (nach Thalias Einzug) | größter Hebel für Langzeitmotivation | (a) Bewohner-Wünsche/kleine Geschichten, (b) Dorf-Projekte mit Sternchen, (c) neue Gebiete (Thalia), (d) bewusst „nur“ Sandbox |
| O2 | Soll die Beziehung zu Oli **Stufen** haben, oder ist „alles ab Einzug“ gewollt? | Romantik ist zentral, Herzen sind schnell voll | Momente nach Herzen freischalten · neue Momente nach Jahrestagen · so lassen |
| O3 | Bleibt es bei **max. 5 Herzen**? | Plateau | so lassen + Herzen füllen · „Erinnerungen“ statt Herzen danach |
| O4 | Darf es eine **Vorratskiste** geben? | Inventar-Reibung | Truhe im Haus · Tasche erweitern (z. B. als Herz-Geschenk) · so lassen |
| O5 | Sollen tägliche Ressourcen **ansammeln** (z. B. Eier bis 3 Tage)? | Pflichtrunde vs. Tagesritual | ansammeln · so lassen |
| O6 | ✅ *entschieden (Nov. 2026): Daten von Oli erhalten, umgesetzt.* Geburtstage der übrigen Bewohner | Feierliche Höhepunkte | nur Oma Gisela fehlt noch |
| O7 | Fotomodus/Tagebuch – welche Form? | Besitz & Erinnerung | Screenshot-Modus · automatisches Tagebuch schöner Momente · beides |
| O8 | Lieblingsessen/-farben/-hobbys der Bewohner | Glaubwürdige Geschenk-Vorlieben | Infos von Lina/Oli |
| O9 | Soll Angeln mehr **Geschick** bekommen? | Kompetenz vs. Entspannung | (Empfehlung: nein – Entspannung ist hier Absicht) |

### D29 · Audit 4: neue Stile ankündigen, Ökonomie-Doku, Katalog-Budget (Nov. 2026)

**Anlass:** Audit 4 ([`GAME_DESIGN_AUDIT_4.md`](GAME_DESIGN_AUDIT_4.md)): Die Einzüge schalten 71 Katalog-Einträge frei, aber nichts sagt es Lina (A2);
der Katalog hat sich verdoppelt, ohne dass eine Regel das Einkommen mitzieht (A3); `GAME_ECONOMY.md` war wieder veraltet (A8).
**Entscheidung:** (K1) Jede Einzugsszene endet mit einem Satz der Person, welche Stile sie mitbringt (`STYLE_ARRIVAL_LINES`), und der Stil-Chip
im Katalog trägt „neu“, bis Lina den Stil einmal angeschaut hat (Flag `stil-gesehen-<stil>`, kein neues Spielstand-Format). (K2) `GAME_ECONOMY.md` und
`PROGRESSION.md` auf den Stand gebracht. (K3) Katalog-Budget: Summe ≤ 300 000 ⭐, Möbel-Median ≤ 1 000 ⭐ als Test (`game/catalogBudget.test.ts`) plus
Leitlinie in `BALANCING_GUIDELINES.md`.
**Begründung:** Die Kopplung „Einzug → neue Stile“ war als Vorfreude gedacht; ohne Ankündigung verpufft sie. Der Test zwingt bei der nächsten großen
Welle zu einer bewussten Entscheidung statt zu nachträglichem Gegensteuern.
**Designprüfung (kurz):** 1 „Mit Thalia kommt etwas Neues“ · 2 Meta-Loop (Einzüge) · 3 Neugier auf den Katalog · 4 jeder Einzug bleibt ein kleines Ereignis ·
5 keine Änderung · 6 keine Exploits · 7 Säule 2 (ein Satz, keine Liste) und Säule 5 · 8 einfacher: nur ein Toast – weniger persönlich und flüchtig.
**Verworfen:** Aufgabenliste „X neue Stile“ im Notizbuch (Quest-Log-Gefühl); Pop-up-Fenster beim Einzug.

### D30 · Bauspar-Prämie 25 %, Herzen-Hinweis von Oma (Nov. 2026)

**Anlass:** Audit 4, A4: „Kredit nehmen und das Sparbuch behalten“ schlug die 15 %-Prämie nach ≈ 3,5 Wochen. Außerdem erfährt Lina nirgends, dass Plaudern,
Geschenke und gemeinsame Momente die Herzen füllen.
**Entscheidung:** (1) „Olafs Bausparen“ von 15 % auf **25 %** (`BAUSPAR_BONUS`): Lina zahlt 75 % vom Sparbuch, alle sechs Stufen kosten so ≈ 151 000 statt ≈ 171 000 ⭐;
Bausparen bleibt jetzt etwa 6 Wochen lang die bessere Wahl gegenüber „Kredit + Sparbuch behalten“. Zinsen und Kredit bleiben unverändert (Variante B der Optionen A–D).
(2) Oma Gisela sagt bei der ersten Begegnung einen Satz zu den Herzen (`GISELA_WELCOME_2`) – bewusst ohne Zahlen und ohne Pflicht.
**Verworfen:** Zinsen deckeln (nimmt den Anreiz, den Lina wollte), Zinsen bei offenem Kredit aussetzen (fühlt sich wie Strafe an), eine Freundschafts-Übersichtsseite
(erst im Playtest schauen, ob Lina sie vermisst).
**Designprüfung (kurz):** 1 Sparen lohnt sich spürbar · 2 Meta-Loop Hausausbau · 5 Ausbau insgesamt ≈ 12 % günstiger (Einnahmen unverändert) · 6 Prämie weiter nur beim Bestellen, einmal je Stufe, keine Ein-/Auszahlungs-Tricks · 7 Säule 2 · 8 einfacher: nichts ändern (Audit-Empfehlung) – von Oli bewusst anders entschieden.

### D31 · Schummrig werden (Bier & Wein) und ruhigere Musik draußen (Nov. 2026)

**Anlass:** Wunsch von Oli: Lina soll im Café bei Jens oder zu Hause Bier und Wein trinken und kurz schummrig werden (unscharfes, wackliges Bild,
schwierigere Steuerung, Torkeln), das bald wieder nachlässt. Außerdem wechselte die Musik draußen zu oft.
**Entscheidung:** (1) `core/tipsy.ts`: Schwips-Wert, ein Glas ≈ 1 Minute, Obergrenze, Wasser macht klar; Wirkung nur optisch/leicht in der Steuerung
(Blur ≤ 3 px, Neigung ≤ 2°, Laufrichtung pendelt höchstens um ±32°, Tempo ≥ 80 %). Orte: Tresen, Retro-Kühlschrank, Weinregal; kostenlos. (2) Lieder 3 Runden lang, Stimmungs-Dämpfer `gateMood`.
**Begründung:** Passt zu Linas Charakter (Feierabendbier, „wird richtig lustig“) und zu Säule 5; bleibt freundlich, weil Lina sich selbst bremst und alles von allein
vergeht. Kein Fortschritt, keine Belohnung, keine Zahlen, nichts gespeichert – nie glorifizierend.
**Designprüfung:** 1 Ein lustiger, kurzer Moment („Ups, alles wackelt“) · 2 Mikro-Loop, kein Tagesloop · 3 Dynamik: etwas Neues an Steuerung & Bild, danach wieder normal ·
4 Charakter und Humor, kein Langzeitziel · 5 keine Wirtschaftsänderung (aufs Haus) · 6 Exploits: keine (Schwips bringt nichts; Obergrenze verhindert Dauer-Zustand; nach dem Neuladen weg) ·
7 Säulen: kein Zwang, kein Scheitern, nie glorifizierend (Oma-Regel gilt hier ebenso) · 8 Einfachere Lösung: nur ein Text-Gag – ohne Bild- und Steuerungseffekt wäre es kaum spürbar.
**Verworfen:** Preise im Café (zusätzliche Sternchen-Logik ohne Mehrwert), Rausch-Stufen mit Folgen (Übelkeit, „Kater“) – wäre eine Strafe und passt nicht zu Linas Welt.
**Nachtrag:** Die Bewohner kommentieren Linas Schwips in zwei Stufen, liebevoll und nie verurteilend (Oma: „Ich frag nur für mich“, Lars: „Rezept vom Doktor: Wasser, Brot, Sofa“, Thalia: „Ich hol dir ein Wasser – mein Beitrag zur Freundschaft“). Höchstens alle 25 s je Bewohner, damit es nicht nervt.

### D32 · „Zeit zu zweit“ ohne Menüpunkt (Nov. 2026)

**Anlass:** Der Menüpunkt „💬 Zeit zu zweit“ war missverständlich (klang wie Picknick/Sterne/Herzbank), tauchte nur kurz auf und war eine reine Textszene ohne Aktion.
**Entscheidung:** Die fünf Szenen (eine je Herz) bleiben, aber ohne Menüpunkt: Das nächste Gespräch mit Oli zu Hause beginnt mit „Komm, setz dich kurz zu mir, Lini“ und der offenen Szene (eine je Gespräch, ohne Punkte).
**Begründung:** weniger Knöpfe, nichts bleibt versteckt, die Szene fühlt sich wie ein Moment an statt wie Verwaltung. **Verworfen:** nur umbenennen („Ein ruhiger Moment“) – bliebe ein unsichtbarer Menüpunkt.
**Designprüfung (kurz):** 1 ein ruhiger Moment mit Oli beim Wiedersehen · 2 Mikro-/Wochenloop, kein Tagesloop (jede Szene nur einmal) · 5 keine Punkte, keine Wirtschaft · 6 keine Exploits · 7 Säule 2 (nichts Verpflichtendes: Lina kann das Gespräch jederzeit schließen) · 8 einfacher: Menüpunkt nur umbenennen.

### D33 · Welle 1 der Feature Discovery: Freundschaften, Album, Training mit Thalia (Nov. 2026)

**Anlass:** [`FEATURE_DISCOVERY.md`](FEATURE_DISCOVERY.md): Herzen und Vorlieben sind nur im Dialog sichtbar, Momente hinterlassen keine Spur, Thalias neue Persönlichkeit hat keine Handlung.
**Entscheidung:** (A) Notizbuch-Reiter „Freundschaften“ zeigt nur **Entdecktes** (Herzen mit Füllstand, durch Schenken herausgefundene Vorlieben, Hinweis auf den nächsten Herz-Brief), keine Zahlen, keine Prozente. (B2) Reiter „Album“: abgeleitete, datierte Einträge in Linas Stimme; kein neues Spielstand-Format, nur das Datum wird in `world.dates` gemerkt; frühere Momente stehen unter „Früher“. (F) Bei Thalia zu Hause „Zusammen trainieren“, ohne Punkte.
**Bewusst nicht:** Fotos im Album (erst Text, E2), Hundekörbchen im Katalog (E3 nein), Ranglisten, Streaks, Pflichtfelder.
**Designprüfung:** 1 „Ach, Oma mag Pfirsiche, das wusste ich schon!“ / „Weißt du noch?“ / ein gemeinsamer Moment mit der besten Freundin · 2 Wochen-Loop (Wiedereinstieg), Mikro bei Thalia · 3 Nachschlagen statt Raten, Schenken wird zum kleinen Entdecken · 4 das Album wächst mit jeder Spielstunde und wird nie „fertig“ · 5 keine Wirtschaftsänderung · 6 Risiko „Aufgabenliste“: gelöst durch „nur Entdecktes“, keine Zahlen, keine leeren Felder zum Abhaken; Risiko „falsches Datum bei alten Spielständen“: gelöst durch „Früher“ · 7 stärkt Säule 4 (Beziehungen) und 2 (Entdecken) · 8 einfachere Lösung: nur Füllstand im Dialogfenster, löst die Vorlieben nicht.
