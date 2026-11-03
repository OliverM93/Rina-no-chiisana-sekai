import { describe, expect, it } from 'vitest';
import { furnitureInfo, STARTER_HOME } from '../data/furniture';
import { blockedCells, checkPlacement, type Home, itemsAt, moveItem, normalizeHome, placeItem, removeItem } from './room';

const empty = (): Home => ({ wallpaper: 'tapete-creme', floor: 'boden-dielen', items: [] });

describe('Zimmer', () => {
  it('Möbel brauchen freien Platz im Raum, nicht auf Tür oder Pult', () => {
    const h = empty();
    expect(placeItem(h, 'kotatsu-rot', 2, 1, 0, furnitureInfo)).not.toBeNull();
    expect(checkPlacement(h, 'tansu', 3, 2, 0, furnitureInfo).ok).toBe(false); // überlappt
    expect(checkPlacement(h, 'tansu', 7, 0, 0, furnitureInfo).ok).toBe(false); // ragt hinaus
    expect(checkPlacement(h, 'tansu', 7, 0, 1, furnitureInfo).ok).toBe(true); // gedreht passt es
    expect(checkPlacement(h, 'andon', 3, 5, 0, furnitureInfo).ok).toBe(false); // Tür
    expect(checkPlacement(h, 'andon', 0, 0, 0, furnitureInfo).ok).toBe(false); // Katalog-Pult
  });

  it('Deko auf Tischen, Teppiche unter Möbeln', () => {
    const h = empty();
    const table = placeItem(h, 'chabudai', 4, 2, 0, furnitureInfo)!;
    const tea = placeItem(h, 'teeservice', 4, 2, 0, furnitureInfo)!;
    expect(tea.on).toBe(table.uid);
    expect(checkPlacement(h, 'bonsai', 4, 2, 0, furnitureInfo).ok).toBe(false); // Platz besetzt
    expect(checkPlacement(h, 'andon', 4, 2, 0, furnitureInfo).ok).toBe(false); // zu groß für den Tisch
    expect(placeItem(h, 'tatami-matte', 1, 2, 0, furnitureInfo)).not.toBeNull();
    expect(placeItem(h, 'zabuton-rosa', 1, 2, 0, furnitureInfo)).not.toBeNull(); // auf dem Teppich
    expect(checkPlacement(h, 'tatami-matte', 2, 3, 0, furnitureInfo).ok).toBe(false); // Teppich auf Teppich
    expect(itemsAt(h, 4, 2, furnitureInfo).map((i) => i.itemId)).toEqual(['teeservice', 'chabudai']);
    expect(blockedCells(h, furnitureInfo).has('4,2')).toBe(true);
    expect(blockedCells(h, furnitureInfo).has('2,3')).toBe(false); // Teppich ist begehbar
  });

  it('Verschieben nimmt Deko mit, Wegräumen auch', () => {
    const h = empty();
    const table = placeItem(h, 'chabudai', 4, 2, 0, furnitureInfo)!;
    placeItem(h, 'teeservice', 4, 2, 0, furnitureInfo);
    expect(moveItem(h, table.uid, 5, 3, 0, furnitureInfo)).toBe(true);
    expect(h.items.find((i) => i.itemId === 'teeservice')).toMatchObject({ x: 5, y: 3 });
    expect(removeItem(h, table.uid).map((i) => i.itemId).sort()).toEqual(['chabudai', 'teeservice']);
    expect(h.items).toEqual([]);
  });

  it('Start-Einrichtung ist gültig, kaputte Daten werden repariert', () => {
    const fallback = { wallpaper: STARTER_HOME.wallpaper, floor: STARTER_HOME.floor, items: [] };
    const h = normalizeHome(structuredClone(STARTER_HOME), fallback, () => true, furnitureInfo);
    expect(h.items).toHaveLength(STARTER_HOME.items.length);
    const broken = normalizeHome({ wallpaper: 'gibtsnicht', items: [{ itemId: 'futon-rosa', x: 99, y: 0 }, { itemId: 'chabudai', x: 2, y: 2, rot: 5 }] }, fallback, (id) => id !== 'gibtsnicht', furnitureInfo);
    expect(broken.wallpaper).toBe(STARTER_HOME.wallpaper);
    expect(broken.items.map((i) => [i.itemId, i.rot])).toEqual([['chabudai', 1]]);
  });
});
