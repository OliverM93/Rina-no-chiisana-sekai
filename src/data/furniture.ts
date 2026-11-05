/**
 * Möbel, Tapeten und Böden für Linas Haus.
 *
 * Neue Möbel: hier eintragen und in `world3d/models/furniture.ts` ein Modell
 * (`model`) bauen. Möbel mit Farbvarianten werden automatisch zu mehreren
 * Gegenständen (`zabuton-rosa`, `zabuton-indigo` …).
 */
import { ARTWORKS } from './art';

export type FurnitureStyle = 'japanisch' | 'basis' | 'handgemacht' | 'garten' | 'kunst';

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
  /** Teppich: man kann darüber laufen, Möbel darauf stellen */
  rug?: boolean;
  /** Man kann sich hinsetzen (Kissen) bzw. hinlegen (Futon) */
  sit?: 'sitzen' | 'liegen';
  /** Leuchtet abends */
  light?: boolean;
  description: string;
  /** Nur an der Werkbank zu bauen (nicht im Katalog) */
  crafted?: boolean;
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
  /** Stall mit Tieren (Hühner/Wachteln), legt täglich Eier */
  coop?: 'huhn' | 'wachtel';
  /** Hängt an der Wand (Rückwand oder Seitenwand) – darunter darf etwas stehen */
  wall?: boolean;
  /** Farbvarianten (Name → Farbe); ohne = eine Variante */
  variants?: Record<string, string>;
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
  // Fest-Geschenke
  { id: 'sparschwein', name: 'Sparschwein mit Mütze', style: 'basis', gift: true, small: true, price: 400, w: 1, d: 1, description: 'Von Papa Olaf. Rosa, rund und mit Weihnachtsmütze. „Kleinvieh macht auch Mist!“' },
  { id: 'weihnachtsstern', name: 'Weihnachtsstern', style: 'basis', gift: true, price: 400, w: 1, d: 1, description: 'Von Christin – rote Blätter im goldenen Topf. Bitte gerade hinstellen.' },
  { id: 'kuscheldecke', name: 'Kuscheldecke', style: 'basis', gift: true, rug: true, price: 600, w: 2, d: 1, description: 'Von Oli – flauschig, kariert und groß genug für zwei. Und einen Dackel.' },
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
  { id: 'vogelhaus', name: 'Vogelhäuschen', style: 'garten', crafted: true, outdoor: true, price: 240, w: 1, d: 1, description: 'Ein Häuschen auf einem Pfahl. Bald ziehen bestimmt Meisen ein.' },
  { id: 'gartenwichtel', name: 'Gartenwichtel', style: 'garten', outdoor: true, price: 350, w: 1, d: 1, description: 'Ein kleiner Wichtel mit roter Mütze. Oma findet ihn „pfui“. Lina findet ihn toll.' },
  { id: 'hochbeet', name: 'Hochbeet', style: 'garten', outdoor: true, bed: true, price: 1200, w: 2, d: 1, description: 'Ein Beet aus Holz auf Kniehöhe – zwei neue Pflanzplätze!' },
  { id: 'huehnerstall', name: 'Hühnerstall', style: 'garten', outdoor: true, coop: 'huhn', price: 2800, w: 2, d: 2, description: 'Ein rotes Hühnerhaus mit Rampe – drei fröhliche Hühner ziehen gleich mit ein. Jeden Tag frische Eier!' },
  { id: 'wachtelstall', name: 'Wachtelstall', style: 'garten', outdoor: true, coop: 'wachtel', price: 1900, w: 2, d: 1, description: 'Ein kleines Häuschen mit Gitter für vier Wachteln. Sie legen winzige gesprenkelte Eier.' },
  // Wand-Deko (M8f): hängt an Rück- oder Seitenwand, darunter dürfen Möbel stehen
  { id: 'bild-winston', name: 'Winston-Porträt', style: 'basis', wall: true, price: 600, w: 1, d: 1, description: 'Ein gerahmtes Porträt von Winston. Er guckt sehr würdevoll. Fast.' },
  { id: 'poster-grusel', name: 'Gruselfilm-Poster', style: 'basis', wall: true, price: 400, w: 1, d: 1, description: '„Die Nacht der Kürbisse“ – Linas liebster Gruselklassiker. Oli guckt lieber nicht so genau hin.' },
  { id: 'wandregal', name: 'Wandregal', style: 'basis', wall: true, price: 500, w: 2, d: 1, description: 'Ein schwebendes Brett mit Büchern, einem Pflänzchen und einer kleinen Kerze.' },
  { id: 'wanduhr', name: 'Wanduhr', style: 'basis', wall: true, price: 450, w: 1, d: 1, description: 'Eine runde Uhr. Sie geht genau richtig – Papa hat sie gestellt.', variants: { rosa: '#f4a3b8', mint: '#9ad8c0', schwarz: '#2a2a30' } },
  { id: 'rollbild', name: 'Rollbild', style: 'japanisch', wall: true, price: 700, w: 1, d: 1, description: 'Ein Kakejiku mit einem Kranich über den Bergen. Ganz still und schön.' },
  { id: 'wimpelkette', name: 'Wimpelkette', style: 'basis', wall: true, price: 250, w: 2, d: 1, description: 'Bunte Stoffwimpel an einer Schnur. Jeden Tag ein bisschen Geburtstag.' },
  { id: 'fotowand', name: 'Fotowand', style: 'basis', wall: true, light: true, price: 900, w: 2, d: 1, description: 'Fotos von allen Liebsten an einer Lichterkette mit kleinen Klammern. Leuchtet abends.' },
  { id: 'spiegel-rund', name: 'Runder Spiegel', style: 'basis', wall: true, price: 500, w: 1, d: 1, description: 'Ein runder Spiegel mit goldenem Rand. Christin prüft darin, ob alles gerade hängt.' },
  { id: 'trockenkranz', name: 'Trockenblumenkranz', style: 'basis', wall: true, price: 350, w: 1, d: 1, description: 'Ein Kranz aus Lavendel, Eukalyptus und kleinen Rosen. Duftet ein bisschen nach Sommer.' },
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
  { id: 'tapete-rosa', name: 'Pastellrosa Tapete', style: 'basis', price: 400, kind: 'tapete', pattern: 'streifen', color: '#fbe0e8', accent: '#f6cfdb', description: 'Ganz zarte Streifen in Rosa.' },
];

