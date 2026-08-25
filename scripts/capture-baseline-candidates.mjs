import { spawn, spawnSync, execSync } from 'child_process';
import { chromium, webkit, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { BASELINE_FIXED_TIME } from '../tests/fixed-time.mjs';

const ROOT = process.cwd();
const PREVIEW_URL = 'http://127.0.0.1:8091';
const DATA_DIR = path.join(ROOT, 'baseline-review-data');
const BASELINE_DIR = path.join(ROOT, 'tests', 'visual-baselines');

// Must mirror playwright.config.mjs's projects exactly — this script runs its own
// lightweight browser instances (not the test runner) purely to dump element
// bounding boxes for the reviewer's tap-to-pin hit-testing, so the coordinate
// system it captures has to match what the test runner actually screenshots.
const PROJECTS = [
  { name: 'desktop-chrome', engine: chromium, device: devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
  { name: 'tablet-ipad', engine: webkit, device: devices['iPad Mini'], viewport: { width: 768, height: 1024 } },
  { name: 'mobile-iphone', engine: webkit, device: devices['iPhone SE'], viewport: { width: 375, height: 667 }, isMobile: true },
];

// Structural/interactive elements worth pinning issues on. Deliberately broad —
// an unmatched selector just yields zero boxes for that element, no harm done.
const BBOX_SELECTORS = [
  'header', 'nav', '.hero', '.demo-banner',
  '[data-current-session-label]', '[data-current-session-hours]',
  '[data-chip-adult]', '[data-chip-child]',
  '[data-menu-grid]', '.menu-item-card', '.category-pills', '.chip',
  '[data-search-input]', '[data-modal-backdrop]', '.modal-card', '[data-modal-close]',
  '[data-pax-adults]', '[data-pax-children]', '[data-calc-total]',
  '[data-ambience-toggle]', '.button', '.button-primary', '.footer',
];

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Preview server did not become ready at ${url} within ${timeoutMs}ms`);
}

async function captureBboxes(proj) {
  const browser = await proj.engine.launch();
  const context = await browser.newContext({
    ...proj.device,
    viewport: proj.viewport,
    isMobile: proj.isMobile ?? proj.device.isMobile,
  });
  await context.clock.setFixedTime(new Date(BASELINE_FIXED_TIME));
  const page = await context.newPage();
  await page.goto(PREVIEW_URL);
  await page.waitForLoadState('networkidle');

  const boxes = await page.evaluate((selectors) => {
    const out = [];
    let id = 0;
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        out.push({
          id: id++,
          selector: sel,
          tag: el.tagName.toLowerCase(),
          classes: typeof el.className === 'string' ? el.className : '',
          text: (el.textContent || '').trim().slice(0, 60),
          box: { x: r.x, y: r.y, width: r.width, height: r.height },
        });
      });
    }
    return out;
  }, BBOX_SELECTORS);

  const pageSize = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  }));

  await browser.close();
  return { project: proj.name, viewport: proj.viewport, pageSize, boxes };
}

async function main() {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  console.log('[baseline-candidates] Starting preview server...');
  const server = spawn('node', ['scripts/preview.mjs'], { cwd: ROOT, stdio: 'inherit' });
  const cleanup = () => { try { server.kill(); } catch {} };
  process.on('exit', cleanup);

  try {
    await waitForServer(PREVIEW_URL);

    console.log('[baseline-candidates] Generating baseline PNGs via Playwright --update-snapshots...');
    const testRun = spawnSync(
      'npx',
      ['playwright', 'test', '--grep=@visual-regression', '--update-snapshots'],
      { cwd: ROOT, stdio: 'inherit', shell: true, env: { ...process.env, CI: 'true' } }
    );
    if (testRun.status !== 0) {
      throw new Error('Playwright --update-snapshots run failed — see output above.');
    }

    console.log('[baseline-candidates] Capturing element bounding boxes for pin hit-testing...');
    const bboxManifest = [];
    for (const proj of PROJECTS) {
      const result = await captureBboxes(proj);
      const outPath = path.join(DATA_DIR, `${proj.name}.bboxes.json`);
      fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
      bboxManifest.push(proj.name);
      console.log(`  ✓ ${proj.name}: ${result.boxes.length} elements mapped`);
    }

    const commitSha = execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim();
    const manifest = {
      commitSha,
      generatedAt: new Date().toISOString(),
      fixedTime: BASELINE_FIXED_TIME,
      projects: bboxManifest,
      baselineDir: path.relative(ROOT, BASELINE_DIR),
    };
    fs.writeFileSync(path.join(DATA_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));

    console.log('[baseline-candidates] Done. Run: node scripts/generate-baseline-review.mjs');
  } finally {
    cleanup();
  }
}

main().catch((err) => {
  console.error('[baseline-candidates] FAILED:', err.message);
  process.exit(1);
});
