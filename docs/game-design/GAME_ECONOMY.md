# Spielökonomie

Eine Währung: **Sternchen ⭐** (`data/items.ts`, `CURRENCY`). Dazu Materialien (Äste, Steine, Blumen, Ernte …)
und Freundschaft als „weiche Währung“. Alle Zahlen hier stammen aus den Daten (Stand 13. Nov. 2026, nachgerechnet im Audit 4).

## Grundregeln ✅

- **Verkaufspreis = `price` des Gegenstands** (Verkaufskiste vor dem Haus, `game/gameplay.ts → sellSlots`).
- **Möbel, Tapeten, Böden** verkaufen sich für **¼ des Katalogpreises** (`items.ts`) → Kaufen & Weiterverkaufen
  lohnt nie (kein Arbitrage-Exploit).
- **Erinnerungsstücke** (Werkzeuge, einmalige Geschenke) sind unverkäuflich und kommen zurück, falls sie fehlen.
- **Samen am Samenstand:** Verkaufswert × 2,5, mindestens 12 ⭐ (`data/seedstand.ts`). Misch-Farben nie käuflich.
- **Kredit** für den Hausausbau: zinslos, ohne Frist, nächster Ausbau erst nach Rückzahlung.
- **Sparbuch:** 5 % jeden Montag, max. 2 500 ⭐/Woche, bis zu 26 verpasste Wochen werden nachgeholt (bis Nov. 2026: 1 %/Monat, max. 2 000).
  📏 *Einordnung:* 20 000 ⭐ Guthaben → 1 000 ⭐/Woche; die Obergrenze (2 500/Woche, ab 50 000 Guthaben) entspricht grob
  **einer halben bis dreiviertel Stunde gemütlichem Spielen**. Spürbar, aber Fangen bleibt die Hauptquelle. Nach langer Pause
  (max. 26 Wochen nachgeholt) kann es einen schönen Batzen geben (≤ 65 000) – gewollt als Willkommensgeschenk, nicht als Pflicht.
- **Olafs Bausparen:** Ausbau direkt vom Sparbuch bezahlen → Papa übernimmt 15 % (einmal je Stufe, kein Exploit, weil nur beim Bestellen).
- **Fänge × 1,5:** Fische und Insekten verkaufen sich seit Nov. 2026 für das 1,5-Fache ihres Grundwerts (`CATCH_PRICE_FACTOR` in `data/species.ts`); Fischgerichte entsprechend teurer (Marge wieder ≈ 1,6×).

## Quellen (Faucets)

| Quelle | Grenze | Wert (📏) |
|---|---|---|
| **Angeln** (17 Arten) | unbegrenzt | Ø ≈ 125–155 ⭐ je Fang (📏 gewichtet, je nach Monat; Audit 3 hatte 83–104 vor dem ×1,5); 30–1 800 ⭐ |
| **Insekten** (27 Arten) | unbegrenzt, aber man muss sie finden | Ø 51–73 ⭐ je Fang tagsüber, 86–171 ⭐ nachts; Winter wenige, teure Arten (~120 ⭐) |
| Muscheln & Seesterne | 7 Funde/Tag | 12–60 ⭐ |
| Felsen | 1×/Tag je Felsen | Kiesel 4 ⭐, Glitzerstein 120 ⭐ (12 %) |
| Obstbäume | wächst nach 3 Tagen nach | 10–12 ⭐ |
| Grabstellen (Thalia) | 4/Tag | Fossilien & Kristalle |
| Eier | Hühner 2–3, Wachteln 3–4 je Tag | 20 / 14 ⭐ |
| Beet (Blumen, Gemüse, Kräuter) | Plätze & 1 Stufe/Tag | Blumen 22–40 ⭐, Gemüse 10–45 ⭐ × Ertrag |
| Kochen / Tees / Binden | Zutaten | siehe Margen |
| Sparbuch-Zinsen | 5 %/Woche, max. 2 500 ⭐/Woche | ab 20 000 ⭐ Guthaben ≈ 1 000 ⭐/Woche (siehe Einordnung oben) |
| Briefe, Feste, Daily Treats | Ereignisse | Gegenstände, selten Sternchen |

