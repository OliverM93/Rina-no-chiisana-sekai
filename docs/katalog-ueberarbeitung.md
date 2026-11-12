# Möbelkatalog-Überarbeitung: Bestandsaufnahme & Konzept

Stand: November 2026 · Branch `feature/katalog-ueberarbeitung`
Legende: ✅ implementiert · 🗓️ geplant · 💡 Empfehlung · ❓ offen

## 1. Ist-Zustand

**Daten:** `src/data/furniture.ts` – jedes Möbel hat genau **ein** Feld `style: FurnitureStyle`
(12 Werte). Das Feld mischt drei verschiedene Dinge:

| Art | Werte | Eigentlich … |
|---|---|---|
| echte Einrichtungsstile | japanisch, cottage, retro, modern, midcentury, bistro | Stil |
| Sammelbecken | basis (27 Dinge im Katalog: Sofa, Bett, Pflanzen, Kaffeemaschinen, Wanddeko …) | „kein Stil“ |
| Herkunft/Ort/Thema | handgemacht, garten, kunst, winter, lieblinge | Kategorie |

**Katalog (`src/ui/CatalogPanel.tsx`):** drei Reiter (Möbel / Tapeten / Böden), darunter bis zu 11 Stil-Chips,
darunter ein Raster aller Treffer (bis ~125 Symbole ohne Gliederung), unten Detail + Kaufen.
Tastatur: Esc schließt, Enter kauft, Tab/Pfeile laufen nur über den Browser-Fokus – Reiter und Stil-Chips sind
mit Pfeiltasten **nicht** erreichbar, das Raster nur, wenn man vorher hineingeklickt/getabbt hat.

**Zahlen (im Katalog kaufbar, ohne Geschenke/Werkbank/Ausgemustertes):**

| Alter Stil | Möbel | Tapeten | Böden |
|---|---:|---:|---:|
| basis | 27 | 13 | 7 |
| japanisch | 16 | 3 | 2 |
| garten | 20 | – | – |
| bistro | 11 | 2 | 1 |
| midcentury | 12 | 2 | 5 |
| winter | 9 | 1 | – |
| cottage | 6 | 5 | 5 |
| retro | 6 | 4 | 5 |
| modern | 6 | 7 | 13 |
| lieblinge | 13 (Poster, Bildbände, Tassen, Tassenbord) | – | – |
| **Summe** | **126** | **38** | **35** |

**Wo `style` sonst benutzt wird** (muss bei der Umstellung weiter funktionieren):

- `game/home.ts` `styleUnlocked` – Bistro erst ab Jens' Einzug (Kauf-Sperre).
- `game/erinnerungen.ts` – Reaktionen „stil-japanisch/cottage/retro/modern/midcentury/bistro“ ab 3–4 Stücken.
- `data/items.ts`, `main.ts`, Tests – `style === 'kunst'` erkennt Jens' Kunstwerke, `'lieblinge'` die Poster,
  `'garten'/'winter'` die Draußen-Dinge.

**Game-Design-Vorgeschichte:** Die Audits 2 und 3 nennen den Katalog bereits „unübersichtlich“ (N3) und raten von
weiteren Stilen ohne Not ab. Die Überarbeitung löst genau dieses Problem zuerst (Navigation), damit die neuen Stile
den Katalog nicht noch unübersichtlicher machen.

## 2. Datenmodell (Vorschlag)

Erweitern statt umbauen – **keine Item-ID ändert sich, kein neues Speicherformat, kein `SAVE_VERSION`-Wechsel**:

```ts
// neu, unabhängig voneinander filterbar
category: CatalogCategory;   // moebel | pflanzen | lieblinge | garten | winter (+ tapete/boden für Flächen)
type: CatalogType;           // je Kategorie eigene Typen (s. u.)
styles: DesignStyle[];       // 0…n Einrichtungsstile – leer = „ohne Stil“
// bleibt (intern): style: FurnitureStyle  → umbenannt in der Doku zu „Linie“: Herkunft/Freischaltung/Reaktionen
```

