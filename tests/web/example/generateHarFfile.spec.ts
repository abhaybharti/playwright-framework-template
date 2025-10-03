import { test, expect } from "../../fixtures/customFixtures"

test.describe('Sample UI test', () => {
    test('Capture network logs', { tag: '@network1' }, async ({ web }) => {
        await web.navigateToUrl('https://practicesoftwaretesting.com/')
        const locator = await web.findElement("xpath","//*[@src='assets/img/products/pliers01.avif']");
        if (locator) {
            await locator.click();
        }

        //To Do : Add more steps to
    })
})