/**
 * Linas Grundstück: hier darf sie Zäune, Wege, Gartenmöbel und Hochbeete
 * aufstellen. Alles außerhalb bleibt das Dorf.
 */
import type { YardArea } from '../core/yard';

/**
 * Seit Spielstand v21 größer: drei Reihen Wiese hinter dem Haus (y 5–7) und eine Reihe vor dem Hauptweg (y 19) gehören
 * dazu – Platz für Beete, Ställe und Deko. Gartensachen alter Spielstände rücken per Migration mit.
 */
export const YARD_AREA: YardArea = { x: 1, y: 5, w: 16, h: 15, from: { x: 27, y: 17 } };

/**
 * Der Garten vor der Strandhütte auf der versteckten Insel (Linas Traum: Hütte und Wachtelfarm auf Hawaii).
 * Liegt südlich der Hütte im Sand; erreichbar bleiben muss alles vom Ankunftsstrand aus.
 */
export const INSEL_YARD_AREA: YardArea = { x: 29, y: 52, w: 10, h: 6, from: { x: 18, y: 52 } };

export type YardId = 'dorf' | 'insel';
export const YARD_AREAS: Readonly<Record<YardId, YardArea>> = { dorf: YARD_AREA, insel: INSEL_YARD_AREA };
