import test from '@playwright/test';
import {logInfo, logError, logWarn} from "../../../src/utils/report/Logger"

test('find multiple elements', async ({ page }) => {
    await page.goto('https://timesofindia.indiatimes.com/');
    const links = await page.locator('a');
    const links2 = await page.locator('a').all();
    console.log(links);
     console.log(links2);

    // 2. Get the number of links, waiting for them to appear
    const count = await links.count();

    // 3. Loop through them using nth()
    for (let i = 0; i < count; i++) {
        // For each link, Playwright finds it again and waits if necessary
        const linkText = await links.nth(i).textContent();
        logInfo(linkText);
           
    }
})
