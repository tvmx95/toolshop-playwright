import {test, expect} from '../../fixtures/home.fixture';
import {searchCases} from '../../test-data/search-cases';

test.describe('Toolshop homepage',() => {
    test('should display the product listing page', async ({homePage}) => {
        await expect(homePage.logoLink).toBeVisible();
        await expect(homePage.productCards.first()).toBeVisible();
    })
    // user for loop to verify seaveral word but use only one code [data driven]
    for (const searchCase of searchCases) {
        test(`should search product: ${searchCase.keyword}`, async ({homePage}) => {
                await homePage.searchProduct(searchCase.keyword);
                await expect(homePage.productNames.first()).toContainText(searchCase.expectedProduct);
            }
        )
    }

    test('should filter product by Hand Tools category', async ({homePage}) => {
        await homePage.filterByHandTools();
        await expect(homePage.handToolsFilter).toBeChecked()
        await expect(homePage.productNames.first()).toBeVisible();
    })

    test('Should filter product by Screwdriver sub-category', async ({homePage}) =>{
        await homePage.filterByScrewdriver();
        await expect(homePage.screwdriverFilter).toBeChecked();
        await expect(homePage.productNames.first()).toContainText(/Screwdriver/i);
    })
    test('Should filter product by Brand category', async ({homePage}) =>{
        await homePage.filterByMightyCraftBrand();
        await expect(homePage.MightyCraftHardwarebrandFilter).toBeChecked();
        await expect(homePage.productNames.first()).toBeVisible();
    })
    test('Should filter product by Sustainability category', async ({homePage}) =>{
        await homePage.filterBySustainability();
        await expect(homePage.ShowonlyecofriendlyproductsFilter).toBeChecked();
        await expect(homePage.productCards.first()).toBeVisible();
        //await expect(homePage.productNames.first()).toContainText(/Wood Saw/i);
        await expect(homePage.ecoBadge.first()).toBeVisible();

        //const productCount = await homePage.productCards.count();
        //const ecoBadgeCount = await homePage.ecoBadge.count();
        //expect(ecoBadgeCount).toBe(productCount);
    })
}) 
