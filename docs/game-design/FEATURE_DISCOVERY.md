# Feature Discovery – Was fehlt Rina no Chiisana Sekai noch?

**Stand:** 14. November 2026 · **Geprüft:** `main` nach PR #139 · **Auftrag:** Bestandsaufnahme entlang von 12 Life-Sim-Systemen, Lücken finden, priorisieren.
**Grundlage:** Wissensbasis in `docs/game-design/` (inkl. Audits 1–4), `docs/game-mechanics.md`, Quellcode und Daten. Kennzahlen habe ich per Skript aus `src/data/` gezogen (Skript wieder gelöscht).
**Während dieser Arbeit wurde nichts am Spiel geändert** – nur dieses Dokument und zwei Verweise.

Belastbarkeit: **[N]** Nachweis aus Code/Daten · **[V]** begründete Vermutung · **[P]** nur im Playtest prüfbar.
Status: ✅ implementiert · 🗓️ geplant · 💡 Empfehlung · ❓ offen (Entscheidung bei Oli/Lina).

**Einschränkung:** Ich habe das Spiel für diesen Bericht nicht gespielt. Alles zu „fühlt sich … an“ ist [V] oder [P]. Einen Playtest mit Lina gab es weiterhin nicht.

---

## Kurzfassung

1. **Dem Spiel fehlt kein System.** Alle 12 Systeme des Rasters sind vorhanden, neun davon solide [N]. Die Lücken liegen in **Verbindungen** und in dem, was **nach** Hausausbau und Herzenswünschen kommt.
2. **Der Loop bricht an einer Stelle:** „Beziehungen & neue Ziele“ erzeugt nach den 16 Herzenswünschen keine neuen Ziele mehr [N]. Danach tragen Katalog, Sammelbuch und der Jahreslauf.
3. **Drei Dinge verlassen das Spiel oder bleiben unsichtbar** [N]: Fotos werden nur als PNG heruntergeladen (kein Album im Spiel), Freundschaft ist nur als ganze Herzen im Dialog sichtbar, und erlebte Momente (Einzüge, Feste, Szenen) hinterlassen nichts zum Wiederfinden.
4. **Einrichten und Bewohner berühren sich nur im Gespräch** [N]: Bewohner kommentieren Linas Stil, aber niemand kommt je zu Besuch. Das stärkste Selbstzweck-System (Einrichten) und das Herz des Spiels (die Menschen) sind kaum verbunden.
5. **Die häufigste Tätigkeit hat die geringste Tiefe** [N]: Angeln kennt keine Größen, Rekorde oder Varianten. Ein Fang ist nach dem ersten Mal nur noch Sternchen.

**Empfehlung:** drei kleine Dinge jetzt, der Rest erst nach dem Playtest. Keine neuen Gebiete, keine Händler, keine weitere Möbelwelle.

---

## Phase 1 – Bestandsaufnahme je System

### Kennzahlen [N]

| Bereich | Wert |
|---|---|
| Welt | 1 Karte, 56 × 40 Kacheln, 37 Kartenobjekte; Wiese, Dorfplatz, Fluss, Strand/Meer, Osten |
| Bewohner | 7 + Winston; Plauderzeilen 36–75 je Figur, 94 Erinnerungszeilen, 13 Paar-Gespräche, 5 Treffen |
| Sammeln | 17 Fische, 27 Insekten, 12 Funde, 5 Blumenarten × 8 Farben, 22 Tassen, 12 Galerie-Bilder, 5 Sammlungs-Urkunden |
| Wohnen | 297 Möbelmodelle, 287 Katalog-Einträge (≈ 259 000 ⭐), 17 Stile, 7 Hausstufen, Garten |
| Handwerk | 68 Rezepte (Werkbank, Küche, Apotheke) |
| Spätspiel | 16 Herzenswünsche, davon 7 mit neuem Ort im Dorf |
| Feste | 7 (Ostern, Halloween, Advent, Weihnachten, Silvester, Neujahr …), 6 Geburtstage (Omas Datum fehlt) |
| Klang | 16 Geräusche über den Bus, Musik-Familien nach Tageszeit/Wetter, Umgebung (Vögel, Grillen, Regen, Wellen) |

### Ampel je System

