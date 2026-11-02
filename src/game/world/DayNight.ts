/**
 * Tag-Nacht-Zyklus: färbt die Welt je nach Uhrzeit ein und lässt
 * abends Laternen und Fenster leuchten.
 */
import Phaser from 'phaser';
import { DEPTH, RES, TILE } from '../../config';
import { type Clock, getDaylight } from '../../core/time';
import { hexToInt } from '../../style/palette';
import type { LightSpot } from './MapView';

export class DayNight {
  private overlay: Phaser.GameObjects.Rectangle;
  private glows: Array<{ img: Phaser.GameObjects.Image; base: number; phase: number; flicker: boolean }> = [];
  private elapsed = 1000;
  night = 0;

  constructor(
    scene: Phaser.Scene,
    private readonly clock: Clock,
    worldW: number,
    worldH: number,
    lights: LightSpot[],
  ) {
    this.overlay = scene.add
      .rectangle(-TILE, -TILE, worldW + TILE * 2, worldH + TILE * 2, 0xffffff)
      .setOrigin(0, 0)
      .setBlendMode(Phaser.BlendModes.MULTIPLY)
      .setDepth(DEPTH.night);

    for (const l of lights) {
      if (l.kind === 'window') {
        // warm leuchtende Scheibe über dem Fenster …
        const pane = scene.add.image(l.x, l.y, 'window-lit').setScale(1 / RES).setDepth(DEPTH.lights).setAlpha(0);
        this.glows.push({ img: pane, base: 1, phase: 0, flicker: false });
      }
      const key = l.kind === 'lantern' ? 'glow' : 'window-glow';
      const scale = l.kind === 'lantern' ? 1.6 : l.kind === 'heart' ? 0.7 : 1.1;
      const img = scene.add
        .image(l.x, l.y, key)
        .setScale(scale / RES)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(DEPTH.lights + 1)
        .setAlpha(0);
      this.glows.push({ img, base: scale, phase: Math.random() * Math.PI * 2, flicker: true });
    }
    this.apply();
  }

  update(dtMs: number) {
    this.elapsed += dtMs;
    if (this.elapsed >= 1000) {
      this.elapsed = 0;
      this.apply();
    }
    // Laternen flackern ganz leicht
    if (this.night > 0.05) {
      const t = performance.now() / 1000;
      for (const g of this.glows) {
        if (!g.flicker) continue;
        const flicker = 1 + Math.sin(t * 3 + g.phase) * 0.03;
        g.img.setScale((g.base * flicker) / RES);
      }
    }
  }

  private apply() {
    const light = getDaylight(this.clock());
    this.night = light.night;
    const tint = hexToInt(light.tint);
    this.overlay.setFillStyle(tint, 1);
    this.overlay.setVisible(tint !== 0xffffff);
    const glowAlpha = Math.max(0, Math.min(1, (light.night - 0.1) / 0.6));
    for (const g of this.glows) g.img.setAlpha(glowAlpha * 0.95).setVisible(glowAlpha > 0.01);
  }
}
