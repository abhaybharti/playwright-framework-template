import test from "@playwright/test";

test("Take Screenshot of Page", async ({ page }) => {
  //Take screenshot of full page
  await page.screenshot({ path: "screenshot.png" });
});

test("Take Screenshot of Element", async ({ page }) => {
  //Take screenshot of an element
  await page.goto("http://xxx.com");
  await page.getByTestId("todo-item").screenshot({ path: "screenshot.png" });
});
