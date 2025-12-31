import test from "@playwright/test";


test("iFrame example", async ({ page }) => {
    //1. Navigate to URL
    await page.goto("https://the-internet.herokuapp.com/iframe");

    //2. Locate the iframe
    const myFrame = await page.frameLocator(`//iframe[@id='mce_0_ifr']`);

    //3. Read element text from iframe
    const text = await myFrame.locator(`//p`).textContent();
    await console.log(text);
})