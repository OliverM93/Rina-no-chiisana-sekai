/**
 * Überträgt die prozeduralen Zeichnungen als Texturen in Phaser.
 */
import type Phaser from 'phaser';
import type { Appearance } from '../core/appearance';
import type { Season } from '../core/time';
import { RES } from '../config';
import { palette } from '../style/palette';
import { makeCanvas } from './canvas';
import { CHIBI_FEET, CHIBI_H, CHIBI_W, renderChibiSheet } from './chibi';
import * as fx from './effects';
import { drawItemIcon, ICON } from './items';
import { ITEMS } from '../data/items';
import * as obj from './objects';
import type { SpriteDef } from './objects';
import { renderGrassTexture, renderTerrainTileset, terrainLayers } from './terrain';

/** Alle registrierten Sprite-Definitionen (für Ankerpunkte). */
const defs = new Map<string, SpriteDef>();

function replaceTexture(scene: Phaser.Scene, key: string, canvas: HTMLCanvasElement) {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  scene.textures.addCanvas(key, canvas);
}

export function addSprite(scene: Phaser.Scene, def: SpriteDef) {
  const { canvas, ctx } = makeCanvas(def.w, def.h, RES);
  def.draw(ctx);
  replaceTexture(scene, def.key, canvas);
  defs.set(def.key, def);
}

/** Ursprung (0..1) einer Textur, sodass der Ankerpunkt auf der Weltposition liegt. */
export function originOf(key: string): [number, number] {
  const def = defs.get(key);
  if (!def) return [0.5, 0.5];
  return [def.ax / def.w, def.ay / def.h];
}

export const ROOF_BY_VARIANT: Record<string, string> = {
  rose: palette.roof.rose,
  coral: palette.roof.coral,
  mint: palette.roof.mint,
  lilac: palette.roof.lilac,
  butter: palette.roof.butter,
  sky: palette.roof.sky,
};

/** Erzeugt alle Welt-Texturen für die aktuelle Jahreszeit. */
export function registerWorldTextures(scene: Phaser.Scene, season: Season) {
  for (let v = 0; v < obj.TREE_VARIANTS; v++) addSprite(scene, obj.treeDef(season, v));
  addSprite(scene, obj.pineDef(season, 0));
  addSprite(scene, obj.pineDef(season, 1));
  addSprite(scene, obj.bushDef(season));
  addSprite(scene, obj.rockDef());
  for (const [variant, color] of Object.entries(ROOF_BY_VARIANT)) addSprite(scene, obj.houseDef(color, `house-${variant}`));
  addSprite(scene, obj.plotAreaDef());
  addSprite(scene, obj.signDef('Bauplatz', 'sign-plot'));
  addSprite(scene, obj.mailboxDef());
  addSprite(scene, obj.mailboxDef(true));
  addSprite(scene, obj.sellboxDef());
  addSprite(scene, obj.boardDef());
  addSprite(scene, obj.lanternDef());
  addSprite(scene, obj.benchDef());
  addSprite(scene, obj.fountainDef());
  addSprite(scene, obj.bridgeDeckDef());
  addSprite(scene, obj.bridgeRailDef());

  for (const def of [
    fx.glowDef(),
    fx.windowGlowDef(),
    fx.windowLitDef(),
    fx.sparkleDef(),
    fx.particleDef(season),
    fx.cloudShadowDef(),
    fx.charShadowDef(),
    fx.tuftDef(season),
    fx.pebbleDef(),
    fx.shellDef(),
    fx.markerDef(),
    fx.bubbleDef(),
  ]) {
    addSprite(scene, def);
  }
  for (let i = 0; i < fx.FLOWER_COLORS.length; i++) addSprite(scene, fx.flowerDef(i));

  // Gegenstände (am Boden, an Bäumen)
  for (const id of Object.keys(ITEMS)) {
    addSprite(scene, { key: `item-${id}`, w: ICON, h: ICON, ax: ICON / 2, ay: ICON / 2, draw: (ctx) => drawItemIcon(ctx, id) });
  }
  addSprite(scene, fx.heartDef());

  // Gelände
  for (const layer of terrainLayers(season)) {
    replaceTexture(scene, `terrain-${layer.key}`, renderTerrainTileset(layer, RES));
  }
  replaceTexture(scene, 'grass', renderGrassTexture(season, RES));
}

/** Erzeugt (oder ersetzt) das Spritesheet einer Figur. */
export function registerCharacter(scene: Phaser.Scene, key: string, appearance: Appearance) {
  const { canvas, frames } = renderChibiSheet(appearance, RES);
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const tex = scene.textures.addCanvas(key, canvas);
  if (!tex) return;
  for (const f of frames) tex.add(f.name, 0, f.x, f.y, f.w, f.h);
}

export const CHIBI_ORIGIN: [number, number] = [0.5, CHIBI_FEET / CHIBI_H];
export const CHIBI_SIZE = { w: CHIBI_W, h: CHIBI_H };
