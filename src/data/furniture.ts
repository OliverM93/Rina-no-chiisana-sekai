/**
 * Möbel, Tapeten und Böden für Linas Haus.
 *
 * Neue Möbel: hier eintragen und in `world3d/models/furniture.ts` ein Modell
 * (`model`) bauen. Möbel mit Farbvarianten werden automatisch zu mehreren
 * Gegenständen (`zabuton-rosa`, `zabuton-indigo` …).
 */
import { ARTWORKS } from './art';
import { POSTERS } from './posters';
import { FURNITURE_HEIGHTS } from './furnitureHeights';
import { BOUQUETS, EMPTY_VASE, vaseId, WREATHS } from './straeusse';
import { TASSEN } from './tassen';

export type FurnitureStyle = 'japanisch' | 'basis' | 'cottage' | 'retro' | 'modern' | 'midcentury' | 'handgemacht' | 'garten' | 'kunst' | 'winter' | 'lieblinge';

export interface FurnitureDef {
  /** Basis-ID (ohne Variante) */
  id: string;
  name: string;
  style: FurnitureStyle;
  price: number;
  /** Grundfläche in Feldern (ungedreht): Breite (x) × Tiefe (z) */
  w: number;
  d: number;
  /** Auf der Oberfläche kann Kleines stehen */
  surface?: boolean;
  /** Höhe der Oberfläche (für Deko darauf), in Feldern */
  surfaceHeight?: number;
  /** Klein genug für Tische & Kommoden */
  small?: boolean;
  /** Winzig (Tasse): auf Regalen mit `slots` stehen mehrere nebeneinander */
  tiny?: boolean;
  /** Wie viele Winzlinge (Tassen) passen auf ein Feld dieser Oberfläche? (Standard 1) */
  slots?: number;
  /** Teppich: man kann darüber laufen, Möbel darauf stellen */
  rug?: boolean;
  /** Man kann sich hinsetzen (Kissen) bzw. hinlegen (Futon) */
  sit?: 'sitzen' | 'liegen';
  /** Leuchtet abends */
  light?: boolean;
  description: string;
  /** Nur an der Werkbank zu bauen (nicht im Katalog) */
  crafted?: boolean;
  /** Nicht mehr im Katalog, aber wer es schon hat, behält es */
  retired?: boolean;
  /** Nur als Geschenk (z. B. von Oli), nicht im Katalog */
  gift?: boolean;
  /** Für draußen (Linas Garten) statt fürs Haus */
  outdoor?: boolean;
  /** Zaun: verbindet sich mit Nachbarzäunen */
  fence?: boolean;
  /** Man kann hindurchgehen (Gartentor) */
  walk?: boolean;
  /** Hochbeet: jedes Feld ist ein Pflanzplatz */
  bed?: boolean;
  /** Gewächshaus/Frühbeet: Pflanzen wachsen hier auch im Winter weiter */
  greenhouse?: boolean;
  /** Höhe der Erde in diesem Beet (Standard 0,39 = Hochbeet) */
  soilHeight?: number;
  /** Vorratstruhe: öffnet das Lager (Tasche ↔ Truhe) */
  storage?: boolean;
  /** Stall mit Tieren (Hühner/Wachteln), legt täglich Eier */
  coop?: 'huhn' | 'wachtel';
  /** Hängt an der Wand (Rückwand oder Seitenwand) – darunter darf etwas stehen */
  wall?: boolean;
  /** Farbvarianten (Name → Farbe); ohne = eine Variante */
  variants?: Record<string, string>;
  /** Nur im Winter (Dezember–Februar) im Katalog */
  seasonal?: boolean;
  /** Nur in dieser Jahreszeit im Katalog (Saison-Tassen) */
  inSeason?: 'fruehling' | 'sommer' | 'herbst' | 'winter';
}

