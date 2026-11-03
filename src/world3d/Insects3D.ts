/**
 * Insekten in der Welt: Jede Stunde schwirren andere Tiere herum – passend
 * zu Monat, Uhrzeit und Wetter. Mit dem Kescher kann Lina sie fangen.
 * Ganz entspannt: Die Tiere fliehen nicht.
 */
import * as THREE from 'three';
import { UNIT } from '../config';
import { pickSpecies } from '../core/catching';
import { terrainAt } from '../core/worldmap';
import type { InsectDef, InsectHabitat } from '../data/species';
import { hourRandom, insectsNow } from '../game/nature';
import type { Session } from '../game/session';
import { type CritterModel, makeCritter } from './models/critters';
import type { MapView3D } from './MapView3D';
import type { Tweens } from './tweens';
import { WATER_LEVEL } from './terrain3d';

const COUNT = 14;
const SCALE = 2.2;

interface Bug {
  key: string;
  def: InsectDef;
  model: CritterModel;
  anchor: THREE.Vector3;
  phase: number;
  /** auf dem Wasser (Wasserläufer) */
  onWater: boolean;
}

export class Insects3D {
  private bugs = new Map<string, Bug>();
  private caught = new Set<string>();
  private slot = '';
  private spots: Record<InsectHabitat, THREE.Vector3[]>;
  private time = 0;

  constructor(
    private readonly scene: THREE.Scene,
    private readonly session: Session,
    private readonly view: MapView3D,
    private readonly tweens: Tweens,
  ) {
    this.spots = this.collectSpots();
  }

