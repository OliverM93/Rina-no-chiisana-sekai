/**
 * Olis Computer: „Dackel-Snake“ – Winston sammelt Leckerli und wird dabei immer länger.
 * Kein Scheitern: stößt er an sich selbst, gibt es nur eine freundliche Meldung und eine neue Runde.
 */
import { useEffect, useRef, useState } from 'preact/hooks';
import { type Dir, newSnake, readRecord, saveRecord, stepSnake, type SnakeState } from '../core/snake';
import type { Session } from '../game/session';
import { palette } from '../style/palette';
import { ui } from './store';

const CELL = 32;
const W = 16;
const H = 11;
const STEP_MS = 150;

const KEYS: Record<string, Dir> = {
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
};

function draw(ctx: CanvasRenderingContext2D, s: SnakeState) {
  const g = palette.grass;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      ctx.fillStyle = (x + y) % 2 ? g.base : g.light;
      ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
    }
  }
  // Leckerli: kleiner Knochen
  const fx = s.food.x * CELL + CELL / 2;
  const fy = s.food.y * CELL + CELL / 2;
  ctx.fillStyle = palette.plaza.base;
  ctx.strokeStyle = palette.wood.dark;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(fx - 10, fy - 4, 20, 8, 4);
  for (const [dx, dy] of [[-10, -4], [-10, 4], [10, -4], [10, 4]]) ctx.moveTo(fx + dx + 4, fy + dy), ctx.arc(fx + dx, fy + dy, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Winston: rotbrauner Dackel, Kopf mit Schlappohr und rosa Halsband
  s.body.forEach((c, i) => {
    const x = c.x * CELL;
    const y = c.y * CELL;
    ctx.fillStyle = palette.wood.dark;
    ctx.beginPath();
    ctx.roundRect(x + 3, y + 3, CELL - 6, CELL - 6, i === 0 ? 12 : 9);
    ctx.fill();
  });
  const h = s.body[0];
  const hx = h.x * CELL;
  const hy = h.y * CELL;
  ctx.fillStyle = palette.wood.bark;
  ctx.beginPath();
  ctx.roundRect(hx + 2, hy + 2, CELL - 4, CELL - 4, 13);
  ctx.fill();
  ctx.fillStyle = palette.roof.rose;
  ctx.fillRect(hx + 4, hy + CELL - 10, CELL - 8, 4);
  ctx.fillStyle = palette.soil.wet;
  ctx.beginPath();
  ctx.arc(hx + 8, hy + 12, 5, 0, Math.PI * 2);
  ctx.arc(hx + CELL - 8, hy + 12, 5, 0, Math.PI * 2);
  ctx.fill();
  const look = { up: [0, -2], down: [0, 2], left: [-2, 0], right: [2, 0] }[s.dir];
  ctx.fillStyle = '#2b2a31';
  for (const ex of [11, CELL - 11]) {
    ctx.beginPath();
    ctx.arc(hx + ex + look[0], hy + 14 + look[1], 2.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function MiniGamePanel({ session }: { session: Session }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef<SnakeState>(newSnake(W, H));
  const want = useRef<Dir>('right');
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [best, setBest] = useState(() => (session.data ? readRecord(session.data.world.dates) : 0));
  const [record, setRecord] = useState(false);
  const close = () => ui.set({ panel: null });

  const start = () => {
    state.current = newSnake(W, H);
    want.current = 'right';
    setScore(0);
    setOver(false);
    setRecord(false);
    setRunning(true);
  };

  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (ctx) draw(ctx, state.current);
  }, [running, over]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      const d = KEYS[e.code];
      if (d) {
        e.preventDefault();
        want.current = d;
        return;
      }
      if ((e.code === 'Space' || e.code === 'Enter') && !running) {
        e.preventDefault();
        start();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const next = stepSnake(state.current, want.current);
      state.current = next;
      const ctx = canvas.current?.getContext('2d');
      if (ctx) draw(ctx, next);
      setScore(next.score);
      if (next.over) {
        const dates = session.data?.world.dates;
        if (dates && saveRecord(dates, next.score)) {
          setBest(next.score);
          setRecord(true);
          session.save();
        }
        setRunning(false);
        setOver(true);
      }
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [running]);

  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card minigame pop-in">
        <h2 class="card-title">🎮 Dackel-Snake</h2>
        <div class="mg-score">
          🦴 {score} · Rekord {Math.max(best, score)}
        </div>
        <canvas ref={canvas} class="mg-canvas" width={W * CELL} height={H * CELL} />
        <div class="mg-hint">
          {running
            ? 'Pfeiltasten oder WASD – Winston sammelt Leckerli. Die Ränder sind weich.'
            : over
              ? record
                ? `Neuer Rekord: ${score} Leckerli! Winston wedelt stolz. 🐶✨`
                : score > 0
                ? `Winston hat sich verheddert – ${score} Leckerli! Nochmal? 🐶`
                : 'Winston hat sich verheddert. Nochmal? 🐶'
              : 'Winston will Leckerli! Leertaste startet.'}
        </div>
        <div class="card-actions">
          <button class="btn ghost" onClick={close}>
            Ausschalten
          </button>
          {!running && (
            <button class="btn primary" onClick={start}>
              {over ? 'Nochmal' : 'Los!'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
