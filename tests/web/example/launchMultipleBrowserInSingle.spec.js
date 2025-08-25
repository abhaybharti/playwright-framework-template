import { chromium, firefox, test } from '@playwright/test'

test('Launch Multiple Browser In Single Spec', async () => {
    const browser1 = await chromium.launch({
        channel: 'chrome' //Use system installed chrome
        , headless: false //Show browser
    });

    const browser2 = await firefox.launch({
        channel: 'firefox' //Use system installed chrome
        , headless: false //Show browser
    });

    const browser3 = await chromium.launch({
        channel: 'msedge' //Use system installed chrome
        , headless: false //Show browser
    });


    const page1 = browser1.newPage();
    const page2 = browser2.newPage();
    const page3 = browser3.newPage();

    await page1.goto('https://www.google.com');
    await page2.goto('https://www.google.com');
    await page3.goto('https://www.google.com');

    console.log(`Page 1 Title: await ${await page1.title()}`);
    console.log(`Page 2 Title: await ${await page2.title()}`);
    console.log(`Page 3 Title: await ${await page3.title()}`);

    await browser1.close();
    await browser2.close();
    await browser3.close();
});


test('Run Different Navigate Method', async () => {
    const browser = await chromium.launch({
        channel: 'chrome' //Use system installed chrome
        , headless: false //Show browser
    });

    const page = await browser.newPage();


    // 1. Navigate to a URL using page.goto()
    console.log('Navigating to first page: example.com');
    await page.goto('https://example.com');
    await page.waitForTimeout(2000); // Wait for 2 seconds to see the page

    // 2. Navigate to a second URL
    console.log('Navigating to second page: playwright.dev');
    await page.goto('https://playwright.dev');
    await page.waitForTimeout(2000);

    // 3. Go back in browser history using page.goBack()
    console.log('Going back to example.com');
    await page.goBack();
    await page.waitForTimeout(2000);

    // 4. Go forward in browser history using page.goForward()
    console.log('Going forward to playwright.dev');
    await page.goForward();
    await page.waitForTimeout(2000);

    // 5. Reload the current page using page.reload()
    console.log('Reloading the current page');
    await page.reload();
    await page.waitForTimeout(2000);

    // Close the browser
    await browser.close();
    console.log('Browser closed.');
});