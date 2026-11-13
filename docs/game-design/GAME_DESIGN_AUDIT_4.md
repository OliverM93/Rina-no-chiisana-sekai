# Game Design Audit 4 – Nach Katalog-Überarbeitung, Stil-Wellen und Sternchen-Balancing

**Stand:** 13. November 2026 · **Geprüft:** `main` nach PR #130 · **Vorgänger:** [`GAME_DESIGN_AUDIT_3.md`](GAME_DESIGN_AUDIT_3.md) (nach PR #98)
**Grundlage:** Wissensbasis in `docs/game-design/`, Quellcode (`core/bank.ts`, `game/home.ts`, `game/catalog.ts`, `data/progress.ts`),
Kennzahlen per Skript direkt aus `src/data/` berechnet (Skript danach wieder gelöscht), Tests (81 Dateien / 474 Tests grün), `git log`.
**Während dieser Prüfung wurde nichts am Spiel geändert** (nur dieses Dokument und die Verweise in README und Entwicklungsstand).

Belastbarkeit: **[N]** Nachweis aus Code/Daten · **[V]** begründete Vermutung · **[P]** nur im Playtest prüfbar.
Status: ✅ implementiert · 🗓️ geplant · 💡 Empfehlung · ❓ offen.

**Selbstkritischer Hinweis:** Fast alles, was seit Audit 3 gebaut wurde, stammt aus derselben Feder wie dieser Audit – auf
ausdrücklichen Wunsch von Oli und Lina, aber wieder **entgegen der Empfehlung „erst Playtest“**. Ich habe deshalb vor allem dort
gesucht, wo ich selbst eingegriffen habe: Katalog, Stile, Sparbuch/Bausparen, Story-Tempo.
**Einschränkung:** Ich habe das Spiel für diesen Audit nicht gespielt (Headless-Chromium zeigt kein Tempo und kein Gefühl). Alles zu
„fühlt sich … an“ ist [V] oder [P].

---

## 1. Kurzfazit

1. **Seit Audit 3 kamen 32 Pull Requests, der Playtest steht weiter aus [N].** Zum zweiten Mal wurde N1 („erst Playtest, dann neue
   Features“) nicht eingehalten. Das Spiel ist technisch stabil und inhaltlich sehr reich – aber **niemand hat gemessen, wie es sich
   für Lina anfühlt.** Das ist das größte Risiko, nicht ein einzelnes System.
2. **Der Katalog hat sich mehr als verdoppelt: 125 → 272 Einträge, ≈ 125 000 → ≈ 255 000 ⭐ [N].** Das Einkommen ist gleich geblieben;
   erst das Balancing (Fänge × 1,5, Ausbau günstiger) hat gegengesteuert. Unterm Strich ist „alles besitzen“ heute **~25 % schneller
   erreichbar als im Audit 3**, obwohl der Katalog doppelt so groß ist [V] – aber nur, weil das Balancing nachgezogen hat. Ohne Regel
   passiert dasselbe bei der nächsten Stil-Welle wieder (Finding A3).
3. **Die Einzug-gekoppelten Stile sind stumm [N].** Mit Olaf, Jens, Thalia, Lars und Oli werden 71 Einträge freigeschaltet – aber
   kein Brief, keine Szene und kein Notizbuch-Eintrag sagt Lina das. Die Idee („Einzüge schalten Neues frei“) verschenkt ihre
   Wirkung (Finding A2).
4. **Sparbuch, Kredit und Bausparen überlappen jetzt [N].** Drei Geldmechaniken bei einer Figur; wer rechnet, findet eine Strategie,
   die die neue Bauspar-Prämie nach ~3,5 Wochen übertrumpft (Finding A4). Für eine gemütliche Spielerin kaum relevant – aber ein
   Erklärungs- und Kohärenz-Thema.
5. **Das Balancing hat die Story wieder beschleunigt [N].** Die Bedingung „5 000 ⭐ verkauft“ (Lars) war für den alten Fangpreis
   kalibriert: ≈ 59 Fänge. Jetzt sind es ≈ 39 (Finding A5).

**Was gut ist:** Es gibt keinen Designsäulen-Verstoß, keinen Zwang, keine Strafe fürs Pausieren. Die Sternchen-Wirtschaft ist
verständlicher als vorher (Bausparen mit klarem Nutzen, wöchentliche Zinsen ohne Aufgabe). Die Katalog-Bedienung (feste Zeilen,
Pfeiltasten, „weiterlesen“) ist deutlich besser als vor PR #118.

