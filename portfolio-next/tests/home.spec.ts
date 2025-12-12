import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display the hero headline', async ({ page }) => {
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('should allow switching hero personas', async ({ page }) => {
        // Initial state (Aggressive)
        const badge = page.locator('text=Systems Architect > Corporate Bloat');
        // Note: Badge text might change based on logic, let's look for the badge container
        // or just the initial text if known. 
        // The code says: heroContent.badge.
        // aggressive: "Systems Architect > Corporate Bloat"

        // Just click the badge wrapper
        const badgeButton = page.locator('.inline-flex.items-center.gap-2.cursor-pointer');
        await expect(badgeButton).toBeVisible();
        await badgeButton.click();

        // Should switch to next persona (Empathetic)
        // Headline or subheadline should change. 
        // Empathetic headline: "Scale Without the Stress Fracture."
        await expect(page.getByText('Scale Without the Stress Fracture.')).toBeVisible();
    });

    test('should display selected engagements section', async ({ page }) => {
        // Scroll down to reveal
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await expect(page.getByText('Selected Engagements')).toBeVisible();
    });
});
