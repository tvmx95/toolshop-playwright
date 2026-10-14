import {test as base} from '@playwright/test';
import {HomePage} from '../pages/home.page';

type HomeFixtures = {homePage: HomePage};
export const test = base.extend<HomeFixtures>({
    homePage: async ({ page }, use, testInfo) => {
        console.log(`[SETUP] ${testInfo.title}`);
        // 1. เตรียมของให้พร้อม
        await page.goto('/');
        // 2. ส่งของให้ test และรอ test ทำงานจบ
        await use(new HomePage(page));
        // 3. กลับมาทำงานส่วนหลัง
        console.log(`[TEARDOWN] ${testInfo.title}`);
    }
})

export {expect} from "@playwright/test"