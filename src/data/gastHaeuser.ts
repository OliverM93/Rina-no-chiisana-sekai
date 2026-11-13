/**
 * Häuser der Bewohner von innen: Lina darf zu Besuch kommen (nur ansehen, nicht umräumen) und kommentiert die Einrichtung.
 * Jedes Haus ist ein Zimmer aus vorhandenen Möbeln; die Zeilen sind Linas Gedanken. Keine erfundenen Familiengeschichten –
 * nur Eigenheiten, die die Figuren ohnehin haben.
 *
 * Neues Haus: hier eintragen, in `World3D.knockAtHome` freischalten.
 */
import type { PlacedItem, Room, RoomLayout } from '../core/room';
import { FURNITURE, variantItemId } from './furniture';

export interface GuestItem {
  id: string;
  x: number;
  y: number;
  rot?: 0 | 1 | 2 | 3;
  /** Farbvariante (bei Möbeln mit Farben); ohne = erste Farbe */
  variant?: string;
  /** steht auf diesem anderen Möbel (ID in dieser Liste) */
  on?: string;
}

export interface GuestHouse {
  /** Bewohner, dem das Haus gehört (Anzeige & Türtext) */
  npc: string;
  /** Titel beim Betreten */
  name: string;
  wallpaper: string;
  floor: string;
  items: readonly GuestItem[];
  /** Beim ersten Betreten: Linas Gedanken */
  intro: readonly string[];
  /** Linas Kommentar je Möbel (Gegenstands-ID); fehlt einer, gilt die Möbelbeschreibung */
  comments: Readonly<Record<string, readonly string[]>>;
}

const DOOR: RoomLayout['exits'][number] = { cells: [[3, 5]], to: 'draussen', dir: 'down', kind: 'haustuer' };

export const GUEST_LAYOUT: RoomLayout = { id: 'haupt', name: 'Zu Besuch', w: 8, h: 6, exits: [DOOR] };

/** Größere Häuser (z. B. Chez Jens) haben einen eigenen Grundriss: Tür unten in der Mitte */
function sizedLayout(w: number, h: number): RoomLayout {
  return { id: 'haupt', name: 'Zu Besuch', w, h, exits: [{ ...DOOR, cells: [[Math.floor(w / 2) - 1, h - 1]] }] };
}
const LAYOUT_BY_HOUSE: Readonly<Record<string, RoomLayout>> = { 'bistro-jens': sizedLayout(10, 7) };

/** Grundriss eines Gasthauses (Standard 8 × 6) */
export function guestLayout(houseId: string): RoomLayout {
  return LAYOUT_BY_HOUSE[houseId] ?? GUEST_LAYOUT;
}