📏 **Grobe Stundenleistung beim Angeln:** Zyklus aus Auswerfen, 2–5,5 s Warten, Einholen und Laufen ≈ 10–15 s
→ etwa 250–350 Fänge/h theoretisch. Mit Wegen zur Verkaufskiste (20 Taschenplätze, 10er-Stapel)
realistisch **~10–15 k ⭐/h vor dem ×1,5, jetzt eher ~15–25 k ⭐/h** (📏). **Im Playtest messen!**

## Senken (Sinks)

| Senke | Umfang |
|---|---|
| **Hausausbau** | 200 800 ⭐ für alle 6 Stufen (9 800 → 59 800), mit Bausparen ≈ 171 k |
| **Möbelkatalog** (alle Stile frei, mit Winterware) | **281 Einträge, zusammen ≈ 255 000 ⭐** (Möbel 138 · 142 570, Tapeten 46 · 28 250, Böden 39 · 33 400, Garten 20 · 17 460, Lieblinge 19 · 20 530, Winter 9 · 8 730, Pflanzen 10 · 4 040); Möbel-Median 850, max. 2 600. Davon sind 201 Einträge (≈ 176 000 ⭐) schon ohne Einzug sichtbar |
| Galerie | 13 Bilder, zusammen 18 800 ⭐ (900–2 200 je Bild, 1 Angebot/Tag) |
| Kaffeemaschinen | 650 / 3 200 / 8 800 |
| Gewächshaus / Frühbeet | 4 200 / 1 800 |
| Samen | 12–20 ⭐ je Tüte |
| Herzenswünsche ✅ | Materialien + ≈ 8 000 ⭐ Sternchen-Anteil (Olafs Steg 3 000, Thalias Aussichtspunkt 2 000 …) |
| Saisonware (Winter, Saison-Tassen) | wiederkehrend |

**Gesamtbedarf** für „alles einmal besitzen“: **≈ 483 k ⭐** (Katalog 255 k + Hausausbau 200,8 k + Galerie 18,8 k + Wünsche ≈ 8 k; Audit 3: 425 k bei halb so großem Katalog).
📏 Das sind ≈ 3 800 Fänge à ~128 ⭐, also **≈ 12–25 Stunden reines Angeln** (Audit 3: 17–35 h); gemütlich gemischt ein Mehrfaches.
Der Katalog soll nicht unbemerkt weiter wachsen: siehe **Katalog-Budget** in `BALANCING_GUIDELINES.md` und `game/catalogBudget.test.ts`.

## Verarbeitungs-Margen (Ergebnis-Wert ÷ Zutaten-Wert)

| Station | Spanne | Auffällig |
|---|---|---|
| Küche (31, davon 9 Fischgerichte ≈ 1,6×) | 1,6 – 6,3× | über 3,5×: Bratapfel 6,3×, Crêpes 5,8×, Lavendelkekse 4,5×, Apfelpfannkuchen 4,4×, Zimtsterne 4,0× – unkritisch, weil Zutaten begrenzt und Kochen keine Geldquelle ist |
| Apotheke (5) | 1,5 – 4,3× | Kräutermischung 4,3× (Kräuter-Ernte, begrenzt) |
| Werkbank-Möbel | 0,8 – 3,2× | Möbelwert zählt nur ¼ → Verkaufen lohnt nicht; sie sind **Deko**, keine Einnahme |
| Sträuße | 1,2 – 1,8× | Schwarz-Strauß 700 ⭐ (seltene Mischfarbe) |
| Vasen | **1,0×** | bewusst wertneutral: Deko, keine Geldquelle |
| Kränze | 1,4 – 4,2× | `kranz-wiese` 4,2× (Wildblumen + Äste) – wird als Möbel aber nur zu ¼ verkauft |

