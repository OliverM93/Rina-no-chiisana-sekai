# Dialog-Audit – Zeilentabelle: Oberfläche, Systemtexte & Hinweise

Teil 3 des [Dialog-Audits](../dialogue-audit.md). Spalten: **S** Sinnhaftigkeit · **H** Humor · **C** Charaktertreue · **N** Natürlichkeit · **G** Gesamt (1–10). „-“ = nicht zutreffend (z. B. kein Witz beabsichtigt, kein Sprecher) bzw. technischer String ohne Spieltext. ⏎ = Zeilenumbruch im Original.


## `src/ui/App.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| APP-001 | 206 | UI | modal-layer top | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |
| APP-002 | 207 | UI | card confirm pop-in | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |
| APP-003 | 212 | UI | Lieber nicht | 9 | - | - | 9 | 9 | „Lieber nicht“ – sanfte Absage. |
| APP-004 | 235 | UI | toast pop-in | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |

## `src/ui/BankPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| BANKPA-001 | 41 | UI/Dorfkasse | Bezahlt vom Sparbuch – Papa hat ${formatMoney(next ? next.price - bausparShare(next.price) : 0)} dazugelegt! In ein paar Minuten ist alles fertig. 🔨 | 9 | - | 9 | 8 | 8 | Gut. |
| BANKPA-002 | 42 | UI/Dorfkasse | Abgemacht! In ein paar Minuten ist dein Ausbau fertig. 🔨 | 9 | - | - | 9 | 8 | UI-Text, klar. |
| BANKPA-003 | 43 | UI/Dorfkasse | Erst den alten Kredit abbezahlen – dann bauen wir weiter. | 9 | - | 9 | 9 | 8 | Gut. |
| BANKPA-004 | 44 | UI/Dorfkasse | Auf dem Sparbuch liegt noch nicht genug. | 9 | - | - | 9 | 8 | UI-Text, klar. |
| BANKPA-005 | 49 | UI/Dorfkasse | ${formatMoney(n)} aufs Sparbuch gelegt. 📒 | 9 | - | - | 9 | 8 | UI-Text, klar. |
| BANKPA-006 | 50 | UI/Dorfkasse | Gerade hast du keine Sternchen dabei. | 9 | - | - | 9 | 8 | UI-Text, klar. |
| BANKPA-007 | 54 | UI/Dorfkasse | ${formatMoney(n)} abgehoben. Viel Spaß damit! | 9 | - | - | 9 | 8 | Gut. |
| BANKPA-008 | 59 | UI/Dorfkasse | Gerade hast du keine Sternchen dabei. | 9 | - | - | 9 | 8 | UI-Text, klar. |
| BANKPA-009 | 64 | UI/Dorfkasse | card bank pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| BANKPA-010 | 90 | UI/Dorfkasse | Olafs Bausparen: Papa legt 25 % dazu | 9 | - | - | 9 | 8 | UI-Text, klar. |
| BANKPA-011 | 97 | UI/Dorfkasse | soft small-text | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| BANKPA-012 | 101 | UI/Dorfkasse | soft small-text | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| BANKPA-013 | 115 | UI/Dorfkasse | btn small primary | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| BANKPA-014 | 128 | UI/Dorfkasse | soft small-text | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| BANKPA-015 | 130 | UI/Dorfkasse |  Nächstes Mal: etwa ${formatMoney(interestFor(savings))}. | 9 | - | - | 9 | 8 | UI-Text, klar. |
| BANKPA-016 | 140 | UI/Dorfkasse | btn small primary | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |

## `src/world3d/models/buildings.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| BUILDI-001 | 472 | UI | 800 46px "Nunito Variable", Nunito, sans-serif | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |
| BUILDI-002 | 569 | UI | italic 800 40px "Nunito Variable", Nunito, serif | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |
| BUILDI-003 | 573 | UI | 700 22px "Nunito Variable", Nunito, sans-serif | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |
| BUILDI-004 | 762 | UI | 800 34px "Nunito Variable", Nunito, sans-serif | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |
| BUILDI-005 | 763 | UI | Praxis Dr. Lars | 9 | - | - | 9 | 8 | UI-Text, klar. |
| BUILDI-006 | 764 | UI | 700 22px "Nunito Variable", Nunito, sans-serif | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |

## `src/game/cafe.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| CAFE-001 | 16 | UI | Im Café bei Jens | 9 | - | - | 9 | 8 | UI-Text, klar. |

## `src/ui/CharacterEditor.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| CHARAC-001 | 53 | UI | card editor pop-in | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |
| CHARAC-002 | 54 | UI | Wie sieht Lina heute aus? | 9 | - | - | 9 | 8 | UI-Text, klar. |
| CHARAC-003 | 54 | UI | Aussehen ändern | 9 | - | - | 9 | 8 | UI-Text, klar. |
| CHARAC-004 | 151 | UI | Name deines Dorfes | 9 | - | - | 9 | 8 | UI-Text, klar. |
| CHARAC-005 | 155 | UI | Idee würfeln | 9 | - | - | 9 | 8 | UI-Text, klar. |

## `src/ui/CollectionBook.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| COLLEC-001 | 20 | UI/Sammelbuch | das ganze Jahr | 9 | - | - | 9 | 8 | UI-Text. |
| COLLEC-002 | 35 | UI/Sammelbuch | den ganzen Tag | 9 | - | - | 9 | 8 | UI-Text. |
| COLLEC-003 | 51 | UI/Sammelbuch | card book pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| COLLEC-004 | 59 | UI/Sammelbuch | soft book-progress | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| COLLEC-005 | 85 | UI/Sammelbuch |  · zuerst gefunden am ${entry.firstDay.split('-').reverse().join('.')} | 9 | - | - | 9 | 8 | UI-Text. |
| COLLEC-006 | 116 | UI/Sammelbuch | card book pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| COLLEC-007 | 124 | UI/Sammelbuch | soft book-progress | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| COLLEC-008 | 152 | UI/Sammelbuch | Gibt es als Samen | 9 | - | - | 9 | 8 | UI-Text. |
| COLLEC-009 | 155 | UI/Sammelbuch | Entstanden aus ${COLORS[mix.a].label} × ${COLORS[mix.b].label}${mix.rare ? ' – klappt nur manchmal.' : '.'} | 9 | - | - | 9 | 8 | Vorlage, klar. |
| COLLEC-010 | 160 | UI/Sammelbuch |  · zuerst erblüht am ${entry.firstDay.split('-').reverse().join('.')} | 9 | - | - | 9 | 8 | UI-Text. |
| COLLEC-011 | 168 | UI/Sammelbuch | Diese Farbe entsteht nur durch Kreuzen. | 9 | - | - | 9 | 8 | UI-Text. |
| COLLEC-012 | 169 | UI/Sammelbuch | Diese Farbe gibt es als Samen – vielleicht kommt Post? | 9 | - | - | 9 | 8 | Gut. |
| COLLEC-013 | 209 | UI/Sammelbuch | Meer vor der versteckten Insel | 9 | - | - | 9 | 8 | UI-Text. |
| COLLEC-014 | 213 | UI/Sammelbuch | card book pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| COLLEC-015 | 228 | UI/Sammelbuch | soft book-progress | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| COLLEC-016 | 252 | UI/Sammelbuch |  · nur bei Regen | 9 | - | - | 9 | 8 | UI-Text. |
| COLLEC-017 | 257 | UI/Sammelbuch |  · zuerst gefangen am ${entry.firstDay.split('-').reverse().join('.')} | 9 | - | - | 9 | 8 | UI-Text. |
| COLLEC-018 | 273 | UI/Sammelbuch | Nimm die Angel (Taste 1), stell dich ans Wasser und drück die Leertaste. | 9 | - | - | 9 | 8 | UI-Text. |
| COLLEC-019 | 274 | UI/Sammelbuch | Nimm den Kescher (Taste 2) und schleich dich an Schmetterlinge, Käfer & Co. heran. | 9 | - | - | 9 | 8 | UI-Text. |

