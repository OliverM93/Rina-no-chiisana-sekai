/**
 * Pflanzen in Linas Beet (Darstellung). Der Zustand steht im Spielstand
 * (`world.garden`), hier wird er nur gezeichnet.
 */
import * as THREE from 'three';
import { isWatered, spotKey } from '../core/garden';
import type { Tile } from '../core/grid';
import type { MapObject } from '../core/worldmap';
import { GARDEN_FLOWER } from '../data/items';
import type { Session } from '../game/session';
import { makePlant, makeWetPatch } from './models/critters';
import type { Tweens } from './tweens';

export class Garden3D {
  private group = new THREE.Group();
  private beds: MapObject[];
  private signature = '';
  /** Weitere Pflanzplätze (Hochbeete im Garten): Kachel + Höhe der Erde */
  extraSpots: () => Array<{ x: number; y: number; h: number }> = () => [];

  constructor(
    scene: THREE.Scene,
    private readonly session: Session,
    private readonly tweens: Tweens,
  ) {
    this.beds = session.map.objects.filter((o) => o.kind === 'beet');
    scene.add(this.group);
  }

  /** Ist diese Kachel ein Beet-Platz? */
  isSpot(t: Tile): boolean {
    return this.beds.some((b) => t.x >= b.x && t.x < b.x + b.w && t.y >= b.y && t.y < b.y + b.h) || this.extraSpots().some((s) => s.x === t.x && s.y === t.y);
  }

  refresh(force = false) {
    const data = this.session.data;
    if (!data) return;
    const day = this.session.today();
    const extra = this.extraSpots();
    const sig = JSON.stringify(data.world.garden) + day + JSON.stringify(extra);
    if (!force && sig === this.signature) return;
    this.signature = sig;
    this.group.clear();
    const spots: Array<{ x: number; y: number; h: number }> = [...extra];
    for (const b of this.beds) for (let x = b.x; x < b.x + b.w; x++) for (let y = b.y; y < b.y + b.h; y++) spots.push({ x, y, h: 0.12 });
    {
      for (const { x, y, h } of spots) {
        {
          const p = data.world.garden[spotKey(x, y)];
          if (!p) continue;
          const gf = GARDEN_FLOWER[p.flower];
          const node = new THREE.Group();
          node.position.set(x + 0.5, h, y + 0.5);
          if (isWatered(p, day)) {
            const wet = makeWetPatch();
            wet.position.y = 0.005;
            node.add(wet);
          }
          const plant = makePlant(p.stage, gf?.color ?? '#ffffff', gf?.center ?? '#f7d26a', gf?.species ?? p.flower);
          plant.scale.setScalar(1.5);
          node.add(plant);
          this.group.add(node);
        }
      }
    }
  }

  /** Kleiner Hüpfer, wenn gepflanzt/gegossen/gepflückt wurde */
  bounce(t: Tile) {
    this.refresh(true);
    const node = this.group.children.find((c) => Math.floor(c.position.x) === t.x && Math.floor(c.position.z) === t.y);
    if (node) this.tweens.add(260, (k) => node.scale.setScalar(1 + Math.sin(k * Math.PI) * 0.25));
  }
}
