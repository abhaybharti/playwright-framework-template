// example.spec.ts
// We import our custom 'test' object from the fixtures file.
// This is the key step to use the extended 'page' fixture.
import { test } from './fixtures'; 
import { expect } from '@playwright/test';
import { chromium, test } from "@playwright/test";

test('test', async () => {
    const browser = await chromium.launch({ headless: false }); // Adjust as needed
    const page = await browser.newPage();

    // Array to store failed API details
    const failedApis = [];

    // Add the response listener
    page.on('response', (response) => {
        const request = response.request();
        // Filter for API calls (XHR or fetch requests)
        if (['xhr', 'fetch'].includes(request.resourceType()) && response.status() !== 200) {
            failedApis.push({
                url: request.url(),
                method: request.method(),
                status: response.status(),
                // Optional: Add more details if needed, e.g., response.body() for content (but it's async)
            });
        }
    });

    // Your existing UI navigation and operations go here
    await page.goto('https://example.com'); // Example navigation
    await page.click('button#some-button'); // Example interaction
    // ... more actions ...

    // At the end of your script, handle the results (e.g., log or integrate into a report)
    if (failedApis.length > 0) {
        console.log('Failed APIs detected:', failedApis);
        // Optionally: Throw an error, write to a file, or add to a test result object
        // e.g., result.failedApis = failedApis;
    } else {
        console.log('All APIs succeeded (status 200).');
    }

    await browser.close();
});



// Use 'test' just like you would with the default Playwright test runner.
// The custom 'page' fixture is automatically provided.
test('should successfully load a page and report no API failures', async ({ page }) => {
  console.log('--- Test 1: Successful API calls ---');
  // Navigate to a test page. Any API calls will be monitored by the fixture.
  await page.goto('https://playwright.dev');

  // Perform some actions that might trigger API calls.
  // The fixture will silently monitor for non-200 responses in the background.
  await expect(page.locator('text=Docs')).toBeVisible();

  // At the end of the test, the logic in 'fixtures.ts' will run,
  // and since all API calls (on this page) were successful,
  // it will log 'All API calls for this test succeeded.'.
});

// A second test to demonstrate how the fixture captures a failed API call.
test('should capture and report a failed API response', async ({ page }) => {
  console.log('--- Test 2: Failed API calls ---');
  
  // Intercept and mock a specific API route to return a 404 status.
  // This simulates a failed backend call.
  await page.route('**/api/users/123', (route) => {
    route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'User not found' }),
    });
  });

  // Navigate to a page or perform an action that triggers the mocked API call.
  await page.goto('https://example.com');
  
  // Trigger a fetch request that will be intercepted and fail.
  await page.evaluate(async () => {
    await fetch('/api/users/123');
  });

  // There is no explicit assertion here because the custom fixture
  // handles the reporting and potential assertion for us at the end of the test.
  // When this test finishes, the logic in 'fixtures.ts' will log the 404 error.
});