export const FURNITURE: readonly FurnitureDef[] = [
  { id: 'futon', name: 'Futon', style: 'japanisch', price: 800, w: 1, d: 2, sit: 'liegen', description: 'Weich gepolstert zum Schlafen auf dem Boden. Morgens zusammenrollen? Ach was.', variants: { rosa: '#f7c6d4', indigo: '#5b6fa8', creme: '#f3ead8' } },
  { id: 'chabudai', name: 'Chabudai', style: 'japanisch', price: 600, w: 1, d: 1, surface: true, surfaceHeight: 0.32, description: 'Ein niedriger, runder Tisch. Perfekt für Tee und Gespräche.' },
  { id: 'kotatsu', name: 'Kotatsu', style: 'japanisch', price: 1400, w: 2, d: 2, surface: true, surfaceHeight: 0.42, description: 'Ein Tisch mit Heizdecke darunter. Wer einmal drunter sitzt, steht nie wieder auf.', variants: { rot: '#d9534f', blau: '#5b7fc2', gruen: '#6fa86a' } },
  { id: 'zabuton', name: 'Zabuton', style: 'japanisch', price: 180, w: 1, d: 1, sit: 'sitzen', description: 'Ein dickes Sitzkissen für den Boden.', variants: { rosa: '#f4a3b8', indigo: '#4f5f98', senf: '#e0b04a' } },
  { id: 'andon', name: 'Andon-Laterne', style: 'japanisch', price: 450, w: 1, d: 1, light: true, description: 'Eine Laterne aus Papier und Holz. Leuchtet abends ganz warm.' },
  { id: 'tansu', name: 'Tansu-Kommode', style: 'japanisch', price: 1200, w: 2, d: 1, surface: true, surfaceHeight: 0.8, description: 'Eine Kommode aus dunklem Holz mit Metallbeschlägen und vielen Schubladen.' },
  { id: 'byobu', name: 'Byōbu-Wandschirm', style: 'japanisch', price: 900, w: 2, d: 1, description: 'Ein Faltschirm mit gemalten Kirschblüten.' },
  { id: 'bambus', name: 'Bambus im Topf', style: 'japanisch', price: 350, w: 1, d: 1, description: 'Grün, schlank und pflegeleicht. Glück für das Zuhause.' },
  { id: 'tsukubai', name: 'Zimmerbrunnen', style: 'japanisch', price: 1000, w: 1, d: 1, description: 'Ein kleiner Steinbrunnen mit Bambusrohr. Plätschert beruhigend.' },
  { id: 'tatami-matte', name: 'Tatami-Matte', style: 'japanisch', price: 400, w: 2, d: 2, rug: true, description: 'Eine Matte aus Reisstroh. Riecht ein bisschen nach Sommerwiese.' },
  { id: 'bonsai', name: 'Bonsai', style: 'japanisch', price: 700, w: 1, d: 1, small: true, description: 'Ein winziger, uralter Baum. Er braucht viel Liebe und eine kleine Schere.' },
  { id: 'teeservice', name: 'Teeservice', style: 'japanisch', price: 300, w: 1, d: 1, small: true, description: 'Eine Kanne und zwei Schälchen für grünen Tee.' },
  { id: 'ikebana', name: 'Ikebana-Vase', style: 'japanisch', price: 380, w: 1, d: 1, small: true, description: 'Ein schlichtes Blumengesteck. Weniger ist mehr.' },
  { id: 'winkekatze', name: 'Winkekatze', style: 'japanisch', price: 500, w: 1, d: 1, small: true, description: 'Winkt fröhlich und soll Glück bringen. Oma findet sie „ein bisschen unheimlich“.' },
  { id: 'kokeshi', name: 'Kokeshi-Puppe', style: 'japanisch', price: 260, w: 1, d: 1, small: true, description: 'Eine kleine bemalte Holzpuppe mit rundem Kopf.' },
  { id: 'regal', name: 'Holzregal', style: 'basis', price: 500, w: 2, d: 1, surface: true, surfaceHeight: 0.9, description: 'Ein schlichtes Regal aus hellem Holz.' },
  { id: 'vorratstruhe', name: 'Vorratstruhe', style: 'basis', storage: true, surface: true, surfaceHeight: 0.68, price: 650, w: 2, d: 1, description: 'Eine große Holztruhe mit Eisenbeschlägen. Hier ist Platz für 60 Dinge, die nicht in die Tasche müssen. Alle Truhen teilen sich denselben Vorrat.' },
  { id: 'stehlampe', name: 'Stehlampe', style: 'basis', price: 400, w: 1, d: 1, light: true, description: 'Eine Lampe mit rundem Schirm für gemütliches Licht.' },
  // Handgemacht an Opas Werkbank (siehe `recipes.ts`) – Preis = Verkaufswert × 4
  { id: 'ast-hocker', name: 'Ast-Hocker', style: 'handgemacht', crafted: true, price: 120, w: 1, d: 1, sit: 'sitzen', description: 'Ein kleiner Hocker aus Ästen. Wackelt ein bisschen – das gehört so.' },
  { id: 'blumenvase', name: 'Wildblumenvase', style: 'handgemacht', crafted: true, price: 100, w: 1, d: 1, small: true, description: 'Ein Kieselstein-Töpfchen voller Wildblumen. Bringt die Wiese ins Haus.' },
  { id: 'hundekoerbchen', name: 'Hundekörbchen', style: 'handgemacht', crafted: true, price: 200, w: 1, d: 1, description: 'Ein geflochtenes Körbchen mit Kissen. Genau dackelgroß.' },
  { id: 'steinlaterne', name: 'Steinlaterne', style: 'handgemacht', crafted: true, price: 240, w: 1, d: 1, light: true, description: 'Eine kleine Laterne aus aufgeschichteten Steinen. Leuchtet abends warm.' },
  { id: 'muschellampe', name: 'Muschellampe', style: 'handgemacht', crafted: true, price: 260, w: 1, d: 1, small: true, light: true, description: 'Ein Lämpchen mit Muschelschirm. Klingt fast nach Meer, wenn man es anknipst.' },
  { id: 'treibholzregal', name: 'Astregal', style: 'handgemacht', crafted: true, price: 320, w: 2, d: 1, surface: true, surfaceHeight: 0.8, description: 'Ein Regal aus vielen Ästen. Christin findet es „erstaunlich gerade“.' },
  { id: 'seestern-deko', name: 'Seestern-Deko', style: 'handgemacht', crafted: true, price: 360, w: 1, d: 1, small: true, description: 'Ein Seestern auf einem Muschelbett. Ein kleines Stück Strand.' },
  { id: 'glitzerlampe', name: 'Glitzerlicht', style: 'handgemacht', crafted: true, price: 600, w: 1, d: 1, small: true, light: true, description: 'Ein Glitzerstein auf einem Steinsockel. Funkelt abends in allen Farben.' },
  { id: 'kieselmosaik', name: 'Kieselmosaik', style: 'handgemacht', crafted: true, price: 200, w: 2, d: 2, rug: true, description: 'Viele glatte Kiesel, zu einem runden Muster gelegt. Kühl unter den Füßen.' },
  // Olis Sachen (bringt er beim Einzug mit bzw. schenkt sie per Brief) – nicht im Katalog
  { id: 'schreibtisch-pc', name: 'Olis Schreibtisch', style: 'basis', gift: true, price: 1600, w: 2, d: 1, description: 'Olis Schreibtisch mit Computer, zwei Bildschirmen und einer Tastatur, die in allen Farben leuchtet.' },
  { id: 'hantelbank', name: 'Hantelbank', style: 'basis', gift: true, price: 900, w: 2, d: 1, description: 'Olis Hantelbank mit Langhantel. „Nur ein Satz noch, Lini!“' },
  // Kaffee: Siebträgermaschinen in vier Preisklassen (Olis `kaffeemaschine` ist die zweite) – Getränke in `data/coffee.ts`
  { id: 'espresso-einsteiger', name: 'Einsteiger-Siebträger', style: 'basis', small: true, price: 650, w: 1, d: 1, description: 'Eine kleine, rote Siebträgermaschine. Kann Espresso und Lungo – und das gar nicht schlecht. Ein guter Anfang.' },
  { id: 'espresso-profi', name: 'Zweikreiser-Siebträger', style: 'basis', small: true, price: 3200, w: 1, d: 1, description: 'Edelstahl, zwei Manometer, eine Mühle gleich nebenan. Kann Cappuccino, Latte Macchiato, Flat White und alles andere dazu.' },
  { id: 'espresso-hebel', name: 'Messing-Handhebelmaschine', style: 'basis', small: true, price: 8800, w: 1, d: 1, description: 'Eine Handhebelmaschine aus glänzendem Messing mit Adler obendrauf. Kann alles – auch Latte-Art. Das Herz auf dem Milchschaum gelingt hier fast immer.' },
  { id: 'kaffeemaschine', name: 'Kaffeemaschine', style: 'basis', gift: true, small: true, price: 700, w: 1, d: 1, description: 'Eine glänzende Siebträgermaschine. Oli behandelt sie wie ein Familienmitglied.' },
  { id: 'plattenspieler', name: 'Plattenspieler', style: 'basis', gift: true, small: true, price: 800, w: 1, d: 1, description: 'Ein Plattenspieler mit Olis Lieblingsplatten. Laut aufdrehen erlaubt – meistens.' },
  { id: 'sternenlampe', name: 'Sternenlampe', style: 'basis', gift: true, small: true, light: true, price: 600, w: 1, d: 1, description: 'Eine kleine Lampe, die Sterne an die Wände malt. Von Oli, für gemütliche Abende.' },
  // Von Onkel Jens: Andenken von seinen Reisen & sein Gemälde
  { id: 'eiffelturm', name: 'Mini-Eiffelturm', style: 'basis', gift: true, small: true, price: 400, w: 1, d: 1, description: 'Ein kleiner Eiffelturm aus Paris. „Für die große weite Welt auf deinem Regal!“' },
  { id: 'venedig-maske', name: 'Venezianische Maske', style: 'basis', gift: true, small: true, price: 400, w: 1, d: 1, description: 'Eine goldene Karnevalsmaske aus Venedig, mit Federn. Sehr dramatisch. Sehr Jens.' },
  { id: 'holzschuhe', name: 'Holzschuhe', style: 'basis', gift: true, small: true, price: 400, w: 1, d: 1, description: 'Ein Paar bemalte Holzschuhe aus Amsterdam. Zum Anschauen, nicht zum Anziehen.' },
  { id: 'faecher', name: 'Flamenco-Fächer', style: 'basis', gift: true, small: true, price: 400, w: 1, d: 1, description: 'Ein roter Fächer aus Sevilla. Olé!' },
  { id: 'schneekugel', name: 'New-York-Schneekugel', style: 'basis', gift: true, small: true, price: 400, w: 1, d: 1, description: 'Schütteln, und es schneit über den Wolkenkratzern.' },
  { id: 'daruma', name: 'Daruma', style: 'japanisch', gift: true, small: true, price: 400, w: 1, d: 1, description: 'Ein roter Glücksbringer aus Kyoto. Wenn ein Wunsch in Erfüllung geht, malt man ihm das zweite Auge.' },
  { id: 'gemaelde-jens', name: 'Gemälde von Jens', style: 'basis', gift: true, price: 2000, w: 1, d: 1, description: 'Ein echter Jens! Ein Dackel unter einem rosa Himmel. Signiert mit Herzchen.' },
  { id: 'erste-hilfe', name: 'Erste-Hilfe-Schränkchen', style: 'basis', gift: true, small: true, price: 500, w: 1, d: 1, description: 'Weiß, mit grünem Kreuz und rosa Herzchen-Pflastern drin. Von Lars – „für alle Fälle“.' },
  { id: 'vitrine', name: 'Fossilien-Vitrine', style: 'basis', gift: true, price: 1500, w: 1, d: 1, description: 'Eine Glasvitrine mit Ammonit, Kristall und Bernstein. Von Thalia – „für deine Schätze“.' },
  { id: 'globus', name: 'Globus', style: 'basis', gift: true, price: 1200, w: 1, d: 1, description: 'Ein großer Globus mit lauter kleinen Herzchen drauf – überall dort, wo Thalia mit dir hinreisen will.' },
  // ---- Herz-Geschenke (jedes Herz bringt etwas) ----
  { id: 'setzkasten', name: 'Christins Setzkasten', style: 'basis', gift: true, wall: true, price: 900, w: 1, d: 1, description: 'Ein Holzkasten mit 9 Fächern – in jedem ein Samentütchen, ein Kiesel oder ein Fläschchen. Alles genau an seinem Platz. Von Christin.' },
  { id: 'skelett-kalle', name: 'Knochen-Kalle', style: 'basis', gift: true, price: 1100, w: 1, d: 1, description: 'Lars\' altes Lern-Skelett aus dem Studium. Trägt jetzt eine Fliege. „Damit er nicht so nackt aussieht.“' },
  { id: 'teddy-brummbaer', name: 'Dr. Brummbär', style: 'basis', gift: true, retired: true, small: true, price: 600, w: 1, d: 1, description: 'Lars\' Teddy aus Kindertagen, mit Pflaster am Bauch. An ihm hat er als Siebenjähriger seine erste „Operation“ gemacht.' },
  { id: 'wandkarte-thalia', name: 'Thalias Dorfkarte', style: 'basis', gift: true, wall: true, price: 1000, w: 2, d: 1, description: 'Von Hand gezeichnet: Fluss, Strand, alle Häuser – und ein Herz dort, wo Lina wohnt.' },
  { id: 'ammonit-lina', name: 'Ammonit „Lina“', style: 'basis', gift: true, small: true, price: 800, w: 1, d: 1, description: 'Ein schimmernder Ammonit auf einem Holzsockel. Thalia hat ihn gefunden und nach dir benannt. Wissenschaftlich nicht ganz korrekt. Emotional absolut.' },
  { id: 'witzkalender', name: 'Papas Witze-Kalender', style: 'basis', gift: true, wall: true, price: 500, w: 1, d: 1, description: 'Ein Abreißkalender mit einem Witz für jeden Tag. Selbst geschrieben von Papa. Anschauen auf eigene Gefahr.' },
  { id: 'bilderrahmen-papa', name: 'Foto: Auf Papas Schultern', style: 'basis', gift: true, retired: true, small: true, price: 700, w: 1, d: 1, description: 'Ein Bilderrahmen: Die kleine Lina auf Papas Schultern, beide lachen. Hinten drauf: „Meine beste Investition. Papa.“' },
  { id: 'spruchtafel-lars', name: 'Lars\' Spruchtafel', style: 'basis', gift: true, wall: true, price: 600, w: 1, d: 1, description: 'Ein Holzschild mit Lars\' Lieblingsspruch: „So, und nicht mit e, sonst ist es ein See.“ Oma nennt es einen Rechtschreibfehler.' },
  { id: 'familienbild', name: 'Familienbild', style: 'basis', gift: true, small: true, price: 700, w: 1, d: 1, description: 'Ein gerahmtes Bild von euch allen vor Omas Bank. Jens steht in der Mitte. Er hat darauf bestanden.' },
  { id: 'reisekoffer', name: 'Jens\' Reisekoffer', style: 'basis', gift: true, surface: true, surfaceHeight: 0.31, price: 1400, w: 1, d: 1, description: 'Ein alter Lederkoffer voller Aufkleber aus aller Welt. Jens: „Er war überall. Jetzt soll er bei dir ankommen.“' },
  // Fest-Geschenke
  { id: 'sparschwein', name: 'Sparschwein mit Mütze', style: 'basis', gift: true, small: true, price: 400, w: 1, d: 1, description: 'Von Papa Olaf. Rosa, rund und mit Weihnachtsmütze. „Kleinvieh macht auch Mist!“' },
  { id: 'weihnachtsstern', name: 'Weihnachtsstern', style: 'basis', gift: true, price: 400, w: 1, d: 1, description: 'Von Christin – rote Blätter im goldenen Topf. Bitte gerade hinstellen.' },
  { id: 'kuscheldecke', name: 'Kuscheldecke', style: 'basis', gift: true, rug: true, price: 600, w: 2, d: 1, description: 'Von Oli – flauschig, kariert und groß genug für zwei. Und einen Dackel.' },
  // Winterzauber: nur von Dezember bis Februar im Katalog
  { id: 'weihnachtsbaum', name: 'Weihnachtsbaum', style: 'winter', seasonal: true, light: true, price: 1800, w: 1, d: 1, description: 'Eine kleine Tanne mit Kugeln, Lichterkette und goldenem Stern. Duftet nach Wald.' },
  { id: 'adventskranz', name: 'Adventskranz', style: 'winter', seasonal: true, small: true, light: true, price: 600, w: 1, d: 1, description: 'Tannengrün mit vier roten Kerzen und Zimtstangen. Erst eine, dann zwei, dann drei, dann vier …' },
  { id: 'kaminofen', name: 'Kaminofen', style: 'winter', seasonal: true, light: true, price: 2400, w: 1, d: 1, description: 'Ein kleiner gusseiserner Ofen mit Sichtfenster. Knistert gemütlich – und Winston liegt sofort davor.' },
  { id: 'lebkuchenhaus', name: 'Lebkuchenhaus', style: 'winter', seasonal: true, small: true, price: 450, w: 1, d: 1, description: 'Mit Zuckerguss-Schnee und Gummibärchen-Fenstern. Zu schön zum Anknabbern. Fast.' },
  { id: 'nussknacker', name: 'Nussknacker', style: 'winter', seasonal: true, small: true, price: 380, w: 1, d: 1, description: 'Ein strammer Holzsoldat mit rotem Rock und sehr ernstem Blick.' },
  { id: 'flockenteppich', name: 'Schneeflocken-Teppich', style: 'winter', seasonal: true, rug: true, price: 900, w: 2, d: 2, description: 'Weich, eisblau und mit großen weißen Schneeflocken. Kalte Füße? Nicht hier.' },
  { id: 'lichtervorhang', name: 'Lichtervorhang', style: 'winter', seasonal: true, wall: true, light: true, price: 700, w: 2, d: 1, description: 'Viele kleine warme Lichter, die wie Eiszapfen von der Wand hängen.' },
  { id: 'weihnachtsstrumpf', name: 'Weihnachtsstrumpf', style: 'winter', seasonal: true, wall: true, price: 300, w: 1, d: 1, description: 'Ein dicker roter Strumpf mit weißem Rand. Wer weiß, was morgen drinsteckt …' },
  { id: 'schlitten', name: 'Holzschlitten', style: 'winter', seasonal: true, outdoor: true, price: 1200, w: 2, d: 1, description: 'Ein alter Holzschlitten mit roten Kufen. Mit Winston drauf ist er perfekt.' },
  { id: 'schneemann', name: 'Schneemann', style: 'winter', outdoor: true, crafted: true, price: 120, w: 1, d: 1, description: 'Mit Karottennase, Kohleknöpfen und Mütze. Wenn es taut, bleiben nur Mütze und Nase – im nächsten Winter wird er wieder gebaut!' },
  { id: 'schneekugel-wir', name: 'Schneekugel mit uns', style: 'winter', gift: true, small: true, price: 400, w: 1, d: 1, description: 'Von Oli, aus dem 24. Türchen: Lina, Oli und Winston vor einem kleinen Haus. Schütteln – und es schneit Herzchen.' },
  // Wohnzimmer & Küche (M7h)
  { id: 'fernseher', name: 'Fernseher', style: 'basis', price: 2500, w: 2, d: 1, description: 'Ein Fernseher auf einem Lowboard. Für Datingshows, Dokus, True Crime – und die Kochshow.' },
  { id: 'sofa', name: 'Sofa', style: 'basis', sit: 'sitzen', price: 1800, w: 2, d: 1, description: 'Ein kuscheliges Sofa für zwei. Und einen Dackel.', variants: { rosa: '#f4a3b8', grau: '#9a9aa4', mint: '#9ad8c0' } },
  { id: 'herd', name: 'Küchenzeile mit Herd', style: 'basis', price: 2200, w: 2, d: 1, surface: true, surfaceHeight: 0.62, description: 'Herd, Arbeitsfläche, Topf und Pfanne – hier kocht Lina ihre Lieblingsgerichte.' },
  // Garten (draußen, M6c)
  { id: 'zaun-holz', name: 'Astzaun', style: 'garten', crafted: true, outdoor: true, fence: true, price: 60, w: 1, d: 1, description: 'Ein Zaun aus Ästen, mit Bast zusammengebunden. Rustikal und gemütlich.' },
  { id: 'zaun-weiss', name: 'Weißer Lattenzaun', style: 'garten', outdoor: true, fence: true, price: 150, w: 1, d: 1, description: 'Ein weißer Gartenzaun wie aus dem Bilderbuch.' },
  { id: 'gartentor', name: 'Gartentor', style: 'garten', outdoor: true, fence: true, walk: true, price: 300, w: 1, d: 1, description: 'Ein kleines Tor im Zaun. Hindurchgehen erlaubt!' },
  { id: 'weg-stein', name: 'Trittsteine', style: 'garten', crafted: true, outdoor: true, rug: true, price: 40, w: 1, d: 1, description: 'Flache Steine im Gras – von Stein zu Stein hüpfen.' },
  { id: 'weg-holz', name: 'Holzbohlen-Weg', style: 'garten', outdoor: true, rug: true, price: 80, w: 1, d: 1, description: 'Ein Weg aus warmen Holzbohlen.' },
  { id: 'weg-kies', name: 'Kiesweg', style: 'garten', outdoor: true, rug: true, price: 60, w: 1, d: 1, description: 'Knirscht so schön beim Drüberlaufen.' },
  { id: 'weg-pflaster', name: 'Pflasterweg', style: 'garten', outdoor: true, rug: true, price: 120, w: 1, d: 1, description: 'Ordentliche Pflastersteine. Christin ist begeistert.' },
  { id: 'gartenbank', name: 'Gartenbank', style: 'garten', outdoor: true, sit: 'sitzen', price: 900, w: 2, d: 1, description: 'Eine Holzbank für die Abendsonne.' },
  { id: 'gartentisch', name: 'Gartentisch', style: 'garten', outdoor: true, surface: true, surfaceHeight: 0.6, price: 500, w: 1, d: 1, description: 'Ein runder Tisch für Limonade im Grünen.' },
  { id: 'gartenstuhl', name: 'Gartenstuhl', style: 'garten', outdoor: true, sit: 'sitzen', price: 300, w: 1, d: 1, description: 'Ein Stuhl aus geschwungenem Metall.', variants: { weiss: '#f7f5ec', rosa: '#f4a3b8', mint: '#9ad8c0' } },
  { id: 'sonnenschirm', name: 'Sonnenschirm', style: 'garten', outdoor: true, price: 600, w: 1, d: 1, description: 'Spendet Schatten an heißen Tagen.', variants: { rosa: '#f4a3b8', mint: '#9ad8c0', gelb: '#f7d26a' } },
  { id: 'lichterkette', name: 'Lichterkette', style: 'garten', outdoor: true, light: true, price: 800, w: 2, d: 1, description: 'Zwei Pfosten mit bunten Lämpchen dazwischen. Abends wunderschön.' },
  { id: 'gartenlaterne', name: 'Gartenlaterne', style: 'garten', outdoor: true, light: true, price: 450, w: 1, d: 1, description: 'Eine kleine Laterne auf einem Pfahl.' },
  { id: 'windlicht', name: 'Windlicht', style: 'garten', outdoor: true, small: true, light: true, price: 200, w: 1, d: 1, description: 'Ein Glas mit Kerze für den Gartentisch.' },
  { id: 'blumenkuebel', name: 'Blumenkübel', style: 'garten', outdoor: true, price: 250, w: 1, d: 1, description: 'Ein Terrakotta-Kübel voller Margeriten.' },
  { id: 'vogeltraenke', name: 'Vogeltränke', style: 'garten', outdoor: true, price: 500, w: 1, d: 1, description: 'Eine steinerne Schale für durstige Spatzen.' },
  { id: 'steinmaennchen', name: 'Steinmännchen', style: 'garten', crafted: true, outdoor: true, price: 160, w: 1, d: 1, description: 'Flache Kiesel, vorsichtig aufeinandergestapelt, ganz oben ein Glitzerstein. Thalia sagt: Wanderer zeigen damit den Weg.' },
  { id: 'vogelhaus', name: 'Vogelhäuschen', style: 'garten', crafted: true, outdoor: true, price: 240, w: 1, d: 1, description: 'Ein Häuschen auf einem Pfahl. Bald ziehen bestimmt Meisen ein.' },
  { id: 'gartenwichtel', name: 'Gartenwichtel', style: 'garten', outdoor: true, price: 350, w: 1, d: 1, description: 'Ein kleiner Wichtel mit roter Mütze. Oma findet ihn „pfui“. Lina findet ihn toll.' },
  { id: 'fruehbeet', name: 'Frühbeet', style: 'garten', outdoor: true, bed: true, greenhouse: true, price: 1800, w: 3, d: 1, description: 'Ein Holzbeet mit Glasdeckel – drei geschützte Pflanzplätze. Hier wächst auch im Winter etwas weiter, wenn draußen alles ruht.' },
  { id: 'gewaechshaus', name: 'Gewächshaus', style: 'garten', outdoor: true, bed: true, greenhouse: true, soilHeight: 0.12, price: 4200, w: 3, d: 2, description: 'Ein kleines Glashaus mit sechs Pflanzplätzen. Drinnen bleibt es auch im Winter warm genug – Tomaten im Dezember, wer hätte das gedacht? Christin ist schwer beeindruckt.' },
  { id: 'hochbeet', name: 'Hochbeet', style: 'garten', outdoor: true, bed: true, price: 1200, w: 2, d: 1, description: 'Ein Beet aus Holz auf Kniehöhe – zwei neue Pflanzplätze!' },
  { id: 'huehnerstall', name: 'Hühnerstall', style: 'garten', outdoor: true, coop: 'huhn', price: 2800, w: 2, d: 2, description: 'Ein rotes Hühnerhaus mit Rampe – drei fröhliche Hühner ziehen gleich mit ein. Jeden Tag frische Eier!' },
  { id: 'wachtelstall', name: 'Wachtelstall', style: 'garten', outdoor: true, coop: 'wachtel', price: 1900, w: 2, d: 1, description: 'Ein kleines Häuschen mit Gitter für vier Wachteln. Sie legen winzige gesprenkelte Eier.' },
  // Wand-Deko (M8f): hängt an Rück- oder Seitenwand, darunter dürfen Möbel stehen
  { id: 'bild-dr-no', name: 'Dr.-No-Porträt', style: 'basis', wall: true, price: 900, w: 1, d: 1, description: 'Ein gerahmtes Porträt von Dr. No aus „Schwerer Weg“. Strenger Blick, gütige Augen, buschige Brauen. Eine Ikone. Hängt am besten über dem Sofa.' },
  { id: 'bild-winston', name: 'Winston-Porträt', style: 'basis', wall: true, price: 600, w: 1, d: 1, description: 'Ein gerahmtes Porträt von Winston. Er guckt sehr würdevoll. Fast.' },
  { id: 'poster-grusel', name: 'Gruselfilm-Poster', style: 'basis', wall: true, price: 400, w: 1, d: 1, description: '„Die Nacht der Kürbisse“ – Linas liebster Gruselklassiker. Oli guckt lieber nicht so genau hin.' },
  { id: 'wandregal', name: 'Wandregal', style: 'basis', wall: true, price: 500, w: 2, d: 1, description: 'Ein schwebendes Brett mit Büchern, einem Pflänzchen und einer kleinen Kerze.' },
  { id: 'wanduhr', name: 'Wanduhr', style: 'basis', wall: true, price: 450, w: 1, d: 1, description: 'Eine runde Uhr. Sie geht genau richtig – Papa hat sie gestellt.', variants: { rosa: '#f4a3b8', mint: '#9ad8c0', schwarz: '#2a2a30' } },
  { id: 'rollbild', name: 'Rollbild', style: 'japanisch', wall: true, price: 700, w: 1, d: 1, description: 'Ein Kakejiku mit einem Kranich über den Bergen. Ganz still und schön.' },
  { id: 'wimpelkette', name: 'Wimpelkette', style: 'basis', wall: true, price: 250, w: 2, d: 1, description: 'Bunte Stoffwimpel an einer Schnur. Jeden Tag ein bisschen Geburtstag.' },
  { id: 'fotowand', name: 'Fotowand', style: 'basis', wall: true, light: true, price: 900, w: 2, d: 1, description: 'Fotos von allen Liebsten an einer Lichterkette mit kleinen Klammern. Leuchtet abends.' },
  { id: 'spiegel-rund', name: 'Runder Spiegel', style: 'basis', wall: true, price: 500, w: 1, d: 1, description: 'Ein runder Spiegel mit goldenem Rand. Christin prüft darin, ob alles gerade hängt.' },
  { id: 'trockenkranz', name: 'Trockenblumenkranz', style: 'basis', wall: true, price: 350, w: 1, d: 1, description: 'Ein Kranz aus Lavendel, Eukalyptus und kleinen Rosen. Duftet ein bisschen nach Sommer.' },
  // Cottagecore (M8g): Landhaus, Blümchen, Häkeln, Kräuter
  { id: 'landhaustisch', name: 'Landhaustisch', style: 'cottage', price: 1100, w: 2, d: 1, surface: true, surfaceHeight: 0.62, description: 'Ein großer Holztisch mit gedrechselten Beinen und ein paar Kerben. Hier wird gebacken!' },
  { id: 'bluemchensessel', name: 'Blümchensessel', style: 'cottage', sit: 'sitzen', price: 950, w: 1, d: 1, description: 'Ein gepolsterter Sessel mit Streublümchen. Perfekt für eine Tasse Tee und ein Buch.', variants: { rosa: '#f4b6c2', salbei: '#a9c4a0', creme: '#f3ead8' } },
  { id: 'haekelteppich', name: 'Häkelteppich', style: 'cottage', rug: true, price: 450, w: 2, d: 2, description: 'Ein runder Teppich, Masche für Masche gehäkelt. Oma hat ein paar Reihen beigesteuert.' },
  { id: 'kraeutertoepfe', name: 'Kräutertöpfchen', style: 'cottage', small: true, price: 220, w: 1, d: 1, description: 'Basilikum, Thymian und Rosmarin in drei kleinen Tontöpfen. Riecht nach Kochen.' },
  { id: 'kerzenleuchter', name: 'Kerzenleuchter', style: 'cottage', small: true, light: true, price: 300, w: 1, d: 1, description: 'Ein Messingleuchter mit drei Kerzen. Flackert abends gemütlich.' },
  { id: 'wollkorb', name: 'Wollkorb', style: 'cottage', price: 260, w: 1, d: 1, description: 'Ein Weidenkorb voller Wollknäuel. Winston findet ihn sehr verdächtig.' },
  // Retro-Oma-Chic (M8g): Ohrensessel, Nierentisch, Fransen & Kristall
  { id: 'ohrensessel', name: 'Ohrensessel', style: 'retro', sit: 'sitzen', price: 1300, w: 1, d: 1, description: 'Samtig, gemütlich und mit großen „Ohren“. Oma sagt: „So einen hatte Ludwig auch. Köstlich!“', variants: { senf: '#d9a441', rost: '#b8573a', petrol: '#3f7a7a' } },
  { id: 'nierentisch', name: 'Nierentisch', style: 'retro', surface: true, surfaceHeight: 0.42, price: 700, w: 1, d: 1, description: 'Ein Tischchen in Nierenform auf schrägen Beinchen. Echt fünfziger Jahre.' },
  { id: 'fransenlampe', name: 'Fransenlampe', style: 'retro', light: true, price: 650, w: 1, d: 1, description: 'Eine Stehlampe mit Stoffschirm und langen Fransen. Leuchtet warm wie früher.' },
  { id: 'bonbonschale', name: 'Bonbonschale', style: 'retro', small: true, price: 240, w: 1, d: 1, description: 'Eine Kristallschale mit bunten Bonbons. Wie bei Oma – nur dass man hier welche nehmen darf.' },
  { id: 'perserteppich', name: 'Orientteppich', style: 'retro', rug: true, price: 1200, w: 2, d: 2, description: 'Ein dicker Teppich mit Mustern und Fransen. Christin kämmt die Fransen jeden Sonntag gerade.' },
  { id: 'gummibaum', name: 'Gummibaum', style: 'retro', price: 380, w: 1, d: 1, description: 'Glänzende, dicke Blätter. Steht seit Jahrzehnten in jeder guten Stube.' },
  // Modern (M8g): klare Formen, Grau & Holz, Marmor
  { id: 'loungesofa', name: 'Loungesofa', style: 'modern', sit: 'sitzen', price: 2100, w: 2, d: 1, description: 'Ein niedriges, breites Sofa mit vielen Kissen. Zum Versinken.', variants: { grau: '#9a9aa4', sand: '#d9c8ad', schwarz: '#3a3a42' } },
  { id: 'marmortisch', name: 'Marmor-Couchtisch', style: 'modern', surface: true, surfaceHeight: 0.36, price: 1200, w: 1, d: 1, description: 'Rund, weiß mit grauen Adern, auf einem schwarzen Metallfuß.' },
  { id: 'bogenlampe', name: 'Bogenlampe', style: 'modern', light: true, price: 900, w: 1, d: 1, description: 'Eine Lampe mit langem Bogen. Sie beugt sich über das Sofa, als wollte sie mitlesen.' },
  { id: 'wuerfelregal', name: 'Würfelregal', style: 'modern', surface: true, surfaceHeight: 0.92, price: 800, w: 2, d: 1, description: 'Ein Regal aus hellen Holzwürfeln mit Platz für Bücher, Körbe und Kleinkram.' },
  { id: 'sitzsack', name: 'Sitzsack', style: 'modern', sit: 'sitzen', price: 500, w: 1, d: 1, description: 'Ein dicker Sitzsack. Man plumpst hinein und steht nie wieder auf.', variants: { rosa: '#f4a3b8', grau: '#9a9aa4', senf: '#e0b04a' } },
  { id: 'keramikvase', name: 'Keramikvase', style: 'modern', small: true, price: 280, w: 1, d: 1, description: 'Eine bauchige Vase mit einem einzelnen Eukalyptuszweig. Sehr minimalistisch.' },
  // Mid-Century & Bauhaus (M8h): Teak & Nussbaum, Chrom, schräge Beine, Grundformen in Rot, Gelb, Blau
  { id: 'lederloungesessel', name: 'Leder-Loungesessel', style: 'midcentury', sit: 'sitzen', price: 2400, w: 1, d: 1, description: 'Weiches Leder in geschwungenen Nussbaum-Schalen. Man sitzt wie in einer Umarmung.', variants: { cognac: '#a8643a', schwarz: '#2a2a30' } },
  { id: 'freischwinger', name: 'Freischwinger', style: 'midcentury', sit: 'sitzen', price: 700, w: 1, d: 1, description: 'Ein Stuhl auf einem gebogenen Chromrohr – er federt ein bisschen, wenn man sich setzt.', variants: { schwarz: '#2a2a30', cognac: '#a8643a', geflecht: '#d9c08a' } },
  { id: 'teaksideboard', name: 'Teak-Sideboard', style: 'midcentury', surface: true, surfaceHeight: 0.62, price: 1500, w: 2, d: 1, description: 'Ein langes Sideboard aus Teak mit Schiebetüren auf schrägen Beinchen.' },
  { id: 'satztische', name: 'Satztische', style: 'midcentury', surface: true, surfaceHeight: 0.46, price: 650, w: 1, d: 1, description: 'Drei Tischchen, die ineinanderpassen. Platz sparen mit Stil.' },
  { id: 'tripodlampe', name: 'Dreibein-Stehlampe', style: 'midcentury', light: true, price: 800, w: 1, d: 1, description: 'Drei schlanke Holzbeine und ein kegelförmiger Schirm. Wirft warmes Licht nach unten.' },
  { id: 'opal-leuchte', name: 'Opalglas-Tischleuchte', style: 'midcentury', small: true, light: true, price: 450, w: 1, d: 1, description: 'Eine Kugel aus milchigem Glas auf einem Chromfuß. Ganz klare Form, ganz weiches Licht.' },
  { id: 'formenteppich', name: 'Formen-Teppich', style: 'midcentury', rug: true, price: 900, w: 2, d: 2, description: 'Ein Teppich mit Kreis, Quadrat und Dreieck in Rot, Gelb und Blau.' },
  // Hellerau-Regale: Leiterregal-System im Stil der Dresdner Gartenstadt – Leitern an der Wand, Bretter dazwischen
  { id: 'hellerau-regal', name: 'Hellerau-Wandregal', style: 'midcentury', wall: true, price: 650, w: 1, d: 1, description: 'Zwei schlanke Leitern an der Wand, drei Bretter dazwischen – ein Regal aus der Gartenstadt Hellerau. Schlicht, leicht, zeitlos. Bücher und ein Pflänzchen sind schon drauf.', variants: { sand: '#e3c79a', weiss: '#f2efe9', schwarz: '#2f2f35', mint: '#a8d8c4' } },
  { id: 'hellerau-regalwand', name: 'Hellerau-Regalwand', style: 'midcentury', wall: true, price: 1500, w: 2, d: 1, description: 'Zwei Regalfelder an drei Leitern, unten ein Schränkchen mit Tür. Wächst mit den Büchern mit – und mit der Zeit auch ein bisschen mit Linas Sammelleidenschaft.', variants: { sand: '#e3c79a', weiss: '#f2efe9', schwarz: '#2f2f35', mint: '#a8d8c4' } },
  { id: 'hellerau-standregal', name: 'Hellerau-Standregal', style: 'midcentury', surface: true, surfaceHeight: 1.46, price: 1100, w: 1, d: 1, description: 'Das Hellerau-Regal zum Hinstellen: vier Bretter zwischen zwei Leiterseiten, oben ist Platz für Kleinigkeiten.', variants: { sand: '#e3c79a', weiss: '#f2efe9', schwarz: '#2f2f35', mint: '#a8d8c4' } },
  { id: 'formenbild', name: 'Formen-Bild', style: 'midcentury', wall: true, price: 700, w: 1, d: 1, description: 'Ein Bild aus Grundformen und Grundfarben. Jens sagt: „Weniger ist mehr, ma chérie.“' },
  { id: 'sonnenspiegel', name: 'Sonnenspiegel', style: 'midcentury', wall: true, price: 850, w: 1, d: 1, description: 'Ein runder Spiegel mit goldenen Strahlen rundherum – wie eine kleine Sonne an der Wand.' },
  { id: 'topfpflanze', name: 'Monstera', style: 'basis', price: 300, w: 1, d: 1, description: 'Große, grüne Blätter mit Löchern. Sehr fotogen.' },
];

