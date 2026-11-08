# Spielökonomie

Eine Währung: **Sternchen ⭐** (`data/items.ts`, `CURRENCY`). Dazu Materialien (Äste, Steine, Blumen, Ernte …)
und Freundschaft als „weiche Währung“. Alle Zahlen hier stammen aus den Daten (Stand Nov. 2026).

## Grundregeln ✅

- **Verkaufspreis = `price` des Gegenstands** (Verkaufskiste vor dem Haus, `game/gameplay.ts → sellSlots`).
- **Möbel, Tapeten, Böden** verkaufen sich für **¼ des Katalogpreises** (`items.ts`) → Kaufen & Weiterverkaufen
  lohnt nie (kein Arbitrage-Exploit).
- **Erinnerungsstücke** (Werkzeuge, einmalige Geschenke) sind unverkäuflich und kommen zurück, falls sie fehlen.
- **Samen am Samenstand:** Verkaufswert × 2,5, mindestens 12 ⭐ (`data/seedstand.ts`). Misch-Farben nie käuflich.
- **Kredit** für den Hausausbau: zinslos, ohne Frist, nächster Ausbau erst nach Rückzahlung.
- **Sparbuch:** 1 %/Monat, max. 2 000 ⭐/Monat, bis zu 12 verpasste Monate werden nachgeholt.

## Quellen (Faucets)

| Quelle | Grenze | Wert (📏) |
|---|---|---|
| **Angeln** (17 Arten) | unbegrenzt | Ø 83–104 ⭐ je Fang (gewichtet, je nach Monat); 15–1 200 ⭐ |
| **Insekten** (24 Arten) | unbegrenzt, aber man muss sie finden | Ø 57–120 ⭐ je Fang; Winter wenige, teure Arten |
| Muscheln & Seesterne | 7 Funde/Tag | 12–60 ⭐ |
| Felsen | 1×/Tag je Felsen | Kiesel 4 ⭐, Glitzerstein 120 ⭐ (12 %) |
| Obstbäume | wächst nach 3 Tagen nach | 10–12 ⭐ |
| Grabstellen (Thalia) | 4/Tag | Fossilien & Kristalle |
| Eier | Hühner 2–3, Wachteln 3–4 je Tag | 20 / 14 ⭐ |
| Beet (Blumen, Gemüse, Kräuter) | Plätze & 1 Stufe/Tag | Blumen 22–40 ⭐, Gemüse 10–45 ⭐ × Ertrag |
| Kochen / Tees / Binden | Zutaten | siehe Margen |
| Sparbuch-Zinsen | 2 000 ⭐/Monat | vernachlässigbar bis ~200 k Guthaben |
| Briefe, Feste, Daily Treats | Ereignisse | Gegenstände, selten Sternchen |

📏 **Grobe Stundenleistung beim Angeln:** Zyklus aus Auswerfen, 2–5,5 s Warten, Einholen und Laufen ≈ 10–15 s
→ etwa 250–350 Fänge/h theoretisch. Mit Wegen zur Verkaufskiste (20 Taschenplätze, 10er-Stapel)
realistisch **~10–15 k ⭐/h**. **Im Playtest messen!**

## Senken (Sinks)

| Senke | Umfang |
|---|---|
| **Hausausbau** | 273 800 ⭐ für alle 6 Stufen (9 800 → 89 800) |
| **Möbelkatalog** | ~106 Modelle, zusammen ≈ 90 600 ⭐ (Median 600, 25 %: 300, 75 %: 900, max. 8 800) |
| Kaffeemaschinen | 650 / 3 200 / 8 800 |
| Gewächshaus / Frühbeet | 4 200 / 1 800 |
| Galerie | 900–2 200 je Bild, 1 Angebot/Tag |
| Samen | 12–20 ⭐ je Tüte |
| Saisonware (Winter, Saison-Tassen) | wiederkehrend |

**Gesamtbedarf** für „alles einmal besitzen“: grob **~380 k ⭐**. Danach gibt es kaum noch Senken außer Samen
und Galerie.

## Verarbeitungs-Margen (Ergebnis-Wert ÷ Zutaten-Wert)

| Station | Spanne | Auffällig |
|---|---|---|
| Küche (19) | 1,3 – 3,3× | `bratapfel` **6,3×** (Winter, Rezept per Adventskalender), `kuerbissuppe` 3,3× |
| Apotheke (4) | 1,5 – 2,2× | – |
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
4. **Insekten/Fische haben fast keine Verwendung** außer Verkauf (nur Barsch und Hering in Rezepten).

## Empfehlungen 💡

- **Spätspiel-Senken mit Bedeutung statt Zahlen:** z. B. Dorf-Projekte (Brunnen verschönern, Steg am Fluss,
  Pavillon für die Party), die Lina *mitfinanziert* und die das Dorf sichtbar verändern. Verbindet Geld mit
  Säule 3/5.
- **Fänge mit mehr Verwendung:** einige weitere Fisch-Rezepte (Bistro), Thalias Wunsch nach bestimmten Funden,
  eine Ausstellungsvitrine. Ziel ist *Systemtiefe*, nicht höhere Preise.
- **Keine Preiserhöhung beim Angeln nötig** – eher bei Bedarf Insekten leicht aufwerten, falls der Playtest
  zeigt, dass Kescher-Gänge sich „nicht lohnen“.
