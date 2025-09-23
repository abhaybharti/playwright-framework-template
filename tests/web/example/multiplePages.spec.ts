
import { chromium, test } from "@playwright/test";

// Define a test case named 'Multiple Browser Window'
test('Multiple Browser Window', async () => {

  // Launch the first browser instance Chromium
  const browserOne = await chromium.launch({ headless: false, args: ["--start-maximized"] });

  // Create a new browser context for the first browser 
  const contextOne = await browserOne.newContext();

  // Open a new page (tab) in the first browser context
  const pageOne = await contextOne.newPage();

  // Navigate the first page to Google
  await pageOne.goto('https://www.google.com');

  // Launch the second browser instance Chromium
  const browserTwo = await chromium.launch({ headless: false, args: ["--start-maximized"] });

  // Create a new browser context for the second browser
  const contextTwo = await browserTwo.newContext();

  // Open a new page (tab) in the second browser context
  const pageTwo = await contextTwo.newPage();

  // Navigate the second page to DEV.to
  await pageTwo.goto('https://dev.to/');

  // Bring the first browser window to the focus
  await pageOne.bringToFront();

  // Bring the second browser window to the focus
  await pageTwo.bringToFront();

  // Close the first browser 
  await browserOne.close();

  // Close the second browser
  await browserTwo.close();
});