## 2. Kennzahlen [N]

| Bereich | Audit 3 (10. Nov.) | jetzt (13. Nov.) |
|---|---|---|
| Katalog-Einträge (alle Stile frei, Winter) | 125 Möbel + 30 Tapeten/Böden | **281** (138 Möbel · 10 Pflanzen · 19 Lieblinge · 9 Winter · 20 Garten · 46 Tapeten · 39 Böden) |
| Katalog-Summe | ≈ 125 000 ⭐ | **≈ 255 000 ⭐** (Sommer ohne Winterware 246 250) |
| Möbel-Median | 520 ⭐ | **850 ⭐** (max. 2 600) |
| Einrichtungsstile | 10 | **17** (Möbel je Stil: 5 – 24) |
| Möbelmodelle (`FURNITURE`) | 219 | **293** |
| Tapeten / Böden | 19 / 11 | **46 / 39** |
| Gegenstände gesamt | 550 | 821 (inkl. Farbvarianten) |
| Hausausbau | 273 800 ⭐ | **200 800 ⭐** (mit Bausparen ≈ 171 000) |
| Fänge | ~83–104 ⭐ | **×1,5** (≈ 125–155 ⭐ je Fang [V]) |
| Sparbuch | 1 %/Monat, max. 2 000 | **5 %/Woche, max. 2 500/Woche** |
| Tests | 381 (72 Dateien) | 474 (81 Dateien) |

**Im Katalog stehen ab Minute 1 schon 201 von 272 Einträgen (176 290 ⭐)** [N] – die Einzüge schalten „nur“ 71 frei
(≈ 26 %): Olaf 2 Stile, Jens 3, Thalia 2, Lars 1, Oli 2 (`data/catalog.ts → arrivesWith`).

**Gesamtbedarf „alles einmal besitzen“** [N, Summe aus Daten]: Katalog 255 000 + Hausausbau 200 800 + Galerie 18 800 + Wünsche ≈ 8 000
≈ **483 000 ⭐** (Audit 3: 425 000).
**Dauer** [V, aus Audit-3-Annahmen]: ≈ 3 800 Fänge à ~128 ⭐; bei 150–300 Fängen/h **≈ 12–25 Stunden reines Angeln** (Audit 3: 17–35 h).
Gemütlich gemischt gespielt ein Mehrfaches. Gemessen ist nichts [P].

**Preise nach Stil** (Möbel, Ø in ⭐) [N]: Bistro 569 · Japanisch 648 · Japandi 756 · Minimalismus 811 · Skandinavisch 866 ·
Cottage 914 · Brutalismus 992 · Memphis 1 020 · Space Age 1 047 · Art déco 1 075 · Midcentury 1 075 · Industrial 1 161 ·
Bauhaus 1 290 · Cyberpunk 1 281 · Retro 1 310 · Dark Academia 1 414 · **Modern 1 487**.
Die Spanne ist plausibel (Klassiker und Designer-Stücke teurer); die Preisklassen stufen aber nichts ab, was Lina früh oder spät
erreicht (Finding A9).

## 3. Status der Findings aus Audit 3

