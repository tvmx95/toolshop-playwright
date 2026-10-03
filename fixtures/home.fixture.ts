import {test as base} from '@playwright/test';
import {HomePage} from '../pages/home.page';

type HomeFixtures = {homePage: HomePage};
export const test = base.extend<HomeFixtures>({
    homePage: async ({page}, use) => {
        await page.goto('/');
        await use(new HomePage(page));
    }
})

export {expect} from "@playwright/test"