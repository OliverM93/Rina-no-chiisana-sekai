# Spielerlebnis

Was soll Lina beim Spielen *fühlen*? Gegliedert nach MDA: Wir legen das gewünschte Erlebnis (Aesthetics)
fest und prüfen, welche Dynamiken und Mechaniken es heute tragen.

## Gewünschte Erlebnisse

| Erlebnis | Beschreibung | Getragen von (✅ implementiert) | Lücke / 💡 |
|---|---|---|---|
| **Geborgenheit** | „Hier bin ich zu Hause, hier wartet jemand auf mich.“ | Oli holt Lina mit Begrüßungsküsschen ab, Winston läuft mit, Omas Bank, leuchtende Fenster abends, Musik je Tageszeit | stark |
| **Wiedererkennen & Lachen** | Insider, echte Eigenheiten der Liebsten | Dialog-Pools mit Bedingungen, Lars' Wortwitze, Jens' Sächsisch, Omas „pfui!“, Olafs Dad-Jokes, TV-Reaktionen | Dialoge wiederholen sich mit der Zeit (siehe Risiken) |
| **Stolz auf das Eigene** | „Das habe *ich* eingerichtet / gezüchtet / gesammelt.“ | Einrichten mit Höhenregel & Wand-Deko, Garten gestalten, Mischfarben-Blumen, Sammelbuch, Tassensammlung, Galerie | 💡 Es fehlt eine Bühne, um Erreichtes festzuhalten (Fotomodus/Tagebuch, 🗓️) |
| **Entdeckerfreude** | „Oh, was ist *das*?“ | Saisonale Arten, seltene Fische, Kreuzungen (Schwarz ist selten), Funde mit der Schaufel, Feste, Postkarten | 💡 Nach dem ersten Jahr nimmt das Neue spürbar ab |
| **Ruhe & Achtsamkeit** | Entschleunigen nach dem Alltag | Angeln ohne Scheitern, Idle-Animationen, Regen-/Meeresgeräusche, Schnee & Fußspuren | stark |
| **Romantik** | Zuneigung zu Oli, ohne Kitsch-Überdosis | Küsschen, Picknick, Sterne gucken, Kaffee zu zweit, Adventskalender, Fernsehabend | 💡 Romantische Momente skalieren nicht mit der Beziehung (alles ab Tag 1 verfügbar) |
| **Kleine Überraschungen** | Der Tag ist nie ganz gleich | Briefe, Tagesangebot am Samenstand, Galerie-Bild des Tages, Wetter, Winstons Buddelfund, Daily Treats | gut |
| **Feierliche Höhepunkte** | Besondere Tage fühlen sich besonders an | Einzugsszenen, Feste, Geburtstage (Lina, Oli), Silvesterfeuerwerk | 🗓️ Geburtstage der übrigen Bewohner fehlen |

## Bewusster Kontrast

✅ Das Fernsehprogramm zeigt ernste Themen nüchtern (Nachrichten, True Crime, Horror, Doku) – ein **gewollter
ironischer Bruch** mit der Pastellwelt, weil Lina das im echten Leben mag. Das ist Säule 1 („Liebe zum Echten“)
vor Genre-Konvention. Grenzen: nichts Explizites, niemand wird verspottet.

## Unerwünschte Erlebnisse (Anti-Ziele)

- **Pflichtgefühl:** „Ich muss noch alle Bewohner abklappern.“ → Risiko vorhanden, siehe [`PACING.md`](PACING.md).
- **Ratlosigkeit:** „Was soll ich jetzt machen?“ → Hinweise kommen nur im Gespräch; nach dem letzten Einzug gibt
  es keine sanften Ziele mehr.
- **Inventar-Tetris:** „Meine Tasche ist schon wieder voll.“ → Risiko gestiegen durch viele neue Gegenstände (Beet & Samen).
- **Entwertung:** „Sternchen sind egal, ich habe genug.“ → Spätspiel-Risiko, siehe [`GAME_ECONOMY.md`](GAME_ECONOMY.md).
- **Gefühl, etwas zu verpassen:** Saisonware & Feste sind jährlich wiederkehrend – das ist in Ordnung, solange
  nichts *einmalig für immer* verschwindet (heute so umgesetzt ✅).

## Die drei Kernmomente (an denen wir alles messen)

1. **Der Heimweg am Abend:** Lina kommt mit voller Tasche nach Hause, verkauft, Oli wartet, die Lampen gehen an.
2. **Das „Oh!“ beim Pflücken:** Eine neue Mischfarbe, ein seltener Fisch, ein Fossil.
3. **Der Blick ins eigene Zimmer:** Alles steht so, wie *sie* es wollte.

Ein neues Feature sollte mindestens einen dieser Momente verstärken.
