/**
 * Materialien im weichen Cartoon-Look (Toon-Shading mit 3 Helligkeitsstufen).
 * Gleiche Farben teilen sich ein Material – spart Grafikspeicher.
 */
import * as THREE from 'three';

let gradient: THREE.DataTexture | null = null;

/** Verlauf für das Toon-Shading: dunkel → mittel → hell (weich, nicht zu hart) */
function gradientMap(): THREE.DataTexture {
  if (gradient) return gradient;
  const data = new Uint8Array([120, 120, 120, 255, 190, 190, 190, 255, 255, 255, 255, 255]);
  gradient = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat);
  gradient.minFilter = THREE.NearestFilter;
  gradient.magFilter = THREE.NearestFilter;
  gradient.needsUpdate = true;
  return gradient;
}

const cache = new Map<string, THREE.MeshToonMaterial>();

export interface ToonOptions {
  emissive?: string;
  emissiveIntensity?: number;
  transparent?: boolean;
  opacity?: number;
  side?: THREE.Side;
}

/** Geteiltes Toon-Material für eine Farbe. */
export function toon(color: string, opts: ToonOptions = {}): THREE.MeshToonMaterial {
  const key = `${color}|${opts.emissive ?? ''}|${opts.emissiveIntensity ?? ''}|${opts.transparent ? 1 : 0}|${opts.opacity ?? 1}|${opts.side ?? 0}`;
  let m = cache.get(key);
  if (!m) {
    m = new THREE.MeshToonMaterial({
      color: new THREE.Color(color),
      gradientMap: gradientMap(),
      emissive: opts.emissive ? new THREE.Color(opts.emissive) : new THREE.Color(0x000000),
      emissiveIntensity: opts.emissiveIntensity ?? 1,
      transparent: opts.transparent ?? false,
      opacity: opts.opacity ?? 1,
      side: opts.side ?? THREE.FrontSide,
    });
    cache.set(key, m);
  }
  return m;
}

/** Eigenes (nicht geteiltes) Toon-Material, z. B. zum Ausblenden einzelner Objekte. */
export function toonUnique(color: string, opts: ToonOptions = {}): THREE.MeshToonMaterial {
  return toon(color, opts).clone();
}

/** Mesh mit Schattenwurf erzeugen */
export function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, cast = true, receive = true): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = cast;
  m.receiveShadow = receive;
  return m;
}
