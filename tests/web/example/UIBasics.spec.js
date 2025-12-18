import { test } from "@playwright/test";

//In general terminology, fixture are global variable which are available across your project.

//What is context
//
test('Browser Context Playwright Test', async ({ browser, page }) => {
    //  write test step here

    //Opens a new & fresh instance of browser
    const context = await browser.newContext()
    const pageLocal = await context.newPage();
    await pageLocal.goto("https://sso.teachable.com/secure/9521/identity/login/otp")
    await pageLocal.close()
})

test('Page Playwrigth Test', async function ({ page }) {
    //write test step here using page fixtures
    await page.goto("https://google.co.in")
    await page.close()
})