**Bewertung**
- ✅ Veredeln lohnt sich immer etwas (≥ 1,3× bei Essen), aber nicht absurd – Kochen ist eine *attraktive
  Alternative* zum Rohverkauf, kein Muss.
- ✅ Deko-Crafting ist bewusst kein Geldautomat (¼-Regel).
- 💡 `bratapfel` (15 ⭐ Zutaten → 95 ⭐) ist ein kleiner Ausreißer. Da saisonal und durch Äpfel begrenzt,
  **unkritisch** – nur beobachten.

## Gemüse-Bilanz (Samen kaufen → ernten → verkaufen)

| Pflanze | Samen | Ertrag × Wert | Bilanz | Nachwachsend |
|---|---|---|---|---|
| Tomate | 15 | 2–3 × 18 | +21…+39, dann jede Ernte | ja |
| Kartoffel | 12 | 3–4 × 10 | +18…+28 | nein |
| Karotte | 12 | 2–3 × 12 | +12…+24 | nein |
| Salat | 12 | 1 × 14 | **+2** | nein |
| Zucchini | 15 | 1–2 × 20 | +5…+25, dann jede Ernte | ja |
| Kürbis | 20 | 1 × 45 | +25 | nein |
| Kräuter | 12–13 | 2–3 × 14–16 | +16…+35, dann jede Ernte | ja |

✅ Gemüse ist bewusst **kein Geldsystem**, sondern Zutaten-Lieferant für die Küche. Salat lohnt sich nur als
Zutat (gemischter Salat). Das passt zur Absicht.

## Analyse

**Stärken**
- Eine einzige, verständliche Währung, transparente Preise.
- Keine Arbitrage (¼-Regel), keine Verluste (Kredit zinslos, nichts verdirbt).
- Kredit-Mechanik dreht Animal Crossings Schulden-Druck ins Positive: erst genießen, dann in Ruhe zahlen.

**Schwächen / Risiken**
1. **Angeln dominiert die Einnahmen** (unbegrenzt, kein Geschick, höchster Erwartungswert). Für ein Cozy Game
   akzeptabel, solange niemand optimieren *muss*. Wird problematisch, sobald große Sternchen-Ziele dazukommen.
2. **Spätspiel-Entwertung:** Nach Hausausbau und Katalog haben Sternchen kaum noch Zweck → das Verkaufen und
   damit Angeln/Fangen verliert seinen extrinsischen Sinn.
3. **Viele Tagesquellen sind wertmäßig klein** (Muscheln, Obst, Eier, Kiesel). Sie sind als *Ritual* gedacht,
   nicht als Einkommen – das sollte so bleiben, sie dürfen nur nicht zur Pflichtrunde werden.
4. ~~Insekten/Fische haben fast keine Verwendung~~ – seit W6 gibt es 9 Fischgerichte und Schaukästen (Vitrine, Insektenkasten, Fischtafel); Insekten gehen weiter fast nur in den Verkauf.
5. **Inhaltswellen vergrößern die Senken, nicht das Einkommen** (Audit 4, A3): Der Katalog wuchs seit Audit 3 von ≈ 125 k auf ≈ 255 k ⭐. Gegenmittel: Katalog-Budget (Leitlinie + Test).

## Empfehlungen 💡

- **Spätspiel-Senken mit Bedeutung statt Zahlen:** z. B. Dorf-Projekte (Brunnen verschönern, Steg am Fluss,
  Pavillon für die Party), die Lina *mitfinanziert* und die das Dorf sichtbar verändern. Verbindet Geld mit
  Säule 3/5.
- **Fänge mit mehr Verwendung:** einige weitere Fisch-Rezepte (Bistro), Thalias Wunsch nach bestimmten Funden,
  eine Ausstellungsvitrine. Ziel ist *Systemtiefe*, nicht höhere Preise.
- **Keine Preiserhöhung beim Angeln nötig** – eher bei Bedarf Insekten leicht aufwerten, falls der Playtest
  zeigt, dass Kescher-Gänge sich „nicht lohnen“.
