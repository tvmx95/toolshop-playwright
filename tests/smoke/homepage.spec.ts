import {test, expect} from '@playwright/test';
import {HomePage} from '../../pages/home.page'

test.describe('Toolshop homepage',() => {
    test.beforeEach (async({page}) => {
        await page.goto('/')
            });
    test('should display the product listing page', async ({page}) => {
        const homePage = new HomePage(page);

        await expect(homePage.logoLink).toBeVisible();
        await expect(homePage.productCards.first()).toBeVisible();
    })

    test('should search product by keyword', async ({page}) => {
        const homePage = new HomePage(page);

        await homePage.searchProduct('pliers');
        await expect(homePage.productNames.first()).toContainText(/pliers/i);
    })
}) 
