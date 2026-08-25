import fs from 'fs';
import path from 'path';

console.log('\x1b[36m[DOCS-DOCTOR]\x1b[0m Auditing ARH Documentation Suite & ADR Integrity...');

const ROOT = process.cwd();
const REQUIRED_DOCS = [
  'README.md',
  'ARCHITECTURE.md',
  'CHANGELOG.md',
  'CURRENT_STATE.md',
  'GOTCHAS.md',
  'RECIPES.md',
  'AGENTS.md'
];

let failed = false;

// 1. Check 7 required documents
for (const doc of REQUIRED_DOCS) {
  const p = path.join(ROOT, doc);
  if (!fs.existsSync(p)) {
    console.error(`  \x1b[31m✗ Missing required document:\x1b[0m ${doc}`);
    failed = true;
  } else {
    const content = fs.readFileSync(p, 'utf8');
    if (content.trim().length < 100) {
      console.error(`  \x1b[31m✗ Hollow document (<100 bytes):\x1b[0m ${doc}`);
      failed = true;
    } else {
      console.log(`  \x1b[32m✓\x1b[0m ${doc} verified (${content.length} bytes)`);
    }
  }
}

// 2. Check ADRs
const adrDir = path.join(ROOT, 'docs', 'decisions');
if (fs.existsSync(adrDir)) {
  const adrs = fs.readdirSync(adrDir).filter(f => f.endsWith('.md'));
  console.log(`  \x1b[32m✓\x1b[0m Found ${adrs.length} Architecture Decision Records (ADRs):`);
  for (const adr of adrs) {
    const content = fs.readFileSync(path.join(adrDir, adr), 'utf8');
    const hasStatus = /\*\*Status\*\*:\s*(Accepted|Superseded|Deprecated)/i.test(content);
    if (!hasStatus) {
      console.error(`  \x1b[31m✗ ADR missing valid **Status** header:\x1b[0m ${adr}`);
      failed = true;
    } else {
      console.log(`    - ${adr} [Status Valid]`);
    }
  }
} else {
  console.error(`  \x1b[31m✗ Missing docs/decisions directory\x1b[0m`);
  failed = true;
}

if (failed) {
  console.error('\x1b[31m[DOCS-DOCTOR FAILED]\x1b[0m Documentation suite is incomplete.');
  process.exit(1);
} else {
  console.log('\x1b[32m[DOCS-DOCTOR PASSED]\x1b[0m All documentation contracts verified.\n');
}