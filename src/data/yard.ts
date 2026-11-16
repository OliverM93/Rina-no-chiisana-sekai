/**
 * Linas Grundstück: hier darf sie Zäune, Wege, Gartenmöbel und Hochbeete
 * aufstellen. Alles außerhalb bleibt das Dorf.
 */
import type { YardArea } from '../core/yard';

export const YARD_AREA: YardArea = { x: 1, y: 8, w: 16, h: 11, from: { x: 27, y: 17 } };

/**
 * Der Garten vor der Strandhütte auf der versteckten Insel (Linas Traum: Hütte und Wachtelfarm auf Hawaii).
 * Liegt südlich der Hütte im Sand; erreichbar bleiben muss alles vom Ankunftsstrand aus.
 */
export const INSEL_YARD_AREA: YardArea = { x: 29, y: 52, w: 10, h: 6, from: { x: 18, y: 52 } };

export type YardId = 'dorf' | 'insel';
export const YARD_AREAS: Readonly<Record<YardId, YardArea>> = { dorf: YARD_AREA, insel: INSEL_YARD_AREA };