export const GUEST_HOUSES: Readonly<Record<string, GuestHouse>> = {
  'haus-gisela': {
    npc: 'gisela',
    name: 'Omas Wohnzimmer',
    wallpaper: 'tapete-ranken',
    floor: 'boden-fischgraet',
    // Alles an den Wänden, in der Mitte Teppich & Tischchen: ein richtiges Wohnzimmer
    items: [
      { id: 'regal', x: 1, y: 0 },
      { id: 'bonbonschale', x: 2, y: 0, on: 'regal' },
      { id: 'fransenlampe', x: 0, y: 0 },
      { id: 'wanduhr', x: 4, y: 0, rot: 0 },
      { id: 'trockenkranz', x: 6, y: 0, rot: 0 },
      { id: 'gummibaum', x: 7, y: 0 },
      { id: 'perserteppich', x: 4, y: 2 },
      { id: 'sofa', x: 7, y: 2, rot: 1, variant: 'rosa' },
      { id: 'nierentisch', x: 5, y: 3 },
      { id: 'kerzenleuchter', x: 5, y: 3, on: 'nierentisch' },
      { id: 'ohrensessel', x: 3, y: 3, rot: 3, variant: 'senf' },
      { id: 'bluemchensessel', x: 5, y: 4, rot: 2, variant: 'rosa' },
      { id: 'wollkorb', x: 2, y: 3 },
    ],
    intro: ['Ah, bei Oma. Es riecht nach Keksen und nach Kaffee, wie immer.', 'Alles steht an seinem Platz. Wehe, jemand verschiebt etwas.'],
    comments: {
      regal: ['Ein Regal voller Kochbücher und Strickmuster. „Köstlich“ steht überall am Rand. Und ein paar Mal „pfui“.'],
      bonbonschale: ['Bonbons! Ich nehm nur eins. … Oma hat es trotzdem gesehen. Ich spür es.'],
      fransenlampe: ['Die Fransenlampe schimmert so warm. Alles hier hat einen goldenen Schein.'],
      wanduhr: ['Die Uhr geht genau richtig. Oma sagt, alle anderen Uhren irren sich.'],
      trockenkranz: ['Ein Trockenkranz mit Blümchen. Oma sagt: „Der hält länger als jede Mode.“'],
      gummibaum: ['Der Gummibaum glänzt, als würde Oma ihn jeden Tag polieren. Wahrscheinlich tut sie das.'],
      ohrensessel: ['Omas Ohrensessel. Man versinkt darin – und sie hat trotzdem immer das letzte Wort.'],
      wollkorb: ['Ein Korb voller Wolle. Oma strickt schneller, als ich gucken kann.'],
      sofa: ['Oma hat ein Sofa, auf dem man nur sitzt, wenn man eingeladen ist. Ich bin eingeladen, glaub ich.'],
      perserteppich: ['Omas Teppich. Mit Fransen, die Christin jedes Mal kämmen möchte. Oma lässt sie nicht.'],
      nierentisch: ['Ein Nierentisch, genau wie in den Fünfzigern. Oma sagt: „Das ist keine Mode, das ist Haltung.“'],
      kerzenleuchter: ['Ein Kerzenleuchter auf dem Tischchen. Abends brennt hier immer eine Kerze – wegen der Gemütlichkeit.'],
      bluemchensessel: ['Der Blümchensessel für Besuch. Wer hier sitzt, bekommt garantiert noch ein Stück Kuchen.'],
    },
  },
  'haus-olaf': {
    npc: 'olaf',
    name: 'Olafs & Christins Haus',
    wallpaper: 'tapete-creme',
    floor: 'boden-dielen',
    // Wie Christin es mag: ordentlich an den Wänden, gerade Reihen; Fernseher gegenüber vom Sofa
    items: [
      { id: 'topfpflanze', x: 0, y: 0 },
      { id: 'topfpflanze', x: 2, y: 0 },
      { id: 'topfpflanze', x: 4, y: 0 },
      { id: 'regal', x: 6, y: 0, rot: 0 },
      { id: 'modellflugzeug', x: 6, y: 0, on: 'regal' },
      { id: 'sofa', x: 0, y: 2, rot: 3, variant: 'grau' },
      { id: 'stehlampe', x: 0, y: 1 },
      { id: 'wanduhr', x: 3, y: 0, rot: 0 },
      { id: 'haekelteppich', x: 2, y: 2 },
      { id: 'satztische', x: 3, y: 3 },
      { id: 'fernseher', x: 7, y: 2, rot: 1 },
      { id: 'kraeutertoepfe', x: 3, y: 3, on: 'satztische' },
      { id: 'witzkalender', x: 7, y: 4, rot: 1 },
    ],
    intro: ['Bei Papa und Christin ist alles exakt ausgerichtet. Selbst die Pflanzen stehen in einer Linie.', 'Ich trau mich kaum, etwas anzufassen. Aber ich guck mal.'],
    comments: {
      topfpflanze: ['Drei Monstera in einer Reihe, alle gleich weit vom Fenster. Ich hab nachgeschaut: Sie sind beschriftet.'],
      regal: ['Ordner, Ordner, Ordner – alle mit Etikett. Und ganz oben ein Flugzeugmodell, das Papa selbst gebaut hat.'],
      modellflugzeug: ['Papas Flugzeugmodell. Er kennt jede Schraube. Und er sagt es mir gern, wenn ich frag.'],
      sofa: ['Ein schönes, ordentliches Sofa. Die Kissen sind so gefaltet, als hätte es nie jemand benutzt. Das war Christin.'],
      stehlampe: ['Eine Stehlampe neben dem Sofa. Zum Lesen. Und für Christins Inspektion, ob irgendwo Staub liegt.'],
      wanduhr: ['Eine Uhr, die auf die Sekunde stimmt. Natürlich.'],
      haekelteppich: ['Ein runder Häkelteppich. Christin saugt ihn so, dass die Fransen alle in dieselbe Richtung liegen.'],
      satztische: ['Satztische, in der Größe gestaffelt. Papa hat sie vermessen. Christin hat sie ausgerichtet.'],
      fernseher: ['Der Fernseher. Abends sitzen die beiden hier und schauen Nachrichten. Papa kommentiert die Steuersätze.'],
      kraeutertoepfe: ['Kräutertöpfe, alle beschriftet: Basilikum, Petersilie, Schnittlauch. Natürlich in alphabetischer Reihenfolge.'],
      witzkalender: ['Papas Witze-Kalender hängt ganz gerade. Der Witz von heute ist trotzdem nicht besser geworden.'],
    },
  },
  'haus-thalia': {
    npc: 'thalia',
    name: 'Thalias Häuschen',
    wallpaper: 'tapete-uni-sand',
    floor: 'boden-dielen-esche',
    // Schlicht und Mid-Century: wenige gute Stücke, viel Luft
    items: [
      { id: 'teaksideboard', x: 3, y: 0 },
      { id: 'plattenspieler', x: 3, y: 0, on: 'teaksideboard' },
      { id: 'keramikvase', x: 4, y: 0, on: 'teaksideboard' },
      { id: 'sonnenspiegel', x: 3, y: 0, rot: 0 },
      { id: 'priesterkalender', x: 7, y: 3, rot: 1 },
      { id: 'globus', x: 0, y: 0 },
      { id: 'loungesofa', x: 0, y: 2, rot: 3, variant: 'sand' },
      { id: 'bogenlampe', x: 0, y: 1 },
      { id: 'formenteppich', x: 2, y: 2 },
      { id: 'marmortisch', x: 2, y: 3 },
      { id: 'lederloungesessel', x: 3, y: 3, rot: 1, variant: 'cognac' },
      { id: 'freischwinger', x: 2, y: 4, rot: 2, variant: 'schwarz' },
      { id: 'hantelbank', x: 5, y: 1 },
      { id: 'spiegel-rund', x: 4, y: 0, rot: 0 },
      { id: 'discokugel', x: 6, y: 3 },
      { id: 'barhocker', x: 5, y: 4, variant: 'schwarz' },
      { id: 'topfpflanze', x: 7, y: 4 },
    ],
    intro: ['Thalias Häuschen! Wenig Möbel, aber alle richtig schön – so klar und warm wie ein Katalog von früher.', 'Nur die Ecke mit Hantelbank und Discokugel verrät, wer hier wohnt. Und ein Kalender, bei dem ich zweimal hinschauen muss.'],
    comments: {
      teaksideboard: ['Ein Teak-Sideboard, schlank und geschwungen. Thalia sagt: „Gutes Design altert nicht. Anders als meine Knie nach dem Beintag.“'],
      plattenspieler: ['Ein Plattenspieler auf dem Sideboard. Daneben ein Stapel Platten – die Hälfte davon Partymusik, die andere Hälfte „Aufwärmen fürs Studio“.'],
      keramikvase: ['Eine schlichte Keramikvase. Thalia stellt immer genau einen Zweig hinein – „mehr braucht ein guter Raum nicht“.'],
      sonnenspiegel: ['Ein Sonnenspiegel. Er fängt abends das Licht und wirft es als kleine Sonne an die Wand.'],
      priesterkalender: ['„Padre del Mese“. Zwölf sehr gutaussehende Padres in Soutane. Thalia sagt: „Rein kulturell. Wegen der Architektur.“ Ich sage: Sie blättert immer schon vor.'],
      globus: ['Ein Globus mit Stecknadeln. Jede Stecknadel ist ein Ort, an den sie noch will – Städte mit guten Clubs, Festivals, Laufstrecken. Es sind sehr viele.'],
      loungesofa: ['Ein niedriges Sofa in Sand. Hier fällt Thalia nach dem Training um. Und nach der Party. Meist ohne Schuhe auszuziehen.'],
      bogenlampe: ['Eine Bogenlampe, die sich übers Sofa wölbt. Perfekt zum Lesen. Oder zum Planen des Outfits für Samstag.'],
      formenteppich: ['Ein Teppich wie ein Bauhaus-Gemälde. Thalia sagt: „Geometrie unter den Füßen.“'],
      marmortisch: ['Ein kleiner Marmortisch. Darauf liegt immer genau ein Buch und eine Tasse. Ordnung ohne Christin.'],
      lederloungesessel: ['Ein Ledersessel in Cognac. Hier sitzt Thalia, wenn sie Reisepläne schmiedet.'],
      freischwinger: ['Ein Freischwinger aus Chromrohr. Er federt ein bisschen – wie Thalia, wenn sie ein neues Ziel hat.'],
      hantelbank: ['Eine Hantelbank in Thalias Wohnzimmer! Die Gewichte tragen Namen: Gustav, Ingrid und der kleine Dieter. Ich wusste, dass wir uns verstehen.'],
      'spiegel-rund': ['Ein runder Spiegel an der Wand – gleich neben der Hantelbank. Thalia sagt: „Zur Kontrolle der Haltung.“ Und fürs Selfie vor dem Club.'],
      discokugel: ['Die Discokugel! Abends wirft sie bunte Lichtpunkte durchs Zimmer. Thalia sagt: „Hauspartys beginnen immer hier.“'],
      barhocker: ['Ein schwarzer Barhocker. Hier sitzt Thalia mit Smoothie und plant die nächste Party. Oder den nächsten Beintag. Oder beides.'],
      topfpflanze: ['Eine einzige Pflanze, die sich ganz alleine behauptet. Das passt zu Thalia.'],
    },
  },
  'praxis-lars': {
    npc: 'lars',
    name: 'Praxis Dr. Lars',
    wallpaper: 'tapete-kacheln',
    floor: 'boden-schach',
    // Wartebereich vorne links, Empfang & Regale an der Rückwand, Sprechzimmer rechts:
    // Schreibtisch mit PC, Lars dahinter, zwei Stühle für Patienten gegenüber
    items: [
      { id: 'topfpflanze', x: 0, y: 0 },
      { id: 'teaksideboard', x: 1, y: 0 },
      { id: 'erste-hilfe', x: 1, y: 0, on: 'teaksideboard' },
      { id: 'regal', x: 4, y: 0 },
      { id: 'skelett-kalle', x: 7, y: 0 },
      { id: 'sofa', x: 0, y: 3, rot: 3, variant: 'grau' },
      { id: 'topfpflanze', x: 0, y: 5 },
      { id: 'wanduhr', x: 0, y: 2, rot: 3 },
      { id: 'schreibtisch-pc', x: 4, y: 2, rot: 2 },
      { id: 'lederloungesessel', x: 4, y: 1, rot: 0, variant: 'schwarz' },
      { id: 'freischwinger', x: 4, y: 3, rot: 2, variant: 'schwarz' },
      { id: 'freischwinger', x: 5, y: 3, rot: 2, variant: 'schwarz' },
      { id: 'formenteppich', x: 4, y: 3 },
      { id: 'spruchtafel-lars', x: 7, y: 3, rot: 1 },
    ],
    intro: ['Die Praxis von innen. Hell, aufgeräumt, und es riecht nach Kamillentee.', 'Wartezimmer links, Schreibtisch mit Computer rechts – und zwei Stühle genau gegenüber, wie sich das für ein ordentliches Patientengespräch gehört.'],
    comments: {
      topfpflanze: ['Eine Monstera im Wartezimmer. Lars sagt, Pflanzen senken den Blutdruck. Wahrscheinlich hat er nachgemessen.'],
      teaksideboard: ['Der Empfangstresen. Hier liegt der Terminplan. Und, ganz unten, Kekse für Kinder. Und für Oma.'],
      'erste-hilfe': ['Ein Erste-Hilfe-Schränkchen mit Herzchen-Pflastern. Ich hab das gleiche zu Hause – von Lars natürlich.'],
      regal: ['Fachbücher, Kräuter in Gläsern und ein Teekessel. Lars sagt, Tee gehört dazu. Oma sagt, Tee ersetzt den Arzt.'],
      'skelett-kalle': ['Knochen-Kalle! Das Lern-Skelett mit Fliege. Er guckt streng, aber er hat nie was gesagt.'],
      sofa: ['Das Wartezimmer-Sofa. Hier hat Lars schon viele Patienten mit seinen Sprüchen aufgemuntert. Und manche vom Warten abgelenkt.'],
      wanduhr: ['Die Praxisuhr. Lars steht pünktlich auf. Er hat mir nie verraten, wie.'],
      'schreibtisch-pc': ['Lars\' Schreibtisch mit Computer. Hier tippt er die Befunde. Mit zwei Fingern, aber in Rekordzeit.'],
      lederloungesessel: ['Der Stuhl hinter dem Schreibtisch – Lars\' Platz. Er dreht sich, wenn er nachdenkt. Und er denkt viel.'],
      freischwinger: ['Ein Patientenstuhl, genau gegenüber vom Doktor. Er federt ein bisschen – gegen die Nervosität.'],
      formenteppich: ['Ein buntes Teppichmuster, das jedes Kind im Wartezimmer zählt. Rot, blau, gelb. Lars lächelt dann.'],
      'spruchtafel-lars': ['Lars\' Spruchtafel. „So, und nicht mit e, sonst ist es ein See.“ Er sagt das bis heute.'],
    },
  },
  'bistro-jens': {
    npc: 'jens',
    name: 'Chez Jens',
    wallpaper: 'tapete-bistro-putz',
    floor: 'boden-hexmosaik',
    // Wie ein richtiges Pariser Café: Wandbänke links und rechts, runde Tische mit Bugholzstühlen, Zinktresen hinten rechts, Kugellampen an den Wänden
    items: [
      // --- Tresen hinten rechts
      { id: 'zinktheke', x: 7, y: 0 },
      { id: 'bistrolampe', x: 7, y: 0, on: 'zinktheke' },
      { id: 'etagere', x: 8, y: 0, on: 'zinktheke' },
      { id: 'barhocker', x: 7, y: 1 },
      { id: 'barhocker', x: 8, y: 1 },
      { id: 'weinregal', x: 9, y: 0 },
      { id: 'yucca', x: 0, y: 0 },
      // --- linke Wandbank mit vier Tischen
      { id: 'bistrobank', x: 0, y: 1, rot: 3 },
      { id: 'bistrobank', x: 0, y: 4, rot: 3 },
      { id: 'bistrotisch', x: 1, y: 1 },
      { id: 'bistrotisch', x: 1, y: 2 },
      { id: 'bistrotisch', x: 1, y: 4, variant: 'bordeaux' },
      { id: 'bistrotisch', x: 1, y: 5, variant: 'bordeaux' },
      { id: 'bistrolampe', x: 1, y: 2, on: 'bistrotisch' },
      { id: 'bistrostuhl', x: 2, y: 1, rot: 1 },
      { id: 'bistrostuhl', x: 2, y: 2, rot: 1 },
      { id: 'bistrostuhl', x: 2, y: 4, rot: 1 },
      { id: 'bistrostuhl', x: 2, y: 5, rot: 1 },
      // --- rechte Wandbank mit vier Tischen
      { id: 'bistrobank', x: 9, y: 2, rot: 1 },
      { id: 'bistrobank', x: 9, y: 4, rot: 1 },
      { id: 'bistrotisch', x: 8, y: 2 },
      { id: 'bistrotisch', x: 8, y: 3, variant: 'bordeaux' },
      { id: 'bistrotisch', x: 8, y: 4 },
      { id: 'bistrotisch', x: 8, y: 5, variant: 'bordeaux' },
      { id: 'bistrolampe', x: 8, y: 4, on: 'bistrotisch' },
      { id: 'bistrostuhl', x: 7, y: 2, rot: 3 },
      { id: 'bistrostuhl', x: 7, y: 3, rot: 3 },
      { id: 'bistrostuhl', x: 7, y: 4, rot: 3 },
      { id: 'bistrostuhl', x: 7, y: 5, rot: 3 },
      // --- zwei Tische in der Mitte
      { id: 'bistrotisch', x: 4, y: 1 },
      { id: 'bistrotisch', x: 4, y: 3 },
      { id: 'etagere', x: 4, y: 1, on: 'bistrotisch' },
      { id: 'bistrostuhl', x: 3, y: 1, rot: 3 },
      { id: 'bistrostuhl', x: 5, y: 1, rot: 1 },
      { id: 'bistrostuhl', x: 3, y: 3, rot: 3 },
      { id: 'bistrostuhl', x: 5, y: 3, rot: 1 },
      { id: 'bistrolaeufer', x: 4, y: 5 },
      // --- Wände: Tafel, Bilder, Lampen, Schild
      { id: 'kugelleuchte', x: 3, y: 0, rot: 0 },
      { id: 'gemaelde-jens', x: 4, y: 0, rot: 0 },
      { id: 'kugelleuchte', x: 5, y: 0, rot: 0 },
      { id: 'poster-kaffee', x: 6, y: 0, rot: 0 },
      { id: 'schild-toilette', x: 9, y: 0, rot: 0 },
      { id: 'kreidetafel', x: 0, y: 3, rot: 3 },
      { id: 'messingleuchte', x: 0, y: 2, rot: 3 },
      { id: 'messingleuchte', x: 0, y: 5, rot: 3 },
      { id: 'goldspiegel', x: 9, y: 1, rot: 1 },
      { id: 'kugelleuchte', x: 9, y: 3, rot: 1 },
      { id: 'messingleuchte', x: 9, y: 2, rot: 1 },
      { id: 'messingleuchte', x: 9, y: 5, rot: 1 },
    ],
    intro: ['Chez Jens von innen! Wandbänke in Bordeaux, runde Tische mit Messingrand, Bugholzstühle – und das Mosaik auf dem Boden ist sicher älter als wir alle.', 'Und natürlich: Kunst. Ein Dackel unter rosa Himmel, in einem goldenen Rahmen. Sehr fabelhaft.'],
    comments: {
      zinktheke: ['Der Tresen glänzt. Jens poliert ihn jeden Morgen. Und redet dabei mit sich selbst auf Französisch.'],
      bistrolampe: ['Die grüne Lampe wirft ein warmes Licht. Ich würde hier einziehen. Aber ohne Croissants wär ich bald dick.'],
      barhocker: ['Die Barhocker drehen sich. Ich drehe mich einmal. Nur einmal. Zweimal.'],
      bistrotisch: ['Ein runder Tisch mit Messingrand. Zwei Croissants passen drauf, ein Kaffee sowieso.'],
      etagere: ['Eine Etagere mit Croissants. Jens sagt: „Eins ist für dich.“ Es sind immer drei.'],
      bistrostuhl: ['Ein Bugholzstuhl. Der wackelt nicht. Jens schwört darauf.'],
      bistrobank: ['Eine Wandbank in Bordeaux mit Steppnähten. Hier sitzen die Stammgäste. Jens sagt: „Nur die Plätze am Fenster sind besser.“'],
      kreidetafel: ['Tagesgericht: Fischbrötchen à la Jens – mit Herzchen. Die Schrift ist von Hand, leicht sächsisch.'],
      goldspiegel: ['Ein goldener Spiegel. Ich sehe mich lächeln. Jens hat ihn extra dafür aufgehängt.'],
      weinregal: ['Flaschen, ordentlich gelagert. Lars sagt „in Maßen“. Oma sagt: „Wo sind die Gläser?“'],
      'gemaelde-jens': ['Ein echter Jens: der Dackel unter rosa Himmel. Winston sieht ihm ein bisschen ähnlich. Oder umgekehrt.'],
      'poster-kaffee': ['„Café Fabuleux“ – das Plakat hängt hier, seit Jens eröffnet hat. Er sagt: „Das ist unser Motto.“'],
      bistrolaeufer: ['Ein roter Läufer wie in einem Pariser Bistro. Ich geh extra langsam drüber.'],
      yucca: ['Eine Yucca-Palme am Fenster. Jens sagt, sie sorgt für „Côte d\'Azur im Winter“.'],
      kugelleuchte: ['Eine Kugellampe an einem Messingarm. Abends sieht das Café damit aus wie auf einer Postkarte.'],
      messingleuchte: ['Eine kleine Wandleuchte mit Stoffschirm. Jens sagt: „Licht ist die halbe Küche.“'],
      'schild-toilette': ['„TOILETTE“. Jens hat darauf bestanden, dass es auf Französisch bleibt. Es ist dasselbe Wort. Er findet es trotzdem eleganter.'],
    },
  },
};

