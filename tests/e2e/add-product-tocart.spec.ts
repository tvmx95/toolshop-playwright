// import to typescript
import {test, expect} from '@playwright/test';
import {HomePage} from '../../pages/home.page';
import {ProductPage} from '../../pages/product.page';
import {CartPage} from '../../pages/cart.page';
import {CheckoutPage} from '../../pages/checkout.page';

test.describe('Add product to cart',() => {

    test('should complete purchase as guest', async ({page}) => {
        // create object to this tc
        const homePage = new HomePage(page);
        const productPage = new ProductPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page);

        // go to website
        await page.goto('/');
        // Search product
        await homePage.searchProduct('Combination Pliers')
        // Open PDP
        await homePage.openProduct('Combination Pliers')
        await expect(page).toHaveURL(/\/product\//);
        await expect(page.getByRole('heading', {
            name: 'Combination Pliers',
            exact: true,
        })).toBeVisible();
        // Add Product
        await expect(productPage.productTitle).toHaveText('Combination Pliers') 
        await productPage.addToCart();
        await expect(page.getByText(/Product added to shopping cart/i)).toBeVisible();
        
        // open cart
        await cartPage.openCart();
        await expect(page).toHaveURL(/\/checkout/);
        await expect(cartPage.productName('Combination Pliers')).toBeVisible();

        // check product at cart
        await expect(cartPage.productQuantity('Combination Pliers')).toHaveValue('1');
        await expect(cartPage.productPrice('Combination Pliers')).toHaveText('$14.15');
        await expect(cartPage.productTotal('Combination Pliers')).toHaveText('$14.15');

        // Increase product quantity
        await cartPage.updateProductQuantity(
            'Combination Pliers',
            2
        )
        await expect(cartPage.productQuantity('Combination Pliers')).toHaveValue('2');
        await expect(cartPage.productTotal('Combination Pliers')).toHaveText('$28.30');
        
        // Process to checkout
        await cartPage.proceedToCheckout();

        // Verify sign in step
        await expect(checkoutPage.signInTab).toBeVisible();
        await expect(checkoutPage.continueAsGuestTab).toBeVisible();

        //continue as guest
        await checkoutPage.selectContinueAsGuest();

        await expect(checkoutPage.guestHeading).toBeVisible();
        await expect(checkoutPage.emailInput).toBeVisible();
        await expect(checkoutPage.firstNameInput).toBeVisible();
        await expect(checkoutPage.lastNameInput).toBeVisible();
        await expect(checkoutPage.continueAsGuestButton).toBeVisible();
        
        // fill out guest infomation
        await checkoutPage.fillGuestInformation(
            'guest@example.com',
            'Test',
            'User'
        );
        // check information after fill out and go next
        await expect(checkoutPage.emailInput).toHaveValue('guest@example.com');
        await expect(checkoutPage.firstNameInput).toHaveValue('Test');
        await expect(checkoutPage.lastNameInput).toHaveValue('User');
        await checkoutPage.clickContinueAsGuest();

        await expect(checkoutPage.guestSummary).toBeVisible();
        await expect(checkoutPage.proceedToCheckoutButton).toBeVisible();

        await checkoutPage.proceedToCheckoutButtToNext();

        // Billing Address Section
        await expect(checkoutPage.billingHeading).toBeVisible();
        await checkoutPage.fillBillingAddress(
            'Thailand',
            '10110',
            '99',
            'Sukhumvit Road',
            'Bangkok',
            'Bangkok',
        )

        await expect(checkoutPage.countrySelect).toHaveValue('TH');
        await expect(checkoutPage.postalCodeInput).toHaveValue('10110');
        await expect(checkoutPage.houseNumberInput).toHaveValue('99');
        await expect(checkoutPage.streetInput).toHaveValue('Sukhumvit Road');
        await expect(checkoutPage.cityInput).toHaveValue('Bangkok');
        await expect(checkoutPage.stateInput).toHaveValue('Bangkok');
        await checkoutPage.proceedToCheckoutButtToNext();

        // ก่อนเลือก Payment Method
        await expect(checkoutPage.paymentHeading).toBeVisible();    
        await expect(checkoutPage.paymentMethodSelect).toHaveValue('');
        await expect(checkoutPage.confirmButton).toBeDisabled();
        // เลือก Payment Method
        await checkoutPage.selectPaymentMethod('Cash on Delivery');
        // หลังเลือก Payment Method
        await expect(checkoutPage.paymentMethodSelect).toHaveValue('cash-on-delivery');
        await expect(checkoutPage.confirmButton).toBeEnabled();
        await checkoutPage.confirmOrder()
        await expect(checkoutPage.paymentSuccessfulMgs).toContainText('Payment was successful')

        // Confirmation Section
        await checkoutPage.confirmOrder()
        await expect(checkoutPage.orderConfirmation).toContainText(/Thanks for your order! Your invoice number is INV-\d+\./)

    //ending of test case below    
    })
//ending of test suit below    
}) 