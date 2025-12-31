import test from "@playwright/test"

test('Mouse Events Example Using Playwright', async ({ page }) => {

    //1. Navigate to URL
    await page.goto('https://the-internet.herokuapp.com/');

    //2. Simple left click on abtest link
    await page.locator("//a[@href='/abtest']").click();

    //3. Print URL
    await console.log(page.url());

    //4. Navigate to URL
    await page.goto('https://the-internet.herokuapp.com/');

    //5. Right click (context menu)
    await page.locator("//a[@href='/abtest']").click({ button: 'right' });

    //6. Close the context menu/prompt
    await page.mouse.click(0, 0);

    //7. Navigate to URL
    await page.goto('https://the-internet.herokuapp.com/');

    //8. Navigate to URL
    await page.goto('https://the-internet.herokuapp.com/');

    //9. Shift + Click
    await page.locator("//a[@href='/abtest'").click({ modifiers: ['Shift'] });

    await page.locator('#source').hover();
    await page.mouse.down();
    await page.mouse.move(500, 500);
    await page.mouse.up();

    // Move to specific coordinates (x, y)
    await page.mouse.move(100, 200);

    // Scroll down 500 pixels
    await page.mouse.wheel(0, 500);
})