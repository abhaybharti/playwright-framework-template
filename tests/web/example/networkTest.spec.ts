import test from "@playwright/test";
import { ApiHelper } from "../../../helper/api/apiHelper";

let token: string;

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const apiContent = await context.newPage();
  const apiHelper = new ApiHelper(apiContent);

  //save token value returned from getToken() function in token variable
  token = await apiHelper.getToken();
});

test("Network Test -> Inject token generated through API into browser", async ({
  page,
}) => {
  //executed JavaScript to inject token into browser
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);

  //when script hits URL, browser will open as logged in using above generated  token
  await page.goto("https://www.xxxx.com");
});
