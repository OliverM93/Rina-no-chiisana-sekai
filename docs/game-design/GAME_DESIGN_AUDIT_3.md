# Game Design Audit 3 – Optimierung, Balancing, Spielerlebnis

**Stand:** 10. November 2026 · **Geprüft:** `main` nach PR #98 · **Vorgänger:** [`GAME_DESIGN_AUDIT_2.md`](GAME_DESIGN_AUDIT_2.md) (nach PR #85)
**Grundlage:** Wissensbasis in `docs/game-design/`, Quellcode, Daten (Kennzahlen per Skript direkt aus `src/data/` berechnet),
Tests (72 Dateien / 381 Tests grün), Browser-Durchläufe der letzten Features.
**Während dieser Prüfung wurde nichts am Spiel geändert** (nur dieses Dokument und der Verweis im README).

Belastbarkeit: **[N]** Nachweis aus Code/Daten · **[V]** begründete Vermutung · **[P]** nur im Playtest prüfbar.
Status: ✅ implementiert · 🗓️ geplant · 💡 Empfehlung · ❓ offen.

**Selbstkritischer Hinweis:** Die Features seit Audit 2 (spontane Gespräche, Häuser von innen, Training, Snake, Winterinsekten,
Baumfällen, Bento/Käse …) stammen aus derselben Feder wie dieser Audit. Sie wurden auf ausdrücklichen Wunsch gebaut, aber
**entgegen der Empfehlung N1 (Feature-Pause bis zum Playtest)**. Ich habe deshalb genau dort nach Schwächen gesucht.
Wichtigste Einschränkung: Headless-Chromium läuft mit wenigen Bildern pro Sekunde – **Tempo und Gefühl sind darin nicht messbar.**

---

## 1. Kurzfazit

1. **Die Rahmenhandlung ist zu kurz – und sie wird fast nur von der Wartezeit getaktet, nicht vom Spielen [N].** Alle sechs
   Einzüge brauchen zusammen 9 Sammelbuch-Einträge, 2 500 ⭐ Verkäufe (≈ 30 Fänge), 1 Möbel, 2 Bastelstücke, 1 Gericht, 1 Check-up.
   Das schafft man in deutlich unter einer Stunde; den Rest füllen die 5 × 10 Minuten Wartezeit. **Der stärkste Motor des Spiels
   ist realistisch nach dem ersten Abend verbraucht** [V]. Für ein Geschenk, das von Vorfreude lebt, ist das der größte Hebel.
2. **Die Sternchen-Wirtschaft ist sauber, hat aber ein Ende [N]:** Alles einmal zu besitzen kostet **≈ 425 000 ⭐**. Danach haben
   Sternchen keinen Zweck mehr; das Sparbuch ist schon vorher bedeutungslos.
3. **Oli – die wichtigste Figur – hat die meisten Freundschaftsquellen [N]:** Bis zu ~126 Punkte am Tag; 5 Herzen (400) in
   **3–4 echten Tagen**. Seine Stufen-Szenen sind damit in der ersten Woche erzählt.
4. **Es fehlt ein Ort, an dem Lina nachlesen kann, „was gerade ansteht“ [N].** Hinweise kommen nur im Gespräch mit genau
   einem Bewohner. Wer den falschen fragt, tappt im Dunkeln [P].
5. **Kleine Bedienungs-Lücken [N]:** Enter bestätigt in Katalog, Werkbank und Taschenfenstern – aber nicht im Samenstand,
   in der Galerie, an der Dorfkasse und in der Truhe. Genau diese Uneinheitlichkeit hat Oli schon zweimal bemängelt.

**Was nicht das Problem ist:** zu wenig Inhalt. Mit 550 Gegenständen, 219 Möbeln, 68 Rezepten, 44 Tierarten, 16 Herzenswünschen
und 7 Bewohnern ist das Spiel für eine Spielerin außergewöhnlich reich. **Mehr Breite ist nicht die Antwort** – Tempo,
Orientierung und Feinschliff sind es.

## 2. Kennzahlen [N]

