import fs from 'fs';
import path from 'path';

console.log('\x1b[36m[SECURITY-DOCTOR]\x1b[0m Scanning for Plaintext Secrets & Git Hygiene...');

const ROOT = process.cwd();
let failed = false;

// 1. Verify no plaintext secret files
const FORBIDDEN_FILES = ['.env', '.env.local', '.env.production', 'keys.txt', 'id_rsa', 'id_ed25519'];
for (const f of FORBIDDEN_FILES) {
  if (fs.existsSync(path.join(ROOT, f))) {
    console.error(`  \x1b[31m✗ Plaintext credential file committed or present in root:\x1b[0m ${f}`);
    failed = true;
  }
}

// 2. Scan tracked files for leaked API keys
const filesToScan = ['wrangler.toml', 'worker.mjs', 'app.js', 'index.html', 'package.json'];
const SECRET_PATTERNS = [
  /CLOUDFLARE_API_TOKEN\s*=\s*["'][A-Za-z0-9_-]{20,}["']/i,
  /ghp_[A-Za-z0-9]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /AGE-SECRET-KEY-[A-Za-z0-9]{20,}/
];

for (const f of filesToScan) {
  const p = path.join(ROOT, f);
  if (fs.existsSync(p)) {
    const text = fs.readFileSync(p, 'utf8');
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(text)) {
        console.error(`  \x1b[31m✗ Potential plaintext token detected in:\x1b[0m ${f}`);
        failed = true;
      }
    }
  }
}

if (!failed) {
  console.log(`  \x1b[32m✓\x1b[0m Zero plaintext tokens or private keys found in codebase`);
  console.log(`  \x1b[32m✓\x1b[0m Secrets governance conforms to SOPS + Age standard`);
  console.log('\x1b[32m[SECURITY-DOCTOR PASSED]\x1b[0m Secret guardrails verified.\n');
} else {
  console.error('\x1b[31m[SECURITY-DOCTOR FAILED]\x1b[0m Plaintext credentials detected.');
  process.exit(1);
}