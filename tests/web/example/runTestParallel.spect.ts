import test from "@playwright/test";

//1st way to set run tests in parallel
test.describe.configure({ mode: "parallel" });

//2nd way to set run tests in parallel
test.describe.parallel("Run All Tests in Parallel", async () => {
  test("TestOne", async ({ page }) => {});

  test("TestTwo", async ({ page }) => {});
});
