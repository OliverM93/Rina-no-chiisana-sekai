/**
 * 3D-Gelände: ein Höhenraster (Flussbett und Meer sind abgesenkt) mit einer
 * gemalten Textur. Die Textur entsteht mit der bewährten Dual-Grid-Technik
 * (runde Übergänge zwischen Wiese, Weg, Sand und Wasser).
 */
import * as THREE from 'three';
import { TILE } from '../config';
import { tileNoise } from '../core/rng';
import type { Season } from '../core/time';
import { isWaterTerrain, type Terrain, type WorldMap } from '../core/worldmap';
import { grassColors, layerMasks, renderGrassTexture, renderTerrainTileset, TILESET_PAD, terrainLayers } from '../gfx/terrain';
import { palette } from '../style/palette';

/** Texturpixel pro Kachel */
const PX = 48;
/** Unterteilungen des Höhenrasters pro Kachel */
const SUB = 6;

export const WATER_LEVEL = -0.14;

function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** Erzeugt eine Funktion, die für jede Stelle (in Kacheln) die Bodenhöhe liefert. */
export function heightField(map: WorldMap): (x: number, z: number) => number {
  const val = (tx: number, ty: number, f: (t: Terrain) => number) => {
    const cx = Math.min(map.width - 1, Math.max(0, tx));
    const cy = Math.min(map.height - 1, Math.max(0, ty));
    return f(map.terrain[cy * map.width + cx]);
  };
  const water = (t: Terrain) => (isWaterTerrain(t) ? 1 : 0);
  const deep = (t: Terrain) => (t === 'deep' ? 1 : t === 'sea' ? 0.4 : 0);
  const bilinear = (x: number, z: number, f: (t: Terrain) => number) => {
    const gx = x - 0.5;
    const gz = z - 0.5;
    const i = Math.floor(gx);
    const j = Math.floor(gz);
    const fx = gx - i;
    const fz = gz - j;
    const a = val(i, j, f);
    const b = val(i + 1, j, f);
    const c = val(i, j + 1, f);
    const d = val(i + 1, j + 1, f);
    return a * (1 - fx) * (1 - fz) + b * fx * (1 - fz) + c * (1 - fx) * fz + d * fx * fz;
  };
  return (x, z) => {
    const w = smooth(0.22, 0.7, bilinear(x, z, water));
    const dp = bilinear(x, z, deep);
    return -0.42 * w - 0.35 * dp * w;
  };
}

/** Malt die Bodentextur (Wiese + Geländeebenen + kleine Grasbüschel). */
function paintGround(map: WorldMap, season: Season): HTMLCanvasElement {
  const res = PX / TILE;
  const canvas = document.createElement('canvas');
  canvas.width = map.width * PX;
  canvas.height = map.height * PX;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const grass = renderGrassTexture(season, res);
  const pattern = ctx.createPattern(grass, 'repeat');
  ctx.fillStyle = pattern ?? grassColors(season).base;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const size = Math.round(TILE * res);
  const cell = size + TILESET_PAD * 2;
  for (const layer of terrainLayers(season)) {
    const tiles = renderTerrainTileset(layer, res);
    const masks = layerMasks(map.terrain, map.width, map.height, layer.members);
    masks.forEach((row, j) =>
      row.forEach((mask, i) => {
        if (mask < 0) return;
        const sx = (mask % 4) * cell + TILESET_PAD;
        const sy = Math.floor(mask / 4) * cell + TILESET_PAD;
        ctx.drawImage(tiles, sx, sy, size, size, (i - 0.5) * PX, (j - 0.5) * PX, PX, PX);
      }),
    );
  }

  // Kiesel auf Wegen
  ctx.fillStyle = palette.path.pebble;
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      if (map.terrain[y * map.width + x] !== 'path' || tileNoise(x, y, 1) > 0.25) continue;
      ctx.beginPath();
      ctx.ellipse((x + 0.3 + tileNoise(x, y, 2) * 0.4) * PX, (y + 0.3 + tileNoise(x, y, 3) * 0.4) * PX, 3, 2.2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  return canvas;
}

export interface Terrain3D {
  ground: THREE.Mesh;
  water: THREE.Mesh;
  heightAt: (x: number, z: number) => number;
  /** Wasseroberfläche leicht animieren */
  update: (t: number) => void;
}

export function buildTerrain(map: WorldMap, season: Season, anisotropy: number): Terrain3D {
  const W = map.width;
  const H = map.height;
  const heightAt = heightField(map);

  // Boden
  const geo = new THREE.PlaneGeometry(W, H, W * SUB, H * SUB);
  geo.rotateX(-Math.PI / 2);
  geo.translate(W / 2, 0, H / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) pos.setY(i, heightAt(pos.getX(i), pos.getZ(i)));
  geo.computeVertexNormals();

  const tex = new THREE.CanvasTexture(paintGround(map, season));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  const ground = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: tex }));
  ground.receiveShadow = true;

  // Wasseroberfläche (halbdurchsichtig, glänzt in der Sonne)
  const waterGeo = new THREE.PlaneGeometry(W + 80, H + 80, 1, 1);
  waterGeo.rotateX(-Math.PI / 2);
  waterGeo.translate(W / 2, WATER_LEVEL, H / 2);
  const waterMat = new THREE.MeshPhongMaterial({
    color: new THREE.Color(palette.water.base),
    transparent: true,
    opacity: 0.55,
    shininess: 90,
    specular: new THREE.Color('#ffffff'),
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.receiveShadow = true;

  // Meeresboden außerhalb der Karte, damit am Rand kein Loch ist
  const outer = new THREE.Mesh(
    new THREE.PlaneGeometry(W + 80, H + 80).rotateX(-Math.PI / 2).translate(W / 2, -0.8, H / 2),
    new THREE.MeshLambertMaterial({ color: new THREE.Color(palette.water.deep) }),
  );
  ground.add(outer);

  const update = (t: number) => {
    waterMat.opacity = 0.52 + Math.sin(t * 0.8) * 0.03;
  };

  return { ground, water, heightAt, update };
}
