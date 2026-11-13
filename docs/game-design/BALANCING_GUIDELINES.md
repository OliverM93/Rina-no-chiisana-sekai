# Balancing-Leitlinien

Faustregeln, abgeleitet aus den bestehenden Zahlen. Neue Inhalte sollten in diese Spannen passen; wer bewusst
davon abweicht, schreibt kurz in den PR, warum.

## 1. Grundsätze

1. **Kein Scheitern, kein Verlust.** Keine Mechanik nimmt Sternchen, Gegenstände, Freundschaft oder Pflanzen weg.
   Winter *pausiert*, er zerstört nicht.
2. **Spezialisierung ja, Monokultur nein.** Eine Aktivität darf die beste Geldquelle sein, aber jede Aktivität
   braucht einen eigenen Grund (Sammelbuch, Rezept, Geschenk, Deko), damit sie nicht überflüssig wird.
3. **Belohnung im Verhältnis zum Aufwand** – gemessen in *Spielzeit und Aufmerksamkeit*, nicht in Klicks.
4. **Qualität vor Menge:** Lieber eine neue Möglichkeit als +20 % auf eine Zahl.
5. **Kein Druck durch Mangel:** Knappheit darf Abwechslung erzeugen (Tagesangebot), aber nie blockieren.

## 2. Preise & Werte (Spannen aus den Daten)

| Kategorie | Verkaufswert | Regel |
|---|---|---|
| Material (Ast, Kiesel, Schneeball) | 2–4 | „Füllmaterial“, nur für Rezepte interessant |
| Obst, Muscheln, Wildblumen, Eier | 5–20 | tägliches Kleingeld |
| Beet-Blumen & Kräuter | 14–40 | etwas mehr als Obst, weil Pflege nötig |
| Seltene Funde (Seestern, Glitzerstein) | 60–120 | ~10 % Chance |
| Fische / Insekten | 15–1 200 | **Preis ∝ Seltenheit** (niedriges `weight`, enge Zeit, Wetter, Größe) |
| Gerichte & Tees | 40–300 | Ergebnis ≈ **1,5–3× Zutatenwert** |
| Sträuße | 90–700 | 1,2–1,8× (Pflege + Binden) |
| Möbel (Katalog) | 100–8 800 (Median 600) | Verkauf immer nur ¼ |

**Neue Art / neuer Gegenstand:** an der nächstverwandten Kategorie orientieren. Ein seltener Fisch darf teuer
sein, ein häufiger nicht – sonst kippt der Erwartungswert beim Angeln.

## 3. Verarbeitung

- Essen: Zielspanne **1,5–3×**. Ausreißer bis **~6×** sind erlaubt, wenn die Zutaten begrenzt sind (Eier, Obst, Saison) –
  Kochen ist keine Geldquelle (ein Gericht bringt so viel wie wenige Fänge), sondern Geschenk, Wunsch und Lieblingsbeschäftigung.
  Heute darüber: Bratapfel 6,3×, Crêpes 5,8×, Lavendelkekse 4,5×, Apfelpfannkuchen 4,4×, Kräutermischung 4,3×, Zimtsterne 4,0× (Audit 3).
  Der Test `data/balancing.test.ts` hält alle Rezepte zwischen 1,3× und 6,5×.
- Deko-Crafting: Wert egal, weil Möbel zu ¼ verkauft werden. Wichtig ist nur, dass das *Rezept erreichbar* ist
  (Test vorhanden).
- Vasen: **genau wertneutral** (Strauß + Vase − 5). Kein Geldkreislauf über Möbel.

## 4. Kosten & Kurven

- **Hausausbau:** Stufe *n* kostet heute +10 000 bis +20 000 ⭐ mehr als die vorige (Faktor 2,0 am Anfang, 1,3 am Ende). Neue Stufen sollten mindestens
  einen neuen Raum oder eine neue Funktion bringen.
- **Kauf-Möbel:** Grundmöbel 300–900, Statement-Stücke 1 200–3 000, Luxus (Handhebel-Maschine) bis ~9 000.
  Ein Möbel über 5 000 braucht eine *Funktion* (z. B. Getränke, Gewächshaus), nicht nur Optik.