| Bereich | Wert |
|---|---|
| Gegenstände | 550 (davon 255 Möbel-Varianten, 42 Gerichte, 34 Samensorten, 32 Blumen) |
| Möbel | 219 Modelle: **125 im Katalog** (Summe **103 290 ⭐**, Median 520, max. 8 800) · 68 nur als Geschenk · 25 nur gebaut |
| Tapeten / Böden | 19 (13 300 ⭐) / 11 (8 050 ⭐) |
| Hausausbau | 9 800 → 89 800, zusammen **273 800 ⭐** |
| Herzenswünsche | 16, zusammen **8 020 ⭐** Sternchen-Anteil |
| Rezepte | 68 (32 Werkbank · 31 Küche · 5 Apotheke); 29 ab Start, 22 durch Funde, 3 Kochshow, 1 Wunsch, 13 sonstige |
| Arten | 17 Fische · 27 Insekten · 12 Funde |
| Plauderzeilen | Gisela 71 · Oli 46 · Olaf 36 · Jens 35 · Lars 35 · Thalia 34 · Christin 32 |
| Tasche / Truhe | 20 Plätze à 30 Stück / 60 Plätze |

**Erwartungswert je Fang** (gewichtet, ohne Regenarten): Fluss 40–93 ⭐, Meer 75–101 ⭐, Insekten tagsüber 51–73 ⭐,
nachts 86–171 ⭐, im Winter ~120 ⭐ (wenige, teure Arten).
**Angel-Zyklus:** 0,45 s Wurf + 2–5,5 s Warten + Biss + Einholen ≈ **6–8 s** → theoretisch 450–600 Fänge/h, mit Pausen,
ersten Fängen und Laufen eher **~150–300/h ≈ 12 000–25 000 ⭐/h** [V]. Mit 30er-Stapeln passt fast eine Stunde Angeln in die Tasche.

## 3. Status der Findings aus Audit 2

| # | Thema | Status |
|---|---|---|
| N1 | Feature-Pause bis Playtest | ❌ **nicht eingehalten** – seit Audit 2 kamen ~10 neue Inhalte/Kleinsysteme dazu (alle auf Wunsch). Der Playtest steht weiter aus. |
| N2 | Keine weiteren 1×/Tag-Dinge | 🔶 Das **Training** gibt Oli einmal täglich +4 – ein kleines neues „heute schon?“ (selbstkritisch, siehe A6). |
| N3 | Katalog unübersichtlich | 🔶 125 Modelle in 10 Stilen (+ Tapeten/Böden). Keine Suche. [P] |
| N4 | Dialog-Pools / Insider | 🔶 Spontane Gespräche zwischen Bewohnern bringen Abwechslung; echte Insider fehlen weiter. |
| N5 | Quellentreue-Ausnahmen | ✅ In `CLAUDE.md`/Prompt benannt („Verlorene Autobahn“ als einzige Ausnahme). |
| N6 | Balancing-Tests | ⬜ weiterhin nur punktuell (Fischgerichte, Wunsch-Sternchen). |
| N7/N8 | 3D-Smoke-Test, Interior-Signatur | unverändert, niedrig. |

---

## 4. Bewertung nach Bereichen

### 4.1 Sternchen-System & Ökonomie

| Thema | Befund |
|---|---|
| **Quellen** | Angeln dominiert (unbegrenzt, kein Geschick, ~85 ⭐/Fang). Nachts sind Insekten ertragreicher (bis 171 ⭐). Tägliches (Muscheln, Obst, Eier, Kiesel) bringt zusammen wenige Hundert ⭐ – als Ritual gedacht, gut so. [N] |
| **Senken** | Haus 273 800 · Katalog 103 290 · Tapeten/Böden 21 350 · Galerie 13 Bilder (18 800) · Wünsche 8 020 · Samen klein → **≈ 425 000 ⭐** [N] |
| **Dauer bis „alles gekauft“** | ~17–35 Stunden reines Angeln, gemischt gespielt **mehrere Wochen bis Monate** [V]. Der Hausausbau ist der längste Strang – das ist gut. |
| **Danach** | Sternchen ohne Zweck. Verkaufen und damit Angeln verlieren den äußeren Sinn; es bleibt Sammelbuch und Entspannung. [N/V] |
| **Sparbuch** | 1 %/Monat, max. 2 000. Bei 50 000 ⭐ Guthaben: 500 ⭐/Monat ≈ **6 Fänge**. Das System ist Charakter-Inhalt (Olaf, Kontoauszug), wirtschaftlich bedeutungslos. [N] |
| **Kredit** | „Erst bauen, dann zahlen“ funktioniert; zinslos und ohne Frist. Stark. [N] |
| **Arbitrage** | Keine: Möbel ¼, Vasen wertneutral, Samen × 2,5. [N] |
| **Küchen-Margen** | Ziel 1,5–3×. **Sechs Ausreißer über 3,5×:** Bratapfel 6,3×, Crêpes 5,8×, Lavendelkekse 4,5×, Apfelpfannkuchen 4,4×, Kräutermischung 4,3×, Zimtsterne 4,0×. Fischgerichte liegen bei 1,6–1,8×. [N] |
| **Bedeutung der Ausreißer** | **Wirtschaftlich unerheblich:** Ein Crêpe-Kochen bringt +248 ⭐ – so viel wie drei Fänge. Kochen ist keine Geldquelle, sondern Geschenk-, Wunsch- und Lieblingsbeschäftigung (Lina kocht gern). Die Leitlinie ist strenger als nötig. [N/V] |

