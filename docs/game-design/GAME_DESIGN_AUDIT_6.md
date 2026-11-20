# Game Design Audit 6: Nach Unternehmungen, Dialog-Überarbeitung, Küche und Mo

**Stand:** 20. November 2026

**Geprüft:**
- `main` nach PR #180.
- Zusätzlich die drei offenen PRs:
  - #181 (Küche: Kohl, AirFryer, Rippchen)
  - #182 (Mo zu Besuch)
  - #183 (Floskeln ausgedünnt)

**Vorgänger:** [`GAME_DESIGN_AUDIT_5.md`](GAME_DESIGN_AUDIT_5.md) (nach PR #163)

**Grundlage:**
- Wissensbasis in `docs/game-design/`.
- Quellcode (`game/unternehmungen.ts`, `core/friendship.ts`, `data/recipes.ts`, `game/dinner.ts`, `game/mo.ts`, `data/unternehmungen.ts` …).
- Kennzahlen, per Skript direkt aus `src/data/` berechnet. Die Skripte habe ich danach gelöscht.
- Tests: 108 Dateien, 631 Tests grün auf `main`.
- `git log`: 16 PRs seit Audit 5 (#164–#180) plus 3 offene.
- Das [Dialog-Audit](../narrative/dialogue-audit.md).
- Headless-Läufe während der Entwicklung.

**Während dieser Prüfung wurde nichts am Spiel geändert.** Geändert sind nur dieses Dokument und die Verweise.

**Kennzeichen:**
- Belastbarkeit: **[N]** Nachweis aus Code/Daten · **[V]** begründete Vermutung · **[P]** nur durch Spielen prüfbar.
- Status: ✅ implementiert · 🗓️ geplant · 💡 Empfehlung · ❓ offen.

**Selbstkritischer Hinweis:** Alles seit Audit 5 habe ich gebaut, im Auftrag von Oli und mit Linas Fakten. Ich prüfe deshalb besonders meine eigenen frischen Arbeiten:
- die Unternehmungen mit ihren vier Sumo-Nachbesserungen,
- die Textüberarbeitung,
- die noch offene Küche.

---

## 1. Kurzfazit

1. **Audit 5 wurde ernst genommen: Das Frühspiel hat bekommen, was fehlte [N].**
   - Glühwürmchen (#165), Winston-Tricks (#166), Café-Gespräche (#167/#168) und vor allem die **gemeinsamen Unternehmungen** (#172–#177) sind ab dem ersten Einzug spielbar.
   - Die Unternehmungen beantworten Olis Rückmeldung zum „Leerlauf“ direkt.
   - B3 aus Audit 5 ist damit erledigt.
2. **Die Texte sind deutlich besser geworden [N].**
   - Das Dialog-Audit (#178) hat 5 008 Strings einzeln bewertet. Die Überarbeitung (#179) hat alle Zeilen mit Note ≤ 5 behoben.
   - Zwei sichtbare Grammatikfehler sind weg: „Larss Häuschen“ und „die Kürbis“.
   - Die Figuren wurden an ihr Konzept angeglichen. Das ist für ein persönliches Geschenk mindestens so wichtig wie jede Mechanik [V].
3. **Herzen kommen jetzt schneller [N].**
   - Unternehmungen geben +10 Punkte je Person und Tag.
   - Das Inselziel („alle 5 Herzen“) rückt dadurch von ≥ 11 auf **≥ 9 echte Tage**.
   - Das ist eher gut, weil das Spätspiel früher erreichbar wird. Ob es zu schnell ist, merkt nur Oli (C2).
4. **Ein Ausreißer in meinem eigenen offenen PR [N].**
   - In #181 bringen **AirFryer-Pommes das 9-Fache ihrer Zutaten**: 2 Kartoffeln für 20 ⭐ werden zu 2 Portionen für 180 ⭐.
   - Bisheriges Maximum: 6,4×, Median 2,1×.
   - Das sollte vor dem Merge korrigiert werden (C1).
5. **Linas Lieblingsessen hängt an einem 2-Stunden-Fenster pro Woche [N].**
   - Rippchen gibt es nur nach dem Sonntagsessen bei Jens (#181). Das ist schön erzählt, aber knapp (C3).
6. **Kein Verstoß gegen die Designsäulen [N].**
   - Unternehmungen geben Herzen unabhängig vom Ergebnis.
   - Mos Besuch wartet, bis Lina kommt.
   - Nichts verfällt.

## 2. Kennzahlen [N]

| Bereich | Audit 5 (17. Nov.) | jetzt `main` (20. Nov.) | mit #181–#183 |
|---|---|---|---|
| Katalog-Einträge / Summe | 292 / ≈ 264 000 ⭐ | **292 / 263 980 ⭐** (88 % der Obergrenze 300 000) | 293 / 264 930 ⭐ (AirFryer) |
| Möbelmodelle | 307 | 307 | 308 |
| Gegenstände | 866 | 866 | 878 |
| Rezepte | 71 | 71 | **76** (+ Krautsalat, Kohleintopf, 3 × AirFryer) |
| Gemüse/Kräuter | 6 / 4 | 6 / 4 | **7** / 4 (Kohl) |
| Unternehmungen | – | **7** (je Bewohner eins, Oli & Lars mit Leveln) | 7 |
| Spielstand-Version | 19 | **20** | 20 (keine Anhebung nötig) |
| Tests | 587 (100 Dateien) | **631 (108)** | 637 (110) |
| `world3d/World3D.ts` | 5 012 Zeilen | **5 237** (+225) | ≈ 5 300 |
| `world3d/models/furniture.ts` | 4 233 | 4 233 | 4 245 |
| Spieltexte (Dialog-Audit) | – | 4 811 bewertet, Ø 7,8/10 vor der Überarbeitung | – |

**Herzen-Tempo** [N]:
- **Pro Tag:** Gespräch 8 + geliebtes Geschenk 30 + Unternehmung 10 = **48 Punkte**. Für 5 Herzen braucht es 400 Punkte, also **≥ 8,3 Tage je Person**.
  - Früher waren es 38 Punkte und damit ≥ 10,5 Tage.
- **Dazu kommen:**
  - Sonntagsessen (+10, bei Jens +16), einmal pro Woche.
  - Mos Besuch (Thalia +20, Oli +10), einmalig.

**Kochen: Wertsteigerung Zutaten → Gericht** (Verkaufspreise, `station: 'kueche'`, 32 Rezepte auf `main`) [N]:
- Median **2,1×**, Spanne 1,6× (Fischsuppe) bis 6,4× (Kokoskekse).
- Neu in #181:

| Rezept | Zutatenwert | Gerichtwert | Faktor |
|---|---|---|---|
| Knusprige Rippchen | 200 | 260 | 1,3× |
| Kohleintopf | 54 | 170 | 3,1× |
| Krautsalat | 34 | 160 | 4,7× |
| Kohlchips | 22 | 140 | 6,4× |
| **AirFryer-Pommes** | **20** | **180** | **9,0×** |

## 3. Status der Findings aus Audit 5

| # | Thema | Status |
|---|---|---|
| B1 | Oli spielt und meldet, Messlücken | 🔶 läuft; die Debug-Statistik (⭐/h) ist nicht gebaut |
| B2 | Eier-Einkommen ohne Obergrenze | ⏸️ unverändert, noch keine Rückmeldung von Oli |
| B3 | Arbeit konzentriert sich aufs Spätspiel | ✅ **erledigt**: Glühwürmchen, Winston-Tricks, Café-Gespräche, Unternehmungen (alle früh verfügbar) |
| B4 | Layout erst bestätigen | ✅ eingehalten. Rückfragen gab es z. B. zu „Hecken = Büsche im Garten?“ und zum „Kissen-Sumo mit Lars?“ |
| B5 | Keine weiteren Insel-Rituale | ✅ eingehalten (nichts Neues auf der Insel) |
| B6 | Katalog-Budget 88 % | ⏸️ unverändert (AirFryer +950 ⭐) |
| B7 | `GAME_ECONOMY.md` veraltet | ❌ weiter offen. Es fehlen Kokos, Inselfische, Eier-Skalierung und jetzt auch Kohl, AirFryer und Rippchen |
| B8 | Technikschulden | ❌ `World3D.ts` +225 Zeilen, nicht aufgeteilt |
| B9 | Spielstand-Version | ✅ nur eine Anhebung (v20) in 3 Tagen |
| B10 | Verifikationslücken | 🔶 teilweise. Neue Lücken: Unternehmungen mit Tastatur in allen Leveln, Mo-Szene im echten Ablauf, Rippchen nach dem echten Sonntagsessen |

---

## 4. Bewertung nach Fragen

| Frage | Antwort | Belastbarkeit |
|---|---|---|
| Macht es Spaß? | Die Unternehmungen geben dem Alltag etwas Aktives (Memory, Takt, Puzzle, Duell, Sumo). Die Figuren klingen nach der Überarbeitung mehr nach sich selbst. | [V]/[P] |
| Tragen die Loops langfristig? | Ja, und zwar besser verteilt als bei Audit 5: Alltag (Unternehmungen, Café), Woche (Sonntagsessen, Samstagsparty mit Mo), Spätspiel (Insel). | [N]/[V] |
| Echte Entscheidungen? | Neu: Level-Wahl in den Minispielen und Kochen am Herd oder im AirFryer. Die Garten- und Hausentscheidungen bleiben wie gehabt. | [N] |
| Progression befriedigend? | Ränge und Level bei Oli und Lars geben ein kleines, freiwilliges Können-Ziel. Herzen kommen schneller (C2). | [N]/[P] |
| Belohnungen und Ökonomie sinnvoll? | Kochen bleibt ein gutes, aber kein dominantes Einkommen, **außer den AirFryer-Pommes** (C1). Eier weiter offen (B2). | [N] |
| Monoton oder frustrierend? | Frust-Risiko neu: Sumo ab Level 7/8 (8,25 bzw. 9 Drücke pro Sekunde) ist bewusst schwer. Es ist freiwillig und ohne Folgen, aber ob es Lina ärgert, ist [P] (C4). | [N]/[P] |
| Gesunde Gründe zurückzukehren? | Jeden Tag eine Runde mit jemandem spielen, sonntags Essen (jetzt mit Rippchen), samstags Party (manchmal mit Mo). Alles ohne Strafe. | [N] |
| Emergenz? | Café-Gäste reden miteinander, Mo erzählt später von Jule, Erinnerungen reagieren auf Ereignisse. | [N] |
| Tragen alle Systeme die Säulen? | Ja. Grenzfälle sind Skill-Spiele (C4) und das Wochenfenster für Rippchen (C3). | [N]/[V] |
| Wo fehlen Ziele? | Nach dem Mo-Abend ist Linas Verkupplungswunsch erzählerisch abgeschlossen, Thalia bleibt aber Single. Das ist ein offener Faden (C7). | [V] |
| Was verliert seinen Reiz? | Memory, Takt und Puzzle haben feste Inhalte. Nach etwa zehn Runden sind alle Bilder und Folgen bekannt [P]. | [P] |

## 5. Findings: priorisiert

### 🔴 Kritisch
**Keine.**

### 🟠 Hoch
**Keine.**

### 🟡 Mittel

**C1 · AirFryer-Pommes sind ein Wert-Ausreißer (offener PR #181) [N]**
- **Mechanik:** Aus 2 Kartoffeln (Verkaufswert 20 ⭐, Saatkartoffel 4 ⭐, Ernte 3–4) werden 2 Portionen à 90 ⭐. Das ist Faktor **9,0**, bisheriges Maximum 6,4, Median 2,1.
- **Auswirkung:** Kartoffeln anbauen und frittieren wäre der beste Kochweg im Spiel. Ein Klick verdient 160 ⭐ Gewinn, nur gebremst durch Beetplätze. Das ist kein Fehler, aber eine **dominante Strategie**, die Lina beim Rechnen findet [V].
- **Empfehlung:** 💡 Vor dem Merge von #181 die Pommes auf **1 Portion** setzen (Faktor 4,5) oder den Preis auf 45 ⭐ senken. Die Kohlchips (6,4×) liegen genau am bisherigen Maximum und sind in Ordnung.
- **Nebenwirkung:** keine. Das Gericht ist neu, es gibt keine Spielstände damit.
- **Prüfung:** `kueche.test.ts` um eine Prüfung „Faktor ≤ 6,5“ ergänzen.

**C2 · Herzen kommen ≈ 25 % schneller [N, Wirkung P]**
- **Mechanik:**
  - Unternehmungen: +10 Punkte je Person und Tag (`ZUSAMMEN_PUNKTE`), unabhängig vom Ergebnis.
  - Das ist gut für die Säule „kein Scheitern“, erhöht aber das Tagesmaximum von 38 auf 48 Punkte.
  - Insel frühestens nach ≈ 9 statt ≈ 11 echten Tagen.
- **Auswirkung:** Eher positiv, denn das Spätspiel wird für Lina früher erreichbar. Aber wer täglich alles macht, ist schneller „fertig“ [V].
- **Empfehlung:** 💡 **Beobachten**, nicht ändern. Oli fragen: „Wann hattest du alle fünf Herzen?“
- **Nebenwirkung:** keine.
- **Prüfung:** Olis Rückmeldung mit Datum.

**C3 · Linas Lieblingsessen nur sonntags 18–20 Uhr (offener PR #181) [N]**
- **Mechanik:**
  - Rippchen gibt es nur über `dinnerTakeaway`, also 2 Stück nach dem Sonntagsessen.
  - Bedingungen: Jens ist eingezogen, nicht verreist, und Lina ist im Zeitfenster da.
  - Ein Rezept braucht 2 Rippchen, also **höchstens 1 Portion „Knusprige Rippchen“ pro Woche**.
- **Auswirkung:** Das passt erzählerisch, ist aber für *Linas Lieblingsessen* sehr knapp. Wer sonntagabends nicht spielt, bekommt nie welche. Das ist kein FOMO, weil nichts verloren geht, aber es fühlt sich womöglich wie „verpasst“ an [V].
- **Empfehlung:** 💡 Eine zweite, sanfte Quelle:
  - **Variante A:** Jens’ `dailyTreat` gibt mit kleiner Chance Rippchen statt Käse.
  - **Variante B:** Im Bistro kann man Rippchen kaufen.

  A ist einfacher und bleibt persönlich.
- **Nebenwirkung:** minimal. Der Preis der Rippchen bestimmt dann den Wert der Rippchen-Portion (heute 1,3×, also unkritisch).
- **Prüfung:** Lina fragen: „Hast du schon Rippchen gemacht?“

**C4 · Skill-Minispiele: bewusst schwere Stufen [N, Wirkung P]**
- **Mechanik:**
  - Sumo-Level 6–8 brauchen etwa 7,25 / 8,25 / 9 Drücke pro Sekunde.
  - Duell (Oli) mit Umkehr-Pfeilen; Level-Freischaltung bei 60 % Treffern.
  - Es gibt Ränge, Bestwerte und neue Level, aber **keine Belohnung hängt am Gewinnen** [N]. Die Herzen kommen unabhängig vom Ergebnis.
- **Auswirkung:** Gesunde Herausforderung für alle, die wollen. Die Sumo-Werte wurden in 4 PRs (#173, #175–#177) nach Olis Gefühl nachgestellt. Das funktioniert, ist aber teuer (vgl. B4).
- **Empfehlung:**
  - 💡 So lassen.
  - Künftig bei Geschicklichkeitsspielen **vorher eine Zieltabelle** absprechen („Level 1 schafft jeder, Level 8 nur mit Übung, Richtwert X Drücke pro Sekunde“) und die Werte in einer Testtabelle festhalten. So wie es #176 am Ende gemacht hat.
- **Nebenwirkung:** keine.
- **Prüfung:** Lina fragen: „Hast du bei Lars aufgehört, weil es dir zu schwer war, oder weil du genug hattest?“

### 🟢 Niedrig

**C5 · Der AirFryer wird erwähnt, bevor Lina einen hat [N]**
- Die Plauderzeilen aus #180 („Machst du heute wieder Rippchen im AirFryer?“, Christin, Olaf, Jens …) setzen voraus, dass Lina einen besitzt. Kaufen kann sie ihn aber erst ab #181 im Katalog.
- 💡 **Empfehlung:**
  - Entweder bekommt Lina den AirFryer früh geschenkt, z. B. als Einzugsgeschenk von Oli.
  - Oder diese Zeilen erscheinen erst, wenn ein AirFryer im Haus steht. Dafür gibt es schon den Mechanismus mit `tags`, siehe `huehner`.
- Ich empfehle das **Geschenk von Oli**: Es passt zur Figur und erspart Lina die Suche im Katalog.

**C6 · Ökonomie-Doku weiter veraltet (B7) [N]**
- `GAME_ECONOMY.md` kennt weder die Unternehmungen (Herzen-Tempo) noch Kohl, AirFryer und Rippchen.
- 💡 Nach dem Merge von #181 einmal nachziehen (reine Doku).

**C7 · Offener Faden: Thalia bleibt Single [V]**
- Linas Wunsch, Thalia zu verkuppeln, ist erzählt und wie gewünscht nicht aufgegangen. Oma deutet an: „Die Thalia findet schon noch einen. Ich hab da so ein Gefühl.“
- ❓ **Offene Frage an Lina:** Soll das irgendwann weitergehen (neue Person, kleine Geschichte), oder bleibt Thalia bewusst Single und glücklich?
- **Nicht** von selbst weiterbauen.

**C8 · Technikschulden wachsen (B8) [N]**
- `World3D.ts` hat 5 237 Zeilen, mit #182 etwa 5 300.
- Mo, Kater und der Besucher sind drei ähnliche „Figur am Rand“-Muster.
- 💡 Beim nächsten Anfassen ein gemeinsames kleines Modul für Nebenfiguren herausziehen, ohne das Verhalten zu ändern.

**C9 · Die Zeilentabellen des Dialog-Audits sind jetzt historisch [N]**
- `docs/narrative/audit-zeilen/` zeigt den Stand **vor** #179. Der Hinweis steht im Audit.
- 💡 Bei einem späteren zweiten Dialog-Audit mit demselben Skript neu erzeugen statt die alten Tabellen zu pflegen.

**C10 · Feste Inhalte der Minispiele [P]**
- Memory-Paare, Puzzle-Bilder und Takt-Folgen sind fest. Nach einigen Runden kennt man alles.
- 💡 Erst handeln, wenn Oli oder Lina es merken. Eine einfache Abhilfe wäre, ein Bild oder Paar je Jahreszeit zu tauschen.

## 6. Was gut ist: bitte nicht „wegoptimieren“ [N]

- **Unternehmungen geben Herzen unabhängig vom Ergebnis.** Wer verliert, verliert nichts.
- **Mos Geschichte:** Der Verkupplungsplan scheitert, und trotzdem geht niemand leer aus. Thalia nimmt es mit Humor, Lina bekommt einen Album-Moment, und Mo kommt danach gern wieder.
- **Texte nah am Konzept:** Echtes Sächsisch, Gisela zeigt ihr letztes Wort, statt es zu behaupten. Lars ist Arzt mit Praxis, Thalia Gym- und Party-Mensch.
- **Linas Fakten fließen ein,** ohne Pflicht zu werden. Kohl, Rippchen und AirFryer sind Angebote.
- **Kein Streak, kein FOMO, keine Strafe fürs Pausieren.** Das bleibt durchgehend eingehalten.

## 7. Priorisierte Liste

| # | Maßnahme | Wirkung | Aufwand | Risiko | Wann |
|---|---|---|---|---|---|
| C1 | AirFryer-Pommes: 1 Portion statt 2 (in #181) | ●● | ● | ● | **vor dem Merge von #181** |
| C5 | AirFryer als Geschenk von Oli (oder Zeilen erst mit AirFryer) | ●● | ● | ● | mit oder nach #181 |
| C3 | Zweite Rippchen-Quelle (Jens’ kleines Mitbringsel) | ●● | ● | ● | nach Rückmeldung |
| C6 | `GAME_ECONOMY.md` aktualisieren | ● | ● | ● | nach #181 |
| ❓ C7 | Thalias Faden: weitererzählen oder nicht? | ●● | – | – | Lina fragen |
| 💡 C4 | Zieltabelle vor Skill-Spielen | ● | – | – | ab sofort |
| 💡 C8 | Nebenfiguren-Modul aus `World3D` | ● | ●● | ● | nächste Berührung |
| ⏸️ B2 / C2 | Eier und Herzen-Tempo beobachten | ●● | – | – | Olis Rückmeldung |

**Kontrollfragen für Oli und Lina beim Spielen:**
1. Wann hattest du bei allen fünf Herzen (Datum)?
2. Hast du die Minispiele wegen der Herzen gespielt oder weil sie Spaß machen? Welche nicht mehr?
3. Hast du schon Rippchen bekommen? Warst du sonntags abends da?
4. Hat dich Mos Abend überrascht? Hättest du gern, dass es mit Thalia weitergeht?

## 8. Nicht empfohlen

| Idee | Warum nicht |
|---|---|
| Unternehmungen nur bei Sieg mit Herzen belohnen | macht aus einem Angebot eine Prüfung (Säule „kein Scheitern“) |
| Rippchen täglich und unbegrenzt kaufbar | Lieblingsessen würde beliebig. Eine zweite, kleine Quelle reicht (C3). |
| Weitere Skill-Level ohne Zieltabelle | C4: vier Nachbesserungs-PRs für ein Spiel |
| Thalia ungefragt eine neue Liebesgeschichte schreiben | C7: Das ist Linas Geschichte, nicht meine |
| Neue Kochstationen ohne Wert-Prüfung | C1: ein einziges Rezept kann die Ökonomie schief ziehen |

---

*Dieser Audit ersetzt keine Rückmeldung von Lina. Der wichtigste Punkt ist klein: Die AirFryer-Pommes vor dem Merge korrigieren. Danach lohnt es sich, Lina selbst zu fragen, wie es mit Thalia weitergehen soll.*