export interface SurfaceDef {
  id: string;
  name: string;
  style: FurnitureStyle;
  price: number;
  kind: 'tapete' | 'boden';
  /** Zeichenmuster (siehe `gfx/interior.ts`) */
  pattern: string;
  color: string;
  accent: string;
  description: string;
}

export const WALLPAPERS: readonly SurfaceDef[] = [
  { id: 'tapete-creme', name: 'Cremeweiße Tapete', style: 'basis', price: 300, kind: 'tapete', pattern: 'uni', color: '#f7efe2', accent: '#eadfcd', description: 'Schlicht und hell. Passt zu allem.' },
  { id: 'tapete-shoji', name: 'Shoji-Wand', style: 'japanisch', price: 900, kind: 'tapete', pattern: 'shoji', color: '#fbf6ea', accent: '#a97c56', description: 'Papierwände mit Holzgitter – das Licht scheint sanft hindurch.' },
  { id: 'tapete-kirschblueten', name: 'Washi mit Kirschblüten', style: 'japanisch', price: 800, kind: 'tapete', pattern: 'sakura', color: '#fdeff2', accent: '#f4a3b8', description: 'Zartrosa Papiertapete mit Kirschblüten.' },
  { id: 'tapete-wellen', name: 'Seigaiha-Wellen', style: 'japanisch', price: 800, kind: 'tapete', pattern: 'wellen', color: '#e6eef7', accent: '#5b7fc2', description: 'Ein altes Wellenmuster, das Glück und Ruhe bringen soll.' },
  { id: 'tapete-bluemchen', name: 'Streublümchen-Tapete', style: 'cottage', price: 600, kind: 'tapete', pattern: 'bluemchen', color: '#fbf3e6', accent: '#e88aa0', description: 'Winzige Blümchen auf Creme – wie im Landhaus.' },
  { id: 'tapete-salbei', name: 'Salbeigrüne Holzvertäfelung', style: 'cottage', price: 900, kind: 'tapete', pattern: 'vertaefelung', color: '#c4d4bb', accent: '#a9bda0', description: 'Halbhohe Holzleisten in sanftem Salbeigrün.' },
  { id: 'tapete-kreise', name: 'Siebziger-Kreise', style: 'retro', price: 700, kind: 'tapete', pattern: 'kreise', color: '#f3e2c2', accent: '#d9822b', description: 'Orange und braune Kreise – Oma sagt, die hatte sie 1974 auch.' },
  { id: 'tapete-ranken', name: 'Rankentapete', style: 'retro', price: 650, kind: 'tapete', pattern: 'ranken', color: '#e9dcc0', accent: '#8a6a3a', description: 'Verschlungene Ranken in Gold und Braun. Sehr gute Stube.' },
  { id: 'tapete-anthrazit', name: 'Akzentwand Anthrazit', style: 'modern', price: 500, kind: 'tapete', pattern: 'uni', color: '#4a4a52', accent: '#5a5a64', description: 'Eine dunkle, ruhige Wand. Passt zu Linas Lieblingsfarbe Schwarz.' },
  { id: 'tapete-terrazzo', name: 'Terrazzo-Tapete', style: 'modern', price: 750, kind: 'tapete', pattern: 'terrazzo', color: '#f2efea', accent: '#d9a79a', description: 'Helle Wand mit bunten Steinsplittern. Modern, aber verspielt.' },
  { id: 'tapete-formen', name: 'Bauhaus-Formen', style: 'midcentury', price: 750, kind: 'tapete', pattern: 'bauhaus', color: '#f4efe4', accent: '#d9483b', description: 'Kreise, Quadrate und Dreiecke in Rot, Gelb und Blau auf hellem Grund.' },
  { id: 'tapete-atomic', name: 'Atomic-Tapete', style: 'midcentury', price: 700, kind: 'tapete', pattern: 'atomic', color: '#e9e2cf', accent: '#3f7a7a', description: 'Kleine Sterne und Bumerangs wie in den Fünfzigern.' },
  { id: 'tapete-kacheln', name: 'Küchenfliesen', style: 'basis', price: 600, kind: 'tapete', pattern: 'kacheln', color: '#f3f1ea', accent: '#9ad8c0', description: 'Weiße Fliesen mit einer mintgrünen Bordüre. Spritzwasser? Kein Problem.' },
  { id: 'tapete-glas', name: 'Glaswand', style: 'basis', price: 1200, kind: 'tapete', pattern: 'glas', color: '#d9eef2', accent: '#8fb08a', description: 'Große Glasscheiben mit weißen Sprossen – draußen grünt der Garten.' },
  { id: 'tapete-backstein', name: 'Backstein', style: 'basis', price: 700, kind: 'tapete', pattern: 'backstein', color: '#c9775a', accent: '#e9d8c4', description: 'Rote Backsteine mit hellen Fugen. Gemütlich wie ein alter Gewölbekeller.' },
  { id: 'tapete-flocken', name: 'Schneeflocken-Tapete', style: 'winter', price: 600, kind: 'tapete', pattern: 'flocken', color: '#dfeef6', accent: '#ffffff', description: 'Eisblau mit weißen Schneeflocken – gemütlich-kalt, aber nur an der Wand.' },
  { id: 'tapete-rosa', name: 'Pastellrosa Tapete', style: 'basis', price: 400, kind: 'tapete', pattern: 'streifen', color: '#fbe0e8', accent: '#f6cfdb', description: 'Ganz zarte Streifen in Rosa.' },
];