## `src/world3d/Collectibles3D.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| COLLEC-020 | 276 | UI/Sammelbuch | Die Blätter rascheln. Heute fällt nichts herunter. | 9 | 7 | - | 9 | 8 | Gut. |

## `src/game/crafting.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| CRAFTI-001 | 23 | UI | Kochen kannst du am Herd – später in deiner eigenen Küche oder bei Jens im Kochstudio. | 9 | - | - | 9 | 8 | UI-Text, klar. |
| CRAFTI-002 | 24 | UI | Aufbrühen kannst du es in Lars' Apotheke. | 9 | - | - | 9 | 8 | UI-Text, klar. |
| CRAFTI-003 | 25 | UI | Ab an die Werkbank. | 9 | - | - | 9 | 8 | UI-Text, klar. |
| CRAFTI-004 | 33 | UI | 📜 Neues Rezept: ${recipeName(r)}! ${recipeWhere(r)} | 9 | - | - | 9 | 8 | UI-Text, klar. |
| CRAFTI-005 | 45 | UI | Das Rezept „${recipeName(card)}“ kennst du schon. | 9 | - | - | 9 | 8 | UI-Text, klar. |

## `src/ui/CraftPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| CRAFTP-001 | 19 | UI/Werkbank | 🔨 Ludwigs Werkbank | 9 | - | - | 9 | 8 | UI-Text. |
| CRAFTP-002 | 19 | UI/Werkbank | Aus Ästen, Steinen, Muscheln & Blumen wird etwas Schönes. | 9 | - | - | 9 | 8 | Gut. |
| CRAFTP-003 | 19 | UI/Werkbank | gebaut! Ab in die Tasche – aufstellen mit „Einrichten“. | 8 | - | - | 8 | 7 | Satzfragment-Vorlage (Name davor), okay. |
| CRAFTP-004 | 20 | UI/Werkbank | 🌿 Apotheke von Dr. Lars | 9 | - | - | 9 | 8 | UI-Text. |
| CRAFTP-005 | 20 | UI/Werkbank | „Tee hilft immer. Sagt Oma. Und ausnahmsweise geb ich ihr recht.“ | 9 | 8 | 10 | 9 | 9 | Lars gibt Oma ausnahmsweise recht – sehr gut. |
| CRAFTP-006 | 20 | UI/Werkbank | aufgebrüht! Wohl bekomm's! | 9 | - | - | 9 | 8 | UI-Text. |
| CRAFTP-007 | 21 | UI/Werkbank | 🍳 Linas Küche | 9 | - | - | 9 | 8 | UI-Text. |
| CRAFTP-008 | 21 | UI/Werkbank | Lina kocht für ihr Leben gern. Heute wird es bestimmt lecker! | 9 | - | 9 | 9 | 8 | Gut. |
| CRAFTP-009 | 21 | UI/Werkbank | gekocht! Riecht das gut! Ab in die Tasche. | 9 | - | - | 9 | 8 | UI-Text. |
| CRAFTP-010 | 22 | UI/Werkbank | 👨‍🍳 Kochstudio „Chez Jens“ | 9 | - | - | 9 | 8 | UI-Text. |
| CRAFTP-011 | 22 | UI/Werkbank | „Kochen ist wie Malen, chérie – ein Klecks hiervon, ein Klecks davon!“ | 9 | 7 | 9 | 9 | 8 | Gut. |
| CRAFTP-012 | 22 | UI/Werkbank | gekocht! Magnifique! Ab in die Tasche. | 9 | 5 | 8 | 9 | 7 | „Magnifique!“-Formel. |
| CRAFTP-013 | 64 | UI/Werkbank | ✨ ${recipeName(sel)} ${sel.group === 'blumen' ? 'gebunden! Ab in die Tasche.' : T.done} | 9 | - | - | 9 | 8 | UI-Text. |
| CRAFTP-014 | 67 | UI/Werkbank | Deine Tasche ist zu voll für das fertige Stück. 🎒 | 9 | - | - | 9 | 8 | Gut. |
| CRAFTP-015 | 68 | UI/Werkbank | Da fehlt noch etwas Material. | 9 | - | - | 9 | 8 | Gut. |
| CRAFTP-016 | 77 | UI/Werkbank | card book craft pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| CRAFTP-017 | 82 | UI/Werkbank | 💐 Blumen binden | 9 | - | - | 9 | 8 | UI-Text. |
| CRAFTP-018 | 90 | UI/Werkbank | soft small-text | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| CRAFTP-019 | 91 | UI/Werkbank | soft small-text | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| CRAFTP-020 | 96 | UI/Werkbank | book-grid catalog-grid | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| CRAFTP-021 | 103 | UI/Werkbank | book-cell catalog-cell ${k ? '' : 'unknown'} ${selected === r.id ? 'selected' : ''} ${built === r.id ? 'craft-pop' : ''} | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| CRAFTP-022 | 106 | UI/Werkbank | Unbekanntes Rezept | 9 | - | - | 9 | 8 | Gut. |
| CRAFTP-023 | 122 | UI/Werkbank |  · ${furn.small ? 'klein (passt auf Tische)' : furn.rug ?  | 9 | - | - | 9 | 8 | Vorlage. |

## `src/ui/DecorBar.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| DECORB-001 | 58 | UI | btn primary decor-start pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| DECORB-002 | 59 | UI | 🌷 Garten gestalten | 9 | - | - | 9 | 8 | UI-Text, klar. |
| DECORB-003 | 71 | UI | card decor-panel pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| DECORB-004 | 73 | UI | soft small-text | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| DECORB-005 | 76 | UI | soft small-text | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| DECORB-006 | 76 | UI | Keine Gartensachen da. Hol dir welche im 🛒 Katalog oder an der Werkbank! | 9 | - | - | 9 | 8 | UI-Text, klar. |
| DECORB-007 | 76 | UI | Nichts zum Aufstellen da. Hol dir etwas im 🛒 Katalog! | 9 | - | - | 9 | 8 | UI-Text, klar. |
| DECORB-008 | 82 | UI | book-cell decor-cell ${decor.holding === s.itemId ? 'selected' : ''} | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| DECORB-009 | 83 | UI | ${itemDef(s.itemId)?.name}${s.inStorage ? ' (aus der Truhe)' : ''} | 9 | - | - | 9 | 8 | UI-Text, klar. |
| DECORB-010 | 88 | UI | in der Truhe | 9 | - | - | 9 | 8 | UI-Text, klar. |
| DECORB-011 | 93 | UI | btn small decor-shop | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| DECORB-012 | 97 | UI | decor-bar pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| DECORB-013 | 100 | UI | ${holding}: Klicken zum Abstellen${decor.valid ? '' : ' (hier passt es nicht)'} | 9 | - | - | 9 | 8 | UI-Text, klar. |
| DECORB-014 | 102 | UI | Klick auf Gartensachen zum Verschieben – auf einen Busch oder Baum zum Wegmachen. Kamera: ziehen oder WASD, Mausrad zoomt. | 9 | - | - | 8 | 8 | Hilfreich, etwas lang. |
| DECORB-015 | 103 | UI | Klick auf ein Möbel zum Verschieben – C = noch eins. Kamera: ziehen oder WASD, Mausrad zoomt. | 9 | - | - | 8 | 8 | Hilfreich. |
| DECORB-016 | 106 | UI | Farbe wechseln (V oder 1–9) – kostenlos | 9 | - | - | 9 | 8 | UI-Text, klar. |
| DECORB-017 | 123 | UI | btn primary small | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |

## `src/ui/DialogBox.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| DIALOG-001 | 99 | UI | dialog-choices pop-in | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |
| DIALOG-002 | 112 | UI | dialog-box pop-in | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |

## `src/core/dialogue.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| DIALOG-003 | 79 | UI | ${ctx.day}:${i}:${typeof l.text === 'string' ? l.text : l.text[0]} | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |

## `src/game/dinner.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| DINNER-001 | 46 | UI | Sonntagsessen bei Jens | 9 | - | - | 9 | 8 | UI-Text, klar. |

## `src/core/floorplan.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| FLOORP-001 | 116 | Entwickler | Raum ${r.id} kommt doppelt vor | - | - | - | - | - | Entwickler-Fehlermeldung (Validierung), nie im Spiel sichtbar. |
| FLOORP-002 | 118 | Entwickler | Raum ${r.id} hat keine Größe | - | - | - | - | - | Entwickler-Fehlermeldung (Validierung), nie im Spiel sichtbar. |
| FLOORP-003 | 127 | Entwickler | Räume ${a.id} und ${b.id} überlappen oder haben keinen Wandstreifen | - | - | - | - | - | Entwickler-Fehlermeldung (Validierung), nie im Spiel sichtbar. |
| FLOORP-004 | 134 | Entwickler | Tür ${d.room}→${d.to}: Raum fehlt | - | - | - | - | - | Entwickler-Fehlermeldung (Validierung), nie im Spiel sichtbar. |
| FLOORP-005 | 138 | Entwickler | Tür ${d.room}→${d.to}: Feld liegt nicht im Raum | - | - | - | - | - | Entwickler-Fehlermeldung (Validierung), nie im Spiel sichtbar. |
| FLOORP-006 | 140 | Entwickler | Tür ${d.room}→${d.to}: Feld liegt nicht an der Wand (${d.side}) | - | - | - | - | - | Entwickler-Fehlermeldung (Validierung), nie im Spiel sichtbar. |
| FLOORP-007 | 146 | Entwickler | Tür ${d.room}→${d.to}: Gegenstück liegt nicht genau gegenüber | - | - | - | - | - | Entwickler-Fehlermeldung (Validierung), nie im Spiel sichtbar. |
| FLOORP-008 | 147 | Entwickler | Tür ${d.room}→${d.to}: Wandstreifen liegt in einem Raum | - | - | - | - | - | Entwickler-Fehlermeldung (Validierung), nie im Spiel sichtbar. |
| FLOORP-009 | 152 | Entwickler | Haustür: Raum fehlt | - | - | - | - | - | Entwickler-Fehlermeldung (Validierung), nie im Spiel sichtbar. |
| FLOORP-010 | 169 | Entwickler | Raum ${r.id} ist nicht erreichbar | - | - | - | - | - | Entwickler-Fehlermeldung (Validierung), nie im Spiel sichtbar. |

## `src/game/flowers.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| FLOWER-001 | 94 | UI | 🌷 Neue Farbe im Sammelbuch: ${flowerLabel(id)}! ✨ | 9 | - | - | 9 | 8 | UI-Text, klar. |

## `src/game/friends.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| FRIEND-001 | 63 | UI | Beim nächsten Herz schreibt dir ${npc.name} wieder. | 9 | - | - | 9 | 8 | UI-Text, klar. |

## `src/ui/Hud.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| HUD-001 | 53 | UI | hud-clock pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| HUD-002 | 66 | UI | hud-menu-button pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| HUD-003 | 71 | UI | hud-zoom pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| HUD-004 | 79 | UI | hud-bottom pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| HUD-005 | 84 | UI | hud-bag hud-book | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| HUD-006 | 84 | UI | Dorfkarte öffnen (M) | 9 | - | - | 9 | 8 | UI-Beschriftung, klar. |
| HUD-007 | 89 | UI | hud-bag hud-book | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| HUD-008 | 89 | UI | Foto machen (F) | 9 | - | - | 9 | 8 | UI-Beschriftung, klar. |
| HUD-009 | 89 | UI | Foto machen (F) | 9 | - | - | 9 | 8 | UI-Beschriftung, klar. |
| HUD-010 | 93 | UI | hud-bag hud-book | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| HUD-011 | 93 | UI | Sammelbuch öffnen (B) | 9 | - | - | 9 | 8 | UI-Beschriftung, klar. |
| HUD-012 | 97 | UI | Tasche öffnen (I) | 9 | - | - | 9 | 8 | UI-Beschriftung, klar. |
| HUD-013 | 105 | UI | Neue Post im Briefkasten | 9 | - | - | 9 | 8 | UI-Beschriftung, klar. |
| HUD-014 | 105 | UI | Neue Post im Briefkasten | 9 | - | - | 9 | 8 | UI-Beschriftung, klar. |
| HUD-015 | 111 | UI | hud-tools pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| HUD-016 | 155 | UI | stars-overlay fireworks | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| HUD-017 | 157 | UI | firework fw-${b.c} | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |

## `src/ui/InventoryPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| INVENT-001 | 108 | UI | Dein Werkzeug brauchst du noch! 🔧 | 9 | - | - | 9 | 8 | UI-Text, klar. |
| INVENT-002 | 108 | UI | Das ist ein Erinnerungsstück – das behältst du lieber. 💕 | 9 | - | - | 9 | 8 | Gut. |
| INVENT-003 | 112 | UI | Das kann man nicht einpflanzen. 🌱 | 9 | - | - | 9 | 8 | UI-Text, klar. |
| INVENT-004 | 117 | UI | Dein Werkzeug brauchst du noch! 🔧 | 9 | - | - | 9 | 8 | UI-Text, klar. |
| INVENT-005 | 117 | UI | Das ist unverkäuflich – viel zu wertvoll! 💕 | 9 | - | - | 9 | 8 | Gut. |
| INVENT-006 | 161 | UI | Was schenkst du ${NPC_BY_ID[panel.npcId]?.name ?? ''}? | 9 | - | - | 9 | 8 | UI-Text, klar. |
| INVENT-007 | 163 | UI | Was möchtest du pflanzen? | 9 | - | - | 9 | 8 | UI-Text, klar. |
| INVENT-008 | 164 | UI | Deine Tasche | 9 | - | - | 9 | 8 | UI-Text, klar. |
| INVENT-009 | 169 | UI | card inventory pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| INVENT-010 | 194 | UI | leerer Platz | 9 | - | - | 9 | 8 | UI-Text, klar. |
| INVENT-011 | 214 | UI | Werkzeug – behältst du immer 🔧 | 9 | - | - | 9 | 8 | UI-Text, klar. |
| INVENT-012 | 216 | UI | Erinnerungsstück – unverkäuflich, nicht zum Verschenken 💕 | 9 | - | - | 9 | 8 | UI-Text, klar. |
| INVENT-013 | 219 | UI | Wert: ${selDef.price} ${CURRENCY.icon} pro Stück | 9 | - | - | 9 | 8 | UI-Text, klar. |
| INVENT-014 | 226 | UI | Deine Tasche ist noch leer. Schüttel Bäume, sammle Muscheln am Strand oder pflück ein paar Blumen! | 9 | - | - | 9 | 8 | Hilfreich. |
| INVENT-015 | 227 | UI | Tippe einen Gegenstand an, um ihn dir anzusehen. | 8 | - | - | 7 | 7 | „Tippe … an“ – PC-Spiel; „Klick“. |
| INVENT-016 | 270 | UI | In die Hand nehmen | 9 | - | - | 9 | 8 | UI-Text, klar. |

## `src/ui/MailPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| MAILPA-001 | 42 | UI | Deine Tasche ist voll! 🎒 | 9 | - | - | 9 | 8 | UI-Text, klar. |
| MAILPA-002 | 50 | UI | card mail pop-in | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |
| MAILPA-003 | 77 | UI | btn small primary | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |

## `src/main.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| MAIN-001 | 57 | UI | .loading-layer p | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |
| MAIN-002 | 60 | UI | Hoppla, das Dorf konnte nicht gemalt werden: ${msg} – bitte Seite neu laden (Strg+F5) oder einen anderen Browser probieren. | 9 | 7 | - | 8 | 8 | „Hoppla, das Dorf konnte nicht gemalt werden“ – freundlich trotz Fehler. |
| MAIN-003 | 68 | UI | 700 16px "Nunito Variable" | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |
| MAIN-004 | 163 | UI | Hinweis: Dieser Browser erlaubt kein Speichern. Bitte exportiere deinen Spielstand im Menü. | 9 | - | - | 9 | 8 | UI-Text, klar. |

## `src/gfx/malen.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| MALEN-001 | 321 | UI | 800 ${s}px Nunito Variable, sans-serif | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |

## `src/ui/MapPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| MAPPAN-001 | 98 | UI | 800 11px "Nunito Variable", Nunito, sans-serif | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |
| MAPPAN-002 | 113 | UI | 800 14px "Nunito Variable", Nunito, sans-serif | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |
| MAPPAN-003 | 143 | UI | card map-card pop-in | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |
| MAPPAN-004 | 146 | UI | soft small-text center | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |

## `src/ui/Menu.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| MENU-001 | 29 | UI | Speichern im Browser nicht möglich – bitte exportieren. | 9 | - | - | 9 | 8 | UI-Text, klar. |
| MENU-002 | 36 | UI | Spielstand exportiert 📤 | 9 | - | - | 9 | 8 | UI-Text, klar. |
| MENU-003 | 49 | UI | Spielstand laden? | 9 | - | - | 9 | 8 | UI-Text, klar. |
| MENU-004 | 50 | UI | Der Spielstand aus „${result.data.villageName}“ ersetzt dein aktuelles Spiel. | 9 | - | - | 9 | 8 | UI-Text, klar. |
| MENU-005 | 55 | UI | Spielstand geladen 📥 | 9 | - | - | 9 | 8 | UI-Text, klar. |
| MENU-006 | 64 | UI | Ganz neu anfangen? | 9 | - | - | 9 | 8 | UI-Text, klar. |
| MENU-007 | 65 | UI | Dein jetziges Dorf wird dabei überschrieben. Tipp: Exportiere vorher deinen Spielstand, dann kannst du ihn jederzeit zurückholen. | 9 | - | - | 9 | 9 | Gut, hilfreich. |
| MENU-008 | 75 | UI | Vollbild wird hier nicht unterstützt. | 9 | - | - | 9 | 8 | UI-Text, klar. |
| MENU-009 | 91 | UI | card menu pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| MENU-010 | 154 | UI | card-actions spread | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| MENU-011 | 155 | UI | btn ghost danger | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |

## `src/ui/MiniGamePanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| MINIGA-001 | 142 | UI/Minispiel | card minigame pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| MINIGA-002 | 150 | UI/Minispiel | Pfeiltasten oder WASD – Winston sammelt Leckerli. Die Ränder sind weich. | 9 | 7 | - | 9 | 8 | „Die Ränder sind weich.“ – säulentreu. |
| MINIGA-003 | 153 | UI/Minispiel | Neuer Rekord: ${score} Leckerli! Winston wedelt stolz. 🐶✨ | 9 | - | - | 9 | 8 | Gut. |
| MINIGA-004 | 155 | UI/Minispiel | Winston hat sich verheddert – ${score} Leckerli! Nochmal? 🐶 | 9 | - | - | 9 | 8 | Gut. |
| MINIGA-005 | 156 | UI/Minispiel | Winston hat sich verheddert. Nochmal? 🐶 | 9 | - | - | 9 | 8 | Gut. |
| MINIGA-006 | 157 | UI/Minispiel | Winston will Leckerli! Leertaste startet. | 9 | - | - | 9 | 8 | Gut. |

## `src/game/nature.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| NATURE-001 | 94 | UI | Angel, Kescher, Gießkanne & Samen eingesteckt! (Tasten 1–3) | 9 | - | - | 9 | 8 | UI-Text, klar. |
| NATURE-002 | 180 | UI | 📏 ${result.cm} cm${result.pracht ? ' – ein Prachtexemplar! ✨' : ''} | 9 | - | - | 9 | 8 | UI-Text, klar. |
| NATURE-003 | 181 | UI | 🏅 Neuer Rekord! | 9 | - | - | 9 | 8 | UI-Text, klar. |
| NATURE-004 | 183 | UI | Deine Tasche ist voll – du lässt es wieder frei. Tschüss! | 9 | 7 | - | 9 | 8 | „Tschüss!“ – nett. |
| NATURE-005 | 303 | UI | Deine Tasche ist voll! 🎒 | 9 | - | - | 9 | 8 | UI-Text, klar. |

## `src/ui/NotebookPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| NOTEBO-001 | 38 | UI | soft nb-intro | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| NOTEBO-002 | 52 | UI | nb-note soft | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| NOTEBO-003 | 53 | UI | nb-note soft | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| NOTEBO-004 | 99 | UI | card notebook pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| NOTEBO-005 | 140 | UI | nb-note soft | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |

## `src/game/notebook.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| NOTEBO-006 | 52 | UI | 📮 ${nameOf(waiting.npc)} hat geschrieben – bald ist es so weit! Bis dahin einfach den Tag genießen. | 9 | - | - | 9 | 9 | „einfach den Tag genießen“ – säulentreu. |
| NOTEBO-007 | 68 | UI | ${p.stars.need} ⭐ für die Dorfkasse | 9 | - | - | 9 | 8 | UI-Text, klar. |
| NOTEBO-008 | 76 | UI | 🔨 „${HOUSE_STAGES[house.pending.stage]?.name}“ wird gerade gebaut. | 9 | - | - | 9 | 8 | UI-Text, klar. |
| NOTEBO-009 | 77 | UI | 🏦 Bei Papa sind noch ${data.bank.loan.toLocaleString('de-DE')} ⭐ offen – ganz ohne Eile. | 9 | - | - | 9 | 9 | „ganz ohne Eile“ – säulentreu. |
| NOTEBO-010 | 79 | UI | 🏡 Nächster Ausbau: „${next.name}“ (${next.price.toLocaleString('de-DE')} ⭐, auf Kredit bei Papa an der Dorfkasse). | 9 | - | - | 9 | 8 | UI-Text, klar. |

## `src/game/party.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| PARTY-001 | 21 | UI | feiert auf dem Dorfplatz | 9 | - | - | 9 | 8 | UI-Text, klar. |

## `src/game/pet.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| PET-001 | 128 | UI | (${n} von ${trick.practice} Übungen für „${trick.name}“) | 9 | - | - | 9 | 8 | UI-Text, klar. |

## `src/gfx/photoFrame.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| PHOTOF-001 | 89 | UI | 800 ${fs}px "Nunito Variable", Nunito, sans-serif | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |
| PHOTOF-002 | 92 | UI | Linas kleine Welt · ${caption.place} | 9 | - | - | 9 | 8 | UI-Text, klar. |
| PHOTOF-003 | 94 | UI | 700 ${Math.round(fs * 0.8)}px "Nunito Variable", Nunito, sans-serif | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |

## `src/ui/PhotoPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| PHOTOP-001 | 59 | UI | Foto gespeichert. 📷 | 9 | - | - | 9 | 8 | UI-Text, klar. |
| PHOTOP-002 | 65 | UI | card photo-card pop-in | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |
| PHOTOP-003 | 70 | UI | chip small ${style === f.id ? 'active' : ''} | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |

## `src/gfx/prints.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| PRINTS-001 | 39 | UI | italic 900 ${px}px Nunito, "Brush Script MT", cursive | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |
| PRINTS-002 | 152 | UI | 900 ${px}px Impact, "Arial Black", Nunito, sans-serif | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |

## `src/core/save.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| SAVE-001 | 284 | UI | Keine Migration von Version ${version} vorhanden. | - | - | - | - | - | Entwickler-Fehlermeldung, im Spiel nicht sichtbar. |
| SAVE-002 | 426 | UI | Die Datei ist kein gültiger Spielstand (kein JSON). | 9 | - | - | 8 | 8 | Klar. |
| SAVE-003 | 429 | UI | Die Datei sieht nicht wie ein Spielstand aus. | 9 | - | - | 9 | 8 | UI-Text, klar. |
| SAVE-004 | 435 | UI | Dieser Spielstand stammt aus einer neueren Spielversion. Bitte das Spiel aktualisieren. | 9 | - | - | 9 | 8 | UI-Text, klar. |

## `src/core/schedule.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| SCHEDU-001 | 26 | UI | Ungültige Uhrzeit: ${s} | - | - | - | - | - | Entwickler-Fehlermeldung, im Spiel nicht sichtbar. |
| SCHEDU-002 | 35 | UI | Leerer Tagesablauf | - | - | - | - | - | Entwickler-Fehlermeldung, im Spiel nicht sichtbar. |
| SCHEDU-003 | 57 | UI | ${e.from} ist nicht aufsteigend sortiert | - | - | - | - | - | Entwickler-Fehlermeldung, im Spiel nicht sichtbar. |
| SCHEDU-004 | 58 | UI | ${e.from} liegt nach Mitternacht | - | - | - | - | - | Entwickler-Fehlermeldung, im Spiel nicht sichtbar. |

## `src/ui/SeedStandPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| SEEDST-001 | 45 | UI | Dafür reichen deine Sternchen gerade nicht. ⭐ | 9 | - | - | 9 | 8 | UI-Text. |
| SEEDST-002 | 46 | UI | Deine Tasche ist voll! 🎒 | 9 | - | - | 9 | 8 | UI-Text. |
| SEEDST-003 | 54 | UI | soft small-text | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| SEEDST-004 | 65 | UI | card seedstand pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| SEEDST-005 | 80 | UI | soft small-text | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| SEEDST-006 | 103 | UI | soft small-text | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |

## `src/ui/StoragePanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| STORAG-001 | 37 | UI | Die Truhe ist voll! 📦 | 9 | - | - | 9 | 8 | UI-Text, klar. |
| STORAG-002 | 37 | UI | Deine Tasche ist voll! 🎒 | 9 | - | - | 9 | 8 | UI-Text, klar. |
| STORAG-003 | 38 | UI | Werkzeuge behältst du lieber griffbereit. 🔧 | 9 | - | - | 9 | 8 | UI-Text, klar. |
| STORAG-004 | 57 | UI | ${itemDef(s.itemId)?.name ?? s.itemId}, ${s.count} Stück – ${from === 'bag' ? 'in die Truhe legen' : 'in die Tasche nehmen'} | 9 | - | - | 9 | 8 | UI-Text, klar. |
| STORAG-005 | 57 | UI | leerer Platz | 9 | - | - | 9 | 8 | UI-Text, klar. |
| STORAG-006 | 70 | UI | card storage-card pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| STORAG-007 | 75 | UI | slot-grid storage-bag | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| STORAG-008 | 79 | UI | soft small-text | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| STORAG-009 | 84 | UI | slot-grid storage-chest | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| STORAG-010 | 87 | UI | item-detail storage-detail | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| STORAG-011 | 97 | UI | Wert: ${def.price} ${CURRENCY.icon} pro Stück | 9 | - | - | 9 | 8 | UI-Text, klar. |
| STORAG-012 | 97 | UI | Klick: in die Truhe | 9 | - | - | 9 | 8 | UI-Text, klar. |
| STORAG-013 | 97 | UI | Klick: in die Tasche | 9 | - | - | 9 | 8 | UI-Text, klar. |

## `src/data/texts.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| TEXTS-001 | 4 | UI | Deine Tasche ist voll – es liegt vor deinen Füßen. 🎒 | 9 | - | - | 9 | 8 | UI-Text, klar. |
| TEXTS-002 | 7 | UI | Deine Tasche ist voll – der Rest liegt vor deinen Füßen und wartet, bis du ihn aufhebst. 🎒 | 9 | - | - | 8 | 8 | Gut. |

## `src/ui/TitleScreen.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| TITLES-001 | 13 | UI | Der Spielstand konnte leider nicht geladen werden. | 9 | - | - | 9 | 8 | UI-Text. |
| TITLES-002 | 23 | UI | Ganz neu anfangen? | 9 | - | - | 9 | 8 | UI-Text. |
| TITLES-003 | 24 | UI | Es gibt schon ein Dorf. Ein neues Spiel überschreibt es (am besten vorher im Menü exportieren). | 9 | - | - | 9 | 8 | Hilfreich. |
| TITLES-004 | 42 | UI | Willkommen zurück in ${result.data.villageName}! 💕 | 9 | - | - | 9 | 9 | Gut. |
| TITLES-005 | 47 | UI | title-logo pop-in | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| TITLES-006 | 55 | UI | title-buttons pop-in delay | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| TITLES-007 | 57 | UI | btn primary big | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| TITLES-008 | 61 | UI | btn big ${hasSave ? '' : 'primary'} | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |

## `src/ui/UkulelePanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| UKULEL-001 | 26 | UI | Das klingt nach Sonnenuntergang am Strand. 🌺 | 9 | - | - | 9 | 8 | Gut. |
| UKULEL-002 | 69 | UI | card ukulele pop-in | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |
| UKULEL-003 | 74 | UI | uke-string buzz | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |
| UKULEL-004 | 79 | UI | uke-chord on | - | - | - | - | - | Technischer String (CSS-Klasse/Schrift/Formatierung), kein Spieltext. |

## `src/world3d/World3D.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| WORLDD-001 | 678 | System/UI | 🎉 Party auf dem Dorfplatz! Thalia hat Musik mitgebracht. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-002 | 805 | System/UI | Oma hat dir ${tools.map((t) => itemDef(t)?.name).join(', ')} wiedergebracht. „Pass diesmal besser drauf auf, Kind!“ 🔧 | 9 | 7 | 9 | 9 | 8 | Gut, Oma-Stimme in Systemmeldung. |
| WORLDD-003 | 805 | System/UI | Olis Möbel stehen wieder bereit – sie lagen noch im Keller. 📦 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-004 | 810 | System/UI | Oma Gisela hat etwas für dich – sprich sie doch mal an! 🎁 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-005 | 869 | System/UI | Dein Ausbau ist fertig! | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-006 | 869 | System/UI | Liebe Lina,⏎⏎dein Haus ist fertig umgebaut: ${HOUSE_STAGES[stage].name}! Geh doch gleich mal rein und schau es dir an.⏎⏎Die Abrechnung liegt bei mir in der Dorfkasse. Ganz ohne Eile.⏎⏎Dein Papa | 9 | - | 9 | 8 | 8 | Brief Olaf, gut. |
| WORLDD-007 | 877 | System/UI | Schaufel eingesteckt! (Taste 4) – und die Dorfkarte gibt's mit M. 🗺️ | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-008 | 929 | System/UI | 🎂 Heute hat ${bday?.name} Geburtstag! Vielleicht ein kleines Geschenk? 🎁 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-009 | 1323 | System/UI | Stell dich ans Wasser und schau aufs Wasser, dann kannst du auswerfen. 🎣 | 7 | - | - | 6 | 6 | „ans Wasser … aufs Wasser“ – doppeltes Wort, holprig. |
| WORLDD-010 | 1324 | System/UI | Gießen kannst du die Pflanzen in deinem Beet. 🌱 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-011 | 1325 | System/UI | Hier ist nichts. Such nach kleinen Rissen im Boden, die funkeln! ✨ | 9 | - | - | 9 | 8 | Hilfreich. |
| WORLDD-012 | 1348 | System/UI | Deine Tasche ist voll – es liegt vor deinen Füßen. 🎒 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-013 | 1399 | System/UI | Deine Tasche ist voll! 🎒 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-014 | 1411 | System/UI | ${f?.kind === 'fossil' ? '🦴 Ein Fossil!' : '💎 Ein Kristall!'} ${f?.name ?? res.itemId} ausgegraben${res.isNew ? ' – neu im Sammelbuch!' : '!'} | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-015 | 1477 | System/UI | Hier beißt gerade nichts. Vielleicht später? | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-016 | 1481 | System/UI | ${itemDef(bait)?.name ?? 'Köder'} am Haken – das wird bestimmt etwas Besonderes! 🪱 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-017 | 1500 | System/UI | Geduld … warte, bis der Schwimmer richtig abtaucht. 🎣 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-018 | 1566 | System/UI | Hier könntest du etwas pflanzen – aber du hast keine Samen dabei. 🌱 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-019 | 1574 | System/UI | Eingepflanzt! Im Winter ruht das Beet – im Frühling oder im Gewächshaus geht es los. ❄️ | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-020 | 1574 | System/UI | Eingepflanzt! Jetzt noch gießen. 💧 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-021 | 1586 | System/UI | Die ${name} vorsichtig ausgraben? Der Samen kommt zurück in deine Tasche, und der Platz ist wieder frei. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-022 | 1596 | System/UI | Ausgegraben! ${itemDef(got.seedId)?.name ?? 'Der Samen'} ist wieder in der Tasche. 🌱 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-023 | 1599 | System/UI | 👋 Lieber nicht | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-024 | 1609 | System/UI | ${itemCountLabel(got.flower, got.count)} geerntet${got.seed ? ' – und ein paar Samen gefunden! 🌱' : '! 🧺'} | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-025 | 1611 | System/UI | ${name} gepflückt – und ein Misch-Same ist abgefallen! ✨ | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-026 | 1613 | System/UI | ${name} gepflückt – und ein paar Samen gefunden! 🌱 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-027 | 1621 | System/UI | Die Erde ist gefroren – im Winter ruht das Beet. Im Gewächshaus wächst es weiter. ❄️ | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-028 | 1628 | System/UI | Gegossen! Morgen wächst die ${name} ein Stück. 💧 | 5 | - | - | 4 | 4 | „Morgen wächst die ${name}“ – Artikel fest „die“: „die Kürbis“, „die Lavendel“, „die Thymian“, „die Vergissmeinnicht“. |
| WORLDD-029 | 1630 | System/UI | Die Erde ist noch schön feucht. Morgen wieder! | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-030 | 1634 | System/UI | ist frisch eingesät | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-031 | 1634 | System/UI | wächst kräftig heran | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-032 | 1634 | System/UI | ist frisch eingepflanzt | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-033 | 1634 | System/UI | hat eine Knospe | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-034 | 1636 | System/UI | Im Winter ruht das Beet. Erst im Frühling wächst sie weiter – oder in einem Frühbeet oder Gewächshaus. ❄️ | 6 | - | - | 5 | 5 | „wächst sie weiter“ – Pronomen fest feminin (bei Kürbis, Lavendel … falsch). |
| WORLDD-035 | 1638 | System/UI | Heute schon gegossen. 💧 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-036 | 1639 | System/UI | Mit der Gießkanne (Taste 3) gießen, dann wächst sie bis morgen. 💧 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-037 | 1709 | System/UI | Eine kleine Hütte im Sand, mit Blumenkranz an der Tür. Sie steht offen – wie für dich gebaut. | 9 | - | - | 9 | 8 | Atmosphärisch. |
| WORLDD-038 | 1733 | System/UI | Tock tock … ein Glitzerstein! ✨ | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-039 | 1733 | System/UI | Tock tock … ${itemCountLabel(found, 1)} kullert heraus! | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-040 | 1737 | System/UI | Tock tock. Heute ist hier nichts mehr zu finden. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-041 | 1802 | System/UI | Niemand zu Hause. Auf einem Zettel steht: „Bin unterwegs. Die Tür ist offen – aber nichts anfassen!“ | 9 | 7 | - | 9 | 8 | Gut. |
| WORLDD-042 | 1811 | System/UI | Lieber nicht | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-043 | 1855 | System/UI | Lina! Gut, dass du kommst. | 9 | - | 8 | 9 | 7 | Okay. |
| WORLDD-044 | 1910 | System/UI | Na gut, Kindchen. Ein andermal. Ich übe solange. | 9 | 7 | 9 | 9 | 8 | Gut. |
| WORLDD-045 | 1910 | System/UI | Kein Problem, ein andermal! | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-046 | 1976 | System/UI | 🎁 Etwas schenken | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-047 | 1986 | System/UI | Na? Doch nichts? Macht nix, Kindchen. | 9 | 7 | 9 | 9 | 8 | Gut. |
| WORLDD-048 | 1986 | System/UI | Doch nichts? Kein Problem! | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-049 | 1994 | System/UI | 😘 Küsschen geben | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-050 | 2006 | System/UI | 🧺 Picknick machen | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-051 | 2006 | System/UI | 🌠 Sterne gucken | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-052 | 2013 | System/UI | 🏠 Zu mir einladen | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-053 | 2020 | System/UI | 🩺 Durchchecken lassen | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-054 | 2030 | System/UI | 🪗 Volkstanz tanzen | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-055 | 2037 | System/UI | 🍳 Zusammen kochen | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-056 | 2056 | System/UI | Gern geschehen, mein Schatz. Sonst noch was? | 9 | - | 9 | 9 | 7 | Okay. |
| WORLDD-057 | 2078 | System/UI | Ach, mir fehlt gerade gar nichts. Du bist ja da! | 9 | - | 9 | 9 | 8 | Gut. |
| WORLDD-058 | 2087 | System/UI | 💝 Wunsch erfüllen | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-059 | 2089 | System/UI | Kein Problem – wann immer du magst. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-060 | 2089 | System/UI | Danke, Lina! Ganz ohne Eile. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-061 | 2099 | System/UI | Hm, da fehlt wohl doch noch was. Macht nichts! | 9 | - | 8 | 9 | 7 | Okay. |
| WORLDD-062 | 2114 | System/UI | ✨ Neu im Dorf: ${wish.title}! Schau doch gleich mal vorbei. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-063 | 2114 | System/UI | 🎁 ${gift} – als Dank für „${wish.title}“! | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-064 | 2114 | System/UI | ✨ Wunsch erfüllt: ${wish.title}! | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-065 | 2524 | System/UI | Schön hast du es hier! | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-066 | 2794 | System/UI | An der Tür hängt ein Schild: | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-067 | 2795 | System/UI | „Bin auf Reisen! ✈️ Postkarte kommt. Der Schlüssel fürs Kochstudio liegt unter der Fußmatte – koch was Schönes, chérie! Bisous, Jens“ | 9 | 8 | 9 | 9 | 8 | Gut. |
| WORLDD-068 | 2796 | System/UI | Gekocht wird natürlich auch zu Hause an deiner Küchenzeile. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-069 | 2812 | System/UI | Drinnen wird gelacht und mit Gläsern geklirrt. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-070 | 2812 | System/UI | „Lina, chérie, du warst doch grad schon da! Nächsten Sonntag wieder, gell?“ | 8 | 6 | 7 | 8 | 7 | „gell“ – süddeutsch. |
| WORLDD-071 | 2817 | System/UI | Aus dem Haus duftet es herrlich, drinnen wird gelacht. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-072 | 2817 | System/UI | „Lina! Komm rein, komm rein – mir sitzen schon alle am Tisch!“ | 9 | - | 9 | 9 | 8 | Gut („mir sitzen“ sächsisch korrekt). |
| WORLDD-073 | 2827 | System/UI | „Komm rein, chérie! Kochen oder Kunst gucken?“ | 9 | - | 9 | 9 | 8 | Gut. |
| WORLDD-074 | 2827 | System/UI | „Bonjour! Das Kochstudio ist offen – und die Galerie auch!“ | 9 | - | 9 | 9 | 8 | Gut. |
| WORLDD-075 | 2897 | System/UI | Praxis Dr. Lars | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-076 | 2902 | System/UI | Praxis geöffnet | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-077 | 2905 | System/UI | „Hallo Lina! Apotheke oder einmal durchs Wartezimmer?“ | 9 | - | 9 | 9 | 8 | Gut. |
| WORLDD-078 | 2905 | System/UI | An der Tür: „Bin gleich zurück! Selbstbedienung in der Apotheke – Kräuter bitte selbst mitbringen. 🌿“ | 9 | 8 | 9 | 9 | 8 | „Kräuter bitte selbst mitbringen“ – gut. |
| WORLDD-079 | 3082 | System/UI | Moment, Lina – ich hab ${c.b.def.name} gerade gesagt: „${c.lines[0]}“ | 9 | - | 8 | 8 | 7 | Vorlage, okay. |
| WORLDD-080 | 3083 | System/UI |  – ich hab geantwortet: „${c.lines[1]}“ | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-081 | 3084 | System/UI | ${c.a.def.name} hat mir gerade gesagt: „${c.lines[0]}“${reply} | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-082 | 3205 | System/UI | Nu, war's lecker? Nächsten Sonntag wieder, gell? Bisous! 💋 | 8 | 6 | 8 | 8 | 7 | „gell“. |
| WORLDD-083 | 3208 | System/UI | Am großen Tisch bei Jens sitzen schon: ${who.join(', ')}. 🍽️ | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-084 | 3209 | System/UI | Sonntagsessen bei Jens | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-085 | 3224 | System/UI | Hier, zur Belohnung fürs Tapfersein: ${itemDef(gift)?.name ?? gift}! 🍭 | 9 | 7 | 9 | 9 | 8 | Gut. |
| WORLDD-086 | 3330 | System/UI | Was für ein schönes Picknick! 💕 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-087 | 3330 | System/UI | Euer Platz am Meer. 🌅 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-088 | 3330 | System/UI | Was für ein Sternenhimmel … 💫 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-089 | 3385 | System/UI | Ein kleiner Dackel | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-090 | 3389 | System/UI | 🤲 Vorsichtig befreien | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-091 | 3409 | System/UI | 👋 Gleich wieder | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-092 | 3412 | System/UI | Das Fiepen wird leiser … er wartet auf dich. 🥺 | 9 | - | - | 9 | 8 | Gut. |
| WORLDD-093 | 3479 | System/UI | 🌺 Ein gemeinsamer Abend am Feuer. Das kommt ins Album. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-094 | 3526 | System/UI | Das Boot wartet. Zur Insel rudern? | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-095 | 3531 | System/UI | ⛵ Zur Insel rudern | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-096 | 3531 | System/UI | ⛵ Zurück ins Dorf | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-097 | 3532 | System/UI | 👋 Lieber nicht | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-098 | 3679 | System/UI | 🐾 Noch einmal | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-099 | 3701 | System/UI | 🐾 Noch einmal | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-100 | 3713 | System/UI | Winston kann ${known.map((t) => t.name).join(', ')}. Als Nächstes lernt er „${next.name}“ (${progress?.done ?? 0} von ${progress?.needed ?? 0} Übungen). | 9 | - | - | 8 | 8 | Gute Fortschrittsanzeige. |
| WORLDD-101 | 4207 | System/UI | Papas Witze-Kalender | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-102 | 4207 | System/UI | Das Blatt von heute: „${joke}“ | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-103 | 4207 | System/UI | Darunter, in Papas Schrift: „Morgen wird's noch besser!“ 😄 | 9 | 8 | 9 | 9 | 8 | Gut. |
| WORLDD-104 | 4221 | System/UI | Eine kleine Ukulele mit Blumenband. Man kann einfach drauflosklimpern – es klingt immer schön. | 9 | - | - | 9 | 8 | Gut. |
| WORLDD-105 | 4224 | System/UI | 👋 Lieber nicht | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-106 | 4253 | System/UI | Olis Schreibtisch | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-107 | 4254 | System/UI | Zwei Bildschirme, eine Tastatur in allen Farben. Auf dem einen läuft ein kleines Spiel. | 9 | - | - | 9 | 8 | Gut. |
| WORLDD-108 | 4256 | System/UI | 🎮 Eine Runde spielen | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-109 | 4257 | System/UI | 👋 Lieber nicht | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-110 | 4275 | System/UI | Ach, ist das gemütlich … 💤 | 9 | - | - | 9 | 8 | Gut. |
| WORLDD-111 | 4275 | System/UI | Schwere Decke, warme Füße, nichts zu tun. Perfekt. 💤 | 9 | - | - | 9 | 8 | Gut. |
| WORLDD-112 | 4275 | System/UI | Lina rollt sich ein. Nur noch fünf Minuten … 🌙 | 9 | - | - | 9 | 8 | Gut. |
| WORLDD-113 | 4275 | System/UI | Mmmh. Die Decke drückt genau richtig. 💤 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-114 | 4275 | System/UI | Lina macht es sich gemütlich. ☕ | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-115 | 4316 | System/UI | 👋 Doch nichts | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-116 | 4320 | System/UI | Gemüse, Omas Pflaumenmus, Cola Zero, ein paar Dosen Zitronen-Highball … und ganz hinten ein paar Bier. Hm. | 9 | 8 | - | 9 | 9 | Sehr gut: „ganz hinten ein paar Bier. Hm.“ |
| WORLDD-117 | 4321 | System/UI | 🍋 -196 Double Lemon | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-118 | 4328 | System/UI | Flaschen, ordentlich gelagert. Eine davon ist schon offen. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-119 | 4329 | System/UI | 🍷 Ein Glas Wein | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-120 | 4336 | System/UI | Eine kleine Bar aus Treibholz. Hinter dem Tresen hängen Muscheln, und es duftet nach Kokos und Zitrone. | 9 | - | - | 9 | 8 | Gut. |
| WORLDD-121 | 4337 | System/UI | 🍋 -196 Double Lemon | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-122 | 4342 | System/UI | Tresen bei Jens | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-123 | 4343 | System/UI | Jens strahlt: „Was darf es sein, ma chérie?“ | 9 | - | 9 | 9 | 8 | Gut. |
| WORLDD-124 | 4343 | System/UI | Der Tresen glänzt. Gläser, ein Zapfhahn, ein bisschen Paris. | 9 | - | - | 9 | 8 | Gut. |
| WORLDD-125 | 4344 | System/UI | 🍷 Ein Glas Wein | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-126 | 4344 | System/UI | 🍋 -196 Double Lemon | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-127 | 4378 | System/UI | Was darf es sein? | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-128 | 4379 | System/UI | 👋 Doch nichts | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-129 | 4387 | System/UI | Die Maschine summt leise und ist startklar. Sie kann ${drinks.length} Getränke. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-130 | 4389 | System/UI | ☕ Klassiker (ohne Milch) | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-131 | 4391 | System/UI | 👋 Doch nichts | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-132 | 4407 | System/UI | ☕ Kaffee-Kick! Lina läuft ein paar Minuten flotter. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-133 | 4424 | System/UI | 💪 Zusammen trainieren | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-134 | 4432 | System/UI | Oli ist gerade dran. „Nur ein Satz noch, Lini!“ | 9 | - | 9 | 9 | 8 | Gut. |
| WORLDD-135 | 4437 | System/UI | Die Hantel liegt bereit. Eine Menge Scheiben dran … Lina grinst. | 9 | 7 | - | 9 | 8 | Gut. |
| WORLDD-136 | 4440 | System/UI | 👋 Lieber nicht | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-137 | 4736 | System/UI | Deine Tasche ist voll! 🎒 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-138 | 4737 | System/UI | Im Hochbeet wächst noch etwas – erst pflücken, dann wegräumen. 🌱 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-139 | 4768 | System/UI | Nichts zum Rückgängigmachen. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-140 | 4773 | System/UI | ↶ ${step.label} rückgängig gemacht. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-141 | 4773 | System/UI | ${step.label} lässt sich nicht mehr rückgängig machen (der Platz ist belegt). | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-142 | 4821 | System/UI | ${name}: gibt es nicht im Katalog – ein Einzelstück. 💝 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-143 | 4825 | System/UI | Noch eins ${name}? Dafür reichen die Sternchen nicht. ⭐ | 5 | - | - | 5 | 5 | „Noch eins ${name}?“ – ungrammatisch (z. B. „Noch eins Kissen?“). |
| WORLDD-144 | 4826 | System/UI | Tasche und Truhe sind voll! 🎒 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-145 | 4826 | System/UI | ${name} gibt es noch nicht im Katalog. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-146 | 4901 | System/UI | Tasche und Truhe sind voll! 🎒 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-147 | 4901 | System/UI | Das lässt sich nicht in einen anderen Raum bringen. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-148 | 4925 | System/UI | Hier ist kein Platz dafür. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-149 | 4925 | System/UI | Hier geht das nicht – vielleicht im Weg oder auf Linas Platz? | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-150 | 4972 | System/UI | ${name} wegmachen? Dann ist hier mehr Platz zum Gestalten. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-151 | 4972 | System/UI | Es gibt ein paar Äste dafür. Weg ist weg – aber neue Bäume gibt es im Dorf genug. 🌳 | 9 | - | - | 9 | 8 | Gut. |
| WORLDD-152 | 4975 | System/UI | Lieber stehen lassen | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-153 | 4989 | System/UI | Der Busch ist weg. 🌿 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-154 | 4989 | System/UI | Der Baum ist weg – mehr Platz! 🪵 | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-155 | 5009 | System/UI | 💧 Christin hat deine Blumen gegossen (${spots.length}). Ordentlich, von links nach rechts. | 9 | 7 | 9 | 9 | 8 | Gut. |
| WORLDD-156 | 5077 | System/UI | Ein Holzstand mit Lichterkette. Auf dem Schild steht: „Geöffnet ab ${PUNSCH_HOURS[0]} Uhr – heißer Punsch & Kakao!“ | 9 | - | - | 9 | 8 | Gut. |
| WORLDD-157 | 5083 | System/UI | Es duftet nach Orangen, Zimt und Nelken. Aus den Töpfen steigt Dampf auf. | 9 | - | - | 9 | 8 | Gut. |
| WORLDD-158 | 5083 | System/UI | Was darf es sein? | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-159 | 5090 | System/UI | Dafür reichen deine Sternchen gerade nicht. ⭐ | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-160 | 5090 | System/UI | Der Stand hat gerade zu. | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |
| WORLDD-161 | 5103 | System/UI | 👋 Nein danke | 9 | - | - | 9 | 8 | Funktionaler Text, klar. |

## `src/core/worldmap.ts`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| WORLDM-001 | 166 | UI | Unbekanntes Kartenzeichen '${ch}' bei (${x}, ${y}). | - | - | - | - | - | Entwickler-Fehlermeldung, im Spiel nicht sichtbar. |

## `src/ui/ZusammenPanel.tsx`

| ID | Zeile | Sprecher | Text | S | H | C | N | G | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| ZUSAMM-001 | 79 | UI/Unternehmung | verdeckte Karte | 9 | - | - | 9 | 8 | UI-Text, klar. |
| ZUSAMM-002 | 85 | UI/Unternehmung | Deck zwei Karten auf und find die Paare. | 9 | - | - | 9 | 8 | UI-Text, klar. |
| ZUSAMM-003 | 106 | UI/Unternehmung | Fertig! Alles an seinem Platz. ✨ | 9 | - | 9 | 9 | 8 | Gut. |
| ZUSAMM-004 | 146 | UI/Unternehmung | Klick ein Teil neben der Lücke an (oder Pfeiltasten). Grün umrandet = richtiger Platz. | 9 | - | - | 9 | 8 | UI-Text, klar. |
| ZUSAMM-005 | 190 | UI/Unternehmung | Knapp daneben – ${pickCheer(def, n + 2)} | 9 | - | - | 9 | 8 | Gut. |
| ZUSAMM-006 | 214 | UI/Unternehmung | zs-takt-zone good | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| ZUSAMM-007 | 215 | UI/Unternehmung | zs-takt-zone perfect | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| ZUSAMM-008 | 218 | UI/Unternehmung | btn primary zs-big | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| ZUSAMM-009 | 221 | UI/Unternehmung | Drück, wenn ihr ganz unten in der Kniebeuge seid (Punkt in der Mitte). | 9 | - | - | 9 | 8 | UI-Text, klar. |
| ZUSAMM-010 | 273 | UI/Unternehmung | btn ${open ? (i === sel ? 'primary' : 'ghost') : 'ghost locked'} | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| ZUSAMM-011 | 300 | UI/Unternehmung | Welcher Boss ist heute dran? | 9 | 7 | - | 9 | 8 | Gut. |
| ZUSAMM-012 | 301 | UI/Unternehmung | Schaff mindestens 60 % Treffer, dann wird das nächste Level frei. | 9 | - | - | 9 | 8 | UI-Text, klar. |
| ZUSAMM-013 | 384 | UI/Unternehmung | Achtung: Bei roten Pfeilen die Gegenrichtung drücken! | 9 | - | - | 9 | 8 | UI-Text, klar. |
| ZUSAMM-014 | 384 | UI/Unternehmung | Drück den Pfeil, der erscheint (Pfeiltasten oder Knöpfe). | 9 | - | - | 9 | 8 | UI-Text, klar. |
| ZUSAMM-015 | 462 | UI/Unternehmung | Gegen welchen Lars trittst du an? | 9 | 8 | 9 | 9 | 9 | „Gegen welchen Lars“ – charmant. |
| ZUSAMM-016 | 463 | UI/Unternehmung | Gewinn das Match (zwei Runden), dann wird der nächste Rang frei. | 9 | - | - | 9 | 8 | UI-Text, klar. |
| ZUSAMM-017 | 510 | UI/Unternehmung | „Tsuppari!“ Lars schiebt plötzlich nach – dagegenhalten! | 9 | 8 | 9 | 9 | 8 | Gut. |
| ZUSAMM-018 | 521 | UI/Unternehmung | Ausgerutscht! Immer abwechselnd ← und →. | 9 | - | - | 9 | 8 | UI-Text, klar. |
| ZUSAMM-019 | 559 | UI/Unternehmung | zs-ringer-pos lina ${pushK ? 'shove' : ''} | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| ZUSAMM-020 | 562 | UI/Unternehmung | zs-ringer-pos lars | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
| ZUSAMM-021 | 574 | UI/Unternehmung | ${lv?.name ?? ''}: abwechselnd ← und → drücken! Zwei gewonnene Runden gewinnen. | 7 | - | - | 6 | 6 | „Zwei gewonnene Runden gewinnen.“ – Tautologie; besser „Wer zuerst zwei Runden holt, gewinnt.“ |
| ZUSAMM-022 | 618 | UI/Unternehmung | Papa lehnt sich gespannt zurück. | 9 | - | 9 | 9 | 8 | Gut. |
| ZUSAMM-023 | 621 | UI/Unternehmung | Papa: „${quiz.wrong[i % quiz.wrong.length]} Richtig ist: ${q.answers[q.right]}.“ | 9 | - | - | 9 | 8 | UI-Text, klar. |
| ZUSAMM-024 | 625 | UI/Unternehmung | Nächste Frage | 9 | - | - | 9 | 8 | UI-Text, klar. |
| ZUSAMM-025 | 711 | UI/Unternehmung | card zusammen pop-in ${def.game === 'takt' ? 'compact' : ''} | - | - | - | - | - | Technischer String (CSS-Klasse), kein Spieltext. |
