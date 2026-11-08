# Playtesting

Es gibt genau eine Zielspielerin – deshalb sind **Beobachtung von Lina** (oder einer Stellvertreterin, bevor das
Geschenk übergeben ist) und **automatische Tests** wichtiger als Statistik. Telemetrie wird bewusst **nicht**
eingebaut (privates Geschenk, keine Datensammlung).

## 1. Was es schon gibt ✅

| Werkzeug | Prüft |
|---|---|
| `game/playthrough.test.ts` | ganze Rahmenhandlung mit erreichbaren Mitteln, alle Ausbaustufen, Speichern & Laden |
| Daten-Tests (`*.test.ts` in `data/`) | jedes Rezept erreichbar, jede Samensorte hat eine Quelle, keine verwaisten Gegenstände, Möbelhöhen vollständig |
| `core/worldmap.test.ts` | nichts steht auf Wegen, alles erreichbar, Dorfplatz frei genug |
| Headless-Browser (Playwright) | Szenen anspielen, Screenshots für PRs |
| URL-Parameter `?zeit=`, `?datum=`, `?wetter=`, `?musik=` | beliebige Tage/Wetter/Lieder sofort testen |
| `window.__rina` (Dev) | Spielstand & Zustand live verändern |

## 2. Beobachtungs-Playtest (qualitativ)

**Ablauf:** Lina (oder Testerin) spielt, die/der Beobachtende sagt nichts, notiert nur. Danach 5 Minuten Gespräch.

**Beobachten:**
- Wo zögert sie? Wo sucht sie etwas? (Bedienhürden)
- Wann lacht sie? Welche Zeilen liest sie laut vor? (Säule 1 wirkt)
- Wann sagt sie „jetzt muss ich noch …“? (Pflichtgefühl!)
- Wann wartet sie nur? (Pacing)
- Wann ist die Tasche voll? Wie oft geht sie heim?
- Was richtet sie ein, und wie lange? (Besitz)

**Nachfragen (offen, nicht suggestiv):**
1. Was war heute der schönste Moment?
2. Gab es etwas, das sich wie Arbeit angefühlt hat?
3. Worauf freust du dich beim nächsten Mal?
4. Gab es etwas, das du machen wolltest, aber nicht konntest?

## 3. Test-Szenarien

| # | Szenario | Einstieg | Erfolgskriterium |
|---|---|---|---|
| S1 | Erster Start | neuer Spielstand | versteht ohne Hilfe Laufen, Anschauen, Angeln; erster Fang in < 5 Min |
| S2 | Kurze Sitzung | Spielstand nach allen Einzügen, `?zeit=19:00` | in 3 Min mindestens eine „kleine Freude“ ohne Abhaken-Gefühl |
| S3 | Rückkehr nach Pause | Spielstand 3 Wochen in die Zukunft (`?datum=`) | kein Nachteil spürbar; Post & Beet in gutem Zustand; Lust weiterzumachen |
| S4 | Story-Wartezeit | direkt nach einem Ankündigungsbrief | die 10 Min werden mit Spielen gefüllt, nicht mit Warten |
| S5 | Sparziel | Stufe 3 bestellt, 0 ⭐ | Abbezahlen fühlt sich wie Ziel an, nicht wie Last |
| S6 | Kreuzen | 2 Farben im Beet | versteht ohne Wiki, wie eine Mischfarbe entsteht (Christin/Brief-Hinweise) |
| S7 | Winter | `?datum=2026-12-10` | versteht Winterruhe, empfindet sie nicht als Strafe |
| S8 | Lange Sitzung im Spätspiel | alles ausgebaut | findet nach 30 Min noch etwas, das sie *will* (nicht *muss*) |
| S9 | Tasche voll | normales Sammeln | Häufigkeit der Heimwege notieren |

## 4. Kennzahlen (manuell erhoben, kein Tracking)

| Kennzahl | Wie messen | Zielwert / Warnsignal |
|---|---|---|
| ⭐ pro Stunde je Aktivität | Stoppuhr + Kontostand vorher/nachher | Angeln ≤ ~2× der zweitbesten Quelle, sonst ⚠️ |
| Zeit bis zum nächsten Einzug | Spielzeit (`session.playTime()`) | 20–60 Min je Einzug |
| Heimwege wegen voller Tasche | Strichliste | > 3 pro 30 Min ⚠️ |
| Dialog-Wiederholungen | gleiche Zeile mehrfach gesehen (Notiz) | auffällig in < 2 Wochen ⚠️ |
| „Muss noch“-Aussagen | Strichliste beim Beobachten | jede einzelne ist ein Hinweis |
| Zeit im Einrichtungsmodus | Stoppuhr | hoch = Säule 3 funktioniert |

## 5. Automatische Balancing-Prüfungen 💡

Ideen für zusätzliche Tests (noch nicht gebaut):
- **Wert-Spannen-Test:** Gerichte liegen bei 1,3–3,5× Zutatenwert, Vasen genau wertneutral; Ausreißer werden
  gemeldet (siehe [`BALANCING_GUIDELINES.md`](BALANCING_GUIDELINES.md)).
- **Erwartungswert-Test** für Angeln/Kescher je Monat, damit neue Arten den Schnitt nicht unbemerkt verschieben.
- **Herz-Belohnungs-Test:** meldet Herzen ohne Brief/Belohnung (aktuell bewusst nicht als Fehler, aber sichtbar).
- **Durchlauf mit Zeitmessung:** `playthrough.test.ts` könnte die simulierte Spielzeit bis zu jedem Einzug ausgeben.

## 6. Nach jedem größeren Feature

1. `npm run typecheck && npm test && npm run build`
2. Im Browser anspielen (Desktop), Screenshots für den PR.
3. Die 8 Fragen der Designprüfung (siehe [`README.md`](README.md)) im PR kurz beantworten.
4. Relevante Dokumente hier aktualisieren.
