import { test, BrowserContext } from "@playwright/test";
import { WebHelper } from "../../../helper/web/webHelper.js";

let webContext: any;

/* The `test.beforeAll()` function is a hook provided by the Playwright test framework. It is used to
run a setup function before all the tests in a test file. In this hook, we will login into application and save login details in state.json file*/
test.beforeAll(
  "Login into web app through browser and save login detail in JSON",
  async ({ browser }) => {
    const browserContext = await browser.newContext();
    const webPage = await browserContext.newPage();
    const webHelper = new WebHelper(webPage, browserContext);
    webHelper.navigateToUrl("www.gmail.com");

    //write code to login in gmail

    await browserContext.storageState({ path: "state.json" });
    webContext = await browserContext.newContext({
      storageState: "state.json",
    });
    await webPage.close();
  }
);
/* The code you provided is a test case that logs into a web application using the saved login state. */
test("Login into web app using saved login state", async () => {
  const webPage = await webContext.newPage();

  const webHelper = new WebHelper(webPage, webContext);
  webHelper.navigateToUrl("www.gmail.com"); // Browser will open page using login details saved in test.beforeAll() step
});