export const FLOORS: readonly SurfaceDef[] = [
  { id: 'boden-dielen', name: 'Helle Holzdielen', style: 'basis', price: 300, kind: 'boden', pattern: 'dielen', color: '#e6c59c', accent: '#cfa175', description: 'Warmer, heller Holzboden.' },
  { id: 'boden-tatami', name: 'Tatami-Boden', style: 'japanisch', price: 1000, kind: 'boden', pattern: 'tatami', color: '#d9d49a', accent: '#5a5a3a', description: 'Der ganze Raum mit Tatami-Matten ausgelegt.' },
  { id: 'boden-dunkel', name: 'Dunkles Holz', style: 'japanisch', price: 700, kind: 'boden', pattern: 'dielen', color: '#8a5a3a', accent: '#6e4630', description: 'Dunkles, poliertes Holz wie in einem alten Teehaus.' },
  { id: 'boden-landhaus', name: 'Landhausdielen', style: 'cottage', price: 600, kind: 'boden', pattern: 'dielen', color: '#efe3cf', accent: '#c9b28f', description: 'Breite, hell gekalkte Dielen. Knarzen ein bisschen – das gehört so.' },
  { id: 'boden-fischgraet', name: 'Fischgrät-Parkett', style: 'retro', price: 900, kind: 'boden', pattern: 'fischgraet', color: '#c98f5a', accent: '#a5703f', description: 'Kleine Holzstäbe im Zickzack. Glänzt nach dem Bohnern.' },
  { id: 'boden-beton', name: 'Betonoptik', style: 'modern', price: 800, kind: 'boden', pattern: 'beton', color: '#c9c7c4', accent: '#b3b0ad', description: 'Glatter, hellgrauer Boden in Betonoptik. Schön kühl im Sommer.' },
  { id: 'boden-nussbaum', name: 'Nussbaum-Parkett', style: 'midcentury', price: 900, kind: 'boden', pattern: 'dielen', color: '#7a5236', accent: '#5e3e28', description: 'Dunkles, warmes Nussbaumholz.' },
  { id: 'boden-schach', name: 'Schachbrett-Fliesen', style: 'midcentury', price: 800, kind: 'boden', pattern: 'schach', color: '#f2efe8', accent: '#2a2a30', description: 'Schwarze und weiße Fliesen im Wechsel. Klar, grafisch, zeitlos.' },
  { id: 'boden-terrakotta', name: 'Terrakotta-Fliesen', style: 'basis', price: 700, kind: 'boden', pattern: 'terrakotta', color: '#d9895f', accent: '#b8693f', description: 'Warme, rötliche Tonfliesen. Fühlen sich nach Urlaub an.' },
  { id: 'boden-teppich', name: 'Rosa Teppichboden', style: 'basis', price: 500, kind: 'boden', pattern: 'teppich', color: '#f7c6d4', accent: '#f4b3c6', description: 'Flauschig und weich unter den Füßen.' },
];

