import { test as setup, expect } from '@playwright/test';

setup('authenticate customer', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByTestId('email').fill('customer@practicesoftwaretesting.com');
    await page.getByTestId('password').fill('welcome01');
    await page.getByRole('button', {
        name: 'Login',
        exact: true,
    }).click();

    await expect(page).toHaveURL(/\/account\/?$/);
    await page.context().storageState({
        path: 'playwright/.auth/customer.json',
    })
});