Begründung: Das alte Feld hält Freischaltung (Bistro), Reaktionen der Bewohner und Kunst-/Geschenk-Erkennung
zusammen. Es bleibt als interne „Linie“ unverändert, damit nichts davon bricht. Kategorie, Typ und Stile sind
**eigene** Felder (nicht aus der Linie abgeleitet). Damit nicht jede Zeile in `furniture.ts` drei neue Felder
bekommt, liegt die Zuordnung in einer eigenen Datei `src/data/catalog.ts` (Tabelle Basis-ID → Kategorie/Typ/Stile);
ein Test stellt sicher, dass jedes Katalog-Ding genau einen Eintrag hat.

Mehrfachstile: Ein Bugholzstuhl ist Bistro, ein Holzregal Skandinavisch **und** Minimalismus. Mit genau einem Stil
müsste man solche Dinge doppelt anlegen oder sie wären unter einem Stil unauffindbar.

## 3. Kategorien und Typen

| Kategorie | Typen |
|---|---|
| 🛋️ **Möbel** | Sofas & Sessel · Stühle & Hocker · Tische · Betten · Schränke & Regale · Lampen · Teppiche · Wanddeko · Kleine Deko · Küche & Technik |
| 🪴 **Pflanzen** | Große Pflanzen · Tischpflanzen · Hängepflanzen |
| 🖼️ **Tapeten** | Einfarbig · Gemustert · Holz, Stein & Fliesen |
| 🟫 **Böden** | Dielen · Parkett · Fliesen & Stein · Matten & Teppichboden |
| 💛 **Lieblingsthemen** | Kaffee · Filme & Bücher · Sammeltassen · Sammlungen zeigen · Winston |
| 🌷 **Garten** | Zäune & Wege · Sitzen & Tische · Licht · Beete & Ställe · Deko |
| ❄️ **Winterzauber** | (nur Dezember–Februar sichtbar, wie bisher) |

Stillose Dinge (alle Pflanzen, Garten, Winter, Lieblingsthemen, Basis-Möbel wie Fernseher oder Vorratstruhe) findet
man über ihre Kategorie und den Typ. Der Stilfilter hat „Alle“ und „Ohne Stil“.

## 4. Einrichtungsstile (Zielliste)

16 Stile. Bestehende IDs bleiben, wo es passt; die Anzeige-Namen werden vereinheitlicht.

| Stil (Anzeige) | ID | Herkunft |
|---|---|---|
| Japanisch | `japanisch` | bestehend |
| Japandi | `japandi` | neu |
| Minimalismus | `minimalismus` | neu |
| Skandinavisch | `skandinavisch` | neu (Wunsch „Scandinavian“, deutsch benannt) |
| Contemporary | `modern` | bestehend „Modern“, umbenannt |
| Mid-Century-Modern | `midcentury` | bestehend „Mid-Century & Bauhaus“ – Bauhaus-Stücke bleiben drin |
| Cottagecore | `cottage` | bestehend |
| Retro-Oma-Chic | `retro` | bestehend |
| Französisches Bistro | `bistro` | bestehend (ab Jens) |
| Industrial | `industrial` | neu |
| Brutalismus | `brutalismus` | neu |
| Art déco | `artdeco` | neu |
| Dark Academia | `darkacademia` | neu – Annahme: „Ark Academia“ war ein Tippfehler |
| Space Age | `spaceage` | neu |
| Cyberpunk | `cyberpunk` | neu |
| Memphis | `memphis` | neu |

Bewusst **nicht** angelegt: Organic Modern, Mediterranean Modern (vom Auftraggeber gestrichen).
Bauhaus wird kein eigener Stil (zu wenige Stücke, sehr nah an Mid-Century) – 💡 später trennbar, wenn das Set wächst.

### Alter Stil → neue Zuordnung

| Alt (`style`) | Kategorie | Neue Stile |
|---|---|---|
| japanisch | Möbel/Pflanzen | Japanisch (+ Japandi bei hellen, schlichten Stücken) |
| basis | Möbel/Pflanzen/Lieblingsthemen | meist **ohne Stil**; einzelne Stücke bekommen Stile (s. u.) |
| cottage | Möbel | Cottagecore |
| retro | Möbel | Retro-Oma-Chic (+ Dark Academia bei Ohrensessel/Orientteppich) |
| modern | Möbel | Contemporary (+ Minimalismus/Skandinavisch, wo passend) |
| midcentury | Möbel | Mid-Century-Modern |
| bistro | Möbel | Französisches Bistro |
| garten | Garten | ohne Stil |
| winter | Winterzauber | ohne Stil |
| lieblinge | Lieblingsthemen | ohne Stil |
| handgemacht, kunst | (nicht im Katalog) | ohne Stil |

