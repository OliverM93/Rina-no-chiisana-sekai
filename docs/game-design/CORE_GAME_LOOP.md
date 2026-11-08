# Core Game Loop

## Überblick

```
          ┌────────────── Erkunden & Sammeln ──────────────┐
          │ Angeln · Kescher · Bäume · Strand · Felsen ·   │
          │ Graben · Blumen · Eier · Winstons Funde        │
          └───────┬───────────────┬───────────────┬────────┘
                  │               │               │
            Verkaufen         Verarbeiten      Schenken
          (Verkaufskiste)  (Werkbank, Küche,  (Bewohner)
                  │         Apotheke, Binden)     │
                  ▼               │               ▼
             Sternchen ◄──────────┘          Herzen → Briefe
                  │                          (Möbel, Rezepte,
                  ▼                           Samen)
       Möbelkatalog · Samenstand ·                │
       Galerie · Hausausbau (Kredit)              │
                  │                               │
                  ▼                               ▼
           Gestalten (Zimmer, Garten) ◄───────────┘
                  │
                  ▼
       Meilensteine → Einzüge → neue Orte, Bewohner, Systeme
```

## Loops nach Zeitskala

### Mikro-Loop (Sekunden) ✅
Hingehen → Anschauen/Aktion → sofortiges Feedback (Ton, Partikel, Toast, Freudensprung).
- Angeln: Auswerfen → 2–5,5 s Warten → Biss → Einholen. Verpassen = erneutes Knabbern.
- Kescher, Bäume schütteln, Felsen klopfen, Graben, Pflücken, Gießen, Streicheln.
- **Game Feel:** gut ausgebaut (M8c: Staub, Spritzer, Funkeln, Herzchen, Konfetti). 🔶 Animationen sind
  laut Roadmap noch nicht abgeschlossen.

### Sitzungs-Loop (Minuten) ✅
„Runde durchs Dorf“: Post holen → Bewohner begrüßen → Tägliches einsammeln → angeln/fangen → zurück,
verkaufen → kaufen/craften/kochen → einrichten. Tasche (20 Plätze) und Verkaufskiste vor dem Haus setzen den
natürlichen Takt („Tasche voll → heim“).

### Tages-Loop (echter Tag) ✅
Neues Wetter, neue Insekten-Rotation (stündlich), Muscheln, Felsen, Blumen, Grabstellen, Eier, Samen-Angebot,
Galerie-Bild, TV-Folge, Gespräch & Geschenk zählen je 1×. Beet wächst eine Stufe (wenn gegossen oder Regen).
Christin gießt abends mit.

### Wochen-Loop ✅
Treffen (Kaffeeklatsch Mo/Mi/Fr, Angeln Di/Do/Sa, Training Mi/Sa, Strand Di/Fr), Samstagsparty 19–22 Uhr,
Sonntagsessen bei Jens 18–20 Uhr, Jens verreist ca. jeden 7. Tag (Postkarte, Andenken, Tasse).

### Jahres-Loop ✅
Jahreszeiten (Laub, Arten, Saison-Tassen, Wintermöbel), Winterruhe im Beet, Feste (Ostern, Halloween, Advent
mit Olis Kalender, Weihnachten, Silvester, Neujahr), Geburtstage von Lina (16.06.) und Oli (29.07.).

### Meta-Loop (Fortschritt) ✅
Meilensteine → Ankündigungsbrief → ~10 Min Spielzeit → Einzug → neues Gebäude/System:

| Einzug | Bringt |
|---|---|
| Oma Gisela (Start) | Werkzeuge, Keksrezepte, Weisheiten |
| Olaf & Christin | Dorfkasse (Ausbau-Kredit, Sparbuch), Samenstand, Christin gießt mit |
| Oli | wohnt bei Lina, Romantik, Kaffee zu zweit, Fernsehabend |
| Jens | Bistro/Kochstudio, Galerie, Reisen, Sonntagsessen |
| Lars | Praxis/Apotheke, Tees, Gesundheits-Check |
| Thalia | Schaufel & Funde, Dorfkarte, Samstagsparty |

Danach: **Herzenswünsche** ✅ (jeder Bewohner wünscht sich etwas fürs Dorf → neuer Ort) und Hausausbau (6 Stufen) als längster Strang.

## Wie die Loops ineinandergreifen (Systems Thinking)

**Starke Verknüpfungen ✅**
- Beet ↔ Samenstand ↔ Kreuzungen ↔ Sammelbuch ↔ Binden ↔ Geschenke ↔ Einrichtung (Vasen, Kränze).
- Gemüse/Kräuter ↔ Küche ↔ Rezept-Freischaltung bei erster Ernte ↔ Geschenke.
- Fernseher (Kochshow) ↔ Rezepte; Jens' Reisen ↔ Sammeltassen ↔ Tassenbord.
- Bewohner-Meetups ↔ Freundschaft ↔ Herz-Briefe ↔ Möbel.

**Schwache oder fehlende Verknüpfungen 💡**
- **Fisch & Insekten** speisen fast nur die Verkaufskiste und das Sammelbuch. Nur `fischsuppe` und
  `fischbroetchen` nutzen Fisch; Insekten werden nirgends verarbeitet. → Die häufigste Aktivität hat die
  geringste Systemtiefe.
- **Sparbuch** ist ein reiner Zahlenspeicher ohne Verbindung zu anderem (bewusst schlicht, aber ein Sackgassen-System).
- **Funde/Fossilien** → Sammelbuch und Verkauf; Thalias Fossilien-Vitrine ist Herz-Geschenk, aber es gibt keinen
  Ort, Funde *auszustellen* (Museum war in M4 auf Thalia verschoben, ⬜).
- **Galerie** stiften → Freundschaft mit Jens, darüber hinaus keine Wirkung im Dorf.

## Dominante Schleife heute (📏 Analyse)

Für Sternchen ist **Angeln → Verkaufen** die einfachste und ergiebigste Schleife: keine Tagesgrenze, im Schnitt
~90–105 ⭐ pro Fang je nach Monat, kein Geschick nötig. Alles Tägliche zusammen bringt eher wenige Hundert ⭐.
Das ist *noch kein Problem* (nichts erzwingt Optimierung), wird aber relevant, sobald das Spätspiel
Sternchen-Ziele bekommt. Details: [`GAME_ECONOMY.md`](GAME_ECONOMY.md).
