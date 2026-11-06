/**
 * Fußspuren im Schnee: Lina (und Winston) hinterlassen kleine Abdrücke, die nach
 * einer Weile verblassen. Ein InstancedMesh mit festem Vorrat (Ringpuffer).
 */
import * as THREE from 'three';
import { palette } from '../style/palette';

const MAX = 140;
/** So lange bleibt eine Spur sichtbar (Sekunden), die letzten Sekunden blendet sie aus */
const LIFE = 24;
const FADE = 6;

export class Footprints3D {
  private mesh: THREE.InstancedMesh;
  private born = new Float32Array(MAX).fill(-1e9);
  private base: THREE.Matrix4[] = [];
  private next = 0;
  private time = 0;
  private readonly tmp = new THREE.Matrix4();
  private readonly color = new THREE.Color();
  private readonly snow = new THREE.Color(palette.snow.print);
  private readonly ground = new THREE.Color(palette.snow.base);

  constructor(scene: THREE.Scene) {
    const geo = new THREE.CircleGeometry(0.5, 10);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshLambertMaterial({ color: palette.snow.base, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    this.mesh = new THREE.InstancedMesh(geo, mat, MAX);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 1;
    const zero = new THREE.Matrix4().makeScale(0, 0, 0);
    for (let i = 0; i < MAX; i++) {
      this.mesh.setMatrixAt(i, zero);
      this.mesh.setColorAt(i, this.ground);
      this.base.push(new THREE.Matrix4());
    }
    scene.add(this.mesh);
  }

  /**
   * Ein Abdruck (in Kacheln, 3D). `angle` = Laufrichtung (rad, um Y), `side` = links/rechts (-1/1),
   * `size` = 1 für Lina, kleiner für Winstons Pfoten.
   */
  add(x: number, y: number, z: number, angle: number, side: number, size = 1) {
    const i = this.next;
    this.next = (this.next + 1) % MAX;
    const off = 0.09 * side * size;
    const px = x + Math.cos(angle) * off;
    const pz = z - Math.sin(angle) * off;
    const m = this.base[i];
    m.compose(
      new THREE.Vector3(px, y + 0.012, pz),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle),
      new THREE.Vector3(0.11 * size, 1, 0.17 * size),
    );
    this.mesh.setMatrixAt(i, m);
    this.born[i] = this.time;
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  update(dt: number, visible: boolean) {
    this.time += dt;
    this.mesh.visible = visible;
    if (!visible) return;
    let dirty = false;
    for (let i = 0; i < MAX; i++) {
      const age = this.time - this.born[i];
      if (age < 0 || age > LIFE + 1) continue;
      // verblassen: Farbe geht vom Schatten-Blau zurück zu Schnee-Weiß
      const k = age < LIFE - FADE ? 1 : Math.max(0, (LIFE - age) / FADE);
      this.color.copy(this.ground).lerp(this.snow, k);
      this.mesh.setColorAt(i, this.color);
      if (age > LIFE) {
        this.tmp.makeScale(0, 0, 0);
        this.mesh.setMatrixAt(i, this.tmp);
        this.born[i] = -1e9;
        this.mesh.instanceMatrix.needsUpdate = true;
      }
      dirty = true;
    }
    if (dirty && this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  clear() {
    this.born.fill(-1e9);
    this.tmp.makeScale(0, 0, 0);
    for (let i = 0; i < MAX; i++) this.mesh.setMatrixAt(i, this.tmp);
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}