**Urteil:** Gesund für die ersten Wochen. Das Spätspiel-Problem (Sternchen ohne Zweck) ist **real, aber erst nach vielen
Stunden spürbar** – ob es Lina stört, ist [P]. Viele Cozy-Spielerinnen genießen „genug Geld“ als Freiheit.

### 4.2 Fortschritt & Pacing

| Phase | Was trägt | Befund |
|---|---|---|
| **Ankommen → Thalia** | 6 Einzüge | **Zu schnell [N/V]:** Bedingungen sind klein, die Mindestdauer wird von 5 × 10 Min Wartezeit bestimmt. Realistisch **1–1,5 h**. Jeder Einzug führt sauber in ein System ein (stark), aber es bleibt kaum Zeit, ein System zu genießen, bevor das nächste kommt. |
| **Erste Tage** | Herzenswünsche, Herzen, Hausausbau, Sammelbuch | Gut gefüllt. Wünsche brauchen Saisonblumen, Fossilien, Glitzerstein (12 % je Felsen/Tag) → natürlich über Tage gestreckt. [N] |
| **Wochen** | Hausausbau, Einrichten, Kreuzungen, Oli-Jahrestage | Trägt [V]. |
| **Monate** | Jahreszeiten, Feste, Saisonarten, Geburtstage | Stark – vollständiges Sammelbuch braucht ein echtes Jahr. [N] |
| **Danach** | Wiederholung des Jahres | Routine-Risiko wie in Audit 1/2 [V]. |

**Oli-Tempo [N]:** Täglich möglich: Gespräch 8 · Geschenk 30 · Picknick 24 · Sterne 24 · Kaffee 8–24 · TV 10 · Herzbank 8 ·
Küsschen 6 · Training 4 ≈ **bis 126 Punkte**. Start mit 40 (Einzug) → **5 Herzen nach 3–4 Tagen**, wenn Lina die Momente mit
ihm genießt (was gewollt ist). Die fünf Stufen-Szenen sind damit nach etwa einer Woche gesehen; danach tragen nur noch
Jahrestage und Alltag.

### 4.3 Loops & Mechaniken (Kurzurteil)

| System | Tiefe | Urteil |
|---|---|---|
| Angeln / Kescher | gering, bewusst entspannt | ✅ trägt; Fänge haben jetzt Verwendung (Gerichte, Schaukästen, Wünsche) |
| Muscheln, Felsen, Graben, Obst, Eier | Ritual | ✅ angesammelt statt verfallend (D19) |
| Garten & Kreuzungen | hoch | ✅ einziges echtes Planungssystem; stark |
| Werkbank / Binden / Küche / Apotheke | mittel | ✅ gut verknüpft; Enter-Bedienung jetzt da |
| Einrichten | hoch | ✅ stärkster Selbstzweck; Katalog wird groß (N3) [P] |
| Bewohner, Treffen, Gespräche | hoch | ✅ Kernstück; spontane Gespräche machen das Dorf lebendig |
| Herzenswünsche | mittel | ✅ gute Spätspiel-Klammer; Sternchen-Anteil klein (8 k) |
| Häuser von innen | gering | ✅ Atmosphäre und Neugier, ohne Pflicht |
| Training, Snake | gering, isoliert | 🔶 bewusst Gag/Spielerei; Snake hat keinen gespeicherten Rekord, Training ein kleines 1×/Tag (A6) |
| Sparbuch | keine | 🔶 Charakter-Inhalt, keine Mechanik (s. 4.1) |

### 4.4 Bewohner & Beziehungen

