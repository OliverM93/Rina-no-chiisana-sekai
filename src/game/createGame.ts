/**
 * Startet Phaser mit scharfer Darstellung auch auf hochauflösenden Displays:
 * Die Zeichenfläche hat Bildschirmauflösung × Pixeldichte und wird per CSS
 * auf Fenstergröße verkleinert.
 */
import Phaser from 'phaser';
import { DPR } from '../config';
import { BootScene } from './scenes/BootScene';
import { WorldScene } from './scenes/WorldScene';
import type { Session } from './session';

export function createGame(parent: HTMLElement, session: Session): Phaser.Game {
  const size = () => ({
    w: Math.max(1, Math.round(parent.clientWidth * DPR)),
    h: Math.max(1, Math.round(parent.clientHeight * DPR)),
  });
  const { w, h } = size();

  const game = new Phaser.Game({
    type: Phaser.WEBGL,
    parent,
    backgroundColor: '#a9da8c',
    scale: {
      mode: Phaser.Scale.NONE,
      width: w,
      height: h,
      zoom: 1 / DPR,
    },
    render: { antialias: true, pixelArt: false, roundPixels: false },
    input: { activePointers: 2 },
    disableContextMenu: true,
    audio: { noAudio: true },
    banner: false,
    scene: [BootScene, WorldScene],
    callbacks: {
      preBoot: (g) => g.registry.set('session', session),
    },
  });

  const onResize = () => {
    const s = size();
    game.scale.resize(s.w, s.h);
  };
  window.addEventListener('resize', onResize);
  window.visualViewport?.addEventListener('resize', onResize);
  return game;
}
