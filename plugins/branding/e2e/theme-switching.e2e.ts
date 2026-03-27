import { test, expect } from '@playwright/test';

/**
 * E2E tests for Task 14.5: Theme Switching Behavior
 * 
 * Validates Requirements: 1.4, 1.5, 13.7
 * 
 * These tests verify:
 * - Logo updates to match theme (light ↔ dark variants)
 * - No visual glitches during transition
 * - Theme persists after page reload
 */

test.describe('Theme Switching Behavior', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Headlamp
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should have both OpenCenter themes available', async ({ page }) => {
    // Navigate to Settings → Appearance
    await page.click('[aria-label="Settings"]');
    await page.click('text=Appearance');
    
    // Find theme selector
    const themeSelector = page.locator('select, [role="combobox"]').filter({ hasText: /theme/i }).first();
    
    // Verify both themes are available
    const options = await themeSelector.locator('option').allTextContents();
    expect(options).toContain('OpenCenter Cloud Day');
    expect(options).toContain('OpenCenter Abyssal Night');
  });

  test('should switch from Cloud Day to Abyssal Night and update logo', async ({ page }) => {
    // Navigate to Settings → Appearance
    await page.click('[aria-label="Settings"]');
    await page.click('text=Appearance');
    
    // Select Cloud Day theme
    await page.selectOption('select', { label: 'OpenCenter Cloud Day' });
    await page.waitForTimeout(500); // Wait for theme to apply
    
    // Verify light logo is displayed
    const logoBeforeSwitch = page.locator('img[alt="OpenCenter"]');
    const srcBefore = await logoBeforeSwitch.getAttribute('src');
    expect(srcBefore).toContain('logo.png');
    expect(srcBefore).not.toContain('logo_dark.png');
    
    // Switch to Abyssal Night
    await page.selectOption('select', { label: 'OpenCenter Abyssal Night' });
    await page.waitForTimeout(500); // Wait for theme to apply
    
    // Verify dark logo is displayed
    const logoAfterSwitch = page.locator('img[alt="OpenCenter"]');
    const srcAfter = await logoAfterSwitch.getAttribute('src');
    expect(srcAfter).toContain('logo_dark.png');
    
    // Verify logo is visible (not broken)
    await expect(logoAfterSwitch).toBeVisible();
  });

  test('should switch from Abyssal Night to Cloud Day and update logo', async ({ page }) => {
    // Navigate to Settings → Appearance
    await page.click('[aria-label="Settings"]');
    await page.click('text=Appearance');
    
    // Select Abyssal Night theme
    await page.selectOption('select', { label: 'OpenCenter Abyssal Night' });
    await page.waitForTimeout(500);
    
    // Verify dark logo
    const logoBeforeSwitch = page.locator('img[alt="OpenCenter"]');
    const srcBefore = await logoBeforeSwitch.getAttribute('src');
    expect(srcBefore).toContain('logo_dark.png');
    
    // Switch to Cloud Day
    await page.selectOption('select', { label: 'OpenCenter Cloud Day' });
    await page.waitForTimeout(500);
    
    // Verify light logo
    const logoAfterSwitch = page.locator('img[alt="OpenCenter"]');
    const srcAfter = await logoAfterSwitch.getAttribute('src');
    expect(srcAfter).toContain('logo.png');
    expect(srcAfter).not.toContain('logo_dark.png');
    
    // Verify logo is visible
    await expect(logoAfterSwitch).toBeVisible();
  });

  test('should handle multiple rapid theme switches without errors', async ({ page }) => {
    // Navigate to Settings → Appearance
    await page.click('[aria-label="Settings"]');
    await page.click('text=Appearance');
    
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Perform rapid theme switches
    for (let i = 0; i < 5; i++) {
      await page.selectOption('select', { label: 'OpenCenter Abyssal Night' });
      await page.waitForTimeout(100);
      await page.selectOption('select', { label: 'OpenCenter Cloud Day' });
      await page.waitForTimeout(100);
    }
    
    // Verify no console errors occurred
    expect(consoleErrors).toHaveLength(0);
    
    // Verify logo is still functional
    const logo = page.locator('img[alt="OpenCenter"]');
    await expect(logo).toBeVisible();
  });

  test('should persist Abyssal Night theme after page reload', async ({ page }) => {
    // Navigate to Settings → Appearance
    await page.click('[aria-label="Settings"]');
    await page.click('text=Appearance');
    
    // Select Abyssal Night theme
    await page.selectOption('select', { label: 'OpenCenter Abyssal Night' });
    await page.waitForTimeout(500);
    
    // Verify dark logo before reload
    const logoBeforeReload = page.locator('img[alt="OpenCenter"]');
    const srcBefore = await logoBeforeReload.getAttribute('src');
    expect(srcBefore).toContain('logo_dark.png');
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify dark logo persisted after reload
    const logoAfterReload = page.locator('img[alt="OpenCenter"]');
    const srcAfter = await logoAfterReload.getAttribute('src');
    expect(srcAfter).toContain('logo_dark.png');
    
    // Verify logo is visible
    await expect(logoAfterReload).toBeVisible();
  });

  test('should persist Cloud Day theme after page reload', async ({ page }) => {
    // Navigate to Settings → Appearance
    await page.click('[aria-label="Settings"]');
    await page.click('text=Appearance');
    
    // Select Cloud Day theme
    await page.selectOption('select', { label: 'OpenCenter Cloud Day' });
    await page.waitForTimeout(500);
    
    // Verify light logo before reload
    const logoBeforeReload = page.locator('img[alt="OpenCenter"]');
    const srcBefore = await logoBeforeReload.getAttribute('src');
    expect(srcBefore).toContain('logo.png');
    expect(srcBefore).not.toContain('logo_dark.png');
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify light logo persisted after reload
    const logoAfterReload = page.locator('img[alt="OpenCenter"]');
    const srcAfter = await logoAfterReload.getAttribute('src');
    expect(srcAfter).toContain('logo.png');
    expect(srcAfter).not.toContain('logo_dark.png');
    
    // Verify logo is visible
    await expect(logoAfterReload).toBeVisible();
  });

  test('should maintain theme consistency across page navigation', async ({ page }) => {
    // Navigate to Settings → Appearance
    await page.click('[aria-label="Settings"]');
    await page.click('text=Appearance');
    
    // Select Abyssal Night theme
    await page.selectOption('select', { label: 'OpenCenter Abyssal Night' });
    await page.waitForTimeout(500);
    
    // Navigate to home/cluster list
    await page.click('[aria-label="Home"]');
    await page.waitForTimeout(500);
    
    // Verify dark logo persists on different page
    const logo = page.locator('img[alt="OpenCenter"]');
    const src = await logo.getAttribute('src');
    expect(src).toContain('logo_dark.png');
    await expect(logo).toBeVisible();
  });

  test('should not show visual glitches during theme transition', async ({ page }) => {
    // Navigate to Settings → Appearance
    await page.click('[aria-label="Settings"]');
    await page.click('text=Appearance');
    
    // Take screenshot before switch
    await page.selectOption('select', { label: 'OpenCenter Cloud Day' });
    await page.waitForTimeout(500);
    
    // Switch theme and immediately check logo visibility
    await page.selectOption('select', { label: 'OpenCenter Abyssal Night' });
    
    // Logo should remain visible throughout transition (no flickering)
    const logo = page.locator('img[alt="OpenCenter"]');
    await expect(logo).toBeVisible();
    
    // Wait for transition to complete
    await page.waitForTimeout(500);
    
    // Verify logo is still visible and correct
    const src = await logo.getAttribute('src');
    expect(src).toContain('logo_dark.png');
    await expect(logo).toBeVisible();
  });
});
