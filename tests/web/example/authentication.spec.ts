import { test } from '@playwright/test';

// Run tests in this describe block sequentially (serial). If one test fails,
// the remaining tests in the block are skipped.
test.describe.serial('Auth Flow', () => {
  // First test logs in and saves the authenticated browser context state
  // to a file (auth.json) for reuse in subsequent tests.
  test('Authenticate and save state', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://www.saucedemo.com/');

    // (Optional UI interaction) Focus/double-click area showing login hints
    await page.locator('[data-test="login-credentials"]').dblclick();

    // Enter username and password
    await page.locator('[data-test="username"]').click();
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="username"]').press('Tab');
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // Submit the form and wait for a post-login UI element to be visible
    await page.locator('[data-test="login-button"]').click();
    await page.locator("//*[@id='shopping_cart_container']").waitFor({ state: 'visible' });
    
    // Persist the authenticated state to a file so it can be reused
    // by other tests without logging in again.
    await page.context().storageState({ path: 'auth.json' });

    // Close the page
    await page.close();
  });

  // Apply the saved storage state to tests defined below this line
  test.use({ storageState: 'auth.json' });
  
  // Second test reuses the saved auth state to directly access an authenticated page
  test('Use saved State and login into saucedemo website', async ({ page }) => {
    // With storageState applied, user should already be logged in
    await page.goto('https://www.saucedemo.com/inventory.html');

    // Verify a logged-in UI element is present and visible
    await page.locator("//*[@id='shopping_cart_container']").waitFor({ state: 'visible' });
  });
})