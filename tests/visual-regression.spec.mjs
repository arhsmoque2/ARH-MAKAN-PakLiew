import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { BASELINE_FIXED_TIME } from './fixed-time.mjs';

const ROOT = process.cwd();
const BASELINE_DIR = path.join(ROOT, 'tests', 'visual-baselines');
const EXCEPTIONS_PATH = path.join(ROOT, 'tests', 'baseline-exceptions.json');

function loadExceptionsForProject(projectName) {
  if (!fs.existsSync(EXCEPTIONS_PATH)) return [];
  const data = JSON.parse(fs.readFileSync(EXCEPTIONS_PATH, 'utf8'));
  return (data.exceptions || []).filter(
    (e) => !e.project || e.project === projectName
  );
}

// Tagged @visual-regression so doctor-render.mjs (Gate 6, the fast rendering/DOM/
// a11y suite) can explicitly exclude it via --grep-invert, and doctor-visual.mjs
// (Gate 7) can run it in isolation via --grep. Keeping this out of Gate 6's default
// run means Gate 6 stays fast and always-meaningful, while Gate 7 stays a no-op
// (not a failure) until a baseline has actually been human-approved.
test.describe('Pak Liew Storefront — Visual Regression (approved baseline) @visual-regression', () => {
  test('Full-page screenshot matches the human-approved baseline', async ({ page, context }, testInfo) => {
    const baselineFile = path.join(BASELINE_DIR, `storefront-${testInfo.project.name}.png`);
    test.skip(
      !fs.existsSync(baselineFile),
      `No approved visual baseline yet for project "${testInfo.project.name}". ` +
        `This gate is a documented no-op until scripts/promote-baseline.mjs commits one — ` +
        `see BASELINE-REVIEW-WORKFLOW.md. It is not silently passing on a defect: there is ` +
        `simply nothing to compare against yet.`
    );

    await context.clock.setFixedTime(new Date(BASELINE_FIXED_TIME));
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const exceptions = loadExceptionsForProject(testInfo.project.name);
    const mask = exceptions
      .filter((e) => e.selector)
      .map((e) => page.locator(e.selector));

    await expect(page).toHaveScreenshot(`storefront-${testInfo.project.name}.png`, {
      fullPage: true,
      mask,
      maxDiffPixelRatio: 0.01,
    });
  });
});