- ✅ Warm, liebevoll, mit Eigenheiten; keine erfundene Vorgeschichte über echte Personen (Teddy/Foto-Briefe wurden ersetzt). [N]
- ✅ Jedes Herz bringt etwas; Oli hat Stufen, Jahrestage, Wünsche.
- 🔶 Oli ist am schnellsten „fertig“ (4.2). Bei den anderen dauert der Weg zu 5 Herzen 11–50 Tage – angemessen.
- 🔶 Insider (Q7) fehlen weiter; sie wären wirksamer als jede neue Zeile von mir. [V]

### 4.5 Designsäulen & Psychologie

Keine Verstöße gefunden [N]: kein Scheitern (auch Snake endet freundlich), kein Verlust, keine Streaks, kein FOMO (alles
Saisonale kehrt wieder), keine Strafe fürs Pausieren. **Grenzfälle:** wöchentliche Termine (Party Sa 19–22, Sonntagsessen
So 18–20) sind nur zu festen Zeiten erlebbar – wiederkehrend und damit kein FOMO, aber für eine Tagesspielerin ggf. selten [P].
Die Summe der 1×/Tag-Dinge liegt jetzt bei rund 20 [V].

### 4.6 Bedienung & Lesbarkeit

| Reibung | Beleg |
|---|---|
| **Enter fehlt** im Samenstand, in der Galerie, an der Dorfkasse, in der Truhe, im Briefkasten | [N] (Tastatur-Code je Fenster geprüft) |
| **Kein Überblick, was ansteht** (nächster Einzug, offene Wünsche, Hausausbau) | [N] – nur Gesprächshinweise eines bestimmten Bewohners |
| Katalog mit 125 Modellen ohne Suche/Favoriten | [N], Wirkung [P] |
| Viele Fenster, verschiedene Bedienmuster (Pfeiltasten mal ja, mal nein) | [V] |

### 4.7 Lücken & Chancen

- **Fehlt fürs „persönlich & überraschend“:** echte Insider (Q7), Omas Geburtstag (Datum fehlt), ein Ort für Erinnerungen
  (Tagebuch/Notizbuch, 🗓️ E1).
- **Könnte gestrafft werden:** nichts muss raus. Wenn überhaupt, ließe sich das Sparbuch als reines Charakter-Element
  belassen, statt es weiter auszubauen. Weitere Stile und Kleinsysteme sollten pausieren (N1/N3).

---

## 5. Findings – priorisiert

### 🟠 Hoch

**A1 · Rahmenhandlung zu schnell, getaktet von Wartezeit statt Erleben [N, Wirkung P]**
- *Mechanik:* `data/progress.ts` – sehr kleine Bedingungen; `WAIT_SECONDS` = 10 Min.
- *Auswirkung:* Lina erlebt alle Einzüge an einem Abend; neue Systeme stapeln sich, ohne dass eines Zeit hat, vertraut zu werden. Vorfreude auf „wer kommt als Nächstes?“ trägt nur Minuten.
- *Empfehlung:* Bedingungen moderat erhöhen und auf **Erleben** statt Grinden ausrichten (siehe M2). Keine Kalendertage (D2 bleibt).
- *Nebenwirkung:* Zu viel → Grind. Grenze: jede Bedingung muss in normalem Spiel nebenbei passieren.
- *Playtest:* Uhrzeit bei jedem Einzug notieren (Bogen, Abschnitt Rahmenhandlung).

**A2 · Orientierung: Lina sieht nirgends, was gerade ansteht [N, Wirkung P]**
- *Auswirkung:* Wer den Hinweisgeber nicht anspricht, weiß nicht, warum niemand einzieht oder welcher Wunsch was braucht.
- *Empfehlung:* kleines **Notizbuch** im Menü mit Hinweisen in Bewohner-Stimme (keine Häkchen, keine Prozente) – siehe M1.

### 🟡 Mittel

**A3 · Oli-Herzen in 3–4 Tagen voll [N]** – Stufen-Szenen schnell verbraucht. Empfehlung: Punkte für Date-Momente moderat senken (M3) – [P], ob es überhaupt stört.

**A4 · Sternchen ohne Zweck nach ~425 k [N/V]** – erst nach vielen Stunden relevant. Empfehlung: **nach dem Playtest** entscheiden; wenn ja, Dorf-Verschönerungen an der Dorfkasse (G1).

