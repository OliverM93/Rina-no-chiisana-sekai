/**
 * Galerie-Teil für Gelände und Objekte (nur Entwicklung).
 */
import type { Season } from '../core/time';
import type { Ctx } from '../gfx/canvas';
import * as fx from '../gfx/effects';
import * as obj from '../gfx/objects';
import type { SpriteDef } from '../gfx/objects';
import { renderGrassTexture, renderTerrainTileset, terrainLayers } from '../gfx/terrain';
import { palette } from '../style/palette';

type SectionFn = (title: string) => HTMLElement;
type CellFn = (row: HTMLElement, label: string, w: number, h: number, draw: (ctx: Ctx) => void) => void;

function defCell(cell: CellFn, row: HTMLElement, def: SpriteDef) {
  cell(row, def.key, def.w, def.h, (ctx) => {
    def.draw(ctx);
    // Ankerpunkt markieren
    ctx.fillStyle = 'rgba(255,0,100,0.6)';
    ctx.fillRect(def.ax - 1.5, def.ay - 1.5, 3, 3);
  });
}

export function renderWorldGallery(section: SectionFn, cell: CellFn) {
  const seasons: Season[] = ['fruehling', 'sommer', 'herbst', 'winter'];
  for (const s of seasons) {
    const row = section(`Natur – ${s}`);
    for (let v = 0; v < obj.TREE_VARIANTS; v++) defCell(cell, row, obj.treeDef(s, v));
    defCell(cell, row, obj.pineDef(s, 0));
    defCell(cell, row, obj.bushDef(s));
    defCell(cell, row, fx.particleDef(s));
    defCell(cell, row, fx.tuftDef(s));
  }

  const b = section('Gebäude & Dorf');
  defCell(cell, b, obj.houseDef(palette.roof.rose, 'house-rose'));
  defCell(cell, b, obj.houseDef(palette.roof.mint, 'house-mint'));
  defCell(cell, b, obj.plotAreaDef());
  defCell(cell, b, obj.signDef('Bauplatz', 'sign'));
  defCell(cell, b, obj.mailboxDef());
  defCell(cell, b, obj.boardDef());
  defCell(cell, b, obj.lanternDef());
  defCell(cell, b, obj.benchDef());
  defCell(cell, b, obj.fountainDef());
  defCell(cell, b, obj.bridgeDeckDef());
  defCell(cell, b, obj.bridgeRailDef());
  defCell(cell, b, obj.rockDef());

  const e = section('Effekte & Deko');
  for (const def of [fx.glowDef(), fx.windowGlowDef(), fx.sparkleDef(), fx.cloudShadowDef(), fx.charShadowDef(), fx.pebbleDef(), fx.shellDef(), fx.markerDef(), fx.bubbleDef()]) {
    defCell(cell, e, def);
  }
  for (let i = 0; i < fx.FLOWER_COLORS.length; i++) defCell(cell, e, fx.flowerDef(i));

  const t = section('Gelände-Tilesets (16 Eckmasken je Ebene) & Wiese');
  for (const layer of terrainLayers('sommer')) {
    const canvas = renderTerrainTileset(layer, 1);
    cell(t, layer.key, canvas.width, canvas.height, (ctx) => {
      ctx.fillStyle = palette.grass.base;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(canvas, 0, 0);
    });
  }
  for (const s of seasons) {
    const canvas = renderGrassTexture(s, 1);
    cell(t, `wiese-${s}`, canvas.width / 2, canvas.height / 2, (ctx) => ctx.drawImage(canvas, 0, 0, canvas.width / 2, canvas.height / 2));
  }
}
