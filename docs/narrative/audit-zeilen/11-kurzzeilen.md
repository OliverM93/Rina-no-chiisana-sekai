# Dialog-Audit – Zeilentabelle: Nachtrag: Kurzzeilen (KURZ)

Teil 3 des [Dialog-Audits](../dialogue-audit.md). Spalten: **S** Sinnhaftigkeit · **H** Humor · **C** Charaktertreue · **N** Natürlichkeit · **G** Gesamt (1–10). „-“ = nicht zutreffend (z. B. kein Witz beabsichtigt, kein Sprecher) bzw. technischer String ohne Spieltext. ⏎ = Zeilenumbruch im Original.


## `src/core/appearance.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-001 | 72 | kurz | Pulli & Rock | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-002 | 77 | kurz | Hemd & Weste | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-003 | 80 | kurz | Mantel & Schal | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-004 | 88 | kurz | Bandshirt & Cargohose | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-005 | 175 | kurz | Hautton ${i + 1} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/core/festivals.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-006 | 67 | kurz | fest:${f}:${date.getFullYear()}${who ?  | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/core/music.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-007 | 110 | kurz | Lini & Oli | 9 | - | - | 9 | 9 | Schöner Musiktitel. |
| KURZ-008 | 113 | kurz | Chez Jens | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-009 | 124 | kurz | Eis am Stiel | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-010 | 141 | kurz | Am Fenster | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-011 | 145 | kurz | Warme Stube | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/core/time.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-012 | 109 | kurz | ${WEEKDAYS[date.getDay()]}, ${date.getDate()}. ${MONTHS[date.getMonth()]} | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-013 | 114 | kurz | ${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/core/worldmap.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-014 | 162 | kurz | Kartenreihe ${y} hat ${row.length} statt ${width} Zeichen. | - | - | - | - | - | Entwickler-Meldung, im Spiel nicht sichtbar. |

## `src/data/animals.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-015 | 33 | kurz | Pick-per-wick! 🐦 | 9 | 7 | - | 9 | 8 | Gut. |

## `src/data/cafeGaeste.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-016 | 99 | kurz | Kräutertee, ma chérie? Vom Haus? | 9 | 7 | 9 | 9 | 8 | Jens, gut. |
| KURZ-017 | 128 | kurz | Köstlich. Pfui. Köstlich. | 9 | 9 | 10 | 9 | 10 | „Köstlich. Pfui. Köstlich.“ – Gisela in drei Wörtern. |

## `src/data/catalog.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-018 | 62 | kurz | Art déco | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-019 | 67 | kurz | Space Age | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-020 | 103 | kurz | Sofas & Sessel | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-021 | 104 | kurz | Stühle & Hocker | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-022 | 107 | kurz | Schränke & Regale | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-023 | 111 | kurz | Kleine Deko | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-024 | 112 | kurz | Küche & Technik | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-025 | 133 | kurz | Holz, Stein & Fliesen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-026 | 143 | kurz | Fliesen & Stein | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-027 | 144 | kurz | Matten & Teppichboden | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-028 | 153 | kurz | Filme, Bücher & Poster | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-029 | 164 | kurz | Zäune & Wege | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-030 | 165 | kurz | Sitzen & Tische | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-031 | 167 | kurz | Beete & Ställe | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/data/coffee.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-032 | 27 | kurz | Café Crème | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-033 | 30 | kurz | Flat White | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-034 | 48 | kurz | Espresso & Lungo | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/data/festivals.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-035 | 39 | kurz | Bon anniversaire, ma chérie! 🎉 | 9 | - | 9 | 9 | 8 | Gut. |
| KURZ-036 | 41 | kurz | HAPPY BIRTHDAAAY! 🎉🎂 | 9 | 7 | 8 | 9 | 8 | Gut. |
| KURZ-037 | 55 | kurz | Die Adventszeit, chérie! | 9 | - | 9 | 9 | 8 | Gut. |
| KURZ-038 | 73 | kurz | Buh! 👻 | 9 | 7 | - | 9 | 8 | Gut. |

## `src/data/furniture.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-039 | 143 | kurz | Dr. Brummbär | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-040 | 145 | kurz | Ammonit „Lina“ | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-041 | 149 | kurz | Lars' Spruchtafel | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-042 | 154 | kurz | Jens' Reisekoffer | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-043 | 211 | kurz | Emailleschild „TOILETTE“ | 9 | 7 | - | 9 | 8 | Gut (Pointe in FURNIT-132). |
| KURZ-044 | 215 | kurz | Kreidetafel „Tagesgericht“ | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-045 | 229 | kurz | Bento-Box (Deko) | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-046 | 349 | kurz | Cesca Chair | 9 | - | - | 9 | 7 | Realer Produktname (Cesca). |
| KURZ-047 | 488 | kurz | Vase: ${b.name} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-048 | 493 | kurz | ${a.description} – ${a.artist} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-049 | 497 | kurz | Art déco | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-050 | 497 | kurz | Space Age | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-051 | 511 | kurz | Urkunde: ${c.title} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/data/gastHaeuser.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-052 | 38 | kurz | Zu Besuch | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-053 | 42 | kurz | Zu Besuch | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-054 | 213 | kurz | Chez Jens | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/data/gespraeche.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-055 | 33 | kurz | Ich trinke. Wasser. Ernsthaft. | 9 | 8 | 9 | 9 | 9 | „Ich trinke. Wasser. Ernsthaft.“ |
| KURZ-056 | 44 | kurz | Gefühlt. | 9 | 8 | - | 9 | 8 | Gut. |
| KURZ-057 | 60 | kurz | Gern, Oli. Mit Diagrammen. | 9 | 8 | 9 | 9 | 9 | „Mit Diagrammen.“ – gut. |

## `src/data/insel.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-058 | 36 | kurz | ÜBERRASCHUNG, Lini! | 9 | - | 9 | 9 | 8 | Gut. |

## `src/data/interactions.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-059 | 77 | kurz | „Bauplatz – reserviert.“ | 9 | 7 | - | 9 | 8 | Gut. |
| KURZ-060 | 134 | kurz | Omas Bank | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-061 | 137 | kurz | „Reserviert. Für immer.“ | 9 | 8 | 9 | 9 | 9 | „Reserviert. Für immer.“ |
| KURZ-062 | 157 | kurz | Eure Bank | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-063 | 166 | kurz | Jens’ Aquarium | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-064 | 177 | kurz | Ein Schild: „Check-in: jederzeit. Check-out: nie.“ 🐝 | 9 | 8 | 9 | 9 | 9 | Insektenhotel-Schild – gut. |

## `src/data/items.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-065 | 114 | kurz | Aal grün | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-066 | 116 | kurz | Stücke Käse | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-067 | 137 | kurz | Omas Keks | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-068 | 137 | kurz | Omas Kekse | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-069 | 152 | kurz | ${f.def.name} (${VARIANT_LABELS[f.variant] ?? f.variant}) | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-070 | 161 | kurz | Rezept: ${name} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-071 | 161 | kurz | Rezepte: ${name} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-072 | 177 | kurz | ${adj} ${flower.name} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-073 | 178 | kurz | ${colorWord(color, sp.gender, true)} ${flower.plural} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-074 | 189 | kurz | ${seed.name} (${label}) | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-075 | 190 | kurz | ${seed.plural} (${label}) | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-076 | 193 | kurz | ${seed.description} (Farbe: ${label}) | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-077 | 227 | kurz | ${count}× ${id} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-078 | 228 | kurz | ${count} ${count === 1 ? def.name : def.plural} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/data/kater.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-079 | 35 | kurz | Mrrrp? | 9 | 7 | - | 9 | 9 | Gut. |

## `src/data/matteo.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-080 | 33 | kurz | Vom Berg | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/data/meetups.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-081 | 49 | kurz | Oma: „Zu wenig.“ | 9 | 8 | 9 | 9 | 9 | Oma: „Zu wenig.“ – gut. |
| KURZ-082 | 52 | kurz | Christin: „Mit Untersetzer, bitte.“ | 9 | 8 | 9 | 9 | 9 | Christin – perfekt knapp. |
| KURZ-083 | 96 | kurz | Oli: „Warum?“ | 9 | 8 | 9 | 9 | 8 | Gut. |

## `src/data/npcs/christin.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-084 | 27 | kurz | Oh. Für mich? Das ist … aufmerksam. | 9 | 7 | 9 | 9 | 9 | „Das ist … aufmerksam.“ – Christin. |
| KURZ-085 | 37 | kurz | Zu Hause | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-086 | 47 | kurz | Ich tanze! | 8 | 7 | 6 | 9 | 7 | Christin „Ich tanze!“ – untypisch, ggf. gewollt (Party). |
| KURZ-087 | 49 | kurz | Hallo Lina! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-088 | 53 | kurz | Hallo Lina! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-089 | 65 | kurz | Ich tanze! | 8 | 7 | 6 | 9 | 7 | Wie 086. |
| KURZ-090 | 96 | kurz | Danke, Lina! Wie aufmerksam. | 9 | - | 9 | 9 | 8 | Gut. |
| KURZ-091 | 97 | kurz | Danke. | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-092 | 98 | kurz | Oh. Ähm. Danke. | 9 | 7 | 9 | 9 | 8 | Gut. |
| KURZ-093 | 101 | kurz | Ein Ast? | 9 | 7 | 9 | 9 | 8 | Gut. |
| KURZ-094 | 108 | kurz | Tschüss, Lina! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-095 | 112 | kurz | Weiße Rosen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/data/npcs/gisela.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-096 | 17 | kurz | Oma Gisela | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-097 | 40 | kurz | Morgen, Kindchen! | 9 | - | 9 | 9 | 8 | Gut. |
| KURZ-098 | 47 | kurz | Montag. | 9 | 8 | 9 | 9 | 8 | „Montag.“ – trocken. |
| KURZ-099 | 51 | kurz | Schnee! Wie früher. | 9 | - | 10 | 9 | 9 | „Schnee! Wie früher.“ |
| KURZ-100 | 88 | kurz | … Ich. Natürlich. | 9 | 8 | 9 | 9 | 9 | „… Ich. Natürlich.“ – letzte Wort gezeigt, nicht behauptet. |
| KURZ-101 | 150 | kurz | Aha. Danke. | 9 | 7 | 9 | 9 | 8 | Gut. |
| KURZ-102 | 160 | kurz | Einen Ast? | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-103 | 161 | kurz | Ein Stein. Danke. | 9 | 7 | 9 | 9 | 8 | Gut. |
| KURZ-104 | 165 | kurz | Ein Pfirsich! Köstlich! 😋 | 9 | 7 | 9 | 9 | 8 | „Köstlich!“ |

## `src/data/npcs/jens.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-105 | 46 | kurz | Bonjour, ma chérie! ☕ | 9 | - | 9 | 9 | 8 | Gut. |
| KURZ-106 | 47 | kurz | Lina, Darling! 💋 | 9 | 6 | 7 | 9 | 7 | „Darling“ – Englisch, bei Jens eher Französisch; okay. |
| KURZ-107 | 48 | kurz | Salut, Lina! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-108 | 50 | kurz | Bonsoir, chérie! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-109 | 52 | kurz | Regen! Wie in Paris. | 9 | 8 | 9 | 9 | 9 | „Regen! Wie in Paris.“ |
| KURZ-110 | 53 | kurz | Ein Regenbogen! 🌈 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-111 | 59 | kurz | Thymian, Chérie! Thymian! | 8 | - | 9 | 8 | 7 | „Chérie“ großgeschrieben – sonst „chérie“; uneinheitlich. |
| KURZ-112 | 100 | kurz | Oh là là! 😍 | 9 | 5 | 8 | 9 | 6 | „Oh là là!“-Formel. |
| KURZ-113 | 101 | kurz | Merci, chérie! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-114 | 102 | kurz | Für mich? Wie aufmerksam! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-115 | 103 | kurz | Hm. Interessant. | 9 | 8 | 9 | 9 | 8 | Gut. |
| KURZ-116 | 110 | kurz | Lina, chérie … | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-117 | 113 | kurz | Au revoir, chérie! 💋 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-118 | 125 | kurz | Geheimrezept! | 9 | 7 | 9 | 9 | 8 | Gut. |
| KURZ-119 | 129 | kurz | Mon trésor | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-120 | 141 | kurz | Lina, ma chérie! 🎉 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-121 | 147 | kurz | Bisous! 💋 | 9 | - | 9 | 9 | 8 | Gut. |
| KURZ-122 | 164 | kurz | New York | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/data/npcs/lars.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-123 | 22 | kurz | Ein Geschenk? Für mich? | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-124 | 42 | kurz | Moin, Schwesterherz! | 9 | - | 9 | 9 | 8 | Gut. |
| KURZ-125 | 43 | kurz | Na, Kleine? | 9 | - | 9 | 9 | 8 | Gut. |
| KURZ-126 | 44 | kurz | Hey Lina! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-127 | 46 | kurz | Na, Feierabend? | 9 | 7 | 9 | 9 | 8 | Gut. |
| KURZ-128 | 55 | kurz | Petersilie, Schnittlauch, Thymian … | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-129 | 69 | kurz | Ein Klopfsalat. 🥬 | 9 | 8 | 9 | 9 | 9 | „Ein Klopfsalat.“ – Arzt-Wortspiel. |
| KURZ-130 | 70 | kurz | Stock. | 8 | 7 | 8 | 9 | 7 | „Stock.“ – knapp, okay. |
| KURZ-131 | 100 | kurz | Danke, Kleine! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-132 | 101 | kurz | Für mich? Danke! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-133 | 102 | kurz | Hm. Danke … | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-134 | 106 | kurz | Kamillentee … | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-135 | 112 | kurz | Bis dann, Schwesterherz! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-136 | 114 | kurz | Ach, hier – Kamillensamen. | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-137 | 136 | kurz | Lina! Schwesterherz! 🤗 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-138 | 147 | kurz | Diagnose: kerngesund! 💚 | 9 | 7 | 9 | 9 | 8 | Gut. |
| KURZ-139 | 150 | kurz | Links … rechts … oben … Winston. | 9 | 8 | 9 | 9 | 9 | „Links … rechts … oben … Winston.“ |

## `src/data/npcs/olaf.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-140 | 45 | kurz | Hallo Lina! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-141 | 72 | kurz | Belege! | 9 | 8 | 9 | 9 | 9 | Olaf: „Belege!“ |
| KURZ-142 | 95 | kurz | Oh, danke. | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-143 | 96 | kurz | Hmm … danke. | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-144 | 125 | kurz | Wir kommen! | 9 | - | 9 | 9 | 8 | Gut. |

## `src/data/npcs/oli.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-145 | 50 | kurz | Hey Lini! 😊 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-146 | 56 | kurz | Regen? Perfekt! | 9 | 7 | 9 | 9 | 8 | Gut. |
| KURZ-147 | 57 | kurz | Schnee, Lini! ❄️ | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-148 | 94 | kurz | Gewitter, Lini! ⚡ | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-149 | 122 | kurz | Für mich? Danke, Lini! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-150 | 123 | kurz | Ähm … danke? 😅 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-151 | 126 | kurz | Eier! Proteine! 💪 | 9 | 8 | 9 | 9 | 9 | „Eier! Proteine!“ |
| KURZ-152 | 130 | kurz | Lini … | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-153 | 133 | kurz | Bis später, Lini! 💕 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-154 | 146 | kurz | Ein Mixtape | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-155 | 148 | kurz | Wir zwei | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-156 | 161 | kurz | Lini! 😊 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-157 | 186 | kurz | *Küsschen* 😘 | 9 | - | 9 | 9 | 8 | Gut. |
| KURZ-158 | 188 | kurz | *Nasenstupser* Boop. 👃 | 9 | 8 | 9 | 9 | 8 | Gut. |

## `src/data/npcs/thalia.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-159 | 25 | kurz | NEIN! Für mich?! 🥹 | 9 | 8 | 9 | 9 | 9 | Gut. |
| KURZ-160 | 45 | kurz | Lina! 🤗 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-161 | 46 | kurz | Heyyy, Lina! | 9 | - | 9 | 9 | 8 | Gut. |
| KURZ-162 | 49 | kurz | Na, du? | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-163 | 78 | kurz | Gewitter! ⚡ | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-164 | 99 | kurz | Ich hab’s kartiert. Gedanklich. | 9 | 8 | 9 | 9 | 9 | „Ich hab’s kartiert. Gedanklich.“ – Thalia. |
| KURZ-165 | 102 | kurz | NEIN! Für mich?! 😍 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-166 | 104 | kurz | Danke dir! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-167 | 105 | kurz | Ähm … danke? 😅 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-168 | 108 | kurz | Ein Kieselstein! | 8 | - | 7 | 9 | 7 | Thalia freut sich über Kiesel – Steine-Thema. |
| KURZ-169 | 109 | kurz | Ein Ammonit! 🐚 | 8 | - | 6 | 9 | 6 | Thalia + Ammonit; Emoji 🐚 ist eine Muschel. |
| KURZ-170 | 112 | kurz | Lina … | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-171 | 115 | kurz | Bis später, Süße! 💚 | 9 | - | 9 | 9 | 8 | Gut. |
| KURZ-172 | 121 | kurz | Party-Erinnerung! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-173 | 122 | kurz | Studio? Studio! | 9 | 8 | 9 | 9 | 9 | „Studio? Studio!“ |
| KURZ-174 | 127 | kurz | Kartiert! | 9 | 7 | 9 | 9 | 8 | Gut. |
| KURZ-175 | 128 | kurz | Unsere Welt | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-176 | 140 | kurz | LINAAA! 🤗 | 9 | 7 | 9 | 9 | 8 | Gut. |
| KURZ-177 | 151 | kurz | Party-Zeit! 💃🎶 | 9 | - | 9 | 9 | 8 | Gut. |

## `src/data/oliStufen.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-178 | 59 | kurz | Am Fenster | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-179 | 70 | kurz | Danke, Lini | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/data/posters.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-180 | 33 | kurz | Retro-Poster „Café Fabuleux“ | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-181 | 37 | kurz | EIN SCHRITT.⏎DANN NOCH⏎EINER. | 9 | - | 9 | 9 | 9 | Buchcover – gut. |
| KURZ-182 | 37 | kurz | Dr. No | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-183 | 38 | kurz | Roman „Die Sandsterne“ | 9 | - | 5 | 9 | 6 | Dune-Anspielung als Lars’ Lieblingsbuch (siehe POSTER-010). |
| KURZ-184 | 38 | kurz | Ein Science-Fiction-Roman | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/data/sammlungen.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-185 | 23 | kurz | Alle Fische | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-186 | 39 | kurz | Alle Funde | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-187 | 55 | kurz | Alle Tassen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/data/species.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-188 | 169 | kurz | an Blumen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-189 | 170 | kurz | an Bäumen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-190 | 172 | kurz | am Wasser | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-191 | 173 | kurz | am Strand | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-192 | 174 | kurz | an Felsen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/data/tassen.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-193 | 27 | kurz | Sternenbohne-Tasse „${name}“ | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-194 | 44 | kurz | New York | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/data/tipsy.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-195 | 70 | kurz | *Hicks* 🫢 | 9 | 7 | - | 9 | 8 | Dezent. |
| KURZ-196 | 70 | kurz | Huch! *hicks* | 9 | 7 | - | 9 | 8 | Dezent. |

## `src/data/training.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-197 | 8 | kurz | 20 kg … Aufwärmen. 🌸 | 9 | 7 | - | 9 | 8 | Gut. |
| KURZ-198 | 9 | kurz | 60 kg … locker. 💪 | 9 | 7 | - | 9 | 8 | Gut. |
| KURZ-199 | 25 | kurz | Lina: „Eben.“ 😌 | 9 | 8 | 9 | 9 | 9 | Lina: „Eben.“ |
| KURZ-200 | 26 | kurz | Lina: „Technik, Oli.“ | 9 | 8 | 9 | 9 | 9 | „Technik, Oli.“ |
| KURZ-201 | 41 | kurz | Lina: „Technik.“ | 9 | 8 | 9 | 9 | 9 | Gut. |

## `src/data/tv.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-202 | 59 | kurz | Manfred, 63 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-203 | 60 | kurz | Jessica, 34 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-204 | 61 | kurz | Tobias, 29 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-205 | 62 | kurz | Petra & Uwe | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-206 | 73 | kurz | Ronny, 280 Kilo | 8 | - | 5 | 9 | 5 | Folgentitel nur mit Name + Gewicht reduziert Menschen auf die Zahl (Konzept: respektvoll); „Ronny“ kollidiert mit Lars’ Freund. |
| KURZ-207 | 74 | kurz | Sabine, 230 Kilo | 8 | - | 6 | 9 | 6 | Name + Gewicht als Titel – respektvoller z. B. „Sabines erster Spaziergang“. |
| KURZ-208 | 92 | kurz | Der Heimweg | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-209 | 94 | kurz | Der Enkeltrick | 9 | - | - | 9 | 8 | Gut. |
| KURZ-210 | 109 | kurz | Zimmer 13 | 9 | - | - | 9 | 8 | Gut. |

## `src/data/unternehmungen.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-211 | 71 | kurz | … Fast nie. | 9 | 6 | - | 9 | 7 | „Fast nie.“-Formel. |
| KURZ-212 | 74 | kurz | „Köstlich! Ein Paar!“ | 9 | 8 | 9 | 9 | 9 | „Köstlich! Ein Paar!“ – Gisela im Memory. |
| KURZ-213 | 74 | kurz | „Pfui, daneben.“ | 9 | 8 | 9 | 9 | 9 | „Pfui, daneben.“ |
| KURZ-214 | 100 | kurz | Gym-Date! Endlich! 💪 | 9 | 7 | 9 | 9 | 8 | Gut. |
| KURZ-215 | 104 | kurz | „Jaaa, sauber!“ | 9 | - | 9 | 9 | 8 | Gut. |
| KURZ-216 | 104 | kurz | „Genau so!“ | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-217 | 133 | kurz | „Ordentlich!“ | 9 | 6 | 9 | 9 | 7 | Christin-Formel, passend. |
| KURZ-218 | 159 | kurz | Der Schleimkönig | 9 | 8 | - | 9 | 9 | Bossname – gut. |
| KURZ-219 | 161 | kurz | Die Glockenhexe | 9 | 8 | - | 9 | 9 | Bossname – gut. |
| KURZ-220 | 176 | kurz | „Ausweichen, Lini!“ | 9 | - | 9 | 9 | 8 | Gut. |
| KURZ-221 | 176 | kurz | „Jaaa! Treffer!“ | 9 | - | 9 | 9 | 8 | Gut. |
| KURZ-222 | 176 | kurz | „Heilen, heilen!“ | 9 | 7 | - | 9 | 8 | Gut. |
| KURZ-223 | 197 | kurz | 🤼 Kissen-Sumo | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-224 | 226 | kurz | Los geht’s: abwechselnd ← und →! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-225 | 228 | kurz | „Hakkeyoi!“ | 9 | - | 9 | 9 | 8 | Echte Sumo-Rufe – gut. |
| KURZ-226 | 228 | kurz | „Nokotta, nokotta!“ | 9 | - | 9 | 9 | 8 | Gut. |
| KURZ-227 | 249 | kurz | 🧠 Rätselecke | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-228 | 271 | kurz | 8 Sekunden | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-229 | 271 | kurz | 8 Minuten | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-230 | 271 | kurz | 8 Stunden | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-231 | 311 | kurz | ✨ Der Sternenhimmel | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-232 | 315 | kurz | 🌸 Pastell | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-233 | 316 | kurz | 🔥 Kräftig & bunt | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-234 | 332 | kurz | Sehr schön! | 9 | - | - | 9 | 6 | Doppelt (234/235) – identisches Lob für zwei Fälle. |
| KURZ-235 | 333 | kurz | Sehr schön! | 9 | - | - | 9 | 6 | Doppelt. |

## `src/data/verstecke.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-236 | 38 | kurz | Der Waldwinkel | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-237 | 47 | kurz | Die Felsnische | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-238 | 56 | kurz | Das Treibgut | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/data/voices.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-239 | 33 | kurz | Oma Gisela | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/data/wardrobe.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-240 | 35 | kurz | LETZTE RUHESTÄTTE | 9 | 7 | - | 9 | 8 | Ausgedachte Band – gut. |
| KURZ-241 | 38 | kurz | SIEBEN SCHWERTER | 9 | 7 | - | 9 | 8 | Gut. |

## `src/data/winter.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-242 | 54 | kurz | 🍹 Kinderpunsch | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-243 | 56 | kurz | 🍷 Glühwein | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/data/wishes.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-244 | 323 | kurz | 🌺 Hawaii | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-245 | 333 | kurz | 🗾 Japan | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-246 | 347 | kurz | Ein Wolfram-Stein | 9 | - | 8 | 9 | 8 | Gut. |

## `src/game/album.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-247 | 61 | kurz | ${d}. ${MONTHS[m - 1]} ${y} | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/game/animals.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-248 | 42 | kurz | ${line} ${itemCountLabel(def.egg, got)} eingesteckt. | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/game/catalog.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-249 | 75 | kurz | Teppich ${f.w}×${f.d} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-250 | 76 | kurz | ${f.w}×${f.d} Felder | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-251 | 162 | kurz | Alle Stile | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-252 | 162 | kurz | Ohne Stil | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/game/flowers.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-253 | 34 | kurz | ${x + dx},${y + dy} | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-254 | 94 | kurz | 🌷 Neu im Sammelbuch: ${flowerLabel(id)}! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/game/gallery.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-255 | 49 | kurz | „${art.name}“ – magnifique! 🖼️ | 9 | 5 | 8 | 9 | 6 | „magnifique!“-Formel. |

## `src/game/gameplay.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-256 | 59 | kurz | ${itemCountLabel(itemId, got)} eingesteckt | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-257 | 97 | kurz | ${n.toLocaleString('de-DE')} ${CURRENCY.icon} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-258 | 385 | kurz | ${npcId}:bye:${npcState(session, npcId).talksToday} | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-259 | 456 | kurz | olaf-zinsen-${data.bank.interestWeek.slice(0, 7)} | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/game/nature.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-260 | 179 | kurz | Du hast ${artikel(name)} gefangen! 🎣 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-261 | 179 | kurz | Du hast ${artikel(name)} gefangen! 🦋 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-262 | 182 | kurz | 📖 Neu im Sammelbuch! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-263 | 193 | kurz | eine ${adj(name, 'e')} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-264 | 194 | kurz | einen ${adj(name, 'en')} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/game/notebook.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-265 | 67 | kurz | ${n.need} × ${n.label}${n.have > 0 ?  | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/game/straussLust.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-266 | 18 | kurz | ${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/game/tassen.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-267 | 34 | kurz | ${KIND_LABEL[k]} ${z.byKind[k][0]}/${z.byKind[k][1]} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/game/tipsy.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-268 | 25 | kurz | ${npcId}:${session.today()}:${Math.floor(now / COMMENT_PAUSE_SEC)} | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/game/unternehmungen.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-269 | 80 | kurz | 🔓 Level ${reached + 1}: ${levels[reached]} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/game/winter.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-270 | 50 | kurz | Das 24. Türchen 🎄 | 9 | - | - | 9 | 8 | Gut. |
| KURZ-271 | 50 | kurz | Türchen ${door} 🎁 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/game/wishes.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-272 | 73 | kurz | ${n.have >= n.need ? '✅' : '▫️'} ${n.label} ${n.have}/${n.need} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-273 | 74 | kurz | ${p.stars.have >= p.stars.need ? '✅' : '▫️'} ${formatMoney(p.stars.need)} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-274 | 75 | kurz | Für „${wish.title}“: ${parts.join(' · ')} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/gfx/art.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-275 | 269 | kurz | 700 ${h * 0.09}px sans-serif | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/gfx/canvas.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-276 | 100 | kurz | rgba(70, 50, 80, ${alpha}) | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-277 | 101 | kurz | rgba(70, 50, 80, ${alpha * 0.8}) | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-278 | 116 | kurz | rgba(255, 255, 255, ${alpha}) | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-279 | 124 | kurz | rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha}) | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/gfx/items.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-280 | 517 | kurz | 700 5px sans-serif | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-281 | 1083 | kurz | 700 14px sans-serif | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/gfx/malen.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-282 | 48 | kurz | rgba(${r \| 0},${g \| 0},${b \| 0},${0.45 + rnd() * 0.35}) | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/gfx/photoFrame.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-283 | 10 | kurz | 📷 Polaroid | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-284 | 11 | kurz | 💗 Herzchen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-285 | 12 | kurz | 🌸 Blümchen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-286 | 13 | kurz | ▫️ Schlicht | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-287 | 102 | kurz | linas-kleine-welt-${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}-${p(date.getHours())}${p(date.getMinutes())}.png | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/gfx/posters.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-288 | 294 | kurz | ${line} ${word} | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-289 | 320 | kurz | 900 ${titleSize}px Nunito, system-ui, sans-serif | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-290 | 325 | kurz | 700 ${subSize}px Nunito, system-ui, sans-serif | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/gfx/prints.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-291 | 78 | kurz | 900 ${px}px Nunito, Impact, sans-serif | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-292 | 81 | kurz | 900 ${px}px Nunito, Impact, sans-serif | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-293 | 101 | kurz | 800 16px Nunito, sans-serif | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-294 | 102 | kurz | — DEPT. — | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-295 | 142 | kurz | 900 ${px}px Nunito, sans-serif | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/main.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-296 | 135 | kurz | ${inside}\|${isPartyTime(session)}\|${title}\|${forced ?? ''}\|${session.onIsland} | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/ui/App.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-297 | 85 | kurz | #ui .modal-layer, #ui .title-layer | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/ui/BankPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-298 | 58 | kurz | Danke! ${formatMoney(paid)} zurückgezahlt. | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-299 | 75 | kurz | keiner 🎉 | 9 | 7 | - | 9 | 9 | „keiner 🎉“ – Kredit, schön leicht. |
| KURZ-300 | 99 | kurz |  Noch ${formatMoney(bausparShare(next.price) - data.bank.savings)} sparen. | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-301 | 131 | kurz |  Zuletzt: ${formatMoney(data.bank.lastInterest)}. | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/ui/CatalogPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-302 | 38 | kurz | Ohne Stil | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-303 | 135 | kurz | .catalog .filter-strip .chip.active | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-304 | 158 | kurz | ${rowClass('kategorie')} row-kat | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-305 | 169 | kurz | ${rowClass('typ', noTypeHere)} row-typ | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-306 | 173 | kurz | Keine Typen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-307 | 173 | kurz | Nur ein Typ | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-308 | 183 | kurz | ${rowClass('stil', noStyleHere)} row-stil | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-309 | 212 | kurz | ${CATEGORY_BY_ID[sel.meta.category].name}${sel.meta.type ?  | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-310 | 212 | kurz |  : ''}${sel.size ?  | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-311 | 231 | kurz | Preis: ${sel.price} ${CURRENCY.icon} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-312 | 245 | kurz | Kaufen · ${sel.price} ${CURRENCY.icon} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/ui/CharacterEditor.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-313 | 173 | kurz | Einziehen! 🏡 | 9 | - | - | 9 | 9 | Gut. |
| KURZ-314 | 173 | kurz | Fertig ✨ | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/ui/CollectionBook.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-315 | 36 | kurz | ${h[0]}–${h[1] % 24} Uhr | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-316 | 40 | kurz | 🐟 Fische | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-317 | 40 | kurz | 🦋 Insekten | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-318 | 40 | kurz | 🦴 Funde | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-319 | 40 | kurz | 🌷 Blumen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-320 | 261 | kurz |  · ✨ Prachtexemplar | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/ui/CraftPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-321 | 19 | kurz | 🔨 Bauen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-322 | 20 | kurz | 🫖 Aufbrühen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-323 | 21 | kurz | 🍳 Kochen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-324 | 22 | kurz | 🍳 Kochen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-325 | 82 | kurz | 🔨 Bauen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-326 | 129 | kurz | craft-need ${n >= i.count ? 'ok' : ''} | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-327 | 153 | kurz | 💐 Binden | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/ui/DecorBar.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-328 | 58 | kurz | Taste G | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-329 | 59 | kurz | 🛋️ Einrichten | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-330 | 108 | kurz | swatch ${v.itemId === decor.holding ? 'active' : ''} | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/ui/DialogBox.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-331 | 120 | kurz | dialog-next ${done && !showChoices ? 'visible' : ''} | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-332 | 128 | kurz | ${value} von ${MAX_HEARTS} Herzen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/ui/GalleryPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-333 | 86 | kurz | Preis: ${today.price} ${CURRENCY.icon} · du hast ${formatMoney(data.money)} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/ui/Hud.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-334 | 60 | kurz | Zu Hause | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-335 | 63 | kurz | 🌈 Regenbogen! | 9 | - | - | 9 | 8 | Gut. |
| KURZ-336 | 63 | kurz | ${WEATHER_ICONS[weather.kind]} ${WEATHER_LABELS[weather.kind]} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-337 | 66 | kurz | Menü öffnen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-338 | 84 | kurz | Dorfkarte (M) | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-339 | 93 | kurz | Sammelbuch (B) | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-340 | 97 | kurz | Tasche (I) | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-341 | 113 | kurz | ${itemDef(t)?.name} (${i + 1}) | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-342 | 159 | kurz | rotate(${k * 30}deg) | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/ui/InventoryPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-343 | 134 | kurz | Verkauft! +${formatMoney(earned)} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-344 | 192 | kurz | slot ${s ? '' : 'empty'} ${selected === i ? 'selected' : ''} ${cursor === i ? 'cursor' : ''} ${sellSet.has(i) ? 'marked' : ''} | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-345 | 194 | kurz | ${itemDef(s.itemId)?.name ?? s.itemId}, ${s.count} Stück | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-346 | 218 | kurz | unverkäuflich 💕 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-347 | 255 | kurz | ${selDef?.name} angebracht! ✨ | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/ui/MailPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-348 | 56 | kurz | letter-item ${l.id === openId ? 'active' : ''} | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/ui/MapPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-349 | 27 | kurz | 🏡 Lina | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-350 | 29 | kurz | Olaf & Christin | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-351 | 30 | kurz | 🥐 Jens | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-352 | 31 | kurz | 🩺 Lars | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-353 | 130 | kurz | 11px sans-serif | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-354 | 136 | kurz | 16px sans-serif | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/ui/Menu.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-355 | 12 | kurz | ${h} Std. ${m} Min. | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-356 | 13 | kurz | ${Math.max(1, m)} Min. | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-357 | 29 | kurz | Gespeichert! 💾 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-358 | 66 | kurz | Neu anfangen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/ui/MiniGamePanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-359 | 165 | kurz | Los! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/ui/NotebookPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-360 | 23 | kurz | ${on} von ${max} Herzen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-361 | 46 | kurz | ${Math.round(f.fill * 100)}% | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/ui/PhotoPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-362 | 25 | kurz | ${formatDate(now)} ${now.getFullYear()} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-363 | 25 | kurz | ${session.data?.villageName ?? ''} · ${SEASON_LABELS[getSeason(now)]} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/ui/SeedStandPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-364 | 44 | kurz | ${n}× ${name} gekauft. 🌱 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-365 | 58 | kurz | ${qty}× kaufen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/ui/StoragePanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-366 | 36 | kurz | ${name} → ${to} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-367 | 97 | kurz | unverkäuflich 💕 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/ui/TitleScreen.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-368 | 25 | kurz | Neu anfangen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-369 | 62 | kurz | Neues Spiel | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-370 | 62 | kurz | Los geht’s! 🌸 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/ui/TvPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-371 | 38 | kurz |  mit Oli | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-372 | 39 | kurz | linear-gradient(135deg, ${ch.colors[0]}, ${ch.colors[1]}) | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-373 | 59 | kurz | Heute: ${episodeToday(session, c).title} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/ui/UkulelePanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-374 | 74 | kurz | ${i * 20}ms | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/ui/ZusammenPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-375 | 79 | kurz | zs-card ${shown ? 'shown' : ''} ${s.found[i] ? 'found' : ''} | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-376 | 130 | kurz | zs-tile ${t === 0 ? 'gap' : ''} ${puzzleRightAt(s, pic, i) ? 'right' : ''} | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-377 | 190 | kurz | Perfekt! ${pickCheer(def, n)} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-378 | 190 | kurz | Gut! ${pickCheer(def, n + 1)} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-379 | 216 | kurz | ${pos * 100}% | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-380 | 278 | kurz | Level ${i + 1} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-381 | 278 | kurz | 🔒 Level ${i + 1} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-382 | 304 | kurz | Bestwert ${b} / ${levels[i]?.length ?? '?'} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-383 | 331 | kurz | Ausgewichen … ${pickCheer(def, st.i + 1)} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-384 | 371 | kurz | ${(1 - hits / len) * 100}% | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-385 | 375 | kurz | ${left * 100}% | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-386 | 400 | kurz | rotate(${lean} 50 90) | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-387 | 412 | kurz | rotate(-15 78 54) | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-388 | 413 | kurz | rotate(-5 72 64) | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-389 | 464 | kurz | 🏆 geschafft | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-390 | 497 | kurz | Runde ${s.round}! ${pickCheer(def, s.round)} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-391 | 559 | kurz | ${center - 25}% | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-392 | 562 | kurz | ${center - 2}% | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |
| KURZ-393 | 620 | kurz | Papa: „${quiz.right[i % quiz.right.length]}“ | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/ui/navigation.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-394 | 95 | kurz | input, select, textarea, .btn, .chip, .swatch | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/world3d/Collectibles3D.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-395 | 200 | kurz | boden-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)} | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/world3d/Fishing3D.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-396 | 162 | kurz | bold 44px sans-serif | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/world3d/Insects3D.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-397 | 78 | kurz | ${this.session.today()}:${now.getHours()}:${this.session.weatherOverride ?? ''} | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/world3d/Winston.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-398 | 22 | kurz | 700 44px sans-serif | - | - | - | - | - | Technischer String (Schlüssel/Format/CSS/Schrift), kein Spieltext. |