| # | System | Vorhanden (Ort im Code) | Vollständig? | Verknüpft? | Trägt lange? | Schwächen | Ampel |
|---|---|---|---|---|---|---|---|
| 1 | Welt & Exploration | `data/maps/village.ts`, `core/daily.ts`, `game/nature.ts`, `game/digging.ts` | Kern ja; **keine Geheimnisse, keine weiteren Gebiete** [N] | gut (Tagesfunde → Verkauf, Crafting, Wünsche) | mittel: Die Karte ist nach wenigen Stunden bekannt [V] | Erkunden liefert nach der ersten Woche nichts Neues außer Tagesfunden; Weltveränderung nur über 7 Wunsch-Orte | 🟡 [N/V] |
| 2 | NPCs & Beziehungen | `data/npcs/*`, `core/friendship.ts`, `data/meetups.ts`, `data/gespraeche.ts`, `game/erinnerungen.ts` | sehr weit: Tagesabläufe, Treffen, Paar-Gespräche, Häuser von innen, Wünsche, Herz-Belohnungen | sehr gut | ja, bis 5 Herzen; danach nur Alltag | Freundschaft kaum sichtbar (nur ganze Herzen im Dialog) [N]; Bewohner besuchen weder einander noch Lina [N]; Oli in 3–4 Tagen voll [N] | 🟢 [N], Tempo [P] |
| 3 | Sammeln | `core/catching.ts`, `data/species.ts`, `data/fossils.ts`, `data/flowers.ts`, `game/sammlungen.ts`, `ui/CollectionBook.tsx` | ja: Bücher, Seltenheit, Monat/Uhrzeit/Wetter, Urkunden, Schaukästen | gut (Fischgerichte, Vitrine, Wünsche) | ja, das Sammelbuch braucht ein echtes Jahr | **keine Varianten/Rekorde**: Der 50. Barsch ist wie der erste [N] | 🟢 [N] |
| 4 | Housing | `core/room.ts`, `core/floorplan.ts`, `game/home.ts`, `data/furniture.ts`, `data/catalog.ts`, `world3d/Interior3D.ts`, `Yard3D.ts` | sehr weit (Raster, Wand-Deko, Stapeln, Farben, Rückgängig, Garten) | mittel: nur Gesprächs-Reaktionen | ja, stärkster Selbstzweck | Niemand außer Lina „sieht“ das Haus; Katalog-Übersicht bei 287 Einträgen [P] | 🟢 [N] |
| 5 | Crafting | `core/crafting.ts`, `data/recipes.ts`, `ui/CraftPanel.tsx` | ja | sehr gut (Funde → Rezepte, Ernte → Küche, Geschenke) | mittel | keine mehrstufigen Ketten – bewusst, passt | 🟢 [N] |
| 6 | Wirtschaft | `core/bank.ts`, `data/items.ts`, `data/seedstand.ts`, `game/gallery.ts` | ja; Samenstand und Galerie wechseln täglich | gut | bis ≈ 487 000 ⭐ Gesamtbedarf | Angeln dominiert die Einnahmen [N]; drei überlappende Bank-Regeln (Audit 4); kein Händler mit Überraschung | 🟡 [N], Gefühl [P] |
| 7 | Garten | `core/garden.ts`, `data/flowers.ts`, `data/crops.ts`, `game/flowers.ts` | ja: Kreuzungen, Gemüse, Kräuter, Gewächshaus, Winterruhe | sehr gut | ja | – | 🟢 [N] |
| 8 | Zeit, Wetter, Jahreszeiten | `core/time.ts`, `core/weather.ts`, `core/festivals.ts`, `world3d/Weather3D.ts` | ja (5 Wetterarten + Regenbogen, Tag/Nacht, 4 Jahreszeiten, Feste) | sehr gut | ja | Omas Geburtstag fehlt (Datum unbekannt) | 🟢 [N] |
| 9 | Progression | `data/progress.ts`, `core/progress.ts`, `data/house.ts`, `data/wishes.ts` | ja bis zum letzten Wunsch | gut (Einzüge als Onboarding) | **endet**: nach Einzügen, 6 Ausbaustufen und 16 Wünschen kommt nichts Neues [N] | Tempo der Einzüge durch ×1,5 wieder kürzer (Audit 4) | 🟡 [N] |
| 10 | Events | `data/festivals.ts`, `game/party.ts`, `game/dinner.ts`, `data/meetups.ts` | Feste, Geburtstage, Party, Sonntagsessen ja; **keine Wettbewerbe, keine Schatzsuche** [N] | gut | ja (Jahreslauf) | wenig Ungeplantes: Zufall gibt es nur bei Wetter, Regenbogen, Winstons Funden, Tagesgeschenken [N] | 🟡 [N] |
| 11 | Aktivitäten | Angeln, Kescher, Graben, Kochen, Gärtnern, Einrichten, Fotomodus, TV, Snake, Training, Kaffee | breit | gemischt | gemischt | **Inseln:** Fotomodus (Bild verlässt das Spiel), Snake, Training [N]; kein Malen/Musizieren | 🟡 [N] |
| 12 | Langzeit & Autonomie | Notizbuch, Sammlungen, Katalog, Jahreslauf | teilweise | – | [P] | Nach ~40–60 h fehlen neue, selbst gewählte Projekte; Erlebtes hinterlässt keine Spur zum Wiederfinden [N] | 🟡 [V/P] |

