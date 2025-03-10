import test from "@playwright/test";
import { Console, log } from "console";
import { WebHelper } from "../../../helper/web/webHelper";

test("iframe", async ({ page }) => {
  await page.goto("http://rahulshettyacademy.com/AutomationPractice/");
  const framesPage = await page.frameLocator("#courses-iframe");
  framesPage.locator("li a[href*='lifetime-access]:visible").click();
  const textCheck = await framesPage.locator(".text h2").textContent();
  console.log(textCheck);
});

test("Test 2 : Operation on frame", async ({ page, browser }) => {
  const context = await browser.newContext();
  const webHelper = new WebHelper(page, context);
  const frameOne = await webHelper.getFrame("iframe[name='courses-iframe']");
});
