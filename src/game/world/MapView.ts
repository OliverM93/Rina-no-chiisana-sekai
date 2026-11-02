/**
 * Baut die sichtbare Welt aus dem Kartenmodell: Wiese, Geländeebenen,
 * Deko, Gebäude, Bäume, Lichtquellen.
 */
import Phaser from 'phaser';
import { DEPTH, RES, TILE } from '../../config';
import { tileNoise } from '../../core/rng';
import type { Season } from '../../core/time';
import { type MapObject, terrainAt, type WorldMap } from '../../core/worldmap';
import { FLOWER_COLORS } from '../../gfx/effects';
import { HOUSE_HEART_WINDOW, HOUSE_WINDOWS, LANTERN_LIGHT, TREE_VARIANTS } from '../../gfx/objects';
import { layerMasks, TILESET_PAD, terrainLayers } from '../../gfx/terrain';
import { originOf } from '../../gfx/textures';

export interface LightSpot {
  x: number;
  y: number;
  kind: 'lantern' | 'window' | 'heart';
}

export interface Occluder {
  sprite: Phaser.GameObjects.Image;
  /** Bereich, in dem Lina „hinter“ dem Objekt steht (Weltkoordinaten) */
  area: Phaser.Geom.Rectangle;
  baseY: number;
}

export interface MapView {
  occluders: Occluder[];
  lights: LightSpot[];
  waterTiles: Array<{ x: number; y: number }>;
  objectSprites: Map<string, Phaser.GameObjects.Image>;
  /** Kachel-Index → Blümchen-Deko (zum Pflücken) */
  flowerSprites: Map<number, Phaser.GameObjects.Image[]>;
}

/** Sprite an Weltposition mit Ankerpunkt platzieren. */
export function placeSprite(scene: Phaser.Scene, key: string, x: number, y: number, depth: number) {
  const [ox, oy] = originOf(key);
  return scene.add.image(x, y, key).setOrigin(ox, oy).setScale(1 / RES).setDepth(depth);
}

export function buildMapView(scene: Phaser.Scene, map: WorldMap, season: Season): MapView {
  const worldW = map.width * TILE;
  const worldH = map.height * TILE;

  // 1) Wiese als kachelbare Textur
  scene.add
    .tileSprite(0, 0, worldW * RES, worldH * RES, 'grass')
    .setOrigin(0, 0)
    .setScale(1 / RES)
    .setDepth(DEPTH.ground);

  // 2) Geländeebenen (Dual-Grid-Tilemaps)
  const size = TILE * RES;
  terrainLayers(season).forEach((layer, i) => {
    const data = layerMasks(map.terrain, map.width, map.height, layer.members);
    if (!data.some((row) => row.some((v) => v >= 0))) return;
    const tilemap = scene.make.tilemap({ data, tileWidth: size, tileHeight: size });
    const tileset = tilemap.addTilesetImage(`terrain-${layer.key}`, `terrain-${layer.key}`, size, size, TILESET_PAD, TILESET_PAD * 2);
    if (!tileset) return;
    const tl = tilemap.createLayer(0, tileset, -TILE / 2, -TILE / 2);
    tl?.setScale(1 / RES).setDepth(DEPTH.ground + 1 + i);
  });

  // 3) Kleine Deko (Blümchen, Grasbüschel, Kiesel, Muscheln)
  const flowerSprites = new Map<number, Phaser.GameObjects.Image[]>();
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const t = terrainAt(map, x, y);
      const idx = y * map.width + x;
      const n = tileNoise(x, y, 1);
      const px = (x + 0.2 + tileNoise(x, y, 2) * 0.6) * TILE;
      const py = (y + 0.25 + tileNoise(x, y, 3) * 0.6) * TILE;
      if (map.grid.isBlocked(x, y) && t !== 'grass') continue;
      if (map.flowers[idx] && season !== 'winter') {
        const count = 2 + Math.floor(n * 3);
        for (let k = 0; k < count; k++) {
          const fx = (x + 0.15 + tileNoise(x, y, 10 + k) * 0.7) * TILE;
          const fy = (y + 0.2 + tileNoise(x, y, 20 + k) * 0.7) * TILE;
          const color = Math.floor(tileNoise(x, y, 30 + k) * FLOWER_COLORS.length);
          const img = placeSprite(scene, `flower-${color}`, fx, fy, DEPTH.decor + fy / 1000);
          const list = flowerSprites.get(idx) ?? [];
          list.push(img);
          flowerSprites.set(idx, list);
        }
      } else if (t === 'grass' && n < 0.22) {
        placeSprite(scene, 'tuft', px, py, DEPTH.decor);
      } else if (t === 'path' && n < 0.16) {
        placeSprite(scene, 'pebble', px, py, DEPTH.decor);
      }
    }
  }

  // 4) Objekte
  const occluders: Occluder[] = [];
  const lights: LightSpot[] = [];
  const objectSprites = new Map<string, Phaser.GameObjects.Image>();

  for (const obj of map.objects) {
    const sprite = placeObject(scene, obj, lights);
    if (!sprite) continue;
    objectSprites.set(obj.id, sprite);
    if (obj.kind === 'tree' || obj.kind === 'pine' || obj.kind === 'house') {
      const b = sprite.getBounds();
      const baseY = (obj.y + obj.h) * TILE;
      occluders.push({
        sprite,
        baseY,
        area: new Phaser.Geom.Rectangle(b.x + 8, b.y, b.width - 16, baseY - b.y - (obj.kind === 'house' ? 0 : TILE * 0.4)),
      });
    }
  }

  // 5) Wasserkacheln (für Glitzer)
  const waterTiles: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const t = terrainAt(map, x, y);
      if ((t === 'water' || t === 'sea') && map.grid.isBlocked(x, y)) waterTiles.push({ x, y });
    }
  }

  return { occluders, lights, waterTiles, objectSprites, flowerSprites };
}