**A5 · Enter-Bestätigung uneinheitlich [N]** – Empfehlung: überall dort, wo es einen Hauptknopf gibt (K1).
  *Korrektur bei der Umsetzung:* Überall gibt es schon Pfeiltasten-Navigation mit Enter auf dem fokussierten Knopf (`ui/navigation.ts`) – im Samenstand reicht das. Es fehlte nur die Abkürzung „Enter ohne Fokus = Hauptknopf“ in Galerie und Briefkasten. Die Code-Suche nach `'Enter'` je Fenster hat das übersehen.

### 🟢 Niedrig

**A6 · Training als neues 1×/Tag [N]** – +4 Oli-Punkte einmal täglich; widerspricht N2 leicht. Empfehlung: Punkte streichen, Olis Begeisterung bleibt (K2).
**A7 · Snake ohne gespeicherten Rekord [N]** – Stolz auf den Rekord geht beim Neuladen verloren (K3).
**A8 · Leitlinie vs. Küchen-Ausreißer [N]** – Leitlinie anpassen statt Preise senken (K4).
**A9 · Ökonomie-Doku veraltet [N]** – Zahlen in `GAME_ECONOMY.md` (106 Katalogmodelle, 54 Rezepte, 24 Insekten) aktualisieren (K4).
**A10 · Keine automatischen Balancing-Spannen [N]** – Test für Margen/Preisspannen (K5).

## 6. Was gut ist – bitte nicht „wegoptimieren“ [N]

- **Kredit vor dem Sparen** und **kein Verlust** irgendwo – das Herz des Cozy-Gefühls.
- **Einzüge als Onboarding:** jeder bringt genau ein neues System.
- **Garten & Kreuzungen** als einziges echtes Planungssystem.
- **Bewohner mit Alltag** (Treffen, spontane Gespräche, Häuser von innen) – Säule 5 ist sichtbar erfüllt.
- **Jahreszyklus** als natürliches Langzeit-Pacing.
- **Angeln ohne Geschick** – Entspannung ist hier Absicht (O9).
- **Lebensmittel-Ausreißer** sind harmlos und machen Kochen (Linas echtes Hobby) belohnend.

---

## 7. Priorisierte Liste (Wirkung × Aufwand × Risiko)

| # | Maßnahme | Wirkung | Aufwand | Risiko | Wann |
|---|---|---|---|---|---|
| K1 | Enter überall, wo es einen Hauptknopf gibt | ●● | ● | ● | sofort |
| M1 | Notizbuch „Was gerade ansteht“ (Einzug, Wünsche, Ausbau) | ●●● | ●● | ● | sofort |
| M2 | Rahmenhandlung über Erleben strecken | ●●● | ● | ●● | ❓ Entscheidung |
| M3 | Oli-Punkte für Date-Momente moderat senken | ●● | ● | ●● | ❓ Entscheidung |
| K2 | Training ohne Freundschaftspunkte | ● | ● | ● | sofort |
| K3 | Snake-Rekord speichern | ● | ● | ● | sofort |
| K4 | Leitlinie & Ökonomie-Doku aktualisieren | ● | ● | ● | sofort |
| K5 | Balancing-Spannen als Test | ● | ● | ● | sofort |
| G1 | Dorf-Verschönerungen als Spätspiel-Senke | ●● | ●●● | ●● | nach Playtest |
| G2 | Tagebuch schöner Momente (E1) | ●● | ●● | ● | nach Playtest |
| – | **Playtest nach `PLAYTEST_BOGEN.md`** | ●●● | ●● | – | **vor G1/G2** |

---

## 8. Maßnahmen im Detail (Phase 2)

### Kleine, risikoarme Änderungen

**K1 · Enter einheitlich** – Samenstand (kaufen), Galerie (kaufen/stiften), Dorfkasse (Hauptaktion), Truhe (einlagern), Briefkasten (weiter).
Problem A5 · Wirkung: weniger Reibung, erfüllt Olis wiederholten Wunsch · Dateien: `ui/SeedStandPanel.tsx`, `GalleryPanel.tsx`, `BankPanel.tsx`, `StoragePanel.tsx`, `MailPanel.tsx`.
Keine neue Mechanik → keine Designprüfung nötig.

**K2 · Training ohne +4 Oli-Punkte** – Problem A6 · Olis Begeisterung und Dialog bleiben, nur die Punkte entfallen. Datei: `world3d/World3D.ts` (trainLina), Doku.
Designprüfung (kurz): 1 Gag-Moment ohne Abholcharakter · 2 Mikro-Loop, kein Tagesloop · 5 −4 Oli-Punkte/Tag · 6 keine · 7 stärkt Säule 2 · 8 einfacher geht es nicht.

