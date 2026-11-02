/**
 * Atmosphäre: Glitzern auf dem Wasser, fallende Blätter/Blüten/Schneeflocken
 * und langsam ziehende Wolkenschatten.
 */
import type Phaser from 'phaser';
import { DEPTH, RES, TILE } from '../../config';
import type { Season } from '../../core/time';

interface Particle {
  img: Phaser.GameObjects.Image;
  vx: number;
  vy: number;
  sway: number;
  phase: number;
  spin: number;
}

const PARTICLE_COUNT: Record<Season, number> = { fruehling: 16, sommer: 6, herbst: 20, winter: 46 };

export class Ambient {
  private particles: Particle[] = [];
  private clouds: Phaser.GameObjects.Image[] = [];
  private time = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    season: Season,
    waterTiles: Array<{ x: number; y: number }>,
    private readonly worldW: number,
    private readonly worldH: number,
  ) {
    // Wasser-Glitzern
    const sparkles = Math.min(60, Math.floor(waterTiles.length / 6));
    for (let i = 0; i < sparkles; i++) {
      const img = scene.add.image(0, 0, 'sparkle').setDepth(DEPTH.decor + 60).setAlpha(0).setScale(0.5 / RES);
      const relocate = () => {
        const t = waterTiles[Math.floor(Math.random() * waterTiles.length)];
        img.setPosition((t.x + Math.random()) * TILE, (t.y + Math.random()) * TILE);
      };
      relocate();
      scene.tweens.add({
        targets: img,
        alpha: { from: 0, to: 0.9 },
        scale: { from: 0.35 / RES, to: 0.8 / RES },
        duration: 700 + Math.random() * 600,
        yoyo: true,
        delay: Math.random() * 4000,
        repeat: -1,
        repeatDelay: 1500 + Math.random() * 4000,
        onRepeat: relocate,
      });
    }

    // Fallende Teilchen
    const count = PARTICLE_COUNT[season];
    const snow = season === 'winter';
    for (let i = 0; i < count; i++) {
      const img = scene.add.image(0, 0, 'particle').setDepth(DEPTH.ambient).setScale((0.7 + Math.random() * 0.6) / RES);
      this.particles.push({
        img,
        vx: snow ? -6 + Math.random() * 12 : 14 + Math.random() * 18,
        vy: snow ? 22 + Math.random() * 22 : 16 + Math.random() * 14,
        sway: snow ? 10 : 22,
        phase: Math.random() * Math.PI * 2,
        spin: snow ? 0 : (Math.random() - 0.5) * 3,
      });
    }
    this.scatterParticles();

    // Wolkenschatten
    for (let i = 0; i < 4; i++) {
      const c = scene.add
        .image(Math.random() * worldW, Math.random() * worldH, 'cloud-shadow')
        .setDepth(DEPTH.clouds)
        .setAlpha(0.07)
        .setScale((1.4 + Math.random()) / RES);
      this.clouds.push(c);
    }
  }

  /** Verteilt die Teilchen zu Beginn über den sichtbaren Bereich. */
  private scatterParticles() {
    const view = this.scene.cameras.main.worldView;
    for (const p of this.particles) {
      p.img.setPosition(view.x + Math.random() * view.width, view.y + Math.random() * view.height);
    }
  }

  update(dtMs: number, nightAmount: number) {
    const dt = dtMs / 1000;
    this.time += dt;
    const view = this.scene.cameras.main.worldView;
    const margin = 40;
    for (const p of this.particles) {
      const img = p.img;
      img.x += (p.vx + Math.sin(this.time * 1.3 + p.phase) * p.sway) * dt;
      img.y += p.vy * dt;
      img.rotation += p.spin * dt;
      const out =
        img.y > view.bottom + margin || img.x > view.right + margin || img.x < view.x - margin || img.y < view.y - margin * 3;
      if (out) {
        // oben oder links neu starten
        if (Math.random() < 0.7) {
          img.setPosition(view.x + Math.random() * view.width, view.y - 20);
        } else {
          img.setPosition(view.x - 20, view.y + Math.random() * view.height);
        }
      }
    }
    for (const c of this.clouds) {
      c.x += 9 * dt;
      c.y += 2 * dt;
      if (c.x - 300 > this.worldW) c.x = -300;
      if (c.y - 200 > this.worldH) c.y = -200;
      c.setAlpha(0.07 * (1 - nightAmount));
    }
  }
}
