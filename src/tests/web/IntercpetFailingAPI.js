//Create a setup.ts File (Global Hook)
//Create a new file named setup.ts inside your tests/ folder (or any preferred directory). This file will extend Playwright’s test configuration.

import { test as base } from '@playwright/test';

// Extend Playwright's test object to include API monitoring in all tests
export const test = base.extend<{ page: any }>({
    page: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        // Listen to all network requests
        page.on('request', request => {
            console.log(`➡️ Request: ${request.method()} ${request.url()}`);
        });

        // Intercept API responses and check for failures
        page.on('response', async response => {
            if (!response.ok()) {
                console.error(`❌ Failed API Call: ${response.url()}`);
                console.error(`Status Code: ${response.status()}`);

                const request = response.request();
                const requestData = request.postData();
                const responseBody = await response.text();

                console.error(`📌 Request Data: ${requestData || 'No Body'}`);
                console.error(`📌 Response Body: ${responseBody || 'No Response Body'}`);
            }
        });

        await use(page); // Makes `page` available for all tests
        await page.close();
    }
});

export { expect } from '@playwright/test';


// Use the Extended Test in Your Spec Files
// Modify all your spec files (*.spec.ts) to import the extended test object from setup.ts instead of Playwright's default test.

// Example: tests/example.spec.ts

import { expect } from '../setup'; // Import from setup.ts

test.describe('UI Test Suite with API Monitoring', () => {
    test('Test Case 1 - Navigate to Homepage', async ({ page }) => {
        await page.goto('https://example.com');
        await page.click('button#submit');
        await page.waitForTimeout(2000);
    });

    test('Test Case 2 - Login Flow', async ({ page }) => {
        await page.goto('https://example.com/login');
        await page.fill('input[name="username"]', 'testUser');
        await page.fill('input[name="password"]', 'password123');
        await page.click('button#login');
        await page.waitForTimeout(2000);
    });
});


//Prompt 
//Write playwright script using typescript which should log all API requests failures across test files when UI test is running.