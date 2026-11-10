# Game Design Audit 2 – Nachprüfung nach 20 Pull Requests

**Stand:** 9. November 2026 · **Geprüft:** `main` nach PR #85 (Bistro-Set) · **Vorgänger:** [`GAME_DESIGN_AUDIT.md`](GAME_DESIGN_AUDIT.md) (nach PR #65)
**Grundlage:** Quellcode, Daten, Tests (68 Dateien / 364 Tests grün), Browser-Durchläufe der einzelnen Features, Kennzahlen aus den Datendateien.
**Während dieser Prüfung wurde nichts am Spiel geändert** (nur diese und die verlinkenden Doku-Dateien).

Belastbarkeit wie im ersten Audit: **[N]** Nachweis aus Code/Daten · **[V]** begründete Vermutung · **[P]** nur im Playtest mit Lina prüfbar.
Selbstkritischer Hinweis: Alles seit dem ersten Audit stammt wieder aus derselben Feder wie der Audit. Besonders genau habe ich
dort hingesehen, wo ich Empfehlungen des ersten Audits **nicht** befolgt habe.

---

## 1. Kurzfazit

Die kritische und die meisten hohen Punkte des ersten Audits sind umgesetzt. Das Spiel ist **breiter und persönlicher** geworden:
16 Herzenswünsche, Erinnerungen im Gespräch, Oli-Stufen, Vorratstruhe, Abend-Erreichbarkeit, Fischgerichte, Schaukästen, Sternbilder, Bistro-Stil.

Die größte offene Schwäche ist jetzt **kein Feature-Mangel, sondern ein Wissensmangel**: Seit dem ersten Audit sind rund 20 Pull Requests
gemergt, aber **kein einziger Playtest** hat stattgefunden. Fast alle Annahmen zu Tempo, Pflichtgefühl, Wiederholung und Wunschgefühl sind weiter **[P]**.
Der Engpass ist ab jetzt der Playtest mit Lina, nicht die nächste Idee.

## 2. Kennzahlen (Stand heute) [N]

| Bereich | Wert |
|---|---|
| Spielstand-Version | 14 (mit Migrationen und Tests) |
| Gegenstände gesamt | 529 |
| Möbel | 212 (davon 120 im Katalog) · 12 Stile · 19 Tapeten · 11 Böden · Katalogsumme ≈ 121 000 ⭐ |
| Rezepte | 64 (32 Werkbank · 27 Küche · 5 Apotheke) |
| Herzenswünsche | 16 (je Bewohner 2–3), zusammen 8 020 ⭐ Sternchen-Beitrag |
| Arten | 17 Fische · 24 Insekten · 12 Funde · 22 Tassen · 5 Sammlungen mit Urkunde |
| Bewohner-Treffen | 5 (davon 1 abends) |
| Plauderzeilen je Bewohner | Gisela 64 · Oli 39 · Olaf 36 · Thalia 34 · Jens 33 · Lars 33 · Christin 32 |
| Erinnerungs-Zeilen (Bezug auf Erlebtes) | 46 |

## 3. Status der Findings aus dem ersten Audit

