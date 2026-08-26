import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://127.0.0.1:8091',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  // Flat, predictable baseline path — no platform suffix (CI's Linux runner is the
  // only environment that ever writes or reads these) and no duplicate project
  // segment, since tests/visual-regression.spec.mjs already names the arg per project.
  snapshotPathTemplate: '{testDir}/visual-baselines/{arg}{ext}',
  projects: [
    {
      name: 'desktop-chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 }
      },
    },
    {
      name: 'tablet-ipad',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 },
        hasTouch: true,
      },
    },
    {
      name: 'mobile-iphone',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 667 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: 'node scripts/preview.mjs',
    url: 'http://127.0.0.1:8091',
    reuseExistingServer: !process.env.CI,
    timeout: 10000,
  },
});