### Die „oft vergessenen“ Elemente

| Element | Stand | Ampel |
|---|---|---|
| NPC-Eigenleben | Tagesabläufe, 5 Treffen, 13 Paar-Gespräche, Jens verreist. Keine gegenseitigen Hausbesuche [N] | 🟢 |
| Zufallsereignisse | Wetter, Regenbogen, Winstons Funde, Tagesgeschenke. Sonst ist jeder Tag planbar [N] | 🟡 |
| Gegenstandsvarianten | Möbelfarben und Blumenfarben stark; Fänge ohne Varianten [N] | 🟡 |
| Entdeckungsmechaniken | Rezepte durch Funde und erste Ernte, Kreuzungen. In der Welt selbst nichts Verstecktes [N] | 🟡 |
| Langfristige Projekte | Hausausbau, Katalog, Sammelbuch, Wünsche – alle endlich [N] | 🟡 |
| Komfortfunktionen | Sortieren, Truhe, Rückgängig, „noch eins“, Pfeiltasten, Enter, Notizbuch, Karte [N]; Favoriten/Suche im Katalog fehlen [P] | 🟢 |
| Visuelles Feedback | Partikel, Konfetti, Herzen, Idle-Animationen [N] | 🟢 |
| Sounddesign | 16 Geräusche, generierte Musik, Brabbelstimmen [N]; ob Kochen, Gießen, Kaufen „klingen“, ist [P] | 🟢/[P] |
| Speicherpersistenz | versioniert (v15), Migrationen, Export/Import [N] | 🟢 |
| Gleichwertige Aktivitäten | Für Sternchen ist Angeln konkurrenzlos; für Freude gibt es viele Wege [N/V] | 🟡 |

### Wo bricht der Loop?

Erkunden → Sammeln → Handeln → Gestalten funktioniert durchgehend [N]. Zwei Bruchstellen:

1. **„Beziehungen & neue Ziele“ → zurück zum Anfang:** Bis zum letzten Herzenswunsch erzeugen die Bewohner neue Ziele. Danach nicht mehr. Der Kreis schließt sich nur noch über den Katalog („noch ein Möbel“) und den Jahreslauf.
2. **„Gestalten“ → „Beziehungen“:** Was Lina einrichtet, kommt bei den Bewohnern nur als Plauderzeile an. Es gibt keinen Moment, in dem jemand ihr Zuhause betritt.

**Inseln** (laufen für sich, füttern nichts): Fotomodus, Dackel-Snake, Hantelbank-Training, Fernsehen (nur die Kochshow gibt Rezepte), Galerie (nur Jens-Punkte). Keine davon stört – aber weitere Inseln sollten nicht dazukommen.

### Abgleich der Pillars

| Deine Pillars | Unsere Säulen | Befund |
|---|---|---|
| Freedom | 2 „Nichts muss, alles darf“ | deckungsgleich, unsere ist strenger (keine Strafe fürs Pausieren) |
| Ownership | 3 „Ein Zuhause, das ihr gehört“ | deckungsgleich |
| Relationships | 1 „Liebe zum Echten“ + 5 „Die Welt lebt auch ohne Lina“ | unsere sind genauer: echte Menschen, kein generischer Inhalt |
| Discovery | – (nur am Rand in 5) | **fehlt als Prüfstein** – und ist genau dort, wo die Ampeln gelb sind |
| Progression | – (verteilt auf 3 und 4) | bewusst keine eigene Säule: Fortschritt ist Mittel, nicht Ziel |
| – | 4 „Systeme, die sich füttern“ | fehlt in deiner Liste, ist aber unser wirksamster Filter gegen Minispiele |

