/**
 * 3D-Vorschau einer Figur (z. B. im Charakter-Editor).
 */
import { useEffect, useRef } from 'preact/hooks';
import * as THREE from 'three';
import type { Appearance } from '../core/appearance';
import type { Season } from '../core/time';
import { Chibi3D } from '../world3d/models/chibi3d';

interface Props {
  appearance: Appearance;
  /** Drehwinkel in Radiant */
  angle: number;
  /** Jahreszeit im Dorf (für Schuhe „je nach Jahreszeit“) */
  season?: Season;
}

export function Preview3D({ appearance, angle, season = 'sommer' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const state = useRef<{ chibi: Chibi3D; renderer: THREE.WebGLRenderer; angle: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, devicePixelRatio));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight('#ffffff', '#c9ebb3', 1.6));
    const sun = new THREE.DirectionalLight('#fff4e0', 1.8);
    sun.position.set(2, 4, 4);
    scene.add(sun);
    const camera = new THREE.PerspectiveCamera(26, canvas.clientWidth / canvas.clientHeight, 0.1, 20);
    camera.position.set(0, 0.95, 3.1);
    camera.lookAt(0, 0.5, 0);
    const chibi = new Chibi3D(appearance, season);
    scene.add(chibi.root);
    state.current = { chibi, renderer, angle };
    let t = 0;
    let blinkIn = 2;
    let blink = 0;
    renderer.setAnimationLoop(() => {
      t += 1 / 60;
      blinkIn -= 1 / 60;
      if (blinkIn < 0) {
        blink = 0.14;
        blinkIn = 2 + Math.random() * 3;
      }
      blink -= 1 / 60;
      const st = state.current;
      if (!st) return;
      const r = chibi.root.rotation.y;
      chibi.root.rotation.y = r + (st.angle - r) * 0.15;
      chibi.pose({ step: 0, moving: false, running: false, sitting: false, blink: blink > 0, t });
      renderer.render(scene, camera);
    });
    return () => {
      renderer.setAnimationLoop(null);
      chibi.dispose();
      renderer.dispose();
      state.current = null;
    };
  }, []);

  useEffect(() => {
    state.current?.chibi.setAppearance(appearance);
  }, [appearance]);

  useEffect(() => {
    if (state.current) state.current.angle = angle;
  }, [angle]);

  return <canvas ref={canvasRef} class="preview-canvas" />;
}
