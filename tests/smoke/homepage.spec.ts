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

    test('should filter product by Hand Tools category', async ({page}) => {
        const homePage = new HomePage(page);

        await homePage.filterByHandTools();
        await expect(homePage.handToolsFilter).toBeChecked()
        await expect(homePage.productNames.first()).toBeVisible();
    })

    test('Should filter product by Screwdriver sub-category', async ({page}) =>{
        const homePage = new HomePage(page);

        await homePage.filterByScrewdriver();
        await expect(homePage.screwdriverFilter).toBeChecked();
        await expect(homePage.productNames.first()).toContainText(/Screwdriver/i);
    })
    test('Should filter product by Brand category', async ({page}) =>{
        const homePage = new HomePage(page);

        await homePage.filterByMightyCraftBrand();
        await expect(homePage.MightyCraftHardwarebrandFilter).toBeChecked();
        await expect(homePage.productNames.first()).toBeVisible();
    })
    test('Should filter product by Sustainability category', async ({page}) =>{
        const homePage = new HomePage(page);

        await homePage.filterBySustainability();
        await expect(homePage.ShowonlyecofriendlyproductsFilter).toBeChecked();
        await expect(homePage.productNames.first()).toContainText(/Wood Saw/i);
        await expect(homePage.ecoBadge.first()).toBeVisible();
    })
}) 