## 5. Zuordnung je Eintrag (Möbel)

Abkürzungen der Stile: JP Japanisch · JD Japandi · MI Minimalismus · SK Skandinavisch · CO Contemporary ·
MCM Mid-Century-Modern · CC Cottagecore · RO Retro-Oma-Chic · BI Bistro · IN Industrial · BR Brutalismus ·
AD Art déco · DA Dark Academia · SA Space Age · CY Cyberpunk · ME Memphis · – ohne Stil

| ID | Kategorie › Typ | Stile |
|---|---|---|
| futon | Möbel › Betten | JP, JD |
| chabudai | Möbel › Tische | JP, JD |
| kotatsu | Möbel › Tische | JP |
| zabuton | Möbel › Stühle & Hocker | JP |
| andon | Möbel › Lampen | JP, JD |
| tansu | Möbel › Schränke & Regale | JP |
| byobu | Möbel › Schränke & Regale (Raumteiler) | JP |
| tsukubai | Möbel › Kleine Deko | JP |
| tatami-matte | Möbel › Teppiche | JP, JD |
| teeservice, kokeshi, winkekatze | Möbel › Kleine Deko | JP |
| ikebana | Möbel › Kleine Deko | JP, JD |
| rollbild | Möbel › Wanddeko | JP |
| bambus, bonsai | Pflanzen | JP (Pflanzen dürfen einen Stil haben, wenn er eindeutig ist) |
| regal | Möbel › Schränke & Regale | SK, MI |
| vorratstruhe | Möbel › Schränke & Regale | – |
| stehlampe | Möbel › Lampen | – |
| fernseher, herd | Möbel › Küche & Technik | – |
| sofa | Möbel › Sofas & Sessel | – |
| bett | Möbel › Betten | – |
| wandregal | Möbel › Schränke & Regale | SK |
| wanduhr, wimpelkette, fotowand, trockenkranz | Möbel › Wanddeko | – (Trockenkranz: CC) |
| spiegel-rund | Möbel › Wanddeko | AD |
| glasvase | Möbel › Kleine Deko | MI |
| priesterkalender | Lieblingsthemen › Filme & Bücher | – |
| espresso-einsteiger/-profi/-hebel | Lieblingsthemen › Kaffee | – |
| bild-dr-no, poster-grusel | Lieblingsthemen › Filme & Bücher | – |
| bild-winston | Lieblingsthemen › Winston | – |
| insektenkasten, fischtafel | Lieblingsthemen › Sammlungen zeigen | – |
| kaktus, sukkulenten | Pflanzen › Tischpflanzen | – |
| topfpflanze, yucca, gummibaum | Pflanzen › Große Pflanzen | – (Gummibaum: RO) |
| haengepflanze | Pflanzen › Hängepflanzen | – |
| kraeutertoepfe | Pflanzen › Tischpflanzen | CC |
| landhaustisch | Möbel › Tische | CC |
| bluemchensessel | Möbel › Sofas & Sessel | CC |
| haekelteppich | Möbel › Teppiche | CC |
| kerzenleuchter | Möbel › Lampen | CC |
| wollkorb | Möbel › Kleine Deko | CC |
| ohrensessel | Möbel › Sofas & Sessel | RO, DA |
| nierentisch | Möbel › Tische | RO, MCM |
| fransenlampe | Möbel › Lampen | RO |
| bonbonschale | Möbel › Kleine Deko | RO |
| perserteppich | Möbel › Teppiche | RO, DA |
| loungesofa | Möbel › Sofas & Sessel | CO |
| marmortisch | Möbel › Tische | CO, AD |
| bogenlampe | Möbel › Lampen | CO, MCM |
| wuerfelregal | Möbel › Schränke & Regale | CO, SK |
| sitzsack | Möbel › Sofas & Sessel | CO |
| keramikvase | Möbel › Kleine Deko | CO, JD, MI |
| lederloungesessel, satztische, teaksideboard, tripodlampe, formenbild, formenteppich | Möbel › (Typ je Stück) | MCM |
| freischwinger | Möbel › Stühle & Hocker | MCM, IN |
| opal-leuchte | Möbel › Lampen | MCM, SA |
| hellerau-regal/-regalwand/-standregal | Möbel › Schränke & Regale | MCM, SK |
| sonnenspiegel | Möbel › Wanddeko | MCM, AD |
| bistrotisch, bistrostuhl, barhocker, weinregal, kreidetafel, etagere, eiffelmodell, bistrolaeufer | Möbel › (Typ je Stück) | BI |
| zinktheke | Möbel › Tische | BI, IN |
| bistrolampe | Möbel › Lampen | BI, DA |
| goldspiegel | Möbel › Wanddeko | BI, AD |
| Poster, Bildbände | Lieblingsthemen › Filme & Bücher | – |
| Sammeltassen, Tassenbord | Lieblingsthemen › Sammeltassen | – |
| alle Gartenmöbel | Garten › (Typ je Stück) | – |
| alle Winterstücke | Winterzauber | – |