// Poster (Wand) & Bildbände (Tisch) zu Linas Lieblingsthemen aus `posters.ts`
for (const p of POSTERS) (FURNITURE as FurnitureDef[]).push({ id: p.id, name: p.name, style: 'lieblinge', wall: p.kind === 'poster' || undefined, small: p.kind === 'buch' || undefined, price: p.price, w: 1, d: 1, description: p.description });

// Sammeltassen (Klassik & Saison im Katalog, Städte-Tassen als Geschenke) aus `tassen.ts`; dazu das Tassenregal
for (const t of TASSEN) {
  (FURNITURE as FurnitureDef[]).push({ id: t.id, name: t.name, style: 'lieblinge', small: true, tiny: true, gift: t.kind === 'stadt' || undefined, inSeason: t.season, price: t.kind === 'stadt' ? 400 : t.price, w: 1, d: 1, description: t.description });
}
// Tassenbord: hängt an der Wand, schmal, Tassen stehen dicht an dicht (vier je Feld). Das lange Standregal von früher
// bleibt für alle, die es schon haben, ist aber nicht mehr im Katalog.
(FURNITURE as FurnitureDef[]).push({ id: 'tassenbord', name: 'Tassenbord', style: 'lieblinge', wall: true, surface: true, surfaceHeight: 1.15, slots: 4, price: 700, w: 2, d: 1, description: 'Ein schmales Wandbord aus hellem Holz, auf dem Linas Sammeltassen dicht an dicht stehen – bis zu acht Stück. Darunter darf ruhig noch ein Möbelstück stehen.' });
(FURNITURE as FurnitureDef[]).push({ id: 'tassenregal', name: 'Langes Tassenregal', style: 'lieblinge', retired: true, surface: true, surfaceHeight: 0.95, price: 900, w: 4, d: 1, description: 'Das erste Tassenregal: lang, aus hellem Holz, mit vier Brettern. Das schmale Tassenbord an der Wand ist platzsparender.' });

