const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await page.goto('http://localhost:5173/?datum=2026-05-12&zeit=12:00');
  await page.waitForFunction(() => window.__rina?.session?.worldReady, null, { timeout: 120000 });
  const out = await page.evaluate(async () => {
    const m = await import('/src/world3d/models/furniture.ts');
    const f = await import('/src/data/furniture.ts');
    const THREE = await import('/node_modules/.vite/deps/three.js').catch(() => null);
    const res = {}; const errs = [];
    const seen = new Set();
    for (const def of f.FURNITURE) {
      if (seen.has(def.id)) continue; seen.add(def.id);
      if (def.rug) continue;
      const itemId = Object.keys(f.FURNITURE_BY_ITEM).find((k) => f.FURNITURE_BY_ITEM[k].def.id === def.id);
      try {
        const model = m.makeFurniture(itemId);
        model.group.updateMatrixWorld(true);
        // Box3 ohne THREE-Import: aus Geometrien selbst rechnen
        let min = 1e9, max = -1e9;
        model.group.traverse((o) => {
          if (!o.isMesh) return;
          o.geometry.computeBoundingBox();
          const bb = o.geometry.boundingBox;
          for (const x of [bb.min.x, bb.max.x]) for (const y of [bb.min.y, bb.max.y]) for (const z of [bb.min.z, bb.max.z]) {
            const v = o.localToWorld(o.position.constructor.prototype.clone.call({ x, y, z, clone() { return this; } }) && new o.position.constructor(x, y, z));
            if (v.y < min) min = v.y; if (v.y > max) max = v.y;
          }
        });
        res[def.id] = [Math.round(min * 100) / 100, Math.round(max * 100) / 100, def.wall ? 1 : 0, def.small ? 1 : 0];
      } catch (e) { errs.push(def.id + ': ' + e.message); }
    }
    return { res, errs };
  });
  require('fs').writeFileSync('heights.json', JSON.stringify(out.res));
  console.log('errors', out.errs.slice(0, 10), Object.keys(out.res).length);
  await browser.close();
})();
