import { test } from '../../fixtures/customFixtures'
import { testHar } from '../../fixtures/networkLogFixture'

test.describe('Sample UI test', async({web}) => {
    test('Capture network logs', { tag: '@network1' }, async ({ page }) => {
        await web.goto('https://practicesoftwaretesting.com/')
        // await page.goto('https://practicesoftwaretesting.com/');
        await page.locator("//*[@src='assets/img/products/pliers01.avif']").click();

        //To Do : Add more steps to
    })
})