| # | Thema | Status | Was passiert ist / was bleibt |
|---|---|---|---|
| F1 | Echtzeit vs. Spielzeiten | ✅ | Lina spielt tagsüber **und** abends (Q1 beantwortet) → elf Tagarten bis 20 Uhr, Abendtreffen am Strand. Test sichert: jede Art ist abends erreichbar. |
| F2 | Sammeln ohne Zweck | ✅ | Wünsche Phase 2/3, 7 neue Fischgerichte (Rezept beim ersten Fang), Schaukästen (Insekten/Fische/Funde), Urkunden. |
| F3 | Breite statt Tiefe | 🔶 | Verbindendes ist passiert (Fischgerichte, Schaukästen, Erinnerungen). Die empfohlene **Pause neuer Kleinsysteme** wurde nur teilweise eingehalten – siehe N1. |
| F4 | Tägliche Abholrunde | 🔶 | Eier & Winstons Fund sammeln sich an. Dafür kamen neue 1×/Tag-Dinge dazu (Volkstanz, Herzbank, Abendtreffen) – siehe N2. |
| F5 | Inventar/Laufwege | ✅ | Vorratstruhe (60 Plätze). Zweite Verkaufsstelle bewusst nicht gebaut. [P] ob nötig. |
| F6 | Oli ohne Bogen | ✅ | Stufen-Szenen, Herzbank, Jahrestage, Kino- und Tourshirt-Wunsch. |
| F7 | Wenig Entscheidungen | 🔶 | Nur Jens' Reiseziel (Hawaii/Japan) ist eine echte Wahl in einem Wunsch. Der Rest ist unverändert. |
| F8 | Dialogwiederholung | 🔶 | 46 Erinnerungen, alle Pools ≥ 30 Zeilen, Jahreszeit-/Wetterzeilen. **Echte Insider (Q7) fehlen weiter**; Wiederholung nach Wochen bleibt [P]. |
| F9 | Handlung zu schnell? | ⬜ | Nicht gemessen [P]. |
| F10 | Sammlungen ohne Echo | ✅ | Brief + Wand-Urkunde für alle fünf Sammlungen. |
| F11 | Risiken der Herzenswünsche | 🔶 | Plateau nach Phase 1 ist mit Phase 2/3 entschärft. „Geschenk oder Bestellung?“ ist [P]. |
| F12 | Vorlieben nicht nachschlagbar | ⬜ | Nicht umgesetzt (Herz-Symbol im Geschenkfenster). |
| F13 | Katalog ab Spielbeginn | 🔶 | Nur das Bistro-Set ist an Jens' Einzug gekoppelt; der Rest (≈ 108 Stücke) steht weiter ab Beginn offen. |
| F14–F17 | Niedrig | – | Unverändert, kein Handlungsbedarf. |
| F18 | Spät abends schläft das Dorf | 🔶 | Abendtreffen nur Mo/Do 18–20 Uhr; ab 22 Uhr bleibt das Dorf leer. Für Abendspielerinnen eher ein Stimmungs- als ein Inhaltsproblem. |

## 4. Neue Findings

### 🟠 Hoch

#### N1 · Die Roadmap wächst schneller als das Wissen über die Spielerin [V]
1. **Problem:** Seit dem Audit kamen unter anderem Fotomodus, Pater Matteo, Sternbilder, Bistro-Stil, Schaukästen und zwei Wunschrunden dazu. Etwa die Hälfte sind **neuer Inhalt**
   (Breite), nicht Vertiefung bestehender Systeme (F3 empfahl eine Pause). Jedes Feature wurde einzeln sorgfältig geprüft, aber **keins an Lina**.
2. **Auswirkung:** Risiko, dass die Menge gepflegt werden muss, ohne dass klar ist, was Lina nutzt (Q6). Ein Geschenk aus einer Hand voll Dingen, die sie liebt, ist stärker als viele, die sie nicht bemerkt.
3. **Empfehlung:** **Feature-Pause bis zum ersten Playtest.** Danach nur noch das bauen, was Lina im Playtest vermisst oder liebt. Bis dahin höchstens Wartung, Fehler und Dinge, die sie sich ausdrücklich wünscht.
4. **Nebenwirkung:** Gefühlt „Stillstand“ – aber der Playtest ist keine Pause, sondern die nächste Arbeit.
5. **Playtest:** `PLAYTESTING.md` S1–S9; zusätzlich Strichliste, welche Systeme sie nach zwei Wochen noch öffnet (Q6).

### 🟡 Mittel

#### N2 · Neue tägliche Kleinigkeiten tauchen wieder auf [N/V]
Seit der Empfehlung „keine weiteren 1×/Tag-Abholdinge“ kamen **Volkstanz** (einmal am Tag, mit Olaf/Christin), die **Herzbank** (einmal am Tag) und das **Abendtreffen**
(einmal je Treffen und Tag) dazu. Nichts davon ist Pflicht, die Summe der „heute schon?“-Dinge liegt aber weiter bei rund 19. **Empfehlung:** keine weiteren 1×/Tag-Dinge;
im Playtest „Muss-noch“-Aussagen zählen (S2/S8). [V]

#### N3 · Der Katalog wird unübersichtlicher [N/V]
120 Möbel + 30 Tapeten/Böden in **12 Stilen**; die Chip-Zeile hat dadurch bis zu 12 Filter. Wer ein bestimmtes Teil sucht, scrollt. **Empfehlung:** erst im Playtest sehen, ob Lina sich verliert;
dann entweder eine Suche/Favoriten oder die weitere Staffelung nach Einzügen (F13). Neue Stile bitte nicht ohne Not.

