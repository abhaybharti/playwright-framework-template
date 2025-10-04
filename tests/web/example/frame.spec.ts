
import { test, expect } from "../../fixtures/customFixtures"

test("iframe", async ({ page }) => {
  await page.goto("http://rahulshettyacademy.com/AutomationPractice/");
  const framesPage = await page.frameLocator("#courses-iframe");
  framesPage.locator("li a[href*='lifetime-access]:visible").click();
  const textCheck = await framesPage.locator(".text h2").textContent();
  console.log(textCheck);
});

test("Test 2 : Operation on frame", async ({ web, browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("http://rahulshettyacademy.com/AutomationPractice/");
  const frameOne = await web.getFrame("iframe[name='courses-iframe']");
});
