import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('\x1b[36m[VISUAL-DOCTOR]\x1b[0m Auditing pixel-level regression against the human-approved baseline...');

const ROOT = process.cwd();
const BASELINE_DIR = path.join(ROOT, 'tests', 'visual-baselines');

const hasAnyBaseline =
  fs.existsSync(BASELINE_DIR) &&
  fs.readdirSync(BASELINE_DIR).some((f) => f.endsWith('.png'));

if (!hasAnyBaseline) {
  console.log('  \x1b[33m○\x1b[0m No approved baseline exists yet — this is a documented no-op, not a pass on');
  console.log('    an unverified page. Run the "Generate Visual Baseline Candidates" workflow_dispatch');
  console.log('    job, review the resulting HTML, and run scripts/promote-baseline.mjs on the exported');
  console.log('    decision to activate this gate. See BASELINE-REVIEW-WORKFLOW.md.');
  console.log('\x1b[32m[VISUAL-DOCTOR PASSED (INACTIVE)]\x1b[0m\n');
  process.exit(0);
}

const testRun = spawnSync('npx', ['playwright', 'test', '--grep=@visual-regression'], {
  cwd: ROOT,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, CI: 'true' },
});

if (testRun.status !== 0) {
  console.error('\x1b[31m[VISUAL-DOCTOR FAILED]\x1b[0m Rendered page no longer matches the approved baseline outside');
  console.error('  any masked exception region. Download the playwright-report artifact for a visual diff.');
  process.exit(1);
} else {
  console.log('\x1b[32m[VISUAL-DOCTOR PASSED]\x1b[0m Pixel output matches the approved baseline.\n');
  process.exit(0);
}