Tapeten und Böden bekommen ihre Stile analog (z. B. Backstein → IN, Betonoptik → IN/BR/MI, Zickzack Schwarz-Weiß
→ AD, Schachbrett → MCM/AD, Einfarbig Waldgrün/Bordeaux → DA, Terrazzo → ME/CO, Atomic → MCM/SA, einfarbige
Wände sonst ohne Stil).

## 6. Lücken je Stil (nach Zuordnung des Bestands)

Kernsortiment = Sitzmöbel · Tisch · Regal/Schrank · Lampe · Teppich oder Wanddeko · Tapete · Boden.

| Stil | vorhanden | fehlt fürs Kernsortiment |
|---|---|---|
| Japanisch, Mid-Century-Modern, Cottagecore, Retro-Oma-Chic, Bistro, Contemporary | alles | – |
| Japandi | Futon, Chabudai, Andon, Tatami, Vasen | Sofa/Bank, Regal, Tapete, Boden |
| Minimalismus | Regal, Vasen | Sofa, Tisch, Lampe, Teppich, Tapete/Boden zuordnen |
| Skandinavisch | Regale, Würfelregal | Sessel/Sofa, Tisch, Lampe, Teppich |
| Industrial | Freischwinger, Zinktresen, Backstein, Beton | Sofa, Regal, Lampe |
| Dark Academia | Ohrensessel, Orientteppich, Bistrolampe, dunkle Wände/Parkett | Bücherwand, Schreibtisch |
| Art déco | Spiegel, Marmortisch, Zickzack-/Schachboden | Sofa/Sessel, Lampe, Tapete |
| Brutalismus | Betonboden | alles außer Boden |
| Space Age | Opal-Leuchte | alles außer Lampe |
| Cyberpunk | – | alles |
| Memphis | Terrazzo | alles außer Tapete |

Grob geschätzt: **~45–55 neue Modelle** plus ~10 neue Tapeten/Böden (mit neuen Mustern), damit jeder neue Stil
sein Kernsortiment hat.

## 7. Menü (Entwurf)

```
┌──────────────────────────── 📒 Möbelkatalog ───────────────── 12 340 ⭐ ┐
│ [🛋️ Möbel] [🪴 Pflanzen] [🖼️ Tapeten] [🟫 Böden] [💛 Lieblinge] [🌷 Garten] │  ← ←/→
│ Typ:  [Alle] [Sofas & Sessel] [Stühle] [Tische] [Betten] [Regale] [Lampen] … │  ← ←/→
│ Stil: [Alle] [Ohne Stil] [Japanisch] [Japandi] [Skandinavisch] …   (◀ ▶)    │  ← ←/→
├──────────────────────────────────────────────────────────────────────────────┤
│ ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢                                                          │  ← Pfeile im Raster
│ ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢     (nur die Treffer; leere Kombination → freundlicher    │
│ ▢ ▢ ▢                     Hinweis „Hier gibt es noch nichts …“)               │
├──────────────────────────────────────────────────────────────────────────────┤
│ [Symbol] Loungesofa · Contemporary · Sofas & Sessel · 2×1 Felder            │
│          Beschreibung …   Farbe: ● ● ● ● ● ●  (V / 1–9)   2 100 ⭐  [Kaufen]  │
└─ ↑↓ Zeile wählen · ←→ ändern · Enter kaufen · Esc schließen ────────────────┘
```

