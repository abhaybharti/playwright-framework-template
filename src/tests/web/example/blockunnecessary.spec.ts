import test from "@playwright/test";

/*
Blocking Unnecessary requests, can significantly speed up your tests
*/
test("Block Unnecessary Requests", async ({ page }) => {
  await page.route("**/analytics/**", (route) => route.abort());
});