#### N4 · Wenige Dialog-Pools weiter dünn, Insider fehlen [V]
Außer Oma (64) liegen alle Bewohner bei 32–39 Plauderzeilen und 8–10 Begrüßungen. Bei täglichem Spielen bleibt Wiederholung nach einigen Wochen wahrscheinlich [P].
Die wirksamste Verbesserung wären **echte Insider** von Oli und der Familie (Q7), nicht mehr erfundene Zeilen.

#### N5 · Quellentreue: bewusste Ausnahmen sind nur in Einzelstellen dokumentiert [N]
Es gibt einzelne Bezüge auf Reales: der Kinofilm **„Verlorene Autobahn“** (auf Linas Wunsch; Titel eines echten Films, Regisseur nicht genannt), das **Eiffelturm-Modell**, die Hellerau-Regale,
die „Radierkopf“-Verbeugung. Das ist bewusst und in `DESIGN_DECISIONS.md` (D25) bzw. im Code kommentiert, widerspricht aber der allgemeinen Regel in `CLAUDE.md`
(„keine fremden … Namen“). **Empfehlung:** die Ausnahmen in `CLAUDE.md` in einem Satz benennen, damit die Regel und die Praxis übereinstimmen. Die Seite wird öffentlich über GitHub Pages ausgeliefert.

### 🟢 Niedrig

- **N6 Keine automatischen Balancing-Spannen (E6)** [N]: Margen und Wunschkosten werden an wenigen Stellen getestet (Fischgerichte, Wunsch-Sternchen ≤ 5 000), aber nicht für alle Rezepte/Preise.
- **N7 3D-Abläufe nur manuell prüfbar** [N]: Date-Übergänge, Küsschen-Abstand und Schaukästen wurden im Headless-Browser angesehen, aber nicht von Tests abgedeckt. Ein kleiner Smoke-Test wäre denkbar; der Nutzen ist gering gegenüber dem Playtest.
- **N8 `Interior3D` baut bei geänderter Sammlung neu auf** [N]: Die Signatur nutzt die Anzahl der Sammlungseinträge; da Einträge nur dazukommen, ist das korrekt – sollte sich das ändern, bitte die ID-Liste in die Signatur nehmen.

## 5. Was gut läuft [N]

- Die Grundregeln (kein Scheitern, kein Verlust, kein Zeitdruck, keine Streaks) wurden bei **allen** neuen Features eingehalten; Nachlieferungen (Matteos Briefe, Vorlieben) laufen ohne Strafe.
- Neue Inhalte hängen an bestehenden Systemen: Fänge → Küche → Geschenke, Sammlung → Schaukasten, Wunsch → Brief.
- Feedback von Lina und Oli wurde jeweils zeitnah und ohne Umbau der Architektur umgesetzt (Enter im Katalog, Küsschen-Abstand, Picknick-Übergänge).
- Tests und Doku sind aktuell (Statusdatei, Mechanik, Entscheidungen D1–D26).

## 6. Empfohlene nächste Schritte

> **Hinweis (nach Rückmeldung):** Das Spiel ist ein Geschenk – Lina spielt es erst nach der Übergabe. Der Playtest läuft deshalb mit einer **Stellvertreterin / einem Stellvertreter**, Ablauf in [`PLAYTEST_BOGEN.md`](PLAYTEST_BOGEN.md). Lina-Fragen (Q2–Q8) werden dort als „Wäre das etwas für Lina?“ gestellt.

1. **Playtest mit Lina** (S1–S9) und die offenen Fragen **Q2–Q8** klären – vor jedem weiteren neuen System. Vorschlag: 3 Sitzungen (je ~45 Min.), ein Zettel mit „Was hat mir Freude gemacht / was hat genervt / was fehlt?“.
2. Danach nur das nachbessern, was dort auffällt (v. a. Tempo der Handlung F9, Wiederholung F8, Muss-noch-Gefühl N2).
3. Echte Insider von Oli und der Familie (Q7) einsammeln und in Dialoge/Briefe einbauen.
4. `CLAUDE.md`: Ausnahmen bei Quellentreue in einem Satz benennen (N5).

**Bewusst zurückgestellt:** zweite Verkaufsstelle (F5, nur falls der Playtest Laufwege zeigt), Geschenk-Gedächtnis (F12), Katalog-Suche (N3), weitere Stile (N3), Geburtstage der übrigen Bewohner (warten auf Daten, Q8).

---

*Auch dieser Audit ersetzt den Playtest nicht – er sagt nur, dass jetzt der Playtest dran ist.*
