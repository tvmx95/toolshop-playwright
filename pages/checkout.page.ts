import { type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    readonly signInTab: Locator
    readonly continueAsGuestTab: Locator;
    readonly guestHeading: Locator;
    readonly emailInput: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly continueAsGuestButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.signInTab = page.getByRole('tab', {
            name: 'Sign in',
            exact: true
        })

        this.continueAsGuestTab = page.getByRole('tab', {
            name: 'Continue as Guest',
            exact: true,
        });

        this.guestHeading = page.getByRole('heading', {
            name: 'Continue as Guest',
            exact: true,
        });

        this.emailInput = page.getByRole('textbox', {
            name: 'Email address *',
            exact: true,
        });

        this.firstNameInput = page.getByRole('textbox', {
            name: 'First name *',
            exact: true,
        });

        this.lastNameInput = page.getByRole('textbox', {
            name: 'Last name *',
            exact: true,
        });

        this.continueAsGuestButton = page.getByRole('button', {
            name: 'Continue as Guest',
            exact: true,
        });
    }

    async selectContinueAsGuest(): Promise<void> {
        await this.continueAsGuestTab.click();
    }
    async fillGuestInformation(
        email: string,
        firstName: string,
        lastName: string
    ): Promise<void> {
        await this.emailInput.fill(email);
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
    }

    async clickContinueAsGuest(): Promise<void> {
        await this.continueAsGuestButton.click();
    }    
}