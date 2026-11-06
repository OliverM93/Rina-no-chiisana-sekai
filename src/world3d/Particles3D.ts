/**
 * Kleine Partikel-Effekte: Staubwölkchen beim Rennen, Spritzer beim Angeln,
 * Funkeln beim Aufheben, Herzchen, Erdklumpen beim Graben, Konfetti beim Bauen –
 * und Glühwürmchen in Sommernächten.
 *
 * Alles läuft über wenige InstancedMeshes (eins pro Form) mit einem festen Vorrat,
 * damit es auch auf schwächeren Laptops flüssig bleibt.
 */
import * as THREE from 'three';
import type { FxKind } from '../game/session';
import { palette } from '../style/palette';

type Shape = 'kugel' | 'stern' | 'herz' | 'schnipsel';

interface Particle {
  shape: Shape;
  p: THREE.Vector3;
  v: THREE.Vector3;
  age: number;
  life: number;
  size: number;
  gravity: number;
  spin: number;
  /** 0 = gleich groß, 1 = wächst erst, dann weg (Staub) */
  puff: boolean;
  sway: number;
  color: THREE.Color;
}

interface Recipe {
  count: number;
  shape: Shape;
  colors: readonly string[];
  size: [number, number];
  /** Startgeschwindigkeit: seitlich, nach oben (min, max) */
  out: number;
  up: [number, number];
  life: [number, number];
  gravity: number;
  spin?: number;
  puff?: boolean;
  sway?: number;
  /** Start-Höhe über dem Boden */
  lift?: number;
}

const RECIPES: Record<FxKind, Recipe> = {
  staub: { count: 4, shape: 'kugel', colors: ['#efe5cf', '#e4d6b8'], size: [0.06, 0.1], out: 0.4, up: [0.1, 0.3], life: [0.45, 0.65], gravity: 0, puff: true, lift: 0.05 },
  platsch: { count: 18, shape: 'kugel', colors: ['#cfeaf7', '#ffffff', '#a9d6ee'], size: [0.04, 0.065], out: 0.9, up: [1.6, 2.6], life: [0.6, 0.85], gravity: 6.5 },
  funkeln: { count: 12, shape: 'stern', colors: ['#fff3a8', '#ffffff', '#ffd76a'], size: [0.06, 0.1], out: 1.0, up: [0.6, 1.3], life: [0.8, 1.1], gravity: 0.6, spin: 6, lift: 0.55 },
  herzen: { count: 5, shape: 'herz', colors: ['#ff8fb1', '#ff6f9c', '#ffb3c9'], size: [0.13, 0.18], out: 0.35, up: [0.5, 0.8], life: [1.3, 1.7], gravity: 0, sway: 1, lift: 1.4 },
  erde: { count: 14, shape: 'kugel', colors: ['#8a6244', '#a27a55', '#6e4c34'], size: [0.045, 0.075], out: 1.0, up: [1.3, 2.1], life: [0.55, 0.75], gravity: 7 },
  atem: { count: 3, shape: 'kugel', colors: [palette.snow.breath, palette.snow.base], size: [0.018, 0.03], out: 0.05, up: [0.04, 0.12], life: [0.8, 1.1], gravity: -0.05, puff: true },
  konfetti: { count: 26, shape: 'schnipsel', colors: ['#ff9ec2', '#ffe17a', '#9fe0c9', '#a9c8ff', '#d6b3ff'], size: [0.055, 0.075], out: 1.3, up: [1.6, 2.4], life: [1.2, 1.6], gravity: 2.6, spin: 9, sway: 0.6, lift: 1.1 },
};

const MAX = { kugel: 160, stern: 60, herz: 40, schnipsel: 90 } as const;
const FIREFLIES = 36;

function heartGeometry(): THREE.ShapeGeometry {
  const s = new THREE.Shape();
  s.moveTo(0, -0.5);
  s.bezierCurveTo(-0.1, -0.35, -0.55, -0.1, -0.5, 0.2);
  s.bezierCurveTo(-0.45, 0.5, -0.1, 0.55, 0, 0.3);
  s.bezierCurveTo(0.1, 0.55, 0.45, 0.5, 0.5, 0.2);
  s.bezierCurveTo(0.55, -0.1, 0.1, -0.35, 0, -0.5);
  return new THREE.ShapeGeometry(s, 6);
}

export class Particles3D {
  private meshes: Record<Shape, THREE.InstancedMesh>;
  private live: Particle[] = [];
  private flies: THREE.InstancedMesh;
  private flyState: Array<{ x: number; z: number; y: number; phase: number; speed: number }> = [];
  private flyLevel = 0;
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private e = new THREE.Euler();
  private s = new THREE.Vector3();
  private pos = new THREE.Vector3();

