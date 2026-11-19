# Narrative- und Dialog-Audit – Rina no Chiisana Sekai

> **Stand:** 19.11.2026 · **Umfang:** alle Spieltexte in `src/` (ohne Tests) · **Art:** reine Analyse.
> Für dieses Audit wurde **keine Spieldatei verändert**: kein Text entfernt, keine Mechanik, Dialogstruktur oder Trigger angefasst.
> Alle Vorschläge in Teil 4 sind Empfehlungen und warten auf eine Entscheidung.

**Belastbarkeit** (wie im [Game-Design-Audit](../game-design/README.md)):
- **[N] Nachweis:** steht so im Code, in `CLAUDE.md` oder in der Doku.
- **[V] begründete Vermutung:** Geschmacksurteil oder Lesart, gut begründet.
- **[P] nur durch Playtest prüfbar:** z. B. wie oft eine Zeile im Spiel wirklich erscheint.

**Teil 3** (Bewertung jeder einzelnen Zeile) steht wegen der Länge in eigenen Dateien unter [`audit-zeilen/`](audit-zeilen/).

---

## Inhalt

1. [Gesamtbewertung](#teil-1--gesamtbewertung)
2. [Charakterprofile und -bewertungen](#teil-2--charakterprofile-und--bewertungen)
3. [Zeilentabelle (Verweis)](#teil-3--bewertung-jeder-zeile)
4. [Problematische Texte mit Alternativen](#teil-4--problematische-texte-priorisiert-mit-alternativen)
5. [Wiederkehrende Probleme](#teil-5--wiederkehrende-probleme)
6. [Maßnahmenplan](#teil-6--maßnahmenplan)
7. [Anhang: Methode](#anhang-methode)

---

## Teil 1 – Gesamtbewertung

### Zahlen

| Kennzahl | Wert |
|---|---|
| Erfasste String-Literale | **5.008** (4.523 in der Hauptauswertung + 485 Kurzzeilen) |
| Davon technisch, ohne Spieltext (CSS-Klassen, Schriften, Schlüssel, Entwicklermeldungen) | 197 |
| **Bewertete Spieltexte** | **4.811** |
| Durchschnitt Sinnhaftigkeit / Humor / Charaktertreue / Natürlichkeit | 8,8 / 7,2 / 8,7 / 8,8 |
| **Durchschnitt Gesamt** | **7,8** |
| Gesamt ≥ 9 (sticht heraus) | 470 Zeilen (≈ 10 %) |
| Gesamt = 10 (herausragend) | 16 Zeilen |
| Gesamt ≤ 5 (fehlerhaft, sollte geändert werden) | **106 Zeilen** (≈ 2,2 %) |
| Gesamt = 6 (schwach) | 184 Zeilen |
| Wortgleiche Dubletten (> 25 Zeichen) | 33 Gruppen, davon ~20 im Dialog |

**Skala:**
- **8** heißt solide: Die Zeile funktioniert und stört nicht.
- **9** heißt, die Zeile hat eine eigene Idee oder eine echte Pointe.
- **10** heißt, man würde sie zitieren.
- **≤ 5** heißt, es gibt einen klaren Fehler: Logik, Fakten, Grammatik oder eine Pointe, die nicht zündet.

Reine UI- und Beschreibungstexte stehen meist bei 8. Das hebt den Durchschnitt. Zum Vergleich der Durchschnitt nur über die **Figurenstimmen**:

| Figur | Zeilen (alle Dateien) | Gesamt Ø | Humor Ø | ≤ 5 | ≥ 9 |
|---|---|---|---|---|---|
| Lina (Innenstimme, Album) | 201 | 7,99 | 7,4 | 4 | 28 |
| Oli | 468 | 7,76 | 7,5 | 12 | 72 |
| Jens | 333 | 7,56 | 7,2 | 13 | 18 |
| Thalia | 257 | 7,55 | 7,3 | 7 | 15 |
| Oma Gisela | 446 | 7,50 | 6,9 | 25 | 60 |
| Olaf | 263 | 7,49 | 6,9 | 12 | 24 |
| Christin | 248 | 7,44 | 7,2 | 3 | 7 |
| Lars | 261 | 7,43 | 7,1 | 12 | 12 |

### Kurzfazit

Die Texte des Spiels sind **warm, sprachlich sauber und fast durchgehend im richtigen Ton**: gemütlich, liebevoll, nie zynisch gegenüber der Spielerin. Auf dieser Ebene gibt es keine strukturellen Probleme. Das Spiel fühlt sich wie ein Geschenk an. **[V]**

Die Schwächen liegen woanders:

1. **Humor ist die schwächste Dimension (Ø 7,2).**
   - Viele Pointen werden erklärt („Verstehst du? Wachs mal! Stift!“).
   - Manche lösen sich in Gedankensprüngen auf, die nicht tragen (z. B. OLA-093, OLI-095, THA-042).
   - Andere sind Allerwelts-Kalauer.
   - Die besten Witze sind fast immer **beobachtend** und **figurengebunden** (KATER-013, FURNIT-276, STRAUS-006), nicht konstruiert. **[V]**
2. **Figuren werden durch Formeln behauptet statt gezeigt.**
   - „Das letzte Wort“ steht 17-mal im Bestand, meist als wörtliche Behauptung von oder über Gisela.
   - „ordentlich“ oder „Ordnung“ steht in 87 Zeilen, die meisten von oder über Christin.
   - Jens sagt 83-mal „chérie“.
   - Je öfter eine Eigenschaft benannt wird, desto flacher wirkt die Figur. Die stärksten Zeilen zeigen die Eigenschaft, ohne sie zu nennen (KURZ-100 „… Ich. Natürlich.“, FURNIT-276 „Er hing schon gerade.“). **[N]** für die Zählung, **[V]** für die Wirkung.
3. **Faktenfehler gegen das Figurenkonzept** (fast alle leicht zu beheben). **[N]**
   - Lars arbeitet im „Krankenhaus“, obwohl er eine Praxis hat.
   - Thalia wird von anderen Figuren als Stein-, Fossilien- und Wanderfan beschrieben, obwohl das Konzept sagt: „kaum“.
   - Jens hat einen Schnurrbart.
   - Gisela hat einen Stock.
   - Capicola und Gabagool sind vertauscht.
   - „Verlorene Autobahn“ wird als Schwarz-Weiß-Film bezeichnet.
   - Lars’ Lieblingsbuch ist „Dune“, das ist aber Olis Thema.
4. **Zwei echte Grammatikfehler im System**, die bei jedem Spieldurchlauf sichtbar werden. **[N]**
   - „Larss Häuschen“ / „Jenss Häuschen“.
   - „Die Lavendel keimt“ / „Morgen wächst die Kürbis“.
5. **Dubletten.**
   - Ganze Dialogblöcke stehen zweimal im Code (Jens: 10 Zeilen).
   - Olafs Witze stehen sowohl im Plauder-Pool als auch im Witzkalender, vier davon auch bei Lars.
   - Christin verschickt den gleichen Herz-Brief zweimal. **[N]**

### Stärken (beibehalten, als Maßstab nutzen)

- **Ludwig-Zeilen.** Die Trauer ist warm, nie schwer (INTERA-037/039, WISHES-012, FURNIT-252). Das ist der emotional stärkste Strang des Spiels.
- **Herzenswünsche und Pater-Matteo-Briefe.** Die höchste durchgehende Qualität im Bestand (WISHES Ø 7,9, MATTEO Ø 8,6).
- **Figuren im Gespräch untereinander.** Café, Treffen und Paargespräche sind oft besser als die Einzelzeilen (MEETUP-067 „Weil es mich nichts fragt.“, CAFEGA-037/042/063).
- **Olafs Beamtenblick auf Gefühle.** STRAUS-006 („Ich trage ihn unter ‚Freude‘ ein.“), FURNIT-068 („Meine beste Investition. Papa.“), ALBUM-003. Hier ist die Formel nicht leer, sondern zärtlich.
- **Oli-Stufen und der Fernseher.** OLISTU-026 („Linas kleine Welt … Jetzt ist es unsere.“), TV-018/019, TV-071.
- **Beschreibungstexte** (Möbel, Gegenstände, Arten). Erstaunlich viele kleine, liebevolle Pointen („Ein Fahrrad, das Sessel werden wollte“, „Gustav, Ingrid und der kleine Dieter“). FURNIT hat 429 Zeilen und keine einzige ≤ 5.

### Ehrliche Einordnung der Herkunft

Die Texte stammen aus vielen Sitzungen, geschrieben von verschiedenen Modellen. Die Muster oben ziehen sich gleichmäßig durch alle Dateien. Es gibt keine „gute“ oder „schlechte“ Quelle. **[V]** Typische KI-Schreibmuster sind klar erkennbar:
- Dreiersätze mit Schlusspointe: „Fast.“ 21-mal, „Natürlich.“ 11-mal.
- „X und Y gleichzeitig“.
- „Das hast du von mir“.
- Erklärte Pointen.
- Generische Liebesformeln („Mit dir ist jeder Tag ein guter Tag“).

Sie sind nicht falsch, wirken aber in der Masse austauschbar. **[V]**

---

## Teil 2 – Charakterprofile und -bewertungen

Für jede Figur: **Konzept** (laut `CLAUDE.md`), **Ist-Stimme** (wie sie tatsächlich klingt), **Stärken**, **Schwächen**, **Fremdbild** (wie andere über sie reden) und **Empfehlung**.

### Lina (Spielerin; Innenstimme, Album, Erzähler in Du-Form)

- **Konzept:** kocht leidenschaftlich, trägt Schwarz und Oversize, liebt Horror, True Crime, Datingshows, Cola Zero und Budweiser (dezent), will Thalia verkuppeln.
- **Ist-Stimme:** ruhig, beobachtend, selbstironisch. Die beste „Stimme“ des Spiels, weil sie nicht über Formeln definiert ist (Ø 7,99). **[N]**
- **Stärken:** ALBUM-035 („Sie hat Zeit. Ich auch, wenn ich bei ihr bin.“), ITEMS-098 (Käse „ist nicht lange sicher“), TRAINI-199–201 („Technik, Oli.“), COFFEE-024 („Es ist okay.“).
- **Schwächen:**
  - **Wechsel der Perspektive.** Der Fernseher spricht Lina mal mit „Du“ an (TV-057/064/071), mal mit „Lina“ in der dritten Person (TV-108/120). Gleiches gilt für Hinweise. **[N]**
  - **Kleine Faktenfehler.** Lina mit „Haarknoten“ (TIPSY-054, sie trägt offene Locken), „lila Lieblingspulli“ (OLI-171), Rosa-Schal ohne Bezug zu ihrem Schwarz (ITEMS-131). **[N]**
  - **Selten in der eigenen Stimme:** Kochleidenschaft, Datingshows und der Verkupplungsplan für Thalia kommen fast nur über andere Figuren vor (z. B. OLI-110, CHR-093). **[V]**
- **Empfehlung:** Eine feste Perspektive pro System (Erzähler = „du“, Album und Innenstimme = „ich“). Linas Leidenschaften (Kochen, Verkuppeln) in ein paar Album- und Innenstimmen-Zeilen zeigen.

### Oli (Freund; höchste Bindung)

- **Konzept:** nennt Lina „Lini“, zockt mit Lars, liebt Sci-Fi („Blade Runner“, „Dune“), „Berserk“ und „Sopranos“ mit Lina, trägt immer Schwarz, bester Freund Mo.
- **Ist-Stimme:** warm, nerdig, leicht tollpatschig, ehrlich verliebt. Die glaubwürdigste Partnerfigur (Ø 7,76, 72 Zeilen ≥ 9). **[N]**
- **Stärken:**
  - Insider-Details (Hardcore-Songs, Sandwurm, GTA-Verkehrsregeln).
  - Der Fernseher: Oli als Ventil für schwere Themen (TV-018/019/037/059/066).
  - Sternbilder („Der Rest ist Gefühl.“).
  - COFFEE-022 („Im Café. Von Fremden.“).
- **Schwächen:**
  - **Faktenfehler:**
    - Capicola und Gabagool vertauscht (OLI-139/140).
    - Er „liest im Netz“, dass man aus Kürbis Suppe macht, obwohl er kocht (OLI-045/046).
    - „oder bestelle was … tu so, als hätte ich gekocht“ (INSEL-037).
    - „lila Lieblingspulli“ (OLI-171). **[N]**
  - **Kuss-Pool:** 5 von ~12 Varianten enden wortgleich mit „Ich liebe dich, Lini.“ (OLI-213/218/221/224/227). Das Wort wird dadurch abgenutzt. **[N]**
  - **Dritte Person über Lina** in einem Gespräch mit Lina: „Lini ist richtig lustig, wenn sie ein Feierabendbier hatte“ (OLI-129). Wirkt wie für ein anderes Publikum geschrieben. **[N]**
  - **Generische Liebesformeln** (OLI-158, 194, 203, 220).
- **Fremdbild:** Gisela und Jens beschreiben ihn liebevoll. JEN-086 („Und diese Arme! … Künstlerisches Interesse!“) kippt bei einem Onkel gegenüber dem Freund der Nichte ins Klischee, das das Konzept ausdrücklich vermeiden will. **[V]**
- **Empfehlung:** Kuss-Schlüsse variieren (kleine Beobachtungen statt Formel). Faktenfehler korrigieren. Mehr Momente, in denen Oli etwas *tut*, statt Liebe zu erklären.

### Oma Gisela

- **Konzept:** aus Dessau, immer das letzte Wort, denkt zu viel nach, misstrauisch gegenüber Ärzten, „köstlich!“ / „pfui!“, Likör und Zigarette dezent, Witwe von Ludwig.
- **Ist-Stimme:** frech, herzlich, rechthaberisch. Viele der besten *und* viele der schwächsten Zeilen (Ø 7,50, 25 Zeilen ≤ 5, 60 Zeilen ≥ 9). **[N]**
- **Stärken:**
  - Ludwig (WISHES-012 „Das war die Kleine.“, INTERA-037/039).
  - Gezeigte Rechthaberei (KURZ-100, ITEMS-089 „Pfui. … Gib mal ein Stück.“, KURZ-017 „Köstlich. Pfui. Köstlich.“).
  - FURNIT-137 („Wo sind die Gläser?“).
- **Schwächen:**
  - **„Das letzte Wort“** steht 17-mal im Bestand, oft wörtlich als Satz („Ich hab das letzte Wort.“ GIS-196, GIS-218, TIPSY-046, ERINNE-041/042, WINSTO-026 …). Das ist das deutlichste Beispiel für Behaupten statt Zeigen. **[N]**
  - **Verwandtschafts-Perspektive falsch:** „Dein Ludwig“ (GIS-306), „von seinem Großvater“ (GIS-079), „Mein Enkel ist jetzt Arzt“ zu Lina (GIS-102), „Ratet mal“ (GIS-095). Diese Zeilen klingen, als hätte jemand von außen über die Familie geschrieben. **[N]**
  - **Faktenfehler:** Lars im „Krankenhaus“ (GIS-078), Gisela mit Stock (GESCHE-052), Jens mit Schnurrbart (GESCHE-051), Thalia als Wanderin mit Steinen (GIS-099). **[N]**
  - **Variantenmüdigkeit:** „zu dünn“ (4-mal), „Das hast du von mir“ (6-mal in der Familie), „… Doch, ist es.“, „Die wollen nur dein Geld“ (2-mal), Party-Zeilen doppelt (GIS-008/009 = GIS-100/101). **[N]**
  - **Kaputte Wortspiele:** GIS-075 (Obaachan → „Hund namens Bachan“), GIS-032 (US-Klischee „bergauf in beide Richtungen“).
  - **Dessau** kommt kaum vor. Stattdessen „wie früher an der Ostsee“ (GIS-253), was Olafs und Christins Geschichte ist. **[N]**
- **Empfehlung:** „Letztes Wort“ als *Szenenmuster* statt als Satz (sie beendet Gespräche, kontert, hat den Schlusssatz). Verwandtschaftsbezüge aus ihrer Sicht formulieren. Dessau statt Ostsee.

### Olaf (Papa; Finanzamt, Dorfkasse)

- **Konzept:** Finanzamt, Zwillingsbruder von Jens („Frère“), liest „Das kleine Arschloch“, früher mit Christin an der Ostsee. Dad-Jokes sind ausdrücklich gewünscht.
- **Ist-Stimme:** pedantisch-zärtlich, Kalauer-Fan. Die Kalauer sind gewollt, dürfen also flach sein. Sie müssen aber *funktionieren* (Ø 7,49, Humor 6,9). **[N]**
- **Stärken:**
  - Gefühle in Verwaltungssprache: STRAUS-006, FURNIT-068, ALBUM-003, FURNIT-127.
  - Die besten Zeilen sind die, in denen die Bürokratie *Liebe* ausdrückt.
- **Schwächen:**
  - **Witze ohne Mechanik:** OLA-171 (Socken/„Ungerades“), OLA-179 (Ruhe abgeben), OLA-093 (Eisrechnung → „bargeldlos essen“), OLA-158 („Abschreibungen pflanzen“), INSEL-047 („in Schwärmen lernen“). Ein Dad-Joke braucht ein echtes Wortspiel. **[V]**
  - **Erklärte Pointen und „Hehe“** als Lückenfüller (9-mal). **[N]**
  - **Dubletten:** 6 Witze stehen im Plauder-Pool *und* im Witzkalender (OLA-034/164, 036/159, 038/170, 042/167, 046/177, 030/169). 4 davon erzählt auch Lars (LAR-059/060/063/064). **[N]**
  - **Formeln:** „Christin lacht nie“ / „Christin hat nicht gelacht“ (3-mal), „steuerlich absetzbar“ (5-mal), „verbuchen“.
  - **Grammatik und Satzzeichen:** OLA-033 („Einen davon war Herr Meier“), OLA-053 (verschachtelte Anführungszeichen), OLA-170 („Karamel“).
  - **Untypisch:** Rülpsen mit Spruch (JEN-179) passt nicht zum trockenen, korrekten Olaf. **[V]**
- **Empfehlung:** Witzkalender und Plauder-Pool trennen (jeder Witz nur einmal). Nicht funktionierende Witze durch echte Kalauer ersetzen (siehe Teil 4). Mehr „Beamtenblick auf Gefühle“, weniger Steuer-Floskeln.

### Christin (Olafs Freundin)

- **Konzept:** sehr ordentlich, achtet auf Sauberkeit, mag „Das kleine Arschloch“ nicht, früher an der Ostsee.
- **Ist-Stimme:** freundlich, korrekt, ein bisschen steif. Die einseitigste Figur: „ordentlich“ / „Ordnung“ in 87 Zeilen des Bestands, die meisten von oder über sie, dazu „gerade“, „sortiert“, „an seinem Platz“. **[N]**
- **Stärken:**
  - Wenn Ordnung Zuneigung ausdrückt: CHR-040, 127, 129.
  - SAMMLU-011 („Bitte hänge sie auch gerade auf.“), FURNIT-170 (kämmt Fransen), FURNIT-276 („Er hing schon gerade.“), INTERA-042 (Lina rückt den Stein gerade).
  - Die Ansteckungs-Gags (andere werden ordentlich) sind die besten Christin-Witze.
- **Schwächen:**
  - **Kaum ein Leben außerhalb der Ordnung:** keine Hobbys, keine Ostsee-Erinnerungen, kein Humor, der nicht aus der Ordnung kommt. Nur 7 Zeilen ≥ 9. **[N]**
  - **„Ordnungstipp:“** wird als Rahmen für Tipps genutzt, die nichts mit Ordnung zu tun haben (CHR-143/145/147/153/157/161). Wirkt erzwungen. **[N]**
  - **Dubletten:** Herz-Brief mit weißen Tulpen zweimal (CHR-114/125), „Jedes Konfetti einzeln“ zweimal (CHR-012/041).
  - **Stilbrüche:** „gleich-ish“ (CHR-109), „Ich tanze!“ ohne Vorbereitung (KURZ-086/089).
  - **Fremdbild:** Lars bekommt Christins Fugen-Gag (ERINNE-118). Farbsortieren widerspricht sich zwischen Olaf und Christin.
- **Empfehlung:** 1–2 eigene Themen ergänzen (Ostsee, eine heimliche Schwäche, z. B. Süßes oder Krimis). Den Rahmen „Ordnungstipp“ nur für echte Ordnungstipps nutzen, sonst einfach „Tipp:“. Mehr Zeilen, in denen sie *nicht* über Ordnung spricht.

### Jens (Onkel; Bistro, Galerie)

- **Konzept:** Coach und Dandy, Französisch und Sächsisch (nach der Schule nach Leipzig gezogen), Kunst, Reisen, „ein bisschen fabelhaft“ (liebevoll, nie klischeehaft), Zwilling von Olaf, Sonntagsessen.
- **Ist-Stimme:** die markanteste eigene Stimme im Spiel: französische Floskeln, sächsische Einsprengsel, Glitzer, Großzügigkeit (Ø 7,56). **[N]**
- **Stärken:**
  - GALLER-013 („Ich muss mich setzen. Nu, das gibt’s doch nicht!“), TASSEN-025 („ich hab mich stilvoll verbrannt“), FURNIT-070 („Er hat darauf bestanden.“), FURNIT-141 („Und dort. Und dort.“), ART-008 (Christin vs. Jens).
- **Schwächen:**
  - **Dialektfehler** (für Sächsisch-Kundige sofort hörbar). **[N]**
    - „gell“ ist süddeutsch (6-mal).
    - „isch eene Gaiststung“ (JEN-032) ist unverständlich.
    - „Gieggerle“ ist schwäbisch (JEN-169).
    - „wa?“ ist berlinerisch (ERINNE-124, BESUCH-031).
    - „Un des is gud so“ (ITEMS-064) ist hessisch/süddeutsch.
  - **Floskel-Inflation:** „chérie“ 83-mal, „Magnifique“ 9-mal, „Oh là là“, „très chic“, „Olé!“. Jens wird dadurch zur Schablone. **[N]** / **[V]**
  - **Dubletten:** JEN-054–061 = JEN-182–191 (8 Zeilen), JEN-014 = JEN-071. **[N]**
  - **Logik:** Zwillings-Reihenfolge verdreht (JEN-069), Lars-Witz ohne Pointe (JEN-177, schlechteste Zeile im Bestand), „für das Vase“ (GESCHE-026, Jens spricht fließend Französisch und Deutsch). **[N]**
  - **Haltung:** „Saft für dich“ (UNTERN-175) behandelt die erwachsene Lina wie ein Kind.
- **Empfehlung:** Dialekt einmal von einer sächsisch sprechenden Person gegenlesen lassen. Französisch sparsamer, aber gezielter einsetzen. Dubletten löschen.

### Lars (großer Bruder, Arzt)

- **Konzept:** Praxis/Apotheke, immer einen Spruch („So, und nicht mit e …“), Bier (dezent), zockt mit Oli, Sumo-Fan, bester Freund Ronny (Polizist).
- **Ist-Stimme:** großer Bruder mit Arzthumor. Funktioniert, ist aber am stärksten auf eine Formel gebaut: „ärztlich …“ 35-mal im Bestand (Ø 7,43, nur 12 Zeilen ≥ 9). **[N]**
- **Stärken:**
  - FURNIT-058 (Skelett mit Fliege), FURNIT-059 (Teddy-OP), FURNIT-216 („Wie ich.“), SAMMLU-006 („Der Stempel ist echt. Ich hab ihn gefunden.“), MEETUP-067, CRAFTP-005 (gibt Oma ausnahmsweise recht).
- **Schwächen:**
  - **„Krankenhaus“** im Präsens (LAR-042, LAR-034, GIS-078), obwohl er eine Praxis hat. **[N]**
  - **Fremde Themen:**
    - Steine-Hobby und Wolframit (WISHES-106/108) sind im Konzept nicht belegt.
    - Dune als Lieblingsbuch (POSTER-010, KURZ-183) gehört laut Konzept zu Oli.
    - Fallout/Halo (1 Zeile), Sumo (2 Plauderzeilen plus Unternehmung) und Ronny (2 Zeilen) sind gemessen am Konzept dünn. **[N]**
  - **Witze von Olaf übernommen** (4 Dubletten).
  - **Erzwungene Varianten des Lieblingsspruchs:** „Hotel-Tier“ (WISHES-056), LAR-054/055 (Aufbau ohne Bezug zur Pointe).
  - **Fachwort falsch:** „Anamnese“ (BESUCH-034/036).
  - **Briefmuster** „Oma sagt … ist ihr Rezept … stimmt doch“ 3-mal (LAR-142/144 …).
  - **Bier beim Arzt:** CAFEGA-023 („Mittagspause, ärztlich genehmigt“) ist grenzwertig gegenüber „dezent“. **[V]**
- **Empfehlung:** „Ärztlich“ halbieren. Sumo, Fallout/Halo, Ronny und den Bruder-Alltag stärker zeigen. Dune zu Oli zurück. Steine-Wunsch mit dem Konzept abgleichen (❓ offene Frage).

### Thalia (beste Freundin, Geografin)

- **Konzept:** Gym (am liebsten mit Lina), Party (Clubs, Hauspartys, Samstagsparty), Karten und Reisen. Gesteine und Fossilien „nur ein Nebenbei … kommen in ihren Gesprächen und in ihrer Wohnung kaum vor“. Eine Woche Studienreise mit Lina nach Tschechien. Lina will sie verkuppeln.
- **Ist-Stimme:** In **ihren eigenen Zeilen** konzepttreu: energisch, laut, herzlich, Gym- und Party-Mensch (THA, TRAINI: „Wunder in Oversize“, „Dieter hat sich das verdient“; FURNIT-064 „Wegen der Architektur im Hintergrund.“) (Ø 7,55). **[N]**
- **Schwächen:**
  - **Fremdbild widerspricht dem Konzept.** Andere Figuren und Texte schreiben ihr Steine, Fossilien, Geologie und Wandern zu. Mindestens 11 Zeilen nennen Thalia und Steine im selben Satz, dazu Briefe und Wünsche:
    - GIS-099, OLI-119/120, ERINNE-169, GESCHE-068, FESTIV-025/040/075, MEETUP-048/069, RECIPE-033, FURNIT-115/235, INTERA-068, SAMMLU-008, die Matteo-Briefe 005–007.
    - In der Summe ist „Thalia = Steine“ dadurch ein **Hauptmerkmal**, obwohl es nach dem Konzept nur eine Fußnote sein soll. **[N]**
  - **Geo-Pointen ohne Logik:** Sonnenuntergang „vermessen“ (THA-020, MEETUP-060/068), „Geografisch“ als Allzweck-Pointe (THA-042).
  - **Schwache Konter für Gisela:** THA-034.
  - **Verkuppeln** (Linas Wunsch) und die **Tschechien-Reise** kommen je etwa einmal pro Figur vor (THA-094/095/099, OLI-110/111, LAR-091/092, CHR-093, JEN-092, GIS-063). Das ist ein guter Ansatz, aber dünn für zwei Kernthemen. ALBUM-015 übertreibt die Reise zu „wie früher auf Reisen“. **[N]**
  - **Veraltet:** Unternehmungs-Intro spricht von „Bankdrücken“, das Spiel sind Kniebeugen (UNTERN-024). **[N]**
- **Empfehlung:** Die Stein-Zeilen *bei den anderen Figuren* auf Gym, Party, Karten und Reisen umlenken. Pater Matteo darf ihr gern Steine schicken, aber höchstens als ein Thema unter vielen. Tschechien-Erinnerungen und Verkuppel-Momente ergänzen.

### Winston, Kater und Nebenfiguren

- **Winston** (Ø 8,0) und **Kater** (Ø 8,3): Beschreibungen sind genau beobachtet (KATER-013 Bauch-Falle, FURNIT-022 „Genau dackelgroß“).
  - Fehler: KATER-017 (Grammatik), WINSTO-027 („plumpst wieder hoch“).
  - Igor kommt wie gewünscht nur in Erinnerungen vor. **[N]**
- **Pater Matteo** (Ø 8,6): die literarisch besten Briefe im Spiel (Esel-Tombola, Ammonit als Türstopper). Einzige Kritik: das Steine-Thema (siehe Thalia).
- **Dr. No / Fernseher:** gut geschrieben und respektvoll. Zwei Punkte:
  - Die Datingshow endet in **allen** Folgen traurig. Lina mag Formate „à la First Dates“, die gerade von gelungenen Dates leben. **[V]**
  - Die Nachrichten sind ausnahmslos bedrückend. Als Kontrast zum gemütlichen Dorf ist das eine bewusste Entscheidung. Ein heller Beitrag pro Sendung würde den Tonbruch abmildern (❓ offen). Folgentitel nur mit Name und Gewicht („Ronny, 280 Kilo“) widersprechen dem respektvollen Ansatz, und „Ronny“ ist bereits Lars’ bester Freund. **[N]**

---

## Teil 3 – Bewertung jeder Zeile

Die vollständige Tabelle (5.008 Einträge, **jede** Zeile mit S/H/C/N/G und Kommentar) liegt in [`audit-zeilen/`](audit-zeilen/):

| Datei | Bereich | Einträge | davon bewertet | Ø Gesamt | ≤ 5 |
|---|---|---|---|---|---|
| [01-gisela.md](audit-zeilen/01-gisela.md) | Oma Gisela (`npcs/gisela.ts`) | 332 | 332 | 7,38 | 16 |
| [02-olaf.md](audit-zeilen/02-olaf.md) | Olaf (`npcs/olaf.ts`) | 179 | 179 | 7,24 | 12 |
| [03-christin.md](audit-zeilen/03-christin.md) | Christin (`npcs/christin.ts`) | 162 | 162 | 7,35 | 2 |
| [04-oli.md](audit-zeilen/04-oli.md) | Oli (+ Oli-Stufen, Sternbilder, Kaffee) | 319 | 319 | 7,63 | 10 |
| [05-jens.md](audit-zeilen/05-jens.md) | Jens (+ Galerie, Bilder) | 225 | 219 | 7,67 | 8 |
| [06-lars.md](audit-zeilen/06-lars.md) | Lars (`npcs/lars.ts`) | 167 | 167 | 7,46 | 5 |
| [07-thalia.md](audit-zeilen/07-thalia.md) | Thalia (+ Pater Matteo, Training) | 192 | 192 | 7,68 | 5 |
| [08-dialogsysteme.md](audit-zeilen/08-dialogsysteme.md) | Erinnerungen, Wünsche, Café, Treffen, Insel, Besuche, Feste, Unternehmungen, Album, TV … | 1.554 | 1.553 | 7,82 | 39 |
| [09-inhalte.md](audit-zeilen/09-inhalte.md) | Gegenstände, Möbel, Arten, Funde, Garten, Tassen, Poster … | 965 | 946 | 8,02 | 2 |
| [10-oberflaeche.md](audit-zeilen/10-oberflaeche.md) | UI, Systemtexte, Hinweise | 428 | 317 | 7,95 | 3 |
| [11-kurzzeilen.md](audit-zeilen/11-kurzzeilen.md) | Nachtrag: kurze Zeilen (< 12 Zeichen, Ausrufe, Titel) | 485 | 425 | 7,98 | 4 |

Jede Zeile hat eine feste **ID** (z. B. `GIS-099`) mit Datei und Zeilennummer. Die IDs werden in Teil 4–6 verwendet. Zeilennummern beziehen sich auf den Stand von `main` zum Zeitpunkt des Audits.

---

## Teil 4 – Problematische Texte, priorisiert, mit Alternativen

**Prioritäten:**
- **Kritisch:** sichtbarer Sprach- oder Systemfehler bei jedem Spieler, oder harter Widerspruch zum Figurenkonzept.
- **Hoch:** klarer Logik-, Fakten- oder Grammatikfehler.
- **Mittel:** Pointe zündet nicht, Formel, Dublette.
- **Niedrig:** Geschmack, Feinschliff.

Platzhalter (`{dorf}`, `${name}` …) bleiben in den Vorschlägen erhalten. Die Vorschläge sind **Formulierungsangebote**, keine fertigen Änderungen.

### 4.1 Kritisch

| ID | Datei:Zeile | Figur / Kontext | Original | Problem | Alternative | Begründung |
|---|---|---|---|---|---|---|
| KURZ-405, KURZ-406 | `world3d/World3D.ts:1802, 1808` | Anklopfen am Haus (Titel + erste Zeile) | `${npc.def.name}s Häuschen` | Ergibt „Larss Häuschen“ und „Jenss Häuschen“. **[N]** | `${name}${/[sßxz]$/.test(name) ? '’' : 's'} Häuschen` → „Lars’ Häuschen“, „Jens’ Häuschen“, „Olafs Häuschen“ | Duden-Regel: Apostroph statt Genitiv-s nach s-Laut. Bei jedem Besuch sichtbar. |
| KURZ-402 | `world3d/World3D.ts:1640` | Beet anschauen | `Die ${name} ${stage}.` | Artikel fest feminin: „Die Lavendel keimt.“, „Die Kürbis …“, „Die Thymian …“, „Die Vergissmeinnicht …“. **[N]** | Ohne Artikel, da der Name schon im Titel steht: Stufe als eigener Satz, z. B. „Frisch eingesät.“ / „Keimt schon.“ / „Wächst kräftig heran.“ / „Hat eine Knospe.“ | Kein Artikel nötig, kein Datenfeld nötig, immer korrekt. |
| WORLDD-028 | `world3d/World3D.ts:1628` | Gießen (Toast) | Gegossen! Morgen wächst die ${name} ein Stück. 💧 | Wie oben: „die Kürbis“, „die Lavendel“. **[N]** | Gegossen! Bis morgen wächst es ein Stück weiter. 💧 | Neutral, gilt für jede Pflanze. |
| WORLDD-034 | `world3d/World3D.ts:1636` | Winterruhe | Im Winter ruht das Beet. Erst im Frühling wächst sie weiter – oder in einem Frühbeet oder Gewächshaus. ❄️ | „sie“ fest feminin. **[N]** | Im Winter ruht das Beet. Erst im Frühling geht es weiter – oder in einem Frühbeet oder Gewächshaus. ❄️ | Neutral. |
| WORLDD-143 | `world3d/World3D.ts:4825` | Möbel nachkaufen | Noch eins ${name}? Dafür reichen die Sternchen nicht. ⭐ | Ungrammatisch („Noch eins Kissen?“). **[N]** | Noch ein Stück „${name}“? Dafür reichen die Sternchen nicht. ⭐ | Grammatisch für jedes Genus. |
| UNTERN-024 | `data/unternehmungen.ts:100` | Thalia, Intro Training | Drück genau dann, wenn der Punkt in der Mitte ist. Wie beim Bankdrücken. Nur ohne Schweiß. | Das Spiel sind Kniebeugen. **[N]** | Drück genau dann, wenn der Punkt in der Mitte ist – ganz unten in der Kniebeuge. Nur ohne Muskelkater. | Passt zur Mechanik (ZUSAMM-009). |
| OLI-139 | `data/npcs/oli.ts:114` | Oli, Sopranos | Ich hab heute Morgen „Capicola“ gesagt wie Tony in den „Sopranos“. | Tony sagt „Gabagool“. **[N]** | Ich hab heute Morgen beim Bäcker „Gabagool“ gesagt. Wie Tony. Die Verkäuferin hat nur genickt. | Fakt korrekt; Pointe durch Situation. |
| OLI-140 | `data/npcs/oli.ts:114` | Oli, Folgezeile | Du hast gelacht. Mission erfüllt. Morgen mach ich das mit „Gabagool“. | Folgefehler. | Du hast gelacht. Mission erfüllt. Morgen probier ich’s mit „Madonn’“. | Neues Sopranos-Zitat statt Fehler. |
| GIS-078 | `data/npcs/gisela.ts:75` | Gisela über Lars | Der Lars hat ja so viele Verehrerinnen im Krankenhaus. | Lars hat eine Praxis. **[N]** | Der Lars hat ja so viele Verehrerinnen im Wartezimmer. Die sind gar nicht alle krank. | Fakt korrekt; Gisela-typisches Misstrauen. |
| LAR-042 | `data/npcs/lars.ts:61` | Lars | Im Krankenhaus nennen sie mich „Dr. Lars“. | Präsens widerspricht der Praxis. **[N]** | In der Praxis nennen mich alle nur „Dr. Lars“. | Fakt korrekt. |
| LAR-034 | `data/npcs/lars.ts` | Lars | Auf der Weihnachtsfeier im Krankenhaus wollte jede Kollegin neben mir sitzen. | Wie oben. | Früher, auf der Weihnachtsfeier im Krankenhaus, wollte jede Kollegin neben mir sitzen. | Vergangenheit klar. |
| GESCHE-051 | `data/geschenkSprueche.ts:66` | Gisela, Geschenk Wels | Ein Wels! Mit dem Schnurrbart? Der sieht aus wie dein Onkel. Aber der redet wenigstens. | Jens hat keinen Bart (den Schnurrbart trägt Oli). **[N]** | Ein Wels! Mit Schnurrbart. Wie dein Oli. Nur schweigsamer. Köstlich. | Fakt korrekt; Pointe klarer. |
| GESCHE-052 | `data/geschenkSprueche.ts:67` | Gisela, Geschenk Krabbe | Eine Krabbe? Die zwickt! Und ich hab nichts, womit ich mich wehren kann. Außer meinem Stock. | Gisela hat keinen Stock (GIS-243). **[N]** | Eine Krabbe? Die zwickt! Und ich hab nichts, womit ich mich wehren kann. Außer meiner Meinung. | Konzepttreu (starke Meinung). |
| GIS-306 | `data/npcs/gisela.ts:208` | Gisela, Brief | … Dein Ludwig hat damals so eins für unseren Waldi gebaut … | Ludwig ist Linas Opa. **[N]** | … Dein Opa Ludwig hat damals so eins für unseren Waldi gebaut … | Richtige Perspektive. |
| GIS-079 | `data/npcs/gisela.ts:75` | Gisela | Das hat er von seinem Großvater. … | Großvater = Giselas eigener Mann. **[N]** | Das hat er von meinem Ludwig. Der wusste auch nie, wie er dazu kam. Er hat nur freundlich gelächelt. Das reicht manchmal. | Aus ihrer Sicht, mit Ludwig-Wärme. |
| GIS-102 | `data/npcs/gisela.ts:87` | Gisela | Mein Enkel ist jetzt Arzt im Dorf. | Zu Lina sagt man „dein Bruder“. **[N]** | Dein Bruder ist jetzt Arzt im Dorf. Ich erzähl’s jedem. Zweimal. | Natürlich; zeigt Stolz. |
| GIS-099 | `data/npcs/gisela.ts:85` | Gisela über Thalia | Ich back ihr was. Sie ist so dünn von all dem Wandern. Und sie redet so viel über Steine. | Widerspricht Thalias Konzept (Gym/Party, Steine „kaum“). **[N]** | Ich back ihr was. Die rennt jeden Tag ins Fitnessstudio – da muss ja was nachkommen. | Konzepttreu; behält Omas Fürsorge. |
| OLI-119, OLI-120 | `data/npcs/oli.ts:104` | Oli über Thalia | Thalia hat mir erklärt, wie man aus Gestein Musik macht. / … der Stein war tatsächlich ein bisschen laut. | Thalia + Gestein. **[N]** | Thalia hat mir erklärt, in welchem Land die Clubs am längsten offen haben. Mit Karte. / Ich glaub, sie plant was. Und ich glaub, ich bin eingeladen. | Party + Karten = Thalia. |
| POSTER-010, KURZ-183 | `data/posters.ts:38` | Bildband/Roman | Lars' Lieblingsbuch: ein sehr dicker Science-Fiction-Roman über einen Planeten aus Sand … | Dune gehört laut Konzept zu Oli. **[N]** | **Olis** Lieblingsbuch: ein sehr dicker Science-Fiction-Roman über einen Planeten aus Sand, Politik und sehr langen Namen. Lars: „Ärztlich: nicht auf den Fuß fallen lassen.“ | Konzepttreu; Lars-Pointe bleibt. |
| POSTER-004 | `data/posters.ts:34` | Poster | … ein Schwarz-Weiß-Kultfilm, den keiner versteht … | „Verlorene Autobahn“ (Lost Highway) ist in Farbe. **[N]** | … ein düsterer Kultfilm, den keiner versteht … | Fakt korrekt. |
| WISHES-131 | `data/wishes.ts:414` | Oli, Kino-Wunsch | … Ein alter Schwarz-Weiß-Kultfilm, „Verlorene Autobahn“ … | Wie oben. | … Ein alter Kultfilm, „Verlorene Autobahn“ … | Fakt korrekt. |
| JEN-177 | `data/npcs/jens.ts:207` | Lars-Witz bei Jens | Lars: „Wie nennt man einen Koch, der Witze erzählt? … Jens.“ | Keine Pointe, wirkt wie eine grundlose Spitze. | Lars: „Wie nennt man einen Koch, der beim Kochen singt? … Einen Jens. Und einen, der dabei auch noch sächselt? … Auch einen Jens.“ | Liebevolle Neckerei statt Leere. |

### 4.2 Hoch (Logik-, Fakten-, Grammatikfehler)

| ID | Datei:Zeile | Figur / Kontext | Original | Problem | Alternative | Begründung |
|---|---|---|---|---|---|---|
| GASTHA-069 | `data/gastHaeuser.ts:274` | Lina bei Jens | … Ich würde hier einziehen. Aber ohne Croissants wär ich bald dick. | Logik verdreht; Gewichtsscherz passt nicht zum warmen Ton. | Die grüne Lampe wirft ein warmes Licht. Ich würde hier einziehen. Jens müsste nur die Croissants mitliefern. | Logisch; kein Körper-Gag. |
| GESCHE-026 | `data/geschenkSprueche.ts:37` | Jens, Rose | Eine Rose! Non, nicht für das Vase. Für die Seele. | „das Vase“. | Eine Rose! Non, nicht für die Vase. Für die Seele. | Grammatik. |
| GESCHE-045 | `data/geschenkSprueche.ts:60` | Gisela, Vergissmeinnicht | … Auch wenn ich es dir sicher nicht vergessen würde. | Unverständlich. | Vergissmeinnicht … Wie schön, dass du mich nicht vergisst. Als ob ich das zulassen würde. | Klar; Gisela-Pointe. |
| GESCHE-008 | `data/geschenkSprueche.ts:16` | Olaf, Keks | Den heb ich mir für zur Zeitung auf. … | „für zur“. | Ein Keks? Den heb ich mir für die Zeitung auf. Zum „kleinen Arschloch“ passt ein Keks hervorragend. | Grammatik. |
| GESCHE-064 | `data/geschenkSprueche.ts:83` | Thalia, Crêpes | Das ist Kohlenhydratladen vor dem Training. | „Kohlenhydratladen“ = ein Laden. | Crêpes! Kohlenhydrate laden vor dem Training. Oder danach. Oder einfach so. Danke! | Gemeintes Wort. |
| GIS-095 | `data/npcs/gisela.ts:83` | Gisela | … Ratet mal, welcher. | Plural; Gisela spricht mit Lina allein. | … Rate mal, welcher. | Grammatik. |
| GIS-075 | `data/npcs/gisela.ts:73` | Gisela, Obaachan | Obaachan. Hm. Klingt, als hätte ich einen Hund, der Bachan heißt. … | Wortspiel trägt nicht. | Obaachan. Hm. Klingt wie ein Kuchen, den ich noch nicht kenne. Aber von dir lass ich’s mir gefallen. | Gisela-Assoziation (Kuchen), hörbar. |
| GIS-032 | `data/npcs/gisela.ts:51` | Gisela, Schnee | … Bergauf. In beide Richtungen. | US-Klischee, Dessau ist flach. | Da sind wir mit dem Schlitten zur Schule. In Dessau. Wo es keinen einzigen Berg gibt. Wir waren trotzdem schnell. | Dessau statt Klischee; Selbstironie. |
| GIS-253 | `data/npcs/gisela.ts` | Gisela, Hering | Ein Hering! Wie früher an der Ostsee! | Ostsee ist Olafs/Christins Vergangenheit. | Ein Hering! Den hat Olaf mir immer von der Ostsee mitgebracht. Eingelegt. Köstlich. | Familiengeschichte korrekt verknüpft. |
| GIS-248 | `data/npcs/gisela.ts:163` | Gisela, Seestern | … da war ich so klein wie du damals. | Zeitbezug verdreht. | Ein Seestern! So einen hab ich zuletzt gesehen, da war ich so klein wie Winston. | Klar, bildhaft. |
| GIS-037 | `data/npcs/gisela.ts:53` | Gisela | … Ja, ich weiß, du bist mein einziger Besuch. Trotzdem. | Später falsch (Familie im Dorf). **[P]** | … Ja, ich weiß, du bist mein Lieblingsbesuch. Trotzdem. | Gilt in jeder Spielphase. |
| GIS-276 | `data/npcs/gisela.ts:179` | Erzähler | Die Tür bleibt trotzdem zu. Typisch Oma. | Widerspruch zur Einladung; Wertung der Erzählstimme. | Von drinnen ruft es: „Erst Schuhe aus!“ – Typisch Oma. | Zeigt statt Wertung. |
| OLA-033 | `data/npcs/olaf.ts:53` | Olaf | … Einen davon war Herr Meier. | Grammatik. | … Einer davon war Herr Meier. | Grammatik; Detail bleibt. |
| OLA-053 | `data/npcs/olaf.ts:63` | Olaf | „… Es heißt: „Hallo, ich bin Olaf – und das ist meine Steuernummer.““ | Verschachtelte Anführungszeichen kaputt; kein Wortspiel. | Olaf: „Zu spät! Ich hab schon eins im Anflug: Was macht ein Finanzbeamter im Urlaub? … Er bucht.“ | Echtes Wortspiel (buchen); Anführung korrekt. |
| OLA-171 | `data/npcs/olaf.ts:160` | Witzkalender | Warum trägt der Mathematiker so selten Socken? Er hat immer schon genug Ungerades. | Pointe ergibt keinen Sinn. | Warum hat der Mathematiker immer nur eine Socke an? Weil die andere ungerade ist. | Ungerade = einzeln; nachvollziehbar. |
| OLA-179 | `data/npcs/olaf.ts:168` | Witzkalender | Warum ist das Finanzamt so ruhig? Weil dort jeder seine Ruhe abgibt. … | Wortspiel funktioniert nicht. | Warum ist es im Finanzamt so ruhig? Weil alle ihre Erklärung schon abgegeben haben. | Erklärung abgeben = still sein; trägt. |
| OLA-092, OLA-093 | `data/npcs/olaf.ts:82` | Olaf | Sommerzeit ist Beleg-Zeit im Urlaub … / … Eisrechnung gefunden. Seitdem esse ich bargeldlos. | Verworren / Non sequitur. | Im Sommer sammle ich Quittungen wie andere Muscheln. / Am Strand hab ich neulich eine Eisrechnung gefunden. Ich hab sie abgeheftet. Unter „Fundsachen“. | Olaf-Logik nachvollziehbar. |
| OLA-170 | `data/npcs/olaf.ts:159` | Witzkalender | … Ein Karamel. | Dublette (OLA-038) und Schreibfehler. | Einen der beiden streichen; Schreibweise „Karamell“. | Duden. |
| OLA-037 | `data/npcs/olaf.ts:55` | Olaf | … Ich hab mich bei der Steuerprüfung heute kurz wie ein Geist gefühlt. | Olaf ist der Prüfer, nicht der Durchschaute. | … Ich hab bei der Steuerprüfung heute auch wieder alles durchschaut. Hehe. | Rolle richtig. |
| OLA-131 | `data/npcs/olaf.ts:109` | Olaf, Brief | … Ich hab sie nicht gebraucht. Ich hab ihn gefragt, ob sie rot sind. … soll man gehört haben … | Holprig. | Liebe Lina,⏎⏎ein Kollege vom Amt hat mir rote Sonnenblumen-Samen geschenkt. Ich hab dreimal nachgefragt, ob sie wirklich rot werden. Er hat dreimal „ja“ gesagt.⏎⏎Gelb und Rot nebeneinander, heißt es, ergibt Orange. … | Klare Satzfolge; Olaf-Gründlichkeit. |
| OLI-045, OLI-046 | `data/npcs/oli.ts:67` | Oli, Kürbis | Ich hab im Netz gelesen, dass man aus einem Kürbis auch Suppe machen kann. / Also nicht nur Halloween-Gesicht. … | Oli kocht leidenschaftlich. **[N]** | Kürbiszeit! Ich mach die Suppe, du schnitzt das Gesicht? / Oder andersrum. Hauptsache, am Ende gibt’s beides. Lini, wollen wir? | Konzepttreu; gemeinsames Tun. |
| INSEL-037 | `data/insel.ts:37` | Oli, Flaschenpost | … oder bestelle was … tu so, als hätte ich gekocht … | Oli kocht gern. | … oder koche dein Lieblingsessen und tu so, als wär’s ganz spontan gewesen … | Konzepttreu. |
| OLI-171 | `data/npcs/oli.ts:138` | Oli, Brief | … Wie dein Lieblings-Pulli. Also … fast. | Linas Lieblingspullis sind grün, grau und schwarz. **[N]** | … Wie der Himmel an unserer Herzbank. Also … fast. | Korrekt; romantische Verknüpfung. |
| OLI-095 | `data/npcs/oli.ts:91` | Oli | … Möwe klaut mein Brot. Das ist der eigentliche Zusatzgewichtsplan. | Pointe ohne Sinn. | Dann kommt eine Möwe und klaut mein Proteinbrot. Die ist jetzt stärker als ich. | Nachvollziehbar. |
| OLI-129 | `data/npcs/oli.ts:109` | Oli zu Lina | Lini ist richtig lustig, wenn sie ein Feierabendbier hatte. … | Spricht in der dritten Person zu ihr. | Du bist richtig lustig nach einem Feierabendbier, Lini. Am liebsten ein Budweiser, ich weiß. | Direkte Anrede. |
| LAR-101 | `data/npcs/lars.ts` | Lars zu Lina | Meine kleine Schwester wird nach einem Bier richtig lustig. | Wie oben. | Du wirst nach einem Bier ja richtig lustig, Schwesterherz. Ärztlich: ein Bier. Brüderlich: ich lach mit. | Direkt; dezent. |
| OLISTU-043 | `data/oliStufen.ts:95` | Oli | … Es zieht sich mehr Mühe. | Falsche Redewendung. | „Im Herbst sieht man das Meer am besten. Es gibt sich mehr Mühe.“ | Redewendung korrekt. |
| THA-042 | `data/npcs/thalia.ts:62` | Thalia | … Ich hab da so ein Gespür. Geografisch. | Non sequitur. | Ich hätte sofort gewusst, dass es der Hund war. Die Spur führte direkt zum Körbchen. Ich kann Karten lesen. | Geografin-Logik trägt. |
| THA-020 | `data/npcs/thalia.ts:49` | Thalia | Ich hab den Sonnenuntergang vermessen. … Abweichung von null. | Ohne Logik (3 Varianten). | Ich hab den Sonnenuntergang auf meiner Karte eingetragen. Mit Herzchen. Wissenschaftlich unhaltbar. | Karten statt Messen; Selbstironie. |
| THA-083 | `data/npcs/thalia.ts:83` | Thalia | … wie die Brote hier hochgekommen sind. | Unklar; Wandern ist nicht ihr Thema. | Sonst steh ich vier Stunden später in einem Club in Prag und frage mich, wie ich da hingekommen bin. Wie damals mit dir. | Party + Tschechien-Reise. |
| TRAINI-007 | `data/training.ts:19` | Lina | … Die Hantel ist so schwer, die Wärmflasche wäre neidisch. | Vergleich ohne Sinn. | Geschafft! Ein Satz mit richtig viel Gewicht. Jetzt ein Kaffee und die Wärmflasche – verdient. | Linas Wärmflasche sinnvoll eingebaut. |
| UNTERN-005 | `data/unternehmungen.ts:70` | Gisela, Memory | Ich weiß sogar noch, was der Bäcker 1987 für ein Brötchen wollte. Unverschämt. | Unklar. | Ich weiß sogar noch, was der Bäcker 1987 für ein Brötchen verlangt hat. Unverschämt. | „verlangt“ = Preis. |
| UNTERN-016 | `data/unternehmungen.ts:82` | Gisela | … ich zieh dir die Hammelbeine lang. Liebevoll. | Redewendung heißt „zurechtweisen“. | Ordentlich! Noch eine Runde, und ich zeig dir, wo der Hammer hängt. Liebevoll. | Passende Revanche-Redewendung. |
| UNTERN-154, UNTERN-159 | `data/unternehmungen.ts` | Olaf / Album | … Bei der mit dem Krake. / … beim Krake geflunkert … | Deklination („Kraken“); „geflunkert“ widerspricht „gezweifelt“. | … Bei der mit dem Kraken. / Rätselecke mit Papa: Bei der Kraken-Frage hat er kurz gezweifelt. Drei Herzen hat er. Der Krake, nicht Papa. | Grammatik und Konsistenz. |
| KATER-017 | `data/kater.ts:45` | Erzähler | Ein kleines Miau. Was heißt „Du bist okay“. | Grammatik. | Ein kleines Miau. Das heißt: „Du bist okay.“ | Grammatik. |
| WINSTO-027 | `data/winston.ts:123` | Erzähler | … und plumpst wieder hoch. Fast! | „plumpsen“ heißt fallen. | … und springt gleich wieder hoch. Fast! | Wortbedeutung. |
| WISHES-138 | `data/wishes.ts` | Oli | Hängt es irgendwo auf … | Plural; gemeint ist Lina. | Häng es irgendwo auf, wo ich es nachts im Vorbeigehen sehe. … | Grammatik. |
| CAFEGA-065 | `data/cafeGaeste.ts:118` | Jens zu Gisela | Es sind acht, Gisela. … | Chez Jens hat 10 Tische (Doku). **[N]** | Es sind zehn, Gisela. Und alle stehen gerade. | Fakt korrekt. |
| MEETUP-035 | `data/meetups.ts:80` | Szene | Pssst. Olaf hat mir gerade erklärt, dass Fische keine Ohren haben. … | Rollen vertauscht. | Pssst. Ich hab Olaf gerade erklärt, dass Fische keine Ohren haben. Er flüstert trotzdem. | Konsistent mit der Szene. |
| MEETUP-039, MEETUP-044 | `data/meetups.ts` | Lars ↔ Oli | „Und als Bruder?“ / „Bruderrat“ | Lars ist Linas Bruder, nicht Olis. | „Und als Schwager in spe?“ / Er hat „Schwagerrat“ gesagt. | Familienlogik; zarter Hinweis auf die Beziehung. |
| ERINNE-024, CAFEGA-061 | `data/erinnerungen.ts`, `data/cafeGaeste.ts` | Olaf u. a. | … Stimmung pro Euro unschlagbar. | Im Spiel wird in Sternchen gerechnet. | … Stimmung pro Sternchen unschlagbar. | Spielwelt-Konsistenz. |
| INSEL-063 | `data/insel.ts` | Thalia, Brief | Lina!⏎⏎plan für den Strand … | Kleinschreibung nach Ausrufezeichen. | Lina!⏎⏎Plan für den Strand … | Rechtschreibung; systemisch prüfen (Teil 5). |
| TIPSY-054 | `data/tipsy.ts:94` | Christin | … Und an deinem schiefen Haarknoten. | Lina trägt offene Locken. | Du hast ein Glas gehabt, oder? Ich seh es an deinem Lächeln. Und daran, dass deine Locken heute machen, was sie wollen. | Konzepttreu; Christin-Blick. |
| TIPSY-070 | `data/tipsy.ts:103` | Lars | Ich schreib es dir auf. Wenn ich meinen Stift treffe. | Klingt, als wäre Lars betrunken. | Ich schreib es dir auf. Morgen. Wenn du es wieder lesen kannst. | Pointe bei Lina, wohin sie gehört. |
| TIPSY-064, ERINNE-124, BESUCH-031, JEN-032, JEN-169, ITEMS-064 | diverse | Jens, Dialekt | „gell“, „wa?“, „isch eene Gaiststung“, „Gieggerle“, „Un des is gud so“ | Nicht sächsisch. **[N]** | „nu?“ / „gelle“ → „nu“; „wa?“ → „nu?“; „isch eene Gaiststung“ → „das is ä Genuss, Lina!“; „Gieggerle“ → „Broiler in Rotwein“; „Un des is gud so“ → „Un das is gud so!“ | Sächsisch: „nu“, „ä“, weiche Konsonanten, „Broiler“ (DDR/Sachsen). Gegenlesen lassen. |
| JEN-069 | `data/npcs/jens.ts:78` | Jens, Zwillinge | Er hat fünf Minuten länger gebraucht, um sich zu trauen. Ich kam mit Stil. | Reihenfolge verdreht (Olaf ist älter). **[V]** (wer älter ist, ist im Text festgelegt) | Ich sag: Er war fünf Minuten früher da, weil er pünktlich sein wollte. Ich kam später – mit Stil. | Logisch; beide Charakterzüge. |
| ALBUM-013 | `game/album.ts:41` | Lina | Onkel Jens und ich sind richtig dicke. Frère wäre stolz. | „Frère“ benutzen nur Olaf und Jens. | Onkel Jens und ich sind richtig dicke. Papa sagt, er ist fast eifersüchtig. Fast. | Klarer Bezug. |
| ALBUM-005 | `game/album.ts:30` | Lina | … Mehr als ein Wort braucht es nicht, Lini genügt. | Holprig. | Oli und ich: fünf Herzen. Er sagt „Lini“, und mehr muss er gar nicht sagen. | Natürlich. |
| BESUCH-034, BESUCH-036 | `data/besuch.ts` | Lars | … das gilt als Anamnese. | Fachwort falsch (Anamnese = Vorgeschichte erfragen). | Wenn du zu Hause bist, klingel ich. Das gilt als Hausbesuch. | Treffendes Arzt-Wortspiel. |
| WISHES-056 | `data/wishes.ts` | Lars | … So, und nicht mit „Hotel-Tier“ … | Erzwungene Spruch-Variante. | Danke, Lina. Ab sofort bin ich nicht nur Hausarzt, sondern auch Hotelier. Für Bienen. Zimmerservice inklusive. | Pointe ohne Krücke. |
| WISHES-108 | `data/wishes.ts:352` | Lars | Geduld. Das ist Geologie, keine Ungeduld. | Gegensatz ohne Sinn. | Der Wolframit? Geduld. Er liegt seit Millionen Jahren dort. Auf ein paar Tage mehr kommt’s ihm nicht an. | Logisch. |
| LAR-054, LAR-055 | `data/npcs/lars.ts:67` | Lars | Wie schreibt man eigentlich „Praxis Lars“ richtig? / Mit Lars und Praxis. | Aufbau ohne Bezug zur Pointe. | Weißt du, was auf meinem Praxisschild fast gestanden hätte? / „Dr. Lars – Spezialist für Seen.“ So, und nicht mit e! | Spruch wird durch Situation motiviert. |
| LAR-100 | `data/npcs/lars.ts:89` | Lars | Zwei sind eine Meinung. Drei sind ein Fall für mich. … | Unklar. | Einer hat Husten: Pech. Zwei haben Husten: Zufall. Drei haben Husten: Wartezimmer. | Klare Steigerung. |
| LAR-108 | `data/npcs/lars.ts:93` | Lars über Ronny | … Er hat trotzdem gepustet. Ich auch – war ein Witz. | Verwirrend. | Ich hab ihm einmal meinen Arztausweis gezeigt. Er hat trotzdem „Einmal pusten“ gesagt. Freunde eben. | Verständlich; Freundschaft. |
| LAR-028 | `data/npcs/lars.ts` | Lars | Ich verschreibe sie ungern, weil sie gar nicht auf Rezept ist. … | Unlogisch. | Die gibt’s nicht auf Rezept. Leider. Sie hilft mehr als manche Tablette. | Logisch. |

### 4.3 Mittel (Pointe zündet nicht, Formel, Dublette)

| ID | Datei:Zeile | Figur / Kontext | Problem | Alternative / Maßnahme | Begründung |
|---|---|---|---|---|---|
| JEN-182–191 | `data/npcs/jens.ts:182–191` | Jens | Wortgleiche Dublette von JEN-054–061 (+ JEN-014 = JEN-071). **[N]** | Zweiten Block durch neue Zeilen ersetzen, z. B. Reiseerinnerungen: „Weißte, wo ich das beste Croissant meines Lebens gegessen hab? In Leipzig. Sag’s nicht den Franzosen.“ | Gleiche Zeilen kurz hintereinander wirken wie ein Fehler. |
| OLA-159/164/167/169/170/177 + LAR-059/060/063/064 | `npcs/olaf.ts`, `npcs/lars.ts` | Olaf, Lars | Witze doppelt in Pool, Witzkalender und bei Lars. **[N]** | Jeden Witz nur einmal: Kalender = Olaf exklusiv; Lars bekommt eigene Arzt-Kalauer: „Was sagt ein Pflaster zum anderen? Wir halten zusammen.“ / „Warum tanzen Skelette nie? Sie haben keinen Mumm in den Knochen.“ | Wiederholung = Abnutzung; Lars braucht eigenen Humor. |
| CHR-125 | `data/npcs/christin.ts:119` | Christin, Herz-Brief | Gleiches Geschenk und gleicher Tipp wie CHR-114. | Anderes Geschenk, z. B. Lavendelsamen: „… Lavendel hält Motten aus dem Schrank. Und duftet. Zwei Aufgaben, eine Pflanze.“ | Jeder Herz-Brief soll einzigartig sein. |
| CHR-012/041, GIS-008/009 = 100/101, THA-013 = 044, OLA-013/014 = 063/064, OLI-014 = 062, LAR-012 = 053, LAR-052 = 011 | diverse | diverse | Wortgleiche Dubletten in verschiedenen Pools. **[N]** | Je Paar eine Variante neu schreiben. | Spürbar, wenn beide Pools am selben Tag laufen. **[P]** |
| GIS-196, GIS-218, GIS-222, TIPSY-046, ERINNE-041/042, WINSTO-026, BESUCH-009, GASTHA-010 | diverse | Gisela | „Das letzte Wort“ wörtlich. **[N]** | Zeigen statt sagen, z. B. GIS-196: „Ende der Diskussion. … Ja, auch diese.“; ERINNE-041: „Ein Monat, Kind. Und keiner hat mir widersprochen. Einer hat’s versucht.“; WINSTO-026: „Gegen so einen Blick ist man machtlos, Kind. Er bleibt. Und wer was dagegen hat, kann mit mir reden.“ | Eigenschaft wirkt nur, wenn man sie sieht. |
| CHR-143/145/147/153/157/161 | `data/npcs/christin.ts` | Christin, Tipps | „Ordnungstipp:“ bei Nicht-Ordnungsthemen. | Präfix „Tipp:“ oder Ordnung einbauen: „Ordnungstipp: Was du nicht brauchst, gehört aufs Sparbuch – da liegt es ordentlich und wird mehr.“ | Rahmen soll stimmen. |
| CHR-109 | `data/npcs/christin.ts` | Christin | „gleich-ish“ – Jugendsprache. | „Einen Moment, Lina! Ich bin gleich fertig! … Sagen wir: in zwei Minuten. Genau zwei.“ | Christin ist präzise. |
| CHR-093 | `data/npcs/christin.ts:91` | Christin | Verkopft. | „Tisch, Kerzen, passende Servietten. Der Rest darf spontan sein. Ab sieben.“ | Pointe: geplante Spontaneität. |
| OLI-213/218/221/224/227 | `data/npcs/oli.ts` | Oli, Küsschen | Fünfmal „Ich liebe dich, Lini.“ als Schluss. | Variieren: „Du riechst nach Kaffee. Mein Lieblingsgeruch.“ / „Noch eins? … Okay, noch eins.“ / „Ich hab vergessen, was ich sagen wollte. Egal.“ – „Ich liebe dich“ höchstens zweimal im Pool. | Seltenheit macht den Satz wertvoll. |
| OLI-158/194/203/220, THA-124/159 | diverse | Oli, Thalia | Generische Liebes- und Freundschaftsformeln. | Konkrete Erinnerung statt Formel, z. B. THA-159: „Weißt du noch, Tschechien, der Nachtbus? Heute war fast so gut.“ | Konkretes berührt mehr. |
| MEETUP-019/020 | `data/meetups.ts` | Olaf/Gisela | Fast wortgleich aus zwei Perspektiven. | Eine Variante neu: „Gisela hat Olaf erklärt, was ein Keks *emotional* bedeutet. Olaf hat mitgeschrieben.“ | Abwechslung. |
| MEETUP-060, MEETUP-068 | `data/meetups.ts` | Thalia | Sonnenuntergang messen (3. Variante). | „Thalia hat den Sonnenuntergang in ihre Karte eingetragen. Als Lieblingsort.“ | Karten = Thalia. |
| ERINNE-169, GESCHE-068, FESTIV-025/040/075, MEETUP-048/069, RECIPE-033, FURNIT-115/235, INTERA-068, KURZ-168/169, SAMMLU-008 | diverse | Thalia (Fremdbild) | Steine/Geologie als Hauptthema. **[N]** | Auf Gym, Party, Karten und Reisen umlenken, z. B. ERINNE-169: „Viel Beton bei dir! Sieht aus wie ein Club in Berlin. Ich bring die Discokugel.“; RECIPE-033: „Thalia hat dir eine Schaufel geschenkt – vielleicht findest du damit etwas Glänzendes …“ | Konzept: Steine „kaum“. |
| ERINNE-170 | `data/erinnerungen.ts:152` | Olaf | „konkret“ = concrete – nur auf Englisch. | „Viel Beton bei dir, mein Schatz. Solide Anlage. Wertbeständig.“ | Olafs Sprache, deutsches Wortspiel. |
| MEETUP-041 | `data/meetups.ts:96` | Lars | „keinen Body“ – englisch; Lachen behauptet. | „Lars: ‚Sie haben keinen Mumm in den Knochen.‘ – Oli prustet in seinen Kaffee.“ | Deutsch; Reaktion gezeigt. |
| ERINNE-094 | `data/erinnerungen.ts:101` | Oli | „Thalia mit ihrem Sammler“ ohne Kontext. | „Du bist die Beste, Lini. Thalia ist knapp dahinter. Sag ihr das nicht.“ | Verständlich. |
| ERINNE-109 | `data/erinnerungen.ts:111` | Gisela | „Bitte nicht neu streichen“ bei Stoff. | „… Rosa. Bitte nicht schwarz färben.“ | Logik; Linas Schwarz als Gegenpol. |
| INSEL-014 | `data/insel.ts:37` | Gisela | Gedankensprung. | „Hawaii. Pfui, so wenig an! … Aber die Blumenketten: köstlich!“ | Pfui/köstlich mit Bezug. |
| INSEL-047 | `data/insel.ts:109` | Olaf | Kein Wortspiel. | „… Warum sind Fische so schlecht im Sparen? Weil sie immer im Minus-Bereich schwimmen. …“ – oder: „Was macht ein Fisch am Computer? Er geht ins Netz.“ | Funktionierende Kalauer. |
| INSEL-059 | `data/insel.ts:115` | Lars | Unklarer Satz. | „… Das hier ist ein Meer. Und du bist die Einzige, die darin so gut angeln kann. …“ | Klarer Bezug. |
| FESTIV-040 | `data/festivals.ts:41` | Thalia | Vergleich trägt nicht. | „Eine Amethyst-Druse – außen unscheinbar, innen voller Glitzer. Wie ich vor dem ersten Kaffee.“ | Selbstironie trägt. |
| GASTHA-060 | `data/gastHaeuser.ts:203` | Lina | Assoziation trägt nicht. | „Die Praxisuhr geht zwei Minuten vor. Lars sagt, das ist Absicht. Für die Pünktlichen.“ | Beobachtung mit Pointe. |
| GESCHE-036 | `data/geschenkSprueche.ts:49` | Lars | Pointe fehlt. | „Dorsch! Viel Eiweiß, wenig Fett, null Widerworte. Der ideale Patient.“ | Arztblick mit Pointe. |
| GIS-064, GIS-065 | `data/npcs/gisela.ts:68` | Gisela | Konstruierter Vergleich. | „Der Doktor im Fernsehen, den du so gern guckst … / Der guckt wie Ludwig, wenn ich zu viel Zucker in den Kuchen getan hab. Streng. Und dann hat er doch zwei Stück gegessen.“ | Ludwig-Wärme mit Pointe. |
| GIS-091 | `data/npcs/gisela.ts:81` | Gisela | „zu dünn“-Variante, verpufft. | „Ich back ihm was. Wer den ganzen Tag Leute abhorcht, braucht Kuchen.“ | Lars-Bezug statt Formel. |
| JEN-041, JEN-043, JEN-097 | `data/npcs/jens.ts` | Jens | Pointe zerfasert. | JEN-041: „‚Kawaii‘ heißt niedlich? Dann bin ich ab sofort Kawaii-Botschafter. Mit Glitzer.“; JEN-043: „‚Sayonara‘ … klingt fast wie ‚Servus, nu‘. Fast.“; JEN-097: „Wir waren sehr gerührt. Olaf pünktlich, ich schön. Zusammen ein ganzer Zwilling.“ | Klarere Pointe. |
| JEN-086 | `data/npcs/jens.ts:86` | Jens über Oli | Nah am Klischee. **[V]** | „Und er trägt sie mit Würde, diese Arme. Ich sag ja nur: Mein Neffe in spe hat Stil.“ | Liebevoll, ohne Blick-Gag. |
| JEN-179 | `data/npcs/jens.ts` | Olaf | Rülpsen untypisch. | „Olaf faltet die Serviette exakt auf Kante. – Jens: ‚Mei Bruder! Der Mann hat einfach Stil.‘“ | Olaf-typisch; Pointe bleibt. |
| UNTERN-175 | `data/unternehmungen.ts` | Jens | „Saft für dich“ bevormundend. | „Leinwand, Pinsel, Wein für mich, Cola Zero für dich – ich kenn doch meine Nichte!“ | Konzepttreu (Linas Getränk). |
| GIS-097 | `data/npcs/gisela.ts` | Gisela | „Er braucht das.“ unklar. | „Der Jens kriegt den mit mehr Zucker. Der braucht das für seine gute Laune. Die hat er von mir.“ | Klarer Bezug. |
| OLA-072 | `data/npcs/olaf.ts:72` | Olaf | Anti-Witz ohne Inhalt; dritte „Christin lacht nie“. | Durch fertigen Witz ersetzen; Formel streichen. | Formel abgenutzt. |
| OLA-035 | `data/npcs/olaf.ts:54` | Olaf | Erklärt die Pointe, Bus-Satz ohne Bezug. | „‚Wachs mal, Stift!‘ … Hehe. Den hab ich dem Herrn Meier erzählt. Er hat drei Tage nicht mit mir gesprochen.“ | Pointe nicht erklärt. |
| OLA-158 | `data/npcs/olaf.ts:147` | Witzkalender | Kein Wortspiel. | „Was macht ein Steuerberater im Garten? Er zieht Bilanz – und Radieschen.“ | Zwei Bedeutungen von „ziehen“. |
| LAR-014 | `data/npcs/lars.ts` | Lars | Gleiches Schema wie OLA-158, kein Wortspiel. | „Weißt du, was ein Arzt im Garten macht? Er misst den Puls der Radieschen.“ | Bild statt leerem Schema. |
| ZUSAMM-021 | `ui/ZusammenPanel.tsx:574` | UI Sumo | „Zwei gewonnene Runden gewinnen.“ | `${lv?.name ?? ''}: abwechselnd ← und → drücken! Wer zuerst zwei Runden holt, gewinnt.` | Keine Tautologie. |
| WORLDD-009 | `world3d/World3D.ts` | UI Angeln | „ans Wasser … aufs Wasser“. | „Stell dich ans Ufer und schau aufs Wasser, dann kannst du auswerfen. 🎣“ | Wortdopplung weg. |
| KURZ-206, KURZ-207 | `data/tv.ts:73–74` | TV-Titel | Name + Gewicht als Titel; „Ronny“ kollidiert mit Lars’ Freund. **[N]** | „Heikos Treppe“ (Name ändern) / „Sabines erster Spaziergang“ | Respektvoll (Konzept); keine Namenskollision. |
| TV-040 | `data/tv.ts:73` | TV | Name „Ronny“. | Gleichen Inhalt mit anderem Namen (z. B. „Mirko (38)“). | Namenskollision. |
| TASSEN-011 | `data/tassen.ts:35` | Sammeltasse | „danach ist sie weg“ klingt nach FOMO. | „Sie ist nur im Frühling zu haben – nächstes Jahr kommt sie wieder.“ | Designsäule: kein FOMO. |
| PROGRE-018 | `data/progress.ts:91` | Lars | „macht dir einen Ausbau“. | „Papa finanziert dir an der Dorfkasse einen Ausbau – zinslos, ohne Frist. …“ | Wortwahl. |
| PROGRE-011 | `data/progress.ts:62` | Oli | „sammelt Naturgeschichten“ – nicht Jens. | „Jens fragt nach Fotos von den Tieren hier. Er will sie malen.“ | Jens = Kunst. |
| ITEMS-040 | `data/items.ts:87` | Jens-Rezept | „In Hamburg gelernt“ – nicht in seiner Biografie. | „In Leipzig gelernt, in Paris verfeinert, bei dir perfektioniert.“ | Biografie korrekt. |
| ITEMS-131 | `data/items.ts:138` | Omas Schal | Rosa ohne Bezug zu Linas Schwarz. | „Von Oma Gisela gestrickt. Natürlich in Rosa – ‚Schwarz hast du genug.‘“ | Konflikt wird zur Pointe. |
| ITEMS-057 | `data/items.ts:97` | Kräutermischung | „Lars gibt es zu.“ unklar. | „Kamille, Minze und Lavendel. Omas Rezept. Lars gibt zu, dass es hilft.“ | Klarer Bezug. |
| STERNB-007 | `data/sternbilder.ts:42` | Oli | „dreh dich einfach nach oben“. | „Wenn du sie suchst, schau einfach nach oben und denk an mich. Ich guck schon.“ | Wortwahl. |
| FURNIT-307, FURNIT-322 | `data/furniture.ts` | Beschreibung | Schiefe Wendung / Wortdopplung. | „… ein bisschen Theater – und wie gemacht für den Schwarz-Weiß-Zickzack-Boden.“ / „Frisch und leicht wie ein Minzblatt.“ | Sprachfluss. |
| INTERA-022 | `data/interactions.ts:95` | Schwarzes Brett | „ein einzelner Socke“. | „Fundsache: eine einzelne Socke. Bitte beim Brunnen abholen.“ | Standardsprache. |

### 4.4 Niedrig (Feinschliff)

| ID | Problem | Vorschlag |
|---|---|---|
| CAFEGA-023 | Lars mit Bier in der Mittagspause („ärztlich genehmigt“). **[V]** | Abends statt mittags, oder Kaffee: „Lars hat einen doppelten Espresso vor sich. ‚Mittagspause. Ärztlich verordnet.‘“ |
| FESTIV-034 | Torten-Gag doppelt (OLI-027). | Neue Pointe: „Die Torte hab ich selbst gemacht. Winston hat probiert. Er findet sie gut.“ |
| FESTIV-049 / WINTER-002 | „sehr kreativ“ zweimal. | Eine Variante umformulieren. |
| GIS-087, GIS-150, GIS-154 | Abgegriffene Redewendungen („verbrennt Wasser“, „Löffel bleibt stehen“, „siehe Punkt eins“). | Durch Gisela-eigene Bilder ersetzen (Dessau, Ludwig, Kekse). |
| GIS-147 | „wie eingeschlafene Füße“ heißt „langweilig“, nicht „eklig“. | „Pfui! Schmeckt wie Ludwigs Turnschuhe riechen.“ |
| OLI-074 | Semikolon-Witz abgegriffen. | Konkreter Bug: „… Ah. Ich hab ‚Lini‘ statt ‚Line‘ geschrieben. Passiert mir ständig.“ |
| OLI-167 | Warum geheim? | „Selbstgemacht. Nach Omas Rezept. Sie sagt, ihrer ist besser. Sie hat recht.“ |
| OLI-169 | „wie die Faust aufs Auge“ ist doppeldeutig. | „… aber die hier passt einfach zu dir.“ |
| THA-034 | Schwacher Oma-Konter. | Oma: „Alt genug, um zu wissen, dass du heute Abend wieder feiern gehst.“ |
| LAR-124 | Olafs Verbuchen-Formel bei Lars. | „Das schreib ich in deine Akte. Diagnose: lieb.“ |
| LAR-142/144 | Briefmuster 3-mal. | Ein Brief ohne Oma-Pointe. |
| VERSTE-007, VERSTE-010, ALBUM-043/044 | Lina nimmt Spatzen die Tränke und ein fremdes Steinmännchen weg. | „‚Ja, ja‘, sage ich. ‚Ich bau euch zu Hause eine schönere.‘“ / „Wer auch immer das gebaut hat: Ich bau es zu Hause nach.“ |
| TV-108, TV-120, TV-123, TV-127 | „Lina“ (3. Person) statt „du“. | Einheitlich „Du“. |
| KURZ-111 | „Chérie“ großgeschrieben. | „chérie“. |
| CATALO-039, FURNIT-048/128, TASSEN-018, CROPS-019, STRAEU-006 | „très chic“, „Olé!“, Provence-Formel. | Je ein konkretes Detail statt der Floskel. |
| FURNIT-259–273, KURZ-046 | Reale Designprodukt-Namen (Wassily, Barcelona, LC4, Knoll, Cesca). ❓ | Konzeptfrage: Designklassiker sind keine Logos, aber reale Namen. Entscheiden: beibehalten (Hommage) oder umbenennen („Stahlrohr-Sessel ‚Dessau‘“). |

---

## Teil 5 – Wiederkehrende Probleme

Zählung über alle 5.008 Strings. **[N]**

| Muster | Vorkommen | Bewertung |
|---|---|---|
| „Lini“ | 132 | ✅ gewollt (Olis Kosename), kein Problem |
| „chérie“ / „ma chérie“ | 83 | ⚠️ zu häufig: Jens’ Markenzeichen nutzt sich ab. Empfehlung: höchstens jede dritte Jens-Zeile |
| „ordentlich“ / „Ordnung“ | 56 / 34 | ⚠️ Christin besteht fast nur daraus (Teil 2) |
| „Kind“ (Gisela) | 55 | ✅ passt zu Gisela, aber mit „Kindchen“ / „Schätzchen“ / „Lina“ mischen |
| „Ludwig“ | 46 | ✅ Stärke, bitte so lassen |
| „ärztlich …“ | 35 | ⚠️ Lars-Formel, halbieren |
| „Schwesterherz“ | 26 | ✅ okay, aber 26-mal ist viel |
| „pfui“ / „köstlich“ | 26 / 25 | ✅ Konzept, wirkt am besten in Kombination und mit Bezug (KURZ-017, ITEMS-089) |
| „Fast.“ / „Fast nie.“ als Satzpointe | 21 | ⚠️ KI-typische Schlusspointe, quer durch Beschreibungen |
| „das letzte Wort“ | 17 | ❌ wörtlich behauptet, zeigen statt sagen |
| „Nu“ (sächs.) | 13 | ✅ korrekt sächsisch |
| „Natürlich.“ als Satzpointe | 11 | ⚠️ wie „Fast.“ |
| Thalia + Stein/Fossil/Geologie | 11 Zeilen mit beiden Wörtern + ~10 Briefe/Szenen | ❌ widerspricht dem Konzept |
| „Magnifique“ | 9 | ⚠️ Floskel |
| „Hehe“ (Olaf) | 9 | ⚠️ Lückenfüller nach schwachen Pointen |
| „Keine Widerrede“ | 9 | ⚠️ Gisela- und Thalia-Formel |
| „Ich liebe dich“ | 7 (5 davon wortgleich im Kuss-Pool) | ⚠️ Abnutzung |
| „Zwilling“-Gag | 7 | ⚠️ immer die gleiche Pünktlich/Hübsch-Pointe |
| „gell“ | 6 | ❌ süddeutsch, nicht sächsisch |
| „Das hast du von mir“ | 6 | ⚠️ Familienformel (Gisela, Olaf) |
| „steuerlich absetzbar“ | 5 | ⚠️ Olaf-Formel |
| „Krankenhaus“ (Lars) | 3 | ❌ Faktenfehler |
| Wortgleiche Dubletten (> 25 Zeichen) | 33 Gruppen | ❌ im Dialog löschen oder ersetzen (UI-Dubletten wie „Tasche voll“ sind okay) |

### Muster im Detail

1. **Behaupten statt Zeigen.**
   - Eigenschaften werden ausgesprochen: „Ich hab das letzte Wort“, „Das ist bei ihm das höchste Lob“ (ITEMS-083, ITEMS-115), „Christin lacht nie“.
   - Wirksam ist dagegen, die Eigenschaft in der Handlung zu zeigen: Oma hat den letzten Satz; Christin richtet einen schon geraden Schrank aus.
2. **Erklärte Pointen.**
   - „Verstehst du? …“, „Das war ein Wortspiel.“ (ERINNE-171), „Hehe“.
   - Ein Dad-Joke darf flach sein, aber man erklärt ihn nicht.
3. **Konstruierte Pointen ohne Mechanik.**
   - Sätze mit Witz-Rhythmus, aber ohne Doppeldeutigkeit: OLA-093, OLA-171, OLI-095, THA-042, TRAINI-007.
   - Typisch für generierten Text: Die Form stimmt, der Inhalt fehlt. **[V]**
4. **Fremdbild ≠ Konzept.**
   - Was andere über eine Figur sagen, prägt sie mehr als ihre eigenen Zeilen.
   - Thalia (Steine), Lars (Krankenhaus, Dune, Steine), Jens (Schnurrbart), Gisela (Stock, Ostsee) wurden **von außen** falsch beschrieben.
5. **Familienperspektive.**
   - Verwandtschaft aus Sicht der Sprecherin prüfen: Gisela → „dein Opa“, „dein Bruder“; Lina → „Papa“; Oli ↔ Lars sind *keine* Brüder.
6. **Englische Wortspiele im deutschen Text.** „konkret“ (concrete), „Body“, „no body“ funktionieren nicht.
7. **Dialekt.** Sächsisch wird mit süddeutschen, berlinerischen und schwäbischen Formen gemischt.
8. **Großschreibung nach Ausrufezeichen in Briefen.** „Lina!⏎⏎plan …“ (INSEL-063); bei Briefen von Thalia, Jens und Oli systematisch prüfen. **[N]** für INSEL-063, **[V]** für weitere.
9. **Perspektive des Erzählers.** „Du“ und „Lina“ wechseln innerhalb desselben Systems (TV).
10. **Generische Herzlichkeit.** „Mit dir ist jeder Tag ein guter Tag“, „mein Lieblingsort ist da, wo du bist“: Diese Zeilen könnte jede Figur in jedem Spiel sagen. Je konkreter (Ort, Erinnerung, Gegenstand), desto stärker.

---

## Teil 6 – Maßnahmenplan

Reihenfolge nach Wirkung und Aufwand. Alles ist reine Textarbeit. **Mechanik, Trigger und Dialogstruktur bleiben unverändert.** Bei 6.1 ändert sich je eine Zeile Code (Genitiv, Artikel). Jede Stufe passt in einen eigenen kleinen PR.

### 6.1 Kritisch (zuerst, ~1 PR)

- [ ] **Genitiv bei -s-Namen** (KURZ-405/406): „Lars’ Häuschen“, „Jens’ Häuschen“.
- [ ] **Pflanzen-Artikel** (KURZ-402, WORLDD-028/034): Formulierungen ohne festen Artikel.
- [ ] **WORLDD-143** „Noch eins ${name}?“.
- [ ] **Faktenfehler gegen das Konzept:**
  - Lars-Krankenhaus (GIS-078, LAR-034/042)
  - Capicola/Gabagool (OLI-139/140)
  - Lost Highway s/w (POSTER-004, WISHES-131)
  - Dune → Oli (POSTER-010, KURZ-183)
  - Schnurrbart (GESCHE-051)
  - Stock (GESCHE-052)
  - Verwandtschaft (GIS-079/102/306)
  - Kniebeugen (UNTERN-024)
- [ ] **Thalia-Steine im Fremdbild** (GIS-099, OLI-119/120) als ersten Schritt.
- [ ] **JEN-177** ersetzen.

### 6.2 Hoch (~1–2 PRs)

- [ ] Alle Zeilen aus 4.2: Grammatik, Logik, Redewendungen, Dialekt.
- [ ] **Sächsisch gegenlesen lassen** (Jens, Lina sächselt). ❓ Gibt es jemanden in Linas Familie, der das kann? Jens im echten Leben?
- [ ] **Brief-Großschreibung** nach „Name!“ in allen Briefen prüfen.
- [ ] **Perspektive TV** einheitlich auf „du“.
- [ ] **Familienlogik** durchsuchen (Bruder/Schwager, Opa/Ludwig, Mein Enkel).

### 6.3 Mittel (~2–3 PRs, Figur für Figur)

- [ ] **Dubletten entfernen:**
  - Jens-Block (JEN-182–191)
  - Olaf ↔ Witzkalender ↔ Lars
  - Christin-Herzbrief
  - Gisela-Party
  - Thalia, Oli, Lars (siehe 4.3)
- [ ] **Gisela:** „letztes Wort“ von 17 auf ≤ 4 wörtliche Nennungen, Rest gezeigt; Dessau statt Ostsee.
- [ ] **Christin:** 10–15 Zeilen mit eigenen Themen ohne Ordnung; „Ordnungstipp“-Rahmen korrigieren.
- [ ] **Olaf:** nicht funktionierende Witze ersetzen (OLA-053/092/093/158/171/179, INSEL-047); „Christin lacht nie“ auf 1 reduzieren; „Hehe“ halbieren.
- [ ] **Lars:** eigene Kalauer statt Olaf-Witzen; Sumo, Halo/Fallout und Ronny sichtbarer; „ärztlich“ halbieren.
- [ ] **Oli:** Kuss-Pool variieren; generische Formeln ersetzen.
- [ ] **Thalia:** restliches Fremdbild Steine → Gym, Party, Karten (Liste in 4.3); Tschechien-Erinnerungen und Verkuppel-Momente ergänzen.
- [ ] **Jens:** „chérie“ ausdünnen; Floskeln durch Details ersetzen.
- [ ] **TV:** Titel „Name, Gewicht“ ersetzen; Namenskollision Ronny beheben.

### 6.4 Niedrig (bei Gelegenheit)

- [ ] „Fast.“ und „Natürlich.“ als Schlusspointe in Beschreibungen halbieren.
- [ ] Abgegriffene Redewendungen (4.4).
- [ ] ❓ **Designentscheidungen für Lina / das Team:**
  - Sollen Datingshow und Nachrichten im Spiel-TV auch helle Momente haben?
  - Reale Designprodukt-Namen (Wassily, Barcelona …) beibehalten?
  - Lars’ Steine-Wunsch (Wolframit): gewollt, oder Konzept ergänzen?
- [ ] **Test-Idee (optional):** Ein kleiner Vitest, der wortgleiche Dialogzeilen über alle NPC-Pools meldet. Er würde neue Dubletten früh finden. Ein Test schreibt keine Inhalte vor. **[V]**

### Erfolgskriterium

Nach 6.1–6.3:
- keine Zeile mehr ≤ 5;
- Dubletten im Dialog = 0;
- „das letzte Wort“ ≤ 4;
- Thalia + Steine nur noch in Pater-Matteo-Briefen und beim Schaufel-Geschenk;
- Durchschnitt der Figurenstimmen ≥ 7,8.

Gemessen wird mit derselben Methode (Anhang). **[V]**

---

## Anhang: Methode

1. **Extraktion.** Alle String-Literale (`'…'`, `"…"`, `` `…` ``) aus `src/**/*.ts(x)` ohne Tests und ohne Kommentare, mit Datei und Zeile.
   - **Hauptauswertung:** Strings ab 12 Zeichen mit mindestens einem deutschen Wort plus Leerzeichen (4.523).
   - **Nachtrag:** kürzere Zeilen, Ausrufe und Titel (485, Präfix `KURZ`). Dabei kommen technische Strings (CSS, Schriften) mit. Sie sind in der Tabelle als „technisch“ markiert und nicht bewertet.
2. **IDs.** Präfix je Datei (NPC-Dateien: GIS/OLA/CHR/OLI/JEN/LAR/THA, sonst die ersten Buchstaben des Dateinamens) plus laufende Nummer.
3. **Bewertung.** Jede Zeile einzeln gelesen, im Kontext ihrer Nachbarzeilen und mit `CLAUDE.md` (Figurenkonzept) und `docs/game-mechanics.md` (Fakten) abgeglichen. Fünf Werte von 1 bis 10. „-“ heißt nicht zutreffend, z. B. Humor bei einer Sachbeschreibung oder Charaktertreue bei UI-Text. **G** ist eine Gesamteinschätzung, kein Mittelwert.
4. **Prüfung auf Vollständigkeit.** Ein Skript stellt sicher, dass jede extrahierte ID genau eine Bewertung hat (5.008 / 5.008).
5. **Grenzen.**
   - Zeilen, die zur Laufzeit zusammengesetzt werden (`${…}`), wurden als Vorlage bewertet. Gezielt nachgeprüft wurden nur die Fälle mit Namen und Artikeln (KURZ-402/405/406).
   - Wie oft eine Zeile tatsächlich erscheint, hängt von Zufall und Fortschritt ab. Die Häufigkeits-Wirkung ist deshalb **[P]**.
   - Humor ist subjektiv. Die Kommentare begründen jede Abwertung, damit man widersprechen kann.
