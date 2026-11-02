/**
 * Mini-Tween-System (in echter Zeit): kleine Animationen ohne Abhängigkeit.
 */
interface Tween {
  start: number;
  duration: number;
  step: (t: number) => void;
  done?: () => void;
}

export class Tweens {
  private list: Tween[] = [];

  add(duration: number, step: (t: number) => void, done?: () => void) {
    this.list.push({ start: performance.now(), duration, step, done });
  }

  update() {
    const now = performance.now();
    const keep: Tween[] = [];
    for (const tw of this.list) {
      const t = Math.min(1, (now - tw.start) / tw.duration);
      tw.step(t);
      if (t < 1) keep.push(tw);
      else tw.done?.();
    }
    this.list = keep;
  }
}

export const easeOutBack = (t: number) => 1 + 2.7 * (t - 1) ** 3 + 1.7 * (t - 1) ** 2;
