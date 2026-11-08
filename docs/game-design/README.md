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
| [`DESIGN_DECISIONS.md`](DESIGN_DECISIONS.md) | Getroffene Entscheidungen (mit Begründung) + offene Fragen |
| [`IMPROVEMENTS.md`](IMPROVEMENTS.md) | Priorisierte Verbesserungsliste & Abschlussbericht der Analyse |

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
