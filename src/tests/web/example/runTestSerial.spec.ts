import test from "@playwright/test";

//1st way to define test suite to run tests in sequence
test.describe.configure({ mode: "serial" });

//2nd way to define test suite to run tests in sequence
test.describe.serial("Run all test in serial", async () => {
  test("TestOne", async ({ page }) => {});

  test("TestTwo", async ({ page }) => {});

  test("TestThree", async ({ page }) => {});
});