/** Gegenstands-ID zu einer Basis-ID: Möbel mit Farbvarianten nehmen die erste Farbe */
export function guestItemId(base: string, variant?: string): string {
  const def = FURNITURE.find((f) => f.id === base);
  if (def?.variants) return variantItemId(def, variant && variant in def.variants ? variant : Object.keys(def.variants)[0]);
  return base;
}

const ROOM_CACHE = new Map<string, Room>();

/** Das Zimmer eines Gasthauses als normaler Raum (für die Innenansicht; immer dasselbe Objekt) */
export function guestRoom(houseId: string): Room | null {
  const h = GUEST_HOUSES[houseId];
  if (!h) return null;
  const cached = ROOM_CACHE.get(houseId);
  if (cached) return cached;
  const uidOf = (id: string, i: number) => `gast-${houseId}-${id}-${i}`;
  const items: PlacedItem[] = h.items.map((it, i) => ({
    uid: uidOf(it.id, i),
    itemId: guestItemId(it.id, it.variant),
    x: it.x,
    y: it.y,
    rot: it.rot ?? 0,
    ...(it.on ? { on: uidOf(it.on, h.items.findIndex((o) => o.id === it.on)) } : {}),
  }));
  const room: Room = { id: 'haupt', wallpaper: h.wallpaper, floor: h.floor, items };
  ROOM_CACHE.set(houseId, room);
  return room;
}
