import { type Locator, type Page } from '@playwright/test';

export type BillingAddress = {
    country:string;
    countryCode:string;
    postalCode:string;
    houseNumber:string;
    street:string;
    city:string;
    state:string;
}

export type GuestInformation = {
    email: string,
    firstName: string,
    lastName: string
}

export class CheckoutPage {
    readonly page: Page;
    //Sign In
    readonly signInTab: Locator
    
    //Guest
    readonly continueAsGuestTab: Locator;
    readonly guestHeading: Locator;
    readonly emailInput: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly continueAsGuestButton: Locator;
    readonly guestSummary: Locator
    readonly proceedToCheckoutButton: Locator;
    
    //Billing Address section
    readonly billingHeading: Locator;
    readonly countrySelect: Locator;
    readonly postalCodeInput: Locator;
    readonly houseNumberInput: Locator;
    readonly streetInput: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;

    //Payment
    readonly paymentHeading: Locator;
    readonly paymentMethodSelect: Locator;
    readonly confirmButton: Locator;
    readonly paymentSuccessfulMessage: Locator;

    //Confrimation Order
    readonly orderConfirmation: Locator;

    constructor(page: Page) {
        this.page = page;
    //Sign In tab
        this.signInTab = page.getByRole('tab', {
            name: 'Sign in',
            exact: true
        })
    //Guest tab
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
        this.guestSummary = page.getByText(
            'Continuing as guest: Test User (guest@example.com)',
            { exact: true });

        this.proceedToCheckoutButton = page.getByRole('button', {
            name: 'Proceed to checkout',
            exact: true, 
        });

    //Billing Address section
        this.billingHeading = page.getByRole('heading', {
            name: 'Billing Address',
            exact: true,
        });

        this.countrySelect = page.getByRole('combobox',{
            name: 'Country',
            exact: true,
        });

        this.postalCodeInput = page.getByRole('textbox', {
            name: 'Postal code',
            exact: true,
        });

        this.houseNumberInput = page.getByRole('textbox', {
            name: 'House number',
            exact: true
        });

        this.streetInput = page.getByRole('textbox', {
            name: 'Street',
            exact: true
        });

        this.cityInput = page.getByRole('textbox', {
            name: 'City',
            exact: true
        });

        this.stateInput = page.getByRole('textbox', {
            name: 'State',
            exact: true
        });

    //Payment Section
        this.paymentHeading = page.getByRole('heading', {
            name: 'Payment',
            exact: true,
        })

        this.paymentMethodSelect = page.getByRole('combobox', {
            name: 'Payment Method',
            exact: true,
        })
        
        this.confirmButton = page.getByRole('button', {
            name: 'Confirm',
            exact: true,
        })

        this.paymentSuccessfulMessage = page.getByTestId('payment-success-message')

    // Order confirmation
        this.orderConfirmation = page.locator('#order-confirmation');

// v ending of constructor below       
    }

    async selectContinueAsGuest(): Promise<void> {
        await this.continueAsGuestTab.click();
    }
    async fillGuestInformation(guestInformation:GuestInformation): Promise<void> {
        await this.emailInput.fill(guestInformation.email);
        await this.firstNameInput.fill(guestInformation.firstName);
        await this.lastNameInput.fill(guestInformation.lastName);
    }

    async clickContinueAsGuest(): Promise<void> {
        await this.continueAsGuestButton.click();
    }
    async proceedToNextCheckoutStep(): Promise<void> {
    await this.proceedToCheckoutButton.click();
    }

    // get valua to fill out method
        // object fill out
    async fillBillingAddress(address: BillingAddress): Promise<void> {
        await this.countrySelect.selectOption({label:address.country});
        await this.postalCodeInput.fill(address.postalCode);
        await this.houseNumberInput.fill(address.houseNumber);
        await this.streetInput.fill(address.street);
        await this.cityInput.fill(address.city);
        await this.stateInput.fill(address.state);
    }

    async selectPaymentMethod(paymentMethod:string): Promise<void> {
        await this.paymentMethodSelect.selectOption({
            label: paymentMethod
        })
    }
    async confirmOrder(): Promise<void> {
        await this.confirmButton.click();
    }


//  ending of Class below   
}