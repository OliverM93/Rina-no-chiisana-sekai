/**
 * Erzeugt beim Start alle Grafiken prozedural und wechselt dann in die Welt.
 */
import Phaser from 'phaser';
import { registerWorldTextures } from '../../gfx/textures';
import type { Session } from '../session';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create() {
    const session = this.registry.get('session') as Session;
    registerWorldTextures(this, session.season);
    this.scene.start('world');
  }
}