Tastatur (eine kleine Zustandsmaschine in `src/ui/catalogNav.ts`, ohne DOM testbar):

- ↑/↓ wechselt die **Zeile**: Kategorie → Typ → Stil → Raster (im Raster ↑/↓ zeilenweise; aus der obersten
  Rasterzeile mit ↑ zurück in die Stilzeile) → Farbe.
- ←/→ ändert in der aktiven Zeile (Reiter, Filter, Rasterplatz, Farbe). Die Filter wirken sofort.
- Enter kauft das gewählte Stück, Esc schließt. Bild↑/Bild↓ springt zwischen Kategorien von überall.
- Die aktive Zeile ist sichtbar umrandet, der Hinweis unten zeigt die Tasten.
- Bewegungen von Lina/Kamera sind schon gesperrt, solange ein Fenster offen ist (`session.uiBlocking`).

## 8. Entscheidungen (mit dem Auftraggeber geklärt)

- ✅ **Mehrfachstile:** ja, 0–n Stile pro Stück.
- ✅ **Layout:** drei Filterzeilen (Kategorie, Typ, Stil), darunter Raster und Details.
- ✅ **Umfang:** schrittweise – dieser Schritt bringt Menü, Tastatur und die Zuordnung des Bestands; das Kernsortiment
  der neuen Stile folgt in eigenen PRs (je 3–4 Stile).
- ✅ **Freischaltung:** einige Stile kommen mit Einzügen (Zuordnung in `DESIGN_STYLES`, leicht änderbar):

| Einzug | bringt |
|---|---|
| von Anfang an | Japanisch, Japandi, Contemporary, Mid-Century-Modern, Cottagecore, Retro-Oma-Chic |
| Olaf & Christin (ordentlich, Ostsee) | Minimalismus, Skandinavisch |
| Jens (Kunst, Dandy) | Französisches Bistro (wie bisher), Art déco, Memphis |
| Thalia (Bücher, Karten, Gestein) | Dark Academia, Brutalismus |
| Lars | Industrial |
| Oli (Zocken, Sterne gucken) | Space Age, Cyberpunk |

Wichtig: Die Freischaltung hängt an der **Linie** eines Stücks (`FurnitureDef.style`), nicht an seinen Stil-Schildern.
Bestehende Stücke behalten ihre Linie und bleiben deshalb immer im Katalog (Test „nichts verschwindet“); ein Stil-Chip
erscheint erst, wenn der Stil frei ist. Neue Stücke der neuen Stile bekommen später ihren Stil als Linie und erscheinen
dann mit dem Einzug.

## 9. Backlog: Kernsortiment der neuen Stile 🗓️ (Vorschlag, priorisiert)

1. ✅ *erledigt (Teil 1)* **Japandi, Skandinavisch, Minimalismus** – hell, ruhig, passt zu Linas Haus; viele Teile wiederverwendbar
   (Daybed/Bank, Lattenregal, Papier-Pendelleuchte, Wollteppich, Kalkputz-Wand, helle Eiche).
2. ✅ *erledigt (Teil 2)* **Dark Academia, Art déco, Industrial** – starker Bezug zu Thalia, Jens und Lars
   (Bücherwand, Sekretär, Chesterfield, Fächer-Sessel, Messing-Stehlampe, Fabrikleuchte, Stahlregal, Ledersofa).
3. ✅ *erledigt (Teil 3)* **Space Age, Cyberpunk** – Oli (Kugelsessel, Tulpentisch, Lavalampe, Gaming-Stuhl, Neonröhren, Monitorwand).
4. ✅ *erledigt (Teil 4)* **Brutalismus, Memphis** – mutig, eher Akzente (Betonbank, Blockregal, Squiggle-Teppich, Totem-Regal, Memphis-Tapete).

💡 Später denkbar: Reaktionen der Bewohner auch für die neuen Stile (`game/erinnerungen.ts`, Tags `stil-…`),
dezentes „neu“ am Chip eines frisch freigeschalteten Stils (ohne Druck), Suchfeld.
