import {type Locator, type Page} from '@playwright/test'

export class HomePage {
    readonly page: Page;
    readonly logoLink: Locator;
    readonly productCards: Locator;
    
    // Search
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    
    // Product
    readonly productNames: Locator;

    // Filter
    readonly handToolsFilter: Locator; 
    readonly screwdriverFilter: Locator;
    readonly MightyCraftHardwarebrandFilter: Locator;
    readonly ShowonlyecofriendlyproductsFilter: Locator;
    readonly ecoBadge: Locator;

    constructor(page: Page) {
        this.page = page;
        this.logoLink = page.getByRole('link', { 
            name: 'Practice Software Testing -' 
        });

        this.productCards = page.locator('a[data-test^="product-"]');
        this.ecoBadge = page.locator('[data-test="eco-badge"]');
        
        // Search
        this.searchInput = page.getByTestId('search-query');  
        this.searchButton = page.getByRole('button', {
            name: 'Search',
            exact: true,
        });

        // Product
        this.productNames = page.getByTestId('product-name');

        // Filter
        this.handToolsFilter = page.getByRole('checkbox', {
            name: 'Hand Tools',
            exact: true,
        });
        this.screwdriverFilter = page.getByRole('checkbox', {
            name: 'Screwdriver',
            exact: true,
        });
        this.MightyCraftHardwarebrandFilter = page.getByRole('checkbox', {
            name: 'MightyCraft Hardware',
            exact: true, 
        });
        this.ShowonlyecofriendlyproductsFilter = page.getByRole('checkbox', {
            name: 'Show only eco-friendly products',
            exact: true,
        });
    }
    // Method
        
        // Search
    async searchProduct(keyword: string): Promise<void> {
        await this.searchInput.fill(keyword);
        await this.searchButton.click();
    }

        // Filter
    async filterByHandTools(): Promise<void> {
        await this.handToolsFilter.check()
    }
    async filterByScrewdriver(): Promise<void> {
        await this.screwdriverFilter.check()
    }
    async filterByMightyCraftBrand(): Promise<void> {
        await this.MightyCraftHardwarebrandFilter.check()
    }
    async filterBySustainability(): Promise<void> {
        await this.ShowonlyecofriendlyproductsFilter.check()
    }        
}