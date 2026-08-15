import {test, expect} from '@playwright/test';
import {HomePage} from '../../pages/home.page'

test.describe('Toolshop homepage',() => {
    test.beforeEach (async({page}) => {
        await page.goto('/')
            });
    test('should display the product listing page', async ({page}) => {
        const homePage = new HomePage(page);

        await expect(homePage.productHeading).toBeVisible();
        await expect(homePage.productCards.first()).toBeVisible();
        await (homePage.searchInput.fill('pliers'));
    })
}) 
