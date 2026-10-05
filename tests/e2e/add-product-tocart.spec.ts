// import to typescript
import {test, expect} from '@playwright/test';
import {HomePage} from '../../pages/home.page';
import {ProductPage} from '../../pages/product.page';
import {CartPage} from '../../pages/cart.page';
import {CheckoutPage} from '../../pages/checkout.page';
import {createGuestInformation, billingAddress, productName} from '../../test-data/guest-checkout.data';

test.describe('User can purchase product without registration',() => {

    test('should complete purchase as guest', async ({page}) => {
        // create  page object to this tc
        const homePage = new HomePage(page);
        const productPage = new ProductPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page); 
        const guestInformation = createGuestInformation();

        await test.step('Search and open product', async () => {
            // go to website
            await page.goto('/');
            // Search product
            await homePage.searchProduct(productName);
            // Open PDP
            await homePage.openProduct(productName);
            await expect(page).toHaveURL(/\/product\//);
            await expect(page.getByRole('heading', {
                name: productName,
                exact: true,
            })).toBeVisible(); 
        });

        await test.step('Add product to cart', async () => {
            await expect(productPage.productTitle).toHaveText(productName);
            await productPage.addToCart();
            await expect(page.getByText(/Product added to shopping cart/i)).toBeVisible();
        });
        
        await test.step('Open cart and update quantity', async () => {
            // open cart
            await cartPage.openCart();
            await expect(page).toHaveURL(/\/checkout/);
            await expect(cartPage.productName(productName)).toBeVisible();

            // check product at cart
            await expect(cartPage.productQuantity(productName)).toHaveValue('1');
            await expect(cartPage.productPrice(productName)).toHaveText('$14.15');
            await expect(cartPage.productTotal(productName)).toHaveText('$14.15');

            // Increase product quantity
            await cartPage.updateProductQuantity(
                productName,
                2
            )
            await expect(cartPage.productQuantity(productName)).toHaveValue('2');
            await expect(cartPage.productTotal(productName)).toHaveText('$28.30');
        });

        await test.step('Check out as guest', async () => {
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
        
            // fill out guest information
            await checkoutPage.fillGuestInformation(guestInformation);
            // check information after fill out and go next
            await expect(checkoutPage.emailInput).toHaveValue(guestInformation.email);
            await expect(checkoutPage.firstNameInput).toHaveValue(guestInformation.firstName);
            await expect(checkoutPage.lastNameInput).toHaveValue(guestInformation.lastName);
            await checkoutPage.clickContinueAsGuest();

            await expect(checkoutPage.guestSummary(guestInformation)).toBeVisible();
            await expect(checkoutPage.proceedToCheckoutButton).toBeVisible();

            await checkoutPage.proceedToNextCheckoutStep();
            await expect(checkoutPage.billingHeading).toBeVisible();
        });

        await test.step('Fill billing Address', async () => {
            // Billing Address Section
            await checkoutPage.fillBillingAddress(billingAddress);

            await expect(checkoutPage.countrySelect).toHaveValue(billingAddress.countryCode);
            await expect(checkoutPage.postalCodeInput).toHaveValue(billingAddress.postalCode);
            await expect(checkoutPage.houseNumberInput).toHaveValue(billingAddress.houseNumber);
            await expect(checkoutPage.streetInput).toHaveValue(billingAddress.street);
            await expect(checkoutPage.cityInput).toHaveValue(billingAddress.city);
            await expect(checkoutPage.stateInput).toHaveValue(billingAddress.state);
            await checkoutPage.proceedToNextCheckoutStep();
            await expect(checkoutPage.paymentHeading).toBeVisible();
        });

        await test.step('Select payment method and validate payment', async () => {
            // ก่อนเลือก Payment Method 
            await expect(checkoutPage.paymentMethodSelect).toHaveValue('');
            await expect(checkoutPage.checkPaymentButton).toBeDisabled();
            // เลือก Payment Method
            await checkoutPage.selectPaymentMethod('Cash on Delivery');
            // หลังเลือก Payment Method
            await expect(checkoutPage.paymentMethodSelect).toHaveValue('cash-on-delivery');
            await expect(checkoutPage.checkPaymentButton).toBeEnabled();
            await checkoutPage.checkPayment();
            await expect(checkoutPage.paymentSuccessfulMessage).toContainText('Payment was successful');
            await expect(checkoutPage.confirmButton).toBeEnabled();
        });

        await test.step('Confirm and verify invioce', async () => {
            // Confirmation Section
            await checkoutPage.confirmOrder()
            await expect(checkoutPage.orderConfirmation).toContainText(/Thanks for your order! Your invoice number is INV-\d+\./)
        });

    //ending of test case below    
    });
//ending of test suit below    
});