💡 Keine sechste Säule. Stattdessen eine Prüffrage bei Säule 5 ergänzen: *„Gibt es hier etwas, das Lina selbst entdecken kann, ohne dass es ihr jemand sagt?“* (❓ E5)

---

## Phase 2 – Lücken und Ideen

Jeder Kandidat mit den 8 Fragen der Designprüfung: **1** Erlebnis · **2** Loop/Zeitskala · **3** Mechanik/Dynamik · **4** Langzeit · **5** Progression/Wirtschaft · **6** Nebenwirkungen · **7** Säulen · **8** einfachere Lösung.
Aufwand in Arbeitstagen (meine Schätzung, [V]).

### A · Freundschaften-Seite im Notizbuch

- **Lücke [N]:** Herzen sieht man nur im Dialog und nur ganzzahlig. Vorlieben, Treffen-Zeiten und Herz-Belohnungen erfährt Lina nirgends. Oma sagt seit PR #133 einen Satz dazu, mehr nicht.
- **Idee:** eine Seite je Bewohner im Notizbuch: Herzen mit Füllstand, **entdeckte** Lieblingsdinge (nur was Lina schon verschenkt hat), Treffen, die sie schon gesehen hat, und ein Satz „Beim nächsten Herz schreibt dir Lars wieder“.
- **1** „Ach, Oma mag Pfirsiche – das wusste ich schon!“ · **2** Wochen-Loop, Wiedereinstieg nach Pausen · **3** Nachschlagen statt Raten; Schenken wird zum kleinen Entdecken · **4** hält Beziehungen bis 5 Herzen lesbar · **5** keine · **6** Kann wie eine Aufgabenliste wirken → nur Entdecktes zeigen, keine Zahlen, keine Prozente · **7** stärkt 1 und 4, verträgt sich mit 2 · **8** Einfacher: nur Füllstand im Dialogfenster. Löst die Vorlieben nicht.
- **Aufwand:** 1,5–2 Tage. Ein Merk-Eintrag je verschenktem Gegenstand (Flags, kein neues Spielstand-Format). **Risiko:** gering. **Stärkt:** Geschenke, Kochen, Binden.

### B · Erinnerungsalbum: Fotos und Momente bleiben im Spiel

- **Lücke [N]:** Der Fotomodus lädt ein PNG herunter (`ui/PhotoPanel.tsx`), im Spiel bleibt nichts. Einzüge, Feste, Oli-Szenen und erste Fänge hinterlassen keine Spur. Für ein Geschenk ist das die auffälligste Lücke.
- **Idee in zwei Schritten:** (B1) Fotos zusätzlich klein im Spiel speichern (Album, z. B. 24 Plätze) und **als Bild an die Wand hängen**. (B2) Das Album füllt sich von selbst mit datierten Momenten in Linas Stimme: „12. Mai – Thalia ist eingezogen“.
- **1** „Weißt du noch?“ – Blättern in der eigenen Geschichte · **2** Monats- und Jahres-Loop · **3** Fotomodus bekommt einen Zweck; Wandbilder verbinden ihn mit dem Einrichten · **4** wächst mit jeder Spielstunde, wird nie „fertig“ · **5** keine Sternchen; Wandbild ohne Katalogpreis · **6** Speicherplatz: Bilder in `localStorage` sind teuer → kleine Vorschaubilder, feste Obergrenze, in Export/Import aufnehmen · **7** stärkt 3 deutlich, außerdem 1 · **8** Einfacher: nur B2 als Textliste ohne Fotos. Schon wertvoll, aber ohne die Verbindung zum Einrichten.
- **Aufwand:** B1 2–3 Tage, B2 1,5–2 Tage. Spielstand-Format ändert sich (Version erhöhen, Migration, Test). **Risiko:** mittel (Speichergröße). **Stärkt:** Fotomodus, Einrichten, Feste, Rahmenhandlung.

### C · Besuch bei Lina

