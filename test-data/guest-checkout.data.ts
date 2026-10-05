import type {BillingAddress, GuestInformation} from '../pages/checkout.page';
import {randomUUID} from 'node:crypto';

export function createGuestInformation(): GuestInformation {
    return {
        email: `guest-${randomUUID()}@example.com`,
        firstName: 'Test',
        lastName: 'User',
    };
};

export const billingAddress: BillingAddress = {
    country: 'Thailand',
    countryCode: 'TH',
    postalCode: '10110',
    houseNumber: '99',
    street: 'Sukhumvit Road',
    city: 'Bangkok',
    state: 'Bangkok',
};

export const productName = 'Combination Pliers';