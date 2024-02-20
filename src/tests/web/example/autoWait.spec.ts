import { test, expect, Request, Response } from "@playwright/test";

//Different wait available in Playwright
// 1. waitForTimeout -- Thread.sleep()

// 2. waitForRequest
test("test waitForRequest demo", async ({ page }) => {
  const request: Request = await page.waitForRequest(/ohrm_logo.png/);
  console.log(request.url());
});
// 3. waitForResponse
test("test waitForResponse demo", async ({ page }) => {
  const response: Response = await page.waitForResponse(/ohrm_logo.png/);
  console.log(response.request().url());
});

// 4. waitForUrl
// 5. waitForLoadState
// 6. waitForSelector

test("test waitForSelector demo", async ({ page }) => {
  //use below approach than using waitForSelector
  await expect(page.getByAltText("OrangeHRM")).toBeVisible({ timeout: 3_000 });
});
// 7. waitForFunction
test("test waitForFunction demo", async ({ page }) => {
  await page.waitForFunction(() => {
    window.scrollBy(0, 600);
  });
});

// 8. waitForEvent

test("test waitForEvent demo", async ({ page }) => {
  await page.waitForEvent("domcontentloaded");
});
