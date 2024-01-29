import test from "@playwright/test";

test.describe.serial("Run all test in serial", async () => {
  test("TestOne", async ({ page }) => {});

  test("TestTwo", async ({ page }) => {});

  test("TestThree", async ({ page }) => {});
});