export const FLOORS: readonly SurfaceDef[] = [
  { id: 'boden-dielen', name: 'Helle Holzdielen', style: 'basis', price: 300, kind: 'boden', pattern: 'dielen', color: '#e6c59c', accent: '#cfa175', description: 'Warmer, heller Holzboden.' },
  { id: 'boden-tatami', name: 'Tatami-Boden', style: 'japanisch', price: 1000, kind: 'boden', pattern: 'tatami', color: '#d9d49a', accent: '#5a5a3a', description: 'Der ganze Raum mit Tatami-Matten ausgelegt.' },
  { id: 'boden-dunkel', name: 'Dunkles Holz', style: 'japanisch', price: 700, kind: 'boden', pattern: 'dielen', color: '#8a5a3a', accent: '#6e4630', description: 'Dunkles, poliertes Holz wie in einem alten Teehaus.' },
  { id: 'boden-teppich', name: 'Rosa Teppichboden', style: 'basis', price: 500, kind: 'boden', pattern: 'teppich', color: '#f7c6d4', accent: '#f4b3c6', description: 'Flauschig und weich unter den Füßen.' },
];

// Kunstwerke (Bild auf Staffelei) aus `art.ts` – nur über Jens erhältlich
for (const a of ARTWORKS) (FURNITURE as FurnitureDef[]).push({ id: a.id, name: a.name, style: 'kunst', gift: true, price: a.price, w: 1, d: 1, description: `${a.description} – ${a.artist}` });

export const STYLE_LABELS: Record<FurnitureStyle, string> = { japanisch: 'Japanisch', basis: 'Basis', handgemacht: 'Handgemacht', garten: 'Garten', kunst: 'Kunst' };

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

export const VARIANT_LABELS: Record<string, string> = { grau: 'Grau', weiss: 'Weiß', mint: 'Mint', gelb: 'Gelb', rosa: 'Rosa', indigo: 'Indigo', creme: 'Creme', rot: 'Rot', blau: 'Blau', gruen: 'Grün', senf: 'Senfgelb', schwarz: 'Schwarz' };


/** Raum-Infos für die Raumlogik (`core/room.ts`) */
export function furnitureInfo(itemId: string) {
  const f = FURNITURE_BY_ITEM[itemId];
  return f ? { w: f.def.w, d: f.def.d, rug: f.def.rug, small: f.def.small, surface: f.def.surface, walk: f.def.walk, wall: f.def.wall } : undefined;
}