function placeObject(scene: Phaser.Scene, obj: MapObject, lights: LightSpot[]): Phaser.GameObjects.Image | null {
  const cx = (obj.x + obj.w / 2) * TILE;
  const by = (obj.y + obj.h) * TILE;
  switch (obj.kind) {
    case 'tree': {
      const v = Math.floor(tileNoise(obj.x, obj.y, 5) * TREE_VARIANTS);
      const s = placeSprite(scene, `tree-${v}`, cx, by - 10, by - 10);
      if (tileNoise(obj.x, obj.y, 6) > 0.5) s.setFlipX(true);
      return s;
    }
    case 'pine': {
      const v = tileNoise(obj.x, obj.y, 5) > 0.5 ? 1 : 0;
      return placeSprite(scene, `pine-${v}`, cx, by - 10, by - 10);
    }
    case 'bush':
      return placeSprite(scene, 'bush', cx, by - 8, by - 8);
    case 'rock':
      return placeSprite(scene, 'rock', cx, by - 10, by - 10);
    case 'house': {
      const key = `house-${obj.variant ?? 'rose'}`;
      const s = placeSprite(scene, key, cx, by, by);
      for (const w of HOUSE_WINDOWS) lights.push({ x: cx + w.x, y: by + w.y, kind: 'window' });
      lights.push({ x: cx + HOUSE_HEART_WINDOW.x, y: by + HOUSE_HEART_WINDOW.y, kind: 'heart' });
      return s;
    }
    case 'plot': {
      placeSprite(scene, 'plot-area', cx, by, DEPTH.plotMarks);
      // Schild vorne mittig
      return placeSprite(scene, 'sign-plot', (obj.x + 2.5) * TILE, (obj.y + 3) * TILE - 10, (obj.y + 3) * TILE - 10);
    }
    case 'mailbox':
      return placeSprite(scene, 'mailbox', cx, by - 10, by - 10);
    case 'sellbox':
      return placeSprite(scene, 'sellbox', cx, by - 10, by - 10);
    case 'board':
      return placeSprite(scene, 'board', cx, by - 8, by - 8);
    case 'lantern': {
      const s = placeSprite(scene, 'lantern', cx, by - 12, by - 12);
      lights.push({ x: cx + LANTERN_LIGHT.x, y: by - 12 + LANTERN_LIGHT.y, kind: 'lantern' });
      return s;
    }
    case 'bench':
      return placeSprite(scene, 'bench', cx, by - 10, by - 10);
    case 'fountain':
      return placeSprite(scene, 'fountain', cx, by, by);
    case 'bridge': {
      placeSprite(scene, 'bridge-deck', cx, by, DEPTH.decor + 50);
      placeSprite(scene, 'bridge-rail', cx, by, by + 4);
      return null;
    }
  }
}
