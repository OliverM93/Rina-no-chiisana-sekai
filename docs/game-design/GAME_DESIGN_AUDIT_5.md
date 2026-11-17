# Game Design Audit 5 – Nach Insel, Hütte, Haus-Umbau und Kleinkram

**Stand:** 17. November 2026 · **Geprüft:** `main` nach PR #163 · **Vorgänger:** [`GAME_DESIGN_AUDIT_4.md`](GAME_DESIGN_AUDIT_4.md) (nach PR #130)
**Grundlage:** Wissensbasis in `docs/game-design/`, Quellcode (`game/insel.ts`, `core/coop.ts`, `core/friendship.ts`, `data/floorplan.ts`,
`world3d/World3D.ts` …), Kennzahlen per Skript direkt aus `src/data/` berechnet (Skripte danach wieder gelöscht), Tests (100 Dateien / 587 Tests grün),
`git log` (30 PRs seit Audit 4: #131–#163), eigene Browser-Läufe (Headless) während der Entwicklung.
**Während dieser Prüfung wurde nichts am Spiel geändert** (nur dieses Dokument und die Verweise in README und Entwicklungsstand).

Belastbarkeit: **[N]** Nachweis aus Code/Daten · **[V]** begründete Vermutung · **[P]** nur durch Spielen prüfbar.
Status: ✅ implementiert · 🗓️ geplant · 💡 Empfehlung · ❓ offen.

**Selbstkritischer Hinweis:** Fast alles seit Audit 4 stammt von mir (Auftraggeber: Oli, mit Wünschen von Lina). Ich prüfe deshalb besonders das, was ich selbst
in den letzten Tagen gebaut habe: die Insel und alles, was daran hängt, den Hausumbau (Dachzimmer → Arbeitszimmer → schmale Durchgänge) und die vielen kleinen Zusätze.
**Einschränkung:** Ich habe das Spiel nicht „gespielt“, nur Szenen per Skript angesehen. Aussagen zu Gefühl und Tempo sind [V] oder [P].

---

## 1. Kurzfazit

1. **Der Playtest ist entschieden: Es gibt keinen [N].** Oli ist der Einzige, der das Spiel vor der Übergabe spielt, und meldet laufend, was ihm auffällt. Damit ist die
   Dauerempfehlung „erst Playtest“ (N1, A1) **abgelöst**: Der Audit verlangt ihn nicht mehr. Offen bleibt, *was* sich so nicht prüfen lässt: wie sich Tempo und
   Überraschung für Lina anfühlen (Oli kennt das Geschenk) – siehe B1.
2. **Ein Drittel der Arbeit seit Audit 4 ging in die Insel [N].** 6 von 30 PRs tragen Insel-Titel, dazu Hütte, Garten, Musik, Luau, Flaschenpost – alles hinter der Tür
   „alle sieben Bewohner auf fünf Herzen“, **frühestens nach ≈ 11 echten Tagen** (siehe B3). Der Inhalt ist hochwertig, aber das **Frühspiel (Tag 1–10) hat im selben
   Zeitraum nur wenig bekommen** (B3). Die Wünsche aus Olis Rückmeldung (Café-Gespräche, Glühwürmchen, Winston-Tricks) gehen genau dorthin – das passt.
3. **Neu: ein unbegrenzt skalierendes passives Einkommen [N].** Wachtelställe (49 ⭐/Tag je Stall, 1 900 ⭐) kann man in zwei Gärten fast beliebig oft aufstellen. Das ist
   die Traumfarm von Lina – aber ab etwa 20 Ställen verdient sie so mehr pro Minute als mit allem anderen (B2).
4. **Der Hausumbau hat uns zweimal teuer gemacht [N].** Dachzimmer → Arbeitszimmer (#159) → Verlängerung (#160, verworfen) → schmale Durchgänge (#162): drei PRs, ein
   Spielstand-Umbau, weil ich die Absicht nicht vor dem Bauen bestätigen ließ (B4).
5. **Kein Verstoß gegen die Designsäulen, kein Zwang, keine Strafe [N].** Die neuen Mechaniken (Flaschenpost, Luau, Baumobst-Verfall) sind optional und ohne Fortschritt.

## 2. Kennzahlen [N]

| Bereich | Audit 4 (13. Nov.) | jetzt (17. Nov.) |
|---|---|---|
| Katalog-Einträge (alle Stile frei, Winter) | 281 | **292** |
| Katalog-Summe | ≈ 255 000 ⭐ | **≈ 264 000 ⭐** (Obergrenze im Test: 300 000 – **88 %** ausgeschöpft) |
| Möbelmodelle (`FURNITURE`) | 293 | **307** |
| Tapeten / Böden | 46 / 39 | 48 / 40 |
| Gegenstände (inkl. Farbvarianten) | 821 | **866** |
| Rezepte | – | 71 |
| Hausausbau (alle Stufen) | 200 800 ⭐ | 200 800 ⭐ (Stufe 3 ist jetzt das Arbeitszimmer) |
| Gesamtbedarf „alles einmal besitzen“ | ≈ 483 000 ⭐ | **≈ 492 000 ⭐** (Katalog 264 k + Ausbau 200,8 k + Galerie 18,8 k + Wünsche ≈ 8 k) |
| Spielstand-Version | 16 | **19** (3 Anhebungen in 4 Tagen: Inselgarten, Arbeitszimmer, Baum-Drops) |
| Tests | 474 (81 Dateien) | **587 (100 Dateien)** |
| `world3d/World3D.ts` | – | **5 012 Zeilen** |
| `world3d/models/furniture.ts` | ≈ 4 000 Zeilen | **4 233 Zeilen** |

**Fangpreise (Ø ⭐ je Fang, nach Gewicht, ohne Monats-/Uhrzeitfenster)** [N]: Fluss ≈ 159 · Meer (Dorf) ≈ 176 · **Meer vor der Insel ≈ 230** (21 % der Bisse sind Inselfische,
Goldmakrele 1 050 ⭐ bei 3 % Gewicht). Die Insel verdient also ≈ 30 % mehr pro Fang als das Dorfmeer – ein Anreiz, aber kein Ausreißer.
**Kokosnüsse:** 15 Palmen × 45 % × 25 ⭐ ≈ 170 ⭐/Tag Höchstwert – ungefähr ein einziger Fang.

**Zeit bis zur Insel** [N]: 5 Herzen = 400 Punkte je Bewohner; Gespräch 8 + ein geliebtes Geschenk 30 = 38 Punkte/Tag → **≥ 11 echte Tage** bei täglichem Gespräch *und* geliebtem
Geschenk an alle sieben (mit „mag“ statt „liebt“: 8 + 16 = 24 → ≈ 17 Tage). Dazu müssen alle eingezogen sein (Story-Tempo aus Audit 3/4).

## 3. Status der Findings aus Audit 4

| # | Thema | Status |
|---|---|---|
| A1 | Playtest fehlt | ✅ **entschieden:** kein Playtest; Oli spielt und meldet laufend (B1) |
| A2 | Neue Stile unangekündigt | ✅ (K1, Audit 4 Umsetzung) |
| A3 | Inhaltswellen fressen Einkommen | ✅ Leitlinie + `catalogBudget.test.ts` – **88 % der Obergrenze bereits genutzt** (B6) |
| A4 | Kredit/Sparbuch/Bausparen | ✅ Bauspar-Prämie 25 % (D30), unverändert beobachten |
| A5 | Lars-Bedingung 5 000 ⭐ | ⏸️ unverändert (Oli meldet Tempo) |
| A6 | Oli-Tempo | ⏸️ unverändert |
| A7 | Verifikationslücken | 🔶 weiter offen (Montags-Zinsen im echten Ablauf) |
| A8 | Ökonomie-Doku veraltet | ✅ aktualisiert (K2) – **jetzt wieder leicht veraltet (B7)** |
| A9 | Preisklassen der Stile | Kein Handlungsbedarf |
| A10 | `furniture.ts` aufteilen | ❌ nicht erledigt, Datei wuchs (B8) |

---

## 4. Bewertung nach Fragen

| Frage | Antwort | Belastbarkeit |
|---|---|---|
| Macht es Spaß? | Plausibel für die Zielgruppe: sehr viel Persönliches und kleine Selbstzwecke. Ob es Lina trifft, weiß nur sie. | [V]/[P] |
| Tragen die Loops langfristig? | Ja, und mit der Insel gibt es ein Spätspiel, das sich lohnt: Garten, Hütte, Tiere, Luau. Das Frühspiel (Tag 1–10) hat weniger Neues bekommen. | [N]/[V] |
| Echte Entscheidungen? | Garten-Gestaltung (zwei Gärten), Haus-Reihenfolge, Stilwahl. Neu auf der Insel: kaum Entscheidungen, mehr Ambiente – gewollt. | [V] |
| Progression befriedigend? | Einzüge → Stile → Ausbau → Herzen → Insel: gut verzahnt. Die Insel als Ziel für „alle Herzen“ funktioniert narrativ (Party, Hütte). | [V] |
| Belohnungen/Ökonomie sinnvoll? | Fangen/Kescher/Garten ok. **Neu: passives Eier-Einkommen skaliert unbegrenzt** (B2). | [N] |
| Monoton oder frustrierend? | Kein Frust-System. Monotonie-Risiko: Angeln als Haupteinnahme bleibt [P]; auf der Insel droht eher ein Gefühl von „Tagesliste“ (B5). | [V]/[P] |
| Gesunde Gründe zurückzukehren? | Jahreskreis, Tiere/Eier, Luau-Abende (1 von 5), Briefe aus Flaschenpost – alles ohne Strafe. | [N] |
| Emergenz? | Stil-Reaktionen, Besuch, Café-Gäste, jetzt Luau-Gäste (wechseln je Tag). Klein, aber stimmig. | [N] |
| Tragen alle Systeme die Säulen? | Ja. Grenzfall Säule 2 („keine Pflicht“): die Summe der Tages-Rituale auf der Insel (B5). | [N]/[V] |
| Wo fehlen Ziele? | Spätspiel: Insel/Garten/Farm. Frühspiel: Tage 1–10 haben keine neuen Überraschungen seit Wochen. | [V] |
| Was verliert seinen Reiz? | Palmenschütteln und Strandfunde (täglich dasselbe) [P]; Flaschenpost ist nach 14 Briefen leer (≈ 55 Insel-Tage). | [P]/[N] |

## 5. Findings – priorisiert

### 🔴 Kritisch
**Keine.**

### 🟠 Hoch
**Keine.** (Der Playtest-Punkt aus Audit 3/4 ist durch Olis Entscheidung erledigt; die Folgen stehen als B1 unter „Mittel“.)

### 🟡 Mittel

**B1 · Playtest ersetzt durch „Oli spielt und meldet“ – Messlücken bleiben [N, Wirkung P]**
- *Problem:* Oli kennt das Geschenk und alle Überraschungen, spielt also mit Vorwissen. Tempo (Einzüge, Herzen, ⭐/h) und „Überrascht es sie?“ lassen sich so nur grob beurteilen.
- *Auswirkung:* Gefahr, dass etwas für Oli „passt“ und für Lina zu schnell/zu langsam ist – vor allem Tempo und Entdeckungen.
- *Empfehlung:* 💡 Kein neuer Aufwand außer einer kleinen **Zeitprotokoll-Hilfe** (nur Dev: Spielzeit, ⭐, Fänge pro Stunde im Debug-Objekt), damit Oli Tempo-Eindrücke mit Zahlen unterlegen kann. Außerdem: Beobachtungen künftig kurz mit Tag/Uhrzeit melden („Einzug von Jens nach 3 h 20“) – dann lassen sich Audit-Annahmen (A5/M3) daran prüfen.
- *Nebenwirkung:* keine.
- *Playtest/Prüfung:* laufende Rückmeldung von Oli.

**B2 · Eier-Einkommen skaliert linear, ohne Obergrenze [N]**
- *Mechanik:* Wachtelstall 1 900 ⭐ → 3–4 Eier × 14 ⭐ ≈ **49 ⭐/Tag**; Hühnerstall 2 800 ⭐ → 2–3 × 20 ⭐ ≈ 50 ⭐/Tag (`data/animals.ts`, `core/coop.ts`). Eier sammeln sich 3 Tage an. Es gibt **keine Obergrenze für Ställe** (nur die Fläche): Dorfgarten 16 × 11, Inselgarten 10 × 6 (beide neu zusammen ≈ 236 Felder, ≈ 100+ Ställe wären möglich).
- *Rechnung [N]:* 20 Ställe = 38 000 ⭐ → ≈ **1 000 ⭐/Tag** (Amortisation ≈ 39 Tage). 40 Ställe ≈ 2 000 ⭐/Tag. Zum Vergleich: ein Fang ≈ 176 ⭐, der Gesamtbedarf ≈ 492 000 ⭐ (≈ 250 Tage bei 2 000 ⭐/Tag).
- *Auswirkung:* Für „Linas Traumfarm“ ist das schön und gemütlich. Als Optimierung entwertet es aber alles andere: ein Tagesrundgang durch die Ställe ≈ 1–2 Minuten bringt mehr als eine Stunde Angeln [V]. Kein Exploit im Sinne von Fehler, aber eine **dominante Strategie**, die das Spiel „leer“ machen kann, wenn Lina sie findet.
- *Empfehlung:* 💡 **Beobachten.** Wenn Oli das im Spiel merkt: sanft deckeln (z. B. Eier gelten pro Tag nur für die ersten ~10 Ställe voll, danach −50 %) oder die Eier nicht verkaufbar machen, sondern nur zum Kochen/Verschenken nutzen. **Nicht empfohlen:** Stallzahl hart begrenzen (fühlt sich wie eine Strafe an).
- *Nebenwirkung:* Jede Änderung am Eier-Preis trifft auch die Rezepte; zuerst messen, dann entscheiden.
- *Playtest/Prüfung:* Oli: „Wie viele Ställe hast du? Was bringt dir der Tag?“

**B3 · Die Arbeit konzentriert sich auf das Spätspiel [N, Wirkung V]**
- *Mechanik:* Boot, Fest, Hütte, Garten, Kokos, Fische, Flaschenpost, Schildkröte, Delfine, Luau, Insel-Musik – alles erst nach „alle Herzen bei allen“ (**≥ 11 echte Tage** bei maximalem Einsatz [N], realistisch länger [V]).
- *Auswirkung:* Wer das Spiel tagelang gespielt hat, bekommt viel; wer es in den ersten 10 Tagen zeigt (Probe, Vorführung), sieht davon nichts. Zugleich ist das Frühspiel das, was Lina als Erstes erlebt.
- *Empfehlung:* 💡 Als Nächstes Frühspiel und Alltag stärken – genau die Wünsche aus Olis Rückmeldung: **Gäste im Café reden miteinander und mit Jens, Glühwürmchen an Frühlings-/Sommerabenden, Winston-Tricks**. Danach nur noch kleine Insel-Feinheiten, keine neuen Inselsysteme.
- *Nebenwirkung:* keine.
- *Playtest/Prüfung:* Oli: „Was war in den ersten Tagen neu?“

**B4 · Layout-Features ohne vorherige Bestätigung → doppelte Arbeit [N]**
- *Mechanik:* #159 (Arbeitszimmer statt Dachzimmer, Spielstand v18) → #160 (Schlafzimmer verlängert, **verworfen**, weil ich die Absicht missverstanden hatte) → #162 (schmale Durchgänge).
- *Auswirkung:* 3 PRs und eine Migration für ein Ziel, das ein Screenshot-Austausch in einer Nachricht geklärt hätte. Der Spielstand-Umbau (Dach → Arbeitszimmer) musste außerdem ohne Rückbau weiterleben.
- *Empfehlung:* 💡 **Arbeitsregel:** Bei Änderungen an Grundriss/Raumaufteilung und überall dort, wo eine Spielstand-Migration nötig wäre, erst die Absicht in einem Satz zurückspiegeln (oder eine Skizze/ein Screenshot der Variante) und **dann** bauen und migrieren. In `CLAUDE.md` nicht nötig; gilt für meine Arbeitsweise.
- *Nebenwirkung:* kostet eine Nachricht.
- *Playtest/Prüfung:* –

**B5 · Tägliche Mini-Rituale summieren sich auf der Insel [V/P]**
- *Mechanik:* 15 Palmen (je einmal am Tag), 5 Strandfunde, mögliche Flaschenpost, Schildkröte, Garten, Fischen, Luau – jeweils freiwillig, jeweils ohne Streak oder Strafe.
- *Auswirkung:* Keine einzelne Sache ist ein Problem, aber **alle zusammen können sich wie eine Tagesliste anfühlen** („noch die Palmen!“), was Säule 2 widersprechen würde. Ob das so wirkt, ist reine Gefühlssache [P].
- *Empfehlung:* 💡 **Keine weiteren täglichen Insel-Rituale bauen.** Falls Oli das Palmenschütteln als Pflicht erlebt: auf „einmal pro Palme und Woche“ umstellen (gleiches Einkommen, weniger Rhythmus).
- *Nebenwirkung:* keine.
- *Playtest/Prüfung:* Oli: „Hast du die Insel eher besucht, weil du Lust hattest, oder um etwas abzuhaken?“

**B6 · Katalog-Budget fast aufgebraucht [N]**
- *Mechanik:* `game/catalogBudget.test.ts` begrenzt die Summe auf 300 000 ⭐; heute ≈ 264 000 ⭐ (**88 %**). Die vier neuen Möbel (Nachtschrank, Kleiderständer, Bücherschrank, moderner Kühlschrank) und die Insel-/Haus-Anpassungen haben seit Audit 4 ≈ 9 000 ⭐ ergänzt.
- *Auswirkung:* Die nächste Möbel-Welle von ~35 000 ⭐ löst den Test aus (gewollt). Dann muss bewusst entschieden werden, ob Einkommen oder Obergrenze steigen.
- *Empfehlung:* 💡 Nichts tun. Bei der nächsten größeren Möbel-Welle den Satz zur Einnahmen-Wirkung im PR nicht vergessen (Leitlinie §7c).
- *Nebenwirkung:* keine.
- *Playtest/Prüfung:* ⭐/h (B1).

### 🟢 Niedrig

**B7 · Ökonomie-Doku wieder leicht veraltet [N]** – `GAME_ECONOMY.md` nennt 287 Einträge/259 k ⭐ und Gesamtbedarf 483 k (jetzt 292/264 k und ≈ 492 k) und kennt weder Kokosnüsse noch Inselfische noch das Eier-Skalierungsproblem. Empfehlung 💡 K1: nach Freigabe aktualisieren (nur Doku).

**B8 · Technikschulden wachsen [N]** – `World3D.ts` hat 5 012 Zeilen, `models/furniture.ts` 4 233 (A10 wurde nicht umgesetzt). Neue 3D-Teile (`Dolphins3D`, `Luau3D`, Schildkröten-Modell, Seitendurchgang-Verschiebung) haben nur Tests an den Rändern (Daten, Logik), keine für die Szene selbst. Empfehlung 💡 beim nächsten Anfassen aufteilen (Insel-Teil aus `World3D`, Möbelmodelle nach Stil) – ohne Verhaltensänderung.

**B9 · Spielstand-Version steigt schnell [N]** – v16 → v19 in 4 Tagen; zwei der drei Anhebungen sind reine Hinweise für neue optionale Felder, die Migration für das Arbeitszimmer ist inhaltlich (Dach → Arbeitszimmer). Tests decken alle ab. Empfehlung 💡: optionale Felder nur dann mit einer Anhebung versehen, wenn sie Altspielstände ändern; sonst reicht die Normalisierung. Kein Handlungsbedarf.

**B10 · Verifikationslücken [N]** – Nicht im echten Ablauf gesehen oder gehört: Delfin-Sprung, Flaschenpost-Fund am Strand samt Brief, Luau-Musik (Klang), Ukulele-Töne, Baumobst-Verfall nach einer Stunde, Gisela-Zeilen in einem echten Gespräch, Seitendurchgang zum Wintergarten. Alles klein; Oli kann es beim Spielen mit abhaken.

## 6. Was gut ist – bitte nicht „wegoptimieren“ [N]

- **Alle neuen Mechaniken sind optional und ohne Strafe** – Flaschenpost, Luau (1 von 5 Abenden, wer fehlt, verpasst nichts), Baumobst-Verfall (Drops, nichts anderes).
- **Die Insel als Belohnung für „alle Herzen“** – emotional stimmiger Höhepunkt (Party, Hütte, Garten, Traum von der Wachtelfarm).
- **Tasche voll → Gegenstände liegen vor ihr, nur ein Hinweis, nichts geht verloren.**
- **Schmale Seitendurchgänge** – das Haus wirkt aus einem Guss.
- **Plauderzeilen mit Persönlichkeit** (Gisela, Insider) und Reaktionen auf Einrichtung/Schwips.
- **Kein Streak, kein FOMO, keine Strafe fürs Pausieren** – bleibt durchgehend eingehalten.

## 7. Priorisierte Liste

| # | Maßnahme | Wirkung | Aufwand | Risiko | Wann |
|---|---|---|---|---|---|
| – | Wünsche aus Olis Rückmeldung: Café-Gäste reden (auch mit Jens), Glühwürmchen, Winston-Tricks | ●● | ●● | ● | **jetzt** (B3) |
| K1 | `GAME_ECONOMY.md` aktualisieren (B7) | ● | ● | ● | nach Freigabe |
| ❓ M1 | Eier-Skalierung beobachten, bei Bedarf sanft deckeln (B2) | ●● | ● | ●● | nach Olis Rückmeldung |
| ❓ M2 | Palmen auf „wöchentlich“ umstellen, falls es sich nach Pflicht anfühlt (B5) | ● | ● | ● | nach Olis Rückmeldung |
| 💡 | Debug-Statistik (⭐/h, Fänge/h) für Oli (B1) | ● | ● | ● | optional |
| 💡 | Arbeitsregel: Grundriss/Migration erst bestätigen (B4) | ●● | – | – | ab sofort |
| 💡 | `World3D` und `furniture.ts` aufteilen (B8) | ● | ●● | ● | nächste Berührung |

**Kontrollfragen für Oli beim Spielen** (statt Bogen):
1. Wie viele Ställe hast du aufgestellt? Was bringt dir ein Tag Eier?
2. Besuchst du die Insel aus Lust oder um etwas abzuhaken?
3. Was war in den ersten Spieltagen neu? Wie lange bis zum ersten Einzug (nach Uhr)?
4. Ist dir das Luau aufgefallen? Wann hast du die Flaschenpost zuletzt gefunden?

## 8. Nicht empfohlen

| Idee | Warum nicht |
|---|---|
| Stallzahl hart begrenzen | fühlt sich wie eine Strafe an (Säule 2); zuerst beobachten (B2) |
| Mehr tägliche Insel-Rituale | B5: Tagesliste-Gefühl; die Insel hat genug |
| Weitere Möbel-Wellen ohne Einnahmen-Satz im PR | B6: Budget zu 88 % genutzt |
| Weiteres Insel-System vor Frühspiel-Verbesserungen | B3: Aufwand liegt schon dort |
| Layout-Änderungen ohne Rückspiegeln der Absicht | B4: Drei PRs für ein Ziel |

---

*Auch dieser Audit ersetzt keine Rückmeldung von Lina. Er zeigt, wo Oli beim Spielen zuerst hinschauen sollte: wie viel das Eier-Geschäft bringt, ob die Insel Lust oder Liste ist und wie sich die ersten Tage anfühlen.*
