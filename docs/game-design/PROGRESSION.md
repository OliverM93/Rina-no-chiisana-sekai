# Progression

Fortschritt hat in diesem Spiel fünf Stränge. Sie laufen parallel, damit Lina immer *irgendwo* vorankommt,
egal worauf sie gerade Lust hat (Autonomie).

## 1. Rahmenhandlung – Einzüge ✅

Quelle: `data/progress.ts`, `core/progress.ts`, `game/story.ts`. Fortschritt hängt an **Meilensteinen und
Spielzeit**, nicht an Kalendertagen (Entscheidung M8j). Nach erfülltem Meilenstein: Brief, dann nach
`WAIT_SECONDS` = 10 Min **Spielzeit** der Einzug.

| # | Einzug | Voraussetzung | Hinweise von |
|---|---|---|---|
| 0 | Oma Gisela | Spielstart | – |
| 1 | Olaf & Christin | 3 Sammelbuch-Einträge, 200 ⭐ verkauft | Oma |
| 2 | Oli | 1 Möbel gekauft | Olaf |
| 3 | Jens | 3 Dinge gebaut, 6 Sammelbuch-Einträge | Oli |
| 4 | Lars | 3× gekocht, 5 000 ⭐ verkauft | Jens |
| 5 | Thalia | Gesundheits-Check, 8 Sammelbuch-Einträge, erster Hausausbau bestellt (Kredit, kein Geld nötig) | Lars |

**Audit 3 (Nov. 2026):** Bedingungen moderat erhöht, damit die Einzüge über Spielen statt Warten getaktet sind (vorher
2 gebaut / 1× gekocht + 2 500 ⭐ / 9 Sammelbuch). Sammelbuch-Ziele sind **winter-sicher**: Von November bis Februar gibt es
nur 10–11 Arten; `data/progress.test.ts` verlangt in jedem Monat ≥ Ziel + 2 Arten.

📏 **Dauer:** Alle Bedingungen sind mit wenigen Stunden normalem Spielen erreichbar (Durchlauf-Test
`game/playthrough.test.ts` beweist die Erreichbarkeit, nicht die Dauer). Geschätzt **2–3 Stunden** bis Thalia (vorher ~1–1,5 h, überwiegend Wartezeit – Audit 3).

**Bewertung**
- ✅ Stark: Jeder Meilenstein *führt* in ein neues System ein (Sammelbuch → Katalog → Werkbank → Küche → Praxis).
  Das ist gutes Onboarding ohne Tutorial-Zwang.
- ✅ Stark: Hinweise kommen in-character im Gespräch statt als Aufgabenliste.
- ⚠️ Schwäche: Die Geschichte ist **früh zu Ende**. → 🔶 teilweise gelöst durch die Herzenswünsche (1b); weitere Phasen offen.

### 1b. Herzenswünsche ✅ (seit Nov. 2026, Phase 1)

Nach Thalias Einzug: Omas Brief „Herzenswünsche“, jeder Bewohner hat einen Wunsch fürs Dorf (`data/wishes.ts`). Erfüllt mit
Gesammeltem → neuer Ort im Dorf, +30 Freundschaft. Schließt die Lücke „Geschichte endet früh“ zum Teil; weitere Wünsche je
Bewohner sind vorbereitet. Details: `DESIGN_DECISIONS.md` D16.

## 2. Hausausbau ✅

Quelle: `data/house.ts`, `core/bank.ts`. Über Olafs Dorfkasse als **zinsloser Kredit** (neuer Ausbau erst, wenn
der alte abbezahlt ist), Bau dauert Spielzeit.

| Stufe | Name | Preis | kumuliert |
|---|---|---|---|
| 1 | Großes Zimmer (10×7) | 9 800 | 9 800 |
| 2 | Schlafzimmer-Anbau | 17 800 | 27 600 |
| 3 | Dachzimmer | 27 800 | 55 400 |
| 4 | Wohnküche (12×8 + Küche) | 37 800 | 93 200 |
| 5 | Wintergarten | 47 800 | 141 000 |
| 6 | Keller | 59 800 | 200 800 |

✅ *Sternchen-Balancing (Nov. 2026):* vorher 19 800 / 34 800 / 49 800 / 69 800 / 89 800 (zusammen 273 800). Gesenkt, weil der
Katalog inzwischen ≈ 185 k ⭐ Möbel + 62 k ⭐ Flächen umfasst. Mit Bausparen (Papa übernimmt 15 %) zahlt Lina ≈ 171 k.

**Bewertung**
- ✅ Gute Kurve: Kosten wachsen ungefähr linear (+10–20 k je Stufe), jede Stufe bringt *neuen Raum* – eine
  qualitative, keine nur numerische Belohnung.
- ✅ „Erst bauen, dann zahlen“ (Kredit) gibt sofortige Belohnung und ein selbstgewähltes Sparziel ohne Druck.
- 📏 Bei ~10–15 k ⭐ pro Stunde fokussiertem Angeln (siehe Ökonomie) ist das ganze Haus nach **20–30 Stunden**
  reiner Sternchen-Arbeit fertig; mit gemischtem Spielen eher mehrere Wochen. Das ist der längste Strang im Spiel.

## 3. Freundschaft – Herzen ✅

Quelle: `core/friendship.ts`. Schwellen `[0, 40, 100, 180, 280, 400]` → max. 5 Herzen. Punkte sinken nie.