## `src/world3d/World3D.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-399 | 1339 | kurz | Ein Versteck! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-400 | 1589 | kurz | ⛏️ Ausgraben | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-401 | 1614 | kurz | ${name} gepflückt! 💐 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-402 | 1640 | kurz | Die ${name} ${stage}. | 5 | - | - | 4 | 4 | „Die ${name} ${stage}.“ – „Die Lavendel keimt.“, „Die Kürbis keimt.“, „Die Vergissmeinnicht …“ – Artikel fest feminin. |
| KURZ-403 | 1711 | kurz | 🚪 Hineingehen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-404 | 1712 | kurz | 👋 Später | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-405 | 1802 | kurz | ${npc.def.name}s Häuschen. | 4 | - | - | 3 | 3 | „${name}s Häuschen.“ – ergibt „Larss Häuschen“/„Jenss Häuschen“ (Genitiv bei -s-Namen). |
| KURZ-406 | 1808 | kurz | ${npc.def.name}s Häuschen | 4 | - | - | 3 | 3 | Fenstertitel mit gleichem Genitivfehler („Larss“, „Jenss“). |
| KURZ-407 | 1811 | kurz | 🚪 Hineingehen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-408 | 1873 | kurz | 💬 Mit ${npc.def.name} reden | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-409 | 1874 | kurz | 👋 Weiter | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-410 | 1969 | kurz | 💬 Plaudern | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-411 | 2006 | kurz | 🌅 Zur Herzbank | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-412 | 2014 | kurz | 💭 Herzenswunsch | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-413 | 2016 | kurz | 💃 Tanzen! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-414 | 2022 | kurz | 🌿 Apotheke | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-415 | 2032 | kurz | 💡 Ordnungstipp? | 8 | - | 7 | 9 | 7 | „Ordnungstipp?“ – Rahmen passt nicht zu allen Tipps (siehe CHR). |
| KURZ-416 | 2044 | kurz | 🖼️ Galerie | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-417 | 2055 | kurz | 🏦 Dorfkasse | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-418 | 2061 | kurz | 👋 Tschüss | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-419 | 2086 | kurz | 💝 ${o.label} | 9 | - | - | 9 | 8 | Gut. |
| KURZ-420 | 2089 | kurz | ⏳ Später | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-421 | 2089 | kurz | 👍 Mach ich! | 9 | - | - | 9 | 8 | Gut. |
| KURZ-422 | 2788 | kurz | Chez Jens | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-423 | 2799 | kurz | 🍳 Ins Kochstudio | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-424 | 2800 | kurz | 👋 Später | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-425 | 2819 | kurz | 🍽️ Reingehen & mitessen | 9 | - | - | 9 | 8 | Gut. |
| KURZ-426 | 2820 | kurz | 👋 Später | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-427 | 2829 | kurz | 🍳 Kochstudio | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-428 | 2830 | kurz | 🖼️ Galerie | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-429 | 2831 | kurz | 🚪 Hineingehen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-430 | 2832 | kurz | 👋 Tschüss | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-431 | 2907 | kurz | 🌿 Apotheke | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-432 | 2908 | kurz | 🚪 Hineingehen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-433 | 2909 | kurz | 👋 Tschüss | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-434 | 3093 | kurz | 700 20px Nunito, sans-serif | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-435 | 3098 | kurz | ${cur} ${w} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-436 | 3170 | kurz | 34px sans-serif | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-437 | 3604 | kurz | Überraschung! | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-438 | 3665 | kurz | 🐾 Streicheln | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-439 | 3665 | kurz | 👋 Weiter | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-440 | 3679 | kurz | 👋 Weiter | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-441 | 3699 | kurz | 👋 Weiter | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-442 | 3702 | kurz | 🎓 Tricks | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-443 | 3703 | kurz | 👋 Weiter | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-444 | 3715 | kurz | ${WINSTON_NAME}s Tricks | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-445 | 3718 | kurz | ${t.icon} ${t.name} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-446 | 3719 | kurz | 🍪 Üben (1 Keks) | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-447 | 3720 | kurz | 👋 Weiter | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-448 | 3786 | kurz | ${line} (${itemDef(found)?.name ?? found}) | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-449 | 3955 | kurz | ${ox + x},${oz + y + (e.dir === 'down' ? 1 : -1)} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-450 | 4223 | kurz | 🎶 Spielen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-451 | 4296 | kurz | blur(${fx.blur.toFixed(2)}px) saturate(${(1 + 0.12 * fx.lean).toFixed(2)}) | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-452 | 4297 | kurz | rotate(${roll.toFixed(2)}deg) scale(${fx.zoom.toFixed(3)}) | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-453 | 4321 | kurz | 🍺 Ein Bier | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-454 | 4321 | kurz | 🥤 Cola Zero | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-455 | 4321 | kurz | 💧 Wasser | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-456 | 4329 | kurz | 💧 Wasser | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-457 | 4337 | kurz | 🥥 Kokoswasser | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-458 | 4337 | kurz | 🍺 Ein Bier | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-459 | 4337 | kurz | 💧 Wasser | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-460 | 4344 | kurz | 🍺 Ein Bier | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-461 | 4344 | kurz | 💧 Wasser | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-462 | 4352 | kurz | ${s.today()}:${Math.floor(now / 1000)}:${kind} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-463 | 4367 | kurz | 🍺 Bier | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-464 | 4367 | kurz | 🍷 Wein | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-465 | 4367 | kurz | 🍋 Highball | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-466 | 4367 | kurz | 💧 Wasser | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-467 | 4367 | kurz | 🥥 Kokoswasser | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-468 | 4367 | kurz | 🥤 Cola Zero | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-469 | 4379 | kurz | ${d.icon} ${d.name} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-470 | 4390 | kurz | 🥛 Mit Milchschaum | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-471 | 4401 | kurz | ${drink.icon} ${drink.name} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-472 | 4425 | kurz | 👋 Später | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-473 | 4439 | kurz | 💪 Stemmen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-474 | 4787 | kurz | ${itemDef(itemId)?.name} angebracht! ✨ | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-475 | 4827 | kurz | ${name} nachgekauft. 🛒 | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-476 | 4974 | kurz | 🪓 ${name} fällen | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-477 | 5086 | kurz | ${d.label} (${d.price} ⭐) | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/world3d/Yard3D.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-478 | 90 | kurz | ${item.x},${item.y - 1} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-479 | 90 | kurz | ${item.x + 1},${item.y} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-480 | 90 | kurz | ${item.x},${item.y + 1} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-481 | 90 | kurz | ${item.x - 1},${item.y} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/world3d/materials.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-482 | 32 | kurz | ${color}\|${opts.emissive ?? ''}\|${opts.emissiveIntensity ?? ''}\|${opts.transparent ? 1 : 0}\|${opts.opacity ?? 1}\|${opts.side ?? 0} | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |

## `src/world3d/models/buildings.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| KURZ-483 | 574 | kurz | Bistro & Kochstudio | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-484 | 576 | kurz | ♥ Croissants ♥ | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
| KURZ-485 | 766 | kurz | ♥ Apotheke & Kräuter ♥ | 9 | - | - | 9 | 8 | Kurzer UI-/Menütext, klar. |
