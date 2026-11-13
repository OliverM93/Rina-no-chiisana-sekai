# Game-Design-Wissensbasis – Rina no Chiisana Sekai

Diese Dokumente beschreiben, **warum** das Spiel so funktioniert, wie es funktioniert, und woran sich neue
Ideen messen lassen müssen. Das *Was* und *Wo im Code* steht in [`../game-mechanics.md`](../game-mechanics.md),
der Arbeitsstand in [`../development-status.md`](../development-status.md).

Stand der Bestandsaufnahme: November 2026 (nach Merge von Beet & Samen, Phasen 1–5).

## Kennzeichnung in allen Dokumenten

| Zeichen | Bedeutung |
|---|---|
| ✅ | **implementiert** – so ist es heute im Spiel |
| 🗓️ | **geplant** – steht in der Roadmap/im Ideen-Parkplatz, aber noch nicht gebaut |
| 💡 | **Empfehlung** – Vorschlag aus der Game-Design-Analyse, *keine* Projektentscheidung |
| ❓ | **offene Designentscheidung** – muss von Lina/Oli (Auftraggeber) entschieden werden |
| 📏 | **Schätzung** – aus Daten berechnet, im Playtest zu prüfen |

## Dokumente

| Datei | Inhalt |
|---|---|
| [`GAME_VISION.md`](GAME_VISION.md) | Vision, Genre, Zielgruppe (eine Spielerin), Ausrichtung |
| [`DESIGN_PILLARS.md`](DESIGN_PILLARS.md) | Fünf Designsäulen als Prüfsteine für jede Entscheidung |
| [`PLAYER_EXPERIENCE.md`](PLAYER_EXPERIENCE.md) | Gewünschte Erlebnisse & Emotionen, MDA-Sicht |
| [`CORE_GAME_LOOP.md`](CORE_GAME_LOOP.md) | Loops auf allen Zeitskalen und wie sie ineinandergreifen |
| [`PROGRESSION.md`](PROGRESSION.md) | Einzüge, Hausausbau, Herzen, Sammlungen, Freischaltungen |
| [`GAME_ECONOMY.md`](GAME_ECONOMY.md) | Sternchen-Quellen & -Senken, Crafting-Margen, Zahlen |
| [`BALANCING_GUIDELINES.md`](BALANCING_GUIDELINES.md) | Faustregeln für Preise, Belohnungen, Kosten |
| [`PACING.md`](PACING.md) | Rhythmus von 1 Minute bis 1 Jahr |
| [`PLAYER_PSYCHOLOGY.md`](PLAYER_PSYCHOLOGY.md) | SDT, Neugier, Besitz, Anti-Manipulations-Regeln |
| [`PLAYTESTING.md`](PLAYTESTING.md) | Wie wir prüfen, ob es sich gut anfühlt |
| [`PLAYTEST_BOGEN.md`](PLAYTEST_BOGEN.md) | Playtest-Bogen für Olis Test vor der Übergabe (Ablauf, Notizen, Fragen, Fehler-Liste) |
| [`DESIGN_DECISIONS.md`](DESIGN_DECISIONS.md) | Getroffene Entscheidungen (mit Begründung) + offene Fragen |
| [`IMPROVEMENTS.md`](IMPROVEMENTS.md) | Priorisierte Verbesserungsliste & Abschlussbericht der Analyse |
| [`GAME_DESIGN_AUDIT.md`](GAME_DESIGN_AUDIT.md) | Unabhängiger, kritischer Audit des tatsächlich implementierten Spiels (Findings F1–F18, Roadmap) |
| [`GAME_DESIGN_AUDIT_2.md`](GAME_DESIGN_AUDIT_2.md) | Nachprüfung (Nov. 2026): Status von F1–F18, neue Findings N1–N8, Empfehlung: Playtest vor neuen Features |
| [`GAME_DESIGN_AUDIT_3.md`](GAME_DESIGN_AUDIT_3.md) | Audit 3 (Nov. 2026): Sternchen-Wirtschaft nachgerechnet, Tempo der Einzüge, Oli-Tempo, Orientierung, Maßnahmen K1–K5 / M1–M3 / G1–G2 |
| [`GAME_DESIGN_AUDIT_4.md`](GAME_DESIGN_AUDIT_4.md) | Audit 4 (Nov. 2026): Katalog-Verdopplung, Stil-Freischaltung ohne Ankündigung, Sparbuch/Kredit/Bausparen, Story-Tempo nach ×1,5; Empfehlung: Playtest vor weiteren Wellen, K1–K3 |

