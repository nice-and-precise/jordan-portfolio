import { test, expect } from '@playwright/test';

test('Admin Login Page should load', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByRole('heading', { level: 1, name: 'Admin Access' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();
});