- **Lücke [N]:** Niemand betritt je Linas Haus außer Oli. Stil-Reaktionen gibt es nur als Plauderzeile (`game/erinnerungen.ts`, Tags `stil-*`).
- **Idee:** Ab und zu klopft ein Bewohner, kommt herein, schaut sich um und sagt zwei, drei Sätze zu dem, was wirklich da steht. Lina kann auch selbst einladen („Komm doch mal vorbei“). Kein Punktesystem, keine Bewertung.
- **1** Stolz: „Jens steht in meinem Wohnzimmer und findet es fabelhaft“ · **2** Wochen-Loop · **3** Einrichten bekommt Publikum; die vorhandenen 94 Erinnerungszeilen werden zur Szene · **4** Jeder Umbau lädt zu einem neuen Besuch ein · **5** keine · **6** Bewertungsgefühl vermeiden: nur warme Kommentare, nie Kritik am Haus; Christin darf *ein* Kissen geraderücken · **7** stärkt 3, 4 und 5 zugleich · **8** Einfacher: Besuch nur auf Einladung, ohne spontanes Klopfen. Halber Aufwand, kaum schlechter.
- **Aufwand:** 2–3 Tage (Einladung) bzw. 3–4 (mit spontanem Klopfen). **Risiko:** mittel (Wegfindung im Haus). **Stärkt:** Einrichten, Erinnerungen, Stile.

### D · Rekordfänge

- **Lücke [N]:** Fische haben keine Größe (`size` in `data/species.ts` ist nur die Schattengröße). Ein Fang bringt nach dem ersten Mal nur Sternchen. Audit 1 nannte das „die häufigste Aktivität hat die geringste Systemtiefe“; W6 gab Fängen Verwendung, aber kein eigenes Erfolgserlebnis.
- **Idee:** Jeder Fang hat eine Länge; das Sammelbuch merkt sich den größten je Art („Mein größter Hecht: 87 cm“). Selten ein Prachtexemplar mit kleinem Funkeln. Kein Geschick, kein Preisaufschlag.
- **1** „Oh, der ist größer als mein alter!“ · **2** Mikro-Loop, direkt im häufigsten Handgriff · **3** Jeder Wurf kann etwas Besonderes sein · **4** hält Angeln auch nach dem vollen Sammelbuch interessant · **5** bewusst keine Wirtschaft (sonst wird Angeln noch dominanter) · **6** Jagd nach Rekorden könnte Grind erzeugen → Verteilung so, dass Rekorde nebenbei fallen, kein Ziel im Notizbuch · **7** stärkt 4, verträgt sich mit 2 · **8** Einfacher: nur das Prachtexemplar als seltener Moment, ohne Zahlen im Buch.
- **Aufwand:** 1,5–2 Tage, kleines neues Feld im Spielstand. **Risiko:** gering. **Stärkt:** Angeln, Sammelbuch; optional Olafs Angeltreff („Zeig mal her!“).

### E · Seltene Momente

- **Lücke [N]:** Kaum Ungeplantes. Wer drei Wochen spielt, kennt jeden Tagesablauf.
- **Idee:** eine Handvoll seltener, wiederkehrender Momente ohne Belohnungsdruck: Sternschnuppen-Nacht, Flaschenpost am Strand (mit einem Gedicht, nicht mit erfundener Familiengeschichte), Nebelmorgen, ein Igel im Garten, Winston bringt etwas Albernes.
- **1** „Huch, was ist das?“ · **2** Wochen- bis Monats-Loop · **3** Erkunden lohnt wieder · **4** Die Welt bleibt ein bisschen unvorhersehbar · **5** höchstens ein Deko-Stück als Andenken · **6** FOMO → alles kehrt wieder, nichts ist einmalig; keine Ankündigung, keine Liste · **7** stärkt 5 (und die fehlende „Discovery“) · **8** Einfacher: zwei statt sechs Momente bauen und im Playtest schauen, ob Lina sie bemerkt.
- **Aufwand:** 0,5–1 Tag je Moment. **Risiko:** gering. **Stärkt:** Welt, Album (B2).

### F · „Mit Thalia trainieren“

- **Lücke [N]:** Seit PR #134 redet Thalia ständig vom Studio, und in ihrer Wohnung steht eine Hantelbank – gemeinsam trainieren kann man nicht.
- **Idee:** In Thalias Wohnung (und wenn sie bei Lina zu Besuch ist, siehe C) „💪 Zusammen trainieren“: die vorhandene Stemm-Szene, Thalia feuert an. Ohne Freundschaftspunkte, wie beim Training mit Oli (Audit 3).
- **1** ein gemeinsamer Moment mit der besten Freundin · **2** Mikro, kein Tages-Abholpunkt · **3** verbindet Thalias neue Persönlichkeit mit einer Handlung · **4** Charakter, kein Ziel · **5** keine · **6** keine, solange ohne Punkte · **7** stärkt 1 · **8** Einfacher geht es kaum; ein Studio-Gebäude im Dorf wäre deutlich teurer und nicht besser.
- **Aufwand:** 0,5–1 Tag. **Risiko:** gering.

