import { test, expect } from "@tests/fixtures/test-options"

test.use({ baseURL: 'https://practicesoftwaretesting.com' })
test.describe('Mock the brand category', () => {

    test('Validate category with subcategoty', async ({ page, request }) => {
        // 1. Set up the Route: Intercept calls to the specific API endpoint
        await page.route('https://api.practicesoftwaretesting.com/categories/tree', async (route) => {
            const response = await route.fetch();
            const mockres = await request.get('http://localhost:3001/brands')
            const mockJson = await mockres.json()
            // 2. Fulfill the Route: Provide a fake JSON response
            await route.fulfill({ response: response, json: mockJson });
        })

        // 3. Navigate to the page that makes the API call
        await page.goto('/')
        await page.waitForTimeout(2000)
        // 4. Run the Test: Assert that the UI displays the mocked data
        await expect(page.getByRole('textbox', { name: 'Search' })).toBeVisible()
        await expect(page.getByRole('checkbox', { name: 'Hand Tools' })).not.toBeVisible()
    })

    test('Fetch Fake Product Price', async ({ page, request }) => {
        await page.route('**/api/products', async route => {
            // 1. Fetch the real response
            const response = await route.fetch();
            // 2. Get the JSON body
            const json = await response.json();

            // 3. Modify the data (e.g., add a new item or change a field)
            json.push({ id: 999, name: 'Fake Special Offer', price: 0.00 });

            // 4. Fulfill the route with the modified data
            await route.fulfill({
                // Use the original response object to keep status, headers, etc.
                response,
                // Override the body with the modified JSON
                json,
            });
        });

        await page.goto('/products');
        await expect(page.getByText('Fake Special Offer')).toBeVisible();
    })
})

