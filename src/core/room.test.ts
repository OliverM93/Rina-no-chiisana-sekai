import { describe, expect, it } from 'vitest';
import { furnitureInfo } from '../data/furniture';
import { HOUSE_RULES, layoutOf, MAX_STAGE, STARTER_HOUSE } from '../data/house';
import { backWindows, blockedCells, checkPlacement, exitAt, itemsAt, misfits, moveItem, normalizeHouse, normalizeRoom, placeItem, removeItem, riderOffset, type Room, wallRotationAt } from './room';

const empty = (): Room => ({ id: 'haupt', wallpaper: 'tapete-creme', floor: 'boden-dielen', items: [] });
const L0 = layoutOf(0, 'haupt');

describe('Zimmer', () => {
  it('Wand-Deko hängt nur an Rück- und Seitenwänden, nicht vor Fenstern', () => {
    const r = empty();
    const wins = backWindows(L0);
    expect(wins.length).toBeGreaterThan(0);
    const free = [...Array(L0.w).keys()].find((x) => wins.every((w) => Math.abs(x + 0.5 - w) >= 0.75) && x > 0)!;
    expect(checkPlacement(r, L0, 'bild-winston', free, 0, 0, furnitureInfo).ok).toBe(true); // Rückwand
    expect(checkPlacement(r, L0, 'bild-winston', free, 2, 0, furnitureInfo).ok).toBe(false); // mitten im Raum
    expect(checkPlacement(r, L0, 'bild-winston', Math.floor(wins[0]), 0, 0, furnitureInfo).ok).toBe(false); // Fenster
    expect(checkPlacement(r, L0, 'bild-winston', 0, 2, 3, furnitureInfo).ok).toBe(true); // linke Wand
    expect(checkPlacement(r, L0, 'bild-winston', L0.w - 1, 2, 1, furnitureInfo).ok).toBe(true); // rechte Wand
    expect(checkPlacement(r, L0, 'bild-winston', L0.w - 1, 2, 3, furnitureInfo).ok).toBe(false); // falsche Seite
    expect(checkPlacement(r, L0, 'wandregal', 0, 1, 3, furnitureInfo).ok).toBe(true); // 2 breit an der Seitenwand
    expect(wallRotationAt(L0, 3, 0)).toBe(0);
    expect(wallRotationAt(L0, 0, 3)).toBe(3);
    expect(wallRotationAt(L0, L0.w - 1, 3)).toBe(1);
    expect(wallRotationAt(L0, 3, 3)).toBeNull();
  });

  it('Wand-Deko blockiert nichts, Möbel dürfen darunter stehen – aber nicht zwei Bilder übereinander', () => {
    const r = empty();
    const pic = placeItem(r, L0, 'bild-winston', 0, 2, 3, furnitureInfo)!;
    expect(pic).not.toBeNull();
    expect(placeItem(r, L0, 'chabudai', 0, 2, 0, furnitureInfo)).not.toBeNull(); // niedriger Tisch darunter
    expect(checkPlacement(r, L0, 'poster-grusel', 0, 2, 3, furnitureInfo).ok).toBe(false); // schon belegt
    expect(blockedCells(r, L0, furnitureInfo).has('0,2')).toBe(true); // durch den Tisch, nicht das Bild
    removeItem(r, r.items.find((i) => i.itemId === 'chabudai')!.uid);
    expect(blockedCells(r, L0, furnitureInfo).has('0,2')).toBe(false);
    // ganz unten beim Greifen
    placeItem(r, L0, 'zabuton-rosa', 0, 2, 0, furnitureInfo);
    expect(itemsAt(r, 0, 2, furnitureInfo).map((i) => i.itemId)).toEqual(['zabuton-rosa', 'bild-winston']);
  });

  it('Wand-Deko hängt nur über Möbeln, die niedrig genug sind – Kommode ja, Regal nein', () => {
    const r = empty();
    // niedrig darunter: ok
    expect(placeItem(r, L0, 'tansu', 0, 2, 3, furnitureInfo)).not.toBeNull(); // Kommode (links, 2 breit → dreht sich zur Wand)
    expect(checkPlacement(r, L0, 'bild-winston', 0, 2, 3, furnitureInfo).ok).toBe(true);
    expect(checkPlacement(r, L0, 'wandregal', 0, 2, 3, furnitureInfo).ok).toBe(true);
    // hohes Regal darunter: das Poster hätte keinen Platz mehr
    const hoch = empty();
    expect(placeItem(hoch, L0, 'regal', 0, 4, 3, furnitureInfo)).not.toBeNull();
    expect(checkPlacement(hoch, L0, 'poster-grusel', 0, 4, 3, furnitureInfo).ok).toBe(false);
    expect(checkPlacement(hoch, L0, 'poster-grusel', 0, 3, 3, furnitureInfo).ok).toBe(true); // daneben geht's
    // umgekehrt: ein Regal unter ein schon hängendes Poster stellen geht auch nicht
    const bild = empty();
    placeItem(bild, L0, 'poster-grusel', 0, 4, 3, furnitureInfo);
    expect(checkPlacement(bild, L0, 'regal', 0, 4, 3, furnitureInfo).ok).toBe(false);
    expect(checkPlacement(bild, L0, 'chabudai', 0, 4, 3, furnitureInfo).ok).toBe(true);
  });

  it('ältere Spielstände behalten ihre Einrichtung, auch wenn ein Poster über einem Regal hängt', () => {
    const r: Room = { ...empty(), items: [
      { uid: 'a', itemId: 'poster-grusel', x: 0, y: 4, rot: 3 },
      { uid: 'b', itemId: 'regal', x: 0, y: 4, rot: 3 },
    ] };
    const loaded = normalizeRoom(r, empty(), L0, () => true, furnitureInfo);
    expect(loaded.items.map((i) => i.itemId).sort()).toEqual(['poster-grusel', 'regal']);
  });

  it('Tassen stehen dicht an dicht: vier je Feld auf dem Tassenbord an der Wand', () => {
    const r = empty();
    const bord = placeItem(r, L0, 'tassenbord', 0, 2, 3, furnitureInfo)!;
    expect(bord).not.toBeNull();
    const mugs: string[] = [];
    for (let i = 0; i < 4; i++) {
      const m = placeItem(r, L0, 'tasse-klassik-gruen', 0, 2, 0, furnitureInfo);
      expect(m, `Tasse ${i}`).not.toBeNull();
      expect(m!.on).toBe(bord.uid);
      expect(m!.rot).toBe(3); // schaut in den Raum
      mugs.push(`${m!.slot}`);
    }
    expect(mugs).toEqual(['0', '1', '2', '3']);
    expect(checkPlacement(r, L0, 'tasse-klassik-gruen', 0, 2, 0, furnitureInfo).ok).toBe(false); // Feld voll
    expect(checkPlacement(r, L0, 'tasse-klassik-gruen', 0, 3, 0, furnitureInfo).ok).toBe(true); // zweites Feld des Bords
    // ein Stuhl o. ä. darunter stört nicht
    expect(placeItem(r, L0, 'zabuton-rosa', 0, 2, 0, furnitureInfo)).not.toBeNull();
    // die Tassen wandern mit dem Bord
    expect(moveItem(r, L0, bord.uid, 0, 4, 3, furnitureInfo)).toBe(true);
    expect(r.items.filter((i) => i.on === bord.uid).every((i) => i.y === 4)).toBe(true);
  });

  it('der Platz einer Tasse bleibt beim Laden erhalten', () => {
    const r = empty();
    const bord = placeItem(r, L0, 'tassenbord', 0, 2, 3, furnitureInfo)!;
    placeItem(r, L0, 'tasse-klassik-gruen', 0, 2, 0, furnitureInfo, 'm1', { slot: 2 });
    const copy = JSON.parse(JSON.stringify(r)) as Room;
    const loaded = normalizeRoom(copy, empty(), L0, () => true, furnitureInfo);
    expect(loaded.items.find((i) => i.uid === 'm1')).toMatchObject({ on: bord.uid, slot: 2 });
  });

  it('Winzlinge liegen auf ihrem Platz: nebeneinander, an der Wand zur Wand hin', () => {
    const info = furnitureInfo('tassenbord')!;
    const xs = [0, 1, 2, 3].map((s) => riderOffset(info, 0, s).dx);
    expect(xs[0]).toBeLessThan(xs[1]);
    expect(xs[3]).toBeCloseTo(-xs[0]);
    expect(riderOffset(info, 0, 0).dz).toBeLessThan(0); // Rückwand: zur Wand hin = -z
    expect(riderOffset(info, 3, 0).dx).toBeLessThan(0); // linke Wand: -x
    expect(riderOffset(furnitureInfo('regal')!, 0, 0)).toEqual({ dx: 0, dz: 0 }); // Standregal: Feldmitte
  });

  it('Möbel brauchen freien Platz im Raum, nicht auf Tür oder Pult', () => {
    const r = empty();
    expect(placeItem(r, L0, 'kotatsu-rot', 2, 1, 0, furnitureInfo)).not.toBeNull();
    expect(checkPlacement(r, L0, 'tansu', 3, 2, 0, furnitureInfo).ok).toBe(false); // überlappt
    expect(checkPlacement(r, L0, 'tansu', 7, 0, 0, furnitureInfo).ok).toBe(false); // ragt hinaus
    expect(checkPlacement(r, L0, 'tansu', 7, 0, 1, furnitureInfo).ok).toBe(true); // gedreht passt es
    expect(checkPlacement(r, L0, 'andon', 3, 5, 0, furnitureInfo).ok).toBe(false); // Tür
    expect(checkPlacement(r, L0, 'andon', 0, 0, 0, furnitureInfo).ok).toBe(false); // Katalog-Pult
  });

  it('Deko auf Tischen, Teppiche unter Möbeln', () => {
    const r = empty();
    const table = placeItem(r, L0, 'chabudai', 4, 2, 0, furnitureInfo)!;
    const tea = placeItem(r, L0, 'teeservice', 4, 2, 0, furnitureInfo)!;
    expect(tea.on).toBe(table.uid);
    expect(checkPlacement(r, L0, 'bonsai', 4, 2, 0, furnitureInfo).ok).toBe(false);
    expect(checkPlacement(r, L0, 'andon', 4, 2, 0, furnitureInfo).ok).toBe(false);
    expect(placeItem(r, L0, 'tatami-matte', 1, 2, 0, furnitureInfo)).not.toBeNull();
    expect(placeItem(r, L0, 'zabuton-rosa', 1, 2, 0, furnitureInfo)).not.toBeNull();
    expect(checkPlacement(r, L0, 'tatami-matte', 2, 3, 0, furnitureInfo).ok).toBe(false);
    expect(itemsAt(r, 4, 2, furnitureInfo).map((i) => i.itemId)).toEqual(['teeservice', 'chabudai']);
    expect(blockedCells(r, L0, furnitureInfo).has('4,2')).toBe(true);
    expect(blockedCells(r, L0, furnitureInfo).has('2,3')).toBe(false);
  });

  it('Verschieben nimmt Deko mit, Wegräumen auch', () => {
    const r = empty();
    const table = placeItem(r, L0, 'chabudai', 4, 2, 0, furnitureInfo)!;
    placeItem(r, L0, 'teeservice', 4, 2, 0, furnitureInfo);
    expect(moveItem(r, L0, table.uid, 5, 3, 0, furnitureInfo)).toBe(true);
    expect(r.items.find((i) => i.itemId === 'teeservice')).toMatchObject({ x: 5, y: 3 });
    expect(removeItem(r, table.uid).map((i) => i.itemId).sort()).toEqual(['chabudai', 'teeservice']);
    expect(r.items).toEqual([]);
  });
});

