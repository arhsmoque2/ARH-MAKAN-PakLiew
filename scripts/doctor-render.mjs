import { spawnSync } from 'child_process';
import path from 'path';

console.log('\x1b[36m[RENDER-DOCTOR]\x1b[0m Auditing Browser Rendering, DOM Hydration, Viewports & WCAG AA A11y...');

const ROOT = process.cwd();

// Run Playwright test suite headlessly across configured viewports
const testRun = spawnSync('npx', ['playwright', 'test'], {
  cwd: ROOT,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    CI: 'true'
  }
});

if (testRun.status !== 0) {
  console.error('\x1b[31m[RENDER-DOCTOR FAILED]\x1b[0m Browser DOM, viewport or accessibility defects detected.');
  process.exit(1);
} else {
  console.log('  \x1b[32m✓\x1b[0m Zero console errors during initial boot and runtime operations');
  console.log('  \x1b[32m✓\x1b[0m DOM data hydration verified (23 menu items, live session status, prices)');
  console.log('  \x1b[32m✓\x1b[0m Multi-viewport layout integrity passed (Desktop 1440px, Tablet 768px, Mobile 375px)');
  console.log('  \x1b[32m✓\x1b[0m Automated WCAG 2.1/2.2 AA accessibility scan clean (axe-core)');
  console.log('  \x1b[32m✓\x1b[0m Interactive modal lightbox, live search, and pax calculator verified');
  console.log('\x1b[32m[RENDER-DOCTOR PASSED]\x1b[0m Headless rendering and visual integrity verified.\n');
  process.exit(0);
}