### G · Dorf-Verschönerungen (G1 aus Audit 3)

- **Lücke [N]:** Nach ≈ 487 000 ⭐ haben Sternchen keinen Zweck; die Welt ändert sich nur durch 7 Wunsch-Orte.
- **Idee:** 6–8 Projekte an der Dorfkasse (Lichterketten am Platz, Blumenkübel, Pavillon, Bootssteg …), jedes verändert das Dorf sichtbar, mit kleiner Einweihung.
- **1** „Das Dorf ist schöner, weil ich hier wohne“ · **2** Monats-Loop · **3** Sternchen bekommen einen Zweck nach dem Haus · **4** stark · **5** neue Senke ≈ 100–150 k ⭐ – **verlängert** den Weg, statt ihn zu füllen, wenn es zu früh kommt · **6** Grind-Gefühl; neue 3D-Modelle und Pflege · **7** stärkt 3 und 5 · **8** Einfacher: zwei Projekte als Test – oder das Geld-Problem gar nicht lösen, wenn Lina „genug Sternchen“ als Freiheit empfindet.
- **Aufwand:** 5–7 Tage. **Risiko:** mittel bis hoch. **Erst nach dem Playtest** – ob Sternchen „leer“ wirken, ist reines [P].

### H · Gegenseitige Besuche der Bewohner

- **Lücke [N]:** Bewohner treffen sich nur draußen an fünf festen Orten.
- **Idee:** Tagesabläufe um Besuche ergänzen (Oma bei Olaf zum Kaffee, Lars bei Jens). Klopft Lina dann, sind zwei da und reden.
- **1** „Ach, Oma ist auch hier!“ · **2** Wochen-Loop · **3** Häuser von innen werden lebendiger · **4** mittel · **5** keine · **6** Bewohner schwerer zu finden → Karte zeigt sie weiter · **7** stärkt 5 · **8** Einfacher: nur eine Plauderzeile („Oma war vorhin da“).
- **Aufwand:** 2–3 Tage. **Risiko:** mittel (Tagesablauf-Logik, Wegfindung).

### I · Selbst malen

- **Idee:** eine kleine Leinwand (Pixelraster), das Bild hängt an der Wand oder geht in Jens' Galerie.
- **1** etwas Eigenes schaffen · **3** verbindet Galerie und Einrichten · **7** stärkt 3 · **8** Einfacher: Foto als Wandbild (B1) erfüllt denselben Wunsch nach „etwas von mir an der Wand“ für ein Drittel des Aufwands.
- **Aufwand:** 4–5 Tage. **Urteil:** 💡 erst prüfen, wenn B1 gut ankommt.

### J · Händler, Turniere, neue Gebiete

| Idee | Befund | Urteil |
|---|---|---|
| Fliegender Händler / Wochenmarkt | Samenstand und Galerie wechseln schon täglich [N]. Ein Händler braucht neue Ware → Katalog-Budget (259 k von 300 k). Seltenes Angebot erzeugt leicht FOMO. | nicht empfohlen |
| Angel-/Insektenturnier | Wettbewerb heißt Wertung und Verlieren – gegen Säule 2. Als „Angelfest mit Olaf“ ohne Sieger denkbar, dann aber kaum mehr als das vorhandene Treffen. | später, vielleicht |
| Neue Gebiete (Wald, Berg, Insel) | Größter Aufwand (1–2 Wochen: Karte, Gelände, Arten, Wege). Erkunden würde profitieren, aber E leistet das billiger. | nicht vor dem Playtest |
| Musikinstrument | Neue Insel ohne Verbindung. Die Jukebox und der Plattenspieler erfüllen den Wunsch nach Musik im Haus. | nicht empfohlen |

### K · Kleines und Offenes aus unseren Dokumenten

| Punkt | Befund | Urteil |
|---|---|---|
| Hundekörbchen im Katalog | Es ist baubar (6 Äste + 2 Wildblumen), das Rezept kommt von Oma beim 2. Herz [N]. Kaufbar würde Omas Geschenk entwerten. | ❓ E3 – ich empfehle: so lassen |
| Omas Geburtstag | Das Datum fehlt in den Daten [N]. Alle anderen haben einen. | ❓ E4 – Datum nennen, dann 0,5 Tage |
| Oli-Tempo (M3) | unverändert, 5 Herzen in 3–4 Tagen [N] | nach dem Playtest |
| Lars' Bedingung 5 000 → 7 500 ⭐ | Audit 4, A5 | nach dem Playtest |
| Katalog-Favoriten / Suche | 287 Einträge; ob Lina etwas nicht findet, ist [P] | nach dem Playtest |
| Geräusche für Kochen, Gießen, Kaufen | hörend nicht geprüft | Playtest-Frage |

