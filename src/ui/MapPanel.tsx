/**
 * Thalias Dorfkarte (Taste M): das Dorf von oben, mit Häusern, Bewohnern
 * und einem Herz, wo Lina gerade steht.
 */
import { useEffect, useRef } from 'preact/hooks';
import { isActive, type Terrain, terrainAt } from '../core/worldmap';
import { NPCS } from '../data/npcs';
import type { Session } from '../game/session';
import { palette } from '../style/palette';
import { ui } from './store';

const TERRAIN_COLOR: Record<Terrain, string> = {
  grass: palette.grass.base,
  path: palette.path.base,
  plaza: palette.plaza.stone,
  sand: palette.sand.base,
  water: palette.water.base,
  sea: palette.sea.base,
  deep: palette.sea.deep,
};

/** Welche Häuser wem gehören (Beschriftung) */
const LABELS: Record<string, string> = {
  'haus-lina': '🏡 Lina',
  'haus-gisela': 'Oma',
  'haus-olaf': 'Olaf & Christin',
  'bistro-jens': '🥐 Jens',
  'praxis-lars': '🩺 Lars',
  'haus-thalia': 'Thalia',
  brunnen: '⛲',
  'werkbank-lina': '🔨',
};

const CELL = 12;

export function MapPanel({ session }: { session: Session }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const close = () => ui.set({ panel: null });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'KeyM') {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const map = session.map;
    c.width = map.width * CELL;
    c.height = map.height * CELL;
    const ctx = c.getContext('2d') as CanvasRenderingContext2D;
    for (let y = 0; y < map.height; y++) for (let x = 0; x < map.width; x++) {
      ctx.fillStyle = TERRAIN_COLOR[terrainAt(map, x, y) ?? 'grass'];
      ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
    }
    // Bäume als Pünktchen, Häuser als Kästchen mit Dach
    for (const o of map.objects) {
      if (!isActive(map, o.id)) continue;
      const cx = (o.x + o.w / 2) * CELL;
      const cy = (o.y + o.h / 2) * CELL;
      if (o.kind === 'tree' || o.kind === 'pine' || o.kind === 'bush') {
        ctx.fillStyle = o.kind === 'pine' ? palette.grass.tuft : palette.grass.dark;
        ctx.beginPath();
        ctx.arc(cx, cy, CELL * 0.42, 0, Math.PI * 2);
        ctx.fill();
      } else if (o.kind === 'house' || o.kind === 'bistro' || o.kind === 'praxis') {
        ctx.fillStyle = palette.wall.cream;
        ctx.fillRect(o.x * CELL + 2, o.y * CELL + 6, o.w * CELL - 4, o.h * CELL - 8);
        ctx.fillStyle = o.kind === 'bistro' ? palette.roof.sky : o.kind === 'praxis' ? palette.roof.mint : o.variant ? (palette.roof as Record<string, string>)[o.variant] ?? palette.roof.rose : palette.roof.rose;
        ctx.fillRect(o.x * CELL, o.y * CELL, o.w * CELL, CELL * 1.4);
      } else if (o.kind === 'rock') {
        ctx.fillStyle = palette.stone.dark;
        ctx.fillRect(cx - 4, cy - 3, 8, 6);
      } else if (o.kind === 'bridge') {
        ctx.fillStyle = palette.wood.base;
        ctx.fillRect(o.x * CELL, o.y * CELL + 2, o.w * CELL, CELL - 4);
      }
    }
    ctx.font = '800 11px "Nunito Variable", Nunito, sans-serif';
    ctx.textAlign = 'center';
    for (const o of map.objects) {
      const label = LABELS[o.id];
      if (!label || !isActive(map, o.id)) continue;
      const cx = (o.x + o.w / 2) * CELL;
      const cy = (o.y + o.h) * CELL + 10;
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      const w = ctx.measureText(label).width + 8;
      ctx.fillRect(cx - w / 2, cy - 9, w, 13);
      ctx.fillStyle = palette.ui.text;
      ctx.fillText(label, cx, cy + 1);
    }
    // Bewohner & Lina
    const pos = session.livePositions();
    for (const n of NPCS) {
      const p = pos[n.id];
      if (!p) continue;
      ctx.fillStyle = n.appearance.outfitColor;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc((p.x / 64) * CELL, (p.y / 64) * CELL, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    const lina = pos.lina;
    if (lina) {
      ctx.font = '16px sans-serif';
      ctx.fillText('💗', (lina.x / 64) * CELL, (lina.y / 64) * CELL + 5);
    }
  }, []);

  return (
    <div class="modal-layer" onPointerUp={(e) => e.target === e.currentTarget && close()}>
      <div class="card map-card pop-in">
        <h2 class="card-title">🗺️ Thalias Karte von {session.data?.villageName}</h2>
        <canvas ref={canvas} class="village-map" />
        <p class="soft small-text center">💗 = du · Punkte = Bewohner · gezeichnet von Thalia mit viel Liebe (und Lineal)</p>
        <div class="card-actions">
          <button class="btn ghost" onClick={close}>
            Schließen (M)
          </button>
        </div>
      </div>
    </div>
  );
}
