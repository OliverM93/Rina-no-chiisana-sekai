import { describe, expect, it } from 'vitest';
import { checkPlacement, placeItem, type Room } from './room';
import { buildWorldMap, setExtraBlocked } from './worldmap';
import { buildYardLayout, keepsAccess, yardBlockedTiles, type YardArea } from './yard';

// 9×6 Testkarte: Garten links (x 0–4), Ausgang zum Rest rechts
const LAYOUT = ['.........', '.........', '.........', '.........', '.........', '.........'];
const map = buildWorldMap(LAYOUT, [{ id: 'briefkasten', kind: 'mailbox', x: 2, y: 2 }], { x: 8, y: 3 });
const AREA: YardArea = { x: 0, y: 0, w: 5, h: 6, from: { x: 8, y: 3 } };
const info = (id: string) => (id === 'weg' ? { w: 1, d: 1, rug: true } : id === 'tor' ? { w: 1, d: 1, walk: true } : { w: 1, d: 1 });

describe('Garten', () => {
  const layout = buildYardLayout(map, AREA);

  it('hält Objekte und ihre Benutzungsfelder frei', () => {
    const res = new Set(layout.reserved?.map(([x, y]) => `${x},${y}`));
    expect(res.has('2,2')).toBe(true); // Briefkasten
    expect(res.has('2,3')).toBe(true); // davor
    expect(res.has('0,0')).toBe(false);
    const yard: Room = { id: 'garten', wallpaper: '', floor: '', items: [] };
    expect(checkPlacement(yard, layout, 'zaun', 2, 3, 0, info).ok).toBe(false);
    expect(checkPlacement(yard, layout, 'zaun', 0, 0, 0, info).ok).toBe(true);
  });

  it('Wege und Tore blockieren nicht', () => {
    const yard: Room = { id: 'garten', wallpaper: '', floor: '', items: [] };
    placeItem(yard, layout, 'weg', 0, 0, 0, info);
    placeItem(yard, layout, 'tor', 1, 0, 0, info);
    placeItem(yard, layout, 'zaun', 4, 5, 0, info);
    expect(yardBlockedTiles(map, AREA, yard, layout, info)).toEqual([5 * 9 + 4]);
  });

  it('niemand wird eingesperrt', () => {
    // Eine Zaunreihe quer durch den Garten schneidet den Briefkasten ab → verboten
    const wall = [0, 1, 2, 3, 4].map((y) => y * 9 + 4).concat([5 * 9 + 4]);
    expect(keepsAccess(map, AREA, wall)).toBe(false);
    // Eine abgeschlossene Ecke im eigenen Garten ist erlaubt
    expect(keepsAccess(map, AREA, [1, 9])).toBe(true);
    // Der Rest des Dorfes ist nicht betroffen
    expect(keepsAccess(map, AREA, [5 * 9 + 0])).toBe(true);
  });

  it('Gartenmöbel blockieren die Karte', () => {
    setExtraBlocked(map, [0]);
    expect(map.grid.isBlocked(0, 0)).toBe(true);
    setExtraBlocked(map, []);
    expect(map.grid.isBlocked(0, 0)).toBe(false);
  });
});
