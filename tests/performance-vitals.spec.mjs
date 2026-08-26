import { test, expect } from '@playwright/test';

test.describe('Pak Liew Storefront — Performance Profiling & Layout Jitter Gate', () => {
  test('Zero layout shift (CLS <= 0.05) during page hydration and scrolling', async ({ page }) => {
    // 1. Inject PerformanceObserver before DOM loads
    await page.addInitScript(() => {
      window.__clsScore = 0;
      window.__longTasksCount = 0;

      // Cumulative Layout Shift Observer
      try {
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              window.__clsScore += entry.value;
            }
          }
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        // Fallback for environments with restricted PerformanceObserver
      }

      // Long Tasks Observer (>50ms main thread lockup)
      try {
        const ltObserver = new PerformanceObserver((entryList) => {
          window.__longTasksCount += entryList.getEntries().length;
        });
        ltObserver.observe({ type: 'longtask', buffered: true });
      } catch (e) {
        // Ignored if longtask is unsupported in environment
      }
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    // 2. Perform smooth scroll lifecycle down and up to stress layout stability
    await page.evaluate(async () => {
      window.scrollBy({ top: 600, behavior: 'smooth' });
      await new Promise((r) => setTimeout(r, 400));
      window.scrollBy({ top: -600, behavior: 'smooth' });
      await new Promise((r) => setTimeout(r, 400));
    });

    const cls = await page.evaluate(() => window.__clsScore);
    // Core Web Vitals "Good" threshold is CLS < 0.1; our strict gate requires <= 0.05
    expect(cls).toBeLessThanOrEqual(0.05);
  });

  test('Hero video element satisfies zero-jank background attributes', async ({ page }) => {
    await page.goto('/');

    const video = page.locator('.hero-rotator video, .hero-layer[muted]');
    if (await video.count() > 0) {
      const heroVideo = video.first();
      // Ensure required autoplay/performance attributes
      await expect(heroVideo).toHaveAttribute('muted', '');
      await expect(heroVideo).toHaveAttribute('playsinline', '');
      await expect(heroVideo).toHaveAttribute('preload', /metadata|none/);

      // Verify poster frame attribute is populated
      const posterAttr = await heroVideo.getAttribute('poster');
      expect(posterAttr).toBeTruthy();

      // Verify source formats exist (webm/mp4)
      const sources = heroVideo.locator('source');
      expect(await sources.count()).toBeGreaterThanOrEqual(1);
    }
  });

  test('Hero still image is fully loaded and correctly dimensioned', async ({ page }) => {
    await page.goto('/');

    const stillImg = page.locator('.hero-rotator img[data-hero-still]');
    if (await stillImg.count() > 0) {
      const isLoaded = await stillImg.first().evaluate((img) => img.complete && img.naturalWidth > 0);
      expect(isLoaded).toBe(true);
    }
  });
});
