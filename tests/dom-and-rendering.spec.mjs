import { test, expect } from '@playwright/test';

test.describe('Pak Liew Storefront — DOM Rendering & Interactive Verification', () => {
  test('Storefront loads with 0 console errors and dynamic data hydrated', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const failedRequests = [];
    page.on('response', response => {
      // Ignore favicon or non-critical asset 404s if any, but ensure all page assets load cleanly
      if (response.status() >= 400 && !response.url().includes('favicon.ico')) {
        failedRequests.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto('/');

    // 1. Page Title & Basic Metadata
    await expect(page).toHaveTitle(/Pak Liew Chinese Muslim Restaurant/);
    expect(consoleErrors).toHaveLength(0);
    expect(failedRequests).toHaveLength(0);

    // 2. Dynamic Live Status Banner
    const sessionLabel = page.locator('[data-current-session-label]');
    await expect(sessionLabel).toBeVisible();
    const sessionText = await sessionLabel.textContent();
    expect(sessionText.length).toBeGreaterThan(3);

    const chipAdult = page.locator('[data-chip-adult]');
    await expect(chipAdult).toContainText('RM');

    // 3. Dynamic Menu Grid Rendering (all 23 items from menu.json)
    const menuGrid = page.locator('[data-menu-grid]');
    await expect(menuGrid).toBeVisible();

    const menuCards = page.locator('.menu-item-card');
    await expect(menuCards).toHaveCount(23);

    // 4. Verify rendered image elements are properly formed and first visible images loaded
    const images = page.locator('.menu-item-card img');
    await expect(images).toHaveCount(23);
    const firstImg = images.first();
    const isLoaded = await firstImg.evaluate(img => img.complete && img.naturalWidth > 0);
    expect(isLoaded).toBe(true);
  });

  test('Category filtering updates visible items correctly', async ({ page }) => {
    await page.goto('/');

    // Click "Live Wok" category pill
    const liveWokBtn = page.locator('[data-cat="live-stalls"]');
    await expect(liveWokBtn).toBeVisible();
    await liveWokBtn.click();
    await expect(liveWokBtn).toHaveClass(/is-active/);

    // Verify filtered count (5 live stalls items from menu.json)
    const visibleCards = page.locator('.menu-item-card');
    await expect(visibleCards).toHaveCount(5);

    // Click "Semua Kategori" pill
    const allBtn = page.locator('[data-cat="all"]');
    await allBtn.click();
    await expect(page.locator('.menu-item-card')).toHaveCount(23);
  });

  test('Search input filters menu items with debounce and shows empty state on no match', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('[data-search-input]');
    await expect(searchInput).toBeVisible();

    // Type search query
    await searchInput.fill('Char Koay Teow');

    const cktCard = page.locator('.menu-item-card');
    await expect(cktCard).toHaveCount(1);
    await expect(cktCard.first()).toContainText('Char Koay Teow');

    // Search for non-existent item to test graceful empty state
    await searchInput.fill('xyznonexistentdish123');

    const emptyMessage = page.locator('[data-menu-grid]');
    await expect(emptyMessage).toContainText('Tiada hidangan dijumpai');
  });

  test('Menu item modal lightbox opens, displays details, and closes cleanly', async ({ page }) => {
    await page.goto('/');

    const firstCard = page.locator('.menu-item-card').first();
    const itemName = await firstCard.locator('.item-name').textContent();

    // Open modal
    await firstCard.click();
    const modalBackdrop = page.locator('[data-modal-backdrop]');
    await expect(modalBackdrop).toBeVisible();

    const modalTitle = page.locator('#modal-item-title');
    await expect(modalTitle).toHaveText(itemName);

    // Close via close button
    const closeBtn = page.locator('[data-modal-close]');
    await closeBtn.click();
    await expect(modalBackdrop).toBeHidden();
  });

  test('Interactive Pax & Pricing Calculator computes totals and updates WhatsApp link', async ({ page }) => {
    await page.goto('/#booking');

    const adultsInput = page.locator('[data-pax-adults]');
    const childrenInput = page.locator('[data-pax-children]');
    const totalDisplay = page.locator('[data-calc-total]');

    await expect(adultsInput).toHaveValue('4');
    await expect(childrenInput).toHaveValue('2');
    await expect(totalDisplay).toContainText('RM 111.40');

    // Increase adult count by clicking step +
    const adultPlus = page.locator('[data-step-adult="1"]');
    await adultPlus.click();
    await expect(adultsInput).toHaveValue('5');

    // Increase child count by clicking step +
    const childPlus = page.locator('[data-step-child="1"]');
    await childPlus.click();
    await expect(childrenInput).toHaveValue('3');

    // Total should be updated (5 * 19.90 + 3 * 15.90 = 99.50 + 47.70 = 147.20)
    await expect(totalDisplay).toContainText('RM 147.20');
  });

  test('Ambience toggle switches theme mode between dark and light', async ({ page }) => {
    await page.goto('/');

    const toggle = page.locator('[data-ambience-toggle]');
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dark');

    // Switch to Light Mode
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'light');
    await expect(toggle).toContainText('Cerah');

    // Switch back to Dark Mode
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dark');
    await expect(toggle).toContainText('Gelap');
  });

  test('Operator & Customer Guide page loads with zero errors', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/guide.html');
    await expect(page).toHaveTitle(/Panduan Operasi Restoran/);
    expect(consoleErrors).toHaveLength(0);

    const guideCards = page.locator('.guide-card');
    await expect(guideCards).toHaveCount(3);
  });
});
