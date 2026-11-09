# Game Design Audit – Unabhängige Qualitätsprüfung

**Stand:** 9. November 2026 · **Geprüft:** `main` nach PR #65 (Herzenswünsche aus PR #66 noch nicht gemergt – separat bewertet)
**Grundlage:** Wissensbasis in `docs/game-design/`, Quellcode, Daten, Tests (54 Dateien / 299 Tests grün), Headless-Browser-Durchläufe
der letzten Features. **Während des Audits wurde nichts am Spiel geändert.**

## Wie belastbar sind die Aussagen?

| Marke | Bedeutung |
|---|---|
| **[N] Nachweis** | aus Code/Daten belegt oder im Spiel beobachtet |
| **[V] Vermutung** | begründete Einschätzung aus Daten und Genre-Erfahrung |
| **[P] Playtest nötig** | nur mit Lina (oder einer Stellvertreterin) wirklich prüfbar |

Wichtige Einschränkung: Headless-Chromium mit SwiftShader läuft mit wenigen Bildern pro Sekunde. Es eignet sich, um Abläufe und
Darstellung zu prüfen, aber **nicht, um Spielgefühl, Tempo oder Zeitaufwand zu messen.** Alle Zeitangaben sind deshalb [V].

Selbstkritischer Hinweis: Fast alles in diesem Spiel – inklusive der Wissensbasis und der letzten beiden Features – stammt aus
derselben Feder wie dieser Audit. Ich habe bewusst nach Stellen gesucht, an denen meine eigenen Entscheidungen schwächer sind
als dargestellt (siehe vor allem F3, F6, F9, F11).

---

## 1. Executive Summary

*Rina no Chiisana Sekai* ist ein **warmes, sehr persönliches und technisch sauberes** Cozy Game mit außergewöhnlich viel Inhalt
für ein Ein-Personen-Geschenk. Die Leitplanken (kein Scheitern, kein Verlust, kein Zeitdruck) werden fast lückenlos eingehalten.
Die Bewohner sind der stärkste Teil des Spiels.

Die größten Schwächen liegen **nicht** in fehlenden Features, sondern in drei strukturellen Punkten:

1. **Echtzeit gegen Linas Alltag (F1, kritisch, abhängig von ihren Spielzeiten):** Die Welt läuft nach der echten Uhr. Wer
   vorwiegend abends spielt, sieht 11 der 41 Tierarten nie, keins der vier Bewohner-Treffen und Teile der Tagesabläufe. Ein Teil des
   Inhalts ist dann faktisch unerreichbar, ohne dass das Spiel es erklärt.
2. **Die Kernaktivitäten verlieren im Spätspiel ihren Zweck (F2, hoch):** Angeln und Fangen sind die häufigsten Tätigkeiten, haben
   aber fast keine Tiefe. Ist das Sammelbuch gefüllt und das Haus bezahlt, gibt es kaum noch einen Grund dafür.
3. **Breite statt Tiefe (F3, hoch):** Seit der Rahmenhandlung kamen viele eigenständige Kleinsysteme dazu (Kaffee, TV, Tassen,
   Poster, Witze-Kalender …). Jedes einzelne ist liebevoll – zusammen ergeben sie viele „Knopf drücken, Text lesen“-Momente,
   aber wenige Entscheidungen. Dazu kommt eine wachsende Liste an 1×-am-Tag-Dingen (F4).

**Größter Mehrwert pro Aufwand:** (a) Linas tatsächliche Spielzeiten klären und die Echtzeit-Lücke schließen, (b) einen echten
Playtest machen, (c) eine Vorratskiste, (d) Dialoge mit Erinnerungen, (e) **eine Pause beim Hinzufügen neuer Kleinsysteme** zugunsten
der Vertiefung bestehender.

**Gesamturteil [V]:** Für die ersten Stunden und Wochen sehr gut. Für Monate tragfähig dank Jahreszyklus und Bewohnern, aber mit
spürbarer Routine-Gefahr. Kein Fun-Killer im Kern – die Probleme sind behebbar und meist klein im Aufwand.

