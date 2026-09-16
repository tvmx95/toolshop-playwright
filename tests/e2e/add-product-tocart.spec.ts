import {test, expect} from '@playwright/test';
import {HomePage} from '../../pages/home.page';
import {ProductPage} from '../../pages/product.page';

test.describe('Add product to cart',() => {

    test('should open product detail from search result', async ({page}) => {
        const homePage = new HomePage(page);
        const productPage = new ProductPage(page)
    
        await page.goto('/');
    
        await homePage.searchProduct('Combination Pliers')
        await homePage.openProduct('Combination Pliers')
        await expect(page).toHaveURL(/\/product\//);
        await expect(page.getByRole('heading', {
            name: 'Combination Pliers',
            exact: true,
        })).toBeVisible();

        await expect(productPage.productTitle).toHaveText('Combination Pliers') 
        await productPage.addToCart();
        await expect(page.getByText(/Product added to shopping cart/i)).toBeVisible();
    })

}) 