import test from "@playwright/test";

test(`Generate HAR file`, async ({ page: Page }, testInfo) => {
  // To record HAR file, use "update:true", below code will create a directory named har and
  //store all the har related files in it
  await Page.routeFromHAR("har/example.har", { update: true });

  /* The `await testInfo.attach(`HAR FILE`, { path: `../../../../har/example.har` });` line is
  attaching the generated HAR file to the test report. It allows the HAR file to be easily
  accessible and viewable alongside the test results. The `path` parameter specifies the location of
  the HAR file. */
  await testInfo.attach(`HAR FILE`, { path: `../../../../har/example.har` });
});
