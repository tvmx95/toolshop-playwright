import {type Locator, type Page} from '@playwright/test'

export class ProductPage {
    readonly page: Page;
    readonly productTitle: Locator;
    readonly addToCartButton: Locator;


    constructor(page: Page) {
        this.page = page;

        this.productTitle = page.getByRole('heading', {
            level: 1,
        });
        this.addToCartButton = page.getByRole('button', {
            name: 'Add to cart',
            exact: true,
        });
    }
    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
    }
}