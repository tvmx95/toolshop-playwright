import { test, expect } from '@playwright/test';

const cookieName = 'isolation-demo';
const cookieUrl = 'https://example.com/';

for (const caseName of ['A', 'B']) {
    test(`Test ${caseName} has its own context`, async ({ page, context }) => {
        // page ของ test นี้อยู่ใน context ที่ได้รับ
        expect(page.context()).toBe(context);

        // ก่อนเพิ่ม ต้องไม่มี cookie ทดลองจาก test อื่น
        const before = await context.cookies(cookieUrl);

        expect(
            before.find(cookie => cookie.name === cookieName)
        ).toBeUndefined();

        // เพิ่ม cookie ชื่อเดียวกัน แต่ค่าต่างกันต่อ test
        await context.addCookies([
            {
                name: cookieName,
                value: caseName,
                url: cookieUrl,
            },
        ]);

        // ตรวจว่า context นี้เก็บค่าของ test ตัวเอง
        const after = await context.cookies(cookieUrl);

        expect(
            after.find(cookie => cookie.name === cookieName)?.value
        ).toBe(caseName);
    });
}