// Blumendeko (Beet/Samen Phase 4): leere Glasvase im Katalog, Vasen mit Strauß und Wandkränze werden gebunden
(FURNITURE as FurnitureDef[]).push({ id: EMPTY_VASE, name: 'Glasvase', style: 'basis', small: true, price: 180, w: 1, d: 1, description: 'Eine schlichte Glasvase mit etwas Wasser. Es fehlen nur noch Blumen – einen Strauß bindest du an Opas Werkbank.' });
for (const b of BOUQUETS) {
  (FURNITURE as FurnitureDef[]).push({ id: vaseId(b.id), name: `Vase: ${b.name}`, style: 'handgemacht', crafted: true, small: true, price: (b.price + 40) * 4, w: 1, d: 1, description: `${b.name} in der Glasvase. Frische Blumen machen jeden Tisch gemütlich.` });
}
for (const w of WREATHS) (FURNITURE as FurnitureDef[]).push({ id: w.id, name: w.name, style: 'handgemacht', crafted: true, wall: true, price: w.price, w: 1, d: 1, description: w.description });

// Kunstwerke (Bild auf Staffelei) aus `art.ts` – nur über Jens erhältlich
for (const a of ARTWORKS) (FURNITURE as FurnitureDef[]).push({ id: a.id, name: a.name, style: 'kunst', gift: true, price: a.price, w: 1, d: 1, description: `${a.description} – ${a.artist}` });

