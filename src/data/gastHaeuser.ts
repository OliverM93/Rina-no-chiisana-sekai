/**
 * Häuser der Bewohner von innen: Lina darf zu Besuch kommen (nur ansehen, nicht umräumen) und kommentiert die Einrichtung.
 * Jedes Haus ist ein Zimmer aus vorhandenen Möbeln; die Zeilen sind Linas Gedanken. Keine erfundenen Familiengeschichten –
 * nur Eigenheiten, die die Figuren ohnehin haben.
 *
 * Neues Haus: hier eintragen, in `World3D.knockAtHome` freischalten.
 */
import type { PlacedItem, Room, RoomLayout } from '../core/room';
import { FURNITURE } from './furniture';

export interface GuestItem {
  id: string;
  x: number;
  y: number;
  rot?: 0 | 1 | 2 | 3;
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

const DOOR: RoomLayout['exits'][number] = { cells: [[3, 5], [4, 5]], to: 'draussen', dir: 'down', kind: 'haustuer' };

export const GUEST_LAYOUT: RoomLayout = { id: 'haupt', name: 'Zu Besuch', w: 8, h: 6, exits: [DOOR] };

export const GUEST_HOUSES: Readonly<Record<string, GuestHouse>> = {
  'haus-gisela': {
    npc: 'gisela',
    name: 'Omas Wohnzimmer',
    wallpaper: 'tapete-ranken',
    floor: 'boden-fischgraet',
    items: [
      { id: 'perserteppich', x: 2, y: 2 },
      { id: 'ohrensessel', x: 1, y: 1, rot: 0 },
      { id: 'nierentisch', x: 3, y: 1 },
      { id: 'bonbonschale', x: 3, y: 1, on: 'nierentisch' },
      { id: 'fransenlampe', x: 5, y: 1 },
      { id: 'gummibaum', x: 7, y: 1 },
      { id: 'sofa', x: 5, y: 3, rot: 0 },
      { id: 'regal', x: 0, y: 3, rot: 1 },
      { id: 'wanduhr', x: 0, y: 2, rot: 3 },
    ],
    intro: ['Ah, bei Oma. Es riecht nach Keksen und nach Kaffee, wie immer.', 'Alles steht an seinem Platz. Wehe, jemand verschiebt etwas.'],
    comments: {
      perserteppich: ['Omas Teppich. Mit Fransen, die Christin jedes Mal kämmen möchte. Oma lässt sie nicht.'],
      ohrensessel: ['Omas Ohrensessel. Man versinkt darin – und sie hat trotzdem immer das letzte Wort.'],
      nierentisch: ['Ein Nierentisch, genau wie in den Fünfzigern. Oma sagt: „Das ist keine Mode, das ist Haltung.“'],
      bonbonschale: ['Bonbons! Ich nehm nur eins. … Oma hat es trotzdem gesehen. Ich spür es.'],
      fransenlampe: ['Die Fransenlampe schimmert so warm. Alles hier hat einen goldenen Schein.'],
      gummibaum: ['Der Gummibaum glänzt, als würde Oma ihn jeden Tag polieren. Wahrscheinlich tut sie das.'],
      sofa: ['Oma hat ein Sofa, auf dem man nur sitzt, wenn man eingeladen ist. Ich bin eingeladen, glaub ich.'],
      regal: ['Ein Regal voller Kochbücher und Strickmuster. „Köstlich“ steht überall am Rand. Und ein paar Mal „pfui“.'],
      wanduhr: ['Die Uhr geht genau richtig. Oma sagt, alle anderen Uhren irren sich.'],
    },
  },
  'haus-olaf': {
    npc: 'olaf',
    name: 'Olafs & Christins Haus',
    wallpaper: 'tapete-creme',
    floor: 'boden-dielen',
    items: [
      { id: 'sofa', x: 1, y: 2, rot: 0 },
      { id: 'satztische', x: 4, y: 2 },
      { id: 'topfpflanze', x: 0, y: 1 },
      { id: 'topfpflanze', x: 2, y: 1 },
      { id: 'topfpflanze', x: 4, y: 1 },
      { id: 'regal', x: 6, y: 1, rot: 0 },
      { id: 'modellflugzeug', x: 6, y: 1, on: 'regal' },
      { id: 'wanduhr', x: 0, y: 3, rot: 3 },
      { id: 'witzkalender', x: 7, y: 3, rot: 1 },
    ],
    intro: ['Bei Papa und Christin ist alles exakt ausgerichtet. Selbst die Pflanzen stehen in einer Linie.', 'Ich trau mich kaum, etwas anzufassen. Aber ich guck mal.'],
    comments: {
      sofa: ['Ein schönes, ordentliches Sofa. Die Kissen sind so gefaltet, als hätte es nie jemand benutzt. Das war Christin.'],
      satztische: ['Satztische, in der Größe gestaffelt. Papa hat sie vermessen. Christin hat sie ausgerichtet.'],
      topfpflanze: ['Drei Monstera in einer Reihe, alle gleich weit vom Fenster. Ich hab nachgeschaut: Sie sind beschriftet.'],
      regal: ['Ordner, Ordner, Ordner – alle mit Etikett. Und ganz oben ein Flugzeugmodell, das Papa selbst gebaut hat.'],
      modellflugzeug: ['Papas Flugzeugmodell. Er kennt jede Schraube. Und er sagt es mir gern, wenn ich frag.'],
      wanduhr: ['Eine Uhr, die auf die Sekunde stimmt. Natürlich.'],
    },
  },
  'haus-thalia': {
    npc: 'thalia',
    name: 'Thalias Häuschen',
    wallpaper: 'tapete-formen',
    floor: 'boden-dielen',
    items: [
      { id: 'sofa', x: 1, y: 3, rot: 0 },
      { id: 'globus', x: 5, y: 1 },
      { id: 'wandkarte-thalia', x: 2, y: 0, rot: 0 },
      { id: 'discokugel', x: 7, y: 1 },
      { id: 'regal', x: 0, y: 1, rot: 0 },
      { id: 'ammonit-lina', x: 0, y: 1, on: 'regal' },
      { id: 'formenteppich', x: 4, y: 3 },
    ],
    intro: ['Thalias Häuschen! Überall Karten, Steine und Zettel mit Pfeilen.', 'Es sieht aus wie ein Museum, in dem jemand wohnt. Ich liebe es.'],
    comments: {
      sofa: ['Das Sofa ist halb unter Landkarten begraben. Thalia nennt das „Arbeitsplatz“.'],
      globus: ['Ein Globus mit Stecknadeln. Jede Stecknadel ist ein Ort, an den sie noch will. Es sind sehr viele.'],
      'wandkarte-thalia': ['Eine von Thalias Karten – mit Herz! Ich hab auch eine zu Hause.'],
      discokugel: ['Die Discokugel von der Party! Wenn sie sich dreht, tanzt die Wand.'],
      regal: ['Steine nach Farbe sortiert, nicht nach Wert. Thalia sagt, das sei Kunst und nicht Wissenschaft.'],
      'ammonit-lina': ['Der Ammonit, der nach mir benannt ist! Er sieht stolz aus.'],
      formenteppich: ['Ein Teppich wie ein Bauhaus-Gemälde. Thalia sagt: „Geometrie unter den Füßen.“'],
    },
  },
};

/** Gegenstands-ID zu einer Basis-ID: Möbel mit Farbvarianten nehmen die erste Farbe */
export function guestItemId(base: string): string {
  const def = FURNITURE.find((f) => f.id === base);
  if (def?.variants) return `${base}-${Object.keys(def.variants)[0]}`;
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
    itemId: guestItemId(it.id),
    x: it.x,
    y: it.y,
    rot: it.rot ?? 0,
    ...(it.on ? { on: uidOf(it.on, h.items.findIndex((o) => o.id === it.on)) } : {}),
  }));
  const room: Room = { id: 'haupt', wallpaper: h.wallpaper, floor: h.floor, items };
  ROOM_CACHE.set(houseId, room);
  return room;
}
