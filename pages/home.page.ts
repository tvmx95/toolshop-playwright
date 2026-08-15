import {expect, type Locator, type Page} from '@playwright/test'

export class HomePage {
    readonly page: Page;
    readonly productHeading: Locator;
    readonly productCards: Locator;
    readonly searchInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productHeading = page.getByRole('link', { name: 'Practice Software Testing -' })
        this.productCards = page.locator('a[data-test^="product-"]')
        this.searchInput = page.getByTestId('search-query')

    }
}