describe('Haus & Ausbau', () => {
  it('Ausbaustufen haben passende Räume und Ausgänge', () => {
    expect(HOUSE_RULES.layouts(0).map((l) => l.id)).toEqual(['haupt']);
    expect(layoutOf(1, 'haupt')).toMatchObject({ w: 10, h: 7 });
    expect(HOUSE_RULES.layouts(3).map((l) => l.id)).toEqual(['haupt', 'schlafzimmer', 'dach']);
    const main3 = layoutOf(3, 'haupt');
    expect(exitAt(main3, 4, 6)?.to).toBe('draussen');
    expect(exitAt(main3, 5, 6), 'Tür ist ein Feld breit').toBeNull();
    // Schlafzimmer: keine Ausgangs-Tür mehr – man läuft durch die Tür im Grundriss; das Feld bleibt aber frei
    expect(exitAt(main3, 4, 0)).toBeNull();
    expect(main3.reserved).toContainEqual([4, 0]);
    expect(exitAt(main3, 9, 0)?.to).toBe('dach');
    expect(exitAt(layoutOf(3, 'dach'), 3, 5)?.to).toBe('haupt');
  });

  it('nach dem Umbau stehen manche Möbel im Weg', () => {
    const r = empty();
    placeItem(r, layoutOf(1, 'haupt'), 'andon', 4, 0, 0, furnitureInfo);
    placeItem(r, layoutOf(1, 'haupt'), 'bambus', 1, 1, 0, furnitureInfo);
    expect(misfits(r, layoutOf(2, 'haupt'), furnitureInfo).map((i) => i.itemId)).toEqual(['andon']); // Durchgang hinten
  });

  it('Start-Haus ist gültig, fehlende Räume werden ergänzt', () => {
    const h = normalizeHouse(structuredClone(STARTER_HOUSE), STARTER_HOUSE, HOUSE_RULES, () => true, furnitureInfo);
    expect(h.rooms[0].items).toHaveLength(3);
    const h2 = normalizeHouse({ stage: 2, rooms: [STARTER_HOUSE.rooms[0]], pending: { stage: 3, day: '2026-01-01' } }, STARTER_HOUSE, HOUSE_RULES, () => true, furnitureInfo);
    expect(h2.rooms.map((r) => r.id)).toEqual(['haupt', 'schlafzimmer']);
    expect(h2.pending).toEqual({ stage: 3, day: '2026-01-01' });
    expect(normalizeHouse({ stage: 99 }, STARTER_HOUSE, HOUSE_RULES, () => true, furnitureInfo).stage).toBe(MAX_STAGE);
  });
});
