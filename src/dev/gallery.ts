/**
 * Entwickler-Galerie: zeigt alle prozedural gezeichneten Grafiken.
 * Aufruf im Dev-Server: http://localhost:5173/gallery.html
 * (wird nicht mit ins Spiel gebaut)
 */
import { DEFAULT_LINA, type Appearance } from '../core/appearance';
import { CHIBI_FRAMES, CHIBI_FEET, CHIBI_H, CHIBI_W, drawChibi } from '../gfx/chibi';
import { GISELA } from '../data/npcs/gisela';
import { palette } from '../style/palette';

const root = document.getElementById('gallery')!;
const SCALE = 2;

function section(title: string) {
  const h = document.createElement('h2');
  h.textContent = title;
  root.appendChild(h);
  const row = document.createElement('div');
  row.className = 'row';
  root.appendChild(row);
  return row;
}

function cell(row: HTMLElement, label: string, w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, flip = false) {
  const div = document.createElement('div');
  div.className = 'cell';
  const c = document.createElement('canvas');
  c.width = w * SCALE;
  c.height = h * SCALE;
  c.style.width = `${w * 1.5}px`;
  const ctx = c.getContext('2d')!;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.scale(SCALE, SCALE);
  if (flip) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }
  draw(ctx);
  div.appendChild(c);
  const span = document.createElement('span');
  span.textContent = label;
  div.appendChild(span);
  row.appendChild(div);
}

function chibiRow(title: string, a: Appearance) {
  const row = section(title);
  for (const f of CHIBI_FRAMES) {
    cell(row, f.name, CHIBI_W, CHIBI_H, (ctx) => {
      ctx.translate(CHIBI_W / 2, CHIBI_FEET);
      drawChibi(ctx, a, f.dir, f.pose);
    });
  }
}

export const SAMPLE_PEOPLE: Record<string, Appearance> = {
  Lina: DEFAULT_LINA,
  'Oma Gisela': GISELA.appearance,
  'Lars (Probe)': { ...DEFAULT_LINA, hairStyle: 'kurz', hairColor: palette.hair.dunkelbraun, outfit: 'hemd', outfitColor: '#a9cdf2', accentColor: '#7d6a73', height: 1.18, build: 1.05, beard: 'voll', blush: false },
  'Olaf (Probe)': { ...DEFAULT_LINA, hairStyle: 'kurz', hairColor: palette.hair.angegraut, outfit: 'hemd', outfitColor: '#ffffff', accentColor: '#8a9bc4', height: 0.95, build: 1.05, beard: 'kurz', glasses: true, blush: false },
  'Jens (Probe)': { ...DEFAULT_LINA, hairStyle: 'wuschel', hairColor: palette.hair.grau, outfit: 'strickjacke', outfitColor: '#f6b39e', accentColor: '#ffffff', height: 0.98, build: 1.25, blush: true },
};

for (const [name, a] of Object.entries(SAMPLE_PEOPLE)) chibiRow(name, a);

// Weitere Galerien (Gelände, Objekte) hängen sich hier an:
import('./gallery-world').then((m) => m.renderWorldGallery(section, cell)).catch(() => {});
