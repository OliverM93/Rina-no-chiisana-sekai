/**
 * Entwickler-Galerie in 3D: Figuren und Modelle nebeneinander.
 * Aufruf: http://localhost:5173/gallery.html  (?ansicht=figuren|natur|gebaeude|kleidung, ?winkel=0..360)
 */
import * as THREE from 'three';
import type { Season } from '../core/time';
import { DEFAULT_LINA, type Appearance } from '../core/appearance';
import { GISELA } from '../data/npcs/gisela';
import { LOOKS, OLI_WARDROBE } from '../data/npcs/looks';
import { palette } from '../style/palette';
import { makeBench, makeBoard, makeBridge, makeFountain, makeHouse, makeLantern, makeMailbox, makePlotMarks, makeSellbox, makeSign, makeWorkbench } from '../world3d/models/buildings';
import { Chibi3D } from '../world3d/models/chibi3d';
import { Dog3D } from '../world3d/models/dog';
import { makeBush, makeFlower, makePine, makeRock, makeTree, FLOWER_COLORS } from '../world3d/models/nature';

const canvas = document.getElementById('view') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(2, devicePixelRatio));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#cfe9f7');
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
scene.add(new THREE.HemisphereLight('#ffffff', '#b9d99c', 1.4));
const sun = new THREE.DirectionalLight('#fff4e0', 2.2);
sun.position.set(4, 8, 6);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 });
scene.add(sun);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshLambertMaterial({ color: palette.grass.base }));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const params = new URLSearchParams(location.search);
const views = ['figuren', 'natur', 'gebaeude', 'kleidung'];
let view = params.get('ansicht') ?? 'figuren';
let angle = Number(params.get('winkel') ?? 0) * (Math.PI / 180);
const content = new THREE.Group();
scene.add(content);

const people: Array<[string, Appearance]> = [
  ['Lina', { ...DEFAULT_LINA, faceShape: (params.get('gesicht') as Appearance['faceShape'] | null) ?? DEFAULT_LINA.faceShape }],
  ['Gisela', LOOKS.gisela],
  ['Olaf', LOOKS.olaf],
  ['Christin', LOOKS.christin],
  ['Lars', LOOKS.lars],
  ['Jens', LOOKS.jens],
  ['Thalia', LOOKS.thalia],
  ['Oli', LOOKS.oli],
];
const chibis: Chibi3D[] = [];
const dogs: Array<{ dog: Dog3D; rest: 0 | 1 | 2; moving: boolean; digging?: boolean }> = [];

