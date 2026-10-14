import { test, expect } from '@playwright/test';

test('should access account using saved login state', async ({ page }) => {
    await page.goto('/account');
    await expect(page).toHaveURL(/\/account\/?$/);
    await expect(page.getByTestId('login-form')).toHaveCount(0);
});