- **Samen:** Verkaufswert × 2,5 (min. 12) – Gemüse ist Zutatenquelle, keine Geldmaschine.

## 5. Freundschaft

- Tagesmaximum ohne Sonderaktionen ~40 Punkte je Bewohner (Gespräch 8 + Lieblingsgeschenk 30).
- **Neue Freundschaftsquellen:** höchstens 6–24 Punkte, 1×/Tag. Mehr nur bei einmaligen Momenten (Einzug).
- **Oli** hat bereits viele Quellen → neue Oli-Momente sollten eher *Inhalt* (Szene, Brief) bringen als Punkte.
- Jedes Herz sollte eine spürbare Kleinigkeit bringen (Brief, Rezept, Möbel, neuer Gesprächsinhalt).

## 6. Tägliches

- Eine neue Tagesquelle muss **ohne Verlust ignorierbar** sein. Faustregel: Ihr Wert liegt unter ~5 % dessen,
  was eine normale Sitzung anderweitig bringt – sonst wird sie zur Pflicht.
- Bevorzugt: *Gründe zum Hingehen* (Gespräch, Szene, Anblick) statt *Ressourcen zum Abholen*.
- Keine Ketten („3 Tage hintereinander …“), keine Streaks.

## 7. Seltenheit

- Seltene Funde zwischen ~5 % und ~15 % (Seestern 10 %, Glitzerstein 12 %).
- Sehr selten (< 5 %) nur für reine Sammelziele (z. B. schwarze Kreuzung), nie für Fortschrittsvoraussetzungen.
- Seltenes darf an Bedingungen hängen (Monat, Uhrzeit, Wetter), aber jede Bedingung tritt mindestens einmal im
  Jahr ein.

## 7b. Automatische Prüfung ✅

`data/balancing.test.ts` (Audit 3, K5) prüft: Küchen-/Apotheken-Margen 1,3–6,5×, Katalogpreise 50–9 000 ⭐ (über 5 000 nur mit Funktion),
häufige Arten (Gewicht ≥ 20) ≤ 120 ⭐ und teure Arten (≥ 500 ⭐) selten (Gewicht ≤ 5), Wunsch-Sternchen ≤ 5 000, Hausausbau-Zuwachs 5 000–25 000.

## 7c. Katalog-Budget ✅ (Audit 4, K3)

Inhaltswellen (neue Stile, Möbel-Kits) vergrößern die Sternchen-Senken, aber nicht das Einkommen. Beim Katalog-Umbau im November 2026
wuchs der Katalog von ≈ 125 000 auf ≈ 255 000 ⭐; erst Lina fiel auf, dass das Sammeln dadurch länger dauerte. Deshalb:

- **Grenzen:** Summe aller Katalogpreise (alle Stile frei, mit Winterware) **≤ 300 000 ⭐**, Möbel-Median **≤ 1 000 ⭐** (Stand: ≈ 259 000 / 850).
  Zusammen mit dem Hausausbau (≈ 200 800 ⭐) soll „alles besitzen“ in der Größenordnung von höchstens **~35–40 Stunden Angeln** bleiben (📏).
- **Test:** `game/catalogBudget.test.ts`. Er schlägt fehl, wenn eine Welle die Grenze reißt – das ist gewollt: Dann **bewusst entscheiden**,
  ob Einkommen/Ausbaupreise mitwachsen (Beispiel: PR „Sternchen-Balancing“) *und erst dann* die Grenze im Test anheben.
- **Im PR zu jeder Stil-Welle ein Satz**, was sie für Katalog-Summe und Einkommen bedeutet.

## 8. Was beim Balancing **nicht** gemacht wird

- Keine künstlichen Wartezeiten zum Strecken (Ausnahme: die 10 Min Spielzeit vor Einzügen/Bau – sie sind Pause
  zum Durchatmen und erzählerischer Puffer, keine Sperre; jederzeit sinnvoll überbrückbar).
- Keine Preise, die Lina zum Grinden zwingen, um *erzählerischen* Fortschritt zu sehen.
- Keine Senkung bestehender Werte, ohne alte Spielstände zu bedenken (nichts darf sich „weggenommen“ anfühlen).
