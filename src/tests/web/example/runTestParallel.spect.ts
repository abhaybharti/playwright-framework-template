import test from "@playwright/test";

test.describe.parallel("Run All Tests in Parallel", async () => {
  test("TestOne", async ({ page }) => {});

  test("TestTwo", async ({ page }) => {});
});
