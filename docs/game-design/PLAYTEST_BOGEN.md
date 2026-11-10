# Playtest-Bogen (Stellvertreter-Test vor der Übergabe)

Das Spiel ist ein **Geschenk für Lina**. Sie soll es erst spielen, wenn es fertig ist – deshalb testet vorher eine **Stellvertreterin / ein Stellvertreter**
(Familie oder Freunde, die Lina gut kennen, das Spiel aber nicht). Dieser Bogen ist für sie/ihn und für die Person, die beobachtet.
Er ergänzt [`PLAYTESTING.md`](PLAYTESTING.md) (Szenarien S1–S9, Kennzahlen) und beantwortet die offenen Fragen aus
[`GAME_DESIGN_AUDIT_2.md`](GAME_DESIGN_AUDIT_2.md).

**Grundregeln**
- Keine Telemetrie, keine Aufzeichnung – nur Zettel und Gespräch. Der Spielstand bleibt im Browser der Testerin.
- Die Testerin spielt **so, wie sie will**. Es gibt keine Aufgaben, kein Richtig oder Falsch. Alles, was nicht klappt, ist ein Fehler im Spiel, nicht bei ihr.
- Die beobachtende Person (z. B. Oli) **sagt nichts und hilft nicht**, außer die Testerin steckt fest (dann notieren, *wo*, und erst danach helfen).
- Wichtig: **Nicht Lina vorab zeigen.** Wer testet, sollte Verschwiegenheit zusagen (Screenshots nicht teilen).

## 1. Vorbereitung (5 Minuten)