| Quelle | Punkte | Häufigkeit |
|---|---|---|
| Erstes Gespräch des Tages | 8 | 1×/Tag je Bewohner |
| Geschenk (liebt / mag / neutral / mag nicht) | 30 / 16 / 8 / 2 | 1×/Tag zählt, weitere +1 |
| Geburtstagsgeschenk | doppelt | jährlich |
| Treffen (Kaffeeklatsch, Angeln …) | 8 je Teilnehmer | an Treff-Tagen |
| Party: Tanzen | Thalia 20, alle anderen 6 | samstags |
| Sonntagsessen | Jens 16, Gäste 10 | sonntags |
| Gesundheits-Check | Lars 12 | 1×/Tag |
| Galerie stiften | Jens 16 | je Bild |
| Oli: Einzug | 40 (= 1 Herz) | einmalig |
| Oli: Picknick / Sterne gucken | 24 | je 1×/Tag (Sterne ab 21 Uhr, klarer Himmel, ≥ 1 Herz) |
| Oli: Küsschen | 6 | erstes am Tag |
| Oli: Fernsehen | 10 | – |
| Oli: Kaffee zu zweit | Maschinen-abhängig (+4 Latte-Art) | 1×/Tag |

📏 **Tempo:** Gespräch + Lieblingsgeschenk = 38/Tag → 5 Herzen in ~11 Tagen. Nur plaudern → ~50 Tage.
**Oli** hat so viele Quellen, dass er in wenigen Tagen bei 5 Herzen ist.

**Herz-Briefe** (`heartLetters`, Belohnung per Post): ✅ **Seit Nov. 2026 bringt jedes Herz (1–5) bei jedem
Bewohner einen Brief mit Geschenk** (vorher fehlten 12 – siehe `DESIGN_DECISIONS.md` D15). Ein Test sichert das ab.

**Bewertung**
- ✅ Freundschaft sinkt nie, Geschenk-Reaktionen sind unterhaltsam (auch „pfui!“) – sehr gutes Cozy-Design.
- ⚠️ **Plateau:** Nach 5 Herzen hat Freundschaft keine weitere Bedeutung. Bei Oli – der wichtigsten Figur –
  passiert das am schnellsten.
- ✅ ~~Lücken bei Christin, Lars, Thalia, Olaf, Jens~~ – geschlossen (W2).
- ⚠️ Romantische Szenen mit Oli sind ab dem Einzug alle verfügbar – die Beziehung *entwickelt* sich mechanisch
  nicht.

## 4. Sammlungen ✅

| Sammlung | Umfang | Quelle |
|---|---|---|
| Fische | 17 | `data/species.ts` |
| Insekten | 27 | `data/species.ts` |
| Funde (Fossilien & Kristalle) | 11 | `data/fossils.ts` |
| Blumen-Farben | 22 Blüten (5 Arten) + Kräuter | `data/flowers.ts` |
| Rezepte | 68 (32 Werkbank inkl. Binden, 31 Küche, 5 Apotheke) | `data/recipes.ts` |
| Sammeltassen | 19 | `data/tassen.ts` |
| Kunstwerke | 12 | `data/art.ts` |
| Möbel im Katalog | 125 Modelle in 10 Stilen (plus Varianten) | `data/furniture.ts` |

**Bewertung**
- ✅ Saisonale Arten machen das Sammelbuch zu einem **Ganzjahresziel** – ein vollständiges Buch braucht
  mindestens ein echtes Jahr (gutes, natürliches Pacing).
- ✅ Schatten für Unentdecktes + Ort/Monat/Uhrzeit = Kompetenz durch Wissen.
- ⚠️ Vollständige Sammlungen werden nicht gefeiert (keine Szene, kein Brief, keine Plakette).

## 5. Gestaltung & Besitz ✅

Kein Zahlenfortschritt, sondern wachsender Gestaltungsspielraum: mehr Räume, mehr Stile, Garten, Wand-Deko,
Gewächshaus. Das ist die wichtigste *intrinsische* Progression (Säule 3).

## Freischaltungen im Überblick

```
Start ──► Werkzeuge (Angel, Kescher, Gießkanne) · Beet · Werkbank · Katalog
Olaf ──► Dorfkasse/Hausausbau · Sparbuch · Samenstand
Oli  ──► Romantik · Kaffee zu zweit · TV mit Oli
Jens ──► Kochstudio · Galerie · Reisen/Tassen · Sonntagsessen
Lars ──► Apotheke · Check-up
Thalia► Schaufel/Funde · Dorfkarte · Party
Geld ──► Hausstufen 1–6 · Kaffeemaschinen · Frühbeet/Gewächshaus · Ställe
Zeit ──► Jahreszeiten, Feste, Saisonware
```

## Empfehlungen 💡 (Details & Priorität in [`IMPROVEMENTS.md`](IMPROVEMENTS.md))

- Spätspiel-Ziele nach dem letzten Einzug (z. B. kleine Wünsche/Projekte der Bewohner).
- ✅ Leere Herzen gefüllt (W2).
- Oli-Beziehung in Stufen erzählen (Momente, die mit den Herzen nach und nach dazukommen).
- Vollständige Sammlungen würdigen (Brief von Thalia/Oma, Deko-Objekt).