function build() {
  content.clear();
  chibis.length = 0;
  dogs.length = 0;
  (document.getElementById('label') as HTMLElement).textContent = view;
  if (view === 'kleidung') {
    // Linas Lieblingsteile und Olis Kleiderschrank
    const outfits: Array<[Appearance, string]> = [
      ...(['hawaii', 'sport', 'radierkopf', 'sweatshirt'] as const).map((o): [Appearance, string] => [{ ...DEFAULT_LINA, outfit: o }, '']),
      ...OLI_WARDROBE.filter((_, i) => i % 2 === 0 || i === 5).map((w, i): [Appearance, string] => [{ ...LOOKS.oli, ...w }, `2026-03-0${i + 1}`]),
    ];
    outfits.forEach(([a, day], i) => {
      const c = new Chibi3D(a, 'herbst', day);
      c.root.position.set((i - (outfits.length - 1) / 2) * 0.7, 0, 0);
      content.add(c.root);
      chibis.push(c);
    });
    const zoom = Number(params.get('zoom') ?? 1);
    camera.position.set(Math.sin(angle) * 5 * zoom, 0.9 + 0.6 * zoom, Math.cos(angle) * 5 * zoom);
    camera.lookAt(0, 0.45, 0);
  } else if (view === 'figuren') {
    people.forEach(([, a], i) => {
      const c = new Chibi3D(a, (params.get('jahreszeit') as Season | null) ?? 'sommer');
      c.root.position.set((i - (people.length - 1) / 2) * 0.8, 0, 0);
      content.add(c.root);
      chibis.push(c);
    });
    // Winston: läuft, steht, sitzt, liegt, buddelt
    ([[0, true], [0, false], [1, false], [2, false], [0, false, true]] as const).forEach(([rest, moving, digging], i) => {
      const dog = new Dog3D();
      dog.root.position.set(-1.6 + i * 0.8, 0, 1.1);
      dog.root.rotation.y = i === 0 ? Math.PI / 2 : 0.4;
      content.add(dog.root);
      dogs.push({ dog, rest, moving, digging });
    });
    const sitter = new Chibi3D(GISELA.appearance);
    const bench = makeBench();
    bench.position.set(0, 0, -1.6);
    sitter.root.position.set(-0.3, 0.37, -1.55);
    content.add(bench, sitter.root);
    sitter.pose({ step: 0, moving: false, running: false, sitting: true, blink: false, t: 0 });
    const zoom = Number(params.get('zoom') ?? 1);
    const lookX = Number(params.get('x') ?? 0);
    const lookY = Number(params.get('y') ?? 0.5);
    camera.position.set(lookX + Math.sin(angle) * 7.6 * zoom, lookY - 0.5 + 2.4 * zoom, Math.cos(angle) * 7.6 * zoom);
    camera.lookAt(lookX, lookY, -0.3);
  } else if (view === 'natur') {
    const items: THREE.Object3D[] = [];
    for (const s of ['fruehling', 'sommer', 'herbst', 'winter'] as const) items.push(makeTree(s, 3).group);
    items.push(makePine('sommer', 1).group, makePine('winter', 2).group, makeBush('herbst', 4), makeRock(5));
    items.forEach((o, i) => {
      o.position.set((i % 4) * 2.2 - 3.3, 0, Math.floor(i / 4) * 2.4 - 1.2);
      content.add(o);
    });
    FLOWER_COLORS.forEach((c, i) => {
      const f = makeFlower(c);
      f.position.set(-1 + i * 0.4, 0, 2.6);
      content.add(f);
    });
    camera.position.set(Math.sin(angle) * 13, 6, Math.cos(angle) * 13);
    camera.lookAt(0, 0.8, 0);
  } else {
    const house = makeHouse(palette.roof.rose).group;
    house.position.set(-3, 0, -1.5);
    const house2 = makeHouse(palette.roof.lilac).group;
    house2.position.set(3, 0, -1.5);
    const mb = makeMailbox();
    mb.group.position.set(-0.3, 0, 1);
    const props: Array<[THREE.Object3D, number, number]> = [
      [mb.group, -0.3, 1],
      [makeSellbox(), 0.6, 1],
      [makeLantern(), 1.5, 1],
      [makeBench(), 3.2, 1.2],
      [makeBoard(), -2.8, 1.5],
      [makeFountain(), -0.5, 3.6],
      [makeBridge(), 3.2, 3.5],
      [makeSign('Bauplatz'), 5.5, 1.2],
      [makeWorkbench(), 1.2, 3.4],
      [makePlotMarks(5, 3), 6.5, 2.5],
    ];
    content.add(house, house2);
    for (const [o, x, z] of props) {
      o.position.set(x, 0, z);
      content.add(o);
    }
    camera.position.set(Math.sin(angle) * 16, 9, Math.cos(angle) * 16 + 2);
    camera.lookAt(0.5, 0.6, 1);
  }
}

function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
addEventListener('keydown', (e) => {
  const i = Number(e.key) - 1;
  if (views[i]) {
    view = views[i];
    build();
  }
});
let drag: number | null = null;
addEventListener('pointerdown', (e) => (drag = e.clientX));
addEventListener('pointerup', () => (drag = null));
addEventListener('pointermove', (e) => {
  if (drag === null) return;
  angle -= (e.clientX - drag) * 0.01;
  drag = e.clientX;
  build();
});
resize();
build();
let t = 0;
renderer.setAnimationLoop(() => {
  t += 1 / 60;
  dogs.forEach((d) => d.dog.pose({ step: t * 2.5, moving: d.moving, rest: d.rest, wag: d.rest === 2 ? 0 : 0.6, digging: !!d.digging, tilt: d.rest === 1 ? 0.6 : 0, eyesClosed: d.rest === 2, t }));
  chibis.forEach((c, i) => c.pose({ step: t * 3, moving: i % 2 === 1, running: false, sitting: false, blink: Math.sin(t * 2 + i) > 0.97, t }));
  renderer.render(scene, camera);
});