### Verdichten statt erweitern

- 💡 **Keine weitere Möbel- oder Stilwelle.** 297 Modelle in 17 Stilen sind für eine Spielerin sehr viel; das Budget ist zu 86 % belegt [N].
- 💡 **Keine neuen Einmal-am-Tag-Dinge.** Es sind rund 20 (Audit 3). Alle Vorschläge oben kommen ohne aus.
- 💡 **`world3d/models/furniture.ts` (≈ 4 060 Zeilen) und `World3D.ts` (≈ 4 400 Zeilen) aufteilen**, bevor etwas Größeres dazukommt. Das ist kein Spielerlebnis, senkt aber das Risiko jeder weiteren Änderung.
- Entfernen würde ich nichts. Snake und Training sind Inseln, kosten aber nichts und sind als Gag gedacht.

---

## Phase 3 – Priorisierung und Empfehlung

Bewertung: ●●● hoch · ●● mittel · ● gering. Wirkung ist [V], bis ein Playtest sie bestätigt.

| # | Idee | Wirkung | Aufwand | Risiko | Welle |
|---|---|---|---|---|---|
| A | Freundschaften-Seite | ●●● | ● | ● | ✅ umgesetzt (Welle 1) |
| F | Mit Thalia trainieren | ●● | ● | ● | ✅ umgesetzt (Welle 1) |
| B2 | Album der Momente (Text) | ●●● | ● | ● | ✅ umgesetzt (Welle 1) |
| – | **Playtest mit Lina** | ●●● | ●● | – | **vor Welle 2** |
| B1 | Fotos im Spiel + Wandbild | ●●● | ●● | ●● | 2 |
| C | Besuch bei Lina (auf Einladung) | ●●● | ●● | ●● | ✅ umgesetzt |
| D | Rekordfänge | ●● | ● | ● | 2 |
| C | Besuch bei Lina (auf Einladung) | ●●● | ●● | ●● | 2 |
| D | Rekordfänge (mit Köder) | ●● | ● | ● | ✅ umgesetzt |
| E | Seltene Momente (2 als Test) | ●● | ● | ● | 2 |
| H | Bewohner besuchen einander | ●● | ●● | ●● | 3 |
| G | Dorf-Verschönerungen | ●● | ●●● | ●●● | 3 – nur wenn Sternchen leer wirken |
| I | Selbst malen | ●● | ●●● | ●● | 3 – nur wenn B1 gut ankommt |

**Warum diese drei jetzt:** A, F und B2 schließen Lücken, die im Code nachweisbar sind, kosten zusammen etwa vier bis fünf Tage, ändern keine Balance und fügen kein neues System hinzu. Sie machen außerdem den Playtest ergiebiger: Lina sieht ihre Freundschaften und ihre Geschichte.

**Warum der Rest wartet:** Bei C, D, E, G hängt die richtige Größe an Fragen, die nur Lina beantwortet: Richtet sie viel ein? Angelt sie gern oder nur fürs Geld? Fehlt ihr Überraschung? Wirken Sternchen irgendwann leer?

### Was der Playtest vorwegnimmt

| Beobachtung | Entscheidet über |
|---|---|
| Wie viel Zeit verbringt Lina mit Einrichten? | C (Besuch), I (Malen), weitere Möbel |
| Angelt sie gern, oder ist es Arbeit? | D (Rekorde), Einnahmen-Balance |
| Sagt sie „schon wieder dasselbe“? | E (seltene Momente), H |
| Sammeln sich Sternchen ungenutzt? | G (Dorf-Projekte) |
| Macht sie Fotos? | B1 (Album, Wandbild) |
| Findet sie im Katalog, was sie sucht? | Favoriten/Suche |

### Nicht empfohlen

| Idee | Warum nicht |
|---|---|
| Weitere Stile/Möbelwellen | Budget fast voll, Breite ist nicht das Problem |
| Händler mit seltenem Angebot | FOMO-Nähe, braucht neue Ware |
| Wettbewerbe mit Rangliste | Verlieren passt nicht zu Säule 2 |
| Neue Gebiete jetzt | teuerste Option, Nutzen ungeprüft |
| Bedürfnisse (Hunger, Schlaf) | Zeitdruck; ausdrücklich nicht die Richtung |
| Freundschaftsstufen über 5 Herzen | mehr Zahlen ohne neues Verhalten |
| Tagesziele, Serien, Abzeichenlisten | gegen Säule 2 und die Anti-Manipulations-Regeln |
| Hundekörbchen kaufbar | entwertet Omas Geschenk |

