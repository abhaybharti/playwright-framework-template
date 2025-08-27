test.describe('1 page multiple tests', () => {
    let page;
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        await page.goto('https://example.com');
    });

    test.afterAll(async ({ browser }) => {
        browser.close;
    });

    test('nav test', async () => {
        const name = await page.innerText('h1');
        expect(name).toContain('Example');
    });

    test('header test', async () => {
        const name = await page.innerText('h1');
        expect(name).toContain('Domain');
    });
});
