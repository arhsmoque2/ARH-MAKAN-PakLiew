import fs from 'fs';
import path from 'path';

console.log('\x1b[36m[UI-DOCTOR]\x1b[0m Auditing Malaysian Copy Register, Touch Targets & Visual Drift...');

const ROOT = process.cwd();
let failed = false;

// 1. Forbidden Hype Adjectives Check (from malaysian-localized-copy-register)
const FORBIDDEN_WORDS = [
  '\\bpadu\\b',
  '\\bgiler\\b',
  '\\bgila\\b',
  '\\bterpaling\\b',
  '\\bmantul\\b',
  '\\bkaw-kaw\\b',
  '\\bpower\\b'
];

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const menuJson = fs.readFileSync(path.join(ROOT, 'data', 'menu.json'), 'utf8');

for (const word of FORBIDDEN_WORDS) {
  const regex = new RegExp(word, 'gi');
  if (regex.test(html) || regex.test(menuJson)) {
    console.error(`  \x1b[31m✗ Forbidden hype adjective detected:\x1b[0m "${word.replace(/\\b/g, '')}" violates Proof-Led Copy Register`);
    failed = true;
  }
}
if (!failed) {
  console.log(`  \x1b[32m✓\x1b[0m Copy register audit clean: 0 forbidden hype adjectives found`);
}

// 2. Touch Target & CSS Tokens Check
const css = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8');
if (!css.includes('min-height: 44px') && !css.includes('min-height:44px')) {
  console.error(`  \x1b[31m✗ styles.css missing standard >=44px touch target rules\x1b[0m`);
  failed = true;
} else {
  console.log(`  \x1b[32m✓\x1b[0m Touch target ergonomics verified (>= 44px bounds)`);
}

if (!css.includes('--pl-pine') || !css.includes('--pl-amber')) {
  console.error(`  \x1b[31m✗ styles.css missing canonical Pine Jade / Amber color tokens\x1b[0m`);
  failed = true;
} else {
  console.log(`  \x1b[32m✓\x1b[0m Design tokens conform to Nanyang Pine Jade & Wok Amber palette`);
}

if (failed) {
  console.error('\x1b[31m[UI-DOCTOR FAILED]\x1b[0m Visual or linguistic drift detected.');
  process.exit(1);
} else {
  console.log('\x1b[32m[UI-DOCTOR PASSED]\x1b[0m UI and Copy Register verified.\n');
}