## Designprüfung vor jedem neuen Feature

Bevor eine neue Mechanik gebaut oder eine bestehende grundlegend geändert wird, werden diese acht Fragen
kurz beantwortet (im PR-Text oder in `DESIGN_DECISIONS.md`):

1. Welches konkrete Spielerlebnis soll entstehen?
2. Welchen Zweck erfüllt es im bestehenden Loop (welcher Loop, welche Zeitskala)?
3. Welche Mechaniken und Dynamiken entstehen daraus?
4. Wie trägt es zum langfristigen Spielspaß bei?
5. Was ändert sich an Progression und Sternchen-Wirtschaft?
6. Welche Nebenwirkungen/Exploits sind denkbar?
7. Passt es zu den [Designsäulen](DESIGN_PILLARS.md)?
8. Gibt es eine einfachere Lösung für dasselbe Erlebnis?

Nicht jede Idee muss umgesetzt werden. „Lohnt sich im Spiel nicht“ ist ein legitimes Ergebnis
(so wurde es schon bei Beet & Samen gehandhabt).

## Unabhängiger Game-Design-Audit (Ergänzung zu den Prinzipien)

Neben der Designprüfung *vor* einem Feature wird das Spiel regelmäßig *als Ganzes* kritisch geprüft – wie ein fremdes Spiel,
unabhängig davon, wer es gebaut hat. Ergebnis: [`GAME_DESIGN_AUDIT.md`](GAME_DESIGN_AUDIT.md).

**Wann:** nach größeren Meilensteinen, vor dem Planen der nächsten Roadmap, oder wenn sich etwas „zu viel“ oder „zu leer“ anfühlt.

**Regeln für einen Audit**
1. **Unabhängig & selbstkritisch:** eigene frühere Entscheidungen ausdrücklich hinterfragen, nichts nachträglich rechtfertigen.
   Mehr Features ≠ mehr Spaß. Vereinfachen, ändern oder entfernen ist erlaubt (als Empfehlung).
2. **Am tatsächlichen Spiel prüfen:** Code, Daten, Tests, wenn möglich das laufende Spiel – nicht die Absicht.
3. **Belastbarkeit kennzeichnen:** [N] Nachweis · [V] begründete Vermutung · [P] nur durch Playtest prüfbar.
4. **Fragen beantworten:** Macht es Spaß? Tragen die Loops langfristig? Gibt es echte Entscheidungen? Ist die Progression
   befriedigend? Sind Belohnungen/Ökonomie sinnvoll? Wo ist es monoton oder frustrierend? Gibt es gesunde Gründe zurückzukehren?
   Entsteht Emergenz? Tragen alle Systeme die Säulen? Wo fehlen Ziele? Was verliert seinen Reiz?
5. **Findings priorisieren** (Kritisch · Hoch · Mittel · Niedrig) – jeweils mit Problem, Mechanik, Auswirkung, Begründung,
   Empfehlung, Nebenwirkungen und Playtest-Prüfung. Nach Einfluss auf den Spielspaß, nicht nach technischer Attraktivität.
   Einfache, wirkungsvolle Lösungen vor neuen Features.
6. **Während eines Audits wird nichts am Spiel geändert** – keine Features, kein Balancing, keine Quelldateien, keine Refactorings.
   Erlaubt sind nur Analyse, Spiel/Tests ausführen und der Bericht. Fehlende Informationen und nötiges Playtesting werden notiert.
