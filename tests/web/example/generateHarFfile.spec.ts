// import { test } from '../../fixtures/test-options'
import {test} from "@tests/fixtures/test-options"

test.describe('Sample UI test', () => {
    test('Capture network logs', { tag: '@network1' }, async ({ page,web }) => {
        await web.navigateToUrl('https://practicesoftwaretesting.com/')
        // await page.goto('https://practicesoftwaretesting.com/');
        const locator = await web.findElement("xpath","//*[@src='assets/img/products/pliers01.avif']");
        if (locator) {
            await locator.click();
        }

        //To Do : Add more steps to
    })
})