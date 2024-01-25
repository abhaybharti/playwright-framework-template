import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";
import { on } from "events";

switch (process.env.NODE_ENV) {
  case "local":
    dotenv.config({ path: "./environments/local.env" });
    break;
  case "dev":
    dotenv.config({ path: "./environments/local.env" });
    break;
  case "qa":
    dotenv.config({ path: "./environments/qa.env" });
    break;
  case "prod":
    dotenv.config({ path: "./environments/prod.env" });

    break;

  default:
    break;
}
export default defineConfig({
  testDir: "./src",
  timeout: 180 * 1000,
  expect: { timeout: 180 * 1000 },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    [`./src/utils/report/CustomReporterConfig.ts`],
    ["html", { open: "always", host: "127.0.0.1", port: 5723 }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    // {
    //   name: "chromium",
    //   use: { ...devices["Desktop Chrome"] },
    // },

    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    {
      name: "Microsoft Edge",
      use: {
        ...devices["Desktop Edge"],
        channel: "msedge",
        screenshot: "on",
        trace: "on",
        video: "on",
        headless: false,
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "Chrome",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        screenshot: "on",
        trace: "on",
        video: "on",
        headless: false,
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