### Offene Entscheidungen ❓

| # | Frage | Meine Empfehlung |
|---|---|---|
| E1 | Welle 1 (A, F, B2) jetzt bauen – oder zuerst der Playtest? | Welle 1 jetzt, danach Playtest |
| E2 | Album: nur Text (B2) oder gleich mit Fotos und Wandbild (B1)? | erst B2; B1, wenn Lina den Fotomodus nutzt |
| E3 | Hundekörbchen zusätzlich im Katalog? | nein |
| E4 | Wann hat Oma Gisela Geburtstag? | Datum nennen, dann baue ich es ein |
| E5 | Prüffrage „Kann Lina hier etwas selbst entdecken?“ in `DESIGN_PILLARS.md` aufnehmen? | ja |
| E6 | Besuch bei Lina: nur auf Einladung oder auch spontanes Klopfen? | zuerst nur auf Einladung |

### Reihenfolge in kleinen Schritten

**A · Freundschaften-Seite**
1. Merken, was Lina wem geschenkt hat und wie es ankam (Logik + Test).
2. Seite im Notizbuch: Herzen mit Füllstand, entdeckte Lieblingsdinge.
3. Treffen, die Lina schon gesehen hat, und der Satz zum nächsten Herz.

**F · Mit Thalia trainieren**
1. Menüpunkt an Thalias Hantelbank, vorhandene Stemm-Szene, Thalias Zeilen.

**B2 · Album der Momente**
1. Momente als Daten (Einzüge, Feste, Oli-Szenen, erste Fänge, Ausbaustufen) mit Datum festhalten; Migration füllt Vergangenes aus vorhandenen Flags nach, soweit möglich.
2. Albumseite im Notizbuch, in Linas Stimme.

**B1 · Fotos im Spiel** (nach dem Playtest)
1. Foto klein speichern, Album zeigt es; Obergrenze und Export/Import.
2. Foto als Wandbild aufhängen.

**C · Besuch bei Lina** (nach dem Playtest)
1. „Komm doch mal vorbei“: Bewohner steht im Haus, Kommentare aus den vorhandenen Stil-Tags.
2. Eigene Zeilen zu einzelnen Möbeln (wie Linas Kommentare in den Gasthäusern, nur umgekehrt).
3. Optional spontanes Klopfen.

---

## Selbstkritik

- **Ich habe das Spiel mitgebaut.** Die grünen Ampeln stammen aus derselben Feder wie die Systeme. Wo ich „solide“ schreibe, heißt das: im Code vollständig und getestet – nicht: von Lina für gut befunden.
- **Die Audits 2, 3 und 4 haben jeweils „erst Playtest“ empfohlen, und jedes Mal wurde weitergebaut.** Welle 1 ist eine vierte Ausnahme. Ich halte sie für vertretbar, weil sie nichts Neues aufmacht. Wer streng sein will, wählt bei E1 den Playtest zuerst.
- **Meine Aufwandsschätzungen waren zuletzt zu niedrig**, wenn 3D-Wegfindung im Spiel war (Café, Häuser von innen). C und H habe ich deshalb mit mittlerem Risiko angesetzt.
- **Das Raster belohnt Vollständigkeit.** Ein Spiel für eine Person muss nicht alle 12 Kästchen füllen. Händler, Turniere und Gebiete fehlen – und ich empfehle, es dabei zu lassen.

## Entscheidungen der Nutzerin/des Nutzers (14. Nov. 2026)

E1 Welle 1 jetzt ✅ · E2 Album erst als Text ✅ · E3 Hundekörbchen nicht im Katalog ✅ · E4 Omas Geburtstag: erst einmal offen ❓ · E5 Prüffrage „Kann Lina hier etwas selbst entdecken?“ ja · E6 Besuch bei Lina nur auf Einladung ✅ (🗓️). Dazu: **Rekordfänge ja** – und zusätzlich seltenere Exemplare, besondere Fänge und bastelbare bzw. von Winston ausgebuddelte Spezialköder, die garantiert ein besonderes Exemplar bringen (🗓️, eigener PR).