| # | Thema | Status |
|---|---|---|
| A0 | Winter-Arten knapp | ✅ M2 winter-sicher, Test sichert ≥ Ziel + 2 Arten je Monat |
| A1 | Rahmenhandlung zu schnell | ✅ M2 umgesetzt (PR #101) – **aber durch ×1,5 teilweise wieder aufgeweicht (A5)** |
| A2 | Orientierung | ✅ Notizbuch (PR #102) |
| A3 | Oli-Herzen in 3–4 Tagen voll | ⏸️ M3 zurückgestellt bis Playtest; unverändert (Picknick/Sterne 24, TV 10) |
| A4 | Sternchen ohne Zweck nach ~425 k | 🔶 **entschärft:** Bedarf jetzt ≈ 483 k bei höherem Einkommen; das Problem rückt weiter nach hinten. G1 bleibt zurückgestellt. |
| A5 | Enter uneinheitlich | ✅ |
| A6 | Training als 1×/Tag | ✅ Punkte entfernt |
| A7 | Snake-Rekord | ✅ |
| A8/A9 | Leitlinie/Ökonomie-Doku | ✅ damals – **inzwischen wieder veraltet (A8 unten)** |
| A10 | Balancing-Spannen | ✅ `data/balancing.test.ts` (5 Tests) – **prüft aber keine Katalog-Summe (A3 unten)** |
| N1 | Feature-Pause bis Playtest | ❌ **wieder nicht eingehalten** (siehe A1) |
| G1/G2 | Dorf-Verschönerungen, Tagebuch | ⏸️ nach Playtest |

---

## 4. Bewertung nach Fragen

| Frage | Antwort | Belastbarkeit |
|---|---|---|
| Macht es Spaß? | Für die Zielgruppe sehr wahrscheinlich: reich, persönlich, viele Selbstzwecke (Einrichten, Garten, Bewohner). Ob es *Lina* trifft, weiß nur ein Playtest. | [V]/[P] |
| Tragen die Loops langfristig? | Ja: Einrichten (jetzt mit 17 Stilen und Reaktionen der Bewohner), Garten, Jahreskreis, Herzenswünsche. Sternchen-Ziele reichen für viele Stunden. | [V] |
| Echte Entscheidungen? | Ja – Stilwahl (Reaktionen `stil-*`), Kreuzungen, Ausbau-Weg (Kredit / Sparbuch). Angeln bleibt bewusst ohne Entscheidung. | [N] |
| Progression befriedigend? | Einzüge → Stile, Hausausbau, Herzen: gut verzahnt. Schwäche: Neues wird nicht angekündigt (A2). | [N] |
| Belohnungen/Ökonomie sinnvoll? | Ja, besser als vorher. Schwäche: Inhaltswellen fressen das Einkommen auf (A3), drei überlappende Geld-Mechaniken (A4). | [N] |
| Monoton oder frustrierend? | Kein Frust-System. Monotonie-Risiko bleibt beim Angeln als einziger Geldquelle [V]. Fenstergrößen waren ein echter Reibungspunkt (#126/#130 behoben). | [N]/[V] |
| Gesunde Gründe zurückzukehren? | Jahreszeiten, Wünsche, wöchentliche Zinsen als freundliches „Willkommen zurück“. Keine Streaks, keine Strafe. | [N] |
| Emergenz? | Stil-Reaktionen („Oma findet Bauhaus kühl“), Kreuzungen, Plaudern zwischen Bewohnern. Gut, aber klein. | [N] |
| Tragen alle Systeme die Säulen? | Ja. Einziger Grenzfall: 5 %/Woche belohnt Horten leicht (A4). | [N] |
| Wo fehlen Ziele? | Kurzfristig keine. Nach dem Ausbau bleibt der Katalog als Ziel – **das Gegenteil von „leer“**. | [V] |
| Was verliert seinen Reiz? | Angeln als einzige Einnahme nach vielen Stunden [P]. | [P] |

## 5. Findings – priorisiert

### 🔴 Kritisch
**Keine.**

### 🟠 Hoch

**A1 · Der Playtest fehlt weiter – 32 PRs ohne Rückmeldung von Lina [N, Wirkung P]**
- *Problem:* Seit Audit 3 sind 7 neue Stile (jetzt 17), ~75 neue Möbelmodelle, Haus-Grundriss, Katalog-Umbau, Sparbuch-Umbau und Bausparen dazugekommen. Alles
  wurde gegen Zahlen und Tests geprüft, nichts gegen Linas Erleben.
- *Auswirkung:* Die wichtigsten offenen Fragen (⭐/h, Tempo der Einzüge, Olis erste Woche, Katalog-Übersicht, „fühlt sich das Sparbuch
  jetzt lohnend an?“) sind weiter [P]. Jede weitere Welle erhöht das Risiko, am falschen Ende zu bauen.
- *Empfehlung:* 💡 **Feature-Stopp** (Fehlerbehebung und Feedback-Wünsche von Lina ausgenommen), Playtest nach
  [`PLAYTEST_BOGEN.md`](PLAYTEST_BOGEN.md). Zusätzliche Fragen für den Bogen siehe Abschnitt 7.
- *Nebenwirkung:* Kaum eine – Stille für ein paar Tage.
- *Playtest:* der Playtest selbst.

**A2 · Neue Stile kommen mit den Einzügen, aber niemand sagt es Lina [N, Wirkung P]**
- *Mechanik:* `game/catalog.ts → designStyleUnlocked` blendet Stile nach `<npc>Begruesst` frei. Eine Suche in Briefen, Szenen, Gesprächen
  und im Notizbuch (`grep`) findet keinen Hinweis auf neue Stile. Auch an den Stil-Chips gibt es keine „neu“-Markierung.
- *Auswirkung:* Die Kopplung war als Vorfreude gedacht („Mit Thalia kommt noch etwas“). So fällt es Lina bestenfalls zufällig auf;
  schlechtestenfalls wirkt der Katalog zufällig gewachsen. Die Wirkung der Kopplung ist [V] ungefähr null.
- *Empfehlung:* 💡 K1: ein Satz im Einzugs-Moment („Mit Thalia kommen neue Möbel: Dark Academia & Brutalismus – schau mal in den
  Katalog“) in Bewohner-Stimme, plus ein dezentes „neu“ am Stil-Chip, bis Lina ihn einmal angeklickt hat. Kein Pflichttext,
  keine Liste.
- *Nebenwirkung:* gering; zusätzliche Speicherung eines kleinen „gesehen“-Flags (kein neues Spielstand-Format nötig, wenn über `flags`).
- *Playtest:* Merkt Lina die neuen Stile ohne Hinweis? Freut sie sich darüber?

### 🟡 Mittel

**A3 · Inhaltswellen fressen das Einkommen auf – es fehlt eine Regel [N]**
- *Problem:* Der Katalog wuchs um ≈ 130 000 ⭐ (+104 %), Einkommen und Hausausbau blieben unverändert, bis Lina („dauert relativ
  lange“) es bemerkte. Gegensteuern war erst nachträglich möglich, und es kostete einen eigenen PR.
- *Auswirkung:* Das Muster wiederholt sich bei jeder Stil-Welle. Der Balancing-Test (A10 aus Audit 3) prüft Einzelspannen, aber nicht
  die Summe.
- *Empfehlung:* 💡 K3: zwei Leitlinien in [`BALANCING_GUIDELINES.md`](BALANCING_GUIDELINES.md) – **(1)** „Katalog-Summe + Ausbau bleibt in einer
  Größenordnung von höchstens ~35–40 Stunden Angeln“, **(2)** „eine neue Stil-Welle ist mit einem Satz zur Einnahmen-Wirkung
  im PR zu begründen“ – plus ein Test, der die Summe und den Möbel-Median nach oben begrenzt (z. B. ≤ 300 000 ⭐ / ≤ 1 000 ⭐). Er
  schlägt nicht fehl, bis jemand wirklich eine große Welle baut – und zwingt dann zu einer bewussten Entscheidung.
- *Nebenwirkung:* keine; der Test kostet nur eine Zeile Anpassung, wenn die Entscheidung fällt.
- *Playtest:* ⭐/h je Tätigkeit messen (Bogen S-Abschnitt), danach die Obergrenze festlegen.

**A4 · Kredit, Sparbuch und Bausparen widersprechen sich leicht [N, Wirkung P]**
- *Mechanik:* Zinsen gibt es **auf das ganze Guthaben, auch bei offenem Kredit** (`core/bank.ts → creditInterest` prüft den Kredit
  nicht); der Kredit ist zinslos und ohne Frist. Bauspar-Prämie: einmalig 15 % des Ausbaupreises.
- *Rechnung [N]:* Stufe 3 (27 800 ⭐): Bausparen spart einmalig 4 170 ⭐. Wer stattdessen den Kredit nimmt und die 23 630 ⭐ auf dem
  Sparbuch lässt, bekommt 1 181 ⭐/Woche – **nach ≈ 3,5 Wochen ist „Kredit + Sparbuch behalten“ besser als Bausparen.** Zinseszins:
  1 000 ⭐ werden bei 5 %/Woche in einem Jahr ≈ 12 500 (bis die Obergrenze von 2 500/Woche greift, ab 50 000 ⭐ Guthaben).
- *Zusätzlich:* Nach 26 Wochen Pause schreibt ein Guthaben von 20 000 ⭐ rund **+48 000 ⭐** gut (≈ 10 % des Gesamtbedarfs).
  Das ist als Willkommensgeschenk gewollt (D28) und keine Strafe fürs Pausieren – nur: Es ist die ertragreichste „Tätigkeit“ im
  Spiel pro Minute Aufwand.
- *Auswirkung:* Für eine gemütliche Spielerin praktisch irrelevant – sie müsste rechnen und über Wochen echte Zeit abwarten. Es
  bleibt ein leichter **Horten-statt-Einrichten-Anreiz** und drei Regeln, die Olaf erklären muss [V].
- *Empfehlung:* 💡 **Nichts ändern, im Playtest beobachten** (hortet Lina? versteht sie die drei Wege?). Falls es stört: Zinsen
  nur auf Guthaben bis 20 000 begrenzen *oder* Bauspar-Prämie mit „nur ohne offenen Kredit“ bündeln. **Nicht empfohlen:** Zinsen
  aussetzen, solange ein Kredit offen ist – das fühlt sich wie eine Strafe an (Säule 2).
- *Nebenwirkung:* jede Änderung am frisch umgebauten Sparbuch verunsichert; ein weiterer Spielstand-Wechsel wäre unnötig.
- *Playtest:* „Hast du schon Zinsen bekommen? Was hast du damit gemacht?“ – gleichzeitig prüfen, ob die **Montags-Gutschrift im echten
  Ablauf** ankommt (bisher nur Unit-Tests, siehe A10).

**A5 · ×1,5 hat die Einzug-Bedingungen wieder gekürzt [N]**
- *Problem:* M2 (Audit 3) hat „5 000 ⭐ verkauft“ für Lars gewählt, kalibriert auf ~85 ⭐/Fang ≈ 59 Fänge. Mit ×1,5 sind es ≈ 39.
  Die anderen Bedingungen (Sammelbuch, gebaut, gekocht, Check-up, erster Ausbau) sind unberührt.
- *Auswirkung:* Der Abstand zwischen Jens und Lars schrumpft; die Story ist wieder ein Stück schneller als geplant [V]. Gleichzeitig
  war das Ziel von M2 nicht „möglichst langsam“, sondern „jedes System bekommt Zeit“.
- *Empfehlung:* ❓ **Erst Playtest-Uhrzeiten abwarten**, dann ggf. auf 7 500 ⭐ anheben (gleicher Fang-Aufwand wie geplant).
  Keine neue Mechanik nötig.
- *Playtest:* Uhrzeit je Einzug notieren (Bogen, Abschnitt Rahmenhandlung).

### 🟢 Niedrig

**A6 · Oli-Tempo unverändert (M3 offen) [N]** – Tagesmaximum ≈ 126 Punkte, 5 Herzen in 3–4 Tagen. Keine neue Datenlage, Entscheidung bleibt beim Playtest.

**A7 · Verifikationslücken [N]** – Nicht im echten Spielablauf gesehen: die Montags-Zinsgutschrift (nur Unit-Tests), das Bistro-Schild
an einem Reisetag von Jens (Dialogzweig, nur Code-Review + Screenshot der Fenstergröße). Beides ist klein; in den Playtest aufnehmen.

**A8 · Ökonomie-Doku ist wieder veraltet [N]** – `GAME_ECONOMY.md` nennt noch „125 Modelle / ≈ 103 300 ⭐“, „Gesamtbedarf ≈ 425 k“,
in der Quellen-Tabelle „Sparbuch 2 000 ⭐/Monat“, „Insekten/Fische haben fast keine Verwendung“ (seit W6 überholt), Galerie doppelt. Die Küchen-Ausreißerliste (Crêpes 5,8× usw.) habe ich mit meiner einfachen Nachrechnung nicht
reproduzieren können (dort: nur Bratapfel 6,3× über 3,5×; Balancing-Test ≤ 6,5× grün) – Rechenweg beim Aktualisieren klären.
Empfehlung K2: nach Freigabe aktualisieren (Doku, keine Spiel-Änderung).

**A9 · Preisklassen der Stile ohne erkennbare Logik [N, Wirkung P]** – Ø 569 (Bistro) bis 1 487 (Modern) ohne Bezug dazu, *wann* ein Stil
freigeschaltet wird. Nicht schlimm (Designerstücke dürfen teurer sein), aber der Median ist von 520 auf 850 gestiegen. Wenn es sich im
Playtest „teuer“ anfühlt, ist die Umrechnung über die Preisklasse einfacher als weiteres Einkommen. Kein Handlungsbedarf jetzt.

**A10 · Technik-Nebenbefund (kein Designthema) [N]** – `world3d/models/furniture.ts` hat ≈ 4 000 Zeilen für 293 Möbel. Es funktioniert,
aber jede weitere Stil-Welle macht die Datei unübersichtlicher. Empfehlung 💡: beim nächsten Anfassen nach Stil in mehrere Dateien
trennen (ohne Verhaltensänderung). Passt zur Feature-Pause.

## 6. Was gut ist – bitte nicht „wegoptimieren“ [N]

- **Kredit + „kein Verlust“** – jetzt mit Bausparen als freundlichem Anreiz statt Druck.
- **Katalog nach Kategorie × Typ × Stil**, feste Zeilen, Pfeiltasten, „weiterlesen“, Sperren **nach Linie** (nichts verschwindet).
- **Stil-Reaktionen der Bewohner** (`stil-*`): das beste Beispiel, wie ein Feature *Emergenz* statt nur Inhalt erzeugt.
- **Einzüge als Onboarding** und Story-Winter-Sicherheit.
- **Fenster mit fester Größe** – der Katalog, das Postfach und die Tasche springen nicht mehr.
- **Kochen auch ohne Jens** (Schlüssel unter der Fußmatte): löst eine Sackgasse mit einem Satz Humor statt mit Mechanik.
- **Jahreszyklus**, Garten & Kreuzungen, Angeln ohne Geschick, Herzenswünsche.

## 7. Priorisierte Liste

| # | Maßnahme | Wirkung | Aufwand | Risiko | Wann |
|---|---|---|---|---|---|
| – | **Playtest nach `PLAYTEST_BOGEN.md`** (+ neue Fragen unten) | ●●● | ●● | – | **jetzt** |
| K1 | Stil-Freischaltung ankündigen (Einzugssatz, „neu“-Markierung am Chip) | ●●● | ● | ● | nach Freigabe |
| K2 | `GAME_ECONOMY.md`/`PROGRESSION.md` auf den Stand bringen (A8) | ● | ● | ● | nach Freigabe |
| K3 | Katalog-Budget: Leitlinie + Test auf Summe/Median (A3) | ●● | ● | ● | nach Freigabe |
| ❓ M1 | Lars-Bedingung 5 000 → 7 500 ⭐ (A5) | ● | ● | ● | nach Playtest |
| ❓ M2 | Zins/Bauspar-Feinjustierung (A4) | ● | ● | ●● | nach Playtest |
| ❓ M3 | Oli-Tempo (aus Audit 3) | ●● | ● | ●● | nach Playtest |
| – | `furniture.ts`-Modelle nach Stil aufteilen (A10) | ● | ●● | ● | nächste Stil-Berührung |
| G1/G2 | Dorf-Verschönerungen, Tagebuch | ●● | ●●● | ●● | nach Playtest |

**Zusätzliche Playtest-Fragen für Lina/Oli:**
1. Wie viele Sternchen pro Stunde bei Angeln / Kescher / Garten / Kochen? (Audit 3 und diese Werte sind [V].)
2. Merkst du, wann neue Möbelstile dazukommen? (A2)
3. Welchen Weg nimmst du für den Ausbau: Kredit oder Sparbuch? Hast du Zinsen bemerkt? Hast du sie genutzt? (A4)
4. Hast du dich im Katalog zurechtgefunden? Wie viele Stile hast du angeschaut? (Übersicht bei 17 Stilen)
5. Wie lange hat jeder Einzug gedauert, und kam er „zu früh“ oder „zu spät“? (A5)
6. Gab es Stellen, an denen du nicht wusstest, was du tun sollst?

## 8. Nicht empfohlen

| Idee | Warum nicht |
|---|---|
| Weitere Stile oder Möbel-Wellen vor dem Playtest | A1/A3 – der Katalog ist bereits mehr als doppelt so groß wie bei Audit 3 |
| Zinsen weiter erhöhen | Horten-Anreiz (A4), Hausausbau ist schon ≈ 27 % günstiger (mit Bausparen ≈ 37 %) |
| Zinsen aussetzen, solange ein Kredit offen ist | fühlt sich wie eine Strafe an (Säule 2) |
| Möbelpreise pauschal senken | entwertet Preise als Wertsignal; erst messen (A9) |
| Angeln-Preise noch einmal erhöhen | ändert das Problem „Angeln als einzige Einnahme“ nicht, nur die Zahl |
| Ankündigungen als Aufgabenliste („Du hast noch X Stile frei“) | Säule 2; ein Satz im Brief reicht |

---

*Auch dieser Audit ersetzt den Playtest nicht. Er zeigt aber, wo ein Playtest zuerst hinschauen sollte: wie sich das Geld jetzt
anfühlt, ob Neues auffällt und ob der Katalog noch übersichtlich ist.*
