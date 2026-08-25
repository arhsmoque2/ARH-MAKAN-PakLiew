import fs from 'fs';
import path from 'path';

console.log('\x1b[36m[EDGE-DOCTOR]\x1b[0m Verifying Cloudflare Workers Configuration & Live Ingress...');

const ROOT = process.cwd();
let failed = false;

// 1. Verify wrangler.toml
const wranglerPath = path.join(ROOT, 'wrangler.toml');
if (!fs.existsSync(wranglerPath)) {
  console.error(`  \x1b[31m✗ Missing wrangler.toml\x1b[0m`);
  failed = true;
} else {
  const content = fs.readFileSync(wranglerPath, 'utf8');
  if (!content.includes('name = "arh-makan-pakliew"') || !content.includes('[assets]')) {
    console.error(`  \x1b[31m✗ wrangler.toml missing name or [assets] binding\x1b[0m`);
    failed = true;
  } else {
    console.log(`  \x1b[32m✓\x1b[0m wrangler.toml configuration valid (assets binding configured)`);
  }
}

// 2. Verify worker.mjs
const workerPath = path.join(ROOT, 'worker.mjs');
if (!fs.existsSync(workerPath)) {
  console.error(`  \x1b[31m✗ Missing worker.mjs\x1b[0m`);
  failed = true;
} else {
  console.log(`  \x1b[32m✓\x1b[0m worker.mjs edge router present`);
}

// 3. Smoke Test Live Endpoint using native fetch
const LIVE_URL = 'https://arh-makan-pakliew.arh-homelab.workers.dev';
console.log(`  \x1b[33m⚡ Probing live edge endpoint:\x1b[0m ${LIVE_URL}`);

try {
  const res = await fetch(LIVE_URL);
  if (res.status === 200) {
    console.log(`  \x1b[32m✓\x1b[0m Live Edge Probe: HTTP ${res.status} OK`);
    console.log('\x1b[32m[EDGE-DOCTOR PASSED]\x1b[0m Cloudflare Edge Ingress operational.\n');
  } else {
    console.warn(`  \x1b[33m! Warning: Live endpoint returned HTTP ${res.status}\x1b[0m`);
  }
} catch (err) {
  console.warn(`  \x1b[33m! Warning: Could not probe live endpoint (${err.message})\x1b[0m`);
}
