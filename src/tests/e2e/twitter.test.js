const { test, expect } = require("@playwright/test");

test("Launch twitter and take screenshot", async ({ page }) => {
  await page.goto("https://x.com/i/flow/login");

  //Locate an element using a CSS selector
  await page.locator("button.summit").click();
});
