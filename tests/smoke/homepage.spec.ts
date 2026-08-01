import {test, expect} from '@playwright/test';

test.describe('Toolshop homepage',() => {
    test.beforeEach (async({page}) => {
        await page.goto('/')
            });
    test('should display the product listing page', async ({page}) => {
        await expect(page).toHaveTitle(/Practice Software Testing/i);

        await expect(page.getByTestId('product-name').first()).toBeVisible();    
    })
}) 