export const STYLE_LABELS: Record<FurnitureStyle, string> = { japanisch: 'Japanisch', basis: 'Basis', cottage: 'Cottagecore', retro: 'Retro-Oma-Chic', modern: 'Modern', midcentury: 'Mid-Century & Bauhaus', handgemacht: 'Handgemacht', garten: 'Garten', kunst: 'Kunst', winter: 'Winterzauber', lieblinge: 'Lieblingsthemen' };

/** Möbel-Gegenstand (mit Variante) → Basis + Farbe */
export interface FurnitureItem {
  itemId: string;
  def: FurnitureDef;
  variant: string | null;
  color: string | null;
}

export const FURNITURE_ITEMS: readonly FurnitureItem[] = FURNITURE.flatMap((def): FurnitureItem[] =>
  def.variants
    ? Object.entries(def.variants).map(([v, color]) => ({ itemId: `${def.id}-${v}`, def, variant: v, color }))
    : [{ itemId: def.id, def, variant: null, color: null }],
);

export const FURNITURE_BY_ITEM: Readonly<Record<string, FurnitureItem>> = Object.fromEntries(FURNITURE_ITEMS.map((f) => [f.itemId, f]));
export const SURFACE_BY_ID: Readonly<Record<string, SurfaceDef>> = Object.fromEntries([...WALLPAPERS, ...FLOORS].map((s) => [s.id, s]));

export const VARIANT_LABELS: Record<string, string> = { grau: 'Grau', weiss: 'Weiß', mint: 'Mint', gelb: 'Gelb', rosa: 'Rosa', indigo: 'Indigo', creme: 'Creme', rot: 'Rot', blau: 'Blau', gruen: 'Grün', senf: 'Senfgelb', salbei: 'Salbei', rost: 'Rost', petrol: 'Petrol', sand: 'Sand', schwarz: 'Schwarz', cognac: 'Cognac', geflecht: 'Wiener Geflecht' };


/** Raum-Infos für die Raumlogik (`core/room.ts`) */
export function furnitureInfo(itemId: string) {
  const f = FURNITURE_BY_ITEM[itemId];
  return f
    ? { w: f.def.w, d: f.def.d, rug: f.def.rug, small: f.def.small, surface: f.def.surface, walk: f.def.walk, wall: f.def.wall, height: FURNITURE_HEIGHTS[f.def.id], tiny: f.def.tiny, slots: f.def.slots }
    : undefined;
}
