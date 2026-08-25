import { spawnSync } from 'child_process';
import path from 'path';

console.log('\x1b[1m\x1b[35m============================================================\x1b[0m');
console.log('\x1b[1m\x1b[35m  PAK LIEW CHINESE MUSLIM RESTAURANT — END-TO-END QUALITY GATE\x1b[0m');
console.log('\x1b[1m\x1b[35m============================================================\x1b[0m\n');

const ROOT = process.cwd();
const GATES = [
  { name: 'Gate 1: Documentation & ADR Doctor', script: 'scripts/doctor-docs.mjs' },
  { name: 'Gate 2: Codebase Hygiene & Data Schema Doctor', script: 'scripts/doctor-code.mjs' },
  { name: 'Gate 3: Malaysian Copy Register & UI Doctor', script: 'scripts/doctor-ui.mjs' },
  { name: 'Gate 4: Security & Zero-Plaintext Doctor', script: 'scripts/doctor-secrets.mjs' },
  { name: 'Gate 5: Cloudflare Workers Edge Preflight', script: 'scripts/doctor-edge.mjs' }
];

let allPassed = true;

for (const gate of GATES) {
  console.log(`\x1b[1m▶ Running ${gate.name}...\x1b[0m`);
  const res = spawnSync('node', [path.join(ROOT, gate.script)], { stdio: 'inherit' });
  if (res.status !== 0) {
    allPassed = false;
    console.error(`\x1b[31m✖ ${gate.name} FAILED with exit code ${res.status}\x1b[0m\n`);
    break;
  }
}

console.log('\x1b[1m\x1b[35m============================================================\x1b[0m');
if (allPassed) {
  console.log('\x1b[1m\x1b[32m  ✓ ALL QUALITY GATES PASSED (100% GREEN) — READY FOR PROD\x1b[0m');
  console.log('\x1b[1m\x1b[35m============================================================\x1b[0m');
  process.exit(0);
} else {
  console.log('\x1b[1m\x1b[31m  ✖ QUALITY GATE BLOCKED — RESOLVE DEFECTS BEFORE DEPLOY\x1b[0m');
  console.log('\x1b[1m\x1b[35m============================================================\x1b[0m');
  process.exit(1);
}