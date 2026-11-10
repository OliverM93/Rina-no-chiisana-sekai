# Konzept: Ein zusammenhängendes Haus (Sims-Prinzip)

Status: 🗓️ **geplant** (Entscheidung Oli, Nov. 2026) · noch nicht gebaut · Bewertung des Aufwands: **groß** (mehrere Pull Requests).

## Ziel

Heute ist jeder Raum (Wohnzimmer, Schlafzimmer, Küche, Wintergarten, Dach, Keller) ein **eigener Bildschirm**; zwischen den Räumen blendet eine Tür-Animation um.
Neu: Das Haus ist **ein Grundriss**. Lina läuft ohne Umblenden von Raum zu Raum, und man sieht das **ganze Haus** beim Einrichten – wie bei den Sims.

Entschieden ✅: Erdgeschoss zusammenhängend; **Dach und Keller sind eigene Etagen** mit Treppe · Tapete & Boden bleiben **pro Raum** · Türen **1 Feld breit** (schon umgesetzt, PR #104).

## Wie es heute gebaut ist (Auszug)

- `data/house.ts`: je Ausbaustufe eine Liste von Räumen (`RoomLayout`: Größe + Ausgänge), jeder Raum hat eigene Möbel (`Room.items`, Raum-eigene Koordinaten).
- `world3d/Interior3D.ts` zeigt **einen** Raum; `World3D.placeInRoom` tauscht ihn aus (`session.roomId`).
- Kollision, Wegfindung, Oli, Kamera und Einrichten rechnen in Koordinaten **dieses einen** Raums.

## Kerngedanke: Möbel bleiben raumweise gespeichert

Damit **keine Spielstand-Migration** nötig ist und die gute Raster-Logik (`core/room.ts`) unverändert bleibt:

- Jeder Raum behält seine Möbel in Raum-Koordinaten. Ein neuer **Grundriss** (`data/house.ts`, `FloorPlan`) legt nur fest, **wo jeder Raum im Gesamtgrundriss liegt** (Versatz).
- Zwischen zwei Räumen gibt es **Durchgänge** (1 Feld breit, an einer gemeinsamen Wand). Die Wegfindung rechnet auf einem **Gesamtgitter**, das aus allen Räumen und ihren Durchgängen zusammengesetzt wird.
- Beim Einrichten entscheidet das Feld unter der Maus, in welchem Raum etwas landet; die Prüfung läuft wie heute im Raum-Layout.
- Tapete und Boden hängen weiter am Raum (`Room.wallpaper/floor`), jeder Raum wird mit eigener Tapete gezeichnet.

## Grundriss-Vorschlag (Erdgeschoss, Draufsicht von oben, hinten = oben)

```
Stufe 2:                 Stufe 4:                         Stufe 5:
┌─────────────┐          ┌────────┬───────────┐           ┌────────┬───────────┬────────────┐
│ Schlafzimmer│          │ Küche  │Schlafzimm.│           │ Küche  │Schlafzimm.│ Wintergarten│
├──────┬──────┤          ├────────┴─────┬─────┘           ├────────┴─────┬─────┴────────────┘
│  Wohnzimmer │          │  Wohnzimmer  │                  │  Wohnzimmer  │
└──────┴──────┘          └──────────────┘                  └──────────────┘
     Haustür unten              Haustür unten                      Haustür unten
```

- Wohnzimmer vorne (dort ist die Haustür), die anderen Räume dahinter bzw. daneben. Genaue Maße und Versätze legt `FloorPlan` je Stufe fest; Küche/Schlafzimmer/Wintergarten liegen **nebeneinander in der hinteren Reihe**.
- **Etagen:** Dachzimmer und Keller sind eigene Grundrisse; die Treppe wechselt die Etage (kurzes Umblenden bleibt hier sinnvoll – wie die Etagenansicht bei den Sims).

## Wände (wichtig für „beschaubar“)

Die Kamera schaut schräg von vorn. Wände zwischen vorderer und hinterer Reihe stünden **vor** den hinteren Räumen. Lösung wie bei den Sims:
- **Innenwände sind halbhoch** (sichtbar, aber man sieht darüber hinweg), Außenwände (hinten/links/rechts) wie heute hoch mit Fenstern und Wand-Deko.
- Wand-Deko bleibt an hohen Wänden möglich; an halbhohen Innenwänden nicht (nur Möbel davor).
- Optional später: Schalter **Wände: hoch / halb / aus** im Einrichten (Sims-Wandmodus).

## Umsetzungsphasen (jeweils eigener Pull Request, Spielstand bleibt gültig)

| Phase | Inhalt | Risiko |
|---|---|---|
| **A** | Datenmodell `FloorPlan` + zusammengesetztes Gesamtgitter (Kollision, Wegfindung) mit Tests – noch ohne neue Darstellung | gering |
| **B** | `Interior3D` zeichnet alle Räume des Erdgeschosses (Böden, Wände, Durchgänge, Tapeten je Raum); Kamera folgt Lina und zoomt weiter heraus | mittel |
| **C** | Lina, Oli und Winston laufen ohne Umblenden durch Durchgänge; Licht/Lampen je Raum; Einrichten raumübergreifend (Ghost, Treffer, Rückgängig) | **hoch** |
| **D** | Etagen: Treppe zu Dach/Keller als Etagenwechsel; Hausansicht von außen passt zum Grundriss | mittel |
| **E** | Feinschliff: Wandmodus, Spielstand-Test (alte Stände laden), Doku | gering |

## Risiken & Gegenmaßnahmen

- **Größte Baustelle:** `World3D.ts` (Bewegung, Zielen, Oli, Idle-Pose) geht heute von *einem* Raum aus (`this.lay`, `this.room`, `ROOM_X`). Phase C ändert das gezielt Stück für Stück; die Tests für Raumlogik und der Durchlauf-Test (`game/playthrough.test.ts`) bleiben grün.
- **Spielstand:** Keine Migration nötig, solange Möbel raumweise bleiben (Test: Spielstand v14 laden → gleiche Möbel an gleichen Stellen).
- **Kamera:** Ein breiteres Haus macht Möbel kleiner. Gegenmaßnahme: Zoom-Stufen, Kamera folgt Lina, beim Einrichten „ganzes Haus“-Ansicht.
- **Zeit/Risiko vor der Übergabe:** Das Spiel ist stabil; dieser Umbau berührt Kernstücke. Empfehlung: **in Phasen**, jede Phase einzeln spielbar prüfen, bei Problemen wird nur die letzte Phase zurückgenommen.

## Designprüfung (8 Fragen, Kurzfassung)

1. Das Gefühl, in einem echten, zusammenhängenden Zuhause zu leben und es als Ganzes zu gestalten. 2. Meta-/Sitzungs-Loop „Zuhause gestalten“. 3. Räume werden zu einem Ganzen (Sichtachsen, Laufwege, Oli geht durchs Haus). 4. Gestaltung (Säule 3) bleibt der stärkste Selbstzweck; Ausbau wirkt sichtbarer. 5. Keine Änderung an Preisen oder Fortschritt. 6. Risiko: Möbel stehen Durchgängen im Weg → Durchgangsfelder bleiben gesperrt wie heute die Tür. 7. Säulen 3 & 5. 8. Einfachere Lösung (nur sanfterer Übergang) wurde bewusst **nicht** gewählt.