  constructor(scene: THREE.Scene) {
    const mat = () => new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, depthWrite: false, side: THREE.DoubleSide });
    const make = (geo: THREE.BufferGeometry, n: number) => {
      const im = new THREE.InstancedMesh(geo, mat(), n);
      im.frustumCulled = false;
      im.count = 0;
      im.setColorAt(0, new THREE.Color('#ffffff'));
      scene.add(im);
      return im;
    };
    this.meshes = {
      kugel: make(new THREE.SphereGeometry(1, 6, 5), MAX.kugel),
      stern: make(new THREE.OctahedronGeometry(1, 0), MAX.stern),
      herz: make(heartGeometry(), MAX.herz),
      schnipsel: make(new THREE.PlaneGeometry(1, 0.6), MAX.schnipsel),
    };
    // Glühwürmchen: leuchtende Pünktchen, additiv gemischt
    this.flies = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.04, 6, 5),
      new THREE.MeshBasicMaterial({ color: '#e9ff8a', transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }),
      FIREFLIES,
    );
    this.flies.frustumCulled = false;
    this.flies.visible = false;
    for (let i = 0; i < FIREFLIES; i++) {
      this.flyState.push({ x: (Math.random() - 0.5) * 20, z: (Math.random() - 0.5) * 14, y: 0.3 + Math.random() * 1.2, phase: Math.random() * 10, speed: 0.4 + Math.random() * 0.6 });
    }
    scene.add(this.flies);
  }

  /** Effekt an einer Stelle (3D-Koordinaten in Kacheln) auslösen; `drift` = zusätzliche Geschwindigkeit (z. B. Atem nach vorn) */
  burst(kind: FxKind, at: THREE.Vector3, drift?: THREE.Vector3) {
    const r = RECIPES[kind];
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    for (let i = 0; i < r.count; i++) {
      if (this.live.filter((p) => p.shape === r.shape).length >= MAX[r.shape]) break;
      const a = Math.random() * Math.PI * 2;
      const out = r.out * (0.4 + Math.random() * 0.6);
      this.live.push({
        shape: r.shape,
        p: new THREE.Vector3(at.x + Math.cos(a) * 0.05, at.y + (r.lift ?? 0), at.z + Math.sin(a) * 0.05),
        v: new THREE.Vector3(Math.cos(a) * out + (drift?.x ?? 0), rand(r.up[0], r.up[1]) + (drift?.y ?? 0), Math.sin(a) * out + (drift?.z ?? 0)),
        age: 0,
        life: rand(r.life[0], r.life[1]),
        size: rand(r.size[0], r.size[1]),
        gravity: r.gravity,
        spin: (Math.random() - 0.5) * (r.spin ?? 0),
        puff: !!r.puff,
        sway: (r.sway ?? 0) * (Math.random() < 0.5 ? -1 : 1),
        color: new THREE.Color(r.colors[i % r.colors.length]),
      });
    }
  }

  /**
   * `camera` = für Herzchen, die immer zur Kamera schauen; `fireflies` = 0..1
   * (Sommernacht draußen), `center` = Kamera-Ziel (Glühwürmchen schwirren dort).
   */
  update(dt: number, camera: THREE.Camera, center: THREE.Vector3, fireflies: number) {
    const counts: Record<Shape, number> = { kugel: 0, stern: 0, herz: 0, schnipsel: 0 };
    const t = performance.now() / 1000;
    this.live = this.live.filter((p) => (p.age += dt) < p.life);
    for (const p of this.live) {
      p.v.y -= p.gravity * dt;
      // Luftwiderstand: Staub & Herzen werden langsamer
      if (p.puff || p.shape === 'herz') p.v.multiplyScalar(Math.max(0, 1 - dt * 2.2));
      p.p.addScaledVector(p.v, dt);
      if (p.sway) p.p.x += Math.sin(p.age * 5 + p.spin) * p.sway * dt * 0.3;
      if (p.gravity > 0 && p.p.y < 0.02 && p.v.y < 0) {
        p.p.y = 0.02;
        p.v.set(p.v.x * 0.3, 0, p.v.z * 0.3);
      }
      const k = p.age / p.life;
      let scale = p.size;
      if (p.puff) scale *= 0.6 + k * 1.4;
      // gegen Ende kleiner werden (statt Durchsichtigkeit pro Teilchen)
      scale *= k > 0.6 ? 1 - (k - 0.6) / 0.4 : 1;
      if (p.shape === 'stern') scale *= 0.75 + Math.sin(p.age * 18) * 0.25;
      if (p.shape === 'herz') {
        this.q.copy(camera.quaternion);
        this.e.set(0, 0, Math.sin(p.age * 4) * 0.25);
        this.q.multiply(new THREE.Quaternion().setFromEuler(this.e));
      } else {
        this.e.set(p.age * p.spin, p.age * p.spin * 0.7, 0);
        this.q.setFromEuler(this.e);
      }
      this.s.set(scale, scale, scale);
      this.m.compose(p.p, this.q, this.s);
      const mesh = this.meshes[p.shape];
      const i = counts[p.shape]++;
      mesh.setMatrixAt(i, this.m);
      mesh.setColorAt(i, p.color);
    }
    for (const shape of Object.keys(this.meshes) as Shape[]) {
      const mesh = this.meshes[shape];
      mesh.count = counts[shape];
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    // Glühwürmchen blenden weich ein und aus
    this.flyLevel += (fireflies - this.flyLevel) * Math.min(1, dt * 0.8);
    this.flies.visible = this.flyLevel > 0.02;
    if (this.flies.visible) {
      (this.flies.material as THREE.MeshBasicMaterial).opacity = 0.95 * this.flyLevel;
      this.q.identity();
      this.flyState.forEach((f, i) => {
        const glow = Math.max(0, Math.sin(t * f.speed * 2 + f.phase));
        this.pos.set(
          center.x + f.x + Math.sin(t * f.speed + f.phase) * 0.8,
          f.y + Math.sin(t * f.speed * 1.7 + f.phase) * 0.25,
          center.z + f.z + Math.cos(t * f.speed * 0.8 + f.phase) * 0.8,
        );
        const sc = 0.3 + glow * 0.9;
        this.s.set(sc, sc, sc);
        this.m.compose(this.pos, this.q, this.s);
        this.flies.setMatrixAt(i, this.m);
      });
      this.flies.instanceMatrix.needsUpdate = true;
    }
  }

  /** Drinnen (oder beim Szenenwechsel) alles Laufende wegräumen */
  clear() {
    this.live = [];
  }
}