---

## 2. Bewertung des aktuellen Spielzustands

### Was es gibt (Implementierungsstand)

| Bereich | Stand | Bemerkung |
|---|---|---|
| Rahmenhandlung (6 Einzüge) | ✅ vollständig | Meilensteine + 10 Min Spielzeit, Durchlauf-Test |
| Natur (17 Fische, 24 Insekten, 11 Funde, Wetter) | ✅ | echte Uhr/Monate, kein Geschick nötig |
| Garten (Blumen, Kreuzungen, Gemüse, Kräuter, Gewächshaus) | ✅ | Phasen 1–5 komplett |
| Crafting/Kochen/Apotheke/Binden (54 Rezepte) | ✅ | gute Margen, alle erreichbar (Test) |
| Haus (7 Stufen) & Einrichtung (~106 Katalog-Modelle, 9 Stile) | ✅ | stärkstes Gestaltungssystem |
| Bewohner (7 + Winston): Dialoge, Vorlieben, Herzen, Briefe | ✅ | jedes Herz bringt jetzt etwas (#65) |
| Treffen, Party, Sonntagsessen, Reisen, Feste | ✅ | Wochen- und Jahresrhythmus |
| Kleinsysteme: Kaffee, TV, Tassen, Poster, Galerie, Sparbuch, Check-up, Witze-Kalender | ✅ | jeweils eigenständig |
| Herzenswünsche (Spätspiel) | 🔶 PR #66 offen | 7 Wünsche, verändern das Dorf |
| Fotomodus/Tagebuch, Sternbilder, Bistro-Set, PWA | 🗓️ geplant | – |
| Oli-Beziehungsstufen, Vorratskiste, Dialog-Erinnerungen | 💡 vorgeschlagen | – |

### Antworten auf die Kernfragen

| # | Frage | Antwort |
|---|---|---|
| 1 | Macht es Spaß? | **[V] Ja**, vor allem durch Wiedererkennen der Liebsten, Einrichten und den Strom an kleinen Überraschungen. Für Lina persönlich wahrscheinlich deutlich mehr als für Außenstehende. **[P]** |
| 2 | Sind die Loops langfristig interessant? | **Teilweise.** Gestaltung und Bewohner ja; Angeln/Fangen/Verkaufen nein (F2). |
| 3 | Genug sinnvolle Entscheidungen? | **Eher wenige.** Echte Entscheidungen: was mit Fängen/Ernte passiert (verkaufen/kochen/schenken/binden), wie man einrichtet, wie man kreuzt. Sonst überwiegend „hingehen und drücken“ (F3, F7). |
| 4 | Progression befriedigend & ausbalanciert? | **Anfang sehr gut, danach dünn.** Story in [V] 2–4 h vorbei; Herzen schnell voll (Oli in Tagen); danach Hausausbau als einziger großer Strang (F6). |
| 5 | Belohnungen & Ökonomie sinnvoll? | **Sauber, aber im Spätspiel bedeutungslos.** Keine Exploits, gute Margen; Sternchen verlieren nach ~380 k Ausgaben ihren Zweck (F2). |
| 6 | Monotone Aktivitäten? | **[V] Ja:** Verkaufsweg nach Hause, tägliche Einsammelrunde, Wiederholung von Begrüßungen (F4, F5, F8). |
| 7 | Künstliche Frustration? | **Kaum** – außer Echtzeit-Unerreichbarkeit (F1) und volle Tasche (F5). |
| 8 | Gründe zurückzukehren? | **Ja, gesunde:** Post, Beet wächst, Wetter, Wochentage, Jahreszeiten, Feste. Keine manipulativen. |
| 9 | Emergent Gameplay? | **Wenig.** Kreuzungen und Gartenplanung erzeugen etwas Eigenes; der Rest ist gescriptet und deterministisch pro Tag (F7). |
| 10 | Unterstützen alle Systeme die Säulen? | **Meist.** Schwächer: Sparbuch, Check-up, Kaffee-Kick (Zahl/Knopf statt Erlebnis) – Säule 4 „Systeme füttern sich“ (F3). |
| 11 | Phasen ohne Ziele? | **Ja:** zwischen letztem Einzug und Hausausbau-Ende (ohne #66) und nach vollem Sammelbuch. |
| 12 | Was verliert seinen Reiz? | Angeln/Fangen (nach Sammelbuch), Verkaufskiste, Plaudern (Wiederholung), Fernseher (Folgenpool), Kaffee-Menü, tägliche Funde. |

### Kurze vs. lange Sitzungen

- **1–5 Minuten [V]:** gut – Post, Küsschen, Beet, ein Gespräch. Spät abends teils „niemand da“ (Oma & Christin schlafen ab 22 Uhr, Olaf 22:30, Lars 23 Uhr, die übrigen 23:30).
- **15–30 Minuten [V]:** sehr gut – das ist der Sweet Spot des Spiels.
- **1–2 Stunden [V]:** in der Story-Phase stark, danach fehlt ohne Herzenswünsche eine Struktur; Einrichten trägt allein.
- **Tage/Wochen [V]:** Jahreszeiten und Wochenrhythmus tragen; Routine-Gefahr durch tägliche Abholrunde und Dialogwiederholung.

---

## 3. Stärken und Schwächen der Gameplay Loops

### Stärken

1. **Bewohner als Herzstück [N]:** 7 Figuren mit Eigenheiten, Tagesabläufen, gemeinsamen Treffen, Festen, Briefen. Das ist der
   emotionale Kern und klar besser als generische NPCs.
2. **Verlustfreiheit [N]:** sauber durchgezogen (Winterruhe, Kredit ohne Druck, nachgeholte Zinsen, Keepsakes, nachgelieferte
   Herz-Briefe). Kein Mechanismus bestraft Pausen.
3. **Garten-Kette [N]:** Samenstand → Kreuzen → Binden → Vase/Geschenk → Herz ist das beste Beispiel für verzahnte Systeme.
4. **Einrichten [N]:** großer Katalog, Höhenregel für Wand-Deko, Räume, Stile – stärkste intrinsische Motivation.
5. **Onboarding über Einzüge [N]:** jeder Einzug führt genau ein System ein, Hinweise in-character.
6. **Game Feel [N]:** Partikel, Töne, Animationen, Musik je Tageszeit/Wetter, Brabbelsprache.

### Schwächen

1. **Häufigste Aktivität = flachste Aktivität [N]:** Angeln: auswerfen, 2–5,5 s warten, Taste. Kescher: hingehen, Taste
   (Insekten fliehen nie). Kein Können, keine Entscheidung außer „Schatten groß genug?“.
2. **Viele Endpunkte ohne Anschluss [N]:** TV, Kaffee, Check-up, Witze-Kalender, Sparbuch liefern Text + kleine Zahl, aber speisen
   kaum andere Systeme.
3. **Verkaufen ist ein Laufweg [N]:** einzige Verkaufsstelle vor Linas Haus, Tasche 20 Plätze.
4. **Zufall ohne Spielraum [N]:** Fast alles ist reproduzierbar pro Tag festgelegt (Funde, Angebote, Grabstellen). Gut gegen
   Speicher-Tricks, schlecht für Überraschung innerhalb eines Tages.

---

## 4. Progression, Economy und Balancing

**Progression [N/V]**
- Story: 6 Einzüge, alle in [V] 2–4 h erreichbar → sehr kompakt. Für ein Geschenk ist ein schneller, warmer Anfang gut – aber die
  Einzüge verschwimmen, wenn sie an einem Abend passieren **[P]**.
- Herzen: 400 Punkte für 5 Herzen; Oli hat ~10 Quellen und ist in Tagen voll; danach keine Wirkung mehr.
- Hausausbau: 273.800 ⭐, klare qualitative Belohnung je Stufe, gute Kurve.
- Sammlungen: an echte Monate gebunden → natürliches Ganzjahresziel, aber **ohne Würdigung** bei Vollständigkeit.

**Ökonomie [N]**
- Eine Währung, transparente Preise, Möbel nur ¼ zurück → keine Arbitrage.
- Veredeln 1,3–3,3× (Bratapfel 6,3× als harmloser Ausreißer).
- Dominanz: Angeln (Ø ~85–105 ⭐ je Fang, unbegrenzt) [N]; Stundenleistung [V] 10–15 k ⭐.
- Senken: ~380 k ⭐ für „alles einmal“; danach praktisch keine. Herzenswünsche (#66) fügen nur 5 k hinzu.

**Balancing-Fazit:** Es gibt **keine Balance-Fehler, die Spaß kosten** – die Ökonomie ist eher zu großzügig als zu streng. Das
Problem ist Bedeutung, nicht Zahlen.

---

## 5. Pacing und Langzeitmotivation

| Phase | Motor | Bewertung |
|---|---|---|
| Abend 1 | Oma, Werkzeuge, erste Fänge, schnelle Einzüge | ✅ stark – evtl. *zu* dicht [P] |
| Woche 1–4 | Haus, Katalog, Beet, Herzen, Wochenrhythmus | ✅ stark |
| Monat 2–12 | Jahreszeiten, Feste, Sammelbuch, Herzenswünsche (#66) | 🔶 trägt, aber Routine-Gefahr |
| Jahr 2+ | Wiederholung des Jahres | ⚠️ kaum Neues |

Die Langzeitmotivation hängt an **Bewohnern** und **Jahreszeiten**. Beides ist gut gewählt für ein Geschenk. Die mechanischen
Loops (Sammeln/Verkaufen) tragen nur bis zum vollen Sammelbuch.

---

## 6. Findings – priorisiert

### 🔴 Kritisch

#### F1 · Echtzeit macht Inhalte für Linas Spielzeiten unerreichbar – *kritisch, falls sie überwiegend abends spielt* [N + P]
1. **Problem:** Uhrzeit = echte Uhrzeit. **11 von 41 Arten** sind zwischen 18 und 23 Uhr nie unterwegs (u. a. alle Tagfalter,
   Honigbiene, Grashüpfer, Seepferdchen) [N]. **Alle vier Bewohner-Treffen** liegen tagsüber (8–10, 13–15, 15–17, 16–18 Uhr) [N].
   Es gibt keine Möglichkeit, Zeit zu überspringen oder zu verschieben [N]. Die Wochenendparty (Sa 19–22) und das Sonntagsessen
   (18–20) passen dagegen.
2. **Mechanik:** Zeitmodell, Arten-Verfügbarkeit, Treffen, Tagesabläufe.
3. **Auswirkung:** Das Sammelbuch bleibt dauerhaft unvollständig, ohne dass Lina etwas daran ändern kann; Treffen (Säule 5) finden
   für sie nie statt. Das widerspricht „kein Frust“ und „Autonomie“.
4. **Warum ändern:** Inhalt, der nie erlebt wird, ist verlorene Arbeit – und ein Gefühl von „ich verpasse etwas“, das das Spiel
   eigentlich vermeiden will.
5. **Empfehlung (einfachste zuerst):**
   (a) Erst klären, **wann Lina tatsächlich spielt** (offene Frage Q1).
   (b) Falls abends: Tagarten um 18–20 Uhr erweitern („Abendsonne“), ein Abendtreffen ergänzen bzw. eins verschieben.
   (c) Größere Alternative: optionale Einstellung „Spieluhr verschieben“ (z. B. +/- Stunden, in Ruhe änderbar) – erhält Echtzeit,
   macht sie aber persönlich.
6. **Nebenwirkungen:** (b) verwässert die Tageszeit-Unterschiede leicht; (c) ist ein Eingriff ins Zeitmodell (Feste, Geburtstage
   müssen weiter am echten Datum hängen) und braucht Tests.
7. **Playtest:** eine Woche normal spielen lassen, danach Sammelbuch-Schatten und gesehene Treffen zählen.

### 🟠 Hoch

#### F2 · Sammeln & Verkaufen verlieren im Spätspiel ihren Zweck [N/V]
1. **Problem:** Angeln/Fangen dienen dem Sammelbuch und Sternchen. Ist das Buch voll und das Haus bezahlt, fehlt beides.
   Nur 2 von 41 Arten werden in Rezepten verwendet [N]; volle Sammlungen werden nicht gewürdigt [N].
2. **Mechanik:** Angeln, Kescher, Verkaufskiste, Sammelbuch, Ökonomie.
3. **Auswirkung:** Die häufigste Tätigkeit wird zur Beschäftigungstherapie.
4. **Warum:** Säule 4 („Systeme füttern sich“) – Fänge sollten mehr Wege haben als die Kiste.
5. **Empfehlung:** (a) Herzenswünsche Phase 2 gezielt mit *bestimmten/seltenen* Arten (Wunsch nach „einem Hecht für Jens' Bild“);
   (b) Würdigung voller Sammelbuch-Seiten (Brief + Deko-Objekt); (c) 3–4 weitere Fischgerichte im Bistro. **Keine** Preiserhöhung.
6. **Nebenwirkungen:** Mehr Inhalt, der gepflegt werden muss; seltene Arten in Wünschen dürfen nicht an F1 scheitern.
7. **Playtest:** Nach vollem Sammelbuch beobachten, ob Lina noch angelt – und warum.

#### F3 · Breite statt Tiefe: viele isolierte Kleinsysteme [N/V] – *selbstkritisch*
1. **Problem:** Kaffee (4 Maschinen, 8 Getränke), TV (6 Formate), Tassen, Poster/Bildbände, Witze-Kalender, Check-up, Sparbuch:
   jeweils „anschauen → Text/kleiner Bonus“. Sie wurden einzeln auf Wunsch gebaut und sind liebevoll, aber kaum verbunden.
2. **Mechanik:** Möbel-Interaktionen, Bewohner-Dienste.
3. **Auswirkung:** Viele Momente, wenige Entscheidungen; die Welt wird voller, nicht tiefer. Risiko „Checkliste“ (F4).
4. **Warum:** Spielspaß entsteht hier eher aus Verbindungen (Kaffee als Geschenk, TV-Rezept → Kochen → Wunsch) als aus mehr Knöpfen.
5. **Empfehlung:** **Neue eigenständige Kleinsysteme vorerst pausieren.** Stattdessen bestehende verbinden: z. B. Kaffee/Getränke als
   Geschenke oder Wunsch-Zutaten, TV-Folgen, die Bewohner am nächsten Tag kommentieren, Sammeltassen in Wünschen.
6. **Nebenwirkungen:** Lina hat sich einzelne Systeme ausdrücklich gewünscht – eine Pause darf nicht wie Ablehnung wirken.
7. **Playtest:** Strichliste, welche Kleinsysteme Lina nach zwei Wochen noch benutzt.

#### F4 · Wachsende tägliche Abholrunde [N/V]
1. **Problem:** 1×/Tag zählen: Gespräch und Geschenk *je Bewohner*, Felsen, 7 Muscheln, 4 Grabstellen, Eier je Stall, Winstons Fund,
   Check-up, Kaffee zu zweit, Picknick, Sterne, erstes Küsschen, Treffen, Samenstand-Angebot, Galerie-Bild, TV-Folge [N].
   Eier verfallen täglich (nicht ansammelnd) [N].
2. **Mechanik:** Tägliche Quellen, Freundschaft.
3. **Auswirkung [V]:** Nichts davon ist Pflicht, aber die Menge erzeugt das „ich muss noch…“-Gefühl, das PLAYER_PSYCHOLOGY als
   Anti-Ziel nennt.
4. **Warum:** Autonomie und Entspannung sind Kernziele.
5. **Empfehlung:** (a) Keine weiteren 1×/Tag-Abholdinge; (b) Eier und Winstons Fund bis 3 Tage ansammeln lassen; (c) prüfen, ob
   Freundschaft pro Besuch statt pro Tag-und-Person entspannter wäre (z. B. Treffen zählen für alle Anwesenden – ist teilweise so).
6. **Nebenwirkungen:** Ansammeln macht Pausen „lukrativer“ – unkritisch.
7. **Playtest:** „Muss-noch“-Aussagen zählen (PLAYTESTING S2/S8).

#### F5 · Inventar & Verkaufen erzeugen Laufwege [N/V]
1. **Problem:** 20 Taschenplätze, keine Lagerung, Verkauf nur vor Linas Haus [N]; seit Beet & Samen viele neue Gegenstandsarten
   (Farben, Samen, Gemüse, Kräuter, Sträuße).
2. **Mechanik:** Inventar, Verkaufskiste.
3. **Auswirkung [V]:** Häufige Heimwege unterbrechen längere Sitzungen; Lina muss aussortieren statt sammeln.
4. **Empfehlung:** Vorratstruhe im Haus (Möbel mit Lagerplätzen). Optional: zweite Verkaufsstelle (z. B. an Olafs Dorfkasse).
5. **Nebenwirkungen:** Lagerung kann zum Horten verleiten (unkritisch); Spielstand-Erweiterung nötig.
6. **Playtest:** Heimwege pro 30 Min zählen (Ziel ≤ 3).

#### F6 · Beziehung zu Oli entwickelt sich mechanisch nicht [N]
1. **Problem:** Oli ist laut CLAUDE.md „höchste Bindung“. Alle Momente (Küsschen, Picknick, Sterne, Kaffee, TV) sind ab Einzug da;
   durch viele Quellen ist er nach wenigen Tagen bei 5 Herzen.
2. **Auswirkung:** Die wichtigste Beziehung hat den kürzesten Bogen.
3. **Empfehlung:** Momente stufenweise (nach Herzen und Jahrestagen), z. B. Herzbank-Szene (#66), Jahrestag des Einzugs, gemeinsames
   Kochen. Weniger Punkte, mehr Inhalt.
4. **Nebenwirkungen:** Bestehende Spielstände haben Oli schon bei 5 Herzen → neue Stufen besser an Erlebnisse/Daten knüpfen.
5. **Playtest:** Fragt Lina nach einigen Wochen „was kann ich noch mit Oli machen?“

#### F7 · Wenig echte Entscheidungen und kaum Emergenz [N/V]
1. **Problem:** Die meisten Interaktionen haben genau eine sinnvolle Handlung. Echte Entscheidungen gibt es beim Verwerten
   (verkaufen/kochen/schenken/binden), Einrichten und Kreuzen.
2. **Auswirkung:** Für ein Cozy Game akzeptabel – aber Kompetenz-Gefühl entsteht fast nur über Wissen.
3. **Empfehlung:** Keine Geschicklichkeit einbauen (Entspannung ist Absicht, siehe O9). Stattdessen Entscheidungen *zwischen*
   Systemen stärken: Wünsche mit Alternativen („Rosen **oder** Tulpen“), Rezepte mit Variationen, Gartenplanung (Nachbarschaft
   wirkt schon bei Kreuzungen).
4. **Playtest:** Beobachten, ob Lina über ihre Fänge „nachdenkt“ oder alles in die Kiste legt.

### 🟡 Mittel

#### F8 · Dialogwiederholung [N/V]
Begrüßungspools 8–15 Zeilen, Plaudern 19–64 (Thalia 19, Oli 23) [N], gefiltert nach Kontext. Bei täglichem Spielen **[V]** nach
2–4 Wochen spürbare Wiederholung – besonders schmerzhaft, weil Wiedererkennen der Kern ist. **Empfehlung:** Zeilen mit Bezug auf
Erlebtes (erste seltene Art, neue Hausstufe, letzter Wunsch, Jens' letzte Reise) + gezielt Thalia/Oli/Christin aufstocken.
**Nebenwirkung:** Text-Aufwand; echte Insider von Oli sind wertvoller als erfundene. **Playtest:** Wiederholungen notieren.

#### F9 · Rahmenhandlung evtl. zu schnell [V/P] – *selbstkritisch zu D2*
Die Entscheidung „Meilensteine statt Kalender“ beseitigte Warten – aber alle sechs Einzüge können an einem Abend passieren. Jeder
Einzug ist ein emotionaler Höhepunkt; zu dicht verlieren sie Gewicht. **Empfehlung:** erst im Playtest messen (Zeit bis Thalia);
falls < 2 h, Meilensteine leicht anheben (z. B. mehr Sammelbuch-Einträge) statt Wartezeiten. **Nebenwirkung:** Gefahr von Grind –
nur moderat ändern.

#### F10 · Volle Sammlungen und Erfolge ohne Echo [N]
Sammelbuch, Tassen, Blumenfarben, Kunstwerke: Vollständigkeit wird nicht bemerkt. **Empfehlung:** Brief (z. B. Thalia für
Fische, Jens für Tassen) + kleines Deko-Objekt. Kein Achievement-Menü. **Playtest:** Reaktion beim Erreichen.

#### F11 · Herzenswünsche (#66) – Risiken des eigenen Features [V] – *selbstkritisch*
Stärken: verbindet Systeme, sichtbare Veränderung. Risiken: (a) 7 Wünsche sind in wenigen Abenden erfüllt – danach wieder Plateau;
(b) Christins Wunsch braucht vier Kräuter (Samen kaufen, wachsen lassen) – für Spielerinnen ohne Kräuterbeet ein längerer Umweg;
(c) Herzbank/Aussichtspunkt sind nur „anschaubar“ – der Ort ist schön, aber passiv; (d) feste Mengen statt Wahl (F7).
**Empfehlung:** Phase 2 mit gestaffelten, persönlicheren Wünschen; Herzbank als Oli-Szene (F6). **Playtest:** Wie lange dauern die
7 Wünsche? Fühlen sie sich wie Geschenke an oder wie Bestellungen?

#### F12 · Geschenk-Vorlieben sind nicht nachschlagbar [N]
Reaktionen werden nicht gespeichert/angezeigt. Für Lina mildert ihr echtes Wissen das ab, aber bei 7 Bewohnern × ~40 Vorlieben
**[V]** bleibt vieles Raten. **Empfehlung:** im Geschenk-Fenster ein kleines Herz bei Gegenständen, die dieser Bewohner schon einmal
„geliebt“ hat. **Nebenwirkung:** etwas weniger Überraschung.

#### F13 · Fast der ganze Katalog ab Spielbeginn [N]
~106 Modelle in 9 Stilen sind sofort sichtbar (nur Saisonware gefiltert). Autonomie hoch, aber Neuheit früh verbraucht und Auswahl
überwältigend. **Empfehlung (vorsichtig):** neue Stile an Einzüge koppeln (z. B. Jens bringt Mid-Century/Bistro-Set mit) – nur für
neue Spielstände, nichts wegnehmen. **Nebenwirkung:** weniger Freiheit am Anfang → nur nach Rücksprache.

### 🟢 Niedrig

- **F14 Sparbuch** ist ein totes System (1 %/Monat, max. 2 000) [N] – als Olaf-Flavour ok, kein Handlungsbedarf.
- **F15 Nachgelieferte Herz-Briefe** können bei alten Spielständen viele Briefe auf einmal bringen (#65) [N] – leicht zu verkraften,
  evtl. über einige Tage verteilen.
- **F16 Bratapfel 6,3×** [N] – saisonal, harmlos.
- **F17 Unbegrenzte Küsschen** [N] – passt zum Wunsch der Auftraggeber; nur das erste zählt → kein Exploit.
- **F18 Spät abends schläft das Dorf** [N] – ab 22 Uhr (Oma, Christin) bis 23:30 (Oli, Jens, Thalia) gehen alle schlafen; für Spätspielerinnen ein leeres Dorf. Teil von F1.

---

## 7. Konkrete Verbesserungsvorschläge (zusammengefasst)

| # | Vorschlag | Findings | Wirkung | Aufwand |
|---|---|---|---|---|
| 1 | **Spielzeiten klären** + Abend-Erreichbarkeit (Tagarten bis 20 Uhr, Abendtreffen) | F1, F18 | ●●● | ● |
| 2 | **Playtest S1–S9** mit Lina (oder Stellvertretung) | alle [P] | ●●● | ● |
| 3 | **Pause für neue Kleinsysteme**, Fokus auf Verbindungen | F3, F7 | ●●● | – |
| 4 | **Vorratstruhe** | F5 | ●● | ●● |
| 5 | **Dialoge mit Erinnerungen** + Pools aufstocken | F8 | ●●● | ●● |
| 6 | **Oli-Stufen** inkl. Herzbank-Szene | F6, F11 | ●●● | ●● |
| 7 | **Ansammeln** von Eiern/Winstons Fund (3 Tage) | F4 | ●● | ● |
| 8 | **Würdigung voller Sammlungen** | F2, F10 | ●● | ● |
| 9 | **Wünsche Phase 2** mit seltenen Arten & Wahlmöglichkeiten | F2, F7, F11 | ●● | ●● |
| 10 | Geschenk-Gedächtnis (Herz-Symbol) | F12 | ● | ● |
| 11 | Katalog-Stile an Einzüge koppeln (nur nach Rücksprache) | F13 | ● | ● |

---

## 8. Nicht überprüfbare Annahmen und offene Fragen

| # | Frage | Warum wichtig | Wer kann es beantworten |
|---|---|---|---|
| Q1 | **Zu welchen Uhrzeiten und wie lange spielt Lina typischerweise?** | entscheidet, ob F1 kritisch ist | Oli/Lina |
| Q2 | Spielt sie täglich, mehrmals pro Woche oder in Schüben? | F4, F8 | Oli/Lina |
| Q3 | Was macht ihr in Cozy Games am meisten Spaß – Einrichten, Sammeln, Menschen? | Gewichtung der Roadmap | Lina |
| Q4 | Wie lange dauert der Weg bis Thalias Einzug wirklich? | F9 | Playtest |
| Q5 | Fühlen sich Herzenswünsche wie Geschenke oder wie Bestellungen an? | F11 | Playtest |
| Q6 | Welche Kleinsysteme nutzt sie nach zwei Wochen noch? | F3 | Playtest |
| Q7 | Echte Insider/Erinnerungen für Dialoge (Bewohner) | F8 | Oli & Familie |
| Q8 | Geburtstage & Vorlieben der übrigen Bewohner | Feste, Geschenke | Oli |

**Annahmen dieses Audits:** Lina spielt am Laptop, eher in kurzen bis mittleren Sitzungen, mag Einrichten und die Menschen mehr als
Optimierung (aus CLAUDE.md abgeleitet, nicht bestätigt). Zeitangaben stammen aus Daten, nicht aus Messungen.

---

## 9. Priorisierte Roadmap

**Jetzt (vor neuen Features)**
1. Q1/Q2 klären (Spielzeiten) → falls abends: Abend-Erreichbarkeit (Vorschlag 1).
2. PR #66 (Herzenswünsche) prüfen/mergen – mit F11 im Hinterkopf.
3. Playtest-Runde S1–S9 planen (`PLAYTESTING.md`).

**Als Nächstes (Tiefe statt Breite)**
4. Vorratstruhe (F5).
5. Ansammeln von Eiern & Winstons Fund (F4).
6. Dialoge mit Erinnerungen + Pools aufstocken (F8) – idealerweise mit echten Insidern (Q7).
7. Oli-Stufen inkl. Herzbank-Szene (F6).

**Danach (nach Playtest-Erkenntnissen)**
8. Würdigung voller Sammlungen (F10) und Wünsche Phase 2 mit seltenen Arten/Wahl (F2, F7, F11).
9. Ggf. Rahmenhandlung leicht strecken (F9) – nur mit Messwerten.
10. Tagebuch/Fotomodus (🗓️) – verbindet Erinnerungen (F8) und Besitz.

**Bewusst zurückgestellt:** neue eigenständige Kleinsysteme (F3), Geschicklichkeit beim Angeln (O9), Herzen über 5.

---

*Dieser Audit ersetzt nicht den Playtest. Er soll ihn gezielter machen.*
