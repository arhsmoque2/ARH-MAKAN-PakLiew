import { test, expect } from '@playwright/test';

test.describe('Pak Liew Storefront — Viewport Responsiveness & Touch Target Integrity', () => {
  test('Page has zero horizontal layout overflow across all viewports', async ({ page }) => {
    await page.goto('/');

    const isHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    });

    expect(isHorizontalOverflow).toBe(false);
  });

  test('Primary interactive elements satisfy touch target ergonomics (>= 36px)', async ({ page }) => {
    await page.goto('/');

    const buttons = page.locator('.button, .ambience-toggle, .chip');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      if (await btn.isVisible()) {
        const box = await btn.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(36);
        }
      }
    }
  });

  test('Captures responsive visual snapshot for baseline verification', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const screenshot = await page.screenshot({ fullPage: false });
    await testInfo.attach('viewport-snapshot', {
      body: screenshot,
      contentType: 'image/png'
    });
  });
});
