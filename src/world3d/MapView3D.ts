/**
 * Baut die sichtbare 3D-Welt aus dem Kartenmodell: Gelände, Bäume, Häuser,
 * Requisiten, Blumen. Liefert Referenzen für Interaktion, Licht & Effekte.
 */
import * as THREE from 'three';
import { tileNoise } from '../core/rng';
import type { Season } from '../core/time';
import { type MapObject, type WorldMap } from '../core/worldmap';
import { palette } from '../style/palette';
import {
  type HouseModel,
  makeBench,
  makeBoard,
  makeBridge,
  makeFountain,
  makeHouse,
  makeLantern,
  makeMailbox,
  makePlotMarks,
  makeSellbox,
  makeWorkbench,
  makeBistro,
  makePraxis,
  makeSign,
  makeBeet,
} from './models/buildings';
import { FLOWER_COLORS, makeBush, makeFlower, makePine, makeRock, makeTree, type TreeModel } from './models/nature';
import { buildTerrain, type Terrain3D } from './terrain3d';

const ROOF: Record<string, string> = {
  rose: palette.roof.rose,
  coral: palette.roof.coral,
  mint: palette.roof.mint,
  lilac: palette.roof.lilac,
  butter: palette.roof.butter,
  sky: palette.roof.sky,
};

export interface MapView3D {
  terrain: Terrain3D;
  /** Objekt-ID → 3D-Knoten */
  nodes: Map<string, THREE.Object3D>;
  trees: Map<string, TreeModel>;
  /** Kachel-Index → Blümchen */
  flowers: Map<number, THREE.Object3D[]>;
  /** Weltpositionen der Laternenlampen */
  lanterns: THREE.Vector3[];
  /** Weltpositionen erleuchteter Fenster */
  windows: THREE.Vector3[];
  mailbox: { flag: THREE.Object3D; letter: THREE.Object3D } | null;
  /** Objekte, die Lina verdecken können (für Ausblenden) */
  occluders: Array<{ id: string; node: THREE.Object3D; x: number; z: number; w: number; h: number }>;
}

/** Mitte der Grundfläche in Kachelkoordinaten */
export function footprintCenter(o: MapObject): { x: number; z: number } {
  return { x: o.x + o.w / 2, z: o.y + o.h / 2 };
}

export function buildMapView3D(scene: THREE.Scene, map: WorldMap, season: Season, anisotropy: number): MapView3D {
  const terrain = buildTerrain(map, season, anisotropy);
  scene.add(terrain.ground, terrain.water);

  const nodes = new Map<string, THREE.Object3D>();
  const trees = new Map<string, TreeModel>();
  const flowers = new Map<number, THREE.Object3D[]>();
  const lanterns: THREE.Vector3[] = [];
  const windows: THREE.Vector3[] = [];
  const occluders: MapView3D['occluders'] = [];
  let mailbox: MapView3D['mailbox'] = null;

  for (const o of map.objects) {
    const c = footprintCenter(o);
    const seed = Math.floor(tileNoise(o.x, o.y, 9) * 1e6);
    let node: THREE.Object3D;
    switch (o.kind) {
      case 'tree': {
        const t = makeTree(season, seed);
        trees.set(o.id, t);
        node = t.group;
        occluders.push({ id: o.id, node, x: c.x, z: c.z, w: 1.6, h: 1 });
        break;
      }
      case 'pine':
        node = makePine(season, seed).group;
        occluders.push({ id: o.id, node, x: c.x, z: c.z, w: 1.4, h: 1 });
        break;
      case 'bush':
        node = makeBush(season, seed);
        break;
      case 'rock':
        node = makeRock(seed);
        break;
      case 'house': {
        const h: HouseModel = makeHouse(ROOF[o.variant ?? 'rose'] ?? palette.roof.rose);
        node = h.group;
        for (const w of h.windows) windows.push(w.clone().add(new THREE.Vector3(c.x, 0, c.z)));
        occluders.push({ id: o.id, node, x: c.x, z: c.z, w: o.w, h: o.h });
        break;
      }
      case 'praxis':
      case 'bistro': {
        const h: HouseModel = o.kind === 'praxis' ? makePraxis() : makeBistro();
        node = h.group;
        for (const w of h.windows) windows.push(w.clone().add(new THREE.Vector3(c.x, 0, c.z)));
        occluders.push({ id: o.id, node, x: c.x, z: c.z, w: o.w, h: o.h });
        break;
      }
      case 'plot': {
        node = new THREE.Group();
        node.add(makePlotMarks(o.w, o.h));
        const sign = makeSign('Bauplatz');
        sign.position.set(0, 0, o.h / 2 - 0.5);
        node.add(sign);
        break;
      }
      case 'mailbox': {
        const m = makeMailbox();
        mailbox = { flag: m.flag, letter: m.letter };
        node = m.group;
        break;
      }
      case 'sellbox':
        node = makeSellbox();
        break;
      case 'workbench':
        node = makeWorkbench();
        break;
      case 'board':
        node = makeBoard();
        break;
      case 'lantern':
        node = makeLantern();
        lanterns.push(new THREE.Vector3(c.x, 1.68, c.z));
        break;
      case 'bench':
        node = makeBench();
        break;
      case 'fountain':
        node = makeFountain();
        break;
      case 'beet':
        node = makeBeet(o.w, o.h);
        break;
      case 'bridge':
        node = makeBridge();
        node.position.y = 0.02;
        break;
    }
    node.position.x = c.x;
    node.position.z = c.z;
    scene.add(node);
    nodes.set(o.id, node);
  }

  // Blümchen auf den Blumenwiesen (im Winter keine)
  if (season !== 'winter') {
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const idx = y * map.width + x;
        if (!map.flowers[idx]) continue;
        const list: THREE.Object3D[] = [];
        const count = 2 + Math.floor(tileNoise(x, y, 1) * 3);
        for (let k = 0; k < count; k++) {
          const f = makeFlower(FLOWER_COLORS[Math.floor(tileNoise(x, y, 30 + k) * FLOWER_COLORS.length)]);
          f.position.set(x + 0.15 + tileNoise(x, y, 10 + k) * 0.7, 0, y + 0.15 + tileNoise(x, y, 20 + k) * 0.7);
          f.scale.setScalar(1.4);
          scene.add(f);
          list.push(f);
        }
        flowers.set(idx, list);
      }
    }
  }

  return { terrain, nodes, trees, flowers, lanterns, windows, mailbox, occluders };
}
