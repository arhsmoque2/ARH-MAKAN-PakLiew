import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Pak Liew Storefront — Accessibility (WCAG 2.1 AA) Audit', () => {
  test('Storefront passes automated accessibility rules on index.html', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .disableRules(['color-contrast']) // Some image background overlays dynamically calculated; audited separately
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Operator & Customer Guide passes automated accessibility rules on guide.html', async ({ page }) => {
    await page.goto('/guide.html');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
