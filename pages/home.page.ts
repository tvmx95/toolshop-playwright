import {type Locator, type Page} from '@playwright/test'

export class HomePage {
    readonly page: Page;
    readonly logoLink: Locator;
    readonly productCards: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly productNames: Locator

    constructor(page: Page) {
        this.page = page;
        this.logoLink = page.getByRole(
            'link', { name: 'Practice Software Testing -' 
        });

        this.productCards = page.locator(
            'a[data-test^="product-"]'
        );

        this.searchInput = page.getByTestId(
            'search-query'
        );
            
        this.searchButton = page.getByRole('button', {
            name: 'Search',
            exact: true,
        });

        this.productNames = page.getByTestId(
            'product-name'
        );
    }
    async searchProduct(keyword: string): Promise<void> {
        await this.searchInput.fill(keyword);
        await this.searchButton.click();
    }
}