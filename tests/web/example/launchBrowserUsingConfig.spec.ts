// Import all browser types from the Playwright library
import { chromium, firefox, webkit, test } from "@playwright/test";

const browserType = 'msedge'; // <-- CHANGE THIS VALUE

test("Launch browser using config", async () => {
    let browser;
    // --- Browser Launch Logic ---
    // Use a switch statement to select and launch the correct browser
    switch (browserType) {
        case 'chrome':
            browser = await chromium.launch({
                headless: false
            });
            break;

        case 'msedge':
            browser = await chromium.launch({
                channel: 'msedge', // This is specific to chromium
                headless: false
            });
            break;
        case 'firefox':
            browser = await firefox.launch({
                headless: false
            });
            break;
        case 'webkit':
            browser = await webkit.launch({
                headless: false
            });
            break;

        default:
            // If the browserType is not recognized, throw an error
            throw new Error(`Invalid browser type specified: ${browserType}. Use 'chrome', 'msedge', 'firefox', or 'webkit'.`);
    }

    // The rest of the code works for any browser
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to a test page
    await page.goto('https://playwright.dev/');
    console.log(`${browserType} launched successfully and navigated to playwright.dev`);

    // Add a delay of 5 seconds so you can see the browser before it closes
    await page.waitForTimeout(5000); 
})


