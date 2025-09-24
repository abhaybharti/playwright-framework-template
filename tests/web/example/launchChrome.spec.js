import { chromium, test } from "@playwright/test";

test('Launch Chrome', async () => {
    const browser = await chromium.launch({
        channel: 'chrome' //Use system installed chrome
        , headless: false //Show browser
    });

    const page = await browser.newPage();
    await page.goto('https://www.google.com');
    console.log(await page.title());
    await browser.close();
})