  private collectSpots(): Record<InsectHabitat, THREE.Vector3[]> {
    const map = this.session.map;
    const out: Record<InsectHabitat, THREE.Vector3[]> = { blumen: [], baum: [], wiese: [], wasser: [], strand: [], felsen: [] };
    for (const idx of this.view.flowers.keys()) {
      const x = idx % map.width;
      const y = Math.floor(idx / map.width);
      out.blumen.push(new THREE.Vector3(x + 0.5, 0.32, y + 0.5));
    }
    for (const o of map.objects) {
      if (o.kind === 'tree') out.baum.push(new THREE.Vector3(o.x + 0.5, 0.55, o.y + 0.5 + 0.2));
      if (o.kind === 'rock') out.felsen.push(new THREE.Vector3(o.x + 0.5, 0.02, o.y + 1.05));
    }
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const t = terrainAt(map, x, y);
        if (t === 'grass' && !map.grid.isBlocked(x, y)) {
          const nearRiver = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => terrainAt(map, x + dx, y + dy) === 'water');
          if (nearRiver) out.wasser.push(new THREE.Vector3(x + 0.5, 0.45, y + 0.5));
          else if ((x * 7 + y * 13) % 5 === 0) out.wiese.push(new THREE.Vector3(x + 0.5, 0.02, y + 0.5));
        }
        if (t === 'sand' && !map.grid.isBlocked(x, y) && (x * 3 + y) % 3 === 0) out.strand.push(new THREE.Vector3(x + 0.5, 0.02, y + 0.5));
      }
    }
    if (out.blumen.length === 0) out.blumen = out.wiese; // im Winter keine Wiesenblumen
    return out;
  }

  /** Neue Tiere zur vollen Stunde, bei Wetterwechsel oder neuem Tag */
  refresh(force = false) {
    const now = this.session.clock();
    const slot = `${this.session.today()}:${now.getHours()}:${this.session.weatherOverride ?? ''}`;
    if (!force && slot === this.slot) return;
    if (slot !== this.slot) this.caught.clear();
    this.slot = slot;
    for (const b of this.bugs.values()) b.model.group.removeFromParent();
    this.bugs.clear();
    const available = insectsNow(this.session);
    if (available.length === 0) return;
    const rnd = hourRandom(this.session, 'insekten');
    for (let i = 0; i < COUNT; i++) {
      const def = pickSpecies(available, rnd());
      const spotList = def ? this.spots[def.habitat] : [];
      const r = rnd();
      if (!def || spotList.length === 0) continue;
      const key = `${slot}:${i}`;
      if (this.caught.has(key)) continue;
      const anchor = spotList[Math.floor(r * spotList.length)].clone();
      const onWater = def.shape === 'wasserlaeufer';
      if (onWater) {
        // aufs Wasser neben dem Ufer
        const map = this.session.map;
        for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          if (terrainAt(map, Math.floor(anchor.x) + dx, Math.floor(anchor.z) + dz) === 'water') {
            anchor.set(anchor.x + dx * 0.8, WATER_LEVEL + 0.01, anchor.z + dz * 0.8);
            break;
          }
        }
      } else if (!def.shape.match(/falter|biene|libelle|gluehwurm/)) {
        anchor.y = def.habitat === 'baum' ? anchor.y : Math.max(0, this.view.terrain.heightAt(anchor.x, anchor.z)) + 0.01;
      }
      const model = makeCritter(def);
      model.group.scale.setScalar(SCALE);
      model.group.position.copy(anchor);
      this.scene.add(model.group);
      this.bugs.set(key, { key, def, model, anchor, phase: rnd() * 10, onWater });
    }
  }

  update(dt: number, night: number) {
    this.time += dt;
    const t = this.time;
    for (const b of this.bugs.values()) {
      const g = b.model.group;
      const ph = b.phase;
      if (b.model.flying) {
        const r = b.def.shape === 'libelle' ? 0.5 : 0.28;
        const a = t * (b.def.shape === 'libelle' ? 0.9 : 1.3) + ph;
        g.position.set(b.anchor.x + Math.cos(a) * r, b.anchor.y + Math.sin(t * 2.3 + ph) * 0.08, b.anchor.z + Math.sin(a * 1.3) * r * 0.7);
        g.rotation.y = -a + Math.PI;
        const flap = Math.sin(t * (b.def.shape === 'biene' || b.def.shape === 'libelle' ? 40 : 14) + ph) * 0.7;
        b.model.wings.forEach((w, i) => (w.rotation.z = (i % 2 === 0 ? -1 : 1) * flap));
      } else if (b.def.habitat !== 'baum') {
        // gemütliches Krabbeln im kleinen Kreis
        const a = t * 0.25 + ph;
        const r = b.def.shape === 'schnecke' ? 0.06 : 0.22;
        g.position.x = b.anchor.x + Math.cos(a) * r;
        g.position.z = b.anchor.z + Math.sin(a) * r;
        g.rotation.y = b.def.shape === 'krabbe' ? -a : -a - Math.PI / 2;
        if (b.def.shape === 'heuschrecke') g.position.y = b.anchor.y + Math.max(0, Math.sin(t * 1.7 + ph)) * 0.12;
      } else {
        g.position.y = b.anchor.y + Math.sin(t * 0.4 + ph) * 0.15;
      }
      if (b.model.glow) {
        const m = b.model.glow.material as THREE.MeshBasicMaterial;
        m.opacity = (0.4 + 0.6 * Math.max(0, Math.sin(t * 2 + ph))) * (0.3 + night * 0.7);
      }
    }
  }

  /** Nächstes Insekt in Reichweite (vor Lina). Weltkoordinaten. */
  near(px: number, py: number, fx: number, fy: number): string | null {
    let best: string | null = null;
    let bestD = 1.5;
    const lx = px * UNIT;
    const lz = py * UNIT;
    for (const b of this.bugs.values()) {
      const dx = b.model.group.position.x - lx;
      const dz = b.model.group.position.z - lz;
      const d = Math.hypot(dx, dz);
      if (d < bestD && (d < 0.45 || dx * fx + dz * fy > d * 0.2)) {
        best = b.key;
        bestD = d;
      }
    }
    return best;
  }

  position(key: string): THREE.Vector3 | null {
    return this.bugs.get(key)?.model.group.position.clone() ?? null;
  }

  /** Fangen: verschwindet ins Netz */
  take(key: string, to: THREE.Vector3): InsectDef | null {
    const b = this.bugs.get(key);
    if (!b) return null;
    this.bugs.delete(key);
    this.caught.add(key);
    const g = b.model.group;
    const from = g.position.clone();
    this.tweens.add(300, (k) => {
      g.position.lerpVectors(from, to, k);
      g.scale.setScalar(SCALE * (1 - k));
    }, () => g.removeFromParent());
    return b.def;
  }

  get debugList() {
    return [...this.bugs.values()].map((b) => ({ key: b.key, id: b.def.id, x: b.model.group.position.x, z: b.model.group.position.z }));
  }
}