1. Spiel öffnen (GitHub-Pages-Link oder `npm run dev` → <http://localhost:5173>), **Laptop/PC, Desktop-Browser** (kein Handy).
2. Titelbildschirm → „Neues Spiel“, eigenen Namen für die Testfigur nehmen (nicht Lina).
3. Vor jeder Sitzung im Menü **„Spielstand exportieren“** (JSON speichern) – falls etwas schiefgeht.
4. Zettel und Stift bereitlegen (oder dieses Dokument ausdrucken). Uhrzeit des Starts notieren.

## 2. Drei Sitzungen

| Sitzung | Dauer | Was | Fragen dahinter |
|---|---|---|---|
| **A · Ankommen** | ~45 Min | neues Spiel, bis zum ersten oder zweiten Einzug | S1 Erster Start, S4 Wartezeit: Versteht sie die Bedienung ohne Hilfe? Gibt es Leerlauf? |
| **B · Dorf & Haus** | ~45 Min | Spielstand nach den Einzügen (Test-Spielstand von uns oder A weiterspielen) | S2, S8, S9: Findet sie nach 30 Min noch etwas, das sie *will*? Wie oft ist die Tasche voll? |
| **C · Nach einer Pause** | ~30 Min | an einem anderen Tag, optional mit `?datum=` 2–3 Wochen später | S3: Spürt sie Druck wegen der Pause? Fühlen sich die Bewohner wiedererkennbar an? |

Zwischen den Sitzungen mindestens einen Tag Pause lassen (Wiederholungen im Dialog fallen erst dann auf).

**Zeitreise-Hilfen (nur für Beobachtende):** `?zeit=19:30` · `?datum=2026-12-10` (Winter) · `?wetter=regen` an die Adresse hängen.
Tagsüber **und** abends testen: Lina spielt beides.

## 3. Beobachtungsbogen (für die beobachtende Person)

Pro Auffälligkeit eine Zeile: *Uhrzeit · was passiert · Wortlaut, wenn sie etwas sagt*. Strichlisten unten.

**Wo zögert oder sucht sie?** (Bedienhürden)
-
-

**Wann lacht sie, liest laut vor, sagt „oh wie süß“?** (das funktioniert)
-
-

**Wann sagt sie „jetzt muss ich noch …“ / „ich sollte noch …“?** (Pflichtgefühl – jede einzelne Aussage zählt)
-
-

**Wann wartet sie nur oder schaut sich ratlos um?** (Pacing)
-
-

**Was bleibt unverständlich?** (Hinweise, Rezepte, Wünsche, Einzug-Voraussetzungen)
-
-

| Strichliste | Sitzung A | B | C |
|---|---|---|---|
| Heimwege wegen voller Tasche | | | |
| „Muss noch“-Aussagen | | | |
| Gleiche Dialogzeile zum zweiten Mal gesehen | | | |
| Stellen, an denen sie festhing (ohne Hilfe nicht weiter) | | | |
| Fehler / Abstürze / komische Darstellung | | | |

**Zeitmarken** (Spielzeit zählt, nicht Uhr): Ankunft Oma · 1. Einzug · 2. Einzug · alle Einzüge · erstes eigenes Möbel aufgestellt · erster Wunsch erfüllt: ______

## 4. Fragen an die Testerin (nach jeder Sitzung, 5–10 Minuten, offen und nicht suggestiv)

1. Was war der schönste Moment?
2. Gab es etwas, das sich wie **Arbeit** angefühlt hat?
3. Worauf freust du dich beim nächsten Mal?
4. Gab es etwas, das du machen wolltest, aber nicht konntest?
5. Was hast du nicht verstanden?
6. Wenn du ein Ding ändern dürftest – welches?

**Nach Sitzung B und C zusätzlich**
7. Was hast du am Ende am liebsten gemacht? Was hast du gar nicht angefasst?
8. Gab es eine Stelle, an der du dachtest „das ist aber lieb gemeint“ – und dich gefreut hast?
9. Hat dich etwas genervt, das sich wiederholt hat?

## 5. Stellvertreter-Fragen: „Wäre das etwas für Lina?“

Hier geht es um **Linas Geschmack**, nicht um die Testerin. Bitte ehrlich und kurz antworten (Ja / Eher ja / Eher nein / Nein – und warum):

| Frage | Antwort |
|---|---|
| Würde Lina die Bewohner in Wort und Aussehen wiedererkennen? (Oma, Papa, Christin, Jens, Lars, Thalia, Oli) | |
| Würde sie sich über die kleinen Insider und Anspielungen freuen oder stören sie? | |
| Ist an irgendeiner Stelle etwas, das **nicht zu der Person passt**, die es darstellt? (z. B. ein Satz, den die Person nie sagen würde) | |
| Würde Lina sich beim Einrichten verlieren (gut) oder überfordert sein (Katalog, 12 Stile)? | |
| Würde sie die „Ordnung“ der Wünsche, Rezepte und Sammelbuch-Seiten als Spaß oder als Liste empfinden? | |
| Mag sie die Musik und die Geräusche? Was würde sie stummschalten? | |
| Wie oft würde sie schätzungsweise spielen (täglich / mehrmals die Woche / in Schüben)? Tagsüber, abends? | |
| Was fehlt, das Lina *bestimmt* vermissen würde? (Dinge aus ihrem Alltag, Lieblingsthemen) | |

## 6. Fehler-Liste (für alles, was kaputt wirkt)

| # | Wo (Ort / Menü) | Was passiert | Erwartet | Schwere (stört / blockiert) |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |

Bitte gern einen Screenshot (Taste **F** im Spiel = Fotomodus, oder Bildschirmfoto) und den **exportierten Spielstand** dazulegen.

## 7. Auswertung (danach, ca. 30 Minuten)

1. Gemeinsam die Zettel durchgehen, jede Auffälligkeit einer Kategorie zuordnen: **Fehler** · **unklar** · **zu viel/zu wenig** · **Wunsch**.
2. Die Top 5 nach „stört am meisten“ sortieren und als Aufgaben festhalten. **Fehler vor Wünschen.**
3. Prüfen gegen die Ziele aus `PLAYTESTING.md` §4 (Heimwege ≤ 3 pro 30 Min, „Muss noch“ = Warnsignal, Einzug alle 20–60 Min).
4. Ergebnis kurz in `docs/game-design/` festhalten (z. B. als neue Datei `PLAYTEST_ERGEBNIS_<Datum>.md`) und die offenen Fragen Q2–Q8 aus dem Audit 2 beantworten.

## 8. Nach der Übergabe an Lina

Auch dann gilt: **kein Test, kein Beobachten, kein Druck.** Wenn Lina mag, kann sie später erzählen, was ihr gefallen hat. Eine Idee:
Nach zwei bis drei Wochen ganz beiläufig fragen: „Was machst du im Spiel am liebsten?“ und „Gibt es etwas, das dich nervt?“ – und das in die nächste Runde einarbeiten.
