import {type Locator, type Page} from '@playwright/test'

export class CartPage {
    readonly page: Page;
    readonly cartLink: Locator;
    readonly proceedToCheckoutButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.cartLink = page.getByRole('link', {
            name: /cart/i,
        });
        
        this.proceedToCheckoutButton = page.getByRole('button', {
            name: 'Proceed to checkout',
            exact: true,
        });
    }
    //Method
    async openCart(): Promise<void> {
        await this.cartLink.click();
    }
    async proceedToCheckout(): Promise<void> {
        await this.proceedToCheckoutButton.click();
    }

// Dynamic Locator คือ locator รับค่ามา //

    // this product name method for check name on cart page -> can change no need to create new one
    productName(name: string): Locator {
        return this.page.getByText(name, {
            exact: true,
        })
    }
    // Method Locator byName for finding row product
    productRow(name: string): Locator {
        return this.page.getByRole('row').filter({hasText: name});
    }
// Cart columns: Item(0), Quantity(1), Price(2), Total(3)
    // Method Locator byName for Quantity
    productQuantity(name: string): Locator {
        return this.page.getByRole('spinbutton', {
            name: `Quantity for ${name}`,
            exact: true,
        })
    }
    // Method Locator byName for Price Total
    productPrice(name: string): Locator {
        return this.productRow(name)
            .getByRole('cell')
            .nth(2);
    }
    productTotal(name: string): Locator {
        return this.productRow(name)
            .getByRole('cell')
            .nth(3);    
    }
    async updateProductQuantity(
        name: string,
        quantity: number
    ):Promise<void> {
        const quantityInput = this.productQuantity(name);

        await quantityInput.fill(quantity.toString());
        await quantityInput.press('Tab');
    }

}