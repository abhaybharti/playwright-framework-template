import { chromium, test, firefox } from "@playwright/test";

test('Launch Edge', async () => {
    const browser = await chromium.launch({
        channel: 'msedge' //Use system installed chrome
        , headless: false //Show browser
    });

    const page = await browser.newPage();
    await page.goto('https://www.google.com');
    console.log(await page.title());
    await browser.close();
});


test('Launch Firefox', async () => {
    // Launch the Firefox browser. 'headless: false' means we will see the browser UI.
    const firefoxBrowser = await firefox.launch({
        headless: false
    });

    // Create a new page (tab) in the Firefox browser
    const firefoxPage = await firefoxBrowser.newPage();

    // Navigate the page to a specific URL
    await firefoxPage.goto('https://playwright.dev/');
    console.log('Firefox launched successfully and navigated to playwright.dev');

    try {
        // Launch the WebKit browser.
        const webkitBrowser = await webkit.launch({
            headless: false
        });

        // Create a new page in the WebKit browser
        const webkitPage = await webkitBrowser.newPage();

        // Navigate the page to a specific URL
        await webkitPage.goto('https://webkit.org/');
        console.log('WebKit launched successfully and navigated to webkit.org');

        // To automatically close it, you would use: await webkitBrowser.close();

    } catch (error) {
        console.error('Failed to launch WebKit:', error);
    }
});