**K3 · Snake-Rekord speichern** – Problem A7 · Rekord in `world.dates` (String, kein neues Format → **kein** `SAVE_VERSION`-Wechsel) · Dateien: `ui/MiniGamePanel.tsx`, kleine Hilfsfunktion + Test.
Designprüfung: 1 Stolz auf den eigenen Rekord · 2 Mikro · 4 kleiner Selbstvergleich ohne Druck · 5 keine · 6 keiner · 7 Säule 3 (etwas, das bleibt) · 8 ja, das ist die einfachste.

**K4 · Doku auf den Stand bringen** – Leitlinie Küche: „Ausreißer bis ~6× erlaubt, wenn Zutaten saisonal/begrenzt; Kochen ist keine Geldquelle“; Zahlen in `GAME_ECONOMY.md`/`PROGRESSION.md` aktualisieren. Keine Preisänderung.

**K5 · Balancing-Test** – prüft: Küchen-Marge 1,3–6,5×, Katalogpreise 50–9 000, Fisch-/Insektenpreis fällt mit steigendem Gewicht nicht aus dem Rahmen, Wunsch-Sternchen ≤ 5 000. Datei: neuer Test in `src/data/`.

### Mittlere Eingriffe

**M1 · Notizbuch „Was gerade ansteht“** (Menü → 📓, auch Taste N)
- Inhalt: (1) aktueller Einzug: die bereits vorhandenen Hinweistexte des Hinweisgebers, als „Oma meinte neulich: …“ – nur für **fehlende** Bedingungen, ohne Zahlen/Prozente; (2) erzählte, offene Herzenswünsche mit Bedarf; (3) Hausausbau: aktuelle Stufe, Restkredit oder nächste Stufe.
- Problem A2 · Wirkung: Orientierung ohne Aufgabenliste · Aufwand: ein Fenster, Daten vorhanden · Risiko: Quest-Log-Gefühl → bewusst in Bewohner-Stimme, keine Häkchen.
- Dateien: `ui/NotebookPanel.tsx` (neu), `ui/Menu.tsx`, `game/session.ts` (Panel-Typ), `game/story.ts`/`progress.ts` (Hinweis-Abfrage), Test.
- Designprüfung: 1 „Ah, ich weiß, was als Nächstes schön wäre“ · 2 Meta-Loop (Einzüge, Wünsche, Ausbau) · 3 Nachschlagen statt Herumfragen · 4 weniger Frust bei längeren Pausen (Wiedereinstieg!) · 5 keine · 6 könnte als Pflichtliste gelesen werden → Ton beachten · 7 Säule 2 (lockt, drängt nicht) · 8 Alternative: Hinweise von *allen* Bewohnern statt einem – erreicht aber Wiedereinstieg nach Pause nicht.

**M2 · Rahmenhandlung über Erleben strecken** (Zahlen alt → neu, nur Bedingungen ohne Tageslimit, damit D2 gilt)

| Einzug | heute | Vorschlag | Was es Lina zeigt |
|---|---|---|---|
| Olaf & Christin | 3 Sammelbuch, 200 ⭐, Winston | unverändert | Einstieg bleibt schnell |
| Oli | 1 Möbel | unverändert | „sobald es gemütlich ist“ bleibt süß |
| Jens | 2 gebaut, 6 Sammelbuch | **3 gebaut, 8 Sammelbuch** | Werkbank etwas länger kennenlernen |
| Lars | 1 gekocht, 2 500 ⭐ | **3 gekocht, 5 000 ⭐** | Küche genießen, bevor die Apotheke kommt |
| Thalia | Check-up, 9 Sammelbuch | **Check-up, 14 Sammelbuch, 1. Hausausbau bestellt** | führt in die Dorfkasse ein (Kredit, kein Geld nötig) |

