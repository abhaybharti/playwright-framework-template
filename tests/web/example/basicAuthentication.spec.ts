import { test, expect } from "@tests/fixtures/test-options";

test.use({
    baseURL: 'https://the-internet.herokuapp.com',
    httpCredentials: {
        username: 'admin',
        password: 'admin',
    }
})


test('Basic Authetication', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Basic Auth', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Basic Auth' })).toBeVisible()
})

test.only('Basic Authetication with Extra HTTP headers', async ({ page }) => {
    await page.goto('/')
    await page.setExtraHTTPHeaders({
        Authorization: 'Basic '+btoa('admin:admin')
    })
    await page.getByRole('link', { name: 'Basic Auth', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Basic Auth' })).toBeVisible()
})