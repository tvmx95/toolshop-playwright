import { test, expect } from '@playwright/test';

test('should display the login form', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByTestId('email')).toBeVisible();
    await expect(page.getByRole('button', {
        name: 'Login',
        exact: true
    })).toBeVisible();
});

test('should login successfully as customer', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByTestId('email').fill('customer@practicesoftwaretesting.com');
    await page.getByTestId('password').fill('welcome01');
    await page.getByRole('button', {
        name: 'Login',
        exact: true,
    }).click();

    await expect(page).toHaveURL(/\/account\/?$/);
});