- Wirkung [V]: Story ~2–3 h statt ~1–1,5 h, verteilt auf eher zwei bis drei Abende; jedes System bekommt Zeit.
- Risiko: zu langsam für eine Spielerin, die die Familie schnell beisammen haben will [P]. Hinweistexte für neue Bedingungen (Hausausbau) nötig.
- Dateien: `data/progress.ts`, `core/progress.ts` (Bedingung „Hausstufe“ via Flag), `game/playthrough.test.ts`, Doku. Kein Spielstand-Formatwechsel (Bedingungen werden nur neu geprüft; ein bereits erfüllter Einzug bleibt erfüllt).
- Designprüfung: 1 Vorfreude über mehrere Abende · 2 Meta-Loop · 3 Lina vertieft jedes neue System, bevor das nächste kommt · 4 die Ankunft der Liebsten verteilt sich, statt an einem Abend zu verpuffen · 5 +2 500 ⭐ Verkaufsziel, +1 Kredit früh · 6 Gefühl „ich muss noch X Arten finden“ – Hinweise bleiben sanft · 7 Säule 2 & 5 · 8 einfacher: nur `WAIT_SECONDS` erhöhen – **schlechter**, weil Warten statt Erleben.

**M3 · Oli-Tempo** (alt → neu): Picknick 24 → **16**, Sterne gucken 24 → **16**, Fernsehen 10 → **6**; Rest bleibt.
- Tagesmaximum ~126 → ~106 → 5 Herzen nach etwa **4–5 statt 3–4 Tagen**. Bewusst nur moderat.
- Wirkung [V]: Stufen-Szenen etwas verteilter. Ehrlich: Der Effekt ist klein; der eigentliche Hebel wäre, Szenen an Jahrestage/Momente statt an Herzen zu koppeln (größerer Umbau, nicht empfohlen vor dem Playtest).
- Risiko: „Weggenommen“-Gefühl gering, da Lina noch nicht spielt. Dateien: `game/romance.ts`, `game/tv.ts`, Tests, Doku.
- Designprüfung: 1 Beziehung wächst spürbar über die erste Woche · 2 Tages-/Wochenloop · 5 −20 Oli-Punkte/Tag · 6 keine · 7 Säule 1 · 8 einfacher: nichts tun – vertretbar, solange unklar ist, ob es stört.

### Größere Eingriffe – erst nach dem Playtest

**G1 · Dorf-Verschönerungen an der Dorfkasse** – etwa 8 Projekte (5 000–40 000 ⭐: Lichterketten am Platz, Blumenkübel, Pavillon, Bootssteg …), jedes verändert das Dorf sichtbar, mit kleiner Danke-Szene. Gibt Sternchen im Spätspiel Sinn (A4).
Risiko: Grind-Druck, neue Modelle, Pflege. **Nur bauen, wenn der Playtest zeigt, dass Sternchen „leer“ wirken.**

**G2 · Tagebuch schöner Momente** (E1) – sammelt automatisch Einzüge, erste Fänge seltener Arten, Szenen, Fotos. Lässt sich später mit M1 verbinden.

### Nicht empfohlen

| Idee | Warum nicht |
|---|---|
| Angelpreise senken | nimmt weg, ohne Not; Angeln ist bewusst die entspannte Haupttätigkeit |
| Angeln mit Geschick (O9) | widerspricht der Entspannung |
| Küchenpreise senken | wirtschaftlich unerheblich, Kochen soll sich gut anfühlen |
| Sparbuch-Zinsen erhöhen | würde den Sternchen-Überfluss nur beschleunigen |
| Mehr Taschenplätze | 20 × 30 + Truhe reichen [N] |
| Wartezeit vor Einzügen verlängern | Warten statt Erleben (siehe M2) |
| Weitere Stile, Kleinsysteme, Tages-Dinge vor dem Playtest | N1/N2/N3 |
| Tagesziele, Streaks, Fortschrittsbalken | Säule 2 / Anti-Manipulation |

---

*Auch dieser Audit ersetzt den Playtest nicht. Er zeigt aber mit Zahlen, wo ein Playtest zuerst hinschauen sollte: Tempo der Einzüge, Orientierung und Olis erste Woche.*

## 9. Entscheidung (Oli, 10. Nov. 2026)

| Maßnahme | Entscheidung |
|---|---|
| K1 Enter überall · K2 Training ohne Punkte · K3 Snake-Rekord · K4 Doku · K5 Balancing-Test | ✅ freigegeben |
| M1 Notizbuch „Was gerade ansteht“ | ✅ freigegeben |
| M2 Rahmenhandlung strecken (wie vorgeschlagen) | ✅ freigegeben |
| M3 Oli-Tempo | ⏸️ zurückgestellt bis zum Playtest |
| G1 Dorf-Verschönerungen · G2 Tagebuch | ⏸️ erst nach dem Playtest |
