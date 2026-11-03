# Rina no Chiisana Sekai 🌸

**りなの ちいさな せかい – Linas kleine Welt**

Ein gemütliches 3D-Life-Sim-Spiel im Browser, gemacht mit Liebe für Lina. 💕
Lina zieht in ein kleines, verschlafenes Dorf und macht es nach und nach zu ihrem Zuhause – und mit der
Zeit ziehen ihre Liebsten dazu.

![Linas Häuschen am Tag](docs/screenshots/3d-tag.png)

## Spielen

👉 **<https://oliverm93.github.io/Rina-no-chiisana-sekai/>**

Läuft in jedem modernen Browser auf Laptop oder PC. Der Spielstand wird automatisch im Browser gespeichert.

| | Tastatur | Maus |
|---|---|---|
| Laufen | WASD oder Pfeiltasten | irgendwohin klicken |
| Rennen | Umschalttaste halten | (lange Wege rennt Lina von allein) |
| Anschauen / Reden / Aufheben | Leertaste, E oder Enter | auf Dinge klicken |
| Zoomen | – | Mausrad |
| Tasche | I oder Tab | 🎒 unten rechts |
| Menü | Esc | ☰ oben rechts |

**Was es zu tun gibt:** Oma Gisela besuchen (sie sitzt gern auf ihrer Bank), plaudern und ihr etwas
schenken, Bäume schütteln, Muscheln sammeln, Blumen pflücken, an Felsen klopfen, Gesammeltes in der
Verkaufskiste gegen Sternchen ⭐ tauschen und Briefe im Briefkasten lesen.

Im Menü: Aussehen ändern, speichern, **Spielstand exportieren/laden** (als Datei – praktisch zum Sichern
oder für ein anderes Gerät), Vollbild, Hilfe.

Die Uhrzeit im Dorf ist die **echte Uhrzeit**: Abends gehen die Laternen an, nachts leuchten die Fenster,
und jede Jahreszeit sieht anders aus.

**Linas Liebste** (Lina, Oma Gisela, Olaf, Christin, Lars, Jens):

![Figuren](docs/screenshots/3d-familie.png)

| Oma Gisela auf ihrer Bank | Dorfplatz am Abend | Nacht |
|---|---|---|
| ![Gisela](docs/screenshots/3d-gisela.png) | ![Abend](docs/screenshots/3d-abend.png) | ![Nacht](docs/screenshots/3d-nacht.png) |

| Brücke | Strand | Charakter-Editor |
|---|---|---|
| ![Brücke](docs/screenshots/3d-bruecke.png) | ![Strand](docs/screenshots/3d-strand.png) | ![Editor](docs/screenshots/3d-editor.png) |

## Lokal starten

Voraussetzung: [Node.js](https://nodejs.org/) 22 oder neuer.

```bash
npm install
npm run dev
```

Dann <http://localhost:5173> öffnen.

Weitere Befehle:

```bash
npm test            # Tests
npm run typecheck   # TypeScript prüfen
npm run build       # Produktions-Build nach dist/
npm run preview     # Build ansehen
```

**Andere Uhrzeit ausprobieren:** `?zeit=21:30` oder `?datum=2026-12-24&zeit=18:00` an die Adresse hängen,
z. B. <http://localhost:5173/?zeit=21:30>.

**3D-Galerie (Entwicklung):** <http://localhost:5173/gallery.html> zeigt Figuren, Natur und Gebäude in 3D.

## Veröffentlichung (GitHub Pages)

Jeder Merge nach `main` wird automatisch gebaut und veröffentlicht
(`.github/workflows/deploy.yml`). Einmalig einrichten:
**Settings → Pages → Build and deployment → Source: „GitHub Actions“**.

Pull Requests werden automatisch geprüft (Typecheck, Tests, Build – `.github/workflows/ci.yml`).

## Technik

TypeScript · Vite · Three.js · Preact · Vitest. Alle 3D-Modelle und Texturen entstehen im Code (keine
externen Modelle oder Bilder). Details zu Architektur und Konventionen stehen in [`CLAUDE.md`](CLAUDE.md), die Meilensteine in
[`ROADMAP.md`](ROADMAP.md).
